/**
 * PinIT Career OS — Content QA Harness (Stage 0.1)
 *
 * Measures the authored curriculum by LOADING THE REAL TYPESCRIPT MODULES the
 * application imports — never by regex-parsing source text. The class of bug this
 * exists to prevent is: "the QA parser certifies one thing while the runtime
 * imports another."
 *
 * Two independent views are cross-checked:
 *   1. The pilot-day modules (authoritative lesson content).
 *   2. COURSES_REGISTRY (what the app actually renders), which is built by
 *      buildEnrichedDayQuests(). Comparing (2) against (1) proves the pilot data
 *      genuinely reaches the student — and catches dispatch/indexing bugs.
 *
 * Caveat: the loader runs transpileOnly. This harness measures runtime data shape
 * and content; it does NOT typecheck. `npx tsc --noEmit` remains a separate
 * mandatory CI gate.
 *
 * Run:  node scripts/content-qa.js
 */

import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

import { COURSES_REGISTRY, Course, CourseQuest } from '../src/lib/data/coursesData';

import { JAVA_PILOT_DAYS } from '../src/lib/data/javaPilotDays';
import { PYTHON_PILOT_DAYS } from '../src/lib/data/pythonPilotDays';
import { REACT_PILOT_DAYS } from '../src/lib/data/reactPilotDays';
import { DATABASE_PILOT_DAYS } from '../src/lib/data/databasePilotDays';
import { DSA_PILOT_DAYS } from '../src/lib/data/dsaPilotDays';
import { FULLSTACK_PILOT_DAYS } from '../src/lib/data/fullstackPilotDays';
import { CLOUD_PILOT_DAYS } from '../src/lib/data/cloudPilotDays';
import { DEVOPS_PILOT_DAYS } from '../src/lib/data/devopsPilotDays';
import { AI_PILOT_DAYS } from '../src/lib/data/aiPilotDays';
import { DISTRIBUTED_PILOT_DAYS } from '../src/lib/data/distributedPilotDays';
import { IOT_EMBEDDED_PILOT_DAYS } from '../src/lib/data/iotEmbeddedPilotDays';
import { GRAPHICS_3D_PILOT_DAYS } from '../src/lib/data/graphics3dPilotDays';
import { BLOCKCHAIN_PILOT_DAYS } from '../src/lib/data/blockchainPilotDays';
import { IOT_NETWORK_PILOT_DAYS } from '../src/lib/data/iotNetworkPilotDays';
import { IOT_EDGE_AI_PILOT_DAYS } from '../src/lib/data/iotEdgeAiPilotDays';
import { IOT_SECURITY_PILOT_DAYS } from '../src/lib/data/iotSecurityPilotDays';
import { QUANT_PILOT_DAYS } from '../src/lib/data/quantPilotDays';
import { BCOM_ACCOUNTING_PILOT_DAYS } from '../src/lib/data/bcomAccountingPilotDays';
import { BCOM_FINANCE_PILOT_DAYS } from '../src/lib/data/bcomFinancePilotDays';
import { BCOM_ANALYTICS_PILOT_DAYS } from '../src/lib/data/bcomAnalyticsPilotDays';
import { BCOM_MARKETING_PILOT_DAYS } from '../src/lib/data/bcomMarketingPilotDays';
import { BCOM_DIGITAL_MARKETING_PILOT_DAYS } from '../src/lib/data/bcomDigitalMarketingPilotDays';
import { BCOM_ECOMMERCE_PILOT_DAYS } from '../src/lib/data/bcomEcommercePilotDays';
import { BCOM_ENTREPRENEURSHIP_PILOT_DAYS } from '../src/lib/data/bcomEntrepreneurshipPilotDays';
import { BCOM_SALES_CRM_PILOT_DAYS } from '../src/lib/data/bcomSalesCrmPilotDays';
import { BCOM_OPERATIONS_PILOT_DAYS } from '../src/lib/data/bcomOperationsPilotDays';
import { BCOM_AI_TRANSFORMATION_PILOT_DAYS } from '../src/lib/data/bcomAiTransformationPilotDays';
import { COMPUTER_FUNDAMENTALS_PILOT_DAYS } from '../src/lib/data/computerFundamentalsPilotDays';
import { AI_PROMPT_LITERACY_PILOT_DAYS } from '../src/lib/data/aiPromptLiteracyPilotDays';
import { EXCEL_DATA_VIZ_PILOT_DAYS } from '../src/lib/data/excelDataVizPilotDays';
import { GIT_VERSION_CONTROL_PILOT_DAYS } from '../src/lib/data/gitVersionControlPilotDays';
import { SOFTSKILLS_PILOT_DAYS } from '../src/lib/data/softskillsPilotDays';
import { DESIGN_PILOT_DAYS } from '../src/lib/data/designPilotDays';
import { MOBILE_PILOT_DAYS } from '../src/lib/data/mobilePilotDays';
import { NLP_PILOT_DAYS } from '../src/lib/data/nlpPilotDays';
import { CYBER_PILOT_DAYS } from '../src/lib/data/cybersecurityPilotDays';

