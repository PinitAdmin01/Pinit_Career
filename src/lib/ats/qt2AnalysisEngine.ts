// src/lib/ats/qt2AnalysisEngine.ts
/**
 * ============================================================================
 * QT2 VERIFIED EXECUTION & EVIDENCE PROFILE ENGINE
 * ============================================================================
 * 
 * METHODOLOGICAL TRANSPARENCY NOTICE:
 * Document analysis evaluates DEMONSTRATED TECHNICAL FOCUS & VERIFIED EVIDENCE
 * (e.g. Systems Architecture, Quality & Reliability, Team Collaboration, 
 * Product & Prototyping) based on verified skills, projects, and academic records.
 * 
 * It is NOT an innate psychological or psychometric personality instrument.
 * Genuine psychometric evaluation requires standardized behavioral assessments;
 * document vault analysis measures verified professional artifacts and academic trajectory.
 * 
 * CORE LAWS:
 * 1. ZERO EVIDENCE = ZERO SCORE: If a user has uploaded 0 documents and answered
 *    0 diagnostic simulation quests, QT2 is strictly 0/100. Never invent numbers.
 * 2. DIMENSIONS SUM TO 100%: The 4 dimensions (Pattern Hunter, Stabilizer, Social IQ, Explorer)
 *    represent a percentage distribution and must sum to exactly 100% when data exists, or all 0% when uncalibrated.
 * 3. FACTOR SCORES NEVER EXCEED WEIGHTS: Each pillar score cannot exceed its defined max weight:
 *    - Demonstrated Execution Focus: 0 - 35 pts
 *    - Execution Rigor & Impact: 0 - 25 pts
 *    - Sentinel Identity & Authenticity: 0 - 25 pts
 *    - Longitudinal Growth & Trajectory: 0 - 15 pts
 *    - Total Max: 100 pts
 * 4. STRICT CONTENT BOUNDARIES: File names (e.g. 'latest.pdf', 'test.pdf') are NEVER
 *    scanned for behavioral signals. Only extracted document text and provenance snippets count.
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

/**
 * Strict regex patterns with word boundaries (\b) and negative lookaround assertions
 * to prevent substring false positives ('test' in 'latest', 'lead' in 'misleading', 'sql' in 'mysql').
 */
