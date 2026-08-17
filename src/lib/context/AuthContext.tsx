// AuthContext — Supabase Auth + Database
'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isDemoAuthEnabled, DEMO_PASSWORD, DEMO_ROLE_BY_EMAIL } from '@/lib/demoAuth';
import { User as SbUser } from '@supabase/supabase-js';
import {
  getUserProfile, createUserProfile, updateUserProfile,
  ensureSeedData, DEMO_PROFILE, EMPTY_PROFILE, mapRowToProfile
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

// Convert username to a valid email
function usernameToEmail(username: string): string {
  if (username.includes('@')) return username;
  const clean = (username || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const prefix = clean || `user_${Date.now()}`;
  return `${prefix}@pinit.app`;
}

function isDemoEmail(email: string): boolean {
  return Boolean(DEMO_ROLE_BY_EMAIL[email.toLowerCase()]);
}

const COLUMN_MAP: Record<string, string> = {
  id: 'id',
  display_name: 'displayName',
  role: 'role',
  register_number: 'registerNumber',
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
    'student@pinit.in': 'Ashwanth Kumar',
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

  return {
    ...profile,
    id:          sbUser.id,
    username:    (profile?.username as string) || sbUser.email?.split('@')[0] || 'user',
    email:       sbUser.email || '',
    displayName: (profile?.displayName as string) || sbUser.user_metadata?.display_name || 'User',
    role:        role,
    registerNumber:   profile?.registerNumber as string | undefined,
    selectedTeacherId: profile?.selectedTeacherId as string | undefined,
    guidanceMentorId: (profile?.guidanceMentorId as string | undefined) || (profile?.guidance_mentor_id as string | undefined),
    atsScore:         profile?.ats_score as number | undefined,
    trustScore:       profile?.trust_score as number | undefined,
    careerDnaScore:   profile?.career_dna_score as number | undefined,
    missionStreak:    profile?.mission_streak as number | undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const initializeCareerWorkspace = useCallback((userId: string, userPayload?: any, isNewUser = false) => {
    if (typeof window === 'undefined') return;
    // Idempotent Workspace Initialization
    const keys = {
      xp: `pinit_${userId}_xp`,
      pins: `pinit_${userId}_pins`,
      obStep: `pinit_${userId}_ob_step`,
      onboard: `pinit_${userId}_onboarding_answers`
    };
    if (!localStorage.getItem(keys.xp)) localStorage.setItem(keys.xp, '120');
    if (!localStorage.getItem(keys.pins)) localStorage.setItem(keys.pins, '120');

    // Only pre-set completed onboarding answers if NOT a new Dev Mode / onboarding user
    if (!isNewUser) {
      if (!localStorage.getItem(keys.obStep)) localStorage.setItem(keys.obStep, '5');
      if (!localStorage.getItem(keys.onboard)) {
        localStorage.setItem(keys.onboard, JSON.stringify({
          role: userPayload?.role || 'SDE-1 Developer',
          education: 'B.Tech Computer Science',
          skills: 'TypeScript, React, Node.js',
          experience: 'Final Year Student',
          hasCompleted: true
        }));
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
    const token = `vlt_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    // Never accept arbitrary privileged roles from client payloads.
    // Demo emails keep their mapped roles; Dev Mode stays student; everyone else is student.
    const emailLower = String(userPayload.email || userPayload.username || '').toLowerCase();
    const demoRoleByEmail = DEMO_ROLE_BY_EMAIL;
    let role = 'student';
    if (userPayload.isDevUser) {
      role = 'student';
    } else if (demoRoleByEmail[emailLower]) {
      role = demoRoleByEmail[emailLower];
    }
    // All other vault/client payloads are forced to student (no self-claimed admin/teacher/etc.)

    if (typeof window !== 'undefined') {
      const sanitizedPayload = { ...userPayload, role };
      localStorage.setItem('pinit_active_uid', userPayload.id);
      localStorage.setItem('pinit_auth_token', token);
      localStorage.setItem('pinit_current_user', JSON.stringify(sanitizedPayload));
      localStorage.setItem(`pinit_${userPayload.id}_profile`, JSON.stringify(sanitizedPayload));

      const isHttps = window.location.protocol === 'https:';
      const secureFlag = isHttps ? '; Secure' : '';
      document.cookie = `pinit_role=${role}; path=/${secureFlag}`;
      document.cookie = `pinit_session=active; path=/${secureFlag}`;
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
        loginWithVaultSession({ user: e.detail.user, token: `jwt_event_${Date.now()}` }).catch(() => {});
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

  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Only add Secure flag on HTTPS — on HTTP (localhost) the browser silently drops Secure cookies.
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const secureFlag = isHttps ? '; Secure' : '';
      if (user) {
        document.cookie = `pinit_role=${user.role}; path=/; SameSite=Lax${secureFlag}`;
        document.cookie = `pinit_uid=${user.id}; path=/; SameSite=Lax${secureFlag}`;
      } else {
        document.cookie = "pinit_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "pinit_uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }, [user]);

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
      if (!profile) {
        // New user — create profile with demo data
        let role = 'student';
        let displayName = 'User';
        const emailLower = sbUser.email?.toLowerCase();
        if (emailLower === 'admin@pinit.in') { role = 'admin'; displayName = 'System Admin'; }
        else if (emailLower === 'rec@pinit.in') { role = 'recruiter'; displayName = 'Lead Recruiter'; }
        else if (emailLower === 'con@pinit.in') { role = 'consultant'; displayName = 'Career Consultant'; }
        profile = {
          ...(isDemoEmail(sbUser.email || '') ? DEMO_PROFILE : EMPTY_PROFILE),
          uid:         sbUser.id,
          email:       sbUser.email || '',
          username:    sbUser.email?.split('@')[0] || 'user',
          displayName: sbUser.user_metadata?.display_name || displayName,
          role,
        };
        await createUserProfile(sbUser.id, profile);
      } else {
        // Self-healing check for existing profiles of default accounts
        const emailLower = sbUser.email?.toLowerCase();
        let expectedRole = null;
        if (emailLower === 'admin@pinit.in' && profile.role !== 'admin') expectedRole = 'admin';
        else if (emailLower === 'rec@pinit.in' && profile.role !== 'recruiter') expectedRole = 'recruiter';
        else if (emailLower === 'con@pinit.in' && profile.role !== 'consultant') expectedRole = 'consultant';

        if (expectedRole) {
          profile.role = expectedRole;
          await updateUserProfile(sbUser.id, { role: expectedRole });
        }
      }
      await ensureSeedData(sbUser.id, profile);
      try {
        localStorage.setItem(`pinit_${sbUser.id}_profile`, JSON.stringify(profile));
      } catch {}
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
                  nextUser[jsProp] = mappedNew[jsProp];
                }
              }
              
              const emailLower = sbUser.email?.toLowerCase();
              let role = (nextUser.role as string) || 'student';
              if (emailLower === 'admin@pinit.in') role = 'admin';
              else if (emailLower === 'rec@pinit.in') role = 'recruiter';
              else if (emailLower === 'con@pinit.in') role = 'consultant';
              
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
      if (!sbUser && typeof window !== 'undefined') {
        const activeUid = localStorage.getItem('pinit_active_uid');
        if (activeUid) {
          const saved = localStorage.getItem(`pinit_${activeUid}_profile`);
          if (saved) {
            try {
              const cachedProfile = JSON.parse(saved);
              sbUser = {
                id: activeUid,
                email: cachedProfile.email || `${cachedProfile.username || 'user'}@pinit.app`,
                user_metadata: { display_name: cachedProfile.displayName }
              } as any;
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
    }).catch(err => {
      console.warn('[AuthContext] getSession error fallback:', err);
    }).finally(() => {
      clearTimeout(safetyTimer);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      let sbUser = session?.user ?? null;
      if (!sbUser && typeof window !== 'undefined' && event === 'SIGNED_OUT') {
        localStorage.removeItem('pinit_active_uid');
      } else if (!sbUser && typeof window !== 'undefined') {
        const activeUid = localStorage.getItem('pinit_active_uid');
        if (activeUid) {
          const saved = localStorage.getItem(`pinit_${activeUid}_profile`);
          if (saved) {
            try {
              const cachedProfile = JSON.parse(saved);
              sbUser = {
                id: activeUid,
                email: cachedProfile.email || `${cachedProfile.username || 'user'}@pinit.app`,
                user_metadata: { display_name: cachedProfile.displayName }
              } as any;
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
    const isDefaultUser = isDemoAuthEnabled() && isDemoEmail(emailLower) && password === DEMO_PASSWORD;
    
    try {
      let sbUser;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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
            ...(isDemoEmail(emailLower) ? DEMO_PROFILE : EMPTY_PROFILE),
            uid:             sbUser.id,
            email,
            username:        email.split('@')[0],
            displayName,
            role,
          };
          await createUserProfile(sbUser.id, profile);
          await ensureSeedData(sbUser.id, profile);
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
          ...(isDemoEmail(sbUser.email || '') ? DEMO_PROFILE : EMPTY_PROFILE),
          uid:         sbUser.id,
          email:       sbUser.email || '',
          username:    sbUser.email?.split('@')[0] || 'user',
          displayName: sbUser.user_metadata?.display_name || displayName,
          role,
        };
        await createUserProfile(sbUser.id, profile);
      }
      await ensureSeedData(sbUser.id, profile);
      const appUser = sbUserToAppUser(sbUser, profile);

      try {
        localStorage.setItem('pinit_active_uid', appUser.id);
      } catch {}

      setUser(appUser);
      
      // Dispatch login audit entry (non-blocking)
      api.post('/api/admin/audit-log/add', {
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

      const { data: resData, error } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
          }
        }
      });

      if (error) {
        if (error.message?.includes('already registered') || error.message?.includes('User already exists')) {
          // Attempt sign in with password if account already exists
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password: data.password,
          });
          if (!signInErr && signInData.user) {
            sbUser = signInData.user;
            session = signInData.session;
          } else {
            throw new Error('Username already taken. If this is your account, please sign in.');
          }
        } else {
          throw error;
        }
      } else {
        sbUser = resData.user;
        session = resData.session;
      }

      if (!sbUser) throw new Error('SignUp succeeded but returned no user.');

      // Check if Supabase returned obfuscated duplicate user (identities array empty & no session)
      if (sbUser.identities && sbUser.identities.length === 0 && !session) {
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password: data.password,
        });
        if (!signInErr && signInData.user) {
          sbUser = signInData.user;
          session = signInData.session;
        } else {
          throw new Error('Username already taken. If this is your account, please sign in.');
        }
      }

      const profile = {
        ...(isDemoEmail(email) ? DEMO_PROFILE : EMPTY_PROFILE),
        uid:             sbUser.id,
        email,
        username:        data.username,
        displayName:     data.displayName,
        // Signup must not accept client-supplied privileged roles
        role:            'student',
        registerNumber:  data.registerNumber || '',
      };

      // Profile creation should not block signup — wrap in try/catch
      try {
        await createUserProfile(sbUser.id, profile);
      } catch (profileErr: any) {
        console.error('Profile creation failed (non-blocking):', profileErr?.message);
      }

      try {
        await ensureSeedData(sbUser.id, profile);
      } catch (seedErr: any) {
        console.error('Seed data failed (non-blocking):', seedErr?.message);
      }

      try {
        localStorage.setItem(`pinit_${sbUser.id}_profile`, JSON.stringify(profile));
        localStorage.setItem('pinit_active_uid', sbUser.id);
      } catch {}

      setUser(sbUserToAppUser(sbUser, profile));
    } catch (err: any) {
      throw new Error(err?.message || 'Signup failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      if (user?.id) {
        await api.post('/api/admin/audit-log/add', {
          action: 'logout',
          meta: { userId: user.id, username: user.username, displayName: user.displayName }
        }).catch(() => {});
      }
    } catch {}
    const uid = user?.id;
    try {
      localStorage.removeItem('pinit_active_uid');
      localStorage.removeItem('pinit_auth_token');
      localStorage.removeItem('pinit_current_user');
      if (uid) localStorage.removeItem(`pinit_${uid}_profile`);
    } catch {}
    await supabase.auth.signOut();
    setUser(null);
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
