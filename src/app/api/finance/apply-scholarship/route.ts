import { NextResponse } from 'next/server';
import { financeService } from '@/lib/services/financeService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON payload' }, { status: 400 });
    }

    const { scholarshipId } = body || {};
    if (!scholarshipId) {
      return NextResponse.json({ error: 'MISSING_FIELD', message: 'scholarshipId is required' }, { status: 400 });
    }

    const studentId = gated.user!.id;

    const result = await financeService.applyScholarship(studentId, scholarshipId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
