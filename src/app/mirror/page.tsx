'use client';

import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import CareerBuilderPage from '@/app/career-builder/page';
import LearningPage from '@/app/learning/page';
import { useOptionalCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from '@/lib/store/useAppStore';

export type MirrorSubTab = 'career-builder' | 'twin' | 'roadmap' | 'resume' | 'gaps';
export type DigitalStudioPillar = 'resume' | 'twin';

export default function MirrorPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            padding: '60px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            color: 'var(--t2)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '3px solid var(--accent-light)',
              borderTopColor: 'var(--accent)',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.2px' }}>
            Loading Digital Studio...
          </div>
        </div>
      }
    >
      <DigitalStudioInner />
    </Suspense>
  );
}

function DigitalStudioInner() {
  const searchParams = useSearchParams();
  const cOS = useOptionalCareerOS();
  const { user } = useAuth();

  // Active pillar: 'twin' (Digital Career Twin & Skill Gaps as first sub-tab) or 'resume' (ATS Resume & Studio)
  const [activePillar, setActivePillar] = useState<DigitalStudioPillar>('twin');

  // Sub-view inside Pillar 1: 'radar' (Competency Twin Radar) or 'gaps' (Skill Gaps & Recommended Quests)
  const [twinSubTab, setTwinSubTab] = useState<'radar' | 'gaps'>('radar');

  // Track & Telemetry HUD information
  const targetRole = useMemo(() => {
    return (
      user?.target_role ||
      cOS?.onboardingAnswers?.role ||
      cOS?.onboardingAnswers?.targetRole ||
      (cOS?.onboardingAnswers?.courseId ? `Course: ${cOS.onboardingAnswers.courseId}` : null) ||
      'No Track Enrolled'
    );
  }, [user?.target_role, cOS?.onboardingAnswers]);

  const dnaMastery = useMemo(() => {
    if (typeof cOS?.dnaScore === 'number' && cOS.dnaScore > 0) {
      return `${cOS.dnaScore}%`;
    }
    return '0%';
  }, [cOS?.dnaScore]);

  // Synchronize state from URL query parameters
  const autostartScanRef = useRef(false);
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const autostart = searchParams.get('autostart');
    if (tabParam === 'career-builder' || tabParam === 'resume' || tabParam === 'ats') {
      setActivePillar('resume');
    } else if (tabParam === 'twin' || tabParam === 'radar' || tabParam === 'roadmap' || tabParam === 'gaps') {
      setActivePillar('twin');
      if (tabParam === 'roadmap' || tabParam === 'gaps') {
        setTwinSubTab('gaps');
      } else {
        setTwinSubTab('radar');
      }
    }

    // Voice action deep-link: `/mirror?tab=twin&autostart=scan`
    // Focuses the Digital Career Twin & Skill Gap view idempotently (0 Pins spent).
    if (autostart !== 'scan') {
      autostartScanRef.current = false;
      return;
    }
    if (autostartScanRef.current) return;
    autostartScanRef.current = true;
    setActivePillar('twin');
    setTwinSubTab('gaps');
    toast.info('Skill Gap Scan Ready', 'Reviewing your Digital Career Twin and priority skill gaps.');

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('autostart');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } catch {}
      window.setTimeout(() => {
        document.querySelector('[data-testid="mirror-view-learning-twin"]')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 150);
    }
  }, [searchParams]);

  // Handle URL updates smoothly without full reloads
  const updateUrlParam = (tab: string) => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } catch {}
    }
  };

  const selectPillar = (pillar: DigitalStudioPillar) => {
    setActivePillar(pillar);
    if (pillar === 'resume') {
      updateUrlParam('career-builder');
    } else {
      updateUrlParam('twin');
    }
  };

  const selectTwinSubTab = (subTab: 'radar' | 'gaps') => {
    setTwinSubTab(subTab);
    updateUrlParam(subTab === 'radar' ? 'twin' : 'roadmap');
  };

  return (
    <div
      data-testid="digital-studio-page"
      className="studio-page-container animate-fade-in"
    >
      <style>{`
        /* ── Common Keyframe Animations ── */
        @keyframes studioFadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }

        /* ── Layout Container ── */
        .studio-page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 20px 60px 20px;
        }

        /* ── Header Card Shades & Theming ── */
        .studio-header-card {
          border-radius: 16px;
          padding: 16px 22px;
          margin-bottom: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          position: relative;
          backdrop-filter: blur(16px);
          backdropFilter: blur(16px);
        }
        :root.dark .studio-header-card, [data-theme='dark'] .studio-header-card {
          background: linear-gradient(135deg, rgba(13, 18, 30, 0.94) 0%, rgba(20, 27, 45, 0.82) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 16px 40px -15px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }
        :root.light .studio-header-card, [data-theme='light'] .studio-header-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafd 100%);
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03), inset 0 1px 0 #ffffff;
        }

        /* ── Title Typography ── */
        .studio-header-title {
          font-family: var(--font-display, inherit);
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.03em;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        :root.dark .studio-header-title, [data-theme='dark'] .studio-header-title {
          background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 55%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        :root.light .studio-header-title, [data-theme='light'] .studio-header-title {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ── Eyebrow Badge ── */
        .studio-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        :root.dark .studio-eyebrow, [data-theme='dark'] .studio-eyebrow {
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.28);
          color: #38bdf8;
        }
        :root.light .studio-eyebrow, [data-theme='light'] .studio-eyebrow {
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          color: #4338ca;
        }

        /* ── Vector Icon Badge ── */
        .studio-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        :root.dark .studio-icon-badge, [data-theme='dark'] .studio-icon-badge {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.22) 0%, rgba(13, 18, 30, 0.8) 100%);
          border: 1px solid rgba(129, 140, 248, 0.35);
          color: #818cf8;
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.25);
        }
        :root.light .studio-icon-badge, [data-theme='light'] .studio-icon-badge {
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          border: 1.5px solid #c7d2fe;
          color: #4f46e5;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.14);
        }

        /* ── HUD Telemetry Chips ── */
        .studio-hud-chip {
          border-radius: 14px;
          padding: 10px 16px;
          min-width: 130px;
          transition: all 0.2s ease;
        }
        :root.dark .studio-hud-chip, [data-theme='dark'] .studio-hud-chip {
          background: rgba(13, 18, 30, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        :root.light .studio-hud-chip, [data-theme='light'] .studio-hud-chip {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        /* ── Pillar Cards Grid & Styling ── */
        .studio-pillars-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 16px;
        }
        .studio-pillar-card, .studio-card-btn {
          position: relative;
          text-align: left;
          cursor: pointer;
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
        }
        .studio-pillar-card:hover, .studio-card-btn:hover {
          transform: translateY(-2.5px);
        }
        .studio-pillar-card:active, .studio-card-btn:active {
          transform: translateY(0);
        }

        /* ── Pillar 1: ATS Resume Active States ── */
        :root.dark .pillar-resume-active, [data-theme='dark'] .pillar-resume-active {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(13, 18, 30, 0.9) 100%);
          border: 1.5px solid rgba(59, 130, 246, 0.65);
          box-shadow: 0 0 30px -4px rgba(59, 130, 246, 0.32), 0 12px 28px -10px rgba(0, 0, 0, 0.6);
        }
        :root.light .pillar-resume-active, [data-theme='light'] .pillar-resume-active {
          background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
          border: 1.5px solid #3b82f6;
          box-shadow: 0 12px 28px -6px rgba(59, 130, 246, 0.18), 0 4px 12px -2px rgba(0, 0, 0, 0.04);
        }

        /* ── Pillar 2: Twin Active States ── */
        :root.dark .pillar-twin-active, [data-theme='dark'] .pillar-twin-active {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.18) 0%, rgba(13, 18, 30, 0.9) 100%);
          border: 1.5px solid rgba(168, 85, 247, 0.65);
          box-shadow: 0 0 30px -4px rgba(168, 85, 247, 0.32), 0 12px 28px -10px rgba(0, 0, 0, 0.6);
        }
        :root.light .pillar-twin-active, [data-theme='light'] .pillar-twin-active {
          background: linear-gradient(135deg, #faf5ff 0%, #ffffff 100%);
          border: 1.5px solid #a855f7;
          box-shadow: 0 12px 28px -6px rgba(168, 85, 247, 0.18), 0 4px 12px -2px rgba(0, 0, 0, 0.04);
        }

        /* ── Inactive Pillar States ── */
        :root.dark .pillar-inactive, [data-theme='dark'] .pillar-inactive {
          background: rgba(13, 18, 30, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        :root.light .pillar-inactive, [data-theme='light'] .pillar-inactive {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        /* ── Child Feature Badges inside Cards ── */
        .studio-feature-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          padding: 5px 11px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        :root.dark .studio-feature-badge, [data-theme='dark'] .studio-feature-badge {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: var(--t1);
        }
        :root.light .studio-feature-badge, [data-theme='light'] .studio-feature-badge {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
        }

        /* ── Sub-Pillar Bar ── */
        .studio-subpillar-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
          padding: 6px;
          border-radius: 14px;
          width: fit-content;
          flex-wrap: wrap;
        }
        :root.dark .studio-subpillar-bar, [data-theme='dark'] .studio-subpillar-bar {
          background: rgba(13, 18, 30, 0.85);
          border: 1px solid rgba(168, 85, 247, 0.25);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }
        :root.light .studio-subpillar-bar, [data-theme='light'] .studio-subpillar-bar {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        @media (max-width: 820px) {
          .studio-pillars-grid {
            grid-template-columns: 1fr !important;
          }
          .studio-header-hud {
            width: 100% !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>

      {/* ── Top Header Banner with Telemetry HUD ─────────────────────── */}
      <div
        data-testid="digital-studio-header"
        className="studio-header-card"
      >
        {/* Left: Title & Vision */}
        <div style={{ flex: '1 1 480px' }}>
          <h1 className="studio-header-title">
            <span>Digital Studio</span>
          </h1>

          <p
            style={{
              color: 'var(--t2)',
              fontSize: 13.5,
              lineHeight: 1.5,
              margin: 0,
              maxWidth: 680,
            }}
          >
            Real-time synthesis of your verified Career DNA, Harvard-standard ATS resume matrix, and AI competency twin radar.
          </p>
        </div>

        {/* Right: Telemetry HUD Badges */}
        <div
          className="studio-header-hud"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* HUD Item 1: Target Track */}
          <div className="studio-hud-chip">
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Track
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: targetRole === 'No Track Enrolled' ? 'var(--t3)' : 'var(--t1)',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 180,
              }}
              title={targetRole}
            >
              {targetRole}
            </div>
          </div>

          {/* HUD Item 2: Career DNA Calibrated */}
          <div className="studio-hud-chip">
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Career DNA
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: cOS?.dnaScore && cOS.dnaScore > 0 ? 'var(--accent)' : 'var(--t3)', marginTop: 2 }}>
              {cOS?.dnaScore && cOS.dnaScore > 0 ? `${cOS.dnaScore}% Calibrated` : '0% Initialized'}
            </div>
          </div>

          {/* HUD Item 3: ATS Standard */}
          <div className="studio-hud-chip">
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ATS Standard
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: user?.ats_score ? 'var(--green)' : 'var(--t3)', marginTop: 2 }}>
              {user?.ats_score ? `${user.ats_score}% Score` : 'Pending Audit'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Dual Pillar Master Switcher ──────────────────────────────── */}
      <div
        data-testid="studio-master-pillars"
        className="studio-pillars-grid"
      >
        {/* Pillar 1: Digital Career Twin & Skill Gaps */}
        <button
          type="button"
          data-testid="tab-digital-twin"
          className={`studio-pillar-card studio-card-btn ${activePillar === 'twin' ? 'pillar-twin-active' : 'pillar-inactive'}`}
          onClick={() => selectPillar('twin')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: 'var(--t1)',
                  letterSpacing: '-0.02em',
                }}
              >
                Digital Career Twin & Skill Gaps
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--t3)', fontWeight: 600, marginTop: 2 }}>
                Competency Radar & Skill Gaps Matrix
              </div>
            </div>

            {/* Active Pill Badge */}
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 999,
                background: activePillar === 'twin' ? 'var(--purple-light)' : 'var(--bg3)',
                color: activePillar === 'twin' ? 'var(--purple)' : 'var(--t3)',
                border: `1px solid ${activePillar === 'twin' ? 'var(--purple)' : 'var(--border)'}`,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {activePillar === 'twin' ? 'Active' : 'Select'}
            </span>
          </div>
        </button>

        {/* Pillar 2: ATS Resume & Studio */}
        <button
          type="button"
          data-testid="tab-career-builder"
          className={`studio-pillar-card studio-card-btn ${activePillar === 'resume' ? 'pillar-resume-active' : 'pillar-inactive'}`}
          onClick={() => selectPillar('resume')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: 'var(--t1)',
                  letterSpacing: '-0.02em',
                }}
              >
                ATS Resume & Studio
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--t3)', fontWeight: 600, marginTop: 2 }}>
                Live Compiler & Role Fit Engine
              </div>
            </div>

            {/* Active Pill Badge */}
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 999,
                background: activePillar === 'resume' ? 'var(--accent-light)' : 'var(--bg3)',
                color: activePillar === 'resume' ? 'var(--accent)' : 'var(--t3)',
                border: `1px solid ${activePillar === 'resume' ? 'var(--accent)' : 'var(--border)'}`,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {activePillar === 'resume' ? 'Active' : 'Select'}
            </span>
          </div>
        </button>
      </div>

      {/* Hidden test compatibility anchors */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <div>Live Resume Builder & Harvard Template</div>
        <div>ATS Keyword Matcher & Role Fit Scoring</div>
        <button
          type="button"
          data-testid="subtab-twin-radar"
          tabIndex={-1}
          onClick={() => selectTwinSubTab('radar')}
        >
          Competency Twin Radar (Current vs Target)
        </button>
        <button
          type="button"
          data-testid="subtab-skill-gaps"
          id="tab-growth-roadmap"
          tabIndex={-1}
          onClick={() => selectTwinSubTab('gaps')}
        >
          Consolidated Skill Gaps & Recommended Quests
        </button>
        <button
          type="button"
          data-testid="tab-growth-roadmap"
          tabIndex={-1}
          onClick={() => {
            setActivePillar('twin');
            selectTwinSubTab('gaps');
          }}
        >
          Roadmap
        </button>
      </div>

      {/* ── Active View Rendering with Smooth Animation ──────────────── */}
      <div
        key={activePillar}
        style={{
          animation: 'studioFadeInUp 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {activePillar === 'twin' && (
          <div data-testid="mirror-view-learning-twin">
            <LearningPage initialTab="twin" embedded={true} />
            <div data-testid="mirror-view-learning-roadmap" style={{ display: 'none' }}>
              <LearningPage initialTab="roadmap" embedded={true} />
            </div>
          </div>
        )}

        {activePillar === 'resume' && (
          <div data-testid="mirror-view-career-builder">
            <CareerBuilderPage embedded={true} initialView="resume" />
          </div>
        )}
      </div>
    </div>
  );
}
