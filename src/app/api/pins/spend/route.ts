import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { DAILY_PIN_CAP, spendFromCurrentPinsOnly } from '@/lib/pins/pinWalletRules';

// Server-authoritative cost table — client cannot override these (1 Rs = 10 Pins Economy)
const SERVER_PIN_COSTS: Record<string, number> = {
  quest:                20,
  mission:              20,
  group_discussion:     25,
  gd:                   25,
  ai:                   25, // unlocks /api/llm and general AI features
  ai_interview:         25,
  interview:            25,
  ai_tutor:              5, // AI Code Tutor & Doubt Resolution
  code_arena:           10,
  arena:                10,
  project:              10,
  group_project:        10,
  attention_span_game:   5,
  quest_start:          20,
  resume_enhance:       15,
  career_twin:          30,
  personality_analysis: 10,
  sentinel_fingerprint:  5,
  career_assets:        20,
  career_dna_calc:      10,
  jd_match:              5,
  ai_minutes_extend:   100,
  course_plan_1m:       500,
  course_plan_3m:      1200,
  course_plan_6m:      2200,
  course_plan_9m:      3500,
  course_plan_12m:     4500,
  course_plan_24m:     7500,
};

// Unlock duration in milliseconds
const UNLOCK_DURATION_MS = 30 * 60 * 1000;