// ── Explicit course → pilot-source binding ─────────────────────────────────
// This map is deliberately explicit. It is the seed for the Stage 5.1
// COURSE_PEDAGOGY registry that replaces the 36-branch substring dispatcher in
// curriculumEnricher.ts. Adding a course without adding it here is a FATAL error.

interface CourseBinding {
  courseId: string;
  exportName: string;
  source: unknown;
}

const COURSE_BINDINGS: CourseBinding[] = [
  { courseId: 'course-java-logic', exportName: 'JAVA_PILOT_DAYS', source: JAVA_PILOT_DAYS },
  { courseId: 'course-react-web', exportName: 'REACT_PILOT_DAYS', source: REACT_PILOT_DAYS },
  { courseId: 'course-cloud-native', exportName: 'CLOUD_PILOT_DAYS', source: CLOUD_PILOT_DAYS },
  { courseId: 'course-devops-cicd', exportName: 'DEVOPS_PILOT_DAYS', source: DEVOPS_PILOT_DAYS },
  { courseId: 'course-design-systems', exportName: 'DESIGN_PILOT_DAYS', source: DESIGN_PILOT_DAYS },
  { courseId: 'course-dsa-optim', exportName: 'DSA_PILOT_DAYS', source: DSA_PILOT_DAYS },
  { courseId: 'course-mobile-dev', exportName: 'MOBILE_PILOT_DAYS', source: MOBILE_PILOT_DAYS },
  { courseId: 'course-cybersecurity', exportName: 'CYBER_PILOT_DAYS', source: CYBER_PILOT_DAYS },
  { courseId: 'course-database-eng', exportName: 'DATABASE_PILOT_DAYS', source: DATABASE_PILOT_DAYS },
  { courseId: 'course-distributed-sys', exportName: 'DISTRIBUTED_PILOT_DAYS', source: DISTRIBUTED_PILOT_DAYS },
  { courseId: 'course-ai-eng', exportName: 'AI_PILOT_DAYS', source: AI_PILOT_DAYS },
  { courseId: 'course-fullstack-js', exportName: 'FULLSTACK_PILOT_DAYS', source: FULLSTACK_PILOT_DAYS },
  { courseId: 'course-iot-embedded', exportName: 'IOT_EMBEDDED_PILOT_DAYS', source: IOT_EMBEDDED_PILOT_DAYS },
  { courseId: 'course-3d-graphics', exportName: 'GRAPHICS_3D_PILOT_DAYS', source: GRAPHICS_3D_PILOT_DAYS },
  { courseId: 'course-blockchain-web3', exportName: 'BLOCKCHAIN_PILOT_DAYS', source: BLOCKCHAIN_PILOT_DAYS },
  { courseId: 'course-iot-network', exportName: 'IOT_NETWORK_PILOT_DAYS', source: IOT_NETWORK_PILOT_DAYS },
  { courseId: 'course-iot-edge-ai', exportName: 'IOT_EDGE_AI_PILOT_DAYS', source: IOT_EDGE_AI_PILOT_DAYS },
  { courseId: 'course-iot-security', exportName: 'IOT_SECURITY_PILOT_DAYS', source: IOT_SECURITY_PILOT_DAYS },
  { courseId: 'course-python-backend', exportName: 'PYTHON_PILOT_DAYS', source: PYTHON_PILOT_DAYS },
  { courseId: 'course-quant-systems', exportName: 'QUANT_PILOT_DAYS', source: QUANT_PILOT_DAYS },
  { courseId: 'course-digital-accounting', exportName: 'BCOM_ACCOUNTING_PILOT_DAYS', source: BCOM_ACCOUNTING_PILOT_DAYS },
  { courseId: 'course-finance-investment', exportName: 'BCOM_FINANCE_PILOT_DAYS', source: BCOM_FINANCE_PILOT_DAYS },
  { courseId: 'course-business-analytics', exportName: 'BCOM_ANALYTICS_PILOT_DAYS', source: BCOM_ANALYTICS_PILOT_DAYS },
  { courseId: 'course-marketing-branding', exportName: 'BCOM_MARKETING_PILOT_DAYS', source: BCOM_MARKETING_PILOT_DAYS },
  { courseId: 'course-digital-marketing', exportName: 'BCOM_DIGITAL_MARKETING_PILOT_DAYS', source: BCOM_DIGITAL_MARKETING_PILOT_DAYS },
  { courseId: 'course-ecommerce-digital-biz', exportName: 'BCOM_ECOMMERCE_PILOT_DAYS', source: BCOM_ECOMMERCE_PILOT_DAYS },
  { courseId: 'course-entrepreneurship-biz-mgmt', exportName: 'BCOM_ENTREPRENEURSHIP_PILOT_DAYS', source: BCOM_ENTREPRENEURSHIP_PILOT_DAYS },
  { courseId: 'course-sales-crm-success', exportName: 'BCOM_SALES_CRM_PILOT_DAYS', source: BCOM_SALES_CRM_PILOT_DAYS },
  { courseId: 'course-operations-supplychain-compliance', exportName: 'BCOM_OPERATIONS_PILOT_DAYS', source: BCOM_OPERATIONS_PILOT_DAYS },
  { courseId: 'course-ai-digital-transformation', exportName: 'BCOM_AI_TRANSFORMATION_PILOT_DAYS', source: BCOM_AI_TRANSFORMATION_PILOT_DAYS },
  { courseId: 'course-computer-fundamentals', exportName: 'COMPUTER_FUNDAMENTALS_PILOT_DAYS', source: COMPUTER_FUNDAMENTALS_PILOT_DAYS },
  { courseId: 'course-ai-prompt-literacy', exportName: 'AI_PROMPT_LITERACY_PILOT_DAYS', source: AI_PROMPT_LITERACY_PILOT_DAYS },
  { courseId: 'course-excel-data-viz', exportName: 'EXCEL_DATA_VIZ_PILOT_DAYS', source: EXCEL_DATA_VIZ_PILOT_DAYS },
  { courseId: 'course-git-version-control', exportName: 'GIT_VERSION_CONTROL_PILOT_DAYS', source: GIT_VERSION_CONTROL_PILOT_DAYS },
  { courseId: 'course-softskills-communication', exportName: 'SOFTSKILLS_PILOT_DAYS', source: SOFTSKILLS_PILOT_DAYS },
  { courseId: 'course-nlp', exportName: 'NLP_PILOT_DAYS', source: NLP_PILOT_DAYS },
];

