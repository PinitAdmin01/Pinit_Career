import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

// Concurrency mutex per user to prevent parallel race conditions on daily quota
const activeUserPurchases = new Set<string>();

/**
 * Server-Authoritative AI Minutes Purchase Endpoint (DEF-046).
 * Enforces a strict daily cap of maximum 2 purchases (60 minutes total) per day,
 * atomically deducts 100 pins via purchase_ai_minutes / spend_pins RPC,
 * and records authoritative unlocked_items server-side for paywall verification.
 */
export async function POST(req: Request) {
  let userId: string | null = null;
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      console.error('[Buy AI Minutes] Supabase credentials missing');
      return NextResponse.json(
        { ok: false, error: 'DATABASE_UNAVAILABLE', message: 'Database credentials missing.' },
        { status: 503 }
      );
    }

    userId = gated.user!.id;

    // Concurrency defense: prevent parallel requests from simultaneously bypassing the daily check
    if (activeUserPurchases.has(userId)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'CONCURRENT_PURCHASE_IN_PROGRESS',
          message: 'A purchase request for your account is currently in flight. Please wait.',
        },
        { status: 429 }
      );
    }
    activeUserPurchases.add(userId);

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const cost = 100;
    const minutesToGrant = 30;

    // 1. Try atomic stored procedure purchase_ai_minutes first
    let newBalance: number | null = null;
    let purchasesToday = 0;

    const { data: rpcPurchase, error: rpcPurchaseErr } = await admin.rpc('purchase_ai_minutes', {
      p_user_id: userId,
      p_cost: cost,
      p_minutes: minutesToGrant,
    });

    if (!rpcPurchaseErr && rpcPurchase) {
      if (!rpcPurchase.ok) {
        const reason = rpcPurchase.reason || 'PURCHASE_REJECTED';
        const status =
          reason === 'DAILY_AI_MINUTES_LIMIT_EXCEEDED' ? 429 :
          reason === 'INSUFFICIENT_PINS' ? 402 : 400;
        return NextResponse.json(
          {
            ok: false,
            error: reason,
            message:
              reason === 'DAILY_AI_MINUTES_LIMIT_EXCEEDED'
                ? 'Maximum 2 AI extensions (60 minutes total) allowed per day.'
                : reason === 'INSUFFICIENT_PINS'
                ? 'Insufficient pins balance to purchase AI minutes.'
                : 'Purchase was rejected.',
            currentBalance: rpcPurchase.current_balance,
            purchasesToday: rpcPurchase.purchases_today,
            maxAllowed: rpcPurchase.max_allowed ?? 2,
          },
          { status }
        );
      }
      newBalance = rpcPurchase.new_balance;
      purchasesToday = rpcPurchase.purchases_today ?? 1;
    } else {
      // 2. Fallback execution path with strict serialized checks
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);

      const { count, error: countErr } = await admin
        .from('ai_minutes_purchases')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('purchased_at', startOfDay.toISOString());

      if (countErr) {
        console.error('[Buy AI Minutes] Failed to check daily purchases:', countErr.message);
        return NextResponse.json(
          { ok: false, error: 'DATABASE_ERROR', message: 'Failed to verify daily purchase quota.' },
          { status: 500 }
        );
      }

      purchasesToday = count ?? 0;
      if (purchasesToday >= 2) {
        return NextResponse.json(
          {
            ok: false,
            error: 'DAILY_AI_MINUTES_LIMIT_EXCEEDED',
            message: 'Maximum 2 AI extensions (60 minutes total) allowed per day.',
            purchasesToday,
            maxAllowed: 2,
          },
          { status: 429 }
        );
      }

      const { data: spendRes, error: spendErr } = await admin.rpc('spend_pins', {
        p_user_id: userId,
        p_amount: cost,
        p_reason: `Extended daily AI by ${minutesToGrant} mins`,
      });

      if (spendErr) {
        console.error('[Buy AI Minutes] spend_pins RPC failed:', spendErr.message);
        return NextResponse.json(
          { ok: false, error: 'RPC_FAILED', message: spendErr.message },
          { status: 500 }
        );
      }

      if (!spendRes?.ok) {
        const reason = spendRes?.reason || 'INSUFFICIENT_PINS';
        const status = reason === 'INSUFFICIENT_PINS' ? 402 : 400;
        return NextResponse.json(
          {
            ok: false,
            error: reason,
            message: reason === 'INSUFFICIENT_PINS'
              ? 'Insufficient pins balance to purchase AI minutes.'
              : 'Pin deduction was rejected.',
            currentBalance: spendRes?.current_balance ?? 0,
            requiredCost: cost,
          },
          { status }
        );
      }

      newBalance = spendRes.new_balance;

      const { error: insertErr } = await admin
        .from('ai_minutes_purchases')
        .insert({
          user_id: userId,
          minutes: minutesToGrant,
          cost_pins: cost,
        });

      if (insertErr) {
        console.error('[Buy AI Minutes] Audit log insert failed:', insertErr.message);
      }
      purchasesToday += 1;
    }

    // 3. Persist authoritative unlocked_items server-side
    // This connects the purchase directly to requireAuth.verifyPaywallAccess ('ai' & 'ai_minutes_extend')
    const { data: userProfile } = await admin
      .from('users')
      .select('unlocked_items')
      .eq('id', userId)
      .maybeSingle();

    const current: Record<string, number> =
      userProfile?.unlocked_items && typeof userProfile.unlocked_items === 'object'
        ? (userProfile.unlocked_items as Record<string, number>)
        : {};

    const now = Date.now();
    const durationMs = minutesToGrant * 60 * 1000;
    const currentAiExpiry = typeof current['ai'] === 'number' && current['ai'] > now ? current['ai'] : now;
    const newAiExpiry = currentAiExpiry + durationMs;

    await admin
      .from('users')
      .update({
        unlocked_items: {
          ...current,
          ai: newAiExpiry,
          ai_minutes_extend: newAiExpiry,
        },
      })
      .eq('id', userId);

    return NextResponse.json({
      ok: true,
      minutesAdded: minutesToGrant,
      purchasesToday,
      remainingPurchasesToday: Math.max(0, 2 - purchasesToday),
      newBalance,
      expiresAt: newAiExpiry,
      message: `+${minutesToGrant} AI Minutes added to your daily balance.`,
    });
  } catch (err: any) {
    console.error('[Buy AI Minutes] Internal Error:', err);
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR', message: err?.message || 'Internal server error.' },
      { status: 500 }
    );
  } finally {
    if (userId) {
      activeUserPurchases.delete(userId);
    }
  }
}
