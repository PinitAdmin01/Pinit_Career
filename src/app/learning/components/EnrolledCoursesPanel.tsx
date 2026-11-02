'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { card, cardLabel } from './constants';
import { HumanizedMistake } from '@/lib/learning/learningTwinIntelligence';

interface EnrolledCoursesPanelProps {
  activeRole: 'student' | 'faculty';
  mistakes: any[];
  clearMistake: (id: string) => void;
  studentsList: any[];
  prescribeQuest: (studentName: string) => void;
  missingSkills?: Array<{ name: string; rawName?: string; reason: string; severity: 'High' | 'Medium'; category?: string }>;
  humanizedMistakes?: HumanizedMistake[];
  resolveDrill?: (mistakeId: string, optionId: string) => Promise<{ success: boolean; xpEarned: number }>;
}

export function EnrolledCoursesPanel({
  activeRole,
  mistakes,
  clearMistake,
  studentsList,
  prescribeQuest,
  missingSkills = [],
  humanizedMistakes = [],
  resolveDrill,
}: EnrolledCoursesPanelProps) {
  // Selected options for each drill: { [mistakeId]: optionId }
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  // Feedback state for each drill: { [mistakeId]: { correct: boolean; message: string } }
  const [drillFeedback, setDrillFeedback] = useState<Record<string, { correct: boolean; message: string }>>({});
  // Active category filter: 'all' | category
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  // Expanded telemetry logs: { [mistakeId]: boolean }
  const [expandedTelemetry, setExpandedTelemetry] = useState<Record<string, boolean>>({});

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

  // Filter mistakes by category if selected
  const filteredMistakes = humanizedMistakes.filter(m => {
    if (categoryFilter === 'all') return true;
    return m.category.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  const handleSelectOption = (mistakeId: string, optId: string) => {
    setSelectedOptions(prev => ({ ...prev, [mistakeId]: optId }));
    // Clear feedback when user selects a different option
    if (drillFeedback[mistakeId]) {
      setDrillFeedback(prev => {
        const copy = { ...prev };
        delete copy[mistakeId];
        return copy;
      });
    }
  };

  const handleRunVerification = async (mistake: HumanizedMistake) => {
    const chosenOptId = selectedOptions[mistake.id];
    if (!chosenOptId) return;

    const opt = mistake.drill.options.find(o => o.id === chosenOptId);
    if (!opt) return;

    if (opt.isCorrect) {
      setDrillFeedback(prev => ({
        ...prev,
        [mistake.id]: { correct: true, message: `✓ Correct! ${opt.explanation}` }
      }));
      if (resolveDrill) {
        await resolveDrill(mistake.id, chosenOptId);
      }
    } else {
      setDrillFeedback(prev => ({
        ...prev,
        [mistake.id]: { correct: false, message: `✗ Incorrect: ${opt.explanation}` }
      }));
    }
  };

  const toggleTelemetry = (id: string) => {
    setExpandedTelemetry(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 20, alignItems: 'start' }}>
      {/* Left Column: Fused Learning Mistakes Tracker & Socratic Drills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={cardLabel}>⚠️ Fused Learning Mistakes Tracker</div>
            <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--coral-light)', color: 'var(--coral)', padding: '2px 8px', borderRadius: 8 }}>
              {filteredMistakes.length} Active Blind Spots
            </span>
          </div>

          {/* Educational Callout */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--accent-light)', border: '1px solid var(--accent)', padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 26.5 }}>💡</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--accent)', marginBottom: 4 }}>Why do we collect mistake data?</div>
              <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                Locating where and why you hit failure modes in Quests, Daily Missions, AI Interviews, and GD rooms helps our Socratic Engine compile targeted remedial modules. Fixing active blind spots is the fastest path to bridging your skill gaps.
              </p>
            </div>
          </div>

          {/* Category Quick Filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              { id: 'all', label: 'All Blind Spots' },
              { id: 'behavioral', label: 'Behavioral & Execution' },
              { id: 'system', label: 'System Architecture' },
              { id: 'communication', label: 'Interview & Inquiry' },
              { id: 'algorithms', label: 'Algorithms & Logic' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${categoryFilter === cat.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: categoryFilter === cat.id ? 'var(--accent)' : 'var(--bg3)',
                  color: categoryFilter === cat.id ? '#fff' : 'var(--t2)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mistakes & Remedial Drills List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredMistakes.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--t3)', fontSize: 14.5, border: '1px dashed var(--border)', borderRadius: 12, background: 'var(--bg3)' }}>
                ✓ No active mistakes detected in this category. Excellent work!
              </div>
            ) : (
              filteredMistakes.map((m, idx) => {
                const feedback = drillFeedback[m.id];
                const hasSelected = Boolean(selectedOptions[m.id]);
                const showTelemetry = expandedTelemetry[m.id];

                return (
                  <div
                    key={m.id || idx}
                    style={{
                      background: 'var(--bg3)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 14,
                      padding: 16,
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'border 0.2s'
                    }}
                  >
                    {/* Header: Badges & Title */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--coral-light)', color: 'var(--coral)', padding: '2px 8px', borderRadius: 4 }}>
                            {m.severity} Priority
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--bg2)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>
                            {m.category}
                          </span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>{m.title}</h4>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>#{idx + 1}</span>
                    </div>

                    {/* Socratic Root Cause */}
                    <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.5, margin: '6px 0 12px 0' }}>
                      <strong>Root Cause:</strong> {m.rootCause}
                    </p>

                    {/* Telemetry Toggle */}
                    {m.telemetrySnippet && (
                      <div style={{ marginBottom: 12 }}>
                        <button
                          onClick={() => toggleTelemetry(m.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent)',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          {showTelemetry ? '▼ Hide Failure Incident Log' : '▶ View Failure Incident Log & Stack Trace'}
                        </button>
                        {showTelemetry && (
                          <pre
                            style={{
                              marginTop: 6,
                              padding: 10,
                              background: 'var(--bg2)',
                              border: '1px solid var(--border)',
                              borderRadius: 8,
                              fontSize: 11.5,
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--coral)',
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.4
                            }}
                          >
                            {m.telemetrySnippet}
                          </pre>
                        )}
                      </div>
                    )}

                    {/* Socratic Drill Box */}
                    {m.drill && (
                      <div
                        style={{
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                          padding: 12,
                          marginBottom: 12
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            🎯 Socratic Remedial Drill (+{m.drill.successRewardXp || 25} XP)
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--t3)' }}>Select the optimal pattern:</span>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', margin: '0 0 8px 0' }}>
                          {m.drill.question}
                        </p>

                        {m.drill.codeSnippet && (
                          <pre
                            style={{
                              background: 'var(--bg3)',
                              padding: 8,
                              borderRadius: 6,
                              fontSize: 11.5,
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--t2)',
                              margin: '0 0 8px 0',
                              overflowX: 'auto'
                            }}
                          >
                            {m.drill.codeSnippet}
                          </pre>
                        )}

                        {/* Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {m.drill.options.map(opt => {
                            const isSelected = selectedOptions[m.id] === opt.id;
                            return (
                              <label
                                key={opt.id}
                                onClick={() => handleSelectOption(m.id, opt.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: 8,
                                  padding: '8px 10px',
                                  borderRadius: 8,
                                  background: isSelected ? 'var(--accent-light)' : 'var(--bg3)',
                                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                                  cursor: 'pointer',
                                  fontSize: 12.5,
                                  color: 'var(--t1)',
                                  lineHeight: 1.4,
                                  transition: 'all 0.15s'
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`drill_${m.id}`}
                                  checked={isSelected}
                                  onChange={() => handleSelectOption(m.id, opt.id)}
                                  style={{ marginTop: 2 }}
                                />
                                <span style={{ flex: 1 }}>{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Feedback message */}
                        {feedback && (
                          <div
                            style={{
                              marginTop: 8,
                              padding: '8px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              background: feedback.correct ? 'var(--green-light)' : 'var(--coral-light)',
                              color: feedback.correct ? 'var(--green)' : 'var(--coral)',
                              border: `1px solid ${feedback.correct ? 'var(--green)' : 'var(--coral)'}`
                            }}
                          >
                            {feedback.message}
                          </div>
                        )}

                        {/* Verification Button */}
                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleRunVerification(m)}
                            disabled={!hasSelected}
                            style={{
                              padding: '6px 14px',
                              fontSize: 12,
                              fontWeight: 800,
                              background: hasSelected ? 'var(--accent)' : 'var(--bg3)',
                              color: hasSelected ? '#fff' : 'var(--t3)',
                              border: 'none',
                              borderRadius: 6,
                              cursor: hasSelected ? 'pointer' : 'not-allowed',
                              transition: 'all 0.15s'
                            }}
                          >
                            Verify &amp; Resolve Blind Spot →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Actions */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
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
                          gap: 4
                        }}
                      >
                        ⚡ Practice in Sandbox
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
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Column: AI Fused Remedial Plan */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={card}>
          <div style={cardLabel}>🛡️ AI Fused Remedial Plan</div>
          <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
            Based on your accumulated performance errors, assessment records, and Socratic diagnostic results, the AI has compiled the following custom plan to guide your revision:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {humanizedMistakes.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 14, background: 'var(--bg3)', borderRadius: 10, border: '1px dashed var(--border)' }}>
                ✓ No active performance errors detected. Your curriculum benchmark is currently on track!
              </div>
            ) : (
              humanizedMistakes.map((step, idx) => (
                <div key={idx} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>
                      {idx + 1}. Strengthen {step.title}
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: 'var(--coral-light)', color: 'var(--coral)', padding: '2px 6px', borderRadius: 4 }}>
                      {step.severity} Priority
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--t3)', fontWeight: 600, marginBottom: 6 }}>
                    Category: {step.category}
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                    <strong>Actionable Plan:</strong> {step.actionablePlan}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>
                      +30 XP on resolution
                    </span>
                    <button
                      onClick={() => {
                        const target = document.querySelector(`input[name="drill_${step.id}"]`);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: 'var(--accent)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Solve Remedial Drill ➔
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Remediation Uplift Summary */}
          <div style={{ marginTop: 18, background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(16,185,129,0.06))', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>
              📈 Estimated Placement Uplift
            </div>
            <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>
              Resolving these active blind spots boosts your predicted technical interview pass rate by <strong>+18% to 24%</strong> and promotes your Digital Career Twin to Tier-1 product consideration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
