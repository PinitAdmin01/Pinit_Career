import { NextResponse } from 'next/server';
import { examsService } from '@/lib/services/examsService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const body = await req.json().catch(() => ({}));
    const studentId = typeof body?.studentId === 'string' ? body.studentId.trim() : '';
    if (!studentId) {
      return NextResponse.json({ error: 'Valid studentId is required' }, { status: 400 });
    }

    const isPublished = Boolean(body?.isPublished);
    const result = await examsService.publishResults(studentId, isPublished);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
