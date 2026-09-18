'use client';

import React from 'react';
import {
  getIdentityQuestions,
  WORKPLACE_SCENARIOS,
  WORKPLACE_SCENARIOS_BUSINESS
} from '../types';

export interface CognitiveSlidersProps {
  mode: 'SLIDER' | 'IDENTITY_QUESTIONS' | 'WORKPLACE_SIMULATION';
  studentType: string;
  onGoBack?: () => void;
  // Mode: SLIDER
  currentAbility?: number;
  setCurrentAbility?: (val: number) => void;
  targetAmbition?: number;
  setTargetAmbition?: (val: number) => void;
  sliderDialogue?: string;
  onProceedFromSlider?: () => void;
  // Mode: IDENTITY_QUESTIONS
  currentIdentityQ?: number;
  setCurrentIdentityQ?: (fn: (prev: number) => number) => void;
  identityScores?: Record<string, number>;
  setIdentityScores?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onCompleteIdentity?: () => void;
  // Mode: WORKPLACE_SIMULATION
  currentScenario?: number;
  setCurrentScenario?: (fn: (prev: number) => number) => void;
  setSimulationScores?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onCompleteSimulation?: () => void;
}

export default function CognitiveSliders(props: CognitiveSlidersProps) {
  const {
    mode,
    studentType,
    onGoBack,
    currentAbility = 35,
    setCurrentAbility,
    targetAmbition = 85,
    setTargetAmbition,
    sliderDialogue = '',
    onProceedFromSlider,
    currentIdentityQ = 0,
    setCurrentIdentityQ,
    identityScores = { logic: 50, pace: 50 },
    setIdentityScores,
    onCompleteIdentity,
    currentScenario = 0,
    setCurrentScenario,
    setSimulationScores,
    onCompleteSimulation
  } = props;

  // 1. Evolution Gap Slider Screen
  if (mode === 'SLIDER') {
    return (
      <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        {onGoBack && (
          <button
            type="button"
            onClick={onGoBack}
            style={{ background: 'transparent', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 12, alignSelf: 'flex-start', marginBottom: 20 }}
          >
            ← Go Back
          </button>
        )}

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8, letterSpacing: '-0.5px' }}>
            Define Your Evolution Gap
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5 }}>
            Slide to indicate your estimated current skill level compared to your dream placement ambition. This initializes the roadmap density calculations.
          </p>
        </div>

        {/* Slider Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
          {/* Current Skill Ability */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              <span style={{ color: 'var(--t3)' }}>Current Technical Ability</span>
              <span style={{ color: 'var(--accent)' }}>{currentAbility}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={currentAbility}
              onChange={(e) => setCurrentAbility && setCurrentAbility(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--t2)', marginTop: 4 }}>
              <span>Novice</span>
              <span>Intermediate</span>
              <span>Advanced</span>
            </div>
          </div>

          {/* Target Career Ambition */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              <span style={{ color: 'var(--t3)' }}>Target Career Ambition</span>
              <span style={{ color: 'var(--teal)' }}>{targetAmbition}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              value={targetAmbition}
              onChange={(e) => setTargetAmbition && setTargetAmbition(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--t2)', marginTop: 4 }}>
              <span>Competent (60%)</span>
              <span>Top-Tier (85%)</span>
              <span>Legendary (100%)</span>
            </div>
          </div>
        </div>

        {/* Calculations Box */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, padding: 18, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600 }}>The Verification Gap:</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--coral)', fontFamily: 'var(--font-mono)' }}>
              {targetAmbition - currentAbility}%
            </span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${targetAmbition - currentAbility}%`, background: 'linear-gradient(90deg, var(--coral), var(--accent))', borderRadius: 3 }} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 12, lineHeight: 1.5, fontStyle: 'italic' }}>
            {sliderDialogue}
          </p>
        </div>

        {onProceedFromSlider && (
          <button
            type="button"
            onClick={onProceedFromSlider}
            style={{
              width: '100%',
              height: 46,
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
              border: 'none',
              borderRadius: 12,
              color: 'var(--card)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(var(--brand-rgb), 0.25)',
              transition: 'transform 0.15s ease'
            }}
          >
            Proceed to Diagnostic Questionnaire
          </button>
        )}
      </div>
    );
  }

  // 2. Identity Questions Screen
  if (mode === 'IDENTITY_QUESTIONS') {
    const identityQs = getIdentityQuestions(studentType);
    const q = identityQs[Math.min(currentIdentityQ, identityQs.length - 1)];

    return (
      <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
          <span>Identity Discovery</span>
          <span>Slide {currentIdentityQ + 1} of {identityQs.length}</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
            {q.category}
          </h3>
          <p style={{ fontSize: 15, color: 'var(--t1)', lineHeight: 1.6, fontWeight: 600 }}>
            {q.text}
          </p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <input
            type="range"
            min="0"
            max="100"
            value={identityScores[q.id] || 50}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setIdentityScores && setIdentityScores(prev => ({ ...prev, [q.id]: val }));
            }}
            style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', height: 6 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t3)', marginTop: 12, fontWeight: 700 }}>
            <span>← {q.left}</span>
            <span>{identityScores[q.id] || 50}%</span>
            <span>{q.right} →</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentIdentityQ < identityQs.length - 1) {
              setCurrentIdentityQ && setCurrentIdentityQ(prev => prev + 1);
            } else if (onCompleteIdentity) {
              onCompleteIdentity();
            }
          }}
          style={{
            width: '100%',
            height: 44,
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--card)',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(var(--brand-rgb), 0.25)'
          }}
        >
          {currentIdentityQ < identityQs.length - 1 ? 'Save & Slide Next' : 'Proceed to Simulations'}
        </button>
      </div>
    );
  }

  // 3. Workplace Simulation Screen
  if (mode === 'WORKPLACE_SIMULATION') {
    const isBusinessStream = studentType.includes('Commerce') || studentType.includes('Management') || studentType.includes('BBA') || studentType.includes('B.Com');
    const activeScenarios = isBusinessStream ? WORKPLACE_SCENARIOS_BUSINESS : WORKPLACE_SCENARIOS;
    const scenario = activeScenarios[Math.min(currentScenario, activeScenarios.length - 1)];

    return (
      <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
          <span>{isBusinessStream ? 'Business & Leadership Simulation' : 'Technical & Engineering Simulation'}</span>
          <span>Card {currentScenario + 1} of {activeScenarios.length}</span>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>
            {scenario.title}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6 }}>
            {scenario.text}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {scenario.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (setSimulationScores) {
                  setSimulationScores(prev => {
                    const updated = { ...prev };
                    Object.entries(opt.scores).forEach(([trait, val]) => {
                      updated[trait] = (updated[trait] || 0) + (val as number);
                    });
                    return updated;
                  });
                }

                if (currentScenario < activeScenarios.length - 1) {
                  setCurrentScenario && setCurrentScenario(prev => prev + 1);
                } else if (onCompleteSimulation) {
                  onCompleteSimulation();
                }
              }}
              style={{
                padding: 14,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                color: 'var(--t1)',
                fontSize: 12.5,
                fontWeight: 650,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.04)';
                e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
