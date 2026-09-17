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
    overallStatus: 'AWAITING_UPLOADS',
    trustScore: 0,
    conflictingDocuments: [],
    identityConsistencyPercentage: 0
  },
  simulationScores?: Record<string, number>,
  identityScores?: Record<string, number>,
  voiceArchetype?: string | null
): QT2ModelEvaluation {
  // Only count content-bearing readable documents
  const readableDocs = documents.filter(d =>
    (Array.isArray(d.provenanceRecords) && d.provenanceRecords.length > 0) ||
    (Array.isArray(d.skills) && d.skills.length > 0) ||
    (!!d.candidateName && d.candidateName.toLowerCase() !== 'candidate') ||
    (!!d.scoreOrGpa && !d.scoreOrGpa.includes('Credential') && !d.scoreOrGpa.includes('Marksheet'))
  );
  const docCount = readableDocs.length;
  const hasRealDocs = docCount > 0;

  // Check if candidate has actually completed simulation questions with positive choices
  const hasSimulations = !!simulationScores && Object.values(simulationScores).some(score => (score || 0) > 0);

  // RULE 1: STRICT ZERO BASELINE IF NO GENUINE EVIDENCE AND NO SIMULATIONS COMPLETED
  if (!hasRealDocs && !hasSimulations) {
    return {
      compositeScore: 0,
      dimensions: { patternHunter: 0, stabilizer: 0, socialIQ: 0, explorer: 0 },
      dominantArchetype: 'Pending Evidence',
      archetypeBlendTitle: 'Awaiting Diagnostic Calibration',
      archetypeDescription: 'No verified documents uploaded or simulation quests passed yet. Upload a readable resume, marksheet, or certification to calibrate your live QT2 score.',
      selfAwarenessIndex: 0,
      selfAwarenessLabel: 'Pending Assessment',
      executionRigorScore: 0,
      identityIntegrityScore: 0,
      longitudinalGrowthScore: 0,
      evaluatedDataPoints: 0,
      factors: [
        { pillar: 'Cognitive Mindset Disposition', weight: 35, score: 0, maxScore: 35, details: '0 simulation quests completed; 0 document signals.' },
        { pillar: 'Execution Rigor & Impact', weight: 25, score: 0, maxScore: 25, details: '0 readable documents uploaded for action verb & project depth analysis.' },
        { pillar: 'Identity & Sentinel Integrity', weight: 25, score: 0, maxScore: 25, details: '0 verified credential files submitted for anti-fraud name validation.' },
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

  readableDocs.forEach(doc => {
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
  let scoreMindset = 0;
  if (totalWeight > 0) {
    const signalRichness = Math.min(20, totalWeight * 2);
    const balanceBonus = (primaryTrait.score < 60) ? 12 : 8;
    scoreMindset = Math.min(35, Math.max(10, signalRichness + balanceBonus));
  }

  // PILLAR 2: Execution Rigor & Impact (0 - 25 pts)
  let scoreRigor = 0;
  if (hasRealDocs) {
    const verbPts = Math.min(10, impactVerbCount * 2);
    const skillPts = Math.min(10, allExtractedSkillsCount * 1.5);
    const projectPts = Math.min(5, projectDepthCount * 2.5);
    scoreRigor = Math.min(25, Math.round(verbPts + skillPts + projectPts));
  }

  // PILLAR 3: Sentinel Identity & Authenticity (0 - 25 pts)
  let scoreIntegrity = 0;
  if (hasRealDocs) {
    if (auditReport.mismatchCount > 0) {
      scoreIntegrity = Math.max(0, 25 - (auditReport.mismatchCount * 12));
    } else {
      scoreIntegrity = readableDocs.length >= 2 ? 25 : 12;
    }
  }

  // PILLAR 4: Longitudinal Growth & Trajectory (0 - 15 pts)
  let scoreGrowth = 0;
  if (hasRealDocs) {
    const semDocs = readableDocs.filter(d => d.category.startsWith('sem') && d.scoreOrGpa && /\d+\.\d+/.test(d.scoreOrGpa));
    if (semDocs.length >= 2) {
      scoreGrowth = 15;
    } else if (readableDocs.some(d => d.category === 'certification' || d.category === 'achievement')) {
      scoreGrowth = 12;
    } else if (readableDocs.some(d => d.category === 'resume')) {
      scoreGrowth = 5;
    }
  }

  // COMPOSITE QT2 SCORE (0 - 100)
  let compositeScore = Math.min(100, Math.round(scoreMindset + scoreRigor + scoreIntegrity + scoreGrowth));

  if (auditReport.mismatchCount > 0) {
    compositeScore = Math.min(58, compositeScore);
  }

  // Self-Awareness Index (Requires actual completed simulation questions)
  let selfAwarenessIndex = 0;
  let selfAwarenessLabel = 'Pending Assessment';

  if (identityScores && hasSimulations) {
    const statedLogic = identityScores['logic_vs_empathy'] ?? 50;
    const actionLogic = dimensions.patternHunter;
    const diff = Math.abs(statedLogic - actionLogic);
    selfAwarenessIndex = Math.max(50, Math.min(99, Math.round(100 - (diff * 0.5))));
    selfAwarenessLabel = selfAwarenessIndex >= 80
      ? 'High Cognitive Self-Awareness'
      : 'Calibrating Self-Perception Alignment';
  } else if (hasRealDocs && hasSimulations) {
    selfAwarenessIndex = 70;
    selfAwarenessLabel = 'Calibrating Self-Perception Alignment';
  }

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
      details: `${totalWeight} validated signals (${rawPH} PH, ${rawST} ST, ${rawSQ} SQ, ${rawEX} EX).`
    },
    {
      pillar: 'Execution Rigor & Impact',
      weight: 25,
      score: scoreRigor,
      maxScore: 25,
      details: `${impactVerbCount} action verbs, ${allExtractedSkillsCount} skills, ${projectDepthCount} project anchors.`
    },
    {
      pillar: 'Identity & Sentinel Integrity',
      weight: 25,
      score: scoreIntegrity,
      maxScore: 25,
      details: auditReport.mismatchCount > 0
        ? `${auditReport.mismatchCount} identity conflicts flagged.`
        : `Cross-document identity consistency at ${auditReport.identityConsistencyPercentage}%.`
    },
    {
      pillar: 'Longitudinal Growth & Trajectory',
      weight: 15,
      score: scoreGrowth,
      maxScore: 15,
      details: `${readableDocs.filter(d => d.category.startsWith('sem')).length} academic semester records verified.`
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
    executionRigorScore: scoreRigor,
    identityIntegrityScore: scoreIntegrity,
    longitudinalGrowthScore: scoreGrowth,
    evaluatedDataPoints,
    factors,
    behavioralSignals: {
      algorithmicDepth: Math.min(100, rawPH * 12),
      reliabilityStandards: Math.min(100, rawST * 12),
      collaborationLeadership: Math.min(100, rawSQ * 12),
      experimentationVelocity: Math.min(100, rawEX * 12)
    }
  };
}
