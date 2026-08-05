'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplicationsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/career-intelligence?tab=applications');
  }, [router]);
  return <div style={{ padding: 40, color: 'var(--t3)', fontSize: 13 }}>Redirecting to Career Intelligence...</div>;
}
