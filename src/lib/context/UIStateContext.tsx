'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';

export interface UIStateContextType {
  theme: 'light' | 'dark';
  focusMode: boolean;
  toggleTheme: () => void;
  toggleFocusMode: () => void;
  unlockedTabs: string[];
  forceShowCareerBuilder: boolean;
  setForceShowCareerBuilder: (val: boolean) => void;
  demoTabsUnlocked: boolean;
  setDemoTabsUnlocked: (val: boolean) => void;
  isLoaded: boolean;
}

const UIStateContext = createContext<UIStateContextType | null>(null);

export function UIStateProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore(s => s.theme);
  const toggleTheme = useAppStore(s => s.toggleTheme);
  const focusMode = useAppStore(s => s.focusMode);
  const toggleFocusMode = useAppStore(s => s.toggleFocusMode);

  const [unlockedTabs] = useState<string[]>(['profile', 'quests', 'portfolio', 'vault']);
  const [forceShowCareerBuilder, setForceShowCareerBuilder] = useState(false);
  const [demoTabsUnlocked, setDemoTabsUnlocked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pc_theme');
      if (saved === 'light' || saved === 'dark') {
        document.documentElement.setAttribute('data-theme', saved);
        useAppStore.getState().setTheme(saved);
      }
    }
    setIsLoaded(true);
  }, []);

  const value = useMemo<UIStateContextType>(() => ({
    theme,
    focusMode,
    toggleTheme,
    toggleFocusMode,
    unlockedTabs,
    forceShowCareerBuilder,
    setForceShowCareerBuilder,
    demoTabsUnlocked,
    setDemoTabsUnlocked,
    isLoaded,
  }), [
    theme,
    focusMode,
    toggleTheme,
    toggleFocusMode,
    unlockedTabs,
    forceShowCareerBuilder,
    demoTabsUnlocked,
    isLoaded,
  ]);

  return (
    <UIStateContext.Provider value={value}>
      {children}
    </UIStateContext.Provider>
  );
}

export function useUIState(): UIStateContextType {
  const ctx = useContext(UIStateContext);
  if (!ctx) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return ctx;
}
