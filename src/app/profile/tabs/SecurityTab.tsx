'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { toast } from '@/lib/store/useAppStore';
import { CS, modalOverlayStyle, modalContentStyle } from './types';

const FaceEnroll = dynamic(() => import('@/components/auth/FaceEnroll'), { ssr: false });

function BiometricHardwareModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div style={modalOverlayStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div
        style={{ ...modalContentStyle, maxWidth: 460 }}
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🖥️</span>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--font-display)' }}>
              Biometric Hardware Enrollment
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 18, padding: 4 }}
          >
            ✕
          </button>
        </div>

        <div style={{
          background: 'var(--accent-light)',
          border: '1px solid var(--accent)',
          borderRadius: 12,
          padding: 14,
          fontSize: 13,
          color: 'var(--t1)',
          lineHeight: 1.5,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span>ℹ️</span>
          <span>Hardware biometric authentication is not configured for this device or browser.</span>
        </div>

        <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: 0, lineHeight: 1.6 }}>
          Hardware biometric authentication is not configured for this device or browser. You can sign in using your account password or the PinIT Vault QR code scanner.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary btn-sm"
            style={{ padding: '8px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

interface SecurityFaceLoginProps {
  onOpenBiometricInfo?: () => void;
}

function SecurityFaceLogin({ onOpenBiometricInfo }: SecurityFaceLoginProps) {
  const [faceEnrolled, setFaceEnrolled] = useState<boolean | null>(null);
  const [showEnroll,   setShowEnroll]   = useState(false);
  const [localModal,   setLocalModal]   = useState(false);
  const handleOpenInfo = onOpenBiometricInfo || (() => setLocalModal(true));

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
          <button
            type="button"
            onClick={handleOpenInfo}
            className="btn-ghost btn-sm"
            title="Hardware biometric authentication is not configured for this device or browser."
          >
            Biometric Hardware Info →
          </button>
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
      {!onOpenBiometricInfo && localModal && (
        <BiometricHardwareModal onClose={() => setLocalModal(false)} />
      )}
    </div>
  );
}

interface SecurityTabProps {
  logout: () => Promise<void>;
  router: { push: (href: string) => void };
}

export default function SecurityTab({ logout, router }: SecurityTabProps) {
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }} className="animate-fade-in">
      <div style={CS.card}>
        <div style={CS.cardTitle}>🔒 Password</div>
        <Link href="/reset-password" style={{ textDecoration:'none' }}>
          <button className="btn-ghost btn-sm">Change Password →</button>
        </Link>
      </div>
      <SecurityFaceLogin onOpenBiometricInfo={() => setShowBiometricModal(true)} />
      <div style={CS.card}>
        <div style={CS.cardTitle}>📱 QR &amp; Hardware Biometrics</div>
        <div style={{ fontSize:12, color:'var(--t3)', marginBottom:10, lineHeight:1.5 }}>
          Scan a QR code on another device or authenticate with PinIT Vault.
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg3)',
            border: '1px dashed var(--border)',
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--t2)'
          }}
          title="Hardware biometric authentication is not configured for this device or browser."
        >
          <span style={{ fontSize: 14 }}>ℹ️</span>
          <span>Hardware biometric authentication is not configured for this device or browser.</span>
        </div>
        <button
          type="button"
          onClick={() => setShowBiometricModal(true)}
          className="btn-ghost btn-sm"
          title="Hardware biometric authentication is not configured for this device or browser."
        >
          Biometric Hardware Info →
        </button>
      </div>
      <div style={{ ...CS.card, borderColor:'rgba(var(--danger-rgb), 0.2)' }}>
        <div style={{ ...CS.cardTitle, color:'var(--coral)' }}>⚠ Danger Zone</div>
        <button onClick={async () => { await logout(); router.push('/login'); }} className="btn-ghost btn-sm" style={{ color:'var(--coral)', borderColor:'rgba(var(--danger-rgb), 0.2)' }}>
          ⏻ Sign Out of All Devices
        </button>
      </div>

      {showBiometricModal && (
        <BiometricHardwareModal onClose={() => setShowBiometricModal(false)} />
      )}
    </div>
  );
}
