'use client';

import React, { useState } from 'react';
import { LanguageLesson } from '@/lib/language/languageTypes';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import { sanitizeForSpeech } from '@/lib/sanitizeLLM';

interface ListeningLessonViewProps {
  lesson: LanguageLesson;
  onComplete: (scorePct: number) => void;
  onBack: () => void;
}

export const ListeningLessonView: React.FC<ListeningLessonViewProps> = ({
  lesson,
  onComplete,
  onBack
}) => {
  const listening = lesson.listeningExercise;
  const questions = listening?.questions || [];
  const [hasPlayed, setHasPlayed] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!listening) return <div>No listening exercise available.</div>;

  const playScript = () => {
    stopSpeaking();
    const cleanSpeech = sanitizeForSpeech(listening.narrationScript);
    speakWithAvatar(cleanSpeech, listening.speakerVoice || 'priya', () => {}, () => {});
    setHasPlayed(true);
  };

  const handleSelect = (qIdx: number, optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) correct++;
    });
    const scorePct = Math.round((correct / Math.max(1, questions.length)) * 100);
    setSubmitted(true);
    onComplete(scorePct);
  };

  return (
    <div style={{ background: 'var(--bg2, #18181b)', border: '1px solid var(--border, #27272a)', borderRadius: 16, padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          ← Back to Level Roadmap
        </button>
        <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>
          LISTENING PRACTICE: {listening.title}
        </span>
      </div>

      {/* Audio Player Card */}
      <div style={{ background: '#27272a', padding: 20, borderRadius: 12, textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🎧</div>
        <h3 style={{ fontSize: 16, margin: '0 0 12px 0' }}>Listen to Mentor Narration</h3>
        <button
          onClick={playScript}
          style={{
            background: '#f59e0b',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          ▶ Play Narration (Priya Voice)
        </button>
        {hasPlayed && <div style={{ fontSize: 12, color: '#34d399', marginTop: 8 }}>✓ Audio played. Answer the questions below:</div>}
      </div>

      {/* Comprehension Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {questions.map((q, qIdx) => (
          <div key={qIdx} style={{ background: '#18181b', border: '1px solid #27272a', padding: 16, borderRadius: 12 }}>
            <h4 style={{ fontSize: 15, margin: '0 0 12px 0' }}>{qIdx + 1}. {q.question}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[qIdx] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    style={{
                      background: isSelected ? '#3f3f46' : '#27272a',
                      color: '#fff',
                      border: isSelected ? '1px solid #f59e0b' : '1px solid #3f3f46',
                      borderRadius: 8,
                      padding: 10,
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
          </div>
        ))}

        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            style={{
              background: Object.keys(selectedAnswers).length >= questions.length ? '#10b981' : '#3f3f46',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 20px',
              fontWeight: 700,
              cursor: Object.keys(selectedAnswers).length >= questions.length ? 'pointer' : 'not-allowed',
              marginTop: 12
            }}
          >
            Submit Answers & Complete Listening 🎉
          </button>
        )}
      </div>
    </div>
  );
};
