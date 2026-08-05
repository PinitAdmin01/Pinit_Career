import { NextResponse } from 'next/server';
import { financeService } from '@/lib/services/financeService';

export async function GET(req: Request) {
  try {
    const scholarships = await financeService.getScholarships();
    return NextResponse.json(scholarships);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
