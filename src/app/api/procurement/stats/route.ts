import { NextResponse } from 'next/server';
import { procurementService } from '@/lib/services/procurementService';

export async function GET(req: Request) {
  try {
    const data = await procurementService.getStats();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
