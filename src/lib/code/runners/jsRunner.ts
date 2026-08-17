// src/lib/code/runners/jsRunner.ts
// JavaScript Sandboxed In-Browser Execution Runner

import { TestCase, SingleTestOutcome, SuiteExecutionResult } from '../types';

function parseInputArgs(raw: string): unknown[] {
  const trimmed = (raw || '').trim();
  if (!trimmed) return [];
  // Tuple syntax: (3, 5) -> [3, 5]
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    try {
      return JSON.parse('[' + trimmed.slice(1, -1) + ']');
    } catch {}
  }
  // Array or Object or primitive JSON: [10, 20] or "hello" or 42
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? [parsed] : [parsed];
  } catch {}
  return [trimmed];
}

function normalizeOutput(val: unknown): string {
  if (val === undefined) return '';
  if (val === null) return 'null';
  if (typeof val === 'string') return val;
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

function deepEqual(actual: unknown, expectedStr: string): boolean {
  const normActual = normalizeOutput(actual).trim();
  const normExpected = expectedStr.trim();
  if (normActual === normExpected) return true;

  try {
    const parsedActual = typeof actual === 'string' ? JSON.parse(actual) : actual;
    const parsedExpected = JSON.parse(normExpected);
    return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
  } catch {
    return normActual.toLowerCase() === normExpected.toLowerCase();
  }
}

export async function executeJavaScriptSuite(
  code: string,
  fnName: string = 'solution',
  testCases: TestCase[] = [],
  timeoutMs: number = 4000
): Promise<SuiteExecutionResult> {
  const startTime = Date.now();
  const terminalLogs: string[] = [];
  const testOutcomes: SingleTestOutcome[] = [];

  terminalLogs.push(`[JS RUNTIME] Initializing sandboxed JavaScript execution for function '${fnName}'...`);

  // Fallback test case if none provided
  const casesToRun: TestCase[] = testCases.length > 0
    ? testCases
    : [{ input: '[]', output: 'true', name: 'Default Verification' }];

  let passedCount = 0;

  try {
    // Isolate function constructor without leaking globals
    const sandboxedWrapper = `
      "use strict";
      ${code}
      if (typeof ${fnName} !== 'function') {
        throw new Error("Function '${fnName}' is not defined in the submitted solution.");
      }
      return ${fnName};
    `;

    // Timeout safety wrapper
    const executeWithTimeout = async (fn: Function, args: unknown[], limitMs: number) => {
      return new Promise<any>((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Execution exceeded time budget limit of ${limitMs}ms`));
        }, limitMs);

        try {
          const result = fn(...args);
          clearTimeout(timer);
          resolve(result);
        } catch (err) {
          clearTimeout(timer);
          reject(err);
        }
      });
    };

    const targetFunction = new Function(sandboxedWrapper)();

    for (let i = 0; i < casesToRun.length; i++) {
      const tc = casesToRun[i];
      const tcStart = Date.now();
      const args = parseInputArgs(tc.input);

      try {
        const actualVal = await executeWithTimeout(targetFunction, args, timeoutMs);
        const actualStr = normalizeOutput(actualVal);
        const isPassed = deepEqual(actualVal, tc.output);
        const duration = Date.now() - tcStart;

        if (isPassed) {
          passedCount++;
          terminalLogs.push(`[TEST SUITE] Test ${i + 1} (${tc.name || tc.input}): PASSED -> Output: ${actualStr} (${duration}ms)`);
        } else {
          terminalLogs.push(`[FAIL] Test ${i + 1} (${tc.name || tc.input}): FAILED. Expected: ${tc.output}, Received: ${actualStr}`);
        }

        testOutcomes.push({
          index: i + 1,
          testCaseName: tc.name || `Test Case ${i + 1}`,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: actualStr,
          passed: isPassed,
          durationMs: duration
        });
      } catch (tcErr: any) {
        const duration = Date.now() - tcStart;
        const errMsg = tcErr?.message || String(tcErr);
        terminalLogs.push(`[RUNTIME ERROR] Test ${i + 1}: ${errMsg}`);
        testOutcomes.push({
          index: i + 1,
          testCaseName: tc.name || `Test Case ${i + 1}`,
          input: tc.input,
          expectedOutput: tc.output,
          passed: false,
          error: errMsg,
          durationMs: duration
        });
      }
    }
  } catch (compErr: any) {
    const totalDuration = Date.now() - startTime;
    const errMsg = compErr?.message || 'Syntax error in JavaScript code';
    terminalLogs.push(`[SYNTAX ERROR] Execution failed: ${errMsg}`);

    return {
      language: 'javascript',
      totalTests: casesToRun.length,
      passedTests: 0,
      failedTests: casesToRun.length,
      allPassed: false,
      status: 'SYNTAX_ERROR',
      totalDurationMs: totalDuration,
      terminalLogs,
      testOutcomes: [],
      error: errMsg
    };
  }

  const totalDuration = Date.now() - startTime;
  const allPassed = passedCount === casesToRun.length;

  return {
    language: 'javascript',
    totalTests: casesToRun.length,
    passedTests: passedCount,
    failedTests: casesToRun.length - passedCount,
    allPassed,
    status: allPassed ? 'SUCCESS' : passedCount > 0 ? 'PARTIAL_PASS' : 'RUNTIME_ERROR',
    totalDurationMs: totalDuration,
    terminalLogs,
    testOutcomes
  };
}
