'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

export default function PlacementRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/career-intelligence?tab=tracker');
  }, [router]);
  return (
    <div style={{ padding: 40, color: 'var(--t2)', fontSize: 13 }}>
      <p style={{ marginBottom: 8 }}>Redirecting to AI Placement Predictor...</p>
      <Link href="/career-intelligence?tab=tracker" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
        Click here if not redirected automatically →
      </Link>
    </div>
  );
}
