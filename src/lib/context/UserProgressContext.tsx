'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { consecutiveCalendarStreak } from '@/lib/missions/streak';
import { supabase } from '@/lib/supabaseClient';
import { persistQuestCompletion, syncRewardsDB, updateUserProfile } from '@/lib/supabaseService';
import { markOnboardingStoryPending } from '@/lib/storyTour';
import { safeLocalStorageSetItem } from '@/lib/storage/careerStorage';
import { generateDynamicStudentRoadmap } from '@/lib/data/roadmapFuser';

export interface OnboardingAnswers {
  role?: string;
  department?: string;
  collegeName?: string;
  semester?: string;
  weakAreas?: string[];
  skills?: string[];
  missingSkills?: string[];
  roadmapDurationDays?: number;
  roadmapDailyPace?: number;
  hasCompleted?: boolean;
  roadmap_modules?: any[];
  roadmap_progress?: Record<string, any>;
  courseId?: string;
  activeCourseIds?: string[];
  completedQuestsTimestamps?: string[];
  completedMissionsTimestamps?: string[];
  last_streak_date?: string;
  initiatedQuests?: string[];
  questCodes?: Record<string, string>;
  selectedTeacherId?: string;
  [key: string]: any;
}

export interface UserProgressContextType {
  onboardingAnswers: OnboardingAnswers;
  setOnboarding: (answers: Omit<OnboardingAnswers, 'hasCompleted'>, skipSync?: boolean) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  completedMissions: string[];
  completeMission: (missionId: string, bypassDailyLimit?: boolean) => void;
  jdMissingSkills: string[];
  setJdMissingSkills: (skills: string[]) => void;
  xp: number;
  addXp: (amount: number, reason: string) => void | Promise<void>;
  missionStreak: number;
  missionOnlyStreak: number;
  careerScore: number;
  dnaScore: number;
  trustScore: number;
  resumeGenerated: boolean;
  setResumeGenerated: (val: boolean) => void;
  roadmapGenerated: boolean;
  setRoadmapGenerated: (val: boolean) => void;
  generateFusedRoadmap: (skillTags: string[], weakAreas: string[], courseId?: string, durationDays?: number, dailyPace?: number) => Promise<any[] | null>;
  activeCourseId: string | null;
  setActiveCourseId: (val: string | null) => void;
  activeCourseIds?: string[];
  setActiveCourseIds?: (vals: string[]) => void;
  switchActiveCourse?: (courseId: string) => void;
  archiveActiveCourse?: (courseId: string) => void;
  completedQuests: string[];
  addCompletedQuest: (questId: string, isExam?: boolean, xpAmount?: number, courseId?: string) => void;
  saveQuestCode: (questId: string, code: string) => void;
  saveCareerProjects: (projects: any[]) => void;
  javaTestPassed: boolean;
  setJavaTestPassed: (val: boolean) => void;
  groupPanelPassed: boolean;
  setGroupPanelPassed: (val: boolean) => void;
  recruiterVisible: boolean;
  setRecruiterVisible: (val: boolean) => void;
}

const UserProgressContext = createContext<UserProgressContextType | null>(null);

const DEFAULT_ONBOARDING: OnboardingAnswers = {
  role: 'Full Stack Engineer',
  education: 'B.Tech / B.E. Computer Science',
  experience: 'Fresher (2024 / 2025 batch)',
  goal: 'Get hired at a product company / high-growth startup',
  skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
  weakAreas: ['System Design Basics', 'DSA - Trees & Graphs', 'STAR Behavioral Interviews'],
  targetCompanies: 'Product Companies & Startups',
  hasCompleted: false,
  roadmap_modules: []
};

