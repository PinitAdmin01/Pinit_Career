'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import PinCurrencyIcon from './PinCurrencyIcon';

// ── Types ──────────────────────────────────────────────────────────────────
interface FlyingPin {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX: number;
  controlY: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

interface PinSparkle {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
  size: number;
}

interface PinStreamEventDetail {
  sourceCoords?: { x: number; y: number } | null;
  targetCoords?: { x: number; y: number } | null;
  sourceElement?: HTMLElement | null;
  targetElement?: HTMLElement | null;
  count?: number;
  onComplete?: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const PIN_SPARKLE_CHARS = ['✦', '★', '✨', '✧', '◆'];
const PIN_SPARKLE_COLORS = ['#f59e0b', '#fbbf24', '#fef08a', '#eab308', '#fde68a'];

function getElementCenter(el: HTMLElement | null): { x: number; y: number } | null {
  if (!el) return null;
  try {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  } catch {
    return null;
  }
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FlyingPinsAnimation — Sovereign Pin Stream Animation
 * ─────────────────────────────────────────────────────────────────────────────
 * Target destination: src/components/pins/FlyingPinsAnimation.tsx
 * Mounted in: src/components/ui/AppHeader.tsx (alongside existing CoinStreamOverlay)
 *
 * When a student completes a pin purchase or claims bonus pins, this component
 * listens for the 'pinit:pin-stream' custom event and spawns 8–15 radiant,
 * golden glowing pin particles that fly along curved bezier paths from the
 * purchase/claim button up into the header Pin counter badge.
 *
 * On arrival, the header counter triggers a golden pulse/scale vibration
 * (via the 'pins-gold-impact-pulse' CSS class) and the pin count updates
 * automatically through the existing CareerOSContext → useCareerOS → pins flow.
 *
 * Clean cleanup: every pin is removed from state on animation end;
 * the component unmounts cleanly with no orphaned DOM nodes.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function FlyingPinsAnimation() {
  const [pins, setPins] = useState<FlyingPin[]>([]);
  const [sparkles, setSparkles] = useState<PinSparkle[]>([]);
  const nextIdRef = useRef(1);
  const animFramesRef = useRef<number[]>([]);

  // ── Spawn landing sparkles at the target ─────────────────────────────
  const spawnTargetSparkles = useCallback((x: number, y: number) => {
    const newSparkles: PinSparkle[] = [];
    for (let s = 0; s < 3; s++) {
      newSparkles.push({
        id: nextIdRef.current++,
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 40,
        char: PIN_SPARKLE_CHARS[Math.floor(Math.random() * PIN_SPARKLE_CHARS.length)],
        color: PIN_SPARKLE_COLORS[Math.floor(Math.random() * PIN_SPARKLE_COLORS.length)],
        size: 10 + Math.random() * 14,
      });
    }
    setSparkles(prev => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(sp => !newSparkles.some(nsp => nsp.id === sp.id)));
    }, 750);
  }, []);

  // ── Trigger golden impact pulse on the header pin badge ────────────────
  const triggerBadgePulse = useCallback((targetEl: HTMLElement | null) => {
    if (!targetEl) return;
    // Remove then re-add to force reflow restart of CSS animation
    targetEl.classList.remove('pins-gold-impact-pulse');
    void targetEl.offsetWidth; // force reflow
    targetEl.classList.add('pins-gold-impact-pulse');

    // Remove class after animation ends so it can re-trigger
    const onEnd = () => {
      targetEl.classList.remove('pins-gold-impact-pulse');
      targetEl.removeEventListener('animationend', onEnd);
    };
    targetEl.addEventListener('animationend', onEnd);
  }, []);

