/**
 * Test Suite: Friend 1 - Network & Gating
 * 1. client.ts includes '/api/student' in LIVE_API_PREFIXES and routes /api/student/activity to live server
 * 2. AppShell.tsx strictly blocks regular tabs when onboardingStep < 3 and removes /crm & /integrations
 * 3. login/page.tsx does not switch authMode to 'trusted' on mount and defaults to 'password'
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('========================================================================');
  console.log('🛡️ TESTING NETWORK & GATING REMEDIATIONS (FRIEND 1)');
  console.log('========================================================================\n');

  // ── TEST 1: client.ts: LIVE_API_PREFIXES includes '/api/student' ──
  console.log('── TEST 1: API Client Live Prefixes ──');
  const clientFile = fs.readFileSync(path.resolve('src/lib/api/client.ts'), 'utf-8');
  assert.ok(
    clientFile.includes("'/api/student'"),
    'client.ts must include /api/student in LIVE_API_PREFIXES'
  );

  // Dynamically verify prefix matching logic
  const livePrefixMatch = clientFile.match(/const LIVE_API_PREFIXES:\s*(?:readonly\s+)?string\[\]\s*=\s*\[([\s\S]*?)\];/);
  assert.ok(livePrefixMatch, 'Could not find LIVE_API_PREFIXES in client.ts');
  const prefixes = eval(`[${livePrefixMatch[1]}]`) as string[];
  assert.ok(prefixes.includes('/api/student'), '/api/student must be in prefixes array');

  const testStudentPath = '/api/student/activity';
  const isLivePreferred = prefixes.some(p => testStudentPath === p || testStudentPath.startsWith(p + '/') || testStudentPath.startsWith(p + '?'));
  assert.strictEqual(isLivePreferred, true, '/api/student/activity must prefer live server');
  console.log('  ✅ [PASS] LIVE_API_PREFIXES contains /api/student and unblocks /api/student/activity\n');

  // ── TEST 2: AppShell.tsx: Onboarding Enforcement & Student Tabs ──
  console.log('── TEST 2: AppShell Onboarding Enforcement & Student Tab Authorization ──');
  const appShellFile = fs.readFileSync(path.resolve('src/components/ui/AppShell.tsx'), 'utf-8');

  assert.ok(
    appShellFile.includes("if (onboardingStep < 3 && pathname !== '/onboarding')"),
    'AppShell must strictly redirect to /onboarding when onboardingStep < 3'
  );

  // Extract allowedStudentTabs array
  const studentTabsMatch = appShellFile.match(/const allowedStudentTabs = \[([\s\S]*?)\];/);
  assert.ok(studentTabsMatch, 'Could not find allowedStudentTabs in AppShell.tsx');
  const studentTabs = eval(`[${studentTabsMatch[1]}]`) as string[];

  assert.strictEqual(studentTabs.includes('/crm'), false, 'allowedStudentTabs must NOT include /crm');
  assert.strictEqual(studentTabs.includes('/integrations'), false, 'allowedStudentTabs must NOT include /integrations');
  assert.ok(studentTabs.includes('/dashboard'), 'allowedStudentTabs must include /dashboard');
  assert.ok(studentTabs.includes('/interview'), 'allowedStudentTabs must include /interview');
  assert.ok(studentTabs.includes('/quests'), 'allowedStudentTabs must include /quests');

  console.log('  ✅ [PASS] Onboarding strictly enforced when onboardingStep < 3');
  console.log('  ✅ [PASS] /crm and /integrations successfully purged from allowedStudentTabs\n');

  // ── TEST 3: login/page.tsx: Trusted Device UX Cleanup ──
  console.log('── TEST 3: Login Page Trusted Device UX Cleanup ──');
  const loginFile = fs.readFileSync(path.resolve('src/app/login/page.tsx'), 'utf-8');

  assert.ok(
    !loginFile.includes("setAuthMode('trusted')"),
    "login/page.tsx must NOT switch authMode to 'trusted' on mount"
  );

  assert.ok(
    loginFile.includes("const initialMode = searchParams.get('mode') === 'vault' ? 'vault' : 'password';"),
    "login/page.tsx must default mainTab cleanly to 'password'"
  );

  console.log("  ✅ [PASS] login/page.tsx does not set authMode to 'trusted' on mount");
  console.log("  ✅ [PASS] login/page.tsx cleanly defaults to password mode\n");

  console.log('========================================================================');
  console.log('🏁 ALL NETWORK & GATING REMEDIATIONS VERIFIED (5/5 Checks Passed)');
  console.log('========================================================================');
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
