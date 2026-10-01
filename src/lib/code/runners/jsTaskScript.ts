// src/lib/code/runners/jsTaskScript.ts
// Grades a JavaScript or TSX practice task whose test suite is plain JavaScript that throws when a check fails:
//   if (add(2, 3) !== 5) throw new Error('add(2, 3) must return 5');
// The student's code and the checks run together as one script in the sandbox. The checks sit
// inside an async function, so they can use await and their variable names never clash with the
// student's.

import { SuiteExecutionResult } from '../types';
import { executeInTwoLayerSandbox } from '../sandbox/sandboxedIframeRunner';
import { getReactRuntime } from '../react/reactRuntime';

export const REACT_RENDER_HELPER_SCRIPT = `
const render = function (Component, props) {
  const R = globalThis.__PINIT_REACT__ || { React: globalThis.React, renderToStaticMarkup: globalThis.renderToStaticMarkup };
  if (!R || !R.renderToStaticMarkup || !R.React) {
    throw new Error('React render runtime is not loaded.');
  }
  return R.renderToStaticMarkup(R.React.createElement(Component, props || {}));
};
globalThis.render = render;
`;

/** The script the sandbox runs: the student's code, then the task's checks. */
export function buildJsTaskScript(
  code: string,
  testSuite: string,
  options?: { language?: string; runtimeScript?: string }
): string {
  const parts: string[] = [];
  if (options?.runtimeScript) {
    parts.push(options.runtimeScript);
  }
  if (options?.language === 'tsx') {
    parts.push(REACT_RENDER_HELPER_SCRIPT);
  }
  parts.push(code);
  parts.push(';\nreturn (async () => {\n' + testSuite + '\n})();');
  return parts.join('\n;\n');
}

/** The result the practice screen shows. On failure, the first test outcome's error is the check's message. */
export function jsTaskResult(
  passed: boolean,
  error: string | null | undefined,
  stdout: string,
  durationMs: number
): SuiteExecutionResult {
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
export async function executeJsTaskScript(
  code: string,
  testSuite: string,
  timeoutMs: number,
  options?: { language?: string }
): Promise<SuiteExecutionResult> {
  const start = Date.now();
  let runtimeScript: string | undefined;

  if (options?.language === 'tsx') {
    try {
      runtimeScript = await getReactRuntime();
    } catch (err: any) {
      return jsTaskResult(false, `Failed to load React runtime: ${err?.message || err}`, '', 0);
    }
  }

  const script = buildJsTaskScript(code, testSuite, {
    language: options?.language,
    runtimeScript,
  });

  const result = await executeInTwoLayerSandbox(script, {
    mode: 'script',
    functionName: 'none',
    testCases: [],
    timeoutMs,
  });
  return jsTaskResult(
    result.allPassed && !result.error,
    result.error,
    result.stdout || '',
    Date.now() - start
  );
}
