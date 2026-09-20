'use client';
// src/app/documents/page.tsx
// Institutional Digital Documents Vault for requesting and printing approved credentials.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from '@/lib/store/useAppStore';

interface DocumentLockerItem {
  id: string;
  type: string;
  purpose: string;
  status: 'Pending Approval' | 'Issued';
  dateRequested: string;
  dateIssued: string;
  verificationCode: string;
  major: string;
  year: string;
}

export default function DocumentVaultPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentLockerItem[]>([]);
  const [stats, setStats] = useState({ totalIssued: 0, pendingApprovals: 0, totalRequests: 0 });
  const [loading, setLoading] = useState(true);

  // Form states
  const [docType, setDocType] = useState('Bonafide Certificate');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Lightbox details
  const [selectedDoc, setSelectedDoc] = useState<DocumentLockerItem | null>(null);

  const ob = (user?.onboardingAnswers || {}) as Record<string, any>;
  const institutionName = ob.college || ob.university || ob.institution || 'PinIT Institute of Technology';
  const candidateRegisterNumber = user?.registerNumber && user.registerNumber !== 'Not available' ? user.registerNumber : (user?.id ? `REG-${user.id.slice(0, 8).toUpperCase()}` : 'REG-2026-001');

  const documentTypes = [
    'Bonafide Certificate',
    'Transfer Certificate (TC)',
    'Semester Marks Card',
    'Migration Certificate',
    'Course Completion Certificate'
  ];

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  async function loadDocuments() {
    setLoading(true);
    try {
      const data = await api.get<{ documents: DocumentLockerItem[]; stats: any }>('/api/documents/mine');
      setDocuments(data.documents || []);
      setStats(data.stats || { totalIssued: 0, pendingApprovals: 0, totalRequests: 0 });
    } catch {
      console.error('Failed to load documents stats');
    } finally {
      setLoading(false);
    }
  }

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) {
      toast.warning('Purpose Required', 'Please state a purpose for your document request.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post<{ ok: boolean; document: DocumentLockerItem }>('/api/documents/request', {
        type: docType,
        purpose: purpose.trim()
      });
      if (res?.ok) {
        toast.success('Document Requested 📄', 'Your official certificate request has been queued for verification.');
        setPurpose('');
        loadDocuments();
      }
    } catch {
      toast.error('Request Failed', 'Failed to request document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
      <div className="portal-page animate-fade-in" style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }}>
        
        {/* Style configurations */}
        <style>{`
          .docs-grid {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 20px;
            align-items: start;
          }
          @media (max-width: 900px) {
            .docs-grid {
              grid-template-columns: 1fr;
            }
          }
          .docs-card {
            background: var(--bg2);
            border: 1px solid var(--border);
            border-radius: var(--radius-xl);
            padding: 20px;
            box-shadow: var(--shadow-sm);
          }
          .docs-card-title {
            font-size: 10.5px;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            color: var(--t3);
            font-family: var(--font-mono);
            font-weight: 600;
            margin-bottom: 16px;
            display: block;
          }
          .form-label {
            font-size: 11.5px;
            font-weight: 700;
            color: var(--t2);
            margin-bottom: 6px;
            display: block;
          }
          .form-select, .form-input {
            width: 100%;
            height: 42px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--bg3);
            color: var(--t1);
            padding: 0 12px;
            font-size: 13px;
            outline: none;
            margin-bottom: 16px;
            transition: border 0.2s;
          }
          .form-select:focus, .form-input:focus {
            border-color: var(--accent);
          }
          .btn-primary {
            background: linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%);
            color: white;
            border: none;
            height: 42px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            transition: opacity 0.2s;
          }
          .btn-primary:hover {
            opacity: 0.9;
          }
          .stats-mini-box {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            margin-bottom: 20px;
          }
          .stat-mini-item {
            background: var(--bg3);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 12px;
            text-align: center;
          }
          .stat-mini-val {
            font-size: 18px;
            font-weight: 900;
            color: var(--accent);
          }
          .stat-mini-lbl {
            font-size: 9.5px;
            text-transform: uppercase;
            color: var(--t3);
            margin-top: 4px;
          }
          
          /* Certificate print CSS styles (DEF-037) */
          @media print {
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
            html, body {
              background: #ffffff !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 0 !important;
              height: auto !important;
              overflow: visible !important;
            }
            .portal-page {
              display: block !important;
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
            .docs-grid,
            .portal-page > div:not(.cert-modal-backdrop-print),
            .cert-controls-bar,
            .cert-print-btn,
            .modal-dismiss-btn {
              display: none !important;
            }
            .cert-modal-backdrop-print {
              position: static !important;
              display: block !important;
              background: transparent !important;
              padding: 0 !important;
              margin: 0 !important;
              backdrop-filter: none !important;
            }
            .cert-modal-box {
              max-width: 100% !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
              background: transparent !important;
            }
            .printable-cert-area {
              position: relative !important;
              width: 100% !important;
              max-width: 800px !important;
              margin: 0 auto !important;
              border: 6px double #4338ca !important;
              padding: 40px !important;
              background: #ffffff !important;
              color: #0f172a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              page-break-inside: avoid !important;
            }
          }
        `}</style>

        {/* Page Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            📂 Digital Credentials & Documents Vault
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 13.5 }}>
            Request verified academic transcripts, bonafide headers, or school leaving certificates with dynamic digital approval stamps.
          </p>
        </div>

        <div className="docs-grid">
          {/* Left Column: Form & Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="docs-card">
              <span className="docs-card-title">📜 Document Stats</span>
              <div className="stats-mini-box">
                <div className="stat-mini-item">
                  <div className="stat-mini-val">{stats.totalRequests}</div>
                  <div className="stat-mini-lbl">Requests</div>
                </div>
                <div className="stat-mini-item">
                  <div className="stat-mini-val">{stats.totalIssued}</div>
                  <div className="stat-mini-lbl">Issued</div>
                </div>
                <div className="stat-mini-item">
                  <div className="stat-mini-val">{stats.pendingApprovals}</div>
                  <div className="stat-mini-lbl">Pending</div>
                </div>
              </div>
            </div>

            <div className="docs-card">
              <span className="docs-card-title">✍️ Request Credentials</span>
              <form onSubmit={handleRequest}>
                <label className="form-label">Select Document Type</label>
                <select className="form-select" value={docType} onChange={e => setDocType(e.target.value)}>
                  {documentTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <label className="form-label">Purpose of Request</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Scholarship application, passport verification"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  required
                />

                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Request Certification →'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Status Lists */}
          <div className="docs-card">
            <span className="docs-card-title">📋 Active Document Locker</span>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--t3)' }}>Loading locker registry...</div>
            ) : documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--t3)' }}>No documents requested. Submit a form to request one.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                      <th style={{ padding: 12, textAlign: 'left', color: 'var(--t3)' }}>ID</th>
                      <th style={{ padding: 12, textAlign: 'left', color: 'var(--t3)' }}>Credential Title</th>
                      <th style={{ padding: 12, textAlign: 'left', color: 'var(--t3)' }}>Purpose</th>
                      <th style={{ padding: 12, textAlign: 'left', color: 'var(--t3)' }}>Requested Date</th>
                      <th style={{ padding: 12, textAlign: 'left', color: 'var(--t3)' }}>Approval Status</th>
                      <th style={{ padding: 12, textAlign: 'center', color: 'var(--t3)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 12, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--t2)' }}>{doc.id}</td>
                        <td style={{ padding: 12, fontWeight: 700 }}>{doc.type}</td>
                        <td style={{ padding: 12, color: 'var(--t2)' }}>{doc.purpose}</td>
                        <td style={{ padding: 12, color: 'var(--t3)', fontSize: 12 }}>{doc.dateRequested}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{
                            fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 700,
                            background: doc.status === 'Issued' ? 'var(--green-light)' : 'var(--amber-light)',
                            color: doc.status === 'Issued' ? 'var(--green)' : 'var(--amber)'
                          }}>
                            {doc.status}
                          </span>
                        </td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          {doc.status === 'Issued' ? (
                            <button
                              onClick={() => setSelectedDoc(doc)}
                              style={{ background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                            >
                              👁️ View & Print
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--t3)' }}>Awaiting Sign</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Certificate lightbox Overlay */}
        {selectedDoc && (
          <div className="cert-modal-backdrop-print" style={{
            position: 'fixed', inset: 0, zIndex: 1000, background: 'color-mix(in srgb, var(--bg) 55%, transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            backdropFilter: 'blur(4px)'
          }}>
            <div className="cert-modal-box" style={{
              width: '100%', maxWidth: 800, background: 'var(--card)', borderRadius: 20,
              padding: 24, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--t1)'
            }}>
              
              {/* Controls bar */}
              <div className="cert-controls-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>
                  Verification Frame: {selectedDoc.id}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={triggerPrint}
                    className="cert-print-btn"
                    style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    🖨️ Print Certificate
                  </button>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="modal-dismiss-btn"
                    style={{ background: 'var(--bg3)', color: 'var(--t2)', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Printable Document Box Container */}
              <div className="printable-cert-area" style={{
                border: '8px double var(--accent)', padding: 40, background: '#fff',
                color: '#0f172a',
                fontFamily: 'Georgia, serif', position: 'relative', textAlign: 'center'
              }}>
                {/* Background watermark badge */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.03, zIndex: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 180, pointerEvents: 'none'
                }}>
                  🎓
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Institutional Header */}
                  <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 900, textTransform: 'uppercase', color: '#1e3a8a', letterSpacing: '0.5px' }}>
                    {institutionName}
                  </h2>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '1px', marginBottom: 20 }}>
                    Office of the Registrar · Academic Credentials & Records Division
                  </div>
                  
                  <div style={{ width: 80, height: 1, background: '#cbd5e1', margin: '0 auto 30px' }} />

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic', color: '#334155', marginBottom: 24 }}>
                    Official {selectedDoc.type || 'Certification Document'}
                  </h3>

                  {/* Cert body text */}
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: '#1e293b', textAlign: 'justify', margin: '0 auto 30px', maxWidth: 640 }}>
                    This is to certify that student <strong>{user?.displayName || 'Enrolled Student'}</strong> is officially enrolled in the <strong>{selectedDoc.major || 'Computer Science & Engineering'}</strong> department as a <strong>{selectedDoc.year || 'Class of 2026'}</strong> under candidate register code <strong>{candidateRegisterNumber}</strong>.
                  </p>
                  
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: '#1e293b', textAlign: 'justify', margin: '0 auto 30px', maxWidth: 640 }}>
                    This document is issued upon formal request for the designated purpose: <em>"{selectedDoc.purpose}"</em>. It carries digital verification credentials issued dynamically on <strong>{selectedDoc.dateIssued || selectedDoc.dateRequested || new Date().toISOString().split('T')[0]}</strong>.
                  </p>

                  <div style={{ height: 40 }} />

                  {/* Signatures & Verification blocks */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'end', marginTop: 40 }}>
                    {/* Left: Verification code / QR */}
                    <div style={{ textAlign: 'left', display: 'flex', gap: 14, alignItems: 'center' }}>
                      <a
                        href={`/verify/${encodeURIComponent(selectedDoc.verificationCode)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', display: 'inline-block' }}
                      >
                        <div style={{ padding: 4, background: '#ffffff', borderRadius: 6, border: '1px solid #cbd5e1', display: 'inline-block' }}>
                          <svg width="60" height="60" viewBox="0 0 25 25" style={{ display: 'block' }}>
                            <rect width="25" height="25" fill="#ffffff" />
                            <rect x="1" y="1" width="7" height="7" fill="#0f172a" />
                            <rect x="2" y="2" width="5" height="5" fill="#ffffff" />
                            <rect x="3" y="3" width="3" height="3" fill="#0f172a" />
                            <rect x="17" y="1" width="7" height="7" fill="#0f172a" />
                            <rect x="18" y="2" width="5" height="5" fill="#ffffff" />
                            <rect x="19" y="3" width="3" height="3" fill="#0f172a" />
                            <rect x="1" y="17" width="7" height="7" fill="#0f172a" />
                            <rect x="2" y="18" width="5" height="5" fill="#ffffff" />
                            <rect x="3" y="19" width="3" height="3" fill="#0f172a" />
                            <rect x="9" y="3" width="1" height="1" fill="#0f172a" /><rect x="11" y="3" width="1" height="1" fill="#0f172a" />
                            <rect x="3" y="9" width="1" height="1" fill="#0f172a" /><rect x="3" y="11" width="1" height="1" fill="#0f172a" />
                            <rect x="10" y="10" width="5" height="5" fill="#0f172a" />
                            <rect x="11" y="11" width="3" height="3" fill="#ffffff" />
                            <rect x="12" y="12" width="1" height="1" fill="#0f172a" />
                            <rect x="9" y="17" width="2" height="1" fill="#0f172a" /><rect x="13" y="17" width="2" height="1" fill="#0f172a" />
                            <rect x="17" y="10" width="1" height="4" fill="#0f172a" />
                            <rect x="19" y="18" width="3" height="3" fill="#0f172a" />
                          </svg>
                        </div>
                      </a>
                      <div>
                        <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Secure Verify Code</div>
                        <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#1e3a8a' }}>{selectedDoc.verificationCode}</div>
                        <a
                          href={`/verify/${encodeURIComponent(selectedDoc.verificationCode)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 10, color: '#2563eb', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 2 }}
                        >
                          Verify Online ↗
                        </a>
                      </div>
                    </div>

                    {/* Right: Signature stamp */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontStyle: 'italic', fontFamily: '"Brush Script MT", cursive', color: '#1e3a8a', marginBottom: 2 }}>
                        Office of Registrar
                      </div>
                      <div style={{ width: 140, height: 1, background: '#94a3b8', margin: '4px 0 4px auto' }} />
                      <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#16a34a', fontWeight: 800, letterSpacing: '0.5px' }}>
                        🛡️ Authorized Digital Seal
                      </div>
                      <div style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'monospace', marginTop: 2 }}>
                        REF: {selectedDoc.verificationCode}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

      </div>
  );
}
