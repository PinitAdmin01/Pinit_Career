'use client';
// ─────────────────────────────────────────────────────────────────────────────
// PROPOSED PATCH: useAppStore.ts — toggleTheme + theme persistence
// ─────────────────────────────────────────────────────────────────────────────
// This file is a PROPOSED replacement for the `toggleTheme` action in
// src/lib/store/useAppStore.ts. It does NOT replace the whole store — only the
// toggleTheme function (and the accompanying localStorage hydration that must
// happen in AppShell.tsx on mount).
//
// Apply by replacing the existing toggleTheme line in useAppStore.ts:
//
//   OLD:  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
//
//   NEW:  <toggleTheme implementation below>
// ─────────────────────────────────────────────────────────────────────────────

// ── PART 1: Replacement for the `toggleTheme` action in useAppStore ──────────
export const proposedToggleTheme = `
  // Global Theme & Focus Mode
  theme:          'dark',
  focusMode:      false,
  setTheme:       (theme) => set({ theme }),
  toggleTheme:    () => set((s) => {
    const nextTheme = s.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('pc_theme', nextTheme);
    }
    return { theme: nextTheme };
  }),
  setFocusMode:   (focus) => set({ focusMode: focus }),
  toggleFocusMode:() => set((s) => ({ focusMode: !s.focusMode })),
`;

// ── PART 2: localStorage hydration in AppShell.tsx (on mount) ────────────────
// Add this useEffect inside the AppShell component body, near the other
// theme-related effects (e.g. after the `useEffect` that sets `mobileOpen`).
//
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     const saved = localStorage.getItem('pc_theme');
//     if (saved === 'light' || saved === 'dark') {
//       document.documentElement.setAttribute('data-theme', saved);
//       // Sync Zustand state so UI reflects the saved theme
//       useAppStore.getState().setTheme(saved);
//     }
//   }, []);
//
// NOTE: `useAppStore` is already imported in AppShell.tsx (line 10):
//   import { useAppStore, toast } from '@/lib/store/useAppStore';
// So no new import is needed.