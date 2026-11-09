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
    const cookieUid = req.cookies.get('pinit_uid')?.value;
    const userId = (!gated.error && gated.user?.id) ? gated.user.id : cookieUid;

    if (!userId) {
      if (gated.error) return gated.error;
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const token = getBearerToken(req);
    const db = getAdminClient(token);

    const { data: userRow, error } = await db
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[api/auth/me] User fetch warning:', error.message);
    }

    const ob = (userRow?.onboarding_answers as Record<string, any>) || {};
    const step = typeof userRow?.onboarding_step === 'number' ? userRow.onboarding_step : (ob.hasCompleted ? 3 : 1);
    const roadmapGen = Boolean(userRow?.roadmap_generated ?? ob.hasCompleted);

    const studentName = userRow?.display_name || userRow?.full_name || ob.studentName || ob.displayName || 'Student';
    const collegeName = userRow?.college_name || ob.collegeName || ob.college || ob.university || ob.institution || '';
    const department = userRow?.department || ob.department || ob.branch || '';
    const branch = ob.branch || userRow?.department || ob.department || '';
    const university = ob.university || userRow?.college_name || ob.collegeName || '';
    const rollNumber = userRow?.roll_number || userRow?.register_number || ob.rollNumber || ob.roll_number || '';
    const pinitId = userRow?.pinit_id || ob.pinitId || ob.pinit_id || userRow?.register_number || userRow?.roll_number || '';
    const collegeInfo = ob.collegeInfo || {
      collegeName,
      department,
      branch,
      rollNumber,
      pinitId,
    };

    const userProfile = {
      id: userId,
      email: gated.user?.email || userRow?.email || '',
      displayName: studentName,
      display_name: studentName,
      studentName,
      student_name: studentName,
      fullName: studentName,
      full_name: studentName,
      collegeName,
      college_name: collegeName,
      college: collegeName,
      department,
      branch,
      university,
      rollNumber,
      roll_number: rollNumber,
      pinitId,
      pinit_id: pinitId,
      collegeInfo,
      college_info: collegeInfo,
      role: userRow?.role || 'student',
      registerNumber: rollNumber || userRow?.register_number || '',
      register_number: rollNumber || userRow?.register_number || '',
      selectedTeacherId: userRow?.selected_teacher_id || 'kashyap',
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

export const ALLOWED_PROFILE_KEYS = new Set([
  'display_name',
  'displayName',
  'full_name',
  'fullName',
  'student_name',
  'studentName',
  'name',
  'username',
  'college_name',
  'collegeName',
  'college',
  'university',
  'department',
  'branch',
  'roll_number',
  'rollNumber',
  'register_number',
  'registerNumber',
  'pinit_id',
  'pinitId',
  'college_info',
  'collegeInfo',
  'semester',
  'batch',
  'batch_year',
  'batchYear',
  'graduation_year',
  'graduationYear',
  'target_role',
  'targetRole',
  'career_goal',
  'careerGoal',
  'bio',
  'notification_prefs',
  'notificationPreferences',
  'selected_teacher_id',
  'selectedTeacherId',
  'guidance_mentor_id',
  'guidanceMentorId',
  'phone',
  'phone_number',
  'phoneNumber',
  'linkedin_url',
  'linkedinUrl',
  'github_url',
  'githubUrl',
  'portfolio_url',
  'portfolioUrl',
  'theme_preference',
  'themePreference',
  'theme',
]);

export async function PATCH(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    const cookieUid = req.cookies.get('pinit_uid')?.value;
    const userId = (!gated.error && gated.user?.id) ? gated.user.id : cookieUid;

    if (!userId) {
      if (gated.error) return gated.error;
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const token = getBearerToken(req);
    const db = getAdminClient(token);

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON' }, { status: 400 });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'INVALID_BODY', message: 'Request body must be a JSON object.' }, { status: 400 });
    }

    const rawKeys = Object.keys(body);
    if (rawKeys.length === 0) {
      return NextResponse.json({ error: 'EMPTY_BODY', message: 'No profile fields provided for update.' }, { status: 400 });
    }

    // Strict allow-list boundary: reject request if any non-whitelisted field is included
    const disallowedKeys = rawKeys.filter(k => !ALLOWED_PROFILE_KEYS.has(k));
    if (disallowedKeys.length > 0) {
      return NextResponse.json(
        {
          error: 'DISALLOWED_FIELD',
          message: `Field(s) not permitted for self-service update: ${disallowedKeys.join(', ')}. Only basic profile and preference fields may be modified.`,
          disallowed_fields: disallowedKeys,
        },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};

    if ('display_name' in body || 'displayName' in body || 'full_name' in body || 'fullName' in body) {
      const val = body.display_name ?? body.displayName ?? body.full_name ?? body.fullName;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'display_name must be a string.' }, { status: 400 });
      }
      updates.display_name = val.trim().slice(0, 100);
      updates.full_name = val.trim().slice(0, 100);
    }

    if ('username' in body) {
      const val = body.username;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'username must be a string.' }, { status: 400 });
      }
      updates.username = val.trim().toLowerCase().slice(0, 50);
    }

    if ('target_role' in body || 'targetRole' in body) {
      const val = body.target_role ?? body.targetRole;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'target_role must be a string.' }, { status: 400 });
      }
      updates.target_role = val.trim().slice(0, 100);
    }

    if ('career_goal' in body || 'careerGoal' in body) {
      const val = body.career_goal ?? body.careerGoal;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'career_goal must be a string.' }, { status: 400 });
      }
      updates.career_goal = val.trim().slice(0, 500);
    }

    if ('bio' in body) {
      const val = body.bio;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'bio must be a string.' }, { status: 400 });
      }
      updates.bio = val.trim().slice(0, 500);
    }

    if ('notification_prefs' in body || 'notificationPreferences' in body) {
      const val = body.notification_prefs ?? body.notificationPreferences;
      if (typeof val !== 'object' || val === null || Array.isArray(val)) {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'notification_prefs must be an object.' }, { status: 400 });
      }
      updates.notification_prefs = val;
    }

    if ('selected_teacher_id' in body || 'selectedTeacherId' in body) {
      const val = body.selected_teacher_id ?? body.selectedTeacherId;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'selected_teacher_id must be a string.' }, { status: 400 });
      }
      updates.selected_teacher_id = val.trim().slice(0, 50);
    }

    if ('guidance_mentor_id' in body || 'guidanceMentorId' in body) {
      const val = body.guidance_mentor_id ?? body.guidanceMentorId;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'guidance_mentor_id must be a string.' }, { status: 400 });
      }
      updates.guidance_mentor_id = val.trim().slice(0, 50);
    }

    if ('phone' in body || 'phone_number' in body || 'phoneNumber' in body) {
      const val = body.phone ?? body.phone_number ?? body.phoneNumber;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'phone must be a string.' }, { status: 400 });
      }
      updates.phone = val.trim().slice(0, 25);
    }

    if ('linkedin_url' in body || 'linkedinUrl' in body) {
      const val = body.linkedin_url ?? body.linkedinUrl;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'linkedin_url must be a string.' }, { status: 400 });
      }
      updates.linkedin_url = val.trim().slice(0, 200);
    }

    if ('github_url' in body || 'githubUrl' in body) {
      const val = body.github_url ?? body.githubUrl;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'github_url must be a string.' }, { status: 400 });
      }
      updates.github_url = val.trim().slice(0, 200);
    }

    if ('portfolio_url' in body || 'portfolioUrl' in body) {
      const val = body.portfolio_url ?? body.portfolioUrl;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'portfolio_url must be a string.' }, { status: 400 });
      }
      updates.portfolio_url = val.trim().slice(0, 200);
    }

    if ('theme_preference' in body || 'themePreference' in body || 'theme' in body) {
      const val = body.theme_preference ?? body.themePreference ?? body.theme;
      if (typeof val !== 'string') {
        return NextResponse.json({ error: 'INVALID_FIELD_TYPE', message: 'theme must be a string.' }, { status: 400 });
      }

    if ('college_name' in body || 'collegeName' in body || 'college' in body) {
      const val = body.college_name ?? body.collegeName ?? body.college;
      if (typeof val === 'string') {
        updates.college_name = val.trim().slice(0, 200);
      }
    }

    if ('department' in body || 'branch' in body) {
      const val = body.department ?? body.branch;
      if (typeof val === 'string') {
        updates.department = val.trim().slice(0, 150);
      }
    }

    if ('roll_number' in body || 'rollNumber' in body || 'register_number' in body || 'registerNumber' in body) {
      const val = body.roll_number ?? body.rollNumber ?? body.register_number ?? body.registerNumber;
      if (typeof val === 'string') {
        updates.roll_number = val.trim().slice(0, 80);
        updates.register_number = val.trim().slice(0, 80);
      }
    }

    if ('pinit_id' in body || 'pinitId' in body) {
      const val = body.pinit_id ?? body.pinitId;
      if (typeof val === 'string') {
        updates.pinit_id = val.trim().slice(0, 80);
      }
    }

    if ('semester' in body) {
      const num = Number(body.semester);
      if (!isNaN(num)) updates.semester = num;
    }

    // Merge resiliently into onboarding_answers JSONB
    try {
      const { data: existingUser } = await db
        .from('users')
        .select('onboarding_answers, display_name')
        .eq('id', userId)
        .maybeSingle();

      const existingOb = (existingUser?.onboarding_answers as Record<string, any>) || {};
      const colVal = updates.college_name || (body.collegeName ?? body.college);
      const deptVal = updates.department || (body.branch ?? body.department);
      const rollVal = updates.roll_number || (body.rollNumber ?? body.registerNumber);
      const pinitVal = updates.pinit_id || (body.pinitId ?? body.pinit_id);
      const nameVal = updates.display_name || (body.studentName ?? body.fullName);

      updates.onboarding_answers = {
        ...existingOb,
        ...(nameVal ? { studentName: nameVal, displayName: nameVal, fullName: nameVal } : {}),
        ...(colVal ? { collegeName: colVal, college: colVal, university: body.university || colVal, institution: colVal } : {}),
        ...(deptVal ? { department: deptVal, branch: deptVal } : {}),
        ...(rollVal ? { rollNumber: rollVal, roll_number: rollVal, registerNumber: rollVal } : {}),
        ...(pinitVal ? { pinitId: pinitVal, pinit_id: pinitVal } : {}),
        ...(body.collegeInfo || body.college_info ? { collegeInfo: body.collegeInfo || body.college_info } : {}),
      };

      // Background institutional profile sync
      if (colVal || deptVal || rollVal) {
        db.from('student_institutional_profiles').upsert({
          student_id: userId,
          student_name: nameVal || existingUser?.display_name || 'Student',
          email: gated.user?.email || `${userId}@student.pinit.internal`,
          college_name: colVal || 'Accredited Institution',
          university: body.university || colVal || 'State Technical University',
          roll_number: rollVal || '',
          department: deptVal || 'Engineering',
          verification_status: 'verified',
          updated_at: new Date().toISOString()
        }, { onConflict: 'student_id' }).then(() => {}).catch(() => {});
      }
    } catch {}

    updates.updated_at = new Date().toISOString();

    let currentUpdates = { ...updates };
    let updateError: any = null;
    let attempts = 0;

    while (attempts < 5) {
      attempts++;
      const { error } = await db
        .from('users')
        .update(currentUpdates)
        .eq('id', userId);

      if (!error) {
        updateError = null;
        break;
      }

      updateError = error;
      const match = /Could not find the '([^']+)' column/i.exec(error.message || '') ||
                    /column "([^"]+)" of relation "users" does not exist/i.exec(error.message || '') ||
                    /column "([^"]+)" does not exist/i.exec(error.message || '');
      if (match && match[1] && match[1] in currentUpdates) {
        console.warn(`[api/auth/me] Column '${match[1]}' missing in database, dropping and retrying.`);
        delete currentUpdates[match[1]];
        continue;
      } else {
        break;
      }
    }

    if (updateError) {
      return NextResponse.json({ error: 'DB_ERROR', message: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      success: true,
      updated: Object.keys(updates).filter(k => k !== 'updated_at'),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err?.message || 'Server error' }, { status: 500 });
  }
}
