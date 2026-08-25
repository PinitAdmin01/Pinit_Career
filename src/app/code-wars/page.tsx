'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import {
  CodeWarsApiService,
  CodeWarsProblem,
  BattleMatch,
  CODE_WARS_PROBLEMS_CATALOG
} from '@/lib/api/codeWarsApi';

export default function CodeWarsArenaPage() {
  const { user } = useAuth();
  const studentId = user?.id || 'demo_student_01';

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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #090d16)', color: '#f1f5f9', padding: '24px 32px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>⚔️</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
                Code Wars Arena & Timed Battles
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                Deterministic Algorithmic Duels · Live Evidence Ledger Bridge · Tamper-Evident SHA-256
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link
            href="/dashboard"
            style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: 13, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            ← Career OS Dashboard
          </Link>
          <Link
            href="/leaderboard"
            style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}
          >
            🏆 Arena Leaderboard
          </Link>
        </div>
      </div>

      {!activeMatch || activeMatch.status !== 'active' ? (
        /* Lobby & Problem Selection View */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
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
                      background: isSelected ? 'rgba(79, 70, 229, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: isSelected ? '#a5b4fc' : '#f8fafc' }}>
                        {problem.title}
                      </span>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: problem.difficulty === 'basic' ? 'rgba(16, 185, 129, 0.15)' : problem.difficulty === 'intermediate' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: problem.difficulty === 'basic' ? '#34d399' : problem.difficulty === 'intermediate' ? '#60a5fa' : '#f87171'
                      }}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {problem.description}
                    </p>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: '#e2e8f0', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 4 }}>
                        ⏱️ {problem.timeLimitSeconds / 60} min
                      </span>
                      <span style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                        ⚡ +{problem.xpReward} XP
                      </span>
                      {problem.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: 4 }}>
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
            <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700 }}>⚔️ Match Mode</h3>

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
                      borderRadius: 8,
                      background: selectedMode === item.mode ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255,255,255,0.02)',
                      border: selectedMode === item.mode ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{item.desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
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
                        borderRadius: 6,
                        background: language === lang ? '#4f46e5' : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 8, background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(79, 70, 229, 0.2)', marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', marginBottom: 4 }}>
                  🛡️ Competency Ledger Integration
                </div>
                <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.4 }}>
                  Passing all test fixtures seals a SHA-256 evidence record into competency:
                  <code style={{ display: 'block', marginTop: 4, background: 'rgba(0,0,0,0.3)', padding: '3px 6px', borderRadius: 4, color: '#93c5fd' }}>
                    {activeProblem.competencyId}
                  </code>
                </div>
              </div>

              <button
                onClick={handleStartBattle}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
                }}
              >
                ENTER ARENA BATTLE →
              </button>
            </div>

            {/* Match History */}
            {recentMatches.length > 0 && (
              <div style={{ marginTop: 24, padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 700 }}>📜 Recent Arena Battles</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recentMatches.slice(0, 4).map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{m.problemId}</span>
                      <span style={{ color: m.status === 'victory' ? '#34d399' : '#f87171', fontWeight: 700, textTransform: 'uppercase' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, height: 'calc(100vh - 140px)' }}>
          {/* Left: Problem & Opponent Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', paddingRight: 8 }}>
            {/* Live Match Status Header */}
            <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Arena Match #{activeMatch.id.slice(-6)}
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 800 }}>{activeProblem.title}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>TIME REMAINING</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: timeRemaining < 60 ? '#ef4444' : '#38bdf8', fontVariantNumeric: 'tabular-nums' }}>
                  ⏱️ {formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            {/* 1v1 Opponent Telemetry */}
            {activeMatch.mode === '1v1_duel' && activeMatch.opponent && (
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={activeMatch.opponent.avatarUrl} alt="Opponent" style={{ width: 24, height: 24, borderRadius: 12 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#f87171' }}>Opponent: {activeMatch.opponent.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#f87171' }}>{activeMatch.opponent.progressPct}% Complete</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${activeMatch.opponent.progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #ef4444, #f97316)', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )}

            {/* Problem Description */}
            <div style={{ padding: 18, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', flex: 1 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 700 }}>Description</h4>
              <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>
                {activeProblem.description}
              </p>

              <h4 style={{ margin: '16px 0 10px 0', fontSize: 14, fontWeight: 700 }}>Test Cases</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeProblem.testCases.map((tc, idx) => (
                  <div key={idx} style={{ padding: 10, borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
                    <div style={{ color: '#94a3b8' }}><span style={{ color: '#60a5fa' }}>Input:</span> {tc.input}</div>
                    <div style={{ color: '#94a3b8' }}><span style={{ color: '#34d399' }}>Expected:</span> {tc.expectedOutput}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Code Editor & Execution Console */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
            {/* Editor Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase' }}>
                Language: {language}
              </span>
              <button
                onClick={handleSubmitSolution}
                disabled={isSubmitting}
                style={{
                  padding: '8px 20px',
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? 'Evaluating...' : '🚀 SUBMIT CODE'}
              </button>
            </div>

            {/* Code Textarea Editor */}
            <div style={{ flex: 1, minHeight: 280, position: 'relative' }}>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#0d1117',
                  color: '#58a6ff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
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
            <div style={{ height: 160, borderRadius: 8, background: '#030712', border: '1px solid rgba(255,255,255,0.08)', padding: 12, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
              <div style={{ color: '#94a3b8', marginBottom: 6, fontWeight: 700 }}>Terminal Output:</div>
              {testResult ? (
                <div>
                  <div style={{ color: testResult.passed ? '#34d399' : '#f87171', fontWeight: 700, marginBottom: 4 }}>
                    {testResult.passed ? '🎉 VICTORY! ALL TESTS PASSED' : '❌ TESTS FAILED'} ({testResult.testsPassed}/{testResult.totalTests} tests)
                  </div>
                  <pre style={{ margin: 0, color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{testResult.logs}</pre>
                  {testResult.evidenceRecordId && (
                    <div style={{ marginTop: 8, color: '#38bdf8', fontWeight: 600 }}>
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
  );
}
