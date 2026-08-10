'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';

interface LogicProblem {
  level: number;
  title: string;
  type: 'boolean' | 'multi-condition' | 'visual-node' | 'conditional' | 'pipeline' | 'syllogism';
  promptTitle: string;
  logicStatements: string[];
  visualGate?: { input1: string; gate: 'AND' | 'OR' | 'NOT' | 'XOR'; input2?: string };
  options: string[];
  correctIdx: number;
  timeLimitSec: number;
}

const LOGIC_PROBLEMS: LogicProblem[] = [
  // Level 1: Basic Boolean Logic
  {
    level: 1,
    title: 'Level 1: Basic Logic Gate',
    type: 'boolean',
    promptTitle: 'Evaluate the basic boolean operation:',
    logicStatements: ['A = TRUE', 'B = FALSE', 'Question: A AND B = ?'],
    options: ['TRUE', 'FALSE'],
    correctIdx: 1, // FALSE
    timeLimitSec: 10,
  },
  // Level 2: Multiple Conditions
  {
    level: 2,
    title: 'Level 2: Multi-Condition Chain',
    type: 'multi-condition',
    promptTitle: 'Evaluate the combined boolean expression:',
    logicStatements: ['A = TRUE', 'B = TRUE', 'C = FALSE', 'Question: (A AND B) OR C = ?'],
    options: ['TRUE', 'FALSE'],
    correctIdx: 0, // TRUE
    timeLimitSec: 9,
  },
  // Level 3: Visual Logic Gate Nodes (Accessible to Non-Tech & Tech Students)
  {
    level: 3,
    title: 'Level 3: Visual Node Flow (Non-Technical Gate)',
    type: 'visual-node',
    promptTitle: 'Determine the visual output flow through the AND node:',
    logicStatements: ['🔵 Circle Active (Input 1)', '🟢 Circle Active (Input 2)'],
    visualGate: { input1: '🔵', gate: 'AND', input2: '🟢' },
    options: ['⚡ Active Output (PASS)', '❌ Inactive Output (FAIL)'],
    correctIdx: 0, // Active Output
    timeLimitSec: 8,
  },
  // Level 4: Conditional Situation Evaluation
  {
    level: 4,
    title: 'Level 4: Conditional Situation Evaluation',
    type: 'conditional',
    promptTitle: 'Evaluate the IF/THEN condition:',
    logicStatements: [
      'Condition: IF (Signal is RED) AND (Count > 5) THEN Activate Alpha ELSE Activate Beta.',
      'Current State: Signal is RED, Count is 8.',
      'Which action is activated?'
    ],
    options: ['Activate Alpha', 'Activate Beta', 'None Activated'],
    correctIdx: 0, // Activate Alpha
    timeLimitSec: 8,
  },
  // Level 5: Multi-Step Reasoning Pipeline
  {
    level: 5,
    title: 'Level 5: Multi-Step Reasoning Pipeline',
    type: 'pipeline',
    promptTitle: 'Follow the 3-stage logical pipeline:',
    logicStatements: [
      'Stage 1: Input = 10',
      'Stage 2: IF (Input > 5) THEN Add +5 ➔ Current = 15',
      'Stage 3: IF (Current is Odd) THEN Multiply x2 ELSE Subtract -3',
      'Final Output = ?'
    ],
    options: ['30', '12', '20', '15'],
    correctIdx: 0, // 15 x 2 = 30
    timeLimitSec: 7,
  },
  // Level 6: Syllogism Error Detection (Validity Check)
  {
    level: 6,
    title: 'Level 6: Deductive Syllogism Validity Check',
    type: 'syllogism',
    promptTitle: 'Identify if the following deductive chain is logically valid:',
    logicStatements: [
      'Premise 1: All compiled code produces binaries.',
      'Premise 2: Script X is compiled code.',
      'Conclusion: Therefore, Script X produces binaries.',
      'Is this reasoning VALID or INVALID?'
    ],
    options: ['VALID DEDUCTION', 'INVALID / FALLACY'],
    correctIdx: 0, // VALID
    timeLimitSec: 6,
  },
];

