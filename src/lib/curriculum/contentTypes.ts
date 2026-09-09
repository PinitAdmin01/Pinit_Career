// src/lib/curriculum/contentTypes.ts
// Single Source of Truth for PinIT Content Block Architecture

import type { DayNumber, ContentStatus } from './types';
export type { DayNumber, ContentStatus };

export type DifficultyLevel = 
  | 'FOUNDATION'
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'CHALLENGING';

export type PedagogicalIntent = 'UNDERSTAND' | 'APPLY' | 'BUILD' | 'DEBUG' | 'TRANSFER';

export type ContentBlockType = 
  | 'THEORY'
  | 'EXAMPLE'
  | 'GUIDED_PRACTICE'
  | 'KNOWLEDGE_CHECK'
  | 'GUIDED_LAB'
  | 'INDEPENDENT_PRACTICE'
  | 'DEBUGGING_CHALLENGE'
  | 'TRANSFER_CHALLENGE'
  | 'MINI_PROJECT'
  | 'REFLECTION'
  | 'REFERENCE';

// ── Base Content Block Interface ──────────────────────────────────────────────
export interface ContentBlockBase {
  id: string;                      // e.g. 'blk-p1-m1-w1-d1-01'
  type: ContentBlockType;
  order: number;                   // 1, 2, 3...
  title: string;
  estimatedMinutes: number;
  status: ContentStatus;
  version: string;                 // e.g. '1.0.0'
}

// ── 1. Theory Block (Conceptual Explanation & Mental Models) ──────────────────
export interface TheoryBlock extends ContentBlockBase {
  type: 'THEORY';
  summary: string;
  whatItIs?: string;
  whyItExists?: string;
  problemSolved?: string;
  mentalModel?: string;
  realWorldUse?: string;
  commonMistakes?: string[];
  commonMisconceptions?: string[];
}

// ── 2. Example Block (Concrete Worked Code Example) ───────────────────────────
export interface ExampleBlock extends ContentBlockBase {
  type: 'EXAMPLE';
  explanation?: string;
  codeSnippet?: string;
  language?: 'python' | 'html' | 'css' | 'javascript' | 'sql' | 'bash' | 'dockerfile';
  expectedOutput?: string;
  description?: string;
  code?: string;
  annotatedWalkthrough?: Array<{ line: number; annotation: string }>;
}

// ── 3. Guided Practice Block (Scaffolded Interactive Exercise) ────────────────
export interface GuidedPracticeBlock extends ContentBlockBase {
  type: 'GUIDED_PRACTICE';
  instructions?: string[];
  instruction?: string;
  starterCode?: string;
  starterArtifact?: string;
  hints: string[];
  expectedOutcome?: string;
  validationCriteria?: string[];
  solutionCode?: string;
  solutionReference?: string;      // Hidden during active student attempts
  targetCompetencyId?: string;
}

// ── 4. Knowledge Check Block (Diagnostic Misconception Detection) ─────────────
export interface KnowledgeCheckBlock extends ContentBlockBase {
  type: 'KNOWLEDGE_CHECK';
  diagnosticQuestion: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptionIdentified: string;
}

// ── 5. Guided Lab Block (Realistic Step-by-Step Implementation) ───────────────
export interface GuidedLabBlock extends ContentBlockBase {
  type: 'GUIDED_LAB';
  task: string;
  instructions: string[];
  starterFiles: Record<string, string>; // filename -> code
  expectedBehavior: string;
  dependencies?: string[];
}

// ── 6. Independent Practice Block (Reduced Scaffolding) ───────────────────────
export interface IndependentPracticeBlock extends ContentBlockBase {
  type: 'INDEPENDENT_PRACTICE';
  task: string;
  starterCode: string;
  hints: string[];
  verificationRequirements: string[];
}

