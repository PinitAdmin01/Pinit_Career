'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

type RoleGateProps = {
  allow: string[];
  children: ReactNode;
  label?: string;
};

/** Client-side role gate for portal pages. Access is denied unless the authenticated user holds an allowed role. */
export function RoleGate({ allow, children, label }: RoleGateProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 40, color: 'var(--t3, #64748b)', textAlign: 'center' }}>
        Loading authentication status...
      </div>
    );
  }

  const role = user?.role || null;
  const isAuthorized = user !== null && role !== null && allow.includes(role);

  if (!isAuthorized) {
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
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26.5px',
            margin: '0 auto 16px'
          }}>
            🔒
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            {label ? `${label} Access Required` : 'Restricted Portal Access'}
          </h2>
          <p style={{ fontSize: '14.5px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
            This section is restricted to authorized <strong>{allow.join(' / ')}</strong> role{allow.length > 1 ? 's' : ''}.
            {user === null
              ? ' Please sign in with a verified institutional account.'
              : ` Your current role (${role || 'unknown'}) does not have permission to access this portal.`}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href="/login"
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14.5px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              🔑 Sign In with Institutional Account
            </a>

            <a
              href="/"
              style={{
                fontSize: '13px',
                color: '#64748b',
                textDecoration: 'underline',
                marginTop: '6px'
              }}
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
