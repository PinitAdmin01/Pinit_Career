import { NextResponse } from 'next/server';
import { notesService } from '@/lib/services/notesService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const title = file.name.replace(/\.[^/.]+$/, '') || 'Uploaded Note';
    const textContent = await file.text().catch(() => '');
    const wordCount = textContent.trim()
      ? textContent.trim().split(/\s+/).length
      : Math.max(50, Math.floor(file.size / 6));

    const uploaded = await notesService.uploadNote(
      title,
      String(formData.get('subject') || 'General'),
      String(formData.get('batch') || 'CSE-2026'),
      gated.user?.email
    );

    return NextResponse.json({
      success: true,
      note: {
        id: uploaded.note.id,
        title: uploaded.note.title,
        file_name: file.name,
        word_count: wordCount,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process note upload', message: err?.message }, { status: 400 });
  }
}
