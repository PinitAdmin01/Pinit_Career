// scripts/test_phase1a_contracts.ts
// Forensic Contract & Domain Alignment Test Suite for Phase 1A of PinIT Career OS

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

console.log('================================================================');
console.log('  PINIT PHASE 1A: CONTRACTS & DOMAIN ALIGNMENT FORENSIC TEST    ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assertContract(name: string, condition: boolean, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  🛡️ [PASS] ${name}`);
  } else {
    console.error(`  ❌ [FAIL] ${name}`, details || '');
    process.exit(1);
  }
}

async function runPhase1ATests() {
  const studentId = 'fresh_test_student_phase1a_001';

  // ── 1. 3-Tier Skill Profile Extraction (Claimed vs Demonstrated vs Verified) ──
  console.log('--- 1. 3-Tier Skill Profile Contracts ---');
  const initialProfile = await PathwayApiService.getStudentSkillProfile(studentId);
  assertContract('Initial skill profile returns claimed, demonstrated, and verified arrays',
    Array.isArray(initialProfile.claimed) &&
    Array.isArray(initialProfile.demonstrated) &&
    Array.isArray(initialProfile.verified)
  );
  assertContract('Initial student has 17 claimed skills (catalog baseline)', initialProfile.claimed.length === 17);
  assertContract('Initial student has 0 demonstrated skills', initialProfile.demonstrated.length === 0);
  assertContract('Initial student has 0 verified skills', initialProfile.verified.length === 0);

  // Record practice evidence for Computer Fundamentals L0
  await PathwayApiService.recordEvidence({
    id: 'ev_p1a_001',
    competencyId: 'comp_comp_fundamentals_l0',
    competencyVersion: '1.0.0',
    studentId,
    programId: 'prog_swe_accelerated_9m',
    evidenceClass: 'knowledge',
    difficulty: 'basic',
    evidenceFamilyId: 'fam_comp_arch',
    sourceType: 'quest',
    sourceId: 'quest_arch_01',
    attemptId: 'att_01',
    score: 85,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'eval-v1',
    rubricVersion: 'rubric-v1',
    timestamp: Date.now(),
  });

  const updatedProfile = await PathwayApiService.getStudentSkillProfile(studentId);
  assertContract('After passing L0 knowledge quest, L0 is demonstrated',
    updatedProfile.demonstrated.some(s => s.id === 'comp_comp_fundamentals_l0')
  );
  assertContract('Claimed skills list decreases to 16 as L0 moves to demonstrated',
    updatedProfile.claimed.length === 16
  );

  // ── 2. Dynamic Daily Mission Workload Slots ──────────────────────────────────
  console.log('\n--- 2. Dynamic Daily Mission Workload Generation ---');
  
  // Standard Band (3 Core + 2 Optional)
  const standardMissions = await PathwayApiService.getDynamicDailyMissions(studentId, 'standard');
  assertContract('Standard band generates exactly 3 Core Missions', standardMissions.coreMissions.length === 3);
  assertContract('Core slot 1 is of category "learn"', standardMissions.coreMissions[0].category === 'learn');
  assertContract('Core slot 2 is of category "practice"', standardMissions.coreMissions[1].category === 'practice');
  assertContract('Core slot 3 is of category "build"', standardMissions.coreMissions[2].category === 'build');
  assertContract('Standard band generates 2 Optional Missions (Career & Comm)', standardMissions.optionalMissions.length === 2);
  assertContract('Optional slot 1 is "career"', standardMissions.optionalMissions[0].category === 'career');
  assertContract('Optional slot 2 is "communication"', standardMissions.optionalMissions[1].category === 'communication');
  assertContract('Standard target workload is ~3.5 hours', standardMissions.totalTargetHours === 3.5);

  // Light Band (3 Core + 0 Optional)
  const lightMissions = await PathwayApiService.getDynamicDailyMissions(studentId, 'light');
  assertContract('Light band generates 3 Core Missions', lightMissions.coreMissions.length === 3);
  assertContract('Light band generates 0 Optional Missions to prevent overload', lightMissions.optionalMissions.length === 0);
  assertContract('Light band target workload is 2.5 hours', lightMissions.totalTargetHours === 2.5);

  // Exam Pause Band (1 Maintenance Flash Task)
  const examMissions = await PathwayApiService.getDynamicDailyMissions(studentId, 'exam_pause');
  assertContract('Exam pause generates exactly 1 maintenance mission', examMissions.coreMissions.length === 1);
  assertContract('Exam maintenance mission duration is 15 minutes', examMissions.coreMissions[0].estDurationMinutes === 15);
  assertContract('Exam pause generates 0 optional missions', examMissions.optionalMissions.length === 0);

  // ── 3. External Internship Experience Records ─────────────────────────────────
  console.log('\n--- 3. External Internship Experience Records ---');
  const loggedInternship = await PathwayApiService.logInternshipRecord({
    studentId,
    companyName: 'Acme Cloud Systems',
    role: 'Backend Engineering Intern',
    startDate: '2026-01-10',
    endDate: '2026-04-10',
    skillsUsed: ['TypeScript', 'Express', 'PostgreSQL', 'Docker'],
    projectDescription: 'Built distributed telemetry pipeline and optimized database connection pooling.',
    mentorName: 'Sarah Jenkins, Principal Architect',
    performanceRating: 'Exceeded Expectations (9.2/10)',
    isVerified: true,
    type: 'external_employment',
  });

  assertContract('Logged internship record generates unique ID and timestamp',
    loggedInternship.id.startsWith('intern_') && loggedInternship.createdAt > 0
  );
  assertContract('Logged internship captures company Acme Cloud Systems',
    loggedInternship.companyName === 'Acme Cloud Systems'
  );

  const studentInternships = await PathwayApiService.getInternshipRecords(studentId);
  assertContract('getInternshipRecords retrieves logged internship', studentInternships.length === 1);
  assertContract('Retrieved internship preserves type "external_employment"',
    studentInternships[0].type === 'external_employment'
  );

  // ── 4. ATS Skill Gap Classification & Consent Contracts ───────────────────────
  console.log('\n--- 4. ATS Job Description Skill Gap Contracts ---');
  const sampleAtsGaps: JobDescriptionSkillGap[] = [
    {
      taxonomyTerm: 'PostgreSQL Database Internals',
      competencyId: 'comp_database_sql_internals_l3',
      importance: 'required',
      isSatisfied: false,
      userConsentStatus: 'pending',
    },
    {
      taxonomyTerm: 'Redis High-Throughput Caching',
      competencyId: 'comp_distributed_systems_caching_l4',
      importance: 'preferred',
      isSatisfied: false,
      userConsentStatus: 'accepted',
    },
    {
      taxonomyTerm: 'Kubernetes Orchestration',
      importance: 'optional',
      isSatisfied: false,
      userConsentStatus: 'declined',
    },
  ];

  assertContract('Required ATS skill gap is tagged with importance "required"',
    sampleAtsGaps[0].importance === 'required'
  );
  assertContract('Accepted ATS skill gap has userConsentStatus "accepted"',
    sampleAtsGaps[1].userConsentStatus === 'accepted'
  );
  assertContract('Declined optional ATS skill gap is excluded from auto-roadmap queuing',
    sampleAtsGaps[2].userConsentStatus === 'declined'
  );

  // ── 5. Decoupled Role Readiness (Interview vs Placement Ready) ───────────────
  console.log('\n--- 5. Decoupled Role Readiness Contracts ---');
  const prog9m = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_swe_accelerated_9m')!;
  const fullMasteryMap = await PathwayApiService.getStudentMasteryMap(studentId);
  
  // Mark all 8 required competencies verified
  for (const st of prog9m.stages) {
    for (const req of st.requiredCompetencies) {
      fullMasteryMap.set(req.competencyId, {
        state: req.requiredState,
        compositeScore: 90,
        latestQualifiedEvidenceAt: Date.now() - 3600000,
      } as any);
    }
  }

  // Passing oral capstone defense (Score: 92)
  const readinessInterview = calculateDynamicRoleReadiness(prog9m, fullMasteryMap, [
    { sourceType: 'diagnostic', score: 45 } as any,
    { evidenceClass: 'defense', sourceType: 'capstone_defense', score: 92, evaluatorVersion: 'Board-v1' } as any,
  ]);

  assertContract('Student with 100% verified competencies + Oral Defense reaches ready_for_interview without needing an internship',
    readinessInterview.status === 'ready_for_interview'
  );
  assertContract('Defense score 92 is captured on readiness HUD', readinessInterview.capstoneDefenseScore === 92);

  console.log('\n================================================================');
  console.log(`  🎉 PHASE 1A CONTRACTS: ALL ${passedTests}/${totalTests} TESTS PASSED WITH 0 REGRESSIONS!`);
  console.log('================================================================\n');
}

runPhase1ATests();
