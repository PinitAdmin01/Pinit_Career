import type { Project } from '@/lib/data/projectData';

/** Where a student's career projects can be found inside onboarding_answers. */
export interface SavedProjectsSource {
  /** Written by saveCareerProjects (UserProgressContext); read by the portfolio tab and faculty verification. */
  portfolio_projects?: unknown;
  /** Legacy key the Projects page used to read. Nothing wrote it, so projects vanished on reload. */
  projects?: unknown;
}

const isProjectList = (v: unknown): v is Project[] =>
  Array.isArray(v) && v.every((p) => !!p && typeof p === 'object' && typeof (p as { id?: unknown }).id === 'string');

/** The student's saved career projects: portfolio_projects first, then the legacy key. */
export function getSavedCareerProjects(answers: SavedProjectsSource | null | undefined): Project[] {
  if (!answers) return [];
  if (isProjectList(answers.portfolio_projects) && answers.portfolio_projects.length > 0) return answers.portfolio_projects;
  if (isProjectList(answers.projects)) return answers.projects;
  return [];
}

/** True when projects exist only under the legacy key and should be re-saved under portfolio_projects. */
export function needsProjectKeyMigration(answers: SavedProjectsSource | null | undefined): boolean {
  if (!answers) return false;
  const current = answers.portfolio_projects;
  return !(Array.isArray(current) && current.length > 0) && isProjectList(answers.projects) && answers.projects.length > 0;
}

export type ProjectLike = Partial<Project> & {
  verified?: boolean;
  progress?: number;
};

/**
 * Returns true ONLY when the student has genuinely engaged with or created a project.
 * Untouched catalog templates seeded on first visit (isTemplate: true, status: 'Not Started',
 * no GitHub/demo link, no audit score) return false so they never appear as fake active work.
 */
export function isStudentEngagedProject(project: ProjectLike | null | undefined): boolean {
  if (!project || typeof project !== 'object') return false;
  const statusNorm = String(project.status || '').trim().toLowerCase();
  if (
    statusNorm === 'in progress' ||
    statusNorm === 'in_progress' ||
    statusNorm === 'completed' ||
    statusNorm === 'verified'
  ) {
    return true;
  }
  if (typeof project.githubLink === 'string' && project.githubLink.trim().length > 0) return true;
  if (typeof project.demoLink === 'string' && project.demoLink.trim().length > 0) return true;
  if (Number(project.verificationScore || 0) > 0) return true;
  if (Boolean(project.vivaPassed) || Boolean(project.authorshipVerified) || Boolean(project.verified)) return true;
  if (typeof project.certificateId === 'string' && project.certificateId.trim().length > 0) return true;
  if (project.capstoneInterview?.passed) return true;
  if (
    project.source === 'custom' ||
    (typeof project.id === 'string' && project.id.startsWith('custom_proj_')) ||
    project.isTemplate === false
  ) {
    return true;
  }
  return false;
}

/**
 * Computes honest 0-100% project completion strictly from verified student progress signals.
 * Never assigns a synthetic non-zero floor (e.g. 15%) to unstarted projects.
 */
export function computeHonestProjectProgress(project: ProjectLike | null | undefined): number {
  if (!project || typeof project !== 'object') return 0;
  const statusNorm = String(project.status || '').trim().toLowerCase();

  if (
    statusNorm === 'completed' ||
    statusNorm === 'verified' ||
    Boolean(project.verified) ||
    Boolean(project.authorshipVerified) ||
    (typeof project.certificateId === 'string' && project.certificateId.trim().length > 0)
  ) {
    return 100;
  }

  if (typeof project.progress === 'number' && Number.isFinite(project.progress)) {
    return Math.max(0, Math.min(100, Math.round(project.progress)));
  }

  let pct = 0;
  if (statusNorm === 'in progress' || statusNorm === 'in_progress') pct += 20;
  if (typeof project.githubLink === 'string' && project.githubLink.trim().length > 0) pct += 30;
  if (typeof project.demoLink === 'string' && project.demoLink.trim().length > 0) pct += 15;
  const vScore = Number(project.verificationScore || 0);
  if (vScore > 0) pct += Math.min(25, Math.round(vScore * 0.25));
  if (Boolean(project.vivaPassed) || Boolean(project.capstoneInterview?.passed)) pct += 25;

  return Math.max(0, Math.min(95, pct));
}

/** Returns only projects the student has genuinely started, linked, submitted, or created. */
export function getActiveCareerProjects(answers: SavedProjectsSource | null | undefined): Project[] {
  return getSavedCareerProjects(answers).filter((p) => isStudentEngagedProject(p));
}
