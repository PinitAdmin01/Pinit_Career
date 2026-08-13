'use client';
// src/app/events/page.tsx
// Student Events page containing categorizations, RSVP triggers, and downloadable certificate generators.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';

export default function StudentEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<any | null>(null);

  const studentName = user?.displayName || user?.email || 'Student';
  const studentEmail = user?.email || '';

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      const data = await api.get<any>('/api/events/stats');
      setEvents(data.catalog || []);
      setRsvps(data.rsvps || []);
    } catch {}
  };

  const isCurrentUserRsvp = (r: any) => {
    if (!user) return false;
    if (r.studentId && user.id && r.studentId === user.id) return true;
    if (r.studentEmail && studentEmail && r.studentEmail === studentEmail) return true;
    if (r.studentName && user.displayName && r.studentName === user.displayName) return true;
    return false;
  };

  const handleRSVP = async (eventId: string) => {
    if (!user) {
      alert('Please sign in to RSVP.');
      return;
    }
    try {
      const res = await api.post<{ ok: boolean; error?: string }>('/api/events/rsvp', {
        eventId,
        studentName,
        studentEmail,
      });
      if (res && res.ok) {
        alert('RSVP confirmed! See you at the event 🎉');
        fetchEventsData();
      } else {
        alert(res.error || 'Failed to RSVP.');
      }
    } catch {
      alert('Error confirming RSVP.');
    }
  };

  const isRsvpd = (eventId: string) => {
    return rsvps.some((r: any) => r.eventId === eventId && isCurrentUserRsvp(r));
  };

  const getRsvpDetails = (eventId: string) => {
    return rsvps.find((r: any) => r.eventId === eventId && isCurrentUserRsvp(r));
  };

  const filteredEvents = events.filter(e => {
    if (e.completed) return false; // Only show active upcoming events in main catalog
    if (filter === 'All') return true;
    return e.category === filter;
  });

  const completedRsvps = events.filter(e => e.completed).map(e => {
    const userRsvp = getRsvpDetails(e.id);
    return userRsvp ? { ...e, rsvpInfo: userRsvp } : null;
  }).filter(Boolean);

  return (
    <div className="portal-page">
      <style>{`
        .evt-wrapper {
          max-width: 1040px;
          margin: 0 auto;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .page-title {
          font-family: var(--font-display), sans-serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.6px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
        }
        .filter-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .filter-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid var(--border);
          background: var(--card);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-btn.active {
          background: var(--t1);
          color: var(--card);
          border-color: var(--t1);
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .evt-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px var(--border);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .evt-badge {
          align-self: flex-start;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .evt-title {
          font-family: var(--font-display), sans-serif;
          font-size: 16px;
          font-weight: 800;
          margin: 0 0 8px 0;
        }
        .evt-desc {
          font-size: 13px;
          color: var(--t2);
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .evt-meta {
          font-size: 12px;
          color: var(--t2);
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .evt-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .card-box {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px var(--border);
        }
        .cert-card {
          background: var(--bg3);
          border: 1px dashed var(--border2);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
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
        .cert-modal {
          background: var(--card);
          border-radius: 20px;
          width: 90%;
          max-width: 680px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
        }
        .cert-border {
          border: 8px double var(--t1);
          padding: 30px;
          text-align: center;
          background: var(--card);
          position: relative;
        }
      `}</style>

      <div className="evt-wrapper">
        <div className="page-header">
          <h1 className="page-title">🎉 Campus Events Hub</h1>
        </div>

        {/* Categories filters */}
        <div className="filter-bar">
          {['All', 'Hackathons', 'Seminars', 'Clubs', 'General'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Catalog grid */}
        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'var(--t2)' }}>
              No upcoming campus events listed in category.
            </div>
          ) : (
            filteredEvents.map(e => {
              const rsvp = isRsvpd(e.id);
              const isFull = e.rsvpCount >= e.capacity;
              return (
                <div key={e.id} className="evt-card">
                  <div>
                    <span className="evt-badge" style={{
                      background: e.category === 'Hackathons' ? 'var(--coral-light)' : (e.category === 'Seminars' ? 'var(--accent-light)' : 'var(--purple-light)'),
                      color: e.category === 'Hackathons' ? 'var(--coral)' : (e.category === 'Seminars' ? 'var(--accent)' : 'var(--purple)')
                    }}>{e.category}</span>
                    <h3 className="evt-title">{e.title}</h3>
                    <p className="evt-desc">{e.description}</p>
                  </div>
                  
                  <div>
                    <div className="evt-meta">
                      <div className="evt-meta-item">
                        <span>📅</span> <strong>{new Date(e.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
                      </div>
                      <div className="evt-meta-item">
                        <span>🕒</span> {e.time}
                      </div>
                      <div className="evt-meta-item">
                        <span>📍</span> {e.venue}
                      </div>
                      <div className="evt-meta-item">
                        <span>👥</span> Capacity: {e.rsvpCount} / {e.capacity} Seats Filled
                      </div>
                      <div className="evt-meta-item">
                        <span>🏫</span> Host: {e.host}
                      </div>
                    </div>

                    {rsvp ? (
                      <button
                        className="btn-ghost"
                        disabled
                        style={{ width: '100%', border: '1.5px solid var(--green)', color: 'var(--green)', background: 'var(--green-light)', fontWeight: 700 }}
                      >
                        ✓ RSVP Confirmed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRSVP(e.id)}
                        disabled={isFull}
                        className="btn-primary"
                        style={{ width: '100%' }}
                      >
                        {isFull ? '🚫 Full Capacity' : '🎟 RSVP Now'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Certificates Section */}
        <div className="card-box" style={{ marginTop: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, marginBottom: 16 }}>📜 Event Participation Certificates</h3>
          
          {completedRsvps.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--t2)', fontSize: 13.5 }}>
              No completed events with RSVP confirmations found. Certificates unlock automatically once coordinators close events.
            </div>
          ) : (
            completedRsvps.map((c: any) => (
              <div key={c.id} className="cert-card">
                <div>
                  <strong style={{ fontSize: 14 }}>{c.title}</strong>
                  <div style={{ fontSize: 11.5, color: 'var(--t2)', marginTop: 4 }}>
                    Held: {c.date} | Category: {c.category}
                  </div>
                </div>

                {c.rsvpInfo.hasCertificate ? (
                  <button
                    onClick={() => setViewingCertificate(c)}
                    className="btn-ghost btn-sm"
                    style={{ border: '1.5px solid var(--t1)', color: 'var(--t1)', padding: '6px 12px' }}
                  >
                    🎓 View Certificate
                  </button>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600 }}>Processing Approval</span>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* CERTIFICATE DISPLAY MODAL */}
      {viewingCertificate && (
        <div className="overlay">
          <div className="cert-modal">
            <div className="cert-border">
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 'bold', color: 'var(--t1)', marginBottom: 12 }}>
                Certificate of Participation
              </div>
              <div style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--t2)', marginBottom: 20 }}>
                This is proudly presented to
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, textDecoration: 'underline', color: 'var(--t1)', marginBottom: 18 }}>
                ASHWANTH KUMAR
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--t2)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6, marginBottom: 24 }}>
                for outstanding active attendance and contributions during the campus event <strong>{viewingCertificate.title}</strong>, hosted by the {viewingCertificate.host} on {viewingCertificate.date} at {viewingCertificate.venue}.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 40 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, borderBottom: '1px solid var(--t3)', width: 140, margin: '0 auto 4px auto', paddingBottom: 6 }}>
                    PinIT Dean
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t2)' }}>Authorized Signatory</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>
                    {viewingCertificate.rsvpInfo.certificateCode}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t2)' }}>Verification Hash ID</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button
                onClick={() => window.print()}
                className="btn-ghost"
                style={{ border: '1.5px solid var(--t1)' }}
              >
                🖨 Print Layout
              </button>
              <button
                onClick={() => setViewingCertificate(null)}
                className="btn-primary"
                style={{ background: 'var(--t1)' }}
              >
                ✕ Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
