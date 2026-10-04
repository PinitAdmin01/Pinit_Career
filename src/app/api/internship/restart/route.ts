import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import { generateCompanyProfile } from '@/lib/internships/companyProfile';
import { generateTier1Tasks } from '@/lib/internships/tier1Tickets';
import { taskToClient, enrollmentToClient } from '@/lib/internships/toClient';
import type { InternshipEnrollmentRow, InternshipTaskRow } from '@/lib/internships/types';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    // Rate limit: 2 restart requests per 10 minutes per student
    const rl = checkRateLimit(`internship_restart_${userId}`, {
      limit: 2,
      windowMs: 10 * 60 * 1000,
    });
    if (!rl.allowed) {
      return fail(
        429,
        'RATE_LIMIT',
        `Restart is rate-limited. Please wait ${rl.resetSec}s before trying again.`
      );
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId.trim() : '';

    const admin = getSupabaseAdmin();

    let query = admin
      .from('internship_enrollments')
      .select('id, student_id, crash_enrollment_id, tier, track, status, due_at, extended, restarts, company_profile')
      .eq('student_id', userId);

    if (enrollmentId) {
      query = query.eq('id', enrollmentId);
    } else {
      query = query.order('created_at', { ascending: false }).limit(1);
    }

    const { data: rawEnrollment, error: enrollErr } = await query.maybeSingle();

    if (enrollErr || !rawEnrollment) {
      return fail(404, 'ENROLLMENT_NOT_FOUND', 'Internship enrollment record not found.');
    }
    const enrollment = rawEnrollment as unknown as Pick<
      InternshipEnrollmentRow,
      | 'id'
      | 'student_id'
      | 'crash_enrollment_id'
      | 'tier'
      | 'track'
      | 'status'
      | 'due_at'
      | 'extended'
      | 'restarts'
      | 'company_profile'
    >;

    // 1. Only when expired (FR-T1-9 / T-18)
    const now = new Date();
    const isPastDeadline = Boolean(enrollment.due_at && now.getTime() > new Date(enrollment.due_at).getTime());
    const isExpired = enrollment.status === 'expired' || (isPastDeadline && enrollment.status !== 'completed');

    if (!isExpired) {
      return fail(
        400,
        'NOT_EXPIRED',
        'Restart is only allowed after an internship has expired.'
      );
    }

    // 2. Restart once only (FR-T1-9 / T-18)
    const currentRestarts = Number(enrollment.restarts || 0);
    if (currentRestarts >= 1) {
      return fail(
        400,
        'RESTART_LIMIT_REACHED',
        'You have already restarted this internship once. Restarts are strictly limited to one attempt.'
      );
    }

    // Set generating state and increment restarts count
    const nextRestarts = currentRestarts + 1;
    await admin
      .from('internship_enrollments')
      .update({
        status: 'generating',
        restarts: nextRestarts,
        updated_at: now.toISOString(),
      })
      .eq('id', enrollment.id);

    // Delete prior tasks (cascades to prior submissions)
    await admin
      .from('internship_tasks')
      .delete()
      .eq('internship_enrollment_id', enrollment.id);

    // Generate new fictional company profile & new 5 tickets
    const seed = `${userId}-restart-${Date.now()}`;
    const companyRes = await generateCompanyProfile({
      tier: enrollment.tier,
      seed,
    });

    if (!companyRes.ok) {
      await admin
        .from('internship_enrollments')
        .update({ status: 'generation_failed' })
        .eq('id', enrollment.id);

      return fail(
        500,
        'GENERATION_FAILED',
        'Failed to generate replacement internship company profile. Please try restarting again.'
      );
    }

    const newCompanyProfile = companyRes.profile;
    const taskLang = enrollment.track === 'web_fullstack' ? 'tsx' : 'python';

    const tasksGen = await generateTier1Tasks({
      companyProfile: newCompanyProfile,
      seed,
      track: enrollment.track,
      language: taskLang,
    });

    if (!tasksGen.ok) {
      await admin
        .from('internship_enrollments')
        .update({ status: 'generation_failed' })
        .eq('id', enrollment.id);

      return fail(
        500,
        'GENERATION_FAILED',
        'Failed to generate replacement internship tickets. Please try restarting again.'
      );
    }

    // Insert 5 new tasks: task 1 'open', tasks 2-5 'locked'
    const newTasksRows = tasksGen.tickets.map((t) => ({
      internship_enrollment_id: enrollment.id,
      seq: t.seq,
      week: 1,
      kind: t.kind,
      language: taskLang,
      title: t.task.title,
      brief: t.task.brief,
      starter_code: t.task.starter_code,
      visible_tests: t.task.visible_tests,
      hidden_tests: t.task.hidden_tests,
      reference_solution: t.task.reference_solution,
      sql_setup: t.task.sql_setup || null,
      skills: t.task.skills,
      status: t.seq === 1 ? 'open' : 'locked',
      attempts: 0,
      model: t.model,
    }));

    const { data: insertedTasks, error: tasksInsertErr } = await admin
      .from('internship_tasks')
      .insert(newTasksRows)
      .select('id, internship_enrollment_id, seq, week, kind, language, title, brief, starter_code, visible_tests, sql_setup, skills, status, attempts, passed_at, created_at');

    if (tasksInsertErr || !insertedTasks) {
      await admin
        .from('internship_enrollments')
        .update({ status: 'generation_failed' })
        .eq('id', enrollment.id);

      return fail(500, 'TASK_PERSISTENCE_FAILED', 'Failed to store newly generated internship tickets.');
    }

    // Set new 14-day deadline and active status
    const newDueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: updatedEnrollment } = await admin
      .from('internship_enrollments')
      .update({
        status: 'active',
        company_profile: newCompanyProfile,
        due_at: newDueDate,
        extended: false,
        final_report: null,
        final_report_check: null,
        updated_at: now.toISOString(),
      })
      .eq('id', enrollment.id)
      .select('*')
      .single();

    const clientEnrollment = enrollmentToClient((updatedEnrollment as InternshipEnrollmentRow) || {
      ...enrollment,
      status: 'active',
      company_profile: newCompanyProfile,
      due_at: newDueDate,
      extended: false,
      restarts: nextRestarts,
    });

    const clientTasks = (insertedTasks as InternshipTaskRow[]).map(taskToClient);

    return NextResponse.json({
      ok: true,
      status: 'active',
      enrollment: clientEnrollment,
      tasks: clientTasks,
      message: 'Your internship has been restarted with brand new company tickets and a fresh 14-day deadline.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'RESTART_ERROR', message);
  }
}
