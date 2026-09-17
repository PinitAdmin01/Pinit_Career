'use client';

import React, { createContext, useContext, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { usePins, PinTransaction, PinSource, PIN_COSTS, PIN_EARN } from '@/lib/hooks/usePins';
import { useVault, VaultItem } from '@/lib/hooks/useVault';
import { useAppStore, toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';

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
  setPins: (pins: number) => void;
  bonusPins: number;
  setBonusPins?: (pins: number) => void;
  claimBonusPins: (amount?: number) => Promise<boolean>;
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
    setPins,
    bonusPins,
    setBonusPins,
    claimBonusPins,
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
    if (userId && userId !== 'guest') {
      try {
        const res = (await api.post('/api/pins/buy-ai-minutes', {})) as any;
        if (!res?.ok) {
          if (res?.error === 'DAILY_AI_MINUTES_LIMIT_EXCEEDED') {
            toast.error('Daily Limit Reached ⏳', res.message || 'Maximum 2 AI extensions (60 minutes total) allowed per day.');
          } else if (res?.error === 'INSUFFICIENT_PINS') {
            toast.error('Insufficient Pins 📌', 'Need 100 pins for 30 Min AI Token Extension.');
          } else {
            toast.error('Purchase Failed ⚠️', res?.message || 'Failed to purchase AI minutes.');
          }
          return false;
        }
        const added = res.minutesAdded || 30;
        setAiUseTokens(useAppStore.getState().aiUseTokens + added);
        if (typeof res.newBalance === 'number') {
          setPins(res.newBalance);
        }
        toast.success('AI Time Extended! ⏰', `+${added} AI Minutes added to your daily balance.`);
        return true;
      } catch (err: any) {
        toast.error('Purchase Error ⚠️', err?.message || 'Network error purchasing AI minutes.');
        return false;
      }
    } else {
      const ok = await spendPins('ai_minutes_extend', 'Extended daily AI by 30 mins');
      if (!ok) return false;
      setAiUseTokens(useAppStore.getState().aiUseTokens + 30);
      toast.success('AI Time Extended! ⏰', '+30 AI Minutes added to your daily balance.');
      return true;
    }
  }, [userId, spendPins, setAiUseTokens]);

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

  const lastRewardTimeRef = useRef<number>(0);
  const rewardActivity = useCallback((
    type: 'quest' | 'mission' | 'interview' | 'gd' | 'attention_game' | 'project',
    title?: string
  ) => {
    const now = Date.now();
    if (now - lastRewardTimeRef.current < 2000) {
      console.warn('[rewardActivity] Throttled: Activity rewards rate limited.');
      return;
    }
    lastRewardTimeRef.current = now;

    const MATRIX: Record<string, { xp: number; trust: number; dna: number; label: string }> = {
      quest:          { xp: 15, trust: 1, dna: 1, label: 'Quest Lesson Mastered' },
      mission:        { xp: 25, trust: 2, dna: 2, label: 'Mission Challenge Cleared' },
      gd:             { xp: 30, trust: 2, dna: 2, label: 'Group Discussion Completed' },
      interview:      { xp: 40, trust: 3, dna: 3, label: 'AI Interview Round Completed' },
      attention_game: { xp: 10, trust: 0, dna: 1, label: 'Focus Training Completed' },
      project:        { xp: 50, trust: 5, dna: 5, label: 'Project Verified' },
    };

    const reward = MATRIX[type] || { xp: 15, trust: 1, dna: 1, label: 'Activity Completed' };
    toast.success(`🏆 ${reward.label}`, `+${reward.xp} XP`);
  }, []);

  const value = useMemo<FinanceContextType>(() => ({
    vaultItems,
    setVaultItems,
    addVaultItem,
    updateVaultItem,
    pins,
    setPins,
    bonusPins: bonusPins || 0,
    setBonusPins,
    claimBonusPins,
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
    setPins,
    bonusPins,
    setBonusPins,
    claimBonusPins,
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
