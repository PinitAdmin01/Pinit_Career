import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { QUESTS_REGISTRY } from '@/lib/data/questsData';

export interface AuthoritativeQuest {
  id: string;
  title: string;
  desc?: string;
  type?: string;
  category?: 'learning' | 'exam' | 'assignment' | string;
  xp: number;
  pins: number;
  testSuite?: string;
  starterCode?: string;
}

// Global cached index across all courses and quests for O(1) server-side verification
let questIndex: Map<string, AuthoritativeQuest> | null = null;

function buildIndex(): Map<string, AuthoritativeQuest> {
  const map = new Map<string, AuthoritativeQuest>();

  // 1. Index COURSES_REGISTRY quests (authoritative with explicit xp and pins)
  for (const course of COURSES_REGISTRY) {
    for (const q of course.quests || []) {
      if (!q.id) continue;
      const category = q.category || (q.id.includes('-exam-') || q.id.includes('exam') ? 'exam' : 'learning');
      map.set(q.id, {
        id: q.id,
        title: q.title || q.id,
        desc: q.desc,
        type: q.type,
        category,
        xp: typeof q.xp === 'number' && q.xp > 0 ? q.xp : 100,
        pins: typeof q.pins === 'number' && q.pins >= 0 ? q.pins : 5,
        testSuite: q.testSuite,
        starterCode: q.starterCode,
      });
    }
  }

  // 2. Index QUESTS_REGISTRY (legacy and standalone quests)
  for (const q of QUESTS_REGISTRY) {
    if (!q.id || map.has(q.id)) continue;
    map.set(q.id, {
      id: q.id,
      title: q.title || q.id,
      desc: q.desc,
      type: q.type,
      category: q.id.includes('exam') ? 'exam' : 'learning',
      xp: 100,
      pins: 5,
      testSuite: q.testSuite,
      starterCode: q.starterCode,
    });
  }

  return map;
}

/**
 * Authoritative lookup for a quest by ID.
 * Returns null if the quest does not exist in any registered course or quest definition.
 */
export function getAuthoritativeQuest(questId: string): AuthoritativeQuest | null {
  if (!questId || typeof questId !== 'string') return null;
  if (!questIndex) {
    questIndex = buildIndex();
  }
  return questIndex.get(questId.trim()) || null;
}

/**
 * Returns canonical XP reward for a quest from the registry.
 * Returns null if the quest does not exist.
 */
export function getAuthoritativeQuestXp(questId: string): number | null {
  const quest = getAuthoritativeQuest(questId);
  return quest ? quest.xp : null;
}

/**
 * Checks whether a quest is legitimately classified as an exam by server registry.
 */
export function isAuthoritativeExam(questId: string): boolean {
  const quest = getAuthoritativeQuest(questId);
  if (!quest) return false;
  return quest.category === 'exam' || quest.id.includes('-exam-');
}

/**
 * Resolves authoritative test suite code for the quest.
 */
export function getAuthoritativeTestSuite(questId: string): string | null {
  const quest = getAuthoritativeQuest(questId);
  return quest?.testSuite || null;
}
