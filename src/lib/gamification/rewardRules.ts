/**
 * PinIT Career OS - Canonical Gamification & Progression Rulebook (Task 13)
 *
 * Single source of truth for all XP, Pins, and Elo rewards across curriculum lessons,
 * exams, capstone projects, AI interviews, and 1v1 PvP Code Wars.
 */

export interface RewardRule {
  type: string;
  title: string;
  xp: number;
  pins: number;
  description: string;
}

export const REWARD_RULES = {
  // ── Curriculum & Lessons ───────────────────────────────────────────────
  LESSON_STANDARD: {
    type: 'lesson_standard',
    title: 'Standard Daily Lesson',
    xp: 100,
    pins: 0,
    description: 'Awarded upon completing all 5 pedagogical parts and Socratic checks of a daily lesson.',
  },
  LESSON_EXAM_MILESTONE: {
    type: 'lesson_exam_milestone',
    title: 'Milestone Assessment Exam',
    xp: 200,
    pins: 0,
    description: 'Awarded upon passing a 5-day milestone proctored test with >= 70% accuracy.',
  },
  LESSON_CAPSTONE_PROJECT: {
    type: 'lesson_capstone_project',
    title: 'Month Capstone / Graduation Project',
    xp: 500,
    pins: 0,
    description: 'Awarded upon completing and submitting a 30-day or 60-day enterprise capstone project.',
  },

  // ── Daily Engagement ──────────────────────────────────────────────────
  DAILY_MISSION: {
    type: 'daily_mission',
    title: 'Daily Career Mission',
    xp: 50,
    pins: 0,
    description: 'Awarded for completing the daily AI career prompt or skill diagnostic.',
  },
  STREAK_7_DAY_BONUS: {
    type: 'streak_7_day_bonus',
    title: '7-Day Streak Milestone',
    xp: 150,
    pins: 25,
    description: 'Awarded every 7 consecutive days of active learning.',
  },

  // ── PvP Code Wars & 1v1 Arena ──────────────────────────────────────────
  ARENA_WIN: {
    type: 'arena_win',
    title: '1v1 Code War Victory',
    xp: 50,
    pins: 0,
    eloMin: 12,
    eloMax: 32,
    description: 'Awarded to the winner of a 1v1 algorithmic PvP match. Elo gained scales with opponent rating.',
  },
  ARENA_LOSS: {
    type: 'arena_loss',
    title: '1v1 Code War Match Effort',
    xp: 15,
    pins: 0,
    eloMin: -24,
    eloMax: -8,
    description: 'Effort award for completing tests in a PvP duel despite defeat. Elo floored at 1000.',
  },
  ARENA_DRAW: {
    type: 'arena_draw',
    title: '1v1 Code War Draw',
    xp: 25,
    pins: 0,
    eloDelta: 0,
    description: 'Awarded when combatants tie in points or both submit equal solutions before timer expires.',
  },

  // ── AI Drills & Audits ─────────────────────────────────────────────────
  AI_INTERVIEW_PASS: {
    type: 'ai_interview_pass',
    title: 'AI Mock Interview Pass',
    xp: 150,
    pins: 0,
    description: 'Awarded upon scoring >= 70% in an AI technical or behavioral interview drill.',
  },
  AI_GD_PASS: {
    type: 'ai_gd_pass',
    title: 'Group Discussion Performance',
    xp: 100,
    pins: 0,
    description: 'Awarded upon contributing constructive, validated points in an AI Group Discussion.',
  },
  GITHUB_PROJECT_AUTHORED: {
    type: 'github_project_authored',
    title: 'Original GitHub Project Ingestion',
    xp: 1000,
    pins: 0,
    description: 'Awarded for verified original authored repositories passing the >= 80% audit bar.',
  },
  GITHUB_PROJECT_REFERENCE: {
    type: 'github_project_reference',
    title: 'Reference Repository Audit',
    xp: 250,
    pins: 0,
    description: 'Awarded for analyzing and verifying architecture on a reference codebase.',
  },
} as const;

