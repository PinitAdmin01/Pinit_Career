import crypto from 'crypto';
import { runPythonInSandbox } from '@/lib/server/pythonSandbox';
import { runJsInSandbox } from '@/lib/server/jsSandbox';
import type { InternshipTaskRow, InternshipEnrollmentRow, InternshipTaskLanguage } from './types';

export interface SubmissionEligibilityResult {
  ok: boolean;
  error?: string;
  message?: string;
  status?: number;
  shouldExpire?: boolean;
}

/**
 * Validates whether a student can submit code for a given task and enrollment (C4 / T-16).
 *
 * Rules:
 * 1. Task and enrollment must exist.
 * 2. Enrollment must belong to the authenticated student.
 * 3. Task must belong to the enrollment.
 * 4. Enrollment must be active. If past due_at, enrollment should be marked expired.
 * 5. Task must be 'open'. If locked or passed, reject with clear message.
 */
export function validateTaskSubmissionEligibility(opts: {
  task: Pick<InternshipTaskRow, 'id' | 'status' | 'internship_enrollment_id'> | null | undefined;
  enrollment: Pick<InternshipEnrollmentRow, 'id' | 'student_id' | 'status' | 'due_at'> | null | undefined;
  studentId: string;
  now?: Date;
}): SubmissionEligibilityResult {
  const { task, enrollment, studentId, now = new Date() } = opts;

  if (!task) {
    return {
      ok: false,
      error: 'TASK_NOT_FOUND',
      message: 'The requested internship ticket was not found.',
      status: 404,
    };
  }

  if (!enrollment) {
    return {
      ok: false,
      error: 'ENROLLMENT_NOT_FOUND',
      message: 'Internship enrollment record not found.',
      status: 404,
    };
  }

  if (enrollment.student_id !== studentId) {
    return {
      ok: false,
      error: 'FORBIDDEN',
      message: 'You do not have permission to submit to this ticket.',
      status: 403,
    };
  }

  if (task.internship_enrollment_id !== enrollment.id) {
    return {
      ok: false,
      error: 'MISMATCHED_ENROLLMENT',
      message: 'This ticket does not belong to the specified internship enrollment.',
      status: 400,
    };
  }

  // Check deadline expiration
  if (enrollment.due_at && now.getTime() > new Date(enrollment.due_at).getTime()) {
    return {
      ok: false,
      error: 'INTERNSHIP_EXPIRED',
      message: 'Your internship deadline has passed. Please restart the internship to continue.',
      status: 403,
      shouldExpire: true,
    };
  }

  if (enrollment.status === 'expired') {
    return {
      ok: false,
      error: 'INTERNSHIP_EXPIRED',
      message: 'Your internship has expired. Please restart the internship to continue.',
      status: 403,
    };
  }

  if (enrollment.status === 'completed') {
    return {
      ok: false,
      error: 'INTERNSHIP_COMPLETED',
      message: 'This internship is already completed.',
      status: 400,
    };
  }

  if (enrollment.status !== 'active') {
    return {
      ok: false,
      error: 'ENROLLMENT_NOT_ACTIVE',
      message: `Internship is not active (current status: ${enrollment.status}).`,
      status: 400,
    };
  }

  // Task status check
  if (task.status === 'passed') {
    return {
      ok: false,
      error: 'TASK_ALREADY_PASSED',
      message: 'This ticket has already been completed and passed.',
      status: 400,
    };
  }

  if (task.status === 'locked') {
    return {
      ok: false,
      error: 'TASK_LOCKED',
      message: 'This ticket is currently locked. Complete earlier tickets first.',
      status: 403,
    };
  }

  if (task.status !== 'open') {
    return {
      ok: false,
      error: 'TASK_NOT_OPEN',
      message: `Ticket is not open for submission (status: ${task.status}).`,
      status: 400,
    };
  }

  return { ok: true };
}

/**
 * Trims submission execution output to at most maxLen characters (default 4,000).
 */
export function trimSubmissionOutput(output: string, maxLen = 4000): string {
  if (!output) return '';
  if (output.length <= maxLen) return output;
  const suffix = '\n...[output truncated to 4,000 characters]';
  return output.slice(0, Math.max(0, maxLen - suffix.length)) + suffix;
}

/**
 * Instruments hidden Python tests so that:
 * 1. Each assert is numbered.
 * 2. Any failure prints ONLY "Hidden check N failed".
 * 3. Hidden test source code is NEVER printed to stdout or stderr.
 */
export function instrumentHiddenPythonTests(hiddenTests: string): string {
  const lines = hiddenTests.split('\n');
  const instrumented: string[] = [];
  let checkCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('assert ') || trimmed.startsWith('assert(')) {
      checkCount++;
      const indent = line.slice(0, line.indexOf('assert'));
      instrumented.push(`${indent}__pinit_hidden_check_idx = ${checkCount}`);
      instrumented.push(line);
    } else {
      instrumented.push(line);
    }
  }

  // If no lines had 'assert', ensure at least check 1 is set
  if (checkCount === 0) {
    checkCount = 1;
  }

  const indentedSuite = instrumented
    .map((l) => (l.trim() ? `    ${l}` : ''))
    .join('\n');

  return `__pinit_hidden_check_idx = 1
try:
${indentedSuite}
except AssertionError:
    raise AssertionError(f"Hidden check {__pinit_hidden_check_idx} failed") from None
except Exception:
    raise AssertionError(f"Hidden check {__pinit_hidden_check_idx} failed") from None
`;
}

