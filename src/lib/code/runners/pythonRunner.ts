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
      script.src = `${pyodideBase()}pyodide.js`;
      script.async = true;
      document.head.appendChild(script);

      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load the Python runtime (Pyodide).'));
      });
    }

    window.pyodide = await window.loadPyodide({
      indexURL: pyodideBase()
    });

    return window.pyodide;
  })();

  return window.__pyodideLoadingPromise;
}

/**
 * The same self-hosted Pyodide the lesson pages use (public/pyodide/, the version in package.json),
 * so practice tasks do not depend on an outside CDN that school or office networks may block.
 * An absolute URL, because the worker runs from a blob: URL where relative paths do not resolve.
 */
function pyodideBase(): string {
  return `${window.location.origin}/pyodide/`;
}

const PYODIDE_WORKER_SOURCE = `
let pyodide = null;
let initPromise = null;

async function getPyodide() {
  if (pyodide) return pyodide;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    importScripts('__PYODIDE_BASE__pyodide.js');
    pyodide = await self.loadPyodide({
      indexURL: '__PYODIDE_BASE__'
    });
    return pyodide;
  })();
  return initPromise;
}

self.onmessage = async function(e) {
  const { id, type, payload } = e.data || {};
  if (type === 'RUN_PYTHON') {
    try {
      const py = await getPyodide();
      const { script, extractVars } = payload;
      await py.runPythonAsync(script);
      const results = {};
      if (Array.isArray(extractVars)) {
        for (const varName of extractVars) {
          try {
            const val = py.globals.get(varName);
            results[varName] = val !== undefined && val !== null ? String(val) : '';
          } catch {}
        }
      }
      self.postMessage({ id, success: true, results });
    } catch (err) {
      self.postMessage({ id, success: false, error: err?.message || String(err) });
    }
  }
};
`;

function executeInBrowserWorker(
  script: string,
  extractVars: string[],
  timeoutMs: number
): Promise<{ success: boolean; results?: Record<string, string>; error?: string }> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      resolve({ success: false, error: 'Web Worker not supported in this environment.' });
      return;
    }

    let worker: Worker | null = null;
    let timer: any = null;
    let blobUrl: string | null = null;

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (worker) {
        worker.terminate();
        worker = null;
      }
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        blobUrl = null;
      }
    };

    try {
      const blob = new Blob([PYODIDE_WORKER_SOURCE.split('__PYODIDE_BASE__').join(pyodideBase())], { type: 'application/javascript' });
      blobUrl = URL.createObjectURL(blob);
      worker = new Worker(blobUrl);

      timer = setTimeout(() => {
        cleanup();
        resolve({
          success: false,
          error: `Execution Timeout: Code execution exceeded ${timeoutMs}ms limit (infinite loop detected).`
        });
      }, timeoutMs);

      worker.onmessage = (e) => {
        cleanup();
        resolve(e.data || { success: false, error: 'Empty worker response' });
      };

      worker.onerror = (err) => {
        cleanup();
        resolve({ success: false, error: err.message || 'Pyodide Worker Error' });
      };

      worker.postMessage({
        id: 'run_' + Math.random().toString(36).slice(2),
        type: 'RUN_PYTHON',
        payload: { script, extractVars }
      });
    } catch (err: any) {
      cleanup();
      resolve({ success: false, error: err?.message || 'Worker initialization failed' });
    }
  });
}

