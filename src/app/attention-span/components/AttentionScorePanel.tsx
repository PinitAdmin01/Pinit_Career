'use client';

import {
  Difficulty,
  AttentionStats,
  calcFocusScore,
  getRank,
  getNextRank,
  RANKS,
} from '@/components/attention-span/types';
import { intelligenceProfileAverages } from '@/components/attention-span/intelligenceGameData';

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

  const intelligence = intelligenceProfileAverages(stats.intelligenceProfile);
  const intelligenceLabels = [
    { key: 'reasoning' as const, label: 'Reasoning', tint: '#8b5cf6' },
    { key: 'creative' as const, label: 'Creative', tint: '#0d9488' },
    { key: 'executive' as const, label: 'Executive', tint: '#d97706' },
    { key: 'social' as const, label: 'Social', tint: '#2563eb' },
  ];

  return (
    <>
      <div className="att-dash-head">
        <div>
          <h1>Cognitive Intelligence</h1>
          <p>Train different ways of thinking, then notice how your practice changes.</p>
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
          <h3>Daily mind quest</h3>
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
          { label: 'Cognitive score', value: focusScore },
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

      {/* Cognitive practice score and multidimensional profile */}
      <div className="ci-score-layout">
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 26.5 }}>{rank.icon}</span>
              <div>
                <div style={{ fontSize: 17.5, fontWeight: 800, color: rank.color }}>{rank.name}</div>
                <div style={{ fontSize: 13, color: 'var(--t2)' }}>Cognitive score: {focusScore}</div>
              </div>
            </div>
            {nextRank && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: 'var(--t2)' }}>Next: {nextRank.icon} {nextRank.name}</div>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>{nextRank.min - focusScore} pts to go</div>
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
                  fontSize: 11,
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

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>Cognitive profile</div>
          <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 14 }}>Practice trends · not a clinical IQ score</div>
          <div className="ci-profile-list">
            {intelligenceLabels.map(({ key, label, tint }) => {
              const value = intelligence[key];
              const sessions = stats.intelligenceProfile?.[key]?.sessions || 0;
              return (
                <div className="ci-profile-item" key={key}>
                  <div className="ci-profile-item-head"><span>{label}</span><strong>{sessions ? `${value}%` : 'Explore'}</strong></div>
                  <div className="ci-profile-meter"><i style={{ width: `${sessions ? value : 0}%`, background: tint }} /></div>
                  <small>{sessions ? `${sessions} practice ${sessions === 1 ? 'run' : 'runs'}` : 'Play a game to begin'}</small>
                </div>
              );
            })}
          </div>
          <div className="ci-profile-foot">Focus, memory, and reflex games also contribute to your overall practice score.</div>
        </div>
      </div>
    </>
  );
}
