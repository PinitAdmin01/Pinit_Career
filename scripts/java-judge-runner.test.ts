/**
 * Java Judge Runner Regression Test (Stage 1, §1.3 fail-closed / Gate 1 & 6)
 *
 * Imports and executes the ACTUAL executeJavaJudgeSuite() from
 * src/lib/code/runners/javaJudgeRunner.ts. Mocks the global `fetch` the module
 * calls, so both branches (HTTP failure response, and a genuine network-level
 * exception) can be exercised deterministically in Node.
 *
 * BEFORE this fix: when `fetch('/api/code/run-java', ...)` REJECTED (network
 * exception — offline, dropped connection, blocked request), the catch block
 * ran a trivial regex check ("does the code contain `class \w+` and a
 * `public static ... \w+(` signature?") and returned `allPassed: true` for any
 * code shaped like that — with ZERO compilation or test execution. This is
 * exactly the kind of code QuestWorkspaceClient.tsx feeds straight into
 * `addCompletedQuest(...)`.
 *
 * AFTER: a fetch-level exception returns `allPassed: false`, status
 * 'RUNTIME_ERROR' — fail closed, matching how a non-2xx HTTP response already
 * behaved.
 *
 * Run: node scripts/java-judge-runner.test.js
 */

import { executeJavaJudgeSuite } from '../src/lib/code/runners/javaJudgeRunner';

let failures = 0;
let passed = 0;
function assert(condition: boolean, message: string): void {
  if (condition) { passed++; } else { failures++; console.error(`  FAIL: ${message}`); }
}
function ok(message: string): void { passed++; console.log(`  ok:   ${message}`); }

const SYNTACTICALLY_PLAUSIBLE_BUT_WRONG_JAVA = `
public class Solution {
  public static int add(int a, int b) {
    return a - b; // deliberately WRONG — would fail any real test suite
  }
}
`;

async function main() {
  const originalFetch = (global as any).fetch;

  // ── 1. Network-level exception (the historical fail-open case) ───────────
  console.log('\n[1] fetch() throws (network error / offline) — must fail closed\n');
  (global as any).fetch = async () => { throw new TypeError('Failed to fetch'); };
  try {
    const result = await executeJavaJudgeSuite(SYNTACTICALLY_PLAUSIBLE_BUT_WRONG_JAVA, 'irrelevant test suite', [], 3000, 'probe-quest', 100);
    assert(result.allPassed === false, 'network exception -> allPassed: false (was: true, via AST heuristic)');
    assert(result.status === 'RUNTIME_ERROR', `network exception -> status: RUNTIME_ERROR (got: ${result.status})`);
    assert(result.passedTests === 0, 'network exception -> passedTests: 0');
    assert(!result.terminalLogs?.some(l => l.includes('AST')), 'no "AST"/heuristic-pass language remains in terminal logs');
  } finally {
    (global as any).fetch = originalFetch;
  }
  if (failures === 0) ok('fetch-level exception now fails closed instead of running a fake AST pass');

  // ── 2. Non-2xx HTTP response (was already correct — must remain so) ──────
  console.log('\n[2] fetch() resolves with a non-2xx response — must still fail closed (regression guard)\n');
  (global as any).fetch = async () => new Response(JSON.stringify({ error: 'Unhandled API path' }), { status: 404 });
  try {
    const result = await executeJavaJudgeSuite(SYNTACTICALLY_PLAUSIBLE_BUT_WRONG_JAVA, 'irrelevant', [], 3000);
    assert(result.allPassed === false, '404 response -> allPassed: false');
  } finally {
    (global as any).fetch = originalFetch;
  }
  if (failures === 0) ok('non-2xx HTTP response still fails closed (unchanged, verified as a regression guard)');

  // ── 3. A genuine passing judge response is still honored (no over-correction) ─
  console.log('\n[3] fetch() resolves with a real PASS — must still report success (no over-correction to always-fail)\n');
  (global as any).fetch = async () => new Response(JSON.stringify({
    language: 'java', totalTests: 1, passedTests: 1, failedTests: 0, allPassed: true,
    status: 'SUCCESS', totalDurationMs: 10, terminalLogs: ['ok'], testOutcomes: [],
  }), { status: 200 });
  try {
    const result = await executeJavaJudgeSuite('public class Solution {}', 'test', [], 3000);
    assert(result.allPassed === true, 'genuine judge PASS is still honored (fix did not make everything fail)');
  } finally {
    (global as any).fetch = originalFetch;
  }
  if (failures === 0) ok('genuine passing judge responses are unaffected');

  console.log('\n' + '─'.repeat(70));
  console.log(`Java judge runner test: ${passed} passed, ${failures} failed`);
  if (failures > 0) { console.log('FAIL'); process.exitCode = 1; } else { console.log('PASS'); }
}

main();
