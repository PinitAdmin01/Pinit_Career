'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePinBalance, PIN_COSTS, PinTransaction } from '@/lib/hooks/usePinBalance';
import { useAuth } from '@/lib/context/AuthContext';

// ── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function nextRefreshCountdown(): string {
  const now = new Date();
  const next = new Date();
  next.setHours(1, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const diff = Math.floor((next.getTime() - now.getTime()) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  return `${h}h ${m}m`;
}

const HIGH_VALUE_SOURCES = new Set(['quest', 'mission', 'ai_interview', 'interview', 'group_discussion', 'gd', 'resume_enhance', 'career_assets', 'career_dna_calc']);

function getEfficiencyScore(history: PinTransaction[]): number {
  const spends = history.filter(tx => tx.type === 'spend');
  if (!spends.length) return 100;
  const highValue = spends.filter(tx => HIGH_VALUE_SOURCES.has(tx.source as string));
  return Math.round((highValue.length / spends.length) * 100);
}

function getCategoryBreakdown(history: PinTransaction[]): { label: string; icon: string; total: number }[] {
  const map = new Map<string, { label: string; icon: string; total: number }>();
  for (const tx of history) {
    if (tx.type !== 'spend') continue;
    const src = tx.source as string;
    const meta = PIN_COSTS[src] ?? { label: tx.reason || 'Other', icon: '🔓' };
    const key = meta.label;
    const existing = map.get(key);
    if (existing) {
      existing.total += tx.amount;
    } else {
      map.set(key, { label: meta.label, icon: meta.icon, total: tx.amount });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function getSourceIcon(source: string, type: 'earn' | 'spend'): string {
  if (type === 'earn') return '⚡';
  const meta = PIN_COSTS[source];
  return meta?.icon ?? '🔓';
}

// ── Page ───────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'earned' | 'spent';

export default function PinsWalletPage() {
  const { user } = useAuth();
  const { pins, pinHistory, isLoaded } = usePinBalance({ userId: user?.id });
  const [filter, setFilter] = useState<FilterTab>('all');
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 15;

  const filtered = useMemo(() => {
    if (filter === 'earned') return pinHistory.filter(tx => tx.type === 'earn');
    if (filter === 'spent') return pinHistory.filter(tx => tx.type === 'spend');
    return pinHistory;
  }, [pinHistory, filter]);

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const efficiencyScore = useMemo(() => getEfficiencyScore(pinHistory), [pinHistory]);
  const breakdown = useMemo(() => getCategoryBreakdown(pinHistory), [pinHistory]);
  const maxBreakdownTotal = breakdown[0]?.total || 1;

  const totalEarned = pinHistory.filter(tx => tx.type === 'earn').reduce((s, tx) => s + tx.amount, 0);
  const totalSpent  = pinHistory.filter(tx => tx.type === 'spend').reduce((s, tx) => s + tx.amount, 0);

  const effColor = efficiencyScore >= 75 ? '#10b981' : efficiencyScore >= 40 ? '#f59e0b' : '#ef4444';
  const balColor = pins < 20 ? '#ef4444' : pins < 50 ? '#f59e0b' : 'var(--accent)';

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--t3)', fontSize: 14 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12, animation: 'spin 1s linear infinite' }}>⚡</div>
          Loading your Pins Wallet…
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px 60px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: 'var(--t1)', margin: 0, letterSpacing: '-0.02em' }}>
          ⚡ Pins Wallet
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--t3)' }}>
          Track your pin balance, spending history, and efficiency.
        </p>
      </div>

      {/* ── Top Stats Row ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>

        {/* Balance Card */}
        <div style={{
          background: 'var(--bg2)',
          border: `1.5px solid ${pins < 20 ? 'rgba(239,68,68,0.35)' : 'rgba(99,102,241,0.25)'}`,
          borderRadius: 18,
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Balance</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 38, fontWeight: 900, color: balColor, lineHeight: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚡</span><span>{pins.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 4 }}>
            {pins < 20 ? '⚠️ Low balance — consider buying more' : `Next free refresh in ${nextRefreshCountdown()}`}
          </div>
          {/* glow blob */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: pins < 20 ? 'rgba(239,68,68,0.07)' : 'rgba(99,102,241,0.07)', filter: 'blur(24px)', pointerEvents: 'none' }} />
        </div>

        {/* Earned */}
        <div style={{ background: 'var(--bg2)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 18, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Earned</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 900, color: '#10b981', lineHeight: 1 }}>+{totalEarned.toLocaleString()} ⚡</div>
          <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 4 }}>{pinHistory.filter(t => t.type === 'earn').length} earn events</div>
        </div>

        {/* Spent */}
        <div style={{ background: 'var(--bg2)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 18, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Spent</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>-{totalSpent.toLocaleString()} ⚡</div>
          <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 4 }}>{pinHistory.filter(t => t.type === 'spend').length} spend events</div>
        </div>

        {/* Efficiency */}
        <div style={{ background: 'var(--bg2)', border: `1px solid ${effColor}30`, borderRadius: 18, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Spending Efficiency</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 900, color: effColor, lineHeight: 1 }}>
            {efficiencyScore}%
          </div>
          <div style={{ marginTop: 4 }}>
            <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${efficiencyScore}%`, background: effColor, borderRadius: 10, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--t4)', marginTop: 4 }}>
              {efficiencyScore >= 75 ? '✅ Great usage — mostly high-value features' : efficiencyScore >= 40 ? '⚠️ Mix of high and low-value spends' : '❌ Mostly low-value spends — invest in quests & interviews'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Breakdown ───────────────────────────────────────────── */}
      {breakdown.length > 0 && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: '22px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            📊 Where Your Pins Went
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {breakdown.map(cat => (
              <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.label}</div>
                  <div style={{ height: 7, background: 'var(--bg3)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.round((cat.total / maxBreakdownTotal) * 100)}%`,
                      background: 'linear-gradient(90deg, var(--accent), var(--purple))',
                      borderRadius: 10,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 800, color: '#ef4444', flexShrink: 0 }}>
                  -{cat.total} ⚡
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Transaction History ──────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: '22px 24px' }}>

        {/* Header + Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>🧾 Transaction History</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'earned', 'spent'] as FilterTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => { setFilter(tab); setPage(0); }}
                style={{
                  padding: '5px 14px',
                  borderRadius: 20,
                  border: `1px solid ${filter === tab ? 'var(--accent)' : 'var(--border)'}`,
                  background: filter === tab ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: filter === tab ? 'var(--accent)' : 'var(--t3)',
                  fontSize: 11.5,
                  fontWeight: filter === tab ? 700 : 500,
                  cursor: 'pointer',
                  outline: 'none',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        {paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--t3)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>No transactions yet</p>
            <p style={{ margin: '6px 0 0', fontSize: 12 }}>
              {filter === 'earned' ? 'Complete streaks or buy packs to earn pins.' : filter === 'spent' ? 'No pins spent yet — unlock features to see history.' : 'Pin history will appear here once you start using features.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {paginated.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 14px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  transition: 'border-color 0.15s',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: tx.type === 'earn' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${tx.type === 'earn' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {getSourceIcon(tx.source as string, tx.type)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.reason || (PIN_COSTS[tx.source as string]?.label ?? tx.source)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t4)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    {timeAgo(tx.timestamp)} · {formatDate(tx.timestamp)}
                  </div>
                </div>

                {/* Amount */}
                <div style={{
                  fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 15,
                  color: tx.type === 'earn' ? '#10b981' : '#ef4444',
                  flexShrink: 0,
                }}>
                  {tx.type === 'earn' ? '+' : '-'}{tx.amount} ⚡
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 }}>
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              style={{ padding: '7px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', fontSize: 12, fontWeight: 600, cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: 12, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              style={{ padding: '7px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', fontSize: 12, fontWeight: 600, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1 }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── Tips Card ────────────────────────────────────────────────────── */}
      <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 18, padding: '18px 22px' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 10 }}>💡 Smart Pin Tips</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { icon: '⏰', text: 'Free daily 120 Pins arrive every night at 1:00 AM' },
            { icon: '🗺', text: 'Quests (20⚡) and Missions (20⚡) are the best value — they build real skills' },
            { icon: '🎙', text: 'AI Interview (40⚡) gives you 30 min of live mock interview prep' },
            { icon: '🏆', text: 'Earn bonus pins by completing streak milestones' },
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--t2)', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{tip.icon}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Buy More CTA ─────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <Link href="/pricing" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '14px 32px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(99,102,241,0.45)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(99,102,241,0.3)'; }}
          >
            💳 Buy More Pins
          </button>
        </Link>
        <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 8 }}>
          Instant top-up · Pins never expire after purchase
        </div>
      </div>

    </div>
  );
}
