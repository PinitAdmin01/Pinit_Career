/**
 * PinIT Language Archetype Fuser
 * 
 * Consumes student's Career DNA weights (Pattern Hunter, Explorer, Social IQ, Stabilizer)
 * to tailor practice styles and activity emphasis without creating duplicate courses.
 */

export interface ArchetypeWeights {
  patternHunter: number; // e.g. 40
  explorer: number;      // e.g. 20
  socialIQ: number;      // e.g. 30
  stabilizer: number;    // e.g. 10
}

export interface PracticeStyleEmphasis {
  primaryArchetype: string;
  patternAnalysisEmphasis: boolean;
  roleplayScenarioEmphasis: boolean;
  socialDialogueEmphasis: boolean;
  spacedRecallEmphasis: boolean;
  customHintPrefix: string;
}

export function calculatePracticeStyle(weights: ArchetypeWeights): PracticeStyleEmphasis {
  const { patternHunter, explorer, socialIQ, stabilizer } = weights;

  // Identify dominant archetype
  const scores = [
    { name: 'Pattern Hunter', weight: patternHunter },
    { name: 'Explorer', weight: explorer },
    { name: 'Social IQ', weight: socialIQ },
    { name: 'Stabilizer', weight: stabilizer }
  ];

  scores.sort((a, b) => b.weight - a.weight);
  const primary = scores[0].name;

  return {
    primaryArchetype: primary,
    patternAnalysisEmphasis: patternHunter >= 25,
    roleplayScenarioEmphasis: explorer >= 25,
    socialDialogueEmphasis: socialIQ >= 25,
    spacedRecallEmphasis: stabilizer >= 25,
    customHintPrefix:
      primary === 'Pattern Hunter' ? '🔍 Pattern Analysis Hint' :
      primary === 'Explorer' ? '🧭 Real-World Explorer Hint' :
      primary === 'Social IQ' ? '💬 Communication Dialogue Hint' :
      '⚙️ Structured Recall Hint'
  };
}
