'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { PIN_COSTS, PinTransaction } from '@/lib/hooks/usePinBalance';
import PinCoin from '@/components/pins/PinCoin';
import { triggerCoinStream } from '@/components/pins/coinAnimation';
import { useAuth } from '@/lib/context/AuthContext';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';

// ── Types ──────────────────────────────────────────────────────────────────
type PageTab = 'buy' | 'wallet';
type FilterTab = 'all' | 'earned' | 'spent';

// ── Pin Pack Catalog (mirrors server PLAN_PRICES_PAISE) ────────────────────
const PIN_PACKS = [
  { id: 'pack_50',   pins: 50,   priceRs: 49,  label: 'Starter',   badge: '',            color: '#6366f1' },
  { id: 'pack_150',  pins: 150,  priceRs: 99,  label: 'Regular',   badge: 'Popular',     color: '#8b5cf6' },
  { id: 'pack_500',  pins: 500,  priceRs: 249, label: 'Power',     badge: '⭐ Best Rate', color: '#10b981' },
  { id: 'pack_1200', pins: 1200, priceRs: 499, label: 'Mega',      badge: '🔥 Best Value',color: '#f59e0b' },
] as const;

// ── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60_000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function nextRefreshCountdown(): string {
  const now = new Date();
  const next = new Date();
  next.setHours(1, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const diff = Math.floor((next.getTime() - now.getTime()) / 1000);
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

const HIGH_VALUE = new Set(['quest', 'mission', 'ai_interview', 'interview', 'group_discussion', 'gd', 'resume_enhance', 'career_assets', 'career_dna_calc']);

function getEfficiency(history: PinTransaction[]) {
  const spends = history.filter(t => t.type === 'spend');
  if (!spends.length) return 100;
  return Math.round((spends.filter(t => HIGH_VALUE.has(t.source as string)).length / spends.length) * 100);
}

function getBreakdown(history: PinTransaction[]) {
  const map = new Map<string, { label: string; icon: string; total: number }>();
  for (const tx of history) {
    if (tx.type !== 'spend') continue;
    const meta = PIN_COSTS[tx.source as string] ?? { label: tx.reason || 'Other', icon: '🔓' };
    const existing = map.get(meta.label);
    if (existing) existing.total += tx.amount;
    else map.set(meta.label, { label: meta.label, icon: meta.icon, total: tx.amount });
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function getSourceIcon(source: string, type: 'earn' | 'spend'): string {
  if (source === 'course_enrollment') return '🎓';
  if (type === 'earn') return '⚡';
  return PIN_COSTS[source]?.icon ?? '🔓';
}

// ── Checkout hook ────────────────────────────────────────────────────────────
function useCheckout(user: any, onSuccess: (pins: number, isPro?: boolean, bonusGranted?: number) => void) {
  const [loading, setLoading] = useState<string | null>(null);

  const checkout = useCallback(async (planId: string, extraBody?: Record<string, any>) => {
    if (!user) {
      toast.error('Not logged in', 'Please log in to purchase.');
      return;
    }
    setLoading(planId);
    try {
      const orderRes = await api.post<any>('/api/payment/create-order', { planId, ...extraBody });

      if (orderRes.isMock) {
        const verifyRes = await api.post<any>('/api/payment/verify', {
          razorpay_order_id: orderRes.orderId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'sig_mock_dev',
          planId,
          ...(extraBody?.customPins ? { customPins: extraBody.customPins } : {}),
        });
        if (verifyRes.ok) {
          const credited = verifyRes.pinsGranted ?? (planId === 'pro' ? 500 : 0);
          if (planId === 'pro') {
            toast.success('🎉 Pro Pass Activated!', verifyRes.message || 'Welcome to Pro! 500 bonus pins credited.');
            onSuccess(0, true, 500);
          } else {
            toast.success(`+${credited} Pins Credited ⚡`, 'Your pin balance has been updated.');
            onSuccess(credited, false, 0);
          }
        } else {
          toast.error('Verification Failed', verifyRes.message || 'Could not verify sandbox payment.');
        }
        return;
      }

      await openRazorpayCheckout({
        key: orderRes.keyId,
        amount: orderRes.amount,
        currency: orderRes.currency || 'INR',
        name: 'PinIT Career OS',
        description: planId === 'pro' ? 'PRO Career Accelerator — ₹499/mo' : 'Pin Pack Top-Up',
        order_id: orderRes.orderId,
        prefill: {
          name: user.displayName || undefined,
          email: user.email || undefined,
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => setLoading(null),
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post<any>('/api/payment/verify', {
              ...response,
              planId,
              ...(extraBody?.customPins ? { customPins: extraBody.customPins } : {}),
            });
            if (verifyRes.ok) {
              if (planId === 'pro') {
                toast.success('🎉 Pro Pass Activated!', 'Welcome to Pro Career Accelerator! 120 Daily Pins active & 500 Bonus Pins in Vault.');
                triggerCoinStream({ count: 24 });
                onSuccess(0, true, 500);
              } else {
                const credited = verifyRes.pinsGranted ?? 0;
                toast.success(`+${credited} Pins Credited!`, 'Your pin balance has been updated.');
                triggerCoinStream({ count: 18 });
                onSuccess(credited, false, 0);
              }
            } else {
              toast.error('Verification Pending', verifyRes.message || 'Payment processed. Pins will credit shortly.');
            }
          } catch (err: any) {
            toast.error('Verify Error', err.message || 'Could not verify payment.');
          } finally {
            setLoading(null);
          }
        },
      });
    } catch (err: any) {
      toast.error('Checkout Failed', err.message || 'Could not initiate payment.');
    } finally {
      setLoading(null);
    }
  }, [user, onSuccess]);

  return { checkout, loading };
}

// ── Main Page ──────────────────────────────────────────────────────────────
const PAGE_SIZE = 15;

export default function PinsWalletPage() {
  const { user } = useAuth();
  const { pins, pinHistory, isLoaded, setPins, bonusPins, setBonusPins, claimBonusPins } = useCareerOS();

  const [activeTab, setActiveTab] = useState<PageTab>('buy');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [page, setPage] = useState(0);
  const [customPins, setCustomPins] = useState(300);
  const [claiming, setClaiming] = useState(false);

  const customPrice = Math.ceil(customPins / 3);

  const onPurchaseSuccess = useCallback((grantedPins?: number, isPro?: boolean, bonusGranted?: number) => {
    if (isPro) {
      // Jio/Airtel model: Activate 120 daily quota, deposit 500 into bonus vault
      setPins?.(Math.max(pins, 120));
      if (setBonusPins && typeof bonusGranted === 'number') {
        setBonusPins((bonusPins || 0) + bonusGranted);
      }
    } else if (typeof grantedPins === 'number' && grantedPins > 0) {
      setPins?.(pins + grantedPins);
    }
  }, [pins, setPins, bonusPins, setBonusPins]);

  const { checkout, loading } = useCheckout(user, onPurchaseSuccess);

  // Wallet data
  const filtered = useMemo(() => {
    if (filter === 'earned') return pinHistory.filter(t => t.type === 'earn');
    if (filter === 'spent')  return pinHistory.filter(t => t.type === 'spend');
    return pinHistory;
  }, [pinHistory, filter]);

  const paginated   = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const efficiency  = useMemo(() => getEfficiency(pinHistory), [pinHistory]);
  const breakdown   = useMemo(() => getBreakdown(pinHistory), [pinHistory]);
  const maxBreakdown = breakdown[0]?.total || 1;
  const totalEarned = pinHistory.filter(t => t.type === 'earn').reduce((s, t) => s + t.amount, 0);
  const totalSpent  = pinHistory.filter(t => t.type === 'spend').reduce((s, t) => s + t.amount, 0);

  const balColor  = pins < 20 ? '#ef4444' : pins < 50 ? '#f59e0b' : 'var(--accent)';
  const effColor  = efficiency >= 75 ? '#10b981' : efficiency >= 40 ? '#f59e0b' : '#ef4444';

  if (!isLoaded) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--t3)', fontSize: 14 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
        Loading Pins Wallet…
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── 2-Section Header: Active Daily Pins + Bonus Pins Vault ──────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: 'var(--t1)', margin: 0, letterSpacing: '-0.02em' }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><PinCoin size={26} glow animate /> Pins & Wallet</span>
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--t3)' }}>
            Active daily allowance & permanent Bonus Pins Vault.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Section 1: Active Daily Quota (Jio/Airtel model) */}
          <div id="active-daily-pins-badge" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 14,
            background: pins < 20 ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
            border: `1.5px solid ${pins < 20 ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.25)'}`,
          }}>
            <PinCoin size={26} glow animate />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--t3)' }}>
                Active Daily Pins
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 900, color: balColor, lineHeight: 1.1 }}>
                {pins.toLocaleString()} Pins
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--t3)', marginTop: 2 }}>
                1:00 AM Reset in {nextRefreshCountdown()}
              </div>
            </div>
          </div>

          {/* Section 2: Bonus Pins Vault (Voucher Pack - never wiped at 1AM) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.08) 100%)',
            border: '1.5px solid rgba(16,185,129,0.3)',
          }}>
            <span style={{ fontSize: 22 }}>🎁</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981' }}>
                Bonus Pins Vault
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 900, color: '#10b981', lineHeight: 1.1 }}>
                {(bonusPins || 0).toLocaleString()} Bonus Pins
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--t3)', marginTop: 2 }}>
                Safe from 1 AM reset
              </div>
            </div>

            {/* Claim button */}
            <button
              onClick={() => claimBonusPins()}
              disabled={!bonusPins || bonusPins <= 0}
              style={{
                marginLeft: 4,
                padding: '7px 14px',
                borderRadius: 9,
                border: 'none',
                background: bonusPins > 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.08)',
                color: bonusPins > 0 ? '#fff' : 'var(--t3)',
                fontWeight: 800,
                fontSize: 11.5,
                cursor: bonusPins > 0 ? 'pointer' : 'not-allowed',
                boxShadow: bonusPins > 0 ? '0 2px 8px rgba(16,185,129,0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
              title={bonusPins > 0 ? 'Transfer bonus pins to your active balance' : 'No bonus pins to claim'}
            >
              Claim
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, background: 'var(--bg2)', borderRadius: 14, padding: 5, border: '1px solid var(--border)', width: 'fit-content' }}>
        {([['buy', '💳 Buy Pins & Plans'], ['wallet', '📊 My Wallet']] as [PageTab, string][]).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '9px 20px', borderRadius: 10,
              border: 'none', cursor: 'pointer',
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--t3)',
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: 13, transition: 'all 0.15s', outline: 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: BUY PINS & PLANS
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'buy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Section: Pin Packs ─────────────────────────────────── */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><PinCoin size={18} glow /> Pin Packs</span> <span style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 500 }}>— one-time top-up, never expires</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
              {PIN_PACKS.map(pack => (
                <div
                  key={pack.id}
                  style={{
                    background: 'var(--bg2)',
                    border: `1.5px solid ${pack.badge ? pack.color + '55' : 'var(--border)'}`,
                    borderRadius: 18, padding: '20px 18px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {pack.badge && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: pack.color, color: '#fff',
                      fontSize: 9.5, fontWeight: 800, padding: '3px 9px',
                      borderRadius: 20, letterSpacing: '0.04em',
                    }}>
                      {pack.badge}
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: pack.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{pack.label} Pack</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 900, color: 'var(--t1)', lineHeight: 1 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{pack.pins.toLocaleString()} <PinCoin size={18} glow /></span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t4)' }}>₹{(pack.priceRs / pack.pins).toFixed(2)} per pin</div>
                  <button
                    disabled={loading === pack.id}
                    onClick={() => checkout(pack.id)}
                    style={{
                      marginTop: 4, padding: '11px 0', borderRadius: 12, border: 'none',
                      background: `linear-gradient(135deg, ${pack.color}, ${pack.color}cc)`,
                      color: '#fff', fontWeight: 700, fontSize: 13,
                      cursor: loading === pack.id ? 'not-allowed' : 'pointer',
                      opacity: loading === pack.id ? 0.7 : 1,
                      transition: 'opacity 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => { if (loading !== pack.id) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                  >
                    {loading === pack.id ? 'Opening...' : `Buy for ₹${pack.priceRs}`}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section: Custom Pins ───────────────────────────────── */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: '22px 24px' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>🎛️ Custom Pin Pack</div>
            <div style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 18 }}>Choose exactly how many pins you want (100–5,000). Rate: ₹1 per 3 pins.</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input
                  type="range" min={100} max={5000} step={50}
                  value={customPins}
                  onChange={e => setCustomPins(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--t4)', marginTop: 4 }}>
                  <span>100 pins</span><span>5,000 pins</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '14px 20px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, minWidth: 130 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{customPins.toLocaleString()} <PinCoin size={20} glow /></span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--t4)', marginTop: 4 }}>for ₹{customPrice}</div>
              </div>

              <button
                disabled={loading === 'pack_custom'}
                onClick={() => checkout('pack_custom', { customPins })}
                style={{
                  padding: '13px 24px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                  color: '#fff', fontWeight: 700, fontSize: 13,
                  cursor: loading === 'pack_custom' ? 'not-allowed' : 'pointer',
                  opacity: loading === 'pack_custom' ? 0.7 : 1,
                  whiteSpace: 'nowrap', transition: 'opacity 0.15s',
                }}
              >
                {loading === 'pack_custom' ? 'Opening...' : `Buy ${customPins} Pins — ₹${customPrice}`}
              </button>
            </div>
          </div>

          {/* ── Section: Pro Subscription ─────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 100%)',
            border: '2px solid rgba(99,102,241,0.3)',
            borderRadius: 20, padding: '28px 28px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 14, right: 18, background: (user?.subscription_tier === 'pro' || user?.subscription_status === 'active') ? '#10b981' : 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 20 }}>
              {(user?.subscription_tier === 'pro' || user?.subscription_status === 'active') ? 'CURRENT PLAN (ACTIVE)' : 'MOST POPULAR'}
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
              Pro Career Accelerator
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 900, color: 'var(--t1)', lineHeight: 1, marginBottom: 4 }}>
              ₹499 <span style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 500 }}>/ month</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 20, lineHeight: 1.6 }}>
              For ambitious students preparing for Tier-1 interviews. Includes 120 Daily Pins refreshed every 1:00 AM IST + 500 Bonus Pins in your permanent vault.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 22 }}>
              {[
                '✓ 24/7 Voice AI Avatar Mock Interviews',
                '✓ 500 monthly bonus Pins',
                '✓ Recruiter Priority Showcase',
                '✓ BLUF Communication Diagnostics',
                '✓ Live AST Code Benchmarks',
                '✓ Everything in Student Free Pass',
              ].map(feat => (
                <div key={feat} style={{ fontSize: 13, color: 'var(--t2)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  {feat}
                </div>
              ))}
            </div>
            {user?.subscription_tier === 'pro' || user?.subscription_status === 'active' ? (
              <button
                disabled
                style={{
                  padding: '14px 32px', borderRadius: 14,
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#10b981', fontWeight: 700, fontSize: 15,
                  cursor: 'default',
                  display: 'inline-flex', alignItems: 'center', gap: 8
                }}
              >
                <span>✓</span> Pro Plan Active
              </button>
            ) : (
              <button
                disabled={loading === 'pro'}
                onClick={() => checkout('pro')}
                style={{
                  padding: '14px 32px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', fontWeight: 700, fontSize: 15,
                  cursor: loading === 'pro' ? 'not-allowed' : 'pointer',
                  opacity: loading === 'pro' ? 0.7 : 1,
                  boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { if (loading !== 'pro') { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; }}}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}
              >
                {loading === 'pro' ? 'Initiating Checkout...' : 'Upgrade to Pro — ₹499/month →'}
              </button>
            )}
          </div>

          {/* ── How Pins Work ──────────────────────────────────────── */}
          <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, padding: '18px 22px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 12 }}>💡 How Pins Work</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {[
                { icon: '⏰', text: 'Free 120 pins arrive every night at 1:00 AM' },
                { icon: '🗺', text: 'Quest unlock = 20 pins (30 min access)' },
                { icon: '🎙', text: 'AI Interview = 40 pins (30 min session)' },
                { icon: '💳', text: 'Purchased pins never expire' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--t2)', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{t.icon}</span><span>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: MY WALLET
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'wallet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Stats Row ─────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontSize: 10, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Total Earned</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: '#10b981' }}>+{totalEarned.toLocaleString()} pins</div>
              <div style={{ fontSize: 10, color: 'var(--t4)' }}>{pinHistory.filter(t => t.type === 'earn').length} earn events</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontSize: 10, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Total Spent</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: '#ef4444' }}>-{totalSpent.toLocaleString()} pins</div>
              <div style={{ fontSize: 10, color: 'var(--t4)' }}>{pinHistory.filter(t => t.type === 'spend').length} spend events</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: `1px solid ${effColor}30`, borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontSize: 10, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Efficiency</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: effColor }}>{efficiency}%</div>
              <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 10, overflow: 'hidden', marginTop: 6 }}>
                <div style={{ height: '100%', width: `${efficiency}%`, background: effColor, borderRadius: 10 }} />
              </div>
            </div>
          </div>

          {/* ── Category Breakdown ─────────────────────────────────── */}
          {breakdown.length > 0 && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 14 }}>📊 Where Your Pins Went</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {breakdown.map(cat => (
                  <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 17, width: 26, flexShrink: 0, textAlign: 'center' }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.label}</div>
                      <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.round((cat.total / maxBreakdown) * 100)}%`, background: 'linear-gradient(90deg, var(--accent), var(--purple))', borderRadius: 10 }} />
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 800, color: '#ef4444', flexShrink: 0 }}>-{cat.total} ⚡</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Transaction History ─────────────────────────────────── */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>🧾 Transaction History</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['all', 'earned', 'spent'] as FilterTab[]).map(tab => (
                  <button key={tab} onClick={() => { setFilter(tab); setPage(0); }}
                    style={{ padding: '5px 14px', borderRadius: 20, border: `1px solid ${filter === tab ? 'var(--accent)' : 'var(--border)'}`, background: filter === tab ? 'rgba(99,102,241,0.12)' : 'transparent', color: filter === tab ? 'var(--accent)' : 'var(--t3)', fontSize: 11.5, fontWeight: filter === tab ? 700 : 500, cursor: 'pointer', outline: 'none', textTransform: 'capitalize' }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {paginated.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--t3)' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⚡</div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>No transactions yet</p>
                <p style={{ margin: '6px 0 0', fontSize: 12 }}>
                  {filter === 'earned' ? 'Complete streaks or buy packs to earn pins.'
                    : filter === 'spent' ? 'Unlock features to see your spend history.'
                    : 'Your pin history will appear here.'}
                </p>
                <button onClick={() => setActiveTab('buy')} style={{ marginTop: 14, padding: '9px 20px', borderRadius: 10, border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Buy Pins →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {paginated.map(tx => (
                  <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: tx.type === 'earn' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)', border: `1px solid ${tx.type === 'earn' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                      {getSourceIcon(tx.source as string, tx.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tx.reason || PIN_COSTS[tx.source as string]?.label || tx.source}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--t4)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                        {timeAgo(tx.timestamp)} · {formatDate(tx.timestamp)}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 14, color: tx.type === 'earn' ? '#10b981' : '#ef4444', flexShrink: 0 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{tx.type === 'earn' ? '+' : '-'}{tx.amount} <PinCoin size={14} /></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 18 }}>
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '7px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', fontSize: 12, fontWeight: 600, cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}>← Prev</button>
                <span style={{ fontSize: 12, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>Page {page + 1} of {totalPages}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ padding: '7px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', fontSize: 12, fontWeight: 600, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1 }}>Next →</button>
              </div>
            )}
          </div>

          {/* ── Buy More CTA ────────────────────────────────────────── */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setActiveTab('buy')} style={{ padding: '13px 30px', borderRadius: 14, background: 'linear-gradient(135deg, var(--accent), var(--purple))', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
              💳 Buy More Pins
            </button>
            <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 8 }}>Purchased pins never expire</div>
          </div>
        </div>
      )}
    </div>
  );
}
