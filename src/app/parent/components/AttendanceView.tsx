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
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>📸 Attendance</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
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
            fontSize: 13,
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
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
            🔔 Centralized Notifications Hub
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Important institution advisories, exam timelines, assignment reminders, and placement news alerts.
          </p>
        </div>

        {/* Notifications stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              type: 'Attendance Alert',
              title: 'Unexcused Absence Recorded',
              desc: 'Absent on July 14 without prior leave submission. Please verify and submit excuse note.',
              color: 'var(--danger)',
              bg: 'rgba(var(--danger-rgb), 0.03)',
              border: 'rgba(var(--danger-rgb), 0.15)',
              time: '1 day ago',
            },
            {
              type: 'Exam Alert',
              title: 'Midterm Theory Examination Schedule',
              desc: 'Mathematics Midterm exam is locked for July 25, 09:30 AM in Examination Hall-C.',
              color: 'var(--success)',
              bg: 'rgba(var(--success-rgb), 0.03)',
              border: 'rgba(var(--success-rgb), 0.15)',
              time: '2 days ago',
            },
            {
              type: 'Assignment Reminder',
              title: 'Programming Foundations Submission',
              desc: 'Assignment 3: Recursion and DSA structures due tomorrow at 11:59 PM. Current status: Unsubmitted.',
              color: 'var(--amber)',
              bg: 'rgba(var(--warning-rgb), 0.03)',
              border: 'rgba(var(--warning-rgb), 0.15)',
              time: '3 hours ago',
            },
            {
              type: 'Placement News',
              title: 'Microsoft Campus Recruitment Registrations',
              desc: 'Microsoft placement register window opens on Aug 01. Mapped matching profiles (AI Engineers) are eligible.',
              color: 'var(--accent)',
              bg: 'rgba(var(--info-rgb), 0.03)',
              border: 'rgba(var(--info-rgb), 0.15)',
              time: '3 days ago',
            },
            {
              type: 'Holiday Notice',
              title: 'Independence Day Campus Closure',
              desc: 'The institute and hostel administrative blocks will remain closed on Aug 15 for Independence Day.',
              color: 'var(--t2)',
              bg: 'var(--bg3)',
              border: 'var(--border)',
              time: '4 days ago',
            },
            {
              type: 'Meeting Reminder',
              title: 'Virtual Parent-Teacher Meeting (PTM)',
              desc: 'Virtual advising slot with Prof Vikram Sen scheduled for July 29, 04:00 PM. Launch links available in Communication.',
              color: 'var(--teal)',
              bg: 'rgba(var(--accent-teal-rgb), 0.03)',
              border: 'rgba(var(--accent-teal-rgb), 0.15)',
              time: '5 days ago',
            },
          ].map((n, idx) => (
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
                    fontSize: 10,
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
                <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>{n.time}</span>
              </div>
              <h4 style={{ margin: '4px 0 0 0', fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>{n.title}</h4>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{n.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                {acknowledgedAlerts[n.title] ? (
                  <span
                    style={{
                      fontSize: 11,
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
                      fontSize: 11.5,
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
          ))}
        </div>
      </div>
    );
  }

  return null;
}