// ── Findings ───────────────────────────────────────────────────────────────

type Severity = 'FATAL' | 'DEFECT';

interface Finding {
  severity: Severity;
  courseId: string;
  code: string;
  detail: string;
}

const findings: Finding[] = [];

function report(severity: Severity, courseId: string, code: string, detail: string): void {
  findings.push({ severity, courseId, code, detail });
}

// ── Shape normalisation (§2 fail-fast on Record vs Array) ──────────────────

type ExportShape = 'Array' | 'Record' | 'INVALID';

function normaliseSource(courseId: string, exportName: string, source: unknown):
  { shape: ExportShape; days: any[] } {
  if (Array.isArray(source)) {
    return { shape: 'Array', days: source };
  }
  if (source && typeof source === 'object') {
    report('DEFECT', courseId, 'EXPORT_SHAPE_RECORD',
      `${exportName} is a Record, not DayLessonPlan[]. All pilot sources must expose a consistent array (plan §5.3).`);
    return { shape: 'Record', days: Object.values(source as Record<string, any>) };
  }
  report('FATAL', courseId, 'EXPORT_SHAPE_INVALID',
    `${exportName} is neither an array nor an object (got ${typeof source}).`);
  return { shape: 'INVALID', days: [] };
}

// ── Detectors ──────────────────────────────────────────────────────────────

/** An answer that is an invented ALL_CAPS_SNAKE token typed back verbatim. */
const MAGIC_CONSTANT = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+){2,}$/;

/** Milestones "assessed" by typing back a certification banner string. */
const BANNER_QUESTION = /(certification string|credential title|what (status|verdict|flag|code)\b)/i;

/** Raw LaTeX leaking into plain-text fields (plan §5.5). */
const RAW_LATEX = /\$\\(to|times|rightarrow|le|ge|approx|neq)\$/;

/** Starter scaffolding markers — their absence suggests a pre-solved starter. */
const SCAFFOLD_MARKER =
  /TODO|\/\/\s*(write|return|declare|print|add|fix|implement|calculate|complete|your|step|build|create|1\.)|#\s*(write|return|todo|your|implement)|--\s*(write|your|todo)/i;

/**
 * Token-overlap score between a misconception ID and its day's title, used to
 * discriminate "genuine wrong mental model" (MC_DSA_BIG_O_WORST_VS_AVERAGE —
 * a real sub-concept, low overlap with "Time & Space Complexity") from
 * "topic label restated as an ID" (MC_CLOUD_IAAS_PAAS_SAAS_SHARED_RESPONSIBILITY,
 * which IS the day title "Cloud Computing Models (IaaS, PaaS, SaaS) & Shared
 * Responsibility" underscored — nearly full overlap).
 *
 * Calibrated against the actual corpus: Java/Python/React/Database score
 * 0.16-0.34 (independent vocabulary), DSA sits at 0.50 (topic-coupled but real
 * sub-concepts — one gotcha per data structure IS the misconception), and the
 * templated courses (Cloud, Cybersecurity, Design, Excel, Soft Skills) score
 * 0.60-0.88 (the ID is the title, reworded). 0.55 threshold separates the two
 * clusters and keeps DSA classified as genuine.
 */
const TAXONOMY_TITLE_OVERLAP_THRESHOLD = 0.55;
const STOPWORDS = new Set(['the', 'a', 'an', 'and', 'of', 'to', 'in', 'for', 'vs', 'with', 'is', 'on', 'its']);

