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
  hasCompletedAnyMission?: boolean;
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
  hasCompletedAnyMission,
}: MissionsStreakPanelProps) {
  const isCalibrated =
    typeof hasCompletedAnyMission === 'boolean'
      ? hasCompletedAnyMission
      : Boolean((completedCount && completedCount > 0) || (user?.missions_completed && user.missions_completed > 0));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: 24,
        alignItems: 'stretch',
      }}
    >
      {/* 1. Mindset Competency Growth Radar Chart Component */}
      <MissionsGrowthRadar
        theme={theme}
        onboardingAnswers={onboardingAnswers}
        user={user}
        hoveredRadarMetric={hoveredRadarMetric}
        setHoveredRadarMetric={setHoveredRadarMetric}
        setActiveTab={setActiveTab}
        hasCompletedAnyMission={isCalibrated}
      />

      {/* 2. Plus Shape Human Archetype Matrix Chart Component */}
      <MissionsArchetypeMatrix
        theme={theme}
        onboardingAnswers={onboardingAnswers}
        user={user}
        hoveredQuadrant={hoveredQuadrant}
        setHoveredQuadrant={setHoveredQuadrant}
        selectedQuadrant={selectedQuadrant}
        setSelectedQuadrant={setSelectedQuadrant}
        hasCompletedAnyMission={isCalibrated}
      />

      {/* 3. Mission Insights panel */}
      <div
        style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          padding: 24,
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: theme.tTertiary,
            fontFamily: 'var(--font-mono)',
            display: 'block',
          }}
        >
          📊 Mission Insights &amp; Goal Progress
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
          {/* Daily XP Target */}
          <div>
            <div
              style={{
                display: 'flex',
                fontSize: 13,
                fontWeight: 700,
                color: theme.tSecondary,
                marginBottom: 6,
                justifyContent: 'space-between',
              }}
            >
              <span>Daily XP Goal</span>
              <span style={{ color: 'var(--teal)' }}>{completedCount * 25} / 100 XP</span>
            </div>
            <div style={{ height: 8, background: theme.bgInside, borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, completedCount * 25)}%`,
                  background: 'var(--teal)',
                  borderRadius: 4,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* Gap Closure progress */}
          <div>
            <div
              style={{
                display: 'flex',
                fontSize: 13,
                fontWeight: 700,
                color: theme.tSecondary,
                marginBottom: 6,
                justifyContent: 'space-between',
              }}
            >
              <span>Target Gap Closure</span>
              <span style={{ color: 'var(--accent)' }}>{gapClosurePct}%</span>
            </div>
            <div style={{ height: 8, background: theme.bgInside, borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${gapClosurePct}%`,
                  background: 'var(--accent)',
                  borderRadius: 4,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: theme.tTertiary, lineHeight: 1.4, marginTop: 6, marginBlockEnd: 0 }}>
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
                fontSize: 11,
                fontWeight: 700,
                color: theme.tTertiary,
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                marginBottom: 4,
              }}
            >
              Target Alignment Path
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: theme.tPrimary }}>
              {onboardingAnswers?.role || 'Not Configured'}
            </div>
            {!onboardingAnswers?.hasCompleted && (
              <Link
                href="/career-twin"
                style={{
                  fontSize: 12,
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

      {/* 4. Quick Help Card / Teacher's Tip */}
      <div
        style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          padding: 24,
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'rgba(var(--accent-rgb, 99, 102, 241), 0.12)',
              border: '1px solid rgba(var(--accent-rgb, 99, 102, 241), 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
          >
            {teacher.emoji}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: theme.tPrimary }}>
              {teacher.name}&apos;s Strategic Coaching
            </div>
            <div style={{ fontSize: 12, color: theme.tTertiary, fontFamily: 'var(--font-mono)' }}>
              AI Career Mentor &amp; Mindset Guide
            </div>
          </div>
        </div>

        <blockquote
          style={{
            fontSize: 13.5,
            color: theme.tSecondary,
            lineHeight: 1.6,
            margin: 0,
            background: theme.bgInside,
            padding: '16px 20px',
            borderRadius: 14,
            borderLeft: '4px solid var(--accent)',
            fontStyle: 'italic',
          }}
        >
          &ldquo;Completing missions directly feeds your Consistency Index and raises your Reputation Level. Verified
          uploads to Vault automatically clear relevant pending missions.&rdquo;
        </blockquote>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: theme.tTertiary }}>
          <span>💡 Tip:</span>
          <span>Maintain daily streaks to unlock leadership simulations and exclusive vault tokens.</span>
        </div>
      </div>
    </div>
  );
}
