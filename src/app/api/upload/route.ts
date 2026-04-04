import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getVisaRules, buildAuditPrompt } from '@/lib/visa-rules';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ─── Document Text Extraction ───────────────────────────────────────

/**
 * Extract readable text from uploaded file bytes.
 * Supports: PDF, DOCX, TXT, CSV, images (via base64 encoding description).
 * Text is extracted client-side by the upload page and sent as metadata.
 * If no text is provided, the filename is used as audit context.
 */
function extractTextFromBuffer(buffer: Buffer, mimeType: string): string {
  // For plain text formats
  if (
    mimeType === 'text/plain' ||
    mimeType === 'text/csv' ||
    mimeType === 'application/json' ||
    mimeType === 'text/markdown'
  ) {
    return buffer.toString('utf8');
  }

  // For PDF/DOCX/images the file content is binary — we'll rely on the
  // upload page to send extracted text in the formData 'fileText' field.
  // Here we just return a description of the file.
  return `[Binary document: ${mimeType}. Content analysis requires text extraction.]`;
}

// ─── AI Audit Call ──────────────────────────────────────────────────

async function callAuditModel(prompt: string): Promise<Record<string, any>> {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    // Offline fallback — basic audit
    return {
      score: 50,
      passed: [],
      failed: [],
      warnings: ['AI audit unavailable — configure OPENROUTER_API_KEY for automated document review'],
      missing: [],
      summary: 'AI-powered document audit requires a configured OpenRouter API key. Documents saved for manual review.',
      verdict: 'CONDITIONAL',
    };
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Farrukh Consultancy Pro',
      },
      body: JSON.stringify({
        model: 'qwen/qwen-3.6-plus',
        messages: [
          { role: 'system', content: 'You are a strict visa document auditor. Respond ONLY with valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      throw new Error(`AI audit failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    // Parse JSON response
    try {
      return JSON.parse(content);
    } catch {
      // Sometimes the model wraps JSON in markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)```/);
      if (jsonMatch) return JSON.parse(jsonMatch[1].trim());
      throw new Error('Invalid JSON from AI model');
    }
  } catch (err) {
    return {
      score: 0,
      passed: [],
      failed: [],
      warnings: [`AI audit error: ${err instanceof Error ? err.message : 'Unknown'}`],
      missing: [],
      summary: 'AI audit failed. Document saved for manual review.',
      verdict: 'CONDITIONAL',
    };
  }
}

// ─── Upload Route Handler ───────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract fields
    const files = formData.getAll('files') as File[];
    const clientName = (formData.get('clientName') as string) || 'Anonymous';
    const visaType = (formData.get('visaType') as string) || '';
    const destination = (formData.get('destination') as string) || '';
    const fileTexts: string[] = formData.getAll('fileText') as string[];
    const auditRequested = formData.get('audit') === 'true';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Create per-client upload directory
    const uploadDir = path.join(
      process.cwd(), 'public', 'uploads',
      clientName.replace(/\s+/g, '_')
    );
    await mkdir(uploadDir, { recursive: true });

    const fileResults: Array<{
      name: string;
      size: number;
      type: string;
      path: string;
      audit?: Record<string, any>;
    }> = [];

    // ── Process each file ──
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());

      // Save file
      const filename = `${Date.now()}_${i}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      // ── AI Document Audit (if visa type provided and audit requested) ──
      let auditResult: Record<string, any> | undefined;
      if (auditRequested && visaType) {
        const rules = getVisaRules(`${destination} ${visaType}`);
        if (rules) {
          // Extract text: prefer pre-extracted text from form, or fallback to filename-based
          const extractedText = fileTexts[i]
            || extractTextFromBuffer(buffer, file.type)
            || `Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

          const prompt = buildAuditPrompt(rules, extractedText, file.name);
          auditResult = await callAuditModel(prompt);
        }
      }

      fileResults.push({
        name: file.name,
        size: file.size,
        type: file.type,
        path: `/uploads/${clientName.replace(/\s+/g, '_')}/${filename}`,
        ...(auditResult && { audit: auditResult }),
      });
    }

    // ── Overall batch audit ──
    let overallAudit: Record<string, any> | undefined;
    if (auditRequested && visaType) {
      const rules = getVisaRules(`${destination} ${visaType}`);
      if (rules) {
        const allTexts = fileTexts.join('\n\n---\n\n')
          || fileResults.map(f => `File: ${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join('\n');

        const batchPrompt = buildAuditPrompt(
          rules,
          allTexts,
          `${clientName} — ${files.length} document(s)`
        );
        overallAudit = await callAuditModel(batchPrompt);
      }
    }

    return NextResponse.json({
      status: 'success',
      message: `${files.length} file(s) uploaded and analyzed`,
      clientName,
      visaType,
      destination,
      files: fileResults,
      audit: overallAudit,
      auditCount: fileResults.filter(f => f.audit).length,
    });
  } catch (err) {
    console.error('[Upload/Audit] Error:', err);
    return NextResponse.json(
      { error: 'Upload failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
