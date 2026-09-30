import {
  INTERNSHIP_AVAILABLE,
  INTERNSHIP_TIER_AVAILABLE,
  PLAN_TIER_TO_INTERNSHIP,
  type InternshipTier,
  type CrashPlan,
} from '../data/crashPlansData';
import type { CrashCourseEnrollment } from '../services/crashCourseEnrollmentService';

/**
 * Progress of a purchased certificate course (quests sub-tab 1).
 *
 * The course's own lessons are the quests of the courses its plan lists in modulesByTrack (month
 * order). Only those count: quests done anywhere else (custom roadmap, standalone courses) do not.
 * Each phase unlocks only when the previous one is really done:
 *   1 training   → complete when every lesson of the curriculum is completed
 *   2 capstone   → complete when every sprint milestone passed (or the project certificate exists)
 *   3 internship → complete when the internship certificate is issued (only when tier switch is ON)
 *   4 graduation → complete when the certificate(s) are issued (only then can they be shared)
 * While the internship tier is off, graduation follows the capstone directly.
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
  phases: {
    training: PhaseStatus;
    capstone: PhaseStatus;
    internship: PhaseStatus;
    graduation: PhaseStatus;
  };
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

export function isCapstoneComplete(
  enrollment: Pick<CrashCourseEnrollment, 'milestoneProgress' | 'certificatesIssued'> | null | undefined
): boolean {
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

export function resolvePlanInternshipTier(
  plan?: { tier?: string; id?: string } | null,
  enrollment?: { planId?: string; tier?: string } | null
): InternshipTier | null {
  const tier = plan?.tier || enrollment?.tier;
  if (tier && tier in PLAN_TIER_TO_INTERNSHIP) {
    return PLAN_TIER_TO_INTERNSHIP[tier as keyof typeof PLAN_TIER_TO_INTERNSHIP];
  }
  const planId = plan?.id || enrollment?.planId;
  if (planId) {
    if (planId.includes('1m')) return 't1_job_sim';
    if (planId.includes('3m')) return 't2_virtual_team';
    if (planId.includes('6m')) return 't3_project';
    if (planId.includes('9m')) return 't4_industry';
    if (planId.includes('12m')) return 't5_fellowship';
  }
  return null;
}

export function isInternshipTierAvailable(
  plan?: { tier?: string; id?: string } | null,
  enrollment?: { planId?: string; tier?: string } | null,
  tierSwitchOverride?: Partial<Record<InternshipTier, boolean>>
): boolean {
  const tier = resolvePlanInternshipTier(plan, enrollment);
  if (!tier) return false;
  if (tierSwitchOverride && tier in tierSwitchOverride) {
    return Boolean(tierSwitchOverride[tier]);
  }
  return Boolean(INTERNSHIP_TIER_AVAILABLE[tier]);
}

export function getCrashCourseProgress(
  plan: Pick<CrashPlan, 'modulesByTrack'> & { tier?: string; id?: string },
  track: CrashTrack,
  registry: ReadonlyArray<CourseLike>,
  completedQuests: ReadonlyArray<string> | null | undefined,
  enrollment: (Pick<CrashCourseEnrollment, 'milestoneProgress' | 'certificatesIssued'> & { planId?: string; tier?: string }) | null | undefined,
  options: {
    includeInternship?: boolean;
    tierSwitchOverride?: Partial<Record<InternshipTier, boolean>>;
  } = {}
): CrashCourseProgress {
  const perTierAvailable = isInternshipTierAvailable(plan, enrollment, options.tierSwitchOverride);
  const includeInternship = options.includeInternship ?? perTierAvailable;
  const lessons = getCrashCourseCurriculum(plan, track, registry);
  const done = new Set(completedQuests ?? []);
  const completed = lessons.filter((l) => done.has(l.questId)).length;
  const total = lessons.length;
  const trainingDone = total > 0 && completed === total;
  const capstoneComplete = trainingDone && isCapstoneComplete(enrollment);
  const internshipComplete = includeInternship && capstoneComplete && Boolean(enrollment?.certificatesIssued?.internshipCertHash);
  const readyToGraduate = includeInternship ? internshipComplete : capstoneComplete;
  const graduated = readyToGraduate && Boolean(enrollment?.certificatesIssued?.projectCertHash);

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
      internship: includeInternship ? step(internshipComplete, capstoneComplete) : 'locked',
      graduation: step(graduated, readyToGraduate),
    },
  };
}
