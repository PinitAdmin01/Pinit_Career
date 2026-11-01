'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from '@/lib/store/useAppStore';
import { updateUserProfile } from '@/lib/supabaseService';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { StudentSkillProfile } from '@/lib/pathway/competencySchema';
import { CS } from './types';
import CareerDnaTab from './CareerDnaTab';

const CareerPathwayTimeline = dynamic(() => import('@/components/pathway/CareerPathwayTimeline'), { ssr: false });
const CompetencyRadarView = dynamic(() => import('@/components/pathway/CompetencyRadarView'), { ssr: false });

export type PassportView = 'skills' | 'dna' | 'pathway' | 'history' | 'endorse';

interface PassportTabProps {
  user: any;
  cOS?: any;
  initialView?: PassportView;
}

export default function PassportTab({ user, cOS, initialView = 'skills' }: PassportTabProps) {
  const [view, setView] = useState<PassportView>(initialView);
  useEffect(() => { setView(initialView); }, [initialView]);
  const [skillProfile, setSkillProfile] = useState<StudentSkillProfile | null>(null);
  const [passportSkills, setPassportSkills] = useState<Array<{ id: string; name: string; level: 1|2|3; evidence: string; recency: string; verified: boolean; category: string }>>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<Array<{ date: string; type: string; score: string; result: string }>>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchSkills() {
      if (!user?.id) return;
      try {
        const data = await PathwayApiService.getStudentSkillProfile(user.id);
        if (isMounted) {
          setSkillProfile(data);
          const parseSkillLevel = (lvl: unknown): 1 | 2 | 3 => {
            const str = String(lvl);
            if (str === 'L1' || str === '1') return 1;
            if (str === 'L2' || str === '2') return 2;
            if (str === 'L3' || str === 'L4' || str === 'L5' || str === '3') return 3;
            return 1;
          };

          let endorsedIds: string[] = [];
          if (Array.isArray(user?.endorsed_skills) && user.endorsed_skills.length > 0) {
            endorsedIds = user.endorsed_skills;
          } else if (Array.isArray(user?.endorsedSkills) && user.endorsedSkills.length > 0) {
            endorsedIds = user.endorsedSkills;
          } else if (typeof window !== 'undefined') {
            try {
              const raw = localStorage.getItem(`pinit_${user.id}_endorsed_skills`);
              if (raw) endorsedIds = JSON.parse(raw);
            } catch {
              // Ignore parse errors
            }
          }

          const realSkills: Array<{ id: string; name: string; level: 1|2|3; evidence: string; recency: string; verified: boolean; category: string }> = [];
          (data.verified || []).forEach(v => {
            realSkills.push({
              id: v.id,
              name: v.name,
              level: parseSkillLevel(v.level),
              evidence: `Demonstrated practical mastery with score ${Math.round(v.score)}/100. Verification gates passed.`,
              recency: v.verifiedAt ? new Date(v.verifiedAt).toLocaleDateString() : 'Verified',
              verified: true,
              category: 'Verified Competency'
            });
          });
          (data.demonstrated || []).forEach(d => {
            const isEndorsed = endorsedIds.includes(d.id);
            realSkills.push({
              id: d.id,
              name: d.name,
              level: isEndorsed ? 3 : parseSkillLevel(d.level),
              evidence: isEndorsed ? 'Endorsed by faculty mentor.' : `Practical tasks completed in pathway (Score: ${Math.round(d.score)}/100). Ready for defense.`,
              recency: isEndorsed ? 'Faculty Endorsed' : 'In Progress',
              verified: isEndorsed,
              category: 'Demonstrated'
            });
          });
          setPassportSkills(realSkills);

          // Populate real assessment history from verified competencies and mock interview records
          const historyItems: Array<{ date: string; type: string; score: string; result: string }> = [];
          (data.verified || []).forEach(v => {
            historyItems.push({
              date: v.verifiedAt ? new Date(v.verifiedAt).toLocaleDateString() : 'Verified',
              type: `${v.name} Skill Defense & Verification`,
              score: `${Math.round(v.score)}%`,
              result: `Level ${v.level} Verified`
            });
          });
          (data.demonstrated || []).forEach(d => {
            historyItems.push({
              date: 'Active Assessment',
              type: `${d.name} Practical Project`,
              score: `${Math.round(d.score)}%`,
              result: `Level ${d.level} Demonstrated`
            });
          });
          if (typeof window !== 'undefined') {
            try {
              const interviewKey = user?.id ? `pinit_${user.id}_mock_interview_feedback` : null;
              const rawInterview = interviewKey ? localStorage.getItem(interviewKey) : null;
              if (rawInterview) {
                const interview = JSON.parse(rawInterview);
                if (interview && (interview.overallScore !== undefined || interview.score !== undefined)) {
                  historyItems.unshift({
                    date: interview.timestamp ? new Date(interview.timestamp).toLocaleDateString() : 'Recent',
                    type: `AI Mock Interview (${interview.role || 'General'})`,
                    score: `${Math.round(interview.overallScore || interview.score || 0)}%`,
                    result: (interview.overallScore || interview.score || 0) >= 75 ? 'Defense Passed' : 'Needs Practice'
                  });
                }
              }
            } catch {
              // Ignore invalid storage
            }
          }
          setAssessmentHistory(historyItems);
        }
      } catch (err) {
        console.warn('Failed to load profile skill status:', err);
      }
    }
    fetchSkills();
    return () => { isMounted = false; };
  }, [user?.id, user?.endorsedSkills, user?.endorsed_skills]);

  const toggleEndorsement = (id: string) => {
    const isPrivilegedOrPeer = Boolean(
      user?.role === 'admin' ||
      user?.role === 'superadmin' ||
      user?.role === 'teacher' ||
      user?.role === 'recruiter' ||
      (user as any)?.role === 'faculty'
    );
    if (!isPrivilegedOrPeer) {
      toast.error('Endorsement Restricted', 'Endorsements must be awarded by verified faculty mentors or industry recruiters.');
      return;
    }

    setPassportSkills(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, verified: !s.verified, level: (!s.verified ? 3 : 2) as 1|2|3 } : s);
      if (typeof window !== 'undefined' && user?.id) {
        try {
          const endorsedIds = updated.filter(s => s.verified).map(s => s.id);
          localStorage.setItem(`pinit_${user.id}_endorsed_skills`, JSON.stringify(endorsedIds));
          updateUserProfile(user.id, { endorsed_skills: endorsedIds }).catch((e) => {
            console.warn('Failed to persist endorsed skills:', e);
          });
        } catch (e) {
          console.warn('Failed to persist endorsed skills:', e);
        }
      }
      return updated;
    });
    toast.success('Skill Endorsement updated', 'Student skill passport credentials updated and synced.');
  };

  const isStaff = ['admin', 'superadmin', 'teacher'].includes(user?.role);
  const verifiedList = skillProfile?.verified || [];
  const demonstratedList = skillProfile?.demonstrated || [];
  const claimedList = skillProfile?.claimed || [];

  const views: Array<{ id: PassportView; label: string }> = [
    { id: 'skills', label: 'Skills' },
    { id: 'dna', label: 'Career DNA' },
    { id: 'pathway', label: 'Pathway & Radar' },
    { id: 'history', label: 'Assessments' },
    ...(isStaff ? [{ id: 'endorse' as PassportView, label: 'Endorse (Faculty)' }] : []),
  ];

  const emptyBox = (text: string) => (
    <div style={{ padding: 18, textAlign: 'center', color: 'var(--t3)', fontSize: 13.5, background: 'var(--bg3)', borderRadius: 10, border: '1px dashed var(--border)' }}>
      {text}
    </div>
  );

  const sectionTitle = (text: string) => (
    <h3 style={{ margin: '0 0 12px 0', fontSize: 15.5, fontWeight: 800, color: 'var(--t1)' }}>{text}</h3>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
      <div role="tablist" aria-label="Skill passport sections" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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

      {view === 'skills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { label: 'Verified', count: verifiedList.length || passportSkills.filter((s) => s.verified).length, color: 'var(--green)', hint: 'Passed evidence gates & oral defense' },
              { label: 'Demonstrated', count: demonstratedList.length, color: 'var(--blue)', hint: 'Practical coding tasks completed' },
              { label: 'Claimed', count: claimedList.length, color: 'var(--t3)', hint: 'Self-reported interests' },
            ].map((t) => (
              <div key={t.label} style={{ ...CS.card, padding: 16, borderTop: `3px solid ${t.color}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{t.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--font-display)', lineHeight: 1.2, marginTop: 4 }}>{t.count}</div>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>{t.hint}</div>
              </div>
            ))}
          </div>

          <div style={CS.card}>
            {sectionTitle('✅ Verified skills')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {verifiedList.length > 0
                ? verifiedList.map((s) => (
                    <div key={s.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>{s.name}</span>
                        <span style={{ fontSize: 12, background: 'var(--green-light)', color: 'var(--green)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>{s.level} · {Math.round(s.score)}/100</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                        Credential <code style={{ fontSize: 11, color: 'var(--accent)' }}>{s.credentialId}</code> · verified {new Date(s.verifiedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                : passportSkills.filter((s) => s.verified).length > 0
                  ? passportSkills.filter((s) => s.verified).map((s) => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{s.name}</span>
                        <span style={{ fontSize: 12, background: 'var(--green-light)', color: 'var(--green)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>Level {s.level}</span>
                      </div>
                    ))
                  : emptyBox('No verified skills yet. Finish course projects and pass the oral defense to earn verified credentials.')}
            </div>
          </div>

          <div style={CS.card}>
            {sectionTitle('🔵 Demonstrated skills')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {demonstratedList.length > 0
                ? demonstratedList.map((s) => (
                    <div key={s.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 12, borderRadius: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{s.name}</span>
                        <span style={{ fontSize: 12.5, color: 'var(--blue)', fontWeight: 700 }}>{Math.round(s.score)} pts</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, s.score)}%`, height: '100%', background: 'var(--blue)' }} />
                      </div>
                    </div>
                  ))
                : emptyBox('No demonstrated skills yet. Complete daily coding missions to generate practical evidence.')}
            </div>
          </div>

          {claimedList.length > 0 ? (
            <div style={CS.card}>
              {sectionTitle('⚪ Claimed skills')}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {claimedList.map((s) => (
                  <span key={s.id} style={{ fontSize: 12.5, padding: '4px 10px', borderRadius: 999, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)' }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={CS.card}>
              {sectionTitle('⚪ Claimed skills')}
              {emptyBox('No self-claimed skills yet. Skills appear here when you log self-reported topics or select career interests.')}
            </div>
          )}
        </div>
      )}

      {view === 'dna' && <CareerDnaTab user={user} cOS={cOS} />}

      {view === 'pathway' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={CS.card}>
            {sectionTitle('🧭 Career pathway')}
            <CareerPathwayTimeline activeProgramId="prog_software_engineering" />
          </div>
          <div style={CS.card}>
            {sectionTitle('📡 Competency radar')}
            <CompetencyRadarView />
          </div>
        </div>
      )}

      {view === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={CS.card}>
            {sectionTitle('📝 Assessment history')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assessmentHistory.length > 0
                ? assessmentHistory.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{h.type}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 2 }}>{h.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)' }}>{h.score}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>{h.result}</div>
                      </div>
                    </div>
                  ))
                : emptyBox('No assessments recorded yet. Course tests, oral defenses and AI mock interviews appear here.')}
            </div>
          </div>
          <div style={CS.card}>
            {sectionTitle('🏅 How verification levels work')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {[
                { lvl: 1, title: 'Quest Approved', desc: 'Automated tests in the course IDE confirm the fundamentals.' },
                { lvl: 2, title: 'Faculty Endorsed', desc: 'A mentor reviews your code and endorses the skill.' },
                { lvl: 3, title: 'Industry Verified', desc: 'Proven in an internship or a real client project.' },
              ].map((h) => (
                <div key={h.lvl} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--accent)', marginBottom: 4 }}>Level {h.lvl} · {h.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--t2)', margin: 0, lineHeight: 1.5 }}>{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'endorse' && isStaff && (
        <div style={CS.card}>
          {sectionTitle('Skill endorsement panel')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {passportSkills.length > 0
              ? passportSkills.map((s) => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ fontSize: 14.5, color: 'var(--t1)' }}>{s.name} (Level {s.level})</strong>
                      <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 2 }}>{s.evidence}</div>
                    </div>
                    <button type="button" onClick={() => toggleEndorsement(s.id)} style={{ padding: '6px 12px', fontSize: 11.5, fontWeight: 800, background: s.verified ? 'var(--coral)' : 'var(--accent)', color: '#ffffff', border: 'none', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}>
                      {s.verified ? 'Revoke' : 'Endorse'}
                    </button>
                  </div>
                ))
              : emptyBox('No skills submitted for endorsement yet.')}
          </div>
        </div>
      )}
    </div>
  );
}
