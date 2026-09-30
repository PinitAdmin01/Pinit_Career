import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTaskSubmissionEligibility,
  instrumentHiddenPythonTests,
  trimSubmissionOutput,
  sanitizeHiddenOutput,
  executeTicketCode,
} from '../src/lib/internships/submission';

test('validateTaskSubmissionEligibility: rejects missing task or enrollment', () => {
  const res1 = validateTaskSubmissionEligibility({
    task: null,
    enrollment: { id: 'en-1', student_id: 'user-1', status: 'active', due_at: null },
    studentId: 'user-1',
  });
  assert.equal(res1.ok, false);
  assert.equal(res1.error, 'TASK_NOT_FOUND');

  const res2 = validateTaskSubmissionEligibility({
    task: { id: 'task-1', status: 'open', internship_enrollment_id: 'en-1' },
    enrollment: null,
    studentId: 'user-1',
  });
  assert.equal(res2.ok, false);
  assert.equal(res2.error, 'ENROLLMENT_NOT_FOUND');
});

test('validateTaskSubmissionEligibility: enforces student ownership and enrollment match', () => {
  const task = { id: 'task-1', status: 'open' as const, internship_enrollment_id: 'en-1' };
  const enrollment = { id: 'en-1', student_id: 'user-1', status: 'active' as const, due_at: null };

  // Another user tries to submit
  const resForbidden = validateTaskSubmissionEligibility({
    task,
    enrollment,
    studentId: 'attacker-id',
  });
  assert.equal(resForbidden.ok, false);
  assert.equal(resForbidden.error, 'FORBIDDEN');

  // Task enrollment id mismatch
  const resMismatch = validateTaskSubmissionEligibility({
    task: { ...task, internship_enrollment_id: 'other-en' },
    enrollment,
    studentId: 'user-1',
  });
  assert.equal(resMismatch.ok, false);
  assert.equal(resMismatch.error, 'MISMATCHED_ENROLLMENT');
});

test('validateTaskSubmissionEligibility: handles deadline expiration and expired status', () => {
  const now = new Date('2026-10-15T12:00:00Z');
  const pastDeadline = '2026-10-14T12:00:00Z';
  const futureDeadline = '2026-10-20T12:00:00Z';

  const task = { id: 'task-1', status: 'open' as const, internship_enrollment_id: 'en-1' };

  // Past deadline triggers shouldExpire
  const resExpiredTime = validateTaskSubmissionEligibility({
    task,
    enrollment: { id: 'en-1', student_id: 'user-1', status: 'active', due_at: pastDeadline },
    studentId: 'user-1',
    now,
  });
  assert.equal(resExpiredTime.ok, false);
  assert.equal(resExpiredTime.error, 'INTERNSHIP_EXPIRED');
  assert.equal(resExpiredTime.shouldExpire, true);

  // Future deadline allows submission
  const resValidTime = validateTaskSubmissionEligibility({
    task,
    enrollment: { id: 'en-1', student_id: 'user-1', status: 'active', due_at: futureDeadline },
    studentId: 'user-1',
    now,
  });
  assert.equal(resValidTime.ok, true);

  // Status already expired
  const resAlreadyExpired = validateTaskSubmissionEligibility({
    task,
    enrollment: { id: 'en-1', student_id: 'user-1', status: 'expired', due_at: null },
    studentId: 'user-1',
    now,
  });
  assert.equal(resAlreadyExpired.ok, false);
  assert.equal(resAlreadyExpired.error, 'INTERNSHIP_EXPIRED');
});