// ── 7. Debugging Challenge Block (Realistic Defect Diagnosis) ─────────────────
export interface DebuggingChallengeBlock extends ContentBlockBase {
  type: 'DEBUGGING_CHALLENGE';
  problemDescription?: string;
  symptom?: string;
  brokenArtifact?: string;          // Broken source code
  expectedBehavior?: string;
  difficulty?: DifficultyLevel;
  hints?: string[];
  targetCompetencyId?: string;      // References Competency.id
  assessmentRef?: string;          // External assessment ID (assessment engine owns grading)
  description?: string;
  buggyCode?: string;
  fixedCode?: string;
  expectedErrors?: string[];
  verificationSteps?: string[];
  remediationSteps?: string[];
  fixedArtifact?: string;
}

// ── 8. Transfer Challenge Block (Unfamiliar Domain Application) ───────────────
export interface TransferChallengeBlock extends ContentBlockBase {
  type: 'TRANSFER_CHALLENGE';
  unfamiliarDomainContext: string; // e.g. "Industrial Sensor Telemetry Parser"
  task: string;
  constraints: string[];
  starterArtifact?: string;
  difficulty: DifficultyLevel;
  timeExpectationMinutes: number;
  targetCompetencyId: string;      // References Competency.id
  assessmentRef?: string;          // External assessment ID
}

// ── 9. Mini Project Block (Meaningful Synthesis Project) ──────────────────────
export interface MiniProjectBlock extends ContentBlockBase {
  type: 'MINI_PROJECT';
  problemStatement: string;
  specifications: string[];
  constraints: string[];
  starterFiles: Record<string, string>;
  expectedDeliverables: string[];
  rubricRef?: string;              // External rubric ID
  targetCompetencyId: string;
}

// ── 10. Reflection Block ──────────────────────────────────────────────────────
export interface ReflectionBlock extends ContentBlockBase {
  type: 'REFLECTION';
  prompt: string;
  guidingQuestions: string[];
}

// ── 11. Reference Block ───────────────────────────────────────────────────────
export interface ReferenceBlock extends ContentBlockBase {
  type: 'REFERENCE';
  links: Array<{ title: string; url: string; description?: string }>;
  documentationExtracts?: string[];
}

// ── Polymorphic Content Block Union ───────────────────────────────────────────
export type ContentBlock = 
  | TheoryBlock
  | ExampleBlock
  | GuidedPracticeBlock
  | KnowledgeCheckBlock
  | GuidedLabBlock
  | IndependentPracticeBlock
  | DebuggingChallengeBlock
  | TransferChallengeBlock
  | MiniProjectBlock
  | ReflectionBlock
  | ReferenceBlock;

// ── Day Content Manifest ──────────────────────────────────────────────────────
export interface DayContentManifest {
  packetId: string;
  dayNumber: DayNumber;            // Strictly 1, 2, or 3
  title: string;
  pedagogicalIntent: PedagogicalIntent; // Day 1: UNDERSTAND, Day 2: BUILD, Day 3: TRANSFER
  blocks: ContentBlock[];
  version: string;
  status: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
}

// ── Three-Day Packet Content Manifest (Legacy / Specialized) ──────────────────
export interface PacketContentManifest {
  packetId: string;
  packetCode: string;
  title: string;
  difficulty: DifficultyLevel;
  days: [DayContentManifest, DayContentManifest, DayContentManifest]; // Exactly 3 days
  version: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Five-Day Development Batch Content Manifest (Standard Build Cadence / Partial Horizons) ──────
export interface BatchContentManifest {
  batchId: string;
  batchCode: string;               // e.g. 'P1-M1-W1-BATCH001'
  title: string;
  difficulty: DifficultyLevel;
  days: DayContentManifest[];      // Day manifests (typically 5 days, or partial horizon)
  isPartial?: boolean;             // Explicit flag for partial batch planning horizons
  version: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Two-Day Post-Gate Consolidation Block Content Manifest ───────────────────
export interface ConsolidationBlockManifest {
  blockId: string;
  blockCode: string;               // e.g. 'P1-M3-POST-GATE01'
  title: string;
  difficulty: DifficultyLevel;
  days: [DayContentManifest, DayContentManifest]; // Exactly 2 days
  version: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}
