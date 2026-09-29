import { getTestQuestions, parseTestQuestId } from '@/lib/data/courseTests';

/** Share of correct answers needed to pass a course test (the quiz screen says 70%). */
export const TEST_PASS_PERCENT = 70;

export type TestGrade =
  | { ok: true; correct: number; total: number; percent: number; passed: boolean }
  | { ok: false; error: 'NOT_A_TEST' | 'NO_QUESTIONS' | 'BAD_ANSWERS' };

/**
 * Marks a course test (`${prefix}-test-days-${start}-${end}`) from the chosen option indexes, using
 * the same questions the quiz screen shows. Runs on the server, so the result does not depend on
 * what the browser reports.
 */
export function gradeCourseTest(questId: string, answers: unknown): TestGrade {
  const test = parseTestQuestId(questId);
  if (!test) return { ok: false, error: 'NOT_A_TEST' };
  const questions = getTestQuestions(test.prefix, test.start, test.end);
  if (questions.length === 0) return { ok: false, error: 'NO_QUESTIONS' };
  if (!Array.isArray(answers) || answers.length !== questions.length) return { ok: false, error: 'BAD_ANSWERS' };
  if (!answers.every((a) => a === null || (Number.isInteger(a) && a >= 0 && a < 10))) {
    return { ok: false, error: 'BAD_ANSWERS' };
  }
  const correct = questions.filter((q, i) => answers[i] === q.answerIndex).length;
  const percent = Math.round((correct / questions.length) * 100);
  return { ok: true, correct, total: questions.length, percent, passed: (correct / questions.length) * 100 >= TEST_PASS_PERCENT };
}

/** Quests that /api/quest/complete only records with a server pass receipt. */
export function questNeedsPassReceipt(questId: string): boolean {
  return parseTestQuestId(questId) !== null;
}
