'use client';
// src/app/research/page.tsx
// Faculty/Student Research Desk containing publication trackers, patent filings, active project matrices, and grants directories.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export default function FacultyResearchPortal() {
  const [papers, setPapers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [patents, setPatents] = useState<any[]>([]);
  const [funding, setFunding] = useState<any[]>([]);

  const [paperTitle, setPaperTitle] = useState('');
  const [paperAuthors, setPaperAuthors] = useState('');
  const [paperJournal, setPaperJournal] = useState('');
  const [submittingPaper, setSubmittingPaper] = useState(false);

  useEffect(() => {
    fetchResearchData();
  }, []);

  const fetchResearchData = async () => {
    try {
      const data = await api.get<any>('/api/research/stats');
      setPapers(data.papers || []);
      setProjects(data.projects || []);
      setPatents(data.patents || []);
      setFunding(data.funding || []);
    } catch {}
  };

  const handlePublishPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPaper(true);
    try {
      const res = await api.post<{ ok: boolean }>('/api/research/publish-paper', {
        title: paperTitle,
        authors: paperAuthors,
        journal: paperJournal,
        status: 'Draft'
      });
      if (res && res.ok) {
        alert('Research manuscript initialized in Publication Tracker ✓');
        setPaperTitle('');
        setPaperJournal('');
        fetchResearchData();
      }
    } catch {
      alert('Failed to publish paper.');
    } finally {
      setSubmittingPaper(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Draft': return 1;
      case 'Under Review': return 2;
      case 'Accepted': return 3;
      case 'Published': return 4;
      default: return 1;
    }
  };

  return (
    <div className="portal-page">
      <style>{`
        .res-wrapper {
          max-width: 1040px;
          margin: 0 auto;
        }
        .page-title {
          font-family: var(--font-display), sans-serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.6px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .metric-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px var(--border);
        }
        .metric-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--t2);
          letter-spacing: 0.5px;
        }
        .metric-value {
          font-family: var(--font-display), sans-serif;
          font-size: 22px;
          font-weight: 850;
          margin-top: 6px;
        }
        .grid-split {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .grid-split {
            grid-template-columns: 1fr;
          }
        }
        .card-box {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px var(--border);
        }
        .card-title {
          font-family: var(--font-display), sans-serif;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tracker-bar {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          position: relative;
        }
        .tracker-bar::before {
          content: '';
          position: absolute;
          top: 8px; left: 0; right: 0;
          height: 3px;
          background: var(--border);
          z-index: 1;
        }
        .tracker-step {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 10px;
          font-weight: 700;
          color: var(--t2);
        }
        .tracker-dot {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: var(--border2);
          border: 3px solid var(--card);
          margin-bottom: 4px;
          box-shadow: 0 2px 4px var(--border);
        }
        .tracker-step.active {
          color: var(--accent);
        }
        .tracker-step.active .tracker-dot {
          background: var(--accent);
        }
        .progress-bar-container {
          background: var(--border);
          border-radius: 10px;
          height: 8px;
          overflow: hidden;
          width: 100%;
          margin-top: 6px;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--green);
          border-radius: 10px;
        }
        .project-card {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          background: var(--bg3);
        }
      `}</style>

      <div className="res-wrapper">
        <h1 className="page-title">🔬 Institutional Research Desk</h1>

        {/* Stats Header Grid */}
        <div className="metric-grid">
          {[
            { label: 'Published Papers', value: `${papers.filter(p => p.status === 'Published').length} Papers`, color: 'var(--accent)' },
            { label: 'Active Projects', value: `${projects.length} Grants`, color: 'var(--green)' },
            { label: 'Filed Patents', value: `${patents.length} Filings`, color: '#8b5cf6' },
            { label: 'Funding Secured', value: `₹${(projects.reduce((acc, curr) => acc + (curr.grantAmount || 0), 0) / 100000).toFixed(1)}L`, color: '#f59e0b' }
          ].map(s => (
            <div key={s.label} className="metric-card">
              <div className="metric-label">{s.label}</div>
              <div className="metric-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid-split">
          {/* Left Block: Publication tracker & patent roster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Publication Tracker */}
            <div className="card-box">
              <h3 className="card-title">📝 Publication Submission Pipeline</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {papers.map(p => {
                  const currentStep = getStatusStep(p.status);
                  return (
                    <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 18, background: 'var(--card)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4 }}>{p.id}</span>
                        <span style={{
                          padding: '3px 8px', borderRadius: 20, fontSize: 10.5, fontWeight: 700,
                          background: p.status === 'Published' ? '#d1fae5' : (p.status === 'Accepted' ? 'var(--accent-light)' : 'var(--amber-light)'),
                          color: p.status === 'Published' ? '#065f46' : (p.status === 'Accepted' ? '#1e40af' : '#b45309')
                        }}>{p.status}</span>
                      </div>
                      
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: 14.5, fontWeight: 800 }}>{p.title}</h4>
                      <div style={{ fontSize: 11.5, color: 'var(--t2)' }}>Authors: {p.authors} | Target Journal: {p.journal}</div>

                      {/* Timeline steps */}
                      <div className="tracker-bar">
                        {[
                          { label: 'Draft', step: 1 },
                          { label: 'Review', step: 2 },
                          { label: 'Accepted', step: 3 },
                          { label: 'Published', step: 4 }
                        ].map(t => (
                          <div key={t.label} className={`tracker-step ${currentStep >= t.step ? 'active' : ''}`}>
                            <div className="tracker-dot" />
                            <span>{t.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Manuscript Composer */}
              <form onSubmit={handlePublishPaper} style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>➕ Log Manuscript/Draft Paper</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Manuscript Paper Title"
                    value={paperTitle}
                    onChange={e => setPaperTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Target Journal (e.g. IEEE)"
                    value={paperJournal}
                    onChange={e => setPaperJournal(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={submittingPaper} className="btn-primary" style={{ width: '100%' }}>
                  {submittingPaper ? 'Submitting Draft...' : '✓ Register to Tracker'}
                </button>
              </form>
            </div>

            {/* Patent Registry */}
            <div className="card-box">
              <h3 className="card-title">💡 Intellectual Property (Patents)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {patents.map(pat => (
                  <div key={pat.id} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: 13.5 }}>{pat.title}</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--t2)', marginTop: 4 }}>
                        Inventors: {pat.inventors} | File Ref: {pat.fileNo}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>Filed Date: {pat.filedOn}</div>
                    </div>
                    <span style={{
                      padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                      background: 'var(--accent-light)', color: '#1e40af', border: '1px solid #bfdbfe'
                    }}>{pat.status}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Block: Sponsored Projects & Grants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Active Projects */}
            <div className="card-box">
              <h3 className="card-title">🔬 Sponsored Research Projects</h3>
              
              <div>
                {projects.map(proj => (
                  <div key={proj.id} className="project-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 800, color: 'var(--t2)', marginBottom: 6 }}>
                      <span>Ref: {proj.id}</span>
                      <span>Budget: ₹{(proj.grantAmount || 0).toLocaleString()}</span>
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: 14, fontWeight: 800 }}>{proj.title}</h4>
                    
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 12 }}>
                      <div>Principal Inv. (PI): <strong>{proj.pi}</strong></div>
                      <div>Co-PI: {proj.coPi}</div>
                      <div>Funding Agency: {proj.fundingAgency}</div>
                      <div>Duration: {proj.duration}</div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--t2)' }}>
                        <span>Research Milestones</span>
                        <span>{proj.progress}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${proj.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding Grants Directory */}
            <div className="card-box">
              <h3 className="card-title">💰 Grants & Seed Funding</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {funding.map(f => (
                  <div key={f.id} style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                    <div>
                      <strong>{f.title}</strong>
                      <div style={{ color: 'var(--t2)', fontSize: 11, marginTop: 2 }}>PI: {f.pi} | Agency: {f.agency}</div>
                      <div style={{ fontWeight: 700, color: 'var(--t1)', marginTop: 4 }}>Amount: ₹{f.amount.toLocaleString()}</div>
                    </div>
                    <span style={{
                      padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                      background: f.status === 'Approved' ? 'var(--green-light)' : 'var(--amber-light)',
                      color: f.status === 'Approved' ? '#047857' : '#b45309'
                    }}>{f.status}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
