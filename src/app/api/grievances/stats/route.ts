import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const role = (gated.user as any).role || gated.user!.user_metadata?.role || 'student';
    const isStaff = role === 'admin' || role === 'teacher' || role === 'faculty';
    const studentName = gated.user!.user_metadata?.display_name ||
      gated.user!.user_metadata?.full_name ||
      gated.user!.email?.split('@')[0] ||
      'Student';

    const stats = await grievancesService.getStats(studentId, studentName, isStaff);
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
