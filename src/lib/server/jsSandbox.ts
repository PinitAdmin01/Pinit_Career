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

const MAX_CONCURRENT_WORKERS = 4;
let activeWorkers = 0;
const workerQueue: (() => void)[] = [];

async function acquireWorkerSlot(): Promise<void> {
  if (activeWorkers < MAX_CONCURRENT_WORKERS) {
    activeWorkers++;
    return;
  }
  await new Promise<void>((resolve) => workerQueue.push(resolve));
  activeWorkers++;
}

function releaseWorkerSlot(): void {
  activeWorkers--;
  const next = workerQueue.shift();
  if (next) next();
}

const WORKER_SCRIPT = `
const { parentPort, workerData } = require('node:worker_threads');
const vm = require('node:vm');

async function run() {
  const { code, tests, sentinel, timeoutMs, isTsx, hidden, reactRuntimeCode } = workerData;

  // 1. Create an isolated VM context with NO host functions or host objects injected
  const context = vm.createContext({});

  // 2. Initialize console and assert strictly from strings evaluated inside the VM context
  const initScript = \`
    globalThis.__pinit_stdout__ = [];
    globalThis.__pinit_stderr__ = [];

    function __formatArg(a) {
      if (a === null) return 'null';
      if (a === undefined) return 'undefined';
      if (typeof a === 'object') {
        try { return JSON.stringify(a); } catch { return String(a); }
      }
      return String(a);
    }

    globalThis.console = {
      log: (...args) => {
        globalThis.__pinit_stdout__.push(args.map(__formatArg).join(' '));
      },
      error: (...args) => {
        globalThis.__pinit_stderr__.push(args.map(__formatArg).join(' '));
      },
      warn: (...args) => {
        globalThis.__pinit_stderr__.push(args.map(__formatArg).join(' '));
      },
      info: (...args) => {
        globalThis.__pinit_stdout__.push(args.map(__formatArg).join(' '));
      }
    };

    Object.defineProperty(globalThis, 'assert', {
      value: function(cond, msg) {
        if (!cond) throw new Error(msg || 'Assertion failed');
      },
      writable: false,
      configurable: false,
    });

    class TextEncoder {
      encode(str) {
        str = String(str);
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
            const next = str.charCodeAt(i + 1);
            if (next >= 0xdc00 && next <= 0xdfff) {
              c = ((c - 0xd800) << 10) + (next - 0xdc00) + 0x10000;
              i++;
            }
          }
          if (c < 0x80) {
            bytes.push(c);
          } else if (c < 0x800) {
            bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
          } else if (c < 0x10000) {
            bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
          } else {
            bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
          }
        }
        return new Uint8Array(bytes);
      }
    }
    globalThis.TextEncoder = TextEncoder;

    class TextDecoder {
      decode(bytes) {
        if (!bytes) return '';
        const b = new Uint8Array(bytes.buffer || bytes);
        let str = '';
        for (let i = 0; i < b.length; i++) {
          str += String.fromCharCode(b[i]);
        }
        return str;
      }
    }
    globalThis.TextDecoder = TextDecoder;
  \`;

  vm.runInContext(initScript, context);

  if (isTsx && reactRuntimeCode) {
    try {
      vm.runInContext(reactRuntimeCode, context);
      vm.runInContext(\`
        globalThis.render = function(Component, props) {
          const R = globalThis.__PINIT_REACT__ || { React: globalThis.React, renderToStaticMarkup: globalThis.renderToStaticMarkup };
          if (!R || !R.renderToStaticMarkup || !R.React) {
            throw new Error('React render runtime is not initialized');
          }
          return R.renderToStaticMarkup(R.React.createElement(Component, props || {}));
        };
      \`, context);
    } catch {}
  }

  // 3. Evaluate student code in fresh context
  try {
    const studentScript = new vm.Script(code, { filename: 'submission.js' });
    studentScript.runInContext(context, { timeout: timeoutMs });
  } catch (err) {
    const stdout = (context.__pinit_stdout__ || []).join('\\n');
    const stderr = err && err.message ? err.message : String(err);
    parentPort.postMessage({
      passed: false,
      status: err && err.name === 'SyntaxError' ? 'COMPILE_ERROR' : 'RUNTIME_ERROR',
      stdout,
      stderr,
      error: stderr,
    });
    process.exit(1);
    return;
  }

  // 4. Evaluate test assertions with frozen assert in fresh function scope
  if (tests && tests.trim()) {
    try {
      const wrapped = \`
        ((assert) => {
          return (async () => {
            \${tests}
          })();
        })(globalThis.assert);
      \`;
      const testScript = new vm.Script(wrapped, { filename: 'tests.js' });
      const p = testScript.runInContext(context, { timeout: timeoutMs });
      if (p && typeof p.then === 'function') {
        await p;
      }
    } catch (testErr) {
      const errMsg = testErr && testErr.message ? testErr.message : String(testErr);
      const stdout = (context.__pinit_stdout__ || []).join('\\n');
      parentPort.postMessage({
        passed: false,
        status: 'ASSERTION_FAILED',
        stdout,
        stderr: errMsg,
        error: errMsg,
      });
      process.exit(1);
      return;
    }
  }

  // 5. Tests completed successfully: emit server per-run sentinel and exit 0
  const stdout = (context.__pinit_stdout__ || []).join('\\n');
  parentPort.postMessage({
    passed: true,
    sentinel: sentinel,
    status: 'SUCCESS',
    stdout,
    stderr: '',
  });
  process.exit(0);
}

run().catch((err) => {
  const errMsg = err && err.message ? err.message : String(err);
  parentPort.postMessage({
    passed: false,
    status: 'RUNTIME_ERROR',
    stdout: '',
    stderr: errMsg,
    error: errMsg,
  });
  process.exit(1);
});
`;

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
    await acquireWorkerSlot();
    try {
      workerResult = await new Promise((resolve) => {
        let settled = false;
        let worker: Worker | null = null;
        let postedMsg: any = null;

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
            env: {},
            resourceLimits: {
              maxOldGenerationSizeMb: 64,
              maxYoungGenerationSizeMb: 16,
            },
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
            postedMsg = msg;
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
              if (code === 0 && postedMsg && postedMsg.passed && postedMsg.sentinel === sentinel) {
                resolve(postedMsg);
              } else if (postedMsg && !postedMsg.passed) {
                resolve(postedMsg);
              } else {
                resolve({
                  passed: false,
                  status: code === 0 ? 'ABNORMAL_TERMINATION' : 'RUNTIME_ERROR',
                  stdout: postedMsg?.stdout || '',
                  stderr: postedMsg?.stderr || `Worker exited unexpectedly with code ${code}`,
                  error: postedMsg?.error || `Worker exited unexpectedly with code ${code}`,
                });
              }
            }
          });
        } catch (spawnErr: any) {
          clearTimeout(timer);
          resolve({
            passed: false,
            status: 'RUNTIME_ERROR',
            stdout: '',
            stderr: spawnErr?.message || 'Failed to spawn sandbox worker',
            error: spawnErr?.message || 'Failed to spawn sandbox worker',
          });
        }
      });
    } finally {
      releaseWorkerSlot();
    }
  } catch (err: any) {
    workerResult = {
      passed: false,
      status: 'RUNTIME_ERROR',
      stdout: '',
      stderr: err?.message || 'Sandbox execution error',
      error: err?.message || 'Sandbox execution error',
    };
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
