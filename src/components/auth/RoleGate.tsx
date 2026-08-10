'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

type RoleGateProps = {
  allow: string[];
  children: ReactNode;
  label?: string;
};

/** Client-side role gate for portal pages (API RBAC must still enforce). */
export function RoleGate({ allow, children, label }: RoleGateProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 40, color: 'var(--t3, #64748b)', textAlign: 'center' }}>
        Loading authentication status...
      </div>
    );
  }

  const role = user?.role || 'student';
  if (!user || !allow.includes(role)) {
    return (
      <div style={{ padding: 40, color: '#dc2626', textAlign: 'center', fontWeight: 600 }}>
        Access Denied{label ? `: ${label}` : '.'}
      </div>
    );
  }

  return <>{children}</>;
}
