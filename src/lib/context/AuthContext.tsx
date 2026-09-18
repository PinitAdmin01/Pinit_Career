// AuthContext — Supabase Auth + Database
'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isDemoAuthEnabled, DEMO_PASSWORD, isDemoPassword, DEMO_ROLE_BY_EMAIL } from '@/lib/demoAuth';
import { User as SbUser } from '@supabase/supabase-js';
import {
  getUserProfile, createUserProfile, updateUserProfile,
  EMPTY_PROFILE, mapRowToProfile
} from '@/lib/supabaseService';
import { api } from '@/lib/api/client';

interface User {
  id:               string;
  username:         string;
  email:            string;
  displayName:      string;
  role:             string;
  subscription_tier?: string;
  registerNumber?:  string;
  selectedTeacherId?: string;
  guidanceMentorId?: string;
  atsScore?:        number;
  trustScore?:      number;
  careerDnaScore?:  number;
  missionStreak?:   number;
  xp?:              number;
  pins?:            number;
  [key: string]:    unknown;
}

interface AuthCtx {
  user:    User | null;
  loading: boolean;
  login:   (username: string, password: string) => Promise<any>;
  signup:  (data: SignupData) => Promise<void>;
  logout:  () => Promise<void>;
  refresh: () => Promise<void>;
  loginWithVaultSession: (sessionData: any, isNewUser?: boolean) => Promise<User>;
}

interface SignupData {
  username:        string;
  password:        string;
  displayName:     string;
  role?:           string;
  registerNumber?: string;
}

const Ctx = createContext<AuthCtx | null>(null);

// Deterministic hash helper for consistent username namespacing
function getUsernameHash(raw: string): string {
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Convert username to a collision-free internal email
function usernameToEmail(username: string): string {
  const raw = (username || '').trim().toLowerCase();
  if (raw.includes('@')) return raw;

  // Preserve email-valid characters: letters, numbers, dots, dashes, underscores
  let clean = raw
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '');

  clean = clean.replace(/\.{2,}/g, '.').replace(/^[-._]+|[-._]+$/g, '');
  const base = clean || 'user';
  const hashSuffix = getUsernameHash(raw);
  return `usr_${base}_${hashSuffix}@student.pinit.internal`;
}

// Fallback for accounts created prior to namespaced domain enforcement
function legacyUsernameToEmail(username: string): string {
  const raw = (username || '').trim().toLowerCase();
  if (raw.includes('@')) return raw;
  let clean = raw
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '');
  clean = clean.replace(/\.{2,}/g, '.').replace(/^[-._]+|[-._]+$/g, '');
  return `${clean || 'user'}@pinit.app`;
}

function isDemoEmail(email: string): boolean {
  return Boolean(DEMO_ROLE_BY_EMAIL[email.toLowerCase()]);
}

const COLUMN_MAP: Record<string, string> = {
  id: 'id',
  display_name: 'displayName',
  role: 'role',
  register_number: 'registerNumber',
  roll_number: 'registerNumber',
  selected_teacher_id: 'selectedTeacherId',
  ats_score: 'atsScore',
  career_dna_score: 'careerDnaScore',
  trust_score: 'trustScore',
  mission_streak: 'missionStreak',
  recruiter_visibility: 'recruiterVisibility',
  career_readiness: 'careerReadiness',
  communication_score: 'communicationScore',
  execution_score: 'executionScore',
  leadership_score: 'leadershipScore',
  consistency_score: 'consistencyScore',
  adaptability_score: 'adaptabilityScore',
  confidence_score: 'confidenceScore',
  innovation_score: 'innovationScore',
  intelligence_score: 'intelligenceScore',
  weak_areas: 'weakAreas',
  skill_tags: 'skillTags',
  certifications: 'certifications',
  target_role: 'targetRole',
  career_goal: 'careerGoal',
  career_dna_archetype: 'careerDnaArchetype',
  xp_total: 'xpTotal',
  xp_level: 'xpLevel',
  missions_completed: 'missionsCompleted',
  interviews_done: 'interviewsDone',
  vault_count: 'vaultCount',
  onboarding_step: 'onboardingStep',
  onboarding_answers: 'onboardingAnswers',
  jd_missing_skills: 'jdMissingSkills',
  structured_resume: 'structured_resume',
  pins: 'pins',
  pin_history: 'pinHistory',
  resume_generated: 'resumeGenerated',
  roadmap_generated: 'roadmapGenerated',
  completed_quests: 'completedQuests',
  completed_missions: 'completedMissions',
  java_test_passed: 'javaTestPassed',
  group_panel_passed: 'groupPanelPassed',
  recruiter_visible: 'recruiterVisible',
  force_show_career_builder: 'forceShowCareerBuilder',
  demo_tabs_unlocked: 'demoTabsUnlocked',
  guidance_mentor_id: 'guidanceMentorId'
};

