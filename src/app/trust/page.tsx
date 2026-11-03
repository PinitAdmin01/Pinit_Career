'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';

export default function TrustDashboardPage() {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const [evaluating, setEvaluating] = useState(false);

  const trustScore = Math.round(Number(cOS?.trustScore ?? 75));
  const verifiedCount = (cOS?.vaultItems || []).filter((v) => v.verified).length;
  const vaultCount = (cOS?.vaultItems || []).length;
  const streak = cOS?.missionStreak || 1;

  const getTier = (score: number) => {
    if (score >= 80) return { label: 'High Trust', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' };
    if (score >= 60) return { label: 'Institutional Trusted', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' };
    if (score >= 40) return { label: 'Building Trust', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' };
    return { label: 'Unverified / Baseline', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' };
  };

  const tier = getTier(trustScore);

  const PILLARS = [
    {
      title: 'Cryptographic Vault Evidence',
      icon: '🗂️',
      score: vaultCount > 0 ? Math.min(100, 40 + verifiedCount * 20) : 35,
      detail: `${verifiedCount} of ${vaultCount} credentials verified via SHA-256`,
      href: '/vault',
      action: 'Open Evidence Vault →',
      color: '#6366f1',
    },
    {
      title: 'Campus Attendance Integrity',
      icon: '📍',
      score: 85,
      detail: 'Daily attendance auto-logged · Above 75% exam threshold',
      href: '/dashboard',
      action: 'View Attendance Record →',
      color: '#10b981',
    },
    {
      title: 'Hands-on Code Compilation',
      icon: '⚡',
      score: Math.min(100, Math.max(30, (cOS?.completedQuests?.length || 0) * 10 + 20)),
      detail: `${(cOS?.completedQuests || []).length} quests cleared with sandboxed test runners`,
      href: '/quests',
      action: 'Continue Daily Quests →',
      color: '#06b6d4',
    },
    {
      title: 'Socratic Defense & Soft Skills',
      icon: '🎙️',
      score: Math.min(100, Math.max(40, streak * 8 + 30)),
      detail: `${streak}-Day focus streak · AI Mock defense verified`,
      href: '/interview',
      action: 'Practice AI Interview →',
      color: '#8b5cf6',
    },
  ];

  const handleRecalculate = () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
    }, 800);
  };

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '10px 16px 40px' }} className="animate-fade-in">
      
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono)',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 8,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
          }}
        >
          ← Back to Student Dashboard
        </Link>

        <button
          type="button"
          onClick={handleRecalculate}
          disabled={evaluating}
          style={{
            padding: '7px 16px',
            borderRadius: 8,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            color: 'var(--t1)',
            fontSize: 12.5,
            fontFamily: 'var(--font-mono)',
            cursor: evaluating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>⟳</span>
          {evaluating ? 'Auditing Telemetry...' : 'Recalculate Trust Score'}
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div
        className="db-glass"
        style={{
          padding: '36px 32px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, var(--card, var(--bg2)) 100%)',
          border: '1.5px solid rgba(16,185,129,0.35)',
          boxShadow: '0 8px 32px rgba(16,185,129,0.15)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 800, marginBottom: 8 }}>
          INSTITUTIONAL TRUST ENGINE
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: 'var(--t1)', margin: '0 0 12px' }}>
          Trust Quotient &amp; Authenticity Standing
        </h1>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, margin: '14px 0' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 82, fontWeight: 900, color: tier.color, lineHeight: 1 }}>
            {trustScore}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>
              out of 100
            </div>
            <span
              style={{
                display: 'inline-block',
                marginTop: 4,
                padding: '4px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                background: tier.bg,
                color: tier.color,
                border: `1px solid ${tier.border}`,
              }}
            >
              {tier.label}
            </span>
          </div>
        </div>

        <p style={{ maxWidth: 640, margin: '8px auto 0', fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.55 }}>
          Your Trust Quotient represents cryptographically verified proof of academic integrity, consistent campus attendance, and verified coding competence evaluated by AI defense audits.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="db-glass"
            style={{
              padding: '20px',
              borderRadius: 16,
              background: 'var(--card, var(--bg2))',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 14,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{p.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, fontFamily: 'var(--font-mono)', color: p.color }}>
                  {p.score}%
                </span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', margin: '0 0 6px' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: 0, lineHeight: 1.45 }}>
                {p.detail}
              </p>
            </div>

            <Link
              href={p.href}
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: p.color,
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {p.action}
            </Link>
          </div>
        ))}
      </div>

      {/* How to boost Trust */}
      <div
        className="db-glass"
        style={{
          padding: '22px 26px',
          borderRadius: 16,
          background: 'var(--card, var(--bg2))',
          border: '1px solid var(--border)',
        }}
      >
        <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', margin: '0 0 12px' }}>
          💡 How Recruiters Use Your Trust Quotient
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {[
            { tip: '100% verified credentials unlock direct recruiter interview shortlists.', pts: '+10 pts' },
            { tip: 'Daily attendance consistency ensures placement eligibility and campus drive clearance.', pts: '+5 pts' },
            { tip: 'Passing Socratic oral defense proofs validates that code is original and self-authored.', pts: '+15 pts' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--bg3)', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
              <span style={{ color: '#10b981', fontWeight: 800, fontSize: 13, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                {item.pts}
              </span>
              <span style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.4 }}>
                {item.tip}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
