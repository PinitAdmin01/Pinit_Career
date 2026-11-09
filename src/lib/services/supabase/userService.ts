'use client';

import { supabase } from '@/lib/supabaseClient';
import { generateTxId } from '@/lib/utils/transactionId';

const IS_VALID_UUID = (id?: string | null): boolean =>
  !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export const DEMO_MISSIONS = [
  { title: 'LinkedIn Post: Tech Insight', description: 'Write a 200-word LinkedIn post sharing a technical insight. Use STAR format and include one specific metric.', type: 'communication', status: 'pending', proof_type: 'url', due_date: new Date().toISOString().slice(0, 10), trust_reward: 8, source_weakness: 'Communication', estimated_minutes: 20, learn_url: 'https://linkedin.com', ai_evaluation: null },
  { title: 'DSA Practice: Trees & Graphs', description: 'Solve 2 medium problems on Binary Trees or Graphs on LeetCode. Submit solution links.', type: 'technical', status: 'pending', proof_type: 'url', due_date: new Date().toISOString().slice(0, 10), trust_reward: 12, source_weakness: 'DSA - Trees', estimated_minutes: 45, learn_url: 'https://leetcode.com', ai_evaluation: null },
  { title: 'STAR Behavioral Story', description: 'Record a 2-minute video answering: Tell me about a time you handled a disagreement with a team member.', type: 'behavioral', status: 'pending', proof_type: 'video', due_date: new Date().toISOString().slice(0, 10), trust_reward: 10, source_weakness: 'Behavioral STAR', estimated_minutes: 15, learn_url: 'https://loom.com', ai_evaluation: null },
];

export const EMPTY_PROFILE = {
  display_name: 'Student',
  role: 'student',
  register_number: '',
  ats_score: 0,
  career_dna_score: 0,
  trust_score: 50,
  mission_streak: 0,
  recruiter_visibility: 0,
  career_readiness: 0,
  communication_score: 0,
  execution_score: 0,
  leadership_score: 0,
  consistency_score: 0,
  adaptability_score: 0,
  confidence_score: 0,
  innovation_score: 0,
  weak_areas: [],
  skill_tags: [],
  certifications: [],
  target_role: 'Full Stack Engineer',
  career_goal: '',
  intelligence_score: 0,
  career_dna_archetype: 'explorer',
  xp_total: 0,
  xp_level: 1,
  missions_completed: 0,
  interviews_done: 0,
  vault_count: 0,
  onboarding_step: 1,
  onboarding_answers: {},
  roadmap_generated: false,
  completed_quests: [],
};

async function syncInstitutionalProfile(uid: string, data: Record<string, any>) {
  try {
    const studentName = data.studentName || data.student_name || data.displayName || data.display_name || data.fullName || data.full_name;
    const collegeName = data.collegeName || data.college_name || data.college;
    const rollNumber = data.rollNumber || data.roll_number || data.registerNumber || data.register_number;
    const department = data.department || data.branch;
    const email = data.email || (data.username ? `${data.username}@campus.edu` : '');

    if (!collegeName && !department && !rollNumber) return;

    await supabase.from('student_institutional_profiles').upsert({
      student_id: uid,
      student_name: studentName || 'Student',
      email: email || `${uid}@student.pinit.internal`,
      college_name: collegeName || 'Accredited Institution',
      university: data.university || collegeName || 'State Technical University',
      roll_number: rollNumber || '',
      department: department || 'Engineering',
      verification_status: 'verified',
      updated_at: new Date().toISOString()
    }, { onConflict: 'student_id' });
  } catch {}
}

