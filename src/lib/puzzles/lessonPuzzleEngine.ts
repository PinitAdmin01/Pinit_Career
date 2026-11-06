/**
 * PinIT Career OS - Interactive 3D Lesson Puzzle & Rapid-Fire Battle Engine
 *
 * Standards:
 * 1. Every single lesson day (across all 53+ courses, Month 1 & Month 2) generates a 100% unique
 *    per-lesson 3D puzzle directly from that lesson's actual parts, code snippets, analogies, and checks.
 * 2. Supports both Slow Readers (plain-language explanations + real-world analogies) and Fast Readers
 *    (concise code invariants + rapid keyboard/click assembly).
 * 3. Realistic decoy blocks synthesized from the lesson's own Socratic misconception distractors.
 * 4. Exactly 5 rapid-fire MCQ questions answered within 60 seconds total.
 */

export interface PuzzleBlock {
  id: string;
  label: string;
  subtext?: string;
  color: 'emerald' | 'cyan' | 'amber' | 'purple' | 'rose' | 'indigo' | 'blue';
  category?: 'init' | 'logic' | 'condition' | 'transform' | 'output' | 'decoy' | 'debit' | 'credit' | 'audit' | 'security';
  badge?: string; // e.g., "DR", "CR", "HOOK", "SQL", "MMIO", "AST", "EVM"
  codeSnippet?: string;
  /** Everyday analogy from the lesson part for slow/visual readers */
  analogy?: string;
  /** Plain-language explanation of why this stage sits at this position in the 3D pipeline */
  explanation?: string;
}

export type PuzzleType =
  | 'code-reorder'
  | 'pipeline-router'
  | 'ledger-balancer'
  | 'architecture-flow'
  | 'decision-tree'
  | 'state-switcher';

export interface LessonPuzzleSpec {
  id: string;
  title: string;
  missionPrompt: string;
  type: PuzzleType;
  domain: string;
  blocks: PuzzleBlock[];
  correctOrder: string[]; // Ordered array of target block IDs
  decoyBlockIds?: string[];
  hint: string;
  successExplanation: string;
  /** Summary of the day's project milestone connected to this 3D architecture puzzle */
  projectConnection?: string;
}

export interface RapidBattleQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface RapidFireBattleSpec {
  title: string;
  timeLimitSeconds: number; // 60 seconds
  questions: RapidBattleQuestion[]; // Exactly 5 questions
  passScore: number; // Minimum correct to pass (4)
}

/**
 * Domain Classifier: Categorizes any course prefix or content into its precise domain.
 */
export function detectCourseDomain(prefix: string, title: string = '', textContent: string = ''): string {
  const p = prefix.toLowerCase();
  const raw = `${p} ${title} ${textContent}`.toLowerCase();

  // B.Com Commerce Domains - Exact Prefix First
  if (p === 'bcom_acc' || p === 'bcom-accounting') return 'accounting';
  if (p === 'bcom_fin' || p === 'bcom-finance') return 'finance';
  if (p === 'bcom_ban') return 'banking';
  if (p === 'bcom_aud') return 'auditing';
  if (p === 'bcom_tax') return 'taxation';
  if (p === 'bcom_law') return 'corporate-law';
  if (p === 'bcom_ops' || p === 'bcom_scrm') return 'supply-chain';
  if (p === 'bcom_dmkt') return 'digital-marketing';
  if (p === 'bcom_ecom') return 'ecommerce';
  if (p === 'bcom_mkt' || p === 'bcom-marketing') return 'marketing';
  if (p === 'bcom_ana') return 'analytics';
  if (p === 'bcom_ent') return 'entrepreneurship';
  if (p === 'bcom_ait') return 'enterprise-ai';

  // Keyword-based fallbacks for commerce
  if (p.includes('aud') || raw.includes('statutory audit') || raw.includes('sa 200') || raw.includes('sa 315') || raw.includes('sa 700') || raw.includes('substantive test')) return 'auditing';
  if (p.includes('ban') || raw.includes('banking operation') || raw.includes('credit appraisal') || raw.includes('swift mt') || raw.includes('letter of credit')) return 'banking';
  if (p.includes('tax') || raw.includes('gst input') || raw.includes('income tax act') || raw.includes('tds')) return 'taxation';
  if (p.includes('fin') || raw.includes('dcf valuation') || raw.includes('wacc') || raw.includes('capital market') || raw.includes('capm')) return 'finance';
  if (raw.includes('double-entry') || raw.includes('general ledger') || raw.includes('balance sheet equation')) return 'accounting';

  // Systems, Embedded & Hardware - Prefix First
  if (p.includes('iot') || p.includes('quant-systems')) return 'embedded-iot';
  if (p.includes('blockchain')) return 'blockchain';
  if (p.includes('cyber')) return 'cybersecurity';
  if (p.includes('devops') || p.includes('sre') || p.includes('cloud') || p.includes('aideploy')) return 'devops-cloud';

  // Core Tech Tracks - Prefix First
  if (p.includes('react')) return 'react';
  if (p.includes('mobile')) return 'mobile';
  if (p.includes('node') || p.includes('fullstack')) return 'nodejs';
  if (p.includes('sql')) return 'sql';
  if (p.includes('java')) return 'java';
  if (p.includes('g3d')) return '3d-graphics';
  if (p.includes('git')) return 'git-vcs';
  if (p.includes('soft')) return 'soft-skills';
  if (p.includes('comp_fund')) return 'comp-fund';
  if (p.includes('py') || p.includes('python')) return 'python';

  // Secondary Fallbacks via raw text
  if (raw.includes('microcontroller') || raw.includes('mmio') || raw.includes('gpio') || raw.includes('freertos')) return 'embedded-iot';
  if (raw.includes('solidity') || raw.includes('smart contract') || raw.includes('merkle')) return 'blockchain';
  if (raw.includes('tls handshake') || raw.includes('firewall acl') || raw.includes('jwt signature')) return 'cybersecurity';
  if (raw.includes('docker') || raw.includes('k8s') || raw.includes('kubernetes')) return 'devops-cloud';
  if (raw.includes('select ') && raw.includes('from ') && raw.includes('where ')) return 'sql';
  if (raw.includes('classloader') || raw.includes('public static void main')) return 'java';

  return 'general';
}

