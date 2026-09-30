import { parseQuestId } from '@/lib/data/curriculumEnricher';
import { parseTestQuestId } from '@/lib/data/courseTests';
import type { CrashCourseProgress } from '@/lib/courses/crashCourseProgress';

/**
 * What an enrolled student needs to see first on the certificate course tab:
 * the next task, where they are in the course, the next test and the final project status.
 */

interface QuestLike {
  id: string;
  title?: string;
  category?: string;
}
interface CourseLike {
  id: string;
  quests?: ReadonlyArray<QuestLike | null | undefined>;
}

export type TaskKind = 'Lesson' | 'Practice' | 'Test';

export interface TodaySummary {
  /** The next task to do, or null when every task is done. */
  next: { title: string; kind: TaskKind; day: number | null } | null;
  /** Course day of the next task, and how many days the course has. */
  day: number | null;
  totalDays: number;
  tasksDone: number;
  tasksTotal: number;
  percent: number;
  /** The next test not yet passed, and how many tasks come before it. */
  nextTest: { title: string; tasksBefore: number } | null;
  /** Final project: locked until every task is done. */
  project: 'locked' | 'open' | 'done';
  tasksLeftBeforeProject: number;
}

function kindOf(quest: QuestLike): TaskKind {
  if (parseTestQuestId(quest.id)) return 'Test';
  return /-lecture1-day-\d+$/.test(quest.id) ? 'Lesson' : 'Practice';
}

function dayOf(questId: string): number | null {
  return parseQuestId(questId)?.dayNum ?? parseTestQuestId(questId)?.end ?? null;
}

export function getTodaySummary(
  progress: Pick<CrashCourseProgress, 'total' | 'completed' | 'percent' | 'next' | 'phases'> & { courseIds?: string[] },
  registry: ReadonlyArray<CourseLike>,
  completedQuests: ReadonlyArray<string>,
  curriculum: ReadonlyArray<{ questId: string; courseId: string }>
): TodaySummary {
  const questById = new Map<string, QuestLike>();
  for (const course of registry) {
    for (const q of course.quests ?? []) if (q && typeof q.id === 'string') questById.set(q.id, q);
  }
  const done = new Set(completedQuests);

  const nextQuest = progress.next ? questById.get(progress.next.questId) : undefined;
  const next = progress.next
    ? {
        title: nextQuest?.title || progress.next.questId,
        kind: nextQuest ? kindOf(nextQuest) : 'Lesson' as TaskKind,
        day: dayOf(progress.next.questId),
      }
    : null;

  const days = curriculum.map((l) => dayOf(l.questId)).filter((d): d is number => d !== null);
  const totalDays = days.length ? Math.max(...days) : 0;

  const remaining = curriculum.filter((l) => !done.has(l.questId));
  const testIndex = remaining.findIndex((l) => parseTestQuestId(l.questId));
  const nextTest = testIndex >= 0
    ? { title: questById.get(remaining[testIndex].questId)?.title || 'Test', tasksBefore: testIndex }
    : null;

  const project = progress.phases.capstone === 'completed' ? 'done' : progress.phases.capstone === 'active' ? 'open' : 'locked';

  return {
    next,
    day: next?.day ?? null,
    totalDays,
    tasksDone: progress.completed,
    tasksTotal: progress.total,
    percent: progress.percent,
    nextTest,
    project,
    tasksLeftBeforeProject: Math.max(0, progress.total - progress.completed),
  };
}
