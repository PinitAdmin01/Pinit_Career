'use client';

import { Suspense } from 'react';
import TeacherRoleGate from '@/components/teacher/TeacherRoleGate';

export default function AdminTeacherPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t3)', textAlign: 'center' }}>Loading Teacher Dashboard...</div>}>
      <TeacherRoleGate />
    </Suspense>
  );
}
