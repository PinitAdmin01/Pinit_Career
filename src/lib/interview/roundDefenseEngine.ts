/**
 * Reusable 5-Question Post-Submission Defense Engine
 *
 * Powers both Tech (Round 2 Code, Round 3 Architecture) and Non-Tech / B.Com
 * (Round 2 Business/Accounting Case Desk, Round 3 Finance/Business Workflow Canvas).
 *
 * Invariants:
 * 1. Exactly 5 targeted questions are asked strictly after the candidate submits their work.
 * 2. Every answer is graded (PASS vs FAIL) using LLM signal + deterministic anti-bluff guard.
 * 3. Passing all 5 questions unlocks the next round.
 * 4. Failing any question prevents advancing: once the 5-question defense concludes with
 *    passedCount < 5, the AI interviewer announces elimination and forcefully ends the session.
 */

import { isTrivialOrNonSubstantiveAnswer, SKIP_TURN_REGEX } from './postInterviewInsights';

export const DEFENSE_TOTAL_QUESTIONS = 5;

export type DefenseRoundType = 'code' | 'case' | 'architecture' | 'workflow';

export type DefenseQuestionVerdict = 'pending' | 'passed' | 'failed';

export interface DefenseQuestionRecord {
  questionNumber: number;
  question: string;
  answer: string;
  verdict: DefenseQuestionVerdict;
  reason?: string;
}

export interface RoundDefenseState {
  active: boolean;
  roundNumber: 2 | 3;
  roundType: DefenseRoundType;
  totalQuestions: number;
  currentQuestionNumber: number; // 1..5 while active
  passedCount: number;
  failedCount: number;
  status: 'idle' | 'in_progress' | 'passed' | 'eliminated';
  records: DefenseQuestionRecord[];
  eliminationReason?: string;
}

export function createInitialDefenseState(
  roundNumber: 2 | 3,
  roundType: DefenseRoundType
): RoundDefenseState {
  return {
    active: false,
    roundNumber,
    roundType,
    totalQuestions: DEFENSE_TOTAL_QUESTIONS,
    currentQuestionNumber: 0,
    passedCount: 0,
    failedCount: 0,
    status: 'idle',
    records: [],
  };
}

export function startRoundDefense(
  roundNumber: 2 | 3,
  roundType: DefenseRoundType,
  openingQuestion: string
): RoundDefenseState {
  return {
    active: true,
    roundNumber,
    roundType,
    totalQuestions: DEFENSE_TOTAL_QUESTIONS,
    currentQuestionNumber: 1,
    passedCount: 0,
    failedCount: 0,
    status: 'in_progress',
    records: [
      {
        questionNumber: 1,
        question: openingQuestion,
        answer: '',
        verdict: 'pending',
      },
    ],
  };
}

/**
 * Deterministic + LLM hybrid grading of a candidate's answer to a defense question.
 * Guarantees that refusals ("i don't know", "skip"), bare greetings ("hi"), and empty/bluff
 * replies can NEVER sneak through as PASS even if an LLM is lenient or offline.
 */
