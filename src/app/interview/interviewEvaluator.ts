import {
  calculateRoleWeightedScore,
  normalizeRoleKey,
  generatePersonaCoaching,
  generateTelemetryDiagnostics,
  MindsetArchetype
} from '@/lib/interview/scoringMatrix';
import { evaluateSystemTopology } from '@/lib/interview/systemDesignEvaluator';
import { escapeHtml } from '@/lib/interview/jsonExtract';
import {
  buildQuestionBenchmarks,
  extractDefendedTechStack,
  inferMessageRounds,
  isTrivialOrNonSubstantiveAnswer,
  SKIP_TURN_REGEX,
  type QuestionBenchmarkItem
} from '@/lib/interview/postInterviewInsights';
import { toast } from '@/lib/store/useAppStore';
import { Message } from './interviewTypes';

export type RoundStatus = 'completed' | 'partial' | 'skipped' | 'not_attempted';

export interface RoundReportDetail {
  roundNumber: 1 | 2 | 3 | 4;
  key: 'round1' | 'round2' | 'round3' | 'round4';
  title: string;
  shortTitle: string;
  badge: string;
  status: RoundStatus;
  score: number;
  verdict: string;
  metric: string;
  whatHappened: string;
  highlights: string[];
  gaps: string[];
  exchanges: QuestionBenchmarkItem[];
  artifact?: {
    type: 'code_or_case' | 'topology' | 'star';
    summary?: string;
    details?: string[];
    bottlenecks?: string[];
    recommendations?: string[];
    starStepsCompleted?: number;
  };
}

export interface EvaluationInput {
  messages: Message[];
  codeSubmitted: boolean;
  latestTopology: any;
  starStep: number;
  fillerWordCount: number;
  eyeContactScore: number | null;
  wpmScore: number | null;
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  archetype?: MindsetArchetype;
  roleKey?: string;
  difficulty?: string;
  tabSwitchCount?: number;
  selectedLang?: string;
  codeContent?: string;
  eliminatedInRound?: 2 | 3;
  eliminationReason?: string;
}

