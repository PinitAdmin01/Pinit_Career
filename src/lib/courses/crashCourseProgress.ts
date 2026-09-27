import type { CrashPlan } from '@/lib/data/crashPlansData';
import type { CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';

/**
 * Progress of a purchased certificate course (quests sub-tab 1).
 *
 * The course's own lessons are the quests of the courses its plan lists in modulesByTrack (month
 * order). Only those count: quests done anywhere else (custom roadmap, standalone courses) do not.
 * Each phase unlocks only when the previous one is really done:
 *   1 training   → complete when every lesson of the curriculum is completed
 *   2 capstone   → complete when the project certificate is issued (or every sprint milestone passed)
 *   3 internship → complete when the internship certificate is issued
 *   4 graduation → complete when both certificates exist (only then can they be shared)
 */

export type CrashTrack = 'web_fullstack' | 'python_ai';
export type PhaseStatus = 'completed' | 'active' | 'locked';

interface CourseLike {
  id: string;
  quests?: ReadonlyArray<{ id?: unknown } | null | undefined>;
}

export interface CurriculumLesson {
  questId: string;
  courseId: string;
}

export interface CrashCourseProgress {
  courseIds: string[];
  total: number;
  completed: number;
  percent: number;
  /** Next lesson to do, in curriculum order (null once all are done). */
  next: CurriculumLesson | null;
  capstoneComplete: boolean;
  internshipComplete: boolean;
  phases: { training: PhaseStatus; capstone: PhaseStatus; internship: PhaseStatus; graduation: PhaseStatus };
}

const CAPSTONE_DEFENSE_PASS = 60;

export function getCrashCourseCurriculum(
  plan: Pick<CrashPlan, 'modulesByTrack'>,
  track: CrashTrack,
  registry: ReadonlyArray<CourseLike>
): CurriculumLesson[] {
  const modules = [...(plan.modulesByTrack?.[track] ?? [])].sort((a, b) => a.month - b.month);
  const lessons: CurriculumLesson[] = [];
  const seen = new Set<string>();
  for (const m of modules) {
    const course = registry.find((c) => c.id === m.courseId);
    for (const q of course?.quests ?? []) {
      const id = q && typeof q.id === 'string' ? q.id : '';
      if (id && !seen.has(id)) {
        seen.add(id);
        lessons.push({ questId: id, courseId: m.courseId });
      }
    }
  }
  return lessons;
}

export function isCapstoneComplete(enrollment: Pick<CrashCourseEnrollment, 'milestoneProgress' | 'certificatesIssued'> | null | undefined): boolean {
  if (!enrollment) return false;
  if (enrollment.certificatesIssued?.projectCertHash) return true;
  const m = enrollment.milestoneProgress;
  return Boolean(
    m?.sprint1Approved &&
    m.sprint2Approved &&
    m.sprint3RepoUrl &&
    typeof m.sprint4DefenseScore === 'number' &&
    m.sprint4DefenseScore >= CAPSTONE_DEFENSE_PASS
  );
}

export function getCrashCourseProgress(
  plan: Pick<CrashPlan, 'modulesByTrack'>,
  track: CrashTrack,
  registry: ReadonlyArray<CourseLike>,
  completedQuests: ReadonlyArray<string> | null | undefined,
  enrollment: Pick<CrashCourseEnrollment, 'milestoneProgress' | 'certificatesIssued'> | null | undefined
): CrashCourseProgress {
  const lessons = getCrashCourseCurriculum(plan, track, registry);
  const done = new Set(completedQuests ?? []);
  const completed = lessons.filter((l) => done.has(l.questId)).length;
  const total = lessons.length;
  const trainingDone = total > 0 && completed === total;
  const capstoneComplete = trainingDone && isCapstoneComplete(enrollment);
  const internshipComplete = capstoneComplete && Boolean(enrollment?.certificatesIssued?.internshipCertHash);

  const step = (isDone: boolean, previousDone: boolean): PhaseStatus =>
    isDone ? 'completed' : previousDone ? 'active' : 'locked';

  return {
    courseIds: Array.from(new Set(lessons.map((l) => l.courseId))),
    total,
    completed,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    next: lessons.find((l) => !done.has(l.questId)) ?? null,
    capstoneComplete,
    internshipComplete,
    phases: {
      training: step(trainingDone, true),
      capstone: step(capstoneComplete, trainingDone),
      internship: step(internshipComplete, capstoneComplete),
      graduation: step(capstoneComplete && internshipComplete, internshipComplete),
    },
  };
}
