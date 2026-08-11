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
  const [count, setCount] = useState<number | 'Go'>(3);

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
      setCount('Go');
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
    <div className="att-count">
      <b key={String(count)} className={count === 'Go' ? 'is-go' : undefined}>{count}</b>
      <span>{count === 'Go' ? 'Now' : 'Ready'}</span>
    </div>
  );
}
