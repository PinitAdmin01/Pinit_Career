'use client';

import React from 'react';
import { getCrashPlanById, CrashPlan } from '@/lib/data/crashPlansData';

interface InternshipTimelineTrackerProps {
  planId?: string;
  completedQuestsCount?: number;
  onOpenProjectWorkspace?: () => void;
  onOpenPracticeTest?: () => void;
}

export const InternshipTimelineTracker: React.FC<InternshipTimelineTrackerProps> = ({
  planId = 'plan-3m-accelerator',
  completedQuestsCount = 18,
  onOpenProjectWorkspace,
  onOpenPracticeTest
}) => {
  const plan: CrashPlan = getCrashPlanById(planId) || getCrashPlanById('plan-3m-accelerator')!;

  const totalTrainingDays = plan.trainingDurationDays;
  const trainingProgressPct = Math.min(100, Math.round((completedQuestsCount / totalTrainingDays) * 100));

  return (
    <div id="internship-timeline-section" style={{
      borderRadius: 18,
      padding: '20px 22px',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 13, 22, 0.95) 100%)',
      border: '1.5px solid rgba(99, 102, 241, 0.25)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📍</span>
            <h4 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Active Program Timeline: {plan.title} ({plan.totalProgramDuration})
            </h4>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0 0' }}>
            Structured 4-phase progression: Daily 1Hr Micro-Learning ➔ Live Capstone ➔ Real-Time Internship ➔ Dual Credentials.
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
          <span style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase' }}>Current Status:</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#ffffff' }}>Phase 1 (In Progress - {trainingProgressPct}%)</span>
        </div>
      </div>

      {/* ── 4-Phase Step Progression Track ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
        position: 'relative'
      }}>
        {/* Phase 1: Training */}
        <div style={{
          padding: 14,
          borderRadius: 14,
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1.5px solid #6366f1',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#818cf8', textTransform: 'uppercase' }}>PHASE 1</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>● Active (1h/day)</span>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#ffffff' }}>
            {plan.trainingDurationMonths}-Month Training
          </div>
          <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.3 }}>
            {completedQuestsCount} of {totalTrainingDays} Daily Quests Completed ({trainingProgressPct}%)
          </div>
          {/* Mini progress bar */}
          <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
            <div style={{ width: `${trainingProgressPct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #38bdf8)' }} />
          </div>
          {onOpenPracticeTest && (
            <button
              onClick={onOpenPracticeTest}
              style={{
                marginTop: 4,
                padding: '5px 10px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                cursor: 'pointer'
              }}
            >
              📝 Take Weekly Practice Test
            </button>
          )}
        </div>

        {/* Phase 2: Capstone Project */}
        <div style={{
          padding: 14,
          borderRadius: 14,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>PHASE 2</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>🔒 Unlocks Month {plan.trainingDurationMonths + 1}</span>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#cbd5e1' }}>
            1-Month Production Project
          </div>
          <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.3 }}>
            Full-stack production repo build with mentor architectural review & automated CI/CD checks.
          </div>
          <div style={{ fontSize: 11, color: '#818cf8', fontWeight: 700, marginTop: 'auto' }}>
            🏆 Project Certificate Included
          </div>
        </div>

        {/* Phase 3: Real-Time Internship */}
        <div style={{
          padding: 14,
          borderRadius: 14,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>PHASE 3</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>🏢 Industry Experience</span>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#cbd5e1' }}>
            {plan.internshipDurationMonths} Real Internship
          </div>
          <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.3 }}>
            Live sprint tasks, code reviews, standups, and corporate performance tracking on PinIT Network.
          </div>
          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginTop: 'auto' }}>
            📜 Real-Time Internship Certificate
          </div>
        </div>

        {/* Phase 4: Dual Credentials */}
        <div style={{
          padding: 14,
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 78, 59, 0.15))',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>PHASE 4</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>🎓 Graduation</span>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#ffffff' }}>
            Placement Ready & Dual Certs
          </div>
          <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.3 }}>
            SHA-256 Verifiable Proof of Training + Real-time Experience Letter + Interview Referral Pipeline.
          </div>
          <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginTop: 'auto' }}>
            🚀 Full Portfolio Live on Web
          </div>
        </div>
      </div>
    </div>
  );
};
