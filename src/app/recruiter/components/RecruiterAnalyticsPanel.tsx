'use client';

import React from 'react';
import { ActivityLog } from '../hooks/useRecruiterData';

interface RecruiterAnalyticsPanelProps {
  logs: ActivityLog[];
  chartDays: number;
  setChartDays: (days: number) => void;
  chartData: Array<{ date: string; count: number }>;
  maxChartCount: number;
}

export default function RecruiterAnalyticsPanel({
  logs,
  chartDays,
  setChartDays,
  chartData,
  maxChartCount,
}: RecruiterAnalyticsPanelProps) {
  const todayCount = logs.filter(
    (l) => new Date(l.created_at).toDateString() === new Date().toDateString()
  ).length;

  const weekCount = logs.filter(
    (l) => Date.now() - new Date(l.created_at).getTime() < 7 * 86400000
  ).length;

  const uniqueActionTypes = new Set(logs.map((l) => l.action)).size;

  return (
    <div>
      {/* Summary Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>📊</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
            {logs.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: '0.3rem', fontWeight: 500 }}>
            Total Actions
          </div>
        </div>
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>🕐</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--teal)', lineHeight: 1 }}>
            {todayCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: '0.3rem', fontWeight: 500 }}>
            Today
          </div>
        </div>
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>📅</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple)', lineHeight: 1 }}>
            {weekCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: '0.3rem', fontWeight: 500 }}>
            This Week
          </div>
        </div>
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>🎯</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>
            {uniqueActionTypes}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: '0.3rem', fontWeight: 500 }}>
            Action Types
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--t1)', margin: 0 }}>
            📈 Activity Over Time
          </h3>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {([
              [7, '7d'],
              [14, '14d'],
              [30, '30d'],
            ] as const).map(([d, l]) => (
              <button
                key={d}
                onClick={() => setChartDays(d as number)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  background: chartDays === d ? 'var(--accent)' : 'var(--bg3)',
                  color: chartDays === d ? 'white' : 'var(--t3)',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Bars */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 6,
            height: 100,
            padding: '0 4px',
            marginBottom: 10,
          }}
        >
          {chartData.map((d, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: '100%',
                  borderRadius: '4px 4px 0 0',
                  background:
                    d.count > 0 ? 'linear-gradient(180deg, var(--accent), var(--teal))' : 'var(--border)',
                  height: `${Math.max((d.count / maxChartCount) * 80, d.count > 0 ? 6 : 2)}px`,
                  transition: 'height 0.5s ease',
                  boxShadow: d.count > 0 ? '0 2px 8px rgba(var(--brand-rgb), 0.2)' : 'none',
                }}
                title={`${d.date}: ${d.count} action${d.count !== 1 ? 's' : ''}`}
              />
            </div>
          ))}
        </div>
        {/* Chart Labels */}
        <div style={{ display: 'flex', gap: 6, padding: '0 4px', overflowX: 'hidden' }}>
          {chartData.map((d, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                fontSize: '0.65rem',
                color: 'var(--t3)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {d.date.split(' ')[0]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
