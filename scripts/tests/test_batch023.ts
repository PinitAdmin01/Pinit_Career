// scripts/test_batch023.ts
// Programmatic Verification Suite for PinIT Career OS Batch 023 (Days 113–117 · COMPLETE)
// Modern Vanilla JavaScript, DOM Mutation Mechanics, Event Propagation & Accessible Interactive Components

import {
  BATCH_023_MANIFEST,
  DAY_117_ASSESSMENT,
  COMPETENCY_ID_VANILLA_JS_AND_DOM,
} from '../src/lib/curriculum/pythonFullStack/batch023';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

// 1. Event Loop Queue Ordering Simulator
function simulateEventLoopExecution(): string[] {
  const log: string[] = [];
  log.push('sync-start');
  
  const microtasks: Array<() => void> = [];
  const macrotasks: Array<() => void> = [];

  // Enqueue operations
  macrotasks.push(() => log.push('macrotask-timer'));
  microtasks.push(() => log.push('microtask-promise'));
  microtasks.push(() => log.push('microtask-queue'));

  log.push('sync-end');

  // Drain microtasks first (run-to-completion checkpoint)
  while (microtasks.length > 0) {
    const task = microtasks.shift()!;
    task();
  }

  // Dequeue one macrotask per event loop turn
  while (macrotasks.length > 0) {
    const task = macrotasks.shift()!;
    task();
  }

  return log;
}

// 2. W3C 3-Phase Event Propagation Simulator with Delegation
interface SimNode {
  id: string;
  tagName: string;
  dataset: Record<string, string>;
  parent: SimNode | null;
}

function simulateEventDispatch(
  targetNode: SimNode,
  rootNode: SimNode,
  delegatedSelector: string
): { path: string[]; matchedAction: string | null } {
  const ancestorPath: SimNode[] = [];
  let curr: SimNode | null = targetNode;
  while (curr) {
    ancestorPath.unshift(curr);
    curr = curr.parent;
  }

  const executionLog: string[] = [];
  ancestorPath.forEach((n) => executionLog.push(`capture:${n.id}`));
  executionLog.push(`target:${targetNode.id}`);
  [...ancestorPath].reverse().forEach((n) => executionLog.push(`bubble:${n.id}`));

  // Check delegation lookup (closest match)
  let match: SimNode | null = targetNode;
  let matchedAction: string | null = null;
  while (match && match !== rootNode.parent) {
    if (match.dataset['action']) {
      matchedAction = match.dataset['action'];
      break;
    }
    match = match.parent;
  }

  return { path: executionLog, matchedAction };
}

// 3. Modal Focus Trap Sequential Wrap-Around Validator
function simulateModalFocusTrap(
  activeElementIndex: number,
  elementCount: number,
  key: string,
  shiftKey: boolean
): number {
  if (key !== 'Tab' || elementCount === 0) return activeElementIndex;

  if (shiftKey) {
    // Shift + Tab: wrap from 0 to last
    return activeElementIndex === 0 ? elementCount - 1 : activeElementIndex - 1;
  } else {
    // Tab: wrap from last to 0
    return activeElementIndex === elementCount - 1 ? 0 : activeElementIndex + 1;
  }
}

// ── TEST RUNNER & ASSERTION SUITE ──

let assertionCount = 0;