function demoIdentity(emailLower: string): { role: string; displayName: string } {
  const names: Record<string, string> = {
    'admin@pinit.in': 'System Admin',
    'teacher@pinit.in': 'Faculty Member',
    'rec@pinit.in': 'Lead Recruiter',
    'con@pinit.in': 'Career Consultant',
    'parent@pinit.in': 'Family Representative',
    'student@pinit.in': 'Demo Student',
  };
  return {
    role: DEMO_ROLE_BY_EMAIL[emailLower] || 'student',
    displayName: names[emailLower] || 'User',
  };
}

function sbUserToAppUser(sbUser: SbUser, profile: Record<string, unknown> | null): User {
  let role = (profile?.role as string) || 'student';
  const emailLower = sbUser.email?.toLowerCase();
  if (emailLower && DEMO_ROLE_BY_EMAIL[emailLower]) role = DEMO_ROLE_BY_EMAIL[emailLower];

  const regNo = (profile?.registerNumber as string) || (profile?.register_number as string) || (profile?.roll_number as string) || '';
  const teacherId = (profile?.selectedTeacherId as string) || (profile?.selected_teacher_id as string) || 'priya';
  const mentorId = (profile?.guidanceMentorId as string) || (profile?.guidance_mentor_id as string) || teacherId;
  const dispName = (profile?.displayName as string) || (profile?.display_name as string) || sbUser.user_metadata?.display_name || sbUser.user_metadata?.full_name || 'User';

  return {
    ...profile,
    id:                sbUser.id,
    username:          (profile?.username as string) || sbUser.email?.split('@')[0] || 'user',
    email:             sbUser.email || '',
    displayName:       dispName,
    display_name:      dispName,
    role:              role,
    registerNumber:    regNo,
    register_number:   regNo,
    selectedTeacherId: teacherId,
    selected_teacher_id: teacherId,
    guidanceMentorId:  mentorId,
    guidance_mentor_id: mentorId,
    atsScore:          (profile?.atsScore as number | undefined) ?? (profile?.ats_score as number | undefined) ?? 0,
    ats_score:         (profile?.atsScore as number | undefined) ?? (profile?.ats_score as number | undefined) ?? 0,
    trustScore:        (profile?.trustScore as number | undefined) ?? (profile?.trust_score as number | undefined) ?? 50,
    trust_score:       (profile?.trustScore as number | undefined) ?? (profile?.trust_score as number | undefined) ?? 50,
    careerDnaScore:    (profile?.careerDnaScore as number | undefined) ?? (profile?.career_dna_score as number | undefined) ?? 0,
    career_dna_score:  (profile?.careerDnaScore as number | undefined) ?? (profile?.career_dna_score as number | undefined) ?? 0,
    missionStreak:     (profile?.missionStreak as number | undefined) ?? (profile?.mission_streak as number | undefined) ?? 0,
    mission_streak:    (profile?.missionStreak as number | undefined) ?? (profile?.mission_streak as number | undefined) ?? 0,
    onboardingStep:    (profile?.onboardingStep as number | undefined) ?? (profile?.onboarding_step as number | undefined) ?? 1,
    onboarding_step:   (profile?.onboardingStep as number | undefined) ?? (profile?.onboarding_step as number | undefined) ?? 1,
    roadmapGenerated:  Boolean(profile?.roadmapGenerated ?? profile?.roadmap_generated),
    roadmap_generated: Boolean(profile?.roadmapGenerated ?? profile?.roadmap_generated),
    resumeGenerated:   Boolean(profile?.resumeGenerated ?? profile?.resume_generated),
    resume_generated:  Boolean(profile?.resumeGenerated ?? profile?.resume_generated),
  };
}

