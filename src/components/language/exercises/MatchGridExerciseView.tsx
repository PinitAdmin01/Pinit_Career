'use client';

import React, { useState } from 'react';
import { MatchGridExercise } from '@/lib/language/languageTypes';
import { evaluateMatchGridPair } from '@/lib/language/exerciseEngine';

interface MatchGridExerciseViewProps {
  exercise: MatchGridExercise;
  onComplete: (scorePct: number) => void;
}

export const MatchGridExerciseView: React.FC<MatchGridExerciseViewProps> = ({
  exercise,
  onComplete
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [selectedNative, setSelectedNative] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [mistakesCount, setMistakesCount] = useState(0);

  const targets = exercise.pairs.map(p => p.target);
  const natives = exercise.pairs.map(p => p.native);

  const handleSelectTarget = (t: string) => {
    if (matchedPairs.includes(t)) return;
    setSelectedTarget(t);
    if (selectedNative) {
      checkPair(t, selectedNative);
    }
  };

  const handleSelectNative = (n: string) => {
    const pairOwner = exercise.pairs.find(p => p.native === n);
    if (pairOwner && matchedPairs.includes(pairOwner.target)) return;

    setSelectedNative(n);
    if (selectedTarget) {
      checkPair(selectedTarget, n);
    }
  };

  const checkPair = (t: string, n: string) => {
    const res = evaluateMatchGridPair(t, n, exercise.pairs, matchedPairs.length);
    if (res.isPairMatched) {
      const updated = [...matchedPairs, t];
      setMatchedPairs(updated);
      setSelectedTarget(null);
      setSelectedNative(null);

      if (updated.length >= exercise.pairs.length) {
        const finalScore = Math.max(0, Math.round(((exercise.pairs.length - mistakesCount) / exercise.pairs.length) * 100));
        setTimeout(() => onComplete(finalScore), 600);
      }
    } else {
      setMistakesCount(prev => prev + 1);
      setTimeout(() => {
        setSelectedTarget(null);
        setSelectedNative(null);
      }, 400);
    }
  };

  return (
    <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: 24, color: '#fff' }}>
      <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600, marginBottom: 8 }}>VOCABULARY MATCH GRID</div>
      <h3 style={{ fontSize: 18, margin: '0 0 16px 0', color: '#f4f4f5' }}>{exercise.prompt}</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Left Column: Target Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 600 }}>TARGET WORDS</div>
          {targets.map((t, idx) => {
            const isMatched = matchedPairs.includes(t);
            const isSelected = selectedTarget === t;
            return (
              <button
                key={idx}
                onClick={() => handleSelectTarget(t)}
                disabled={isMatched}
                style={{
                  background: isMatched ? '#065f46' : isSelected ? '#8b5cf6' : '#27272a',
                  color: isMatched ? '#34d399' : '#fff',
                  border: isSelected ? '2px solid #a78bfa' : '1px solid #3f3f46',
                  borderRadius: 8,
                  padding: 12,
                  fontWeight: 600,
                  fontSize: 15,
                  textAlign: 'left',
                  cursor: isMatched ? 'default' : 'pointer'
                }}
              >
                {t} {isMatched && '✓'}
              </button>
            );
          })}
        </div>

        {/* Right Column: Native Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 600 }}>TRANSLATIONS</div>
          {natives.map((n, idx) => {
            const pairOwner = exercise.pairs.find(p => p.native === n);
            const isMatched = pairOwner && matchedPairs.includes(pairOwner.target);
            const isSelected = selectedNative === n;
            return (
              <button
                key={idx}
                onClick={() => handleSelectNative(n)}
                disabled={!!isMatched}
                style={{
                  background: isMatched ? '#065f46' : isSelected ? '#8b5cf6' : '#27272a',
                  color: isMatched ? '#34d399' : '#fff',
                  border: isSelected ? '2px solid #a78bfa' : '1px solid #3f3f46',
                  borderRadius: 8,
                  padding: 12,
                  fontWeight: 600,
                  fontSize: 15,
                  textAlign: 'left',
                  cursor: isMatched ? 'default' : 'pointer'
                }}
              >
                {n} {isMatched && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: 13, color: '#a1a1aa' }}>
        MATCHED: {matchedPairs.length} / {exercise.pairs.length} PAIRS
      </div>
    </div>
  );
};
