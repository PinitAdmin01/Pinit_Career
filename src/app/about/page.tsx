'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function AboutPageContent() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('pc_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('pc_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="about-page-wrapper" data-theme={theme}>
      {/* 1. NAVBAR */}
      <nav className="about-navbar">
        <div className="container nav-content">
          <Link href="/" className="brand-logo lp-brand" aria-label="PINIT CAREER home">
            <span className="lp-brand-lockup">
              <img src="/brand/pinit-career-logo.png" alt="PINIT CAREER" className="lp-brand-logo" />
            </span>
          </Link>

          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <a href="#vision" className="nav-link">Vision & Mission</a>
            <a href="#modules" className="nav-link">54 Ecosystem Modules</a>
            <a href="#pillars" className="nav-link">Core Pillars</a>
          </div>

          <div className="nav-actions">
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link href="/" className="pc-btn-outline btn-sm">← Back to Home</Link>
            <Link href="/dashboard" className="pc-btn-primary btn-sm">Go to Workspace →</Link>
          </div>
        </div>
      </nav>

      {/* STEP 1: HERO HEADER & VISION */}
      <header id="vision" className="about-hero-section section-padding">
        <div className="container">
          <div className="hero-badge-pill">
            <span className="sparkle">✨</span> The Complete Career Operating System
          </div>
          
          <h1 className="about-hero-title">
            Reimagining Career Learning,<br />
            Proof of Work & Placement for the <span className="text-purple-grad">AI Era.</span>
          </h1>

          <p className="about-hero-subtitle">
            PinitCareer connects students, colleges, mentors, parents, consultants, and enterprise tech recruiters into one unified intelligent ecosystem. Powered by AI Neural Twins, gamified S-Curve learning trajectories, and real-time biometrics.
          </p>

          {/* 54-MODULE METRICS BAR */}
          <div className="metrics-bar-grid">
            <div className="metric-card">
              <div className="metric-num">54</div>
              <div className="metric-lbl">Integrated Modules</div>
              <div className="metric-sub">From Quests to Finance & Placement</div>
            </div>
            <div className="metric-card">
              <div className="metric-num">6</div>
              <div className="metric-lbl">Stakeholder Portals</div>
              <div className="metric-sub">Student, Admin, Recruiter, Parent, Consultant, Advisor</div>
            </div>
            <div className="metric-card">
              <div className="metric-num">100%</div>
              <div className="metric-lbl">Proof of Work</div>
              <div className="metric-sub">Verified Code, GitHub Audits & Projects</div>
            </div>
            <div className="metric-card">
              <div className="metric-num">24/7</div>
              <div className="metric-lbl">AI Neural Mentorship</div>
              <div className="metric-sub">Career Twin & Real-Time Guidance</div>
            </div>
          </div>
        </div>
      </header>

      {/* CORE MISSION & VISION PILLARS GRID */}
      <section id="pillars" className="about-pillars-section section-padding alt-bg">
        <div className="container">
          <div className="section-head-center">
            <span className="sub-tag">FOUNDATIONAL ARCHITECTURE</span>
            <h2>Our 4 Core Ecosystem Pillars</h2>
            <p>Built to replace fragmented learning management systems with a single unified Operating System.</p>
          </div>

          <div className="pillars-grid-4">
            {/* Pillar 1 */}
            <div className="pillar-card">
              <div className="p-icon-box bg-purple">🧠</div>
              <h3>1. AI-Powered Personalization</h3>
              <p>
                Dynamic S-Curve roadmaps that continuously adapt to student progress, skill gaps, target companies, and daily learning velocities. Powered by AI Career Twins & Neural DNA profiling.
              </p>
              <ul className="p-bullets">
                <li>✓ Level 0 to Level 3 Stage Progression</li>
                <li>✓ Real-Time Attention Span Tracking</li>
                <li>✓ 24/7 AI Mentor Guidance & Doubt Resolution</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-card">
              <div className="p-icon-box bg-green">🔨</div>
              <h3>2. Skill-First Proof of Work</h3>
              <p>
                We replace static text resumes with verified proof of work. Every line of code written in Quests, Code Wars, and Project Vaults is verified and scored.
              </p>
              <ul className="p-bullets">
                <li>✓ Gamified Quests with WebAudio FX Engine</li>
                <li>✓ GitHub Repository & Code Audit Sync</li>
                <li>✓ Shareable Candidate Skill Passports</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-card">
              <div className="p-icon-box bg-blue">🌐</div>
              <h3>3. Ecosystem Connectivity</h3>
              <p>
                Connecting all campus stakeholders in real-time. Students, Faculty, Placement Directors, Enterprise Recruiters, Parents, and Industry Consultants interact seamlessly.
              </p>
              <ul className="p-bullets">
                <li>✓ Integrated Placement & Candidate CRM</li>
                <li>✓ Parent Progress & Financial Transparency</li>
                <li>✓ Consultant 1-on-1 Mentorship Booking</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="pillar-card">
              <div className="p-icon-box bg-amber">📈</div>
              <h3>4. Guaranteed Placement Readiness</h3>
              <p>
                Real-time Career Readiness Scoring (0-100%) calculated dynamically using live coding rankings, project completion, and AI mock interview evaluations.
              </p>
              <ul className="p-bullets">
                <li>✓ 95%+ AI Candidate-to-Job Matching</li>
                <li>✓ AI Speech & Technical Mock Interview Studio</li>
                <li>✓ Automated Campus Drive Workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: STUDENT GROWTH & GAMIFIED LEARNING ENGINE SHOWCASE */}
      <section id="student-growth" className="about-growth-section section-padding">
        <div className="container">
          <div className="section-head-center">
            <span className="sub-tag">GAMIFIED S-CURVE TRAJECTORIES</span>
            <h2>Student Growth & Proof-of-Work Engine</h2>
            <p>From Zero Basics to Pro Mastery — how students learn, build projects, and compete globally.</p>
          </div>

          {/* S-Curve Quest Trajectory & Level 0-3 Stage Badges */}
          <div className="growth-feature-grid mb-12">
            <div className="gf-card">
              <div className="gf-header">
                <span className="gf-badge bg-green">S-CURVE ROADMAP</span>
                <h4>Level 0 to Level 3 Stage Progression</h4>
              </div>
              <p className="gf-desc">
                Every career trajectory is mapped into structured S-Curve nodes with single-click active node execution and progressive difficulty scaling:
              </p>
              <div className="levels-pills-row">
                <span className="lvl-pill lvl-0">🌱 Level 0: Zero Basics</span>
                <span className="lvl-pill lvl-1">🌱 Level 1: Foundations</span>
                <span className="lvl-pill lvl-2">⚡ Level 2: Core Engineering</span>
                <span className="lvl-pill lvl-3">🔥 Level 3: Pro Mastery</span>
              </div>
              <ul className="gf-checklist">
                <li><span className="chk">✓</span> Animated Avatar Track Runner tracking live progress</li>
                <li><span className="chk">✓</span> Master Syllabus Modal lining up every single quest</li>
                <li><span className="chk">✓</span> WebAudio Sound FX Engine (Pop & Level-Up chime feedback)</li>
              </ul>
            </div>

            <div className="gf-card">
              <div className="gf-header">
                <span className="gf-badge bg-purple">PROOF OF WORK</span>
                <h4>Project Vault & GitHub Audit Engine</h4>
              </div>
              <p className="gf-desc">
                Students construct production-ready MERN, Next.js, and Full-Stack applications verified through automated test suites:
              </p>
              <div className="vault-stats-row">
                <div className="vs-item"><span className="v-num">30K+</span><span>Projects Deployed</span></div>
                <div className="vs-item"><span className="v-num">100%</span><span>Code Audited</span></div>
                <div className="vs-item"><span className="v-num">Verified</span><span>Skill Badges</span></div>
              </div>
              <ul className="gf-checklist">
                <li><span className="chk">✓</span> Live environment deployment and instant preview links</li>
                <li><span className="chk">✓</span> Public Candidate Skill Passports with shareable URLs</li>
                <li><span className="chk">✓</span> GitHub repository sync and syntax audit checks</li>
              </ul>
            </div>
          </div>

          {/* Code Wars & Global Leaderboards Card */}
          <div className="code-wars-showcase-box">
            <div className="cw-showcase-left">
              <span className="cw-tag-pill">⚔️ GLOBAL ARENA</span>
              <h3>Code Wars & Competitive Battles</h3>
              <p>
                Daily 1v1 battles, weekly leagues, hackathons, and company coding challenges where students compete for XP, rank, and instant recruiter visibility.
              </p>
              <div className="cw-topics-tags">
                <span>Data Structures</span> • <span>Algorithms</span> • <span>System Design</span> • <span>Debugging</span> • <span>AI Battles</span>
              </div>
            </div>

            <div className="cw-showcase-right">
              <div className="mini-lb-box">
                <div className="mini-lb-head">🏆 Live Leaderboard Preview</div>
                <div className="mini-lb-row"><span>🥇 Riya Singh</span><span className="xp-val">2,450 XP</span></div>
                <div className="mini-lb-row"><span>🥈 Arjun Dev</span><span className="xp-val">2,330 XP</span></div>
                <div className="mini-lb-row"><span>🥉 Karthik S.</span><span className="xp-val">2,150 XP</span></div>
                <div className="mini-lb-row my-row"><span>🏅 You</span><span className="xp-val">1,980 XP</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: AI INNOVATIONS & NEURAL INTELLIGENCE HUB */}
      <section id="ai-intelligence" className="about-ai-section section-padding alt-bg">
        <div className="container">
          <div className="section-head-center">
            <span className="sub-tag">NEURAL INTELLIGENCE ENGINE</span>
            <h2>AI Innovations & Neural Career Twin</h2>
            <p>Proprietary AI models that profile skills, monitor focus, and conduct technical mock interviews.</p>
          </div>

          <div className="ai-features-grid-3 mb-12">
            {/* AI Module 1 */}
            <div className="ai-card">
              <div className="ai-badge-row">
                <span className="ai-icon-badge">🧬</span>
                <span className="ai-tag bg-purple">CAREER TWIN & DNA</span>
              </div>
              <h3>AI Neural Career Twin</h3>
              <p>
                Synthesizes technical submission logs, coding speed, bug rates, and soft skills into an evolving digital twin that predicts target role fit and salary potential.
              </p>
              <ul className="ai-checklist">
                <li><span className="chk">✓</span> Continuous skill gap forecasting</li>
                <li><span className="chk">✓</span> Automated career path recommendation</li>
                <li><span className="chk">✓</span> Adaptive daily pace target calculations</li>
              </ul>
            </div>

            {/* AI Module 2 */}
            <div className="ai-card">
              <div className="ai-badge-row">
                <span className="ai-icon-badge">🎯</span>
                <span className="ai-tag bg-cyan">ENGAGEMENT ANALYTICS</span>
              </div>
              <h3>Attention Span & Focus Meter</h3>
              <p>
                Measures active focus metrics during interactive coding sessions and video lectures to optimize learning duration and prevent fatigue.
              </p>
              <ul className="ai-checklist">
                <li><span className="chk">✓</span> Real-time focus score telemetry</li>
                <li><span className="chk">✓</span> Intelligent break & micro-quest prompts</li>
                <li><span className="chk">✓</span> Personalized learning speed adjustments</li>
              </ul>
            </div>

            {/* AI Module 3 */}
            <div className="ai-card">
              <div className="ai-badge-row">
                <span className="ai-icon-badge">🎙️</span>
                <span className="ai-tag bg-pink">INTERVIEW STUDIO</span>
              </div>
              <h3>AI Mock Interview Studio</h3>
              <p>
                Simulates real-world technical and behavioral rounds with real-time speech-to-text, body language cues, and instant feedback reports.
              </p>
              <ul className="ai-checklist">
                <li><span className="chk">✓</span> Role-specific DSA & System Design questions</li>
                <li><span className="chk">✓</span> Real-time confidence & pace analysis</li>
                <li><span className="chk">✓</span> Instant transcript and score breakdowns</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 4: ENTERPRISE RECRUITER SUITE & CAMPUS ADMINISTRATION HUB */}
      <section id="enterprise-admin" className="about-enterprise-section section-padding">
        <div className="container">
          <div className="section-head-center">
            <span className="sub-tag">ENTERPRISE & UNIVERSITY OPERATIONS</span>
            <h2>Enterprise Recruiter Suite & Campus Operations Hub</h2>
            <p>Bridging students, university administration, and enterprise hiring teams on one unified network.</p>
          </div>

          <div className="enterprise-split-grid mb-12">
            {/* Recruiter Suite */}
            <div className="ent-card">
              <div className="ent-header">
                <span className="ent-badge bg-purple">RECRUITER SUITE</span>
                <h4>AI Talent Matchmaking & Campus Drives</h4>
              </div>
              <p className="ent-desc">
                Enterprise recruiters post role-specific roadmaps and receive 95%+ AI match shortlisted candidates verified by actual code submissions:
              </p>
              <ul className="ent-checklist">
                <li><span className="chk">✓</span> Automated candidate skill gap analysis</li>
                <li><span className="chk">✓</span> Candidate Passport verification & GitHub code audit logs</li>
                <li><span className="chk">✓</span> Integrated placement CRM with automated offer letter delivery</li>
              </ul>
            </div>

            {/* University Admin Hub */}
            <div className="ent-card">
              <div className="ent-header">
                <span className="ent-badge bg-green">UNIVERSITY ADMIN</span>
                <h4>Campus Operations & Logistics Command Center</h4>
              </div>
              <p className="ent-desc">
                Complete administration suite covering academic roll-calls, exam scoring, and multi-department campus logistics:
              </p>
              <ul className="ent-checklist">
                <li><span className="chk">✓</span> Academic, Attendance & Examination Result Portals</li>
                <li><span className="chk">✓</span> Hostel Management & Route-Based Transport Logistics</li>
                <li><span className="chk">✓</span> RFID Library Cataloguing, Finance Fee Tracking & Grievance System</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 5: MULTI-STAKEHOLDER ECOSYSTEM, FINAL CTA & FOOTER */}
      <section id="stakeholders" className="about-stakeholders-section section-padding alt-bg">
        <div className="container">
          <div className="section-head-center">
            <span className="sub-tag">ECOSYSTEM CONNECTIVITY</span>
            <h2>Multi-Stakeholder Portals</h2>
            <p>Empowering parents, career consultants, faculty advisors, and alumni network mentors.</p>
          </div>

          <div className="stakeholders-grid-4 mb-16">
            <div className="sh-card">
              <div className="sh-icon">👨‍👩‍👧</div>
              <h4>Parent Portal</h4>
              <p>Real-time progress monitoring, attendance alerts, career readiness scores, and fee transparency.</p>
            </div>

            <div className="sh-card">
              <div className="sh-icon">👨‍💼</div>
              <h4>Consultant & Mentor Hub</h4>
              <p>1-on-1 career advisory, resume review bookings, and industry guidance sessions.</p>
            </div>

            <div className="sh-card">
              <div className="sh-icon">👨‍🏫</div>
              <h4>Faculty & Advisor Desk</h4>
              <p>Academic performance analytics, automated attendance management, and student intervention tools.</p>
            </div>

            <div className="sh-card">
              <div className="sh-icon">🎓</div>
              <h4>Alumni Network</h4>
              <p>Alumni mentorship matching, campus referral networks, and industry story sharing.</p>
            </div>
          </div>

          {/* FINAL CTA BANNER */}
          <div className="about-final-cta">
            <h2>Ready to Transform Your Career Trajectory?</h2>
            <p>Join thousands of students, university campuses, and enterprise hiring teams on PinitCareer today.</p>
            <div className="about-cta-btns">
              <Link href="/dashboard" className="pc-btn-primary pc-btn-lg">Get Started Free →</Link>
              <Link href="/" className="pc-btn-outline pc-btn-lg">Explore Landing Page</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="about-footer">
        <div className="container footer-content">
          <div className="footer-left">
            <div className="brand-logo mb-2">
              <span className="lp-brand-lockup">
                <img src="/brand/pinit-career-logo.png" alt="PINIT CAREER" className="lp-brand-logo" />
              </span>
            </div>
            <p className="footer-sub">© 2026 PinitCareer Technologies. All 54 Ecosystem Modules Active.</p>
          </div>
          <div className="footer-links">
            <Link href="/" className="f-link">Home</Link>
            <Link href="/dashboard" className="f-link">Dashboard</Link>
            <Link href="/quests" className="f-link">Quests</Link>
            <Link href="/admin" className="f-link">Admin</Link>
          </div>
        </div>
      </footer>

      {/* IN-PAGE CSS DESIGN SYSTEM */}
      <style>{`
        :root {
          --bg-primary: #080A1A;
          --bg-secondary: #0F1225;
          --bg-card: rgba(15, 18, 40, 0.75);
          --bg-card-solid: #12152B;
          --text-primary: #FFFFFF;
          --text-secondary: #94A3B8;
          --text-tertiary: #64748B;
          --border-color: rgba(255, 255, 255, 0.08);
          --accent: #7C3AED;
          --accent-glow: rgba(124, 58, 237, 0.3);
        }

        [data-theme='light'] {
          --bg-primary: #FFFFFF;
          --bg-secondary: #F8FAFC;
          --bg-card: #FFFFFF;
          --bg-card-solid: #FFFFFF;
          --text-primary: #0F172A;
          --text-secondary: #475569;
          --text-tertiary: #94A3B8;
          --border-color: rgba(0, 0, 0, 0.08);
          --accent: #7C3AED;
          --accent-glow: rgba(124, 58, 237, 0.15);
        }

        .about-page-wrapper {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-padding { padding: 80px 0; }
        .alt-bg { background: var(--bg-secondary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); }

        /* NAVBAR */
        .about-navbar {
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          backdrop-filter: blur(12px);
        }
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        .brand-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; font-weight: 900; color: var(--text-primary); font-size: 16px; }
        .pi-hex-icon { display: flex; align-items: center; }
        .nav-links { display: flex; gap: 24px; }
        .nav-link { font-size: 13px; font-weight: 600; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: var(--accent); }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .theme-toggle-btn { background: var(--bg-card-solid); border: 1px solid var(--border-color); border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        
        .pc-btn-primary { background: linear-gradient(135deg, #7C3AED, #A855F7); color: #FFF; border: none; padding: 10px 20px; border-radius: 50px; font-size: 12.5px; font-weight: 700; text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
        .pc-btn-outline { background: transparent; border: 1.5px solid var(--border-color); color: var(--text-primary); padding: 10px 20px; border-radius: 50px; font-size: 12.5px; font-weight: 700; text-decoration: none; cursor: pointer; }
        .btn-sm { padding: 7px 16px; font-size: 12px; }

        /* HERO HEADER */
        .about-hero-section { text-align: center; padding-top: 100px; padding-bottom: 60px; }
        .hero-badge-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(124, 58, 237, 0.12); color: #7C3AED; border: 1px solid rgba(124, 58, 237, 0.3); padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 800; margin-bottom: 24px; }
        .about-hero-title { font-size: 46px; font-weight: 900; line-height: 1.15; letter-spacing: -1.5px; margin-bottom: 20px; color: var(--text-primary); }
        .text-purple-grad { background: linear-gradient(135deg, #7C3AED, #A855F7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .about-hero-subtitle { font-size: 16px; color: var(--text-secondary); max-width: 760px; margin: 0 auto 48px auto; line-height: 1.7; }

        /* METRICS BAR */
        .metrics-bar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .metric-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .metric-num { font-size: 38px; font-weight: 900; color: #7C3AED; margin-bottom: 4px; font-family: var(--font-mono); }
        .metric-lbl { font-size: 14px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
        .metric-sub { font-size: 11px; color: var(--text-tertiary); font-weight: 500; }

        /* CORE PILLARS */
        .section-head-center { text-align: center; max-width: 640px; margin: 0 auto 56px auto; }
        .sub-tag { font-size: 11px; font-weight: 800; color: #7C3AED; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
        .section-head-center h2 { font-size: 32px; font-weight: 900; color: var(--text-primary); margin-bottom: 12px; letter-spacing: -0.5px; }
        .section-head-center p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }

        .pillars-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .pillar-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 28px 20px; display: flex; flex-direction: column; transition: transform 0.3s; }
        .pillar-card:hover { transform: translateY(-6px); border-color: rgba(124, 58, 237, 0.4); }
        .p-icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; }
        .bg-purple { background: rgba(124,58,237,0.12); }
        .bg-green { background: rgba(16,185,129,0.12); }
        .bg-blue { background: rgba(59,130,246,0.12); }
        .bg-amber { background: rgba(245,158,11,0.12); }
        .pillar-card h3 { font-size: 16px; font-weight: 800; color: var(--text-primary); margin-bottom: 12px; line-height: 1.3; }
        .pillar-card p { font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px; flex: 1; }
        .p-bullets { list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 11.5px; font-weight: 600; color: var(--text-primary); border-top: 1px solid var(--border-color); padding-top: 16px; }
        .p-bullets li { display: flex; align-items: center; gap: 6px; }

        /* STEP 2: STUDENT GROWTH SHOWCASE STYLES */
        .growth-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
        .gf-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 28px; display: flex; flex-direction: column; }
        .gf-header { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .gf-badge { font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 50px; display: inline-block; align-self: flex-start; text-transform: uppercase; letter-spacing: 0.5px; }
        .gf-card h4 { font-size: 18px; font-weight: 800; color: var(--text-primary); }
        .gf-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px; }

        .levels-pills-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .lvl-pill { font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 8px; }
        .lvl-0 { background: rgba(16, 185, 129, 0.12); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); }
        .lvl-1 { background: rgba(6, 182, 212, 0.12); color: #06B6D4; border: 1px solid rgba(6, 182, 212, 0.3); }
        .lvl-2 { background: rgba(59, 130, 246, 0.12); color: #3B82F6; border: 1px solid rgba(59, 130, 246, 0.3); }
        .lvl-3 { background: rgba(236, 72, 153, 0.12); color: #EC4899; border: 1px solid rgba(236, 72, 153, 0.3); }

        .gf-checklist { list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-primary); border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto; }
        .gf-checklist .chk { color: #10B981; font-weight: 900; }

        .vault-stats-row { display: flex; gap: 16px; margin-bottom: 20px; }
        .vs-item { flex: 1; background: var(--bg-card-solid); border: 1px solid var(--border-color); border-radius: 14px; padding: 12px; text-align: center; display: flex; flex-direction: column; gap: 2px; }
        .v-num { font-size: 18px; font-weight: 900; color: #7C3AED; }
        .vs-item span:last-child { font-size: 10px; color: var(--text-secondary); font-weight: 700; }

        .code-wars-showcase-box { background: linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(15, 18, 37, 0.95)); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 28px; padding: 32px; display: flex; align-items: center; justify-content: space-between; gap: 32px; }
        .cw-showcase-left { flex: 1; }
        .cw-tag-pill { font-size: 10.5px; font-weight: 800; color: #EC4899; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
        .cw-showcase-left h3 { font-size: 24px; font-weight: 900; color: var(--text-primary); margin-bottom: 12px; }
        .cw-showcase-left p { font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px; }
        .cw-topics-tags { font-size: 11.5px; color: #7C3AED; font-weight: 700; }

        .cw-showcase-right { width: 280px; flex-shrink: 0; }
        .mini-lb-box { background: var(--bg-card-solid); border: 1px solid var(--border-color); border-radius: 18px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
        .mini-lb-head { font-size: 11px; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .mini-lb-row { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: var(--text-primary); padding: 6px 10px; border-radius: 8px; background: rgba(255,255,255,0.03); }
        .xp-val { color: #7C3AED; font-family: var(--font-mono); }
        .my-row { background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.3); }

        /* STEP 3: AI INNOVATIONS STYLES */
        .ai-features-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .ai-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 28px 24px; display: flex; flex-direction: column; transition: transform 0.3s; }
        .ai-card:hover { transform: translateY(-6px); border-color: rgba(124, 58, 237, 0.4); }
        .ai-badge-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .ai-icon-badge { font-size: 24px; }
        .ai-tag { font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px; }
        .bg-cyan { background: rgba(6, 182, 212, 0.12); color: #06B6D4; border: 1px solid rgba(6, 182, 212, 0.3); }
        .bg-pink { background: rgba(236, 72, 153, 0.12); color: #EC4899; border: 1px solid rgba(236, 72, 153, 0.3); }
        .ai-card h3 { font-size: 18px; font-weight: 800; color: var(--text-primary); margin-bottom: 10px; }
        .ai-card p { font-size: 12.5px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px; flex: 1; }
        .ai-checklist { list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-primary); border-top: 1px solid var(--border-color); padding-top: 16px; }
        .ai-checklist .chk { color: #10B981; font-weight: 900; }

        /* STEP 4: ENTERPRISE & CAMPUS OPERATIONS STYLES */
        .enterprise-split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .ent-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 28px; display: flex; flex-direction: column; }
        .ent-header { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .ent-badge { font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 50px; display: inline-block; align-self: flex-start; text-transform: uppercase; letter-spacing: 0.5px; }
        .ent-card h4 { font-size: 18px; font-weight: 800; color: var(--text-primary); }
        .ent-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px; }
        .ent-checklist { list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-primary); border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto; }
        .ent-checklist .chk { color: #10B981; font-weight: 900; }

        /* STEP 5: STAKEHOLDERS & FINAL CTA STYLES */
        .stakeholders-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .sh-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px 20px; text-align: center; }
        .sh-icon { font-size: 32px; margin-bottom: 12px; }
        .sh-card h4 { font-size: 16px; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; }
        .sh-card p { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }

        .about-final-cta { background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(16, 185, 129, 0.15)); border: 1px solid rgba(124, 58, 237, 0.4); border-radius: 28px; padding: 48px 32px; text-align: center; margin-top: 40px; }
        .about-final-cta h2 { font-size: 32px; font-weight: 900; color: var(--text-primary); margin-bottom: 12px; letter-spacing: -0.5px; }
        .about-final-cta p { font-size: 15px; color: var(--text-secondary); max-width: 600px; margin: 0 auto 28px auto; line-height: 1.6; }
        .about-cta-btns { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .pc-btn-lg { padding: 12px 28px; font-size: 14px; }

        .about-footer { background: var(--bg-primary); border-top: 1px solid var(--border-color); padding: 32px 0; }
        .footer-content { display: flex; align-items: center; justify-content: space-between; }
        .footer-sub { font-size: 12px; color: var(--text-tertiary); margin-top: 4px; }
        .footer-links { display: flex; gap: 20px; }
        .f-link { font-size: 13px; font-weight: 600; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
        .f-link:hover { color: var(--accent); }

        @media (max-width: 900px) {
          .nav-content { flex-wrap: wrap; gap: 12px; }
          .nav-links { display: none; }
          .nav-actions { width: 100%; justify-content: space-between; }
          .about-hero-title { font-size: 28px; line-height: 1.25; }
          .about-hero-subtitle { font-size: 13.5px; }
          .growth-feature-grid, .code-wars-showcase-box, .ai-features-grid-3, .enterprise-split-grid, .stakeholders-grid-4 { grid-template-columns: 1fr; flex-direction: column; }
          .cw-showcase-right { width: 100%; }
          .footer-content { flex-direction: column; gap: 20px; text-align: center; }
          .about-final-cta { padding: 32px 20px; }
          .about-final-cta h2 { font-size: 24px; }
          .about-cta-btns a, .about-cta-btns button { width: 100%; text-align: center; }
        }

        @media (max-width: 640px) {
          .metrics-bar-grid, .pillars-grid-4 { grid-template-columns: 1fr; }
          .metric-card { padding: 16px; }
          .metric-num { font-size: 28px; }
          .about-hero-section { padding: 40px 0 20px 0; }
        }
      `}</style>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t3)', textAlign: 'center' }}>Loading About Page...</div>}>
      <AboutPageContent />
    </Suspense>
  );
}