export function LogicCircuitGame({
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentProb = LOGIC_PROBLEMS[problemIdx] || LOGIC_PROBLEMS[LOGIC_PROBLEMS.length - 1];

  const advanceLevel = useCallback((wasCorrect: boolean, optIdx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(optIdx);

    setTotalAttempts(prev => prev + 1);
    if (wasCorrect) {
      playSound('correct', soundMuted);
      setCorrectCount(prev => prev + 1);
      setScore(prev => prev + (problemIdx + 1) * 25);
    } else {
      playSound('wrong', soundMuted);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (problemIdx + 1 < LOGIC_PROBLEMS.length) {
        setProblemIdx(prev => prev + 1);
        const nextProb = LOGIC_PROBLEMS[problemIdx + 1];
        const mult = difficulty === 'hard' ? 0.7 : difficulty === 'easy' ? 1.2 : 1.0;
        const timeSec = Math.max(4, Math.round(nextProb.timeLimitSec * mult));
        setTimeLeft(timeSec);
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
    const timeSec = Math.max(4, Math.round(LOGIC_PROBLEMS[0].timeLimitSec * mult));
    setTimeLeft(timeSec);
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
  const finalScore = score + (correctCount * 20);
  const accuracyEarned = Math.min(100, Math.round((correctCount / LOGIC_PROBLEMS.length) * 100));

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto', color: '#fff' }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={startGame} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🧠</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Logic Circuit</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 16px', maxWidth: 460 }}>
            Evaluate multi-step boolean logic gates, visual node flows, and conditional syllogisms!
          </p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, marginTop: 10 }}>START GAME</button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          {/* Header Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', padding: '12px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: '#aaa' }}>{currentProb.title}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>Score: {score}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#aaa' }}>Time Left:</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: timeLeft <= 3 ? '#ef4444' : '#10b981' }}>{timeLeft}s</span>
            </div>
          </div>

          {/* ── 📐 2.5D PERSPECTIVE CIRCUIT BOARD STAGE ── */}
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
              <div style={{ fontSize: 14, color: '#93c5fd', fontWeight: 700, marginBottom: 14 }}>{currentProb.promptTitle}</div>

              {/* Statements List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', marginBottom: currentProb.visualGate ? 16 : 0 }}>
                {currentProb.logicStatements.map((stmt, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.06)', borderLeft: '3px solid #3b82f6', padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>
                    {stmt}
                  </div>
                ))}
              </div>

              {/* Visual Gate Node Diagram */}
              {currentProb.visualGate && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'rgba(255,255,255,0.04)', padding: 16, borderRadius: 14, border: '1px solid rgba(59,130,246,0.3)', transform: 'translateZ(14px)', boxShadow: '0 8px 24px rgba(59,130,246,0.2)' }}>
                  <div style={{ fontSize: 32 }}>{currentProb.visualGate.input1}</div>
                  <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 900, borderBottom: '3px solid #1d4ed8', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
                    {currentProb.visualGate.gate}
                  </div>
                  {currentProb.visualGate.input2 && <div style={{ fontSize: 32 }}>{currentProb.visualGate.input2}</div>}
                  <div style={{ fontSize: 22, color: '#93c5fd' }}>➔</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#3b82f6', textShadow: '0 0 12px rgba(59,130,246,0.8)' }}>?</div>
                </div>
              )}
            </div>
          </div>

          {/* Options Choice Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: currentProb.options.length === 2 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)', gap: 12 }}>
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
                    fontSize: 16,
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
          <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>Logic Circuit Mastered!</h2>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#3b82f6', margin: '12px 0 6px' }}>{finalScore} pts</div>
          <div style={{ fontSize: 14, color: '#aaa', marginBottom: 20 }}>
            Logical Reasoning Accuracy: <strong>{accuracyPct}%</strong> ({correctCount} / {LOGIC_PROBLEMS.length} Chain Proofs Resolved)
          </div>

          <CompletionBanner
            difficulty={difficulty}
            onNextChallenge={(nextDiff) => {
              onDifficultyChange(nextDiff);
              setPhase('countdown');
            }}
          />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button onClick={() => { onComplete(finalScore, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Claim XP & Save</button>
            <button onClick={() => setPhase('countdown')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Replay Level</button>
          </div>
        </div>
      )}
    </div>
  );
}
