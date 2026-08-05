'use client';

import { useAuth } from '@/lib/context/AuthContext';
import TeacherDashboard from '@/components/teacher/TeacherDashboard';

import { Suspense } from 'react';

function TeacherPageContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 40, color: 'var(--t3, #64748b)', textAlign: 'center' }}>
        Loading authentication status...
      </div>
    );
  }

  // Allow teacher, admin, or superadmin roles
  if (!user || !['teacher', 'admin', 'superadmin'].includes(user.role)) {
    return (
      <div style={{ padding: 40, color: '#dc2626', textAlign: 'center', fontWeight: 600 }}>
        Access Denied: Teacher or Admin access required.
      </div>
    );
  }

  // Deep department fallback check
  const actualDepartment = 
    (user as any).department || 
    (user as any).dept || 
    (user as any).department_name || 
    (user as any).user_metadata?.department || 
    'Computer Science & AI';

  return (
    <TeacherDashboard
      teacher={{
        id: String(user.id || ''),
        name: String(user.display_name || user.username || 'Faculty User'),
        username: String(user.username || ''),
        role: String(user.role || 'teacher'),
        department: String(actualDepartment)
      }}
      onLogout={() => {
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
