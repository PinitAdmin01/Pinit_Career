'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast, useAppStore } from '@/lib/store/useAppStore';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { consecutiveCalendarStreak } from '@/lib/missions/streak';
import { supabase } from '@/lib/supabaseClient';
import { persistQuestCompletion, syncRewardsDB } from '@/lib/supabaseService';
import { markOnboardingStoryPending } from '@/lib/storyTour';
import { useVault, VaultItem } from '@/lib/hooks/useVault';
import { usePins, PinTransaction, PinSource, PIN_COSTS, PIN_EARN } from '@/lib/hooks/usePins';
import { safeLocalStorageSetItem } from '@/lib/storage/careerStorage';

// Re-export decomposed domain types and hooks for complete backward compatibility
export type { VaultItem };
export type { PinTransaction, PinSource };
export { PIN_COSTS, PIN_EARN };
export { useVault, usePins };

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OnboardingAnswers {
  role: string;
  education: string;
  skills: string;
  experience: string;
  hasCompleted: boolean;
  codingExperience?: string;
  learningStyle?: string;
  weeklyHours?: string;
  accessReason?: string;
  career_goal?: string;
  target_goal?: string;
  voice_transcript?: string;
  voice_confidence?: number;
  voice_articulation?: number;
  voice_archetype?: string;
  voice_status?: string;
  activeCourseId?: string | null;
  completedQuestsTimestamps?: string[];
  completedMissionsTimestamps?: string[];
  qt1_score?: number;
  qt2_score?: number;
  mindset_archetype?: string;
  initiatedQuests?: string[];
  selectedTeacherId?: string;
  questCodes?: Record<string, string>;
  last_streak_date?: string;
  communication_history?: any[];
  learning_mistakes?: any[];
  projects?: any[];
  roadmap?: any[];
  roadmapDurationDays?: number;
}

// ─── Context Interface ────────────────────────────────────────────────────────

interface CareerOSContextType {
  // Vault
  vaultItems: VaultItem[];
  setVaultItems: (items: VaultItem[]) => void;
  addVaultItem: (item: { id?: string; title: string; item_type: string; organization_name?: string; description?: string; skill_tags?: string[]; verified?: boolean; ai_confidence_score?: number }) => void;
  updateVaultItem: (id: string, updates: Partial<VaultItem>) => void;
  // Onboarding
  onboardingAnswers: OnboardingAnswers;
  setOnboarding: (answers: Omit<OnboardingAnswers, 'hasCompleted'>, skipSync?: boolean) => void;
  // Missions
  completedMissions: string[];
  completeMission: (missionId: string, bypassDailyLimit?: boolean) => void;
  // JD Skills
  jdMissingSkills: string[];
  setJdMissingSkills: (skills: string[]) => void;
  // XP (legacy, kept for backward compat)
  xp: number;
  addXp: (amount: number, reason: string) => void | Promise<void>;
  // Streak
  missionStreak: number;
  missionOnlyStreak: number;
  // Theme & Focus
  theme: 'light' | 'dark';
  focusMode: boolean;
  toggleTheme: () => void;
  toggleFocusMode: () => void;
  // Derived scores
  careerScore: number;
  dnaScore: number;
  trustScore: number;

  // ─── CREDIT SYSTEM ───────────────────────────────────────────────────────
  pins: number;
  pinHistory: PinTransaction[];
  earnPins: (source: PinSource, overrideAmount?: number, reason?: string) => void;
  spendPins: (featureKey: string, customReason?: string) => Promise<boolean>; // returns false if insufficient
  canAfford: (featureKey: string) => boolean;
  // Item duration unlock methods (30 min access per item)
  unlockedItems: Record<string, number>;
  isItemUnlocked: (itemKey: string) => boolean;
  getItemRemainingSeconds: (itemKey: string) => number;
  extendItemGrace?: (itemKey: string, minutes?: number) => Promise<{ success: boolean; newRemainingSec: number; message: string }> | { success: boolean; newRemainingSec: number; message: string };
  unlockItem: (itemKey: string, category: 'quest' | 'mission' | 'interview' | 'ai_interview' | 'gd' | 'group_discussion' | 'attention_span_game', customReason?: string) => Promise<boolean>;
  rewardActivity: (type: 'quest' | 'mission' | 'interview' | 'gd' | 'attention_game' | 'project', title?: string) => void;

  // ─── PROGRESSION SYSTEM ──────────────────────────────────────────────────
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
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
  unlockedTabs: string[];
  forceShowCareerBuilder: boolean;
  setForceShowCareerBuilder: (val: boolean) => void;
  demoTabsUnlocked: boolean;
  setDemoTabsUnlocked: (val: boolean) => void;
  aiUseTokens: number;
  setAiUseTokens: (val: number) => void;
  decrementAiUseTokens: (amount: number) => void;
  buyAiMinutes: () => Promise<boolean>;
  isLoaded: boolean;
}

