import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { CodeWarsApiService } from '@/lib/api/codeWarsApi';
import { requireCombatantFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const rateLimit = checkRateLimit(`arena_solo_start_${getClientIp(req)}`, { limit: 10, windowMs: 60_000 });
  if (!rateLimit.allowed) return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 });

  const auth = await requireCombatantFromRequest(req);
  if (auth.error) return auth.error;

  try {
    const body = await req.json().catch(() => ({}));
    const problemId = typeof body?.problemId === 'string' ? body.problemId.trim() : '';
    const suppliedRequestId = typeof body?.requestId === 'string' ? body.requestId.trim() : '';
    if (!auth.user.isGuest && !suppliedRequestId) {
      return NextResponse.json({ error: 'IDEMPOTENCY_KEY_REQUIRED' }, { status: 400 });
    }
    const requestId = suppliedRequestId || randomUUID();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
      return NextResponse.json({ error: 'INVALID_REQUEST_ID' }, { status: 400 });
    }
    const problem = CodeWarsApiService.getAuthoritativeProblem(problemId);
    if (!problem) {
      return NextResponse.json({ error: 'UNSUPPORTED_PROBLEM' }, { status: 400 });
    }

    const startedAt = new Date();
    const deadlineAt = new Date(startedAt.getTime() + problem.timeLimitSeconds * 1000);

    // Guest sessions are intentionally not persisted to student profiles.
    if (auth.user.isGuest) {
      return NextResponse.json({ ok: true, matchId: requestId, problemId: problem.id, startedAt: startedAt.toISOString(), deadlineAt: deadlineAt.toISOString(), persisted: false });
    }

    const admin = getSupabaseAdmin();

    // Enforce strict Current-Pins-only spending (never deduct Arena fees from bonus_pins)
    // unless this requestId is an idempotent replay of an already-charged match.
    const { data: existingMatch } = await admin
      .from('arena_solo_matches')
      .select('match_id')
      .eq('create_request_id', requestId)
      .maybeSingle();

    if (!existingMatch) {
      const { data: wallet } = await admin
        .from('users')
        .select('pins, bonus_pins')
        .eq('id', auth.user.id)
        .maybeSingle();
      const currentPins = typeof wallet?.pins === 'number' ? Math.max(0, wallet.pins) : 0;
      const bonusPins = typeof wallet?.bonus_pins === 'number' ? Math.max(0, wallet.bonus_pins) : 0;
      if (currentPins < 10) {
        return NextResponse.json(
          {
            error: 'INSUFFICIENT_PINS',
            message:
              bonusPins > 0
                ? `You need 10 Current Pins to start AI practice (you have ${currentPins}/120). Refill Current Pins from your ${bonusPins} Bonus Vault pins first.`
                : `You need 10 Current Pins to start AI practice (you have ${currentPins}/120).`,
            currentBalance: currentPins,
            bonusBalance: bonusPins,
            canRefillFromBonus: bonusPins > 0 && currentPins < 120,
          },
          { status: 402 }
        );
      }
    }

    const { data, error } = await admin.rpc('start_solo_arena_match_with_pin_fee', {
      p_request_id: requestId,
      p_user_id: auth.user.id,
      p_match_id: randomUUID(),
      p_problem_id: problem.id,
      p_started_at: startedAt.toISOString(),
      p_deadline_at: deadlineAt.toISOString(),
    });
    if (error || !data?.ok) {
      if (data?.error === 'INSUFFICIENT_PINS') {
        return NextResponse.json({ error: 'INSUFFICIENT_PINS', message: 'You need 10 Pins to start AI practice.' }, { status: 402 });
      }
      if (data?.error === 'IDEMPOTENCY_KEY_CONFLICT') {
        return NextResponse.json({ error: 'IDEMPOTENCY_KEY_CONFLICT' }, { status: 409 });
      }
      console.error('[ArenaSoloStart] Could not create and charge server match:', error?.message || data?.error);
      return NextResponse.json({ error: 'ARENA_MATCH_UNAVAILABLE' }, { status: 503 });
    }

    return NextResponse.json({
      ok: true,
      matchId: data.matchId,
      problemId: typeof data.problemId === 'string' ? data.problemId : problem.id,
      startedAt: data.startedAt,
      deadlineAt: data.deadlineAt,
      persisted: true,
      newBalance: Number(data.newBalance) || 0,
      newBonusBalance: Number(data.newBonusBalance) || 0,
      replayed: Boolean(data.replayed),
    });
  } catch (err) {
    console.error('[ArenaSoloStart] Failed to start match:', err);
    return NextResponse.json({ error: 'ARENA_MATCH_UNAVAILABLE' }, { status: 503 });
  }
}
