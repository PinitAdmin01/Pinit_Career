'use client';

import React, { useMemo } from 'react';
import { UIStateProvider, useUIState, UIStateContextType } from '@/lib/context/UIStateContext';
import { FinanceProvider, useFinance, FinanceContextType } from '@/lib/context/FinanceContext';
import { UserProgressProvider, useUserProgress, UserProgressContextType, OnboardingAnswers } from '@/lib/context/UserProgressContext';
import { useVault, VaultItem } from '@/lib/hooks/useVault';
import { usePins, PinTransaction, PinSource, PIN_COSTS, PIN_EARN } from '@/lib/hooks/usePins';
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
