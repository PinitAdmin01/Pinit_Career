// src/lib/code/runners/jsRunner.ts
// JavaScript Sandboxed In-Browser Execution Runner
// Dual-mode: Two-layer sandbox (Opaque Iframe + Web Worker) in browser, isolated VM in headless/Node

import { TestCase, SingleTestOutcome, SuiteExecutionResult } from '../types';
import { executeInTwoLayerSandbox } from '../sandbox/sandboxedIframeRunner';

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

/**
 * Isolated Node.js VM execution for headless testing and non-browser environments.
 * Strictly locks out process, require, window, document, and localStorage.
 */
function executeNodeVmSuite(
  code: string,
  fnName: string = 'solution',
  testCases: TestCase[] = [],
  timeoutMs: number = 3000
): SuiteExecutionResult {
  const startTime = Date.now();
  const casesToRun: TestCase[] = testCases.length > 0
    ? testCases
    : [{ input: '[]', output: 'true', name: 'Default Verification' }];

  let vmModule: any = null;
  if (typeof window === 'undefined') {
    try {
      vmModule = eval('require')('vm');
    } catch {}
  }

  if (!vmModule) {
    return {
      language: 'javascript',
      totalTests: casesToRun.length,
      passedTests: 0,
      failedTests: casesToRun.length,
      allPassed: false,
      status: 'RUNTIME_ERROR',
      totalDurationMs: 0,
      terminalLogs: ['[VM ERROR] VM module is not available in this environment.'],
      testOutcomes: [],
      error: 'VM_MODULE_UNAVAILABLE'
    };
  }

  // Locked sandbox context: ZERO access to process, require, global, window, document, storage
  const sandbox: Record<string, any> = {
    console: {
      log: () => {},
      error: () => {},
      warn: () => {},
    },
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    JSON,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    Map,
    Set,
    // Explicitly lock out browser & server attack vectors
    window: undefined,
    document: undefined,
    localStorage: undefined,
    sessionStorage: undefined,
    process: undefined,
    require: undefined,
    global: undefined,
  };
  sandbox.globalThis = sandbox;

  const context = vmModule.createContext(sandbox);

  try {
    // 1. Evaluate student code with strict execution timeout
    vmModule.runInContext(code, context, { timeout: timeoutMs });

    const targetFn = context[fnName];
    if (typeof targetFn !== 'function') {
      return {
        language: 'javascript',
        totalTests: casesToRun.length,
        passedTests: 0,
        failedTests: casesToRun.length,
        allPassed: false,
        status: 'RUNTIME_ERROR',
        totalDurationMs: Date.now() - startTime,
        terminalLogs: [`[VM RUNTIME] Function '${fnName}' not found or not a function in solution.`],
        testOutcomes: casesToRun.map((tc, idx) => ({
          index: idx + 1,
          testCaseName: tc.name || `Test Case ${idx + 1}`,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: `Function '${fnName}' not found`,
          passed: false,
          error: `Function '${fnName}' is undefined`,
          durationMs: Date.now() - startTime,
        })),
        error: `Function '${fnName}' not found in submitted code.`,
      };
    }

    // 2. Run test cases inside VM context so that timeout applies to invocation
    let anyTimeout = false;
    const outcomes: SingleTestOutcome[] = [];

    for (let idx = 0; idx < casesToRun.length; idx++) {
      const tc = casesToRun[idx];
      const caseStart = Date.now();
      try {
        const args = parseInputArgs(tc.input);
        context.__test_args = args;
        // Evaluate invocation inside vm context to enforce per-call timeout
        const actual = vmModule.runInContext(`(${fnName})(...__test_args)`, context, { timeout: timeoutMs });
        const passed = deepEqual(actual, tc.output);
        outcomes.push({
          index: idx + 1,
          testCaseName: tc.name || `Test Case ${idx + 1}`,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: normalizeOutput(actual),
          passed,
          durationMs: Date.now() - caseStart,
        });
      } catch (err: any) {
        const isTimeout = err?.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || err?.message?.includes('timed out');
        if (isTimeout) anyTimeout = true;
        outcomes.push({
          index: idx + 1,
          testCaseName: tc.name || `Test Case ${idx + 1}`,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: isTimeout ? 'TIMEOUT' : (err?.message || 'Error'),
          passed: false,
          error: err?.message || 'Runtime error during test execution',
          durationMs: Date.now() - caseStart,
        });
      }
    }

    const passedCount = outcomes.filter(o => o.passed).length;
    const allPassed = !anyTimeout && passedCount === casesToRun.length;

    return {
      language: 'javascript',
      totalTests: casesToRun.length,
      passedTests: passedCount,
      failedTests: casesToRun.length - passedCount,
      allPassed,
      status: anyTimeout ? 'TIMEOUT' : (allPassed ? 'SUCCESS' : (passedCount > 0 ? 'PARTIAL_PASS' : 'RUNTIME_ERROR')),
      totalDurationMs: Date.now() - startTime,
      terminalLogs: [
        `[VM SANDBOX] Executed ${casesToRun.length} test cases in isolated Node VM.`,
        allPassed ? `[SUCCESS] All test cases passed.` : `[FAIL] ${casesToRun.length - passedCount} failed.`,
      ],
      testOutcomes: outcomes,
    };
  } catch (err: any) {
    const isTimeout = err?.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || err?.message?.includes('timed out');
    return {
      language: 'javascript',
      totalTests: casesToRun.length,
      passedTests: 0,
      failedTests: casesToRun.length,
      allPassed: false,
      status: isTimeout ? 'TIMEOUT' : 'RUNTIME_ERROR',
      totalDurationMs: Date.now() - startTime,
      terminalLogs: [
        isTimeout ? `[TIMEOUT] Execution exceeded ${timeoutMs}ms limit.` : `[RUNTIME ERROR] ${err?.message}`,
      ],
      testOutcomes: casesToRun.map((tc, idx) => ({
        index: idx + 1,
        testCaseName: tc.name || `Test Case ${idx + 1}`,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: isTimeout ? 'TIMEOUT' : 'RUNTIME_ERROR',
        passed: false,
        error: err?.message,
        durationMs: Date.now() - startTime,
      })),
      error: err?.message,
    };
  }
}

export async function executeJavaScriptSuite(
  code: string,
  fnName: string = 'solution',
  testCases: TestCase[] = [],
  timeoutMs: number = 4000
): Promise<SuiteExecutionResult> {
  const casesToRun: TestCase[] = testCases.length > 0
    ? testCases
    : [{ input: '[]', output: 'true', name: 'Default Verification' }];

  // 1. Browser DOM environment: use two-layer sandbox (Opaque iframe + Dedicated Web Worker)
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return executeInTwoLayerSandbox(code, {
      functionName: fnName,
      testCases: casesToRun,
      timeoutMs
    });
  }

  // 2. Node / headless test environment: use isolated Node VM
  return executeNodeVmSuite(code, fnName, casesToRun, timeoutMs);
}
