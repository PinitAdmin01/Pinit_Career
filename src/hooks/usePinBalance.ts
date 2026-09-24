'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';
import { spendPinsDB } from '@/lib/supabaseService';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/context/AuthContext';
import { generateTxId } from '@/lib/utils/transactionId';

export { generateTxId };

export interface PinTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  source: PinSource;
  timestamp: number;
}

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
  | 'admin_grant'
  | 'course_enrollment';

// Pin costs per feature — single source of truth (1 Rs = 10 Pins Economy)
export const PIN_COSTS: Record<string, { cost: number; label: string; icon: string }> = {
  quest:                 { cost: 20, label: 'Quest (30 Min Access)',        icon: '🗺' },
  mission:               { cost: 20, label: 'Mission (30 Min Access)',      icon: '⚡' },
  group_discussion:      { cost: 35, label: 'GD Practice (30 Min Access)',  icon: '💬' },
  gd:                    { cost: 35, label: 'GD Practice (30 Min Access)',  icon: '💬' },
  ai_interview:          { cost: 35, label: 'AI Interview (30 Min Access)', icon: '🎙' },
  interview:             { cost: 35, label: 'AI Interview (30 Min Access)', icon: '🎙' },
  code_arena:            { cost: 10, label: 'Code Arena 1v1 Battle',        icon: '⚔️' },
  arena:                 { cost: 10, label: 'Code Arena 1v1 Battle',        icon: '⚔️' },
  project:               { cost: 10, label: 'Project Verification & Review',icon: '📁' },
  group_project:         { cost: 10, label: 'Group Project Collaboration',  icon: '👥' },
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
  course_plan_1m:        { cost: 500, label: '1-Month Fast-Track Sprint',      icon: '🎓' },
  course_plan_3m:        { cost: 1200, label: '3-Month Career Accelerator',    icon: '🎓' },
  course_plan_6m:        { cost: 2200, label: '6-Month Professional Program',  icon: '🎓' },
  course_plan_9m:        { cost: 3500, label: '9-Month Master Program',        icon: '🎓' },
  course_plan_12m:       { cost: 4500, label: '12-Month Advanced Industry Fellowship', icon: '🚀' },
  course_plan_24m:       { cost: 7500, label: '24-Month Master Engineering & Degree Track', icon: '👑' },
};

export const PIN_EARN: Record<PinSource, number> = {
  mission_complete:     10,
  exam_pass:            25,
  interview_session:    20,
  study_session:        10,
  onboarding_complete:  50,
  vault_verify:         15,
  daily_login:          10,
  streak_bonus:         50,
  course_enrollment:    100,
  purchase:             100,
  ai_interview:         15,
  resume_enhance:       0,
  career_twin:          0,
  personality_analysis: 0,
  sentinel_fingerprint: 0,
  communication_session:10,
  career_assets:        0,
  career_dna_calc:      0,
  admin_grant:          0,
};

export interface UsePinBalanceOptions {
  userId?: string;
  userEmail?: string;
}

// ── TASK 3.4: Authoritative Supabase Balance with 60s Read-Only Client Cache ──
const CACHE_KEY = 'pinit_balance_cache';
const CACHE_TTL_MS = 60_000; // 60 seconds only

/**
 * Authoritative pin balance hook. Supabase is the single source of truth for money.
 * Client writes to localStorage are disallowed; localStorage is strictly an ephemeral 60s read-cache.
 */
