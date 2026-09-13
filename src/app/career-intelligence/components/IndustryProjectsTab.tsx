'use client';

import React from 'react';
import { Project } from '../hooks/useCareerIntelligenceData';
import { card, cardLabel } from './constants';

interface IndustryProjectsTabProps {
  activeRole: 'student' | 'recruiter' | 'placement' | 'faculty';
  projectsTab: 'browse' | 'track';
  setProjectsTab: (tab: 'browse' | 'track') => void;
  projects: Project[];
  applyToProject: (id: string) => void;
  newTitle: string;
  setNewTitle: (val: string) => void;
  newTech: string;
  setNewTech: (val: string) => void;
  createProject: (e: React.FormEvent) => void;
  approveProject: (id: string) => void;
  gradingProjId: string | null;
  setGradingProjId: (id: string | null) => void;
  selectedCredits: number;
  setSelectedCredits: (credits: number) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  submitGrade: (e: React.FormEvent) => void;
}

export function IndustryProjectsTab({
  activeRole,
  projectsTab,
  setProjectsTab,
  projects,
  applyToProject,
  newTitle,
  setNewTitle,
  newTech,
  setNewTech,
  createProject,
  approveProject,
  gradingProjId,
  setGradingProjId,
  selectedCredits,
  setSelectedCredits,
  selectedGrade,
  setSelectedGrade,
  submitGrade
}: IndustryProjectsTabProps) {
  return (
    <div>
      {activeRole === 'student' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 8, border: '1px solid var(--border)', width: 'fit-content' }}>
            <button
              onClick={() => setProjectsTab('browse')}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                background: projectsTab === 'browse' ? 'var(--bg2)' : 'transparent',
                color: projectsTab === 'browse' ? 'var(--accent)' : 'var(--t3)'
              }}
            >
              🔍 Browse Projects
            </button>
            <button
              onClick={() => setProjectsTab('track')}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                background: projectsTab === 'track' ? 'var(--bg2)' : 'transparent',
                color: projectsTab === 'track' ? 'var(--accent)' : 'var(--t3)'
              }}
            >
              📋 Track My Work
            </button>
          </div>

          {projectsTab === 'browse' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {projects.filter(p => p.status === 'approved' && !p.applied).map(proj => (
                <div key={proj.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', justifySelf: 'stretch', justifyContent: 'space-between', minHeight: 180 }}>
                  <div>
                    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 14.5, fontWeight: 900, margin: 0 }}>{proj.title}</h3>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)' }}>₹{proj.budget}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 8 }}>{proj.company} · Duration: {proj.duration}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                      {proj.tech.map(t => (
                        <span key={t} style={{ fontSize: 10, padding: '2px 6px', background: 'var(--bg3)', borderRadius: 4, border: '1px solid var(--border)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => applyToProject(proj.id)} className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: 11.5 }}>
                    Apply to Project
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={card}>
              <div style={cardLabel}>Active Portfolio Projects</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {projects.filter(p => p.applied).map(proj => (
                  <div key={proj.id} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13.5 }}>{proj.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>{proj.company} · Budget: ₹{proj.budget}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: proj.status === 'completed' ? 'var(--green)' : 'var(--amber)' }}>
                      {proj.status === 'completed' ? `Completed (${proj.grade})` : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeRole === 'recruiter' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.0fr', gap: 20 }}>
          <div style={card}>
            <div style={cardLabel}>Active Client Briefs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {projects.map(proj => (
                <div key={proj.id} style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{proj.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>Budget: ₹{proj.budget} · Status: {proj.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={cardLabel}>Publish Client Project</div>
            <form onSubmit={createProject} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Project Title"
                style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--t1)', fontSize: 12.5 }}
              />
              <input
                type="text"
                value={newTech}
                onChange={e => setNewTech(e.target.value)}
                placeholder="Required Tech (comma separated)"
                style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--t1)', fontSize: 12.5 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px' }}>Submit Brief</button>
            </form>
          </div>
        </div>
      )}

      {activeRole === 'placement' && (
        <div style={card}>
          <div style={cardLabel}>Pending Project Approvals</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {projects.filter(p => p.status === 'pending').map(proj => (
              <div key={proj.id} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800 }}>{proj.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)' }}>{proj.company} · Budget: ₹{proj.budget}</div>
                </div>
                <button onClick={() => approveProject(proj.id)} className="btn-primary" style={{ padding: '6px 14px', fontSize: 11 }}>
                  Approve Listing
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeRole === 'faculty' && (
        <div style={card}>
          <div style={cardLabel}>Project Evaluations & Academic Credits</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {projects.filter(p => p.applied && p.status !== 'completed').map(proj => (
              <div key={proj.id} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800 }}>{proj.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)' }}>Student: {proj.studentName}</div>
                </div>
                {gradingProjId === proj.id ? (
                  <form onSubmit={submitGrade} style={{ display: 'flex', gap: 6 }}>
                    <select
                      value={selectedCredits}
                      onChange={e => setSelectedCredits(Number(e.target.value))}
                      style={{ padding: '4px', background: 'var(--bg2)', color: 'var(--t1)', border: '1px solid var(--border)', borderRadius: 4 }}
                    >
                      <option value={2}>2 Credits</option>
                      <option value={4}>4 Credits</option>
                    </select>
                    <select
                      value={selectedGrade}
                      onChange={e => setSelectedGrade(e.target.value)}
                      style={{ padding: '4px', background: 'var(--bg2)', color: 'var(--t1)', border: '1px solid var(--border)', borderRadius: 4 }}
                    >
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                    </select>
                    <button type="submit" style={{ padding: '4px 8px', background: 'var(--green)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                      Save
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setGradingProjId(proj.id)}
                    style={{ padding: '6px 12px', fontSize: 11, background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 800 }}
                  >
                    Evaluate Task
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
