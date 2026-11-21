import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DAILY_PIN_CAP,
  canSpendFromCurrentPins,
  computeBonusClaimToCurrent,
  computeDailyResetWallet,
  computeSubscriptionActivation,
  spendFromCurrentPinsOnly,
  splitCreditIntoWallets,
} from '../src/lib/pins/pinWalletRules';
import { POST as dailyPinResetPost } from '../src/app/api/cron/daily-pin-reset/route';
import { POST as claimBonusPost } from '../src/app/api/pins/claim-bonus/route';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';

test('Task 1: 1:00 AM IST Daily Reset sets EVERY user Current Pins strictly to 120 and preserves Bonus Vault', () => {
  // User with > 1000 legacy current pins resets strictly down to 120
  assert.deepEqual(computeDailyResetWallet(1050, 400), { pins: 120, bonusPins: 400 });
  // User with 0 current pins refills strictly up to 120
  assert.deepEqual(computeDailyResetWallet(0, 0), { pins: 120, bonusPins: 0 });
  // User with 119 current pins resets strictly to 120
  assert.deepEqual(computeDailyResetWallet(119, 99999), { pins: 120, bonusPins: 99999 });
  // Negative corrupt value normalizes cleanly
  assert.deepEqual(computeDailyResetWallet(-25, 50), { pins: 120, bonusPins: 50 });
});

test('Task 1: Purchase credits BOTH Current Pins (up to 120 cap) and unlimited Bonus Vault at once', () => {
  // User has 20 current + 0 bonus, purchases 1000 pins -> +100 to current (120/120), +900 to bonus
  assert.deepEqual(splitCreditIntoWallets(20, 0, 1000), {
    newPins: 120,
    newBonus: 900,
    toCurrent: 100,
    toBonus: 900,
  });

  // User has 0 current + 50 bonus, purchases 100 pins -> +100 to current (100/120), +0 to bonus
  assert.deepEqual(splitCreditIntoWallets(0, 50, 100), {
    newPins: 100,
    newBonus: 50,
    toCurrent: 100,
    toBonus: 0,
  });

  // User already at 120/120 current + 250 bonus, purchases 350 pins -> +0 current, +350 bonus (unlimited)
  assert.deepEqual(splitCreditIntoWallets(120, 250, 350), {
    newPins: 120,
    newBonus: 600,
    toCurrent: 0,
    toBonus: 350,
  });

  // User with 119 current + 0 bonus, purchases 100 pins -> +1 current (120/120), +99 bonus
  assert.deepEqual(splitCreditIntoWallets(119, 0, 100), {
    newPins: 120,
    newBonus: 99,
    toCurrent: 1,
    toBonus: 99,
  });

  // Subscription activation caps current at 120 and safely preserves legacy >120 overflow in bonus
  assert.deepEqual(computeSubscriptionActivation(20, 100, 500), {
    newPins: 120,
    newBonus: 600,
    toCurrent: 100,
    toBonus: 500,
  });
  assert.deepEqual(computeSubscriptionActivation(300, 100, 0), {
    newPins: 120,
    newBonus: 280,
    toCurrent: 0,
    toBonus: 180,
  });
});

test('Task 1: Refill Current Pins (0..119) from Bonus Vault strictly respects 120 max capacity', () => {
  // User has 20 current + 1000 bonus -> claims 100 (fills to 120/120), 900 remain in bonus
  assert.deepEqual(computeBonusClaimToCurrent(20, 1000), {
    ok: true,
    claimed: 100,
    newPins: 120,
    remainingBonus: 900,
    spaceInCurrent: 100,
  });

  // Explicit over-request (500) still caps at remaining room (100)
  assert.deepEqual(computeBonusClaimToCurrent(20, 1000, 500), {
    ok: true,
    claimed: 100,
    newPins: 120,
    remainingBonus: 900,
    spaceInCurrent: 100,
  });

  // Partial refill when bonus < room
  assert.deepEqual(computeBonusClaimToCurrent(50, 30), {
    ok: true,
    claimed: 30,
    newPins: 80,
    remainingBonus: 0,
    spaceInCurrent: 70,
  });

  // Already at 120/120 -> rejected with CURRENT_PINS_FULL
  assert.deepEqual(computeBonusClaimToCurrent(120, 1000), {
    ok: false,
    error: 'CURRENT_PINS_FULL',
    claimed: 0,
    newPins: 120,
    remainingBonus: 1000,
    spaceInCurrent: 0,
  });

  // No bonus pins -> rejected with NO_BONUS_PINS
  assert.deepEqual(computeBonusClaimToCurrent(50, 0), {
    ok: false,
    error: 'NO_BONUS_PINS',
    claimed: 0,
    newPins: 50,
    remainingBonus: 0,
    spaceInCurrent: 70,
  });
});

