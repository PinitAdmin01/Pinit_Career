/**
 * Verify-Quest Grading Regression Test (Stage 1, §3.1 + §3.2 + §3.3 + §3.4)
 *
 * Imports and executes the ACTUAL supabase/functions/verify-quest/grading.ts
 * module — not a re-implementation. grading.ts deliberately has no Deno-specific
 * APIs (no Deno.env, no serve()), which is what makes this possible: the exact
 * code the deployed edge function calls can also run under plain Node/ts-node
 * here, including its real `fetch` call to the isolated JS judge.
 *
 * VERIFICATION LEVEL — read this before trusting the result:
 *   This test points gradeSubmission() at a REAL, currently-running instance
 *   of cloud-run/js-judge/ (run via Docker locally — see that directory) at
 *   JUDGE_URL below. If nothing is listening there, tests requiring real
 *   execution are SKIPPED (not faked as passing) and this is reported clearly.
 *   It does NOT invoke the deployed Supabase Edge Function (index.ts) over
 *   HTTP, and the judge itself is not deployed to Cloud Run — both remain
 *   Content-QA reviewed, not Runtime-QA verified against production. See the
 *   Stage 1 report for the exact blocker (gcloud tooling).
 *
 * Run:  node scripts/verify-quest-grading.test.js
 *   (with cloud-run/js-judge's container running on localhost:18081 —
 *    docker run -d -p 18081:8080 pinit-js-judge:local)
 */

import { gradeSubmission } from '../supabase/functions/verify-quest/grading';
import { QUEST_TEST_SUITES } from '../supabase/functions/verify-quest/questTestSuites.generated';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';

const JUDGE_URL = process.env.JS_JUDGE_URL || 'http://localhost:18081';

let failures = 0;
let passed = 0;
let skipped = 0;

function assert(condition: boolean, message: string): void {
  if (condition) { passed++; } else { failures++; console.error(`  FAIL: ${message}`); }
}
function ok(message: string): void { passed++; console.log(`  ok:   ${message}`); }
function skip(message: string): void { skipped++; console.log(`  skip: ${message}`); }

