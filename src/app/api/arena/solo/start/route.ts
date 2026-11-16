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
    const problem = CodeWarsApiService.getAuthoritativeProblem(problemId);
    if (!problem) {
      return NextResponse.json({ error: 'UNSUPPORTED_PROBLEM' }, { status: 400 });
    }

    const matchId = randomUUID();
    const startedAt = new Date();
    const deadlineAt = new Date(startedAt.getTime() + problem.timeLimitSeconds * 1000);

    // Guest sessions are intentionally not persisted to student profiles.
    if (auth.user.isGuest) {
      return NextResponse.json({ ok: true, matchId, startedAt: startedAt.toISOString(), deadlineAt: deadlineAt.toISOString(), persisted: false });
    }

    const { error } = await getSupabaseAdmin().from('arena_solo_matches').insert({
      match_id: matchId,
      user_id: auth.user.id,
      problem_id: problem.id,
      started_at: startedAt.toISOString(),
      deadline_at: deadlineAt.toISOString(),
    });
    if (error) {
      console.error('[ArenaSoloStart] Could not create server match:', error.message);
      return NextResponse.json({ error: 'ARENA_MATCH_UNAVAILABLE' }, { status: 503 });
    }

    return NextResponse.json({ ok: true, matchId, startedAt: startedAt.toISOString(), deadlineAt: deadlineAt.toISOString(), persisted: true });
  } catch (err) {
    console.error('[ArenaSoloStart] Failed to start match:', err);
    return NextResponse.json({ error: 'ARENA_MATCH_UNAVAILABLE' }, { status: 503 });
  }
}
