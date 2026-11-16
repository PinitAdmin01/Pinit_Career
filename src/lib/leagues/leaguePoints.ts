export const ARENA_WIN_POINTS_PER_ELO = 0.5;
export const ARENA_WIN_POINTS_CAP = 250;

export function arenaPointsForResult(
  preMatchElo: number,
  outcome: 'win' | 'draw' | 'loss',
): number {
  const safeElo = Number.isFinite(preMatchElo) ? Math.max(0, preMatchElo) : 100;
  if (outcome !== 'win') return 0;
  return Math.min(ARENA_WIN_POINTS_CAP, Math.round(safeElo * ARENA_WIN_POINTS_PER_ELO));
}

export function calculateLeaguePoints(learningXp: number, arenaPoints: number): number {
  return Math.max(0, Math.round(learningXp || 0)) + Math.max(0, Math.round(arenaPoints || 0));
}

export function getLeagueCutoffs(memberCount: number) {
  if (memberCount < 2) {
    return { promotionCutoffRank: 0, demotionCutoffRank: 0 };
  }

  const promotionCutoffRank = Math.max(1, Math.ceil(memberCount * 0.1));
  const demotionCutoffRank = memberCount >= 10
    ? memberCount - Math.floor(memberCount * 0.1) + 1
    : 0;

  return { promotionCutoffRank, demotionCutoffRank };
}
