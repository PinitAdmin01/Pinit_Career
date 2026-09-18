'use client';

import React from 'react';
import { Session } from '../hooks/useConsultantData';

interface SessionSchedulerPanelProps {
  sessions: Session[];
  sessionForm: Session;
  setSessionForm: React.Dispatch<React.SetStateAction<Session>>;
  allStudents: any[];
  scheduling: boolean;
  scheduleSessions: (e: React.FormEvent) => Promise<void>;
}

export default function SessionSchedulerPanel({
  sessions,
  sessionForm,
  setSessionForm,
  allStudents,
  scheduling,
  scheduleSessions,
}: SessionSchedulerPanelProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20 }} className="fade-in">
      {/* Scheduled Sessions list */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          Scheduled consultations
        </h3>
        {sessions.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: 'var(--t3)',
              fontStyle: 'italic',
              padding: 20,
              background: 'var(--card)',
              borderRadius: 10,
            }}
          >
            No sessions scheduled yet. Fill out the scheduler form on the right.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sessions.map((s, idx) => (
              <div
                key={s.id || idx}
                style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{s.title}</h4>
                  <span className="badge badge-purple" style={{ fontSize: 10 }}>
                    {s.date} @ {s.time}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>
                  Student: <strong>{s.studentName}</strong>
                </div>
                {s.link && (
                  <div style={{ marginTop: 8, fontSize: 11 }}>
                    Meeting URL:{' '}
                    <a href={s.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                      {s.link}
                    </a>
                  </div>
                )}
                {s.notes && (
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--t3)', fontStyle: 'italic' }}>
                    Notes: {s.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Session form */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 20,
          height: 'fit-content',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
          Schedule a New Session
        </h3>
        <form onSubmit={scheduleSessions} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label className="form-label">Session Title *</label>
            <input
              className="form-input"
              style={{ width: '100%' }}
              value={sessionForm.title}
              onChange={(e) => setSessionForm((p) => ({ ...p, title: e.target.value }))}
              required
              placeholder="e.g. Visa Interview Prep"
            />
          </div>

          <div>
            <label className="form-label">Select Student *</label>
            <select
              className="form-input"
              style={{ width: '100%' }}
              value={sessionForm.studentId}
              onChange={(e) => setSessionForm((p) => ({ ...p, studentId: e.target.value }))}
              required
            >
              <option value="">-- Choose Candidate --</option>
              {allStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName} ({s.targetCountry})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-input"
                style={{ width: '100%' }}
                value={sessionForm.date}
                onChange={(e) => setSessionForm((p) => ({ ...p, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="form-label">Time *</label>
              <input
                type="time"
                className="form-input"
                style={{ width: '100%' }}
                value={sessionForm.time}
                onChange={(e) => setSessionForm((p) => ({ ...p, time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Meeting URL</label>
            <input
              className="form-input"
              style={{ width: '100%' }}
              value={sessionForm.link}
              onChange={(e) => setSessionForm((p) => ({ ...p, link: e.target.value }))}
              placeholder="https://zoom.us/j/..."
            />
          </div>

          <div>
            <label className="form-label">Agenda Notes</label>
            <textarea
              className="form-input"
              style={{ width: '100%', minHeight: 60, resize: 'vertical' }}
              value={sessionForm.notes}
              onChange={(e) => setSessionForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Review documents and mocks..."
            />
          </div>

          <button
            type="submit"
            disabled={scheduling}
            className="btn-primary"
            style={{ marginTop: 8, justifyContent: 'center' }}
          >
            {scheduling ? 'Scheduling Session...' : 'Schedule Session'}
          </button>
        </form>
      </div>
    </div>
  );
}
