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
  const [resolvedProgress, setResolvedProgress] = useState<{
    completed: number;
    total: number;
    percent: number;
    nextQuestId: string | null;
  } | null>(null);

  const completedQuests = useMemo(() => cOS?.completedQuests || [], [cOS?.completedQuests]);

  useEffect(() => {
    let isMounted = true;
    const fetchActive = async () => {
      try {
        const active = await crashCourseEnrollmentService.getActiveEnrollment();
        if (isMounted) setEnrollment(active);
      } catch (e) {
        console.warn('Failed to load active enrollment for progress bar', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchActive();

    const handleRefresh = () => { void fetchActive(); };
    window.addEventListener('pinit:enrollment_updated', handleRefresh);
    window.addEventListener('focus', handleRefresh);
    return () => {
      isMounted = false;
      window.removeEventListener('pinit:enrollment_updated', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, []);

  const hasEnrollment = !!enrollment;

  const plan = useMemo(() => {
    if (enrollment) {
      return CRASH_COURSE_PLANS.find(p => p.id === enrollment.planId) || null;
    }
    return null;
  }, [enrollment]);

  // Resolve real track-specific quest progress asynchronously when enrolled
  useEffect(() => {
    let active = true;
    if (!enrollment || !plan) {
      setResolvedProgress(null);
      return;
    }
    (async () => {
      try {
        const { COURSES_REGISTRY } = await import('@/lib/data/coursesData');
        const prog = getCrashCourseProgress(plan, enrollment.track, COURSES_REGISTRY, completedQuests, enrollment);
        if (active) {
          setResolvedProgress({
            completed: prog.completed,
            total: prog.total,
            percent: prog.percent,
            nextQuestId: prog.next?.questId || null,
          });
        }
      } catch (err) {
        console.warn('Could not resolve crash course progress:', err);
      }
    })();
    return () => { active = false; };
  }, [enrollment, plan, completedQuests]);

  // Total days / units for the enrolled plan
  const totalDays = useMemo(() => {
    if (resolvedProgress && resolvedProgress.total > 0) return resolvedProgress.total;
    if (!plan) return 60;
    return plan.trainingDurationMonths === 1 ? 30 : plan.trainingDurationMonths === 3 ? 60 : 90;
  }, [resolvedProgress, plan]);

  // Real completed count
  const completedCount = useMemo(() => {
    if (enrollment && resolvedProgress) {
      return Math.min(totalDays, resolvedProgress.completed);
    }
    if (enrollment) {
      return Math.min(totalDays, completedQuests.length);
    }
    return 0; // Honest baseline: 0 when not enrolled
  }, [enrollment, resolvedProgress, completedQuests, totalDays]);

  const isAllComplete = hasEnrollment && completedCount >= totalDays;
  const currentIncompleteDay = useMemo(() => {
    if (!hasEnrollment) return 1;
    return isAllComplete ? totalDays : Math.min(totalDays, completedCount + 1);
  }, [hasEnrollment, completedCount, totalDays, isAllComplete]);

  const percentComplete = useMemo(() => {
    if (hasEnrollment && resolvedProgress) {
      return Math.min(100, Math.max(0, Math.round(resolvedProgress.percent)));
    }
    if (hasEnrollment && totalDays > 0) {
      return Math.round((completedCount / totalDays) * 100);
    }
    return 0; // Honest baseline: 0% when not enrolled
  }, [hasEnrollment, resolvedProgress, completedCount, totalDays]);

  // Checkpoint milestones for the horizontal bar
  const milestones = useMemo(() => {
    const q1 = Math.max(2, Math.round(totalDays * 0.25));
    const q2 = Math.max(q1 + 1, Math.round(totalDays * 0.50));
    const q3 = Math.max(q2 + 1, Math.round(totalDays * 0.75));

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
      if (resolvedProgress?.nextQuestId) {
        router.push(`/quests/lesson?questId=${encodeURIComponent(resolvedProgress.nextQuestId)}`);
        return;
      }
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

  // ── Render 0: Shimmer Loading Skeleton ──────────────────────────────────────
  if (loading && !enrollment) {
    return (
      <div
        data-testid="career-progress-skeleton"
        className="db-glass"
        style={{
          padding: '22px 26px',
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          animation: 'db-shimmer 1.6s ease-in-out infinite',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="db-well" style={{ width: 42, height: 42, borderRadius: 11 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div className="db-well" style={{ width: 150, height: 12, borderRadius: 4 }} />
              <div className="db-well" style={{ width: 240, height: 18, borderRadius: 4 }} />
            </div>
          </div>
          <div className="db-well" style={{ width: 180, height: 38, borderRadius: 10 }} />
        </div>
        <div className="db-well" style={{ width: '100%', height: 4, borderRadius: 2, marginTop: 8 }} />
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
        padding: '22px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
      }}
    >
      <style>{TIMELINE_STYLES}</style>

      {/* Header Row: Course Eyebrow + Clean Status Pill + Title + Single-Arrow CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mid, #6366f1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="db-label" style={{ display: 'inline-block' }}>CAREER ACCELERATOR RUNWAY</span>
              <span
                className="db-tabular"
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 9px',
                  borderRadius: 999,
                  background: hasEnrollment ? 'rgba(99, 102, 241, 0.14)' : 'var(--dash-subtle-bg)',
                  color: hasEnrollment ? 'var(--accent-mid, var(--accent))' : 'var(--dash-subtext)',
                  border: `1px solid ${hasEnrollment ? 'rgba(99, 102, 241, 0.28)' : 'var(--dash-inner-border)'}`,
                }}
              >
                {hasEnrollment ? `${percentComplete}% Complete` : '0% Complete'}
              </span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--dash-text)', margin: '3px 0 0', fontFamily: 'var(--font-display)', letterSpacing: '-0.015em' }}>
              {hasEnrollment
                ? `Career Course: ${plan?.title || 'Enrolled Specialization'}`
                : 'Career Course: No Active Program Enrolled'}
            </h3>
            <span className="db-tabular" style={{ fontSize: 11.5, color: 'var(--t3)', display: 'block', marginTop: 2 }}>
              {hasEnrollment
                ? `${completedCount} of ${totalDays} units completed · Active sprint Phase ${activeMilestoneIndex >= 0 ? activeMilestoneIndex + 1 : 5}`
                : 'Select a specialization track to begin your engineering journey'}
            </span>
          </div>
        </div>

        {/* Action Button (No double arrow when un-enrolled) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            data-testid="btn-resume-incomplete-day"
            onClick={handleActionClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              background: hasEnrollment
                ? 'linear-gradient(135deg, #06b6d4, #6366f1)'
                : 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px -2px rgba(99, 102, 241, 0.42)',
              fontFamily: 'var(--font-display)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1.5px)';
              e.currentTarget.style.boxShadow = '0 6px 22px -2px rgba(99, 102, 241, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(99, 102, 241, 0.42)';
            }}
          >
            {hasEnrollment && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
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

      {/* Horizontal Interactive 5-Column Grid Stepper (Rail centered cleanly through every dot) */}
      <div style={{ overflowX: 'auto', padding: '6px 4px 4px' }}>
        <div
          style={{
            minWidth: 520,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(96px, 1fr))',
            position: 'relative',
            alignItems: 'start',
          }}
        >
          {/* Background track rail pinned to exact vertical center of 24px node container (top: 12px) */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '10%',
              right: '10%',
              height: 3,
              transform: 'translateY(-50%)',
              background: 'var(--dash-rail-bg, var(--border2))',
              borderRadius: 999,
              zIndex: 0,
            }}
          />

          {/* Completed progress fill bar */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '10%',
              width: hasEnrollment
                ? `${Math.min(80, Math.max(3, (completedCount / Math.max(1, totalDays)) * 80))}%`
                : '0%',
              height: 3,
              transform: 'translateY(-50%)',
              background: 'linear-gradient(90deg, #6366f1, #10b981)',
              borderRadius: 999,
              boxShadow: hasEnrollment && completedCount > 0 ? '0 0 12px rgba(16, 185, 129, 0.55)' : 'none',
              transition: 'width 0.7s ease',
              zIndex: 0,
            }}
          />

          {milestones.map((m, idx) => {
            const isCompleted = hasEnrollment && m.day <= completedCount;
            const isCurrent = hasEnrollment && !isAllComplete && idx === activeMilestoneIndex;

            return (
              <div
                key={m.day}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0 6px',
                }}
              >
                {/* Fixed-height 24px wrapper keeps track rail aligned to dot center regardless of active dot scale */}
                <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    className={isCurrent ? 'timeline-pulse-node' : ''}
                    style={{
                      width: isCurrent ? 22 : 16,
                      height: isCurrent ? 22 : 16,
                      borderRadius: '50%',
                      background: isCompleted
                        ? '#10b981'
                        : isCurrent
                        ? '#6366f1'
                        : 'var(--dash-card)',
                      border: `2px solid ${isCurrent ? '#ffffff' : isCompleted ? '#10b981' : 'var(--dash-border-strong, var(--border2))'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: isCompleted
                        ? '0 0 10px rgba(16,185,129,0.45)'
                        : isCurrent
                        ? '0 0 14px rgba(99,102,241,0.75)'
                        : 'none',
                      transition: 'all 0.25s ease',
                    }}
                    title={`${m.label}: ${m.name} (Unit ${m.day})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Milestone ${m.label}: ${m.name}`}
                    onClick={handleActionClick}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleActionClick(); } }}
                  >
                    {isCompleted ? (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : isCurrent ? (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
                    ) : null}
                  </div>
                </div>

                {/* Phase label */}
                <div
                  className="db-tabular"
                  style={{
                    fontSize: 11,
                    fontWeight: isCurrent ? 800 : isCompleted ? 700 : 600,
                    color: isCurrent ? 'var(--accent-mid, var(--accent))' : isCompleted ? 'var(--dash-text)' : 'var(--t3)',
                    marginTop: 7,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {m.label}
                </div>

                {/* Milestone Name */}
                <div
                  style={{
                    fontSize: 11,
                    color: isCurrent ? 'var(--dash-text)' : 'var(--dash-subtext)',
                    fontWeight: isCurrent ? 700 : 500,
                    marginTop: 2,
                    lineHeight: 1.25,
                  }}
                >
                  {m.name}
                </div>

                {/* Unit indicator */}
                <div className="db-tabular" style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>
                  Day {m.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
