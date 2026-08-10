'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';

interface PatternProblem {
  level: number;
  title: string;
  type: 'sequence' | 'attributes' | 'transform' | 'matrix' | 'multi';
  questionPrompt: string;
  sequenceDisplay?: string[];
  matrixGrid?: (string | null)[];
  options: string[];
  correctIdx: number;
  timeLimitSec: number;
}

const PROBLEMS: PatternProblem[] = [
  // Level 1: Simple Sequences
  {
    level: 1,
    title: 'Level 1: Simple Sequence Rule',
    type: 'sequence',
    questionPrompt: 'Discover the repeating shape pattern sequence:',
    sequenceDisplay: ['●', '▲', '●', '▲', '?'],
    options: ['●', '■', '▲', '◆'],
    correctIdx: 2, // ▲
    timeLimitSec: 10,
  },
  // Level 2: Multiple Attributes (Color + Shape)
  {
    level: 2,
    title: 'Level 2: Dual Attribute Rule (Color + Shape)',
    type: 'attributes',
    questionPrompt: 'Identify both the color alternation and shape pattern:',
    sequenceDisplay: ['🔴 ●', '🔵 ▲', '🔴 ●', '?'],
    options: ['🔴 ▲', '🔵 ▲', '🔴 ●', '🔵 ●'],
    correctIdx: 1, // 🔵 ▲
    timeLimitSec: 9,
  },
  // Level 3: Transformation Rule (Rotation)
  {
    level: 3,
    title: 'Level 3: Rotational Transformation Rule',
    type: 'transform',
    questionPrompt: 'Each shape undergoes a +90° clockwise rotation transformation:',
    sequenceDisplay: ['▲ (0°)', '► (90°)', '▼ (180°)', '?'],
    options: ['◄ (270°)', '▲ (0°)', '▼ (180°)', '► (90°)'],
    correctIdx: 0, // ◄ (270°)
    timeLimitSec: 8,
  },
  // Level 4: Matrix Reasoning (3x3 Progressive Matrix)
  {
    level: 4,
    title: 'Level 4: 3x3 Progressive Matrix Reasoning',
    type: 'matrix',
    questionPrompt: 'Determine the missing element in the 3x3 matrix where each row shifts symbols:',
    matrixGrid: [
      '●', '▲', '■',
      '▲', '■', '●',
      '■', '●', null
    ],
    options: ['●', '▲', '■', '◆'],
    correctIdx: 1, // ▲
    timeLimitSec: 8,
  },
  // Level 5: Multi-Rule Combined Pattern
  {
    level: 5,
    title: 'Level 5: Multi-Rule Combined Pattern',
    type: 'multi',
    questionPrompt: 'Rule 1: Color flips Red ➔ Blue. Rule 2: Digits double x2.',
    sequenceDisplay: ['🔴 2', '🔵 4', '🔴 8', '?'],
    options: ['🔵 10', '🔵 16', '🔴 16', '🔵 12'],
    correctIdx: 1, // 🔵 16
    timeLimitSec: 7,
  },
  // Level 6: High-Speed Time Pressure Mode
  {
    level: 6,
    title: 'Level 6: High-Speed Time Pressure Mode',
    type: 'multi',
    questionPrompt: 'Rule 1: Shape rotates 90°. Rule 2: Count increments by +1.',
    sequenceDisplay: ['● 1', '▲ 2', '■ 3', '?'],
    options: ['◆ 4', '● 4', '▲ 4', '■ 4'],
    correctIdx: 0, // ◆ 4
    timeLimitSec: 5,
  },
];

