/**
 * Reusable Post-Submission Defense & Final-Round Completion Engine
 *
 * Powers BOTH Tech (Round 2 Code, Round 3 Architecture, Round 4 Executive Deep Dive)
 * and Non-Tech / B.Com (Round 2 Accounting/Finance Case Desk, Round 3 Business/Audit Workflow,
 * Round 4 Partner/CFO Executive Deep Dive).
 *
 * Round 2 & Round 3 Defense Invariants:
 * 1. Up to 5 targeted cross-examination questions are asked strictly after submitting work.
 * 2. Every answer is graded (PASS vs FAIL) using LLM signal + deterministic anti-bluff guard.
 * 3. Answering 3 questions correctly (`DEFENSE_REQUIRED_PASS_COUNT = 3`) immediately qualifies
 *    the candidate to move to the next round!
 * 4. If reaching 3 correct answers becomes mathematically impossible (3 failed answers),
 *    the AI interviewer concludes the round as eliminated and ends the session cleanly.
 *
 * Round 4 (Final Round) Completion Invariants:
 * 1. Strictly bounded to 4–5 questions (never loops infinitely!).
 * 2. If the candidate answers the first 3 questions with full accuracy (`accurateCount === 3` at Q3),
 *    the interviewer stops asking questions immediately, announces that the interview is done,
 *    and triggers the final evaluation report.
 * 3. Otherwise asks Q4 (wrapping at Q4 if `accurateCount >= 3`) and hard-caps at Q5.
 */

import { isTrivialOrNonSubstantiveAnswer, SKIP_TURN_REGEX } from './postInterviewInsights';

export const DEFENSE_TOTAL_QUESTIONS = 5;
export const DEFENSE_REQUIRED_PASS_COUNT = 3;

export const ROUND4_EARLY_PASS_QUESTIONS = 3;
export const ROUND4_STANDARD_QUESTIONS = 4;
export const ROUND4_MAX_QUESTIONS = 5;

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
  requiredToPass: number;
  currentQuestionNumber: number; // 1..5 while active
  passedCount: number;
  failedCount: number;
  status: 'idle' | 'in_progress' | 'passed' | 'eliminated';
  records: DefenseQuestionRecord[];
  eliminationReason?: string;
}

export interface Round4AnswerRecord {
  questionNumber: number;
  answer: string;
  accurate: boolean;
  reason: string;
}

