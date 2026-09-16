'use client';

import React from 'react';

export type LeagueTier = 'browns' | 'silver' | 'gold' | 'platinum' | 'ruby';

export interface LeagueMeta {
  tier: LeagueTier;
  title: string;
  slogan: string;
  color: string;
  glowColor: string;
  bgGradient: string;
  spritePosition: string;
  nextTier: LeagueTier | null;
  prevTier: LeagueTier | null;
}

export const LEAGUE_CONFIGS: Record<LeagueTier, LeagueMeta> = {
  browns: {
    tier: 'browns',
    title: 'Browns League',
    slogan: 'Start · Learn · Grow',
    color: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    bgGradient: 'linear-gradient(135deg, rgba(217,119,6,0.15) 0%, rgba(180,83,9,0.08) 100%)',
    spritePosition: '0% 0%',
    nextTier: 'silver',
    prevTier: null,
  },
  silver: {
    tier: 'silver',
    title: 'Silver League',
    slogan: 'Practice · Improve · Belong',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(14,165,233,0.08) 100%)',
    spritePosition: '25% 0%',
    nextTier: 'gold',
    prevTier: 'browns',
  },
  gold: {
    tier: 'gold',
    title: 'Gold League',
    slogan: 'Skill · Achieve · Lead',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.55)',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(217,119,6,0.10) 100%)',
    spritePosition: '50% 0%',
    nextTier: 'platinum',
    prevTier: 'silver',
  },
  platinum: {
    tier: 'platinum',
    title: 'Platinum League',
    slogan: 'Excel · Create · Inspire',
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(96,165,250,0.18) 0%, rgba(37,99,235,0.10) 100%)',
    spritePosition: '75% 0%',
    nextTier: 'ruby',
    prevTier: 'gold',
  },
  ruby: {
    tier: 'ruby',
    title: 'Ruby League',
    slogan: 'Elite · Impact · Legend',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.22) 0%, rgba(185,28,28,0.12) 100%)',
    spritePosition: '100% 0%',
    nextTier: null,
    prevTier: 'platinum',
  },
};

const SIZE_PRESETS = {
  xs: { width: 22, height: 36 },
  sm: { width: 32, height: 53 },
  md: { width: 44, height: 73 },
  lg: { width: 68, height: 113 },
  xl: { width: 96, height: 160 },
};

export interface LeagueBadgeProps {
  tier?: LeagueTier | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showLabel?: boolean;
  showSlogan?: boolean;
  glow?: boolean;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function normalizeLeagueTier(raw?: string | null): LeagueTier {
  if (!raw) return 'browns';
  const lower = raw.toLowerCase().trim();
  if (lower.includes('ruby') || lower.includes('budy') || lower.includes('diamond')) return 'ruby';
  if (lower.includes('platinum')) return 'platinum';
  if (lower.includes('gold')) return 'gold';
  if (lower.includes('silver')) return 'silver';
  return 'browns';
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LeagueBadge: Sovereign 3D League Heraldry Badge
 * ─────────────────────────────────────────────────────────────────────────────
 * Accurately crops and displays the 5 official leagues from the master artwork
 * via hardware-accelerated CSS sprite positioning with responsive dimensions.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function LeagueBadge({
  tier = 'browns',
  size = 'md',
  showLabel = false,
  showSlogan = false,
  glow = false,
  animate = false,
  className = '',
  style = {},
}: LeagueBadgeProps) {
  const normTier = normalizeLeagueTier(tier);
  const meta = LEAGUE_CONFIGS[normTier];

  const dimensions = typeof size === 'number'
    ? { width: size, height: Math.round(size / 0.6) }
    : SIZE_PRESETS[size] || SIZE_PRESETS.md;

  const badgeElement = (
    <div
      className={`league-badge-sprite ${className} ${animate ? 'league-badge-breathe' : ''}`}
      title={`${meta.title} — ${meta.slogan}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundImage: "url('/brand/leagues/all-leagues.png')",
        backgroundSize: '500% 100%',
        backgroundPosition: meta.spritePosition,
        backgroundRepeat: 'no-repeat',
        filter: glow ? `drop-shadow(0 0 10px ${meta.glowColor}) drop-shadow(0 0 20px ${meta.glowColor})` : 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))',
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        transition: 'transform 0.2s ease, filter 0.2s ease',
        ...style,
      }}
    />
  );

  if (!showLabel && !showSlogan) {
    return badgeElement;
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      {badgeElement}
      <div>
        {showLabel && (
          <div style={{ fontSize: 13, fontWeight: 900, color: meta.color, letterSpacing: '0.02em', lineHeight: 1.2 }}>
            {meta.title}
          </div>
        )}
        {showSlogan && (
          <div style={{ fontSize: 10.5, color: 'var(--t3)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2 }}>
            {meta.slogan}
          </div>
        )}
      </div>
    </div>
  );
}
