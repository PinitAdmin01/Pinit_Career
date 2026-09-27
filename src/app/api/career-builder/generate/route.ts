import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest, getAuthoritativeSupabaseClient, getBearerToken } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';
import { generateDynamicStudentRoadmap } from '@/lib/data/roadmapFuser';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { resolveTrackFromGoal } from '@/lib/onboarding/trackResolver';

/** Starting knowledge score by self-reported level, used only when the student has no diagnostic score. */
const QT1_BY_LEVEL: Record<string, number> = { beginner: 40, intermediate: 60, advanced: 80 };

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

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON payload' }, { status: 400 });
    }

    // skillTags is accepted for compatibility; the generator has no per-skill adaptation.
    const {
      targetRole = 'Software Engineer',
      weakAreas = [],
      experienceLevel = 'beginner',
      courseId,
      durationDays = 30,
      dailyPace = 2,
    } = body;

    // Optional authentication check: if logged in, retrieve user's diagnostic scores & profile
    const levelQt1 = QT1_BY_LEVEL[String(experienceLevel).toLowerCase()];
    let qt1 = levelQt1 ?? 45;
    let qt2 = 50;
    let archetype = 'Pattern Hunter';
    let tradeoffs: any[] = [];
    let diagnosticProfile: any = null;

    try {
      const gated = await requireUserFromRequest(req);
      if (!gated.error && gated.user) {
        const token = getBearerToken(req);
        const db = getAdminClient(token);
        const { data: userRow } = await db
          .from('users')
          .select('onboarding_answers, weak_areas')
          .eq('id', gated.user.id)
          .maybeSingle();

        const ob = userRow?.onboarding_answers || {};
        qt1 = typeof ob.qt1_score === 'number' ? ob.qt1_score : qt1;
        qt2 = typeof ob.qt2_score === 'number' ? ob.qt2_score : qt2;
        archetype = ob.mindset_archetype || archetype;
        tradeoffs = Array.isArray(ob.tradeoffs) ? ob.tradeoffs : tradeoffs;
        diagnosticProfile = ob.diagnosticProfile || null;
      }
    } catch {
      // Unauthenticated session during initial onboarding is safely allowed to generate roadmap
    }

    // Unknown or missing course: the course of the student's target role (not a fixed Java course).
    const matchedCourse = COURSES_REGISTRY.find(c => c.id === courseId);
    const effectiveCourseId = matchedCourse ? matchedCourse.id : resolveTrackFromGoal(String(targetRole || '')).courseId;

    const modules = generateDynamicStudentRoadmap({
      courseId: effectiveCourseId,
      goal: targetRole,
      qt1,
      qt2,
      archetype,
      durationDays: Number(durationDays) || 30,
      dailyPace: Number(dailyPace) || 2,
      weakAreas: Array.isArray(weakAreas) ? weakAreas : [],
      tradeoffs,
      diagnosticProfile,
    });

    return NextResponse.json({
      ok: true,
      courseId: effectiveCourseId,
      modules,
      count: modules.length,
      generatedAt: Date.now()
    });
  } catch (err: any) {
    console.error('[/api/career-builder/generate] Error:', err);
    return NextResponse.json({
      error: 'GENERATION_ERROR',
      message: err?.message || 'Failed to generate fused roadmap'
    }, { status: 500 });
  }
}
