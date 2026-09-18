'use client';
// apps/web/src/lib/store/useAppStore.ts
// Zustand for client-only UI state (sidebar, active tab, toasts, WebSocket).
// Server data lives in React Query. This store is ONLY for UI state.

import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppState {
  // UI
  sidebarOpen:    boolean;
  activeTab:      string;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab:   (tab: string)   => void;

  // Global Theme & Focus Mode
  theme:          'light' | 'dark';
  focusMode:      boolean;
  setTheme:       (theme: 'light' | 'dark') => void;
  toggleTheme:    () => void;
  setFocusMode:   (focus: boolean) => void;
  toggleFocusMode:() => void;

  // AI Usage Tokens
  aiUseTokens:    number;
  setAiUseTokens: (tokens: number) => void;
  decrementAiUseTokens: (amount: number) => void;

  // Toasts
  toasts:     Toast[];
  addToast:   (toast: Omit<Toast, 'id'>) => void;
  removeToast:(id: string) => void;

  // WebSocket
  wsConnected:    boolean;
  setWsConnected: (connected: boolean) => void;

  // Live score updates (pushed via WebSocket, not fetched)
  liveScores: Record<string, number>;
  setLiveScore: (key: string, value: number) => void;

  // Exam state (local — not persisted to server until submit)
  examActive:    boolean;
  examSessionToken: string | null;
  examAnswers:   Record<string, unknown>;
  setExamActive: (active: boolean) => void;
  setExamToken:  (token: string | null) => void;
  saveExamAnswer:(questionId: string, answer: unknown) => void;
  clearExam:     () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // UI
  sidebarOpen:    true,
  activeTab:      'dashboard',
  setSidebarOpen: (open)   => set({ sidebarOpen: open }),
  setActiveTab:   (tab)    => set({ activeTab: tab }),

  // Global Theme & Focus Mode
  theme:          'dark',
  focusMode:      false,
  setTheme:       (theme) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('pc_theme', theme); } catch {}
      window.dispatchEvent(new CustomEvent('pc_theme_toggled', { detail: { theme, time: Date.now() } }));
    }
    set({ theme });
  },
  toggleTheme:    () => set((s) => {
    const nextTheme = s.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme);
      try { localStorage.setItem('pc_theme', nextTheme); } catch {}
      window.dispatchEvent(new CustomEvent('pc_theme_toggled', { detail: { theme: nextTheme, time: Date.now() } }));
    }
    return { theme: nextTheme };
  }),
  setFocusMode:   (focus) => set({ focusMode: focus }),
  toggleFocusMode:() => set((s) => ({ focusMode: !s.focusMode })),

  // AI Usage Tokens
  aiUseTokens:    120,
  setAiUseTokens: (tokens) => set({ aiUseTokens: tokens }),
  decrementAiUseTokens: (amount) => set((s) => ({ aiUseTokens: Math.max(0, s.aiUseTokens - amount) })),

  // Toasts
  toasts: [],
  addToast: (toast) => set((s) => ({
    toasts: [...s.toasts, { ...toast, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }],
  })),
  removeToast: (id) => set((s) => ({
    toasts: s.toasts.filter(t => t.id !== id),
  })),

  // WebSocket
  wsConnected:    false,
  setWsConnected: (connected) => set({ wsConnected: connected }),

  // Live scores
  liveScores: {},
  setLiveScore: (key, value) => set((s) => ({
    liveScores: { ...s.liveScores, [key]: value },
  })),

  // Exam
  examActive:       false,
  examSessionToken: null,
  examAnswers:      {},
  setExamActive:    (active) => set({ examActive: active }),
  setExamToken:     (token)  => set({ examSessionToken: token }),
  saveExamAnswer:   (questionId, answer) => set((s) => ({
    examAnswers: { ...s.examAnswers, [questionId]: answer },
  })),
  clearExam: () => set({
    examActive: false, examSessionToken: null, examAnswers: {},
  }),
}));

// Toast helpers — use these in components
export const toast = {
  success: (title: string, message?: string) =>
    useAppStore.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useAppStore.getState().addToast({ type: 'error', title, message }),
  info: (title: string, message?: string) =>
    useAppStore.getState().addToast({ type: 'info', title, message }),
  warning: (title: string, message?: string) =>
    useAppStore.getState().addToast({ type: 'warning', title, message }),
};
