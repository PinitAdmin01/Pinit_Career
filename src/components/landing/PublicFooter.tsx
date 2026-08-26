'use client';

import React from 'react';
import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="footer-section" style={{ background: '#05070c', borderTop: '1px solid var(--border-color)', padding: '64px 0 40px', color: 'var(--text-secondary)', fontSize: 13 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, marginBottom: 48 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link href="/" className="lp-brand" aria-label="PINIT CAREER home">
              <span className="lp-brand-lockup">
                <img
                  src="/brand/pinit-career-logo-clear.png"
                  alt="PINIT CAREER"
                  className="lp-brand-logo"
                />
              </span>
            </Link>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6, margin: 0 }}>
              The AI-powered Career Operating System connecting students, placement directors, and enterprise recruiters with verifiable proof of competence.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link href="/problem" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Why We Exist</Link></li>
              <li><Link href="/identity" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Career Identity & DNA</Link></li>
              <li><Link href="/how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>The S-Curve Method</Link></li>
              <li><Link href="/modules" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>54 Ecosystem Modules</Link></li>
              <li><Link href="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Plans & Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Ecosystem
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link href="/quests" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>36 Career Tracks</Link></li>
              <li><Link href="/arena?tab=code_wars" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>1v1 Code Wars Arena</Link></li>
              <li><Link href="/interview" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Voice Avatar Studio</Link></li>
              <li><Link href="/university" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>For Colleges & Deans</Link></li>
              <li><Link href="/recruiter" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>For Enterprise Recruiters</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Legal & Trust
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</Link></li>
              <li><Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact & Support</Link></li>
              <li><span style={{ color: '#10b981', fontSize: 11, fontFamily: 'monospace' }}>● System Status: 100% Operational</span></li>
            </ul>
          </div>

        </div>

        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>
          <span>© {new Date().getFullYear()} PinIT Career OS. All rights reserved.</span>
          <span style={{ fontFamily: 'monospace' }}>Discover · Connect · Grow</span>
        </div>
      </div>
    </footer>
  );
}
