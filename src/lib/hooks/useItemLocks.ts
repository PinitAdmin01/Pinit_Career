'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';
import { syncUnlockedItemsDB, fetchServerTimeOffset } from '@/lib/supabaseService';
import { PIN_COSTS } from '@/lib/hooks/usePinBalance';

import { supabase } from '@/lib/supabaseClient';

export interface UseItemLocksOptions {
  userId?: string;
  pins?: number;
  spendPins?: (featureKey: string, itemId?: string, customReason?: string) => Promise<boolean>;
}

/**
 * Modular hook for 30-minute feature unlock state, authoritative clock offset synchronization,
 * countdown timers, and emergency grace period extensions (Task 2.1).
 */
export function useItemLocks(options: UseItemLocksOptions = {}) {
  const { userId = 'guest', pins = 120, spendPins } = options;

  const [unlockedItems, setUnlockedItemsState] = useState<Record<string, number>>({});
  const serverOffsetRef = useRef<number>(0);

  // Fetch server clock offset to prevent client clock tampering (Defect 045)
  useEffect(() => {
    fetchServerTimeOffset()
      .then(offset => {
        serverOffsetRef.current = offset;
      })
      .catch(() => {});
  }, []);

  // Hydrate unlocked items from user.unlocked_items in the database, not localStorage
  useEffect(() => {
    if (!userId || userId === 'guest') return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('unlocked_items')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data?.unlocked_items && typeof data.unlocked_items === 'object') {
          setUnlockedItemsState(data.unlocked_items as Record<string, number>);
        }
      } catch {}
    })();
  }, [userId]);

  // Only updates local state; the authoritative DB write is done server-side
  // by /api/pins/spend after a successful pin deduction (B3 fix).
  const saveUnlockedItems = useCallback((items: Record<string, number>) => {
    setUnlockedItemsState(items);
  }, []);

  const isItemUnlocked = useCallback((itemKey: string): boolean => {
    const expiresAt = unlockedItems[itemKey];
    const now = Date.now() + (serverOffsetRef.current || 0);
    return typeof expiresAt === 'number' && expiresAt > now;
  }, [unlockedItems]);

  const getItemRemainingSeconds = useCallback((itemKey: string): number => {
    const expiresAt = unlockedItems[itemKey];
    const now = Date.now() + (serverOffsetRef.current || 0);
    if (!expiresAt || expiresAt <= now) return 0;
    return Math.ceil((expiresAt - now) / 1000);
  }, [unlockedItems]);

  const unlockItem = useCallback(async (
    itemKey: string,
    category: 'quest' | 'mission' | 'interview' | 'ai_interview' | 'gd' | 'group_discussion' | 'attention_span_game',
    customReason?: string
  ): Promise<boolean> => {
    if (isItemUnlocked(itemKey)) return true;

    const meta = PIN_COSTS[category] || PIN_COSTS[`${category}_start`] || { cost: 20, label: category };
    if (pins < meta.cost) {
      toast.error(`Insufficient Pins 📌`, `Need ${meta.cost} pins to unlock ${meta.label} for 30 minutes.`);
      return false;
    }

    if (!spendPins) {
      toast.error(`Pins Spend Error ⚠️`, 'Spend handler not configured.');
      return false;
    }

    const ok = await spendPins(category, itemKey, customReason);
    if (!ok) return false;

    if (category !== 'attention_span_game') {
      const now = Date.now() + (serverOffsetRef.current || 0);
      const expiresAt = now + 30 * 60 * 1000;
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem(`pinit_${userId}_grace_applied_${itemKey}`); } catch {}
      }
      const next = { ...unlockedItems, [itemKey]: expiresAt };
      saveUnlockedItems(next);
      if (userId && userId !== 'guest') {
        syncUnlockedItemsDB(userId, next).catch(() => {});
      }
      toast.success('30 Min Access Unlocked ⚡', `Unlocked ${itemKey} for 30 minutes!`);
    }
    return true;
  }, [isItemUnlocked, pins, spendPins, unlockedItems, saveUnlockedItems, userId]);

  const extendItemGrace = useCallback(async (
    itemKey: string,
    minutes: number = 15
  ): Promise<{ success: boolean; newRemainingSec: number; message: string }> => {
    const expiresAt = unlockedItems[itemKey];
    const now = Date.now() + (serverOffsetRef.current || 0);
    if (!expiresAt || typeof expiresAt !== 'number') {
      return { success: false, newRemainingSec: 0, message: 'Item is not currently active.' };
    }

    const boundedMinutes = Math.min(15, Math.max(5, minutes));

    if (userId && userId !== 'guest') {
      try {
        const res = (await api.post('/api/pins/extend-grace', {
          itemKey,
          minutes: boundedMinutes,
        })) as any;

        if (!res?.ok) {
          const errMsg = res?.message || 'Emergency grace could not be applied.';
          toast.error(res?.error === 'GRACE_ALREADY_CLAIMED' ? 'Grace Already Used ⚠️' : 'Grace Extension Failed ⚠️', errMsg);
          return {
            success: false,
            newRemainingSec: Math.max(0, Math.ceil((expiresAt - now) / 1000)),
            message: errMsg,
          };
        }

        const newExpiresAt = res.newExpiresAt || (Math.max(expiresAt, now) + boundedMinutes * 60 * 1000);
        const next = { ...unlockedItems, [itemKey]: newExpiresAt };
        saveUnlockedItems(next);
        toast.info('Emergency Grace Applied ⏱️', `+${boundedMinutes} minutes granted to complete your active work!`);
        return {
          success: true,
          newRemainingSec: Math.ceil((newExpiresAt - now) / 1000),
          message: 'Grace extended successfully.',
        };
      } catch (err: any) {
        toast.error('Grace Extension Failed ⚠️', err?.message || 'Network error applying grace period.');
        return {
          success: false,
          newRemainingSec: Math.max(0, Math.ceil((expiresAt - now) / 1000)),
          message: err?.message || 'Network error applying grace period.',
        };
      }
    } else {
      const graceKey = `pinit_${userId}_grace_applied_${itemKey}`;
      if (typeof window !== 'undefined' && localStorage.getItem(graceKey)) {
        toast.error('Grace Already Used ⚠️', 'Emergency grace can only be claimed once per 30-minute unlock cycle.');
        return { success: false, newRemainingSec: Math.max(0, Math.ceil((expiresAt - now) / 1000)), message: 'Grace period already used.' };
      }

      const newExpiresAt = Math.max(expiresAt, now) + boundedMinutes * 60 * 1000;
      const next = { ...unlockedItems, [itemKey]: newExpiresAt };
      saveUnlockedItems(next);

      if (typeof window !== 'undefined') {
        try { localStorage.setItem(graceKey, 'true'); } catch {}
      }

      toast.info('Emergency Grace Applied ⏱️', `+${boundedMinutes} minutes granted to complete your active work!`);
      return { success: true, newRemainingSec: Math.ceil((newExpiresAt - now) / 1000), message: 'Grace extended successfully.' };
    }
  }, [unlockedItems, userId, saveUnlockedItems]);

  return {
    unlockedItems,
    setUnlockedItems: saveUnlockedItems,
    isItemUnlocked,
    getItemRemainingSeconds,
    unlockItem,
    extendItemGrace,
    serverOffsetRef,
  };
}
