/**
 * Authoritative Elo & Arena Match Settlement Engine
 * 
 * Implements standard FIDE / Esports Elo rating calculation with dynamic K-factors,
 * rating floors, and match XP / pin rewards.
 */

export interface EloPlayer {
  id: string;
  name: string;
  currentElo: number;
  isGuest?: boolean;
}

export interface EloMatchResult {
  hostId: string;
  guestId: string;
  winnerId: string; // hostId, guestId, or 'draw'
  hostCurrentElo: number;
  guestCurrentElo: number;
  hostExpected: number;
  guestExpected: number;
  hostDelta: number;
  guestDelta: number;
  hostNewElo: number;
  guestNewElo: number;
  hostXpAward: number;
  guestXpAward: number;
  hostPinsAward: number;
  guestPinsAward: number;
}

export const ELO_CONFIG = {
  DEFAULT_ELO: 1200,
  FLOOR_ELO: 1000,
  K_FACTOR_CADET: 32,      // Rating < 1400 (fast calibration)
  K_FACTOR_INTERMEDIATE: 24,// Rating 1400 - 1800
  K_FACTOR_MASTER: 16,     // Rating > 1800 (high stability)
  WIN_XP: 50,
  LOSS_XP: 15,
  DRAW_XP: 25,
  WIN_PINS: 20,
  LOSS_PINS: 5,
  DRAW_PINS: 10,
};

export function getKFactor(rating: number): number {
  if (rating < 1400) return ELO_CONFIG.K_FACTOR_CADET;
  if (rating <= 1800) return ELO_CONFIG.K_FACTOR_INTERMEDIATE;
  return ELO_CONFIG.K_FACTOR_MASTER;
}

/**
 * Computes expected win probability using logistic distribution:
 * E_A = 1 / (1 + 10 ^ ((R_B - R_A) / 400))
 */
export function calculateExpectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * Calculates Elo rating changes and match rewards for two combatants.
 */
export function calculateEloMatch(params: {
  hostId: string;
  guestId: string;
  hostElo?: number | null;
  guestElo?: number | null;
  winnerId: string; // hostId, guestId, or 'draw'
}): EloMatchResult {
  const hostCurrentElo = Math.max(ELO_CONFIG.FLOOR_ELO, Number(params.hostElo) || ELO_CONFIG.DEFAULT_ELO);
  const guestCurrentElo = Math.max(ELO_CONFIG.FLOOR_ELO, Number(params.guestElo) || ELO_CONFIG.DEFAULT_ELO);

  const hostExpected = calculateExpectedScore(hostCurrentElo, guestCurrentElo);
  const guestExpected = calculateExpectedScore(guestCurrentElo, hostCurrentElo);

  let hostActualScore = 0.5;
  let guestActualScore = 0.5;
  let hostXpAward = ELO_CONFIG.DRAW_XP;
  let guestXpAward = ELO_CONFIG.DRAW_XP;
  let hostPinsAward = ELO_CONFIG.DRAW_PINS;
  let guestPinsAward = ELO_CONFIG.DRAW_PINS;

  if (params.winnerId === params.hostId) {
    hostActualScore = 1;
    guestActualScore = 0;
    hostXpAward = ELO_CONFIG.WIN_XP;
    guestXpAward = ELO_CONFIG.LOSS_XP;
    hostPinsAward = ELO_CONFIG.WIN_PINS;
    guestPinsAward = ELO_CONFIG.LOSS_PINS;
  } else if (params.winnerId === params.guestId) {
    hostActualScore = 0;
    guestActualScore = 1;
    hostXpAward = ELO_CONFIG.LOSS_XP;
    guestXpAward = ELO_CONFIG.WIN_XP;
    hostPinsAward = ELO_CONFIG.LOSS_PINS;
    guestPinsAward = ELO_CONFIG.WIN_PINS;
  }

  const hostK = getKFactor(hostCurrentElo);
  const guestK = getKFactor(guestCurrentElo);

  // ΔR = round(K * (Actual - Expected))
  const hostDelta = Math.round(hostK * (hostActualScore - hostExpected));
  const guestDelta = Math.round(guestK * (guestActualScore - guestExpected));

  // Enforce Elo floor
  const hostNewElo = Math.max(ELO_CONFIG.FLOOR_ELO, hostCurrentElo + hostDelta);
  const guestNewElo = Math.max(ELO_CONFIG.FLOOR_ELO, guestCurrentElo + guestDelta);

  return {
    hostId: params.hostId,
    guestId: params.guestId,
    winnerId: params.winnerId,
    hostCurrentElo,
    guestCurrentElo,
    hostExpected: Math.round(hostExpected * 1000) / 1000,
    guestExpected: Math.round(guestExpected * 1000) / 1000,
    hostDelta,
    guestDelta,
    hostNewElo,
    guestNewElo,
    hostXpAward,
    guestXpAward,
    hostPinsAward,
    guestPinsAward,
  };
}
