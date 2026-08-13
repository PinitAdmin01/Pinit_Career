'use client';
// src/app/alumni/page.tsx

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';

type SubTab = 'directory' | 'mentorship' | 'jobs' | 'donations' | 'events';

export default function StudentAlumniPortal() {
  const { user } = useAuth();
  const contributorName = user?.displayName || user?.email || 'Student';
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('directory');
  
  const [directory, setDirectory] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [connects, setConnects] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Forms inputs
  const [mentorName, setMentorName] = useState('');
  const [mentorSlot, setMentorSlot] = useState('');
  const [requestingMentorship, setRequestingMentorship] = useState(false);

  const [donateAmount, setDonateAmount] = useState('5000');
  const [selectedDonationId, setSelectedDonationId] = useState('');
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    fetchAlumniData();
  }, []);

  const fetchAlumniData = async () => {
    try {
      const data = await api.get<any>('/api/alumni/stats');
      setDirectory(data.directory || []);
      setJobs(data.jobs || []);
      setDonations(data.donations || []);
      setEvents(data.events || []);
      setConnects(data.connects || []);
      setReferrals(data.referrals || []);
    } catch {}
  };

  const handleMentorshipRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestingMentorship(true);
    try {
      const res = await api.post<{ ok: boolean }>('/api/alumni/mentorship-request', {
        mentorName,
        studentName: contributorName,
        slot: mentorSlot
      });
      if (res && res.ok) {
        alert(`Mentorship slot session requested with ${mentorName} ✓`);
        setMentorName('');
        setMentorSlot('');
        fetchAlumniData();
      }
    } catch {
      alert('Request failed');
    } finally {
      setRequestingMentorship(false);
    }
  };

  const handleReferralRequest = async (jobId: string) => {
    try {
      const res = await api.post<{ ok: boolean }>('/api/alumni/referral-request', {
        jobId,
        studentName: contributorName
      });
      if (res && res.ok) {
        alert('Job referral request submitted to alum! Resume portfolio attached ✓');
        fetchAlumniData();
      }
    } catch {
      alert('Referral request failed');
    }
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonationId) {
      alert('Please select a donation campaign drive');
      return;
    }
    setDonating(true);
    try {
      const res = await api.post<{ ok: boolean }>('/api/alumni/donate', {
        campaignId: selectedDonationId,
        amount: Number(donateAmount),
        contributorName
      });
      if (res && res.ok) {
        alert('Donation recorded in the local alumni simulator. This is not a real payment.');
        setDonateAmount('5000');
        fetchAlumniData();
      }
    } catch {
      alert('Donation simulator failed');
    } finally {
      setDonating(false);
    }
  };

  const filteredDirectory = directory.filter((alm: any) => {
    return (
      alm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alm.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alm.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alm.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const cssStyle = `
    .alm-wrapper {
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
    .sub-tab-bar {
      display: flex;
      gap: 6px;
      border-bottom: 1px solid var(--border2);
      margin-bottom: 24px;
      overflow-x: auto;
    }
    .sub-tab-btn {
      padding: 10px 18px;
      font-size: 13.5px;
      font-weight: 700;
      color: var(--t2);
      border: none;
      background: none;
      cursor: pointer;
      border-bottom: 3.5px solid transparent;
      transition: all 0.2s ease;
    }
    .sub-tab-btn.active {
      color: var(--t1);
      border-bottom-color: var(--t1);
    }
    .card-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px var(--border);
    }
    .directory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 18px;
    }
    .profile-card {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      background: var(--card);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .jobs-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .job-card {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      background: var(--card);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .campaign-card {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      background: var(--card);
      margin-bottom: 18px;
    }
    .progress-bar {
      background: var(--border);
      border-radius: 10px;
      height: 10px;
      overflow: hidden;
      width: 100%;
      margin: 10px 0;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--green);
    }
  `;

  return (
    <div className="portal-page">
      <style dangerouslySetInnerHTML={{ __html: cssStyle }} />

      <div className="alm-wrapper">
        <h1 className="page-title">🎓 Alumni Portal</h1>

        {/* Workspace subtabs */}
        <div className="sub-tab-bar">
          {[
            { id: 'directory', label: 'Alumni Directory' },
            { id: 'mentorship', label: 'Mentorship Sync' },
            { id: 'jobs', label: 'Referrals & Jobs' },
            { id: 'donations', label: 'Development Fund' },
            { id: 'events', label: 'Reunion Events' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTab)}
              className={`sub-tab-btn ${activeSubTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SUBTAB: ALUMNI DIRECTORY */}
        {activeSubTab === 'directory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', maxWidth: 400 }}
                placeholder="🔍 Search alumni by name, company, batch, or domain..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="directory-grid">
              {filteredDirectory.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'var(--t2)' }}>
                  No alumni directory entries match search query.
                </div>
              ) : (
                filteredDirectory.map(alm => (
                  <div key={alm.id} className="profile-card">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', fontWeight: 800, marginBottom: 6 }}>
                        <span>Batch of {alm.batch}</span>
                        <span>{alm.id}</span>
                      </div>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: 15, fontWeight: 800 }}>{alm.name}</h3>
                      <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 600 }}>{alm.role}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--t2)' }}>🏢 {alm.company}</div>
                      <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Expertise: {alm.domain}</div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--t2)' }}>{alm.email}</span>
                      <button
                        onClick={() => {
                          setActiveSubTab('mentorship');
                          setMentorName(alm.name);
                          setMentorSlot(alm.slot);
                        }}
                        className="btn-ghost btn-sm"
                        style={{ border: '1px solid var(--border2)', fontSize: 11 }}
                      >
                        💬 Connect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUBTAB: MENTORSHIP */}
        {activeSubTab === 'mentorship' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
            {/* Active Request connect form */}
            <div className="card-box" style={{ height: 'fit-content' }}>
              <h3 className="card-title">🤝 Request Alumni Mentorship</h3>
              
              <form onSubmit={handleMentorshipRequest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Mentor Professional Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Rahul Varma"
                    value={mentorName}
                    onChange={e => setMentorName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Available Sync Slot Time</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Saturdays 10-11 AM"
                    value={mentorSlot}
                    onChange={e => setMentorSlot(e.target.value)}
                  />
                </div>

                <button type="submit" disabled={requestingMentorship} className="btn-primary" style={{ width: '100%', marginTop: 6 }}>
                  {requestingMentorship ? 'Submitting request...' : '✓ Schedule Sync Session'}
                </button>
              </form>
            </div>

            {/* Active Connects tracking */}
            <div className="card-box">
              <h3 className="card-title">📋 Active Sync Connections</h3>
              {connects.length === 0 ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--t2)', fontSize: 13.5 }}>
                  No mentorship request logs filed yet. Find mentors in directory and click connect!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {connects.map(c => (
                    <div key={c.id} style={{ padding: 14, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: 13.5 }}>{c.mentorName}</span>
                        <span style={{
                          padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                          background: 'var(--accent-light)', color: 'var(--accent)'
                        }}>{c.status}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Slot Time: {c.slot}</div>
                      <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>Requested Date: {c.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB: JOBS & REFERRALS */}
        {activeSubTab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card-box">
              <h3 className="card-title">💼 Alumni Job Postings & Referral Gateways</h3>
              
              <div className="jobs-list">
                {jobs.map(j => {
                  const hasRequested = referrals.some(r => r.jobId === j.id);
                  return (
                    <div key={j.id} className="job-card">
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800 }}>{j.title}</h4>
                        <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 600 }}>{j.company} - <span style={{ color: 'var(--t2)', fontWeight: 500 }}>{j.location}</span></div>
                        <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Posted By: <strong>{j.postedBy}</strong> | Salary: {j.salary}</div>
                      </div>

                      <div>
                        {hasRequested ? (
                          <span style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 700 }}>✓ Referral Requested</span>
                        ) : (
                          <button
                            onClick={() => handleReferralRequest(j.id)}
                            className="btn-primary"
                            style={{ fontSize: 12, padding: '8px 14px' }}
                          >
                            🎟 Ask for Referral
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: DONATIONS */}
        {activeSubTab === 'donations' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
            {/* Campaign Progression lists */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, marginBottom: 14 }}>🚀 Active Development Campaigns</h3>
              {donations.map(d => {
                const raised = d.raised ?? 0;
                const goal = d.goal && d.goal > 0 ? d.goal : 1;
                const percent = Math.min(100, Math.round((raised / goal) * 100));
                return (
                  <div key={d.id} className="campaign-card">
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 14.5, fontWeight: 800 }}>{d.title}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t2)', marginBottom: 4 }}>
                      <span>Raised: <strong>₹{raised.toLocaleString()}</strong></span>
                      <span>Goal: ₹{(d.goal ?? 0).toLocaleString()}</span>
                    </div>

                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)' }}>
                      <span>{percent}% Completed</span>
                      <span>{d.contributors} Alumni Contributors</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Donation Checkout Simulator */}
            <div className="card-box" style={{ height: 'fit-content' }}>
              <h3 className="card-title">💰 Donate to Development Seeds</h3>
              <form onSubmit={handleDonateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Select Campaign *</label>
                  <select
                    className="form-input"
                    value={selectedDonationId}
                    onChange={e => setSelectedDonationId(e.target.value)}
                  >
                    <option value="">-- Choose Campaign --</option>
                    {donations.map(d => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Donation Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="5000"
                    value={donateAmount}
                    onChange={e => setDonateAmount(e.target.value)}
                  />
                </div>

                <button type="submit" disabled={donating} className="btn-primary" style={{ width: '100%', marginTop: 6, background: 'var(--green)' }}>
                  {donating ? 'Simulating payment...' : '💳 Contribute Seed Funds'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SUBTAB: REUNION EVENTS */}
        {activeSubTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>🎉 Alumni Reunions & Networking Dinners</h3>
            <div className="directory-grid">
              {events.map(e => (
                <div key={e.id} className="profile-card">
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>Reunion</span>
                    <h3 style={{ margin: '8px 0 6px 0', fontSize: 15, fontWeight: 800 }}>{e.title}</h3>
                    <div style={{ fontSize: 12.5, color: 'var(--t2)', marginBottom: 12 }}>
                      <div>📅 Date: {e.date}</div>
                      <div>🕒 Time: {e.time}</div>
                      <div>📍 Venue: {e.venue}</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11.5, color: 'var(--t2)' }}>👥 {e.attendees} Attending</span>
                    <button
                      onClick={() => {
                        alert('RSVP confirmed! Invitation badge sent to registered email.');
                        fetchAlumniData();
                      }}
                      className="btn-primary btn-sm"
                      style={{ fontSize: 11 }}
                    >
                      ✓ Attend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
