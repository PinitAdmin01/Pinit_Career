import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return handleReset(req);
}

export async function POST(req: Request) {
  return handleReset(req);
}

async function handleReset(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Cron secret required' }, { status: 401 });
  }

  try {
    // League moves and both sprint score resets must commit together in Postgres.
    // A per-user HTTP fallback can leave a half-promoted league if one write fails.
    const { data, error } = await getSupabaseAdmin().rpc('evaluate_weekly_leagues');
    if (error || !data?.ok) {
      console.error('[WeeklyLeagueReset] Atomic league evaluation failed:', error?.message || data);
      return NextResponse.json(
        { ok: false, error: 'LEAGUE_EVALUATION_UNAVAILABLE', message: 'The league cycle was not changed. Apply the latest database migration and retry.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, source: 'stored_procedure', result: data });
  } catch (err: unknown) {
    console.error('[WeeklyLeagueReset] Cron execution error:', err);
    return NextResponse.json({ ok: false, error: 'LEAGUE_EVALUATION_UNAVAILABLE' }, { status: 503 });
  }
}
