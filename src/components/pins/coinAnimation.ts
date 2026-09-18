'use client';

export interface CoinStreamOptions {
  sourceElement?: HTMLElement | null;
  sourceCoords?: { x: number; y: number };
  targetElement?: HTMLElement | null;
  targetCoords?: { x: number; y: number };
  count?: number;
  onComplete?: () => void;
}

/**
 * Trigger flying golden pins/coins animation flowing from purchase/claim button to topbar pin badge
 */
export function triggerCoinStream(options: CoinStreamOptions = {}) {
  if (typeof window === 'undefined') return;

  const detail = {
    sourceCoords: options.sourceCoords || (options.sourceElement ? getElementCenter(options.sourceElement) : null),
    targetCoords: options.targetCoords || (options.targetElement ? getElementCenter(options.targetElement) : null),
    sourceElement: options.sourceElement || null,
    targetElement: options.targetElement || null,
    count: options.count || 18,
    onComplete: options.onComplete,
  };

  // Dispatch both events for maximum interoperability across systems
  window.dispatchEvent(new CustomEvent('pinit:coin-stream', { detail }));
  window.dispatchEvent(new CustomEvent('pinit:pin-stream', { detail }));

  if (options.onComplete) {
    setTimeout(options.onComplete, 1400);
  }
}

export const triggerPinStream = triggerCoinStream;

function getElementCenter(el: HTMLElement): { x: number; y: number } | null {
  try {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  } catch {
    return null;
  }
}
