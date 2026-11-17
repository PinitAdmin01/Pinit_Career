'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { crashCourseEnrollmentService, CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';
import { CRASH_COURSE_PLANS } from '@/lib/data/crashPlansData';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { getCrashCourseProgress } from '@/lib/courses/crashCourseProgress';

const TIMELINE_STYLES = `
  @keyframes pulseNodeGlow {
    0% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(99, 102, 241, 0);
      transform: scale(1.15);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
      transform: scale(1);
    }
  }

  .timeline-pulse-node {
    animation: pulseNodeGlow 2s infinite ease-in-out;
  }
`;

export default function CareerCourseProgressBar() {
  const router = useRouter();
  const cOS = useCareerOS();
  const [enrollment, setEnrollment] = useState<CrashCourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);

  const completedQuests = cOS?.completedQuests || [];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const active = await crashCourseEnrollmentService.getActiveEnrollment();
        if (isMounted) setEnrollment(active);
      } catch (e) {
        console.warn('Failed to load active enrollment for progress bar', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const hasEnrollment = !!enrollment;

  const plan = useMemo(() => {
    if (enrollment) {
      return CRASH_COURSE_PLANS.find(p => p.id === enrollment.planId) || null;
    }
    return null;
  }, [enrollment]);

  // Total days for the enrolled plan (e.g., 1M = 30 days, 3M = 60 days)
  const totalDays = useMemo(() => {
    if (!plan) return 60;
    return plan.trainingDurationMonths === 1 ? 30 : plan.trainingDurationMonths === 3 ? 60 : 90;
  }, [plan]);

  // Real completed count
  const completedCount = useMemo(() => {
    if (enrollment) {
      return Math.min(totalDays, completedQuests.length);
    }
    return 0; // Honest baseline: 0 when not enrolled
  }, [enrollment, completedQuests, totalDays]);

  const isAllComplete = hasEnrollment && completedCount >= totalDays;
  const currentIncompleteDay = useMemo(() => {
    if (!hasEnrollment) return 1;
    return isAllComplete ? totalDays : Math.min(totalDays, completedCount + 1);
  }, [hasEnrollment, completedCount, totalDays, isAllComplete]);

  const percentComplete = useMemo(() => {
    if (hasEnrollment && totalDays > 0) {
      return Math.round((completedCount / totalDays) * 100);
    }
    return 0; // Honest baseline: 0% when not enrolled
  }, [hasEnrollment, completedCount, totalDays]);

  // Checkpoint milestones for the horizontal bar
  const milestones = useMemo(() => {
    const q1 = Math.round(totalDays * 0.25);
    const q2 = Math.round(totalDays * 0.50);
    const q3 = Math.round(totalDays * 0.75);

    if (hasEnrollment && plan) {
      return [
        { day: 1, label: 'Phase 1', name: 'Fundamentals' },
        { day: q1, label: 'Phase 2', name: 'Data Structures' },
        { day: q2, label: 'Phase 3', name: 'Algorithms' },
        { day: q3, label: 'Phase 4', name: 'System Optimization' },
        { day: totalDays, label: 'Phase 5', name: 'Capstone Defense' },
      ];
    }

    return [
      { day: 1, label: 'Phase 1', name: 'Fundamentals' },
      { day: 15, label: 'Phase 2', name: 'Core Engineering' },
      { day: 30, label: 'Phase 3', name: 'System Architecture' },
      { day: 45, label: 'Phase 4', name: 'Advanced Optimization' },
      { day: 60, label: 'Phase 5', name: 'Capstone Defense' },
    ];
  }, [hasEnrollment, plan, totalDays]);

  const activeMilestoneIndex = useMemo(() => {
    if (!hasEnrollment) return -1;
    if (isAllComplete) return -1;
    const idx = milestones.findIndex(m => m.day >= currentIncompleteDay);
    return idx !== -1 ? idx : milestones.length - 1;
  }, [hasEnrollment, milestones, currentIncompleteDay, isAllComplete]);

  const handleActionClick = async () => {
    if (hasEnrollment && plan) {
      try {
        const { COURSES_REGISTRY } = await import('@/lib/data/coursesData');
        const prog = getCrashCourseProgress(plan, enrollment.track, COURSES_REGISTRY, completedQuests, enrollment);
        if (prog.next?.questId) {
          router.push(`/quests/lesson?questId=${encodeURIComponent(prog.next.questId)}`);
          return;
        }
      } catch (err) {
        console.warn('Could not resolve crash course quest, navigating to quests:', err);
      }
    }
    router.push('/quests');
  };

  // ── Render 0: Loading Skeleton ─────────────────────────────────────────────
  if (loading && !enrollment) {
    return (
      <div
        data-testid="career-progress-skeleton"
        className="db-glass"
        style={{
          padding: '20px 24px',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          background: 'var(--dash-card)',
          border: '1px solid var(--dash-border)',
          opacity: 0.75,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--bg3)', animation: 'pulse 1.5s infinite' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ width: 140, height: 12, borderRadius: 4, background: 'var(--bg3)' }} />
              <div style={{ width: 220, height: 18, borderRadius: 4, background: 'var(--bg3)' }} />
            </div>
          </div>
          <div style={{ width: 160, height: 38, borderRadius: 10, background: 'var(--bg3)' }} />
        </div>
        <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'var(--bg3)', marginTop: 8 }} />
      </div>
    );
  }

  // ── Render: Authentic Dynamic Career Course Runway ────────────────────────
  return (
    <div
      data-testid="career-course-progress-bar"
      className="db-glass"
      style={{
        width: '100%',
        padding: '20px 26px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, var(--dash-card) 100%)',
        border: '1.5px solid rgba(99,102,241,0.28)',
        boxShadow: '0 8px 30px -4px rgba(99,102,241,0.18)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
      }}
    >
      <style>{TIMELINE_STYLES}</style>

      {/* Header Row: Course Title + Progress Badge + Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* SVG Graduation Cap / Book Icon (No Emojis) */}
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(99,102,241,0.14)',
            border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
              {hasEnrollment ? (
                <>
                  Career Course: {plan?.title || 'Active Program'} &bull; <span style={{ color: 'var(--accent)' }}>{percentComplete}% Complete</span>
                </>
              ) : (
                <>
                  Career Course: No Active Program Enrolled &bull; <span style={{ color: 'var(--t3)' }}>0% Complete</span>
                </>
              )}
            </h3>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
              {hasEnrollment
                ? 'Checkpoints: Phase 1 • Phase 2 • Phase 3 • Phase 4 • Phase 5'
                : 'Select a specialization track to begin your engineering journey'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            data-testid="btn-resume-incomplete-day"
            onClick={handleActionClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 20px',
              borderRadius: 10,
              background: hasEnrollment
                ? 'linear-gradient(135deg, #06b6d4, #6366f1)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(99, 102, 241, 0.35)',
              fontFamily: 'var(--font-display)',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1.5px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(99, 102, 241, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(99, 102, 241, 0.35)';
            }}
          >
            {/* SVG Action Icon */}
            {hasEnrollment ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            )}
            <span>
              {hasEnrollment
                ? isAllComplete
                  ? 'View Capstone & Certificate'
                  : 'Resume Course'
                : 'Explore Career Programs →'}
            </span>
          </button>
        </div>
      </div>

      {/* Horizontal Interactive Timeline Bar */}
      <div style={{ position: 'relative', padding: '16px 8px 10px', marginTop: 4, overflowX: 'auto' }}>
        <div style={{ minWidth: 440, position: 'relative' }}>
          {/* Background track line */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: '4%',
              right: '4%',
              height: 4,
              background: 'var(--border2, var(--dash-border))',
              borderRadius: 2,
              zIndex: 0,
            }}
          />

          {/* Completed progress line with gradient glow (0% if not enrolled) */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: '4%',
              width: hasEnrollment
                ? `${Math.min(92, Math.max(4, (completedCount / totalDays) * 92))}%`
                : '0%',
              height: 4,
              background: 'linear-gradient(90deg, var(--accent), #10b981)',
              borderRadius: 2,
              boxShadow: hasEnrollment && completedCount > 0 ? '0 0 12px rgba(16, 185, 129, 0.6)' : 'none',
              transition: 'width 0.8s ease',
              zIndex: 0,
            }}
          />

          {/* Milestone nodes along the timeline */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            {milestones.map((m, idx) => {
              const isCompleted = hasEnrollment && m.day <= completedCount;
              const isCurrent = hasEnrollment && !isAllComplete && (idx === activeMilestoneIndex);

              return (
                <div
                  key={m.day}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    minWidth: 70,
                  }}
                >
                  {/* Node dot */}
                  <div
                    className={isCurrent ? 'timeline-pulse-node' : ''}
                    style={{
                      width: isCurrent ? 22 : 16,
                      height: isCurrent ? 22 : 16,
                      borderRadius: '50%',
                      background: isCompleted
                        ? '#10b981'
                        : isCurrent
                        ? 'var(--accent)'
                        : 'var(--bg3)',
                      border: `2px solid ${isCurrent ? '#ffffff' : isCompleted ? '#10b981' : 'var(--dash-inner-border, var(--border2))'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: 9,
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: isCompleted
                        ? '0 0 10px rgba(16,185,129,0.5)'
                        : isCurrent
                        ? '0 0 16px rgba(99,102,241,0.8)'
                        : 'none',
                      transition: 'all 0.3s ease',
                    }}
                    title={`${m.label}: ${m.name}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Milestone ${m.label}: ${m.name}`}
                    onClick={handleActionClick}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleActionClick(); } }}
                  >
                    {isCompleted ? (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : isCurrent ? (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
                    ) : null}
                  </div>

                  {/* Day label */}
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: isCurrent ? 900 : isCompleted ? 700 : 500,
                      color: isCurrent ? 'var(--accent)' : isCompleted ? 'var(--t1)' : 'var(--t3)',
                      marginTop: 8,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.label}
                  </div>

                  {/* Milestone Name */}
                  <div
                    style={{
                      fontSize: 10.5,
                      color: isCurrent ? 'var(--t1)' : 'var(--t3)',
                      fontWeight: isCurrent ? 700 : 500,
                      marginTop: 2,
                      maxWidth: 90,
                      lineHeight: 1.25,
                    }}
                  >
                    {m.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
