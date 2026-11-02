'use client';

import React, { useMemo, useCallback } from 'react';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';

interface Props {
  accentColor?: string;
  accentRgb?: string;
}

export default function LearningHeatmapCard({
  accentColor = 'var(--accent)',
  accentRgb = '99,102,241',
}: Props) {
  const { user } = useAuth();
  const cOS = useCareerOS();

  // 84-day contribution dates (Sun-anchored, 12 weeks)
  const contributionDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (11 * 7) - today.getDay());
    startDate.setHours(0, 0, 0, 0);
    const temp = new Date(startDate);
    for (let i = 0; i < 84; i++) {
      dates.push(new Date(temp));
      temp.setDate(temp.getDate() + 1);
    }
    return dates;
  }, []);

  const getContributionsForDate = useCallback((date: Date) => {
    const str = date.toDateString();
    let count = 0;
    const qTs: string[] = (cOS?.onboardingAnswers as any)?.completedQuestsTimestamps || [];
    const mTs: string[] = (cOS?.onboardingAnswers as any)?.completedMissionsTimestamps || [];

    // 1. Parse quest completion timestamps safely
    qTs.forEach(ts => {
      if (!ts) return;
      const iso = ts.includes('|') ? ts.split('|')[0] : ts;
      const d = new Date(iso);
      if (!isNaN(d.getTime()) && d.toDateString() === str) count++;
    });

    // 2. Parse daily missions timestamps safely
    mTs.forEach(ts => {
      if (!ts) return;
      const iso = ts.includes('|') ? ts.split('|')[0] : ts;
      const d = new Date(iso);
      if (!isNaN(d.getTime()) && d.toDateString() === str) count++;
    });

    // 3. Check official campus attendance records for this date
    if (typeof window !== 'undefined' && user?.id) {
      try {
        const raw = localStorage.getItem(`pinit_attendance_v2_${user.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const dy = String(date.getDate()).padStart(2, '0');
          const ymd = `${y}-${m}-${dy}`;
          if (Array.isArray(parsed.attended_days) && parsed.attended_days.includes(ymd)) {
            count++;
          }
        }
      } catch {}
    }

    return count;
  }, [cOS?.onboardingAnswers, user?.id]);

  const totalContributions = useMemo(() => {
    return contributionDates.reduce((acc, d) => acc + getContributionsForDate(d), 0);
  }, [contributionDates, getContributionsForDate]);

  return (
    <div
      data-testid="learning-heatmap-card"
      style={{
        background: 'var(--card, var(--bg2))',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .db-hcell { position: relative; }
        .db-hcell:hover::after, .db-hcell:focus-visible::after {
          content: attr(data-tip);
          position: absolute;
          bottom: 140%;
          left: 50%;
          transform: translateX(-50%);
          background: #111827;
          color: #f3f4f6;
          border: 1px solid rgba(255,255,255,0.12);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-family: var(--font-mono);
          white-space: nowrap;
          z-index: 9999;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .db-hcell:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; z-index: 10; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block' }}>
            🔥 SOCRATIC CONTRIBUTION TRACKER
          </span>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
            Learning Activity &amp; Attendance Heatmap
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', padding: '3px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
            {totalContributions} Sessions Recorded
          </span>
          <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', padding: '3px 10px', borderRadius: 8, background: 'var(--bg3)', color: 'var(--t2)', border: '1px solid var(--border)' }}>
            84-Day Consistency Grid
          </span>
        </div>
      </div>

      {/* Grid container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        {/* Month labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4, paddingLeft: 28, fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          {Array.from({ length: 12 }).map((_, ci) => {
            const ws = contributionDates[ci * 7];
            const show = ci === 0 || (ws && ws.getMonth() !== contributionDates[(ci - 1) * 7]?.getMonth());
            return <div key={ci} style={{ visibility: show ? 'visible' : 'hidden' }}>{ws ? ws.toLocaleString('default', { month: 'short' }) : ''}</div>;
          })}
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          {/* Day of week labels */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 112, fontSize: 10, color: 'var(--t3)', paddingRight: 4, fontFamily: 'var(--font-mono)', lineHeight: '14px' }}>
            <span>Sun</span><span>Tue</span><span>Thu</span><span>Sat</span>
          </div>

          {/* Matrix grid */}
          <div role="grid" aria-label="Learning Activity Contribution Heatmap" style={{ display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column', gap: 3.5, flex: 1, height: 112 }}>
            {contributionDates.map((date, idx) => {
              const cnt = getContributionsForDate(date);
              const lv = cnt === 0 ? 0 : cnt === 1 ? 1 : cnt === 2 ? 2 : 3;
              const fut = date > new Date();
              const bg = fut
                ? 'transparent'
                : lv === 0
                ? 'var(--bg3)'
                : lv === 1
                ? `rgba(${accentRgb},0.28)`
                : lv === 2
                ? `rgba(${accentRgb},0.65)`
                : accentColor;

              const tip = fut ? 'Future' : `${cnt} contribution${cnt !== 1 ? 's' : ''} on ${date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;

              return (
                <div
                  key={idx}
                  role="gridcell"
                  tabIndex={fut ? -1 : 0}
                  aria-label={tip}
                  title={tip}
                  data-tip={tip}
                  className="db-hcell"
                  style={{
                    aspectRatio: '1',
                    background: bg,
                    border: '1px solid var(--border)',
                    borderRadius: 3,
                    cursor: fut ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--t3)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
          <span>Less</span>
          <div style={{ display: 'flex', gap: 3.5, alignItems: 'center' }}>
            {[0, 1, 2, 3].map(lv => (
              <div
                key={lv}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 2.5,
                  background: lv === 0
                    ? 'var(--bg3)'
                    : lv === 1
                    ? `rgba(${accentRgb},0.28)`
                    : lv === 2
                    ? `rgba(${accentRgb},0.65)`
                    : accentColor,
                  border: lv === 0 ? '1px solid var(--border)' : 'none',
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
