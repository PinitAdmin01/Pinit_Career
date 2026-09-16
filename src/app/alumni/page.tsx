'use client';

import React from 'react';
import Link from 'next/link';

export default function StudentAlumniPortal() {
  return (
    <div style={{ maxWidth: 840, margin: '60px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{
        background: 'var(--bg2, #ffffff)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: 16,
        padding: 40,
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 9999,
          background: 'rgba(234, 179, 8, 0.15)',
          color: '#b45309',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          marginBottom: 16
        }}>
          Module Staged for Production Integration
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1, #0f172a)', margin: '0 0 12px' }}>
          Alumni Network &amp; Endowments
        </h1>

        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--t3, #64748b)', maxWidth: 580, margin: '0 auto 24px' }}>
          This module is temporarily hidden from active campus workflows. Production activation requires direct integration with verified institutional identity providers, transactional notification dispatch, and a PCI-compliant payment gateway (e.g. Razorpay / Stripe).
        </p>

        <div style={{
          background: 'var(--bg3, #f8fafc)',
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: 12,
          padding: 16,
          fontSize: 13,
          color: 'var(--t2, #334155)',
          textAlign: 'left',
          maxWidth: 540,
          margin: '0 auto 32px'
        }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--t1, #0f172a)' }}>Integrity Constraints:</div>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
            <li>Simulated donation captures without verified merchant accounts are disabled.</li>
            <li>Mentorship requests require authenticated mentor notification routing.</li>
            <li>Job referral requests require authenticated corporate identity verification.</li>
          </ul>
        </div>

        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 24px',
            background: 'var(--accent, #6366f1)',
            color: '#ffffff',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          ← Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
