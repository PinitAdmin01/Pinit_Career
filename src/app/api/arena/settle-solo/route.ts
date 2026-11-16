import { NextResponse } from 'next/server';
import { requireCombatantFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { judgeCodeWarsSubmission } from '@/lib/server/codeWarsJudge';
import { checkRateLimit } from '@/lib/server/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = await requireCombatantFromRequest(req);
  if (auth.error) return auth.error;
  const rateLimit = checkRateLimit(`arena_solo_settle_${auth.user.id}`, { limit: 20, windowMs: 60_000 });
  if (!rateLimit.allowed) return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 });

  try {
    const body = await req.json().catch(() => ({}));
    const matchId = typeof body?.matchId === 'string' ? body.matchId.trim() : '';
    if (!matchId || matchId.length > 80) {
      return NextResponse.json({ error: 'VALID_MATCH_ID_REQUIRED' }, { status: 400 });
    }

    // Guests can spar locally, but do not write competitive rewards to a student profile.
    if (auth.user.isGuest) {
      return NextResponse.json({
        ok: true,
        passed: false,
        oldElo: 100,
        newElo: 100,
        eloDelta: 0,
        arenaPointsAwarded: 0,
        newArenaPoints: 0,
        pinsAwarded: 0,
        newPins: 0,
        arenaWins: 0,
        arenaLosses: 0,
        rewardUnavailable: true,
      });
    }

    const admin = getSupabaseAdmin();
    const { data: match, error: matchError } = await admin
      .from('arena_solo_matches')
      .select('match_id, user_id, problem_id, deadline_at, status, settlement')
      .eq('match_id', matchId)
      .eq('user_id', auth.user.id)
      .maybeSingle();

    if (matchError) {
      console.error('[settle-solo] Match lookup failed:', matchError.message);
      return NextResponse.json({ error: 'ARENA_SETTLEMENT_UNAVAILABLE' }, { status: 503 });
    }
    if (!match) return NextResponse.json({ error: 'ARENA_MATCH_NOT_FOUND' }, { status: 404 });

    if (match.status === 'settled' && match.settlement) {
      return NextResponse.json({ ...match.settlement, alreadySettled: true });
    }

    let passed = false;
    if (Date.now() <= new Date(match.deadline_at).getTime() && typeof body?.code === 'string' && body.code.trim()) {
      const judged = await judgeCodeWarsSubmission(match.problem_id, body.code, body.language);
      if (!judged.ok) {
        return NextResponse.json({ error: judged.message, code: judged.error }, { status: 400 });
      }
      passed = judged.passed;
    }

    const { data: settlement, error: settlementError } = await admin.rpc('settle_solo_arena_match', {
      p_user_id: auth.user.id,
      p_match_id: matchId,
      p_passed: passed,
    });
    if (settlementError || !settlement?.ok) {
      console.error('[settle-solo] Atomic settlement failed:', settlementError?.message || settlement);
      return NextResponse.json({ error: 'ARENA_SETTLEMENT_UNAVAILABLE' }, { status: 503 });
    }

    return NextResponse.json(settlement);
  } catch (err: unknown) {
    console.error('[settle-solo] Fatal error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Solo settlement error' },
      { status: 500 }
    );
  }
}
