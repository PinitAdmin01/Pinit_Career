'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from '@/lib/store/useAppStore';
import RadarChart from './RadarChart';
import { getVerdictTone, formatReadinessBadge } from '../interviewTypes';
import type { RoundReportDetail, RoundStatus } from '../interviewEvaluator';

export interface InterviewResultsViewProps {
  evaluationResult: any;
  isEvaluating?: boolean;
  activeTopicName: string;
  codeSubmitted: boolean;
  latestTopology: any;
  starStep: number;
  wpmScore: number | null;
  fillerWordCount: number;
  eyeContactScore: number | null;
  startInterview: () => void;
  exportInterviewTranscript: (format: 'markdown' | 'json' | 'pdf') => void;
  exitInterview: () => void;
}

type ReportTab = 'overview' | 'round1' | 'round2' | 'round3' | 'round4';

function getScoreColor(score: number, status?: RoundStatus): string {
  if (status === 'skipped' || status === 'not_attempted') return 'var(--t3)';
  if (score >= 75) return 'var(--green-mid)';
  if (score >= 50) return 'var(--amber-mid)';
  return 'var(--coral-mid)';
}

function getStatusPillStyle(status: RoundStatus): { label: string; bg: string; border: string; color: string } {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        bg: 'rgba(34, 197, 94, 0.14)',
        border: '1px solid rgba(34, 197, 94, 0.35)',
        color: 'var(--green-mid)',
      };
    case 'partial':
      return {
        label: 'Partial',
        bg: 'rgba(245, 158, 11, 0.14)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        color: 'var(--amber-mid)',
      };
    case 'skipped':
      return {
        label: 'Skipped',
        bg: 'rgba(148, 163, 184, 0.14)',
        border: '1px solid rgba(148, 163, 184, 0.32)',
        color: '#94a3b8',
      };
    default:
      return {
        label: 'Not Attempted',
        bg: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: 'var(--coral-mid)',
      };
  }
}

