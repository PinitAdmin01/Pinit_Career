import { NextResponse } from 'next/server';
import { financeService } from '@/lib/services/financeService';

export async function GET(req: Request) {
  try {
    const stats = await financeService.getAdminStats();
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
