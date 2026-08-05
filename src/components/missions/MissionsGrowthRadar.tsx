'use client';

import React from 'react';

interface MissionsGrowthRadarProps {
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
  hoveredRadarMetric: string | null;
  setHoveredRadarMetric: (key: string | null) => void;
  setActiveTab: (tab: 'evolve' | 'language' | 'history') => void;
}

export const MissionsGrowthRadar: React.FC<MissionsGrowthRadarProps> = ({
  theme,
  onboardingAnswers,
  user,
  hoveredRadarMetric,
  setHoveredRadarMetric,
  setActiveTab,
}) => {
  // Sanitize scores to prevent NaN floating point errors with zero-value fallback checks Math.max(10, ... || 0)
  const rawQt2 = Number(onboardingAnswers?.qt2_score);
  const rawComm = Number(user?.communication_score);
  const rawExec = Number(user?.execution_score);
  const rawLead = Number(user?.leadership_score);
  const rawStreak = Number(user?.mission_streak ?? user?.missionStreak ?? 1);

  const safeNum = (val: any, fallback: number = 75) => {
    const parsed = Number(val);
    const valid = Number.isFinite(parsed) ? parsed : fallback;
    return Math.min(100, Math.max(10, valid || 0));
  };

  const qt2Val = safeNum(rawQt2, 75);
  const commVal = safeNum(rawComm, 75);
  const execVal = safeNum(rawExec, 75);
  const leadVal = safeNum(rawLead, 75);
  const streakVal = Math.min(100, Math.max(10, (rawStreak / 7) * 100 + 40 || 10));

  const metrics = [
    {
      key: 'logic',
      label: '🧩 Logic',
      full: 'Socratic Logic (QT2)',
      value: qt2Val,
      color: '#8b5cf6',
      tip: 'Practice Socratic Crisis Roleplays in Sub-tab 1 to raise your System 2 QT2 Score.',
      actionTab: 'evolve' as const
    },
    {
      key: 'comm',
      label: '🗣️ Comm',
      full: 'Workplace Communication',
      value: commVal,
      color: '#14b8a6',
      tip: 'Practice Real-World Workplace Comm scenarios in Sub-tab 2 to earn Executive Rewrites & raise Comm score.',
      actionTab: 'language' as const
    },
    {
      key: 'exec',
      label: '⚡ Execution',
      full: 'Execution Velocity',
      value: execVal,
      color: '#f59e0b',
      tip: 'Complete and verify daily mission proofs to elevate execution velocity & tactical output.',
      actionTab: 'evolve' as const
    },
    {
      key: 'lead',
      label: '👑 Leadership',
      full: 'Crisis Leadership',
      value: leadVal,
      color: '#ec4899',
      tip: 'Resolve authority pressure and SLA breach crises to build executive decision-making & leadership.',
      actionTab: 'evolve' as const
    },
    {
      key: 'streak',
      label: '🔥 Streak',
      full: 'Consistency Habit',
      value: streakVal,
      color: '#3b82f6',
      tip: 'Maintain daily streak activity to build strong consistency habits and unlock reputation rewards.',
      actionTab: 'evolve' as const
    }
  ];

  const overallGrowth = Math.round(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length);
  const activeMetric = metrics.find(m => m.key === hoveredRadarMetric) || metrics[0];

  // Radar Pentagon Math (Center: 120, 120 | Radius: 70 - expanded for mobile padding <360px)
  const cx = 120;
  const cy = 120;
  const radius = 70;
  const numAxes = metrics.length;

  const getCoordinates = (index: number, valPct: number) => {
    const angle = (Math.PI / 180) * (-90 + index * (360 / numAxes));
    const safeValPct = Number.isFinite(valPct) ? valPct : 50;
    const r = (safeValPct / 100) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return {
      x: Number.isFinite(x) ? x : cx,
      y: Number.isFinite(y) ? y : cy
    };
  };

  // Polygon points string with NaN defense
  const polygonPoints = metrics.map((m, i) => {
    const { x, y } = getCoordinates(i, m.value);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

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
            🕸️ Mindset Growth Radar
          </span>
          <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: 'rgba(168,85,247,0.1)', color: 'var(--purple)', border: '1px solid rgba(168,85,247,0.2)' }}>
            📈 {overallGrowth}% Index
          </span>
        </div>
        <p style={{ fontSize: 11, color: theme.tSecondary, margin: '4px 0 0', lineHeight: 1.4 }}>
          Hover over metric spokes or pills below to inspect dynamic competency growth.
        </p>
      </div>

      {/* SVG Radar Spider Web Canvas (240x240 for mobile edge protection) */}
      <div
        onMouseLeave={() => setHoveredRadarMetric(null)}
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: theme.bgInside,
          borderRadius: 14,
          border: `1px solid ${theme.border}`,
          padding: '16px 8px',
          userSelect: 'none',
          overflow: 'hidden'
        }}
      >
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
          {/* Concentric Pentagon Grid Lines (20%, 40%, 60%, 80%, 100%) */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((ringLevel, ringIdx) => {
            const ringPoints = metrics.map((_, i) => {
              const { x, y } = getCoordinates(i, ringLevel * 100);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');
            return (
              <polygon
                key={ringIdx}
                points={ringPoints}
                fill="none"
                stroke={theme.border}
                strokeWidth={ringLevel === 1.0 ? "1.5" : "1"}
                strokeDasharray={ringLevel === 1.0 ? "none" : "2 2"}
                opacity={0.7}
              />
            );
          })}

          {/* Axis Spoke Lines */}
          {metrics.map((m, i) => {
            const outer = getCoordinates(i, 100);
            const isHovered = hoveredRadarMetric === m.key;

            return (
              <g key={m.key} onMouseEnter={() => setHoveredRadarMetric(m.key)} style={{ cursor: 'pointer' }}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={isHovered ? m.color : theme.border}
                  strokeWidth={isHovered ? "2.5" : "1"}
                  opacity={isHovered ? 1 : 0.6}
                  style={{ transition: 'all 0.25s ease' }}
                />
              </g>
            );
          })}

          {/* Filled Dynamic Growth Polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(99,102,241,0.25)"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            style={{ transition: 'all 0.6s ease' }}
          />

          {/* Axis Points & Glowing Interactive Dots */}
          {metrics.map((m, i) => {
            const pt = getCoordinates(i, m.value);
            const outerPt = getCoordinates(i, 122);
            const isHovered = hoveredRadarMetric === m.key;

            return (
              <g
                key={m.key}
                onMouseEnter={() => setHoveredRadarMetric(m.key)}
                onClick={() => setActiveTab(m.actionTab)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Pulse Glow Ring on Hover */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    fill={m.color}
                    opacity="0.3"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "7" : "5"}
                  fill={m.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* Outer Text Label with textAnchor="middle" for mobile screen collision protection */}
                <text
                  x={outerPt.x}
                  y={outerPt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHovered ? m.color : theme.tPrimary}
                  fontSize={isHovered ? "10" : "9"}
                  fontWeight="800"
                  style={{ fontFamily: 'var(--font-mono)', transition: 'all 0.2s ease' }}
                >
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Metric Score Pills Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {metrics.map((m) => {
          const isHovered = hoveredRadarMetric === m.key;
          return (
            <div
              key={m.key}
              onMouseEnter={() => setHoveredRadarMetric(m.key)}
              onClick={() => setActiveTab(m.actionTab)}
              style={{
                background: isHovered ? `${m.color}15` : theme.bgInside,
                border: `1px solid ${isHovered ? m.color : theme.border}`,
                borderRadius: 10,
                padding: '6px 10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 700, color: isHovered ? m.color : theme.tSecondary }}>
                {m.label}
              </span>
              <span style={{ fontSize: 10, fontWeight: 800, color: m.color, fontFamily: 'var(--font-mono)' }}>
                {m.value}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Metric Booster Advice Banner */}
      {hoveredRadarMetric && (
        <div style={{
          background: `${activeMetric.color}12`,
          border: `1px solid ${activeMetric.color}40`,
          borderRadius: 12,
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          animation: 'fade-in 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: activeMetric.color }}>
              {activeMetric.full}: {activeMetric.value}%
            </span>
            <button
              onClick={() => setActiveTab(activeMetric.actionTab)}
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                background: activeMetric.color,
                color: '#ffffff',
                border: 'none',
                padding: '3px 9px',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              Level Up ➔
            </button>
          </div>
          <p style={{ fontSize: 10.5, color: theme.tSecondary, margin: 0, lineHeight: 1.4 }}>
            {activeMetric.tip}
          </p>
        </div>
      )}
    </div>
  );
};

export default MissionsGrowthRadar;
