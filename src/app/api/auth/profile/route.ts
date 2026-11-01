import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

const DIRECT_COLUMNS: Record<string, string> = {
  displayName: 'display_name',
  display_name: 'display_name',
  name: 'display_name',
  fullName: 'full_name',
  full_name: 'full_name',
  candidateName: 'full_name',
  candidate_name: 'full_name',
  selectedTeacherId: 'selected_teacher_id',
  selected_teacher_id: 'selected_teacher_id',
  guidanceMentorId: 'guidance_mentor_id',
  guidance_mentor_id: 'guidance_mentor_id',
  registerNumber: 'register_number',
  register_number: 'register_number',
  targetRole: 'target_role',
  target_role: 'target_role',
  careerGoal: 'career_goal',
  career_goal: 'career_goal',
  communication_score: 'communication_score',
  communicationScore: 'communication_score',
  execution_score: 'execution_score',
  executionScore: 'execution_score',
  leadership_score: 'leadership_score',
  leadershipScore: 'leadership_score',
  consistency_score: 'consistency_score',
  consistencyScore: 'consistency_score',
  adaptability_score: 'adaptability_score',
  adaptabilityScore: 'adaptability_score',
  confidence_score: 'confidence_score',
  confidenceScore: 'confidence_score',
  innovation_score: 'innovation_score',
  innovationScore: 'innovation_score',
  intelligence_score: 'intelligence_score',
  intelligenceScore: 'intelligence_score',
  mission_streak: 'mission_streak',
  missionStreak: 'mission_streak',
  recruiter_visibility: 'recruiter_visibility',
  recruiterVisibility: 'recruiter_visibility',
  recruiter_visible: 'recruiter_visible',
  recruiterVisible: 'recruiter_visible',
  weak_areas: 'weak_areas',
  weakAreas: 'weak_areas',
  skill_tags: 'skill_tags',
  skillTags: 'skill_tags',
  certifications: 'certifications',
};

const JSONB_EXTENSION_KEYS = new Set([
  'bio',
  'projects',
  'certificates',
  'timeline',
  'achievements',
  'recommendations',
  'researchPapers',
  'notification_prefs',
  'notificationPrefs',
]);

async function handleProfileUpdate(req: NextRequest) {
  let body: Record<string, any> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Invalid request body' }, { status: 400 });
  }

  const gated = await requireUserFromRequest(req);
  const cookieUid = req.cookies.get('pinit_uid')?.value;
  const userId = (!gated.error && gated.user?.id) ? gated.user.id : cookieUid;

  if (!userId) {
    return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  const directUpdates: Record<string, any> = {};
  const jsonUpdates: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    if (value === undefined) continue;
    if (key in DIRECT_COLUMNS) {
      directUpdates[DIRECT_COLUMNS[key]] = value;
    } else if (JSONB_EXTENSION_KEYS.has(key)) {
      jsonUpdates[key] = value;
    }
  }

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      if (Object.keys(jsonUpdates).length > 0) {
        const { data: existing } = await admin
          .from('users')
          .select('onboarding_answers')
          .eq('id', userId)
          .maybeSingle();
        const prevAnswers =
          existing?.onboarding_answers && typeof existing.onboarding_answers === 'object'
            ? existing.onboarding_answers
            : {};
        directUpdates.onboarding_answers = { ...prevAnswers, ...jsonUpdates };
      }

      if (Object.keys(directUpdates).length > 0) {
        await admin.from('users').update(directUpdates).eq('id', userId);
      }
    } catch (err: any) {
      console.warn('[/api/auth/profile] Non-fatal DB update warning:', err?.message || err);
    }
  }

  return NextResponse.json({
    ok: true,
    userId,
    updated: [...Object.keys(directUpdates), ...Object.keys(jsonUpdates)],
  });
}

export async function PATCH(req: NextRequest) {
  return handleProfileUpdate(req);
}

export async function POST(req: NextRequest) {
  return handleProfileUpdate(req);
}

export async function GET(req: NextRequest) {
  const gated = await requireUserFromRequest(req);
  const cookieUid = req.cookies.get('pinit_uid')?.value;
  const userId = (!gated.error && gated.user?.id) ? gated.user.id : cookieUid;

  if (!userId) {
    return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data } = await admin.from('users').select('*').eq('id', userId).maybeSingle();
      if (data) {
        return NextResponse.json({ ok: true, profile: data });
      }
    } catch {}
  }

  return NextResponse.json({ ok: true, profile: { id: userId } });
}
