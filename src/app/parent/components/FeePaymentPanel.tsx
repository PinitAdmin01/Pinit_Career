'use client';

import React from 'react';
import { toast } from '@/lib/store/useAppStore';

interface FeePaymentPanelProps {
  activeTab: string;
}

export default function FeePaymentPanel({ activeTab }: FeePaymentPanelProps) {
  if (activeTab === 'documents') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
            📄 verified Credentials & Documents Vault
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Download bonafides, marks cards, fee receipts, and transfer certificates anytime with cryptographic
            verification seals.
          </p>
        </div>

        {/* Documents Vault list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'Bonafide Enrollment Certificate', type: 'Bonafide', size: '180 KB', stamp: 'Verified Oct 2025' },
            { name: 'Student Digital Identity Card', type: 'ID Card', size: '1.2 MB', stamp: 'Active Smart Card' },
            { name: 'Semester 1 Official Marks Card', type: 'Marks Card', size: '420 KB', stamp: 'Signed by Registrar' },
            { name: 'Python Recursion Quest Certificate', type: 'Certificates', size: '350 KB', stamp: 'Gold Badge Credential' },
            { name: 'Term 1 Installment Fee Receipt', type: 'Fee Receipts', size: '95 KB', stamp: 'Transaction ref #9284' },
            { name: 'Transfer Certificate (TC)', type: 'Transfer Certificate', size: '510 KB', stamp: 'Conditional release draft' },
          ].map((doc, idx) => (
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
                  onClick={() => {
                    toast.success('Document Downloaded', `Successfully compiled and downloaded ${doc.name}.pdf`);
                  }}
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
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    toast.success(
                      'Print Requested',
                      `A physical copy of ${doc.name} will be dispatched to your registered address.`
                    );
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
                  Request Print
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'finance') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>💰 Fees & Payments Portal</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Audit college dues and pay pending fee installments online securely via Razorpay.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'inst_1', term: 'Term 1 Tuition Fees', amt: '₹45,000', amountNum: 45000, status: 'PAID' },
            { id: 'inst_2', term: 'Term 2 Hostel & Mess Fees', amt: '₹12,000', amountNum: 12000, status: 'PENDING' },
          ].map((pay, idx) => (
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
                <div style={{ fontWeight: 700, color: 'var(--t1)' }}>{pay.term}</div>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>Amount: {pay.amt}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 12,
                    color: pay.status === 'PAID' ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  {pay.status}
                </span>

                {pay.status === 'PENDING' && (
                  <button
                    onClick={() => {
                      toast.error(
                        'Fee catalog not configured',
                        'Institutional fee amounts must be priced server-side. Client amounts are rejected for security.'
                      );
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--success), var(--success-deep))',
                      color: 'var(--text)',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(var(--success-rgb), 0.25)',
                    }}
                    className="btn-glow"
                  >
                    💳 Pay via Razorpay ➔
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
