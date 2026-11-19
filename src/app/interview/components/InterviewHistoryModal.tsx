'use client';

import React from 'react';
import { toast } from '@/lib/store/useAppStore';
import { InterviewSessionRecord, getVerdictTone } from '../interviewTypes';
import { RadarChart } from './RadarChart';

interface InterviewHistoryModalProps {
  selectedHistorySession: InterviewSessionRecord | null;
  onClose: () => void;
}

export function formatHistorySessionMarkdown(session: InterviewSessionRecord): string {
  const strengthsList = Array.isArray(session.strengths) ? session.strengths.filter(Boolean) : [];
  const improvementsText = typeof session.improvements === 'string'
    ? session.improvements.trim()
    : Array.isArray(session.improvements)
      ? (session.improvements as string[]).join('. ')
      : '';

  const lines = [
    `# Past Interview Defense: ${session.type}`,
    `**Topic / Role:** ${session.type}  `,
    `**Date:** ${session.date}  `,
    `**Difficulty:** ${(session.difficulty || 'normal').toUpperCase()}  `,
    `**Score:** ${session.score}% | Verdict: ${session.verdict}  `,
    ...(strengthsList.length > 0 ? [`\n## Demonstrated Strengths`, ...strengthsList.map(s => `- ${s}`)] : []),
    ...(improvementsText ? [`\n## Areas for Improvement`, improvementsText] : []),
    ...(session.telemetry ? [
      `\n## Delivery Diagnostics`,
      `- **Eye Contact:** ${typeof session.telemetry.eyeContact === 'number' ? `${session.telemetry.eyeContact}%` : 'Not Tracked'}`,
      `- **Speaking Pace:** ${typeof session.telemetry.wpm === 'number' ? `${session.telemetry.wpm} WPM` : 'Not Measured'}`,
      `- **Filler Words:** ${typeof session.telemetry.fillerWords === 'number' ? session.telemetry.fillerWords : 'Not Measured'}`,
      `- **Tab Pauses:** ${session.telemetry.tabSwitches ?? 0}`
    ] : []),
    `\n---\n`,
    `## Transcript\n`
  ];
  session.messages?.forEach((m: any) => {
    lines.push(`**${m.role === 'user' ? 'Candidate' : 'Interviewer'}:**\n${m.content}\n`);
  });
  return lines.join('\n');
}