export interface Round4CompletionState {
  questionsAsked: number; // 1..5
  answeredCount: number;  // 0..5
  accurateCount: number;  // 0..5
  maxQuestions: number;   // 5
  earlyPassTarget: number; // 3
  completed: boolean;
  completionReason?: 'early_excellence' | 'standard_limit' | 'max_limit';
  records: Round4AnswerRecord[];
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
    requiredToPass: DEFENSE_REQUIRED_PASS_COUNT,
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
    requiredToPass: DEFENSE_REQUIRED_PASS_COUNT,
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

export function createInitialRound4State(): Round4CompletionState {
  return {
    questionsAsked: 1,
    answeredCount: 0,
    accurateCount: 0,
    maxQuestions: ROUND4_MAX_QUESTIONS,
    earlyPassTarget: ROUND4_EARLY_PASS_QUESTIONS,
    completed: false,
    records: [],
  };
}

const DOMAIN_SIGNAL_REGEX =
  /\b(o\([n1log\s*]+\)|complexity|edge\s*case|null|empty|cache|redis|queue|kafka|database|sql|index|latency|failover|replica|load\s*balancer|mutex|lock|idempoten|retry|timeout|throughput|sharding|partition|test|unit|memory|space|time|debit|credit|dr\.?|cr\.?|ledger|journal|gst|itc|gstr|ind\s*as|ifrs|gaap|ebitda|dscr|margin|ratio|working\s*capital|receivable|inventory|cash\s*flow|covenant|audit|compliance|reconciliation|cac|ltv|roas|retention|churn|funnel|conversion|sla|segregation|approval|voucher|invoice|accrual|depreciation|provisions?|solvency|liquidity|leverage|roi|npv|irr|wacc|sebi|rbi|icai|statutory|npa|treasury|credit\s*risk|maker[- ]checker|variance|gross\s*profit|net\s*profit|balance\s*sheet)\b/i;

const QUANT_SIGNAL_REGEX =
  /\d+(?:\.\d+)?\s*(%|x|ms|s|cr|crore|lakh|lakhs|days|bps|rs|₹|\$|k|m|million|billion)/i;

const REASONING_SIGNAL_REGEX =
  /\b(because|since|so\s+that|therefore|trade-?off|tradeoff|prevent|ensure|reduce|improve|protect|mitigate|verify|handle|check|avoid|balance|control|impact|risk|cost|margin|scale|resulted\s+in|led\s+to|achieved|delivered|resolved|decided|implemented|restructured|reconciled|audited)\b/i;

/**
 * Deterministic + LLM hybrid grading of a candidate's answer to a Round 2 / Round 3 defense question.
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

  const hasDomainTerms = DOMAIN_SIGNAL_REGEX.test(lower) || QUANT_SIGNAL_REGEX.test(lower);

  if (words.length < 4 && !hasDomainTerms) {
    return { passed: false, reason: 'Response was too brief to demonstrate understanding.' };
  }

  if (llmGrade === 'FAIL') {
    return { passed: false, reason: 'Answer did not accurately address the panel cross-examination question.' };
  }

  if (llmGrade === 'PASS') {
    return { passed: true, reason: 'Defense question answered accurately.' };
  }

  // Deterministic offline fallback grading
  const hasReasoning = REASONING_SIGNAL_REGEX.test(lower);
  if ((words.length >= 10 && (hasDomainTerms || hasReasoning)) || (words.length >= 6 && hasDomainTerms && hasReasoning)) {
    return { passed: true, reason: 'Substantive domain explanation provided.' };
  }

  return { passed: false, reason: 'Explanation lacked clear domain reasoning or concrete justification.' };
}

/**
 * Advances the Round 2 / Round 3 defense state machine after grading the current answer.
 * - Immediately qualifies (`status: 'passed'`) as soon as `passedCount >= 3` (`requiredToPass`)!
 * - Immediately concludes (`status: 'eliminated'`) as soon as reaching 3 correct answers becomes
 *   mathematically impossible (`passedCount + remainingQuestions < requiredToPass`).
 * - Otherwise opens the next question (up to `totalQuestions = 5`).
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
  const required = prev.requiredToPass || DEFENSE_REQUIRED_PASS_COUNT;
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
  const remainingQuestions = Math.max(0, prev.totalQuestions - qNum);

  const roundLabel = prev.roundNumber === 2
    ? (prev.roundType === 'case' ? 'Round 2 (B.Com Case Study Defense)' : 'Round 2 (Code Review Defense)')
    : (prev.roundType === 'workflow' ? 'Round 3 (Business Workflow Defense)' : 'Round 3 (System Architecture Defense)');

  // 1. Qualified! Reached 3 correct answers -> immediately unlock the next round!
  if (nextPassed >= required) {
    return {
      ...prev,
      active: false,
      passedCount: nextPassed,
      failedCount: nextFailed,
      status: 'passed',
      records: updatedRecords,
      eliminationReason: undefined,
    };
  }

  // 2. Mathematically impossible to reach 3 correct answers (or exhausted all 5 questions) -> eliminated
  if (qNum >= prev.totalQuestions || nextPassed + remainingQuestions < required) {
    return {
      ...prev,
      active: false,
      passedCount: nextPassed,
      failedCount: nextFailed,
      status: 'eliminated',
      records: updatedRecords,
      eliminationReason: `Cleared ${nextPassed}/${qNum} defense questions in ${roundLabel}; at least ${required} of ${prev.totalQuestions} accurate answers are required to advance to the next round.`,
    };
  }

  // 3. Continue to next defense question
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
 * Evaluates whether a Round 4 (Executive STAR Deep Dive) answer demonstrates full accuracy
 * (for both Tech and B.Com / Non-Tech tracks). Used to decide whether the candidate qualifies
 * for early wrap-up after 3/3 accurate answers vs continuing to Q4–Q5.
 */
export function evaluateRound4AnswerAccuracy(
  candidateAnswer: string,
  llmGrade?: 'PASS' | 'FAIL' | null
): { accurate: boolean; reason: string } {
  const trimmed = String(candidateAnswer || '').trim();
  if (!trimmed) {
    return { accurate: false, reason: 'Empty response.' };
  }
  if (SKIP_TURN_REGEX.test(trimmed) || isTrivialOrNonSubstantiveAnswer(trimmed)) {
    return { accurate: false, reason: 'Skipped or non-substantive response.' };
  }

  const lower = trimmed.toLowerCase();
  const explicitRefusal =
    /\b(i\s+don'?t\s+know|dont\s+know|no\s+idea|cannot\s+answer|can'?t\s+answer|not\s+sure|blanking|no\s+clue)\b/i.test(lower);
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (explicitRefusal && words.length < 18) {
    return { accurate: false, reason: 'Candidate could not answer the question.' };
  }

  if (llmGrade === 'FAIL') {
    return { accurate: false, reason: 'Answer needed stronger STAR evidence or accuracy.' };
  }

  const hasDomain = DOMAIN_SIGNAL_REGEX.test(lower);
  const hasQuant = QUANT_SIGNAL_REGEX.test(lower);
  const hasReasoning = REASONING_SIGNAL_REGEX.test(lower);
  const hasStarAction =
    /\b(i\s+(?:built|led|designed|implemented|reconciled|audited|reduced|improved|optimized|negotiated|identified|resolved|migrated|created|owned|managed|analyzed|structured|filed|prepared|investigated)|situation|task|action|result|outcome|impact)\b/i.test(lower);

  const signalCount = [hasDomain, hasQuant, hasReasoning, hasStarAction].filter(Boolean).length;

  // High bar for "full accuracy": genuine structured answer with domain/STAR depth
  if (llmGrade === 'PASS' && words.length >= 10 && signalCount >= 1) {
    return { accurate: true, reason: 'Accurate, well-structured STAR response.' };
  }
  if (words.length >= 14 && signalCount >= 2) {
    return { accurate: true, reason: 'Strong STAR answer with concrete reasoning and evidence.' };
  }
  if (words.length >= 10 && hasQuant && (hasDomain || hasStarAction)) {
    return { accurate: true, reason: 'Concise, quantified domain response.' };
  }

  return { accurate: false, reason: 'Response was brief or lacked concrete STAR actions/metrics.' };
}

/**
 * Advances Round 4 completion state after each candidate response.
 * - First 3 questions answered with full accuracy (`answeredCount === 3 && accurateCount === 3`):
 *   completes immediately (`early_excellence`) so the avatar stops asking questions and ends the interview!
 * - By Question 4 with >= 3 accurate answers (`answeredCount === 4 && accurateCount >= 3`):
 *   completes cleanly (`standard_limit`).
 * - At Question 5 (`answeredCount >= 5`):
 *   always completes (`max_limit`) — Round 4 NEVER asks a 6th question.
 */
export function advanceRound4State(
  prev: Round4CompletionState,
  candidateAnswer: string,
  accurate: boolean,
  reason: string
): Round4CompletionState {
  if (prev.completed) return prev;

  const qNum = prev.answeredCount + 1;
  const nextAnswered = qNum;
  const nextAccurate = prev.accurateCount + (accurate ? 1 : 0);
  const updatedRecords: Round4AnswerRecord[] = [
    ...prev.records,
    { questionNumber: qNum, answer: candidateAnswer.trim(), accurate, reason },
  ];

  // Rule 1: First 3 answers all accurate -> stop immediately, don't ask Q4!
  if (nextAnswered === prev.earlyPassTarget && nextAccurate === prev.earlyPassTarget) {
    return {
      ...prev,
      answeredCount: nextAnswered,
      accurateCount: nextAccurate,
      completed: true,
      completionReason: 'early_excellence',
      records: updatedRecords,
    };
  }

  // Rule 2: 4 questions answered and at least 3 accurate -> complete at 4 questions
  if (nextAnswered === ROUND4_STANDARD_QUESTIONS && nextAccurate >= prev.earlyPassTarget) {
    return {
      ...prev,
      answeredCount: nextAnswered,
      accurateCount: nextAccurate,
      completed: true,
      completionReason: 'standard_limit',
      records: updatedRecords,
    };
  }

  // Rule 3: Hard cap at 5 questions -> complete cleanly
  if (nextAnswered >= prev.maxQuestions) {
    return {
      ...prev,
      answeredCount: nextAnswered,
      accurateCount: nextAccurate,
      completed: true,
      completionReason: 'max_limit',
      records: updatedRecords,
    };
  }

  // Continue to next question (Q2..Q5)
  return {
    ...prev,
    questionsAsked: Math.min(prev.maxQuestions, nextAnswered + 1),
    answeredCount: nextAnswered,
    accurateCount: nextAccurate,
    completed: false,
    records: updatedRecords,
  };
}

/**
 * Generates concise spoken wrap-up speech when Round 4 concludes (no further questions asked).
 */
export function buildRound4CompletionSpeech(
  state: Round4CompletionState,
  domainStream: 'tech' | 'non_tech' = 'tech'
): string {
  const trackPhrase = domainStream === 'non_tech'
    ? 'commercial judgment and STAR leadership evidence'
    : 'technical depth and STAR impact evidence';

  if (state.completionReason === 'early_excellence') {
    return `Excellent work! You answered the first ${state.earlyPassTarget} questions with full accuracy and strong ${trackPhrase}, so I don't need to ask any more questions. Your interview is done—I am generating your complete performance scorecard now.`;
  }
  if (state.completionReason === 'standard_limit') {
    return `Thank you—that gives the hiring panel a complete picture across ${state.answeredCount} questions with strong ${trackPhrase}. Your interview is done, and I am generating your final evaluation report now.`;
  }
  return `Thank you for completing all ${state.answeredCount} final-round questions. Your interview is done—I am finalizing your evidence-based performance report now.`;
}

/**
 * Generates concise, natural spoken intro for Round 2 or Round 3 so the candidate
 * immediately starts building before the post-submission defense begins.
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
      return `Welcome to Round 2. I am ${teacherName}.${companyCue} Your corporate case folder "${problemTitle || topic}" is open on the left. Review the exhibits, fix the accounting or compliance issue, calculate the ratios, and submit your case desk—after you submit, answer ${DEFENSE_REQUIRED_PASS_COUNT} of ${DEFENSE_TOTAL_QUESTIONS} focused panel questions accurately to advance to Round 3.`;
    }
    return `Welcome to Round 2. I am ${teacherName}.${companyCue} Your coding challenge "${problemTitle || topic}" is ready in the editor. Write your solution, run the tests, and submit—once submitted, answer ${DEFENSE_REQUIRED_PASS_COUNT} of ${DEFENSE_TOTAL_QUESTIONS} questions on your code accurately to move on to Round 3.`;
  }

  if (domainStream === 'non_tech') {
    return `Welcome to Round 3. I am ${teacherName}.${companyCue} Plan and build the end-to-end business and financial control workflow for ${topic} on the canvas. Once you evaluate your workflow, answer ${DEFENSE_REQUIRED_PASS_COUNT} of ${DEFENSE_TOTAL_QUESTIONS} panel questions on your design accurately to advance to the final round.`;
  }
  return `Welcome to Round 3. I am ${teacherName}.${companyCue} Design and connect the system architecture for ${topic} on the whiteboard. Once you click Evaluate Architecture, answer ${DEFENSE_REQUIRED_PASS_COUNT} of ${DEFENSE_TOTAL_QUESTIONS} focused questions on your architecture accurately to qualify for Round 4.`;
}

/**
 * Generates deterministic, artifact-grounded fallback questions Q1..Q5 when external LLMs
 * are unreachable or rate-limited, ensuring the defense never stalls or repeats.
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
 * Generates the final spoken verdict once Round 2 / Round 3 defense settles (3+ passed -> advance, else -> forceful end).
 */
export function buildDefenseFinalVerdictSpeech(state: RoundDefenseState): string {
  const nextRoundLabel = state.roundNumber === 2 ? 'Round 3' : 'Round 4';
  const required = state.requiredToPass || DEFENSE_REQUIRED_PASS_COUNT;
  if (state.status === 'passed') {
    return `Well done! You answered ${state.passedCount} defense questions accurately (clearing our ${required}-of-${state.totalQuestions} bar) and justified your decisions clearly. You have qualified for ${nextRoundLabel}—click Continue whenever you are ready.`;
  }
  return `Thank you for your time, but you cleared ${state.passedCount} defense questions, which falls short of the ${required} out of ${state.totalQuestions} required to advance to ${nextRoundLabel}. You are not moving forward to the next round, so I am concluding this interview session now and generating your evaluation report.`;
}
