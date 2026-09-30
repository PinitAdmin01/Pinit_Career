import { NextRequest, NextResponse } from 'next/server';
import { requireMentorOrAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { unlockSprintTasks } from '@/lib/internships/tier2Tasks';
import { z } from 'zod';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

const MentorReviewSchema = z.object({
  decision: z.enum(['approved', 'changes_requested']),
  feedback: z.string().min(5, 'Feedback must be at least 5 characters').max(2000),
  areas: z.array(z.object({
    name: z.string(),
    score: z.number().min(1).max(5),
    comment: z.string().optional(),
  })).optional(),
});

/**
 * POST /api/mentor/internship/sprint/[sprintId]/review
 * Mentor reviews a submitted sprint (Tiers 2–3).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { sprintId: string } }
) {
  try {
    const gated = await requireMentorOrAdminUserFromRequest(req);
    if (gated.error) return gated.error;
    const mentor = gated.user;

    const sprintId = params.sprintId;
    if (!sprintId) return fail(400, 'SPRINT_ID_REQUIRED', 'Sprint ID is required.');

    const body = await req.json().catch(() => ({}));
    const parsed = MentorReviewSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message).join('; ');
      return fail(400, 'VALIDATION_ERROR', issues);
    }

    const { decision, feedback, areas } = parsed.data;
    const admin = getSupabaseAdmin();

    // 1. Fetch sprint
    const { data: sprint, error: sprintErr } = await admin
      .from('internship_sprints')
      .select('id, team_id, internship_enrollment_id, number, status')
      .eq('id', sprintId)
      .maybeSingle();

    if (sprintErr || !sprint) {
      return fail(404, 'SPRINT_NOT_FOUND', 'Sprint not found.');
    }

    if (sprint.status !== 'submitted') {
      return fail(400, 'NOT_SUBMITTED', `Sprint is "${sprint.status}", not "submitted".`);
    }

    const reviewedAt = new Date().toISOString();
    const reviewData = {
      decision,
      feedback,
      areas: areas || [],
      reviewedBy: mentor.id,
      reviewedAt,
      reviewerRole: mentor.role,
    };

    // 2. Update sprint record
    const { data: updated, error: updateErr } = await admin
      .from('internship_sprints')
      .update({
        status: decision,
        review: reviewData,
        reviewed_by: mentor.id,
        reviewed_at: reviewedAt,
      })
      .eq('id', sprintId)
      .select()
      .single();

    if (updateErr) {
      return fail(500, 'UPDATE_FAILED', 'Could not record review decision.');
    }

    // 3. If approved, unlock next sprint tasks
    if (decision === 'approved' && sprint.number < 4) {
      let enrollmentIds: string[] = [];
      if (sprint.team_id) {
        const { data: members } = await admin
          .from('internship_team_members')
          .select('internship_enrollment_id')
          .eq('team_id', sprint.team_id);
        enrollmentIds = (members || []).map((m) => m.internship_enrollment_id);
      } else if (sprint.internship_enrollment_id) {
        enrollmentIds = [sprint.internship_enrollment_id];
      }

      for (const enrId of enrollmentIds) {
        await unlockSprintTasks(enrId, sprint.number + 1);
      }
    }

    return NextResponse.json({
      ok: true,
      decision,
      sprint: updated,
      message: `Sprint review decision: "${decision}".`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
