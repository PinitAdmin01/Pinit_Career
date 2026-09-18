import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getAttentionLeaderboard, addAttentionAccuracy, sanitizeDisplayName } from '@/lib/attention/progress';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  totalAccuracy: number;
  gamesPlayed?: number;
  lastActive?: string;
  rank?: number;
}

/**
 * GET /api/attention-span/leaderboard
 * Returns top leaderboard players with sanitized display names (Zero email/PII leakage).
 * Computes userRank strictly for the authenticated caller, rejecting arbitrary ?userId= probes.
 */
export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const currentUserId = gated.user!.id;
    const result = await getAttentionLeaderboard(currentUserId);

    return NextResponse.json({
      ok: true,
      leaders: result.leaders,
      userRank: result.userRank,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

/**
 * POST /api/attention-span/leaderboard
 * Submits accuracy points earned in game.
 * Rate-limited to prevent automated score farming (+100 spam).
 * Sanitizes display names to eliminate raw email addresses.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const ip = getClientIp(req);

    // Rate-limit submissions to prevent script-driven score inflation
    const rl = checkRateLimit(`attention_leaderboard_${userId}_${ip}`, { limit: 15, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Rate limit exceeded. Please wait before submitting more scores.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawScore = body.accuracyEarned !== undefined ? body.accuracyEarned : body.accuracyPoints;
    const earned = Math.min(100, Math.max(0, Math.round(Number(rawScore) || 0)));

    // Extract genuine non-PII display name (NEVER fallback to raw email address)
    const userMeta = (gated.user as any).user_metadata || {};
    const candidateName = userMeta.full_name ||
      userMeta.name ||
      userMeta.display_name ||
      (gated.user as any).display_name ||
      (gated.user as any).name ||
      body.displayName ||
      (gated.user!.email ? gated.user!.email.split('@')[0] : 'Student');

    const cleanDisplayName = sanitizeDisplayName(candidateName);

    const result = await addAttentionAccuracy(userId, cleanDisplayName, earned);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      addedAccuracy: earned,
      newTotalAccuracy: result.newTotalAccuracy,
      userRank: result.userRank,
      leaders: result.leaders,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Failed to submit accuracy' }, { status: 500 });
  }
}
