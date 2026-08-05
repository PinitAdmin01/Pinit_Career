import { NextResponse } from 'next/server';
import { maintenanceService } from '@/lib/services/maintenanceService';

export async function GET(req: Request) {
  try {
    const stats = await maintenanceService.getTickets();
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
