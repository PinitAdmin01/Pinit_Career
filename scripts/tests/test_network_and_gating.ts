/**
 * Test Suite: Friend 1 - Network & Gating
 * 1. client.ts sends every /api/* path (including /api/student/activity) to its server route, with no in-browser fallback
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

  // ── TEST 1: client.ts sends every /api/* path, including /api/student/activity, to the server ──
  console.log('── TEST 1: API Client Routes /api/student/activity to the Server ──');
  const clientFile = fs.readFileSync(path.resolve('src/lib/api/client.ts'), 'utf-8');
  assert.ok(
    clientFile.includes("path.startsWith('/api/')"),
    'client.ts request() must treat every /api/ path as a server call'
  );
  assert.ok(!/firestoreRouter/i.test(clientFile), 'client.ts must not fall back to an in-browser router');
  assert.ok(
    fs.existsSync(path.resolve('src/app/api/student/activity/route.ts')),
    'a server route must exist for /api/student/activity'
  );
  console.log('  ✅ [PASS] /api/student/activity goes to its server route (no client-side fallback)\n');

  // ── TEST 2: AppShell.tsx: Onboarding Enforcement & Student Tabs ──
  console.log('── TEST 2: AppShell Onboarding Enforcement & Student Tab Authorization ──');
  const appShellFile = fs.readFileSync(path.resolve('src/components/ui/AppShell.tsx'), 'utf-8');

  // The gate is one shared rule (src/lib/onboarding/onboardingStatus.ts): finished means step >= 3,
  // roadmap generated, or answers marked complete. AppShell redirects students who are not finished.
  assert.ok(
    appShellFile.includes('isOnboardingComplete(') && /if \(!onboardingDone[^)]*\)\s*\{[\s\S]{0,300}router\.push\('\/onboarding'\)/.test(appShellFile),
    'AppShell must redirect to /onboarding when isOnboardingComplete() says the student is not finished'
  );
  const { isOnboardingComplete } = await import('../../src/lib/onboarding/onboardingStatus');
  assert.strictEqual(isOnboardingComplete({ onboardingStep: 2 }), false, 'onboardingStep 2 is not complete');
  assert.strictEqual(isOnboardingComplete({ onboardingStep: 3 }), true, 'onboardingStep 3 is complete');
  assert.strictEqual(isOnboardingComplete(null, { onboardingStep: 1 }), false, 'partial local progress is not complete');

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