const DOMAIN_BADGE_PROGRESSION: Record<string, string[]> = {
  python: ['SETUP', 'PARSE', 'TRANSFORM', 'VERIFY', 'OUTPUT'],
  react: ['IMPORT', 'STATE', 'HOOK', 'EFFECT', 'RENDER'],
  mobile: ['SCREEN', 'STATE', 'GESTURE', 'BRIDGE', 'RENDER'],
  sql: ['SCHEMA', 'SELECT', 'JOIN/WHERE', 'GROUP BY', 'COMMIT'],
  java: ['CLASS', 'MEMORY', 'THREAD', 'DISPATCH', 'RETURN'],
  accounting: ['SOURCE DOC', 'DEBIT (DR)', 'CREDIT (CR)', 'RECONCILE', 'POST LEDGER'],
  finance: ['CASH FLOW', 'DISCOUNT', 'VALUATION', 'HEDGE', 'ALLOCATE'],
  banking: ['KYC/AML', 'APPRAISAL', 'COLLATERAL', 'SANCTION', 'DISBURSE'],
  auditing: ['SA 210 PLAN', 'SA 315 RISK', 'CONTROL TEST', 'SA 500 VOUCH', 'SA 700 OPINION'],
  taxation: ['GSTR-2B ITC', 'ASSESSMENT', 'OFFSET', 'COMPLIANCE', 'CHALLAN'],
  'corporate-law': ['NOTICE', 'QUORUM', 'RESOLUTION', 'MINUTES', 'ROC FILING'],
  'supply-chain': ['REQUISITION', 'PO ISSUE', 'GRN CHECK', '3-WAY MATCH', 'SETTLEMENT'],
  'digital-marketing': ['UTM TAG', 'FUNNEL PIXEL', 'SEGMENT', 'ATTRIBUTION', 'ROAS'],
  ecommerce: ['CART TOKEN', 'STOCK HOLD', 'GATEWAY', 'FULFILLMENT', 'DISPATCH'],
  marketing: ['RESEARCH', 'SEGMENT', 'POSITION', 'CHANNEL MIX', 'BRAND EQUITY'],
  analytics: ['INGEST', 'CLEANSE', 'MODEL', 'VALIDATE', 'VISUALIZE'],
  entrepreneurship: ['JTBD DISCOVERY', 'MVP BUILD', 'UNIT ECON', 'GTM LOOP', 'SCALE'],
  'enterprise-ai': ['INGEST', 'EMBED/RAG', 'GUARDRAIL', 'ORCHESTRATE', 'AUDIT'],
  'devops-cloud': ['LINT/BUILD', 'TEST GATE', 'CONTAINER', 'CANARY', 'PROMOTE'],
  'embedded-iot': ['CLOCK/RCC', 'GPIO/MMIO', 'ISR/DMA', 'PROTOCOL', 'TELEMETRY'],
  blockchain: ['CHECK', 'STATE EFFECT', 'INTERACT', 'GAS PACK', 'EMIT EVENT'],
  cybersecurity: ['THREAT ID', 'AUTH GUARD', 'CIPHER/KDF', 'ZERO TRUST', 'AUDIT SEAL'],
  nodejs: ['INGEST', 'AUTH/GUARD', 'SERVICE', 'PERSIST', 'RESPONSE'],
  'git-vcs': ['BRANCH', 'STAGE', 'COMMIT', 'REBASE', 'PUSH'],
  '3d-graphics': ['VERTICES', 'MATRICES', 'SHADER', 'RASTERIZE', 'FRAMEBUFFER'],
  'soft-skills': ['CONTEXT', 'STRUCTURE', 'EVIDENCE', 'ALIGNMENT', 'ACTION'],
  'comp-fund': ['FETCH', 'DECODE', 'ALU EXEC', 'CACHE/MMU', 'WRITEBACK'],
  general: ['INIT', 'VALIDATE', 'TRANSFORM', 'VERIFY', 'DELIVER'],
};

