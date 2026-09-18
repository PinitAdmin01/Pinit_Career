'use client';

import React from 'react';
import type { CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';
import { CRASH_COURSE_PLANS } from '@/lib/data/crashPlansData';

export interface ActiveEnrollmentBannerProps {
  enrollment: CrashCourseEnrollment;
  onOpenTimeline: () => void;
  onOpenCapstonePortal: () => void;
  onChangePlan?: () => void;
}

export const ActiveEnrollmentBanner: React.FC<ActiveEnrollmentBannerProps> = ({
  enrollment,
  onOpenTimeline,
  onOpenCapstonePortal,
  onChangePlan
}) => {
  const plan = CRASH_COURSE_PLANS.find((p) => p.id === enrollment.planId) || CRASH_COURSE_PLANS[1];
  const trackLabel = enrollment.track === 'python_ai' ? 'Python & AI Engineering' : 'Full-Stack Web Dev';

  const sprintLabels = [
    'Sprint 1: Architecture & Data Schema',
    'Sprint 2: Core Microservices & APIs',
    'Sprint 3: CI/CD Pipeline & Live Deployment',
    'Sprint 4: Senior Engineer Capstone Defense'
  ];
  const currentSprintText = sprintLabels[(enrollment.currentSprint || 1) - 1] || sprintLabels[0];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
        border: '1.5px solid rgba(99, 102, 241, 0.4)',
        borderRadius: 16,
        padding: '16px 20px',
        marginBottom: 20,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 0 20px rgba(99, 102, 241, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '4px 10px',
              borderRadius: 20
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }}
            />
            Active Enrolled Track
          </span>
          <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
            Ref #{enrollment.enrollmentId.slice(-8).toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onChangePlan && (
            <button
              onClick={onChangePlan}
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: 'var(--t2)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '6px 12px',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Change Plan
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
            {plan.title}
          </h3>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0', fontWeight: 500 }}>
            {trackLabel} • {plan.totalProgramDuration} Total Program Duration
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>
            Current Milestone
          </span>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#38bdf8' }}>
            {currentSprintText}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
        <button
          onClick={onOpenTimeline}
          style={{
            flex: 1,
            minWidth: 180,
            fontSize: 12.5,
            fontWeight: 800,
            color: '#ffffff',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            padding: '9px 14px',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}
        >
          <span>⚡</span> View Daily Sprints & Timeline
        </button>

        <button
          onClick={onOpenCapstonePortal}
          style={{
            flex: 1,
            minWidth: 180,
            fontSize: 12.5,
            fontWeight: 800,
            color: '#ffffff',
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '9px 14px',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7
          }}
        >
          <span>📜</span> Capstone Defense & Dual Certificates
        </button>
      </div>
    </div>
  );
};
