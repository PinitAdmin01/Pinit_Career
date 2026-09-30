import { z } from 'zod';

/**
 * T-35 — Open-source fallback check.
 * GitHub API check of merged PRs (author, dates, approved repo list).
 * Cache results; respect rate limits.
 */

export const APPROVED_REPOS_LIST: string[] = [
  // Placeholder: owner will populate with approved open-source repos
  // Format: 'owner/repo'
];

export const OssFallbackSchema = z.object({
  githubUsername: z.string().min(1, 'GitHub username is required'),
  repos: z.array(z.string().min(1)).min(1, 'At least one repository is required'),
});

export type OssFallbackInput = z.infer<typeof OssFallbackSchema>;

export interface MergedPrResult {
  repo: string;
  prNumber: number;
  title: string;
  mergedAt: string;
  url: string;
}

export interface OssFallbackResult {
  username: string;
  totalMergedPrs: number;
  qualifyingPrs: MergedPrResult[];
  checkedAt: string;
  rateLimitRemaining: number | null;
  passed: boolean;
}

const PR_CACHE = new Map<string, { result: OssFallbackResult; cachedAt: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Checks GitHub for merged PRs by a specific author in the given repos.
 * Uses the GitHub REST API (no auth token = 60 req/hr; with token = 5000 req/hr).
 * Caches results to respect rate limits.
 *
 * Minimum 3 merged PRs to pass.
 */
export async function checkMergedPrs(
  githubUsername: string,
  repos: string[],
  githubToken?: string | null
): Promise<OssFallbackResult> {
  const cacheKey = `${githubUsername}:${repos.sort().join(',')}`;
  const cached = PR_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.result;
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'PinIT-Career-OS/1.0',
  };
  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const qualifyingPrs: MergedPrResult[] = [];
  let rateLimitRemaining: number | null = null;

  for (const repo of repos) {
    // Only check approved repos if the list is populated
    if (APPROVED_REPOS_LIST.length > 0 && !APPROVED_REPOS_LIST.includes(repo)) {
      continue;
    }

    try {
      const url = `https://api.github.com/repos/${repo}/pulls?state=closed&per_page=100&sort=updated&direction=desc`;
      const response = await fetch(url, { headers });

      // Track rate limit
      const remaining = response.headers.get('x-ratelimit-remaining');
      if (remaining !== null) rateLimitRemaining = parseInt(remaining, 10);

      if (!response.ok) {
        // Rate limited or repo not found — skip
        continue;
      }

      const prs = (await response.json()) as Array<{
        number: number;
        title: string;
        merged_at: string | null;
        html_url: string;
        user: { login: string } | null;
      }>;

      for (const pr of prs) {
        if (
          pr.merged_at &&
          pr.user?.login?.toLowerCase() === githubUsername.toLowerCase()
        ) {
          qualifyingPrs.push({
            repo,
            prNumber: pr.number,
            title: pr.title,
            mergedAt: pr.merged_at,
            url: pr.html_url,
          });
        }
      }

      // Respect rate limits: stop if low
      if (rateLimitRemaining !== null && rateLimitRemaining < 5) {
        break;
      }
    } catch {
      // Network error — skip this repo
      continue;
    }
  }

  const result: OssFallbackResult = {
    username: githubUsername,
    totalMergedPrs: qualifyingPrs.length,
    qualifyingPrs: qualifyingPrs.sort(
      (a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime()
    ),
    checkedAt: new Date().toISOString(),
    rateLimitRemaining,
    passed: qualifyingPrs.length >= 3,
  };

  PR_CACHE.set(cacheKey, { result, cachedAt: Date.now() });
  return result;
}

/**
 * Clears the PR cache (for testing).
 */
export function clearPrCache(): void {
  PR_CACHE.clear();
}