test('validateTaskSubmissionEligibility: checks task statuses (locked, passed, open)', () => {
  const enrollment = { id: 'en-1', student_id: 'user-1', status: 'active' as const, due_at: null };

  // Locked task
  const resLocked = validateTaskSubmissionEligibility({
    task: { id: 'task-2', status: 'locked', internship_enrollment_id: 'en-1' },
    enrollment,
    studentId: 'user-1',
  });
  assert.equal(resLocked.ok, false);
  assert.equal(resLocked.error, 'TASK_LOCKED');

  // Passed task
  const resPassed = validateTaskSubmissionEligibility({
    task: { id: 'task-1', status: 'passed', internship_enrollment_id: 'en-1' },
    enrollment,
    studentId: 'user-1',
  });
  assert.equal(resPassed.ok, false);
  assert.equal(resPassed.error, 'TASK_ALREADY_PASSED');

  // Open task
  const resOpen = validateTaskSubmissionEligibility({
    task: { id: 'task-1', status: 'open', internship_enrollment_id: 'en-1' },
    enrollment,
    studentId: 'user-1',
  });
  assert.equal(resOpen.ok, true);
});

test('instrumentHiddenPythonTests: injects check index counters and catches failure cleanly', () => {
  const hiddenTests = `
# Check 1
assert add(1, 2) == 3
# Check 2
assert add(-1, 1) == 0
# Check 3
assert add(0, 0) == 0
`.trim();

  const instrumented = instrumentHiddenPythonTests(hiddenTests);

  assert.ok(instrumented.includes('__pinit_hidden_check_idx = 1'));
  assert.ok(instrumented.includes('__pinit_hidden_check_idx = 2'));
  assert.ok(instrumented.includes('__pinit_hidden_check_idx = 3'));
  assert.ok(instrumented.includes('Hidden check {__pinit_hidden_check_idx} failed'));
  assert.ok(instrumented.includes('__PINIT_TESTS_PASSED__'));
});

test('trimSubmissionOutput: bounds output to 4,000 characters', () => {
  const shortText = 'All checks passed.';
  assert.equal(trimSubmissionOutput(shortText), shortText);

  const longText = 'A'.repeat(5000);
  const trimmed = trimSubmissionOutput(longText);
  assert.ok(trimmed.length <= 4000, 'trimmed output is at most 4,000 chars');
  assert.ok(trimmed.includes('[output truncated to 4,000 characters]'));
});

test('sanitizeHiddenOutput: redacts hidden test source lines from output', () => {
  const hiddenTests = `assert calculate_secret_tax(100) == 15.5\nassert calculate_secret_tax(0) == 0`;
  const rawOutput = `Error occurred: assert calculate_secret_tax(100) == 15.5 failed!`;

  const sanitized = sanitizeHiddenOutput(rawOutput, hiddenTests);
  assert.ok(!sanitized.includes('calculate_secret_tax(100) == 15.5'), 'secret line is removed');
  assert.ok(sanitized.includes('[REDACTED]'), 'redacted placeholder inserted');
});

test('executeTicketCode: passes valid SQL practice checks and rejects failing ones', async () => {
  const sqlSetup = `
    CREATE TABLE members (id INT PRIMARY KEY, name TEXT, active BOOLEAN);
    INSERT INTO members VALUES (1, 'Alice', true), (2, 'Bob', false), (3, 'Charlie', true);
  `;
  const code = `SELECT name FROM members WHERE active = true ORDER BY name;`;
  const visibleTests = `SELECT count(*) = 2 AS ok, 'Two active members returned' AS msg FROM answer;`;
  const hiddenTests = `SELECT count(*) = 1 AS ok, 'Alice is active' AS msg FROM answer WHERE name = 'Alice';`;

  const passRes = await executeTicketCode({
    language: 'sql',
    code,
    visibleTests,
    hiddenTests,
    sqlSetup,
  });

  assert.equal(passRes.passed, true);
  assert.ok(passRes.output.includes('All tests passed'));

  const failCode = `SELECT name FROM members WHERE active = false;`;
  const failRes = await executeTicketCode({
    language: 'sql',
    code: failCode,
    visibleTests: `SELECT count(*) = 1 AS ok, 'Alice is active' AS msg FROM answer WHERE name = 'Alice';`,
    hiddenTests,
    sqlSetup,
  });

  assert.equal(failRes.passed, false);
  assert.equal(failRes.failedStage, 'visible');
});
