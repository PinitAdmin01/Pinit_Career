// apps/web/src/lib/pathway/programEngine.ts
// Program Engine: Multi-Semester Career Tracks, Stage Gate Evaluation & Graduation Verification

import {
  CareerProgram,
  CompetencyEvidenceRecord,
  CompetencyMasteryStatus,
  DynamicRoleReadiness,
  ProgramStage,
} from './competencySchema';

export interface StageProgressionResult {
  currentStageId: string;
  isStageCompleted: boolean;
  canAdvanceToNextStage: boolean;
  nextStageId?: string;
  stageProgressPct: number;
  totalRequiredCompetencies: number;
  passedRequiredCompetencies: number;
  unmetStageCompetencies: {
    competencyId: string;
    requiredState: 'demonstrated' | 'verified';
    currentState: string;
    minScore: number;
    currentScore: number;
  }[];
}

export interface GraduationEvaluationResult {
  programId: string;
  isGraduated: boolean;
  demonstratedPct: number;
  verifiedPct: number;
  capstonePassed: boolean;
  residencyCompleted: boolean;
  hasCriticalFailures: boolean;
  missingRequirements: string[];
}

// ── 1. Authoritative Career Programs Catalog ─────────────────────────────────
export const CAREER_PROGRAMS_CATALOG: CareerProgram[] = [
  // ── 1A. FLAGSHIP PILOT: 9-Month Final-Year Accelerated SWE Placement Track ──
  {
    id: 'prog_swe_accelerated_9m',
    title: '9-Month Final-Year Accelerated Software Engineering & Residency',
    targetRole: 'Full-Stack Software Engineer',
    cohortTarget: 'final_year',
    recommendedDurationMonths: {
      accelerated: 9,
      standard: 9,
      extended: 12,
    },
    hasIndustryResidency: true,
    residencyConfig: {
      durationWeeks: 12,
      ticketPoolId: 'pool_fullstack_swe_tickets',
      incidentPoolId: 'pool_swe_oncall_incidents',
      requireOralDefense: true,
      minDefenseScore: 75,
      reviewPolicy: 'automated_pre_screen_with_human_mentor',
    },
    graduationRequirements: {
      minDemonstratedCompetencyPct: 85,
      minVerifiedCompetencyPct: 75,
      requireCapstoneDefense: true,
      requireResidencyCompletion: true,
      disallowActiveCriticalFailures: true,
    },
    stages: [
      {
        id: 'sem_1_swe_9m_core',
        title: 'Semester 1 (Months 1-6): Core Full-Stack Systems, Concurrency & DSA Progression',
        durationMonths: 6,
        stageLevel: 'L3',
        courseModuleIds: ['course-java', 'course-dsa', 'course-database', 'course-fullstack'],
        milestoneCredentialId: 'cert_swe_fasttrack_core_l3',
        problemSolvingThread: {
          topic: 'Applied Algorithmic Complexity & Data Structures',
          focusAreas: ['Arrays & Hash Maps', 'Trees & Graphs', 'SQL Index Traversal', 'Concurrency Thread Pools'],
          weeklyHours: 2.5,
        },
        requiredCompetencies: [
          { competencyId: 'comp_git_version_control_l1', requiredState: 'verified', minScore: 75 },
          { competencyId: 'comp_dsa_linear_trees_l2', requiredState: 'demonstrated', minScore: 75 },
          { competencyId: 'comp_concurrency_threads_l2', requiredState: 'demonstrated', minScore: 75 },
          { competencyId: 'comp_database_sql_internals_l3', requiredState: 'demonstrated', minScore: 75 },
          { competencyId: 'comp_backend_apis_frameworks_l3', requiredState: 'verified', minScore: 80 },
        ],
      },
      {
        id: 'sem_2_swe_9m_residency',
        title: 'Semester 2 (Months 7-9 / 12 Weeks): Industry Simulation Residency & Oral Capstone',
        durationMonths: 3,
        stageLevel: 'L5',
        courseModuleIds: ['course-distributed', 'course-devops', 'course-soft-skills'],
        milestoneCredentialId: 'cert_swe_certified_professional_l5',
        residencyConfig: {
          durationWeeks: 12,
          ticketPoolId: 'pool_fullstack_swe_tickets',
          incidentPoolId: 'pool_swe_oncall_incidents',
          requireOralDefense: true,
          minDefenseScore: 75,
          reviewPolicy: 'automated_pre_screen_with_human_mentor',
        },
        requiredCompetencies: [
          { competencyId: 'comp_cicd_cloud_devops_l4', requiredState: 'verified', minScore: 80 },
          { competencyId: 'comp_comm_star_interview_l2', requiredState: 'verified', minScore: 80 },
          { competencyId: 'comp_production_engineering_residency_l5', requiredState: 'verified', minScore: 80 },
        ],
      },
    ],
  },

  // ── 1B. 12-Month Final-Year Standard Track ──
  {
    id: 'prog_swe_standard_12m',
    title: '12-Month Final-Year Standard Software Engineering & Residency',
    targetRole: 'Full-Stack Software Engineer',
    cohortTarget: 'final_year',
    recommendedDurationMonths: {
      accelerated: 10,
      standard: 12,
      extended: 15,
    },
    hasIndustryResidency: true,
    graduationRequirements: {
      minDemonstratedCompetencyPct: 90,
      minVerifiedCompetencyPct: 75,
      requireCapstoneDefense: true,
      requireResidencyCompletion: true,
      disallowActiveCriticalFailures: true,
    },
    stages: [
      {
        id: 'sem_1_swe_12m_foundations',
        title: 'Semester 1 (Months 1-5): Universal Foundations, DSA & Concurrency',
        durationMonths: 5,
        stageLevel: 'L2',
        courseModuleIds: ['course-1', 'course-2', 'course-3', 'course-4'],
        milestoneCredentialId: 'cert_swe_foundations_l2',
        requiredCompetencies: [
          { competencyId: 'comp_comp_fundamentals_l0', requiredState: 'demonstrated', minScore: 70 },
          { competencyId: 'comp_git_version_control_l1', requiredState: 'verified', minScore: 75 },
          { competencyId: 'comp_java_syntax_oop_l1', requiredState: 'demonstrated', minScore: 75 },
          { competencyId: 'comp_dsa_linear_trees_l2', requiredState: 'demonstrated', minScore: 75 },
        ],
      },
      {
        id: 'sem_2_swe_12m_systems',
        title: 'Semester 2 (Months 6-9): Backend Frameworks, SQL Internals & CI/CD',
        durationMonths: 4,
        stageLevel: 'L4',
        courseModuleIds: ['course-5', 'course-6', 'course-7'],
        milestoneCredentialId: 'cert_swe_specialization_l3',
        requiredCompetencies: [
          { competencyId: 'comp_concurrency_threads_l2', requiredState: 'demonstrated', minScore: 75 },
          { competencyId: 'comp_database_sql_internals_l3', requiredState: 'demonstrated', minScore: 75 },
          { competencyId: 'comp_backend_apis_frameworks_l3', requiredState: 'verified', minScore: 80 },
          { competencyId: 'comp_cicd_cloud_devops_l4', requiredState: 'verified', minScore: 80 },
        ],
      },
      {
        id: 'sem_3_swe_12m_residency',
        title: 'Semester 3 (Months 10-12 / 12 Weeks): 12-Week Industry Simulation Residency & Capstone',
        durationMonths: 3,
        stageLevel: 'L5',
        courseModuleIds: ['course-8', 'course-9'],
        milestoneCredentialId: 'cert_swe_certified_professional_l5',
        requiredCompetencies: [
          { competencyId: 'comp_production_engineering_residency_l5', requiredState: 'verified', minScore: 80 },
          { competencyId: 'comp_comm_star_interview_l2', requiredState: 'verified', minScore: 80 },
        ],
      },
    ],
  },

  // ── 1C. PRE-FINAL YEAR TRACK: 24-Month Comprehensive SWE Fellowship (4 Semesters) ──
  {
    id: 'prog_software_engineering',
    title: '24-Month Pre-Final Software Engineering Fellowship & Residency',
    targetRole: 'Full-Stack Software Engineer (Pre-Final Comprehensive)',
    cohortTarget: 'pre_final_year',
    recommendedDurationMonths: {
      accelerated: 18,
      standard: 24,
      extended: 24,
    },
    hasIndustryResidency: true,
    graduationRequirements: {
      minDemonstratedCompetencyPct: 90,
      minVerifiedCompetencyPct: 75,
      requireCapstoneDefense: true,
      requireResidencyCompletion: true,
      disallowActiveCriticalFailures: true,
    },
    stages: [
      {
        id: 'sem_1_swe_foundations',
        title: 'Semester 1: Universal Foundations & Core Syntax',
        durationMonths: 4,
        stageLevel: 'L1',
        courseModuleIds: ['course-1', 'course-2', 'course-3'],
        milestoneCredentialId: 'cert_swe_foundations_l1',
        requiredCompetencies: [
          { competencyId: 'comp_comp_fundamentals_l0', requiredState: 'demonstrated', minScore: 70 },
          { competencyId: 'comp_git_version_control_l1', requiredState: 'verified', minScore: 75 },
          { competencyId: 'comp_java_syntax_oop_l1', requiredState: 'demonstrated', minScore: 75 },
        ],
      },
      {
        id: 'sem_2_swe_core_engineering',
        title: 'Semester 2: Data Structures, Concurrency & Backend Services',
        durationMonths: 5,
        stageLevel: 'L2',
        courseModuleIds: ['course-4', 'course-5', 'course-6'],
        milestoneCredentialId: 'cert_swe_core_readiness_l2',
        requiredCompetencies: [
          { competencyId: 'comp_dsa_linear_trees_l2', requiredState: 'demonstrated', minScore: 75 },
          { competencyId: 'comp_concurrency_threads_l2', requiredState: 'demonstrated', minScore: 75 },
          { competencyId: 'comp_database_sql_internals_l3', requiredState: 'demonstrated', minScore: 75 },
          { competencyId: 'comp_backend_apis_frameworks_l3', requiredState: 'verified', minScore: 80 },
        ],
      },
      {
        id: 'sem_3_swe_distributed_systems',
        title: 'Semester 3: Distributed Architecture, Cloud & CI/CD',
        durationMonths: 5,
        stageLevel: 'L3',
        courseModuleIds: ['course-7', 'course-8', 'course-9'],
        milestoneCredentialId: 'cert_swe_specialization_l3',
        requiredCompetencies: [
          { competencyId: 'comp_distributed_systems_caching_l4', requiredState: 'verified', minScore: 75 },
          { competencyId: 'comp_cicd_cloud_devops_l4', requiredState: 'verified', minScore: 80 },
          { competencyId: 'comp_comm_star_interview_l2', requiredState: 'verified', minScore: 80 },
        ],
      },
      {
        id: 'sem_4_swe_industry_residency',
        title: 'Semester 4: 12-Week Industry Residency, Advanced Specialization & Junior Mentoring',
        durationMonths: 6,
        stageLevel: 'L5',
        courseModuleIds: ['course-10', 'course-11'],
        milestoneCredentialId: 'cert_swe_certified_professional_l5',
        requiredCompetencies: [
          { competencyId: 'comp_production_engineering_residency_l5', requiredState: 'verified', minScore: 80 },
        ],
      },
    ],
  },

  // ── 2. Data Analytics & Business Intelligence ──
  {
    id: 'prog_data_analytics',
    title: 'Data Analytics & Business Intelligence Fellowship',
    targetRole: 'Data & BI Analyst',
    cohortTarget: 'general',
    recommendedDurationMonths: {
      accelerated: 9,
      standard: 12,
      extended: 18,
    },
    hasIndustryResidency: true,
    graduationRequirements: {
      minDemonstratedCompetencyPct: 85,
      minVerifiedCompetencyPct: 70,
      requireCapstoneDefense: true,
      requireResidencyCompletion: true,
      disallowActiveCriticalFailures: true,
    },
    stages: [
      {
        id: 'sem_1_data_foundations',
        title: 'Semester 1: Quantitative Logic & Spreadsheet Modeling',
        durationMonths: 4,
        stageLevel: 'L1',
        courseModuleIds: ['course-12', 'course-13'],
        milestoneCredentialId: 'cert_data_foundations_l1',
        requiredCompetencies: [
          { competencyId: 'comp_comp_fundamentals_l0', requiredState: 'demonstrated', minScore: 70 },
          { competencyId: 'comp_data_spreadsheets_quant_l1', requiredState: 'demonstrated', minScore: 75 },
        ],
      },
      {
        id: 'sem_2_data_sql_analytics',
        title: 'Semester 2: SQL Window Functions & Statistical Analytics',
        durationMonths: 4,
        stageLevel: 'L2',
        courseModuleIds: ['course-14', 'course-15'],
        milestoneCredentialId: 'cert_data_analyst_l2',
        requiredCompetencies: [
          { competencyId: 'comp_data_sql_analytics_l2', requiredState: 'demonstrated', minScore: 80 },
          { competencyId: 'comp_python_syntax_data_l1', requiredState: 'demonstrated', minScore: 75 },
        ],
      },
      {
        id: 'sem_3_data_bi_residency',
        title: 'Semester 3: BI Dashboards & Enterprise Analytics Residency',
        durationMonths: 4,
        stageLevel: 'L3',
        courseModuleIds: ['course-16'],
        milestoneCredentialId: 'cert_data_bi_pro_l3',
        requiredCompetencies: [
          { competencyId: 'comp_data_bi_dashboards_l3', requiredState: 'verified', minScore: 80 },
          { competencyId: 'comp_comm_star_interview_l2', requiredState: 'verified', minScore: 80 },
        ],
      },
    ],
  },
];

