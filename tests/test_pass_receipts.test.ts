import test from 'node:test';
import assert from 'node:assert/strict';

import { getTestQuestions, testQuestId } from '../src/lib/data/courseTests';
import { gradeCourseTest, questNeedsPassReceipt } from '../src/lib/courses/gradeTest';
import { RECEIPT_TTL_MS, signPassReceipt, verifyPassReceipt } from '../src/lib/server/passReceipt';

const SECRET = 'test-secret';
const QUEST = testQuestId('dsa-py', 1, 5);

test('course tests are marked on the server with the same questions the quiz shows', () => {
  const questions = getTestQuestions('dsa-py', 1, 5);
  assert.ok(questions.length >= 3, 'the test has questions');

  const right = questions.map((q) => q.answerIndex);
  assert.deepEqual(gradeCourseTest(QUEST, right), { ok: true, correct: questions.length, total: questions.length, percent: 100, passed: true });

  const wrong = questions.map((q) => (q.answerIndex + 1) % q.options.length);
  const failed = gradeCourseTest(QUEST, wrong);
  assert.ok(failed.ok && !failed.passed && failed.correct === 0, 'all wrong answers fail');

  // Exactly the pass mark: 70% or more passes, just under fails.
  const needed = Math.ceil(questions.length * 0.7);
  const atMark = questions.map((q, i) => (i < needed ? q.answerIndex : (q.answerIndex + 1) % q.options.length));
  const belowMark = questions.map((q, i) => (i < needed - 1 ? q.answerIndex : (q.answerIndex + 1) % q.options.length));
  assert.ok((gradeCourseTest(QUEST, atMark) as { passed: boolean }).passed, `${needed}/${questions.length} passes`);
  assert.ok(!(gradeCourseTest(QUEST, belowMark) as { passed: boolean }).passed, `${needed - 1}/${questions.length} fails`);

  const unanswered = right.map((a, i) => (i === 0 ? null : a));
  assert.ok(gradeCourseTest(QUEST, unanswered).ok, 'an unanswered question counts as wrong, not as an error');
});

test('malformed submissions are refused', () => {
  const questions = getTestQuestions('dsa-py', 1, 5);
  assert.deepEqual(gradeCourseTest(QUEST, questions.slice(1).map((q) => q.answerIndex)), { ok: false, error: 'BAD_ANSWERS' });
  assert.deepEqual(gradeCourseTest(QUEST, 'all correct'), { ok: false, error: 'BAD_ANSWERS' });
  assert.deepEqual(gradeCourseTest(QUEST, questions.map(() => 1.5)), { ok: false, error: 'BAD_ANSWERS' });
  assert.deepEqual(gradeCourseTest('dsa-py-lecture1-day-1', [0]), { ok: false, error: 'NOT_A_TEST' });
});

test('only course tests need a server pass receipt', () => {
  assert.equal(questNeedsPassReceipt(QUEST), true);
  assert.equal(questNeedsPassReceipt('dsa-py-lecture1-day-1'), false);
  assert.equal(questNeedsPassReceipt('dsa-py-assign-day-3'), false);
});

test('pass receipts are bound to the student, the quest and a time window', () => {
  const now = 1_790_000_000_000;
  const receipt = signPassReceipt('user-1', QUEST, now, SECRET);
  assert.ok(verifyPassReceipt(receipt, 'user-1', QUEST, now + 1000, SECRET), 'valid for the same student and quest');
  assert.ok(!verifyPassReceipt(receipt, 'user-2', QUEST, now, SECRET), 'another student cannot reuse it');
  assert.ok(!verifyPassReceipt(receipt, 'user-1', testQuestId('dsa-py', 6, 10), now, SECRET), 'not valid for another test');
  assert.ok(!verifyPassReceipt(receipt, 'user-1', QUEST, now + RECEIPT_TTL_MS + 1, SECRET), 'expires');
  assert.ok(!verifyPassReceipt(receipt, 'user-1', QUEST, now, 'other-secret'), 'cannot be forged without the secret');
  const tampered = receipt.replace(/.$/, (c) => (c === '0' ? '1' : '0'));
  assert.ok(!verifyPassReceipt(tampered, 'user-1', QUEST, now, SECRET), 'a changed signature fails');
  for (const junk of [undefined, null, '', 'yes', 123, `${now}.abc`]) {
    assert.ok(!verifyPassReceipt(junk, 'user-1', QUEST, now, SECRET), `rejects ${String(junk)}`);
  }
});
