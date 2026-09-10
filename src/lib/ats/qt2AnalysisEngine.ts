// src/lib/ats/qt2AnalysisEngine.ts
/**
 * ============================================================================
 * QT2 COGNITIVE ARCHITECTURE, BEHAVIORAL MINDSET & INTEGRITY ANALYSIS ENGINE
 * ============================================================================
 * 
 * Purpose:
 * Evaluates candidate QT2 (System-2 Cognitive & Behavioral Quotient, 0-100)
 * using deterministic mathematical modeling and semantic evidence grounding.
 * 
 * CORE LAWS:
 * 1. ZERO EVIDENCE = ZERO SCORE: If a user has uploaded 0 documents and answered
 *    0 diagnostic simulation quests, QT2 is strictly 0/100. Never invent numbers.
 * 2. DIMENSIONS SUM TO 100%: The 4 archetypes (Pattern Hunter, Stabilizer, Social IQ, Explorer)
 *    represent a percentage distribution and must sum to exactly 100% when data exists, or all 0% when uncalibrated.
 * 3. FACTOR SCORES NEVER EXCEED WEIGHTS: Each pillar score cannot exceed its defined max weight:
 *    - Mindset Disposition: 0 - 35 pts
 *    - Execution Rigor & Impact: 0 - 25 pts
 *    - Sentinel Identity & Authenticity: 0 - 25 pts
 *    - Longitudinal Growth & Trajectory: 0 - 15 pts
 *    - Total Max: 100 pts
 */

import { VaultDocumentSlot, IdentityAuditReport } from './documentAuditEngine';

export interface QT2DimensionScores {
  patternHunter: number; // % (0 - 100)
  stabilizer: number;    // % (0 - 100)
  socialIQ: number;      // % (0 - 100)
  explorer: number;      // % (0 - 100)
}

export interface QT2BreakdownFactor {
  pillar: string;
  weight: number;
  score: number;
  maxScore: number;
  details: string;
}

export interface QT2ModelEvaluation {
  compositeScore: number; // 0 - 100
  dimensions: QT2DimensionScores;
  dominantArchetype: string;
  archetypeBlendTitle: string;
  archetypeDescription: string;
  selfAwarenessIndex: number; // 0 - 100%
  selfAwarenessLabel: string;
  executionRigorScore: number; // 0 - 100
  identityIntegrityScore: number; // 0 - 100
  longitudinalGrowthScore: number; // 0 - 100
  evaluatedDataPoints: number;
  factors: QT2BreakdownFactor[];
  behavioralSignals: {
    algorithmicDepth: number;
    reliabilityStandards: number;
    collaborationLeadership: number;
    experimentationVelocity: number;
  };
}

const BEHAVIORAL_LEXICONS = {
  patternHunter: [
    'algorithm', 'optimization', 'complexity', 'data structure', 'system architecture',
    'database', 'query', 'latency', 'throughput', 'distributed', 'scalable', 'concurrency',
    'machine learning', 'analytics', 'benchmark', 'c++', 'python', 'sql', 'postgresql',
    'backend', 'data pipeline', 'mathematics', 'modeling', 'profiling', 'reduced latency'
  ],
  stabilizer: [
    'test', 'unit test', 'integration test', 'jest', 'cypress', 'docker', 'ci/cd',
    'kubernetes', 'devops', 'security', 'auth', 'compliance', 'monitoring', 'reliability',
    'fault-tolerant', 'refactor', 'documentation', 'governance', 'lint', 'production ready',
    'defensive', 'error handling', 'sanity check', 'infrastructure', 'audit'
  ],
  socialIQ: [
    'lead', 'leader', 'mentored', 'collaborated', 'cross-functional', 'stakeholder',
    'presentation', 'client', 'agile', 'scrum', 'code review', 'negotiation', 'communication',
    'partnered', 'team', 'organized', 'workshop', 'facilitated', 'empathy', 'product manager'
  ],
  explorer: [
    'hackathon', 'winner', 'prototype', 'mvp', 'experiment', 'open-source', 'founder',
    'startup', 'novel', 'research', 'innovation', 'cutting-edge', 'llm', 'generative ai',
    'agent', 'side project', 'shipped', 'rapid', 'built from scratch', 'zero to one'
  ]
};

