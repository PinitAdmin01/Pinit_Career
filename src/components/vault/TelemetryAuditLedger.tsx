'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  getMetricLedger,
  computeMentalityBreakdown,
  METRIC_LABELS,
  type MetricLedgerEntry,
} from '@/lib/telemetry/metricsLedger';
import { calculateLeaguePoints } from '@/lib/leagues/leaguePoints';

type LedgerTab = 'trust' | 'arena' | 'experience' | 'mentality';

interface TelemetryAuditLedgerProps {
  userId?: string | null;
  user: any;
  cOS: any;
  liveTrustScore: number;
  verifiedCount: number;
  totalVaultCount: number;
}

function formatShortTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recent';
  }
}

export const TelemetryAuditLedger: React.FC<TelemetryAuditLedgerProps> = ({
  userId,
  user,
  cOS,
  liveTrustScore,
  verifiedCount,
  totalVaultCount,
}) => {
  const [activeTab, setActiveTab] = useState<LedgerTab>('trust');
  const [ledgerTick, setLedgerTick] = useState(0);

  useEffect(() => {
    const bump = () => setLedgerTick((t) => t + 1);
    if (typeof window !== 'undefined') {
      window.addEventListener('pinit-metrics-ledger-updated', bump);
      window.addEventListener('pinit-trust-updated', bump);
      window.addEventListener('pinit:user_profile_updated', bump);
      return () => {
        window.removeEventListener('pinit-metrics-ledger-updated', bump);
        window.removeEventListener('pinit-trust-updated', bump);
        window.removeEventListener('pinit:user_profile_updated', bump);
      };
    }
  }, []);

  const allEntries = useMemo(() => {
    void ledgerTick;
    return getMetricLedger(userId);
  }, [userId, ledgerTick]);

  const trustEntries = useMemo(
    () => allEntries.filter((e) => e.metric === 'trust_score'),
    [allEntries]
  );

  const arenaEntries = useMemo(
    () => allEntries.filter((e) => e.metric === 'arena_elo' || e.metric === 'arena_league_points'),
    [allEntries]
  );

  const expAndCareerEntries = useMemo(
    () => allEntries.filter((e) => e.metric === 'weekly_xp' || e.metric === 'career_score'),
    [allEntries]
  );

  const mentalityEntries = useMemo(
    () => allEntries.filter((e) => e.metric === 'mentality'),
    [allEntries]
  );

  const weeklyXp = Math.max(0, Number(user?.weekly_xp ?? user?.weeklyXp ?? cOS?.xp ?? 0));
  const arenaBonusPts = Math.max(0, Number(user?.weekly_arena_points ?? user?.arenaPoints ?? 0));
  const leaguePoints = calculateLeaguePoints(weeklyXp, arenaBonusPts);
  const arenaWins = Math.max(0, Number(user?.arena_wins ?? 0));
  const rawElo = Number(user?.arena_elo ?? 100);
  const arenaElo = rawElo === 1200 && arenaWins === 0 ? 100 : Math.max(0, rawElo || 100);
  const careerScore = Math.max(0, Math.min(100, Number(cOS?.careerScore ?? user?.career_readiness ?? 0)));

  const mentalityBreakdown = useMemo(
    () =>
      computeMentalityBreakdown({
        completedQuestsCount: cOS?.completedQuests?.length || 0,
        completedMissionsCount: cOS?.completedMissions?.length || 0,
        missionStreak: cOS?.missionStreak || 0,
        trustScore: liveTrustScore,
        arenaElo,
        arenaWins,
        verifiedVaultCount: verifiedCount,
        totalVaultCount,
        interviewsCount: Number(user?.interviews_done ?? 0),
        baseArchetype:
          cOS?.onboardingAnswers?.mindset_archetype ||
          user?.mindset_archetype ||
          'Pattern Hunter',
      }),
    [
      cOS?.completedQuests?.length,
      cOS?.completedMissions?.length,
      cOS?.missionStreak,
      cOS?.onboardingAnswers?.mindset_archetype,
      liveTrustScore,
      arenaElo,
      arenaWins,
      verifiedCount,
      totalVaultCount,
      user?.interviews_done,
      user?.mindset_archetype,
    ]
  );

  const renderDeltaTable = (
    rows: MetricLedgerEntry[],
    emptyHint: string,
    anchorRow?: { label: string; score: number; unit: string }
  ) => (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg2)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
        <thead>
          <tr
            style={{
              background: 'rgba(15, 23, 42, 0.45)',
              borderBottom: '1px solid var(--border)',
              color: 'var(--t3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
            }}
          >
            <th style={{ padding: '9px 14px' }}>When</th>
            <th style={{ padding: '9px 14px' }}>Source</th>
            <th style={{ padding: '9px 14px' }}>Reason</th>
            <th style={{ padding: '9px 14px', textAlign: 'right' }}>Change</th>
            <th style={{ padding: '9px 14px', textAlign: 'right' }}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <>
              {anchorRow && (
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
                    Current
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 5, background: 'var(--bg3)', color: 'var(--t2)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
                      synced
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--t1)' }}>
                    {anchorRow.label}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>
                    —
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--t1)' }}>
                    {anchorRow.score} {anchorRow.unit}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={5} style={{ padding: '16px 14px', textAlign: 'center', color: 'var(--t3)', fontSize: 12.5 }}>
                  {emptyHint}
                </td>
              </tr>
            </>
          ) : (
            rows.map((entry) => {
              const isPos = entry.delta > 0;
              const isNeg = entry.delta < 0;
              const metricMeta = METRIC_LABELS[entry.metric] || { label: entry.metric, unit: '', color: 'var(--t2)' };
              return (
                <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '9px 14px', color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontSize: 11.5, whiteSpace: 'nowrap' }}>
                    {formatShortTime(entry.timestamp)}
                  </td>
                  <td style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        padding: '2px 7px',
                        borderRadius: 5,
                        background: 'var(--bg3)',
                        color: metricMeta.color,
                        border: '1px solid var(--border)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {entry.feature}
                    </span>
                  </td>
                  <td style={{ padding: '9px 14px', color: 'var(--t1)', fontWeight: 500 }}>
                    {entry.action}
                    {entry.mentalityTag && (
                      <span style={{ marginLeft: 8, fontSize: 10, padding: '1px 6px', borderRadius: 5, background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
                        {entry.mentalityTag}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        minWidth: 46,
                        textAlign: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: 12,
                        padding: '2px 8px',
                        borderRadius: 99,
                        background: isPos ? 'rgba(34,197,94,0.14)' : isNeg ? 'rgba(239,68,68,0.14)' : 'var(--bg3)',
                        color: isPos ? 'var(--green)' : isNeg ? '#f87171' : 'var(--t3)',
                        border: `1px solid ${isPos ? 'rgba(34,197,94,0.3)' : isNeg ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                      }}
                    >
                      {isPos ? `+${entry.delta}` : entry.delta}
                    </span>
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--t1)', whiteSpace: 'nowrap' }}>
                    {entry.valueAfter} {metricMeta.unit}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  const tabs: Array<{ id: LedgerTab; label: string; badge: string }> = [
    { id: 'trust', label: 'Trust Score', badge: `${liveTrustScore}/100` },
    { id: 'arena', label: 'Arena (ELO & League)', badge: `${arenaElo} ELO` },
    { id: 'experience', label: 'XP & Career Score', badge: `${weeklyXp} XP` },
    { id: 'mentality', label: 'Mentality', badge: mentalityBreakdown.dominant },
  ];

  return (
    <section
      data-testid="telemetry-audit-ledger"
      style={{
        borderRadius: 16,
        padding: 18,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
      }}
    >
      {/* Compact Header + Sub-tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        <div role="tablist" aria-label="Score History Sub-tabs" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                data-testid={`ledger-tab-${t.id}`}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 10,
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'rgba(99,102,241,0.14)' : 'var(--bg2)',
                  color: active ? '#a5b4fc' : 'var(--t2)',
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{t.label}</span>
                <span style={{ fontSize: 10.5, padding: '1px 6px', borderRadius: 99, background: active ? 'rgba(99,102,241,0.22)' : 'var(--bg3)', color: active ? '#c7d2fe' : 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Trust Score */}
      {activeTab === 'trust' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 10,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              fontSize: 12,
              color: 'var(--t2)',
            }}
          >
            <span><strong style={{ color: liveTrustScore >= 50 ? 'var(--green)' : '#f87171' }}>Trust: {liveTrustScore}/100</strong></span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span><strong style={{ color: 'var(--accent)' }}>+3</strong> Mission / Lesson / Exam / Interview</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span><strong style={{ color: 'var(--green)' }}>+5</strong> Verified Doc / <strong style={{ color: '#f87171' }}>-5</strong> Fake Doc</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span><strong style={{ color: '#f87171' }}>-2</strong> Cheating (max 1x/session)</span>
          </div>
          {renderDeltaTable(
            trustEntries,
            'Complete a mission, lesson, exam, interview, or document check to see every + and - update here.',
            { label: 'Current Synced Trust Balance', score: liveTrustScore, unit: 'pts' }
          )}
        </div>
      )}

      {/* TAB 2: Arena ELO & League Points */}
      {activeTab === 'arena' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 14,
              padding: '9px 12px',
              borderRadius: 10,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              fontSize: 12.5,
              color: 'var(--t2)',
            }}
          >
            <span>Arena ELO: <strong style={{ color: 'var(--teal)' }}>{arenaElo}</strong> (+20 Win / -20 Loss)</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>League Points: <strong style={{ color: 'var(--amber)' }}>{leaguePoints} LP</strong> ({weeklyXp} XP + {arenaBonusPts} Bonus)</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Wins: <strong style={{ color: 'var(--green)' }}>{arenaWins}</strong></span>
          </div>
          {renderDeltaTable(
            arenaEntries,
            'Play a 1v1 or Solo Arena match to record your + / - ELO and League Points changes here.',
            { label: 'Current Arena ELO Rating', score: arenaElo, unit: 'ELO' }
          )}
        </div>
      )}

      {/* TAB 3: Weekly EXP & Career Score */}
      {activeTab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 14,
              padding: '9px 12px',
              borderRadius: 10,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              fontSize: 12.5,
              color: 'var(--t2)',
            }}
          >
            <span>Weekly Experience: <strong style={{ color: 'var(--purple)' }}>{weeklyXp} XP</strong></span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Career Score: <strong style={{ color: 'var(--accent)' }}>{careerScore}/100</strong></span>
          </div>
          {renderDeltaTable(
            expAndCareerEntries,
            'Finish quests, daily missions, or interviews to record your Weekly EXP and Career Score changes here.',
            { label: 'Current Career Score', score: careerScore, unit: 'pts' }
          )}
        </div>
      )}

      {/* TAB 4: Behavioral Mentality Profile */}
      {activeTab === 'mentality' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {mentalityBreakdown.traits.map((t, idx) => (
              <div
                key={t.trait}
                style={{
                  padding: 13,
                  borderRadius: 12,
                  background: idx === 0 ? 'rgba(99,102,241,0.08)' : 'var(--bg2)',
                  border: `1px solid ${idx === 0 ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>
                    {t.badge} {t.trait}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, fontFamily: 'var(--font-mono)', color: t.color }}>
                    {t.percent}%
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: 'var(--bg3)', overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${t.percent}%`, height: '100%', background: t.color, borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0, lineHeight: 1.4 }}>{t.summary}</p>
              </div>
            ))}
          </div>

          {mentalityEntries.length > 0 ? (
            renderDeltaTable(mentalityEntries, '')
          ) : (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t3)' }}>
              <strong style={{ color: 'var(--t1)' }}>Dominant: {mentalityBreakdown.dominant}</strong> · Secondary: {mentalityBreakdown.secondary}. Mentality shifts will log automatically as you complete duels, missions, and oral checks.
            </div>
          )}
        </div>
      )}
    </section>
  );
};