// ── 2. Stage Progression Evaluation ──────────────────────────────────────────
/**
 * Evaluates whether a student satisfies all competency gates to advance through a program stage.
 */
export function evaluateStageProgression(
  stage: ProgramStage,
  nextStage: ProgramStage | undefined,
  masteryMap: Map<string, CompetencyMasteryStatus>
): StageProgressionResult {
  const unmetCompetencies: StageProgressionResult['unmetStageCompetencies'] = [];
  let passedCount = 0;

  for (const req of stage.requiredCompetencies) {
    const status = masteryMap.get(req.competencyId);
    const currentState = status?.state || 'locked';
    const currentScore = status?.compositeScore || 0;

    const isStateSatisfied = req.requiredState === 'verified'
      ? (currentState === 'verified' || currentState === 'verified_needs_review')
      : (currentState === 'demonstrated' || currentState === 'verified' || currentState === 'verified_needs_review');

    const isScoreSatisfied = currentScore >= req.minScore;

    if (isStateSatisfied && isScoreSatisfied) {
      passedCount++;
    } else {
      unmetCompetencies.push({
        competencyId: req.competencyId,
        requiredState: req.requiredState,
        currentState,
        minScore: req.minScore,
        currentScore,
      });
    }
  }

  const totalRequired = stage.requiredCompetencies.length;
  const isStageCompleted = totalRequired > 0 && passedCount === totalRequired;
  const stageProgressPct = totalRequired > 0 ? Math.round((passedCount / totalRequired) * 100) : 100;

  return {
    currentStageId: stage.id,
    isStageCompleted,
    canAdvanceToNextStage: isStageCompleted && nextStage !== undefined,
    nextStageId: isStageCompleted ? nextStage?.id : undefined,
    stageProgressPct,
    totalRequiredCompetencies: totalRequired,
    passedRequiredCompetencies: passedCount,
    unmetStageCompetencies: unmetCompetencies,
  };
}

