import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { grantXp, xpAlreadyGranted } from '@/lib/server/xpGrant';
import {
  PROJECT_MIN_SCORE,
  projectRepoKey,
  projectRewardAmount,
  verifyProjectReward,
} from '@/lib/github/projectReward';

const fail = (status: number, error: string, message: string) => NextResponse.json({ ok: false, error, message }, { status });

/**
 * Grants the XP of a verified project: the repository audit result must be the one the server
 * signed for this student (/api/github/ingest), pass the evidence bar, and each repository is
 * rewarded once. The amount follows the audit (authored or reference), never the browser.
 */
export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const repoKey = projectRepoKey(body.repoUrl);
    const score = typeof body.score === 'number' && Number.isFinite(body.score) ? body.score : NaN;
    const authored = body.authored === true;
    if (!repoKey || Number.isNaN(score)) return fail(400, 'INVALID_REQUEST', 'Verify your repository first.');

    if (!verifyProjectReward({ userId, repoUrl: repoKey, score, authored }, body.rewardToken)) {
      return fail(403, 'AUDIT_NOT_VERIFIED', 'This audit result was not issued by PinIT for your account. Verify the repository again.');
    }
    if (score < PROJECT_MIN_SCORE) {
      return fail(409, 'SCORE_TOO_LOW', `The repository needs an evidence score of ${PROJECT_MIN_SCORE}% (it has ${Math.round(score)}%).`);
    }

    const admin = getSupabaseAdmin();
    const reason = `[project] ${repoKey}`;
    const already = await xpAlreadyGranted(admin, userId, reason);
    if (already === null) return fail(503, 'LEDGER_UNAVAILABLE', 'Could not check your XP history. Please try again.');
    if (already) return NextResponse.json({ ok: true, xpAwarded: 0, alreadyAwarded: true });

    const amount = projectRewardAmount(authored);
    const grant = await grantXp(admin, userId, amount, reason);
    if (!grant.ok) return fail(503, grant.error, grant.message);
    return NextResponse.json({ ok: true, xpAwarded: amount, newXp: grant.newXp, newLevel: grant.newLevel });
  } catch (err: unknown) {
    console.error('[projects/xp] error:', err);
    return fail(500, 'XP_FAILED', 'Could not add the project XP. Please try again.');
  }
}
