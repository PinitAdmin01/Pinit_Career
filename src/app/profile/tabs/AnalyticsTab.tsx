'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { CS } from './types';

// Safe, light-mode friendly Sparkline with linear gradient (zero black-box fallback)
function MiniLineChart({
  data,
  color,
  height = 48,
  chartId,
}: {
  data: number[];
  color: string;
  height?: number;
  chartId: string;
}) {
  const isZero = !data || data.length === 0 || data.every((v) => v === 0);

  if (isZero) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg3)',
          borderRadius: 8,
          border: '1px dashed var(--border)',
          padding: '0 12px',
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          0 baseline • Trend plots with course progress
        </span>
      </div>
    );
  }

  const max = Math.max(...data, 10);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100 / Math.max(1, data.length - 1);
  const pts = data.map((v, i) => `${i * w},${height - 6 - ((v - min) / range) * (height - 12)}`).join(' ');
  const gradId = `chart-grad-${chartId}`;

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <svg viewBox={`0 0 100 ${height}`} style={{ width: '100%', height, overflow: 'visible' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon fill={`url(#${gradId})`} points={`0,${height} ${pts} 100,${height}`} />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pts}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// Crisp, polished StatCard for Light and Dark modes
function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  trend,
  href,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  trend?: number;
  href?: string;
}) {
  const cardContent = (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px 18px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
        cursor: href ? 'pointer' : 'default',
      }}
      className="card-hover"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            width: 36,
            height: 36,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 6,
              background: trend >= 0 ? 'var(--green-light)' : 'var(--coral-light)',
              color: trend >= 0 ? 'var(--green)' : 'var(--coral)',
              border: `1px solid ${trend >= 0 ? 'rgba(var(--success-rgb), 0.3)' : 'rgba(var(--danger-rgb), 0.3)'}`,
            }}
          >
            {trend >= 0 ? '↑' : '↓'}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--t3)',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: 0.6,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            marginTop: 4,
            color: 'var(--t1)',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.15,
          }}
        >
          {value}
        </div>
        {sub && <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: 'none' }}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}

interface AnalyticsDashboardData {
  scores?: {
    ats_score?: number;
    career_dna_score?: number;
    trust_score?: number;
    recruiter_visibility?: number;
    mission_streak?: number;
    career_readiness?: number;
  };
  missions?: {
    completed?: number;
    pending?: number;
    failed?: number;
    total?: number;
  };
  exams?: {
    total?: number;
    avg_pct?: number;
    pass_rate?: number;
    gold?: number;
    silver?: number;
    bronze?: number;
  };
  interviews?: {
    total?: number;
  };
  score_history?: Array<{
    date?: string;
    ats?: number;
    dna?: number;
    trust?: number;
  }>;
}

