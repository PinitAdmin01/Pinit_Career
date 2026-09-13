'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';
import { spendPinsDB, syncUnlockedItemsDB, fetchServerTimeOffset } from '@/lib/supabaseService';
import { supabase } from '@/lib/supabaseClient';

export interface PinTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  source: PinSource;
  timestamp: number;
}

import { generateTxId } from '@/lib/utils/transactionId';
export { generateTxId };

export type PinSource =
  | 'mission_complete'
  | 'exam_pass'
  | 'interview_session'
  | 'study_session'
  | 'onboarding_complete'
  | 'vault_verify'
  | 'daily_login'
  | 'streak_bonus'
  | 'purchase'
  | 'ai_interview'
  | 'resume_enhance'
  | 'career_twin'
  | 'personality_analysis'
  | 'sentinel_fingerprint'
  | 'communication_session'
  | 'career_assets'
  | 'career_dna_calc'
  | 'admin_grant';

// Pin costs per feature — single source of truth
export const PIN_COSTS: Record<string, { cost: number; label: string; icon: string }> = {
  quest:                 { cost: 20, label: 'Quest (30 Min Access)',        icon: '🗺' },
  mission:               { cost: 20, label: 'Mission (30 Min Access)',      icon: '⚡' },
  group_discussion:      { cost: 30, label: 'GD Practice (30 Min Access)',  icon: '💬' },
  gd:                    { cost: 30, label: 'GD Practice (30 Min Access)',  icon: '💬' },
  ai_interview:          { cost: 40, label: 'AI Interview (30 Min Access)', icon: '🎙' },
  interview:             { cost: 40, label: 'AI Interview (30 Min Access)', icon: '🎙' },
  attention_span_game:   { cost: 5,  label: 'Attention Span Game Play',     icon: '🧠' },
  // Legacy aliases
  quest_start:           { cost: 20, label: 'Quest (30 Min Access)',        icon: '🗺' },
  resume_enhance:        { cost: 15, label: 'Resume AI Enhancement',        icon: '📄' },
  career_twin:           { cost: 30, label: 'Career Twin Simulation',       icon: '✦' },
  personality_analysis:  { cost: 10, label: 'Personality AI Analysis',      icon: '🧠' },
  sentinel_fingerprint:  { cost: 5,  label: 'Sentinel Fingerprint',         icon: '🔐' },
  career_assets:         { cost: 20, label: 'Career Assets Generation',     icon: '💼' },
  career_dna_calc:       { cost: 10, label: 'Career DNA Recalculate',       icon: '🧬' },
  jd_match:              { cost: 5,  label: 'JD Match Analysis',            icon: '🎯' },
  ai_minutes_extend:     { cost: 100, label: '30 Min AI Token Extension',    icon: '⏰' },
};

export const PIN_EARN: Record<PinSource, number> = {
  mission_complete:     0,
  exam_pass:            0,
  interview_session:    0,
  study_session:        0,
  onboarding_complete:  0,
  vault_verify:         0,
  daily_login:          0,
  streak_bonus:         50,
  purchase:             100,
  ai_interview:         0,
  resume_enhance:       0,
  career_twin:          0,
  personality_analysis: 0,
  sentinel_fingerprint: 0,
  communication_session:0,
  career_assets:        0,
  career_dna_calc:      0,
  admin_grant:          0,
};

export interface UsePinsOptions {
  userId?: string;
  userEmail?: string;
}