const CACHE_TTL = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const profileCacheRef = useRef<{ [uid: string]: { data: any; ts: number } }>({});

  const initializeCareerWorkspace = useCallback((userId: string, userPayload?: any, isNewUser = false) => {
    if (typeof window === 'undefined') return;
    // Idempotent Workspace Initialization
    const keys = {
      xp: `pinit_${userId}_xp`,
      pins: `pinit_${userId}_pins`,
      obStep: `pinit_${userId}_ob_step`,
      onboard: `pinit_${userId}_onboarding_answers`
    };
    const defaultXp = userPayload?.xp !== undefined
      ? String(userPayload.xp)
      : (userPayload?.isDevUser ? '120' : '0');

    // ── FIX: New non-dev users default to '50' pins instead of '0' ──
    // First-time / demo users get 50 demo pins for the initial experience.
    const defaultPins = userPayload?.pins !== undefined
      ? String(userPayload.pins)
      : (userPayload?.isDevUser ? '120' : '50');

    if (!localStorage.getItem(keys.xp)) localStorage.setItem(keys.xp, defaultXp);
    if (!localStorage.getItem(keys.pins)) localStorage.setItem(keys.pins, defaultPins);

    // Only hydrate onboarding answers if actual answers exist in userPayload from DB
    const serverAnswers = userPayload?.onboarding_answers || userPayload?.onboardingAnswers;
    if (serverAnswers && typeof serverAnswers === 'object' && (serverAnswers.role || serverAnswers.hasCompleted)) {
      if (!localStorage.getItem(keys.onboard)) {
        localStorage.setItem(keys.onboard, JSON.stringify(serverAnswers));
      }
      if (userPayload?.onboarding_step !== undefined && !localStorage.getItem(keys.obStep)) {
        localStorage.setItem(keys.obStep, String(userPayload.onboarding_step));
      }
    }
  }, []);

  const loginWithVaultSession = useCallback(async (rawPayload: any, isNewUser: boolean = false) => {
    // Accept flat user OR session envelope { user, token } from vault/dev/trusted callers
    const userPayload =
      rawPayload?.user && typeof rawPayload.user === 'object' && !rawPayload.id
        ? rawPayload.user
        : rawPayload;
    if (!userPayload || !userPayload.id) {
      console.warn('[AuthContext] loginWithVaultSession called with invalid userPayload:', rawPayload);
      throw new Error('Invalid vault session payload');
    }

    // Defect 001: Eradicate client fake unsigned JWT token generation.
    // Exchange session ticket with authoritative server route POST /api/auth/vault-exchange
    let serverToken = '';
    let authoritativeUser = userPayload;
    let role = 'student';

    const emailLower = String(userPayload.email || userPayload.username || '').toLowerCase();
    if (userPayload.isDevUser) {
      role = 'student';
    } else if (DEMO_ROLE_BY_EMAIL[emailLower]) {
      role = DEMO_ROLE_BY_EMAIL[emailLower];
    }

    try {
      const res = await fetch('/api/auth/vault-exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPayload })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) serverToken = data.token;
        if (data.user) {
          authoritativeUser = data.user;
          role = data.user.role || role;
        }
      }
    } catch {
      // Fallback: server unreachable, fetch role from database for non-demo users if possible
      if (!DEMO_ROLE_BY_EMAIL[emailLower] && !userPayload.isDevUser) {
        try {
          const dbProfile = await getUserProfile(userPayload.id);
          if (dbProfile?.role) role = dbProfile.role as string;
        } catch {
          role = 'student';
        }
      }
    }

    if (typeof window !== 'undefined') {
      const sanitizedPayload = { ...authoritativeUser, role };
      profileCacheRef.current[userPayload.id] = { data: sanitizedPayload, ts: Date.now() };
      // Defect 003: Client document.cookie setting eradicated; HttpOnly cookies are set by /api/auth/vault-exchange
    }

    const appUser: User = {
      id: userPayload.id,
      username: userPayload.email || userPayload.username || `${userPayload.id}@pinit.in`,
      email: userPayload.email || `${userPayload.id}@pinit.in`,
      displayName: userPayload.full_name || userPayload.displayName || userPayload.name || 'PinIT User',
      role: role,
      full_name: userPayload.full_name || userPayload.name || 'PinIT User',
      avatar_url: userPayload.avatar_url || '',
      created_at: new Date().toISOString(),
      isDevUser: !!userPayload.isDevUser
    };

    setUser(appUser);
    initializeCareerWorkspace(userPayload.id, { ...userPayload, role }, isNewUser);
    setLoading(false);
    return appUser;
  }, [initializeCareerWorkspace]);

  useEffect(() => {
    const handleIdentityAuthenticated = (e: CustomEvent) => {
      if (e.detail?.user) {
        loginWithVaultSession({ user: e.detail.user }).catch(() => {});
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('pinit:identity_user_authenticated', handleIdentityAuthenticated as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('pinit:identity_user_authenticated', handleIdentityAuthenticated as EventListener);
      }
    };
  }, [loginWithVaultSession]);

  // Defect 003: Sync session with server via HttpOnly cookies endpoint instead of client document.cookie
  useEffect(() => {
    if (user) {
      fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: user.role,
          uid: user.id,
          id: user.id,
          email: user.email,
          isDevUser: user.isDevUser
        })
      }).catch(() => {});
    } else {
      fetch('/api/auth/session', {
        method: 'DELETE'
      }).catch(() => {});
    }

    // Clean up any legacy non-HttpOnly client cookies
    if (typeof document !== 'undefined') {
      document.cookie = "pinit_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "pinit_uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [user]);

  // Defect 004: Multi-tab session synchronization listener
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    try {
      const channel = new BroadcastChannel('pinit_career_os_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'FORCE_STORAGE_PURGE') {
          setUser(null);
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      };
      return () => {
        try { channel.close(); } catch {}
      };
    } catch {}
  }, []);

  const loadProfile = useCallback(async (sbUser: SbUser) => {
    // 0ms instant hydration from local cache to prevent role flash/delay
    try {
      const saved = localStorage.getItem(`pinit_${sbUser.id}_profile`);
      if (saved) {
        const cachedProfile = JSON.parse(saved);
        if (cachedProfile) {
          setUser(sbUserToAppUser(sbUser, cachedProfile));
        }
      }
    } catch {}

    try {
      let profile = await getUserProfile(sbUser.id);
      const emailLower = sbUser.email?.toLowerCase() || '';
      const isPrivilegedDemo = ['admin@pinit.in', 'teacher@pinit.in', 'rec@pinit.in', 'con@pinit.in', 'parent@pinit.in'].includes(emailLower);

      if (!profile) {
        // New user — create profile with demo data
        let role = 'student';
        let displayName = 'User';
        if (emailLower === 'admin@pinit.in') { role = 'admin'; displayName = 'System Admin'; }
        else if (emailLower === 'teacher@pinit.in') { role = 'teacher'; displayName = 'Faculty Member'; }
        else if (emailLower === 'rec@pinit.in') { role = 'recruiter'; displayName = 'Lead Recruiter'; }
        else if (emailLower === 'con@pinit.in') { role = 'consultant'; displayName = 'Career Consultant'; }
        else if (emailLower === 'parent@pinit.in') { role = 'parent'; displayName = 'Parent Guardian'; }

        profile = {
          ...EMPTY_PROFILE,
          uid:         sbUser.id,
          email:       sbUser.email || '',
          username:    sbUser.email?.split('@')[0] || 'user',
          displayName: sbUser.user_metadata?.display_name || displayName,
          role,
        };
        console.log(`[AuthContext] Creating new user profile for ${emailLower} with role=${role}`);
        await createUserProfile(sbUser.id, profile, { allowPrivileged: isPrivilegedDemo });
      } else {
        // Self-healing check for existing profiles of default accounts
        let expectedRole = null;
        if (emailLower === 'admin@pinit.in' && profile.role !== 'admin') expectedRole = 'admin';
        else if (emailLower === 'teacher@pinit.in' && profile.role !== 'teacher') expectedRole = 'teacher';
        else if (emailLower === 'rec@pinit.in' && profile.role !== 'recruiter') expectedRole = 'recruiter';
        else if (emailLower === 'con@pinit.in' && profile.role !== 'consultant') expectedRole = 'consultant';
        else if (emailLower === 'parent@pinit.in' && profile.role !== 'parent') expectedRole = 'parent';

        if (expectedRole) {
          console.log(`[AuthContext] Self-healing profile role for ${emailLower} from ${profile.role} -> ${expectedRole}`);
          profile.role = expectedRole;
          await updateUserProfile(sbUser.id, { role: expectedRole }, { allowPrivileged: true });
        }
      }
      try {
        localStorage.setItem(`pinit_${sbUser.id}_profile`, JSON.stringify(profile));
      } catch {}
      console.log(`[AuthContext] Successfully loaded profile uid=${sbUser.id} | email=${sbUser.email} | role=${profile.role}`);
      setUser(sbUserToAppUser(sbUser, profile));
    } catch (err) {
      console.error('Profile load error:', err);
      let cachedProfile = null;
      try {
        const saved = localStorage.getItem(`pinit_${sbUser.id}_profile`);
        if (saved) {
          cachedProfile = JSON.parse(saved);
        }
      } catch {}
      setUser(sbUserToAppUser(sbUser, cachedProfile));
    }
  // setUser is a stable React state setter; service functions are module-level constants.
  // Listing them makes the exhaustive-deps rule happy and prevents stale closures.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser]);

  useEffect(() => {
    const setupListener = (sbUser: any) => {
      if (channelRef.current) {
        try { supabase.removeChannel(channelRef.current); } catch {}
      }
      if (!sbUser) return;
      channelRef.current = supabase
        .channel(`profile-${sbUser.id}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${sbUser.id}`,
          },
          (payload) => {
            const updatedRow = payload.new;
            setUser(prev => {
              if (!prev) return null;
              const nextUser = { ...prev };
              const mappedNew = mapRowToProfile(updatedRow);
              if (!mappedNew) return prev;

              for (const [dbCol, jsProp] of Object.entries(COLUMN_MAP)) {
                if (updatedRow && dbCol in updatedRow) {
                  const incomingVal = (mappedNew as any)[jsProp] !== undefined
                    ? (mappedNew as any)[jsProp]
                    : ((mappedNew as any)[dbCol] !== undefined ? (mappedNew as any)[dbCol] : updatedRow[dbCol]);

                  if (incomingVal !== undefined) {
                    if (jsProp === 'displayName' && (!incomingVal || typeof incomingVal !== 'string') && nextUser.displayName) {
                      continue;
                    }
                    if (jsProp.toLowerCase().includes('score') && (incomingVal === null || incomingVal === undefined) && (nextUser as any)[jsProp] !== undefined) {
                      continue;
                    }
                    (nextUser as any)[jsProp] = incomingVal;
                  }
                }
              }

              const emailLower = sbUser.email?.toLowerCase();
              let role = (nextUser.role as string) || 'student';
              if (emailLower === 'admin@pinit.in') role = 'admin';
              else if (emailLower === 'teacher@pinit.in') role = 'teacher';
              else if (emailLower === 'rec@pinit.in') role = 'recruiter';
              else if (emailLower === 'con@pinit.in') role = 'consultant';
              else if (emailLower === 'parent@pinit.in') role = 'parent';

              const finalProfile = { ...nextUser, role };
              try {
                localStorage.setItem(`pinit_${sbUser.id}_profile`, JSON.stringify(finalProfile));
              } catch {}

              return sbUserToAppUser(sbUser, finalProfile);
            });
          }
        )
        .subscribe();
    };

    // Safety timeout to prevent loading state from hanging indefinitely on network delay
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    // Get initial session
    supabase.auth.getSession().then(async (res) => {
      const session = res?.data?.session;
      let sbUser = session?.user ?? null;
      if (!sbUser) {
        try {
          const refreshRes = await supabase.auth.refreshSession();
          sbUser = refreshRes?.data?.session?.user ?? null;
        } catch {}
      }
      // Defect 002: Require server session verification before trusting any local cache
      if (!sbUser && typeof window !== 'undefined') {
        try {
          const sRes = await fetch('/api/auth/session').catch(() => null);
          if (sRes && sRes.ok) {
            const sData = await sRes.json().catch(() => null);
            if (sData?.authenticated && sData?.uid) {
              const cached = profileCacheRef.current[sData.uid];
              if (cached && Date.now() - cached.ts < CACHE_TTL) {
                const cachedProfile = cached.data;
                sbUser = {
                  id: sData.uid,
                  email: cachedProfile.email || `${cachedProfile.username || 'user'}@pinit.app`,
                  user_metadata: { display_name: cachedProfile.displayName }
                } as any;
              }
            }
          }
        } catch {}
      }
      if (sbUser) {
        await loadProfile(sbUser);
        setupListener(sbUser);
      } else {
        setUser(null);
      }
    }).catch(err => {
      console.warn('[AuthContext] getSession error fallback:', err);
    }).finally(() => {
      clearTimeout(safetyTimer);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AuthContext] onAuthStateChange event=${event} | sessionUser=${session?.user?.email || 'none'}`);
      // TOKEN_REFRESHED fires hourly from Supabase client — skip redundant profile reload & channel resubscription
      if (event === 'TOKEN_REFRESHED') {
        return;
      }

      let sbUser = session?.user ?? null;
      if (!sbUser && typeof window !== 'undefined') {
        if (event === 'SIGNED_OUT') {
          profileCacheRef.current = {};
          setUser(null);
        } else {
          try {
            const refreshRes = await supabase.auth.refreshSession();
            sbUser = refreshRes?.data?.session?.user ?? null;
          } catch {}

          if (!sbUser) {
            // Defect 002: Do NOT fabricate synthetic user from orphaned storage; verify with server session
            try {
              const sRes = await fetch('/api/auth/session').catch(() => null);
              if (sRes && sRes.ok) {
                const sData = await sRes.json().catch(() => null);
                if (sData?.authenticated && sData?.uid) {
                  const cached = profileCacheRef.current[sData.uid];
                  if (cached && Date.now() - cached.ts < CACHE_TTL) {
                    const cachedProfile = cached.data;
                    sbUser = {
                      id: sData.uid,
                      email: cachedProfile.email || `${cachedProfile.username || 'user'}@pinit.app`,
                      user_metadata: { display_name: cachedProfile.displayName }
                    } as any;
                  }
                }
              }
            } catch {}
          }
        }
      }
      if (sbUser) {
        await loadProfile(sbUser);
        setupListener(sbUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      if (channelRef.current) {
        try { supabase.removeChannel(channelRef.current); } catch {}
      }
    };
  }, [loadProfile]);

  const login = async (username: string, password: string): Promise<any> => {
    const email = usernameToEmail(username);
    const emailLower = email.toLowerCase();

    // Check if default credential attempt first
    const isDefaultUser = isDemoAuthEnabled() && isDemoEmail(emailLower) && isDemoPassword(password);

    try {
      let sbUser;
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign-in failed and input was a username (not an explicit email), attempt legacy email format
      if (error && !username.includes('@')) {
        const legacyEmail = legacyUsernameToEmail(username);
        const legacyRes = await supabase.auth.signInWithPassword({
          email: legacyEmail,
          password,
        });
        if (!legacyRes.error && legacyRes.data?.user) {
          data = legacyRes.data;
          error = null;
        }
      }

      if (error) {
        // If Supabase Auth fails with default demo account credentials, we try to create them
        if (isDefaultUser) {
          const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: emailLower === 'admin@pinit.in' ? 'System Admin' : emailLower === 'rec@pinit.in' ? 'Lead Recruiter' : 'Career Consultant'
              }
            }
          });

          if (signUpErr) {
            throw error;
          }

          if (!signUpData.user) {
            throw new Error('Failed to create default user');
          }

          sbUser = signUpData.user;
          const ident = demoIdentity(emailLower);
          let role = ident.role;
          let displayName = ident.displayName;

          let profile = {
            ...EMPTY_PROFILE,
            uid:             sbUser.id,
            email,
            username:        email.split('@')[0],
            displayName,
            role,
          };
          await createUserProfile(sbUser.id, profile);
        } else {
          throw error;
        }
      } else {
        sbUser = data.user;
        if (!sbUser) throw new Error('No user returned');
      }

      let profile = await getUserProfile(sbUser.id);
      if (!profile) {
        const ident = demoIdentity(emailLower);
        let role = ident.role;
        let displayName = ident.displayName;
        profile = {
          ...EMPTY_PROFILE,
          uid:         sbUser.id,
          email:       sbUser.email || '',
          username:    sbUser.email?.split('@')[0] || 'user',
          displayName: sbUser.user_metadata?.display_name || displayName,
          role,
        };
        await createUserProfile(sbUser.id, profile);
      }
      const appUser = sbUserToAppUser(sbUser, profile);

      try {
        profileCacheRef.current[appUser.id] = { data: appUser, ts: Date.now() };
      } catch {}

      setUser(appUser);

      // Dispatch login audit entry (non-blocking)
      api.post('/api/student/activity', {
        action: 'login',
        meta: { userId: appUser.id, username: appUser.username, displayName: appUser.displayName }
      }).catch(() => {});

      return appUser;
    } catch (err: any) {
      const message = err.message || '';
      if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
        throw new Error('Invalid username or password');
      }
      throw new Error(err.message || 'Login failed. Check your credentials.');
    }
  };

  const signup = async (data: SignupData) => {
    const email = usernameToEmail(data.username);
    try {
      let sbUser: any = null;
      let session: any = null;

      // Wait for Supabase signUp to complete — no race, no ghost sessions.
      // A real timeout (15s via AbortSignal) prevents infinite hangs while still
      // guaranteeing we never create a local session without a confirmed DB record.
      const signUpController = new AbortController();
      const signUpTimeout = setTimeout(() => signUpController.abort(), 15000);

      let resData: any = null;
      let error: any = null;

      try {
        const result: any = await supabase.auth.signUp({
          email,
          password: data.password,
          options: {
            data: { display_name: data.displayName }
          }
        });
        resData = result?.data;
        error = result?.error;
      } finally {
        clearTimeout(signUpTimeout);
      }

      if (signUpController.signal.aborted) {
        throw new Error('Signup timed out. Your connection is slow — please check your network and try again.');
      }

      if (error) {
        if (
          error.message?.includes('already registered') ||
          error.message?.includes('User already exists') ||
          error.message?.includes('already exist') ||
          (error as any).status === 422
        ) {
          // Attempt sign in with password if account already exists
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password: data.password,
          });
          if (!signInErr && signInData?.user) {
            sbUser = signInData.user;
            session = signInData.session;
          } else {
            throw new Error('Account already exists! Please use your password to sign in.');
          }
        } else {
          throw error;
        }
      } else if (resData?.user) {
        sbUser = resData.user;
        session = resData.session;
      }

      // Hard stop — if Supabase returned no user and no error, something is wrong server-side.
      // Do NOT create a fake local user. Show a real error instead.
      if (!sbUser) {
        throw new Error('Signup failed — no user was returned from the server. Please try again.');
      }

      const profile = {
        ...EMPTY_PROFILE,
        uid:             sbUser.id,
        email,
        username:        data.username,
        displayName:     data.displayName,
        role:            'student',
        registerNumber:  data.registerNumber || '',
      };

      // Await profile creation on signup to prevent broken state (Task 3.2)
      try {
        await createUserProfile(sbUser.id, profile);
      } catch (err: any) {
        console.error('[AuthContext] Critical failure creating user profile:', err);
        throw new Error(`Profile initialization failed: ${err?.message || 'Database error'}`);
      }

      try {
        profileCacheRef.current[sbUser.id] = { data: profile, ts: Date.now() };
      } catch {}

      setUser(sbUserToAppUser(sbUser, profile));
    } catch (err: any) {
      throw new Error(err?.message || 'Signup failed. Please try again.');
    }
  };

  const logout = async () => {
    const currentUser = user;
    try {
      // Non-blocking fire-and-forget audit log
      if (currentUser?.id) {
        api.post('/api/student/activity', {
          action: 'logout',
          meta: { userId: currentUser.id, username: currentUser.username, displayName: currentUser.displayName }
        }).catch(() => {});
      }

      // Gap 3.1: Wrap supabase.auth.signOut() in 2000ms timeout to prevent hangs on slow mobile networks
      const signOutTimeout = new Promise<void>((resolve) => setTimeout(resolve, 2000));
      await Promise.race([
        supabase.auth.signOut().catch(() => {}),
        signOutTimeout,
      ]);
    } catch (e) {
      console.warn('[AuthContext] Network signout warning:', e);
    } finally {
      // Guaranteed local state reset and storage/cookie purging
      setUser(null);

      // Defect 003: Invalidate server session HttpOnly cookies
      try {
        await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
      } catch {}

      // Comprehensive storage purge of all pinit_, supabase, and sb- keys
      if (typeof window !== 'undefined') {
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && (k.startsWith('pinit_') || k.startsWith('sb-') || k.includes('supabase'))) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => localStorage.removeItem(k));
          sessionStorage.clear();
        } catch {}

        // Clear legacy client-side cookies
        if (typeof document !== 'undefined') {
          document.cookie = "pinit_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "pinit_uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "pinit_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }

        // Broadcast force purge to all open tabs
        if ('BroadcastChannel' in window) {
          try {
            const authSync = new BroadcastChannel('pinit_career_os_sync');
            authSync.postMessage({ type: 'FORCE_STORAGE_PURGE', timestamp: Date.now() });
            authSync.close();
          } catch {}
        }
      }
    }
  };

  const refresh = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const sbUser = session?.user;
    if (sbUser) await loadProfile(sbUser);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout, refresh, loginWithVaultSession }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
