import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeDeliverableFingerprint,
  verifyDeliverableFingerprint,
  WeeklyLogSchema,
} from '../src/lib/internships/weeklyLogs';
import {
  generateSupervisorToken,
  hashToken,
  isTokenExpired,
  generateCertificateNftMetadata,
  newInternshipCertificateId,
} from '../src/lib/certificates/certificateGenerator';

test('Virtual Internships Domain X (Blocks 51-54) - Cryptographic Deliverables & Certificate Suite', async (t) => {
  await t.test('computeDeliverableFingerprint produces consistent 64-char SHA-256 hex hashes', () => {
    const codePatch = 'def optimize_queries(): return db.session.execute("EXPLAIN ANALYZE")';
    const hash1 = computeDeliverableFingerprint(codePatch);
    const hash2 = computeDeliverableFingerprint(codePatch);

    assert.equal(hash1.length, 64);
    assert.match(hash1, /^[a-f0-9]{64}$/);
    assert.equal(hash1, hash2);

    const differentCode = 'def optimize_queries(): return db.session.execute("SELECT 1")';
    const hashDiff = computeDeliverableFingerprint(differentCode);
    assert.notEqual(hash1, hashDiff);
  });

  await t.test('verifyDeliverableFingerprint performs timing-safe verification', () => {
    const deliverable = { prNumber: 42, commitSha: 'abcdef1234567890', filesChanged: ['src/index.ts'] };
    const hash = computeDeliverableFingerprint(deliverable);

    assert.equal(verifyDeliverableFingerprint(deliverable, hash), true);
    assert.equal(verifyDeliverableFingerprint(deliverable, '0000000000000000000000000000000000000000000000000000000000000000'), false);
    assert.equal(verifyDeliverableFingerprint(deliverable, 'invalid-length'), false);
  });

  await t.test('WeeklyLogSchema validates entries with optional SHA-256 deliverable proof', () => {
    const validLog = {
      week: 4,
      hours: 32,
      summary: 'Completed distributed caching integration and verified p99 latency benchmark.',
      links: ['https://github.com/org/repo/pull/12'],
      deliverableHash: 'a'.repeat(64),
    };
    const parsed = WeeklyLogSchema.safeParse(validLog);
    assert.equal(parsed.success, true);

    const invalidHashLog = {
      ...validLog,
      deliverableHash: 'not-a-sha256-hash',
    };
    const failedParse = WeeklyLogSchema.safeParse(invalidHashLog);
    assert.equal(failedParse.success, false);
  });

  await t.test('Supervisor tokens are cryptographically single-use, 64-hex SHA-256 hashed, and time-bounded', () => {
    const { token, hash } = generateSupervisorToken();
    assert.match(token, /^[a-f0-9]{64}$/);
    assert.equal(hashToken(token), hash);

    const expiredDate = new Date(Date.now() - 3600_000).toISOString();
    assert.equal(isTokenExpired(expiredDate), true);

    const activeDate = new Date(Date.now() + 72 * 3600_000).toISOString();
    assert.equal(isTokenExpired(activeDate), false);
  });

  await t.test('generateCertificateNftMetadata produces ERC-compliant metadata with SHA-256 verification hash and honest labeling', () => {
    const certId = newInternshipCertificateId();
    assert.ok(certId.startsWith('PIN-IN-'));

    const nft = generateCertificateNftMetadata({
      certificateId: certId,
      studentId: 'student-uuid-456',
      studentName: 'Priya Sharma',
      tier: 't1_job_sim',
      companyName: 'NexaCommerce',
      deliverableHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    });

    assert.equal(nft.id, certId);
    assert.ok(nft.name.includes('Python Job Simulation'));
    assert.equal(nft.properties.honestyClassification, 'simulated_workplace');
    assert.match(nft.properties.verificationHash, /^[a-f0-9]{64}$/);
    assert.ok(nft.attributes.some(a => a.trait_type === 'Simulation Status' && a.value === 'Simulated Enterprise'));
    assert.ok(nft.attributes.some(a => a.trait_type === 'Student Name' && a.value === 'Priya Sharma'));
  });
});
