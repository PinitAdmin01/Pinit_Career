'use client';

import React from 'react';
import type { JdMatchResult } from '@/lib/interview/jdMatch';

export interface InterviewSetupViewProps {
  activeSessionDraft: any;
  resumeActiveSession: () => void;
  discardActiveSession: () => void;
  formatStageLabel: (stage: any) => string;
  interviewMode: 'roadmap' | 'custom' | 'jd';
  setInterviewMode: (mode: 'roadmap' | 'custom' | 'jd') => void;
  domainStream: 'tech' | 'non_tech';
  setDomainStream: (stream: 'tech' | 'non_tech') => void;
  domainSubTopic: string;
  setDomainSubTopic: (topic: string) => void;
  customTopicInput: string;
  setCustomTopicInput: (val: string) => void;
  jdInput?: string;
  setJdInput?: (val: string) => void;
  jdMatchResult?: JdMatchResult | null;
  difficulty: 'easy' | 'normal' | 'hard';
  setDifficulty: (diff: 'easy' | 'normal' | 'hard') => void;
  isAssistModeActive?: boolean;
  setIsAssistModeActive?: (val: boolean) => void;
  startInterview: () => void;
  sessions: any[];
  clearSessionHistory: () => void;
  setSelectedHistorySession: (s: any) => void;
}

