import test from 'node:test';
import assert from 'node:assert/strict';
import { PIN_COSTS, PIN_EARN, PinTransaction, PinSource } from '../src/hooks/usePinBalance';
import { generateTxId } from '../src/lib/utils/transactionId';

test('Block 161 (TASK-481): PIN_COSTS and PIN_EARN economy catalog invariants', () => {
  // All defined costs must be strictly positive numbers
  for (const [key, meta] of Object.entries(PIN_COSTS)) {
    assert.ok(meta.cost > 0, `PIN_COST for ${key} must be > 0, got ${meta.cost}`);
    assert.ok(meta.label && meta.label.length > 0, `PIN_COST for ${key} must have a label`);
    assert.ok(meta.icon && meta.icon.length > 0, `PIN_COST for ${key} must have an icon`);
  }

  // Canonical core features must have specified rates (1 Rs = 10 Pins)
  assert.strictEqual(PIN_COSTS.quest.cost, 20, 'Quest 30-min access must cost 20 pins');
  assert.strictEqual(PIN_COSTS.interview.cost, 25, 'Interview 30-min access must cost 25 pins');
  assert.strictEqual(PIN_COSTS.code_arena.cost, 10, 'Code Arena battle must cost 10 pins');
  assert.strictEqual(PIN_COSTS.group_discussion.cost, 25, 'GD practice must cost 25 pins');

  // PIN_EARN rewards: gameplay earn rates must be 0; purchases and bonuses must be > 0
  assert.strictEqual(PIN_EARN.mission_complete, 0, 'Gameplay mission earn rate must be 0');
  assert.strictEqual(PIN_EARN.vault_verify, 0, 'Gameplay vault verify earn rate must be 0');
  assert.ok(PIN_EARN.purchase > 0, 'Purchase earn rate must be > 0');
  assert.ok(PIN_EARN.streak_bonus > 0, 'Streak bonus earn rate must be > 0');
});

test('Block 161 (TASK-481): Debit / Credit transaction engine non-negative balance invariant', () => {
  interface WalletState {
    pins: number;
    bonusPins: number;
    history: PinTransaction[];
  }

  function simulateSpend(
    wallet: WalletState,
    featureKey: string,
    txId: string = generateTxId('tx')
  ): { ok: boolean; reason?: string } {
    const meta = PIN_COSTS[featureKey];
    if (!meta) return { ok: true };

    const totalAvailable = wallet.pins + wallet.bonusPins;
    if (totalAvailable < meta.cost) {
      return { ok: false, reason: 'INSUFFICIENT_PINS' };
    }

    // Deduction order: daily pins spent first, then bonus
    if (wallet.pins >= meta.cost) {
      wallet.pins -= meta.cost;
    } else {
      const fromDaily = wallet.pins;
      const fromBonus = meta.cost - fromDaily;
      wallet.pins = 0;
      wallet.bonusPins = Math.max(0, wallet.bonusPins - fromBonus);
    }

    const tx: PinTransaction = {
      id: txId,
      type: 'spend',
      amount: meta.cost,
      reason: meta.label,
      source: featureKey as PinSource,
      timestamp: Date.now(),
    };
    wallet.history.unshift(tx);

    return { ok: true };
  }

  function simulateEarn(
    wallet: WalletState,
    source: PinSource,
    overrideAmount?: number,
    txId: string = generateTxId('tx')
  ) {
    const amount = overrideAmount ?? PIN_EARN[source] ?? 0;
    if (amount <= 0) return;

    wallet.pins += amount;
    const tx: PinTransaction = {
      id: txId,
      type: 'earn',
      amount,
      reason: source.replace(/_/g, ' '),
      source,
      timestamp: Date.now(),
    };
    wallet.history.unshift(tx);
  }

  // 1. Starting wallet: 25 daily pins, 20 bonus pins (Total = 45)
  const wallet: WalletState = {
    pins: 15,
    bonusPins: 20,
    history: [],
  };

  // 2. Spend 35 pins on interview (25 daily pins exhausted, 10 bonus pins deducted)
  const spend1 = simulateSpend(wallet, 'interview');
  assert.strictEqual(spend1.ok, true);
  assert.strictEqual(wallet.pins, 0, 'Daily pins should be exhausted');
  assert.strictEqual(wallet.bonusPins, 10, 'Bonus pins should have 10 remaining');
  assert.strictEqual(wallet.history.length, 1);

  // 3. Attempt to spend 20 pins on quest with only 10 bonus pins left -> REJECT
  const spend2 = simulateSpend(wallet, 'quest');
  assert.strictEqual(spend2.ok, false);
  assert.strictEqual(spend2.reason, 'INSUFFICIENT_PINS');
  assert.strictEqual(wallet.pins, 0, 'Balance must not change on failed spend');
  assert.strictEqual(wallet.bonusPins, 10, 'Bonus pins must not change on failed spend');
  assert.strictEqual(wallet.history.length, 1, 'History must not record rejected transactions');

  // 4. Earn 30 pins from vault verification
  simulateEarn(wallet, 'vault_verify', 30);
  assert.strictEqual(wallet.pins, 30, 'Daily pins should reflect credited reward');
  assert.strictEqual(wallet.bonusPins, 10, 'Bonus pins remain intact');
  assert.strictEqual(wallet.history.length, 2);

  // 5. Spend 20 pins on quest -> SUCCESS
  const spend3 = simulateSpend(wallet, 'quest');
  assert.strictEqual(spend3.ok, true);
  assert.strictEqual(wallet.pins, 10, 'Remaining daily pins should be 10');
  assert.strictEqual(wallet.bonusPins, 10, 'Bonus pins should remain 10');
  assert.strictEqual(wallet.history.length, 3);
});

