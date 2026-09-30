import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { reviewSprint } from '@/lib/internships/sprintReview';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(
  req: NextRequest,
  { params }: { params: { sprintId: string } }
) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    const sprintId = params.sprintId;
    if (!sprintId) {
      return fail(400, 'SPRINT_ID_REQUIRED', 'Sprint ID is required.');
    }

    const admin = getSupabaseAdmin();

    // 1. Lookup sprint
    const { data: sprint, error: sprintErr } = await admin
      .from('internship_sprints')
      .select('id, team_id, internship_enrollment_id, number, status')
      .eq('id', sprintId)
      .maybeSingle();

    if (sprintErr || !sprint) {
      return fail(404, 'SPRINT_NOT_FOUND', 'Sprint not found.');
    }

    if (sprint.status === 'submitted') {
      return fail(400, 'ALREADY_SUBMITTED', 'Sprint has already been submitted for review.');
    }

    if (sprint.status === 'approved') {
      return fail(400, 'ALREADY_APPROVED', 'Sprint is already approved.');
    }

    // 2. Check if user is member of this team
    if (sprint.team_id) {
      const { data: isMember } = await admin
        .from('internship_team_members')
        .select('student_id')
        .eq('team_id', sprint.team_id)
        .eq('student_id', userId)
        .maybeSingle();

      if (!isMember) {
        return fail(403, 'NOT_A_TEAM_MEMBER', 'You are not a member of this team.');
      }
    }

    // 3. Verify sprint has at least one PR link recorded
    const { data: prs, error: prErr } = await admin
      .from('internship_pr_links')
      .select('id')
      .eq('sprint_id', sprintId)
      .limit(1);

    if (prErr || !prs || prs.length === 0) {
      return fail(
        400,
        'PR_LINK_REQUIRED',
        'You must submit at least one verified pull request link before submitting this sprint.'
      );
    }

    // 4. Update status to 'submitted'
    const { error: updateErr } = await admin
      .from('internship_sprints')
      .update({ status: 'submitted' })
      .eq('id', sprintId);

    if (updateErr) {
      return fail(500, 'UPDATE_FAILED', 'Could not submit sprint for review.');
    }

    // 5. Trigger sprint review (AI mentor review under default D1)
    const reviewResult = await reviewSprint(sprintId);

    return NextResponse.json({
      ok: true,
      status: reviewResult.decision || 'submitted',
      review: reviewResult,
      message:
        reviewResult.decision === 'approved'
          ? 'Sprint reviewed and approved!'
          : 'Sprint submitted. Changes requested.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
