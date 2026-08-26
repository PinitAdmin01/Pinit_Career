'use client';

import React, { useState, useRef, type CSSProperties, type MouseEvent } from 'react';

interface HeroCockpitProps {
  onOpenLogin: (role?: 'student' | 'teacher' | 'admin' | 'recruiter') => void;
  onExploreCourses: () => void;
}

export default function HeroCockpit({ onOpenLogin, onExploreCourses }: HeroCockpitProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onStageMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: +(py * -14).toFixed(2), y: +(px * 16).toFixed(2) });
  };

  return (
    <section className="hero-section section-padding">
      <div className="container hero-grid">
        
        {/* Left: Value Proposition */}
        <div className="hero-left">
          <div className="badge-pill">Discover · Connect · Grow</div>
          <h1 className="hero-title">
            We don&apos;t help students find jobs.<br />
            We help them <span className="text-gradient">discover who they are.</span>
          </h1>
          <p className="hero-subtitle">
            PinitCareer is an AI-powered career intelligence platform that understands every student&apos;s unique strength, interests, personality, skills, and potential — before they ever submit a resume.
          </p>
          <div className="hero-ctas">
            <button type="button" className="pc-btn-primary" onClick={() => onOpenLogin('student')}>
              Start free
            </button>
            <button type="button" className="pc-btn-outline" onClick={onExploreCourses}>
              Explore 36 Tracks
            </button>
          </div>
          <ol className="hero-path">
            <li><span>01</span> Know yourself</li>
            <li><span>02</span> Build yourself</li>
            <li><span>03</span> Prove yourself</li>
            <li><span>04</span> Grow without limits</li>
          </ol>
          <div className="trust-section">
            <p className="trust-text">
              The future doesn&apos;t belong to people with degrees. It belongs to people who know where they fit.
            </p>
          </div>
        </div>

        {/* Right: 3D Logo Rig & Orbital Nodes */}
        <div className="hero-right">
          <div
            ref={stageRef}
            className="lp-stage"
            onMouseMove={onStageMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ '--rx': `${tilt.x}deg`, '--ry': `${tilt.y}deg` } as CSSProperties}
          >
            <div className="lp-halo" aria-hidden />
            <div className="lp-rig">
              <div className="lp-floor" aria-hidden />
              <div className="lp-ring" aria-hidden />
              <div className="lp-ring lp-ring-soft" aria-hidden />
              <div className="lp-logo">
                <div className="lp-badge lp-badge-official">
                  <img src="/brand/pinit-career-logo-clear.png" alt="PINIT CAREER" />
                </div>
              </div>
              <ul className="lp-terms">
                <li><em>01</em> Know yourself</li>
                <li><em>02</em> Build yourself</li>
                <li><em>03</em> Prove yourself</li>
                <li><em>04</em> Grow</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
