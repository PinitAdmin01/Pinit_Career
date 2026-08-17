'use client';

import React, { useState } from 'react';
import { LanguageLesson } from '@/lib/language/languageTypes';

interface GrammarLessonViewProps {
  lesson: LanguageLesson;
  onComplete: (scorePct: number) => void;
  onBack: () => void;
}

export const GrammarLessonView: React.FC<GrammarLessonViewProps> = ({
  lesson,
  onComplete,
  onBack
}) => {
  const grammar = lesson.grammarTopic;
  const questions = grammar?.practiceQuestions || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [scoreCount, setScoreCount] = useState(0);

  if (!grammar || questions.length === 0) return <div>No grammar exercises available.</div>;

  const currentQ = questions[currentIdx];
  const correctIdx = currentQ.correctIndex ?? 0;

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    if (idx === correctIdx) {
      setScoreCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      const pct = Math.round((scoreCount / questions.length) * 100);
      onComplete(pct);
    }
  };

  return (
    <div style={{ background: 'var(--bg2, #18181b)', border: '1px solid var(--border, #27272a)', borderRadius: 16, padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          ← Back to Level Roadmap
        </button>
        <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>
          GRAMMAR TOPIC: {grammar.title}
        </span>
      </div>

      {/* Concept Box */}
      <div style={{ background: '#27272a', padding: 16, borderRadius: 12, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, margin: '0 0 8px 0', color: '#10b981' }}>Grammar Rule:</h3>
        <p style={{ fontSize: 14, color: '#e4e4e7', margin: 0 }}>{grammar.ruleExplanation}</p>
        {grammar.patternExamples && grammar.patternExamples.length > 0 && (
          <div style={{ fontSize: 13, color: '#a1a1aa', fontStyle: 'italic', marginTop: 8 }}>
            Pattern Examples: "{grammar.patternExamples.join(' • ')}"
          </div>
        )}
      </div>

      {/* Question Exercise */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', padding: 20, borderRadius: 12 }}>
        <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 8 }}>QUESTION {currentIdx + 1} OF {questions.length}</div>
        <h4 style={{ fontSize: 16, margin: '0 0 16px 0' }}>{currentQ.prompt}</h4>
        {currentQ.sentenceWithBlank && (
          <div style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px 0', color: '#8b5cf6' }}>
            {currentQ.sentenceWithBlank}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedIdx === i;
            const isCorrect = i === correctIdx;
            let bg = '#27272a';
            if (isSelected) {
              bg = isCorrect ? '#065f46' : '#991b1b';
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  background: bg,
                  color: '#fff',
                  border: '1px solid #3f3f46',
                  borderRadius: 8,
                  padding: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selectedIdx !== null && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, color: selectedIdx === correctIdx ? '#10b981' : '#ef4444', marginBottom: 12 }}>
              {selectedIdx === correctIdx ? 'Correct!' : 'Incorrect.'} {currentQ.explanation}
            </div>
            <button
              onClick={handleNext}
              style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}
            >
              {currentIdx < questions.length - 1 ? 'Next Question →' : 'Complete Grammar Module'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
