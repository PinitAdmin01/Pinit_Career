// src/lib/code/runners/pythonRunner.ts
// Pyodide WebAssembly Python In-Browser Test Suite Runner

import { TestCase, SingleTestOutcome, SuiteExecutionResult } from '../types';

declare global {
  interface Window {
    pyodide?: any;
    loadPyodide?: any;
    __pyodideLoadingPromise?: Promise<any>;
  }
}

/**
 * Singleton Pyodide WebAssembly Loader with dynamic CDN injection and deduplication
 */
export async function loadPyodideRuntime(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide WebAssembly runtime is only available in browser environments.');
  }

  if (window.pyodide) {
    return window.pyodide;
  }

  if (window.__pyodideLoadingPromise) {
    return window.__pyodideLoadingPromise;
  }

  window.__pyodideLoadingPromise = (async () => {
    if (!window.loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
      script.async = true;
      document.head.appendChild(script);

      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Pyodide WebAssembly script from CDN.'));
      });
    }

    window.pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/'
    });

    return window.pyodide;
  })();

  return window.__pyodideLoadingPromise;
}

function parseInputArgs(raw: string): unknown[] {
  const trimmed = (raw || '').trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    try {
      return JSON.parse('[' + trimmed.slice(1, -1) + ']');
    } catch {}
  }
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? [parsed] : [parsed];
  } catch {}
  return [trimmed];
}

function deepEqual(actual: string, expectedStr: string): boolean {
  const normActual = actual.trim();
  const normExpected = expectedStr.trim();
  if (normActual === normExpected) return true;

  try {
    const parsedActual = JSON.parse(normActual);
    const parsedExpected = JSON.parse(normExpected);
    return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
  } catch {
    return normActual.toLowerCase() === normExpected.toLowerCase();
  }
}

export async function executePythonSuite(
  code: string,
  fnName: string = 'solution',
  testCases: TestCase[] = [],
  timeoutMs: number = 5000
): Promise<SuiteExecutionResult> {
  const startTime = Date.now();
  const terminalLogs: string[] = [];
  const testOutcomes: SingleTestOutcome[] = [];

  terminalLogs.push(`[PYODIDE RUNTIME] Initializing WebAssembly Python environment...`);

  let py: any;
  try {
    py = await loadPyodideRuntime();
    terminalLogs.push(`[PYODIDE RUNTIME] WebAssembly Python engine loaded successfully.`);
  } catch (loadErr: any) {
    const duration = Date.now() - startTime;
    const msg = loadErr?.message || 'Pyodide loading error';
    terminalLogs.push(`[CRITICAL ERROR] Failed to initialize Pyodide runtime: ${msg}`);
    return {
      language: 'python',
      totalTests: testCases.length || 1,
      passedTests: 0,
      failedTests: testCases.length || 1,
      allPassed: false,
      status: 'RUNTIME_ERROR',
      totalDurationMs: duration,
      terminalLogs,
      testOutcomes: [],
      error: msg
    };
  }

  const casesToRun: TestCase[] = testCases.length > 0
    ? testCases
    : [{ input: '[]', output: 'True', name: 'Default Verification' }];

  let passedCount = 0;

  for (let i = 0; i < casesToRun.length; i++) {
    const tc = casesToRun[i];
    const tcStart = Date.now();
    const args = parseInputArgs(tc.input);
    const argStr = args.map(a => JSON.stringify(a)).join(', ');

    const pythonExecutionScript = `
import sys, io, json
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()

${code}

if '${fnName}' not in locals() and '${fnName}' not in globals():
    raise NameError("Function '${fnName}' was not defined in the Python solution.")

_fn = globals().get('${fnName}') or locals().get('${fnName}')
_res = _fn(${argStr})

if isinstance(_res, str):
    _out = _res
else:
    try:
        _out = json.dumps(_res)
    except Exception:
        _out = str(_res)

_stdout_log = sys.stdout.getvalue()
_stderr_log = sys.stderr.getvalue()
`;

    try {
      const executeWithTimeout = async () => {
        return new Promise<void>(async (resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error(`Execution exceeded time limit of ${timeoutMs}ms`));
          }, timeoutMs);

          try {
            await py.runPythonAsync(pythonExecutionScript);
            clearTimeout(timer);
            resolve();
          } catch (e) {
            clearTimeout(timer);
            reject(e);
          }
        });
      };

      await executeWithTimeout();

      const pyOut = String(py.globals.get('_out') ?? '').trim();
      const stdoutLog = String(py.globals.get('_stdout_log') ?? '').trim();
      const duration = Date.now() - tcStart;

      const isPassed = deepEqual(pyOut, tc.output);

      if (isPassed) {
        passedCount++;
        terminalLogs.push(`[TEST SUITE] Test ${i + 1} (${tc.name || tc.input}): PASSED -> Output: ${pyOut} (${duration}ms)`);
      } else {
        terminalLogs.push(`[FAIL] Test ${i + 1} (${tc.name || tc.input}): FAILED. Expected: ${tc.output}, Received: ${pyOut}`);
      }

      if (stdoutLog) {
        terminalLogs.push(`  stdout: ${stdoutLog}`);
      }

      testOutcomes.push({
        index: i + 1,
        testCaseName: tc.name || `Test Case ${i + 1}`,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: pyOut,
        passed: isPassed,
        durationMs: duration,
        stdout: stdoutLog
      });
    } catch (execErr: any) {
      const duration = Date.now() - tcStart;
      const errMsg = execErr?.message || String(execErr);
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

  const totalDuration = Date.now() - startTime;
  const allPassed = passedCount === casesToRun.length;

  return {
    language: 'python',
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
