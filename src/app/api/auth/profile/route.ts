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
  studentName: 'display_name',
  student_name: 'display_name',
  collegeName: 'college_name',
  college_name: 'college_name',
  college: 'college_name',
  department: 'department',
  branch: 'department',
  rollNumber: 'roll_number',
  roll_number: 'roll_number',
  pinitId: 'pinit_id',
  pinit_id: 'pinit_id',
  semester: 'semester',
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
  'studentName',
  'student_name',
  'collegeName',
  'college_name',
  'college',
  'department',
  'branch',
  'university',
  'rollNumber',
  'roll_number',
  'pinitId',
  'pinit_id',
  'collegeInfo',
  'college_info',
  'batch',
  'batchYear',
  'graduationYear',
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
        let currentDirect = { ...directUpdates };
        let attempts = 0;
        while (attempts < 5) {
          attempts++;
          const { error } = await admin.from('users').update(currentDirect).eq('id', userId);
          if (!error) break;
          const match = /Could not find the '([^']+)' column/i.exec(error.message || '') ||
                        /column "([^"]+)" of relation "users" does not exist/i.exec(error.message || '') ||
                        /column "([^"]+)" does not exist/i.exec(error.message || '');
          if (match && match[1] && match[1] in currentDirect) {
            delete currentDirect[match[1]];
            continue;
          } else {
            console.warn('[/api/auth/profile] DB update note:', error.message);
            break;
          }
        }
      }

      // Institutional profile sync in background
      const stName = body.studentName || body.student_name || body.displayName || body.display_name || body.fullName || body.full_name;
      const colName = body.collegeName || body.college_name || body.college;
      const deptName = body.department || body.branch;
      const rollVal = body.rollNumber || body.roll_number || body.registerNumber || body.register_number;

      if (colName || deptName || rollVal) {
        admin.from('student_institutional_profiles').upsert({
          student_id: userId,
          student_name: stName || 'Student',
          email: gated.user?.email || `${userId}@student.pinit.internal`,
          college_name: colName || 'Accredited Institution',
          university: body.university || colName || 'State Technical University',
          roll_number: rollVal || '',
          department: deptName || 'Engineering',
          verification_status: 'verified',
          updated_at: new Date().toISOString()
        }, { onConflict: 'student_id' }).then(() => {}, () => {});
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
