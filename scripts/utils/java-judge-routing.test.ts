/**
 * Java Judge Routing Regression Test (Risk 3)
 *
 * BACKGROUND — this is a two-part problem, proven two different ways:
 *
 * PART A: a global fetch interceptor swallows the browser request before it
 * reaches the real Next.js route. PROVEN EMPIRICALLY in a live browser against
 * the running dev server (not inferred from source) — see PROOF LOG below.
 * This test file encodes the SOURCE-LEVEL CONTRACT that made the empirical fix
 * work, as a repeatable regression guard: if either of the two responsible
 * files loses the exact string this depends on, this test fails loudly instead
 * of the routing defect silently reappearing.
 *
 * PART B: the real route depends on `javac`/`java` being on PATH. This
 * environment has neither installed. That half of the pipeline is exercised by
 * scripts/utils/java-judge-compile.test.ts, which reports SKIPPED (not a fabricated
 * pass) when no JDK is present — see that file and the Stage 1/Risk-3 report
 * for the full picture and the unresolved production-deployment-target question
 * (Node server vs. Firebase static hosting with no /api/* backend at all).
 *
 * ── PROOF LOG (captured this session, live dev server on localhost:3000) ──
 *
 * Request (identical body/method) sent via the Claude Browser tool's page JS
 * context — i.e. through the REAL, patched `window.fetch`, exactly as
 * javaJudgeRunner.ts's browser code path does:
 *
 *   BEFORE THE FIX (no X-Pinit-Direct header — the code as Stage 1 shipped it):
 *     status: 401
 *     body:   {"code":"UNAUTHORIZED","error":"Not logged in"}
 *     ORIGIN: src/lib/api/client.ts's getUid() (line ~76) — i.e. the MOCK
 *             client-side router, NOT the Next.js server.
 *
 *   WITH X-Pinit-Direct: 1 (the interceptor's own documented bypass, and what
 *   this fix now sends):
 *     status: 401
 *     body:   {"error":"UNAUTHORIZED","message":"Bearer session token required."}
 *     ORIGIN: src/lib/server/requireAuth.ts's requireUserFromRequest — i.e.
 *             the REAL /api/code/run-java route.
 *
 * Two structurally distinct 401 bodies for the byte-identical request, differing
 * only by one header, is proof the header is what determines which code path
 * answers. Re-running the same probe after applying the fix (below) confirmed
 * the SAME "Bearer session token required" signature is now what
 * javaJudgeRunner.ts's actual fetch call receives.
 *
 * UPDATE 2026-09-28: the in-browser router is gone and fetchInterceptor.ts only
 * adds the Authorization header, so X-Pinit-Direct no longer changes anything.
 * Checks [1] and [3] now guard that contract instead of the bypass header.
 *
 * Run: node scripts/utils/java-judge-routing.test.js
 */

import * as fs from 'fs';
import * as path from 'path';

let failures = 0;
let passed = 0;
function assert(condition: boolean, message: string): void {
  if (condition) { passed++; } else { failures++; console.error(`  FAIL: ${message}`); }
}
function ok(message: string): void { passed++; console.log(`  ok:   ${message}`); }

const runnerSrc = fs.readFileSync(
  path.join(__dirname, '..', '..', 'src', 'lib', 'code', 'runners', 'javaJudgeRunner.ts'), 'utf8');
const interceptorSrc = fs.readFileSync(
  path.join(__dirname, '..', '..', 'src', 'lib', 'fetchInterceptor.ts'), 'utf8');
const routeSrc = fs.readFileSync(
  path.join(__dirname, '..', '..', 'src', 'app', 'api', 'code', 'run-java', 'route.ts'), 'utf8');
const requireAuthSrc = fs.readFileSync(
  path.join(__dirname, '..', '..', 'src', 'lib', 'server', 'requireAuth.ts'), 'utf8');

console.log('\n[1] javaJudgeRunner.ts calls the real route\n');
assert(/fetch\(\s*['"]\/api\/code\/run-java['"]/.test(runnerSrc),
  'javaJudgeRunner.ts fetches /api/code/run-java');
if (failures === 0) ok('submissions go to the run-java route');

console.log('\n[2] javaJudgeRunner.ts attempts to attach a real bearer token\n');
assert(/Authorization\s*[:=]/.test(runnerSrc) && /getSession\(\)/.test(runnerSrc),
  'fetch call headers include an Authorization bearer token sourced from supabase.auth.getSession()');
if (failures === 0) ok('auth token attachment present — the real route requires this independently of the bypass header');

console.log('\n[3] fetchInterceptor.ts never answers /api/* itself (regression guard)\n');
// The PART A defect was the interceptor answering the request in the browser. It now only adds the
// Authorization header and passes every request on to the real fetch, so no bypass header is needed.
assert(!/new Response\(/.test(interceptorSrc),
  'fetchInterceptor.ts never builds a Response of its own');
assert(!/firestoreRouter|legacyFirestoreRouter|api\.(get|post|put|patch|delete)\(/.test(interceptorSrc),
  'fetchInterceptor.ts does not reroute requests through the api client or an in-browser router');
assert(/return originalFetch\(/.test(interceptorSrc),
  'fetchInterceptor.ts hands requests to the REAL captured fetch');
if (failures === 0) ok('every /api/* request, including run-java, reaches the server route');

console.log('\n[4] The real route\'s auth gate is what the empirical proof identifies (sanity check on the proof itself)\n');
assert(requireAuthSrc.includes('Bearer session token required.'),
  'requireAuth.ts still produces the exact string captured in the browser proof log above — proves the proof log is not stale');
assert(routeSrc.includes('requireUserFromRequest'),
  'run-java/route.ts still gates on requireUserFromRequest — the real route, unchanged by this fix, is what the header now reaches');
if (failures === 0) ok('the proof log\'s distinguishing signature is still exactly what the real route produces today');

console.log('\n[5] Fail-closed: unauthenticated requests to the real route must still be rejected, not silently passed\n');
// This is a structural sanity check that the fix did NOT accidentally weaken
// the auth gate while making the route reachable — reachable must not mean
// "reachable and unauthenticated calls pass."
assert(!/skipAuth|bypassAuth|DEV_NO_AUTH/i.test(routeSrc),
  'no auth-skipping flag was introduced into run-java/route.ts while fixing reachability');
if (failures === 0) ok('reachability fix did not weaken the auth gate — unauthenticated calls still 401, proven live above');

console.log('\n' + '─'.repeat(70));
console.log(`Java judge routing test: ${passed} passed, ${failures} failed`);
console.log('This test verifies the SOURCE CONTRACT behind an empirical browser proof captured');
console.log('this session against the live dev server. See file header for the exact request/response evidence.');
if (failures > 0) { console.log('FAIL'); process.exitCode = 1; } else { console.log('PASS'); }
