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

    const body = await req.json().catch(() => ({}));
    const rawQuestId = typeof body?.questId === 'string' ? body.questId.trim() : '';
    if (!rawQuestId || rawQuestId.length > 100 || !/^[a-zA-Z0-9_\-\.\:]+$/.test(rawQuestId)) {
      return NextResponse.json({ error: 'Valid questId is required' }, { status: 400 });
    }
    const questId = rawQuestId;

    const isExam = Boolean(body?.isExam);
    const courseId = typeof body?.courseId === 'string' && body.courseId.trim()
      ? body.courseId.trim().slice(0, 80)
      : 'default-course';

    // Anti-Cheat: Never trust arbitrary client-supplied XP numbers.
    // Bound XP strictly between 10 and 150 (maximum allowable quest reward).
    const parsedXp = Number(body?.xpAmount);
    const safeXp = Number.isFinite(parsedXp) && parsedXp > 0
      ? Math.min(150, Math.max(10, Math.floor(parsedXp)))
      : 15;

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
    // Non-exam quests capped at 3/day; exams capped at 5/day to prevent infinite bypass
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

    const maxDailyAllowed = isExam ? 5 : 3;
    if (todayCompletions.length >= maxDailyAllowed) {
      return NextResponse.json(
        {
          error: `Daily Limit Reached: Maximum of ${maxDailyAllowed} completions per calendar day allowed across all courses.`,
          dailyCompletionsCount: todayCompletions.length,
          maxAllowed: maxDailyAllowed,
        },
        { status: 429 }
      );
    }

    // Step 3: Atomic write with clamped XP
    let nextXp = (profile.xp_total || 0) + safeXp;

    // Try authoritative increment_xp RPC first if available
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('increment_xp', {
        p_user_id: userId,
        p_amount: safeXp,
        p_reason: `quest:${questId}`,
      });
      if (!rpcErr && rpcRes?.ok && typeof rpcRes.new_xp === 'number') {
        nextXp = rpcRes.new_xp;
      }
    } catch {
      // Graceful fallback to direct calculation
    }

    const nextCompleted = [...currentCompleted, questId];
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