export function evaluateDefenseTurnPass(
  candidateAnswer: string,
  llmGrade?: 'PASS' | 'FAIL' | null
): { passed: boolean; reason: string } {
  const trimmed = String(candidateAnswer || '').trim();
  if (!trimmed) {
    return { passed: false, reason: 'Empty response provided.' };
  }
  if (SKIP_TURN_REGEX.test(trimmed)) {
    return { passed: false, reason: 'Candidate skipped the defense question.' };
  }
  if (isTrivialOrNonSubstantiveAnswer(trimmed)) {
    return { passed: false, reason: 'Non-substantive greeting, refusal, or "I don\'t know" response.' };
  }

  const lower = trimmed.toLowerCase();
  const explicitRefusal =
    /\b(i\s+don'?t\s+know|dont\s+know|no\s+idea|cannot\s+answer|can'?t\s+answer|not\s+sure|blanking|pass\s+on\s+this|skip\s+this|no\s+clue)\b/i.test(lower);
  const words = trimmed.split(/\s+/).filter(Boolean);

  if (explicitRefusal && words.length < 18) {
    return { passed: false, reason: 'Candidate stated they do not know the answer.' };
  }

  // Require at least minimal substance (>= 5 meaningful words OR clear domain/numeric reasoning)
  const hasDomainTerms =
    /\b(o\([n1log\s*]+\)|complexity|edge\s*case|null|empty|cache|redis|queue|kafka|database|sql|index|latency|failover|replica|load\s*balancer|mutex|lock|idempoten|retry|timeout|throughput|sharding|partition|test|unit|memory|space|time|debit|credit|dr\.?|cr\.?|ledger|journal|gst|itc|gstr|ind\s*as|ifrs|gaap|ebitda|dscr|margin|ratio|working\s*capital|receivable|inventory|cash\s*flow|covenant|audit|compliance|reconciliation|cac|ltv|roas|retention|churn|funnel|conversion|sla|segregation|approval|voucher|invoice|accrual|depreciation|provisions?|solvency|liquidity|leverage|roi|npv|irr|wacc)\b/i.test(lower) ||
    /\d+(?:\.\d+)?\s*(%|x|ms|s|cr|crore|lakh|lakhs|days|bps|rs|₹|\$)/i.test(lower);

  if (words.length < 4 && !hasDomainTerms) {
    return { passed: false, reason: 'Response was too brief to demonstrate understanding.' };
  }

  // Respect explicit LLM FAIL verdict when the candidate's answer is factually wrong or off-topic
  if (llmGrade === 'FAIL') {
    return { passed: false, reason: 'Answer did not accurately address the panel cross-examination question.' };
  }

  // If LLM explicitly passed OR LLM was offline and candidate gave a genuine reasoned explanation
  if (llmGrade === 'PASS') {
    return { passed: true, reason: 'Defense question answered satisfactorily.' };
  }

  // Deterministic offline fallback grading
  const hasReasoning =
    /\b(because|since|so\s+that|therefore|trade-?off|tradeoff|prevent|ensure|reduce|improve|protect|mitigate|verify|handle|check|avoid|balance|control|impact|risk|cost|margin|scale)\b/i.test(lower);
  if ((words.length >= 10 && (hasDomainTerms || hasReasoning)) || (words.length >= 6 && hasDomainTerms && hasReasoning)) {
    return { passed: true, reason: 'Substantive domain explanation provided.' };
  }

  return { passed: false, reason: 'Explanation lacked clear domain reasoning or concrete justification.' };
}

/**
 * Advances the 5-question defense state machine after grading the current answer.
 * - If currentQuestionNumber < 5: records verdict and opens nextQuestion (currentQuestionNumber + 1).
 * - If currentQuestionNumber === 5: finalizes as 'passed' ONLY if all 5 passed (passedCount === 5),
 *   otherwise finalizes as 'eliminated' so the interviewer ends the session forcefully.
 */
