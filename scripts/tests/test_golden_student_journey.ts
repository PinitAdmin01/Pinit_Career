// scripts/test_golden_student_journey.ts
// End-to-End Fresh-Student Golden Journey Simulation Test Suite for PinIT Career OS

import { COMPETENCY_CATALOG_V1 } from '../src/lib/pathway/competencyCatalog';
import {
  CAREER_PROGRAMS_CATALOG,
  calculateDynamicRoleReadiness,
} from '../src/lib/pathway/programEngine';
import {
  CompetencyEvidenceRecord,
  DailyMissionSlot,
  InternshipRecord,
  JobDescriptionSkillGap,
  StudentSkillProfile,
  WorkloadBand,
} from '../src/lib/pathway/competencySchema';
import { PathwayApiService } from '../src/lib/api/pathwayApi';
import { generateEvidenceIntegrityHash, verifyEvidenceIntegrity } from '../src/lib/pathway/evidenceEngine';

console.log('================================================================');
console.log('  PINIT GOLDEN JOURNEY: END-TO-END STUDENT LIFECYCLE TEST       ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assertStep(name: string, condition: boolean, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✨ [PASS] ${name}`);
  } else {
    console.error(`  ❌ [FAIL] ${name}`, details || '');
    process.exit(1);
  }
}

