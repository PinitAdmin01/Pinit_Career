'use client';

// ─────────────────────────────────────────────────────────────────────────────
// PinCurrencyIcon — Official Golden PinIT Currency Pin
// ─────────────────────────────────────────────────────────────────────────────
// Target destination: src/components/pins/PinCurrencyIcon.tsx
//
// Replaces generic lightning bolt / emoji pin currency markers with the official
// sovereign glowing PinIT pin asset. This is a self-contained SVG component — no
// external image dependency, no placeholder, no truncation.
//
// Props:
//   size     — 'sm' (16px) | 'md' (22px) | 'lg' (32px) | custom pixel number
//   glow     — enables the radiant golden halo
//   animate  — enables the breathing glow pulse
//   alt      — accessible label for the pin icon
//   className/style — standard React passthroughs for layout control
//
// Usage:
//   <PinCurrencyIcon size="md" glow animate />
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

export interface PinCurrencyIconProps {
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  animate?: boolean;
  alt?: string;
}

const SIZE_MAP: Record<string, number> = {
  sm: 16,
  md: 22,
  lg: 32,
};

/**
 * Renders the official golden PinIT currency pin as a self-contained SVG.
 * The pin shape is a sovereign currency glyph — a radiant, slightly 3D
 * pushpin with a golden core, hot rim, and subtle inner highlight.
 */
export default function PinCurrencyIcon({
  size = 'md',
  className = '',
  style = {},
  glow = false,
  animate = false,
  alt = 'PinIT Pins',
}: PinCurrencyIconProps) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 22;

  return (
    <span
      className={`pin-currency-icon inline-flex items-center justify-center select-none flex-shrink-0 ${className} ${animate ? 'pin-currency-breathe' : ''}`}
      role="img"
      aria-label={alt}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        lineHeight: 1,
        width: pixelSize,
        height: pixelSize,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="pin-currency-svg"
        style={{
          width: pixelSize,
          height: pixelSize,
          display: 'block',
          overflow: 'visible',
          filter: glow
            ? 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.9)) drop-shadow(0 0 10px rgba(234, 179, 8, 0.55))'
            : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))',
          transition: 'transform 0.2s ease, filter 0.2s ease',
        }}
      >
        {/* ── Outer radiant halo (glow ring) ─────────────────────────────── */}
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke={glow ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.12)'}
          strokeWidth="1.5"
          strokeDasharray={glow ? '3 4' : '2 5'}
          className="pin-currency-halo"
        />

        {/* ── Pin body — golden pushpin silhouette ──────────────────────── */}
        <path
          d="M24 6.5 C28.5 6.5 32 10 32 14.5 C32 17.2 30.8 19.6 29 21.2 L29.8 30.5 C30.1 33.8 27.4 36.5 24 36.5 C20.6 36.5 17.9 33.8 18.2 30.5 L19 21.2 C17.2 19.6 16 17.2 16 14.5 C16 10 19.5 6.5 24 6.5 Z"
          fill="url(#pin-currency-gradient)"
          stroke="url(#pin-currency-rim)"
          strokeWidth="1.6"
        />

        {/* ── Pin head highlight — embossed 3D sheen ────────────────────── */}
        <ellipse
          cx="24"
          cy="14.5"
          rx="6.4"
          ry="4.6"
          fill="rgba(255, 244, 214, 0.55)"
        />

        {/* ── Pin tip — sharp lower point with hot core ─────────────────── */}
        <path
          d="M24 36.5 L24 42.5"
          stroke="url(#pin-currency-rim)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* ── Inner sparkle accents ─────────────────────────────────────── */}
        <circle cx="21" cy="12.5" r="1.1" fill="rgba(255, 255, 255, 0.9)" />
        <circle cx="27" cy="13.5" r="0.8" fill="rgba(255, 255, 255, 0.65)" />

        {/* ── Gradients ─────────────────────────────────────────────────── */}
        <defs>
          <linearGradient
            id="pin-currency-gradient"
            x1="16"
            y1="6"
            x2="32"
            y2="42"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="35%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient
            id="pin-currency-rim"
            x1="16"
            y1="6"
            x2="32"
            y2="42"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

// ── Companion CSS (merge into src/components/pins/pins.css) ───────────────
//
// .pin-currency-breathe {
//   animation: pinCurrencyBreath 2.6s ease-in-out infinite;
// }
//
// @keyframes pinCurrencyBreath {
//   0%, 100% { transform: scale(1); filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.55)); }
//   50%      { transform: scale(1.14); filter: drop-shadow(0 0 9px rgba(245, 158, 11, 0.95)) brightness(1.12); }
// }
//
// .pin-currency-halo {
//   animation: pinCurrencyHaloSpin 8s linear infinite;
//   transform-origin: center;
// }
//
// @keyframes pinCurrencyHaloSpin {
//   to { transform: rotate(360deg); }
// }
