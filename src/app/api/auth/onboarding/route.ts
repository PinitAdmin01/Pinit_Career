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
      console.warn('[api/auth/onboarding] GET error:', error.message);
      return NextResponse.json({ error: 'DB_ERROR', message: error.message }, { status: 500 });
    }

    const ob = userRow?.onboarding_answers || {};
    const step = typeof userRow?.onboarding_step === 'number' ? userRow.onboarding_step : (ob.hasCompleted ? 3 : 1);
    const roadmapGen = Boolean(userRow?.roadmap_generated ?? ob.hasCompleted);

    return NextResponse.json({
      ok: true,
      onboardingStep: step,
      onboardingAnswers: ob,
      target_role: userRow?.target_role || ob.role || '',
      career_goal: userRow?.career_goal || ob.career_goal || '',
      guidanceMentorId: userRow?.guidance_mentor_id || 'priya',
      roadmapGenerated: roadmapGen,
      completedQuests: userRow?.completed_quests || [],
      completedMissions: userRow?.completed_missions || [],
      user: userRow ? { id: userId, ...userRow, onboardingStep: step, roadmapGenerated: roadmapGen } : null,
    });
  } catch (err: any) {
    console.error('[api/auth/onboarding] GET exception:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON payload' }, { status: 400 });
    }

    const raw = typeof body === 'object' && body !== null ? { ...body } : {};

    // Prevent privilege escalation — students cannot self-grant roles, pins, or subscription tier
    delete raw.role;
    delete raw.pins;
    delete raw.subscription_tier;
    delete raw.ats_score;
    delete raw.trust_score;
    delete raw.career_dna_score;
    delete raw.mission_streak;

    const answers = typeof raw.onboardingAnswers === 'object' && raw.onboardingAnswers !== null
      ? { ...raw.onboardingAnswers }
      : (typeof raw.onboarding_answers === 'object' && raw.onboarding_answers !== null ? { ...raw.onboarding_answers } : {});

    delete answers.role;
    delete answers.subscription_tier;
    delete answers.mission_streak;
    answers.hasCompleted = true;

    const targetRole = raw.target_role || answers.role || answers.target_role || 'Software Engineer';
    const careerGoal = raw.career_goal || answers.career_goal || answers.target_goal || '';
    const mentorId = raw.guidanceMentorId || raw.guidance_mentor_id || 'priya';
    const step = 3;
    const roadmapGen = true;

    const updatePayload: Record<string, any> = {
      onboarding_step: step,
      roadmap_generated: roadmapGen,
      target_role: targetRole,
      career_goal: careerGoal,
      guidance_mentor_id: mentorId,
      onboarding_answers: answers,
      updated_at: new Date().toISOString(),
    };

    // Attempt direct update first
    const { data: updatedUser, error: updateError } = await db
      .from('users')
      .update(updatePayload)
      .eq('id', userId)
      .select('*')
      .maybeSingle();

    if (updateError || !updatedUser) {
      // Row might not exist yet; upsert to ensure persistence
      const { data: upsertedUser, error: upsertError } = await db
        .from('users')
        .upsert({
          id: userId,
          email: gated.user.email || '',
          role: 'student',
          ...updatePayload,
          created_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .select('*')
        .maybeSingle();

      if (upsertError) {
        console.error('[api/auth/onboarding] Upsert failure:', upsertError.message);
        return NextResponse.json({ error: 'DB_ERROR', message: upsertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      ok: true,
      success: true,
      onboardingStep: step,
      roadmapGenerated: roadmapGen,
      target_role: targetRole,
      career_goal: careerGoal,
      guidanceMentorId: mentorId,
      onboardingAnswers: answers,
    });
  } catch (err: any) {
    console.error('[api/auth/onboarding] POST exception:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  return POST(req);
}
