'use client';
// src/app/hostel/page.tsx
// Student Hostel Hub page containing Room Allocation picker, Daily Biometric check-in logs, Maintenance complaints desks, and Visitor Pass registries.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export default function StudentHostel() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [allocation, setAllocation] = useState<any>({ requestedRoom: null, status: 'none' });
  const [attendance, setAttendance] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);

  // Forms
  const [complaintForm, setComplaintForm] = useState({ category: 'Plumbing', title: '', description: '' });
  const [visitorForm, setVisitorForm] = useState({ name: '', relation: '', purpose: '' });
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [submittingVisitor, setSubmittingVisitor] = useState(false);

  useEffect(() => {
    fetchHostelData();
  }, []);

  const fetchHostelData = async () => {
    try {
      const data = await api.get<any>('/api/hostel/stats');
      setRooms(data.rooms || []);
      setAllocation(data.allocation || { requestedRoom: null, status: 'none' });
      setAttendance(data.attendance || []);
      setComplaints(data.complaints || []);
      setVisitors(data.visitors || []);
    } catch {}
  };

  const handleRequestRoom = async (roomCode: string) => {
    try {
      const res = await api.post<{ ok: boolean; allocation: any }>('/api/hostel/request-room', { roomCode });
      if (res && res.ok) {
        alert(`Room allocation requested for ${roomCode}! Awaiting warden review approval.`);
        fetchHostelData();
      }
    } catch {
      alert('Request failed.');
    }
  };

  const handleLogAttendance = async (type: 'check-in' | 'check-out') => {
    if (allocation.status !== 'allocated') {
      alert('Roll-call checks are only available for allocated residents.');
      return;
    }
    try {
      const res = await api.post<{ ok: boolean }>('/api/hostel/log-attendance', { type, roomCode: allocation.requestedRoom });
      if (res && res.ok) {
        alert(`Biometric ${type} logged successfully! Nightly roll-call verified.`);
        fetchHostelData();
      }
    } catch {
      alert('Biometric log failed.');
    }
  };

  const handleRaiseComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingComplaint(true);
    try {
      const res = await api.post<{ ok: boolean }>('/api/hostel/raise-complaint', complaintForm);
      if (res && res.ok) {
        alert('Complaint filed successfully! Maintenance team has been notified.');
        setComplaintForm({ category: 'Plumbing', title: '', description: '' });
        fetchHostelData();
      }
    } catch {
      alert('Failed to raise ticket.');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const handleRegisterVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingVisitor(true);
    try {
      const res = await api.post<{ ok: boolean }>('/api/hostel/register-visitor', visitorForm);
      if (res && res.ok) {
        alert('Visitor security pass generated! Share the ID with the gatekeeper office.');
        setVisitorForm({ name: '', relation: '', purpose: '' });
        fetchHostelData();
      }
    } catch {
      alert('Failed to generate pass.');
    } finally {
      setSubmittingVisitor(false);
    }
  };

  const handleVisitorCheckout = async (visitorId: string) => {
    try {
      const res = await api.post<{ ok: boolean }>('/api/hostel/checkout-visitor', { visitorId });
      if (res && res.ok) {
        alert('Visitor check-out logged successfully.');
        fetchHostelData();
      }
    } catch {
      alert('Check-out failed.');
    }
  };

  return (
    <div className="portal-page">
      <style>{`
        .hostel-wrapper {
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
        .status-alert {
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid;
        }
        .grid-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
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
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }
        .room-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .room-card:hover {
          border-color: var(--accent);
          background: var(--bg3);
        }
        .attendance-fingerprint {
          background: var(--accent-light);
          border: 2px dashed var(--accent);
          border-radius: 50%;
          width: 80px;
          height: 80px;
          margin: 16px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .attendance-fingerprint:active {
          transform: scale(0.9);
        }
        .ticket-row {
          background: var(--bg3);
          padding: 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>

      <div className="hostel-wrapper">
        <h1 className="page-title">🏢 Hostel Hub</h1>

        {/* Status Alerts Banners */}
        {allocation.status === 'none' && (
          <div className="status-alert" style={{ background: '#fef2f2', borderColor: '#fee2e2', color: '#991b1b' }}>
            <div>
              <strong style={{ fontSize: 14 }}>⚠️ Accommodation Required</strong>
              <div style={{ fontSize: 12, marginTop: 2 }}>You do not currently have any active room allocations. Please pick a room from the catalog grid below.</div>
            </div>
          </div>
        )}
        {allocation.status === 'pending' && (
          <div className="status-alert" style={{ background: 'var(--amber-light)', borderColor: '#fde68a', color: '#92400e' }}>
            <div>
              <strong style={{ fontSize: 14 }}>⏳ Allocation Review Pending</strong>
              <div style={{ fontSize: 12, marginTop: 2 }}>Requested Room: <strong>{allocation.requestedRoom}</strong>. Wardens are verifying room balances.</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: 'var(--card)beb', borderRadius: 20 }}>Awaiting Warden</span>
          </div>
        )}
        {allocation.status === 'allocated' && (
          <div className="status-alert" style={{ background: '#ecfdf5', borderColor: '#d1fae5', color: '#065f46' }}>
            <div>
              <strong style={{ fontSize: 14 }}>✓ Accommodation Allocated</strong>
              <div style={{ fontSize: 12, marginTop: 2 }}>Room Code: <strong>{allocation.requestedRoom}</strong> | Block B. All facilities activated.</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: 'var(--card)', color: 'var(--green)', borderRadius: 20 }}>Resident Profile Active</span>
          </div>
        )}

        <div className="grid-split">
          {/* Left Block: Allocation selection & complaints */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Rooms Grid */}
            <div className="card-box">
              <h3 className="card-title">🔑 Available Hostel Rooms</h3>
              <p style={{ fontSize: 12.5, color: 'var(--t2)', marginBottom: 14 }}>
                Review room counts and select a vacant room to submit allocation check-in requests.
              </p>

              <div className="rooms-grid">
                {rooms.map(r => {
                  const isSelectable = r.occupied < r.capacity && allocation.status === 'none';
                  return (
                    <div
                      key={r.code}
                      onClick={() => isSelectable && handleRequestRoom(r.code)}
                      className="room-card"
                      style={{
                        borderColor: isSelectable ? 'var(--border)' : 'var(--border2)',
                        opacity: isSelectable ? 1 : 0.8,
                        cursor: isSelectable ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--t1)' }}>{r.code}</div>
                      <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>{r.block}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: r.occupied === r.capacity ? 'var(--coral)' : 'var(--green)', marginTop: 6 }}>
                        {r.occupied} / {r.capacity} Beds Occupied
                      </div>
                      {isSelectable && (
                        <span style={{ display: 'block', fontSize: 10, color: 'var(--accent)', fontWeight: 700, marginTop: 8 }}>
                          Select Room
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complaints Register */}
            <div className="card-box">
              <h3 className="card-title">🛠 Maintenance Complaints</h3>
              
              <form onSubmit={handleRaiseComplaint} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Category</label>
                    <select
                      className="form-input"
                      value={complaintForm.category}
                      onChange={e => setComplaintForm(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Housekeeping">Housekeeping</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Problem Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Geyser not working"
                      value={complaintForm.title}
                      onChange={e => setComplaintForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Details Description</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="Provide details about the issue..."
                    value={complaintForm.description}
                    onChange={e => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <button type="submit" disabled={submittingComplaint} className="btn-primary" style={{ alignSelf: 'flex-end', fontSize: 12 }}>
                  {submittingComplaint ? 'Raising ticket...' : 'Raise Maintenance Ticket'}
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {complaints.map(c => (
                  <div key={c.id} className="ticket-row">
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{c.title} ({c.category})</div>
                      <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>{c.description}</div>
                    </div>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                      background: c.status === 'Pending' ? 'var(--amber-light)' : '#ecfdf5',
                      color: c.status === 'Pending' ? '#b45309' : 'var(--green)'
                    }}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Block: Biometric attendance & visitors pass */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Biometric Attendance card */}
            <div className="card-box" style={{ textAlign: 'center' }}>
              <h3 className="card-title" style={{ justifyContent: 'center' }}>📸 Room Biometric Roll-Call</h3>
              <p style={{ fontSize: 12, color: 'var(--t2)' }}>
                Verify nightly roll-call logs via biometric check-in. Scanner active from 8:00 PM to 10:00 PM.
              </p>

              <div
                className="attendance-fingerprint"
                onClick={() => handleLogAttendance('check-in')}
              >
                👆
              </div>

              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}>
                <button onClick={() => handleLogAttendance('check-in')} className="btn-ghost btn-sm" style={{ border: '1px solid var(--border)', fontSize: 11 }}>
                  Log check-in
                </button>
                <button onClick={() => handleLogAttendance('check-out')} className="btn-ghost btn-sm" style={{ border: '1px solid var(--border)', fontSize: 11 }}>
                  Log check-out
                </button>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 16, paddingTop: 12, textAlign: 'left', maxHeight: 150, overflowY: 'auto' }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t2)', marginBottom: 6, textAlign: 'left' }}>Recent Punch Logs</div>
                {attendance.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', padding: '4px 0' }}>
                    <span>{a.type === 'check-in' ? '🟢 Checked In' : '🔴 Checked Out'}</span>
                    <span>{new Date(a.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor management card */}
            <div className="card-box">
              <h3 className="card-title">🛂 Visitor Pass Registry</h3>
              
              <form onSubmit={handleRegisterVisitor} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Guest Full Name *"
                    required
                    value={visitorForm.name}
                    onChange={e => setVisitorForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Relation *"
                    required
                    value={visitorForm.relation}
                    onChange={e => setVisitorForm(prev => ({ ...prev, relation: e.target.value }))}
                  />
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Purpose of visit (e.g. deliver documents)"
                  value={visitorForm.purpose}
                  onChange={e => setVisitorForm(prev => ({ ...prev, purpose: e.target.value }))}
                />
                <button type="submit" disabled={submittingVisitor} className="btn-primary" style={{ width: '100%', fontSize: 11.5 }}>
                  {submittingVisitor ? 'Generating Pass...' : '✓ Generate Visitor security Pass'}
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {visitors.map(v => (
                  <div key={v.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, fontSize: 12.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>{v.name} ({v.relation})</span>
                      <span style={{ color: v.status === 'checked-in' ? 'var(--accent)' : 'var(--t2)' }}>
                        {v.status === 'checked-in' ? 'Active Entry' : 'Checked out'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 4 }}>Purpose: {v.purpose}</div>
                    
                    {v.status === 'checked-in' && (
                      <button
                        onClick={() => handleVisitorCheckout(v.id)}
                        className="btn-ghost btn-sm"
                        style={{ border: '1px solid var(--border2)', fontSize: 11, marginTop: 8, width: '100%' }}
                      >
                        Log checkout Sign-out
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
