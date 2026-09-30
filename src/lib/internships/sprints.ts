import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { parseGithubLink, type GithubLink } from '@/lib/courses/capstoneSprints';

export interface ParsedGithubPr {
  owner: string;
  repo: string;
  pullNumber: number;
  url: string;
}

export const SPRINT_GOALS = [
  'Sprint 1: Architecture, PostgreSQL schema design, and core record validation.',
  'Sprint 2: Business logic services, relational JOIN queries, and slot conflict management.',
  'Sprint 3: Advanced queuing, subquery filtering, and edge-case error recovery.',
  'Sprint 4: Financial auditing, summary reporting aggregates, and final integration.',
] as const;

/**
 * Validates a GitHub pull request URL matching https://github.com/owner/repo/pull/<number>
 */
export function parseGithubPrLink(raw: unknown): ParsedGithubPr | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();

  const prRegex = /^https:\/\/(?:www\.)?github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100})\/pull\/(\d+)\/?$/;
  const match = trimmed.match(prRegex);
  if (!match) return null;

  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, '');
  const pullNumber = parseInt(match[3], 10);

  if (isNaN(pullNumber) || pullNumber <= 0) return null;

  return {
    owner,
    repo,
    pullNumber,
    url: `https://github.com/${owner}/${repo}/pull/${pullNumber}`,
  };
}

/**
 * Ensures that a PR link belongs strictly to the team's registered GitHub repository (FR-T2-5).
 */
export function validatePrMatchesTeamRepo(prUrl: string, teamRepoUrl: string): {
  valid: boolean;
  reason?: string;
} {
  const pr = parseGithubPrLink(prUrl);
  if (!pr) {
    return {
      valid: false,
      reason: 'PR URL must be in format https://github.com/<owner>/<repo>/pull/<number>',
    };
  }

  const teamRepo = parseGithubLink(teamRepoUrl);
  if (!teamRepo) {
    return {
      valid: false,
      reason: 'Invalid team repository URL on file.',
    };
  }

  if (
    pr.owner.toLowerCase() !== teamRepo.owner.toLowerCase() ||
    pr.repo.toLowerCase() !== teamRepo.repo.toLowerCase()
  ) {
    return {
      valid: false,
      reason: `PR belongs to ${pr.owner}/${pr.repo}, but team repository is ${teamRepo.owner}/${teamRepo.repo}.`,
    };
  }

  return { valid: true };
}

/**
 * Counts total words across stand-up fields (done, next, blockers).
 */
export function countStandupWords(done: string, next: string, blockers?: string): number {
  const text = [done || '', next || '', blockers || ''].join(' ').trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Initializes the 4 weekly sprints for a virtual internship team.
 */
export async function initializeTeamSprints(
  teamId: string,
  enrollmentId?: string,
  startDate: Date = new Date()
): Promise<{ ok: boolean; count: number }> {
  const admin = getSupabaseAdmin();

  // Check if sprints already exist
  const { data: existing } = await admin
    .from('internship_sprints')
    .select('id')
    .eq('team_id', teamId);

  if (existing && existing.length > 0) {
    return { ok: true, count: existing.length };
  }

  const sprintRows = SPRINT_GOALS.map((goal, idx) => {
    const number = idx + 1;
    const dueAt = new Date(startDate.getTime() + number * 7 * 24 * 60 * 60 * 1000).toISOString();
    return {
      team_id: teamId,
      internship_enrollment_id: enrollmentId || null,
      number,
      goal,
      due_at: dueAt,
      status: 'open' as const,
      review: null,
      reviewed_by: null,
      reviewed_at: null,
    };
  });

  const { error: insertErr } = await admin.from('internship_sprints').insert(sprintRows);
  if (insertErr) {
    console.error('[initializeTeamSprints] Failed to insert sprints:', insertErr);
    return { ok: false, count: 0 };
  }

  return { ok: true, count: sprintRows.length };
}