const DOMAIN_PUZZLE_TYPE: Record<string, PuzzleType> = {
  python: 'code-reorder',
  react: 'architecture-flow',
  mobile: 'architecture-flow',
  sql: 'code-reorder',
  java: 'architecture-flow',
  accounting: 'ledger-balancer',
  finance: 'pipeline-router',
  banking: 'decision-tree',
  auditing: 'architecture-flow',
  taxation: 'ledger-balancer',
  'corporate-law': 'decision-tree',
  'supply-chain': 'pipeline-router',
  'digital-marketing': 'pipeline-router',
  ecommerce: 'pipeline-router',
  'devops-cloud': 'pipeline-router',
  'embedded-iot': 'architecture-flow',
  blockchain: 'state-switcher',
  cybersecurity: 'architecture-flow',
  nodejs: 'code-reorder',
  'git-vcs': 'code-reorder',
};

/**
 * Step 1: Deep Content & Structure Extractor
 */
export function extractLessonConceptSummary(lessonData: any, coursePrefix: string = ''): {
  domain: string;
  title: string;
  concepts: string[];
  codeSnippets: string[];
  keyTerms: string[];
  firstCodeLines: string[];
} {
  const title = lessonData?.title || 'Daily Concept Mastery';
  const parts = Array.isArray(lessonData?.parts) ? lessonData.parts : [];
  const effectivePrefix = coursePrefix || lessonData?.coursePrefix || lessonData?.course || '';

  const concepts: string[] = [];
  const codeSnippets: string[] = [];
  const keyTerms: string[] = [];
  const firstCodeLines: string[] = [];

  for (const p of parts) {
    if (p.title) concepts.push(p.title);
    if (p.code) {
      codeSnippets.push(p.code);
      const cleanLine = p.code
        .split('\n')
        .map((l: string) => l.trim())
        .find((l: string) => l.length > 3 && !l.startsWith('//') && !l.startsWith('#') && !l.startsWith('import ') && !l.startsWith('#include'));
      if (cleanLine) firstCodeLines.push(cleanLine);
    }
    if (p.check?.question) keyTerms.push(p.check.question);
  }

  const domain = detectCourseDomain(effectivePrefix, title, `${concepts.join(' ')} ${codeSnippets.join(' ')}`);
  return { domain, title, concepts, codeSnippets, keyTerms, firstCodeLines };
}

/**
 * Synthesizes a 100% Lesson-Specific 3D Puzzle directly from a LongLesson's parts.
 * Ensures every single day across all 53+ courses has its own unique 3D puzzle
 * teaching ONLY the concepts, code, and analogies covered in that lesson.
 */
