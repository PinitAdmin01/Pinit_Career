'use client';

import React, { useState, useEffect } from 'react';
import CourseManager from './CourseManager';
import ExamGradingManager from './ExamGradingManager';
import AttendanceTracker from './AttendanceTracker';
import BatchAnalyticsView from './BatchAnalyticsView';
import { portalService } from '@/lib/services/portalService';

interface TeacherDashboardProps {
  teacher?: {
    id?: string;
    name?: string;
    username?: string;
    department?: string;
    role?: string;
  };
  onLogout?: () => void;
}

export default function TeacherDashboard({ teacher, onLogout }: TeacherDashboardProps) {
  const [activeNav, setActiveNav] = useState<'overview' | 'courses' | 'exams' | 'attendance' | 'analytics'>('overview');

  const [materialsCount, setMaterialsCount] = useState<number>(0);
  const [enrolledStudentsCount, setEnrolledStudentsCount] = useState<number>(148);
  const [pendingGradesCount, setPendingGradesCount] = useState<number>(5);

  useEffect(() => {
    async function loadStats() {
      const mats = await portalService.getMaterials();
      setMaterialsCount(mats.length);
    }
    loadStats();
  }, []);

  const displayName = teacher?.name || teacher?.username || 'Prof. Faculty';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main, #f8fafc)',
      color: 'var(--t1, #0f172a)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navbar */}
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
          <span style={{ fontSize: 24 }}>👩‍🏫</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Faculty & Teacher Portal</h1>
            <span style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>Campus OS • {teacher?.department || 'Academic Department'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{displayName}</div>
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>● Active Faculty</div>
          </div>
          <button
            onClick={onLogout || (() => window.location.href = '/login')}
            style={{
              padding: '6px 14px',
              fontSize: 13,
              borderRadius: 6,
              border: '1px solid var(--border, #cbd5e1)',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
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
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'courses', icon: '📚', label: 'Course Materials' },
            { id: 'exams', icon: '📝', label: 'Exams & Grading' },
            { id: 'attendance', icon: '📋', label: 'Attendance Tracker' },
            { id: 'analytics', icon: '📈', label: 'Batch Performance' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeNav === item.id ? '#eff6ff' : 'transparent',
                color: activeNav === item.id ? '#2563eb' : 'var(--t2, #475569)',
                fontWeight: activeNav === item.id ? 700 : 500,
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

        {/* Content View */}
        <main style={{ flex: 1, padding: 32, maxWidth: 1200 }}>
          {activeNav === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Welcome back, {displayName}! 👋</h2>
                <p style={{ color: 'var(--t3, #64748b)', margin: '4px 0 0' }}>Here is what is happening across your batches today.</p>
              </div>

              {/* Dynamic Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg1, #fff)' }}>
                  <div style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>Active Batches</div>
                  <div style={{ fontSize: 28, fontWeight: 800, margin: '6px 0 0' }}>4</div>
                </div>
                <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg1, #fff)' }}>
                  <div style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>Total Enrolled Students</div>
                  <div style={{ fontSize: 28, fontWeight: 800, margin: '6px 0 0' }}>{enrolledStudentsCount}</div>
                </div>
                <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg1, #fff)' }}>
                  <div style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>Pending Grades</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#d97706', margin: '6px 0 0' }}>{pendingGradesCount}</div>
                </div>
                <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg1, #fff)' }}>
                  <div style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>Course Materials Published</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#2563eb', margin: '6px 0 0' }}>{materialsCount}</div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'courses' && <CourseManager />}
          {activeNav === 'exams' && <ExamGradingManager />}
          {activeNav === 'attendance' && <AttendanceTracker />}
          {activeNav === 'analytics' && <BatchAnalyticsView />}
        </main>
      </div>
    </div>
  );
}
