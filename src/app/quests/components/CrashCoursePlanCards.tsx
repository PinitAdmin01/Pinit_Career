'use client';

import React, { useState } from 'react';
import { CRASH_COURSE_PLANS, CrashPlan } from '@/lib/data/crashPlansData';
import { toast } from '@/lib/store/useAppStore';

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
            <span style={{ fontSize: 24 }}>⚡</span>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
              Industry Crash Certification & Real-Time Internship Programs
            </h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--t3)', margin: '4px 0 0 0' }}>
            Daily 1-Hour micro-learning, 1-Month production capstone, 2-3 Months industry internship, and dual verifiable credentials.
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
              fontSize: 12.5,
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
              fontSize: 12.5,
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
              fontSize: 12.5,
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
        gap: 16
      }}>
        {CRASH_COURSE_PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const modules = plan.modulesByTrack[activeTrack] || [];

          return (
            <div
              key={plan.id}
              style={{
                borderRadius: 18,
                padding: '20px 18px',
                background: isSelected
                  ? 'linear-gradient(180deg, rgba(20, 29, 50, 0.9) 0%, rgba(13, 20, 36, 0.95) 100%)'
                  : 'rgba(15, 23, 42, 0.75)',
                border: isSelected
                  ? `2px solid ${plan.highlightColor}`
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected
                  ? `0 10px 30px -5px ${plan.highlightColor}33`
                  : '0 4px 16px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
                position: 'relative',
                transition: 'all 0.25s ease'
              }}
            >
              {/* Badge Tag if any */}
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: -11,
                  right: 18,
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  background: `linear-gradient(135deg, ${plan.highlightColor}, #6366f1)`,
                  color: '#ffffff',
                  boxShadow: `0 4px 12px ${plan.highlightColor}66`
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Card Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: plan.highlightColor,
                    letterSpacing: '0.06em'
                  }}>
                    {plan.tier.toUpperCase()} INTENSIVE
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>
                    {plan.totalProgramDuration}
                  </span>
                </div>

                <h4 style={{ fontSize: 17, fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  {plan.title}
                </h4>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 12px 0', lineHeight: 1.4 }}>
                  {plan.subtitle}
                </p>

                {/* Duration Quad Pills */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginBottom: 14
                }}>
                  <div>
                    <div style={{ fontSize: 9.5, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Training</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc', marginTop: 1 }}>
                      {plan.trainingDurationMonths} Month{plan.trainingDurationMonths > 1 ? 's' : ''} (1h/day)
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Capstone</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc', marginTop: 1 }}>
                      {plan.projectDurationMonths} Month Live
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Internship</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', marginTop: 1 }}>
                      {plan.internshipDurationMonths} Real-time
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Total Program</div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: plan.highlightColor, marginTop: 1 }}>
                      {plan.totalProgramDuration.split(' ')[0]}
                    </div>
                  </div>
                </div>

                {/* Modules Preview for this Plan */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                    Curriculum Modules ({modules.length} Course{modules.length > 1 ? 's' : ''}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {modules.map((m) => (
                      <div key={m.month} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 11.5,
                        color: '#cbd5e1',
                        padding: '4px 8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 6
                      }}>
                        <span>{m.icon}</span>
                        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Included Deliverables:
                  </div>
                  {plan.features.slice(2, 7).map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11.5, color: '#94a3b8' }}>
                      <span style={{ color: plan.highlightColor, fontWeight: 900 }}>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11.5, color: '#cbd5e1', fontWeight: 700 }}>
                    <span style={{ color: '#38bdf8' }}>🌐</span>
                    <span>Languages: {plan.deliverables.languagesIncluded.join(', ')}</span>
                  </div>
                  {onOpenPracticeReport && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        color: '#818cf8',
                        cursor: 'pointer',
                        marginTop: 4,
                        fontWeight: 700
                      }}
                      onClick={() => onOpenPracticeReport(`${plan.title} Diagnostic Mock`)}
                    >
                      <span>📊</span> View Sample Diagnostic Report →
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer / Pricing & Action */}
              <div style={{
                paddingTop: 14,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 19, fontWeight: 900, color: '#ffffff' }}>
                      ⚡ {plan.pinsPrice}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 4 }}>Pins</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    or ₹{plan.inrPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {isSelected ? (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1.5px solid #10b981',
                      color: '#10b981',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <span>✓</span> Currently Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(plan)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: `linear-gradient(135deg, ${plan.highlightColor}, #6366f1)`,
                      border: 'none',
                      color: '#ffffff',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: `0 4px 14px ${plan.highlightColor}44`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Select & Unlock Plan →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
