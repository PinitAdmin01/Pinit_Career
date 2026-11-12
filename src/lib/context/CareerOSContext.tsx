'use client';

import React, { useMemo } from 'react';
import {
  UIStateProvider,
  useUIState,
  useOptionalUIState,
  UIStateContextType,
} from '@/lib/context/UIStateContext';
import {
  FinanceProvider,
  useFinance,
  useOptionalFinance,
  FinanceContextType,
} from '@/lib/context/FinanceContext';
import {
  UserProgressProvider,
  useUserProgress,
  useOptionalUserProgress,
  UserProgressContextType,
  OnboardingAnswers,
} from '@/lib/context/UserProgressContext';
import { useVault, VaultItem } from '@/hooks/useVault';
import { usePins, PinTransaction, PinSource, PIN_COSTS, PIN_EARN } from '@/hooks/usePins';
import { useAppStore } from '@/lib/store/useAppStore';

// Re-export decomposed domain hooks, types and constants for full backward compatibility
export { useVault, usePins };
export type { VaultItem };
export type { PinTransaction, PinSource };
export type { OnboardingAnswers };
export { PIN_COSTS, PIN_EARN };
export { useUIState, useFinance, useUserProgress };

export type CareerOSContextType = UIStateContextType & FinanceContextType & UserProgressContextType;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DEF-064 Fix: Server-first authoritative roadmap hydration
 * ─────────────────────────────────────────────────────────────────────────────
 * CareerOSContext and UserProgressContext unconditionally hydrate authoritative
 * server roadmap over stale local cache.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function CareerOSProvider({ children }: { children: React.ReactNode }) {
  return (
    <UIStateProvider>
      <FinanceProvider>
        <UserProgressProvider>
          {children}
        </UserProgressProvider>
      </FinanceProvider>
    </UIStateProvider>
  );
}

export function useCareerOS(): CareerOSContextType {
  const ui = useUIState();
  const finance = useFinance();
  const progress = useUserProgress();

  return useMemo(() => ({
    // Theme & Focus slices: theme, focusMode, toggleTheme, toggleFocusMode
    ...ui,
    // Vault slices: vaultItems, setVaultItems, addVaultItem, updateVaultItem
    // Pins credit slices: pins, pinHistory, earnPins, spendPins, canAfford
    ...finance,
    // User progress & roadmap progression slices
    ...progress,
  }), [ui, finance, progress]);
}

/**
 * [FIX-STAGE: Wave 1A - Hook Order Safety]
 * Unconditional optional CareerOS hook safe for SSR / isolated modals / unit tests.
 * Never throws and never violates react-hooks/rules-of-hooks (no try/catch around hooks).
 */
export function useOptionalCareerOS(): Partial<CareerOSContextType> {
  const ui = useOptionalUIState();
  const finance = useOptionalFinance();
  const progress = useOptionalUserProgress();

  return useMemo(() => {
    if (!ui || !finance || !progress) {
      console.log('[PinIT][Fix:CareerOSContext] Rendered outside full CareerOSProvider; falling back to partial context.', {
        hasUI: Boolean(ui),
        hasFinance: Boolean(finance),
        hasProgress: Boolean(progress),
      });
    }
    return {
      ...(ui ?? {}),
      ...(finance ?? {}),
      ...(progress ?? {}),
    };
  }, [ui, finance, progress]);
}
