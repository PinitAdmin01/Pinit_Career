import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeAnswerQuality,
  ANSWER_QUALITY_DIMENSIONS,
} from '../src/lib/interview/evaluationQuality';

test('AI Interview Block 49 - Rubrics & Exact Quote Extractor Suite', async (t) => {
  await t.test('normalizes answer-quality scores and retains exact quotes from candidate answers', () => {
    const candidateAnswers = [
      'First of all, I chose caching because reads dominate.',
      'We partition our Postgres tables by customer region to minimize cross-datacenter latency.'
    ];

    const result = normalizeAnswerQuality({
      question_relevance: 82.4,
      answer_accuracy: 109,
      reasoning_depth: -5,
      conclusion_quality: 95.2,
      evidence: [
        {
          dimension: 'reasoningDepth',
          quote: 'I chose caching because reads dominate.',
          assessment: 'Connects the design choice to a stated workload.',
        },
        {
          dimension: 'answerAccuracy',
          quote: 'We partition our Postgres tables by customer region',
          assessment: 'Demonstrates clear multi-tenant relational partitioning knowledge.',
        },
        {
          dimension: 'answerAccuracy',
          quote: 'The database is always infinitely scalable without trade-offs.',
          assessment: 'Hallucinated quote — candidate never said this.',
        },
      ],
    }, candidateAnswers);

    assert.deepEqual(result, {
      questionRelevance: 82,
      answerAccuracy: 100,
      reasoningDepth: 0,
      conclusionQuality: 95,
      evidence: [
        {
          dimension: 'reasoningDepth',
          quote: 'I chose caching because reads dominate.',
          assessment: 'Connects the design choice to a stated workload.',
        },
        {
          dimension: 'answerAccuracy',
          quote: 'We partition our Postgres tables by customer region',
          assessment: 'Demonstrates clear multi-tenant relational partitioning knowledge.',
        },
      ],
    });
  });

  await t.test('enforces zero hallucination: strictly drops quotes not present in transcript', () => {
    const candidateTranscript = [
      'We use an optimistic concurrency lock on our inventory table.'
    ];

    const rawEvaluation = {
      question_relevance: 75,
      answer_accuracy: 80,
      reasoning_depth: 85,
      conclusion_quality: 70,
      evidence: [
        {
          dimension: 'reasoningDepth',
          quote: 'We use Redis distributed locks with Redlock algorithm.',
          assessment: 'Candidate claimed using Redlock.',
        },
        {
          dimension: 'conclusionQuality',
          quote: 'In conclusion, microservices solve all organizational issues.',
          assessment: 'Generic hallucinated conclusion.',
        }
      ]
    };

    const normalized = normalizeAnswerQuality(rawEvaluation, candidateTranscript);
    assert.ok(normalized);
    assert.equal(normalized.evidence.length, 0); // Both hallucinated quotes dropped
  });

  await t.test('rejects short / trivial / placeholder quotes under 8 characters', () => {
    const candidateAnswers = ['Yes', 'Okay', 'I agree with that.'];
    const rawEvaluation = {
      answer_accuracy: 80,
      evidence: [
        { dimension: 'answerAccuracy', quote: 'Yes', assessment: 'Affirmative response' },
        { dimension: 'answerAccuracy', quote: 'Okay', assessment: 'Acknowledged' },
        { dimension: 'answerAccuracy', quote: 'I agree with that.', assessment: 'Substantive agreement' },
      ]
    };

    const normalized = normalizeAnswerQuality(rawEvaluation, candidateAnswers);
    assert.ok(normalized);
    assert.equal(normalized.evidence.length, 1);
    assert.equal(normalized.evidence[0].quote, 'I agree with that.');
  });

  await t.test('omits answer-quality output when the model returns no usable scores', () => {
    assert.equal(normalizeAnswerQuality({ evidence: [] }, ['Any answer']), null);
    assert.equal(normalizeAnswerQuality(null, ['Any answer']), null);
  });
});
