'use client';

import React, { useState } from 'react';
import { CRASH_COURSE_PLANS, CrashPlan, INTERNSHIP_AVAILABLE } from '@/lib/data/crashPlansData';
import { toast } from '@/lib/store/useAppStore';
import EnhancedCrashCoursePlanCard from './EnhancedCrashCoursePlanCard';
import CredentialPreviewModal from './CredentialPreviewModal';

interface CrashCoursePlanCardsProps {
  currentPlanId?: string;
  onSelectPlan: (planId: string, track: 'web_fullstack' | 'python_ai', courseIdToActivate: string) => void;
  onOpenStandaloneCatalog: () => void;
  onOpenPracticeReport?: (testTitle: string) => void;
  onOpenCheckout?: (plan: CrashPlan, track: 'web_fullstack' | 'python_ai') => void;
  userPins?: number;
}

export const CrashCoursePlanCards: React.FC<CrashCoursePlanCardsProps> = ({
  currentPlanId,
  onSelectPlan,
  onOpenStandaloneCatalog,
  onOpenPracticeReport,
  onOpenCheckout,
  userPins = 100,
}) => {
  const [activeTrack, setActiveTrack] = useState<'web_fullstack' | 'python_ai'>('web_fullstack');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<CrashPlan | null>(null);

  const handleEnroll = (plan: CrashPlan) => {
    // Option 1: Module-specific entry course -> Option 2 (Fallback): Default track entry course
    const modules = plan?.modulesByTrack?.[activeTrack] || [];
    const firstCourseId =
      modules[0]?.courseId ||
      (activeTrack === 'web_fullstack' ? 'course-react-web' : 'course-python');

    try {
      onSelectPlan(plan.id, activeTrack, firstCourseId);
      if (onOpenCheckout) {
        // Option 1 (Primary): Interactive checkout modal
        onOpenCheckout(plan, activeTrack);
      } else {
        // Option 2 (Fallback): Direct state activation with toast
        toast.success(
          'Plan Selected!',
          `Enrolled in ${plan.title} (${activeTrack === 'web_fullstack' ? 'Full-Stack Web' : 'Python & AI'}). All curriculum roadmap nodes unlocked!`
        );
      }
    } catch {
      // Option 2 (Safe emergency fallback)
      toast.info('Plan Selected', `Enrolled in ${plan?.title || 'Program'}.`);
    }
  };

  return (
    <div data-testid="crash-plan-cards-root" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* ── Top Header & Domain Switcher ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          padding: '18px 22px',
          background: 'linear-gradient(135deg, var(--card) 0%, var(--bg3) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ maxWidth: 660 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span>🏆</span> ISO-ALIGNED INDUSTRIAL ACCREDITATION
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24 }}>⚡</span>
              <h3
                style={{
                  fontSize: 19,
                  fontWeight: 900,
                  color: 'var(--t1)',
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.3px',
                }}
              >
                {INTERNSHIP_AVAILABLE
                  ? 'Industry Crash Certification & Real-Time Internship Programs'
                  : 'Industry Crash Certification Programs'}
              </h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--t2)', margin: '6px 0 0 0', lineHeight: 1.45 }}>
              {INTERNSHIP_AVAILABLE
                ? 'Daily 1-Hour micro-learning, production capstone sprint, PinIT Tech Labs fellowship, and dual tamper-proof credentials.'
                : 'Daily 1-Hour micro-learning, production capstone sprint, and a cryptographically verified certificate.'}
            </p>
          </div>

          {/* Track Selector Controls */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: 4,
              borderRadius: 12,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              data-testid="btn-track-web"
              onClick={() => setActiveTrack('web_fullstack')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                border: `1.5px solid ${activeTrack === 'web_fullstack' ? 'var(--accent)' : 'transparent'}`,
                background: activeTrack === 'web_fullstack'
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(99,102,241,0.12))'
                  : 'transparent',
                color: activeTrack === 'web_fullstack' ? 'var(--t1)' : 'var(--t2)',
                boxShadow: activeTrack === 'web_fullstack' ? '0 3px 12px rgba(99,102,241,0.3)' : 'none',
                transition: 'all 0.18s ease',
              }}
            >
              <span>🌐</span>
              <span>Full-Stack Web Development</span>
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: activeTrack === 'web_fullstack' ? 'var(--accent)' : 'var(--bg3)',
                  color: activeTrack === 'web_fullstack' ? 'var(--t1)' : 'var(--t2)',
                  fontWeight: 800,
                }}
              >
                Option 1
              </span>
            </button>

            <button
              type="button"
              data-testid="btn-track-python"
              onClick={() => setActiveTrack('python_ai')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                border: `1.5px solid ${activeTrack === 'python_ai' ? 'var(--green)' : 'transparent'}`,
                background: activeTrack === 'python_ai'
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.22), rgba(16,185,129,0.12))'
                  : 'transparent',
                color: activeTrack === 'python_ai' ? 'var(--t1)' : 'var(--t2)',
                boxShadow: activeTrack === 'python_ai' ? '0 3px 12px rgba(16,185,129,0.3)' : 'none',
                transition: 'all 0.18s ease',
              }}
            >
              <span>🐍</span>
              <span>Python & Data Engineering</span>
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: activeTrack === 'python_ai' ? 'var(--green)' : 'var(--bg3)',
                  color: activeTrack === 'python_ai' ? 'var(--t1)' : 'var(--t2)',
                  fontWeight: 800,
                }}
              >
                Option 2
              </span>
            </button>

            <button
              type="button"
              data-testid="btn-open-36-courses"
              onClick={onOpenStandaloneCatalog}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 13px',
                borderRadius: 9,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid var(--border)',
                background: 'var(--bg2)',
                color: 'var(--t3)',
                transition: 'all 0.18s ease',
              }}
              title="Browse all standalone courses"
            >
              <span>📦</span> Standalone Courses Library →
            </button>
          </div>
        </div>

        {/* Active Track Highlight Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 8,
            background: activeTrack === 'web_fullstack'
              ? 'rgba(99, 102, 241, 0.08)'
              : 'rgba(16, 185, 129, 0.08)',
            border: `1px solid ${
              activeTrack === 'web_fullstack' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)'
            }`,
            fontSize: 12,
            color: 'var(--t2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{activeTrack === 'web_fullstack' ? '🌐' : '🐍'}</span>
            <strong>
              {activeTrack === 'web_fullstack'
                ? 'Option 1: Web Full Stack (React 19, TypeScript, Next.js, Node.js, PostgreSQL & Docker)'
                : 'Option 2: Python Full Stack (Python 3.12, FastAPI, PyTorch, LangChain & Distributed APIs)'}
            </strong>
          </div>
          <span style={{ color: 'var(--t3)', fontSize: 11.5 }}>
            {activeTrack === 'web_fullstack'
              ? 'Target: Full-Stack Engineer / Frontend Architect • Dual Fallback Resilience'
              : 'Target: Python Backend Architect / AI Engineer • Dual Fallback Resilience'}
          </span>
        </div>
      </div>

      {/* ── Crash Course Plan Cards Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {CRASH_COURSE_PLANS.map((plan) => {
          const isEnrolled = Boolean(currentPlanId && currentPlanId === plan.id);
          return (
            <EnhancedCrashCoursePlanCard
              key={plan.id}
              plan={plan}
              activeTrack={activeTrack}
              isSelected={isEnrolled}
              onSelectPlan={handleEnroll}
              onPreviewCredentials={(p) => {
                setPreviewPlan(p);
                setPreviewModalOpen(true);
              }}
              onOpenDiagnosticReport={onOpenPracticeReport}
              userPins={userPins}
            />
          );
        })}
      </div>

      {/* ── Dual Credential Preview Modal ── */}
      <CredentialPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        planTitle={previewPlan?.title}
        trackTitle={
          previewPlan?.flagshipBuildByTrack?.[activeTrack]?.title ||
          (activeTrack === 'web_fullstack' ? 'Full-Stack Software Architecture' : 'Python & AI Engineering')
        }
        onProceedToEnroll={() => {
          if (previewPlan) {
            setPreviewModalOpen(false);
            handleEnroll(previewPlan);
          }
        }}
      />
    </div>
  );
};

export default CrashCoursePlanCards;
