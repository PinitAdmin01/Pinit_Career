'use client';

import React from 'react';

interface MissionsArchetypeMatrixProps {
  theme: {
    bgCard: string;
    bgInside: string;
    border: string;
    tPrimary: string;
    tSecondary: string;
    tTertiary: string;
  };
  onboardingAnswers?: any;
  user?: any;
  hoveredQuadrant: string | null;
  setHoveredQuadrant: (key: string | null) => void;
  selectedQuadrant: string | null;
  setSelectedQuadrant: (key: string | null) => void;
  hasCompletedAnyMission?: boolean;
}

export const MissionsArchetypeMatrix: React.FC<MissionsArchetypeMatrixProps> = ({
  theme,
  onboardingAnswers,
  user,
  hoveredQuadrant,
  setHoveredQuadrant,
  selectedQuadrant,
  setSelectedQuadrant,
  hasCompletedAnyMission,
}) => {
  // If user has not completed a single mission, strictly show null / uncalibrated stats
  const isCalibrated = typeof hasCompletedAnyMission === 'boolean'
    ? hasCompletedAnyMission
    : Boolean((user?.missions_completed && user.missions_completed > 0) || (user?.mission_streak && user.mission_streak > 0));

  const activeArch = isCalibrated ? (onboardingAnswers?.mindset_archetype || 'Pattern Hunter') : 'Uncalibrated';
  const lowerArch = activeArch.toLowerCase();

  // Default base coordinates for user
  let userX = isCalibrated ? 74 : 50;
  let userY = isCalibrated ? 26 : 50;
  let userArchKey = 'pattern';

  if (isCalibrated) {
    if (lowerArch.includes('pattern') || lowerArch.includes('logic') || lowerArch.includes('deep thinker')) {
      userX = 74;
      userY = 26;
      userArchKey = 'pattern';
    } else if (lowerArch.includes('social') || lowerArch.includes('comm') || lowerArch.includes('harmonizer') || lowerArch.includes('navigator')) {
      userX = 26;
      userY = 26;
      userArchKey = 'social';
    } else if (lowerArch.includes('architect') || lowerArch.includes('strategist') || lowerArch.includes('vision')) {
      userX = 26;
      userY = 74;
      userArchKey = 'architect';
    } else if (lowerArch.includes('executor') || lowerArch.includes('sprinter') || lowerArch.includes('pragmatic')) {
      userX = 74;
      userY = 74;
      userArchKey = 'executor';
    }
  }

  // Fine-tune user target coordinates based on actual user scores in real-time with NaN guards
  const rawQt2 = Number(onboardingAnswers?.qt2_score);
  const rawComm = Number(user?.communication_score);
  const rawExec = Number(user?.execution_score);
  const rawLead = Number(user?.leadership_score);

  const qt2Score = isCalibrated && Number.isFinite(rawQt2) ? rawQt2 : null;
  const commScore = isCalibrated && Number.isFinite(rawComm) ? rawComm : 75;
  const execScore = isCalibrated && Number.isFinite(rawExec) ? rawExec : 75;
  const leadScore = isCalibrated && Number.isFinite(rawLead) ? rawLead : 75;

  if (isCalibrated) {
    if (userArchKey === 'pattern') {
      userX = Math.min(88, Math.max(58, 50 + ((qt2Score ?? 75) - 50) * 0.7));
      userY = Math.max(12, Math.min(42, 50 - (leadScore - 50) * 0.7));
    } else if (userArchKey === 'social') {
      userX = Math.max(12, Math.min(42, 50 - (commScore - 50) * 0.7));
      userY = Math.max(12, Math.min(42, 50 - (leadScore - 50) * 0.7));
    } else if (userArchKey === 'architect') {
      userX = Math.max(12, Math.min(42, 50 - (commScore - 50) * 0.7));
      userY = Math.min(88, Math.max(58, 50 + ((qt2Score ?? 75) - 50) * 0.7));
    } else if (userArchKey === 'executor') {
      userX = Math.min(88, Math.max(58, 50 + (execScore - 50) * 0.7));
      userY = Math.min(88, Math.max(58, 50 + (execScore - 50) * 0.7));
    }
  }

  // Safeguard against NaN coordinates
  userX = Number.isFinite(userX) ? userX : 50;
  userY = Number.isFinite(userY) ? userY : 50;

  // Determine active inspect view (Hover / Click / User Default)
  const activeKey = hoveredQuadrant || selectedQuadrant || (isCalibrated ? userArchKey : null);

  const ARCHETYPE_META: Record<string, { label: string; emoji: string; color: string; desc: string; focus: string }> = {
    pattern: {
      label: 'Pattern Hunter',
      emoji: '🧩',
      color: '#8b5cf6',
      desc: 'Systemic analyzer. Excels at root cause diagnosis, deep code logic, and complex problem breakdown.',
      focus: 'Top-Right Quadrant: High Logic & Systems Analysis'
    },
    social: {
      label: 'Social Navigator',
      emoji: '🤝',
      color: '#14b8a6',
      desc: 'High EQ & empathy. Master of workplace communication, incident resolution, and stakeholder alignment.',
      focus: 'Top-Left Quadrant: People Dynamics & EQ'
    },
    architect: {
      label: 'Strategic Architect',
      emoji: '🎯',
      color: '#3b82f6',
      desc: 'Strategic thinker. Focuses on broad system architecture, scalability, and multi-step career vision.',
      focus: 'Bottom-Left Quadrant: Long-term Architecture & Planning'
    },
    executor: {
      label: 'Pragmatic Executor',
      emoji: '⚡',
      color: '#f59e0b',
      desc: 'High execution velocity. Ships functional code fast, resolves immediate blockers, and drives output.',
      focus: 'Bottom-Right Quadrant: Rapid Execution & Tactical Delivery'
    }
  };

  const currentMeta = activeKey ? ARCHETYPE_META[activeKey] : null;
  const isInspectMode = Boolean(hoveredQuadrant || selectedQuadrant);

  return (
    <div style={{
      background: theme.bgCard,
      border: `1.5px solid ${theme.border}`,
      borderRadius: 20,
      padding: 22,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: theme.tPrimary, fontFamily: 'var(--font-mono)' }}>
            ➕ Dynamic Archetype Matrix
          </span>
          {selectedQuadrant ? (
            <button
              onClick={() => setSelectedQuadrant(null)}
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 7,
                background: 'rgba(239,68,68,0.12)',
                color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.25)',
                cursor: 'pointer'
              }}
            >
              Reset Lock ✕
            </button>
          ) : (
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: 7,
              background: isCalibrated ? 'rgba(20,184,166,0.12)' : 'rgba(100,116,139,0.08)',
              color: isCalibrated ? 'var(--teal)' : theme.tPrimary,
              border: `1px solid ${isCalibrated ? 'rgba(20,184,166,0.3)' : theme.border}`,
              fontFamily: 'var(--font-mono)',
            }}>
              {isCalibrated ? '● Live Reactive' : 'Pending Baseline'}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: theme.tSecondary, margin: '6px 0 0', lineHeight: 1.45 }}>
          {isCalibrated
            ? 'Hover or click quadrants to inspect cognitive archetypes. Updates in real-time as you complete missions.'
            : 'Complete your first daily mission or crisis simulation to establish and calibrate your mindset archetype.'}
        </p>
      </div>

      {/* 2D Plus-Shaped Crosshair Interactive Canvas */}
      <div
        onMouseLeave={() => setHoveredQuadrant(null)}
        style={{
          position: 'relative',
          width: '100%',
          height: 200,
          background: theme.bgInside,
          borderRadius: 16,
          border: `1.5px solid ${theme.border}`,
          overflow: 'hidden',
          padding: 8,
          userSelect: 'none',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {/* Quadrant Background Glows */}
        {/* Top-Left: Social */}
        <div
          onMouseEnter={() => setHoveredQuadrant('social')}
          onClick={() => setSelectedQuadrant(selectedQuadrant === 'social' ? null : 'social')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '50%',
            background: activeKey === 'social' ? 'rgba(20,184,166,0.16)' : 'rgba(20,184,166,0.04)',
            borderRight: `1px dashed ${theme.border}`,
            borderBottom: `1px dashed ${theme.border}`,
            cursor: 'pointer',
            transition: 'background 0.25s ease',
            zIndex: 2
          }}
        />

        {/* Top-Right: Pattern Hunter */}
        <div
          onMouseEnter={() => setHoveredQuadrant('pattern')}
          onClick={() => setSelectedQuadrant(selectedQuadrant === 'pattern' ? null : 'pattern')}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '50%',
            background: activeKey === 'pattern' ? 'rgba(139,92,246,0.16)' : 'rgba(139,92,246,0.04)',
            borderBottom: `1px dashed ${theme.border}`,
            cursor: 'pointer',
            transition: 'background 0.25s ease',
            zIndex: 2
          }}
        />

        {/* Bottom-Left: Architect */}
        <div
          onMouseEnter={() => setHoveredQuadrant('architect')}
          onClick={() => setSelectedQuadrant(selectedQuadrant === 'architect' ? null : 'architect')}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '50%',
            height: '50%',
            background: activeKey === 'architect' ? 'rgba(59,130,246,0.16)' : 'rgba(59,130,246,0.04)',
            borderRight: `1px dashed ${theme.border}`,
            cursor: 'pointer',
            transition: 'background 0.25s ease',
            zIndex: 2
          }}
        />

        {/* Bottom-Right: Executor */}
        <div
          onMouseEnter={() => setHoveredQuadrant('executor')}
          onClick={() => setSelectedQuadrant(selectedQuadrant === 'executor' ? null : 'executor')}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '50%',
            height: '50%',
            background: activeKey === 'executor' ? 'rgba(245,158,11,0.16)' : 'rgba(245,158,11,0.04)',
            cursor: 'pointer',
            transition: 'background 0.25s ease',
            zIndex: 2
          }}
        />

        {/* Centered Crosshair Lines */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 1.5,
          background: theme.border,
          transform: 'translateY(-50%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 1.5,
          background: theme.border,
          transform: 'translateX(-50%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Center Origin Dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: theme.tSecondary,
          border: `1.5px solid ${theme.bgCard}`,
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          pointerEvents: 'none'
        }} />

        {/* Axis Direction Labels - High-contrast readable chips */}
        <span style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 9.5,
          fontWeight: 800,
          color: theme.tSecondary,
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 4,
          padding: '1px 6px',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          pointerEvents: 'none',
          zIndex: 4,
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
          ▲ High Logic / EQ
        </span>
        <span style={{
          position: 'absolute',
          bottom: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 9.5,
          fontWeight: 800,
          color: theme.tSecondary,
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 4,
          padding: '1px 6px',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          pointerEvents: 'none',
          zIndex: 4,
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
          ▼ High Execution
        </span>
        <span style={{
          position: 'absolute',
          left: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 9.5,
          fontWeight: 800,
          color: theme.tSecondary,
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 4,
          padding: '1px 6px',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          pointerEvents: 'none',
          zIndex: 4,
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
          ◀ People
        </span>
        <span style={{
          position: 'absolute',
          right: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 9.5,
          fontWeight: 800,
          color: theme.tSecondary,
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 4,
          padding: '1px 6px',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          pointerEvents: 'none',
          zIndex: 4,
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
          Systems ▶
        </span>

        {/* 4 Quadrant Labels styled with clean contrast chips */}
        <div style={{
          position: 'absolute',
          top: 24,
          left: 14,
          fontSize: 11,
          fontWeight: 800,
          color: activeKey === 'social' ? '#0d9488' : theme.tPrimary,
          background: activeKey === 'social' ? 'rgba(20,184,166,0.12)' : theme.bgCard,
          border: `1px solid ${activeKey === 'social' ? 'rgba(20,184,166,0.4)' : theme.border}`,
          padding: '2px 8px',
          borderRadius: 6,
          transition: 'all 0.2s',
          pointerEvents: 'none',
          zIndex: 4
        }}>
          🤝 Social {isCalibrated && activeKey === 'social' && '✓'}
        </div>

        <div style={{
          position: 'absolute',
          top: 24,
          right: 14,
          fontSize: 11,
          fontWeight: 800,
          color: activeKey === 'pattern' ? '#7c3aed' : theme.tPrimary,
          background: activeKey === 'pattern' ? 'rgba(139,92,246,0.12)' : theme.bgCard,
          border: `1px solid ${activeKey === 'pattern' ? 'rgba(139,92,246,0.4)' : theme.border}`,
          padding: '2px 8px',
          borderRadius: 6,
          textAlign: 'right',
          transition: 'all 0.2s',
          pointerEvents: 'none',
          zIndex: 4
        }}>
          🧩 Pattern Hunter {isCalibrated && activeKey === 'pattern' && '✓'}
        </div>

        <div style={{
          position: 'absolute',
          bottom: 24,
          left: 14,
          fontSize: 11,
          fontWeight: 800,
          color: activeKey === 'architect' ? '#2563eb' : theme.tPrimary,
          background: activeKey === 'architect' ? 'rgba(59,130,246,0.12)' : theme.bgCard,
          border: `1px solid ${activeKey === 'architect' ? 'rgba(59,130,246,0.4)' : theme.border}`,
          padding: '2px 8px',
          borderRadius: 6,
          transition: 'all 0.2s',
          pointerEvents: 'none',
          zIndex: 4
        }}>
          🎯 Architect {isCalibrated && activeKey === 'architect' && '✓'}
        </div>

        <div style={{
          position: 'absolute',
          bottom: 24,
          right: 14,
          fontSize: 11,
          fontWeight: 800,
          color: activeKey === 'executor' ? '#d97706' : theme.tPrimary,
          background: activeKey === 'executor' ? 'rgba(245,158,11,0.12)' : theme.bgCard,
          border: `1px solid ${activeKey === 'executor' ? 'rgba(245,158,11,0.4)' : theme.border}`,
          padding: '2px 8px',
          borderRadius: 6,
          textAlign: 'right',
          transition: 'all 0.2s',
          pointerEvents: 'none',
          zIndex: 4
        }}>
          ⚡ Executor {isCalibrated && activeKey === 'executor' && '✓'}
        </div>

        {/* Dynamic User Target Pin */}
        <div style={{
          position: 'absolute',
          left: `${userX}%`,
          top: `${userY}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: isCalibrated ? 22 : 18,
            height: isCalibrated ? 22 : 18,
            borderRadius: '50%',
            background: isCalibrated ? (ARCHETYPE_META[userArchKey]?.color || '#8b5cf6') : theme.bgCard,
            boxShadow: isCalibrated ? `0 0 16px ${ARCHETYPE_META[userArchKey]?.color || '#8b5cf6'}` : '0 1px 4px rgba(0,0,0,0.1)',
            border: isCalibrated ? '2.5px solid #ffffff' : `2px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10.5,
            color: '#ffffff'
          }}>
            {isCalibrated ? '📍' : (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            )}
          </div>
          <span style={{
            fontSize: 9.5,
            fontWeight: 800,
            color: theme.tPrimary,
            background: theme.bgCard,
            border: `1.5px solid ${theme.border}`,
            padding: '2px 8px',
            borderRadius: 6,
            marginTop: 4,
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-sm)',
            fontFamily: 'var(--font-mono)'
          }}>
            {isCalibrated
              ? (userArchKey === activeKey ? 'YOU ARE HERE' : 'YOUR POSITION')
              : 'CALIBRATION PENDING'}
          </span>
        </div>
      </div>

      {/* Archetype Profile Breakdown Card */}
      {isCalibrated && currentMeta ? (
        <div style={{
          background: theme.bgInside,
          border: `1.5px solid ${currentMeta.color}`,
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          transition: 'all 0.25s ease',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{currentMeta.emoji}</span>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: theme.tPrimary }}>
                {currentMeta.label}
              </span>
            </div>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: currentMeta.color, fontWeight: 800, background: `${currentMeta.color}15`, padding: '3px 8px', borderRadius: 6, border: `1px solid ${currentMeta.color}35` }}>
              {isInspectMode ? 'INSPECTING' : `QT2: ${qt2Score ?? 'null'} pts`}
            </span>
          </div>
          <p style={{ fontSize: 12, color: theme.tSecondary, margin: 0, lineHeight: 1.5 }}>
            {currentMeta.desc}
          </p>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: theme.tSecondary, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{currentMeta.focus}</span>
            <span>X: {userX.toFixed(0)}% • Y: {(100 - userY).toFixed(0)}%</span>
          </div>
        </div>
      ) : (
        <div style={{
          background: theme.bgInside,
          border: `1.5px dashed ${theme.border}`,
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🧬</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: theme.tPrimary }}>
                Mindset Archetype: null (Uncalibrated)
              </span>
            </div>
            <span style={{ fontSize: 11, color: theme.tSecondary, fontFamily: 'var(--font-mono)', background: theme.bgCard, padding: '2px 8px', borderRadius: 6, border: `1px solid ${theme.border}` }}>
              QT2: null
            </span>
          </div>
          <p style={{ fontSize: 12, color: theme.tSecondary, margin: 0, lineHeight: 1.5 }}>
            Complete your first daily mission or crisis simulation to map your dynamic cognitive archetype across Logic, People, Execution, and Architecture.
          </p>
        </div>
      )}
    </div>
  );
};

export default MissionsArchetypeMatrix;
