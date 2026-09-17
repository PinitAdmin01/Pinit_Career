import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Server-authoritative cost table — client cannot override these
const SERVER_PIN_COSTS: Record<string, number> = {
  quest:                20,
  mission:              20,
  group_discussion:     30,
  gd:                   30,
  ai:                   40, // unlocks /api/llm and general AI features
  ai_interview:         40,
  interview:            40,
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
        // Special case: aliased feature families (e.g., gd <-> group_discussion, interview <-> ai_interview)
        const isAllowedAlias =
          (featureKey === 'group_discussion' && itemId === 'gd') ||
          (featureKey === 'gd' && itemId === 'group_discussion') ||
          (featureKey === 'interview' && itemId === 'ai_interview') ||
          (featureKey === 'ai_interview' && itemId === 'interview');

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
      return NextResponse.json(
        { ok: false, error: spendRes?.reason || 'INSUFFICIENT_PINS', currentBalance: spendRes?.current_balance ?? 0 },
        { status: 402 }
      );
    }

    // Write unlocked_items server-side — the browser is never allowed to write this column
    const expiresAt = Date.now() + UNLOCK_DURATION_MS;
    const { data: profileData } = await admin
      .from('users')
      .select('unlocked_items')
      .eq('id', userId)
      .maybeSingle();

    const current: Record<string, number> =
      profileData?.unlocked_items && typeof profileData.unlocked_items === 'object'
        ? (profileData.unlocked_items as Record<string, number>)
        : {};

    const { error: updateErr } = await admin
      .from('users')
      .update({ unlocked_items: { ...current, [unlockKey]: expiresAt } })
      .eq('id', userId);

    if (updateErr) {
      // Pins were deducted; refund them so the student isn't charged for nothing.
      try {
        await admin.rpc('credit_pins', {
          p_user_id: userId,
          p_amount: spendAmount,
          p_reason: `Refund: unlock write failed for ${featureKey}`,
          p_source: 'admin_grant',
        });
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
      newBalance: spendRes.new_balance,
      featureKey,
      unlockKey,
      expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
