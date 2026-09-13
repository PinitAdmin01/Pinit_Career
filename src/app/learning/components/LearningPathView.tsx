'use client';

import React from 'react';
import { card, cardLabel } from './constants';
import { ROADMAP_STEPS, Simulation } from '../hooks/useLearningData';

interface LearningPathViewProps {
  activeTab: 'roadmap' | 'twin';
  roadmapSteps: typeof ROADMAP_STEPS;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (val: boolean) => void;
  teacher: { name: string; emoji: string };
  chatHistory: Array<{ sender: 'ai' | 'user'; text: string }>;
  simulating: boolean;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
  inputVal: string;
  setInputVal: (val: string) => void;
  handleSendAnswer: () => void;
  ONBOARDING_QUESTIONS: Array<{ id: string; q: string; placeholder: string }>;
  step: number;
  onboardingAnswers: any;
  twinData?: { simulation: Simulation };
  selectedTwinPath: number;
  setSelectedTwinPath: (idx: number) => void;
}

export function LearningPathView({
  activeTab,
  roadmapSteps,
  activeStep,
  setActiveStep,
  onboardingComplete,
  setOnboardingComplete,
  teacher,
  chatHistory,
  simulating,
  chatBottomRef,
  inputVal,
  setInputVal,
  handleSendAnswer,
  ONBOARDING_QUESTIONS,
  step,
  onboardingAnswers,
  twinData,
  selectedTwinPath,
  setSelectedTwinPath,
}: LearningPathViewProps) {
  if (activeTab === 'roadmap') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }}>
        <div style={card}>
          <div style={cardLabel}>Recommended Growth Roadmap Pathway</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
            {roadmapSteps.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={s.label}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    background: isActive ? 'var(--accent-light)' : 'var(--bg3)',
                    border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 12, padding: 12, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: isActive ? 'var(--accent)' : 'var(--bg2)',
                    color: isActive ? '#fff' : 'var(--t3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 900, border: '1px solid var(--border)', flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: 13, fontWeight: 800, color: isActive ? 'var(--accent)' : 'var(--t1)' }}>{s.label}</h4>
                    <div style={{ fontSize: 11.5, color: 'var(--t2)' }}>{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={card}>
          <div style={cardLabel}>Active Step Details</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 950 }}>{roadmapSteps[activeStep]?.label}</h3>
          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>{roadmapSteps[activeStep]?.desc}</p>
          <div style={{ background: 'var(--bg3)', padding: 16, borderRadius: 12, border: '1px solid var(--border)', fontSize: 13 }}>
            🎯 <strong>Remedial Recommendation</strong>: {roadmapSteps[activeStep]?.details}
          </div>
        </div>
      </div>
    );
  }

  // activeTab === 'twin'
  return (
    <div>
      {!onboardingComplete ? (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, display: 'flex', flexDirection: 'column', height: 440, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, var(--accent), var(--purple))', color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{teacher.emoji}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{teacher.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>AI Career Companion</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg)' }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'ai' ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                  background: msg.sender === 'ai' ? 'var(--card)' : 'var(--accent)',
                  color: msg.sender === 'ai' ? 'var(--t1)' : 'white',
                  border: msg.sender === 'ai' ? '1px solid var(--border)' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {simulating && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 12, fontSize: 12.5, color: 'var(--accent)' }}>
                  ⚡ Simulating digital twin trajectory...
                </div>
              </div>
            )}
            <div ref={chatBottomRef as any} />
          </div>

          <div style={{ padding: '12px 16px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendAnswer()}
              placeholder={ONBOARDING_QUESTIONS[step]?.placeholder || "Type your response..."}
              style={{ flex: 1, padding: '8px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--t1)', fontSize: 12.5 }}
            />
            <button onClick={handleSendAnswer} className="btn-primary" style={{ padding: '8px 18px', fontSize: 12 }}>Send →</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>Digital Career Twin Projections:</span>
            <button onClick={() => setOnboardingComplete(false)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 800, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--accent)', cursor: 'pointer' }}>Re-Simulate Twin</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.05), rgba(6,182,212,0.03))', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>🚀 Career OS Blueprint</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                {[
                  { label: 'Target Role', value: onboardingAnswers?.role || 'SDE-1 Developer', color: 'var(--t1)' },
                  { label: 'Expected Salary', value: twinData?.simulation?.paths?.[selectedTwinPath]?.salary_range || '₹18 - 25 LPA', color: 'var(--green)' },
                  { label: 'Current Level', value: 'Explorer Level 1', color: 'var(--accent)' },
                  { label: 'Time Required', value: twinData?.simulation?.paths?.[selectedTwinPath]?.timeline || '8 - 12 Months', color: 'var(--purple)' }
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg2)', padding: '12px', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={cardLabel}>📈 Simulated Trajectory Fit</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Startup Founder Fit', score: twinData?.simulation?.startup_founder_fit || 82, color: 'var(--coral)' },
                  { label: 'Corporate Readiness', score: twinData?.simulation?.paths?.[selectedTwinPath]?.fit_score || 71, color: 'var(--purple)' },
                  { label: 'Global Opportunities Prep', score: twinData?.simulation?.global_readiness || 65, color: 'var(--teal)' }
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ display: 'flex', fontSize: 11.5, color: 'var(--t2)', marginBottom: 3, justifyContent: 'space-between' }}>
                      <span>{f.label}</span>
                      <span style={{ fontWeight: 700, color: f.color }}>{f.score}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${f.score}%`, background: f.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 14, display: 'block' }}>🏆 Paths Simulation Directory</span>
            <div style={{ display: 'flex', gap: 10, margin: '10px 0', flexWrap: 'wrap' }}>
              {twinData?.simulation?.paths?.map((p, idx) => (
                <button key={idx} onClick={() => setSelectedTwinPath(idx)} style={{
                  flex: 1, minWidth: 200, padding: 16, borderRadius: 16, border: `1.5px solid ${selectedTwinPath === idx ? 'var(--accent)' : 'var(--border)'}`,
                  background: selectedTwinPath === idx ? 'rgba(79,70,229,0.06)' : 'var(--bg2)',
                  cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4, transition: 'all 0.15s'
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: selectedTwinPath === idx ? 'var(--accent)' : 'var(--t1)' }}>{p.name}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{p.probability}% Prob · {p.timeline}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', marginTop: 2 }}>{p.salary_range}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
