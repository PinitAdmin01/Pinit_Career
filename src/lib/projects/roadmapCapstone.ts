import type { Project } from '@/lib/data/projectData';

/** What the Projects page needs to hand a finished roadmap its capstone project. */
export interface RoadmapCapstoneContext {
  courseId: string | null;
  completedAt: string;
  /** Career role the roadmap was built for; the project is generated for it. */
  goal: string;
}

/**
 * The completed roadmap (recorded by useQuestProgression as roadmap_completed_*), or null.
 * Only the student's own answers are used here, so this decides what the UI offers, not a credential.
 */
export function getRoadmapCapstoneContext(
  answers: Readonly<Record<string, unknown>> | null | undefined,
  fallbackGoal = 'Software Engineer'
): RoadmapCapstoneContext | null {
  const completedAt = answers?.roadmap_completed_at;
  if (typeof completedAt !== 'string' || !completedAt) return null;
  const course = answers?.roadmap_completed_course;
  const role = answers?.role;
  return {
    courseId: typeof course === 'string' && course ? course : null,
    completedAt,
    goal: typeof role === 'string' && role.trim() ? role.trim() : fallbackGoal,
  };
}

/** The capstone already handed out for this roadmap (started ones first), if any. */
export function findRoadmapCapstone(projects: ReadonlyArray<Project>, ctx: RoadmapCapstoneContext): Project | null {
  const mine = projects.filter((p) => p.origin === 'roadmap' && (p.roadmapCourseId ?? null) === ctx.courseId);
  return mine.find((p) => p.status === 'In Progress' || p.status === 'Completed') || mine[0] || null;
}

/** Tags projects generated for a finished roadmap, so the next steps can find them. */
export function tagRoadmapCapstones(projects: ReadonlyArray<Project>, ctx: RoadmapCapstoneContext): Project[] {
  return projects.map((p) => ({ ...p, origin: 'roadmap' as const, roadmapCourseId: ctx.courseId ?? undefined }));
}
