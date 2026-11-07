'use client';

import React from 'react';

interface MissionsHeaderProps {
  theme: {
    bg: string;
    bgCard: string;
    bgInside: string;
    border: string;
    tPrimary: string;
    tSecondary: string;
    tTertiary: string;
    accentLight: string;
  };
  xp: number;
  missionOnlyStreak: number;
}

export default function MissionsHeader({ theme, xp, missionOnlyStreak }: MissionsHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div className="page-header" style={{ marginBottom: 0 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26.5,
            fontWeight: 800,
            color: theme.tPrimary,
            margin: 0,
            letterSpacing: '-0.3px',
          }}
        >
          Daily Missions
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              const doc = document.documentElement;
              const isDark = doc.getAttribute('data-theme') === 'dark';
              doc.setAttribute('data-theme', isDark ? 'light' : 'dark');
              window.dispatchEvent(new Event('theme-change'));
            }
          }}
          style={{
            background: theme.bgInside,
            border: `1.5px solid ${theme.border}`,
            color: theme.tPrimary,
            padding: '8px 16px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s',
          }}
        >
          🌓 Toggle Theme
        </button>

        {/* Global XP & Real Mission Streak Badges */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div
            style={{
              background: theme.bgCard,
              border: `1.5px solid ${theme.border}`,
              padding: '8px 16px',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                background: 'rgba(234, 179, 8, 0.12)',
                borderRadius: 8,
                padding: '4px 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 16 }}>⭐</span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'var(--yellow)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.1,
                }}
              >
                {xp}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: theme.tTertiary,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Total XP
              </div>
            </div>
          </div>

          <div
            style={{
              background: theme.bgCard,
              border: `1.5px solid ${theme.border}`,
              padding: '8px 16px',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                borderRadius: 8,
                padding: '4px 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 16 }}>🔥</span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'var(--red)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.1,
                }}
              >
                {missionOnlyStreak}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: theme.tTertiary,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Day Streak
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
