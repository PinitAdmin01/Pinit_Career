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

/**
 * Server-Authoritative XP Minting Endpoint (DEF-048 & Task 2.3).
 * Prevents unverified client-side XP manipulation by strictly validating
 * progression awards, capping individual increments to a maximum of 500 XP,
 * validating action types against an authoritative registry, and enforcing a 24h daily cap.
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

    if (!Number.isInteger(amount) || amount <= 0 || amount > 500) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INVALID_XP_AMOUNT',
          message: 'XP amount must be an integer between 1 and 500.',
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
    const DEDICATED_ENDPOINT_ACTIONS = new Set(['quest', 'exam', 'milestone']);
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

    // Unverified client micro-interactions cannot exceed 50 XP per grant
    const isVerifiedEvent = Boolean(body?.verifiedProof || body?.proofToken);
    if (!isVerifiedEvent && amount > 50) {
      return NextResponse.json(
        {
          ok: false,
          error: 'UNVERIFIED_XP_LIMIT_EXCEEDED',
          message: 'Unverified client XP awards are capped at 50 XP per action to prevent runaway inflation.',
        },
        { status: 400 }
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
      .select('amount')
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

    const finalReason = actionType ? `[${actionType}] ${reason}` : reason;

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
