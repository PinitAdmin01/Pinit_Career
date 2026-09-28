import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { LEAGUE_TIERS, planWeeklyLeagueMoves, type LeaguePlayer } from '@/lib/leagues/weeklyLeague';

export async function GET(req: Request) {
  return handleReset(req);
}

export async function POST(req: Request) {
  return handleReset(req);
}

async function handleReset(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Cron secret required' }, { status: 401 });
    }

    const admin = getSupabaseAdmin();

    // 1. Attempt authoritative stored procedure first
    const { data: rpcRes, error: rpcErr } = await admin.rpc('evaluate_weekly_leagues');

    if (!rpcErr && rpcRes) {
      return NextResponse.json({
        ok: true,
        source: 'stored_procedure',
        result: rpcRes,
      });
    }

    console.warn('[WeeklyLeagueReset] evaluate_weekly_leagues RPC unavailable, running batch evaluation:', rpcErr?.message);

    // 2. Fallback Batch Evaluation in Node.js — the same rules as the database function: students only,
    //    every move decided from one snapshot (read in pages; the API returns at most 1000 rows at a time).
    const PAGE = 1000;
    const players: LeaguePlayer[] = [];
    const histories = new Map<string, unknown[]>();
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await admin
        .from('users')
        .select('id, league_tier, weekly_xp, xp_total, league_history')
        .or('role.eq.student,role.is.null')
        .in('league_tier', [...LEAGUE_TIERS])
        .order('id', { ascending: true })
        .range(from, from + PAGE - 1);
      if (error) throw error;
      const rows = (data || []) as Array<LeaguePlayer & { league_history: unknown }>;
      for (const u of rows) {
        players.push({ id: u.id, league_tier: u.league_tier, weekly_xp: u.weekly_xp, xp_total: u.xp_total });
        histories.set(u.id, Array.isArray(u.league_history) ? u.league_history : []);
      }
      if (rows.length < PAGE) break;
    }

    const now = new Date().toISOString();
    const moves = planWeeklyLeagueMoves(players);
    let totalPromoted = 0;
    let totalDemoted = 0;
    let failed = 0;
    for (const m of moves) {
      const newHist = [{ timestamp: now, outcome: m.outcome, from: m.from, to: m.to, weekly_xp: m.weekly_xp }, ...(histories.get(m.id) || [])].slice(0, 50);
      const { error } = await admin.from('users').update({ league_tier: m.to, league_history: newHist }).eq('id', m.id);
      if (error) failed++;
      else if (m.outcome === 'promoted') totalPromoted++;
      else totalDemoted++;
    }

    // Reset weekly_xp = 0 and update cycle start
    await admin.from('users').update({ weekly_xp: 0, league_cycle_start: now, last_league_eval: now }).neq('id', '00000000-0000-0000-0000-000000000000');

    return NextResponse.json({
      ok: failed === 0,
      source: 'batch_fallback',
      totalPromoted,
      totalDemoted,
      ...(failed ? { failed } : {}),
      timestamp: now,
    });
  } catch (err: any) {
    console.error('[WeeklyLeagueReset] Cron execution error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Weekly league reset failed' }, { status: 500 });
  }
}
