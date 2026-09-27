// scripts/test_evidence_mastery.ts
// Exhaustive 360-degree forensic audit runner for Evidence Ledger & Gated Mastery Engine

import { COMPETENCY_CATALOG_V1 } from '../src/lib/pathway/competencyCatalog';
import { CompetencyEvidenceRecord } from '../src/lib/pathway/competencySchema';
import {
  generateEvidenceIntegrityHash,
  processEvidenceLedger,
  verifyEvidenceIntegrity,
} from '../src/lib/pathway/evidenceEngine';
import {
  evaluateCompetencyMastery,
  MASTERY_POLICY_VERSION,
} from '../src/lib/pathway/masteryEngine';

console.log('================================================================');
console.log('  PINIT EVIDENCE & MASTERY ENGINE: 360° FORENSIC AUDIT SUITE    ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assertTest(name: string, condition: boolean, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${name}`);
  } else {
    console.error(`❌ [FAIL] ${name}`, details || '');
    process.exit(1);
  }
}

const compJava = COMPETENCY_CATALOG_V1.find(c => c.id === 'comp_java_syntax_oop_l1')!;
const compConcurrency = COMPETENCY_CATALOG_V1.find(c => c.id === 'comp_concurrency_threads_l2')!;
const compDatabase = COMPETENCY_CATALOG_V1.find(c => c.id === 'comp_database_sql_internals_l3')!;

// Helper to create clean test evidence records
function createEvidence(overrides: Partial<CompetencyEvidenceRecord>): CompetencyEvidenceRecord {
  const base: Omit<CompetencyEvidenceRecord, 'integrityHash'> = {
    id: `ev_${Math.random().toString(36).slice(2, 9)}`,
    competencyId: 'comp_java_syntax_oop_l1',
    competencyVersion: '1.0.0',
    studentId: 'student_123',
    programId: 'prog_software_engineering',
    evidenceClass: 'application',
    difficulty: 'basic',
    evidenceFamilyId: 'fam_default',
    sourceType: 'quest',
    sourceId: `source_${Math.random().toString(36).slice(2, 9)}`,
    attemptId: `att_${Math.random().toString(36).slice(2, 9)}`,
    score: 85,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'compiler-v1.0',
    rubricVersion: 'rubric-v1',
    timestamp: 1724230000000,
    ...overrides,
  };
  const integrityHash = generateEvidenceIntegrityHash(base);
  return { ...base, integrityHash };
}

// ── 1. SHA-256 Integrity & Tamper Resistance ─────────────────────────────────
console.log('--- 1. SHA-256 Canonical Integrity & Tamper Resistance ---');
const baseRecord = createEvidence({ score: 88, artifacts: { commitSha: 'abc1234' } });
assertTest('Integrity hash verifies on authentic record', verifyEvidenceIntegrity(baseRecord));
assertTest('Tampered score is detected and rejected', !verifyEvidenceIntegrity({ ...baseRecord, score: 89 }));
assertTest('Tampered timestamp is detected and rejected', !verifyEvidenceIntegrity({ ...baseRecord, timestamp: baseRecord.timestamp + 1 }));
assertTest('Tampered commitSha is detected and rejected', !verifyEvidenceIntegrity({ ...baseRecord, artifacts: { commitSha: 'tampered' } }));
assertTest('Tampered evaluatorVersion is detected and rejected', !verifyEvidenceIntegrity({ ...baseRecord, evaluatorVersion: 'v2.0' }));
assertTest('Tampered difficulty is detected and rejected', !verifyEvidenceIntegrity({ ...baseRecord, difficulty: 'advanced' }));

// ── 2. Anti-Gaming Deduplication & Cross-Competency Filtering ─────────────────
console.log('\n--- 2. Anti-Gaming Deduplication & Cross-Competency Isolation ---');
const attemptLow = createEvidence({ sourceId: 'quest_loop_01', attemptId: 'att_1', score: 60, timestamp: 1000 });
const attemptHigh = createEvidence({ sourceId: 'quest_loop_01', attemptId: 'att_2', score: 95, timestamp: 2000 });
const attemptDesc = createEvidence({ sourceId: 'quest_loop_01', attemptId: 'att_3', score: 80, timestamp: 3000 });
const foreignComp = createEvidence({ competencyId: 'comp_python_syntax_data_l1', sourceId: 'quest_python_01', score: 100 });

