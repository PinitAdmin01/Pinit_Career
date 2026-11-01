'use client';

import React, { useState, useEffect } from 'react';
import { teacherEventService, TeacherEventRecord } from '@/lib/services/teacherEventService';

export default function TeacherEventsAuditTab() {
  const [events, setEvents] = useState<TeacherEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'scheduled' | 'completed'>('all');
  const [auditFilter, setAuditFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<TeacherEventRecord | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditForm, setAuditForm] = useState<{
    auditStatus: 'approved' | 'pending_audit' | 'compliance_flagged';
    auditNotes: string;
    budget: number;
  }>({
    auditStatus: 'approved',
    auditNotes: '',
    budget: 0
  });

  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Hackathon' as any,
    venue: 'Main Seminar Hall & Hybrid Arena',
    durationHours: 4,
    budget: 20000
  });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    const data = await teacherEventService.getEvents();
    setEvents(data);
    setLoading(false);
  }

  const filteredEvents = events.filter(e => {
    const matchesStatus = filter === 'all' || e.status === filter;
    const matchesAudit = auditFilter === 'all' || e.auditStatus === auditFilter;
    return matchesStatus && matchesAudit;
  });

  function startAuditModal(event: TeacherEventRecord) {
    setSelectedEvent(event);
    setAuditForm({
      auditStatus: event.auditStatus,
      auditNotes: event.auditNotes || 'All venue safety protocols, equipment, and budget vetted by faculty auditor.',
      budget: event.budget
    });
    setIsAuditing(true);
  }

  async function handleSaveAudit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const updated = await teacherEventService.auditEvent(selectedEvent.id, {
        auditStatus: auditForm.auditStatus,
        auditNotes: auditForm.auditNotes,
        auditedBy: 'Dr. Kashyap (Faculty Lead)',
        budget: auditForm.budget
      });

      setEvents(prev => prev.map(ev => (ev.id === updated.id ? updated : ev)));
      setSelectedEvent(updated);
      setIsAuditing(false);
      setFeedback(`✅ Certified faculty audit for "${updated.title}". Status: ${updated.auditStatus.toUpperCase()}.`);
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback('❌ Failed to update event audit.');
    }
  }

  async function handleStartEvent(id: string, title: string) {
    try {
      const updated = await teacherEventService.startEvent(id);
      setEvents(prev => prev.map(ev => (ev.id === id ? updated : ev)));
      setFeedback(`🚀 Event "${title}" has been STARTED! Live attendance & participation desk active.`);
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback('❌ Failed to start event.');
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEvent.title) return;

    try {
      const created = await teacherEventService.createEvent(newEvent);
      setEvents(prev => [created, ...prev]);
      setShowCreateModal(false);
      setNewEvent({
        title: '',
        category: 'Hackathon',
        venue: 'Main Seminar Hall & Hybrid Arena',
        durationHours: 4,
        budget: 20000
      });
      setFeedback(`🎉 New campus event "${created.title}" scheduled and registered for faculty audit.`);
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback('❌ Failed to create event.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>
            🎪 Campus Events Audit & Live Execution Studio
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--t3)', fontSize: 14.5 }}>
            Audit venue logistics, vet financial budgets, certify compliance protocols, and launch live campus drives & hackathons.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}
        >
          + Propose New Campus Event
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '14px 18px',
          borderRadius: 10,
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid #10b981',
          color: '#10b981',
          fontWeight: 650,
          fontSize: 14
        }}>
          {feedback}
        </div>
      )}

      {/* Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'scheduled', label: '⏳ Scheduled' },
            { id: 'live', label: '🔴 Live Running' },
            { id: 'completed', label: '✓ Completed' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: filter === f.id ? '#2563eb' : 'var(--card, #fff)',
                color: filter === f.id ? '#fff' : 'var(--t2)',
                fontSize: 13,
                fontWeight: filter === f.id ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>Audit Filter:</span>
          {['all', 'approved', 'pending_audit', 'compliance_flagged'].map(a => (
            <button
              key={a}
              onClick={() => setAuditFilter(a)}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: auditFilter === a ? '#0f172a' : 'var(--card, #fff)',
                color: auditFilter === a ? '#fff' : 'var(--t2)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {a.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div style={{ background: 'var(--card, #fff)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Event Title & Category</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Venue & Date</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Budget</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Attendees</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Status</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Faculty Audit</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--t3)' }}>
                  Loading events audit registry...
                </td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--t3)' }}>
                  No campus events match your active filters.
                </td>
              </tr>
            ) : (
              filteredEvents.map(event => (
                <tr key={event.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 650, color: 'var(--t1)', fontSize: 14 }}>{event.title}</div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'rgba(59,130,246,0.1)',
                      color: '#2563eb'
                    }}>
                      {event.category}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, color: 'var(--t1)' }}>{event.venue}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                      {new Date(event.eventDate).toLocaleDateString()} • {event.durationHours} hrs
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--t1)' }}>
                    ₹{event.budget.toLocaleString()}
                  </td>

                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--t2)' }}>
                    {event.attendeesCount} Students
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      background: event.status === 'live' ? '#dc2626' : event.status === 'scheduled' ? '#2563eb' : '#64748b',
                      color: '#fff'
                    }}>
                      {event.status === 'live' ? '● LIVE' : event.status}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 750,
                        textTransform: 'uppercase',
                        background: event.auditStatus === 'approved' ? '#dcfce7' : event.auditStatus === 'pending_audit' ? '#fef3c7' : '#fee2e2',
                        color: event.auditStatus === 'approved' ? '#15803d' : event.auditStatus === 'pending_audit' ? '#92400e' : '#b91c1c'
                      }}>
                        {event.auditStatus.replace('_', ' ')}
                      </span>
                      {event.auditedBy && (
                        <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>
                          by {event.auditedBy}
                        </div>
                      )}
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => startAuditModal(event)}
                        style={{
                          padding: '5px 12px',
                          background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: 'var(--t1)'
                        }}
                      >
                        🔍 Audit Details
                      </button>

                      {event.status === 'scheduled' && (
                        <button
                          onClick={() => handleStartEvent(event.id, event.title)}
                          style={{
                            padding: '5px 14px',
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 750,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(16,185,129,0.3)'
                          }}
                        >
                          ⚡ Start Event
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Modal */}
      {isAuditing && selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: 'var(--card, #fff)',
            borderRadius: 16,
            padding: 28,
            maxWidth: 580,
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 19, fontWeight: 700, color: 'var(--t1)' }}>
              🔍 Faculty Compliance & Financial Audit: {selectedEvent.title}
            </h3>

            <form onSubmit={handleSaveAudit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'var(--bg3)', padding: 14, borderRadius: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>Event Venue</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--t1)' }}>{selectedEvent.venue}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>Event Date</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--t1)' }}>{new Date(selectedEvent.eventDate).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                  Approved Budget (₹ INR)
                </label>
                <input
                  type="number"
                  value={auditForm.budget}
                  onChange={e => setAuditForm({ ...auditForm, budget: Number(e.target.value) })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                  Audit Decision Status
                </label>
                <select
                  value={auditForm.auditStatus}
                  onChange={e => setAuditForm({ ...auditForm, auditStatus: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                >
                  <option value="approved">Approved & Certified for Execution</option>
                  <option value="pending_audit">Under Inspection / Pending Docs</option>
                  <option value="compliance_flagged">Compliance Flagged / Requires Revision</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                  Auditor Remarks & Compliance Notes
                </label>
                <textarea
                  rows={3}
                  value={auditForm.auditNotes}
                  onChange={e => setAuditForm({ ...auditForm, auditNotes: e.target.value })}
                  required
                  placeholder="Verify venue permissions, cloud credits, catering, and lab safety protocols..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsAuditing(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--t2)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 22px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Certify Audit Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule New Event Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: 'var(--card, #fff)',
            borderRadius: 16,
            padding: 28,
            maxWidth: 540,
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>
              Propose New Campus Event
            </h3>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. State-Level AI Research Symposium"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>Category</label>
                  <select
                    value={newEvent.category}
                    onChange={e => setNewEvent({ ...newEvent, category: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Placement Drive">Placement Drive</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>Allocated Budget (₹)</label>
                  <input
                    type="number"
                    value={newEvent.budget}
                    onChange={e => setNewEvent({ ...newEvent, budget: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>Venue</label>
                <input
                  type="text"
                  value={newEvent.venue}
                  onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--t2)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 22px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
