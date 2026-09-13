'use client';

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { usePins, PinTransaction, PinSource, PIN_COSTS, PIN_EARN } from '@/lib/hooks/usePins';
import { useVault, VaultItem } from '@/lib/hooks/useVault';
import { useAppStore } from '@/lib/store/useAppStore';

export interface FinanceContextType {
  vaultItems: VaultItem[];
  setVaultItems: (items: VaultItem[]) => void;
  addVaultItem: (item: {
    id?: string;
    title: string;
    item_type: string;
    organization_name?: string;
    description?: string;
    skill_tags?: string[];
    verified?: boolean;
    ai_confidence_score?: number;
  }) => void;
  updateVaultItem: (id: string, updates: Partial<VaultItem>) => void;
  pins: number;
  pinHistory: PinTransaction[];
  earnPins: (source: PinSource, overrideAmount?: number, reason?: string) => void;
  spendPins: (featureKey: string, customReason?: string) => Promise<boolean>;
  canAfford: (featureKey: string) => boolean;
  unlockedItems: Record<string, number>;
  isItemUnlocked: (itemKey: string) => boolean;
  getItemRemainingSeconds: (itemKey: string) => number;
  extendItemGrace?: (itemKey: string, minutes?: number) => Promise<{ success: boolean; newRemainingSec: number; message: string }> | { success: boolean; newRemainingSec: number; message: string };
  unlockItem: (itemKey: string, category: 'quest' | 'mission' | 'interview' | 'ai_interview' | 'gd' | 'group_discussion' | 'attention_span_game', customReason?: string) => Promise<boolean>;
  rewardActivity: (type: 'quest' | 'mission' | 'interview' | 'gd' | 'attention_game' | 'project', title?: string) => void;
  aiUseTokens: number;
  setAiUseTokens: (val: number) => void;
  decrementAiUseTokens: (amount: number) => void;
  buyAiMinutes: () => Promise<boolean>;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const {
    pins,
    pinHistory,
    earnPins,
    spendPins,
    canAfford,
    unlockedItems,
    isItemUnlocked,
    getItemRemainingSeconds,
    extendItemGrace,
    unlockItem,
  } = usePins({
    userId,
    userEmail: user?.email,
  });

  const aiUseTokens = useAppStore(s => s.aiUseTokens);
  const setAiUseTokens = useAppStore(s => s.setAiUseTokens);
  const decrementAiUseTokens = useAppStore(s => s.decrementAiUseTokens);
  const buyAiMinutes = useCallback(async () => {
    const ok = await spendPins('ai_minutes_extend', 'Extended daily AI by 30 mins');
    if (!ok) return false;
    setAiUseTokens(useAppStore.getState().aiUseTokens + 30);
    return true;
  }, [spendPins, setAiUseTokens]);

  const {
    vaultItems,
    setVaultItems,
    addVaultItem,
    updateVaultItem,
  } = useVault({
    userId,
    onAddXp: () => {},
    onEarnPins: (source: string) => earnPins(source as PinSource),
  });

  const rewardActivity = useMemo(() => {
    return (_type: string, _title?: string) => {};
  }, []);

  const value = useMemo<FinanceContextType>(() => ({
    vaultItems,
    setVaultItems,
    addVaultItem,
    updateVaultItem,
    pins,
    pinHistory,
    earnPins,
    spendPins,
    canAfford,
    unlockedItems,
    isItemUnlocked,
    getItemRemainingSeconds,
    extendItemGrace,
    unlockItem,
    rewardActivity,
    aiUseTokens,
    setAiUseTokens,
    decrementAiUseTokens,
    buyAiMinutes,
  }), [
    vaultItems,
    setVaultItems,
    addVaultItem,
    updateVaultItem,
    pins,
    pinHistory,
    earnPins,
    spendPins,
    canAfford,
    unlockedItems,
    isItemUnlocked,
    getItemRemainingSeconds,
    extendItemGrace,
    unlockItem,
    rewardActivity,
    aiUseTokens,
    setAiUseTokens,
    decrementAiUseTokens,
    buyAiMinutes,
  ]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextType {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return ctx;
}
