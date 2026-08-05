'use client';

import { useState, useEffect } from 'react';
import { playSound } from './types';

export function CountdownOverlay({
  soundMuted,
  onComplete,
}: {
  soundMuted: boolean;
  onComplete: () => void;
}) {
  const [count, setCount] = useState<number | 'GO!'>(3);

  useEffect(() => {
    playSound('click', soundMuted);

    const timer1 = setTimeout(() => {
      setCount(2);
      playSound('click', soundMuted);
    }, 800);

    const timer2 = setTimeout(() => {
      setCount(1);
      playSound('click', soundMuted);
    }, 1600);

    const timer3 = setTimeout(() => {
      setCount('GO!');
      playSound('level', soundMuted);
    }, 2400);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [soundMuted, onComplete]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        animation: 'attFadeIn 0.2s ease',
      }}
    >
      <div
        key={String(count)}
        style={{
          fontSize: typeof count === 'number' ? 72 : 64,
          fontWeight: 900,
          color: count === 'GO!' ? '#10b981' : '#d4a843',
          animation: 'attCountdownPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          textShadow: count === 'GO!' ? '0 0 30px rgba(16,185,129,0.8)' : '0 0 30px rgba(212,168,67,0.8)',
        }}
      >
        {count}
      </div>
      <div style={{ fontSize: 13, color: '#aaa', marginTop: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
        {count === 'GO!' ? 'FOCUS NOW!' : 'Get Ready...'}
      </div>

      <style>{`
        @keyframes attCountdownPop {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