const PinSpendSchema = z.object({
  featureKey: z.string().min(1).max(100),
  // itemId narrows the unlock key (e.g. interview:stream:topic) — stored server-side
  itemId: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON payload' }, { status: 400 });
    }

    const { data, error } = validateBody(PinSpendSchema, body);
    if (error) return error;

    const { featureKey, itemId } = data;
    const userId = gated.user!.id;

    // Cost is always determined server-side from the canonical table
    const spendAmount = SERVER_PIN_COSTS[featureKey];
    if (spendAmount === undefined) {
      return NextResponse.json(
        { ok: false, error: 'UNKNOWN_FEATURE', message: `Unknown feature key: ${featureKey}` },
        { status: 400 }
      );
    }

    // SPEND LOOPHOLE DEFENSE:
    // Ensure client cannot spend 5 pins on a cheap feature (e.g. attention_span_game)
    // while passing itemId: 'ai' to unlock expensive AI paywalled routes.
    let unlockKey = featureKey;
    if (itemId) {
      // 1. itemId cannot be another top-level root feature key
      if (SERVER_PIN_COSTS[itemId] !== undefined && itemId !== featureKey) {
        // Special case: aliased feature families (e.g., gd <-> group_discussion, interview <-> ai_interview, arena <-> code_arena, project <-> group_project)
        const isAllowedAlias =
          (featureKey === 'group_discussion' && itemId === 'gd') ||
          (featureKey === 'gd' && itemId === 'group_discussion') ||
          (featureKey === 'interview' && itemId === 'ai_interview') ||
          (featureKey === 'ai_interview' && itemId === 'interview') ||
          (featureKey === 'arena' && itemId === 'code_arena') ||
          (featureKey === 'code_arena' && itemId === 'arena') ||
          (featureKey === 'project' && itemId === 'group_project') ||
          (featureKey === 'group_project' && itemId === 'project');

        if (!isAllowedAlias) {
          return NextResponse.json(
            {
              ok: false,
              error: 'INVALID_ITEM_ID',
              message: `Cannot use itemId '${itemId}' with feature '${featureKey}'.`,
            },
            { status: 400 }
          );
        }
      }

      // 2. Disallow broad AI or Interview master aliases if purchased feature is not AI or Interview
      const BROAD_PROTECTED_KEYS = new Set(['ai', 'ai_interview', 'interview', 'group_discussion', 'gd']);
      if (BROAD_PROTECTED_KEYS.has(itemId) && !BROAD_PROTECTED_KEYS.has(featureKey)) {
        return NextResponse.json(
          {
            ok: false,
            error: 'INVALID_ITEM_ID',
            message: `Feature '${featureKey}' cannot unlock protected item '${itemId}'.`,
          },
          { status: 400 }
        );
      }

      // 3. Namespace unlockKey so sub-items are strictly rooted under featureKey
      if (itemId.startsWith(`${featureKey}:`)) {
        unlockKey = itemId;
      } else if (featureKey === 'group_discussion' && itemId.startsWith('gd:')) {
        unlockKey = itemId;
      } else if (featureKey === 'gd' && itemId.startsWith('gd:')) {
        unlockKey = itemId;
      } else if ((featureKey === 'interview' || featureKey === 'ai_interview') && (itemId.startsWith('interview:') || itemId.startsWith('ai_interview:'))) {
        unlockKey = itemId;
      } else if (itemId === featureKey) {
        unlockKey = featureKey;
      } else {
        unlockKey = `${featureKey}:${itemId}`;
      }
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!url || !serviceKey) {
      // Fail closed — never grant access when env is misconfigured
      return NextResponse.json(
        { ok: false, error: 'SERVICE_UNAVAILABLE', message: 'Payment service not configured.' },
        { status: 503 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Fetch user profile with current daily pins and bonus vault balance
    const { data: userProfile, error: profileErr } = await admin
      .from('users')
      .select('pins, bonus_pins, pin_history, unlocked_items')
      .eq('id', userId)
      .maybeSingle();

    if (profileErr || !userProfile) {
      return NextResponse.json(
        { ok: false, error: 'USER_NOT_FOUND', message: 'User profile not found.' },
        { status: 404 }
      );
    }

    const currentDaily = typeof userProfile.pins === 'number' ? userProfile.pins : 0;
    const currentBonus = typeof userProfile.bonus_pins === 'number' ? userProfile.bonus_pins : 0;

    // STRICT RULE: Every feature usage is paid strictly by Current Pins (`users.pins`), NEVER Bonus Pins (`users.bonus_pins`).
    const spendCheck = spendFromCurrentPinsOnly(currentDaily, currentBonus, spendAmount, DAILY_PIN_CAP);
    if (!spendCheck.ok) {
      const message = spendCheck.canRefillFromBonus
        ? `Need ${spendAmount} Current Pins, but you have ${currentDaily}/${DAILY_PIN_CAP}. Refill Current Pins from your ${currentBonus} Bonus Vault pins first.`
        : `Need ${spendAmount} Current Pins, but you have ${currentDaily}/${DAILY_PIN_CAP}. Daily pins reset to ${DAILY_PIN_CAP} at 1:00 AM IST or buy pins.`;
      return NextResponse.json(
        {
          ok: false,
          error: 'INSUFFICIENT_PINS',
          message,
          currentBalance: currentDaily,
          bonusBalance: currentBonus,
          dailyCap: DAILY_PIN_CAP,
          canRefillFromBonus: spendCheck.canRefillFromBonus,
          refillableAmount: spendCheck.refillableAmount,
        },
        { status: 402 }
      );
    }

    // Deduct strictly from Current Pins (`users.pins`) via atomic `spend_pins` RPC (row-locked, never touches `bonus_pins`).
    const { data: spendRes, error: spendErr } = await admin.rpc('spend_pins', {
      p_user_id: userId,
      p_amount: spendAmount,
      p_reason: `Spend on ${featureKey}`,
    });

    if (spendErr) {
      console.error('[Pin Spend] RPC Error:', spendErr.message);
      return NextResponse.json(
        { ok: false, error: 'DATABASE_ERROR', message: 'Could not process pin deduction.' },
        { status: 500 }
      );
    }

    if (!spendRes?.ok) {
      const liveCurrent = typeof spendRes?.current_balance === 'number' ? spendRes.current_balance : currentDaily;
      const liveCheck = spendFromCurrentPinsOnly(liveCurrent, currentBonus, spendAmount, DAILY_PIN_CAP);
      return NextResponse.json(
        {
          ok: false,
          error: spendRes?.reason || 'INSUFFICIENT_PINS',
          message: liveCheck.canRefillFromBonus
            ? `Need ${spendAmount} Current Pins, but you have ${liveCurrent}/${DAILY_PIN_CAP}. Refill Current Pins from your ${currentBonus} Bonus Vault pins first.`
            : `Need ${spendAmount} Current Pins, but you have ${liveCurrent}/${DAILY_PIN_CAP}.`,
          currentBalance: liveCurrent,
          bonusBalance: currentBonus,
          canRefillFromBonus: liveCheck.canRefillFromBonus,
          refillableAmount: liveCheck.refillableAmount,
        },
        { status: 402 }
      );
    }

    const newDaily = typeof spendRes.new_balance === 'number' ? spendRes.new_balance : spendCheck.newPins;
    const newBonus = currentBonus;

    // Write unlocked_items server-side — the browser is never allowed to write this column
    const expiresAt = Date.now() + UNLOCK_DURATION_MS;
    const current: Record<string, number> =
      userProfile?.unlocked_items && typeof userProfile.unlocked_items === 'object'
        ? (userProfile.unlocked_items as Record<string, number>)
        : {};

    const { error: updateErr } = await admin
      .from('users')
      .update({ unlocked_items: { ...current, [unlockKey]: expiresAt } })
      .eq('id', userId);

    if (updateErr) {
      // Best-effort refund to restore current pins (bonus_pins was never modified)
      try {
        await admin
          .from('users')
          .update({ pins: currentDaily })
          .eq('id', userId);
      } catch { /* best-effort refund */ }
      console.error('[Pin Spend] Unlock write failed:', updateErr.message);
      return NextResponse.json(
        { ok: false, error: 'UNLOCK_WRITE_FAILED', message: 'Feature could not be unlocked. Pins were not charged.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      spent: spendAmount,
      newBalance: newDaily,
      newBonusBalance: newBonus,
      totalBalance: newDaily + newBonus,
      featureKey,
      unlockKey,
      expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