function buildPerLesson3DPuzzleFromParts(
  prefix: string,
  dayNum: number,
  domain: string,
  lessonData: any
): LessonPuzzleSpec {
  const parts: any[] = lessonData.parts.slice(0, 5);
  const colors: Array<PuzzleBlock['color']> = ['emerald', 'cyan', 'amber', 'purple', 'indigo'];
  const badges = DOMAIN_BADGE_PROGRESSION[domain] || DOMAIN_BADGE_PROGRESSION.general;
  const puzzleType: PuzzleType = DOMAIN_PUZZLE_TYPE[domain] || 'pipeline-router';

  const blockList: PuzzleBlock[] = [];
  const order: string[] = [];

  parts.forEach((p: any, idx: number) => {
    const bId = `step-${dayNum}-${idx + 1}`;
    const rawPartTitle = String(p.title || `Stage ${idx + 1}`)
      .replace(/^(part\s*\d+\s*[:\-–.]?\s*)/i, '')
      .trim();
    const shortTitle = rawPartTitle.length > 48 ? rawPartTitle.slice(0, 45).trim() + '…' : rawPartTitle;

    // Extract meaningful executable code line for fast readers
    let codeLine = '';
    if (p.code) {
      const candidateLines = String(p.code)
        .split('\n')
        .map((l: string) => l.trim())
        .filter(
          (l: string) =>
            l.length > 4 &&
            !l.startsWith('//') &&
            !l.startsWith('#') &&
            !l.startsWith('/*') &&
            !l.startsWith('*') &&
            !l.startsWith('import ') &&
            !l.startsWith('from ') &&
            !l.startsWith('#include')
        );
      codeLine = candidateLines[0] || '';
      if (codeLine.length > 68) codeLine = codeLine.slice(0, 65) + '…';
    }

    // Extract plain-language explanation & analogy for slow readers
    const sayParagraphs = Array.isArray(p.say) ? p.say : typeof p.say === 'string' ? [p.say] : [];
    const firstSentence = (sayParagraphs[0] || '')
      .split(/(?<=[.!?])\s+/)[0]
      ?.trim() || `Master ${rawPartTitle} in the ${lessonData.title} workflow.`;
    const analogyText = p.example ? String(p.example).trim() : undefined;

    const category: PuzzleBlock['category'] =
      idx === 0
        ? domain === 'accounting' || domain === 'taxation'
          ? 'debit'
          : 'init'
        : idx === parts.length - 1
        ? domain === 'accounting' || domain === 'taxation'
          ? 'credit'
          : 'output'
        : idx === 1
        ? 'condition'
        : 'transform';

    blockList.push({
      id: bId,
      label: `${idx + 1}. ${shortTitle}`,
      subtext: codeLine || (analogyText ? analogyText.slice(0, 68) : firstSentence.slice(0, 68)),
      color: colors[idx % colors.length],
      category,
      badge: badges[idx % badges.length],
      codeSnippet: p.code ? String(p.code).split('\n').slice(0, 6).join('\n') : undefined,
      analogy: analogyText,
      explanation: p.check?.why || p.check?.explanation || firstSentence,
    });
    order.push(bId);
  });

  // Extract a lesson-specific decoy from one of the wrong MCQ options in this lesson!
  let decoySubtext = 'Execute downstream output before initializing prerequisite state and validation guards';
  let decoyExplanation = 'This block represents a critical anti-pattern taught in today’s lesson.';
  for (const p of parts) {
    const chk = p.check;
    if (chk && Array.isArray(chk.options) && chk.options.length >= 2) {
      const correctIdx = typeof chk.answer === 'number' ? chk.answer : chk.answerIndex ?? 0;
      const wrongOpt = chk.options.find((_: string, i: number) => i !== correctIdx && _.length >= 12);
      if (wrongOpt) {
        decoySubtext = wrongOpt.length > 74 ? wrongOpt.slice(0, 71) + '…' : wrongOpt;
        decoyExplanation = chk.why || chk.explanation || decoyExplanation;
        break;
      }
    }
  }

  const decoyId = `decoy-${dayNum}-trap`;
  blockList.push({
    id: decoyId,
    label: `Decoy Trap: Anti-Pattern Violation`,
    subtext: decoySubtext,
    color: 'rose',
    category: 'decoy',
    badge: 'ANTI-PATTERN',
    explanation: `Why this is a trap: ${decoyExplanation}`,
  });

  const cleanLessonTitle = String(lessonData.title || `Day ${dayNum}`)
    .replace(/^Day\s+\d+\s*[:\-–]\s*/i, '')
    .trim();

  const firstPartName = String(parts[0]?.title || 'Initialization').replace(/^(part\s*\d+\s*[:\-–.]?\s*)/i, '');
  const lastPartName = String(parts[parts.length - 1]?.title || 'Final Verification').replace(/^(part\s*\d+\s*[:\-–.]?\s*)/i, '');

  return {
    id: `puzzle-${prefix}-${dayNum}`,
    title: `Day ${dayNum} 3D Architecture Puzzle: ${cleanLessonTitle}`,
    missionPrompt: `Construct the 3D execution pipeline for "${cleanLessonTitle}" in the exact 5-stage progression taught today, while rejecting the anti-pattern decoy cube!`,
    type: puzzleType,
    domain,
    blocks: blockList,
    correctOrder: order,
    decoyBlockIds: [decoyId],
    hint: `Start with Stage 1 ("${firstPartName}"), progress through the intermediate transformations, and finish with Stage ${parts.length} ("${lastPartName}"). Avoid the rose-colored Anti-Pattern decoy!`,
    successExplanation:
      lessonData.summary && Array.isArray(lessonData.summary) && lessonData.summary.length > 0
        ? `3D Architecture Verified! ${lessonData.summary[0]}`
        : `All ${order.length} stages of "${cleanLessonTitle}" are locked into the 3D pipeline in deterministic order.`,
    projectConnection: lessonData.projectStep?.title
      ? `Project Milestone: ${lessonData.projectStep.title}`
      : undefined,
  };
}

/**
 * Step 2: Generate a 100% Tailored 3D Puzzle for Any Lesson
 */