export function PatternForgeGame({
  gameId,
  difficulty,
  onDifficultyChange,
  completedDifficulties,
  soundMuted,
  onComplete,
  onExit,
}: {
  gameId: GameId;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  completedDifficulties?: Record<string, Difficulty[]>;
  soundMuted: boolean;
  onComplete: (score: number, accuracyEarned: number) => void;
  onExit: () => void;
}) {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'done'>('ready');
  const [problemIdx, setProblemIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentProb = PROBLEMS[problemIdx] || PROBLEMS[PROBLEMS.length - 1];

  const advanceLevel = useCallback((wasCorrect: boolean, optIdx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(optIdx);

    setTotalAttempts(prev => prev + 1);
    if (wasCorrect) {
      playSound('correct', soundMuted);
      setCorrectCount(prev => prev + 1);
      setScore(prev => prev + (problemIdx + 1) * 20);
    } else {
      playSound('wrong', soundMuted);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (problemIdx + 1 < PROBLEMS.length) {
        setProblemIdx(prev => prev + 1);
        const nextProb = PROBLEMS[problemIdx + 1];
        const mult = difficulty === 'hard' ? 0.7 : difficulty === 'easy' ? 1.2 : 1.0;
        const timeSec = Math.max(4, Math.round(nextProb.timeLimitSec * mult));
        setTimeLeft(timeSec);
        startTimeRef.current = Date.now();
      } else {
        playSound('win', soundMuted);
        setPhase('done');
      }
    }, 600);
  }, [problemIdx, difficulty, soundMuted]);

  const startGame = () => {
    setPhase('playing');
    setProblemIdx(0);
    setScore(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    const mult = difficulty === 'hard' ? 0.7 : difficulty === 'easy' ? 1.2 : 1.0;
    const timeSec = Math.max(4, Math.round(PROBLEMS[0].timeLimitSec * mult));
    setTimeLeft(timeSec);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (phase !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          advanceLevel(false, -1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, advanceLevel]);

  const accuracyPct = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
  const finalScore = score + (correctCount * 15);
  const accuracyEarned = Math.min(100, Math.round((correctCount / PROBLEMS.length) * 100));

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto', color: '#fff' }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={startGame} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🧩</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Pattern Forge</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 16px', maxWidth: 460 }}>
            Discover hidden sequence rules, rotation transformations, and 3x3 Raven progressive matrices!
          </p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, marginTop: 10 }}>START GAME</button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          {/* Header Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', padding: '12px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: '#aaa' }}>{currentProb.title}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ec4899' }}>Score: {score}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#aaa' }}>Time Left:</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: timeLeft <= 3 ? '#ef4444' : '#10b981' }}>{timeLeft}s</span>
            </div>
          </div>

          {/* ── 📐 2.5D PERSPECTIVE GLASS STAGE ── */}
          <div style={{ perspective: '1000px', padding: '10px 0' }}>
            <div
              style={{
                background: 'rgba(15,23,42,0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 20,
                padding: '24px 20px',
                marginBottom: 20,
                boxShadow: '0 24px 48px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.15)',
                transform: 'perspective(1000px) rotateX(10deg) translateZ(0)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, marginBottom: 16 }}>{currentProb.questionPrompt}</div>

              {/* Sequence Display View */}
              {currentProb.sequenceDisplay && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                  {currentProb.sequenceDisplay.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: item === '?' ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.08)',
                        border: `2px solid ${item === '?' ? '#ec4899' : 'rgba(255,255,255,0.15)'}`,
                        borderBottom: item === '?' ? '4px solid #be185d' : '4px solid rgba(0,0,0,0.5)',
                        borderRadius: 14,
                        padding: '14px 20px',
                        fontSize: 22,
                        fontWeight: 900,
                        color: item === '?' ? '#ec4899' : '#fff',
                        minWidth: 64,
                        textAlign: 'center',
                        transform: item === '?' ? 'translateZ(14px)' : 'translateZ(0px)',
                        boxShadow: item === '?' ? '0 10px 20px rgba(236,72,153,0.4)' : 'none',
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}

              {/* 3x3 Matrix Grid View */}
              {currentProb.matrixGrid && (
                <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(3, 70px)', gap: 10, margin: '10px 0 16px' }}>
                  {currentProb.matrixGrid.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 12,
                        background: item === null ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.08)',
                        border: `2px solid ${item === null ? '#ec4899' : 'rgba(255,255,255,0.15)'}`,
                        borderBottom: item === null ? '4px solid #be185d' : '4px solid rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 26,
                        fontWeight: 900,
                        color: item === null ? '#ec4899' : '#fff',
                        transform: item === null ? 'translateZ(16px)' : 'translateZ(0px)',
                        boxShadow: item === null ? '0 10px 20px rgba(236,72,153,0.4)' : 'none',
                      }}
                    >
                      {item === null ? '?' : item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Options Choice Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {currentProb.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentProb.correctIdx;
              let bg = 'rgba(255,255,255,0.08)';
              let border = '1px solid rgba(255,255,255,0.2)';
              let borderBottom = '4px solid rgba(0,0,0,0.5)';

              if (isSelected) {
                bg = isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)';
                border = isCorrect ? '2px solid #10b981' : '2px solid #ef4444';
                borderBottom = isCorrect ? '4px solid #047857' : '4px solid #b91c1c';
              }

              return (
                <button
                  key={idx}
                  onClick={() => advanceLevel(isCorrect, idx)}
                  style={{
                    background: bg,
                    border,
                    borderBottom,
                    borderRadius: 14,
                    padding: '16px 20px',
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transform: isSelected ? 'translateY(2px) translateZ(-4px)' : 'translateZ(0)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease', background: 'rgba(15,23,42,0.9)', padding: '32px 24px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
          <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>Pattern Forge Mastered!</h2>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#ec4899', margin: '12px 0 6px' }}>{finalScore} pts</div>
          <div style={{ fontSize: 14, color: '#aaa', marginBottom: 20 }}>
            Pattern Accuracy: <strong>{accuracyPct}%</strong> ({correctCount} / {PROBLEMS.length} Rules Discovered)
          </div>

          <CompletionBanner
            difficulty={difficulty}
            onNextChallenge={(nextDiff) => {
              onDifficultyChange(nextDiff);
              setPhase('countdown');
            }}
          />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button onClick={() => { onComplete(finalScore, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Claim XP & Save</button>
            <button onClick={() => setPhase('countdown')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Replay Level</button>
          </div>
        </div>
      )}
    </div>
  );
}
