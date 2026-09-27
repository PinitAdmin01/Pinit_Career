/**
 * Custom roadmap (quests sub-tab 2) completion.
 *
 * The roadmap is onboarding_answers.roadmap_modules; each module lists quests. It is complete when
 * every quest in it is in the student's completed quests (users.completed_quests, recorded by
 * /api/quest/complete). The first time that happens, a completion marker is saved in
 * onboarding_answers so the next steps (project, interview, certificate) can start from it.
 * The marker lives in student-editable data: anything that issues a credential must re-check
 * completion on the server.
 */

interface RoadmapModuleLike {
  quests?: ReadonlyArray<{ id?: unknown } | null | undefined> | null;
}

export interface RoadmapProgress {
  total: number;
  completed: number;
  percent: number;
  isComplete: boolean;
  /** First quest not yet completed, in roadmap order. */
  nextQuestId: string | null;
}

export interface RoadmapCompletionRecord {
  roadmap_completed_at: string;
  roadmap_completed_course: string | null;
  roadmap_completed_quests: number;
}

export function getRoadmapProgress(
  modules: ReadonlyArray<RoadmapModuleLike | null | undefined> | null | undefined,
  completedQuests: ReadonlyArray<string> | null | undefined
): RoadmapProgress {
  const done = new Set(completedQuests ?? []);
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const m of modules ?? []) {
    for (const q of m?.quests ?? []) {
      const id = q && typeof q.id === 'string' ? q.id : '';
      if (id && !seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }
  }
  const completed = ids.filter((id) => done.has(id)).length;
  const total = ids.length;
  return {
    total,
    completed,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    isComplete: total > 0 && completed === total,
    nextQuestId: ids.find((id) => !done.has(id)) ?? null,
  };
}

/**
 * True once per roadmap: it is complete and no completion has been recorded for this course yet
 * (a roadmap regenerated for another course gets its own record).
 */
export function shouldRecordRoadmapCompletion(
  progress: RoadmapProgress,
  answers: Readonly<Record<string, unknown>> | null | undefined,
  courseId: string | null | undefined
): boolean {
  if (!progress.isComplete) return false;
  const recorded = typeof answers?.roadmap_completed_at === 'string' && answers.roadmap_completed_at !== '';
  if (!recorded) return true;
  return (answers?.roadmap_completed_course ?? null) !== (courseId || null);
}

export function buildRoadmapCompletionRecord(
  progress: RoadmapProgress,
  courseId: string | null | undefined,
  now: Date = new Date()
): RoadmapCompletionRecord {
  return {
    roadmap_completed_at: now.toISOString(),
    roadmap_completed_course: courseId || null,
    roadmap_completed_quests: progress.total,
  };
}
