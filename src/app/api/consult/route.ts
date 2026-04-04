import { NextRequest, NextResponse } from 'next/server';

// Model configuration for OpenRouter
const MODELS = {
  primary_1: 'qwen/qwen-3.6-plus',
  primary_2: 'deepseek-ai/deepseek-r1',
  primary_3: 'meta-llama/llama-3.3-70b-instruct',
  fallback: 'google/gemma-3-27b-it',
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Immigration knowledge base from skills
const IMMIGRATION_CONTEXT = `
Farrukh Consultancy - Immigration & Visa Experts. Lead Consultant: Farrukh Nadeem. +92 309 6136080. Lahore, Pakistan.

Services for Pakistani nationals:
1. AUSTRALIA: Subclass 600 (Visitor, AUD 190), Subclass 500 (Student, AUD 1600+OSHC), Subclass 189/190/491 (Skilled Migration, 65+ points), Subclass 482 (TSS Employer Sponsored, AUD 3115, TSMIT $70k), Subclass 309/100 (Partner, AUD 8850). GTE critical for student visas. Skills assessments: Engineers Australia, ACS, VETASSESS, TRA. Point test: Age (max 30pts for 25-32), English Superior (20pts), 8+ yrs exp (15pts), PhD (20pts). Forensic bank analysis: window dressing, circular trading, borrowed funds detection.

2. CANADA: Express Entry (FSW, CEC, FST), CRS scoring. Blue-Collar Work Permit via TSN/LMIA for 18+ trades. SOWP for spouses of TEER 2&3. Family travel modes: SOLO/SPOUSE/FAMILY. WES ECA preferred.

3. UK: Skilled Worker (£29,000-£41,700 threshold). Administrative Review for case errors. Pre-Action Protocol/Judicial Review for public law errors. R (MM (Lebanon)) v SSHD [2017] UKSC 10. 14-day PAP response deadline.

4. SCHENGEN: EUR 90 visa fee. Germany/France/Switzerland top choices. EUR 100/day financial requirement. Personal bank statement mandatory for many consulates. Employer/Company statement with NOC/leave letter. Ties analysis: Economic, Financial, Family, Emotional.

5. USA EB-2 NIW: Matter of Dhanasar 3-prong test: (1) Substantial Merit & National Importance (30%), (2) Well Positioned (35%), (3) Beneficial to Waive LC (35%). Score 85-95% = Very Strong. +5% for STEM PhD, 20+ pubs, high citations, grants, media.

6. GCC WORK PERMITS: UAE (MOL labour card), Saudi Arabia (Iqama/GOSI), Qatar (QID/MOPH). HEC-MOFA-Embassy attestation chain.

7. NZ Jobs: AEWV pathway via accredited employer. 3-6 months total timeline.

8. TURKEY: Types A(salary+bank) B(cash no bank) C(self-employed) D(family) E(non-standard). Four pillars: Identity, Financial, Professional, Travel.

FORENSIC FINANCIAL ANALYSIS: Window dressing (large deposits 60-90 days before application), Circular trading (same amount cycling 24-72hrs), Borrowed funds (spike then immediate drop), Undocumented income. FBR/ATL integration: Active filer positive, non-filer with large balance = RED FLAG.

DUAL DOCUMENT PROTOCOL: Client Report (professional, warm, no risk scores) + Internal Office Copy (forensic, red flags in pink). NEVER attribute work to AI - always "Farrukh Consultant".
`;

async function callModel(
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<{ model: string; result: string; latency: number; error?: string }> {
  const startTime = Date.now();
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Farrukh Consultancy Pro',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
      signal: AbortSignal.timeout(120000), // 2 min timeout
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Model ${model} failed (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'No response generated';
    const latency = Date.now() - startTime;

    return { model, result, latency };
  } catch (err) {
    const latency = Date.now() - startTime;
    return {
      model,
      result: '',
      latency,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      visaType,
      country,
      documents,
      question,
      additionalInfo,
    } = body;

    if (!question && !clientName) {
      return NextResponse.json(
        { error: 'Either "question" or "clientName" is required' },
        { status: 400 }
      );
    }

    // Build the system prompt with immigration context
    const systemPrompt = `
You are an expert immigration consultant working at FARRUKH CONSULTANCY, one of Pakistan's leading immigration firms. 
Your role is to analyze client cases and provide professional, accurate, and actionable immigration advice.

IMMIGRATION RULES AND KNOWLEDGE BASE:
${IMMIGRATION_CONTEXT}

RULES:
- Always respond as if you are from Farrukh Consultancy
- Never mention AI, automation, or language models
- Provide specific, actionable advice based on the country and visa type
- Include document checklists, cost estimates, processing timelines, and risk assessments
- Be professional but warm
- Flag any red flags or concerns in the client's case
- Reference current (2026) immigration rules and thresholds
- Format responses clearly with sections and bullet points
- Always include cost breakdowns and timelines where applicable
`.trim();

    // Build the user message
    let userMessage = '';
    if (question) {
      userMessage = `Client inquiry: ${question}`;
    }
    if (clientName) {
      userMessage = `
NEW CLIENT CASE ANALYSIS:

Client: ${clientName}
Visa Type: ${visaType || 'Not specified'}
Country: ${country || 'Not specified'}
${additionalInfo ? `Additional Information: ${additionalInfo}` : ''}
${documents ? `Uploaded Documents: ${documents.join(', ')}` : 'No documents uploaded yet'}

Please analyze this case and provide:
1. Case strength assessment (Strong/Moderate/Weak)
2. Required document checklist
3. Estimated processing timeline
4. Risk factors and red flags
5. Recommended strategy
6. Cost breakdown (visa fees + service fees)
7. Success probability percentage
`.trim();
    }

    // Fire all 3 models concurrently
    console.log(`[Farrukh AI] Running 3-model parallel analysis for: ${clientName || question}`);

    const [model1Result, model2Result, model3Result] = await Promise.allSettled([
      callModel(MODELS.primary_1, systemPrompt, userMessage),
      callModel(MODELS.primary_2, systemPrompt, userMessage),
      callModel(MODELS.primary_3, systemPrompt, userMessage),
    ]);

    const model1 = model1Result.status === 'fulfilled' ? model1Result.value : { model: MODELS.primary_1, result: '', latency: 0, error: model1Result.reason?.message || 'Unknown error' };
    const model2 = model2Result.status === 'fulfilled' ? model2Result.value : { model: MODELS.primary_2, result: '', latency: 0, error: model2Result.reason?.message || 'Unknown error' };
    const model3 = model3Result.status === 'fulfilled' ? model3Result.value : { model: MODELS.primary_3, result: '', latency: 0, error: model3Result.reason?.message || 'Unknown error' };

    const results = [model1, model2, model3];
    const failedModels: string[] = results.filter(r => r.error).map(r => r.model);

    // Auto-fallback: If any model failed, try Gemma 3
    const fallbackResults = await Promise.allSettled(
      failedModels.map(model => callModel(MODELS.fallback, systemPrompt, userMessage))
    );

    let finalResults: Array<Record<string, any>> = [...results];
    let fallbackIndex = 0;
    finalResults = finalResults.map(result => {
      if (result.error && fallbackIndex < fallbackResults.length) {
        const fb = fallbackResults[fallbackIndex];
        if (fb.status === 'fulfilled') {
          fallbackIndex++;
          return { ...fb.value, fallback_for: result.model };
        }
        fallbackIndex++;
        return result;
      }
      return result;
    });

    // Synthesize the best answer from successful models
    const successfulResponses = finalResults.filter(r => r.result);

    // If no AI responded, provide a fallback
    if (successfulResponses.length === 0) {
      return NextResponse.json({
        status: 'all_models_failed',
        message: 'Unable to connect to AI services. Please check your OPENROUTER_API_KEY.',
        clientName,
        visaType,
        country,
        fallback_advice: generateOfflineAdvice(clientName, visaType, country, documents),
      });
    }

    // Use the longest response as most comprehensive, or first successful
    const primaryAdvice = successfulResponses.reduce((best, current) =>
      current.result.length > best.result.length ? current : best
    );

    // Generate a consensus summary
    const consensus = synthesizeConsensus(finalResults, successfulResponses, clientName, visaType, country);

    return NextResponse.json({
      status: 'success',
      models_used: finalResults.map((r) => r.model),
      models_failed: failedModels,
      models_with_fallback: finalResults.filter((r) => r.fallback_for).map((r) => ({ fallback_for: r.fallback_for, used: r.model })),
      primary_advice: {
        model: primaryAdvice.model,
        content: primaryAdvice.result,
        latency_ms: primaryAdvice.latency,
      },
      consensus,
      all_responses: finalResults.map(r => ({
        model: r.model,
        content: r.result,
        latency_ms: r.latency,
        error: r.error,
        fallback_for: r.fallback_for,
      })),
      metadata: {
        clientName,
        visaType,
        country,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[Farrukh AI] Unexpected error:', err);
    return NextResponse.json(
      {
        status: 'error',
        message: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

function synthesizeConsensus(
  allResults: any[],
  successful: any[],
  _clientName: string,
  _visaType: string,
  _country: string
) {
  // Extract common themes
  const allAdvice = successful.map(r => r.result).join('\n---\n');
  const modelCount = successful.length;
  const successRate = `${successful.length}/${allResults.length}`;

  // Calculate average latency
  const avgLatency = Math.round(successful.reduce((sum, r) => sum + r.latency, 0) / Math.max(successful.length, 1));

  return {
    models_responded: modelCount,
    models_total: allResults.length,
    success_rate: successRate,
    average_latency_ms: avgLatency,
    primary_assessment: successful[0]?.result.substring(0, 500) || 'No response available',
    all_sources_available: allAdvice,
  };
}

function generateOfflineAdvice(_clientName: string, visaType: string, country: string, _documents: string[]) {
  const adviceMap: Record<string, string> = {
    'australia': 'For Australian visas, ensure GTE statement, financial capacity proof (AUD 5,000+ for visitor), skills assessment, health exam, and police clearance.',
    'canada': 'For Canada, CRS score determines Express Entry chances. Minimum 65 points for FSW. Get WES ECA, IELTS 6+, and proof of funds (CAD 13,757 for single applicant).',
    'uk': 'For UK Skilled Worker visa, you need a job offer from a licensed sponsor, salary £29,000-£41,700+, and English language proficiency (B1 level).',
    'usa': 'For USA EB-2 NIW, you must demonstrate substantial merit, national importance, and that waiving labor certification benefits the U.S.',
    'schengen': 'Schengen visa requires EUR 90 fee, travel insurance (EUR 30k+), proof of accommodation, EUR 100/day financial capacity, and strong ties to Pakistan.',
  };

  const searchKey = (country || visaType || '').toLowerCase();
  const matchedAdvice = Object.entries(adviceMap).find(([key]) =>
    searchKey.includes(key)
  );

  return (
    matchedAdvice?.[1] ||
    'Please provide more details about the visa type and country for specific advice. Common requirements include valid passport, English proficiency test, financial proof, and document attestation.'
  );
}
