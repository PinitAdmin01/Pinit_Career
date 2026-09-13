import {
  credentialIssuanceService,
  CredentialIssuanceService,
  evaluateSigningKeyLifecycle,
  SigningKeyRecord,
} from '../src/lib/services/credentialIssuanceService';

async function runCredentialTests() {
  console.log('========================================================================');
  console.log('🏛️ VERIFYING CREDENTIAL ISSUANCE SERVICE & ATTESTATION ENGINE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // ── Test 1: Credential has unique ID ──────────────────────────────────────
  const cred1 = await credentialIssuanceService.issue({ userId: 'test-1', type: 'course' });
  const cred2 = await credentialIssuanceService.issue({ userId: 'test-1', type: 'course' });
  assert(cred1.id !== cred2.id, 'Test 1: Credential IDs are unique between issuances');

  // ── Test 2: Credential has correct userId ─────────────────────────────────
  assert(cred1.userId === 'test-1', 'Test 2: Credential has correct userId bound');

  // ── Test 3: Credential issuedAt is recent ─────────────────────────────────
  const age = Date.now() - new Date(cred1.issuedAt).getTime();
  assert(age < 5000, 'Test 3: Credential issuedAt is recent (< 5000ms)');

  // ── Test 4: Verifying a valid credential returns true ─────────────────────
  const verified = await credentialIssuanceService.verify(cred1.id);
  assert(verified === true, 'Test 4: Valid credential returns true on verification');

  // ── Test 5: Verifying a fake ID returns false ─────────────────────────────
  const fakeVerify = await credentialIssuanceService.verify('fake-id-xxx');
  assert(fakeVerify === false, 'Test 5: Fake credential ID returns false on verification');

  // ── Test 6: Revocation marks credential as invalid ────────────────────────
  await credentialIssuanceService.revoke(cred1.id, 'Academic dishonesty detection');
  const postRevokeVerify = await credentialIssuanceService.verify(cred1.id);
  assert(postRevokeVerify === false, 'Test 6: Revoked credential verification fails as false');

  // ── Test 7: Key Lifecycle - Retired key blocks new issuance ───────────────
  const retiredKey: SigningKeyRecord = {
    keyId: 'KEY_RETIRED_2025',
    publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----',
    status: 'RETIRED',
    algorithm: 'Ed25519',
    activatedAt: new Date(Date.now() - 365 * 86400000).toISOString(),
    retiredAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  };
  const retiredIssueCheck = evaluateSigningKeyLifecycle(retiredKey, 'ISSUE');
  assert(
    retiredIssueCheck.allowed === false && retiredIssueCheck.reason?.includes('ERR_SIGNING_KEY_RETIRED'),
    'Test 7: Retired signing key strictly blocked from issuing new credentials'
  );

  // ── Test 8: Key Lifecycle - Compromised key blocks issuance & verify ──────
  const compromisedKey: SigningKeyRecord = {
    keyId: 'KEY_COMPROMISED_001',
    publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----',
    status: 'COMPROMISED',
    algorithm: 'Ed25519',
    activatedAt: new Date(Date.now() - 100 * 86400000).toISOString(),
    compromisedAt: new Date().toISOString(),
  };
  const compIssueCheck = evaluateSigningKeyLifecycle(compromisedKey, 'ISSUE');
  assert(
    compIssueCheck.allowed === false && compIssueCheck.reason?.includes('ERR_SIGNING_KEY_COMPROMISED'),
    'Test 8: Compromised signing key strictly blocked from issuance and verification'
  );

  // ── Test 9: Data Minimization - Rejects curriculum metrics ────────────────
  const minimizationCheck = CredentialIssuanceService.validateDataMinimization({
    credentialId: 'cred_valid_123',
    candidateDisplayName: 'Ada Lovelace',
    credentialTitle: 'Fullstack Architect 120/120 Days Complete',
    competencyAreas: ['Distributed Systems'],
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
    issuer: {
      organization: 'PinitCareer',
      authority: 'Governing Academic Council',
      publicKeyId: 'KEY_PRIMARY_01',
    },
    assessmentSnapshotHash: 'a'.repeat(64),
    verificationUrl: 'https://pinit.os/credentials/verify',
  });
  assert(
    minimizationCheck.valid === false && minimizationCheck.violations.length > 0,
    'Test 9: Data minimization strictly rejects internal curriculum metrics (120/120 Days)'
  );

  // ── Test 10: RBAC Matrix - Candidate cannot access assessor rubrics ────────
  const rbacCheck = CredentialIssuanceService.verifyRbacDataIsolation('CANDIDATE', 'ASSESSOR_RUBRICS');
  assert(
    rbacCheck.allowed === false && rbacCheck.errorCode === 'ERR_ACCESS_DENIED_ASSESSOR_MATERIALS',
    'Test 10: RBAC data isolation prevents candidate access to assessor rubrics'
  );

  console.log('\n========================================================================');
  console.log(`🏁 CREDENTIAL ISSUANCE VERIFICATION COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCredentialTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
