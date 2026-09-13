'use client';

import {
  Difficulty,
  AttentionStats,
  calcFocusScore,
  getRank,
  getNextRank,
  RANKS,
} from '@/components/attention-span/types';

interface AttentionScorePanelProps {
  stats: AttentionStats;
  difficulty: Difficulty;
  soundMuted: boolean;
  toggleSound: () => void;
  onOpenAnalytics: () => void;
  todaySessionCount: number;
  questCompleted: boolean;
  questClaimed: boolean;
  onClaimDailyQuest: () => void;
  userTotalAccuracy: number;
}

export function AttentionScorePanel({
  stats,
  difficulty,
  soundMuted,
  toggleSound,
  onOpenAnalytics,
  todaySessionCount,
  questCompleted,
  questClaimed,
  onClaimDailyQuest,
  userTotalAccuracy,
}: AttentionScorePanelProps) {
  const focusScore = calcFocusScore(stats);
  const rank = getRank(focusScore);
  const nextRank = getNextRank(focusScore);

  // Radar chart metrics (normalized 0-100%)
  const selectiveScore = Math.min(100, Math.round((stats.focusFireBest / 25) * 100));
  const memoryScore = Math.min(100, Math.round((stats.memoryMatrixBest / 8) * 100));
  const reactionScore = stats.reflexRushBest > 0 ? Math.min(100, Math.max(10, Math.round(100 - (stats.reflexRushBest - 150) * 0.3))) : 0;
  const spanScore = Math.min(100, Math.round((stats.sequenceSnapBest / 9) * 100));

  return (
    <>
      <div className="att-dash-head">
        <div>
          <h1>Attention Span</h1>
          <p>Quiet drills for focus, memory, and judgment.</p>
        </div>
        <div className="att-toolbar">
          <button type="button" className="att-tool is-accent" onClick={onOpenAnalytics}>
            Progress
          </button>
          <button type="button" className={`att-tool${soundMuted ? '' : ' is-on'}`} onClick={toggleSound}>
            {soundMuted ? 'Sound off' : 'Sound on'}
          </button>
          <div className="att-tool">
            Mode · {difficulty}
          </div>
        </div>
      </div>

      <div className="att-quest">
        <div>
          <h3>Daily focus quest</h3>
          <p>Finish 2 sessions today ({todaySessionCount}/2) for +15 Pins and +40 XP.</p>
        </div>
        <button
          type="button"
          className={`att-btn ${questCompleted && !questClaimed ? 'att-btn-primary' : 'att-btn-ghost'}`}
          onClick={onClaimDailyQuest}
          disabled={!questCompleted || questClaimed}
        >
          {questClaimed ? 'Claimed' : questCompleted ? 'Claim' : 'In progress'}
        </button>
      </div>

      <div className="att-stats">
        {[
          { label: 'Focus score', value: focusScore },
          { label: 'Streak', value: stats.streak },
          { label: 'Accuracy', value: `${userTotalAccuracy}+` },
          { label: 'Sessions', value: stats.totalSessions },
        ].map((s) => (
          <div key={s.label} className="att-stat">
            <em>{s.label}</em>
            <b>{s.value}</b>
          </div>
        ))}
      </div>

      {/* 🕸️ COGNITIVE RADAR & FOCUS RANK GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 28 }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{rank.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: rank.color }}>{rank.name}</div>
                <div style={{ fontSize: 12, color: 'var(--t2)' }}>Focus Score: {focusScore}</div>
              </div>
            </div>
            {nextRank && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--t2)' }}>Next: {nextRank.icon} {nextRank.name}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>{nextRank.min - focusScore} pts to go</div>
              </div>
            )}
          </div>
          <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, (focusScore / 999) * 100)}%`,
                background: `linear-gradient(90deg, ${rank.color}, ${nextRank?.color || rank.color})`,
                borderRadius: 4,
                transition: 'width 1s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            {RANKS.map((r) => (
              <div
                key={r.name}
                style={{
                  fontSize: 10,
                  color: focusScore >= r.min ? r.color : 'var(--t3)',
                  textAlign: 'center',
                  fontWeight: focusScore >= r.min ? 700 : 400,
                }}
              >
                {r.icon}<br />{r.min}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 6 }}>Cognitive profile</div>
          <svg viewBox="0 0 200 160" style={{ width: '100%', height: 130 }}>
            <polygon points="100,20 170,80 100,140 30,80" fill="none" stroke="var(--border2)" strokeWidth="1" />
            <polygon points="100,50 135,80 100,110 65,80" fill="none" stroke="var(--border)" strokeWidth="1" />

            {(() => {
              const top = 80 - (selectiveScore / 100) * 60;
              const right = 100 + (memoryScore / 100) * 70;
              const bottom = 80 + (reactionScore / 100) * 60;
              const left = 100 - (spanScore / 100) * 70;
              return (
                <polygon
                  points={`100,${top} ${right},80 100,${bottom} ${left},80`}
                  fill="rgba(212,168,67,0.25)"
                  stroke="#d4a843"
                  strokeWidth="2"
                />
              );
            })()}

            <text x="100" y="14" fill="#d4a843" fontSize="9" textAnchor="middle" fontWeight="bold">Selective ({selectiveScore}%)</text>
            <text x="175" y="83" fill="var(--reward)" fontSize="9" textAnchor="start" fontWeight="bold">Memory ({memoryScore}%)</text>
            <text x="100" y="154" fill="var(--success)" fontSize="9" textAnchor="middle" fontWeight="bold">Reflex ({reactionScore}%)</text>
            <text x="25" y="83" fill="var(--info)" fontSize="9" textAnchor="end" fontWeight="bold">Span ({spanScore}%)</text>
          </svg>
        </div>
      </div>
    </>
  );
}
