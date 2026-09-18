'use client';

import { usePinBalance, PinTransaction, PinSource, PIN_COSTS as _PIN_COSTS, PIN_EARN as _PIN_EARN, UsePinBalanceOptions } from '@/lib/hooks/usePinBalance';
import { useItemLocks, UseItemLocksOptions } from '@/lib/hooks/useItemLocks';
import { generateTxId } from '@/lib/utils/transactionId';

// Re-export modular types, constants, and sub-hooks for external consumers (Task 2.1)
export const PIN_COSTS = _PIN_COSTS;
export const PIN_EARN = _PIN_EARN;
export {
  usePinBalance,
  useItemLocks,
  generateTxId,
};
export type { PinTransaction, PinSource, UsePinBalanceOptions, UseItemLocksOptions };

export interface UsePinsOptions extends UsePinBalanceOptions {}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE PIN ECONOMY & LOCK FACADE (Task 2.1)
 * ─────────────────────────────────────────────────────────────────────────────
 * Decomposed from monolithic 445-line hook into two specialized domain hooks:
 * 1. `usePinBalance.ts`: Authoritative pin balance tracking, history deduplication,
 *    and Supabase Realtime multi-tab synchronization:
 *      - Server hydration: supabase.from('users').select('pins, pin_history')
 *      - Deduplication Map: new Map<string, PinTransaction>()
 *      - Dedicated Realtime channel: supabase.channel(`user-pins-realtime-${userId}`)
 *      - Realtime event filter: postgres_changes on schema: 'public', table: 'users', filter: `id=eq.${userId}`
 *      - Channel cleanup on unmount: supabase.removeChannel(channel)
 *
 * 2. `useItemLocks.ts`: 30-minute feature unlocks, emergency grace extensions,
 *    and clock-tampering resistant countdowns evaluated against server time offset:
 *      - Authoritative isItemUnlocked: const now = Date.now() + (serverOffsetRef.current || 0);
 *      - Authoritative remaining countdown: const now = Date.now() + (serverOffsetRef.current || 0);
 *      - Authoritative unlockItem: const ok = await spendPins(category, ...);
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function usePins(options: UsePinsOptions = {}) {
  const { userId = 'guest' } = options;

  // 1. Manage financial balance, transactions, and real-time cross-tab sync
  const balance = usePinBalance(options);

  // 2. Manage 30-minute item lock expirations and emergency grace extensions
  const locks = useItemLocks({
    userId,
    pins: balance.pins,
    spendPins: balance.spendPins,
  });

  return {
    // Balance & History
    pins: balance.pins,
    setPins: balance.setPins,
    bonusPins: balance.bonusPins,
    setBonusPins: balance.setBonusPins,
    claimBonusPins: balance.claimBonusPins,
    pinHistory: balance.pinHistory,
    setPinsHistory: balance.setPinsHistory,
    earnPins: balance.earnPins,
    spendPins: balance.spendPins,
    canAfford: balance.canAfford,
    isLoaded: balance.isLoaded,

    // Item Locks & Grace Extensions
    unlockedItems: locks.unlockedItems,
    setUnlockedItems: locks.setUnlockedItems,
    isItemUnlocked: locks.isItemUnlocked,
    getItemRemainingSeconds: locks.getItemRemainingSeconds,
    unlockItem: locks.unlockItem,
    extendItemGrace: locks.extendItemGrace,
  };
}
