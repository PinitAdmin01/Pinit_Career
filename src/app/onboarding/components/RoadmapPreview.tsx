// src/app/onboarding/components/RoadmapPreview.tsx
'use client';

import React from 'react';
import { CompleteDiagnosticProfile } from '@/lib/onboarding/diagnosticEngine';
import { QT2MindsetBreakdown } from '../types';

export interface RoadmapPreviewProps {
  studentType: string;
  targetGoal: string;
  accessReason: string;
  diagnosticProfile?: CompleteDiagnosticProfile | null;
  qt2Breakdown?: QT2MindsetBreakdown;
  selectedMentor: string;
  setSelectedMentor: (mentor: string) => void;
  onActivateCommandCenter: (studentType: string, targetGoal: string, accessReason: string, blendTitle: string) => void;
  syncing?: boolean;
  syncProgress?: number;
  syncStatus?: string;
  parserLogs?: string[];
  isUploadedFile?: boolean;
}

export default function RoadmapPreview({
  studentType,
  targetGoal,
  accessReason,
  diagnosticProfile,
  qt2Breakdown,
  selectedMentor,
  setSelectedMentor,
  onActivateCommandCenter,
  syncing = false,
  syncProgress = 0,
  syncStatus = '',
  parserLogs = [],
  isUploadedFile = false
}: RoadmapPreviewProps) {
  // If we have modern diagnosticProfile, use it; otherwise fallback to qt2Breakdown
  const bp = diagnosticProfile?.behaviorProfile;
  const tradeoffs = diagnosticProfile?.tradeoffs || [];
  const strategy = diagnosticProfile?.roadmapStrategy;
  const allocations = strategy?.allocations || {
    explorationPct: 25,
    executionPct: 40,
    communicationPct: 20,
    technicalGapPct: 15
  };

  const title = bp?.blendTitle || qt2Breakdown?.blendTitle || 'Career Decision Profile';
  const roleTitle = diagnosticProfile?.goal?.role?.replace(/_/g, ' ') || targetGoal || 'Software Engineer';
  const horizon = diagnosticProfile?.goal?.horizonMonths ? `${diagnosticProfile.goal.horizonMonths} Months Target` : '6 Months Target';

  const getBandBadge = (band?: string) => {
    switch (band) {
      case 'strong':
        return { label: 'STRONG EVIDENCE', bg: 'rgba(var(--brand-rgb), 0.2)', color: 'var(--brand-bright)', border: 'rgba(var(--brand-rgb), 0.4)' };
      case 'moderate':
        return { label: 'MODERATE', bg: 'rgba(var(--teal-rgb, 20, 184, 166), 0.15)', color: 'var(--teal)', border: 'rgba(var(--teal-rgb, 20, 184, 166), 0.3)' };
      default:
        return { label: 'DEVELOPING', bg: 'rgba(255,255,255,0.06)', color: 'var(--t3)', border: 'rgba(255,255,255,0.12)' };
    }
  };

  return (
    <>
      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
        {/* Top Badges */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(var(--brand-rgb), 0.15)', color: 'var(--brand-bright)', border: '1px solid rgba(var(--brand-rgb), 0.3)', padding: '3px 10px', borderRadius: 100, fontWeight: 800, textTransform: 'uppercase' }}>
              🎯 TARGET: {roleTitle.toUpperCase()}
            </span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(var(--teal-rgb, 20, 184, 166), 0.15)', color: 'var(--teal)', border: '1px solid rgba(var(--teal-rgb, 20, 184, 166), 0.3)', padding: '3px 10px', borderRadius: 100, fontWeight: 800, textTransform: 'uppercase' }}>
              ⏱ {horizon.toUpperCase()}
            </span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--t2)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 100, fontWeight: 700 }}>
              DECISION ENGINE CALIBRATED
            </span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginTop: 6, letterSpacing: '-0.6px' }}>
            {title}
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5, marginTop: 4 }}>
            {bp?.summaryDescription || qt2Breakdown?.blendDescription || 'Your diagnostic profile establishes behavioral operating modes, detected trade-offs, and dynamic roadmap allocations.'}
          </p>
        </div>

        {/* 4 Behavioral Dimensions (Independent Bands, Non-Pie) */}
        <div style={{ background: '#0b1120', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              🧬 Behavioral Operating Dimensions (Independent Calibration):
            </span>
            <span style={{ fontSize: 10, color: 'var(--t3)', fontStyle: 'italic' }}>
              Independent Evidence Bands (Not forced into 100% pie)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
            {[
              {
                key: 'PH',
                icon: '🧩',
                label: 'Analytical Structuring',
                legacyName: 'Pattern Hunter',
                metric: bp?.PH,
                legacyScore: qt2Breakdown?.patternHunter
              },
              {
                key: 'EX',
                icon: '🚀',
                label: 'Experimental Exploration',
                legacyName: 'Explorer',
                metric: bp?.EX,
                legacyScore: qt2Breakdown?.explorer
              },
              {
                key: 'ST',
                icon: '🛡️',
                label: 'Structured Execution',
                legacyName: 'Stabilizer',
                metric: bp?.ST,
                legacyScore: qt2Breakdown?.stabilizer
              },
              {
                key: 'SIQ',
                icon: '🤝',
                label: 'Perspective Coordination',
                legacyName: 'Social IQ',
                metric: bp?.SIQ,
                legacyScore: qt2Breakdown?.socialIQ
              }
            ].map(item => {
              const badge = getBandBadge(item.metric?.band);
              return (
                <div
                  key={item.key}
                  style={{
                    background: '#131c2e',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>
                        {item.icon} {item.legacyName}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>
                        {item.label}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 9.5,
                      fontFamily: 'var(--font-mono)',
                      background: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      borderRadius: 100,
                      padding: '2px 8px',
                      fontWeight: 800
                    }}>
                      {badge.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--t2)', marginTop: 4 }}>
                    <span>Evidence: <strong>{item.metric?.evidence ?? item.legacyScore ?? 0} pts</strong></span>
                    <span>Confidence: <strong>{item.metric?.confidence ? Math.round(item.metric.confidence * 100) : 80}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detected Bottleneck & Trade-Off Card */}
        {tradeoffs.length > 0 && (
          <div style={{
            background: 'rgba(var(--coral-rgb, 244, 63, 94), 0.08)',
            border: '1.5px solid rgba(var(--coral-rgb, 244, 63, 94), 0.3)',
            borderRadius: 16,
            padding: '14px 18px',
            marginBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--coral)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)' }}>
                PRIMARY IDENTIFIED BOTTLENECK & TRADE-OFF:
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.5, marginBottom: 8 }}>
              {tradeoffs[0].description}
            </p>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 12px', fontSize: 11.5, color: 'var(--t2)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--teal)', fontWeight: 800 }}>PINIT ROADMAP STRATEGY:</span>
              <span>{tradeoffs[0].roadmapRecommendation}</span>
            </div>

            {/* Secondary Identified Working Dynamics */}
            {tradeoffs.length > 1 && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed rgba(var(--coral-rgb, 244, 63, 94), 0.25)' }}>
                <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--t2)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Secondary Working Dynamic:
                </div>
                {tradeoffs.slice(1).map((sec, sIdx) => (
                  <div key={sec.type || sIdx} style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.5, marginBottom: 4 }}>
                    • <strong style={{ color: 'var(--t1)' }}>{sec.type.replace(/_/g, ' ')}:</strong> {sec.description}{' '}
                    <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>({sec.roadmapRecommendation})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Roadmap Strategy Allocations */}
        <div style={{ background: '#0b1120', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              📊 Roadmap Effort Allocation (Personalized Distribution):
            </span>
            <span style={{ fontSize: 10, color: 'var(--t3)' }}>
              Adapts module pacing, scope & checkpoints
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 8 }}>
            {[
              { label: '🚀 Exploration', pct: allocations.explorationPct, color: 'var(--accent)' },
              { label: '🛡️ Execution', pct: allocations.executionPct, color: 'var(--teal)' },
              { label: '🤝 Communication', pct: allocations.communicationPct, color: 'var(--brand-bright)' },
              { label: '🔧 Technical Gap', pct: allocations.technicalGapPct, color: 'var(--coral)' }
            ].map(bar => (
              <div key={bar.label} style={{ background: '#131c2e', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 2 }}>{bar.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: bar.color, fontFamily: 'var(--font-mono)' }}>{bar.pct}%</div>
              </div>
            ))}
          </div>

          {/* Allocation stacked progress bar */}
          <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: `${allocations.explorationPct}%`, background: 'var(--accent)' }} title={`Exploration: ${allocations.explorationPct}%`} />
            <div style={{ width: `${allocations.executionPct}%`, background: 'var(--teal)' }} title={`Execution: ${allocations.executionPct}%`} />
            <div style={{ width: `${allocations.communicationPct}%`, background: 'var(--brand-bright)' }} title={`Communication: ${allocations.communicationPct}%`} />
            <div style={{ width: `${allocations.technicalGapPct}%`, background: 'var(--coral)' }} title={`Technical Gap: ${allocations.technicalGapPct}%`} />
          </div>
        </div>

        {/* Mentor Selection Confirmation */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)' }}>
              Assigned AI Guidance Mentor
            </label>
            <span style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>✓ Calibrated with Profile</span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1.5px solid rgba(var(--brand-rgb), 0.35)',
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{selectedMentor === 'priya' ? '👩‍💼' : '👨‍💼'}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--brand-bright)' }}>
                  {selectedMentor === 'priya' ? 'Ms. Priya' : 'Mr. Anish'}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>
                  {selectedMentor === 'priya' ? 'Full-Stack Systems & Analytical Mentor' : 'Interactive UX & Frontend Engineer'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedMentor(selectedMentor === 'priya' ? 'anish' : 'priya')}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-muted)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Switch to {selectedMentor === 'priya' ? 'Mr. Anish' : 'Ms. Priya'}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={syncing}
          onClick={() => onActivateCommandCenter(studentType, targetGoal, accessReason, title)}
          style={{
            width: '100%',
            height: 44,
            background: syncing ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, var(--teal) 0%, var(--accent) 100%)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--card)',
            fontWeight: 800,
            cursor: syncing ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(var(--accent-teal-rgb, 20, 184, 166), 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s ease'
          }}
        >
          {syncing ? 'Synchronizing Trajectory OS...' : 'Activate Command Center & Launch Roadmap ➔'}
        </button>
      </div>

      {/* Syncing Overlay */}
      {syncing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3,5,8,0.95)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{ position: 'relative', width: 90, height: 90, marginBottom: 20 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(var(--brand-rgb),0.1)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid transparent', borderTopColor: 'var(--teal)', animation: 'spin 1.2s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 800, color: 'var(--teal)' }}>
              {syncProgress}%
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginBottom: 4 }}>
            {isUploadedFile ? 'Analyzing Credentials & Proof' : 'Orchestrating Trajectory OS'}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textAlign: 'center', marginBottom: 20 }}>
            {syncStatus}
          </p>

          {parserLogs.length > 0 && (
            <div style={{
              width: '90%',
              maxWidth: 480,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: 14,
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              color: 'var(--teal)',
              maxHeight: 120,
              overflowY: 'auto'
            }}>
              {parserLogs.map((log, i) => (
                <div key={i} style={{ marginBottom: 3, opacity: i === parserLogs.length - 1 ? 1 : 0.6 }}>
                  &gt; {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