/**
 * Instruments hidden JS/TS tests so that:
 * 1. Each check is numbered.
 * 2. Any failure prints ONLY "Hidden check N failed".
 * 3. Hidden test source code is NEVER printed to stdout or stderr.
 */
export function instrumentHiddenJsTests(hiddenTests: string): string {
  const lines = hiddenTests.split('\n');
  const instrumented: string[] = [];
  let checkCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('assert(') ||
      trimmed.startsWith('assert ') ||
      trimmed.startsWith('console.assert') ||
      trimmed.startsWith('if ') ||
      trimmed.startsWith('expect(') ||
      trimmed.includes('throw new Error') ||
      trimmed.includes('throw new')
    ) {
      checkCount++;
      instrumented.push(`__pinit_hidden_check_idx = ${checkCount};`);
      instrumented.push(line);
    } else {
      instrumented.push(line);
    }
  }

  if (checkCount === 0) {
    checkCount = 1;
  }

  return `let __pinit_hidden_check_idx = 1;
try {
${instrumented.join('\n')}
} catch (err: any) {
  throw new Error('Hidden check ' + __pinit_hidden_check_idx + ' failed');
}
`;
}

/**
 * Defense-in-depth sanitization: ensures hidden test source lines never appear in output.
 */
export function sanitizeHiddenOutput(
  rawOutput: string,
  hiddenTests: string,
  maxLen = 4000
): string {
  let cleaned = rawOutput;
  const secretLines = hiddenTests
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 5);

  for (const secret of secretLines) {
    if (cleaned.includes(secret)) {
      cleaned = cleaned.split(secret).join('[REDACTED]');
    }
  }

  return trimSubmissionOutput(cleaned, maxLen);
}

export interface TicketExecutionResult {
  passed: boolean;
  output: string;
  failedStage?: 'visible' | 'hidden';
}

/**
 * Runs student code against visible tests, and if passing, runs hidden tests.
 * Never exposes hidden test source code to output.
 */
export async function executeTicketCode(opts: {
  language: InternshipTaskLanguage;
  code: string;
  visibleTests: string;
  hiddenTests: string;
  sqlSetup?: string | null;
}): Promise<TicketExecutionResult> {
  const { language, code, visibleTests, hiddenTests, sqlSetup } = opts;

  if (language === 'typescript' || language === 'tsx') {
    // 1. Run visible tests
    const visibleRes = await runJsInSandbox({
      code,
      tests: visibleTests,
      language,
      timeoutMs: 4000,
    });

    if (!visibleRes.passed) {
      const errOut = visibleRes.stderr || visibleRes.stdout || visibleRes.error || 'Visible tests failed';
      return {
        passed: false,
        output: trimSubmissionOutput(errOut),
        failedStage: 'visible',
      };
    }

    // 2. Run hidden tests
    const instrumentedTests = instrumentHiddenJsTests(hiddenTests);
    const hiddenRes = await runJsInSandbox({
      code,
      tests: instrumentedTests,
      language,
      timeoutMs: 4000,
      hidden: true,
    });

    if (!hiddenRes.passed) {
      const combined = `${hiddenRes.stderr || ''}\n${hiddenRes.stdout || ''}\n${hiddenRes.error || ''}`;
      const match = combined.match(/Hidden check \d+ failed/);
      const safeOutput = match ? match[0] : 'Hidden check failed';

      return {
        passed: false,
        output: sanitizeHiddenOutput(safeOutput, hiddenTests),
        failedStage: 'hidden',
      };
    }

    return {
      passed: true,
      output: 'All tests passed (visible and hidden).',
    };
  }

  if (language === 'python') {
    // 1. Run visible tests
    const visibleSentinel = crypto.randomBytes(16).toString('hex');
    const visibleRes = await runPythonInSandbox({
      code,
      tests: visibleTests,
      timeoutMs: 4000,
      sentinel: visibleSentinel,
    });

    if (!visibleRes.passed) {
      const errOut = visibleRes.stderr || visibleRes.stdout || 'Visible tests failed';
      return {
        passed: false,
        output: trimSubmissionOutput(errOut),
        failedStage: 'visible',
      };
    }

    // 2. Run hidden tests (with source scrubbed and check instrumentation)
    const hiddenSentinel = crypto.randomBytes(16).toString('hex');
    const instrumentedTests = instrumentHiddenPythonTests(hiddenTests);
    const hiddenRes = await runPythonInSandbox({
      code,
      tests: instrumentedTests,
      timeoutMs: 4000,
      sentinel: hiddenSentinel,
    });

    if (!hiddenRes.passed) {
      const combined = `${hiddenRes.stderr || ''}\n${hiddenRes.stdout || ''}`;
      const match = combined.match(/Hidden check \d+ failed/);
      const safeOutput = match ? match[0] : 'Hidden check failed';

      return {
        passed: false,
        output: safeOutput,
        failedStage: 'hidden',
      };
    }

    return {
      passed: true,
      output: 'All tests passed (visible and hidden).',
    };
  }

  // SQL ticket execution (Tier 2 readiness)
  const { runSqlVerification } = await import('./validateTask');
  const visibleSql = await runSqlVerification(sqlSetup || '', code, visibleTests);
  if (!visibleSql.passed) {
    return {
      passed: false,
      output: trimSubmissionOutput(visibleSql.error || 'Visible SQL check failed'),
      failedStage: 'visible',
    };
  }

  const hiddenSql = await runSqlVerification(sqlSetup || '', code, hiddenTests);
  if (!hiddenSql.passed) {
    return {
      passed: false,
      output: 'Hidden check failed',
      failedStage: 'hidden',
    };
  }

  return {
    passed: true,
    output: 'All tests passed (visible and hidden).',
  };
}
