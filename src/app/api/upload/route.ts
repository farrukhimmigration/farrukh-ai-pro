import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const clientName = formData.get('clientName') as string;
    const caseType = formData.get('caseType') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', clientName || 'anonymous');
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles: Array<{ name: string; size: number; path: string; type: string }> = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      uploadedFiles.push({
        name: file.name,
        size: file.size,
        path: `/uploads/${clientName || 'anonymous'}/${filename}`,
        type: file.type,
      });
    }

    return NextResponse.json({
      status: 'success',
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      clientName,
      caseType,
      files: uploadedFiles,
    });
  } catch (err) {
    console.error('[Upload] Error:', err);
    return NextResponse.json(
      { error: 'Upload failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