function executeInNode(
  script: string,
  extractVars: string[],
  timeoutMs: number
): Promise<{ success: boolean; results?: Record<string, string>; error?: string }> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      resolve({ success: false, error: 'Node execution not supported in browser environment.' });
      return;
    }

    try {
      // Dynamic require avoids Webpack client bundle resolution warnings
      const req: any = typeof eval !== 'undefined' ? eval('require') : null;
      if (!req) {
        resolve({ success: false, error: 'CommonJS require not available in environment.' });
        return;
      }
      const cp = req('child_process');
      const fs = req('fs');
      const path = req('path');
      const os = req('os');

      const tmpDir = os.tmpdir();
      const scriptFile = path.join(tmpDir, `pinit_py_${Date.now()}_${Math.random().toString(36).slice(2)}.py`);

      const winPgAdmin = 'C:\\Users\\vinay\\pgsql18\\pgsql\\pgAdmin 4\\python\\python.exe';
      const pythonBin = process.env.PYTHON_PATH || (process.platform === 'win32' && fs.existsSync(winPgAdmin) ? winPgAdmin : 'python');

      let wrappedScript = script + '\n\n';
      wrappedScript += 'import json, sys\n';
      wrappedScript += '_res_dict = {}\n';
      for (const v of extractVars) {
        wrappedScript += `try:\n    _res_dict['${v}'] = str(globals().get('${v}', ''))\nexcept Exception:\n    pass\n`;
      }
      wrappedScript += `_payload = "__PINIT_EXTRACT_START__" + json.dumps(_res_dict) + "__PINIT_EXTRACT_END__\\n"\n`;
      wrappedScript += `try:\n    _target = getattr(sys, '__stdout__', None) or sys.stdout\n    _target.write(_payload)\n    _target.flush()\nexcept Exception:\n    print(_payload)\n`;

      fs.writeFileSync(scriptFile, wrappedScript, 'utf8');

      cp.execFile(pythonBin, [scriptFile], { timeout: timeoutMs, killSignal: 'SIGKILL' }, (err: any, stdout: string, stderr: string) => {
        try { fs.unlinkSync(scriptFile); } catch {}

        if (err) {
          const isTimeout = err.killed || err.signal === 'SIGKILL' || err.code === 'ETIMEDOUT' || (err.message && err.message.toLowerCase().includes('timed out'));
          if (isTimeout) {
            resolve({
              success: false,
              error: `Execution Timeout: Code execution exceeded ${timeoutMs}ms limit (infinite loop detected).`
            });
          } else {
            resolve({
              success: false,
              error: stderr || err.message || 'Python execution error'
            });
          }
          return;
        }

        const outStr = stdout || '';
        const startIdx = outStr.indexOf('__PINIT_EXTRACT_START__');
        const endIdx = outStr.indexOf('__PINIT_EXTRACT_END__');

        let results: Record<string, string> = {};
        if (startIdx !== -1 && endIdx !== -1) {
          try {
            const rawJson = outStr.slice(startIdx + '__PINIT_EXTRACT_START__'.length, endIdx);
            results = JSON.parse(rawJson);
          } catch {}
        }

        resolve({ success: true, results });
      });
    } catch (e: any) {
      resolve({ success: false, error: e?.message || 'Node execution failed' });
    }
  });
}

