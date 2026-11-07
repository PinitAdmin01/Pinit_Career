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
  hasCompletedAnyMission?: boolean;
}

export const MissionsGrowthRadar: React.FC<MissionsGrowthRadarProps> = ({
  theme,
  onboardingAnswers,
  user,
  hoveredRadarMetric,
  setHoveredRadarMetric,
  setActiveTab,
  hasCompletedAnyMission,
}) => {
  // If user has not completed a single mission, strictly show null / uncalibrated stats
  const isCalibrated = typeof hasCompletedAnyMission === 'boolean'
    ? hasCompletedAnyMission
    : Boolean((user?.missions_completed && user.missions_completed > 0) || (user?.mission_streak && user.mission_streak > 0));

  const rawQt2 = Number(onboardingAnswers?.qt2_score);
  const rawComm = Number(user?.communication_score);
  const rawExec = Number(user?.execution_score);
  const rawLead = Number(user?.leadership_score);
  const rawStreak = Number(user?.mission_streak ?? user?.missionStreak ?? 0);

  const safeNum = (val: any, fallback: number = 75) => {
    if (!isCalibrated) return 0;
    const parsed = Number(val);
    const valid = Number.isFinite(parsed) ? parsed : fallback;
    return Math.min(100, Math.max(10, valid || 0));
  };

  const qt2Val = isCalibrated ? safeNum(rawQt2, 75) : 0;
  const commVal = isCalibrated ? safeNum(rawComm, 75) : 0;
  const execVal = isCalibrated ? safeNum(rawExec, 75) : 0;
  const leadVal = isCalibrated ? safeNum(rawLead, 75) : 0;
  const streakVal = isCalibrated ? Math.min(100, Math.max(10, (rawStreak / 7) * 100 + 40 || 10)) : 0;

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

  const overallGrowth = isCalibrated
    ? Math.round(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length)
    : null;
  const activeMetric = metrics.find(m => m.key === hoveredRadarMetric) || metrics[0];

  // Radar Pentagon Math (Center: 120, 120 | Radius: 70)
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

  // Polygon points string
  const polygonPoints = metrics.map((m, i) => {
    const { x, y } = getCoordinates(i, m.value);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

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
            🕸️ Mindset Growth Radar
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            padding: '3px 9px',
            borderRadius: 7,
            background: isCalibrated ? 'rgba(168,85,247,0.12)' : 'rgba(100,116,139,0.08)',
            color: isCalibrated ? 'var(--purple)' : theme.tPrimary,
            border: `1px solid ${isCalibrated ? 'rgba(168,85,247,0.3)' : theme.border}`,
            fontFamily: 'var(--font-mono)',
          }}>
            📈 {isCalibrated ? `${overallGrowth}% Index` : 'null (Uncalibrated)'}
          </span>
        </div>
        <p style={{ fontSize: 12, color: theme.tSecondary, margin: '6px 0 0', lineHeight: 1.45 }}>
          {isCalibrated
            ? 'Hover over metric spokes or pills below to inspect dynamic competency growth.'
            : 'Complete your first daily mission or simulation to establish and calibrate dynamic competency.'}
        </p>
      </div>

      {/* SVG Radar Spider Web Canvas */}
      <div
        onMouseLeave={() => setHoveredRadarMetric(null)}
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: theme.bgInside,
          borderRadius: 16,
          border: `1.5px solid ${theme.border}`,
          padding: '20px 8px',
          userSelect: 'none',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
          {/* Concentric Pentagon Grid Lines */}
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
                strokeDasharray={ringLevel === 1.0 ? "none" : "3 3"}
                opacity={ringLevel === 1.0 ? 0.95 : 0.65}
              />
            );
          })}

          {/* Axis Spoke Lines */}
          {metrics.map((m, i) => {
            const outer = getCoordinates(i, 100);
            const isHovered = hoveredRadarMetric === m.key;

            return (
              <g key={m.key} onMouseEnter={() => isCalibrated && setHoveredRadarMetric(m.key)} style={{ cursor: isCalibrated ? 'pointer' : 'default' }}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={isHovered ? m.color : theme.border}
                  strokeWidth={isHovered ? "2.5" : "1.2"}
                  opacity={isHovered ? 1 : 0.7}
                  style={{ transition: 'all 0.25s ease' }}
                />
                <circle
                  cx={outer.x}
                  cy={outer.y}
                  r="3.5"
                  fill={isHovered ? m.color : theme.border}
                  stroke={theme.bgCard}
                  strokeWidth="1.5"
                  style={{ transition: 'all 0.2s ease' }}
                />
              </g>
            );
          })}

          {/* Filled Dynamic Growth Polygon (Only rendered when calibrated) */}
          {isCalibrated ? (
            <polygon
              points={polygonPoints}
              fill="rgba(99,102,241,0.25)"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              style={{ transition: 'all 0.6s ease' }}
            />
          ) : (
            <g>
              <circle cx={cx} cy={cy} r="32" fill={theme.bgCard} stroke={theme.border} strokeWidth="1.5" strokeDasharray="3 3" />
              <text
                x={cx}
                y={cy - 6}
                textAnchor="middle"
                dominantBaseline="central"
                fill={theme.tPrimary}
                fontSize="9.5"
                fontWeight="800"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                UNCALIBRATED
              </text>
              <text
                x={cx}
                y={cy + 8}
                textAnchor="middle"
                dominantBaseline="central"
                fill={theme.tSecondary}
                fontSize="8.5"
                fontWeight="700"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                0 Missions Done
              </text>
            </g>
          )}

          {/* Metric Spoke Outer Labels */}
          {metrics.map((m, i) => {
            const outerPt = getCoordinates(i, 126);
            const isHovered = hoveredRadarMetric === m.key;
            const pt = getCoordinates(i, m.value);

            return (
              <g
                key={m.key}
                onMouseEnter={() => isCalibrated && setHoveredRadarMetric(m.key)}
                onClick={() => setActiveTab(m.actionTab)}
                style={{ cursor: isCalibrated ? 'pointer' : 'default' }}
              >
                {isCalibrated && isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    fill={m.color}
                    opacity="0.3"
                  />
                )}

                {isCalibrated && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? "7" : "5"}
                    fill={m.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                )}

                <text
                  x={outerPt.x}
                  y={outerPt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHovered ? m.color : theme.tPrimary}
                  fontSize={isHovered ? "11" : "10"}
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

      {/* Metric Score Pills Breakdown - Perfectly balanced 6-col grid (3 top, 2 bottom) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {metrics.map((m, idx) => {
          const isHovered = hoveredRadarMetric === m.key;
          const colSpan = idx < 3 ? 'span 2' : 'span 3';
          return (
            <div
              key={m.key}
              onMouseEnter={() => isCalibrated && setHoveredRadarMetric(m.key)}
              onClick={() => setActiveTab(m.actionTab)}
              style={{
                gridColumn: colSpan,
                background: isHovered ? `${m.color}15` : theme.bgInside,
                border: `1.5px solid ${isHovered ? m.color : theme.border}`,
                borderRadius: 10,
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: isCalibrated ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                boxShadow: isHovered ? `0 2px 8px ${m.color}20` : 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: isHovered ? m.color : theme.tPrimary }}>
                  {m.label}
                </span>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                color: isCalibrated ? m.color : theme.tSecondary,
                fontFamily: 'var(--font-mono)',
                background: isCalibrated ? `${m.color}18` : theme.bgCard,
                padding: '2px 8px',
                borderRadius: 6,
                border: `1px solid ${isCalibrated ? `${m.color}35` : theme.border}`,
              }}>
                {isCalibrated ? `${m.value}%` : 'null'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Metric Booster Advice Banner / Uncalibrated Prompt */}
      {!isCalibrated ? (
        <div style={{
          background: theme.bgInside,
          border: `1.5px dashed ${theme.border}`,
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: theme.tPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🚀</span> Baseline Calibration Pending
            </div>
            <div style={{ fontSize: 11.5, color: theme.tSecondary, marginTop: 2, lineHeight: 1.4 }}>
              Complete your first daily mission or simulation to establish your live competency radar.
            </div>
          </div>
          <button
            onClick={() => setActiveTab('evolve')}
            style={{
              fontSize: 11.5,
              fontWeight: 800,
              background: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              transition: 'transform 0.15s ease',
            }}
          >
            Start Mission ➔
          </button>
        </div>
      ) : hoveredRadarMetric && (
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
            <span style={{ fontSize: 12, fontWeight: 800, color: activeMetric.color }}>
              {activeMetric.full}: {activeMetric.value}%
            </span>
            <button
              onClick={() => setActiveTab(activeMetric.actionTab)}
              style={{
                fontSize: 10.5,
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
          <p style={{ fontSize: 11.5, color: theme.tSecondary, margin: 0, lineHeight: 1.4 }}>
            {activeMetric.tip}
          </p>
        </div>
      )}
    </div>
  );
};

export default MissionsGrowthRadar;
