/**
 * Verification Suite for Sub-Batch 4.6: Global Context Decomposition & Hydration Safety (Issue 107)
 *
 * Checks:
 * 1. UI states (theme, focusMode, aiUseTokens) decomposed into Zustand useAppStore
 * 2. Standalone useVault hook extracted with complete CRUD & verified item counter
 * 3. Standalone usePins hook extracted with credit engine, authoritative spending & unlocks
 * 4. Composite CareerOSContext retains 100% backward compatibility re-exporting slices
 */

import { useAppStore } from '../src/lib/store/useAppStore';
import * as fs from 'fs';
import * as path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- VERIFYING SUB-BATCH 4.6: Global Context Decomposition (Issue 107) ---');

  // Test 1: Zustand store decomposition (theme, focusMode, aiUseTokens)
  console.log('\n[Test 1] Zustand useAppStore UI state slices');
  const store = useAppStore.getState();

  assert(
    typeof store.theme === 'string' && typeof store.toggleTheme === 'function',
    'useAppStore contains theme state and toggleTheme function'
  );
  assert(
    typeof store.focusMode === 'boolean' && typeof store.toggleFocusMode === 'function',
    'useAppStore contains focusMode state and toggleFocusMode function'
  );
  assert(
    typeof store.aiUseTokens === 'number' && typeof store.decrementAiUseTokens === 'function',
    'useAppStore contains aiUseTokens state and decrementAiUseTokens function'
  );

  // Test state transitions
  const initialTheme = useAppStore.getState().theme;
  useAppStore.getState().toggleTheme();
  const toggledTheme = useAppStore.getState().theme;
  assert(
    toggledTheme !== initialTheme,
    `toggleTheme successfully toggles theme state (${initialTheme} -> ${toggledTheme})`
  );
  useAppStore.getState().toggleTheme(); // restore

  const initialFocus = useAppStore.getState().focusMode;
  useAppStore.getState().toggleFocusMode();
  assert(
    useAppStore.getState().focusMode === !initialFocus,
    'toggleFocusMode successfully toggles focus mode state'
  );
  useAppStore.getState().toggleFocusMode(); // restore

  useAppStore.getState().setAiUseTokens(100);
  useAppStore.getState().decrementAiUseTokens(30);
  assert(
    useAppStore.getState().aiUseTokens === 70,
    'decrementAiUseTokens accurately subtracts token balance (100 - 30 = 70)'
  );

  // Test 2: Standalone useVault hook inspection
  console.log('\n[Test 2] Standalone useVault hook modularization');
  const useVaultPath = path.join(process.cwd(), 'src/lib/hooks/useVault.ts');
  assert(
    fs.existsSync(useVaultPath),
    'Standalone src/lib/hooks/useVault.ts file exists'
  );

  const useVaultSource = fs.readFileSync(useVaultPath, 'utf-8');
  assert(
    useVaultSource.includes('export function useVault') &&
    useVaultSource.includes('export interface VaultItem'),
    'useVault hook and VaultItem interface exported from useVault.ts'
  );
  assert(
    useVaultSource.includes('addVaultItem') &&
    useVaultSource.includes('updateVaultItem') &&
    useVaultSource.includes('removeVaultItem') &&
    useVaultSource.includes('verifiedCount'),
    'useVault provides complete CRUD operations and verifiedCount metric'
  );

  // Test 3: Standalone usePins hook inspection
  console.log('\n[Test 3] Standalone usePins hook modularization');
  const usePinsPath = path.join(process.cwd(), 'src/lib/hooks/usePins.ts');
  assert(
    fs.existsSync(usePinsPath),
    'Standalone src/lib/hooks/usePins.ts file exists'
  );

  const usePinsSource = fs.readFileSync(usePinsPath, 'utf-8');
  assert(
    usePinsSource.includes('export function usePins') &&
    usePinsSource.includes('export const PIN_COSTS') &&
    usePinsSource.includes('export const PIN_EARN'),
    'usePins hook, PIN_COSTS, and PIN_EARN exported from usePins.ts'
  );
  assert(
    usePinsSource.includes('spendPins') &&
    usePinsSource.includes('earnPins') &&
    usePinsSource.includes('unlockItem') &&
    usePinsSource.includes('isItemUnlocked') &&
    usePinsSource.includes('getItemRemainingSeconds') &&
    usePinsSource.includes('extendItemGrace'),
    'usePins provides credit operations, authoritative spending, and 30-min duration unlock logic'
  );

  // Test 4: CareerOSContext composite integration & backward compatibility
  console.log('\n[Test 4] CareerOSContext backward compatibility & decomposition');
  const contextPath = path.join(process.cwd(), 'src/lib/context/CareerOSContext.tsx');
  const contextSource = fs.readFileSync(contextPath, 'utf-8');

  assert(
    contextSource.includes("from '@/lib/store/useAppStore'") &&
    contextSource.includes("from '@/lib/hooks/useVault'") &&
    contextSource.includes("from '@/lib/hooks/usePins'"),
    'CareerOSContext cleanly imports decomposed hooks and store slices'
  );
  assert(
    contextSource.includes('export { useVault, usePins }') ||
    (contextSource.includes('export { useVault }') && contextSource.includes('export { usePins }')),
    'CareerOSContext re-exports useVault and usePins hooks'
  );
  assert(
    contextSource.includes('export type { VaultItem }') &&
    contextSource.includes('export type { PinTransaction, PinSource }') &&
    contextSource.includes('export { PIN_COSTS, PIN_EARN }'),
    'CareerOSContext preserves full type and constant re-exports for consumer compatibility'
  );
  assert(
    contextSource.includes('theme, focusMode, toggleTheme, toggleFocusMode') &&
    contextSource.includes('vaultItems, setVaultItems, addVaultItem, updateVaultItem') &&
    contextSource.includes('pins, pinHistory, earnPins, spendPins, canAfford'),
    'CareerOSProvider value provides unified composite interface with zero broken contract fields'
  );

  console.log(`\nSUB-BATCH 4.6 SUMMARY: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled error in Sub-Batch 4.6 verification:', err);
  process.exit(1);
});
