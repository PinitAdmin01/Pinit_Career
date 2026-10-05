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
  maxUnlockedSlide?: number;
  /** A test after 5 days: no teaching slides, so no "skip to code". */
  isTest?: boolean;
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
  maxUnlockedSlide = 0,
  isTest = false,
}: LessonHeaderProps) {
  return (
    <div className="lesson-header-root">
      <style>{`
        .lesson-header-root {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          flex-shrink: 0;
          gap: 10px;
          width: 100%;
          min-width: 0;
          overflow-x: hidden;
        }
        .lesson-header-controls {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 6px;
          min-width: 0;
          width: 100%;
        }
        .lesson-header-btn-row {
          display: flex;
          gap: 6px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-start;
          width: 100%;
        }
        .lesson-progress-pills-row {
          display: flex;
          align-items: center;
          gap: 3px;
          max-width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .lesson-progress-pill {
          height: 10px;
          flex: 1 1 0px;
          width: auto;
          min-width: 8px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) {
          .lesson-header-root {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
          }
          .lesson-header-controls {
            align-items: flex-end;
            width: auto;
          }
          .lesson-header-btn-row {
            justify-content: flex-end;
            width: auto;
          }
          .lesson-progress-pill {
            flex: 0 1 24px;
            width: 24px;
            min-width: 12px;
          }
        }
      `}</style>
      <div>
        <span style={{
          fontSize: 11,
          background: 'rgba(var(--brand-rgb), 0.15)',
          color: 'var(--accent)',
          padding: '4px 10px',
          borderRadius: 20,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {isTest ? 'Test' : 'Lesson'}
        </span>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginTop: 4, fontFamily: 'var(--font-display)', letterSpacing: '-0.3px', lineHeight: 1.25 }}>
          {questTitle}
        </h2>
      </div>
      <div className="lesson-header-controls">
        <div className="lesson-header-btn-row">
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
              fontSize: 11.5,
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
              <span style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 700 }}>🔈 {soundscapeVol}%</span>
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
              border: '1.5px solid var(--success)',
              color: 'var(--success)',
              borderRadius: 10,
              padding: '4px 10px',
              fontSize: 11.5,
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
        {!isTest && (
        <button
          onClick={() => {
            stopSpeaking();
            setIsPlaying(false);
            setIsInteractive(false);
            toast.success("Audio skipped", "Jumping to the code.");
            const codeEl = document.getElementById('slide-code-execution-block');
            if (codeEl) {
              codeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          style={{
            background: 'rgba(var(--warning-rgb), 0.15)',
            border: '1.5px solid rgba(var(--warning-rgb), 0.4)',
            color: 'var(--warning)',
            borderRadius: 10,
            padding: '4px 10px',
            fontSize: 11.5,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'all 0.2s'
          }}
        >
          ⚡ Skip to the code
        </button>
        )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            Slide {currentSlide + 1} / {totalSlides}
          </span>
          <div className="lesson-progress-pills-row">
            {[...Array(totalSlides)].map((_, idx) => {
              const isCurrent = currentSlide === idx;
              const isCompleted = currentSlide > idx;
              const isExam = idx === totalSlides - 1;
              const isLocked = idx > maxUnlockedSlide;

              let bg = 'rgba(255,255,255,0.06)';
              let border = '1px solid rgba(255,255,255,0.1)';
              let content = '';

              if (isExam) {
                bg = examPassed ? 'var(--green)' : isLocked ? 'rgba(255,255,255,0.03)' : 'rgba(var(--warning-rgb), 0.1)';
                border = examPassed ? '1px solid var(--green)' : isLocked ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(var(--warning-rgb), 0.4)';
                content = isLocked ? '🔒' : '⭐';
              } else if (isCompleted) {
                bg = 'var(--success)';
                border = '1px solid var(--success)';
              } else if (isCurrent) {
                bg = isInteractive ? 'var(--warning)' : 'var(--accent)';
                border = isInteractive ? '1px solid var(--warning)' : '1px solid var(--accent)';
              } else if (isLocked) {
                bg = 'rgba(255,255,255,0.02)';
                border = '1px solid rgba(255,255,255,0.04)';
              }

              return (
                <div
                  key={idx}
                  className="lesson-progress-pill"
                  title={isExam ? (isLocked ? 'Exam Locked (Complete earlier slides)' : 'Exam Stage') : isLocked ? `Slide ${idx + 1} (Locked)` : `Slide ${idx + 1}`}
                  onClick={() => {
                    if (isLocked) {
                      if (isExam) {
                        toast.warning("Exam Locked 🔒", "Complete all lesson slides and concept checks before taking the final exam.");
                      } else {
                        toast.info("Slide Locked 🔒", "Complete earlier slides before advancing to this stage.");
                      }
                      return;
                    }
                    stopSpeaking();
                    setIsPlaying(false);
                    setCurrentSlide(idx);
                  }}
                  style={{
                    background: bg,
                    border: border,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.35 : 1,
                  }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
