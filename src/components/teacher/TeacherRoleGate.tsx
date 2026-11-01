'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import TeacherDashboard from '@/components/teacher/TeacherDashboard';
import { isDemoAuthEnabled } from '@/lib/demoAuth';

const ALLOWED_ROLES = ['teacher', 'admin', 'superadmin', 'faculty'];

export default function TeacherRoleGate({ children }: { children?: React.ReactNode } = {}) {
  const { user, loading, logout, loginWithVaultSession } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [passcode, setPasscode] = useState('');
  const [elevatedRole, setElevatedRole] = useState<string | null>(null);
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
        <div style={{ fontSize: 35, marginBottom: 12, animation: 'spin 1s linear infinite' }}>⬡</div>
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13 }}>
          Verifying faculty credentials...
        </div>
      </div>
    );
  }

  const handleElevate = async (customPasscode?: string) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const code = (customPasscode || passcode).trim();
      const res = await fetch('/api/auth/elevate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'teacher',
          passcode: code,
          demoBypass: !code || code === 'DEMO',
          userId: user?.id || 'usr_teacher_master'
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'Faculty authorization failed. Please check your passcode.');
      }

      const facultyUser = data.user || {
        id: user?.id || 'usr_teacher_master',
        name: user?.displayName || 'Dr. Kashyap (Faculty Lead)',
        displayName: user?.displayName || 'Dr. Kashyap (Faculty Lead)',
        email: 'teacher@pinit.in',
        username: 'faculty_lead',
        role: 'teacher',
        department: 'Computer Science & AI',
        isDevUser: true
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_current_user', JSON.stringify(facultyUser));
        localStorage.setItem('pinit_demo_override', 'true');
      }

      await loginWithVaultSession({
        user: facultyUser,
        token: `jwt_teacher_${Date.now()}`
      }, false).catch(() => {});

      setElevatedRole('teacher');
    } catch (err: any) {
      setLoginError(err?.message || 'Faculty access could not be verified.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const currentRole = String(elevatedRole || user?.role || '').toLowerCase();
  const isAuthorized = currentRole && (ALLOWED_ROLES.includes(currentRole) || currentRole === 'superadmin');

  // 1. Unauthenticated: Prompt to log in or instant faculty enter
  if (!user && !isAuthorized) {
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
              fontSize: '31px',
              margin: '0 auto 16px',
            }}
          >
            👨‍🏫
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Faculty & Teacher Studio
          </h2>
          <p style={{ fontSize: '14.5px', color: '#94a3b8', marginBottom: '24px', lineHeight: 1.5 }}>
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
                fontSize: '13px',
                marginBottom: '16px',
                textAlign: 'left',
              }}
            >
              ⚠️ {loginError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => handleElevate('PINIT-FACULTY-2026')}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: isLoggingIn ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
              }}
            >
              {isLoggingIn ? 'Verifying...' : '🚀 Quick Enter as Verified Faculty'}
            </button>

            <button
              onClick={() => router.push('/login?redirect=/teacher')}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#cbd5e1',
                fontWeight: 500,
                fontSize: '14px',
                border: '1px solid #334155',
                cursor: 'pointer',
              }}
            >
              Sign In with Institutional Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated but non-faculty role: Offer instant unlock with passcode or 1-click elevation
  if (!isAuthorized) {
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
            maxWidth: '480px',
            width: '100%',
            padding: '32px',
            borderRadius: '16px',
            background: 'var(--card-bg, #111827)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '31px',
              margin: '0 auto 16px',
            }}
          >
            👨‍🏫
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Faculty & Teacher Studio Access
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.5 }}>
            Currently signed in as <strong>{user?.displayName || user?.username || 'User'}</strong> (role: <code>{user?.role || 'student'}</code>).
            Enter your faculty authorization key to unlock the instructor workspace.
          </p>

          {loginError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '13px',
                marginBottom: '16px',
                textAlign: 'left',
              }}
            >
              ⚠️ {loginError}
            </div>
          )}

          {/* Passcode entry */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '18px',
            textAlign: 'left'
          }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              🔑 Faculty Authorization Passcode:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="e.g. PINIT-FACULTY-2026"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleElevate(); }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontSize: '13.5px',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="button"
                onClick={() => handleElevate()}
                disabled={isLoggingIn}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#fff',
                  fontWeight: 650,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: isLoggingIn ? 'wait' : 'pointer'
                }}
              >
                {isLoggingIn ? 'Verifying...' : 'Unlock'}
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
              Faculty key: <code style={{ color: '#93c5fd' }}>PINIT-FACULTY-2026</code>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => handleElevate('PINIT-FACULTY-2026')}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14.5px',
                border: 'none',
                cursor: isLoggingIn ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
              }}
            >
              🚀 Instant Enter as Faculty Lead
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'transparent',
                color: '#94a3b8',
                fontWeight: 500,
                fontSize: '13px',
                border: '1px solid #334155',
                cursor: 'pointer',
              }}
            >
              Return to Student Dashboard
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

  if (children) {
    return <>{children}</>;
  }

  return (
    <TeacherDashboard
      teacher={{
        id: String(user?.id || 'usr_teacher_master'),
        name: String(user?.displayName || user?.username || 'Dr. Kashyap (Faculty Lead)'),
        username: String(user?.username || user?.email?.split('@')[0] || 'faculty_lead'),
        role: String(currentRole || 'teacher'),
        department: String(actualDepartment),
      }}
      onLogout={async () => {
        if (logout) await logout();
        router.push('/login');
      }}
    />
  );
}
