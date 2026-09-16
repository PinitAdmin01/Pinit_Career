'use client';

import React from 'react';

export interface PinCoinProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  animate?: boolean;
  alt?: string;
}

const SIZE_MAP: Record<string, number> = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 38,
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PinCoin: Official PinIT 3D Golden Currency Coin
 * ─────────────────────────────────────────────────────────────────────────────
 * Replaces generic lightning emojis (⚡) with the sovereign golden PinIT coin.
 * Features a circular border-radius clip, 3D embossed lighting, and optional
 * golden halo drop-shadow glow.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function PinCoin({
  size = 'md',
  className = '',
  style = {},
  glow = false,
  animate = false,
  alt = 'PinIT Pins',
}: PinCoinProps) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 22;

  return (
    <span
      className={`inline-flex items-center justify-center select-none flex-shrink-0 ${className} ${animate ? 'pinit-coin-spin' : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        lineHeight: 1,
        width: pixelSize,
        height: pixelSize,
        ...style,
      }}
    >
      <img
        src="/brand/pinit-coin.png"
        alt={alt}
        width={pixelSize}
        height={pixelSize}
        loading="eager"
        decoding="async"
        style={{
          width: pixelSize,
          height: pixelSize,
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          boxShadow: glow
            ? '0 0 10px rgba(245, 158, 11, 0.7), 0 0 20px rgba(217, 119, 6, 0.4)'
            : '0 1px 3px rgba(0, 0, 0, 0.35)',
          filter: glow
            ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.8)) brightness(1.05)'
            : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
          transition: 'transform 0.2s ease, filter 0.2s ease',
        }}
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.endsWith('.jpg')) {
            target.src = '/brand/pinit-coin.jpg';
          }
        }}
      />
    </span>
  );
}
