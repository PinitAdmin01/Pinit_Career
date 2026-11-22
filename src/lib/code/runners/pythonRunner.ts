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
    try {
      importScripts('__PYODIDE_BASE__pyodide.js');
      pyodide = await self.loadPyodide({
        indexURL: '__PYODIDE_BASE__'
      });
      return pyodide;
    } catch (_localErr) {
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
      pyodide = await self.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
      });
      return pyodide;
    }
  })();
  return initPromise;
}

self.onmessage = async function(e) {
  const { id, type, payload } = e.data || {};
  if (type === 'RUN_PYTHON') {
    let ns = null;
    try {
      const py = await getPyodide();
      self.postMessage({ id, type: 'EXEC_START' });
      const { script, extractVars } = payload;
      ns = py.globals.get('dict')();
      ns.set('__name__', '__main__');
      await py.runPythonAsync(script, { globals: ns });
      const results = {};
      if (Array.isArray(extractVars)) {
        for (const varName of extractVars) {
          try {
            const val = ns.get(varName);
            results[varName] = val !== undefined && val !== null ? String(val) : '';
          } catch {}
        }
      }
      self.postMessage({ id, type: 'EXEC_RESULT', success: true, results });
    } catch (err) {
      const rawMsg = (err && err.message) ? String(err.message) : String(err);
      const lines = rawMsg.trim().split('\\n').map(l => l.trim()).filter(Boolean);
      const cleanErr = lines.length > 0 ? lines[lines.length - 1] : rawMsg;
      self.postMessage({ id, type: 'EXEC_RESULT', success: false, error: cleanErr });
    } finally {
      try { if (ns && typeof ns.destroy === 'function') ns.destroy(); } catch {}
    }
  }
};
`;

const PYODIDE_BOOT_TIMEOUT_MS = 30000;
let sharedPyodideWorker: Worker | null = null;
let sharedWorkerBlobUrl: string | null = null;
let workerQueue: Promise<void> = Promise.resolve();

function resetSharedPyodideWorker() {
  if (sharedPyodideWorker) {
    try { sharedPyodideWorker.terminate(); } catch {}
    sharedPyodideWorker = null;
  }
  if (sharedWorkerBlobUrl) {
    try { URL.revokeObjectURL(sharedWorkerBlobUrl); } catch {}
    sharedWorkerBlobUrl = null;
  }
}

function getOrCreatePyodideWorker(): Worker {
  if (sharedPyodideWorker) return sharedPyodideWorker;
  const blob = new Blob(
    [PYODIDE_WORKER_SOURCE.split('__PYODIDE_BASE__').join(pyodideBase())],
    { type: 'application/javascript' }
  );
  sharedWorkerBlobUrl = URL.createObjectURL(blob);
  sharedPyodideWorker = new Worker(sharedWorkerBlobUrl);
  return sharedPyodideWorker;
}

function executeInBrowserWorker(
  script: string,
  extractVars: string[],
  timeoutMs: number
): Promise<{ success: boolean; results?: Record<string, string>; error?: string }> {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    return Promise.resolve({ success: false, error: 'Web Worker not supported in this environment.' });
  }

  const runTask = (): Promise<{ success: boolean; results?: Record<string, string>; error?: string }> =>
    new Promise((resolve) => {
      let timer: any = null;
      let settled = false;
      let worker: Worker | null = null;
      const runId = 'run_' + Math.random().toString(36).slice(2);

      const clearTimer = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };

      const finish = (
        result: { success: boolean; results?: Record<string, string>; error?: string },
        terminateWorker: boolean
      ) => {
        if (settled) return;
        settled = true;
        clearTimer();
        if (worker) {
          worker.onmessage = null;
          worker.onerror = null;
        }
        if (terminateWorker) {
          resetSharedPyodideWorker();
        }
        resolve(result);
      };

      try {
        worker = getOrCreatePyodideWorker();

        // Phase 1: Generous boot timeout while Pyodide WASM (~13.7 MB) downloads & initializes.
        // The strict execution timeout (timeoutMs) starts ONLY after EXEC_START is received.
        timer = setTimeout(() => {
          finish(
            {
              success: false,
              error: `Python runtime (Pyodide WASM) failed to initialize within ${Math.round(PYODIDE_BOOT_TIMEOUT_MS / 1000)}s. Please check your network and retry.`
            },
            true
          );
        }, PYODIDE_BOOT_TIMEOUT_MS);

        worker.onmessage = (e) => {
          const msg = e.data || {};
          if (msg.id !== runId) return;

          if (msg.type === 'EXEC_START') {
            // Pyodide is ready; now enforce the strict student-code execution timeout.
            clearTimer();
            timer = setTimeout(() => {
              finish(
                {
                  success: false,
                  error: `Execution Timeout: Code execution exceeded ${timeoutMs}ms limit (infinite loop detected).`
                },
                true
              );
            }, timeoutMs);
            return;
          }

          finish(
            {
              success: Boolean(msg.success),
              results: msg.results,
              error: msg.error
            },
            false
          );
        };

        worker.onerror = (err) => {
          finish({ success: false, error: err.message || 'Pyodide Worker Error' }, true);
        };

        worker.postMessage({
          id: runId,
          type: 'RUN_PYTHON',
          payload: { script, extractVars }
        });
      } catch (err: any) {
        finish({ success: false, error: err?.message || 'Worker initialization failed' }, true);
      }
    });

  // Serialize executions on the shared warm worker so concurrent calls never collide.
  const resultPromise = workerQueue.then(runTask, runTask);
  workerQueue = resultPromise.then(() => undefined, () => undefined);
  return resultPromise;
}

let cachedPythonBin: string | null = null;

// [FIX-STAGE: Portable Python Interpreter Resolution] Replace hardcoded user-home pgAdmin paths
// with PYTHON_PATH env override and a cached cross-platform PATH probe.
function resolvePythonExecutable(req: any): string {
  const envPath = process.env.PYTHON_PATH?.trim();
  if (envPath) return envPath;
  if (cachedPythonBin) return cachedPythonBin;

  const { spawnSync } = req('child_process');
  const candidates = process.platform === 'win32' ? ['python', 'python3'] : ['python3', 'python'];
  for (const candidate of candidates) {
    try {
      const probe = spawnSync(candidate, ['--version'], { stdio: 'ignore', timeout: 1500 });
      if (probe && probe.status === 0) {
        cachedPythonBin = candidate;
        console.log('[PinIT][Fix:PythonRunner] Resolved portable Python executable:', candidate);
        return candidate;
      }
    } catch {
      // Ignore probe miss and try next candidate
    }
  }
  console.warn('[PinIT][Fix:PythonRunner] No working Python executable found via PATH; falling back to "python"');
  cachedPythonBin = 'python';
  return cachedPythonBin;
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

      const pythonBin = resolvePythonExecutable(req);

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

function normalizePythonLiteralsToJson(raw: string): string {
  return raw
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null')
    .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, inner) => JSON.stringify(inner));
}

function parseInputArgs(raw: string): unknown[] {
  const trimmed = (raw || '').trim();
  if (!trimmed) return [];

  const candidates = [trimmed, normalizePythonLiteralsToJson(trimmed)];
  for (const cand of candidates) {
    if (cand.startsWith('(') && cand.endsWith(')')) {
      try {
        const parsed = JSON.parse('[' + cand.slice(1, -1) + ']');
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    try {
      const wrapped = JSON.parse('[' + cand + ']');
      if (Array.isArray(wrapped)) return wrapped;
    } catch {}
    try {
      const parsed = JSON.parse(cand);
      return Array.isArray(parsed) ? [parsed] : [parsed];
    } catch {}
  }
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
import sys, io, json, traceback
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
def _pinit_excepthook(exc_type, exc_value, exc_tb):
    _t = getattr(sys, '__stderr__', None)
    if _t:
        _t.write(''.join(traceback.format_exception(exc_type, exc_value, exc_tb)))
        _t.flush()
sys.excepthook = _pinit_excepthook

${code}

_captured_stdout_ = sys.stdout.getvalue()

# --- Authoritative Test Suite ---
_test_passed = 'FALSE'
_assertion_error = ''
try:
${(testSuite || '').split('\n').map(l => '    ' + l).join('\n')}
    _test_passed = 'TRUE'
except AssertionError as _ae:
    _assertion_error = f"AssertionError: {_ae}" if str(_ae) else "AssertionError: Test check failed."
except Exception as _ex:
    _assertion_error = f"{type(_ex).__name__}: {_ex}"
_stdout_log = sys.stdout.getvalue()
_stderr_log = sys.stderr.getvalue()
`;

    const res = await runPythonScript(pythonScript, ['_stdout_log', '_stderr_log', '_test_passed', '_assertion_error'], timeoutMs);
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
      const rawErr = res.results?._assertion_error || res.error || 'Assertion failed during test execution.';
      const errLines = rawErr.trim().split('\n').map((l: string) => l.trim()).filter(Boolean);
      const errorMsg = errLines.length > 0 ? errLines[errLines.length - 1] : rawErr;
      const isTimeout = errorMsg.toLowerCase().includes('timeout');
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
    const serializedArgsJson = JSON.stringify(JSON.stringify(args));
    const safeTargetFnJson = JSON.stringify(fnName);

    const pythonExecutionScript = `
import sys, io, json, re, types, traceback
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
def _pinit_excepthook(exc_type, exc_value, exc_tb):
    _t = getattr(sys, '__stderr__', None)
    if _t:
        _t.write(''.join(traceback.format_exception(exc_type, exc_value, exc_tb)))
        _t.flush()
sys.excepthook = _pinit_excepthook

${code}

_target_name = ${safeTargetFnJson}
_ns = dict(globals())
_ns.update(locals())

def _to_snake(_s):
    return re.sub(r'([a-z0-9])([A-Z])', r'\\1_\\2', _s).lower()

def _to_camel(_s):
    _parts = [p for p in _s.split('_') if p]
    return _parts[0] + ''.join(p[:1].upper() + p[1:] for p in _parts[1:]) if _parts else _s

_fn = _ns.get(_target_name)
if not callable(_fn):
    for _alt in (_to_snake(_target_name), _to_camel(_target_name)):
        if callable(_ns.get(_alt)):
            _fn = _ns.get(_alt)
            break
if not callable(_fn) and _target_name == 'solution':
    _user_fns = [
        _v for _k, _v in _ns.items()
        if isinstance(_v, types.FunctionType) and not _k.startswith('_') and _k not in ('_to_snake', '_to_camel')
    ]
    if len(_user_fns) == 1:
        _fn = _user_fns[0]

if not callable(_fn):
    raise NameError(f"Function '{_target_name}' was not defined in the Python solution.")

_args = json.loads(${serializedArgsJson})
_res = _fn(*_args)

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
      const cleanError = (res.error || '')
        .replace(/^PythonError:\s*/i, '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .slice(-2)
        .join(' ') || 'Runtime Exception';
      terminalLogs.push(`❌ Test ${i + 1} Failed: ${cleanError}`);
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
      terminalLogs.push(`✅ Test ${i + 1} Passed (${tc.name || tc.input}): Output ${pyOut}`);
    } else {
      terminalLogs.push(`❌ Test ${i + 1} Failed (${tc.name || tc.input}): Expected ${tc.output}, but received ${pyOut}`);
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
