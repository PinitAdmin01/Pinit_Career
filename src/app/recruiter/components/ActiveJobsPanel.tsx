'use client';

import React from 'react';
import { Job, emptyJob } from '../hooks/useRecruiterData';

interface ActiveJobsPanelProps {
  jobs: Job[];
  setEditingJob: (job: Job | null) => void;
  setJobForm: (job: Job) => void;
  setShowJobModal: (show: boolean) => void;
  handleDeleteJob: (id: string) => void;
  triggerToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function ActiveJobsPanel({
  jobs,
  setEditingJob,
  setJobForm,
  setShowJobModal,
  handleDeleteJob,
  triggerToast,
}: ActiveJobsPanelProps) {
  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💼</div>
        <h3 className="empty-title">No job postings created</h3>
        <p className="empty-desc">Create details of your employment opportunities to start matching candidates.</p>
        <button
          onClick={() => {
            setEditingJob(null);
            setJobForm(emptyJob);
            setShowJobModal(true);
          }}
          className="btn-primary"
          style={{ marginTop: 12 }}
        >
          + Post Job
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
      {jobs.map((job) => (
        <div
          key={job.id}
          className="glass-card card-hover"
          style={{
            borderRadius: 18,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid var(--border)',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h4 style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--t1)', margin: 0 }}>{job.title}</h4>
              <span className="badge badge-purple" style={{ fontSize: 10 }}>
                {job.job_type}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600, marginBottom: 8 }}>🏢 {job.company}</div>

            {job.location && (
              <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 4 }}>
                📍 {job.location} ({job.work_mode})
              </div>
            )}
            {job.department && (
              <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 4 }}>🏛 {job.department}</div>
            )}
            {job.salary_range && (
              <div style={{ fontSize: 11.5, color: 'var(--teal)', fontWeight: 700, marginBottom: 4 }}>
                💰 {job.salary_range}
              </div>
            )}
            {job.interview_rounds && (
              <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 4 }}>
                🔄 {job.interview_rounds} rounds
              </div>
            )}
            {job.bond_period && (
              <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 4 }}>📜 {job.bond_period}</div>
            )}

            {job.skills_required && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
                {job.skills_required
                  .split(',')
                  .slice(0, 4)
                  .map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 9.5,
                        padding: '2px 7px',
                        background: 'var(--bg3)',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        color: 'var(--t2)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {s.trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: 20,
              borderTop: '1px solid var(--border)',
              paddingTop: 14,
              display: 'flex',
              gap: 8,
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={() => {
                setEditingJob(job);
                setJobForm(job);
                setShowJobModal(true);
              }}
              className="btn-ghost btn-sm"
              style={{ fontSize: 11, padding: '4px 10px', flex: 1, justifyContent: 'center' }}
            >
              ✏ Edit
            </button>
            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/opportunities?jobId=${job.id}`;
                navigator.clipboard
                  .writeText(shareUrl)
                  .then(() => {
                    triggerToast('Job listing URL copied to clipboard!', 'success');
                  })
                  .catch(() => {
                    triggerToast('Could not copy link.', 'error');
                  });
              }}
              className="btn-ghost btn-sm"
              style={{ fontSize: 11, padding: '4px 10px', flex: 1, justifyContent: 'center' }}
            >
              🔗 Share
            </button>
            <button
              onClick={() => handleDeleteJob(job.id!)}
              className="btn-ghost btn-sm"
              style={{
                color: 'var(--coral)',
                border: '1px solid rgba(var(--danger-rgb), 0.2)',
                fontSize: 11,
                padding: '4px 10px',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
