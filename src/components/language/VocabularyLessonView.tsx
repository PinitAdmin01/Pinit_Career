'use client';

import React, { useState } from 'react';
import { LanguageLesson, VocabularyItem } from '@/lib/language/languageTypes';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import { sanitizeForSpeech } from '@/lib/sanitizeLLM';

interface VocabularyLessonViewProps {
  lesson: LanguageLesson;
  onComplete: (scorePct: number) => void;
  onBack: () => void;
  practiceHintPrefix?: string;
}

export const VocabularyLessonView: React.FC<VocabularyLessonViewProps> = ({
  lesson,
  onComplete,
  onBack,
  practiceHintPrefix = '💡 Vocabulary Tip'
}) => {
  const items = lesson.vocabularyItems || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState(false);

  const currentItem: VocabularyItem | undefined = items[currentIndex];

  const playAudio = (text: string) => {
    stopSpeaking();
    const cleanSpeech = sanitizeForSpeech(text);
    speakWithAvatar(cleanSpeech, 'priya', () => {}, () => {});
  };

  const handleSelectOption = (idx: number) => {
    if (!currentItem) return;
    setSelectedOpt(idx);
    const isCorrect = idx === currentItem.quizQuestion.correctIndex;
    setAnswers(prev => ({ ...prev, [currentIndex]: isCorrect }));
  };

  const handleNext = () => {
    setSelectedOpt(null);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
      // Calculate score
      const correctCount = Object.values(answers).filter(Boolean).length;
      const scorePct = Math.round((correctCount / Math.max(1, items.length)) * 100);
      onComplete(scorePct);
    }
  };

  if (!currentItem) return <div>No vocabulary items available.</div>;

  return (
    <div style={{ background: 'var(--bg2, #18181b)', border: '1px solid var(--border, #27272a)', borderRadius: 16, padding: 24, color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          ← Back to Level Roadmap
        </button>
        <span style={{ fontSize: 13, color: '#8b5cf6', fontWeight: 600 }}>
          VOCABULARY WORD {currentIndex + 1} OF {items.length}
        </span>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left Column: Word Details & Pronunciation */}
        <div style={{ background: '#27272a', padding: 20, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#8b5cf6' }}>{currentItem.word}</h2>
            {currentItem.phonetic && <span style={{ fontSize: 14, color: '#a1a1aa' }}>{currentItem.phonetic}</span>}
          </div>
          <p style={{ fontSize: 15, margin: 0, color: '#e4e4e7' }}>{currentItem.meaning}</p>
          <div style={{ background: '#18181b', padding: 12, borderRadius: 8, fontSize: 14, fontStyle: 'italic', borderLeft: '3px solid #8b5cf6' }}>
            "{currentItem.exampleSentence}"
          </div>
          <div style={{ fontSize: 12, color: '#a1a1aa' }}>Category: {currentItem.category}</div>
          
          <button
            onClick={() => playAudio(`${currentItem.word}. ${currentItem.exampleSentence}`)}
            style={{
              background: '#3f3f46',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 8
            }}
          >
            🔊 Listen to Pronunciation (Priya Voice)
          </button>

          <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 4 }}>{practiceHintPrefix}: Repeat the example sentence aloud!</div>
        </div>

        {/* Right Column: Mini Quiz */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>Quick Practice Question:</h3>
          <p style={{ fontSize: 14, color: '#d4d4d8', margin: 0 }}>{currentItem.quizQuestion.question}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {currentItem.quizQuestion.options.map((opt, i) => {
              const isSelected = selectedOpt === i;
              const isCorrect = i === currentItem.quizQuestion.correctIndex;
              let bg = '#27272a';
              if (isSelected) {
                bg = isCorrect ? '#065f46' : '#991b1b';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
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

          {selectedOpt !== null && (
            <button
              onClick={handleNext}
              style={{
                background: '#8b5cf6',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 20px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 8
              }}
            >
              {currentIndex < items.length - 1 ? 'Next Word →' : 'Complete Vocabulary Lesson 🎉'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
