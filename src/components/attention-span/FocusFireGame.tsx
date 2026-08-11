'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';
import { GameShell } from './GameShell';

export function FocusFireGame({
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
  const DURATION = difficulty === 'easy' ? 45 : 30;
  const GRID = 4;
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'done'>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [targetIdx, setTargetIdx] = useState(-1);
  const [decoyIdxs, setDecoyIdxs] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ idx: number; correct: boolean } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreRef = useRef(0);
  const totalAttemptsRef = useRef(0);
  const timeLeftRef = useRef(DURATION);

  const getStageInfo = useCallback((timeRemaining: number) => {
    const total = DURATION;
    const elapsed = total - timeRemaining;
    const p1Time = difficulty === 'easy' ? 15 : 10;
    const p2Time = difficulty === 'easy' ? 30 : 20;

    if (elapsed < p1Time) {
      return {
        stage: 1,
        label: 'Phase 1 · steady',
        duration: difficulty === 'easy' ? 2400 : difficulty === 'hard' ? 1400 : 2000,
      };
    } else if (elapsed < p2Time) {
      return {
        stage: 2,
        label: 'Phase 2 · faster',
        duration: difficulty === 'easy' ? 1600 : difficulty === 'hard' ? 900 : 1300,
      };
    } else {
      return {
        stage: 3,
        label: 'Phase 3 · peak',
        duration: difficulty === 'easy' ? 1000 : difficulty === 'hard' ? 500 : 750,
      };
    }
  }, [DURATION, difficulty]);

  const currentStage = getStageInfo(timeLeft);

  const spawnRound = useCallback(() => {
    const total = GRID * GRID;
    const tgt = Math.floor(Math.random() * total);
    const decoys: number[] = [];
    const decoyCount = (difficulty === 'hard' ? 4 : difficulty === 'normal' ? 2 : 1);
    while (decoys.length < decoyCount) {
      const d = Math.floor(Math.random() * total);
      if (d !== tgt && !decoys.includes(d)) decoys.push(d);
    }
    setTargetIdx(tgt);
    setDecoyIdxs(decoys);
    setFeedback(null);

    const stage = getStageInfo(timeLeftRef.current);
    roundRef.current = setTimeout(() => {
      setTargetIdx(-1);
      setDecoyIdxs([]);
      spawnRound();
    }, stage.duration);
  }, [difficulty, getStageInfo]);

  const startGame = useCallback(() => {
    setPhase('playing');
    setScore(0); scoreRef.current = 0;
    totalAttemptsRef.current = 0;
    setTimeLeft(DURATION);
    timeLeftRef.current = DURATION;

    spawnRound();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        timeLeftRef.current = next;
        if (next <= 0) {
          clearInterval(timerRef.current!);
          if (roundRef.current) clearTimeout(roundRef.current);
          setPhase('done');
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [DURATION, spawnRound]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (roundRef.current) clearTimeout(roundRef.current);
    };
  }, []);

  const handleTileClick = (idx: number) => {
    if (phase !== 'playing') return;
    totalAttemptsRef.current += 1;

    if (idx === targetIdx) {
      playSound('correct', soundMuted);
      const points = currentStage.stage === 3 ? 30 : currentStage.stage === 2 ? 20 : 10;
      const nextScore = scoreRef.current + points;
      scoreRef.current = nextScore;
      setScore(nextScore);
      setFeedback({ idx, correct: true });

      if (roundRef.current) clearTimeout(roundRef.current);
      spawnRound();
    } else {
      playSound('wrong', soundMuted);
      setFeedback({ idx, correct: false });
    }
  };

  const accuracyPct = totalAttemptsRef.current > 0
    ? Math.min(100, Math.round((scoreRef.current / (totalAttemptsRef.current * 15)) * 100))
    : 100;
  const accuracyEarned = Math.min(100, Math.round(score * 1.5));

  return (
    <GameShell
      accent="amber"
      mark="focus"
      title="Focus Fire"
      description="Tap the raised gold tile. Ignore the rest. The pace steps up in three phases."
      phase={phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={startGame} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      doneTitle="Session complete"
      doneScore={`${score} pts`}
      doneHint={`Hit accuracy ${accuracyPct}%`}
      doneExtra={
        <CompletionBanner
          difficulty={difficulty}
          onNextChallenge={(nextDiff) => {
            onDifficultyChange(nextDiff);
            setPhase('countdown');
          }}
        />
      }
      onClaim={() => { onComplete(score, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('countdown')}
    >
      {phase === 'playing' && (
        <>
          <div className="att-hud">
            <div className="att-hud-key"><span>Score</span><b>{score}</b></div>
            <div className="att-phase">{currentStage.label}</div>
            <div><span>Time</span><b className={timeLeft <= 5 ? 'att-warn' : undefined}>{timeLeft}s</b></div>
          </div>
          <div className="att-arena">
            <div className="att-board" style={{ gridTemplateColumns: `repeat(${GRID}, 72px)` }}>
              {Array.from({ length: GRID * GRID }).map((_, i) => {
                const isTarget = i === targetIdx;
                const isDecoy = decoyIdxs.includes(i);
                const isFb = feedback?.idx === i;
                const cls = [
                  'att-tile',
                  isTarget ? 'is-target' : '',
                  isDecoy ? 'is-decoy' : '',
                  isFb && feedback?.correct ? 'is-good' : '',
                  isFb && !feedback?.correct ? 'is-bad' : '',
                ].filter(Boolean).join(' ');
                return (
                  <button key={i} type="button" className={cls} onClick={() => handleTileClick(i)}>
                    {(isTarget || isDecoy) && <span className="att-tile-dot" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </GameShell>
  );
}
