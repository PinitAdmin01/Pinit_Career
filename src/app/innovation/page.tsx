'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InnovationAliasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/innovation-hub');
  }, [router]);

  return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>
      Redirecting to Innovation Hub...
    </div>
  );
}
