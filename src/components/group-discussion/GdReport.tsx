'use client';

import { useState } from 'react';

interface GdReportProps {
  report: {
    score: number;
    verdict: string;
    gapsIdentified: string[];
    keyMoments: string[];
  };
  transcript: { sender: string; role: string; content: string; emoji: string }[];
  onRestart: () => void;
}

export default function GdReport({ report, transcript, onRestart }: GdReportProps) {
  const [activeTab, setActiveTab] = useState<'assessment' | 'transcript'>('assessment');

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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
          📊 Collaborative SDE Performance Report
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
                fontSize: 11.5,
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
                fontSize: 11.5,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              📜 Conversation Log
            </button>
          </div>

          <div style={{ background: 'rgba(20,184,166,0.1)', border: '1.5px solid var(--teal)', borderRadius: 12, padding: '8px 16px', color: 'var(--teal)', fontSize: 18, fontWeight: 900 }}>
            Score: {report.score}%
          </div>
        </div>
      </div>

      {activeTab === 'assessment' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="animate-fade-in">
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>Summary & Verdict</h3>
            <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
              {report.verdict}
            </p>

            <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginTop: 20, marginBottom: 10 }}>Key Panel Highlights</h3>
            <ul style={{ fontSize: 12.5, color: 'var(--t2)', paddingLeft: 18, margin: 0, lineHeight: 1.6 }}>
              {report.keyMoments.map((m, idx) => <li key={idx}>{m}</li>)}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>Target Gaps Identified</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.gapsIdentified.map((g, idx) => (
                <div key={idx} style={{ background: 'var(--bg3)', border: '1.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--t1)' }}>
                  🚨 {g}
                </div>
              ))}
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
            {transcript.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'SDE Candidate' ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', gap: 4, fontSize: 8.5, color: 'var(--t3)', marginBottom: 2 }}>
                  <span>{msg.emoji}</span>
                  <strong>{msg.sender}</strong>
                  <span>({msg.role})</span>
                </div>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: 11.5,
                  background: msg.role === 'SDE Candidate' ? 'var(--accent)' : 'var(--bg2)',
                  color: msg.role === 'SDE Candidate' ? 'white' : 'var(--t1)',
                  maxWidth: '85%',
                  wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onRestart}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: 12, fontWeight: 800, borderRadius: 10, border: 'none', cursor: 'pointer' }}
            >
              Restart New Discussion Loop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
