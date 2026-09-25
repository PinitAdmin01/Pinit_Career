// src/lib/onboarding/diagnosticEngine.ts
/**
 * PinIT Career OS — Deterministic Onboarding Decision & Scoring Engine
 * 
 * CORE LAWS:
 * 1. Deterministic Evaluation: 100% deterministic TypeScript logic (no LLM hallucinations).
 * 2. Non-Pie Multi-Dimensional: PH, EX, ST, SIQ are scored independently; NEVER normalized to 100%.
 * 3. Confidence & Context Gate: "Strong" band strictly requires multiple observations across >= 2 contexts.
 * 4. Goal != Persona: Goal discovery sets targets and horizon; behavioral diagnostics sets operating style.
 * 5. Trade-off Detection: Detects tensions (e.g. exploration vs execution) to balance them in roadmap strategy.
 */

import {
  BehavioralDimension,
  DiagnosticContext,
  SJT_QUESTIONS,
  MATRIX_SCENARIOS,
  MATRIX_SCALE_CONFIG,
  TRADEOFF_PROBES,
  SJTOption,
  MatrixItem,
  TradeoffOption
} from './diagnosticRegistry';

export type EvidenceBand = 'strong' | 'moderate' | 'developing';

export interface DimensionMetric {
  dimension: BehavioralDimension;
  label: string;
  evidence: number;          // Raw accumulated evidence score
  normalizedScore: number;   // 0 - 100 calibration index
  band: EvidenceBand;
  confidence: number;        // 0.40 - 0.95 confidence level
  observationsCount: number; // Total data points collected
  contextsCount: number;     // Distinct problem contexts verified
  matrixAverage: number;     // Mean matrix rating (0.0 - 2.0)
}

export interface DetectedTradeoff {
  type: 
    | 'exploration_vs_execution'
    | 'analysis_vs_shipping'
    | 'independent_isolation_vs_alignment'
    | 'rigid_execution_vs_adaptation';
  severity: 'high' | 'moderate' | 'mild';
  confidence: number;
  description: string;
  roadmapRecommendation: string;
}

export interface RoadmapAllocations {
  explorationPct: number;
  executionPct: number;
  communicationPct: number;
  technicalGapPct: number;
}

export interface RoadmapStrategyResult {
  primaryIntervention: string;
  secondaryIntervention: string;
  learningMode: string;
  projectStrategy: string;
  allocations: RoadmapAllocations;
}

export interface RawDiagnosticResponse {
  questionId: string;
  optionId: string;
  responseTimeMs?: number;
  timestamp: number;
}

export interface RawMatrixResponse {
  scenarioId: string;
  itemId: string;
  rating: number; // 1 to 5
  responseTimeMs?: number;
  timestamp: number;
}

export interface GoalDiscoveryAnswers {
  outcome: string;
  role: string;
  secondaryRoles?: string[];
  horizonMonths: number;
  motivation: string[];
  exposureLevels?: string[];
  capabilitySelfRating?: string;
  dailyMinutes?: number;
  primaryConstraints?: string[];
  rawGoalText?: string;
  priorExperience?: string;
}

export interface DiagnosticAnswerSession {
  sjtResponses: RawDiagnosticResponse[];
  matrixResponses: RawMatrixResponse[];
  tradeoffResponses: RawDiagnosticResponse[];
  goal?: {
    outcome: string;
    role: string;
    secondaryRoles?: string[];
    horizonMonths: number;
    motivation: string[];
    rawGoalText?: string;
  };
  experience?: {
    exposureLevels: string[];
    capabilitySelfRating: string;
  };
  constraints?: {
    dailyMinutes: number;
    primaryConstraints: string[];
  };
  selectedMentor?: 'priya' | 'anish';
}

