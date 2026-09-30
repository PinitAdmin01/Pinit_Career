// src/lib/code/runners/jsTaskScript.ts
// Grades a JavaScript practice task whose test suite is plain JavaScript that throws when a check fails:
//   if (add(2, 3) !== 5) throw new Error('add(2, 3) must return 5');
// The student's code and the checks run together as one script in the sandbox. The checks sit
// inside an async function, so they can use await and their variable names never clash with the
// student's.

import { SuiteExecutionResult } from '../types';
import { executeInTwoLayerSandbox } from '../sandbox/sandboxedIframeRunner';

/** The script the sandbox runs: the student's code, then the task's checks. */
export function buildJsTaskScript(code: string, testSuite: string): string {
  return `${code}\n;\nreturn (async () => {\n${testSuite}\n})();`;
}

/** The result the practice screen shows. On failure, the first test outcome's error is the check's message. */
export function jsTaskResult(passed: boolean, error: string | null | undefined, stdout: string, durationMs: number): SuiteExecutionResult {
  const message = passed ? 'All checks passed.' : (error || 'A check failed.');
  const logs = [];
  if (stdout) logs.push(`stdout: ${stdout}`);
  logs.push(passed ? `[PASS] ${message}` : `[FAIL] ${message}`);
  return {
    language: 'javascript',
    totalTests: 1,
    passedTests: passed ? 1 : 0,
    failedTests: passed ? 0 : 1,
    allPassed: passed,
    status: passed ? 'SUCCESS' : (/exceeded|timed out/i.test(message) ? 'TIMEOUT' : 'RUNTIME_ERROR'),
    totalDurationMs: durationMs,
    terminalLogs: logs,
    testOutcomes: [{
      index: 1,
      testCaseName: 'Task checks',
      input: '',
      expectedOutput: 'All checks pass',
      actualOutput: passed ? 'All checks pass' : message,
      passed,
      error: passed ? undefined : message,
      durationMs,
    }],
    stdout,
    error: passed ? undefined : message,
  };
}

/** Runs the student's code and the task's checks in the browser sandbox. */
export async function executeJsTaskScript(code: string, testSuite: string, timeoutMs: number): Promise<SuiteExecutionResult> {
  const start = Date.now();
  const result = await executeInTwoLayerSandbox(buildJsTaskScript(code, testSuite), {
    mode: 'script',
    functionName: 'none',
    testCases: [],
    timeoutMs,
  });
  return jsTaskResult(result.allPassed && !result.error, result.error, result.stdout || '', Date.now() - start);
}
