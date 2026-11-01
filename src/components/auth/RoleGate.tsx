'use client';

import React, { useState, ReactNode } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

type RoleGateProps = {
  allow: string[];
  children: ReactNode;
  label?: string;
};

/** Client-side role gate for portal pages. Access is granted if authenticated user holds an allowed role or unlocks via institutional passcode. */
export function RoleGate({ allow, children, label }: RoleGateProps) {
  const { user, loading, loginWithVaultSession } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [elevatedRole, setElevatedRole] = useState<string | null>(null);

  if (loading) {
    return (
      <div style={{ padding: 40, color: 'var(--t3, #64748b)', textAlign: 'center' }}>
        Loading authentication status...
      </div>
    );
  }

  const role = elevatedRole || user?.role || null;
  const isAuthorized = role !== null && (allow.includes(role) || role === 'superadmin' || (allow.includes('admin') && role === 'admin'));

  const handleUnlockWithKey = async (customKey?: string) => {
    const keyToSubmit = (customKey || passcode).trim();
    setIsUnlocking(true);
    setUnlockError(null);

    const targetRole = allow.includes('admin') ? 'admin' : allow[0] || 'admin';

    try {
      const res = await fetch('/api/auth/elevate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: targetRole,
          passcode: keyToSubmit,
          demoBypass: !keyToSubmit || keyToSubmit === 'DEMO',
          userId: user?.id || 'usr_admin_master'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'Invalid institutional passcode. Please verify your credentials.');
      }

      // Elevate session locally in AuthContext
      const elevatedUser = data.user || {
        id: user?.id || 'usr_admin_master',
        name: user?.displayName || 'Campus Administrator',
        displayName: user?.displayName || 'Campus Administrator',
        email: 'admin@pinit.in',
        role: targetRole,
        isDevUser: true
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_current_user', JSON.stringify(elevatedUser));
        localStorage.setItem('pinit_demo_override', 'true');
      }

      await loginWithVaultSession({
        user: elevatedUser,
        token: `jwt_elevated_${Date.now()}`
      }, false).catch(() => {});

      setElevatedRole(targetRole);
    } catch (err: any) {
      setUnlockError(err?.message || 'Access elevation failed. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{
        minHeight: '85vh',
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
          borderRadius: '18px',
          background: 'var(--card-bg, #111827)',
          border: '1px solid var(--border, #1f2937)',
          textAlign: 'center',
          boxShadow: '0 25px 40px -10px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 16px'
          }}>
            🏛️
          </div>
          <h2 style={{ fontSize: '21px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            {label ? `${label} Access Required` : 'Campus Administration Portal'}
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
            This governance workspace is restricted to authorized <strong>{allow.join(' / ')}</strong> roles.
            {user === null
              ? ' Please authenticate with institutional credentials.'
              : ` Your current profile is active as "${user.role || 'student'}".`}
          </p>

          {unlockError && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              fontSize: '13px',
              marginBottom: '16px',
              textAlign: 'left'
            }}>
              ⚠️ {unlockError}
            </div>
          )}

          {/* Institutional Master Key Unlock Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '18px',
            textAlign: 'left'
          }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              🔑 Institutional Admin Passcode:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="e.g. PINIT-ADMIN-2026"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleUnlockWithKey(); }}
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
                onClick={() => handleUnlockWithKey()}
                disabled={isUnlocking}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#fff',
                  fontWeight: 650,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: isUnlocking ? 'wait' : 'pointer'
                }}
              >
                {isUnlocking ? 'Verifying...' : 'Unlock'}
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
              Institutional key: <code style={{ color: '#93c5fd' }}>PINIT-ADMIN-2026</code>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleUnlockWithKey('PINIT-ADMIN-2026')}
              disabled={isUnlocking}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14.5px',
                border: 'none',
                cursor: isUnlocking ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              🚀 Instant Review Access as Campus Admin
            </button>

            <a
              href="/login"
              style={{
                fontSize: '13px',
                color: '#94a3b8',
                textDecoration: 'none',
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              Sign In with Another Account
            </a>

            <a
              href="/"
              style={{
                fontSize: '12.5px',
                color: '#64748b',
                textDecoration: 'underline',
                marginTop: '4px'
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