export function computeDeterministicEvaluation({
  messages,
  codeSubmitted,
  latestTopology,
  starStep,
  fillerWordCount,
  eyeContactScore,
  wpmScore,
  activeTopicName,
  domainStream,
  archetype = 'Pattern Hunter',
  roleKey: inputRoleKey,
  tabSwitchCount,
  selectedLang,
  codeContent,
  eliminatedInRound,
  eliminationReason
}: EvaluationInput) {
  const safeMessages = Array.isArray(messages) ? messages : [];
  const annotatedMsgs = inferMessageRounds(safeMessages);
  const isNonTech = domainStream === 'non_tech';

  const safeStarStep = typeof starStep === 'number' && Number.isFinite(starStep) ? Math.max(0, Math.min(4, Math.floor(starStep))) : 0;
  const safeFillerCount = typeof fillerWordCount === 'number' && Number.isFinite(fillerWordCount) ? Math.max(0, Math.floor(fillerWordCount)) : 0;
  const micWasMeasured = typeof wpmScore === 'number' && Number.isFinite(wpmScore) && wpmScore > 0;
  const roleKey = normalizeRoleKey(inputRoleKey || activeTopicName || 'Full Stack Engineer', domainStream || 'tech');

  const questionBreakdown = buildQuestionBenchmarks(safeMessages, activeTopicName, domainStream);
  const defendedTechStack = extractDefendedTechStack(safeMessages, selectedLang, latestTopology, codeSubmitted);

  // Detect per-round skip markers & user turns
  const hasRoundSkip = (roundNum: 1 | 2 | 3 | 4) =>
    annotatedMsgs.some(m => m.round === roundNum && m.role === 'user' && SKIP_TURN_REGEX.test(m.content.trim()));

  const getRoundExchanges = (roundNum: 1 | 2 | 3 | 4) =>
    questionBreakdown.filter(q => q.round === roundNum);

  const getRoundSubstantiveExchanges = (roundNum: 1 | 2 | 3 | 4) =>
    getRoundExchanges(roundNum).filter(q => !q.isTrivial);

  const allUserTurns = annotatedMsgs.filter(m => m.role === 'user' && !SKIP_TURN_REGEX.test(m.content.trim()));
  const allSubstantiveTurns = allUserTurns.filter(m => !isTrivialOrNonSubstantiveAnswer(m.content));

  // ── Round 1: Behavioral & Domain Intro (0–100 real calculation) ──────────
  const r1Exchanges = getRoundExchanges(1);
  const r1Substantive = getRoundSubstantiveExchanges(1);
  const r1Skipped = hasRoundSkip(1);
  let round1Score = 0;
  let round1Status: RoundStatus = 'not_attempted';
  let round1Verdict = 'Not Attempted';
  let round1Metric = 'No responses recorded';
  let round1WhatHappened = 'No background or behavioral responses were recorded in Round 1.';

  if (r1Exchanges.length === 0) {
    round1Score = 0;
    round1Status = r1Skipped ? 'skipped' : 'not_attempted';
    round1Verdict = r1Skipped ? 'Skipped' : 'Not Attempted';
    round1Metric = r1Skipped ? 'Round skipped by candidate' : '0 responses recorded';
    round1WhatHappened = r1Skipped
      ? 'You skipped Round 1 before answering the behavioral and background questions.'
      : 'No responses were recorded in Round 1.';
  } else if (r1Substantive.length === 0) {
    const avgTrivial = Math.round(r1Exchanges.reduce((s, q) => s + q.score, 0) / r1Exchanges.length);
    round1Score = Math.min(10, avgTrivial);
    round1Status = r1Skipped ? 'skipped' : 'partial';
    round1Verdict = r1Skipped ? 'Skipped (Greeting Only)' : 'Insufficient Response';
    round1Metric = `${r1Exchanges.length} brief greeting${r1Exchanges.length === 1 ? '' : 's'}, 0 substantive answers`;
    round1WhatHappened = r1Skipped
      ? `You sent ${r1Exchanges.length} brief greeting/non-answer and skipped Round 1 without discussing background or projects.`
      : `Only brief greeting or non-substantive replies were given; no concrete background or domain experience was defended.`;
  } else {
    const avgQ = r1Substantive.reduce((s, q) => s + q.score, 0) / r1Substantive.length;
    const coverageMultiplier = Math.min(1, r1Substantive.length / 2);
    round1Score = Math.min(100, Math.max(0, Math.round(avgQ * (0.45 + 0.55 * coverageMultiplier))));
    round1Status = r1Substantive.length >= 2 && !r1Skipped ? 'completed' : r1Skipped ? 'skipped' : 'partial';
    round1Verdict =
      round1Score >= 75 ? 'Strong Fit' :
      round1Score >= 55 ? 'Competent' :
      round1Score >= 30 ? 'Developing' : 'Needs Work';
    round1Metric = `${r1Substantive.length} substantive response${r1Substantive.length === 1 ? '' : 's'}${r1Skipped ? ' (skipped early)' : ''}`;
    round1WhatHappened = `You answered ${r1Substantive.length} behavioral/background question${r1Substantive.length === 1 ? '' : 's'} with an average answer quality of ${Math.round(avgQ)}%.${r1Skipped ? ' You skipped the remainder of Round 1 early.' : ''}`;
  }

  // ── Round 2: Technical Sandbox / Business Case Study (0–100 real calculation) ──
  const r2Exchanges = getRoundExchanges(2);
  const r2Substantive = getRoundSubstantiveExchanges(2);
  const r2Skipped = hasRoundSkip(2);
  const round2Title = isNonTech ? 'Round 2: Business Case Study' : 'Round 2: Technical Sandbox';
  const round2Short = isNonTech ? 'Case Study' : 'Coding';
  const round2Badge = isNonTech
    ? 'B.Com Case Audit'
    : roleKey === 'iot_embedded'
    ? 'MCU C++ Sandbox'
    : roleKey === 'quant_systems'
    ? 'Low-Latency C++ Engine'
    : roleKey === 'ai_ml'
    ? 'Python AI Sandbox'
    : roleKey === 'cybersecurity'
    ? 'Secure Systems Sandbox'
    : 'Coding';

  let round2Score = 0;
  let round2Status: RoundStatus = 'not_attempted';
  let round2Verdict = 'Not Attempted';
  let round2Metric = isNonTech ? 'No case analysis submitted' : 'No code submitted';
  let round2WhatHappened = isNonTech
    ? 'You did not submit financial calculations or a strategic case memo in Round 2.'
    : 'You did not submit or verify a coding solution in Round 2.';

  if (codeSubmitted) {
    const defenseAvg = r2Substantive.length > 0
      ? Math.round(r2Substantive.reduce((s, q) => s + q.score, 0) / r2Substantive.length)
      : 0;
    round2Score = r2Substantive.length > 0
      ? Math.min(98, Math.round(72 + defenseAvg * 0.26))
      : 78;
    round2Status = r2Substantive.length > 0 ? 'completed' : 'partial';
    round2Verdict = round2Score >= 85 ? 'Verified & Defended' : 'Verified Solution';
    round2Metric = isNonTech
      ? (r2Substantive.length > 0 ? 'Case ratios audited & defended' : 'Case ratios audited')
      : roleKey === 'iot_embedded'
      ? 'Embedded register test suite verified'
      : roleKey === 'quant_systems'
      ? 'Order book test suite verified'
      : roleKey === 'ai_ml'
      ? 'ML pipeline test suite verified'
      : roleKey === 'cybersecurity'
      ? 'Security invariant suite verified'
      : (r2Substantive.length > 0 ? 'All test tiers verified & defended' : 'Test suite verified');
    round2WhatHappened = isNonTech
      ? `Your quantitative case audit passed verification${r2Substantive.length > 0 ? ` and you defended your reasoning across ${r2Substantive.length} follow-up exchange(s).` : '.'}`
      : `Your ${selectedLang || 'code'} implementation passed the boundary test suite${r2Substantive.length > 0 ? ` and you defended complexity/edge cases across ${r2Substantive.length} exchange(s).` : '.'}`;
  } else if (r2Substantive.length > 0) {
    const defenseAvg = Math.round(r2Substantive.reduce((s, q) => s + q.score, 0) / r2Substantive.length);
    round2Score = Math.min(45, Math.round(defenseAvg * 0.45));
    round2Status = r2Skipped ? 'skipped' : 'partial';
    round2Verdict = r2Skipped ? 'Skipped (Unverified)' : 'Incomplete Submission';
    round2Metric = isNonTech ? 'Case audit incomplete' : 'Tests not passed';
    round2WhatHappened = isNonTech
      ? `You discussed the case briefly, but did not complete a verified ratio audit before moving on.`
      : `You discussed the problem briefly, but no working solution passed the test suite.`;
  } else {
    round2Score = 0;
    round2Status = r2Skipped ? 'skipped' : 'not_attempted';
    round2Verdict = r2Skipped ? 'Skipped' : 'Not Submitted';
    round2Metric = r2Skipped ? 'Round skipped by candidate' : (isNonTech ? 'No case analysis submitted' : 'No code submitted');
    round2WhatHappened = r2Skipped
      ? `You skipped Round 2 without submitting ${isNonTech ? 'the case study analysis' : 'a coding solution'}.`
      : `No ${isNonTech ? 'case study' : 'coding'} submission was recorded for Round 2.`;
  }

  // ── Round 3: System Architecture / Business Workflow Canvas (0–100 real calculation) ──
  const r3Exchanges = getRoundExchanges(3);
  const r3Substantive = getRoundSubstantiveExchanges(3);
  const r3Skipped = hasRoundSkip(3);
  const topologyEvaluation = latestTopology?.nodes?.length
    ? evaluateSystemTopology(latestTopology, activeTopicName, domainStream)
    : null;
  const architectureScore = topologyEvaluation ? topologyEvaluation.score : 0;

  const round3Title = isNonTech ? 'Round 3: Business Workflow & Strategy' : 'Round 3: System Architecture';
  const round3Short = isNonTech ? 'Strategy Canvas' : 'Architecture';
  const round3Badge = isNonTech
    ? 'Workflow Strategy'
    : roleKey === 'iot_embedded'
    ? 'Hardware / MMIO Architecture'
    : roleKey === 'quant_systems'
    ? 'LMAX / Exchange Topology'
    : roleKey === 'ai_ml'
    ? 'Vector RAG Architecture'
    : roleKey === 'cybersecurity'
    ? 'Threat Boundary Architecture'
    : 'System Design';

  let round3Score = 0;
  let round3Status: RoundStatus = 'not_attempted';
  let round3Verdict = 'Not Attempted';
  let round3Metric = 'Whiteboard canvas was blank';
  let round3WhatHappened = `The ${isNonTech ? 'business workflow' : 'system architecture'} canvas was left blank.`;

  if (topologyEvaluation) {
    const r3DefenseAvg = r3Substantive.length > 0
      ? Math.round(r3Substantive.reduce((s, q) => s + q.score, 0) / r3Substantive.length)
      : 0;
    // Combine canvas score (75%) + verbal trade-off defense (25%) when defense occurred, else cap at canvas score * 0.85
    round3Score = r3Substantive.length > 0
      ? Math.min(98, Math.round(architectureScore * 0.75 + r3DefenseAvg * 0.25))
      : Math.min(85, Math.round(architectureScore * 0.85));
    round3Status = r3Skipped ? 'skipped' : (architectureScore >= 60 && r3Substantive.length > 0 ? 'completed' : 'partial');
    round3Verdict = topologyEvaluation.grade;
    round3Metric = `${latestTopology?.nodes?.length || 0} nodes, ${latestTopology?.links?.length || 0} links · ${topologyEvaluation.grade}`;
    round3WhatHappened = `${topologyEvaluation.summary}${r3Substantive.length > 0 ? ` You also answered ${r3Substantive.length} trade-off question(s).` : ' No verbal trade-off defense was completed.'}`;
  } else {
    round3Score = 0;
    round3Status = r3Skipped ? 'skipped' : 'not_attempted';
    round3Verdict = r3Skipped ? 'Skipped' : 'Blank Canvas';
    round3Metric = r3Skipped ? 'Round skipped by candidate' : 'Whiteboard canvas was blank';
    round3WhatHappened = r3Skipped
      ? `You skipped Round 3 without building a ${isNonTech ? 'business workflow' : 'system architecture'} diagram.`
      : `The Round 3 whiteboard canvas was left blank.`;
  }

  // ── Round 4: Executive STAR Deep Dive (0–100 real calculation) ───────────
  const r4Exchanges = getRoundExchanges(4);
  const r4Substantive = getRoundSubstantiveExchanges(4);
  const r4Skipped = hasRoundSkip(4);
  const effectiveStarSteps = r4Substantive.length > 0 ? Math.max(safeStarStep, Math.min(4, r4Substantive.length)) : safeStarStep;
  const round4Badge = effectiveStarSteps >= 4
    ? 'STAR Master (4/4)'
    : effectiveStarSteps >= 2
    ? 'STAR Articulated'
    : 'STAR Defense';

  let round4Score = 0;
  let round4Status: RoundStatus = 'not_attempted';
  let round4Verdict = 'Not Attempted';
  let round4Metric = '0/4 STAR steps articulated';
  let round4WhatHappened = 'No STAR behavioral defense answers were recorded in Round 4.';

  if (effectiveStarSteps === 0 && r4Substantive.length === 0) {
    round4Score = 0;
    round4Status = r4Skipped ? 'skipped' : 'not_attempted';
    round4Verdict = r4Skipped ? 'Skipped' : 'Not Attempted';
    round4Metric = r4Skipped ? 'Round skipped by candidate' : '0/4 STAR steps articulated';
    round4WhatHappened = r4Skipped
      ? 'You skipped Round 4 and finalized the interview without completing the STAR defense.'
      : 'No STAR responses were recorded in Round 4.';
  } else {
    const r4Avg = r4Substantive.length > 0
      ? Math.round(r4Substantive.reduce((s, q) => s + q.score, 0) / r4Substantive.length)
      : 50;
    round4Score = Math.min(98, Math.round((effectiveStarSteps / 4) * 65 + r4Avg * 0.35));
    round4Status = effectiveStarSteps >= 3 && !r4Skipped ? 'completed' : r4Skipped ? 'skipped' : 'partial';
    round4Verdict =
      round4Score >= 80 ? 'Exemplary STAR' :
      round4Score >= 60 ? 'Structured Response' : 'Developing STAR';
    round4Metric = `${effectiveStarSteps}/4 STAR steps articulated`;
    round4WhatHappened = `You articulated ${effectiveStarSteps}/4 STAR elements across ${r4Substantive.length} response(s) in Round 4.${r4Skipped ? ' You finished Round 4 early.' : ''}`;
  }

  // ── Real 5-Dimension Radar (Strictly Zero-Floor, Zero-Inflation) ─────────
  const verbalQualityAvg = allSubstantiveTurns.length > 0 && questionBreakdown.filter(q => !q.isTrivial).length > 0
    ? Math.round(
        questionBreakdown.filter(q => !q.isTrivial).reduce((s, q) => s + q.score, 0) /
        questionBreakdown.filter(q => !q.isTrivial).length
      )
    : round1Score;

  const rawDimensions = {
    logic: Math.round(round2Score * 0.45 + round3Score * 0.30 + verbalQualityAvg * 0.25),
    systems: round3Score,
    comms: round1Score,
    solving: round2Score,
    star: round4Score
  };

  const scoringResult = calculateRoleWeightedScore(rawDimensions, roleKey);
  const coaching = generatePersonaCoaching(archetype, scoringResult.sanitizedDimensions, roleKey);
  const telemetryDiagnostics = generateTelemetryDiagnostics({
    eyeContact: typeof eyeContactScore === 'number' && Number.isFinite(eyeContactScore) ? eyeContactScore : undefined,
    wpm: micWasMeasured ? wpmScore! : undefined,
    // Never fabricate "0 filler words — crisp vocal delivery" when microphone was never active
    fillerWords: micWasMeasured || safeFillerCount > 0 ? safeFillerCount : undefined,
    tabSwitches: typeof tabSwitchCount === 'number' && Number.isFinite(tabSwitchCount) ? Math.max(0, Math.floor(tabSwitchCount)) : undefined
  });

  // ── Evidence-Backed Strengths & Concrete Gaps (ZERO dummy archetype praise!) ─
  const realStrengths: string[] = [];
  const realImprovements: string[] = [];

  if (round1Score >= 60) realStrengths.push(`Round 1 (${round1Score}%): Clear domain background and structured communication.`);
  else realImprovements.push(`Round 1 (${round1Score}%): Give specific project examples with your personal ownership and measurable outcomes instead of brief or skipped turns.`);

  if (round2Score >= 60) realStrengths.push(`Round 2 (${round2Score}%): Verified ${isNonTech ? 'quantitative case analysis and business reasoning' : 'working solution across boundary test cases'}.`);
  else realImprovements.push(`Round 2 (${round2Score}%): Complete and verify the ${isNonTech ? 'financial case ratios and executive recommendation' : 'coding solution and defend time/space complexity'}.`);

  if (round3Score >= 60) realStrengths.push(`Round 3 (${round3Score}%): Solid ${isNonTech ? 'end-to-end business workflow design' : 'system architecture topology'} (${topologyEvaluation?.grade || 'Verified'}).`);
  else realImprovements.push(`Round 3 (${round3Score}%): Build a logically connected ${isNonTech ? 'business workflow' : 'system architecture'} on the canvas and explain key bottlenecks.`);

  if (round4Score >= 60) realStrengths.push(`Round 4 (${round4Score}%): Structured STAR storytelling (${effectiveStarSteps}/4 steps covered).`);
  else realImprovements.push(`Round 4 (${round4Score}%): Complete the Executive STAR Deep Dive by covering Situation, Task, Action, and quantified Result.`);

  const completedRoundsCount = [round1Status, round2Status, round3Status, round4Status].filter(s => s === 'completed').length;
  const skippedRoundsCount = [round1Status, round2Status, round3Status, round4Status].filter(s => s === 'skipped' || s === 'not_attempted').length;

  const honestSummary =
    allSubstantiveTurns.length === 0 && !codeSubmitted && !topologyEvaluation
      ? `No substantive interview responses were completed for ${scoringResult.roleName} (${skippedRoundsCount}/4 rounds skipped or blank). Complete at least one round in depth to receive a genuine hiring evaluation.`
      : `${scoringResult.verdict} (${scoringResult.overallScore}%) for ${scoringResult.roleName} — ${completedRoundsCount}/4 rounds fully completed${skippedRoundsCount > 0 ? `, ${skippedRoundsCount} round${skippedRoundsCount === 1 ? '' : 's'} skipped or unattempted` : ''}.`;

  const roundReports: RoundReportDetail[] = [
    {
      roundNumber: 1,
      key: 'round1',
      title: 'Round 1: Behavioral & Background',
      shortTitle: 'Background',
      badge: 'Behavioral',
      status: round1Status,
      score: round1Score,
      verdict: round1Verdict,
      metric: round1Metric,
      whatHappened: round1WhatHappened,
      highlights: round1Score >= 60 ? ['Communicated domain background with concrete context'] : [],
      gaps: round1Score < 60
        ? [r1Substantive.length === 0 ? 'No substantive background or project example was provided.' : 'Deepen answers with causal trade-offs and quantified outcomes.']
        : [],
      exchanges: r1Exchanges,
    },
    {
      roundNumber: 2,
      key: 'round2',
      title: round2Title,
      shortTitle: round2Short,
      badge: round2Badge,
      status: round2Status,
      score: round2Score,
      verdict: round2Verdict,
      metric: round2Metric,
      whatHappened: round2WhatHappened,
      highlights: codeSubmitted
        ? [isNonTech ? 'Quantitative metrics audited and executive memo recorded' : `Solution verified in ${selectedLang || 'sandbox'}`]
        : [],
      gaps: !codeSubmitted
        ? [isNonTech ? 'Complete all financial ratios and write a concise strategic recommendation.' : 'Pass the boundary test cases and defend complexity/edge cases.']
        : [],
      exchanges: r2Exchanges,
      artifact: {
        type: 'code_or_case',
        summary: codeSubmitted ? round2Metric : 'No verified submission recorded',
        details: codeContent && codeSubmitted ? [codeContent.slice(0, 1200)] : [],
      },
    },
    {
      roundNumber: 3,
      key: 'round3',
      title: round3Title,
      shortTitle: round3Short,
      badge: round3Badge,
      status: round3Status,
      score: round3Score,
      verdict: round3Verdict,
      metric: round3Metric,
      whatHappened: round3WhatHappened,
      highlights: topologyEvaluation?.strengths || [],
      gaps: topologyEvaluation?.bottlenecks || [`${isNonTech ? 'Business workflow' : 'System architecture'} canvas was not completed.`],
      exchanges: r3Exchanges,
      artifact: {
        type: 'topology',
        summary: topologyEvaluation ? topologyEvaluation.summary : 'Canvas left blank',
        details: topologyEvaluation?.strengths || [],
        bottlenecks: topologyEvaluation?.bottlenecks || [],
        recommendations: topologyEvaluation?.recommendations || [],
      },
    },
    {
      roundNumber: 4,
      key: 'round4',
      title: 'Round 4: Executive STAR Deep Dive',
      shortTitle: 'STAR Deep Dive',
      badge: round4Badge,
      status: round4Status,
      score: round4Score,
      verdict: round4Verdict,
      metric: round4Metric,
      whatHappened: round4WhatHappened,
      highlights: effectiveStarSteps >= 3 ? [`Covered ${effectiveStarSteps}/4 STAR framework stages`] : [],
      gaps: effectiveStarSteps < 3
        ? ['Structure closing answers explicitly across Situation, Task, Action, and measurable Result.']
        : [],
      exchanges: r4Exchanges,
      artifact: {
        type: 'star',
        summary: `${effectiveStarSteps}/4 STAR elements articulated`,
        starStepsCompleted: effectiveStarSteps,
      },
    },
  ];

  const perRoundScores = {
    round1: {
      title: roundReports[0].title,
      score: roundReports[0].score,
      verdict: roundReports[0].verdict,
      metric: roundReports[0].metric,
      badge: roundReports[0].badge,
      status: roundReports[0].status,
    },
    round2: {
      title: roundReports[1].title,
      score: roundReports[1].score,
      verdict: roundReports[1].verdict,
      metric: roundReports[1].metric,
      badge: roundReports[1].badge,
      status: roundReports[1].status,
    },
    round3: {
      title: roundReports[2].title,
      score: roundReports[2].score,
      verdict: roundReports[2].verdict,
      metric: roundReports[2].metric,
      badge: roundReports[2].badge,
      status: roundReports[2].status,
    },
    round4: {
      title: roundReports[3].title,
      score: roundReports[3].score,
      verdict: roundReports[3].verdict,
      metric: roundReports[3].metric,
      badge: roundReports[3].badge,
      status: roundReports[3].status,
    },
  };

  const starMetrics = {
    stepsCompleted: Math.min(4, Math.max(0, effectiveStarSteps)),
    stepsArticulated: `${effectiveStarSteps}/4 STAR steps articulated`,
    badge: round4Badge
  };

  // Only include persona coaching when there is genuine evidence; otherwise avoid fake archetype praise
  const hasRealEvidence = scoringResult.overallScore >= 20 || allSubstantiveTurns.length > 0;
  const honestCoaching = hasRealEvidence
    ? coaching
    : {
        personaSummary: `Insufficient interview evidence recorded to generate personalized archetype insights yet.`,
        coachingTips: realImprovements.slice(0, 3),
        tailoredStrengths: [],
        growthArea: 'Complete the interview rounds with concrete project examples, quantitative reasoning, and structured STAR answers.',
      };

  const isEliminated = eliminatedInRound === 2 || eliminatedInRound === 3;
  const finalVerdict = isEliminated ? `Eliminated in Round ${eliminatedInRound}` : scoringResult.verdict;
  const finalReadiness = isEliminated ? 'Did Not Advance' : scoringResult.readiness;
  const finalSummary = isEliminated
    ? `Interview concluded after Round ${eliminatedInRound} defense (${scoringResult.overallScore}%). ${eliminationReason || 'Did not clear all 5 cross-examination defense questions required to advance to the next round.'}`
    : honestSummary;

  return {
    verdict: finalVerdict,
    score: scoringResult.overallScore,
    readiness: finalReadiness,
    eliminatedInRound,
    eliminationReason,
    roleName: scoringResult.roleName,
    rubricVersion: 'v2.0',
    appliedWeights: scoringResult.appliedWeights,
    radar: scoringResult.sanitizedDimensions,
    summary: finalSummary,
    strengths: realStrengths,
    improvements: realImprovements.join(' • '),
    coaching: honestCoaching,
    telemetryDiagnostics,
    perRoundScores,
    roundReports,
    starMetrics,
    defendedTechStack,
    questionBreakdown,
    solvingScore: round2Score,
    hasRealEvidence
  };
}