export function mapRowToProfile(row: any): any {
  if (!row) return null;
  const ob = (row.onboarding_answers as Record<string, unknown>) || {};
  const regNo = row.register_number || row.roll_number || (ob.rollNumber as string) || (ob.roll_number as string) || (ob.registerNumber as string) || '';
  const isRoadmapGen = Boolean(row.roadmap_generated ?? ob.hasCompleted);
  const isResumeGen = Boolean(row.resume_generated);
  const teacherId = row.selected_teacher_id || 'priya';
  const mentorId = row.guidance_mentor_id || row.selected_teacher_id || 'priya';
  const dispName = row.display_name || row.full_name || (ob.displayName as string) || (ob.studentName as string) || (ob.name as string) || 'Student';
  const studentName = (ob.studentName as string) || dispName;
  const colName = row.college_name || (ob.collegeName as string) || (ob.college as string) || (ob.university as string) || (ob.institution as string) || '';
  const dept = row.department || (ob.department as string) || (ob.branch as string) || '';
  const branchName = (ob.branch as string) || row.department || (ob.department as string) || '';
  const univ = (ob.university as string) || colName;
  const pinitId = row.pinit_id || (ob.pinitId as string) || (ob.pinit_id as string) || regNo || '';
  const rollNo = row.roll_number || row.register_number || (ob.rollNumber as string) || (ob.roll_number as string) || '';
  const colInfo = ob.collegeInfo || {
    collegeName: colName,
    department: dept,
    branch: branchName,
    rollNumber: rollNo,
    pinitId,
  };
  const obStep = typeof row.onboarding_step === 'number' ? row.onboarding_step : 1;

  return {
    ...row,
    id:                   row.id,
    // Standard camelCase contract
    displayName:          dispName,
    display_name:         dispName,
    studentName:          studentName,
    student_name:         studentName,
    fullName:             dispName,
    full_name:            dispName,
    role:                 row.role || 'student',
    registerNumber:       regNo,
    register_number:      regNo,
    rollNumber:           rollNo,
    roll_number:          rollNo,
    pinitId:              pinitId,
    pinit_id:             pinitId,
    collegeName:          colName,
    college_name:         colName,
    college:              colName,
    university:           univ,
    department:           dept,
    branch:               branchName,
    collegeInfo:          colInfo,
    college_info:         colInfo,
    selectedTeacherId:    teacherId,
    guidanceMentorId:     mentorId,
    atsScore:             row.ats_score ?? 0,
    careerDnaScore:       row.career_dna_score ?? 0,
    trustScore:           row.trust_score ?? 50,
    missionStreak:        row.mission_streak ?? 0,
    recruiterVisibility:  row.recruiter_visibility ?? 0,
    careerReadiness:      row.career_readiness ?? 0,
    communicationScore:   row.communication_score ?? null,
    executionScore:       row.execution_score ?? null,
    leadershipScore:      row.leadership_score ?? null,
    consistencyScore:     row.consistency_score ?? null,
    adaptabilityScore:    row.adaptability_score ?? null,
    confidenceScore:      row.confidence_score ?? null,
    innovationScore:      row.innovation_score ?? null,
    weakAreas:            Array.isArray(row.weak_areas) ? row.weak_areas : [],
    skillTags:            Array.isArray(row.skill_tags) ? row.skill_tags : (Array.isArray(ob.skills) ? ob.skills : []),
    certifications:       Array.isArray(row.certifications) ? row.certifications : [],
    targetRole:           row.target_role || (ob.role as string) || 'Full Stack Engineer',
    careerGoal:           row.career_goal || '',
    intelligenceScore:    row.intelligence_score ?? 0,
    careerDnaArchetype:   row.career_dna_archetype || 'builder',
    xpTotal:              row.xp_total ?? 0,
    weeklyXp:             row.weekly_xp ?? 0,
    xpLevel:              row.xp_level ?? 1,
    missionsCompleted:    row.missions_completed ?? 0,
    interviewsDone:       row.interviews_done ?? 0,
    vaultCount:           row.vault_count ?? 0,
    onboardingStep:       obStep,
    onboardingAnswers:    ob,
    roadmapGenerated:     isRoadmapGen,
    resumeGenerated:      isResumeGen,
    completedQuests:      Array.isArray(row.completed_quests) ? row.completed_quests : [],
    completedMissions:    Array.isArray(row.completed_missions) ? row.completed_missions : [],
    pins:                 typeof row.pins === 'number' ? row.pins : 120,
    pinHistory:           Array.isArray(row.pin_history) ? row.pin_history : [],
    unlockedItems:        row.unlocked_items || {},
    endorsedSkills:       Array.isArray(row.endorsed_skills) ? row.endorsed_skills : [],

    // Snake_case aliases for 100% backward compatibility
    selected_teacher_id:  teacherId,
    guidance_mentor_id:   mentorId,
    ats_score:            row.ats_score ?? 0,
    career_dna_score:     row.career_dna_score ?? 0,
    trust_score:          row.trust_score ?? 50,
    mission_streak:       row.mission_streak ?? 0,
    recruiter_visibility: row.recruiter_visibility ?? 0,
    career_readiness:     row.career_readiness ?? 0,
    communication_score:  row.communication_score ?? null,
    execution_score:      row.execution_score ?? null,
    leadership_score:     row.leadership_score ?? null,
    consistency_score:    row.consistency_score ?? null,
    adaptability_score:   row.adaptability_score ?? null,
    confidence_score:     row.confidence_score ?? null,
    innovation_score:     row.innovation_score ?? null,
    weak_areas:           Array.isArray(row.weak_areas) ? row.weak_areas : [],
    skill_tags:           Array.isArray(row.skill_tags) ? row.skill_tags : (Array.isArray(ob.skills) ? ob.skills : []),
    target_role:          row.target_role || (ob.role as string) || 'Full Stack Engineer',
    career_goal:          row.career_goal || '',
    intelligence_score:   row.intelligence_score ?? 0,
    career_dna_archetype: row.career_dna_archetype || 'builder',
    xp_total:             row.xp_total ?? 0,
    weekly_xp:            row.weekly_xp ?? 0,
    xp_level:             row.xp_level ?? 1,
    missions_completed:   row.missions_completed ?? 0,
    interviews_done:      row.interviews_done ?? 0,
    vault_count:          row.vault_count ?? 0,
    onboarding_step:      obStep,
    onboarding_answers:   ob,
    roadmap_generated:    isRoadmapGen,
    resume_generated:     isResumeGen,
    completed_quests:     Array.isArray(row.completed_quests) ? row.completed_quests : [],
    completed_missions:   Array.isArray(row.completed_missions) ? row.completed_missions : [],
    pin_history:          Array.isArray(row.pin_history) ? row.pin_history : [],
    unlocked_items:       row.unlocked_items || {},
    endorsed_skills:      Array.isArray(row.endorsed_skills) ? row.endorsed_skills : [],
  };
}

