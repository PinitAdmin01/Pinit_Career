'use client';

import React from 'react';

interface GrandFinaleCtaProps {
  onOpenLogin: (role?: 'student' | 'teacher' | 'admin' | 'recruiter') => void;
}

export default function GrandFinaleCta({ onOpenLogin }: GrandFinaleCtaProps) {
  return (
    <section className="lp-section" style={{ background: '#05070f', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="lp-container">
        
        <div className="grand-finale-box">
          
          <div className="lp-badge-tag cyan" style={{ margin: 0 }}>
            ⚡ CLAIM YOUR SOVEREIGN IDENTITY
          </div>

          <h2 className="lp-section-title" style={{ maxWidth: 700, margin: 0 }}>
            Stop Building Resumes.{' '}
            <span className="lp-gradient-text">Start Building Your Career Identity.</span>
          </h2>

          <p className="lp-section-subtitle" style={{ maxWidth: 580, margin: 0 }}>
            Join thousands of students and campuses using PinIT Career OS to master real skills, pass proctored milestones, and connect directly with top recruiters.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, paddingTop: 10 }}>
            <button
              type="button"
              onClick={() => onOpenLogin('student')}
              className="btn-primary-hero"
              style={{ fontSize: 16, padding: '16px 36px' }}
            >
              <span>Start Free Exploration</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenLogin('teacher')}
              className="btn-secondary-hero"
              style={{ fontSize: 15, padding: '16px 28px' }}
            >
              <span>Campus Institution Portal</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', width: '100%', fontSize: 12, color: '#64748b' }}>
            <span><strong style={{ color: '#10b981' }}>✓</strong> 100% Free Core Roadmaps</span>
            <span><strong style={{ color: '#00a3ff' }}>✓</strong> Zero Credit Card Required</span>
            <span><strong style={{ color: '#a855f7' }}>✓</strong> Instant In-Browser Access</span>
          </div>

        </div>

      </div>
    </section>
  );
}
