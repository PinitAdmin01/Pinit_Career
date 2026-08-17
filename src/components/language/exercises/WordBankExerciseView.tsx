'use client';

import React, { useState } from 'react';
import { WordBankExercise } from '@/lib/language/languageTypes';
import { evaluateWordBankTokenOrder, prepareShuffledWordBankTokens } from '@/lib/language/exerciseEngine';

interface WordBankExerciseViewProps {
  exercise: WordBankExercise;
  onComplete: (scorePct: number) => void;
}

export const WordBankExerciseView: React.FC<WordBankExerciseViewProps> = ({
  exercise,
  onComplete
}) => {
  const [availableTokens, setAvailableTokens] = useState<string[]>(() =>
    prepareShuffledWordBankTokens(exercise.tokens || exercise.correctTokenOrder)
  );
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; scorePct: number } | null>(null);

  const handleSelectToken = (token: string, idx: number) => {
    if (submitted) return;
    setSelectedTokens(prev => [...prev, token]);
    setAvailableTokens(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDeselectToken = (token: string, idx: number) => {
    if (submitted) return;
    setSelectedTokens(prev => prev.filter((_, i) => i !== idx));
    setAvailableTokens(prev => [...prev, token]);
  };

  const handleCheck = () => {
    const res = evaluateWordBankTokenOrder(selectedTokens, exercise.correctTokenOrder);
    setResult({ isCorrect: res.isCorrect, scorePct: res.scorePct });
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (result) {
      onComplete(result.scorePct);
    }
  };

  return (
    <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: 24, color: '#fff' }}>
      <div style={{ fontSize: 13, color: '#8b5cf6', fontWeight: 600, marginBottom: 8 }}>WORD BANK EXERCISE</div>
      <h3 style={{ fontSize: 18, margin: '0 0 16px 0', color: '#f4f4f5' }}>{exercise.prompt}</h3>

      {/* Selected Token Assembly Area */}
      <div style={{
        minHeight: 60,
        background: '#27272a',
        border: '2px dashed #3f3f46',
        borderRadius: 12,
        padding: 12,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
        marginBottom: 20
      }}>
        {selectedTokens.length === 0 ? (
          <span style={{ color: '#71717a', fontSize: 14 }}>Tap word blocks below to construct sentence...</span>
        ) : (
          selectedTokens.map((t, idx) => (
            <button
              key={idx}
              onClick={() => handleDeselectToken(t, idx)}
              style={{
                background: '#8b5cf6',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))
        )}
      </div>

      {/* Available Choice Tokens */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {availableTokens.map((t, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectToken(t, idx)}
            disabled={submitted}
            style={{
              background: '#27272a',
              color: '#e4e4e7',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: 15,
              cursor: submitted ? 'default' : 'pointer'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Check / Continue Actions */}
      {!submitted ? (
        <button
          onClick={handleCheck}
          disabled={selectedTokens.length === 0}
          style={{
            background: selectedTokens.length > 0 ? '#10b981' : '#3f3f46',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: 15,
            cursor: selectedTokens.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          Check Answer
        </button>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{
            color: result?.isCorrect ? '#10b981' : '#ef4444',
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 12
          }}>
            {result?.isCorrect ? 'Correct Sentence!' : `Incorrect. Target: "${exercise.targetSentence}"`}
          </div>
          <button
            onClick={handleContinue}
            style={{
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer'
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
};
