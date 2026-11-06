import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveInterviewQuestions,
  NON_TECH_QUESTIONS,
  TECH_QUESTIONS_BY_DIFFICULTY,
} from '../src/app/api/interview/generate-questions/route';

test('AI Interview Block 48 - Dynamic Question Generator Suite', async (t) => {
  await t.test('resolves tech coding questions across easy, normal, and hard difficulties', () => {
    for (const diff of ['easy', 'normal', 'hard'] as const) {
      const res = resolveInterviewQuestions('tech', 'software', diff);
      assert.equal(res.stream, 'tech');
      assert.equal(res.difficulty, diff);
      assert.ok(Array.isArray(res.questions));
      assert.ok(res.questions.length > 0);
      for (const q of res.questions) {
        assert.equal(q.type, 'code');
        assert.ok(typeof q.title === 'string');
        assert.ok(typeof q.description === 'string');
        assert.ok(typeof q.defaultCode === 'string');
        assert.ok(Array.isArray(q.tests));
        assert.ok(q.tests.length > 0);
      }
    }
  });

  await t.test('resolves all 5 non-tech subtopics: finance, marketing, bba, hr, operations', () => {
    const topics = ['finance', 'marketing', 'bba', 'hr', 'operations'];
    for (const topic of topics) {
      const res = resolveInterviewQuestions('non_tech', topic, 'normal');
      assert.equal(res.stream, 'non_tech');
      assert.equal(res.topic, topic);
      assert.ok(res.questions.length > 0);
      for (const q of res.questions) {
        assert.equal(q.type, 'worksheet');
        assert.ok(Array.isArray(q.fields));
        assert.ok(q.fields.length >= 1);
        assert.ok(typeof q.promptHint === 'string');
      }
    }
  });

  await t.test('progressive fallback: handles unknown subtopics gracefully', () => {
    const res = resolveInterviewQuestions('non_tech', 'quantum_astrophysics_arbitrage', 'normal');
    assert.equal(res.stream, 'non_tech');
    assert.equal(res.topic, 'finance'); // Falls back to default finance
    assert.ok(res.questions.length > 0);
  });

  await t.test('progressive fallback: handles invalid difficulty gracefully', () => {
    const res = resolveInterviewQuestions('tech', 'software', 'extreme_nightmare' as any);
    assert.equal(res.difficulty, 'normal');
    assert.ok(res.questions.length > 0);
  });

  await t.test('progressive fallback: handles missing arguments without throwing', () => {
    const res = resolveInterviewQuestions();
    assert.equal(res.stream, 'tech');
    assert.equal(res.difficulty, 'normal');
    assert.ok(res.questions.length > 0);
  });
});
