'use client';
// src/app/services/page.tsx
// Central Student Services portal supporting Leave applications, Certificate requests, Service logs, Appointment scheduling, and Counseling booking.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

type ServiceCategory = 'leave' | 'certificate' | 'general' | 'appointment' | 'counselling';

export default function StudentServicesPortal() {
  const [activeCat, setActiveCat] = useState<ServiceCategory>('leave');
  const [data, setData] = useState<{ leaves: any[]; requests: any[]; appointments: any[]; counselling: any[] }>({
    leaves: [],
    requests: [],
    appointments: [],
    counselling: []
  });
  const [submitting, setSubmitting] = useState(false);

  // Leave Form
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveType, setLeaveType] = useState('Personal');

  // Certificate Form
  const [certType, setCertType] = useState('Bonafide Certificate');
  const [certPurpose, setCertPurpose] = useState('');

  // General Request Form
  const [reqCategory, setReqCategory] = useState('ID Card Replacement');
  const [reqDesc, setReqDesc] = useState('');

  // Appointment Form
  const [apptStaff, setApptStaff] = useState('Dr. Priya Sharma (CSE Professor)');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('10:00 AM');
  const [apptPurpose, setApptPurpose] = useState('');

  // Counselling Form
  const [counsName, setCounsName] = useState('Dr. Evelyn (Mental Health Advisor)');
  const [counsDate, setCounsDate] = useState('');
  const [counsTime, setCounsTime] = useState('02:00 PM');

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      const res = await api.get<any>('/api/services/stats');
      setData({ leaves: [], requests: [], appointments: [], counselling: [], ...res });
    } catch {}
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/services/apply-leave', {
        startDate: leaveStart,
        endDate: leaveEnd,
        reason: leaveReason,
        type: leaveType
      });
      alert('Leave application submitted successfully! Coordinator notified ✓');
      setLeaveStart('');
      setLeaveEnd('');
      setLeaveReason('');
      fetchServicesData();
    } catch {
      alert('Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/services/file-request', {
        category: certType,
        description: `Purpose: ${certPurpose}`
      });
      alert(`Certificate request for '${certType}' registered ✓`);
      setCertPurpose('');
      fetchServicesData();
    } catch {
      alert('Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/services/file-request', {
        category: reqCategory,
        description: reqDesc
      });
      alert(`Service Request for '${reqCategory}' logged successfully ✓`);
      setReqDesc('');
      fetchServicesData();
    } catch {
      alert('Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookAppt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/services/book-appointment', {
        staffName: apptStaff,
        date: apptDate,
        time: apptTime,
        purpose: apptPurpose
      });
      alert('Appointment slot booked and confirmed ✓');
      setApptDate('');
      setApptPurpose('');
      fetchServicesData();
    } catch {
      alert('Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookCouns = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/services/book-counselling', {
        counselorName: counsName,
        date: counsDate,
        time: counsTime
      });
      alert('Wellness counselling session booked successfully ✓');
      setCounsDate('');
      fetchServicesData();
    } catch {
      alert('Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const cssStyle = `
    .srv-wrapper {
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
      grid-template-columns: 1.1fr 1.4fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .grid-split {
        grid-template-columns: 1fr;
      }
    }
    .card-box {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.05);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
    }
    .category-pills {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 18px;
    }
    .pill-btn {
      padding: 12px 16px;
      text-align: left;
      font-size: 13.5px;
      font-weight: 700;
      color: #475569;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pill-btn.active {
      background: #0f172a;
      color: #ffffff;
      border-color: #0f172a;
    }
    .tbl-services {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .tbl-services th {
      text-align: left;
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      padding-bottom: 10px;
      border-bottom: 1px solid #cbd5e1;
      text-transform: uppercase;
    }
    .tbl-services td {
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .badge-status {
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 9.5px;
      font-weight: 800;
    }
  `;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '30px 20px', fontFamily: 'var(--font-body), sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: cssStyle }} />

      <div className="srv-wrapper">
        <h1 className="page-title">💼 Student Services Desk</h1>

        <div className="grid-split">
          {/* Left Block: Services Selector & Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card-box">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Select Service Category</h3>
              
              <div className="category-pills">
                {[
                  { id: 'leave', label: '📝 Apply for Leave' },
                  { id: 'certificate', label: '🎓 Certificate Requests' },
                  { id: 'general', label: '🔧 Service Requests' },
                  { id: 'appointment', label: '📅 Book HOD Appointment' },
                  { id: 'counselling', label: '🧠 Book Counselling' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCat(c.id as ServiceCategory)}
                    className={`pill-btn ${activeCat === c.id ? 'active' : ''}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Form Render */}
            <div className="card-box">
              {activeCat === 'leave' && (
                <form onSubmit={handleApplyLeave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>Apply for College Leave</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Start Date *</label>
                      <input type="date" required className="form-input" value={leaveStart} onChange={e => setLeaveStart(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>End Date *</label>
                      <input type="date" required className="form-input" value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Leave Category Type</label>
                    <select className="form-input" value={leaveType} onChange={e => setLeaveType(e.target.value)}>
                      <option value="Personal">Personal Leave</option>
                      <option value="Medical">Medical Leave (Fit cert required)</option>
                      <option value="On-Duty">On-Duty / Academic representation</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Reason Details *</label>
                    <textarea required className="form-input" style={{ minHeight: 70 }} placeholder="State reason for leave of absence..." value={leaveReason} onChange={e => setLeaveReason(e.target.value)} />
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary" style={{ justifyContent: 'center' }}>
                    {submitting ? 'Submitting...' : '✓ Submit Leave Application'}
                  </button>
                </form>
              )}

              {activeCat === 'certificate' && (
                <form onSubmit={handleRequestCert} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>Request Document / Certificate</h3>
                  
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Certificate Type</label>
                    <select className="form-input" value={certType} onChange={e => setCertType(e.target.value)}>
                      <option value="Bonafide Certificate">Bonafide Certificate</option>
                      <option value="Transfer Certificate">Transfer Certificate (TC)</option>
                      <option value="Official Marks Transcript">Official Marks Transcript</option>
                      <option value="Migration Certificate">Migration Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Purpose of Request *</label>
                    <input type="text" required className="form-input" placeholder="e.g. Visa request, internship onboarding" value={certPurpose} onChange={e => setCertPurpose(e.target.value)} />
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary" style={{ justifyContent: 'center', background: 'var(--purple)' }}>
                    {submitting ? 'Submitting...' : '✓ Submit Document Request'}
                  </button>
                </form>
              )}

              {activeCat === 'general' && (
                <form onSubmit={handleFileRequest} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>File Service Request</h3>
                  
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Request Category</label>
                    <select className="form-input" value={reqCategory} onChange={e => setReqCategory(e.target.value)}>
                      <option value="ID Card Replacement">ID Card Replacement (RFID card reissue)</option>
                      <option value="Hostel Room Change">Hostel Room Change Request</option>
                      <option value="Locker Key Request">Locker Key Request</option>
                      <option value="Course Adjustment">Course Swap / Core adjustment</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Detailed Description *</label>
                    <textarea required className="form-input" style={{ minHeight: 70 }} placeholder="Elaborate request details..." value={reqDesc} onChange={e => setReqDesc(e.target.value)} />
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary" style={{ justifyContent: 'center', background: 'var(--teal)' }}>
                    {submitting ? 'Filing...' : '✓ File Service Request'}
                  </button>
                </form>
              )}

              {activeCat === 'appointment' && (
                <form onSubmit={handleBookAppt} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>Book Faculty Appointment Slot</h3>
                  
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Select Staff / Faculty Member</label>
                    <select className="form-input" value={apptStaff} onChange={e => setApptStaff(e.target.value)}>
                      <option value="Dr. Priya Sharma (CSE Professor)">Dr. Priya Sharma (CSE Professor)</option>
                      <option value="Dr. Ananya Rao (Electronics HOD)">Dr. Ananya Rao (Electronics HOD)</option>
                      <option value="Academics Dean Office">Academics Dean Office</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Date *</label>
                      <input type="date" required className="form-input" value={apptDate} onChange={e => setApptDate(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Available Time Slot</label>
                      <select className="form-input" value={apptTime} onChange={e => setApptTime(e.target.value)}>
                        <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                        <option value="11:30 AM">11:30 AM - 12:00 PM</option>
                        <option value="03:00 PM">03:00 PM - 03:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Purpose of Visit *</label>
                    <input type="text" required className="form-input" placeholder="e.g. project review or grade check" value={apptPurpose} onChange={e => setApptPurpose(e.target.value)} />
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary" style={{ justifyContent: 'center', background: 'var(--coral)' }}>
                    {submitting ? 'Booking...' : '✓ Confirm Slot Appointment'}
                  </button>
                </form>
              )}

              {activeCat === 'counselling' && (
                <form onSubmit={handleBookCouns} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>Book Guidance / Counselling session</h3>
                  
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Counselor Specialist</label>
                    <select className="form-input" value={counsName} onChange={e => setCounsName(e.target.value)}>
                      <option value="Dr. Evelyn (Mental Health Advisor)">Dr. Evelyn (Mental Health & Wellness)</option>
                      <option value="Mr. Vikram (Career Alignment Lead)">Mr. Vikram (Career Guidance counselor)</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Date *</label>
                      <input type="date" required className="form-input" value={counsDate} onChange={e => setCounsDate(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Available Time Slot</label>
                      <select className="form-input" value={counsTime} onChange={e => setCounsTime(e.target.value)}>
                        <option value="09:30 AM">09:30 AM - 10:30 AM</option>
                        <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                        <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary" style={{ justifyContent: 'center', background: '#3b82f6' }}>
                    {submitting ? 'Booking...' : '✓ Confirm Counselling Session'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Block: Request Registry Tracker List */}
          <div className="card-box" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, marginBottom: 12 }}>📋 Leave Applications Log</h3>
              <table className="tbl-services">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Date Duration</th>
                    <th>Reason / Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leaves.map(l => {
                    let bg = '#fef3c7'; let fg = '#b45309';
                    if (l.status === 'Approved') { bg = '#d1fae5'; fg = '#065f46'; }
                    else if (l.status === 'Rejected') { bg = '#fee2e2'; fg = '#b91c1c'; }

                    return (
                      <tr key={l.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{l.id}</td>
                        <td>{l.startDate} to {l.endDate}</td>
                        <td>
                          <strong>{l.type}</strong>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{l.reason}</div>
                        </td>
                        <td>
                          <span className="badge-status" style={{ background: bg, color: fg }}>{l.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, marginBottom: 12 }}>📋 Service & Document Requests</h3>
              <table className="tbl-services">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Request Category</th>
                    <th>Detail Context</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.requests.map(r => {
                    let bg = '#fef3c7'; let fg = '#b45309';
                    if (r.status === 'Completed' || r.status === 'Approved') { bg = '#d1fae5'; fg = '#065f46'; }
                    else if (r.status === 'In Progress') { bg = '#dbeafe'; fg = '#1e40af'; }

                    return (
                      <tr key={r.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{r.id}</td>
                        <td style={{ fontWeight: 600 }}>{r.category}</td>
                        <td style={{ fontSize: 11, color: '#64748b' }}>{r.description}</td>
                        <td>
                          <span className="badge-status" style={{ background: bg, color: fg }}>{r.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>📅 HOD Appointments</h4>
                {data.appointments.map(a => (
                  <div key={a.id} style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, marginBottom: 6 }}>
                    <strong>{a.staffName}</strong>
                    <div style={{ color: '#64748b', fontSize: 11 }}>📅 {a.date} | {a.time}</div>
                    <div style={{ fontSize: 11, fontStyle: 'italic', marginTop: 2 }}>"{a.purpose}"</div>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>🧠 Counselling Slots</h4>
                {data.counselling.map(c => (
                  <div key={c.id} style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, marginBottom: 6 }}>
                    <strong>{c.counselorName}</strong>
                    <div style={{ color: '#64748b', fontSize: 11 }}>📅 {c.date} | {c.time}</div>
                    <span style={{ fontSize: 9.5, color: '#10b981', fontWeight: 800 }}>● {c.status}</span>
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
