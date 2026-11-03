'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { crashCourseEnrollmentService, CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';
import { CRASH_COURSE_PLANS } from '@/lib/data/crashPlansData';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { getCrashCourseProgress } from '@/lib/courses/crashCourseProgress';

const TIMELINE_STYLES = `
  @keyframes pulseNodeGlow {
    0% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
      transform: scale(1.18);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
      transform: scale(1);
    }
  }

  @keyframes shimmerTrack {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
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

  const plan = useMemo(() => {
    if (!enrollment) return null;
    return CRASH_COURSE_PLANS.find(p => p.id === enrollment.planId) || CRASH_COURSE_PLANS[0];
  }, [enrollment]);

  // Total days for the enrolled plan (e.g., 1M = 30 days, 3M = 60 days)
  const totalDays = useMemo(() => {
    if (!plan) return 30;
    return plan.trainingDurationMonths === 1 ? 30 : plan.trainingDurationMonths === 3 ? 60 : 90;
  }, [plan]);

  // Current incomplete day calculation
  const completedCount = useMemo(() => {
    if (!enrollment) return 0;
    return Math.min(totalDays, completedQuests.length);
  }, [enrollment, completedQuests, totalDays]);

  const isAllComplete = completedCount >= totalDays;
  const currentIncompleteDay = useMemo(() => {
    return isAllComplete ? totalDays : Math.min(totalDays, completedCount + 1);
  }, [completedCount, totalDays, isAllComplete]);

  const percentComplete = useMemo(() => {
    return Math.round((completedCount / totalDays) * 100);
  }, [completedCount, totalDays]);

  // Checkpoint milestones for the horizontal bar (Start, Milestone 1, Milestone 2, Milestone 3, Capstone)
  const milestones = useMemo(() => {
    const q1 = Math.round(totalDays * 0.25);
    const q2 = Math.round(totalDays * 0.50);
    const q3 = Math.round(totalDays * 0.75);

    return [
      { day: 1, label: 'Day 1', name: 'Fundamentals' },
      { day: q1, label: `Day ${q1}`, name: 'Architecture' },
      { day: q2, label: `Day ${q2}`, name: 'Core APIs' },
      { day: q3, label: `Day ${q3}`, name: 'Optimization' },
      { day: totalDays, label: `Day ${totalDays}`, name: 'Capstone Defense' },
    ];
  }, [totalDays]);

  const activeMilestoneIndex = useMemo(() => {
    if (isAllComplete) return -1;
    const idx = milestones.findIndex(m => m.day >= currentIncompleteDay);
    return idx !== -1 ? idx : milestones.length - 1;
  }, [milestones, currentIncompleteDay, isAllComplete]);

  const handleResumeDay = () => {
    if (plan && enrollment) {
      try {
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

  // ── Render 0: Loading Skeleton (prevents flicker of enrolled state) ──────
  if (loading && !enrollment) {
    return (
      <div
        data-testid="career-progress-skeleton"
        className="db-glass"
        style={{
          padding: '20px 24px',
          minHeight: 140,
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

  // ── Render 1: Empty State (No career course purchased) ─────────────────────
  if (!enrollment) {
    return (
      <div
        data-testid="career-progress-empty"
        className="db-glass"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.03) 0%, var(--dash-card) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <style>{TIMELINE_STYLES}</style>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              🎓
            </div>
            <div>
              <span className="db-label">CAREER COURSE PROGRESS</span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
                No Active Career Program Enrolled
              </h3>
            </div>
          </div>

          <Link
            href="/quests"
            data-testid="btn-explore-career"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), #4f46e5)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              fontFamily: 'var(--font-display)',
              transition: 'all 0.18s ease',
            }}
          >
            Explore Career Programs →
          </Link>
        </div>

        {/* Empty Roadmap Timeline Visual */}
        <div style={{ position: 'relative', padding: '16px 0 8px', margin: '4px 0' }}>
          {/* Base track */}
          <div style={{ position: 'absolute', top: 28, left: '4%', right: '4%', height: 3, borderTop: '2px dashed var(--dash-border)', zIndex: 0 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            {[
              { step: 1, title: 'Phase 1: Micro-Learning', desc: 'Daily interactive lessons & drills' },
              { step: 2, title: 'Phase 2: Capstone Sprint', desc: 'Production-ready architecture' },
              { step: 3, title: 'Phase 3: Industry Certificate', desc: 'Tamper-proof verified credential' },
            ].map((p) => (
              <div key={p.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '30%' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg3)', border: '1.5px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                  {p.step}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginTop: 8 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Render 2: Active Enrolled Career Course Timeline (Image 4 inspired) ─────
  return (
    <div
      data-testid="career-course-progress-bar"
      className="db-glass"
      style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, var(--dash-card) 100%)',
        border: '1.5px solid rgba(99,102,241,0.3)',
        boxShadow: '0 8px 30px -4px rgba(99,102,241,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{TIMELINE_STYLES}</style>

      {/* Header Row: Title + Progress Badge + Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
            TRACK
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="db-label" style={{ color: 'var(--accent)' }}>
                ENROLLED CAREER ACCREDITATION
              </span>
              <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                ● Active Program
              </span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
              {plan?.title || 'Full-Stack Career Accelerator'} &middot; {isAllComplete ? <span style={{ color: '#10b981' }}>100% Completed</span> : <><span style={{ color: 'var(--accent)' }}>Day {currentIncompleteDay}</span> of {totalDays}</>}
            </h3>
          </div>
        </div>

        {/* Action Button & Completion Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right', marginRight: 4 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>
              Overall Progress
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
              {percentComplete}% Completed
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-resume-incomplete-day"
            onClick={handleResumeDay}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), #4f46e5)',
              border: 'none',
              color: '#ffffff',
              fontSize: 13.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(99,102,241,0.35)',
              fontFamily: 'var(--font-display)',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1.5px)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(99,102,241,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(99,102,241,0.35)';
            }}
          >
            <span>{isAllComplete ? '🎓' : '▶'}</span>
            <span>{isAllComplete ? 'View Capstone & Certificate' : ('Resume Incomplete Day (Day ' + currentIncompleteDay + ')')}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Interactive Timeline Bar (Inspired by Image 4) */}
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

          {/* Completed progress line with gradient glow */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: '4%',
              width: `${Math.min(92, Math.max(4, (completedCount / totalDays) * 92))}%`,
              height: 4,
              background: 'linear-gradient(90deg, var(--accent), #10b981)',
              borderRadius: 2,
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
              transition: 'width 0.8s ease',
              zIndex: 0,
            }}
          />

        {/* Milestone nodes along the timeline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          {milestones.map((m, idx) => {
            const isCompleted = m.day <= completedCount;
            const isCurrent = !isAllComplete && (idx === activeMilestoneIndex);

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
                    border: `2.5px solid ${isCurrent ? '#ffffff' : isCompleted ? '#10b981' : 'var(--dash-border)'}`,
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
                  title={`Day ${m.day}: ${m.name}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Milestone Day ${m.day}: ${m.name}`}
                  onClick={handleResumeDay}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleResumeDay(); } }}
                >
                  {isCompleted ? '✓' : isCurrent ? '●' : ''}
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
