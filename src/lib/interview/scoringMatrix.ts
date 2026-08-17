// src/lib/interview/scoringMatrix.ts
// Role-Weighted AI Interview Scorecard & Rubric Engine
// Enforces strict separation:
// 1. Role determines performance dimension weights and deterministic score calculation.
// 2. Persona / Archetype determines coaching interpretations and growth guidance (NO score distortion).
// 3. Telemetry provides diagnostic practice signals (NO hiring score penalties).

export const ROLE_RUBRIC_VERSION = 'v1.0';

export interface InterviewDimensions {
  logic: number;     // Algorithmic thinking, analytical reasoning, mathematical rigor (0-100)
  systems: number;   // Architecture, scalability, structural design, distributed trade-offs (0-100)
  comms: number;     // Articulation, clarity, brevity, listener empathy (0-100)
  solving: number;   // Practical problem execution, code quality, edge-case handling (0-100)
  star: number;      // Behavioral competency, Situation-Task-Action-Result structure (0-100)
}

export type RoleKey =
  | 'sde'
  | 'backend'
  | 'frontend'
  | 'devops'
  | 'data_analyst'
  | 'pm'
  | 'business_analyst'
  | 'sales_marketing'
  | 'general_tech'
  | 'general_non_tech';

export type MindsetArchetype = 'Pattern Hunter' | 'Explorer' | 'Social IQ' | 'Stabilizer';

export interface RoleScoringWeights {
  roleName: string;
  stream: 'tech' | 'non_tech';
  description: string;
  weights: {
    logic: number;
    systems: number;
    comms: number;
    solving: number;
    star: number;
  };
  rubricFocus: string;
}

/**
 * Frozen Role Scoring Matrices (Weights sum to exactly 1.0)
 */
export const ROLE_SCORING_MATRICES: Record<RoleKey, RoleScoringWeights> = {
  sde: {
    roleName: 'Software Development Engineer (Full Stack / General)',
    stream: 'tech',
    description: 'Balanced focus across algorithmic logic, modular systems architecture, and working code implementation.',
    weights: {
      logic: 0.30,
      systems: 0.25,
      solving: 0.20,
      comms: 0.15,
      star: 0.10,
    },
    rubricFocus: 'Prioritize data structure efficiency, API boundary design, and concrete code correctness.',
  },
  backend: {
    roleName: 'Backend & Distributed Systems Engineer',
    stream: 'tech',
    description: 'Heavy emphasis on systems design, transactional consistency, database indexing, and scalability.',
    weights: {
      systems: 0.35,
      logic: 0.30,
      solving: 0.15,
      comms: 0.10,
      star: 0.10,
    },
    rubricFocus: 'Prioritize distributed caching, database indexing, concurrency safety, and failure recovery.',
  },
  frontend: {
    roleName: 'Frontend & UI/UX Engineer',
    stream: 'tech',
    description: 'Focus on UI state management, responsiveness, practical solving, and user-centric communication.',
    weights: {
      solving: 0.30,
      systems: 0.20,
      comms: 0.20,
      logic: 0.20,
      star: 0.10,
    },
    rubricFocus: 'Prioritize DOM performance, responsive state architecture, component reusability, and accessibility.',
  },
  devops: {
    roleName: 'DevOps & Cloud Infrastructure Architect',
    stream: 'tech',
    description: 'Heavy focus on reliability, CI/CD telemetry, cloud infrastructure, and operational risk mitigation.',
    weights: {
      systems: 0.40,
      solving: 0.20,
      logic: 0.15,
      comms: 0.15,
      star: 0.10,
    },
    rubricFocus: 'Prioritize infrastructure as code, zero-downtime deployments, security boundaries, and telemetry.',
  },
  data_analyst: {
    roleName: 'Data Analyst & Business Intelligence Specialist',
    stream: 'tech',
    description: 'Heavy analytical logic, query formulation, and data visualization communication.',
    weights: {
      logic: 0.35,
      solving: 0.25,
      comms: 0.15,
      systems: 0.15,
      star: 0.10,
    },
    rubricFocus: 'Prioritize quantitative reasoning, metric definitions, SQL/data modeling, and business insight delivery.',
  },
  pm: {
    roleName: 'Product Manager',
    stream: 'non_tech',
    description: 'Heavy focus on cross-functional communication, strategic systems design, and behavioral STAR leadership.',
    weights: {
      comms: 0.30,
      star: 0.25,
      systems: 0.20,
      solving: 0.15,
      logic: 0.10,
    },
    rubricFocus: 'Prioritize product sense, customer empathy, stakeholder trade-offs, and structured prioritization frameworks.',
  },
  business_analyst: {
    roleName: 'Business & Operations Analyst',
    stream: 'non_tech',
    description: 'Focus on process modeling, operational requirements, clear communication, and STAR execution.',
    weights: {
      comms: 0.25,
      logic: 0.20,
      systems: 0.20,
      star: 0.20,
      solving: 0.15,
    },
    rubricFocus: 'Prioritize unit economics, process bottleneck identification, structured documentation, and stakeholder reporting.',
  },
  sales_marketing: {
    roleName: 'Sales, Growth & Marketing Strategist',
    stream: 'non_tech',
    description: 'Dominant focus on persuasive communication, negotiation STAR examples, and customer value articulation.',
    weights: {
      comms: 0.40,
      star: 0.25,
      solving: 0.15,
      systems: 0.10,
      logic: 0.10,
    },
    rubricFocus: 'Prioritize active listening, objection handling, ROI articulation, and high-impact verbal engagement.',
  },
  general_tech: {
    roleName: 'General Technology Associate',
    stream: 'tech',
    description: 'Balanced technical evaluation for engineering and digital technology disciplines.',
    weights: {
      logic: 0.25,
      systems: 0.25,
      solving: 0.20,
      comms: 0.20,
      star: 0.10,
    },
    rubricFocus: 'Prioritize foundational problem solving, logical clarity, and technical curiosity.',
  },
  general_non_tech: {
    roleName: 'General Corporate & Business Associate',
    stream: 'non_tech',
    description: 'Balanced business evaluation for corporate, operations, and management disciplines.',
    weights: {
      comms: 0.35,
      star: 0.20,
      logic: 0.15,
      systems: 0.15,
      solving: 0.15,
    },
    rubricFocus: 'Prioritize structured communication, professional poise, and behavioral ownership.',
  },
};

