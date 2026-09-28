'use client';

import React from 'react';
import { StudentOverview } from '../hooks/useParentDashboard';

interface AttendanceViewProps {
  activeTab: string;
  overview: StudentOverview;
  acknowledgedAlerts: Record<string, string>;
  handleAcknowledgeAlert: (alertTitle: string) => void;
}

export default function AttendanceView({
  activeTab,
  overview,
  acknowledgedAlerts,
  handleAcknowledgeAlert,
}: AttendanceViewProps) {
  if (activeTab === 'attendance') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 900, color: 'var(--t1)' }}>📸 Attendance</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 12.5, color: 'var(--t3)' }}>
            Live attendance feeds are not connected for this student yet.
          </p>
        </div>
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 28,
            textAlign: 'center',
            color: 'var(--t3)',
            fontSize: 14.5,
          }}
        >
          {overview.profile?.attendance != null
            ? `Recorded attendance: ${overview.profile.attendance}%`
            : 'No attendance data available. Connect an institutional attendance source to populate this view.'}
        </div>
      </div>
    );
  }

  if (activeTab === 'notifications') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 900, color: 'var(--t1)' }}>
            🔔 Centralized Notifications Hub
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 12.5, color: 'var(--t3)' }}>
            Important institution advisories, exam timelines, assignment reminders, and placement news alerts.
          </p>
        </div>

        {/* Notifications stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(() => {
            const rawNotifs = overview?.notifications || [];
            const alertsList = rawNotifs.length > 0
              ? rawNotifs.map(n => ({
                  type: n.type ? `${n.type.toUpperCase()} NOTICE` : 'INSTITUTIONAL ALERT',
                  title: n.title,
                  desc: n.message,
                  color: 'var(--accent)',
                  bg: 'rgba(var(--accent-rgb, 59, 130, 246), 0.04)',
                  border: 'rgba(var(--accent-rgb, 59, 130, 246), 0.2)',
                  time: new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                }))
              : [
                  {
                    type: 'Academic Milestone',
                    title: 'Current Term Progress Sync',
                    desc: `Academic assessments and progress trackers are active for ${overview.profile?.displayName || 'student'}. Check Academic tab for updated grades.`,
                    color: 'var(--success)',
                    bg: 'rgba(var(--success-rgb), 0.03)',
                    border: 'rgba(var(--success-rgb), 0.15)',
                    time: 'Recent',
                  },
                  {
                    type: 'Career Preparation',
                    title: 'Placement DNA Alignment',
                    desc: `Career track configured as "${overview.profile?.career_track || 'Software Engineering'}". Ongoing practice recommended.`,
                    color: 'var(--accent)',
                    bg: 'rgba(var(--info-rgb, 59, 130, 246), 0.03)',
                    border: 'rgba(var(--info-rgb, 59, 130, 246), 0.15)',
                    time: 'Active',
                  },
                ];

            return alertsList.map((n, idx) => (
              <div
                key={idx}
                style={{
                  background: n.bg,
                  border: `1.5px solid ${n.border}`,
                  borderRadius: 10,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: n.color,
                      textTransform: 'uppercase',
                      background: 'var(--card)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: `1px solid ${n.border}`,
                    }}
                  >
                    {n.type}
                  </span>
                  <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{n.time}</span>
                </div>
                <h4 style={{ margin: '4px 0 0 0', fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>{n.title}</h4>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--t2)', lineHeight: 1.45 }}>{n.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  {acknowledgedAlerts[n.title] ? (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--success)',
                        background: 'rgba(var(--success-rgb), 0.1)',
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid rgba(var(--success-rgb), 0.2)',
                      }}
                    >
                      ✓ Acknowledged at {acknowledgedAlerts[n.title]}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcknowledgeAlert(n.title)}
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: 6,
                        background: 'var(--card)',
                        color: 'var(--t1)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      ✔ Acknowledge Alert
                    </button>
                  )}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    );
  }

  return null;
}
