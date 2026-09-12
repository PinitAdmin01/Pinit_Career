import { NextResponse } from 'next/server';
import { maintenanceService } from '@/lib/services/maintenanceService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { category, location, description, urgency } = await req.json();
    const validUrgency = ['Emergency', 'High', 'Normal', 'Low'].includes(urgency) ? urgency : 'Normal';
    const result = await maintenanceService.reportTicket(category, location, description, validUrgency);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
