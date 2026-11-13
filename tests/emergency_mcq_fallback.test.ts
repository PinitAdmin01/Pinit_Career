import test from 'node:test';
import assert from 'node:assert/strict';

import { makeEmergencyFallbackQuestions } from '../src/app/quests/lesson/hooks/useLessonEngine';
import type { TestQuestion } from '../src/lib/data/blockTests';

test('FIX-004: makeEmergencyFallback produces complete TestQuestion objects with valid properties', () => {
  const prefix = 'sample-track';
  const startDay = 1;
  const endDay = 4;
  const questions: TestQuestion[] = makeEmergencyFallbackQuestions(prefix, startDay, endDay);

  // 1. Fallback produces complete TestQuestion objects
  assert.equal(questions.length, 4, 'Must produce exactly one question per day in the range');
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    assert.equal(typeof q.question, 'string', 'Question text must be a string');
    assert.ok(q.question.length > 0, 'Question text must not be empty');
    assert.ok(Array.isArray(q.options), 'Options must be an array');
    assert.equal(q.options.length, 4, 'Options must have exactly four choices');
    assert.equal(typeof q.answerIndex, 'number', 'answerIndex must be a number');
    assert.ok(q.answerIndex >= 0 && q.answerIndex < 4, 'answerIndex must be in range [0, 3]');
    assert.equal(typeof q.explanation, 'string', 'Explanation must be a string');
    assert.ok(q.explanation.length > 0, 'Explanation must not be empty');
  }
});

test('FIX-004: makeEmergencyFallback preserves question text and explanation matching curriculum standard', () => {
  const prefix = 'demo-track';
  const day = 7;
  const [q] = makeEmergencyFallbackQuestions(prefix, day, day);

  // 2. Original question text is preserved
  const expectedQuestion = `Diagnostic Assessment Day ${day}: What is the core requirement for Day ${day} in the ${prefix} syllabus?`;
  assert.equal(q.question, expectedQuestion, 'Question text must preserve the exact template with day and prefix');

  // 3. Original explanation is preserved
  const expectedExplanation = `Engineering standard for Day ${day} demands verified implementation matching the curriculum rubric.`;
  assert.equal(q.explanation, expectedExplanation, 'Explanation must preserve the exact standard rubric statement');
});

test('FIX-004: makeEmergencyFallback retains all 4 options without loss or duplication and matches answerIndex', () => {
  const prefix = 'test-track';
  const correctAnswer = 'Implement the required functionality according to specification and verify with tests';
  const wrongOptions = [
    'Skip test verification and push incomplete code directly to production',
    'Bypass input validation checks in the pipeline',
    'Hardcode mock credentials in production source code',
  ];
  const allOriginalOptions = [correctAnswer, ...wrongOptions];

  const questions = makeEmergencyFallbackQuestions(prefix, 1, 8);

  for (const q of questions) {
    // 4. All four options remain present without loss or duplication
    assert.equal(q.options.length, 4, 'Every question must have exactly 4 options');
    const uniqueOptions = new Set(q.options);
    assert.equal(uniqueOptions.size, 4, 'All 4 options must be unique (no duplication)');
    for (const opt of allOriginalOptions) {
      assert.ok(uniqueOptions.has(opt), `Missing original option: "${opt}"`);
    }

    // 5. The correct answer matches answerIndex
    assert.equal(
      q.options[q.answerIndex],
      correctAnswer,
      `options[answerIndex] must be the correct answer "${correctAnswer}"`
    );
  }
});

test('FIX-004: makeEmergencyFallback rotates correct answer through all 4 positions across 4 consecutive days', () => {
  const prefix = 'rotation-track';

  // Test across block days 1..4
  const block1 = makeEmergencyFallbackQuestions(prefix, 1, 4);
  const indices1 = block1.map((q) => q.answerIndex);
  // 6. Across four consecutive days, answerIndex rotates through 0, 1, 2, 3
  assert.deepEqual(indices1, [0, 1, 2, 3], 'Days 1-4 must rotate answerIndex through [0, 1, 2, 3]');

  // Test across block days 5..8
  const block2 = makeEmergencyFallbackQuestions(prefix, 5, 8);
  const indices2 = block2.map((q) => q.answerIndex);
  assert.deepEqual(indices2, [0, 1, 2, 3], 'Days 5-8 must rotate answerIndex through [0, 1, 2, 3]');

  // Test single day offset check
  const [day10] = makeEmergencyFallbackQuestions(prefix, 10, 10);
  assert.equal(day10.answerIndex, (10 - 1) % 4, 'Day 10 must rotate to (10 - 1) % 4 === 1');
});

test('FIX-004: makeEmergencyFallback is 100% deterministic for the same day', () => {
  const prefix = 'determinism-track';
  const run1 = makeEmergencyFallbackQuestions(prefix, 1, 10);
  const run2 = makeEmergencyFallbackQuestions(prefix, 1, 10);

  // 7. The rotation is deterministic for the same day
  assert.deepEqual(run1, run2, 'Repeated runs must produce identical questions, options ordering, and answer indices');
});
