'use client';

import { useEffect, useRef, useState } from 'react';

export const GAME_SPRINT_SECONDS = 15;

/** A visible, one-run clock. It resets whenever a new run enters its active phase. */
export function useSprintClock(active: boolean, onExpire: () => void): number {
  const [secondsLeft, setSecondsLeft] = useState(GAME_SPRINT_SECONDS);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!active) return;
    const deadline = Date.now() + GAME_SPRINT_SECONDS * 1000;
    let expired = false;
    setSecondsLeft(GAME_SPRINT_SECONDS);
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0 && !expired) {
        expired = true;
        clearInterval(timer);
        onExpireRef.current();
      }
    }, 100);
    return () => clearInterval(timer);
  }, [active]);

  return secondsLeft;
}