// DEFAULT_ONBOARDING is placeholder data shown before onboarding. It must never be
// merged into, and saved as, a student's real answers.
function withoutPlaceholderDefaults(answers: OnboardingAnswers): Partial<OnboardingAnswers> {
  const clean: Partial<OnboardingAnswers> = { ...answers };
  for (const [key, value] of Object.entries(DEFAULT_ONBOARDING)) {
    if (JSON.stringify(clean[key]) === JSON.stringify(value)) delete clean[key];
  }
  return clean;
}

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // localStorage key factory — memoized
  const keys = useMemo(() => ({
    onboard:   `pinit_${userId}_onboarding_answers`,
    missions:  `pinit_${userId}_completed_missions`,
    gaps:      `pinit_${userId}_jd_missing_skills`,
    xp:        `pinit_${userId}_xp`,
    streak:    `pinit_${userId}_streak`,
    pins:      `pinit_${userId}_pins`,
    pinHist:   `pinit_${userId}_pin_history`,
    obStep:    `pinit_${userId}_ob_step`,
    resGen:    `pinit_${userId}_res_gen`,
    roadGen:   `pinit_${userId}_road_gen`,
    quests:    `pinit_${userId}_completed_quests`,
  }), [userId]);

  const [onboardingAnswers, setOnboardingAnswersState] = useState<OnboardingAnswers>(() => {
    if (typeof window === 'undefined') return DEFAULT_ONBOARDING;
    try {
      const saved = localStorage.getItem(keys.onboard);
      return saved ? JSON.parse(saved) : DEFAULT_ONBOARDING;
    } catch {
      return DEFAULT_ONBOARDING;
    }
  });

  // Latest answers, updated synchronously by every writer in this provider (all of them
  // go through commitAnswers). Writers merge into this instead of the `onboardingAnswers`
  // captured in their closure, which is stale when two updates run in the same tick —
  // onboarding calls setOnboarding and then generateFusedRoadmap, which used to write
  // the pre-onboarding answers back over the new ones.
  const answersRef = useRef<OnboardingAnswers>(onboardingAnswers);

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(keys.missions);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [jdMissingSkills, setJdMissingSkills] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(keys.gaps);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [xp, setXpState] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem(keys.xp);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [missionStreak, setMissionStreak] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem(keys.streak);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [onboardingStep, setOnboardingStepState] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    try {
      const saved = localStorage.getItem(keys.obStep);
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  const [resumeGenerated, setResumeGeneratedState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(keys.resGen) === 'true';
    } catch {
      return false;
    }
  });

  const [roadmapGenerated, setRoadmapGeneratedState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(keys.roadGen) === 'true';
    } catch {
      return false;
    }
  });

  const [completedQuests, setCompletedQuestsState] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(keys.quests);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCourseId, setActiveCourseIdState] = useState<string | null>(null);
  const [activeCourseIds, setActiveCourseIdsState] = useState<string[]>([]);
  const [javaTestPassed, setJavaTestPassed] = useState(false);
  const [groupPanelPassed, setGroupPanelPassed] = useState(false);
  const [recruiterVisible, setRecruiterVisible] = useState(true);

  // Broadcast channel for multi-tab sync
  const broadcastRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      broadcastRef.current = new BroadcastChannel('pinit_career_os_sync');
      return () => {
        broadcastRef.current?.close();
      };
    }
  }, []);

  const save = useCallback((key: string, value: any) => {
    if (typeof window === 'undefined') return;
    if (key === keys.pins || key === keys.pinHist) { return; }
    try {
      safeLocalStorageSetItem(key, JSON.stringify(value));
      broadcastRef.current?.postMessage({
        type: 'STORAGE_SYNC',
        key,
        value,
        timestamp: Date.now(),
        sourceId: userId,
      });
    } catch {}
  }, [keys, userId]);

  const commitAnswers = useCallback((next: OnboardingAnswers) => {
    answersRef.current = next;
    setOnboardingAnswersState(next);
    save(keys.onboard, next);
  }, [keys.onboard, save]);

  // Handle cross-tab updates
  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('pinit_career_os_sync');
    channel.onmessage = (event) => {
      const { type, key, value } = event.data || {};
      if (type !== 'STORAGE_SYNC') return;
      if (key === keys.pins || key === keys.pinHist) {
        // DEF-054: Drop raw broadcast channel messages for pins
        return;
      }
      if (key === keys.quests && Array.isArray(value)) {
        // CRDT Set union: never drop completions from another tab (DEF-072)
        setCompletedQuestsState(prev => Array.from(new Set([...prev, ...value])));
      } else if (key === keys.missions && Array.isArray(value)) {
        setCompletedMissions(prev => Array.from(new Set([...prev, ...value])));
      } else if (key === keys.xp) {
        setXpState(Number(value) || 0);
      } else if (key === keys.streak) {
        setMissionStreak(Number(value) || 0);
      } else if (key === keys.onboard && value) {
        answersRef.current = value;
        setOnboardingAnswersState(value);
      }
    };
    return () => {
      channel.close();
    };
  }, [keys]);

  // ── DEF-064 / Task 3.2: Server-first authoritative Supabase progress hydration
  useEffect(() => {
    if (!user || user.id === 'guest') return;

    // 1. Onboarding Answers
    const userAnswers = (user as any).onboardingAnswers || (user as any).onboarding_answers;
    if (userAnswers && typeof userAnswers === 'object' && Object.keys(userAnswers).length > 0) {
      const merged = { ...answersRef.current, ...userAnswers };
      if (userAnswers.roadmap_modules && Array.isArray(userAnswers.roadmap_modules)) {
        merged.roadmap_modules = userAnswers.roadmap_modules;
      }
      // Earlier saves stripped the career role from the stored answers; restore it from
      // users.target_role so the dashboard doesn't show "Unconfigured".
      const serverTargetRole = (user as any).targetRole ?? (user as any).target_role;
      if (!userAnswers.role && merged.hasCompleted && typeof serverTargetRole === 'string' && serverTargetRole) {
        merged.role = serverTargetRole;
      }
      answersRef.current = merged;
      setOnboardingAnswersState(merged);
      try { safeLocalStorageSetItem(keys.onboard, JSON.stringify(merged)); } catch {}
    }

    // 2. Onboarding Step (server is authoritative)
    const serverStep = (user as any).onboardingStep ?? (user as any).onboarding_step;
    if (typeof serverStep === 'number' && serverStep > 0) {
      setOnboardingStepState(prev => {
        const best = Math.max(prev, serverStep);
        try { safeLocalStorageSetItem(keys.obStep, String(best)); } catch {}
        return best;
      });
    }

    // 3. Roadmap Generated (server is authoritative)
    const serverRoadmapGen = (user as any).roadmapGenerated ?? (user as any).roadmap_generated;
    const hasModules = Boolean(userAnswers?.roadmap_modules && Array.isArray(userAnswers.roadmap_modules) && userAnswers.roadmap_modules.length > 0);
    const hasCompletedOnboarding = userAnswers?.hasCompleted === true;
    if (serverRoadmapGen === true || hasModules || hasCompletedOnboarding) {
      setRoadmapGeneratedState(true);
      setOnboardingStepState(prev => Math.max(prev, 3));
      try {
        safeLocalStorageSetItem(keys.roadGen, 'true');
        safeLocalStorageSetItem(keys.obStep, '3');
      } catch {}
    }

    // 4. Resume Generated (server is authoritative)
    const serverResumeGen = (user as any).resumeGenerated ?? (user as any).resume_generated;
    if (typeof serverResumeGen === 'boolean') {
      setResumeGeneratedState(prev => {
        const val = prev || serverResumeGen;
        try { safeLocalStorageSetItem(keys.resGen, String(val)); } catch {}
        return val;
      });
    }

    // 5. Completed Quests (CRDT union)
    const serverQuests = (user as any).completedQuests ?? (user as any).completed_quests;
    if (Array.isArray(serverQuests) && serverQuests.length > 0) {
      setCompletedQuestsState(prev => {
        const merged = Array.from(new Set([...prev, ...serverQuests]));
        try { safeLocalStorageSetItem(keys.quests, JSON.stringify(merged)); } catch {}
        return merged;
      });
    }

    // 6. Completed Missions (CRDT union)
    const serverMissions = (user as any).completedMissions ?? (user as any).completed_missions;
    if (Array.isArray(serverMissions) && serverMissions.length > 0) {
      setCompletedMissions(prev => {
        const merged = Array.from(new Set([...prev, ...serverMissions]));
        try { safeLocalStorageSetItem(keys.missions, JSON.stringify(merged)); } catch {}
        return merged;
      });
    }

    // 7. XP (server max)
    const serverXp = (user as any).xp ?? (user as any).xp_total;
    if (typeof serverXp === 'number' && serverXp > 0) {
      setXpState(prev => {
        const best = Math.max(prev, serverXp);
        try { safeLocalStorageSetItem(keys.xp, String(best)); } catch {}
        return best;
      });
    }

    // 8. Mission Streak (server max)
    const serverStreak = (user as any).missionStreak ?? (user as any).mission_streak;
    if (typeof serverStreak === 'number' && serverStreak > 0) {
      setMissionStreak(prev => {
        const best = Math.max(prev, serverStreak);
        try { safeLocalStorageSetItem(keys.streak, String(best)); } catch {}
        return best;
      });
    }

    // 9. Recruiter Visibility (server hydration)
    const serverRecruiterVis = (user as any).recruiter_visibility ?? (user as any).recruiterVisibility ?? (user as any).recruiterVisible;
    if (serverRecruiterVis !== undefined && serverRecruiterVis !== null) {
      if (typeof serverRecruiterVis === 'boolean') {
        setRecruiterVisible(serverRecruiterVis);
      } else {
        setRecruiterVisible(Number(serverRecruiterVis) > 0);
      }
    }
  }, [user, keys]);

  // Offline sync queue processor: drains pending quest completions whenever connection returns
  useEffect(() => {
    if (typeof window === 'undefined' || !userId || userId === 'guest') return;

    const flushPending = async () => {
      try {
        const queueKey = `pinit_${userId}_pending_quest_completions`;
        const raw = localStorage.getItem(queueKey);
        if (!raw) return;
        const pending = JSON.parse(raw);
        if (!Array.isArray(pending) || pending.length === 0) return;

        const remaining: any[] = [];
        for (const item of pending) {
          try {
            await api.post('/api/quest/complete', item);
            await persistQuestCompletion(userId, item.questId, item.isExam, item.xpAmount || 150, item.courseId);
          } catch {
            remaining.push(item);
          }
        }
        if (remaining.length > 0) {
          localStorage.setItem(queueKey, JSON.stringify(remaining));
        } else {
          localStorage.removeItem(queueKey);
        }
      } catch {}
    };

    flushPending();
    window.addEventListener('online', flushPending);
    return () => {
      window.removeEventListener('online', flushPending);
    };
  }, [userId]);

  const addXp = useCallback(async (amount: number, reason: string) => {
    setXpState(prev => {
      const next = prev + amount;
      save(keys.xp, next);
      return next;
    });
    if (userId && userId !== 'guest') {
      api.post('/api/xp/add', { amount, reason, actionType: 'general' }).catch(() => {});
    }
    toast.success(`+${amount} XP Earned 🌟`, reason);
  }, [keys.xp, save, userId]);

  const completeMission = useCallback((missionId: string, bypassDailyLimit = false) => {
    const timestamps = answersRef.current.completedMissionsTimestamps || [];
    const today = new Date().toDateString();
    const todayCompletions = timestamps.filter(ts => new Date(ts).toDateString() === today);
    if (!bypassDailyLimit && todayCompletions.length >= 1) {
      toast.error('Daily Limit Reached ⏳', 'You have already completed 1 mission today. Come back tomorrow!');
      return;
    }

    if (completedMissions.includes(missionId)) return;
    const updated = [...completedMissions, missionId];
    setCompletedMissions(updated);
    save(keys.missions, updated);

    const todayStr = new Date().toDateString();
    const hasCompletedToday = answersRef.current.last_streak_date === todayStr;
    const newStreak = hasCompletedToday ? missionStreak : missionStreak + 1;
    setMissionStreak(newStreak);
    save(keys.streak, newStreak);

    // DEF-042 FIX: Streak milestone bonus is verified and claimed authoritatively on server
    if (newStreak % 7 === 0 && userId && userId !== 'guest') {
      api.post('/api/pins/claim-streak-bonus', { milestone: newStreak })
        .then((res: any) => {
          if (res?.ok && res?.pinsGranted) {
            toast.success('🎉 Streak Milestone Bonus!', `+${res.pinsGranted} pins credited for your ${newStreak}-day streak!`);
          }
        })
        .catch((err: any) => {
          console.warn('[UserProgress] Streak bonus claim notice:', err?.message || err);
        });
    }

    const nextTimestamps = [...timestamps, new Date().toISOString()];
    const nextAnswers = {
      ...answersRef.current,
      completedMissionsTimestamps: nextTimestamps,
      last_streak_date: todayStr,
    };
    commitAnswers(nextAnswers);
    if (userId && userId !== 'guest') {
      updateUserProfile(userId, {
        completed_missions: updated,
        mission_streak: newStreak,
        onboarding_answers: nextAnswers,
      }).catch(() => {});
    }
    toast.success('Mission Complete! 🎯', 'Great progress today!');
  }, [commitAnswers, completedMissions, keys, missionStreak, save, userId]);

  const addCompletedQuest = useCallback((questId: string, isExam?: boolean, xpAmount?: number, courseId?: string) => {
    const timestamps = answersRef.current.completedQuestsTimestamps || [];
    const today = new Date().toDateString();
    const todayCompletions = timestamps.filter(raw => {
      const parts = raw.split('|');
      const ts = parts[0];
      return new Date(ts).toDateString() === today;
    });

    if (todayCompletions.length >= 3 && !isExam) {
      toast.error('Daily Limit Reached ⏳', 'You have reached your global daily limit of 3 completed quests across all courses today.');
      return;
    }

    if (completedQuests.includes(questId)) return;

    const next = [...completedQuests, questId];
    setCompletedQuestsState(next);
    save(keys.quests, next);

    const nextTimestamps = [...timestamps, `${new Date().toISOString()}|${courseId || 'general'}`];
    const nextAnswers = {
      ...answersRef.current,
      completedQuestsTimestamps: nextTimestamps,
    };
    commitAnswers(nextAnswers);

    if (userId && userId !== 'guest') {
      const payload = { questId, isExam, xpAmount, courseId, timestamp: new Date().toISOString() };
      api.post('/api/quest/complete', payload).catch(() => {
        try {
          const queueKey = `pinit_${userId}_pending_quest_completions`;
          const raw = localStorage.getItem(queueKey);
          const existing = raw ? JSON.parse(raw) : [];
          if (!existing.some((item: any) => item.questId === questId)) {
            existing.push(payload);
            localStorage.setItem(queueKey, JSON.stringify(existing));
          }
        } catch {}
      });
      persistQuestCompletion(userId, questId, isExam, xpAmount || 150, courseId).catch(() => {});
      updateUserProfile(userId, {
        completed_quests: next,
        onboarding_answers: nextAnswers,
      }).catch(() => {});
    }
  }, [commitAnswers, completedQuests, keys, save, userId]);

  const saveQuestCode = useCallback((questId: string, code: string) => {
    const prev = answersRef.current;
    const next = { ...prev, questCodes: { ...(prev.questCodes || {}), [questId]: code } };
    commitAnswers(next);
    if (userId && userId !== 'guest') {
      updateUserProfile(userId, { onboarding_answers: next }).catch(() => {});
    }
  }, [commitAnswers, userId]);

  const setOnboarding = useCallback((answers: Omit<OnboardingAnswers, 'hasCompleted'>, skipSync = false) => {
    // Merge, never replace: callers pass only the fields they know (the dashboard
    // trajectory picker sends role/education/skills/experience) and must not wipe the
    // persona, scores or roadmap saved during onboarding.
    const current = answersRef.current;
    const base = current.hasCompleted ? current : withoutPlaceholderDefaults(current);
    const full: OnboardingAnswers = { ...base, ...answers, hasCompleted: true };
    commitAnswers(full);
    if (!skipSync && userId && userId !== 'guest') {
      // Nested so the server merges it into the stored answers (a root-level `role` is
      // stripped as a privileged field).
      api.post('/api/auth/onboarding', { onboardingAnswers: full }).catch(() => {});
      updateUserProfile(userId, { onboarding_step: Math.max(onboardingStep, 2) }).catch(() => {});
    }
  }, [commitAnswers, onboardingStep, userId]);

  const setOnboardingStep = useCallback((step: number) => {
    setOnboardingStepState(step);
    save(keys.obStep, step);
    if (userId && userId !== 'guest') {
      updateUserProfile(userId, { onboarding_step: step }).catch(() => {});
    }
  }, [keys.obStep, save, userId]);

  const setResumeGenerated = useCallback((val: boolean) => {
    setResumeGeneratedState(val);
    save(keys.resGen, val);
    if (userId && userId !== 'guest') {
      updateUserProfile(userId, { resume_generated: val }).catch(() => {});
    }
  }, [keys.resGen, save, userId]);

  const setRoadmapGenerated = useCallback((val: boolean) => {
    setRoadmapGeneratedState(val);
    save(keys.roadGen, val);
    if (userId && userId !== 'guest') {
      updateUserProfile(userId, { roadmap_generated: val }).catch(() => {});
    }
  }, [keys.roadGen, save, userId]);

  const setActiveCourseId = useCallback((val: string | null) => {
    setActiveCourseIdState(val);
  }, []);

  const setActiveCourseIds = useCallback((vals: string[]) => {
    setActiveCourseIdsState(vals);
  }, []);

  const switchActiveCourse = useCallback((courseId: string) => {
    setActiveCourseIdState(courseId);
  }, []);

  const archiveActiveCourse = useCallback((courseId: string) => {
    setActiveCourseIdsState(prev => prev.filter(c => c !== courseId));
  }, []);

  const saveCareerProjects = useCallback((projects: any[]) => {
    const next = { ...answersRef.current, portfolio_projects: projects };
    commitAnswers(next);
    if (userId && userId !== 'guest') {
      updateUserProfile(userId, { onboarding_answers: next }).catch(() => {});
    }
  }, [commitAnswers, userId]);

  const generateFusedRoadmap = useCallback(async (
    skillTags: string[],
    weakAreas: string[],
    courseId?: string,
    durationDays = 30,
    dailyPace = 2
  ): Promise<any[] | null> => {
    const answers = answersRef.current;
    const targetRole = answers.role || 'Full Stack Engineer';
    const experienceLevel = answers.experience || 'beginner';
    const effectiveCourseId = courseId || 'course-java-logic';

    const persistRoadmapModules = (mods: any[]) => {
      commitAnswers({ ...answersRef.current, roadmap_modules: mods });
      setRoadmapGenerated(true);

      if (typeof window !== 'undefined') {
        try {
          safeLocalStorageSetItem(`pinit_${userId}_roadmap_modules`, JSON.stringify(mods));
          safeLocalStorageSetItem(`pinit_${userId}_roadmap_modules_${effectiveCourseId}`, JSON.stringify(mods));
          safeLocalStorageSetItem(keys.roadGen, 'true');
        } catch {}
      }

      if (userId && userId !== 'guest') {
        // Send only the roadmap; the server merges it into the stored answers.
        api.post('/api/auth/onboarding', {
          onboardingAnswers: { roadmap_modules: mods },
          roadmapGenerated: true,
        }).catch(() => {});
      }
    };

    try {
      const res = await api.post<{ ok: boolean; modules: any[] }>('/api/career-builder/generate', {
        targetRole,
        skillTags,
        weakAreas,
        experienceLevel,
        courseId: effectiveCourseId,
        durationDays,
        dailyPace,
      });

      if (res && res.modules && Array.isArray(res.modules) && res.modules.length > 0) {
        persistRoadmapModules(res.modules);
        return res.modules;
      }
    } catch (err) {
      console.warn('[generateFusedRoadmap] API generation failed, falling back to local fuser:', err);
    }

    // Client-side fallback fuser
    try {
      const fallbackModules = generateDynamicStudentRoadmap({
        courseId: effectiveCourseId,
        goal: targetRole,
        qt1: answers.qt1_score ?? 45,
        qt2: answers.qt2_score ?? 50,
        archetype: answers.mindset_archetype || 'Pattern Hunter',
        durationDays,
        dailyPace,
      });

      if (fallbackModules && fallbackModules.length > 0) {
        persistRoadmapModules(fallbackModules);
        return fallbackModules;
      }
    } catch (fallbackErr) {
      console.error('[generateFusedRoadmap] Local roadmap fallback failed:', fallbackErr);
    }

    return null;
  }, [commitAnswers, keys.roadGen, setRoadmapGenerated, userId]);


  const careerScore = useMemo(() => {
    // Derive transparently from real verified student progress; start at 0 for fresh accounts
    if (completedQuests.length === 0 && completedMissions.length === 0) return 0;
    const questPoints = Math.min(50, completedQuests.length * 5);
    const missionPoints = Math.min(50, completedMissions.length * 10);
    return Math.min(100, questPoints + missionPoints);
  }, [completedQuests.length, completedMissions.length]);

  const dnaScore = useMemo(() => {
    if (completedQuests.length === 0 && missionStreak === 0) return 0;
    return Math.min(100, Math.min(70, completedQuests.length * 5) + Math.min(30, missionStreak * 5));
  }, [completedQuests.length, missionStreak]);

  const trustScore = useMemo(() => {
    if (completedMissions.length === 0) return 0;
    return Math.min(100, Math.min(100, completedMissions.length * 20));
  }, [completedMissions.length]);

  const setRecruiterVisibleAuthoritative = useCallback((val: boolean) => {
    setRecruiterVisible(val);
    if (userId && userId !== 'guest') {
      api.patch('/api/recruiter/visibility', { visible: val }).catch(() => {});
    }
  }, [userId]);

  const value = useMemo<UserProgressContextType>(() => ({
    onboardingAnswers,
    setOnboarding,
    onboardingStep,
    setOnboardingStep,
    completedMissions,
    completeMission,
    jdMissingSkills,
    setJdMissingSkills,
    xp,
    addXp,
    missionStreak,
    missionOnlyStreak: missionStreak,
    careerScore,
    dnaScore,
    trustScore,
    resumeGenerated,
    setResumeGenerated,
    roadmapGenerated,
    setRoadmapGenerated,
    generateFusedRoadmap,
    activeCourseId,
    setActiveCourseId,
    activeCourseIds,
    setActiveCourseIds,
    switchActiveCourse,
    archiveActiveCourse,
    completedQuests,
    addCompletedQuest,
    saveQuestCode,
    saveCareerProjects,
    javaTestPassed,
    setJavaTestPassed,
    groupPanelPassed,
    setGroupPanelPassed,
    recruiterVisible,
    setRecruiterVisible: setRecruiterVisibleAuthoritative,
  }), [
    onboardingAnswers,
    setOnboarding,
    onboardingStep,
    setOnboardingStep,
    completedMissions,
    completeMission,
    jdMissingSkills,
    setJdMissingSkills,
    xp,
    addXp,
    missionStreak,
    careerScore,
    dnaScore,
    trustScore,
    resumeGenerated,
    setResumeGenerated,
    roadmapGenerated,
    setRoadmapGenerated,
    generateFusedRoadmap,
    activeCourseId,
    setActiveCourseId,
    activeCourseIds,
    setActiveCourseIds,
    switchActiveCourse,
    archiveActiveCourse,
    completedQuests,
    addCompletedQuest,
    saveQuestCode,
    saveCareerProjects,
    javaTestPassed,
    setJavaTestPassed,
    groupPanelPassed,
    setGroupPanelPassed,
    recruiterVisible,
    setRecruiterVisibleAuthoritative,
  ]);

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress(): UserProgressContextType {
  const ctx = useContext(UserProgressContext);
  if (!ctx) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return ctx;
}
