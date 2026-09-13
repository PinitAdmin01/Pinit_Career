import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-Authoritative Feature Grace Extension Endpoint (DEF-044).
 * Prevents client-side tampering (e.g. deleting localStorage grace flag)
 * by verifying and recording grace claims in public.feature_grace_claims.
 * Strictly limits grace extensions to exactly once per 30-minute unlock cycle.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const itemKey = typeof body?.itemKey === 'string' ? body.itemKey.trim() : '';
    const rawMinutes = Number(body?.minutes);
    const minutes = Number.isFinite(rawMinutes)
      ? Math.min(15, Math.max(5, Math.floor(rawMinutes)))
      : 15;

    if (!itemKey) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_ITEM_KEY', message: 'A valid itemKey must be provided.' },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      console.error('[Extend Grace] Supabase credentials missing');
      return NextResponse.json(
        { ok: false, error: 'DATABASE_UNAVAILABLE', message: 'Database credentials missing.' },
        { status: 503 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const userId = gated.user!.id;

    // 1. Fetch user's current unlocked_items
    const { data: userRecord, error: fetchErr } = await admin
      .from('users')
      .select('id, unlocked_items')
      .eq('id', userId)
      .maybeSingle();

    if (fetchErr || !userRecord) {
      return NextResponse.json(
        { ok: false, error: 'USER_NOT_FOUND', message: 'User record could not be retrieved.' },
        { status: 404 }
      );
    }

    const unlockedItems: Record<string, number> = userRecord.unlocked_items || {};
    const currentExpiresAt = unlockedItems[itemKey];

    if (typeof currentExpiresAt !== 'number') {
      return NextResponse.json(
        { ok: false, error: 'ITEM_NOT_ACTIVE', message: 'Item is not currently active.' },
        { status: 400 }
      );
    }

    const now = Date.now();

    // Check if grace claim window has already expired (more than 5 minutes past expiration)
    if (currentExpiresAt < now - 5 * 60 * 1000) {
      return NextResponse.json(
        {
          ok: false,
          error: 'ITEM_EXPIRED_WINDOW_CLOSED',
          message: 'Grace period claim window has closed (more than 5 minutes past expiration).',
        },
        { status: 400 }
      );
    }

    // 2. Check if grace was already claimed for this active unlock session
    const { data: existingClaim } = await admin
      .from('feature_grace_claims')
      .select('id, new_expires_at')
      .eq('user_id', userId)
      .eq('item_key', itemKey)
      .gte('new_expires_at', currentExpiresAt)
      .maybeSingle();

    if (existingClaim) {
      return NextResponse.json(
        {
          ok: false,
          error: 'GRACE_ALREADY_CLAIMED',
          message: 'Emergency grace can only be claimed once per 30-minute unlock cycle.',
          newRemainingSec: Math.max(0, Math.ceil((currentExpiresAt - now) / 1000)),
        },
        { status: 409 }
      );
    }

    const newExpiresAt = Math.max(currentExpiresAt, now) + minutes * 60 * 1000;
    const cycleId = `cycle_${newExpiresAt}`;

    // 3. Atomically record grace claim to prevent concurrent replay
    const { error: claimErr } = await admin
      .from('feature_grace_claims')
      .insert({
        user_id: userId,
        item_key: itemKey,
        cycle_id: cycleId,
        new_expires_at: newExpiresAt,
      });

    if (claimErr) {
      // If duplicate key error (23505), someone claimed concurrently
      if ((claimErr as any).code === '23505' || claimErr.message?.includes('duplicate')) {
        return NextResponse.json(
          {
            ok: false,
            error: 'GRACE_ALREADY_CLAIMED',
            message: 'Emergency grace can only be claimed once per 30-minute unlock cycle.',
          },
          { status: 409 }
        );
      }

      console.error('[Extend Grace] Failed to record claim:', claimErr.message);
      return NextResponse.json(
        { ok: false, error: 'CLAIM_RECORDING_FAILED', message: 'Failed to record grace claim.' },
        { status: 500 }
      );
    }

    // 4. Update user's unlocked_items in Supabase
    const nextUnlocked = { ...unlockedItems, [itemKey]: newExpiresAt };
    const { error: updateErr } = await admin
      .from('users')
      .update({ unlocked_items: nextUnlocked })
      .eq('id', userId);

    if (updateErr) {
      console.error('[Extend Grace] Failed to update unlocked_items:', updateErr.message);
      return NextResponse.json(
        { ok: false, error: 'UPDATE_FAILED', message: 'Failed to update item expiration in database.' },
        { status: 500 }
      );
    }

    const newRemainingSec = Math.ceil((newExpiresAt - Date.now()) / 1000);

    return NextResponse.json({
      ok: true,
      newExpiresAt,
      newRemainingSec,
      minutesGranted: minutes,
      message: `Emergency grace applied: +${minutes} minutes granted.`,
    });
  } catch (err: any) {
    console.error('[Extend Grace] Internal Error:', err);
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR', message: err?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