const mixedSummary = processEvidenceLedger(compJava, [attemptLow, attemptHigh, attemptDesc, foreignComp]);
assertTest('Foreign competency records are strictly filtered out', mixedSummary.totalRawRecords === 3);
assertTest('Repeated attempts on same sourceId are collapsed to 1 independent record', mixedSummary.independentSourceCount === 1);
assertTest('Deduplication strictly preserves the highest score (95)', mixedSummary.qualifiedIndependentRecords[0].score === 95);

// ── 3. Family Diversity Gating ────────────────────────────────────────────────
console.log('\n--- 3. Family Diversity Gating ---');
const evFam1a = createEvidence({ sourceId: 'src_1', evidenceFamilyId: 'fam_oop' });
const evFam1b = createEvidence({ sourceId: 'src_2', evidenceFamilyId: 'fam_oop' });
const evFam2 = createEvidence({ sourceId: 'src_3', evidenceFamilyId: 'fam_poly' });

const summarySameFam = processEvidenceLedger(compJava, [evFam1a, evFam1b]);
assertTest('Multiple tasks in same family yield distinctFamilyCount = 1', summarySameFam.distinctFamilyCount === 1);

const summaryDiverseFam = processEvidenceLedger(compJava, [evFam1a, evFam2]);
assertTest('Tasks in diverse families yield distinctFamilyCount = 2', summaryDiverseFam.distinctFamilyCount === 2);

// ── 4. Empty / Zero State Edge Case Handling ─────────────────────────────────
console.log('\n--- 4. Empty / Zero State Edge Cases ---');
const emptyMastery = evaluateCompetencyMastery({
  competency: compJava,
  rawEvidenceRecords: [],
  prerequisiteMasteryStates: { comp_comp_fundamentals_l0: 'verified' },
});
assertTest('Empty evidence ledger evaluates to compositeScore = 0', emptyMastery.compositeScore === 0);
assertTest('Empty evidence ledger produces 0% coverage', emptyMastery.evidenceCoveragePct === 0);
assertTest('Empty evidence ledger defaults state to learning when prereqs met', emptyMastery.state === 'learning');
assertTest('Empty evidence ledger populates clear blocker messages for all missing gates', (emptyMastery.blockedBy?.length || 0) > 0);

// ── 5. Mixed Difficulty & Difficulty Threshold Enforcement ───────────────────
console.log('\n--- 5. Mixed Difficulty & Threshold Enforcement ---');
const diffBasic = createEvidence({ competencyId: compConcurrency.id, evidenceClass: 'debugging', difficulty: 'basic', sourceId: 'bug_1', score: 90 });
const diffInter = createEvidence({ competencyId: compConcurrency.id, evidenceClass: 'debugging', difficulty: 'intermediate', sourceId: 'bug_2', score: 85 });
const diffAdv = createEvidence({ competencyId: compConcurrency.id, evidenceClass: 'debugging', difficulty: 'advanced', sourceId: 'bug_3', score: 80 });

const summaryMixedDiff = processEvidenceLedger(compConcurrency, [diffBasic, diffInter, diffAdv]);
assertTest('processEvidenceLedger accurately computes highestDifficulty as advanced', summaryMixedDiff.classSummaries.debugging.highestDifficulty === 'advanced');

// ── 6. Critical Failure State Lockdown ───────────────────────────────────────
console.log('\n--- 6. Critical Failure Enforcement ---');
const sqlInjectionEvidence = createEvidence({
  competencyId: compDatabase.id,
  evidenceClass: 'debugging',
  difficulty: 'advanced',
  sourceId: 'db_bug_01',
  score: 40,
  criticalFailuresDetected: ['SQL_INJECTION_VULNERABLE'],
});
const masteryCritical = evaluateCompetencyMastery({
  competency: compDatabase,
  rawEvidenceRecords: [sqlInjectionEvidence],
  prerequisiteMasteryStates: { comp_dsa_linear_trees_l2: 'verified' },
});
assertTest('SQL injection critical failure is detected', masteryCritical.hasCriticalFailures === true);
assertTest('Critical failure caps state at provisional or below', masteryCritical.state !== 'demonstrated' && masteryCritical.state !== 'verified');
assertTest('Actionable blocker describes SQL injection failure', masteryCritical.blockedBy?.some(b => b.includes('SQL_INJECTION_VULNERABLE')) === true);

