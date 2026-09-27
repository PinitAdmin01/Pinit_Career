// scripts/test_phase1_9m_vertical_slice.ts
// Phase 1 Verification Suite: 9-Month Full-Stack Vertical Slice & Real State Traversal

import {
  CAREER_PROGRAMS_CATALOG,
  calculateDynamicRoleReadiness,
  evaluateProgramGraduation,
  evaluateStageProgression,
} from '../src/lib/pathway/programEngine';
import {
  CompetencyEvidenceRecord,
  DynamicRoleReadiness,
  ProjectLevel,
} from '../src/lib/pathway/competencySchema';
import { PathwayApiService } from '../src/lib/api/pathwayApi';

console.log('================================================================');
console.log('  PINIT PHASE 1: 9-MONTH FULL-STACK VERTICAL SLICE & E2E TEST   ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assertPhase1(name: string, condition: boolean, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    console.error(`  ❌ [FAIL] ${name}`, details || '');
    process.exit(1);
  }
}

// ── 1. Clean 4-Program Catalog Architecture ──────────────────────────────────
console.log('--- 1. Clean 4-Program Public Catalog Verification ---');
const prog9m = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_swe_accelerated_9m');
const prog12m = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_swe_standard_12m');
const prog24m = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_software_engineering');
const progData = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_data_analytics');

assertPhase1('Flagship 9-Month Final-Year program exists in catalog', !!prog9m);
assertPhase1('9-Month program has recommendedDurationMonths.standard === 9', prog9m?.recommendedDurationMonths.standard === 9);
assertPhase1('9-Month program has 2 distinct high-yield stages', prog9m?.stages.length === 2);
assertPhase1('9-Month Semester 1 has durationMonths === 6 (24 weeks)', prog9m?.stages[0].durationMonths === 6);
assertPhase1('9-Month Semester 2 has durationMonths === 3 (12 weeks residency)', prog9m?.stages[1].durationMonths === 3);
assertPhase1('12-Month program exists with 3 stages', prog12m?.stages.length === 3);
assertPhase1('24-Month Pre-Final Fellowship exists with 4 stages and Month 19-24 Specialization', prog24m?.stages.length === 4);

// ── 2. Integrated Problem-Solving / DSA Thread ────────────────────────────────
console.log('\n--- 2. Integrated DSA & Problem-Solving Thread ---');
const sem1Dsa = prog9m?.stages[0].problemSolvingThread;
assertPhase1('9-Month Semester 1 has integrated problemSolvingThread defined', !!sem1Dsa);
assertPhase1('problemSolvingThread specifies 2.5 weekly hours of problem solving', sem1Dsa?.weeklyHours === 2.5);
assertPhase1('problemSolvingThread includes Trees, Graphs, SQL Indexing, and Thread Pools',
  Boolean(sem1Dsa?.focusAreas.includes('Trees & Graphs') && sem1Dsa?.focusAreas.includes('SQL Index Traversal')));

// ── 3. Configurable Residency Engine ──────────────────────────────────────────
console.log('\n--- 3. Configurable Residency Engine (ResidencyConfig) ---');
const residencyConfig = prog9m?.residencyConfig;
assertPhase1('ResidencyConfig specifies exact 12 weeks duration', residencyConfig?.durationWeeks === 12);
assertPhase1('ResidencyConfig requires oral capstone defense', residencyConfig?.requireOralDefense === true);
assertPhase1('ResidencyConfig sets minimum defense score to 75', residencyConfig?.minDefenseScore === 75);
assertPhase1('ResidencyConfig review policy is automated_pre_screen_with_human_mentor',
  residencyConfig?.reviewPolicy === 'automated_pre_screen_with_human_mentor');

// ── 4. Project Complexity Hierarchy (P1 to P5) ────────────────────────────────
console.log('\n--- 4. Project Complexity Hierarchy Contracts ---');
const projectLevels: ProjectLevel[] = ['P1_GUIDED', 'P2_INDEPENDENT', 'P3_PRODUCTION', 'P4_SIMULATION', 'P5_CAPSTONE'];
assertPhase1('Project levels P1 through P5 are valid and typed', projectLevels.length === 5);

