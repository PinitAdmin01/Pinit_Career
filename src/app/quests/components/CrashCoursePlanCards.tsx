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
  currentPlanId = 'plan-3m-accelerator',
  onSelectPlan,
  onOpenStandaloneCatalog,
  onOpenPracticeReport,
  onOpenCheckout,
  userPins = 100
}) => {
  const [activeTrack, setActiveTrack] = useState<'web_fullstack' | 'python_ai'>('web_fullstack');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(currentPlanId);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<CrashPlan | null>(null);

  const handleEnroll = (plan: CrashPlan) => {
    setSelectedPlanId(plan.id);
    const modules = plan.modulesByTrack[activeTrack] || [];
    const firstCourseId = modules[0]?.courseId || 'course-react-web';
    
    onSelectPlan(plan.id, activeTrack, firstCourseId);
    if (onOpenCheckout) {
      onOpenCheckout(plan, activeTrack);
    } else {
      toast.success('Plan Activated!', `Enrolled in ${plan.title} (${activeTrack === 'web_fullstack' ? 'Full-Stack Web' : 'Python & AI'}). All roadmap nodes and internship timeline unlocked!`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Top Header & Domain Switcher ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
        paddingBottom: 4
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26.5 }}>⚡</span>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
              {INTERNSHIP_AVAILABLE ? 'Industry Crash Certification & Real-Time Internship Programs' : 'Industry Crash Certification Programs'}
            </h3>
          </div>
          <p style={{ fontSize: 14.5, color: 'var(--t3)', margin: '4px 0 0 0' }}>
            {INTERNSHIP_AVAILABLE
              ? 'Daily 1-Hour micro-learning, 1-Month production capstone, 2-3 Months PinIT Tech Labs fellowship, and dual verifiable credentials.'
              : 'Daily 1-Hour micro-learning, a 1-Month production capstone, and a verifiable certificate.'}
          </p>
        </div>

        {/* Track Selector Pills */}
        <div style={{
          display: 'inline-flex',
          padding: 4,
          borderRadius: 14,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          gap: 6
        }}>
          <button
            onClick={() => setActiveTrack('web_fullstack')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTrack === 'web_fullstack' ? '1px solid #6366f1' : '1px solid transparent',
              background: activeTrack === 'web_fullstack' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.15))' : 'transparent',
              color: activeTrack === 'web_fullstack' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🌐</span> Full-Stack Web Development
          </button>

          <button
            onClick={() => setActiveTrack('python_ai')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTrack === 'python_ai' ? '1px solid #10b981' : '1px solid transparent',
              background: activeTrack === 'python_ai' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.15))' : 'transparent',
              color: activeTrack === 'python_ai' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🐍</span> Python & Data Engineering
          </button>

          <button
            onClick={onOpenStandaloneCatalog}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'transparent',
              color: '#94a3b8',
              transition: 'all 0.2s ease'
            }}
            title="Browse all 36 1-month standalone courses"
          >
            <span>📦</span> 36 Courses Library →
          </button>
        </div>
      </div>

      {/* ── 4 Crash Course Plan Cards Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16
      }}>
        {CRASH_COURSE_PLANS.map((plan) => (
          <EnhancedCrashCoursePlanCard
            key={plan.id}
            plan={plan}
            activeTrack={activeTrack}
            isSelected={selectedPlanId === plan.id}
            onSelectPlan={handleEnroll}
            onPreviewCredentials={(p) => {
              setPreviewPlan(p);
              setPreviewModalOpen(true);
            }}
            onOpenDiagnosticReport={onOpenPracticeReport}
            userPins={userPins}
          />
        ))}
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
