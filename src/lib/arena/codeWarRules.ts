/**
 * Authoritative Code War Arena Competitive Rules Engine
 * 
 * Defines standard battle mechanics, anti-spam execution rate limiting,
 * battle scoring curves, deterministic tie-breakers, and combat events.
 */

export const ARENA_RULES_CONFIG = {
  // Cooldown & Rate Limiting
  RUN_COOLDOWN_MS: 3000,               // 3-second tactical cooldown between test runs
  RATE_LIMIT_VIOLATION_PENALTY_MS: 1500,// Additional lock if spamming before cooldown ends

  // Time & Pacing
  DEFAULT_TIME_LIMIT_SECONDS: 600,     // 10 minutes default
  PRESSURE_SURGE_THRESHOLD_SECONDS: 90,// Final 90 seconds triggers high-intensity Surge Mode
  SURGE_CLUTCH_BONUS_MULTIPLIER: 1.15, // 15% bonus on points earned during Surge

  // First Blood & Speed
  FIRST_BLOOD_BONUS_XP: 25,            // Bonus XP for the first combatant to pass all tests
  FIRST_BLOOD_BONUS_ELO: 5,            // Bonus Elo for first blood
  SPEED_SCORE_WEIGHT: 200,             // Maximum points attributable to remaining time (out of 1000)

  // Clean Execution vs Submission Penalties
  CLEAN_SUBMISSION_BONUS_XP: 15,       // Awarded if combatant passes all tests on first submission attempt
  CLEAN_CODE_SCORE_BONUS: 100,         // Points in battle score for 0 failed submissions
  FAILED_SUBMISSION_PENALTY_SCORE: 30, // Score deduction per failed final submission attempt
  MAX_SCORE: 1000,
  TEST_SCORE_WEIGHT: 700,              // 70% of score is based on passing test cases
};

export interface BattleScoreBreakdown {
  testsPassed: number;
  totalTests: number;
  testScore: number;
  timeRemainingSeconds: number;
  timeScore: number;
  cleanBonus: number;
  penalties: number;
  totalScore: number;
  isSurgeActive: boolean;
  accuracyPct: number;
}

export interface CombatantBattleStats {
  testsPassed: number;
  totalTests: number;
  score: number;
  submitted: boolean;
  submissionAttempts: number;
  failedAttempts: number;
  timeSpentSeconds: number;
  timeRemainingSeconds: number;
}

export interface CombatEvent {
  id: string;
  type: 'test_passed' | 'test_failed' | 'streak' | 'first_blood' | 'surge' | 'peer_submitted' | 'rule_penalty' | 'peer_joined';
  actorName: string;
  actorId: string;
  title: string;
  description: string;
  timestamp: number;
  severity: 'info' | 'success' | 'warning' | 'urgent';
  badge?: string;
}

/**
 * Checks whether a student is allowed to execute a test run or if they are in tactical cooldown.
 */
export function checkRunCooldown(lastRunTimestamp?: number, now = Date.now()): {
  allowed: boolean;
  remainingCooldownMs: number;
  remainingCooldownSeconds: number;
} {
  if (!lastRunTimestamp || typeof lastRunTimestamp !== 'number') {
    return { allowed: true, remainingCooldownMs: 0, remainingCooldownSeconds: 0 };
  }

  const elapsed = now - lastRunTimestamp;
  const remaining = Math.max(0, ARENA_RULES_CONFIG.RUN_COOLDOWN_MS - elapsed);

  return {
    allowed: remaining === 0,
    remainingCooldownMs: remaining,
    remainingCooldownSeconds: Math.ceil(remaining / 1000),
  };
}

/**
 * Calculates deterministic battle score (0 to 1000) based on test success,
 * remaining time, clean submission bonuses, and submission penalties.
 */