export function advanceRoundDefense(
  prev: RoundDefenseState,
  candidateAnswer: string,
  passed: boolean,
  reason: string,
  nextQuestionText?: string
): RoundDefenseState {
  if (!prev.active || prev.status !== 'in_progress') return prev;

  const qNum = prev.currentQuestionNumber;
  const updatedRecords = prev.records.map(r =>
    r.questionNumber === qNum
      ? {
          ...r,
          answer: candidateAnswer.trim(),
          verdict: (passed ? 'passed' : 'failed') as DefenseQuestionVerdict,
          reason,
        }
      : r
  );

  const nextPassed = prev.passedCount + (passed ? 1 : 0);
  const nextFailed = prev.failedCount + (passed ? 0 : 1);

  if (qNum >= prev.totalQuestions) {
    const qualified = nextPassed >= prev.totalQuestions;
    const roundLabel = prev.roundNumber === 2
      ? (prev.roundType === 'case' ? 'Round 2 (B.Com Case Study Defense)' : 'Round 2 (Code Review Defense)')
      : (prev.roundType === 'workflow' ? 'Round 3 (Business Workflow Defense)' : 'Round 3 (System Architecture Defense)');

    return {
      ...prev,
      active: false,
      passedCount: nextPassed,
      failedCount: nextFailed,
      status: qualified ? 'passed' : 'eliminated',
      records: updatedRecords,
      eliminationReason: qualified
        ? undefined
        : `Cleared ${nextPassed}/${prev.totalQuestions} defense questions in ${roundLabel}; all ${prev.totalQuestions} questions are required to advance to the next round.`,
    };
  }

  const nextNum = qNum + 1;
  return {
    ...prev,
    currentQuestionNumber: nextNum,
    passedCount: nextPassed,
    failedCount: nextFailed,
    records: [
      ...updatedRecords,
      {
        questionNumber: nextNum,
        question: nextQuestionText || `Question ${nextNum} of ${prev.totalQuestions}`,
        answer: '',
        verdict: 'pending',
      },
    ],
  };
}

/**
 * Generates concise, natural spoken intro for Round 2 or Round 3 so the candidate
 * immediately starts building before the 5-question defense begins.
 */
export function buildConciseRoundIntro(params: {
  roundNumber: 2 | 3;
  domainStream: 'tech' | 'non_tech';
  teacherName: string;
  topic: string;
  companyCue?: string;
  problemTitle?: string;
}): string {
  const { roundNumber, domainStream, teacherName, topic, companyCue = '', problemTitle } = params;
  if (roundNumber === 2) {
    if (domainStream === 'non_tech') {
      return `Welcome to Round 2. I am ${teacherName}.${companyCue} Your corporate case folder "${problemTitle || topic}" is open on the left. Review the exhibits, fix the accounting or compliance issue, calculate the ratios, and submit your case desk—after you submit, I will ask you 5 focused questions to decide if you advance to Round 3.`;
    }
    return `Welcome to Round 2. I am ${teacherName}.${companyCue} Your coding challenge "${problemTitle || topic}" is ready in the editor. Write your solution, run the tests, and submit—once submitted, I will ask you 5 questions on your code to decide whether you move on to Round 3.`;
  }

  if (domainStream === 'non_tech') {
    return `Welcome to Round 3. I am ${teacherName}.${companyCue} Plan and build the end-to-end business and financial control workflow for ${topic} on the canvas. Once you evaluate your workflow, I will cross-examine you with 5 questions on your design before deciding whether you advance to the final round.`;
  }
  return `Welcome to Round 3. I am ${teacherName}.${companyCue} Design and connect the system architecture for ${topic} on the whiteboard. Once you click Evaluate Architecture, I will ask you 5 focused questions on your architecture to decide if you qualify for Round 4.`;
}

/**
 * Generates deterministic, artifact-grounded fallback questions Q1..Q5 when external LLMs
 * are unreachable or rate-limited, ensuring the 5-question defense never stalls or repeats.
 */
