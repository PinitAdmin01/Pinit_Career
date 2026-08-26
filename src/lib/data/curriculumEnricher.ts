export interface DayConfig {
  day?: number;
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export type { CourseQuest } from './coursesData';
import { CourseQuest } from './coursesData';
import { JAVA_PILOT_DAYS } from './javaPilotDays';
import { PYTHON_PILOT_DAYS } from './pythonPilotDays';
import { REACT_PILOT_DAYS } from './reactPilotDays';
import { DATABASE_PILOT_DAYS } from './databasePilotDays';
import { DSA_PILOT_DAYS } from './dsaPilotDays';
import { FULLSTACK_PILOT_DAYS } from './fullstackPilotDays';
import { CLOUD_PILOT_DAYS } from './cloudPilotDays';
import { DEVOPS_PILOT_DAYS } from './devopsPilotDays';
import { AI_PILOT_DAYS } from './aiPilotDays';
import { DISTRIBUTED_PILOT_DAYS } from './distributedPilotDays';
import { IOT_EMBEDDED_PILOT_DAYS } from './iotEmbeddedPilotDays';
import { GRAPHICS_3D_PILOT_DAYS } from './graphics3dPilotDays';
import { BLOCKCHAIN_PILOT_DAYS } from './blockchainPilotDays';
import { IOT_NETWORK_PILOT_DAYS } from './iotNetworkPilotDays';
import { IOT_EDGE_AI_PILOT_DAYS } from './iotEdgeAiPilotDays';
import { IOT_SECURITY_PILOT_DAYS } from './iotSecurityPilotDays';
import { QUANT_PILOT_DAYS } from './quantPilotDays';
import { BCOM_ACCOUNTING_PILOT_DAYS } from './bcomAccountingPilotDays';
import { BCOM_FINANCE_PILOT_DAYS } from './bcomFinancePilotDays';
import { BCOM_ANALYTICS_PILOT_DAYS } from './bcomAnalyticsPilotDays';
import { BCOM_MARKETING_PILOT_DAYS } from './bcomMarketingPilotDays';
import { BCOM_DIGITAL_MARKETING_PILOT_DAYS } from './bcomDigitalMarketingPilotDays';
import { BCOM_ECOMMERCE_PILOT_DAYS } from './bcomEcommercePilotDays';
import { BCOM_ENTREPRENEURSHIP_PILOT_DAYS } from './bcomEntrepreneurshipPilotDays';
import { BCOM_SALES_CRM_PILOT_DAYS } from './bcomSalesCrmPilotDays';
import { BCOM_OPERATIONS_PILOT_DAYS } from './bcomOperationsPilotDays';
import { BCOM_AI_TRANSFORMATION_PILOT_DAYS } from './bcomAiTransformationPilotDays';
import { COMPUTER_FUNDAMENTALS_PILOT_DAYS } from './computerFundamentalsPilotDays';
import { AI_PROMPT_LITERACY_PILOT_DAYS } from './aiPromptLiteracyPilotDays';
import { EXCEL_DATA_VIZ_PILOT_DAYS } from './excelDataVizPilotDays';
import { GIT_VERSION_CONTROL_PILOT_DAYS } from './gitVersionControlPilotDays';
import { SOFTSKILLS_PILOT_DAYS } from './softskillsPilotDays';
import { DESIGN_PILOT_DAYS } from './designPilotDays';
import { MOBILE_PILOT_DAYS } from './mobilePilotDays';
import { NLP_PILOT_DAYS } from './nlpPilotDays';
import { CYBER_PILOT_DAYS } from './cybersecurityPilotDays';

// ── Authoritative course → pilot-source registry ────────────────────────────
//
// FORENSIC NOTE (fixed): this registry replaces a 36-branch `prefix.includes(...)`
// chain that resolved a course's lesson content by substring search. Because
// checks ran in a fixed if/else order and `.includes()` matches ANYWHERE in the
// string, a short/generic key checked early could silently absorb an unrelated
// course whose prefix merely CONTAINED that substring:
//
//   prefix.includes('ai')  ←  checked before the 'blockchain' branch
//   'blockchain'.includes('ai') === true   (the "ai" inside "ch-AI-n")
//
// Every Blockchain quest therefore matched the AI branch first and every
// Blockchain lesson — title, metaphor, and full block content — was served
// from AI_PILOT_DAYS instead of BLOCKCHAIN_PILOT_DAYS. This was not a shift or
// an off-by-one: it was a complete, silent substitution of one course's
// curriculum for another's, for all 30 days.
//
// The fix is an EXACT match against a Record keyed by the literal prefix each
// `*30DayData.ts` file already passes to buildEnrichedDayQuests(). All 36
// prefixes are distinct strings (verified against the full corpus), so exact
// lookup eliminates this entire bug class with no call-site changes.
const PILOT_DAY_SOURCES: Record<string, unknown> = {
  'java-basics': JAVA_PILOT_DAYS,
  'python': PYTHON_PILOT_DAYS,
  'react-basics': REACT_PILOT_DAYS,
  'sql-mastery': DATABASE_PILOT_DAYS,
  'dsa-optim': DSA_PILOT_DAYS,
  'fullstack-js': FULLSTACK_PILOT_DAYS,
  'cloud-native': CLOUD_PILOT_DAYS,
  'devops': DEVOPS_PILOT_DAYS,
  'git_vcs': GIT_VERSION_CONTROL_PILOT_DAYS,
  'softskills': SOFTSKILLS_PILOT_DAYS,
  'design': DESIGN_PILOT_DAYS,
  'mobile': MOBILE_PILOT_DAYS,
  'nlp': NLP_PILOT_DAYS,
  'excel_viz': EXCEL_DATA_VIZ_PILOT_DAYS,
  'ai_prompt': AI_PROMPT_LITERACY_PILOT_DAYS,
  'comp_fund': COMPUTER_FUNDAMENTALS_PILOT_DAYS,
  'bcom_ait': BCOM_AI_TRANSFORMATION_PILOT_DAYS,
  'bcom_ops': BCOM_OPERATIONS_PILOT_DAYS,
  'bcom_scrm': BCOM_SALES_CRM_PILOT_DAYS,
  'bcom_ent': BCOM_ENTREPRENEURSHIP_PILOT_DAYS,
  'bcom_ecom': BCOM_ECOMMERCE_PILOT_DAYS,
  'bcom_dmkt': BCOM_DIGITAL_MARKETING_PILOT_DAYS,
  'bcom_mkt': BCOM_MARKETING_PILOT_DAYS,
  'bcom_ana': BCOM_ANALYTICS_PILOT_DAYS,
  'bcom_fin': BCOM_FINANCE_PILOT_DAYS,
  'bcom_acc': BCOM_ACCOUNTING_PILOT_DAYS,
  'quant': QUANT_PILOT_DAYS,
  'iot_sec': IOT_SECURITY_PILOT_DAYS,
  'iot_edge': IOT_EDGE_AI_PILOT_DAYS,
  'ai': AI_PILOT_DAYS,
  'dist': DISTRIBUTED_PILOT_DAYS,
  'iot_net': IOT_NETWORK_PILOT_DAYS,
  'iot_emb': IOT_EMBEDDED_PILOT_DAYS,
  'g3d': GRAPHICS_3D_PILOT_DAYS,
  'blockchain': BLOCKCHAIN_PILOT_DAYS,
  'cyber': CYBER_PILOT_DAYS,
};

/**
 * Recovers the exact course prefix and day number from a quest ID minted by
 * buildEnrichedDayQuests() below (`${prefix}-lecture1-day-${n}` /
 * `-exam-day-${n}` / `-assign-day-${n}`). This is the ONLY place this parse
 * happens — callers (e.g. the lesson page) must use this instead of
 * re-deriving "which course is this" from fuzzy keyword matching on the questId
 * or on already-rendered title text, which is the failure mode this replaced.
 */
export function parseQuestId(questId: string): { prefix: string; dayNum: number } | null {
  const match = (questId || '').match(/^(.+)-(?:lecture1|exam|assign)-day-(\d+)$/i);
  if (!match) return null;
  return { prefix: match[1], dayNum: parseInt(match[2], 10) };
}

/**
 * Resolves a single day's lesson plan for a course, by EXACT prefix and day
 * number. Never indexes a pilot-day source by array position — a source may be
 * `DayLessonPlan[]` (0-indexed, unrelated to the 1-based `day` field) or
 * `Record<number, DayLessonPlan>` (keyed by day number). `[dayNum]` on an array
 * silently returns the WRONG day (this was IoT Security's bug: `[1]` returned
 * the array's second element, i.e. Day 2's content, for all days 1-29).
 * `.find(p => p.day === dayNum)` is correct for both shapes and is the only
 * lookup used here.
 */
export function resolvePilotDay(prefix: string, dayNum: number): any {
  const source = PILOT_DAY_SOURCES[prefix];
  if (!source) return null;
  const days = Array.isArray(source) ? source : Object.values(source as Record<string, any>);
  return days.find((d: any) => d?.day === dayNum) ?? null;
}

export function buildEnrichedDayQuests(prefix: string, dayNum: number, cfg: DayConfig): CourseQuest[] {
  const pilotDay: any = resolvePilotDay(prefix, dayNum);

  // ── 1. Unified Socratic Adaptive Lesson ──────────────────────────────────
  const lessonTask: CourseQuest = {
    id: `${prefix}-lecture1-day-${dayNum}`,
    title: pilotDay ? `Day ${dayNum}: ${pilotDay.title}` : `Day ${dayNum}: ${cfg.title}`,
    desc: pilotDay ? pilotDay.overviewMetaphor : cfg.desc,
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: pilotDay
      ? pilotDay.blocks.map((b: any) => `${b.title}: ${b.conceptBudget.primaryConcept}`)
      : cfg.syllabus,
    skillCategory: 'theory',
    xp: 150,
    pins: 5
  };

  // ── 2. Pure Coding Exam ──────────────────────────────────────────────────
  const examTask: CourseQuest = {
    id: `${prefix}-exam-day-${dayNum}`,
    title: `Day ${dayNum} Exam: ${cfg.eTitle}`,
    desc: cfg.eDesc,
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: cfg.eStarter,
    hint: cfg.eHint,
    testSuite: cfg.eTest,
    skillCategory: 'programming',
    xp: 120,
    pins: 6
  };

  // ── 3. Pure Practice Assignment ──────────────────────────────────────────
  const assignmentTask: CourseQuest = {
    id: `${prefix}-assign-day-${dayNum}`,
    title: `Day ${dayNum} Assignment: ${cfg.aTitle}`,
    desc: cfg.aDesc,
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: cfg.aStarter,
    hint: cfg.aHint,
    testSuite: cfg.aTest,
    skillCategory: 'programming',
    xp: 150,
    pins: 8
  };

  // Return unified quest triad per day (Adaptive Lesson + Coding Exam + Practice Assignment)
  return [lessonTask, examTask, assignmentTask];
}
