'use client';

import { useEffect } from 'react';

/**
 * Custom React hook to prevent background document scrolling
 * whenever any modal overlay is active.
 */
export function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
}