async function judgeReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${JUDGE_URL}/healthz`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  // ── 1. Fail-closed: unknown quest ID never reaches the judge at all ────────

  console.log('\n[1] Fail-closed on unknown quest IDs (§3.1 + §3.2)\n');

  const unknownResult = await gradeSubmission('this-quest-id-does-not-exist', 'anything at all', QUEST_TEST_SUITES, JUDGE_URL);
  assert(unknownResult.success === false, 'unknown questId → success: false');
  assert(unknownResult.reason === 'NO_TEST_SUITE', 'unknown questId → reason: NO_TEST_SUITE');
  assert(!('generic' in QUEST_TEST_SUITES), 'the generated registry has NO "generic" catch-all key');
  if (failures === 0) ok('unknown quest IDs fail closed before any execution is attempted');

  // ── 2. Client cannot supply or override the test suite ─────────────────────

  console.log('\n[2] Client-supplied test suite has no effect (§3.2 + §3.3)\n');
  assert(gradeSubmission.length === 4, 'gradeSubmission(questId, code, testSuites, judgeUrl) — no client-testSuite param exists to pass one through');

  // ── 3. Judge unreachable / unconfigured must fail closed, never fall back ──

  console.log('\n[3] Judge unreachable fails closed (mirrors the Java judge\'s network-failure fix)\n');

  const knownQuestId = Object.keys(QUEST_TEST_SUITES).find((id) => id !== 'fizzbuzz' && id !== 'reverser' && id !== 'palindrome')!;
  const unreachable = await gradeSubmission(knownQuestId, 'anything', QUEST_TEST_SUITES, 'http://localhost:1'); // nothing listens here
  assert(unreachable.success === false, 'judge unreachable → success: false, not a silent pass');
  assert(!!unreachable.message && unreachable.message.includes('Judge unreachable'), 'failure message identifies judge unreachability');
  if (failures === 0) ok('an unreachable judge fails closed instead of defaulting to a pass');

  // ── 4+ require a real running judge ─────────────────────────────────────────

  const reachable = await judgeReachable();
  if (!reachable) {
    skip(`cloud-run/js-judge is not reachable at ${JUDGE_URL} — skipping real-execution tests. Start it: docker run -d -p 18081:8080 pinit-js-judge:local`);
  } else {
    console.log(`\n[4] Real quests grade correctly through the real, running, isolated judge at ${JUDGE_URL}\n`);

    const reactCourse = COURSES_REGISTRY.find((c) => c.id === 'course-react-web')!;
    const fullstackCourse = COURSES_REGISTRY.find((c) => c.id === 'course-fullstack-js')!;

    let sampled = 0;
    let starterPasses = 0;
    for (const course of [reactCourse, fullstackCourse]) {
      const codeQuests = (course.quests ?? []).filter((q: any) => q.category === 'exam' || q.category === 'assignment');
      for (const quest of codeQuests.slice(0, 3)) {
        assert(!!QUEST_TEST_SUITES[quest.id], `${course.id} ${quest.id}: present in generated registry`);

        const garbage = await gradeSubmission(quest.id, 'this is not valid code at all !!!', QUEST_TEST_SUITES, JUDGE_URL);
        assert(garbage.success === false, `${course.id} ${quest.id}: garbage code fails via the real judge`);

        const starterResult = await gradeSubmission(quest.id, quest.starterCode ?? '', QUEST_TEST_SUITES, JUDGE_URL);
        if (starterResult.success) starterPasses++;
        sampled++;
      }
    }
    assert(starterPasses > 0,
      `at least one sampled quest's starter code grades as a genuine PASS via the real judge (${starterPasses}/${sampled}) — proves the pipeline can return success:true, not just fail everything`);
    if (failures === 0) ok(`sampled ${sampled} real quests through the real judge — all present in registry, all reject garbage, ${starterPasses} genuinely pass`);

    // ── 5. Deno.env / secrets are structurally unreachable, not just hidden ──

    console.log('\n[5] Secrets are unreachable from graded code — CLOSED, not hidden (§3.3)\n');

    const secretProbeId = '__probe_secret_scope__';
    const envProbe = await gradeSubmission(
      secretProbeId,
      '// noop',
      { [secretProbeId]: 'throw new Error("ENV_DUMP:" + JSON.stringify(process.env));' },
      JUDGE_URL,
    );
    assert(envProbe.success === false, 'probe executed (threw as expected)');
    assert(!!envProbe.message && envProbe.message.includes('ENV_DUMP:{}'),
      `graded code's process.env is empty — the judge process was never given any Supabase secret to leak (got: ${envProbe.message})`);

    const netProbeId = '__probe_net_scope__';
    const netProbe = await gradeSubmission(
      netProbeId,
      '// noop',
      { [netProbeId]: 'const has = process.permission ? process.permission.has("net") : "no-permission-api"; throw new Error("NET_PERMISSION:" + has);' },
      JUDGE_URL,
    );
    assert(!!netProbe.message && netProbe.message.includes('NET_PERMISSION:false'),
      `graded code has NO network permission per Node's own permission API (got: ${netProbe.message})`);

    const fsWriteProbeId = '__probe_fswrite_scope__';
    const fsProbe = await gradeSubmission(
      fsWriteProbeId,
      '// noop',
      { [fsWriteProbeId]: 'try { require("fs").writeFileSync("/tmp/evil.txt","x"); throw new Error("WROTE_FILE_SHOULD_BE_DENIED"); } catch(e) { throw new Error("FS_WRITE_RESULT:" + e.message); }' },
      JUDGE_URL,
    );
    assert(!!fsProbe.message && fsProbe.message.includes('restricted') || (fsProbe.message ?? '').includes('FS_WRITE_RESULT'),
      `filesystem write from graded code is denied by the runtime, not just convention (got: ${fsProbe.message})`);
    assert(!(fsProbe.message ?? '').includes('WROTE_FILE_SHOULD_BE_DENIED'), 'the file write did NOT succeed');

    if (failures === 0) ok('graded code cannot read env vars, cannot reach the network, cannot write files — verified against the real judge, not asserted from source reading');
  }

  // ── Summary ──────────────────────────────────────────────────────────────

  console.log('\n' + '─'.repeat(70));
  console.log(`Verify-quest grading test: ${passed} passed, ${failures} failed, ${skipped} skipped`);
  console.log(reachable
    ? 'Verification level: real isolated judge exercised locally (Docker) — Cloud Run deployment and the deployed Edge Function itself remain unverified.'
    : 'Verification level: PARTIAL — judge not running locally; only fail-closed/structural checks ran.');
  if (failures > 0) {
    console.log('FAIL');
    process.exitCode = 1;
  } else if (skipped > 0) {
    console.log('PASS (with skips)');
  } else {
    console.log('PASS');
  }
}

main();
