/**
 * Authoritative Elo & Arena Match Settlement Engine
 * 
 * Implements standard FIDE / Esports Elo rating calculation with dynamic K-factors,
 * a persistent rating, and Arena Points awards.
 */

import {
  ARENA_WIN_POINTS_CAP,
  ARENA_WIN_POINTS_PER_ELO,
  arenaPointsForResult,
} from '@/lib/leagues/leaguePoints';

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
  hostArenaPointsAward: number;
  guestArenaPointsAward: number;
  hostPinsAward: number;
  guestPinsAward: number;
}

export const ELO_CONFIG = {
  DEFAULT_ELO: 100,
  FLOOR_ELO: 0,
  WIN_ELO_TRANSFER: 20,
  K_FACTOR_CADET: 32,      // Rating < 1400 (fast calibration)
  K_FACTOR_INTERMEDIATE: 24,// Rating 1400 - 1800
  K_FACTOR_MASTER: 16,     // Rating > 1800 (high stability)
  WIN_ARENA_POINTS_PER_ELO: ARENA_WIN_POINTS_PER_ELO,
  WIN_ARENA_POINTS_CAP: ARENA_WIN_POINTS_CAP,
  WIN_PINS: 0,
  LOSS_PINS: 0,
  DRAW_PINS: 0,
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
 * Core Rule: Everyone starts at 100 ELO. Winner receives 20 ELO from opponent (100 -> 120, opponent -> 80). Floor is 0.
 */
export function calculateEloMatch(params: {
  hostId: string;
  guestId: string;
  hostElo?: number | null;
  guestElo?: number | null;
  winnerId: string; // hostId, guestId, or 'draw'
}): EloMatchResult {
  const safeHostElo = params.hostElo !== null && params.hostElo !== undefined && Number.isFinite(Number(params.hostElo))
    ? Number(params.hostElo)
    : ELO_CONFIG.DEFAULT_ELO;
  const safeGuestElo = params.guestElo !== null && params.guestElo !== undefined && Number.isFinite(Number(params.guestElo))
    ? Number(params.guestElo)
    : ELO_CONFIG.DEFAULT_ELO;
  const hostCurrentElo = Math.max(ELO_CONFIG.FLOOR_ELO, safeHostElo);
  const guestCurrentElo = Math.max(ELO_CONFIG.FLOOR_ELO, safeGuestElo);

  const hostExpected = calculateExpectedScore(hostCurrentElo, guestCurrentElo);
  const guestExpected = calculateExpectedScore(guestCurrentElo, hostCurrentElo);

  let hostActualScore = 0.5;
  let guestActualScore = 0.5;
  let hostArenaPointsAward = 0;
  let guestArenaPointsAward = 0;
  let hostPinsAward = ELO_CONFIG.DRAW_PINS;
  let guestPinsAward = ELO_CONFIG.DRAW_PINS;
  let hostDelta = 0;
  let guestDelta = 0;

  if (params.winnerId === params.hostId) {
    hostActualScore = 1;
    guestActualScore = 0;
    hostArenaPointsAward = arenaPointsForResult(hostCurrentElo, 'win');
    hostPinsAward = ELO_CONFIG.WIN_PINS;
    guestPinsAward = ELO_CONFIG.LOSS_PINS;
    hostDelta = ELO_CONFIG.WIN_ELO_TRANSFER;
    guestDelta = -ELO_CONFIG.WIN_ELO_TRANSFER;
  } else if (params.winnerId === params.guestId) {
    hostActualScore = 0;
    guestActualScore = 1;
    guestArenaPointsAward = arenaPointsForResult(guestCurrentElo, 'win');
    hostPinsAward = ELO_CONFIG.LOSS_PINS;
    guestPinsAward = ELO_CONFIG.WIN_PINS;
    hostDelta = -ELO_CONFIG.WIN_ELO_TRANSFER;
    guestDelta = ELO_CONFIG.WIN_ELO_TRANSFER;
  }

  // Enforce Elo floor (0)
  const hostNewElo = Math.max(ELO_CONFIG.FLOOR_ELO, hostCurrentElo + hostDelta);
  const guestNewElo = Math.max(ELO_CONFIG.FLOOR_ELO, guestCurrentElo + guestDelta);
  hostDelta = hostNewElo - hostCurrentElo;
  guestDelta = guestNewElo - guestCurrentElo;

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
    hostArenaPointsAward,
    guestArenaPointsAward,
    hostPinsAward,
    guestPinsAward,
  };
}