export function generateInterviewTranscriptMarkdown({
  activeTopicName,
  domainStream,
  teacherName,
  evaluationResult,
  eyeContactScore,
  wpmScore,
  fillerWordCount,
  codeContent,
  selectedLang,
  messages,
  tabSwitchCount
}: {
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  teacherName: string;
  evaluationResult: any;
  eyeContactScore: number | null;
  wpmScore: number | null;
  fillerWordCount: number;
  codeContent: string;
  selectedLang: string;
  messages: Message[];
  tabSwitchCount?: number;
}): string {
  const lines = [
    `# Pinit Career OS — Technical Interview Report`,
    `**Topic:** ${activeTopicName}  `,
    `**Track:** ${domainStream === 'non_tech' ? 'Non-Technical / Product' : 'Technical / Engineering'}  `,
    `**Interviewer:** ${teacherName}  `,
    `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}  `,
    `**Verdict:** ${evaluationResult?.verdict || 'Completed'} (${evaluationResult?.score ?? 0}%)  `,
    ...(evaluationResult?.readiness ? [`**Readiness:** ${evaluationResult.readiness}  `] : []),
    `- **STAR Framework Coverage:** ${evaluationResult?.perRoundScores?.round4?.metric || 'Articulated'} (${evaluationResult?.perRoundScores?.round4?.badge || 'STAR'})  `,
    `\n---\n`,
    `## 1. Per-Round Performance Breakdown`,
    `- **Round 1 (${evaluationResult?.perRoundScores?.round1?.badge || 'Behavioral'}):** ${evaluationResult?.perRoundScores?.round1?.score ?? 0}% — ${evaluationResult?.perRoundScores?.round1?.verdict || 'Competent'} (${evaluationResult?.perRoundScores?.round1?.metric || 'Verbal Q&A'})`,
    `- **Round 2 (${evaluationResult?.perRoundScores?.round2?.badge || 'Coding'}):** ${evaluationResult?.perRoundScores?.round2?.score ?? 0}% — ${evaluationResult?.perRoundScores?.round2?.verdict || 'Working'} (${evaluationResult?.perRoundScores?.round2?.metric || 'Test assertions'})`,
    `- **Round 3 (${evaluationResult?.perRoundScores?.round3?.badge || 'Systems'}):** ${evaluationResult?.perRoundScores?.round3?.score ?? 0}% — ${evaluationResult?.perRoundScores?.round3?.verdict || 'Viable'} (${evaluationResult?.perRoundScores?.round3?.metric || 'Canvas topology'})`,
    `- **Round 4 (${evaluationResult?.perRoundScores?.round4?.badge || 'STAR'}):** ${evaluationResult?.perRoundScores?.round4?.score ?? 0}% — ${evaluationResult?.perRoundScores?.round4?.verdict || 'Structured'} (${evaluationResult?.perRoundScores?.round4?.metric || 'STAR criteria'})`,
    `\n## 2. Telemetry & Delivery Diagnostics`,
    `- **Average Eye Contact:** ${typeof eyeContactScore === 'number' ? `${eyeContactScore}%` : 'Not Tracked'}`,
    `- **Speaking Pace:** ${typeof wpmScore === 'number' ? `${wpmScore} Words Per Minute` : 'Not Measured'}`,
    `- **Filler Words Count:** ${typeof fillerWordCount === 'number' ? fillerWordCount : 'Not Measured'}`,
    `- **Tab Switches / Pauses:** ${typeof tabSwitchCount === 'number' ? tabSwitchCount : 0}`,
    `\n## 3. Candidate Code Submission (${selectedLang})`,
    '```' + selectedLang,
    codeContent || '// No code submitted',
    '```',
    `\n## 4. Complete Interview Transcript\n`
  ];

  messages.forEach(m => {
    const sender = m.role === 'user' ? 'Candidate' : teacherName;
    lines.push(`**${sender}:** ${m.content}\n`);
  });

  return lines.join('\n');
}

