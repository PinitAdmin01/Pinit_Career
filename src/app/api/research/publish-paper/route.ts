import { NextResponse } from 'next/server';
import { researchService } from '@/lib/services/researchService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const { title, authors, journal, status } = await req.json();
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const studentName = gated.user!.email || 'Student';

    const result = await researchService.publishPaper(studentId, studentName, title, authors, journal, status);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
