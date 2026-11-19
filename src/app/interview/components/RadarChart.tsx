'use client';

import React from 'react';

export interface RadarChartProps {
  scores: {
    logic: number;
    systems: number;
    comms: number;
    solving: number;
    star: number;
  };
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores, size = 200 }) => {
  const center = size / 2;
  const maxRadius = Math.max(28, (size / 2) - 34);

  const getCoordinates = () => {
    const categories = ['logic', 'systems', 'comms', 'solving', 'star'];
    return categories.map((cat, i) => {
      const rawVal = Number(((scores || {}) as any)[cat]);
      const displayScore = isNaN(rawVal) ? 0 : Math.max(0, Math.min(100, Math.round(rawVal)));
      const visualScore = Math.max(8, displayScore);
      const radius = (visualScore / 100) * maxRadius;
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x: isNaN(x) ? center : x, y: isNaN(y) ? center : y, score: displayScore, name: cat.toUpperCase() };
    });
  };

  const coords = getCoordinates();
  const pointsStr = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

  const ringPolygons = [0.25, 0.5, 0.75, 1.0].map((scale) => {
    const r = scale * maxRadius;
    return Array.from({ length: 5 }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  });

  return (
    <div style={{ position: 'relative', width: size + 24, height: size + 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="radar-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(var(--brand-rgb), 0.4)" />
            <stop offset="100%" stopColor="rgba(var(--brand-rgb), 0.02)" />
          </radialGradient>
        </defs>

        {ringPolygons.map((ringPoints, i) => (
          <polygon
            key={i}
            points={ringPoints}
            fill="none"
            stroke="var(--border2)"
            strokeWidth="1"
            strokeDasharray={i === 3 ? "none" : "3,3"}
          />
        ))}

        {coords.map((c, i) => (
          <line
            key={i}
            x1={center} y1={center} x2={c.x} y2={c.y}
            stroke="var(--border)" strokeWidth="1"
          />
        ))}

        <polygon
          points={pointsStr}
          fill="url(#radar-grad)"
          stroke="var(--accent-mid)"
          strokeWidth="2"
          filter="url(#radar-glow)"
        />

        {coords.map((c, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const lx = center + (maxRadius + 16) * Math.cos(angle);
          const ly = center + (maxRadius + 16) * Math.sin(angle) + 3;
          return (
            <text
              key={i} x={lx} y={ly} fill="var(--t2)" fontSize="10" fontWeight="800"
              fontFamily="monospace" textAnchor="middle"
            >
              {c.name} ({c.score}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
};
export default RadarChart;
