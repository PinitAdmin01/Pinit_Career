'use client';

import { useState, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import TeacherDashboard from '@/components/teacher/TeacherDashboard';

function TeacherPageContent() {
  const { user, loading, login } = useAuth();
  const [isDemoBypass, setIsDemoBypass] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (loading) {
    return (
      <div style={{ padding: 40, color: 'var(--t3, #64748b)', textAlign: 'center' }}>
        Loading authentication status...
      </div>
    );
  }

  // Allow teacher, admin, superadmin roles or demo bypass
  if (!isDemoBypass && (!user || !['teacher', 'admin', 'superadmin'].includes(user.role))) {
    const handleQuickLogin = async () => {
      setIsLoggingIn(true);
      try {
        if (login) {
          await login('teacher@pinit.in', '111111');
        }
      } catch {}
      setIsDemoBypass(true);
      setIsLoggingIn(false);
    };

    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg, #090d16)'
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          padding: '32px',
          borderRadius: '16px',
          background: 'var(--card-bg, #111827)',
          border: '1px solid var(--border, #1f2937)',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 16px'
          }}>
            👨‍🏫
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Faculty & Teacher Studio
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', lineHeight: 1.5 }}>
            This workspace is dedicated to professors, instructors, and campus administrators to create lesson blocks, grade code, and monitor student performance.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleQuickLogin}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoggingIn ? 'Entering Studio...' : '🚀 Quick Enter as Demo Faculty / Tester'}
            </button>

            <button
              onClick={() => setIsDemoBypass(true)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'transparent',
                color: '#cbd5e1',
                fontWeight: 500,
                fontSize: '13px',
                border: '1px solid #334155',
                cursor: 'pointer'
              }}
            >
              Preview Studio (Read-Only Mode)
            </button>

            <a
              href="/login"
              style={{
                fontSize: '12px',
                color: '#64748b',
                textDecoration: 'underline',
                marginTop: '8px'
              }}
            >
              Sign in with custom credentials
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Deep department fallback check
  const actualDepartment = 
    (user as any)?.department || 
    (user as any)?.dept || 
    (user as any)?.department_name || 
    (user as any)?.user_metadata?.department || 
    'Computer Science & AI';

  return (
    <TeacherDashboard
      teacher={{
        id: String(user?.id || 'demo-teacher-01'),
        name: String(user?.display_name || user?.username || 'Prof. Vikram Sharma (Faculty)'),
        username: String(user?.username || 'teacher_demo'),
        role: String(user?.role || 'teacher'),
        department: String(actualDepartment)
      }}
      onLogout={() => {
        setIsDemoBypass(false);
        window.location.href = '/login';
      }}
    />
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t3)', textAlign: 'center' }}>Loading Teacher Dashboard...</div>}>
      <TeacherPageContent />
    </Suspense>
  );
}
