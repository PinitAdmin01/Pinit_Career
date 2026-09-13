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

    if (!ledgerQueryErr && Array.isArray(todayRecords)) {
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