/**
 * Normalizes an arbitrary role string or topic to a known RoleKey
 */
export function normalizeRoleKey(input?: string, stream?: string): RoleKey {
  if (!input) {
    return stream === 'non_tech' ? 'general_non_tech' : 'sde';
  }

  const clean = input.toLowerCase().replace(/[^a-z0-9_]/g, ' ').trim();

  if (clean.includes('product') || clean.includes('pm') || clean.includes('program')) return 'pm';
  if (clean.includes('data') || clean.includes('analytics') || clean.includes('bi') || clean.includes('sql')) return 'data_analyst';
  if (clean.includes('devops') || clean.includes('cloud') || clean.includes('infra') || clean.includes('sre') || clean.includes('security')) return 'devops';
  if (clean.includes('front') || clean.includes('ui') || clean.includes('ux') || clean.includes('react') || clean.includes('web')) return 'frontend';
  if (clean.includes('back') || clean.includes('system') || clean.includes('distributed') || clean.includes('database') || clean.includes('api')) return 'backend';
  if (clean.includes('sales') || clean.includes('market') || clean.includes('growth') || clean.includes('client')) return 'sales_marketing';
  if (clean.includes('business') || clean.includes('operations') || clean.includes('consulting') || clean.includes('finance')) return 'business_analyst';
  if (clean.includes('software') || clean.includes('engineer') || clean.includes('sde') || clean.includes('developer') || clean.includes('fullstack')) return 'sde';

  if (stream === 'non_tech') return 'general_non_tech';
  return 'general_tech';
}

/**
 * Bounds any numerical score safely to [0, 100] with standard rounding
 */
