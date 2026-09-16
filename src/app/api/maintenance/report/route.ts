import { NextResponse } from 'next/server';
import { maintenanceService } from '@/lib/services/maintenanceService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { category, location, description, urgency } = await req.json();
    const validUrgency = ['Emergency', 'High', 'Normal', 'Low'].includes(urgency) ? urgency : 'Normal';
    const studentId = gated.user.id;
    const studentName = (gated.user as any).displayName || gated.user.email || 'Student';
    const result = await maintenanceService.reportTicket(studentId, studentName, category, location, description, validUrgency);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
