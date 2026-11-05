import { NextResponse } from 'next/server';
import { notesService } from '@/lib/services/notesService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const batch = url.searchParams.get('batch') || undefined;
    const result = await notesService.getNotes(batch);
    const notes = (result.notes || []).map((n: any) => ({
      id: n.id,
      title: n.title,
      file_name: n.fileName || n.file_name || 'study_note.pdf',
      word_count: n.wordCount || Math.max(100, Math.round((n.fileSize || 2400) / 6)),
      created_at: n.createdAt || n.created_at || new Date().toISOString(),
      subject: n.subject,
      semester: n.semester,
      batch: n.batch,
      fileUrl: n.fileUrl,
    }));
    return NextResponse.json({ notes, count: notes.length });
  } catch (err: any) {
    return NextResponse.json({ notes: [], count: 0, error: err?.message }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const title = String(body.title || 'Study Note').trim();
    const subject = String(body.subject || 'General').trim();
    const batch = String(body.batch || 'CSE-2026').trim();
    const res = await notesService.uploadNote(title, subject, batch, gated.user?.email);
    return NextResponse.json({
      success: true,
      note: {
        id: res.note.id,
        title: res.note.title,
        file_name: res.note.fileName,
        word_count: typeof body.content === 'string' ? body.content.trim().split(/\s+/).length : 180,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create note', message: err?.message }, { status: 400 });
  }
}
