'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { PIN_COSTS, PinTransaction } from '@/hooks/usePinBalance';
import PinCoin from '@/components/pins/PinCoin';
import { triggerCoinStream } from '@/components/pins/coinAnimation';
import { useAuth } from '@/lib/context/AuthContext';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';

// ── Types ──────────────────────────────────────────────────────────────────
type PageTab = 'buy' | 'calculator' | 'wallet';
type FilterTab = 'all' | 'earned' | 'spent';

// ── Indian Tier-3 Student Sachet Micro-Packs Catalog (1 Rs = 10 Pins Rate) ──
const PIN_PACKS = [
  {
    id: 'pack_chota_9',
    pins: 100,
    priceRs: 9,
    label: 'Chota AI Sachet',
    badge: '⚡ ₹9 UPI Chota Recharge',
    color: '#10b981',
    benefit: '4 Full AI Mock Interviews or 20 Code Tutor Solves',
    perPin: '₹0.09/pin',
    popular: false,
  },
  {
    id: 'pack_sprint_29',
    pins: 350,
    priceRs: 29,
    label: 'Placement Sprint',
    badge: '🎯 Campus Favorite',
    color: '#6366f1',
    benefit: '14 AI Mocks + ATS Resume Audit & Rewrites',
    perPin: '₹0.083/pin',
    popular: true,
  },
  {
    id: 'pack_power_59',
    pins: 750,
    priceRs: 59,
    label: 'Exam Week Power',
    badge: '⭐ 25% Extra Pins',
    color: '#8b5cf6',
    benefit: '30 AI Mocks + Unlimited Code Duels & Labs',
    perPin: '₹0.078/pin',
    popular: false,
  },
  {
    id: 'pack_1000',
    pins: 1200,
    priceRs: 99,
    label: 'Semester Mastery',
    badge: '🔥 200 Bonus Pins',
    color: '#f59e0b',
    benefit: '48 AI Mocks + Permanent Lifetime Vault Storage',
    perPin: '₹0.082/pin',
    popular: false,
  },
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

const HIGH_VALUE = new Set(['quest', 'mission', 'ai_interview', 'interview', 'group_discussion', 'gd', 'resume_enhance', 'career_assets', 'career_dna_calc', 'ai_tutor']);

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
          const isSub = planId === 'pro' || planId === 'basic_student' || planId === 'student_99';
          let credited = verifyRes.pinsGranted ?? 0;
          if (!credited && !isSub) {
            if (planId === 'pack_chota_9') credited = 100;
            else if (planId === 'pack_sprint_29') credited = 350;
            else if (planId === 'pack_power_59') credited = 750;
            else if (planId === 'pack_1000') credited = 1200;
            else if (planId === 'pack_100') credited = 100;
            else if (planId === 'pack_300') credited = 300;
            else if (planId === 'pack_500') credited = 500;
          }

          if (isSub) {
            toast.success(
              planId === 'pro' ? '🎉 Pro Pass Activated!' : '🎉 Student Daily Pass Activated!',
              verifyRes.message || (planId === 'pro' ? 'Welcome to Pro! 120 Daily Pins + 500 Bonus Pins.' : 'Welcome to Basic Student Pass! 120 Daily Pins reset at 1:00 AM IST.')
            );
            onSuccess(0, true, planId === 'pro' ? 500 : 0);
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
        description: planId === 'pro'
          ? 'PRO Career Accelerator — ₹499/mo'
          : (planId === 'basic_student' || planId === 'student_99')
          ? 'Basic Student Pass (120 Daily Pins) — ₹99/mo'
          : planId === 'pack_chota_9'
          ? 'Chota AI Sachet — ₹9'
          : planId === 'pack_sprint_29'
          ? 'Placement Sprint Pack — ₹29'
          : planId === 'pack_power_59'
          ? 'Exam Week Power Pack — ₹59'
          : 'Pin Pack Top-Up',
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
              const isSub = planId === 'pro' || planId === 'basic_student' || planId === 'student_99';
              if (isSub) {
                toast.success(
                  planId === 'pro' ? '🎉 Pro Pass Activated!' : '🎉 Basic Student Pass Activated!',
                  planId === 'pro' ? 'Welcome to Pro! 120 Daily Pins active & 500 Bonus Pins in Vault.' : 'Welcome to Basic Student Pass! 120 Daily Pins active (1:00 AM IST reset).'
                );
                triggerCoinStream({ count: 24 });
                onSuccess(0, true, planId === 'pro' ? 500 : 0);
              } else {
                let credited = verifyRes.pinsGranted ?? 0;
                if (!credited) {
                  if (planId === 'pack_chota_9') credited = 100;
                  else if (planId === 'pack_sprint_29') credited = 350;
                  else if (planId === 'pack_power_59') credited = 750;
                  else if (planId === 'pack_1000') credited = 1200;
                }
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
  const [calcPins, setCalcPins] = useState<number>(() => Math.max(pins + (bonusPins || 0), 100));

  const customPrice = Math.ceil(customPins / 10);

  const onPurchaseSuccess = useCallback((grantedPins?: number, isSub?: boolean, bonusGranted?: number) => {
    if (isSub) {
      // Jio/Airtel model: Activate 120 daily quota, deposit 500 into bonus vault if pro
      setPins?.(Math.max(pins, 120));
      if (setBonusPins && typeof bonusGranted === 'number' && bonusGranted > 0) {
        setBonusPins((bonusPins || 0) + bonusGranted);
      }
    } else if (typeof grantedPins === 'number' && grantedPins > 0) {
      // Individual top-ups deposit into Permanent Bonus Vault (Safe from 1AM reset)
      if (setBonusPins) {
        setBonusPins((bonusPins || 0) + grantedPins);
      } else {
        setPins?.(pins + grantedPins);
      }
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
  const totalEarned = pinHistory.filter(t => t.type === 'earn').reduce((s, t) => s + t.amount, 0);
  const totalSpent  = pinHistory.filter(t => t.type === 'spend').reduce((s, t) => s + t.amount, 0);

  const balColor  = pins < 20 ? '#ef4444' : pins < 50 ? '#f59e0b' : 'var(--accent)';
  const effColor  = efficiency >= 75 ? '#10b981' : efficiency >= 40 ? '#f59e0b' : '#ef4444';

  if (!isLoaded) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--t3)', fontSize: 15.5 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 39.5, marginBottom: 12 }}>⚡</div>
        Loading Pins Wallet & AI Economy…
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '4px 0 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* ── 2-Section Header: Active Daily Pins + Bonus Pins Vault ──────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            <span>🇮🇳 Indian Tier-3 Student Edition · 1 Pin = 10 Paise (₹0.10)</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28.5, fontWeight: 900, color: 'var(--t1)', margin: 0, letterSpacing: '-0.02em' }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><PinCoin size={26} glow animate /> Pins & AI Economy</span>
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--t3)' }}>
            Transparent AI utility fuel: daily study allowances, UPI chota recharges, and zero-loss guarantees.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Total Spendable Balance */}
          <div id="total-spendable-pins-badge" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(139,92,246,0.08) 100%)',
            border: '1.5px solid rgba(99,102,241,0.35)',
          }}>
            <PinCoin size={26} glow animate />
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)' }}>
                Total Spendable
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: 'var(--t1)', lineHeight: 1.1 }}>
                {(pins + (bonusPins || 0)).toLocaleString()} Pins
              </div>
              <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>
                {pins} daily + {(bonusPins || 0)} vault
              </div>
            </div>
          </div>

          {/* Active Daily Quota (Airtel/Jio model) */}
          <div id="active-daily-pins-badge" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 14,
            background: pins < 20 ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
            border: `1.5px solid ${pins < 20 ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.25)'}`,
          }}>
            <PinCoin size={26} glow animate />
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--t3)' }}>
                Active Daily Quota
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: balColor, lineHeight: 1.1 }}>
                {pins.toLocaleString()} Pins
              </div>
              <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>
                1:00 AM Reset in {nextRefreshCountdown()}
              </div>
            </div>
          </div>

          {/* Bonus Pins Vault (Never wiped) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.08) 100%)',
            border: '1.5px solid rgba(16,185,129,0.3)',
          }}>
            <span style={{ fontSize: 22 }}>🎁</span>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981' }}>
                Permanent Vault
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: '#10b981', lineHeight: 1.1 }}>
                {(bonusPins || 0).toLocaleString()} Pins
              </div>
              <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>
                Never expires
              </div>
            </div>

            <button
              onClick={() => claimBonusPins()}
              disabled={!bonusPins || bonusPins <= 0}
              style={{
                marginLeft: 4,
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: bonusPins > 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.08)',
                color: bonusPins > 0 ? '#fff' : 'var(--t3)',
                fontWeight: 800,
                fontSize: 12,
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
      <div style={{ display: 'flex', gap: 6, background: 'var(--bg2)', borderRadius: 14, padding: 5, border: '1px solid var(--border)', width: 'fit-content', flexWrap: 'wrap' }}>
        {([
          ['buy', '💳 Chota Recharges & Plans'],
          ['calculator', '🧮 Pins → AI Calculator'],
          ['wallet', '📊 My Wallet & History'],
        ] as [PageTab, string][]).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px', borderRadius: 10,
              border: 'none', cursor: 'pointer',
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--t3)',
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: 13.5, transition: 'all 0.15s', outline: 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: CHOTA RECHARGES & PLANS (UPI Friendly for Tier 3)
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'buy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Section: Sachet Micro-Packs ─────────────────────────── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><PinCoin size={18} glow /> Student Chota Recharges (UPI Sachet Packs)</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 2 }}>
                  Pay via Google Pay, PhonePe, Paytm, or BHIM. Purchased pins deposit into your permanent vault and <strong>never expire</strong>.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'var(--t3)' }}>GPay</span>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'var(--t3)' }}>PhonePe</span>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'var(--t3)' }}>Paytm</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))', gap: 14 }}>
              {PIN_PACKS.map(pack => (
                <div
                  key={pack.id}
                  style={{
                    background: pack.popular ? 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)' : 'var(--bg2)',
                    border: `1.5px solid ${pack.popular ? pack.color : 'var(--border)'}`,
                    borderRadius: 18, padding: '20px 18px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {pack.badge && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: pack.color, color: '#fff',
                      fontSize: 10, fontWeight: 800, padding: '3px 9px',
                      borderRadius: 20, letterSpacing: '0.04em',
                    }}>
                      {pack.badge}
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: pack.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      {pack.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 900, color: 'var(--t1)', lineHeight: 1, marginBottom: 4 }}>
                      ₹{pack.priceRs}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>
                        {pack.pins.toLocaleString()} Pins
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--t4)' }}>({pack.perPin})</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', background: 'rgba(255,255,255,0.04)', padding: '8px 10px', borderRadius: 8, marginBottom: 16, lineHeight: 1.4 }}>
                      ⚡ <strong>AI Power:</strong> {pack.benefit}
                    </div>
                  </div>

                  <button
                    disabled={loading === pack.id}
                    onClick={() => checkout(pack.id)}
                    style={{
                      width: '100%', padding: '10px 0', borderRadius: 12, border: 'none',
                      background: `linear-gradient(135deg, ${pack.color}, ${pack.color}dd)`,
                      color: '#fff', fontWeight: 800, fontSize: 14,
                      cursor: loading === pack.id ? 'not-allowed' : 'pointer',
                      opacity: loading === pack.id ? 0.7 : 1,
                      boxShadow: pack.popular ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
                      transition: 'transform 0.15s',
                    }}
                    onMouseEnter={e => { if (loading !== pack.id) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                  >
                    {loading === pack.id ? 'Opening UPI...' : `Recharge for ₹${pack.priceRs} →`}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section: Custom Pins Sachet ─────────────────────────── */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: '20px 22px' }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>🎛️ Exact Custom Pin Recharge</div>
            <div style={{ fontSize: 12.5, color: 'var(--t4)', marginBottom: 16 }}>
              Need an exact amount for an interview tomorrow? Slide to choose between 100 to 10,000 pins at official statutory rate (₹1 = 10 Pins).
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input
                  type="range" min={100} max={5000} step={50}
                  value={customPins}
                  onChange={e => setCustomPins(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t4)', marginTop: 4 }}>
                  <span>100 pins (₹10)</span><span>5,000 pins (₹500)</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '10px 18px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, minWidth: 120 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>
                  {customPins.toLocaleString()} <span style={{ fontSize: 14 }}>Pins</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 3 }}>for ₹{customPrice}</div>
              </div>

              <button
                disabled={loading === 'pack_custom'}
                onClick={() => checkout('pack_custom', { customPins })}
                style={{
                  padding: '11px 22px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                  color: '#fff', fontWeight: 800, fontSize: 13.5,
                  cursor: loading === 'pack_custom' ? 'not-allowed' : 'pointer',
                  opacity: loading === 'pack_custom' ? 0.7 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {loading === 'pack_custom' ? 'Opening...' : `Recharge ${customPins.toLocaleString()} Pins — ₹${customPrice}`}
              </button>
            </div>
          </div>

          {/* ── Section: Subscriptions (₹99 Basic Student Pass & ₹499 Pro) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
            {/* Plan 1: Basic Student Pass (₹99 / mo) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,150,105,0.05) 100%)',
              border: '2px solid rgba(16,185,129,0.35)',
              borderRadius: 20, padding: '24px 24px',
              position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{ position: 'absolute', top: 14, right: 18, background: '#10b981', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>
                {user?.subscription_tier === 'basic' ? 'CURRENT PLAN (ACTIVE)' : 'BESTSELLER (TIER-3 CHOICE)'}
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                  Basic Student Daily Pass
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 900, color: 'var(--t1)', lineHeight: 1, marginBottom: 4 }}>
                  ₹99 <span style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 500 }}>/ month (₹3.30/day)</span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--t3)', marginBottom: 18, lineHeight: 1.5 }}>
                  The <strong>Airtel Daily Data</strong> model for engineering studies: <strong>120 Pins renewed every morning at 1:00 AM IST</strong>.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {[
                    '✓ 120 Daily Pins refreshed every 1:00 AM IST (3,600 pins/mo)',
                    '✓ Daily Quests & Coding Labs (20 pins / session)',
                    '✓ AI Avatar Mock Interviews & Scoring (25 pins)',
                    '✓ AI Code Tutor Line-by-Line Debugging (5 pins)',
                    '✓ Permanent Vault for extra top-ups (never expires)',
                  ].map(feat => (
                    <div key={feat} style={{ fontSize: 13.5, color: 'var(--t2)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              {user?.subscription_tier === 'basic' && user?.subscription_status === 'active' ? (
                <button
                  disabled
                  style={{
                    padding: '12px 20px', borderRadius: 12,
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#10b981', fontWeight: 700, fontSize: 14,
                    cursor: 'default',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  <span>✓</span> Basic Student Pass Active
                </button>
              ) : (
                <button
                  disabled={loading === 'basic_student'}
                  onClick={() => checkout('basic_student')}
                  style={{
                    padding: '12px 20px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff', fontWeight: 800, fontSize: 14.5,
                    cursor: loading === 'basic_student' ? 'not-allowed' : 'pointer',
                    opacity: loading === 'basic_student' ? 0.7 : 1,
                    boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {loading === 'basic_student' ? 'Initiating Checkout...' : 'Activate Basic Pass — ₹99/month →'}
                </button>
              )}
            </div>

            {/* Plan 2: Pro Career Accelerator (₹499 / mo) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 100%)',
              border: '2px solid rgba(99,102,241,0.3)',
              borderRadius: 20, padding: '24px 24px',
              position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{ position: 'absolute', top: 14, right: 18, background: (user?.subscription_tier === 'pro' && user?.subscription_status === 'active') ? '#10b981' : 'var(--accent)', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>
                {(user?.subscription_tier === 'pro' && user?.subscription_status === 'active') ? 'CURRENT PLAN (ACTIVE)' : 'PLACEMENT DRIVE ACCELERATOR'}
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                  Pro Placement Accelerator
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 900, color: 'var(--t1)', lineHeight: 1, marginBottom: 4 }}>
                  ₹499 <span style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 500 }}>/ month</span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--t3)', marginBottom: 18, lineHeight: 1.5 }}>
                  Targeting Product Startups & Differential Offers (₹8–20 LPA). Includes 120 Daily Pins + <strong>500 Bonus Pins</strong> in permanent vault.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {[
                    '✓ Everything in Basic Student Pass',
                    '✓ 500 Permanent Vault Bonus Pins every month',
                    '✓ 24/7 Voice AI Avatar Mock Interviews & Instant Rubric',
                    '✓ Recruiter Priority Talent Showcase in Partner Companies',
                    '✓ In-depth AST Code Security & Architecture Reviews',
                  ].map(feat => (
                    <div key={feat} style={{ fontSize: 13.5, color: 'var(--t2)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              {user?.subscription_tier === 'pro' && user?.subscription_status === 'active' ? (
                <button
                  disabled
                  style={{
                    padding: '12px 20px', borderRadius: 12,
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#10b981', fontWeight: 700, fontSize: 14,
                    cursor: 'default',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  <span>✓</span> Pro Accelerator Active
                </button>
              ) : (
                <button
                  disabled={loading === 'pro'}
                  onClick={() => checkout('pro')}
                  style={{
                    padding: '12px 20px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', fontWeight: 800, fontSize: 14.5,
                    cursor: loading === 'pro' ? 'not-allowed' : 'pointer',
                    opacity: loading === 'pro' ? 0.7 : 1,
                    boxShadow: '0 4px 18px rgba(99,102,241,0.4)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {loading === 'pro' ? 'Initiating Checkout...' : 'Upgrade to Pro — ₹499/month →'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: PINS TO AI VALUE CALCULATOR (Demystify AI for Students)
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'calculator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>
                  🧮 Interactive Pins to AI Value Calculator
                </h2>
                <p style={{ fontSize: 13, color: 'var(--t3)', margin: '4px 0 0' }}>
                  No complex token math. Slide to see exactly what any pin amount unlocks in real AI placement features.
                </p>
              </div>
              <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, padding: '8px 16px', textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700 }}>Calculating For</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 900, color: 'var(--accent)' }}>
                  {calcPins.toLocaleString()} Pins (₹{Math.ceil(calcPins / 10)})
                </div>
              </div>
            </div>

            {/* Slider */}
            <div style={{ marginBottom: 24 }}>
              <input
                type="range" min={25} max={1500} step={25}
                value={calcPins}
                onChange={e => setCalcPins(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', height: 8 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--t4)', marginTop: 6 }}>
                <span>25 Pins (₹2.50)</span>
                <span>350 Pins (₹29 Sprint)</span>
                <span>750 Pins (₹59 Power)</span>
                <span>1,500 Pins (₹150)</span>
              </div>
            </div>

            {/* Output Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
              <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🎙️</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>AI Mock Interviews</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: 'var(--t1)', margin: '4px 0' }}>
                  {Math.floor(calcPins / 25)} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t3)' }}>Rounds</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>25 pins each (voice, transcript & rubric)</div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🤖</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>AI Code Mentor Solves</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: '#10b981', margin: '4px 0' }}>
                  {Math.floor(calcPins / 5)} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t3)' }}>Doubts</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>5 pins each (step-by-step logic debug)</div>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>📄</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>ATS Resume Scans</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: '#f59e0b', margin: '4px 0' }}>
                  {Math.floor(calcPins / 15)} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t3)' }}>Audits</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>15 pins each (keyword match + bullet rewrites)</div>
              </div>

              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🗺️</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Guided Coding Quests</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: 'var(--purple)', margin: '4px 0' }}>
                  {Math.floor(calcPins / 20)} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t3)' }}>Labs</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>20 pins each (full 30m guided sandbox access)</div>
              </div>
            </div>

            {/* Offline Coaching Center vs PinIT Price Comparison */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>💡 Indian Tier-3 College Cost Benchmark</div>
                <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
                  Private coaching centers charge <strong>₹500 to ₹1,500</strong> for a single mock interview. On PinIT Career OS, 1 full mock costs <strong>₹2.50 (25 Pins)</strong>.
                </div>
              </div>
              <button
                onClick={() => setActiveTab('buy')}
                style={{
                  padding: '9px 18px', borderRadius: 10, border: 'none',
                  background: 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                }}
              >
                Get Chota Recharge (₹9) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: MY WALLET & TRANSACTION HISTORY
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'wallet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Stats Row ─────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Total Acquired</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: '#10b981' }}>+{totalEarned.toLocaleString()} pins</div>
              <div style={{ fontSize: 11, color: 'var(--t4)' }}>{pinHistory.filter(t => t.type === 'earn').length} purchase & bonus credits</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Total Spent</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: '#ef4444' }}>-{totalSpent.toLocaleString()} pins</div>
              <div style={{ fontSize: 11, color: 'var(--t4)' }}>{pinHistory.filter(t => t.type === 'spend').length} feature unlocks</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: `1px solid ${effColor}30`, borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>AI Study Efficiency</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 900, color: effColor }}>{efficiency}%</div>
              <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 10, overflow: 'hidden', marginTop: 6 }}>
                <div style={{ height: '100%', width: `${efficiency}%`, background: effColor, borderRadius: 10 }} />
              </div>
            </div>
          </div>

          {/* ── Category Breakdown ─────────────────────────────────── */}
          {breakdown.length > 0 && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 14 }}>📊 Where Your Pins Went</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {breakdown.map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18 }}>{b.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: 'var(--t1)', fontWeight: 600 }}>{b.label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>{b.total} pins</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.round((b.total / (totalSpent || 1)) * 100)}%`, background: 'var(--accent)', borderRadius: 10 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Transaction History Table ───────────────────────────── */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>📜 Transaction History</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['all', 'earned', 'spent'] as FilterTab[]).map(f => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setPage(0); }}
                    style={{
                      padding: '4px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: filter === f ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                      color: filter === f ? '#fff' : 'var(--t3)',
                      fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {paginated.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--t3)', fontSize: 13.5 }}>
                No {filter === 'all' ? '' : filter} transactions recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {paginated.map(tx => (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{getSourceIcon(tx.source as string, tx.type)}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                          {tx.reason || (tx.type === 'earn' ? 'Credited / Bonus Pins' : 'Feature Unlock')}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t4)' }}>
                          {formatDate(tx.timestamp)} · {timeAgo(tx.timestamp)}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 14.5, fontWeight: 800,
                      color: tx.type === 'earn' ? '#10b981' : '#ef4444',
                    }}>
                      {tx.type === 'earn' ? `+${tx.amount}` : `-${tx.amount}`}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'transparent', color: page === 0 ? 'var(--t4)' : 'var(--t1)',
                    cursor: page === 0 ? 'not-allowed' : 'pointer', fontSize: 12,
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: 12, color: 'var(--t3)', alignSelf: 'center' }}>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'transparent', color: page >= totalPages - 1 ? 'var(--t4)' : 'var(--t1)',
                    cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', fontSize: 12,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
