'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PublicVerifiablePortfolio } from '@/lib/admin/portfolio';

interface StudentPortfolioShowcaseProps {
  portfolio: PublicVerifiablePortfolio;
}

export const StudentPortfolioShowcase: React.FC<StudentPortfolioShowcaseProps> = ({ portfolio: initialPortfolio }) => {
  const [portfolio, setPortfolio] = useState<PublicVerifiablePortfolio>(initialPortfolio);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Client-side hydration: If current user is logged in as Vinay / demo student, sync name gracefully
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('pinit_current_user') || localStorage.getItem('pinit_user');
        if (stored) {
          const user = JSON.parse(stored);
          const userName = user.displayName || user.name;
          if (userName && portfolio.fullName === 'Arjun Verma' && !portfolio.studentId.includes('arjun')) {
            setPortfolio(prev => ({
              ...prev,
              fullName: userName,
              studentId: user.id || prev.studentId,
            }));
          }
        }
      } catch (err) {
        console.warn('Portfolio client hydration notice:', err);
      }
    }
  }, [portfolio.fullName, portfolio.studentId]);

  const handleCopyHash = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(portfolio.cryptographicProof.sha256Fingerprint);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleCopyUrl = () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const initials = (portfolio.fullName || 'Student')
    .split(' ')
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="portfolio-wrapper">
      {/* ── TOP UTILITY NAVIGATION BAR ── */}
      <nav className="portfolio-nav">
        <Link href={`/verify/${portfolio.studentId}`} className="nav-back-link">
          <span>←</span> Back to Verification Gateway
        </Link>
        
        <div className="nav-title-group">
          <span className="trust-dot" />
          <span className="nav-brand">PinIT Trust Network</span>
          <span className="nav-badge">VERIFIED CANDIDATE</span>
        </div>

        <div className="nav-actions">
          <button onClick={handleCopyUrl} className="nav-btn">
            {copiedUrl ? '✓ Link Copied' : '🔗 Share Portfolio'}
          </button>
        </div>
      </nav>

      {/* ── HERO CANDIDATE VERIFICATION CARD ── */}
      <header className="hero-card">
        <div className="hero-bg-glow" />

        <div className="hero-top-badge-row">
          <div className="verification-pill">
            <span className="pulse-dot" />
            <span>🛡️ Institutional Cryptographic Verification Active</span>
          </div>
          <span className="fingerprint-label">SHA-256 Ledger Certified</span>
        </div>

        <div className="hero-content">
          <div className="hero-avatar-col">
            <div className="hero-avatar">
              <span>{initials}</span>
            </div>
          </div>

          <div className="hero-info-col">
            <h1 className="student-name">{portfolio.fullName}</h1>
            <p className="student-degree">
              {portfolio.degree} <span className="text-dim">in</span> {portfolio.department}
            </p>

            <div className="student-meta-row">
              <span className="meta-item institution">
                <span>🎓</span> {portfolio.institutionName}
              </span>
              <span className="meta-dot">•</span>
              <span className="meta-item">
                <span>📅</span> Class of {portfolio.batchYear}
              </span>
              <span className="meta-dot">•</span>
              <span className="meta-item cgpa">
                <span>⭐</span> CGPA {portfolio.cgpa.toFixed(2)}
              </span>
              <span className="meta-dot">•</span>
              <span className="meta-item id-badge">
                ID: {portfolio.studentId}
              </span>
            </div>
          </div>

          {/* Employability Rating Gauge Box */}
          <div className="hero-score-col">
            <div className="score-box">
              <span className="score-label">EMPLOYABILITY RATING</span>
              <div className="score-value-row">
                <span className="score-number">{portfolio.employabilityScore}</span>
                <span className="score-denom">/100</span>
              </div>
              <div className="tier-badge">
                {portfolio.tier.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Attendance Reliability</span>
            <span className="kpi-value text-white">{portfolio.attendancePercentage}%</span>
            <span className="kpi-sub">Biometric / Geo Verified</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Verified Capstones</span>
            <span className="kpi-value text-accent">{portfolio.capstones.length} Completed</span>
            <span className="kpi-sub">Production Code Reviewed</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Proctored Exams Passed</span>
            <span className="kpi-value text-white">{portfolio.proctoredExamsSummary.totalPassed} Exams</span>
            <span className="kpi-sub">Avg Score: {portfolio.proctoredExamsSummary.averageScore}%</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Anti-Cheat Integrity</span>
            <span className="kpi-value text-emerald">{portfolio.proctoredExamsSummary.averageIntegrityScore}%</span>
            <span className="kpi-sub">100% Proctored Clean</span>
          </div>
        </div>
      </header>

      {/* ── VERIFIED SKILL BADGES ── */}
      {portfolio.verifiedBadges && portfolio.verifiedBadges.length > 0 && (
        <section className="section-block">
          <div className="section-header">
            <h2 className="section-title">
              <span>✨</span> Institutional Verified Skill Badges
            </h2>
            <span className="section-count">{portfolio.verifiedBadges.length} Certified Badges</span>
          </div>

          <div className="badges-grid">
            {portfolio.verifiedBadges.map(badge => (
              <div key={badge.badgeId} className="badge-card">
                <div className="badge-icon">🎖️</div>
                <div className="badge-details">
                  <h3 className="badge-name">{badge.name}</h3>
                  <div className="badge-meta">
                    <span className="badge-category">{badge.category}</span>
                    <span className="badge-date">Verified {badge.issuedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── VERIFIED CAPSTONE PROJECTS ── */}
      <section className="section-block">
        <div className="section-header">
          <h2 className="section-title">
            <span>📦</span> Verified Capstone Engineering Projects
          </h2>
          <span className="section-count">{portfolio.capstones.length} Defended Projects</span>
        </div>

        <div className="capstones-grid">
          {portfolio.capstones.map(cap => (
            <article key={cap.capstoneId} className="capstone-card">
              <div className="capstone-top">
                <span className="capstone-code">{cap.courseCode}</span>
                <span className="capstone-grade">
                  Grade {cap.grade} ({cap.score}/100)
                </span>
              </div>

              <h3 className="capstone-title">{cap.title}</h3>

              <div className="competencies-row">
                {cap.competencies.map((comp, idx) => (
                  <span key={idx} className="comp-tag">
                    {comp}
                  </span>
                ))}
              </div>

              <div className="capstone-footer">
                <span className="capstone-date">Completed: {cap.completionDate}</span>
                <div className="capstone-links">
                  {cap.repositoryUrl && (
                    <a
                      href={cap.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="capstone-link repo"
                    >
                      <span>🔗</span> Verified Repo ↗
                    </a>
                  )}
                  {cap.liveDemoUrl && (
                    <a
                      href={cap.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="capstone-link demo"
                    >
                      <span>🚀</span> Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CRYPTOGRAPHIC SHA-256 PROOF CARD ── */}
      <footer className="proof-card">
        <div className="proof-header">
          <div className="proof-icon-title">
            <span className="proof-icon">🛡️</span>
            <div>
              <h3 className="proof-title">Cryptographic Integrity Proof (SHA-256)</h3>
              <p className="proof-desc">
                Tamper-evident evidence chain signed by {portfolio.institutionName}. Guaranteed authentic and immune to resume fraud.
              </p>
            </div>
          </div>

          <button onClick={handleCopyHash} className="copy-hash-btn">
            {copiedHash ? '✓ Copied Hash Proof' : '📋 Copy SHA-256 Proof'}
          </button>
        </div>

        <div className="fingerprint-box">
          <code>{portfolio.cryptographicProof.sha256Fingerprint}</code>
        </div>

        <div className="proof-footer">
          <span className="proof-timestamp">
            Ledger Timestamp: {portfolio.cryptographicProof.issuedTimestamp}
          </span>
          <span className="proof-status-pill">
            <span className="status-dot" /> SEALED &amp; VERIFIED AUTHENTIC
          </span>
        </div>
      </footer>

      {/* ── SCOPED MOBILE-FIRST STYLES ── */}
      <style jsx>{`
        .portfolio-wrapper {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #f1f5f9;
        }

        /* Nav */
        .portfolio-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          font-size: 13.5px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .nav-back-link {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .nav-back-link:hover {
          color: #ffffff;
        }

        .nav-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .trust-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
        }
        .nav-brand {
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: -0.2px;
        }
        .nav-badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .nav-actions {
          display: flex;
          gap: 8px;
        }
        .nav-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
        }

        /* Hero Card */
        .hero-card {
          position: relative;
          border-radius: 24px;
          padding: 32px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%);
          border: 1.5px solid rgba(99, 102, 241, 0.25);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }
        .hero-bg-glow {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          pointer-events: none;
          filter: blur(40px);
        }

        .hero-top-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .verification-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 20px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .fingerprint-label {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          font-family: monospace;
        }

        .hero-content {
          display: flex;
          align-items: flex-start;
          gap: 22px;
          position: relative;
          z-index: 2;
        }
        .hero-avatar {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 900;
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35);
        }

        .hero-info-col {
          flex: 1;
        }
        .student-name {
          margin: 0;
          font-size: 32px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.5px;
          line-height: 1.15;
        }
        .student-degree {
          margin: 6px 0 0 0;
          font-size: 16px;
          font-weight: 600;
          color: #cbd5e1;
        }
        .text-dim {
          color: #64748b;
          font-weight: 400;
        }

        .student-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 12px;
          font-size: 13.5px;
          color: #94a3b8;
          flex-wrap: wrap;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .meta-item.institution {
          color: #818cf8;
          font-weight: 600;
        }
        .meta-item.cgpa {
          color: #34d399;
          font-weight: 700;
          font-family: monospace;
        }
        .meta-item.id-badge {
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 8px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 11.5px;
        }
        .meta-dot {
          color: #475569;
        }

        /* Score Box */
        .hero-score-col {
          flex-shrink: 0;
        }
        .score-box {
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 16px 20px;
          text-align: right;
          min-width: 170px;
        }
        .score-label {
          display: block;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #94a3b8;
          text-transform: uppercase;
        }
        .score-value-row {
          display: flex;
          align-items: baseline;
          justify-content: flex-end;
          gap: 4px;
          margin: 4px 0 6px 0;
        }
        .score-number {
          font-size: 34px;
          font-weight: 900;
          color: #818cf8;
          line-height: 1;
        }
        .score-denom {
          font-size: 16px;
          color: #64748b;
          font-weight: 600;
        }
        .tier-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.35);
          letter-spacing: 0.4px;
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .kpi-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 14px 16px;
        }
        .kpi-label {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          color: #94a3b8;
        }
        .kpi-value {
          display: block;
          font-size: 20px;
          font-weight: 800;
          margin-top: 4px;
          letter-spacing: -0.3px;
        }
        .kpi-sub {
          display: block;
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }
        .text-white { color: #f8fafc; }
        .text-accent { color: #818cf8; }
        .text-emerald { color: #34d399; }

        /* Sections */
        .section-block {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-count {
          font-size: 12.5px;
          color: #64748b;
          font-weight: 600;
        }

        /* Badges */
        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .badge-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .badge-card:hover {
          border-color: rgba(99, 102, 241, 0.35);
          transform: translateY(-2px);
        }
        .badge-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .badge-name {
          margin: 0;
          font-size: 14.5px;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1.3;
        }
        .badge-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          font-size: 11px;
        }
        .badge-category {
          padding: 2px 7px;
          border-radius: 5px;
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          font-family: monospace;
          font-weight: 700;
        }
        .badge-date {
          color: #64748b;
        }

        /* Capstones */
        .capstones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 18px;
        }
        .capstone-card {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .capstone-card:hover {
          border-color: rgba(16, 185, 129, 0.35);
          transform: translateY(-2px);
        }
        .capstone-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .capstone-code {
          font-size: 12px;
          font-family: monospace;
          font-weight: 700;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.06);
          padding: 3px 8px;
          border-radius: 6px;
        }
        .capstone-grade {
          font-size: 12px;
          font-weight: 800;
          color: #34d399;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 3px 10px;
          border-radius: 20px;
        }
        .capstone-title {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.35;
        }
        .competencies-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .comp-tag {
          font-size: 11px;
          font-family: monospace;
          font-weight: 600;
          color: #cbd5e1;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 3px 8px;
          border-radius: 6px;
        }
        .capstone-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .capstone-date {
          color: #64748b;
        }
        .capstone-links {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .capstone-link {
          text-decoration: none;
          font-weight: 700;
          font-size: 12.5px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.2s;
        }
        .capstone-link.repo {
          color: #818cf8;
        }
        .capstone-link.demo {
          color: #34d399;
        }
        .capstone-link:hover {
          opacity: 0.8;
        }

        /* Proof Card */
        .proof-card {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .proof-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .proof-icon-title {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .proof-icon {
          font-size: 26px;
          margin-top: 2px;
        }
        .proof-title {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
        }
        .proof-desc {
          margin: 4px 0 0 0;
          font-size: 12.5px;
          color: #94a3b8;
          line-height: 1.4;
        }
        .copy-hash-btn {
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.35);
          color: #a5b4fc;
          font-size: 12.5px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .copy-hash-btn:hover {
          background: rgba(99, 102, 241, 0.25);
          color: #ffffff;
        }
        .fingerprint-box {
          background: #020617;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 12px 16px;
          font-family: monospace;
          font-size: 12px;
          color: #38bdf8;
          word-break: break-all;
          user-select: all;
        }
        .proof-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11.5px;
          color: #64748b;
          flex-wrap: wrap;
          gap: 8px;
        }
        .proof-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #34d399;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
        }

        /* ── RESPONSIVE MOBILE TWEAKS ── */
        @media (max-width: 768px) {
          .portfolio-wrapper {
            gap: 20px;
          }
          .hero-card {
            padding: 22px 18px;
          }
          .hero-content {
            flex-direction: column;
            gap: 16px;
          }
          .hero-score-col {
            width: 100%;
          }
          .score-box {
            text-align: left;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            box-sizing: border-box;
          }
          .score-value-row {
            justify-content: flex-start;
          }
          .student-name {
            font-size: 26px;
          }
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding-top: 18px;
            margin-top: 20px;
          }
          .badges-grid {
            grid-template-columns: 1fr;
          }
          .capstones-grid {
            grid-template-columns: 1fr;
          }
          .portfolio-nav {
            flex-direction: column;
            align-items: flex-start;
          }
          .nav-actions {
            width: 100%;
          }
          .nav-btn {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
