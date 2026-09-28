/**
 * A short test after every 5 course days.
 *
 * Each course day is a lesson followed by two practice tasks. Instead of an exam straight after a
 * single lesson, a test comes after every 5 days (and after the last day) and covers those days.
 * Its questions are the check questions of the days' lessons: 2 per day, so about 10 per test.
 * Pass mark 70%, and it can be retaken.
 */
import type { CourseQuest } from './coursesData';
import { parseQuestId, resolvePilotDay } from './curriculumEnricher';
import { getLongLesson } from './longLessons';

export const DAYS_PER_TEST = 5;
const QUESTIONS_PER_DAY = 2;
const MIN_QUESTIONS = 3;

export interface TestQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

/** `${prefix}-test-days-${start}-${end}` → its parts, or null for any other id. */
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

/** Spread picks across a list: 2 of 6 → indexes 1 and 4, not just the first two. */
function spread<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items;
  const step = items.length / count;
  return Array.from({ length: count }, (_, i) => items[Math.floor(step * i + step / 2)]);
}

function questionsForDay(prefix: string, day: number): TestQuestion[] {
  const long = getLongLesson(prefix, day);
  if (long) {
    return spread(long.parts, QUESTIONS_PER_DAY).map((p) => ({
      question: p.check.question,
      options: p.check.options,
      answerIndex: p.check.answer,
      explanation: p.check.why,
    }));
  }

  const plan = resolvePilotDay(prefix, day);
  const blocks: any[] = Array.isArray(plan?.blocks) ? plan.blocks : [];
  const fromPlan: TestQuestion[] = [];
  blocks.forEach((block, i) => {
    const d = block?.diagnosticCheck;
    const question = d?.questionPrompt || d?.question;
    if (!question) return;
    if (Array.isArray(d.options) && d.options.length >= 2 && typeof d.correctIndex === 'number' && d.options[d.correctIndex] !== undefined) {
      fromPlan.push({ question, options: d.options, answerIndex: d.correctIndex, explanation: typeof d.explanation === 'string' ? d.explanation : '' });
    } else if (typeof d.expectedStringOutput === 'string' && d.expectedStringOutput) {
      // Predict-the-output checks: offer the right output among two common wrong answers, at a varying position.
      const wrong = ['undefined', 'null', 'An error'].filter((w) => w !== d.expectedStringOutput).slice(0, 2);
      const answerIndex = (day + i) % 3;
      const options = [...wrong];
      options.splice(answerIndex, 0, d.expectedStringOutput);
      fromPlan.push({ question, options, answerIndex, explanation: typeof d.explanation === 'string' ? d.explanation : '' });
    }
  });
  return spread(fromPlan, QUESTIONS_PER_DAY);
}

/** The questions of the test covering days start..end of a course (empty if the days have none). */
export function getTestQuestions(prefix: string, start: number, end: number): TestQuestion[] {
  const out: TestQuestion[] = [];
  for (let day = start; day <= end; day++) out.push(...questionsForDay(prefix, day));
  return out;
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
    const questions = getTestQuestions(prefix, start, day);
    if (questions.length < MIN_QUESTIONS) return;
    const range = start === day ? `Day ${day}` : `Days ${start}–${day}`;
    out.push({
      id: testQuestId(prefix, start, day),
      title: `Test: ${range}`,
      desc: `${questions.length} questions about ${range}. You need 70% to pass, and you can try again.`,
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
