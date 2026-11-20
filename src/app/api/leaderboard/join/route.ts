import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export const dynamic = 'force-dynamic';

const VALID_LEAGUE_TIERS = new Set(['browns', 'silver', 'gold', 'platinum', 'ruby']);

function normalizeLeagueTier(value: unknown): string {
  const tier = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return VALID_LEAGUE_TIERS.has(tier) ? tier : 'browns';
}

function finiteNumberOr(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function membershipResponse(profile: Record<string, any>, careerXp: number, alreadyJoined: boolean) {
  const wins = finiteNumberOr(profile.arena_wins, 0);
  const storedElo = finiteNumberOr(profile.arena_elo, 100);
  const arenaElo = storedElo < 0 || (storedElo === 1200 && wins <= 0)
    ? 100
    : storedElo;
  return NextResponse.json({
    ok: true,
    leagueTier: normalizeLeagueTier(profile.league_tier),
    arenaElo,
    careerXp,
    joinedAt: profile.league_joined_at,
    currentUserHasJoined: true,
    alreadyJoined,
  });
}

export async function POST(req: Request) {
  const auth = await requireUserFromRequest(req);
  if (auth.error) return auth.error;

  try {
    const admin = getSupabaseAdmin();
    const { data: profile, error: profileError } = await admin
      .from('users')
      .select('id, role, xp_total, league_tier, league_joined_at, arena_elo, arena_wins')
      .eq('id', auth.user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) {
      return NextResponse.json({ ok: false, error: 'USER_PROFILE_NOT_FOUND' }, { status: 404 });
    }
    if (profile.role !== null && profile.role !== undefined && String(profile.role).trim().toLowerCase() !== 'student') {
      return NextResponse.json({ ok: false, error: 'STUDENTS_ONLY' }, { status: 403 });
    }

    const rawCareerXp = finiteNumberOr(profile.xp_total, 0);
    const careerXp = Math.max(0, rawCareerXp);
    const alreadyJoined = Boolean(profile.league_joined_at);

    // Membership remains valid if XP is later corrected or reduced. Retrying a
    // successful join must return the existing membership without rewriting it.
    if (alreadyJoined) return membershipResponse(profile, careerXp, true);

    if (careerXp < 100) {
      return NextResponse.json({
        ok: false,
        error: 'LEAGUE_ENTRY_LOCKED',
        careerXp,
        requiredXp: 100,
      }, { status: 403 });
    }

    // Retain a legitimate existing rating; null, invalid, or legacy ratings
    // get the agreed 100-point starting value.
    const storedElo = finiteNumberOr(profile.arena_elo, 100);
    const wins = finiteNumberOr(profile.arena_wins, 0);
    const isLegacyDefault = storedElo === 1200 && wins <= 0;
    const normalizedElo = storedElo < 0 || isLegacyDefault ? 100 : storedElo;
    const joinedAt = new Date().toISOString();

    const { data: updatedProfile, error: updateError } = await admin
      .from('users')
      .update({
        league_tier: 'browns',
        league_joined_at: joinedAt,
        arena_elo: normalizedElo,
      })
      .eq('id', auth.user.id)
      .is('league_joined_at', null)
      .select('league_tier, league_joined_at, arena_elo, arena_wins')
      .maybeSingle();

    if (updateError) throw updateError;
    if (updatedProfile?.league_joined_at) {
      return membershipResponse(updatedProfile, careerXp, false);
    }

    // Another request may have joined first. Re-read and return that persisted
    // row; otherwise don't tell the client that a failed write succeeded.
    const { data: persistedProfile, error: readbackError } = await admin
      .from('users')
      .select('league_tier, league_joined_at, arena_elo, arena_wins')
      .eq('id', auth.user.id)
      .maybeSingle();

    if (readbackError) {
      console.error('[LeaderboardJoin] Could not verify membership after concurrent update:', readbackError);
      return NextResponse.json({ ok: false, error: 'LEAGUE_JOIN_STATUS_UNAVAILABLE' }, { status: 503 });
    }
    if (persistedProfile?.league_joined_at) {
      return membershipResponse(persistedProfile, careerXp, true);
    }

    console.error('[LeaderboardJoin] Update returned without persisted league membership:', auth.user.id);
    return NextResponse.json({ ok: false, error: 'LEAGUE_JOIN_NOT_PERSISTED' }, { status: 503 });
  } catch (error) {
    console.error('[LeaderboardJoin] Could not join ranked league:', error);
    return NextResponse.json({ ok: false, error: 'LEAGUE_JOIN_FAILED' }, { status: 500 });
  }
}
