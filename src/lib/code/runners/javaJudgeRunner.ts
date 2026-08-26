import { TestCase, SuiteExecutionResult } from '../types';
import { supabase } from '../../supabaseClient';

// STAGE 1 FIX (Risk 3 — Java judge unreachable): a global fetch interceptor
// (src/lib/fetchInterceptor.ts) patches window.fetch for every '/api/*' path
// and reroutes it into a client-side mock router (firestoreRouter), UNLESS the
// request carries `X-Pinit-Direct: 1`. This fetch call previously carried no
// such header, so it was NEVER reaching this Next.js server route — proven
// empirically: an identical request with vs. without this header returns two
// completely different response shapes (the mock's `getUid()`-driven
// {code:'UNAUTHORIZED', error:'Not logged in'} vs. the real route's own
// requireUserFromRequest {error:'UNAUTHORIZED', message:'Bearer session token
// required.'}). Every Java submission was silently graded by whatever
// firestoreRouter does for an unmatched path (a 404), never by real javac/java.
//
// The real route also requires a Bearer token (requireUserFromRequest) that
// this call never sent — added below, read the same way client.ts's own
// authenticated fetch branch does.
async function buildDirectAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'X-Pinit-Direct': '1' };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  } catch {
    // No session available — the real route will correctly reject with 401,
    // which is the fail-closed behavior we want (never silently "pass").
  }
  return headers;
}

export async function executeJavaJudgeSuite(
  code: string,
  testSuite?: string,
  testCases: TestCase[] = [],
  timeoutMs: number = 3500,
  questId?: string,
  xp?: number
): Promise<SuiteExecutionResult> {
  const startTime = Date.now();

  try {
    const res = await fetch('/api/code/run-java', {
      method: 'POST',
      headers: await buildDirectAuthHeaders(),
      body: JSON.stringify({
        code,
        testSuite,
        testCases,
        timeoutMs,
        // §3.5/§3.6: lets the server record the authoritative completion for
        // THIS specific verified run, independent of any client-side call.
        questId,
        xp
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Judge connection failed' }));
      return {
        language: 'java',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        allPassed: false,
        status: 'RUNTIME_ERROR',
        totalDurationMs: Date.now() - startTime,
        terminalLogs: [
          `[JAVA JUDGE GATEWAY] Server execution returned status ${res.status}`,
          errData.error || 'Server error during Java execution.'
        ],
        testOutcomes: [{
          index: 1,
          testCaseName: 'Server Execution',
          input: 'Code submission',
          expectedOutput: 'Clean compilation & test pass',
          actualOutput: errData.error || 'Execution failed',
          passed: false,
          durationMs: Date.now() - startTime
        }],
        error: errData.error
      };
    }

    const data: SuiteExecutionResult = await res.json();
    return data;
  } catch (err: any) {
    // STAGE 1 FIX (§1.3 fail-closed / Gate 1 & 6): this branch previously ran a
    // trivial regex/AST check ("does the text contain `class \w+` and a
    // `public static ... \w+(` signature?") and returned `allPassed: isBasicPass`
    // AS IF it were a real judge result — on ANY network failure reaching
    // /api/code/run-java (a dropped request, an offline student, a blocked
    // request). No compilation and no test execution ever happened, yet a
    // syntactically-plausible submission was granted a pass and fed directly
    // into QuestWorkspaceClient's `if (result.allPassed) addCompletedQuest(...)`.
    // A judge that cannot be reached must fail closed, not fall back to a
    // heuristic that looks like a pass.
    return {
      language: 'java',
      totalTests: testCases.length || 1,
      passedTests: 0,
      failedTests: testCases.length || 1,
      allPassed: false,
      status: 'RUNTIME_ERROR',
      totalDurationMs: Date.now() - startTime,
      terminalLogs: [
        '[JAVA JUDGE GATEWAY] Could not reach the compiler judge (network error).',
        'Fail-closed: no compilation or test execution occurred. This submission is NOT verified — please retry when connectivity is restored.',
        err?.message ? `[DETAIL] ${err.message}` : '',
      ].filter(Boolean),
      testOutcomes: [{
        index: 1,
        testCaseName: 'Judge Connectivity',
        input: 'Code submission',
        expectedOutput: 'Reach compiler judge',
        actualOutput: 'Judge unreachable — fail-closed, not a syntax check',
        passed: false,
        durationMs: Date.now() - startTime,
        error: err?.message,
      }],
      error: err?.message,
    };
  }
}
