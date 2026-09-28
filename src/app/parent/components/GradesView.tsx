'use client';

import React from 'react';
import { StudentOverview } from '../hooks/useParentDashboard';

interface GradesViewProps {
  activeTab: string;
  overview: StudentOverview;
}

export default function GradesView({ activeTab, overview }: GradesViewProps) {
  const exams = overview?.recentExams || [];
  const profile = overview?.profile || {};

  if (activeTab === 'academic') {
    const hasExams = exams.length > 0;
    const avgScore = hasExams
      ? Math.round(
          exams.reduce((sum, e) => {
            if (typeof e.score === 'number' && typeof e.totalMarks === 'number' && e.totalMarks > 0) {
              return sum + (e.score / e.totalMarks) * 100;
            }
            const parsed = parseInt(e.pct, 10);
            return sum + (isNaN(parsed) ? 0 : parsed);
          }, 0) / exams.length
        )
      : null;

    const strongExams = exams.filter(e => {
      const pct = typeof e.score === 'number' && typeof e.totalMarks === 'number' && e.totalMarks > 0
        ? (e.score / e.totalMarks) * 100
        : parseInt(e.pct, 10) || 0;
      return pct >= 75;
    });

    const weakExams = exams.filter(e => {
      const pct = typeof e.score === 'number' && typeof e.totalMarks === 'number' && e.totalMarks > 0
        ? (e.score / e.totalMarks) * 100
        : parseInt(e.pct, 10) || 0;
      return pct < 75;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 900, color: 'var(--t1)' }}>
            📈 Academic Performance & Semester Progress
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 12.5, color: 'var(--t3)' }}>
            Authoritative examination records, subject scores, and comprehension diagnostics synced from faculty records.
          </p>
        </div>

        {/* Semester Progress indicator */}
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--t2)' }}>Academic Assessment Average</span>
            <span style={{ fontSize: 14.5, fontWeight: 900, color: avgScore !== null && avgScore >= 70 ? 'var(--success)' : 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
              {avgScore !== null ? `${avgScore}% Average` : 'No Assessments Graded'}
            </span>
          </div>
          <div style={{ width: '100%', height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: `${avgScore !== null ? Math.min(100, Math.max(5, avgScore)) : 0}%`, height: '100%', background: avgScore !== null && avgScore >= 70 ? 'var(--success)' : 'var(--amber)' }} />
          </div>
        </div>

        {/* Performance Bar Charts Graph */}
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
          <h4 style={{ margin: '0 0 14px 0', fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>📊 Graded Assessments Overview</h4>
          {!hasExams ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--t3)', fontSize: 14.5 }}>
              No graded examinations recorded yet for this student. Assessment results will appear here once faculty submits grades.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {exams.map((ex, idx) => {
                const pctNum = typeof ex.score === 'number' && typeof ex.totalMarks === 'number' && ex.totalMarks > 0
                  ? Math.round((ex.score / ex.totalMarks) * 100)
                  : parseInt(ex.pct, 10) || 0;
                const barColor = pctNum >= 75 ? 'var(--success)' : pctNum >= 50 ? 'var(--amber)' : 'var(--danger-deep)';
                return (
                  <div
                    key={idx}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 0.5fr', alignItems: 'center', gap: 12 }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t2)' }}>{ex.exam_name}</span>
                    <div style={{ width: '100%', height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, Math.max(4, pctNum))}%`, height: '100%', background: barColor }} />
                    </div>
                    <span
                      style={{
                        fontSize: 14.5,
                        fontWeight: 900,
                        color: barColor,
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {pctNum}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Subjects & Marks breakdown */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div
            style={{
              background: 'var(--bg3)',
              padding: '10px 14px',
              fontSize: 12.5,
              fontWeight: 800,
              color: 'var(--t3)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            AUTHORITATIVE GRADEBOOK ENTRIES
          </div>
          {!hasExams ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 14.5 }}>
              No evaluations on file.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {exams.map((ex, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    padding: '12px 14px',
                    borderBottom: idx < exams.length - 1 ? '1px solid var(--border)' : 'none',
                    fontSize: 14,
                  }}
                >
                  <strong style={{ color: 'var(--t1)' }}>{ex.exam_name}</strong>
                  <span>Marks: {ex.score !== undefined && ex.totalMarks ? `${ex.score} / ${ex.totalMarks}` : ex.pct}</span>
                  <span style={{ color: 'var(--success)', fontWeight: 800, textAlign: 'right' }}>
                    {ex.pct}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diagnosis trends */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div
            style={{
              background: 'rgba(var(--success-deep-rgb), 0.03)',
              border: '1px solid rgba(var(--success-deep-rgb), 0.15)',
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--success)', marginBottom: 8 }}>
              🚀 Performing Subject Areas
            </div>
            {strongExams.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--t2)' }}>
                {strongExams.map((se, i) => (
                  <div key={i}>• <strong>{se.exam_name}</strong>: Passing with {se.pct} proficiency</div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--t3)' }}>Awaiting upcoming evaluations.</div>
            )}
          </div>

          <div
            style={{
              background: 'rgba(var(--warning-rgb), 0.03)',
              border: '1px solid rgba(var(--warning-rgb), 0.15)',
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--amber)', marginBottom: 8 }}>
              ⚠️ Revision Focus Areas
            </div>
            {weakExams.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--t2)' }}>
                {weakExams.map((we, i) => (
                  <div key={i}>• <strong>{we.exam_name}</strong>: Review concepts ({we.pct})</div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--t3)' }}>No subject areas flagged below proficiency threshold.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'career') {
    const careerTrack = profile.career_track || 'Software Engineer';
    const readiness = profile.career_readiness || (profile.ats_score > 0 ? Math.round((profile.ats_score + profile.trust_score) / 2) : 0);
    const dnaScore = profile.career_dna_score || 0;
    const atsScore = profile.ats_score || 0;
    const trustScore = profile.trust_score || 0;
    const streak = profile.mission_streak || 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 900, color: 'var(--t1)' }}>
            💼 Employability & Career Milestones
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 12.5, color: 'var(--t3)' }}>
            Visual indicators mapping real student progress against recruitment benchmarks.
          </p>
        </div>

        {/* Career DNA Matching */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
              Target Career Profile
            </span>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>
              🎯 {careerTrack}
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.4 }}>
              Active skill track mapped to student profile and verified campus assessments.
            </p>
          </div>

          <div
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
              Overall Readiness Index
            </span>
            <div
              style={{
                fontSize: 35,
                fontWeight: 900,
                color: readiness >= 70 ? 'var(--success)' : readiness >= 40 ? 'var(--amber)' : 'var(--t2)',
                fontFamily: 'var(--font-mono)',
                marginTop: 4,
              }}
            >
              {readiness}%
            </div>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>
              {readiness >= 70 ? 'Meets standard recruitment benchmarks.' : 'In active placement development.'}
            </span>
          </div>
        </div>

        {/* Employability Factor Progress bars */}
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>
            📋 Placement Readiness Pillars
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Technical DNA Pass Index', val: dnaScore, color: dnaScore >= 70 ? 'var(--success)' : 'var(--amber)', desc: 'Derived from coding assessments' },
              { label: 'Resume ATS Benchmark', val: atsScore, color: atsScore >= 70 ? 'var(--success)' : 'var(--amber)', desc: `${atsScore}/100 parsing readiness` },
              { label: 'Platform Trust Index', val: trustScore, color: trustScore >= 70 ? 'var(--accent)' : 'var(--amber)', desc: `${trustScore}/100 authentication integrity` },
              { label: 'Continuous Study Streak', val: Math.min(100, streak * 10), color: 'var(--amber)', desc: `${streak} consecutive active learning days` },
            ].map((f, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                  <span style={{ color: 'var(--t2)' }}>{f.label}</span>
                  <span style={{ color: f.color, fontWeight: 800 }}>{f.val}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.max(2, f.val))}%`, height: '100%', background: f.color }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
