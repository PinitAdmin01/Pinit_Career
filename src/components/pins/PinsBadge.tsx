'use client';
// PinsBadge — shows current pin balance inline anywhere in the app
// Used in AppShell topbar, pricing page, and feature pages

import { useCareerOS } from '@/lib/context/CareerOSContext';
import Link from 'next/link';
import PinCurrencyIcon from '@/components/pins/PinCurrencyIcon';
import './pins.css';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showLink?: boolean;
  className?: string;
}

export default function PinsBadge({ size = 'md', showLink = false, className }: Props) {
  const { pins } = useCareerOS();

  const low = pins < 20;
  const very_low = pins < 5;

  const sizes = {
    sm: { font: 11, pad: '3px 10px', iconSize: 15, borderRadius: 12 },
    md: { font: 12.5, pad: '5px 14px', iconSize: 18, borderRadius: 16 },
    lg: { font: 14.5, pad: '8px 18px', iconSize: 22, borderRadius: 18 },
  };
  const s = sizes[size];

  const badge = (
    <div
      id="topbar-pins-badge"
      data-pins-badge="true"
      className={`${className || ''} ${!very_low && !low ? 'pins-badge-glow' : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: s.pad,
        borderRadius: s.borderRadius,
        background: very_low
          ? 'rgba(239, 68, 68, 0.15)'
          : low
          ? 'rgba(245, 158, 11, 0.15)'
          : 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.08) 100%)',
        border: `1px solid ${
          very_low
            ? 'rgba(239, 68, 68, 0.3)'
            : low
            ? 'rgba(245, 158, 11, 0.3)'
            : 'rgba(245, 158, 11, 0.35)'
        }`,
        color: very_low ? '#ef4444' : low ? '#f59e0b' : '#fbbf24',
        fontSize: s.font,
        fontWeight: 800,
        fontFamily: 'var(--font-mono)',
        whiteSpace: 'nowrap',
        cursor: showLink ? 'pointer' : 'default',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <PinCurrencyIcon size={s.iconSize} glow={!very_low} animate={!very_low && !low} />
      <span>{pins.toLocaleString()} Pins</span>
      {very_low && size !== 'sm' && <span style={{ fontSize: s.font - 1, marginLeft: 2 }}>⚠ Low</span>}
    </div>
  );

  if (showLink) {
    return (
      <Link href="/pins" style={{ textDecoration: 'none' }}>
        {badge}
      </Link>
    );
  }
  return badge;
}
