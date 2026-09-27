import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { CodeWarsApiService } from '@/lib/api/codeWarsApi';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { grantFirstClearXp, judgeCodeWarsSubmission } from '@/lib/server/codeWarsJudge';
import {
  CODEWARS_PROBLEM_REGISTRY,
  runEvaluationInSandbox,
  validateVmCodeSecurity,
} from '@/lib/server/codeWarsSandbox';

// Older scripts import the sandbox from this route.
export {
  CODEWARS_PROBLEM_REGISTRY,
  executeWithTimeout,
  runEvaluationInSandbox,
  runEvaluationInVmDirectly,
  validateVmCodeSecurity,
} from '@/lib/server/codeWarsSandbox';
export type { EvaluatorResult, SandboxExecutionParams } from '@/lib/server/codeWarsSandbox';

/** XP for the first server-judged pass of a problem (never decided by the browser). */
async function firstClearXp(userId: string, problemId: string): Promise<{ xpAwarded: number; newXp?: number }> {
  try {
    return await grantFirstClearXp(getSupabaseAdmin(), userId, problemId);
  } catch (err: unknown) {
    console.warn('[code/evaluate] first-clear XP failed:', err instanceof Error ? err.message : err);
    return { xpAwarded: 0 };
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

    // Other languages cannot run in the JS sandbox: the server judges them with the polyglot checks.
    if (typeof language === 'string' && !['javascript', 'typescript', 'js', 'ts'].includes(language.toLowerCase())) {
      const judged = await judgeCodeWarsSubmission(problemId, code, language);
      if (!judged.ok) {
        return NextResponse.json({ passed: false, status: judged.error, error: judged.message }, { status: 400 });
      }
      const xp = judged.passed ? await firstClearXp(auth.user.id, problemId) : { xpAwarded: 0 };
      return NextResponse.json({
        passed: judged.passed,
        status: judged.passed ? 'SUCCESS' : 'FAILED',
        testsPassed: judged.testsPassed,
        totalTests: judged.totalTests,
        error: judged.error,
        ...xp,
      });
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

    const xp = evalRes.passed ? await firstClearXp(auth.user.id, problemId) : { xpAwarded: 0 };
    return NextResponse.json({
      passed: evalRes.passed,
      status: evalRes.passed ? 'SUCCESS' : 'FAILED',
      testsPassed: evalRes.testsPassed,
      totalTests: problemConfig.totalTests,
      error: evalRes.error,
      ...xp,
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
