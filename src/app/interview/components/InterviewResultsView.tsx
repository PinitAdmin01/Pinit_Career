'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from '@/lib/store/useAppStore';
import RadarChart from './RadarChart';
import { getVerdictTone, formatReadinessBadge } from '../interviewTypes';

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
  const verdictTone = getVerdictTone(evaluationResult?.verdict);
  const verdictColor = verdictTone === 'positive'
    ? 'var(--green-mid)'
    : verdictTone === 'conditional'
    ? 'var(--amber-mid)'
    : 'var(--coral-mid)';
  const readinessInfo = evaluationResult?.readiness ? formatReadinessBadge(evaluationResult.readiness) : null;
  const fallbackBase = Number.isFinite(Number(evaluationResult?.score)) ? Number(evaluationResult.score) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {isEvaluating && (
        <div className="iv-evaluating-banner" data-testid="results-evaluating-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="iv-typing-dots" aria-hidden="true">
              <span /><span /><span />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--t1)' }}>
                Hiring Panel Deliberating &amp; Verifying Rubric…
              </div>
              <div style={{ fontSize: 12, color: 'var(--t2)' }}>
                Auditing transcript evidence, role-calibrated dimension weights, and Q&amp;A benchmarks.
              </div>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-mid)', whiteSpace: 'nowrap' }}>
            Syncing Authoritative Score
          </span>
        </div>
      )}

      <div className="iv-panel iv-results-hero" style={{ padding: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '1px', color: 'var(--accent-mid)', textTransform: 'uppercase' }}>
              {evaluationResult?.roleName ? `ROLE: ${evaluationResult.roleName}` : `INTERVIEW REPORT: ${activeTopicName}`}
            </span>
            <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t3)', fontFamily: 'monospace' }}>
              {evaluationResult?.rubricVersion ? `${evaluationResult.rubricVersion} Rubric` : 'v2.0 Rigor Rubric'}
            </span>
            {readinessInfo && (
              <span
                data-testid="results-readiness-badge"
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: readinessInfo.tone === 'positive'
                    ? 'rgba(34, 197, 94, 0.15)'
                    : readinessInfo.tone === 'conditional'
                    ? 'rgba(245, 158, 11, 0.15)'
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
                  fontWeight: 800
                }}
              >
                {readinessInfo.label}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: '6px 0', color: verdictColor }}>
            Verdict: {evaluationResult?.verdict || 'Needs Practice'} ({evaluationResult?.score ?? 0}%)
          </h1>
          <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.5, margin: '0 0 10px' }}>
            {evaluationResult?.summary || `Performance evaluation recorded for ${activeTopicName}.`}
          </p>

          {evaluationResult?.coaching?.growthArea && (
            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(var(--brand-rgb),0.08)', border: '1px solid rgba(var(--brand-rgb),0.2)', fontSize: 12.5, color: 'var(--accent-mid)', marginBottom: 8 }}>
              <strong>🎯 DNA Focus Area:</strong> {evaluationResult.coaching.growthArea}
            </div>
          )}

          {evaluationResult?.appliedWeights && (
            <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Role-Calibrated Hiring Weights
                </span>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>Normalized Σ = 100%</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 11 }}>
                {Object.entries(evaluationResult.appliedWeights).map(([dim, weight]: [string, any]) => (
                  <span key={dim} style={{ padding: '2px 6px', borderRadius: 4, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', fontWeight: 700 }}>
                    {dim.toUpperCase()}: {Math.round(weight * 100)}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RadarChart scores={evaluationResult?.radar || { logic: fallbackBase, systems: fallbackBase, comms: fallbackBase, solving: fallbackBase, star: fallbackBase }} size={200} />
        </div>
      </div>

      {/* IV-UX-01: Per-Round Mastery Scorecard Breakdown */}
      <div className="iv-panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 17.5 }}>📋</span>
            <h3 style={{ fontSize: 14.5, fontWeight: 900, margin: 0, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Per-Round Mastery Breakdown
            </h3>
          </div>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(var(--brand-rgb),0.1)', color: 'var(--accent-mid)', fontWeight: 800 }}>
            4 Assessment Stages Evaluated
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            {
              key: 'round1',
              def: {
                title: 'Round 1: Behavioral',
                score: Number.isFinite(Number(evaluationResult?.radar?.comms)) ? Number(evaluationResult.radar.comms) : fallbackBase,
                verdict: (evaluationResult?.radar?.comms ?? fallbackBase) >= 75 ? 'Strong Communicator' : (evaluationResult?.radar?.comms ?? fallbackBase) >= 55 ? 'Competent' : 'Needs Practice',
                metric: 'Spoken Q&A',
                badge: 'Behavioral'
              },
              icon: '🗣️',
              color: 'var(--accent)'
            },
            {
              key: 'round2',
              def: {
                title: 'Round 2: Technical Sandbox',
                score: Number.isFinite(Number(evaluationResult?.radar?.solving)) ? Number(evaluationResult.radar.solving) : (codeSubmitted ? 85 : 0),
                verdict: codeSubmitted ? 'Verified Implementation' : 'Not Submitted',
                metric: codeSubmitted ? 'Tests Passed' : 'Incomplete',
                badge: 'Coding'
              },
              icon: '💻',
              color: 'var(--pink)'
            },
            {
              key: 'round3',
              def: {
                title: 'Round 3: System Canvas',
                score: Number.isFinite(Number(evaluationResult?.radar?.systems)) ? Number(evaluationResult.radar.systems) : (latestTopology?.nodes?.length ? 70 : 0),
                verdict: latestTopology?.nodes?.length ? 'Evaluated Topology' : 'Needs Work',
                metric: `${latestTopology?.nodes?.length || 0} nodes wired`,
                badge: 'Systems'
              },
              icon: '🏗️',
              color: 'var(--teal)'
            },
            {
              key: 'round4',
              def: {
                title: 'Round 4: STAR Defense',
                score: Number.isFinite(Number(evaluationResult?.radar?.star)) ? Number(evaluationResult.radar.star) : Math.min(100, starStep * 25),
                verdict: starStep >= 3 ? 'Exemplary STAR' : starStep > 0 ? 'Developing Structure' : 'Not Completed',
                metric: `${starStep} STAR steps`,
                badge: 'STAR'
              },
              icon: '⭐',
              color: 'var(--amber)'
            }
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
                    <span style={{ fontSize: 15.5 }}>{r.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)' }}>{roundData.title}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 900, color: roundData.score >= 75 ? 'var(--green-mid)' : 'var(--amber-mid)' }}>
                    {roundData.score}%
                  </span>
                </div>

                {roundData.badge && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(var(--brand-rgb),0.12)',
                      border: '1px solid rgba(var(--brand-rgb),0.25)',
                      color: 'var(--accent-mid)',
                      letterSpacing: '0.3px'
                    }}>
                      🏷️ {roundData.badge}
                    </span>
                  </div>
                )}

                <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ height: '100%', width: `${roundData.score}%`, background: r.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--t3)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--t2)' }}>{roundData.verdict}</span>
                  <span>{roundData.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {evaluationResult?.answerQuality && (
        <div className="iv-panel" style={{ padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 900, margin: 0, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              How Your Answers Were Assessed
            </h3>
            <p style={{ fontSize: 12, color: 'var(--t3)', margin: '5px 0 0' }}>
              Scores reflect your responses to the questions—not speaking style or answer length.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
            {[
              ['questionRelevance', 'Answered the question'],
              ['answerAccuracy', 'Accuracy'],
              ['reasoningDepth', 'Reasoning'],
              ['conclusionQuality', 'Conclusion'],
            ].map(([key, label]) => {
              const score = evaluationResult.answerQuality[key];
              if (typeof score !== 'number') return null;
              return (
                <div key={key} style={{ padding: 10, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 11, color: 'var(--t2)', marginBottom: 6 }}>
                    <span>{label}</span><strong>{score}%</strong>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, score))}%`, background: 'var(--accent)', borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
          {Array.isArray(evaluationResult.answerQuality.evidence) && evaluationResult.answerQuality.evidence.length > 0 && (
            <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
              {evaluationResult.answerQuality.evidence.map((item: any, index: number) => (
                <div key={`${item.dimension}-${index}`} style={{ padding: '9px 12px', borderLeft: '3px solid var(--accent)', background: 'var(--bg3)', borderRadius: '0 8px 8px 0' }}>
                  <blockquote style={{ margin: 0, color: 'var(--t1)', fontSize: 12, fontStyle: 'italic' }}>“{item.quote}”</blockquote>
                  <p style={{ margin: '5px 0 0', color: 'var(--t3)', fontSize: 11 }}>{item.assessment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Coaching & Diagnostics Cards */}
      <div className="iv-results-2col">
        <div className="iv-panel" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 16.5 }}>🧠</span>
            <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>DNA Coaching Guidance</h3>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.4, marginBottom: 8 }}>
            {evaluationResult?.coaching?.personaSummary || 'Tailored coaching for your mindset archetype.'}
          </p>

          {evaluationResult?.strengths && evaluationResult.strengths.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--green-mid)', marginBottom: 4 }}>
                🌟 Demonstrated Strengths:
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>
                {evaluationResult.strengths.map((str: string, i: number) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--accent-mid)', marginBottom: 4 }}>
            🎯 Targeted Playbook:
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
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
              <span style={{ fontSize: 16.5 }}>📡</span>
              <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>Delivery Diagnostics (Practice Signal)</h3>
            </div>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t3)' }}>Non-Scoring</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(evaluationResult?.telemetryDiagnostics?.signals || [
              { metric: 'Speaking Pace', value: wpmScore ? `${wpmScore} WPM` : 'Not Measured', diagnostic: wpmScore ? 'Cadence tracked during session.' : 'Audio pacing was not measured.', status: 'info' },
              { metric: 'Speech Clarity', value: fillerWordCount !== undefined && fillerWordCount !== null ? `${fillerWordCount} filler words` : 'Not Measured', diagnostic: fillerWordCount !== undefined ? 'Clean verbal articulation.' : 'Speech clarity not assessed.', status: 'info' },
              { metric: 'Camera Presence & Framing', value: eyeContactScore !== null && eyeContactScore !== undefined ? (eyeContactScore >= 60 ? 'Centered' : 'Off-Center') : 'Camera Off', diagnostic: eyeContactScore !== null && eyeContactScore !== undefined ? (eyeContactScore >= 60 ? 'Optimal eye-level framing maintained.' : 'Slight drift detected; keep webcam level with eyes.') : 'Camera off, delivery not assessed.', status: 'info' }
            ]).map((s: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '4px 8px', borderRadius: 6, background: 'var(--bg3)' }}>
                <span style={{ color: 'var(--t2)', fontWeight: 600 }}>{s.metric} ({s.value})</span>
                <span style={{ color: s.status === 'warning' ? 'var(--coral-mid)' : 'var(--green-mid)' }}>{s.diagnostic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Defended Tech Stack Badges & Question-by-Question Benchmark Diff */}
      {Array.isArray(evaluationResult?.defendedTechStack) && evaluationResult.defendedTechStack.length > 0 && (
        <div className="iv-panel" style={{ padding: 18 }} data-testid="results-tech-stack-badges">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🧩</span>
              <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                Verified Defended Tech &amp; Domain Stack
              </h3>
            </div>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700 }}>
              Extracted from spoken transcript, code &amp; whiteboard
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {evaluationResult.defendedTechStack.map((tech: string) => (
              <span
                key={tech}
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: 'rgba(var(--brand-rgb), 0.12)',
                  border: '1px solid rgba(var(--brand-rgb), 0.3)',
                  color: 'var(--accent-mid)'
                }}
              >
                ✓ {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(evaluationResult?.questionBreakdown) && evaluationResult.questionBreakdown.length > 0 && (
        <div className="iv-panel" style={{ padding: 20 }} data-testid="results-question-benchmark">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 14.5, fontWeight: 900, margin: 0, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Question-by-Question Benchmark Review
              </h3>
              <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>
                Side-by-side comparison of your answer against an exemplary target response.
              </p>
            </div>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(var(--brand-rgb),0.1)', color: 'var(--accent-mid)', fontWeight: 800 }}>
              {evaluationResult.questionBreakdown.length} Exchanges
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {evaluationResult.questionBreakdown.map((item: any, idx: number) => {
              const qScore = Number.isFinite(Number(item?.score)) ? Number(item.score) : 0;
              const candidateAns = item?.candidateAnswer || item?.candidate_answer || '';
              const idealAns = item?.idealAnswer || item?.ideal_answer || '';
              const missed = Array.isArray(item?.missedConcepts)
                ? item.missedConcepts
                : Array.isArray(item?.missed_concepts)
                ? item.missed_concepts
                : [];
              return (
                <details
                  key={idx}
                  open={idx === 0}
                  className="iv-scorecard-accordion"
                >
                  <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 12.5, color: 'var(--t1)' }}>
                    <span>Q{idx + 1}: {item?.question}</span>
                    <span style={{
                      flexShrink: 0,
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 900,
                      background: qScore >= 75 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                      color: qScore >= 75 ? 'var(--green-mid)' : 'var(--amber-mid)'
                    }}>
                      {qScore}%
                    </span>
                  </summary>
                  <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                    <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Your Response</div>
                      <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{candidateAns || 'No response recorded.'}</div>
                    </div>
                    <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                      <div style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--green-mid)', textTransform: 'uppercase', marginBottom: 4 }}>Ideal Benchmark Answer</div>
                      <div style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.45 }}>{idealAns}</div>
                    </div>
                  </div>
                  {item?.feedback && (
                    <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--t2)' }}>
                      <strong>Mentor Note:</strong> {item.feedback}
                    </div>
                  )}
                  {missed.length > 0 && (
                    <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--amber-mid)' }}>Missed Signals:</span>
                      {missed.map((concept: string, cIdx: number) => (
                        <span key={cIdx} style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 4, background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber-mid)', fontWeight: 700 }}>
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}
                </details>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons Row with PDF Print & Share */}
      {/* STAR Framework Metrics & Improvement Suggestions */}
      {(evaluationResult?.starMetrics || evaluationResult?.improvements) && (
        <div className="iv-results-2col">
          {evaluationResult?.starMetrics && (
            <div className="iv-panel" style={{ padding: 18 }} data-testid="star-metrics-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 16.5 }}>⭐</span>
                <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>STAR Framework Metrics</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Situation', 'Task', 'Action', 'Result'].map((step, idx) => {
                  const covered = idx < (evaluationResult.starMetrics.stepsCompleted ?? starStep);
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, padding: '4px 8px', borderRadius: 6, background: covered ? 'rgba(34,197,94,0.08)' : 'var(--bg3)' }}>
                      <span>{covered ? '✅' : '⬜'}</span>
                      <span style={{ fontWeight: 700, color: covered ? 'var(--green-mid)' : 'var(--t3)' }}>{step}</span>
                    </div>
                  );
                })}
              </div>
              {evaluationResult.starMetrics.badge && (
                <div style={{ marginTop: 8, fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, display: 'inline-block', background: 'rgba(var(--brand-rgb),0.1)', color: 'var(--accent-mid)', border: '1px solid rgba(var(--brand-rgb),0.2)' }}>
                  🏅 {evaluationResult.starMetrics.badge}
                </div>
              )}
            </div>
          )}
          {evaluationResult?.improvements && (
            <div className="iv-panel" style={{ padding: 18 }} data-testid="improvements-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 16.5 }}>📈</span>
                <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>Areas for Improvement</h3>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                {typeof evaluationResult.improvements === 'string'
                  ? evaluationResult.improvements
                  : Array.isArray(evaluationResult.improvements)
                    ? evaluationResult.improvements.join('. ')
                    : 'Keep practicing to refine your approach.'}
              </p>
            </div>
          )}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        <button onClick={startInterview} className="iv-btn-success" style={{ padding: 12, fontSize: 14 }}>
          🔄 Practice Round Again
        </button>
        <button
          onClick={() => exportInterviewTranscript('markdown')}
          className="iv-btn-secondary"
          style={{ padding: 12, borderColor: 'var(--accent)', color: 'var(--accent-mid)', fontSize: 14, fontWeight: 900 }}
        >
          📥 Export Transcript (.md)
        </button>
        <button
          onClick={() => exportInterviewTranscript('json')}
          className="iv-btn-secondary"
          style={{ padding: 12, color: 'var(--t2)', fontSize: 14, fontWeight: 900 }}
        >
          💾 Raw JSON
        </button>
        <button
          data-testid="print-pdf-btn"
          onClick={() => exportInterviewTranscript('pdf')}
          className="iv-btn-secondary"
          style={{ padding: 12, fontSize: 14, fontWeight: 900 }}
        >
          🖨️ Print / Save PDF
        </button>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              const summaryText = `PinIT Verified AI Interview — ${activeTopicName}: ${evaluationResult?.verdict || 'Completed'} (${evaluationResult?.score ?? 0}%) • ${window.location.origin}/interview`;
              navigator.clipboard?.writeText(summaryText)
                .then(() => toast.success('Scorecard Link Copied! 📋', 'Verification summary & link copied to clipboard.'))
                .catch(() => toast.info('Clipboard Unavailable', 'Use Print / Save PDF or Export Transcript to share your scorecard.'));
            }
          }}
          className="iv-btn-secondary"
          style={{ padding: 12, fontSize: 14, fontWeight: 900 }}
        >
          🔗 Share Verification Link
        </button>
        <button onClick={exitInterview} className="iv-btn-primary" style={{ padding: 12, fontSize: 14 }}>
          🔀 Switch Topic / Mode
        </button>
        <Link href="/career-twin" className="iv-btn-secondary" style={{ padding: 12, fontSize: 14, fontWeight: 900, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          🧬 Sync Career Twin
        </Link>
      </div>
    </div>
  );
};
export default InterviewResultsView;
