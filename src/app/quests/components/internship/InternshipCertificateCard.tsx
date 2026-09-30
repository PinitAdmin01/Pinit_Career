'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface InternshipCertificateCardProps {
  certificateId: string;
  studentName?: string;
  planTitle?: string;
  companyName?: string;
  completedAt?: string | null;
  onClose: () => void;
}

export const InternshipCertificateCard: React.FC<InternshipCertificateCardProps> = ({
  certificateId,
  studentName = 'Engineer',
  planTitle = 'Python Job Simulation (1 Month)',
  companyName = 'Simulated Host Organization',
  completedAt,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const verifyPath = `/verify/${encodeURIComponent(certificateId)}`;
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${verifyPath}`
    : `https://pinit.app${verifyPath}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        background: 'rgba(5, 7, 15, 0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 14, 26, 0.95))',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 640,
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7), inset 0 0 30px rgba(16, 185, 129, 0.05)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 26 }}>📜</span>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
                Official Internship Credential
              </h3>
            </div>
            <span style={{ fontSize: 12.5, color: '#10b981', fontWeight: 700 }}>
              Cryptographically Signed & Verifiable SHA-256 Record
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--t3)', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Certificate Display Card */}
        <div
          style={{
            borderRadius: 14,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Issued To
              </span>
              <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
                {studentName}
              </span>
              <span style={{ fontSize: 13, color: 'var(--t2)' }}>
                {planTitle} · Host: {companyName}
              </span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 8,
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                color: '#facc15',
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              <span>⚠️</span>
              <span>Simulated Experience</span>
            </div>
          </div>

          {/* QR Code and Credential Details */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              alignItems: 'center',
              flexWrap: 'wrap',
              background: 'rgba(15, 23, 42, 0.5)',
              padding: 16,
              borderRadius: 12,
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ padding: 8, borderRadius: 8, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QRCodeSVG value={verifyUrl} size={110} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220, flex: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t4)', textTransform: 'uppercase' }}>
                Credential Identifier
              </span>
              <span style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                {certificateId}
              </span>

              {completedAt && (
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                  Completed: {new Date(completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}

              <a
                href={verifyPath}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#818cf8',
                  textDecoration: 'none',
                  marginTop: 2,
                }}
              >
                Open public verification page →
              </a>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{copied ? '✓ Copied URL' : '🔗 Copy Shareable Link'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: '#10b981',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipCertificateCard;
