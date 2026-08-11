'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';
import { GameShell } from './GameShell';

export function ReflexRushGame({
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
  const TOTAL_ROUNDS = difficulty === 'hard' ? 8 : difficulty === 'normal' ? 6 : 5;
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'waiting' | 'active' | 'done'>('ready');
  const [targetType, setTargetType] = useState<'green' | 'red'>('green');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [earlyTap, setEarlyTap] = useState(false);
  const [pressed, setPressed] = useState(false);

  const startTimeRef = useRef<number>(0);
  const waitTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = useCallback(() => {
    setPhase('waiting');
    setEarlyTap(false);

    // Random wait delay between 1.5s and 4.0s
    const delay = 1500 + Math.random() * 2500;
    waitTimerRef.current = setTimeout(() => {
      // 25% chance of Red Decoy on Normal/Hard modes
      const isRed = (difficulty !== 'easy') && Math.random() < 0.25;
      setTargetType(isRed ? 'red' : 'green');
      setPhase('active');
      startTimeRef.current = Date.now();
    }, delay);
  }, [difficulty]);

  const handleTap = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 150);

    if (phase === 'waiting') {
      playSound('wrong', soundMuted);
      setEarlyTap(true);
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
      setTimeout(() => startRound(), 1200);
      return;
    }

    if (phase === 'active') {
      const elapsed = Date.now() - startTimeRef.current;
      if (targetType === 'red') {
        playSound('wrong', soundMuted);
        setEarlyTap(true);
        setTimeout(() => startRound(), 1200);
        return;
      }

      playSound('correct', soundMuted);
      const next = [...reactionTimes, elapsed];
      setReactionTimes(next);
      const nextRound = round + 1;
      setRound(nextRound);

      if (nextRound >= TOTAL_ROUNDS) {
        playSound('win', soundMuted);
        setPhase('done');
      } else {
        startRound();
      }
    }
  };

  // Spacebar desktop hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (phase === 'waiting' || phase === 'active')) {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleTap]);

  const avgReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const accuracyEarned = avgReaction > 0
    ? Math.min(100, Math.max(10, Math.round(100 - (avgReaction - 180) * 0.4)))
    : 0;

  return (
    <GameShell
      accent="green"
      mark="reflex"
      title="Reflex Rush"
      description="Wait for green. Skip red. Spacebar works on desktop."
      phase={phase === 'waiting' || phase === 'active' ? 'playing' : phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setRound(0); setReactionTimes([]); startRound(); }} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      doneTitle="Session complete"
      doneScore={`${avgReaction} ms`}
      doneHint={`Average across ${TOTAL_ROUNDS} rounds`}
      doneExtra={
        <CompletionBanner
          difficulty={difficulty}
          onNextChallenge={(nextDiff) => {
            onDifficultyChange(nextDiff);
            setPhase('countdown');
          }}
        />
      }
      onClaim={() => { onComplete(avgReaction, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('countdown')}
    >

      {(phase === 'waiting' || phase === 'active') && (
        <>
          <div className="att-hud">
            <div className="att-hud-key"><span>Round</span><b>{round + 1} / {TOTAL_ROUNDS}</b></div>
            <div className="att-phase">Space</div>
          </div>
          <div className="att-arena">
            <div
              className={`att-trigger${pressed ? ' is-down' : ''}${phase === 'active' ? (targetType === 'green' ? ' is-go' : ' is-no') : ''}`}
              onClick={handleTap}
              role="button"
              tabIndex={0}
            >
              {earlyTap ? (
                <>
                  <h3>Too soon</h3>
                  <p>Wait for green</p>
                </>
              ) : phase === 'waiting' ? (
                <>
                  <h3>Wait</h3>
                  <p>Do not tap yet</p>
                </>
              ) : (
                <>
                  <h3>{targetType === 'green' ? 'Now' : 'Skip'}</h3>
                  <p>{targetType === 'green' ? 'Tap the pad' : 'That was a decoy'}</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </GameShell>
  );
}
