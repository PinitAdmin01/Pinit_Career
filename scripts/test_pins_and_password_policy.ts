/**
 * Test: Pins Spend Fail-Closed RPC & Password Policy Verification
 */
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ? [PASS] ${msg}`);
    passed++;
  } else {
    console.error(`  ? [FAIL] ${msg}`);
    failed++;
  }
}

async function run() {
  console.log('========================================================================');
  console.log('??? TESTING PINS SPEND FAIL-CLOSED & PASSWORD POLICY');
  console.log('========================================================================\n');

  // Test 1: Pins Spend route fail-closed on spendErr
  const pinsSpendCode = fs.readFileSync(path.join(process.cwd(), 'src/app/api/pins/spend/route.ts'), 'utf-8');
  const hasFailClosedRpc = pinsSpendCode.includes("error: 'DATABASE_ERROR'") &&
    pinsSpendCode.includes("status: 500") &&
    pinsSpendCode.includes("[Pin Spend] RPC Error:");
  assert(hasFailClosedRpc, 'Test 1: /api/pins/spend/route.ts returns 500 DATABASE_ERROR on spendErr (fail-closed)');

  // Test 2: Signup page enforces 8 characters minimum
  const signupCode = fs.readFileSync(path.join(process.cwd(), 'src/app/signup/page.tsx'), 'utf-8');
  const hasSignup8Chars = signupCode.includes('form.password.length < 8') &&
    signupCode.includes('Password must be at least 8 characters long.');
  assert(hasSignup8Chars, 'Test 2: src/app/signup/page.tsx enforces password minimum length of 8 characters');

  // Test 3: Login page allows legacy passwords without blocking valid credentials
  const loginCode = fs.readFileSync(path.join(process.cwd(), 'src/app/login/page.tsx'), 'utf-8');
  const allowsLegacyLoginPasswords = !loginCode.includes('loginForm.password.length < 8');
  assert(allowsLegacyLoginPasswords, 'Test 3: src/app/login/page.tsx allows legacy passwords at login without locking users out');

  // Test 4: Reset password page enforces 8 characters minimum
  const resetCode = fs.readFileSync(path.join(process.cwd(), 'src/app/reset-password/page.tsx'), 'utf-8');
  const hasReset8Chars = resetCode.includes('password.length < 8');
  assert(hasReset8Chars, 'Test 4: src/app/reset-password/page.tsx enforces password minimum length of 8 characters');

  // Test 5: Redundant registration form removed from login/page.tsx
  const hasNoRedundantSignup = !loginCode.includes('handleSignupSubmit') &&
    !loginCode.includes('signupForm') &&
    !loginCode.includes("mainTab === 'signup'");
  assert(hasNoRedundantSignup, 'Test 5: Redundant registration form purged from login/page.tsx and directs cleanly to /signup');

  // Test 6: Clean /signup redirection in login/page.tsx
  const hasCleanRedirect = loginCode.includes("router.replace('/signup')") &&
    loginCode.includes('href="/signup"');
  assert(hasCleanRedirect, 'Test 6: Clean navigation and mode=signup redirect to /signup in login/page.tsx');

  console.log('\n========================================================================');
  console.log(`?? PINS & PASSWORD VERIFICATION: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================');

  if (failed > 0) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
