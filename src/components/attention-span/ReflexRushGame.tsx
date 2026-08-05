'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';

export function ReflexRushGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: { gameId: GameId; difficulty: Difficulty; onDifficultyChange: (d: Difficulty) => void; completedDifficulties?: Record<string, Difficulty[]>; soundMuted: boolean; onComplete: (avgMs: number, accuracyEarned: number) => void; onExit: () => void }) {
  const TOTAL_ROUNDS = 20;

  // Touch area optimization for mobile devices
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const CIRCLE_R = isTouch ? 42 : 36;

  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'waiting' | 'showing' | 'done'>('ready');
  const [round, setRound] = useState(0);
  const [circlePos, setCirclePos] = useState({ x: 50, y: 50 }); // percentages
  const [isGo, setIsGo] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [penalties, setPenalties] = useState(0);
  const [lastReaction, setLastReaction] = useState<string>('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimeRef = useRef(0);

  const startRound = useCallback((roundNum: number) => {
    setPhase('waiting');
    setLastReaction('');
    const delay = (difficulty === 'easy' ? 1200 : 500) + Math.random() * (difficulty === 'hard' ? 1000 : 1500);
    timeoutRef.current = setTimeout(() => {
      const x = 15 + Math.random() * 70; // 15% to 85%
      const y = 15 + Math.random() * 70;
      const go = Math.random() > (difficulty === 'hard' ? 0.35 : 0.25);
      setCirclePos({ x, y });
      setIsGo(go);
      showTimeRef.current = Date.now();
      setPhase('showing');
      timeoutRef.current = setTimeout(() => {
        if (go) {
          playSound('wrong', soundMuted);
          setResults(prev => [...prev, 2000]);
          setLastReaction('Missed! +2000ms');
        } else {
          setLastReaction('✓ Correctly ignored');
        }
        if (roundNum + 1 >= TOTAL_ROUNDS) { setPhase('done'); }
        else { setRound(roundNum + 1); startRound(roundNum + 1); }
      }, difficulty === 'easy' ? 3000 : 2000);
    }, delay);
  }, [difficulty, soundMuted]);

  const handleCircleClick = () => {
    if (phase !== 'showing') return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const rt = Date.now() - showTimeRef.current;

    if (isGo) {
      playSound('correct', soundMuted);
      setResults(prev => [...prev, rt]);
      setLastReaction(`${rt}ms ⚡`);
    } else {
      playSound('wrong', soundMuted);
      setPenalties(prev => prev + 1);
      setResults(prev => [...prev, 500]);
      setLastReaction('Red! +500ms penalty');
    }

    if (round + 1 >= TOTAL_ROUNDS) { setPhase('done'); }
    else { const next = round + 1; setRound(next); startRound(next); }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleCircleClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, isGo, round, soundMuted]);

  const avgMs = results.length > 0 ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0;
  const accuracyEarned = Math.max(10, Math.min(100, Math.round(100 - (penalties * 15))));

  return (
    <div style={{ textAlign: 'center', animation: 'attFadeIn 0.3s ease', position: 'relative', width: '100%', maxWidth: 460 }}>
      {phase === 'countdown' && <CountdownOverlay soundMuted={soundMuted} onComplete={() => { setRound(0); setResults([]); setPenalties(0); startRound(0); }} />}

      <button onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); onExit(); }} style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Exit</button>

      {phase === 'ready' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Reflex Rush</h2>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 12px', maxWidth: 420 }}>Tap <span style={{ color: '#10b981', fontWeight: 700 }}>green circles</span> as fast as possible. <span style={{ color: '#ef4444', fontWeight: 700 }}>DON'T tap red circles!</span></p>

          <DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />

          <button onClick={() => setPhase('countdown')} style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1 }}>START</button>
        </div>
      )}

      {(phase === 'waiting' || phase === 'showing') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 16 }}>
            <div style={{ color: '#10b981', fontSize: 18, fontWeight: 800 }}>Round {round + 1}/{TOTAL_ROUNDS}</div>
            <div style={{ color: '#aaa', fontSize: 14, fontWeight: 600 }}>{lastReaction}</div>
          </div>
          <div style={{ width: '100%', maxWidth: 440, aspectRatio: '4/3', margin: '0 auto', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, position: 'relative', cursor: 'crosshair', overflow: 'hidden' }}>
            {phase === 'waiting' && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 14, animation: 'attPulse 1s infinite' }}>Get ready...</div>
            )}
            {phase === 'showing' && (
              <div onClick={(e) => { e.stopPropagation(); handleCircleClick(); }} style={{
                position: 'absolute',
                left: `${circlePos.x}%`,
                top: `${circlePos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: CIRCLE_R * 2,
                height: CIRCLE_R * 2,
                borderRadius: '50%',
                background: isGo ? 'radial-gradient(circle at 30% 30%, #34d399, #10b981)' : 'radial-gradient(circle at 30% 30%, #f87171, #ef4444)',
                cursor: 'pointer',
                animation: 'attReveal 0.15s ease',
                boxShadow: isGo ? '0 0 20px rgba(16,185,129,0.5)' : '0 0 20px rgba(239,68,68,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: '#fff', fontWeight: 800,
              }}>
                {isGo ? 'GO' : '✕'}
              </div>
            )}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ animation: 'attFadeIn 0.4s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <h2 style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Results</h2>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#10b981', margin: '16px 0 4px', animation: 'attCountUp 0.5s ease' }}>{avgMs}ms</div>
          <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 4px' }}>average reaction time</p>

          <CompletionBanner difficulty={difficulty} onNextChallenge={(nextD) => { onComplete(avgMs, accuracyEarned); onDifficultyChange(nextD); setPhase('ready'); }} />

          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '4px 0 16px' }}>+{accuracyEarned} Accuracy added to Leaderboard & History Log!</div>
          {penalties > 0 && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{penalties} red circle{penalties > 1 ? 's' : ''} tapped (penalties included)</p>}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { onComplete(avgMs, accuracyEarned); onExit(); }} style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Collect XP & Exit</button>
            <button onClick={() => { onComplete(avgMs, accuracyEarned); setPhase('ready'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
