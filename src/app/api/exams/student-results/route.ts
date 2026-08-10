import { NextResponse } from 'next/server';
import { examsService } from '@/lib/services/examsService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;

    const sheet = await examsService.getStudentResults(studentId);
    return NextResponse.json(sheet);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
