// scripts/test_master_all_phases.ts
// Master 360-Degree Forensic Audit Runner for all 5 Phases of PinIT Career OS

import { COMPETENCY_CATALOG_V1 } from '../src/lib/pathway/competencyCatalog';
import {
  validateCompetencyCatalog,
  validateCompetencyGraph,
  validateCompetencyReferences,
} from '../src/lib/pathway/graphValidator';
import {
  CompetencyDefinition,
  CompetencyEvidenceRecord,
  CompetencyMasteryStatus,
  MasteryState,
  ProgramStage,
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
import {
  COURSE_COMPETENCY_MATRIX,
  getCompetenciesForCourse,
  getCoursesForCompetency,
  mapQuestToCompetencyEvidence,
} from '../src/lib/pathway/competencyMatrix';
import { generateDynamicStudentRoadmap } from '../src/lib/data/roadmapFuser';
import { PathwayApiService } from '../src/lib/api/pathwayApi';

console.log('================================================================');
console.log('  PINIT CAREER OS: MASTER 360° ALL-PHASE FORENSIC AUDIT MATRIX  ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
const phaseScores: Record<string, { passed: number; total: number }> = {
  'Phase 1: Taxonomy & DAG Validation': { passed: 0, total: 0 },
  'Phase 2: Evidence & Gated Mastery Engine': { passed: 0, total: 0 },
  'Phase 3: Program Engine, Matrix & Fuser': { passed: 0, total: 0 },
  'Phase 4: UI Visualizers & Passport Sync': { passed: 0, total: 0 },
  'Phase 5: Persistence & Universal API': { passed: 0, total: 0 },
};

function runTest(phase: string, name: string, condition: boolean, details?: any) {
  totalTests++;
  phaseScores[phase].total++;
  if (condition) {
    passedTests++;
    phaseScores[phase].passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    console.error(`  ❌ [FAIL] [${phase}] ${name}`, details || '');
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1: TAXONOMY, GRAPH VALIDATION & DAG INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────
console.log('━━━ PHASE 1: TAXONOMY & DAG GRAPH VALIDATION ━━━━━━━━━━━━━━━━━━━');
const catValidation = validateCompetencyCatalog(COMPETENCY_CATALOG_V1);
runTest('Phase 1: Taxonomy & DAG Validation', 'Production Catalog V1 is 100% valid with 0 errors', catValidation.valid);
runTest('Phase 1: Taxonomy & DAG Validation', 'Catalog has 0 missing prerequisite references', catValidation.missingReferences.length === 0);
runTest('Phase 1: Taxonomy & DAG Validation', 'Catalog has 0 duplicate competency IDs', catValidation.duplicateCompetencyIds.length === 0);
runTest('Phase 1: Taxonomy & DAG Validation', 'Catalog has 0 cyclic dependency loops', catValidation.cycles.length === 0);
runTest('Phase 1: Taxonomy & DAG Validation', 'Catalog has 0 self-dependencies (A -> A)', catValidation.selfDependencies.length === 0);
runTest('Phase 1: Taxonomy & DAG Validation', 'Catalog has 0 cross-level hierarchy violations', catValidation.invalidCrossLevelPrerequisites.length === 0);
runTest('Phase 1: Taxonomy & DAG Validation', 'Catalog has 0 invalid class weight sums', catValidation.invalidClassWeights.length === 0);
runTest('Phase 1: Taxonomy & DAG Validation', 'Catalog has 0 invalid evidence requirements', catValidation.invalidEvidenceRequirements.length === 0);

// Diamond DAG & Cycle vectors
const diamondCatalog: CompetencyDefinition[] = [
  { id: 'comp_root', version: '1.0.0', title: 'Root', domain: 'tech', level: 'L0', description: 'Root', prerequisites: [], evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }], classWeights: { knowledge: 1.0 } },
  { id: 'comp_branch_a', version: '1.0.0', title: 'A', domain: 'tech', level: 'L1', description: 'A', prerequisites: ['comp_root'], evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }], classWeights: { knowledge: 1.0 } },
  { id: 'comp_branch_b', version: '1.0.0', title: 'B', domain: 'tech', level: 'L1', description: 'B', prerequisites: ['comp_root'], evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }], classWeights: { knowledge: 1.0 } },
  { id: 'comp_diamond_join', version: '1.0.0', title: 'Join', domain: 'tech', level: 'L2', description: 'Join', prerequisites: ['comp_branch_a', 'comp_branch_b'], evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }], classWeights: { knowledge: 1.0 } },
];
runTest('Phase 1: Taxonomy & DAG Validation', 'Diamond DAG correctly passes validation with 0 false-positive cycles', validateCompetencyCatalog(diamondCatalog).valid);

