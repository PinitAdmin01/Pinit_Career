'use client';

import React from 'react';
import { Session } from '../hooks/useConsultantData';

interface ConsultantDashboardOverviewProps {
  allStudents: any[];
  analytics: Record<string, any>;
  sessions: Session[];
  handleInitiateCareTeamReview: (studentId: string, studentName: string) => void;
}

export default function ConsultantDashboardOverview({
  allStudents,
  analytics,
  sessions,
  handleInitiateCareTeamReview,
}: ConsultantDashboardOverviewProps) {
  if (allStudents.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 48,
          color: 'var(--t3)',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
        }}
      >
        No pipeline data. Add students or wait for API-linked candidates to appear.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(var(--brand-rgb),  0.06) 0%, rgba(var(--brand-rgb),  0.02) 100%)',
          border: '1.5px solid rgba(var(--brand-rgb),  0.25)',
          borderRadius: 14,
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>Pipeline Snapshot</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--t2)' }}>
          {allStudents.length} candidate{allStudents.length === 1 ? '' : 's'} in pipeline.
          {analytics?.totalStudents != null ? ` Analytics reports ${analytics.totalStudents} total students.` : ''} No fabricated
          scholarship or visa alerts are shown.
        </div>
      </div>

      {/* At-Risk Student Advisory Trigger Banner (advisingapp-inspired) */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(var(--danger-rgb),  0.06) 0%, rgba(var(--danger-rgb),  0.02) 100%)',
          border: '1.5px solid rgba(var(--danger-rgb),  0.3)',
          borderRadius: 14,
          padding: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🚨</span>
            <span
              style={{
                fontSize: 13.5,
                fontWeight: 900,
                color: 'var(--coral)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              At-Risk Advisory Trigger (Care Team Early Warning)
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>
            2 candidates flagged for low mock test engagement or attendance drop. Assign a multi-disciplinary Care Team to
            intervene.
          </p>
        </div>
        <button
          onClick={() => handleInitiateCareTeamReview('stud_risk_01', 'Cohort Advisory Group')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: 'var(--coral)',
            color: 'var(--text)',
            border: 'none',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(var(--danger-rgb),  0.25)',
          }}
        >
          🤝 Initiate Care Team Review
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        {[
          {
            label: "Today's Meetings",
            value: String(sessions.length),
            desc: sessions.length ? 'From scheduled sessions' : 'No sessions scheduled',
            color: 'var(--accent)',
          },
          {
            label: 'Pipeline candidates',
            value: String(allStudents.length),
            desc: 'From consultant pipeline API',
            color: 'var(--success)',
          },
          {
            label: 'Visa approved (analytics)',
            value: analytics?.visaApprovalRate != null ? `${analytics.visaApprovalRate}%` : '—',
            desc: 'From analytics endpoint',
            color: 'var(--coral)',
          },
        ].map((c, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
              {c.label}
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.value}</span>
            <span style={{ fontSize: 10, color: 'var(--t3)' }}>{c.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div
            style={{
              background: 'var(--bg3)',
              padding: '10px 14px',
              fontSize: 12,
              fontWeight: 800,
              color: 'var(--t3)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            SCHEDULED CONSULTATIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)' }}>
            {sessions.length === 0 ? (
              <div style={{ padding: 20, color: 'var(--t3)', fontSize: 12.5, textAlign: 'center' }}>
                No pipeline sessions scheduled.
              </div>
            ) : (
              sessions.slice(0, 6).map((s, idx) => (
                <div
                  key={s.id || idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderBottom: idx < Math.min(sessions.length, 6) - 1 ? '1px solid var(--border)' : 'none',
                    fontSize: 12.5,
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--t1)' }}>{s.title}</strong>
                    <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Student: {s.studentName || s.studentId}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 700 }}>{s.time || s.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div
            style={{
              background: 'var(--bg3)',
              padding: '10px 14px',
              fontSize: 12,
              fontWeight: 800,
              color: 'var(--t3)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            PIPELINE CANDIDATES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: 14, background: 'var(--card)', gap: 10 }}>
            {allStudents.slice(0, 5).map((s: any) => (
              <div
                key={s.id}
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 10,
                  fontSize: 12,
                }}
              >
                <strong>{s.displayName || s.name}</strong>: {s.status || 'onboarding'} · Visa {s.visa_status || 'not_started'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
