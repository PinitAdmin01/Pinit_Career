'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CodeWarsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/arena?tab=code_wars');
  }, [router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--t2)', gap: 12 }}>
      <div style={{ fontSize: 35, animation: 'spin 1.5s linear infinite' }}>⚔️</div>
      <p style={{ fontSize: 15.5, fontWeight: 700 }}>Entering 1v1 Code Wars Combat Arena...</p>
    </div>
  );
}
