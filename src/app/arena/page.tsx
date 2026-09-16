'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
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

function ArenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get('tab') as 'all' | 'code_wars' | 'hackathons' | 'viva') || 'all';
  const roomQueryCode = searchParams?.get('room');

  const { user } = useAuth();
  const studentId = user?.id || 'student_' + Math.random().toString(36).substring(2, 8);
  const studentName = (user as any)?.full_name || (user as any)?.name || 'Combatant';
  const studentAvatar = (user as any)?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
  
  const cOS = useCareerOS();
  const { xp = 0, pins = 0 } = cOS || {};

  const [activeTab, setActiveTab] = useState<'all' | 'code_wars' | 'hackathons' | 'viva'>(initialTab);

  // Sync tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && ['all', 'code_wars', 'hackathons', 'viva'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Code Wars & PvP State
  const [problems] = useState<CodeWarsProblem[]>(CODE_WARS_PROBLEMS_CATALOG);
  const [selectedProblemId, setSelectedProblemId] = useState<string>(problems[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'basic' | 'intermediate' | 'advanced' | 'production'>('intermediate');
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<number>(600); // 10 minutes

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

  const [recentMatches, setRecentMatches] = useState<BattleMatch[]>([]);
  const [showCodeInspect, setShowCodeInspect] = useState<boolean>(false);

  // Determine current active problem
  const activeProblem = problems.find(p => p.id === (activeRoom?.problemId || soloMatch?.problemId || selectedProblemId)) || problems[0];

  // Auto-join if room query parameter is present in URL
  useEffect(() => {
    if (roomQueryCode && !activeRoom) {
      setActiveTab('code_wars');
      setRoomInputCode(roomQueryCode.toUpperCase());
      handleJoinRoom(roomQueryCode.toUpperCase());
    }
  }, [roomQueryCode]);

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

  // Load starter code on problem or language change
  useEffect(() => {
    if (activeProblem && activeProblem.starterCode) {
      setCode(activeProblem.starterCode[language] || activeProblem.starterCode.typescript || '// Write solution here');
    }
  }, [activeProblem, language]);

  // Battle Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const isGameActive = (activeRoom && activeRoom.status === 'in_progress') || (soloMatch && soloMatch.status === 'active');

    if (isGameActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });

        // AI opponent simulation for solo mode
        if (soloMatch && soloMatch.status === 'active' && soloMatch.opponent) {
          setSoloMatch(curr => {
            if (!curr || !curr.opponent) return curr;
            const burst = Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 1 : 0;
            const nextPct = Math.min(96, curr.opponent.progressPct + burst);
            return {
              ...curr,
              opponent: {
                ...curr.opponent,
                progressPct: nextPct,
                timeElapsedSeconds: curr.opponent.timeElapsedSeconds + 1,
              }
            };
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeRoom?.status, soloMatch?.status, timeRemaining]);

  // Matchmaking Queue Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isQueueing) {
      timer = setInterval(async () => {
        setQueueSeconds(s => s + 1);

        // Poll matchmaker every 3s
        try {
          const res = await ArenaPvPService.matchmake({
            studentId,
            studentName,
            studentAvatar,
            difficulty: selectedDifficulty,
            defaultProblemId: selectedProblemId,
          });

          if (res.matched && res.room) {
            setIsQueueing(false);
            setQueueSeconds(0);
            setActiveRoom(res.room);
            setTimeRemaining(res.room.timeLimitSeconds || 600);
          }
        } catch (err) {
          console.warn('Matchmaking poll error:', err);
        }
      }, 3000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isQueueing, selectedDifficulty, selectedProblemId, studentId, studentName, studentAvatar]);

  // Handle Create Room
  const handleCreateRoom = async () => {
    try {
      setIsCreatingRoom(true);
      setRoomError(null);
      const room = await ArenaPvPService.createRoom({
        hostId: studentId,
        hostName: studentName,
        hostAvatar: studentAvatar,
        problemId: selectedProblemId,
        difficulty: selectedDifficulty,
        timeLimitSeconds: selectedTimeLimit,
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

  // Run Tests (local verification & broadcast progress)
  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      const result = await CodeWarsApiService.submitSolution({
        matchId: activeRoom?.id || soloMatch?.id || 'test_run',
        studentId,
        code,
        language,
        timeSpentSeconds: (activeRoom?.timeLimitSeconds || 600) - timeRemaining,
      });
      setTestResult(result);

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

  // Submit Final Solution
  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    try {
      const result = await CodeWarsApiService.submitSolution({
        matchId: activeRoom?.id || soloMatch?.id || 'submit_run',
        studentId,
        code,
        language,
        timeSpentSeconds: (activeRoom?.timeLimitSeconds || 600) - timeRemaining,
      });
      setTestResult(result);

      if (activeRoom) {
        const updated = await ArenaPvPService.submitSolution({
          roomCode: activeRoom.roomCode,
          playerId: studentId,
          passed: result.passed,
          testsPassed: result.testsPassed,
          totalTests: result.totalTests,
          score: result.score,
          code,
        });
        setActiveRoom(updated);

        // If victorious, grant reward and trigger flying pins
        if (result.passed) {
          triggerPinStream({ count: 20 });
          if (cOS?.addXp) cOS.addXp(activeProblem.xpReward || 200, '1v1 Arena Duel Victory');
        }
      } else if (soloMatch) {
        setSoloMatch(prev => prev ? { ...prev, status: result.passed ? 'victory' : 'defeat' } : null);
        if (result.passed) {
          triggerPinStream({ count: 12 });
          if (cOS?.addXp) cOS.addXp(activeProblem.xpReward || 150, 'Code Wars Victory');
        }
      }
    } catch (err: any) {
      alert('Submission error: ' + err.message);
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

  // Copy shareable invite link
  const copyInviteLink = () => {
    if (!activeRoom) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://present-career-os.vercel.app';
    const link = `${origin}/arena?tab=code_wars&room=${activeRoom.roomCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Start Solo Sparring against Turing AI
  const handleStartSoloSparring = () => {
    setIsQueueing(false);
    const match = CodeWarsApiService.startMatch(studentId, activeProblem.id, '1v1_duel');
    setSoloMatch(match);
    setTimeRemaining(activeProblem.timeLimitSeconds);
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

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', minHeight: '85vh' }}>
      
      {/* ── Combat Header ────────────────────────────────────────── */}
      <div style={{
        padding: '24px 32px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        marginBottom: 24,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>⚔️</span>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', margin: 0, letterSpacing: '-0.5px' }}>
              Challenging Arena & Combat Center
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--t2)', fontSize: 14, maxWidth: 680, lineHeight: 1.5 }}>
            Put your engineering capabilities to the test. Compete in real-time 1v1 PvP algorithmic code battles,
            create private battle rooms to challenge friends, or defend your architecture in AI viva drills.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            padding: '10px 18px',
            borderRadius: 12,
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#f59e0b', fontWeight: 700 }}>Arena XP</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24' }}>{xp.toLocaleString()}</div>
            </div>
          </div>

          <div style={{
            padding: '10px 18px',
            borderRadius: 12,
            background: 'rgba(234, 179, 8, 0.12)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>🪙</span>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#eab308', fontWeight: 700 }}>Combat Pins</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fef08a' }}>{pins.toLocaleString()}</div>
            </div>
          </div>

          <Link
            href="/leaderboard?tab=code_wars"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>🏆</span> Leaderboard
          </Link>
        </div>
      </div>

      {/* ── Arena Navigation Tabs ─────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--border)',
        paddingBottom: 16,
        marginBottom: 24,
        overflowX: 'auto'
      }}>
        {[
          { id: 'all', label: 'All Combat Modes', icon: '🌟', badge: 'Overview' },
          { id: 'code_wars', label: '1v1 Code Wars', icon: '⚔️', badge: 'Live PvP Arena' },
          { id: 'hackathons', label: 'Hackathon Squads', icon: '🚀', badge: 'Squad Collab' },
          { id: 'viva', label: 'AI STAR Viva Defenses', icon: '🎙️', badge: 'Live Voice' },
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
                padding: '10px 18px',
                borderRadius: 10,
                background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                border: isSelected ? '1px solid var(--accent)' : '1px solid transparent',
                color: isSelected ? 'var(--t1)' : 'var(--t2)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: 14,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 20,
                background: isSelected ? 'rgba(99, 102, 241, 0.3)' : 'var(--bg3)',
                color: isSelected ? '#a5b4fc' : 'var(--t3)',
                fontWeight: 600,
              }}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────── */}
      {activeTab === 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Card 1: 1v1 Code Wars */}
          <div style={{
            padding: 24,
            borderRadius: 16,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>⚔️</span>
                <span style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: 12, fontWeight: 700 }}>
                  1v1 PvP ARENA
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                Algorithmic Code Wars
              </h3>
              <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
                Compete against rival engineers in real-time matchmaking or invite your friends to a private duel room.
                Solve complex algorithmic challenges, optimize time complexity, and climb the global ELO ladder.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Real 1v1 PvP</span>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Create Room & Invite</span>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Elo Ratings</span>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Live Code Runner</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('code_wars')}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)'
              }}
            >
              <span>⚔️</span> Open 1v1 Code Wars Arena →
            </button>
          </div>

          {/* Card 2: Hackathon Squads */}
          <div style={{
            padding: 24,
            borderRadius: 16,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>🚀</span>
                <span style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', fontSize: 12, fontWeight: 700 }}>
                  SQUAD COLLABORATION
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                Hackathon Squads & Team Hub
              </h3>
              <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
                Assemble high-performance 3-person squads with Frontend, Backend, and AI Lead roles. Build production-grade capstone products and submit to corporate bounties.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Role Slot Allocation</span>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Milestone Tracker</span>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Team Chat</span>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Industry Bounties</span>
              </div>
            </div>
            <Link
              href="/projects"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.35)'
              }}
            >
              <span>👥</span> Enter Squads & Projects →
            </Link>
          </div>

          {/* Card 3: AI STAR Viva */}
          <div style={{
            padding: 24,
            borderRadius: 16,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>🎙️</span>
                <span style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: 12, fontWeight: 700 }}>
                  LIVE AI DEFENSE
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                AI STAR Mock Interview Viva
              </h3>
              <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
                Face off against strict corporate AI recruiters with full voice-to-voice interaction. Defend your code, build architecture canvases, and answer high-pressure STAR behavioral drills.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ STAR Methodology</span>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ System Design Canvas</span>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Live Voice STT/TTS</span>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)' }}>✔ Recruiter Personas</span>
              </div>
            </div>
            <Link
              href="/interview"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
              }}
            >
              <span>🎤</span> Start AI Mock Interview →
            </Link>
          </div>
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
                  padding: 24,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)',
                  border: isQueueing ? '1.5px solid #6366f1' : '1px solid var(--border)',
                  boxShadow: isQueueing ? '0 0 24px rgba(99, 102, 241, 0.25)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 28 }}>⚡</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', background: 'rgba(99, 102, 241, 0.15)', padding: '4px 10px', borderRadius: 20 }}>
                        REAL-TIME MATCHMAKING
                      </span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                      1v1 Quick Match
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
                      Queue up to battle a live engineer on campus or globally. Tests run concurrently in real-time.
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
                        <label style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Difficulty Preference</label>
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
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="basic">Basic (Entry Level Algorithms)</option>
                          <option value="intermediate">Intermediate (Trees, HashMaps, Two Pointers)</option>
                          <option value="advanced">Advanced (DP, Graph Traversal, Deadlocks)</option>
                          <option value="production">Production (High Concurrency & B-Trees)</option>
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
                        fontSize: 14,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel Search
                    </button>
                  ) : (
                    <button
                      onClick={() => {
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
                        fontSize: 14,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)'
                      }}
                    >
                      <span>⚡</span> Find 1v1 Opponent
                    </button>
                  )}
                </div>

                {/* Mode B: Create Custom Battle Room */}
                <div style={{
                  padding: 24,
                  borderRadius: 16,
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 28 }}>🏰</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: 20 }}>
                        PRIVATE INVITE
                      </span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                      Create Private Room
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
                      Host a private duel, choose problem difficulty & time limit, and share an invite code/link with friends.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Challenge</label>
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
                            fontSize: 12,
                            fontWeight: 600
                          }}
                        >
                          {problems.map(p => (
                            <option key={p.id} value={p.id}>{p.title.slice(0, 22)}...</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Time Limit</label>
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
                            fontSize: 12,
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
                      fontSize: 14,
                      border: 'none',
                      cursor: isCreatingRoom ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <span>➕</span> {isCreatingRoom ? 'Generating Room...' : 'Create Room & Invite'}
                  </button>
                </div>

                {/* Mode C: Join Room via Code */}
                <div style={{
                  padding: 24,
                  borderRadius: 16,
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 28 }}>🔑</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#f472b6', background: 'rgba(244, 114, 182, 0.15)', padding: '4px 10px', borderRadius: 20 }}>
                        ENTER CODE
                      </span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                      Join Friend's Room
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
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
                          fontSize: 15,
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
                      fontSize: 14,
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
                    <span>🚀</span> {isJoiningRoom ? 'Connecting...' : 'Join Battle Room'}
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
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <span>⚠️</span> {roomError}
                </div>
              )}

              {/* Problem Selection & Solo Practice Catalog */}
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', margin: 0 }}>
                    🎯 Algorithmic Challenges Catalog
                  </h3>
                  <span style={{ fontSize: 13, color: 'var(--t3)' }}>Select a problem to review or practice solo</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
                  {problems.map(p => {
                    const isSelected = p.id === selectedProblemId;
                    const diffColors = {
                      basic: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#34d399' },
                      intermediate: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fbbf24' },
                      advanced: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#f87171' },
                      production: { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', text: '#c084fc' },
                    };
                    const dc = diffColors[p.difficulty] || diffColors.intermediate;

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProblemId(p.id)}
                        style={{
                          padding: 18,
                          borderRadius: 14,
                          background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg2)',
                          border: isSelected ? '1.5px solid #6366f1' : '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: 6,
                              background: dc.bg,
                              border: `1px solid ${dc.border}`,
                              color: dc.text,
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              {p.difficulty}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>⏱️ {Math.round(p.timeLimitSeconds / 60)} mins</span>
                          </div>

                          <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>
                            {p.title}
                          </h4>
                          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {p.description}
                          </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                          <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>+{p.xpReward} XP</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProblemId(p.id);
                              handleStartSoloSparring();
                            }}
                            style={{
                              padding: '6px 12px',
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
                            <span>🤖</span> Solo Spar
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Room Header & Invite Code Bar */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 13, textTransform: 'uppercase', color: '#818cf8', fontWeight: 800, letterSpacing: '1px', marginBottom: 6 }}>
                  Private Battle Room
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 18px', borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: 12 }}>
                  <span style={{ fontSize: 18, fontFamily: 'monospace', fontWeight: 800, color: '#c7d2fe', letterSpacing: '2px' }}>
                    {activeRoom.roomCode}
                  </span>
                  <button
                    onClick={copyInviteLink}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: copiedLink ? '#10b981' : '#4f46e5',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {copiedLink ? '✔ Copied Link!' : 'Copy Invite Link'}
                  </button>
                </div>
                <p style={{ margin: 0, color: 'var(--t2)', fontSize: 14 }}>
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
                  <div style={{ position: 'absolute', top: 12, left: 12, padding: '2px 8px', borderRadius: 6, background: '#f59e0b', color: '#000', fontSize: 10, fontWeight: 800 }}>
                    👑 HOST
                  </div>
                  <img
                    src={activeRoom.hostAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt="Host"
                    style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #6366f1', margin: '0 auto 12px', objectFit: 'cover' }}
                  />
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', margin: '0 0 6px' }}>
                    {activeRoom.hostName}
                  </h4>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    background: activeRoom.hostReady ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: activeRoom.hostReady ? '#10b981' : '#f87171'
                  }}>
                    {activeRoom.hostReady ? '✔ READY' : '⏳ NOT READY'}
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
                    fontSize: 16,
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
                      <div style={{ position: 'absolute', top: 12, left: 12, padding: '2px 8px', borderRadius: 6, background: '#6366f1', color: '#fff', fontSize: 10, fontWeight: 800 }}>
                        ⚔️ CHALLENGER
                      </div>
                      <img
                        src={activeRoom.guestAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                        alt="Challenger"
                        style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #10b981', margin: '0 auto 12px', objectFit: 'cover' }}
                      />
                      <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', margin: '0 0 6px' }}>
                        {activeRoom.guestName}
                      </h4>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        background: activeRoom.guestReady ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: activeRoom.guestReady ? '#10b981' : '#f87171'
                      }}>
                        {activeRoom.guestReady ? '✔ READY' : '⏳ NOT READY'}
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '20px 0' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }} className="animate-pulse">📡</div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t2)', margin: '0 0 6px' }}>
                        Waiting for Friend...
                      </h4>
                      <p style={{ fontSize: 12, color: 'var(--t3)', margin: 0 }}>
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
                    fontSize: 14,
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
                    fontSize: 15,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isMyReady ? '0 4px 16px rgba(16, 185, 129, 0.4)' : '0 4px 16px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  {isMyReady ? '✔ You Are Ready (Click to Cancel)' : '🔥 Ready to Battle'}
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: LIVE COMBAT BATTLE VIEW (In progress or completed) */}
          {((activeRoom && activeRoom.status !== 'waiting') || soloMatch) && (
            <div>
              {/* Top Combat Battle Bar (You vs Rival) */}
              <div style={{
                padding: '14px 20px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 20
              }}>
                {/* Left: You Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260 }}>
                  <img
                    src={studentAvatar}
                    alt="You"
                    style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #6366f1', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{studentName} (You)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <div style={{
                        width: 120,
                        height: 8,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(100, ((testResult?.testsPassed || myProgress?.testsPassed || 0) / (activeProblem.testCases.length || 5)) * 100)}%`,
                          height: '100%',
                          background: '#10b981',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>
                        {testResult?.testsPassed || myProgress?.testsPassed || 0}/{activeProblem.testCases.length} Tests
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Countdown Timer */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    padding: '8px 20px',
                    borderRadius: 12,
                    background: timeRemaining < 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                    border: timeRemaining < 60 ? '1px solid #ef4444' : '1px solid rgba(99, 102, 241, 0.4)',
                    color: timeRemaining < 60 ? '#ef4444' : '#fbbf24',
                    fontWeight: 800,
                    fontSize: 20,
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    boxShadow: timeRemaining < 60 ? '0 0 16px rgba(239, 68, 68, 0.4)' : 'none'
                  }}>
                    ⏱️ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                {/* Right: Opponent Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260, justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>
                      {activeRoom ? opponentName : (soloMatch?.opponent?.name || 'Turing AI')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#f87171' }}>
                        {activeRoom ? `${opponentProgress?.testsPassed || 0}/${activeProblem.testCases.length} Tests` : `${Math.round(soloMatch?.opponent?.progressPct || 0)}% Completed`}
                      </span>
                      <div style={{
                        width: 120,
                        height: 8,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.1)',
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
                  <img
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
                      fontSize: 12,
                      textTransform: 'uppercase'
                    }}>
                      {activeProblem.difficulty}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--t3)' }}>XP Reward: +{activeProblem.xpReward}</span>
                  </div>

                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', margin: '0 0 12px' }}>
                    {activeProblem.title}
                  </h2>

                  <div style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 20 }}>
                    {activeProblem.description}
                  </div>

                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>Test Cases</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activeProblem.testCases.map((tc, idx) => (
                      <div key={idx} style={{ padding: 12, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12 }}>
                        <div style={{ color: 'var(--t3)', marginBottom: 4 }}>Example {idx + 1}:</div>
                        <div><strong style={{ color: 'var(--t2)' }}>Input:</strong> <code style={{ color: '#818cf8' }}>{tc.input}</code></div>
                        <div style={{ marginTop: 2 }}><strong style={{ color: 'var(--t2)' }}>Expected:</strong> <code style={{ color: '#34d399' }}>{tc.expectedOutput}</code></div>
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
                      <span style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600 }}>Language:</span>
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value as any)}
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
                    </div>

                    <button
                      onClick={() => setCode(activeProblem.starterCode[language] || activeProblem.starterCode.typescript || '')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--t3)',
                        fontSize: 12,
                        cursor: 'pointer'
                      }}
                    >
                      Reset Starter Code
                    </button>
                  </div>

                  {/* Code Textarea */}
                  <div style={{ position: 'relative', height: '360px' }}>
                    <textarea
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: 16,
                        borderRadius: 12,
                        background: '#0d1117',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#c9d1d9',
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: 14,
                        lineHeight: 1.5,
                        resize: 'none',
                        outline: 'none',
                      }}
                      placeholder="// Write your solution here..."
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
                        <span style={{ fontWeight: 700, fontSize: 13, color: testResult.passed ? '#34d399' : '#f87171' }}>
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
                        fontSize: 13,
                        cursor: 'pointer'
                      }}
                    >
                      Forfeit Match
                    </button>

                    <button
                      onClick={handleRunTests}
                      disabled={Boolean(isRunningTests || isSubmitting || isMatchOver)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: isRunningTests || isMatchOver ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>▶️</span> {isRunningTests ? 'Running...' : 'Run Tests'}
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
                        fontSize: 13,
                        border: 'none',
                        cursor: isSubmitting || isMatchOver ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <span>🚀</span> {isSubmitting ? 'Submitting...' : 'Submit Solution'}
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
                    <div style={{ fontSize: 56, marginBottom: 12 }}>
                      {didIWin ? '🏆' : '💀'}
                    </div>

                    <h2 style={{ fontSize: 28, fontWeight: 800, color: didIWin ? '#34d399' : '#f87171', margin: '0 0 8px' }}>
                      {didIWin ? 'VICTORY!' : 'DEFEAT'}
                    </h2>

                    <p style={{ color: 'var(--t2)', fontSize: 15, margin: '0 0 24px' }}>
                      {didIWin
                        ? 'Sensational performance! You conquered the algorithmic duel.'
                        : 'Hard-fought match. Review your test logs and run it back.'}
                    </p>

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
                        <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>ELO RATING</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: didIWin ? '#34d399' : '#f87171' }}>
                          {didIWin ? '+25' : '-10'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>ARENA XP</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24' }}>
                          +{didIWin ? activeProblem.xpReward || 200 : 25}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>COMBAT PINS</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#fef08a' }}>
                          +{didIWin ? 20 : 5}
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
                          fontSize: 14,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <span>📊</span> Compare Code Solutions
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
                          fontSize: 14,
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
                            fontSize: 14,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          ⚔️ Play Another Duel
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
