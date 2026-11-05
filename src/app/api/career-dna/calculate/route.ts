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
    const { data: profile } = await admin
      .from('users')
      .select('completed_quests, mission_streak, missions_completed, skill_tags, ats_score, execution_score, innovation_score, adaptability_score')
      .eq('id', userId)
      .maybeSingle();

    const questsCount = Array.isArray(profile?.completed_quests) ? profile.completed_quests.length : 0;
    const streak = Number(profile?.mission_streak) || 0;
    const missionsCount = Number(profile?.missions_completed) || 0;
    const skillsCount = Array.isArray(profile?.skill_tags) ? profile.skill_tags.length : 0;

    const analyticalThinking = Math.min(100, questsCount * 5 + skillsCount * 3);
    const systemicCuriosity = Math.min(100, questsCount * 4 + missionsCount * 4);
    const executionTenacity = Math.min(100, Number(profile?.execution_score) || (questsCount * 5 + streak * 5));
    const adversarialResilience = Math.min(100, Number(profile?.adaptability_score) || (missionsCount * 6 + streak * 4));

    const dnaScore = Math.min(
      100,
      Math.min(70, questsCount * 5) + Math.min(30, streak * 5)
    );

    await admin
      .from('users')
      .update({ career_dna_score: dnaScore, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return NextResponse.json({
      success: true,
      dnaScore,
      traits: {
        analyticalThinking,
        systemicCuriosity,
        executionTenacity,
        adversarialResilience,
      },
      calculatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to calculate Career DNA', message: err?.message }, { status: 500 });
  }
}
