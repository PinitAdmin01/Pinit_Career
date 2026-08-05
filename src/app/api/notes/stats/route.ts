import { NextResponse } from 'next/server';
import { notesService } from '@/lib/services/notesService';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const batch = url.searchParams.get('batch') || 'CSE-2026';
    const stats = await notesService.getNotes(batch);
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
