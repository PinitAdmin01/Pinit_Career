// src/lib/curriculum/types.ts
// Single Source of Truth for PinIT 36-Month Competency-Based Curriculum Architecture

export type PhaseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type DayNumber = 1 | 2 | 3 | 4 | 5;

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type CompetencyLevel = 
  | 'NOT_ASSESSED'
  | 'DEVELOPING'
  | 'DEMONSTRATED'
  | 'PROFICIENT'
  | 'MASTERED';

export type CompetencyCategory = 
  | 'foundations'
  | 'programming'
  | 'algorithms_dsa'
  | 'web_architecture'
  | 'backend_frameworks'
  | 'database_systems'
  | 'api_engineering'
  | 'security_testing'
  | 'devops_cloud'
  | 'reliability_systems'
  | 'ai_engineering'
  | 'capstone_defense';

// ── 1. Course Definition ──────────────────────────────────────────────────────
export interface Course {
  id: string;                      // Stable ID e.g. 'course-python-fullstack'
  slug: string;                    // URL friendly slug e.g. 'python-full-stack'
  title: string;                   // 'PinIT Certified Python Full-Stack Software Engineer'
  description: string;
  durationMonths: number;          // 36
  status: ContentStatus;
  version: string;                 // SemVer e.g. '1.0.0'
  createdAt: string;               // ISO 8601
  updatedAt: string;               // ISO 8601
}

// ── 2. Phase Definition (1 of 12 Major Curriculum Phases) ─────────────────────
export interface Phase {
  id: string;                      // Stable ID e.g. 'phase-python-01'
  courseId: string;                // References Course.id
  phaseNumber: PhaseNumber;        // 1 to 12
  title: string;                   // 'Computing + Python Foundations'
  description: string;
  startMonth: number;              // 1
  endMonth: number;                // 3
  order: number;                   // 1
  status: ContentStatus;
}

// ── 3. Month Definition (1 of 36 Program Months) ──────────────────────────────
export interface Month {
  id: string;                      // Stable ID e.g. 'month-python-01'
  phaseId: string;                 // References Phase.id
  monthNumber: number;             // 1 to 36
  title: string;                   // 'Computer Fundamentals & Python Syntax'
  description: string;
  order: number;                   // 1
  status: ContentStatus;
}

// ── 4. Week Definition (Educational Organization Unit) ────────────────────────
export interface Week {
  id: string;                      // Stable ID e.g. 'week-python-m1-w1'
  monthId: string;                 // References Month.id
  weekNumber: number;              // 1 to 144
  title: string;                   // 'Program Execution & Developer Environment'
  description: string;
  order: number;                   // 1
  status: ContentStatus;
}

// ── 5. Three-Day Content Packet (Core Delivery Unit) ──────────────────────────
export interface ThreeDayPacketMeta {
  id: string;                      // Stable ID e.g. 'pkt-p1-m1-w1-001'
  weekId: string;                  // References Week.id
  packetCode: string;              // Deterministic hierarchical code e.g. 'P1-M1-W1-PKT001'
  title: string;                   // 'Program Execution & Developer Environment Setup'
  description: string;
  primaryCompetencyId: string;     // References Competency.id
  supportingCompetencyIds?: string[]; // Optional supporting competency IDs
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'production';
  prerequisites: string[];         // Packet IDs or Competency IDs required
  estimatedEffortHours: number;    // e.g. 6 (2 hours per day)
  status: ContentStatus;
  order: number;
  version: string;                 // e.g. '1.0.0'
  createdAt: string;
  updatedAt: string;
}

// ── 6. Day Definition (Day 1, 2, or 3 within a Packet) ────────────────────────
export interface Day {
  id: string;                      // Stable ID e.g. 'day-p1-m1-w1-001-d1'
  packetId: string;                // References ThreeDayPacketMeta.id
  dayNumber: DayNumber;            // Exactly 1, 2, or 3
  title: string;                   // 'Understand: How Interpreters Execute Code'
  objectives: string[];            // 1-3 measurable learning outcomes
  status: ContentStatus;
}

// ── 7. Competency Definition ──────────────────────────────────────────────────
export interface CompetencyLevelCriteria {
  developingCriteria: string;      // Human-readable criteria for DEVELOPING
  demonstratedCriteria: string;    // Human-readable criteria for DEMONSTRATED
  proficientCriteria: string;      // Human-readable criteria for PROFICIENT
  masteredCriteria: string;        // Human-readable criteria for MASTERED
}

export interface Competency {
  id: string;                      // Stable ID e.g. 'comp-p1-001'
  code: string;                    // Stable Code e.g. 'COMP-P1-001'
  name: string;                    // 'Program Execution & Developer Environment Setup'
  description: string;
  category: CompetencyCategory;
  levelDefinitions: CompetencyLevelCriteria;
  prerequisites: string[];         // Hard prerequisite Competency IDs
  status: ContentStatus;
  version: string;
}

// ── 8. Student State Separation Types ─────────────────────────────────────────
export interface StudentLearningProgress {
  studentId: string;
  packetId: string;
  dayId: string;
  completedAt?: string;
  timeSpentSeconds: number;
}

export interface StudentAssessmentAttempt {
  id: string;
  studentId: string;
  packetId: string;
  dayNumber: DayNumber;
  score: number;                   // 0 - 100
  passed: boolean;
  attemptNumber: number;
  timestamp: string;
}

export interface StudentCompetencyStatus {
  studentId: string;
  competencyId: string;
  level: CompetencyLevel;
  lastAssessedAt?: string;
  evidenceCount: number;
  verifiedAt?: string;
}

export interface StudentCertificationEligibility {
  studentId: string;
  courseId: string;
  phaseCompletion: Record<PhaseNumber, boolean>;
  gateStatus: Record<string, 'LOCKED' | 'ELIGIBLE' | 'PASSED' | 'FAILED'>;
  overallEligible: boolean;
}
