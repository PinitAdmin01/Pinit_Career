const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Integration of Pin Currency Icon & Flying Pins Animation System...');

// 1. Update src/components/pins/FlyingPinsAnimation.tsx to listen to both events
const flyingPinsPath = path.resolve(__dirname, '../src/components/pins/FlyingPinsAnimation.tsx');
let flyingPinsContent = fs.readFileSync(flyingPinsPath, 'utf8');

if (!flyingPinsContent.includes("window.addEventListener('pinit:coin-stream'")) {
  flyingPinsContent = flyingPinsContent.replace(
    "window.addEventListener('pinit:pin-stream', handleStream as EventListener);",
    "window.addEventListener('pinit:pin-stream', handleStream as EventListener);\n    window.addEventListener('pinit:coin-stream', handleStream as EventListener);"
  ).replace(
    "window.removeEventListener('pinit:pin-stream', handleStream as EventListener);",
    "window.removeEventListener('pinit:pin-stream', handleStream as EventListener);\n      window.removeEventListener('pinit:coin-stream', handleStream as EventListener);"
  );
  fs.writeFileSync(flyingPinsPath, flyingPinsContent, 'utf8');
  console.log('✔ Updated FlyingPinsAnimation.tsx to listen to both pin-stream and coin-stream events');
}

// 2. Update src/components/pins/coinAnimation.ts
const coinAnimPath = path.resolve(__dirname, '../src/components/pins/coinAnimation.ts');
const newCoinAnimContent = `'use client';

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
`;
fs.writeFileSync(coinAnimPath, newCoinAnimContent, 'utf8');
console.log('✔ Updated coinAnimation.ts with dual dispatch and triggerPinStream alias');

// 3. Update src/components/pins/PinsBadge.tsx to use PinCurrencyIcon
const pinsBadgePath = path.resolve(__dirname, '../src/components/pins/PinsBadge.tsx');
let pinsBadgeContent = fs.readFileSync(pinsBadgePath, 'utf8');

if (!pinsBadgeContent.includes('PinCurrencyIcon')) {
  pinsBadgeContent = pinsBadgeContent.replace(
    "import PinCoin from '@/components/pins/PinCoin';",
    "import PinCurrencyIcon from '@/components/pins/PinCurrencyIcon';"
  ).replace(
    "<PinCoin size={s.iconSize} glow={!very_low} animate={!very_low && !low} />",
    "<PinCurrencyIcon size={s.iconSize} glow={!very_low} animate={!very_low && !low} />"
  );
  fs.writeFileSync(pinsBadgePath, pinsBadgeContent, 'utf8');
  console.log('✔ Updated PinsBadge.tsx to use official PinCurrencyIcon');
}

// 4. Mount FlyingPinsAnimation in src/components/ui/AppHeader.tsx
const appHeaderPath = path.resolve(__dirname, '../src/components/ui/AppHeader.tsx');
let appHeaderContent = fs.readFileSync(appHeaderPath, 'utf8');

if (!appHeaderContent.includes('FlyingPinsAnimation')) {
  appHeaderContent = appHeaderContent.replace(
    "import CoinStreamOverlay from '@/components/pins/CoinStreamOverlay';",
    "import CoinStreamOverlay from '@/components/pins/CoinStreamOverlay';\nimport FlyingPinsAnimation from '@/components/pins/FlyingPinsAnimation';"
  );
}

// Mount FlyingPinsAnimation right before </header>
if (!appHeaderContent.includes('<FlyingPinsAnimation />')) {
  appHeaderContent = appHeaderContent.replace(
    '</header>',
    '  <FlyingPinsAnimation />\n    </header>'
  );
  fs.writeFileSync(appHeaderPath, appHeaderContent, 'utf8');
  console.log('✔ Mounted <FlyingPinsAnimation /> inside AppHeader.tsx');
}

console.log('🎉 Pin Currency & Flying Pins Animation System fully integrated!');
