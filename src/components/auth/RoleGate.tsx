'use client';

import { ReactNode, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

type RoleGateProps = {
  allow: string[];
  children: ReactNode;
  label?: string;
};

/** Client-side role gate for portal pages with instant tester bypass */
export function RoleGate({ allow, children, label }: RoleGateProps) {
  const { user, loading, login } = useAuth();
  const [isTesterBypass, setIsTesterBypass] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (loading) {
    return (
      <div style={{ padding: 40, color: 'var(--t3, #64748b)', textAlign: 'center' }}>
        Loading authentication status...
      </div>
    );
  }

  const role = user?.role || 'student';
  if (!isTesterBypass && (!user || !allow.includes(role))) {
    const primaryRole = allow[0] || 'admin';
    const emailMap: Record<string, string> = {
      admin: 'admin@pinit.in',
      superadmin: 'admin@pinit.in',
      teacher: 'teacher@pinit.in',
      recruiter: 'rec@pinit.in',
      consultant: 'con@pinit.in',
      parent: 'parent@pinit.in',
      student: 'student@pinit.in'
    };
    const targetEmail = emailMap[primaryRole] || 'admin@pinit.in';

    const handleQuickLogin = async () => {
      setIsLoggingIn(true);
      try {
        if (login) {
          await login(targetEmail, '111111');
        } else {
          setIsTesterBypass(true);
        }
      } catch {
        setIsTesterBypass(true);
      } finally {
        setIsLoggingIn(false);
      }
    };

    return (
      <div style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg, #090d16)'
      }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          padding: '32px',
          borderRadius: '16px',
          background: 'var(--card-bg, #111827)',
          border: '1px solid var(--border, #1f2937)',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            margin: '0 auto 16px'
          }}>
            🔒
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            {label ? `${label} Access Required` : 'Restricted Portal Access'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
            This section is restricted to authorized <strong>{allow.join(' / ')}</strong> roles.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoggingIn ? 'Authenticating...' : `🚀 Enter as Demo ${primaryRole.toUpperCase()} (Tester)`}
            </button>

            {process.env.NODE_ENV !== 'production' && (
              <button
                onClick={() => setIsTesterBypass(true)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: '#cbd5e1',
                  fontWeight: 500,
                  fontSize: '12px',
                  border: '1px solid #334155',
                  cursor: 'pointer'
                }}
              >
                Preview Portal (Tester Bypass - Dev Only)
              </button>
            )}

            <a
              href="/login"
              style={{
                fontSize: '12px',
                color: '#64748b',
                textDecoration: 'underline',
                marginTop: '6px'
              }}
            >
              Sign in on Main Login Page
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
