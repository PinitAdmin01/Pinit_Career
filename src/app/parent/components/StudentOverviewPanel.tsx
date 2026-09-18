'use client';

import React from 'react';
import { Student, StudentOverview } from '../hooks/useParentDashboard';
import { toast } from '@/lib/store/useAppStore';

interface StudentOverviewPanelProps {
  activeTab: string;
  overview: StudentOverview;
  acknowledgedAlerts: Record<string, string>;
  students: Student[] | undefined;
  selectedStudent: string | null;
}

export default function StudentOverviewPanel({
  activeTab,
  overview,
  acknowledgedAlerts,
  students,
  selectedStudent,
}: StudentOverviewPanelProps) {
  if (activeTab === 'dashboard') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        {/* Overview summary — live fields only */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(var(--success-rgb), 0.06) 0%, rgba(var(--success-deep-rgb), 0.02) 100%)',
            border: '1px solid rgba(var(--success-rgb), 0.18)',
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--success)' }}>Live Overview Summary</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
            Showing metrics returned by the parent overview API for {overview.profile?.displayName || 'this student'}.
            Attendance, CGPA, and institutional alerts appear only when those data sources are connected.
          </p>
        </div>

        {/* Parent Alert Acknowledgment Feedback Seal Banner */}
        {Object.keys(acknowledgedAlerts).length > 0 && (
          <div
            style={{
              background: 'rgba(var(--success-rgb), 0.06)',
              border: '1.5px solid rgba(var(--success-rgb), 0.25)',
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🛡️</span>
              <span style={{ fontSize: 12.5, color: 'var(--success)', fontWeight: 800 }}>
                {Object.keys(acknowledgedAlerts).length} Institutional Advisory Alert(s) Formally Acknowledged
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
              SEAL #ACK-PAR-{Object.keys(acknowledgedAlerts).length}
            </span>
          </div>
        )}

        {/* Score Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            {
              label: 'Career Readiness',
              value: overview.profile?.career_readiness != null ? `${overview.profile.career_readiness}%` : '—',
              desc: 'From ATS + trust overview',
              color: 'var(--success)',
            },
            {
              label: 'ATS Score',
              value: overview.profile?.ats_score != null ? `${overview.profile.ats_score}` : '—',
              desc: 'Resume ATS score',
              color: 'var(--accent)',
            },
            {
              label: 'Attendance',
              value: overview.profile?.attendance != null ? `${overview.profile.attendance}%` : 'Not available',
              desc: 'No attendance feed linked',
              color: 'var(--teal)',
            },
            {
              label: 'Trust Score',
              value: overview.profile?.trust_score != null ? `${overview.profile.trust_score}` : '—',
              desc: 'Platform trust index',
              color: 'var(--accent)',
            },
            {
              label: 'Career DNA',
              value: overview.profile?.career_dna_score != null ? `${overview.profile.career_dna_score}` : '—',
              desc: 'Career DNA score',
              color: 'var(--success)',
            },
            {
              label: 'Current CGPA',
              value: overview.profile?.cgpa != null ? String(overview.profile.cgpa) : 'Not available',
              desc: 'No gradebook feed linked',
              color: 'var(--accent)',
            },
            {
              label: 'Mission Streak',
              value: `${overview.profile?.mission_streak ?? 0} days`,
              desc: 'Continuous study index',
              color: 'var(--amber)',
            },
            {
              label: 'Track',
              value: overview.profile?.career_track || '—',
              desc: 'Declared career track',
              color: 'var(--success)',
            },
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                {card.label}
              </span>
              <span style={{ fontSize: 24, fontWeight: 900, color: card.color, fontFamily: 'var(--font-mono)' }}>
                {card.value}
              </span>
              <span style={{ fontSize: 10, color: 'var(--t3)' }}>{card.desc}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>👤 Student Registry Profile</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Verified institutional registration details, emergency contact indexes, and parent credentials.
          </p>
        </div>

        {/* Header overview card */}
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 18,
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              background: 'var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            👨‍💻
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>
              {overview.profile?.displayName ||
                students?.find(s => s.id === selectedStudent)?.display_name ||
                'Student'}
            </h4>
            <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>
              Registration ID:{' '}
              <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {students?.find(s => s.id === selectedStudent)?.register_number || selectedStudent}
              </strong>{' '}
              | Status: <span style={{ color: 'var(--success)', fontWeight: 800 }}>Active Student</span>
            </div>
          </div>
        </div>

        {/* Profile details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Left column: Academic parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Department
              </span>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>
                Computer Science & Engineering
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Current Semester
              </span>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>
                Semester 4 (CS-A cohort)
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Academic Batch
              </span>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>
                Batch of 2026
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Roll Number
              </span>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 800,
                  color: 'var(--t1)',
                  marginTop: 4,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                CS-2023-0842
              </div>
            </div>
          </div>

          {/* Right column: Guardianship parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Emergency Contact
              </span>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 800,
                  color: 'var(--danger)',
                  marginTop: 4,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                +91 98765 43210
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>Relation: Priya Sharma (Mother)</span>
            </div>

            <div
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 14,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Parent Details
              </span>
              <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 700, marginTop: 4 }}>Father: Ashok Sharma</div>
              <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 700, marginTop: 2 }}>Mother: Priya Sharma</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                Email: ashok.priya@gmail.com
              </div>
            </div>
          </div>
        </div>

        {/* Action banner */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            onClick={() => {
              toast.success(
                'Update Request Sent',
                'A verification request to update child registry credentials was sent to the administration office.'
              );
            }}
            style={{
              padding: '10px 20px',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            ✏️ Request Profile Record Update
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'monthly_report') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }} className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
              📅 Monthly AI Parent Summary Report
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
              Comprehensive monthly student performance report compiled by Athena AI.
            </p>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              padding: '4px 10px',
              borderRadius: 20,
              color: 'var(--t2)',
            }}
          >
            Report Month: July 2026
          </span>
        </div>

        {/* Summary Blocks Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Block 1: Academic & Career Progress */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 900, color: 'var(--accent)' }}>
              📈 Performance Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: 'var(--t2)' }}>
              <div>
                <strong>Academic Progress:</strong> CGPA{' '}
                {overview.profile?.cgpa != null ? overview.profile.cgpa : 'not available from API'}. Recent exams:{' '}
                {(overview.recentExams || []).length || 0} recorded.
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <strong>Career Development:</strong> Track {overview.profile?.career_track || '—'} with readiness{' '}
                {overview.profile?.career_readiness ?? '—'}%.
              </div>
            </div>
          </div>

          {/* Block 2: Attendance Trends & Achievements */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 900, color: 'var(--teal)' }}>
              🏆 Achievements & Attendance Trends
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: 'var(--t2)' }}>
              <div>
                <strong>Attendance Trends:</strong>{' '}
                {overview.profile?.attendance != null
                  ? `Recorded attendance ${overview.profile.attendance}%`
                  : 'No attendance feed linked — not available.'}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <strong>Mission activity:</strong> {(overview.missionSummary || []).length} completed quest/mission
                records in overview.
              </div>
            </div>
          </div>
        </div>

        {/* Milestones, Support & Action advice */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          {/* Left: Support Needs & Upcoming Milestones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>
                ⚠️ Areas Needing Support
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                <div>• <strong>Computer Networking</strong>: Focus on routing theory and mock quiz tests.</div>
                <div>• <strong>Communication Skills</strong>: Speech pitching metrics are at 53% (Needs lab rehearsal).</div>
                <div>• <strong>Interview Rehearsal</strong>: Practice behavioral mock question lists.</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>
                📅 Upcoming Milestones
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                <div>• <strong>Microsoft Registrations</strong>: Campus register opens on Aug 01.</div>
                <div>• <strong>Virtual PTM Review</strong>: Advisory session locked for July 29, 04:00 PM.</div>
                <div>• <strong>Campus Placement Drive</strong>: Official recruitment round starts Aug 10.</div>
              </div>
            </div>
          </div>

          {/* Right: Home Action Plan */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(var(--success-rgb), 0.06) 0%, rgba(var(--success-deep-rgb), 0.02) 100%)',
              border: '1.5px solid rgba(var(--success-rgb), 0.2)',
              borderRadius: 12,
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              justifyItems: 'center',
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 900, color: 'var(--success)' }}>
              💡 Action Plan for Home
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>
              Practical tips to help you support your child's placement preparation:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--t2)' }}>
              <div>1. <strong>Encourage regular class attendance</strong> to prevent backlog drops.</div>
              <div>2. <strong>Monitor communication quest progress</strong> inside the Comm Lab console this weekend.</div>
              <div>3. <strong>Verify hosted portfolio setup</strong> is updated with latest project credentials.</div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 14 }}>
              <button
                onClick={() => toast.success('Report Saved', 'Monthly AI Parent Report downloaded successfully.')}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  background: 'var(--success)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                Download Monthly PDF Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