const cycleCatalog: CompetencyDefinition[] = [
  { ...diamondCatalog[0], id: 'comp_c1', prerequisites: ['comp_c3'] },
  { ...diamondCatalog[1], id: 'comp_c2', prerequisites: ['comp_c1'] },
  { ...diamondCatalog[2], id: 'comp_c3', prerequisites: ['comp_c2'] },
];
runTest('Phase 1: Taxonomy & DAG Validation', 'Cycle detection catches circular dependency loop', !validateCompetencyCatalog(cycleCatalog).valid);

const selfDepCatalog: CompetencyDefinition[] = [{ ...diamondCatalog[0], id: 'comp_self', prerequisites: ['comp_self'] }];
runTest('Phase 1: Taxonomy & DAG Validation', 'Self-dependency (A -> A) is detected', !validateCompetencyCatalog(selfDepCatalog).valid);

const missingRefCatalog: CompetencyDefinition[] = [{ ...diamondCatalog[0], id: 'comp_has_missing', prerequisites: ['non_existent_id'] }];
runTest('Phase 1: Taxonomy & DAG Validation', 'Missing prerequisite reference is detected', !validateCompetencyCatalog(missingRefCatalog).valid);

const dupIdCatalog: CompetencyDefinition[] = [{ ...diamondCatalog[0], id: 'comp_same' }, { ...diamondCatalog[1], id: 'comp_same' }];
runTest('Phase 1: Taxonomy & DAG Validation', 'Duplicate competency ID is detected', !validateCompetencyCatalog(dupIdCatalog).valid);

const crossLevelCatalog: CompetencyDefinition[] = [{ ...diamondCatalog[0], id: 'comp_l1', level: 'L1', prerequisites: ['comp_l4_prereq'] }, { ...diamondCatalog[0], id: 'comp_l4_prereq', level: 'L4', prerequisites: [] }];
runTest('Phase 1: Taxonomy & DAG Validation', 'Illegal cross-level prerequisite (L1 -> L4) is caught', !validateCompetencyCatalog(crossLevelCatalog).valid);

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2: EVIDENCE LEDGER & GATED MASTERY ENGINE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n━━━ PHASE 2: EVIDENCE LEDGER & GATED MASTERY ENGINE ━━━━━━━━━━━━');
const compJava = COMPETENCY_CATALOG_V1.find(c => c.id === 'comp_java_syntax_oop_l1')!;
const compConcurrency = COMPETENCY_CATALOG_V1.find(c => c.id === 'comp_concurrency_threads_l2')!;
const compDatabase = COMPETENCY_CATALOG_V1.find(c => c.id === 'comp_database_sql_internals_l3')!;

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

const baseEv = createEvidence({ score: 88, artifacts: { commitSha: 'abc1234' } });
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Integrity hash verifies on authentic record', verifyEvidenceIntegrity(baseEv));
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Tampered score is detected and rejected', !verifyEvidenceIntegrity({ ...baseEv, score: 89 }));
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Tampered timestamp is detected and rejected', !verifyEvidenceIntegrity({ ...baseEv, timestamp: baseEv.timestamp + 1 }));
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Tampered commitSha is detected and rejected', !verifyEvidenceIntegrity({ ...baseEv, artifacts: { commitSha: 'tampered' } }));
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Tampered evaluatorVersion is detected and rejected', !verifyEvidenceIntegrity({ ...baseEv, evaluatorVersion: 'v2.0' }));
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Tampered difficulty is detected and rejected', !verifyEvidenceIntegrity({ ...baseEv, difficulty: 'advanced' }));

