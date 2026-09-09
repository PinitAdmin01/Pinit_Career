'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import TeacherDashboard from '@/components/teacher/TeacherDashboard';
import { isDemoAuthEnabled, DEMO_PASSWORD } from '@/lib/demoAuth';

const ALLOWED_ROLES = ['teacher', 'admin', 'superadmin', 'faculty'];

export default function TeacherRoleGate() {
  const { user, loading, login, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          color: 'var(--t3, #64748b)',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 1s linear infinite' }}>⬡</div>
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12 }}>
          Verifying faculty credentials...
        </div>
      </div>
    );
  }

  // 1. Unauthenticated: Prompt to log in
  if (!user) {
    const handleDemoLogin = async () => {
      if (!isDemoAuthEnabled()) return;
      setIsLoggingIn(true);
      setLoginError(null);
      try {
        if (login) {
          await login('teacher@pinit.in', DEMO_PASSWORD);
        }
      } catch (err: any) {
        setLoginError(err?.message || 'Demo authentication failed');
      } finally {
        setIsLoggingIn(false);
      }
    };

    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--bg, #090d16)',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '32px',
            borderRadius: '16px',
            background: 'var(--card-bg, #111827)',
            border: '1px solid var(--border, #1f2937)',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 16px',
            }}
          >
            👨‍🏫
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Faculty & Teacher Studio
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px', lineHeight: 1.5 }}>
            This workspace is restricted to authorized professors, instructors, and campus administrators. Please sign in with your faculty account.
          </p>

          {loginError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '12px',
                marginBottom: '16px',
                textAlign: 'left',
              }}
            >
              {loginError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => router.push('/login?redirect=/teacher')}
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
              }}
            >
              Sign In to Faculty Portal
            </button>

            {isDemoAuthEnabled() && (
              <button
                onClick={handleDemoLogin}
                disabled={isLoggingIn}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#60a5fa',
                  fontWeight: 500,
                  fontSize: '13px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  cursor: isLoggingIn ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isLoggingIn ? 'Signing in...' : '🚀 Quick Enter as Demo Faculty (Dev Only)'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated but unauthorized (e.g., student or non-faculty role): 403 Forbidden
  if (!ALLOWED_ROLES.includes(user.role)) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--bg, #090d16)',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '32px',
            borderRadius: '16px',
            background: 'var(--card-bg, #111827)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 16px',
            }}
          >
            🚫
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            403 — Faculty Access Required
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', lineHeight: 1.5 }}>
            You are currently signed in as <strong>{user.displayName || user.username || user.email}</strong> with role{' '}
            <code
              style={{
                background: 'rgba(255,255,255,0.06)',
                padding: '2px 6px',
                borderRadius: '4px',
                color: '#f87171',
              }}
            >
              {user.role}
            </code>
            .
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>
            This studio requires faculty, instructor, or campus administrator privileges.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                width: '100%',
                padding: '11px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Return to Student Dashboard
            </button>
            <button
              onClick={async () => {
                if (logout) await logout();
                router.push('/login?redirect=/teacher');
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'transparent',
                color: '#cbd5e1',
                fontWeight: 500,
                fontSize: '12px',
                border: '1px solid #334155',
                cursor: 'pointer',
              }}
            >
              Sign In with Different Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Faculty: Render Teacher Dashboard
  const actualDepartment =
    (user as any)?.department ||
    (user as any)?.dept ||
    (user as any)?.department_name ||
    (user as any)?.user_metadata?.department ||
    'Computer Science & AI';

  return (
    <TeacherDashboard
      teacher={{
        id: String(user.id),
        name: String(user.displayName || user.username || 'Faculty Member'),
        username: String(user.username || user.email?.split('@')[0] || 'faculty'),
        role: String(user.role),
        department: String(actualDepartment),
      }}
      onLogout={async () => {
        if (logout) await logout();
        router.push('/login');
      }}
    />
  );
}
