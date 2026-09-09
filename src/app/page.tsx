'use client';

import React, { useState, useRef, useCallback, Suspense, type MouseEvent } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import ComparisonSplit from '@/components/landing/ComparisonSplit';
import ThreeWorldsPortal from '@/components/landing/ThreeWorldsPortal';
import CourseBentoMatrix from '@/components/landing/CourseBentoMatrix';
import RoadmapSCurve from '@/components/landing/RoadmapSCurve';
import ArenaAndVoiceShowcase from '@/components/landing/ArenaAndVoiceShowcase';
import InstitutionalTierMatrix from '@/components/landing/InstitutionalTierMatrix';
import GrandFinaleCta from '@/components/landing/GrandFinaleCta';
import '@/styles/landing.css';

function LandingContent() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const onStageMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rx = (-ny * 14).toFixed(2);
      const ry = (nx * 18).toFixed(2);
      el.style.setProperty('--rx', `${rx}deg`);
      el.style.setProperty('--ry', `${ry}deg`);
    });
  }, []);

  const onStageLeave = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  }, []);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'bot'; text: string; cta?: { label: string; href: string } }>>([
    {
      role: 'bot',
      text: "Hello! I'm your PinIT Career AI Mentor. Ask me anything about career roadmaps, tech tracks, or interview prep!"
    }
  ]);

  const handleSendChat = (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const userMsg = { role: 'user' as const, text: query };
    const qLower = query.toLowerCase();

    let botResponse = {
      role: 'bot' as const,
      text: "PinIT analyzes your real code submissions, mock interviews, and system designs to generate verifiable proof for recruiters. Get started by setting up your career profile!",
      cta: { label: 'Get Started Free', href: '/onboarding' }
    };

    if (qLower.includes('frontend') || qLower.includes('react')) {
      botResponse = {
        role: 'bot' as const,
        text: "For Modern Frontend Engineering: Master React 19 architecture, Next.js Server Components, state management, and Web Vitals optimization. PinIT features 30 hands-on daily quests for Frontend Engineers.",
        cta: { label: 'Build Frontend Roadmap', href: '/onboarding' }
      };
    } else if (qLower.includes('faang') || qLower.includes('interview') || qLower.includes('prepare')) {
      botResponse = {
        role: 'bot' as const,
        text: "Top-tier tech preparation requires 3 pillars: 1) Algorithmic crisis recovery in our live sandbox, 2) Distributed systems whiteboard design, and 3) 4-round AI mock interviews with real-time STAR verbal feedback and gaze tracking.",
        cta: { label: 'Try Free AI Mock Interview', href: '/login?redirect=/interview' }
      };
    } else if (qLower.includes('project') || qLower.includes('capstone') || qLower.includes('build')) {
      botResponse = {
        role: 'bot' as const,
        text: "Recruiters evaluate verifiable code proof over cookie-cutter apps. PinIT lets you build production capstones (Redis caching, distributed locks, microservices) with automated GitHub AST auditing.",
        cta: { label: 'Explore Capstones', href: '/login?redirect=/projects' }
      };
    }

    setChatMessages(prev => [...prev, userMsg, botResponse]);
    setChatInput('');
  };

  return (
    <div className="landing-page" style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* 1. UNIVERSAL SHARED NAVBAR */}
      <PublicNavbar />

      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* 2. HERO COCKPIT */}
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-left">
              <div className="badge-pill">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 10px #10B981' }}></span>
                <span>36 Tracks Live · 330+ Test Assertions</span>
              </div>
              
              <h1 className="hero-title">
                We don&apos;t help students find jobs.<br />
                We help them <span className="text-gradient">discover who they are.</span>
              </h1>
              
              <p className="hero-subtitle">
                PinIT Career OS is an AI-powered career intelligence platform that understands every student&apos;s unique strengths, cognitive style, technical skills, and verified potential — before they ever submit a resume.
              </p>
              
              <div className="hero-ctas">
                <Link href="/login?mode=signup" className="pc-btn-primary">Start free</Link>
                <Link href="/problem" className="pc-btn-outline">
                  Why we exist →
                </Link>
              </div>

              <ol className="hero-path">
                <li><span>01</span> Know yourself</li>
                <li><span>02</span> Build yourself</li>
                <li><span>03</span> Prove yourself</li>
                <li><span>04</span> Grow without limits</li>
              </ol>

              <div className="trust-section">
                <p className="trust-text">The future doesn&apos;t belong to people with degrees. It belongs to people who know where they fit.</p>
              </div>
            </div>

            {/* HERO RIGHT: 3D STAGE & KINETIC SHOCKWAVE LOGO */}
            <div className="hero-right">
              <div
                ref={stageRef}
                className="lp-stage"
                onMouseMove={onStageMove}
                onMouseLeave={onStageLeave}
              >
                <div className="lp-halo" aria-hidden />
                <div className="lp-rig">
                  <div className="lp-floor" aria-hidden />
                  <div className="lp-ring" aria-hidden />
                  <div className="lp-ring lp-ring-soft" aria-hidden />
                  
                  {/* CENTRAL LOGO (CLICK FOR KINETIC SHOCKWAVE PULSE) */}
                  <div
                    className="lp-logo"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = rect.left + rect.width / 2;
                      const y = rect.top + rect.height / 2;
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('pc_sky_shockwave', { detail: { x, y } }));
                      }
                    }}
                    title="Click to trigger kinetic pulse"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="lp-badge-official">
                      <img src="/brand/pinit-career-logo-clear.png" alt="PINIT CAREER" />
                    </div>
                  </div>

                  {/* 4 ORBITAL SATELLITE PILLS */}
                  <ul className="lp-terms">
                    <li>
                      <em>01</em> 🧬 Know yourself
                      <div className="lp-node-tooltip">
                        <span className="lp-node-tooltip-title">Phase 01 · Career DNA</span>
                        <p className="lp-node-tooltip-desc">
                          Multidimensional cognitive and technical vector mapping cognitive reflexes, patience, and domain affinity.
                        </p>
                      </div>
                    </li>
                    <li>
                      <em>02</em> ⚡ Build yourself
                      <div className="lp-node-tooltip">
                        <span className="lp-node-tooltip-title">Phase 02 · 1,080 S-Curve Days</span>
                        <p className="lp-node-tooltip-desc">
                          36 accredited roadmaps with 0 jargon and empathetic Socratic recovery ladders.
                        </p>
                      </div>
                    </li>
                    <li>
                      <em>03</em> 🛡️ Prove yourself
                      <div className="lp-node-tooltip">
                        <span className="lp-node-tooltip-title">Phase 03 · Skill Passport</span>
                        <p className="lp-node-tooltip-desc">
                          SHA-256 cryptographically hashed test assertions and audited pull requests.
                        </p>
                      </div>
                    </li>
                    <li>
                      <em>04</em> 🚀 Grow without limits
                      <div className="lp-node-tooltip">
                        <span className="lp-node-tooltip-title">Phase 04 · Direct Placement</span>
                        <p className="lp-node-tooltip-desc">
                          Direct corporate hiring pipeline based on verified proof of competence.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BRAND PROMISE TICKER */}
        <div className="brand-promise-section">
          <div className="marquee-track">
            <span className="marquee-item">✦ ZERO UNVERIFIED RESUMES</span>
            <span className="marquee-item">✦ 36 CAREER ROADMAPS</span>
            <span className="marquee-item">✦ 1,080 HANDCRAFTED DAYS</span>
            <span className="marquee-item">✦ 24/7 SOCRATIC AI MENTORS</span>
            <span className="marquee-item">✦ MULTIPLAYER CODE WARS</span>
            <span className="marquee-item">✦ VERIFIABLE SKILL PASSPORTS</span>
            <span className="marquee-item">✦ ZERO UNVERIFIED RESUMES</span>
            <span className="marquee-item">✦ 36 CAREER ROADMAPS</span>
          </div>
        </div>

        {/* 4. THE PARADIGM SHIFT: BROKEN OLD WAY VS PINIT CAREER OS */}
        <ComparisonSplit />

        {/* 5. ECOSYSTEM CONNECTIVITY: THREE WORLDS PORTAL */}
        <ThreeWorldsPortal />

        {/* 6. MASTER 36-COURSE BENTO GRID */}
        <CourseBentoMatrix />

        {/* 7. METHODICAL PROGRESSION: S-CURVE ROADMAP SCRUBBER */}
        <RoadmapSCurve />

        {/* 8. GAMIFIED ARENA & AI VOICE STUDIO */}
        <ArenaAndVoiceShowcase />

        {/* 9. 54 ECOSYSTEM MODULES HIGHLIGHTS */}
        <section id="modules" className="about-pillars-section section-padding alt-bg">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
              <div>
                <div className="tag-pill-sub">COMPLETE PLATFORM DIRECTORY</div>
                <h2 className="section-title-lg">54 Integrated Ecosystem Modules</h2>
                <p className="section-desc max-w-2xl" style={{ margin: '8px 0 0' }}>
                  A unified infrastructure powering student learning, cognitive focus, campus administration, and corporate hiring.
                </p>
              </div>
              <Link href="/modules" className="pc-btn-primary btn-sm">
                Browse Full 54 Modules Directory →
              </Link>
            </div>

            {/* 4 Core Pillars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🧠</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  1. AI-Powered Personalization
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Dynamic S-Curve roadmaps that adapt to progress, skill gaps, and target companies.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🔨</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  2. Skill-First Proof of Work
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Replacing text claims with audited test assertions, code commits, and verified capstones.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🌐</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  3. Ecosystem Connectivity
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Connecting Students, Faculty, Placement Cells, Enterprise Recruiters, and Parents.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>📈</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  4. Guaranteed Readiness
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Real-time 0-100% readiness score with 95%+ AI candidate-to-job matching precision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. HOW STUDENTS GAIN */}
        <section id="how-it-works" className="how-gain-section section-padding">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
              <div>
                <div className="tag-pill-sub">PEDAGOGICAL METHOD</div>
                <h2 className="section-title-lg">How Students Gain from PinIT Career</h2>
              </div>
              <Link href="/how-it-works" className="pc-btn-outline btn-sm">
                Explore The S-Curve Method →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🗺️</div>
                <h3>Personalized AI Roadmaps</h3>
                <p>AI creates your unique roadmap based on your goals, college, and target companies.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>👩‍🏫</div>
                <h3>Learn with AI Mentor</h3>
                <p>24/7 spoken tutoring with 0 jargon and empathetic 3-step recovery ladders.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>💻</div>
                <h3>Build Real Projects</h3>
                <p>Build enterprise systems, collaborate with peers, and deploy audited capstones.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚔️</div>
                <h3>Compete &amp; Rank</h3>
                <p>Climb global Elo leaderboards in Code Wars and weekly hackathons.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>👥</div>
                <h3>Peer Communities</h3>
                <p>Study groups, voice rooms, and multi-avatar AI group discussions.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚀</div>
                <h3>Get Discovered</h3>
                <p>Companies find you based on verified code execution and skill passports.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. TRANSPARENT PRICING & TIER MATRIX */}
        <InstitutionalTierMatrix />

        {/* 12. FINAL GRAND CTA */}
        <GrandFinaleCta />

      </main>

      {/* 13. UNIVERSAL FOOTER */}
      <PublicFooter />

      {/* FLOATING CHAT WIDGET */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
        {isChatOpen && (
          <div style={{
            position: 'absolute',
            bottom: 60,
            right: 0,
            width: 360,
            maxHeight: 520,
            height: '75vh',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: 'var(--text)'
          }}>
            {/* Header */}
            <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>PinIT Career AI Mentor</div>
                  <div style={{ fontSize: 10, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                    Live Guidance Ready
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 16, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.06)',
                    color: 'var(--text)',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)'
                  }}>
                    {msg.text}
                  </div>
                  {msg.cta && (
                    <Link
                      href={msg.cta.href}
                      style={{
                        display: 'inline-block',
                        marginTop: 6,
                        padding: '6px 12px',
                        background: 'rgba(var(--success-rgb), 0.15)',
                        border: '1px solid rgba(var(--success-rgb), 0.3)',
                        borderRadius: 6,
                        color: 'var(--success)',
                        fontSize: 11,
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      {msg.cta.label} ➔
                    </Link>
                  )}
                </div>
              ))}

              {/* Quick Prompt Chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>Quick Questions</div>
                {[
                  'Create a frontend roadmap',
                  'How do I prepare for FAANG?',
                  'What projects should I build?'
                ].map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSendChat(q)}
                    style={{
                      textAlign: 'left',
                      padding: '6px 10px',
                      background: 'rgba(var(--info-rgb), 0.08)',
                      border: '1px solid rgba(var(--info-rgb), 0.2)',
                      borderRadius: 6,
                      color: '#93c5fd',
                      fontSize: 11.5,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Footer */}
            <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Ask about roadmaps, tracks, interview..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: 'var(--text)',
                  fontSize: 12
                }}
              />
              <button
                onClick={() => handleSendChat()}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  border: 'none',
                  borderRadius: 8,
                  width: 36,
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ➔
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            border: 'none',
            boxShadow: '0 8px 24px rgba(var(--info-rgb), 0.4)',
            color: 'var(--text)',
            fontSize: 22,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease'
          }}
          title={isChatOpen ? 'Close Chat' : 'Open Career AI Mentor'}
        >
          {isChatOpen ? '✕' : '🤖'}
        </button>
      </div>
    </div>
  );
}

export default function PinitCareerLanding() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: 'var(--bg-primary)' }} />}>
      <LandingContent />
    </Suspense>
  );
}
