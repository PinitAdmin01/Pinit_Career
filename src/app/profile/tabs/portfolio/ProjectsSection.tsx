'use client';

import React, { useState } from 'react';
import { ProjectItem } from './usePortfolioData';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  addProject: (title: string, desc: string, tech: string) => void;
  toggleVerification?: (type: 'project', id: string) => void;
}

export function ProjectsSection({ projects, addProject, toggleVerification }: ProjectsSectionProps) {
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('');

  const handleAdd = () => {
    if (!newProjTitle.trim() || !newProjDesc.trim()) return;
    addProject(newProjTitle.trim(), newProjDesc.trim(), newProjTech.trim());
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjTech('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {projects.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--t3)', margin: '8px 0' }}>No projects pitched yet. Add your flagship projects below.</p>
        ) : (
          projects.map(p => (
            <div key={p.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>{p.title}</h4>
                <span
                  onClick={() => toggleVerification && toggleVerification('project', p.id)}
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: p.verified ? 'var(--green-light)' : 'rgba(255,255,255,0.02)',
                    color: p.verified ? 'var(--green)' : 'var(--t3)',
                    cursor: toggleVerification ? 'pointer' : 'default'
                  }}
                >
                  {p.verified ? '✓ Verified' : 'Pending Verification'}
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: '0 0 10px 0', lineHeight: 1.5 }}>{p.description}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {p.tech.map(t => (
                  <span key={t} style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 4, background: 'var(--bg2)', color: 'var(--t3)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: 13.5, fontWeight: 800 }}>Pitch New Code Project</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text"
            placeholder="Project Name"
            value={newProjTitle}
            onChange={e => setNewProjTitle(e.target.value)}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }}
          />
          <textarea
            placeholder="Technical scope, problems solved..."
            value={newProjDesc}
            onChange={e => setNewProjDesc(e.target.value)}
            rows={3}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5, resize: 'vertical' }}
          />
          <input
            type="text"
            placeholder="Tech Stack (comma separated)"
            value={newProjTech}
            onChange={e => setNewProjTech(e.target.value)}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }}
          />
          <button
            onClick={handleAdd}
            style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            Add Project for Verification
          </button>
        </div>
      </div>
    </div>
  );
}
