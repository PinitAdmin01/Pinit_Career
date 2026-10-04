/**
 * Server Grader for JavaScript and TypeScript (CHK-6 / W-08).
 *
 * Grades student code against visible and hidden tests on the server:
 * 1. findForbiddenJs guard on code and test suite before execution.
 * 2. esbuild transform for TypeScript and TSX tasks.
 * 3. node:vm inside dedicated worker_threads with deadline timeout to protect against infinite loops.
 * 4. Pass/fail decided by worker exit status and a random per-run marker created on the server and never revealed.
 * 5. Hidden test source is scrubbed and never leaked to student output.
 */

import { Worker } from 'node:worker_threads';
import vm from 'node:vm';
import crypto from 'crypto';
import path from 'path';
import { findForbiddenJs } from '@/lib/code/js/jsGuard';
import { compileTs } from '@/lib/code/ts/compileTs';

export const PASS_SENTINEL = '__PINIT_JS_TESTS_PASSED__';

export interface JsSandboxOptions {
  code: string;
  tests?: string;
  language?: 'javascript' | 'typescript' | 'tsx';
  timeoutMs?: number;
  sentinel?: string;
  hidden?: boolean;
}

export type JsSandboxStatus =
  | 'SUCCESS'
  | 'ASSERTION_FAILED'
  | 'COMPILE_ERROR'
  | 'SECURITY_VIOLATION'
  | 'TIMEOUT'
  | 'RUNTIME_ERROR'
  | 'ABNORMAL_TERMINATION';

export interface JsSandboxResult {
  passed: boolean;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  status: JsSandboxStatus;
  durationMs: number;
  error?: string;
}

function stripExportStatements(js: string): string {
  return js
    .replace(/^export\s+default\s+/gm, '')
    .replace(/^export\s+(async\s+)?(function|class|const|let|var)\s+/gm, '$1$2 ');
}

function scrubHiddenTestSource(output: string, tests: string): string {
  if (!output || !tests) return output;

  let cleaned = output;
  const secretLines = tests
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 6 && !l.startsWith('//') && !l.startsWith('/*'));

  for (const line of secretLines) {
    if (cleaned.includes(line)) {
      cleaned = cleaned.split(line).join('[REDACTED]');
    }
  }

  // If this was a hidden check assertion failure, report only the generic failure
  const match = cleaned.match(/Hidden check \d+ failed/);
  if (match) {
    return match[0];
  }

  if (cleaned.includes('AssertionError') || cleaned.includes('Error: Expected') || cleaned.includes('assert')) {
    return 'Hidden check failed';
  }

  return cleaned.trim();
}

