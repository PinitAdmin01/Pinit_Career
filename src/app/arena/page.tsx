'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
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
import ArenaMatchmakingRadar from '@/components/pins/ArenaMatchmakingRadar';
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

function ArenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get('tab') as 'code_wars' | 'hackathons' | 'viva') || 'code_wars';
  const roomQueryCode = searchParams?.get('room');

  const { user, refresh } = useAuth();
  const studentId = user?.id || 'student_' + Math.random().toString(36).substring(2, 8);
  const studentName = (user as any)?.full_name || (user as any)?.name || 'Combatant';
  const studentAvatar = (user as any)?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
  
  const cOS = useCareerOS();
  const { xp = 0, pins = 0 } = cOS || {};

  // Live ELO state with instant cache hydration (Baseline 100)
  const [liveElo, setLiveElo] = useState<number | null>(null);
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
  }, []);

  // Solo Sparring Match Settlement Reward State
  const [soloReward, setSoloReward] = useState<{
    eloDelta: number;
    newElo: number;
    xpAwarded: number;
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

  // Elo Tier & Progress Calculation (100-baseline Esports ladder: +20 on win, -20 on loss)
  const eloTier = React.useMemo(() => {
    if (eloRating >= 500) return { name: 'Grandmaster Apex', icon: '👑', base: 500, target: 700, next: 'Legendary' };
    if (eloRating >= 400) return { name: 'Diamond Apex', icon: '💎', base: 400, target: 500, next: 'Grandmaster' };
    if (eloRating >= 280) return { name: 'Platinum Vanguard', icon: '🛡️', base: 280, target: 400, next: 'Diamond' };
    if (eloRating >= 200) return { name: 'Gold Architect', icon: '⚔️', base: 200, target: 280, next: 'Platinum' };
    if (eloRating >= 140) return { name: 'Silver Tactician', icon: '⚡', base: 140, target: 200, next: 'Gold' };
    return { name: 'Bronze Cadet', icon: '🔰', base: 100, target: 140, next: 'Silver' };
  }, [eloRating]);
  const eloProgressPct = Math.min(100, Math.max(5, Math.round(((eloRating - eloTier.base) / (eloTier.target - eloTier.base)) * 100)));

  // Combat Precision & Win Ratio (Real match evidence)
  const totalBattles = recentMatches.length;
  const winsCount = recentMatches.filter(m => m.status === 'victory').length;
  const winRatePct = totalBattles > 0 ? Math.round((winsCount / totalBattles) * 100) : 0;

  const [activeTab, setActiveTab] = useState<'code_wars' | 'hackathons' | 'viva'>(initialTab);

  // Sync tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && ['code_wars', 'hackathons', 'viva'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Code Wars & PvP State
  const [problems] = useState<CodeWarsProblem[]>(CODE_WARS_PROBLEMS_CATALOG);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('auto');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'basic' | 'intermediate' | 'advanced' | 'production'>('intermediate');
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
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Matchmaking Queue State
  const [isQueueing, setIsQueueing] = useState<boolean>(false);
  const [queueSeconds, setQueueSeconds] = useState<number>(0);

  // Countdown before battle start (3.. 2.. 1.. FIGHT!)
  const [countdown, setCountdown] = useState<number | null>(null);

  // Solo battle fallback match
  const [soloMatch, setSoloMatch] = useState<BattleMatch | null>(null);

  // In-battle state
  const [language, setLanguage] = useState<'typescript' | 'python' | 'java'>('typescript');
  const [code, setCode] = useState<string>('');
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

  // Determine current active problem
  const activeProblem = problems.find(p => p.id === (activeRoom?.problemId || soloMatch?.problemId || (selectedProblemId !== 'auto' ? selectedProblemId : ''))) || problems[0];

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

  // Synchronize player editor language to active room slot when entering match
  useEffect(() => {
    if (!activeRoom) return;
    const isHost = activeRoom.hostId === studentId;
    const isGuest = activeRoom.guestId === studentId || activeRoom.guestId === `${studentId}_challenger`;
    const targetSlotLang = isHost
      ? activeRoom.hostLanguage
      : isGuest
      ? activeRoom.guestLanguage
      : undefined;

    if (targetSlotLang && (targetSlotLang === 'python' || targetSlotLang === 'typescript' || targetSlotLang === 'java')) {
      if (language !== targetSlotLang) {
        setLanguage(targetSlotLang as 'python' | 'typescript' | 'java');
      }
    }
  }, [activeRoom?.hostId, activeRoom?.guestId, activeRoom?.hostLanguage, activeRoom?.guestLanguage, studentId, language]);

  // Load starter code on problem or language change
  useEffect(() => {
    if (activeProblem && activeProblem.starterCode) {
      setCode(activeProblem.starterCode[language] || activeProblem.starterCode.typescript || '// Write solution here');
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

  // Matchmaking Queue Timer (Fast 1s Clock + 2s Polling Cadence for Fast Pairing)
  useEffect(() => {
    if (!isQueueing) return;

    let isSubscribed = true;

    // 1. Precise 1-second clock timer for visual radar feedback
    const clockInterval = setInterval(() => {
      setQueueSeconds(s => s + 1);
    }, 1000);

    // 2. Immediate poll on start
    const pollMatchmaker = async () => {
      if (!isSubscribed) return;
      try {
        const studentCompletedQuests: string[] = (Array.isArray(cOS?.completedQuests) && cOS.completedQuests.length > 0)
          ? cOS.completedQuests
          : (Array.isArray((user as any)?.completed_quests)
            ? (user as any).completed_quests
            : (Array.isArray((user as any)?.completedQuests)
              ? (user as any).completedQuests
              : []));

        const res = await ArenaPvPService.matchmake({
          studentId,
          studentName,
          studentAvatar,
          difficulty: selectedDifficulty,
          defaultProblemId: selectedProblemId,
          preferredLanguage: language,
          completedQuests: studentCompletedQuests,
          recentProblemIds: Array.from(solvedProblemIds),
        });

        if (res.matched && res.room && isSubscribed) {
          setIsQueueing(false);
          setQueueSeconds(0);
          setActiveRoom(res.room);
          setTimeRemaining(res.room.timeLimitSeconds || 600);
        }
      } catch (err) {
        console.warn('Matchmaking poll error:', err);
      }
    };

    pollMatchmaker();

    // 3. Fast 2-second polling cadence for instantaneous pairing
    const pollInterval = setInterval(pollMatchmaker, 2000);

    return () => {
      isSubscribed = false;
      clearInterval(clockInterval);
      clearInterval(pollInterval);
    };
  }, [isQueueing, selectedDifficulty, selectedProblemId, studentId, studentName, studentAvatar, language, solvedProblemIds, cOS?.completedQuests, user]);

  // Handle Create Room
  const handleCreateRoom = async () => {
    try {
      if (cOS?.spendPins) {
        const ok = await cOS.spendPins('code_arena', undefined, 'Create Battle Room');
        if (!ok) return;
      }
      setIsCreatingRoom(true);
      setRoomError(null);

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
        difficulty: selectedDifficulty,
        timeLimitSeconds: selectedTimeLimit,
        completedQuests: studentCompletedQuests,
        recentProblemIds: Array.from(solvedProblemIds),
      });
      setActiveRoom(room);
      setTimeRemaining(room.timeLimitSeconds);
      setIsCreatingRoom(false);
    } catch (err: any) {
      setIsCreatingRoom(false);
      setRoomError(err.message || 'Failed to create room');
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
        if (result.passed) {
          const isFirstClear = !solvedProblemIds.has(activeProblem.id);
          if (isFirstClear) {
            triggerPinStream({ count: 12 });
            if (result.xpAwarded && cOS?.applyServerXp) cOS.applyServerXp(result.newXp, result.xpAwarded, 'Code Wars Victory (First Clear)');
            setSolvedProblemIds(prev => {
              const next = new Set(prev).add(activeProblem.id);
              try {
                localStorage.setItem(`pinit_arena_solved_${studentId}`, JSON.stringify(Array.from(next)));
              } catch {}
              return next;
            });
          }
        }
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
  const handleStartSoloSparring = (overrideDifficulty?: 'basic' | 'intermediate' | 'advanced') => {
    setIsQueueing(false);
    setSoloReward(null);
    const targetDiff = overrideDifficulty || (studentKnowledge.recommendedDifficulty as any) || 'basic';
    const candidateProblems = problems.filter(p => p.difficulty === targetDiff);
    const unvisited = candidateProblems.filter(p => !solvedProblemIds.has(p.id));
    const pool = unvisited.length > 0 ? unvisited : candidateProblems;
    const chosenProblem = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : problems[0];

    setSelectedProblemId(chosenProblem.id);
    const match = CodeWarsApiService.startMatch(studentId, chosenProblem.id, '1v1_duel');
    setSoloMatch(match);
    setTimeRemaining(chosenProblem.timeLimitSeconds);
    setTestResult(null);
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
  const isHost = activeRoom?.hostId === studentId;
  const isGuest = activeRoom?.guestId === studentId;
  const myProgress = isHost ? activeRoom?.hostProgress : activeRoom?.guestProgress;
  const opponentProgress = isHost ? activeRoom?.guestProgress : activeRoom?.hostProgress;
  const opponentName = isHost ? (activeRoom?.guestName || 'Waiting for challenger...') : activeRoom?.hostName;
  const opponentAvatar = isHost ? (activeRoom?.guestAvatar || '') : activeRoom?.hostAvatar;
  const isMyReady = isHost ? activeRoom?.hostReady : activeRoom?.guestReady;
  const isOpponentReady = isHost ? activeRoom?.guestReady : activeRoom?.hostReady;

  const isMatchOver = Boolean((activeRoom && activeRoom.status === 'completed') || (soloMatch && soloMatch.status !== 'active'));
  const didIWin = activeRoom ? activeRoom.winnerId === studentId : soloMatch?.status === 'victory';

  // Audio Fanfare & Report on Match Conclusion
  const matchOverSoundPlayedRef = useRef<boolean>(false);
  useEffect(() => {
    if (isMatchOver && !matchOverSoundPlayedRef.current) {
      matchOverSoundPlayedRef.current = true;
      if (didIWin) {
        BattleAudio.playVictory();
      } else {
        BattleAudio.playDefeat();
      }
      setShowBattleReport(true);
    }
    if (!isMatchOver) {
      matchOverSoundPlayedRef.current = false;
    }
  }, [isMatchOver, didIWin]);

  // Synchronize recentMatches on match completion
  useEffect(() => {
    if (!isMatchOver) return;
    const updated = CodeWarsApiService.getStudentMatches(studentId);
    if (updated && updated.length > 0) {
      setRecentMatches(updated);
    }
  }, [isMatchOver, studentId]);

  // Synchronize match XP & rewards to student profile upon match conclusion
  const awardAppliedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isMatchOver || !activeRoom) return;
    const matchKey = `${activeRoom.roomCode}:${activeRoom.winnerId}`;
    if (awardAppliedRef.current === matchKey) return;
    awardAppliedRef.current = matchKey;

    const myAwardXp = isHost ? (activeRoom as any)?.hostXpAward : (activeRoom as any)?.guestXpAward;
    const xpToAdd = typeof myAwardXp === 'number' ? myAwardXp : (didIWin ? 50 : 15);
    cOS.addXp(xpToAdd, didIWin ? '1v1 Code War Victory' : '1v1 Code War Match Effort');
  }, [isMatchOver, activeRoom, isHost, didIWin, cOS]);

  // Synchronize 1v1 Room match completion to client state
  const roomSettledRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isMatchOver || !activeRoom || activeRoom.status !== 'completed') return;
    const roomKey = `${activeRoom.roomCode}:${activeRoom.winnerId}:${activeRoom.hostNewElo}`;
    if (roomSettledRef.current === roomKey) return;
    roomSettledRef.current = roomKey;

    const myNewElo = isHost ? activeRoom.hostNewElo : activeRoom.guestNewElo;
    const myXpAward = isHost ? activeRoom.hostXpAward : activeRoom.guestXpAward;
    if (typeof myNewElo === 'number' && myNewElo > 0) {
      setLiveElo(myNewElo);
      try {
        localStorage.setItem(`pinit_user_elo_${studentId}`, String(myNewElo));
      } catch {}
      if (typeof window !== 'undefined') {
        const currentWeeklyXp = Number((user as any)?.weekly_xp) || 0;
        const currentTotalXp = Number((user as any)?.xp_total) || xp || 0;
        const addXp = typeof myXpAward === 'number' && myXpAward > 0 ? myXpAward : 0;
        window.dispatchEvent(new CustomEvent('pinit:user_profile_updated', {
          detail: {
            arena_elo: myNewElo,
            elo: myNewElo,
            weekly_xp: currentWeeklyXp + addXp,
            weeklyXp: currentWeeklyXp + addXp,
            xp_total: currentTotalXp + addXp,
            totalXp: currentTotalXp + addXp,
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
    const settleKey = `${soloMatch.id}:${soloMatch.status}`;
    if (soloSettledRef.current === settleKey) return;
    soloSettledRef.current = settleKey;

    const isWin = soloMatch.status === 'victory';
    fetch('/api/arena/settle-solo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: activeProblem.id,
        passed: isWin,
        timeSpentSeconds: (activeProblem.timeLimitSeconds || 600) - timeRemaining,
      }),
    })
      .then(async res => {
        if (!res.ok) return;
        const data = await res.json();
        setSoloReward({
          eloDelta: data.eloDelta,
          newElo: data.newElo,
          xpAwarded: data.xpAwarded,
          pinsAwarded: data.pinsAwarded,
        });
        setLiveElo(data.newElo);
        try {
          localStorage.setItem(`pinit_user_elo_${studentId}`, String(data.newElo));
        } catch {}
        if (data.xpAwarded && cOS?.addXp) {
          cOS.addXp(data.xpAwarded, isWin ? 'Turing AI Sparring Victory (+20 ELO)' : 'Turing AI Sparring Match');
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('pinit:user_profile_updated', {
            detail: {
              arena_elo: data.newElo,
              elo: data.newElo,
              weekly_xp: data.newWeeklyXp,
              weeklyXp: data.newWeeklyXp,
              xp_total: data.newXp,
              totalXp: data.newXp,
            }
          }));
        }
        if (refresh) refresh().catch(() => {});
      })
      .catch(err => {
        console.warn('[Arena Solo Effect] Settle failed:', err);
      });
  }, [isMatchOver, soloMatch, activeProblem.id, timeRemaining, studentId, cOS, refresh]);

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', minHeight: '85vh', paddingBottom: 40 }}>
      
      {/* ── Arena Navigation Tabs (Sleek Glass Segmented Bar) ───────────────────── */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '6px',
        borderRadius: 14,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        marginBottom: 24,
        marginTop: 4,
        overflowX: 'auto',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.04))'
      }}>
        {[
          { id: 'code_wars', label: '1v1 Code Wars', badge: 'Live PvP Arena' },
          { id: 'hackathons', label: 'Hackathon Squads', badge: 'Squad Collab' },
          { id: 'viva', label: 'AI STAR Viva Defenses', badge: 'Live Voice' },
        ].map(tab => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                router.push(`/arena?tab=${tab.id}`, { scroll: false });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                background: isSelected ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
                border: isSelected ? '1px solid var(--accent)' : '1px solid transparent',
                color: isSelected ? 'var(--t1)' : 'var(--t2)',
                fontWeight: isSelected ? 800 : 600,
                fontSize: 14.5,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: 11.5,
                padding: '2px 8px',
                borderRadius: 20,
                background: isSelected ? 'rgba(99, 102, 241, 0.3)' : 'var(--bg3)',
                color: isSelected ? '#a5b4fc' : 'var(--t3)',
                fontWeight: 700,
              }}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content (Frosted Glass Squad / Viva Overview Cards) ── */}
      {(activeTab === 'hackathons' || activeTab === 'viva') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Card 2: Hackathon Squads */}
          {activeTab === 'hackathons' && (
          <div style={{
            padding: '28px 26px',
            borderRadius: 20,
            background: 'var(--card)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.06))',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            {/* Ambient Purple Accent Glow */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 160,
              height: 160,
              background: 'radial-gradient(circle at top right, rgba(168, 85, 247, 0.12), transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  color: '#c084fc',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 6px #a855f7' }} />
                  SQUAD COLLABORATION
                </span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 10, letterSpacing: '-0.3px' }}>
                Squad Collaboration &amp; Projects
              </h3>
              <p style={{ color: 'var(--t2)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 20 }}>
                Collaborate on production-grade capstone products in the Projects hub. Form multi-disciplinary teams with Frontend, Backend, and AI roles to build portfolio-grade software.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                <span style={{ padding: '6px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t2)', fontWeight: 600 }}>✔ Role Slot Allocation</span>
                <span style={{ padding: '6px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t2)', fontWeight: 600 }}>✔ Milestone Tracker</span>
                <span style={{ padding: '6px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t2)', fontWeight: 600 }}>✔ GitHub Workspaces</span>
                <span style={{ padding: '6px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t2)', fontWeight: 600 }}>✔ Portfolio Capstones</span>
              </div>
            </div>
            <Link
              href="/projects"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 15.5,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(168, 85, 247, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              Enter Squads &amp; Projects →
            </Link>
          </div>
          )}

          {/* Card 3: AI STAR Viva */}
          {activeTab === 'viva' && (
          <div style={{
            padding: '28px 26px',
            borderRadius: 20,
            background: 'var(--card)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.06))',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            {/* Ambient Blue Accent Glow */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 160,
              height: 160,
              background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: '#60a5fa',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
                  LIVE AI DEFENSE
                </span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 10, letterSpacing: '-0.3px' }}>
                AI STAR Mock Interview Viva
              </h3>
              <p style={{ color: 'var(--t2)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 20 }}>
                Face off against strict corporate AI recruiters with full voice-to-voice interaction. Defend your code, build architecture canvases, and answer high-pressure STAR behavioral drills.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                <span style={{ padding: '6px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t2)', fontWeight: 600 }}>✔ STAR Methodology</span>
                <span style={{ padding: '6px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t2)', fontWeight: 600 }}>✔ System Design Canvas</span>
                <span style={{ padding: '6px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t2)', fontWeight: 600 }}>✔ Live Voice STT/TTS</span>
                <span style={{ padding: '6px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t2)', fontWeight: 600 }}>✔ Recruiter Personas</span>
              </div>
            </div>
            <Link
              href="/interview"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 15.5,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              Start AI Mock Interview →
            </Link>
          </div>
          )}
        </div>
      )}

      {/* ── 1v1 CODE WARS TAB ──────────────────────────────────── */}
      {activeTab === 'code_wars' && (
        <div>
          {/* STATE 1: LOBBY (No active battle or room) */}
          {!activeRoom && !soloMatch && (
            <div>
              {/* Top Quick Actions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 32 }}>
                
                {/* Mode A: 1v1 Quick Matchmaking */}
                <div style={{
                  padding: '28px 24px',
                  borderRadius: 20,
                  background: 'var(--card)',
                  backdropFilter: 'blur(16px)',
                  border: isQueueing ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                  boxShadow: isQueueing ? '0 0 28px rgba(99, 102, 241, 0.3)' : 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.06))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        color: '#818cf8',
                        background: 'rgba(99, 102, 241, 0.12)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        padding: '4px 12px',
                        borderRadius: 20
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 6px #818cf8' }} />
                        TURING AI SPARRING &amp; DUELS
                      </span>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                      1v1 Algorithmic Duel
                    </h3>
                    <p style={{ fontSize: 14.5, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
                      Queue up to spar against the Turing Benchmark AI or share room links for live peer battles.
                    </p>

                    {isQueueing ? (
                      <div style={{ marginBottom: 16 }}>
                        <ArenaMatchmakingRadar
                          isQueueing={isQueueing}
                          queueSeconds={queueSeconds}
                          onSwitchToAiSparring={handleStartSoloSparring}
                          studentPins={pins}
                        />
                      </div>
                    ) : (
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Difficulty Preference</label>
                        <select
                          value={selectedDifficulty}
                          onChange={(e: any) => setSelectedDifficulty(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 10,
                            background: 'var(--bg3)',
                            border: '1px solid var(--border)',
                            color: 'var(--t1)',
                            fontSize: 14.5,
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="basic">Basic (Entry Level Algorithms)</option>
                          <option value="intermediate">Intermediate (Trees, HashMaps, Two Pointers)</option>
                          <option value="advanced">Advanced (DP, Graph Traversal, Deadlocks)</option>
                          <option value="production">Production (High Concurrency &amp; B-Trees)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {isQueueing ? (
                    <button
                      onClick={() => {
                        setIsQueueing(false);
                        ArenaPvPService.matchmake({ studentId, studentName, action: 'cancel' });
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 10,
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        fontWeight: 700,
                        fontSize: 15.5,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel Search
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        if (cOS?.spendPins) {
                          const ok = await cOS.spendPins('code_arena', undefined, 'Code Arena 1v1 Battle');
                          if (!ok) return;
                        }
                        setIsQueueing(true);
                        setQueueSeconds(0);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 15.5,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)'
                      }}
                    >
                      Find 1v1 Opponent (10 Pins)
                    </button>
                  )}
                </div>

                {/* Mode B: Create Custom Battle Room */}
                <div style={{
                  padding: '28px 24px',
                  borderRadius: 20,
                  background: 'var(--card)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.06))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
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
                        PRIVATE INVITE
                      </span>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                      Create Private Room
                    </h3>
                    <p style={{ fontSize: 14.5, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
                      Host a private duel, choose problem difficulty & time limit, and share an invite code/link with friends.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Challenge Caliber</label>
                        <select
                          value={selectedProblemId}
                          onChange={e => setSelectedProblemId(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: 8,
                            background: 'var(--bg3)',
                            border: '1px solid var(--border)',
                            color: 'var(--t1)',
                            fontSize: 13,
                            fontWeight: 600
                          }}
                        >
                          <option value="auto">🎯 Auto-Calibrated (Shared Knowledge Edge)</option>
                          <option value="tier_basic">🟢 Novice Foundations (Days 1–15)</option>
                          <option value="tier_intermediate">🟡 Apprentice Structures (Days 16–30)</option>
                          <option value="tier_advanced">🔴 Master Algorithms (Days 31–60)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Time Limit</label>
                        <select
                          value={selectedTimeLimit}
                          onChange={e => setSelectedTimeLimit(Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: 8,
                            background: 'var(--bg3)',
                            border: '1px solid var(--border)',
                            color: 'var(--t1)',
                            fontSize: 13,
                            fontWeight: 600
                          }}
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
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 15.5,
                      border: 'none',
                      cursor: isCreatingRoom ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    {isCreatingRoom ? 'Generating Room...' : 'Create Room & Invite (10 Pins)'}
                  </button>
                </div>

                {/* Mode C: Join Room via Code */}
                <div style={{
                  padding: '28px 24px',
                  borderRadius: 20,
                  background: 'var(--card)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.06))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
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
                        ENTER CODE
                      </span>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                      Join Friend's Room
                    </h3>
                    <p style={{ fontSize: 14.5, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
                      Have an invite code from a friend? Enter it below to immediately jump into their lobby.
                    </p>

                    <div style={{ marginBottom: 16 }}>
                      <input
                        type="text"
                        value={roomInputCode}
                        onChange={e => setRoomInputCode(e.target.value.toUpperCase())}
                        placeholder="e.g. ARENA-8F2A"
                        maxLength={12}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: 10,
                          background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          color: 'var(--t1)',
                          fontSize: 16.5,
                          fontWeight: 700,
                          textAlign: 'center',
                          letterSpacing: '2px',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinRoom()}
                    disabled={isJoiningRoom || !roomInputCode.trim()}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 15.5,
                      border: 'none',
                      cursor: isJoiningRoom || !roomInputCode.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      opacity: !roomInputCode.trim() ? 0.6 : 1,
                      boxShadow: '0 4px 12px rgba(236, 72, 153, 0.35)'
                    }}
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

              {/* Task 14: Knowledge Calibration Banner */}
              <div style={{
                marginTop: 24,
                marginBottom: 20,
                padding: '16px 20px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 28 }}>🎯</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>
                      Knowledge-Calibrated Arena: <span style={{ color: '#818cf8' }}>{studentKnowledge.tierLabel}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 2 }}>
                      Knowledge Score: <strong style={{ color: 'var(--t2)' }}>{studentKnowledge.score}/100</strong> (Quests: {studentKnowledge.questMasteryScore}/35 · Elo: {studentKnowledge.eloMasteryScore}/30 · Diagnostic: {studentKnowledge.diagnosticScore}/20 · Activity: {studentKnowledge.consistencyScore}/15)
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: '#10b981', color: '#fff', textTransform: 'uppercase' }}>
                    Calibrated: {studentKnowledge.recommendedDifficulty}
                  </span>
                </div>
              </div>

              {/* ARENA COMPETITIVE INTELLIGENCE & LEAGUE LADDER HUB */}
              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* 1. Competitive League Divisions Ladder */}
                <div style={{
                  padding: 24,
                  borderRadius: 18,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.04))',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>
                          Competitive Division Ladder
                        </h3>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: 'rgba(99, 102, 241, 0.12)',
                          color: '#6366f1',
                          fontSize: 11.5,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}>
                          Live Elo Ranks
                        </span>
                      </div>
                      <p style={{ fontSize: 13.5, color: 'var(--t3)', margin: '4px 0 0' }}>
                        Climb through algorithmic leagues. Opponents and challenges are auto-calibrated to your verified learning edge.
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 16px',
                      borderRadius: 12,
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 24 }}>{eloTier.icon}</div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700 }}>Your Division</div>
                        <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>{eloTier.name} ({eloRating} Elo)</div>
                      </div>
                    </div>
                  </div>

                  {/* Division Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                    {[
                      { name: 'Bronze Cadet', range: '100 - 139', icon: '🔰', badge: 'Tier 1 Foundations', color: '#cd7f32', isCurrent: eloRating < 140, syllabus: 'Variables, Pointers & Array Scans' },
                      { name: 'Silver Tactician', range: '140 - 199', icon: '⚡', badge: 'Tier 1+ Linear DS', color: '#94a3b8', isCurrent: eloRating >= 140 && eloRating < 200, syllabus: 'Hash Maps, Two Pointers & Freq Tables' },
                      { name: 'Gold Architect', range: '200 - 279', icon: '⚔️', badge: 'Tier 2 Intermediate', color: '#f59e0b', isCurrent: eloRating >= 200 && eloRating < 280, syllabus: 'Stacks, Windows & Greedy Intervals' },
                      { name: 'Platinum Vanguard', range: '280 - 399', icon: '🛡️', badge: 'Tier 2+ Algorithms', color: '#38bdf8', isCurrent: eloRating >= 280 && eloRating < 400, syllabus: 'Binary Search, Binary Trees & DFS/BFS' },
                      { name: 'Diamond Apex', range: '400 - 499', icon: '💎', badge: 'Tier 3 Master', color: '#a855f7', isCurrent: eloRating >= 400 && eloRating < 500, syllabus: 'Dynamic Programming & Graph Traversal' },
                      { name: 'Grandmaster Apex', range: '500+', icon: '👑', badge: 'Tier 3+ Systems', color: '#ec4899', isCurrent: eloRating >= 500, syllabus: 'Concurrency, Deadlock Locks & B-Trees' },
                    ].map((div) => (
                      <div
                        key={div.name}
                        style={{
                          padding: '14px 12px',
                          borderRadius: 12,
                          background: div.isCurrent ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg2)',
                          border: div.isCurrent ? `2px solid ${div.color}` : '1px solid var(--border)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {div.isCurrent && (
                          <span style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            fontSize: 9.5,
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: div.color,
                            color: '#fff',
                            textTransform: 'uppercase',
                          }}>
                            Active
                          </span>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 20 }}>{div.icon}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{div.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>{div.range} Elo</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.3, marginTop: 2 }}>
                          {div.syllabus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Combat Intelligence & Mystery AI Sparring Hub */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  {/* Calibrated AI Sparring Launcher */}
                  <div style={{
                    padding: 24,
                    borderRadius: 18,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#818cf8',
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}>
                          AI Turing Combatant
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--t3)' }}>Zero-Wait Sparring</span>
                      </div>
                      <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 6px' }}>
                        Calibrated AI Sparring Duel
                      </h4>
                      <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.5, margin: '0 0 16px' }}>
                        Face a virtual bot calibrated to your exact Elo rating and knowledge edge. A fresh, unseen problem is drawn at battle start with full slow-reader hints.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleStartSoloSparring()}
                        style={{
                          flex: 1,
                          minWidth: 160,
                          padding: '12px 18px',
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 14,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                        }}
                      >
                        <span>⚔️</span>
                        <span>Start Auto-Calibrated Spar</span>
                      </button>

                      <button
                        onClick={() => handleStartSoloSparring('basic')}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 12,
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          color: 'var(--t1)',
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                        title="Practice Foundational Problems (Days 1–15)"
                      >
                        🟢 Novice
                      </button>

                      <button
                        onClick={() => handleStartSoloSparring('intermediate')}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 12,
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          color: 'var(--t1)',
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                        title="Practice Intermediate Structures (Days 16–30)"
                      >
                        🟡 Apprentice
                      </button>

                      <button
                        onClick={() => handleStartSoloSparring('advanced')}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 12,
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          color: 'var(--t1)',
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                        title="Practice Master Algorithms (Days 31–60)"
                      >
                        🔴 Master
                      </button>
                    </div>
                  </div>

                  {/* Combatant Knowledge & Security Dossier */}
                  <div style={{
                    padding: 24,
                    borderRadius: 18,
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}>
                          Curriculum Integrity
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--t3)' }}>Anti-Cheat Protocol</span>
                      </div>
                      <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 6px' }}>
                        Knowledge Affinity & Polyglot Engine
                      </h4>
                      <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.5, margin: '0 0 14px' }}>
                        Questions remain strictly concealed until match start to preserve competitive integrity. Both combatants receive the identical real-world problem evaluated across Python 3.11 and TypeScript runtimes.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                      <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#6366f1' }}>{CODE_WARS_PROBLEMS_CATALOG.length}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>Active Challenges</div>
                      </div>
                      <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>2</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>Polyglot Runtimes</div>
                      </div>
                      <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{solvedProblemIds.size}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>Cleared by You</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                      ⚡ First Blood: +25 XP / +5 Elo
                    </span>
                    <span style={{ fontSize: 12, padding: '4px 9px', borderRadius: 6, background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#6366f1', fontWeight: 700 }}>
                      🛡️ Anti-Spam: 3.0s Tactical Cooldown
                    </span>
                    <span style={{ fontSize: 12, padding: '4px 9px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#059669', fontWeight: 700 }}>
                      🎯 Clean Code: +15 XP (1st Attempt)
                    </span>
                    {timeRemaining <= 90 && (
                      <span style={{ fontSize: 12, padding: '4px 9px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.18)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: 800 }}>
                        🔥 Surge Active (+15% Clutch)
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowRulesDrawer(true)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>📜</span> Battle Rulebook
                </button>
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

              {/* Top Combat Battle Bar (You vs Rival) */}
              <div style={{
                padding: '14px 20px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 20
              }}>
                {/* Left: You Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260 }}>
                  <Image
                    width={44}
                    height={44}
                    src={studentAvatar}
                    alt="You"
                    style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #6366f1', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--t1)' }}>{studentName} (You)</span>
                      <span style={{
                        fontSize: 11,
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: language === 'python' ? '#3b82f6' : '#6366f1',
                        color: '#fff',
                        fontWeight: 800,
                        letterSpacing: '0.5px'
                      }}>
                        {language === 'python' ? '🐍 PY' : '⚡ TS'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <div style={{
                        width: 120,
                        height: 8,
                        borderRadius: 4,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(100, ((testResult?.testsPassed || myProgress?.testsPassed || 0) / (activeProblem.testCases.length || 5)) * 100)}%`,
                          height: '100%',
                          background: '#10b981',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green, #059669)' }}>
                        {testResult?.testsPassed || myProgress?.testsPassed || 0}/{activeProblem.testCases.length} Tests
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Countdown Timer & Sync Indicator */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginBottom: 4
                  }}>
                    <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                    Peer Synced ({activeProblem.testCases.length} Tests)
                  </div>
                  <div style={{
                    padding: '8px 20px',
                    borderRadius: 12,
                    background: timeRemaining < 60 ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg2)',
                    border: timeRemaining < 60 ? '1px solid #ef4444' : '1px solid var(--border)',
                    color: timeRemaining < 60 ? '#ef4444' : 'var(--accent)',
                    fontWeight: 800,
                    fontSize: 22,
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    boxShadow: timeRemaining < 60 ? '0 0 16px rgba(239, 68, 68, 0.4)' : 'none'
                  }}>
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                {/* Right: Opponent Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260, justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <span style={{
                        fontSize: 11,
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: (isHost ? activeRoom?.guestLanguage : activeRoom?.hostLanguage) === 'python' ? '#3b82f6' : '#6366f1',
                        color: '#fff',
                        fontWeight: 800,
                        letterSpacing: '0.5px'
                      }}>
                        {(isHost ? activeRoom?.guestLanguage : activeRoom?.hostLanguage) === 'python' ? '🐍 PY' : '⚡ TS'}
                      </span>
                      <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--t1)' }}>
                        {activeRoom ? opponentName : (soloMatch?.opponent?.name || 'Turing AI')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--red, #dc2626)' }}>
                        {activeRoom ? `${opponentProgress?.testsPassed || 0}/${activeProblem.testCases.length} Tests` : `${Math.round(soloMatch?.opponent?.progressPct || 0)}% Completed`}
                      </span>
                      <div style={{
                        width: 120,
                        height: 8,
                        borderRadius: 4,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: activeRoom
                            ? `${Math.min(100, ((opponentProgress?.testsPassed || 0) / (activeProblem.testCases.length || 5)) * 100)}%`
                            : `${soloMatch?.opponent?.progressPct || 0}%`,
                          height: '100%',
                          background: '#ef4444',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                  <Image
                    width={44}
                    height={44}
                    src={activeRoom ? (opponentAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80') : (soloMatch?.opponent?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80')}
                    alt="Rival"
                    style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #ef4444', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Battle Workstation: Split view problem and code editor */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20 }}>
                {/* Left: Problem Details */}
                <div style={{
                  padding: 24,
                  borderRadius: 16,
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  height: '620px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      fontWeight: 700,
                      fontSize: 13,
                      textTransform: 'uppercase'
                    }}>
                      {activeProblem.difficulty}
                    </span>
                    <span style={{ fontSize: 13, color: solvedProblemIds.has(activeProblem.id) ? '#34d399' : 'var(--t3)' }}>
                      {solvedProblemIds.has(activeProblem.id) ? '✓ Cleared (+0 Practice XP)' : `XP Reward: +${activeProblem.xpReward}`}
                    </span>
                  </div>

                  <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px' }}>
                    {activeProblem.title}
                  </h2>

                  {/* Topic Tags & Target Complexity Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {activeProblem.tags?.map(tag => (
                      <span key={tag} style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#818cf8',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                      }}>
                        {tag}
                      </span>
                    ))}
                    {activeProblem.complexityTarget && (
                      <span style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                      }}>
                        🎯 {activeProblem.complexityTarget}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 15.5, color: 'var(--t2)', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 18 }}>
                    {activeProblem.description}
                  </div>

                  {/* Slow Reader Strategy Blueprint */}
                  {activeProblem.hint && (
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'rgba(59, 130, 246, 0.08)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      marginBottom: 18,
                      fontSize: 13.5,
                      lineHeight: 1.5,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#60a5fa', marginBottom: 4 }}>
                        <span>💡</span>
                        <span>Slow Reader Strategy Blueprint:</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--t2)', fontSize: 13 }}>
                        {activeProblem.hint}
                      </p>
                    </div>
                  )}

                  <h4 style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>Test Cases</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activeProblem.testCases.map((tc, idx) => (
                      <div key={idx} style={{ padding: 12, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 13 }}>
                        <div style={{ color: 'var(--t3)', marginBottom: 4 }}>Example {idx + 1}:</div>
                        <div><strong style={{ color: 'var(--t2)' }}>Input:</strong> <code style={{ color: '#818cf8' }}>{tc.input}</code></div>
                        <div style={{ marginTop: 2 }}><strong style={{ color: 'var(--t2)' }}>Expected:</strong> <code style={{ color: 'var(--green, #059669)' }}>{tc.expectedOutput}</code></div>
                        {tc.explanation && (
                          <div style={{ marginTop: 4, color: 'var(--t3)', fontSize: 12, fontStyle: 'italic' }}>
                            Why: {tc.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Code Editor & Test Console */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Editor Header */}
                  <div style={{
                    padding: '10px 16px',
                    borderRadius: 12,
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14.5, color: 'var(--t3)', fontWeight: 600 }}>Language:</span>
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value as any)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          color: 'var(--t1)',
                          fontSize: 14.5,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setCode(activeProblem.starterCode[language] || activeProblem.starterCode.typescript || '')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--t3)',
                        fontSize: 13,
                        cursor: 'pointer'
                      }}
                    >
                      Reset Starter Code
                    </button>
                  </div>

                  {/* Monaco Code Editor */}
                  <div style={{ position: 'relative', height: '360px', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <MonacoEditor
                      height="100%"
                      language={language === 'python' ? 'python' : language === 'java' ? 'java' : 'typescript'}
                      theme="vs-dark"
                      value={code}
                      onChange={(val) => setCode(val || '')}
                      options={{
                        fontSize: 15,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        tabSize: 2,
                        automaticLayout: true,
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      }}
                    />
                  </div>

                  {/* Console / Test Runner Output */}
                  {testResult && (
                    <div style={{
                      padding: 14,
                      borderRadius: 12,
                      background: testResult.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: testResult.passed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      maxHeight: 130,
                      overflowY: 'auto'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 14.5, color: testResult.passed ? '#34d399' : '#f87171' }}>
                          {testResult.passed ? '✔ All Test Cases Passed!' : '✖ Tests Failed'}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--t3)' }}>
                          Score: {testResult.score}% ({testResult.testsPassed}/{testResult.totalTests})
                        </span>
                      </div>
                      <pre style={{ margin: 0, fontSize: 13, color: 'var(--t2)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {testResult.logs}
                      </pre>
                    </div>
                  )}

                  {/* Battle Controls */}
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
                    <button
                      onClick={handleLeaveRoom}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 10,
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        fontWeight: 600,
                        fontSize: 14.5,
                        cursor: 'pointer'
                      }}
                    >
                      Forfeit Match
                    </button>

                    <button
                      onClick={handleRunTests}
                      disabled={Boolean(isRunningTests || isSubmitting || isMatchOver || runCooldownRemaining > 0)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        background: runCooldownRemaining > 0 ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg3)',
                        border: runCooldownRemaining > 0 ? '1.5px solid #6366f1' : '1px solid var(--border)',
                        color: runCooldownRemaining > 0 ? '#818cf8' : 'var(--t1)',
                        fontWeight: 700,
                        fontSize: 14.5,
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
                          <span>▶️</span> {isRunningTests ? 'Running...' : 'Run Tests'}
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSubmitSolution}
                      disabled={Boolean(isSubmitting || isRunningTests || isMatchOver)}
                      style={{
                        padding: '10px 26px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14.5,
                        border: 'none',
                        cursor: isSubmitting || isMatchOver ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Solution'}
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
                    border: didIWin ? '2px solid #10b981' : '2px solid #ef4444',
                    textAlign: 'center',
                    boxShadow: didIWin ? '0 0 50px rgba(16, 185, 129, 0.3)' : '0 0 50px rgba(239, 68, 68, 0.3)',
                    animation: 'goldImpactShockwave 0.5s ease'
                  }}>
                    <div style={{ fontSize: 61.5, marginBottom: 12 }}>
                      {didIWin ? '✓' : '✗'}
                    </div>

                    <h2 style={{ fontSize: 31, fontWeight: 800, color: didIWin ? '#34d399' : '#f87171', margin: '0 0 8px' }}>
                      {didIWin ? 'VICTORY!' : 'DEFEAT'}
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
                      ⚔️ Decision: {activeRoom?.tieBreakerReason || (didIWin ? 'Flawless Test Suite Clear' : 'Match Concluded')}
                    </div>

                    <p style={{ color: 'var(--t2)', fontSize: 15.5, margin: '0 0 20px' }}>
                      {didIWin
                        ? 'Sensational performance! You conquered the algorithmic duel under official Arena rules.'
                        : "Hard-fought match. Review your test logs, inspect your rival's approach, and run it back."}
                    </p>

                    {/* Combat Honor Badges */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {activeRoom?.firstBloodClaimedBy === studentId && (
                        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.18)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: 800 }}>
                          🩸 First Blood Winner (+25 XP / +5 Elo)
                        </span>
                      )}
                      {didIWin && submissionAttempts <= 1 && failedAttempts === 0 && (
                        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.18)', border: '1px solid #10b981', color: '#10b981', fontWeight: 800 }}>
                          🎯 Clean First-Pass Architecture (+15 XP)
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
                        <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>ELO RATING</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: didIWin ? '#34d399' : '#f87171' }}>
                          {(() => {
                            if (activeRoom) {
                              const delta = isHost ? (activeRoom as any)?.hostEloDelta : (activeRoom as any)?.guestEloDelta;
                              if (typeof delta === 'number') {
                                return delta >= 0 ? `+${delta}` : `${delta}`;
                              }
                            }
                            if (soloReward) {
                              return soloReward.eloDelta >= 0 ? `+${soloReward.eloDelta}` : `${soloReward.eloDelta}`;
                            }
                            return didIWin ? '+20' : '-20';
                          })()}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                          {soloReward?.newElo ? `New Rating: ${soloReward.newElo}` : (activeRoom ? `Rating: ${isHost ? (activeRoom as any)?.hostNewElo || 120 : (activeRoom as any)?.guestNewElo || 80}` : (didIWin ? 'New: 120' : 'New: 80'))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>ARENA XP</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>
                          +{(() => {
                            if (activeRoom) {
                              const awardXp = isHost ? (activeRoom as any)?.hostXpAward : (activeRoom as any)?.guestXpAward;
                              if (typeof awardXp === 'number') return awardXp;
                            }
                            if (soloReward) {
                              return soloReward.xpAwarded;
                            }
                            return didIWin ? (activeProblem?.xpReward || 50) : 15;
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

      {/* ── BOTTOM COMBAT MASTERY & TELEMETRY DOCK (Screenshot 2 Relocated + 2 Progress Bars) ── */}
      <div
        data-testid="arena-bottom-telemetry-dock"
        style={{
          marginTop: 40,
          padding: '26px 30px',
          borderRadius: 20,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.06))',
          backdropFilter: 'blur(16px)'
        }}
      >
        {/* Top row: Title + Screenshot 2 Components (Arena XP, Combat Pins, Leaderboard) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            paddingBottom: 20,
            borderBottom: '1px solid var(--border)',
            marginBottom: 20
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>⚔️</span>
              <h2 style={{ fontSize: 19, fontWeight: 900, color: 'var(--t1)', margin: 0, letterSpacing: '-0.3px' }}>
                Combat Mastery &amp; Season Telemetry
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--t3)' }}>
              Real-time calibration of your competitive rating, win precision, and combat pin reserves.
            </p>
          </div>

          {/* Screenshot 2 Components: Arena XP, Combat Pins, Leaderboard */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div
              style={{
                padding: '9px 18px',
                borderRadius: 12,
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <div>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', color: 'var(--amber-dark, #b45309)', fontWeight: 800, letterSpacing: '0.04em' }}>
                  Arena XP
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)' }}>
                  {xp.toLocaleString()}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '9px 18px',
                borderRadius: 12,
                background: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <div>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', color: 'var(--t2)', fontWeight: 800, letterSpacing: '0.04em' }}>
                  Pins Balance
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)' }}>
                  {pins.toLocaleString()}
                </div>
              </div>
            </div>

            <Link
              href="/leaderboard?mode=weekly_leagues"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 20px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 14.5,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              <span>🏆</span>
              <span>Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* 2 Dynamic Progress Bars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Progress Bar 1: Arena Elo Tier & Advancement */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              background: 'var(--bg2)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{eloTier.icon}</span>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>
                  Tier: {eloTier.name}
                </span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>
                {eloRating} / {eloTier.target} ELO
              </span>
            </div>

            {/* Glowing Gradient Bar */}
            <div
              style={{
                width: '100%',
                height: 10,
                borderRadius: 10,
                background: 'var(--bg3)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: `${eloProgressPct}%`,
                  height: '100%',
                  borderRadius: 10,
                  background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)',
                  boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, color: 'var(--t3)' }}>
              <span>Base Floor: {eloTier.base} ELO</span>
              <span>{eloProgressPct}% to {eloTier.next}</span>
            </div>
          </div>

          {/* Progress Bar 2: Combat Precision & Win Ratio */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              background: 'var(--bg2)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🎯</span>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>
                  Combat Precision &amp; Win Rate
                </span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                {totalBattles > 0 ? `${winRatePct}% Win Ratio` : 'Placement Phase'}
              </span>
            </div>

            {/* Dual-tone Precision Bar */}
            <div
              style={{
                width: '100%',
                height: 10,
                borderRadius: 10,
                background: 'var(--bg3)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: `${totalBattles > 0 ? Math.max(6, winRatePct) : 0}%`,
                  height: '100%',
                  borderRadius: 10,
                  background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, color: 'var(--t3)' }}>
              <span>{totalBattles > 0 ? `${winsCount} Victories • ${totalBattles - winsCount} Defeats` : '0 battles recorded'}</span>
              <span>{totalBattles > 0 ? `${totalBattles} Total Duels` : 'Play a 1v1 match to calibrate'}</span>
            </div>
          </div>
        </div>
      </div>

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
                  PinIT Code War Official Rulebook
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
              The PinIT Code War Arena operates under strict competitive engineering standards to promote clean code, anti-cheat integrity, and high-intensity problem solving.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>⚡</span>
                  <strong style={{ color: '#f59e0b', fontSize: 14.5 }}>Rule 1: First Blood & Blitz Speed</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  The first combatant to pass 100% of test cases immediately wins the match and claims the First Blood bonus: <strong>+25 Bonus XP</strong> and <strong>+5 Bonus Elo</strong>.
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
                  <strong style={{ color: '#10b981', fontSize: 14.5 }}>Rule 3: Clean Execution Bonus</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  Submitting a solution that passes on the 1st attempt with 0 failed runs awards the <strong>+15 XP Clean Architecture Bonus</strong>. Each failed final submission deducts 30 Battle Points.
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>🔥</span>
                  <strong style={{ color: '#ef4444', fontSize: 14.5 }}>Rule 4: Pressure Surge Protocol (&lt;90s)</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  When the battle clock drops below 90 seconds, the chamber triggers Surge Mode. All test cases cleared during Surge grant a <strong>+15% Clutch Point Multiplier</strong>.
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
                  <strong style={{ color: '#a855f7', fontSize: 14.5 }}>Rule 6: Rating Safety Floor</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
                  Students are protected by a minimum rating floor of <strong>100 Elo</strong>. You will never drop below the cadet baseline regardless of match outcomes.
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