  // ── Handle pin stream event ──────────────────────────────────────────
  useEffect(() => {
    function handleStream(e: Event) {
      const detail = (e as CustomEvent<PinStreamEventDetail>).detail || {};
      const count = Math.min(20, Math.max(8, detail.count || 16));

      // Resolve start position
      let startX = detail.sourceCoords?.x;
      let startY = detail.sourceCoords?.y;
      if (!startX || !startY) {
        const srcEl = detail.sourceElement || null;
        const srcCenter = getElementCenter(srcEl);
        if (srcCenter) { startX = srcCenter.x; startY = srcCenter.y; }
      }
      if (!startX || !startY) {
        startX = window.innerWidth / 2;
        startY = window.innerHeight * 0.72;
      }

      // Resolve destination position (header pin badge)
      let endX = detail.targetCoords?.x;
      let endY = detail.targetCoords?.y;
      if (!endX || !endY) {
        const targetEl = document.getElementById('topbar-pins-badge');
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          endX = rect.left + rect.width / 2;
          endY = rect.top + rect.height / 2;
        } else {
          endX = window.innerWidth - 100;
          endY = 36;
        }
      }

      // Resolve target element reference for pulse trigger
      const targetEl = document.getElementById('topbar-pins-badge');

      // Generate flying pin batch
      const newPins: FlyingPin[] = [];
      for (let i = 0; i < count; i++) {
        const pinId = nextIdRef.current++;

        // Upward arched bezier with horizontal randomness
        const midX = (startX + endX) / 2;
        const midY = Math.min(startY, endY);
        const arcSpread = (Math.random() - 0.5) * 200;
        const arcHeight = 150 + Math.random() * 150;
        const rotAngle = 360 + Math.random() * 360; // 1+ full rotations

        newPins.push({
          id: pinId,
          startX,
          startY,
          endX,
          endY,
          controlX: midX + arcSpread,
          controlY: Math.max(10, midY - arcHeight),
          delay: i * 50,
          duration: 800 + Math.random() * 200,
          size: 20 + Math.random() * 8,
          rotation: rotAngle,
        });

        // Trigger impact pulse + sparkles on arrival
        setTimeout(() => {
          triggerBadgePulse(targetEl);
          if (i % 2 === 0) {
            spawnTargetSparkles(endX, endY);
          }
        }, i * 50 + 800);
      }

      setPins(prev => [...prev, ...newPins]);

      // Clean up coins after all flights complete
      const maxFlightTime = count * 50 + 1200;
      setTimeout(() => {
        setPins(prev => prev.filter(c => !newPins.some(nc => nc.id === c.id)));
      }, maxFlightTime);

      // Invoke onComplete callback
      if (detail.onComplete) {
        setTimeout(detail.onComplete, maxFlightTime);
      }
    }

    window.addEventListener('pinit:pin-stream', handleStream as EventListener);
    window.addEventListener('pinit:coin-stream', handleStream as EventListener);
    return () => {
      window.removeEventListener('pinit:pin-stream', handleStream as EventListener);
      window.removeEventListener('pinit:coin-stream', handleStream as EventListener);
      // Cancel all pending animation frames on unmount
      animFramesRef.current.forEach(id => cancelAnimationFrame(id));
      animFramesRef.current = [];
    };
  }, [triggerBadgePulse, spawnTargetSparkles]);

  if (pins.length === 0 && sparkles.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Flying Pin Particles */}
      {pins.map(pin => (
        <FlyingPinItem key={pin.id} pin={pin} />
      ))}

      {/* Target Impact Sparkles */}
      {sparkles.map(sp => (
        <div
          key={sp.id}
          style={{
            position: 'absolute',
            left: sp.x,
            top: sp.y,
            color: sp.color,
            fontSize: sp.size,
            fontWeight: 900,
            textShadow: `0 0 8px ${sp.color}, 0 0 16px ${sp.color}`,
            animation: 'goldSparkleFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          {sp.char}
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// FlyingPinItem — Individual pin particle with quadratic bezier flight
// ──────────────────────────────────────────────────────────────────────────
function FlyingPinItem({ pin }: { pin: FlyingPin }) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let startTime: number | null = null;
    let animId: number;

    const timeout = setTimeout(() => {
      el.style.opacity = '1';

      function step(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / pin.duration);

        // Quadratic Bezier interpolation: B(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
        const t = progress;
        const invT = 1 - t;
        const x = invT * invT * pin.startX + 2 * invT * t * pin.controlX + t * t * pin.endX;
        const y = invT * invT * pin.startY + 2 * invT * t * pin.controlY + t * t * pin.endY;

        // Scale up initially, then settle as it enters the coin slot
        const scale = t < 0.15 ? (t / 0.15) * 1.3 : 1.3 - (t - 0.15) * 0.35;
        const rotate = pin.rotation * t;

        if (el) {
          el.style.transform =
            `translate3d(${x - pin.size / 2}px, ${y - pin.size / 2}px, 0) scale(${scale}) rotateZ(${rotate}deg)`;
        }

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else if (el) {
          el.style.opacity = '0';
        }
      }

      animId = requestAnimationFrame(step);
    }, pin.delay);

    return () => {
      clearTimeout(timeout);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [pin]);

  return (
    <div
      ref={elRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: pin.size,
        height: pin.size,
        opacity: 0,
        willChange: 'transform, opacity',
        filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.95)) drop-shadow(0 0 18px rgba(234, 179, 8, 0.7))',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <PinCurrencyIcon
        size={pin.size}
        glow
        animate={false}
        alt="Flying Pin"
      />
    </div>
  );
}

// ── Trigger helper (mirrors coinAnimation.ts pattern) ────────────────────
// This function is what purchase/claim handlers should call to emit
// the flying-pin stream. Import and use in src/app/pins/page.tsx,
// src/lib/hooks/usePinBalance.ts, src/app/api/payment/verify/route.ts, etc.
//
// export function triggerPinStream(options: PinStreamEventDetail = {}) {
//   if (typeof window === 'undefined') return;
//   const event = new CustomEvent('pinit:pin-stream', { detail: options });
//   window.dispatchEvent(event);
// }
