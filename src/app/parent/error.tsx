'use client';
import { useEffect } from 'react';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error service here
    console.error('[Page Error]', error.message, error.digest);
  }, [error]);
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: 40,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <h2 style={{ color: 'var(--t1, #fff)', margin: 0 }}>Something went wrong</h2>
      <p style={{ color: 'var(--t2, #888)', maxWidth: 400 }}>
        {error.message || 'An unexpected error occurred. Your data is safe.'}
      </p>
      {error.digest && (
        <code style={{ fontSize: 11, color: 'var(--t3, #555)' }}>
          Error ID: {error.digest}
        </code>
      )}
      <button
        onClick={reset}
        style={{
          padding: '10px 24px',
          background: 'var(--accent, #7c6af7)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Try Again
      </button>
    </div>
  );
}
