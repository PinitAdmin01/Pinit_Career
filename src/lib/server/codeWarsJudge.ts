import type { SupabaseClient } from '@supabase/supabase-js';
import { CodeWarsApiService } from '@/lib/api/codeWarsApi';
import {
  CODEWARS_PROBLEM_REGISTRY,
  runEvaluationInSandbox,
  validateVmCodeSecurity,
} from '@/lib/server/codeWarsSandbox';
import { runPythonInSandbox } from '@/lib/server/pythonSandbox';
import { grantXp, xpAlreadyGranted } from '@/lib/server/xpGrant';

/**
 * The authoritative Code Wars / arena judge, run on the server:
 * JavaScript and TypeScript are executed in the secure worker VM sandbox.
 * Python is executed in the isolated pythonSandbox with deterministic test suites.
 * A result the browser reports is never used to decide a pass, a winner, or XP.
 */

export type JudgeResult =
  | { ok: true; passed: boolean; testsPassed: number; totalTests: number; error?: string }
  | { ok: false; error: 'UNSUPPORTED_PROBLEM' | 'SECURITY_VIOLATION' | 'CODE_REQUIRED'; message: string };

const JS_LANGUAGES = new Set(['javascript', 'typescript', 'js', 'ts']);
const PYTHON_LANGUAGES = new Set(['python', 'py']);

export async function judgeCodeWarsSubmission(problemId: unknown, code: unknown, language: unknown): Promise<JudgeResult> {
  if (typeof code !== 'string' || !code.trim()) return { ok: false, error: 'CODE_REQUIRED', message: 'Code is required.' };
  const id = typeof problemId === 'string' ? problemId : '';
  const lang = typeof language === 'string' && language.trim() ? language.trim().toLowerCase() : 'typescript';

  const config = CODEWARS_PROBLEM_REGISTRY[id];
  if (!config) return { ok: false, error: 'UNSUPPORTED_PROBLEM', message: `Problem '${id}' is not supported for evaluation.` };

  // 1. JavaScript & TypeScript: Evaluated in Node VM Sandbox
  if (JS_LANGUAGES.has(lang)) {
    const security = validateVmCodeSecurity(code);
    if (!security.safe) return { ok: false, error: 'SECURITY_VIOLATION', message: `Security violation: ${security.reason}` };
    const res = await runEvaluationInSandbox({
      cleanCode: CodeWarsApiService.cleanTypeScriptForExecution(code),
      functionName: config.functionName,
      totalTests: config.totalTests,
      evaluatorCode: config.evaluatorCode,
    });
    return { ok: true, passed: res.passed === true, testsPassed: res.testsPassed || 0, totalTests: config.totalTests, error: res.error };
  }

  // 2. Python: Evaluated in Sandboxed Python Runner
  if (PYTHON_LANGUAGES.has(lang)) {
    if (config.pythonTests) {
      const pyRes = await runPythonInSandbox({
        code,
        tests: config.pythonTests,
        timeoutMs: 3500,
      });

      if (pyRes.isSecurityViolation) {
        return { ok: false, error: 'SECURITY_VIOLATION', message: pyRes.stderr };
      }

      if (pyRes.passed) {
        return {
          ok: true,
          passed: true,
          testsPassed: config.totalTests,
          totalTests: config.totalTests,
        };
      }

      let testsPassed = 0;
      let errorMsg = pyRes.stderr || 'Python assertion failed';
      const match = pyRes.stderr.match(/Test case (\d+) failed/i);
      if (match && match[1]) {
        const failedNum = parseInt(match[1], 10);
        testsPassed = Math.max(0, failedNum - 1);
      }

      return {
        ok: true,
        passed: false,
        testsPassed,
        totalTests: config.totalTests,
        error: errorMsg.split('\n')[0].replace(/\r/g, ''),
      };
    }
  }

  // 3. Fallback Polyglot Verification
  const poly = CodeWarsApiService.judgePolyglotSubmission(id, code, lang);
  if (!poly) return { ok: false, error: 'UNSUPPORTED_PROBLEM', message: `Problem '${id}' is not supported for evaluation.` };
  return { ok: true, ...poly };
}

/** Score of a judged submission (same formula the arena always showed). */
export function codeWarsScore(judged: { passed: boolean; testsPassed: number; totalTests: number }, secondsSpent: number, timeLimitSeconds: number): number {
  if (judged.passed) {
    const limit = timeLimitSeconds > 0 ? timeLimitSeconds : 600;
    return Math.max(75, Math.min(100, Math.round(100 - (Math.max(0, secondsSpent) / limit) * 20)));
  }
  return judged.totalTests > 0 ? Math.max(0, Math.round((judged.testsPassed / judged.totalTests) * 50)) : 0;
}

/** XP for the first time a student solves a problem (server-judged), once per problem. */
export async function grantFirstClearXp(
  admin: SupabaseClient,
  userId: string,
  problemId: string
): Promise<{ xpAwarded: number; newXp?: number }> {
  const reason = `[arena] first clear: ${problemId}`;
  const already = await xpAlreadyGranted(admin, userId, reason);
  if (already !== false) return { xpAwarded: 0 };
  const amount = Math.min(500, Math.max(1, CodeWarsApiService.getAuthoritativeProblem(problemId)?.xpReward ?? 150));
  const grant = await grantXp(admin, userId, amount, reason);
  return grant.ok ? { xpAwarded: amount, newXp: grant.newXp } : { xpAwarded: 0 };
}
