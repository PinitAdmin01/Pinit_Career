'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyQueryHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    const certId = searchParams.get('certId') || searchParams.get('credentialId') || searchParams.get('id');
    if (certId && certId.trim()) {
      router.replace(`/verify/${encodeURIComponent(certId.trim())}`);
    }
  }, [searchParams, router]);

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    router.push(`/verify/${encodeURIComponent(inputVal.trim())}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #090d16)',
      color: 'var(--text, #f8fafc)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: 640, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 20,
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          marginBottom: 16
        }}>
          <span style={{ fontSize: 17.5 }}>🛡️</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#a5b4fc', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            PinIT Trust & Verification Gateway
          </span>
        </div>

        <h1 style={{ fontSize: 35, fontWeight: 900, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
          Official Credential Verification
        </h1>
        <p style={{ fontSize: 15.5, color: 'var(--text-muted, #94a3b8)', margin: '0 0 32px 0', lineHeight: 1.5 }}>
          Verify authentic student project certificates, competency proofs, and HMAC-SHA256 evidence records.
        </p>

        <form onSubmit={handleManualLookup} style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
        }}>
          <label style={{ textAlign: 'left', fontSize: 13, fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
            Enter Certificate ID or Evidence Hash:
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. PIN-GH-8F92A10C or ev_1726000000_a1b2c3d4"
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                fontSize: 14.5,
                fontFamily: 'monospace'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                border: 'none',
                background: '#6366f1',
                color: '#fff',
                fontSize: 14.5,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Verify
            </button>
          </div>
        </form>

        <div style={{ marginTop: 24 }}>
          <Link href="/projects" style={{ color: '#818cf8', fontSize: 14.5, textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Projects Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#fff' }}>
        Loading Verification Gateway...
      </div>
    }>
      <VerifyQueryHandler />
    </Suspense>
  );
}
