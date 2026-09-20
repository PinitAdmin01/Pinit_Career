'use client';

import { useState } from 'react';
import { DailyLog, MonthlySummary, AttentionAnalyticsState } from './types';

export function ProgressAnalyticsModal({
  analytics,
  currentFocusScore,
  onClose,
}: {
  analytics: AttentionAnalyticsState;
  currentFocusScore: number;
  onClose: () => void;
}) {
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');

  // Helper date generators
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const thisMonthStr = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().slice(0, 7);

  // Daily log lookups - NO fabricated data
  const hasTodayData = Boolean(analytics.dailyLogs[todayStr]);
  const todayLog: DailyLog = analytics.dailyLogs[todayStr] || {
    date: todayStr,
    avgFocusScore: currentFocusScore,
    totalAccuracy: 0,
    sessionsCompleted: 0,
    bestReactionMs: 0,
    selectiveScore: 0,
    memoryScore: 0,
    reflexScore: 0,
    spanScore: 0,
  };

  const hasYesterdayData = Boolean(analytics.dailyLogs[yesterdayStr]);
  const yesterdayLog: DailyLog = analytics.dailyLogs[yesterdayStr] || {
    date: yesterdayStr,
    avgFocusScore: 0,
    totalAccuracy: 0,
    sessionsCompleted: 0,
    bestReactionMs: 0,
    selectiveScore: 0,
    memoryScore: 0,
    reflexScore: 0,
    spanScore: 0,
  };

  // Monthly summary lookups - NO fabricated data
  const hasThisMonthData = Boolean(analytics.monthlySummaries[thisMonthStr]);
  const hasLastMonthData = Boolean(analytics.monthlySummaries[lastMonthStr]);

  const thisMonthSummary: MonthlySummary = analytics.monthlySummaries[thisMonthStr] || {
    month: thisMonthStr,
    monthLabel: new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' }),
    avgFocusScore: currentFocusScore,
    totalAccuracy: todayLog.totalAccuracy,
    totalSessions: todayLog.sessionsCompleted,
    peakStreak: 0,
    domainScores: {
      selective: todayLog.selectiveScore,
      memory: todayLog.memoryScore,
      reflex: todayLog.reflexScore,
      span: todayLog.spanScore,
    },
  };

  const lastMonthSummary: MonthlySummary = analytics.monthlySummaries[lastMonthStr] || {
    month: lastMonthStr,
    monthLabel: lastMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' }),
    avgFocusScore: 0,
    totalAccuracy: 0,
    totalSessions: 0,
    peakStreak: 0,
    domainScores: { selective: 0, memory: 0, reflex: 0, span: 0 },
  };

  // Delta helpers - honest comparison without manufactured growth
  const calcDelta = (cur: number, prev: number, hasPrev: boolean) => {
    if (!hasPrev) return { pct: 'No prior session', isUp: true, hasPrior: false };
    if (prev === 0) return { pct: cur > 0 ? '+100%' : '0.0%', isUp: cur >= prev, hasPrior: true };
    const diff = ((cur - prev) / prev) * 100;
    return {
      pct: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`,
      isUp: diff >= 0,
      hasPrior: true,
    };
  };

  const scoreDelta = calcDelta(todayLog.avgFocusScore, yesterdayLog.avgFocusScore, hasYesterdayData);
  const accDelta = calcDelta(todayLog.totalAccuracy, yesterdayLog.totalAccuracy, hasYesterdayData);
  const monthScoreDelta = calcDelta(thisMonthSummary.avgFocusScore, lastMonthSummary.avgFocusScore, hasLastMonthData);
  const monthAccDelta = calcDelta(thisMonthSummary.totalAccuracy, lastMonthSummary.totalAccuracy, hasLastMonthData);

  // Dynamic 7-day trajectory from actual daily logs
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString('en', { weekday: 'short' });
    const log = analytics.dailyLogs[dStr];
    const score = log ? log.avgFocusScore : (dStr === todayStr ? currentFocusScore : 0);
    return { date: dStr, label: dayLabel, score };
  });

  const trajectoryPoints = past7Days
    .map((d, i) => {
      const x = 50 + i * (400 / 6);
      const y = d.score > 0 ? Math.max(20, Math.min(100, 100 - (d.score / 999) * 80)) : 100;
      return `${Math.round(x)},${Math.round(y)}`;
    })
    .join(' ');

  const hasAny7DayActivity = past7Days.some(d => d.score > 0);

  // Dynamic radar chart calculations (center: 100, 75; radius: 50)
  const curSel = Math.min(100, Math.max(0, thisMonthSummary.domainScores?.selective || 0));
  const curRef = Math.min(100, Math.max(0, thisMonthSummary.domainScores?.reflex || 0));
  const curSpan = Math.min(100, Math.max(0, thisMonthSummary.domainScores?.span || 0));
  const curMem = Math.min(100, Math.max(0, thisMonthSummary.domainScores?.memory || 0));
  const hasThisMonthRadar = curSel > 0 || curRef > 0 || curSpan > 0 || curMem > 0;

  const thisMonthPoints = `${100},${Math.round(75 - (curSel / 100) * 50)} ${Math.round(100 + (curRef / 100) * 50)},${75} ${100},${Math.round(75 + (curSpan / 100) * 50)} ${Math.round(100 - (curMem / 100) * 50)},${75}`;

  const lastSel = Math.min(100, Math.max(0, lastMonthSummary.domainScores?.selective || 0));
  const lastRef = Math.min(100, Math.max(0, lastMonthSummary.domainScores?.reflex || 0));
  const lastSpan = Math.min(100, Math.max(0, lastMonthSummary.domainScores?.span || 0));
  const lastMem = Math.min(100, Math.max(0, lastMonthSummary.domainScores?.memory || 0));
  const hasLastMonthRadar = hasLastMonthData && (lastSel > 0 || lastRef > 0 || lastSpan > 0 || lastMem > 0);

  const lastMonthPoints = `${100},${Math.round(75 - (lastSel / 100) * 50)} ${Math.round(100 + (lastRef / 100) * 50)},${75} ${100},${Math.round(75 + (lastSpan / 100) * 50)} ${Math.round(100 - (lastMem / 100) * 50)},${75}`;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'attFadeIn 0.3s ease' }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto', padding: '28px 30px', position: 'relative', boxShadow: 'var(--shadow-md)', color: 'var(--t1)' }}>
        
        {/* Exit Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 24, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text)', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>✕ Close</button>

        {/* Modal Title */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>📊</span> Long-Term Progress Analytics
          </h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, margin: '4px 0 0' }}>Authentic focus growth, reaction speed, and accuracy tracked across actual play sessions.</p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: 10, background: 'var(--bg3)', padding: 5, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 24, maxWidth: 380 }}>
          <button
            onClick={() => setViewMode('day')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: viewMode === 'day' ? 'linear-gradient(135deg, #d4a843, #f5d78e)' : 'transparent',
              color: viewMode === 'day' ? '#0a0a0f' : 'var(--t2)',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            📅 Day-to-Day Comparison
          </button>
          <button
            onClick={() => setViewMode('month')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: viewMode === 'month' ? 'linear-gradient(135deg, #d4a843, #f5d78e)' : 'transparent',
              color: viewMode === 'month' ? '#0a0a0f' : 'var(--t2)',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🗓️ Month-to-Month Comparison
          </button>
        </div>

        {/* ── DAY-TO-DAY COMPARISON VIEW ── */}
        {viewMode === 'day' && (
          <div style={{ animation: 'attFadeIn 0.3s ease' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t2)', marginBottom: 14 }}>
              Comparing <strong style={{ color: 'var(--amber)' }}>Today ({todayStr})</strong> vs <strong style={{ color: 'var(--t1)' }}>Yesterday ({yesterdayStr})</strong>
            </div>

            {/* Day Comparison Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 4 }}>Focus Score</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#d4a843' }}>{todayLog.avgFocusScore}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: scoreDelta.hasPrior ? (scoreDelta.isUp ? 'var(--success)' : 'var(--danger)') : 'var(--t3)', marginTop: 4 }}>
                  {scoreDelta.hasPrior ? `${scoreDelta.isUp ? '▲' : '▼'} ${scoreDelta.pct} vs yesterday (${yesterdayLog.avgFocusScore})` : 'No yesterday activity'}
                </div>
              </div>

              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 4 }}>Accuracy Earned Today</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--success)' }}>+{todayLog.totalAccuracy}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: accDelta.hasPrior ? (accDelta.isUp ? 'var(--success)' : 'var(--danger)') : 'var(--t3)', marginTop: 4 }}>
                  {accDelta.hasPrior ? `${accDelta.isUp ? '▲' : '▼'} ${accDelta.pct} vs yesterday (+${yesterdayLog.totalAccuracy})` : 'No yesterday activity'}
                </div>
              </div>

              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 4 }}>Sessions Played</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--info)' }}>{todayLog.sessionsCompleted}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                  {hasYesterdayData ? `Yesterday: ${yesterdayLog.sessionsCompleted} session${yesterdayLog.sessionsCompleted !== 1 ? 's' : ''}` : 'Yesterday: 0 sessions'}
                </div>
              </div>
            </div>

            {/* Daily Trend Curve */}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginBottom: 14 }}>📈 7-Day Focus Score Trajectory</div>
              {hasAny7DayActivity ? (
                <>
                  <svg viewBox="0 0 500 120" style={{ width: '100%', height: 120 }}>
                    <line x1={30} y1={20} x2={470} y2={20} stroke="var(--border)" strokeWidth={1} />
                    <line x1={30} y1={60} x2={470} y2={60} stroke="var(--border)" strokeWidth={1} />
                    <line x1={30} y1={100} x2={470} y2={100} stroke="var(--border)" strokeWidth={1} />
                    <polyline
                      points={trajectoryPoints}
                      fill="none"
                      stroke="#d4a843"
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                    {past7Days.map((d, i) => {
                      const x = 50 + i * (400 / 6);
                      const y = d.score > 0 ? Math.max(20, Math.min(100, 100 - (d.score / 999) * 80)) : 100;
                      return (
                        <circle
                          key={d.date}
                          cx={Math.round(x)}
                          cy={Math.round(y)}
                          r={4}
                          fill={d.score > 0 ? '#d4a843' : 'var(--border)'}
                        />
                      );
                    })}
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', marginTop: 6, fontSize: 10.5, color: 'var(--t3)' }}>
                    {past7Days.map(d => (
                      <span key={d.date} style={{ textAlign: 'center' }}>
                        <div>{d.label}</div>
                        <div style={{ fontWeight: 700, color: d.score > 0 ? '#d4a843' : 'var(--t3)' }}>{d.score}</div>
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
                  No sessions recorded in the past 7 days. Play games to generate your authentic focus trajectory.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MONTH-TO-MONTH COMPARISON VIEW ── */}
        {viewMode === 'month' && (
          <div style={{ animation: 'attFadeIn 0.3s ease' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t2)', marginBottom: 14 }}>
              Comparing <strong style={{ color: 'var(--success)' }}>{thisMonthSummary.monthLabel}</strong> vs <strong style={{ color: 'var(--info)' }}>{lastMonthSummary.monthLabel}</strong>
            </div>

            {/* Monthly Comparison Grid Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6 }}>Monthly Average Focus Score</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--success)' }}>{thisMonthSummary.avgFocusScore}</span>
                  {hasLastMonthData && (
                    <span style={{ fontSize: 16, color: 'var(--t3)', textDecoration: 'line-through' }}>{lastMonthSummary.avgFocusScore}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: monthScoreDelta.hasPrior ? (monthScoreDelta.isUp ? 'var(--success)' : 'var(--danger)') : 'var(--t3)', marginTop: 6 }}>
                  {monthScoreDelta.hasPrior ? `${monthScoreDelta.isUp ? '📈 Growth:' : '📉 Drop:'} ${monthScoreDelta.pct} vs last month` : 'First active month recorded'}
                </div>
              </div>

              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6 }}>Total Accuracy Points Earned</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: '#d4a843' }}>+{thisMonthSummary.totalAccuracy}</span>
                  {hasLastMonthData && (
                    <span style={{ fontSize: 16, color: 'var(--t3)' }}>vs +{lastMonthSummary.totalAccuracy}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: monthAccDelta.hasPrior ? (monthAccDelta.isUp ? 'var(--success)' : 'var(--danger)') : 'var(--t3)', marginTop: 6 }}>
                  {monthAccDelta.hasPrior ? `${monthAccDelta.isUp ? '⚡ Acceleration:' : '📉 Drop:'} ${monthAccDelta.pct} volume change` : 'Baseline month established'}
                </div>
              </div>
            </div>

            {/* Dual Cognitive Domain Growth Overlay Radar */}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>
                🕸️ Cognitive Domain Comparison (<span style={{ color: 'var(--success)' }}>This Month</span> vs <span style={{ color: 'var(--info)' }}>Last Month</span>)
              </div>
              {hasThisMonthRadar || hasLastMonthRadar ? (
                <>
                  <svg viewBox="0 0 200 150" style={{ width: '100%', height: 140 }}>
                    <polygon points="100,15 160,75 100,135 40,75" fill="none" stroke="var(--border)" strokeWidth={1} />
                    <line x1="100" y1="25" x2="100" y2="125" stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2,2" />
                    <line x1="50" y1="75" x2="150" y2="75" stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2,2" />
                    
                    {/* Last Month Polygon (Blue) - only rendered if authentic last month data exists */}
                    {hasLastMonthRadar && (
                      <polygon
                        points={lastMonthPoints}
                        fill="rgba(59, 130, 246, 0.15)"
                        stroke="var(--info)"
                        strokeWidth="2"
                        strokeDasharray="3,3"
                      />
                    )}

                    {/* This Month Polygon (Emerald) */}
                    {hasThisMonthRadar && (
                      <polygon
                        points={thisMonthPoints}
                        fill="rgba(16, 185, 129, 0.25)"
                        stroke="var(--success)"
                        strokeWidth="2"
                      />
                    )}
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 11, fontWeight: 700, marginTop: 6 }}>
                    <span style={{ color: 'var(--success)' }}>● This Month</span>
                    {hasLastMonthRadar ? (
                      <span style={{ color: 'var(--info)' }}>-- Last Month</span>
                    ) : (
                      <span style={{ color: 'var(--t3)' }}>No Prior Month Data</span>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
                  Play sessions across cognitive games to plot your authentic multi-domain radar profile.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
