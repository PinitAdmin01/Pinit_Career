import assert from 'assert';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';
process.env.EVIDENCE_SIGNING_SECRET = 'test_evidence_signing_secret_32_bytes!';
process.env.EXAM_SECRET = 'test_exam_secret_32_bytes_long_key_pinit!!';

import {
  generateEvidenceIntegrityHash,
  verifyEvidenceIntegrity
} from '../src/lib/pathway/evidenceEngine';
import { CompetencyEvidenceRecord } from '../src/lib/pathway/competencySchema';
import { GET as verifyRouteGET } from '../src/app/api/verify/[credentialId]/route';
import { GET as transcriptRouteGET } from '../src/app/api/passport/transcript/route';
import { resolveLinkedStudent, POST as githubWebhookPOST } from '../src/app/api/webhooks/github/route';
import { PathwayApiService } from '../src/lib/api/pathwayApi';

console.log('========================================================================');
console.log('🧪 VERIFY SUBBATCH 4.13: PASSPORT TRANSCRIPT, VERIFY LINK & GITHUB EVIDENCE');
console.log('========================================================================');

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ✅ [PASS]: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ [FAIL]: ${name}`);
    console.error('     Error:', err.message);
    failed++;
  }
}

async function runTests() {
  const baseEvidence: CompetencyEvidenceRecord = {
    id: 'ev_test_unit_001',
    competencyId: 'comp_git_version_control_l1',
    competencyVersion: '1.0.0',
    studentId: 'test_student_413',
    programId: 'prog_swe_accelerated_9m',
    evidenceClass: 'application',
    difficulty: 'basic',
    evidenceFamilyId: 'github_test_repo',
    sourceType: 'project',
    sourceId: 'repo_test_repo',
    attemptId: 'commit_a1b2c3d',
    score: 65,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'v1.0',
    rubricVersion: 'v1.0',
    timestamp: 1726500000000,
    artifacts: { repo: 'test_repo' },
  };

  // ── TEST 1: Plain unkeyed SHA-256 forged hash is strictly REJECTED ──
  await test('Security: Plain unkeyed SHA-256 hash is rejected (forgery defense)', async () => {
    // Construct canonical payload
    const canonicalPayload = JSON.stringify({
      competencyId: baseEvidence.competencyId,
      competencyVersion: baseEvidence.competencyVersion,
      studentId: baseEvidence.studentId,
      programId: baseEvidence.programId,
      evidenceClass: baseEvidence.evidenceClass,
      difficulty: baseEvidence.difficulty,
      evidenceFamilyId: baseEvidence.evidenceFamilyId || '',
      sourceType: baseEvidence.sourceType,
      sourceId: baseEvidence.sourceId,
      attemptId: baseEvidence.attemptId,
      score: baseEvidence.score,
      evaluatorType: baseEvidence.evaluatorType,
      evaluatorVersion: baseEvidence.evaluatorVersion,
      rubricVersion: baseEvidence.rubricVersion,
      timestamp: baseEvidence.timestamp,
      artifacts: baseEvidence.artifacts,
    });

    // Attacker generates plain unkeyed SHA-256
    const forgedUnkeyedHash = crypto.createHash('sha256').update(canonicalPayload).digest('hex');
    const forgedRecord: CompetencyEvidenceRecord = {
      ...baseEvidence,
      integrityHash: forgedUnkeyedHash,
    };

    const isValid = verifyEvidenceIntegrity(forgedRecord);
    assert.strictEqual(isValid, false, 'Unkeyed SHA-256 forged hash MUST be rejected');
  });

  // ── TEST 2: Authentic HMAC-SHA256 signature passes; tampered payload fails ──
  await test('Security: Authentic HMAC-SHA256 passes; altered payload fails', async () => {
    const validHmac = generateEvidenceIntegrityHash(baseEvidence);
    const validRecord: CompetencyEvidenceRecord = {
      ...baseEvidence,
      integrityHash: validHmac,
    };

    assert.strictEqual(verifyEvidenceIntegrity(validRecord), true, 'Valid HMAC must pass');

    // Tamper score
    const tamperedScore: CompetencyEvidenceRecord = {
      ...validRecord,
      score: 99,
    };
    assert.strictEqual(verifyEvidenceIntegrity(tamperedScore), false, 'Tampered score must fail');

    // Tamper studentId
    const tamperedStudent: CompetencyEvidenceRecord = {
      ...validRecord,
      studentId: 'attacker_student',
    };
    assert.strictEqual(verifyEvidenceIntegrity(tamperedStudent), false, 'Tampered studentId must fail');
  });

  // ── TEST 3: Server Verification Endpoint /api/verify/[credentialId] detects tampered hash ──
  await test('Server Verification Route: Detects tampered HMAC with INTEGRITY_TAMPERED', async () => {
    // Record authentic evidence first
    const recorded = await PathwayApiService.recordEvidence({
      ...baseEvidence,
      id: 'ev_tamper_check_001',
      studentId: 'test_user_001',
    });

    // Tamper record by replacing integrityHash with fake string
    const tamperedRecord = {
      ...recorded.evidenceRecord,
      integrityHash: '0000000000000000000000000000000000000000000000000000000000000000',
    };

    // Mock fetch or intercept
    const origGet = PathwayApiService.getAllStudentEvidence;
    PathwayApiService.getAllStudentEvidence = async (sId: string) => {
      if (sId === 'test_user_001') return [tamperedRecord];
      return [];
    };

    try {
      const req = new NextRequest('http://localhost:3000/api/verify/ev_tamper_check_001');
      const res = await verifyRouteGET(req, { params: { credentialId: 'ev_tamper_check_001' } });
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.valid, false);
      assert.strictEqual(json.error, 'INTEGRITY_TAMPERED');
      assert.ok(json.message?.includes('signature mismatch'));
    } finally {
      PathwayApiService.getAllStudentEvidence = origGet;
    }
  });

  // ── TEST 4: Server Verification Endpoint /api/verify/[credentialId] verifies authentic record ──
  await test('Server Verification Route: Successfully verifies authentic evidence record', async () => {
    const recorded = await PathwayApiService.recordEvidence({
      ...baseEvidence,
      id: 'ev_authentic_check_001',
      studentId: 'test_user_001',
    });

    const origGet = PathwayApiService.getAllStudentEvidence;
    PathwayApiService.getAllStudentEvidence = async (sId: string) => {
      if (sId === 'test_user_001') return [recorded.evidenceRecord];
      return [];
    };

    try {
      const req = new NextRequest('http://localhost:3000/api/verify/ev_authentic_check_001');
      const res = await verifyRouteGET(req, { params: { credentialId: 'ev_authentic_check_001' } });
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.valid, true);
      assert.strictEqual(json.type, 'evidence');
      assert.strictEqual(json.evidenceRecord.id, 'ev_authentic_check_001');
      assert.strictEqual(json.evidenceRecord.score, 65);
      assert.strictEqual(json.evidenceRecord.integrityHash, recorded.evidenceRecord.integrityHash);
    } finally {
      PathwayApiService.getAllStudentEvidence = origGet;
    }
  });

  // ── TEST 5: Passport transcript computes real HMAC seal, does NOT claim SHA-256 verified if unverified ──
  await test('Passport Transcript: Does NOT claim SHA-256 verified when evidence is unverified', async () => {
    const req = new NextRequest('http://localhost:3000/api/passport/transcript?programId=prog_swe_accelerated_9m', {
      headers: {
        'authorization': 'Bearer test-token-001',
      }
    });

    const res = await transcriptRouteGET(req);
    assert.strictEqual(res.status, 200);
    const html = await res.text();

    assert.ok(html.includes('Official Competency Transcript'));
    // Since demo student has no verified evidence with matching HMAC in fresh test session:
    assert.ok(html.includes('Provisional / Unverified'));
    assert.ok(html.includes('Ledger Status: Evidence Pending Verification'));
    assert.ok(!html.includes('✓ SHA-256 Verified'));
  });

  // ── TEST 6: Passport transcript viva defense copy displays "Pending Evaluation" when defense score is 0 ──
  await test('Passport Transcript: Oral defense displays "Pending Evaluation" when score is 0', async () => {
    const req = new NextRequest('http://localhost:3000/api/passport/transcript?programId=prog_swe_accelerated_9m', {
      headers: {
        'authorization': 'Bearer test-token-001',
      }
    });

    const res = await transcriptRouteGET(req);
    assert.strictEqual(res.status, 200);
    const html = await res.text();

    assert.ok(html.includes('Capstone Oral Defense & Viva Score:</strong> 0/100'));
    assert.ok(html.includes('Capstone oral defense pending evaluation. Architectural viva defense not yet completed.'));
    assert.ok(!html.includes('Passed rigorous multi-stage architectural defense'));
  });

  // ── TEST 7: GitHub Webhook rejects repository when student has empty claimed_repos ──
  await test('GitHub Webhook: Empty claimed_repos list rejects push as REPOSITORY_UNCLAIMED', async () => {
    const origFetch = globalThis.fetch;
    // Mock Supabase to return user with empty claimed_repos: []
    globalThis.fetch = async (input, init) => {
      const urlStr = String(input);
      if (urlStr.includes('supabase.co')) {
        if (urlStr.includes('github_integrations')) {
          return new Response(JSON.stringify(null), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        if (urlStr.includes('users')) {
          return new Response(JSON.stringify({
            id: 'student_unclaimed_99',
            github_username: 'unclaimeddev',
            claimed_repos: [] // Empty claimed repos!
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
      }
      return origFetch(input, init);
    };

    try {
      const result = await resolveLinkedStudent('unclaimeddev', 99999, 'https://github.com/torvalds/linux');
      assert.strictEqual(result.verified, false);
      assert.strictEqual(result.error, 'REPOSITORY_UNCLAIMED');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // ── TEST 8: GitHub Webhook commit scoring: evidenceClass 'application', difficulty basic/intermediate, capped score ──
  await test('GitHub Webhook: Single commit classified as application (never production), score capped <= 75', async () => {
    const secret = 'webhook_test_secret_32_bytes_xyz!';
    process.env.GITHUB_WEBHOOK_SECRET = secret;

    const payload = {
      repository: {
        name: 'web-api-service',
        html_url: 'https://github.com/octocat/web-api-service',
      },
      sender: {
        login: 'octocat',
        id: 583231,
      },
      head_commit: {
        id: 'c0ffee1234567890abcdef1234567890abcdef12',
        message: 'Add user authentication controller and token validation unit tests',
        author: { email: 'octocat@github.com' },
        added: ['src/auth/authController.ts', 'tests/authController.test.ts'],
        modified: ['src/routes/api.ts'],
        removed: [],
      },
      commits: [
        {
          id: 'c0ffee1234567890abcdef1234567890abcdef12',
          message: 'Add user authentication controller and token validation unit tests',
          author: { email: 'octocat@github.com' },
          added: ['src/auth/authController.ts', 'tests/authController.test.ts'],
          modified: ['src/routes/api.ts'],
          removed: [],
        }
      ]
    };

    const payloadStr = JSON.stringify(payload);
    const sig = 'sha256=' + crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

    const req = new NextRequest('http://localhost:3000/api/webhooks/github', {
      method: 'POST',
      headers: {
        'x-hub-signature-256': sig,
        'x-github-event': 'push',
        'content-type': 'application/json',
      },
      body: payloadStr,
    });

    const res = await githubWebhookPOST(req);
    assert.strictEqual(res.status, 200);
    const json = await res.json();

    assert.strictEqual(json.success, true);
    assert.ok(json.evidenceRecordId);
    assert.ok(json.integrityHash);

    // Retrieve the recorded evidence record
    const allStudentEv = await PathwayApiService.getAllStudentEvidence('student_dev_octocat');
    const recorded = allStudentEv.find(e => e.id === json.evidenceRecordId);
    assert.ok(recorded, 'Recorded evidence must exist');
    assert.strictEqual(recorded.evidenceClass, 'application', 'Commit must be application class, never production');
    assert.strictEqual(recorded.difficulty, 'basic', '3-file push with tests is basic difficulty');
    assert.ok(recorded.score <= 75, `Score ${recorded.score} must not exceed 75`);
    assert.ok(recorded.score >= 55, `Score ${recorded.score} reflects functional files + test presence`);
  });

  console.log('========================================================================');
  console.log(`📊 SUBBATCH 4.13 RESULT: ${passed} / ${passed + failed} TESTS PASSED`);
  console.log('========================================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
