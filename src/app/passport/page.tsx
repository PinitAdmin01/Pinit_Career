'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PassportRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/profile?tab=passport');
  }, [router]);
  return <div style={{ padding: 40, color: 'var(--t3)', fontSize: 13 }}>Redirecting to Profile Skill Passport...</div>;
}
