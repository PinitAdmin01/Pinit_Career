import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { unlockSprintTasks } from '@/lib/internships/tier2Tasks';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(
  req: NextRequest,
  { params }: { params: { sprintId: string } }
) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;
    const adminUser = gated.user;

    const sprintId = params.sprintId;
    if (!sprintId) {
      return fail(400, 'SPRINT_ID_REQUIRED', 'Sprint ID is required.');
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const decision = body.decision === 'approved' ? 'approved' : 'changes_requested';
    const reasons = Array.isArray(body.reasons) ? body.reasons.map(String) : [];
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

    if (reasons.length === 0) {
      return fail(400, 'REASONS_REQUIRED', 'At least one review reason is required.');
    }

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

    const reviewedAt = new Date().toISOString();
    const reviewData = {
      decision,
      reasons,
      notes: notes || null,
      reviewedBy: adminUser.id,
      reviewedAt,
      manualOverride: true,
    };

    // 2. Update sprint record
    const { data: updated, error: updateErr } = await admin
      .from('internship_sprints')
      .update({
        status: decision,
        review: reviewData,
        reviewed_by: adminUser.id,
        reviewed_at: reviewedAt,
      })
      .eq('id', sprintId)
      .select()
      .single();

    if (updateErr) {
      return fail(500, 'UPDATE_FAILED', 'Could not record admin review decision.');
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
      message: `Sprint review decision recorded as "${decision}".`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}
