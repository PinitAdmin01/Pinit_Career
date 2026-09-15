import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest, getAuthoritativeSupabaseClient, getBearerToken } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

function getAdminClient(userToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (url && serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return getAuthoritativeSupabaseClient(userToken);
}

export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user) return gated.error;

    const token = getBearerToken(req);
    const db = getAdminClient(token);
    const userId = gated.user.id;

    const { data: userRow, error } = await db
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[api/auth/me] User fetch warning:', error.message);
    }

    const ob = userRow?.onboarding_answers || {};
    const step = typeof userRow?.onboarding_step === 'number' ? userRow.onboarding_step : (ob.hasCompleted ? 3 : 1);
    const roadmapGen = Boolean(userRow?.roadmap_generated ?? ob.hasCompleted);

    const userProfile = {
      id: userId,
      email: gated.user.email || userRow?.email || '',
      displayName: userRow?.display_name || userRow?.full_name || 'Student',
      display_name: userRow?.display_name || userRow?.full_name || 'Student',
      role: userRow?.role || 'student',
      registerNumber: userRow?.register_number || userRow?.roll_number || '',
      register_number: userRow?.register_number || userRow?.roll_number || '',
      selectedTeacherId: userRow?.selected_teacher_id || 'priya',
      guidanceMentorId: userRow?.guidance_mentor_id || 'priya',
      atsScore: userRow?.ats_score ?? 0,
      ats_score: userRow?.ats_score ?? 0,
      trustScore: userRow?.trust_score ?? 50,
      trust_score: userRow?.trust_score ?? 50,
      careerDnaScore: userRow?.career_dna_score ?? 0,
      career_dna_score: userRow?.career_dna_score ?? 0,
      missionStreak: userRow?.mission_streak ?? 0,
      mission_streak: userRow?.mission_streak ?? 0,
      xpTotal: userRow?.xp_total ?? 0,
      xp_total: userRow?.xp_total ?? 0,
      pins: typeof userRow?.pins === 'number' ? userRow.pins : 120,
      onboardingStep: step,
      onboarding_step: step,
      roadmapGenerated: roadmapGen,
      roadmap_generated: roadmapGen,
      onboardingAnswers: ob,
      onboarding_answers: ob,
      target_role: userRow?.target_role || ob.role || 'Software Engineer',
      career_goal: userRow?.career_goal || ob.career_goal || '',
      completedQuests: userRow?.completed_quests || [],
      completed_quests: userRow?.completed_quests || [],
      completedMissions: userRow?.completed_missions || [],
      completed_missions: userRow?.completed_missions || [],
      notification_prefs: userRow?.notification_prefs || {},
      created_at: userRow?.created_at || new Date().toISOString(),
    };

    const scores = {
      careerScore: userRow?.career_readiness ?? 60,
      dnaScore: userRow?.career_dna_score ?? 0,
      trustScore: userRow?.trust_score ?? 50,
      atsScore: userRow?.ats_score ?? 0,
    };

    return NextResponse.json({
      ok: true,
      user: userProfile,
      profile: scores,
    });
  } catch (err: any) {
    console.error('[api/auth/me] Exception:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user) return gated.error;

    const token = getBearerToken(req);
    const db = getAdminClient(token);
    const userId = gated.user.id;

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON' }, { status: 400 });
    }

    const raw = typeof body === 'object' && body !== null ? { ...body } : {};
    delete raw.role;
    delete raw.pins;
    delete raw.subscription_tier;
    delete raw.ats_score;
    delete raw.trust_score;
    delete raw.career_dna_score;
    delete raw.mission_streak;

    const { error } = await db
      .from('users')
      .update({
        ...raw,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return NextResponse.json({ error: 'DB_ERROR', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err?.message || 'Server error' }, { status: 500 });
  }
}
