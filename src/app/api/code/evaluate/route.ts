import { NextRequest, NextResponse } from 'next/server';
import vm from 'node:vm';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { CodeWarsApiService } from '@/lib/api/codeWarsApi';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

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
  }
> = {
  war_tree_lca_01: {
    functionName: 'lowestCommonAncestor',
    totalTests: 3,
    evaluator: (fn) => CodeWarsApiService.evaluateLcaTestCases(fn),
  },
  war_concurrency_deadlock_02: {
    functionName: 'acquireResourcesDeterministically',
    totalTests: 2,
    evaluator: (fn) => CodeWarsApiService.evaluateConcurrencyTestCases(fn),
  },
  war_sql_btree_query_03: {
    functionName: 'generateOptimalCompositeIndex',
    totalTests: 2,
    evaluator: (fn) => CodeWarsApiService.evaluateSqlTestCases(fn),
  },
};

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

    // Execute in secure, isolated node:vm sandbox
    const sandbox: Record<string, any> = Object.create(null);
    sandbox.console = Object.freeze({ log: () => {}, error: () => {}, warn: () => {} });
    sandbox.Math = Math;
    sandbox.Date = Date;
    sandbox.Array = Array;
    sandbox.Object = Object;
    sandbox.String = String;
    sandbox.Number = Number;
    sandbox.Boolean = Boolean;
    sandbox.RegExp = RegExp;
    sandbox.JSON = JSON;
    sandbox.parseInt = parseInt;
    sandbox.parseFloat = parseFloat;
    sandbox.isNaN = isNaN;
    sandbox.isFinite = isFinite;
    sandbox.Map = Map;
    sandbox.Set = Set;

    let targetFn: Function | null = null;
    sandbox.__exportFn = (fn: Function) => {
      targetFn = fn;
    };

    const context = vm.createContext(sandbox);

    const scriptPreamble = `
      if (typeof TreeNode === 'undefined') {
        function TreeNode(val, left, right) {
          this.val = (val === undefined ? 0 : val);
          this.left = (left === undefined ? null : left);
          this.right = (right === undefined ? null : right);
        }
      }
    `;

    const scriptPostamble = `
      if (typeof ${problemConfig.functionName} === 'function') {
        __exportFn(${problemConfig.functionName});
      }
    `;

    // Task 4.3: Add clean error handling when non-JavaScript/invalid syntax is submitted
    let script: vm.Script;
    try {
      script = new vm.Script(`${scriptPreamble}\n${cleanCode}\n${scriptPostamble}`, {
        filename: 'submission.js',
      });
    } catch (syntaxErr: any) {
      return NextResponse.json(
        {
          passed: false,
          status: 'SYNTAX_ERROR',
          testsPassed: 0,
          totalTests: problemConfig.totalTests,
          error: `Invalid JavaScript syntax: ${syntaxErr?.message || 'Syntax error'}`,
        },
        { status: 400 }
      );
    }

    // Execution timeout wrapper around VM script execution
    try {
      await executeWithTimeout(async () => {
        script.runInContext(context, { timeout: 2000 });
      }, 2500);
    } catch (runErr: any) {
      return NextResponse.json(
        {
          passed: false,
          status: 'RUNTIME_ERROR',
          testsPassed: 0,
          totalTests: problemConfig.totalTests,
          error: `Runtime error during initialization: ${runErr?.message || 'Execution error'}`,
        },
        { status: 400 }
      );
    }

    if (typeof targetFn !== 'function') {
      return NextResponse.json(
        {
          passed: false,
          status: 'EXECUTION_ERROR',
          testsPassed: 0,
          totalTests: problemConfig.totalTests,
          error: `Solution function '${problemConfig.functionName}' was not found or not defined.`,
        },
        { status: 400 }
      );
    }

    // Task 4.1: Authoritatively evaluate target function against problem test cases
    const evalRes = await executeWithTimeout(async () => {
      return problemConfig.evaluator(targetFn!);
    }, 2500);

    const totalTests = problemConfig.totalTests;
    const passed = evalRes.passedCount === totalTests;

    return NextResponse.json({
      passed,
      status: passed ? 'SUCCESS' : 'FAILED',
      testsPassed: evalRes.passedCount,
      totalTests,
      error: evalRes.errorLog,
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
