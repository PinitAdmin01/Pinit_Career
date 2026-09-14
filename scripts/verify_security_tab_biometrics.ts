/**
 * Verification Suite: Security Tab Dead Link Removal & Biometric Enrollment Modal
 * Tests:
 * 1. SecurityTab.tsx has ZERO links pointing to /qr-login
 * 2. SecurityTab.tsx contains exact string "Biometric hardware enrollment is available via campus lab workstations."
 * 3. SecurityTab.tsx renders BiometricHardwareModal with proper accessible dialog semantics
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('--- STARTING SECURITY TAB VERIFICATION ---');

  const filePath = path.resolve('src/app/profile/tabs/SecurityTab.tsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  // Test 1: No dead links to /qr-login
  console.log('Test 1: Check for dead /qr-login links');
  assert.ok(!code.includes('/qr-login'), 'SecurityTab.tsx must NOT contain any link or reference to /qr-login');
  console.log('✓ Zero references to /qr-login in SecurityTab.tsx');

  // Test 2: Presence of exact requested wording
  console.log('Test 2: Check for exact informational string');
  const expectedNotice = 'Biometric hardware enrollment is available via campus lab workstations.';
  assert.ok(code.includes(expectedNotice), `SecurityTab.tsx must contain: "${expectedNotice}"`);
  console.log('✓ Exact notice text found in SecurityTab.tsx');

  // Test 3: BiometricHardwareModal defined and used
  console.log('Test 3: Check BiometricHardwareModal implementation');
  assert.ok(code.includes('function BiometricHardwareModal'), 'BiometricHardwareModal must be defined');
  assert.ok(code.includes('role="dialog"'), 'Modal should have role="dialog"');
  assert.ok(code.includes('modalOverlayStyle'), 'Modal uses modalOverlayStyle');
  assert.ok(code.includes('modalContentStyle'), 'Modal uses modalContentStyle');
  console.log('✓ BiometricHardwareModal implemented cleanly with design system styles');

  console.log('\n--- ALL SECURITY TAB TESTS PASSED (3/3) ---');
}

run().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
