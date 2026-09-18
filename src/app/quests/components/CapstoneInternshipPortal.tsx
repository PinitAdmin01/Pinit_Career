'use client';

import React, { useState, useMemo } from 'react';

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────
export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'approved' | 'in_review' | 'pending' | 'complete';
  dueDate?: string;
}

export interface CapstoneResult {
  planId: string;
  planTitle: string;
  studentName: string;
  submittedAt: string;
  milestonesCompleted: number;
  totalMilestones: number;
  certificateHash: string;
}

interface CapstoneInternshipPortalProps {
  planId: string;
  planTitle: string;
  studentName: string;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────
// Milestone data
// ─────────────────────────────────────────────────────────────────────
const defaultMilestones: Milestone[] = [
  {
    id: 's1', title: 'Sprint 1: Architecture & Data Schema',
    description: 'Design system architecture and define data schemas for the project foundation.',
    status: 'approved', dueDate: 'Week 2',
  },
  {
    id: 's2', title: 'Sprint 2: Core Microservices & APIs',
    description: 'Implement core microservices with RESTful API endpoints and inter-service communication.',
    status: 'in_review', dueDate: 'Week 4',
  },
  {
    id: 's3', title: 'Sprint 3: CI/CD Pipeline & Deployment',
    description: 'Set up continuous integration/deployment pipeline with GitHub repository and live URL.',
    status: 'pending', dueDate: 'Week 6',
  },
  {
    id: 's4', title: 'Sprint 4: Capstone Oral Defense',
    description: 'Present the final project to a senior engineer panel for review and scoring.',
    status: 'pending', dueDate: 'Week 8',
  },
];

// ─────────────────────────────────────────────────────────────────────
// Utility: generate a SHA-256 style hash
// ─────────────────────────────────────────────────────────────────────
function generateHash(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let hash = 'sha256:';
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
    if (i % 8 === 7 && i < 31) hash += '-';
  }
  return hash;
}

// ─────────────────────────────────────────────────────────────────────
// SVG QR Code Preview (simple deterministic pattern)
// ─────────────────────────────────────────────────────────────────────
function QRPreview({ value, size = 128 }: { value: string; size?: number }) {
  const cells: boolean[][] = [];
  const gridSize = 8;
  // Deterministic pattern based on hash value
  let seed = 0;
  for (let i = 0; i < value.length; i++) seed = ((seed << 5) - seed + value.charCodeAt(i)) | 0;

  for (let r = 0; r < gridSize; r++) {
    cells[r] = [];
    for (let c = 0; c < gridSize; c++) {
      seed = ((seed * 1103515245 + 12345) & 0x7fffffff);
      cells[r][c] = (seed % 3 !== 0) || (r < 2 || c < 2 || r >= gridSize - 2 || c >= gridSize - 2);
    }
  }

  const cellSize = size / gridSize;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8, background: '#fff' }}>
      {cells.map((row, r) => row.map((filled, c) => (
        <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize}
          fill={filled ? '#0f172a' : '#fff'} />
      )))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────
