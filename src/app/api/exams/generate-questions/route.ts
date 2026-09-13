import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { examsService } from '@/lib/services/examsService';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

/**
 * POST /api/exams/generate-questions
 * DEF-081 Fix: Wires checkExamAttempt directly into exam question generation pipeline.
 * Enforces cooldown & retake verification before generating exam question papers.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`exam_gen_${ip}`, { limit: 20, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many question generation requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user) {
      return gated.error || NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { examScheduleId, subjectCode } = body || {};

    if (!examScheduleId || typeof examScheduleId !== 'string') {
      return NextResponse.json({ error: 'INVALID_PAYLOAD', message: 'examScheduleId is required' }, { status: 400 });
    }

    const studentId = gated.user.id;
    const registerNumber = (gated.user as any).registerNumber;

    // DEF-081: Check previous attempts & active cooldown
    const hasAttempted = await examsService.checkExamAttempt(studentId, registerNumber, examScheduleId);
    const cooldown = await examsService.getExamCooldown(studentId, registerNumber, examScheduleId);

    if (cooldown.inCooldown) {
      return NextResponse.json({
        ok: false,
        error: 'EXAM_COOLDOWN_ACTIVE',
        hasAttempted,
        remainingHours: cooldown.remainingHours,
        lastAttemptTime: cooldown.lastAttemptTime,
        message: `Retake locked. Mandatory cooldown active for ${cooldown.remainingHours} hours.`
      }, { status: 429 });
    }

    // Retrieve exam schedule metadata
    const scheduleRes = await examsService.getStudentSchedule();
    const schedule = (scheduleRes?.schedule as any[])?.find((s: any) => s.id === examScheduleId);

    return NextResponse.json({
      ok: true,
      hasAttempted,
      examScheduleId,
      subjectCode: subjectCode || schedule?.code || 'GEN-EXAM',
      subjectName: schedule?.course || schedule?.subject || 'Proctored Examination',
      allowedDurationMinutes: 45,
      totalQuestions: 20,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Failed to generate exam questions' }, { status: 500 });
  }
}