export function mapProfileToRow(profile: any): any {
  const row: Record<string, unknown> = {};
  const directFields = [
    'email', 'username', 'display_name', 'full_name', 'role', 'register_number', 'roll_number',
    'selected_teacher_id', 'guidance_mentor_id',
    'ats_score', 'career_dna_score', 'trust_score', 'mission_streak',
    'recruiter_visibility', 'career_readiness', 'communication_score',
    'execution_score', 'leadership_score', 'consistency_score',
    'adaptability_score', 'confidence_score', 'innovation_score',
    'weak_areas', 'skill_tags', 'certifications', 'target_role',
    'career_goal', 'intelligence_score', 'career_dna_archetype',
    'xp_total', 'weekly_xp', 'xp_level', 'missions_completed', 'interviews_done',
    'vault_count', 'onboarding_step', 'onboarding_answers',
    'roadmap_generated', 'resume_generated', 'completed_quests', 'completed_missions', 'phone', 'location',
    'bio', 'linkedin_url', 'github_url', 'portfolio_url', 'department',
    'semester', 'college_name', 'pins', 'pin_history', 'endorsed_skills',
    'pinit_id',
  ];
  for (const f of directFields) {
    if (profile[f] !== undefined) row[f] = profile[f];
  }
  const camelToSnake: Record<string, string> = {
    displayName:         'display_name',
    fullName:            'full_name',
    studentName:         'display_name',
    registerNumber:      'register_number',
    rollNumber:          'roll_number',
    pinitId:             'pinit_id',
    selectedTeacherId:   'selected_teacher_id',
    guidanceMentorId:    'guidance_mentor_id',
    atsScore:            'ats_score',
    careerDnaScore:      'career_dna_score',
    trustScore:          'trust_score',
    missionStreak:       'mission_streak',
    recruiterVisibility: 'recruiter_visibility',
    careerReadiness:     'career_readiness',
    communicationScore:  'communication_score',
    executionScore:      'execution_score',
    leadershipScore:     'leadership_score',
    consistencyScore:    'consistency_score',
    adaptabilityScore:   'adaptability_score',
    confidenceScore:     'confidence_score',
    innovationScore:     'innovation_score',
    weakAreas:           'weak_areas',
    skillTags:           'skill_tags',
    targetRole:          'target_role',
    careerGoal:          'career_goal',
    intelligenceScore:   'intelligence_score',
    careerDnaArchetype:  'career_dna_archetype',
    xpTotal:             'xp_total',
    xpLevel:             'xp_level',
    missionsCompleted:   'missions_completed',
    interviewsDone:      'interviews_done',
    vaultCount:          'vault_count',
    onboardingStep:      'onboarding_step',
    onboardingAnswers:   'onboarding_answers',
    roadmapGenerated:    'roadmap_generated',
    resumeGenerated:     'resume_generated',
    completedQuests:     'completed_quests',
    completedMissions:   'completed_missions',
    linkedinUrl:         'linkedin_url',
    githubUrl:           'github_url',
    portfolioUrl:        'portfolio_url',
    collegeName:         'college_name',
    pinHistory:          'pin_history',
    endorsedSkills:      'endorsed_skills',
  };
  for (const [camel, snake] of Object.entries(camelToSnake)) {
    if (profile[camel] !== undefined && row[snake] === undefined) {
      row[snake] = profile[camel];
    }
  }

  // Resilient Dual-Write: Ensure all institutional and profile metadata is preserved in onboarding_answers
  const existingOb = (row.onboarding_answers && typeof row.onboarding_answers === 'object')
    ? (row.onboarding_answers as Record<string, unknown>)
    : ((profile.onboarding_answers || profile.onboardingAnswers || {}) as Record<string, unknown>);

  const colName = profile.collegeName || profile.college_name || profile.college || (existingOb.collegeName as string) || (existingOb.college as string) || '';
  const deptName = profile.department || profile.branch || (existingOb.department as string) || (existingOb.branch as string) || '';
  const rollVal = profile.rollNumber || profile.roll_number || profile.registerNumber || profile.register_number || (existingOb.rollNumber as string) || '';
  const pinitVal = profile.pinitId || profile.pinit_id || (existingOb.pinitId as string) || rollVal || '';
  const stName = profile.studentName || profile.student_name || profile.displayName || profile.display_name || profile.fullName || profile.full_name || (existingOb.studentName as string) || '';

  row.onboarding_answers = {
    ...existingOb,
    ...(stName ? { studentName: stName, displayName: stName, fullName: stName } : {}),
    ...(colName ? { collegeName: colName, college: colName, university: profile.university || colName, institution: colName } : {}),
    ...(deptName ? { department: deptName, branch: deptName } : {}),
    ...(rollVal ? { rollNumber: rollVal, roll_number: rollVal, registerNumber: rollVal } : {}),
    ...(pinitVal ? { pinitId: pinitVal, pinit_id: pinitVal } : {}),
    ...(profile.collegeInfo || profile.college_info ? { collegeInfo: profile.collegeInfo || profile.college_info } : {}),
  };

  return row;
}