export default function AnalyticsTab() {
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery<AnalyticsDashboardData>({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => api.get<AnalyticsDashboardData>('/api/analytics/dashboard'),
    staleTime: 60 * 1000,
  });

  const s = analyticsData?.scores || {};
  const m = analyticsData?.missions || {};
  const ex = analyticsData?.exams || {};
  const iv = analyticsData?.interviews || {};

  const historyAts = analyticsData?.score_history?.map((h) => Number(h.ats) || 0) || [0, Number(s.ats_score) || 0];
  const historyDna = analyticsData?.score_history?.map((h) => Number(h.dna) || 0) || [0, Number(s.career_dna_score) || 0];
  const historyTrust = analyticsData?.score_history?.map((h) => Number(h.trust) || 0) || [0, Number(s.trust_score) || 0];

  const STATS = [
    { icon: '🎯', label: 'ATS Score', value: Math.round(Number(s.ats_score) || 0), color: 'var(--teal)' },
    { icon: '🧬', label: 'Career DNA', value: Math.round(Number(s.career_dna_score) || 0), color: 'var(--purple)' },
    { icon: '🛡', label: 'Trust Score', value: Math.round(Number(s.trust_score) || 0), color: 'var(--green)' },
    { icon: '📡', label: 'Recruiter Rank', value: Math.round(Number(s.recruiter_visibility) || 100), color: 'var(--amber)' },
    { icon: '🔥', label: 'Day Streak', value: Number(s.mission_streak) || 0, color: 'var(--coral)' },
    { icon: '⚡', label: 'Missions Done', value: Number(m.completed) || 0, color: 'var(--accent)' },
    { icon: '📋', label: 'Exams Taken', value: Number(ex.total) || 0, color: 'var(--blue)' },
    { icon: '📊', label: 'Avg Exam Score', value: `${Math.round(Number(ex.avg_pct) || 0)}%`, color: 'var(--teal)' },
    { icon: '🎙', label: 'Interviews Done', value: Number(iv.total) || 0, color: 'var(--purple)' },
    { icon: '🏆', label: 'Career Readiness', value: `${Math.round(Number(s.career_readiness) || 0)}/100`, color: 'var(--green)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      {isAnalyticsLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton score-skeleton" style={{ height: 110, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Top Key Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {STATS.slice(0, 8).map((st) => (
              <StatCard key={st.label} {...st} />
            ))}
          </div>

          {/* Growth Trend Trajectory (Safe Clean SVG without Black Polyline Glitches) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
            {[
              {
                id: 'ats',
                label: 'ATS Score Trend',
                data: historyAts,
                color: 'var(--teal)',
                val: Math.round(Number(s.ats_score) || 0),
              },
              {
                id: 'dna',
                label: 'Career DNA Trend',
                data: historyDna,
                color: 'var(--purple)',
                val: Math.round(Number(s.career_dna_score) || 0),
              },
              {
                id: 'trust',
                label: 'Trust Score Trend',
                data: historyTrust,
                color: 'var(--green)',
                val: Math.round(Number(s.trust_score) || 0),
              },
            ].map((chart) => (
              <div
                key={chart.label}
                style={{
                  ...CS.card,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={CS.cardLabel}>{chart.label}</span>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: chart.color,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {chart.val}
                  </span>
                </div>
                <MiniLineChart chartId={chart.id} data={chart.data} color={chart.color} height={52} />
              </div>
            ))}
          </div>

          {/* Detailed Exam & Mission Real Progress */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
            <div
              style={{
                ...CS.card,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={CS.cardLabel}>📋 Proctored Exam Performance</div>
              {[
                { label: 'Total Attempts', val: ex.total || 0, color: 'var(--t1)' },
                { label: 'Pass Rate', val: `${Math.round((Number(ex.pass_rate) || 0) * 100)}%`, color: 'var(--green)' },
                { label: 'Gold Honors (≥90%)', val: ex.gold || 0, color: 'var(--amber)' },
                { label: 'Silver Honors (≥75%)', val: ex.silver || 0, color: 'var(--t2)' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: item.color, fontFamily: 'var(--font-mono)' }}>
                    {item.val}
                  </span>
                </div>
              ))}
              {(!ex.total || ex.total === 0) && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'var(--bg3)',
                    fontSize: 12,
                    color: 'var(--t3)',
                    textAlign: 'center',
                  }}
                >
                  No exams recorded yet. Milestone tests will generate proctored exam telemetry.
                </div>
              )}
            </div>

            <div
              style={{
                ...CS.card,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={CS.cardLabel}>🎯 Daily Mission & Interview Progress</div>
              {[
                { label: 'Completed Missions', val: m.completed || 0, color: 'var(--green)' },
                { label: 'Pending Missions', val: m.pending || 0, color: 'var(--amber)' },
                { label: 'Failed / Timed Out', val: m.failed || 0, color: 'var(--coral)' },
                { label: 'AI Interviews Done', val: iv.total || 0, color: 'var(--accent)' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: item.color, fontFamily: 'var(--font-mono)' }}>
                    {item.val}
                  </span>
                </div>
              ))}
              {(!m.completed || m.completed === 0) && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'var(--bg3)',
                    fontSize: 12,
                    color: 'var(--t3)',
                    textAlign: 'center',
                  }}
                >
                  No missions completed yet. Visit Daily Missions to start your streak.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
