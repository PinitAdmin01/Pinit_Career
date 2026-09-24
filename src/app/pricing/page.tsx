'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import '@/styles/landing.css';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from '@/lib/store/useAppStore';
import { openRazorpayCheckout } from '@/lib/razorpay';

const ROADMAP_BADGE = (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      marginLeft: 8,
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 800,
      color: '#F59E0B',
      background: 'rgba(245, 158, 11, 0.12)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      lineHeight: 1,
    }}
    title="Planned for Q3 2026 — not yet available"
  >
    🛣️ Roadmap
  </span>
);

const Q3_PILOT_BADGE = (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      marginLeft: 8,
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 800,
      color: '#F59E0B',
      background: 'rgba(245, 158, 11, 0.12)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      lineHeight: 1,
    }}
    title="Q3 2026 Pilot Access — contact us to join"
  >
    🛣️ Q3 Pilot
  </span>
);

export default function PublicPricingPageRevamp() {
  const router = useRouter();
  const { user } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is PinIT Career OS truly free for students?',
      a: 'Yes! The foundational Career OS, all 36 foundation roadmaps, 1,080 handcrafted daily quests, peer Code Wars (async leaderboard), and daily missions are 100% free forever. Students earn Pins through active learning and completing daily challenges without ever having to enter a credit card.'
    },
    {
      q: 'What are Pins and how do I earn or buy them?',
      a: 'Pins are the gamified utility currency powering AI speech avatar coaching, deep mock interview grading, and crisis incident rollouts. Students earn Pins for free by maintaining daily streaks (+15) and passing quest exams (+25). Top-ups are available at ₹1 = 10 Pins, which are stored in your permanent vault and never expire.'
    },
    {
      q: 'How does the ₹99 Basic Student Plan work?',
      a: 'Like an Airtel daily data recharge, students on the ₹99/month Basic Student Plan receive 120 Pins every single day refreshed at 1:00 AM IST. Quests & Missions cost 20 pins, AI Mock Interviews & GDs cost 35 pins, and Code Arena duels & Project reviews cost 10 pins. Any purchased top-up pins are saved in your permanent vault and never wiped.'
    },
    {
      q: 'How does campus institutional licensing work?',
      a: 'For universities and colleges, our Institutional Campus Pass equips your entire placement cell with cohort employability heatmaps, skill gap diagnostics, and direct corporate recruitment pipelines. NAAC/NIRF automated exports are on our Q3 2026 roadmap — contact our Institutional Partnerships team for pilot access.'
    },
    {
      q: 'Can enterprise recruiters hire directly from PinIT?',
      a: 'Yes! Recruiters access pre-assessed talent portfolios verified by automated AST code audits and Elo rating in Code Wars. SHA-256 signed skill credentials and AI match precision metrics are on our Q3 2026 roadmap.'
    }
  ];

  const handleBasicCheckout = async () => {
    if (!user) {
      toast.info('Authentication Required', 'Please log in to unlock Basic Student Pass.');
      router.push('/login?redirect=/pricing');
      return;
    }

    setCheckoutLoading(true);
    try {
      const orderRes = await api.post<{
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        isMock?: boolean;
      }>('/api/payment/create-order', {
        planId: 'basic_student',
      });

      if (orderRes.isMock) {
        toast.info('Sandbox Checkout', 'Simulating developer mode order completion for ₹99...');
        try {
          const verifyRes = await api.post<{ ok: boolean; message?: string }>('/api/payment/verify', {
            razorpay_order_id: orderRes.orderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: 'sig_mock_dev',
            planId: 'basic_student',
          });
          if (verifyRes.ok) {
            toast.success('🎉 Student Daily Pass Activated!', verifyRes.message || '120 Daily Pins active!');
            router.push('/dashboard');
          }
        } catch (vErr: any) {
          toast.error('Simulation Failed', vErr.message || 'Could not verify sandbox order.');
        }
        return;
      }

      await openRazorpayCheckout({
        key: orderRes.keyId,
        amount: orderRes.amount || 9900,
        currency: orderRes.currency || 'INR',
        name: 'PinIT Career OS',
        description: 'Basic Student Pass (120 Daily Pins) — ₹99/mo',
        order_id: orderRes.orderId,
        prefill: {
          name: user.displayName || undefined,
          email: user.email || undefined,
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post<{ ok: boolean; message?: string }>('/api/payment/verify', {
              ...response,
              planId: 'basic_student',
            });
            if (verifyRes.ok) {
              toast.success('🎉 Student Daily Pass Activated!', '120 Daily Pins active (refreshed daily at 1:00 AM IST).');
              router.push('/dashboard');
            } else {
              toast.error('Verification Pending', 'Payment processed. Finalizing Student Pass activation.');
            }
          } catch (err: any) {
            toast.error('Verification Error', err.message || 'Could not verify transaction with server.');
          }
        },
        theme: {
          color: '#10b981',
        },
      });
    } catch (err: any) {
      console.error('Basic checkout error:', err);
      toast.error('Checkout Failed', err.message || 'Could not initiate ₹99 order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleProCheckout = async () => {
    if (!user) {
      toast.info('Authentication Required', 'Please log in to upgrade to Pro Career Accelerator.');
      router.push('/login?redirect=/pricing');
      return;
    }

    setCheckoutLoading(true);
    try {
      const orderRes = await api.post<{
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        isMock?: boolean;
      }>('/api/payment/create-order', {
        planId: 'pro',
      });

      if (orderRes.isMock) {
        toast.info('Sandbox Checkout', 'Simulating developer mode order completion for ₹499...');
        try {
          const verifyRes = await api.post<{ ok: boolean; message?: string }>('/api/payment/verify', {
            razorpay_order_id: orderRes.orderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: 'sig_mock_dev',
            planId: 'pro',
          });
          if (verifyRes.ok) {
            toast.success('🎉 Pro Pass Activated!', verifyRes.message || 'Welcome to Pro Career Accelerator!');
            router.push('/dashboard');
          }
        } catch (vErr: any) {
          toast.error('Simulation Failed', vErr.message || 'Could not verify sandbox order.');
        }
        return;
      }

      await openRazorpayCheckout({
        key: orderRes.keyId,
        amount: orderRes.amount || 49900,
        currency: orderRes.currency || 'INR',
        name: 'PinIT Career OS',
        description: 'PRO Career Accelerator — ₹499/mo',
        order_id: orderRes.orderId,
        prefill: {
          name: user.displayName || undefined,
          email: user.email || undefined,
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post<{ ok: boolean; message?: string }>('/api/payment/verify', {
              ...response,
              planId: 'pro',
            });
            if (verifyRes.ok) {
              toast.success('🎉 Pro Pass Activated!', verifyRes.message || 'Welcome to Pro Career Accelerator!');
              router.push('/dashboard');
            } else {
              toast.error('Verification Pending', 'Payment processed. Finalizing Pro Pass activation.');
            }
          } catch (err: any) {
            toast.error('Verification Error', err.message || 'Could not verify transaction with server.');
          }
        },
        theme: {
          color: '#6366f1',
        },
      });
    } catch (err: any) {
      console.error('Pro checkout error:', err);
      toast.error('Checkout Failed', err.message || 'Could not initiate ₹499 order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="landing-page" style={{ position: 'relative', overflowX: 'hidden' }}>
      <PublicNavbar />

      <main style={{ padding: '60px 0 100px', position: 'relative', zIndex: 1 }}>
        <div className="container">

          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 60px' }}>
            <div className="badge-pill">TRANSPARENT PLANS & PIN ECONOMY</div>
            <h1 className="hero-title">
              Predictable Pricing for <span className="text-gradient">Every Ambition.</span>
            </h1>
            <p className="hero-subtitle" style={{ margin: '16px auto 0' }}>
              Zero paywall on foundational learning. Earn pins by building real proof-of-work, or unlock institutional super-powers for your campus.
            </p>
          </div>

          {/* 3 Pricing Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginBottom: 70 }}>

            {/* Tier 1: Student Free */}
            <div className="glass-card" style={{ padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 24 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>STUDENT PASS</span>
                <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-primary)', margin: '10px 0 14px' }}>
                  ₹0 <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/ forever</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  Perfect for learners building technical foundations and earning verifiable credentials.
                </p>

                <div style={{ padding: '14px 18px', borderRadius: 14, background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>🎁 50 SIGNUP BONUS PINS</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Earn +15 Pins daily through streak consistency.</div>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {[
                    'All 36 Career Roadmaps (1,080 Quests)',
                    'Multiplayer Code Wars Arena (Elo Duels)',
                    'Cryptographic Proof-of-Work Vault',
                    'Empathetic 3-Step Socratic Recovery Tutors',
                    'Day 30 Capstone Project Verification'
                  ].map((feat) => {
                    const isRoadmap = ['Multiplayer Code Wars Arena (Elo Duels)', 'Cryptographic Proof-of-Work Vault'].includes(feat);
                    return (
                      <li key={feat} style={{ fontSize: 13.5, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
                        {feat}
                        {isRoadmap && ROADMAP_BADGE}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <Link href="/signup" className="pc-btn-outline" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>
                Start Free Forever
              </Link>
            </div>

            {/* Tier 2: Basic Student Pass (₹99 / mo) */}
            <div className="glass-card" style={{ padding: '36px 30px', border: '2px solid #10b981', boxShadow: '0 16px 40px rgba(16,185,129,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -14, right: 28, background: '#10b981', color: '#FFFFFF', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 999, letterSpacing: '0.05em' }}>
                BEST VALUE FOR STUDENTS
              </div>

              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>BASIC STUDENT PASS</span>
                <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-primary)', margin: '10px 0 14px' }}>
                  ₹99 <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/ month</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  Receive <strong>120 Pins every single day</strong> refreshed at 1:00 AM IST (like Airtel daily data). Ideal for active daily study.
                </p>

                <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', marginBottom: 4 }}>⚡ 120 PINS EVERY SINGLE DAY</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Refreshes at 1:00 AM IST. Top up extra pins at ₹1 = 10 pins.</div>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {[
                    '120 Daily Pins arriving every night at 1:00 AM IST',
                    'All 36 Career Roadmaps (20 pins / quest)',
                    'Daily Socratic Crisis Missions (20 pins / mission)',
                    'AI Avatar Mock Interviews & GDs (35 pins / session)',
                    'Multiplayer Code Arena Duels (10 pins / duel)',
                    'Project Milestones & Vault Verification (10 pins)',
                    'Permanent Vault for Addon Top-Ups (₹1 = 10 pins)'
                  ].map((feat) => (
                    <li key={feat} style={{ fontSize: 13.5, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={handleBasicCheckout}
                disabled={checkoutLoading}
                className="pc-btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                  opacity: checkoutLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 18px rgba(16,185,129,0.35)',
                }}
              >
                {checkoutLoading ? 'Initiating Checkout...' : 'Unlock Student Pass (₹99) →'}
              </button>
            </div>

            {/* Tier 3: Pro Career Pass */}
            <div className="glass-card" style={{ padding: '36px 30px', border: '2px solid var(--accent)', boxShadow: '0 16px 40px var(--accent-glow)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -14, right: 28, background: 'var(--accent)', color: '#FFFFFF', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 999, letterSpacing: '0.05em' }}>
                MOST POPULAR
              </div>

              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>PRO CAREER ACCELERATOR</span>
                <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-primary)', margin: '10px 0 14px' }}>
                  ₹499 <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/ month</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  For ambitious graduates preparing for Tier-1 interviews and global placements.
                </p>

                <div style={{ padding: '14px 18px', borderRadius: 14, background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>⚡ UNLIMITED AI AVATAR TIME</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>500 monthly bonus pins for heavy mock interviews.</div>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {[
                    'Everything in Free Student Pass',
                    '24/7 Voice AI Avatar Mock Interviews',
                    'BLUF & Executive Communication Diagnostics',
                    'Recruiter Priority Invariant Showcase',
                    'Live AST Code Performance Benchmarks'
                  ].map((feat) => {
                    const isRoadmap = ['24/7 Voice AI Avatar Mock Interviews'].includes(feat);
                    return (
                      <li key={feat} style={{ fontSize: 13.5, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
                        {feat}
                        {isRoadmap && ROADMAP_BADGE}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                type="button"
                onClick={handleProCheckout}
                disabled={checkoutLoading}
                className="pc-btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                  opacity: checkoutLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {checkoutLoading ? 'Initiating Checkout...' : 'Unlock Pro Pass (₹499) →'}
              </button>
            </div>

            {/* Tier 3: Institutional Campus Pass */}
            <div className="glass-card" style={{ padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 24 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>COLLEGE & INSTITUTION</span>
                <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-primary)', margin: '10px 0 14px' }}>
                  Custom <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/ campus</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  Full campus placement cell command center, cohort heatmaps, and batch analytics.
                </p>

                <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#F59E0B', marginBottom: 4 }}>
                    1-CLICK NAAC / NIRF EXPORTS {Q3_PILOT_BADGE}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Automated accreditation exports — Q3 2026 Pilot. Contact us for early access.</div>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {[
                    'Placement Director Real-Time Command Dashboard',
                    'Departmental Cohort Skill Gap Heatmaps',
                    'Automated Multi-Round Campus Drives',
                    'Verified AST Code Integrity Audits',
                    'Dedicated Institutional Support & Training'
                  ].map((feat) => {
                    const isRoadmap = ['Automated Multi-Round Campus Drives'].includes(feat);
                    return (
                      <li key={feat} style={{ fontSize: 13.5, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#F59E0B', fontWeight: 800 }}>✓</span>
                        {feat}
                        {isRoadmap && Q3_PILOT_BADGE}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <Link href="/campus-demo" className="pc-btn-outline" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>
                Schedule Campus Walkthrough
              </Link>
            </div>

          </div>

          {/* Pin Economy Explainer */}
          <div className="glass-card" style={{ padding: '48px 36px', marginBottom: 60 }}>
            <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 36px' }}>
              <div className="badge-pill">GAMIFIED MERITOCRACY</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)' }}>The Pin Merit Economy</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 8 }}>
                We believe financial constraints should never prevent hard-working students from accessing state-of-the-art AI education.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div style={{ padding: 20, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 6 }}>+15 Pins / Day</div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Daily Streak Maintenance</strong>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Log in and complete at least one daily Socratic coding quest block.</span>
              </div>

              <div style={{ padding: 20, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 6 }}>+25 Pins / Test</div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>100% Invariant Pass</strong>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Solve all multi-case assertions on the first attempt without guided hints.</span>
              </div>

              <div style={{ padding: 20, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 6 }}>+20 Pins / Repo</div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>GitHub Commit Verification</strong>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Push audited capstone commits to your verified public GitHub repo.</span>
              </div>

              <div style={{ padding: 20, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 6 }}>+30 Pins / Win</div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Code Wars Arena Victory</strong>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Defeat peers in async algorithmic speed & memory duels.</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div style={{ maxWidth: 840, margin: '0 auto' }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, textAlign: 'center', marginBottom: 32 }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{ padding: '20px 24px', cursor: 'pointer' }}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{faq.q}</span>
                      <span style={{ fontSize: 18, color: 'var(--accent)' }}>{isOpen ? '−' : '+'}</span>
                    </div>
                    {isOpen && (
                      <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginTop: 14, margin: '14px 0 0' }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}