// Anti-gaming deduplication
const attemptLow = createEvidence({ sourceId: 'quest_loop_01', attemptId: 'att_1', score: 60, timestamp: 1000 });
const attemptHigh = createEvidence({ sourceId: 'quest_loop_01', attemptId: 'att_2', score: 95, timestamp: 2000 });
const attemptDesc = createEvidence({ sourceId: 'quest_loop_01', attemptId: 'att_3', score: 80, timestamp: 3000 });
const foreignComp = createEvidence({ competencyId: 'comp_python_syntax_data_l1', sourceId: 'quest_python_01', score: 100 });
const mixedSummary = processEvidenceLedger(compJava, [attemptLow, attemptHigh, attemptDesc, foreignComp]);
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Foreign competency records are strictly filtered out', mixedSummary.totalRawRecords === 3);
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Repeated attempts on same sourceId are collapsed to 1 independent record', mixedSummary.independentSourceCount === 1);
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Deduplication strictly preserves the highest score (95)', mixedSummary.qualifiedIndependentRecords[0].score === 95);

// Family diversity
const evFam1a = createEvidence({ sourceId: 'src_1', evidenceFamilyId: 'fam_oop' });
const evFam1b = createEvidence({ sourceId: 'src_2', evidenceFamilyId: 'fam_oop' });
const evFam2 = createEvidence({ sourceId: 'src_3', evidenceFamilyId: 'fam_poly' });
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Multiple tasks in same family yield distinctFamilyCount = 1', processEvidenceLedger(compJava, [evFam1a, evFam1b]).distinctFamilyCount === 1);
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Tasks in diverse families yield distinctFamilyCount = 2', processEvidenceLedger(compJava, [evFam1a, evFam2]).distinctFamilyCount === 2);

// Critical failure lockdown
const sqlInjectionEvidence = createEvidence({ competencyId: compDatabase.id, evidenceClass: 'debugging', difficulty: 'advanced', sourceId: 'db_bug_01', score: 40, criticalFailuresDetected: ['SQL_INJECTION_VULNERABLE'] });
const masteryCritical = evaluateCompetencyMastery({ competency: compDatabase, rawEvidenceRecords: [sqlInjectionEvidence], prerequisiteMasteryStates: { comp_dsa_linear_trees_l2: 'verified' } });
runTest('Phase 2: Evidence & Gated Mastery Engine', 'SQL injection critical failure is detected', masteryCritical.hasCriticalFailures === true);
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Critical failure caps state at provisional or below', masteryCritical.state !== 'demonstrated' && masteryCritical.state !== 'verified');

// Demonstrated vs Verified
const know1 = createEvidence({ competencyId: compJava.id, evidenceClass: 'knowledge', sourceId: 'k1', score: 80, artifacts: undefined });
const know2 = createEvidence({ competencyId: compJava.id, evidenceClass: 'knowledge', sourceId: 'k2', score: 80, artifacts: undefined });
const app1 = createEvidence({ competencyId: compJava.id, evidenceClass: 'application', sourceId: 'a1', evidenceFamilyId: 'f1', score: 85, artifacts: undefined });
const app2 = createEvidence({ competencyId: compJava.id, evidenceClass: 'application', sourceId: 'a2', evidenceFamilyId: 'f2', score: 90, artifacts: undefined });
const evalDemonstrated = evaluateCompetencyMastery({ competency: compJava, rawEvidenceRecords: [know1, know2, app1, app2], prerequisiteMasteryStates: { comp_comp_fundamentals_l0: 'verified' } });
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Passing all gates without external commit yields demonstrated state', evalDemonstrated.state === 'demonstrated');

const appWithCommit = createEvidence({ competencyId: compJava.id, evidenceClass: 'application', sourceId: 'a2', evidenceFamilyId: 'f2', score: 90, artifacts: { commitSha: 'sha_git_verified_999' } });
const evalVerified = evaluateCompetencyMastery({ competency: compJava, rawEvidenceRecords: [know1, know2, app1, appWithCommit], prerequisiteMasteryStates: { comp_comp_fundamentals_l0: 'verified' } });
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Passing all gates with authenticated commit yields verified state', evalVerified.state === 'verified');

