'use client';

import React from 'react';

interface ConsultantStudentIntelligenceViewProps {
  allStudents: any[];
  selectedIntelStudent: any;
  setSelectedIntelStudent: (stud: any) => void;
  activeTab: string;
  selectedGoal: string;
  setSelectedGoal: (goal: string) => void;
}

export default function ConsultantStudentIntelligenceView({
  allStudents,
  selectedIntelStudent,
  setSelectedIntelStudent,
  activeTab,
  selectedGoal,
  setSelectedGoal,
}: ConsultantStudentIntelligenceViewProps) {
  if (activeTab === 'career_planning') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>💼 AI Career & Path Planner</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Shift candidate mapping conversations from simple country choice to strategic goal-driven pathways.
          </p>
        </div>

        {/* Goal Selector */}
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
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Goal Target:</span>
          <select
            value={selectedGoal}
            onChange={e => setSelectedGoal(e.target.value)}
            className="form-input"
            style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 250 }}
          >
            <option value="AI Engineer">AI Engineer</option>
            <option value="Cloud Architect">Cloud Infrastructure Architect</option>
            <option value="Distributed Systems Dev">Distributed Systems Dev</option>
          </select>
        </div>

        {/* Flowchart path matching */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, alignItems: 'stretch' }}>
          {[
            {
              step: '1. GOAL',
              val: selectedGoal,
              bg: 'rgba(var(--brand-rgb), 0.06)',
              border: 'rgba(var(--brand-rgb), 0.2)',
            },
            {
              step: '2. CAREER TARGET',
              val:
                selectedGoal === 'AI Engineer'
                  ? 'ML Ops Engineer / AI Software Dev'
                  : selectedGoal === 'Cloud Architect'
                  ? 'Cloud Solutions Architect'
                  : 'Backend Infra Architect',
              bg: 'rgba(var(--accent-teal-rgb), 0.06)',
              border: 'rgba(var(--accent-teal-rgb), 0.2)',
            },
            {
              step: '3. REQUIRED SKILLS',
              val:
                selectedGoal === 'AI Engineer'
                  ? 'PyTorch, Python, MLOps, Calculus'
                  : selectedGoal === 'Cloud Architect'
                  ? 'AWS, Kubernetes, Terraform'
                  : 'Go, C++, Distributed Consensus',
              bg: 'rgba(var(--warning-rgb), 0.06)',
              border: 'rgba(var(--warning-rgb), 0.2)',
            },
            {
              step: '4. BEST COUNTRIES',
              val:
                selectedGoal === 'AI Engineer'
                  ? 'Canada, Germany, USA, Singapore'
                  : selectedGoal === 'Cloud Architect'
                  ? 'USA, UK, Australia'
                  : 'Germany, Singapore, Netherlands',
              bg: 'rgba(var(--success-rgb), 0.06)',
              border: 'rgba(var(--success-rgb), 0.2)',
            },
            {
              step: '5. TARGET UNIVERSITIES',
              val:
                selectedGoal === 'AI Engineer'
                  ? 'TU Munich, Stanford, NUS, Univ of Toronto'
                  : selectedGoal === 'Cloud Architect'
                  ? 'MIT, UC Berkeley, UCL London'
                  : 'TU Delft, NUS Singapore, ETH Zurich',
              bg: 'rgba(var(--brand-rgb), 0.06)',
              border: 'rgba(var(--brand-rgb), 0.2)',
            },
            {
              step: '6. KEY ADVANTAGES',
              val:
                selectedGoal === 'AI Engineer'
                  ? 'Strong AI Labs, Low Tuition, Good Visa, High Placement'
                  : selectedGoal === 'Cloud Architect'
                  ? 'AWS Headquarter access, Tech Hub, Premium Salaries'
                  : 'Industry R&D Centers, Visa Sponsorship, High starting CTC',
              bg: 'rgba(var(--accent-teal-rgb), 0.06)',
              border: 'rgba(var(--accent-teal-rgb), 0.2)',
            },
          ].map((node, i) => (
            <div
              key={i}
              style={{
                background: node.bg,
                border: `1px solid ${node.border}`,
                borderRadius: 12,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 9.5, fontWeight: 900, color: 'var(--t3)', letterSpacing: '0.5px' }}>{node.step}</span>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.45 }}>{node.val}</div>
            </div>
          ))}
        </div>

        {/* List of matching candidate goals mapped */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginTop: 10 }}>
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
            ACTIVE MAPPINGS BY COHORT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)' }}>
            {allStudents.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5 }}>No pipeline data</div>
            ) : (
              allStudents.map((raw: any, idx: number) => {
                const mapItem = {
                  name: raw.displayName || raw.name || 'Candidate',
                  goal: raw.career_track || raw.programType || '—',
                  progress: raw.ats_score != null ? `${raw.ats_score}% ATS` : 'No ATS yet',
                };
                return (
                  <div
                    key={raw.id || idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderBottom: idx < allStudents.length - 1 ? '1px solid var(--border)' : 'none',
                      fontSize: 12.5,
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--t1)' }}>{mapItem.name}</strong>
                      <span style={{ fontSize: 11, color: 'var(--t3)', marginLeft: 8 }}>Targeting: {mapItem.goal}</span>
                    </div>
                    <span style={{ color: 'var(--success)', fontWeight: 800 }}>{mapItem.progress}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fade-in">
      <div>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
          🔍 Candidate Employability & Academic Intelligence
        </h3>
        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
          Comprehensive review of student transcripts, tests, and international placement indicators.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left Column: Candidate List */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
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
            COHORT REGISTRY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)' }}>
            {allStudents.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5 }}>No pipeline data</div>
            ) : (
              allStudents.map((raw: any, idx: number) => {
                const stud = {
                  name: raw.displayName || raw.name || 'Candidate',
                  ats: raw.ats_score ?? '—',
                  coding: raw.trust_score ?? '—',
                  comm: raw.email || '—',
                  placement: raw.ats_score != null ? `${raw.ats_score}%` : '—',
                  dna: raw.career_track ? `🤖 ${raw.career_track}` : '—',
                  research: '—',
                  projects: `${(raw.vaultItems || []).length} vault items`,
                  ielts: '—',
                  gre: '—',
                  cgpa: '—',
                  scholarship: '—',
                  probability: '—',
                };
                return (
                  <div
                    key={raw.id || idx}
                    onClick={() => setSelectedIntelStudent(stud)}
                    style={{
                      padding: 14,
                      borderBottom: idx < allStudents.length - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer',
                      background: selectedIntelStudent?.name === stud.name ? 'rgba(var(--brand-rgb), 0.06)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong
                        style={{
                          color: selectedIntelStudent?.name === stud.name ? 'var(--accent)' : 'var(--t1)',
                          fontSize: 13.5,
                        }}
                      >
                        {stud.name}
                      </strong>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)' }}>{stud.placement} Ready</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                      ATS: {stud.ats}/100 | Trust: {stud.coding}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Candidate Intelligence Dashboard */}
        {selectedIntelStudent && (
          <div
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
            className="fade-in"
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                paddingBottom: 14,
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>{selectedIntelStudent.name}</h4>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--accent)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginTop: 2,
                    display: 'inline-block',
                  }}
                >
                  {selectedIntelStudent.dna}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>Career Readiness</span>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--success)' }}>{selectedIntelStudent.placement}</div>
              </div>
            </div>

            {/* Core Parameters Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Resume ATS Score
                </span>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', marginTop: 4 }}>
                  {selectedIntelStudent.ats} / 100
                </div>
              </div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Coding Pass Rate
                </span>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>
                  {selectedIntelStudent.coding}%
                </div>
              </div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Communication
                </span>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    color: selectedIntelStudent.comm.includes('Needs') ? 'var(--danger)' : 'var(--t1)',
                    marginTop: 6,
                  }}
                >
                  {selectedIntelStudent.comm}
                </div>
              </div>
            </div>

            {/* Core Parameters Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Research Publications
                </span>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>
                  {selectedIntelStudent.research}
                </div>
              </div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Projects Built
                </span>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>
                  {selectedIntelStudent.projects}
                </div>
              </div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Academic CGPA
                </span>
                <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--accent)', marginTop: 4 }}>
                  {selectedIntelStudent.cgpa}
                </div>
              </div>
            </div>

            {/* Tests & Admission Probability */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                borderTop: '1px solid var(--border)',
                paddingTop: 14,
              }}
            >
              <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: 8, padding: 8 }}>
                <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>IELTS Band</span>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>
                  {selectedIntelStudent.ielts}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: 8, padding: 8 }}>
                <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>GRE Score</span>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>
                  {selectedIntelStudent.gre}
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(var(--accent-teal-rgb), 0.03)',
                  borderRadius: 8,
                  padding: 8,
                  border: '1px solid rgba(var(--accent-teal-rgb), 0.1)',
                }}
              >
                <span style={{ fontSize: 9.5, color: 'var(--teal)' }}>Scholarship Match</span>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--teal)', marginTop: 2 }}>
                  {selectedIntelStudent.scholarship}
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(var(--brand-rgb), 0.03)',
                  borderRadius: 8,
                  padding: 8,
                  border: '1px solid rgba(var(--brand-rgb), 0.1)',
                }}
              >
                <span style={{ fontSize: 9.5, color: 'var(--accent)' }}>Admission Odds</span>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--accent)', marginTop: 2 }}>
                  {selectedIntelStudent.probability}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
