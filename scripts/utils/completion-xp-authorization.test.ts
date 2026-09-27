/**
 * Completion/XP Client Self-Grant Regression Test (Risk 4)
 *
 * ⚠ THIS TEST MUTATES A LIVE, REAL SUPABASE PROJECT. It is NOT part of the
 * routine tsc/content-qa/runtime-binding suite and should be run manually/on
 * demand only — every run performs a real `auth.signUp()` against the project
 * named in .env's NEXT_PUBLIC_SUPABASE_URL, creating one throwaway account
 * (email prefixed `pinit-security-audit-`, easily identified for bulk cleanup
 * by whoever holds SUPABASE_SERVICE_ROLE_KEY, which this environment does not
 * have configured — see the Stage 1/Risk 4 report).
 *
 * WHAT THIS PROVES: whether an ordinary authenticated student — using nothing
 * but the PUBLIC anon key already shipped in the browser bundle, and a plain
 * `supabase.from('users').update(...)` call typed into devtools — can
 * self-grant XP, quest completion, and other mastery/placement signals on
 * their own row, bypassing every judge in the app entirely.
 *
 * EMPIRICAL BASELINE (captured this session, BEFORE the fix in
 * supabase/migrations/20260826_risk4_protect_completion_xp.sql was applied):
 *   A fresh self-signed-up account successfully set its own xp_total to
 *   999999999 and completed_quests to a quest ID that was never submitted to
 *   any grader. In the SAME request, ats_score/trust_score were correctly
 *   reverted by the pre-existing prevent_privilege_escalation trigger — proving
 *   the trigger mechanism works, and that xp_total/completed_quests were
 *   simply not in its guarded column list.
 *
 * This test will report VULNERABLE (not a silent pass) until that migration
 * is applied to the live project — that is the honest, current state, not a
 * test bug. Once applied, this test should report PASS.
 *
 * Run: node scripts/completion-xp-authorization.test.js
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

function getEnvVar(name: string): string {
  const envPath = path.join(__dirname, '..', '.env');
  const text = fs.readFileSync(envPath, 'utf8');
  const match = new RegExp(`^${name}=(.*)$`, 'm').exec(text);
  return match ? match[1].trim().replace(/\r$/, '') : '';
}

const SUPABASE_URL = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

let failures = 0;
let passed = 0;
let vulnerabilities = 0;
function assert(condition: boolean, message: string): void {
  if (condition) { passed++; } else { failures++; console.error(`  FAIL: ${message}`); }
}
function vulnerable(message: string): void {
  vulnerabilities++;
  console.error(`  VULNERABLE: ${message}`);
}
function ok(message: string): void { passed++; console.log(`  ok:   ${message}`); }

async function main() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('SKIPPED: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not configured in .env — cannot reach a live project.');
    process.exitCode = 2;
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

  console.log('\n[0] Creating a throwaway audit account (real signup, public anon key — exactly what an attacker would use)\n');
  const email = `pinit-security-audit-${Date.now()}@example.com`;
  const password = `AuditTest_${Date.now()}!Xz9`;
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email, password });
  if (signUpErr || !signUpData.user) {
    console.log(`SKIPPED: signUp failed (${signUpErr?.message}) — cannot run this test without a real authenticated session.`);
    process.exitCode = 2;
    return;
  }
  const uid = signUpData.user.id;
  console.log(`  Created ${email} (uid=${uid}). Recommend bulk-deleting accounts matching this email prefix periodically.`);

  const { data: before } = await supabase.from('users').select('xp_total, completed_quests, ats_score, trust_score').eq('id', uid).maybeSingle();
  assert(before?.xp_total === 0, 'baseline xp_total is 0 for a freshly-created account (sanity check)');
  assert(Array.isArray(before?.completed_quests) && before.completed_quests.length === 0, 'baseline completed_quests is empty (sanity check)');

  console.log('\n[1] Attempting self-grant: XP + fake quest completion (the actual Risk 4 exploit)\n');
  const FAKE_QUEST_ID = `audit-probe-${Date.now()}-never-verified-by-any-judge`;
  const { error: updateErr } = await supabase
    .from('users')
    .update({ xp_total: 999999999, completed_quests: [FAKE_QUEST_ID] })
    .eq('id', uid);

  const { data: after } = await supabase.from('users').select('xp_total, completed_quests, ats_score, trust_score').eq('id', uid).maybeSingle();

  if ((after?.xp_total ?? 0) >= 999999999) {
    vulnerable(`client-authenticated update set xp_total to ${after?.xp_total} — a student can self-grant arbitrary XP`);
  } else {
    ok(`xp_total after self-update attempt is ${after?.xp_total} (unchanged from baseline) — self-grant blocked`);
  }

  if ((after?.completed_quests ?? []).includes(FAKE_QUEST_ID)) {
    vulnerable(`client-authenticated update recorded completed_quests=[${FAKE_QUEST_ID}] — a NEVER-SUBMITTED, NEVER-JUDGED quest ID was accepted as "completed"`);
  } else {
    ok('completed_quests after self-update attempt does NOT include the fabricated quest ID — self-grant blocked');
  }

  console.log('\n[2] Regression guard: the ALREADY-PROTECTED columns (ats_score/trust_score) must remain protected\n');
  const { error: scoreUpdateErr } = await supabase.from('users').update({ ats_score: 100, trust_score: 100 }).eq('id', uid);
  const { data: afterScores } = await supabase.from('users').select('ats_score, trust_score').eq('id', uid).maybeSingle();
  assert(afterScores?.ats_score === 0, 'ats_score self-grant attempt still correctly blocked by the pre-existing trigger (regression guard, not this fix\'s job)');
  assert(afterScores?.trust_score === 40, 'trust_score self-grant attempt still correctly blocked by the pre-existing trigger (regression guard, not this fix\'s job)');

  console.log('\n' + '─'.repeat(70));
  console.log(`Completion/XP authorization test: ${passed} passed, ${failures} failed, ${vulnerabilities} vulnerable finding(s)`);
  console.log(`Audit account created (cannot self-delete without SUPABASE_SERVICE_ROLE_KEY): ${email}`);
  if (vulnerabilities > 0) {
    console.log('VULNERABLE — apply supabase/migrations/20260826_risk4_protect_completion_xp.sql to close this.');
    process.exitCode = 1;
  } else if (failures > 0) {
    console.log('FAIL');
    process.exitCode = 1;
  } else {
    console.log('PASS — self-grant is blocked.');
  }
}

main();
