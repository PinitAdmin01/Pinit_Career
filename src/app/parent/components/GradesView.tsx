'use client';

import React from 'react';
import { StudentOverview } from '../hooks/useParentDashboard';

interface GradesViewProps {
  activeTab: string;
  overview: StudentOverview;
}

export default function GradesView({ activeTab }: GradesViewProps) {
  if (activeTab === 'academic') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
            📈 Academic Performance & Semester Progress
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Visual trackers of exam performance, subject grades, and concept comprehension trends.
          </p>
        </div>

        {/* Semester Progress indicator */}
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t2)' }}>Current Semester Progress</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
              78% Complete
            </span>
          </div>
          <div style={{ width: '100%', height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: '78%', height: '100%', background: 'var(--success)' }} />
          </div>
        </div>

        {/* Performance Bar Charts Graph */}
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
          <h4 style={{ margin: '0 0 14px 0', fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>📊 Subject Score Graph</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name: 'Database Systems', val: 100, color: 'var(--success)' },
              { name: 'Mathematics', val: 80, color: 'var(--success)' },
              { name: 'Programming Foundations', val: 60, color: 'var(--amber)' },
              { name: 'Computer Networking', val: 40, color: 'var(--danger)' },
            ].map((g, idx) => (
              <div
                key={idx}
                style={{ display: 'grid', gridTemplateColumns: '1.5fr 2.5fr 0.5fr', alignItems: 'center', gap: 12 }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t2)' }}>{g.name}</span>
                <div style={{ width: '100%', height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${g.val}%`, height: '100%', background: g.color }} />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: g.color,
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {g.val}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects & Marks breakdown */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div
            style={{
              background: 'var(--bg3)',
              padding: '10px 14px',
              fontSize: 11.5,
              fontWeight: 800,
              color: 'var(--t3)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            SUBJECT DETAILS & ASSIGNMENT RETURNS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              {
                name: 'Database Systems',
                internals: '24 / 25',
                assignments: '10 / 10',
                attend: '100%',
                exam: 'Project review (Aug 02)',
              },
              {
                name: 'Mathematics',
                internals: '21 / 25',
                assignments: '9 / 10',
                attend: '96%',
                exam: 'Midterm exam (July 25)',
              },
              {
                name: 'Programming Foundations',
                internals: '16 / 25',
                assignments: '6 / 10',
                attend: '90%',
                exam: 'Lab Check (July 28)',
              },
              {
                name: 'Computer Networking',
                internals: '11 / 25',
                assignments: '4 / 10',
                attend: '76%',
                exam: 'Theory Quiz (July 30)',
              },
            ].map((sub, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr',
                  padding: '12px 14px',
                  borderBottom: idx < 3 ? '1px solid var(--border)' : 'none',
                  fontSize: 12.5,
                }}
              >
                <strong style={{ color: 'var(--t1)' }}>{sub.name}</strong>
                <span>Int: {sub.internals}</span>
                <span>Assig: {sub.assignments}</span>
                <span>Att: {sub.attend}</span>
                <span style={{ color: 'var(--t3)', textAlign: 'right' }}>📅 {sub.exam}</span>
              </div>
            ))}
          </div>
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
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--success)', marginBottom: 8 }}>
              🚀 Improving Subjects
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--t2)' }}>
              <div>• <strong>Mathematics</strong>: +12% improvement this month</div>
              <div>• <strong>Database Systems</strong>: Consistent high test scores</div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(var(--danger-rgb), 0.03)',
              border: '1px solid rgba(var(--danger-rgb), 0.15)',
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--danger)', marginBottom: 8 }}>
              ⚠️ Weak Subjects (Revision Gaps)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--t2)' }}>
              <div>• <strong>Computer Networking</strong>: Needs urgent notes audit</div>
              <div>• <strong>Programming Foundations</strong>: Focus on mock labs</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'career') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
            💼 Employability & Career Milestones
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Visual indicators mapping real-world hiring benchmarks, helping you track your child's placement ready status.
          </p>
        </div>

        {/* Career DNA Matching */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
              Target Career Profile
            </span>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>
              🤖 AI Software Engineer
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4 }}>
              Strengths: Algorithm logic, backend routing systems. Gaps identified in technical presentation deliveries.
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
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
              Employability Rating
            </span>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: 'var(--success)',
                fontFamily: 'var(--font-mono)',
                marginTop: 4,
              }}
            >
              74%
            </div>
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>Meets standard recruitment benchmarks.</span>
          </div>
        </div>

        {/* Employability Factor Progress bars */}
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>
            📋 Corporate Hiring Pillars
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Coding Test Score', val: 91, color: 'var(--success)', desc: 'Excellent compiler pass rate' },
              { label: 'Verified Certificates', val: 75, color: 'var(--accent)', desc: '3 credentials issued' },
              { label: 'Projects Showcase', val: 72, color: 'var(--accent)', desc: '3 active repos, 72% complete' },
              { label: 'Resume ATS Score', val: 68, color: 'var(--amber)', desc: '68/100 (needs layout tweaks)' },
              { label: 'Interview Readiness', val: 61, color: 'var(--amber)', desc: 'Needs behavioral mock prep' },
              { label: 'Communication Index', val: 53, color: 'var(--danger)', desc: 'Speech and pitching gaps' },
              { label: 'Portfolio Completeness', val: 44, color: 'var(--danger)', desc: '44% (missing live hosted links)' },
              { label: 'Internships Applied', val: 30, color: 'var(--t3)', desc: 'Applied to 3, 2 pending review' },
            ].map((f, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                  <span style={{ color: 'var(--t2)' }}>{f.label}</span>
                  <span style={{ color: f.color, fontWeight: 800 }}>{f.val}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${f.val}%`, height: '100%', background: f.color }} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
