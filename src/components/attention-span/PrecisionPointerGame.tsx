'use client';

import { useState, useEffect, useRef } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';

export function PrecisionPointerGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: { gameId: GameId; difficulty: Difficulty; onDifficultyChange: (d: Difficulty) => void; completedDifficulties?: Record<string, Difficulty[]>; soundMuted: boolean; onComplete: (score: number, accuracyEarned: number) => void; onExit: () => void }) {
  const DURATION = 20;

  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'done'>('ready');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [lockOnMs, setLockOnMs] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 }); // percentages
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockTimeRef = useRef(0);

  const startGame = () => {
    setPhase('playing');
    setTimeLeft(DURATION);
    setLockOnMs(0);
    lockTimeRef.current = 0;

    let t = 0;
    const speed = difficulty === 'hard' ? 0.08 : difficulty === 'normal' ? 0.05 : 0.03;
    const animate = () => {
      t += speed;
      const x = 50 + Math.sin(t) * 30 + Math.cos(t * 1.5) * 10;
      const y = 50 + Math.cos(t * 0.8) * 25 + Math.sin(t * 2) * 10;
      setTargetPos({ x: Math.max(15, Math.min(85, x)), y: Math.max(15, Math.min(85, y)) });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (animRef.current) cancelAnimationFrame(animRef.current);
          setPhase('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const targetPxX = (targetPos.x / 100) * rect.width;
    const targetPxY = (targetPos.y / 100) * rect.height;

    const dist = Math.hypot(mx - targetPxX, my - targetPxY);

    // Dynamic Mobile Touch Area Expansion (+10px margin on mobile devices)
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const touchBonus = isTouchDevice ? 10 : 0;
    const baseMargin = difficulty === 'easy' ? 45 : difficulty === 'hard' ? 25 : 35;
    const hitMargin = baseMargin + touchBonus;

    if (dist <= hitMargin) {
      if (!isHovered) playSound('click', soundMuted);
      setIsHovered(true);
      lockTimeRef.current += 100;
      setLockOnMs(lockTimeRef.current);
    } else {
      setIsHovered(false);
    }
  };

  const accuracyEarned = Math.min(100, Math.round((lockOnMs / (DURATION * 1000)) * 250));

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 460 }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={startGame} />}

      <button onClick={onExit} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Precision Pointer</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 12px', maxWidth: 420 }}>Maintain laser crosshair lock-on over the target as it maneuvers along erratic paths!</p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #14b8a6, #2dd4bf)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>LOCK ON</button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 16 }}>
            <div style={{ color: '#14b8a6', fontSize: 18, fontWeight: 800 }}>Lock-On: {(lockOnMs / 1000).toFixed(1)}s</div>
            <div style={{ color: timeLeft <= 5 ? '#ef4444' : '#aaa', fontSize: 18, fontWeight: 800 }}>⏱ {timeLeft}s</div>
          </div>

          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            style={{
              width: '100%',
              maxWidth: 440,
              aspectRatio: '4/3',
              margin: '0 auto',
              background: 'rgba(255,255,255,0.04)',
              border: `2px solid ${isHovered ? '#14b8a6' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 20,
              position: 'relative',
              cursor: 'crosshair',
              overflow: 'hidden',
              boxShadow: isHovered ? '0 0 30px rgba(20,184,166,0.3)' : 'none',
              transition: 'border 0.2s ease',
            }}
          >
            {/* Target sphere */}
            <div
              style={{
                position: 'absolute',
                left: `${targetPos.x}%`,
                top: `${targetPos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: isHovered ? 'radial-gradient(circle at center, #2dd4bf, #14b8a6)' : 'rgba(255,255,255,0.2)',
                border: `2px solid ${isHovered ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                boxShadow: isHovered ? '0 0 20px #14b8a6' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                pointerEvents: 'none',
                transition: 'background 0.15s ease',
              }}
            >
              🎯
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Lock-On Ended!</h2>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#14b8a6', margin: '16px 0 4px', animation: 'attCountUp 0.5s ease' }}>{(lockOnMs / 1000).toFixed(1)}s</div>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 4px' }}>continuous laser tracking time</p>

          <CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(lockOnMs, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />

          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '4px 0 24px' }}>+{accuracyEarned} Accuracy added to Leaderboard & History Log!</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { onComplete(lockOnMs, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #14b8a6, #2dd4bf)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Collect XP & Exit</button>
            <button onClick={() => { setPhase('ready'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
