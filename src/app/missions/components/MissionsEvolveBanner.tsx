'use client';

import React from 'react';
import MissionListView from './MissionListView';
import { Mission } from '../hooks/useMissionsState';

interface MissionsEvolveBannerProps {
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
  onboardingAnswers: any;
  roleplayLoading: boolean;
  isUnlocking: boolean;
  initiateRoleplay: () => void;
  showTraditionalMissions: boolean;
  setShowTraditionalMissions: (show: boolean) => void;
  tab: 'today' | 'history';
  setTab: (tab: 'today' | 'history') => void;
  generating: boolean;
  handleTriggerRegenerate: () => void;
  pending: Mission[];
  completedMissions: string[];
  allTodayMissions: Mission[];
  pastCompleted: any[];
  completeMission: (id: string) => void;
  customSkill: string;
  setCustomSkill: (skill: string) => void;
  handleGenerateCustomQuests: () => void;
  generatingSkill: boolean;
}

export default function MissionsEvolveBanner({
  theme,
  onboardingAnswers,
  roleplayLoading,
  isUnlocking,
  initiateRoleplay,
  showTraditionalMissions,
  setShowTraditionalMissions,
  tab,
  setTab,
  generating,
  handleTriggerRegenerate,
  pending,
  completedMissions,
  allTodayMissions,
  pastCompleted,
  completeMission,
  customSkill,
  setCustomSkill,
  handleGenerateCustomQuests,
  generatingSkill,
}: MissionsEvolveBannerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Hero Mindset Persona Simulator Banner */}
      <div
        style={{
          width: '100%',
          background:
            'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(20,184,166,0.06) 50%, rgba(59,130,246,0.08) 100%)',
          border: '1.5px solid rgba(168,85,247,0.32)',
          borderRadius: '24px',
          padding: '36px 40px',
          boxShadow: '0 12px 36px -12px rgba(168,85,247,0.22)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Watermark Icon */}
        <div
          style={{
            position: 'absolute',
            top: -16,
            right: 16,
            fontSize: 140,
            opacity: 0.05,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          🧠
        </div>

        {/* 2-Column Responsive Inner Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 32,
            alignItems: 'center',
          }}
        >
          {/* Left Column: Briefing & Mindset Stats */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'var(--purple)',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(168,85,247,0.12)',
                  padding: '4px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(168,85,247,0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>🧠</span>
                <span>Mindset Persona Simulator</span>
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: 'var(--teal)',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(20,184,166,0.1)',
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(20,184,166,0.25)',
                }}
              >
                ● Live Crisis Engine
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                fontWeight: 800,
                color: theme.tPrimary,
                margin: '0 0 12px',
                lineHeight: 1.25,
                letterSpacing: '-0.3px',
              }}
            >
              Initiate Dynamic Socratic Roleplay
            </h2>

            <p
              style={{
                color: theme.tSecondary,
                fontSize: 14.5,
                lineHeight: 1.6,
                margin: '0 0 22px',
                maxWidth: 620,
              }}
            >
              Enter real-life crisis simulations (outages, blame shifting, authority pressure, scope creep).
              Challenge your natural blindness and evolve System 2 critical thinking. Drawing dynamically from Jocko
              Willink, Robert Greene, Daniel Kahneman, and Cialdini.
            </p>

            {/* Live Stats Cluster */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  background: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  padding: '8px 16px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: theme.tTertiary,
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  Archetype:
                </span>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--purple)' }}>
                  {onboardingAnswers?.mindset_archetype || 'Pattern Hunter'}
                </span>
              </div>

              <div
                style={{
                  background: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  padding: '8px 16px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: theme.tTertiary,
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  QT2 Score:
                </span>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)' }}>
                  🧠 {onboardingAnswers?.qt2_score || 75} pts
                </span>
              </div>

              <div
                style={{
                  background: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  padding: '8px 16px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: theme.tTertiary,
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  Stake:
                </span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b' }}>
                  ⚡ 5 Pins
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Launch Station Action Box */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.22)',
              border: '1.5px solid rgba(168,85,247,0.25)',
              borderRadius: 20,
              padding: '28px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🎯</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: 'var(--teal)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Simulation Ready
              </span>
            </div>

            <button
              onClick={initiateRoleplay}
              disabled={roleplayLoading || isUnlocking}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px 28px',
                fontSize: 15.5,
                fontWeight: 800,
                borderRadius: 14,
                boxShadow: '0 6px 22px rgba(168,85,247,0.38)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: roleplayLoading || isUnlocking ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {roleplayLoading || isUnlocking ? '⚡ Compiling Parameters...' : '⚡ Launch Simulator Session (5 Pins)'}
            </button>

            <span style={{ fontSize: 12, color: theme.tTertiary, lineHeight: 1.4 }}>
              Includes 3D VRoid avatar debrief, real-time System 2 evaluation, and QT2 score re-indexing.
            </span>

            <div style={{ paddingTop: 4, borderTop: `1px solid ${theme.border}`, width: '100%' }}>
              <button
                onClick={() => setShowTraditionalMissions(!showTraditionalMissions)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.tSecondary,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  padding: '4px 0',
                }}
              >
                {showTraditionalMissions
                  ? '▲ Hide traditional daily missions checklist'
                  : '▼ Show traditional daily missions checklist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTraditionalMissions && (
        <MissionListView
          theme={theme}
          tab={tab}
          setTab={setTab}
          generating={generating}
          handleTriggerRegenerate={handleTriggerRegenerate}
          pending={pending}
          completedMissions={completedMissions}
          allTodayMissions={allTodayMissions}
          pastCompleted={pastCompleted}
          completeMission={completeMission}
          customSkill={customSkill}
          setCustomSkill={setCustomSkill}
          handleGenerateCustomQuests={handleGenerateCustomQuests}
          generatingSkill={generatingSkill}
        />
      )}
    </div>
  );
}