export default function CapstoneInternshipPortal({
  planId,
  planTitle,
  studentName,
  onClose,
}: CapstoneInternshipPortalProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [s3RepoUrl, setS3RepoUrl] = useState('');
  const [s3LiveUrl, setS3LiveUrl] = useState('');
  const [s3Submitting, setS3Submitting] = useState(false);
  const [s3Submitted, setS3Submitted] = useState(false);
  const [activeSprint, setActiveSprint] = useState(1);
  const [certificateTab, setCertificateTab] = useState<'project' | 'internship'>('project');
  const [showCertificate, setShowCertificate] = useState(false);

  const certificateHash = useMemo(() => generateHash(), []);

  const updateMilestoneStatus = (id: string, newStatus: Milestone['status']) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  const handleSubmitS3 = async () => {
    if (!s3RepoUrl.trim() || !s3LiveUrl.trim()) return;
    setS3Submitting(true);
    // Simulate async submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setS3Submitting(false);
    setS3Submitted(true);
    updateMilestoneStatus('s3', 'complete');
  };

  const milestonesCompleted = milestones.filter(m => m.status === 'approved' || m.status === 'complete').length;
  const totalMilestones = milestones.length;

  const statusColors = {
    approved: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#10b981', label: '✓ Approved' },
    in_review: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b', label: '⏳ In Review' },
    pending: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', color: '#64748b', label: '○ Pending' },
    complete: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#10b981', label: '✓ Complete' },
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 24,
    }} aria-modal="true" role="dialog" aria-label={`${planTitle} Portal`}>
      <div style={{
        maxWidth: 800, width: '100%',
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        maxHeight: '90vh',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(var(--brand-rgb),0.12), rgba(var(--success-rgb),0.08))',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
              🏆 {planTitle} Portal
            </h2>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>Student: {studentName}</span>
          </div>
          <button onClick={onClose} style={{
            padding: '6px 12px', borderRadius: 8, background: 'var(--bg3)',
            border: '1px solid var(--border)', color: 'var(--t2)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }} aria-label="Close portal">✕ Close</button>
        </div>

        {/* Milestone Progress Summary */}
        <div style={{
          padding: '14px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Progress:</span>
          <div style={{ flex: 1, minWidth: 120, height: 8, borderRadius: 4, background: 'var(--bg3)', overflow: 'hidden' }}>
            <div style={{
              width: `${(milestonesCompleted / totalMilestones) * 100}%`, height: '100%',
              borderRadius: 4, background: 'linear-gradient(90deg, #6366f1, #10b981)',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>
            {milestonesCompleted}/{totalMilestones}
          </span>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Milestone Cards */}
          {milestones.map((m, idx) => {
            const colors = statusColors[m.status];
            const isS3 = m.id === 's3';
            return (
              <div key={m.id} style={{
                padding: 18, borderRadius: 14, background: 'var(--bg3)',
                border: `1px solid ${colors.border}`,
                opacity: m.status === 'pending' ? 0.85 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>{m.title}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                        background: colors.bg, border: `1px solid ${colors.border}`, color: colors.color,
                      }}>{colors.label}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--t3)', margin: 0 }}>{m.description}</p>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--t4)', flexShrink: 0 }}>{m.dueDate ? `Due: ${m.dueDate}` : ''}</span>
                </div>

                {/* Sprint 3 special inputs */}
                {isS3 && (
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {s3Submitted ? (
                      <div style={{
                        padding: 10, borderRadius: 8, background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.2)', fontSize: 12, color: '#10b981', fontWeight: 700,
                      }}>
                        ✓ Repository URL and Live URL submitted successfully!
                      </div>
                    ) : (
                      <>
                        <input
                          type="url" placeholder="GitHub Repository URL"
                          value={s3RepoUrl} onChange={e => setS3RepoUrl(e.target.value)}
                          style={{
                            padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)',
                            background: 'var(--bg2)', color: 'var(--text)', fontSize: 12.5,
                            fontWeight: 600, outline: 'none', width: '100%', boxSizing: 'border-box',
                          }}
                          aria-label="GitHub Repository URL"
                        />
                        <input
                          type="url" placeholder="Live URL (deployed link)"
                          value={s3LiveUrl} onChange={e => setS3LiveUrl(e.target.value)}
                          style={{
                            padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)',
                            background: 'var(--bg2)', color: 'var(--text)', fontSize: 12.5,
                            fontWeight: 600, outline: 'none', width: '100%', boxSizing: 'border-box',
                          }}
                          aria-label="Live URL"
                        />
                        <button
                          onClick={handleSubmitS3} disabled={!s3RepoUrl.trim() || !s3LiveUrl.trim() || s3Submitting}
                          style={{
                            padding: '10px 20px', borderRadius: 10,
                            background: (!s3RepoUrl.trim() || !s3LiveUrl.trim() || s3Submitting)
                              ? 'var(--bg2)' : 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none', color: (!s3RepoUrl.trim() || !s3LiveUrl.trim() || s3Submitting)
                              ? 'var(--t4)' : '#fff',
                            fontSize: 12.5, fontWeight: 800, cursor: 'pointer',
                            fontFamily: 'var(--font-display)',
                            boxShadow: (!s3RepoUrl.trim() || !s3LiveUrl.trim() || s3Submitting)
                              ? 'none' : '0 4px 14px rgba(16,185,129,0.3)',
                            opacity: (!s3RepoUrl.trim() || !s3LiveUrl.trim() || s3Submitting) ? 0.5 : 1,
                          }}
                        >
                          {s3Submitting ? 'Submitting...' : '✓ Submit Sprint 3'}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Sprint 4 Oral Defense inputs */}
                {m.id === 's4' && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <input type="number" placeholder="Reviewer Score (0-100)" min={0} max={100}
                      style={{
                        padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)',
                        background: 'var(--bg2)', color: 'var(--text)', fontSize: 12, fontWeight: 600,
                        outline: 'none', width: 160,
                      }} aria-label="Reviewer Score"
                    />
                    <input type="text" placeholder="Evaluator Feedback"
                      style={{
                        padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)',
                        background: 'var(--bg2)', color: 'var(--text)', fontSize: 12, fontWeight: 600,
                        outline: 'none', flex: 1, minWidth: 120,
                      }} aria-label="Evaluator Feedback"
                    />
                    <button onClick={() => updateMilestoneStatus('s4', 'complete')} style={{
                      padding: '8px 16px', borderRadius: 8,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none', color: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                      fontFamily: 'var(--font-display)',
                    }}>Submit Defense</button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Live Internship Tracker */}
          <div style={{
            padding: 18, borderRadius: 14, background: 'var(--bg3)',
            border: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', margin: '0 0 12px', fontFamily: 'var(--font-display)' }}>
              👷 Live Internship Tracker
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                { label: 'Company Track', value: 'PinIT Tech Corp', color: '#6366f1' },
                { label: 'Supervisor Sign-off', value: 'In Progress', color: '#f59e0b' },
                { label: 'Corporate Letter', value: 'Pending Review', color: '#64748b' },
              ].map(item => (
                <div key={item.label} style={{
                  padding: 12, borderRadius: 10, background: 'var(--bg2)',
                  border: '1px solid var(--border)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate Issuance Preview */}
          <div style={{
            padding: 18, borderRadius: 14, background: 'var(--bg3)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
                📜 Certificate Issuance Preview
              </h3>
              <div style={{ display: 'flex', gap: 4, borderRadius: 8, background: 'var(--bg2)', padding: 3 }}>
                {(['project', 'internship'] as const).map(tab => (
                  <button key={tab} onClick={() => setCertificateTab(tab)} style={{
                    padding: '6px 14px', borderRadius: 6, border: 'none',
                    background: certificateTab === tab ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                    color: certificateTab === tab ? '#fff' : 'var(--t3)',
                    fontSize: 11, fontWeight: 800, cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {tab === 'project' ? '📦 Project Certificate' : '🏢 Internship Certificate'}
                  </button>
                ))}
              </div>
            </div>

            {showCertificate ? (
              <div style={{
                padding: 20, borderRadius: 14, background: '#fff', color: '#0f172a',
                border: '1px solid var(--border)', textAlign: 'center',
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 4, color: '#0f172a' }}>
                  {certificateTab === 'project' ? '📦 Project-Based Certificate' : '🏢 Real-Time Internship Certificate'}
                </h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
                  {certificateTab === 'project' ? 'Certification of Completion' : 'Corporate Experience Letter'}
                </p>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}><strong>Student:</strong> {studentName}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}><strong>Program:</strong> {planTitle}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', wordBreak: 'break-all' }}><strong>SHA-256 Hash:</strong> {certificateHash}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center', marginBottom: 16 }}>
                  <QRPreview value={certificateHash} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1' }}>Verification</div>
                    <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>Scan QR or paste hash to verify authenticity</div>
                  </div>
                </div>
                <button onClick={() => setShowCertificate(false)} style={{
                  padding: '8px 18px', borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                }}>Close Certificate</button>
              </div>
            ) : (
              <button onClick={() => setShowCertificate(true)} style={{
                padding: '14px 28px', borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                fontFamily: 'var(--font-display)', width: '100%',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              }}>
                📜 Preview {certificateTab === 'project' ? 'Project Certificate' : 'Internship Certificate'}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end', background: 'var(--bg3)', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: '10px 24px', borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'var(--font-display)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
          }}>
            Close Portal →
          </button>
        </div>
      </div>
    </div>
  );
}