export async function saveVoicePrintToSupabase(uid: string, voicePrint: any) {
  const { data, error } = await supabase
    .from('users')
    .update({ voice_print: voicePrint, updated_at: new Date().toISOString() })
    .eq('id', uid)
    .select('voice_print')
    .maybeSingle();

  if (error) throw error;
  return data?.voice_print;
}

export async function getVoicePrintFromSupabase(uid: string): Promise<any> {
  const { data, error } = await supabase
    .from('users')
    .select('voice_print')
    .eq('id', uid)
    .maybeSingle();

  if (error) return null;
  return data?.voice_print || null;
}

const PRIVILEGED_FIELDS = new Set([
  'role',
  'trust_score',
  'trustScore',
  'ats_score',
  'atsScore',
  'career_dna_score',
  'careerDnaScore',
  'intelligence_score',
  'intelligenceScore',
  'communication_score',
  'execution_score',
  'leadership_score',
  'consistency_score',
  'adaptability_score',
  'confidence_score',
  'innovation_score',
  'career_readiness',
  'xp_total',
  'xp_level',
  'pins',
  'pin_history',
  'voice_print',
  'is_admin',
  'subscription_status',
  'subscriptionStatus',
  'subscription_tier',
  'subscriptionTier',
  'subscription_expires_at',
  'subscriptionExpiresAt',
  'unlocked_items',
  'unlockedItems',
  'badges',
  'completed_quests',
  'completedQuests',
  'completed_missions',
  'completedMissions',
  'certifications',
  'interviews_done',
  'interviewsDone',
  'email',
  'id',
]);