export function usePins(options: UsePinsOptions = {}) {
  const { userId = 'guest', userEmail } = options;
  const storageKeys = {
    pins: `pinit_${userId}_pins`,
    pinHist: `pinit_${userId}_pin_history`,
    unlockedItems: `pinit_${userId}_unlocked_items`,
    last1AMReset: `pinit_${userId}_last_1am_pin_reset`,
  };

  const [pins, setPinsState] = useState<number>(120);
  const [pinHistory, setPinHistoryState] = useState<PinTransaction[]>([]);
  const [unlockedItems, setUnlockedItemsState] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const serverOffsetRef = useRef<number>(0);

  // Fetch server clock offset to prevent client clock tampering
  useEffect(() => {
    fetchServerTimeOffset()
      .then(offset => {
        serverOffsetRef.current = offset;
      })
      .catch(() => {});
  }, []);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const rawPins = localStorage.getItem(storageKeys.pins);
      if (rawPins !== null) setPinsState(Number(rawPins) || 0);

      const rawHist = localStorage.getItem(storageKeys.pinHist);
      if (rawHist) {
        const parsed = JSON.parse(rawHist);
        if (Array.isArray(parsed)) setPinHistoryState(parsed);
      }

      const rawUnlocked = localStorage.getItem(storageKeys.unlockedItems);
      if (rawUnlocked) {
        const parsed = JSON.parse(rawUnlocked);
        if (typeof parsed === 'object' && parsed !== null) setUnlockedItemsState(parsed);
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, [storageKeys.pins, storageKeys.pinHist, storageKeys.unlockedItems]);

  // ── DEF-053: Authoritative Server Hydration & Pin History Deduplication ──
  useEffect(() => {
    if (!userId || userId === 'guest') return;
    let isMounted = true;

    async function hydrateFromServer() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('pins, pin_history')
          .eq('id', userId)
          .maybeSingle();

        if (error || !data || !isMounted) return;

        if (typeof data.pins === 'number') {
          setPinsState(data.pins);
          try { localStorage.setItem(storageKeys.pins, String(data.pins)); } catch {}
        }

        if (Array.isArray(data.pin_history)) {
          setPinHistoryState(prev => {
            const map = new Map<string, PinTransaction>();
            for (const tx of data.pin_history) {
              if (tx && tx.id) map.set(tx.id, tx);
            }
            for (const tx of prev) {
              if (tx && tx.id && !map.has(tx.id)) map.set(tx.id, tx);
            }
            const merged = Array.from(map.values())
              .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
              .slice(0, 100);
            try { localStorage.setItem(storageKeys.pinHist, JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('[usePins] Error hydrating pins from Supabase:', err);
      }
    }

    hydrateFromServer();

    return () => {
      isMounted = false;
    };
  }, [userId, storageKeys.pins, storageKeys.pinHist]);

  // ── DEF-054: Server-Event Driven Multi-Tab Sync via Supabase Realtime ────
  useEffect(() => {
    if (!userId || userId === 'guest') return;

    try {
      const channel = supabase
        .channel(`user-pins-realtime-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${userId}`,
          },
          (payload: any) => {
            if (payload?.new && typeof payload.new.pins === 'number') {
              setPinsState(payload.new.pins);
              try { localStorage.setItem(storageKeys.pins, String(payload.new.pins)); } catch {}
            }
            if (payload?.new && Array.isArray(payload.new.pin_history)) {
              setPinHistoryState(prev => {
                const map = new Map<string, PinTransaction>();
                for (const tx of payload.new.pin_history) {
                  if (tx && tx.id) map.set(tx.id, tx);
                }
                for (const tx of prev) {
                  if (tx && tx.id && !map.has(tx.id)) map.set(tx.id, tx);
                }
                const merged = Array.from(map.values())
                  .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                  .slice(0, 100);
                try { localStorage.setItem(storageKeys.pinHist, JSON.stringify(merged)); } catch {}
                return merged;
              });
            }
          }
        )
        .subscribe();

      return () => {
        try { supabase.removeChannel(channel); } catch {}
      };
    } catch (err) {
      console.warn('[usePins] Realtime pin subscription error:', err);
    }
  }, [userId, storageKeys.pins, storageKeys.pinHist]);

  const savePins = useCallback((newPins: number) => {
    setPinsState(newPins);
    try { localStorage.setItem(storageKeys.pins, String(newPins)); } catch {}
  }, [storageKeys.pins]);

  const saveHistory = useCallback((hist: PinTransaction[]) => {
    setPinHistoryState(hist);
    try { localStorage.setItem(storageKeys.pinHist, JSON.stringify(hist)); } catch {}
  }, [storageKeys.pinHist]);

  const saveUnlockedItems = useCallback((items: Record<string, number>) => {
    setUnlockedItemsState(items);
    try { localStorage.setItem(storageKeys.unlockedItems, JSON.stringify(items)); } catch {}
  }, [storageKeys.unlockedItems]);

  // DEF-033 FIX: Removed client-side 1:00 AM pin reset useEffect. Daily reset is handled authoritatively by /api/cron/daily-pin-reset server cron.

  const earnPins = useCallback((source: PinSource, overrideAmount?: number, reason?: string) => {
    if (source !== 'purchase' && source !== 'admin_grant' && source !== 'streak_bonus') {
      return;
    }
    const amount = overrideAmount ?? PIN_EARN[source] ?? 0;
    if (amount <= 0) return;

    api.post('/api/pins/earn', { source, amount }).catch(() => {});

    const next = pins + amount;
    savePins(next);

    const tx: PinTransaction = {
      id: generateTxId('tx'),
      type: 'earn',
      amount,
      reason: reason ?? source.replace(/_/g, ' '),
      source,
      timestamp: Date.now(),
    };
    saveHistory([tx, ...pinHistory].slice(0, 100));
    toast.success(`+${amount} Pins Credited ⚡`, reason ?? 'Pin Purchase Successful');
  }, [pins, pinHistory, savePins, saveHistory]);

  const canAfford = useCallback((featureKey: string): boolean => {
    const cost = PIN_COSTS[featureKey]?.cost ?? 0;
    return pins >= cost;
  }, [pins]);

  const spendPins = useCallback(async (featureKey: string, customReason?: string): Promise<boolean> => {
    const meta = PIN_COSTS[featureKey];
    if (!meta) return true;
    if (pins < meta.cost) {
      toast.error(`Insufficient Pins 📌`, `Need ${meta.cost} pins for ${meta.label}. Pins reset to 120 daily at 1:00 AM or must be purchased.`);
      return false;
    }

    if (userId && userId !== 'guest') {
      try {
        const result = await spendPinsDB(userId, meta.cost, customReason ?? meta.label);
        if (!result.ok) {
          toast.error(`Pins Out of Sync 🔄`, result.reason === 'INSUFFICIENT_PINS' ? 'Insufficient pins in authoritative balance.' : 'Failed to deduct pins on server.');
          return false;
        }
        if (typeof result.newBalance === 'number') {
          savePins(result.newBalance);
        }
      } catch {
        toast.error(`Pins Spend Error ⚠️`, 'Network error verifying pin deduction.');
        return false;
      }
    } else {
      savePins(Math.max(0, pins - meta.cost));
    }

    const tx: PinTransaction = {
      id: generateTxId('tx'),
      type: 'spend',
      amount: meta.cost,
      reason: customReason ?? meta.label,
      source: featureKey as PinSource,
      timestamp: Date.now(),
    };
    saveHistory([tx, ...pinHistory].slice(0, 100));
    return true;
  }, [pins, userId, savePins, saveHistory, pinHistory]);

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

    const ok = await spendPins(category, customReason ?? `${meta.label}: ${itemKey}`);
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
    pins,
    setPins: savePins,
    pinHistory,
    setPinsHistory: saveHistory,
    unlockedItems,
    setUnlockedItems: saveUnlockedItems,
    earnPins,
    spendPins,
    canAfford,
    isItemUnlocked,
    getItemRemainingSeconds,
    unlockItem,
    extendItemGrace,
    isLoaded,
  };
}
