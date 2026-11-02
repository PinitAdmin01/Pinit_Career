'use client';

import React from 'react';
import Link from 'next/link';
import { card, cardLabel } from './constants';
import { ROADMAP_STEPS, Simulation } from '../hooks/useLearningData';
import { RoadmapStageInfo, TwinSimulationOutput } from '@/lib/learning/learningTwinIntelligence';

interface LearningPathViewProps {
  activeTab: 'roadmap' | 'twin';
  roadmapSteps: typeof ROADMAP_STEPS;
  dynamicRoadmap?: RoadmapStageInfo[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (val: boolean) => void;
  teacher: { name: string; emoji: string };
  chatHistory: Array<{ sender: 'ai' | 'user'; text: string }>;
  simulating: boolean;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
  inputVal: string;
  setInputVal: (val: string) => void;
  handleSendAnswer: () => void;
  ONBOARDING_QUESTIONS: Array<{ id: string; q: string; placeholder: string }>;
  step: number;
  onboardingAnswers: any;
  twinData?: { simulation: Simulation };
  twinSimulation?: TwinSimulationOutput;
  selectedTwinPath: number;
  setSelectedTwinPath: (idx: number) => void;
  dailyQuestPace?: number;
  setDailyQuestPace?: (v: number) => void;
  interviewScoreTarget?: number;
  setInterviewScoreTarget?: (v: number) => void;
  gapsResolvedCount?: number;
  setGapsResolvedCount?: (v: number) => void;
  targetRole?: string;
}

export function LearningPathView({
  activeTab,
  roadmapSteps,
  dynamicRoadmap = [],
  activeStep,
  setActiveStep,
  onboardingComplete,
  setOnboardingComplete,
  teacher,
  chatHistory,
  simulating,
  chatBottomRef,
  inputVal,
  setInputVal,
  handleSendAnswer,
  ONBOARDING_QUESTIONS,
  step,
  onboardingAnswers,
  twinData,
  twinSimulation,
  selectedTwinPath,
  setSelectedTwinPath,
  dailyQuestPace = 2,
  setDailyQuestPace,
  interviewScoreTarget = 75,
  setInterviewScoreTarget,
  gapsResolvedCount = 1,
  setGapsResolvedCount,
  targetRole = 'Full Stack Engineer'
}: LearningPathViewProps) {
  // =========================================================================
  // SUBTAB 2: GROWTH ROADMAP
  // =========================================================================
  if (activeTab === 'roadmap') {
    const currentStage = dynamicRoadmap[activeStep] || dynamicRoadmap[0];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, alignItems: 'start' }}>
        {/* Left Column: Stages List */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={cardLabel}>Recommended Growth Roadmap Pathway</div>
            <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 6 }}>
              {targetRole}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dynamicRoadmap.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={s.stageNumber || idx}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    background: isActive ? 'var(--accent-light)' : 'var(--bg3)',
                    border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 14,
                    padding: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: isActive ? 'var(--accent)' : 'var(--bg2)',
                          color: isActive ? '#fff' : 'var(--t3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 900,
                          border: '1px solid var(--border)',
                          flexShrink: 0
                        }}
                      >
                        {idx + 1}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>
                        {s.phaseName}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: s.progressPct > 0 ? 'var(--green)' : 'var(--t3)' }}>
                      {s.progressPct}% Done
                    </span>
                  </div>

                  <h4 style={{ margin: '4px 0 2px 0', fontSize: 14, fontWeight: 800, color: isActive ? 'var(--accent)' : 'var(--t1)' }}>
                    {s.title}
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                    {s.description}
                  </p>

                  {/* Progress meter */}
                  <div style={{ height: 5, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.progressPct}%`, background: isActive ? 'var(--accent)' : 'var(--green)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Stage Blueprint & Verification Gate */}
        {currentStage && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={cardLabel}>Active Stage Blueprint &amp; Verification Gate</div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-light)', padding: '2px 8px', borderRadius: 6 }}>
                Stage {currentStage.stageNumber} of {dynamicRoadmap.length}
              </span>
            </div>

            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {currentStage.phaseName}
            </span>
            <h3 style={{ margin: '4px 0 8px 0', fontSize: 18, fontWeight: 900, color: 'var(--t1)' }}>
              {currentStage.title}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
              {currentStage.description}
            </p>

            {/* Core Competencies & Skills */}
            <div style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)', textTransform: 'uppercase', marginBottom: 8 }}>
                🛠️ Core Verified Competencies To Master:
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {currentStage.skills.map(skill => (
                  <span
                    key={skill}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      background: 'var(--bg2)',
                      color: 'var(--accent)',
                      border: '1px solid var(--border)',
                      padding: '4px 10px',
                      borderRadius: 8
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Stage Gate Requirements */}
            <div style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)', textTransform: 'uppercase', marginBottom: 10 }}>
                🛡️ Stage Milestone Verification Gate:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <div style={{ background: 'var(--bg2)', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>Curriculum Completion</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>≥ {currentStage.gateRequirements.minCompletionPct}%</div>
                </div>
                {currentStage.gateRequirements.dsaScore && (
                  <div style={{ background: 'var(--bg2)', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>DSA Benchmark Target</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)' }}>≥ {currentStage.gateRequirements.dsaScore} Score</div>
                  </div>
                )}
                {currentStage.gateRequirements.atsScore && (
                  <div style={{ background: 'var(--bg2)', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>ATS Resume Benchmark</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)' }}>≥ {currentStage.gateRequirements.atsScore} Points</div>
                  </div>
                )}
                <div style={{ background: 'var(--bg2)', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>Vault Evidence Status</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--purple)' }}>SHA-256 Proof Req.</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <Link
                href={currentStage.questDeepLink}
                style={{
                  flex: 1,
                  padding: '10px 18px',
                  borderRadius: 10,
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 13.5,
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                🚀 Enter Quest Arena for this Stage
              </Link>
              <Link
                href="/vault"
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  color: 'var(--t1)',
                  fontWeight: 700,
                  fontSize: 13.5,
                  textDecoration: 'none'
                }}
              >
                📁 Check Vault
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // SUBTAB 3: DIGITAL CAREER TWIN SIMULATOR
  // =========================================================================
  const sim = twinSimulation;

  return (
    <div>
      {!onboardingComplete ? (
        // AI Companion Chat Calibration
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, display: 'flex', flexDirection: 'column', height: 460, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, var(--accent), var(--purple))', color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>{teacher.emoji}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{teacher.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>AI Career Companion · Digital Twin Calibration</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg)' }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'ai' ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 12, fontSize: 14, lineHeight: 1.5,
                  background: msg.sender === 'ai' ? 'var(--card)' : 'var(--accent)',
                  color: msg.sender === 'ai' ? 'var(--t1)' : 'white',
                  border: msg.sender === 'ai' ? '1px solid var(--border)' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {simulating && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 12, fontSize: 13.5, color: 'var(--accent)' }}>
                  ⚡ Simulating digital twin trajectory...
                </div>
              </div>
            )}
            <div ref={chatBottomRef as any} />
          </div>

          <div style={{ padding: '12px 16px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendAnswer()}
              placeholder={ONBOARDING_QUESTIONS[step]?.placeholder || "Type your response..."}
              style={{ flex: 1, padding: '8px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--t1)', fontSize: 14 }}
            />
            <button onClick={handleSendAnswer} className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Send →</button>
          </div>
        </div>
      ) : (
        // The Interactive Digital Career Twin Cockpit
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top Bar: Overview & Recalibration */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🧬</span>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--t1)' }}>
                  Digital Career Twin — Market Placement Cockpit
                </h2>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                  Dynamic algorithmic model mirroring your market hireability, placement timeline, and salary brackets.
                </span>
              </div>
            </div>
            <button
              onClick={() => setOnboardingComplete(false)}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 800,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--accent)',
                cursor: 'pointer'
              }}
            >
              🔄 Recalibrate with AI Companion
            </button>
          </div>

          {/* 4 Bento Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div style={{ background: 'var(--bg2)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Market Readiness</div>
              <div style={{ fontSize: 22, fontWeight: 950, color: 'var(--accent)' }}>{sim?.overallMarketReadiness || 78}%</div>
              <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${sim?.overallMarketReadiness || 78}%`, background: 'var(--accent)' }} />
              </div>
            </div>

            <div style={{ background: 'var(--bg2)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Projected Starting CTC</div>
              <div style={{ fontSize: 22, fontWeight: 950, color: 'var(--green)' }}>{sim?.projectedCtcBracket || '₹12 - 18 LPA'}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>Based on verified competencies</div>
            </div>

            <div style={{ background: 'var(--bg2)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Est. Months to First Offer</div>
              <div style={{ fontSize: 22, fontWeight: 950, color: 'var(--purple)' }}>{sim?.estimatedMonthsToOffer || 4.2} Mo</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>Accelerates with quest velocity</div>
            </div>

            <div style={{ background: 'var(--bg2)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Recruiter Appeal Tier</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--coral)', marginTop: 4 }}>{sim?.recruiterAppealTier || 'Competitive Contender'}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 6 }}>~{sim?.weeklyEffortHours || 20} hrs/week commitment</div>
            </div>
          </div>

          {/* Interactive Sensitivity Sliders (What-If Engine) */}
          <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.05), rgba(6,182,212,0.03))', border: '1.5px solid rgba(79,70,229,0.25)', borderRadius: 18, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                  🎛️ Interactive Career Twin Sensitivity Simulator ("What-If" Engine)
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--t2)' }}>
                  Drag the sliders below to see your Twin dynamically recalculate market readiness, salary ranges, and hiring probabilities in real time!
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {/* Slider 1: Daily Quest Pacing */}
              <div style={{ background: 'var(--bg2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)' }}>🏃 Daily Quest Pacing</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--accent)' }}>{dailyQuestPace} Quests / Day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={dailyQuestPace}
                  onChange={e => setDailyQuestPace && setDailyQuestPace(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--t3)', marginTop: 4 }}>
                  <span>1 (Steady)</span>
                  <span>2 (Balanced)</span>
                  <span>3 (Intensive)</span>
                  <span>4 (Sprint)</span>
                </div>
              </div>

              {/* Slider 2: Mock Interview Target */}
              <div style={{ background: 'var(--bg2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)' }}>🎙️ Mock Interview Target</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--teal)' }}>{interviewScoreTarget}% STAR Score</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="98"
                  step="2"
                  value={interviewScoreTarget}
                  onChange={e => setInterviewScoreTarget && setInterviewScoreTarget(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--teal)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--t3)', marginTop: 4 }}>
                  <span>50% (Baseline)</span>
                  <span>75% (Proficient)</span>
                  <span>90%+ (Top Tier)</span>
                </div>
              </div>

              {/* Slider 3: Gaps Resolved */}
              <div style={{ background: 'var(--bg2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)' }}>🎯 Remedial Gaps Closed</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--green)' }}>{gapsResolvedCount} Closed</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={gapsResolvedCount}
                  onChange={e => setGapsResolvedCount && setGapsResolvedCount(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--green)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--t3)', marginTop: 4 }}>
                  <span>0 Gaps</span>
                  <span>5 Gaps</span>
                  <span>10 Gaps (Full Mastery)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Parallel Industry Archetype Paths */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                🏆 3 Parallel Market Trajectory Archetypes
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>Click an archetype to inspect hiring criteria</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {sim?.paths.map((p, idx) => {
                const isSelected = selectedTwinPath === idx;
                return (
                  <div
                    key={p.id || idx}
                    onClick={() => setSelectedTwinPath(idx)}
                    style={{
                      background: isSelected ? 'var(--accent-light)' : 'var(--bg2)',
                      border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 16,
                      padding: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 14px rgba(79,70,229,0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 26 }}>{p.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6 }}>
                        {p.fitScore}% Fit
                      </span>
                    </div>

                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: isSelected ? 'var(--accent)' : 'var(--t1)' }}>
                      {p.title}
                    </h4>
                    <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{p.companyType}</span>

                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--green)', margin: '4px 0' }}>
                      {p.projectedSalaryRange}
                    </div>

                    <div style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.4 }}>
                      <strong>Timeline:</strong> {p.placementTimelineMonths} Months · <strong>Probability:</strong> {p.probabilityPct}%
                    </div>

                    {/* Criteria Preview */}
                    <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 11.5, color: 'var(--t2)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>Core Gate:</div>
                      <div>• {p.hiringCriteria[0]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Path Deep Dive */}
          {sim?.paths[selectedTwinPath] && (
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={cardLabel}>Detailed Archetype Criteria &amp; Risk Profile</div>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)' }}>
                  {sim.paths[selectedTwinPath].projectedSalaryRange}
                </span>
              </div>

              <h3 style={{ margin: '0 0 6px 0', fontSize: 17, fontWeight: 900 }}>
                {sim.paths[selectedTwinPath].title}
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--t2)', margin: '0 0 14px 0' }}>
                <strong>Strategic Advantage:</strong> {sim.paths[selectedTwinPath].strategicAdvantage}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t1)', textTransform: 'uppercase', marginBottom: 6 }}>
                    📋 Mandatory Hiring Criteria:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                    {sim.paths[selectedTwinPath].hiringCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--coral)', textTransform: 'uppercase', marginBottom: 6 }}>
                    ⚠️ Key Risk &amp; Hurdle:
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                    {sim.paths[selectedTwinPath].keyRisk}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Strategic Sprints */}
          <div style={card}>
            <div style={cardLabel}>🚀 High-Leverage Strategic Action Plan</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {sim?.recommendedSprints.map((sp, idx) => (
                <div key={idx} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>
                    {sp.sprint}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--t2)', marginBottom: 8, lineHeight: 1.4 }}>
                    {sp.focus}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)', background: 'var(--green-light)', padding: '2px 8px', borderRadius: 4 }}>
                    {sp.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
