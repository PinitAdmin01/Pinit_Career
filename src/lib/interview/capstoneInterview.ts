import type { Project } from '@/lib/data/projectData';
import { getSavedCareerProjects } from '@/lib/projects/savedProjects';

/**
 * Custom roadmap journey: roadmap → capstone project → capstone interview → certificate.
 * A roadmap capstone (origin 'roadmap') that the student completed (verified) unlocks one interview
 * about that project and the student's career role. Its result is kept on the project; issuing a
 * certificate must re-check it on the server (the saved project lives in student-editable data).
 */

export type CapstoneInterviewPlan =
  | { ok: true; project: Project; role: string; topic: string }
  | { ok: false; reason: 'NOT_FOUND' | 'NOT_ROADMAP_CAPSTONE' | 'NOT_VERIFIED' };

export interface CapstoneInterviewResult {
  score: number;
  verdict: string;
  passed: boolean;
  completedAt: string;
  evaluationToken?: string;
  topic?: string;
  topicEvaluationToken?: string;
}

const GENERIC_TECH_TOPIC = 'Software Engineering (SDE)';
const GENERIC_NON_TECH_TOPIC = 'Finance & Accounting (B.Com)';

/** Interview topic for "roadmap" mode: the student's own career role, generic only if none is set. */
export function roadmapInterviewTopic(role: unknown, domainStream: 'tech' | 'non_tech'): string {
  const r = typeof role === 'string' ? role.trim() : '';
  if (r) return r;
  return domainStream === 'non_tech' ? GENERIC_NON_TECH_TOPIC : GENERIC_TECH_TOPIC;
}

export function getCapstoneInterviewPlan(
  answers: Readonly<Record<string, unknown>> | null | undefined,
  projectId: string | null | undefined
): CapstoneInterviewPlan {
  const project = getSavedCareerProjects(answers).find((p) => p.id === projectId);
  if (!project) return { ok: false, reason: 'NOT_FOUND' };
  if (project.origin !== 'roadmap') return { ok: false, reason: 'NOT_ROADMAP_CAPSTONE' };
  if (project.status !== 'Completed') return { ok: false, reason: 'NOT_VERIFIED' };
  const role = typeof answers?.role === 'string' && answers.role.trim() ? answers.role.trim() : 'Software Engineer';
  return { ok: true, project, role, topic: `${role}: Capstone Defense of "${project.name}"` };
}

/** True when the topic is this project's capstone defense (the role part may differ). */
export function isRoadmapCapstoneTopic(topic: unknown, projectName: string): topic is string {
  return typeof topic === 'string' && topic.endsWith(`: Capstone Defense of "${projectName}"`);
}

/** Pass mark for the capstone interview (same bar as interview evidence elsewhere). */
export function isCapstoneInterviewPassed(verdict: string, score: number): boolean {
  return (verdict === 'Hire' || verdict === 'Conditional Hire') && score >= 65;
}

/** The projects with this capstone's interview result recorded (a later pass is never overwritten by a fail). */
export function recordCapstoneInterview(
  projects: ReadonlyArray<Project>,
  projectId: string,
  result: Omit<CapstoneInterviewResult, 'passed'>
): Project[] {
  const passed = isCapstoneInterviewPassed(result.verdict, result.score);
  return projects.map((p) => {
    if (p.id !== projectId) return p;
    if (p.capstoneInterview?.passed && !passed) return p;
    return { ...p, capstoneInterview: { ...result, passed } };
  });
}

/** The capstone waiting for its interview, or already interviewed, for the Projects page. */
export function getCapstoneNextStep(projects: ReadonlyArray<Project>):
  | { step: 'interview'; project: Project }
  | { step: 'certificate'; project: Project }
  | null {
  const done = projects.filter((p) => p.origin === 'roadmap' && p.status === 'Completed');
  const passed = done.find((p) => p.capstoneInterview?.passed);
  if (passed) return { step: 'certificate', project: passed };
  return done[0] ? { step: 'interview', project: done[0] } : null;
}

export const capstoneInterviewPath = (projectId: string) => `/interview?mode=capstone&projectId=${encodeURIComponent(projectId)}`;