export function usePinBalance(options: UsePinBalanceOptions = {}) {
  const { user } = useAuth();
  const effectiveUserId = (options.userId && options.userId !== 'guest') ? options.userId : user?.id;

  const getCachedBalance = useCallback((): number | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.value !== 'number') return null;
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null; // Expired after 60s
      return parsed.value as number;
    } catch {
      return null;
    }
  }, []);

  // ── FIX: Default balance fallback changed from 120 → 50 ──
  // First-time / demo users now start with 50 demo pins.
  const [pins, setPinsState] = useState<number>(() => getCachedBalance() ?? 50);
  const [bonusPins, setBonusPinsState] = useState<number>(0);
  const [pinHistory, setPinHistoryState] = useState<PinTransaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Authoritative Server Hydration from Supabase on Mount (Task 3.4) ──
  useEffect(() => {
    if (!effectiveUserId || effectiveUserId === 'guest') {
      setIsLoaded(true);
      return;
    }
    let isMounted = true;

    async function hydrateFromServer() {
      try {
        let authoritativeBalance: number | null = null;

        // 1. Attempt authoritative RPC first
        const { data: rpcData, error: rpcErr } = await supabase.rpc('get_pin_balance', {
          p_user_id: effectiveUserId,
        });

        if (!rpcErr && typeof rpcData === 'number') {
          authoritativeBalance = rpcData;
        }

        // 2. Fetch history, bonus pins, and fallback balance from canonical users table
        const { data: userData, error: userErr } = await supabase
          .from('users')
          .select('pins, pin_history, bonus_pins')
          .eq('id', effectiveUserId)
          .maybeSingle();

        if (authoritativeBalance === null && !userErr && userData && typeof userData.pins === 'number') {
          authoritativeBalance = userData.pins;
        }

        if (authoritativeBalance !== null && isMounted) {
          setPinsState(authoritativeBalance);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ value: authoritativeBalance, ts: Date.now() })
            );
          } catch {}
        }

        if (userData && typeof userData.bonus_pins === 'number' && isMounted) {
          setBonusPinsState(userData.bonus_pins);
        }

        if (userData && Array.isArray(userData.pin_history) && isMounted) {
          setPinHistoryState(prev => {
            const map = new Map<string, PinTransaction>();
            for (const tx of userData.pin_history) {
              if (tx && tx.id) map.set(tx.id, tx);
            }
            for (const tx of prev) {
              if (tx && tx.id && !map.has(tx.id)) map.set(tx.id, tx);
            }
            return Array.from(map.values())
              .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
              .slice(0, 100);
          });
        }
      } catch (err) {
        console.warn('[usePinBalance] Error hydrating authoritative pins:', err);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    }

    hydrateFromServer();

    return () => {
      isMounted = false;
    };
  }, [effectiveUserId, getCachedBalance]);

  // ── Realtime Synchronization from Supabase ──
  useEffect(() => {
    if (!effectiveUserId || effectiveUserId === 'guest') return;

    try {
      const channel = supabase
        .channel(`user-pins-realtime-${effectiveUserId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${effectiveUserId}`,
          },
          (payload: any) => {
            if (payload?.new && typeof payload.new.bonus_pins === 'number') {
              setBonusPinsState(payload.new.bonus_pins);
            }
            if (payload?.new && typeof payload.new.pins === 'number') {
              setPinsState(payload.new.pins);
              try {
                localStorage.setItem(
                  CACHE_KEY,
                  JSON.stringify({ value: payload.new.pins, ts: Date.now() })
                );
              } catch {}
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
                return Array.from(map.values())
                  .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                  .slice(0, 100);
              });
            }
          }
        )
        .subscribe();

      return () => {
        try { supabase.removeChannel(channel); } catch {}
      };
    } catch (err) {
      console.warn('[usePinBalance] Realtime pin subscription error:', err);
    }
  }, [effectiveUserId]);

  // Client-side local updates only update React state without raw localStorage write authority
  const savePins = useCallback((newPins: number) => {
    setPinsState(newPins);
  }, []);

  const saveHistory = useCallback((hist: PinTransaction[]) => {
    setPinHistoryState(hist);
  }, []);

  const earnPins = useCallback((source: PinSource, overrideAmount?: number, reason?: string) => {
    const defaultAmount = PIN_EARN[source] ?? 0;
    const amount = overrideAmount !== undefined ? overrideAmount : defaultAmount;
    if (amount <= 0) return;

    api.post('/api/pins/earn', { source, amount, reason }).catch(() => {});

    // Optimistically update React state only
    setPinsState(prev => prev + amount);

    const tx: PinTransaction = {
      id: generateTxId('tx'),
      type: 'earn',
      amount,
      reason: reason ?? source.replace(/_/g, ' '),
      source,
      timestamp: Date.now(),
    };
    setPinHistoryState(prev => [tx, ...prev].slice(0, 100));
    toast.success(`+${amount} Pins Credited ⚡`, reason ?? `${source.replace(/_/g, ' ')} completed`);
  }, []);

  const canAfford = useCallback((featureKey: string): boolean => {
    const cost = PIN_COSTS[featureKey]?.cost ?? 0;
    return (pins + bonusPins) >= cost;
  }, [pins, bonusPins]);

  const spendPins = useCallback(async (featureKey: string, itemId?: string, customReason?: string): Promise<boolean> => {
    const meta = PIN_COSTS[featureKey];
    if (!meta) return true;
    const totalAvailable = pins + bonusPins;
    if (totalAvailable < meta.cost) {
      toast.error(`Insufficient Pins 📌`, `Need ${meta.cost} pins for ${meta.label}. Basic plan students receive 120 pins daily at 1:00 AM IST, or top up at ₹1 = 10 pins.`);
      return false;
    }

    if (effectiveUserId && effectiveUserId !== 'guest') {
      try {
        const result = await spendPinsDB(effectiveUserId, featureKey, itemId);
        if (!result.ok) {
          toast.error(`Pins Out of Sync 🔄`, result.reason === 'INSUFFICIENT_PINS' ? 'Insufficient pins in authoritative balance.' : 'Failed to deduct pins on server.');
          return false;
        }
        if (typeof result.newBalance === 'number') {
          setPinsState(result.newBalance);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ value: result.newBalance, ts: Date.now() }));
          } catch {}
        }
        if (typeof result.newBonusBalance === 'number') {
          setBonusPinsState(result.newBonusBalance);
        }
      } catch {
        toast.error(`Pins Spend Error ⚠️`, 'Network error verifying pin deduction.');
        return false;
      }
    } else {
      if (pins >= meta.cost) {
        setPinsState(prev => Math.max(0, prev - meta.cost));
      } else {
        const fromDaily = pins;
        const fromBonus = meta.cost - fromDaily;
        setPinsState(0);
        setBonusPinsState(prev => Math.max(0, prev - fromBonus));
      }
    }

    const tx: PinTransaction = {
      id: generateTxId('tx'),
      type: 'spend',
      amount: meta.cost,
      reason: customReason ?? meta.label,
      source: featureKey as PinSource,
      timestamp: Date.now(),
    };
    setPinHistoryState(prev => [tx, ...prev].slice(0, 100));
    return true;
  }, [pins, bonusPins, effectiveUserId]);

  const claimBonusPins = useCallback(async (amount?: number): Promise<boolean> => {
    try {
      const res = await api.post<any>('/api/pins/claim-bonus', { amount });
      if (res?.ok) {
        if (typeof res.newPins === 'number') {
          setPinsState(res.newPins);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ value: res.newPins, ts: Date.now() }));
          } catch {}
        }
        if (typeof res.remainingBonus === 'number') setBonusPinsState(res.remainingBonus);
        toast.success('Pins Claimed! ⚡', res.message || `+${res.claimed} pins transferred to active balance.`);
        return true;
      } else {
        toast.error('Claim Failed', res?.message || 'Could not claim bonus pins.');
        return false;
      }
    } catch (err: any) {
      toast.error('Claim Error', err?.message || 'Failed to claim bonus pins.');
      return false;
    }
  }, []);

  return {
    pins,
    setPins: savePins,
    bonusPins,
    setBonusPins: setBonusPinsState,
    claimBonusPins,
    pinHistory,
    setPinsHistory: saveHistory,
    earnPins,
    spendPins,
    canAfford,
    isLoaded,
  };
}
