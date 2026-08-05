'use client';

// components/auth/FaceEnroll.tsx
// High-precision face enrollment using FaceAnalyzer logic.

import { useState } from 'react';
import FaceAnalyzer from './FaceAnalyzer';

interface Props {
  username?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FaceEnroll({ username = '', onSuccess, onCancel }: Props) {
  const [enrolled, setEnrolled] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: 'var(--t1)' }}>
          📸 Biometric Face Enrollment
        </h3>
        <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: 0, maxWidth: 320 }}>
          Capture your 128D neural facial embedding for fast, passwordless 100% accurate sign-ins.
        </p>
      </div>

      <FaceAnalyzer
        mode="enroll"
        username={username}
        onSuccess={() => {
          setEnrolled(true);
          onSuccess?.();
        }}
        onCancel={onCancel}
      />

      {enrolled && (
        <div style={{
          padding: '10px 16px',
          borderRadius: 10,
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: 12.5,
          textAlign: 'center'
        }}>
          ✓ Face Biometrics registered! You can now sign in using your face.
        </div>
      )}
    </div>
  );
}
