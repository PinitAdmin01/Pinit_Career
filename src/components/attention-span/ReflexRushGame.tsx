'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';

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
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 480, margin: '0 auto', color: '#fff' }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setRound(0); setReactionTimes([]); startRound(); }} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Reflex Rush</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 16px', maxWidth: 420 }}>
            React fast to green targets — resist tapping red decoys! Use touch or press <strong>[Spacebar]</strong>.
          </p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#0a0a0f', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, marginTop: 10 }}>START GAME</button>
        </div>
      )}

      {(phase === 'waiting' || phase === 'active') && (
        <div>
          {/* Status Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', padding: '12px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>Round {round + 1} of {TOTAL_ROUNDS}</div>
            <div style={{ fontSize: 13, color: '#aaa' }}>Hotkey: <strong>[Spacebar]</strong></div>
          </div>

          {/* ── 📐 2.5D ARCADE TRIGGER ARENA ── */}
          <div style={{ perspective: '1000px', padding: '10px 0' }}>
            <div
              onClick={handleTap}
              style={{
                width: '100%',
                height: 280,
                borderRadius: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                transformStyle: 'preserve-3d',
                transform: pressed ? 'perspective(1000px) rotateX(8deg) translateY(6px) translateZ(-8px)' : 'perspective(1000px) rotateX(10deg) translateZ(0)',
                background: phase === 'active'
                  ? (targetType === 'green' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)')
                  : 'rgba(15,23,42,0.85)',
                border: phase === 'active'
                  ? (targetType === 'green' ? '3px solid #34d399' : '3px solid #f87171')
                  : '2px solid rgba(255,255,255,0.15)',
                borderBottom: pressed ? '2px solid rgba(0,0,0,0.6)' : '6px solid rgba(0,0,0,0.6)',
                boxShadow: phase === 'active'
                  ? (targetType === 'green' ? '0 20px 48px rgba(16,185,129,0.5), inset 0 1px 1px rgba(255,255,255,0.3)' : '0 20px 48px rgba(239,68,68,0.5), inset 0 1px 1px rgba(255,255,255,0.3)')
                  : '0 20px 48px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.15)',
                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {earlyTap ? (
                <div style={{ color: '#ef4444', animation: 'attWrong 0.4s ease' }}>
                  <div style={{ fontSize: 44, marginBottom: 8 }}>⚠️</div>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>TOO EARLY / DECOY!</div>
                  <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>Wait for Green Trigger</div>
                </div>
              ) : phase === 'waiting' ? (
                <div>
                  <div style={{ fontSize: 44, marginBottom: 8, opacity: 0.5 }}>⏳</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#aaa' }}>WAIT FOR GREEN...</div>
                </div>
              ) : (
                <div style={{ color: '#fff', animation: 'attPulse 0.4s infinite' }}>
                  <div style={{ fontSize: 52, marginBottom: 8 }}>{targetType === 'green' ? '⚡' : '💣'}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase' }}>
                    {targetType === 'green' ? 'TAP NOW!' : 'DECOY — DON\'T TAP!'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease', background: 'rgba(15,23,42,0.9)', padding: '32px 24px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>⚡</div>
          <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>Reflex Rush Complete!</h2>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#10b981', margin: '12px 0 6px' }}>{avgReaction}ms</div>
          <div style={{ fontSize: 14, color: '#aaa', marginBottom: 20 }}>average response speed across {TOTAL_ROUNDS} rounds</div>

          <CompletionBanner
            difficulty={difficulty}
            onNextChallenge={(nextDiff) => {
              onDifficultyChange(nextDiff);
              setPhase('countdown');
            }}
          />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button onClick={() => { onComplete(avgReaction, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#0a0a0f', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Claim XP & Save</button>
            <button onClick={() => setPhase('countdown')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Replay Level</button>
          </div>
        </div>
      )}
    </div>
  );
}