export const InterviewHistoryModal: React.FC<InterviewHistoryModalProps> = ({
  selectedHistorySession,
  onClose
}) => {
  React.useEffect(() => {
    if (!selectedHistorySession || typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedHistorySession, onClose]);

  if (!selectedHistorySession) return null;

  const strengthsList = Array.isArray(selectedHistorySession.strengths)
    ? selectedHistorySession.strengths.filter(Boolean)
    : [];
  const improvementsText = typeof selectedHistorySession.improvements === 'string'
    ? selectedHistorySession.improvements.trim()
    : Array.isArray(selectedHistorySession.improvements)
      ? (selectedHistorySession.improvements as string[]).join('. ')
      : '';
  const hasTelemetry = Boolean(
    selectedHistorySession.telemetry &&
    (typeof selectedHistorySession.telemetry.eyeContact === 'number' ||
     typeof selectedHistorySession.telemetry.wpm === 'number' ||
     typeof selectedHistorySession.telemetry.fillerWords === 'number' ||
     typeof selectedHistorySession.telemetry.tabSwitches === 'number')
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div className="iv-panel" style={{ width: '100%', maxWidth: 850, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
        
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 6, background: selectedHistorySession.domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--accent-light)', color: selectedHistorySession.domainStream === 'non_tech' ? 'var(--pink)' : 'var(--accent)', fontWeight: 800 }}>
                {selectedHistorySession.domainStream === 'non_tech' ? 'Non-Tech' : 'Tech'}
              </span>
              {selectedHistorySession.difficulty && (
                <span data-testid="history-difficulty-badge" style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t2)', fontWeight: 800, textTransform: 'capitalize' }}>
                  ⚡ {selectedHistorySession.difficulty}
                </span>
              )}
              <h2 style={{ fontSize: 16.5, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>{selectedHistorySession.type}</h2>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>
              Session ID: {selectedHistorySession.id} • Date: {selectedHistorySession.date}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close session history modal"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: '50%', width: 30, height: 30, fontSize: 14.5, cursor: 'pointer', fontWeight: 900 }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }} className="scroll-container">
          <div className="iv-history-grid" style={{ background: 'var(--bg3)', borderRadius: 14, padding: 16, border: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t3)' }}>RECORDED VERDICT</span>
              {(() => {
                const tone = getVerdictTone(selectedHistorySession.verdict);
                const verdictColor = tone === 'positive' ? 'var(--green-mid)' : tone === 'conditional' ? 'var(--amber-mid)' : 'var(--coral-mid)';
                return (
                  <div style={{ fontSize: 22, fontWeight: 900, color: verdictColor, margin: '4px 0' }}>
                    {selectedHistorySession.verdict} ({selectedHistorySession.score}%)
                  </div>
                );
              })()}
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4, margin: 0 }}>{selectedHistorySession.summary}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RadarChart scores={selectedHistorySession.radar || { logic: 0, systems: 0, comms: 0, solving: 0, star: 0 }} size={160} />
            </div>
          </div>

          {(strengthsList.length > 0 || improvementsText) && (
            <div className={strengthsList.length > 0 && improvementsText ? 'iv-results-2col' : undefined} style={strengthsList.length > 0 && improvementsText ? undefined : { display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {strengthsList.length > 0 && (
                <div data-testid="history-strengths-card" style={{ background: 'var(--bg3)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--green-mid)', marginBottom: 6 }}>
                    🌟 Demonstrated Strengths
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>
                    {strengthsList.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}
              {improvementsText && (
                <div data-testid="history-improvements-card" style={{ background: 'var(--bg3)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--amber-mid)', marginBottom: 6 }}>
                    📈 Areas for Improvement
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>
                    {improvementsText}
                  </p>
                </div>
              )}
            </div>
          )}

          {hasTelemetry && (
            <div data-testid="history-telemetry-card" style={{ background: 'var(--bg3)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', fontSize: 12 }}>
              <span style={{ fontWeight: 800, color: 'var(--t1)' }}>📡 Delivery Diagnostics:</span>
              {typeof selectedHistorySession.telemetry?.eyeContact === 'number' && (
                <span style={{ color: 'var(--t2)' }}>👁️ Eye Contact: <strong>{selectedHistorySession.telemetry.eyeContact}%</strong></span>
              )}
              {typeof selectedHistorySession.telemetry?.wpm === 'number' && (
                <span style={{ color: 'var(--t2)' }}>🗣️ Pace: <strong>{selectedHistorySession.telemetry.wpm} WPM</strong></span>
              )}
              {typeof selectedHistorySession.telemetry?.fillerWords === 'number' && (
                <span style={{ color: 'var(--t2)' }}>🎯 Filler Words: <strong>{selectedHistorySession.telemetry.fillerWords}</strong></span>
              )}
              {typeof selectedHistorySession.telemetry?.tabSwitches === 'number' && (
                <span data-testid="history-tab-pauses" style={{ color: 'var(--t2)' }}>⏸️ Tab Pauses: <strong>{selectedHistorySession.telemetry.tabSwitches}</strong></span>
              )}
            </div>
          )}

          <div>
            <h3 style={{ fontSize: 14.5, fontWeight: 900, marginBottom: 10, color: 'var(--accent-mid)' }}>💬 Full Conversation Transcript</h3>
            <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto' }} className="scroll-container">
              {selectedHistorySession.messages && selectedHistorySession.messages.length > 0 ? (
                selectedHistorySession.messages.map((m, idx) => (
                  <div key={idx} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ fontSize: 10.5, color: 'var(--t3)', marginBottom: 2, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                      {m.role === 'user' ? 'Candidate Response' : 'Interviewer'}
                    </div>
                    <div className={m.role === 'user' ? 'iv-chat-user' : 'iv-chat-assistant'} style={{ padding: '8px 12px', borderRadius: 12, fontSize: 12.5, lineHeight: 1.4 }}>
                      {m.content}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 12.5, color: 'var(--t3)', fontStyle: 'italic' }}>No detailed transcript recorded.</div>
              )}
            </div>
          </div>

          {selectedHistorySession.topology?.nodes && selectedHistorySession.topology.nodes.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 900, marginBottom: 8, color: 'var(--accent-mid)' }}>
                📐 Evaluated Architecture Topology ({selectedHistorySession.topology.nodes.length} Components)
              </h3>
              <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedHistorySession.topology.nodes.map((n: any, idx: number) => (
                  <span key={idx} style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 700 }}>
                    {n.label || n.type || n.id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => {
              const md = formatHistorySessionMarkdown(selectedHistorySession);
              const blob = new Blob([md], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `History_${selectedHistorySession.id}.md`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success('History Exported', 'Downloaded past interview defense transcript.');
            }}
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: 8, padding: '7px 14px', fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}
          >
            📥 Export Past Transcript (.md)
          </button>
          <button
            onClick={onClose}
            className="iv-btn-primary"
            style={{ borderRadius: 8, padding: '8px 18px', fontSize: 12.5 }}
          >
            Close Review
          </button>
        </div>

      </div>
    </div>
  );
};
