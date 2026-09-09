'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CareerOS Global Error Handler]', error);
  }, [error]);

  return (
    <div style={{ padding: 48, textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8, color: '#ef4444' }}>Something went wrong</h1>
      <p style={{ color: '#64748b', maxWidth: 480, margin: '0 auto 20px auto' }}>
        {error?.message || 'An unexpected application error occurred.'}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: '#4f46e5',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
        <a
          href="/"
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            color: '#334155',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
