import { NextResponse } from 'next/server';
import { examsService } from '@/lib/services/examsService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Exam ID parameter is required' }, { status: 400 });
    }

    const isAdmin = ['admin', 'superadmin', 'teacher', 'staff'].includes((gated.user as any)?.role || '');
    const exam = await examsService.getExamById(id, { sanitized: !isAdmin });
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