export function calculateBattleScore(params: {
  testsPassed: number;
  totalTests: number;
  timeRemainingSeconds: number;
  timeLimitSeconds: number;
  submissionAttempts?: number;
  failedAttempts?: number;
  isSurgeActive?: boolean;
}): BattleScoreBreakdown {
  const {
    testsPassed,
    totalTests,
    timeRemainingSeconds,
    timeLimitSeconds,
    submissionAttempts = 1,
    failedAttempts = 0,
    isSurgeActive = timeRemainingSeconds <= ARENA_RULES_CONFIG.PRESSURE_SURGE_THRESHOLD_SECONDS,
  } = params;

  const validTotal = Math.max(1, totalTests);
  const validPassed = Math.min(validTotal, Math.max(0, testsPassed));
  const completionRatio = validPassed / validTotal;

  // 1. Test Completion Points (up to 700 pts)
  let testScore = Math.round(completionRatio * ARENA_RULES_CONFIG.TEST_SCORE_WEIGHT);

  // 2. Time Remaining Speed Points (up to 200 pts)
  const validTimeLimit = Math.max(1, timeLimitSeconds);
  const timeRatio = Math.max(0, Math.min(1, timeRemainingSeconds / validTimeLimit));
  let timeScore = Math.round(timeRatio * ARENA_RULES_CONFIG.SPEED_SCORE_WEIGHT);

  // 3. Clean Execution Bonus (up to 100 pts)
  // Granted fully if passed with 0 failed attempts, halved if 1 failure, 0 if >= 2 failures
  let cleanBonus = 0;
  if (validPassed === validTotal) {
    if (failedAttempts === 0) {
      cleanBonus = ARENA_RULES_CONFIG.CLEAN_CODE_SCORE_BONUS;
    } else if (failedAttempts === 1) {
      cleanBonus = Math.round(ARENA_RULES_CONFIG.CLEAN_CODE_SCORE_BONUS / 2);
    }
  }

  // 4. Failed Attempt Penalties
  const penalties = failedAttempts * ARENA_RULES_CONFIG.FAILED_SUBMISSION_PENALTY_SCORE;

  // 5. Surge Clutch Multiplier (if passed during final 90 seconds)
  if (isSurgeActive && validPassed === validTotal) {
    testScore = Math.round(testScore * ARENA_RULES_CONFIG.SURGE_CLUTCH_BONUS_MULTIPLIER);
  }

  // Composite sum clamped to [0, MAX_SCORE]
  const rawTotal = testScore + timeScore + cleanBonus - penalties;
  const totalScore = Math.max(0, Math.min(ARENA_RULES_CONFIG.MAX_SCORE, rawTotal));
  const accuracyPct = Math.round(completionRatio * 100);

  return {
    testsPassed: validPassed,
    totalTests: validTotal,
    testScore,
    timeRemainingSeconds,
    timeScore,
    cleanBonus,
    penalties,
    totalScore,
    isSurgeActive,
    accuracyPct,
  };
}

/**
 * Resolves the match winner deterministically using the official Tie-Breaker Protocol.
 * 
 * Hierarchy:
 * 1. 100% Test Completion (First Blood priority)
 * 2. Higher number of tests passed
 * 3. Higher Battle Score (considers faster time and fewer penalties)
 * 4. Lower time spent seconds
 * 5. Honorable Draw
 */
export function resolveMatchWinner(params: {
  hostId: string;
  guestId: string;
  hostStats: CombatantBattleStats;
  guestStats: CombatantBattleStats;
  firstBloodClaimedBy?: string;
}): {
  winnerId: string;
  winReason: string;
  isDraw: boolean;
  hostBattleScore: number;
  guestBattleScore: number;
} {
  const { hostId, guestId, hostStats, guestStats, firstBloodClaimedBy } = params;

  const hostBattleScore = hostStats.score;
  const guestBattleScore = guestStats.score;

  const hostClearedAll = hostStats.testsPassed === hostStats.totalTests && hostStats.totalTests > 0;
  const guestClearedAll = guestStats.testsPassed === guestStats.totalTests && guestStats.totalTests > 0;

  // 1. Both Cleared All Tests -> Check First Blood
  if (hostClearedAll && guestClearedAll) {
    if (firstBloodClaimedBy === hostId) {
      return {
        winnerId: hostId,
        winReason: 'First Blood! Conquered all test cases before opponent.',
        isDraw: false,
        hostBattleScore,
        guestBattleScore,
      };
    }
    if (firstBloodClaimedBy === guestId) {
      return {
        winnerId: guestId,
        winReason: 'First Blood! Conquered all test cases before opponent.',
        isDraw: false,
        hostBattleScore,
        guestBattleScore,
      };
    }

    // Fallback to fastest time spent
    if (hostStats.timeSpentSeconds < guestStats.timeSpentSeconds) {
      return {
        winnerId: hostId,
        winReason: `Speed Advantage: Solved in ${hostStats.timeSpentSeconds}s vs ${guestStats.timeSpentSeconds}s`,
        isDraw: false,
        hostBattleScore,
        guestBattleScore,
      };
    }
    if (guestStats.timeSpentSeconds < hostStats.timeSpentSeconds) {
      return {
        winnerId: guestId,
        winReason: `Speed Advantage: Solved in ${guestStats.timeSpentSeconds}s vs ${hostStats.timeSpentSeconds}s`,
        isDraw: false,
        hostBattleScore,
        guestBattleScore,
      };
    }
  }

  // 2. Only One Cleared All Tests
  if (hostClearedAll && !guestClearedAll) {
    return {
      winnerId: hostId,
      winReason: `Flawless Clear: Passed all ${hostStats.totalTests}/${hostStats.totalTests} test cases.`,
      isDraw: false,
      hostBattleScore,
      guestBattleScore,
    };
  }
  if (guestClearedAll && !hostClearedAll) {
    return {
      winnerId: guestId,
      winReason: `Flawless Clear: Passed all ${guestStats.totalTests}/${guestStats.totalTests} test cases.`,
      isDraw: false,
      hostBattleScore,
      guestBattleScore,
    };
  }

  // 3. Higher Tests Passed
  if (hostStats.testsPassed > guestStats.testsPassed) {
    return {
      winnerId: hostId,
      winReason: `Test Accuracy: Passed ${hostStats.testsPassed}/${hostStats.totalTests} tests vs ${guestStats.testsPassed}/${guestStats.totalTests}.`,
      isDraw: false,
      hostBattleScore,
      guestBattleScore,
    };
  }
  if (guestStats.testsPassed > hostStats.testsPassed) {
    return {
      winnerId: guestId,
      winReason: `Test Accuracy: Passed ${guestStats.testsPassed}/${guestStats.totalTests} tests vs ${hostStats.testsPassed}/${hostStats.totalTests}.`,
      isDraw: false,
      hostBattleScore,
      guestBattleScore,
    };
  }

  // 4. Equal Tests Passed -> Higher Battle Score
  if (hostBattleScore > guestBattleScore) {
    return {
      winnerId: hostId,
      winReason: `Efficiency Tie-Break: Battle score of ${hostBattleScore} vs ${guestBattleScore}.`,
      isDraw: false,
      hostBattleScore,
      guestBattleScore,
    };
  }
  if (guestBattleScore > hostBattleScore) {
    return {
      winnerId: guestId,
      winReason: `Efficiency Tie-Break: Battle score of ${guestBattleScore} vs ${hostBattleScore}.`,
      isDraw: false,
      hostBattleScore,
      guestBattleScore,
    };
  }

  // 5. Strictly Equal -> Honorable Draw
  return {
    winnerId: 'draw',
    winReason: 'Honorable Stalemate: Identical test coverage, speed, and efficiency.',
    isDraw: true,
    hostBattleScore,
    guestBattleScore,
  };
}