export function generateScorecardPrintHtml({
  activeTopicName,
  domainStream,
  teacherName,
  evaluationResult,
  eyeContactScore,
  wpmScore,
  fillerWordCount,
  tabSwitchCount,
  messages,
}: {
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  teacherName: string;
  evaluationResult: any;
  eyeContactScore: number | null;
  wpmScore: number | null;
  fillerWordCount: number;
  tabSwitchCount?: number;
  messages: Message[];
}): string {
  const score = Number.isFinite(Number(evaluationResult?.score)) ? Number(evaluationResult.score) : 0;
  const verdict = escapeHtml(evaluationResult?.verdict || 'Completed');
  const safeTopic = escapeHtml(activeTopicName);
  const safeTeacher = escapeHtml(teacherName);
  const rounds = evaluationResult?.perRoundScores || {};
  const evidence = Array.isArray(evaluationResult?.answerQuality?.evidence) ? evaluationResult.answerQuality.evidence : [];
  const techStack = Array.isArray(evaluationResult?.defendedTechStack) ? evaluationResult.defendedTechStack : [];
  const qBreakdown = Array.isArray(evaluationResult?.questionBreakdown) ? evaluationResult.questionBreakdown : [];

  return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Scorecard - ' + safeTopic + '</title>' +
    '<style>@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none; } }' +
    'body { font-family: sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; background: #fff; }' +
    '.header { border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }' +
    '.brand { font-size: 20px; font-weight: 900; color: #6366f1; }' +
    '.score-badge { font-size: 28px; font-weight: 900; color: ' + (score >= 70 ? '#10b981' : '#f59e0b') + '; }' +
    '.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }' +
    '.card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }' +
    '.card h4 { margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; color: #64748b; }' +
    '.pill { display: inline-block; padding: 3px 8px; border-radius: 999px; background: #e0e7ff; color: #3730a3; font-size: 11px; font-weight: 700; margin: 2px 4px 2px 0; }' +
    '.evidence { border-left: 3px solid #6366f1; padding: 8px 12px; margin-bottom: 8px; background: #f1f5f9; border-radius: 0 6px 6px 0; }' +
    '.evidence blockquote { margin: 0; font-style: italic; font-size: 13px; color: #0f172a; }' +
    '.evidence p { margin: 4px 0 0 0; font-size: 12px; color: #475569; }</style></head><body>' +
    '<div class="header"><div><div class="brand">PinIT Career OS — AI Mock Interview Official Scorecard</div>' +
    '<div style="font-size: 14px; color: #64748b; margin-top: 4px;">Topic: <strong>' + safeTopic + '</strong> • Track: <strong>' + (domainStream === 'non_tech' ? 'Non-Tech / Commerce' : 'Tech / Engineering') + '</strong> • Panel: <strong>' + safeTeacher + '</strong></div></div>' +
    '<div style="text-align: right;"><div class="score-badge">' + score + '%</div><div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b;">' + verdict + '</div></div></div>' +
    '<div class="grid"><div class="card"><h4>Round 1: Behavioral & Domain</h4><div style="font-size: 18px; font-weight: 800;">' + (rounds.round1?.score ?? 0) + '% — ' + escapeHtml(rounds.round1?.verdict ?? 'Competent') + '</div><div style="font-size: 12px; color: #64748b;">' + escapeHtml(rounds.round1?.metric ?? 'Verbal Q&A Communication') + '</div></div>' +
    '<div class="card"><h4>Round 2: Problem Solving</h4><div style="font-size: 18px; font-weight: 800;">' + (rounds.round2?.score ?? 0) + '% — ' + escapeHtml(rounds.round2?.verdict ?? 'Working') + '</div><div style="font-size: 12px; color: #64748b;">' + escapeHtml(rounds.round2?.metric ?? 'Test suite execution') + '</div></div>' +
    '<div class="card"><h4>Round 3: System Architecture</h4><div style="font-size: 18px; font-weight: 800;">' + (rounds.round3?.score ?? 0) + '% — ' + escapeHtml(rounds.round3?.verdict ?? 'Viable') + '</div><div style="font-size: 12px; color: #64748b;">' + escapeHtml(rounds.round3?.metric ?? 'Canvas topology verification') + '</div></div>' +
    '<div class="card"><h4>Round 4: STAR Defense</h4><div style="font-size: 18px; font-weight: 800;">' + (rounds.round4?.score ?? 0) + '% — ' + escapeHtml(rounds.round4?.verdict ?? 'Structured') + '</div><div style="font-size: 12px; color: #64748b;">' + escapeHtml(rounds.round4?.metric ?? 'STAR Framework Rigor') + '</div></div></div>' +
    (techStack.length > 0 ? ('<div class="card" style="margin-bottom: 24px;"><h4>Verified Defended Tech Stack</h4><div>' + techStack.map((t: string) => '<span class="pill">' + escapeHtml(t) + '</span>').join('') + '</div></div>') : '') +
    '<div class="card" style="margin-bottom: 24px;"><h4>Delivery & Telemetry Diagnostics</h4><div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 8px;">' +
    '<span>Eye Contact Focus: <strong>' + (typeof eyeContactScore === 'number' ? eyeContactScore + '%' : 'N/A') + '</strong></span>' +
    '<span>Speaking Cadence: <strong>' + (typeof wpmScore === 'number' ? wpmScore + ' WPM' : 'N/A') + '</strong></span>' +
    '<span>Filler Words: <strong>' + (typeof fillerWordCount === 'number' ? fillerWordCount : 0) + '</strong></span>' +
    '<span>Tab Pauses: <strong>' + (typeof tabSwitchCount === 'number' ? tabSwitchCount : 0) + '</strong></span></div></div>' +
    (evidence.length > 0 ? ('<div style="margin-bottom: 24px;"><h3 style="font-size: 14px; text-transform: uppercase; color: #475569; margin-bottom: 12px;">Verified Transcript Quotations & Rubric Evidence</h3>' +
      evidence.map((e: any) => '<div class="evidence"><blockquote>"' + escapeHtml(e.quote) + '"</blockquote><p><strong>' + escapeHtml(e.dimension) + ':</strong> ' + escapeHtml(e.assessment) + '</p></div>').join('') + '</div>') : '') +
    (qBreakdown.length > 0 ? ('<div style="margin-bottom: 24px;"><h3 style="font-size: 14px; text-transform: uppercase; color: #475569; margin-bottom: 12px;">Question-by-Question Benchmark Review</h3>' +
      qBreakdown.map((q: any, idx: number) => '<div class="card" style="margin-bottom: 10px;"><div style="font-weight: 800; font-size: 13px;">Q' + (idx + 1) + ': ' + escapeHtml(q.question) + ' (' + (Number.isFinite(Number(q.score)) ? Number(q.score) : 0) + '%)</div><div style="font-size: 12px; margin-top: 4px;"><strong>Your Answer:</strong> ' + escapeHtml(q.candidateAnswer || q.candidate_answer || '') + '</div><div style="font-size: 12px; margin-top: 4px; color: #0f766e;"><strong>Ideal Benchmark:</strong> ' + escapeHtml(q.idealAnswer || q.ideal_answer || '') + '</div><div style="font-size: 11px; margin-top: 4px; color: #475569;">' + escapeHtml(q.feedback || '') + '</div></div>').join('') + '</div>') : '') +
    '<div class="no-print" style="text-align: center; margin-top: 30px;"><button onclick="window.print()" style="background: #6366f1; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 800; cursor: pointer;">🖨️ Print / Save as PDF</button></div></body></html>';
}

