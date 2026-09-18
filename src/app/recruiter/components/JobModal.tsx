'use client';

import React from 'react';
import { Job } from '../hooks/useRecruiterData';

interface JobModalProps {
  showJobModal: boolean;
  setShowJobModal: (show: boolean) => void;
  editingJob: Job | null;
  jobForm: Job;
  setJobForm: React.Dispatch<React.SetStateAction<Job>>;
  jobSaving: boolean;
  jobSuggestions: {
    titles: string[];
    locations: string[];
    skills: string[];
    departments: string[];
    benefits: string[];
    responsibilities: string[];
    requirements: string[];
  };
  postJob: (e: React.FormEvent) => Promise<void>;
}

export default function JobModal({
  showJobModal,
  setShowJobModal,
  editingJob,
  jobForm,
  setJobForm,
  jobSaving,
  jobSuggestions,
  postJob,
}: JobModalProps) {
  if (!showJobModal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 24,
          width: 720,
          maxWidth: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>
            {editingJob ? '✏️ Edit Job Posting' : '🚀 Post a New Job'}
          </h3>
          <button
            onClick={() => setShowJobModal(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 22, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <form onSubmit={postJob} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 5 }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--accent)' }}>
              📋 Core Information
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Job Title *</label>
              {jobSuggestions.titles.length > 0 && !jobForm.title && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                  {jobSuggestions.titles.slice(0, 3).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setJobForm((p) => ({ ...p, title: t }))}
                      style={{
                        fontSize: 9.5,
                        padding: '2px 6px',
                        background: 'var(--bg3)',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        color: 'var(--t2)',
                        cursor: 'pointer',
                      }}
                    >
                      + {t}
                    </button>
                  ))}
                </div>
              )}
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.title}
                onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                required
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
            <div>
              <label className="form-label">Department / Team</label>
              {jobSuggestions.departments.length > 0 && !jobForm.department && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                  {jobSuggestions.departments.slice(0, 3).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setJobForm((p) => ({ ...p, department: d }))}
                      style={{
                        fontSize: 9.5,
                        padding: '2px 6px',
                        background: 'var(--bg3)',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        color: 'var(--t2)',
                        cursor: 'pointer',
                      }}
                    >
                      + {d}
                    </button>
                  ))}
                </div>
              )}
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.department}
                onChange={(e) => setJobForm((p) => ({ ...p, department: e.target.value }))}
                placeholder="e.g. Engineering"
              />
            </div>
            <div>
              <label className="form-label">Location</label>
              {jobSuggestions.locations.length > 0 && !jobForm.location && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                  {jobSuggestions.locations.slice(0, 3).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setJobForm((p) => ({ ...p, location: l }))}
                      style={{
                        fontSize: 9.5,
                        padding: '2px 6px',
                        background: 'var(--bg3)',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        color: 'var(--t2)',
                        cursor: 'pointer',
                      }}
                    >
                      + {l}
                    </button>
                  ))}
                </div>
              )}
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.location}
                onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Bangalore, KA"
              />
            </div>
            <div>
              <label className="form-label">Work Mode</label>
              <select
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.work_mode}
                onChange={(e) => setJobForm((p) => ({ ...p, work_mode: e.target.value }))}
              >
                {['Remote', 'On-site', 'Hybrid', 'Flexible'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Job Type</label>
              <select
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.job_type}
                onChange={(e) => setJobForm((p) => ({ ...p, job_type: e.target.value }))}
              >
                {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Experience Level</label>
              <select
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.experience_level}
                onChange={(e) => setJobForm((p) => ({ ...p, experience_level: e.target.value }))}
              >
                {['Fresher / Entry Level (0–1 yr)', 'Junior (1–3 yrs)', 'Mid-Level (3–5 yrs)', 'Senior (5–8 yrs)', 'Lead (8+ yrs)'].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Salary Range</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.salary_range}
                onChange={(e) => setJobForm((p) => ({ ...p, salary_range: e.target.value }))}
                placeholder="e.g. ₹12L - ₹18L per annum"
              />
            </div>
            <div>
              <label className="form-label">Number of Openings</label>
              <input
                type="number"
                min={1}
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.openings}
                onChange={(e) => setJobForm((p) => ({ ...p, openings: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <label className="form-label">Application Deadline</label>
              <input
                type="date"
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.deadline}
                onChange={(e) => setJobForm((p) => ({ ...p, deadline: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Industry</label>
              <select
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.industry}
                onChange={(e) => setJobForm((p) => ({ ...p, industry: e.target.value }))}
              >
                {['Technology', 'Finance & Banking', 'Healthcare', 'Education', 'E-Commerce', 'Consulting', 'Other'].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginTop: 10, marginBottom: 5 }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--accent)' }}>
              🎯 Requirements & Perks
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Education Required</label>
              <select
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.education_required}
                onChange={(e) => setJobForm((p) => ({ ...p, education_required: e.target.value }))}
              >
                <option value="">Select option…</option>
                {['Any / Not required', "Bachelor's Degree", "Master's Degree", 'MBA', 'Diploma'].map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Notice Period Expected</label>
              <select
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.notice_period}
                onChange={(e) => setJobForm((p) => ({ ...p, notice_period: e.target.value }))}
              >
                <option value="">Select period…</option>
                {['Immediate', '15 Days', '30 Days', '60 Days', '90 Days', 'Negotiable'].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Interview Rounds</label>
              <select
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.interview_rounds}
                onChange={(e) => setJobForm((p) => ({ ...p, interview_rounds: e.target.value }))}
              >
                <option value="">Select rounds…</option>
                {['1 Round', '2 Rounds', '3 Rounds', '4+ Rounds'].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Service Agreement / Bond Period</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.bond_period}
                onChange={(e) => setJobForm((p) => ({ ...p, bond_period: e.target.value }))}
                placeholder="e.g. No bond / 1 year service agreement"
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Language Requirements</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={jobForm.language_required}
                onChange={(e) => setJobForm((p) => ({ ...p, language_required: e.target.value }))}
                placeholder="e.g. English (Fluent), Hindi (Conversational)"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Required Skills (comma-separated)</label>
            {jobSuggestions.skills.length > 0 && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                {jobSuggestions.skills.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      const cur = jobForm.skills_required || '';
                      const parts = cur.split(',').map((x) => x.trim()).filter(Boolean);
                      if (!parts.includes(s)) {
                        setJobForm((p) => ({ ...p, skills_required: cur ? `${cur}, ${s}` : s }));
                      }
                    }}
                    style={{
                      fontSize: 9.5,
                      padding: '2px 6px',
                      background: 'var(--bg3)',
                      borderRadius: 4,
                      border: '1px solid var(--border)',
                      color: 'var(--t2)',
                      cursor: 'pointer',
                    }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            )}
            <input
              className="form-input"
              style={{ width: '100%' }}
              value={jobForm.skills_required}
              onChange={(e) => setJobForm((p) => ({ ...p, skills_required: e.target.value }))}
              placeholder="React, Node.js, TypeScript"
            />
          </div>

          <div>
            <label className="form-label">Job Description</label>
            <textarea
              className="form-input"
              style={{ width: '100%', minHeight: 70, resize: 'vertical' }}
              value={jobForm.description}
              onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="form-label">Perks, Benefits & Details</label>
            {jobSuggestions.benefits.length > 0 && !jobForm.benefits && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
                {jobSuggestions.benefits.slice(0, 3).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setJobForm((p) => ({ ...p, benefits: b }))}
                    style={{
                      fontSize: 9.5,
                      padding: '2px 6px',
                      background: 'var(--bg3)',
                      borderRadius: 4,
                      border: '1px solid var(--border)',
                      color: 'var(--t2)',
                      cursor: 'pointer',
                    }}
                  >
                    + {b}
                  </button>
                ))}
              </div>
            )}
            <textarea
              className="form-input"
              style={{ width: '100%', minHeight: 50, resize: 'vertical' }}
              value={jobForm.benefits}
              onChange={(e) => setJobForm((p) => ({ ...p, benefits: e.target.value }))}
              placeholder="e.g. Health insurance, flexible hours, remote work options"
            />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" onClick={() => setShowJobModal(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={jobSaving} className="btn-primary">
              {jobSaving ? 'Saving...' : editingJob ? 'Save Changes' : 'Post Job opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