const BEHAVIORAL_PATTERNS = {
  patternHunter: [
    /\balgorithms?\b/i,
    /\boptimiz(?:ation|e|ing|ed)\b/i,
    /\bcomplexity\b/i,
    /\bdata\s+structures?\b/i,
    /\bsystem\s+architectures?\b/i,
    /\bdatabases?\b/i,
    /\bquer(?:y|ies)\b/i,
    /\blatenc(?:y|ies)\b/i,
    /\bthroughput\b/i,
    /\bdistributed\s+(?:systems?|computing|architecture|storage)?\b/i,
    /\bscalab(?:le|ility)\b/i,
    /\bconcurren(?:t|cy)\b/i,
    /\bmachine\s+learning\b|\bml\b/i,
    /\banalytics?\b/i,
    /\bbenchmark(?:s|ing)?\b/i,
    /(?:\b|\s)c\+\+(?:[\s,.]|$)/i,
    /\bpython\b/i,
    /(?<!my|postgre|p)\bsql\b/i,
    /\bpostgres(?:ql)?\b/i,
    /\bbackend\b/i,
    /\bdata\s+pipelines?\b/i,
    /\bmathematic(?:s|al)?\b/i,
    /\bmodeling\b/i,
    /\bprofiling\b/i,
    /\breduced\s+latency\b/i
  ],
  stabilizer: [
    /\b(?:unit\s+tests?|integration\s+tests?|automated\s+tests?|test\s+suites?|test\s+automation|tdd|e2e\s+testing|testing|tested)\b|\btests?\b(?![\w])/i,
    /\bunit\s+tests?\b/i,
    /\bintegration\s+tests?\b/i,
    /\bjest\b/i,
    /\bcypress\b/i,
    /\bdocker\b/i,
    /\bci\s*\/\s*cd\b/i,
    /\bkubernetes\b|\bk8s\b/i,
    /\bdevops\b/i,
    /\bsecurity\b/i,
    /\b(?:auth|authentication|authorization|oauth2?|jwt)\b/i,
    /\bcompliance\b/i,
    /\bmonitoring\b/i,
    /\breliabilit(?:y|ies)\b/i,
    /\bfault[\s\-]tolerant\b/i,
    /\brefactor(?:ing|ed|s)?\b/i,
    /\bdocumentation\b/i,
    /\bgovernance\b/i,
    /\blint(?:ing|er|ers)?\b/i,
    /\bproduction[\s\-]ready\b/i,
    /\bdefensive\b/i,
    /\berror\s+handling\b/i,
    /\bsanity\s+checks?\b/i,
    /\binfrastructure\b/i,
    /\baudit(?:s|ing|ed)?\b/i
  ],
  socialIQ: [
    /\b(?:lead|leader|leaders|leadership|led|team\s+lead)\b/i,
    /\bmentor(?:ed|ing|s)?\b/i,
    /\bcollaborat(?:ed|ing|ion|ive|es)?\b/i,
    /\bcross[\s\-]functional\b/i,
    /\bstakeholders?\b/i,
    /\bpresentations?\b/i,
    /\bclients?\b/i,
    /\bagile\b/i,
    /\bscrum\b/i,
    /\bcode\s+reviews?\b/i,
    /\bnegotiat(?:ion|ing|ed)?\b/i,
    /\bcommunication\b/i,
    /\bpartnered\b/i,
    /\bteams?\b/i,
    /\borganiz(?:ed|ing|ation)\b/i,
    /\bworkshops?\b/i,
    /\bfacilitat(?:ed|ing|or)?\b/i,
    /\bempath(?:y|etic)\b/i,
    /\bproduct\s+managers?\b|\bpm\b/i
  ],
  explorer: [
    /\bhackathons?\b/i,
    /\bwinners?\b/i,
    /\bprototypes?\b/i,
    /\bmvp\b/i,
    /\bexperiment(?:s|al|ing|ed)?\b/i,
    /\bopen[\s\-]source\b/i,
    /\bfounders?\b/i,
    /\bstartups?\b/i,
    /\bnovel\b/i,
    /\bresearch(?:er|ing)?\b/i,
    /\binnovat(?:ion|ive|or)?\b/i,
    /\bcutting[\s\-]edge\b/i,
    /\bllms?\b/i,
    /\bgenerative\s+ai\b|\bgenai\b/i,
    /\bagents?\b/i,
    /\bside\s+projects?\b/i,
    /\bshipped\b/i,
    /\brapid(?:ly)?\b/i,
    /\bbuilt\s+from\s+scratch\b/i,
    /\bzero\s+to\s+one\b/i
  ]
};

