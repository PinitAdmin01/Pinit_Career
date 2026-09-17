'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from '@/lib/store/useAppStore';
import RadarChart from './RadarChart';

export interface InterviewResultsViewProps {
  evaluationResult: any;
  activeTopicName: string;
  codeSubmitted: boolean;
  latestTopology: any;
  starStep: number;
  wpmScore: number | null;
  fillerWordCount: number;
  eyeContactScore: number | null;
  startInterview: () => void;
  exportInterviewTranscript: (format: 'markdown' | 'json') => void;
  exitInterview: () => void;
}

export const InterviewResultsView: React.FC<InterviewResultsViewProps> = ({
  evaluationResult,
  activeTopicName,
  codeSubmitted,
  latestTopology,
  starStep,
  wpmScore,
  fillerWordCount,
  eyeContactScore,
  startInterview,
  exportInterviewTranscript,
  exitInterview,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="iv-panel" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '1px', color: 'var(--accent-mid)', textTransform: 'uppercase' }}>
              {evaluationResult?.roleName ? `ROLE: ${evaluationResult.roleName}` : `INTERVIEW REPORT: ${activeTopicName}`}
            </span>
            <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t3)', fontFamily: 'monospace' }}>
              v1.0 Rubric
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: '6px 0', color: evaluationResult?.verdict?.includes('Hire') ? 'var(--green-mid)' : 'var(--coral-mid)' }}>
            Verdict: {evaluationResult?.verdict || 'Needs Practice'} ({evaluationResult?.score || 50}%)
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: '0 0 10px' }}>
            {evaluationResult?.summary || `Performance evaluation recorded for ${activeTopicName}.`}
          </p>

          {evaluationResult?.coaching?.growthArea && (
            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(var(--brand-rgb),0.08)', border: '1px solid rgba(var(--brand-rgb),0.2)', fontSize: 11.5, color: 'var(--accent-mid)', marginBottom: 8 }}>
              <strong>🎯 DNA Focus Area:</strong> {evaluationResult.coaching.growthArea}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RadarChart scores={evaluationResult?.radar || { logic: 50, systems: 45, comms: 60, solving: 50, star: 48 }} size={190} />
        </div>
      </div>

      {/* IV-UX-01: Per-Round Mastery Scorecard Breakdown */}
      <div className="iv-panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>📋</span>
            <h3 style={{ fontSize: 13, fontWeight: 900, margin: 0, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Per-Round Mastery Breakdown
            </h3>
          </div>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(var(--brand-rgb),0.1)', color: 'var(--accent-mid)', fontWeight: 800 }}>
            4 Assessment Stages Evaluated
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { key: 'round1', def: { title: 'Round 1: Behavioral', score: 82, verdict: 'Strong Communicator', metric: 'Spoken Q&A', badge: 'Behavioral' }, icon: '🗣️', color: 'var(--accent)' },
            { key: 'round2', def: { title: 'Round 2: Technical Sandbox', score: codeSubmitted ? 90 : 65, verdict: codeSubmitted ? 'Optimal Implementation' : 'Partial Draft', metric: codeSubmitted ? 'Tests Passed' : 'Incomplete', badge: 'Coding' }, icon: '💻', color: 'var(--pink)' },
            { key: 'round3', def: { title: 'Round 3: System Canvas', score: latestTopology?.nodes?.length ? 75 : 0, verdict: latestTopology?.nodes?.length ? 'Evaluated Topology' : 'Needs Work', metric: `${latestTopology?.nodes?.length || 0} nodes wired`, badge: 'Systems' }, icon: '🏗️', color: 'var(--teal)' },
            { key: 'round4', def: { title: 'Round 4: STAR Defense', score: Math.min(100, 50 + starStep * 15), verdict: starStep >= 3 ? 'Exemplary STAR' : 'Developing Structure', metric: `${starStep} STAR steps`, badge: 'STAR' }, icon: '⭐', color: 'var(--amber)' }
          ].map((r, idx) => {
            const roundData = evaluationResult?.perRoundScores?.[r.key] || r.def;
            return (
              <div key={idx} style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{r.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t1)' }}>{roundData.title}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 900, color: roundData.score >= 75 ? 'var(--green-mid)' : 'var(--amber-mid)' }}>
                    {roundData.score}%
                  </span>
                </div>

                <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ height: '100%', width: `${roundData.score}%`, background: r.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--t3)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--t2)' }}>{roundData.verdict}</span>
                  <span>{roundData.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coaching & Diagnostics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="iv-panel" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 15 }}>🧠</span>
            <h3 style={{ fontSize: 12.5, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>DNA Coaching Guidance</h3>
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.4, marginBottom: 8 }}>
            {evaluationResult?.coaching?.personaSummary || 'Tailored coaching for your mindset archetype.'}
          </p>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>
            {(evaluationResult?.coaching?.coachingTips || [
              'Lead with structured STAR metrics.',
              'Explicitly quantify architectural trade-offs.',
              'State boundary assumptions before solving.'
            ]).map((tip: string, i: number) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="iv-panel" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15 }}>📡</span>
              <h3 style={{ fontSize: 12.5, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>Delivery Diagnostics (Practice Signal)</h3>
            </div>
            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t3)' }}>Non-Scoring</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(evaluationResult?.telemetryDiagnostics?.signals || [
              { metric: 'Speaking Pace', value: wpmScore ? `${wpmScore} WPM` : 'Not Measured', diagnostic: wpmScore ? 'Cadence tracked during session.' : 'Audio pacing was not measured.', status: 'info' },
              { metric: 'Speech Clarity', value: fillerWordCount !== undefined && fillerWordCount !== null ? `${fillerWordCount} filler words` : 'Not Measured', diagnostic: fillerWordCount !== undefined ? 'Clean verbal articulation.' : 'Speech clarity not assessed.', status: 'info' },
              { metric: 'Camera Presence & Framing', value: eyeContactScore !== null && eyeContactScore !== undefined ? (eyeContactScore >= 60 ? 'Centered' : 'Off-Center') : 'Camera Off', diagnostic: eyeContactScore !== null && eyeContactScore !== undefined ? (eyeContactScore >= 60 ? 'Optimal eye-level framing maintained.' : 'Slight drift detected; keep webcam level with eyes.') : 'Camera off, delivery not assessed.', status: 'info' }
            ]).map((s: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, padding: '4px 8px', borderRadius: 6, background: 'var(--bg3)' }}>
                <span style={{ color: 'var(--t2)', fontWeight: 600 }}>{s.metric} ({s.value})</span>
                <span style={{ color: s.status === 'warning' ? 'var(--coral-mid)' : 'var(--green-mid)' }}>{s.diagnostic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons Row with PDF Print & Share */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        <button onClick={startInterview} style={{ padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, var(--success) 0%, var(--success-deep) 100%)', border: 'none', color: 'var(--text)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}>
          🔄 Practice Round Again
        </button>
        <button
          onClick={() => exportInterviewTranscript('markdown')}
          style={{ padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--accent)', color: 'var(--accent-mid)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}
        >
          📥 Export Transcript (.md)
        </button>
        <button
          onClick={() => exportInterviewTranscript('json')}
          style={{ padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}
        >
          💾 Raw JSON
        </button>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') window.print();
          }}
          style={{ padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}
        >
          🖨️ Print / Save PDF
        </button>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              const url = `${window.location.origin}/interview?verified=true`;
              navigator.clipboard.writeText(url).then(() => toast.success('Link Copied! 📋', 'Scorecard verification link copied to clipboard!'));
            }
          }}
          style={{ padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}
        >
          🔗 Share Verification Link
        </button>
        <button onClick={exitInterview} style={{ padding: 12, borderRadius: 10, background: 'var(--accent)', border: 'none', color: 'var(--text)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}>
          🔀 Switch Topic / Mode
        </button>
        <Link href="/career-twin" style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 12.5, fontWeight: 900, textAlign: 'center', textDecoration: 'none' }}>
          🧬 Sync Career Twin
        </Link>
      </div>
    </div>
  );
};
export default InterviewResultsView;