// ── Rating & Tier Boundaries ─────────────────────────────────────────────
export const ELO_TIERS = [
  { min: 500, max: Infinity, tier: 'Grandmaster Apex', badge: '👑', color: '#f59e0b', kFactor: 16 },
  { min: 400, max: 499,      tier: 'Diamond Apex',     badge: '💎', color: '#06b6d4', kFactor: 20 },
  { min: 280, max: 399,      tier: 'Platinum Vanguard',badge: '🛡️', color: '#8b5cf6', kFactor: 24 },
  { min: 200, max: 279,      tier: 'Gold Architect',   badge: '⚔️', color: '#eab308', kFactor: 28 },
  { min: 140, max: 199,      tier: 'Silver Tactician', badge: '⚡', color: '#94a3b8', kFactor: 32 },
  { min: 100, max: 139,      tier: 'Bronze Cadet',     badge: '🔰', color: '#b45309', kFactor: 32 },
] as const;

export function getEloTier(rating: number) {
  const r = Math.max(100, Number(rating) || 100);
  for (const t of ELO_TIERS) {
    if (r >= t.min) return t;
  }
  return ELO_TIERS[ELO_TIERS.length - 1]; // Bronze Cadet fallback
}

/**
 * Calculates prospective Elo stakes between two players before a duel.
 * Tells players upfront: "If you win: +X Elo | If you lose: -Y Elo".
 */
export function calculateStakesPreview(myRating: number, opponentRating: number) {
  const myR = Math.max(100, Number(myRating) || 100);
  const oppR = Math.max(100, Number(opponentRating) || 100);

  const myExpected = 1 / (1 + Math.pow(10, (oppR - myR) / 400));
  const myTier = getEloTier(myR);

  // If I win (Actual = 1)
  const winDelta = Math.round(myTier.kFactor * (1 - myExpected));
  // If I lose (Actual = 0)
  const lossDelta = Math.round(myTier.kFactor * (0 - myExpected));

  return {
    myRating: myR,
    opponentRating: oppR,
    expectedWinChance: Math.round(myExpected * 100),
    potentialWin: Math.max(4, winDelta),
    potentialLoss: Math.min(-4, lossDelta),
    potentialWinXp: REWARD_RULES.ARENA_WIN.xp,
    potentialLossXp: REWARD_RULES.ARENA_LOSS.xp,
  };
}

// ── Level & XP Progression ───────────────────────────────────────────────
export const LEVEL_THRESHOLDS = [
  { level: 1,  minXp: 0,      title: 'Cadet Engineer',           icon: '🌱' },
  { level: 2,  minXp: 1000,   title: 'Junior Software Engineer', icon: '⚡' },
  { level: 3,  minXp: 2500,   title: 'Full Stack Developer',     icon: '🚀' },
  { level: 4,  minXp: 5000,   title: 'Senior Systems Engineer',  icon: '🛡️' },
  { level: 5,  minXp: 10000,  title: 'Lead Architect',           icon: '👑' },
  { level: 6,  minXp: 20000,  title: 'Principal Fellow',         icon: '🔮' },
] as const;

export function getPlayerLevel(xp: number) {
  const currentXp = Math.max(0, Number(xp) || 0);
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (currentXp >= LEVEL_THRESHOLDS[i].minXp) {
      const current = LEVEL_THRESHOLDS[i];
      const next = LEVEL_THRESHOLDS[i + 1];
      const progressInLevel = next ? currentXp - current.minXp : 1000;
      const levelSpan = next ? next.minXp - current.minXp : 1000;
      const progressPercent = next ? Math.min(100, Math.round((progressInLevel / levelSpan) * 100)) : 100;

      return {
        ...current,
        nextLevelXp: next ? next.minXp : current.minXp,
        progressPercent,
      };
    }
  }
  return { ...LEVEL_THRESHOLDS[0], nextLevelXp: 1000, progressPercent: 0 };
}
