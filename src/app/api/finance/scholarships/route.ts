import { NextResponse } from 'next/server';
import { financeService } from '@/lib/services/financeService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const scholarships = await financeService.getScholarships();
    return NextResponse.json(scholarships);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
