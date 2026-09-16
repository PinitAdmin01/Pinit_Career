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
 * Trigger flying golden coins animation flowing from purchase/claim button to topbar pin badge
 */
export function triggerCoinStream(options: CoinStreamOptions = {}) {
  if (typeof window === 'undefined') return;

  const event = new CustomEvent('pinit:coin-stream', {
    detail: {
      sourceCoords: options.sourceCoords || (options.sourceElement ? getElementCenter(options.sourceElement) : null),
      targetCoords: options.targetCoords || (options.targetElement ? getElementCenter(options.targetElement) : null),
      count: options.count || 18,
    },
  });

  window.dispatchEvent(event);

  if (options.onComplete) {
    // Standard stream completes in ~1400ms
    setTimeout(options.onComplete, 1400);
  }
}

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
