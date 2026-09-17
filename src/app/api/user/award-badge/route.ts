import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';
import { getRegisteredMilestone } from '@/lib/badges/badgeRegistry';

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

    // Authoritative Badge & Milestone Registry Validation
    const registeredMilestone = getRegisteredMilestone(milestoneKey);
    if (!registeredMilestone || registeredMilestone.badgeId !== badgeId) {
      return NextResponse.json(
        {
          ok: false,
          error: 'UNREGISTERED_BADGE',
          message: `Badge '${badgeId}' or milestone '${milestoneKey}' is not recognized in the authoritative registry.`,
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

    // Verify student eligibility from actual profile state
    const { data: userProfile, error: userErr } = await admin
      .from('users')
      .select('id, trust_score, mission_streak, completed_quests, interviews_done, badges')
      .eq('id', userId)
      .maybeSingle();

    if (userErr) {
      console.error('[Award Badge] Failed to fetch user profile:', userErr.message);
      return NextResponse.json(
        { ok: false, error: 'PROFILE_VERIFICATION_FAILED', message: 'Could not verify student milestone requirements.' },
        { status: 500 }
      );
    }

    const eligibility = registeredMilestone.verify(userProfile || {});
    if (!eligibility.eligible) {
      return NextResponse.json(
        {
          ok: false,
          error: 'MILESTONE_REQUIREMENTS_NOT_MET',
          message: eligibility.reason || 'Prerequisites for this prestige badge have not been met.',
        },
        { status: 403 }
      );
    }

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