const WORKER_SCRIPT = `
const { parentPort, workerData } = require('node:worker_threads');
const vm = require('node:vm');

async function run() {
  const { code, tests, sentinel, timeoutMs, isTsx, hidden, reactRuntimeCode } = workerData;
  const stdoutLogs = [];
  const stderrLogs = [];

  const sandbox = {
    console: {
      log: (...args) => stdoutLogs.push(args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ')),
      error: (...args) => stderrLogs.push(args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ')),
      warn: (...args) => stderrLogs.push(args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ')),
      info: (...args) => stdoutLogs.push(args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ')),
    },
    setTimeout,
    clearTimeout,
    Promise,
    URL,
    URLSearchParams,
    TextEncoder: typeof TextEncoder !== 'undefined' ? TextEncoder : undefined,
    TextDecoder: typeof TextDecoder !== 'undefined' ? TextDecoder : undefined,
    Uint8Array,
    Map,
    Set,
    Math,
    Date,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Error,
    TypeError,
    RangeError,
    SyntaxError,
    assert: (cond, msg) => {
      if (!cond) throw new Error(msg || 'Assertion failed');
    },
  };

  if (isTsx && reactRuntimeCode) {
    try {
      vm.createContext(sandbox);
      vm.runInContext(reactRuntimeCode, sandbox);
      sandbox.render = function(Component, props) {
        const R = sandbox.__PINIT_REACT__ || { React: sandbox.React, renderToStaticMarkup: sandbox.renderToStaticMarkup };
        if (!R || !R.renderToStaticMarkup || !R.React) {
          throw new Error('React render runtime is not initialized');
        }
        return R.renderToStaticMarkup(R.React.createElement(Component, props || {}));
      };
    } catch {
      vm.createContext(sandbox);
    }
  } else {
    vm.createContext(sandbox);
  }

  // 1. Evaluate student code
  try {
    const studentScript = new vm.Script(code, { filename: 'submission.js' });
    studentScript.runInContext(sandbox, { timeout: timeoutMs });
  } catch (err) {
    parentPort.postMessage({
      passed: false,
      status: err && err.name === 'SyntaxError' ? 'COMPILE_ERROR' : 'RUNTIME_ERROR',
      stdout: stdoutLogs.join('\\n'),
      stderr: err && err.message ? err.message : String(err),
      error: err && err.message ? err.message : String(err),
    });
    return;
  }

  // 2. Evaluate test assertions
  if (tests && tests.trim()) {
    try {
      const wrapped = \`(async () => {\\n\${tests}\\n})()\`;
      const testScript = new vm.Script(wrapped, { filename: 'tests.js' });
      const p = testScript.runInContext(sandbox, { timeout: timeoutMs });
      if (p && typeof p.then === 'function') {
        await p;
      }
    } catch (testErr) {
      const errMsg = testErr && testErr.message ? testErr.message : String(testErr);
      parentPort.postMessage({
        passed: false,
        status: 'ASSERTION_FAILED',
        stdout: stdoutLogs.join('\\n'),
        stderr: errMsg,
        error: errMsg,
      });
      return;
    }
  }

  // 3. Tests completed successfully: emit server per-run sentinel
  parentPort.postMessage({
    passed: true,
    sentinel: sentinel,
    status: 'SUCCESS',
    stdout: stdoutLogs.join('\\n'),
    stderr: '',
  });
}

run().catch((err) => {
  parentPort.postMessage({
    passed: false,
    status: 'RUNTIME_ERROR',
    stdout: '',
    stderr: err && err.message ? err.message : String(err),
    error: err && err.message ? err.message : String(err),
  });
});
`;

/**
 * Fallback execution in direct node:vm if worker thread cannot be spawned.
 */