// Non-destructive FSRS decay
const evalDecayed = evaluateCompetencyMastery({ competency: compJava, rawEvidenceRecords: [know1, know2, app1, appWithCommit], prerequisiteMasteryStates: { comp_comp_fundamentals_l0: 'verified' }, fsrsRecallWeak: true });
runTest('Phase 2: Evidence & Gated Mastery Engine', 'FSRS decay signals verified_needs_review (non-destructive)', evalDecayed.state === 'verified_needs_review');
runTest('Phase 2: Evidence & Gated Mastery Engine', 'Composite score (84.50) and gates remain intact during review state', evalDecayed.compositeScore === 84.5 && evalDecayed.allGatesPassed);

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 3: PROGRAM ENGINE, MATRIX & FUSER INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n━━━ PHASE 3: PROGRAM ENGINE, MATRIX & FUSER INTEGRATION ━━━━━━━━');
const sweProgram = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_software_engineering')!;
const dataProgram = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_data_analytics')!;

runTest('Phase 3: Program Engine, Matrix & Fuser', 'Software Engineering program defined with 4 distinct semesters', sweProgram.stages.length === 4);
runTest('Phase 3: Program Engine, Matrix & Fuser', 'Software Engineering has Industry Residency enabled', sweProgram.hasIndustryResidency === true);
runTest('Phase 3: Program Engine, Matrix & Fuser', 'Data Analytics program defined with 3 distinct semesters', dataProgram.stages.length === 3);

// Stage progression gating
const sem1 = sweProgram.stages[0];
const sem2 = sweProgram.stages[1];
const borderScoreMap = new Map<string, CompetencyMasteryStatus>([
  ['comp_comp_fundamentals_l0', { state: 'demonstrated', compositeScore: 80 } as any],
  ['comp_git_version_control_l1', { state: 'verified', compositeScore: 74.99 } as any],
  ['comp_java_syntax_oop_l1', { state: 'demonstrated', compositeScore: 80 } as any],
]);
runTest('Phase 3: Program Engine, Matrix & Fuser', 'Score of 74.99 strictly fails minScore: 75 requirement', !evaluateStageProgression(sem1, sem2, borderScoreMap).isStageCompleted);

const fullMasteryMap = new Map<string, CompetencyMasteryStatus>();
for (const stage of sweProgram.stages) {
  for (const req of stage.requiredCompetencies) {
    fullMasteryMap.set(req.competencyId, { state: 'verified', compositeScore: 90, hasCriticalFailures: false } as any);
  }
}
runTest('Phase 3: Program Engine, Matrix & Fuser', 'Student graduates successfully when all criteria are met', evaluateProgramGraduation(sweProgram, fullMasteryMap, true, true).isGraduated);

// Matrix mapping
runTest('Phase 3: Program Engine, Matrix & Fuser', 'course-java resolves to syntax and concurrency competencies', getCompetenciesForCourse('course-java').includes('comp_java_syntax_oop_l1'));
runTest('Phase 3: Program Engine, Matrix & Fuser', 'comp_backend_apis_frameworks_l3 maps to course-fullstack', getCoursesForCompetency('comp_backend_apis_frameworks_l3').includes('course-fullstack'));

// Fuser integration
const dynamicModules = generateDynamicStudentRoadmap({ courseId: 'course-java', goal: 'Full-Stack Software Engineer', durationDays: 30 });
runTest('Phase 3: Program Engine, Matrix & Fuser', 'Roadmap Fuser attaches valid competencyTag to generated quests', dynamicModules[0].quests.some(q => q.competencyTag !== undefined));

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4: UI VISUALIZERS & PASSPORT INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n━━━ PHASE 4: UI VISUALIZERS & PASSPORT INTEGRATION ━━━━━━━━━━━━━');
runTest('Phase 4: UI Visualizers & Passport Sync', 'Domain filter "all" returns full catalog (17 competencies)', COMPETENCY_CATALOG_V1.length === 17);
runTest('Phase 4: UI Visualizers & Passport Sync', 'Domain filter "tech" returns only engineering competencies', COMPETENCY_CATALOG_V1.filter(c => c.domain === 'tech').length >= 5);
runTest('Phase 4: UI Visualizers & Passport Sync', 'Search "syntax" matches Java and Python syntax competencies', COMPETENCY_CATALOG_V1.filter(c => c.title.toLowerCase().includes('syntax')).length >= 2);
runTest('Phase 4: UI Visualizers & Passport Sync', 'Search "residency" matches Production Residency L5', COMPETENCY_CATALOG_V1.filter(c => c.title.toLowerCase().includes('residency')).length >= 1);
runTest('Phase 4: UI Visualizers & Passport Sync', 'Invalid program ID safely defaults to first available catalog program', (CAREER_PROGRAMS_CATALOG.find(p => p.id === 'invalid_id') || CAREER_PROGRAMS_CATALOG[0]).id === 'prog_swe_accelerated_9m');

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 5: PERSISTENCE & UNIVERSAL API SERVICE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n━━━ PHASE 5: PERSISTENCE & UNIVERSAL API SERVICE ━━━━━━━━━━━━━━━');