export const InterviewResultsView: React.FC<InterviewResultsViewProps> = ({
  evaluationResult,
  isEvaluating = false,
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
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');

  const overallScore = Number.isFinite(Number(evaluationResult?.score)) ? Number(evaluationResult.score) : 0;
  const verdictTone = getVerdictTone(evaluationResult?.verdict);
  const verdictColor =
    verdictTone === 'positive'
      ? 'var(--green-mid)'
      : verdictTone === 'conditional'
      ? 'var(--amber-mid)'
      : 'var(--coral-mid)';
  const readinessInfo = evaluationResult?.readiness ? formatReadinessBadge(evaluationResult.readiness) : null;

  // Build normalized round reports cleanly (reusable whether from deterministic or legacy saved sessions)
  const roundReports: RoundReportDetail[] = useMemo(() => {
    if (Array.isArray(evaluationResult?.roundReports) && evaluationResult.roundReports.length === 4) {
      return evaluationResult.roundReports;
    }

    const perRound = evaluationResult?.perRoundScores || {};
    const allQuestions = Array.isArray(evaluationResult?.questionBreakdown) ? evaluationResult.questionBreakdown : [];

    const mkStatus = (score: number, explicit?: RoundStatus): RoundStatus => {
      if (explicit) return explicit;
      if (score >= 60) return 'completed';
      if (score > 0) return 'partial';
      return 'not_attempted';
    };

    const r1Score = Number.isFinite(Number(perRound.round1?.score)) ? Number(perRound.round1.score) : 0;
    const r2Score = Number.isFinite(Number(perRound.round2?.score)) ? Number(perRound.round2.score) : (codeSubmitted ? 75 : 0);
    const r3Score = Number.isFinite(Number(perRound.round3?.score)) ? Number(perRound.round3.score) : (latestTopology?.nodes?.length ? 60 : 0);
    const r4Score = Number.isFinite(Number(perRound.round4?.score)) ? Number(perRound.round4.score) : Math.min(100, starStep * 25);

    return [
      {
        roundNumber: 1,
        key: 'round1',
        title: perRound.round1?.title || 'Round 1: Behavioral & Background',
        shortTitle: 'Background',
        badge: perRound.round1?.badge || 'Behavioral',
        status: mkStatus(r1Score, perRound.round1?.status),
        score: r1Score,
        verdict: perRound.round1?.verdict || (r1Score > 0 ? 'Evaluated' : 'Not Attempted'),
        metric: perRound.round1?.metric || 'Behavioral Q&A',
        whatHappened: r1Score > 0 ? `Behavioral responses evaluated at ${r1Score}%.` : 'No substantive responses were recorded in Round 1.',
        highlights: [],
        gaps: r1Score < 60 ? ['Share specific project examples with clear ownership and outcomes.'] : [],
        exchanges: allQuestions.filter((q: any) => !q.round || q.round === 1),
      },
      {
        roundNumber: 2,
        key: 'round2',
        title: perRound.round2?.title || 'Round 2: Applied Challenge',
        shortTitle: 'Challenge',
        badge: perRound.round2?.badge || 'Solving',
        status: mkStatus(r2Score, perRound.round2?.status),
        score: r2Score,
        verdict: perRound.round2?.verdict || (codeSubmitted ? 'Verified' : 'Not Submitted'),
        metric: perRound.round2?.metric || (codeSubmitted ? 'Solution verified' : 'No submission'),
        whatHappened: codeSubmitted ? 'Solution submitted and verified.' : 'No verified solution was submitted in Round 2.',
        highlights: [],
        gaps: !codeSubmitted ? ['Complete and verify the Round 2 challenge before advancing.'] : [],
        exchanges: allQuestions.filter((q: any) => q.round === 2),
      },
      {
        roundNumber: 3,
        key: 'round3',
        title: perRound.round3?.title || 'Round 3: Architecture & Strategy',
        shortTitle: 'Canvas',
        badge: perRound.round3?.badge || 'Systems',
        status: mkStatus(r3Score, perRound.round3?.status),
        score: r3Score,
        verdict: perRound.round3?.verdict || (latestTopology?.nodes?.length ? 'Evaluated' : 'Blank Canvas'),
        metric: perRound.round3?.metric || `${latestTopology?.nodes?.length || 0} nodes placed`,
        whatHappened: latestTopology?.nodes?.length ? `Canvas evaluated with ${latestTopology.nodes.length} nodes.` : 'The Round 3 canvas was left blank.',
        highlights: [],
        gaps: !latestTopology?.nodes?.length ? ['Place components and draw end-to-end connections on the canvas.'] : [],
        exchanges: allQuestions.filter((q: any) => q.round === 3),
      },
      {
        roundNumber: 4,
        key: 'round4',
        title: perRound.round4?.title || 'Round 4: Executive STAR Deep Dive',
        shortTitle: 'STAR Deep Dive',
        badge: perRound.round4?.badge || 'STAR Defense',
        status: mkStatus(r4Score, perRound.round4?.status),
        score: r4Score,
        verdict: perRound.round4?.verdict || (starStep > 0 ? 'Developing' : 'Not Attempted'),
        metric: perRound.round4?.metric || `${starStep}/4 STAR steps`,
        whatHappened: starStep > 0 ? `Articulated ${starStep}/4 STAR elements in Round 4.` : 'No STAR defense responses were recorded in Round 4.',
        highlights: [],
        gaps: starStep < 3 ? ['Cover Situation, Task, Action, and measurable Result in Round 4.'] : [],
        exchanges: allQuestions.filter((q: any) => q.round === 4),
        artifact: { type: 'star', starStepsCompleted: starStep },
      },
    ];
  }, [evaluationResult, codeSubmitted, latestTopology, starStep]);

  const selectedRound = activeTab === 'overview' ? null : roundReports.find(r => r.key === activeTab) || null;
  const completedCount = roundReports.filter(r => r.status === 'completed').length;
  const skippedCount = roundReports.filter(r => r.status === 'skipped' || r.status === 'not_attempted').length;

  const radarScores = evaluationResult?.radar || {
    logic: 0,
    systems: 0,
    comms: 0,
    solving: 0,
    star: 0,
  };

  const improvementList: string[] = useMemo(() => {
    const raw = evaluationResult?.improvements;
    if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
    if (typeof raw === 'string' && raw.trim()) {
      return raw.split('•').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [evaluationResult?.improvements]);

  const strengthsList: string[] = Array.isArray(evaluationResult?.strengths)
    ? evaluationResult.strengths.filter(Boolean).map(String)
    : [];

  const telemetrySignals = useMemo(() => {
    if (Array.isArray(evaluationResult?.telemetryDiagnostics?.signals) && evaluationResult.telemetryDiagnostics.signals.length > 0) {
      return evaluationResult.telemetryDiagnostics.signals;
    }
    const micActive = typeof wpmScore === 'number' && wpmScore > 0;
    return [
      {
        metric: 'Speaking Pace',
        value: micActive ? `${wpmScore} WPM` : 'Not Measured',
        diagnostic: micActive ? 'Cadence tracked during session.' : 'Microphone pacing was not captured.',
        status: 'info',
      },
      {
        metric: 'Speech Clarity',
        value: micActive || fillerWordCount > 0 ? `${fillerWordCount} filler words` : 'Not Measured',
        diagnostic: micActive || fillerWordCount > 0 ? 'Spoken clarity tracked.' : 'Speech clarity not assessed.',
        status: 'info',
      },
      {
        metric: 'Camera & Presence',
        value: typeof eyeContactScore === 'number' ? (eyeContactScore >= 60 ? 'Centered' : 'Adjust') : 'Camera Off',
        diagnostic: typeof eyeContactScore === 'number' ? 'Visual framing monitored.' : 'Camera off, delivery not assessed.',
        status: 'info',
      },
    ];
  }, [evaluationResult?.telemetryDiagnostics, wpmScore, fillerWordCount, eyeContactScore]);

  const roundIcons: Record<string, string> = {
    round1: '🗣️',
    round2: '📊',
    round3: '🏗️',
    round4: '⭐',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1220, margin: '0 auto', paddingBottom: 24 }}>
      {/* Live Deliberation Banner */}
      {isEvaluating && (
        <div
          className="iv-evaluating-banner"
          data-testid="results-evaluating-banner"
          style={{ padding: '14px 20px', borderRadius: 14 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="iv-typing-dots" aria-hidden="true">
              <span /><span /><span />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--t1)' }}>
                Hiring Panel Deliberating &amp; Verifying Evidence…
              </div>
              <div style={{ fontSize: 12, color: 'var(--t2)' }}>
                Auditing round-by-round transcript evidence, solution verification, and role-calibrated weights.
              </div>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-mid)', whiteSpace: 'nowrap' }}>
            Syncing Authoritative Score
          </span>
        </div>
      )}

      {/* ── SECTION 1: EXECUTIVE CONCLUSION HERO ──────────────────────────────── */}
      <section
        className="iv-panel iv-results-hero"
        style={{
          padding: 24,
          borderRadius: 16,
          border: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(220px, 0.75fr)',
          gap: 24,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {/* Meta Badges Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.08em',
              color: 'var(--accent-mid)',
              textTransform: 'uppercase',
            }}>
              {evaluationResult?.roleName ? evaluationResult.roleName : activeTopicName}
            </span>
            <span style={{
              fontSize: 10.5,
              padding: '2px 8px',
              borderRadius: 6,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              color: 'var(--t3)',
              fontFamily: 'var(--font-mono)',
            }}>
              {evaluationResult?.rubricVersion ? `${evaluationResult.rubricVersion} Evidence Rubric` : 'v2.0 Evidence Rubric'}
            </span>
            {readinessInfo && (
              <span
                data-testid="results-readiness-badge"
                style={{
                  fontSize: 10.5,
                  padding: '2px 10px',
                  borderRadius: 999,
                  background: readinessInfo.tone === 'positive'
                    ? 'rgba(34, 197, 94, 0.14)'
                    : readinessInfo.tone === 'conditional'
                    ? 'rgba(245, 158, 11, 0.14)'
                    : 'rgba(239, 68, 68, 0.14)',
                  border: readinessInfo.tone === 'positive'
                    ? '1px solid rgba(34, 197, 94, 0.4)'
                    : readinessInfo.tone === 'conditional'
                    ? '1px solid rgba(245, 158, 11, 0.4)'
                    : '1px solid rgba(239, 68, 68, 0.35)',
                  color: readinessInfo.tone === 'positive'
                    ? 'var(--green-mid)'
                    : readinessInfo.tone === 'conditional'
                    ? 'var(--amber-mid)'
                    : 'var(--coral-mid)',
                  fontWeight: 800,
                }}
              >
                {readinessInfo.label}
              </span>
            )}
          </div>

          {/* Main Verdict Headline */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Executive Conclusion
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: verdictColor, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {evaluationResult?.verdict || 'Needs Practice'} · {overallScore}%
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.6, margin: '8px 0 0' }}>
              {evaluationResult?.summary || `Performance evaluation recorded for ${activeTopicName}.`}
            </p>
          </div>

          {/* Quick Session Snapshot Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 10,
          }}>
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Rounds Completed</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', marginTop: 2 }}>{completedCount} / 4</div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Skipped / Blank</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: skippedCount > 0 ? 'var(--amber-mid)' : 'var(--green-mid)', marginTop: 2 }}>{skippedCount} / 4</div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Q&amp;A Exchanges</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', marginTop: 2 }}>
                {Array.isArray(evaluationResult?.questionBreakdown) ? evaluationResult.questionBreakdown.length : 0}
              </div>
            </div>
          </div>

          {/* Role-Calibrated Weights Legend */}
          {evaluationResult?.appliedWeights && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hiring Weights
              </span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(evaluationResult.appliedWeights).map(([dim, weight]: [string, any]) => (
                  <span
                    key={dim}
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      color: 'var(--t1)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {dim.toUpperCase()} {Math.round(Number(weight) * 100)}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Clean 5-Dimension Radar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          borderRadius: 14,
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
        }}>
          <RadarChart scores={radarScores} size={200} />
          <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, marginTop: 4 }}>
            Evidence-Scored Competency Profile
          </div>
        </div>
      </section>

      {/* ── SECTION 2: INTERACTIVE ROUND-WISE REPORT SELECTOR ────────────────── */}
      <section className="iv-panel" style={{ padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 14,
        }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--t1)', letterSpacing: '0.02em' }}>
              Round-by-Round Inspection Report
            </h2>
            <p style={{ fontSize: 12, color: 'var(--t3)', margin: '3px 0 0' }}>
              Select the Conclusion Overview or click any individual round card below to inspect what happened.
            </p>
          </div>
          <button
            type="button"
            data-testid="report-tab-overview"
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '7px 14px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTab === 'overview' ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              background: activeTab === 'overview' ? 'rgba(var(--brand-rgb), 0.16)' : 'var(--bg3)',
              color: activeTab === 'overview' ? 'var(--accent-mid)' : 'var(--t2)',
              transition: 'all 0.15s ease',
            }}
          >
            📋 Conclusion Overview
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {roundReports.map((round) => {
            const isActive = activeTab === round.key;
            const statusPill = getStatusPillStyle(round.status);
            const scoreColor = getScoreColor(round.score, round.status);
            return (
              <button
                key={round.key}
                type="button"
                data-testid={`report-tab-${round.key}`}
                onClick={() => setActiveTab(round.key)}
                style={{
                  textAlign: 'left',
                  padding: 16,
                  borderRadius: 14,
                  background: isActive ? 'rgba(var(--brand-rgb), 0.10)' : 'var(--bg3)',
                  border: isActive ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                  boxShadow: isActive ? '0 0 0 3px rgba(var(--brand-rgb), 0.12)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.16s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {roundIcons[round.key]} Round {round.roundNumber}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: statusPill.bg,
                    border: statusPill.border,
                    color: statusPill.color,
                  }}>
                    {statusPill.label}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--t1)' }}>{round.shortTitle}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-mono)', color: scoreColor }}>
                    {round.score}%
                  </span>
                </div>

                <div style={{ height: 5, background: 'var(--bg2)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(0, Math.min(100, round.score))}%`,
                    background: scoreColor,
                    borderRadius: 999,
                    transition: 'width 0.4s ease',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--t3)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--t2)' }}>{round.verdict}</span>
                  <span style={{ color: isActive ? 'var(--accent-mid)' : 'var(--t3)', fontWeight: 700 }}>
                    {isActive ? 'Viewing ●' : 'Inspect →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 3: ACTIVE REPORT DETAIL SHEET ────────────────────────────── */}
      {activeTab === 'overview' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} data-testid="report-panel-overview">
          {/* Verified Strengths & Concrete Improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <div className="iv-panel" style={{ padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, margin: '0 0 12px', color: 'var(--green-mid)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>✓</span> Verified Strengths
              </h3>
              {strengthsList.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
                  {strengthsList.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              ) : (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'var(--bg3)',
                  border: '1px dashed var(--border)',
                  fontSize: 12.5,
                  color: 'var(--t3)',
                  lineHeight: 1.5,
                }}>
                  No verified strengths were demonstrated in this session yet. Complete at least one round with substantive explanations, code/case analysis, or architecture to unlock strengths.
                </div>
              )}
            </div>

            <div className="iv-panel" style={{ padding: 20, borderRadius: 16, border: '1px solid var(--border)' }} data-testid="improvements-card">
              <h3 style={{ fontSize: 14, fontWeight: 900, margin: '0 0 12px', color: 'var(--amber-mid)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📈</span> Priority Areas to Improve
              </h3>
              {improvementList.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
                  {improvementList.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
                  Keep practicing structured explanations with quantified trade-offs across all 4 rounds.
                </p>
              )}
            </div>
          </div>

          {/* Answer Quality Assessment (Only when substantive answers exist) */}
          {evaluationResult?.answerQuality && (
            <div className="iv-panel" style={{ padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Answer Quality Rubric
                </h3>
                <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>
                  Scored strictly on domain accuracy, relevance, reasoning depth, and clear conclusions.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {[
                  ['questionRelevance', 'Question Relevance'],
                  ['answerAccuracy', 'Domain Accuracy'],
                  ['reasoningDepth', 'Reasoning Depth'],
                  ['conclusionQuality', 'Conclusion Clarity'],
                ].map(([key, label]) => {
                  const score = evaluationResult.answerQuality[key];
                  if (typeof score !== 'number') return null;
                  return (
                    <div key={key} style={{ padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t2)', marginBottom: 6 }}>
                        <span>{label}</span>
                        <strong style={{ fontFamily: 'var(--font-mono)', color: getScoreColor(score) }}>{score}%</strong>
                      </div>
                      <div style={{ height: 5, background: 'var(--bg2)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, score))}%`, background: getScoreColor(score), borderRadius: 999 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {Array.isArray(evaluationResult.answerQuality.evidence) && evaluationResult.answerQuality.evidence.length > 0 && (
                <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                  {evaluationResult.answerQuality.evidence.map((item: any, index: number) => (
                    <div key={`${item.dimension}-${index}`} style={{ padding: '10px 14px', borderLeft: '3px solid var(--accent)', background: 'var(--bg3)', borderRadius: '0 10px 10px 0' }}>
                      <blockquote style={{ margin: 0, color: 'var(--t1)', fontSize: 12.5, fontStyle: 'italic' }}>“{item.quote}”</blockquote>
                      <p style={{ margin: '5px 0 0', color: 'var(--t3)', fontSize: 11.5 }}>{item.assessment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Delivery Diagnostics + STAR Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <div className="iv-panel" style={{ padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>📡 Delivery Diagnostics</h3>
                <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t3)', fontWeight: 700 }}>
                  Non-Scoring
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {telemetrySignals.map((s: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 12px',
                      borderRadius: 10,
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: 'var(--t1)', fontWeight: 700 }}>
                      {s.metric} <span style={{ color: 'var(--t3)', fontWeight: 600 }}>({s.value})</span>
                    </span>
                    <span style={{
                      color: s.status === 'warning' ? 'var(--coral-mid)' : s.status === 'good' ? 'var(--green-mid)' : 'var(--t3)',
                      textAlign: 'right',
                    }}>
                      {s.diagnostic}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="iv-panel" style={{ padding: 20, borderRadius: 16, border: '1px solid var(--border)' }} data-testid="star-metrics-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>⭐ STAR Framework Coverage</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {evaluationResult?.perRoundScores?.round4?.badge && (
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'rgba(var(--brand-rgb), 0.12)',
                      color: 'var(--accent-mid)',
                      border: '1px solid rgba(var(--brand-rgb), 0.25)',
                    }}>
                      {evaluationResult.perRoundScores.round4.badge}
                    </span>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)' }}>
                    {evaluationResult?.starMetrics?.stepsCompleted ?? starStep} / 4 Steps
                  </span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['Situation', 'Task', 'Action', 'Result'].map((step, idx) => {
                  const covered = idx < (evaluationResult?.starMetrics?.stepsCompleted ?? starStep);
                  return (
                    <div
                      key={step}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 12px',
                        borderRadius: 10,
                        background: covered ? 'rgba(34, 197, 94, 0.10)' : 'var(--bg3)',
                        border: covered ? '1px solid rgba(34, 197, 94, 0.32)' : '1px solid var(--border)',
                        fontSize: 12.5,
                      }}
                    >
                      <span>{covered ? '✅' : '⬜'}</span>
                      <span style={{ fontWeight: 800, color: covered ? 'var(--green-mid)' : 'var(--t3)' }}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Verified Defended Skills (Strictly shown when real skills were defended) */}
          {Array.isArray(evaluationResult?.defendedTechStack) && evaluationResult.defendedTechStack.length > 0 && (
            <div className="iv-panel" style={{ padding: 20, borderRadius: 16, border: '1px solid var(--border)' }} data-testid="results-tech-stack-badges">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>🧩 Verified Defended Skills &amp; Concepts</h3>
                <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>Extracted strictly from your responses &amp; canvas</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {evaluationResult.defendedTechStack.map((tech: string) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: 999,
                      background: 'rgba(var(--brand-rgb), 0.12)',
                      border: '1px solid rgba(var(--brand-rgb), 0.3)',
                      color: 'var(--accent-mid)',
                    }}
                  >
                    ✓ {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : selectedRound && (
        /* ── INDIVIDUAL ROUND DEEP-DIVE REPORT SHEET ─────────────────────────── */
        <section
          className="iv-panel"
          data-testid={`report-panel-${selectedRound.key}`}
          style={{
            padding: 24,
            borderRadius: 16,
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* Round Detail Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 14,
            paddingBottom: 16,
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {roundIcons[selectedRound.key]} Round {selectedRound.roundNumber} Report · {selectedRound.badge}
                </span>
                {(() => {
                  const st = getStatusPillStyle(selectedRound.status);
                  return (
                    <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 9px', borderRadius: 999, background: st.bg, border: st.border, color: st.color }}>
                      {st.label}
                    </span>
                  );
                })()}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>{selectedRound.title}</h2>
              <p style={{ fontSize: 13.5, color: 'var(--t2)', margin: '6px 0 0', lineHeight: 1.55 }}>
                {selectedRound.whatHappened}
              </p>
            </div>
            <div style={{
              textAlign: 'right',
              padding: '10px 18px',
              borderRadius: 12,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              minWidth: 110,
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-mono)', color: getScoreColor(selectedRound.score, selectedRound.status), lineHeight: 1.1 }}>
                {selectedRound.score}%
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', marginTop: 3 }}>
                {selectedRound.verdict}
              </div>
            </div>
          </div>

          {/* Round Highlights & Gaps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--green-mid)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                What Went Well
              </div>
              {selectedRound.highlights.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {selectedRound.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              ) : (
                <div style={{ fontSize: 12.5, color: 'var(--t3)' }}>No verified highlights recorded in Round {selectedRound.roundNumber}.</div>
              )}
            </div>

            <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--amber-mid)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Gaps &amp; Next Focus
              </div>
              {selectedRound.gaps.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {selectedRound.gaps.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              ) : (
                <div style={{ fontSize: 12.5, color: 'var(--green-mid)' }}>No critical gaps identified in this round.</div>
              )}
            </div>
          </div>

          {/* Round-Specific Artifact (Round 2 Submission / Round 3 Canvas / Round 4 STAR) */}
          {selectedRound.artifact?.type === 'code_or_case' && selectedRound.artifact.details && selectedRound.artifact.details.length > 0 && (
            <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>Submitted Round 2 Work</div>
              <pre style={{
                margin: 0,
                padding: 12,
                borderRadius: 8,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                fontSize: 12,
                color: 'var(--t2)',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'pre-wrap',
                maxHeight: 220,
                overflowY: 'auto',
              }}>
                {selectedRound.artifact.details[0]}
              </pre>
            </div>
          )}

          {selectedRound.artifact?.type === 'topology' && (selectedRound.artifact.recommendations?.length || 0) > 0 && (
            <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--accent-mid)', marginBottom: 8, textTransform: 'uppercase' }}>
                Canvas Recommendations
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {selectedRound.artifact.recommendations!.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
          )}

          {selectedRound.artifact?.type === 'star' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
              {['Situation', 'Task', 'Action', 'Result'].map((step, idx) => {
                const covered = idx < (selectedRound.artifact?.starStepsCompleted ?? 0);
                return (
                  <div
                    key={step}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: covered ? 'rgba(34, 197, 94, 0.10)' : 'var(--bg3)',
                      border: covered ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid var(--border)',
                      textAlign: 'center',
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: covered ? 'var(--green-mid)' : 'var(--t3)',
                    }}
                  >
                    {covered ? '✅' : '⬜'} {step}
                  </div>
                );
              })}
            </div>
          )}

          {/* Round-Specific Q&A Benchmark Exchanges */}
          <div data-testid="results-question-benchmark">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 13.5, fontWeight: 900, margin: 0, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Round {selectedRound.roundNumber} Q&amp;A Breakdown
              </h3>
              <span style={{ fontSize: 11.5, color: 'var(--t3)', fontWeight: 700 }}>
                {selectedRound.exchanges.length} Exchange{selectedRound.exchanges.length === 1 ? '' : 's'}
              </span>
            </div>

            {selectedRound.exchanges.length === 0 ? (
              <div style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'var(--bg3)',
                border: '1px dashed var(--border)',
                fontSize: 12.5,
                color: 'var(--t3)',
              }}>
                No answered Q&amp;A exchanges were recorded in Round {selectedRound.roundNumber}.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedRound.exchanges.map((item, idx) => {
                  const qScore = Number.isFinite(Number(item?.score)) ? Number(item.score) : 0;
                  const missed = Array.isArray(item?.missedConcepts) ? item.missedConcepts : [];
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.45 }}>
                          Q{idx + 1}: {item.question}
                        </div>
                        <span style={{
                          flexShrink: 0,
                          padding: '3px 9px',
                          borderRadius: 8,
                          fontSize: 11.5,
                          fontWeight: 900,
                          fontFamily: 'var(--font-mono)',
                          background: qScore >= 75 ? 'rgba(34,197,94,0.14)' : qScore >= 40 ? 'rgba(245,158,11,0.14)' : 'rgba(239,68,68,0.14)',
                          color: getScoreColor(qScore),
                        }}>
                          {qScore}%
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Your Response</div>
                          <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>{item.candidateAnswer || 'No response recorded.'}</div>
                        </div>
                        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                          <div style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--green-mid)', textTransform: 'uppercase', marginBottom: 4 }}>Ideal Benchmark</div>
                          <div style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.5 }}>{item.idealAnswer}</div>
                        </div>
                      </div>

                      {item.feedback && (
                        <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
                          <strong style={{ color: 'var(--t1)' }}>Mentor Note:</strong> {item.feedback}
                        </div>
                      )}

                      {missed.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--amber-mid)' }}>Missed Signals:</span>
                          {missed.map((concept, cIdx) => (
                            <span key={cIdx} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber-mid)', fontWeight: 700 }}>
                              {concept}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Round Navigation Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => {
                const prev = selectedRound.roundNumber === 1 ? 'overview' : (`round${selectedRound.roundNumber - 1}` as ReportTab);
                setActiveTab(prev);
              }}
              className="iv-btn-secondary"
              style={{ padding: '7px 14px', fontSize: 12, fontWeight: 800 }}
            >
              ← {selectedRound.roundNumber === 1 ? 'Back to Conclusion' : `Round ${selectedRound.roundNumber - 1}`}
            </button>
            <button
              type="button"
              onClick={() => {
                const next = selectedRound.roundNumber === 4 ? 'overview' : (`round${selectedRound.roundNumber + 1}` as ReportTab);
                setActiveTab(next);
              }}
              className="iv-btn-secondary"
              style={{ padding: '7px 14px', fontSize: 12, fontWeight: 800 }}
            >
              {selectedRound.roundNumber === 4 ? 'Conclusion Overview' : `Round ${selectedRound.roundNumber + 1}`} →
            </button>
          </div>
        </section>
      )}

      {/* ── SECTION 4: CLEAN ORGANIZED ACTION FOOTER ─────────────────────────── */}
      <footer
        className="iv-panel"
        style={{
          padding: 16,
          borderRadius: 16,
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Primary Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={startInterview} className="iv-btn-success" style={{ padding: '10px 18px', fontSize: 13.5, borderRadius: 10 }}>
            🔄 Practice Again
          </button>
          <button onClick={exitInterview} className="iv-btn-primary" style={{ padding: '10px 18px', fontSize: 13.5, borderRadius: 10 }}>
            🔀 Switch Topic / Mode
          </button>
        </div>

        {/* Secondary Export & Share Controls */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            data-testid="print-pdf-btn"
            onClick={() => exportInterviewTranscript('pdf')}
            className="iv-btn-secondary"
            style={{ padding: '8px 13px', fontSize: 12, fontWeight: 800, borderRadius: 10 }}
          >
            🖨️ Save PDF
          </button>
          <button
            onClick={() => exportInterviewTranscript('markdown')}
            className="iv-btn-secondary"
            style={{ padding: '8px 13px', fontSize: 12, fontWeight: 800, borderRadius: 10 }}
          >
            📥 Markdown
          </button>
          <button
            onClick={() => exportInterviewTranscript('json')}
            className="iv-btn-secondary"
            style={{ padding: '8px 13px', fontSize: 12, fontWeight: 800, borderRadius: 10 }}
          >
            💾 JSON
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const summaryText = `PinIT Verified AI Interview — ${activeTopicName}: ${evaluationResult?.verdict || 'Completed'} (${overallScore}%) • ${window.location.origin}/interview`;
                navigator.clipboard?.writeText(summaryText)
                  .then(() => toast.success('Scorecard Link Copied! 📋', 'Verification summary & link copied to clipboard.'))
                  .catch(() => toast.info('Clipboard Unavailable', 'Use Save PDF or Markdown export to share your scorecard.'));
              }
            }}
            className="iv-btn-secondary"
            style={{ padding: '8px 13px', fontSize: 12, fontWeight: 800, borderRadius: 10 }}
          >
            🔗 Share
          </button>
          <Link
            href="/career-twin"
            className="iv-btn-secondary"
            style={{ padding: '8px 13px', fontSize: 12, fontWeight: 800, borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            🧬 Career Twin
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default InterviewResultsView;
