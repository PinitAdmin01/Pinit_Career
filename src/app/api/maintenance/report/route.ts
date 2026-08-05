import { NextResponse } from 'next/server';
import { maintenanceService } from '@/lib/services/maintenanceService';

export async function POST(req: Request) {
  try {
    const { category, location, description } = await req.json();
    const result = await maintenanceService.reportTicket(category, location, description);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
