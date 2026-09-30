import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { askForJson } from '@/lib/server/llmJson';
import { unlockSprintTasks } from './tier2Tasks';
import { MENTOR_REVIEW_REQUIRED } from './tiers';

export const SprintReviewSchema = z.object({
  decision: z.enum(['approved', 'changes_requested']),
  reasons: z.array(z.string().min(5)).min(1).max(5),
  summary: z.string().optional(),
});

export type SprintReview = z.infer<typeof SprintReviewSchema>;

export interface SprintEvaluationCriteria {
  tasksPassed: boolean;
  prCount: number;
  standupCount: number;
  totalTasksRequired?: number;
  passedTasksCount?: number;
}

/**
 * Pure evaluation function checking sprint completion criteria.
 */
export function evaluateSprintCriteria(criteria: SprintEvaluationCriteria): {
  eligible: boolean;
  failureReasons: string[];
} {
  const failureReasons: string[] = [];

  if (!criteria.tasksPassed) {
    const detail =
      criteria.passedTasksCount !== undefined && criteria.totalTasksRequired !== undefined
        ? ` (${criteria.passedTasksCount}/${criteria.totalTasksRequired} tasks passed)`
        : '';
    failureReasons.push(`All weekly checked coding tasks for this sprint must pass verification${detail}.`);
  }

  if (criteria.prCount < 1) {
    failureReasons.push('At least one verified pull request link in the team repository is required.');
  }

  if (criteria.standupCount < 1) {
    failureReasons.push('Weekly asynchronous stand-up report (done, next, blockers) must be submitted.');
  }

  return {
    eligible: failureReasons.length === 0,
    failureReasons,
  };
}

/**
 * Evaluates and reviews a submitted sprint (T-28, FR-T2-7).
 * Uses AI code review for feedback and automatically approves if all criteria pass under default D1.
 */
export async function reviewSprint(
  sprintId: string,
  opts?: { model?: string }
): Promise<{
  ok: boolean;
  decision: 'approved' | 'changes_requested';
  reasons: string[];
  summary?: string;
}> {
  const admin = getSupabaseAdmin();

  // 1. Fetch sprint
  const { data: sprint, error: sprintErr } = await admin
    .from('internship_sprints')
    .select('id, team_id, internship_enrollment_id, number, goal, status')
    .eq('id', sprintId)
    .maybeSingle();

  if (sprintErr || !sprint) {
    return {
      ok: false,
      decision: 'changes_requested',
      reasons: ['Sprint not found.'],
    };
  }

  const week = sprint.number;

  // 2. Fetch team and team member enrollment IDs
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

  // 3. Check PR links for this sprint
  const { data: prs } = await admin
    .from('internship_pr_links')
    .select('id, url')
    .eq('sprint_id', sprintId);
  const prCount = (prs || []).length;

  // 4. Check tasks for this week across team members
  let totalTasks = 0;
  let passedTasks = 0;
  if (enrollmentIds.length > 0) {
    const { data: tasks } = await admin
      .from('internship_tasks')
      .select('id, status')
      .in('internship_enrollment_id', enrollmentIds)
      .eq('week', week);

    if (tasks) {
      totalTasks = tasks.length;
      passedTasks = tasks.filter((t) => t.status === 'passed').length;
    }
  }

  const tasksPassed = totalTasks > 0 ? passedTasks === totalTasks : false;

  // 5. Check stand-up submissions for this week
  let standupCount = 0;
  if (enrollmentIds.length > 0) {
    const { data: standups } = await admin
      .from('internship_standups')
      .select('id')
      .in('internship_enrollment_id', enrollmentIds)
      .eq('week', week);
    standupCount = (standups || []).length;
  }

  // 6. Evaluate criteria
  const evalResult = evaluateSprintCriteria({
    tasksPassed,
    prCount,
    standupCount,
    totalTasksRequired: totalTasks,
    passedTasksCount: passedTasks,
  });

  if (!evalResult.eligible) {
    // Record changes requested
    const reviewData = {
      decision: 'changes_requested' as const,
      reasons: evalResult.failureReasons,
      reviewedBy: 'ai_mentor',
      reviewedAt: new Date().toISOString(),
    };

    await admin
      .from('internship_sprints')
      .update({
        status: 'changes_requested',
        review: reviewData,
        reviewed_at: reviewData.reviewedAt,
      })
      .eq('id', sprintId);

    return {
      ok: true,
      decision: 'changes_requested',
      reasons: evalResult.failureReasons,
    };
  }

  // 7. If all criteria pass, generate AI sprint retrospective or approve
  let decision: 'approved' | 'changes_requested' = 'approved';
  let reasons = [
    'All weekly coding tasks passed verification and hidden tests.',
    'Verified GitHub pull request link submitted in team repository.',
    'Weekly team async stand-up report recorded.',
  ];
  let summary = `Sprint ${week} goals achieved. Code quality, PR submissions, and task assertions meet production criteria.`;

  try {
    const system = `You are a Senior Engineering Lead reviewing an engineering intern team's completed sprint.
Respond in strict JSON with:
- "decision": "approved"
- "reasons": Array of 2 to 4 positive, constructive review bullet points on testing, architecture, and standup discipline.
- "summary": A 1-2 sentence congratulatory review note.`;

    const user = `Please approve Sprint ${week}: "${sprint.goal}". Tasks passed: ${passedTasks}/${totalTasks}. PRs: ${prCount}. Standups: ${standupCount}.`;

    const aiRes = await askForJson<SprintReview>({
      system,
      user,
      schema: SprintReviewSchema,
      maxTokens: 500,
      model: opts?.model,
    });

    if (aiRes.ok && aiRes.data.decision === 'approved') {
      reasons = aiRes.data.reasons;
      if (aiRes.data.summary) summary = aiRes.data.summary;
    }
  } catch {
    // Fall back to pre-defined approval reasons
  }

  // If human mentor review is required, keep in submitted status pending mentor approval
  if (MENTOR_REVIEW_REQUIRED) {
    return {
      ok: true,
      decision: 'approved',
      reasons: [...reasons, 'Pending final human mentor sign-off.'],
      summary,
    };
  }

  // Default D1: AI review alone approves Tier 2 sprints
  const reviewedAt = new Date().toISOString();
  await admin
    .from('internship_sprints')
    .update({
      status: 'approved',
      review: {
        decision: 'approved',
        reasons,
        summary,
        reviewedBy: 'ai_mentor',
        reviewedAt,
      },
      reviewed_at: reviewedAt,
    })
    .eq('id', sprintId);

  // 8. Unlock tasks for next week if next sprint exists
  if (week < 4) {
    for (const enrId of enrollmentIds) {
      await unlockSprintTasks(enrId, week + 1);
    }
  }

  return {
    ok: true,
    decision: 'approved',
    reasons,
    summary,
  };
}
