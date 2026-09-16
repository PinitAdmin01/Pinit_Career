import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

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

    // 2. Fallback Batch Evaluation in Node.js
    const TIERS: ('browns' | 'silver' | 'gold' | 'platinum' | 'ruby')[] = ['ruby', 'platinum', 'gold', 'silver', 'browns'];
    const NEXT_MAP: Record<string, string> = {
      browns: 'silver',
      silver: 'gold',
      gold: 'platinum',
      platinum: 'ruby',
      ruby: 'ruby',
    };
    const PREV_MAP: Record<string, string> = {
      ruby: 'platinum',
      platinum: 'gold',
      gold: 'silver',
      silver: 'browns',
      browns: 'browns',
    };

    let totalPromoted = 0;
    let totalDemoted = 0;
    const now = new Date().toISOString();

    for (const tier of TIERS) {
      const { data: cohort } = await admin
        .from('users')
        .select('id, weekly_xp, xp_total, league_history')
        .eq('league_tier', tier)
        .order('weekly_xp', { ascending: false })
        .order('xp_total', { ascending: false });

      if (cohort && cohort.length >= 2) {
        const count = cohort.length;
        const promCutoff = Math.max(1, Math.ceil(count * 0.10));
        const demCutoff = Math.max(1, count - Math.floor(count * 0.10) + 1);

        // Promotions
        if (NEXT_MAP[tier] !== tier) {
          const promoting = cohort.slice(0, promCutoff);
          for (const u of promoting) {
            const hist = Array.isArray(u.league_history) ? u.league_history : [];
            const newHist = [{ timestamp: now, outcome: 'promoted', from: tier, to: NEXT_MAP[tier], weekly_xp: u.weekly_xp }, ...hist].slice(0, 50);
            await admin.from('users').update({ league_tier: NEXT_MAP[tier], league_history: newHist }).eq('id', u.id);
            totalPromoted++;
          }
        }

        // Demotions
        if (PREV_MAP[tier] !== tier && demCutoff > promCutoff) {
          const demoting = cohort.slice(demCutoff - 1);
          for (const u of demoting) {
            const hist = Array.isArray(u.league_history) ? u.league_history : [];
            const newHist = [{ timestamp: now, outcome: 'demoted', from: tier, to: PREV_MAP[tier], weekly_xp: u.weekly_xp }, ...hist].slice(0, 50);
            await admin.from('users').update({ league_tier: PREV_MAP[tier], league_history: newHist }).eq('id', u.id);
            totalDemoted++;
          }
        }
      }
    }

    // Reset weekly_xp = 0 and update cycle start
    await admin.from('users').update({ weekly_xp: 0, league_cycle_start: now, last_league_eval: now }).neq('id', '00000000-0000-0000-0000-000000000000');

    return NextResponse.json({
      ok: true,
      source: 'batch_fallback',
      totalPromoted,
      totalDemoted,
      timestamp: now,
    });
  } catch (err: any) {
    console.error('[WeeklyLeagueReset] Cron execution error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Weekly league reset failed' }, { status: 500 });
  }
}