// ── 3. Program Graduation Evaluation ──────────────────────────────────────────
/**
 * Evaluates a student's full competency ledger against program graduation requirements.
 */
export function evaluateProgramGraduation(
  program: CareerProgram,
  masteryMap: Map<string, CompetencyMasteryStatus>,
  capstonePassed: boolean,
  residencyCompleted: boolean
): GraduationEvaluationResult {
  const allRequiredCompIds: string[] = Array.from(
    new Set(program.stages.flatMap((s: ProgramStage) => s.requiredCompetencies.map((r: { competencyId: string }) => r.competencyId)))
  );

  let demonstratedCount = 0;
  let verifiedCount = 0;
  let hasCriticalFailures = false;
  const missingRequirements: string[] = [];

  for (const compId of allRequiredCompIds) {
    const status = masteryMap.get(compId);
    const state = status?.state || 'locked';

    if (status?.hasCriticalFailures) {
      hasCriticalFailures = true;
    }

    if (state === 'demonstrated' || state === 'verified' || state === 'verified_needs_review') {
      demonstratedCount++;
    }
    if (state === 'verified' || state === 'verified_needs_review') {
      verifiedCount++;
    }
  }

  const totalComps = allRequiredCompIds.length;
  const demonstratedPct = totalComps > 0 ? Math.round((demonstratedCount / totalComps) * 100) : 0;
  const verifiedPct = totalComps > 0 ? Math.round((verifiedCount / totalComps) * 100) : 0;

  // Check against Graduation Requirements
  const reqs = program.graduationRequirements;
  if (demonstratedPct < reqs.minDemonstratedCompetencyPct) {
    missingRequirements.push(`Demonstrated competency ${demonstratedPct}% below required ${reqs.minDemonstratedCompetencyPct}%`);
  }
  if (verifiedPct < reqs.minVerifiedCompetencyPct) {
    missingRequirements.push(`Verified competency ${verifiedPct}% below required ${reqs.minVerifiedCompetencyPct}%`);
  }
  if (reqs.requireCapstoneDefense && !capstonePassed) {
    missingRequirements.push('Oral Capstone Defense before Avatar Board is incomplete');
  }
  if (reqs.requireResidencyCompletion && !residencyCompleted) {
    missingRequirements.push('12-Week Industry Simulation & Residency is incomplete');
  }
  if (reqs.disallowActiveCriticalFailures && hasCriticalFailures) {
    missingRequirements.push('Active unresolved critical failures present in evidence ledger');
  }

  const isGraduated = missingRequirements.length === 0;

  return {
    programId: program.id,
    isGraduated,
    demonstratedPct,
    verifiedPct,
    capstonePassed,
    residencyCompleted,
    hasCriticalFailures,
    missingRequirements,
  };
}

