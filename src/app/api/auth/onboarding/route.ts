import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest, getAuthoritativeSupabaseClient, getBearerToken } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

// Columns added by later migrations (e.g. 20260917_user_profile_columns.sql). If an
// environment hasn't applied them yet, onboarding must still save its core fields
// instead of failing the whole write with PostgREST PGRST204.
const OPTIONAL_USER_COLUMNS = new Set(['completed_missions', 'completed_quests', 'weak_areas', 'updated_at']);

type DbError = { message?: string; code?: string } | null;

function missingColumnName(error: DbError): string | null {
  const match = /Could not find the '([^']+)' column/.exec(error?.message || '');
  return match ? match[1] : null;
}

/** Runs a users-table write, dropping optional columns the database reports as missing. */
async function writeDroppingMissingColumns<T>(
  payload: Record<string, unknown>,
  run: (p: Record<string, unknown>) => PromiseLike<{ data: T | null; error: DbError }>,
): Promise<{ data: T | null; error: DbError; dropped: string[] }> {
  const current = { ...payload };
  const dropped: string[] = [];
  for (;;) {
    const res = await run(current);
    const missing = missingColumnName(res.error);
    if (!missing || !OPTIONAL_USER_COLUMNS.has(missing) || !(missing in current)) {
      return { data: res.data, error: res.error, dropped };
    }
    delete current[missing];
    dropped.push(missing);
  }
}

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

    // Fetch existing user record to perform safe server-side merge
    const { data: existingUser } = await db
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // 1. Extract incoming answers (supports onboardingAnswers, onboarding_answers, or root-level payload)
    let incomingAnswers: Record<string, any> = {};
    if (typeof raw.onboardingAnswers === 'object' && raw.onboardingAnswers !== null) {
      incomingAnswers = { ...raw.onboardingAnswers };
    } else if (typeof raw.onboarding_answers === 'object' && raw.onboarding_answers !== null) {
      incomingAnswers = { ...raw.onboarding_answers };
    } else {
      // Caller passed answers at root of request body (e.g. UserProgressContext:477)
      const nonAnswerKeys = new Set([
        'onboarding_step', 'onboardingStep', 'step',
        'roadmap_generated', 'roadmapGenerated',
        'target_role', 'targetRole',
        'career_goal', 'careerGoal',
        'guidance_mentor_id', 'guidanceMentorId',
        'completed_quests', 'completedQuests',
        'completed_missions', 'completedMissions',
      ]);
      const rootAnswers: Record<string, any> = {};
      for (const [k, v] of Object.entries(raw)) {
        if (!nonAnswerKeys.has(k)) {
          rootAnswers[k] = v;
        }
      }
      if (Object.keys(rootAnswers).length > 0) {
        incomingAnswers = rootAnswers;
      }
    }

    // 2. SERVER-SIDE MERGE: Never replace onboarding_answers wholesale
    const existingAnswers: Record<string, any> =
      existingUser?.onboarding_answers && typeof existingUser.onboarding_answers === 'object'
        ? { ...existingUser.onboarding_answers }
        : {};

    const mergedAnswers: Record<string, any> = {
      ...existingAnswers,
      ...incomingAnswers,
    };

    // Ensure systemMetadata and routerConfig defaults are present
    if (!mergedAnswers.systemMetadata || typeof mergedAnswers.systemMetadata !== 'object') {
      mergedAnswers.systemMetadata = {
        diagnosticVersion: 'v2.0_decision_engine',
        evaluatedAt: Date.now(),
        routerConfig: {
          provider: 'openrouter_rotator',
          model: 'anthropic/claude-3.5-sonnet',
          selectedMentor: raw.guidance_mentor_id || raw.guidanceMentorId || existingUser?.guidance_mentor_id || 'priya'
        },
        misconceptionFeedbackHooks: {
          lastUpdated: Date.now(),
          observedMisconceptions: [],
          adaptiveInterventionsCount: 0
        }
      };
    } else {
      // Preserve existing misconception hooks if incoming is empty
      const existingHooks = existingAnswers.systemMetadata?.misconceptionFeedbackHooks;
      if (existingHooks && (!mergedAnswers.systemMetadata.misconceptionFeedbackHooks || mergedAnswers.systemMetadata.misconceptionFeedbackHooks.observedMisconceptions?.length === 0)) {
        mergedAnswers.systemMetadata.misconceptionFeedbackHooks = existingHooks;
      }
    }

    // Sanitize privileged and non-tamperable fields
    delete mergedAnswers.role;
    delete mergedAnswers.subscription_tier;
    delete mergedAnswers.mission_streak;
    delete mergedAnswers.streak;
    delete mergedAnswers.completedQuestsTimestamps;
    delete mergedAnswers.completedMissionsTimestamps;
    delete mergedAnswers.ats_score;
    delete mergedAnswers.trust_score;
    delete mergedAnswers.career_dna_score;

    // 3. Completion & Step Determination (Do NOT overwrite step: 3 unless genuine completion)
    const wasCompleted = Boolean(existingAnswers.hasCompleted || (existingUser?.onboarding_step ?? 0) >= 3);
    const explicitlyCompleted = Boolean(
      raw.hasCompleted === true ||
      incomingAnswers.hasCompleted === true ||
      (typeof raw.onboarding_step === 'number' && raw.onboarding_step >= 3) ||
      (typeof raw.onboardingStep === 'number' && raw.onboardingStep >= 3)
    );
    const isCompleted = wasCompleted || explicitlyCompleted;
    if (isCompleted) {
      mergedAnswers.hasCompleted = true;
    }

    const explicitStep = raw.onboarding_step ?? raw.onboardingStep ?? raw.step;
    const step = explicitStep !== undefined
      ? Math.max(1, Math.min(3, Number(explicitStep) || 1))
      : (existingUser?.onboarding_step ?? (isCompleted ? 3 : 1));

    const explicitRoadmap = raw.roadmap_generated ?? raw.roadmapGenerated;
    const roadmapGen = explicitRoadmap !== undefined
      ? Boolean(explicitRoadmap)
      : Boolean(existingUser?.roadmap_generated ?? isCompleted);

    const targetRole =
      raw.target_role ||
      raw.targetRole ||
      mergedAnswers.goal?.role ||
      mergedAnswers.target_role ||
      mergedAnswers.role ||
      existingUser?.target_role ||
      'Software Engineer';

    const careerGoal =
      raw.career_goal ||
      raw.careerGoal ||
      mergedAnswers.goal?.rawGoalText ||
      mergedAnswers.career_goal ||
      mergedAnswers.target_goal ||
      existingUser?.career_goal ||
      '';

    const mentorId =
      raw.guidance_mentor_id ||
      raw.guidanceMentorId ||
      mergedAnswers.systemMetadata?.routerConfig?.selectedMentor ||
      mergedAnswers.guidance_mentor_id ||
      existingUser?.guidance_mentor_id ||
      'priya';

    const rawQuests = raw.completed_quests || raw.completedQuests;
    const existingQuests = Array.isArray(existingUser?.completed_quests) ? existingUser.completed_quests : [];
    const completedQuests = Array.isArray(rawQuests)
      ? Array.from(new Set([...existingQuests, ...rawQuests]))
      : existingQuests;

    const rawMissions = raw.completed_missions || raw.completedMissions;
    const existingMissions = Array.isArray(existingUser?.completed_missions) ? existingUser.completed_missions : [];
    const completedMissions = Array.isArray(rawMissions)
      ? Array.from(new Set([...existingMissions, ...rawMissions]))
      : existingMissions;

    // Synchronize weak_areas column from diagnostic tradeoffs or gaps
    let derivedWeakAreas = existingUser?.weak_areas || [];
    if (Array.isArray(mergedAnswers.tradeoffs) && mergedAnswers.tradeoffs.length > 0) {
      const tradeoffGaps = mergedAnswers.tradeoffs.map((t: any) => t.type || t.description);
      derivedWeakAreas = Array.from(new Set([...derivedWeakAreas, ...tradeoffGaps]));
    }

    const updatePayload: Record<string, any> = {
      onboarding_step: step,
      roadmap_generated: roadmapGen,
      target_role: targetRole,
      career_goal: careerGoal,
      guidance_mentor_id: mentorId,
      onboarding_answers: mergedAnswers,
      weak_areas: derivedWeakAreas,
      completed_quests: completedQuests,
      completed_missions: completedMissions,
      updated_at: new Date().toISOString(),
    };

    // Attempt direct update first
    const updated = await writeDroppingMissingColumns(updatePayload, p =>
      db.from('users').update(p).eq('id', userId).select('*').maybeSingle()
    );
    let droppedColumns = updated.dropped;

    if (updated.error) {
      console.error('[api/auth/onboarding] Update failure:', updated.error.message);
      return NextResponse.json({ error: 'DB_ERROR', message: updated.error.message }, { status: 500 });
    }

    if (!updated.data) {
      // No row yet: create it. Only here — an upsert on an existing row would reset
      // its role to 'student'.
      const upserted = await writeDroppingMissingColumns({
        id: userId,
        email: gated.user.email || '',
        role: 'student',
        ...updatePayload,
        created_at: new Date().toISOString(),
      }, p => db.from('users').upsert(p, { onConflict: 'id' }).select('*').maybeSingle());
      droppedColumns = upserted.dropped;

      if (upserted.error) {
        console.error('[api/auth/onboarding] Upsert failure:', upserted.error.message);
        return NextResponse.json({ error: 'DB_ERROR', message: upserted.error.message }, { status: 500 });
      }
    }

    if (droppedColumns.length > 0) {
      console.error(
        `[api/auth/onboarding] users table is missing column(s) ${droppedColumns.join(', ')}; ` +
        'saved without them. Apply supabase/migrations/20260917_user_profile_columns.sql.'
      );
    }

    return NextResponse.json({
      ok: true,
      success: true,
      onboardingStep: step,
      roadmapGenerated: roadmapGen,
      target_role: targetRole,
      career_goal: careerGoal,
      guidanceMentorId: mentorId,
      onboardingAnswers: mergedAnswers,
      completedQuests,
      completedMissions,
    });
  } catch (err: any) {
    console.error('[api/auth/onboarding] POST exception:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  return POST(req);
}
