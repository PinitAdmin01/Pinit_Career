'use client';

import React, { useMemo } from 'react';

export interface CompetenciesRadarProps {
  careerScore?: number;
  dnaScore?: number;
  activeTrack?: 'sde' | 'iot' | string;
  trustScore?: number;
  completedCount?: number;
  vaultCount?: number;
  archetype?: string;
  style?: React.CSSProperties;
  className?: string;
}

export interface RadarAxesScores {
  coding: number;
  arch: number;
  data: number;
  socratic: number;
  iot: number;
}

export const RADAR_AXES = [
  { name: 'CODING', angle: 0, textX: 60, textY: 8 },
  { name: 'ARCH', angle: 72, textX: 110, textY: 44 },
  { name: 'DATA', angle: 144, textX: 96, textY: 112 },
  { name: 'SOCRATIC', angle: 216, textX: 24, textY: 112 },
  { name: 'IoT', angle: 288, textX: 10, textY: 44 },
] as const;

export function calculate5AxisPoints(scores: [number, number, number, number, number], center = 60, maxRadius = 46): string {
  const angles = [0, 72, 144, 216, 288];
  return scores.map((score, i) => {
    const clamped = Math.max(0, Math.min(100, Number.isFinite(score) ? score : 0));
    const r = (clamped / 100) * maxRadius;
    const rad = angles[i] * (Math.PI / 180);
    const x = +(center + r * Math.sin(rad)).toFixed(1);
    const y = +(center - r * Math.cos(rad)).toFixed(1);
    return `${x},${y}`;
  }).join(' ');
}

export function computeRadarScores(props: CompetenciesRadarProps): RadarAxesScores {
  const {
    careerScore = 0,
    dnaScore = 0,
    activeTrack = 'sde',
    trustScore = 0,
    completedCount = 0,
    vaultCount = 0,
    archetype = '',
  } = props;

  let codingScore = careerScore > 0 ? careerScore : (completedCount > 0 ? Math.min(100, completedCount * 15) : 0);
  if (codingScore > 0 && archetype.includes('Pattern Hunter')) codingScore = Math.min(100, codingScore + 5);

  let archScore = (careerScore > 0 || dnaScore > 0)
    ? Math.round((careerScore * 0.7) + (dnaScore * 0.3))
    : (vaultCount > 0 ? Math.min(100, vaultCount * 15) : 0);
  if (archScore > 0 && archetype.includes('Explorer')) archScore = Math.min(100, archScore + 5);

  let dataScore = dnaScore > 0 ? dnaScore : (completedCount > 0 ? Math.min(100, completedCount * 10) : 0);
  if (dataScore > 0 && archetype.includes('Stabilizer')) dataScore = Math.min(100, dataScore + 5);

  let socraticScore = trustScore > 0 ? trustScore : 0;
  if (socraticScore > 0 && archetype.includes('Social IQ')) socraticScore = Math.min(100, socraticScore + 5);

  let iotScore = activeTrack === 'iot'
    ? (careerScore > 0 ? careerScore : 0)
    : Math.round(careerScore * 0.5);

  return {
    coding: Math.max(0, Math.min(100, codingScore)),
    arch: Math.max(0, Math.min(100, archScore)),
    data: Math.max(0, Math.min(100, dataScore)),
    socratic: Math.max(0, Math.min(100, socraticScore)),
    iot: Math.max(0, Math.min(100, iotScore)),
  };
}

export default function CompetenciesRadar(props: CompetenciesRadarProps) {
  const { activeTrack = 'sde', style, className } = props;
  const accentRgb = activeTrack === 'iot' ? '20,184,166' : '99,102,241';
  const accentVar = activeTrack === 'iot' ? 'var(--teal-mid)' : 'var(--accent)';

  const scores = useMemo(() => computeRadarScores(props), [props]);
  const radarPoints = useMemo(() => {
    return calculate5AxisPoints([
      scores.coding,
      scores.arch,
      scores.data,
      scores.socratic,
      scores.iot,
    ]);
  }, [scores]);

  return (
    <div
      data-testid="competencies-radar-card"
      className={className || "db-glass"}
      style={{
        padding: '20px 22px',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
        <div>
          <span className="db-label">SOCRATIC COMPETENCIES RADAR</span>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
            Multi-Dimensional Competency Matrix
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: activeTrack === 'sde' ? 'var(--accent)' : 'var(--teal-mid)' }} />
          Active Track: <strong style={{ color: 'var(--t1)' }}>{activeTrack === 'sde' ? 'SDE Full-Stack' : 'IoT Embedded'}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '10px 0' }}>
        <svg viewBox="0 0 120 120" style={{ width: 210, height: 210, overflow: 'visible' }}>
          {[0.25, 0.5, 0.75, 1.0].map((scale, i) => (
            <polygon
              key={i}
              points={[0, 72, 144, 216, 288].map(ang => {
                const r = 46 * scale;
                const rad = ang * (Math.PI / 180);
                return `${+(60 + r * Math.sin(rad)).toFixed(1)},${+(60 - r * Math.cos(rad)).toFixed(1)}`;
              }).join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.8"
            />
          ))}
          {[0, 72, 144, 216, 288].map((ang, i) => {
            const rad = ang * (Math.PI / 180);
            const x2 = +(60 + 46 * Math.sin(rad)).toFixed(1);
            const y2 = +(60 - 46 * Math.cos(rad)).toFixed(1);
            return <line key={i} x1="60" y1="60" x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />;
          })}
          <polygon
            data-testid="radar-polygon"
            points={radarPoints}
            fill={`rgba(${accentRgb},0.22)`}
            stroke={accentVar}
            strokeWidth="2"
            style={{ transition: 'all 0.5s ease' }}
          />
          <text x="60" y="8" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">CODING</text>
          <text x="110" y="44" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">ARCH</text>
          <text x="96" y="112" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">DATA</text>
          <text x="24" y="112" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">SOCRATIC</text>
          <text x="10" y="44" fill="var(--t2, #94a3b8)" fontSize="6" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">IoT</text>
        </svg>
      </div>
    </div>
  );
}
