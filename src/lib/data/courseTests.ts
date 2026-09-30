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

/** A predict-the-output check before its answer choices are made (see getTestQuestions). */
interface OutputQuestion {
  question: string;
  answer: string;
  explanation: string;
  seed: number;
}

/** 'number', 'code' (like VALIDATION_FAILED), 'colour' (#ffffff) or 'text', so a wrong choice looks like the right one. */
function answerShape(answer: string): string {
  if (/^[-+$]?[\d.,]+%?$/.test(answer.trim())) return 'number';
  if (/^[A-Z][A-Z0-9]*(_[A-Z0-9]+)+$/.test(answer.trim())) return 'code';
  if (/^#[0-9a-f]{3,8}$/i.test(answer.trim())) return 'colour';
  return 'text';
}

/** Same pick every time for the same question, so a retake shows the same test. */
function seededOrder<T>(items: T[], seed: number): T[] {
  return items
    .map((item, i) => ({ item, key: Math.sin(seed * 9301 + i * 49297) }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.item);
}

/**
 * The right output among 3 wrong ones. The wrong ones are other lessons' outputs of the same shape
 * (a number among numbers, a code among codes), so the answer cannot be spotted without knowing it.
 */
function withChoices(q: OutputQuestion, pool: string[]): TestQuestion {
  const others = [...new Set(pool)].filter((a) => a !== q.answer);
  const sameShape = seededOrder(others.filter((a) => answerShape(a) === answerShape(q.answer)), q.seed);
  const otherShape = seededOrder(others.filter((a) => answerShape(a) !== answerShape(q.answer)), q.seed);
  const fallback = ['undefined', 'null', 'An error'].filter((a) => a !== q.answer);
  const wrong = [...sameShape, ...otherShape, ...fallback].slice(0, 3);
  const answerIndex = q.seed % (wrong.length + 1);
  const options = [...wrong];
  options.splice(answerIndex, 0, q.answer);
  return { question: q.question, options, answerIndex, explanation: q.explanation };
}

function outputQuestionsForDay(prefix: string, day: number): OutputQuestion[] {
  if (getLongLesson(prefix, day)) return [];
  const plan = resolvePilotDay(prefix, day);
  const blocks: any[] = Array.isArray(plan?.blocks) ? plan.blocks : [];
  const out: OutputQuestion[] = [];
  blocks.forEach((block, i) => {
    const d = block?.diagnosticCheck;
    const question = d?.questionPrompt || d?.question;
    const hasOptions = Array.isArray(d?.options) && d.options.length >= 2 && typeof d.correctIndex === 'number';
    if (question && !hasOptions && typeof d.expectedStringOutput === 'string' && d.expectedStringOutput) {
      out.push({ question, answer: d.expectedStringOutput, explanation: typeof d.explanation === 'string' ? d.explanation : '', seed: day * 7 + i });
    }
  });
  return out;
}

/**
 * The options with the right one moved to a fixed spot picked by the seed. Written checks tend to put
 * the right answer first; this keeps the same order on every visit while not always using the top.
 */
export function withAnswerAt(options: string[], correct: number, seed: number): { options: string[]; answerIndex: number } {
  const rest = seededOrder(options.filter((_, i) => i !== correct), seed);
  const answerIndex = seed % options.length;
  rest.splice(answerIndex, 0, options[correct]);
  return { options: rest, answerIndex };
}

/**
 * A lesson block's check as a multiple-choice question, or null if it has none. Written checks put
 * the right answer first, so it is moved to a fixed spot picked by the seed. Predict-the-output
 * checks get their wrong choices from `pool` (see withChoices).
 */
function checkQuestion(block: any, seed: number, pool: string[]): TestQuestion | null {
  const d = block?.diagnosticCheck;
  const question = d?.questionPrompt || d?.question;
  if (!question) return null;
  const explanation = typeof d.explanation === 'string' ? d.explanation : '';
  if (Array.isArray(d.options) && d.options.length >= 2 && typeof d.correctIndex === 'number' && d.options[d.correctIndex] !== undefined) {
    return { question, ...withAnswerAt(d.options, d.correctIndex, seed), explanation };
  }
  if (typeof d.expectedStringOutput === 'string' && d.expectedStringOutput) {
    return withChoices({ question, answer: d.expectedStringOutput, explanation, seed }, pool);
  }
  return null;
}

/** Outputs of the lessons from 10 days before `start` to 10 days after `end`: the wrong choices. */
function outputPool(prefix: string, start: number, end: number): string[] {
  const pool: string[] = [];
  for (let day = Math.max(1, start - 10); day <= end + 10; day++) pool.push(...outputQuestionsForDay(prefix, day).map((q) => q.answer));
  return pool;
}

function questionsForDay(prefix: string, day: number, pool: string[] = []): TestQuestion[] {
  const long = getLongLesson(prefix, day);
  if (long) {
    return spread(long.parts.map((p, i) => ({ p, i })), QUESTIONS_PER_DAY).map(({ p, i }) => ({
      question: p.check.question,
      ...withAnswerAt(p.check.options, p.check.answer, day * 7 + i),
      explanation: p.check.why,
    }));
  }

  const plan = resolvePilotDay(prefix, day);
  const blocks: any[] = Array.isArray(plan?.blocks) ? plan.blocks : [];
  const fromPlan = blocks
    .map((block, i) => checkQuestion(block, day * 7 + i, pool))
    .filter((q): q is TestQuestion => q !== null);
  return spread(fromPlan, QUESTIONS_PER_DAY);
}

/** The check question shown after block `blockIndex` of a lesson day, with its answer choices. */
export function getLessonCheck(prefix: string, day: number, blockIndex: number): TestQuestion | null {
  const plan = resolvePilotDay(prefix, day);
  const block = Array.isArray(plan?.blocks) ? plan.blocks[blockIndex] : null;
  if (!block) return null;
  return checkQuestion(block, day * 7 + blockIndex, outputPool(prefix, day, day));
}

/** The questions of the test covering days start..end of a course (empty if the days have none). */
export function getTestQuestions(prefix: string, start: number, end: number): TestQuestion[] {
  // Wrong choices come from the outputs of the lessons around this block (10 days either side).
  const pool = outputPool(prefix, start, end);
  const out: TestQuestion[] = [];
  for (let day = start; day <= end; day++) out.push(...questionsForDay(prefix, day, pool));
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
