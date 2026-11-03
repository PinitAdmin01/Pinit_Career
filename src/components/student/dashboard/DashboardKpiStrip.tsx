'use client';

import React from 'react';
import Link from 'next/link';

interface Props {
  streak: number;
  pins: number;
  xp: number;
  trustScore: number;
  attendancePct: number;
  verifiedVaultCount: number;
}

export default function DashboardKpiStrip({
  streak = 1,
  pins = 0,
  xp = 0,
  trustScore = 75,
  attendancePct = 85,
  verifiedVaultCount = 0,
}: Props) {
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpToNext = 100 - (xp % 100);

  const KPIS = [
    {
      id: 'streak',
      label: 'FOCUS STREAK',
      value: `${streak} ${streak === 1 ? 'Day' : 'Days'}`,
      badge: '🔥 Active',
      badgeColor: '#f59e0b',
      subtext: 'Daily micro-habit record',
      href: '/missions',
      accent: 'var(--amber)',
    },
    {
      id: 'pins',
      label: 'WALLET BALANCE',
      value: `${pins} Pins`,
      badge: '🪙 Store',
      badgeColor: '#eab308',
      subtext: 'Earned via quests & streak',
      href: '/pins',
      accent: '#eab308',
    },
    {
      id: 'mastery',
      label: 'STUDENT MASTERY',
      value: `Level ${currentLevel}`,
      badge: `⚡ ${xp} XP`,
      badgeColor: 'var(--accent)',
      subtext: `${xpToNext} XP to Level ${currentLevel + 1}`,
      href: '/quests',
      accent: 'var(--accent)',
    },
    {
      id: 'trust',
      label: 'TRUST QUOTIENT',
      value: `${Math.round(trustScore)}%`,
      badge: verifiedVaultCount > 0 ? `🛡️ ${verifiedVaultCount} Verified` : '🛡️ Baseline',
      badgeColor: '#10b981',
      subtext: 'Institutional accreditation',
      href: '/trust',
      accent: '#10b981',
    },
    {
      id: 'attendance',
      label: 'CAMPUS ATTENDANCE',
      value: `${attendancePct}%`,
      badge: attendancePct >= 75 ? '✓ Exam Safe' : '⚠️ Warning',
      badgeColor: attendancePct >= 75 ? '#10b981' : '#ef4444',
      subtext: '75% mandatory threshold',
      href: '/profile?tab=activity',
      accent: attendancePct >= 75 ? '#10b981' : '#ef4444',
    },
  ];

  return (
    <div
      data-testid="dashboard-kpi-strip"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        width: '100%',
      }}
    >
      {KPIS.map((kpi) => (
        <Link
          key={kpi.id}
          href={kpi.href}
          style={{ textDecoration: 'none' }}
          aria-label={`${kpi.label}: ${kpi.value}`}
        >
          <div
            className="db-glass"
            style={{
              padding: '12px 16px',
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 6,
              cursor: 'pointer',
              borderTop: `2.5px solid ${kpi.accent}`,
              transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
              height: '100%',
              background: 'var(--dash-card)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.8px',
                  color: 'var(--t3)',
                }}
              >
                {kpi.label}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  color: kpi.badgeColor,
                  background: `${kpi.badgeColor}18`,
                  padding: '2px 6px',
                  borderRadius: 5,
                  whiteSpace: 'nowrap',
                }}
              >
                {kpi.badge}
              </span>
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                color: 'var(--t1)',
                letterSpacing: '-0.3px',
                lineHeight: 1.2,
              }}
            >
              {kpi.value}
            </div>

            <div
              style={{
                fontSize: 11,
                color: 'var(--t3)',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {kpi.subtext}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
