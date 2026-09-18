'use client';

import React, { useMemo } from 'react';

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────
interface CareerGrowthGraphProps {
  monthsCount: number;
  scoresHistory?: number[];
}

// ─────────────────────────────────────────────────────────────────────
// Utility: smooth catmull-rom spline points
// ─────────────────────────────────────────────────────────────────────
function catmullRomSpline(points: { x: number; y: number }[], segments: number = 60): string {
  if (points.length < 2) return '';
  const pathParts: string[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    for (let t = 0; t < segments; t++) {
      const tt = t / segments;
      const tt2 = tt * tt;
      const tt3 = tt2 * tt;

      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * tt +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * tt3
      );
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * tt +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * tt3
      );

      const cmd = t === 0 ? 'L' : 'L';
      pathParts.push(`${cmd}${x.toFixed(1)},${y.toFixed(1)}`);
    }
  }
  return pathParts.join(' ');
}

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────
export default function CareerGrowthGraph({
  monthsCount,
  scoresHistory = [],
}: CareerGrowthGraphProps) {
  const width = 600;
  const height = 300;
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Generate baseline / current / target data
  const chartData = useMemo(() => {
    const months = monthsCount;
    const baseline: number[] = [];
    const current: number[] = [];
    const target: number[] = [];

    // Use provided scores or generate reasonable defaults
    for (let i = 0; i < months; i++) {
      const progress = (i + 1) / months;
      baseline.push(25 + Math.min(progress * 15, 35)); // Start ~25, plateau ~40
      current.push(scoresHistory[i] ?? (35 + progress * (55 - 35))); // Growth curve
      target.push(60 + progress * 30); // Target: 60→90
    }

    return { baseline, current, target };
  }, [monthsCount, scoresHistory]);

  const { baseline, current, target } = chartData;

  // Build SVG points
  const allValues = [...baseline, ...current, ...target];
  const yMin = 0;
  const yMax = 100;

  const getX = (i: number, total: number) =>
    padding.left + (total > 1 ? (i / (total - 1)) * chartWidth : chartWidth / 2);
  const getY = (val: number) =>
    padding.top + chartHeight - ((val - yMin) / (yMax - yMin)) * chartHeight;

  const baselinePoints = baseline.map((v, i) => ({ x: getX(i, monthsCount), y: getY(v) }));
  const currentPoints = current.map((v, i) => ({ x: getX(i, monthsCount), y: getY(v) }));
  const targetPoints = target.map((v, i) => ({ x: getX(i, monthsCount), y: getY(v) }));

  const baselinePath = catmullRomSpline(baselinePoints);
  const currentPath = catmullRomSpline(currentPoints);
  const targetPath = catmullRomSpline(targetPoints);

  // Metrics
  const hireabilityIndex = Math.round(current[monthsCount - 1] ?? 88);
  const speedFactor = Math.round(((current[monthsCount - 1] ?? 88) - (baseline[0] ?? 25)) / (baseline[monthsCount - 1] ?? 40) * 100);
  const codeQuality = Math.round((current[monthsCount - 1] ?? 88) * 0.9);

  // Y-axis labels
  const yTicks = [0, 20, 40, 60, 80, 100];

  return (
    <div style={{
      padding: 24, borderRadius: 20,
      background: 'rgba(15, 23, 42, 0.85)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(12px)',
      fontFamily: 'var(--font-display)',
      width: '100%', maxWidth: 700,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
            📈 Career Growth Trajectory
          </h2>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>
            {monthsCount}-Month Crash Program • Baseline vs Current vs Industry Target
          </span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 8,
          background: 'rgba(99,102,241,0.15)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)',
        }}>{monthsCount} Months</span>
      </div>

      {/* Metrics Pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Hireability Index', value: `${hireabilityIndex}/100`, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
          { label: 'Speed Factor', value: `${speedFactor}%`, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
          { label: 'Code Quality Rating', value: `${codeQuality}/100`, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        ].map(pill => (
          <div key={pill.label} style={{
            flex: 1, minWidth: 120, padding: '10px 14px', borderRadius: 12,
            background: pill.bg, border: `1px solid ${pill.color}33`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 2 }}>{pill.label}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: pill.color, fontFamily: 'var(--font-display)' }}>{pill.value}</div>
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div style={{ width: '100%', overflow: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', minHeight: 250 }}
          role="img"
          aria-label={`Career growth graph showing ${monthsCount} month trajectory`}
        >
          {/* Grid lines */}
          {yTicks.map(tick => (
            <g key={tick}>
              <line
                x1={padding.left} y1={getY(tick)} x2={width - padding.right} y2={getY(tick)}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              />
              <text x={padding.left - 8} y={getY(tick) + 4} textAnchor="end" fill="var(--t3)" fontSize="10" fontFamily="var(--font-display)">
                {tick}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {Array.from({ length: monthsCount }, (_, i) => (
            <text key={i} x={getX(i, monthsCount)} y={height - 10} textAnchor="middle" fill="var(--t3)" fontSize="11" fontFamily="var(--font-display)">
              M{i + 1}
            </text>
          ))}

          {/* Target area (filled) */}
          {targetPoints.length > 1 && (
            <path
              d={`M${targetPoints.map(p => `${p.x},${p.y}`).join(' L')} L${targetPoints[targetPoints.length - 1].x},${padding.top + chartHeight} L${targetPoints[0].x},${padding.top + chartHeight} Z`}
              fill="rgba(99,102,241,0.06)"
            />
          )}

          {/* Target dashed line */}
          {targetPath && (
            <path d={`M${targetPoints.map(p => `${p.x},${p.y}`).join(' L')}`} fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
          )}

          {/* Baseline line */}
          {baselinePath && (
            <path d={`M${baselinePoints.map(p => `${p.x},${p.y}`).join(' L')}`} fill="none" stroke="#64748b" strokeWidth="2" opacity="0.5" />
          )}

          {/* Current competency line (solid, primary gradient) */}
          {currentPath && (
            <path
              d={`M${currentPoints.map(p => `${p.x},${p.y}`).join(' L')}`}
              fill="none"
              stroke="url(#graphGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points — Baseline */}
          {baselinePoints.map((p, i) => (
            <circle key={`base-${i}`} cx={p.x} cy={p.y} r="4" fill="#64748b" stroke="var(--bg2)" strokeWidth="2" />
          ))}

          {/* Data points — Current */}
          {currentPoints.map((p, i) => (
            <circle key={`curr-${i}`} cx={p.x} cy={p.y} r="5" fill="#10b981" stroke="var(--bg2)" strokeWidth="2">
              {i === monthsCount - 1 && (
                <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
              )}
            </circle>
          ))}

          {/* Data points — Target */}
          {targetPoints.map((p, i) => (
            <circle key={`tgt-${i}`} cx={p.x} cy={p.y} r="3" fill="#6366f1" stroke="var(--bg2)" strokeWidth="2" opacity="0.7" />
          ))}

          {/* Final value labels */}
          {monthsCount > 0 && (
            <>
              <text x={currentPoints[monthsCount - 1].x} y={currentPoints[monthsCount - 1].y - 12} textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="800" fontFamily="var(--font-display)">
                {current[monthsCount - 1]?.toFixed(0)}
              </text>
              <text x={targetPoints[monthsCount - 1].x} y={targetPoints[monthsCount - 1].y - 12} textAnchor="middle" fill="#6366f1" fontSize="12" fontWeight="800" fontFamily="var(--font-display)">
                {target[monthsCount - 1]?.toFixed(0)}
              </text>
            </>
          )}

          {/* Legend */}
          <g transform={`translate(${padding.left + 8}, ${padding.top - 12})`}>
            {[
              { color: '#64748b', label: 'Baseline', dash: '' },
              { color: '#10b981', label: 'Current', dash: '' },
              { color: '#6366f1', label: 'Target', dash: '6 4' },
            ].map((item, i) => (
              <g key={item.label} transform={`translate(${i * 80}, 0)`}>
                <line x1="0" y1="0" x2="20" y2="0" stroke={item.color} strokeWidth="2" strokeDasharray={item.dash} />
                <circle cx="10" cy="0" r="3" fill={item.color} />
                <text x="26" y="4" fill="var(--t3)" fontSize="9" fontFamily="var(--font-display)">{item.label}</text>
              </g>
            ))}
          </g>

          {/* Gradient definition */}
          <defs>
            <linearGradient id="graphGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Axis labels */}
          <text x={width / 2} y={height - 2} textAnchor="middle" fill="var(--t3)" fontSize="11" fontFamily="var(--font-display)">
            Month
          </text>
          <text x={14} y={height / 2} textAnchor="middle" fill="var(--t3)" fontSize="11" fontFamily="var(--font-display)" transform={`rotate(-90, 14, ${height / 2})`}>
            Competency Score
          </text>
        </svg>
      </div>

      {/* Bottom Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 11, color: 'var(--t3)' }}>
          📊 Day 1 Baseline: {baseline[0]?.toFixed(0)} → Now: {current[monthsCount - 1]?.toFixed(0)} → Target: {target[monthsCount - 1]?.toFixed(0)}
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 8,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', color: '#fff', fontSize: 11, fontWeight: 800,
          fontFamily: 'var(--font-display)',
        }}>
          Growth: +{Math.round((current[monthsCount - 1] ?? 0) - (baseline[0] ?? 0))} pts
        </div>
      </div>
    </div>
  );
}
