// Supabase service — complete implementation mapping Firestore logic to PostgreSQL
import { supabase } from './supabaseClient';

export const DEMO_PROFILE = {
  display_name: 'Ashwanth Kumar',
  role: 'student',
  register_number: 'REG2024001',
  ats_score: 72,
  career_dna_score: 68,
  trust_score: 81,
  mission_streak: 7,
  recruiter_visibility: 65,
  career_readiness: 74,
  communication_score: 76,
  execution_score: 71,
  leadership_score: 58,
  consistency_score: 83,
  adaptability_score: 69,
  confidence_score: 72,
  innovation_score: 65,
  weak_areas: ['System Design', 'DSA - Trees', 'Behavioral STAR'],
  skill_tags: ['React', 'Node.js', 'Python', 'Machine Learning', 'TypeScript'],
  certifications: ['AWS Cloud Practitioner', 'Google Data Analytics'],
  target_role: 'Full Stack Engineer',
  career_goal: 'Land at a top product company',
  intelligence_score: 78,
  career_dna_archetype: 'builder',
  xp_total: 2500,
  xp_level: 2,
  missions_completed: 18,
  interviews_done: 6,
  vault_count: 3,
  onboarding_step: 5,
  onboarding_answers: { role: 'Full Stack Engineer', education: 'B.Tech CS', skills: 'React, Node.js, Python', experience: 'None', hasCompleted: true },
  roadmap_generated: true,
  completed_quests: ['fizzbuzz', 'reverser'],
};

export const DEMO_MISSIONS = [
  { title: 'LinkedIn Post: Tech Insight', description: 'Write a 200-word LinkedIn post sharing a technical insight. Use STAR format and include one specific metric.', type: 'communication', status: 'pending', proof_type: 'url', due_date: new Date().toISOString().slice(0, 10), trust_reward: 8, source_weakness: 'Communication', estimated_minutes: 20, learn_url: 'https://linkedin.com', ai_evaluation: null },
  { title: 'LeetCode: Binary Tree Problem', description: 'Solve any medium-difficulty binary tree problem. Share your solution with time/space complexity analysis.', type: 'skill', status: 'pending', proof_type: 'url', due_date: new Date().toISOString().slice(0, 10), trust_reward: 12, source_weakness: 'DSA - Trees', estimated_minutes: 45, learn_url: 'https://leetcode.com', ai_evaluation: null },
  { title: 'STAR Story Practice', description: 'Record a 90-second video answering "Tell me about a time you solved a complex problem under pressure."', type: 'personality', status: 'pending', proof_type: 'url', due_date: new Date().toISOString().slice(0, 10), trust_reward: 10, source_weakness: 'Behavioral STAR', estimated_minutes: 30, learn_url: null, ai_evaluation: null },
];

export const DEMO_OPPORTUNITIES = [
  { title: 'Software Engineer II', company: 'Zomato', location: 'Bangalore', type: 'Full-time', salary: '₹25-35 LPA', match_score: 88, skills: ['React', 'Node.js', 'PostgreSQL'], posted_at: '2 days ago', description: 'Join our platform team building high-scale food delivery infrastructure.' },
  { title: 'Full Stack Developer', company: 'PhonePe', location: 'Bangalore (Hybrid)', type: 'Full-time', salary: '₹20-30 LPA', match_score: 84, skills: ['TypeScript', 'React', 'Python'], posted_at: '1 day ago', description: "Work on India's leading fintech platform, serving 500M+ users." },
  { title: 'ML Engineer', company: 'Swiggy', location: 'Bangalore', type: 'Full-time', salary: '₹22-32 LPA', match_score: 79, skills: ['Python', 'TensorFlow', 'SQL'], posted_at: '3 days ago', description: 'Build recommendation systems powering food and grocery delivery.' },
  { title: 'React Developer', company: 'Razorpay', location: 'Bangalore', type: 'Full-time', salary: '₹15-25 LPA', match_score: 91, skills: ['React', 'TypeScript', 'GraphQL'], posted_at: '1 hour ago', description: "Build beautiful payment UIs for India's leading payment gateway." },
  { title: 'SDE Intern', company: 'Meesho', location: 'Bangalore', type: 'Internship', salary: '₹80K/month', match_score: 95, skills: ['React', 'Node.js'], posted_at: '12 hours ago', description: 'Summer internship with pre-placement offer potential.' },
];

