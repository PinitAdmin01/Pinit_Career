// src/lib/curriculum/assessmentTypes.ts
// Single Source of Truth for PinIT Assessment Engine Architecture

import { DifficultyLevel } from './contentTypes';

export type AssessmentType = 
  | 'KNOWLEDGE'
  | 'CODE'
  | 'DEBUGGING'
  | 'TRANSFER'
  | 'PROJECT'
  | 'SECURITY'
  | 'ARCHITECTURE'
  | 'VIVA';

export type AssessmentMode = 
  | 'FORMATIVE'        // Learning mode: hints allowed, multiple retries, solutions on completion
  | 'SUMMATIVE'        // Competency check: limited retries, hidden tests, strict timing
  | 'CERTIFICATION';   // Final high-stakes gate: audit trail, no hints, strict identity

export type AssessmentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type AttemptStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'EVALUATING'
  | 'EVALUATED'
  | 'EXPIRED'
  | 'ABANDONED'
  | 'INVALIDATED';

export type IntegrityStatus = 'VALID' | 'SUSPICIOUS' | 'INVALID' | 'UNDER_REVIEW';

export type AttemptPolicy = 
  | 'UNLIMITED'
  | 'LIMITED_BEST'
  | 'LIMITED_LATEST'
  | 'FIRST_PASSING'
  | 'MANUAL_REVIEW_REQUIRED';

export type AssessmentItemType = 
  | 'MCQ'
  | 'SHORT_ANSWER'
  | 'CODE'
  | 'DEBUGGING'
  | 'TRANSFER'
  | 'PROJECT'
  | 'SECURITY'
  | 'ARCHITECTURE'
  | 'VIVA';

export type RubricDimensionType = 
  | 'Correctness'
  | 'Architecture'
  | 'Security'
  | 'Testing'
  | 'Performance'
  | 'CodeQuality'
  | 'Documentation'
  | 'Reasoning'
  | 'EdgeCaseRobustness'
  | 'ProblemSolving'
  | 'FunctionDesign'
  | 'ScopeStateReasoning'
  | 'ModuleOrganization'
  | 'DebuggingVerification'
  | 'DataStructureSelection'
  | 'TradeoffReasoning'
  | 'MutabilityAliasingReasoning'
  | 'Persistence'
  | 'ErrorHandling'
  | 'ApplicationSeparation'
  | 'DataValidation'
  | 'ClassDesign'
  | 'EncapsulationState'
  | 'CompositionModeling'
  | 'FunctionalCorrectness'
  | 'ObjectModeling'
  | 'MethodStateBehavior'
  | 'CompositionResponsibility'
  | 'DebuggingEdgeCases'
  | 'DesignJudgment'
  | 'OverridePolymorphismBehavior'
  | 'DomainErrorModeling'
  | 'ObjectDataModelBehavior'
  | 'ModuleResponsibility'
  | 'CLIDesign'
  | 'ValidationErrorHandling'
  | 'LoggingObservability'
  | 'DebuggingDiagnostics'
  | 'CodeQualityMaintainability'
  | 'PackagingInstallation'
  | 'ConfigurationManagement'
  | 'CLIEntryPoint'
  | 'DebuggingEnvironmentReasoning'
  | 'SecuritySecretHandling';

// ── Test Case Definition with 3-Tier Visibility ──────────────────────────────
export interface TestCase {
  id: string;
  name: string;
  input: string;                   // Serialized input args e.g. '[10, 20]'
  expectedOutput: string;          // Serialized expected output e.g. '30'
  tier: 'VISIBLE' | 'PRIVATE' | 'ADVERSARIAL' | 'INTEGRITY'; // VISIBLE (student sees), ADVERSARIAL/PRIVATE (grading fixtures), INTEGRITY (anti-cheat)
  weight?: number;                 // Relative weight (default: 1)
  description?: string;
}

// ── Weighted Rubric Dimension Definition ─────────────────────────────────────
export interface RubricDimension {
  id: string;
  name: RubricDimensionType;
  description: string;
  weight: number;                  // 0.0 to 1.0 (Must sum to 1.0 across all dimensions)
  maxPoints: number;
  minimumPassingScore?: number;    // Mandatory threshold for this specific dimension
  isMandatory?: boolean;           // If true, failing this dimension fails the entire assessment
}

// ── Assessment Item Definition ────────────────────────────────────────────────
export interface AssessmentItem {
  id: string;                      // Stable ID e.g. 'item-py-001'
  assessmentId: string;
  version: string;                 // SemVer e.g. '1.0.0'
  itemType: AssessmentItemType;
  prompt: string;
  points: number;                  // Points allocated for this item
  order: number;                   // 1, 2, 3...
  timeEstimateMinutes: number;
  
  // MCQ specific
  options?: string[];
  correctIndex?: number;           // PRIVATE — never exposed to client
  explanation?: string;

