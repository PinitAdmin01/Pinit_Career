import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const user = gated.user as any;
    const studentId = user.id;
    const role = user.role || user.user_metadata?.role || 'student';
    const isStaff = role === 'admin' || role === 'teacher' || role === 'faculty';
    const studentName = user.user_metadata?.display_name ||
      user.user_metadata?.full_name ||
      user.email?.split('@')[0] ||
      'Student';

    const stats = await grievancesService.getStats(studentId, studentName, isStaff);
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
