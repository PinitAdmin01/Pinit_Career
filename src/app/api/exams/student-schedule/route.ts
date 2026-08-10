import { NextResponse } from 'next/server';
import { examsService } from '@/lib/services/examsService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const schedule = await examsService.getStudentSchedule();
    return NextResponse.json(schedule);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
