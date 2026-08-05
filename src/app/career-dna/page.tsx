'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CareerDnaRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/profile?tab=career-dna');
  }, [router]);
  return <div style={{ padding: 40, color: 'var(--t3)', fontSize: 13 }}>Redirecting to Profile Career DNA...</div>;
}
