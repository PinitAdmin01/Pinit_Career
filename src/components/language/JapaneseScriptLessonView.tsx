'use client';

import React, { useState } from 'react';
import { LanguageLesson, KanaCharacter, JapaneseDisplayMode, JapaneseScriptIntent } from '@/lib/language/languageTypes';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import { sanitizeForSpeech } from '@/lib/sanitizeLLM';

interface JapaneseScriptLessonViewProps {
  lesson: LanguageLesson;
  onComplete: (scorePct: number) => void;
  onBack: () => void;
}

export const JapaneseScriptLessonView: React.FC<JapaneseScriptLessonViewProps> = ({
  lesson,
  onComplete,
  onBack
}) => {
  const characters = lesson.kanaCharacters || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayMode, setDisplayMode] = useState<JapaneseDisplayMode>('kanji_furigana');
  const [activeIntent, setActiveIntent] = useState<JapaneseScriptIntent>('recognition');

  const currentChar: KanaCharacter | undefined = characters[currentIndex];

  const playAudio = (text: string) => {
    stopSpeaking();
    const cleanSpeech = sanitizeForSpeech(text);
    speakWithAvatar(cleanSpeech, 'ja-JP', () => {}, () => {});
  };

  const handleNext = () => {
    if (currentIndex < characters.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(100);
    }
  };

  if (!currentChar) return <div>No Japanese characters available in this lesson.</div>;

  const currentIntent: JapaneseScriptIntent = currentChar.intent || activeIntent;

  return (
    <div style={{ padding: 20, maxWidth: 680, margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          ← Back to Roadmaps
        </button>
        <span style={{ fontSize: 13, color: '#ec4899', fontWeight: 600 }}>
          INTENT: {currentIntent.toUpperCase()}
        </span>
      </div>

      {/* Script Mode Selector Toolbar */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: 8, display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['romaji', 'kana', 'kanji_furigana'] as JapaneseDisplayMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setDisplayMode(mode)}
            style={{
              flex: 1,
              background: displayMode === mode ? '#8b5cf6' : '#27272a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {mode === 'romaji' ? '🔤 Romaji' : mode === 'kana' ? '🇯🇵 Kana' : '漢字 Kanji+Furigana'}
          </button>
        ))}
      </div>

      {/* Character Display Card */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', marginBottom: 8 }}>
          JAPANESE SCRIPT ({currentIndex + 1} / {characters.length}) — {currentChar.type.toUpperCase()}
        </div>

        {/* Display Text according to Mode */}
        <div style={{ margin: '20px 0' }}>
          {displayMode === 'romaji' ? (
            <div style={{ fontSize: 48, fontWeight: 800, color: '#38bdf8' }}>{currentChar.romaji}</div>
          ) : displayMode === 'kana' ? (
            <div style={{ fontSize: 80, fontWeight: 900, color: '#ec4899', fontFamily: 'serif' }}>{currentChar.character}</div>
          ) : (
            <div>
              {currentChar.furigana && (
                <div style={{ fontSize: 20, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>{currentChar.furigana}</div>
              )}
              <div style={{ fontSize: 80, fontWeight: 900, color: '#f4f4f5', fontFamily: 'serif' }}>{currentChar.character}</div>
            </div>
          )}
        </div>

        <div style={{ fontSize: 18, color: '#e4e4e7', fontWeight: 600, marginBottom: 12 }}>
          Meaning: {currentChar.meaning || currentChar.romaji}
        </div>

        {currentChar.strokeOrderHint && (
          <div style={{ fontSize: 13, color: '#a1a1aa', fontStyle: 'italic', marginBottom: 20 }}>
            Stroke Hint: {currentChar.strokeOrderHint}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            onClick={() => playAudio(currentChar.audioText || currentChar.character)}
            style={{ background: '#27272a', color: '#fff', border: '1px solid #3f3f46', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer' }}
          >
            🔊 Audio Drill
          </button>
          <button
            onClick={handleNext}
            style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}
          >
            {currentIndex < characters.length - 1 ? 'Next Character →' : 'Complete Script Module'}
          </button>
        </div>
      </div>
    </div>
  );
};