export function stripSelfServicePrivileges<T extends Record<string, any>>(row: T, allowPrivileged = false): T {
  if (allowPrivileged || !row || typeof row !== 'object') return row;
  delete row.mission_streak;
  const sanitized = { ...row };
  for (const key of Object.keys(sanitized)) {
    if (PRIVILEGED_FIELDS.has(key)) {
      delete sanitized[key];
    }
  }
  return sanitized as T;
}

export async function findUserByRegisterNumber(registerNumber: string) {
  const clean = registerNumber.trim().toUpperCase();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`register_number.ilike.${clean},roll_number.ilike.${clean}`)
    .maybeSingle();

  if (error) return null;
  return mapRowToProfile(data);
}

export async function getUserProfile(uid: string): Promise<any> {
  if (!uid || uid === 'guest') return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (!error && data) {
      return mapRowToProfile(data);
    }
  } catch (err) {
    console.warn('[getUserProfile] Supabase query failed:', err);
  }

  return null;
}

export async function createUserProfile(
  uidOrUser: any,
  dataOrRole: any = 'student',
  optsOrMeta?: any
): Promise<any> {
  let uid: string;
  let data: Record<string, any> = {};
  let allowPrivileged = true;

  if (typeof uidOrUser === 'string') {
    uid = uidOrUser;
    data = (typeof dataOrRole === 'object' && dataOrRole !== null) ? dataOrRole : {};
    allowPrivileged = typeof optsOrMeta === 'boolean' ? optsOrMeta : (optsOrMeta?.allowPrivileged !== undefined ? Boolean(optsOrMeta.allowPrivileged) : true);
  } else if (uidOrUser && typeof uidOrUser === 'object') {
    uid = uidOrUser.id;
    if (typeof dataOrRole === 'string') {
      const username = uidOrUser.email ? uidOrUser.email.split('@')[0] : 'user';
      const meta = optsOrMeta || {};
      const displayName = (meta.display_name as string) || (meta.displayName as string) || (uidOrUser.user_metadata?.full_name as string) || (uidOrUser.user_metadata?.name as string) || username;
      data = {
        email: uidOrUser.email || '',
        username,
        display_name: displayName,
        full_name: displayName,
        role: meta.role || dataOrRole || 'student',
        ...meta,
      };
    } else if (typeof dataOrRole === 'object' && dataOrRole !== null) {
      data = dataOrRole;
    }
    allowPrivileged = typeof optsOrMeta === 'boolean' ? optsOrMeta : (optsOrMeta?.allowPrivileged !== undefined ? Boolean(optsOrMeta.allowPrivileged) : true);
  } else {
    return null;
  }

  if (!uid || !IS_VALID_UUID(uid)) {
    return mapRowToProfile({ id: uid, ...data });
  }

  const mappedData = stripSelfServicePrivileges(mapProfileToRow(data) || {}, allowPrivileged);
  const row: Record<string, any> = {
    id: uid,
    ...mappedData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    let currentRow = { ...row };
    let finalResult = null;
    let attempts = 0;

    while (attempts < 5) {
      attempts++;
      const { data: result, error } = await supabase
        .from('users')
        .upsert(currentRow, { onConflict: 'id' })
        .select('*')
        .maybeSingle();

      if (!error && result) {
        finalResult = result;
        break;
      }

      if (error) {
        const match = /Could not find the '([^']+)' column/i.exec(error.message || '') ||
                      /column "([^"]+)" of relation "users" does not exist/i.exec(error.message || '') ||
                      /column "([^"]+)" does not exist/i.exec(error.message || '');
        if (match && match[1] && match[1] in currentRow && match[1] !== 'id') {
          console.warn(`[createUserProfile] Column '${match[1]}' missing in Supabase, dropping from direct row (preserved in onboarding_answers) and retrying.`);
          delete currentRow[match[1]];
          continue;
        } else {
          console.warn('[createUserProfile] Supabase upsert error:', error.message);
          break;
        }
      }
    }

    // Also sync institutional profile table in background if applicable
    syncInstitutionalProfile(uid, data).catch(() => {});

    if (finalResult) {
      return mapRowToProfile(finalResult);
    }
  } catch (err) {
    console.warn('[createUserProfile] Failed to persist to Supabase:', err);
  }

  return mapRowToProfile(row);
}