export function clampScore(score: unknown, fallback = 50): number {
  if (typeof score !== 'number' || isNaN(score)) {
    const parsed = parseFloat(String(score));
    if (isNaN(parsed)) return fallback;
    return Math.max(0, Math.min(100, Math.round(parsed)));
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Deterministic Role-Weighted Overall Score Calculator
 * Math: Overall = sum(dimension_score * weight)
 * The LLM NEVER invents the overall score; this code is the single authoritative source of truth.
 */
export function calculateRoleWeightedScore(
  dimensions: Partial<InterviewDimensions>,
  roleKey: RoleKey = 'sde'
): {
  overallScore: number;
  verdict: 'Hire' | 'Conditional Hire' | 'Needs Practice';
  readiness: 'strong' | 'ready' | 'developing' | 'not_ready';
  sanitizedDimensions: InterviewDimensions;
  appliedWeights: RoleScoringWeights['weights'];
  roleName: string;
} {
  const roleConfig = ROLE_SCORING_MATRICES[roleKey] || ROLE_SCORING_MATRICES.sde;
  const weights = roleConfig.weights;

  // Sanitize all dimensions fail-safe to [0, 100]
  const sanitized: InterviewDimensions = {
    logic: clampScore(dimensions?.logic, 50),
    systems: clampScore(dimensions?.systems, 50),
    comms: clampScore(dimensions?.comms, 50),
    solving: clampScore(dimensions?.solving, 50),
    star: clampScore(dimensions?.star, 50),
  };

  const rawWeighted =
    sanitized.logic * weights.logic +
    sanitized.systems * weights.systems +
    sanitized.comms * weights.comms +
    sanitized.solving * weights.solving +
    sanitized.star * weights.star;

  const overallScore = Math.max(0, Math.min(100, Math.round(rawWeighted)));

  // Strict Verdict & Readiness thresholds
  let verdict: 'Hire' | 'Conditional Hire' | 'Needs Practice' = 'Needs Practice';
  let readiness: 'strong' | 'ready' | 'developing' | 'not_ready' = 'not_ready';

  if (overallScore >= 82) {
    verdict = 'Hire';
    readiness = 'strong';
  } else if (overallScore >= 70) {
    verdict = 'Hire';
    readiness = 'ready';
  } else if (overallScore >= 55) {
    verdict = 'Conditional Hire';
    readiness = 'developing';
  } else {
    verdict = 'Needs Practice';
    readiness = 'not_ready';
  }

  return {
    overallScore,
    verdict,
    readiness,
    sanitizedDimensions: sanitized,
    appliedWeights: weights,
    roleName: roleConfig.roleName,
  };
}

/**
 * Persona Coaching Interpretation Engine
 * Invariant: Persona NEVER changes the numerical score; it customizes the pedagogical coaching advice.
 */
export function generatePersonaCoaching(
  archetype: MindsetArchetype = 'Pattern Hunter',
  dimensions: InterviewDimensions,
  roleKey: RoleKey = 'sde'
): {
  personaSummary: string;
  coachingTips: string[];
  tailoredStrengths: string[];
  growthArea: string;
} {
  const roleName = ROLE_SCORING_MATRICES[roleKey]?.roleName || 'Target Role';

  switch (archetype) {
    case 'Pattern Hunter':
      return {
        personaSummary: `As a Pattern Hunter interviewing for ${roleName}, your structural logic and analytical depth shine. Watch for over-engineering tendencies.`,
        coachingTips: [
          'Lead with a minimal viable architecture first before detailing advanced distributed optimizations.',
          'Quantify your algorithmic complexity (Time/Space) explicitly within the first 60 seconds of problem solving.',
          'Keep your verbal explanations concise to prevent drowning the interviewer in implementation details.'
        ],
        tailoredStrengths: ['Deep root-cause decomposition', 'Strong conceptual architecture awareness'],
        growthArea: 'Speed of shipping simple, working iterations over theoretical perfection.'
      };

    case 'Explorer':
      return {
        personaSummary: `As an Explorer interviewing for ${roleName}, your adaptability and creative problem-solving agility are key assets. Strengthen rigorous edge-case coverage.`,
        coachingTips: [
          'State your boundary and edge-case assumptions clearly before jumping into execution.',
          'Structure your answers around a step-by-step framework to keep your creative ideas anchored.',
          'Verify error handling and failure fallbacks systematically in your architectural diagrams.'
        ],
        tailoredStrengths: ['High versatility and creative ideation', 'Fast exploratory prototyping'],
        growthArea: 'Defensive edge-case planning and formal test coverage.'
      };

    case 'Social IQ':
      return {
        personaSummary: `As a Social IQ candidate for ${roleName}, your stakeholder empathy and communication articulation are standout traits. Elevate technical implementation depth.`,
        coachingTips: [
          'Back up your leadership and behavioral stories with concrete metrics (e.g. latency reduction %, revenue impact $).',
          'Dive directly into low-level technical trade-offs (e.g. memory footprint vs cache hit rates) when prompted.',
          'Frame technical discussions with structured STAR milestones (Situation, Task, Action, Result).'
        ],
        tailoredStrengths: ['High stakeholder alignment and empathy', 'Compelling and articulate storytelling'],
        growthArea: 'Deep, isolated algorithmic and mechanical implementation precision.'
      };

    case 'Stabilizer':
    default:
      return {
        personaSummary: `As a Stabilizer interviewing for ${roleName}, your focus on reliability, fault tolerance, and security is a major differentiator. Embrace rapid experimentation.`,
        coachingTips: [
          'Don\'t hesitate to propose fast, bold initial hypotheses even if all edge cases aren\'t yet resolved.',
          'Demonstrate proactive troubleshooting by walking through how you debug live production incidents.',
          'Highlight how your risk mitigation and audit practices saved time and prevented downtime in past projects.'
        ],
        tailoredStrengths: ['Uncompromising system stability and security hygiene', 'Meticulous risk mitigation'],
        growthArea: 'Tolerance for rapid ambiguity and moving quickly with incomplete information.'
      };
  }
}

/**
 * Diagnostic Telemetry Analyzer
 * Invariant: Telemetry (eye contact, posture, WPM, fillers) is purely diagnostic.
 * It NEVER deducts marks or creates hiring score bias.
 */
export function generateTelemetryDiagnostics(telemetry?: {
  eyeContact?: number;
  smileFreq?: number;
  posture?: number;
  wpm?: number;
  fillerWords?: number;
}): {
  deliveryStatus: 'Optimal' | 'Good' | 'Needs Practice';
  signals: Array<{ metric: string; value: string; diagnostic: string; status: 'good' | 'warning' | 'info' }>;
  practiceAdvice: string[];
} {
  const eyeContact = telemetry?.eyeContact ?? 75;
  const wpm = telemetry?.wpm ?? 125;
  const fillerWords = telemetry?.fillerWords ?? 0;

  const signals: Array<{ metric: string; value: string; diagnostic: string; status: 'good' | 'warning' | 'info' }> = [];
  const practiceAdvice: string[] = [];

  // Pacing
  if (wpm >= 110 && wpm <= 160) {
    signals.push({
      metric: 'Speaking Pace',
      value: `${wpm} WPM`,
      diagnostic: 'Natural, articulate conversational cadence.',
      status: 'good',
    });
  } else if (wpm > 160) {
    signals.push({
      metric: 'Speaking Pace',
      value: `${wpm} WPM`,
      diagnostic: 'Slightly fast cadence; consider pacing key architectural points with brief pauses.',
      status: 'warning',
    });
    practiceAdvice.push('Take a 1-second breath between major STAR milestones to allow the interviewer to digest points.');
  } else {
    signals.push({
      metric: 'Speaking Pace',
      value: `${wpm} WPM`,
      diagnostic: 'Deliberate, slow cadence; consider increasing momentum slightly during introductions.',
      status: 'info',
    });
  }

  // Filler words
  if (fillerWords === 0) {
    signals.push({
      metric: 'Speech Clarity',
      value: '0 filler words',
      diagnostic: 'Crisp, professional vocal delivery with zero filler crutches.',
      status: 'good',
    });
  } else if (fillerWords <= 3) {
    signals.push({
      metric: 'Speech Clarity',
      value: `${fillerWords} filler words`,
      diagnostic: 'Clean delivery within standard natural conversational range.',
      status: 'good',
    });
  } else {
    signals.push({
      metric: 'Speech Clarity',
      value: `${fillerWords} filler words detected`,
      diagnostic: 'Minor filler word cluster (um, uh, like).',
      status: 'warning',
    });
    practiceAdvice.push('Replace filler words ("um", "like") with a deliberate silent pause to project executive presence.');
  }

  // Camera & Visual Diagnostics (Strictly advisory, noting environmental variables)
  if (eyeContact < 40) {
    signals.push({
      metric: 'Gaze & Engagement',
      value: `${eyeContact}% focal track`,
      diagnostic: 'Camera alignment suggestion: positioning camera at eye level enhances presence.',
      status: 'info',
    });
  } else {
    signals.push({
      metric: 'Gaze & Engagement',
      value: `${eyeContact}% steady tracking`,
      diagnostic: 'Consistent, confident focal engagement throughout the session.',
      status: 'good',
    });
  }

  const hasWarnings = signals.some(s => s.status === 'warning');
  const deliveryStatus = hasWarnings ? 'Good' : 'Optimal';

  if (practiceAdvice.length === 0) {
    practiceAdvice.push('Maintain this clear, structured delivery across multi-round technical interviews.');
  }

  return {
    deliveryStatus,
    signals,
    practiceAdvice,
  };
}
