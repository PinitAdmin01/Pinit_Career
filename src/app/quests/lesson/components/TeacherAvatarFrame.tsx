import React from 'react';
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

/**
 * Spec v1.1 Rule:
 * Docked teacher avatar frame inside the bottom navigation bar.
 * Never floats over the page or overlaps any buttons/links.
 */
export function TeacherAvatarFrame({
  userId,
  teacherId,
  teacher,
  isPlaying,
  speechText,
  questData,
}: TeacherAvatarFrameProps): React.ReactElement {
  return (
    <div
      className="teacher-avatar-docked-frame"
      data-testid="teacher-avatar-dock"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 10px 4px 6px',
        borderRadius: '24px',
        background: 'var(--bg2)',
        border: `1.5px solid ${isPlaying ? (teacher.accent || 'var(--accent)') : 'var(--border)'}`,
        boxShadow: isPlaying
          ? '0 0 12px color-mix(in srgb, var(--accent) 25%, transparent)'
          : 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        height: '42px',
        boxSizing: 'border-box',
      }}
      aria-label={`Tutor: ${teacher.name}`}
    >
      <style>{`
        .teacher-avatar-docked-info {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        @media (max-width: 639px) {
          .teacher-avatar-docked-info {
            display: none !important;
          }
          .teacher-avatar-docked-waveform {
            display: none !important;
          }
          .teacher-avatar-docked-frame {
            padding: 2px !important;
            border-radius: 50% !important;
            width: 38px !important;
            height: 38px !important;
            justify-content: center !important;
          }
        }
      `}</style>

      {/* Avatar Face / Emoji */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '18px', userSelect: 'none' }}>
          {teacher.avatar || '👨‍🏫'}
        </span>

        {/* Live speaking indicator dot */}
        {isPlaying && (
          <span
            style={{
              position: 'absolute',
              top: '1px',
              right: '1px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--success)',
              boxShadow: '0 0 4px var(--success)',
            }}
          />
        )}
      </div>

      {/* Teacher Name & Status (Desktop / Tablet) */}
      <div className="teacher-avatar-docked-info">
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 800,
            color: 'var(--t1)',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          {teacher.name}
        </span>
        <span
          style={{
            fontSize: '9.5px',
            fontWeight: 600,
            color: isPlaying ? 'var(--success)' : 'var(--text-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          {isPlaying ? 'Speaking...' : 'Tutor'}
        </span>
      </div>

      {/* Mini Waveform (when speaking) */}
      {isPlaying && (
        <div
          className="teacher-avatar-docked-waveform"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            paddingLeft: '4px',
          }}
          aria-hidden="true"
        >
          {[0.6, 1, 0.7, 0.4].map((scale, i) => (
            <div
              key={i}
              style={{
                width: '2px',
                height: `${12 * scale}px`,
                background: teacher.accent || 'var(--accent)',
                borderRadius: '1px',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
