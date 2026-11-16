import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export const dynamic = 'force-dynamic';

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
    if (profile?.role && String(profile.role).toLowerCase() !== 'student') {
      return NextResponse.json({ ok: false, error: 'STUDENTS_ONLY' }, { status: 403 });
    }
    const careerXp = Number(profile?.xp_total) || 0;
    if (!profile || careerXp < 100) {
      return NextResponse.json({
        ok: false,
        error: 'LEAGUE_ENTRY_LOCKED',
        careerXp,
        requiredXp: 100,
      }, { status: 403 });
    }

    const alreadyJoined = Boolean(profile.league_joined_at);
    const tier = alreadyJoined && profile.league_tier
      ? String(profile.league_tier).toLowerCase()
      : 'browns';
    const storedElo = Number(profile.arena_elo);
    const isLegacyDefault = storedElo === 1200 && !profile.arena_wins;
    const nextElo = Number.isFinite(storedElo) && storedElo >= 0 && !isLegacyDefault ? storedElo : 100;

    const { error: updateError } = await admin
      .from('users')
      .update({
        league_tier: tier,
        league_joined_at: profile.league_joined_at || new Date().toISOString(),
        arena_elo: nextElo,
      })
      .eq('id', auth.user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ ok: true, leagueTier: tier, arenaElo: nextElo, careerXp });
  } catch (error) {
    console.error('[LeaderboardJoin] Could not join ranked league:', error);
    return NextResponse.json({ ok: false, error: 'LEAGUE_JOIN_FAILED' }, { status: 500 });
  }
}
