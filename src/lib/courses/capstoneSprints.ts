import type { CrashPlan } from '@/lib/data/crashPlansData';
import type { CrashTrack } from '@/lib/courses/crashCourseProgress';

/**
 * Capstone of a certificate course: four sprints, done in order, each checked by the server
 * (POST /api/quests/capstone) before it is marked approved. Only the server writes the
 * milestones; nothing here is trusted from the browser.
 *   1 Architecture & data schema → public GitHub repo + a design doc (file/folder) inside it
 *   2 Core services & APIs       → the API code (file/folder) inside the same repo
 *   3 Deployment                 → a live https URL that responds
 *   4 Oral defense               → the course defense interview, passed, with a server-signed result
 */

export type CapstoneSprint = 1 | 2 | 3 | 4;

export interface CapstoneMilestones {
  sprint1Approved?: boolean;
  sprint1RepoUrl?: string;
  sprint1DesignUrl?: string;
  sprint1ApprovedAt?: string;
  sprint2Approved?: boolean;
  sprint2ApiUrl?: string;
  sprint2ApprovedAt?: string;
  sprint3RepoUrl?: string | null;
  sprint3LiveUrl?: string | null;
  sprint3ApprovedAt?: string;
  sprint4DefenseScore?: number | null;
  sprint4Verdict?: string;
  sprint4ApprovedAt?: string;
  sprint4LastAttempt?: { score: number; verdict: string; at: string };
}

export interface CapstoneSprintInfo {
  sprint: CapstoneSprint;
  title: string;
  description: string;
  check: string;
  /** Label and example link for the file or folder this sprint asks for (sprints 1 and 2). */
  field?: { label: string; placeholder: string };
}

/** Wording a plan can change per sprint. The checks the server runs stay the same. */
export type CapstoneSprintText = Partial<Pick<CapstoneSprintInfo, 'title' | 'description' | 'check' | 'field'>>;

export const CAPSTONE_SPRINTS: ReadonlyArray<CapstoneSprintInfo> = [
  {
    sprint: 1,
    title: 'Sprint 1: Architecture & Data Schema',
    description: 'Create the public GitHub repository for your project and add your architecture and data schema design (for example docs/architecture.md).',
    check: 'We check that the repository is public and the design file or folder exists in it.',
    field: { label: 'Design', placeholder: 'https://github.com/you/your-project/blob/main/docs/architecture.md' },
  },
  {
    sprint: 2,
    title: 'Sprint 2: Core Services & APIs',
    description: 'Build the core services and API endpoints in the same repository.',
    check: 'We check that the API code you link exists in your project repository.',
    field: { label: 'API code', placeholder: 'https://github.com/you/your-project/tree/main/src/api' },
  },
  {
    sprint: 3,
    title: 'Sprint 3: Deployment',
    description: 'Deploy the project and submit its live https URL.',
    check: 'We check that the live URL responds.',
  },
  {
    sprint: 4,
    title: 'Sprint 4: Capstone Oral Defense',
    description: 'Defend your project in the AI capstone defense interview (free for enrolled students).',
    check: 'Pass with a Hire or Conditional Hire verdict and a score of 65 or more.',
  },
];

/** The sprints as a plan words them for one track (its own titles and descriptions, same checks). */
export function getCapstoneSprints(
  plan: Pick<CrashPlan, 'capstoneSprintsByTrack'> | null | undefined,
  track: CrashTrack | null | undefined
): CapstoneSprintInfo[] {
  const custom = track ? plan?.capstoneSprintsByTrack?.[track] : undefined;
  return CAPSTONE_SPRINTS.map((s) => ({ ...s, ...(custom?.[s.sprint] ?? {}) }));
}

export function isSprintApproved(m: CapstoneMilestones | null | undefined, sprint: CapstoneSprint): boolean {
  if (!m) return false;
  if (sprint === 1) return m.sprint1Approved === true;
  if (sprint === 2) return m.sprint2Approved === true;
  if (sprint === 3) return Boolean(m.sprint3RepoUrl && m.sprint3LiveUrl);
  return typeof m.sprint4DefenseScore === 'number';
}

