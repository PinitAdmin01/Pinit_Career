import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAnswerQuality } from '../src/lib/interview/evaluationQuality';

test('normalizes answer-quality scores and retains exact quotes from candidate answers', () => {
  const result = normalizeAnswerQuality({
    question_relevance: 82.4,
    answer_accuracy: 109,
    reasoning_depth: -5,
    conclusion_quality: 'unknown',
    evidence: [
      {
        dimension: 'reasoningDepth',
        quote: 'I chose caching because reads dominate.',
        assessment: 'Connects the design choice to a stated workload.',
      },
      {
        dimension: 'answerAccuracy',
        quote: 'The database is always infinitely scalable.',
        assessment: 'This quote was not actually said.',
      },
    ],
  }, ['I chose caching because reads dominate.']);

  assert.deepEqual(result, {
    questionRelevance: 82,
    answerAccuracy: 100,
    reasoningDepth: 0,
    conclusionQuality: null,
    evidence: [{
      dimension: 'reasoningDepth',
      quote: 'I chose caching because reads dominate.',
      assessment: 'Connects the design choice to a stated workload.',
    }],
  });
});

test('omits answer-quality output when the model returns no usable scores', () => {
  assert.equal(normalizeAnswerQuality({ evidence: [] }, ['Any answer']), null);
  assert.equal(normalizeAnswerQuality(null, ['Any answer']), null);
});