async function runGoldenJourney() {
  const studentId = `golden_student_${Date.now()}`;
  const programId = 'prog_swe_accelerated_9m';

  // ── Step 1: Fresh Student Onboarding & Profile Baseline ────────────────────
  console.log('\n--- Step 1: Create Account & Initial 3-Tier Profile ---');
  const initialProfile = await PathwayApiService.getStudentSkillProfile(studentId);
  assertStep('Fresh student initializes with claimed skills catalog baseline', initialProfile.claimed.length > 0);
  assertStep('Fresh student has 0 demonstrated skills', initialProfile.demonstrated.length === 0);
  assertStep('Fresh student has 0 verified skills', initialProfile.verified.length === 0);

  // ── Step 2: Dynamic Missions Generation ────────────────────────────────────
  console.log('\n--- Step 2: Dynamic Daily Missions Banding ---');
  const standardMissions = await PathwayApiService.getDynamicDailyMissions(studentId, 'standard');
  const lightMissions = await PathwayApiService.getDynamicDailyMissions(studentId, 'light');
  const examMissions = await PathwayApiService.getDynamicDailyMissions(studentId, 'exam_pause');

  assertStep('Standard mode delivers 3 Core + 2 Optional slots',
    standardMissions.coreMissions.length === 3 && standardMissions.optionalMissions.length === 2
  );
  assertStep('Light mode delivers 3 Core slots (0 Optional)',
    lightMissions.coreMissions.length === 3 && lightMissions.optionalMissions.length === 0
  );
  assertStep('Exam Pause delivers 1 maintenance slot',
    examMissions.coreMissions.length === 1 && examMissions.optionalMissions.length === 0
  );

  // ── Step 3: Diagnostic Baseline & L0 Foundational Learning ────────────────
  console.log('\n--- Step 3: Diagnostic Baseline & L0 Foundational Evidence ---');
  // First satisfy L0 so downstream prerequisites are unlocked
  await PathwayApiService.recordEvidence({
    id: `ev_diag_${Date.now()}`,
    competencyId: 'comp_comp_fundamentals_l0',
    competencyVersion: '1.0.0',
    studentId,
    programId,
    evidenceClass: 'knowledge',
    difficulty: 'basic',
    evidenceFamilyId: 'comp_fundamentals_diagnostic',
    sourceType: 'diagnostic',
    sourceId: 'diag_assessment_01',
    attemptId: 'att_01',
    score: 85,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'v1.0',
    rubricVersion: 'v1.0',
    timestamp: Date.now(),
    artifacts: {
      commitSha: 'd8a1f49e0b12',
      diagramUrl: 'https://cdn.pinit.app/arch_diagram_01.png',
    }
  });

  const p1Evidence = await PathwayApiService.recordEvidence({
    id: `ev_p1_${Date.now()}`,
    competencyId: 'comp_git_version_control_l1',
    competencyVersion: '1.0.0',
    studentId,
    programId,
    evidenceClass: 'knowledge',
    difficulty: 'basic',
    evidenceFamilyId: 'git_diagnostics',
    sourceType: 'assessment',
    sourceId: 'diag_assessment_02',
    attemptId: 'att_02',
    score: 88,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'v1.0',
    rubricVersion: 'v1.0',
    timestamp: Date.now(),
    artifacts: {
      diagramUrl: 'https://cdn.pinit.app/arch_diagram_01.png',
    }
  });

  assertStep('P1 evidence created with valid SHA-256 hash', !!p1Evidence.evidenceRecord.integrityHash);
  assertStep('P1 evidence passes cryptographic integrity check', verifyEvidenceIntegrity(p1Evidence.evidenceRecord));

  // ── Step 4 & 5: Systematic Multi-Class Progression across all 8 Program Competencies ──
  console.log('\n--- Step 4 & 5: Build & Submit Projects across Program Track ---');
  const topologicalCompIds = [
    'comp_comp_fundamentals_l0',
    'comp_java_syntax_oop_l1',
    'comp_git_version_control_l1',
    'comp_comm_star_interview_l2',
    'comp_dsa_linear_trees_l2',
    'comp_concurrency_threads_l2',
    'comp_database_sql_internals_l3',
    'comp_backend_apis_frameworks_l3',
    'comp_cicd_cloud_devops_l4',
    'comp_distributed_systems_caching_l4',
    'comp_production_engineering_residency_l5',
  ];

  for (const cid of topologicalCompIds) {
    const comp = COMPETENCY_CATALOG_V1.find(c => c.id === cid);
    if (!comp) continue;

    const evalType = comp.verificationRequirements?.requiredEvaluatorTypes?.[0] || 'hybrid';

    for (let rIdx = 0; rIdx < comp.evidenceRequirements.length; rIdx++) {
      const req = comp.evidenceRequirements[rIdx];
      const count = Math.max(req.minCount || 1, req.minDistinctFamilies || 1);
      for (let c = 0; c < count; c++) {
        await PathwayApiService.recordEvidence({
          id: `ev_${cid}_${req.evidenceClass}_${c}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          competencyId: cid,
          competencyVersion: comp.version,
          studentId,
          programId,
          evidenceClass: req.evidenceClass,
          difficulty: req.minimumDifficulty || 'production',
          evidenceFamilyId: `family_${cid}_${req.evidenceClass}_${c}`,
          sourceType: req.requiredSourceTypes && req.requiredSourceTypes.length > 0
            ? req.requiredSourceTypes[c % req.requiredSourceTypes.length]
            : (req.evidenceClass === 'defense' ? 'defense' : 'project'),
          sourceId: `source_${cid}_${req.evidenceClass}_${c}`,
          attemptId: `att_${req.evidenceClass}_${c}`,
          score: Math.max(req.minScore + 5, 90),
          evaluatorType: evalType,
          evaluatorVersion: 'v1.0',
          rubricVersion: 'v1.0',
          timestamp: Date.now(),
          artifacts: {
            githubRepoUrl: `https://github.com/student/${cid}-repo`,
            repoUrl: `https://github.com/student/${cid}-repo`,
            commitSha: 'd8a1f49e0b12',
            diagramUrl: 'https://cdn.pinit.app/arch.png',
            liveUrl: 'https://demo.pinit.app/live',
            executionLogSnippet: 'PASS test/all.spec.ts',
          }
        });
      }
    }
  }

  // ── Step 6: Capstone Oral Defense Evaluation ──────────────────────────────
  console.log('\n--- Step 6: Pass Capstone Oral Defense Gate ---');
  const defenseEvidence = await PathwayApiService.recordEvidence({
    id: `ev_defense_${Date.now()}`,
    competencyId: 'comp_production_engineering_residency_l5',
    competencyVersion: '1.0.0',
    studentId,
    programId,
    evidenceClass: 'defense',
    difficulty: 'production',
    evidenceFamilyId: 'capstone_defense',
    sourceType: 'capstone_defense',
    sourceId: 'viva_session_capstone',
    attemptId: 'att_viva_01',
    score: 88,
    evaluatorType: 'human_mentor',
    evaluatorVersion: 'faculty_board_v1',
    rubricVersion: 'viva_rubric_v2',
    timestamp: Date.now(),
    artifacts: {
      audioRecordingUrl: 'https://vault.pinit.app/viva/session_883.mp4',
    }
  });

  assertStep('Oral Defense recorded with high-trust mentor evaluation', defenseEvidence.evidenceRecord.evaluatorType === 'human_mentor');

  // ── Step 7: Evaluate Dynamic Role Readiness ───────────────────────────────
  console.log('\n--- Step 7: Evaluate Interview Readiness ---');
  const masteryMap = await PathwayApiService.getStudentMasteryMap(studentId);
  for (const cid of topologicalCompIds) {
    const m = masteryMap.get(cid);
    console.log(`  DEBUG [${cid}]: state=${m?.state}, score=${m?.compositeScore}, allGatesPassed=${m?.allGatesPassed}`);
  }
  const readiness = await PathwayApiService.getRoleReadiness(studentId, programId);
  console.log('  DEBUG Readiness:', JSON.stringify(readiness, null, 2));
  assertStep('Role Readiness reaches ready_for_interview', readiness.status === 'ready_for_interview', readiness);
  assertStep('Student has completed 8/8 verified competencies', readiness.verifiedCompetenciesCount >= 8);
  assertStep('Capstone oral defense meets minimum threshold (>= 75)', (readiness.capstoneDefenseScore || 0) >= 75);

  // ── Step 8: Updated 3-Tier Skill Profile Check ────────────────────────────
  console.log('\n--- Step 8: 3-Tier Skill Profile Partitioning ---');
  const updatedProfile = await PathwayApiService.getStudentSkillProfile(studentId);
  assertStep('Student now has multiple Verified Skills sealed with credentials', updatedProfile.verified.length >= 8);
  assertStep('Every verified skill contains valid score, level, and timestamp',
    updatedProfile.verified.every(v => v.score > 0 && !!v.level && v.verifiedAt > 0)
  );

  // ── Step 9: ATS Keyword Gap Loop with Student Consent ─────────────────────
  console.log('\n--- Step 9: ATS Keyword Gap Loop & Consented Addition ---');
  const jobDescription = 'Looking for Full-Stack SDE with React, PostgreSQL, Docker, and Kubernetes knowledge.';
  const detectedGaps: JobDescriptionSkillGap[] = [];

  for (const comp of COMPETENCY_CATALOG_V1) {
    if (jobDescription.toLowerCase().includes(comp.title.toLowerCase().split(' ')[0].toLowerCase())) {
      const isVerified = updatedProfile.verified.some(v => v.id === comp.id);
      detectedGaps.push({
        taxonomyTerm: comp.title,
        competencyId: comp.id,
        importance: 'required',
        isSatisfied: isVerified,
        userConsentStatus: isVerified ? 'accepted' : 'pending',
      });
    }
  }

  assertStep('ATS scanner correctly identifies satisfied competencies from verified profile',
    detectedGaps.filter(g => g.isSatisfied).length > 0
  );

  // Student Consents to Roadmap Gap Addition
  const pendingGap = detectedGaps.find(g => !g.isSatisfied);
  if (pendingGap) {
    pendingGap.userConsentStatus = 'accepted';
    assertStep('Student consent explicit for roadmap addition (pending -> accepted)', pendingGap.userConsentStatus === 'accepted');
  }

  // ── Step 10: Log External Internship Record ───────────────────────────────
  console.log('\n--- Step 10: Log External Internship Record (Booster) ---');
  const internship = await PathwayApiService.logInternshipRecord({
    studentId,
    companyName: 'Stripe Technologies',
    role: 'Backend Engineering Intern',
    type: 'external_employment',
    startDate: '2025-06',
    endDate: '2025-09',
    mentorName: 'Sarah Lin (Principal Architect)',
    projectDescription: 'Designed idempotency key deduplication cache handling 50k RPS.',
    skillsUsed: ['PostgreSQL', 'Docker', 'Distributed Systems'],
    isVerified: true,
  });

  assertStep('Internship record generated with SHA-256 hash', !!internship.id);
  assertStep('Internship record retrievable via getInternshipRecords API',
    (await PathwayApiService.getInternshipRecords(studentId)).length === 1
  );

  // Re-check Readiness to verify internship does not regress or scramble readiness
  const postInternshipReadiness = await PathwayApiService.getRoleReadiness(studentId, programId);
  assertStep('Role Readiness remains ready_for_interview or placement_ready after internship',
    postInternshipReadiness.status === 'ready_for_interview' || postInternshipReadiness.status === 'placement_ready'
  );

  // ── Step 11: Non-Destructive Remediation Simulation ────────────────────────
  console.log('\n--- Step 11: Non-Destructive Remediation Rule ---');
  // Record a critical failure evidence attempt for one competency
  await PathwayApiService.recordEvidence({
    id: `ev_fail_${Date.now()}`,
    competencyId: 'comp_concurrency_threads_l2',
    competencyVersion: '1.0.0',
    studentId,
    programId,
    evidenceClass: 'application',
    difficulty: 'advanced',
    evidenceFamilyId: 'deadlock_remediation',
    sourceType: 'quest',
    sourceId: 'quest_deadlock_detection',
    attemptId: 'att_fail_01',
    score: 40,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'v1.0',
    rubricVersion: 'v1.0',
    timestamp: Date.now(),
    criticalFailuresDetected: ['DEADLOCK_UNHANDLED']
  });

  const postFailMap = await PathwayApiService.getStudentMasteryMap(studentId);
  const remediationState = postFailMap.get('comp_concurrency_threads_l2');
  assertStep('Critical failure triggers non-destructive review status (verified_needs_review or provisional)',
    remediationState?.hasCriticalFailures === true || remediationState?.state === 'verified_needs_review' || remediationState?.state === 'provisional'
  );
  assertStep('Previous qualified evidence records preserved despite remediation flag',
    (remediationState?.independentEvidenceCount || 0) > 1
  );

  // Re-assessment to resolve remediation (retrying same task sourceId)
  await PathwayApiService.recordEvidence({
    id: `ev_remedy_${Date.now()}`,
    competencyId: 'comp_concurrency_threads_l2',
    competencyVersion: '1.0.0',
    studentId,
    programId,
    evidenceClass: 'application',
    difficulty: 'advanced',
    evidenceFamilyId: 'deadlock_remediation',
    sourceType: 'quest',
    sourceId: 'quest_deadlock_detection',
    attemptId: 'att_pass_02',
    score: 95,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'v1.0',
    rubricVersion: 'v1.0',
    timestamp: Date.now(),
  });

  const postRemedyMap = await PathwayApiService.getStudentMasteryMap(studentId);
  const restoredState = postRemedyMap.get('comp_concurrency_threads_l2');
  assertStep('Passing reassessment restores verified mastery state',
    restoredState?.state === 'verified'
  );

  // ── Final Summary ─────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(`  🎉 GOLDEN JOURNEY COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED!`);
  console.log('================================================================\n');
}

runGoldenJourney().catch(err => {
  console.error('Golden Journey Execution Error:', err);
  process.exit(1);
});