/**
 * Creates a formatted combat event for the live match ticker.
 */
export function createCombatEvent(
  type: CombatEvent['type'],
  params: {
    actorName: string;
    actorId: string;
    testIndex?: number;
    testTotal?: number;
    streakCount?: number;
    extra?: string;
  }
): CombatEvent {
  const { actorName, actorId, testIndex, testTotal, streakCount, extra } = params;
  const timestamp = Date.now();
  const id = `evt_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;

  switch (type) {
    case 'first_blood':
      return {
        id,
        type,
        actorName,
        actorId,
        title: '🩸 FIRST BLOOD CLAIMED!',
        description: `${actorName} passed all ${testTotal ?? 5}/${testTotal ?? 5} test cases!`,
        timestamp,
        severity: 'urgent',
        badge: '+25 XP / +5 Elo',
      };

    case 'streak':
      return {
        id,
        type,
        actorName,
        actorId,
        title: `🔥 ${streakCount}X PASSING STREAK!`,
        description: `${actorName} is on fire! ${streakCount} test cases cleared in a row.`,
        timestamp,
        severity: 'success',
        badge: 'Streak',
      };

    case 'test_passed':
      return {
        id,
        type,
        actorName,
        actorId,
        title: '⚔️ Test Case Cleared',
        description: `${actorName} passed test ${testIndex ?? 1} of ${testTotal ?? 5}.`,
        timestamp,
        severity: 'info',
      };

    case 'test_failed':
      return {
        id,
        type,
        actorName,
        actorId,
        title: '⚠️ Test Failure / Runtime Exception',
        description: `${actorName} encountered a failure: ${extra || 'Assertion mismatch'}.`,
        timestamp,
        severity: 'warning',
      };

    case 'surge':
      return {
        id,
        type,
        actorName: 'SYSTEM',
        actorId: 'system',
        title: '⚡ PRESSURE SURGE PROTOCOL',
        description: 'Final 90 seconds! Test completions grant a +15% Clutch Bonus.',
        timestamp,
        severity: 'urgent',
        badge: 'Surge Active',
      };

    case 'rule_penalty':
      return {
        id,
        type,
        actorName,
        actorId,
        title: '🛡️ Tactical Cooldown Active',
        description: `${actorName} must wait for cooldown before running tests again.`,
        timestamp,
        severity: 'warning',
      };

    case 'peer_submitted':
      return {
        id,
        type,
        actorName,
        actorId,
        title: '🏁 Solution Submitted',
        description: `${actorName} locked in their final submission.`,
        timestamp,
        severity: 'info',
      };

    case 'peer_joined':
    default:
      return {
        id,
        type: 'peer_joined',
        actorName,
        actorId,
        title: '🤝 Combatant Connected',
        description: `${actorName} entered the battle chamber.`,
        timestamp,
        severity: 'info',
      };
  }
}
