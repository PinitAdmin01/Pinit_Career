'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';
import { GameShell } from './GameShell';

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
    <GameShell
      accent="blue"
      mark="logic"
      title="Logic Circuit"
      description="Read the gates and conditions. Choose the valid output."
      phase={phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={startGame} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      doneTitle="Circuit closed"
      doneScore={`${finalScore} pts`}
      doneHint={`${correctCount} / ${LOGIC_PROBLEMS.length} proofs · ${accuracyPct}%`}
      doneExtra={
        <CompletionBanner
          difficulty={difficulty}
          onNextChallenge={(nextDiff) => {
            onDifficultyChange(nextDiff);
            setPhase('countdown');
          }}
        />
      }
      onClaim={() => { onComplete(finalScore, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('countdown')}
    >

      {phase === 'playing' && (
        <>
          <div className="att-hud">
            <div className="att-hud-key"><span>{currentProb.title}</span><b>{score}</b></div>
            <div><span>Time</span><b className={timeLeft <= 3 ? 'att-warn' : undefined}>{timeLeft}s</b></div>
          </div>
          <div className="att-arena">
            <div className="att-board" style={{ display: 'block', width: '100%', transform: 'rotateX(6deg)' }}>
              <p className="att-sub" style={{ marginBottom: 12 }}>{currentProb.promptTitle}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
                {currentProb.logicStatements.map((stmt, idx) => (
                  <div key={idx} className="att-quote">{stmt}</div>
                ))}
              </div>
              {currentProb.visualGate && (
                <div className="att-seq" style={{ marginTop: 14 }}>
                  <div className="att-chip">{currentProb.visualGate.input1}</div>
                  <div className="att-chip is-ask">{currentProb.visualGate.gate}</div>
                  {currentProb.visualGate.input2 && <div className="att-chip">{currentProb.visualGate.input2}</div>}
                  <div className="att-chip">→ ?</div>
                </div>
              )}
            </div>
          </div>
          <div className="att-choice" style={{ gridTemplateColumns: currentProb.options.length === 2 ? '1fr 1fr' : '1fr', marginTop: 14 }}>
            {currentProb.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentProb.correctIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`att-choice-btn${isSelected ? (isCorrect ? ' is-good' : ' is-bad') : ''}`}
                  onClick={() => advanceLevel(isCorrect, idx)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      )}
    </GameShell>
  );
}
