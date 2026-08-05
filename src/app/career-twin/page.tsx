'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CareerTwinRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/learning?tab=twin');
  }, [router]);
  return <div style={{ padding: 40, color: 'var(--t3)', fontSize: 13 }}>Redirecting to Learning & Twin Hub...</div>;
}
