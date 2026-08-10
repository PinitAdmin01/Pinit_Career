'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { COURSES_REGISTRY } from '../data/coursesData';
import { generateDynamicStudentRoadmap } from '../data/roadmapFuser';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { supabase } from '@/lib/supabaseClient';
import { persistQuestCompletion, spendPinsDB, syncRewardsDB, syncUnlockedItemsDB, fetchServerTimeOffset } from '@/lib/supabaseService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VaultItem {
  id: string;
  title: string;
  item_type: string;
  organization_name?: string;
  description?: string;
  verified: boolean;
  ai_confidence_score: number;
  skill_tags: string[];
  is_public: boolean;
  used_in_resume?: boolean;
  used_in_portfolio?: boolean;
}

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
  roadmapDurationDays?: number;
}

export interface PinTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  source: PinSource;
  timestamp: number;
}

export type PinSource =
  | 'mission_complete'
  | 'exam_pass'
  | 'interview_session'
  | 'study_session'
  | 'onboarding_complete'
  | 'vault_verify'
  | 'daily_login'
  | 'streak_bonus'
  | 'purchase'
  | 'ai_interview'
  | 'resume_enhance'
  | 'career_twin'
  | 'personality_analysis'
  | 'sentinel_fingerprint'
  | 'communication_session'
  | 'career_assets'
  | 'career_dna_calc'
  | 'admin_grant';

// Pin costs per feature — single source of truth
export const PIN_COSTS: Record<string, { cost: number; label: string; icon: string }> = {
  quest:                 { cost: 20, label: 'Quest (30 Min Access)',        icon: '🗺' },
  mission:               { cost: 20, label: 'Mission (30 Min Access)',      icon: '⚡' },
  group_discussion:      { cost: 30, label: 'GD Practice (30 Min Access)',  icon: '💬' },
  gd:                    { cost: 30, label: 'GD Practice (30 Min Access)',  icon: '💬' },
  ai_interview:          { cost: 40, label: 'AI Interview (30 Min Access)', icon: '🎙' },
  interview:             { cost: 40, label: 'AI Interview (30 Min Access)', icon: '🎙' },
  attention_span_game:   { cost: 5,  label: 'Attention Span Game Play',     icon: '🧠' },
  // Legacy aliases
  quest_start:           { cost: 20, label: 'Quest (30 Min Access)',        icon: '🗺' },
  resume_enhance:        { cost: 15, label: 'Resume AI Enhancement',        icon: '📄' },
  career_twin:           { cost: 30, label: 'Career Twin Simulation',       icon: '✦' },
  personality_analysis:  { cost: 10, label: 'Personality AI Analysis',      icon: '🧠' },
  sentinel_fingerprint:  { cost: 5,  label: 'Sentinel Fingerprint',         icon: '🔐' },
  career_assets:         { cost: 20, label: 'Career Assets Generation',     icon: '💼' },
  career_dna_calc:       { cost: 10, label: 'Career DNA Recalculate',       icon: '🧬' },
  jd_match:              { cost: 5,  label: 'JD Match Analysis',            icon: '🎯' },
  ai_minutes_extend:     { cost: 100, label: '30 Min AI Token Extension',    icon: '⏰' },
};

// Pin earn rates (Activities disabled; pins only gained via purchase or 1 AM daily refresh)
export const PIN_EARN: Record<PinSource, number> = {
  mission_complete:     0,
  exam_pass:            0,
  interview_session:    0,
  study_session:        0,
  onboarding_complete:  0,
  vault_verify:         0,
  daily_login:          0,
  streak_bonus:         50,
  purchase:             0,   // variable — set per purchase
  ai_interview:         0,
  resume_enhance:       0,
  career_twin:          0,
  personality_analysis: 0,
  sentinel_fingerprint: 0,
  communication_session: 0,
  career_assets:        0,
  career_dna_calc:      0,
  admin_grant:          0,
};

// ─── Context Interface ────────────────────────────────────────────────────────

