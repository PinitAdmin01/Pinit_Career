'use client';

import { AttentionStats, LeaderItem } from '@/components/attention-span/types';

interface AttentionProgressChartProps {
  stats: AttentionStats;
  leaders: LeaderItem[];
  userRank: number;
  userTotalAccuracy: number;
  syncing: boolean;
  currentUserId?: string;
}

export function AttentionProgressChart({
  stats,
  leaders,
  userRank,
  userTotalAccuracy,
  syncing,
  currentUserId,
}: AttentionProgressChartProps) {
  // 7-day chart data
  const chartData: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString('en', { weekday: 'short' });
    chartData.push({ label: dayLabel, value: stats.dailyScores[ds] || 0 });
  }
  const chartMax = Math.max(100, ...chartData.map(d => d.value));

  return (
    <>
      {/* 7-Day Chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px', marginBottom: 28, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 16 }}>7-day focus</div>
        <svg viewBox="0 0 600 180" style={{ width: '100%', height: 160 }}>
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <g key={i}>
              <line x1={50} y1={20 + (1 - p) * 130} x2={580} y2={20 + (1 - p) * 130} stroke="var(--border)" strokeWidth={1} />
              <text x={44} y={24 + (1 - p) * 130} fill="var(--t3)" fontSize={10} textAnchor="end">{Math.round(chartMax * p)}</text>
            </g>
          ))}
          <defs>
            <linearGradient id="attChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4a843" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={(() => {
              const pts = chartData.map((d, i) => ({ x: 50 + i * (530 / 6), y: 20 + (1 - d.value / chartMax) * 130 }));
              const area = `M${pts[0].x},${150} ` + pts.map(p => `L${p.x},${p.y}`).join(' ') + ` L${pts[pts.length - 1].x},${150} Z`;
              return area;
            })()}
            fill="url(#attChartGrad)"
          />
          <polyline
            points={chartData.map((d, i) => `${50 + i * (530 / 6)},${20 + (1 - d.value / chartMax) * 130}`).join(' ')}
            fill="none"
            stroke="#d4a843"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chartData.map((d, i) => {
            const x = 50 + i * (530 / 6);
            const y = 20 + (1 - d.value / chartMax) * 130;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={4} fill="var(--card)" stroke="#d4a843" strokeWidth={2} />
                {d.value > 0 && (
                  <text x={x} y={y - 10} fill="#d4a843" fontSize={10} textAnchor="middle" fontWeight="bold">
                    {d.value}
                  </text>
                )}
                <text x={x} y={168} fill="var(--t2)" fontSize={10} textAnchor="middle">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 🏆 ACCURACY LEADERBOARD */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 26px', position: 'relative', overflow: 'hidden', marginBottom: 28, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #d4a843, #f59e0b, #10b981)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              Accuracy board
              <span style={{ fontSize: 11, background: 'rgba(var(--success-rgb), 0.15)', color: 'var(--success)', border: '1px solid rgba(var(--success-rgb), 0.3)', borderRadius: 20, padding: '2px 8px', fontWeight: 700 }}>
                {syncing ? '⚡ Syncing...' : '🟢 Live End-to-End'}
              </span>
            </h2>
            <p style={{ color: 'var(--t2)', fontSize: 13, margin: '4px 0 0' }}>
              Rankings based on cumulative <strong style={{ color: 'var(--success)' }}>Accuracy Points</strong>. Higher difficulty = Multiplied Accuracy!
            </p>
          </div>

          <div style={{ background: 'var(--amber-light)', border: '1px solid var(--border)', borderRadius: 12, padding: '8px 16px', textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>Your Position</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--amber)' }}>
              #{userRank} • {userTotalAccuracy}+ Accuracy
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leaders.map((leader, index) => {
            const isMe = leader.userId === currentUserId;
            const badge = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            const rowBorder = isMe ? '1px solid #d4a843' : '1px solid var(--border)';
            const rowBg = isMe ? 'var(--amber-light)' : 'var(--bg3)';

            return (
              <div
                key={leader.userId || index}
                className="att-leader-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderRadius: 12,
                  background: rowBg,
                  border: rowBorder,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 32, fontSize: 18, fontWeight: 800, textAlign: 'center' }}>
                    {badge}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isMe ? 'var(--amber)' : 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {leader.displayName}
                      {isMe && <span style={{ fontSize: 10, background: '#d4a843', color: '#0a0a0f', padding: '1px 6px', borderRadius: 6, fontWeight: 800 }}>YOU</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t2)' }}>
                      {leader.gamesPlayed} game{leader.gamesPlayed !== 1 ? 's' : ''} played • Active {leader.lastActive}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--success)' }}>
                    {leader.totalAccuracy}+ Accuracy
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t3)' }}>
                    Cumulative Score
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