export async function updateUserProfile(
  uid: string,
  updates: Record<string, any>,
  opts?: { allowPrivileged?: boolean } | boolean
): Promise<any> {
  if (!uid || !IS_VALID_UUID(uid)) {
    return null;
  }
  const allowPrivileged = typeof opts === 'boolean' ? opts : Boolean(opts?.allowPrivileged);
  const rowUpdates = mapProfileToRow(updates);
  const safeUpdates = stripSelfServicePrivileges(rowUpdates, allowPrivileged);
  safeUpdates.updated_at = new Date().toISOString();

  try {
    let currentUpdates = { ...safeUpdates };
    let finalData = null;
    let attempts = 0;

    while (attempts < 5) {
      attempts++;
      const { data, error } = await supabase
        .from('users')
        .update(currentUpdates)
        .eq('id', uid)
        .select('*')
        .maybeSingle();

      if (!error && data) {
        finalData = data;
        break;
      }

      if (error) {
        const match = /Could not find the '([^']+)' column/i.exec(error.message || '') ||
                      /column "([^"]+)" of relation "users" does not exist/i.exec(error.message || '') ||
                      /column "([^"]+)" does not exist/i.exec(error.message || '');
        if (match && match[1] && match[1] in currentUpdates) {
          console.warn(`[updateUserProfile] Column '${match[1]}' missing, dropping and retrying.`);
          delete currentUpdates[match[1]];
          continue;
        } else {
          console.error('[updateUserProfile] Supabase update error:', error.message || error);
          break;
        }
      }
    }

    // Sync institutional profile in background
    syncInstitutionalProfile(uid, updates).catch(() => {});

    if (finalData) {
      return mapRowToProfile(finalData);
    }
  } catch (err) {
    console.error('[updateUserProfile] Supabase update failed:', err);
  }

  return null;
}

export async function ensureSeedData(uid: string, profile: Record<string, unknown>) {
  if (!uid || uid === 'guest') return;

  try {
    const { data: missions } = await supabase
      .from('missions')
      .select('id')
      .eq('user_id', uid)
      .limit(1);

    if (!missions || missions.length === 0) {
      const today = new Date().toISOString().slice(0, 10);
      const rows = DEMO_MISSIONS.map(m => ({
        user_id: uid,
        title: m.title,
        description: m.description,
        type: m.type,
        status: 'pending',
        proof_type: m.proof_type,
        due_date: today,
        trust_reward: m.trust_reward,
        source_weakness: m.source_weakness,
        estimated_minutes: m.estimated_minutes,
        learn_url: m.learn_url,
        ai_evaluation: null,
      }));

      await supabase.from('missions').insert(rows);
    }
  } catch (err) {
    console.warn('[ensureSeedData] Error seeding missions:', err);
  }
}

export async function getUsersPage(
  options: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  } = {}
): Promise<{
  users: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 25));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('users')
    .select('id, email, display_name, role, register_number, department, semester, college_name, ats_score, career_dna_score, trust_score, xp_total, created_at, updated_at', { count: 'exact' });

  if (options.role && options.role !== 'all') {
    query = query.eq('role', options.role);
  }

  if (options.search) {
    const s = options.search.trim();
    query = query.or(`display_name.ilike.%${s}%,email.ilike.%${s}%,register_number.ilike.%${s}%`);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('[getUsersPage] Query failed:', error);
    return { users: [], total: 0, page, limit, totalPages: 0 };
  }

  const total = count || 0;
  return {
    users: (data || []).map(r => mapRowToProfile(r) as Record<string, unknown>),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAllUsers(maxLimit = 100): Promise<any[]> {
  const boundedLimit = Math.min(100, Math.max(1, maxLimit));
  const { users } = await getUsersPage({ page: 1, limit: boundedLimit });
  return users;
}
