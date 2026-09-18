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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(var(--accent-teal-rgb), 0.04) 100%)',
          border: `1.5px dashed rgba(168,85,247,0.22)`,
          borderRadius: '24px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 80, opacity: 0.06 }}>🧠</div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: 'var(--purple)',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(168,85,247,0.1)',
            padding: '4px 10px',
            borderRadius: 8,
            display: 'inline-block',
            marginBottom: 12,
          }}
        >
          Mindset Persona Simulator
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 800,
            color: theme.tPrimary,
            margin: '0 0 10px',
          }}
        >
          Initiate Dynamic Socratic Roleplay
        </h2>
        <p
          style={{
            color: theme.tSecondary,
            fontSize: 13,
            maxWidth: 580,
            margin: '0 auto 20px',
            lineHeight: 1.5,
          }}
        >
          Enter real-life crisis simulations (outages, blame shifting, authority pressure, scope creep). Challenge
          your natural blindness and evolve System 2 critical thinking. Drawing dynamically from Jocko Willink,
          Robert Greene, Daniel Kahneman, and Cialdini.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              padding: '8px 16px',
              borderRadius: 12,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: theme.tTertiary,
                display: 'block',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}
            >
              Mindset Archetype
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--purple)' }}>
              {onboardingAnswers?.mindset_archetype || 'Pattern Hunter'}
            </span>
          </div>
          <div
            style={{
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              padding: '8px 16px',
              borderRadius: 12,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: theme.tTertiary,
                display: 'block',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}
            >
              QT2 Mindset Index
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--teal)' }}>
              🧠 {onboardingAnswers?.qt2_score || 75} pts
            </span>
          </div>
        </div>

        <button
          onClick={initiateRoleplay}
          disabled={roleplayLoading || isUnlocking}
          className="btn-primary"
          style={{
            padding: '12px 28px',
            fontSize: 13.5,
            borderRadius: 14,
            margin: '0 auto',
            boxShadow: '0 4px 14px rgba(168,85,247,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {roleplayLoading || isUnlocking ? '⚡ Compiling Parameters...' : '⚡ Launch Simulator Session (5 Pins)'}
        </button>

        <div style={{ marginTop: 18 }}>
          <button
            onClick={() => setShowTraditionalMissions(!showTraditionalMissions)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.tTertiary,
              fontSize: 11.5,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {showTraditionalMissions
              ? 'Hide traditional missions checklist'
              : 'Show traditional daily checkoff list'}
          </button>
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