export function generateLessonPuzzle(
  questId: string,
  prefix: string,
  dayNum: number,
  lessonData: any
): LessonPuzzleSpec {
  // 1. If explicitly authored in lesson data, use it directly
  if (
    lessonData?.puzzle &&
    Array.isArray(lessonData.puzzle.blocks) &&
    Array.isArray(lessonData.puzzle.correctOrder) &&
    lessonData.puzzle.blocks.length >= 3
  ) {
    return lessonData.puzzle;
  }

  const summary = extractLessonConceptSummary(lessonData, prefix);
  const parts = Array.isArray(lessonData?.parts) ? lessonData.parts : [];
  const domain = summary.domain;

  // 2. PRIMARY PATH: Whenever the lesson has >= 3 real parts (all 2,820 LongLessons across 53+ courses),
  // build an authentic per-lesson 3D puzzle directly from that day's parts, code, analogies, and checks!
  if (parts.length >= 3) {
    return buildPerLesson3DPuzzleFromParts(prefix, dayNum, domain, lessonData);
  }

  // -------------------------------------------------------------------------
  // DOMAIN FALLBACKS (Used only when lessonData is null or lacks parts[])
  // -------------------------------------------------------------------------
  if (domain === 'python') {
    if (dayNum === 1) {
      return {
        id: `puzzle-${prefix}-${dayNum}`,
        title: "Day 1 Python Puzzle: The Script Execution Pipeline",
        missionPrompt: "Snap the instruction blocks in chronological order so Python initializes the app name, creates the welcome message, and displays the output!",
        type: 'code-reorder',
        domain: 'python',
        blocks: [
          { id: 'py1', label: '# 1. Variable Assignment', subtext: 'app_name = "CareerOS"', color: 'emerald', category: 'init', badge: 'SETUP', codeSnippet: 'app_name = "CareerOS"' },
          { id: 'py2', label: '# 2. String Concatenation', subtext: 'msg = "Starting " + app_name', color: 'cyan', category: 'transform', badge: 'LOGIC', codeSnippet: 'msg = "Starting " + app_name' },
          { id: 'py3', label: '# 3. Standard Output', subtext: 'print(msg)', color: 'purple', category: 'output', badge: 'PRINT', codeSnippet: 'print(msg)' },
          { id: 'decoy1', label: '# Decoy: NameError Bug', subtext: 'print(undefined_token)', color: 'rose', category: 'decoy', badge: 'CRASH', codeSnippet: 'print(undefined_token)' },
        ],
        correctOrder: ['py1', 'py2', 'py3'],
        decoyBlockIds: ['decoy1'],
        hint: "Python reads line-by-line from top to bottom. You must define a variable before you can concatenate or print it!",
        successExplanation: "Execution sequence verified: `app_name` defined, string concatenated, and cleanly printed to stdout."
      };
    }
    if (dayNum <= 5) {
      return {
        id: `puzzle-${prefix}-${dayNum}`,
        title: `Day ${dayNum} Python Puzzle: Mathematical & Conditional Flow`,
        missionPrompt: "Arrange the arithmetic operations to compute the base price, calculate tax, sum the total, and output the invoice!",
        type: 'code-reorder',
        domain: 'python',
        blocks: [
          { id: 'p1', label: '1. Initialize Subtotal', subtext: 'subtotal = 100.0', color: 'emerald', category: 'init', badge: 'INIT' },
          { id: 'p2', label: '2. Compute 18% GST', subtext: 'tax = subtotal * 0.18', color: 'cyan', category: 'transform', badge: 'MATH' },
          { id: 'p3', label: '3. Calculate Grand Total', subtext: 'grand_total = subtotal + tax', color: 'amber', category: 'logic', badge: 'SUM' },
          { id: 'p4', label: '4. Print Result', subtext: 'print(f"Total: {grand_total}")', color: 'purple', category: 'output', badge: 'OUTPUT' },
          { id: 'decoy1', label: 'Decoy: Undefined Reference', subtext: 'grand_total = subtotal + tax  # (Before tax defined)', color: 'rose', category: 'decoy', badge: 'BUG' },
        ],
        correctOrder: ['p1', 'p2', 'p3', 'p4'],
        decoyBlockIds: ['decoy1'],
        hint: "Mathematical dependencies: Subtotal must exist before calculating tax, and both are needed before computing grand total.",
        successExplanation: "Chronological pipeline verified: All arithmetic expressions executed with zero NameErrors."
      };
    }
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Python Puzzle: Function Definition & Invocation`,
      missionPrompt: "Assemble the modular function structure: define parameters, execute validation, return the transformed payload, and invoke!",
      type: 'code-reorder',
      domain: 'python',
      blocks: [
        { id: 'fn1', label: '1. Define Function', subtext: 'def calculate_metric(values: list):', color: 'emerald', category: 'init', badge: 'DEF' },
        { id: 'fn2', label: '2. Guard Clause', subtext: 'if not values: return 0.0', color: 'cyan', category: 'condition', badge: 'GUARD' },
        { id: 'fn3', label: '3. Computation', subtext: 'result = sum(values) / len(values)', color: 'amber', category: 'transform', badge: 'CALC' },
        { id: 'fn4', label: '4. Return Statement', subtext: 'return round(result, 2)', color: 'purple', category: 'output', badge: 'RETURN' },
        { id: 'fn5', label: '5. Function Call', subtext: 'score = calculate_metric([85, 92, 78])', color: 'indigo', category: 'logic', badge: 'CALL' },
        { id: 'decoy1', label: 'Decoy: Call Before Definition', subtext: 'score = calculate_metric() # (Before def)', color: 'rose', category: 'decoy', badge: 'NAME_ERR' },
      ],
      correctOrder: ['fn1', 'fn2', 'fn3', 'fn4', 'fn5'],
      decoyBlockIds: ['decoy1'],
      hint: "Functions in Python must be defined before they can be called. Guard clauses protect against division by zero.",
      successExplanation: "Modular function pipeline verified: Definition -> Guard -> Calculation -> Return -> Call."
    };
  }

  if (domain === 'react' || domain === 'mobile') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} React Puzzle: Declarative Hook Lifecycle`,
      missionPrompt: "Snap the React component blocks into a valid declarative rendering sequence complying with the Rules of Hooks!",
      type: 'architecture-flow',
      domain: 'react',
      blocks: [
        { id: 'r1', label: '1. Hook Imports', subtext: 'import { useState, useEffect } from "react";', color: 'cyan', category: 'init', badge: 'IMPORT' },
        { id: 'r2', label: '2. Component Header', subtext: 'export default function DataDashboard({ userId }) {', color: 'emerald', category: 'init', badge: 'COMPONENT' },
        { id: 'r3', label: '3. Top-Level State', subtext: 'const [records, setRecords] = useState([]);', color: 'amber', category: 'logic', badge: 'STATE' },
        { id: 'r4', label: '4. Side Effect Hook', subtext: 'useEffect(() => { loadUserData(userId); }, [userId]);', color: 'indigo', category: 'transform', badge: 'EFFECT' },
        { id: 'r5', label: '5. Return JSX Template', subtext: 'return <main><RecordList items={records} /></main>;', color: 'purple', category: 'output', badge: 'RENDER' },
        { id: 'decoy1', label: 'Decoy: Conditional Hook Violation', subtext: 'if (userId) { useState(null); }', color: 'rose', category: 'decoy', badge: 'HOOK_CRASH' },
      ],
      correctOrder: ['r1', 'r2', 'r3', 'r4', 'r5'],
      decoyBlockIds: ['decoy1'],
      hint: "Rules of Hooks: Never call Hooks inside loops or conditions. Declare state and effects at the top level before returning JSX.",
      successExplanation: "React component architecture validated: Rules of Hooks satisfied and declarative data flow intact."
    };
  }

  if (domain === 'sql') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} SQL Puzzle: Relational Query Pipeline`,
      missionPrompt: "Arrange the SQL clauses in the exact syntactic order mandated by the database query execution planner!",
      type: 'code-reorder',
      domain: 'sql',
      blocks: [
        { id: 'sq1', label: '1. SELECT Projection', subtext: 'SELECT customer_id, SUM(order_total) AS revenue', color: 'emerald', category: 'init', badge: 'SELECT' },
        { id: 'sq2', label: '2. FROM Table Relation', subtext: 'FROM orders', color: 'cyan', category: 'init', badge: 'FROM' },
        { id: 'sq3', label: '3. WHERE Row Filter', subtext: 'WHERE order_status = "COMPLETED"', color: 'amber', category: 'condition', badge: 'WHERE' },
        { id: 'sq4', label: '4. GROUP BY Aggregation', subtext: 'GROUP BY customer_id', color: 'purple', category: 'transform', badge: 'GROUP BY' },
        { id: 'sq5', label: '5. HAVING Aggregate Filter', subtext: 'HAVING SUM(order_total) >= 10000', color: 'indigo', category: 'condition', badge: 'HAVING' },
        { id: 'decoy1', label: 'Decoy: Invalid WHERE on Aggregates', subtext: 'WHERE SUM(order_total) >= 10000  # (Invalid SQL)', color: 'rose', category: 'decoy', badge: 'SYNTAX_ERR' },
      ],
      correctOrder: ['sq1', 'sq2', 'sq3', 'sq4', 'sq5'],
      decoyBlockIds: ['decoy1'],
      hint: "SQL query parser order: SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY. Aggregates cannot be filtered in WHERE!",
      successExplanation: "SQL execution pipeline verified: Projection, table source, row predicate, grouping, and group predicate."
    };
  }

  if (domain === 'java') {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Java Puzzle: JVM Lifecycle & Bytecode Execution`,
      missionPrompt: "Order the JVM execution stages from source code compilation through bytecode verification and classloading!",
      type: 'architecture-flow',
      domain: 'java',
      blocks: [
        { id: 'jv1', label: '1. Source Compilation', subtext: 'javac OrderService.java -> OrderService.class', color: 'emerald', category: 'init', badge: 'JAVAC' },
        { id: 'jv2', label: '2. ClassLoader Ingestion', subtext: 'Bootstrap/AppClassLoader loads bytecode into Metaspace', color: 'cyan', category: 'init', badge: 'LOADER' },
        { id: 'jv3', label: '3. Bytecode Verification', subtext: 'JVM Verifier ensures type safety and stack frame bounds', color: 'amber', category: 'condition', badge: 'VERIFY' },
        { id: 'jv4', label: '4. JIT Tiered Compilation', subtext: 'C1/C2 JIT compiles hot loops to native x86/ARM machine code', color: 'purple', category: 'transform', badge: 'JIT' },
        { id: 'jv5', label: '5. Execution Engine', subtext: 'Thread allocates Stack Frame and invokes main() method', color: 'indigo', category: 'output', badge: 'EXEC' },
        { id: 'decoy1', label: 'Decoy: Direct Native Execution', subtext: 'CPU directly executes .class bytecode without JVM', color: 'rose', category: 'decoy', badge: 'IMPOSSIBLE' },
      ],
      correctOrder: ['jv1', 'jv2', 'jv3', 'jv4', 'jv5'],
      decoyBlockIds: ['decoy1'],
      hint: "Java achieves platform independence via write-once-run-anywhere: Source -> Bytecode -> ClassLoader -> Verification -> JIT -> Native Execution.",
      successExplanation: "JVM architectural lifecycle validated: Clean separation between static bytecode and runtime execution engine."
    };
  }

  // Generic fallback when lessonData has < 3 parts
  const blockList: PuzzleBlock[] = [
    { id: 'b1', label: '1. Initialize Input Context', subtext: 'Acquire verified operational parameters', color: 'emerald', category: 'init', badge: 'INIT' },
    { id: 'b2', label: '2. Validate Domain Constraints', subtext: 'Enforce schema & boundary invariants', color: 'cyan', category: 'condition', badge: 'GUARD' },
    { id: 'b3', label: '3. Execute Core Transformation', subtext: 'Apply business logic & state computation', color: 'amber', category: 'transform', badge: 'LOGIC' },
    { id: 'b4', label: '4. Verify & Deliver Output', subtext: 'Ensure deterministic result delivery', color: 'purple', category: 'output', badge: 'DELIVER' },
    { id: 'decoy1', label: 'Decoy: Premature Output Delivery', subtext: 'Deliver unverified payload before transformation completes', color: 'rose', category: 'decoy', badge: 'ERROR' }
  ];

  return {
    id: `puzzle-${prefix}-${dayNum}`,
    title: `Day ${dayNum} 3D Puzzle: ${summary.title.slice(0, 48)}`,
    missionPrompt: `Arrange the operational blocks in chronological order to complete today's 3D architecture challenge!`,
    type: DOMAIN_PUZZLE_TYPE[domain] || 'pipeline-router',
    domain,
    blocks: blockList,
    correctOrder: ['b1', 'b2', 'b3', 'b4'],
    decoyBlockIds: ['decoy1'],
    hint: "Remember: Input initialization and guard validation must precede core transformation and final delivery.",
    successExplanation: "Execution sequence verified: All operations succeeded deterministically."
  };
}

