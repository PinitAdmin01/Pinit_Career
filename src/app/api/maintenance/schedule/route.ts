import { NextResponse } from 'next/server';
import { maintenanceService } from '@/lib/services/maintenanceService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { ticketId, technician } = await req.json();
    const result = await maintenanceService.scheduleTicket(ticketId, technician);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
