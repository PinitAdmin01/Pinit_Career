import { NextResponse } from 'next/server';
import { advisorService } from '@/lib/services/advisorService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;

    const performance = await advisorService.getPerformance(studentId);
    return NextResponse.json(performance);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
