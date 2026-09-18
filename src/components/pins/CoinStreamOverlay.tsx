'use client';

import React, { useEffect, useState, useRef } from 'react';

interface FlyingCoin {
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
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
  size: number;
}

export default function CoinStreamOverlay() {
  const [coins, setCoins] = useState<FlyingCoin[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const nextIdRef = useRef(1);

  useEffect(() => {
    function handleStream(e: Event) {
      const customEvent = e as CustomEvent<{
        sourceCoords?: { x: number; y: number } | null;
        targetCoords?: { x: number; y: number } | null;
        count?: number;
      }>;

      const detail = customEvent.detail || {};
      const count = Math.min(30, Math.max(8, detail.count || 18));

      // 1. Resolve start position
      let startX = detail.sourceCoords?.x;
      let startY = detail.sourceCoords?.y;

      if (!startX || !startY) {
        startX = window.innerWidth / 2;
        startY = window.innerHeight * 0.7;
      }

      // 2. Resolve destination position (priority: #topbar-pins-badge -> #active-daily-pins-badge -> fallback)
      let endX = detail.targetCoords?.x;
      let endY = detail.targetCoords?.y;

      if (!endX || !endY) {
        const topbarBadge = document.getElementById('topbar-pins-badge');
        const activeDailyBadge = document.getElementById('active-daily-pins-badge');
        const targetEl = topbarBadge || activeDailyBadge;

        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          endX = rect.left + rect.width / 2;
          endY = rect.top + rect.height / 2;
        } else {
          endX = window.innerWidth - 90;
          endY = 32;
        }
      }

      // 3. Generate flying coins batch
      const newCoins: FlyingCoin[] = [];
      for (let i = 0; i < count; i++) {
        const coinId = nextIdRef.current++;

        // Upward arched bezier curve with random horizontal spread
        const midX = (startX + endX) / 2;
        const midY = Math.min(startY, endY);
        const arcSpread = (Math.random() - 0.5) * 180;
        const arcHeight = 120 + Math.random() * 120;

        newCoins.push({
          id: coinId,
          startX,
          startY,
          endX,
          endY,
          controlX: midX + arcSpread,
          controlY: Math.max(10, midY - arcHeight),
          delay: i * 45, // Staggered release
          duration: 750 + Math.random() * 200,
          size: 26 + Math.random() * 8,
        });

        // Trigger target impact ripple when coins arrive
        setTimeout(() => {
          const targetEl = document.getElementById('topbar-pins-badge') || document.getElementById('active-daily-pins-badge');
          if (targetEl) {
            targetEl.classList.remove('pins-gold-impact-pulse');
            // Force reflow
            void targetEl.offsetWidth;
            targetEl.classList.add('pins-gold-impact-pulse');
          }

          // Spawn landing golden sparkles around target
          if (i % 2 === 0) {
            spawnTargetSparkle(endX, endY);
          }
        }, i * 45 + 750);
      }

      setCoins(prev => [...prev, ...newCoins]);

      // Clean up coins after flight
      const maxFlightTime = (count * 45) + 1200;
      setTimeout(() => {
        setCoins(prev => prev.filter(c => !newCoins.some(nc => nc.id === c.id)));
      }, maxFlightTime);
    }

    function spawnTargetSparkle(x: number, y: number) {
      const sparkleChars = ['✦', '★', '✨', '•'];
      const colors = ['#f59e0b', '#fbbf24', '#fef08a', '#eab308'];
      const newSparkles: Sparkle[] = [];

      for (let s = 0; s < 3; s++) {
        newSparkles.push({
          id: nextIdRef.current++,
          x: x + (Math.random() - 0.5) * 60,
          y: y + (Math.random() - 0.5) * 40,
          char: sparkleChars[Math.floor(Math.random() * sparkleChars.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 10 + Math.random() * 12,
        });
      }

      setSparkles(prev => [...prev, ...newSparkles]);
      setTimeout(() => {
        setSparkles(prev => prev.filter(sp => !newSparkles.some(nsp => nsp.id === sp.id)));
      }, 700);
    }

    window.addEventListener('pinit:coin-stream', handleStream);
    return () => {
      window.removeEventListener('pinit:coin-stream', handleStream);
    };
  }, []);

  if (coins.length === 0 && sparkles.length === 0) {
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
      {/* Flying Golden Coins */}
      {coins.map(coin => (
        <FlyingCoinItem key={coin.id} coin={coin} />
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
          }}
        >
          {sp.char}
        </div>
      ))}
    </div>
  );
}

function FlyingCoinItem({ coin }: { coin: FlyingCoin }) {
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
        const progress = Math.min(1, elapsed / coin.duration);

        // Quadratic Bezier interpolation: B(t) = (1-t)^2*P0 + 2*(1-t)*t*P1 + t^2*P2
        const t = progress;
        const invT = 1 - t;
        const x = invT * invT * coin.startX + 2 * invT * t * coin.controlX + t * t * coin.endX;
        const y = invT * invT * coin.startY + 2 * invT * t * coin.controlY + t * t * coin.endY;

        // Scale up initially, then scale to 0.85 as it enters the coin slot
        const scale = t < 0.2 ? (t / 0.2) * 1.25 : 1.25 - (t - 0.2) * 0.45;
        const rotate = t * 720; // 2 full spins

        if (el) {
          el.style.transform = `translate3d(${x - coin.size / 2}px, ${y - coin.size / 2}px, 0) scale(${scale}) rotateZ(${rotate}deg)`;
        }

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else if (el) {
          el.style.opacity = '0';
        }
      }

      animId = requestAnimationFrame(step);
    }, coin.delay);

    return () => {
      clearTimeout(timeout);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [coin]);

  return (
    <div
      ref={elRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: coin.size,
        height: coin.size,
        opacity: 0,
        willChange: 'transform, opacity',
        filter: 'drop-shadow(0 0 10px #f59e0b) drop-shadow(0 0 20px #fbbf24)',
        zIndex: 1000,
      }}
    >
      <img
        src="/brand/pinit-coin.png"
        alt=""
        width={coin.size}
        height={coin.size}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          boxShadow: '0 0 14px rgba(245, 158, 11, 0.9), 0 0 24px rgba(234, 179, 8, 0.7)',
        }}
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.endsWith('.jpg')) target.src = '/brand/pinit-coin.jpg';
        }}
      />
    </div>
  );
}