export interface CompleteDiagnosticInput {
  goal: {
    outcome: string;
    role: string;
    secondaryRoles?: string[];
    horizonMonths: number;
    motivation: string[];
    rawGoalText?: string;
  };
  experience: {
    exposureLevels: string[];
    capabilitySelfRating: string;
  };
  constraints: {
    dailyMinutes: number;
    primaryConstraints: string[];
  };
  sjtResponses: RawDiagnosticResponse[];
  matrixResponses: RawMatrixResponse[];
  tradeoffResponses: RawDiagnosticResponse[];
  selectedMentor?: 'priya' | 'anish';
}

export interface CompleteDiagnosticProfile {
  goal: CompleteDiagnosticInput['goal'];
  experience: CompleteDiagnosticInput['experience'] & {
    parsedExperienceLevel: 'fresher' | 'intern' | 'experienced';
  };
  constraints: CompleteDiagnosticInput['constraints'];
  behaviorProfile: {
    PH: DimensionMetric;
    EX: DimensionMetric;
    ST: DimensionMetric;
    SIQ: DimensionMetric;
    dominantArchetype: string;
    secondaryArchetype: string;
    blendTitle: string;
    summaryDescription: string;
  };
  tradeoffs: DetectedTradeoff[];
  roadmapStrategy: RoadmapStrategyResult;
  systemMetadata: {
    diagnosticVersion: string;
    evaluatedAt: number;
    routerConfig: {
      provider: string;
      model: string;
      selectedMentor: 'priya' | 'anish';
    };
    rawAuditTrail: {
      sjtCount: number;
      matrixCount: number;
      tradeoffCount: number;
      averageLatencyMs: number;
    };
    misconceptionFeedbackHooks: {
      lastUpdated: number;
      observedMisconceptions: string[];
      adaptiveInterventionsCount: number;
    };
  };
}

// Dimension Display Labels
export const DIMENSION_LABELS: Record<BehavioralDimension, string> = {
  PH: 'Analytical Structuring',
  EX: 'Experimental Exploration',
  ST: 'Structured Execution',
  SIQ: 'Perspective Coordination'
};

// Dimension Archetype Names (for compatibility with legacy badges)
export const ARCHETYPE_NAMES: Record<BehavioralDimension, string> = {
  PH: 'Pattern Hunter',
  EX: 'Explorer',
  ST: 'Stabilizer',
  SIQ: 'Social IQ'
};

// 1. Build lookup dictionaries for O(1) resolution
const SJT_OPTIONS_MAP = new Map<string, { option: SJTOption; questionId: string }>();
for (const q of SJT_QUESTIONS) {
  for (const opt of q.options) {
    SJT_OPTIONS_MAP.set(opt.id, { option: opt, questionId: q.id });
  }
}

const MATRIX_ITEMS_MAP = new Map<string, { item: MatrixItem; scenarioId: string; context: DiagnosticContext }>();
for (const m of MATRIX_SCENARIOS) {
  for (const item of m.items) {
    MATRIX_ITEMS_MAP.set(item.id, { item, scenarioId: m.id, context: m.context });
  }
}

const TRADEOFF_OPTIONS_MAP = new Map<string, { option: TradeoffOption; probeId: string }>();
for (const t of TRADEOFF_PROBES) {
  for (const opt of t.options) {
    TRADEOFF_OPTIONS_MAP.set(opt.id, { option: opt, probeId: t.id });
  }
}

/**
 * Main Evaluation Engine Function
 */
