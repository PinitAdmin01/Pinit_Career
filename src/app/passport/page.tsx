'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PassportRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    let targetStudentId = 'usr_demo_student_01';
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('pinit_current_user') || localStorage.getItem('pinit_user');
        if (stored) {
          const user = JSON.parse(stored);
          if (user?.id) targetStudentId = user.id;
        }
      } catch {}
    }
    router.replace(`/university/portfolio/${encodeURIComponent(targetStudentId)}`);
  }, [router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--t2)', gap: 12 }}>
      <div style={{ fontSize: 35, animation: 'spin 1.5s linear infinite' }}>🛂</div>
      <p style={{ fontSize: 15.5, fontWeight: 700 }}>Entering Verifiable Skill Passport & Career Portfolio...</p>
    </div>
  );
}
