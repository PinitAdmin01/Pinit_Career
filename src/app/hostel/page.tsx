'use client';
// src/app/hostel/page.tsx
// Student Hostel Hub page containing Room Allocation picker, Daily Biometric check-in logs, Maintenance complaints desks, and Visitor Pass registries.

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { useAuth } from '@/lib/context/AuthContext';

export default function StudentHostel() {
  const { user } = useAuth();

  const [rooms, setRooms] = useState<any[]>([]);
  const [allocation, setAllocation] = useState<any>({ requestedRoom: null, status: 'none' });
  const [attendance, setAttendance] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);

  const [selectedWing, setSelectedWing] = useState('Wing A (Tech Cohorts)');
  const [activeTab, setActiveTab] = useState('overview');
  const [complaintForm, setComplaintForm] = useState({ category: 'Plumbing', title: '', description: '' });
  const [visitorForm, setVisitorForm] = useState({ name: '', relation: '', purpose: '' });
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [submittingVisitor, setSubmittingVisitor] = useState(false);

  // Hostel data comes from /api/hostel/stats (rooms, allocation, complaints, visitors), once signed in.
  const fetchHostelData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await api.get<any>('/api/hostel/stats');
      if (data) {
        setRooms(data.rooms || []);
        setAllocation(data.allocation || { requestedRoom: null, status: 'none' });
        setAttendance(data.attendance || []);
        setComplaints(prev => {
          const localOnly = prev.filter(c => c.id?.startsWith('HST-') || c.status === 'Queued');
          const serverList = data.complaints || [];
          const merged = [...localOnly, ...serverList.filter((s: any) => !localOnly.some(l => l.id === s.id))];
          return merged;
        });
        setVisitors(data.visitors || []);
      }
    } catch {}
  }, [user?.id]);

  useEffect(() => {
    // Draft cache restore: single allowed localStorage usage for in-progress form recovery
    if (typeof window !== 'undefined') {
      try {
        const draft = localStorage.getItem('hostel_complaint_draft');
        if (draft) {
          const parsed = JSON.parse(draft);
          if (parsed.title || parsed.description) {
            setComplaintForm(prev => ({ ...prev, ...parsed }));
          }
        }
      } catch {}
    }
    fetchHostelData();
  }, [fetchHostelData]);

  const handleRequestRoom = async (roomCode: string) => {
    try {
      const res = await api.post<{ ok: boolean; allocation: any }>('/api/hostel/request-room', { roomCode });
      if (res && res.ok) {
        toast.success('Room Requested! 🛏️', `Room allocation requested for ${roomCode}. Awaiting warden approval.`);
        fetchHostelData();
      } else {
        toast.error('Request Failed', 'Could not request room. Please try again.');
      }
    } catch {
      toast.error('Request Failed', 'Could not request room. Please try again.');
    }
  };

  const handleLogAttendance = async (type: 'check-in' | 'check-out') => {
    if (allocation.status !== 'allocated' && allocation.status !== 'approved') {
      toast.warning('Not Allocated', 'Roll-call checks are only available for allocated residents.');
      return;
    }

    const currentHour = new Date().getHours();
    // Nightly biometric scanner station active 8:00 PM - 10:00 PM (20:00 - 22:00)
    const isWindowActive = currentHour >= 20 && currentHour < 22;
    if (!isWindowActive) {
      toast.info(
        'Scanner Standby ⏱️',
        'Biometric roll-call scanner is active from 8:00 PM to 10:00 PM. For off-hours entry, please record check-in at the Warden Security Kiosk.'
      );
    }

    try {
      const res = await api.post<{ ok: boolean }>('/api/hostel/log-attendance', { type, roomCode: allocation.requestedRoom });
      if (res && res.ok) {
        toast.success('Attendance Logged! ⏱️', `Biometric ${type} logged successfully! Nightly roll-call verified.`);
        fetchHostelData();
      } else {
        toast.error('Verification Failed', 'Roll-call verification was not acknowledged by the server.');
      }
    } catch {
      toast.error('Biometric Log Failed', 'Error logging biometric attendance.');
    }
  };

  const handleRaiseComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.title.trim() || !complaintForm.description.trim()) {
      toast.error('Missing Details', 'Please fill in both complaint title and description.');
      return;
    }
    setSubmittingComplaint(true);
    const localComplaint = {
      id: 'HST-' + crypto.randomUUID().slice(0, 8),
      category: complaintForm.category,
      title: complaintForm.title.trim(),
      description: complaintForm.description.trim(),
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await api.post<{ ok: boolean }>('/api/hostel/raise-complaint', complaintForm);
      if (res && res.ok) {
        toast.success('Ticket Logged! 🛠️', 'Complaint filed successfully! Maintenance team has been notified.');
        setComplaintForm({ category: 'Plumbing', title: '', description: '' });
        fetchHostelData();
        return;
      }
      toast.error('Submission Failed', 'Failed to register maintenance ticket.');
    } catch {
      setComplaints(prev => [localComplaint, ...prev]);
      toast.info('Complaint Queued 🛠️', 'Server connection offline. Complaint queued locally.');
      setComplaintForm({ category: 'Plumbing', title: '', description: '' });
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
        toast.success('Visitor Pass Generated! 🏷️', 'Share the visitor ID with security desk.');
        setVisitorForm({ name: '', relation: '', purpose: '' });
        fetchHostelData();
      }
    } catch {
      toast.error('Pass Generation Failed', 'Failed to generate visitor security pass.');
    } finally {
      setSubmittingVisitor(false);
    }
  };

  const handleVisitorCheckout = async (visitorId: string) => {
    try {
      const res = await api.post<{ ok: boolean }>('/api/hostel/checkout-visitor', { visitorId });
      if (res && res.ok) {
        toast.success('Check-out Recorded', 'Visitor check-out logged successfully.');
        fetchHostelData();
      }
    } catch {
      toast.error('Check-out Failed', 'Failed to record visitor checkout.');
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
          font-size: 26.5px;
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
          box-shadow: var(--shadow-sm);
        }
        .card-title {
          font-family: var(--font-display), sans-serif;
          font-size: 17.5px;
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
          font-size: 35px;
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
          <div className="status-alert" style={{ background: 'var(--coral-light)', borderColor: 'var(--coral-light)', color: 'var(--coral)' }}>
            <div>
              <strong style={{ fontSize: 15.5 }}>⚠️ Accommodation Required</strong>
              <div style={{ fontSize: 13, marginTop: 2 }}>You do not currently have any active room allocations. Please pick a room from the catalog grid below.</div>
            </div>
          </div>
        )}
        {allocation.status === 'pending' && (
          <div className="status-alert" style={{ background: 'var(--amber-light)', borderColor: 'var(--amber-light)', color: 'var(--amber)' }}>
            <div>
              <strong style={{ fontSize: 15.5 }}>⏳ Allocation Review Pending</strong>
              <div style={{ fontSize: 13, marginTop: 2 }}>Requested Room: <strong>{allocation.requestedRoom}</strong>. Wardens are verifying room balances.</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', background: 'var(--card)', borderRadius: 20 }}>Awaiting Warden</span>
          </div>
        )}
        {(allocation.status === 'allocated' || allocation.status === 'approved') && (
          <div className="status-alert" style={{ background: 'var(--green-light)', borderColor: 'var(--green-light)', color: 'var(--green)' }}>
            <div>
              <strong style={{ fontSize: 15.5 }}>✓ Accommodation Allocated</strong>
              <div style={{ fontSize: 13, marginTop: 2 }}>
                Room Code: <strong>{allocation.requestedRoom}</strong> | Block {(() => {
                  const r = String(allocation.requestedRoom || '');
                  return r.includes('-') ? r.split('-')[0].trim() : (r[0] || 'A');
                })()}. All facilities activated.
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', background: 'var(--card)', color: 'var(--green)', borderRadius: 20 }}>Resident Profile Active</span>
          </div>
        )}

        <div className="grid-split">
          {/* Left Block: Allocation selection & complaints */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Rooms Grid */}
            <div className="card-box">
              <h3 className="card-title">🔑 Available Hostel Rooms</h3>
              <p style={{ fontSize: 14, color: 'var(--t2)', marginBottom: 14 }}>
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
                      <div style={{ fontWeight: 800, fontSize: 16.5, color: 'var(--t1)' }}>{r.code}</div>
                      <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>{r.block}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: r.occupied === r.capacity ? 'var(--coral)' : 'var(--green)', marginTop: 6 }}>
                        {r.occupied} / {r.capacity} Beds Occupied
                      </div>
                      {isSelectable && (
                        <span style={{ display: 'block', fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginTop: 8 }}>
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
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Category</label>
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
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Problem Title *</label>
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
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Details Description</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="Provide details about the issue..."
                    value={complaintForm.description}
                    onChange={e => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <button type="submit" disabled={submittingComplaint} className="btn-primary" style={{ alignSelf: 'flex-end', fontSize: 13 }}>
                  {submittingComplaint ? 'Raising ticket...' : 'Raise Maintenance Ticket'}
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {complaints.map(c => (
                  <div key={c.id} className="ticket-row">
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 700 }}>{c.title} ({c.category})</div>
                      <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>{c.description}</div>
                    </div>
                    <span style={{
                      fontSize: 11.5, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                      background: c.status === 'Pending' ? 'var(--amber-light)' : 'var(--green-light)',
                      color: c.status === 'Pending' ? 'var(--amber)' : 'var(--green)'
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
              <h3 className="card-title" style={{ justifyContent: 'center' }}>📸 Resident Roll-Call Station</h3>
              <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>
                Official resident roll-call punch log. Biometric kiosk window: 8:00 PM – 10:00 PM nightly.
              </p>
              
              {(() => {
                const hour = new Date().getHours();
                const isRollCallWindowActive = hour >= 20 && hour < 22;
                return (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: isRollCallWindowActive ? 'rgba(var(--success-rgb), 0.1)' : 'var(--bg3)',
                    color: isRollCallWindowActive ? 'var(--success)' : 'var(--t3)',
                    marginBottom: 12,
                    border: `1px solid ${isRollCallWindowActive ? 'var(--success)' : 'var(--border)'}`
                  }}>
                    <span>{isRollCallWindowActive ? '●' : '○'}</span>
                    <span>{isRollCallWindowActive ? 'Kiosk Scanner Online (Active Window)' : 'Kiosk Standby (8–10 PM · Security Kiosk for Off-Hours)'}</span>
                  </div>
                );
              })()}

              <div
                className="attendance-fingerprint"
                onClick={() => handleLogAttendance('check-in')}
                style={{ cursor: 'pointer' }}
                title="Verify attendance at biometric kiosk"
              >
                🔐
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
                <button onClick={() => handleLogAttendance('check-in')} className="btn-ghost btn-sm" style={{ border: '1px solid var(--border)', fontSize: 12.5, fontWeight: 700 }}>
                  Punch Check-In
                </button>
                <button onClick={() => handleLogAttendance('check-out')} className="btn-ghost btn-sm" style={{ border: '1px solid var(--border)', fontSize: 12.5, fontWeight: 700 }}>
                  Punch Check-Out
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 12, textAlign: 'left', maxHeight: 150, overflowY: 'auto' }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t2)', marginBottom: 6, textAlign: 'left' }}>Recent Punch Logs</div>
                {attendance.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t2)', padding: '4px 0' }}>
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
                <button type="submit" disabled={submittingVisitor} className="btn-primary" style={{ width: '100%', fontSize: 12.5 }}>
                  {submittingVisitor ? 'Generating Pass...' : '✓ Generate Visitor security Pass'}
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {visitors.map(v => (
                  <div key={v.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, fontSize: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>{v.name} ({v.relation})</span>
                      <span style={{ color: v.status === 'checked-in' ? 'var(--accent)' : 'var(--t2)' }}>
                        {v.status === 'checked-in' ? 'Active Entry' : 'Checked out'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Purpose: {v.purpose}</div>
                    
                    {v.status === 'checked-in' && (
                      <button
                        onClick={() => handleVisitorCheckout(v.id)}
                        className="btn-ghost btn-sm"
                        style={{ border: '1px solid var(--border2)', fontSize: 12, marginTop: 8, width: '100%' }}
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
