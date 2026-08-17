'use client';

import React, { useState } from 'react';
import { TypeAnswerExercise, LanguageCode } from '@/lib/language/languageTypes';
import { evaluateTypeAnswerInput } from '@/lib/language/exerciseEngine';
import { StringMatchResult } from '@/lib/language/stringMatcher';

interface TypeAnswerExerciseViewProps {
  exercise: TypeAnswerExercise;
  languageCode?: LanguageCode;
  onComplete: (scorePct: number) => void;
}

export const TypeAnswerExerciseView: React.FC<TypeAnswerExerciseViewProps> = ({
  exercise,
  languageCode = 'en',
  onComplete
}) => {
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [matchResult, setMatchResult] = useState<StringMatchResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || submitted) return;

    const res = evaluateTypeAnswerInput(
      userInput,
      exercise.targetAnswer,
      exercise.alternativeAnswers || [],
      exercise.exerciseCategory || 'vocabulary',
      languageCode
    );

    setMatchResult(res);
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (matchResult) {
      onComplete(matchResult.isMatch ? 100 : 0);
    }
  };

  return (
    <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: 24, color: '#fff' }}>
      <div style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600, marginBottom: 8 }}>TYPING & TRANSLATION EXERCISE</div>
      <h3 style={{ fontSize: 18, margin: '0 0 16px 0', color: '#f4f4f5' }}>{exercise.prompt}</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={submitted}
          placeholder="Type your answer in target language..."
          style={{
            width: '100%',
            background: '#27272a',
            border: '1px solid #3f3f46',
            borderRadius: 8,
            padding: '12px 16px',
            color: '#fff',
            fontSize: 16,
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {!submitted && (
          <button
            type="submit"
            disabled={!userInput.trim()}
            style={{
              marginTop: 16,
              background: userInput.trim() ? '#3b82f6' : '#3f3f46',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: 15,
              cursor: userInput.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Submit Answer
          </button>
        )}
      </form>

      {submitted && matchResult && (
        <div style={{ background: '#27272a', padding: 16, borderRadius: 12, marginBottom: 20 }}>
          <div style={{
            color: matchResult.isMatch ? '#10b981' : '#ef4444',
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 8
          }}>
            {matchResult.isMatch ? 'Correct Match!' : 'Needs Revision.'}
          </div>
          <div style={{ fontSize: 14, color: '#e4e4e7' }}>
            Target Answer: <strong>"{matchResult.matchedAnswer}"</strong>
          </div>
          <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 4 }}>
            Similarity: {matchResult.similarityPct}% | Policy Applied: {matchResult.policyApplied}
          </div>

          <button
            onClick={handleContinue}
            style={{
              marginTop: 16,
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
