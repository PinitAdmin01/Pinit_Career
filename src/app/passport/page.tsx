'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PassportRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/quests?tab=passport');
  }, [router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--t2)', gap: 12 }}>
      <div style={{ fontSize: 32, animation: 'spin 1.5s linear infinite' }}>🛂</div>
      <p style={{ fontSize: 14, fontWeight: 700 }}>Entering Verifiable Skill Passport & Career Transcript...</p>
    </div>
  );
}
