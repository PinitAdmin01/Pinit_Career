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

  const trimmed = input.trim();
  if (trimmed in ROLE_SCORING_MATRICES) {
    return trimmed as RoleKey;
  }

  const clean = trimmed.toLowerCase();

  // 1. Explicit multi-word algorithmic and CS fundamentals (must not be confused with Data Analyst)
  if (/\b(data\s+structures?|algorithms?|dsa|leetcode|competitive\s+programming)\b/i.test(clean)) {
    return 'sde';
  }

  // 2. Build & Release / CI/CD (must not be confused with Frontend because of 'build' or 'release')
  if (/\b(build\s*(?:&|and)?\s*release|ci\s*[\/-]?\s*cd)\b/i.test(clean)) {
    return 'devops';
  }

  // 3. Business Development (BD/BDE/BDR must not be confused with Business Analyst)
  if (/\b(business\s+development|\bbde\b|\bbdr\b|\bsdr\b)\b/i.test(clean)) {
    return 'sales_marketing';
  }

  // 4. Product Management (whole-word check to avoid matching inside 'development', 'programmer', etc.)
  if (/\b(product\s+manag(?:er|ement)|\bpm\b|\btpm\b|\bapm\b|product\s+owner|technical\s+product\s+manag(?:er|ement)|program\s+manag(?:er|ement)|project\s+manag(?:er|ement))\b/i.test(clean)) {
    return 'pm';
  }

  // 5. DevOps, Cloud, Infrastructure, Site Reliability & Security
  if (/\b(devops|sre|site\s+reliability|cloud|infrastructure|infra|platform\s+engineer|sysadmin|system\s+administrator|kubernetes|k8s|docker|terraform|cybersecurity|infosec|security\s+engineer)\b/i.test(clean)) {
    return 'devops';
  }

  // 6. Data Analyst, Data Science & Business Intelligence (whole-word check so 'bi' does not match 'mobile')
  if (
    /\b(data\s+analyst|data\s+analytics|data\s+scientist|data\s+science|business\s+intelligence|\bbi\b|power\s+bi|tableau|sql\s+analyst|data\s+engineer|analytics\s+engineer|machine\s+learning|\bml\b|\bai\b|deep\s+learning|nlp|computer\s+vision|quantitative\s+analyst)\b/i.test(clean) ||
    (/\b(data|analytics|sql)\b/i.test(clean) && !/\bstructures?\b/i.test(clean))
  ) {
    return 'data_analyst';
  }

  // 7. Frontend, UI/UX & Web Development (whole-word check so 'ui' does not match 'build' or 'fruit')
  if (/\b(frontend|front\s+end|ui\s*[\/-]?\s*ux|\bui\b|\bux\b|react|next\.?js|vue|angular|svelte|web\s+developer|web\s+development|web\s+design|css|html)\b/i.test(clean)) {
    return 'frontend';
  }

  // 8. Backend, Distributed Systems & Database (whole-word check so 'api' does not match 'rapid')
  if (/\b(backend|back\s+end|distributed\s+systems?|microservices?|database\s+engineer|database\s+admin(?:istrator)?|\bdba\b|\bapi\b|server\s+engineer|systems?\s+engineer)\b/i.test(clean)) {
    return 'backend';
  }

  // 9. Business Analyst, Operations & Finance
  if (/\b(business\s+analyst|operations\s+analyst|bizops|business\s+operations|consulting|management\s+consultant|financial\s+analyst|finance|audit|operations\s+manager)\b/i.test(clean)) {
    return 'business_analyst';
  }

  // 10. Sales, Marketing & Growth
  if (/\b(sales|marketing|growth|account\s+executive|client\s+success|customer\s+success|digital\s+marketing|seo|sem)\b/i.test(clean)) {
    return 'sales_marketing';
  }

  // 11. Software Development Engineer, General Programmer, Mobile & Full Stack
  if (/\b(sde|software|developer|engineer|programmer|programming|coder|coding|full\s*stack|fullstack|mobile|android|ios|flutter|react\s+native|swift|kotlin|java|python|golang|rust|c\+\+|computer\s+science)\b/i.test(clean)) {
    return 'sde';
  }

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
  deliveryStatus: 'Optimal' | 'Good' | 'Needs Practice' | 'Not Assessed';
  signals: Array<{ metric: string; value: string; diagnostic: string; status: 'good' | 'warning' | 'info' }>;
  practiceAdvice: string[];
} {
  const hasEyeContact = typeof telemetry?.eyeContact === 'number' && !isNaN(telemetry.eyeContact);
  const hasWpm = typeof telemetry?.wpm === 'number' && !isNaN(telemetry.wpm) && telemetry.wpm > 0;
  const hasFillerWords = typeof telemetry?.fillerWords === 'number' && !isNaN(telemetry.fillerWords);

  // If no telemetry metrics were measured at all, do NOT invent fake metrics!
  if (!hasEyeContact && !hasWpm && !hasFillerWords) {
    return {
      deliveryStatus: 'Not Assessed',
      signals: [
        {
          metric: 'Camera & Presence',
          value: 'Camera Off',
          diagnostic: 'Camera off, delivery not assessed.',
          status: 'info',
        },
        {
          metric: 'Speaking Pace',
          value: 'Not Measured',
          diagnostic: 'Audio telemetry inactive; speaking pace not assessed.',
          status: 'info',
        },
        {
          metric: 'Speech Clarity',
          value: 'Not Measured',
          diagnostic: 'Audio telemetry inactive; filler words not assessed.',
          status: 'info',
        },
      ],
      practiceAdvice: [
        'Camera off, delivery not assessed. Enable webcam and microphone telemetry in practice rounds for pacing, eye contact, and clarity diagnostics.',
      ],
    };
  }

  const signals: Array<{ metric: string; value: string; diagnostic: string; status: 'good' | 'warning' | 'info' }> = [];
  const practiceAdvice: string[] = [];

  // Pacing
  if (hasWpm) {
    const wpm = telemetry!.wpm!;
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
  } else {
    signals.push({
      metric: 'Speaking Pace',
      value: 'Not Measured',
      diagnostic: 'Pacing telemetry was not captured during this session.',
      status: 'info',
    });
  }

  // Filler words
  if (hasFillerWords) {
    const fillerWords = telemetry!.fillerWords!;
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
  } else {
    signals.push({
      metric: 'Speech Clarity',
      value: 'Not Measured',
      diagnostic: 'Speech clarity was not captured during this session.',
      status: 'info',
    });
  }

  // Camera & Visual Diagnostics (Strictly advisory, honest presence & framing)
  if (hasEyeContact) {
    const eyeContact = telemetry!.eyeContact!;
    if (eyeContact <= 0) {
      signals.push({
        metric: 'Camera & Presence',
        value: 'N/A (Audio Mode)',
        diagnostic: 'Camera inactive or audio-only mode. Visual presence was cleanly excluded from evaluation.',
        status: 'info',
      });
    } else if (eyeContact < 50) {
      signals.push({
        metric: 'Camera & Presence',
        value: 'Off-Center / Drift',
        diagnostic: 'Camera framing suggestion: positioning camera at eye level enhances conversational presence.',
        status: 'info',
      });
    } else {
      signals.push({
        metric: 'Camera & Presence',
        value: 'Centered Focus',
        diagnostic: 'Consistent, centered visual presence maintained throughout the session.',
        status: 'good',
      });
    }
  } else {
    signals.push({
      metric: 'Camera & Presence',
      value: 'Camera Off',
      diagnostic: 'Camera off, delivery not assessed.',
      status: 'info',
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
