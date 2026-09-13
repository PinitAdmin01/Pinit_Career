import React from 'react';
import { toast } from '@/lib/store/useAppStore';
import { setUserSoundscapeVolume } from '@/lib/audio/soundscapes';

interface LessonHeaderProps {
  questTitle: string;
  isFocusMusicEnabled: boolean;
  setIsFocusMusicEnabled: (enabled: boolean) => void;
  soundscapeVol: number;
  setSoundscapeVol: (vol: number) => void;
  isAudioUnlocked: boolean;
  setIsAudioUnlocked: (unlocked: boolean) => void;
  playSpeech: () => void;
  stopSpeaking: () => void;
  setIsPlaying: (playing: boolean) => void;
  setIsInteractive: (interactive: boolean) => void;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  totalSlides: number;
  isInteractive: boolean;
  examPassed: boolean;
}

export function LessonHeader({
  questTitle,
  isFocusMusicEnabled,
  setIsFocusMusicEnabled,
  soundscapeVol,
  setSoundscapeVol,
  isAudioUnlocked,
  setIsAudioUnlocked,
  playSpeech,
  stopSpeaking,
  setIsPlaying,
  setIsInteractive,
  currentSlide,
  setCurrentSlide,
  totalSlides,
  isInteractive,
  examPassed,
}: LessonHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
      <div>
        <span style={{
          fontSize: 10,
          background: 'rgba(var(--brand-rgb), 0.15)',
          color: 'var(--accent)',
          padding: '4px 10px',
          borderRadius: 20,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Active Class Lesson
        </span>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginTop: 4, fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>
          {questTitle}
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={() => {
              const nextState = !isFocusMusicEnabled;
              setIsFocusMusicEnabled(nextState);
              if (nextState) {
                toast.success("Mindset Focus Soundscape Active", "Playing ambient focus audio tailored to your learning archetype!");
              } else {
                toast.info("Focus Music Off", "Ambient audio muted.");
              }
            }}
            style={{
              background: isFocusMusicEnabled ? 'rgba(var(--brand-rgb),  0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1.5px solid ${isFocusMusicEnabled ? 'var(--accent)' : 'var(--border)'}`,
              color: isFocusMusicEnabled ? 'var(--accent)' : 'var(--t2)',
              borderRadius: 10,
              padding: '4px 10px',
              fontSize: 10.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.2s'
            }}
          >
            🎵 Focus Audio: {isFocusMusicEnabled ? 'ON' : 'OFF'}
          </button>
          {isFocusMusicEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, padding: '2px 8px' }}>
              <span style={{ fontSize: 10, color: 'var(--t2)', fontWeight: 700 }}>🔈 {soundscapeVol}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={soundscapeVol}
                onChange={(e) => {
                  const newVol = parseInt(e.target.value, 10);
                  setSoundscapeVol(newVol);
                  setUserSoundscapeVolume(newVol);
                }}
                style={{ width: 60, accentColor: 'var(--accent)', cursor: 'pointer' }}
                title="Adjust Focus Music Volume"
              />
            </div>
          )}
        </div>
        {!isAudioUnlocked && (
          <button
            onClick={() => {
              setIsAudioUnlocked(true);
              stopSpeaking();
              playSpeech();
              toast.success("Audio Unlocked", "Teacher voice is now active!");
            }}
            style={{
              background: 'rgba(var(--success-rgb),  0.2)',
              border: '1.5px solid #10b981',
              color: 'var(--success)',
              borderRadius: 10,
              padding: '4px 10px',
              fontSize: 10.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              animation: 'pulse 1.5s infinite'
            }}
          >
            🔊 Tap to Unmute Teacher Voice
          </button>
        )}
        <button
          onClick={() => {
            stopSpeaking();
            setIsPlaying(false);
            setIsInteractive(false);
            toast.success("Audio Skipped", "Jumping directly to code execution!");
            const codeEl = document.getElementById('slide-code-execution-block');
            if (codeEl) {
              codeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          style={{
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1.5px solid rgba(234, 179, 8, 0.4)',
            color: '#eab308',
            borderRadius: 10,
            padding: '4px 10px',
            fontSize: 10.5,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'all 0.2s'
          }}
        >
          ⚡ Skip Audio & Jump to Code
        </button>
        <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          Slide {currentSlide + 1} / {totalSlides}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[...Array(totalSlides)].map((_, idx) => {
            const isCurrent = currentSlide === idx;
            const isCompleted = currentSlide > idx;
            const isExam = idx === totalSlides - 1;

            let bg = 'rgba(255,255,255,0.06)';
            let border = '1px solid rgba(255,255,255,0.1)';
            let content = '';

            if (isExam) {
              bg = examPassed ? 'var(--green)' : 'rgba(234,179,8,0.1)';
              border = examPassed ? '1px solid var(--green)' : '1px solid rgba(234,179,8,0.4)';
              content = '⭐';
            } else if (isCompleted) {
              bg = 'var(--success)';
              border = '1px solid #10b981';
            } else if (isCurrent) {
              bg = isInteractive ? 'var(--warning)' : 'var(--accent)';
              border = isInteractive ? '1px solid #f59e0b' : '1px solid var(--accent)';
            }

            return (
              <div
                key={idx}
                title={isExam ? 'Exam Stage' : `Slide ${idx + 1}`}
                onClick={() => {
                  stopSpeaking();
                  setIsPlaying(false);
                  setCurrentSlide(idx);
                }}
                style={{
                  height: 12,
                  width: isExam ? 26 : 32,
                  borderRadius: 6,
                  background: bg,
                  border: border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
