import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { financeService } from '@/lib/services/financeService';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const report = await financeService.reconcileFeePayments();
    return NextResponse.json(report);
  } catch (err: any) {
    console.error('[Finance Reconcile API] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return GET(req);
}
