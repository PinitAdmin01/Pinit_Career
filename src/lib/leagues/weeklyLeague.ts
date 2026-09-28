/**
 * Weekly league promotion / demotion — the same rules as public.evaluate_weekly_leagues() (Phase B6b),
 * used by the cron route when that database function is unavailable.
 *
 * Only students are ranked (the caller passes students only). Every move is decided from one snapshot
 * of the week, so a player moved tonight is never ranked again in their new tier the same night.
 * In a tier of 2+ players the top 10% (at least 1) move up; in a tier of 10+ the bottom 10% move down.
 */

export const LEAGUE_TIERS = ['browns', 'silver', 'gold', 'platinum', 'ruby'] as const;
export type LeagueTier = (typeof LEAGUE_TIERS)[number];

export interface LeaguePlayer {
  id: string;
  league_tier: string | null;
  weekly_xp: number | null;
  xp_total: number | null;
}

export interface LeagueMove {
  id: string;
  from: LeagueTier;
  to: LeagueTier;
  outcome: 'promoted' | 'demoted';
  weekly_xp: number;
}

const isTier = (t: unknown): t is LeagueTier => (LEAGUE_TIERS as readonly unknown[]).includes(t);

export function planWeeklyLeagueMoves(players: LeaguePlayer[]): LeagueMove[] {
  const byTier = new Map<LeagueTier, LeaguePlayer[]>();
  for (const p of players) {
    if (!isTier(p.league_tier)) continue;
    const group = byTier.get(p.league_tier) ?? [];
    group.push(p);
    byTier.set(p.league_tier, group);
  }

  const moves: LeagueMove[] = [];
  for (const [tier, group] of byTier) {
    const n = group.length;
    if (n < 2) continue;
    const ti = LEAGUE_TIERS.indexOf(tier);
    // Integer arithmetic (n / 10), matching the SQL: 30 * 0.1 is 3.0000000000000004 in JavaScript.
    const promCutoff = Math.max(1, Math.ceil(n / 10));
    const demCutoff = n - Math.floor(n / 10) + 1;
    const ranked = [...group].sort(
      (a, b) =>
        (b.weekly_xp ?? 0) - (a.weekly_xp ?? 0) ||
        (b.xp_total ?? 0) - (a.xp_total ?? 0) ||
        (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    );
    ranked.forEach((p, i) => {
      const rank = i + 1;
      if (ti < LEAGUE_TIERS.length - 1 && rank <= promCutoff) {
        moves.push({ id: p.id, from: tier, to: LEAGUE_TIERS[ti + 1], outcome: 'promoted', weekly_xp: p.weekly_xp ?? 0 });
      } else if (ti > 0 && demCutoff > promCutoff && rank >= demCutoff) {
        moves.push({ id: p.id, from: tier, to: LEAGUE_TIERS[ti - 1], outcome: 'demoted', weekly_xp: p.weekly_xp ?? 0 });
      }
    });
  }
  return moves;
}