// ── 4. Dynamic Role Readiness Calculator (Zero Fabrication) ──────────────────
/**
 * Computes live, defensible role readiness metrics strictly from real persisted evidence.
 * ZERO hardcoded/mock data.
 */
export function calculateDynamicRoleReadiness(
  program: CareerProgram,
  masteryMap: Map<string, CompetencyMasteryStatus>,
  evidenceRecords: CompetencyEvidenceRecord[] = []
): DynamicRoleReadiness {
  const requiredCompIds = new Set<string>();
  const allReqs: { competencyId: string; requiredState: 'demonstrated' | 'verified'; minScore: number }[] = [];

  for (const stage of program.stages) {
    for (const req of stage.requiredCompetencies) {
      requiredCompIds.add(req.competencyId);
      allReqs.push(req);
    }
  }

  const satisfiedCompIds = new Set<string>();
  let totalScore = 0;
  let latestTimestamp = 0;

  for (const req of allReqs) {
    const status = masteryMap.get(req.competencyId);
    if (status) {
      const currentState = status.state;
      const isStateSatisfied = req.requiredState === 'verified'
        ? (currentState === 'verified' || currentState === 'verified_needs_review')
        : (currentState === 'demonstrated' || currentState === 'verified' || currentState === 'verified_needs_review');

      const isScoreSatisfied = (status.compositeScore || 0) >= req.minScore;
      if (isStateSatisfied && isScoreSatisfied) {
        satisfiedCompIds.add(req.competencyId);
      }

      totalScore += status.compositeScore || 0;
      if (status.latestQualifiedEvidenceAt > latestTimestamp) {
        latestTimestamp = status.latestQualifiedEvidenceAt;
      }
    }
  }

  const verifiedCount = satisfiedCompIds.size;
  const currentAvgScore = requiredCompIds.size > 0 ? Math.round(totalScore / allReqs.length) : 0;
  const freshnessDays = latestTimestamp > 0
    ? Math.max(0, Math.floor((Date.now() - latestTimestamp) / (1000 * 60 * 60 * 24)))
    : 0;

  // Real Diagnostic Baseline
  const diagnosticRecord = evidenceRecords.find(r => r.sourceType === 'diagnostic');
  const baselineScore = diagnosticRecord ? diagnosticRecord.score : undefined;
  const pointsGained = baselineScore !== undefined ? Math.round(currentAvgScore - baselineScore) : undefined;

  // Real Oral Capstone Defense (prefer latest capstone defense record)
  const defenseRecord = evidenceRecords
    .slice()
    .reverse()
    .find(
      r => r.evidenceClass === 'defense' && (
        r.sourceType === 'capstone_defense' ||
        r.sourceType === 'capstone' ||
        r.difficulty === 'production'
      )
    );

  let status: DynamicRoleReadiness['status'] = 'exploring';
  if (verifiedCount === requiredCompIds.size && defenseRecord && defenseRecord.score >= 75) {
    status = 'ready_for_interview';
  } else if (verifiedCount >= Math.ceil(requiredCompIds.size * 0.7)) {
    status = 'ready_for_internship';
  } else if (evidenceRecords.length > 0) {
    status = 'in_progress';
  }

  const keyArtifacts = evidenceRecords
    .filter(r => r.artifacts?.commitSha)
    .slice(0, 3)
    .map(r => ({
      title: (r.sourceId || 'PROJECT_ARTIFACT').replace(/_/g, ' ').toUpperCase(),
      commitSha: r.artifacts?.commitSha,
      repoUrl: r.artifacts?.repoUrl,
      liveUrl: r.artifacts?.liveUrl,
    }));

  return {
    targetRole: program.targetRole,
    status,
    verifiedCompetenciesCount: verifiedCount,
    totalRequiredCompetenciesCount: requiredCompIds.size,
    assessmentFreshnessDays: freshnessDays,
    capstoneDefenseScore: defenseRecord?.score,
    capstoneDefenseEvaluator: defenseRecord?.evaluatorVersion,
    learningGain: {
      baselineDiagnosticScore: baselineScore,
      currentCompositeScore: currentAvgScore,
      pointsGained,
    },
    keyProjectArtifacts: keyArtifacts,
  };
}

