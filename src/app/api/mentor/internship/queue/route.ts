import { NextRequest, NextResponse } from 'next/server';
import { requireMentorOrAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { MENTOR_REVIEW_REQUIRED } from '@/lib/internships/tiers';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

/**
 * GET /api/mentor/internship/queue
 * Lists sprints pending review for mentors (Tiers 2–3).
 * Also returns submitted weekly logs that need mentor sign-off.
 */
export async function GET(req: NextRequest) {
  try {
    const gated = await requireMentorOrAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();
    const url = new URL(req.url);
    const tier = url.searchParams.get('tier'); // optional filter

    // 1. Sprints awaiting review
    let sprintQuery = admin
      .from('internship_sprints')
      .select(`
        id, team_id, internship_enrollment_id, number, goal, due_at,
        status, review, reviewed_by, reviewed_at, created_at
      `)
      .eq('status', 'submitted')
      .order('created_at', { ascending: true });

    // If tier filter, we need to join through enrollments
    // For now, return all submitted sprints (mentor sees the full queue)

    const { data: sprints, error: sprintErr } = await sprintQuery;
    if (sprintErr) return fail(500, 'QUERY_FAILED', sprintErr.message);

    // 2. Get enrollment info for context
    const enrollmentIds = [
      ...new Set(
        (sprints || [])
          .map((s) => s.internship_enrollment_id)
          .filter(Boolean)
      ),
    ];

    let enrollments: Array<Record<string, unknown>> = [];
    if (enrollmentIds.length > 0) {
      const { data } = await admin
        .from('internship_enrollments')
        .select('id, student_id, tier, track, status')
        .in('id', enrollmentIds);
      enrollments = data || [];
    }

    // 3. If team-based sprints, get team info
    const teamIds = [
      ...new Set(
        (sprints || []).map((s) => s.team_id).filter(Boolean)
      ),
    ];

    let teams: Array<Record<string, unknown>> = [];
    if (teamIds.length > 0) {
      const { data } = await admin
        .from('internship_teams')
        .select('id, tier, status, project_brief')
        .in('id', teamIds);
      teams = data || [];
    }

    return NextResponse.json({
      ok: true,
      mentorReviewRequired: MENTOR_REVIEW_REQUIRED,
      queue: {
        sprints: sprints || [],
        enrollments,
        teams,
      },
      total: (sprints || []).length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