const HIGH_IMPACT_VERBS = [
  /\barchitected\b/i, /\bspearheaded\b/i, /\bengineered\b/i, /\boptimized\b/i,
  /\bdeployed\b/i, /\bscaled\b/i, /\bautomated\b/i, /\bbuilt\b/i, /\breduced\b/i,
  /\bincreased\b/i, /\bdeveloped\b/i, /\bdesigned\b/i, /\borchestrated\b/i
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
        { pillar: 'Demonstrated Execution Focus', weight: 35, score: 0, maxScore: 35, details: '0 simulation quests completed; 0 document signals.' },
        { pillar: 'Execution Rigor & Impact', weight: 25, score: 0, maxScore: 25, details: '0 readable documents uploaded for action verb & project depth analysis.' },
        { pillar: 'Identity & Sentinel Integrity', weight: 25, score: 0, maxScore: 25, details: '0 verified credential files submitted for anti-fraud name validation.' },
        { pillar: 'Longitudinal Growth & Trajectory', weight: 15, score: 0, maxScore: 15, details: '0 academic marksheet records provided.' }
      ],
      behavioralSignals: { algorithmicDepth: 0, reliabilityStandards: 0, collaborationLeadership: 0, experimentationVelocity: 0 }
    };
  }

  // --- 1. EXTRACT DEMONSTRATED TECHNICAL & EXECUTION SIGNALS ---
  let rawPH = 0;
  let rawST = 0;
  let rawSQ = 0;
  let rawEX = 0;
  let impactVerbCount = 0;
  let allExtractedSkillsCount = 0;
  let projectDepthCount = 0;

  readableDocs.forEach(doc => {
    allExtractedSkillsCount += doc.skills?.length || 0;

    // CRITICAL: NEVER include doc.fileName! File names are not student skills or behavioral evidence.
    const contentParts: string[] = [];
    if (doc.title && !['resume', 'document', 'marksheet', 'certificate', 'file'].includes(doc.title.toLowerCase().trim())) {
      contentParts.push(doc.title);
    }
    if (doc.institution) {
      contentParts.push(doc.institution);
    }
    if (Array.isArray(doc.skills) && doc.skills.length > 0) {
      contentParts.push(doc.skills.join(' '));
    }
    if (Array.isArray(doc.provenanceRecords)) {
      doc.provenanceRecords.forEach(p => {
        if (p.sourceTextSnippet) contentParts.push(p.sourceTextSnippet);
        if ((p as any).field === 'Project' || (p as any).field === 'PROJECT' || p.sourceSection === 'PROJECTS' || (p as any).entityType === 'PROJECT') {
          projectDepthCount += 1;
        }
      });
    }
    const combinedText = contentParts.join(' ').toLowerCase();

    // Match distinct indicators using word-boundary regexes
    BEHAVIORAL_PATTERNS.patternHunter.forEach(regex => {
      if (regex.test(combinedText)) rawPH += 1;
    });
    BEHAVIORAL_PATTERNS.stabilizer.forEach(regex => {
      if (regex.test(combinedText)) rawST += 1;
    });
    BEHAVIORAL_PATTERNS.socialIQ.forEach(regex => {
      if (regex.test(combinedText)) rawSQ += 1;
    });
    BEHAVIORAL_PATTERNS.explorer.forEach(regex => {
      if (regex.test(combinedText)) rawEX += 1;
    });

    HIGH_IMPACT_VERBS.forEach(regex => {
      if (regex.test(combinedText)) impactVerbCount += 1;
    });
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
  const blendDescription = `Demonstrates primary demonstrated execution focus on ${primaryTrait.key} supported by ${secondaryTrait.key} capabilities across verified evidence.`;

  // --- 2. EVALUATE 4 PILLARS (STRICT CEILINGS & REAL EVIDENCE GROUNDING) ---

  // PILLAR 1: Demonstrated Execution Focus (0 - 35 pts)
  // No artificial floor! Score scales proportionally with verified evidence density and simulation completion.
  let scoreMindset = 0;
  if (totalWeight > 0) {
    const signalRichness = Math.min(20, totalWeight * 2);
    const simBonus = hasSimulations ? Math.min(10, Object.keys(simulationScores || {}).length * 2.5) : 0;
    const balanceBonus = totalWeight >= 4 ? ((primaryTrait.score < 60) ? 5 : 3) : 0;
    scoreMindset = Math.min(35, Math.round(signalRichness + simBonus + balanceBonus));
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
  // Replaces flat 25/25 with verification-level based integrity:
  // Requires institutional credentials (STRUCTURALLY_VALIDATED, THIRD_PARTY_VERIFIED, CROSS_VALIDATED) for full points.
  let scoreIntegrity = 0;
  if (hasRealDocs) {
    if (auditReport.mismatchCount > 0) {
      scoreIntegrity = Math.max(0, 25 - (auditReport.mismatchCount * 12));
    } else {
      const hasInstitutional = readableDocs.some(d =>
        d.verificationLevel === 'STRUCTURALLY_VALIDATED' ||
        d.verificationLevel === 'THIRD_PARTY_VERIFIED' ||
        d.verificationLevel === 'CROSS_VALIDATED' ||
        d.verificationLevel === 'INSTITUTION_VERIFIED'
      );
      if (readableDocs.length >= 2 && hasInstitutional) {
        scoreIntegrity = 25;
      } else if (readableDocs.length >= 2) {
        scoreIntegrity = 14; // Provisional baseline for multiple self-submitted unverified documents
      } else {
        scoreIntegrity = hasInstitutional ? 15 : 10;
      }
    }
  }

  // PILLAR 4: Longitudinal Growth & Trajectory (0 - 15 pts)
  // Calculates REAL GPA DELTA across chronological semester marksheets.
  let scoreGrowth = 0;
  let growthDetails = '0 academic marksheet records provided.';

  if (hasRealDocs) {
    const semRecords: { semNum: number; gpa: number; category: string }[] = [];

    readableDocs.forEach(d => {
      const isSem = d.category.startsWith('sem') || /semester\s*(\d+)/i.test(d.title);
      if (isSem && d.scoreOrGpa) {
        const gpaMatch = d.scoreOrGpa.match(/(\d+(?:\.\d+)?)/);
        if (gpaMatch) {
          const num = parseFloat(gpaMatch[1]);
          if (!isNaN(num) && num > 0 && num <= 10.0) {
            const semNumMatch = d.category.match(/sem(\d+)/i) || d.title.match(/semester\s*(\d+)/i);
            const semNum = semNumMatch ? parseInt(semNumMatch[1], 10) : semRecords.length + 1;
            semRecords.push({ semNum, gpa: num, category: d.category });
          }
        }
      }
    });

    semRecords.sort((a, b) => a.semNum - b.semNum);

    if (semRecords.length >= 2) {
      const earliest = semRecords[0].gpa;
      const latest = semRecords[semRecords.length - 1].gpa;
      const delta = Math.round((latest - earliest) * 100) / 100;

      if (delta >= 0.3) {
        // Significant upward academic trajectory
        scoreGrowth = Math.min(15, 12 + Math.round(delta * 2));
        growthDetails = `Upward academic trajectory verified (+${delta.toFixed(2)} GPA delta across ${semRecords.length} semesters).`;
      } else if (delta >= -0.2 && latest >= 8.5) {
        // Sustained high academic excellence
        scoreGrowth = 14;
        growthDetails = `Sustained academic excellence verified (${latest.toFixed(2)} GPA across ${semRecords.length} semesters).`;
      } else if (delta >= -0.3) {
        // Stable academic performance
        scoreGrowth = 9;
        growthDetails = `Stable academic trajectory verified (${delta >= 0 ? '+' : ''}${delta.toFixed(2)} GPA delta across ${semRecords.length} semesters).`;
      } else {
        // Academic decline (e.g. 9.20 -> 6.10: delta = -3.10)
        scoreGrowth = Math.max(2, Math.min(5, 5 + Math.round(delta)));
        growthDetails = `Academic trajectory shows significant decline (${delta.toFixed(2)} GPA delta from Sem ${semRecords[0].semNum} to Sem ${semRecords[semRecords.length - 1].semNum}).`;
      }
    } else if (semRecords.length === 1) {
      scoreGrowth = semRecords[0].gpa >= 8.0 ? 7 : 5;
      growthDetails = `1 academic semester record verified (${semRecords[0].gpa.toFixed(2)} GPA). Upload additional semesters for trajectory analysis.`;
    } else if (readableDocs.some(d => d.category === 'certification' || d.category === 'achievement')) {
      scoreGrowth = 8;
      growthDetails = 'Verified professional certification / upskilling credentials grounded.';
    } else if (readableDocs.some(d => d.category === 'resume')) {
      scoreGrowth = 3;
      growthDetails = 'Single resume provided; upload academic marksheets for longitudinal trajectory analysis.';
    }
  }

  // COMPOSITE QT2 SCORE (0 - 100)
  let compositeScore = Math.min(100, Math.round(scoreMindset + scoreRigor + scoreIntegrity + scoreGrowth));

  if (auditReport.mismatchCount > 0) {
    compositeScore = Math.min(58, compositeScore);
  }

  // Self-Awareness Index: Requires actual simulation assessments, with real divergence math and no artificial 50% floor
  let selfAwarenessIndex = 0;
  let selfAwarenessLabel = 'Pending Assessment';

  if (hasSimulations && identityScores) {
    const statedLogic = identityScores['logic_vs_empathy'] ?? 50;
    const simPatternHunter = simulationScores?.['PatternHunter'] || 0;
    const simTotal = (simulationScores?.['PatternHunter'] || 0) + (simulationScores?.['SocialIQ'] || 0) || 1;
    const actionLogic = Math.round((simPatternHunter / simTotal) * 100);
    const diff = Math.abs(statedLogic - actionLogic);
    selfAwarenessIndex = Math.max(10, Math.min(99, Math.round(100 - (diff * 0.8))));
    if (selfAwarenessIndex >= 80) {
      selfAwarenessLabel = 'High Cognitive Self-Awareness (Realistic Self-Perception)';
    } else if (selfAwarenessIndex >= 50) {
      selfAwarenessLabel = 'Calibrating Self-Perception Alignment';
    } else {
      selfAwarenessLabel = 'Divergence Detected (Aspiration vs Action Divergence)';
    }
  } else if (hasSimulations) {
    selfAwarenessIndex = 60;
    selfAwarenessLabel = 'Simulation Quests Completed (Awaiting Preference Survey)';
  }

  // Count strictly real validated data points
  const evaluatedDataPoints =
    allExtractedSkillsCount +
    docCount +
    (hasSimulations ? Object.keys(simulationScores!).length * 2 : 0) +
    (auditReport.verifiedCount * 2) +
    impactVerbCount +
    projectDepthCount;

  const factors: QT2BreakdownFactor[] = [
    {
      pillar: 'Demonstrated Execution Focus',
      weight: 35,
      score: scoreMindset,
      maxScore: 35,
      details: `${totalWeight} validated signals (${rawPH} Systems, ${rawST} Reliability, ${rawSQ} Leadership, ${rawEX} Innovation).`
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
      details: growthDetails
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
