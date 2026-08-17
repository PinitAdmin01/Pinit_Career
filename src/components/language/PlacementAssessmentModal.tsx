'use client';

import React, { useState } from 'react';
import { calculatePlacementResult } from '@/lib/language/placementEngine';
import { LanguageCode, LanguageLevel, PlacementAssessmentResult, SUPPORTED_LANGUAGES } from '@/lib/language/languageTypes';

interface PlacementAssessmentModalProps {
  languageCode?: LanguageCode;
  onClose: () => void;
  onAssessmentComplete: (result: PlacementAssessmentResult) => void;
  currentLevel?: LanguageLevel;
}

export const PlacementAssessmentModal: React.FC<PlacementAssessmentModalProps> = ({
  languageCode = 'en',
  onClose,
  onAssessmentComplete,
  currentLevel = 'PRE_A1'
}) => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [q3, setQ3] = useState(0);
  const [q4, setQ4] = useState(0);
  const [result, setResult] = useState<PlacementAssessmentResult | null>(null);

  const langMeta = SUPPORTED_LANGUAGES[languageCode] || SUPPORTED_LANGUAGES['en'];

  const handleCalculate = () => {
    const vocabScore = q1 * 50;
    const grammarScore = q2 * 50;
    const listeningScore = q3 * 50;
    const speakingScore = q4 * 50;

    const res = calculatePlacementResult(
      {
        languageCode,
        vocabScore,
        grammarScore,
        listeningScore,
        speakingScore
      },
      currentLevel
    );

    setResult(res);
    setStep('result');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 540, borderRadius: 16, padding: 24, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontSize: 18 }}>
          ✕
        </button>

        {step === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{langMeta.flag}</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 10px 0' }}>
              {langMeta.name} Diagnostic Placement Assessment
            </h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 20 }}>
              Determine your starting CEFR level (Pre-A1 through B2) using PinIT's versioned deterministic placement engine.
            </p>
            <button
              onClick={() => setStep('quiz')}
              style={{ padding: '12px 28px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
            >
              Start {langMeta.name} Quiz →
            </button>
          </div>
        )}

        {step === 'quiz' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}>🎯 Quick {langMeta.name} Skill Check</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>1. Vocabulary Level:</label>
              <select value={q1} onChange={e => setQ1(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'var(--t1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value={0}>Basic / Beginner (Pre-A1)</option>
                <option value={1}>Elementary Campus Terms (A1-A2)</option>
                <option value={2}>Fluent Professional / Technical (B1-B2)</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>2. Grammar & Sentence Structure:</label>
              <select value={q2} onChange={e => setQ2(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'var(--t1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value={0}>Simple Subject-Verb Construction</option>
                <option value={1}>Past Tenses & Conditionals</option>
                <option value={2}>Complex Formal Register & Inversion</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>3. Listening Comprehension:</label>
              <select value={q3} onChange={e => setQ3(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'var(--t1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value={0}>Slow, clear greetings</option>
                <option value={1}>Conversational speed</option>
                <option value={2}>Fast technical debates & lectures</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>4. Speaking Articulation:</label>
              <select value={q4} onChange={e => setQ4(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'var(--t1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value={0}>Short single phrases</option>
                <option value={1}>Paragraph answers</option>
                <option value={2}>Executive technical defense</option>
              </select>
            </div>

            <button
              onClick={handleCalculate}
              style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
            >
              Calculate Placement Result ✨
            </button>
          </div>
        )}

        {step === 'result' && result && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
              Assessment Result (v{result.placementVersion})
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--t1)', margin: '10px 0' }}>
              Assessed Level: <span style={{ color: '#10b981' }}>{result.recommendedStartLevel}</span>
            </div>

            <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 20 }}>
              Placement placement verified with {result.confidenceScore}% confidence score.
            </p>

            <button
              onClick={() => onAssessmentComplete(result)}
              style={{ padding: '12px 28px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
            >
              Unlock {result.recommendedStartLevel} Level Roadmap →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
