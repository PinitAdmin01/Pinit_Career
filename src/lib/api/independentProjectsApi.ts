import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import type { Project } from '@/lib/data/projectData';
import { parseAndValidateGithubUrl } from '@/lib/github/githubIngestion';

export interface GithubLiveTelemetry {
  exists: boolean;
  repoName: string;
  owner: string;
  defaultBranch: string;
  stars: number;
  forks: number;
  openIssues: number;
  primaryLanguage: string;
  description: string;
  commits: Array<{
    hash: string;
    message: string;
    author: string;
    date: string;
  }>;
  evidenceScore: number;
  juryReady: boolean;
  error?: string;
}

/**
 * Persists an independent project to Supabase `portfolio_items` table.
 * Falls back to localStorage and user profile metadata for seamless offline resilience.
 */
export async function saveIndependentProjectToDb(
  userId: string,
  project: Project
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Local Storage Cache (Immediate synchronous availability)
    if (typeof window !== 'undefined') {
      try {
        const cacheKey = `pinit_${userId}_independent_projects`;
        const existingRaw = localStorage.getItem(cacheKey);
        const list: Project[] = existingRaw ? JSON.parse(existingRaw) : [];
        const filtered = list.filter((p) => p.id !== project.id);
        filtered.unshift(project);
        localStorage.setItem(cacheKey, JSON.stringify(filtered));
      } catch (err) {
        console.warn('LocalStorage independent project cache error:', err);
      }
    }

    // 2. Supabase `portfolio_items` Relational Storage
    if (isSupabaseConfigured() && userId && userId !== 'demo_student_01' && userId !== 'guest') {
      const payload = {
        id: project.id,
        name: project.name,
        githubLink: project.githubLink,
        techStack: project.techStack,
        description: project.description,
        problem: project.problem,
        deliverable: project.deliverable,
        status: project.status,
        xpReward: project.xpReward,
        isTemplate: false,
        verified: (project as any).verified || false,
        createdAt: (project as any).createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('portfolio_items')
        .upsert(
          {
            user_id: userId,
            item_type: 'project',
            item_data: payload,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,item_type' }
        );

      if (error) {
        console.warn('Supabase portfolio_items insert note:', error.message);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('saveIndependentProjectToDb failure:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetches independent projects for a student from Supabase `portfolio_items`
 * with automatic fallback to localStorage cache.
 */
export async function fetchIndependentProjectsFromDb(userId: string): Promise<Project[]> {
  const projects: Project[] = [];

  // 1. Try Supabase
  if (isSupabaseConfigured() && userId && userId !== 'demo_student_01' && userId !== 'guest') {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', userId)
        .eq('item_type', 'project');

      if (!error && Array.isArray(data)) {
        for (const row of data) {
          if (row.item_data && typeof row.item_data === 'object') {
            projects.push(row.item_data as Project);
          }
        }
      }
    } catch (err) {
      console.warn('fetchIndependentProjectsFromDb Supabase read error:', err);
    }
  }

  // 2. LocalStorage Fallback & Merge
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `pinit_${userId}_independent_projects`;
      const localRaw = localStorage.getItem(cacheKey);
      if (localRaw) {
        const localList: Project[] = JSON.parse(localRaw);
        for (const lp of localList) {
          if (!projects.some((p) => p.id === lp.id || (p.githubLink && p.githubLink === lp.githubLink))) {
            projects.push(lp);
          }
        }
      }
    } catch {}
  }

  return projects;
}

/**
 * Fetches real GitHub repository telemetry (stars, forks, default branch, latest commits)
 * via public GitHub REST API without requiring a personal token for read-only metadata.
 */
export async function fetchGithubLiveTelemetry(githubUrl: string): Promise<GithubLiveTelemetry> {
  const parsed = parseAndValidateGithubUrl(githubUrl);
  if (!parsed.valid || !parsed.owner || !parsed.repo) {
    return {
      exists: false,
      repoName: parsed.repo || 'unknown',
      owner: parsed.owner || 'unknown',
      defaultBranch: 'main',
      stars: 0,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'Unknown',
      description: '',
      commits: [],
      evidenceScore: 0,
      juryReady: false,
      error: parsed.error || 'Invalid GitHub repository URL format.',
    };
  }

  const { owner, repo } = parsed;

  try {
    // 1. Fetch Repository Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!repoRes.ok) {
      return {
        exists: false,
        repoName: repo,
        owner,
        defaultBranch: 'main',
        stars: 0,
        forks: 0,
        openIssues: 0,
        primaryLanguage: 'Unknown',
        description: '',
        commits: [],
        evidenceScore: 20,
        juryReady: false,
        error: repoRes.status === 404
          ? 'Repository not found or private. Ensure the repository is Public.'
          : `GitHub API status ${repoRes.status}`,
      };
    }

    const repoJson = await repoRes.json();

    // 2. Fetch Latest 5 Commits
    let commits: Array<{ hash: string; message: string; author: string; date: string }> = [];
    try {
      const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      if (commitRes.ok) {
        const commitJson = await commitRes.json();
        if (Array.isArray(commitJson)) {
          commits = commitJson.map((c: any) => ({
            hash: (c.sha || '').substring(0, 7),
            message: c.commit?.message?.split('\n')[0] || 'Commit update',
            author: c.commit?.author?.name || c.author?.login || 'Developer',
            date: c.commit?.author?.date || new Date().toISOString(),
          }));
        }
      }
    } catch {}

    // Calculate deterministic Evidence Score
    let score = 50; // Base: public valid repo
    if (commits.length > 0) score += 20;
    if (repoJson.description && repoJson.description.length > 10) score += 10;
    if (repoJson.has_issues) score += 5;
    if (repoJson.open_issues_count >= 0) score += 5;
    score = Math.min(95, score);

    return {
      exists: true,
      repoName: repoJson.name || repo,
      owner: repoJson.owner?.login || owner,
      defaultBranch: repoJson.default_branch || 'main',
      stars: repoJson.stargazers_count || 0,
      forks: repoJson.forks_count || 0,
      openIssues: repoJson.open_issues_count || 0,
      primaryLanguage: repoJson.language || 'Python',
      description: repoJson.description || '',
      commits,
      evidenceScore: score,
      juryReady: score >= 70,
    };
  } catch (err: any) {
    return {
      exists: false,
      repoName: repo,
      owner,
      defaultBranch: 'main',
      stars: 0,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'Unknown',
      description: '',
      commits: [],
      evidenceScore: 10,
      juryReady: false,
      error: 'Network connectivity issue reaching GitHub API.',
    };
  }
}
