'use client';

import React from 'react';
import { JobApplication } from '../hooks/useRecruiterData';
import { ResumeFormData } from '@/components/career/ResumeForm.types';

interface ApplicationsPanelProps {
  applications: JobApplication[];
  appReviewing: JobApplication | null;
  setAppReviewing: (app: JobApplication | null) => void;
  updatingAppStatus: string | null;
  handleUpdateAppStatus: (appId: string, status: string) => void;
  setViewResumeData: (data: { name: string; resume: ResumeFormData } | null) => void;
}

export default function ApplicationsPanel({
  applications,
  appReviewing,
  setAppReviewing,
  updatingAppStatus,
  handleUpdateAppStatus,
  setViewResumeData,
}: ApplicationsPanelProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: appReviewing ? '1fr 380px' : '1fr', gap: 20 }}>
      <div>
        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📨</div>
            <h3 className="empty-title">No applications received yet</h3>
            <p className="empty-desc">Once candidates apply to your postings, they will appear here.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position Applied</th>
                <th>ATS</th>
                <th>Trust</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 600 }}>{app.user?.full_name || 'Student'}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.jobTitle}</div>
                    <div style={{ fontSize: 10, color: 'var(--t3)' }}>{app.jobCompany}</div>
                  </td>
                  <td style={{ color: 'var(--teal)', fontWeight: 700 }}>{app.user?.ats_score || 50}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 700 }}>{app.user?.trust_score || 50}</td>
                  <td>
                    <span
                      className={`badge ${
                        app.status === 'hired'
                          ? 'badge-green'
                          : app.status === 'shortlisted'
                          ? 'badge-purple'
                          : app.status === 'rejected'
                          ? 'badge-coral'
                          : 'badge-amber'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setAppReviewing(app)}
                      className="btn-ghost btn-sm"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      Review →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Application Review Drawer */}
      {appReviewing && (
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 20,
            height: 'fit-content',
            position: 'sticky',
            top: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Review Application</div>
            <button
              onClick={() => setAppReviewing(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 16 }}
            >
              ✕
            </button>
          </div>

          <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{appReviewing.user?.full_name}</div>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>
              {appReviewing.user?.email} · {appReviewing.user?.phone}
            </div>
            <div style={{ marginTop: 8, fontSize: 11 }}>
              Applied For: <strong>{appReviewing.jobTitle}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {appReviewing.user?.structured_resume && (
              <button
                onClick={() =>
                  setViewResumeData({
                    name: appReviewing.user?.full_name || '',
                    resume: appReviewing.user?.structured_resume!,
                  })
                }
                className="btn-primary"
                style={{ background: 'var(--purple)', color: 'var(--text)', fontSize: 11, padding: '8px 12px' }}
              >
                📄 View Candidate Resume
              </button>
            )}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="form-label" style={{ fontSize: 11 }}>
              Update Stage Status
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
              {[
                { id: 'pending', label: '⏳ Mark Pending', color: 'var(--t2)' },
                { id: 'shortlisted', label: '⭐ Shortlist', color: 'var(--purple)' },
                { id: 'hired', label: '🎉 Hire Candidate', color: 'var(--green)' },
                { id: 'rejected', label: '❌ Reject Application', color: 'var(--coral)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleUpdateAppStatus(appReviewing.id, opt.id)}
                  disabled={updatingAppStatus !== null}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: `1px solid ${appReviewing.status === opt.id ? opt.color : 'var(--border)'}`,
                    background: appReviewing.status === opt.id ? `${opt.color}15` : 'transparent',
                    color: appReviewing.status === opt.id ? opt.color : 'var(--t1)',
                    cursor: 'pointer',
                    fontSize: 11,
                    textAlign: 'left',
                    fontWeight: 600,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
