import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user?.id) {
      return gated.error || NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const userId = gated.user.id;
    const admin = getSupabaseAdmin();

    const [{ data: profile }, { data: vaultRows }] = await Promise.all([
      admin
        .from('users')
        .select('completed_quests, missions_completed, mission_streak, interviews_done, trust_score')
        .eq('id', userId)
        .maybeSingle(),
      admin
        .from('vault_items')
        .select('id, verified')
        .eq('user_id', userId)
        .eq('verified', true),
    ]);

    const verifiedVaultCount = Array.isArray(vaultRows) ? vaultRows.length : 0;
    const questsCount = Array.isArray(profile?.completed_quests) ? profile.completed_quests.length : 0;
    const missionsCount = Number(profile?.missions_completed) || 0;
    const interviewsCount = Number(profile?.interviews_done) || 0;
    const streak = Number(profile?.mission_streak) || 0;

    const vaultEvidence = Math.min(100, verifiedVaultCount * 25);
    const attendanceIntegrity = Math.min(100, streak * 10 + missionsCount * 10);
    const sandboxedCodeExecution = Math.min(100, questsCount * 10);
    const interviewDefense = Math.min(100, interviewsCount * 25);

    const computedTrust = Math.min(
      100,
      Math.round(
        vaultEvidence * 0.3 +
        attendanceIntegrity * 0.25 +
        sandboxedCodeExecution * 0.25 +
        interviewDefense * 0.2
      )
    );

    const trustScore = Math.max(Number(profile?.trust_score) || 0, computedTrust);

    await admin
      .from('users')
      .update({ trust_score: trustScore, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return NextResponse.json({
      success: true,
      trustScore,
      verifiedPillars: {
        vaultEvidence,
        attendanceIntegrity,
        sandboxedCodeExecution,
        interviewDefense,
      },
      evaluationId: `eval_${Date.now()}`,
      evaluatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to evaluate trust', message: err?.message }, { status: 500 });
  }
}
