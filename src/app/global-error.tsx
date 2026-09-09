'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: 48, textAlign: 'center', fontFamily: 'system-ui', background: '#090d16', color: '#fff' }}>
        <h1 style={{ fontSize: 28, marginBottom: 8, color: '#ef4444' }}>Application Error</h1>
        <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto 20px auto' }}>
          {error?.message || 'A critical error occurred.'}
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: '#6366f1',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
