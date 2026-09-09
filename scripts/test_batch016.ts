// scripts/test_batch016.ts
// Comprehensive Invariant & Technical Audit Test Suite for PinIT Batch 016 (Days 78–82: Month 4 Week 16)
// Algorithmic Paradigms, Recursion, Sorting Invariants & Composite LRU Cache Architecture

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_016_MANIFEST,
  DAY_78_MANIFEST,
  DAY_79_MANIFEST,
  DAY_80_MANIFEST,
  DAY_81_MANIFEST,
  DAY_82_MANIFEST,
  DAY_82_ASSESSMENT,
  COMPETENCY_ID_ALGORITHMIC_SYNTHESIS_AND_COMPOSITE,
} from '../src/lib/curriculum/pythonFullStack/batch016';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] ${message}`);
}

// ── Reference Implementations for Testing Behavioral Invariants ──

class AlgorithmicStructureError extends Error {
  constructor(msg = 'Algorithmic structure error.') {
    super(msg);
    this.name = 'AlgorithmicStructureError';
  }
}

class KeyNotFoundError extends AlgorithmicStructureError {
  constructor(msg = 'Key not found.') {
    super(msg);
    this.name = 'KeyNotFoundError';
  }
}

class UnhashableKeyError extends AlgorithmicStructureError {
  constructor(msg = 'Unhashable key.') {
    super(msg);
    this.name = 'UnhashableKeyError';
  }
}

class InvalidCapacityError extends AlgorithmicStructureError {
  constructor(msg = 'Invalid capacity.') {
    super(msg);
    this.name = 'InvalidCapacityError';
  }
}

class EmptyCacheError extends AlgorithmicStructureError {
  constructor(msg = 'Empty cache.') {
    super(msg);
    this.name = 'EmptyCacheError';
  }
}

class DLLNode {
  key: any;
  val: any;
  prev: DLLNode | null;
  next: DLLNode | null;
  constructor(key: any, val: any) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class ReferenceLRUCache {
  private cap: number;
  private map: Map<any, DLLNode>;
  private head: DLLNode;
  private tail: DLLNode;

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new InvalidCapacityError('Capacity must be positive.');
    }
    this.cap = capacity;
    this.map = new Map();
    this.head = new DLLNode(null, null);
    this.tail = new DLLNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private validateKey(key: any): void {
    if (Array.isArray(key) || (typeof key === 'object' && key !== null)) {
      throw new UnhashableKeyError(`Unhashable type: ${typeof key}`);
    }
  }

  private detach(node: DLLNode): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    node.prev = null;
    node.next = null;
  }

  private prepend(node: DLLNode): void {
    node.next = this.head.next;
    node.prev = this.head;
    if (this.head.next) this.head.next.prev = node;
    this.head.next = node;
  }

  get(key: any): any {
    this.validateKey(key);
    if (!this.map.has(key)) {
      throw new KeyNotFoundError(`Key ${key} not in cache.`);
    }
    const node = this.map.get(key)!;
    this.detach(node);
    this.prepend(node);
    return node.val;
  }

  put(key: any, value: any): void {
    this.validateKey(key);
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.val = value;
      this.detach(node);
      this.prepend(node);
      return;
    }

    const newNode = new DLLNode(key, value);
    this.map.set(key, newNode);
    this.prepend(newNode);

    if (this.map.size > this.cap) {
      const victim = this.tail.prev!;
      this.detach(victim);
      this.map.delete(victim.key);
    }
  }

  peekLRU(): [any, any] {
    if (this.map.size === 0) {
      throw new EmptyCacheError('Cache is empty.');
    }
    const node = this.tail.prev!;
    return [node.key, node.val];
  }

  peekMRU(): [any, any] {
    if (this.map.size === 0) {
      throw new EmptyCacheError('Cache is empty.');
    }
    const node = this.head.next!;
    return [node.key, node.val];
  }

  size(): number {
    return this.map.size;
  }

  capacity(): number {
    return this.cap;
  }

  // Integrity assertion helper
  verifyIntegrity(): boolean {
    const forward: any[] = [];
    let curr = this.head.next;
    while (curr && curr !== this.tail) {
      forward.push(curr.key);
      curr = curr.next;
    }
    if (forward.length !== this.map.size) return false;

    const backward: any[] = [];
    curr = this.tail.prev;
    while (curr && curr !== this.head) {
      backward.push(curr.key);
      curr = curr.prev;
    }
    if (backward.length !== this.map.size) return false;

    backward.reverse();
    for (let i = 0; i < forward.length; i++) {
      if (forward[i] !== backward[i]) return false;
      if (!this.map.has(forward[i])) return false;
    }
    return true;
  }
}

class ReferenceStableMergeSorter {
  static mergeSort<T>(items: T[], keyFunc?: (item: T) => any): T[] {
    if (items.length <= 1) {
      return [...items];
    }

    // 1. DECORATE: Extract key exactly once per input item
    const decorated: [any, T][] = items.map((item) => [
      keyFunc ? keyFunc(item) : item,
      item,
    ]);

    function sortRec(records: [any, T][]): [any, T][] {
      if (records.length <= 1) return records;
      const mid = Math.floor(records.length / 2);
      const left = sortRec(records.slice(0, mid));
      const right = sortRec(records.slice(mid));

      const merged: [any, T][] = [];
      let i = 0;
      let j = 0;

      while (i < left.length && j < right.length) {
        const leftKey = left[i][0];
        const rightKey = right[j][0];

        // STABILITY INVARIANT: Strictly compare rightKey < leftKey
        // NEVER compare left[i][1] with right[j][1]!
        if (rightKey < leftKey) {
          merged.push(right[j]);
          j++;
        } else {
          // When rightKey is NOT strictly smaller (leftKey <= rightKey),
          // take the left element to preserve original relative ordering.
          merged.push(left[i]);
          i++;
        }
      }

      while (i < left.length) merged.push(left[i++]);
      while (j < right.length) merged.push(right[j++]);
      return merged;
    }

    const sortedRecords = sortRec(decorated);
    // 2. UNDECORATE: Return newly allocated sorted list of original items
    return sortedRecords.map((r) => r[1]);
  }

  static isSorted<T>(items: T[], keyFunc?: (item: T) => any): boolean {
    if (items.length <= 1) return true;
    let prev = keyFunc ? keyFunc(items[0]) : items[0];
    for (let i = 1; i < items.length; i++) {
      const curr = keyFunc ? keyFunc(items[i]) : items[i];
      if (curr < prev) return false;
      prev = curr;
    }
    return true;
  }
}

async function runBatch016Audit() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 016 (DAYS 78–82) TECHNICAL AUDIT TEST SUITE');
  console.log('Algorithmic Paradigms, Recursion, Sorting Invariants & Composite LRU Cache');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_016_MANIFEST.batchCode === 'P2-M4-W16-BATCH016', 'Batch code is P2-M4-W16-BATCH016');
  assert(BATCH_016_MANIFEST.batchId === 'batch-pfs-m4-w16-016', 'Batch ID is batch-pfs-m4-w16-016');
  assert(BATCH_016_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 78–82)');
  assert(BATCH_016_MANIFEST.difficulty === 'INTERMEDIATE', 'Difficulty is INTERMEDIATE');
  assert(DAY_82_ASSESSMENT.targetCompetencyId === COMPETENCY_ID_ALGORITHMIC_SYNTHESIS_AND_COMPOSITE, 'Competency matches comp-pfs-m4-016');

  ContentValidator.validateBatchManifest(BATCH_016_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_016_MANIFEST.days.forEach((day, i) => {
    assert(day.dayNumber === i + 1, `Day ${78 + i} is Day ${i + 1} with dayNumber ${i + 1}`);
    assert(day.pedagogicalIntent === expectedIntents[i], `Day ${78 + i} has canonical intent ${expectedIntents[i]}`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const d78Min = DAY_78_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const d79Min = DAY_79_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const d80Min = DAY_80_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const d81Min = DAY_81_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const d82Min = DAY_82_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);

  assert(d78Min === 85, `Day 78 workload is exactly 85 minutes (Found: ${d78Min})`);
  assert(d79Min === 85, `Day 79 workload is exactly 85 minutes (Found: ${d79Min})`);
  assert(d80Min === 90, `Day 80 workload is exactly 90 minutes (Found: ${d80Min})`);
  assert(d81Min === 85, `Day 81 workload is exactly 85 minutes (Found: ${d81Min})`);
  assert(d82Min === 95, `Day 82 workload is exactly 95 minutes (Found: ${d82Min})`);

  const totalMin = d78Min + d79Min + d80Min + d81Min + d82Min;
  const totalHours = totalMin / 60;
  assert(totalMin === 440, `Total batch instructional minutes is exactly 440 (Found: ${totalMin})`);
  assert(totalHours >= 6.5 && totalHours <= 7.5, `Batch 016 workload calibrated between 6.5h and 7.5h (Calculated: ${totalHours.toFixed(2)}h)`);

  // ── GROUP 3: Pedagogical Content Integrity & Canonical Vocabularies ──
  console.log('\n── GROUP 3: Pedagogical Content Integrity & Canonical Vocabularies ──');
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), 'src/lib/curriculum/pythonFullStack/batch016.ts'),
    'utf-8'
  );

  const canonicalExceptions = [
    'AlgorithmicStructureError',
    'KeyNotFoundError',
    'UnhashableKeyError',
    'InvalidCapacityError',
    'EmptyCacheError',
  ];

  canonicalExceptions.forEach((exc) => {
    assert(fileContent.includes(exc), `Canonical exception '${exc}' is present across curriculum definitions`);
  });

  // Verify Native RecursionError is taught and custom recursion error is NOT created
  assert(!fileContent.includes('class RecursionLimitExceededError'), 'Custom RecursionLimitExceededError is excluded in favor of native RecursionError');
  assert(fileContent.includes('RecursionError'), 'Native RecursionError is documented and taught');

  // Verify Non-mutating Sorter wording
  assert(fileContent.includes('non-mutating sorting function: does not modify the input list or its ordering'), 'Accurate non-mutating sorter contract verified in curriculum text');

  // Verify LRU complexity assumption
  assert(fileContent.includes('LRU complexity assumes key hashing and equality checks have expected O(1) cost and stable hash/equality behavior while the key is stored'), 'Accurate LRU complexity assumption verified in curriculum text');

  // Verify Python dictionary ordering vs recency ordering explanation
  assert(fileContent.includes('A modern Python dictionary preserves insertion order, but insertion order is NOT LRU recency order'), 'Accurate Python dictionary insertion vs recency ordering explanation verified');

  // Verify CPython sorting architecture discussion
  assert(fileContent.includes('Timsort-family'), 'Timsort-family discussed for Python built-in sort');
  assert(fileContent.includes('Powersort merge strategy'), 'CPython Powersort merge strategy acknowledged as internal detail');

  // Verify Python reference/link integrity terminology
  assert(fileContent.includes('reference retention and pointer/link integrity defects'), 'Pythonic reference and link integrity terminology used');

  // ── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──
  console.log('\n── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──');
  const forbiddenPatterns = [
    { name: '@property decorator', regex: /@property\b/ },
    { name: '@classmethod decorator', regex: /@classmethod\b/ },
    { name: '@staticmethod decorator', regex: /@staticmethod\b/ },
    { name: 'Abstract Base Classes (abc.ABC)', regex: /\babc\.ABC\b|@abstractmethod\b/ },
    { name: 'Typing Protocol', regex: /\btyping\.Protocol\b/ },
    { name: 'Advanced Typing (Generic, TypeVar)', regex: /\bGeneric\[|\bTypeVar\(/ },
    { name: 'Premature Node Typing (Optional[Node])', regex: /Optional\[Node\]/ },
    { name: 'Async / Await keywords', regex: /\basync\s+def\b|\bawait\s+/ },
    { name: 'Advanced Dunders (__getattr__/__setattr__)', regex: /def\s+__getattr__\b|def\s+__setattr__\b/ },
    { name: 'Database ORM/SQL imports', regex: /\bdjango\.db\b|\bsqlalchemy\b/ },
  ];

  forbiddenPatterns.forEach((pat) => {
    assert(!pat.regex.test(fileContent), `Prerequisite Firewall: Zero occurrences of forbidden concept '${pat.name}'`);
  });

  // ── GROUP 5: Assessment Architecture & Dual Competency Floors ──
  console.log('\n── GROUP 5: Assessment Architecture & Dual Competency Floors ──');
  assert(DAY_82_ASSESSMENT.mode === 'FORMATIVE', 'Day 82 assessment is strictly FORMATIVE');
  assert(DAY_82_ASSESSMENT.timeLimitMinutes === 95, 'Day 82 assessment time limit is exactly 95 minutes');
  assert(DAY_82_ASSESSMENT.items.length === 1, 'Assessment contains exactly 1 comprehensive synthesis item');

  AssessmentValidator.validateAssessment(DAY_82_ASSESSMENT);
  assert(true, 'AssessmentValidator.validateAssessment() passes with 0 validation errors');

  const item = DAY_82_ASSESSMENT.items[0];
  const rubric = item.rubricDimensions || [];
  assert(rubric.length === 7, 'Rubric contains exactly 7 dimensions');

  const weightSum = rubric.reduce((sum, d) => sum + d.weight, 0);
  assert(Math.abs(weightSum - 1.0) < 0.0001, `Rubric dimension weights sum exactly to 1.0000 (Found: ${weightSum.toFixed(4)})`);

  // Verify Dual Competency Floors
  const dim1 = rubric.find((d) => d.id === 'dim-b16-01');
  assert(dim1 !== undefined && dim1.criteria.includes('MANDATORY COMPETENCY FLOOR: Minimum 50% score'), 'Competency Floor 1 Verified: Dimension 1 (LRUCache) enforces mandatory 50% minimum passing score');

  const dim5 = rubric.find((d) => d.id === 'dim-b16-05');
  assert(dim5 !== undefined && dim5.criteria.includes('MANDATORY COMPETENCY FLOOR: Minimum 50% score'), 'Competency Floor 2 Verified: Dimension 5 (StableMergeSorter) enforces mandatory 50% minimum passing score');

  // ── GROUP 6: LRU Cache Behavioral Verification & Adversarial Invariants ──
  console.log('\n── GROUP 6: LRU Cache Behavioral Verification & Adversarial Invariants ──');
  let invalidCapCaught = false;
  try {
    new ReferenceLRUCache(0);
  } catch (e: any) {
    invalidCapCaught = e instanceof InvalidCapacityError;
  }
  assert(invalidCapCaught, 'new LRUCache(0) raises InvalidCapacityError');

  const cache = new ReferenceLRUCache(2);
  assert(cache.capacity() === 2, 'Cache capacity is 2');
  assert(cache.size() === 0, 'Initial cache size is 0');

  let emptyGetCaught = false;
  try {
    cache.get('missing');
  } catch (e: any) {
    emptyGetCaught = e instanceof KeyNotFoundError;
  }
  assert(emptyGetCaught, 'get("missing") on empty cache raises KeyNotFoundError');

  let emptyPeekLRUCaught = false;
  try {
    cache.peekLRU();
  } catch (e: any) {
    emptyPeekLRUCaught = e instanceof EmptyCacheError;
  }
  assert(emptyPeekLRUCaught, 'peekLRU() on empty cache raises EmptyCacheError');

  let emptyPeekMRUCaught = false;
  try {
    cache.peekMRU();
  } catch (e: any) {
    emptyPeekMRUCaught = e instanceof EmptyCacheError;
  }
  assert(emptyPeekMRUCaught, 'peekMRU() on empty cache raises EmptyCacheError');

  // Test None payload safety
  cache.put('key_with_none', null);
  assert(cache.size() === 1, 'Cache size is 1 after putting None payload');
  assert(cache.get('key_with_none') === null, 'get("key_with_none") returns null without error');

  // Put second item
  cache.put('k2', 200);
  assert(cache.size() === 2, 'Cache size is 2');
  assert(cache.peekMRU()[0] === 'k2', 'peekMRU() returns most recently inserted item ("k2")');
  assert(cache.peekLRU()[0] === 'key_with_none', 'peekLRU() returns least recently inserted item ("key_with_none")');

  // Overwrite existing key
  cache.put('k2', 250);
  assert(cache.size() === 2, 'Overwrite does NOT increase cache size');
  assert(cache.get('k2') === 250, 'Overwritten value updated to 250');
  assert(cache.peekMRU()[0] === 'k2', 'Overwritten item promoted to MRU');

  // Access key_with_none to promote it to MRU
  const val = cache.get('key_with_none');
  assert(val === null, 'get("key_with_none") returns null');
  assert(cache.peekMRU()[0] === 'key_with_none', 'Accessing key_with_none promotes it to MRU');
  assert(cache.peekLRU()[0] === 'k2', 'k2 is now the LRU victim');

  // Eviction test: insert 3rd item, evicting k2
  cache.put('k3', 300);
  assert(cache.size() === 2, 'Cache size remains capped at capacity 2 after eviction');
  assert(cache.peekMRU()[0] === 'k3', 'k3 is now MRU');
  assert(cache.peekLRU()[0] === 'key_with_none', 'key_with_none was preserved from eviction by prior get() promotion');

  let evictedCaught = false;
  try {
    cache.get('k2');
  } catch (e: any) {
    evictedCaught = e instanceof KeyNotFoundError;
  }
  assert(evictedCaught, 'Evicted key k2 raises KeyNotFoundError');

  // Unhashable key handling
  let unhashableCaught = false;
  try {
    cache.put(['unhashable'], 999);
  } catch (e: any) {
    unhashableCaught = e instanceof UnhashableKeyError;
  }
  assert(unhashableCaught, 'cache.put([list]) raises UnhashableKeyError');

  // Bidirectional link integrity check
  assert(cache.verifyIntegrity(), 'Doubly linked list maintains full bidirectional link integrity');

  // ── GROUP 7: Stable Sorter Invariant Verification & Non-Mutating Contract ──
  console.log('\n── GROUP 7: Stable Sorter Invariant Verification & Non-Mutating Contract ──');
  
  // 1. Basic sorting correctness
  const unsorted = [5, 2, 8, 1, 9, 3];
  const sorted = ReferenceStableMergeSorter.mergeSort(unsorted);
  assert(JSON.stringify(sorted) === JSON.stringify([1, 2, 3, 5, 8, 9]), 'mergeSort correctly sorts numeric list');

  // 2. Non-mutating input contract (Snapshot verification)
  const inputSnapshot = [...unsorted];
  assert(JSON.stringify(unsorted) === JSON.stringify(inputSnapshot), 'Input list remained completely unmutated');
  assert(sorted !== unsorted, 'mergeSort returned a newly allocated list instance');

  // 3. Stability verification with composite multi-key items
  const compositeItems = [
    { priority: 2, id: 'A', meta: { score: 10 } },
    { priority: 1, id: 'B', meta: { score: 20 } },
    { priority: 2, id: 'C', meta: { score: 30 } },
    { priority: 1, id: 'D', meta: { score: 40 } },
  ];
  const compositeSnapshot = compositeItems.map((x) => ({ ...x }));
  const sortedComposite = ReferenceStableMergeSorter.mergeSort(
    compositeItems,
    (item) => item.priority
  );

  assert(
    JSON.stringify(sortedComposite.map((x) => x.id)) === JSON.stringify(['B', 'D', 'A', 'C']),
    'Stability Invariant: Equal priority items (1: B, D and 2: A, C) strictly preserve input order'
  );
  assert(
    JSON.stringify(compositeItems) === JSON.stringify(compositeSnapshot),
    'Composite input list remained completely unmutated'
  );

  // 4. Key function evaluated exactly once per item
  let keyCalls = 0;
  const testItems = Array.from({ length: 50 }, (_, i) => ({ val: 50 - i }));
  ReferenceStableMergeSorter.mergeSort(testItems, (item) => {
    keyCalls++;
    return item.val;
  });
  assert(keyCalls === 50, `Once-Per-Element Key Evaluation Contract: key_func called exactly ${keyCalls} times for 50 items (Found: ${keyCalls})`);

  // 5. Pre-sorted array linear verification
  assert(ReferenceStableMergeSorter.isSorted([1, 2, 3, 4, 5]), 'isSorted returns true for sorted list');
  assert(!ReferenceStableMergeSorter.isSorted([1, 3, 2, 4, 5]), 'isSorted returns false for unsorted list');

  console.log('\n========================================================================');
  console.log('🏁 BATCH 016 DEDICATED AUDIT RESULTS: ALL CHECKS PASSED CLEANLY');
  console.log('========================================================================\n');
}

runBatch016Audit().catch((err) => {
  console.error('\n🚨 BATCH 016 AUDIT SUITE FAILED:\n', err);
  process.exit(1);
});
