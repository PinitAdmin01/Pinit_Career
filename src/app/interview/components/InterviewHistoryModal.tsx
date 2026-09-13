'use client';

import React from 'react';
import { toast } from '@/lib/store/useAppStore';
import { InterviewSessionRecord } from '../interviewTypes';
import { RadarChart } from './RadarChart';

interface InterviewHistoryModalProps {
  selectedHistorySession: InterviewSessionRecord | null;
  onClose: () => void;
}

export const InterviewHistoryModal: React.FC<InterviewHistoryModalProps> = ({
  selectedHistorySession,
  onClose
}) => {
  if (!selectedHistorySession) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="iv-panel" style={{ width: '100%', maxWidth: 850, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
        
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: selectedHistorySession.domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--accent-light)', color: selectedHistorySession.domainStream === 'non_tech' ? 'var(--pink)' : 'var(--accent)', fontWeight: 800 }}>
                {selectedHistorySession.domainStream === 'non_tech' ? 'Non-Tech' : 'Tech'}
              </span>
              <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>{selectedHistorySession.type}</h2>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
              Session ID: {selectedHistorySession.id} • Date: {selectedHistorySession.date}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: '50%', width: 30, height: 30, fontSize: 13, cursor: 'pointer', fontWeight: 900 }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }} className="scroll-container">
          <div style={{ background: 'var(--bg3)', borderRadius: 14, padding: 16, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)' }}>RECORDED VERDICT</span>
              <div style={{ fontSize: 20, fontWeight: 900, color: selectedHistorySession.verdict?.includes('Hire') ? 'var(--green-mid)' : 'var(--coral-mid)', margin: '4px 0' }}>
                {selectedHistorySession.verdict} ({selectedHistorySession.score}%)
              </div>
              <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4, margin: 0 }}>{selectedHistorySession.summary}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RadarChart scores={selectedHistorySession.radar || { logic: 70, systems: 65, comms: 75, solving: 70, star: 70 }} size={150} />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 13, fontWeight: 900, marginBottom: 10, color: 'var(--accent-mid)' }}>💬 Full Conversation Transcript</h3>
            <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto' }} className="scroll-container">
              {selectedHistorySession.messages && selectedHistorySession.messages.length > 0 ? (
                selectedHistorySession.messages.map((m, idx) => (
                  <div key={idx} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ fontSize: 9.5, color: 'var(--t3)', marginBottom: 2, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                      {m.role === 'user' ? 'Candidate Response' : 'Interviewer'}
                    </div>
                    <div className={m.role === 'user' ? 'iv-chat-user' : 'iv-chat-assistant'} style={{ padding: '8px 12px', borderRadius: 12, fontSize: 11.5, lineHeight: 1.4 }}>
                      {m.content}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 11.5, color: 'var(--t3)', fontStyle: 'italic' }}>No detailed transcript recorded.</div>
              )}
            </div>
          </div>

          {selectedHistorySession.topology?.nodes && selectedHistorySession.topology.nodes.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <h3 style={{ fontSize: 13, fontWeight: 900, marginBottom: 8, color: 'var(--accent-mid)' }}>
                📐 Evaluated Architecture Topology ({selectedHistorySession.topology.nodes.length} Components)
              </h3>
              <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedHistorySession.topology.nodes.map((n: any, idx: number) => (
                  <span key={idx} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 700 }}>
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
              const lines = [
                `# Past Interview Defense: ${selectedHistorySession.type}`,
                `**Topic / Role:** ${selectedHistorySession.type}  `,
                `**Date:** ${selectedHistorySession.date}  `,
                `**Score:** ${selectedHistorySession.score}% | Verdict: ${selectedHistorySession.verdict}  `,
                `\n---\n`,
                `## Transcript\n`
              ];
              selectedHistorySession.messages?.forEach((m: any) => {
                lines.push(`**${m.role === 'user' ? 'Candidate' : 'Interviewer'}:**\n${m.content}\n`);
              });
              const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `History_${selectedHistorySession.id}.md`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success('History Exported', 'Downloaded past interview defense transcript.');
            }}
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: 8, padding: '7px 14px', fontSize: 11.5, fontWeight: 800, cursor: 'pointer' }}
          >
            📥 Export Past Transcript (.md)
          </button>
          <button
            onClick={onClose}
            style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '8px 18px', fontSize: 11.5, fontWeight: 900, cursor: 'pointer' }}
          >
            Close Review
          </button>
        </div>

      </div>
    </div>
  );
};
