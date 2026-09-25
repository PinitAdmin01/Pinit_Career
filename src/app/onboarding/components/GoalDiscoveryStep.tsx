// src/app/onboarding/components/GoalDiscoveryStep.tsx
'use client';

import React, { useState } from 'react';
import {
  GOAL_DISCOVERY_QUESTIONS,
  GoalDiscoveryQuestion
} from '@/lib/onboarding/diagnosticRegistry';

export interface GoalDiscoveryData {
  outcome: string;
  role: string;
  secondaryRoles: string[];
  horizonMonths: number;
  motivation: string[];
  exposureLevels: string[];
  capabilitySelfRating: string;
  dailyMinutes: number;
  primaryConstraints: string[];
}

export interface GoalDiscoveryStepProps {
  initialData?: Partial<GoalDiscoveryData>;
  onComplete: (data: GoalDiscoveryData) => void;
  onGoBack?: () => void;
  onBack?: () => void;
}

export default function GoalDiscoveryStep({
  initialData,
  onComplete,
  onGoBack,
  onBack
}: GoalDiscoveryStepProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const [outcome, setOutcome] = useState<string>(initialData?.outcome || 'internship');
  const [role, setRole] = useState<string>(initialData?.role || 'full_stack_developer');
  const [secondaryRoles, setSecondaryRoles] = useState<string[]>(initialData?.secondaryRoles || []);
  const [horizonMonths, setHorizonMonths] = useState<number>(initialData?.horizonMonths ?? 6);
  const [motivation, setMotivation] = useState<string[]>(initialData?.motivation || ['career_placement']);
  const [exposureLevels, setExposureLevels] = useState<string[]>(initialData?.exposureLevels || []);
  const [capabilitySelfRating, setCapabilitySelfRating] = useState<string>(initialData?.capabilitySelfRating || 'guided_builder');
  const [dailyMinutes, setDailyMinutes] = useState<number>(initialData?.dailyMinutes ?? 90);
  const [primaryConstraints, setPrimaryConstraints] = useState<string[]>(initialData?.primaryConstraints || []);

  const questions = GOAL_DISCOVERY_QUESTIONS;
  const currentQ: GoalDiscoveryQuestion = questions[currentIdx] || questions[0];

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onComplete({
        outcome,
        role,
        secondaryRoles,
        horizonMonths,
        motivation,
        exposureLevels,
        capabilitySelfRating,
        dailyMinutes,
        primaryConstraints
      });
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, outcome, role, secondaryRoles, horizonMonths, motivation, exposureLevels, capabilitySelfRating, dailyMinutes, primaryConstraints]);

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    } else if (onGoBack) {
      onGoBack();
    } else if (onBack) {
      onBack();
    }
  };

  const toggleMultiSelect = (val: string, currentList: string[], setter: (v: string[]) => void, maxSelections?: number) => {
    if (currentList.includes(val)) {
      setter(currentList.filter(item => item !== val));
    } else {
      if (maxSelections && currentList.length >= maxSelections) {
        setter([...currentList.slice(1), val]);
      } else {
        setter([...currentList, val]);
      }
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Top Breadcrumb & Stepper */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button
          type="button"
          onClick={handlePrev}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          ← {currentIdx === 0 ? 'Back to Setup' : 'Previous Step'}
        </button>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'rgba(var(--brand-rgb), 0.12)', border: '1px solid rgba(var(--brand-rgb), 0.25)', borderRadius: 100, padding: '4px 12px', fontWeight: 800 }}>
          GOAL DISCOVERY &middot; STEP {currentIdx + 1} OF {questions.length}
        </div>
      </div>

      {/* Progress Line */}
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
        <div
          style={{
            width: `${((currentIdx + 1) / questions.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--brand) 0%, var(--teal) 100%)',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {/* Question Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.5px', marginBottom: 6 }}>
          {currentQ.title}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5 }}>
          {currentQ.subtitle}
        </p>
      </div>

      {/* Options Rendering per Question Type */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {/* Q1: Outcome */}
        {currentQ.id === 'Q1_OUTCOME' && currentQ.options.map(opt => {
          const isSelected = outcome === opt.mappedValue;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => { setOutcome(opt.mappedValue as string); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 14,
                background: isSelected ? 'rgba(var(--brand-rgb), 0.16)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--brand-bright)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? 'var(--brand-bright)' : 'var(--t1)' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--brand-bright)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-bright)' }} />}
              </div>
            </button>
          );
        })}

        {/* Q2: Primary Role */}
        {currentQ.id === 'Q2_PRIMARY_ROLE' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {currentQ.options.map(opt => {
              const isSelected = role === opt.mappedValue;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { setRole(opt.mappedValue as string); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: isSelected ? 'rgba(var(--brand-rgb), 0.18)' : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.06)'}`,
                    textAlign: 'left',
                    cursor: 'pointer',
                    minHeight: 80,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: isSelected ? 'var(--accent)' : 'var(--t1)', marginBottom: 4 }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.4 }}>
                    {opt.description}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Q3: Horizon */}
        {currentQ.id === 'Q3_HORIZON' && currentQ.options.map(opt => {
          const isSelected = horizonMonths === Number(opt.mappedValue);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => { setHorizonMonths(Number(opt.mappedValue)); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 14,
                background: isSelected ? 'rgba(var(--teal-rgb, 20, 184, 166), 0.16)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--teal)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? 'var(--teal)' : 'var(--t1)' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--teal)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--teal)' }} />}
              </div>
            </button>
          );
        })}

        {/* Q4: Motivation */}
        {currentQ.id === 'Q4_MOTIVATION' && currentQ.options.map(opt => {
          const isSelected = motivation.includes(opt.mappedValue as string);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleMultiSelect(opt.mappedValue as string, motivation, setMotivation)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderRadius: 12,
                background: isSelected ? 'rgba(var(--brand-rgb), 0.16)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--brand-bright)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? 'var(--brand-bright)' : 'var(--t1)' }}>{opt.label}</span>
              <span style={{ fontSize: 14 }}>{isSelected ? '✓' : ''}</span>
            </button>
          );
        })}

        {/* Q5: Prior Experience */}
        {currentQ.id === 'Q5_EXPERIENCE' && currentQ.options.map(opt => {
          const isSelected = exposureLevels.includes(opt.mappedValue as string);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleMultiSelect(opt.mappedValue as string, exposureLevels, setExposureLevels)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 12,
                background: isSelected ? 'rgba(var(--accent-rgb), 0.16)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--t1)' }}>{opt.label}</span>
              <span style={{ fontSize: 14, color: 'var(--accent)' }}>{isSelected ? '✓' : '+'}</span>
            </button>
          );
        })}

        {/* Q6: Capability */}
        {currentQ.id === 'Q6_CAPABILITY' && currentQ.options.map(opt => {
          const isSelected = capabilitySelfRating === opt.mappedValue;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setCapabilitySelfRating(opt.mappedValue as string)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 14,
                background: isSelected ? 'rgba(var(--brand-rgb), 0.16)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--brand-bright)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: 13.5, fontWeight: 700, color: isSelected ? 'var(--brand-bright)' : 'var(--t1)' }}>{opt.label}</span>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--brand-bright)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-bright)' }} />}
              </div>
            </button>
          );
        })}

        {/* Q7: Daily Time Budget */}
        {currentQ.id === 'Q7_TIME_BUDGET' && currentQ.options.map(opt => {
          const isSelected = dailyMinutes === Number(opt.mappedValue);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDailyMinutes(Number(opt.mappedValue))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 14,
                background: isSelected ? 'rgba(var(--teal-rgb, 20, 184, 166), 0.16)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${isSelected ? 'var(--teal)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? 'var(--teal)' : 'var(--t1)' }}>{opt.label}</div>
                {opt.description && <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>{opt.description}</div>}
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--teal)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--teal)' }} />}
              </div>
            </button>
          );
        })}

        {/* Q8: Constraints (Max 3) */}
        {currentQ.id === 'Q8_PRIMARY_CONSTRAINTS' && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 8, fontStyle: 'italic' }}>
              Selected: {primaryConstraints.length} / 3 max
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentQ.options.map(opt => {
                const isSelected = primaryConstraints.includes(opt.mappedValue as string);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleMultiSelect(opt.mappedValue as string, primaryConstraints, setPrimaryConstraints, 3)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: isSelected ? 'rgba(var(--danger-rgb, 239, 68, 68), 0.14)' : 'rgba(255,255,255,0.02)',
                      border: `1.5px solid ${isSelected ? 'var(--coral)' : 'rgba(255,255,255,0.06)'}`,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? 'var(--coral)' : 'var(--t1)' }}>{opt.label}</span>
                    <span style={{ fontSize: 13 }}>{isSelected ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleNext}
          style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, var(--brand) 0%, var(--teal) 100%)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--card)',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(var(--brand-rgb), 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {currentIdx === questions.length - 1 ? 'Proceed to Behavioral Assessment ➔' : 'Continue ➔'}
        </button>
      </div>
    </div>
  );
}
