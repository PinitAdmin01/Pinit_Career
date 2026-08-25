// apps/web/src/lib/pathway/competencySchema.ts
// Strict TypeScript types for PinIT Competency-First Program Engine

export type CompetencyDomain = 'tech' | 'data' | 'design' | 'business' | 'communication' | 'ai';

export type CompetencyLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export const LEVEL_RANK: Record<CompetencyLevel, number> = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4,
  L5: 5,
} as const;

export type EvidenceClass = 
  | 'knowledge'      // Quests, conceptual quizzes
  | 'application'    // Code sandbox, missions, unit tests
  | 'debugging'      // Bug Lab forensic debugging
  | 'architecture'   // System Design Whiteboard
  | 'production'     // Verified GitHub repositories, CI/CD, live deployment
  | 'defense';       // Live oral defense before VRoid Avatar review board

export type EvidenceDifficulty = 'basic' | 'intermediate' | 'advanced' | 'production';

export const DIFFICULTY_RANK: Record<EvidenceDifficulty, number> = {
  basic: 1,
  intermediate: 2,
  advanced: 3,
  production: 4,
} as const;

export type MasteryState = 
  | 'locked'                 // Prerequisites unmet
  | 'diagnostic'             // L0 prior knowledge evaluation
  | 'learning'               // Engaging in L1/L2 knowledge quests
  | 'practice'               // Solving application missions
  | 'provisional'            // Met knowledge threshold, pending debugging/project gates
  | 'demonstrated'           // Passed all evidence gates and difficulty thresholds
  | 'verified'               // Provenance validated (GitHub commit SHA / mentor review / defense)
  | 'verified_needs_review'; // Verified credential intact, but FSRS recall triggered review recommendation

export type EvaluatorType = 'deterministic' | 'ai' | 'human_mentor' | 'hybrid' | 'rubric';

export type EvidenceSourceType =
  | 'quest'
  | 'mission'
  | 'bug_lab'
  | 'code_review'
  | 'project'
  | 'whiteboard'
  | 'capstone'
  | 'diagnostic'
  | 'capstone_defense';

// ── 1. Competency Definition ──────────────────────────────────────────────────
export interface CompetencyDefinition {
  id: string;                       // Unique slug e.g. 'comp_java_concurrency_l2'
  version: string;                  // SemVer e.g. '1.0.0'
  title: string;
  domain: CompetencyDomain;
  level: CompetencyLevel;
  description: string;
  prerequisites: string[];          // Hard prerequisite competency IDs
  recommendedPrerequisites?: string[];
  allowHigherLevelPrerequisite?: boolean; // Flag to allow exceptional cross-level dependencies
  
  // Anti-Gaming Gated Requirements
  evidenceRequirements: {
    evidenceClass: EvidenceClass;
    minScore: number;               // e.g. 75
    minCount: number;               // e.g. 2 distinct sources required
    minDistinctFamilies?: number;   // Distinct evidenceFamilyId count required
    minimumDifficulty: EvidenceDifficulty;
    requiredSourceTypes?: EvidenceSourceType[];
  }[];

  // Competency-Specific Verification Rules
  verificationRequirements?: {
    requiredArtifacts?: ('github_repo' | 'commit_sha' | 'whiteboard_diagram' | 'audio_recording' | 'live_url')[];
    requiredEvaluatorTypes?: EvaluatorType[];
    requireExternalProvenance?: boolean;
    minDefenseScore?: number;
  };

  // Class Weights for Composite Score (must sum to 1.0 within epsilon ±0.001)
  classWeights?: Partial<Record<EvidenceClass, number>>;

  criticalFailureRules?: {
    code: string;                   // e.g. 'RACE_CONDITION_UNHANDLED'
    description: string;
    blocksMastery: boolean;
  }[];
}

