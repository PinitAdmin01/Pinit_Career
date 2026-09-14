'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from '@/lib/store/useAppStore';
import { updateUserProfile } from '@/lib/supabaseService';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { StudentSkillProfile } from '@/lib/pathway/competencySchema';
import { CS } from './types';

const CareerPathwayTimeline = dynamic(() => import('@/components/pathway/CareerPathwayTimeline'), { ssr: false });
const CompetencyRadarView = dynamic(() => import('@/components/pathway/CompetencyRadarView'), { ssr: false });

interface PassportTabProps {
  user: any;
  cOS?: any;
}

export default function PassportTab({ user, cOS }: PassportTabProps) {
  const [activePassportRole, setActivePassportRole] = useState<'student' | 'recruiter' | 'faculty'>('student');
  const [activePassportTab, setActivePassportTab] = useState<string>('Overview');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>🎫 PASSPORT PERSPECTIVE SWITCH:</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {['student', 'recruiter', 'faculty'].map(role => (
            <button key={role} onClick={() => setActivePassportRole(role as any)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: activePassportRole === role ? 'var(--accent)' : 'transparent', color: activePassportRole === role ? '#fff' : 'var(--t3)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {role === 'student' ? '🧑‍🎓 Student' : role === 'recruiter' ? '🔍 Recruiter' : '👩‍🏫 Faculty'}
            </button>
          ))}
        </div>
      </div>

      {activePassportRole === 'student' && (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--bg2)', padding: 8, borderRadius: 14, border: '1px solid var(--border)' }}>
            {['Career Pathway', 'Competency Matrix', 'Overview', 'Verified Skills', 'Demonstrated Skills', 'Claimed Skills', 'Assessment History', 'Verification Levels'].map(t => (
              <button key={t} onClick={() => setActivePassportTab(t)} style={{ textAlign: 'left', padding: '8px 12px', border: 'none', borderRadius: 8, background: activePassportTab === t ? 'var(--accent-light)' : 'transparent', color: activePassportTab === t ? 'var(--accent)' : 'var(--t2)', fontSize: 12.5, fontWeight: activePassportTab === t ? 800 : 500, cursor: 'pointer' }}>{t}</button>
            ))}
          </div>

          <div style={CS.card}>
            {activePassportTab === 'Career Pathway' && (
              <CareerPathwayTimeline activeProgramId="prog_software_engineering" />
            )}

            {activePassportTab === 'Competency Matrix' && (
              <CompetencyRadarView />
            )}

            {activePassportTab === 'Overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'var(--accent-light)', border: '1.5px solid var(--accent)', borderRadius: 16, padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 24 }}>🧠</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--accent)', marginBottom: 4 }}>PinIT 3-Tier Skill Validation Architecture</div>
                    <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                      Skill credentials update automatically from validated evidence records:<br />
                      • 🟢 <strong>Verified ({skillProfile?.verified.length || 0})</strong>: Passed multi-class evidence gates & oral defense.<br />
                      • 🔵 <strong>Demonstrated ({skillProfile?.demonstrated.length || 0})</strong>: Practical coding tasks completed.<br />
                      • ⚪ <strong>Claimed ({skillProfile?.claimed.length || 17})</strong>: Self-reported & baseline target interests.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Verified Credentials Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(() => {
                      const items = (skillProfile?.verified && skillProfile.verified.length > 0 ? skillProfile.verified : passportSkills.filter(s => s.verified));
                      if (items.length === 0) {
                        return (
                          <div style={{ padding: 14, textAlign: 'center', color: 'var(--t3)', fontSize: 12, background: 'var(--bg3)', borderRadius: 8 }}>
                            No verified credentials yet. Pass Socratic Quests and Coding Labs to earn credentials.
                          </div>
                        );
                      }
                      return items.map(s => (
                        <div key={s.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</span>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, background: 'rgba(var(--success-rgb),  0.15)', color: 'var(--success)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                              {'score' in s ? `${Math.round(s.score)} Pts` : `Level ${s.level}`}
                            </span>
                            <span style={{ fontSize: 11, background: 'var(--accent-light)', padding: '3px 8px', borderRadius: 6, color: 'var(--accent)', fontWeight: 800 }}>{s.level}</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

            {activePassportTab === 'Verified Skills' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Verified Credentials Directory (SHA-256 Sealed)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {skillProfile?.verified && skillProfile.verified.length > 0 ? (
                    skillProfile.verified.map(s => (
                      <div key={s.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 800 }}>{s.name}</span>
                          <span style={{ fontSize: 11, background: 'rgba(var(--success-rgb),  0.15)', color: 'var(--success)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>{s.level} Verified ✓</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                          <strong>Evaluation Score:</strong> {Math.round(s.score)}/100 &middot; <strong>Credential ID:</strong> <code style={{ fontSize: 10, color: 'var(--accent)' }}>{s.credentialId}</code>
                        </p>
                        <div style={{ fontSize: 11, color: 'var(--t3)' }}>Verified: <strong>{new Date(s.verifiedAt).toLocaleDateString()}</strong></div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5, background: 'var(--bg3)', borderRadius: 12 }}>
                      No verified skills yet. Complete your P1-P5 projects and pass the oral defense gate to earn verified credentials!
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePassportTab === 'Demonstrated Skills' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Demonstrated Practical Targets</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {skillProfile?.demonstrated && skillProfile.demonstrated.length > 0 ? (
                    skillProfile.demonstrated.map(s => (
                      <div key={s.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</span>
                          <span style={{ fontSize: 11.5, color: 'var(--info)', fontWeight: 700 }}>{Math.round(s.score)} Pts Demonstrated</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                          <div style={{ width: `${Math.min(100, s.score)}%`, height: '100%', background: 'var(--info)' }} />
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t3)' }}>Target: Complete production project & defense to verify.</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5, background: 'var(--bg3)', borderRadius: 12 }}>
                      No demonstrated skills yet. Complete daily coding missions to generate practical evidence!
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePassportTab === 'Claimed Skills' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Claimed Baseline Skills</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {(skillProfile?.claimed || []).map(s => (
                    <div key={s.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 12, borderRadius: 10 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)' }}>{s.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--t3)', textTransform: 'capitalize', marginTop: 2 }}>{s.category || 'General'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePassportTab === 'Assessment History' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>AI Audit Transcripts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {assessmentHistory.length > 0 ? (
                    assessmentHistory.map((h, i) => (
                      <div key={i} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{h.type}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>Demonstrated {h.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)' }}>{h.score} Score</div>
                          <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>{h.result}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5, background: 'var(--bg3)', borderRadius: 12 }}>
                      No AI audit transcripts recorded yet. Complete coding quests, oral defenses, or AI mock interviews to generate audit records.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePassportTab === 'Verification Levels' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Skill Credential Hierarchy</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { lvl: 1, title: 'Quest Approved', desc: 'Syntax and basic algorithm constructs verified via automated Next.js IDE test runs.' },
                    { lvl: 2, title: 'Faculty Endorsed', desc: 'Mentorship and code audit approval completed by academic institution staff.' },
                    { lvl: 3, title: 'Industry Verified', desc: 'Practical deployment experience verified during company internships or client projects.' }
                  ].map(h => (
                    <div key={h.lvl} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--accent)', marginBottom: 4 }}>Level {h.lvl} — {h.title}</div>
                      <p style={{ fontSize: 12, color: 'var(--t2)', margin: 0, lineHeight: 1.5 }}>{h.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activePassportRole === 'recruiter' && (
        <div style={CS.card}>
          <div style={CS.cardLabel}>Candidate Skill Passport Dossier</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {passportSkills.length > 0 ? (
              passportSkills.map(s => (
                <div key={s.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 13.5 }}>{s.name}</h4>
                    <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>{s.evidence}</p>
                  </div>
                  <span style={{ fontSize: 11, background: s.verified ? 'var(--green-light)' : 'var(--border)', color: s.verified ? 'var(--green)' : 'var(--t3)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                    {s.verified ? `Level ${s.level} Verified` : 'Pending Validation'}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: 18, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5, background: 'var(--bg3)', borderRadius: 10 }}>
                No skill passport records yet. Demonstrated competencies will appear here once verified.
              </div>
            )}
          </div>
        </div>
      )}

      {activePassportRole === 'faculty' && (
        <div style={CS.card}>
          <div style={CS.cardLabel}>Skill Endorsement Panel</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {passportSkills.length > 0 ? (
              passportSkills.map(s => (
                <div key={s.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 14, borderRadius: 12 }}>
                  <div>
                    <strong style={{ fontSize: 13.5 }}>{s.name} (Level {s.level})</strong>
                    <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>{s.evidence}</div>
                  </div>
                  <button onClick={() => toggleEndorsement(s.id)} style={{ padding: '6px 12px', fontSize: 10.5, fontWeight: 800, background: s.verified ? 'var(--coral)' : 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                    {s.verified ? 'Revoke Endorse' : 'Endorse Skill'}
                  </button>
                </div>
              ))
            ) : (
              <div style={{ padding: 18, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5, background: 'var(--bg3)', borderRadius: 10 }}>
                No skills submitted for faculty endorsement yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