/** The sprint to do next (sprints unlock in order), or null when all four are approved. */
export function nextCapstoneSprint(m: CapstoneMilestones | null | undefined): CapstoneSprint | null {
  for (const s of [1, 2, 3, 4] as const) {
    if (!isSprintApproved(m, s)) return s;
  }
  return null;
}

export interface GithubLink {
  owner: string;
  repo: string;
  /** https://github.com/owner/repo */
  repoUrl: string;
  /** The normalized link (repo, or a /blob/… file or /tree/… folder inside it). */
  url: string;
  /** True when the link points inside the repo (a file or folder), not at the repo itself. */
  isPath: boolean;
}

const RESERVED_GITHUB_OWNERS = new Set([
  'about', 'apps', 'collections', 'contact', 'enterprise', 'explore', 'features', 'join', 'login',
  'marketplace', 'new', 'notifications', 'orgs', 'organizations', 'pricing', 'pulls', 'issues',
  'search', 'settings', 'sponsors', 'topics', 'trending', 'users',
]);

export function parseGithubLink(raw: unknown): GithubLink | null {
  if (typeof raw !== 'string' || raw.length > 2048) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (url.protocol !== 'https:' || (host !== 'github.com' && host !== 'www.github.com') || url.port || url.username) return null;
  const match = url.pathname.match(/^\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100})(\/.*)?$/);
  if (!match) return null;
  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, '');
  if (!repo || repo === '.' || repo === '..' || RESERVED_GITHUB_OWNERS.has(owner.toLowerCase())) return null;
  const rest = (match[3] || '').replace(/\/+$/, '');
  if (rest && !/^\/(blob|tree)\/[^\s]+$/.test(rest)) return null;
  const repoUrl = `https://github.com/${owner}/${repo}`;
  return { owner, repo, repoUrl, url: `${repoUrl}${rest}`, isPath: rest.length > 0 };
}

export function sameGithubRepo(a: Pick<GithubLink, 'owner' | 'repo'>, b: Pick<GithubLink, 'owner' | 'repo'>): boolean {
  return a.owner.toLowerCase() === b.owner.toLowerCase() && a.repo.toLowerCase() === b.repo.toLowerCase();
}

/** The interview topic of a course's capstone defense. The server re-derives it from the enrollment. */
export function courseDefenseTopic(plan: Pick<CrashPlan, 'title' | 'flagshipBuildByTrack'>, track: CrashTrack): string {
  const build = plan.flagshipBuildByTrack?.[track]?.title || 'Capstone Project';
  return `Capstone Defense: ${build} (${plan.title})`;
}

export const COURSE_DEFENSE_PATH = '/interview?mode=course_defense';

export type CapstoneSubmission =
  | { sprint: 1; repoUrl: string; designUrl: string }
  | { sprint: 2; apiUrl: string }
  | { sprint: 3; liveUrl: string }
  | { sprint: 4; score: number; verdict: string; topicToken: string };

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export function parseCapstoneSubmission(body: unknown): { ok: true; submission: CapstoneSubmission } | { ok: false; message: string } {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  switch (b.sprint) {
    case 1:
      if (!str(b.repoUrl) || !str(b.designUrl)) return { ok: false, message: 'Add your GitHub repository and the link to your design file or folder.' };
      return { ok: true, submission: { sprint: 1, repoUrl: str(b.repoUrl), designUrl: str(b.designUrl) } };
    case 2:
      if (!str(b.apiUrl)) return { ok: false, message: 'Add the link to your API code in your repository.' };
      return { ok: true, submission: { sprint: 2, apiUrl: str(b.apiUrl) } };
    case 3:
      if (!str(b.liveUrl)) return { ok: false, message: 'Add the live URL of your deployed project.' };
      return { ok: true, submission: { sprint: 3, liveUrl: str(b.liveUrl) } };
    case 4:
      if (typeof b.score !== 'number' || !Number.isFinite(b.score) || !str(b.verdict) || !str(b.topicToken)) {
        return { ok: false, message: 'Complete the capstone defense interview first.' };
      }
      return { ok: true, submission: { sprint: 4, score: b.score, verdict: str(b.verdict), topicToken: str(b.topicToken) } };
    default:
      return { ok: false, message: 'Which sprint is this submission for?' };
  }
}
