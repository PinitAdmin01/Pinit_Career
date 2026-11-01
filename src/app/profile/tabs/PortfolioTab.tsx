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

type PortfolioView = 'overview' | 'projects' | 'credentials' | 'resume' | 'verify';

const STAFF_ROLES = ['admin', 'superadmin', 'teacher'];

const sectionCard: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: 20,
};

const divider = <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />;

export default function PortfolioTab({ user, cOS, passportSkills: propPassportSkills }: PortfolioTabProps) {
  const passportSkills = propPassportSkills || (cOS?.skills || []).map((s: any) => ({
    id: s.id || s.name,
    name: s.name,
    level: s.level || 1
  }));

  const isStaff = STAFF_ROLES.includes(user?.role);
  const [view, setView] = useState<PortfolioView>('overview');
  const [recruiterPreview, setRecruiterPreview] = useState(false);

  const {
    pitch,
    tempPitch,
    setTempPitch,
    editingPitch,
    setEditingPitch,
    savePitch,
    projects,
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
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)', fontSize: 14.5 }}>
        Loading portfolio…
      </div>
    );
  }

  const verifiedProjects = projects.filter((p) => p.verified);
  const verifiedCerts = certificates.filter((c) => c.verified);
  const lastAccomplishment = (() => {
    const verifiedVaultItem = cOS?.vaultItems?.find((v: any) => v.verified)?.title;
    const lastQuest = cOS?.completedQuests?.length ? `Quest: ${cOS.completedQuests[cOS.completedQuests.length - 1]}` : null;
    return verifiedVaultItem || lastQuest || 'Nothing verified yet — finish a quest to get started.';
  })();

  const views: Array<{ id: PortfolioView; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects & GitHub' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'resume', label: 'Resume' },
    ...(isStaff ? [{ id: 'verify' as PortfolioView, label: 'Verify (Faculty)' }] : []),
  ];

  // ── Recruiter preview: exactly what an employer sees ──
  if (recruiterPreview) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '10px 16px', borderRadius: 12, background: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--accent)' }}>👁️ You are previewing your portfolio as a recruiter sees it</span>
          <button type="button" className="btn-ghost btn-sm" onClick={() => setRecruiterPreview(false)}>← Back to editing</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, gridColumn: 'span 2' }}>
            <div style={CS.card}>
              <div style={CS.cardLabel}>Professional Pitch</div>
              <p style={{ fontSize: 15.5, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>{pitch ? `"${pitch}"` : 'No pitch written yet.'}</p>
            </div>
            <div style={CS.card}>
              <div style={CS.cardLabel}>Verified Projects ({verifiedProjects.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {verifiedProjects.length === 0 && <div style={{ fontSize: 13.5, color: 'var(--t3)' }}>No verified projects yet.</div>}
                {verifiedProjects.map((p) => (
                  <div key={p.id} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>{p.title}</h4>
                    <p style={{ fontSize: 14, color: 'var(--t2)', margin: '6px 0 10px' }}>{p.description}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.tech.map((t) => <span key={t} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t2)' }}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={CS.card}>
            <div style={CS.cardLabel}>Verified Credentials ({verifiedCerts.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {verifiedCerts.length === 0 && <div style={{ fontSize: 13.5, color: 'var(--t3)' }}>No verified credentials yet.</div>}
              {verifiedCerts.map((c) => (
                <div key={c.id} style={{ background: 'var(--bg3)', padding: 10, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}>
                  <strong style={{ color: 'var(--t1)' }}>{c.title}</strong>
                  <div style={{ fontSize: 12, color: 'var(--t3)' }}>{c.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
      {/* Sub-view pills + recruiter preview */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div role="tablist" aria-label="Portfolio sections" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {views.map((v) => {
            const active = view === v.id;
            return (
              <button
                key={v.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setView(v.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'var(--accent-light)' : 'var(--bg2)',
                  color: active ? 'var(--accent)' : 'var(--t2)',
                  fontSize: 13.5,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {v.label}
              </button>
            );
          })}
        </div>
        <button type="button" className="btn-ghost btn-sm" onClick={() => setRecruiterPreview(true)}>
          👁️ Preview as recruiter
        </button>
      </div>

      {view === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={sectionCard}>
            <PitchSection
              pitch={pitch}
              tempPitch={tempPitch}
              setTempPitch={setTempPitch}
              editingPitch={editingPitch}
              setEditingPitch={setEditingPitch}
              savePitch={savePitch}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { label: 'Career Score', value: Number(cOS?.careerScore) || 0, hint: 'out of 100' },
              { label: 'Verified Projects', value: verifiedProjects.length, hint: `${projects.length} total` },
              { label: 'Verified Credentials', value: verifiedCerts.length, hint: `${certificates.length} total` },
              { label: 'Skills on Passport', value: passportSkills.length, hint: 'tracked skills' },
            ].map((s) => (
              <div key={s.label} style={{ ...sectionCard, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--font-display)', lineHeight: 1.2, marginTop: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>{s.hint}</div>
              </div>
            ))}
          </div>
          <div style={{ ...sectionCard, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>🏆 Latest verified accomplishment</div>
            <div style={{ fontSize: 14, color: 'var(--t1)' }}>{lastAccomplishment}</div>
          </div>
          <div style={sectionCard}>
            <TimelineSection
              timeline={timeline}
              addTimelineEvent={addTimelineEvent}
              projects={projects}
              certificates={certificates}
              cOS={cOS}
            />
          </div>
        </div>
      )}

      {view === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={sectionCard}>
            <ProjectsSection projects={projects} addProject={addProject} toggleVerification={toggleVerification} />
          </div>
          <div style={sectionCard}>
            <GithubReposSection linkedRepos={linkedRepos} saveLinkedRepos={saveLinkedRepos} />
          </div>
          {researchPapers.length > 0 && (
            <div style={sectionCard}>
              <ResearchSection researchPapers={researchPapers} toggleVerification={toggleVerification} />
            </div>
          )}
        </div>
      )}

      {view === 'credentials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={sectionCard}>
            <CertificatesSection
              certificates={certificates}
              saveCertificates={saveCertificates}
              timeline={timeline}
              saveTimeline={saveTimeline}
              cOS={cOS}
              user={user}
            />
          </div>
          <div style={sectionCard}>
            <AchievementsSection achievements={achievements} addAchievement={addAchievement} cOS={cOS} />
          </div>
          <div style={sectionCard}>
            <RecommendationsSection recommendations={recommendations} addRecommendation={addRecommendation} />
          </div>
        </div>
      )}

      {view === 'resume' && (() => {
        const rawResumeDisp = typeof user?.displayName === 'string' ? user.displayName : (typeof user?.name === 'string' ? user.name : '');
        const rawResumeReal = (user as any)?.fullName || (user as any)?.full_name || (user as any)?.candidateName || (user as any)?.onboardingAnswers?.candidateName || (user as any)?.onboardingAnswers?.fullName;
        const resumeRealName = typeof rawResumeReal === 'string' ? rawResumeReal : '';
        const resumeStudentName = (rawResumeDisp && !rawResumeDisp.startsWith('usr_') && rawResumeDisp.toLowerCase() !== 'student') ? rawResumeDisp : (resumeRealName || rawResumeDisp || 'Student Candidate');

        return (
        <div style={{ ...sectionCard, maxWidth: 720, margin: '0 auto', width: '100%', padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', margin: '0 0 4px 0' }}>{resumeStudentName}</h3>
              <p style={{ fontSize: 13, color: 'var(--t3)', margin: 0, fontFamily: 'var(--font-mono)' }}>{user?.email || ''}</p>
            </div>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              LIVE FROM PORTFOLIO
            </span>
          </div>
          {pitch && (
            <>
              {divider}
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, margin: '14px 0' }}>{pitch}</p>
            </>
          )}
          {divider}
          <div style={{ padding: '14px 0' }}>
            <h4 style={{ fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--t3)', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>
              Skills ({passportSkills.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {passportSkills.length === 0 && <span style={{ fontSize: 13, color: 'var(--t3)' }}>Complete quests to add verified skills.</span>}
              {passportSkills.map((s: any) => (
                <span key={s.id} style={{ fontSize: 12, background: 'var(--bg3)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4, color: 'var(--t1)' }}>
                  {s.name} · L{s.level}
                </span>
              ))}
            </div>
          </div>
          {divider}
          <div style={{ padding: '14px 0' }}>
            <h4 style={{ fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--t3)', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>
              Projects ({projects.length})
            </h4>
            {projects.length === 0 ? (
              <span style={{ fontSize: 13, color: 'var(--t3)' }}>No projects added yet.</span>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: 'var(--t2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {projects.map((p) => (
                  <li key={p.id}><strong style={{ color: 'var(--t1)' }}>{p.title}</strong> — {p.description}</li>
                ))}
              </ul>
            )}
          </div>
          {verifiedCerts.length > 0 && (
            <>
              {divider}
              <div style={{ padding: '14px 0' }}>
                <h4 style={{ fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--t3)', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>
                  Certifications
                </h4>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: 'var(--t2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {verifiedCerts.map((c) => <li key={c.id}><strong style={{ color: 'var(--t1)' }}>{c.title}</strong> — {c.issuer}</li>)}
                </ul>
              </div>
            </>
          )}
          {divider}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
            <button type="button" onClick={() => window.print()} className="btn-primary" style={{ padding: '8px 20px', fontSize: 13, fontWeight: 800 }}>
              🖨️ Print / Save as PDF
            </button>
          </div>
        </div>
        );
      })()}

      {view === 'verify' && isStaff && (
        <div style={CS.card}>
          <div style={CS.cardLabel}>Project Verification Board</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projects.length === 0 && <div style={{ fontSize: 13.5, color: 'var(--t3)' }}>No projects to review.</div>}
            {projects.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ fontSize: 14.5, color: 'var(--t1)' }}>{p.title}</strong>
                  <div style={{ fontSize: 12.5, color: 'var(--t3)' }}>{p.tech.join(', ')}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVerification('project', p.id)}
                  style={{ padding: '6px 12px', fontSize: 11.5, fontWeight: 800, background: p.verified ? 'var(--coral)' : 'var(--green)', color: '#ffffff', border: 'none', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}
                >
                  {p.verified ? 'Revoke' : 'Verify'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
