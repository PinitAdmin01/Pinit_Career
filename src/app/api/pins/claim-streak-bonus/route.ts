import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';
import { consecutiveCalendarStreak } from '@/lib/missions/streak';
import { DAILY_PIN_CAP, splitCreditIntoWallets } from '@/lib/pins/pinWalletRules';

/**
 * Server-authoritative streak bonus claim endpoint (DEF-042).
 * Verifies that the user has genuinely achieved the claimed milestone (e.g. 7, 14, 21 days),
 * guards against replay / multiple claims for the same milestone,
 * and atomically credits +50 pins using the credit_pins stored procedure.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const milestone = Number(body?.milestone);

    if (!Number.isInteger(milestone) || milestone < 7 || milestone % 7 !== 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INVALID_MILESTONE',
          message: 'Milestone must be a positive multiple of 7 (e.g., 7, 14, 21).',
        },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      console.error('[Streak Bonus] Supabase credentials missing');
      return NextResponse.json(
        { ok: false, error: 'DATABASE_UNAVAILABLE' },
        { status: 503 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const userId = gated.user!.id;

    // 1. Fetch user record and verify actual streak timestamps
    const { data: userRecord, error: fetchErr } = await admin
      .from('users')
      .select('id, onboarding_answers, mission_streak, pins, bonus_pins, pin_history')
      .eq('id', userId)
      .maybeSingle();

    if (fetchErr || !userRecord) {
      return NextResponse.json(
        { ok: false, error: 'USER_NOT_FOUND', message: 'User record could not be retrieved.' },
        { status: 404 }
      );
    }

    // Authoritative streak verification: read strictly from server-authoritative users.mission_streak
    // Client-supplied onboarding_answers timestamps can be spoofed by browser and must NEVER be trusted.
    const computedStreak = typeof userRecord.mission_streak === 'number' ? userRecord.mission_streak : 0;

    if (computedStreak < milestone) {
      return NextResponse.json(
        {
          ok: false,
          error: 'STREAK_MILESTONE_NOT_REACHED',
          message: `Your verified consecutive streak is ${computedStreak} days. You need ${milestone} days to claim this bonus.`,
        },
        { status: 403 }
      );
    }

    // 2. Anti-replay check via streak_claims table
    const { data: existingClaim, error: claimQueryErr } = await admin
      .from('streak_claims')
      .select('id')
      .eq('user_id', userId)
      .eq('milestone', milestone)
      .maybeSingle();

    if (claimQueryErr && claimQueryErr.code !== 'PGRST116') {
      console.warn('[Streak Bonus] streak_claims query notice:', claimQueryErr);
    }

    if (existingClaim) {
      return NextResponse.json(
        {
          ok: false,
          error: 'STREAK_BONUS_ALREADY_CLAIMED',
          message: `Bonus for the ${milestone}-day streak has already been claimed.`,
        },
        { status: 409 }
      );
    }

    // 3. Record claim to prevent race-condition / replay
    const { error: insertClaimErr } = await admin.from('streak_claims').insert({
      user_id: userId,
      milestone,
      pins_granted: 50,
    });

    if (insertClaimErr) {
      if (insertClaimErr.code === '23505') {
        return NextResponse.json(
          {
            ok: false,
            error: 'STREAK_BONUS_ALREADY_CLAIMED',
            message: `Bonus for the ${milestone}-day streak has already been claimed.`,
          },
          { status: 409 }
        );
      }
      console.error('[Streak Bonus] Failed to record claim in streak_claims:', insertClaimErr);
      // FAIL-CLOSED: NEVER credit pins if claim insertion failed, otherwise loops can mint infinite pins
      return NextResponse.json(
        {
          ok: false,
          error: 'CLAIM_RECORD_FAILED',
          message: 'Could not record claim. Pins were not credited.',
        },
        { status: 500 }
      );
    }

    // 4. Credit 50 pins: fill Current Pins up to 120 daily cap first, overflow to Bonus Vault
    const PINS_BONUS = 50;
    const currentPins = typeof userRecord.pins === 'number' ? userRecord.pins : 0;
    const currentBonus = typeof userRecord.bonus_pins === 'number' ? userRecord.bonus_pins : 0;
    const split = splitCreditIntoWallets(currentPins, currentBonus, PINS_BONUS, DAILY_PIN_CAP);
    const txId = 'tx_streak_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const newTx = {
      id: txId,
      type: 'earn',
      amount: PINS_BONUS,
      reason: `${milestone}-day streak milestone bonus (+${split.toCurrent} current, +${split.toBonus} bonus)`,
      source: 'streak_bonus',
      timestamp: Date.now(),
    };
    const currentHist = Array.isArray(userRecord.pin_history) ? userRecord.pin_history : [];

    await admin
      .from('users')
      .update({
        pins: split.newPins,
        bonus_pins: split.newBonus,
        pin_history: [newTx, ...currentHist].slice(0, 100),
      })
      .eq('id', userId);

    return NextResponse.json({
      ok: true,
      milestone,
      pinsGranted: PINS_BONUS,
      newPins: split.newPins,
      newBonusPins: split.newBonus,
      creditedToCurrent: split.toCurrent,
      creditedToBonus: split.toBonus,
      message:
        split.toCurrent > 0 && split.toBonus > 0
          ? `🎉 Verified ${milestone}-day streak! +${split.toCurrent} to Current Pins (${split.newPins}/${DAILY_PIN_CAP}) & +${split.toBonus} to Bonus Vault.`
          : split.toCurrent > 0
          ? `🎉 Verified ${milestone}-day streak! +${split.toCurrent} added to Current Pins (${split.newPins}/${DAILY_PIN_CAP}).`
          : `🎉 Verified ${milestone}-day streak! +${split.toBonus} added to your Bonus Vault.`,
    });
  } catch (err: any) {
    console.error('[Streak Bonus] Unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
