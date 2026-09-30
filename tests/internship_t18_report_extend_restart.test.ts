import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateReportLength,
  countWords,
  buildReportCheckPrompt,
  checkReportRelevance,
} from '../src/lib/internships/finalReport';
import { setLlmJsonTransportForTests } from '../src/lib/server/llmJson';

test('countWords: correctly counts space-separated words', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('One two three'), 3);
  assert.equal(countWords('  One   two \n three \t four  '), 4);
});

test('validateReportLength: enforces 100 to 300 words (FR-T1-7 / T-18)', () => {
  const shortReport = Array(99).fill('word').join(' ');
  const resShort = validateReportLength(shortReport);
  assert.equal(resShort.ok, false);
  assert.equal(resShort.wordCount, 99);
  assert.ok(resShort.message?.includes('must be at least 100 words'));

  const longReport = Array(301).fill('word').join(' ');
  const resLong = validateReportLength(longReport);
  assert.equal(resLong.ok, false);
  assert.equal(resLong.wordCount, 301);
  assert.ok(resLong.message?.includes('cannot exceed 300 words'));

  const validReportMin = Array(100).fill('word').join(' ');
  assert.equal(validateReportLength(validReportMin).ok, true);

  const validReportMax = Array(300).fill('word').join(' ');
  assert.equal(validateReportLength(validReportMax).ok, true);

  const validReportMid = Array(200).fill('word').join(' ');
  assert.equal(validateReportLength(validReportMid).ok, true);
});

test('buildReportCheckPrompt: NEVER leaks hidden tests or reference solution (NFR-SEC-1)', () => {
  const prompt = buildReportCheckPrompt({
    companyName: 'Acme Cloud AI Inc.',
    tickets: [
      { title: 'Bug Fix in Log Parser', brief: 'Clean up datetime parsing exceptions.' },
      { title: 'Data Cleaning Module', brief: 'Deduplicate incoming telemetry records.' },
    ],
    report: 'I built five features for Acme Cloud AI Inc. One problem I encountered was...',
  });

  const fullPrompt = `${prompt.system}\n${prompt.user}`;

  assert.ok(fullPrompt.includes('Acme Cloud AI Inc.'));
  assert.ok(fullPrompt.includes('Bug Fix in Log Parser'));
  assert.ok(fullPrompt.includes('Data Cleaning Module'));
  assert.ok(fullPrompt.includes('One problem I encountered was'));

  assert.ok(!fullPrompt.includes('hidden_tests'));
  assert.ok(!fullPrompt.includes('reference_solution'));
});

test('checkReportRelevance: parses AI response for matching report', async () => {
  const fakeAiCheck = {
    matches: true,
    reason: 'The student accurately summarized all five tickets, addressed error handling challenges, and proposed concrete future improvements.',
  };

  setLlmJsonTransportForTests(async () => JSON.stringify(fakeAiCheck));

  try {
    const res = await checkReportRelevance({
      companyName: 'Acme AI',
      tickets: [{ title: 'T1', brief: 'Fix bug' }],
      report: Array(150).fill('learning').join(' '),
    });

    assert.equal(res.matches, true);
    assert.ok(res.reason.includes('summarized'));
  } finally {
    setLlmJsonTransportForTests(null);
  }
});

test('checkReportRelevance: parses AI response for off-topic report', async () => {
  const fakeAiCheck = {
    matches: false,
    reason: 'The submitted report is lorem ipsum filler and does not discuss any of the assigned engineering tickets.',
  };

  setLlmJsonTransportForTests(async () => JSON.stringify(fakeAiCheck));

  try {
    const res = await checkReportRelevance({
      companyName: 'Acme AI',
      tickets: [{ title: 'T1', brief: 'Fix bug' }],
      report: Array(150).fill('lorem').join(' '),
    });

    assert.equal(res.matches, false);
    assert.ok(res.reason.includes('lorem ipsum'));
  } finally {
    setLlmJsonTransportForTests(null);
  }
});

test('Internship extension business logic verification', () => {
  const baseDue = new Date('2026-10-14T10:00:00Z');
  const now = new Date('2026-10-10T10:00:00Z');

  // Adding 7 days
  const newDue = new Date(baseDue.getTime() + 7 * 24 * 60 * 60 * 1000);
  assert.equal(newDue.toISOString(), '2026-10-21T10:00:00.000Z');

  // Verify can only extend while active and unextended
  const canExtend = (status: string, extended: boolean, due: Date, curr: Date) => {
    if (status !== 'active') return false;
    if (extended) return false;
    if (curr > due) return false;
    return true;
  };

  assert.equal(canExtend('active', false, baseDue, now), true);
  assert.equal(canExtend('active', true, baseDue, now), false); // already extended
  assert.equal(canExtend('completed', false, baseDue, now), false); // not active
  assert.equal(canExtend('active', false, baseDue, new Date('2026-10-15T10:00:00Z')), false); // past due
});

test('Internship restart business logic verification', () => {
  const canRestart = (status: string, restarts: number, due: Date, curr: Date) => {
    const isExpired = status === 'expired' || (curr > due && status !== 'completed');
    if (!isExpired) return false;
    if (restarts >= 1) return false;
    return true;
  };

  const due = new Date('2026-10-10T10:00:00Z');
  const past = new Date('2026-10-12T10:00:00Z');
  const before = new Date('2026-10-08T10:00:00Z');

  assert.equal(canRestart('expired', 0, due, before), true);
  assert.equal(canRestart('active', 0, due, past), true); // past deadline
  assert.equal(canRestart('active', 0, due, before), false); // not expired yet
  assert.equal(canRestart('expired', 1, due, past), false); // restart limit reached
  assert.equal(canRestart('completed', 0, due, past), false); // already completed
});