export async function runPythonScript(
  script: string,
  extractVars: string[] = [],
  timeoutMs: number = 4500
): Promise<{ success: boolean; results?: Record<string, string>; error?: string }> {
  if (typeof window !== 'undefined') {
    return executeInBrowserWorker(script, extractVars, timeoutMs);
  }
  return executeInNode(script, extractVars, timeoutMs);
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
  codeOrOptions: string | { code: string; fnName?: string; testCases?: TestCase[]; timeoutMs?: number; testSuite?: string },
  fnName: string = 'solution',
  testCases: TestCase[] = [],
  timeoutMs: number = 4500,
  testSuite?: string
): Promise<SuiteExecutionResult> {
  let code = '';
  if (typeof codeOrOptions === 'object' && codeOrOptions !== null) {
    code = codeOrOptions.code || '';
    fnName = codeOrOptions.fnName || fnName;
    testCases = codeOrOptions.testCases || testCases;
    timeoutMs = codeOrOptions.timeoutMs || timeoutMs;
    testSuite = codeOrOptions.testSuite || testSuite;
  } else {
    code = codeOrOptions;
  }

  const startTime = Date.now();
  const terminalLogs: string[] = [];
  const testOutcomes: SingleTestOutcome[] = [];

  // 1. Fail closed if neither test cases nor test suite are provided
  const hasTestCases = Array.isArray(testCases) && testCases.length > 0;
  const hasTestSuite = typeof testSuite === 'string' && testSuite.trim().length > 0;

  if (!hasTestCases && !hasTestSuite) {
    return {
      language: 'python',
      totalTests: 1,
      passedTests: 0,
      failedTests: 1,
      allPassed: false,
      status: 'RUNTIME_ERROR',
      totalDurationMs: 0,
      terminalLogs: ['[ERROR] No test cases or test suite provided for Python verification. Fail-closed.'],
      testOutcomes: [{
        index: 1,
        testCaseName: 'Authoritative Test Suite Check',
        input: 'N/A',
        expectedOutput: 'Valid Test Cases',
        actualOutput: 'None',
        passed: false,
        durationMs: 0,
        error: 'No test suite provided'
      }],
      error: 'No test cases or test suite provided for Python verification.'
    };
  }

  terminalLogs.push(`[PYTHON RUNTIME] Executing Python solution in isolated sandbox...`);

  // 2. If testSuite assertion script is provided, evaluate assertion suite
  if (hasTestSuite) {
    const pythonScript = `
import sys, io, json
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()

${code}

# --- Authoritative Test Suite ---
${testSuite}

_stdout_log = sys.stdout.getvalue()
_stderr_log = sys.stderr.getvalue()
_test_passed = 'TRUE'
`;

    const res = await runPythonScript(pythonScript, ['_stdout_log', '_stderr_log', '_test_passed'], timeoutMs);
    const duration = Date.now() - startTime;
    const stdoutLog = res.results?._stdout_log || '';
    if (stdoutLog) terminalLogs.push(`  stdout: ${stdoutLog}`);

    if (res.success && res.results?._test_passed === 'TRUE') {
      terminalLogs.push(`[TEST SUITE] All Python test assertions passed successfully in ${duration}ms.`);
      return {
        language: 'python',
        totalTests: 1,
        passedTests: 1,
        failedTests: 0,
        allPassed: true,
        status: 'SUCCESS',
        totalDurationMs: duration,
        terminalLogs,
        testOutcomes: [{
          index: 1,
          testCaseName: 'Authoritative Assertion Suite',
          input: 'Full Solution',
          expectedOutput: 'All Assertions Pass',
          actualOutput: 'All Assertions Pass',
          passed: true,
          durationMs: duration,
          stdout: stdoutLog
        }]
      };
    } else {
      const isTimeout = (res.error || '').toLowerCase().includes('timeout');
      const errorMsg = res.error || 'Assertion failed during test execution.';
      terminalLogs.push(isTimeout ? `[TIMEOUT] ${errorMsg}` : `[FAIL] ${errorMsg}`);
      return {
        language: 'python',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        allPassed: false,
        status: isTimeout ? 'TIMEOUT' : 'RUNTIME_ERROR',
        totalDurationMs: duration,
        terminalLogs,
        testOutcomes: [{
          index: 1,
          testCaseName: 'Authoritative Assertion Suite',
          input: 'Full Solution',
          expectedOutput: 'All Assertions Pass',
          actualOutput: errorMsg,
          passed: false,
          durationMs: duration,
          error: errorMsg,
          stdout: stdoutLog
        }],
        error: errorMsg
      };
    }
  }

  // 3. Otherwise, run explicit TestCase array
  let passedCount = 0;
  let anyTimeout = false;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
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

    const res = await runPythonScript(pythonExecutionScript, ['_out', '_stdout_log', '_stderr_log'], timeoutMs);
    const duration = Date.now() - tcStart;
    const isTimeout = (res.error || '').toLowerCase().includes('timeout');
    if (isTimeout) anyTimeout = true;

    if (!res.success) {
      terminalLogs.push(`[RUNTIME ERROR] Test ${i + 1}: ${res.error}`);
      testOutcomes.push({
        index: i + 1,
        testCaseName: tc.name || `Test Case ${i + 1}`,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: isTimeout ? 'TIMEOUT' : 'ERROR',
        passed: false,
        durationMs: duration,
        error: res.error
      });
      continue;
    }

    const pyOut = (res.results?._out ?? '').trim();
    const stdoutLog = (res.results?._stdout_log ?? '').trim();
    const isPassed = deepEqual(pyOut, tc.output);

    if (isPassed) {
      passedCount++;
      terminalLogs.push(`[TEST SUITE] Test ${i + 1} (${tc.name || tc.input}): PASSED -> Output: ${pyOut} (${duration}ms)`);
    } else {
      terminalLogs.push(`[FAIL] Test ${i + 1} (${tc.name || tc.input}): FAILED. Expected: ${tc.output}, Received: ${pyOut}`);
    }

    if (stdoutLog) terminalLogs.push(`  stdout: ${stdoutLog}`);

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
  }

  const totalDuration = Date.now() - startTime;
  const allPassed = !anyTimeout && passedCount === testCases.length;

  return {
    language: 'python',
    totalTests: testCases.length,
    passedTests: passedCount,
    failedTests: testCases.length - passedCount,
    allPassed,
    status: anyTimeout ? 'TIMEOUT' : (allPassed ? 'SUCCESS' : passedCount > 0 ? 'PARTIAL_PASS' : 'RUNTIME_ERROR'),
    totalDurationMs: totalDuration,
    terminalLogs,
    testOutcomes
  };
}
