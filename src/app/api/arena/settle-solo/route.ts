import { NextRequest, NextResponse } from 'next/server';
import { requireCombatantFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { ELO_CONFIG } from '@/lib/arena/eloEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireCombatantFromRequest(req);
    if (auth.error) {
      return auth.error;
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const studentId = auth.user.id;
    const passed = Boolean(body.passed);
    const problemId = typeof body.problemId === 'string' ? body.problemId : 'algorithmic_sparring';

    let currentElo = ELO_CONFIG.DEFAULT_ELO; // 100
    let userProfile: any = null;
    let admin: any = null;

    try {
      admin = getSupabaseAdmin();
      if (admin && studentId && !auth.user.isGuest) {
        const { data } = await admin
          .from('users')
          .select('id, arena_elo, arena_wins, arena_losses, xp_total, weekly_xp, pins')
          .eq('id', studentId)
          .maybeSingle();

        if (data) {
          userProfile = data;
          if (typeof data.arena_elo === 'number' && Number.isFinite(data.arena_elo)) {
            currentElo = data.arena_elo;
          }
        }
      }
    } catch (err) {
      console.warn('[settle-solo] Could not query user profile from Supabase:', err);
    }

    // Core ELO rule: Base 100. Win gives +20, Loss subtracts -20 (floored at 0).
    const eloDelta = passed ? ELO_CONFIG.WIN_ELO_TRANSFER : -ELO_CONFIG.WIN_ELO_TRANSFER;
    const xpAwarded = passed ? ELO_CONFIG.WIN_XP : ELO_CONFIG.LOSS_XP;
    const pinsAwarded = 0; // Strict policy: Pins acquired strictly via purchase and bonus, not gameplay

    const newElo = Math.max(ELO_CONFIG.FLOOR_ELO, currentElo + eloDelta);
    const effectiveDelta = newElo - currentElo;

    const currentXp = Number(userProfile?.xp_total) || 0;
    const currentWeeklyXp = Number(userProfile?.weekly_xp) || 0;
    const currentPins = Number(userProfile?.pins) || 0;
    const currentWins = Number(userProfile?.arena_wins) || 0;
    const currentLosses = Number(userProfile?.arena_losses) || 0;

    const newXpTotal = currentXp + xpAwarded;
    const newWeeklyXp = currentWeeklyXp + xpAwarded;
    const newPins = currentPins;
    const newWins = currentWins + (passed ? 1 : 0);
    const newLosses = currentLosses + (!passed ? 1 : 0);

    // Persist to Supabase if available and user is authenticated
    if (admin && studentId && !auth.user.isGuest) {
      try {
        await admin.from('users').update({
          arena_elo: newElo,
          arena_wins: newWins,
          arena_losses: newLosses,
          xp_total: newXpTotal,
          weekly_xp: newWeeklyXp,
        }).eq('id', studentId);

        await admin.from('xp_ledger').insert({
          user_id: studentId,
          amount: xpAwarded,
          reason: passed
            ? `Turing AI Sparring Victory (+20 ELO, +${xpAwarded} XP) [${problemId}]`
            : `Turing AI Sparring Match (${effectiveDelta} ELO, +${xpAwarded} XP) [${problemId}]`,
          category: 'arena_duel',
        });
      } catch (dbErr) {
        console.error('[settle-solo] Supabase persistence failed:', dbErr);
      }
    }

    return NextResponse.json({
      ok: true,
      passed,
      oldElo: currentElo,
      newElo,
      eloDelta: effectiveDelta,
      xpAwarded,
      newXp: newXpTotal,
      newWeeklyXp,
      pinsAwarded: 0,
      newPins,
      arenaWins: newWins,
      arenaLosses: newLosses,
    });
  } catch (err: unknown) {
    console.error('[settle-solo] Fatal error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Solo settlement error' },
      { status: 500 }
    );
  }
}