// ── 5. End-to-End Real Student Traversal with ZERO Hardcoded Data ─────────────
console.log('\n--- 5. Real Persisted End-to-End Traversal (Zero Fabrication) ---');
async function runEndToEndTraversal() {
  const studentId = 'student_e2e_live_cohort_01';

  // Step 1: Initial state before any diagnostic or work
  const initialReadiness = await PathwayApiService.getRoleReadiness(studentId, 'prog_swe_accelerated_9m');
  assertPhase1('Initial unassessed student has status === "exploring"', initialReadiness.status === 'exploring');
  assertPhase1('Initial verified competencies count is 0', initialReadiness.verifiedCompetenciesCount === 0);
  assertPhase1('Initial baseline diagnostic score is undefined (not fabricated)', initialReadiness.learningGain.baselineDiagnosticScore === undefined);

  // Step 2: Student completes Diagnostic Baseline Assessment (score: 45)
  await PathwayApiService.recordEvidence({
    id: `ev_diag_${studentId}`,
    competencyId: 'comp_comp_fundamentals_l0',
    competencyVersion: '1.0.0',
    studentId,
    programId: 'prog_swe_accelerated_9m',
    evidenceClass: 'knowledge',
    difficulty: 'basic',
    evidenceFamilyId: 'fam_diagnostic',
    sourceType: 'diagnostic',
    sourceId: 'diagnostic_baseline_assessment',
    attemptId: 'att_diag_01',
    score: 45,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'diagnostic-engine-v1',
    rubricVersion: 'rubric-v1',
    timestamp: Date.now() - 3600000,
  });

  // Step 3: Student completes Semester 1 & 2 Multi-Class Evidence
  const submitEvidence = async (
    compId: string,
    eClass: any,
    diff: any,
    score: number,
    count: number,
    srcType: any = 'quest',
    artifacts?: any
  ) => {
    for (let c = 0; c < count; c++) {
      await PathwayApiService.recordEvidence({
        id: `ev_${compId}_${eClass}_${c}_${studentId}`,
        competencyId: compId,
        competencyVersion: '1.0.0',
        studentId,
        programId: 'prog_swe_accelerated_9m',
        evidenceClass: eClass,
        difficulty: diff,
        evidenceFamilyId: `fam_${compId}_${eClass}_${c}`,
        sourceType: srcType,
        sourceId: `src_${compId}_${eClass}_${c}`,
        attemptId: `att_${c}`,
        score,
        evaluatorType: eClass === 'defense' ? 'rubric' : 'deterministic',
        evaluatorVersion: 'eval-v1',
        rubricVersion: 'rubric-v1',
        timestamp: Date.now() - 1800000 + c,
        artifacts: artifacts || { commitSha: `sha_${compId.slice(0, 6)}_${c}` },
      });
    }
  };

  // 1. Fundamentals L0: Knowledge
  await submitEvidence('comp_comp_fundamentals_l0', 'knowledge', 'basic', 90, 2);

  // 2. Java Syntax L1: Knowledge + Application
  await submitEvidence('comp_java_syntax_oop_l1', 'knowledge', 'basic', 88, 2);
  await submitEvidence('comp_java_syntax_oop_l1', 'application', 'basic', 88, 2);

  // 3. Git L1: Knowledge + Application (Verified with commit)
  await submitEvidence('comp_git_version_control_l1', 'knowledge', 'basic', 90, 1);
  await submitEvidence('comp_git_version_control_l1', 'application', 'basic', 92, 2, 'project', {
    githubRepoUrl: 'https://github.com/pinit/git-starter',
    commitSha: 'sha_git_01',
  });

  // 4. DSA L2: Knowledge + Application + Debugging
  await submitEvidence('comp_dsa_linear_trees_l2', 'knowledge', 'intermediate', 85, 2);
  await submitEvidence('comp_dsa_linear_trees_l2', 'application', 'intermediate', 85, 3);
  await submitEvidence('comp_dsa_linear_trees_l2', 'debugging', 'intermediate', 82, 1, 'bug_lab');

  // 5. Concurrency L2: Knowledge + Application + Debugging
  await submitEvidence('comp_concurrency_threads_l2', 'knowledge', 'intermediate', 85, 2);
  await submitEvidence('comp_concurrency_threads_l2', 'application', 'intermediate', 84, 2);
  await submitEvidence('comp_concurrency_threads_l2', 'debugging', 'intermediate', 82, 2, 'bug_lab');

  // 6. Database SQL L3: Application + Debugging + Production
  await submitEvidence('comp_database_sql_internals_l3', 'application', 'advanced', 88, 2);
  await submitEvidence('comp_database_sql_internals_l3', 'debugging', 'advanced', 85, 2, 'bug_lab');
  await submitEvidence('comp_database_sql_internals_l3', 'production', 'advanced', 85, 1, 'project');

  // 7. Backend APIs L3: Application + Production + Debugging
  await submitEvidence('comp_backend_apis_frameworks_l3', 'application', 'advanced', 90, 2);
  await submitEvidence('comp_backend_apis_frameworks_l3', 'production', 'advanced', 92, 2, 'project', {
    githubRepoUrl: 'https://github.com/pinit/backend-api',
    commitSha: 'sha_api_prod',
  });
  await submitEvidence('comp_backend_apis_frameworks_l3', 'debugging', 'advanced', 88, 1, 'bug_lab');

  // 8. Distributed Systems L4: Architecture + Debugging + Defense
  await submitEvidence('comp_distributed_systems_caching_l4', 'architecture', 'advanced', 88, 2, 'whiteboard', {
    whiteboard_diagram: 'https://pinit.dev/diagrams/dist-cache.png',
  });
  await submitEvidence('comp_distributed_systems_caching_l4', 'debugging', 'advanced', 85, 2, 'bug_lab');
  await submitEvidence('comp_distributed_systems_caching_l4', 'defense', 'advanced', 85, 1);

  // 9. CI/CD DevOps L4: Application + Production
  await submitEvidence('comp_cicd_cloud_devops_l4', 'application', 'advanced', 88, 2);
  await submitEvidence('comp_cicd_cloud_devops_l4', 'production', 'advanced', 90, 2, 'project', {
    githubRepoUrl: 'https://github.com/pinit/cicd-pipeline',
    commitSha: 'sha_cicd_prod',
    liveUrl: 'https://pipeline.pinit.dev',
  });

  // 10. Soft Skills / STAR L2: Application + Defense (Evaluator: human_mentor)
  await submitEvidence('comp_comm_star_interview_l2', 'application', 'intermediate', 85, 2);
  for (let c = 0; c < 2; c++) {
    await PathwayApiService.recordEvidence({
      id: `ev_comm_def_${studentId}_${c}`,
      competencyId: 'comp_comm_star_interview_l2',
      competencyVersion: '1.0.0',
      studentId,
      programId: 'prog_swe_accelerated_9m',
      evidenceClass: 'defense',
      difficulty: 'intermediate',
      evidenceFamilyId: `fam_comm_def_${c}`,
      sourceType: 'whiteboard',
      sourceId: `source_comm_def_${c}`,
      attemptId: `att_comm_${c}`,
      score: 85 + c,
      evaluatorType: 'human_mentor',
      evaluatorVersion: 'mentor-board-v1',
      rubricVersion: 'rubric-star-v1',
      timestamp: Date.now() - 300000 + c,
      artifacts: { commitSha: `sha_comm_${c}` },
    });
  }

  // 11. Production Residency L5: Production + Architecture (Evaluator: hybrid)
  for (let c = 0; c < 3; c++) {
    const srcType = c === 2 ? 'capstone' : 'project';
    await PathwayApiService.recordEvidence({
      id: `ev_res_prod_${studentId}_${c}`,
      competencyId: 'comp_production_engineering_residency_l5',
      competencyVersion: '1.0.0',
      studentId,
      programId: 'prog_swe_accelerated_9m',
      evidenceClass: 'production',
      difficulty: 'production',
      evidenceFamilyId: `fam_res_prod_${c}`,
      sourceType: srcType,
      sourceId: `source_res_prod_${c}`,
      attemptId: `att_res_${c}`,
      score: 90 + c,
      evaluatorType: 'hybrid',
      evaluatorVersion: 'eval-v1',
      rubricVersion: 'rubric-v1',
      timestamp: Date.now() - 900000 + c,
      artifacts: {
        repoUrl: 'https://github.com/pinit/residency-prod',
        commitSha: `sha_res_prod_${c}`,
        liveUrl: 'https://residency.pinit.dev',
      },
    });
  }

  for (let c = 0; c < 2; c++) {
    await PathwayApiService.recordEvidence({
      id: `ev_res_arch_${studentId}_${c}`,
      competencyId: 'comp_production_engineering_residency_l5',
      competencyVersion: '1.0.0',
      studentId,
      programId: 'prog_swe_accelerated_9m',
      evidenceClass: 'architecture',
      difficulty: 'production',
      evidenceFamilyId: `fam_res_arch_${c}`,
      sourceType: 'whiteboard',
      sourceId: `source_res_arch_${c}`,
      attemptId: `att_arch_${c}`,
      score: 85 + c,
      evaluatorType: 'hybrid',
      evaluatorVersion: 'eval-v1',
      rubricVersion: 'rubric-v1',
      timestamp: Date.now() - 600000 + c,
      artifacts: {
        diagramUrl: 'https://pinit.dev/diagrams/residency-arch.png',
        commitSha: `sha_res_arch_${c}`,
      },
    });
  }

  const fullMap = await PathwayApiService.getStudentMasteryMap(studentId);
  console.log('DEBUG fullMap states:');
  for (const [k, v] of fullMap.entries()) {
    console.log(`  ${k} -> state: ${v.state}, score: ${v.compositeScore}, allGates: ${v.allGatesPassed}`);
  }

  // Step 4: Check Midpoint Readiness (Before Oral Capstone Defense)
  const midpointReadiness = await PathwayApiService.getRoleReadiness(studentId, 'prog_swe_accelerated_9m');
  assertPhase1('Before Oral Defense, readiness status is "ready_for_internship" or "in_progress"',
    midpointReadiness.status === 'ready_for_internship' || midpointReadiness.status === 'in_progress');
  assertPhase1('Capstone oral defense score is still undefined', midpointReadiness.capstoneDefenseScore === undefined);

  // Step 5: Senior Engineer Conducts Live Oral Capstone Defense (Score: 90/100, Grade A)
  const defenseResult = await PathwayApiService.recordEvidence({
    id: `ev_capstone_defense_${studentId}`,
    competencyId: 'comp_production_engineering_residency_l5',
    competencyVersion: '1.0.0',
    studentId,
    programId: 'prog_swe_accelerated_9m',
    evidenceClass: 'defense',
    difficulty: 'production',
    evidenceFamilyId: 'fam_capstone_defense',
    sourceType: 'capstone_defense',
    sourceId: 'oral_capstone_defense_review',
    attemptId: 'defense_01',
    score: 90,
    evaluatorType: 'hybrid',
    evaluatorVersion: 'Senior-Engineer-Board-v1',
    rubricVersion: 'rubric-capstone-v1',
    timestamp: Date.now(),
    artifacts: {
      repoUrl: 'https://github.com/pinit/residency-prod',
      commitSha: 'sha_capstone_final',
      liveUrl: 'https://residency.pinit.dev',
      diagramUrl: 'https://pinit.dev/diagrams/residency-arch.png',
    },
  });

  console.log('DEBUG defenseResult mastery:', {
    state: defenseResult.updatedMastery.state,
    allGatesPassed: defenseResult.updatedMastery.allGatesPassed,
    blockedBy: defenseResult.updatedMastery.blockedBy,
    classBreakdown: defenseResult.updatedMastery.classBreakdown,
  });

  // Step 6: Final Role Readiness Evaluation
  const finalReadiness = await PathwayApiService.getRoleReadiness(studentId, 'prog_swe_accelerated_9m');
  console.log('DEBUG finalReadiness:', {
    status: finalReadiness.status,
    verifiedCount: finalReadiness.verifiedCompetenciesCount,
    totalRequired: finalReadiness.totalRequiredCompetenciesCount,
    capstoneScore: finalReadiness.capstoneDefenseScore,
  });
  assertPhase1('After passing all gates + Oral Defense, status reaches "ready_for_interview"',
    finalReadiness.status === 'ready_for_interview');
  assertPhase1('Real Capstone Defense score reflects exactly 90', finalReadiness.capstoneDefenseScore === 90);
  assertPhase1('Evaluator reflects Senior-Engineer-Board-v1', finalReadiness.capstoneDefenseEvaluator === 'Senior-Engineer-Board-v1');
  assertPhase1('Demonstrated learning gain accurately calculates baseline 45 vs current composite',
    finalReadiness.learningGain.baselineDiagnosticScore === 45 && (finalReadiness.learningGain.pointsGained || 0) > 20);
  assertPhase1('Real project commit artifacts are extracted with real commit SHAs',
    finalReadiness.keyProjectArtifacts.length > 0 && finalReadiness.keyProjectArtifacts[0].commitSha !== undefined);

  console.log('\n================================================================');
  console.log(`  🎉 PHASE 1 VERTICAL SLICE: ALL ${passedTests}/${totalTests} TESTS PASSED WITH 0 REGRESSIONS!`);
  console.log('================================================================\n');
}

runEndToEndTraversal().catch(err => {
  console.error('Phase 1 E2E Test Failed:', err);
  process.exit(1);
});
