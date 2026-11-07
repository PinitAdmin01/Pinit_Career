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

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 0 40px' }} className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26.5, fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.3px' }}>
            Innovation Hub & Collaborative Squads
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: 14.5, color: 'var(--t3)' }}>
            Form 3-person hackathon squads, build production prototypes, and submit verified repositories for jury evaluation.
          </p>
        </div>
      </div>

      <InnovationHub
        studentId={studentId}
        studentName={studentName}
        studentAvatar={studentAvatar}
        initialJoinSquadId={initialJoinSquadId}
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
