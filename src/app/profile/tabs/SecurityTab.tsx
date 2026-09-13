'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { toast } from '@/lib/store/useAppStore';
import { CS } from './types';

const FaceEnroll = dynamic(() => import('@/components/auth/FaceEnroll'), { ssr: false });

function SecurityFaceLogin() {
  const [faceEnrolled, setFaceEnrolled] = useState<boolean | null>(null);
  const [showEnroll,   setShowEnroll]   = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/face/enrolled', { credentials:'include', signal: controller.signal })
      .then(r => r.json())
      .then(d => setFaceEnrolled(d.enrolled))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setFaceEnrolled(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  async function removeEnrollment() {
    try {
      const res = await fetch('/api/auth/face/enroll', { method:'DELETE', credentials:'include' });
      if (!res.ok) throw new Error('Failed to remove face enrollment');
      setFaceEnrolled(false);
      setShowEnroll(false);
      toast.success('Face enrollment removed');
    } catch {
      toast.error('Failed to remove face enrollment');
    }
  }

  return (
    <div style={CS.card}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div>
          <div style={CS.cardTitle}>👤 Face Login</div>
          <div style={{ fontSize:12, color:'var(--t3)', lineHeight:1.5 }}>
            {faceEnrolled === null && 'Checking…'}
            {faceEnrolled === false && 'Login to PinIT using just your face — no password needed.'}
            {faceEnrolled === true  && 'Your face is enrolled. Login with your webcam or phone camera.'}
          </div>
        </div>
        {faceEnrolled === true && !showEnroll && (
          <span style={{ fontSize:10, fontWeight:700, color:'var(--green)', background:'rgba(var(--success-deep-rgb), 0.12)', padding:'3px 9px', borderRadius:100, whiteSpace:'nowrap', border:'1px solid rgba(var(--success-deep-rgb), 0.25)' }}>
            ✓ Active
          </span>
        )}
      </div>
      {!showEnroll && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button onClick={() => setShowEnroll(true)} className="btn-ghost btn-sm">
            {faceEnrolled ? '↺ Re-enroll Face' : '+ Set up Face Login'}
          </button>
          <Link href="/qr-login?tab=face" style={{ textDecoration:'none' }}>
            <button className="btn-ghost btn-sm">Test Face Login →</button>
          </Link>
          {faceEnrolled && (
            <button onClick={removeEnrollment} className="btn-ghost btn-sm" style={{ color:'var(--coral)' }}>✕ Remove</button>
          )}
        </div>
      )}
      {showEnroll && (
        <div style={{ marginTop:12 }}>
          <FaceEnroll
            onSuccess={() => { setFaceEnrolled(true); setShowEnroll(false); }}
            onCancel={() => setShowEnroll(false)}
          />
        </div>
      )}
    </div>
  );
}

interface SecurityTabProps {
  logout: () => Promise<void>;
  router: { push: (href: string) => void };
}

export default function SecurityTab({ logout, router }: SecurityTabProps) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }} className="animate-fade-in">
      <div style={CS.card}>
        <div style={CS.cardTitle}>🔒 Password</div>
        <Link href="/reset-password" style={{ textDecoration:'none' }}>
          <button className="btn-ghost btn-sm">Change Password →</button>
        </Link>
      </div>
      <SecurityFaceLogin />
      <div style={CS.card}>
        <div style={CS.cardTitle}>📱 QR Login</div>
        <div style={{ fontSize:12, color:'var(--t3)', marginBottom:10, lineHeight:1.5 }}>
          Scan a QR code on another device. Confirm with your phone — no typing needed.
        </div>
        <Link href="/qr-login" style={{ textDecoration:'none' }}>
          <button className="btn-ghost btn-sm">Open QR Login →</button>
        </Link>
      </div>
      <div style={{ ...CS.card, borderColor:'rgba(var(--danger-rgb), 0.2)' }}>
        <div style={{ ...CS.cardTitle, color:'var(--coral)' }}>⚠ Danger Zone</div>
        <button onClick={async () => { await logout(); router.push('/login'); }} className="btn-ghost btn-sm" style={{ color:'var(--coral)', borderColor:'rgba(var(--danger-rgb), 0.2)' }}>
          ⏻ Sign Out of All Devices
        </button>
      </div>
    </div>
  );
}