interface CareerOSContextType {
  // Vault
  vaultItems: VaultItem[];
  setVaultItems: (items: VaultItem[]) => void;
  addVaultItem: (item: { title: string; item_type: string; organization_name?: string; description?: string; skill_tags?: string[] }) => void;
  updateVaultItem: (id: string, updates: Partial<VaultItem>) => void;
  // Onboarding
  onboardingAnswers: OnboardingAnswers;
  setOnboarding: (answers: Omit<OnboardingAnswers, 'hasCompleted'>, skipSync?: boolean) => void;
  // Missions
  completedMissions: string[];
  completeMission: (missionId: string) => void;
  // JD Skills
  jdMissingSkills: string[];
  setJdMissingSkills: (skills: string[]) => void;
  // XP (legacy, kept for backward compat)
  xp: number;
  addXp: (amount: number, reason: string) => void;
  // Streak
  missionStreak: number;
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
  spendPins: (featureKey: string, customReason?: string) => boolean; // returns false if insufficient
  canAfford: (featureKey: string) => boolean;
  addPurchasedPins: (amount: number, packName: string) => void;
  // Item duration unlock methods (30 min access per item)
  unlockedItems: Record<string, number>;
  isItemUnlocked: (itemKey: string) => boolean;
  getItemRemainingSeconds: (itemKey: string) => number;
  unlockItem: (itemKey: string, category: 'quest' | 'mission' | 'interview' | 'ai_interview' | 'gd' | 'group_discussion' | 'attention_span_game', customReason?: string) => boolean;
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
  buyAiMinutes: () => boolean;
  isLoaded: boolean;
}

