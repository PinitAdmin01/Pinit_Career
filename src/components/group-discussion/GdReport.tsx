'use client';

import { useState } from 'react';

interface GdReportProps {
  report: {
    score: number;
    verdict: string;
    gapsIdentified: string[];
    keyMoments: string[];
    evaluated?: boolean;
  };
  transcript: { sender: string; role: string; content: string; emoji: string }[];
  onRestart: () => void;
}

export default function GdReport({ report, transcript, onRestart }: GdReportProps) {
  const [activeTab, setActiveTab] = useState<'assessment' | 'transcript'>('assessment');
  const score = Number.isFinite(report.score) ? report.score : null;
  const evaluated = report.evaluated !== false && score !== null;
  const verdict = typeof report.verdict === 'string' && report.verdict.trim()
    ? report.verdict
    : 'No evaluation summary is available for this session.';
  const keyMoments = Array.isArray(report.keyMoments) ? report.keyMoments : [];
  const gapsIdentified = Array.isArray(report.gapsIdentified) ? report.gapsIdentified : [];
  const sessionTranscript = Array.isArray(transcript) ? transcript : [];

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 24,
      padding: 30,
      marginTop: 24,
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }} className="animate-fade-in">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }} className="gd-report-header">
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
          📊 Group Discussion Performance Report
        </h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Tab Selector */}
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
            <button
              onClick={() => setActiveTab('assessment')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'assessment' ? 'var(--accent)' : 'none',
                color: activeTab === 'assessment' ? 'white' : 'var(--t2)',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              📊 Performance
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'transcript' ? 'var(--accent)' : 'none',
                color: activeTab === 'transcript' ? 'white' : 'var(--t2)',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              📜 Conversation Log
            </button>
          </div>

          <div style={{
            background: evaluated ? 'rgba(20,184,166,0.1)' : 'rgba(239,68,68,0.1)',
            border: evaluated ? '1.5px solid var(--teal)' : '1.5px solid var(--red, #ef4444)',
            borderRadius: 12,
            padding: '8px 16px',
            color: evaluated ? 'var(--teal)' : 'var(--red, #ef4444)',
            fontSize: 20,
            fontWeight: 900
          }}>
            {evaluated ? `Score: ${score}%` : 'Evaluation Offline'}
          </div>
        </div>
      </div>

      {activeTab === 'assessment' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="animate-fade-in gd-report-assessment">
          <div>
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>Summary & Verdict</h3>
            <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.5 }}>
              {verdict}
            </p>

            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 20, marginBottom: 10 }}>Key Panel Highlights</h3>
            <ul style={{ fontSize: 14, color: 'var(--t2)', paddingLeft: 18, margin: 0, lineHeight: 1.6 }}>
              {keyMoments.length > 0
                ? keyMoments.map((m, idx) => <li key={idx}>{m}</li>)
                : <li>No key moments were recorded.</li>}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>Target Gaps Identified</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gapsIdentified.length > 0 ? gapsIdentified.map((g, idx) => (
                <div key={idx} style={{ background: 'var(--bg3)', border: '1.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--t1)' }}>
                  🚨 {g}
                </div>
              )) : <p style={{ margin: 0, color: 'var(--t3)', fontSize: 13 }}>No specific improvement areas were returned.</p>}
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button
                onClick={onRestart}
                className="btn-primary"
                style={{ flex: 1, padding: 12, justifyContent: 'center', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 800 }}
              >
                Restart New Discussion Loop
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
          <div style={{
            background: 'var(--bg3)',
            border: '1.5px solid var(--border)',
            borderRadius: 16,
            padding: 16,
            maxHeight: 340,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            {sessionTranscript.map((msg, idx) => {
              const isCandidate =
                msg.sender === 'You' ||
                msg.role === 'Participant' ||
                msg.role === 'Candidate' ||
                msg.role === 'SDE Candidate';
              return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isCandidate ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', gap: 4, fontSize: 9.5, color: 'var(--t3)', marginBottom: 2 }}>
                  <span>{msg.emoji}</span>
                  <strong>{msg.sender}</strong>
                  <span>({msg.role})</span>
                </div>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: 12.5,
                  background: isCandidate ? 'var(--accent)' : 'var(--bg2)',
                  color: isCandidate ? 'white' : 'var(--t1)',
                  maxWidth: '85%',
                  wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>
              </div>
              );
            })}
            {sessionTranscript.length === 0 && (
              <p style={{ margin: 0, color: 'var(--t3)', fontSize: 13 }}>No transcript was saved for this session.</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onRestart}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: 13, fontWeight: 800, borderRadius: 10, border: 'none', cursor: 'pointer' }}
            >
              Restart New Discussion Loop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
