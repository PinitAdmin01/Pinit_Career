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
      setOnboardingAnswersState(prev => {
        const merged = { ...prev, ...userAnswers };
        if (userAnswers.roadmap_modules && Array.isArray(userAnswers.roadmap_modules)) {
          merged.roadmap_modules = userAnswers.roadmap_modules;
        }
        try { safeLocalStorageSetItem(keys.onboard, JSON.stringify(merged)); } catch {}
        return merged;
      });
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
    const timestamps = onboardingAnswers.completedMissionsTimestamps || [];
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
    const hasCompletedToday = onboardingAnswers?.last_streak_date === todayStr;
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
      ...onboardingAnswers,
      completedMissionsTimestamps: nextTimestamps,
      last_streak_date: todayStr,
    };
    setOnboardingAnswersState(nextAnswers);
    save(keys.onboard, nextAnswers);
    if (userId && userId !== 'guest') {
      updateUserProfile(userId, {
        completed_missions: updated,
        mission_streak: newStreak,
        onboarding_answers: nextAnswers,
      }).catch(() => {});
    }
    toast.success('Mission Complete! 🎯', 'Great progress today!');
  }, [completedMissions, keys, missionStreak, onboardingAnswers, save, userId]);

  const addCompletedQuest = useCallback((questId: string, isExam?: boolean, xpAmount?: number, courseId?: string) => {
    const timestamps = onboardingAnswers.completedQuestsTimestamps || [];
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
      ...onboardingAnswers,
      completedQuestsTimestamps: nextTimestamps,
    };
    setOnboardingAnswersState(nextAnswers);
    save(keys.onboard, nextAnswers);

    if (userId && userId !== 'guest') {
      api.post('/api/quest/complete', { questId, isExam, xpAmount, courseId }).catch(() => {});
      persistQuestCompletion(userId, questId, xpAmount || 150).catch(() => {});
      updateUserProfile(userId, {
        completed_quests: next,
        onboarding_answers: nextAnswers,
      }).catch(() => {});
    }
  }, [completedQuests, keys, onboardingAnswers, save, userId]);

  const saveQuestCode = useCallback((questId: string, code: string) => {
    setOnboardingAnswersState(prev => {
      const existing = prev.questCodes || {};
      const next = { ...prev, questCodes: { ...existing, [questId]: code } };
      save(keys.onboard, next);
      if (userId && userId !== 'guest') {
        updateUserProfile(userId, { onboarding_answers: next }).catch(() => {});
      }
      return next;
    });
  }, [keys.onboard, save, userId]);

  const setOnboarding = useCallback((answers: Omit<OnboardingAnswers, 'hasCompleted'>, skipSync = false) => {
    const full: OnboardingAnswers = { ...answers, hasCompleted: true };
    setOnboardingAnswersState(full);
    save(keys.onboard, full);
    if (!skipSync && userId && userId !== 'guest') {
      api.post('/api/auth/onboarding', full).catch(() => {});
      updateUserProfile(userId, {
        onboarding_answers: full,
        onboarding_step: Math.max(onboardingStep, 2),
      }).catch(() => {});
    }
  }, [keys.onboard, onboardingStep, save, userId]);

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
    setOnboardingAnswersState(prev => {
      const next = { ...prev, portfolio_projects: projects };
      save(keys.onboard, next);
      if (userId && userId !== 'guest') {
        updateUserProfile(userId, { onboarding_answers: next }).catch(() => {});
      }
      return next;
    });
  }, [keys.onboard, save, userId]);

  const generateFusedRoadmap = useCallback(async (
    skillTags: string[],
    weakAreas: string[],
    courseId?: string,
    durationDays = 30,
    dailyPace = 2
  ): Promise<any[] | null> => {
    const targetRole = onboardingAnswers.role || 'Full Stack Engineer';
    const experienceLevel = onboardingAnswers.experience || 'beginner';

    try {
      const res = await api.post<{ ok: boolean; modules: any[] }>('/api/career-builder/generate', {
        targetRole,
        skillTags,
        weakAreas,
        experienceLevel,
        courseId,
        durationDays,
        dailyPace,
      });

      if (res && res.modules && Array.isArray(res.modules)) {
        const nextAnswers = { ...onboardingAnswers, roadmap_modules: res.modules };
        setOnboardingAnswersState(nextAnswers);
        save(keys.onboard, nextAnswers);
        setRoadmapGenerated(true);
        if (userId && userId !== 'guest') {
          updateUserProfile(userId, {
            roadmap_generated: true,
            onboarding_answers: nextAnswers,
          }).catch(() => {});
        }
        return res.modules;
      }
    } catch (err) {
      console.warn('[generateFusedRoadmap] API generation failed:', err);
    }
    return null;
  }, [keys.onboard, onboardingAnswers, save, setRoadmapGenerated, userId]);

  const careerScore = useMemo(() => {
    const base = 50;
    const questBonus = Math.min(30, completedQuests.length * 3);
    const missionBonus = Math.min(20, completedMissions.length * 2);
    return Math.min(100, base + questBonus + missionBonus);
  }, [completedQuests.length, completedMissions.length]);

  const dnaScore = useMemo(() => {
    return Math.min(100, 60 + Math.min(25, completedQuests.length * 2) + Math.min(15, missionStreak));
  }, [completedQuests.length, missionStreak]);

  const trustScore = useMemo(() => {
    return Math.min(100, 70 + Math.min(30, completedMissions.length * 3));
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
