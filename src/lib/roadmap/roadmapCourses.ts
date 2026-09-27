import { CANONICAL_TRAJECTORIES } from '@/lib/data/careerTrajectories';

/**
 * Which courses a custom roadmap is made of (owner decision 2026-09-27: "duration decides").
 * Each course is 90 lessons = 30 days at 3 a day. A roadmap has one course per 30 days of its
 * duration, always complete courses:
 *   - the student's main course first,
 *   - then the other courses of its career path (CANONICAL_TRAJECTORIES), in path order,
 *   - then the foundation courses of its stream (tech or business).
 * The chosen courses are studied in path order (prerequisites first), foundations last.
 */

export const DAYS_PER_COURSE = 30;

const BUSINESS_COURSES = new Set([
  'course-digital-accounting', 'course-finance-investment', 'course-business-analytics', 'course-marketing-branding',
  'course-digital-marketing', 'course-ecommerce-digital-biz', 'course-entrepreneurship-biz-mgmt', 'course-sales-crm-success',
  'course-operations-supplychain-compliance', 'course-ai-digital-transformation', 'course-excel-data-viz',
]);

const TECH_FOUNDATIONS = ['course-git-version-control', 'course-computer-fundamentals', 'course-softskills-communication'];
const BUSINESS_FOUNDATIONS = ['course-excel-data-viz', 'course-softskills-communication', 'course-ai-prompt-literacy'];

const unique = (ids: ReadonlyArray<string>) => Array.from(new Set(ids));

/** The career path of a main course: the canonical path it starts, else the first path that contains it. */
export function getCareerPathCourses(mainCourseId: string): string[] {
  const paths = Object.values(CANONICAL_TRAJECTORIES).map((t) => unique(t.nodes.map((n) => n.courseId)));
  const path = paths.find((p) => p[0] === mainCourseId) ?? paths.find((p) => p.includes(mainCourseId));
  return path ?? [mainCourseId];
}

export function getFoundationCourses(mainCourseId: string): string[] {
  return BUSINESS_COURSES.has(mainCourseId) ? BUSINESS_FOUNDATIONS : TECH_FOUNDATIONS;
}

/** Every course a roadmap on this main course may contain (for checking a finished roadmap). */
export function getAllRoadmapCourseIds(mainCourseId: string): string[] {
  return unique([mainCourseId, ...getCareerPathCourses(mainCourseId), ...getFoundationCourses(mainCourseId)]);
}

/** The courses of a roadmap of `durationDays`, in study order. Always at least the main course. */
export function getRoadmapCourseIds(mainCourseId: string, durationDays: number): string[] {
  const path = getCareerPathCourses(mainCourseId);
  const foundations = getFoundationCourses(mainCourseId).filter((c) => !path.includes(c));
  const priority = unique([mainCourseId, ...path.filter((c) => c !== mainCourseId), ...foundations]);
  const count = Math.max(1, Math.min(priority.length, Math.ceil((Number(durationDays) || DAYS_PER_COURSE) / DAYS_PER_COURSE)));
  const chosen = new Set(priority.slice(0, count));
  return [...path.filter((c) => chosen.has(c)), ...foundations.filter((c) => chosen.has(c))];
}
