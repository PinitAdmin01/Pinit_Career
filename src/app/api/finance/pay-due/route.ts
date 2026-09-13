import { NextResponse } from 'next/server';
import { financeService } from '@/lib/services/financeService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';

const PayDueSchema = z.object({
  installmentId: z.string().min(1, 'installmentId is required'),
});

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

    const { data, error } = validateBody(PayDueSchema, body);
    if (error) return error;

    const { installmentId } = data;

    const studentId = gated.user!.id;
    const studentName = gated.user!.email || 'Student';

    const result = await financeService.payDue(studentId, studentName, installmentId, gated.user!.email);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
