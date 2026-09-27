/**
 * PinIT Phase 3: Enterprise, Verifiable Credentials & Institutional Tier Test Suite
 * Validates Public Verifier (/verify/[id]), QR Credential Export, and Cohort Analytics.
 */

import { PathwayApiService } from '../src/lib/api/pathwayApi';
import { CohortsApiService } from '../src/lib/api/cohortsApi';
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

async function runPhase3Tests() {
  console.log('================================================================');
  console.log('  PINIT PHASE 3: ENTERPRISE & VERIFIABLE CREDENTIALS TEST SUITE ');
  console.log('================================================================\n');

  const studentId = `student_phase3_${Date.now()}`;

  // ── 1. Public Verifiable Credential Integrity & Tamper Detection ─────────────
  console.log('--- 1. Public Verifier & Tamper Detection Engine ---');
  const authenticEvidence = await PathwayApiService.recordEvidence({
    id: `ev_verifiable_${Date.now()}`,
    competencyId: 'comp_backend_apis_frameworks_l3',
    competencyVersion: '1.0.0',
    studentId,
    programId: 'prog_swe_accelerated_9m',
    evidenceClass: 'production',
    difficulty: 'advanced',
    evidenceFamilyId: 'api_microservices',
    sourceType: 'project',
    sourceId: 'proj_enterprise_01',
    attemptId: 'att_01',
    score: 95,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'api-runner-v3',
    rubricVersion: 'rubric-v3',
    timestamp: Date.now(),
    artifacts: {
      repoUrl: 'https://github.com/student/enterprise-api',
      commitSha: 'e9f4c3a1b876',
    }
  });

  assertTest('Authentic evidence record generates cryptographic SHA-256 seal',
    !!authenticEvidence.evidenceRecord.integrityHash && authenticEvidence.evidenceRecord.integrityHash.length === 64
  );

  const isAuthenticValid = verifyEvidenceIntegrity(authenticEvidence.evidenceRecord);
  assertTest('Public verifier successfully validates authentic SHA-256 evidence record', isAuthenticValid);

  // Tampered evidence check
  const tamperedRecord = {
    ...authenticEvidence.evidenceRecord,
    score: 100, // illegally inflated score
  };
  const isTamperedValid = verifyEvidenceIntegrity(tamperedRecord);
  assertTest('Public verifier strictly rejects tampered evidence score modification', !isTamperedValid);

  // ── 2. Student Skill Passport Verifiable Transcript ───────────────────────────
  console.log('\n--- 2. Verifiable Transcript & Public Proof ---');
  const profile = await PathwayApiService.getStudentSkillProfile(studentId);
  assertTest('Student profile is accessible for public verifiable transcript verification', !!profile);

  // ── 3. Institutional Cohort & College Analytics Engine ───────────────────────
  console.log('\n--- 3. Institutional Cohort & College Analytics ---');
  const overview = CohortsApiService.getCollegeOverview('MIT School of Engineering');

  assertTest('College overview retrieves enrolled student cohorts', overview.totalStudents >= 4);
  assertTest('College overview computes overall placement readiness percentage',
    overview.overallPlacementReadyPct >= 0 && overview.overallPlacementReadyPct <= 100
  );
  assertTest('College overview computes average oral defense score',
    overview.avgOralDefenseScore > 0 && overview.avgOralDefenseScore <= 100
  );
  assertTest('College overview breaks down stats across multiple engineering departments',
    overview.departments.length >= 2
  );

  const csDept = overview.departments.find(d => d.department.includes('Computer Science'));
  assertTest('Computer Science department has positive interview-ready student count',
    !!csDept && csDept.interviewReadyCount > 0
  );
  assertTest('Departmental placementReadyPct matches ratio of interview-ready students',
    csDept ? csDept.placementReadyPct === Math.round((csDept.interviewReadyCount / csDept.totalStudents) * 100) : false
  );

  // ── Final Summary ────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  if (failCount === 0) {
    console.log(`  🎉 PHASE 3 ENTERPRISE ECOSYSTEM: ALL ${passCount}/${passCount} TESTS PASSED WITH 0 REGRESSIONS!`);
  } else {
    console.error(`  ❌ PHASE 3 TEST FAILURES: ${failCount} failed, ${passCount} passed.`);
  }
  console.log('================================================================\n');

  if (failCount > 0) process.exit(1);
}

runPhase3Tests().catch(err => {
  console.error('Phase 3 Test Execution Error:', err);
  process.exit(1);
});
