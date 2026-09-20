'use client';

import React, { useState, useEffect } from 'react';
import DynamicSkyCanvas from '@/components/effects/DynamicSkyCanvas';
import AmbientAudioToggle from '@/components/effects/AmbientAudioToggle';
import { ambientAudio } from '@/lib/audio/ambientAudioEngine';

interface PublicEffectsShellProps {
  children: React.ReactNode;
}

export default function PublicEffectsShell({ children }: PublicEffectsShellProps) {
  const [themeState, setThemeState] = useState<{ theme: 'dark' | 'light'; lastToggleTime: number }>({
    theme: 'dark',
    lastToggleTime: 0
  });

  useEffect(() => {
    const saved = (localStorage.getItem('pc_theme') as 'dark' | 'light') || 'dark';
    const initTime = Date.now();
    setThemeState({
      theme: saved,
      lastToggleTime: initTime
    });

    // Handle global theme toggling event from navbar
    const handleThemeToggle = (e: any) => {
      if (e.detail?.theme) {
        const nextTheme = e.detail.theme as 'dark' | 'light';
        const toggleTime = e.detail.time || Date.now();
        setThemeState({
          theme: nextTheme,
          lastToggleTime: toggleTime
        });
        if (!ambientAudio.isMuted()) {
          ambientAudio.play(nextTheme, 3000);
        }
      }
    };

    window.addEventListener('pc_theme_toggled', handleThemeToggle);

    return () => {
      window.removeEventListener('pc_theme_toggled', handleThemeToggle);
      ambientAudio.stopImmediate();
    };
  }, []);

  return (
    <div
      className="public-effects-shell"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: themeState.theme === 'dark' ? '#060813' : '#F8FAFC',
        color: themeState.theme === 'dark' ? '#F8FAFC' : '#0F172A',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      {/* 1. PERSISTENT SKY & SUNLIGHT PARTICLES CANVAS (NEVER UNMOUNTS ON ROUTE TRANSITION) */}
      <DynamicSkyCanvas theme={themeState.theme} lastToggleTime={themeState.lastToggleTime} />

      {/* 2. PERSISTENT FLOATING AMBIENT AUDIO TOGGLE */}
      <AmbientAudioToggle />

      {/* 3. PAGE CONTENT */}
      <div className="public-page-body" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