// ── 2. Evidence Record with Full Provenance ───────────────────────────────────
export interface CompetencyEvidenceRecord {
  id: string;
  competencyId: string;
  competencyVersion: string;
  studentId: string;
  programId: string;
  evidenceClass: EvidenceClass;
  difficulty: EvidenceDifficulty;
  evidenceFamilyId?: string;        // Grouping for diversity check (e.g. 'thread_deadlock')
  sourceType: EvidenceSourceType;
  sourceId: string;                 // Distinct source ID (e.g. 'quest_java_thread_pool')
  attemptId: string;
  score: number;                    // 0 - 100
  evaluatorType: EvaluatorType;
  evaluatorVersion: string;         // 'buglab-engine-1.3'
  rubricVersion: string;            // 'concurrency-rubric-v2'
  timestamp: number;
  integrityHash: string;            // Canonical SHA-256 serialization
  
  artifacts?: {
    githubRepoUrl?: string;
    repoUrl?: string;
    commitSha?: string;
    diagramUrl?: string;
    executionLogSnippet?: string;
    liveUrl?: string;
    audioRecordingUrl?: string;
  };
  criticalFailuresDetected?: string[];
}

// ── 3. Competency Mastery Engine Output ───────────────────────────────────────
export interface CompetencyMasteryStatus {
  competencyId: string;
  competencyVersion: string;
  masteryPolicyVersion: string;     // 'policy-v1.0.0'
  state: MasteryState;
  compositeScore: number;           // 0 - 100
  evidenceCoveragePct: number;      // 0 - 100%
  independentEvidenceCount: number; // Count of distinct sourceIds evaluated
  distinctFamilyCount: number;      // Count of distinct evidenceFamilyIds
  latestQualifiedEvidenceAt: number;
  nextReviewAt?: number;
  
  classBreakdown: Record<EvidenceClass, {
    averageScore: number;
    evidenceCount: number;
    highestDifficulty: EvidenceDifficulty;
    gateSatisfied: boolean;
  }>;
  
  allGatesPassed: boolean;
  hasCriticalFailures: boolean;
  blockedBy?: string[];             // e.g. ['comp_java_syntax_l1', 'Requires 1 Advanced Bug Lab']
  remediationQuestId?: string;       // Non-destructive remediation quest assigned when review needed
  remediationReason?: string;
  lastUpdated: number;
}

// ── 4. Project Complexity Hierarchy ──────────────────────────────────────────
export type ProjectLevel = 'P1_GUIDED' | 'P2_INDEPENDENT' | 'P3_PRODUCTION' | 'P4_SIMULATION' | 'P5_CAPSTONE';

// ── 5. Workload Bands & Dynamic Daily Mission Slots ──────────────────────────
export type WorkloadBand = 'standard' | 'light' | 'exam_pause' | 'catch_up';

export type DailyMissionActionCategory = 
  | 'learn' 
  | 'practice' 
  | 'build' 
  | 'debug' 
  | 'career' 
  | 'communication' 
  | 'review';

export interface DailyMissionSlot {
  id: string;
  slotType: 'core' | 'optional';
  category: DailyMissionActionCategory;
  title: string;
  desc: string;
  estDurationMinutes: number;
  competencyId?: string;
  sourceType?: EvidenceSourceType;
  sourceId?: string;
  xpReward: number;
  isCompleted: boolean;
  isLocked?: boolean;
}

export interface WeeklyWorkloadPlan {
  band: WorkloadBand;
  targetHours: number;              // e.g. 5-8 for standard, 2-4 for light, 0-2 for exam_pause
  conceptualTask?: { id: string; title: string; estHours: number };
  debuggingLab?: { id: string; title: string; estHours: number; familyId: string };
  evidenceTask?: { id: string; title: string; estHours: number; projectLevel: ProjectLevel };
  problemSolvingTask?: { id: string; title: string; topic: string; estHours: number };
}

// ── 6. Configurable Residency Engine ────────────────────────────────────────
export interface ResidencyConfig {
  durationWeeks: number;            // e.g. 12 weeks
  ticketPoolId: string;
  incidentPoolId: string;
  requireOralDefense: boolean;
  minDefenseScore: number;
  reviewPolicy: 'automated_pre_screen_with_human_mentor';
}

