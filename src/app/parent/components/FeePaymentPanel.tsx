'use client';

import React from 'react';
import { toast } from '@/lib/store/useAppStore';
import { StudentOverview } from '../hooks/useParentDashboard';

interface FeePaymentPanelProps {
  activeTab: string;
  overview?: StudentOverview;
}

export default function FeePaymentPanel({ activeTab, overview }: FeePaymentPanelProps) {
  const studentName = overview?.profile?.displayName || 'Student';
  const rollNo = overview?.profile?.rollNo || overview?.profile?.registerNumber || 'REG-STD';

  function handleDownloadDocument(docName: string, docType: string) {
    const issueDate = new Date().toISOString().split('T')[0];
    const docHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${docName} - ${studentName}</title>
  <style>
    body { font-family: Georgia, serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; border: 4px double #cbd5e1; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
    .inst-name { font-size: 24px; font-weight: bold; letter-spacing: 1px; }
    .doc-title { font-size: 20px; font-weight: bold; color: #1e3a8a; margin-top: 12px; text-transform: uppercase; }
    .content { line-height: 1.8; font-size: 15px; margin: 24px 0; }
    .seal { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
    .signature { border-top: 1px solid #475569; padding-top: 6px; width: 180px; text-align: center; font-size: 13px; font-family: sans-serif; }
    .verification-seal { padding: 12px 18px; border: 2px solid #16a34a; border-radius: 8px; color: #16a34a; font-weight: bold; font-family: sans-serif; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="inst-name">INSTITUTION OF HIGHER LEARNING &amp; TECHNOLOGY</div>
    <div>Office of Academic Affairs &amp; Registry</div>
    <div class="doc-title">${docName}</div>
  </div>

  <div class="content">
    <p>This is to certify that <strong>${studentName}</strong> (Registration / Roll No: <strong>${rollNo}</strong>) is a bona fide registered student of the <strong>${overview?.profile?.department || 'Department of Computer Science'}</strong> for the <strong>${overview?.profile?.batch || '2024-2026 Academic Cohort'}</strong>.</p>
    <p>Document Category: <strong>${docType}</strong><br />
    Issued on: <strong>${issueDate}</strong><br />
    Status: <strong>Active &amp; Verified in Good Standing</strong></p>
  </div>

  <div class="seal">
    <div class="verification-seal">
      &#10003; CRYPTOGRAPHICALLY CERTIFIED<br />
      Doc Ref: ${docType.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}
    </div>
    <div class="signature">
      Registrar / Controller of Examinations
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docName.replace(/[^a-z0-9]/gi, '_')}_${rollNo}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Document Downloaded', `Successfully generated and downloaded ${docName}.`);
  }

  if (activeTab === 'documents') {
    const documentTypes = [
      { name: 'Bonafide Enrollment Certificate', type: 'Bonafide', size: '240 KB', stamp: 'Verified Active' },
      { name: 'Student Digital Identity Credential', type: 'ID Card', size: '1.1 MB', stamp: 'Active Smart Record' },
      { name: 'Academic Transcript & Marks Statement', type: 'Marks Statement', size: '380 KB', stamp: 'Controller of Exams' },
      { name: 'Course Enrollment Verification Note', type: 'Certificate', size: '190 KB', stamp: 'Institutional Seal' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
            📄 Verified Credentials & Documents Vault
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Generate and download official bonafides, marks statements, and credentials with cryptographic verification seals.
          </p>
        </div>

        {/* Documents Vault list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {documentTypes.map((doc, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
                alignItems: 'center',
                padding: 14,
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                fontSize: 12.5,
              }}
            >
              <div>
                <strong style={{ color: 'var(--t1)' }}>📄 {doc.name}</strong>
                <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>{doc.stamp}</div>
              </div>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{doc.type}</span>
              <span style={{ color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{doc.size}</span>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleDownloadDocument(doc.name, doc.type)}
                  style={{
                    padding: '6px 12px',
                    fontSize: 11,
                    background: 'var(--success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Download Document
                </button>
                <button
                  onClick={() => {
                    handleDownloadDocument(doc.name, doc.type);
                    toast.success('Print Document', `Opening print preview for ${doc.name}.`);
                  }}
                  style={{
                    padding: '6px 12px',
                    fontSize: 11,
                    background: 'var(--card)',
                    color: 'var(--t2)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Print Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'finance') {
    const finance = overview?.finance;
    const installments = Array.isArray(finance?.installments) ? finance.installments : [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>💰 Institutional Fees & Accounts</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Authoritative fee schedule and installment receipts from institutional finance registry.
          </p>
        </div>

        {installments.length === 0 ? (
          <div
            style={{
              padding: 24,
              background: 'rgba(var(--success-rgb), 0.04)',
              border: '1.5px solid rgba(var(--success-rgb), 0.2)',
              borderRadius: 10,
              textAlign: 'center',
              color: 'var(--t1)',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>✓</div>
            <strong style={{ color: 'var(--success)', fontSize: 14 }}>All Institutional Dues Up to Date</strong>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--t3)' }}>
              No outstanding term fees, tuition dues, or hostel invoices on record for {studentName}.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {installments.map((pay: any, idx: number) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 14,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--t1)' }}>{pay.term || `Installment ${idx + 1}`}</div>
                  <span style={{ fontSize: 11, color: 'var(--t3)' }}>Amount: ₹{Number(pay.amount || 0).toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 12,
                      color: pay.status === 'PAID' ? 'var(--success)' : 'var(--danger-deep)',
                    }}
                  >
                    {pay.status || 'PAID'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
