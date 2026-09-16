'use client';

import React, { useRef, useState, useEffect } from 'react';

interface Props {
  items?: string[];
  /** target horizontal speed in px per second (larger = faster) */
  speedPxPerSec?: number;
  gap?: string | number;
  className?: string;
  itemClassName?: string;
}

const DEFAULT_ITEMS = [
  '✦ ZERO UNVERIFIED RESUMES',
  '✦ 36 CAREER ROADMAPS',
  '✦ 1,080 HANDCRAFTED DAYS',
  '✦ 24/7 SOCRATIC AI MENTORS',
  '✦ MULTIPLAYER CODE WARS',
  '✦ VERIFIABLE SKILL PASSPORTS',
];

/* duplicate once so the loop has no blank seam */
const DUPLICATED = [...DEFAULT_ITEMS, ...DEFAULT_ITEMS];

export default function BrandPromiseTicker({
  items = DEFAULT_ITEMS,
  speedPxPerSec = 60,
  gap = '3rem',
  className = '',
  itemClassName = '',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [durationSec, setDurationSec] = useState(30);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const compute = () => {
      /* one full copy width = distance the animation travels (50% of total duplicated width) */
      const travelPx = el.scrollWidth / 2;
      setDurationSec(Math.max(10, travelPx / speedPxPerSec));
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [speedPxPerSec]);

  const gapStyle = typeof gap === 'number' ? `${gap}px` : gap;

  return (
    <div
      className={`brand-promise-section ${className}`}
      style={{ width: '100%', overflow: 'hidden', background: 'var(--bg-secondary)' }}
      aria-hidden="true"
    >
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <div
          ref={trackRef}
          className={`marquee-track ${itemClassName}`}
          style={{
            display: 'flex',
            gap: gapStyle,
            whiteSpace: 'nowrap',
            width: 'max-content',
            willChange: 'transform',
            animation: `marqueeScroll ${durationSec}s linear infinite`,
          }}
        >
          {DUPLICATED.map((text, i) => (
            <span
              key={i}
              className="marquee-item"
              style={{ flexShrink: 0, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}
            >
              {items[i % items.length]}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
