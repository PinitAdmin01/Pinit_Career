/**
 * Deterministic preview of the same weekly movement rules used by
 * public.evaluate_weekly_leagues(). The cron itself runs the atomic SQL procedure.
 *
 * Only students are ranked (the caller passes students only). Every move is decided from one snapshot
 * of the week, so a player moved tonight is never ranked again in their new tier the same night.
 * League Points are sprint Learning XP + Arena Points. In a tier of 2+ players the top 25% (rounded up, at least 1)
 * move up; in a tier of 10+ the bottom 10% move down. Browns and Ruby keep their terminal boundaries.
 */

import { calculateLeaguePoints, getLeagueCutoffs } from '@/lib/leagues/leaguePoints';

export const LEAGUE_TIERS = ['browns', 'silver', 'gold', 'platinum', 'ruby'] as const;
export type LeagueTier = (typeof LEAGUE_TIERS)[number];

export interface LeaguePlayer {
  id: string;
  league_tier: string | null;
  weekly_xp: number | null;
  weekly_arena_points?: number | null;
  xp_total: number | null;
  league_joined_at?: string | null;
}

export interface LeagueMove {
  id: string;
  from: LeagueTier;
  to: LeagueTier;
  outcome: 'promoted' | 'demoted';
  learning_xp: number;
  arena_points: number;
  league_points: number;
}

function normalizeTier(value: unknown): LeagueTier | null {
  if (typeof value !== 'string') return null;
  const normalized = value.toLowerCase() as LeagueTier;
  return (LEAGUE_TIERS as readonly string[]).includes(normalized) ? normalized : null;
}

export function planWeeklyLeagueMoves(players: LeaguePlayer[]): LeagueMove[] {
  const byTier = new Map<LeagueTier, LeaguePlayer[]>();
  for (const p of players) {
    const tier = normalizeTier(p.league_tier);
    if (!tier || !p.league_joined_at || (p.xp_total ?? 0) < 100) continue;
    const group = byTier.get(tier) ?? [];
    group.push(p);
    byTier.set(tier, group);
  }

  const moves: LeagueMove[] = [];
  for (const [tier, group] of byTier) {
    const n = group.length;
    if (n < 2) continue;
    const ti = LEAGUE_TIERS.indexOf(tier);
    // Integer arithmetic (n / 10), matching the SQL: 30 * 0.1 is 3.0000000000000004 in JavaScript.
    const { promotionCutoffRank: promCutoff, demotionCutoffRank: demCutoff } = getLeagueCutoffs(n);
    const toMoveScore = (p: LeaguePlayer) => ({
      learning_xp: Math.max(0, p.weekly_xp ?? 0),
      arena_points: Math.max(0, p.weekly_arena_points ?? 0),
      league_points: calculateLeaguePoints(p.weekly_xp ?? 0, p.weekly_arena_points ?? 0),
    });
    const ranked = [...group].sort(
      (a, b) => {
        const aScore = calculateLeaguePoints(a.weekly_xp ?? 0, a.weekly_arena_points ?? 0);
        const bScore = calculateLeaguePoints(b.weekly_xp ?? 0, b.weekly_arena_points ?? 0);
        return bScore - aScore ||
          Math.max(0, b.weekly_xp ?? 0) - Math.max(0, a.weekly_xp ?? 0) ||
          (b.xp_total ?? 0) - (a.xp_total ?? 0) ||
          (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
      }
    );
    ranked.forEach((p, i) => {
      const rank = i + 1;
      if (ti < LEAGUE_TIERS.length - 1 && rank <= promCutoff) {
        const score = toMoveScore(p);
        moves.push({ id: p.id, from: tier, to: LEAGUE_TIERS[ti + 1], outcome: 'promoted', ...score });
      } else if (ti > 0 && demCutoff > 0 && demCutoff > promCutoff && rank >= demCutoff) {
        const score = toMoveScore(p);
        moves.push({ id: p.id, from: tier, to: LEAGUE_TIERS[ti - 1], outcome: 'demoted', ...score });
      }
    });
  }
  return moves;
}
