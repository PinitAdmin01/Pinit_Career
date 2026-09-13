import { NextResponse } from 'next/server';
import { requireUserFromRequest, getBearerToken, getAuthoritativeSupabaseClient } from '@/lib/server/requireAuth';

/**
 * POST /api/quest/complete
 * DEF-074: Enforces a global cap of 3 completed quests per calendar day across the entire student profile.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      return gated.error;
    }

    const userId = gated.user.id;
    const token = getBearerToken(req);
    const supabase = getAuthoritativeSupabaseClient(token);

    const body = await req.json();
    const { questId, isExam, xpAmount = 15, courseId = 'default-course' } = body;

    if (!questId || typeof questId !== 'string') {
      return NextResponse.json({ error: 'Valid questId is required' }, { status: 400 });
    }

    // Step 1: Fetch user profile
    const { data: profile, error: fetchErr } = await supabase
      .from('users')
      .select('id, completed_quests, xp_total, onboarding_answers')
      .eq('id', userId)
      .single();

    if (fetchErr || !profile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const currentCompleted: string[] = profile.completed_quests || [];
    if (currentCompleted.includes(questId)) {
      return NextResponse.json({
        ok: true,
        alreadyCompleted: true,
        completedQuests: currentCompleted,
        xpTotal: profile.xp_total || 0,
      });
    }

    // Step 2: Enforce global daily limit (DEF-074)
    const answers = profile.onboarding_answers || {};
    const timestamps: string[] = Array.isArray(answers.completedQuestsTimestamps)
      ? answers.completedQuestsTimestamps
      : [];

    const today = new Date().toDateString();
    const todayCompletions = timestamps.filter((raw: string) => {
      if (typeof raw !== 'string') return false;
      const ts = raw.split('|')[0];
      return new Date(ts).toDateString() === today;
    });

    if (todayCompletions.length >= 3 && !isExam) {
      return NextResponse.json(
        {
          error: 'Daily Limit Reached: Maximum of 3 completed quests per calendar day allowed across all courses.',
          dailyCompletionsCount: todayCompletions.length,
        },
        { status: 429 }
      );
    }

    // Step 3: Atomic write
    const nextCompleted = [...currentCompleted, questId];
    const nextXp = (profile.xp_total || 0) + (Number(xpAmount) || 15);
    const timestampTag = `${new Date().toISOString()}|${courseId}`;
    const nextTimestamps = [...timestamps, timestampTag];
    const nextAnswers = {
      ...answers,
      completedQuestsTimestamps: nextTimestamps,
    };

    const { error: updateErr } = await supabase
      .from('users')
      .update({
        completed_quests: nextCompleted,
        xp_total: nextXp,
        onboarding_answers: nextAnswers,
      })
      .eq('id', userId);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      completedQuests: nextCompleted,
      xpTotal: nextXp,
      dailyCompletionsCount: todayCompletions.length + 1,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
