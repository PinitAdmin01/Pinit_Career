import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CodeReviewSchema,
  buildCodeReviewPrompt,
  generateCodeReview,
} from '../src/lib/internships/codeReview';
import { setLlmJsonTransportForTests } from '../src/lib/server/llmJson';

test('CodeReviewSchema: validates valid code review structure', () => {
  const valid = {
    scores: {
      correctness: 5,
      readability: 4,
      edgeCases: 4,
      naming: 5,
    },
    strengths: [
      'Clean separation of concerns with descriptive variable names.',
      'Comprehensive error handling for boundary cases.',
    ],
    improvements: [
      'Consider using list comprehension for cleaner syntax.',
      'Type annotations could improve long-term maintainability.',
    ],
  };

  const parsed = CodeReviewSchema.safeParse(valid);
  assert.equal(parsed.success, true);
});

test('CodeReviewSchema: rejects invalid scores and insufficient items', () => {
  // Score out of bounds (> 5)
  const invalidScore = {
    scores: { correctness: 6, readability: 4, edgeCases: 4, naming: 5 },
    strengths: ['Strength 1', 'Strength 2'],
    improvements: ['Improvement 1', 'Improvement 2'],
  };
  assert.equal(CodeReviewSchema.safeParse(invalidScore).success, false);

  // Score < 1
  const negativeScore = {
    scores: { correctness: 0, readability: 4, edgeCases: 4, naming: 5 },
    strengths: ['Strength 1', 'Strength 2'],
    improvements: ['Improvement 1', 'Improvement 2'],
  };
  assert.equal(CodeReviewSchema.safeParse(negativeScore).success, false);

  // Only 1 strength (needs at least 2)
  const tooFewStrengths = {
    scores: { correctness: 5, readability: 4, edgeCases: 4, naming: 5 },
    strengths: ['Only one strength'],
    improvements: ['Improvement 1', 'Improvement 2'],
  };
  assert.equal(CodeReviewSchema.safeParse(tooFewStrengths).success, false);
});

test('buildCodeReviewPrompt: NEVER leaks hidden tests or reference solution (NFR-SEC-1)', () => {
  const secretHiddenTest = 'assert __SECRET_TOKEN__ == 42';
  const secretRefSolution = 'def secret_solve(): return 42';

  const prompt = buildCodeReviewPrompt({
    title: 'Customer Data Parsing Bug',
    brief: 'Fix customer email normalization.',
    starterCode: 'def normalize_email(e): pass',
    code: 'def normalize_email(e): return e.strip().lower()',
  });

  const fullPrompt = `${prompt.system}\n${prompt.user}`;

  assert.ok(fullPrompt.includes('Customer Data Parsing Bug'));
  assert.ok(fullPrompt.includes('Fix customer email normalization.'));
  assert.ok(fullPrompt.includes('return e.strip().lower()'));

  // Ensure secret strings are not present
  assert.ok(!fullPrompt.includes(secretHiddenTest));
  assert.ok(!fullPrompt.includes(secretRefSolution));
  assert.ok(!fullPrompt.includes('hidden_tests'));
  assert.ok(!fullPrompt.includes('reference_solution'));
});

test('generateCodeReview: returns structured review when AI succeeds', async () => {
  const fakeReview = {
    scores: {
      correctness: 5,
      readability: 5,
      edgeCases: 4,
      naming: 4,
    },
    strengths: [
      'Very clean and concise Python code.',
      'Handles edge cases gracefully.',
    ],
    improvements: [
      'Add docstrings for functions.',
      'Could use type hints for inputs.',
    ],
  };

  setLlmJsonTransportForTests(async () => JSON.stringify(fakeReview));

  try {
    const review = await generateCodeReview({
      title: 'Fix parsing bug',
      brief: 'Parse emails cleanly',
      code: 'def parse(x): return x.strip()',
    });

    assert.ok(review !== null);
    assert.equal(review?.scores.correctness, 5);
    assert.equal(review?.strengths.length, 2);
  } finally {
    setLlmJsonTransportForTests(null);
  }
});

test('generateCodeReview: returns null on failure or error without throwing', async () => {
  // Transport throws an error
  setLlmJsonTransportForTests(async () => {
    throw new Error('API Rate Limit or Connection Error');
  });

  try {
    const review = await generateCodeReview({
      title: 'Fix parsing bug',
      brief: 'Parse emails cleanly',
      code: 'def parse(x): return x.strip()',
    });

    assert.equal(review, null);
  } finally {
    setLlmJsonTransportForTests(null);
  }
});

test('generateCodeReview: respects timeout and returns null on hang', async () => {
  // Transport hangs
  setLlmJsonTransportForTests(
    () => new Promise((resolve) => setTimeout(() => resolve('{}'), 5000))
  );

  try {
    const review = await generateCodeReview({
      title: 'Fix parsing bug',
      brief: 'Parse emails cleanly',
      code: 'def parse(x): return x.strip()',
      timeoutMs: 1000, // Short timeout for test
    });

    assert.equal(review, null);
  } finally {
    setLlmJsonTransportForTests(null);
  }
});