export function exportInterviewTranscriptFile({
  format,
  activeTopicName,
  domainStream,
  teacherName,
  evaluationResult,
  eyeContactScore,
  wpmScore,
  fillerWordCount,
  codeContent,
  selectedLang,
  latestTopology,
  messages,
  tabSwitchCount
}: {
  format: 'markdown' | 'json' | 'pdf';
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  teacherName: string;
  evaluationResult: any;
  eyeContactScore: number | null;
  wpmScore: number | null;
  fillerWordCount: number;
  codeContent: string;
  selectedLang: string;
  latestTopology: any;
  messages: Message[];
  tabSwitchCount?: number;
}) {
  if (typeof window === 'undefined') return;

    if (format === 'pdf') {
    const html = generateScorecardPrintHtml({
      activeTopicName,
      domainStream,
      teacherName,
      evaluationResult,
      eyeContactScore,
      wpmScore,
      fillerWordCount,
      tabSwitchCount,
      messages,
    });
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        try { printWindow.print(); } catch {}
      }, 300);
      toast.success('Scorecard PDF Ready 📄', 'Opened print-ready PDF scorecard.');
    } else {
      // Fallback if browser pop-up blocker prevented opening a print tab
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Interview_${activeTopicName.replace(/[^a-zA-Z0-9]/g, '_')}_Scorecard.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.info('Pop-up Blocked — Downloaded Scorecard', 'Open the downloaded HTML file and press Ctrl+P to save as PDF.');
    }
    return;
  }

  if (format === 'json') {
    const payload = {
      topic: activeTopicName,
      domain: domainStream,
      interviewer: teacherName,
      date: new Date().toISOString(),
      overallScore: evaluationResult?.score || 0,
      verdict: evaluationResult?.verdict || 'Recorded',
      readiness: evaluationResult?.readiness,
      appliedWeights: evaluationResult?.appliedWeights,
      perRoundScores: evaluationResult?.perRoundScores,
      starMetrics: evaluationResult?.starMetrics || {
        stepsArticulated: evaluationResult?.perRoundScores?.round4?.metric,
        badge: evaluationResult?.perRoundScores?.round4?.badge
      },
      telemetry: {
        eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : null,
        wpm: typeof wpmScore === 'number' ? wpmScore : null,
        fillerWords: typeof fillerWordCount === 'number' ? fillerWordCount : null,
        tabSwitches: typeof tabSwitchCount === 'number' ? tabSwitchCount : 0
      },
      selectedLanguage: selectedLang,
      codeSolution: codeContent,
      architectureTopology: latestTopology,
      transcript: messages
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_${activeTopicName.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transcript Downloaded 📋', 'Exported full JSON interview record.');
  } else {
    const markdown = generateInterviewTranscriptMarkdown({
      activeTopicName,
      domainStream,
      teacherName,
      evaluationResult,
      eyeContactScore,
      wpmScore,
      fillerWordCount,
      codeContent,
      selectedLang,
      messages,
      tabSwitchCount
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_${activeTopicName.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transcript Downloaded 📋', 'Exported comprehensive Markdown interview report.');
  }
}
