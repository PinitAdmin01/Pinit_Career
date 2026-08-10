'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';

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
        label: '🟢 Phase 1: Normal Speed',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.15)',
        border: 'rgba(16,185,129,0.3)',
        duration: difficulty === 'easy' ? 2400 : difficulty === 'hard' ? 1400 : 2000,
      };
    } else if (elapsed < p2Time) {
      return {
        stage: 2,
        label: '⚡ Phase 2: Speed Boost!',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.15)',
        border: 'rgba(245,158,11,0.3)',
        duration: difficulty === 'easy' ? 1600 : difficulty === 'hard' ? 900 : 1300,
      };
    } else {
      return {
        stage: 3,
        label: '🔥 Phase 3: Hyper Speed!',
        color: '#ef4444',
        bg: 'rgba(239,68,68,0.15)',
        border: 'rgba(239,68,68,0.3)',
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
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto', color: '#fff' }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={startGame} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Focus Fire</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 16px', maxWidth: 440 }}>
            Tap gold targets as speed ramps up every 10 seconds: Normal ➔ Boost ➔ Hyper!
          </p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #d4a843, #f5d78e)', color: '#0a0a0f', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, marginTop: 10 }}>START GAME</button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          {/* Header Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', padding: '12px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: '#aaa' }}>Score</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#d4a843' }}>{score}</div>
            </div>

            {/* Dynamic 2.5D Phase Badge */}
            <div style={{ background: currentStage.bg, border: `1px solid ${currentStage.border}`, color: currentStage.color, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, boxShadow: `0 0 16px ${currentStage.color}40` }}>
              {currentStage.label}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#aaa' }}>Time Remaining</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: timeLeft <= 5 ? '#ef4444' : '#fff' }}>{timeLeft}s</div>
            </div>
          </div>

          {/* ── 📐 2.5D PERSPECTIVE TILTED ARENA STAGE ── */}
          <div style={{ perspective: '1000px', padding: '10px 0' }}>
            <div
              style={{
                display: 'inline-grid',
                gridTemplateColumns: `repeat(${GRID}, 76px)`,
                gap: 12,
                transform: 'perspective(1000px) rotateX(12deg) translateZ(0)',
                transformStyle: 'preserve-3d',
                padding: 18,
                background: 'rgba(15,23,42,0.75)',
                backdropFilter: 'blur(16px)',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.15)',
              }}
            >
              {Array.from({ length: GRID * GRID }).map((_, i) => {
                const isTarget = i === targetIdx;
                const isDecoy = decoyIdxs.includes(i);
                const isFb = feedback?.idx === i;
                const isFbCorrect = feedback?.correct;

                let bg = 'rgba(255,255,255,0.05)';
                let border = '1px solid rgba(255,255,255,0.12)';
                let borderBottom = '4px solid rgba(0,0,0,0.4)';
                let shadow = 'none';
                let transformZ = 'translateZ(0px)';

                if (isTarget) {
                  bg = 'linear-gradient(135deg, #d4a843, #f5d78e)';
                  border = '2px solid #f5d78e';
                  borderBottom = '4px solid #b38b2e';
                  shadow = '0 12px 28px rgba(0,0,0,0.5), 0 0 24px rgba(212,168,67,0.6)';
                  transformZ = 'translateZ(18px) scale(1.04)';
                } else if (isDecoy) {
                  bg = 'rgba(239,68,68,0.2)';
                  border = '1px solid rgba(239,68,68,0.4)';
                  borderBottom = '4px solid rgba(185,28,28,0.5)';
                }

                if (isFb) {
                  bg = isFbCorrect ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)';
                  border = isFbCorrect ? '2px solid #10b981' : '2px solid #ef4444';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleTileClick(i)}
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 14,
                      background: bg,
                      border,
                      borderBottom,
                      boxShadow: shadow,
                      transform: transformZ,
                      transformStyle: 'preserve-3d',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    {isTarget && <span style={{ animation: 'attPulse 0.8s infinite' }}>🎯</span>}
                    {isDecoy && <span style={{ opacity: 0.6, fontSize: 24 }}>💣</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease', background: 'rgba(15,23,42,0.9)', padding: '32px 24px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
          <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>Focus Fire Completed!</h2>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#d4a843', margin: '12px 0 6px' }}>{score} pts</div>
          <div style={{ fontSize: 14, color: '#aaa', marginBottom: 20 }}>
            Target Accuracy: <strong>{accuracyPct}%</strong>
          </div>

          <CompletionBanner
            difficulty={difficulty}
            onNextChallenge={(nextDiff) => {
              onDifficultyChange(nextDiff);
              setPhase('countdown');
            }}
          />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button onClick={() => { onComplete(score, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #d4a843, #f5d78e)', color: '#0a0a0f', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Claim XP & Save</button>
            <button onClick={() => setPhase('countdown')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Replay Level</button>
          </div>
        </div>
      )}
    </div>
  );
}
