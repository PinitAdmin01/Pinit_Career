'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlacementRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/internships?tab=predictor');
  }, [router]);
  return <div style={{ padding: 40, color: 'var(--t3)', fontSize: 13 }}>Redirecting to Placement Predictor...</div>;
}
