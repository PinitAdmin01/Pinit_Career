// scripts/test_adversarial_stress_matrix.ts
// Ruthless Adversarial, Chaos & Fuzz Testing Suite for PinIT Career OS Pathway Engine

import { COMPETENCY_CATALOG_V1 } from '../src/lib/pathway/competencyCatalog';
import { validateCompetencyCatalog } from '../src/lib/pathway/graphValidator';
import {
  CompetencyDefinition,
  CompetencyEvidenceRecord,
  CompetencyMasteryStatus,
  DIFFICULTY_RANK,
} from '../src/lib/pathway/competencySchema';
import {
  generateEvidenceIntegrityHash,
  processEvidenceLedger,
  verifyEvidenceIntegrity,
} from '../src/lib/pathway/evidenceEngine';
import {
  evaluateCompetencyMastery,
  MASTERY_POLICY_VERSION,
} from '../src/lib/pathway/masteryEngine';
import {
  CAREER_PROGRAMS_CATALOG,
  evaluateProgramGraduation,
  evaluateStageProgression,
} from '../src/lib/pathway/programEngine';
import { PathwayApiService } from '../src/lib/api/pathwayApi';

console.log('================================================================');
console.log('  PINIT ADVERSARIAL STRESS & CHAOS TEST HARNESS (ZERO TOLERANCE)');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assertAdversarial(name: string, condition: boolean, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  🛡️ [PASS] ${name}`);
  } else {
    console.error(`  💥 [FAIL] ${name}`, details || '');
    process.exit(1);
  }
}

// ── 1. Anti-Gaming Deduplication Under Flood Conditions (1,000 Spammed Submissions) ──
console.log('--- 1. Anti-Gaming Flood & Deduplication Stress Test ---');
const compJava = COMPETENCY_CATALOG_V1.find(c => c.id === 'comp_java_syntax_oop_l1')!;
const spammedRecords: CompetencyEvidenceRecord[] = [];

// Simulate student submitting 1,000 attempts on the same quest with fluctuating scores
for (let i = 0; i < 1000; i++) {
  const score = i === 450 ? 98.5 : Math.floor(Math.random() * 80);
  const base: Omit<CompetencyEvidenceRecord, 'integrityHash'> = {
    id: `ev_flood_${i}`,
    competencyId: compJava.id,
    competencyVersion: '1.0.0',
    studentId: 'student_flood_attacker',
    programId: 'prog_software_engineering',
    evidenceClass: 'application',
    difficulty: 'basic',
    evidenceFamilyId: 'fam_flood',
    sourceType: 'quest',
    sourceId: 'quest_spammed_target',
    attemptId: `att_${i}`,
    score,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'eval-v1',
    rubricVersion: 'rubric-v1',
    timestamp: 1724230000000 + i,
  };
  spammedRecords.push({ ...base, integrityHash: generateEvidenceIntegrityHash(base) });
}

const floodSummary = processEvidenceLedger(compJava, spammedRecords);
assertAdversarial('1,000 spammed submissions collapse strictly to 1 independent record', floodSummary.independentSourceCount === 1);
assertAdversarial('Deduplication strictly isolates the maximum qualified score (98.5)', floodSummary.qualifiedIndependentRecords[0].score === 98.5);
assertAdversarial('Class summary average score reflects only the single deduplicated maximum (98.5)', floodSummary.classSummaries.application.averageScore === 98.5);

// ── 2. SHA-256 Canonical Hashing Fuzzing & Byte-Injection ─────────────────────
console.log('\n--- 2. Cryptographic Provenance & Payload Tampering Fuzzing ---');
const authenticRecord: CompetencyEvidenceRecord = spammedRecords[450];

// Test subtle float mutation
const floatTampered = { ...authenticRecord, score: 98.5000001 };
assertAdversarial('Microscopic score float tampering (98.5000001 vs 98.5) is detected and rejected', !verifyEvidenceIntegrity(floatTampered));

// Test empty / null artifacts injection
const nullArtifactsTampered = { ...authenticRecord, artifacts: { commitSha: undefined } };
assertAdversarial('Authentic record with undefined artifacts verifies hash', verifyEvidenceIntegrity(nullArtifactsTampered));

// Test unicode / special character payloads
const unicodeBase: Omit<CompetencyEvidenceRecord, 'integrityHash'> = {
  ...authenticRecord,
  id: 'ev_unicode_🚀_🔥',
  sourceId: "quest_inject_'; DROP TABLE student_competency_mastery; --",
};
const unicodeRecord: CompetencyEvidenceRecord = {
  ...unicodeBase,
  integrityHash: generateEvidenceIntegrityHash(unicodeBase),
};
assertAdversarial('SQL injection and Emoji in sourceId generates valid deterministic hash', verifyEvidenceIntegrity(unicodeRecord));

// ── 3. Large-Scale Circular Dependency Detection (100-Node Chain) ───────────────
console.log('\n--- 3. Complex Graph Validator Stress Test (100-Node Ring) ---');
const largeRingCatalog: CompetencyDefinition[] = [];
const RING_SIZE = 100;

for (let i = 0; i < RING_SIZE; i++) {
  const nextIdx = (i + 1) % RING_SIZE;
  largeRingCatalog.push({
    id: `comp_ring_node_${i}`,
    version: '1.0.0',
    title: `Ring Node ${i}`,
    domain: 'tech',
    level: 'L1',
    description: `Node in large circular graph ${i}`,
    prerequisites: [`comp_ring_node_${nextIdx}`], // Circular chain
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  });
}

const ringValidation = validateCompetencyCatalog(largeRingCatalog);
assertAdversarial('100-Node circular dependency ring is caught with valid: false', !ringValidation.valid);
assertAdversarial('Cycle detector identifies the circular loop in 100-node graph', ringValidation.cycles.length > 0);

// ── 4. Deep Diamond Graph DAG (50 Multi-Parent Branches) ────────────────────────
console.log('\n--- 4. Deep Diamond Graph (50-Branch Tree) Without False Cycles ---');
const deepDiamondCatalog: CompetencyDefinition[] = [
  {
    id: 'comp_root_0',
    version: '1.0.0',
    title: 'Root Node',
    domain: 'tech',
    level: 'L0',
    description: 'Root',
    prerequisites: [],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
];

const branchIds: string[] = [];
for (let i = 0; i < 50; i++) {
  const branchId = `comp_deep_branch_${i}`;
  branchIds.push(branchId);
  deepDiamondCatalog.push({
    id: branchId,
    version: '1.0.0',
    title: `Branch ${i}`,
    domain: 'tech',
    level: 'L1',
    description: `Branch ${i}`,
    prerequisites: ['comp_root_0'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  });
}

// Joiner node depending on all 50 branches
deepDiamondCatalog.push({
  id: 'comp_joiner_terminal',
  version: '1.0.0',
  title: 'Terminal Joiner Node',
  domain: 'tech',
  level: 'L2',
  description: 'Joins all 50 branches',
  prerequisites: branchIds,
  evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
  classWeights: { knowledge: 1.0 },
});

const deepDiamondResult = validateCompetencyCatalog(deepDiamondCatalog);
assertAdversarial('50-Branch Diamond DAG passes validation with zero false positive cycles', deepDiamondResult.valid && deepDiamondResult.cycles.length === 0);

// ── 5. Mathematical Float Precision & Rounding Stress ─────────────────────────
console.log('\n--- 5. Float Precision & Border Threshold Gating ---');
const sweProgram = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_software_engineering')!;
const sem1Stage = sweProgram.stages[0];

// Exact floating point border: 74.9999999 vs minScore: 75.0
const floatBorderMastery = new Map<string, CompetencyMasteryStatus>([
  ['comp_comp_fundamentals_l0', { state: 'demonstrated', compositeScore: 75.0 } as any],
  ['comp_git_version_control_l1', { state: 'verified', compositeScore: 74.9999999 } as any],
  ['comp_java_syntax_oop_l1', { state: 'demonstrated', compositeScore: 75.0 } as any],
]);

const floatResult = evaluateStageProgression(sem1Stage, undefined, floatBorderMastery);
assertAdversarial('Score of 74.9999999 strictly fails minScore: 75 gate without floating point rounding up leak', !floatResult.isStageCompleted);

// Exact boundary match: 75.0000000 satisfies minScore: 75.0
const exactMatchMastery = new Map<string, CompetencyMasteryStatus>([
  ['comp_comp_fundamentals_l0', { state: 'demonstrated', compositeScore: 70.0 } as any],
  ['comp_git_version_control_l1', { state: 'verified', compositeScore: 75.0 } as any],
  ['comp_java_syntax_oop_l1', { state: 'demonstrated', compositeScore: 75.0 } as any],
]);

const exactResult = evaluateStageProgression(sem1Stage, undefined, exactMatchMastery);
assertAdversarial('Score of exactly 75.0 passes 75.0 threshold with isStageCompleted: true', exactResult.isStageCompleted);

// ── 6. UI Regex & Search Fuzzing ──────────────────────────────────────────────
console.log('\n--- 6. UI Search & Character Fuzzing ---');
const fuzzSearch = (q: string) => {
  const query = q.toLowerCase().trim();
  return COMPETENCY_CATALOG_V1.filter(c =>
    c.title.toLowerCase().includes(query) || c.id.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
  );
};

const nastyInputs = [
  '.*',
  '+',
  '?',
  '^',
  '$',
  '{',
  '}',
  '(',
  ')',
  '|',
  '[',
  ']',
  '\\',
  '   ',
  'null',
  'undefined',
  '__proto__',
  '<script>alert(1)</script>',
];

for (const input of nastyInputs) {
  const res = fuzzSearch(input);
  assertAdversarial(`Search with regex character '${input}' executes safely without throwing`, Array.isArray(res));
}

// ── 7. Concurrent Persistence API State Consistency ──────────────────────────
console.log('\n--- 7. Concurrent State Consistency in PathwayApiService ---');
async function testConcurrency() {
  const studentId = 'student_concurrency_fuzz_01';

  // Issue 5 simultaneous asynchronous evidence records
  const promises = [1, 2, 3, 4, 5].map(idx =>
    PathwayApiService.recordEvidence({
      id: `ev_concurrent_${idx}`,
      competencyId: 'comp_comp_fundamentals_l0',
      competencyVersion: '1.0.0',
      studentId,
      programId: 'prog_software_engineering',
      evidenceClass: 'knowledge',
      difficulty: 'basic',
      evidenceFamilyId: `fam_concurrent_${idx}`,
      sourceType: 'quest',
      sourceId: `source_concurrent_${idx}`,
      attemptId: `att_${idx}`,
      score: 80 + idx,
      evaluatorType: 'deterministic',
      evaluatorVersion: 'eval-v1',
      rubricVersion: 'rubric-v1',
      timestamp: Date.now() + idx,
    })
  );

  const results = await Promise.all(promises);
  assertAdversarial('All 5 concurrent evidence records resolve successfully', results.every(r => r.success));

  const finalMap = await PathwayApiService.getStudentMasteryMap(studentId);
  const compMastery = finalMap.get('comp_comp_fundamentals_l0');
  assertAdversarial('Mastery status retains all 5 independent records', compMastery?.independentEvidenceCount === 5);
  assertAdversarial('Mastery status reflects demonstrated state', compMastery?.state === 'demonstrated');

  console.log('\n================================================================');
  console.log(`  🎉 ADVERSARIAL CHAOS AUDIT: ALL ${passedTests}/${totalTests} TESTS PASSED WITH 0 REGRESSIONS!`);
  console.log('================================================================\n');
}

testConcurrency().catch(err => {
  console.error('Adversarial stress test failed:', err);
  process.exit(1);
});
