'use client';

import React from 'react';
import { ResumeFormData } from '@/components/career/ResumeForm.types';

interface ResumeViewerModalProps {
  viewResumeData: { name: string; resume: ResumeFormData } | null;
  onClose: () => void;
}

export default function ResumeViewerModal({ viewResumeData, onClose }: ResumeViewerModalProps) {
  if (!viewResumeData) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 9999,
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
          width: 800,
          maxWidth: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 10,
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>
            📄 {viewResumeData.name}&apos;s Resume
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 22, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            background: 'var(--bg)',
            color: '#1f2937',
            borderRadius: 12,
            padding: '2rem',
            fontFamily: 'Georgia, serif',
            border: '1px solid #e5e7eb',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)',
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              borderBottom: '2px solid var(--accent)',
              paddingBottom: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              {viewResumeData.resume.fullName || viewResumeData.name}
            </h1>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {[viewResumeData.resume.email, viewResumeData.resume.phone, viewResumeData.resume.address]
                .filter(Boolean)
                .join('  |  ')}
            </p>
            {(viewResumeData.resume.linkedin || viewResumeData.resume.portfolio) && (
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--accent)' }}>
                {viewResumeData.resume.linkedin && (
                  <a
                    href={viewResumeData.resume.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginRight: '1rem', textDecoration: 'underline' }}
                  >
                    LinkedIn
                  </a>
                )}
                {viewResumeData.resume.portfolio && (
                  <a
                    href={viewResumeData.resume.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'underline' }}
                  >
                    Portfolio
                  </a>
                )}
              </p>
            )}
          </div>

          {/* Summary */}
          {viewResumeData.resume.summary && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderBottom: '1px solid #d1d5db',
                  paddingBottom: '0.25rem',
                  marginBottom: '0.6rem',
                  textTransform: 'uppercase',
                  color: '#1f2937',
                  letterSpacing: '0.05em',
                }}
              >
                Summary
              </h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#374151', margin: 0 }}>
                {viewResumeData.resume.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {viewResumeData.resume.experiences && viewResumeData.resume.experiences.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderBottom: '1px solid #d1d5db',
                  paddingBottom: '0.25rem',
                  marginBottom: '0.6rem',
                  textTransform: 'uppercase',
                  color: '#1f2937',
                  letterSpacing: '0.05em',
                }}
              >
                Work Experience
              </h4>
              {viewResumeData.resume.experiences.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    <span>{exp.role}</span>
                    <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.85rem' }}>
                      {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                    {exp.company}
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#374151', margin: 0 }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {viewResumeData.resume.education && viewResumeData.resume.education.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderBottom: '1px solid #d1d5db',
                  paddingBottom: '0.25rem',
                  marginBottom: '0.6rem',
                  textTransform: 'uppercase',
                  color: '#1f2937',
                  letterSpacing: '0.05em',
                }}
              >
                Education
              </h4>
              {viewResumeData.resume.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    <span>{edu.degree}</span>
                    <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.85rem' }}>{edu.year}</span>
                  </div>
                  <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                    {edu.institution}
                  </div>
                  {edu.gpa && (
                    <p style={{ fontSize: '0.88rem', color: '#4b5563', margin: 0 }}>GPA / Percentage: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {viewResumeData.resume.skills && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderBottom: '1px solid #d1d5db',
                  paddingBottom: '0.25rem',
                  marginBottom: '0.6rem',
                  textTransform: 'uppercase',
                  color: '#1f2937',
                  letterSpacing: '0.05em',
                }}
              >
                Skills
              </h4>
              {viewResumeData.resume.skills.technical && (
                <p style={{ fontSize: '0.9rem', margin: '0 0 0.3rem' }}>
                  <strong>Technical Skills:</strong> {viewResumeData.resume.skills.technical}
                </p>
              )}
              {viewResumeData.resume.skills.professional && (
                <p style={{ fontSize: '0.9rem', margin: '0 0 0.3rem' }}>
                  <strong>Professional Competencies:</strong> {viewResumeData.resume.skills.professional}
                </p>
              )}
            </div>
          )}

          {/* Projects */}
          {viewResumeData.resume.projects && viewResumeData.resume.projects.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderBottom: '1px solid #d1d5db',
                  paddingBottom: '0.25rem',
                  marginBottom: '0.6rem',
                  textTransform: 'uppercase',
                  color: '#1f2937',
                  letterSpacing: '0.05em',
                }}
              >
                Projects
              </h4>
              {viewResumeData.resume.projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    <span>{proj.name}</span>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.85rem', textDecoration: 'underline', color: 'var(--accent)' }}
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <div style={{ fontStyle: 'italic', fontSize: '0.88rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                      Technologies: {proj.technologies}
                    </div>
                  )}
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#374151', margin: 0 }}>
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {viewResumeData.resume.certificates && viewResumeData.resume.certificates.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderBottom: '1px solid #d1d5db',
                  paddingBottom: '0.25rem',
                  marginBottom: '0.6rem',
                  textTransform: 'uppercase',
                  color: '#1f2937',
                  letterSpacing: '0.05em',
                }}
              >
                Certifications
              </h4>
              {viewResumeData.resume.certificates.map((cert, idx) => (
                <div key={idx} style={{ marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    <span>{cert.name}</span>
                    <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.85rem' }}>{cert.date}</span>
                  </div>
                  <div style={{ fontStyle: 'italic', fontSize: '0.88rem', color: '#4b5563' }}>
                    Issuer: {cert.issuer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
