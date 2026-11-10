import vm from 'node:vm';
import { Worker } from 'node:worker_threads';
import { CodeWarsApiService } from '@/lib/api/codeWarsApi';

/**
 * Code Wars sandbox (server only): the problem registry and the isolated worker/vm runner that
 * executes JavaScript/TypeScript submissions against each problem's tests. Used by
 * /api/code/evaluate and the arena room route through lib/server/codeWarsJudge.
 */

export interface EvaluatorResult {
  passed: boolean;
  status: 'SUCCESS' | 'FAILED' | 'SYNTAX_ERROR' | 'RUNTIME_ERROR' | 'EXECUTION_ERROR' | 'TIMEOUT';
  testsPassed: number;
  totalTests: number;
  error?: string;
}

export interface SandboxExecutionParams {
  cleanCode: string;
  functionName: string;
  totalTests: number;
  evaluatorCode: string;
}

export function validateVmCodeSecurity(code: string): { safe: boolean; reason?: string } {
  const forbiddenPatterns = [
    { pattern: /\bprocess\b/i, token: 'process' },
    { pattern: /\brequire\b/i, token: 'require' },
    { pattern: /\bimport\b/i, token: 'import' },
    { pattern: /\bglobal\b/i, token: 'global' },
    { pattern: /\bglobalThis\b/i, token: 'globalThis' },
    { pattern: /\bchild_process\b/i, token: 'child_process' },
    { pattern: /\bfs\b/i, token: 'fs' },
    { pattern: /\bFunction\b/, token: 'Function' },
    { pattern: /\beval\b/i, token: 'eval' },
    { pattern: /(?:\.\s*constructor\b|\[\s*['"`]constructor['"`]\s*\]|\bconstructor\s*\.\s*constructor\b)/i, token: 'constructor property traversal' },
    { pattern: /__proto__/i, token: '__proto__' },
    { pattern: /\bprototype\b/i, token: 'prototype' },
    { pattern: /\bReflect\b/i, token: 'Reflect' },
    { pattern: /\bgetPrototypeOf\b/i, token: 'getPrototypeOf' },
    { pattern: /\bsetPrototypeOf\b/i, token: 'setPrototypeOf' },
  ];

  for (const { pattern, token } of forbiddenPatterns) {
    if (pattern.test(code)) {
      return {
        safe: false,
        reason: `Forbidden token ${token}`,
      };
    }
  }

  return { safe: true };
}

/**
 * Execution timeout wrapper guaranteeing that student code evaluation terminates
 * within the deadline, defending against infinite loops or hanging execution.
 */
export async function executeWithTimeout<T>(
  action: () => Promise<T> | T,
  timeoutMs: number = 2500
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Execution timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    try {
      Promise.resolve(action())
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    } catch (syncErr) {
      clearTimeout(timer);
      reject(syncErr);
    }
  });
}

export {
  CODEWARS_PROBLEM_REGISTRY,
  type CodeWarsProblemDefinition,
} from '@/lib/data/codeWarsRegistryData';

const EVALUATOR_WORKER_SCRIPT = `
const { parentPort, workerData } = require('node:worker_threads');
const vm = require('node:vm');
const { cleanCode, functionName, totalTests, evaluatorCode } = workerData;

const INIT_REALM = \`
  var console = { log: function(){}, error: function(){}, warn: function(){}, info: function(){} };
  function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
\`;

try {
  // Context A: student code runs here
  const sandboxA = Object.create(null);
  const contextA = vm.createContext(sandboxA);
  vm.runInContext(INIT_REALM, contextA);

  // 1. Evaluate student script in context A
  try {
    const script = new vm.Script(cleanCode, { filename: 'submission.js' });
    script.runInContext(contextA, { timeout: 1500 });
  } catch (compileErr) {
    parentPort.postMessage({
      passed: false,
      status: compileErr && compileErr.name === 'SyntaxError' ? 'SYNTAX_ERROR' : 'EXECUTION_ERROR',
      testsPassed: 0,
      totalTests: totalTests,
      error: 'syntax or execution error in submitted solution.'
    });
    process.exit(0);
  }

  // 2. Assert that the required function exists in context A
  const fnExists = vm.runInContext('typeof ' + functionName + " === 'function'", contextA);
  if (!fnExists) {
    parentPort.postMessage({
      passed: false,
      status: 'EXECUTION_ERROR',
      testsPassed: 0,
      totalTests: totalTests,
      error: "Solution function '" + functionName + "' was not defined."
    });
    process.exit(0);
  }

  // 3. Run evaluator in a FRESH context B — student code never ran here.
  //    Freeze key built-ins BEFORE injecting the student function so that
  //    student code reaching B's realm via cross-context constructor chains
  //    cannot override JSON.stringify or String used in comparisons.
  const sandboxB = Object.create(null);
  const contextB = vm.createContext(sandboxB);
  vm.runInContext(INIT_REALM, contextB);
  vm.runInContext('Object.freeze(JSON); Object.freeze(String); Object.freeze(Array.prototype);', contextB);
  // Inject the student's function from A into B by reference
  sandboxB[functionName] = sandboxA[functionName];

  const evalScript = new vm.Script('(function() { ' + evaluatorCode + ' })()', { filename: 'evaluator.js' });
  const result = evalScript.runInContext(contextB, { timeout: 1500 });
  parentPort.postMessage({
    passed: Boolean(result && result.passed),
    status: result && result.status ? result.status : (result && result.passed ? 'SUCCESS' : 'FAILED'),
    testsPassed: typeof result?.testsPassed === 'number' ? result.testsPassed : 0,
    totalTests: totalTests,
    error: result && result.error ? String(result.error).slice(0, 200) : undefined
  });
} catch (err) {
  const isTimeout = err && (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || /timed out/i.test(err.message));
  parentPort.postMessage({
    passed: false,
    status: isTimeout ? 'TIMEOUT' : 'EXECUTION_ERROR',
    testsPassed: 0,
    totalTests: totalTests,
    error: isTimeout ? 'Execution timed out (1500ms limit exceeded)' : 'Evaluation runtime failure.'
  });
}
`;

const INIT_REALM_CODE = `
  var console = { log: function(){}, error: function(){}, warn: function(){}, info: function(){} };
  function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
`;

export function runEvaluationInVmDirectly(data: SandboxExecutionParams): EvaluatorResult {
  try {
    // Context A: student code
    const sandboxA: Record<string, any> = Object.create(null);
    const contextA = vm.createContext(sandboxA);
    vm.runInContext(INIT_REALM_CODE, contextA);

    // 1. Evaluate student script in context A
    try {
      const script = new vm.Script(data.cleanCode, { filename: 'submission.js' });
      script.runInContext(contextA, { timeout: 1500 });
    } catch (compileErr: any) {
      return {
        passed: false,
        status: compileErr && compileErr.name === 'SyntaxError' ? 'SYNTAX_ERROR' : 'EXECUTION_ERROR',
        testsPassed: 0,
        totalTests: data.totalTests,
        error: 'syntax or execution error in submitted solution.',
      };
    }

    // 2. Assert that the required function exists
    const fnExists = vm.runInContext(`typeof ${data.functionName} === 'function'`, contextA);
    if (!fnExists) {
      return {
        passed: false,
        status: 'EXECUTION_ERROR',
        testsPassed: 0,
        totalTests: data.totalTests,
        error: `Solution function '${data.functionName}' was not defined.`,
      };
    }

    // 3. Run evaluator in a FRESH context B so student can't forge built-ins.
    // Freeze key intrinsics before injecting the student function.
    const sandboxB: Record<string, any> = Object.create(null);
    const contextB = vm.createContext(sandboxB);
    vm.runInContext(INIT_REALM_CODE, contextB);
    vm.runInContext('Object.freeze(JSON); Object.freeze(String); Object.freeze(Array.prototype);', contextB);
    sandboxB[data.functionName] = sandboxA[data.functionName];

    const evalScript = new vm.Script(`(function() { ${data.evaluatorCode} })()`, { filename: 'evaluator.js' });
    const result = evalScript.runInContext(contextB, { timeout: 1500 });
    return {
      passed: Boolean(result && result.passed),
      status: result && result.status ? result.status : (result && result.passed ? 'SUCCESS' : 'FAILED'),
      testsPassed: typeof result?.testsPassed === 'number' ? result.testsPassed : 0,
      totalTests: data.totalTests,
      error: result && result.error ? String(result.error).slice(0, 200) : undefined,
    };
  } catch (err: any) {
    const isTimeout = err && (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || /timed out/i.test(err.message));
    return {
      passed: false,
      status: isTimeout ? 'TIMEOUT' : 'EXECUTION_ERROR',
      testsPassed: 0,
      totalTests: data.totalTests,
      error: isTimeout ? 'Execution timed out (1500ms limit exceeded)' : 'Evaluation runtime failure.',
    };
  }
}

export async function runEvaluationInSandbox(data: SandboxExecutionParams): Promise<EvaluatorResult> {
  // Execute inside a dedicated OS Worker Thread for true main-thread isolation
  // against synchronous infinite loops (while(true))
  try {
    return await new Promise<EvaluatorResult>((resolve) => {
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
            testsPassed: 0,
            totalTests: data.totalTests,
            error: 'Execution timed out (2000ms limit exceeded)',
          });
        }
      }, 2500);

      try {
        worker = new Worker(EVALUATOR_WORKER_SCRIPT, {
          eval: true,
          workerData: data,
        });

        worker.on('message', (msg: EvaluatorResult) => {
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
            // Multi-Option Failover: If OS worker thread fails, fail over to direct isolated VM
            try {
              console.warn(`[codeWarsSandbox] Worker thread error (${err?.message}), failing over to direct VM isolation`);
              resolve(runEvaluationInVmDirectly(data));
            } catch (vmErr: any) {
              resolve({
                passed: false,
                status: 'RUNTIME_ERROR',
                testsPassed: 0,
                totalTests: data.totalTests,
                error: vmErr?.message || err?.message || 'Worker thread execution error',
              });
            }
          }
        });

        worker.on('exit', (code: number) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            // Multi-Option Failover: If worker exited unexpectedly, attempt direct isolated VM before failing
            if (code !== 0) {
              try {
                console.warn(`[codeWarsSandbox] Worker exited with code ${code}, failing over to direct VM isolation`);
                resolve(runEvaluationInVmDirectly(data));
                return;
              } catch {}
            }
            resolve({
              passed: false,
              status: 'RUNTIME_ERROR',
              testsPassed: 0,
              totalTests: data.totalTests,
              error: `Worker exited unexpectedly with code ${code}`,
            });
          }
        });
      } catch (spawnErr) {
        clearTimeout(timer);
        throw spawnErr;
      }
    });
  } catch {
    // Fallback: direct isolated node:vm execution if worker thread cannot be spawned
    return runEvaluationInVmDirectly(data);
  }
}
