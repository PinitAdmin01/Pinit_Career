'use client';
// src/app/admissions/page.tsx
// Public-facing Admissions Portal containing the Online Application Form and Status Tracking.

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api/client';

export default function AdmissionsPortal() {
  // Form states
  const [form, setForm] = useState({ name: '', email: '', gpa: '', course: 'Computer Science' });
  const [fileSimulated, setFileSimulated] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState<any>(null);

  // Tracking states
  const [trackingId, setTrackingId] = useState('');
  const [trackedApp, setTrackedApp] = useState<any>(null);
  const [trackError, setTrackError] = useState('');

  const courses = ['Computer Science', 'DSAI', 'Electronics', 'Mechanical'];

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileSimulated) {
      alert('Please upload/simulate your 12th Grade Mark Sheet PDF first.');
      return;
    }
    setApplying(true);
    try {
      const res: any = await api.post('/api/admissions/apply', form);
      if (res && res.ok) {
        setApplyResult(res.application);
        setForm({ name: '', email: '', gpa: '', course: 'Computer Science' });
        setFileSimulated(false);
      }
    } catch {
      alert('Failed to submit application. Try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackedApp(null);
    try {
      const res = await api.get<{ application: any | null }>(`/api/admissions/track?id=${encodeURIComponent(trackingId.trim())}`);
      if (res.application) {
        setTrackedApp(res.application);
      } else {
        setTrackError('No application found matching this ID. Format: APP-2026-XXXX');
      }
    } catch {
      setTrackError('Failed to query tracking database.');
    }
  };

  const getTimelineIndex = (status: string) => {
    const stages = ['Applied', 'Document Verified', 'Rejected', 'Seat Allocated'];
    if (status === 'Rejected') return 1;
    return stages.indexOf(status);
  };

  return (
    <div className="portal-page">
      <style>{`
        /* Header topbar styles matching landing page */
        .header-topbar {
          position: sticky;
          top: 0;
          background: color-mix(in srgb, var(--bg2) 88%, transparent);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          z-index: 50;
          transition: background 0.3s;
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .nav-group {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--bg3);
          padding: 4px;
          border-radius: 30px;
        }
        .nav-btn {
          text-decoration: none;
          color: var(--t2);
          font-size: 13.5px;
          font-weight: 600;
          padding: 7px 18px;
          border-radius: 20px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-btn.active {
          background: var(--card);
          color: var(--t1);
          box-shadow: var(--shadow-sm);
        }
        .nav-btn:hover:not(.active) {
          color: var(--t1);
        }
        .action-btn-primary {
          background: var(--accent);
          color: var(--card);
          border: none;
          border-radius: 50px;
          padding: 11px 26px;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 14px color-mix(in srgb, var(--accent) 25%, transparent);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .action-btn-primary:hover {
          background: var(--accent-mid);
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px color-mix(in srgb, var(--accent) 35%, transparent);
        }

        .admissions-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 45px 20px;
        }
        .header-section {
          text-align: center;
          margin-bottom: 50px;
        }
        .header-title {
          font-family: var(--font-display), sans-serif;
          font-size: 38px;
          font-weight: 900;
          letter-spacing: -1px;
          color: var(--t1);
          margin-bottom: 12px;
        }
        .header-title span {
          background: linear-gradient(135deg, var(--accent), var(--purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-desc {
          font-size: 15px;
          color: var(--t2);
          max-width: 600px;
          margin: 0 auto;
        }
        .portal-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 30px;
        }
        @media (max-width: 768px) {
          .portal-grid {
            grid-template-columns: 1fr;
          }
          .nav-group {
            display: none !important;
          }
        }
        .card-box {
          background: var(--card);
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 4px 20px var(--border);
        }
        .card-title {
          font-family: var(--font-display), sans-serif;
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--t2);
          margin-bottom: 6px;
          display: block;
        }
        .form-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          font-size: 13.5px;
          outline: none;
          background: var(--bg3);
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: var(--accent);
          background: var(--card);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
        }
        .btn-submit {
          background: var(--accent);
          color: var(--card);
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
          text-align: center;
        }
        .btn-submit:hover {
          background: #1d4ed8;
        }
        .timeline {
          margin-top: 24px;
          position: relative;
          padding-left: 24px;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border);
        }
        .timeline-item {
          position: relative;
          padding-bottom: 24px;
        }
        .timeline-item:last-child {
          padding-bottom: 0;
        }
        .timeline-dot {
          position: absolute;
          left: -23px;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--border2);
          border: 2px solid var(--card);
        }
        .timeline-dot.active {
          background: var(--accent);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
        }
        .timeline-dot.success {
          background: var(--green);
        }
        .timeline-dot.danger {
          background: var(--coral);
        }
        .timeline-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--t1);
        }
        .timeline-desc {
          font-size: 11.5px;
          color: var(--t2);
          margin-top: 2px;
        }
      `}</style>

      {/* Header Topbar */}
      <header className="header-topbar">
        <div className="header-content">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),#8b5cf6)', display: 'flex', alignItems: 'center', justifyItems: 'center', fontSize: 17, fontWeight: 800, color: 'white', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>Pi</div>
            <div>
              <span style={{ fontSize: 19, fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.6px', fontFamily: 'var(--font-display)' }}>PinIT</span>
              <span style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 800, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)' }}>Career OS</span>
            </div>
          </Link>

          <nav className="nav-group">
            <Link href="/" className="nav-btn">Home</Link>
            <Link href="/admissions" className="nav-btn active">Admissions 🎓</Link>
          </nav>

          <Link href="/?login=true" className="action-btn-primary" style={{ textDecoration: 'none' }}>Sign In <span>→</span></Link>
        </div>
      </header>

      <div className="admissions-container">
        {/* Navigation link back to Home */}
        <div style={{ marginBottom: 24 }}>
          <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            ← Back to Campus Portal Home
          </Link>
        </div>

        <div className="header-section">
          <h1 className="header-title">Admissions <span>Portal</span></h1>
          <p className="header-desc">
            Submit your application for the Academic Year 2026–27, upload documents, and track your selection status in real-time.
          </p>
        </div>

        <div className="portal-grid">
          {/* Section 1: Application Form */}
          <div className="card-box">
            <h2 className="card-title">📝 Online Application Form</h2>
            
            {applyResult ? (
              <div style={{ background: 'var(--green-light)', border: '1px solid color-mix(in srgb, var(--green) 30%, transparent)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>Application Submitted!</h3>
                <p style={{ fontSize: 13, color: 'var(--green-mid)', marginBottom: 12 }}>
                  Your application has been registered successfully.
                </p>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 8, padding: 10, display: 'inline-block', fontFamily: 'monospace', fontWeight: 700, fontSize: 15 }}>
                  {applyResult.id}
                </div>
                <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 10 }}>
                  Copy this ID and paste it in the Tracking Widget to monitor document audit status.
                </p>
                <button onClick={() => setApplyResult(null)} className="btn-submit" style={{ marginTop: 16, background: 'var(--green)' }}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="form-input" placeholder="Ashwin Nair" required />
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="form-input" placeholder="ashwin@gmail.com" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12 }}>
                  <div>
                    <label className="form-label">12th GPA / Board Grade (0-10)</label>
                    <input type="number" step="0.01" min="0" max="10" value={form.gpa} onChange={e => setForm(prev => ({ ...prev, gpa: e.target.value }))} className="form-input" placeholder="e.g. 9.4" required />
                  </div>
                  <div>
                    <label className="form-label">Course Preference</label>
                    <select value={form.course} onChange={e => setForm(prev => ({ ...prev, course: e.target.value }))} className="form-input">
                      {courses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">12th Grade Mark Sheet PDF</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setFileSimulated(true)}
                      style={{
                        padding: '10px 14px', borderRadius: 10, border: '1.5px dashed var(--border2)', cursor: 'pointer',
                        fontSize: 12.5, fontWeight: 700, background: fileSimulated ? 'var(--green-light)' : 'var(--card)',
                        color: fileSimulated ? 'var(--green)' : 'var(--t2)',
                        borderColor: fileSimulated ? 'color-mix(in srgb, var(--green) 30%, transparent)' : 'var(--border2)',
                        flexGrow: 1
                      }}
                    >
                      {fileSimulated ? '✓ 12th_marksheet.pdf Attached' : '📁 Attach Simulated Marksheet PDF'}
                    </button>
                    {fileSimulated && (
                      <button type="button" onClick={() => setFileSimulated(false)} style={{ color: 'var(--coral)', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Remove</button>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-submit" disabled={applying}>
                  {applying ? 'Submitting Application...' : 'Submit Application Form'}
                </button>
              </form>
            )}
          </div>

          {/* Section 2: Application Status Tracking */}
          <div className="card-box" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 className="card-title">🔍 Status Tracking</h2>
              <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 14 }}>
                Enter your unique Application ID to pull the current stage of document verification and seat allocations.
              </p>
              
              <form onSubmit={handleTrack} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={trackingId}
                  onChange={e => setTrackingId(e.target.value)}
                  className="form-input"
                  placeholder="e.g. APP-2026-0105"
                  required
                />
                <button type="submit" className="btn-submit" style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 20px' }}>
                  Track ID
                </button>
              </form>
              
              {trackError && (
                <div style={{ color: 'var(--coral)', fontSize: 12.5, marginTop: 8, fontWeight: 600 }}>
                  ⚠️ {trackError}
                </div>
              )}
            </div>

            {trackedApp && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                <div style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', textTransform: 'uppercase' }}>Candidate Details</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>{trackedApp.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--t2)', marginTop: 6 }}>
                    <span>Course: <strong>{trackedApp.course}</strong></span>
                    <span>12th GPA: <strong>{trackedApp.gpa}</strong></span>
                  </div>
                </div>

                <div className="timeline">
                  {/* Timeline 1: Applied */}
                  <div className="timeline-item">
                    <div className="timeline-dot success" />
                    <div className="timeline-title">Application Submitted</div>
                    <div className="timeline-desc">Registered successfully on {new Date(trackedApp.submittedAt).toLocaleDateString()}</div>
                  </div>

                  {/* Timeline 2: Document Verified */}
                  <div className="timeline-item">
                    <div className={`timeline-dot ${
                      trackedApp.status === 'Rejected' ? 'danger' :
                      trackedApp.status === 'Document Verified' || trackedApp.status === 'Seat Allocated' ? 'success' : 'active'
                    }`} />
                    <div className="timeline-title">
                      {trackedApp.status === 'Rejected' ? 'Documents Flagged / Rejected' : 'Document Verification'}
                    </div>
                    <div className="timeline-desc">
                      {trackedApp.status === 'Applied' && 'Audit in queue: Admission Officer reviewing mark sheet details.'}
                      {trackedApp.status === 'Document Verified' && '12th Marks verified successfully against institutional parameters.'}
                      {trackedApp.status === 'Rejected' && 'Audit rejected. Please contact admissions office.'}
                      {trackedApp.status === 'Seat Allocated' && '12th Marks verified.'}
                    </div>
                  </div>

                  {/* Timeline 3: Seat Allocated */}
                  <div className="timeline-item">
                    <div className={`timeline-dot ${trackedApp.status === 'Seat Allocated' ? 'success' : ''}`} />
                    <div className="timeline-title">Merit List Seat Allocation</div>
                    <div className="timeline-desc">
                      {trackedApp.status === 'Seat Allocated'
                        ? 'Confirmed! Seat allocated according to merit rank score.'
                        : 'Waiting for Document Verification completion and Merit allocation release.'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
