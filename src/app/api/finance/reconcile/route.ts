import { NextResponse } from 'next/server';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';
import { financeService } from '@/lib/services/financeService';

/**
 * Reconciles every student's fee installments against verified payments and returns a report with
 * their payment ids: a finance-office job, so admins only (it used to be open to any signed-in user).
 */
export async function GET(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

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
