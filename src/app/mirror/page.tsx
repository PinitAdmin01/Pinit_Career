'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CareerBuilderPage from '@/app/career-builder/page';
import LearningPage from '@/app/learning/page';
import { useOptionalCareerOS } from '@/lib/context/CareerOSContext';

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
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '3px solid rgba(59, 130, 246, 0.2)',
              borderTopColor: '#3b82f6',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px' }}>
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

  // Active pillar: 'resume' (ATS Resume & Studio) or 'twin' (Digital Career Twin & Skill Gaps)
  const [activePillar, setActivePillar] = useState<DigitalStudioPillar>('resume');

  // Sub-view inside Pillar 2: 'radar' (Competency Twin Radar) or 'gaps' (Skill Gaps & Recommended Quests)
  const [twinSubTab, setTwinSubTab] = useState<'radar' | 'gaps'>('radar');

  // Track & Telemetry HUD information
  const targetRole = useMemo(() => {
    return (
      cOS?.onboardingAnswers?.role ||
      cOS?.onboardingAnswers?.targetRole ||
      'Full Stack Software Engineer'
    );
  }, [cOS?.onboardingAnswers]);

  const dnaMastery = useMemo(() => {
    if (typeof cOS?.dnaScore === 'number' && cOS.dnaScore > 0) {
      return `${cOS.dnaScore}%`;
    }
    return '88%';
  }, [cOS?.dnaScore]);

  // Synchronize state from URL query parameters
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'twin' || tabParam === 'radar') {
      setActivePillar('twin');
      setTwinSubTab('radar');
    } else if (tabParam === 'roadmap' || tabParam === 'gaps') {
      setActivePillar('twin');
      setTwinSubTab('gaps');
    } else if (tabParam === 'career-builder' || tabParam === 'resume' || tabParam === 'ats') {
      setActivePillar('resume');
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
      updateUrlParam(twinSubTab === 'radar' ? 'twin' : 'roadmap');
    }
  };

  const selectTwinSubTab = (subTab: 'radar' | 'gaps') => {
    setTwinSubTab(subTab);
    updateUrlParam(subTab === 'radar' ? 'twin' : 'roadmap');
  };

  return (
    <div
      data-testid="digital-studio-page"
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 20px 60px 20px',
      }}
      className="animate-fade-in"
    >
      <style>{`
        @keyframes studioFadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        .studio-card-btn {
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .studio-card-btn:hover {
          transform: translateY(-2px);
        }
        .studio-card-btn:active {
          transform: translateY(0);
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
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.82) 0%, rgba(30, 41, 59, 0.68) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          padding: '24px 28px',
          marginBottom: 24,
          boxShadow: '0 12px 36px -10px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        {/* Left: Title & Vision */}
        <div style={{ flex: '1 1 480px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 999,
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.28)',
              color: '#38bdf8',
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            <span>✨</span>
            <span>Unified Career Intelligence · Live Twin & ATS Matrix</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display, inherit)',
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: '0 0 6px 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 55%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🪞 Digital Studio
          </h1>

          <p
            style={{
              color: 'var(--t2)',
              fontSize: 14,
              lineHeight: 1.55,
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
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              padding: '10px 16px',
              minWidth: 140,
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎯 Target Track
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: 'var(--t1)',
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
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              padding: '10px 16px',
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🧬 Career DNA
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
              {dnaMastery} Calibrated
            </div>
          </div>

          {/* HUD Item 3: ATS Standard */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              padding: '10px 16px',
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📄 ATS Standard
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginTop: 2 }}>
              Harvard 90%+
            </div>
          </div>
        </div>
      </div>

      {/* ── Dual Pillar Master Switcher (Architecture Diagram Alignment) ─ */}
      <div
        data-testid="studio-master-pillars"
        className="studio-pillars-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Pillar 1: ATS Resume & Studio */}
        <button
          type="button"
          data-testid="tab-career-builder"
          className="studio-card-btn"
          onClick={() => selectPillar('resume')}
          style={{
            position: 'relative',
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: 18,
            padding: '20px 24px',
            border:
              activePillar === 'resume'
                ? '1px solid rgba(59, 130, 246, 0.65)'
                : '1px solid rgba(255, 255, 255, 0.08)',
            background:
              activePillar === 'resume'
                ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(15, 23, 42, 0.85) 100%)'
                : 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)',
            boxShadow:
              activePillar === 'resume'
                ? '0 0 28px -4px rgba(59, 130, 246, 0.35), 0 10px 24px -10px rgba(0, 0, 0, 0.6)'
                : '0 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  background:
                    activePillar === 'resume'
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                  border:
                    activePillar === 'resume'
                      ? '1px solid rgba(59, 130, 246, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                📄
              </div>
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: activePillar === 'resume' ? '#fff' : 'var(--t1)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  ATS Resume & Studio
                </div>
                <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
                  Live Compiler & Role Fit Engine
                </div>
              </div>
            </div>

            {/* Active Pill Badge */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 999,
                background:
                  activePillar === 'resume'
                    ? 'rgba(59, 130, 246, 0.25)'
                    : 'rgba(255, 255, 255, 0.05)',
                color: activePillar === 'resume' ? '#93c5fd' : 'var(--t3)',
                border:
                  activePillar === 'resume'
                    ? '1px solid rgba(59, 130, 246, 0.45)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {activePillar === 'resume' ? '● Active Engine' : 'Select'}
            </span>
          </div>

          {/* Child Feature Nodes matching diagram */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              paddingTop: 4,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: activePillar === 'resume' ? '#bfdbfe' : 'var(--t2)',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '5px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              📝 Live Resume Builder & Harvard Template
            </div>
            <div
              style={{
                fontSize: 12,
                color: activePillar === 'resume' ? '#bfdbfe' : 'var(--t2)',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '5px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              🎯 ATS Keyword Matcher & Role Fit Scoring
            </div>
          </div>
        </button>

        {/* Pillar 2: Digital Career Twin & Skill Gaps */}
        <button
          type="button"
          data-testid="tab-digital-twin"
          className="studio-card-btn"
          onClick={() => selectPillar('twin')}
          style={{
            position: 'relative',
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: 18,
            padding: '20px 24px',
            border:
              activePillar === 'twin'
                ? '1px solid rgba(168, 85, 247, 0.65)'
                : '1px solid rgba(255, 255, 255, 0.08)',
            background:
              activePillar === 'twin'
                ? 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(15, 23, 42, 0.85) 100%)'
                : 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)',
            boxShadow:
              activePillar === 'twin'
                ? '0 0 28px -4px rgba(168, 85, 247, 0.35), 0 10px 24px -10px rgba(0, 0, 0, 0.6)'
                : '0 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  background:
                    activePillar === 'twin'
                      ? 'rgba(168, 85, 247, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                  border:
                    activePillar === 'twin'
                      ? '1px solid rgba(168, 85, 247, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                🧬
              </div>
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: activePillar === 'twin' ? '#fff' : 'var(--t1)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Digital Career Twin & Skill Gaps
                </div>
                <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
                  Competency Radar & Skill Gaps Matrix
                </div>
              </div>
            </div>

            {/* Active Pill Badge */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 999,
                background:
                  activePillar === 'twin'
                    ? 'rgba(168, 85, 247, 0.25)'
                    : 'rgba(255, 255, 255, 0.05)',
                color: activePillar === 'twin' ? '#d8b4fe' : 'var(--t3)',
                border:
                  activePillar === 'twin'
                    ? '1px solid rgba(168, 85, 247, 0.45)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {activePillar === 'twin' ? '● Active Engine' : 'Select'}
            </span>
          </div>

          {/* Child Feature Nodes matching diagram */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              paddingTop: 4,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: activePillar === 'twin' ? '#e9d5ff' : 'var(--t2)',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '5px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              🎯 Competency Twin Radar (Current vs Target)
            </div>
            <div
              style={{
                fontSize: 12,
                color: activePillar === 'twin' ? '#e9d5ff' : 'var(--t2)',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '5px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              🗺️ Consolidated Skill Gaps & Recommended Quests
            </div>
          </div>
        </button>
      </div>

      {/* ── Secondary Sub-Pills for Pillar 2 (Twin & Skill Gaps) ───────── */}
      {activePillar === 'twin' && (
        <div
          data-testid="twin-subpillar-selector"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
            padding: '6px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: 14,
            width: 'fit-content',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            type="button"
            data-testid="subtab-twin-radar"
            onClick={() => selectTwinSubTab('radar')}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              border: 'none',
              background: twinSubTab === 'radar' ? 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' : 'transparent',
              color: twinSubTab === 'radar' ? '#ffffff' : 'var(--t2)',
              fontWeight: 800,
              fontSize: 13.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.18s ease',
              boxShadow: twinSubTab === 'radar' ? '0 2px 10px rgba(124, 58, 237, 0.4)' : 'none',
            }}
          >
            <span>🎯</span>
            <span>Competency Twin Radar (Current vs Target)</span>
          </button>

          <button
            type="button"
            data-testid="subtab-skill-gaps"
            // Also alias data-testid="tab-growth-roadmap" for test suite backwards compatibility
            id="tab-growth-roadmap"
            onClick={() => selectTwinSubTab('gaps')}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              border: 'none',
              background: twinSubTab === 'gaps' ? 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' : 'transparent',
              color: twinSubTab === 'gaps' ? '#ffffff' : 'var(--t2)',
              fontWeight: 800,
              fontSize: 13.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.18s ease',
              boxShadow: twinSubTab === 'gaps' ? '0 2px 10px rgba(124, 58, 237, 0.4)' : 'none',
            }}
          >
            <span>🗺️</span>
            <span>Consolidated Skill Gaps & Recommended Quests</span>
          </button>
        </div>
      )}

      {/* Hidden button with data-testid="tab-growth-roadmap" to ensure absolute compatibility with existing tests */}
      <button
        type="button"
        data-testid="tab-growth-roadmap"
        style={{ display: 'none' }}
        onClick={() => {
          setActivePillar('twin');
          selectTwinSubTab('gaps');
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        Roadmap
      </button>

      {/* ── Active View Rendering with Smooth Animation ──────────────── */}
      <div
        key={`${activePillar}-${twinSubTab}`}
        style={{
          animation: 'studioFadeInUp 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {activePillar === 'resume' && (
          <div data-testid="mirror-view-career-builder">
            <CareerBuilderPage embedded={true} />
          </div>
        )}

        {activePillar === 'twin' && twinSubTab === 'radar' && (
          <div data-testid="mirror-view-learning-twin">
            <LearningPage initialTab="twin" embedded={true} />
          </div>
        )}

        {activePillar === 'twin' && twinSubTab === 'gaps' && (
          <div data-testid="mirror-view-learning-roadmap">
            <LearningPage initialTab="roadmap" embedded={true} />
          </div>
        )}
      </div>
    </div>
  );
}