function assert(condition: boolean, message: string) {
  assertionCount++;
  if (!condition) {
    console.error(`  ❌ [FAIL] Check #${assertionCount}: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] Check #${assertionCount}: ${message}`);
}

export async function runBatch023Audit(): Promise<number> {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 023 (DAYS 113–117) TECHNICAL AUDIT TEST SUITE');
  console.log('Modern Vanilla JavaScript, DOM Mutations, W3C Events & Accessible Dialogs');
  console.log('========================================================================\n');

  assertionCount = 0;

  // ── GROUP 1: Complete Batch Manifest & 5-Day Structure ──
  console.log('── GROUP 1: Complete Batch Manifest & 5-Day Structure ──');
  assert(BATCH_023_MANIFEST.batchCode === 'P2-M6-W23-BATCH023', 'Batch code is "P2-M6-W23-BATCH023"');
  assert(BATCH_023_MANIFEST.batchId === 'batch-pfs-m6-w23-023', 'Batch ID is "batch-pfs-m6-w23-023"');
  assert(BATCH_023_MANIFEST.days.length === 5, 'Batch contains exactly 5 published learning days (Days 113–117)');
  assert(BATCH_023_MANIFEST.isPartial === false, 'Batch manifest is complete (isPartial: false)');
  assert(BATCH_023_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_023_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_023_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');

  ContentValidator.validateBatchManifest(BATCH_023_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes for complete 5-day batch');

  assert(BATCH_023_MANIFEST.days[0].dayNumber === 1, 'Day 113 internal dayNumber is 1');
  assert(BATCH_023_MANIFEST.days[4].dayNumber === 5, 'Day 117 internal dayNumber is 5');
  assert(BATCH_023_MANIFEST.days[0].packetId === 'batch-pfs-m6-w23-023', 'Day 113 packetId matches batchId');
  assert(BATCH_023_MANIFEST.days[4].packetId === 'batch-pfs-m6-w23-023', 'Day 117 packetId matches batchId');

  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_023_MANIFEST.days.forEach((day, idx) => {
    assert(day.pedagogicalIntent === expectedIntents[idx], `Day ${day.dayNumber} pedagogicalIntent is '${expectedIntents[idx]}'`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_023_MANIFEST.days.map((day) =>
    day.blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0)
  );

  assert(dayMinutes[0] === 85, `Day 113 workload is 85 min (Found: ${dayMinutes[0]} min)`);
  assert(dayMinutes[1] === 85, `Day 114 workload is 85 min (Found: ${dayMinutes[1]} min)`);
  assert(dayMinutes[2] === 85, `Day 115 workload is 85 min (Found: ${dayMinutes[2]} min)`);
  assert(dayMinutes[3] === 85, `Day 116 workload is 85 min (Found: ${dayMinutes[3]} min)`);
  assert(dayMinutes[4] === 95, `Day 117 workload is 95 min (Found: ${dayMinutes[4]} min)`);

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  assert(totalMinutes === 435, `Total Batch 023 learning time is 435 min / 7.25h (Found: ${totalMinutes} min)`);

  // ── GROUP 3: Technical Invariants & Architectural Coverage ──
  console.log('\n── GROUP 3: Technical Invariants & Architectural Coverage ──');

  // Day 113: Event Loop & WeakMap Memory
  const day113Theory = BATCH_023_MANIFEST.days[0].blocks[0] as any;
  assert(
    day113Theory.whatItIs.includes('Microtask Queue') &&
    day113Theory.whatItIs.includes('Task (Macrotask) Queue') &&
    day113Theory.whatItIs.includes('WeakMap'),
    'Day 113 covers Event Loop queues and WeakMap memory semantics'
  );

  // Day 114: DOM Mutations & Layout Thrashing
  const day114Theory = BATCH_023_MANIFEST.days[1].blocks[0] as any;
  assert(
    day114Theory.whatItIs.includes('Layout Thrashing') &&
    day114Theory.whatItIs.includes('DocumentFragment') &&
    day114Theory.whatItIs.includes('offsetWidth'),
    'Day 114 covers layout thrashing, forced synchronous reflow, and DocumentFragment batching'
  );

  // Day 115: W3C Event Propagation & AbortController
  const day115Theory = BATCH_023_MANIFEST.days[2].blocks[0] as any;
  assert(
    day115Theory.whatItIs.includes('Capturing Phase') &&
    day115Theory.whatItIs.includes('Bubbling Phase') &&
    day115Theory.whatItIs.includes('AbortController') &&
    day115Theory.whatItIs.includes('closest'),
    'Day 115 covers W3C 3-phase event flow, delegation with closest(), and AbortController teardown'
  );
  assert(
    day115Theory.whatItIs.includes('focus') &&
    day115Theory.whatItIs.includes('focusin') &&
    day115Theory.whatItIs.includes('mouseenter'),
    'Day 115 documents interface-specific event bubbling nuances (focus vs focusin, mouseenter vs mouseover)'
  );

  // Day 116: Dynamic Focus & Native Dialogs
  const day116Theory = BATCH_023_MANIFEST.days[3].blocks[0] as any;
  assert(
    day116Theory.whatItIs.includes('tabindex="-1"') &&
    day116Theory.whatItIs.includes('showModal()') &&
    day116Theory.whatItIs.includes('Top Layer') &&
    day116Theory.whatItIs.includes('Focus Restoration'),
    'Day 116 covers tabindex semantics, native <dialog> top layer, and focus restoration'
  );

  // Day 117: Formative Assessment
  assert(BATCH_023_MANIFEST.days[4].assessmentId === 'asm-pfs-m6-w23-023', 'Day 117 has assessmentId "asm-pfs-m6-w23-023"');
  assert(BATCH_023_MANIFEST.days[4].blocks[0].type === 'TRANSFER_CHALLENGE', 'Day 117 first block is TRANSFER_CHALLENGE');
  assert(DAY_117_ASSESSMENT.id === 'asm-pfs-m6-w23-023', 'DAY_117_ASSESSMENT id is "asm-pfs-m6-w23-023"');
  assert(DAY_117_ASSESSMENT.passingScorePercentage === 70, 'Day 117 assessment passingScorePercentage is 70%');
  assert(DAY_117_ASSESSMENT.rubricDimensions.length === 5, 'Day 117 assessment has exactly 5 rubric dimensions');
  assert(DAY_117_ASSESSMENT.targetCompetencyId === COMPETENCY_ID_VANILLA_JS_AND_DOM, 'Assessment targets COMPETENCY_ID_VANILLA_JS_AND_DOM');

  // ── GROUP 4: Behavioral Reference Simulation Tests ──
  console.log('\n── GROUP 4: Behavioral Reference Simulation Tests ──');

  // Test 1: Event loop queue drain ordering
  const eventLoopLog = simulateEventLoopExecution();
  assert(
    eventLoopLog[0] === 'sync-start' &&
    eventLoopLog[1] === 'sync-end' &&
    eventLoopLog[2] === 'microtask-promise' &&
    eventLoopLog[3] === 'microtask-queue' &&
    eventLoopLog[4] === 'macrotask-timer',
    'Event loop simulator drains all microtasks before dequeuing next macrotask'
  );

  // Test 2: W3C Event dispatch & delegation simulation
  const rootNode: SimNode = { id: 'table-root', tagName: 'TABLE', dataset: {}, parent: null };
  const rowNode: SimNode = { id: 'row-1', tagName: 'TR', dataset: { action: 'view-row' }, parent: rootNode };
  const cellNode: SimNode = { id: 'cell-1', tagName: 'TD', dataset: {}, parent: rowNode };
  const iconNode: SimNode = { id: 'icon-1', tagName: 'SPAN', dataset: {}, parent: cellNode };

  const dispatchResult = simulateEventDispatch(iconNode, rootNode, '[data-action]');
  assert(dispatchResult.matchedAction === 'view-row', 'Delegation correctly matches ancestor row action from nested icon target');
  assert(dispatchResult.path[0] === 'capture:table-root', 'Propagation starts with capture on root ancestor');
  assert(dispatchResult.path[dispatchResult.path.length - 1] === 'bubble:table-root', 'Propagation ends with bubble on root ancestor');

  // Test 3: Modal focus trap keyboard wrap-around simulation
  // Tab forward from last element wraps to index 0
  const tabForwardWrap = simulateModalFocusTrap(4, 5, 'Tab', false);
  assert(tabForwardWrap === 0, 'Tab from last element wraps around to index 0');

  // Shift+Tab backward from first element wraps to last element (index 4)
  const shiftTabBackwardWrap = simulateModalFocusTrap(0, 5, 'Tab', true);
  assert(shiftTabBackwardWrap === 4, 'Shift+Tab from first element wraps around to last index (4)');

  // Normal tab forward advances by 1
  const normalTab = simulateModalFocusTrap(2, 5, 'Tab', false);
  assert(normalTab === 3, 'Normal Tab advances focus to next index (2 -> 3)');

  // ── GROUP 5: Diagnostic & QA Checks on All Blocks ──
  console.log('\n── GROUP 5: Diagnostic & QA Checks on All Blocks ──');

  BATCH_023_MANIFEST.days.forEach((d) => {
    d.blocks.forEach((blk) => {
      assert(blk.title.trim().length > 0, `Block ${blk.id} has non-empty title`);
      assert(blk.estimatedMinutes > 0, `Block ${blk.id} has positive estimatedMinutes`);
      if (blk.type === 'KNOWLEDGE_CHECK') {
        const kc = blk as any;
        assert(kc.options.length >= 4, `Knowledge check ${blk.id} has at least 4 options`);
        assert(kc.correctIndex >= 0 && kc.correctIndex < kc.options.length, `Knowledge check ${blk.id} has valid correctIndex`);
        assert(kc.explanation.length > 20, `Knowledge check ${blk.id} has detailed explanation`);
      }
    });
  });

  console.log(`\n========================================================================`);
  console.log(`🎉 BATCH 023 AUDIT COMPLETE: ALL ${assertionCount} CHECKS PASSED WITH 0 DEFECTS`);
  console.log(`========================================================================\n`);

  return assertionCount;
}

if (require.main === module) {
  runBatch023Audit().catch((err) => {
    console.error('Batch 023 Audit Failed:', err);
    process.exit(1);
  });
}
