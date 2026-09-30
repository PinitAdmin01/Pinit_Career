'use client';

import React from 'react';
import { CrashPlan, getCrashPlanById, INTERNSHIP_TIER_AVAILABLE, PLAN_TIER_TO_INTERNSHIP } from '@/lib/data/crashPlansData';
import type { CrashCourseProgress, PhaseStatus } from '@/lib/courses/crashCourseProgress';

export interface VerticalCheckpointStepperProps {
  planId: string;
  activeTrack: 'web_fullstack' | 'python_ai';
  /** This course's own progress (its curriculum and enrollment), not quests done elsewhere. */
  progress: CrashCourseProgress;
  onOpenPracticeTest: (title: string) => void;
  onOpenCapstoneDesk: () => void;
  onOpenQrModal: () => void;
  onOpenPreviewCredentials?: () => void;
  onContinueTodayQuest?: () => void;
  /** Issues the course certificate once the capstone passed (graduation phase). */
  onGetCertificate?: () => void;
  /** Opens the internship simulation desk. */
  onOpenInternshipDesk?: () => void;
}

const badgeFor = (status: PhaseStatus, labels: { completed: string; active: string; locked: string }) => labels[status];

export const VerticalCheckpointStepper: React.FC<VerticalCheckpointStepperProps> = ({
  planId,
  activeTrack,
  progress,
  onOpenPracticeTest,
  onOpenCapstoneDesk,
  onOpenQrModal,
  onOpenPreviewCredentials,
  onContinueTodayQuest,
  onGetCertificate,
  onOpenInternshipDesk,
}) => {
  const plan: CrashPlan = getCrashPlanById(planId) || getCrashPlanById('plan-3m-accelerator')!;
  const internshipTier = PLAN_TIER_TO_INTERNSHIP[plan.tier];
  const isTierOn = internshipTier ? Boolean(INTERNSHIP_TIER_AVAILABLE[internshipTier]) : false;
  const flagship = plan.flagshipBuildByTrack[activeTrack];
  const { phases } = progress;

  const steps = [
    {
      key: 'training',
      phaseName: 'CORE ACCREDITATION',
      title: `${plan.trainingDurationMonths}-Month Daily Micro-Learning`,
      subtitle: 'Daily 1-Hour guided quests, interactive theory, syntax drills, and weekly retention tests.',
      status: phases.training,
      badgeText: badgeFor(phases.training, { completed: '✓ Completed', active: '● Active (1h / Day)', locked: '🔒 Locked' }),
      color: '#6366f1',
      progress: progress.percent,
      detail: `${progress.completed} of ${progress.total} course lessons completed (${progress.percent}%)`,
      primaryAction: {
        label: progress.next ? "⚡ Continue Today's Quest" : '✓ All lessons completed',
        onClick: onContinueTodayQuest || (() => {
          const el = document.getElementById('quest-roadmap-chart-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        })
      },
      secondaryAction: {
        label: '📝 Take Dynamic Diagnostic Test',
        onClick: () => onOpenPracticeTest('Weekly Milestone Diagnostic Assessment')
      }
    },
    {
      key: 'capstone',
      phaseName: 'PRODUCTION CAPSTONE',
      title: '1-Month Production Project Desk',
      subtitle: flagship?.title || 'Production full-stack repo with architectural review and CI/CD checks.',
      status: phases.capstone,
      badgeText: badgeFor(phases.capstone, { completed: '✓ Capstone approved', active: '● Active Desk', locked: '🔒 Unlocks after Phase 1' }),
      color: '#38bdf8',
      techStack: flagship?.tech || ['React', 'Next.js', 'PostgreSQL', 'Docker'],
      primaryAction: {
        label: '🚀 Open Capstone Desk',
        onClick: onOpenCapstoneDesk
      }
    },
    {
      key: 'internship',
      phaseName: 'INDUSTRY FELLOWSHIP',
      title: `${plan.internshipDurationMonths} Real-Time Fellowship`,
      subtitle: 'Work on live sprint backlogs, code reviews, daily standups, and corporate performance tracking on PinIT Labs.',
      status: phases.internship,
      badgeText: badgeFor(phases.internship, { completed: '✓ Fellowship completed', active: '🏢 Fellowship open', locked: '🔒 Unlocks after your capstone' }),
      color: '#10b981',
      highlights: [
        'Live sprint board & PR reviews',
        'Senior engineer mentor assignment',
        'Official Corporate Experience Letter'
      ],
      primaryAction: onOpenInternshipDesk ? {
        label: phases.internship === 'completed'
          ? '🎓 View Internship Outcome'
          : phases.internship === 'active'
          ? '🏢 Open Internship Desk'
          : '🏢 View Internship Desk',
        onClick: onOpenInternshipDesk,
      } : undefined
    },
    {
      key: 'graduation',
      phaseName: 'GRADUATION & TRUST',
      title: isTierOn ? 'Oral Defense & Dual Verifiable Credentials' : 'Verifiable Capstone Certificate',
      subtitle: isTierOn
        ? 'Present your production capstone to a senior panel, pass defense, and unlock cryptographically signed SHA-256 credentials.'
        : 'Your capstone passed its defense: get a signed certificate that anyone can verify online.',
      status: phases.graduation,
      badgeText: badgeFor(phases.graduation, { completed: '🎓 Certificate issued', active: '🎓 Certificate ready', locked: isTierOn ? '🔒 Unlocks after the fellowship' : '🔒 Unlocks after your capstone' }),
      color: '#f59e0b',
      // Sharing is only offered once the credentials really exist; before that, a labelled sample.
      primaryAction: phases.graduation === 'completed'
        ? { label: '📲 Share & Verify (QR)', onClick: onOpenQrModal }
        : phases.graduation === 'active' && onGetCertificate
          ? { label: '🎓 Get my certificate', onClick: onGetCertificate }
          : undefined,
      secondaryAction: onOpenPreviewCredentials ? {
        label: phases.graduation === 'completed' ? '👁️ View Certificates' : '👁️ Preview Sample Certificates',
        onClick: onOpenPreviewCredentials
      } : undefined
    }
  ];

  // Hidden phases are removed and the rest renumbered (PHASE 1, 2, 3 …).
  const visibleSteps = steps
    .filter((s) => isTierOn || s.key !== 'internship')
    .map((s, i) => ({ ...s, stepNumber: String(i + 1).padStart(2, '0'), phaseTag: `PHASE ${i + 1} • ${s.phaseName}` }));

  return (
    <div
      className="vcs-container"
      style={{
        marginTop: 8,
        borderRadius: 24,
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%)',
        border: '1.5px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: 'var(--font-display, Inter, sans-serif)'
      }}
    >
      <style jsx>{`
        .vcs-container {
          padding: 28px 24px;
        }
        .vcs-spine {
          left: 31px;
        }
        .vcs-step-row {
          gap: 24px;
        }
        .vcs-node {
          width: 50px;
          height: 50px;
          font-size: 17.5px;
        }
        .vcs-card {
          padding: 20px 22px;
        }
        @media (max-width: 640px) {
          .vcs-container {
            padding: 18px 12px !important;
          }
          .vcs-spine {
            left: 23px !important;
          }
          .vcs-step-row {
            gap: 12px !important;
          }
          .vcs-node {
            width: 38px !important;
            height: 38px !important;
            font-size: 14.5px !important;
          }
          .vcs-card {
            padding: 14px 14px !important;
          }
        }
      `}</style>
      {/* ── Section Title & Plan Indicator ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26.5 }}>📍</span>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Vertical Milestone Pipeline: {plan.title}
            </h3>
          </div>
          <p style={{ fontSize: 14.5, color: '#94a3b8', margin: '4px 0 0 0' }}>
            {isTierOn
              ? 'Structured 4-checkpoint progression from daily learning to corporate fellowship and verifiable graduation.'
              : 'Structured 3-checkpoint progression from daily learning to a production capstone and a verifiable certificate.'}
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 14px',
          borderRadius: 12,
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase' }}>Current Track:</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}>
            {activeTrack === 'web_fullstack' ? '🌐 Full-Stack Web' : '🤖 Python & AI'}
          </span>
        </div>
      </div>

      {/* ── Vertical Pipeline Container ── */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 28, paddingLeft: 8 }}>
        {/* Continuous Vertical Glowing Spine */}
        <div
          className="vcs-spine"
          style={{
            position: 'absolute',
            top: 32,
            bottom: 32,
            width: 4,
            background: 'linear-gradient(180deg, #6366f1 0%, #38bdf8 33%, #10b981 66%, #f59e0b 100%)',
            borderRadius: 2,
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)',
            zIndex: 1
          }}
        />

        {/* ── Checkpoints 01 - 04 ── */}
        {visibleSteps.map((step, idx) => {
          const isActive = step.status === 'active';
          const isDone = step.status === 'completed';
          const isLocked = step.status === 'locked';

          return (
            <div
              key={step.stepNumber}
              className="vcs-step-row"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                zIndex: 2
              }}
            >
              {/* Circular Numbered Checkpoint Node (Inspired by Screenshot 1) */}
              <div
                className="vcs-node"
                style={{
                  position: 'relative',
                  borderRadius: '50%',
                  background: isActive
                    ? `radial-gradient(circle, ${step.color} 0%, #0f172a 100%)`
                    : isDone
                    ? '#10b981'
                    : '#1e293b',
                  border: `3px solid ${isActive ? step.color : isDone ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
                  boxShadow: isActive ? `0 0 20px ${step.color}88` : '0 4px 10px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 4,
                  color: '#ffffff',
                  fontWeight: 900,
                  transition: 'all 0.3s ease'
                }}
              >
                {isDone ? '✓' : step.stepNumber}

                {/* Pulsing indicator if active */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    border: `2px solid ${step.color}`,
                    opacity: 0.7,
                    animation: 'pulse 2s infinite'
                  }} />
                )}
              </div>

              {/* Pointer Callout Card (Infographic Style Pointer attached to circle) */}
              <div
                className="vcs-card"
                style={{
                  flex: 1,
                  position: 'relative',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
                    : 'rgba(15, 23, 42, 0.65)',
                  border: isActive
                    ? `1.5px solid ${step.color}`
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 18,
                  boxShadow: isActive ? `0 8px 24px -4px ${step.color}33` : '0 4px 14px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Pointer Arrow pointing toward the left circle */}
                <div style={{
                  position: 'absolute',
                  top: 18,
                  left: -8,
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: `8px solid ${isActive ? step.color : 'rgba(255, 255, 255, 0.1)'}`,
                }} />

                {/* Top Row: Phase Tag + Status Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: step.color, letterSpacing: '0.05em' }}>
                    {step.phaseTag}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: isActive ? `${step.color}25` : isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? step.color : isDone ? '#10b981' : '#94a3b8',
                    border: `1px solid ${isActive ? step.color : isDone ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`
                  }}>
                    {step.badgeText}
                  </span>
                </div>

                {/* Milestone Title & Subtitle */}
                <div>
                  <h4 style={{ fontSize: 17.5, fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: 14, color: '#94a3b8', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    {step.subtitle}
                  </p>
                </div>

                {/* Progress Bar (For Step 1) */}
                {step.progress !== undefined && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#cbd5e1', fontWeight: 700 }}>
                      <span>{step.detail}</span>
                      <span style={{ color: step.color }}>{step.progress}% Complete</span>
                    </div>
                    <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${step.progress}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${step.color}, #38bdf8)`,
                        borderRadius: 3,
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                )}

                {/* Tech Stack Pills (For Step 2) */}
                {step.techStack && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                    {step.techStack.map(t => (
                      <span key={t} style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        color: '#38bdf8'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Highlights (For Step 3) */}
                {step.highlights && (
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 2 }}>
                    {step.highlights.map(h => (
                      <span key={h} style={{ fontSize: 12.5, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: '#10b981' }}>✓</span> {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons Row */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                  {step.primaryAction && (
                    <button
                      onClick={step.primaryAction.onClick}
                      disabled={isLocked}
                      style={{
                        opacity: isLocked ? 0.45 : 1,
                        pointerEvents: isLocked ? 'none' : 'auto',
                        padding: '8px 16px',
                        borderRadius: 10,
                        border: 'none',
                        background: isActive
                          ? `linear-gradient(135deg, ${step.color}, #6366f1)`
                          : 'rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: isActive ? `0 4px 14px ${step.color}44` : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {step.primaryAction.label}
                    </button>
                  )}

                  {step.secondaryAction && (
                    <button
                      onClick={step.secondaryAction.onClick}
                      disabled={isLocked && step.key !== 'graduation'}
                      style={{
                        opacity: isLocked && step.key !== 'graduation' ? 0.45 : 1,
                        pointerEvents: isLocked && step.key !== 'graduation' ? 'none' : 'auto',
                        padding: '8px 16px',
                        borderRadius: 10,
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: '#cbd5e1',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {step.secondaryAction.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