async function runInVmDirectly(
  code: string,
  tests: string,
  sentinel: string,
  timeoutMs: number,
  isTsx: boolean,
  hidden: boolean
): Promise<{ passed: boolean; sentinel?: string; status: JsSandboxStatus; stdout: string; stderr: string; error?: string }> {
  const stdoutLogs: string[] = [];
  const stderrLogs: string[] = [];

  const sandbox: Record<string, any> = {
    console: {
      log: (...args: any[]) => stdoutLogs.push(args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ')),
      error: (...args: any[]) => stderrLogs.push(args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ')),
      warn: (...args: any[]) => stderrLogs.push(args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ')),
      info: (...args: any[]) => stdoutLogs.push(args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ')),
    },
    setTimeout,
    clearTimeout,
    Promise,
    URL,
    URLSearchParams,
    TextEncoder: typeof TextEncoder !== 'undefined' ? TextEncoder : undefined,
    TextDecoder: typeof TextDecoder !== 'undefined' ? TextDecoder : undefined,
    Uint8Array,
    Map,
    Set,
    Math,
    Date,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Error,
    TypeError,
    RangeError,
    SyntaxError,
    assert: (cond: any, msg?: string) => {
      if (!cond) throw new Error(msg || 'Assertion failed');
    },
  };

  if (isTsx) {
    try {
      const { getReactRuntimeSync } = await import('@/lib/code/react/reactRuntime');
      const runtime = getReactRuntimeSync();
      vm.createContext(sandbox);
      vm.runInContext(runtime, sandbox);
      sandbox.render = function (Component: any, props: any = {}) {
        const R = sandbox.__PINIT_REACT__ || { React: sandbox.React, renderToStaticMarkup: sandbox.renderToStaticMarkup };
        if (!R || !R.renderToStaticMarkup || !R.React) {
          throw new Error('React render runtime is not initialized');
        }
        return R.renderToStaticMarkup(R.React.createElement(Component, props));
      };
    } catch {
      vm.createContext(sandbox);
    }
  } else {
    vm.createContext(sandbox);
  }

  // 1. Evaluate student code
  try {
    const studentScript = new vm.Script(code, { filename: 'submission.js' });
    studentScript.runInContext(sandbox, { timeout: timeoutMs });
  } catch (err: any) {
    return {
      passed: false,
      status: err?.name === 'SyntaxError' ? 'COMPILE_ERROR' : 'RUNTIME_ERROR',
      stdout: stdoutLogs.join('\n'),
      stderr: err?.message || String(err),
      error: err?.message || String(err),
    };
  }

  // 2. Evaluate tests
  if (tests && tests.trim()) {
    try {
      const wrapped = `(async () => {\n${tests}\n})()`;
      const testScript = new vm.Script(wrapped, { filename: 'tests.js' });
      const p = testScript.runInContext(sandbox, { timeout: timeoutMs });
      if (p && typeof p.then === 'function') {
        await p;
      }
    } catch (testErr: any) {
      const errMsg = testErr?.message || String(testErr);
      return {
        passed: false,
        status: 'ASSERTION_FAILED',
        stdout: stdoutLogs.join('\n'),
        stderr: errMsg,
        error: errMsg,
      };
    }
  }

  return {
    passed: true,
    sentinel,
    status: 'SUCCESS',
    stdout: stdoutLogs.join('\n'),
    stderr: '',
  };
}

/**
 * Runs JavaScript or TypeScript code and assertions in an isolated worker sandbox.
 */
export async function runJsInSandbox(
  options: JsSandboxOptions
): Promise<JsSandboxResult> {
  const start = Date.now();
  const {
    code,
    tests = '',
    language = 'javascript',
    timeoutMs = 3000,
    sentinel = crypto.randomBytes(16).toString('hex'),
    hidden = false,
  } = options;

  // 1. Security check: jsGuard (CHK-5)
  const combinedSource = `${code}\n${tests}`;
  const forbiddenToken = findForbiddenJs(combinedSource);
  if (forbiddenToken) {
    return {
      passed: false,
      stdout: '',
      stderr: `[SECURITY GUARD] Forbidden API detected: ${forbiddenToken}`,
      timedOut: false,
      status: 'SECURITY_VIOLATION',
      durationMs: Date.now() - start,
      error: `Forbidden API detected: ${forbiddenToken}`,
    };
  }

  // 2. TypeScript / TSX compilation (CHK-2)
  let runnableCode = code;
  let runnableTests = tests;
  const isTs = language === 'typescript' || language === 'tsx';
  const isTsx = language === 'tsx';

  if (isTs) {
    const compiledCode = await compileTs(code, { jsx: isTsx });
    if (!compiledCode.ok) {
      return {
        passed: false,
        stdout: '',
        stderr: `TypeScript compilation error (line ${compiledCode.line ?? '?'}): ${compiledCode.message}`,
        timedOut: false,
        status: 'COMPILE_ERROR',
        durationMs: Date.now() - start,
        error: compiledCode.message,
      };
    }
    runnableCode = compiledCode.js;

    if (tests.trim()) {
      const compiledTests = await compileTs(tests, { jsx: isTsx });
      if (!compiledTests.ok) {
        return {
          passed: false,
          stdout: '',
          stderr: `TypeScript test compilation error: ${compiledTests.message}`,
          timedOut: false,
          status: 'COMPILE_ERROR',
          durationMs: Date.now() - start,
          error: compiledTests.message,
        };
      }
      runnableTests = compiledTests.js;
    }
  }

  runnableCode = stripExportStatements(runnableCode);
  runnableTests = stripExportStatements(runnableTests);

  const clampedTimeout = Math.min(Math.max(Number(timeoutMs) || 3000, 200), 10000);
  let reactRuntimeCode = '';
  if (isTsx) {
    try {
      const { getReactRuntimeSync } = await import('@/lib/code/react/reactRuntime');
      reactRuntimeCode = getReactRuntimeSync();
    } catch {}
  }

  // 3. Execution in isolated Worker Thread
  let workerResult: {
    passed: boolean;
    sentinel?: string;
    status: JsSandboxStatus;
    stdout: string;
    stderr: string;
    error?: string;
    timedOut?: boolean;
  };

  try {
    workerResult = await new Promise((resolve) => {
      let settled = false;
      let worker: Worker | null = null;

      const timer = setTimeout(async () => {
        if (!settled) {
          settled = true;
          if (worker) {
            try {
              await worker.terminate();
            } catch {}
          }
          resolve({
            passed: false,
            status: 'TIMEOUT',
            stdout: '',
            stderr: `Execution timed out (${clampedTimeout}ms limit exceeded)`,
            timedOut: true,
            error: `Execution timed out (${clampedTimeout}ms limit exceeded)`,
          });
        }
      }, clampedTimeout);

      try {
        worker = new Worker(WORKER_SCRIPT, {
          eval: true,
          workerData: {
            code: runnableCode,
            tests: runnableTests,
            sentinel,
            timeoutMs: clampedTimeout,
            isTsx,
            hidden,
            reactRuntimeCode,
          },
        });

        worker.on('message', (msg: any) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve(msg);
          }
        });

        worker.on('error', (err: Error) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve({
              passed: false,
              status: 'RUNTIME_ERROR',
              stdout: '',
              stderr: err?.message || 'Worker thread execution error',
              error: err?.message || 'Worker thread execution error',
            });
          }
        });

        worker.on('exit', (code: number) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve({
              passed: false,
              status: code === 0 ? 'ABNORMAL_TERMINATION' : 'RUNTIME_ERROR',
              stdout: '',
              stderr: `Worker exited unexpectedly with code ${code}`,
              error: `Worker exited unexpectedly with code ${code}`,
            });
          }
        });
      } catch {
        clearTimeout(timer);
        // Fallback to direct vm execution if worker cannot be spawned
        runInVmDirectly(runnableCode, runnableTests, sentinel, clampedTimeout, isTsx, hidden).then(resolve);
      }
    });
  } catch {
    workerResult = await runInVmDirectly(runnableCode, runnableTests, sentinel, clampedTimeout, isTsx, hidden);
  }

  const durationMs = Date.now() - start;

  if (workerResult.timedOut) {
    return {
      passed: false,
      stdout: workerResult.stdout || '',
      stderr: workerResult.stderr || 'Execution timed out',
      timedOut: true,
      status: 'TIMEOUT',
      durationMs,
      error: workerResult.error,
    };
  }

  // 4. Verification with Server Sentinel:
  // Pass requires workerResult.passed === true AND the per-run sentinel emitted by the test harness
  const passedWithSentinel = Boolean(workerResult.passed && workerResult.sentinel === sentinel);

  let finalStderr = workerResult.stderr || '';
  if (hidden && !passedWithSentinel) {
    finalStderr = scrubHiddenTestSource(finalStderr, tests);
  }

  let finalStdout = workerResult.stdout || '';
  if (hidden && !passedWithSentinel) {
    finalStdout = scrubHiddenTestSource(finalStdout, tests);
  }

  if (!passedWithSentinel) {
    const finalStatus: JsSandboxStatus =
      workerResult.status === 'COMPILE_ERROR'
        ? 'COMPILE_ERROR'
        : workerResult.status === 'SECURITY_VIOLATION'
        ? 'SECURITY_VIOLATION'
        : 'ASSERTION_FAILED';

    return {
      passed: false,
      stdout: finalStdout,
      stderr: finalStderr || 'Tests failed',
      timedOut: false,
      status: finalStatus,
      durationMs,
      error: workerResult.error,
    };
  }

  return {
    passed: true,
    stdout: finalStdout,
    stderr: '',
    timedOut: false,
    status: 'SUCCESS',
    durationMs,
  };
}