test('Task 2: Every feature usage deducts STRICTLY from Current Pins, NEVER Bonus Pins', () => {
  // Exact scenario reported by user: 20 current + 1000 bonus, trying to start 25-pin Interview
  assert.equal(canSpendFromCurrentPins(20, 25), false);
  const rejected = spendFromCurrentPinsOnly(20, 1000, 25);
  assert.deepEqual(rejected, {
    ok: false,
    error: 'INSUFFICIENT_PINS',
    newPins: 20,
    newBonus: 1000,
    shortfall: 5,
    canRefillFromBonus: true,
    refillableAmount: 100,
  });

  // Refill from Bonus Vault first -> Current becomes 120, Bonus becomes 900
  const refilled = computeBonusClaimToCurrent(20, 1000);
  assert.equal(refilled.ok, true);
  assert.equal(refilled.newPins, 120);
  assert.equal(refilled.remainingBonus, 900);

  // Now spend 25 on Interview -> Current becomes 95, Bonus stays untouched at 900
  assert.equal(canSpendFromCurrentPins(refilled.newPins, 25), true);
  const spent = spendFromCurrentPinsOnly(refilled.newPins, refilled.remainingBonus, 25);
  assert.deepEqual(spent, {
    ok: true,
    newPins: 95,
    newBonus: 900,
    shortfall: 0,
    canRefillFromBonus: false,
    refillableAmount: 0,
  });
});

test('API: POST /api/cron/daily-pin-reset sets pins=120 for ALL users without touching bonus_pins', async () => {
  const prevSecret = process.env.CRON_SECRET;
  process.env.CRON_SECRET = 'test-cron-secret-120';

  const updates: Array<Record<string, unknown>> = [];
  setSupabaseAdminForTests({
    from: () => ({
      update: (payload: Record<string, unknown>) => {
        updates.push(payload);
        const chain: any = {
          eq: () => chain,
          not: () => chain,
          lt: () => chain,
          select: async () => ({ data: [{ id: 'u1' }, { id: 'u2' }], error: null }),
        };
        return chain;
      },
    }),
  });

  try {
    const unauth = await dailyPinResetPost(new Request('http://localhost/api/cron/daily-pin-reset', { method: 'POST' }));
    assert.equal(unauth.status, 401);

    const res = await dailyPinResetPost(
      new Request('http://localhost/api/cron/daily-pin-reset', {
        method: 'POST',
        headers: { Authorization: 'Bearer test-cron-secret-120' },
      })
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(body.dailyCap, DAILY_PIN_CAP);
    assert.equal(body.resetUsersCount, 2);
    assert.equal(body.freeExpiredCount, 0);

    // Verify the reset update wrote pins = 120 and NEVER touched bonus_pins
    const pinUpdate = updates.find((u) => 'pins' in u);
    assert.ok(pinUpdate, 'Expected a pins update call');
    assert.equal(pinUpdate.pins, 120);
    assert.equal('bonus_pins' in pinUpdate, false, 'Cron reset must NEVER overwrite bonus_pins');
  } finally {
    setSupabaseAdminForTests(null);
    process.env.CRON_SECRET = prevSecret;
  }
});

test('API: POST /api/pins/claim-bonus strictly enforces 120 cap before calling RPC', async () => {
  const prevBypass = process.env.ALLOW_DEV_AUTH_BYPASS;
  const prevNodeEnv = process.env.NODE_ENV;
  process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
  (process.env as Record<string, string | undefined>).NODE_ENV = 'test';

  let mockPins = 20;
  let mockBonus = 1000;
  let rpcCalledWith: Record<string, unknown> | null = null;

  setSupabaseAdminForTests({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { pins: mockPins, bonus_pins: mockBonus }, error: null }),
        }),
      }),
    }),
    rpc: async (_fn: string, params: Record<string, unknown>) => {
      rpcCalledWith = params;
      const amt = Number(params.p_amount || 0);
      mockPins += amt;
      mockBonus -= amt;
      return {
        data: { ok: true, claimed: amt, new_pins: mockPins, remaining_bonus: mockBonus },
        error: null,
      };
    },
  });

  try {
    // 1. User at 20 current + 1000 bonus calls claim-bonus with no amount -> caps RPC call at 100!
    const res1 = await claimBonusPost(
      new Request('http://localhost/api/pins/claim-bonus', {
        method: 'POST',
        headers: { Authorization: 'Bearer test-token-user123', 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
    );
    assert.equal(res1.status, 200);
    const body1 = await res1.json();
    assert.equal(body1.ok, true);
    assert.equal(body1.claimed, 100);
    assert.equal(body1.newPins, 120);
    assert.equal(body1.remainingBonus, 900);
    assert.equal(rpcCalledWith?.p_amount, 100, 'RPC must receive capped amount 100, not null/1000');

    // 2. Now user is at 120/120 current + 900 bonus -> rejects with 400 CURRENT_PINS_FULL without calling RPC
    rpcCalledWith = null;
    const res2 = await claimBonusPost(
      new Request('http://localhost/api/pins/claim-bonus', {
        method: 'POST',
        headers: { Authorization: 'Bearer test-token-user123', 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
    );
    assert.equal(res2.status, 400);
    const body2 = await res2.json();
    assert.equal(body2.error, 'CURRENT_PINS_FULL');
    assert.equal(rpcCalledWith, null, 'RPC must not be called when Current Pins are already 120/120');
  } finally {
    setSupabaseAdminForTests(null);
    process.env.ALLOW_DEV_AUTH_BYPASS = prevBypass;
    (process.env as Record<string, string | undefined>).NODE_ENV = prevNodeEnv;
  }
});
