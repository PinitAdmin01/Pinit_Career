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

export type LeagueRankTier = 'browns' | 'silver' | 'gold' | 'platinum' | 'ruby';

export interface LeagueRankableEntry {
  rank: number;
  studentId: string;
  weeklyXp: number;
  arenaPoints?: number;
  leaguePoints?: number;
  totalXp: number;
  zone: 'promotion' | 'safe' | 'demotion';
}

/**
 * Keep the visible leaderboard order, rank labels, League Points, and sprint
 * zones derived from the same snapshot. This is also used for optimistic
 * client updates so refreshed stats cannot leave a stale rank behind.
 */
export function rankLeagueEntries<T extends LeagueRankableEntry>(
  entries: T[],
  tier: LeagueRankTier,
  promotionCutoffRank: number,
  demotionCutoffRank: number,
): T[] {
  const ranked = entries.map(entry => ({
    ...entry,
    weeklyXp: Math.max(0, Math.round(Number(entry.weeklyXp) || 0)),
    arenaPoints: Math.max(0, Math.round(Number(entry.arenaPoints) || 0)),
    totalXp: Math.max(0, Number(entry.totalXp) || 0),
  }));

  ranked.sort((a, b) => {
    const pointsA = calculateLeaguePoints(a.weeklyXp, a.arenaPoints ?? 0);
    const pointsB = calculateLeaguePoints(b.weeklyXp, b.arenaPoints ?? 0);
    if (pointsB !== pointsA) return pointsB - pointsA;
    if (b.weeklyXp !== a.weeklyXp) return b.weeklyXp - a.weeklyXp;
    if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;
    return a.studentId.localeCompare(b.studentId);
  });

  return ranked.map((entry, index) => {
    const rank = index + 1;
    const leaguePoints = calculateLeaguePoints(entry.weeklyXp, entry.arenaPoints ?? 0);
    const hasEnoughMembers = ranked.length >= 2;
    const zone: LeagueRankableEntry['zone'] = tier !== 'ruby' && hasEnoughMembers && rank <= promotionCutoffRank
      ? 'promotion'
      : tier !== 'browns' && hasEnoughMembers && demotionCutoffRank > 0 && rank >= demotionCutoffRank && rank > promotionCutoffRank
        ? 'demotion'
        : 'safe';

    return { ...entry, rank, leaguePoints, zone } as T;
  });
}

export function getLeagueCutoffs(memberCount: number) {
  if (memberCount < 2) {
    return { promotionCutoffRank: 0, demotionCutoffRank: 0 };
  }

  const promotionCutoffRank = Math.max(1, Math.ceil(memberCount * 0.25));
  const demotionCutoffRank = memberCount >= 10
    ? memberCount - Math.floor(memberCount * 0.1) + 1
    : 0;

  return { promotionCutoffRank, demotionCutoffRank };
}