function misconceptionIdTokens(id: string): string[] {
  return id
    .replace(/^MC_[A-Z0-9]+_/, '')
    .toLowerCase()
    .split('_')
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function titleTokenSet(title: string): Set<string> {
  return new Set(
    String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((t) => t.length > 2),
  );
}

type StarterLanguage = 'java' | 'python' | 'sql' | 'javascript';

function detectStarterLanguage(src: string): StarterLanguage {
  if (/public\s+class|System\.out|import\s+java\./.test(src)) return 'java';
  if (/\bSELECT\b|\bCREATE\s+TABLE\b|\bINSERT\s+INTO\b/i.test(src)) return 'sql';
  if (/^\s*def\s+\w+\(/m.test(src) && !/\bfunction\s/.test(src)) return 'python';
  return 'javascript';
}

/**
 * Executes a JavaScript starter against its own test suite. If it passes
 * untouched, the "exam" is pre-solved — the student presses Run and wins.
 * Java / Python / SQL cannot be executed in-process and are reported as
 * `unmeasured` rather than assigned a fabricated number.
 */
function starterAlreadyPasses(starter: string, testSuite: string): boolean {
  try {
    const sandbox = vm.createContext({
      console: { log() {}, error() {}, warn() {} },
      Math, JSON, Date, Object, Array, String, Number, Boolean,
      Map, Set, parseInt, parseFloat, isNaN, isFinite, RegExp, Error, Promise,
      setTimeout: () => undefined, clearTimeout: () => undefined,
    });
    vm.runInContext(`${starter}\n${testSuite}`, sandbox, { timeout: 1500 });
    return true;
  } catch {
    return false;
  }
}

// ── Cross-platform aggregates ──────────────────────────────────────────────

const globalRecoveryText = new Map<string, number>();
const globalDiagnosticQuestions = new Map<string, Set<string>>();

// ── Per-course measurement ─────────────────────────────────────────────────

interface CourseMetrics {
  courseId: string;
  title: string;
  exportName: string;
  exportShape: ExportShape;

  days: number;
  blocks: number;
  blocksPerDay: number;

  duplicateBlockIds: number;
  duplicateBlockTitles: number;
  duplicateDiagnostics: number;

  authoredDistractorPct: number;
  placeholderDistractorPct: number;
  magicConstantPct: number;
  bannerQuestionBlocks: number;

  conceptBudgetOverflowPct: number;

  missingPrerequisites: number;
  prerequisiteEdges: number;
  prerequisiteShape: 'linked-list' | 'dag' | 'none';
  maxInDegree: number;

  recoveryBranchesPerDiagnostic: number;
  singleBranchDiagnosticPct: number;
  boilerplateRecoveryPct: number;

  distinctMisconceptions: number;
  misconceptionsPerBlock: number;
  topicShapedTaxonomy: boolean;
  meanTitleOverlap: number;
  lowMisconceptionDensity: boolean;

  transferTaskCoverage: number;
  realMilestoneCount: number;

  mediaCodeLanguages: Record<string, number>;
  analogyBlocks: number;

  examQuests: number;
  assignmentQuests: number;
  questsMissingTestSuite: number;
  starterLanguages: Record<string, number>;
  preSolvedPct: number | null;
  preSolvedMeasured: number;
  preSolvedUnmeasured: number;

  rawLatexFields: number;
  runtimeBindingMismatches: number;
}

function measureCourse(binding: CourseBinding, course: Course): CourseMetrics {
  const { courseId, exportName, source } = binding;
  const { shape, days } = normaliseSource(courseId, exportName, source);

  const blockIds: string[] = [];
  const blockTitles: string[] = [];
  const questions: string[] = [];
  const allBlockIdSet = new Set<string>();

  let blocks = 0;
  let authoredDistractors = 0;
  let magicConstants = 0;
  let bannerQuestions = 0;
  let budgetOverflow = 0;
  let prereqEdges = 0;
  let missingPrereqs = 0;
  let diagnostics = 0;
  let diagnosisBranches = 0;
  let singleBranch = 0;
  let boilerplateRecovery = 0;
  let recoveryPaths = 0;
  let transferTasks = 0;
  let analogyBlocks = 0;
  let rawLatex = 0;

  const misconceptions = new Set<string>();
  const mediaCodeLanguages: Record<string, number> = {};
  const inDegree = new Map<string, number>();
  let titleOverlapSum = 0;
  let titleOverlapCount = 0;

  for (const day of days) {
    for (const block of day?.blocks ?? []) allBlockIdSet.add(block.id);
  }

  for (const day of days) {
    if (!day || typeof day.day !== 'number' || !Array.isArray(day.blocks)) {
      report('FATAL', courseId, 'MALFORMED_DAY',
        `Day entry is malformed or has no blocks array: ${JSON.stringify(day)?.slice(0, 120)}`);
      continue;
    }
    if (RAW_LATEX.test(day.title ?? '') || RAW_LATEX.test(day.overviewMetaphor ?? '')) rawLatex++;

    for (const block of day.blocks) {
      blocks++;
      blockIds.push(block.id);
      blockTitles.push(block.title ?? '');
      if (RAW_LATEX.test(block.title ?? '')) rawLatex++;

      const supporting = block.conceptBudget?.supportingTerms ?? [];
      if (supporting.length > 2) budgetOverflow++;

      for (const medium of block.media ?? []) {
        if (medium.type === 'analogy') analogyBlocks++;
        if (medium.type === 'runnable_code') {
          const ext = String(medium.filename ?? '').split('.').pop() || 'unknown';
          mediaCodeLanguages[ext] = (mediaCodeLanguages[ext] ?? 0) + 1;
        }
      }

      for (const prereq of block.prerequisiteThresholds ?? []) {
        prereqEdges++;
        if (!allBlockIdSet.has(prereq.conceptId)) {
          missingPrereqs++;
          report('DEFECT', courseId, 'MISSING_PREREQUISITE',
            `Block ${block.id} requires unknown concept "${prereq.conceptId}".`);
        }
        inDegree.set(prereq.conceptId, (inDegree.get(prereq.conceptId) ?? 0) + 1);
      }

      if (block.novelTransferTask) transferTasks++;

      const diag = block.diagnosticCheck;
      if (!diag) {
        report('DEFECT', courseId, 'BLOCK_WITHOUT_DIAGNOSTIC', `Block ${block.id} has no diagnosticCheck.`);
        continue;
      }
      diagnostics++;
      questions.push(diag.question ?? '');

      if (Array.isArray(diag.options) && diag.options.length > 0) authoredDistractors++;
      if (MAGIC_CONSTANT.test(String(diag.expectedStringOutput ?? '').trim())) magicConstants++;
      if (BANNER_QUESTION.test(diag.question ?? '')) bannerQuestions++;
      if (diag.primaryMisconceptionId) {
        misconceptions.add(diag.primaryMisconceptionId);
        const idTokens = misconceptionIdTokens(diag.primaryMisconceptionId);
        if (idTokens.length > 0) {
          const dayTitleTokens = titleTokenSet(day.title ?? '');
          const overlap = idTokens.filter((t) => dayTitleTokens.has(t)).length / idTokens.length;
          titleOverlapSum += overlap;
          titleOverlapCount++;
        }
      }

      const branches = Object.keys(diag.diagnosisMap ?? {});
      diagnosisBranches += branches.length;
      if (branches.length <= 1) singleBranch++;

      for (const key of branches) {
        const recovery = diag.diagnosisMap[key]?.recoveryPath ?? {};
        const simpler = String(recovery.simplerExplanation ?? '');
        recoveryPaths++;
        if (simpler.length < 40) boilerplateRecovery++;
        globalRecoveryText.set(simpler, (globalRecoveryText.get(simpler) ?? 0) + 1);
      }

      const seen = globalDiagnosticQuestions.get(diag.question ?? '') ?? new Set<string>();
      seen.add(courseId);
      globalDiagnosticQuestions.set(diag.question ?? '', seen);
    }
  }

  // ── Duplicate IDs are a FATAL condition (§2 fail-fast) ──────────────────
  const duplicateBlockIds = blockIds.length - new Set(blockIds).size;
  if (duplicateBlockIds > 0) {
    report('FATAL', courseId, 'DUPLICATE_BLOCK_IDS',
      `${duplicateBlockIds} duplicate block ID(s) — block IDs are the mastery-state key and must be unique.`);
  }

  // ── Prerequisite graph shape ───────────────────────────────────────────
  const maxInDegree = inDegree.size ? Math.max(...inDegree.values()) : 0;
  const branchingBlocks = [...inDegree.values()].filter((d) => d > 1).length;
  const prerequisiteShape: CourseMetrics['prerequisiteShape'] =
    prereqEdges === 0 ? 'none' : branchingBlocks === 0 ? 'linked-list' : 'dag';
  if (prerequisiteShape === 'linked-list' && blocks > 0) {
    report('DEFECT', courseId, 'PREREQ_LINKED_LIST',
      `${prereqEdges} prerequisite edges form a chain, not a competency graph (plan §6.6).`);
  }

  // ── Misconception taxonomy shape ───────────────────────────────────────
  // Two DISTINCT defects, deliberately not conflated:
  //
  //   TOPIC_SHAPED_TAXONOMY — the ID is the day's title, underscored, rather
  //     than a named wrong mental model. Measured by mean token-overlap between
  //     each block's misconceptionId and its day's title (see
  //     TAXONOMY_TITLE_OVERLAP_THRESHOLD for calibration against this corpus:
  //     Java/Python/React/Database score 0.16-0.34; DSA sits at 0.50 and is
  //     genuine — "MC_DSA_BIG_O_WORST_VS_AVERAGE" is a real sub-concept, not
  //     "Time & Space Complexity" restated; Cloud/Cyber/Design/Excel/SoftSkills
  //     score 0.60-0.88, where the ID literally is the title).
  //
  //   LOW_MISCONCEPTION_DENSITY — the IDs may be genuine, but one is reused
  //     across every block of a day, so a wrong answer cannot localise which
  //     of the day's 3 concepts the student misunderstood.
  //
  // These are independent: a course can have genuine per-topic misconceptions
  // (low overlap) that are still too coarse-grained (low density), or vice versa.
  const misconceptionsPerBlock = blocks ? misconceptions.size / blocks : 0;
  const meanTitleOverlap = titleOverlapCount ? titleOverlapSum / titleOverlapCount : 0;

  const topicShaped = meanTitleOverlap >= TAXONOMY_TITLE_OVERLAP_THRESHOLD;
  if (topicShaped) {
    report('DEFECT', courseId, 'TOPIC_SHAPED_TAXONOMY',
      `Misconception IDs overlap ${(meanTitleOverlap * 100).toFixed(0)}% with their day's title on average — these are topic labels restated as IDs, not named wrong mental models (plan Gate 7).`);
  }

  const lowMisconceptionDensity = blocks > 0 && misconceptionsPerBlock < 0.4;
  if (lowMisconceptionDensity) {
    report('DEFECT', courseId, 'LOW_MISCONCEPTION_DENSITY',
      `${misconceptions.size} distinct misconceptions across ${blocks} blocks (${misconceptionsPerBlock.toFixed(2)}/block) — one misconception ID is reused across a whole day, so a wrong answer cannot localise the error.`);
  }

  if (transferTasks === 0 && blocks > 0) {
    report('DEFECT', courseId, 'NO_TRANSFER_TASKS',
      `Zero novelTransferTask across ${blocks} blocks — mastery cannot be evidenced by transfer (plan §6.3, Gate 8).`);
  }

  // ── Registry-side quests: assessment presence + pre-solved detection ────
  const quests: CourseQuest[] = course?.quests ?? [];
  const examQuests = quests.filter((q) => q.category === 'exam');
  const assignmentQuests = quests.filter((q) => q.category === 'assignment');
  const codeQuests = [...examQuests, ...assignmentQuests];

  const starterLanguages: Record<string, number> = {};
  let questsMissingTestSuite = 0;
  let preSolved = 0;
  let preSolvedMeasured = 0;
  let preSolvedUnmeasured = 0;

  for (const quest of codeQuests) {
    const starter = quest.starterCode ?? '';
    const testSuite = quest.testSuite ?? '';
    if (!testSuite.trim()) {
      questsMissingTestSuite++;
      report('DEFECT', courseId, 'QUEST_WITHOUT_TEST_SUITE', `Quest ${quest.id} has no test suite.`);
      continue;
    }
    const language = detectStarterLanguage(starter);
    starterLanguages[language] = (starterLanguages[language] ?? 0) + 1;

    if (language === 'javascript') {
      preSolvedMeasured++;
      if (starterAlreadyPasses(starter, testSuite)) preSolved++;
    } else {
      preSolvedUnmeasured++;
      // Text-only fallback signal for non-JS languages: no scaffold marker at all.
      if (!SCAFFOLD_MARKER.test(starter)) {
        report('DEFECT', courseId, 'STARTER_LIKELY_PRESOLVED',
          `Quest ${quest.id} (${language}) has no scaffold marker — likely ships the solution. Not executable in-process; verify manually.`);
      }
    }
  }
  if (preSolved > 0) {
    report('DEFECT', courseId, 'PRESOLVED_EXAMS',
      `${preSolved}/${preSolvedMeasured} JavaScript starters already pass their own test suite unmodified.`);
  }

  // ── §2.2 Runtime binding proof ─────────────────────────────────────────
  // The lesson quest title the app renders must match the pilot day for that day
  // number. A mismatch means the runtime is serving different content than the
  // pilot source this harness just measured.
  let runtimeBindingMismatches = 0;
  const lessonQuests = quests.filter((q) => q.category === 'learning');
  for (const quest of lessonQuests) {
    const dayMatch = /-day-(\d+)$/.exec(quest.id);
    if (!dayMatch) continue;
    const dayNum = Number(dayMatch[1]);
    const pilotDay = days.find((d: any) => d?.day === dayNum);
    if (!pilotDay) {
      runtimeBindingMismatches++;
      report('FATAL', courseId, 'PILOT_DAY_UNREACHABLE',
        `Quest ${quest.id} has no pilot day ${dayNum} in ${exportName}.`);
      continue;
    }
    const expected = `Day ${dayNum}: ${pilotDay.title}`;
    if (quest.title !== expected) {
      runtimeBindingMismatches++;
      report('FATAL', courseId, 'RUNTIME_BINDING_MISMATCH',
        `Quest ${quest.id} renders "${quest.title}" but pilot day ${dayNum} is "${pilotDay.title}". The runtime is serving different content than the authored source.`);
    }
  }

  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : 0);

  return {
    courseId,
    title: course?.title ?? '(not in COURSES_REGISTRY)',
    exportName,
    exportShape: shape,

    days: days.length,
    blocks,
    blocksPerDay: days.length ? Math.round((blocks / days.length) * 10) / 10 : 0,

    duplicateBlockIds,
    duplicateBlockTitles: blockTitles.length - new Set(blockTitles).size,
    duplicateDiagnostics: questions.length - new Set(questions).size,

    authoredDistractorPct: pct(authoredDistractors, diagnostics),
    placeholderDistractorPct: pct(diagnostics - authoredDistractors, diagnostics),
    magicConstantPct: pct(magicConstants, diagnostics),
    bannerQuestionBlocks: bannerQuestions,

    conceptBudgetOverflowPct: pct(budgetOverflow, blocks),

    missingPrerequisites: missingPrereqs,
    prerequisiteEdges: prereqEdges,
    prerequisiteShape,
    maxInDegree,

    recoveryBranchesPerDiagnostic: diagnostics
      ? Math.round((diagnosisBranches / diagnostics) * 100) / 100 : 0,
    singleBranchDiagnosticPct: pct(singleBranch, diagnostics),
    boilerplateRecoveryPct: pct(boilerplateRecovery, recoveryPaths),

    distinctMisconceptions: misconceptions.size,
    misconceptionsPerBlock: Math.round(misconceptionsPerBlock * 100) / 100,
    topicShapedTaxonomy: topicShaped,
    meanTitleOverlap: Math.round(meanTitleOverlap * 100) / 100,
    lowMisconceptionDensity,

    transferTaskCoverage: transferTasks,
    realMilestoneCount: 0, // No Milestone entity exists yet (plan §6.4).

    mediaCodeLanguages,
    analogyBlocks,

    examQuests: examQuests.length,
    assignmentQuests: assignmentQuests.length,
    questsMissingTestSuite,
    starterLanguages,
    preSolvedPct: preSolvedMeasured ? pct(preSolved, preSolvedMeasured) : null,
    preSolvedMeasured,
    preSolvedUnmeasured,

    rawLatexFields: rawLatex,
    runtimeBindingMismatches,
  };
}

// ── Report rendering ───────────────────────────────────────────────────────

function renderMarkdown(metrics: CourseMetrics[], crossCourse: any): string {
  const lines: string[] = [];
  lines.push('# PinIT Career OS — Content QA Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('> Measured by importing the real TypeScript modules the application uses.');
  lines.push('> The loader runs `transpileOnly` — this report does **not** typecheck.');
  lines.push('> `npx tsc --noEmit` remains a separate mandatory gate.');
  lines.push('');

  const fatal = findings.filter((f) => f.severity === 'FATAL');
  const defects = findings.filter((f) => f.severity === 'DEFECT');
  lines.push(`**Courses:** ${metrics.length} · **Blocks:** ${metrics.reduce((a, m) => a + m.blocks, 0)} · ` +
    `**FATAL:** ${fatal.length} · **DEFECT:** ${defects.length}`);
  lines.push('');

  lines.push('## Per-course metrics');
  lines.push('');
  lines.push('| Course | Shape | Days | Blocks | B/day | Authored distractors | Magic const | Pre-solved (JS) | Budget >2 | Distinct MC | MC/block | Transfer | Analogy | Prereq shape | Binding |');
  lines.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const m of [...metrics].sort((a, b) => a.courseId.localeCompare(b.courseId))) {
    lines.push([
      m.courseId, m.exportShape, m.days, m.blocks, m.blocksPerDay,
      `${m.authoredDistractorPct}%`, `${m.magicConstantPct}%`,
      m.preSolvedPct === null ? 'unmeasured' : `${m.preSolvedPct}%`,
      `${m.conceptBudgetOverflowPct}%`,
      m.distinctMisconceptions, m.misconceptionsPerBlock,
      m.transferTaskCoverage, m.analogyBlocks, m.prerequisiteShape,
      m.runtimeBindingMismatches === 0 ? 'OK' : `${m.runtimeBindingMismatches} MISMATCH`,
    ].join(' | ').replace(/^/, '| ').concat(' |'));
  }
  lines.push('');

  lines.push('## Cross-course duplication');
  lines.push('');
  lines.push(`- Diagnostic questions appearing in more than one course: **${crossCourse.sharedQuestions.length}**`);
  for (const q of crossCourse.sharedQuestions.slice(0, 10)) {
    lines.push(`  - \`${q.courses}\` courses — "${q.question.slice(0, 100)}"`);
  }
  lines.push(`- Recovery explanations reused verbatim: **${crossCourse.reusedRecovery.length}** distinct strings`);
  for (const r of crossCourse.reusedRecovery.slice(0, 10)) {
    lines.push(`  - ${r.count}× — "${r.text.slice(0, 80)}"`);
  }
  lines.push('');

  if (fatal.length) {
    lines.push('## FATAL findings');
    lines.push('');
    for (const f of fatal) lines.push(`- **${f.code}** \`${f.courseId}\` — ${f.detail}`);
    lines.push('');
  }

  lines.push('## Defect findings by code');
  lines.push('');
  const byCode = new Map<string, Finding[]>();
  for (const f of defects) {
    if (!byCode.has(f.code)) byCode.set(f.code, []);
    byCode.get(f.code)!.push(f);
  }
  for (const [code, list] of [...byCode.entries()].sort((a, b) => b[1].length - a[1].length)) {
    lines.push(`- **${code}** — ${list.length} occurrence(s) across ${new Set(list.map((f) => f.courseId)).size} course(s)`);
  }
  lines.push('');

  return lines.join('\n');
}

// ── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  const outDir = path.join(__dirname);
  const registryById = new Map(COURSES_REGISTRY.map((c) => [c.id, c]));

  // Fail fast: every registry course must have an explicit binding, and vice versa.
  const boundIds = new Set(COURSE_BINDINGS.map((b) => b.courseId));
  for (const course of COURSES_REGISTRY) {
    if (!boundIds.has(course.id)) {
      report('FATAL', course.id, 'UNBOUND_COURSE',
        `Course is in COURSES_REGISTRY but has no explicit pilot binding in content-qa.ts.`);
    }
  }
  for (const binding of COURSE_BINDINGS) {
    if (!registryById.has(binding.courseId)) {
      report('FATAL', binding.courseId, 'ORPHAN_BINDING',
        `Binding exists but course is not in COURSES_REGISTRY.`);
    }
  }

  const metrics: CourseMetrics[] = [];
  for (const binding of COURSE_BINDINGS) {
    const course = registryById.get(binding.courseId);
    metrics.push(measureCourse(binding, course as Course));
  }

  const sharedQuestions = [...globalDiagnosticQuestions.entries()]
    .filter(([q, courses]) => q && courses.size > 1)
    .map(([question, courses]) => ({ question, courses: courses.size }))
    .sort((a, b) => b.courses - a.courses);

  const reusedRecovery = [...globalRecoveryText.entries()]
    .filter(([text, count]) => text && count > 1)
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count);

  const crossCourse = { sharedQuestions, reusedRecovery };

  const output = {
    generatedAt: new Date().toISOString(),
    harnessVersion: '0.1.0',
    typecheckPerformed: false,
    totals: {
      courses: metrics.length,
      blocks: metrics.reduce((a, m) => a + m.blocks, 0),
      fatal: findings.filter((f) => f.severity === 'FATAL').length,
      defects: findings.filter((f) => f.severity === 'DEFECT').length,
    },
    courses: metrics,
    crossCourse,
    findings,
  };

  fs.writeFileSync(path.join(outDir, 'content-qa.json'), JSON.stringify(output, null, 2), 'utf8');
  fs.writeFileSync(path.join(outDir, 'content-qa.md'), renderMarkdown(metrics, crossCourse), 'utf8');

  // ── Console summary ────────────────────────────────────────────────────
  console.log('');
  console.log('PinIT Content QA — measured from imported TypeScript modules');
  console.log('─'.repeat(78));
  console.log(
    'course'.padEnd(42) + 'blocks'.padStart(7) + 'distr%'.padStart(8) +
    'magic%'.padStart(8) + 'presolv'.padStart(9) + 'bind'.padStart(6));
  for (const m of metrics) {
    console.log(
      m.courseId.padEnd(42) +
      String(m.blocks).padStart(7) +
      String(m.authoredDistractorPct).padStart(8) +
      String(m.magicConstantPct).padStart(8) +
      (m.preSolvedPct === null ? 'n/a' : String(m.preSolvedPct)).padStart(9) +
      (m.runtimeBindingMismatches === 0 ? 'OK' : 'FAIL').padStart(6));
  }
  console.log('─'.repeat(78));
  console.log(`Total blocks: ${output.totals.blocks}`);
  console.log(`FATAL: ${output.totals.fatal}   DEFECT: ${output.totals.defects}`);
  console.log(`Wrote ${path.join(outDir, 'content-qa.json')}`);
  console.log(`Wrote ${path.join(outDir, 'content-qa.md')}`);

  // ── Baseline comparison (§2.1) ─────────────────────────────────────────
  const baselinePath = path.join(outDir, 'content-qa-baseline.json');
  if (process.argv.includes('--write-baseline')) {
    fs.writeFileSync(baselinePath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`Wrote baseline ${baselinePath}`);
    return;
  }
  if (!fs.existsSync(baselinePath)) {
    console.log('No baseline found. Run with --write-baseline to freeze the current measurement.');
    return;
  }

  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const baseByCourse = new Map<string, CourseMetrics>(
    baseline.courses.map((c: CourseMetrics) => [c.courseId, c]));
  const regressions: string[] = [];

  for (const m of metrics) {
    const b = baseByCourse.get(m.courseId);
    if (!b) { regressions.push(`${m.courseId}: new course with no baseline entry`); continue; }
    if (m.blocks < b.blocks) regressions.push(`${m.courseId}: blocks ${b.blocks} → ${m.blocks}`);
    if (m.authoredDistractorPct < b.authoredDistractorPct)
      regressions.push(`${m.courseId}: authored distractors ${b.authoredDistractorPct}% → ${m.authoredDistractorPct}%`);
    if (m.magicConstantPct > b.magicConstantPct)
      regressions.push(`${m.courseId}: magic constants ${b.magicConstantPct}% → ${m.magicConstantPct}%`);
    if ((m.preSolvedPct ?? 0) > (b.preSolvedPct ?? 0))
      regressions.push(`${m.courseId}: pre-solved ${b.preSolvedPct}% → ${m.preSolvedPct}%`);
    if (m.transferTaskCoverage < b.transferTaskCoverage)
      regressions.push(`${m.courseId}: transfer tasks ${b.transferTaskCoverage} → ${m.transferTaskCoverage}`);
    if (m.runtimeBindingMismatches > b.runtimeBindingMismatches)
      regressions.push(`${m.courseId}: runtime binding mismatches ${b.runtimeBindingMismatches} → ${m.runtimeBindingMismatches}`);
    if (m.missingPrerequisites > b.missingPrerequisites)
      regressions.push(`${m.courseId}: missing prerequisites ${b.missingPrerequisites} → ${m.missingPrerequisites}`);
  }

  if (output.totals.fatal > baseline.totals.fatal)
    regressions.push(`FATAL findings ${baseline.totals.fatal} → ${output.totals.fatal}`);

  if (regressions.length) {
    console.log('');
    console.log('REGRESSIONS vs baseline:');
    for (const r of regressions) console.log(`  - ${r}`);
    process.exitCode = 1;
  } else {
    console.log('');
    console.log('No regressions vs baseline.');
  }
}

main();
