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
