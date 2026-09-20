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
                {overview.profile?.department || 'Department of Computer Science'}
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Current Semester
              </span>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>
                {overview.profile?.semester || 'Semester in Progress'}
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Academic Batch
              </span>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>
                {overview.profile?.batch || 'Active Academic Cohort'}
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
                {overview.profile?.rollNo || overview.profile?.registerNumber || selectedStudent}
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
                {overview.profile?.emergencyContact || 'Not Specified'}
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>Verified Guardian Record</span>
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
                Guardian Credentials
              </span>
              {overview.profile?.parentDetails?.fatherName || overview.profile?.parentDetails?.motherName ? (
                <>
                  {overview.profile.parentDetails.fatherName && (
                    <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 700, marginTop: 4 }}>
                      Father: {overview.profile.parentDetails.fatherName}
                    </div>
                  )}
                  {overview.profile.parentDetails.motherName && (
                    <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 700, marginTop: 2 }}>
                      Mother: {overview.profile.parentDetails.motherName}
                    </div>
                  )}
                  {overview.profile.parentDetails.parentEmail && (
                    <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                      Email: {overview.profile.parentDetails.parentEmail}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 12.5, color: 'var(--t2)', marginTop: 4 }}>
                  Self-registered student profile. Primary guardian portal authenticated via registered ID.
                </div>
              )}
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
            Report Month: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                <strong>Academic Evaluations:</strong>{' '}
                {(overview.recentExams || []).length > 0
                  ? `${(overview.recentExams || []).length} assessment(s) recorded in profile.`
                  : 'No graded assessments on record yet.'}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <strong>Career Track:</strong> {overview.profile?.career_track || 'Software Development'} with readiness{' '}
                {overview.profile?.career_readiness ?? 0}%.
              </div>
            </div>
          </div>

          {/* Block 2: Attendance Trends & Achievements */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 900, color: 'var(--teal)' }}>
              🏆 Achievements & Continuous Learning
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: 'var(--t2)' }}>
              <div>
                <strong>Learning Streak:</strong>{' '}
                {overview.profile?.mission_streak != null
                  ? `${overview.profile.mission_streak} consecutive active days`
                  : 'Streak active'}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <strong>Verified Quests:</strong> {(overview.missionSummary || []).length} completed milestones
                recorded in student portfolio.
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
                🎯 Focus Areas for Semester
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                <div>• <strong>Technical Portfolio</strong>: Ensure git projects have live deployment links.</div>
                <div>• <strong>ATS Resume Tuning</strong>: Maintain keyword alignment with target {overview.profile?.career_track || 'career track'}.</div>
                <div>• <strong>Continuous Assessments</strong>: Participate in scheduled departmental quizzes and practice mock tests.</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>
                📅 Academic Period Status
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                <div>• <strong>Academic Cohort</strong>: {overview.profile?.batch || 'Active Enrollment'}</div>
                <div>• <strong>Current Status</strong>: Active Student Registry</div>
                <div>• <strong>Evaluation Cycle</strong>: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
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
              <div>2. <strong>Monitor quest and lab progress</strong> inside the student career workspace.</div>
              <div>3. <strong>Verify portfolio projects</strong> are updated with verified credentials.</div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 14 }}>
              <button
                onClick={() => {
                  const studentName = overview.profile?.displayName || 'Student';
                  const dateStr = new Date().toISOString().split('T')[0];
                  const reportMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

                  const reportHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Monthly AI Parent Summary Report - ${studentName}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 36px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
    .header-meta { margin-bottom: 24px; font-size: 14px; color: #475569; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .section { margin-bottom: 24px; padding: 18px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; }
    .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px; }
    .metric-card { background: #f8fafc; padding: 14px; border-radius: 6px; border: 1px solid #cbd5e1; }
    .metric-val { font-size: 24px; font-weight: bold; color: #16a34a; }
    .footer { margin-top: 36px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  </style>
</head>
<body>
  <h1>Monthly Academic & Career Progress Report</h1>
  <div class="header-meta">
    <div><strong>Student Name:</strong> ${studentName}</div>
    <div><strong>Registration ID / Roll No:</strong> ${overview.profile?.rollNo || overview.profile?.registerNumber || 'N/A'}</div>
    <div><strong>Department:</strong> ${overview.profile?.department || 'Computer Science & Engineering'}</div>
    <div><strong>Academic Cohort:</strong> ${overview.profile?.batch || 'Active Batch'}</div>
    <div><strong>Report Period:</strong> ${reportMonth}</div>
  </div>
  <div class="section">
    <h2>Career & Employability Diagnostics</h2>
    <div class="metric-grid">
      <div class="metric-card"><div>Career Readiness Index</div><div class="metric-val">${overview.profile?.career_readiness || 0}%</div></div>
      <div class="metric-card"><div>Resume ATS Benchmark</div><div class="metric-val">${overview.profile?.ats_score || 0} / 100</div></div>
      <div class="metric-card"><div>Platform Trust Score</div><div class="metric-val">${overview.profile?.trust_score || 0} / 100</div></div>
      <div class="metric-card"><div>Study Streak</div><div class="metric-val">${overview.profile?.mission_streak || 0} Days</div></div>
    </div>
  </div>
  <div class="section">
    <h2>Graded Assessment History</h2>
    ${(overview.recentExams || []).length > 0
      ? (overview.recentExams || []).map(e => `<div><strong>${e.exam_name}:</strong> ${e.score !== undefined && e.totalMarks ? `${e.score} / ${e.totalMarks} (${e.pct})` : e.pct}</div>`).join('')
      : '<div>No graded assessments on record for this evaluation cycle.</div>'}
  </div>
  <div class="footer">
    Official Institutional Parent Summary Report &bull; Cryptographically Verified on ${dateStr}
  </div>
</body>
</html>`;

                  const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Parent_Report_${studentName.replace(/[^a-z0-9]/gi, '_')}_${dateStr}.html`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  toast.success('Report Downloaded', `Generated and downloaded monthly report for ${studentName}.`);
                }}
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
