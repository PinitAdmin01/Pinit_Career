import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import {
  validateReportLength,
  checkReportRelevance,
} from '@/lib/internships/finalReport';
import type { InternshipEnrollmentRow, InternshipTaskRow } from '@/lib/internships/types';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    // Rate limit: 5 report submissions per minute per student
    const rl = checkRateLimit(`internship_report_${userId}`, {
      limit: 5,
      windowMs: 60 * 1000,
    });
    if (!rl.allowed) {
      return fail(
        429,
        'RATE_LIMIT',
        `Report submission rate limit reached. Please wait ${rl.resetSec}s before trying again.`
      );
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const reportText = typeof body.report === 'string' ? body.report.trim() : '';
    let enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId.trim() : '';

    const admin = getSupabaseAdmin();

    // 1. Locate student's active internship enrollment
    let enrollmentQuery = admin
      .from('internship_enrollments')
      .select('id, student_id, status, due_at, company_profile')
      .eq('student_id', userId);

    if (enrollmentId) {
      enrollmentQuery = enrollmentQuery.eq('id', enrollmentId);
    } else {
      enrollmentQuery = enrollmentQuery.in('status', ['active', 'completed']).order('created_at', { ascending: false }).limit(1);
    }

    const { data: rawEnrollment, error: enrollErr } = await enrollmentQuery.maybeSingle();

    if (enrollErr || !rawEnrollment) {
      return fail(404, 'ENROLLMENT_NOT_FOUND', 'Active internship enrollment not found.');
    }
    const enrollment = rawEnrollment as unknown as Pick<
      InternshipEnrollmentRow,
      'id' | 'student_id' | 'status' | 'due_at' | 'company_profile'
    >;

    if (enrollment.status === 'expired') {
      return fail(403, 'INTERNSHIP_EXPIRED', 'This internship has expired. Please restart to continue.');
    }

    // 2. Verify that ALL 5 tickets have status === 'passed'
    const { data: rawTasks, error: tasksErr } = await admin
      .from('internship_tasks')
      .select('id, seq, title, brief, status')
      .eq('internship_enrollment_id', enrollment.id)
      .order('seq', { ascending: true });

    if (tasksErr || !rawTasks || rawTasks.length < 5) {
      return fail(
        400,
        'TICKETS_INCOMPLETE',
        'All 5 internship tickets must be completed and passed before submitting the final report.'
      );
    }

    const tasks = rawTasks as unknown as Array<
      Pick<InternshipTaskRow, 'id' | 'seq' | 'title' | 'brief' | 'status'>
    >;

    const passedCount = tasks.filter((t) => t.status === 'passed').length;
    if (passedCount < 5) {
      return fail(
        400,
        'TICKETS_INCOMPLETE',
        `You have completed ${passedCount} of 5 tickets. All 5 tickets must pass before submitting your final report.`
      );
    }

    // 3. Word count check (100 - 300 words)
    const lengthCheck = validateReportLength(reportText);
    if (!lengthCheck.ok) {
      return fail(400, 'INVALID_LENGTH', lengthCheck.message || 'Report must be between 100 and 300 words.');
    }

    // 4. AI relevance check
    const companyProfile = enrollment.company_profile as { name?: string } | null;
    const companyName = companyProfile?.name || 'Fictional Tech Company';

    const relevance = await checkReportRelevance({
      companyName,
      tickets: tasks.map((t) => ({ title: t.title, brief: t.brief })),
      report: reportText,
    });

    if (!relevance.matches) {
      // Store the attempt and return error so student can refine
      await admin
        .from('internship_enrollments')
        .update({
          final_report_check: {
            matches: false,
            reason: relevance.reason,
            checked_at: new Date().toISOString(),
          },
        })
        .eq('id', enrollment.id);

      return NextResponse.json({
        ok: false,
        error: 'REPORT_NOT_RELEVANT',
        matches: false,
        reason: relevance.reason,
        wordCount: lengthCheck.wordCount,
      }, { status: 400 });
    }

    // 5. Success: store final report and positive check
    await admin
      .from('internship_enrollments')
      .update({
        final_report: reportText,
        final_report_check: {
          matches: true,
          reason: relevance.reason,
          checked_at: new Date().toISOString(),
        },
      })
      .eq('id', enrollment.id);

    return NextResponse.json({
      ok: true,
      matches: true,
      reason: relevance.reason,
      wordCount: lengthCheck.wordCount,
      report: reportText,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'REPORT_SUBMISSION_ERROR', message);
  }
}