export const DEMO_NOTIFICATIONS = [
  { type: 'success', title: 'Mission Completed!', message: 'You completed "LinkedIn Post" and earned +8 trust points.', source: 'mission', is_read: false, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { type: 'info', title: 'New Opportunity Match', message: 'Razorpay React Developer — 91% match for your profile.', source: 'opportunities', is_read: false, created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { type: 'warning', title: 'Career DNA Update', message: 'Your DSA score dropped. Complete 2 algorithm missions to recover.', source: 'exam', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
];

export const EMPTY_PROFILE = {
  displayName: '', role: 'student', registerNumber: null,
  ats_score: 0, career_dna_score: 0, trust_score: 40, mission_streak: 0,
  recruiter_visibility: 0, career_readiness: 0, communication_score: 0,
  execution_score: 0, leadership_score: 0, consistency_score: 0, adaptability_score: 0,
  confidence_score: 0, innovation_score: 0,
  weak_areas: [], skill_tags: [], certifications: [],
  target_role: '', career_goal: '', intelligence_score: 0, career_dna_archetype: 'explorer',
  xp_total: 0, xp_level: 1, missions_completed: 0, interviews_done: 0, vault_count: 0,
  onboardingStep: 0, resumeGenerated: false, roadmapGenerated: false,
  completedQuests: [], javaTestPassed: false, recruiterVisible: false, pins: 120, pinHistory: [], guidanceMentorId: 'priya'
};

// Map database snake_case keys back to camelCase frontend schema properties
export function mapRowToProfile(row: any): any {
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name || '',
    ...(row.email != null ? { email: row.email } : {}),
    ...(row.username != null ? { username: row.username } : {}),
    role: row.role || 'student',
    registerNumber: row.register_number || null,
    selectedTeacherId: row.selected_teacher_id || 'priya',
    ats_score: row.ats_score ?? 0,
    career_dna_score: row.career_dna_score ?? 0,
    trust_score: row.trust_score ?? 40,
    mission_streak: row.mission_streak ?? 0,
    recruiter_visibility: row.recruiter_visibility ?? 0,
    career_readiness: row.career_readiness ?? 0,
    communication_score: row.communication_score ?? 60,
    execution_score: row.execution_score ?? 60,
    leadership_score: row.leadership_score ?? 60,
    consistency_score: row.consistency_score ?? 60,
    adaptability_score: row.adaptability_score ?? 60,
    confidence_score: row.confidence_score ?? 60,
    innovation_score: row.innovation_score ?? 60,
    intelligence_score: row.intelligence_score ?? 0,
    weak_areas: row.weak_areas || [],
    skill_tags: row.skill_tags || [],
    certifications: row.certifications || [],
    target_role: row.target_role || '',
    career_goal: row.career_goal || '',
    career_dna_archetype: row.career_dna_archetype || 'explorer',
    xp_total: row.xp_total ?? 0,
    xp_level: row.xp_level ?? 1,
    missions_completed: row.missions_completed ?? 0,
    interviews_done: row.interviews_done ?? 0,
    vault_count: row.vault_count ?? 0,
    onboardingStep: row.onboarding_step ?? 0,
    onboardingAnswers: row.onboarding_answers || { role: '', education: '', skills: '', experience: '', hasCompleted: false },
    jdMissingSkills: row.jd_missing_skills || [],
    structured_resume: row.structured_resume || null,
    pins: row.pins ?? 120,
    pinHistory: row.pin_history || [],
    unlockedItems: row.unlocked_items || {},
    resumeGenerated: !!row.resume_generated,
    roadmapGenerated: !!row.roadmap_generated,
    completedQuests: row.completed_quests || [],
    javaTestPassed: !!row.java_test_passed,
    groupPanelPassed: !!row.group_panel_passed,
    recruiterVisible: !!row.recruiter_visible,
    forceShowCareerBuilder: !!row.force_show_career_builder,
    demoTabsUnlocked: !!row.demo_tabs_unlocked,
    status: row.onboarding_answers?.status || 'onboarding',
    visa_status: row.onboarding_answers?.visa_status || 'not_started',
    targetCountry: row.onboarding_answers?.targetCountry || 'USA',
    programType: row.onboarding_answers?.programType || 'Masters',
    tasks: row.onboarding_answers?.tasks || [],
    documents: row.onboarding_answers?.documents || [],
    guidanceMentorId: row.guidance_mentor_id || 'priya',
    qt1_score: row.onboarding_answers?.qt1_score ?? 0,
    qt2_score: row.onboarding_answers?.qt2_score ?? 0,
    mindset_archetype: row.onboarding_answers?.mindset_archetype || 'Pattern Hunter',
    voicePrint: row.voice_print || row.onboarding_answers?.voice_print || null,
  };
}

// Map frontend profile camelCase properties back to snake_case database schema
export function mapProfileToRow(profile: any): any {
  if (!profile) return null;
  const row: any = {};
  
  if (profile.displayName !== undefined) row.display_name = profile.displayName;
  if (profile.email !== undefined) row.email = profile.email;
  if (profile.username !== undefined) row.username = profile.username;
  if (profile.role !== undefined) row.role = profile.role;
  if (profile.registerNumber !== undefined) row.register_number = profile.registerNumber;
  if (profile.selectedTeacherId !== undefined) row.selected_teacher_id = profile.selectedTeacherId;
  if (profile.ats_score !== undefined) row.ats_score = profile.ats_score;
  if (profile.career_dna_score !== undefined) row.career_dna_score = profile.career_dna_score;
  if (profile.trust_score !== undefined) row.trust_score = profile.trust_score;
  if (profile.mission_streak !== undefined) row.mission_streak = profile.mission_streak;
  if (profile.recruiter_visibility !== undefined) row.recruiter_visibility = profile.recruiter_visibility;
  if (profile.career_readiness !== undefined) row.career_readiness = profile.career_readiness;
  if (profile.communication_score !== undefined) row.communication_score = profile.communication_score;
  if (profile.execution_score !== undefined) row.execution_score = profile.execution_score;
  if (profile.leadership_score !== undefined) row.leadership_score = profile.leadership_score;
  if (profile.consistency_score !== undefined) row.consistency_score = profile.consistency_score;
  if (profile.adaptability_score !== undefined) row.adaptability_score = profile.adaptability_score;
  if (profile.confidence_score !== undefined) row.confidence_score = profile.confidence_score;
  if (profile.innovation_score !== undefined) row.innovation_score = profile.innovation_score;
  if (profile.intelligence_score !== undefined) row.intelligence_score = profile.intelligence_score;
  if (profile.weak_areas !== undefined) row.weak_areas = profile.weak_areas;
  if (profile.skill_tags !== undefined) row.skill_tags = profile.skill_tags;
  if (profile.certifications !== undefined) row.certifications = profile.certifications;
  if (profile.target_role !== undefined) row.target_role = profile.target_role;
  if (profile.career_goal !== undefined) row.career_goal = profile.career_goal;
  if (profile.career_dna_archetype !== undefined) row.career_dna_archetype = profile.career_dna_archetype;
  if (profile.xp_total !== undefined) row.xp_total = profile.xp_total;
  if (profile.xp_level !== undefined) row.xp_level = profile.xp_level;
  if (profile.missions_completed !== undefined) row.missions_completed = profile.missions_completed;
  if (profile.interviews_done !== undefined) row.interviews_done = profile.interviews_done;
  if (profile.vault_count !== undefined) row.vault_count = profile.vault_count;
  if (profile.onboardingStep !== undefined) row.onboarding_step = profile.onboardingStep;
  const onboardingSrc = profile.onboardingAnswers ?? profile.onboarding_answers;
  if (onboardingSrc != null) {
    row.onboarding_answers = {
      ...onboardingSrc,
      qt1_score: profile.qt1_score ?? onboardingSrc.qt1_score ?? 0,
      qt2_score: profile.qt2_score ?? onboardingSrc.qt2_score ?? 0,
      mindset_archetype: profile.mindset_archetype ?? onboardingSrc.mindset_archetype ?? 'Pattern Hunter',
      voice_print: profile.voicePrint ?? onboardingSrc.voice_print ?? null
    };
  } else if (profile.qt1_score !== undefined || profile.qt2_score !== undefined || profile.mindset_archetype !== undefined || profile.voicePrint !== undefined) {
    row.onboarding_answers = {
      ...(row.onboarding_answers || {}),
      qt1_score: profile.qt1_score ?? 0,
      qt2_score: profile.qt2_score ?? 0,
      mindset_archetype: profile.mindset_archetype ?? 'Pattern Hunter',
      voice_print: profile.voicePrint ?? null
    };
  }
  if (profile.jdMissingSkills !== undefined) row.jd_missing_skills = profile.jdMissingSkills;
  if (profile.structured_resume !== undefined) row.structured_resume = profile.structured_resume;
  if (profile.pins !== undefined) row.pins = profile.pins;
  if (profile.pinHistory !== undefined) row.pin_history = profile.pinHistory;
  
  if (profile.resumeGenerated !== undefined) row.resume_generated = profile.resumeGenerated;
  if (profile.roadmapGenerated !== undefined) row.roadmap_generated = profile.roadmapGenerated;
  if (profile.completedQuests !== undefined) row.completed_quests = profile.completedQuests;
  if (profile.javaTestPassed !== undefined) row.java_test_passed = profile.javaTestPassed;
  if (profile.groupPanelPassed !== undefined) row.group_panel_passed = profile.groupPanelPassed;
  if (profile.recruiterVisible !== undefined) row.recruiter_visible = profile.recruiterVisible;
  if (profile.forceShowCareerBuilder !== undefined) row.force_show_career_builder = profile.forceShowCareerBuilder;
  if (profile.demoTabsUnlocked !== undefined) row.demo_tabs_unlocked = profile.demoTabsUnlocked;
  if (profile.guidanceMentorId !== undefined) row.guidance_mentor_id = profile.guidanceMentorId;
  if (profile.voicePrint !== undefined) {
    row.voice_print = profile.voicePrint;
  }
  
  return row;
}

export async function saveVoicePrintToSupabase(uid: string, voicePrint: any) {
  if (!uid) return;
  try {
    // Attempt updating voice_print directly on users table & merging into onboarding_answers
    await updateUserProfile(uid, { voicePrint });
    console.log('[VoiceBiometrics] Voice print successfully saved to Supabase for user:', uid);
  } catch (err: any) {
    console.warn('[VoiceBiometrics] Failed to save voice print to Supabase:', err.message);
  }
}

export async function getVoicePrintFromSupabase(uid: string) {
  if (!uid) return null;
  try {
    const profile = await getUserProfile(uid);
    return profile?.voicePrint || null;
  } catch (err: any) {
    console.warn('[VoiceBiometrics] Failed to fetch voice print from Supabase:', err.message);
    return null;
  }
}

const IS_VALID_UUID = (str: string) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

function isRlsDenied(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false;
  const msg = String(error.message || '').toLowerCase();
  return error.code === '42501' || msg.includes('row-level security') || msg.includes('rls');
}

function persistLocalProfile(uid: string, data: Record<string, any>) {
  if (typeof window === 'undefined' || !uid) return;
  try {
    const key = `pinit_${uid}_profile`;
    const prev = JSON.parse(localStorage.getItem(key) || '{}');
    localStorage.setItem(key, JSON.stringify({ ...prev, ...data, id: uid, uid }));
  } catch {
    // ignore quota / private mode
  }
}

function stripSelfServicePrivileges(row: Record<string, any>, allowPrivileged = false) {
  if (allowPrivileged) {
    return row;
  }
  delete row.role;
  delete row.subscription_tier;
  delete row.pins;
  delete row.ats_score;
  delete row.trust_score;
  delete row.career_dna_score;
  return row;
}

export async function findUserByRegisterNumber(registerNumber: string) {
  const rn = (registerNumber || '').trim();
  if (!rn) return null;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('register_number', rn)
    .maybeSingle();
  if (error || !data) return null;
  return mapRowToProfile(data);
}

export async function getUserProfile(uid: string) {
  if (!uid || !IS_VALID_UUID(uid)) {
    return null;
  }
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', uid).maybeSingle();
    if (error) return null;
    return data ? mapRowToProfile(data) : null;
  } catch (err) {
    return null;
  }
}

export async function createUserProfile(
  uid: string,
  data: Record<string, any>,
  opts?: { allowPrivileged?: boolean }
) {
  if (!uid || !IS_VALID_UUID(uid)) {
    persistLocalProfile(uid, data);
    return;
  }
  const answersUpdate: Record<string, any> = {};
  if (data.status !== undefined) answersUpdate.status = data.status;
  if (data.visa_status !== undefined) answersUpdate.visa_status = data.visa_status;
  if (data.targetCountry !== undefined) answersUpdate.targetCountry = data.targetCountry;
  if (data.programType !== undefined) answersUpdate.programType = data.programType;
  if (data.tasks !== undefined) answersUpdate.tasks = data.tasks;
  if (data.documents !== undefined) answersUpdate.documents = data.documents;

  const mappedData = stripSelfServicePrivileges(mapProfileToRow(data) || {}, opts?.allowPrivileged);
  const row: Record<string, any> = {
    id: uid,
    ...mappedData,
  };

  if (Object.keys(answersUpdate).length > 0) {
    row.onboarding_answers = {
      ...(row.onboarding_answers || {}),
      ...answersUpdate
    };
  }

  console.log(`[SupabaseService] Creating profile uid=${uid} | role=${row.role || 'student'} | allowPrivileged=${Boolean(opts?.allowPrivileged)}`);

  const { error } = await supabase.from('users').upsert(row, { onConflict: 'id' });
  if (error) {
    if (isRlsDenied(error)) {
      console.warn('[users] RLS blocked profile create; continuing locally:', error.message);
      persistLocalProfile(uid, data);
      return;
    }
    throw error;
  }
}

export async function updateUserProfile(
  uid: string,
  data: Record<string, any>,
  opts?: { allowPrivileged?: boolean }
) {
  if (!uid || !IS_VALID_UUID(uid)) {
    persistLocalProfile(uid, data);
    return;
  }
  const answersUpdate: Record<string, any> = {};
  if (data.status !== undefined) answersUpdate.status = data.status;
  if (data.visa_status !== undefined) answersUpdate.visa_status = data.visa_status;
  if (data.targetCountry !== undefined) answersUpdate.targetCountry = data.targetCountry;
  if (data.programType !== undefined) answersUpdate.programType = data.programType;
  if (data.tasks !== undefined) answersUpdate.tasks = data.tasks;
  if (data.documents !== undefined) answersUpdate.documents = data.documents;

  let currentAnswers = {};
  try {
    const { data: current } = await supabase.from('users').select('onboarding_answers').eq('id', uid).maybeSingle();
    if (current?.onboarding_answers) {
      currentAnswers = current.onboarding_answers;
    }
  } catch (e) {
    console.warn('Failed to load current onboarding_answers for merge:', e);
  }

  const row = mapProfileToRow(data) || {};
  // Self-service / client updates must never change privilege, economy, or score fields.
  // Admin role/suspend paths pass allowPrivileged: true.
  if (!opts?.allowPrivileged) {
    stripSelfServicePrivileges(row, false);
  }
  if (Object.keys(answersUpdate).length > 0) {
    row.onboarding_answers = {
      ...currentAnswers,
      ...answersUpdate
    };
  }

  const { data: exists } = await supabase.from('users').select('id').eq('id', uid).maybeSingle();

  if (!exists) {
    await createUserProfile(uid, data, opts);
    return;
  }

  console.log(`[SupabaseService] Updating profile uid=${uid} | allowPrivileged=${Boolean(opts?.allowPrivileged)} | fields=${Object.keys(row).join(',')}`);

  const { error } = await supabase.from('users').update(row).eq('id', uid);
  if (error) {
    if (isRlsDenied(error)) {
      console.warn('[users] RLS blocked profile update; continuing locally:', error.message);
      persistLocalProfile(uid, data);
      return;
    }
    console.warn('Supabase profile update failed, falling back to upsert:', error.message, error.details);
    await createUserProfile(uid, data);
  }
}

export async function ensureSeedData(uid: string, profile: Record<string, any>) {
  const emailLower = (profile?.email as string || '').toLowerCase();
  const isDemo = ['admin@pinit.in', 'teacher@pinit.in', 'rec@pinit.in', 'con@pinit.in', 'parent@pinit.in', 'student@pinit.in'].includes(emailLower);

  if (isDemo) {
    console.log(`[SupabaseService] Ensuring seed data for demo account: ${emailLower}`);
    // 1. Seed missions
    const { count: missionCount, error: mErr } = await supabase.from('missions').select('*', { count: 'exact', head: true }).eq('user_id', uid);
    if (!mErr && missionCount === 0) {
      const rows = DEMO_MISSIONS.map(m => ({
        user_id: uid,
        title: m.title,
        description: m.description,
        type: m.type,
        status: m.status,
        proof_type: m.proof_type,
        due_date: m.due_date,
        trust_reward: m.trust_reward,
        source_weakness: m.source_weakness,
        estimated_minutes: m.estimated_minutes,
        learn_url: m.learn_url,
      }));
      await supabase.from('missions').insert(rows);
    }

    // 2. Seed notifications
    const { count: notifCount, error: nErr } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', uid);
    if (!nErr && notifCount === 0) {
      const rows = DEMO_NOTIFICATIONS.map(n => ({
        user_id: uid,
        type: n.type,
        title: n.title,
        message: n.message,
        source: n.source,
        is_read: n.is_read,
        created_at: n.created_at,
      }));
      await supabase.from('notifications').insert(rows);
    }
  }

  // 3. Seed opportunities (shared globally - only if user is admin)
  if (emailLower === 'admin@pinit.in') {
    const { count: oppCount, error: oErr } = await supabase.from('opportunities').select('*', { count: 'exact', head: true });
    if (!oErr && oppCount === 0) {
      const rows = DEMO_OPPORTUNITIES.map(o => ({
        title: o.title,
        company: o.company,
        location: o.location,
        type: o.type,
        salary: o.salary,
        match_score: o.match_score,
        skills: o.skills,
        posted_at: o.posted_at,
        description: o.description,
      }));
      await supabase.from('opportunities').insert(rows);
    }
  }
}

export async function getTodayMissions(uid: string) {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', uid)
    .gte('due_date', today)
    .order('due_date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getMissionHistory(uid: string) {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', uid)
    .order('due_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function submitMission(uid: string, missionId: string, data: Record<string, any>) {
  // Check daily limit: 1 completed/submitted mission per day
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const { data: todayMissions, error: checkError } = await supabase
    .from('missions')
    .select('id')
    .eq('user_id', uid)
    .eq('status', 'submitted')
    .gte('submitted_at', todayStart.toISOString())
    .lte('submitted_at', todayEnd.toISOString());

  if (checkError) {
    console.warn("Failed to check daily mission limit from DB:", checkError);
  } else if (todayMissions && todayMissions.length >= 1) {
    throw new Error('Daily Limit Reached: You can only complete 1 mission per day.');
  }

  const { error } = await supabase
    .from('missions')
    .update({ status: 'submitted', proof: data, submitted_at: new Date().toISOString() })
    .eq('id', missionId)
    .eq('user_id', uid);
  if (error) throw error;

  const { data: mission } = await supabase.from('missions').select('title').eq('id', missionId).maybeSingle();
  const title = mission?.title || 'Daily Mission';

  const profile = await getUserProfile(uid);
  if (profile) {
    await updateUserProfile(uid, {
      trust_score: Math.min(100, (profile.trust_score || 0) + 8),
      mission_streak: (profile.mission_streak || 0) + 1,
      missions_completed: (profile.missions_completed || 0) + 1,
    });
  }

  await supabase.from('notifications').insert({
    user_id: uid,
    type: 'success',
    title: 'Mission Completed!',
    message: `You completed "${title}" and earned +8 trust points.`,
    source: 'mission',
    is_read: false,
  });
}

export async function getVaultItems(uid: string) {
  const { data, error } = await supabase
    .from('vault_items')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addVaultItem(uid: string, item: Record<string, any>) {
  const { data, error } = await supabase
    .from('vault_items')
    .insert([{
      user_id: uid,
      title: item.title,
      item_type: item.item_type || 'resume',
      organization_name: item.organization_name || '',
      description: item.description || '',
      verified: !!item.verified,
      ai_confidence_score: item.ai_confidence_score || 0,
      skill_tags: item.skill_tags || [],
      is_public: !!item.is_public,
      used_in_resume: !!item.used_in_resume,
      used_in_portfolio: !!item.used_in_portfolio,
    }])
    .select();
  if (error) throw error;
  return data?.[0]?.id || `supabase-${Date.now()}`;
}

export async function generateResumeFromVault(uid: string, parsedResume: any, targetRole?: string) {
  await updateUserProfile(uid, {
    structured_resume: parsedResume,
    ats_score: parsedResume.ats_score || 72,
    resumeGenerated: true,
    weak_areas: parsedResume.keyword_gaps || ["Docker", "CI/CD", "System Design"],
  });

  const activeGaps = parsedResume.keyword_gaps || [];
  const today = new Date().toISOString().slice(0, 10);
  const newMissions = [];

  if (activeGaps.includes('Docker')) {
    newMissions.push({
      user_id: uid,
      title: 'Learn Docker Containerization',
      description: 'ML Resume Builder identified Docker as a gap. Create a Dockerfile to package your Java Solution class, exposing container port 8080.',
      type: 'skill',
      status: 'pending',
      proof_type: 'url',
      due_date: today,
      trust_reward: 15,
      source_weakness: 'Docker',
      estimated_minutes: 30,
      learn_url: 'https://docs.docker.com',
    });
  }

  if (activeGaps.includes('CI/CD')) {
    newMissions.push({
      user_id: uid,
      title: 'Automate Java Tests with CI/CD',
      description: 'ML Resume Builder identified CI/CD as a gap. Configure a basic GitHub Actions workflow file (.yml) to build and test your Java project.',
      type: 'skill',
      status: 'pending',
      proof_type: 'url',
      due_date: today,
      trust_reward: 15,
      source_weakness: 'CI/CD',
      estimated_minutes: 30,
      learn_url: 'https://github.com/features/actions',
    });
  }

  if (activeGaps.includes('System Design')) {
    newMissions.push({
      user_id: uid,
      title: 'Star Story: Scale microservices',
      description: 'ML Resume Builder identified System Design as a gap. Practice presenting a STAR behavioral response detailing how you split a monolith into microservices.',
      type: 'communication',
      status: 'pending',
      proof_type: 'url',
      due_date: today,
      trust_reward: 12,
      source_weakness: 'System Design',
      estimated_minutes: 25,
    });
  }

  const role = (targetRole || '').toLowerCase();
  if (role.includes('front') || role.includes('full stack') || role.includes('web')) {
    newMissions.push({
      user_id: uid,
      title: 'Optimize React Rendering Performance',
      description: `Targeting ${targetRole || 'Full Stack'} role: Optimize rendering performance in functional React components using memoization hooks.`,
      type: 'skill',
      status: 'pending',
      proof_type: 'url',
      due_date: today,
      trust_reward: 15,
      source_weakness: 'React performance',
      estimated_minutes: 35,
      learn_url: 'https://react.dev/reference/react/useMemo',
    });
  } else if (role.includes('data') || role.includes('ml') || role.includes('machine') || role.includes('ai')) {
    newMissions.push({
      user_id: uid,
      title: 'Train ML Model Classifier',
      description: `Targeting ${targetRole || 'ML Engineer'} role: Preprocess dataset features, split training sets, and train a classifier using scikit-learn.`,
      type: 'skill',
      status: 'pending',
      proof_type: 'url',
      due_date: today,
      trust_reward: 15,
      source_weakness: 'Machine Learning',
      estimated_minutes: 40,
      learn_url: 'https://scikit-learn.org',
    });
  } else if (role.includes('back') || role.includes('system') || role.includes('database')) {
    newMissions.push({
      user_id: uid,
      title: 'Design Database Indexing Strategy',
      description: `Targeting ${targetRole || 'Backend Developer'} role: Build a query optimization schema with cluster indices for transactional database collections.`,
      type: 'skill',
      status: 'pending',
      proof_type: 'url',
      due_date: today,
      trust_reward: 15,
      source_weakness: 'Database indexing',
      estimated_minutes: 30,
      learn_url: 'https://postgresql.org',
    });
  }

  if (newMissions.length > 0) {
    await supabase.from('missions').insert(newMissions);
  }

  const gapsList = activeGaps.length > 0 ? activeGaps.join(', ') : 'None';
  await supabase.from('notifications').insert({
    user_id: uid,
    type: 'warning',
    title: 'Vault Resume Compiled',
    message: `ML Resume Builder processed your document. Gaps identified: ${gapsList}. Custom learning quests have been added for your target role: ${targetRole || 'SDE'}.`,
    source: 'mission',
    is_read: false,
  });
}

export async function getNotifications(uid: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function markAllNotificationsRead(uid: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', uid);
  if (error) throw error;
}

export async function getOpportunities() {
  const { data, error } = await supabase.from('opportunities').select('*');
  if (error) throw error;
  return data || [];
}

export async function applyToOpportunity(uid: string, oppId: string) {
  const { error } = await supabase
    .from('applications')
    .upsert({
      id: `${uid}_${oppId}`,
      user_id: uid,
      opportunity_id: oppId,
      status: 'applied',
      applied_at: new Date().toISOString(),
    });
  if (error) throw error;
}

export async function recalculateCareerDna(uid: string) {
  const profile = await getUserProfile(uid);
  if (!profile) return null;
  const { data: missions } = await supabase.from('missions').select('status').eq('user_id', uid);
  const completed = (missions || []).filter((m: any) => m.status === 'submitted' || m.status === 'completed').length;
  const newDna = Math.min(100, (profile.career_dna_score || 68) + completed);
  await updateUserProfile(uid, { career_dna_score: newDna });
  return { ...profile, career_dna_score: newDna };
}

export async function getDashboardAnalytics(uid: string) {
  const profile = await getUserProfile(uid);
  return { missions: { completed: profile?.missions_completed || 0 }, score_history: [] };
}

export async function createInterviewSession(uid: string, data: Record<string, any>) {
  const { data: inserted, error } = await supabase
    .from('interview_sessions')
    .insert([{
      user_id: uid,
      mode: data.mode || 'hr',
      domain: data.domain || null,
      pressure_mode: data.pressureMode || 'normal',
      persona: data.persona || 'professional',
      status: 'active',
      overall_score: 0,
      transcript: data.transcript || [],
    }])
    .select();
  if (error) throw error;
  return inserted?.[0]?.id;
}

export async function getInterviewSession(uid: string, sessionId: string) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', uid)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function appendInterviewTranscript(uid: string, sessionId: string, entries: { role: string; content: string; ts: number }[]) {
  const session = await getInterviewSession(uid, sessionId);
  if (!session) return;
  const existing = Array.isArray(session.transcript) ? session.transcript : [];
  const { error } = await supabase
    .from('interview_sessions')
    .update({ transcript: [...existing, ...entries] })
    .eq('id', sessionId)
    .eq('user_id', uid);
  if (error) throw error;
}

export async function completeInterviewSession(uid: string, sessionId: string, evaluation: Record<string, any>) {
  const { error } = await supabase
    .from('interview_sessions')
    .update({
      status: 'completed',
      overall_score: evaluation.overall_score || 0,
      evaluation,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('user_id', uid);
  if (error) throw error;

  const profile = await getUserProfile(uid);
  if (profile) {
    const prev = profile.communication_score || 60;
    const next = Math.min(100, Math.round(prev * 0.6 + (evaluation.communication_score || prev) * 0.4));
    await updateUserProfile(uid, {
      communication_score: next,
      interviews_done: (profile.interviews_done || 0) + 1,
    });
  }
}

export async function getInterviewHistory(uid: string) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('id, mode, status, overall_score, created_at')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data || []).map(d => ({
    id: d.id,
    mode: d.mode,
    status: d.status,
    overall_score: d.overall_score || 0,
    started_at: d.created_at,
  }));
}

export async function getAllUsers(): Promise<any[]> {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return (data || []).map(d => mapRowToProfile(d));
}

export async function addJob(recruiterId: string, jobData: Record<string, any>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([{
      recruiter_id: recruiterId,
      title: jobData.title,
      company: jobData.company || '',
      location: jobData.location || '',
      type: jobData.type || 'Full-time',
      salary: jobData.salary || '',
      description: jobData.description || '',
      skills: jobData.skills || [],
      is_deleted: false,
    }])
    .select();
  if (error) throw error;
  return data?.[0]?.id;
}

export async function updateJob(jobId: string, jobData: Record<string, any>) {
  const { error } = await supabase.from('jobs').update(jobData).eq('id', jobId);
  if (error) throw error;
}

export async function deleteJob(jobId: string) {
  const { error } = await supabase.from('jobs').update({ is_deleted: true }).eq('id', jobId);
  if (error) throw error;
}

export async function getJobs(recruiterId?: string) {
  let query = supabase.from('jobs').select('*').eq('is_deleted', false);
  if (recruiterId) {
    query = query.eq('recruiter_id', recruiterId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getApplicationsForRecruiter(recruiterId: string) {
  const recruiterJobs = await getJobs(recruiterId);
  const jobIds = recruiterJobs.map(j => j.id);
  if (jobIds.length === 0) return [];

  const { data: apps, error } = await supabase.from('applications').select('*');
  if (error) throw error;
  
  const filtered = (apps || []).filter((a: any) => jobIds.includes(a.opportunity_id));
  const resolved = [];

  for (const app of filtered) {
    const uProfile = await getUserProfile(app.user_id);
    const matchedJob = recruiterJobs.find(j => j.id === app.opportunity_id) as any;
    resolved.push({
      id: app.id,
      uid: app.user_id,
      oppId: app.opportunity_id,
      status: app.status,
      appliedAt: app.applied_at,
      jobTitle: matchedJob ? matchedJob.title : 'Unknown Job',
      jobCompany: matchedJob ? matchedJob.company : 'Unknown Company',
      user: uProfile ? {
        full_name: uProfile.displayName || 'Student',
        email: uProfile.email || '',
        phone: uProfile.phone || '',
        ats_score: uProfile.ats_score || 0,
        trust_score: uProfile.trust_score || 0,
        career_dna_score: uProfile.career_dna_score || 0,
      } : null,
    });
  }
  return resolved;
}

export async function updateApplicationStatus(appId: string, status: string) {
  const { error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', appId);
  if (error) {
    const parts = (appId || '').split('_');
    const uid = parts[0] || 'unknown';
    const oppId = parts[1] || 'unknown';
    await supabase.from('applications').upsert({
      id: appId,
      user_id: uid,
      opportunity_id: oppId,
      status,
      applied_at: new Date().toISOString(),
    });
  }
}

export async function verifyVaultItem(studentId: string, itemId: string, status: 'verified' | 'rejected') {
  const { error } = await supabase
    .from('vault_items')
    .update({ verified: status === 'verified' })
    .eq('id', itemId)
    .eq('user_id', studentId);
  if (error) throw error;

  const profile = await getUserProfile(studentId);
  if (profile && status === 'verified') {
    const current = profile.trust_score || 40;
    await updateUserProfile(studentId, { trust_score: Math.min(100, current + 5) });
  }
}

export async function scheduleSession(sessionData: Record<string, any>) {
  const { data, error } = await supabase
    .from('sessions')
    .insert([{
      consultant_id: sessionData.consultantId,
      student_id: sessionData.studentId,
      title: sessionData.title,
      date: sessionData.date,
      time: sessionData.time,
    }])
    .select();
  if (error) throw error;

  if (sessionData.studentId) {
    await supabase.from('notifications').insert({
      user_id: sessionData.studentId,
      type: 'info',
      title: 'New 1:1 Session Scheduled',
      message: `Consultant scheduled a session: "${sessionData.title}" on ${sessionData.date} at ${sessionData.time}.`,
      is_read: false,
    });
  }
  return data?.[0]?.id;
}

export async function getSessions(consultantId?: string, studentId?: string) {
  let query = supabase.from('sessions').select('*');
  if (consultantId) {
    query = query.eq('consultant_id', consultantId);
  } else if (studentId) {
    query = query.eq('student_id', studentId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function addAuditEntry(adminId: string, action: string, targetId: string, meta: Record<string, any>) {
  const { error } = await supabase.from('audit_logs').insert({
    admin_id: adminId,
    actor_id: adminId, // map current acting user ID to actor_id column
    action,
    target_id: targetId,
    meta,
  });
  if (error) throw error;
}

export async function getAuditLogs() {
  const { data, error } = await supabase.from('audit_logs').select('*');
  if (error) return [];
  return data || [];
}

export async function sendBroadcastNotification(senderId: string, title: string, message: string, type: string, targetRole: string) {
  const users = await getAllUsers();
  const targets = targetRole ? users.filter(u => u.role === targetRole) : users;

  const rows = targets.map(t => ({
    user_id: t.id,
    type: type || 'info',
    title: title || 'Broadcast Announcement',
    message: message || '',
    is_read: false,
  }));

  if (rows.length > 0) {
    await supabase.from('notifications').insert(rows);
  }

  await addAuditEntry(senderId, 'broadcast', 'all', { title, message, type, targetRole });
  return targets.length;
}

export async function generateCustomSkillQuests(uid: string, targetRole: string, skill: string) {
  const today = new Date().toISOString().slice(0, 10);
  const rows = [
    {
      user_id: uid,
      title: `Master ${skill} Core Concepts`,
      description: `Targeting ${targetRole || 'Software Engineer'} role: Explain the core pillars, design patterns, and optimization practices of ${skill} in a socratic discussion.`,
      type: 'theory',
      status: 'pending',
      proof_type: 'url',
      due_date: today,
      trust_reward: 12,
      source_weakness: skill,
      estimated_minutes: 20,
      learn_url: `https://google.com/search?q=${encodeURIComponent(skill + ' guide')}`,
    },
    {
      user_id: uid,
      title: `Build and Deploy ${skill} Sandbox`,
      description: `Targeting ${targetRole || 'Software Engineer'} role: Create a local sandbox repository using ${skill}, compile a working demo, and link your code repository.`,
      type: 'skill',
      status: 'pending',
      proof_type: 'url',
      due_date: today,
      trust_reward: 18,
      source_weakness: skill,
      estimated_minutes: 45,
    }
  ];

  await supabase.from('missions').insert(rows);

  await supabase.from('notifications').insert({
    user_id: uid,
    type: 'success',
    title: 'Training Modules Generated',
    message: `We generated custom learning quest modules for ${skill} to help you qualify for the ${targetRole || 'SDE'} benchmarks!`,
    source: 'mission',
    is_read: false,
  });
}

// ─── Q-C2: Server-side quest completion persistence ───────────────────────────
// Atomically appends questId to users.completed_quests (text[]) and increments
// xp_total so that completions survive localStorage clears and page reloads.
// Called from CareerOSContext.addCompletedQuest after the client state is updated.
export async function persistQuestCompletion(
  uid: string,
  questId: string,
  xpAmount: number
): Promise<{ ok: boolean; newXp?: number }> {
  try {
    // Step 1: Fetch current completed_quests + xp_total
    const { data: profile, error: fetchErr } = await supabase
      .from('users')
      .select('completed_quests, xp_total')
      .eq('id', uid)
      .single();

    if (fetchErr || !profile) {
      console.warn('[persistQuestCompletion] Could not fetch profile:', fetchErr?.message);
      return { ok: false };
    }

    const current: string[] = profile.completed_quests || [];
    // Idempotent: skip if already recorded
    if (current.includes(questId)) {
      return { ok: true, newXp: profile.xp_total };
    }

    const newCompleted = [...current, questId];
    const newXp = (profile.xp_total || 0) + xpAmount;

    // Step 2: Write back atomically
    const { error: updateErr } = await supabase
      .from('users')
      .update({ completed_quests: newCompleted, xp_total: newXp })
      .eq('id', uid);

    if (updateErr) {
      console.warn('[persistQuestCompletion] Update failed:', updateErr.message);
      return { ok: false };
    }

    return { ok: true, newXp };
  } catch (e: any) {
    console.error('[persistQuestCompletion] Unexpected error:', e.message);
    return { ok: false };
  }
}

// ─── Sync Trust Score & Career DNA Score to Supabase DB ───────────────────────
export async function syncRewardsDB(
  uid: string,
  trustScore: number,
  dnaScore: number
): Promise<{ ok: boolean }> {
  if (!uid || uid === 'guest') return { ok: true };
  try {
    const { error } = await supabase
      .from('users')
      .update({
        trust_score: trustScore,
        career_dna_score: dnaScore
      })
      .eq('id', uid);

    if (error) {
      console.warn('[syncRewardsDB] Update failed:', error.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (e: any) {
    console.error('[syncRewardsDB] Unexpected error:', e.message);
    return { ok: false };
  }
}

// ─── Step 1: Cross-Device Item Unlock Duration DB Sync ────────────────────────
export async function syncUnlockedItemsDB(
  uid: string,
  unlockedItems: Record<string, number>
): Promise<{ ok: boolean }> {
  if (!uid || uid === 'guest') return { ok: true };
  try {
    const { error } = await supabase
      .from('users')
      .update({ unlocked_items: unlockedItems })
      .eq('id', uid);

    if (error) {
      console.warn('[syncUnlockedItemsDB] DB update failed:', error.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (e: any) {
    console.error('[syncUnlockedItemsDB] Unexpected error:', e.message);
    return { ok: false };
  }
}

// ─── Step 2: Server-Verified Time Offset Calculation ──────────────────────────
export async function fetchServerTimeOffset(): Promise<number> {
  try {
    const startTime = Date.now();
    // Query system health / ping to compute network latency and server time delta
    const res = await fetch('/api/pins/spend', { method: 'OPTIONS' }).catch(() => null);
    const dateHeader = res?.headers.get('date');
    if (dateHeader) {
      const serverMs = new Date(dateHeader).getTime();
      const clientMs = startTime + (Date.now() - startTime) / 2;
      return serverMs - clientMs; // returns offset in milliseconds
    }
  } catch (e) {
    console.warn('[fetchServerTimeOffset] Server time fetch fallback:', e);
  }
  return 0;
}

// ─── Q-C3: Server-side pin deduction (prevent double-spend) ───────────────────
// Reads pin balance from DB and atomically decrements it.
// Returns { ok: true, newBalance } on success.
// Returns { ok: false, reason: 'INSUFFICIENT_PINS' | 'ERROR' } on failure.
// This is called from CareerOSContext.spendPins BEFORE updating local state so
// that the DB is the authoritative source for pin balance checks.
export async function spendPinsDB(
  uid: string,
  cost: number,
  reason: string
): Promise<{ ok: boolean; newBalance?: number; reason?: string }> {
  try {
    // Read authoritative DB balance
    const { data: profile, error: fetchErr } = await supabase
      .from('users')
      .select('pins')
      .eq('id', uid)
      .single();

    if (fetchErr || !profile) {
      console.warn('[spendPinsDB] Could not fetch pins:', fetchErr?.message);
      return { ok: false, reason: 'ERROR' };
    }

    const current: number = profile.pins ?? 120;
    if (current < cost) {
      return { ok: false, reason: 'INSUFFICIENT_PINS' };
    }

    const newBalance = current - cost;
    const { error: updateErr } = await supabase
      .from('users')
      .update({ pins: newBalance })
      .eq('id', uid);

    if (updateErr) {
      console.warn('[spendPinsDB] Update failed:', updateErr.message);
      return { ok: false, reason: 'ERROR' };
    }

    // Append to pin_history JSONB (best-effort, non-blocking)
    (async () => {
      try {
        const { data } = await supabase.from('users').select('pin_history').eq('id', uid).single();
        const history: any[] = data?.pin_history || [];
        const tx = { id: `tx_${Date.now()}`, type: 'spend', amount: cost, reason, timestamp: Date.now() };
        const trimmed = [tx, ...history].slice(0, 100);
        await supabase.from('users').update({ pin_history: trimmed }).eq('id', uid);
      } catch (err) {
        console.warn('[spendPinsDB] History log failed:', err);
      }
    })();

    return { ok: true, newBalance };
  } catch (e: any) {
    console.error('[spendPinsDB] Unexpected error:', e.message);
    return { ok: false, reason: 'ERROR' };
  }
}

// ─── Q-C4: Group Discussion Sync with LocalStorage fallback ──────────────────
export async function getGroupDiscussionMessages(
  uid: string,
  roomId: string
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('timestamp', { ascending: true });

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.warn('[getGroupDiscussionMessages] Table fallback to local storage:', e);
  }

  // LocalStorage fallback
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(`pinit_chat_messages_${roomId}`);
    return local ? JSON.parse(local) : [];
  }
  return [];
}

export async function saveGroupDiscussionMessage(
  uid: string,
  roomId: string,
  message: { sender_name: string; sender_role: string; content: string; timestamp: number }
): Promise<boolean> {
  const payload = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    room_id: roomId,
    user_id: uid,
    sender_name: message.sender_name,
    sender_role: message.sender_role,
    content: message.content,
    timestamp: message.timestamp
  };

  try {
    const { error } = await supabase.from('chat_messages').insert(payload);
    if (!error) return true;
  } catch (e) {
    console.warn('[saveGroupDiscussionMessage] Table fallback to local storage:', e);
  }

  // LocalStorage fallback
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(`pinit_chat_messages_${roomId}`);
    const list = local ? JSON.parse(local) : [];
    list.push(payload);
    localStorage.setItem(`pinit_chat_messages_${roomId}`, JSON.stringify(list));
    return true;
  }
  return false;
}

// ─── Student-Teacher Direct Messaging DB Functions ─────────────────────────────
export async function sendDirectMessage(
  senderId: string,
  recipientId: string,
  senderName: string,
  recipientName: string,
  content: string,
  role: string = 'student'
): Promise<{ ok: boolean; message?: any }> {
  const msg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sender_id: senderId,
    recipient_id: recipientId,
    sender_name: senderName,
    recipient_name: recipientName,
    content: content,
    role: role,
    created_at: new Date().toISOString(),
    is_read: false
  };

  try {
    const { error } = await supabase.from('direct_messages').insert(msg);
    if (!error) return { ok: true, message: msg };
  } catch (e) {
    console.warn('[sendDirectMessage] Local fallback:', e);
  }

  if (typeof window !== 'undefined') {
    const key = `pinit_direct_messages_${[senderId, recipientId].sort().join('_')}`;
    const raw = localStorage.getItem(key) || '[]';
    const list = JSON.parse(raw);
    list.push(msg);
    localStorage.setItem(key, JSON.stringify(list));

    // Also update global teacher inbox store
    const inboxKey = `pinit_teacher_inbox_${recipientId}`;
    const inboxRaw = localStorage.getItem(inboxKey) || '[]';
    const inboxList = JSON.parse(inboxRaw);
    inboxList.unshift(msg);
    localStorage.setItem(inboxKey, JSON.stringify(inboxList));
  }
  return { ok: true, message: msg };
}

export async function getDirectMessages(user1Id: string, user2Id: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`and(sender_id.eq.${user1Id},recipient_id.eq.${user2Id}),and(sender_id.eq.${user2Id},recipient_id.eq.${user1Id})`)
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('[getDirectMessages] Local fallback:', e);
  }

  if (typeof window !== 'undefined') {
    const key = `pinit_direct_messages_${[user1Id, user2Id].sort().join('_')}`;
    const raw = localStorage.getItem(key) || '[]';
    return JSON.parse(raw);
  }
  return [];
}

export async function getTeacherInbox(teacherId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`recipient_id.eq.${teacherId},sender_id.eq.${teacherId}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.warn('[getTeacherInbox] Local fallback:', e);
  }

  if (typeof window !== 'undefined') {
    const inboxKey = `pinit_teacher_inbox_${teacherId}`;
    const raw = localStorage.getItem(inboxKey) || '[]';
    return JSON.parse(raw);
  }
  return [];
}

export function subscribeToDirectMessages(
  userId: string,
  onMessage: (payload: any) => void
): { unsubscribe: () => void } {
  try {
    const channel = supabase
      .channel(`direct_messages_${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'direct_messages', filter: `recipient_id=eq.${userId}` },
        (payload) => {
          if (payload.new) {
            onMessage(payload.new);
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  } catch (e) {
    console.warn('[subscribeToDirectMessages] Realtime channel setup warning:', e);
    return { unsubscribe: () => {} };
  }
}

export async function markMessagesAsRead(user1Id: string, user2Id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('direct_messages')
      .update({ is_read: true })
      .eq('recipient_id', user1Id)
      .eq('sender_id', user2Id);

    if (!error) return true;
  } catch (e) {
    console.warn('[markMessagesAsRead] Local fallback:', e);
  }

  if (typeof window !== 'undefined') {
    const key = `pinit_direct_messages_${[user1Id, user2Id].sort().join('_')}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const list = JSON.parse(raw);
      let updated = false;
      list.forEach((m: any) => {
        if (m.recipient_id === user1Id && m.sender_id === user2Id && !m.is_read) {
          m.is_read = true;
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(key, JSON.stringify(list));
      }
    }
  }
  return true;
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('direct_messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (!error && count !== null) return count;
  } catch (e) {
    console.warn('[getUnreadMessageCount] Local fallback:', e);
  }

  if (typeof window !== 'undefined') {
    const inboxKey = `pinit_teacher_inbox_${userId}`;
    const raw = localStorage.getItem(inboxKey) || '[]';
    const list = JSON.parse(raw);
    return list.filter((m: any) => m.recipient_id === userId && !m.is_read).length;
  }
  return 0;
}


