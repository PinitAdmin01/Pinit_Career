import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { examsService } from '@/lib/services/examsService';

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user) {
      return gated.error || NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { examScheduleId } = body || {};

    if (!examScheduleId || typeof examScheduleId !== 'string') {
      return NextResponse.json({ error: 'INVALID_PAYLOAD', message: 'examScheduleId is required' }, { status: 400 });
    }

    const studentId = gated.user.id;
    const registerNumber = (gated.user as any).registerNumber;

    const hasAttempted = await examsService.checkExamAttempt(studentId, registerNumber, examScheduleId);
    const cooldown = await examsService.getExamCooldown(studentId, registerNumber, examScheduleId);

    if (cooldown.inCooldown) {
      return NextResponse.json({
        ok: true,
        inCooldown: true,
        hasAttempted,
        remainingHours: cooldown.remainingHours,
        lastAttemptTime: cooldown.lastAttemptTime,
        score: cooldown.score,
        passed: cooldown.passed,
        message: `Retake locked. Cooldown active for ${cooldown.remainingHours} hours.`
      }, { status: 429 });
    }

    return NextResponse.json({
      ok: true,
      inCooldown: false,
      hasAttempted,
      remainingHours: 0,
      score: cooldown.score,
      passed: cooldown.passed,
      message: 'Exam is available to take.'
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Cooldown check failed' }, { status: 500 });
  }
}
