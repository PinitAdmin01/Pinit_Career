import { NextResponse } from 'next/server';
import { maintenanceService } from '@/lib/services/maintenanceService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { category, location, description } = await req.json();
    const result = await maintenanceService.reportTicket(category, location, description);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
