'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortfolioRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/profile?tab=portfolio');
  }, [router]);
  return <div style={{ padding: 40, color: 'var(--t3)', fontSize: 13 }}>Redirecting to Profile Portfolio...</div>;
}
