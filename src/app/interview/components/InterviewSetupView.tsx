'use client';

import React from 'react';

export interface InterviewSetupViewProps {
  activeSessionDraft: any;
  resumeActiveSession: () => void;
  discardActiveSession: () => void;
  formatStageLabel: (stage: any) => string;
  interviewMode: 'roadmap' | 'custom';
  setInterviewMode: (mode: 'roadmap' | 'custom') => void;
  domainStream: 'tech' | 'non_tech';
  setDomainStream: (stream: 'tech' | 'non_tech') => void;
  domainSubTopic: string;
  setDomainSubTopic: (topic: string) => void;
  customTopicInput: string;
  setCustomTopicInput: (val: string) => void;
  difficulty: 'easy' | 'normal' | 'hard';
  setDifficulty: (diff: 'easy' | 'normal' | 'hard') => void;
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
  difficulty,
  setDifficulty,
  startInterview,
  sessions,
  clearSessionHistory,
  setSelectedHistorySession,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
      <div className="iv-panel" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px', color: 'var(--t1)' }}>🎙️ Start AI Corporate Interview</h2>
        <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, margin: '0 0 20px' }}>
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
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>⚠️</span> In-Progress Session Recovered
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--t2)', marginTop: 2 }}>
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
                  fontSize: 12,
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
                  fontSize: 12,
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
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 8 }}>SELECT INTERVIEW MODE</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setInterviewMode('roadmap')}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: interviewMode === 'roadmap' ? '2px solid var(--accent)' : '1px solid var(--border)', background: interviewMode === 'roadmap' ? 'var(--accent-light)' : 'var(--bg3)', color: interviewMode === 'roadmap' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
            >
              🎯 1. Roadmap Track
            </button>
            <button
              onClick={() => setInterviewMode('custom')}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: interviewMode === 'custom' ? '2px solid var(--accent)' : '1px solid var(--border)', background: interviewMode === 'custom' ? 'var(--accent-light)' : 'var(--bg3)', color: interviewMode === 'custom' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
            >
              ✏️ 2. Custom Topic / Viva
            </button>
          </div>
        </div>

        {interviewMode === 'roadmap' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>DOMAIN STREAM</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { setDomainStream('tech'); setDomainSubTopic('software'); }}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, border: domainStream === 'tech' ? '2px solid var(--accent)' : '1px solid var(--border)', background: domainStream === 'tech' ? 'var(--accent-light)' : 'var(--bg3)', color: domainStream === 'tech' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                >
                  💻 Tech Stream
                </button>
                <button
                  onClick={() => { setDomainStream('non_tech'); setDomainSubTopic('finance'); }}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, border: domainStream === 'non_tech' ? '2px solid var(--pink)' : '1px solid var(--border)', background: domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--bg3)', color: domainStream === 'non_tech' ? 'var(--pink)' : 'var(--t1)', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                >
                  📊 Non-Tech Stream
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>SUB-TOPIC & SPECIALIZATION</label>
              <select
                value={domainSubTopic}
                onChange={(e) => setDomainSubTopic(e.target.value)}
                className="iv-select"
                style={{ width: '100%', padding: '10px 12px', fontSize: 12.5, fontWeight: 700 }}
              >
                {domainStream === 'tech' ? (
                  <>
                    <option value="software">Software Engineering (SDE)</option>
                    <option value="data">Data Science & Analytics</option>
                    <option value="systems">Cloud & Systems</option>
                  </>
                ) : (
                  <>
                    <option value="finance">Finance & Accounting (B.Com)</option>
                    <option value="marketing">Digital Marketing & Growth</option>
                    <option value="bba">Business Strategy & Product</option>
                    <option value="hr">HR & Talent Management</option>
                    <option value="operations">Supply Chain & Operations</option>
                  </>
                )}
              </select>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>ENTER CUSTOM TOPIC OR CAPSTONE PROJECT</label>
            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              placeholder="e.g. Distributed Caching & Kafka, React State Performance, DCF Valuation..."
              className="iv-input"
              style={{ width: '100%', padding: '10px 14px', fontSize: 12.5 }}
            />
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>DIFFICULTY LEVEL</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['easy', 'normal', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: difficulty === d ? '2px solid var(--accent)' : '1px solid var(--border)', background: difficulty === d ? 'var(--accent-light)' : 'var(--bg3)', color: difficulty === d ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 11.5, textTransform: 'capitalize', cursor: 'pointer' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startInterview}
          style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 900, color: 'var(--text)', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
        >
          🎙️ Start Proactive Voice Interview ➔
        </button>
      </div>

      {/* Persistent History Section */}
      <div className="iv-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>📜 Past Session History ({sessions.length})</h3>
          {sessions.length > 0 && (
            <button onClick={clearSessionHistory} style={{ background: 'none', border: 'none', color: 'var(--coral-mid)', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
              🗑️ Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 380, paddingRight: 4 }} className="scroll-container">
          {sessions.map(s => (
            <div key={s.id} style={{ background: 'var(--bg3)', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, background: s.domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--accent-light)', color: s.domainStream === 'non_tech' ? 'var(--pink)' : 'var(--accent)', fontWeight: 800 }}>
                    {s.domainStream === 'non_tech' ? 'Non-Tech' : 'Tech'}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>{s.type}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 900, color: s.score >= 70 ? 'var(--green-mid)' : 'var(--coral-mid)' }}>{s.score}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--t2)' }}>
                <span>📅 {s.date}</span>
                <span style={{ color: s.verdict?.includes('Hire') ? 'var(--green-mid)' : 'var(--coral-mid)', fontWeight: 800 }}>Verdict: {s.verdict}</span>
              </div>

              <button
                onClick={() => setSelectedHistorySession(s)}
                style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer', textAlign: 'center', marginTop: 2 }}
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
