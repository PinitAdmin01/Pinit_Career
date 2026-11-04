/**
 * Authoritative Student Knowledge & Skill Calibration Engine (Task 14)
 *
 * Calculates a student's Knowledge Score (0 - 100) and assigns an appropriate
 * competitive problem tier so learners are never given problems far beyond their
 * learned concepts.
 */

export type KnowledgeTier = 'novice' | 'apprentice' | 'master';

export interface StudentKnowledgeProfile {
  xpTotal?: number;
  arenaElo?: number;
  completedQuests?: string[];
  careerDnaScore?: number;
  atsScore?: number;
  missionsCompleted?: number;
}

export interface CalculatedKnowledge {
  score: number;             // 0 to 100
  tier: KnowledgeTier;       // 'novice' | 'apprentice' | 'master'
  tierLabel: string;         // 'Novice (Arrays & Loops)' | 'Apprentice (Data Structures)' | 'Master (Systems & Algorithms)'
  questMasteryScore: number; // 0 to 35
  eloMasteryScore: number;   // 0 to 30
  diagnosticScore: number;   // 0 to 20
  consistencyScore: number;  // 0 to 15
  recommendedDifficulty: 'basic' | 'intermediate' | 'advanced';
}

/**
 * Calculates a deterministic Knowledge Score based on 4 empirical vectors:
 * 1. Quest Mastery (35%): Number and complexity of completed curriculum quests
 * 2. Elo Calibration (30%): Tactical battle rating normalized between 1000 and 1800
 * 3. Diagnostic Benchmark (20%): Career DNA / ATS assessment results
 * 4. Practice Consistency (15%): Completed missions and active streak volume
 */
export function calculateStudentKnowledge(profile?: StudentKnowledgeProfile | null): CalculatedKnowledge {
  if (!profile) {
    return {
      score: 15,
      tier: 'novice',
      tierLabel: 'Novice (Arrays, Logic & Loops)',
      questMasteryScore: 5,
      eloMasteryScore: 6,
      diagnosticScore: 2,
      consistencyScore: 2,
      recommendedDifficulty: 'basic',
    };
  }

  // 1. Quest Mastery (0 to 35 points)
  // Higher weight for milestone exams and advanced days
  const completed = profile.completedQuests || [];
  let questPoints = 0;
  for (const qId of completed) {
    const qLower = qId.toLowerCase();
    if (qLower.includes('exam') || qLower.includes('capstone') || qLower.includes('milestone')) {
      questPoints += 3;
    } else if (qLower.includes('d2') || qLower.includes('d3') || qLower.includes('d4') || qLower.includes('d5') || qLower.includes('d6')) {
      questPoints += 2; // Month 2+ days
    } else {
      questPoints += 1;
    }
  }
  const questMasteryScore = Math.min(35, Math.round((questPoints / 40) * 35));

  // 2. Elo Calibration (0 to 30 points)
  // 1000 Elo = 0 pts, 1200 Elo = 10 pts, 1400 Elo = 18 pts, 1800+ Elo = 30 pts
  const elo = Math.max(1000, Number(profile.arenaElo) || 1200);
  const eloNormalized = Math.min(1, Math.max(0, (elo - 1000) / 800));
  const eloMasteryScore = Math.round(eloNormalized * 30);

  // 3. Diagnostic Benchmark (0 to 20 points)
  const dna = Math.max(0, Math.min(100, Number(profile.careerDnaScore) || Number(profile.atsScore) || 50));
  const diagnosticScore = Math.round((dna / 100) * 20);

  // 4. Practice Consistency (0 to 15 points)
  const missions = Math.max(0, Number(profile.missionsCompleted) || 0);
  const xp = Math.max(0, Number(profile.xpTotal) || 0);
  const consistencyScore = Math.min(15, Math.round((missions * 1.5) + (xp / 1000)));

  // Total Score (0 to 100)
  const totalScore = Math.min(100, Math.max(0, questMasteryScore + eloMasteryScore + diagnosticScore + consistencyScore));

  let tier: KnowledgeTier = 'novice';
  let tierLabel = 'Novice (Arrays, Logic & Loops)';
  let recommendedDifficulty: 'basic' | 'intermediate' | 'advanced' = 'basic';

  if (totalScore >= 66) {
    tier = 'master';
    tierLabel = 'Master (Systems, Trees & Concurrency)';
    recommendedDifficulty = 'advanced';
  } else if (totalScore >= 31) {
    tier = 'apprentice';
    tierLabel = 'Apprentice (Data Structures & HashMaps)';
    recommendedDifficulty = 'intermediate';
  }

  return {
    score: totalScore,
    tier,
    tierLabel,
    questMasteryScore,
    eloMasteryScore,
    diagnosticScore,
    consistencyScore,
    recommendedDifficulty,
  };
}

/**
 * Given two combatants, determines the optimal calibrated problem difficulty
 * ensuring neither player is overwhelmed by concepts they have not yet learned.
 */
export function resolveMatchmakingDifficulty(
  player1Knowledge: CalculatedKnowledge,
  player2Knowledge: CalculatedKnowledge,
  preferredDifficulty?: string
): 'basic' | 'intermediate' | 'advanced' {
  if (preferredDifficulty && preferredDifficulty !== 'any') {
    if (preferredDifficulty === 'basic' || preferredDifficulty === 'intermediate' || preferredDifficulty === 'advanced') {
      return preferredDifficulty;
    }
  }

  // If either player is Novice, cap difficulty at basic/intermediate
  if (player1Knowledge.tier === 'novice' || player2Knowledge.tier === 'novice') {
    return (player1Knowledge.tier === 'novice' && player2Knowledge.tier === 'novice')
      ? 'basic'
      : 'intermediate';
  }

  // If both players are Master, grant advanced
  if (player1Knowledge.tier === 'master' && player2Knowledge.tier === 'master') {
    return 'advanced';
  }

  return 'intermediate';
}