// ── 7. Program & Stage Requirements ──────────────────────────────────────────
export interface ProgramStage {
  id: string;                       // 'sem_1_foundations', 'sem_2_core', etc.
  title: string;
  durationMonths: number;
  stageLevel: CompetencyLevel;
  requiredCompetencies: {
    competencyId: string;
    requiredState: 'demonstrated' | 'verified';
    minScore: number;
  }[];
  courseModuleIds: string[];
  milestoneCredentialId?: string;
  problemSolvingThread?: {
    topic: string;
    focusAreas: string[];
    weeklyHours: number;
  };
  residencyConfig?: ResidencyConfig;
}

export interface CareerProgram {
  id: string;
  title: string;
  targetRole: string;
  cohortTarget?: 'final_year' | 'pre_final_year' | 'general';
  recommendedDurationMonths: {
    accelerated: number;            // e.g. 9 or 18 months
    standard: number;               // e.g. 12 or 24 months
    extended: number;
  };
  stages: ProgramStage[];
  hasIndustryResidency: boolean;
  residencyConfig?: ResidencyConfig;
  graduationRequirements: {
    minDemonstratedCompetencyPct: number;
    minVerifiedCompetencyPct: number;
    requireCapstoneDefense: boolean;
    requireResidencyCompletion: boolean;
    disallowActiveCriticalFailures: boolean;
  };
}

// ── 8. Dynamic Role Readiness & 5-Stage Progression ────────────────────────
export type RoleReadinessStage = 
  | 'exploring' 
  | 'developing' 
  | 'in_progress'
  | 'ready_for_internship' 
  | 'ready_for_interview' 
  | 'placement_ready';

export interface ReadinessRequirementConfig {
  interviewReady: {
    minVerifiedCompetenciesPct: number; // e.g. 100% of stage required
    requireOralDefense: boolean;
    minDefenseScore: number;            // e.g. 75
    requireProductionProject: boolean;
    requireAtsResume: boolean;
  };
  placementReady: {
    requireInterviewReady: boolean;
    requireCommunicationGate: boolean;
    requireMockInterviewPass: boolean;
    optionalInternshipBoost: boolean;
  };
}

export interface DynamicLearningGain {
  baselineDiagnosticScore?: number;
  currentCompositeScore: number;
  pointsGained?: number;
}

export interface DynamicRoleReadiness {
  targetRole: string;
  status: RoleReadinessStage;
  verifiedCompetenciesCount: number;
  totalRequiredCompetenciesCount: number;
  assessmentFreshnessDays: number;
  capstoneDefenseScore?: number;
  capstoneDefenseEvaluator?: string;
  learningGain: DynamicLearningGain;
  keyProjectArtifacts: { title: string; repoUrl?: string; commitSha?: string; liveUrl?: string }[];
  isPlacementReady?: boolean;
}

// ── 9. Transparent 3-Tier Skill Representation ──────────────────────────────
export type SkillTier = 'claimed' | 'demonstrated' | 'verified';

export interface StudentSkillProfile {
  claimed: { id: string; name: string; category?: string }[];
  demonstrated: { id: string; name: string; score: number; level: CompetencyLevel }[];
  verified: { id: string; name: string; score: number; level: CompetencyLevel; verifiedAt: number; credentialId?: string }[];
}

// ── 10. ATS Taxonomy Gaps with User Consent ─────────────────────────────────
export interface JobDescriptionSkillGap {
  taxonomyTerm: string;
  competencyId?: string;
  importance: 'required' | 'preferred' | 'optional';
  isSatisfied: boolean;
  currentMasteryState?: MasteryState;
  userConsentStatus: 'pending' | 'accepted' | 'declined';
}

// ── 11. External Internship Experience Record ───────────────────────────────
export interface InternshipRecord {
  id: string;
  studentId: string;
  companyName: string;
  role: string;
  startDate: string;
  endDate?: string;
  skillsUsed: string[];
  projectDescription: string;
  mentorName?: string;
  performanceRating?: string;
  certificateUrl?: string;
  isVerified: boolean;
  type: 'external_employment' | 'campus_internship';
  createdAt: number;
}


