'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';

export function FocusFireGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: { gameId: GameId; difficulty: Difficulty; onDifficultyChange: (d: Difficulty) => void; completedDifficulties?: Record<string, Difficulty[]>; soundMuted: boolean; onComplete: (score: number, accuracyEarned: number) => void; onExit: () => void }) {
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
  }, [spawnRound, DURATION]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (roundRef.current) clearTimeout(roundRef.current);
    };
  }, []);

  const handleCellClick = (idx: number) => {
    if (phase !== 'playing') return;
    totalAttemptsRef.current += 1;
    if (idx === targetIdx) {
      playSound('correct', soundMuted);
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setFeedback({ idx, correct: true });
      if (roundRef.current) clearTimeout(roundRef.current);
      setTimeout(() => spawnRound(), 200);
    } else if (decoyIdxs.includes(idx)) {
      playSound('wrong', soundMuted);
      scoreRef.current = Math.max(0, scoreRef.current - 1);
      setScore(scoreRef.current);
      setFeedback({ idx, correct: false });
    }
  };

  const accuracyEarned = Math.round((scoreRef.current / Math.max(1, totalAttemptsRef.current)) * 100) || Math.min(100, score * 6);

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 460 }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={startGame} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Focus Fire</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 12px', maxWidth: 460, lineHeight: 1.5 }}>
            Speed ramps up every 10 seconds:<br />
            <strong style={{ color: '#10b981' }}>0–10s Normal</strong> ➔ <strong style={{ color: '#f59e0b' }}>10–20s Speed Boost</strong> ➔ <strong style={{ color: '#ef4444' }}>20–30s Hyper Speed!</strong>
          </p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #d4a843, #f5d78e)', color: '#0a0a0f', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>START GAME</button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{ background: currentStage.bg, border: `1px solid ${currentStage.border}`, color: currentStage.color, padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800, letterSpacing: 0.5, transition: 'all 0.4s ease' }}>
              {currentStage.label}
            </div>
            <div style={{ color: timeLeft <= 5 ? '#ef4444' : '#aaa', fontSize: 18, fontWeight: 800, animation: timeLeft <= 5 ? 'attPulse 0.5s infinite' : 'none' }}>
              ⏱ {timeLeft}s
            </div>
            <div style={{ color: '#d4a843', fontSize: 18, fontWeight: 800 }}>
              Score: {score}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID}, 1fr)`, gap: 10, width: '100%', maxWidth: 360, margin: '0 auto', aspectRatio: '1/1' }}>
            {Array.from({ length: GRID * GRID }).map((_, i) => {
              const isTarget = i === targetIdx;
              const isDecoy = decoyIdxs.includes(i);
              let bg = 'rgba(255,255,255,0.06)';
              let border = '1px solid rgba(255,255,255,0.12)';
              let anim = '';
              if (isTarget) { bg = 'linear-gradient(135deg, #d4a843, #f5d78e)'; border = '2px solid #d4a843'; anim = 'attTarget 0.25s ease'; }
              if (isDecoy) { bg = 'linear-gradient(135deg, #ef4444, #f87171)'; border = '2px solid #ef4444'; anim = 'attTarget 0.25s ease'; }
              if (feedback?.idx === i) { anim = feedback.correct ? 'attCorrect 0.4s ease' : 'attWrong 0.4s ease'; }
              return (
                <div key={i} onClick={() => handleCellClick(i)} style={{ borderRadius: 12, background: bg, border, cursor: 'pointer', transition: 'all 0.15s ease', animation: anim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isTarget && <span style={{ fontSize: 28, filter: 'drop-shadow(0 0 8px rgba(212,168,67,0.6))' }}>★</span>}
                  {isDecoy && <span style={{ fontSize: 22, opacity: 0.8 }}>✕</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Time's Up!</h2>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#d4a843', margin: '16px 0', animation: 'attCountUp 0.5s ease' }}>{score}</div>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 6px' }}>targets hit across 3 speed phases</p>

          <CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(score, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />

          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '0 0 24px' }}>+{accuracyEarned} Accuracy added to Leaderboard & History Log!</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { onComplete(score, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #d4a843, #f5d78e)', color: '#0a0a0f', border: 'none', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Collect XP & Exit</button>
            <button onClick={() => { onComplete(score, accuracyEarned); setPhase('ready'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
