'use client';
// src/app/exams/page.tsx
// Student Examination Portal containing Exam Schedules, Hall Ticket generators, Grade rosters, and printable transcripts.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export default function StudentExams() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'results'>('schedule');
  const [schedule, setSchedule] = useState<any[]>([]);
  const [resultsSheet, setResultsSheet] = useState<any>(null);
  
  // Modals
  const [showHallTicket, setShowHallTicket] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedule();
    fetchResults();
  }, []);

  const fetchSchedule = async () => {
    try {
      const data = await api.get<{ schedule: any[] }>('/api/exams/student-schedule');
      setSchedule(data.schedule || []);
    } catch (err) {
      console.error('Failed to fetch exam schedule:', err);
    }
  };

  const fetchResults = async () => {
    try {
      setError(null);
      const data = await api.get('/api/exams/student-results');
      setResultsSheet(data);
    } catch (err) {
      console.error('Failed to load exam data:', err);
      setError('Failed to load examination sheets. Please retry.');
    }
  };

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>
        <p style={{ marginBottom: 12 }}>{error}</p>
        <button onClick={() => { fetchSchedule(); fetchResults(); }} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  if (!resultsSheet) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        Loading examination sheets...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '30px 20px', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{`
        .exams-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .page-title {
          font-family: var(--font-display), sans-serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.6px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-tabs {
          display: flex;
          gap: 6px;
          background: #e2e8f0;
          padding: 4px;
          border-radius: 12px;
          width: fit-content;
          margin-bottom: 24px;
        }
        .tab-btn {
          border: none;
          background: transparent;
          padding: 8px 18px;
          border-radius: 9px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          color: #475569;
          transition: all 0.15s;
        }
        .tab-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
        }
        .card-box {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
        }
        .grid-schedule {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .slot-card {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          padding: 16px;
          position: relative;
        }
        .slot-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          background: #eff6ff;
          color: #2563eb;
        }
        .tbl-results {
          width: 100%;
          border-collapse: collapse;
        }
        .tbl-results th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          padding-bottom: 12px;
          border-bottom: 1px solid #cbd5e1;
        }
        .tbl-results td {
          padding: 14px 0;
          font-size: 13.5px;
          border-bottom: 1px solid #f1f5f9;
        }
        .badge-grade {
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 11px;
        }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-gray { background: #f1f5f9; color: #475569; }
        .badge-red { background: #fee2e2; color: #ef4444; }
        
        .overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .ticket-modal {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 520px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
        }
        .ticket-body {
          border: 2px dashed #cbd5e1;
          border-radius: 14px;
          padding: 20px;
          margin-top: 16px;
          background: #fafafa;
        }
        .transcript-sheet {
          background: #fff;
          border: 8px double #cbd5e1;
          padding: 30px;
          border-radius: 12px;
          position: relative;
        }
        .watermark {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 48px;
          font-weight: 900;
          color: rgba(15, 23, 42, 0.03);
          pointer-events: none;
          white-space: nowrap;
          text-transform: uppercase;
        }
      `}</style>

      <div className="exams-container">
        <h1 className="page-title">📝 Exam Cell & Results Desk</h1>

        {/* Tab Navigator */}
        <div className="nav-tabs">
          <button onClick={() => setActiveTab('schedule')} className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}>📅 Exam Schedule & Hall Ticket</button>
          <button onClick={() => setActiveTab('results')} className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}>🎓 Semester Grades & Transcripts</button>
        </div>

        {/* TAB 1: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>🎫 Semester Hall Entry Ticket</h3>
                <p style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}>Download or view your verified entry pass for the upcoming semester laboratory and theory blocks.</p>
              </div>
              <button onClick={() => setShowHallTicket(true)} className="btn-primary" style={{ background: '#2563eb', padding: '10px 20px' }}>
                🎟 View Hall Ticket
              </button>
            </div>

            <div className="card-box">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, marginBottom: 16 }}>🗓 Upcoming Timetable</h3>
              <div className="grid-schedule">
                {schedule.map(s => (
                  <div key={s.id} className="slot-card">
                    <span className="slot-badge">{s.slot}</span>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-mono)' }}>{s.code}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '6px 0 10px', maxWidth: '80%' }}>{s.course}</div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#64748b' }}>
                      <div>📅 Date: <strong>{new Date(s.date).toLocaleDateString()}</strong></div>
                      <div>⏰ Time: <strong>{s.time}</strong></div>
                      <div>🚪 Assigned Hall: <strong>{s.room}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESULTS */}
        {activeTab === 'results' && (
          <div>
            {!resultsSheet.isPublished ? (
              <div className="card-box" style={{ background: '#fef2f2', border: '1px solid #fee2e2', textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>⚠️</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#991b1b' }}>Results Audit Status</h3>
                <p style={{ fontSize: 13, color: '#b91c1c', maxWidth: 460, margin: '8px auto 0' }}>
                  The Semester Grades for Academic Year 2025–26 have not been published by the Exam Cell. Marks are currently undergoing board verification audits.
                </p>
                <div style={{ fontSize: 11, color: '#dc2626', marginTop: 14, fontFamily: 'var(--font-mono)' }}>
                  ESTIMATED RELEASE: Immediate after officer audit confirmation.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* GPA summary & transcript button */}
                <div className="card-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>Consolidated Report Card</h3>
                    <p style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}>Marks and grades for all semester course codes are locked and published.</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>CUMULATIVE GPA</div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>{resultsSheet.gpa} / 10</div>
                    </div>
                    <button onClick={() => setShowTranscript(true)} className="btn-primary" style={{ background: '#10b981', borderColor: '#10b981', padding: '10px 20px' }}>
                      🎓 View Official Transcript
                    </button>
                  </div>
                </div>

                {/* Grades details table */}
                <div className="card-box">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, marginBottom: 16 }}>📊 Semester Roster</h3>
                  
                  <table className="tbl-results">
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Subject Title</th>
                        <th>Internal (30)</th>
                        <th>Semester (70)</th>
                        <th>Total Marks</th>
                        <th>Grade</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(resultsSheet.results || []).map((r: any) => {
                        const total = r.internals + r.semester;
                        const isPass = total >= 40;
                        return (
                          <tr key={r.code}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{r.code}</td>
                            <td style={{ fontWeight: 600 }}>{r.course}</td>
                            <td>{r.internals} / 30</td>
                            <td>{r.semester} / 70</td>
                            <td style={{ fontWeight: 700 }}>{total} / 100</td>
                            <td>
                              <span className={`badge-grade ${isPass ? 'badge-green' : 'badge-red'}`}>
                                {r.grade}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: isPass ? '#059669' : '#dc2626' }}>
                              {isPass ? 'Pass' : 'Fail'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: HALL TICKET */}
      {showHallTicket && (
        <div className="overlay">
          <div className="ticket-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>🎫 Examination Hall entry Ticket</h3>
              <button onClick={() => setShowHallTicket(false)} style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div className="ticket-body">
              <div style={{ display: 'flex', gap: 16, borderBottom: '1px dashed #cbd5e1', paddingBottom: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: 8, background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🧑‍🎓</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Ashwanth Kumar</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Register Number: <strong>BGS2024001</strong></div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Major: <strong>Computer Science Engineering</strong></div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 8 }}>LICENSED EXAMINATION SCHEDULE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {schedule.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, background: '#ffffff', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <span><strong>{s.code}</strong> · {(s.course || '').slice(0, 24)}...</span>
                      <span style={{ color: '#2563eb', fontWeight: 700 }}>{s.room}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: 14, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#64748b' }}>
                <span>🔒 Security Code: <strong>DSAI-ENTRY-PASS</strong></span>
                <button onClick={() => window.print()} className="btn-ghost btn-sm" style={{ border: '1px solid #cbd5e1' }}>🖨 Print Ticket</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: OFFICIAL TRANSCRIPT */}
      {showTranscript && resultsSheet.isPublished && (
        <div className="overlay">
          <div className="ticket-modal" style={{ maxWidth: 540, padding: 0 }}>
            <div className="transcript-sheet">
              <div className="watermark">OFFICIAL TRANSCRIPT</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px double #0f172a', paddingBottom: 14, marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 900 }}>BGS INSTITUTE OF MANAGEMENT</h3>
                  <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'var(--font-mono)' }}>EXAMINATION CONTROL CELL OFFICE</div>
                </div>
                <button onClick={() => setShowTranscript(false)} style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, marginBottom: 20, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }}>
                <div>Name: <strong>Ashwanth Kumar</strong></div>
                <div>Reg No: <strong>BGS2024001</strong></div>
                <div>Program: <strong>B.Tech CSE</strong></div>
                <div>Date Issued: <strong>{new Date().toLocaleDateString()}</strong></div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 20 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #0f172a', fontWeight: 800 }}>
                    <th style={{ textAlign: 'left', padding: '6px 0' }}>Code</th>
                    <th style={{ textAlign: 'left' }}>Course Title</th>
                    <th style={{ textAlign: 'center' }}>Grade</th>
                    <th style={{ textAlign: 'right' }}>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {(resultsSheet.results || []).map((r: any) => (
                    <tr key={r.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ fontFamily: 'var(--font-mono)', padding: '8px 0' }}>{r.code}</td>
                      <td>{r.course}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.grade}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>4.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #cbd5e1', paddingTop: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>VERIFICATION SECURITY QR</div>
                  <div style={{ width: 54, height: 54, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: '1px solid #cbd5e1', marginTop: 4 }}>🏁</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13 }}>
                  <div>Cumulative CGPA: <strong style={{ color: '#10b981', fontSize: 16 }}>{resultsSheet.gpa}</strong></div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>CONTROLLER OF EXAMINATIONS</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>[DIGITALLY SEALED]</div>
                </div>
              </div>

              <div style={{ marginTop: 20, textAlign: 'right' }}>
                <button onClick={() => window.print()} className="btn-submit" style={{ width: 'auto', padding: '8px 16px', background: '#10b981' }}>🖨 Print Transcript</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
