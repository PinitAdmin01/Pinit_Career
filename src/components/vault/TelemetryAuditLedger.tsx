'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  getMetricLedger,
  computeMentalityBreakdown,
  METRIC_LABELS,
  type MetricKind,
  type MetricLedgerEntry,
} from '@/lib/telemetry/metricsLedger';
import { calculateLeaguePoints } from '@/lib/leagues/leaguePoints';
import { TRUST_CONSTANTS } from '@/lib/trust/trustEngine';

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
    emptyTitle: string,
    emptySub: string,
    baselineRow?: { label: string; score: number; unit: string }
  ) => (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 13,
          textAlign: 'left',
        }}
      >
        <thead>
          <tr
            style={{
              background: 'rgba(15, 23, 42, 0.55)',
              borderBottom: '1px solid var(--border)',
              color: 'var(--t3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 0.7,
            }}
          >
            <th style={{ padding: '11px 14px' }}>Time</th>
            <th style={{ padding: '11px 14px' }}>Metric / Source</th>
            <th style={{ padding: '11px 14px' }}>Event / Reason</th>
            <th style={{ padding: '11px 14px', textAlign: 'right' }}>Delta (+ / -)</th>
            <th style={{ padding: '11px 14px', textAlign: 'right' }}>Resulting</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <>
              {baselineRow && (
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.015)' }}>
                  <td style={{ padding: '12px 14px', color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
                    Initial Anchor
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--bg3)', color: 'var(--t2)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
                      baseline
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--t1)' }}>
                    {baselineRow.label}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>
                    0
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--t1)' }}>
                    {baselineRow.score} {baselineRow.unit}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={5} style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--t3)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--t2)', marginBottom: 4 }}>{emptyTitle}</div>
                  <div style={{ fontSize: 12 }}>{emptySub}</div>
                </td>
              </tr>
            </>
          ) : (
            rows.map((entry) => {
              const isPos = entry.delta > 0;
              const isNeg = entry.delta < 0;
              const metricMeta = METRIC_LABELS[entry.metric] || { label: entry.metric, unit: '', color: 'var(--t2)' };
              return (
                <tr
                  key={entry.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s',
                  }}
                >
                  <td style={{ padding: '11px 14px', color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontSize: 11.5, whiteSpace: 'nowrap' }}>
                    {formatShortTime(entry.timestamp)}
                  </td>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 6,
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
                  <td style={{ padding: '11px 14px', color: 'var(--t1)', fontWeight: 500 }}>
                    {entry.action}
                    {entry.mentalityTag && (
                      <span style={{ marginLeft: 8, fontSize: 10.5, padding: '1px 6px', borderRadius: 5, background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
                        {entry.mentalityTag}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        minWidth: 52,
                        textAlign: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: 12.5,
                        padding: '3px 9px',
                        borderRadius: 99,
                        background: isPos
                          ? 'rgba(34,197,94,0.14)'
                          : isNeg
                          ? 'rgba(239,68,68,0.14)'
                          : 'var(--bg3)',
                        color: isPos ? 'var(--green)' : isNeg ? '#f87171' : 'var(--t3)',
                        border: `1px solid ${
                          isPos
                            ? 'rgba(34,197,94,0.3)'
                            : isNeg
                            ? 'rgba(239,68,68,0.3)'
                            : 'var(--border)'
                        }`,
                      }}
                    >
                      {isPos ? `+${entry.delta}` : entry.delta}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--t1)', whiteSpace: 'nowrap' }}>
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
    { id: 'trust', label: 'Trust Score Ledger (+ / -)', badge: `${liveTrustScore}/100` },
    { id: 'arena', label: 'Arena League & ELO', badge: `${arenaElo} ELO` },
    { id: 'experience', label: 'Weekly EXP & Career Score', badge: `${weeklyXp} XP` },
    { id: 'mentality', label: 'Mentality Profile', badge: mentalityBreakdown.dominant },
  ];

  return (
    <section
      data-testid="telemetry-audit-ledger"
      style={{
        marginTop: 28,
        borderRadius: 20,
        padding: 22,
        background: 'linear-gradient(165deg, rgba(255,255,255,0.025), rgba(10,15,30,0.65))',
        border: '1px solid var(--border)',
        boxShadow: '0 12px 34px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 800, margin: '0 0 4px', color: 'var(--t1)' }}>
            Integrity, Telemetry &amp; Mentality Audit Tables
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', margin: 0 }}>
            Every positive (+) and negative (-) change to your Trust Score, Arena ELO, League Points, Weekly EXP, Career Score, and Behavioral Mentality.
          </p>
        </div>
      </div>

      {/* Tab Selector */}
      <div role="tablist" aria-label="Telemetry Audit Ledgers" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
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
                padding: '8px 14px',
                borderRadius: 12,
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'rgba(99,102,241,0.14)' : 'var(--bg2)',
                color: active ? '#a5b4fc' : 'var(--t2)',
                fontSize: 12.5,
                fontWeight: active ? 700 : 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s ease',
              }}
            >
              <span>{t.label}</span>
              <span
                style={{
                  fontSize: 10.5,
                  padding: '2px 7px',
                  borderRadius: 99,
                  background: active ? 'rgba(99,102,241,0.22)' : 'var(--bg3)',
                  color: active ? '#c7d2fe' : 'var(--t3)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Trust Score Ledger (+ / -) */}
      {activeTab === 'trust' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: 10 }}>
            {[
              { label: 'Current Trust', value: `${liveTrustScore} / 100`, tone: 'var(--green)' },
              { label: 'Default Baseline', value: `${TRUST_CONSTANTS.DEFAULT_SCORE}`, tone: 'var(--t2)' },
              { label: 'Genuine Activity', value: '+3 / item', tone: 'var(--accent)' },
              { label: 'Vault Defense Pass / Fail', value: '+5 / -5', tone: 'var(--teal)' },
              { label: 'Cheating Penalty', value: '-2 (1x/session)', tone: '#f87171' },
            ].map((rule) => (
              <div key={rule.label} style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--t3)', letterSpacing: 0.6 }}>{rule.label}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: rule.tone, marginTop: 2, fontFamily: 'var(--font-mono)' }}>{rule.value}</div>
              </div>
            ))}
          </div>
          {renderDeltaTable(
            trustEntries,
            'No Trust Score adjustments recorded in this browser yet',
            'Complete missions, lessons, exams, AI interviews (+3), pass Brutal Vault Defense (+5 / -5), or trigger anti-cheat audits (-2 once per session) to populate this live table.',
            { label: 'New Candidate Starting Trust Baseline', score: TRUST_CONSTANTS.DEFAULT_SCORE, unit: 'pts' }
          )}
        </div>
      )}

      {/* TAB 2: Arena League Points & Arena ELO */}
      {activeTab === 'arena' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--t3)' }}>Live Arena ELO</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--teal)', fontFamily: 'var(--font-display)' }}>{arenaElo}</div>
              <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>+20 Victory / -20 Defeat</div>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--t3)' }}>Arena League Points (LP)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-display)' }}>{leaguePoints} LP</div>
              <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>{weeklyXp} Weekly XP + {arenaBonusPts} Combat Bonus</div>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--t3)' }}>Arena Wins Recorded</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>{arenaWins}</div>
              <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>1v1 &amp; Solo Sparring Victories</div>
            </div>
          </div>
          {renderDeltaTable(
            arenaEntries,
            'No Arena ELO or League Point transactions logged yet',
            'Compete in the Arena (1v1 or Solo Challenge) or complete Quests to see your + / - ELO and League Points adjustments here.',
            { label: 'Starting Arena ELO Rating Anchor', score: 100, unit: 'ELO' }
          )}
        </div>
      )}

      {/* TAB 3: Weekly EXP & Career Score */}
      {activeTab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--t3)' }}>Weekly Experience (EXP)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple)', fontFamily: 'var(--font-display)' }}>{weeklyXp} XP</div>
              <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>Earned from quests, exams &amp; interviews</div>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--t3)' }}>Career Readiness Score</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{careerScore} / 100</div>
              <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>Verified quests (50) + Missions (50)</div>
            </div>
          </div>
          {renderDeltaTable(
            expAndCareerEntries,
            'No Weekly EXP or Career Score events logged yet',
            'Finish course units, daily missions, or interviews to inspect every XP and Career Score increment in real time.'
          )}
        </div>
      )}

      {/* TAB 4: Behavioral Mentality Profile & Shifts */}
      {activeTab === 'mentality' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {mentalityBreakdown.traits.map((t, idx) => (
              <div
                key={t.trait}
                style={{
                  padding: 15,
                  borderRadius: 14,
                  background: idx === 0 ? 'rgba(99,102,241,0.08)' : 'var(--bg2)',
                  border: `1px solid ${idx === 0 ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>
                    {t.badge} {t.trait}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, fontFamily: 'var(--font-mono)', color: t.color }}>
                    {t.percent}%
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: 'var(--bg3)', overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: `${t.percent}%`, height: '100%', background: t.color, borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0, lineHeight: 1.45 }}>{t.summary}</p>
              </div>
            ))}
          </div>
          {renderDeltaTable(
            mentalityEntries,
            `Dominant Archetype: ${mentalityBreakdown.dominant} · Secondary: ${mentalityBreakdown.secondary}`,
            'As you win Arena duels (Pattern Hunter), hold Trust/Streaks (Stabilizer), defend Interviews (Social Intelligence), and upload proofs (Explorer), every mentality shift is logged here.'
          )}
        </div>
      )}
    </section>
  );
};
