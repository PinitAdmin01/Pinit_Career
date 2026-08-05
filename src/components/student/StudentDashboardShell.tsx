'use client';

import React, { useState } from 'react';
import StudentCourseViewer from './StudentCourseViewer';
import StudentExamPortal from './StudentExamPortal';
import StudentAttendanceView from './StudentAttendanceView';

interface StudentDashboardShellProps {
  student?: {
    name?: string;
    rollNo?: string;
    department?: string;
    atsScore?: number;
    pinsBalance?: number;
  };
}

export default function StudentDashboardShell({ student }: StudentDashboardShellProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'exams' | 'attendance'>('overview');

  const displayName = student?.name || 'Rahul Sharma';
  const atsScore = student?.atsScore || 88;
  const pinsBalance = student?.pinsBalance || 140;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main, #f8fafc)',
      color: 'var(--t1, #0f172a)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Student Top Header */}
      <header style={{
        background: 'var(--bg1, #ffffff)',
        borderBottom: '1px solid var(--border, #e2e8f0)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🎓</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Student Learning Portal</h1>
            <span style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>Campus OS • {student?.department || 'Computer Science & AI'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>
            🎯 ATS Readiness: {atsScore}/100
          </div>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: '#92400e' }}>
            📍 Pins: {pinsBalance}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{displayName}</div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Nav */}
        <aside style={{
          width: 240,
          background: 'var(--bg1, #ffffff)',
          borderRight: '1px solid var(--border, #e2e8f0)',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          {[
            { id: 'overview', icon: '📊', label: 'Dashboard Overview' },
            { id: 'courses', icon: '📖', label: 'Course Notes' },
            { id: 'exams', icon: '📝', label: 'Online Exams' },
            { id: 'attendance', icon: '📅', label: 'Attendance' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === item.id ? '#eff6ff' : 'transparent',
                color: activeTab === item.id ? '#2563eb' : 'var(--t2, #475569)',
                fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Body */}
        <main style={{ flex: 1, padding: 32, maxWidth: 1200 }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Welcome back, {displayName}! 👋</h2>
                <p style={{ color: 'var(--t3, #64748b)', margin: '4px 0 0' }}>Track your active courses, assignments, and career readiness scores.</p>
              </div>

              {/* Quick Action Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div style={{ padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                  <div style={{ fontSize: 13, color: '#64748b' }}>ATS Resume Score</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#2563eb', margin: '4px 0 0' }}>{atsScore}%</div>
                  <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>High match for AI roles</div>
                </div>

                <div style={{ padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Pending Assessments</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#d97706', margin: '4px 0 0' }}>1 Test</div>
                  <div style={{ fontSize: 12, color: '#d97706', marginTop: 4 }}>Due in 3 days</div>
                </div>

                <div style={{ padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Attendance Average</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a', margin: '4px 0 0' }}>91.2%</div>
                  <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>All criteria met</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && <StudentCourseViewer />}
          {activeTab === 'exams' && <StudentExamPortal />}
          {activeTab === 'attendance' && <StudentAttendanceView />}
        </main>
      </div>
    </div>
  );
}
