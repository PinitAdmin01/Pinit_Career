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
}

export const MissionsArchetypeMatrix: React.FC<MissionsArchetypeMatrixProps> = ({
  theme,
  onboardingAnswers,
  user,
  hoveredQuadrant,
  setHoveredQuadrant,
  selectedQuadrant,
  setSelectedQuadrant,
}) => {
  const activeArch = onboardingAnswers?.mindset_archetype || 'Pattern Hunter';
  const lowerArch = activeArch.toLowerCase();

  // Default base coordinates for user
  let userX = 74;
  let userY = 26;
  let userArchKey = 'pattern';

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

  // Fine-tune user target coordinates based on actual user scores in real-time with NaN guards
  const rawQt2 = Number(onboardingAnswers?.qt2_score);
  const rawComm = Number(user?.communication_score);
  const rawExec = Number(user?.execution_score);
  const rawLead = Number(user?.leadership_score);

  const qt2Score = Number.isFinite(rawQt2) ? rawQt2 : 75;
  const commScore = Number.isFinite(rawComm) ? rawComm : 75;
  const execScore = Number.isFinite(rawExec) ? rawExec : 75;
  const leadScore = Number.isFinite(rawLead) ? rawLead : 75;

  if (userArchKey === 'pattern') {
    userX = Math.min(88, Math.max(58, 50 + (qt2Score - 50) * 0.7));
    userY = Math.max(12, Math.min(42, 50 - (leadScore - 50) * 0.7));
  } else if (userArchKey === 'social') {
    userX = Math.max(12, Math.min(42, 50 - (commScore - 50) * 0.7));
    userY = Math.max(12, Math.min(42, 50 - (leadScore - 50) * 0.7));
  } else if (userArchKey === 'architect') {
    userX = Math.max(12, Math.min(42, 50 - (commScore - 50) * 0.7));
    userY = Math.min(88, Math.max(58, 50 + (qt2Score - 50) * 0.7));
  } else if (userArchKey === 'executor') {
    userX = Math.min(88, Math.max(58, 50 + (execScore - 50) * 0.7));
    userY = Math.min(88, Math.max(58, 50 + (execScore - 50) * 0.7));
  }

  // Safeguard against NaN coordinates
  userX = Number.isFinite(userX) ? userX : 50;
  userY = Number.isFinite(userY) ? userY : 50;

  // Determine active inspect view (Hover / Click / User Default)
  const activeKey = hoveredQuadrant || selectedQuadrant || userArchKey;

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

  const currentMeta = ARCHETYPE_META[activeKey] || ARCHETYPE_META.pattern;
  const isInspectMode = Boolean(hoveredQuadrant || selectedQuadrant);

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 20,
      padding: 20,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: theme.tTertiary, fontFamily: 'var(--font-mono)' }}>
            ➕ Dynamic Archetype Matrix
          </span>
          {selectedQuadrant ? (
            <button
              onClick={() => setSelectedQuadrant(null)}
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 6,
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.2)',
                cursor: 'pointer'
              }}
            >
              Reset Lock ✕
            </button>
          ) : (
            <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: 'rgba(20,184,166,0.1)', color: 'var(--teal)', border: '1px solid rgba(20,184,166,0.2)' }}>
              ● Live Reactive
            </span>
          )}
        </div>
        <p style={{ fontSize: 11, color: theme.tSecondary, margin: '4px 0 0', lineHeight: 1.4 }}>
          Hover or click quadrants to inspect cognitive archetypes. Updates in real-time as you complete missions.
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
          borderRadius: 14,
          border: `1px solid ${theme.border}`,
          overflow: 'hidden',
          padding: 8,
          userSelect: 'none'
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
            background: activeKey === 'social' ? 'rgba(20,184,166,0.12)' : 'transparent',
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
            background: activeKey === 'pattern' ? 'rgba(139,92,246,0.12)' : 'transparent',
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
            background: activeKey === 'architect' ? 'rgba(59,130,246,0.12)' : 'transparent',
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
            background: activeKey === 'executor' ? 'rgba(245,158,11,0.12)' : 'transparent',
            cursor: 'pointer',
            transition: 'background 0.25s ease',
            zIndex: 2
          }}
        />

        {/* Axis Crosshair (+ Shape) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 1,
          background: 'rgba(99,102,241,0.25)',
          transform: 'translateY(-50%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 1,
          background: 'rgba(99,102,241,0.25)',
          transform: 'translateX(-50%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Center Origin Dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: theme.tSecondary,
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          pointerEvents: 'none'
        }} />

        {/* Axis Direction Labels */}
        <span style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', fontSize: 8, fontWeight: 800, color: theme.tTertiary, textTransform: 'uppercase', letterSpacing: '0.5px', pointerEvents: 'none', zIndex: 4 }}>
          ▲ High Logic / EQ
        </span>
        <span style={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', fontSize: 8, fontWeight: 800, color: theme.tTertiary, textTransform: 'uppercase', letterSpacing: '0.5px', pointerEvents: 'none', zIndex: 4 }}>
          ▼ High Execution
        </span>
        <span style={{ position: 'absolute', left: 5, top: '50%', transform: 'translateY(-50%)', fontSize: 8, fontWeight: 800, color: theme.tTertiary, textTransform: 'uppercase', letterSpacing: '0.5px', pointerEvents: 'none', zIndex: 4 }}>
          ◀ People
        </span>
        <span style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', fontSize: 8, fontWeight: 800, color: theme.tTertiary, textTransform: 'uppercase', letterSpacing: '0.5px', pointerEvents: 'none', zIndex: 4 }}>
          Systems ▶
        </span>

        {/* 4 Quadrant Labels with dynamic highlighting */}
        <div style={{
          position: 'absolute', top: 22, left: 14, fontSize: 10, fontWeight: 800,
          color: activeKey === 'social' ? '#14b8a6' : theme.tTertiary,
          transition: 'color 0.2s', pointerEvents: 'none', zIndex: 4
        }}>
          🤝 Social {activeKey === 'social' && '✓'}
        </div>

        <div style={{
          position: 'absolute', top: 22, right: 14, fontSize: 10, fontWeight: 800,
          color: activeKey === 'pattern' ? '#8b5cf6' : theme.tTertiary,
          textAlign: 'right', transition: 'color 0.2s', pointerEvents: 'none', zIndex: 4
        }}>
          🧩 Pattern Hunter {activeKey === 'pattern' && '✓'}
        </div>

        <div style={{
          position: 'absolute', bottom: 22, left: 14, fontSize: 10, fontWeight: 800,
          color: activeKey === 'architect' ? '#3b82f6' : theme.tTertiary,
          transition: 'color 0.2s', pointerEvents: 'none', zIndex: 4
        }}>
          🎯 Architect {activeKey === 'architect' && '✓'}
        </div>

        <div style={{
          position: 'absolute', bottom: 22, right: 14, fontSize: 10, fontWeight: 800,
          color: activeKey === 'executor' ? '#f59e0b' : theme.tTertiary,
          textAlign: 'right', transition: 'color 0.2s', pointerEvents: 'none', zIndex: 4
        }}>
          ⚡ Executor {activeKey === 'executor' && '✓'}
        </div>

        {/* Dynamic Pulsing User Target Pin */}
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
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: ARCHETYPE_META[userArchKey]?.color || '#8b5cf6',
            boxShadow: `0 0 16px ${ARCHETYPE_META[userArchKey]?.color || '#8b5cf6'}`,
            border: '2.5px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9.5,
            color: '#ffffff'
          }}>
            📍
          </div>
          <span style={{
            fontSize: 8.5,
            fontWeight: 800,
            color: theme.tPrimary,
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            padding: '1.5px 6px',
            borderRadius: 5,
            marginTop: 3,
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {userArchKey === activeKey ? 'YOU ARE HERE' : 'YOUR POSITION'}
          </span>
        </div>
      </div>

      {/* Archetype Profile Breakdown Card */}
      <div style={{
        background: theme.bgInside,
        border: `1.5px solid ${currentMeta.color}`,
        borderRadius: 14,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        transition: 'all 0.25s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{currentMeta.emoji}</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: theme.tPrimary }}>
              {currentMeta.label}
            </span>
          </div>
          <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: currentMeta.color, fontWeight: 800, background: `${currentMeta.color}15`, padding: '2px 7px', borderRadius: 6 }}>
            {isInspectMode ? 'INSPECTING' : `QT2: ${qt2Score} pts`}
          </span>
        </div>
        <p style={{ fontSize: 11, color: theme.tSecondary, margin: 0, lineHeight: 1.45 }}>
          {currentMeta.desc}
        </p>
        <div style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: theme.tTertiary, marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{currentMeta.focus}</span>
          <span>X: {userX.toFixed(0)}% • Y: {(100 - userY).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default MissionsArchetypeMatrix;
