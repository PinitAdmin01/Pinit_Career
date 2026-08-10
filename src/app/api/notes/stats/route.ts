import { NextResponse } from 'next/server';
import { notesService } from '@/lib/services/notesService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function GET(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const url = new URL(req.url);
    const batch = url.searchParams.get('batch') || 'CSE-2026';
    const stats = await notesService.getNotes(batch);
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