/**
 * Step 3 & 4: Rapid-Fire MCQ Battle Generator (5 questions in 60 seconds)
 */
export function generateRapidFireBattle(
  questId: string,
  prefix: string,
  dayNum: number,
  lessonData: any
): RapidFireBattleSpec {
  if (lessonData?.rapidBattle && Array.isArray(lessonData.rapidBattle.questions) && lessonData.rapidBattle.questions.length >= 5) {
    return {
      title: lessonData.rapidBattle.title || `Day ${dayNum} 60-Second Boss Battle`,
      timeLimitSeconds: 60,
      questions: lessonData.rapidBattle.questions.slice(0, 5),
      passScore: 4,
    };
  }

  const questions: RapidBattleQuestion[] = [];
  const parts = Array.isArray(lessonData?.parts) ? lessonData.parts : [];

  // Extract from parts check questions
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const chk = p.check;
    if (chk && chk.question && Array.isArray(chk.options) && chk.options.length >= 2) {
      const opts: [string, string, string, string] = [
        chk.options[0] || 'Option A',
        chk.options[1] || 'Option B',
        chk.options[2] || (chk.options.length > 2 ? chk.options[2] : 'None of the above'),
        chk.options[3] || (chk.options.length > 3 ? chk.options[3] : 'All of the above')
      ];
      questions.push({
        id: `battle-q-${i + 1}`,
        question: chk.question.length > 95 ? chk.question.slice(0, 92) + '...' : chk.question,
        options: opts,
        correctIndex: typeof chk.answer === 'number' ? chk.answer : (chk.answerIndex ?? 0),
        explanation: chk.why || chk.explanation || 'Optimal architectural invariant confirmed.'
      });
    }
    if (questions.length >= 5) break;
  }

  const domain = detectCourseDomain(prefix, lessonData?.title || '');
  const domainReflexes: Record<string, Array<{ q: string; opts: [string, string, string, string]; ans: number; why: string }>> = {
    accounting: [
      { q: "Under double-entry rules, which entry increases an Asset account?", opts: ["Debit entry", "Credit entry", "Footnote annotation", "Depreciation deduction"], ans: 0, why: "Assets and expenses increase with a Debit; liabilities, equity, and revenues increase with a Credit." },
      { q: "What does the Revenue Recognition Matching Principle mandate?", opts: ["Recognize expenses in the same period as the revenues they generate", "Recognize revenue only when cash is deposited", "Never recognize liabilities", "Record tax only once every decade"], ans: 0, why: "Matching principle pairs expenses directly with the related revenues recognized in that accounting period." },
      { q: "Where does unearned upfront subscription revenue sit on the balance sheet?", opts: ["Current Liabilities", "Operating Expenses", "Cash Inflow on P&L", "Share Capital"], ans: 0, why: "Unearned revenue is an obligation/liability until the service is delivered." },
      { q: "What is the primary equation of the Balance Sheet?", opts: ["Assets = Liabilities + Equity", "Assets = Liabilities - Equity", "Assets = Gross Profit", "Assets = Net Income"], ans: 0, why: "The fundamental accounting equation is Assets = Liabilities + Equity." },
      { q: "What document proves that transactions occurred before journal entry?", opts: ["Supporting Voucher / Source Document", "Trial Balance", "Bank Passbook", "Director's Report"], ans: 0, why: "Every journal entry must be supported by an authentic source document (voucher/invoice)." }
    ],
    finance: [
      { q: "In DCF modeling, what discount rate reflects firm-wide financing cost?", opts: ["WACC (Weighted Average Cost of Capital)", "Treasury Bill coupon rate", "Prime Lending Rate", "Gross Profit Margin"], ans: 0, why: "WACC weights both equity and after-tax debt costs to discount enterprise cash flows." },
      { q: "When evaluating mutually exclusive capital projects, which metric is superior?", opts: ["Net Present Value (NPV)", "Payback Period", "Accounting Rate of Return", "Gross Margin"], ans: 0, why: "NPV directly measures absolute shareholder wealth creation in currency terms." },
      { q: "What does a high Beta (> 1.0) imply in the CAPM model?", opts: ["The asset has higher systematic volatility than the market", "The asset has zero risk", "The asset is completely risk-free", "The company has zero debt"], ans: 0, why: "Beta > 1.0 indicates greater sensitivity to macroeconomic market movements." },
      { q: "What is Free Cash Flow to Firm (FCFF)?", opts: ["Cash generated from operations available to all capital providers", "Net profit before salaries", "Dividends paid to founders", "Cash sitting in bank lockers"], ans: 0, why: "FCFF represents unlevered operational cash after operating expenses, taxes, and CapEx." },
      { q: "What is the primary goal of financial management?", opts: ["Maximizing long-term shareholder intrinsic value", "Maximizing quarterly sales at any cost", "Avoiding all forms of debt", "Hiring the largest team"], ans: 0, why: "Modern corporate finance focuses on maximizing sustainable shareholder value." }
    ]
  };

  const reflexes = domainReflexes[domain] || [
    { q: "What is the primary purpose of writing modular code?", opts: ["Improves reusability, testability and cognitive clarity", "Makes file size larger", "Required to access the internet", "Prevents comments from compiling"], ans: 0, why: "Modular code separates concerns and makes systems maintainable." },
    { q: "What occurs when an instruction contains an uncaught syntax error?", opts: ["The interpreter/compiler throws an error and execution halts", "The computer ignores it and guesses", "The code runs 10x faster", "The screen brightness changes"], ans: 0, why: "Syntax errors violate language grammar rules and stop execution." },
    { q: "What does deterministic execution mean?", opts: ["Given the same inputs, it always produces identical outputs", "It changes randomly every time", "It runs only on Sundays", "It deletes variables automatically"], ans: 0, why: "Deterministic logic guarantees predictable, repeatable outputs for any valid input." },
    { q: "Why are guard clauses and input validations placed at the start of functions?", opts: ["To catch invalid edge cases early before expensive computation", "To slow down the CPU", "To hide variables from the caller", "Because return statements only work on line 1"], ans: 0, why: "Fail-fast guard clauses prevent corrupted state and division/null errors downstream." },
    { q: "Why should secrets and API keys never be hardcoded in source files?", opts: ["Anyone with repository access can extract and abuse credentials", "They make strings too long", "Compilers reject uppercase letters", "Environment variables are slower"], ans: 0, why: "Hardcoded credentials in version control are a critical security vulnerability." }
  ];

  let rIdx = 0;
  while (questions.length < 5) {
    const item = reflexes[rIdx % reflexes.length];
    questions.push({
      id: `battle-fallback-${questions.length + 1}`,
      question: item.q,
      options: item.opts,
      correctIndex: item.ans,
      explanation: item.why
    });
    rIdx++;
  }

  return {
    title: `Day ${dayNum} 60-Second Rapid-Fire Mastery Battle`,
    timeLimitSeconds: 60,
    questions: questions.slice(0, 5),
    passScore: 4,
  };
}
