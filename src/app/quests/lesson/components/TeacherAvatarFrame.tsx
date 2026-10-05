import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AvatarMentorWidget = dynamic(() => import('@/components/avatar/AvatarMentorWidget'), {
  ssr: false,
});

export interface LessonQuestData {
  id?: string;
  title?: string;
  desc?: string;
  syllabus?: string[];
  testDays?: string[];
  type?: string;
  language?: string;
  [key: string]: unknown;
}

export interface TeacherAvatarFrameProps {
  userId: string;
  teacherId: string;
  teacher: {
    name: string;
    avatar: string;
    accent: string;
    role?: string;
  };
  isPlaying: boolean;
  speechText: string;
  questData: LessonQuestData | null | undefined;
}

export function TeacherAvatarFrame({
  userId,
  teacherId,
  teacher,
  isPlaying,
  speechText,
  questData,
}: TeacherAvatarFrameProps): React.ReactElement {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsMinimized(true);
      }
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const shouldShowBubble = isMinimized || isMobile;

  if (shouldShowBubble) {
    return (
      <div
        onClick={() => {
          if (!isMobile) {
            setIsMinimized(false);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={isMobile ? `Tutor ${teacher.name}` : `Expand tutor ${teacher.name}`}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isMobile) {
            e.preventDefault();
            setIsMinimized(false);
          }
        }}
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(15, 23, 42, 0.95)',
          border: `2px solid ${isPlaying ? (teacher.accent || 'var(--accent)') : 'var(--border)'}`,
          boxShadow: isPlaying
            ? `0 0 12px var(--accent), 0 4px 16px rgba(0, 0, 0, 0.5)`
            : '0 4px 16px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isMobile ? 'default' : 'pointer',
          zIndex: 50,
          transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
        }}
        title={isMobile ? teacher.name : 'Click to expand avatar frame'}
      >
        <span style={{ fontSize: '22px', userSelect: 'none' }}>{teacher.avatar || '👨‍🏫'}</span>

        {/* Pulsing voice ring when speaking */}
        {isPlaying && (
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--success)',
              border: '2px solid rgba(15, 23, 42, 0.95)',
            }}
          />
        )}
      </div>
    );
  }

  // Desktop expanded frame (220px × 165px)
  return (
    <div
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        width: '220px',
        height: '165px',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        border: `1.5px solid ${isPlaying ? (teacher.accent || 'var(--accent)') : 'var(--border)'}`,
        boxShadow: isPlaying
          ? '0 0 16px color-mix(in srgb, var(--accent) 30%, transparent), 0 8px 32px rgba(0, 0, 0, 0.6)'
          : '0 8px 32px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 50,
        transition: 'border-color 300ms ease, box-shadow 300ms ease',
      }}
      aria-label={`Tutor screen: ${teacher.name}`}
    >
      {/* Frame Top Header */}
      <div
        style={{
          height: '28px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.35)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isPlaying ? 'var(--success)' : 'var(--text-muted)',
              boxShadow: isPlaying ? '0 0 6px var(--success)' : 'none',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--t1)',
              letterSpacing: '0.02em',
            }}
          >
            {teacher.name}
          </span>
        </div>

        {/* Minimize Button */}
        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '13px',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Minimise avatar screen"
          title="Minimise to bubble"
        >
          −
        </button>
      </div>

      {/* Avatar Container */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <AvatarMentorWidget
          userId={userId}
          teacherId={teacherId}
          onlyAvatar={true}
          speaking={isPlaying}
          speechText={speechText}
          activeQuest={questData}
        />

        {/* Audio Waveform Indicator when speaking */}
        {isPlaying && (
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              background: 'rgba(15, 23, 42, 0.75)',
              padding: '2px 8px',
              borderRadius: '10px',
              backdropFilter: 'blur(4px)',
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '2px',
                  height: '10px',
                  background: teacher.accent,
                  borderRadius: '1px',
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