export function evaluateDiagnosticSession(input: CompleteDiagnosticInput | DiagnosticAnswerSession): CompleteDiagnosticProfile {
  const safeGoal = input.goal || {
    outcome: 'internship',
    role: 'full_stack_developer',
    secondaryRoles: [],
    horizonMonths: 6,
    motivation: ['career_placement'],
    rawGoalText: ''
  };

  const safeExperience = input.experience || {
    exposureLevels: [],
    capabilitySelfRating: 'guided_builder'
  };

  const safeConstraints = input.constraints || {
    dailyMinutes: 90,
    primaryConstraints: []
  };

  // 1. Accumulate Evidence per Dimension
  const accumulators = {
    PH: { total: 0, contexts: new Set<string>(), observations: 0, matrixScores: [] as number[], latencies: [] as number[] },
    EX: { total: 0, contexts: new Set<string>(), observations: 0, matrixScores: [] as number[], latencies: [] as number[] },
    ST: { total: 0, contexts: new Set<string>(), observations: 0, matrixScores: [] as number[], latencies: [] as number[] },
    SIQ: { total: 0, contexts: new Set<string>(), observations: 0, matrixScores: [] as number[], latencies: [] as number[] }
  };

  const allLatencies: number[] = [];

  // A. Process SJT Responses
  for (const resp of input.sjtResponses || []) {
    if (resp.responseTimeMs && resp.responseTimeMs > 0) {
      allLatencies.push(resp.responseTimeMs);
    }
    const entry = SJT_OPTIONS_MAP.get(resp.optionId);
    if (entry) {
      const dim = entry.option.dimension;
      accumulators[dim].total += entry.option.evidence; // +2.0
      accumulators[dim].observations += 1;
      accumulators[dim].contexts.add(entry.option.context);
      if (resp.responseTimeMs && resp.responseTimeMs > 0) {
        accumulators[dim].latencies.push(resp.responseTimeMs);
      }
    }
  }

  // B. Process Matrix Responses
  for (const mResp of input.matrixResponses || []) {
    if (mResp.responseTimeMs && mResp.responseTimeMs > 0) {
      allLatencies.push(mResp.responseTimeMs);
    }
    const entry = MATRIX_ITEMS_MAP.get(mResp.itemId);
    if (entry) {
      const dim = entry.item.dimension;
      const rating = Math.max(1, Math.min(5, Math.round(mResp.rating)));
      const score = (MATRIX_SCALE_CONFIG as any)[rating]?.evidence ?? 1.0;
      accumulators[dim].total += score;
      accumulators[dim].observations += 1;
      accumulators[dim].matrixScores.push(score);
      accumulators[dim].contexts.add(entry.context);
      if (mResp.responseTimeMs && mResp.responseTimeMs > 0) {
        accumulators[dim].latencies.push(mResp.responseTimeMs);
      }
    }
  }

  // C. Process Trade-off Responses (Additional context validation)
  const tradeoffPoles: Record<string, number> = {};
  for (const tResp of input.tradeoffResponses || []) {
    if (tResp.responseTimeMs && tResp.responseTimeMs > 0) {
      allLatencies.push(tResp.responseTimeMs);
    }
    const entry = TRADEOFF_OPTIONS_MAP.get(tResp.optionId);
    if (entry) {
      tradeoffPoles[entry.option.pole] = (tradeoffPoles[entry.option.pole] || 0) + 1;
    }
  }

  // 2. Score Dimensions Independently (NO 100% PIE)
  const dimensions: BehavioralDimension[] = ['PH', 'EX', 'ST', 'SIQ'];
  const metrics: Record<BehavioralDimension, DimensionMetric> = {} as any;

  for (const dim of dimensions) {
    const acc = accumulators[dim];
    const rawEvidence = Number(acc.total.toFixed(1));
    const observations = acc.observations;
    const contextsCount = acc.contexts.size;
    const matrixAverage = acc.matrixScores.length > 0
      ? Number((acc.matrixScores.reduce((a, b) => a + b, 0) / acc.matrixScores.length).toFixed(2))
      : 0;

    // Confidence formula: scales with evidence count and context variety (clamped 0.40 - 0.95)
    const confidence = Math.min(0.95, Math.max(0.40, Number((0.45 + (observations * 0.035) + (contextsCount * 0.05)).toFixed(2))));

    // Normalized Score: max achievable evidence is ~32 (12*2 + 4*2), baseline scale 0 - 100
    const normalizedScore = Math.min(100, Math.max(10, Math.round((rawEvidence / 26) * 100)));

    // Strict Band Classification Rules:
    // Strong requires: rawEvidence >= 7.0, contextsCount >= 2, matrixAverage >= 1.0, observations >= 3
    let band: EvidenceBand = 'developing';
    if (rawEvidence >= 7.0 && contextsCount >= 2 && matrixAverage >= 1.0 && observations >= 3) {
      band = 'strong';
    } else if (rawEvidence >= 4.5 && observations >= 2) {
      band = 'moderate';
    } else {
      band = 'developing';
    }

    metrics[dim] = {
      dimension: dim,
      label: DIMENSION_LABELS[dim],
      evidence: rawEvidence,
      normalizedScore,
      band,
      confidence,
      observationsCount: observations,
      contextsCount,
      matrixAverage
    };
  }

  // 3. Trade-off & Bottleneck Detection
  const tradeoffs: DetectedTradeoff[] = [];
  const ph = metrics.PH;
  const ex = metrics.EX;
  const st = metrics.ST;
  const siq = metrics.SIQ;

  // Tension 1: Exploration vs Execution
  if ((ex.band === 'strong' || ex.band === 'moderate') && st.band === 'developing') {
    const severity = ex.band === 'strong' ? 'high' : 'moderate';
    tradeoffs.push({
      type: 'exploration_vs_execution',
      severity,
      confidence: Number(((ex.confidence + st.confidence) / 2).toFixed(2)),
      description: 'You generate creative alternatives and experiment quickly, but your current evidence suggests consistent completion and scope control is your main growth bottleneck.',
      roadmapRecommendation: 'Explore quickly (20%) → Freeze scope → Execute deliverables (50%) → Ship on schedule.'
    });
  }

  // Tension 2: Analysis Paralysis vs Shipping
  if (ph.band === 'strong' && st.band === 'developing') {
    tradeoffs.push({
      type: 'analysis_vs_shipping',
      severity: 'moderate',
      confidence: Number(((ph.confidence + st.confidence) / 2).toFixed(2)),
      description: 'You excel at deep architectural structuring and root cause analysis, but may spend excessive time analyzing potential failure modes before committing production code.',
      roadmapRecommendation: 'Set a strict 20-minute analysis cap → Create a minimal functional prototype → Iterate live.'
    });
  }

  // Tension 3: Independent Isolation vs Perspective Seeking
  if ((ph.band === 'strong' || ex.band === 'strong') && siq.band === 'developing') {
    tradeoffs.push({
      type: 'independent_isolation_vs_alignment',
      severity: 'moderate',
      confidence: Number(((ph.confidence + siq.confidence) / 2).toFixed(2)),
      description: 'You exhibit fierce independent problem-solving tenacity, but may hesitate to seek stakeholder clarification early, risking wasted effort on misaligned requirements.',
      roadmapRecommendation: 'Investigate solo for 15 minutes → Document explicit questions → Seek peer/mentor alignment.'
    });
  }

  // Tension 4: Rigid Execution vs Experimental Adaptation
  if (st.band === 'strong' && ex.band === 'developing') {
    tradeoffs.push({
      type: 'rigid_execution_vs_adaptation',
      severity: 'mild',
      confidence: Number(((st.confidence + ex.confidence) / 2).toFixed(2)),
      description: 'You execute plans with exceptional reliability and discipline, but may resist pivoting when unexpected discoveries make the original plan suboptimal.',
      roadmapRecommendation: 'Maintain core execution sprint + Allocate 1 experimental branch to test emerging tools.'
    });
  }

  // 4. Dynamic Roadmap Strategy & Allocation
  let explorationPct = 25;
  let executionPct = 40;
  let communicationPct = 20;
  let technicalGapPct = 15;

  if (tradeoffs.some(t => t.type === 'exploration_vs_execution')) {
    explorationPct = 20;
    executionPct = 50;
    communicationPct = 20;
    technicalGapPct = 10;
  } else if (tradeoffs.some(t => t.type === 'analysis_vs_shipping')) {
    explorationPct = 15;
    executionPct = 55;
    communicationPct = 15;
    technicalGapPct = 15;
  } else if (tradeoffs.some(t => t.type === 'independent_isolation_vs_alignment')) {
    explorationPct = 25;
    executionPct = 35;
    communicationPct = 30;
    technicalGapPct = 10;
  }

  const primaryIntervention = tradeoffs.length > 0
    ? (tradeoffs[0].type === 'exploration_vs_execution' ? 'execution_consistency' :
       tradeoffs[0].type === 'analysis_vs_shipping' ? 'analysis_timeboxing' : 'collaborative_alignment')
    : 'balanced_progression';

  const secondaryIntervention = siq.band === 'developing'
    ? 'interview_and_stakeholder_communication'
    : 'portfolio_production_polish';

  const learningMode = ex.band === 'strong'
    ? 'experiment_then_structure'
    : 'structure_then_apply';

  const projectStrategy = st.band === 'developing'
    ? 'small_scope_high_completion'
    : 'comprehensive_architectural_milestones';

  const roadmapStrategy: RoadmapStrategyResult = {
    primaryIntervention,
    secondaryIntervention,
    learningMode,
    projectStrategy,
    allocations: {
      explorationPct,
      executionPct,
      communicationPct,
      technicalGapPct
    }
  };

  // 5. Compute Dominant and Secondary Archetypes (for compatibility)
  const sortedDims = [...dimensions].sort((a, b) => metrics[b].evidence - metrics[a].evidence);
  const top1Dim = sortedDims[0];
  const top2Dim = sortedDims[1];

  const dominantArchetype = ARCHETYPE_NAMES[top1Dim];
  const secondaryArchetype = ARCHETYPE_NAMES[top2Dim];

  let blendTitle = `${dominantArchetype} Profile`;
  if (metrics[top1Dim].band === 'strong' && metrics[top2Dim].band === 'strong') {
    blendTitle = `${dominantArchetype} + ${secondaryArchetype} Hybrid`;
  }

  const summaryDescription = `Calibrated with strong ${metrics[top1Dim].label} and ${metrics[top2Dim].label} evidence. Primary roadmap priority is ${primaryIntervention.replace(/_/g, ' ')}.`;

  // Parse experience level
  const exposures = safeExperience.exposureLevels || [];
  let parsedExperienceLevel: 'fresher' | 'intern' | 'experienced' = 'fresher';
  if (exposures.includes('internship')) parsedExperienceLevel = 'intern';
  if (exposures.includes('freelance') || exposures.includes('production_deployment')) parsedExperienceLevel = 'experienced';

  const avgLatency = allLatencies.length > 0
    ? Math.round(allLatencies.reduce((a, b) => a + b, 0) / allLatencies.length)
    : 0;

  return {
    goal: safeGoal,
    experience: {
      ...safeExperience,
      parsedExperienceLevel
    },
    constraints: safeConstraints,
    behaviorProfile: {
      PH: metrics.PH,
      EX: metrics.EX,
      ST: metrics.ST,
      SIQ: metrics.SIQ,
      dominantArchetype,
      secondaryArchetype,
      blendTitle,
      summaryDescription
    },
    tradeoffs,
    roadmapStrategy,
    systemMetadata: {
      diagnosticVersion: 'v2.0_decision_engine',
      evaluatedAt: Date.now(),
      routerConfig: {
        provider: 'openrouter_rotator',
        model: 'anthropic/claude-3.5-sonnet',
        selectedMentor: input.selectedMentor || 'priya'
      },
      rawAuditTrail: {
        sjtCount: (input.sjtResponses || []).length,
        matrixCount: (input.matrixResponses || []).length,
        tradeoffCount: (input.tradeoffResponses || []).length,
        averageLatencyMs: avgLatency
      },
      misconceptionFeedbackHooks: {
        lastUpdated: Date.now(),
        observedMisconceptions: [],
        adaptiveInterventionsCount: 0
      }
    }
  };
}
