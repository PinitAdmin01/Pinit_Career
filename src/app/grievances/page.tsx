'use client';
// src/app/grievances/page.tsx
// Student Grievance page containing complaint submission forms, anonymous toggles, and ticket tracking registers.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';

export default function StudentGrievances() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState<any[]>([]);
  const [category, setCategory] = useState('General');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const userName = user?.displayName || user?.username || 'Student';

  useEffect(() => {
    fetchGrievances();
  }, [user]);

  const fetchGrievances = async () => {
    try {
      const data = await api.get<any>('/api/grievances/stats');
      // For student viewing, only show tickets created by current user or marked "Anonymous"
      const studentTickets = (data.grievances || []).filter((g: any) => 
        g.reporterName === userName || (g.anonymous && g.reporterType === 'student')
      );
      setGrievances(studentTickets);
    } catch {}
  };

  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post<{ ok: boolean }>('/api/grievances/submit', {
        reporterType: 'student',
        reporterName: anonymous ? 'Anonymous Student' : userName,
        category,
        title,
        description,
        anonymous
      });
      if (res && res.ok) {
        alert('Grievance filed successfully! The administrative board has been notified.');
        setTitle('');
        setDescription('');
        setAnonymous(false);
        fetchGrievances();
      }
    } catch {
      alert('Failed to submit grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-page">
      <style>{`
        .grv-wrapper {
          max-width: 1040px;
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
        .grid-split {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .grid-split {
            grid-template-columns: 1fr;
          }
        }
        .card-box {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px var(--border);
        }
        .card-title {
          font-family: var(--font-display), sans-serif;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tbl-grv {
          width: 100%;
          border-collapse: collapse;
        }
        .tbl-grv th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--t2);
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border2);
        }
        .tbl-grv td {
          padding: 12px 0;
          font-size: 13.5px;
          border-bottom: 1px solid var(--border);
        }
        .status-badge {
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 10.5px;
          font-weight: 700;
        }
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
          background: var(--card);
          border-radius: 20px;
          width: 100%;
          max-width: 540px;
          padding: 30px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
        }
        .lbl-switch {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--t2);
          cursor: pointer;
          user-select: none;
        }
      `}</style>

      <div className="grv-wrapper">
        <h1 className="page-title">⚖️ Grievance Portal</h1>

        <div className="grid-split">
          {/* File a Grievance */}
          <div className="card-box" style={{ height: 'fit-content' }}>
            <h3 className="card-title">✍️ Submit Grievance Ticket</h3>

            <form onSubmit={handleSubmitGrievance} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Grievance Category</label>
                <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Academic">Academic / Syllabus</option>
                  <option value="Hostel Facilities">Hostel Facilities</option>
                  <option value="Finance & Fees">Finance & Tuition</option>
                  <option value="Transportation">Transportation & Bus routes</option>
                  <option value="General">General Campus Infrastructure</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Complaint Subject Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Broken laboratory desks in Room 102"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Detailed Description *</label>
                <textarea
                  className="form-input"
                  rows={4}
                  required
                  placeholder="Provide precise details to help investigators verify the issue..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div style={{ margin: '4px 0' }}>
                <label className="lbl-switch">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={e => setAnonymous(e.target.checked)}
                  />
                  <span>File complaint anonymously</span>
                </label>
                <div style={{ fontSize: 10.5, color: 'var(--t2)', marginTop: 4, marginLeft: 22 }}>
                  If checked, your name and profile information will be completely hidden from administrators.
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%' }}>
                {submitting ? 'Submitting ticket...' : '⚖️ File Grievance Ticket'}
              </button>
            </form>
          </div>

          {/* Grievance Ledger */}
          <div className="card-box">
            <h3 className="card-title">📋 Track Grievance Status</h3>

            {grievances.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--t2)' }}>
                No active complaints filed in ticket system.
              </div>
            ) : (
              <table className="tbl-grv">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Category</th>
                    <th>Ticket Title</th>
                    <th>Date Filed</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {grievances.map(g => (
                    <tr key={g.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{g.id}</td>
                      <td style={{ fontWeight: 600 }}>{g.category}</td>
                      <td>
                        <div>{g.title}</div>
                        {g.anonymous && <span style={{ fontSize: 9.5, background: 'var(--bg3)', color: 'var(--t2)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>Anonymous Report</span>}
                      </td>
                      <td style={{ color: 'var(--t2)' }}>{new Date(g.filedOn).toLocaleDateString()}</td>
                      <td>
                        <span className="status-badge" style={{
                          background: g.status === 'Resolved' ? 'var(--green-light)' : (g.status === 'In Investigation' ? 'var(--accent-light)' : 'var(--amber-light)'),
                          color: g.status === 'Resolved' ? 'var(--green)' : (g.status === 'In Investigation' ? 'var(--accent)' : 'var(--amber)')
                        }}>{g.status}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedTicket(g)}
                          className="btn-ghost btn-sm"
                          style={{ border: '1px solid var(--border2)', fontSize: 11 }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* TICKET DETAILS LIGHTBOX */}
      {selectedTicket && (
        <div className="overlay">
          <div className="ticket-modal">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 14 }}>
              Grievance Ticket details ({selectedTicket.id})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5, color: 'var(--t1)' }}>
              <div>
                <strong>Category:</strong> {selectedTicket.category}
              </div>
              <div>
                <strong>Subject:</strong> {selectedTicket.title}
              </div>
              <div>
                <strong>Date Filed:</strong> {new Date(selectedTicket.filedOn).toLocaleString()}
              </div>
              <div>
                <strong>Reporter Name:</strong> {selectedTicket.reporterName}
              </div>
              <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                <strong>Complaint Details:</strong>
                <p style={{ marginTop: 4, lineHeight: 1.5, color: 'var(--t2)' }}>{selectedTicket.description}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                <strong>Investigation Status:</strong>
                <span className="status-badge" style={{
                  marginLeft: 8,
                  background: selectedTicket.status === 'Resolved' ? 'var(--green-light)' : (selectedTicket.status === 'In Investigation' ? 'var(--accent-light)' : 'var(--amber-light)'),
                  color: selectedTicket.status === 'Resolved' ? 'var(--green)' : (selectedTicket.status === 'In Investigation' ? 'var(--accent)' : 'var(--amber)')
                }}>{selectedTicket.status}</span>
              </div>

              {selectedTicket.status === 'Resolved' ? (
                <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-light)', padding: 12, borderRadius: 10, color: 'var(--green)' }}>
                  <strong>Board Resolution Note:</strong>
                  <p style={{ marginTop: 4, lineHeight: 1.5 }}>{selectedTicket.resolution}</p>
                  <div style={{ fontSize: 10.5, color: 'var(--green)', marginTop: 6 }}>Resolved on {new Date(selectedTicket.resolvedOn).toLocaleDateString()}</div>
                </div>
              ) : (
                <div style={{ fontSize: 12.5, color: 'var(--t2)', background: 'var(--accent-light)', padding: 10, borderRadius: 8, border: '1px solid var(--accent-light)' }}>
                  ℹ️ This grievance ticket is currently being investigated by the institutional administrative committee. Action responses will update here automatically.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setSelectedTicket(null)} className="btn-primary" style={{ background: 'var(--t1)' }}>
                ✕ Close Ticket Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
