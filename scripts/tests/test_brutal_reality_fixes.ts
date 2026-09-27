/**
 * Test Suite: Verification of Brutal Reality Remediations
 * Tests N1, N2, N4, N9, P2-2, and N5/N6
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('========================================================================');
  console.log('🛡️ TESTING BRUTAL REALITY REMEDIATIONS (FRIEND 1 + CORE GATES)');
  console.log('========================================================================\n');

  // ── TEST 1: N1 (Login password length check removed) ──
  console.log('── TEST 1: N1 - Login Password Length Check Removed ──');
  const loginCode = fs.readFileSync(path.resolve('src/app/login/page.tsx'), 'utf-8');
  assert.ok(
    !loginCode.includes('loginForm.password.length < 8'),
    'login/page.tsx must NOT enforce password length < 8 at login (locks out legacy users)'
  );
  console.log('  ✅ [PASS] Password length check purged from handlePasswordLogin (legacy accounts supported)\n');

  // ── TEST 2: N4 (Open redirect protection) ──
  console.log('── TEST 2: N4 - Open Redirect Protection ──');
  assert.ok(
    loginCode.includes("rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')"),
    'login/page.tsx must sanitize redirect URL with isSafeRelative check'
  );
  assert.ok(
    !loginCode.includes("router.push(redirectTo || '/dashboard')"),
    'login/page.tsx must not push raw unsanitized redirectTo'
  );
  console.log('  ✅ [PASS] Open redirect mitigated (only safe relative paths permitted)\n');

  // ── TEST 3: N2 (AppShell student tabs restored) ──
  console.log('── TEST 3: N2 - AppShell Restores 9 Missing Student Tabs ──');
  const appShellCode = fs.readFileSync(path.resolve('src/components/ui/AppShell.tsx'), 'utf-8');
  const studentTabsMatch = appShellCode.match(/const allowedStudentTabs = \[([\s\S]*?)\];/);
  assert.ok(studentTabsMatch, 'Could not find allowedStudentTabs in AppShell.tsx');
  const studentTabs = eval(`[${studentTabsMatch[1]}]`) as string[];

  const requiredTabs = [
    '/career-twin', '/passport', '/portfolio', '/code-wars', '/teams',
    '/opportunities', '/applications', '/placement', '/internships'
  ];

  for (const tab of requiredTabs) {
    assert.ok(studentTabs.includes(tab), `allowedStudentTabs must include ${tab}`);
  }
  assert.strictEqual(studentTabs.includes('/crm'), false, 'allowedStudentTabs must NOT include /crm');
  assert.strictEqual(studentTabs.includes('/integrations'), false, 'allowedStudentTabs must NOT include /integrations');
  console.log('  ✅ [PASS] All 9 missing student tabs restored without granting admin /crm or /integrations\n');

  // ── TEST 4: N9 (SecurityTab honest UI without fictitious claims) ──
  console.log('── TEST 4: N9 - SecurityTab Honest UI & Purged Workstation Claims ──');
  const securityCode = fs.readFileSync(path.resolve('src/app/profile/tabs/SecurityTab.tsx'), 'utf-8');

  assert.ok(!securityCode.includes('campus lab workstation'), 'Must NOT contain campus lab workstation');
  assert.ok(!securityCode.includes('IR depth camera'), 'Must NOT contain IR depth camera');
  assert.ok(!securityCode.includes('Workstation Enrollment'), 'Must NOT contain Workstation Enrollment');
  assert.ok(
    securityCode.includes('<span>Hardware biometric authentication is not configured for this device or browser.</span>'),
    'SecurityTab must display honest biometric status text'
  );
  console.log('  ✅ [PASS] Fictitious campus lab workstation text purged; honest UI rendered\n');

  // ── TEST 5: P2-2 (useOnboardingWizard Frontend Developer Role Mapping) ──
  console.log('── TEST 5: P2-2 - Onboarding Frontend Role Disambiguation ──');
  const onboardingCode = fs.readFileSync(path.resolve('src/app/onboarding/hooks/useOnboardingWizard.ts'), 'utf-8');
  assert.ok(
    !onboardingCode.includes("web design|product design|figma)\\b/i.test(goalLower) || goalLower.includes('front')"),
    'Frontend must not be lumped into UI/UX Designer'
  );
  assert.ok(
    onboardingCode.includes("goalLower.includes('front') || goalLower.includes('react') || goalLower.includes('web dev')"),
    'Frontend goals must map to Frontend Engineer'
  );
  console.log('  ✅ [PASS] Frontend Developer correctly maps to Frontend Engineer, not UI/UX Designer\n');

  // ── TEST 6: N5 & N6 (verify-exam certificateTitle binding & fail-closed) ──
  console.log('── TEST 6: N5 & N6 - Verify Exam Title Binding & Fail-Closed ──');
  const verifyExamCode = fs.readFileSync(path.resolve('src/app/api/portfolio/verify-exam/route.ts'), 'utf-8');
  assert.ok(
    verifyExamCode.includes('verification.certificateTitle'),
    'verify-exam must bind certificateTitle to prevent cross-certificate token exploitation'
  );
  assert.ok(
    verifyExamCode.includes("error: 'Database persistence failed'"),
    'verify-exam must fail-closed on portfolio_items upsert error'
  );
  console.log('  ✅ [PASS] Exam tokens strictly bound to certificateTitle and upsert fails closed\n');

  console.log('========================================================================');
  console.log('🏁 ALL BRUTAL REALITY AUDIT REMEDIATIONS VERIFIED (6/6 Checks Passed)');
  console.log('========================================================================');
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
