'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ambientAudio } from '@/lib/audio/ambientAudioEngine';
import { getAvatarVoiceVolume, setAvatarVoiceVolume } from '@/lib/tts';

interface GearAudioHubProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export default function GearAudioHub({
  theme = 'dark',
  size = 'md',
  className = '',
  style = {}
}: GearAudioHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(50); // 0 to 100
  const [avatarVolume, setAvatarVolume] = useState(85);   // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initial values
    setAmbientVolume(Math.round(ambientAudio.getVolume() * 100));
    setAvatarVolume(Math.round(getAvatarVoiceVolume() * 100));
    setIsMuted(ambientAudio.isMuted());

    const savedAnim = localStorage.getItem('pc_animations_enabled');
    setAnimationsEnabled(savedAnim !== 'false');

    // Listen to external volume/mute/animation events
    const handleAmbientVolumeChange = (e: any) => {
      if (typeof e.detail?.volume === 'number') {
        setAmbientVolume(Math.round(e.detail.volume * 100));
      }
    };
    const handleAvatarVolumeChange = (e: any) => {
      if (typeof e.detail?.volume === 'number') {
        setAvatarVolume(Math.round(e.detail.volume * 100));
      }
    };
    const handleMuteChange = (e: any) => {
      if (typeof e.detail?.muted === 'boolean') {
        setIsMuted(e.detail.muted);
      }
    };
    const handleAnimationChange = (e: any) => {
      if (typeof e.detail?.enabled === 'boolean') {
        setAnimationsEnabled(e.detail.enabled);
      }
    };

    window.addEventListener('pc_audio_volume_changed', handleAmbientVolumeChange);
    window.addEventListener('pc_avatar_volume_changed', handleAvatarVolumeChange);
    window.addEventListener('pc_audio_mute_changed', handleMuteChange);
    window.addEventListener('pc_animation_toggle', handleAnimationChange);

    // Click outside listener
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pc_audio_volume_changed', handleAmbientVolumeChange);
      window.removeEventListener('pc_avatar_volume_changed', handleAvatarVolumeChange);
      window.removeEventListener('pc_audio_mute_changed', handleMuteChange);
      window.removeEventListener('pc_animation_toggle', handleAnimationChange);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAmbientVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setAmbientVolume(val);
    ambientAudio.setVolume(val / 100);
    if (isMuted && val > 0) {
      ambientAudio.setMuted(false);
      setIsMuted(false);
    }
  };

  const handleAvatarVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setAvatarVolume(val);
    setAvatarVoiceVolume(val / 100);
  };

  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    ambientAudio.setMuted(nextState);
    if (nextState) {
      setAvatarVoiceVolume(0);
    } else {
      setAvatarVoiceVolume(avatarVolume / 100 || 0.85);
    }
  };

  const handleToggleAnimation = () => {
    const nextState = !animationsEnabled;
    setAnimationsEnabled(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pc_animations_enabled', String(nextState));
      window.dispatchEvent(new CustomEvent('pc_animation_toggle', { detail: { enabled: nextState } }));
    }
  };

  const isDark = theme === 'dark';
  const buttonSize = size === 'sm' ? '32px' : size === 'lg' ? '40px' : '36px';
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  return (
    <div
      ref={dropdownRef}
      className={`gear-audio-hub-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        ...style
      }}
    >
      {/* ⚙️ CYBER METALLIC GEAR BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Preferences: Voice, Ambience & Animation Controls"
        aria-label="Settings and Ambience Control"
        style={{
          background: isOpen
            ? (isDark ? 'rgba(0, 163, 255, 0.2)' : 'rgba(2, 132, 199, 0.12)')
            : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent'),
          border: isOpen
            ? (isDark ? '1px solid var(--accent, #00A3FF)' : '1px solid #0284c7')
            : (isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(0, 0, 0, 0.14)'),
          borderRadius: '50%',
          width: buttonSize,
          height: buttonSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.2, 0, 0.2, 1)',
          position: 'relative',
          padding: 0,
          boxShadow: isOpen
            ? (isDark ? '0 0 16px rgba(0, 163, 255, 0.4)' : '0 0 12px rgba(2, 132, 199, 0.25)')
            : 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = isDark ? 'var(--accent, #00A3FF)' : '#0284c7';
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = isDark
            ? '0 0 12px rgba(0, 163, 255, 0.35)'
            : '0 2px 10px rgba(0, 0, 0, 0.08)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.14)';
            e.currentTarget.style.boxShadow = 'none';
          }
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isOpen ? (isDark ? 'var(--accent, #00A3FF)' : '#0284c7') : (isDark ? 'var(--text-secondary, var(--text-muted))' : '#334155')}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.2s ease'
          }}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>

        {/* Dynamic Activity Beacon Dot */}
        <span
          style={{
            position: 'absolute',
            top: '3px',
            right: '3px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isMuted ? 'var(--text-muted)' : (animationsEnabled ? (isDark ? '#00A3FF' : '#0284c7') : 'var(--success)'),
            boxShadow: isMuted ? 'none' : `0 0 8px ${animationsEnabled ? (isDark ? '#00A3FF' : '#0284c7') : 'var(--success)'}`,
            transition: 'background 0.3s ease, box-shadow 0.3s ease'
          }}
        />
      </button>

      {/* 🎛️ GLASSY SETTINGS CAPSULE POPOVER */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: '310px',
            background: isDark ? 'rgba(11, 15, 30, 0.94)' : 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '18px',
            boxShadow: isDark
              ? '0 24px 48px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.05)'
              : '0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.04)',
            padding: '18px 20px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'fadeInPop 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Popover Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            paddingBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px' }}>⚙️</span>
              <span style={{
                fontSize: '13px',
                fontWeight: 800,
                color: isDark ? '#FFFFFF' : '#0F172A',
                letterSpacing: '0.02em'
              }}>
                Audio & Environment
              </span>
            </div>
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: '20px',
              background: isMuted ? 'rgba(148, 163, 184, 0.15)' : (isDark ? 'rgba(var(--success-rgb),  0.15)' : 'rgba(var(--success-rgb),  0.12)'),
              color: isMuted ? (isDark ? 'var(--text-muted)' : 'var(--text-dim)') : 'var(--success)',
              fontWeight: 750
            }}>
              {isMuted ? 'MUTED' : 'AUDIO LIVE'}
            </span>
          </div>

          {/* 1. 🗣️ AVATAR MENTOR VOICE VOLUME */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{
                color: isDark ? 'var(--text-muted)' : '#475569',
                fontWeight: 650,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🗣️</span>
                <span>Avatar Mentor Voice</span>
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 750,
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontSize: '11px'
              }}>
                {isMuted ? '0%' : `${avatarVolume}%`}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : avatarVolume}
              onChange={handleAvatarVolumeSlider}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                accentColor: isDark ? 'var(--success)' : 'var(--success-deep)',
                cursor: 'pointer',
                background: isDark
                  ? `linear-gradient(to right, var(--success) 0%, var(--success) ${isMuted ? 0 : avatarVolume}%, rgba(255,255,255,0.15) ${isMuted ? 0 : avatarVolume}%, rgba(255,255,255,0.15) 100%)`
                  : `linear-gradient(to right, #059669 0%, #059669 ${isMuted ? 0 : avatarVolume}%, rgba(0,0,0,0.1) ${isMuted ? 0 : avatarVolume}%, rgba(0,0,0,0.1) 100%)`
              }}
            />
          </div>

          {/* 2. 🎵 AMBIENT MUSIC VOLUME SLIDER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{
                color: isDark ? 'var(--text-muted)' : '#475569',
                fontWeight: 650,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>{ambientVolume === 0 || isMuted ? '🔇' : ambientVolume < 50 ? '🔉' : '🔊'}</span>
                <span>Background Music</span>
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 750,
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontSize: '11px'
              }}>
                {isMuted ? '0%' : `${ambientVolume}%`}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : ambientVolume}
              onChange={handleAmbientVolumeSlider}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                accentColor: isDark ? 'var(--accent, #00A3FF)' : '#0284c7',
                cursor: 'pointer',
                background: isDark
                  ? `linear-gradient(to right, #00A3FF 0%, #00A3FF ${isMuted ? 0 : ambientVolume}%, rgba(255,255,255,0.15) ${isMuted ? 0 : ambientVolume}%, rgba(255,255,255,0.15) 100%)`
                  : `linear-gradient(to right, #0284c7 0%, #0284c7 ${isMuted ? 0 : ambientVolume}%, rgba(0,0,0,0.1) ${isMuted ? 0 : ambientVolume}%, rgba(0,0,0,0.1) 100%)`
              }}
            />
          </div>

          {/* 3. ✨ CELESTIAL SKY ANIMATIONS TOGGLE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>✨</span>
              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 750,
                  color: isDark ? '#FFFFFF' : '#0F172A'
                }}>
                  Sky Animations
                </div>
                <div style={{
                  fontSize: '10px',
                  color: isDark ? 'var(--text-muted)' : 'var(--text-dim)'
                }}>
                  {animationsEnabled ? 'Meteors & Sunlight active' : 'Background paused'}
                </div>
              </div>
            </div>

            {/* Toggle ON/OFF Switch Button */}
            <button
              type="button"
              onClick={handleToggleAnimation}
              title={animationsEnabled ? 'Turn off celestial sky animations' : 'Turn on celestial sky animations'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                background: animationsEnabled
                  ? (isDark ? 'var(--accent, #00A3FF)' : '#0284c7')
                  : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                color: animationsEnabled ? '#FFFFFF' : (isDark ? 'var(--text-muted)' : 'var(--text-dim)'),
                boxShadow: animationsEnabled
                  ? (isDark ? '0 2px 8px rgba(0, 163, 255, 0.35)' : '0 2px 8px rgba(2, 132, 199, 0.25)')
                  : 'none',
                transition: 'all 0.2s cubic-bezier(0.2, 0, 0.2, 1)'
              }}
            >
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: animationsEnabled ? '#FFFFFF' : (isDark ? 'var(--text-muted)' : 'var(--text-dim)'),
                display: 'inline-block'
              }} />
              <span>{animationsEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* 4. 🔇 QUICK MUTE ALL / LIVE AUDIO TOGGLE */}
          <button
            type="button"
            onClick={handleToggleMute}
            style={{
              width: '100%',
              padding: '9px 14px',
              borderRadius: '10px',
              background: isMuted
                ? (isDark ? 'var(--accent, #00A3FF)' : '#0284c7')
                : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'),
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
              color: isMuted ? '#FFF' : (isDark ? '#FFF' : '#0F172A'),
              fontSize: '12px',
              fontWeight: 750,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{isMuted ? '🔊 Unmute All Audio' : '🔇 Mute All Audio'}</span>
          </button>

          {/* 5. 🌌 HARMONIC FREQUENCY BADGE */}
          <div style={{
            fontSize: '11px',
            color: isDark ? 'var(--text-muted)' : 'var(--text-dim)',
            background: isDark ? 'rgba(0, 163, 255, 0.08)' : 'rgba(var(--warning-rgb),  0.08)',
            border: isDark ? '1px solid rgba(0, 163, 255, 0.2)' : '1px solid rgba(var(--warning-rgb),  0.25)',
            borderRadius: '10px',
            padding: '8px 10px',
            lineHeight: 1.4
          }}>
            <span style={{
              fontWeight: 700,
              color: isDark ? '#00A3FF' : '#D97706'
            }}>
              {isDark ? '🌌 Dark Cosmos: ' : '☀️ Solar Light: '}
            </span>
            <span>
              {isDark ? '432Hz deep meditative cosmic frequency' : '528Hz vibrant golden sunlight harmonics'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
