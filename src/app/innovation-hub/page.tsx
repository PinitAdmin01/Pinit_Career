'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { InnovationHub } from '@/components/projects/InnovationHub';

function InnovationHubPageContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const studentId = (user && typeof user.id === 'string') ? user.id : 'demo_student_01';
  const studentName = (user && typeof (user as any).name === 'string')
    ? (user as any).name
    : (user?.displayName || 'Current Student');
  const studentAvatar = user?.avatar || (user as any)?.image || (user as any)?.avatarUrl;
  const initialJoinSquadId = searchParams?.get('join') || undefined;
  const initialRepo = searchParams?.get('repo') || undefined;
  const initialTitle = searchParams?.get('title') || undefined;
  const initialProblem = searchParams?.get('problem') || undefined;

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 0 40px' }} className="fade-in">
      <InnovationHub
        studentId={studentId}
        studentName={studentName}
        studentAvatar={studentAvatar}
        initialJoinSquadId={initialJoinSquadId}
        initialRepoUrl={initialRepo}
        initialTitle={initialTitle}
        initialProblem={initialProblem}
      />
    </div>
  );
}

export default function InnovationHubPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Loading Innovation Hub...</div>}>
      <InnovationHubPageContent />
    </Suspense>
  );
}