const CareerOSContext = createContext<CareerOSContextType | null>(null);

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_VAULT_ITEMS: VaultItem[] = []; // Empty vault by default for new redone setup

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CareerOSProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [vaultItems, setVaultItemsState] = useState<VaultItem[]>([]);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>({ role: '', education: '', skills: '', experience: '', hasCompleted: false });
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [jdMissingSkills, setJdMissingSkillsState] = useState<string[]>([]);
  const [xp, setXp] = useState(120);
  const [missionStreak, setMissionStreak] = useState(0); // Start streak at 0
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [focusMode, setFocusMode] = useState(false);
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
  const [aiUseTokens, setAiUseTokensState] = useState(120);

  // ── Pin & Reward state ──────────────────────────────────────────────────
  const [pins, setPins] = useState(120);
  const [pinHistory, setPinsHistory] = useState<PinTransaction[]>([]);
  const [unlockedItems, setUnlockedItems] = useState<Record<string, number>>({});
  const [trustBonus, setTrustBonus] = useState(0);
  const [dnaBonus, setDnaBonus] = useState(0);

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

  const save = useCallback((key: string, data: unknown) => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
    }
  }, []);

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

      setVaultItemsState(get(keys.vault) ?? DEFAULT_VAULT_ITEMS);
      setOnboardingAnswers(get(keys.onboard) ?? { role:'', education:'', skills:'', experience:'', hasCompleted:false });
      setCompletedMissions(get(keys.missions) ?? []);
      setJdMissingSkillsState(get(keys.gaps) ?? []);
      setXp(get(keys.xp) ?? 120);
      setMissionStreak(get(keys.streak) ?? 0);
      setTheme(get(keys.theme) ?? 'light');
      setPins(get(keys.pins) ?? 120);
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
      setAiUseTokensState(get(keys.aiTokens) ?? 120);
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
      setPins(prev => {
        if (prev !== pinsVal) {
          save(keys.pins, pinsVal);
          return pinsVal;
        }
        return prev;
      });
    }
  }, [user?.pins, keys.pins, save]);

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
          // Sync if local answers are incomplete but database profile says completed
          if (!prev.hasCompleted && answers.hasCompleted) {
            save(keys.onboard, answers);
            return answers;
          }
          return prev;
        });
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
        const streakVal = dbStreak as number;
        setMissionStreak(prev => {
          if (prev !== streakVal) {
            save(keys.streak, streakVal);
            return streakVal;
          }
          return prev;
        });
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
        setUnlockedItems(prev => {
          const merged = { ...prev, ...dbUnlocked };
          save(keys.unlockedItems, merged);
          return merged;
        });
      }
    }
  }, [user, isLoaded, save, keys]);


  // ── Theme sync ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    save(keys.theme, theme);
  }, [theme, keys.theme, save]);

  const serverOffsetRef = React.useRef(0);

  // ── Step 2: Fetch Server Time Offset on Mount ─────────────────────────────
  useEffect(() => {
    fetchServerTimeOffset().then(offset => {
      serverOffsetRef.current = offset;
    }).catch(() => {});
  }, []);

  // ── Daily 1:00 AM Pin Reset Check (Server-Verified Time) ─────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check1AMReset = () => {
      try {
        const lastReset = Number(localStorage.getItem(keys.last1AMReset) || 0);
        const verifiedNow = new Date(Date.now() + serverOffsetRef.current);
        const today1AM = new Date(verifiedNow.getFullYear(), verifiedNow.getMonth(), verifiedNow.getDate(), 1, 0, 0, 0).getTime();
        
        // If server-verified time is past 1:00 AM today and reset was not completed after today's 1:00 AM
        if (verifiedNow.getTime() >= today1AM && lastReset < today1AM) {
          setPins(prev => {
            const next = Math.max(120, prev);
            save(keys.pins, next);
            return next;
          });
          save(keys.last1AMReset, Date.now());
          const tx: PinTransaction = {
            id: `tx_reset_${Date.now()}`,
            type: 'earn',
            amount: 120,
            reason: 'Daily 1:00 AM Pin Refresh (120 Pins)',
            source: 'admin_grant',
            timestamp: Date.now()
          };
          setPinsHistory(prev => {
            const updated = [tx, ...prev].slice(0, 100);
            save(keys.pinHist, updated);
            return updated;
          });
          toast.info('Daily Pins Refreshed ⚡', '120 Pins granted for your daily Student Portal learning allowance!');
        }
      } catch {}
    };

    check1AMReset();
    const interval = setInterval(check1AMReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [keys.last1AMReset, keys.pins, keys.pinHist, save]);

  // ─── Pin helpers ───────────────────────────────────────────────────────

  const pushTransaction = useCallback((tx: PinTransaction, newHistory: PinTransaction[]) => {
    const trimmed = newHistory.slice(0, 100); // keep last 100
    setPinsHistory(trimmed);
    save(keys.pinHist, trimmed);
  }, [keys.pinHist, save]);

  const earnPins = useCallback((source: PinSource, overrideAmount?: number, reason?: string) => {
    // REQUIREMENT: Pins can ONLY be gained via purchase or daily 1 AM refresh. Activity earnings are disabled.
    if (source !== 'purchase' && source !== 'admin_grant' && source !== 'streak_bonus') {
      return;
    }
    const amount = overrideAmount ?? PIN_EARN[source] ?? 0;
    if (amount <= 0) return;
    
    // Update Firestore in background
    api.post('/api/pins/earn', { source, amount }).catch(() => {});

    setPins(prev => {
      const next = prev + amount;
      save(keys.pins, next);
      return next;
    });
    const tx: PinTransaction = { id: `tx_${Date.now()}`, type: 'earn', amount, reason: reason ?? source.replace(/_/g, ' '), source, timestamp: Date.now() };
    setPinsHistory(prev => {
      const updated = [tx, ...prev].slice(0, 100);
      save(keys.pinHist, updated);
      return updated;
    });
    toast.success(`+${amount} Pins Earned ⚡`, reason ?? source.replace(/_/g, ' '));
  }, [keys.pins, keys.pinHist, save]);

  const canAfford = useCallback((featureKey: string): boolean => {
    const cost = PIN_COSTS[featureKey]?.cost ?? 0;
    return pins >= cost;
  }, [pins]);

  const spendPins = useCallback((featureKey: string, customReason?: string): boolean => {
    const meta = PIN_COSTS[featureKey];
    if (!meta) return true; // no cost defined = free
    if (pins < meta.cost) {
      toast.error(`Insufficient Pins 📌`, `Need ${meta.cost} pins for ${meta.label}. Pins refresh to 120 daily at 1:00 AM or can be purchased.`);
      return false;
    }

    // ── Q-C3: Authoritative DB deduction (prevent double-spend races) ────────
    if (userId && userId !== 'guest') {
      spendPinsDB(userId, meta.cost, customReason ?? meta.label)
        .then(result => {
          if (!result.ok) {
            setPins(prev => {
              const refunded = prev + meta.cost;
              save(keys.pins, refunded); // restore persisted value with correct refunded amount
              return refunded;
            });
            toast.error(`Pins Out of Sync 🔄`, 'Your pin balance was refreshed from the server. Please try again.');
          }
        })
        .catch(() => {});
    }

    api.post('/api/pins/spend', { featureKey, cost: meta.cost }).catch(() => {});

    setPins(prev => {
      const next = prev - meta.cost;
      save(keys.pins, next);
      return next;
    });
    const tx: PinTransaction = { id: `tx_${Date.now()}`, type: 'spend', amount: meta.cost, reason: customReason ?? meta.label, source: featureKey as PinSource, timestamp: Date.now() };
    setPinsHistory(prev => {
      const updated = [tx, ...prev].slice(0, 100);
      save(keys.pinHist, updated);
      return updated;
    });
    return true;
  }, [pins, keys.pins, keys.pinHist, save, userId]);

  // ─── Item-Specific 30-Minute Duration Unlock Helpers ─────────────────────
  const isItemUnlocked = useCallback((itemKey: string): boolean => {
    const expiresAt = unlockedItems[itemKey];
    return typeof expiresAt === 'number' && expiresAt > Date.now();
  }, [unlockedItems]);

  const getItemRemainingSeconds = useCallback((itemKey: string): number => {
    const expiresAt = unlockedItems[itemKey];
    if (!expiresAt || expiresAt <= Date.now()) return 0;
    return Math.ceil((expiresAt - Date.now()) / 1000);
  }, [unlockedItems]);

  const unlockItem = useCallback((
    itemKey: string,
    category: 'quest' | 'mission' | 'interview' | 'ai_interview' | 'gd' | 'group_discussion' | 'attention_span_game',
    customReason?: string
  ): boolean => {
    if (isItemUnlocked(itemKey)) return true;

    const meta = PIN_COSTS[category] || PIN_COSTS[`${category}_start`] || { cost: 20, label: category };
    if (pins < meta.cost) {
      toast.error(`Insufficient Pins 📌`, `Need ${meta.cost} pins to unlock ${meta.label} for 30 minutes.`);
      return false;
    }

    const ok = spendPins(category, customReason ?? `${meta.label}: ${itemKey}`);
    if (!ok) return false;

    if (category !== 'attention_span_game') {
      const expiresAt = Date.now() + 30 * 60 * 1000; // 30 mins duration
      setUnlockedItems(prev => {
        const next = { ...prev, [itemKey]: expiresAt };
        save(keys.unlockedItems, next);
        if (userId && userId !== 'guest') {
          syncUnlockedItemsDB(userId, next).catch(() => {});
        }
        return next;
      });
      toast.success('30 Min Access Unlocked ⚡', `Unlocked ${itemKey} for 30 minutes!`);
    }
    return true;
  }, [isItemUnlocked, pins, spendPins, keys.unlockedItems, save, userId]);

  const addPurchasedPins = useCallback((_amount: number, _packName: string) => {
    // Client-side pin minting is disabled. Pins are granted only after /api/payment/verify.
    toast.error('Purchase blocked', 'Pins can only be granted after server payment verification.');
  }, []);

  // ─── Daily Pins Grant Scheduler & Streak Decay ─────────────────────────────
  useEffect(() => {
    if (!isLoaded || userId === 'guest') return;
    const lastGrantKey = `pinit_${userId}_last_daily_pins_grant`;
    const lastGrantStr = localStorage.getItem(lastGrantKey);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (!lastGrantStr || now - parseInt(lastGrantStr) >= oneDay) {
      // 1. Streak decay checking (yesterday completed check)
      if (lastGrantStr) {
        const yesterday = new Date(now - oneDay).toDateString();
        
        // Check completed quests yesterday
        const questTimestamps: string[] = onboardingAnswers.completedQuestsTimestamps || [];
        const questsCompletedYesterday = questTimestamps.filter(ts => new Date(ts).toDateString() === yesterday).length;
        
        // Check completed missions yesterday
        const missionTimestamps: string[] = onboardingAnswers.completedMissionsTimestamps || [];
        const missionsCompletedYesterday = missionTimestamps.filter(ts => new Date(ts).toDateString() === yesterday).length;

        const completedCountYesterday = questsCompletedYesterday + missionsCompletedYesterday;

        if (completedCountYesterday === 0) {
          // No activity completed yesterday -> decay streak by 1
          setMissionStreak(prev => {
            const next = Math.max(0, prev - 1);
            save(keys.streak, next);
            
            // Sync decayed streak to Supabase database profile in background
            api.post('/api/auth/onboarding', { mission_streak: next }).catch(() => {});
            
            return next;
          });
          toast.warning('Streak Decayed 📉', 'You missed completing a quest or mission yesterday. Your streak decreased by 1.');
        }
      }

      // Determine daily grant based on role
      const isPro = user?.role === 'admin' || user?.role === 'recruiter';
      const dailyAmount = isPro ? 50 : 25; // 25 pins is exactly what is required for 5 quests (5 pins each)
      
      setPins(prev => {
        const next = prev + dailyAmount;
        localStorage.setItem(keys.pins, JSON.stringify(next));
        return next;
      });
      setAiUseTokensState(120);
      localStorage.setItem(keys.aiTokens, JSON.stringify(120));
      localStorage.setItem(lastGrantKey, now.toString());
      
      // Update Firestore in background
      api.post('/api/pins/earn', { source: 'daily_login', amount: dailyAmount }).catch(() => {});

      // Log transaction
      const tx: PinTransaction = {
        id: `tx_daily_${now}`,
        type: 'earn',
        amount: dailyAmount,
        reason: `Daily login grant (${isPro ? 'Pro' : 'Standard'} Tier)`,
        source: 'daily_login',
        timestamp: now
      };
      setPinsHistory(prev => {
        const updated = [tx, ...prev].slice(0, 100);
        localStorage.setItem(keys.pinHist, JSON.stringify(updated));
        return updated;
      });
      toast.success(`⚡ Daily Pins Issued!`, `+${dailyAmount} Pins added for your daily login.`);
    }
  }, [isLoaded, userId, user?.role, keys.pins, keys.pinHist, onboardingAnswers, keys.streak, save]);

  const setVaultItems = useCallback((items: VaultItem[]) => {
    setVaultItemsState(items);
    save(keys.vault, items);
  }, [keys.vault, save]);

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
        dynamicModules = generateDynamicStudentRoadmap({
          qt1: onboardingAnswers.qt1_score ?? 75,
          qt2: onboardingAnswers.qt2_score ?? 80,
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
          
          const updatedAnswers = {
            ...onboardingAnswers,
            activeCourseId: courseId
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

        // Sync roadmap generation and step with Supabase database profile
        try {
          await api.post('/api/auth/onboarding', {
            roadmapGenerated: true,
            onboardingStep: Math.max(onboardingStep, 4)
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
          setRoadmapGeneratedState(true);
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

    // Check daily limit of 3 completed quests FOR THIS COURSE
    // We store timestamps as stringified objects: "2026-07-17T13:00:00.000Z|course-java-logic"
    const timestamps = onboardingAnswers.completedQuestsTimestamps || [];
    const today = new Date().toDateString();
    const todayCompletions = timestamps.filter(raw => {
      const parts = raw.split('|');
      const ts = parts[0];
      const cid = parts[1] || activeCourseId || 'default-course';
      return new Date(ts).toDateString() === today && cid === assocCourseId;
    });

    if (todayCompletions.length >= 3) {
      toast.error('Daily Limit Reached ⏳', `You have reached your limit of 3 completed quests for this course today.`);
      return;
    }

    if (completedQuests.includes(questId)) return;

    setCompletedQuestsState(prev => {
      if (prev.includes(questId)) return prev;
      return [...prev, questId];
    });

    const nextQuests = [...completedQuests, questId];
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
    
    api.post('/api/auth/onboarding', { onboardingAnswers: nextAnswers, completedQuests: nextQuests }).catch(() => {});

    // Award activity rewards (+XP, +Trust Score, +Career DNA)
    rewardActivity(isExam ? 'project' : 'quest', isExam ? 'Passed Coding Exam' : 'Completed Quest');
    if (onboardingStep < 5) {
      setOnboardingStep(5); // unlock AI Interviews
    }

    // Increment streak by 1 ONLY ONCE PER CALENDAR DAY (as per system specs)
    const lastStreakDateKey = `pinit_${userId}_last_streak_date`;
    const todayStr = new Date().toDateString();
    const lastStreakDate = localStorage.getItem(lastStreakDateKey);

    if (lastStreakDate !== todayStr) {
      localStorage.setItem(lastStreakDateKey, todayStr);
      setMissionStreak(prev => {
        const next = prev + 1;
        save(keys.streak, next);
        
        // Sync updated streak to Supabase database profile in background
        api.post('/api/auth/onboarding', { mission_streak: next }).catch(() => {});
        
        if (next % 7 === 0) earnPins('streak_bonus', undefined, `${next}-day streak bonus!`);
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

  const setAiUseTokens = useCallback((val: number) => {
    setAiUseTokensState(val);
    save(keys.aiTokens, val);
  }, [keys.aiTokens, save]);

  const decrementAiUseTokens = useCallback((amount: number) => {
    setAiUseTokensState(prev => {
      const next = Math.max(0, prev - amount);
      save(keys.aiTokens, next);
      if (next === 0) {
        toast.error('AI Limit Reached ⚠️', 'Daily AI minutes exhausted. Spend 100 Pins to extend.');
      }
      return next;
    });
  }, [keys.aiTokens, save]);

  const buyAiMinutes = useCallback((): boolean => {
    if (spendPins('ai_minutes_extend', 'Extended daily AI by 30 mins')) {
      setAiUseTokensState(prev => {
        const next = prev + 30;
        save(keys.aiTokens, next);
        return next;
      });
      toast.success('AI Time Extended! ⏰', '+30 AI Minutes added to your daily balance.');
      return true;
    }
    return false;
  }, [spendPins, keys.aiTokens, save]);

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

  // ─── Existing feature actions (now also earn pins) ─────────────────────

  const toggleTheme = () => setTheme(p => { const n = p === 'light' ? 'dark' : 'light'; toast.info('Theme Switched', `${n === 'light' ? 'Light ☀️' : 'Dark 🌙'} Mode`); return n; });
  const toggleFocusMode = () => setFocusMode(p => { const n = !p; toast[n ? 'success' : 'info'](n ? 'Focus Mode On 🤫' : 'Focus Mode Off', n ? 'Distractions hidden.' : 'Standard layout restored.'); return n; });

  const addVaultItem = async (item: { title: string; item_type: string; organization_name?: string; description?: string; skill_tags?: string[] }) => {
    const tempId = Math.random().toString(36).substr(2,9);
    const newItem: VaultItem = { 
      id: tempId, 
      ...item, 
      organization_name: item.organization_name || '', 
      description: item.description || '', 
      verified: false, 
      ai_confidence_score: 80 + Math.floor(Math.random() * 19), 
      skill_tags: item.skill_tags || [], 
      is_public: false, 
      used_in_resume: false, 
      used_in_portfolio: false 
    };
    
    const updated = [newItem, ...vaultItems];
    setVaultItemsState(updated); 
    save(keys.vault, updated);
    addXp(15, 'Added proof to Vault');
    toast.success('🔒 Added to Vault', `"${item.title}" saved securely.`);

    if (userId !== 'guest') {
      try {
        const { data, error } = await supabase
          .from('vault_items')
          .insert([{
            user_id: userId,
            title: item.title,
            item_type: item.item_type,
            organization_name: item.organization_name || '',
            description: item.description || 'Uploaded document.',
            verified: false,
            ai_confidence_score: newItem.ai_confidence_score,
            skill_tags: item.skill_tags || [],
            is_public: false
          }])
          .select();
        
        if (!error && data && data.length > 0) {
          const dbItem = data[0];
          setVaultItemsState(prev => prev.map(v => v.id === tempId ? { ...v, id: dbItem.id } : v));
          // Update local storage with the new DB ID as well
          save(keys.vault, updated.map(v => v.id === tempId ? { ...v, id: dbItem.id } : v));
        }
      } catch (e) {
        console.error('Failed to sync vault item to database:', e);
      }
    }
  };

  const updateVaultItem = (id: string, updates: Partial<VaultItem>) => {
    const updated = vaultItems.map(item => {
      if (item.id !== id) return item;
      const merged = { ...item, ...updates };
      if (updates.verified && !item.verified) {
        toast.success('✓ Proof Verified', `"${item.title}" is officially verified!`);
        setTimeout(() => { addXp(20, 'Proof Verified'); earnPins('vault_verify'); }, 100);
      }
      return merged;
    });
    setVaultItemsState(updated); save(keys.vault, updated);
  };

  const completeMission = (missionId: string) => {
    // 1. Check daily limit of 1 completed mission
    const timestamps = onboardingAnswers.completedMissionsTimestamps || [];
    const today = new Date().toDateString();
    const todayCompletions = timestamps.filter(ts => new Date(ts).toDateString() === today);
    if (todayCompletions.length >= 1) {
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

    // Sync updated answers and streak to database profile in background
    api.post('/api/auth/onboarding', { 
      onboardingAnswers: nextAnswers,
      mission_streak: newStreak
    }).catch(() => {});

    rewardActivity('mission', 'Daily Mission Completed');

    // Notify GlobalAvatar mentor with mission completion event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pinit:activity_complete', {
        detail: {
          type: 'mission',
          title: 'Daily Mission',
          score: 80,
          passed: true,
        }
      }));
    }
  };

  const setOnboarding = async (answers: Omit<OnboardingAnswers, 'hasCompleted'>, skipSync = false) => {
    const data = { ...answers, hasCompleted: true };
    setOnboardingAnswers(data); save(keys.onboard, data);
 
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pinit_just_onboarded', 'true');
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

    addXp(50, 'Onboarding Complete');
    earnPins('onboarding_complete');
    setOnboardingStep(3);
    toast.success('🧬 Career Profile Set', `Target role: ${answers.role}`);
  };

  const setJdMissingSkills = (skills: string[]) => { setJdMissingSkillsState(skills); save(keys.gaps, skills); };

  const addXp = (amount: number, reason: string) => {
    setXp(prev => { const next = prev + amount; save(keys.xp, next); return next; });
  };

  // ─── Derived scores ───────────────────────────────────────────────────────
  const baseAts = typeof user?.atsScore === 'number' ? user.atsScore : 60;
  const careerScore = Math.min(98, baseAts + (onboardingAnswers.hasCompleted ? 10 : 0) + (vaultItems.filter(v => v.verified).length * 5) + (completedMissions.length * 5));

  const baseDna = typeof user?.careerDnaScore === 'number' ? user.careerDnaScore : 55;
  const dnaScore = Math.min(95, baseDna + (onboardingAnswers.hasCompleted ? 15 : 0) + (completedMissions.length * 10) + dnaBonus);

  const baseTrust = typeof user?.trustScore === 'number' ? user.trustScore : 40;
  const trustScore = Math.min(99, baseTrust + (vaultItems.filter(v => v.verified).length * 15) + trustBonus);

  // ─── Unified Modest Rewarding System Dispatcher ──────────────────────────
  const rewardActivity = useCallback((
    type: 'quest' | 'mission' | 'interview' | 'gd' | 'attention_game' | 'project',
    title?: string
  ) => {
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

    // ── Step 3: Prestige Badges for Maxed Score Caps ─────────────────────────
    if (reward.trust > 0 && trustScore + reward.trust >= 99 && trustScore < 99) {
      addXp(500, '🎖️ Trust Sentinel Prestige Milestone');
      toast.success('🎖️ Trust Sentinel Badge Unlocked!', 'Max Trust Score (99) achieved! +500 Prestige Bonus XP granted.');
    }
    if (reward.dna > 0 && dnaScore + reward.dna >= 95 && dnaScore < 95) {
      addXp(500, '🧬 Apex Career DNA Prestige Milestone');
      toast.success('🧬 Apex Career DNA Badge Unlocked!', 'Max Career DNA Score (95) achieved! +500 Prestige Bonus XP granted.');
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
  }, [save, keys.trustBonus, keys.dnaBonus, userId, trustScore, dnaScore, addXp]);

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
      theme, focusMode, toggleTheme, toggleFocusMode,
      careerScore, dnaScore, trustScore,
      pins, pinHistory, earnPins, spendPins, canAfford, addPurchasedPins,
      unlockedItems, isItemUnlocked, getItemRemainingSeconds, unlockItem, rewardActivity,
      // progression
      onboardingStep, setOnboardingStep,
      resumeGenerated, setResumeGenerated,
      roadmapGenerated, setRoadmapGenerated,
      generateFusedRoadmap,
      activeCourseId, setActiveCourseId: setActiveCourseIdState,
      activeCourseIds, setActiveCourseIds: setActiveCourseIdsState,
      switchActiveCourse, archiveActiveCourse,
      completedQuests, addCompletedQuest, saveQuestCode,
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
