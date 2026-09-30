import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import { loadStudentCourse } from '@/lib/server/studentCourse';
import { checkInternshipEligibility } from '@/lib/internships/eligibility';
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

    // Rate limit: 1 start per student per 10 minutes (C12)
    const rl = checkRateLimit(`internship_start_${userId}`, {
      limit: 1,
      windowMs: 10 * 60 * 1000,
    });
    if (!rl.allowed) {
      return fail(
        429,
        'RATE_LIMIT',
        `Generation is rate-limited. Please wait ${rl.resetSec}s before starting again.`
      );
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const admin = getSupabaseAdmin();

    let enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId.trim() : '';

    if (!enrollmentId) {
      const { data: activeCrash } = await admin
        .from('user_crash_enrollments')
        .select('enrollment_id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      enrollmentId = (activeCrash as { enrollment_id?: string } | null)?.enrollment_id || '';
    }

    if (!enrollmentId) {
      return fail(400, 'ENROLLMENT_REQUIRED', 'Please select a course enrollment to start your internship.');
    }

    const studentCourse = await loadStudentCourse(admin, userId, enrollmentId);
    if (!studentCourse.ok) {
      return fail(studentCourse.status, studentCourse.error, studentCourse.message);
    }

    const { enrollment, plan } = studentCourse;

    // Check for an already active or generating internship
    const { data: existingActive } = await admin
      .from('internship_enrollments')
      .select('id, status')
      .eq('student_id', userId)
      .eq('crash_enrollment_id', enrollment.enrollmentId)
      .in('status', ['active', 'generating'])
      .maybeSingle();

    if (existingActive) {
      return fail(
        409,
        'ALREADY_ACTIVE',
        'You already have an active internship for this course enrollment.'
      );
    }

    // Eligibility check
    const eligibility = checkInternshipEligibility({
      enrollment,
      plan,
      track: enrollment.track,
      activeInternship: false,
    });

    if (!eligibility.ok) {
      return fail(403, eligibility.error, eligibility.message);
    }

    // 1. Insert new enrollment with 'generating' status
    const { data: insertedEnrollment, error: insertErr } = await admin
      .from('internship_enrollments')
      .insert({
        student_id: userId,
        crash_enrollment_id: enrollment.enrollmentId,
        tier: eligibility.tier,
        track: enrollment.track,
        status: 'generating',
      })
      .select()
      .single();

    if (insertErr || !insertedEnrollment) {
      return fail(500, 'ENROLLMENT_CREATE_FAILED', 'Could not initiate internship enrollment.');
    }

    const internshipId = (insertedEnrollment as { id: string }).id;
    const seed = `student-${userId}-${eligibility.tier}-${Date.now()}`;

    // 2. Generate fictional company profile
    const companyRes = await generateCompanyProfile({
      tier: eligibility.tier,
      seed,
    });

    if (!companyRes.ok) {
      await admin
        .from('internship_enrollments')
        .update({ status: 'generation_failed' })
        .eq('id', internshipId);

      return fail(
        500,
        'GENERATION_FAILED',
        'We could not prepare your internship right now. Please try again in a few minutes.'
      );
    }

    // 3. Generate tickets for Tier 1
    const ticketsRes = await generateTier1Tasks({
      companyProfile: companyRes.profile,
      seed,
    });

    if (!ticketsRes.ok) {
      await admin
        .from('internship_enrollments')
        .update({ status: 'generation_failed' })
        .eq('id', internshipId);

      return fail(
        500,
        'GENERATION_FAILED',
        'We could not prepare your internship right now. Please try again in a few minutes.'
      );
    }

    // 4. Insert all 5 tasks into internship_tasks
    const taskRows = ticketsRes.tickets.map((t, idx) => ({
      internship_enrollment_id: internshipId,
      seq: t.seq,
      week: 1,
      kind: t.kind,
      language: 'python' as const,
      title: t.task.title,
      brief: t.task.brief,
      starter_code: t.task.starter_code,
      visible_tests: t.task.visible_tests,
      hidden_tests: t.task.hidden_tests,
      reference_solution: t.task.reference_solution,
      sql_setup: t.task.sql_setup || null,
      skills: t.task.skills,
      status: idx === 0 ? ('open' as const) : ('locked' as const),
      attempts: 0,
      model: t.model,
      generation_meta: { seed: `${seed}-t${idx + 1}` },
    }));

    const { data: insertedTasks, error: tasksErr } = await admin
      .from('internship_tasks')
      .insert(taskRows)
      .select();

    if (tasksErr || !insertedTasks) {
      await admin
        .from('internship_enrollments')
        .update({ status: 'generation_failed' })
        .eq('id', internshipId);

      return fail(500, 'TASK_CREATE_FAILED', 'Could not save generated tickets.');
    }

    // 5. Update enrollment to active with 14-day deadline (FR-T1-1)
    const now = new Date();
    const dueAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const { data: activeEnrollment, error: updateErr } = await admin
      .from('internship_enrollments')
      .update({
        status: 'active',
        company_profile: companyRes.profile,
        started_at: now.toISOString(),
        due_at: dueAt.toISOString(),
      })
      .eq('id', internshipId)
      .select()
      .single();

    if (updateErr || !activeEnrollment) {
      return fail(500, 'ACTIVATION_FAILED', 'Could not activate internship.');
    }

    return NextResponse.json({
      ok: true,
      enrollment: enrollmentToClient(activeEnrollment as InternshipEnrollmentRow),
      tasks: (insertedTasks as InternshipTaskRow[]).map(taskToClient),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
