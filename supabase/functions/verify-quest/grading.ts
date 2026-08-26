// supabase/functions/verify-quest/grading.ts
//
// Pure grading orchestration core, deliberately free of any Deno-specific API
// (no Deno.env, no serve(), no remote https:// imports other than a plain
// `fetch` to the judge). This lets the exact same code be:
//   1. imported by index.ts (the deployed Supabase Edge Function), and
//   2. imported and exercised directly by a Node-based regression test
//      (scripts/verify-quest-grading.test.ts) — so this is actually executed
//      and asserted on, not just read and trusted.
//
// STAGE 1 HISTORY (see index.ts for the surrounding HTTP/auth/persistence
// orchestration, unchanged in behavior other than calling into this module):
//
//   §3.1 + §3.2 — fail closed: `testSuites[questId]` with NO fallback. An
//     unknown quest ID has no entry and is rejected before any execution is
//     even attempted.
//
//   §3.3 DENO.ENV — CLOSED (not just hidden). Earlier revisions of this file
//   ran submitted code via `eval`/`indirectEval` INSIDE this Deno isolate,
//   which also holds SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, and
//   QUEST_SIGNING_SECRET via `Deno.env`. Indirect eval hid closure variables
//   but NOT `Deno.env` (a global, not a closure variable) — submitted code
//   could do `throw new Error(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"))` and
//   read the secret back in the response body. Splitting into a second
//   Supabase Edge Function was considered and RULED OUT: Supabase Edge
//   Function secrets are project-wide, not per-function (confirmed against
//   Supabase's docs, Aug 2026) — a second function would see the identical
//   secrets this one does.
//
//   THE FIX: grading no longer executes anything in this process at all.
//   `gradeSubmission()` now POSTs {code, testSuite} to a separate Cloud Run
//   service (cloud-run/js-judge/) that has ZERO Supabase configuration — no
//   URL, no keys, no signing secret are ever given to it, so it cannot leak
//   what it was never given. That service also runs the code in its OWN
//   child process with an explicitly empty environment and Node's permission
//   model denying network/fs-write/process-spawn — see
//   cloud-run/js-judge/server.js for the full isolation model, verified
//   locally: process.env is {} inside the sandboxed child, network access
//   (process.permission.has('net')) is false, fs writes and further process
//   spawning both throw "Access to this API has been restricted."
//
//   §3.4 javaToJs / Java transpilation — RETIRED, not hardened. Java grading
//   was already routed entirely through its own separate judge
//   (cloud-run/java-judge/ via /api/code/run-java) before this change; nothing
//   ever sent language:'java' to verify-quest. The transpiler added risk
//   (regex-mangling arbitrary JS) for zero actual use and has been deleted.

export interface GradeResult {
  success: boolean;
  message?: string;
  reason?: string;
}

/**
 * Grades one submission against the server-owned test-suite registry, by
 * delegating actual execution to the isolated JS judge (see file header).
 * Fails closed (success: false) for any quest ID not present in `testSuites`,
 * and never reads a test suite from any source other than `testSuites` — the
 * caller (a student's browser) supplies code and a quest ID; it never
 * supplies or influences what the code is graded against.
 */
export async function gradeSubmission(
  questId: string,
  code: string,
  testSuites: Record<string, string>,
  judgeUrl: string,
): Promise<GradeResult> {
  const testSuite = testSuites[questId];
  if (!testSuite) {
    return { success: false, message: "NO_TEST_SUITE", reason: "NO_TEST_SUITE" };
  }

  try {
    const res = await fetch(judgeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, testSuite }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { success: false, message: "Judge error: " + (errBody.message || `HTTP ${res.status}`) };
    }
    const result = await res.json() as { success: boolean; message?: string };
    return { success: !!result.success, message: result.message };
  } catch (err) {
    // The judge being unreachable must fail closed, not fall back to any
    // local execution or a default pass — see the Java judge's identical
    // fail-closed fix for the network-failure fallback (Stage 1, Risk 3).
    return { success: false, message: "Judge unreachable: " + (err as Error).message };
  }
}
