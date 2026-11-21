'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/lib/store/useAppStore';
import {
  CodeWarsApiService,
  CodeWarsProblem,
  BattleMatch,
  CODE_WARS_PROBLEMS_CATALOG
} from '@/lib/api/codeWarsApi';
import { ArenaPvPService, ArenaRoom } from '@/lib/services/arenaPvPService';
import { triggerPinStream } from '@/components/pins/coinAnimation';
import ArenaCodeDiffViewer from '@/components/pins/ArenaCodeDiffViewer';
import { calculateStudentKnowledge } from '@/lib/arena/knowledgeEngine';
import { BattleAudio } from '@/lib/arena/battleAudio';
import {
  checkRunCooldown,
  calculateBattleScore,
  ARENA_RULES_CONFIG,
  CombatEvent,
  createCombatEvent,
} from '@/lib/arena/codeWarRules';
import CompetitionNavigation from '@/components/competition/CompetitionNavigation';
import { isConfirmedLeagueMembershipCacheValue } from '@/lib/competition/leagueMembershipSnapshot';
import { recordCheatingIncident } from '@/lib/trust/trustEngine';
import { recordMetricLedgerEntry } from '@/lib/telemetry/metricsLedger';
import styles from '../competition-experience.module.css';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 360, background: 'var(--bg3)', color: 'var(--t3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 14.5 }}>
        Loading Monaco Code Arena Engine...
      </div>
    )
  }
);

function createArenaRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const random = Math.floor(Math.random() * 16);
    return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });
}

function ArenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams?.get('tab');
  const initialTab: 'code_wars' | 'hackathons' | 'viva' = 'code_wars';
  const roomQueryCode = searchParams?.get('room');

  const { user, refresh } = useAuth();
  const guestStudentIdRef = useRef<string | null>(null);
  if (!guestStudentIdRef.current) {
    guestStudentIdRef.current = `student_${Math.random().toString(36).slice(2, 8)}`;
  }
  const studentId = user?.id || guestStudentIdRef.current;
  const [combatantDeviceId, setCombatantDeviceId] = useState('');
  const studentName = (user as any)?.full_name || (user as any)?.name || 'Combatant';
  const studentAvatar = (user as any)?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
  
  const cOS = useCareerOS();
  const { xp = 0, pins = 0 } = cOS || {};

  useEffect(() => {
    setCombatantDeviceId(ArenaPvPService.getDeviceId());
  }, []);

  // Live ELO state with instant cache hydration (Baseline 100)
  const [liveElo, setLiveElo] = useState<number | null>(null);
  const [arenaStanding, setArenaStanding] = useState<{
    userId: string | null;
    rank: number | null;
    league: string;
    weeklyXp: number;
    weeklyArenaPoints: number;
    careerXp: number;
    joined: boolean;
  }>({ userId: null, rank: null, league: 'browns', weeklyXp: 0, weeklyArenaPoints: 0, careerXp: 0, joined: false });

  useEffect(() => {
    if (!user?.id || typeof window === 'undefined') return;
    try {
      const cachedMembership = localStorage.getItem(`pinit_joined_league_${user.id}`);
      if (!isConfirmedLeagueMembershipCacheValue(cachedMembership)) return;
      setArenaStanding(previous => previous.userId === user.id && previous.joined
        ? previous
        : { ...previous, userId: user.id, joined: true });
    } catch {}
  }, [user?.id]);
  const [cachedElo, setCachedElo] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = Number(localStorage.getItem(`pinit_user_elo_${studentId}`));
      if (saved === 1200) {
        localStorage.setItem(`pinit_user_elo_${studentId}`, '100');
        return 100;
      }
      if (Number.isFinite(saved) && saved > 0) return saved;
    }
    return 100;
  });

  const rawUserElo = (typeof (user as any)?.arena_elo === 'number' && Number.isFinite((user as any).arena_elo))
    ? (user as any).arena_elo
    : null;
  // Sanitize legacy 1200 default from old SQL migration: baseline is 100
  const isLegacy1200 = rawUserElo === 1200 && !(user as any)?.arena_wins;
  const sanitizedUserElo = isLegacy1200 ? 100 : rawUserElo;

  const eloRating = liveElo ?? (sanitizedUserElo ?? cachedElo);

  // Auto-heal legacy 1200 database rows in Supabase
  useEffect(() => {
    if (user?.id && (user as any)?.arena_elo === 1200 && !(user as any)?.arena_wins) {
      Promise.resolve(supabase.from('users').update({ arena_elo: 100 }).eq('id', user.id)).catch(() => {});
    }
  }, [user]);

  // Synchronize dynamic profile events across tabs and contexts
  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      const eventUserId = typeof e?.detail?.user_id === 'string' ? e.detail.user_id : null;
      if (eventUserId && eventUserId !== user?.id) return;
      const incomingElo = typeof e?.detail?.arena_elo === 'number'
        ? e.detail.arena_elo
        : (typeof e?.detail?.elo === 'number' ? e.detail.elo : null);
      if (typeof incomingElo === 'number' && Number.isFinite(incomingElo)) {
        setLiveElo(incomingElo);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
      return () => window.removeEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
    }
  }, [user?.id]);

  // Solo Sparring Match Settlement Reward State
  const [soloReward, setSoloReward] = useState<{
    eloDelta: number;
    newElo: number;
    arenaPointsAwarded: number;
    pinsAwarded: number;
  } | null>(null);

  // Task 14: Dynamic Empirical Knowledge Calibration
  const studentKnowledge = React.useMemo(() => {
    return calculateStudentKnowledge({
      xpTotal: xp,
      arenaElo: eloRating,
      completedQuests: (user as any)?.completed_quests || [],
      careerDnaScore: (user as any)?.careerDnaScore || (user as any)?.atsScore || 50,
      missionsCompleted: (user as any)?.missionsCompleted || 0,
    });
  }, [xp, user, eloRating]);


  const [recentMatches, setRecentMatches] = useState<BattleMatch[]>([]);

  // Hydrate real match history from local storage and server
  useEffect(() => {
    if (!studentId) return;
    CodeWarsApiService.getStudentMatchesAsync(studentId).then(matches => {
      if (matches && matches.length > 0) {
        setRecentMatches(matches);
      }
    }).catch(() => {});
  }, [studentId]);

  // Combat Precision & Win Ratio (Real match evidence)
  const totalBattles = recentMatches.length;
  const winsCount = recentMatches.filter(m => m.status === 'victory').length;
  const winRatePct = totalBattles > 0 ? Math.round((winsCount / totalBattles) * 100) : 0;

  const [activeTab, setActiveTab] = useState<'code_wars' | 'hackathons' | 'viva'>(initialTab);

  // Sync tab with URL query parameter (normalized strictly to code_wars)
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'hackathons' || tabParam === 'viva') {
      setActiveTab('code_wars');
      router.replace('/arena?tab=code_wars', { scroll: false });
    } else {
      setActiveTab('code_wars');
    }
  }, [searchParams, router]);

  // Code Wars & PvP State
  const [problems] = useState<CodeWarsProblem[]>(CODE_WARS_PROBLEMS_CATALOG);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('auto');
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<number>(600); // 10 minutes

  // Track solved problems in localStorage to prevent repeatable XP farming
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`pinit_arena_solved_${studentId}`);
        if (stored) return new Set(JSON.parse(stored));
      } catch {}
    }
    return new Set();
  });

  // Active PvP Room
  const [activeRoom, setActiveRoom] = useState<ArenaRoom | null>(null);
  const [roomInputCode, setRoomInputCode] = useState<string>('');
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const roomCreateRequestIdRef = useRef<string | null>(null);
  const soloStartRequestRef = useRef<{ requestId: string; problemId: string } | null>(null);
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
  const [isStartingSolo, setIsStartingSolo] = useState<boolean>(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Countdown before battle start (3.. 2.. 1.. FIGHT!)
  const [countdown, setCountdown] = useState<number | null>(null);

  // Solo battle fallback match
  const [soloMatch, setSoloMatch] = useState<BattleMatch | null>(null);
  const [soloSettlementRetry, setSoloSettlementRetry] = useState(0);
  const soloSettlementAttemptsRef = useRef(0);

  // Voice action deep-link: `/arena?autostart=duel`
  // Opens a ready-to-confirm 1v1 Code Wars modal showing the 10-Pin entry fee (never silently spends Pins).
  const [showVoiceDuelModal, setShowVoiceDuelModal] = useState(false);
  const autostartDuelHandledRef = useRef(false);
  useEffect(() => {
    const autostart = searchParams?.get('autostart');
    if (autostart !== 'duel') {
      autostartDuelHandledRef.current = false;
      return;
    }
    if (activeRoom || soloMatch || autostartDuelHandledRef.current) return;
    autostartDuelHandledRef.current = true;
    setActiveTab('code_wars');
    setShowVoiceDuelModal(true);

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('autostart');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } catch {}
    }
  }, [searchParams, activeRoom, soloMatch]);

  // In-battle state
  const [language, setLanguage] = useState<'typescript' | 'python' | 'java'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`pinit_arena_language_${studentId}`);
      if (saved === 'typescript' || saved === 'python' || saved === 'java') return saved;
    }
    return 'typescript';
  });
  const [code, setCode] = useState<string>('');
  const codeDraftsRef = useRef<Record<string, string>>({});
  const [isAnswerPadOpen, setIsAnswerPadOpen] = useState(false);
  const [answerScratchpad, setAnswerScratchpad] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number>(600);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    passed: boolean;
    score: number;
    testsPassed: number;
    totalTests: number;
    logs: string;
    evidenceRecordId?: string;
  } | null>(null);

  const [showCodeInspect, setShowCodeInspect] = useState<boolean>(false);

  // Code War Rules & Competitive State (Task 15)
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => (typeof window !== 'undefined' ? BattleAudio.isMuted() : false));
  const [runCooldownRemaining, setRunCooldownRemaining] = useState<number>(0);
  const [lastRunTimestamp, setLastRunTimestamp] = useState<number>(0);
  const [combatEvents, setCombatEvents] = useState<CombatEvent[]>([]);
  const [consecutivePassStreak, setConsecutivePassStreak] = useState<number>(0);
  const [submissionAttempts, setSubmissionAttempts] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [showRulesDrawer, setShowRulesDrawer] = useState<boolean>(false);
  const [showBattleReport, setShowBattleReport] = useState<boolean>(false);
  const [isStrategyExpanded, setIsStrategyExpanded] = useState<boolean>(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isArenaFullscreen, setIsArenaFullscreen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const syncFullscreenState = () => {
      const docAny = document as any;
      setIsArenaFullscreen(Boolean(document.fullscreenElement || docAny.webkitFullscreenElement));
    };
    syncFullscreenState();
    document.addEventListener('fullscreenchange', syncFullscreenState);
    document.addEventListener('webkitfullscreenchange', syncFullscreenState);
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
      document.removeEventListener('webkitfullscreenchange', syncFullscreenState);
    };
  }, []);

  // Anti-Cheating Guardian: Proctor active Arena battles against tab switching
  useEffect(() => {
    const isBattleRunning = Boolean(activeRoom || soloMatch) && timeRemaining > 0 && !testResult?.passed;
    if (!isBattleRunning) return;

    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        const battleId = activeRoom?.id || soloMatch?.id || 'arena_battle';
        recordCheatingIncident(user?.id, `arena_${battleId}`, 'arena', 'arena_tab_switch').catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeRoom, soloMatch, timeRemaining, testResult, user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setArenaStanding({ userId: null, rank: null, league: 'browns', weeklyXp: 0, weeklyArenaPoints: 0, careerXp: Math.max(0, Number(xp) || 0), joined: false });
      return;
    }

    let cancelled = false;
    let inFlight = false;
    const loadStanding = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const params = new URLSearchParams({ mode: 'global', userId: user.id });
        const headers: Record<string, string> = { 'x-user-id': user.id };
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
        } catch {}

        const response = await fetch(`/api/leaderboard?${params.toString()}`, { headers, cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled || !data?.ok || data.currentUserId !== user.id) return;

        const stats = data.currentUserStats || {};
        const standingElo = Number(data.currentUser?.eloRating ?? stats.arenaElo);
        if (Number.isFinite(standingElo) && standingElo > 0) setLiveElo(standingElo);

        setArenaStanding(previous => {
          const sameAccount = previous.userId === user.id;
          const joined = Boolean(data.currentUserHasJoined || (sameAccount && previous.joined) || (user as any)?.league_joined_at);
          const serverRank = Number(data.currentUser?.rank);
          return {
            userId: user.id,
            rank: joined
              ? (data.currentUserHasJoined && Number.isFinite(serverRank) ? serverRank : sameAccount ? previous.rank : null)
              : null,
            league: typeof data.currentUserLeague === 'string' ? data.currentUserLeague : 'browns',
            weeklyXp: Math.max(0, Number(stats.weeklyXp ?? data.currentUser?.weeklyXp) || 0),
            weeklyArenaPoints: Math.max(0, Number(stats.arenaPoints ?? data.currentUser?.arenaPoints) || 0),
            careerXp: Math.max(0, Number(data.currentUserTotalXp) || Number(xp) || 0),
            joined,
          };
        });
      } catch {
        // Keep the fast local profile values visible if the standings endpoint is unavailable.
      } finally {
        inFlight = false;
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void loadStanding();
    };
    const handleProfileUpdate = (event: Event) => {
      const detail = (event as CustomEvent<Record<string, unknown>>).detail || {};
      if (typeof detail.user_id === 'string' && detail.user_id !== user.id) return;
      const updatedElo = typeof detail.arena_elo === 'number'
        ? detail.arena_elo
        : typeof detail.elo === 'number' ? detail.elo : null;
      const updatedWeeklyXp = typeof detail.weekly_xp === 'number'
        ? detail.weekly_xp
        : typeof detail.weeklyXp === 'number' ? detail.weeklyXp : null;
      const updatedCareerXp = typeof detail.xp_total === 'number'
        ? detail.xp_total
        : typeof detail.totalXp === 'number' ? detail.totalXp : typeof detail.xp === 'number' ? detail.xp : null;
      const updatedArenaPoints = typeof detail.weekly_arena_points === 'number'
        ? detail.weekly_arena_points
        : typeof detail.arenaPoints === 'number' ? detail.arenaPoints : null;
      const confirmedJoin = typeof detail.league_joined_at === 'string' && detail.league_joined_at.length > 0;

      if (updatedElo !== null && Number.isFinite(updatedElo)) setLiveElo(updatedElo);
      if ((updatedWeeklyXp !== null && Number.isFinite(updatedWeeklyXp)) || (updatedCareerXp !== null && Number.isFinite(updatedCareerXp)) || (updatedArenaPoints !== null && Number.isFinite(updatedArenaPoints)) || confirmedJoin) {
        setArenaStanding(previous => ({
          ...previous,
          userId: user.id,
          weeklyXp: updatedWeeklyXp !== null && Number.isFinite(updatedWeeklyXp) ? Math.max(0, updatedWeeklyXp) : previous.weeklyXp,
          weeklyArenaPoints: updatedArenaPoints !== null && Number.isFinite(updatedArenaPoints) ? Math.max(0, updatedArenaPoints) : previous.weeklyArenaPoints,
          careerXp: updatedCareerXp !== null && Number.isFinite(updatedCareerXp) ? Math.max(0, updatedCareerXp) : previous.careerXp,
          joined: confirmedJoin || (previous.userId === user.id && previous.joined),
        }));
      }
      refreshWhenVisible();
    };

    void loadStanding();
    const timer = window.setInterval(refreshWhenVisible, 30_000);
    window.addEventListener('focus', refreshWhenVisible);
    window.addEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshWhenVisible);
      window.removeEventListener('pinit:user_profile_updated', handleProfileUpdate as EventListener);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [user?.id, xp, soloReward?.newElo, activeRoom?.eloApplied]);

  // Detect Light/Dark theme changes for Monaco & UI precision
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const checkTheme = () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light' || document.body.classList.contains('light-theme');
        setTheme(isLight ? 'light' : 'dark');
      };
      checkTheme();
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
      return () => observer.disconnect();
    }
  }, []);

  const handleCopyText = (text: string, field: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    }
  };

  // Determine current active problem
  const activeProblem = problems.find(p => p.id === (activeRoom?.problemId || soloMatch?.problemId || (selectedProblemId !== 'auto' ? selectedProblemId : ''))) || problems[0];

  const handleLanguageChange = (nextLanguage: 'typescript' | 'python' | 'java') => {
    if (nextLanguage === language) return;
    if (activeProblem) codeDraftsRef.current[`${activeProblem.id}:${language}`] = code;
    setLanguage(nextLanguage);
    try {
      localStorage.setItem(`pinit_arena_language_${studentId}`, nextLanguage);
    } catch {}
  };

  const handleEditorCodeChange = (nextCode: string) => {
    setCode(nextCode);
    if (activeProblem) codeDraftsRef.current[`${activeProblem.id}:${language}`] = nextCode;
  };

  const resetEditorCode = () => {
    if (!activeProblem) return;
    const starter = activeProblem.starterCode[language] || activeProblem.starterCode.typescript || '';
    codeDraftsRef.current[`${activeProblem.id}:${language}`] = starter;
    setCode(starter);
  };

  const copyScratchpad = async () => {
    if (!answerScratchpad.trim()) {
      toast.error('Nothing to copy', 'Add or paste an answer into the temporary pad first.');
      return;
    }
    try {
      await navigator.clipboard.writeText(answerScratchpad);
      toast.success('Answer copied', 'The temporary answer is ready to paste.');
    } catch {
      toast.error('Could not copy answer', 'Allow clipboard access, then try again.');
    }
  };

  const copyEditorAnswer = async () => {
    if (!code.trim()) {
      toast.error('Nothing to copy', 'The editor is empty.');
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Editor answer copied', 'Your current code is on the clipboard.');
    } catch {
      toast.error('Could not copy answer', 'Allow clipboard access, then try again.');
    }
  };

  const useScratchpadInEditor = () => {
    if (!answerScratchpad.trim()) {
      toast.error('Answer pad is empty', 'Paste or write code in the temporary pad first.');
      return;
    }
    handleEditorCodeChange(answerScratchpad);
    toast.success('Answer moved to editor', 'Run the tests when you are ready.');
  };

  // Latest versions of handlers used inside effects. They are recreated on every render; reading them
  // through refs keeps the effects below from restarting on each render (assigned after their definitions).
  const handleJoinRoomRef = useRef<((codeToJoin?: string) => Promise<void>) | null>(null);
  const handleTimeoutRef = useRef<(() => Promise<void>) | null>(null);
  const handledRoomQueryRef = useRef<string | null>(null);

  // Auto-join if room query parameter is present in URL (once each time the room code in the URL changes)
  useEffect(() => {
    if (!roomQueryCode) { handledRoomQueryRef.current = null; return; }
    if (handledRoomQueryRef.current === roomQueryCode) return;
    handledRoomQueryRef.current = roomQueryCode;
    if (activeRoom) return;
    setActiveTab('code_wars');
    setRoomInputCode(roomQueryCode.toUpperCase());
    void handleJoinRoomRef.current?.(roomQueryCode.toUpperCase());
  }, [roomQueryCode, activeRoom]);

  // Subscribe to real-time updates when an active room is set
  useEffect(() => {
    if (!activeRoom?.roomCode) return;

    const unsubscribe = ArenaPvPService.subscribeToRoom(activeRoom.roomCode, (updatedRoom) => {
      setActiveRoom(prev => {
        // If room transitioned to ready, trigger countdown if not triggered
        if (prev?.status === 'waiting' && updatedRoom.status === 'in_progress') {
          // Both ready! Start game
        }
        return updatedRoom;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [activeRoom?.roomCode]);

  // Tactical Cooldown Countdown Timer
  useEffect(() => {
    if (runCooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setRunCooldownRemaining(prev => Math.max(0, prev - 200));
    }, 200);
    return () => clearInterval(timer);
  }, [runCooldownRemaining]);

  // Audio Fanfare on Match Start
  const prevGameActiveRef = useRef<boolean>(false);
  useEffect(() => {
    const isGameActive = activeRoom?.status === 'in_progress' || soloMatch?.status === 'active';
    if (isGameActive && !prevGameActiveRef.current) {
      BattleAudio.playBattleStart();
      const startEvt = createCombatEvent('peer_joined', {
        actorName: 'SYSTEM',
        actorId: 'system',
        extra: 'Chamber locked. All tactical rules active!',
      });
      setCombatEvents([startEvt]);
    }
    prevGameActiveRef.current = isGameActive;
  }, [activeRoom?.status, soloMatch?.status]);

  // Pressure Surge Protocol Trigger (<90s)
  const surgeFiredRef = useRef<boolean>(false);
  useEffect(() => {
    const isGameActive = activeRoom?.status === 'in_progress' || soloMatch?.status === 'active';
    if (isGameActive && timeRemaining <= 90 && timeRemaining > 0 && !surgeFiredRef.current) {
      surgeFiredRef.current = true;
      BattleAudio.playSurgePulse();
      const surgeEvt = createCombatEvent('surge', {
        actorName: 'SYSTEM',
        actorId: 'system',
      });
      setCombatEvents(prev => [surgeEvt, ...prev].slice(0, 10));
    }
    if (!isGameActive) {
      surgeFiredRef.current = false;
    }
  }, [timeRemaining, activeRoom?.status, soloMatch?.status]);

  // Sync real-time events from activeRoom into local combat feed
  useEffect(() => {
    if (activeRoom?.events && activeRoom.events.length > 0) {
      setCombatEvents(prev => {
        const existingIds = new Set(prev.map(e => e.id));
        const newEvts = activeRoom.events!.filter((e: any) => !existingIds.has(e.id));
        if (newEvts.length === 0) return prev;
        const latest = newEvts[0];
        if (latest.actorId !== studentId) {
          if (latest.type === 'first_blood') BattleAudio.playFirstBlood();
          else if (latest.type === 'test_passed') BattleAudio.playTestPassed(1);
          else if (latest.type === 'test_failed') BattleAudio.playTestFailed();
        }
        return [...newEvts, ...prev].slice(0, 12);
      });
    }
  }, [activeRoom?.events, studentId]);

  // Load starter code on problem or language change
  useEffect(() => {
    if (activeProblem && activeProblem.starterCode) {
      const draftKey = `${activeProblem.id}:${language}`;
      const savedDraft = codeDraftsRef.current[draftKey];
      setCode(savedDraft ?? activeProblem.starterCode[language] ?? activeProblem.starterCode.typescript ?? '// Write solution here');
    }
  }, [activeProblem, language]);

  // Battle Countdown Timer
  const roomStatus = activeRoom?.status;
  const soloStatus = soloMatch?.status;
  const problemDifficulty = activeProblem?.difficulty;
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const isGameActive = roomStatus === 'in_progress' || soloStatus === 'active';

    if (isGameActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            void handleTimeoutRef.current?.();
            return 0;
          }
          return prev - 1;
        });

        // Turing Benchmark AI opponent pacing simulation for solo mode
        if (soloStatus === 'active') {
          setSoloMatch(curr => {
            if (!curr || !curr.opponent || curr.status !== 'active' || curr.opponent.completed) return curr;
            const elapsed = (curr.opponent.timeElapsedSeconds || 0) + 1;
            const targetSeconds = problemDifficulty === 'basic' ? 120 : problemDifficulty === 'advanced' ? 240 : 180;
            const progress = Math.min(100, Math.round((elapsed / targetSeconds) * 100));
            const botFinished = progress >= 100;
            return {
              ...curr,
              status: botFinished ? 'defeat' : 'active',
              opponent: {
                ...curr.opponent,
                progressPct: progress,
                completed: botFinished,
                timeElapsedSeconds: elapsed,
              }
            };
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [roomStatus, soloStatus, timeRemaining, problemDifficulty]);

  // Handle Create Room
  const handleCreateRoom = async () => {
    if (isCreatingRoom) return;
    setIsCreatingRoom(true);
    setRoomError(null);

    const hasPersistentWallet = Boolean(user?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id));
    if (!hasPersistentWallet) {
      setRoomError('Sign in to spend Pins and create a battle room. You can still join an invite.');
      setIsCreatingRoom(false);
      return;
    }

    try {
      if (!roomCreateRequestIdRef.current) {
        roomCreateRequestIdRef.current = createArenaRequestId();
      }

      const studentCompletedQuests: string[] = (Array.isArray(cOS?.completedQuests) && cOS.completedQuests.length > 0)
        ? cOS.completedQuests
        : (Array.isArray((user as any)?.completed_quests)
          ? (user as any).completed_quests
          : (Array.isArray((user as any)?.completedQuests)
            ? (user as any).completedQuests
            : []));

      const room = await ArenaPvPService.createRoom({
        hostId: studentId,
        hostName: studentName,
        hostAvatar: studentAvatar,
        hostLanguage: language,
        problemId: selectedProblemId || 'auto',
        difficulty: studentKnowledge.recommendedDifficulty as 'basic' | 'intermediate' | 'advanced',
        timeLimitSeconds: selectedTimeLimit,
        requestId: roomCreateRequestIdRef.current,
        completedQuests: studentCompletedQuests,
        recentProblemIds: Array.from(solvedProblemIds),
      });

      if (room.pinCharge) {
        cOS?.setPins?.(room.pinCharge.newBalance);
        cOS?.setBonusPins?.(room.pinCharge.newBonusBalance);
      }

      roomCreateRequestIdRef.current = null;
      setActiveRoom(room);
      setTimeRemaining(room.timeLimitSeconds);
    } catch (err: any) {
      setRoomError(err.message || 'Failed to create room');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  // Handle Join Room
  const handleJoinRoom = async (codeToJoin?: string) => {
    const code = (codeToJoin || roomInputCode).trim().toUpperCase();
    if (!code) {
      setRoomError('Please enter a valid room code');
      return;
    }

    try {
      setIsJoiningRoom(true);
      setRoomError(null);
      const room = await ArenaPvPService.joinRoom({
        roomCode: code,
        guestId: studentId,
        guestName: studentName,
        guestAvatar: studentAvatar,
        guestLanguage: language,
      });
      setActiveRoom(room);
      setTimeRemaining(room.timeLimitSeconds || 600);
      setIsJoiningRoom(false);
    } catch (err: any) {
      setIsJoiningRoom(false);
      setRoomError(err.message || 'Failed to join room');
    }
  };

  // Toggle Ready State in Room
  const handleToggleReady = async () => {
    if (!activeRoom) return;
    try {
      const updated = await ArenaPvPService.toggleReady(activeRoom.roomCode, studentId);
      setActiveRoom(updated);
    } catch (err: any) {
      setRoomError(err.message || 'Could not update ready state');
    }
  };

  // Run Tests with Tactical Cooldown, Audio Synthesizer, and Live Ticker
  const handleRunTests = async () => {
    // 1. Enforce Rule 2: Anti-Spam Tactical Cooldown
    const cooldown = checkRunCooldown(lastRunTimestamp);
    if (!cooldown.allowed) {
      BattleAudio.playCooldownWarning();
      toast.warning('Tactical Cooldown', `Please wait ${cooldown.remainingCooldownSeconds}s before running tests again.`);
      return;
    }
    setLastRunTimestamp(Date.now());
    setRunCooldownRemaining(ARENA_RULES_CONFIG.RUN_COOLDOWN_MS);

    setIsRunningTests(true);
    try {
      const result = await CodeWarsApiService.submitSolution({
        matchId: activeRoom?.id || soloMatch?.id || 'test_run',
        studentId,
        code,
        language,
        timeSpentSeconds: (activeRoom?.timeLimitSeconds || 600) - timeRemaining,
        problemId: activeProblem.id,
        rewardEligible: Boolean(activeRoom),
      });
      setTestResult(result);

      // Audio & Event handling
      if (result.passed) {
        setConsecutivePassStreak(prev => {
          const next = prev + 1;
          BattleAudio.playTestPassed(next);
          return next;
        });
        const streakEvt = createCombatEvent(consecutivePassStreak >= 2 ? 'streak' : 'test_passed', {
          actorName: 'You',
          actorId: studentId,
          testIndex: result.testsPassed,
          testTotal: result.totalTests,
          streakCount: consecutivePassStreak + 1,
        });
        setCombatEvents(prev => [streakEvt, ...prev].slice(0, 10));
      } else if (result.testsPassed > 0) {
        setConsecutivePassStreak(1);
        BattleAudio.playTestPassed(1);
        const passEvt = createCombatEvent('test_passed', {
          actorName: 'You',
          actorId: studentId,
          testIndex: result.testsPassed,
          testTotal: result.totalTests,
        });
        setCombatEvents(prev => [passEvt, ...prev].slice(0, 10));
      } else {
        setConsecutivePassStreak(0);
        BattleAudio.playTestFailed();
        const failEvt = createCombatEvent('test_failed', {
          actorName: 'You',
          actorId: studentId,
          extra: result.logs ? result.logs.slice(0, 50) : 'Test assertion failed',
        });
        setCombatEvents(prev => [failEvt, ...prev].slice(0, 10));
      }

      // Broadcast progress to opponent if in PvP room
      if (activeRoom) {
        ArenaPvPService.updateProgress({
          roomCode: activeRoom.roomCode,
          playerId: studentId,
          testsPassed: result.testsPassed,
          totalTests: result.totalTests,
          score: result.score,
          code,
          logs: result.logs,
        });
      }
    } catch (err: any) {
      setConsecutivePassStreak(0);
      BattleAudio.playTestFailed();
      setTestResult({
        passed: false,
        score: 0,
        testsPassed: 0,
        totalTests: activeProblem.testCases.length,
        logs: 'Runtime Error: ' + (err.message || 'Execution failed'),
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  // Submit Final Solution with Attempt Tracking & First Blood Fanfare
  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    setSubmissionAttempts(prev => prev + 1);
    try {
      const result = await CodeWarsApiService.submitSolution({
        matchId: activeRoom?.id || soloMatch?.id || 'submit_run',
        studentId,
        code,
        language,
        timeSpentSeconds: (activeRoom?.timeLimitSeconds || 600) - timeRemaining,
        problemId: activeProblem.id,
        rewardEligible: Boolean(activeRoom),
      });
      setTestResult(result);

      if (!result.passed) {
        setFailedAttempts(prev => prev + 1);
        BattleAudio.playTestFailed();
      } else {
        BattleAudio.playFirstBlood();
      }

      if (activeRoom) {
        const updated = await ArenaPvPService.submitSolution({
          roomCode: activeRoom.roomCode,
          playerId: studentId,
          passed: result.passed,
          testsPassed: result.testsPassed,
          totalTests: result.totalTests,
          score: result.score,
          code,
          language,
        });
        setActiveRoom(updated);

        // If victorious, grant reward and trigger flying pins (deduplicated by problem ID)
        if (result.passed) {
          const isFirstClear = !solvedProblemIds.has(activeProblem.id);
          if (isFirstClear) {
            triggerPinStream({ count: 20 });
            // XP is granted by the server's judge (first clear of a problem only).
            if (result.xpAwarded && cOS?.applyServerXp) cOS.applyServerXp(result.newXp, result.xpAwarded, '1v1 Arena Duel Victory (First Clear)');
            setSolvedProblemIds(prev => {
              const next = new Set(prev).add(activeProblem.id);
              try {
                localStorage.setItem(`pinit_arena_solved_${studentId}`, JSON.stringify(Array.from(next)));
              } catch {}
              return next;
            });
          }
        }
      } else if (soloMatch) {
        setSoloMatch(prev => prev ? { ...prev, status: result.passed ? 'victory' : 'defeat' } : null);
      }
    } catch (err: any) {
      toast.error('Submission Error', err.message || 'Could not submit solution.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timeout handler
  const handleTimeout = async () => {
    if (activeRoom) {
      ArenaPvPService.submitSolution({
        roomCode: activeRoom.roomCode,
        playerId: studentId,
        passed: false,
        testsPassed: testResult?.testsPassed || 0,
        totalTests: activeProblem.testCases.length,
        score: testResult?.score || 0,
        code,
      });
    } else if (soloMatch) {
      setSoloMatch(prev => prev ? { ...prev, status: 'timeout' } : null);
    }
  };
  handleJoinRoomRef.current = handleJoinRoom;
  handleTimeoutRef.current = handleTimeout;

  // Copy shareable invite link
  const copyInviteLink = () => {
    if (!activeRoom) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://present-career-os.vercel.app';
    const link = `${origin}/arena?tab=code_wars&room=${activeRoom.roomCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Start Solo Sparring against Turing AI with Knowledge Affinity Calibration
  const handleStartSoloSparring = async (overrideDifficulty?: 'basic' | 'intermediate' | 'advanced') => {
    if (isStartingSolo) return;
    setIsStartingSolo(true);
    setSoloReward(null);
    const hasPersistentWallet = Boolean(user?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id));
    if (!hasPersistentWallet && cOS?.canAfford && !cOS.canAfford('code_arena')) {
      toast.error('Insufficient Pins', 'You need 10 Pins to start AI practice.');
      setIsStartingSolo(false);
      return;
    }
    const targetDiff = overrideDifficulty || (studentKnowledge.recommendedDifficulty as any) || 'basic';
    const candidateProblems = problems.filter(p => p.difficulty === targetDiff);
    const unvisited = candidateProblems.filter(p => !solvedProblemIds.has(p.id));
    const pool = unvisited.length > 0 ? unvisited : candidateProblems;
    const newlyChosenProblem = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : problems[0];

    const pendingStorageKey = `pinit_arena_solo_start_${studentId}`;
    let pendingStart = soloStartRequestRef.current;
    if (!pendingStart && hasPersistentWallet) {
      try {
        const saved = JSON.parse(localStorage.getItem(pendingStorageKey) || 'null');
        if (
          saved &&
          typeof saved.requestId === 'string' &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved.requestId) &&
          typeof saved.problemId === 'string' &&
          problems.some(problem => problem.id === saved.problemId)
        ) {
          pendingStart = { requestId: saved.requestId, problemId: saved.problemId };
        } else if (saved) {
          localStorage.removeItem(pendingStorageKey);
        }
      } catch {
        try { localStorage.removeItem(pendingStorageKey); } catch {}
      }
    }
    const requestedProblem = pendingStart
      ? problems.find(problem => problem.id === pendingStart?.problemId) || newlyChosenProblem
      : newlyChosenProblem;
    pendingStart = pendingStart || { requestId: createArenaRequestId(), problemId: requestedProblem.id };
    soloStartRequestRef.current = pendingStart;
    if (hasPersistentWallet) {
      try { localStorage.setItem(pendingStorageKey, JSON.stringify(pendingStart)); } catch {}
    }
    setSelectedProblemId(requestedProblem.id);

    try {
      const serverMatch = await ArenaPvPService.startSoloMatch(requestedProblem.id, pendingStart.requestId);
      const matchProblem = problems.find(problem => problem.id === serverMatch.problemId) || requestedProblem;
      if (serverMatch.persisted) {
        if (typeof serverMatch.newBalance === 'number') cOS?.setPins?.(serverMatch.newBalance);
        if (typeof serverMatch.newBonusBalance === 'number') cOS?.setBonusPins?.(serverMatch.newBonusBalance);
      } else {
        const charged = cOS?.spendPins
          ? await cOS.spendPins('code_arena', undefined, 'Start AI Practice Match')
          : false;
        if (!charged) throw new Error('You need 10 Pins to start AI practice.');
      }
      const match = CodeWarsApiService.startMatch(studentId, matchProblem.id, '1v1_duel');
      match.id = serverMatch.matchId;
      match.startedAt = Date.parse(serverMatch.startedAt) || Date.now();
      const deadline = Date.parse(serverMatch.deadlineAt);
      const remainingSeconds = Number.isFinite(deadline)
        ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
        : matchProblem.timeLimitSeconds;
      if (remainingSeconds === 0) match.status = 'timeout';
      soloSettledRef.current = null;
      soloSettlementAttemptsRef.current = 0;
      setSoloMatch(match);
      setSelectedProblemId(matchProblem.id);
      setTimeRemaining(remainingSeconds);
      setTestResult(null);
      soloStartRequestRef.current = null;
      if (hasPersistentWallet) {
        try { localStorage.removeItem(pendingStorageKey); } catch {}
      }
    } catch (err) {
      toast.error('Arena unavailable', err instanceof Error ? err.message : 'Could not start a sparring match.');
    } finally {
      setIsStartingSolo(false);
    }
  };

  // Leave / Forfeit room
  const handleLeaveRoom = () => {
    if (activeRoom) {
      if (activeRoom.status === 'in_progress') {
        ArenaPvPService.forfeit(activeRoom.roomCode, studentId);
      }
      setActiveRoom(null);
    }
    if (soloMatch) {
      setSoloMatch(null);
    }
    setSoloReward(null);
    setTestResult(null);
    setShowCodeInspect(false);
  };

  // Derived state for PvP HUD
  const onHostDevice = Boolean(activeRoom && combatantDeviceId && activeRoom.hostDeviceId === combatantDeviceId);
  const onGuestDevice = Boolean(activeRoom && combatantDeviceId && activeRoom.guestDeviceId === combatantDeviceId);
  const isHost = Boolean(activeRoom && (onHostDevice || (!onGuestDevice && activeRoom.hostId === studentId)));
  const isGuest = Boolean(activeRoom && (onGuestDevice || (!onHostDevice && (activeRoom.guestId === studentId || activeRoom.guestId === `${studentId}_challenger`))));
  const myProgress = isHost ? activeRoom?.hostProgress : activeRoom?.guestProgress;
  const opponentProgress = isHost ? activeRoom?.guestProgress : activeRoom?.hostProgress;
  const opponentName = isHost ? (activeRoom?.guestName || 'Waiting for challenger...') : activeRoom?.hostName;
  const opponentAvatar = isHost ? (activeRoom?.guestAvatar || '') : activeRoom?.hostAvatar;
  const isMyReady = isHost ? activeRoom?.hostReady : activeRoom?.guestReady;
  const isOpponentReady = isHost ? activeRoom?.guestReady : activeRoom?.hostReady;

  const isMatchOver = Boolean((activeRoom && activeRoom.status === 'completed') || (soloMatch && soloMatch.status !== 'active'));
  const didIWin = activeRoom
    ? isHost ? activeRoom.winnerId === activeRoom.hostId : isGuest && activeRoom.winnerId === activeRoom.guestId
    : soloMatch?.status === 'victory';
  const didIDraw = activeRoom?.winnerId === 'draw';
  const currentCareerXp = Math.max(0, Number(arenaStanding.careerXp) || 0, Number(xp) || 0);
  const arenaLeagueLabel = `${arenaStanding.league.charAt(0).toUpperCase()}${arenaStanding.league.slice(1)} League`;
  const arenaRankLabel = arenaStanding.joined
    ? arenaStanding.rank ? `#${arenaStanding.rank}` : 'Syncing'
    : 'Unranked';
  const arenaRankCaption = arenaStanding.joined
    ? arenaStanding.rank ? arenaLeagueLabel : 'Updating your League Points position'
    : currentCareerXp >= 100 ? 'Join Browns to start your sprint' : 'Reach 100 Career XP to qualify';

  // Audio Fanfare & Report on Match Conclusion
  const matchOverSoundPlayedRef = useRef<boolean>(false);
  useEffect(() => {
    if (isMatchOver && !matchOverSoundPlayedRef.current) {
      matchOverSoundPlayedRef.current = true;
      if (didIWin) {
        BattleAudio.playVictory();
      } else if (!didIDraw) {
        BattleAudio.playDefeat();
      }
      setShowBattleReport(true);
    }
    if (!isMatchOver) {
      matchOverSoundPlayedRef.current = false;
    }
  }, [isMatchOver, didIWin, didIDraw]);

  // Synchronize recentMatches on match completion
  useEffect(() => {
    if (!isMatchOver) return;
    const updated = CodeWarsApiService.getStudentMatches(studentId);
    if (updated && updated.length > 0) {
      setRecentMatches(updated);
    }
  }, [isMatchOver, studentId]);

  // Synchronize 1v1 Room match completion to client state
  const roomSettledRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isMatchOver || !activeRoom || activeRoom.status !== 'completed') return;
    const roomKey = `${activeRoom.roomCode}:${activeRoom.winnerId}:${activeRoom.hostNewElo}`;
    if (roomSettledRef.current === roomKey) return;
    roomSettledRef.current = roomKey;

    const myNewElo = isHost ? activeRoom.hostNewElo : activeRoom.guestNewElo;
    const myArenaPointsAward = isHost ? activeRoom.hostArenaPointsAward : activeRoom.guestArenaPointsAward;
    if (typeof myNewElo === 'number' && myNewElo > 0) {
      setLiveElo(myNewElo);
      try {
        localStorage.setItem(`pinit_user_elo_${studentId}`, String(myNewElo));
      } catch {}
      if (typeof window !== 'undefined') {
        const currentArenaPoints = Number((user as any)?.weekly_arena_points) || 0;
        const addArenaPoints = typeof myArenaPointsAward === 'number' && myArenaPointsAward > 0 ? myArenaPointsAward : 0;
        const eloDelta = (isHost ? (activeRoom.hostEloDelta ?? 0) : (activeRoom.guestEloDelta ?? 0)) || 0;
        const prevElo = myNewElo - eloDelta;
        const didWin = activeRoom.winnerId === studentId;
        recordMetricLedgerEntry(studentId, {
          metric: 'arena_elo',
          feature: 'arena',
          action: didWin ? `1v1 Arena Victory (${activeRoom.roomCode})` : `1v1 Arena Match (${activeRoom.roomCode})`,
          delta: eloDelta,
          previousValue: prevElo,
          valueAfter: myNewElo,
          mentalityTag: 'Pattern Hunter',
        });
        if (addArenaPoints > 0) {
          recordMetricLedgerEntry(studentId, {
            metric: 'arena_league_points',
            feature: 'arena',
            action: `1v1 Arena League Points (${activeRoom.roomCode})`,
            delta: addArenaPoints,
            previousValue: currentArenaPoints,
            valueAfter: currentArenaPoints + addArenaPoints,
          });
        }
        recordMetricLedgerEntry(studentId, {
          metric: 'mentality',
          feature: 'arena',
          action: didWin ? 'Tactical Combat Win · Pattern Hunter' : 'Arena Resilience · Stabilizer',
          delta: didWin ? 6 : 2,
          previousValue: 0,
          valueAfter: didWin ? 6 : 2,
          mentalityTag: didWin ? 'Pattern Hunter' : 'Stabilizer',
        });
        window.dispatchEvent(new CustomEvent('pinit:user_profile_updated', {
          detail: {
            arena_elo: myNewElo,
            elo: myNewElo,
            user_id: studentId,
            weekly_arena_points: currentArenaPoints + addArenaPoints,
            arenaPoints: currentArenaPoints + addArenaPoints,
          }
        }));
      }
      if (refresh) refresh().catch(() => {});
    }
  }, [isMatchOver, activeRoom, isHost, studentId, refresh, user, xp]);

  // Authoritative Turing AI Sparring Settlement
  const soloSettledRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isMatchOver || !soloMatch || soloMatch.status === 'active') return;
    const settleKey = soloMatch.id;
    if (soloSettledRef.current === settleKey) return;
    soloSettledRef.current = settleKey;
    const attemptNumber = ++soloSettlementAttemptsRef.current;

    const isWin = soloMatch.status === 'victory';
    ArenaPvPService.settleSoloMatch({ matchId: soloMatch.id, code, language })
      .then(data => {
        if (data.rewardUnavailable) return;
        if (data.passed !== isWin) {
          setSoloMatch(current => current ? { ...current, status: data.passed ? 'victory' : 'defeat' } : null);
        }
        setSoloReward({
          eloDelta: data.eloDelta,
          newElo: data.newElo,
          arenaPointsAwarded: data.arenaPointsAwarded,
          pinsAwarded: data.pinsAwarded,
        });
        setLiveElo(data.newElo);
        try {
          localStorage.setItem(`pinit_user_elo_${studentId}`, String(data.newElo));
        } catch {}
        if (typeof window !== 'undefined') {
          const currentArenaPoints = Number((user as any)?.weekly_arena_points) || 0;
          const eloDelta = Number(data.eloDelta) || 0;
          const newEloNum = Number(data.newElo) || 100;
          const addPts = Number(data.arenaPointsAwarded) || 0;
          recordMetricLedgerEntry(studentId, {
            metric: 'arena_elo',
            feature: 'arena',
            action: isWin ? `Solo Arena Victory (${soloMatch.problemId || 'Challenge'})` : `Solo Arena Attempt`,
            delta: eloDelta,
            previousValue: newEloNum - eloDelta,
            valueAfter: newEloNum,
            mentalityTag: 'Pattern Hunter',
          });
          if (addPts > 0) {
            recordMetricLedgerEntry(studentId, {
              metric: 'arena_league_points',
              feature: 'arena',
              action: `Solo Arena League Reward`,
              delta: addPts,
              previousValue: currentArenaPoints,
              valueAfter: currentArenaPoints + addPts,
            });
          }
          recordMetricLedgerEntry(studentId, {
            metric: 'mentality',
            feature: 'arena',
            action: isWin ? 'Algorithmic Pattern Victory · Pattern Hunter' : 'Sparring Persistence · Stabilizer',
            delta: isWin ? 5 : 2,
            previousValue: 0,
            valueAfter: isWin ? 5 : 2,
            mentalityTag: isWin ? 'Pattern Hunter' : 'Stabilizer',
          });
          window.dispatchEvent(new CustomEvent('pinit:user_profile_updated', {
            detail: {
              arena_elo: data.newElo,
              elo: data.newElo,
              user_id: studentId,
              weekly_arena_points: data.newArenaPoints ?? (currentArenaPoints + (data.arenaPointsAwarded || 0)),
              arenaPoints: data.newArenaPoints ?? (currentArenaPoints + (data.arenaPointsAwarded || 0)),
            }
          }));
        }
        if (refresh) refresh().catch(() => {});
      })
      .catch(err => {
        soloSettledRef.current = null;
        console.warn('[Arena Solo Effect] Settle failed:', err);
        if (attemptNumber < 3) {
          window.setTimeout(() => setSoloSettlementRetry(value => value + 1), attemptNumber * 1200);
        } else {
          toast.error('Arena result not saved', 'Your result could not be saved after several attempts. Please keep this match open and try again.');
        }
      });
  }, [isMatchOver, soloMatch, code, language, studentId, cOS, refresh, soloSettlementRetry, user]);

  // Keep Arena's own focus layout local to this page; starting a match must not
  // switch the whole application into focus or fullscreen gaming mode.
  const inDuel = Boolean(((activeRoom && activeRoom.status !== 'waiting') || soloMatch) && !isMatchOver);

  return (
    <div className={inDuel ? undefined : styles.competitionPage} style={{
      maxWidth: inDuel ? '100%' : undefined,
      margin: '0 auto',
      minHeight: inDuel ? '100vh' : '85vh',
      padding: inDuel ? '12px 20px 32px' : undefined,
      transition: 'all 0.25s ease'
    }}>
      <CompetitionNavigation active="arena" hidden={inDuel} />

      {/* ── 1v1 CODE WARS TAB ──────────────────────────────────── */}
      {activeTab === 'code_wars' && (
        <div>
          {/* STATE 1: LOBBY (No active battle or room) */}
          {!activeRoom && !soloMatch && (
            <div>
              <section data-testid="arena-ranked-hero" className={styles.arenaHero}>
                <div className={styles.arenaHeroContent}>
                  <div className={styles.eyebrow}>
                    <span className={styles.liveDot} />
                    Turing AI Practice <span aria-hidden="true" style={{ color: 'var(--t3)' }}>·</span> Training Arena
                  </div>
                  <h1 className={styles.heroTitle}>
                    Practice the challenge. Keep your rating.
                  </h1>
                  <p className={styles.heroDescription}>
                    Solve a timed coding challenge against the Turing benchmark. Practice results never change your ELO, Arena Points, XP, or ranked stats.
                  </p>
                  <div className={styles.heroActions}>
                    <span className={styles.detailPill}>
                      10 Pins · charged at start
                    </span>
                    <span className={styles.detailPill}>
                      No rating impact
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleStartSoloSparring()}
                      disabled={isStartingSolo}
                      className={styles.primaryAction}
                    >
                      {isStartingSolo ? 'PREPARING PRACTICE…' : 'START AI PRACTICE'} <span aria-hidden="true">↗</span><span style={{ opacity: .82 }}>· 10 PINS</span>
                    </button>
                  </div>
                </div>

                <div aria-hidden="true" className={styles.arenaVisual}>
                  <div className={`${styles.arenaRing} ${styles.arenaRingOne}`} />
                  <div className={`${styles.arenaRing} ${styles.arenaRingTwo}`} />
                  <div className={`${styles.arenaRing} ${styles.arenaRingThree}`} />
                  <div className={styles.arenaCenter}>VS</div>
                </div>
              </section>

              <div data-testid="arena-summary-cards" className={styles.arenaMetrics}>
                {[
                  { label: 'Your rank', value: arenaRankLabel, detail: arenaRankCaption, color: '#22d3ee' },
                  { label: 'Arena ELO', value: String(liveElo ?? sanitizedUserElo ?? cachedElo), detail: 'Match rating', color: '#a78bfa' },
                  { label: 'Weekly XP', value: `${arenaStanding.weeklyXp.toLocaleString()} XP`, detail: 'Learning XP this sprint', color: '#10b981' },
                  arenaStanding.joined
                    ? { label: 'Arena Points', value: arenaStanding.weeklyArenaPoints.toLocaleString(), detail: 'This sprint · counts toward League Points', color: '#fbbf24' }
                    : { label: 'Entry goal', value: `${Math.min(100, currentCareerXp)} / 100`, detail: 'Career XP to qualify', color: '#fbbf24' },
                ].map(card => (
                  <div key={card.label} className={styles.metricCard}>
                    <span aria-hidden="true" className={styles.metricAccent} style={{ background: card.color }} />
                    <div className={styles.metricLabel}>{card.label}</div>
                    <div key={card.value} className={`${styles.metricValue} ${styles.metricValueChanged}`} aria-live="polite" aria-atomic="true">{card.value}</div>
                    <div className={styles.metricCaption}>{card.detail}</div>
                  </div>
                ))}
              </div>

              {/* Top Quick Actions Grid */}
              <div className={styles.arenaActionGrid}>
                
                {
                /* Mode B: Create Private Room */}
                <div className={styles.arenaActionCard}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        padding: '4px 12px',
                        borderRadius: 20
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                        PRIVATE BATTLE
                      </span>
                    </div>
                    <h3 className={styles.actionTitle}>
                      Challenge a friend
                    </h3>
                    <p className={styles.actionDescription}>
                      Set the challenge, create a private room, then share a one-time invite with your rival.
                    </p>

                    <div className={styles.actionControls}>
                      <div>
                        <label className={styles.actionFieldLabel}>Challenge Caliber</label>
                        <select
                          value={selectedProblemId}
                          onChange={e => setSelectedProblemId(e.target.value)}
                          className={styles.actionField}
                        >
                          <option value="auto">🎯 Auto-Calibrated (Shared Knowledge Edge)</option>
                          <option value="tier_basic">🟢 Novice Foundations (Days 1–15)</option>
                          <option value="tier_intermediate">🟡 Apprentice Structures (Days 16–30)</option>
                          <option value="tier_advanced">🔴 Master Algorithms (Days 31–60)</option>
                        </select>
                      </div>

                      <div>
                        <label className={styles.actionFieldLabel}>Time Limit</label>
                        <select
                          value={selectedTimeLimit}
                          onChange={e => setSelectedTimeLimit(Number(e.target.value))}
                          className={styles.actionField}
                        >
                          <option value={300}>5 Minutes</option>
                          <option value={600}>10 Minutes</option>
                          <option value={900}>15 Minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    disabled={isCreatingRoom}
                    className={`${styles.actionButton} ${styles.createRoomButton}`}
                  >
                    {isCreatingRoom ? 'Generating Room...' : 'Create Room & Invite (10 Pins)'}
                  </button>
                </div>

                {/* Mode C: Join Room via Code */}
                <div className={styles.arenaActionCard}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        color: '#ec4899',
                        background: 'rgba(236, 72, 153, 0.12)',
                        border: '1px solid rgba(236, 72, 153, 0.25)',
                        padding: '4px 12px',
                        borderRadius: 20
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ec4899', boxShadow: '0 0 6px #ec4899' }} />
                        INVITE CODE
                      </span>
                    </div>
                    <h3 className={styles.actionTitle}>
                      Join a battle
                    </h3>
                    <p className={styles.actionDescription}>
                      Got a room code from a friend? Enter it here to join their lobby.
                    </p>

                    <div className={styles.actionControls} style={{ gridTemplateColumns: '1fr', marginBottom: 16 }}>
                      <input
                        type="text"
                        value={roomInputCode}
                        onChange={e => setRoomInputCode(e.target.value.toUpperCase())}
                        placeholder="ARENA-8F2A"
                        maxLength={12}
                        className={styles.roomCodeField}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinRoom()}
                    disabled={isJoiningRoom || !roomInputCode.trim()}
                    className={`${styles.actionButton} ${styles.joinRoomButton}`}
                  >
                    {isJoiningRoom ? 'Connecting...' : 'Join Battle Room'}
                  </button>
                </div>
              </div>

              {/* Room Error Notification */}
              {roomError && (
                <div style={{
                  padding: '12px 18px',
                  borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: 15.5,
                  fontWeight: 600,
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  {roomError}
                </div>
              )}

              <p data-testid="arena-league-note" className={styles.arenaLeagueLink}>
                PvP wins add Arena Points to your League Points. AI practice never changes your competitive stats.{' '}
                <Link href="/leaderboard?mode=global" style={{ color: 'var(--accent)', fontWeight: 800, textDecoration: 'none' }}>
                  View League Points standings →
                </Link>
              </p>
            </div>
          )}

          {/* STATE 2: PRE-GAME ROOM LOBBY (Host & Guest waiting / Ready toggle) */}
          {activeRoom && activeRoom.status === 'waiting' && (
            <div style={{
              maxWidth: 860,
              margin: '0 auto',
              padding: 32,
              borderRadius: 20,
              background: 'linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              {/* Room Header & Invite Code Bar */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 14.5, textTransform: 'uppercase', color: '#818cf8', fontWeight: 800, letterSpacing: '1px', marginBottom: 6 }}>
                  Private Battle Room
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 18px', borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: 12 }}>
                  <span style={{ fontSize: 20, fontFamily: 'monospace', fontWeight: 800, color: '#c7d2fe', letterSpacing: '2px' }}>
                    {activeRoom.roomCode}
                  </span>
                  <button
                    onClick={copyInviteLink}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: copiedLink ? '#10b981' : '#4f46e5',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {copiedLink ? '✔ Copied Link!' : 'Copy Invite Link'}
                  </button>
                </div>
                <p style={{ margin: 0, color: 'var(--t2)', fontSize: 15.5 }}>
                  Challenge: <strong style={{ color: 'var(--t1)' }}>{activeProblem.title}</strong> ({activeRoom.difficulty.toUpperCase()} · {Math.round(activeRoom.timeLimitSeconds / 60)} mins)
                </p>
              </div>

              {/* Side-by-side Fighters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                {/* Host Fighter Card */}
                <div style={{
                  padding: 24,
                  borderRadius: 16,
                  background: 'var(--bg2)',
                  border: activeRoom.hostReady ? '2px solid #10b981' : '1px solid var(--border)',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: 12, left: 12, padding: '2px 8px', borderRadius: 6, background: '#f59e0b', color: '#000', fontSize: 11, fontWeight: 800 }}>
                    HOST
                  </div>
                  <Image
                    width={72}
                    height={72}
                    src={activeRoom.hostAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt="Host"
                    style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #6366f1', margin: '0 auto 12px', objectFit: 'cover' }}
                  />
                  <h4 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', margin: '0 0 6px' }}>
                    {activeRoom.hostName}
                  </h4>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    background: activeRoom.hostReady ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: activeRoom.hostReady ? '#10b981' : '#f87171'
                  }}>
                    {activeRoom.hostReady ? 'READY' : 'WAITING'}
                  </div>
                </div>

                {/* VS Badge */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444 0%, #6366f1 100%)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 17.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
                  }}>
                    VS
                  </div>
                </div>

                {/* Guest Fighter Card */}
                <div style={{
                  padding: 24,
                  borderRadius: 16,
                  background: 'var(--bg2)',
                  border: activeRoom.guestReady ? '2px solid #10b981' : '1px solid var(--border)',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  {activeRoom.guestId ? (
                    <>
                      <div style={{ position: 'absolute', top: 12, left: 12, padding: '2px 8px', borderRadius: 6, background: '#6366f1', color: '#fff', fontSize: 11, fontWeight: 800 }}>
                        CHALLENGER
                      </div>
                      <Image
                        width={72}
                        height={72}
                        src={activeRoom.guestAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                        alt="Challenger"
                        style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #10b981', margin: '0 auto 12px', objectFit: 'cover' }}
                      />
                      <h4 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', margin: '0 0 6px' }}>
                        {activeRoom.guestName}
                      </h4>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 700,
                        background: activeRoom.guestReady ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: activeRoom.guestReady ? '#10b981' : '#f87171'
                      }}>
                        {activeRoom.guestReady ? 'READY' : 'WAITING'}
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '20px 0' }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", margin: "0 auto 10px" }} className="animate-pulse" />
                      <h4 style={{ fontSize: 17.5, fontWeight: 700, color: 'var(--t2)', margin: '0 0 6px' }}>
                        Waiting for Friend...
                      </h4>
                      <p style={{ fontSize: 13, color: 'var(--t3)', margin: 0 }}>
                        Share the room code or invite link to start
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lobby Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                <button
                  onClick={handleLeaveRoom}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t2)',
                    fontWeight: 600,
                    fontSize: 15.5,
                    cursor: 'pointer'
                  }}
                >
                  Leave Lobby
                </button>

                <button
                  onClick={handleToggleReady}
                  style={{
                    padding: '12px 36px',
                    borderRadius: 12,
                    background: isMyReady
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 16.5,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isMyReady ? '0 4px 16px rgba(16, 185, 129, 0.4)' : '0 4px 16px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  {isMyReady ? '✓ You Are Ready (Click to Cancel)' : 'Ready to Battle'}
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: LIVE COMBAT BATTLE VIEW (In progress or completed) */}
          {((activeRoom && activeRoom.status !== 'waiting') || soloMatch) && (
            <div>
              {/* Tactical Rules Codex Bar (Task 15) */}
              <div style={{
                padding: '10px 18px',
                borderRadius: 14,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const next = BattleAudio.toggleMute();
                      setIsAudioMuted(next);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 12px',
                      borderRadius: 8,
                      background: isAudioMuted ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                      border: isAudioMuted ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                      color: isAudioMuted ? '#ef4444' : '#10b981',
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <span>{isAudioMuted ? '🔇' : '🔊'}</span>
                    <span>{isAudioMuted ? 'Audio Muted' : 'Sound FX Live'}</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, padding: '4px 9px', borderRadius: 6, background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#d97706', fontWeight: 700 }}>
                      ⚡ First to solve wins
                    </span>
                    <span style={{ fontSize: 12, padding: '4px 9px', borderRadius: 6, background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#6366f1', fontWeight: 700 }}>
                      🛡️ Anti-Spam: 3.0s Tactical Cooldown
                    </span>
                    <span style={{ fontSize: 12, padding: '4px 9px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#059669', fontWeight: 700 }}>
                      🎯 Clean code improves Battle Score
                    </span>
                    {timeRemaining <= 90 && (
                      <span style={{ fontSize: 12, padding: '4px 9px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.18)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: 800 }}>
                        🔥 Surge Active (+15% Battle Score)
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: 'rgba(99, 102, 241, 0.14)',
                      border: '1px solid rgba(99, 102, 241, 0.35)',
                      color: '#818cf8',
                      fontSize: 11.5,
                      fontWeight: 800,
                      padding: '5px 12px',
                      borderRadius: 999,
                      fontFamily: "'JetBrains Mono', monospace",
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      letterSpacing: '0.5px',
                      boxShadow: '0 0 12px rgba(99,102,241,0.2)',
                    }}
                  >
                    {soloMatch ? 'TURING AI PRACTICE · RATINGS UNCHANGED' : 'LIVE PvP DUEL'}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof document !== 'undefined') {
                        const docAny = document as any;
                        if (document.fullscreenElement || docAny.webkitFullscreenElement) {
                          const exitFullscreen = document.exitFullscreen || docAny.webkitExitFullscreen;
                          if (exitFullscreen) Promise.resolve(exitFullscreen.call(document)).catch(() => {});
                        } else {
                          const rootAny = document.documentElement as any;
                          const requestFullscreen = rootAny.requestFullscreen || rootAny.webkitRequestFullscreen;
                          if (requestFullscreen) Promise.resolve(requestFullscreen.call(rootAny)).catch(() => {});
                        }
                      }
                    }}
                    aria-pressed={isArenaFullscreen}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 8,
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      color: 'var(--t1)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                    title={isArenaFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isArenaFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen'}
                  </button>

                  <button
                    onClick={() => setShowRulesDrawer(true)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 8,
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      color: 'var(--t1)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>📜</span> Rulebook
                  </button>
                </div>
              </div>

              {/* Pressure Surge Protocol Banner (<90s) */}
              {timeRemaining <= 90 && (
                <div style={{
                  padding: '9px 16px',
                  borderRadius: 12,
                  background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.22) 0%, rgba(245, 158, 11, 0.22) 100%)',
                  border: '1.5px solid #ef4444',
                  color: '#ef4444',
                  fontWeight: 800,
                  fontSize: 13,
                  textAlign: 'center',
                  marginBottom: 16,
                  letterSpacing: '0.5px',
                  boxShadow: '0 0 16px rgba(239, 68, 68, 0.25)'
                }}>
                  ⚡ PRESSURE SURGE PROTOCOL ACTIVE — FINAL 90 SECONDS! ALL PASSED TESTS GRANT +15% CLUTCH SCORE ⚡
                </div>
              )}

              {/* Live Combat Event Ticker */}
              {combatEvents.length > 0 && (
                <div style={{
                  marginBottom: 16,
                  padding: '8px 14px',
                  borderRadius: 10,
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  overflowX: 'auto',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ⚔️ Combat Telemetry:
                  </span>
                  {combatEvents.slice(0, 3).map(evt => {
                    const severityBg =
                      evt.severity === 'urgent' ? 'rgba(239, 68, 68, 0.15)' :
                      evt.severity === 'success' ? 'rgba(16, 185, 129, 0.15)' :
                      evt.severity === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)';
                    const severityText =
                      evt.severity === 'urgent' ? '#ef4444' :
                      evt.severity === 'success' ? '#10b981' :
                      evt.severity === 'warning' ? '#f59e0b' : '#818cf8';
                    return (
                      <div key={evt.id} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 10px',
                        borderRadius: 6,
                        background: severityBg,
                        color: severityText,
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        <span>{evt.title}</span>
                        <span style={{ color: 'var(--t2)', fontWeight: 400 }}>{evt.description}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── VERSUS HUD BAR (Image 2 Top HUD Precision) ── */}
              <div style={{
                padding: '16px 28px',
                borderRadius: 20,
                background: theme === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(20px)',
                border: theme === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: theme === 'light' ? '0 8px 30px rgba(0,0,0,0.06)' : '0 12px 40px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                marginBottom: 20
              }}>
                {/* Left: Player Avatar, Name & Tests Passed */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 280, flex: 1 }}>
                  <div style={{
                    position: 'relative',
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    padding: 2,
                    border: '2.5px solid #10b981',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.55)',
                    flexShrink: 0,
                  }}>
                    <Image
                      src={studentAvatar}
                      alt={studentName}
                      width={48}
                      height={48}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>
                        {studentName}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap' }}>Arena ELO {eloRating}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        flex: 1,
                        maxWidth: 180,
                        height: 6,
                        borderRadius: 3,
                        background: 'var(--bg3)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${Math.min(100, ((testResult?.testsPassed || myProgress?.testsPassed || 0) / (activeProblem.testCases.length || 5)) * 100)}%`,
                          height: '100%',
                          background: '#10b981',
                          boxShadow: '0 0 8px #10b981',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap' }}>
                        {testResult?.testsPassed || myProgress?.testsPassed || 0}/{activeProblem.testCases.length} test cases passed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Glowing Amber Countdown Capsule */}
                <div style={{
                  padding: '6px 36px',
                  borderRadius: 28,
                  border: '2px solid #f59e0b',
                  background: 'rgba(245, 158, 11, 0.1)',
                  boxShadow: '0 0 24px rgba(245, 158, 11, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 160,
                  flexShrink: 0
                }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: '#f59e0b',
                    lineHeight: 1
                  }}>
                    Countdown
                  </div>
                  <div style={{
                    fontSize: 32,
                    fontWeight: 900,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#fef08a',
                    textShadow: '0 0 14px rgba(245, 158, 11, 0.65)',
                    lineHeight: 1.1,
                    marginTop: 2
                  }}>
                    {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                {/* Right: Opponent Info & Progress */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14, minWidth: 280, flex: 1 }}>
                  <div style={{ textAlign: 'right', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>
                        {activeRoom ? opponentName : (soloMatch?.opponent?.name || 'AI Bot / Rival')} (Benchmark)
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)', whiteSpace: 'nowrap' }}>
                        {activeRoom
                          ? `${opponentProgress?.testsPassed || 0}/${activeProblem.testCases.length} test cases passed`
                          : `${Math.round(soloMatch?.opponent?.progressPct || 0)}% test cases passed`}
                      </span>
                      <div style={{
                        flex: 1,
                        maxWidth: 180,
                        height: 6,
                        borderRadius: 3,
                        background: 'var(--bg3)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: activeRoom
                            ? `${Math.min(100, ((opponentProgress?.testsPassed || 0) / (activeProblem.testCases.length || 5)) * 100)}%`
                            : `${soloMatch?.opponent?.progressPct || 0}%`,
                          height: '100%',
                          background: '#94a3b8',
                          boxShadow: '0 0 8px rgba(148, 163, 184, 0.5)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                  <div style={{
                    position: 'relative',
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    padding: 2,
                    border: '2.5px solid rgba(148, 163, 184, 0.6)',
                    boxShadow: '0 0 16px rgba(148, 163, 184, 0.35)',
                    flexShrink: 0
                  }}>
                    <Image
                      src={activeRoom ? (opponentAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80') : (soloMatch?.opponent?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80')}
                      alt="Opponent"
                      width={48}
                      height={48}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>

              {/* ── BATTLE WORKSTATION (Image 2 Split Screen: Problem Statement & Monaco Editor) ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 20 }}>
                {/* Left Column: Problem Details & Strategy Blueprint */}
                <div style={{
                  padding: 24,
                  borderRadius: 18,
                  background: 'var(--card)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.04))',
                  maxHeight: 'calc(100vh - 200px)',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18
                }}>
                  {/* Problem Title & Badges */}
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', margin: '0 0 12px' }}>
                      {activeProblem.title}
                    </h2>

                    {/* Image 2 Badges: Difficulty, Time Complexity, Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#f59e0b',
                        fontWeight: 700,
                        fontSize: 12.5,
                      }}>
                        Difficulty: {activeProblem.difficulty ? activeProblem.difficulty.charAt(0).toUpperCase() + activeProblem.difficulty.slice(1) : 'Medium'}
                      </span>

                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        fontWeight: 700,
                        fontSize: 12.5,
                      }}>
                        Time Complexity: {activeProblem.complexityTarget || 'O(N)'}
                      </span>

                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        background: 'rgba(148, 163, 184, 0.15)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        color: '#94a3b8',
                        fontWeight: 600,
                        fontSize: 12.5,
                      }}>
                        Tags: {activeProblem.tags?.join(', ') || 'Hash Map, Arrays'}
                      </span>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div style={{ fontSize: 14.5, color: 'var(--t2)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {activeProblem.description}
                  </div>

                  {/* Sample Inputs Block (Image 2 style with copy button) */}
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>
                      Sample Inputs
                    </div>
                    <div style={{
                      position: 'relative',
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      color: 'var(--t2)'
                    }}>
                      <button
                        onClick={() => handleCopyText(`nums = ${activeProblem.testCases[0]?.input || '[2, 7, 11, 15]'}\nOutput = ${activeProblem.testCases[0]?.expectedOutput || '[0, 1]'}`, 'sample_input')}
                        title="Copy sample input"
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid var(--border)',
                          color: 'var(--t3)',
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        {copiedField === 'sample_input' ? '✓ Copied' : 'Copy'}
                      </button>
                      <div style={{ color: '#818cf8', marginBottom: 2 }}>
                        input = {activeProblem.testCases[0]?.input || '[2, 7, 11, 15]'}
                      </div>
                      <div style={{ color: '#10b981' }}>
                        output = {activeProblem.testCases[0]?.expectedOutput || '[0, 1]'}
                      </div>
                    </div>
                  </div>

                  {/* Outputs Block (Image 2 style with copy button) */}
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>
                      Outputs
                    </div>
                    <div style={{
                      position: 'relative',
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      color: 'var(--t2)'
                    }}>
                      <button
                        onClick={() => handleCopyText(`input = ${activeProblem.testCases[1]?.input || '[3, 2, 4]'}\noutput = ${activeProblem.testCases[1]?.expectedOutput || '[1, 2]'}`, 'sample_output')}
                        title="Copy sample output"
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid var(--border)',
                          color: 'var(--t3)',
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        {copiedField === 'sample_output' ? '✓ Copied' : 'Copy'}
                      </button>
                      <div style={{ color: '#818cf8', marginBottom: 2 }}>
                        input = {activeProblem.testCases[1]?.input || '[3, 2, 4]'}
                      </div>
                      <div style={{ color: '#10b981' }}>
                        output = {activeProblem.testCases[1]?.expectedOutput || '[1, 2]'}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Strategy Blueprint Accordion (Image 2 style) */}
                  <div style={{
                    borderRadius: 12,
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => setIsStrategyExpanded(prev => !prev)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        color: 'var(--t1)'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
                        <span>💡</span>
                        <span>Strategy Blueprint</span>
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--t3)', transition: 'transform 0.2s ease', transform: isStrategyExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </button>
                    {isStrategyExpanded && (
                      <div style={{ padding: '0 16px 14px', fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.5, borderTop: '1px solid var(--border)' }}>
                        <p style={{ margin: '10px 0 0', color: 'var(--t2)' }}>
                          {activeProblem.hint || 'Analyze edge cases, frequency maps, or pointer increments before full submission.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Test Cases Checklist Preview */}
                  <div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--t1)', margin: '0 0 10px' }}>Test Cases</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {activeProblem.testCases.map((tc, idx) => (
                        <div key={idx} style={{ padding: 10, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12.5 }}>
                          <div><strong style={{ color: 'var(--t2)' }}>Input:</strong> <code style={{ color: '#818cf8' }}>{tc.input}</code></div>
                          <div style={{ marginTop: 2 }}><strong style={{ color: 'var(--t2)' }}>Expected:</strong> <code style={{ color: 'var(--green, #059669)' }}>{tc.expectedOutput}</code></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Code Editor & Bottom Action Dock (Image 2 Style) */}
                <div style={{
                  borderRadius: 18,
                  background: 'var(--card)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.04))',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'calc(100vh - 200px)',
                  overflow: 'hidden'
                }}>
                  {/* Top Editor Tab Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    borderBottom: '1px solid var(--border)',
                    background: theme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255, 255, 255, 0.02)'
                  }}>
                    {/* Active File Tab */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 14px',
                      borderRadius: '8px 8px 0 0',
                      background: theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border)',
                      borderBottom: 'none',
                      color: 'var(--t1)',
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: 'monospace'
                    }}>
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: language === 'python' ? '#38bdf8' : language === 'java' ? '#f59e0b' : '#3b82f6',
                        display: 'inline-block'
                      }} />
                      <span>{language === 'python' ? 'solution.py' : language === 'java' ? 'Solution.java' : 'code.ts'}</span>
                      <span style={{ fontSize: 11, color: 'var(--t3)', marginLeft: 4 }}>✕</span>
                    </div>

                    {/* Right Tools: Language Selector & Reset */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <select
                        value={language}
                        aria-label="Programming language"
                        onChange={e => handleLanguageChange(e.target.value as 'typescript' | 'python' | 'java')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          color: 'var(--t1)',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                      </select>

                      <button
                        onClick={resetEditorCode}
                        title="Reset code template"
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          color: 'var(--t3)',
                          fontSize: 12.5,
                          cursor: 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Monaco Code Editor */}
                  <div style={{ position: 'relative', flex: 1, minHeight: '380px', overflow: 'hidden' }}>
                    <MonacoEditor
                      height="100%"
                      language={language === 'python' ? 'python' : language === 'java' ? 'java' : 'typescript'}
                      theme={theme === 'light' ? 'vs' : 'vs-dark'}
                      value={code}
                      onChange={(val) => handleEditorCodeChange(val || '')}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        tabSize: 2,
                        automaticLayout: true,
                        fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                      }}
                    />
                  </div>

                  <section
                    aria-label="Temporary answer pad"
                    style={{ borderTop: '1px solid var(--border)', background: theme === 'light' ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.015)' }}
                  >
                    <button
                      type="button"
                      aria-expanded={isAnswerPadOpen}
                      onClick={() => setIsAnswerPadOpen(open => !open)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'transparent', border: 0, color: 'var(--t1)', fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}
                    >
                      <span>Temporary answer pad <span style={{ color: 'var(--t3)', fontWeight: 500 }}>· paste or draft code, then move it to the editor</span></span>
                      <span aria-hidden="true">{isAnswerPadOpen ? '−' : '+'}</span>
                    </button>
                    {isAnswerPadOpen && (
                      <div style={{ padding: '0 14px 12px' }}>
                        <textarea
                          aria-label="Temporary answer text"
                          value={answerScratchpad}
                          onChange={event => setAnswerScratchpad(event.target.value)}
                          placeholder={`Paste or draft a ${language === 'python' ? 'Python' : language === 'java' ? 'Java' : 'TypeScript'} answer here…`}
                          spellCheck={false}
                          style={{ width: '100%', minHeight: 110, resize: 'vertical', padding: 12, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace", fontSize: 12.5, lineHeight: 1.5 }}
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                          <button type="button" onClick={() => setAnswerScratchpad('')} style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Clear pad</button>
                          <button type="button" onClick={() => void copyEditorAnswer()} style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Copy editor code</button>
                          <button type="button" onClick={() => void copyScratchpad()} style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Copy pad</button>
                          <button type="button" onClick={useScratchpadInEditor} style={{ padding: '7px 11px', borderRadius: 8, border: '1px solid rgba(56,189,248,.45)', background: 'rgba(56,189,248,.12)', color: '#38bdf8', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Use in editor</button>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Inline Test Output Drawer */}
                  {testResult && (
                    <div style={{
                      padding: '12px 16px',
                      borderTop: '1px solid var(--border)',
                      background: testResult.passed
                        ? (theme === 'light' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.12)')
                        : (theme === 'light' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.12)'),
                      maxHeight: 120,
                      overflowY: 'auto'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, fontSize: 13.5, color: testResult.passed ? '#10b981' : '#ef4444' }}>
                          {testResult.passed ? '✔ All Test Cases Passed!' : '✖ Tests Failed'}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                          Score: {testResult.score}% ({testResult.testsPassed}/{testResult.totalTests})
                        </span>
                      </div>
                      <pre style={{ margin: 0, fontSize: 12, color: 'var(--t2)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {testResult.logs}
                      </pre>
                    </div>
                  )}

                  {/* Pinned Bottom Action Dock (Image 2 Style) */}
                  <div style={{
                    padding: '14px 20px',
                    borderTop: '1px solid var(--border)',
                    background: theme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Secondary Glass Button: Run Tests */}
                      <button
                        onClick={handleRunTests}
                        disabled={Boolean(isRunningTests || isSubmitting || isMatchOver || runCooldownRemaining > 0)}
                        style={{
                          padding: '11px 24px',
                          borderRadius: 12,
                          background: runCooldownRemaining > 0
                            ? 'rgba(99, 102, 241, 0.15)'
                            : (theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.08)'),
                          border: runCooldownRemaining > 0 ? '1.5px solid #6366f1' : '1px solid var(--border)',
                          color: runCooldownRemaining > 0 ? '#818cf8' : 'var(--t1)',
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: isRunningTests || isMatchOver || runCooldownRemaining > 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {runCooldownRemaining > 0 ? (
                          <>
                            <span>🛡️</span> Cooldown ({(runCooldownRemaining / 1000).toFixed(1)}s)
                          </>
                        ) : (
                          <>
                            <span>Run Tests</span>
                          </>
                        )}
                      </button>

                      {/* Primary Glowing Emerald Button: Submit Solution */}
                      <button
                        onClick={handleSubmitSolution}
                        disabled={Boolean(isSubmitting || isRunningTests || isMatchOver)}
                        style={{
                          padding: '11px 36px',
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: 14.5,
                          border: 'none',
                          cursor: isSubmitting || isMatchOver ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                      </button>
                    </div>

                    {/* Danger Red Ghost Button: Forfeit Match */}
                    <button
                      onClick={handleLeaveRoom}
                      style={{
                        padding: '9px 18px',
                        borderRadius: 10,
                        background: 'transparent',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        color: '#ef4444',
                        fontWeight: 600,
                        fontSize: 13.5,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Forfeit
                    </button>
                  </div>
                </div>
              </div>

              {/* POST-BATTLE VICTORY / DEFEAT MODAL */}
              {isMatchOver && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 999999,
                  padding: 20
                }}>
                  <div style={{
                    maxWidth: 520,
                    width: '100%',
                    padding: 32,
                    borderRadius: 20,
                    background: 'var(--bg2)',
                    border: didIDraw ? '2px solid #818cf8' : didIWin ? '2px solid #10b981' : '2px solid #ef4444',
                    textAlign: 'center',
                    boxShadow: didIDraw ? '0 0 50px rgba(129, 140, 248, 0.22)' : didIWin ? '0 0 50px rgba(16, 185, 129, 0.3)' : '0 0 50px rgba(239, 68, 68, 0.3)',
                    animation: 'goldImpactShockwave 0.5s ease'
                  }}>
                    <div style={{ fontSize: 61.5, marginBottom: 12 }}>
                      {didIDraw ? '＝' : didIWin ? '✓' : '✗'}
                    </div>

                    <h2 style={{ fontSize: 31, fontWeight: 800, color: didIDraw ? '#a5b4fc' : didIWin ? '#34d399' : '#f87171', margin: '0 0 8px' }}>
                      {didIDraw ? 'DRAW' : didIWin ? 'VICTORY!' : 'DEFEAT'}
                    </h2>

                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 20,
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid #6366f1',
                      color: '#c7d2fe',
                      fontSize: 13,
                      fontWeight: 700,
                      marginBottom: 12
                    }}>
                      {didIDraw ? '🤝' : '⚔️'} Decision: {activeRoom?.tieBreakerReason || (didIDraw ? 'The match ended evenly' : didIWin ? 'Flawless Test Suite Clear' : 'Match Concluded')}
                    </div>

                    <p style={{ color: 'var(--t2)', fontSize: 15.5, margin: '0 0 20px' }}>
                      {soloMatch
                        ? 'Practice result only. The 10 Pin entry fee was charged when the match started; ELO, Arena Points, XP, and ranked win/loss stats stay unchanged.'
                        : didIDraw
                        ? 'The match ended level. Your Arena ELO and Arena Points stay unchanged.'
                        : didIWin
                        ? 'Sensational performance! You conquered the algorithmic duel under official Arena rules.'
                        : "Hard-fought match. Review your test logs, inspect your rival's approach, and run it back."}
                    </p>

                    {/* Combat Honor Badges */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {activeRoom?.firstBloodClaimedBy === studentId && (
                        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.18)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: 800 }}>
                          🩸 First to solve
                        </span>
                      )}
                      {didIWin && submissionAttempts <= 1 && failedAttempts === 0 && (
                        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.18)', border: '1px solid #10b981', color: '#10b981', fontWeight: 800 }}>
                          🎯 Clean first pass
                        </span>
                      )}
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)', fontWeight: 600 }}>
                        Accuracy: {testResult?.testsPassed || myProgress?.testsPassed || 0}/{activeProblem.testCases.length} Tests
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 12,
                      padding: 16,
                      borderRadius: 12,
                      background: 'var(--bg3)',
                      marginBottom: 24
                    }}>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>{soloMatch ? 'ELO · NO CHANGE' : 'ELO RATING'}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: soloMatch ? '#38bdf8' : didIDraw ? '#a5b4fc' : didIWin ? '#34d399' : '#f87171' }}>
                          {(() => {
                            if (soloMatch) return '+0';
                            if (activeRoom) {
                              const delta = isHost ? (activeRoom as any)?.hostEloDelta : (activeRoom as any)?.guestEloDelta;
                              if (typeof delta === 'number') {
                                return delta >= 0 ? `+${delta}` : `${delta}`;
                              }
                            }
                            if (soloReward) {
                              return soloReward.eloDelta >= 0 ? `+${soloReward.eloDelta}` : `${soloReward.eloDelta}`;
                            }
                            return didIDraw ? '+0' : didIWin ? '+20' : '-20';
                          })()}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                          {soloMatch
                            ? `Rating remains ${soloReward?.newElo ?? liveElo ?? sanitizedUserElo ?? cachedElo}`
                            : activeRoom
                              ? `Rating: ${isHost ? (activeRoom as any)?.hostNewElo ?? liveElo ?? sanitizedUserElo ?? 100 : (activeRoom as any)?.guestNewElo ?? liveElo ?? sanitizedUserElo ?? 100}`
                              : `New: ${liveElo ?? sanitizedUserElo ?? 100}`}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>{soloMatch ? 'ARENA POINTS · NONE' : 'ARENA POINTS'}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>
                          +{soloMatch ? 0 : (() => {
                            if (activeRoom) {
                              const awardPoints = isHost ? (activeRoom as any)?.hostArenaPointsAward : (activeRoom as any)?.guestArenaPointsAward;
                              if (typeof awardPoints === 'number') return awardPoints;
                            }
                            if (soloReward) {
                              return soloReward.arenaPointsAwarded;
                            }
                            return didIWin ? Math.min(250, Math.round(eloRating * 0.5)) : 0;
                          })()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setShowCodeInspect(true)}
                        style={{
                          padding: '12px 20px',
                          borderRadius: 10,
                          background: 'rgba(99, 102, 241, 0.18)',
                          border: '1px solid #6366f1',
                          color: '#c7d2fe',
                          fontWeight: 700,
                          fontSize: 15.5,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        Compare Code Solutions
                      </button>

                      <button
                        onClick={handleLeaveRoom}
                        style={{
                          padding: '12px 24px',
                          borderRadius: 10,
                          background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          color: 'var(--t1)',
                          fontWeight: 700,
                          fontSize: 15.5,
                          cursor: 'pointer'
                        }}
                      >
                        Back to Arena Lobby
                      </button>

                      {activeRoom && (
                        <button
                          onClick={() => {
                            setActiveRoom(null);
                            handleCreateRoom();
                          }}
                          style={{
                            padding: '12px 28px',
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 15.5,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Play Another Duel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Post-Battle Side-by-Side Code Diff Viewer Modal */}
              <ArenaCodeDiffViewer
                isOpen={showCodeInspect}
                onClose={() => setShowCodeInspect(false)}
                myCode={code}
                opponentCode={
                  activeRoom
                    ? (isHost ? activeRoom.guestProgress.code : activeRoom.hostProgress.code) || '// No code submitted by opponent'
                    : '// Optimal Solution Reference\nclass Solution {\n  // Algorithmic optimal approach\n}'
                }
                myScore={{
                  passed: testResult?.passed || false,
                  testsPassed: testResult?.testsPassed || 0,
                  totalTests: testResult?.totalTests || activeProblem.testCases.length,
                  score: testResult?.score || 0,
                }}
                opponentScore={{
                  passed: activeRoom
                    ? (isHost ? activeRoom.guestProgress.testsPassed >= activeProblem.testCases.length : activeRoom.hostProgress.testsPassed >= activeProblem.testCases.length)
                    : (soloMatch?.status === 'victory' ? false : true),
                  testsPassed: activeRoom
                    ? (isHost ? activeRoom.guestProgress.testsPassed : activeRoom.hostProgress.testsPassed)
                    : (soloMatch?.status === 'victory' ? Math.floor(activeProblem.testCases.length * 0.6) : activeProblem.testCases.length),
                  totalTests: activeProblem.testCases.length,
                  score: activeRoom
                    ? (isHost ? activeRoom.guestProgress.score : activeRoom.hostProgress.score)
                    : (soloMatch?.status === 'victory' ? 60 : 100),
                }}
                problemId={activeProblem.id}
              />
            </div>
          )}
        </div>
      )}

      {/* ARENA RULES CODEX MODAL (Task 15) */}
      {showRulesDrawer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: 20
        }}>
          <div style={{
            maxWidth: 620,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 28,
            borderRadius: 20,
            background: 'var(--bg2)',
            border: '1.5px solid #6366f1',
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>📜</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>
                  PinIT Arena Rules
                </h3>
              </div>
              <button
                onClick={() => setShowRulesDrawer(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  color: 'var(--t3)',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
              Private PvP matches affect ELO and Arena Points. Turing AI practice costs 10 Pins when it starts and never changes your ratings, XP, or ranked stats.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>⚡</span>
                  <strong style={{ color: '#f59e0b', fontSize: 14.5 }}>Rule 1: Private PvP ratings and rewards</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  In a private PvP match, the first combatant to pass all test cases wins. A win adds <strong>20 ELO</strong> and awards <strong>half of pre-match ELO as Arena Points</strong>, rounded and capped at 250. A loss removes up to 20 ELO and awards no Arena Points; a draw changes neither. These rating rules never apply to Turing AI practice.
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>🛡️</span>
                  <strong style={{ color: '#6366f1', fontSize: 14.5 }}>Rule 2: Anti-Spam Tactical Cooldown</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  To prevent trial-and-error brute forcing, &quot;Run Tests&quot; enforces a <strong>3.0-second tactical cooldown</strong>. Verify your algorithms methodically.
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>🎯</span>
                  <strong style={{ color: '#10b981', fontSize: 14.5 }}>Rule 3: Clean execution</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  A first-attempt pass improves your <strong>Battle Score</strong>. Battle Score helps resolve close matches; it does not add Arena Points or ELO.
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>🔥</span>
                  <strong style={{ color: '#ef4444', fontSize: 14.5 }}>Rule 4: Pressure Surge Protocol (&lt;90s)</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  When the battle clock drops below 90 seconds, Surge Mode adds a <strong>15% Battle Score bonus</strong> for tests cleared during the final stretch. It does not change League Points directly.
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>⚖️</span>
                  <strong style={{ color: '#38bdf8', fontSize: 14.5 }}>Rule 5: Deterministic Tie-Breaker</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  If time expires with neither combatant passing 100%, the match is resolved strictly by: 1) Most tests passed, 2) Battle Score (Speed and attempt efficiency), 3) Honorable Draw.
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>🛡️</span>
                  <strong style={{ color: '#a855f7', fontSize: 14.5 }}>Rule 6: Persistent ELO</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  New players start at <strong>100 ELO</strong>. ELO persists across sprint resets and can fall to 0; it never determines your league division.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowRulesDrawer(false)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Understood — Return to Arena
            </button>
          </div>
        </div>
      )}

      {showVoiceDuelModal && !activeRoom && !soloMatch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm 1v1 Arena Duel Launch"
          data-testid="arena-voice-duel-modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(2, 6, 23, 0.76)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowVoiceDuelModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 460,
              background: 'var(--bg2)',
              border: '1.5px solid rgba(99, 102, 241, 0.5)',
              borderRadius: 20,
              padding: 26,
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🎙️ Voice Launch Ready
              </span>
              <button
                type="button"
                onClick={() => setShowVoiceDuelModal(false)}
                aria-label="Close modal"
                style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900, color: 'var(--t1)' }}>
              Enter Rated 1v1 Code Wars Duel?
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--t2)' }}>
              Difficulty calibrated to <strong>{studentKnowledge.recommendedDifficulty || 'basic'}</strong> (ELO {eloRating}). Entry stake is <strong>10 Pins</strong> (your balance: <strong>{pins} Pins</strong>).
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowVoiceDuelModal(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg3)',
                  color: 'var(--t2)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid="arena-voice-confirm-duel-btn"
                disabled={isStartingSolo}
                onClick={() => {
                  setShowVoiceDuelModal(false);
                  void handleStartSoloSparring();
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: isStartingSolo ? 'not-allowed' : 'pointer',
                }}
              >
                {isStartingSolo ? 'PREPARING MATCH…' : '⚔️ Enter the Ring (10 Pins)'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ArenaPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--t2)' }}>Loading Arena Combat Center...</div>}>
      <ArenaContent />
    </Suspense>
  );
}
