// hooks/useFrame.ts
// Native requestAnimationFrame loop providing the useFrame hook interface without external dependencies

import { useEffect, useRef } from 'react';

export interface FrameState {
  clock: {
    getElapsedTime: () => number;
    elapsedTime: number;
  };
}

export type FrameCallback = (state: FrameState, delta: number) => void;

export function useFrame(callback: FrameCallback): void {
  const callbackRef = useRef<FrameCallback>(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animId: number;
    let lastTime = performance.now();
    const startTime = lastTime;

    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsedTime = (now - startTime) / 1000;

      try {
        callbackRef.current(
          {
            clock: {
              getElapsedTime: () => elapsedTime,
              elapsedTime,
            },
          },
          delta
        );
      } catch {
        // Guard against frame loop exceptions
      }

      animId = window.requestAnimationFrame(tick);
    };

    animId = window.requestAnimationFrame(tick);

    return () => {
      if (typeof window !== 'undefined') {
        window.cancelAnimationFrame(animId);
      }
    };
  }, []);
}
