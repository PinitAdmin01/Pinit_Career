import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { WeeklyLogSchema, weeklyLogToClient, calculateLogProgress } from '@/lib/internships/weeklyLogs';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

/**
 * GET /api/internship/weekly-log
 * Returns all weekly logs + progress for the student's active enrollment.
 */
export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const user = gated.user;

    const admin = getSupabaseAdmin();
    const { data: enrollment } = await admin
      .from('internship_enrollments')
      .select('id, tier')
      .eq('student_id', user.id)
      .in('status', ['active'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!enrollment) {
      return fail(404, 'NO_ENROLLMENT', 'No active internship enrollment found.');
    }

    const { data: logs, error } = await admin
      .from('internship_weekly_logs')
      .select('*')
      .eq('internship_enrollment_id', enrollment.id)
      .order('week', { ascending: true });

    if (error) return fail(500, 'QUERY_FAILED', error.message);

    const logData = (logs || []).map(weeklyLogToClient);
    const progress = calculateLogProgress(
      enrollment.tier,
      (logs || []).map((l) => ({ week: l.week, hours: Number(l.hours) }))
    );

    return NextResponse.json({ ok: true, logs: logData, progress });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

/**
 * POST /api/internship/weekly-log
 * Submits a weekly log entry. Tiers 3–5 only.
 */
export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const user = gated.user;

    const body = await req.json().catch(() => ({}));
    const parsed = WeeklyLogSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message).join('; ');
      return fail(400, 'VALIDATION_ERROR', issues);
    }

    const admin = getSupabaseAdmin();

    // Get active enrollment
    const { data: enrollment } = await admin
      .from('internship_enrollments')
      .select('id, tier')
      .eq('student_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!enrollment) {
      return fail(404, 'NO_ENROLLMENT', 'No active internship enrollment found.');
    }

    // Only Tiers 3–5 use weekly logs
    const loggableTiers = ['t3_project', 't4_industry', 't5_fellowship'];
    if (!loggableTiers.includes(enrollment.tier)) {
      return fail(400, 'TIER_NOT_APPLICABLE', 'Weekly logs are only for Tiers 3–5.');
    }

    // Check for duplicate week
    const { data: existing } = await admin
      .from('internship_weekly_logs')
      .select('id')
      .eq('internship_enrollment_id', enrollment.id)
      .eq('week', parsed.data.week)
      .maybeSingle();

    if (existing) {
      return fail(409, 'WEEK_EXISTS', `A log for week ${parsed.data.week} already exists.`);
    }

    const { data, error } = await admin
      .from('internship_weekly_logs')
      .insert({
        internship_enrollment_id: enrollment.id,
        week: parsed.data.week,
        hours: parsed.data.hours,
        summary: parsed.data.summary,
        links: parsed.data.links,
      })
      .select()
      .single();

    if (error) return fail(500, 'INSERT_FAILED', error.message);

    return NextResponse.json(
      { ok: true, log: weeklyLogToClient(data) },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
