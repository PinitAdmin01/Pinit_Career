'use client';

import React from 'react';
import Link from 'next/link';
import MissionsArchetypeMatrix from '@/components/missions/MissionsArchetypeMatrix';
import MissionsGrowthRadar from '@/components/missions/MissionsGrowthRadar';

interface MissionsStreakPanelProps {
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
  completedCount: number;
  gapClosurePct: number;
  onboardingAnswers: any;
  user: any;
  hoveredQuadrant: string | null;
  setHoveredQuadrant: (q: string | null) => void;
  selectedQuadrant: string | null;
  setSelectedQuadrant: (q: string | null) => void;
  hoveredRadarMetric: string | null;
  setHoveredRadarMetric: (m: string | null) => void;
  setActiveTab: (tab: 'evolve' | 'language' | 'history') => void;
  teacher: { name: string; emoji: string };
}

export default function MissionsStreakPanel({
  theme,
  xp,
  missionOnlyStreak,
  completedCount,
  gapClosurePct,
  onboardingAnswers,
  user,
  hoveredQuadrant,
  setHoveredQuadrant,
  selectedQuadrant,
  setSelectedQuadrant,
  hoveredRadarMetric,
  setHoveredRadarMetric,
  setActiveTab,
  teacher,
}: MissionsStreakPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Mission Insights panel */}
      <div
        style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          padding: 22,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: theme.tTertiary,
            fontFamily: 'var(--font-mono)',
            display: 'block',
            marginBottom: 14,
          }}
        >
          📊 Mission Insights
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Daily XP Target */}
          <div>
            <div
              style={{
                display: 'flex',
                fontSize: 12,
                fontWeight: 700,
                color: theme.tSecondary,
                marginBottom: 6,
                justifyContent: 'space-between',
              }}
            >
              <span>Daily XP Goal</span>
              <span style={{ color: 'var(--teal)' }}>{completedCount * 25} / 100 XP</span>
            </div>
            <div style={{ height: 6, background: theme.bgInside, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, completedCount * 25)}%`,
                  background: 'var(--teal)',
                  borderRadius: 3,
                }}
              />
            </div>
          </div>

          {/* Gap Closure progress */}
          <div>
            <div
              style={{
                display: 'flex',
                fontSize: 12,
                fontWeight: 700,
                color: theme.tSecondary,
                marginBottom: 6,
                justifyContent: 'space-between',
              }}
            >
              <span>Target Gap Closure</span>
              <span style={{ color: 'var(--accent)' }}>{gapClosurePct}%</span>
            </div>
            <div style={{ height: 6, background: theme.bgInside, borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${gapClosurePct}%`,
                  background: 'var(--accent)',
                  borderRadius: 3,
                }}
              />
            </div>
            <p style={{ fontSize: 11, color: theme.tTertiary, lineHeight: 1.4, marginTop: 6, marginBlockEnd: 0 }}>
              Each completed mission satisfies verified skills requirements mapping to your Digital Twin.
            </p>
          </div>

          {/* Target Alignment Card */}
          <div
            style={{
              background: theme.bgInside,
              padding: 14,
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: theme.tTertiary,
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                marginBottom: 4,
              }}
            >
              Target Alignment Path
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.tPrimary }}>
              {onboardingAnswers?.role || 'Not Configured'}
            </div>
            {!onboardingAnswers?.hasCompleted && (
              <Link
                href="/career-twin"
                style={{
                  fontSize: 11,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  display: 'block',
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                Configure Twin Roadmap ➔
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Plus Shape Human Archetype Matrix Chart Component */}
      <MissionsArchetypeMatrix
        theme={theme}
        onboardingAnswers={onboardingAnswers}
        user={user}
        hoveredQuadrant={hoveredQuadrant}
        setHoveredQuadrant={setHoveredQuadrant}
        selectedQuadrant={selectedQuadrant}
        setSelectedQuadrant={setSelectedQuadrant}
      />

      {/* Mindset Competency Growth Radar Chart Component */}
      <MissionsGrowthRadar
        theme={theme}
        onboardingAnswers={onboardingAnswers}
        user={user}
        hoveredRadarMetric={hoveredRadarMetric}
        setHoveredRadarMetric={setHoveredRadarMetric}
        setActiveTab={setActiveTab}
      />

      {/* Quick Help Card */}
      <div
        style={{
          background: theme.bgInside,
          border: `1px dashed ${theme.border}`,
          borderRadius: 20,
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 16 }}>{teacher.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: theme.tPrimary }}>{teacher.name}'s Tip</span>
        </div>
        <p style={{ fontSize: 11.5, color: theme.tSecondary, lineHeight: 1.5, margin: 0 }}>
          &ldquo;Completing missions directly feeds your Consistency Index and raises your Reputation Level.
          Verified uploads to Vault automatically clear relevant pending missions.&rdquo;
        </p>
      </div>
    </div>
  );
}