// ── 7. Prerequisite DAG Gating & Partial Prerequisite Fulfillment ─────────────
console.log('\n--- 7. Prerequisite DAG Gating ---');
const masteryNoPrereqs = evaluateCompetencyMastery({
  competency: compDatabase,
  rawEvidenceRecords: [createEvidence({ competencyId: compDatabase.id })],
  prerequisiteMasteryStates: {}, // Missing prerequisites!
});
assertTest('Unmet prerequisite forces state to locked', masteryNoPrereqs.state === 'locked');
assertTest('Blocker explicitly identifies missing prerequisite ID', masteryNoPrereqs.blockedBy?.some(b => b.includes('comp_dsa_linear_trees_l2')) === true);

// ── 8. Demonstrated vs Verified Transition with Provenance ────────────────────
console.log('\n--- 8. Demonstrated vs Verified Transition ---');
const know1 = createEvidence({ competencyId: compJava.id, evidenceClass: 'knowledge', sourceId: 'k1', score: 80, artifacts: undefined });
const know2 = createEvidence({ competencyId: compJava.id, evidenceClass: 'knowledge', sourceId: 'k2', score: 80, artifacts: undefined });
const app1 = createEvidence({ competencyId: compJava.id, evidenceClass: 'application', sourceId: 'a1', evidenceFamilyId: 'f1', score: 85, artifacts: undefined });
const app2 = createEvidence({ competencyId: compJava.id, evidenceClass: 'application', sourceId: 'a2', evidenceFamilyId: 'f2', score: 90, artifacts: undefined });

const evalDemonstrated = evaluateCompetencyMastery({
  competency: compJava,
  rawEvidenceRecords: [know1, know2, app1, app2],
  prerequisiteMasteryStates: { comp_comp_fundamentals_l0: 'verified' },
});
assertTest('Passing all gates without external commit yields demonstrated state', evalDemonstrated.state === 'demonstrated');

const appWithCommit = createEvidence({
  competencyId: compJava.id,
  evidenceClass: 'application',
  sourceId: 'a2',
  evidenceFamilyId: 'f2',
  score: 90,
  artifacts: { commitSha: 'sha_git_verified_999' },
});
const evalVerified = evaluateCompetencyMastery({
  competency: compJava,
  rawEvidenceRecords: [know1, know2, app1, appWithCommit],
  prerequisiteMasteryStates: { comp_comp_fundamentals_l0: 'verified' },
});
assertTest('Passing all gates with authenticated commit yields verified state', evalVerified.state === 'verified');

// ── 9. Non-Destructive FSRS Decay & Restoration Invariant ────────────────────
console.log('\n--- 9. Non-Destructive FSRS Decay Invariant ---');
const evalDecayed = evaluateCompetencyMastery({
  competency: compJava,
  rawEvidenceRecords: [know1, know2, app1, appWithCommit],
  prerequisiteMasteryStates: { comp_comp_fundamentals_l0: 'verified' },
  fsrsRecallWeak: true, // Decay signal
});
assertTest('FSRS decay signals verified_needs_review (non-destructive)', evalDecayed.state === 'verified_needs_review');
assertTest('Composite score (84.5) and gates remain intact during review state', evalDecayed.compositeScore === 84.5 && evalDecayed.allGatesPassed);

// Restoring review
const evalRestored = evaluateCompetencyMastery({
  competency: compJava,
  rawEvidenceRecords: [know1, know2, app1, appWithCommit],
  prerequisiteMasteryStates: { comp_comp_fundamentals_l0: 'verified' },
  fsrsRecallWeak: false, // Review completed
});
assertTest('Resolving review returns state directly to verified', evalRestored.state === 'verified');

// ── 10. Mathematical Precision & Composite Normalization ─────────────────────
console.log('\n--- 10. Mathematical Precision & Rounding ---');
// Knowledge: avg = 80 (weight = 0.40) -> 32.0
// Application: avg = (85 + 90)/2 = 87.5 (weight = 0.60) -> 52.5
// Total = 84.50
assertTest('Composite score matches exact 2-decimal rounded weighted formula', evalVerified.compositeScore === 84.5);
assertTest('Evidence coverage percentage is exactly 100%', evalVerified.evidenceCoveragePct === 100);
assertTest('Independent evidence count is exactly 4', evalVerified.independentEvidenceCount === 4);
assertTest('Mastery policy version is persisted as policy-v1.0.0', evalVerified.masteryPolicyVersion === MASTERY_POLICY_VERSION);

console.log('\n================================================================');
console.log(`  🎉 360° FORENSIC AUDIT PASSED: ALL ${passedTests}/${totalTests} TESTS PASSED WITH 0 ERRORS!`);
console.log('================================================================\n');
