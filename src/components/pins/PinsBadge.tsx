'use client';
// PinsBadge — shows current pin balance inline anywhere in the app
// Used in AppShell topbar, pricing page, and feature pages

import React from 'react';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import Link from 'next/link';
import PinCoin from '@/components/pins/PinCoin';
import { DAILY_PIN_CAP } from '@/lib/pins/pinWalletRules';
import './pins.css';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showLink?: boolean;
  className?: string;
}

export default function PinsBadge({ size = 'md', showLink = false, className }: Props) {
  const { pins, bonusPins } = useCareerOS();
  const currentPins = Math.max(0, pins || 0);
  const vaultPins = Math.max(0, bonusPins || 0);

  // Warning state strictly reflects Current Pins (used for all features), NEVER Bonus Vault
  const low = currentPins < 25;
  const very_low = currentPins < 10;

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
      title={
        vaultPins > 0
          ? `Current Pins: ${currentPins}/${DAILY_PIN_CAP} (used for all features, resets daily at 1:00 AM IST) · Bonus Vault: ${vaultPins.toLocaleString()} (click to refill)`
          : `Current Pins: ${currentPins}/${DAILY_PIN_CAP} (used for all features, resets daily at 1:00 AM IST)`
      }
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
      <PinCoin size={s.iconSize} glow={!very_low} animate={!very_low && !low} />
      <span>{currentPins}/{DAILY_PIN_CAP} Pins</span>
      {vaultPins > 0 && (
        <span
          style={{
            fontSize: Math.max(10, s.font - 2),
            padding: '1px 6px',
            borderRadius: 999,
            background: 'rgba(16, 185, 129, 0.18)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            fontWeight: 700,
          }}
        >
          +{vaultPins.toLocaleString()} Bonus
        </span>
      )}
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
