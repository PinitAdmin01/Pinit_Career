import { NextResponse } from 'next/server';
import { examsService } from '@/lib/services/examsService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { isPublished, studentId: bodyStudentId } = await req.json();
    const studentId = bodyStudentId || 'admin';
    const result = await examsService.publishResults(studentId, isPublished);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
