import { NextResponse } from 'next/server';
import { notesService } from '@/lib/services/notesService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';

const NotesStatsSchema = z.object({
  batch: z.string().min(1).max(50).optional().default('CSE-2026'),
});

export async function GET(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const url = new URL(req.url);
    const rawBatch = url.searchParams.get('batch') || undefined;
    const { data, error } = validateBody(NotesStatsSchema, { batch: rawBatch });
    if (error) return error;

    const stats = await notesService.getNotes(data.batch);
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