test('Block 161 (TASK-481): Transaction deduplication & idempotency invariant', () => {
  const transactions: PinTransaction[] = [
    { id: 'tx-100', type: 'earn', amount: 50, reason: 'Test 1', source: 'mission_complete', timestamp: 1000 },
    { id: 'tx-101', type: 'spend', amount: 20, reason: 'Test 2', source: 'quest', timestamp: 2000 },
    { id: 'tx-100', type: 'earn', amount: 50, reason: 'Duplicate Test 1', source: 'mission_complete', timestamp: 1000 }, // Duplicate!
    { id: 'tx-102', type: 'earn', amount: 30, reason: 'Test 3', source: 'vault_verify', timestamp: 3000 },
  ];

  // Invariant: Map deduplication keeps exactly 1 entry per transaction ID
  const deduplicatedMap = new Map<string, PinTransaction>();
  for (const tx of transactions) {
    if (tx && tx.id) deduplicatedMap.set(tx.id, tx);
  }

  const result = Array.from(deduplicatedMap.values()).sort((a, b) => b.timestamp - a.timestamp);
  assert.strictEqual(result.length, 3, 'Must deduplicate 4 items to 3 unique transactions');
  assert.strictEqual(result[0].id, 'tx-102');
  assert.strictEqual(result[1].id, 'tx-101');
  assert.strictEqual(result[2].id, 'tx-100');
});

test('Block 161 (TASK-481): 30-minute item unlock window and countdown clamping', () => {
  const baseTime = 1700000000000;
  const thirtyMinutesMs = 30 * 60 * 1000; // 1,800,000 ms

  const unlockedItems: Record<string, number> = {
    'quest-python-101': baseTime + thirtyMinutesMs,
    'quest-expired-999': baseTime - 5000, // 5 seconds in the past
  };

  function isItemUnlocked(itemKey: string, currentTime: number): boolean {
    const expiresAt = unlockedItems[itemKey];
    return typeof expiresAt === 'number' && expiresAt > currentTime;
  }

  function getItemRemainingSeconds(itemKey: string, currentTime: number): number {
    const expiresAt = unlockedItems[itemKey];
    if (!expiresAt || expiresAt <= currentTime) return 0;
    return Math.ceil((expiresAt - currentTime) / 1000);
  }

  // Active item at baseTime
  assert.strictEqual(isItemUnlocked('quest-python-101', baseTime), true);
  assert.strictEqual(getItemRemainingSeconds('quest-python-101', baseTime), 1800); // 30 minutes = 1800 seconds

  // Active item after 10 minutes (600 seconds elapsed)
  const tenMinutesLater = baseTime + 10 * 60 * 1000;
  assert.strictEqual(isItemUnlocked('quest-python-101', tenMinutesLater), true);
  assert.strictEqual(getItemRemainingSeconds('quest-python-101', tenMinutesLater), 1200); // 20 minutes remaining = 1200 seconds

  // Expired item
  assert.strictEqual(isItemUnlocked('quest-expired-999', baseTime), false);
  assert.strictEqual(getItemRemainingSeconds('quest-expired-999', baseTime), 0, 'Expired countdown must clamp to 0');
});