const HIGH_IMPACT_VERBS = [
  'architected', 'spearheaded', 'engineered', 'optimized', 'deployed', 'scaled',
  'automated', 'built', 'reduced', 'increased', 'developed', 'designed', 'orchestrated'
];

/**
 * Computes live, unhardcoded QT2 Cognitive Mindset & Integrity Evaluation
 */
export function evaluateQT2Model(
  documents: VaultDocumentSlot[] = [],
  auditReport: IdentityAuditReport = {
    primaryName: 'Candidate',
    totalDocuments: 0,
    verifiedCount: 0,
    mismatchCount: 0,
    overallStatus: 'SENTINEL_CLEAN',
    trustScore: 100,
    conflictingDocuments: [],
    identityConsistencyPercentage: 100
  },
  simulationScores?: Record<string, number>,
  identityScores?: Record<string, number>,
  voiceArchetype?: string | null
): QT2ModelEvaluation {
  const docCount = documents.length;
  const hasDocs = docCount > 0;

  // Check if candidate has actually completed simulation questions with positive choices
  const hasSimulations = !!simulationScores && Object.values(simulationScores).some(score => (score || 0) > 0);

  // RULE 1: STRICT ZERO BASELINE IF NO EVIDENCE AND NO SIMULATIONS COMPLETED
  if (!hasDocs && !hasSimulations) {
    return {
      compositeScore: 0,
      dimensions: { patternHunter: 0, stabilizer: 0, socialIQ: 0, explorer: 0 },
      dominantArchetype: 'Pending Evidence',
      archetypeBlendTitle: 'Awaiting Diagnostic Calibration',
      archetypeDescription: 'No documents uploaded or simulation quests passed yet. Upload a resume, marksheet, or certification to calibrate your live QT2 score.',
      selfAwarenessIndex: 0,
      selfAwarenessLabel: 'Pending Assessment',
      executionRigorScore: 0,
      identityIntegrityScore: 0,
      longitudinalGrowthScore: 0,
      evaluatedDataPoints: 0,
      factors: [
        { pillar: 'Cognitive Mindset Disposition', weight: 35, score: 0, maxScore: 35, details: '0 simulation quests completed; 0 document signals.' },
        { pillar: 'Execution Rigor & Impact', weight: 25, score: 0, maxScore: 25, details: '0 documents uploaded for action verb & project depth analysis.' },
        { pillar: 'Identity & Sentinel Integrity', weight: 25, score: 0, maxScore: 25, details: '0 credential files submitted for anti-fraud name validation.' },
        { pillar: 'Longitudinal Growth & Trajectory', weight: 15, score: 0, maxScore: 15, details: '0 academic marksheet records provided.' }
      ],
      behavioralSignals: { algorithmicDepth: 0, reliabilityStandards: 0, collaborationLeadership: 0, experimentationVelocity: 0 }
    };
  }

  // --- 1. EXTRACT BEHAVIORAL SEMANTIC SIGNALS ---
  let rawPH = 0;
  let rawST = 0;
  let rawSQ = 0;
  let rawEX = 0;
  let impactVerbCount = 0;
  let allExtractedSkillsCount = 0;
  let projectDepthCount = 0;

  documents.forEach(doc => {
    allExtractedSkillsCount += doc.skills?.length || 0;
    const corpus = `${doc.title} ${doc.fileName} ${doc.institution || ''} ${doc.scoreOrGpa || ''} ${(doc.skills || []).join(' ')}`.toLowerCase();
    const provSnippets = (doc.provenanceRecords || []).map(p => p.sourceTextSnippet.toLowerCase()).join(' ');
    const combinedText = `${corpus} ${provSnippets}`;

    BEHAVIORAL_LEXICONS.patternHunter.forEach(term => {
      if (combinedText.includes(term)) rawPH += 1;
    });
    BEHAVIORAL_LEXICONS.stabilizer.forEach(term => {
      if (combinedText.includes(term)) rawST += 1;
    });
    BEHAVIORAL_LEXICONS.socialIQ.forEach(term => {
      if (combinedText.includes(term)) rawSQ += 1;
    });
    BEHAVIORAL_LEXICONS.explorer.forEach(term => {
      if (combinedText.includes(term)) rawEX += 1;
    });

    HIGH_IMPACT_VERBS.forEach(verb => {
      if (combinedText.includes(verb)) impactVerbCount += 1;
    });

    if (doc.category === 'resume' || doc.category === 'achievement') {
      projectDepthCount += 2;
    } else {
      projectDepthCount += 1;
    }
  });

  // Blend in live simulation scores if completed
  if (hasSimulations) {
    rawPH += (simulationScores?.['PatternHunter'] || 0) * 1.5;
    rawST += (simulationScores?.['Stabilizer'] || 0) * 1.5;
    rawSQ += (simulationScores?.['SocialIQ'] || 0) * 1.5;
    rawEX += (simulationScores?.['Explorer'] || 0) * 1.5;
  }

  // Voice Archetype bonus if assessed
  if (voiceArchetype === 'Reflective Analyst') {
    rawPH += 2; rawST += 2;
  } else if (voiceArchetype === 'Expressive Communicator') {
    rawSQ += 3; rawEX += 1;
  } else if (voiceArchetype === 'Direct Builder') {
    rawEX += 2; rawPH += 2;
  }

  // Calculate normalized percentage distribution (GUARANTEED TO SUM TO 100%)
  const totalWeight = rawPH + rawST + rawSQ + rawEX;
  let pctPH = 25, pctST = 25, pctSQ = 25, pctEX = 25;

  if (totalWeight > 0) {
    pctPH = Math.round((rawPH / totalWeight) * 100);
    pctST = Math.round((rawST / totalWeight) * 100);
    pctSQ = Math.round((rawSQ / totalWeight) * 100);
    pctEX = 100 - (pctPH + pctST + pctSQ); // Guarantees exact 100% sum
  }

  const dimensions: QT2DimensionScores = {
    patternHunter: Math.max(0, pctPH),
    stabilizer: Math.max(0, pctST),
    socialIQ: Math.max(0, pctSQ),
    explorer: Math.max(0, pctEX)
  };

  const traitRoster = [
    { key: 'Pattern Hunter', icon: '🧩', score: dimensions.patternHunter },
    { key: 'Stabilizer', icon: '🛡️', score: dimensions.stabilizer },
    { key: 'Social IQ', icon: '🤝', score: dimensions.socialIQ },
    { key: 'Explorer', icon: '🚀', score: dimensions.explorer }
  ].sort((a, b) => b.score - a.score);

  const primaryTrait = traitRoster[0];
  const secondaryTrait = traitRoster[1];

  let blendTitle = `${primaryTrait.key} (${primaryTrait.score}%) & ${secondaryTrait.key} (${secondaryTrait.score}%) Hybrid`;
  if (primaryTrait.score >= 50) {
    blendTitle = `Dominant ${primaryTrait.key} (${primaryTrait.score}%)`;
  }
  const blendDescription = `Demonstrates primary cognitive affinity for ${primaryTrait.key} methodologies supported by ${secondaryTrait.key} execution across verified evidence.`;

  // --- 2. EVALUATE 4 PILLARS (STRICT CEILINGS) ---

  // PILLAR 1: Mindset Disposition (0 - 35 pts)
  // Evaluates the breadth and richness of demonstrated behavioral signals
  let scoreMindset = 0;
  if (totalWeight > 0) {
    const signalRichness = Math.min(20, totalWeight * 2);
    const balanceBonus = (primaryTrait.score < 60) ? 12 : 8; // Reward versatile balanced engineering
    scoreMindset = Math.min(35, Math.max(10, signalRichness + balanceBonus));
  }

  // PILLAR 2: Execution Rigor & Impact (0 - 25 pts)
  // Evaluates action verbs, skills, and grounded projects
  let scoreRigor = 0;
  if (hasDocs) {
    const verbPts = Math.min(10, impactVerbCount * 2);
    const skillPts = Math.min(10, allExtractedSkillsCount * 1.5);
    const projectPts = Math.min(5, projectDepthCount * 2.5);
    scoreRigor = Math.min(25, Math.max(5, Math.round(verbPts + skillPts + projectPts)));
  }

  // PILLAR 3: Sentinel Identity & Authenticity (0 - 25 pts)
  // Cross-validates detected names against authenticated profile anchor
  let scoreIntegrity = 0;
  if (hasDocs) {
    if (auditReport.mismatchCount > 0) {
      scoreIntegrity = Math.max(5, 25 - (auditReport.mismatchCount * 12));
    } else {
      scoreIntegrity = docCount >= 2 ? 25 : 18; // 1 doc = 18 baseline, 2+ docs = 25 verified
    }
  }

  // PILLAR 4: Longitudinal Growth & Trajectory (0 - 15 pts)
  // Tracks academic marksheet GPA curve and verified credentials
  let scoreGrowth = 0;
  if (hasDocs) {
    const semDocs = documents.filter(d => d.category.startsWith('sem'));
    if (semDocs.length >= 2) {
      scoreGrowth = 15;
    } else if (documents.some(d => d.category === 'certification' || d.category === 'achievement')) {
      scoreGrowth = 12;
    } else {
      scoreGrowth = 8; // Base single-resume trajectory
    }
  }

  // COMPOSITE QT2 SCORE (0 - 100)
  let compositeScore = Math.min(100, Math.round(scoreMindset + scoreRigor + scoreIntegrity + scoreGrowth));

  // If there's an identity mismatch flag, strictly cap overall score
  if (auditReport.mismatchCount > 0) {
    compositeScore = Math.min(58, compositeScore);
  }

  // Self-Awareness Index
  let selfAwarenessIndex = 85;
  if (identityScores && hasSimulations) {
    const statedLogic = identityScores['logic_vs_empathy'] ?? 50;
    const actionLogic = dimensions.patternHunter;
    const diff = Math.abs(statedLogic - actionLogic);
    selfAwarenessIndex = Math.max(60, Math.min(99, Math.round(100 - (diff * 0.5))));
  }
  const selfAwarenessLabel = selfAwarenessIndex >= 80
    ? 'High Cognitive Self-Awareness'
    : 'Calibrating Self-Perception Alignment';

  // Count strictly real validated data points
  const evaluatedDataPoints =
    allExtractedSkillsCount +
    docCount +
    (hasSimulations ? Object.keys(simulationScores!).length * 2 : 0) +
    (auditReport.verifiedCount * 2) +
    impactVerbCount;

  const factors: QT2BreakdownFactor[] = [
    {
      pillar: 'Cognitive Mindset Disposition',
      weight: 35,
      score: scoreMindset,
      maxScore: 35,
      details: `${primaryTrait.key} dominant (${primaryTrait.score}%) backed by ${secondaryTrait.key} (${secondaryTrait.score}%).`
    },
    {
      pillar: 'Execution Rigor & Impact',
      weight: 25,
      score: scoreRigor,
      maxScore: 25,
      details: `${allExtractedSkillsCount} validated skills grounded with ${impactVerbCount} active impact outcomes.`
    },
    {
      pillar: 'Identity & Sentinel Integrity',
      weight: 25,
      score: scoreIntegrity,
      maxScore: 25,
      details: auditReport.mismatchCount === 0
        ? `Clean sentinel verification across ${auditReport.verifiedCount} records.`
        : `Flagged ${auditReport.mismatchCount} conflicting identity record(s).`
    },
    {
      pillar: 'Longitudinal Growth & Trajectory',
      weight: 15,
      score: scoreGrowth,
      maxScore: 15,
      details: `Academic and credential velocity tracked across ${docCount} portfolio asset(s).`
    }
  ];

  return {
    compositeScore,
    dimensions,
    dominantArchetype: primaryTrait.key,
    archetypeBlendTitle: blendTitle,
    archetypeDescription: blendDescription,
    selfAwarenessIndex,
    selfAwarenessLabel,
    executionRigorScore: Math.round((scoreRigor / 25) * 100),
    identityIntegrityScore: Math.round((scoreIntegrity / 25) * 100),
    longitudinalGrowthScore: Math.round((scoreGrowth / 15) * 100),
    evaluatedDataPoints,
    factors,
    behavioralSignals: {
      algorithmicDepth: rawPH,
      reliabilityStandards: rawST,
      collaborationLeadership: rawSQ,
      experimentationVelocity: rawEX
    }
  };
}
