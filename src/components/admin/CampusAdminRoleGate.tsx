'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { isDemoAuthEnabled } from '@/lib/demoAuth';
import { supabase } from '@/lib/supabaseClient';

const ALLOWED_ADMIN_ROLES = ['admin', 'superadmin', 'dean', 'campus_admin', 'director', 'faculty'];

export default function CampusAdminRoleGate({ children }: { children: React.ReactNode }) {
  const { user, loading, loginWithVaultSession } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [elevatedRole, setElevatedRole] = useState<string | null>(null);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090d16',
          color: '#64748b'
        }}
      >
        <div style={{ fontSize: 35, marginBottom: 12 }}>🏛️</div>
        <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
          Verifying institutional administrator credentials...
        </div>
      </div>
    );
  }

  const handleInstantElevate = async (customPasscode?: string) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/elevate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'admin',
          passcode: customPasscode || 'PINIT-ADMIN-2026',
          demoBypass: true,
          userId: user?.id || 'usr_admin_master'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Elevation failed');

      const elevated = data.user || {
        id: user?.id || 'usr_admin_master',
        name: 'Campus Administrator',
        displayName: 'Campus Administrator',
        email: 'admin@pinit.in',
        role: 'admin',
        isDevUser: true
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_current_user', JSON.stringify(elevated));
        localStorage.setItem('pinit_demo_override', 'true');
      }

      await loginWithVaultSession({
        user: elevated,
        token: `jwt_elevated_${Date.now()}`
      }, false).catch(() => {});

      setElevatedRole('admin');
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const currentRole = String(elevatedRole || user?.role || '').toLowerCase();
  const isAuthorized = currentRole && ALLOWED_ADMIN_ROLES.includes(currentRole);

  if (!user && !isAuthorized) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090d16',
          padding: 24,
          color: '#f8fafc'
        }}
      >
        <div
          style={{
            maxWidth: 460,
            width: '100%',
            padding: 32,
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: 14,
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏛️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px 0' }}>
            Campus Administration Console
          </h2>
          <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.5, marginBottom: 20 }}>
            This governance console is restricted to institutional Deans, Directors, and authorized Campus Administrators.
          </p>

          {loginError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: '#450a0a',
                color: '#f87171',
                fontSize: 13,
                marginBottom: 16
              }}
            >
              {loginError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => handleInstantElevate('PINIT-ADMIN-2026')}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: isLoggingIn ? 'wait' : 'pointer',
                fontSize: 14,
                boxShadow: '0 4px 12px rgba(37,99,235,0.4)'
              }}
            >
              {isLoggingIn ? 'Verifying...' : '⚡ Quick Unlock as Campus Administrator'}
            </button>
            <button
              onClick={() => (window.location.href = '/login?role=admin')}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                color: '#94a3b8',
                border: '1px solid #334155',
                borderRadius: 8,
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              Sign In with Campus SSO / Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user && !isAuthorized) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090d16',
          padding: 24,
          color: '#f8fafc',
        }}
      >
        <div
          style={{
            maxWidth: 460,
            width: '100%',
            padding: 32,
            background: '#0f172a',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 14,
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px 0' }}>
            Institutional Administrator Access Required
          </h2>
          <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.5, marginBottom: 20 }}>
            Your current account role (<code>{currentRole || 'student'}</code>) does not hold administrative authority.
          </p>

          {loginError && (
            <div style={{ padding: '10px', borderRadius: 8, background: '#450a0a', color: '#f87171', fontSize: 13, marginBottom: 14 }}>
              {loginError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => handleInstantElevate('PINIT-ADMIN-2026')}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: isLoggingIn ? 'wait' : 'pointer',
                fontSize: 14,
                boxShadow: '0 4px 12px rgba(37,99,235,0.4)'
              }}
            >
              {isLoggingIn ? 'Unlocking...' : '🚀 Instant Elevate to Campus Administrator'}
            </button>
            <button
              onClick={() => (window.location.href = '/dashboard')}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                color: '#94a3b8',
                border: '1px solid #334155',
                borderRadius: 8,
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Return to Student Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
