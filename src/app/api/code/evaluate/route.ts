import { NextRequest, NextResponse } from 'next/server';
import vm from 'node:vm';
import { Worker } from 'node:worker_threads';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { CodeWarsApiService } from '@/lib/api/codeWarsApi';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

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
    { pattern: /\bconstructor\b/i, token: 'constructor' },
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

export const CODEWARS_PROBLEM_REGISTRY: Record<
  string,
  {
    functionName: string;
    totalTests: number;
    evaluator: (fn: Function) => { passedCount: number; errorLog?: string };
    evaluatorCode: string;
  }
> = {
  war_tree_lca_01: {
    functionName: 'lowestCommonAncestor',
    totalTests: 3,
    evaluator: (fn) => CodeWarsApiService.evaluateLcaTestCases(fn),
    evaluatorCode: `
      function buildTree(arr) {
        if (!arr || !arr.length || arr[0] === null) return null;
        var root = new TreeNode(arr[0]);
        var queue = [root];
        var i = 1;
        while (queue.length && i < arr.length) {
          var curr = queue.shift();
          if (!curr) break;
          if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.left = new TreeNode(arr[i]);
            queue.push(curr.left);
          }
          i++;
          if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.right = new TreeNode(arr[i]);
            queue.push(curr.right);
          }
          i++;
        }
        return root;
      }

      var cases = [
        { tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8, expected: 6 },
        { tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4, expected: 2 },
        { tree: [2, 1], p: 2, q: 1, expected: 2 }
      ];

      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var t = buildTree(c.tree);
          var res = lowestCommonAncestor(t, c.p, c.q);
          var actualVal = (res && typeof res === 'object' && 'val' in res) ? res.val : res;
          if (actualVal === c.expected) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected ' + c.expected + ', received ' + actualVal
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }

      return {
        passed: true,
        status: 'SUCCESS',
        testsPassed: passedCount,
        totalTests: cases.length
      };
    `,
  },
  war_concurrency_deadlock_02: {
    functionName: 'acquireResourcesDeterministically',
    totalTests: 2,
    evaluator: (fn) => CodeWarsApiService.evaluateConcurrencyTestCases(fn),
    evaluatorCode: `
      var cases = [
        {
          requests: [{ threadId: 'T1', resourceIds: ['R2', 'R1'] }, { threadId: 'T2', resourceIds: ['R1', 'R2'] }],
          expected: ['R1', 'R2']
        },
        {
          requests: [{ threadId: 'T1', resourceIds: ['R3', 'R1', 'R2'] }],
          expected: ['R1', 'R2', 'R3']
        }
      ];

      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = acquireResourcesDeterministically(c.requests);
          var actual = Array.isArray(res) ? res.slice() : [];
          if (JSON.stringify(actual) === JSON.stringify(c.expected)) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected ' + JSON.stringify(c.expected) + ', received ' + JSON.stringify(actual)
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }

      return {
        passed: true,
        status: 'SUCCESS',
        testsPassed: passedCount,
        totalTests: cases.length
      };
    `,
  },
  war_sql_btree_query_03: {
    functionName: 'generateOptimalCompositeIndex',
    totalTests: 2,
    evaluator: (fn) => CodeWarsApiService.evaluateSqlTestCases(fn),
    evaluatorCode: `
      var cases = [
        {
          table: 'orders',
          eq: ['tenant_id', 'status'],
          range: 'created_at',
          expected: 'CREATE INDEX idx_orders_tenant_id_status_created_at ON orders (tenant_id, status, created_at);'
        },
        {
          table: 'logs',
          eq: ['service_id'],
          range: 'timestamp',
          expected: 'CREATE INDEX idx_logs_service_id_timestamp ON logs (service_id, timestamp);'
        }
      ];

      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = generateOptimalCompositeIndex(c.table, c.eq, c.range);
          var normalize = function(s) { return String(s || '').trim().replace(/\\s+/g, ' ').toLowerCase(); };
          if (normalize(res) === normalize(c.expected)) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected "' + c.expected + '", received "' + res + '"'
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }

      return {
        passed: true,
        status: 'SUCCESS',
        testsPassed: passedCount,
        totalTests: cases.length
      };
    `,
  },
};

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
      error: 'Syntax or execution error in submitted solution.'
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
        error: 'Syntax or execution error in submitted solution.',
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
            resolve({
              passed: false,
              status: 'RUNTIME_ERROR',
              testsPassed: 0,
              totalTests: data.totalTests,
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


export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`code_eval_${ip}`, { limit: 20, windowMs: 60_000 });
    if (!rl.allowed) return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 });

    const auth = await requireUserFromRequest(req);
    if (auth.error) {
      return auth.error;
    }

    const body = await req.json();
    const { problemId, code, language } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Task 4.1: Reject unknown or missing problem IDs with HTTP 400 UNSUPPORTED_PROBLEM
    if (!problemId || !CODEWARS_PROBLEM_REGISTRY[problemId]) {
      return NextResponse.json(
        {
          passed: false,
          status: 'UNSUPPORTED_PROBLEM',
          error: 'UNSUPPORTED_PROBLEM',
          message: `Problem '${problemId}' is not supported for evaluation.`,
        },
        { status: 400 }
      );
    }

    const problemConfig = CODEWARS_PROBLEM_REGISTRY[problemId];

    if (language && !['javascript', 'typescript', 'js', 'ts'].includes(language.toLowerCase())) {
      return NextResponse.json(
        {
          passed: false,
          status: 'UNSUPPORTED_LANGUAGE',
          error: `Language '${language}' is not supported by the sandbox evaluator. Only JavaScript and TypeScript are supported.`,
        },
        { status: 400 }
      );
    }

    const secCheck = validateVmCodeSecurity(code);
    if (!secCheck.safe) {
      return NextResponse.json(
        {
          passed: false,
          status: 'SECURITY_VIOLATION',
          reason: secCheck.reason,
          error: `Security violation: ${secCheck.reason}`,
        },
        { status: 400 }
      );
    }

    // Clean code for execution using authoritative cleaner
    const cleanCode = CodeWarsApiService.cleanTypeScriptForExecution(code);

    // Evaluate in secure, isolated sandbox within a worker thread
    const evalRes = await runEvaluationInSandbox({
      cleanCode,
      functionName: problemConfig.functionName,
      totalTests: problemConfig.totalTests,
      evaluatorCode: problemConfig.evaluatorCode,
    });

    if (evalRes.status === 'SYNTAX_ERROR' || evalRes.status === 'EXECUTION_ERROR') {
      return NextResponse.json(
        {
          passed: false,
          status: evalRes.status,
          testsPassed: 0,
          totalTests: problemConfig.totalTests,
          error: evalRes.error,
        },
        { status: 400 }
      );
    }

    if (evalRes.status === 'TIMEOUT' || evalRes.status === 'RUNTIME_ERROR') {
      return NextResponse.json(
        {
          passed: false,
          status: evalRes.status,
          testsPassed: evalRes.testsPassed || 0,
          totalTests: problemConfig.totalTests,
          error: evalRes.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      passed: evalRes.passed,
      status: evalRes.passed ? 'SUCCESS' : 'FAILED',
      testsPassed: evalRes.testsPassed,
      totalTests: problemConfig.totalTests,
      error: evalRes.error,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        passed: false,
        status: 'RUNTIME_ERROR',
        error: err?.message || 'Execution error',
      },
      { status: 500 }
    );
  }
}