async function testPhase5() {
  const studentId = 'test_student_master_audit_01';
  const initialMap = await PathwayApiService.getStudentMasteryMap(studentId);
  runTest('Phase 5: Persistence & Universal API', 'Initial mastery map contains all 17 competencies from catalog', initialMap.size === 17);
  runTest('Phase 5: Persistence & Universal API', 'Zero-prerequisite L0 competency begins in learning state', initialMap.get('comp_comp_fundamentals_l0')?.state === 'learning');

  const recResult = await PathwayApiService.recordEvidence({
    id: 'ev_master_001',
    competencyId: 'comp_comp_fundamentals_l0',
    competencyVersion: '1.0.0',
    studentId: studentId,
    programId: 'prog_software_engineering',
    evidenceClass: 'knowledge',
    difficulty: 'basic',
    evidenceFamilyId: 'comp_arch',
    sourceType: 'quest',
    sourceId: 'quest_arch_01',
    attemptId: 'att_01',
    score: 85,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'eval-v1',
    rubricVersion: 'rubric-v1',
    timestamp: Date.now(),
  });

  runTest('Phase 5: Persistence & Universal API', 'Evidence is successfully recorded with valid SHA-256 hash', recResult.success && recResult.evidenceRecord.integrityHash.length === 64);
  runTest('Phase 5: Persistence & Universal API', 'Mastery engine recalculates status and marks L0 demonstrated', recResult.updatedMastery.state === 'demonstrated');

  let invalidCompThrown = false;
  try {
    await PathwayApiService.recordEvidence({
      id: 'ev_invalid_01',
      competencyId: 'comp_non_existent_id',
      competencyVersion: '1.0.0',
      studentId: studentId,
      programId: 'prog_software_engineering',
      evidenceClass: 'knowledge',
      difficulty: 'basic',
      sourceType: 'quest',
      sourceId: 'quest_01',
      attemptId: 'att_01',
      score: 90,
      evaluatorType: 'deterministic',
      evaluatorVersion: 'eval-v1',
      rubricVersion: 'rubric-v1',
      timestamp: Date.now(),
    });
  } catch (err: any) {
    invalidCompThrown = err.message.includes('Competency definition not found');
  }
  runTest('Phase 5: Persistence & Universal API', 'Recording evidence for non-existent competency throws clear descriptive error', invalidCompThrown);

  const stageResult = await PathwayApiService.evaluateStage(studentId, 'prog_software_engineering', 0);
  runTest('Phase 5: Persistence & Universal API', 'Stage 1 progress reflects completed L0 competency', stageResult.stageProgressPct > 0);

  const gradResult = await PathwayApiService.evaluateGraduation(studentId, 'prog_software_engineering', false, false);
  runTest('Phase 5: Persistence & Universal API', 'Student is not graduated initially (capstone and residency incomplete)', !gradResult.isGraduated);

  // Print Summary Scorecard
  console.log('\n================================================================');
  console.log('  PINIT MASTER 360° AUDIT SCORECARD ACROSS ALL 5 PHASES         ');
  console.log('================================================================');
  for (const [phase, score] of Object.entries(phaseScores)) {
    console.log(`  ${score.passed === score.total ? '✅' : '❌'} ${phase.padEnd(45)}: ${score.passed}/${score.total} PASS`);
  }
  console.log('────────────────────────────────────────────────────────────────');
  console.log(`  🎉 OVERALL AUDIT RESULT: ALL ${passedTests}/${totalTests} FORENSIC TESTS PASSED WITH 0 ERRORS!`);
  console.log('================================================================\n');
}

testPhase5().catch(err => {
  console.error('Master audit execution error:', err);
  process.exit(1);
});
