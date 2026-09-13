'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { CS } from './types';

// MiniLineChart for Analytics Tab
function MiniLineChart({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  if (!data || data.length < 2) return <div style={{ height, background: 'var(--bg3)', borderRadius: 6 }} />;
  const max = Math.max(...data, 1);
  const w = 100 / (data.length - 1);
  const pts = data.map((v, i) => `${i * w},${height - (v / max) * height}`).join(' ');
  return (
    <svg viewBox={`0 0 100 ${height}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} vectorEffect="non-scaling-stroke" />
      <polyline fill={`${color}18`} stroke="none" points={`0,${height} ${pts} 100,${height}`} />
    </svg>
  );
}

// StatCard for Analytics Tab
function StatCard({ icon, label, value, sub, color, trend, href }: {
  icon: string; label: string; value: string | number; sub?: string;
  color: string; trend?: number; href?: string;
}) {
  const cardContent = (
    <div className="score-card card-hover" style={{ cursor: href ? 'pointer' : 'default', padding: '16px 20px' }}>
      <div className="sc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="sc-icon-wrap" style={{ background: `${color}18`, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 6, background: trend >= 0 ? 'var(--green-light)' : 'var(--coral-light)', color: trend >= 0 ? 'var(--green)' : 'var(--coral)' }}>
            {trend >= 0 ? '↑' : '↓'}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="sc-label" style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{label}</div>
      <div className="sc-value" style={{ fontSize: 20, fontWeight: 900, marginTop: 4, color: 'var(--t1)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{cardContent}</Link> : cardContent;
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
    ats?: number;
    dna?: number;
    trust?: number;
  }>;
}

export default function AnalyticsTab() {
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery<AnalyticsDashboardData>({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => api.get<AnalyticsDashboardData>('/api/analytics/dashboard'),
    staleTime: 2 * 60 * 1000,
  });

  const s = analyticsData?.scores || {};
  const m = analyticsData?.missions || {};
  const ex = analyticsData?.exams || {};
  const iv = analyticsData?.interviews || {};

  const historyAts = analyticsData?.score_history?.map((h) => h.ats || 0) || [0, s.ats_score || 0];
  const historyDna = analyticsData?.score_history?.map((h) => h.dna || 0) || [0, s.career_dna_score || 0];
  const historyTrust = analyticsData?.score_history?.map((h) => h.trust || 0) || [0, s.trust_score || 0];

  const STATS = [
    { icon: '🎯', label: 'ATS Score', value: Math.round(s.ats_score || 0), color: 'var(--teal)' },
    { icon: '🧬', label: 'Career DNA', value: Math.round(s.career_dna_score || 0), color: 'var(--purple)' },
    { icon: '🛡', label: 'Trust Score', value: Math.round(s.trust_score || 0), color: 'var(--green)' },
    { icon: '📡', label: 'Recruiter Rank', value: Math.round(s.recruiter_visibility || 0), color: 'var(--amber)' },
    { icon: '🔥', label: 'Day Streak', value: s.mission_streak || 0, color: 'var(--coral)' },
    { icon: '⚡', label: 'Missions Done', value: m.completed || 0, color: 'var(--accent)' },
    { icon: '📋', label: 'Exams Taken', value: ex.total || 0, color: 'var(--blue)' },
    { icon: '📊', label: 'Avg Exam Score', value: `${Math.round(ex.avg_pct || 0)}%`, color: 'var(--teal)' },
    { icon: '🎙', label: 'Interviews Done', value: iv.total || 0, color: 'var(--purple)' },
    { icon: '🏆', label: 'Career Readiness', value: `${Math.round(s.career_readiness || 0)}/100`, color: 'var(--green)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      {isAnalyticsLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton score-skeleton" style={{ height: 100 }} />)}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {STATS.slice(0, 8).map(st => <StatCard key={st.label} {...st} />)}
          </div>

          {/* Score trend charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { label: 'ATS Score Trend', data: historyAts, color: 'var(--teal)', val: Math.round(s.ats_score || 0) },
              { label: 'Career DNA Trend', data: historyDna, color: 'var(--purple)', val: Math.round(s.career_dna_score || 0) },
              { label: 'Trust Score Trend', data: historyTrust, color: 'var(--green)', val: Math.round(s.trust_score || 0) },
            ].map(chart => (
              <div key={chart.label} style={CS.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={CS.cardLabel}>{chart.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: chart.color, fontFamily: 'var(--font-mono)' }}>{chart.val}</span>
                </div>
                <MiniLineChart data={chart.data} color={chart.color} height={44} />
              </div>
            ))}
          </div>

          {/* Additional details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={CS.card}>
              <div style={CS.cardLabel}>📋 Exam Breakdown</div>
              {[
                { label: 'Total Attempts', val: ex.total || 0, color: 'var(--t1)' },
                { label: 'Pass Rate', val: `${Math.round((ex.pass_rate || 0) * 100)}%`, color: 'var(--green)' },
                { label: 'Gold Badges', val: ex.gold || 0, color: 'var(--amber)' },
                { label: 'Silver Badges', val: ex.silver || 0, color: 'var(--t2)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--t2)' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>{item.val}</span>
                </div>
              ))}
            </div>

            <div style={CS.card}>
              <div style={CS.cardLabel}>🎯 Mission Efficiency</div>
              {[
                { label: 'Completed Missions', val: m.completed || 0, color: 'var(--green)' },
                { label: 'Pending Missions', val: m.pending || 0, color: 'var(--amber)' },
                { label: 'Failed Missions', val: m.failed || 0, color: 'var(--coral)' },
                { label: 'Interviews Completed', val: iv.total || 0, color: 'var(--accent)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--t2)' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
