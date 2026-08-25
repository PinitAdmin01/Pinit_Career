// apps/web/src/components/pathway/CareerPathwayTimeline.tsx
// Visual 4-Semester Progression Timeline, Stage Gate HUD & Milestone Badges

import React, { useState } from 'react';
import {
  CAREER_PROGRAMS_CATALOG,
  evaluateStageProgression,
} from '@/lib/pathway/programEngine';
import {
  CompetencyMasteryStatus,
  MasteryState,
  ProgramStage,
} from '@/lib/pathway/competencySchema';
import { COMPETENCY_CATALOG_V1 } from '@/lib/pathway/competencyCatalog';

interface CareerPathwayTimelineProps {
  activeProgramId?: string;
  masteryMap?: Map<string, CompetencyMasteryStatus>;
  onSelectCompetency?: (competencyId: string) => void;
}

export default function CareerPathwayTimeline({
  activeProgramId = 'prog_software_engineering',
  masteryMap = new Map(),
  onSelectCompetency,
}: CareerPathwayTimelineProps) {
  const [selectedProgramId, setSelectedProgramId] = useState(activeProgramId);
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  const program = CAREER_PROGRAMS_CATALOG.find(p => p.id === selectedProgramId) || CAREER_PROGRAMS_CATALOG[0];
  const stages = program.stages;
  const currentStage = stages[activeStageIdx] || stages[0];
  const nextStage = stages[activeStageIdx + 1];

  const stageResult = evaluateStageProgression(currentStage, nextStage, masteryMap);

  const getCompetencyTitle = (id: string) => {
    const comp = COMPETENCY_CATALOG_V1.find(c => c.id === id);
    return comp ? comp.title : id;
  };

  const getStateBadgeColor = (state: MasteryState) => {
    switch (state) {
      case 'verified':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: '#10b981' };
      case 'verified_needs_review':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: '#f59e0b' };
      case 'demonstrated':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: '#3b82f6' };
      case 'provisional':
      case 'practice':
      case 'learning':
        return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6', border: '#8b5cf6' };
      case 'diagnostic':
        return { bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899', border: '#ec4899' };
      case 'locked':
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', text: 'var(--t3)', border: 'var(--border)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. Program Selector Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px 0', fontFamily: 'var(--font-display)' }}>
            🎓 {program.title}
          </h2>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>
            Target: <strong>{program.targetRole}</strong> • Estimated Duration: <strong>{program.recommendedDurationMonths.standard} Months ({stages.length} Semesters)</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {CAREER_PROGRAMS_CATALOG.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedProgramId(p.id); setActiveStageIdx(0); }}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: selectedProgramId === p.id ? 'var(--accent)' : 'var(--bg2)',
                color: selectedProgramId === p.id ? '#fff' : 'var(--t2)',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {p.cohortTarget === 'final_year'
                ? `⚡ ${p.recommendedDurationMonths.standard}M Full-Stack`
                : p.cohortTarget === 'pre_final_year'
                ? `🎓 24M Fellowship`
                : p.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. Semester Stepper Progress Bar ──────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${stages.length}, 1fr)`,
        gap: 10,
        background: 'var(--bg2)',
        padding: 12,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}>
        {stages.map((st, idx) => {
          const isSelected = activeStageIdx === idx;
          const isFinalResidency = idx === stages.length - 1 && program.hasIndustryResidency;
          const evalResult = evaluateStageProgression(st, stages[idx + 1], masteryMap);

          return (
            <button
              key={st.id}
              onClick={() => setActiveStageIdx(idx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: '12px 14px',
                borderRadius: 10,
                border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                background: isSelected ? 'var(--accent-light)' : 'rgba(255,255,255,0.02)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: isSelected ? 'var(--accent)' : 'var(--t3)', textTransform: 'uppercase' }}>
                  {isFinalResidency ? '👑 Residency' : `Semester ${idx + 1}`}
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: evalResult.isStageCompleted ? '#10b981' : 'var(--t3)' }}>
                  {evalResult.isStageCompleted ? '✓ Passed' : `${evalResult.stageProgressPct}%`}
                </span>
              </div>

              <div style={{ fontSize: 12.5, fontWeight: 700, color: isSelected ? 'var(--t1)' : 'var(--t2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {st.title.split(':')[1] ? st.title.split(':')[1].trim() : st.title}
              </div>

              {/* Mini Progress Track */}
              <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${evalResult.stageProgressPct}%`, height: '100%', background: evalResult.isStageCompleted ? '#10b981' : 'var(--accent)', transition: 'width 0.3s ease' }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 3. Active Semester Stage Details HUD ──────────────────────────────── */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>
              Active Stage Focus • Level {currentStage.stageLevel}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
              {currentStage.title}
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: '4px 0 0 0' }}>
              Planned Duration: <strong>{currentStage.durationMonths} Months</strong> • Requires <strong>{currentStage.requiredCompetencies.length} Competencies</strong> verified.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>Stage Completion</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: stageResult.isStageCompleted ? '#10b981' : 'var(--accent)' }}>
                {stageResult.passedRequiredCompetencies}/{stageResult.totalRequiredCompetencies} Gates
              </div>
            </div>
            {currentStage.milestoneCredentialId && (
              <div style={{
                background: stageResult.isStageCompleted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${stageResult.isStageCompleted ? '#10b981' : 'var(--border)'}`,
                padding: '8px 14px',
                borderRadius: 10,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700 }}>Milestone Badge</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: stageResult.isStageCompleted ? '#10b981' : 'var(--t2)' }}>
                  {stageResult.isStageCompleted ? '🎖️ Unlocked' : '🔒 Locked'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. Stage Required Competency Gates List ─────────────────────────── */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 10 }}>
            Required Competency Gates for Stage Advancement:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentStage.requiredCompetencies.map(req => {
              const status = masteryMap.get(req.competencyId);
              const state = status?.state || 'locked';
              const score = status?.compositeScore || 0;
              const badge = getStateBadgeColor(state);
              const isSatisfied = (req.requiredState === 'verified' ? (state === 'verified' || state === 'verified_needs_review') : (state === 'demonstrated' || state === 'verified' || state === 'verified_needs_review')) && score >= req.minScore;

              return (
                <div
                  key={req.competencyId}
                  onClick={() => onSelectCompetency?.(req.competencyId)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'var(--bg2)',
                    borderRadius: 12,
                    border: `1px solid ${isSatisfied ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                    cursor: onSelectCompetency ? 'pointer' : 'default',
                    transition: 'border 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16 }}>{isSatisfied ? '✅' : '🔒'}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                        {getCompetencyTitle(req.competencyId)}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                        Target: Minimum <strong>{req.minScore}/100</strong> ({req.requiredState.toUpperCase()}) • Current: <strong>{score}/100</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                      textTransform: 'uppercase',
                    }}>
                      {state.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 5. Active Blockers Notice (if any) ──────────────────────────────── */}
        {stageResult.unmetStageCompetencies.length > 0 && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: 14,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
              <strong style={{ color: '#ef4444' }}>Stage Advancement Locked:</strong> You have {stageResult.unmetStageCompetencies.length} unmet competency requirements. Complete the designated quests and forensic labs to unlock Semester {activeStageIdx + 2}.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
