import { NextResponse } from 'next/server';
import { financeService } from '@/lib/services/financeService';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';

/**
 * Applies a scholarship waiver to a student's fees. A waiver lowers what the student owes, so it
 * is granted by the finance office (admin), never by the student to themselves: students used to
 * be able to apply any scholarship (up to ₹15,000) to their own dues with no eligibility check.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) {
      if (gated.error.status === 403) {
        return NextResponse.json(
          { ok: false, error: 'FINANCE_OFFICE_ONLY', message: 'Scholarships are awarded by the finance office. Please contact them to apply.' },
          { status: 403 }
        );
      }
      return gated.error;
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON payload' }, { status: 400 });
    }

    const { scholarshipId, studentId } = body || {};
    if (!scholarshipId || typeof studentId !== 'string' || !studentId.trim()) {
      return NextResponse.json({ error: 'MISSING_FIELD', message: 'studentId and scholarshipId are required' }, { status: 400 });
    }

    const result = await financeService.applyScholarship(studentId.trim(), scholarshipId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
