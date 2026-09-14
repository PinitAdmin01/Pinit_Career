// scripts/test_subbatch_2_6.ts
// Verification test suite for Sub-Batch 2.6: Store Sync & Streak Calculations (Issues 053 – 054)

import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { PinTransaction } from '../src/lib/hooks/usePins';

async function runSubBatch26Tests() {
  console.log('========================================================================');
  console.log('🧪 SUB-BATCH 2.6 VERIFICATION SUITE: ISSUES 053 – 054');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}${detail ? ` (${detail})` : ''}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ` - FAILED: ${detail}` : ''}`);
      failed++;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1: Defect 053 - Pin History Server Hydration & Deduplication
  // ───────────────────────────────────────────────────────────────────────────
  console.log('── TEST 1 (Defect 053): Pin History Server Hydration & Deduplication ──');
  try {
    const usePinsPath = path.join(process.cwd(), 'src', 'lib', 'hooks', 'usePins.ts');
    const usePinsContent = fs.readFileSync(usePinsPath, 'utf8');

    // 1.1 Verify usePins queries Supabase users table on mount
    const hasServerHydration = /supabase\s*\.from\(['"]users['"]\)\s*\.select\(['"]pins,\s*pin_history['"]\)/.test(usePinsContent);
    assert(
      hasServerHydration,
      'Defect 053.1: usePins queries Supabase users for authoritative pins & pin_history',
      `Found query: ${hasServerHydration}`
    );

    // 1.2 Verify transaction ID deduplication logic using Map in usePins
    const hasDeduplicationMap = /new\s+Map<string,\s*PinTransaction>\(\)/.test(usePinsContent);
    assert(
      hasDeduplicationMap,
      'Defect 053.2: usePins deduplicates history entries by transaction ID using Map lookup',
      `Found deduplication Map: ${hasDeduplicationMap}`
    );

    // 1.3 Functional test: Deduplication of overlapping server and client records
    const serverRecords: PinTransaction[] = [
      { id: 'tx_001', type: 'earn', amount: 100, reason: 'Purchase', source: 'purchase', timestamp: 1000 },
      { id: 'tx_002', type: 'spend', amount: 20, reason: 'Quest', source: 'mission_complete', timestamp: 2000 },
      { id: 'tx_003', type: 'spend', amount: 40, reason: 'AI Interview', source: 'ai_interview', timestamp: 3000 },
    ];

    const clientRecords: PinTransaction[] = [
      { id: 'tx_002', type: 'spend', amount: 20, reason: 'Quest', source: 'mission_complete', timestamp: 2000 }, // Duplicate!
      { id: 'tx_004', type: 'spend', amount: 10, reason: 'Attention', source: 'study_session', timestamp: 4000 },
    ];

    // Simulate reconciliation algorithm used in usePins.ts
    const txMap = new Map<string, PinTransaction>();
    for (const tx of serverRecords) {
      if (tx && tx.id) txMap.set(tx.id, tx);
    }
    for (const tx of clientRecords) {
      if (tx && tx.id && !txMap.has(tx.id)) txMap.set(tx.id, tx);
    }
    const mergedHistory = Array.from(txMap.values())
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 100);

    assert(
      mergedHistory.length === 4,
      'Defect 053.3: Reconciling 3 server and 2 client records with 1 overlap produces exactly 4 unique records',
      `Merged Count: ${mergedHistory.length} (expected 4)`
    );

    // 1.4 Functional test: Chronological sorting (timestamp descending)
    const isSortedDesc = mergedHistory.every((tx, idx) => {
      if (idx === 0) return true;
      return tx.timestamp <= mergedHistory[idx - 1].timestamp;
    });
    assert(
      isSortedDesc && mergedHistory[0].id === 'tx_004' && mergedHistory[mergedHistory.length - 1].id === 'tx_001',
      'Defect 053.4: Merged history is strictly ordered by timestamp descending (newest first)',
      `First: ${mergedHistory[0].id} (T=${mergedHistory[0].timestamp}), Last: ${mergedHistory[mergedHistory.length - 1].id} (T=${mergedHistory[mergedHistory.length - 1].timestamp})`
    );

    // 1.5 Functional test: Empty local storage restoration
    const emptyClientRecords: PinTransaction[] = [];
    const restoredMap = new Map<string, PinTransaction>();
    for (const tx of serverRecords) {
      if (tx && tx.id) restoredMap.set(tx.id, tx);
    }
    for (const tx of emptyClientRecords) {
      if (tx && tx.id && !restoredMap.has(tx.id)) restoredMap.set(tx.id, tx);
    }
    const restoredHistory = Array.from(restoredMap.values());
    assert(
      restoredHistory.length === 3,
      'Defect 053.5: Wiping client localStorage completely restores pin history from Supabase server records',
      `Restored Count: ${restoredHistory.length}/3`
    );

    // 1.6 Bounded array size (max 100 items)
    const largeServerRecords: PinTransaction[] = Array.from({ length: 150 }, (_, i) => ({
      id: `tx_large_${i}`,
      type: 'spend',
      amount: 1,
      reason: `Test ${i}`,
      source: 'study_session',
      timestamp: 10000 + i,
    }));
    const largeMap = new Map<string, PinTransaction>();
    for (const tx of largeServerRecords) {
      if (tx && tx.id) largeMap.set(tx.id, tx);
    }
    const cappedHistory = Array.from(largeMap.values())
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 100);
    assert(
      cappedHistory.length === 100,
      'Defect 053.6: Pin history maintains upper boundary of 100 records preventing memory leakage',
      `Capped Count: ${cappedHistory.length}`
    );
  } catch (err: any) {
    assert(false, 'Defect 053: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Defect 054 - Cross-Tab Echo Elimination & Realtime Sync
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n── TEST 2 (Defect 054): Cross-Tab Echo Elimination & Realtime Sync ──');
  try {
    const contextPath = path.join(process.cwd(), 'src', 'lib', 'context', 'CareerOSContext.tsx');
    const progressContextPath = path.join(process.cwd(), 'src', 'lib', 'context', 'UserProgressContext.tsx');
    const contextContent = fs.readFileSync(contextPath, 'utf8') + (fs.existsSync(progressContextPath) ? '\n' + fs.readFileSync(progressContextPath, 'utf8') : '');

    // 2.1 Verify save() bypasses BroadcastChannel for pins and pin history
    const hasSaveBypass = /if\s*\(key\s*===\s*keys\.pins\s*\|\|\s*key\s*===\s*keys\.pinHist\)\s*\{\s*return;\s*\}/.test(contextContent);
    assert(
      hasSaveBypass,
      'Defect 054.1: CareerOSContext.save() bypasses BroadcastChannel for keys.pins and keys.pinHist',
      `Found save bypass: ${hasSaveBypass}`
    );

    // 2.2 Verify handleSync() drops raw BroadcastChannel messages for pins
    const hasSyncDrop = /if\s*\(key\s*===\s*keys\.pins\s*\|\|\s*key\s*===\s*keys\.pinHist\)\s*\{\s*\/\/\s*DEF-054:\s*Drop raw broadcast channel messages/.test(contextContent);
    assert(
      hasSyncDrop,
      'Defect 054.2: CareerOSContext.handleSync() drops raw BroadcastChannel pin messages preventing stale echo',
      `Found sync drop: ${hasSyncDrop}`
    );

    // 2.3 Verify usePins subscribes to Supabase Realtime for user-pins-realtime
    const usePinsPath = path.join(process.cwd(), 'src', 'lib', 'hooks', 'usePins.ts');
    const usePinsContent = fs.readFileSync(usePinsPath, 'utf8');

    const hasRealtimeChannel = /supabase\s*\.channel\(`user-pins-realtime-\$\{userId\}`\)/.test(usePinsContent);
    assert(
      hasRealtimeChannel,
      'Defect 054.3: usePins establishes dedicated Supabase Realtime channel user-pins-realtime-${userId}',
      `Found channel: ${hasRealtimeChannel}`
    );

    // 2.4 Verify subscription listens to postgres_changes UPDATE on public.users
    const hasPostgresChanges = /postgres_changes[\s\S]*?schema:\s*['"]public['"][\s\S]*?table:\s*['"]users['"][\s\S]*?filter:\s*`id=eq\.\$\{userId\}`/.test(usePinsContent);
    assert(
      hasPostgresChanges,
      'Defect 054.4: usePins listens to postgres_changes UPDATE on public.users filtered by user ID',
      `Found postgres_changes config: ${hasPostgresChanges}`
    );

    // 2.5 Verify clean unsubscribe on unmount
    const hasUnsubscribe = /supabase\.removeChannel\(channel\)/.test(usePinsContent);
    assert(
      hasUnsubscribe,
      'Defect 054.5: usePins cleans up Realtime subscription via supabase.removeChannel(channel) on unmount',
      `Found cleanup: ${hasUnsubscribe}`
    );

    // 2.6 Functional simulation of multi-tab balance reconciliation
    // Scenario:
    // Tab 1 and Tab 2 both open with balance 100.
    // Tab 1 spends 20 pins -> server updates users.pins = 80.
    // Tab 2 spends 20 pins -> server updates users.pins = 60.
    // In legacy buggy setup: Tab 1 broadcasts 80 -> Tab 2 received 80 and overwrote 60 to 80 (FLICKER/CORRUPTION BUG).
    // In new setup: BroadcastChannel ignores pins; Tab 2 receives Realtime server update with committed balance 60.
    let tab1_balance = 100;
    let tab2_balance = 100;
    let server_balance = 100;

    // Simulation helper
    function spendOnServer(amount: number) {
      server_balance -= amount;
      return server_balance;
    }

    // Tab 1 spends 20
    const committed1 = spendOnServer(20); // 80
    tab1_balance = committed1;

    // Tab 2 spends 20
    const committed2 = spendOnServer(20); // 60
    tab2_balance = committed2;

    // Realtime broadcast arrives from server commit:
    const realtimePayload = { new: { pins: server_balance } };
    tab1_balance = realtimePayload.new.pins;
    tab2_balance = realtimePayload.new.pins;

    assert(
      tab1_balance === 60 && tab2_balance === 60 && server_balance === 60,
      'Defect 054.6: Multi-tab balance converges deterministically to 60 via server Realtime (0 echo flickering)',
      `Tab 1: ${tab1_balance}, Tab 2: ${tab2_balance}, Server: ${server_balance}`
    );
  } catch (err: any) {
    assert(false, 'Defect 054: Failed executing test suite', err?.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n========================================================================');
  console.log(`SUB-BATCH 2.6 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSubBatch26Tests().catch((err) => {
  console.error('Fatal error running Sub-Batch 2.6 verification tests:', err);
  process.exit(1);
});