export function getFallbackDefenseQuestion(params: {
  roundType: DefenseRoundType;
  questionNumber: number;
  topic: string;
  artifactHint?: string;
}): string {
  const { roundType, questionNumber, topic, artifactHint } = params;
  const idx = Math.max(1, Math.min(DEFENSE_TOTAL_QUESTIONS, questionNumber)) - 1;
  const focus = artifactHint?.trim() || topic;

  if (roundType === 'code') {
    const qs = [
      `Question 1 of 5: Walk me through the exact time and space complexity of your submitted solution for ${focus}, and explain why you chose this data structure or loop design.`,
      `Question 2 of 5: What happens in your submitted code if the input array is empty, contains negative numbers, or hits the exact threshold boundary?`,
      `Question 3 of 5: If input scale grows 100x to 10 million records in production, where would your current implementation hit a CPU or memory bottleneck, and how would you optimize it?`,
      `Question 4 of 5: Suppose multiple concurrent API requests call this logic simultaneously or pass malformed inputs—what validation or safety invariant would you add around your code?`,
      `Question 5 of 5: Beyond the 5 boundary tests, what single unit test or property-based check would you add before merging this ${focus} solution to production?`,
    ];
    return qs[idx];
  }

  if (roundType === 'case') {
    const qs = [
      `Question 1 of 5: Looking at your submitted case desk for ${focus}, explain the accounting or compliance principle behind the red flag and rectification entry you selected.`,
      `Question 2 of 5: Walk me through how your calculated ratios expose the biggest liquidity, margin, or credit risk in Exhibit A.`,
      `Question 3 of 5: If revenue drops by 15% or customer collections slip by 30 days next quarter, how does that stress-test change your recommendation?`,
      `Question 4 of 5: Under Indian statutory norms (Ind AS / GST / RBI guidelines) and global IFRS expectations, what documentation or internal control must you verify before signing off?`,
      `Question 5 of 5: Imagine the CFO or Managing Partner pushes back on your board verdict—give your final 30-second defense backing your decision with numbers.`,
    ];
    return qs[idx];
  }

  if (roundType === 'workflow') {
    const qs = [
      `Question 1 of 5: Looking at ${focus} on your workflow canvas, why did you place those stages in that exact sequence, and what breaks if a step is bypassed?`,
      `Question 2 of 5: Where is the highest risk of revenue leakage, compliance failure, or SLA delay in your workflow, and what concrete control or maker-checker gate stops it?`,
      `Question 3 of 5: How do finance, operations, and client-facing teams reconcile data and handoffs across your workflow without manual spreadsheet errors?`,
      `Question 4 of 5: If transaction or order volume triples during peak festive or quarter-end closing, which stage becomes your bottleneck first and how do you scale it?`,
      `Question 5 of 5: What two leading KPIs would you track weekly on your executive dashboard to prove this ${topic} workflow is protecting margins and compliance?`,
    ];
    return qs[idx];
  }

  // 'architecture'
  const qs = [
    `Question 1 of 5: Looking at ${focus} in your submitted topology, why did you place that component in the critical path and what trade-off does it introduce?`,
    `Question 2 of 5: If traffic surges 10x during a flash event, which component on your whiteboard saturates first and how do caching, queuing, or horizontal scaling absorb the spike?`,
    `Question 3 of 5: Suppose your primary compute or storage node crashes mid-request—how does your architecture maintain availability, failover, and idempotent retries without corrupting data?`,
    `Question 4 of 5: What consistency model (strong vs eventual) did you assume between your cache, queue, and database tiers, and where could stale reads hurt users?`,
    `Question 5 of 5: What core observability metrics (latency P99, error rate, queue lag, or saturation) and alerting thresholds would you set to run this ${topic} system in production?`,
  ];
  return qs[idx];
}

/**
 * Generates the final spoken verdict after Question 5 (pass -> advance, fail -> forceful end).
 */
export function buildDefenseFinalVerdictSpeech(state: RoundDefenseState): string {
  const nextRoundLabel = state.roundNumber === 2 ? 'Round 3' : 'Round 4';
  if (state.status === 'passed') {
    return `Excellent defense! You answered all ${state.totalQuestions} out of ${state.totalQuestions} questions accurately and justified your decisions clearly. You have qualified for ${nextRoundLabel}—click Continue whenever you are ready.`;
  }
  return `Thank you for your time, but you answered ${state.passedCount} out of ${state.totalQuestions} defense questions satisfactorily, which does not meet our hiring bar to advance to ${nextRoundLabel}. You are not moving forward to the next round, so I am concluding this interview session now and generating your evaluation report.`;
}