  // Code / Debugging / Transfer specific
  starterCode?: string;
  solutionCode?: string;
  visibleTests?: TestCase[];       // Exposed to students during formative practice
  privateTests?: TestCase[];       // PRIVATE — stripped from student API payloads
  adversarialTests?: TestCase[];   // Formative client-accessible adversarial fixtures
  integrityTests?: TestCase[];     // Anti-hardcoding / corner cases

  // Rubric for Projects / Architecture / Security / Viva
  rubricDimensions?: RubricDimension[];
  rubric?: RubricDimension[];

  // Critical Invariants
  isMandatory?: boolean;           // Failing this item fails the whole assessment
  criticalFailureCode?: string;    // e.g. 'SQL_INJECTION_VULNERABILITY'
}

// ── Top-Level Assessment Definition ──────────────────────────────────────────
export interface Assessment {
  id: string;                      // Stable ID e.g. 'asm-p1-m1-w1-001'
  assessmentCode: string;          // Stable Code e.g. 'ASM-P1-001'
  title: string;
  description: string;
  type: AssessmentType;
  mode: AssessmentMode;
  version: string;                 // SemVer e.g. '1.0.0'
  status: AssessmentStatus;
  difficulty: DifficultyLevel;
  timeLimitMinutes: number;        // 0 for untimed
  attemptPolicy: AttemptPolicy;
  maxAttempts: number;             // e.g. 3 (or 0 for unlimited)
  passingScore: number;            // 0 - 100 (e.g. 75)
  targetCompetencyId: string;      // References Competency.id
  batchId?: string;
  items: AssessmentItem[];
  mandatoryCriteriaIds?: string[]; // IDs of items or rubrics that MUST pass
  criticalFailureCodes?: string[]; // Codes that trigger immediate failure
  createdAt: string;
  updatedAt: string;
}

// ── Student Attempt Definition (Immutable History) ────────────────────────────
export interface AssessmentAttempt {
  id: string;                      // Stable ID e.g. 'att-001-studentA'
  studentId: string;
  assessmentId: string;
  assessmentVersion: string;
  attemptNumber: number;           // 1, 2, 3...
  startedAt: string;               // ISO timestamp
  submittedAt?: string;            // ISO timestamp
  expiresAt?: string;              // ISO timestamp (for timed assessments)
  status: AttemptStatus;
  environmentInfo?: {
    userAgent: string;
    runtime: 'SIMULATED_BROWSER' | 'SERVER_SANDBOX' | 'CONTAINER_JUDGE';
  };
  integrityFlag: IntegrityStatus;
  rawSubmissions: Record<string, string>; // itemId -> student submitted code or answer
}

// ── Single Item Evaluation Result ─────────────────────────────────────────────
export interface ItemEvaluationResult {
  itemId: string;
  itemType: AssessmentItemType;
  pointsEarned: number;
  maxPoints: number;
  passed: boolean;
  visibleTestsPassed?: number;
  visibleTestsTotal?: number;
  privateTestsPassed?: number;
  privateTestsTotal?: number;
  integrityTestsPassed?: number;
  integrityTestsTotal?: number;
  rubricScores?: Record<string, number>; // dimensionId -> score
  errorLogs?: string[];
  criticalFailureTriggered?: string;     // If a critical failure occurred
}

// ── Final Immutable Assessment Result Record ──────────────────────────────────
export interface AssessmentResult {
  id: string;                      // Stable ID e.g. 'res-001-att-001'
  attemptId: string;
  studentId: string;
  assessmentId: string;
  assessmentVersion: string;
  rawScore: number;
  maxScore: number;
  normalizedScore: number;         // 0 - 100
  passed: boolean;
  status: 'PASS' | 'FAIL' | 'INVALID' | 'REVIEW_REQUIRED';
  mandatoryCriteriaMet: boolean;
  hasCriticalFailures: boolean;
  criticalFailureReasons: string[];
  integrityStatus: IntegrityStatus;
  itemResults: ItemEvaluationResult[];
  rubricBreakdown?: Array<{ dimension: RubricDimensionType; score: number; maxScore: number; weight: number }>;
  feedback: string;
  evaluatedAt: string;
  evaluatorType: 'DETERMINISTIC' | 'RUBRIC' | 'MANUAL' | 'HYBRID';
  targetCompetencyId: string;
}

// ── Public Student-Facing Assessment View (Sanitized — No Private Tests) ──────
export interface SanitizedStudentAssessment {
  id: string;
  assessmentCode: string;
  title: string;
  description: string;
  type: AssessmentType;
  mode: AssessmentMode;
  version: string;
  difficulty: DifficultyLevel;
  timeLimitMinutes: number;
  attemptPolicy: AttemptPolicy;
  maxAttempts: number;
  passingScore: number;
  items: Array<{
    id: string;
    itemType: AssessmentItemType;
    prompt: string;
    points: number;
    order: number;
    options?: string[];            // MCQ options without correctIndex
    starterCode?: string;
    visibleTests?: Array<{ name: string; input: string; expectedOutput: string; description?: string }>;
    rubricDimensions?: Array<{ name: RubricDimensionType; description: string; weight: number; maxPoints: number }>;
  }>;
}
