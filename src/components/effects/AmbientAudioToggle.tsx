'use client';

import React, { useState, useEffect } from 'react';
import { ambientAudio } from '@/lib/audio/ambientAudioEngine';

export default function AmbientAudioToggle() {
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMuted(ambientAudio.isMuted());
  }, []);

  if (!mounted) return null;

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    ambientAudio.setMuted(nextState);
  };

  return (
    <button
      type="button"
      onClick={toggleMute}
      title={isMuted ? 'Unmute ambient theme soundscape' : 'Mute ambient theme soundscape'}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '50px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        fontSize: '12.5px',
        fontWeight: 750,
        cursor: 'pointer',
        boxShadow: 'var(--card-shadow)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.2s cubic-bezier(0.2, 0, 0.2, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: '14px' }}>{isMuted ? '🔇' : '🔊'}</span>
      <span>{isMuted ? 'Audio: Muted' : 'Audio: Live'}</span>
    </button>
  );
}
