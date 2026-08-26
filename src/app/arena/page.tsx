'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import {
  CodeWarsApiService,
  CodeWarsProblem,
  BattleMatch,
  CODE_WARS_PROBLEMS_CATALOG
} from '@/lib/api/codeWarsApi';

function ArenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') as 'all' | 'code_wars' | 'hackathons' | 'viva' || 'all';

  const { user } = useAuth();
  const studentId = user?.id || 'demo_student_01';
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

  // Code Wars state
  const [problems] = useState<CodeWarsProblem[]>(CODE_WARS_PROBLEMS_CATALOG);
  const [selectedProblemId, setSelectedProblemId] = useState<string>(problems[0].id);
  const [selectedMode, setSelectedMode] = useState<BattleMatch['mode']>('1v1_duel');
  const [activeMatch, setActiveMatch] = useState<BattleMatch | null>(null);

  const [language, setLanguage] = useState<'typescript' | 'python' | 'java'>('typescript');
  const [code, setCode] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(300);
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProblem = problems.find(p => p.id === selectedProblemId) || problems[0];

  useEffect(() => {
    setRecentMatches(CodeWarsApiService.getStudentMatches(studentId));
  }, [studentId]);

  useEffect(() => {
    if (activeMatch && activeMatch.status === 'active') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });

        // Simulate live opponent progress in 1v1 duel
        if (activeMatch.mode === '1v1_duel' && activeMatch.opponent) {
          setActiveMatch(curr => {
            if (!curr || !curr.opponent) return curr;
            const newPct = Math.min(95, curr.opponent.progressPct + Math.floor(Math.random() * 4));
            return {
              ...curr,
              opponent: {
                ...curr.opponent,
                progressPct: newPct,
              }
            };
          });
        }
      }, 1000);
      timerRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [activeMatch?.id, activeMatch?.status]);

  const handleStartBattle = () => {
    const match = CodeWarsApiService.startMatch(studentId, activeProblem.id, selectedMode);
    setActiveMatch(match);
    setCode(activeProblem.starterCode[language] || activeProblem.starterCode.typescript);
    setTimeRemaining(activeProblem.timeLimitSeconds);
    setTestResult(null);
  };

  const handleTimeout = async () => {
    if (!activeMatch) return;
    setIsSubmitting(true);
    const result = await CodeWarsApiService.submitSolution({
      matchId: activeMatch.id,
      studentId,
      code,
      language,
      timeSpentSeconds: activeProblem.timeLimitSeconds,
    });
    setTestResult(result);
    setActiveMatch(prev => prev ? { ...prev, status: 'timeout' } : null);
    setIsSubmitting(false);
    setRecentMatches(CodeWarsApiService.getStudentMatches(studentId));
  };

  const handleSubmitSolution = async () => {
    if (!activeMatch || isSubmitting) return;
    setIsSubmitting(true);
    const timeSpent = activeProblem.timeLimitSeconds - timeRemaining;
    try {
      const result = await CodeWarsApiService.submitSolution({
        matchId: activeMatch.id,
        studentId,
        code,
        language,
        timeSpentSeconds: timeSpent,
      });
      setTestResult(result);
      setActiveMatch(prev => prev ? { ...prev, status: result.passed ? 'victory' : 'defeat' } : null);
      if (result.passed && cOS?.addXp) {
        cOS.addXp(activeProblem.xpReward || 150, 'Code Wars Battle Victory');
      }
      setRecentMatches(CodeWarsApiService.getStudentMatches(studentId));
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 60px' }}>
      
      {/* Header Banner */}
      <div style={{
        padding: '24px 28px',
        borderRadius: 20,
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(236,72,153,0.08))',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>⚔️</span>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', margin: 0 }}>
              Challenging Arena & Combat Center
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--t2)', maxWidth: 680, lineHeight: 1.5 }}>
            Put your verified engineering capabilities to the test. Compete in 1v1 PvP algorithmic code battles, join multi-disciplinary hackathon squads, or defend your architecture in AI STAR mock interview vivas.
          </p>
        </div>

        {/* User Arena Telemetry */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Arena XP</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-mono)' }}>⚡ {xp}</div>
          </div>
          <div style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: '#eab308', textTransform: 'uppercase' }}>Combat Pins</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-mono)' }}>🪙 {pins}</div>
          </div>
          <Link
            href="/leaderboard"
            style={{
              padding: '10px 18px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 12.5,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            🏆 Leaderboard
          </Link>
        </div>
      </div>

      {/* Arena Navigation Filter */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '6px',
        borderRadius: 14,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        marginBottom: 24,
        overflowX: 'auto'
      }}>
        {[
          { id: 'all', label: '🌟 All Combat Modes', count: 'Overview' },
          { id: 'code_wars', label: '⚔️ 1v1 Code Wars', count: 'Live PvP Arena' },
          { id: 'hackathons', label: '🚀 Hackathon Squads', count: 'Squad Collab' },
          { id: 'viva', label: '🎙️ AI STAR Viva Defenses', count: 'Live Voice' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (activeMatch && activeMatch.status !== 'active') {
                setActiveMatch(null);
              }
            }}
            style={{
              flex: 1,
              minWidth: 160,
              padding: '10px 14px',
              borderRadius: 10,
              border: activeTab === tab.id ? '1.5px solid var(--accent)' : '1px solid transparent',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(168,85,247,0.15))'
                : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--t2)',
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s'
            }}
          >
            <span>{tab.label}</span>
            <span style={{ fontSize: 10, opacity: 0.8, padding: '2px 6px', borderRadius: 6, background: 'rgba(255,255,255,0.08)' }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── TAB 1: ALL MODES OVERVIEW ────────────────────────────────────────── */}
      {activeTab === 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          
          {/* 1. Code Wars Launcher Card */}
          <div style={{
            padding: 24,
            borderRadius: 18,
            background: 'var(--bg2)',
            border: '1.5px solid rgba(239,68,68,0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>⚔️</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', padding: '3px 10px', borderRadius: 8 }}>
                  1v1 PVP ARENA
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px' }}>
                Algorithmic Code Wars
              </h3>
              <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, margin: 0 }}>
                Compete against rival engineers in real-time matchmaking. Solve complex algorithmic challenges, optimize time complexity, and climb the global ELO ladder.
              </p>

              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Live Sandboxed Tests', 'Elo Ratings', 'Anti-Cheat Guards', 'Multi-Language'].map((tag) => (
                  <span key={tag} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t2)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6 }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('code_wars')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
                transition: 'transform 0.15s'
              }}
            >
              ⚔️ Open 1v1 Code Wars Arena ➔
            </button>
          </div>

          {/* 2. Hackathon Teams Launcher Card */}
          <div style={{
            padding: 24,
            borderRadius: 18,
            background: 'var(--bg2)',
            border: '1.5px solid rgba(168,85,247,0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>🚀</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#a855f7', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', padding: '3px 10px', borderRadius: 8 }}>
                  SQUAD COLLABORATION
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px' }}>
                Hackathon Squads & Team Hub
              </h3>
              <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, margin: 0 }}>
                Assemble high-performance 3-person squads with Frontend, Backend, and AI Lead roles. Build production-grade capstone products and submit to corporate bounties.
              </p>

              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Role Slot Allocation', 'Milestone Tracker', 'Team Chat', 'Industry Bounties'].map((tag) => (
                  <span key={tag} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t2)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6 }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/projects?tab=squads"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 13,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(168,85,247,0.3)',
                transition: 'transform 0.15s'
              }}
            >
              👥 Enter Squads & Projects ➔
            </Link>
          </div>

          {/* 3. AI Mock Interview Viva Defenses */}
          <div style={{
            padding: 24,
            borderRadius: 18,
            background: 'var(--bg2)',
            border: '1.5px solid rgba(59,130,246,0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>🎙️</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#3b82f6', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', padding: '3px 10px', borderRadius: 8 }}>
                  LIVE AI DEFENSE
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px' }}>
                AI STAR Mock Interview Viva
              </h3>
              <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, margin: 0 }}>
                Face off against strict corporate AI recruiters with full voice-to-voice interaction. Defend your code, build architecture canvases, and answer high-pressure STAR behavioral drills.
              </p>

              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['STAR Methodology', 'System Design Canvas', 'Live Voice STT/TTS', 'Recruiter Personas'].map((tag) => (
                  <span key={tag} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t2)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6 }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/interview"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 13,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                transition: 'transform 0.15s'
              }}
            >
              🎤 Start AI Mock Interview Viva ➔
            </Link>
          </div>

        </div>
      )}

      {/* ── TAB 2: LIVE 1V1 CODE WARS ARENA (INTEGRATED) ────────────────────── */}
      {activeTab === 'code_wars' && (
        <div>
          {!activeMatch || activeMatch.status !== 'active' ? (
            /* Lobby & Problem Selection View */
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🎯</span> Select Arena Challenge
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {problems.map(problem => {
                    const isSelected = problem.id === selectedProblemId;
                    return (
                      <div
                        key={problem.id}
                        onClick={() => setSelectedProblemId(problem.id)}
                        style={{
                          padding: 18,
                          borderRadius: 12,
                          background: isSelected ? 'rgba(79, 70, 229, 0.14)' : 'var(--bg2)',
                          border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: isSelected ? 'var(--accent)' : 'var(--t1)' }}>
                            {problem.title}
                          </span>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: problem.difficulty === 'basic' ? 'rgba(16, 185, 129, 0.15)' : problem.difficulty === 'intermediate' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: problem.difficulty === 'basic' ? '#10b981' : problem.difficulty === 'intermediate' ? '#3b82f6' : '#ef4444'
                          }}>
                            {problem.difficulty}
                          </span>
                        </div>

                        <p style={{ margin: 0, fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {problem.description}
                        </p>

                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, color: 'var(--t2)', background: 'var(--bg3)', padding: '3px 8px', borderRadius: 4 }}>
                            ⏱️ {problem.timeLimitSeconds / 60} min
                          </span>
                          <span style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.12)', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                            ⚡ +{problem.xpReward} XP
                          </span>
                          {problem.tags.map(tag => (
                            <span key={tag} style={{ fontSize: 11, color: 'var(--t3)', background: 'var(--bg3)', padding: '3px 6px', borderRadius: 4 }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Arena Match Config Panel */}
              <div>
                <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>⚔️ Match Mode</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                    {[
                      { mode: '1v1_duel', label: '1v1 Ranked Duel', icon: '🤺', desc: 'Real-time telemetry' },
                      { mode: 'solo_speedrun', label: 'Solo Speedrun', icon: '⚡', desc: 'Beat the clock' },
                    ].map(item => (
                      <button
                        key={item.mode}
                        onClick={() => setSelectedMode(item.mode as any)}
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          background: selectedMode === item.mode ? 'rgba(79, 70, 229, 0.16)' : 'var(--bg3)',
                          border: selectedMode === item.mode ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                          color: 'var(--t1)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 800 }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)' }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 8 }}>
                      Programming Language
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['typescript', 'python', 'java'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: 8,
                            background: language === lang ? 'var(--accent)' : 'var(--bg3)',
                            border: '1px solid var(--border)',
                            color: language === lang ? '#fff' : 'var(--t2)',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                          }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: 14, borderRadius: 10, background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(79, 70, 229, 0.2)', marginBottom: 24 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>
                      🛡️ Competency Ledger Integration
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>
                      Passing all test fixtures seals a SHA-256 evidence record into competency:
                      <code style={{ display: 'block', marginTop: 4, background: 'rgba(0,0,0,0.3)', padding: '3px 6px', borderRadius: 4, color: '#93c5fd', fontFamily: 'monospace' }}>
                        {activeProblem.competencyId}
                      </code>
                    </div>
                  </div>

                  <button
                    onClick={handleStartBattle}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)'
                    }}
                  >
                    ENTER ARENA BATTLE →
                  </button>
                </div>

                {/* Match History */}
                {recentMatches.length > 0 && (
                  <div style={{ marginTop: 20, padding: 18, borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>📜 Recent Battles</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {recentMatches.slice(0, 4).map(m => (
                        <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '8px 12px', borderRadius: 8, background: 'var(--bg3)' }}>
                          <span style={{ color: 'var(--t1)', fontWeight: 600 }}>{m.problemId}</span>
                          <span style={{ color: m.status === 'victory' ? '#10b981' : '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>
                            {m.status} {m.score ? `(${m.score} pts)` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Live Battle Arena Split-Pane UI */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, minHeight: 600 }}>
              {/* Left: Problem & Opponent Telemetry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
                <div style={{ padding: 16, borderRadius: 14, background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                      Arena Match #{activeMatch.id.slice(-6)}
                    </span>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>{activeProblem.title}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10.5, color: 'var(--t3)', fontWeight: 700 }}>TIME REMAINING</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: timeRemaining < 60 ? '#ef4444' : '#38bdf8', fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace' }}>
                      ⏱️ {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>

                {/* 1v1 Opponent Telemetry */}
                {activeMatch.mode === '1v1_duel' && activeMatch.opponent && (
                  <div style={{ padding: 14, borderRadius: 12, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={activeMatch.opponent.avatarUrl} alt="Opponent" style={{ width: 24, height: 24, borderRadius: 12 }} />
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#ef4444' }}>Opponent: {activeMatch.opponent.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#ef4444' }}>{activeMatch.opponent.progressPct}% Complete</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${activeMatch.opponent.progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #ef4444, #f97316)', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                )}

                {/* Problem Description */}
                <div style={{ padding: 18, borderRadius: 14, background: 'var(--bg2)', border: '1px solid var(--border)', flex: 1 }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>Description</h4>
                  <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>
                    {activeProblem.description}
                  </p>

                  <h4 style={{ margin: '16px 0 10px 0', fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>Test Cases</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {activeProblem.testCases.map((tc, idx) => (
                      <div key={idx} style={{ padding: 10, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 12 }}>
                        <div style={{ color: 'var(--t2)' }}><span style={{ color: '#38bdf8', fontWeight: 700 }}>Input:</span> {tc.input}</div>
                        <div style={{ color: 'var(--t2)' }}><span style={{ color: '#10b981', fontWeight: 700 }}>Expected:</span> {tc.expectedOutput}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Code Editor & Execution Console */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                    Language: {language}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setActiveMatch(null)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        color: 'var(--t2)',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Exit Match
                    </button>
                    <button
                      onClick={handleSubmitSolution}
                      disabled={isSubmitting}
                      style={{
                        padding: '8px 20px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none',
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.6 : 1
                      }}
                    >
                      {isSubmitting ? 'Evaluating...' : '🚀 SUBMIT CODE'}
                    </button>
                  </div>
                </div>

                {/* Code Textarea Editor */}
                <div style={{ flex: 1, minHeight: 300, position: 'relative' }}>
                  <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    spellCheck={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: 300,
                      background: '#0d1117',
                      color: '#58a6ff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      padding: 16,
                      fontFamily: 'Consolas, Monaco, monospace',
                      fontSize: 13,
                      lineHeight: 1.5,
                      resize: 'none',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Execution Console */}
                <div style={{ height: 160, borderRadius: 12, background: '#030712', border: '1px solid var(--border)', padding: 14, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
                  <div style={{ color: 'var(--t3)', marginBottom: 6, fontWeight: 800 }}>Terminal Output:</div>
                  {testResult ? (
                    <div>
                      <div style={{ color: testResult.passed ? '#10b981' : '#ef4444', fontWeight: 800, marginBottom: 4 }}>
                        {testResult.passed ? '🎉 VICTORY! ALL TESTS PASSED' : '❌ TESTS FAILED'} ({testResult.testsPassed}/{testResult.totalTests} tests)
                      </div>
                      <pre style={{ margin: 0, color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{testResult.logs}</pre>
                      {testResult.evidenceRecordId && (
                        <div style={{ marginTop: 8, color: '#38bdf8', fontWeight: 700 }}>
                          🛡️ Evidence Sealed: {testResult.evidenceRecordId}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#64748b' }}>Ready to run code. Click 'Submit Code' to execute against test suite.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: HACKATHON SQUADS QUICK ACTIONS ───────────────────────────── */}
      {activeTab === 'hackathons' && (
        <div style={{ padding: 32, borderRadius: 20, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>
            Hackathon Squads Workspace
          </h2>
          <p style={{ fontSize: 14, color: 'var(--t2)', maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Form 3-person squads, assign Frontend, Backend, and DevOps roles, track milestones, and submit projects for jury evaluation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Link
              href="/projects?tab=squads"
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
                textDecoration: 'none'
              }}
            >
              👥 Open Full Squads Hub in Projects ➔
            </Link>
          </div>
        </div>
      )}

      {/* ── TAB 4: AI STAR VIVA DEFENSES ────────────────────────────────────── */}
      {activeTab === 'viva' && (
        <div style={{ padding: 32, borderRadius: 20, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎙️</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>
            AI STAR Mock Interview Viva
          </h2>
          <p style={{ fontSize: 14, color: 'var(--t2)', maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Face off against corporate AI recruiters with full voice-to-voice interaction. Defend your code architecture and answer STAR behavioral drills.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Link
              href="/interview"
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
                textDecoration: 'none'
              }}
            >
              🎤 Start AI Mock Interview Viva ➔
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ChallengingArenaPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Loading Arena Combat Center...</div>}>
      <ArenaContent />
    </Suspense>
  );
}