export const InterviewSetupView: React.FC<InterviewSetupViewProps> = ({
  activeSessionDraft,
  resumeActiveSession,
  discardActiveSession,
  formatStageLabel,
  interviewMode,
  setInterviewMode,
  domainStream,
  setDomainStream,
  domainSubTopic,
  setDomainSubTopic,
  customTopicInput,
  setCustomTopicInput,
  jdInput = '',
  setJdInput,
  jdMatchResult,
  difficulty,
  setDifficulty,
  isAssistModeActive = false,
  setIsAssistModeActive,
  startInterview,
  sessions,
  clearSessionHistory,
  setSelectedHistorySession,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
      <div className="iv-panel" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 8px', color: 'var(--t1)' }}>Start AI Corporate Interview</h2>
        <p style={{ fontSize: 14.5, color: 'var(--t2)', lineHeight: 1.6, margin: '0 0 20px' }}>
          Practice real-time corporate interviews with spoken voice communication, Monaco code sandbox, interactive architecture canvas, and automated role-weighted scoring.
        </p>

        {/* Recoverable Active Session Banner (Survives Browser Refresh) */}
        {activeSessionDraft && (
          <div style={{
            marginBottom: 20,
            padding: '14px 16px',
            borderRadius: 12,
            background: 'rgba(var(--brand-rgb), 0.08)',
            border: '1.5px solid var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>⚠️</span> In-Progress Session Recovered
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', marginTop: 2 }}>
                Topic: <strong>{activeSessionDraft.activeTopicName}</strong> • {formatStageLabel(activeSessionDraft.activeStage)} • {Math.floor(activeSessionDraft.elapsedSeconds / 60)}m {activeSessionDraft.elapsedSeconds % 60}s elapsed
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={resumeActiveSession}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--text)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Resume ➔
              </button>
              <button
                onClick={discardActiveSession}
                style={{
                  background: 'transparent',
                  color: 'var(--t3)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Mode Selection */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 8 }}>SELECT INTERVIEW MODE</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setInterviewMode('roadmap')}
              data-testid="mode-roadmap"
              style={{ flex: 1, padding: '10px 10px', borderRadius: 10, border: interviewMode === 'roadmap' ? '2px solid var(--accent)' : '1px solid var(--border)', background: interviewMode === 'roadmap' ? 'var(--accent-light)' : 'var(--bg3)', color: interviewMode === 'roadmap' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}
            >
              🎯 1. Roadmap Track
            </button>
            <button
              onClick={() => setInterviewMode('custom')}
              data-testid="mode-custom"
              style={{ flex: 1, padding: '10px 10px', borderRadius: 10, border: interviewMode === 'custom' ? '2px solid var(--accent)' : '1px solid var(--border)', background: interviewMode === 'custom' ? 'var(--accent-light)' : 'var(--bg3)', color: interviewMode === 'custom' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}
            >
              ✏️ 2. Custom Topic / Viva
            </button>
            <button
              onClick={() => setInterviewMode('jd')}
              data-testid="mode-jd"
              style={{ flex: 1, padding: '10px 10px', borderRadius: 10, border: interviewMode === 'jd' ? '2px solid var(--accent)' : '1px solid var(--border)', background: interviewMode === 'jd' ? 'var(--accent-light)' : 'var(--bg3)', color: interviewMode === 'jd' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}
            >
              📋 3. Match Job Description (JD)
            </button>
          </div>
        </div>

        {interviewMode === 'roadmap' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>DOMAIN STREAM</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { setDomainStream('tech'); setDomainSubTopic('software'); }}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, border: domainStream === 'tech' ? '2px solid var(--accent)' : '1px solid var(--border)', background: domainStream === 'tech' ? 'var(--accent-light)' : 'var(--bg3)', color: domainStream === 'tech' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
                >
                  💻 Tech Stream
                </button>
                <button
                  onClick={() => { setDomainStream('non_tech'); setDomainSubTopic('finance'); }}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, border: domainStream === 'non_tech' ? '2px solid var(--pink)' : '1px solid var(--border)', background: domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--bg3)', color: domainStream === 'non_tech' ? 'var(--pink)' : 'var(--t1)', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
                >
                  📊 Non-Tech Stream
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>SUB-TOPIC &amp; SPECIALIZATION</label>
              <select
                value={domainSubTopic}
                onChange={(e) => setDomainSubTopic(e.target.value)}
                className="iv-select"
                style={{ width: '100%', padding: '10px 12px', fontSize: 14, fontWeight: 700 }}
              >
                {(domainStream === 'tech' ? [
                  { value: 'software', label: 'Software Engineering (SDE)' },
                  { value: 'ai_ml', label: 'AI, Machine Learning & LLM Systems' },
                  { value: 'systems', label: 'Cloud & Distributed Systems' },
                  { value: 'embedded', label: 'Embedded Systems & IoT Engineering' },
                  { value: 'cyber', label: 'Cybersecurity & Secure Systems' },
                  { value: 'quant', label: 'Quantitative Systems & Algorithmic Trading' },
                  { value: 'data', label: 'Data Science & Analytics' }
                ] : [
                  { value: 'finance', label: 'Finance & Accounting (B.Com)' },
                  { value: 'marketing', label: 'Digital Marketing & Growth' },
                  { value: 'bba', label: 'Business Strategy & Product' },
                  { value: 'hr', label: 'HR & Talent Management' },
                  { value: 'operations', label: 'Supply Chain & Operations' }
                ]).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        ) : interviewMode === 'custom' ? (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>ENTER CUSTOM TOPIC OR CAPSTONE PROJECT</label>
            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              placeholder="e.g. Distributed Caching & Kafka, React State Performance, DCF Valuation..."
              className="iv-input"
              style={{ width: '100%', padding: '10px 14px', fontSize: 14 }}
            />
          </div>
        ) : (
          <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>
                PASTE TARGET JOB DESCRIPTION (REAL-TIME SKILL MATCHER)
              </label>
              <textarea
                value={jdInput}
                onChange={(e) => setJdInput && setJdInput(e.target.value)}
                placeholder="Paste the full job posting here (e.g. from LinkedIn, Google, Startup)... Required skills, tech stack, and responsibilities will be parsed automatically against your profile."
                rows={5}
                className="iv-input"
                data-testid="jd-matcher-textarea"
                style={{ width: '100%', padding: '10px 14px', fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* JD Analysis Card */}
            {jdMatchResult && jdMatchResult.analyzable ? (
              <div style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🎯</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>
                      JD Match Score: <span style={{ color: jdMatchResult.match_score >= 70 ? 'var(--green-mid)' : 'var(--accent)' }}>{jdMatchResult.match_score}%</span>
                    </span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: jdMatchResult.verdict === 'strong' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: jdMatchResult.verdict === 'strong' ? 'var(--green-mid)' : '#f59e0b',
                      textTransform: 'uppercase'
                    }}>
                      {jdMatchResult.verdict}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--t2)' }}>
                    Est. Prep: <strong>{jdMatchResult.estimated_preparation_weeks} wks</strong>
                  </span>
                </div>

                {jdMatchResult.matched_skills.length > 0 && (
                  <div>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--green-mid)', display: 'block', marginBottom: 4 }}>
                      ✅ VERIFIED MATCHES ({jdMatchResult.matched_skills.length})
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {jdMatchResult.matched_skills.map((s) => (
                        <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.12)', color: 'var(--green-mid)', fontWeight: 700 }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {jdMatchResult.missing_skills.length > 0 && (
                  <div>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: '#f59e0b', display: 'block', marginBottom: 4 }}>
                      ⚠️ PROBING GAPS ({jdMatchResult.missing_skills.length})
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {jdMatchResult.missing_skills.map((s) => (
                        <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', fontWeight: 700 }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4 }}>
                  💡 The AI panel will tailor questions to probe your identified skill gaps while assessing depth in your core strengths.
                </div>
              </div>
            ) : jdInput.trim().length > 0 ? (
              <div style={{ fontSize: 12, color: 'var(--t3)', padding: '8px 10px', background: 'var(--bg3)', borderRadius: 8 }}>
                ℹ️ Scanning for recognized technical skills and architectural keywords...
              </div>
            ) : null}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>DIFFICULTY LEVEL</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['easy', 'normal', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                aria-label={`Difficulty: ${d}`}
                data-testid={`difficulty-${d}`}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: difficulty === d ? '2px solid var(--accent)' : '1px solid var(--border)', background: difficulty === d ? 'var(--accent-light)' : 'var(--bg3)', color: difficulty === d ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12.5, textTransform: 'capitalize', cursor: 'pointer' }}
              >
                {d}
              </button>
            ))}
          </div>
          <div data-testid="difficulty-hint" style={{ marginTop: 6, fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4 }}>
            {difficulty === 'easy'
              ? '🟢 Warm-up mode — shorter rounds, gentler follow-ups, ideal for first-timers building confidence.'
              : difficulty === 'normal'
              ? '🟡 Standard corporate difficulty — balanced rubric scoring with realistic hiring-panel pressure.'
              : '🔴 Senior-level rigor — aggressive follow-ups, strict boundary evaluation, top-percentile expectation.'}
          </div>
        </div>

        {/* Assist Mode (AI Teleprompter) Toggle Button */}
        <div
          onClick={() => setIsAssistModeActive && setIsAssistModeActive(!isAssistModeActive)}
          style={{
            marginBottom: 20,
            padding: '12px 14px',
            borderRadius: 12,
            border: isAssistModeActive ? '1.5px solid var(--reward)' : '1px solid var(--border)',
            background: isAssistModeActive ? 'rgba(var(--reward-rgb), 0.08)' : 'var(--bg3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15.5 }}>🎯</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: isAssistModeActive ? 'var(--reward)' : 'var(--t1)' }}>
                Assist Mode (AI Spoken Teleprompter)
              </span>
              <span style={{
                fontSize: 10.5,
                padding: '2px 7px',
                borderRadius: 6,
                background: isAssistModeActive ? 'var(--reward)' : 'var(--border)',
                color: isAssistModeActive ? '#000' : 'var(--t3)',
                fontWeight: 800
              }}>
                {isAssistModeActive ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--t3)', lineHeight: 1.3 }}>
              Provides a real-time spoken answer script below chat to read aloud. The avatar interviewer cannot see your script!
            </p>
          </div>
          <button
            type="button"
            aria-label="Toggle Assist Mode"
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              background: isAssistModeActive ? 'var(--reward)' : 'var(--border)',
              position: 'relative',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s'
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 3,
                left: isAssistModeActive ? 23 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
            />
          </button>
        </div>

        <button
          onClick={startInterview}
          style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15.5, fontWeight: 900, color: 'var(--text)', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
        >
          🎙️ Start Proactive Voice Interview ➔
        </button>
      </div>

      {/* Persistent History Section */}
      <div className="iv-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 15.5, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>Past Session History ({sessions.length})</h3>
          {sessions.length > 0 && (
            <button onClick={clearSessionHistory} style={{ background: 'none', border: 'none', color: 'var(--coral-mid)', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
              Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 380, paddingRight: 4 }} className="scroll-container">
          {sessions.map(s => (
            <div key={s.id} style={{ background: 'var(--bg3)', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 6, background: s.domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--accent-light)', color: s.domainStream === 'non_tech' ? 'var(--pink)' : 'var(--accent)', fontWeight: 800 }}>
                    {s.domainStream === 'non_tech' ? 'Non-Tech' : 'Tech'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>{s.type}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 900, color: s.score >= 70 ? 'var(--green-mid)' : 'var(--coral-mid)' }}>{s.score}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--t2)' }}>
                <span>📅 {s.date}</span>
                <span style={{ color: s.verdict?.includes('Hire') ? 'var(--green-mid)' : 'var(--coral-mid)', fontWeight: 800 }}>Verdict: {s.verdict}</span>
              </div>

              <button
                onClick={() => setSelectedHistorySession(s)}
                style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 800, cursor: 'pointer', textAlign: 'center', marginTop: 2 }}
              >
                📄 Review Transcript & Report ➔
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default InterviewSetupView;
