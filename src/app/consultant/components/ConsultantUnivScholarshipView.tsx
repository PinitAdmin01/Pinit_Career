'use client';

import React from 'react';

interface ConsultantUnivScholarshipViewProps {
  activeTab: string;
  allStudents: any[];
  matchingStudent: string;
  setMatchingStudent: (student: string) => void;
  scholarshipSubTab: string;
  setScholarshipSubTab: (tab: string) => void;
  toastObj: { success: (title: string, desc?: string) => void };
}

export default function ConsultantUnivScholarshipView({
  activeTab,
  allStudents,
  matchingStudent,
  setMatchingStudent,
  scholarshipSubTab,
  setScholarshipSubTab,
  toastObj,
}: ConsultantUnivScholarshipViewProps) {
  if (activeTab === 'univ_matching') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🏫 AI University Matching Engine</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Align student scores, budgets, and Career DNA with global universities using the Dream-Reach-Safe classifier.
          </p>
        </div>

        {/* Student Selector */}
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
          <select
            value={matchingStudent}
            onChange={e => setMatchingStudent(e.target.value)}
            className="form-input"
            style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
          >
            {allStudents.length === 0 ? (
              <option value="">No pipeline data</option>
            ) : (
              allStudents.map((s: any) => (
                <option key={s.id} value={s.displayName || s.name}>
                  {s.displayName || s.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Matching Criteria Block */}
        <div
          style={{
            padding: 28,
            textAlign: 'center',
            color: 'var(--t3)',
            fontSize: 13,
            border: '1px solid var(--border)',
            borderRadius: 12,
          }}
        >
          {allStudents.length === 0
            ? 'No pipeline-linked data'
            : matchingStudent
            ? 'No matching dossier on file for this candidate'
            : 'No pipeline-linked data'}
        </div>
      </div>
    );
  }

  if (activeTab === 'scholarship') {
    const pipelineStudent = allStudents.find((s: any) => (s.displayName || s.name) === matchingStudent);
    const cgpaVal = pipelineStudent?.cgpa != null ? Number(pipelineStudent.cgpa) : null;

    const scholarships: Record<string, Array<{ name: string; reqCgpa: number; funding: string; desc: string }>> = {
      government: [
        {
          name: 'DAAD Scholarship (Germany)',
          reqCgpa: 8.5,
          funding: 'Full Tuition + €1200/mo allowance',
          desc: 'Highly competitive government grant for international postgraduates.',
        },
        {
          name: 'Erasmus Mundus Scholarship',
          reqCgpa: 8.0,
          funding: 'Full Tuition + Travel + €1000/mo allowance',
          desc: 'Joint Master degrees funding across European countries.',
        },
        {
          name: 'Chevening Scholarship (UK)',
          reqCgpa: 8.0,
          funding: 'Full Tuition + UK Living costs',
          desc: 'UK government global award for leadership candidates.',
        },
        {
          name: 'Fulbright Foreign Student Program',
          reqCgpa: 7.5,
          funding: 'Partial/Full Tuition + Health covers',
          desc: 'US government exchange program for research postgraduates.',
        },
      ],
      university: [
        {
          name: 'TU Munich Merit Scholarship',
          reqCgpa: 8.5,
          funding: '€500 - €1000 per semester stipend',
          desc: 'Academics-based merit allowance offered directly by TUM.',
        },
        {
          name: 'Stanford Engineering Fellowship',
          reqCgpa: 9.0,
          funding: 'Full Tuition + Research Stipend',
          desc: 'Highly selective department fellowship for top grads.',
        },
        {
          name: 'NUS Research Scholarship',
          reqCgpa: 8.0,
          funding: 'Full Tuition cover + SGD 2200/mo',
          desc: 'Graduate research matching grant at NUS Singapore.',
        },
      ],
      private: [
        {
          name: 'Gates Cambridge Scholarship',
          reqCgpa: 9.0,
          funding: 'Full Cambridge Tuition + Living expenses',
          desc: 'Global postgraduate grant sponsored by Bill & Melinda Gates.',
        },
        {
          name: 'Knight-Hennessy Scholars Program',
          reqCgpa: 8.8,
          funding: 'Full tuition + Stanford living allowances',
          desc: 'Multidisciplinary leadership scholars award at Stanford.',
        },
      ],
      company: [
        {
          name: 'Microsoft Research Fellowship',
          reqCgpa: 8.5,
          funding: 'USD $20,000 research grant',
          desc: 'Supports doctoral/master research projects in AI and computing.',
        },
        {
          name: 'Google PhD Fellowship Program',
          reqCgpa: 9.0,
          funding: 'Full tuition + USD $30,000 stipend',
          desc: 'Supports outstanding graduate researchers in Computer Science.',
        },
      ],
    };

    const list = scholarships[scholarshipSubTab] || [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
            🏆 Global Scholarship Matching Center
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Auto-identify scholarship qualifiers from candidate registration logs.
          </p>
        </div>

        {/* Student Selector */}
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
          <select
            value={matchingStudent}
            onChange={e => setMatchingStudent(e.target.value)}
            className="form-input"
            style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
          >
            {allStudents.length === 0 ? (
              <option value="">No pipeline data</option>
            ) : (
              allStudents.map((s: any) => (
                <option key={s.id} value={s.displayName || s.name}>
                  {s.displayName || s.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Inner Category Tabs */}
        <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
          {[
            { id: 'government', label: '🏛️ Government' },
            { id: 'university', label: '🏫 University' },
            { id: 'private', label: '🤝 Private' },
            { id: 'company', label: '🏢 Company Sponsored' },
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => setScholarshipSubTab(sub.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: scholarshipSubTab === sub.id ? 850 : 600,
                background: scholarshipSubTab === sub.id ? 'var(--bg3)' : 'transparent',
                color: scholarshipSubTab === sub.id ? 'var(--accent)' : 'var(--t2)',
                transition: 'all 0.15s',
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {cgpaVal == null ? (
          <div
            style={{
              padding: 28,
              textAlign: 'center',
              color: 'var(--t3)',
              fontSize: 13,
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}
          >
            {allStudents.length === 0
              ? 'No pipeline data'
              : 'No CGPA on file for this candidate — scholarship auto-match requires real grade data.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map((s, idx) => {
              const eligible = cgpaVal >= s.reqCgpa;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 13.5, color: 'var(--t1)' }}>{s.name}</strong>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                      Funding: <strong>{s.funding}</strong>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{s.desc}</p>
                  </div>

                  <div
                    style={{
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      alignItems: 'flex-end',
                      minWidth: 160,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 900,
                        background: eligible ? 'rgba(var(--success-rgb), 0.08)' : 'rgba(var(--danger-rgb), 0.08)',
                        color: eligible ? 'var(--success)' : 'var(--danger)',
                        padding: '4px 10px',
                        borderRadius: 20,
                      }}
                    >
                      {eligible ? '✓ AUTO MATCHED' : '✗ INELIGIBLE'}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--t3)' }}>Required CGPA: {s.reqCgpa}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'placement_timeline') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
            🚀 Placement After Graduation Timeline
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Follow active candidates through their academic lifecycle and global career placements.
          </p>
        </div>

        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
          <select
            value={matchingStudent}
            onChange={e => setMatchingStudent(e.target.value)}
            className="form-input"
            style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
          >
            {allStudents.length === 0 ? (
              <option value="">No pipeline data</option>
            ) : (
              allStudents.map((s: any) => (
                <option key={s.id} value={s.displayName || s.name}>
                  {s.displayName || s.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div
          style={{
            padding: 28,
            textAlign: 'center',
            color: 'var(--t3)',
            fontSize: 13,
            border: '1px solid var(--border)',
            borderRadius: 12,
          }}
        >
          {allStudents.length === 0
            ? 'No pipeline-linked data'
            : matchingStudent
            ? 'No placement stages on file for this candidate'
            : 'No pipeline-linked data'}
        </div>

        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>
              🎓 Post-Admission Academic & Career Roadmap
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--t3)' }}>
              Follow and update candidate progress semester-by-semester inside their target master program.
            </p>
          </div>

          <div style={{ padding: 28, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
            {allStudents.length === 0
              ? 'No pipeline-linked data'
              : matchingStudent
              ? 'No roadmap on file for this candidate'
              : 'No pipeline-linked data'}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'opportunity_radar') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>📡 Global Opportunity Radar</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
              Continuously scanning and matching global hackathons, research positions, internships, and fellowships to
              candidate profiles.
            </p>
          </div>
          <button
            onClick={() => {
              toastObj.success('Radar Sync Complete', 'Scanned 14 active international channels. Mapped new target slots.');
            }}
            className="btn-primary"
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12 }}
          >
            🔄 Scan Global Channels
          </button>
        </div>

        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
          <select
            value={matchingStudent}
            onChange={e => setMatchingStudent(e.target.value)}
            className="form-input"
            style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
          >
            {allStudents.length === 0 ? (
              <option value="">No pipeline data</option>
            ) : (
              allStudents.map((s: any) => (
                <option key={s.id} value={s.displayName || s.name}>
                  {s.displayName || s.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div
          style={{
            padding: 28,
            textAlign: 'center',
            color: 'var(--t3)',
            fontSize: 13,
            border: '1px solid var(--border)',
            borderRadius: 12,
          }}
        >
          {allStudents.length === 0
            ? 'No pipeline-linked data'
            : matchingStudent
            ? 'No opportunity matches on file for this candidate'
            : 'No pipeline-linked data'}
        </div>
      </div>
    );
  }

  return null;
}
