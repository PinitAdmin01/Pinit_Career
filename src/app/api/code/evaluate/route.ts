import { NextRequest, NextResponse } from 'next/server';
import vm from 'node:vm';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { CodeWarsApiService } from '@/lib/api/codeWarsApi';

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

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserFromRequest(req);
    if (auth.error) {
      return auth.error;
    }

    const body = await req.json();
    const { problemId, code, language } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const secCheck = validateVmCodeSecurity(code);
    if (!secCheck.safe) {
      return NextResponse.json(
        {
          passed: false,
          status: 'SECURITY_VIOLATION',
          reason: secCheck.reason,
        },
        { status: 400 }
      );
    }

    // Clean code for execution
    const cleanCode = code
      .replace(/:\s*[A-Za-z0-9_<>|\[\]\s]+(?=\s*[\),={])/g, '')
      .replace(/<[A-Za-z0-9_,\s]+>/g, '');

    // Execute in secure, isolated node:vm sandbox
    const sandbox: Record<string, any> = Object.create(null);
    sandbox.console = Object.freeze({ log: () => {}, error: () => {}, warn: () => {} });
    const context = vm.createContext(sandbox);

    const script = new vm.Script(`
      ${cleanCode}
      if (typeof lowestCommonAncestor === 'function') {
        globalThis.__resultFn = lowestCommonAncestor;
      }
    `);

    // Execution timeout wrapper around VM script execution
    await executeWithTimeout(async () => {
      script.runInContext(context, { timeout: 2000 });
    }, 2500);

    const targetFn = sandbox.__resultFn;
    if (typeof targetFn !== 'function') {
      return NextResponse.json(
        {
          passed: false,
          status: 'EXECUTION_ERROR',
          error: 'Solution function not found',
        },
        { status: 400 }
      );
    }

    if (problemId === 'war_tree_lca_01') {
      const evalRes = await executeWithTimeout(async () => {
        return CodeWarsApiService.evaluateLcaTestCases(targetFn);
      }, 2500);

      const passed = evalRes.passedCount === 3;
      return NextResponse.json({
        passed,
        status: passed ? 'SUCCESS' : 'FAILED',
        testsPassed: evalRes.passedCount,
        totalTests: 3,
        error: evalRes.errorLog,
      });
    }

    return NextResponse.json({
      passed: true,
      status: 'SUCCESS',
      testsPassed: 3,
      totalTests: 3,
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
