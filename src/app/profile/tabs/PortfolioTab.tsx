'use client';

import React, { useState } from 'react';
import { CS } from './types';
import { usePortfolioData } from './portfolio/usePortfolioData';
import { PitchSection } from './portfolio/PitchSection';
import { ProjectsSection } from './portfolio/ProjectsSection';
import { CertificatesSection } from './portfolio/CertificatesSection';
import { TimelineSection } from './portfolio/TimelineSection';
import { AchievementsSection } from './portfolio/AchievementsSection';
import { RecommendationsSection } from './portfolio/RecommendationsSection';
import { GithubReposSection } from './portfolio/GithubReposSection';
import { ResearchSection } from './portfolio/ResearchSection';

interface PortfolioTabProps {
  user: any;
  cOS: any;
  passportSkills?: Array<{ id: string; name: string; level: number }>;
}

export default function PortfolioTab({ user, cOS, passportSkills: propPassportSkills }: PortfolioTabProps) {
  const passportSkills = propPassportSkills || (cOS?.skills || []).map((s: any) => ({
    id: s.id || s.name,
    name: s.name,
    level: s.level || 1
  }));

  const [activePortfolioRole, setActivePortfolioRole] = useState<'student' | 'recruiter' | 'faculty' | 'parent'>('student');
  const [activePortfolioTab, setActivePortfolioTab] = useState<string>('Profile');

  const {
    pitch,
    tempPitch,
    setTempPitch,
    editingPitch,
    setEditingPitch,
    savePitch,
    projects,
    saveProjects,
    addProject,
    certificates,
    saveCertificates,
    timeline,
    saveTimeline,
    addTimelineEvent,
    researchPapers,
    achievements,
    addAchievement,
    recommendations,
    addRecommendation,
    linkedRepos,
    saveLinkedRepos,
    toggleVerification,
    loading
  } = usePortfolioData(user);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
        Loading portfolio from cloud...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      {/* Role Perspective Switcher */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>🔧 PORTFOLIO PERSPECTIVE SWITCH:</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'student', label: '🧑‍🎓 Student Portal' },
            { id: 'recruiter', label: '🏢 Recruiter View' },
            { id: 'faculty', label: '👩‍🏫 Faculty Desk' },
            { id: 'parent', label: '👪 Parent Portal' }
          ].map(role => (
            <button
              key={role.id}
              onClick={() => setActivePortfolioRole(role.id as any)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                background: activePortfolioRole === role.id ? 'var(--accent)' : 'transparent',
                color: activePortfolioRole === role.id ? '#fff' : 'var(--t3)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Student Portal View */}
      {activePortfolioRole === 'student' && (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--bg2)', padding: 8, borderRadius: 14, border: '1px solid var(--border)' }}>
            {['Profile', 'Resume', 'Projects', 'Certificates', 'Internships', 'Achievements', 'GitHub', 'Research', 'Recommendations', 'Timeline'].map(t => (
              <button
                key={t}
                onClick={() => setActivePortfolioTab(t)}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: 8,
                  background: activePortfolioTab === t ? 'var(--accent-light)' : 'transparent',
                  color: activePortfolioTab === t ? 'var(--accent)' : 'var(--t2)',
                  fontSize: 12.5,
                  fontWeight: activePortfolioTab === t ? 800 : 500,
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            {activePortfolioTab === 'Profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <PitchSection
                  pitch={pitch}
                  tempPitch={tempPitch}
                  setTempPitch={setTempPitch}
                  editingPitch={editingPitch}
                  setEditingPitch={setEditingPitch}
                  savePitch={savePitch}
                />
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 800 }}>🧬 Career DNA Snapshot</h3>
                    <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }}>
                      Verified ATS rating: <strong>85/100</strong>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 800 }}>🏆 Last Verified Accomplishment</h3>
                    <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }}>
                      {(() => {
                        const verifiedVaultItem = cOS?.vaultItems?.find((v: any) => v.verified)?.title;
                        const lastQuest = cOS?.completedQuests?.length ? `Quest: ${cOS.completedQuests[cOS.completedQuests.length - 1]}` : null;
                        return verifiedVaultItem || lastQuest || 'None yet';
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePortfolioTab === 'Resume' && (
              <div style={{ padding: '24px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)', maxWidth: 640, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 4px 0' }}>{user?.displayName || 'Student Candidate'}</h3>
                    <p style={{ fontSize: 12, color: 'var(--t3)', margin: 0, fontFamily: 'var(--font-mono)' }}>{user?.email || 'verified@career-os.internal'}</p>
                  </div>
                  <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(var(--brand-rgb), 0.12)', color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    LIVE PORTFOLIO SYNC
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginBottom: 16 }}>
                  <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--t2)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                    Verified Skills ({passportSkills.length})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {passportSkills.map((s: any) => (
                      <span key={s.id} style={{ fontSize: 11, background: 'var(--bg2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4, color: 'var(--t1)' }}>
                        {s.name} (L{s.level})
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginBottom: 20 }}>
                  <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--t2)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                    Active Projects ({projects.length})
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--t2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {projects.map(p => (
                      <li key={p.id}><strong>{p.title}</strong> &mdash; {p.description}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <button onClick={() => window.print()} className="btn-primary" style={{ padding: '8px 20px', fontSize: 12, fontWeight: 800 }}>
                    🖨️ Print / Save as PDF
                  </button>
                </div>
              </div>
            )}

            {activePortfolioTab === 'Projects' && (
              <ProjectsSection projects={projects} addProject={addProject} toggleVerification={toggleVerification} />
            )}

            {activePortfolioTab === 'Certificates' && (
              <CertificatesSection
                certificates={certificates}
                saveCertificates={saveCertificates}
                timeline={timeline}
                saveTimeline={saveTimeline}
                cOS={cOS}
                user={user}
              />
            )}

            {activePortfolioTab === 'Internships' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Verified Internships</h3>
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 13.5, fontWeight: 800 }}>Stripe Security</h4>
                  <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 8 }}>Software Engineering Intern · 2026</div>
                  <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: 0 }}>Worked on transaction queue billing ledger systems.</p>
                </div>
              </div>
            )}

            {activePortfolioTab === 'Achievements' && (
              <AchievementsSection achievements={achievements} addAchievement={addAchievement} cOS={cOS} />
            )}

            {activePortfolioTab === 'GitHub' && (
              <GithubReposSection linkedRepos={linkedRepos} saveLinkedRepos={saveLinkedRepos} />
            )}

            {activePortfolioTab === 'Research' && (
              <ResearchSection researchPapers={researchPapers} toggleVerification={toggleVerification} />
            )}

            {activePortfolioTab === 'Recommendations' && (
              <RecommendationsSection recommendations={recommendations} addRecommendation={addRecommendation} />
            )}

            {activePortfolioTab === 'Timeline' && (
              <TimelineSection
                timeline={timeline}
                addTimelineEvent={addTimelineEvent}
                projects={projects}
                certificates={certificates}
                cOS={cOS}
              />
            )}
          </div>
        </div>
      )}

      {/* 2. Recruiter View */}
      {activePortfolioRole === 'recruiter' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={CS.card}>
              <div style={CS.cardLabel}>Dossier Core Professional Pitch</div>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>"{pitch}"</p>
            </div>
            <div style={CS.card}>
              <div style={CS.cardLabel}>Verified Projects Portfolio</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {projects.filter(p => p.verified).map(p => (
                  <div key={p.id} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                    <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 800 }}>{p.title}</h4>
                    <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: '6px 0 10px' }}>{p.description}</p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {p.tech.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg2)' }}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={CS.card}>
            <div style={CS.cardLabel}>Verified Accreditations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {certificates.filter(c => c.verified).map(c => (
                <div key={c.id} style={{ background: 'var(--bg3)', padding: 10, borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}>
                  <strong>{c.title}</strong>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>{c.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Faculty Desk View */}
      {activePortfolioRole === 'faculty' && (
        <div style={CS.card}>
          <div style={CS.cardLabel}>Student Portfolio Verifications Board</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--t3)', margin: '0 0 10px' }}>Projects pending validation:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {projects.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10 }}>
                    <div>
                      <strong style={{ fontSize: 13 }}>{p.title}</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>{p.tech.join(', ')}</div>
                    </div>
                    <button
                      onClick={() => toggleVerification('project', p.id)}
                      style={{ padding: '6px 12px', fontSize: 10.5, fontWeight: 800, background: p.verified ? 'var(--coral)' : 'var(--green)', color: 'var(--text)', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                      {p.verified ? 'Revoke Verify' : 'Verify Project'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Parent Portal View */}
      {activePortfolioRole === 'parent' && (
        <div style={CS.card}>
          <div style={CS.cardLabel}>Verified Academic Progress Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {timeline.filter(t => t.verified).map(evt => (
              <div key={evt.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800 }}>{evt.year} &middot; {evt.category}</span>
                <h4 style={{ margin: '2px 0', fontSize: 13 }}>{evt.title}</h4>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0 }}>{evt.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
