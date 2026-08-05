'use client';
// PinsBadge — shows current pin balance inline anywhere in the app
// Used in AppShell topbar, pricing page, and feature pages

import { useCareerOS } from '@/lib/context/CareerOSContext';
import Link from 'next/link';
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
    sm: { font: 11, pad: '3px 10px', iconSize: 12, borderRadius: 12 },
    md: { font: 12.5, pad: '5px 14px', iconSize: 14, borderRadius: 16 },
    lg: { font: 14.5, pad: '8px 18px', iconSize: 16, borderRadius: 18 },
  };
  const s = sizes[size];

  const badge = (
    <div
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
          : 'rgba(99, 102, 241, 0.15)',
        border: `1px solid ${
          very_low
            ? 'rgba(239, 68, 68, 0.3)'
            : low
            ? 'rgba(245, 158, 11, 0.3)'
            : 'rgba(99, 102, 241, 0.3)'
        }`,
        color: very_low ? '#ef4444' : low ? '#f59e0b' : '#818cf8',
        fontSize: s.font,
        fontWeight: 800,
        fontFamily: 'var(--font-mono)',
        whiteSpace: 'nowrap',
        cursor: showLink ? 'pointer' : 'default',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <span className="pins-icon-energy" style={{ fontSize: s.iconSize }}>⚡</span>
      <span>{pins.toLocaleString()} Pins</span>
      {very_low && size !== 'sm' && <span style={{ fontSize: s.font - 1, marginLeft: 2 }}>⚠ Low</span>}
    </div>
  );

  if (showLink) {
    return (
      <Link href="/pricing" style={{ textDecoration: 'none' }}>
        {badge}
      </Link>
    );
  }
  return badge;
}
