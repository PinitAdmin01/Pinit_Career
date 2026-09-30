import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import {
  validateTaskSubmissionEligibility,
  executeTicketCode,
} from '@/lib/internships/submission';
import type { InternshipTaskRow, InternshipEnrollmentRow } from '@/lib/internships/types';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

interface RouteContext {
  params: { taskId: string } | Promise<{ taskId: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    // Rate limit: 10 submissions per minute per student (C12 / T-16)
    const rl = checkRateLimit(`internship_submit_${userId}`, {
      limit: 10,
      windowMs: 60 * 1000,
    });
    if (!rl.allowed) {
      return fail(
        429,
        'RATE_LIMIT',
        `Submission rate limit reached. Please wait ${rl.resetSec}s before submitting again.`
      );
    }

    const resolvedParams = await Promise.resolve(context.params);
    const taskId = typeof resolvedParams?.taskId === 'string' ? resolvedParams.taskId.trim() : '';
    if (!taskId) {
      return fail(400, 'BAD_REQUEST', 'Missing taskId in submission path.');
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const code = typeof body.code === 'string' ? body.code : '';
    if (!code.trim()) {
      return fail(400, 'EMPTY_CODE', 'Submitted code cannot be empty.');
    }
    if (code.length > 20000) {
      return fail(400, 'CODE_TOO_LONG', 'Submitted code exceeds the maximum allowed length (20,000 characters).');
    }

    const admin = getSupabaseAdmin();

    // Load task (Explicit projection: NEVER select * from internship_tasks)
    const { data: rawTask, error: taskErr } = await admin
      .from('internship_tasks')
      .select('id, internship_enrollment_id, seq, language, starter_code, visible_tests, hidden_tests, sql_setup, status, attempts')
      .eq('id', taskId)
      .maybeSingle();

    if (taskErr || !rawTask) {
      return fail(404, 'TASK_NOT_FOUND', 'Internship ticket not found.');
    }
    const task = rawTask as unknown as Pick<
      InternshipTaskRow,
      | 'id'
      | 'internship_enrollment_id'
      | 'seq'
      | 'language'
      | 'starter_code'
      | 'visible_tests'
      | 'hidden_tests'
      | 'sql_setup'
      | 'status'
      | 'attempts'
    >;

    // Load parent enrollment
    const { data: rawEnrollment, error: enrollErr } = await admin
      .from('internship_enrollments')
      .select('id, student_id, status, due_at')
      .eq('id', task.internship_enrollment_id)
      .maybeSingle();

    if (enrollErr || !rawEnrollment) {
      return fail(404, 'ENROLLMENT_NOT_FOUND', 'Internship enrollment record not found.');
    }
    const enrollment = rawEnrollment as unknown as Pick<
      InternshipEnrollmentRow,
      'id' | 'student_id' | 'status' | 'due_at'
    >;

    // Validate submission eligibility
    const eligibility = validateTaskSubmissionEligibility({
      task,
      enrollment,
      studentId: userId,
    });

    if (!eligibility.ok) {
      // If past deadline, update enrollment status to expired
      if (eligibility.shouldExpire) {
        await admin
          .from('internship_enrollments')
          .update({ status: 'expired' })
          .eq('id', enrollment.id);
      }
      return fail(eligibility.status || 400, eligibility.error || 'INVALID_SUBMISSION', eligibility.message || 'Cannot submit ticket.');
    }

    // Execute tests against student code (visible + hidden tests)
    const execution = await executeTicketCode({
      language: task.language,
      code,
      visibleTests: task.visible_tests,
      hiddenTests: task.hidden_tests,
      sqlSetup: task.sql_setup,
    });

    const newAttempts = Number(task.attempts || 0) + 1;
    const nowIso = new Date().toISOString();

    // 1. Record submission in internship_submissions
    await admin.from('internship_submissions').insert({
      task_id: task.id,
      student_id: userId,
      code,
      passed: execution.passed,
      output: execution.output,
      ai_review: null,
      created_at: nowIso,
    });

    // 2. If passed, mark current task as passed and unlock the next task in order
    if (execution.passed) {
      await admin
        .from('internship_tasks')
        .update({
          status: 'passed',
          passed_at: nowIso,
          attempts: newAttempts,
        })
        .eq('id', task.id);

      // Find next task in order (seq = seq + 1)
      const { data: rawNextTask } = await admin
        .from('internship_tasks')
        .select('id, status')
        .eq('internship_enrollment_id', task.internship_enrollment_id)
        .eq('seq', Number(task.seq) + 1)
        .maybeSingle();

      const nextTask = rawNextTask as { id: string; status: string } | null;
      if (nextTask && nextTask.status === 'locked') {
        await admin
          .from('internship_tasks')
          .update({ status: 'open' })
          .eq('id', nextTask.id);
      }

      return NextResponse.json({
        ok: true,
        passed: true,
        output: execution.output,
        attempts: newAttempts,
        taskId: task.id,
      });
    }

    // If failed, update attempts count on task
    await admin
      .from('internship_tasks')
      .update({ attempts: newAttempts })
      .eq('id', task.id);

    return NextResponse.json({
      ok: true,
      passed: false,
      output: execution.output,
      attempts: newAttempts,
      taskId: task.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SUBMISSION_ERROR', message);
  }
}
