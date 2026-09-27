import crypto from 'crypto';

/**
 * Server-only. The repository audit (/api/github/ingest) signs its result for the signed-in
 * student; /api/projects/xp grants the project XP only for a signed result, once per repository.
 * The browser never chooses the XP amount or the pass mark.
 */

export const PROJECT_XP_AUTHORED = 1000;
export const PROJECT_XP_REFERENCE = 250;
/** Evidence score a repository needs for the project reward (same default as the Projects page). */
export const PROJECT_MIN_SCORE = 80;

export interface ProjectRewardFields {
  userId: string;
  repoUrl: string;
  score: number;
  authored: boolean;
}

/** https://github.com/owner/repo, lowercased (so one repository is rewarded once whatever the spelling). */
export function projectRepoKey(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const m = url.trim().match(/^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9-]{1,39})\/([A-Za-z0-9._-]{1,100}?)(?:\.git)?(?:[\/?#].*)?$/i);
  return m ? `https://github.com/${m[1]}/${m[2]}`.toLowerCase() : null;
}

function signingSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret && secret.trim()) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET or SUPABASE_SERVICE_ROLE_KEY must be set to sign project rewards.');
  }
  return 'dev-only-project-reward-secret';
}

const payloadOf = (f: ProjectRewardFields) =>
  ['project-reward-v1', f.userId, projectRepoKey(f.repoUrl) || '', Math.round(f.score), f.authored ? 'authored' : 'reference'].join('|');

export function signProjectReward(f: ProjectRewardFields): string {
  return crypto.createHmac('sha256', signingSecret()).update(payloadOf(f)).digest('hex');
}

export function verifyProjectReward(f: ProjectRewardFields, token: unknown): boolean {
  if (typeof token !== 'string' || !/^[0-9a-f]{64}$/.test(token)) return false;
  const expected = signProjectReward(f);
  return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
}

/** The reward a verified audit earns: authored repositories earn the full project XP, others a reference share. */
export function projectRewardAmount(authored: boolean): number {
  return authored ? PROJECT_XP_AUTHORED : PROJECT_XP_REFERENCE;
}
