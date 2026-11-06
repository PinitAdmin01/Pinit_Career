import type { CourseQuest } from './coursesData';
import { parseQuestId } from './curriculumEnricher';

export const DAYS_PER_TEST = 5;
export const QUESTIONS_PER_DAY = 2;
export const MIN_QUESTIONS = 3;

export interface TestQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

/** `${prefix}-test-days-${start}-${end}` -> its parts, or null for any other id. */
export function parseTestQuestId(questId: string): { prefix: string; start: number; end: number } | null {
  const match = (questId || '').match(/^(.+)-test-days-(\d+)-(\d+)$/);
  if (!match) return null;
  const start = parseInt(match[2], 10);
  const end = parseInt(match[3], 10);
  if (!(start >= 1 && end >= start)) return null;
  return { prefix: match[1], start, end };
}

export function testQuestId(prefix: string, start: number, end: number): string {
  return `${prefix}-test-days-${start}-${end}`;
}

/**
 * The options with the right one moved to a fixed spot picked by the seed.
 * Written checks tend to put the right answer first; this keeps the same order on every visit.
 */
export function withAnswerAt(options: string[], correct: number | string, seed: number): { options: string[]; answerIndex: number } {
  if (!Array.isArray(options) || options.length === 0) {
    return { options: ['Optimal design', 'Suboptimal design'], answerIndex: 0 };
  }
  let resolvedCorrect = 0;
  if (typeof correct === 'number' && Number.isInteger(correct) && correct >= 0 && correct < options.length) {
    resolvedCorrect = correct;
  } else if (typeof correct === 'string') {
    const idx = options.findIndex((opt) => opt.trim() === correct.trim());
    if (idx >= 0) {
      resolvedCorrect = idx;
    } else if (/^\d+$/.test(correct.trim())) {
      const parsed = parseInt(correct.trim(), 10);
      resolvedCorrect = parsed >= 0 && parsed < options.length ? parsed : 0;
    } else {
      resolvedCorrect = 0;
    }
  }
  const answer = options[resolvedCorrect];
  const wrong = options.filter((_, i) => i !== resolvedCorrect);
  const answerIndex = ((seed % (wrong.length + 1)) + (wrong.length + 1)) % (wrong.length + 1);
  const reordered = [...wrong];
  reordered.splice(answerIndex, 0, answer);
  return { options: reordered, answerIndex };
}

/**
 * Inserts a test after every 5 days of a course's day-by-day quests (and after the last day).
 * Courses whose quests are not day-based are returned unchanged. Existing quest ids never change.
 */
export function addBlockTests(quests: CourseQuest[]): CourseQuest[] {
  const days = quests
    .map((q) => parseQuestId(q.id))
    .filter((p): p is { prefix: string; dayNum: number } => p !== null);
  if (days.length === 0) return quests;
  const prefix = days[0].prefix;
  const lastDay = Math.max(...days.map((d) => d.dayNum));

  const dayTitle = (day: number) =>
    quests.find((q) => q.id === `${prefix}-lecture1-day-${day}`)?.title.replace(/^Day \d+:\s*/, '') || `Day ${day}`;

  const out: CourseQuest[] = [];
  quests.forEach((quest, i) => {
    out.push(quest);
    const parsed = parseQuestId(quest.id);
    if (!parsed) return;
    const nextParsed = parseQuestId(quests[i + 1]?.id || '');
    const lastQuestOfDay = !nextParsed || nextParsed.dayNum !== parsed.dayNum;
    const day = parsed.dayNum;
    if (!lastQuestOfDay || (day % DAYS_PER_TEST !== 0 && day !== lastDay)) return;

    const start = Math.floor((day - 1) / DAYS_PER_TEST) * DAYS_PER_TEST + 1;
    const questionCount = (day - start + 1) * QUESTIONS_PER_DAY;
    if (questionCount < MIN_QUESTIONS) return;
    const range = start === day ? `Day ${day}` : `Days ${start}–${day}`;
    out.push({
      id: testQuestId(prefix, start, day),
      title: `Test: ${range}`,
      desc: `${questionCount} questions about ${range}. You need 70% to pass, and you can try again.`,
      type: 'lecture',
      category: 'exam',
      requiresAvatar: true,
      syllabus: [],
      skillCategory: 'theory',
      xp: 200,
      pins: 10,
      testDays: Array.from({ length: day - start + 1 }, (_, k) => dayTitle(start + k)),
    });
  });
  return out;
}
