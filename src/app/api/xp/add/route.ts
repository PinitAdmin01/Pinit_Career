import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';

// Authoritative Action Type Registry (Task 2.3)
export const VALID_ACTION_TYPES = new Set([
  'quest',
  'mission',
  'interview',
  'gd',
  'group_discussion',
  'attention_game',
  'project',
  'study_session',
  'exam',
  'milestone',
  'general',
  'quiz',
  'lesson',
  'challenge',
]);

// Maximum cumulative XP a student can earn per 24-hour window to prevent runaway loops
export const DAILY_XP_MAX_CAP = 3000;
/** XP the browser may report for one small activity (the server cannot check these). */
export const CLIENT_XP_MAX_PER_AWARD = 50;
/** XP the browser may report per UTC day in total. */
export const CLIENT_XP_DAILY_CAP = 500;
const CLIENT_REASON_PREFIX = '[client';

/**
 * XP for small activities the browser reports (reading, practice, focus games…). The server cannot
 * verify these, so each award is at most 50 XP and at most 500 XP a day. Activities the server can
 * verify grant their own XP where they are checked (quests: /api/quest/complete, interviews:
 * /api/interview/evaluate, projects: /api/projects/xp); there is no "proof" field that lifts the limit.
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`xp_${ip}`, { limit: 60, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount);
    const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 200) : 'XP Award';
    const actionType = typeof body?.actionType === 'string' ? body.actionType.trim().toLowerCase() : null;

    if (!Number.isInteger(amount) || amount <= 0 || amount > CLIENT_XP_MAX_PER_AWARD) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INVALID_XP_AMOUNT',
          message: `XP amount must be an integer between 1 and ${CLIENT_XP_MAX_PER_AWARD}. Larger rewards are granted by the activity's own verification.`,
        },
        { status: 400 }
      );
    }

    if (actionType && !VALID_ACTION_TYPES.has(actionType)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INVALID_ACTION_TYPE',
          message: `Action type '${actionType}' is not recognized. Allowed types: ${Array.from(VALID_ACTION_TYPES).join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Dedicated Authoritative Endpoints Protection:
    // Quests, exams, and milestones MUST be awarded through their respective
    // authoritative verification endpoints (/api/quest/complete, /api/code/run-java, /api/user/award-badge).
    const DEDICATED_ENDPOINT_ACTIONS = new Set(['quest', 'exam', 'milestone', 'interview', 'project']);
    if (actionType && DEDICATED_ENDPOINT_ACTIONS.has(actionType)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'DEDICATED_ENDPOINT_REQUIRED',
          message: `XP for '${actionType}' cannot be directly minted via /api/xp/add. You must complete the activity through its dedicated verification endpoint.`,
        },
        { status: 403 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      console.error('[XP Add] Supabase credentials missing');
      return NextResponse.json(
        { ok: false, error: 'DATABASE_UNAVAILABLE', message: 'Database credentials missing.' },
        { status: 503 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const userId = gated.user!.id;

    // Enforce 24h Daily XP Cap (Task 2.3)
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const { data: todayRecords, error: ledgerQueryErr } = await admin
      .from('xp_ledger')
      .select('amount, reason')
      .eq('user_id', userId)
      .gte('created_at', startOfDay.toISOString());

    // Fail-closed defense: If ledger cannot be queried, do NOT grant XP
    if (ledgerQueryErr) {
      console.error('[XP Add] Failed to query xp_ledger for daily cap:', ledgerQueryErr.message);
      return NextResponse.json(
        { ok: false, error: 'LEDGER_QUERY_FAILED', message: 'Unable to verify daily XP limits. Request refused.' },
        { status: 503 }
      );
    }

    if (Array.isArray(todayRecords)) {
      const clientToday = todayRecords
        .filter((r) => typeof r.reason === 'string' && r.reason.startsWith(CLIENT_REASON_PREFIX))
        .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
      if (clientToday + amount > CLIENT_XP_DAILY_CAP) {
        return NextResponse.json(
          {
            ok: false,
            error: 'CLIENT_XP_DAILY_LIMIT',
            message: `You have reached today's ${CLIENT_XP_DAILY_CAP} XP limit for practice activities. Quests, interviews and projects still earn XP.`,
            todayTotal: clientToday,
            dailyCap: CLIENT_XP_DAILY_CAP,
          },
          { status: 429 }
        );
      }
      const todayTotal = todayRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
      if (todayTotal + amount > DAILY_XP_MAX_CAP) {
        return NextResponse.json(
          {
            ok: false,
            error: 'DAILY_XP_LIMIT_EXCEEDED',
            message: `Daily XP limit of ${DAILY_XP_MAX_CAP} exceeded for user. Today earned: ${todayTotal} XP.`,
            todayTotal,
            dailyCap: DAILY_XP_MAX_CAP,
          },
          { status: 429 }
        );
      }
    }

    const finalReason = `${CLIENT_REASON_PREFIX}:${actionType || 'general'}] ${reason}`;

    const { data: rpcRes, error: rpcErr } = await admin.rpc('increment_xp', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: finalReason,
    });

    if (rpcErr) {
      console.error('[XP Add] increment_xp RPC error:', rpcErr.message);
      return NextResponse.json(
        { ok: false, error: 'RPC_FAILED', message: rpcErr.message },
        { status: 500 }
      );
    }

    if (!rpcRes?.ok) {
      return NextResponse.json(
        { ok: false, error: rpcRes?.reason || 'XP_INCREMENT_REJECTED', message: rpcRes?.message || 'XP increment rejected.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      newXp: rpcRes.new_xp,
      newLevel: rpcRes.new_level,
      amountAdded: amount,
      reason,
    });
  } catch (err: any) {
    console.error('[XP Add] Internal Error:', err);
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR', message: err?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
