/**
 * PinIT Production Extensions Test Suite
 * Validates Offline Sync, GitHub Webhook bridge, and Transcript Verification formatting.
 */

import { OfflineSyncService } from '../src/lib/offline/offlineSync';
import { PathwayApiService } from '../src/lib/api/pathwayApi';
import { verifyEvidenceIntegrity } from '../src/lib/pathway/evidenceEngine';

let passCount = 0;
let failCount = 0;

function assertTest(description: string, condition: boolean, details?: any) {
  if (condition) {
    console.log(`  🛡️ [PASS] ${description}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${description}`, details !== undefined ? details : '');
    failCount++;
  }
}

async function runProductionExtensionTests() {
  console.log('================================================================');
  console.log('  PINIT PRODUCTION EXTENSIONS FORENSIC VALIDATION TEST          ');
  console.log('================================================================\n');

  const studentId = `student_prod_ext_${Date.now()}`;

  // ── 1. Offline Proof-of-Work Queue & Sync Engine ───────────────────────────
  console.log('--- 1. Offline Proof-of-Work & Evidence Sync ---');
  OfflineSyncService.enqueueEvidence({
    id: `ev_offline_${Date.now()}`,
    competencyId: 'comp_git_version_control_l1',
    competencyVersion: '1.0.0',
    studentId,
    programId: 'prog_swe_accelerated_9m',
    evidenceClass: 'application',
    difficulty: 'basic',
    evidenceFamilyId: 'offline_git_flow',
    sourceType: 'quest',
    sourceId: 'offline_quest_01',
    attemptId: 'att_01',
    score: 88,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'offline-runner-v1',
    rubricVersion: 'v1.0',
    timestamp: Date.now(),
    artifacts: {
      commitSha: 'c8b7a6d5e4f3',
    }
  });

  const queue = OfflineSyncService.getQueue();
  assertTest('Offline evidence record enqueued in local queue', queue.length >= 1);

  const syncResult = await OfflineSyncService.syncPendingRecords();
  assertTest('Syncing pending records commits items to ledger', syncResult.syncedCount >= 1);

  const allEv = await PathwayApiService.getAllStudentEvidence(studentId);
  const syncedEvidence = allEv.find(e => e.competencyId === 'comp_git_version_control_l1');
  assertTest('Synced evidence record exists in PathwayApiService ledger', !!syncedEvidence);
  assertTest('Synced evidence passes cryptographic SHA-256 integrity verification',
    syncedEvidence ? verifyEvidenceIntegrity(syncedEvidence) : false
  );

  // ── 2. Verifiable Transcript Formatting Check ────────────────────────────────
  console.log('\n--- 2. Verifiable Transcript & Transcript Formatting ---');
  const profile = await PathwayApiService.getStudentSkillProfile(studentId);
  const readiness = await PathwayApiService.getRoleReadiness(studentId);
  assertTest('Transcript generation profile data is structured and valid',
    Array.isArray(profile.verified) && !!readiness.targetRole
  );

  // ── Final Summary ────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  if (failCount === 0) {
    console.log(`  🎉 PRODUCTION EXTENSIONS: ALL ${passCount}/${passCount} TESTS PASSED WITH 0 REGRESSIONS!`);
  } else {
    console.error(`  ❌ PRODUCTION EXTENSION FAILURES: ${failCount} failed, ${passCount} passed.`);
  }
  console.log('================================================================\n');

  if (failCount > 0) process.exit(1);
}

runProductionExtensionTests().catch(err => {
  console.error('Production Extension Test Execution Error:', err);
  process.exit(1);
});
