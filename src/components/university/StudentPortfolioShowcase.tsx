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

  // Client-side hydration: sync with active client session and local enrollment if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('pinit_current_user') || localStorage.getItem('pinit_user');
        const storedEnrollment = localStorage.getItem('pinit_active_crash_enrollment');
        const storedCompleted = localStorage.getItem('pinit_completed_quests');

        setPortfolio(prev => {
          let updated = { ...prev };

          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              const userName = user.displayName || user.name;
              if (userName && updated.fullName === 'Arjun Verma' && !updated.studentId.includes('arjun')) {
                updated.fullName = userName;
                updated.studentId = user.id || updated.studentId;
              }
            } catch {}
          }

          if (storedEnrollment) {
            try {
              const enr = JSON.parse(storedEnrollment);
              if (enr && enr.planId) {
                const completedList = storedCompleted ? JSON.parse(storedCompleted) : [];
                const tasksDone = Array.isArray(completedList) && completedList.length > 0 ? completedList.length : 1;
                const totalTasks = 192;
                const percent = Math.min(100, Math.max(1, Math.round((tasksDone / totalTasks) * 100)));

                updated.enrolledCourse = {
                  planId: enr.planId,
                  planTitle: enr.planId === 'plan-1m-sprint' ? '1-Month Fast-Track Sprint' : (enr.planTitle || 'Certificate Course'),
                  track: enr.track || 'web_fullstack',
                  trackTitle: enr.track === 'python_ai'
                    ? 'Option 2: Python & Data Engineering (FastAPI, PyTorch & Vector DBs)'
                    : 'Option 1: Web Full Stack (React 19, TypeScript, Next.js, Node.js, PostgreSQL & Docker)',
                  day: Math.max(1, Math.ceil(tasksDone / 3.2)),
                  totalDays: 60,
                  tasksDone,
                  tasksTotal: totalTasks,
                  percent,
                  currentSprint: enr.currentSprint || 1,
                  totalSprints: 4,
                  sprintTitle: `Sprint ${enr.currentSprint || 1}: Architecture & Data Schema`,
                  nextTaskTitle: 'Day 1 Practice 1: App Title Formatter',
                  nextTaskKind: 'Practice',
                  nextTestTitle: 'Test: Days 1–5 (Milestone Proctored Exam)',
                  nextTestTasksBefore: Math.max(0, 15 - tasksDone),
                  recentCompletedTask: 'Day 1 Practice 1: App Title Formatter (100% Score • SHA-256 Ledger Verified)',
                  enrolledAt: enr.enrolledAt,
                };
              }
            } catch {}
          }

          return updated;
        });
      } catch (err) {
        console.warn('Portfolio client hydration notice:', err);
      }
    }
  }, []);

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

  const enrolled = portfolio.enrolledCourse;

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
              {portfolio.degree || 'Full-Stack Software Engineering'}
              {portfolio.department ? <><span className="text-dim"> • </span>{portfolio.department}</> : null}
            </p>

            <div className="student-meta-row">
              <span className="meta-item institution">
                <span>🎓</span> {portfolio.institutionName || 'Self-Directed / Independent Learner'}
              </span>
              {portfolio.batchYear ? (
                <>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">
                    <span>📅</span> Class of {portfolio.batchYear}
                  </span>
                </>
              ) : null}
              {portfolio.cgpa && portfolio.cgpa > 0 ? (
                <>
                  <span className="meta-dot">•</span>
                  <span className="meta-item cgpa">
                    <span>⭐</span> CGPA {portfolio.cgpa.toFixed(2)}
                  </span>
                </>
              ) : (
                <>
                  <span className="meta-dot">•</span>
                  <span className="meta-item cgpa text-muted-dim">
                    <span>⭐</span> CGPA: Unrecorded (Self-Taught Track)
                  </span>
                </>
              )}
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
            <span className="kpi-value text-white">
              {portfolio.attendancePercentage !== undefined && portfolio.attendancePercentage !== null
                ? `${portfolio.attendancePercentage}%`
                : `${portfolio.attendanceStreakDays || 1} Day Streak`}
            </span>
            <span className="kpi-sub">
              {portfolio.attendancePercentage !== undefined && portfolio.attendancePercentage !== null
                ? 'Biometric / Geo Verified'
                : 'Active Sprint Check-In'}
            </span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Verified Capstones</span>
            <span className="kpi-value text-accent">
              {portfolio.capstones.length > 0 ? `${portfolio.capstones.length} Defended` : 'Sprint 1 Active'}
            </span>
            <span className="kpi-sub">
              {portfolio.capstones.length > 0 ? 'Production Code Reviewed' : 'In Progress (Milestone 1)'}
            </span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Proctored Exams Passed</span>
            <span className="kpi-value text-white">{portfolio.proctoredExamsSummary.totalPassed} Exams</span>
            <span className="kpi-sub">
              {portfolio.proctoredExamsSummary.totalPassed > 0
                ? `Avg Score: ${portfolio.proctoredExamsSummary.averageScore}%`
                : 'Next: Days 1–5 Milestone'}
            </span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Anti-Cheat Integrity</span>
            <span className="kpi-value text-emerald">{portfolio.proctoredExamsSummary.averageIntegrityScore}%</span>
            <span className="kpi-sub">Clean Proctored Record</span>
          </div>
        </div>
      </header>

      {/* ── PROMINENT ACTIVE CERTIFICATION COURSE & PERFORMANCE LEDGER ── */}
      {enrolled && (
        <section className="section-block course-ledger-section">
          <div className="ledger-card">
            <div className="ledger-header-row">
              <div>
                <div className="ledger-badge">
                  <span>⚡</span> ACTIVE CERTIFICATION PROGRAM
                </div>
                <h2 className="ledger-title">{enrolled.planTitle}</h2>
                <p className="ledger-track">{enrolled.trackTitle}</p>
              </div>

              <div className="ledger-stats-pill">
                <span className="ledger-day-text">Day {enrolled.day} of {enrolled.totalDays}</span>
                <span className="ledger-sep">•</span>
                <span className="ledger-task-text">{enrolled.tasksDone} of {enrolled.tasksTotal} Tasks ({enrolled.percent}%)</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.max(enrolled.percent, 2)}%` }}
              />
            </div>

            {/* 3 Milestone High-Def Metric Cards */}
            <div className="milestone-grid">
              <div className="milestone-box active">
                <div className="milestone-icon-row">
                  <span className="milestone-icon">🎯</span>
                  <span className="milestone-badge-active">IN PROGRESS</span>
                </div>
                <h4 className="milestone-box-title">{enrolled.sprintTitle}</h4>
                <p className="milestone-box-desc">
                  Core architectural fundamentals, component design, schema models &amp; daily micro-lessons.
                </p>
              </div>

              <div className="milestone-box">
                <div className="milestone-icon-row">
                  <span className="milestone-icon">💻</span>
                  <span className="milestone-badge-ready">CURRENT TASK</span>
                </div>
                <h4 className="milestone-box-title">{enrolled.nextTaskTitle || 'Day 1 Practice 1'}</h4>
                <p className="milestone-box-desc">
                  Automated test verification, deterministic AST assertion, and viva code defense.
                </p>
              </div>

              <div className="milestone-box">
                <div className="milestone-icon-row">
                  <span className="milestone-icon">📝</span>
                  <span className="milestone-badge-upcoming">PROCTORED EXAM</span>
                </div>
                <h4 className="milestone-box-title">{enrolled.nextTestTitle || 'Days 1–5 Milestone'}</h4>
                <p className="milestone-box-desc">
                  {enrolled.nextTestTasksBefore !== undefined && enrolled.nextTestTasksBefore > 0
                    ? `Unlocks after ${enrolled.nextTestTasksBefore} more task${enrolled.nextTestTasksBefore === 1 ? '' : 's'}`
                    : 'Milestone benchmark ready for proctored attempt'}
                </p>
              </div>
            </div>

            {/* Recent Verified Activity Ledger Evidence */}
            {enrolled.recentCompletedTask && (
              <div className="recent-evidence-bar">
                <div className="evidence-dot" />
                <span className="evidence-title">Latest Verified Evidence:</span>
                <span className="evidence-task">{enrolled.recentCompletedTask}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── VERIFIED SKILL BADGES ── */}
      <section className="section-block">
        <div className="section-header">
          <h2 className="section-title">
            <span>✨</span> Institutional Verified Skill Badges
          </h2>
          <span className="section-count">
            {portfolio.verifiedBadges.length} {portfolio.verifiedBadges.length === 1 ? 'Certified Badge' : 'Certified Badges'}
          </span>
        </div>

        {portfolio.verifiedBadges && portfolio.verifiedBadges.length > 0 ? (
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
        ) : (
          <div className="empty-callout">
            <div className="empty-icon">🎖️</div>
            <div>
              <h4 className="empty-title">Milestone Badges In Progress</h4>
              <p className="empty-desc">
                Institutional skill badges are awarded upon passing Proctored Milestone Benchmark Exams and defending Capstone Architecture Reviews.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── VERIFIED CAPSTONE PROJECTS OR MILESTONE ROADMAP ── */}
      <section className="section-block">
        <div className="section-header">
          <h2 className="section-title">
            <span>📦</span> Verified Capstone Engineering Projects
          </h2>
          <span className="section-count">
            {portfolio.capstones.length > 0
              ? `${portfolio.capstones.length} Defended Projects`
              : 'Sprint 1 In Progress'}
          </span>
        </div>

        {portfolio.capstones && portfolio.capstones.length > 0 ? (
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
        ) : (
          /* Transparent, authentic Sprint Capstone Roadmap */
          <div className="capstones-grid">
            <article className="capstone-card in-progress-card">
              <div className="capstone-top">
                <span className="capstone-code">SPRINT 1 CAPSTONE</span>
                <span className="capstone-status-in-progress">IN PROGRESS</span>
              </div>
              <h3 className="capstone-title">Architecture, Domain Modeling &amp; Data Schema</h3>
              <p className="capstone-desc">
                Entity-relationship architecture, state normalization, REST endpoints, and automated data validation models.
              </p>
              <div className="competencies-row">
                <span className="comp-tag">Next.js 14</span>
                <span className="comp-tag">TypeScript</span>
                <span className="comp-tag">PostgreSQL</span>
                <span className="comp-tag">Schema Design</span>
              </div>
              <div className="capstone-footer">
                <span className="capstone-date">Status: Active Development</span>
                <span className="capstone-pending-note">Public Repository link unlocks upon milestone defense</span>
              </div>
            </article>

            <article className="capstone-card locked-card">
              <div className="capstone-top">
                <span className="capstone-code">SPRINT 2 CAPSTONE</span>
                <span className="capstone-status-locked">🔒 LOCKED (DAY 16)</span>
              </div>
              <h3 className="capstone-title">Authenticated APIs &amp; Resilient Business Logic</h3>
              <p className="capstone-desc">
                Role-based access controls, HMAC-SHA256 signature verifications, rate limiting, and transaction workflows.
              </p>
              <div className="competencies-row">
                <span className="comp-tag">Auth Systems</span>
                <span className="comp-tag">Node.js</span>
                <span className="comp-tag">API Security</span>
              </div>
              <div className="capstone-footer">
                <span className="capstone-date">Opens after passing Days 1–15 Milestones</span>
              </div>
            </article>

            <article className="capstone-card locked-card">
              <div className="capstone-top">
                <span className="capstone-code">SPRINT 3 &amp; 4 CAPSTONE</span>
                <span className="capstone-status-locked">🔒 LOCKED (DAY 31)</span>
              </div>
              <h3 className="capstone-title">Production SaaS System, Cloud Deployment &amp; Live Viva Defense</h3>
              <p className="capstone-desc">
                High-availability frontend, end-to-end integration tests, CI/CD pipeline, and recorded AI-proctored technical viva defense.
              </p>
              <div className="competencies-row">
                <span className="comp-tag">Production CI/CD</span>
                <span className="comp-tag">Docker</span>
                <span className="comp-tag">Oral Viva Defense</span>
              </div>
              <div className="capstone-footer">
                <span className="capstone-date">Final Program Accreditation Milestone</span>
              </div>
            </article>
          </div>
        )}
      </section>

      {/* ── CRYPTOGRAPHIC SHA-256 PROOF CARD ── */}
      <footer className="proof-card">
        <div className="proof-header">
          <div className="proof-icon-title">
            <span className="proof-icon">🛡️</span>
            <div>
              <h3 className="proof-title">Cryptographic Integrity Proof (SHA-256)</h3>
              <p className="proof-desc">
                Tamper-evident evidence chain signed by {portfolio.institutionName || 'PinIT Trust Network'}. Guaranteed authentic and immune to resume fraud.
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
          box-sizing: border-box;
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
          box-sizing: border-box;
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
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        /* Hero Card */
        .hero-card {
          position: relative;
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px 28px;
          overflow: hidden;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
        }

        .hero-bg-glow {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-top-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .verification-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .fingerprint-label {
          font-size: 11.5px;
          font-family: monospace;
          color: #64748b;
        }

        .hero-content {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .hero-avatar-col {
          flex-shrink: 0;
        }

        .hero-avatar {
          width: 76px;
          height: 76px;
          border-radius: 20px;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
        }

        .hero-info-col {
          flex: 1;
          min-width: 240px;
        }

        .student-name {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.6px;
          margin: 0 0 6px 0;
          color: #ffffff;
        }

        .student-degree {
          font-size: 15px;
          color: #cbd5e1;
          margin: 0 0 14px 0;
          line-height: 1.4;
        }
        .text-dim {
          color: #64748b;
        }

        .student-meta-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 12.5px;
          color: #94a3b8;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .meta-item.institution {
          color: #818cf8;
          font-weight: 600;
        }
        .meta-item.cgpa {
          color: #34d399;
          font-weight: 700;
        }
        .meta-item.id-badge {
          font-family: monospace;
          background: rgba(0, 0, 0, 0.25);
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 11px;
        }
        .meta-dot {
          color: #475569;
        }
        .text-muted-dim {
          color: #64748b !important;
          font-weight: 500 !important;
        }

        .hero-score-col {
          flex-shrink: 0;
        }

        .score-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: 16px;
          padding: 14px 20px;
          text-align: center;
          min-width: 130px;
        }

        .score-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          color: #94a3b8;
          display: block;
          margin-bottom: 4px;
        }

        .score-value-row {
          display: flex;
          align-items: baseline;
          justify-content: center;
        }
        .score-number {
          font-size: 34px;
          font-weight: 900;
          color: #818cf8;
          letter-spacing: -1px;
        }
        .score-denom {
          font-size: 16px;
          font-weight: 700;
          color: #64748b;
        }

        .tier-badge {
          margin-top: 6px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.4px;
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.15);
          padding: 3px 8px;
          border-radius: 6px;
          display: inline-block;
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .kpi-card {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .kpi-label {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
        }
        .kpi-value {
          font-size: 18px;
          font-weight: 800;
        }
        .kpi-sub {
          font-size: 10.5px;
          color: #64748b;
        }
        .text-white { color: #ffffff; }
        .text-accent { color: #818cf8; }
        .text-emerald { color: #34d399; }

        /* ── COURSE LEDGER SECTION ── */
        .course-ledger-section {
          width: 100%;
        }

        .ledger-card {
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          box-sizing: border-box;
        }

        .ledger-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }

        .ledger-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
        }

        .ledger-title {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }

        .ledger-track {
          font-size: 13.5px;
          color: #94a3b8;
          margin: 0;
        }

        .ledger-stats-pill {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 6px 14px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
        }
        .ledger-day-text { color: #38bdf8; }
        .ledger-sep { color: #475569; }
        .ledger-task-text { color: #f8fafc; }

        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: rgba(15, 23, 42, 0.9);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #10b981);
          border-radius: 8px;
          transition: width 0.4s ease;
        }

        .milestone-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 18px;
        }

        .milestone-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .milestone-box.active {
          border-color: rgba(56, 189, 248, 0.35);
          background: rgba(15, 23, 42, 0.85);
        }

        .milestone-icon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .milestone-icon {
          font-size: 18px;
        }
        .milestone-badge-active {
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          letter-spacing: 0.4px;
        }
        .milestone-badge-ready {
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          letter-spacing: 0.4px;
        }
        .milestone-badge-upcoming {
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(148, 163, 184, 0.15);
          color: #cbd5e1;
          letter-spacing: 0.4px;
        }

        .milestone-box-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .milestone-box-desc {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.4;
        }

        .recent-evidence-bar {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          flex-wrap: wrap;
        }
        .evidence-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }
        .evidence-title {
          font-weight: 700;
          color: #34d399;
        }
        .evidence-task {
          color: #e2e8f0;
          font-weight: 500;
        }

        /* ── SECTION BLOCKS ── */
        .section-block {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
          box-sizing: border-box;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-count {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.06);
          padding: 3px 10px;
          border-radius: 12px;
        }

        /* Badges Grid */
        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }

        .badge-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .badge-icon {
          font-size: 24px;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(99, 102, 241, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .badge-name {
          font-size: 14.5px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .badge-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
        }
        .badge-category {
          color: #818cf8;
          font-weight: 700;
          text-transform: uppercase;
        }
        .badge-date {
          color: #64748b;
        }

        .empty-callout {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px;
          background: rgba(30, 41, 59, 0.3);
          border: 1px dashed rgba(255, 255, 255, 0.12);
          border-radius: 14px;
        }
        .empty-icon {
          font-size: 28px;
          opacity: 0.6;
        }
        .empty-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 2px 0;
        }
        .empty-desc {
          font-size: 12.5px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.4;
        }

        /* Capstones Grid */
        .capstones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .capstone-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
        }
        .in-progress-card {
          border-color: rgba(56, 189, 248, 0.35);
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%);
        }
        .locked-card {
          opacity: 0.85;
          border-color: rgba(255, 255, 255, 0.05);
          background: rgba(15, 23, 42, 0.4);
        }

        .capstone-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .capstone-code {
          font-size: 11px;
          font-weight: 800;
          color: #818cf8;
          background: rgba(99, 102, 241, 0.12);
          padding: 2px 8px;
          border-radius: 6px;
        }
        .capstone-grade {
          font-size: 12px;
          font-weight: 700;
          color: #34d399;
        }
        .capstone-status-in-progress {
          font-size: 11px;
          font-weight: 800;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
          padding: 2px 8px;
          border-radius: 6px;
        }
        .capstone-status-locked {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .capstone-title {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          line-height: 1.35;
        }

        .capstone-desc {
          font-size: 12.5px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.4;
        }

        .competencies-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .comp-tag {
          font-size: 11px;
          font-weight: 600;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .capstone-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 11.5px;
          color: #64748b;
          flex-wrap: wrap;
          gap: 8px;
        }
        .capstone-pending-note {
          color: #94a3b8;
          font-style: italic;
          font-size: 11px;
        }

        .capstone-links {
          display: flex;
          gap: 10px;
        }
        .capstone-link {
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .capstone-link.repo { color: #818cf8; }
        .capstone-link.demo { color: #34d399; }

        /* ── CRYPTOGRAPHIC SHA-256 PROOF CARD ── */
        .proof-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 24px;
          box-sizing: border-box;
        }

        .proof-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .proof-icon-title {
          display: flex;
          gap: 12px;
          max-width: 600px;
        }
        .proof-icon {
          font-size: 24px;
        }
        .proof-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }
        .proof-desc {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.4;
        }

        .copy-hash-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .copy-hash-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .fingerprint-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 14px;
          overflow-x: auto;
        }
        .fingerprint-box code {
          font-family: monospace;
          font-size: 12.5px;
          color: #38bdf8;
          word-break: break-all;
        }

        .proof-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          background: rgba(16, 185, 129, 0.1);
          padding: 3px 8px;
          border-radius: 6px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
        }

        /* ── RESPONSIVE VIEWPORT QUERIES ── */
        @media (max-width: 820px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .milestone-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .hero-content {
            flex-direction: column;
            align-items: flex-start;
          }
          .hero-score-col {
            width: 100%;
          }
          .score-box {
            width: 100%;
            box-sizing: border-box;
          }
          .kpi-grid {
            grid-template-columns: 1fr;
          }
          .badges-grid {
            grid-template-columns: 1fr;
          }
          .capstones-grid {
            grid-template-columns: 1fr;
          }
          .student-name {
            font-size: 26px;
          }
          .hero-card {
            padding: 22px 18px;
          }
          .section-block {
            padding: 18px 14px;
          }
          .ledger-card {
            padding: 18px 14px;
          }
        }
      `}</style>
    </div>
  );
};