const CareerOSContext = createContext<CareerOSContextType | null>(null);

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_VAULT_ITEMS: VaultItem[] = []; // Empty vault by default for new redone setup

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CareerOSProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // ── Slices extracted via Defect 107 decomposition ──────────────────────
  const theme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);
  const toggleTheme = useAppStore(s => s.toggleTheme);
  const focusMode = useAppStore(s => s.focusMode);
  const toggleFocusMode = useAppStore(s => s.toggleFocusMode);
  const aiUseTokens = useAppStore(s => s.aiUseTokens);
  const setAiUseTokens = useAppStore(s => s.setAiUseTokens);
  const decrementAiUseTokens = useAppStore(s => s.decrementAiUseTokens);

  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>({ role: '', education: '', skills: '', experience: '', hasCompleted: false });
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [jdMissingSkills, setJdMissingSkillsState] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [missionStreak, setMissionStreak] = useState(0); // Start streak at 0
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Progression State ──
  const [onboardingStep, setOnboardingStepState] = useState(0);
  const [resumeGenerated, setResumeGeneratedState] = useState(false);
  const [roadmapGenerated, setRoadmapGeneratedState] = useState(false);
  const [activeCourseId, setActiveCourseIdState] = useState<string | null>(null);
  const [activeCourseIds, setActiveCourseIdsState] = useState<string[]>([]);
  const [completedQuests, setCompletedQuestsState] = useState<string[]>([]);
  const [javaTestPassed, setJavaTestPassedState] = useState(false);
  const [groupPanelPassed, setGroupPanelPassedState] = useState(false);
  const [recruiterVisible, setRecruiterVisibleState] = useState(false);
  const [unlockedTabs, setUnlockedTabs] = useState<string[]>(['/dashboard', '/career-builder', '/quests']);
  const [forceShowCareerBuilder, setForceShowCareerBuilderState] = useState(false);
  const [demoTabsUnlocked, setDemoTabsUnlockedState] = useState(false);
  const [trustBonus, setTrustBonus] = useState(0);
  const [dnaBonus, setDnaBonus] = useState(0);
  const lastRewardTimeRef = useRef<number>(0);

  // Slices decomposed into standalone hooks (Defect 107)
  const {
    pins,
    setPins,
    pinHistory,
    setPinsHistory,
    unlockedItems,
    setUnlockedItems,
    earnPins,
    spendPins,
    canAfford,
    isItemUnlocked,
    getItemRemainingSeconds,
    extendItemGrace,
    unlockItem,
  } = usePins({
    userId,
    userEmail: user?.email,
  });

  const {
    vaultItems,
    setVaultItems,
    addVaultItem,
    updateVaultItem,
  } = useVault({
    userId,
    onAddXp: (amount, reason) => {
      addXp(amount, reason);
    },
    onEarnPins: (source) => earnPins(source as any),
  });

  // localStorage key factory — memoized to prevent infinite re-render loops
  const keys = useMemo(() => ({
    vault:     `pinit_${userId}_vault_items`,
    onboard:   `pinit_${userId}_onboarding_answers`,
    missions:  `pinit_${userId}_completed_missions`,
    gaps:      `pinit_${userId}_jd_missing_skills`,
    xp:        `pinit_${userId}_xp`,
    streak:    `pinit_${userId}_streak`,
    theme:     `pinit_${userId}_theme`,
    pins:      `pinit_${userId}_pins`,
    pinHist:   `pinit_${userId}_pin_history`,
    unlockedItems: `pinit_${userId}_unlocked_items`,
    last1AMReset:  `pinit_${userId}_last_1am_reset`,
    trustBonus:    `pinit_${userId}_trust_bonus`,
    dnaBonus:      `pinit_${userId}_dna_bonus`,
    // progression
    obStep:    `pinit_${userId}_ob_step`,
    resGen:    `pinit_${userId}_res_gen`,
    roadGen:   `pinit_${userId}_road_gen`,
    quests:    `pinit_${userId}_completed_quests`,
    javaPass:  `pinit_${userId}_java_pass`,
    groupPass: `pinit_${userId}_group_pass`,
    recVis:    `pinit_${userId}_rec_vis`,
    forceShowCareer: `pinit_${userId}_force_show_career`,
    demoTabsUnlocked: `pinit_${userId}_demo_tabs_unlocked`,
    aiTokens:  `pinit_${userId}_ai_tokens`,
    activeCourse: `pinit_${userId}_active_course_id`,
    activeCourses: `pinit_${userId}_active_course_ids`
  }), [userId]);

  const broadcastRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      try {
        broadcastRef.current = new BroadcastChannel('pinit_career_os_sync');
      } catch {}
    }
    return () => {
      try { broadcastRef.current?.close(); } catch {}
    };
  }, []);

  const lastSyncTimestamps = useRef<Record<string, number>>({});

  const save = useCallback((key: string, data: unknown) => {
    if (typeof window !== 'undefined') {
      const serialized = JSON.stringify(data);
      const res = safeLocalStorageSetItem(key, serialized);
      if (res.fallbackToIdb) {
        toast.warning('Storage Space Low', 'Cached items pruned; vital progress safely backed up to IndexedDB.');
      }
      // DEF-054: Discontinue manual broadcast posting for pin balances and history.
      // Financial balance and transaction sync is driven authoritatively via Supabase Realtime.
      if (key === keys.pins || key === keys.pinHist) {
        return;
      }
      const timestamp = Date.now();
      lastSyncTimestamps.current[key] = timestamp;
      try {
        broadcastRef.current?.postMessage({ key, data, userId, timestamp });
      } catch {}
    }
  }, [userId, keys.pins, keys.pinHist]);

  // ── Multi-Tab Cross-Synchronization (DEF-041, DEF-072) ──────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSync = (key: string | null, rawValue: string | null) => {
      if (!key || rawValue === null) return;
      try {
        const parsed = JSON.parse(rawValue);
        if (key === keys.pins || key === keys.pinHist) {
          // DEF-054: Drop raw broadcast channel messages for pins to prevent stale cross-tab echo flicker.
          // Pin balance and history sync across tabs is handled authoritatively via Supabase Realtime in usePins.
          return;
        } else if (key === keys.unlockedItems && typeof parsed === 'object' && parsed !== null) {
          setUnlockedItems(parsed);
        } else if (key === keys.quests && Array.isArray(parsed)) {
          // CRDT Set union: never drop completions from another tab (DEF-072)
          setCompletedQuestsState(prev => Array.from(new Set([...prev, ...parsed])));
        } else if (key === keys.missions && Array.isArray(parsed)) {
          // CRDT Set union: never drop completed missions from another tab (DEF-072)
          setCompletedMissions(prev => Array.from(new Set([...prev, ...parsed])));
        } else if (key === keys.xp && typeof parsed === 'number') {
          setXp(prev => Math.max(prev, parsed));
        } else if (key === keys.streak && typeof parsed === 'number') {
          setMissionStreak(prev => Math.max(prev, parsed));
        } else if (key === keys.obStep && typeof parsed === 'number') {
          setOnboardingStepState(prev => Math.max(prev, parsed));
        } else if (key === keys.vault && Array.isArray(parsed)) {
          setVaultItems(parsed);
        } else if (key === keys.onboard && typeof parsed === 'object' && parsed !== null) {
          setOnboardingAnswers(prev => ({
            ...prev,
            ...parsed,
            completedQuestsTimestamps: Array.from(new Set([
              ...(prev.completedQuestsTimestamps || []),
              ...(parsed.completedQuestsTimestamps || [])
            ])),
            completedMissionsTimestamps: Array.from(new Set([
              ...(prev.completedMissionsTimestamps || []),
              ...(parsed.completedMissionsTimestamps || [])
            ])),
            questCodes: {
              ...(prev.questCodes || {}),
              ...(parsed.questCodes || {})
            }
          }));
        } else if (key === keys.trustBonus && typeof parsed === 'number') {
          setTrustBonus(prev => Math.max(prev, parsed));
        } else if (key === keys.dnaBonus && typeof parsed === 'number') {
          setDnaBonus(prev => Math.max(prev, parsed));
        } else if (key === keys.aiTokens && typeof parsed === 'number') {
          setAiUseTokens(parsed);
        } else if (key === keys.resGen && typeof parsed === 'boolean') {
          setResumeGeneratedState(parsed);
        } else if (key === keys.roadGen && typeof parsed === 'boolean') {
          setRoadmapGeneratedState(parsed);
        } else if (key === keys.javaPass && typeof parsed === 'boolean') {
          setJavaTestPassedState(parsed);
        } else if (key === keys.groupPass && typeof parsed === 'boolean') {
          setGroupPanelPassedState(parsed);
        } else if (key === keys.recVis && typeof parsed === 'boolean') {
          setRecruiterVisibleState(parsed);
        } else if (key === keys.demoTabsUnlocked && typeof parsed === 'boolean') {
          setDemoTabsUnlockedState(parsed);
        } else if (key === keys.activeCourse) {
          setActiveCourseIdState(parsed);
        } else if (key === keys.activeCourses && Array.isArray(parsed)) {
          setActiveCourseIdsState(prev => Array.from(new Set([...prev, ...parsed])));
        }
      } catch {}
    };

    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== localStorage) return;
      handleSync(e.key, e.newValue);
    };

    window.addEventListener('storage', onStorage);

    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel('pinit_career_os_sync');
        channel.onmessage = (ev) => {
          if (ev.data && ev.data.userId === userId && ev.data.key) {
            const msgTs = typeof ev.data.timestamp === 'number' ? ev.data.timestamp : 0;
            const lastTs = lastSyncTimestamps.current[ev.data.key] || 0;
            if (msgTs > 0 && lastTs > 0 && msgTs < lastTs) {
              // Stale broadcast message dropped to prevent race overwrites (DEF-072)
              return;
            }
            if (msgTs > 0) {
              lastSyncTimestamps.current[ev.data.key] = msgTs;
            }
            handleSync(ev.data.key, JSON.stringify(ev.data.data));
          }
        };
      } catch {}
    }

    return () => {
      window.removeEventListener('storage', onStorage);
      if (channel) {
        try { channel.close(); } catch {}
      }
    };
  }, [userId, keys]);

  // ── Load all state from localStorage on mount ─────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (userId === 'guest') {
      // Keep isLoaded as false to prevent race conditions during auth mount
      return;
    }

    setIsLoaded(false);
    try {
      const get = (k: string) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };

      setVaultItems(get(keys.vault) ?? DEFAULT_VAULT_ITEMS);
      setOnboardingAnswers(get(keys.onboard) ?? { role:'', education:'', skills:'', experience:'', hasCompleted:false });
      setCompletedMissions(get(keys.missions) ?? []);
      setJdMissingSkillsState(get(keys.gaps) ?? []);
      setXp(get(keys.xp) ?? (user as any)?.xp ?? 0);
      setMissionStreak(get(keys.streak) ?? 0);
      setTheme(get(keys.theme) ?? (typeof window !== 'undefined' ? (localStorage.getItem('pc_theme') as 'dark' | 'light') : null) ?? 'dark');
      setPins(get(keys.pins) ?? (user as any)?.pins ?? 0);
      setPinsHistory(get(keys.pinHist) ?? []);
      setUnlockedItems(get(keys.unlockedItems) ?? {});
      setTrustBonus(get(keys.trustBonus) ?? 0);
      setDnaBonus(get(keys.dnaBonus) ?? 0);
      
      // progression loaders
      setOnboardingStepState(get(keys.obStep) ?? 0);
      setResumeGeneratedState(get(keys.resGen) ?? false);
      setRoadmapGeneratedState(get(keys.roadGen) ?? false);
      setCompletedQuestsState(get(keys.quests) ?? []);
      setJavaTestPassedState(get(keys.javaPass) ?? false);
      setGroupPanelPassedState(get(keys.groupPass) ?? false);
      setRecruiterVisibleState(get(keys.recVis) ?? false);
      setForceShowCareerBuilderState(get(keys.forceShowCareer) ?? false);
      setDemoTabsUnlockedState(get(keys.demoTabsUnlocked) ?? false);
      setAiUseTokens(get(keys.aiTokens) ?? 120);
      setActiveCourseIdState(get(keys.activeCourse) ?? null);
      setActiveCourseIdsState(get(keys.activeCourses) ?? []);
    } catch {}
    finally { setIsLoaded(true); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Sync with Firestore profile overrides
  useEffect(() => {
    if (user && typeof user.pins === 'number') {
      const pinsVal = user.pins as number;
      if (pins !== pinsVal) {
        setPins(pinsVal);
        save(keys.pins, pinsVal);
      }
    }
  }, [user?.pins, pins, setPins, keys.pins, save]);

  // Sync state from Supabase profile to context local states on load or update (One-way progression lock)
  useEffect(() => {
    if (user && isLoaded) {
      if (user.onboardingStep !== undefined && typeof user.onboardingStep === 'number') {
        const stepVal = user.onboardingStep as number;
        setOnboardingStepState(prev => {
          // Only sync if the database step is further along (prevents overwrites from stale load data)
          if (prev < stepVal) {
            save(keys.obStep, stepVal);
            return stepVal;
          }
          return prev;
        });
      }
      if (user.onboardingAnswers && typeof user.onboardingAnswers === 'object') {
        const answers = user.onboardingAnswers as OnboardingAnswers;
        if (answers.activeCourseId) {
          setActiveCourseIdState(answers.activeCourseId);
          save(keys.activeCourse, answers.activeCourseId);
        }
        setOnboardingAnswers(prev => {
          const mergedMissionsTimestamps = Array.from(new Set([
            ...(prev.completedMissionsTimestamps || []),
            ...(answers.completedMissionsTimestamps || [])
          ]));
          const mergedQuestsTimestamps = Array.from(new Set([
            ...(prev.completedQuestsTimestamps || []),
            ...(answers.completedQuestsTimestamps || [])
          ]));

          const merged: OnboardingAnswers = {
            ...prev,
            ...answers,
            hasCompleted: prev.hasCompleted || answers.hasCompleted,
            completedMissionsTimestamps: mergedMissionsTimestamps,
            completedQuestsTimestamps: mergedQuestsTimestamps,
            roadmap: answers.roadmap || prev.roadmap,
            activeCourseId: answers.activeCourseId || prev.activeCourseId,
          };
          save(keys.onboard, merged);
          return merged;
        });

        // DEF-064 Fix: Server-first authoritative roadmap hydration (decouple stale localStorage lockout)
        if (answers.roadmap && Array.isArray(answers.roadmap) && answers.roadmap.length > 0) {
          if (typeof window !== 'undefined') {
            const mKey = `pinit_${userId}_roadmap_modules`;
            save(mKey, answers.roadmap);
            if (answers.activeCourseId) {
              save(`pinit_${userId}_roadmap_modules_${answers.activeCourseId}`, answers.roadmap);
            }
          }
        }
      }

      // Reconcile any pending or unsynced local onboarding answers to Supabase
      if (typeof window !== 'undefined') {
        const readLs = (k: string) => {
          try {
            const v = localStorage.getItem(k);
            return v ? JSON.parse(v) : null;
          } catch {
            return null;
          }
        };
        const pending = localStorage.getItem('pinit_pending_onboarding_sync');
        const localAnswers = readLs(keys.onboard);
        const dbSaysCompleted = !!(user?.roadmapGenerated || (user?.onboardingAnswers as any)?.hasCompleted);
        if (pending || (localAnswers?.hasCompleted && !dbSaysCompleted)) {
          let payloadToSync: any = null;
          if (pending) {
            try { payloadToSync = JSON.parse(pending); } catch {}
          }
          if (!payloadToSync && localAnswers?.hasCompleted) {
            payloadToSync = {
              onboardingAnswers: localAnswers,
              roadmapGenerated: true,
              onboardingStep: Math.max(Number(readLs(keys.obStep)) || 0, 3)
            };
          }
          if (payloadToSync) {
            api.post('/api/auth/onboarding', payloadToSync).then(() => {
              console.log('[CareerOSContext] ✅ Successfully reconciled unsynced onboarding answers to database.');
              localStorage.removeItem('pinit_pending_onboarding_sync');
            }).catch(syncErr => {
              console.warn('[CareerOSContext] Background onboarding reconciliation retry failed:', syncErr?.message);
            });
          }
        }
      }
      if (user.resumeGenerated !== undefined) {
        const resVal = !!user.resumeGenerated;
        setResumeGeneratedState(prev => {
          if (!prev && resVal) {
            save(keys.resGen, resVal);
            return resVal;
          }
          return prev;
        });
      }
      if (user.roadmapGenerated !== undefined) {
        const roadVal = !!user.roadmapGenerated;
        setRoadmapGeneratedState(prev => {
          if (!prev && roadVal) {
            save(keys.roadGen, roadVal);
            return roadVal;
          }
          return prev;
        });
      }
      if (user.completedQuests && Array.isArray(user.completedQuests)) {
        const qVal = user.completedQuests as string[];
        setCompletedQuestsState(prev => {
          const merged = Array.from(new Set([...prev, ...qVal]));
          save(keys.quests, merged);
          return merged;
        });
      }
      const mVal = (user as any).completedMissions || (user as any).completed_missions;
      if (mVal && Array.isArray(mVal)) {
        setCompletedMissions(prev => {
          const merged = Array.from(new Set([...prev, ...mVal]));
          save(keys.missions, merged);
          return merged;
        });
      }
      if (user.javaTestPassed !== undefined) {
        const jVal = !!user.javaTestPassed;
        setJavaTestPassedState(prev => {
          if (!prev && jVal) {
            save(keys.javaPass, jVal);
            return jVal;
          }
          return prev;
        });
      }
      if (user.groupPanelPassed !== undefined) {
        const gpVal = !!user.groupPanelPassed;
        setGroupPanelPassedState(prev => {
          if (!prev && gpVal) {
            save(keys.groupPass, gpVal);
            return gpVal;
          }
          return prev;
        });
      }
      if (user.recruiterVisible !== undefined) {
        const rVal = !!user.recruiterVisible;
        setRecruiterVisibleState(prev => {
          if (!prev && rVal) {
            save(keys.recVis, rVal);
            return rVal;
          }
          return prev;
        });
      }
      if (user.forceShowCareerBuilder !== undefined) {
        const fVal = !!user.forceShowCareerBuilder;
        setForceShowCareerBuilderState(prev => {
          if (!prev && fVal) {
            save(keys.forceShowCareer, fVal);
            return fVal;
          }
          return prev;
        });
      }
      if (user.demoTabsUnlocked !== undefined) {
        const dVal = !!user.demoTabsUnlocked;
        setDemoTabsUnlockedState(prev => {
          if (!prev && dVal) {
            save(keys.demoTabsUnlocked, dVal);
            return dVal;
          }
          return prev;
        });
      }
      const dbStreak = user.missionStreak ?? (user as any).mission_streak ?? (user as any).missionStreak;
      if (dbStreak !== undefined && typeof dbStreak === 'number') {
        const readLs = (k: string) => {
          try {
            const v = localStorage.getItem(k);
            return v ? JSON.parse(v) : null;
          } catch {
            return null;
          }
        };
        const answers = readLs(keys.onboard) || onboardingAnswers;
        const hasProof =
          (answers?.completedMissionsTimestamps?.length || 0) > 0 ||
          (answers?.completedQuestsTimestamps?.length || 0) > 0 ||
          (readLs(keys.missions) || []).length > 0 ||
          (readLs(keys.quests) || []).length > 0;
        if (!hasProof && dbStreak > 0) {
          setMissionStreak(0);
          save(keys.streak, 0);
        } else if (hasProof) {
          const streakVal = dbStreak as number;
          setMissionStreak(prev => {
            if (prev !== streakVal) {
              save(keys.streak, streakVal);
              return streakVal;
            }
            return prev;
          });
        }
      }
      const dbXp = (user as any).xp_total ?? (user as any).xpTotal ?? user.xp;
      if (dbXp !== undefined && typeof dbXp === 'number') {
        const xpVal = dbXp as number;
        setXp(prev => {
          if (prev !== xpVal) {
            save(keys.xp, xpVal);
            return xpVal;
          }
          return prev;
        });
      }
      if (user.unlockedItems && typeof user.unlockedItems === 'object') {
        const dbUnlocked = user.unlockedItems;
        const merged = { ...unlockedItems, ...dbUnlocked };
        setUnlockedItems(merged);
        save(keys.unlockedItems, merged);
      }
    }
  }, [user, isLoaded, save, keys, unlockedItems, setUnlockedItems]);


  // ── Theme sync ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    save(keys.theme, theme);
    localStorage.setItem('pc_theme', theme);
  }, [theme, keys.theme, save]);


  // DEF-037 FIX: Removed client-side streak decay effect. Mission streaks are computed authoritatively on the server via consecutiveCalendarStreak over validated database completion timestamps.

  // ─── Progression Setters ───────────────────────────────────────────────────
  const setOnboardingStep = useCallback((step: number) => {
    setOnboardingStepState(step);
    save(keys.obStep, step);
  }, [keys.obStep, save]);

  const setResumeGenerated = useCallback((val: boolean) => {
    setResumeGeneratedState(val);
    save(keys.resGen, val);
    if (val && onboardingStep < 3) {
      setOnboardingStep(3); // advance step
    }
  }, [keys.resGen, onboardingStep, setOnboardingStep, save]);

  const setRoadmapGenerated = useCallback((val: boolean) => {
    setRoadmapGeneratedState(val);
    save(keys.roadGen, val);
    if (val && onboardingStep < 4) {
      setOnboardingStep(4); // advance step
    }
  }, [keys.roadGen, onboardingStep, setOnboardingStep, save]);

  const setActiveCourseIds = useCallback((vals: string[]) => {
    setActiveCourseIdsState(vals);
    save(keys.activeCourses, vals);
  }, [keys.activeCourses, save]);

  const setActiveCourseId = useCallback((val: string | null) => {
    setActiveCourseIdState(val);
    save(keys.activeCourse, val);
    if (val) {
      setActiveCourseIdsState(prev => {
        if (prev.includes(val)) return prev;
        const next = [...prev, val];
        save(keys.activeCourses, next);
        return next;
      });
    }
  }, [keys.activeCourse, keys.activeCourses, save]);

  const generateFusedRoadmap = useCallback(async (skillTags: string[], weakAreas: string[], courseId?: string, durationDays: number = 30, dailyPace: number = 2) => {
    const COURSE_TO_ROLE: Record<string, string> = {
      'course-ai-eng': 'AI & LLM Systems Engineer',
      'course-fullstack-js': 'Full-Stack Software Developer',
      'course-dsa-optim': 'Software Development Engineer (SDE)',
      'course-devops-cicd': 'DevOps & Pipeline Automation Engineer',
      'course-distributed-sys': 'Cloud Architect & Infrastructure Specialist',
      'course-java-logic': 'Software Development Engineer (SDE)'
    };
    const targetRole = (courseId && COURSE_TO_ROLE[courseId]) || onboardingAnswers.role || 'Software Developer Engineer (SDE)';
    const experienceLevel = onboardingAnswers.experience || 'beginner';
    const modulesKey = `pinit_${userId}_roadmap_modules`;

    try {
      const res = await api.post<{ ok: boolean; modules: any[] }>('/api/career-builder/generate', {
        targetRole,
        skillTags,
        weakAreas,
        experienceLevel,
        courseId,
        durationDays,
        dailyPace
      });

      let dynamicModules: any[] | null = null;
      if (res && res.ok && Array.isArray(res.modules) && res.modules.length > 0) {
        dynamicModules = res.modules;
      } else if (courseId) {
        const isPreliminaryRoadmap = onboardingAnswers.qt1_score == null || onboardingAnswers.qt2_score == null;
        const { generateDynamicStudentRoadmap } = await import('../data/roadmapFuser');
        dynamicModules = generateDynamicStudentRoadmap({
          qt1: onboardingAnswers.qt1_score ?? 40,
          qt2: onboardingAnswers.qt2_score ?? 40,
          archetype: onboardingAnswers.mindset_archetype || 'Pattern Hunter',
          goal: targetRole,
          courseId: courseId,
          durationDays: durationDays,
          dailyPace: dailyPace
        });
      }

      if (dynamicModules && Array.isArray(dynamicModules) && dynamicModules.length > 0) {
        if (courseId) {
          setActiveCourseIdState(courseId);
          save(keys.activeCourse, courseId);
          
          const isPreliminary = onboardingAnswers.qt1_score == null || onboardingAnswers.qt2_score == null;
          const updatedAnswers = {
            ...onboardingAnswers,
            activeCourseId: courseId,
            isPreliminaryRoadmap: isPreliminary,
          };
          setOnboardingAnswers(updatedAnswers);
          save(keys.onboard, updatedAnswers);

          api.post('/api/auth/onboarding', {
            onboardingAnswers: updatedAnswers
          }).catch(err => console.warn("Failed to sync active course to DB:", err));
        }

        const normalized = dynamicModules.map((m: any) => ({
          ...m,
          quests: (m.quests || []).map((q: any) => {
            let category = q.category;
            if (!category) {
              if (q.requiresAvatar || q.type === 'lecture' || q.type === 'interactive') {
                category = 'learning';
              } else if (q.id === 'fizzbuzz' || q.id?.includes('exam') || q.title?.toLowerCase().includes('exam') || q.title?.toLowerCase().includes('test')) {
                category = 'exam';
              } else {
                category = 'assignment';
              }
            }
            return { ...q, category };
          })
        }));

        const courseModulesKey = courseId ? `pinit_${userId}_roadmap_modules_${courseId}` : modulesKey;
        save(courseModulesKey, normalized);
        save(modulesKey, normalized);
        setRoadmapGeneratedState(true);
        save(keys.roadGen, true);
        if (onboardingStep < 4) {
          setOnboardingStep(4);
        }

        if (courseId) {
          setActiveCourseIdsState(prev => {
            if (prev.includes(courseId)) return prev;
            const next = [...prev, courseId];
            save(keys.activeCourses, next);
            return next;
          });
        }

        const updatedAnswers = {
          ...onboardingAnswers,
          ...(courseId ? { activeCourseId: courseId } : {}),
          roadmap: normalized
        };
        setOnboardingAnswers(updatedAnswers);
        save(keys.onboard, updatedAnswers);

        // Sync roadmap generation, modules, and step with Supabase database profile
        try {
          await api.post('/api/auth/onboarding', {
            roadmapGenerated: true,
            onboardingStep: Math.max(onboardingStep, 4),
            onboardingAnswers: updatedAnswers
          });
        } catch (err) {
          console.warn("Failed to sync roadmap status to database:", err);
        }

        toast.success('Dynamic Student Roadmap Active! 🗺️', 'Fused QT1 + QT2 + Goal + Academic Course preferences.');
        return normalized;
      }
    } catch (err) {
      console.error('Failed to generate dynamic AI roadmap, executing local dynamic fuser fallback:', err);
      if (courseId) {
        const { generateDynamicStudentRoadmap } = await import('../data/roadmapFuser');
        const localModules = generateDynamicStudentRoadmap({
          qt1: onboardingAnswers.qt1_score ?? 75,
          qt2: onboardingAnswers.qt2_score ?? 80,
          archetype: onboardingAnswers.mindset_archetype || 'Pattern Hunter',
          goal: targetRole,
          courseId: courseId,
          durationDays: durationDays,
          dailyPace: dailyPace
        });
        if (localModules && localModules.length > 0) {
          const courseModulesKey = `pinit_${userId}_roadmap_modules_${courseId}`;
          save(courseModulesKey, localModules);
          save(modulesKey, localModules);
          setRoadmapGeneratedState(true);
          save(keys.roadGen, true);

          const updatedFallbackAnswers = {
            ...onboardingAnswers,
            ...(courseId ? { activeCourseId: courseId } : {}),
            roadmap: localModules
          };
          setOnboardingAnswers(updatedFallbackAnswers);
          save(keys.onboard, updatedFallbackAnswers);

          api.post('/api/auth/onboarding', {
            roadmapGenerated: true,
            onboardingStep: Math.max(onboardingStep, 4),
            onboardingAnswers: updatedFallbackAnswers
          }).catch(err => console.warn("Failed to sync fallback roadmap to database:", err));

          toast.success('Dynamic Student Roadmap Active! 🗺️', 'Fused QT1 + QT2 + Goal + Academic Course preferences.');
          return localModules;
        }
      }
    }
    return null;
  }, [userId, onboardingAnswers, keys.roadGen, keys.activeCourses, onboardingStep, setOnboardingStep, save]);

  const addCompletedQuest = useCallback((questId: string, isExam?: boolean, xpAmount?: number, courseId?: string) => {
    // Determine the courseId to associate. If not supplied, try to guess or use activeCourseId.
    const assocCourseId = courseId || activeCourseId || 'default-course';

    // Global cap of 3 completed quests per calendar day across all courses (DEF-074)
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

    setCompletedQuestsState(prev => {
      if (prev.includes(questId)) return prev;
      return [...prev, questId];
    });

    const nextQuests = completedQuests.includes(questId) ? completedQuests : [...completedQuests, questId];
    save(keys.quests, nextQuests);
    
    // Save completion timestamp with courseId tag
    const timestampTag = `${new Date().toISOString()}|${assocCourseId}`;
    const nextTimestamps = [...timestamps, timestampTag];
    const nextAnswers = {
      ...onboardingAnswers,
      completedQuestsTimestamps: nextTimestamps
    };
    setOnboardingAnswers(nextAnswers);
    save(keys.onboard, nextAnswers);
    
    // DEF-074: Call server-side authoritative quest completion endpoint
    api.post('/api/quest/complete', {
      questId,
      isExam,
      xpAmount: xpAmount || 15,
      courseId: assocCourseId
    }).catch(() => {
      // Fallback sync to onboarding endpoint
      api.post('/api/auth/onboarding', { onboardingAnswers: nextAnswers, completedQuests: nextQuests }).catch(() => {});
    });

    // Award activity rewards (+XP, +Trust Score, +Career DNA)
    rewardActivity(isExam ? 'project' : 'quest', isExam ? 'Passed Coding Exam' : 'Completed Quest');
    if (onboardingStep < 5) {
      setOnboardingStep(5); // unlock AI Interviews
    }

    // Increment streak by 1 ONLY ONCE PER CALENDAR DAY in user local timezone
    const lastStreakDateKey = `pinit_${userId}_last_streak_date`;
    const todayStr = new Date().toLocaleDateString('en-CA');
    const lastStreakDate = localStorage.getItem(lastStreakDateKey);

    if (lastStreakDate !== todayStr) {
      localStorage.setItem(lastStreakDateKey, todayStr);
      setMissionStreak(prev => {
        const next = prev + 1;
        save(keys.streak, next);
        // DEF-042 FIX: Streak milestone bonus is verified and claimed authoritatively on server
        if (next % 7 === 0 && userId && userId !== 'guest') {
          api.post('/api/pins/claim-streak-bonus', { milestone: next })
            .then((res: any) => {
              if (res?.ok && res?.pinsGranted) {
                toast.success('⚡ Streak Milestone Bonus!', `+${res.pinsGranted} pins credited for your ${next}-day streak!`);
              }
            })
            .catch((err) => {
              console.warn('[CareerOS] Streak bonus claim notice:', err?.message || err);
            });
        }
        toast.success('🔥 Daily Quest Streak Up!', `Streak: ${next} days active!`);
        return next;
      });
    }

    // ── Q-C2: Persist completion to Supabase users.completed_quests ──────
    if (userId && userId !== 'guest') {
      persistQuestCompletion(userId, questId, xpAmount || 15)
        .then(result => {
          if (!result.ok) {
            console.warn('[Q-C2] persistQuestCompletion failed for', questId);
          }
        })
        .catch(e => console.error('[Q-C2] persistQuestCompletion threw:', e));
    }

    // Notify GlobalAvatar mentor with activity completion event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pinit:activity_complete', {
        detail: {
          type: isExam ? 'exam' : 'quest',
          title: questId,
          score: isExam ? 100 : 85,
          passed: true,
        }
      }));
    }
  }, [completedQuests, activeCourseId, keys.quests, onboardingAnswers, keys.onboard, onboardingStep, setOnboardingStep, earnPins, save, userId]);

  const saveQuestCode = useCallback((questId: string, code: string) => {
    const nextCodes = {
      ...(onboardingAnswers.questCodes || {}),
      [questId]: code
    };
    const nextAnswers = {
      ...onboardingAnswers,
      questCodes: nextCodes
    };
    setOnboardingAnswers(nextAnswers);
    save(keys.onboard, nextAnswers);
    api.post('/api/auth/onboarding', { onboardingAnswers: nextAnswers }).catch(() => {});
  }, [onboardingAnswers, keys.onboard, save]);

  const saveCareerProjects = useCallback((projects: any[]) => {
    const nextAnswers = {
      ...onboardingAnswers,
      projects
    };
    setOnboardingAnswers(nextAnswers);
    save(keys.onboard, nextAnswers);
    if (typeof window !== 'undefined' && userId) {
      try {
        localStorage.setItem(`pinit_${userId}_career_projects`, JSON.stringify(projects));
      } catch {}
    }
    api.post('/api/auth/onboarding', { onboardingAnswers: nextAnswers }).catch(() => {});
  }, [onboardingAnswers, keys.onboard, userId, save]);

  const setJavaTestPassed = useCallback((val: boolean) => {
    setJavaTestPassedState(val);
    save(keys.javaPass, val);
    if (val && onboardingStep < 6) {
      setOnboardingStep(6);
    }
    api.post('/api/auth/onboarding', {
      javaTestPassed: val,
      onboardingStep: val ? Math.max(onboardingStep, 6) : onboardingStep
    }).catch(() => {});
  }, [keys.javaPass, onboardingStep, setOnboardingStep, save]);

  const setGroupPanelPassed = useCallback((val: boolean) => {
    setGroupPanelPassedState(val);
    save(keys.groupPass, val);
    api.post('/api/auth/onboarding', {
      groupPanelPassed: val
    }).catch(() => {});
  }, [keys.groupPass, save]);

  const setRecruiterVisible = useCallback((val: boolean) => {
    setRecruiterVisibleState(val);
    save(keys.recVis, val);
  }, [keys.recVis, save]);

  const setForceShowCareerBuilder = useCallback((val: boolean) => {
    setForceShowCareerBuilderState(val);
    save(keys.forceShowCareer, val);
  }, [keys.forceShowCareer, save]);

  const setDemoTabsUnlocked = useCallback((val: boolean) => {
    setDemoTabsUnlockedState(val);
    save(keys.demoTabsUnlocked, val);
  }, [keys.demoTabsUnlocked, save]);

  const buyAiMinutes = useCallback(async (): Promise<boolean> => {
    if (userId && userId !== 'guest') {
      try {
        const res = (await api.post('/api/pins/buy-ai-minutes', {})) as any;
        if (!res?.ok) {
          if (res?.error === 'DAILY_AI_MINUTES_LIMIT_EXCEEDED') {
            toast.error('Daily Limit Reached ⏳', res.message || 'Maximum 2 AI extensions (60 minutes total) allowed per day.');
          } else if (res?.error === 'INSUFFICIENT_PINS') {
            toast.error('Insufficient Pins 📌', 'Need 100 pins for 30 Min AI Token Extension.');
          } else {
            toast.error('Purchase Failed ⚠️', res?.message || 'Failed to purchase AI minutes.');
          }
          return false;
        }
        if (typeof res.newBalance === 'number') {
          setPins(res.newBalance);
        }
        const added = res.minutesAdded || 30;
        setAiUseTokens((prev: number) => prev + added);
        toast.success('AI Time Extended! ⏰', `+${added} AI Minutes added to your daily balance.`);
        return true;
      } catch (err: any) {
        toast.error('Purchase Error ⚠️', err?.message || 'Network error purchasing AI minutes.');
        return false;
      }
    } else {
      const ok = await spendPins('ai_minutes_extend', 'Extended daily AI by 30 mins');
      if (!ok) return false;
      setAiUseTokens((prev: number) => prev + 30);
      toast.success('AI Time Extended! ⏰', '+30 AI Minutes added to your daily balance.');
      return true;
    }
  }, [userId, setPins, spendPins, setAiUseTokens]);

  // Derive unlocked tabs dynamically
  const ALL_TABS = ['/dashboard', '/quests', '/missions', '/interview', '/career-twin', '/career-dna', '/opportunities', '/group-discussion'];
  
  // STATE_0, STATE_1, STATE_2 (onboardingStep < 3): all tabs locked
  // STATE_3 (Blueprint Generated): Dashboard, Quests, Missions, Interview, Career Twin, Career DNA, Opportunities unlocked.
  // Group Discussion unlocked if groupPanelPassed is true.
  let activeTabs: string[] = [];
  if (onboardingStep >= 3) {
    activeTabs = ['/dashboard', '/quests', '/missions', '/interview', '/career-twin', '/career-dna', '/opportunities'];
    if (groupPanelPassed) {
      activeTabs.push('/group-discussion');
    }
  }

  const completeMission = (missionId: string, bypassDailyLimit = false) => {
    // 1. Check daily limit of 1 completed mission
    const timestamps = onboardingAnswers.completedMissionsTimestamps || [];
    const today = new Date().toDateString();
    const todayCompletions = timestamps.filter(ts => new Date(ts).toDateString() === today);
    if (!bypassDailyLimit && todayCompletions.length >= 1) {
      toast.error('Daily Limit Reached ⏳', 'You have already completed 1 mission today. Come back tomorrow!');
      return;
    }

    if (completedMissions.includes(missionId)) return;
    const updated = [...completedMissions, missionId];
    setCompletedMissions(updated); save(keys.missions, updated);

    const todayStr = new Date().toDateString();
    const hasCompletedToday = onboardingAnswers?.last_streak_date === todayStr;
    const newStreak = hasCompletedToday ? missionStreak : missionStreak + 1;
    setMissionStreak(newStreak); save(keys.streak, newStreak);

    // Save completion timestamp and streak date
    const nextTimestamps = [...timestamps, new Date().toISOString()];
    const nextAnswers = {
      ...onboardingAnswers,
      completedMissionsTimestamps: nextTimestamps,
      last_streak_date: todayStr
    };
    setOnboardingAnswers(nextAnswers);
    save(keys.onboard, nextAnswers);

    // Sync updated answers and completedMissions to database profile in background
    api.post('/api/auth/onboarding', { 
      onboardingAnswers: nextAnswers,
      completedMissions: updated
    }).catch(() => {});

    rewardActivity('mission', 'Daily Mission Completed');

    // Notify GlobalAvatar mentor with mission completion event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pinit:activity_complete', {
        detail: {
          type: 'mission',
          title: missionId || 'Daily Mission',
          score: null, // Score must be determined by evaluation, not hardcoded
          passed: true,
        }
      }));
    }
  };

  const setOnboarding = async (answers: Omit<OnboardingAnswers, 'hasCompleted'>, skipSync = false) => {
    const wasAlreadyCompleted = onboardingAnswers.hasCompleted;
    const data = { ...answers, hasCompleted: true };
    setOnboardingAnswers(data); save(keys.onboard, data);
 
    if (typeof window !== 'undefined') {
      markOnboardingStoryPending(userId);
    }

    if (!skipSync) {
      // Sync onboarding state and answers with Supabase database profile
      try {
        await api.post('/api/auth/onboarding', {
          onboardingAnswers: data,
          onboardingStep: 3
        });
      } catch (err) {
        console.warn("Failed to sync onboarding answers to database:", err);
      }
    }

    if (!wasAlreadyCompleted) {
      addXp(50, 'Onboarding Complete');
      earnPins('onboarding_complete');
      setOnboardingStep(3);
      toast.success('🧬 Career Profile Set', `Target role: ${answers.role}`);
    }
  };

  const setJdMissingSkills = (skills: string[]) => { setJdMissingSkillsState(skills); save(keys.gaps, skills); };

  const addXp = useCallback(async (amount: number, reason: string) => {
    if (amount <= 0 || amount > 500) {
      console.warn(`[addXp] Rejected invalid XP amount: ${amount}`);
      return;
    }

    // Client-side fallback for guest users
    if (!userId || userId === 'guest') {
      setXp(prev => { const next = prev + amount; save(keys.xp, next); return next; });
      return;
    }

    try {
      const res = await fetch('/api/xp/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason })
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.newXp === 'number') {
          setXp(data.newXp);
          save(keys.xp, data.newXp);
          return;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn('[addXp] Server rejected XP increment:', errData);
        return;
      }
    } catch (e) {
      console.warn('Network error syncing XP to server, applying offline fallback:', e);
      setXp(prev => { const next = prev + amount; save(keys.xp, next); return next; });
    }
  }, [userId, keys.xp, save]);

  // ─── Derived scores ───────────────────────────────────────────────────────
  const baseAts = typeof user?.atsScore === 'number' ? user.atsScore : 0;
  const careerScore = Math.min(98, baseAts + (onboardingAnswers.hasCompleted ? 10 : 0) + (vaultItems.filter(v => v.verified).length * 5) + (completedMissions.length * 5));
  const missionOnlyStreak = consecutiveCalendarStreak(onboardingAnswers.completedMissionsTimestamps);

  const baseDna = typeof user?.careerDnaScore === 'number' ? user.careerDnaScore : 0;
  const dnaScore = Math.min(95, baseDna + (onboardingAnswers.hasCompleted ? 15 : 0) + (completedMissions.length * 10) + dnaBonus);

  const baseTrust = typeof user?.trustScore === 'number' ? user.trustScore : 0;
  const trustScore = Math.min(99, baseTrust + (vaultItems.filter(v => v.verified).length * 15) + trustBonus);

  // ─── Unified Modest Rewarding System Dispatcher (DEF-049, DEF-050) ────────
  const rewardActivity = useCallback((
    type: 'quest' | 'mission' | 'interview' | 'gd' | 'attention_game' | 'project',
    title?: string
  ) => {
    const now = Date.now();
    if (now - lastRewardTimeRef.current < 2000) {
      console.warn('[rewardActivity] Throttled: Activity rewards rate limited.');
      return;
    }
    lastRewardTimeRef.current = now;

    const MATRIX: Record<string, { xp: number; trust: number; dna: number; label: string }> = {
      quest:          { xp: 15, trust: 1, dna: 1, label: 'Quest Lesson Mastered' },
      mission:        { xp: 25, trust: 2, dna: 2, label: 'Mission Challenge Cleared' },
      gd:             { xp: 30, trust: 2, dna: 2, label: 'Group Discussion Completed' },
      interview:      { xp: 40, trust: 3, dna: 3, label: 'AI Interview Round Completed' },
      attention_game: { xp: 10, trust: 0, dna: 1, label: 'Focus Training Completed' },
      project:        { xp: 50, trust: 5, dna: 5, label: 'Project Verified' },
    };

    const reward = MATRIX[type] || { xp: 15, trust: 1, dna: 1, label: 'Activity Completed' };

    if (reward.xp > 0) {
      addXp(reward.xp, title ?? reward.label);
    }
    if (reward.trust > 0) {
      setTrustBonus(prev => {
        const next = prev + reward.trust;
        save(keys.trustBonus, next);
        return next;
      });
    }
    if (reward.dna > 0) {
      setDnaBonus(prev => {
        const next = prev + reward.dna;
        save(keys.dnaBonus, next);
        return next;
      });
    }

    // ── Step 3: Prestige Badges for Maxed Score Caps (DEF-049) ────────────────
    if (reward.trust > 0 && trustScore + reward.trust >= 99 && trustScore < 99) {
      if (userId && userId !== 'guest') {
        fetch('/api/user/award-badge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ badgeId: 'trust_sentinel_99', milestoneKey: 'trust_score_99' }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.ok && data.newlyAwarded) {
              if (typeof data.newXp === 'number') {
                setXp(data.newXp);
                save(keys.xp, data.newXp);
              }
              toast.success('🎖️ Trust Sentinel Badge Unlocked!', 'Max Trust Score (99) achieved! +500 Prestige Bonus XP granted.');
            }
          })
          .catch(e => console.warn('Failed to award trust milestone:', e));
      } else {
        addXp(500, '🎖️ Trust Sentinel Prestige Milestone');
        toast.success('🎖️ Trust Sentinel Badge Unlocked!', 'Max Trust Score (99) achieved! +500 Prestige Bonus XP granted.');
      }
    }

    if (reward.dna > 0 && dnaScore + reward.dna >= 95 && dnaScore < 95) {
      if (userId && userId !== 'guest') {
        fetch('/api/user/award-badge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ badgeId: 'apex_career_dna_95', milestoneKey: 'dna_score_95' }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.ok && data.newlyAwarded) {
              if (typeof data.newXp === 'number') {
                setXp(data.newXp);
                save(keys.xp, data.newXp);
              }
              toast.success('🧬 Apex Career DNA Badge Unlocked!', 'Max Career DNA Score (95) achieved! +500 Prestige Bonus XP granted.');
            }
          })
          .catch(e => console.warn('Failed to award DNA milestone:', e));
      } else {
        addXp(500, '🧬 Apex Career DNA Prestige Milestone');
        toast.success('🧬 Apex Career DNA Badge Unlocked!', 'Max Career DNA Score (95) achieved! +500 Prestige Bonus XP granted.');
      }
    }

    const parts = [];
    if (reward.xp > 0) parts.push(`+${reward.xp} XP`);
    if (reward.trust > 0) parts.push(`+${reward.trust} Trust`);
    if (reward.dna > 0) parts.push(`+${reward.dna} DNA`);

    // Sync score gains to Supabase in background using live context scores
    if (userId && userId !== 'guest') {
      const calculatedTrust = Math.min(99, trustScore + reward.trust);
      const calculatedDna = Math.min(95, dnaScore + reward.dna);
      syncRewardsDB(userId, calculatedTrust, calculatedDna).catch(() => {});
    }

    toast.success(`🏆 ${reward.label}`, parts.join(' · '));
  }, [save, keys.trustBonus, keys.dnaBonus, keys.xp, userId, trustScore, dnaScore, addXp]);

  const switchActiveCourse = useCallback((courseId: string) => {
    setActiveCourseIdState(courseId);
    save(keys.activeCourse, courseId);
    toast.info('Switched Active Roadmap 🗺️', `Now viewing: ${courseId}`);
  }, [keys.activeCourse, save]);

  const archiveActiveCourse = useCallback((courseId: string) => {
    setActiveCourseIdsState(prev => {
      const next = prev.filter(id => id !== courseId);
      save(keys.activeCourses, next);
      if (activeCourseId === courseId && next.length > 0) {
        setActiveCourseIdState(next[0]);
        save(keys.activeCourse, next[0]);
      }
      return next;
    });
    toast.info('Roadmap Archived 📁', `Track ${courseId} archived. Progress is 100% saved.`);
  }, [activeCourseId, keys.activeCourse, keys.activeCourses, save]);

  return (
    <CareerOSContext.Provider value={{
      vaultItems, setVaultItems, addVaultItem, updateVaultItem,
      onboardingAnswers, setOnboarding,
      completedMissions, completeMission,
      jdMissingSkills, setJdMissingSkills,
      xp, addXp,
      missionStreak,
      missionOnlyStreak,
      theme, focusMode, toggleTheme, toggleFocusMode,
      careerScore, dnaScore, trustScore,
      pins, pinHistory, earnPins, spendPins, canAfford,
      unlockedItems, isItemUnlocked, getItemRemainingSeconds, extendItemGrace, unlockItem, rewardActivity,
      // progression
      onboardingStep, setOnboardingStep,
      resumeGenerated, setResumeGenerated,
      roadmapGenerated, setRoadmapGenerated,
      generateFusedRoadmap,
      activeCourseId, setActiveCourseId: setActiveCourseIdState,
      activeCourseIds, setActiveCourseIds: setActiveCourseIdsState,
      switchActiveCourse, archiveActiveCourse,
      completedQuests, addCompletedQuest, saveQuestCode, saveCareerProjects,
      javaTestPassed, setJavaTestPassed,
      groupPanelPassed, setGroupPanelPassed,
      recruiterVisible, setRecruiterVisible,
      unlockedTabs: activeTabs,
      forceShowCareerBuilder, setForceShowCareerBuilder,
      demoTabsUnlocked, setDemoTabsUnlocked,
      aiUseTokens, setAiUseTokens, decrementAiUseTokens, buyAiMinutes,
      isLoaded
    }}>
      {children}
    </CareerOSContext.Provider>
  );
}

export function useCareerOS() {
  const ctx = useContext(CareerOSContext);
  if (!ctx) throw new Error('useCareerOS must be used within a CareerOSProvider');
  return ctx;
}
