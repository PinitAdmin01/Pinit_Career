import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-Authoritative Prestige Badge & Milestone Endpoint (DEF-049).
 * Prevents multiple XP awards for the same milestone by tracking awarded
 * prestige badges in public.user_milestones and awarding the +500 XP bonus
 * strictly once per milestone lifecycle.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const badgeId = typeof body?.badgeId === 'string' ? body.badgeId.trim() : '';
    const milestoneKey = typeof body?.milestoneKey === 'string' ? body.milestoneKey.trim() : '';

    if (!badgeId || !milestoneKey) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INVALID_BADGE_PARAMS',
          message: 'Both badgeId and milestoneKey must be provided.',
        },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !serviceKey) {
      console.error('[Award Badge] Supabase credentials missing');
      return NextResponse.json(
        { ok: false, error: 'DATABASE_UNAVAILABLE', message: 'Database credentials missing.' },
        { status: 503 }
      );
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const userId = gated.user!.id;

    const { data: rpcRes, error: rpcErr } = await admin.rpc('award_prestige_badge', {
      p_user_id: userId,
      p_badge_id: badgeId,
      p_milestone_key: milestoneKey,
    });

    if (rpcErr) {
      console.error('[Award Badge] award_prestige_badge RPC error:', rpcErr.message);
      return NextResponse.json(
        { ok: false, error: 'RPC_FAILED', message: rpcErr.message },
        { status: 500 }
      );
    }

    if (!rpcRes?.ok) {
      return NextResponse.json(
        { ok: false, error: rpcRes?.reason || 'BADGE_AWARD_FAILED', message: rpcRes?.message || 'Badge award failed.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      newlyAwarded: rpcRes.newly_awarded === true,
      xpGranted: rpcRes.xp_granted ?? 0,
      badgeId,
      newXp: rpcRes.new_xp,
      newLevel: rpcRes.new_level,
      message: rpcRes.newly_awarded
        ? `Prestige milestone unlocked: ${badgeId}! +500 XP granted.`
        : 'Prestige milestone has already been claimed.',
    });
  } catch (err: any) {
    console.error('[Award Badge] Internal Error:', err);
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR', message: err?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
