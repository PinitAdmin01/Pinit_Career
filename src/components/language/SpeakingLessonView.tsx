'use client';

import React, { useState, useEffect } from 'react';
import { LanguageLesson } from '@/lib/language/languageTypes';
import { evaluateSpeakingTranscript, SpeakingEvaluationResult } from '@/lib/language/speakingEvaluator';
import { UnifiedSpeechRecognizer } from '@/lib/audio/mobileSTTBuffer';

interface SpeakingLessonViewProps {
  lesson: LanguageLesson;
  onComplete: (scorePct: number) => void;
  onBack: () => void;
}

export const SpeakingLessonView: React.FC<SpeakingLessonViewProps> = ({
  lesson,
  onComplete,
  onBack
}) => {
  const speaking = lesson.speakingExercise;
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [evalResult, setEvalResult] = useState<SpeakingEvaluationResult | null>(null);
  const [sttRecognizer, setSttRecognizer] = useState<UnifiedSpeechRecognizer | null>(null);

  useEffect(() => {
    const recognizer = new UnifiedSpeechRecognizer({
      onInterimTranscript: (text) => setTranscript(text),
      onFinalTranscript: (text) => {
        setTranscript(text);
        setIsRecording(false);
      },
      onError: () => setIsRecording(false)
    });
    setSttRecognizer(recognizer);

    return () => {
      try {
        recognizer.stop();
      } catch {}
    };
  }, []);

  if (!speaking) return <div>No speaking exercise available.</div>;

  const toggleRecording = async () => {
    if (!sttRecognizer) return;
    if (isRecording) {
      sttRecognizer.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setEvalResult(null);
      setIsRecording(true);
      await sttRecognizer.startListening();
    }
  };

  const handleEvaluate = () => {
    const res = evaluateSpeakingTranscript({
      transcript: transcript || speaking.sampleResponse,
      expectedKeywords: speaking.keywordsExpected,
      minWordCount: speaking.minWordCount,
      durationSeconds: 10,
      targetGrammarRule: speaking.targetGrammarRule
    });
    setEvalResult(res);
    onComplete(res.score);
  };

  return (
    <div style={{ background: 'var(--bg2, #18181b)', border: '1px solid var(--border, #27272a)', borderRadius: 16, padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          ← Back to Level Roadmap
        </button>
        <span style={{ fontSize: 13, color: '#ec4899', fontWeight: 600 }}>
          SPEAKING PRACTICE: {speaking.title}
        </span>
      </div>

      {/* Prompt Card */}
      <div style={{ background: '#27272a', padding: 20, borderRadius: 12, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, margin: '0 0 8px 0', color: '#ec4899' }}>Speaking Prompt:</h3>
        <p style={{ fontSize: 15, color: '#fff', fontWeight: 600, margin: '0 0 12px 0' }}>{speaking.promptQuestion}</p>
        <div style={{ fontSize: 13, color: '#a1a1aa', fontStyle: 'italic' }}>
          Sample Sentence: "{speaking.sampleResponse}"
        </div>
      </div>

      {/* Microphone Record Card */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', padding: 24, borderRadius: 12, textAlign: 'center', marginBottom: 20 }}>
        <button
          onClick={toggleRecording}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: isRecording ? '#ef4444' : '#ec4899',
            color: '#fff',
            border: 'none',
            fontSize: 28,
            cursor: 'pointer',
            boxShadow: isRecording ? '0 0 20px #ef4444' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          🎤
        </button>
        <div style={{ fontSize: 14, marginTop: 12, color: isRecording ? '#ef4444' : '#a1a1aa' }}>
          {isRecording ? 'Listening... Speak your response clearly now!' : 'Click Microphone to Start Speaking'}
        </div>

        {/* Live Transcript Box */}
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Speech transcript will appear here..."
          style={{
            width: '100%',
            height: 80,
            marginTop: 16,
            background: '#27272a',
            border: '1px solid #3f3f46',
            borderRadius: 8,
            color: '#fff',
            padding: 12,
            fontSize: 14
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
          <button
            onClick={() => setTranscript(speaking.sampleResponse)}
            style={{
              background: '#3f3f46',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            Use Sample Transcript (Demo)
          </button>
          <button
            onClick={handleEvaluate}
            disabled={!transcript.trim()}
            style={{
              background: transcript.trim() ? '#ec4899' : '#3f3f46',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontWeight: 700,
              cursor: transcript.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Evaluate Speech Response ✨
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evalResult && (
        <div style={{ background: '#27272a', padding: 20, borderRadius: 12 }}>
          <h4 style={{ fontSize: 16, margin: '0 0 12px 0', color: '#10b981' }}>Evaluation Scorecard: {evalResult.score} / 100</h4>
          <p style={{ fontSize: 14, color: '#e4e4e7', margin: '0 0 16px 0' }}>{evalResult.feedbackText}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, fontSize: 13 }}>
            <div style={{ background: '#18181b', padding: 10, borderRadius: 6 }}>Fluency: {evalResult.fluencyScore}%</div>
            <div style={{ background: '#18181b', padding: 10, borderRadius: 6 }}>Keyword Match: {evalResult.keywordMatchPct}%</div>
            <div style={{ background: '#18181b', padding: 10, borderRadius: 6 }}>Pace: ~{evalResult.paceWpm} WPM</div>
          </div>
        </div>
      )}
    </div>
  );
};
