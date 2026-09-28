'use client';

import React from 'react';
import Link from 'next/link';
import { card, cardLabel } from './constants';

interface EnrolledCoursesPanelProps {
  activeRole: 'student' | 'faculty';
  mistakes: any[];
  clearMistake: (id: string) => void;
  studentsList: any[];
  prescribeQuest: (studentName: string) => void;
  missingSkills?: Array<{ name: string; reason: string; severity: 'High' | 'Medium' }>;
}

export function EnrolledCoursesPanel({
  activeRole,
  mistakes,
  clearMistake,
  studentsList,
  prescribeQuest,
  missingSkills = [],
}: EnrolledCoursesPanelProps) {
  if (activeRole === 'faculty') {
    return (
      <div style={card}>
        <div style={cardLabel}>Students Requiring Learning Intervention</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--bg3)' }}>
              {['Student Name', 'Class Section', 'Identified Gaps', 'Roadmap Step', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--t3)', fontSize: 12, fontWeight: 700, borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentsList.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px', fontWeight: 800 }}>{student.displayName}</td>
                <td style={{ padding: '14px', color: 'var(--t2)' }}>{student.section || 'CS-3A'}</td>
                <td style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(Array.isArray(student.gaps) && student.gaps.length > 0 ? student.gaps : ['Algorithmic Logic']).map((s: string) => (
                      <span key={s} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'var(--coral-light)', color: 'var(--coral)' }}>{s}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '14px', fontWeight: 600, color: 'var(--accent)' }}>{student.roadmapStep || 'Recommended Quests'}</td>
                <td style={{ padding: '14px' }}>
                  <button
                    onClick={() => prescribeQuest(student.displayName)}
                    style={{ padding: '6px 12px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                  >
                    Prescribe Quest
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Dynamic remedial steps compiled from authentic mistakes and missing skills
  const dynamicSteps = [
    ...mistakes.map((m, idx) => ({
      title: `${idx + 1}. Resolve ${m.module || m.type || 'Knowledge Gap'}`,
      details: `Identified Error: "${m.description}". Review related lesson exercises and practice edge test cases.`,
    })),
    ...missingSkills.map((s, idx) => ({
      title: `${mistakes.length + idx + 1}. Strengthen ${s.name}`,
      details: `${s.severity} Priority Gap — ${s.reason}`,
    })),
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={card}>
          <div style={cardLabel}>⚠️ Fused Learning Mistakes Tracker</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--accent-light)', border: '1px solid var(--accent)', padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 26.5 }}>💡</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--accent)', marginBottom: 4 }}>Why do we collect mistake data?</div>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                Locating where and why you hit failure modes in Quests, Daily Missions, AI Interviews, and GD rooms helps our Socratic Engine compile targeted remedial modules. Fixing active blind spots is the fastest path to bridging your skill gaps.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mistakes.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--t3)', fontSize: 14.5, border: '1px dashed var(--border)', borderRadius: 12 }}>
                ✓ No active mistakes detected. Excellent work!
              </div>
            ) : (
              mistakes.map(m => (
                <div key={m.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 11.5, fontWeight: 800, background: 'var(--coral-light)', color: 'var(--coral)', padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>{m.type}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{m.module}</span>
                    </div>
                    <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{m.timestamp}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--t2)', margin: '0 0 12px 0', lineHeight: 1.5 }}>{m.description}</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Link
                      href="/practice"
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 800,
                        background: 'var(--accent)',
                        color: '#fff',
                        borderRadius: 6,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      Practice in Sandbox
                    </Link>
                    <button
                      onClick={() => clearMistake(m.id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        color: 'var(--t2)',
                        cursor: 'pointer',
                      }}
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={card}>
          <div style={cardLabel}>🛡️ AI Fused Remedial Plan</div>
          <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
            Based on your accumulated performance errors and assessment records, the AI has compiled the following custom plan to guide your revision:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dynamicSteps.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 14, background: 'var(--bg3)', borderRadius: 10, border: '1px dashed var(--border)' }}>
                ✓ No active performance errors detected. Your curriculum benchmark is currently on track!
              </div>
            ) : (
              dynamicSteps.map((step, idx) => (
                <div key={idx} style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{step.title}</div>
                  <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: 0 }}>{step.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
