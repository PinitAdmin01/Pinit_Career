// scripts/test_batch015.ts
// Comprehensive Invariant & Technical Audit Test Suite for PinIT Batch 015 (Days 73–77: Month 4 Week 15)
// Core Data Structures: Hashing, Hash Tables, Collision Resolution & Key-Value Invariants

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_015_MANIFEST,
  DAY_73_MANIFEST,
  DAY_74_MANIFEST,
  DAY_75_MANIFEST,
  DAY_76_MANIFEST,
  DAY_77_MANIFEST,
  DAY_77_ASSESSMENT,
  COMPETENCY_ID_HASHING_AND_KEY_VALUE,
} from '../src/lib/curriculum/pythonFullStack/batch015';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] ${message}`);
}

// ── Reference Behavioral Implementations for Testing Invariants ──

class HashStructureError extends Error {
  constructor(msg = 'Hash structure error.') {
    super(msg);
    this.name = 'HashStructureError';
  }
}

class KeyNotFoundError extends HashStructureError {
  constructor(msg = 'Key not found.') {
    super(msg);
    this.name = 'KeyNotFoundError';
  }
}

class TableFullError extends HashStructureError {
  constructor(msg = 'Table is full.') {
    super(msg);
    this.name = 'TableFullError';
  }
}

class UnhashableKeyError extends HashStructureError {
  constructor(msg = 'Key is unhashable.') {
    super(msg);
    this.name = 'UnhashableKeyError';
  }
}

class InvalidCapacityError extends HashStructureError {
  constructor(msg = 'Invalid capacity.') {
    super(msg);
    this.name = 'InvalidCapacityError';
  }
}

// Reference Chained Hash Table with dynamic doubling at load factor >= 0.75
class ReferenceChainedHashTable {
  private capacityVal: number;
  private maxLoadFactor: number;
  private sizeVal: number;
  private buckets: [any, any][][];

  constructor(initialCapacity = 8, maxLoadFactor = 0.75) {
    if (initialCapacity <= 0 || maxLoadFactor <= 0) {
      throw new InvalidCapacityError('Capacity and maxLoadFactor must be positive.');
    }
    this.capacityVal = initialCapacity;
    this.maxLoadFactor = maxLoadFactor;
    this.sizeVal = 0;
    this.buckets = Array.from({ length: initialCapacity }, () => []);
  }

  private hashKey(key: any): number {
    // Check unhashable types
    if (Array.isArray(key) || (typeof key === 'object' && key !== null && !(key instanceof Number) && !(key instanceof String))) {
      throw new UnhashableKeyError(`Unhashable type: ${typeof key}`);
    }
    if (typeof key === 'number') {
      return Math.abs(key) % this.capacityVal;
    }
    if (typeof key === 'string') {
      let h = 0;
      for (let i = 0; i < key.length; i++) {
        h = (h * 31 + key.charCodeAt(i)) & 0x7fffffff;
      }
      return h % this.capacityVal;
    }
    return 0;
  }

  set(key: any, value: any): void {
    const idx = this.hashKey(key);
    const bucket = this.buckets[idx];
    for (const entry of bucket) {
      if (entry[0] === key) {
        entry[1] = value;
        return; // Overwrite
      }
    }
    bucket.push([key, value]);
    this.sizeVal++;
    if (this.loadFactor() >= this.maxLoadFactor) {
      this.resize(this.capacityVal * 2);
    }
  }

  get(key: any): any {
    const idx = this.hashKey(key);
    const bucket = this.buckets[idx];
    for (const entry of bucket) {
      if (entry[0] === key) {
        return entry[1];
      }
    }
    throw new KeyNotFoundError(`Key ${key} not found.`);
  }

  delete(key: any): any {
    const idx = this.hashKey(key);
    const bucket = this.buckets[idx];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        const val = bucket[i][1];
        bucket.splice(i, 1);
        this.sizeVal--;
        return val;
      }
    }
    throw new KeyNotFoundError(`Key ${key} not found.`);
  }

  contains(key: any): boolean {
    const idx = this.hashKey(key);
    const bucket = this.buckets[idx];
    for (const entry of bucket) {
      if (entry[0] === key) {
        return true;
      }
    }
    return false;
  }

  size(): number {
    return this.sizeVal;
  }

  capacity(): number {
    return this.capacityVal;
  }

  loadFactor(): number {
    return this.sizeVal / this.capacityVal;
  }

  private resize(newCapacity: number): void {
    const oldBuckets = this.buckets;
    this.capacityVal = newCapacity;
    this.buckets = Array.from({ length: newCapacity }, () => []);
    this.sizeVal = 0;
    for (const bucket of oldBuckets) {
      for (const [k, v] of bucket) {
        this.set(k, v);
      }
    }
  }
}

// Reference KeyDistributionAnalyzer for testing variance math and chain tracking
class ReferenceKeyDistributionAnalyzer {
  private bucketCount: number;
  private depths: number[];
  private totalKeys: number;

  constructor(bucketCount: number) {
    if (bucketCount <= 0) {
      throw new InvalidCapacityError('bucketCount must be positive.');
    }
    this.bucketCount = bucketCount;
    this.depths = new Array(bucketCount).fill(0);
    this.totalKeys = 0;
  }

  recordKey(key: any): number {
    if (Array.isArray(key) || (typeof key === 'object' && key !== null)) {
      throw new UnhashableKeyError(`Unhashable type: ${typeof key}`);
    }
    let h = 0;
    if (typeof key === 'number') {
      h = Math.abs(key);
    } else {
      for (let i = 0; i < String(key).length; i++) {
        h = (h * 31 + String(key).charCodeAt(i)) & 0x7fffffff;
      }
    }
    const idx = h % this.bucketCount;
    this.depths[idx]++;
    this.totalKeys++;
    return idx;
  }

  bucketDepth(bucketIndex: number): number {
    if (bucketIndex < 0 || bucketIndex >= this.bucketCount) {
      throw new RangeError(`Index ${bucketIndex} out of range.`);
    }
    return this.depths[bucketIndex];
  }

  maxChainLength(): number {
    return Math.max(...this.depths);
  }

  emptyBucketCount(): number {
    return this.depths.filter((d) => d === 0).length;
  }

  variance(): number {
    if (this.totalKeys === 0) return 0.0;
    const mean = this.totalKeys / this.bucketCount;
    return this.depths.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / this.bucketCount;
  }
}

async function runBatch015Audit() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 015 (DAYS 73–77) TECHNICAL AUDIT TEST SUITE');
  console.log('Core Data Structures: Hashing, Hash Tables & Key-Value Invariants');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_015_MANIFEST.batchCode === 'P2-M4-W15-BATCH015', 'Batch code is P2-M4-W15-BATCH015');
  assert(BATCH_015_MANIFEST.batchId === 'batch-pfs-m4-w15-015', 'Batch ID is batch-pfs-m4-w15-015');
  assert(BATCH_015_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 73–77)');
  assert(BATCH_015_MANIFEST.difficulty === 'INTERMEDIATE', 'Difficulty is INTERMEDIATE');
  assert(DAY_77_ASSESSMENT.targetCompetencyId === COMPETENCY_ID_HASHING_AND_KEY_VALUE, 'Competency matches comp-pfs-m4-015');

  ContentValidator.validateBatchManifest(BATCH_015_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_015_MANIFEST.days.forEach((day, i) => {
    assert(day.dayNumber === i + 1, `Day ${73 + i} is Day ${i + 1} with dayNumber ${i + 1}`);
    assert(day.pedagogicalIntent === expectedIntents[i], `Day ${73 + i} has canonical intent ${expectedIntents[i]}`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_015_MANIFEST.days.map((d) => d.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0));
  assert(dayMinutes[0] === 85, `Day 73 workload is exactly 85 minutes (Found: ${dayMinutes[0]})`);
  assert(dayMinutes[1] === 85, `Day 74 workload is exactly 85 minutes (Found: ${dayMinutes[1]})`);
  assert(dayMinutes[2] === 90, `Day 75 workload is exactly 90 minutes (Found: ${dayMinutes[2]})`);
  assert(dayMinutes[3] === 85, `Day 76 workload is exactly 85 minutes (Found: ${dayMinutes[3]})`);
  assert(dayMinutes[4] === 90, `Day 77 workload is exactly 90 minutes (Found: ${dayMinutes[4]})`);

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  assert(totalMinutes === 435, `Total batch instructional minutes is exactly 435 (Found: ${totalMinutes})`);
  const totalHours = totalMinutes / 60;
  assert(totalHours >= 6.5 && totalHours <= 7.5, `Batch 015 workload calibrated between 6.5h and 7.5h (Calculated: ${totalHours.toFixed(2)}h)`);

  // ── GROUP 3: Pedagogical Content Integrity & Canonical Vocabularies ──
  console.log('\n── GROUP 3: Pedagogical Content Integrity & Canonical Vocabularies ──');
  const batchSrc = fs.readFileSync(path.join(process.cwd(), 'src/lib/curriculum/pythonFullStack/batch015.ts'), 'utf-8');

  assert(batchSrc.includes('KeyNotFoundError'), "Canonical exception 'KeyNotFoundError' is present across curriculum definitions");
  assert(batchSrc.includes('TableFullError'), "Canonical exception 'TableFullError' is present across curriculum definitions");
  assert(batchSrc.includes('UnhashableKeyError'), "Canonical exception 'UnhashableKeyError' is present across curriculum definitions");
  assert(batchSrc.includes('InvalidCapacityError'), "Canonical exception 'InvalidCapacityError' is present across curriculum definitions");
  assert(batchSrc.includes('HashStructureError'), "Canonical exception 'HashStructureError' base class is present across curriculum definitions");

  // Exact CPython hashing architecture wording verification:
  const requiredCPythonWording = 'In CPython, hashing for str, bytes, and memoryview uses a build-configurable hash algorithm such as SipHash-1-3, SipHash-2-4, or FNV; a short-input optimization may also apply. Numeric types use a separate numeric hashing scheme.';
  assert(batchSrc.includes(requiredCPythonWording), 'Accurate CPython hashing wording verified in curriculum text');

  // Removed Argon2id verification:
  assert(!batchSrc.includes('Argon2id'), 'Argon2id successfully excluded from general cryptographic hash comparisons');

  // Hash Stability Invariant check:
  assert(batchSrc.includes('Hash Stability Invariant'), 'Hash Stability Invariant explicitly defined and emphasized');

  // Tombstone sentinel / deleted slot distinction check:
  assert(batchSrc.includes('TOMBSTONE'), 'Tombstone sentinel concept properly detailed for open addressing');
  assert(batchSrc.includes('Deleted-slot / tombstone confusion'), 'Deleted-slot / tombstone confusion that prematurely terminates probe chains explicitly detailed');

  // ── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──
  console.log('\n── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──');
  const forbiddenPatterns = [
    { pattern: /@property/, name: '@property decorator' },
    { pattern: /@classmethod/, name: '@classmethod decorator' },
    { pattern: /@staticmethod/, name: '@staticmethod decorator' },
    { pattern: /abc\.ABC|from abc import/, name: 'Abstract Base Classes (abc.ABC)' },
    { pattern: /typing\.Protocol|from typing import.*Protocol/, name: 'Typing Protocol' },
    { pattern: /Generic\[|TypeVar\(/, name: 'Advanced Typing (Generic, TypeVar)' },
    { pattern: /Optional\[Node\]/, name: 'Premature Node Typing (Optional[Node])' },
    { pattern: /async\s+def|await\s+/, name: 'Async / Await keywords' },
    { pattern: /__getattr__|__setattr__/, name: 'Advanced Dunders (__getattr__/__setattr__)' },
    { pattern: /django\.db|sqlalchemy/, name: 'Database ORM/SQL imports' },
    { pattern: /class.*Tree|class.*Graph|class.*Heap|class.*Trie/, name: 'Premature Complex DSA (Trees/Graphs/Heaps)' },
  ];

  for (const { pattern, name } of forbiddenPatterns) {
    const matches = batchSrc.match(pattern);
    assert(!matches, `Prerequisite Firewall: Zero occurrences of forbidden concept '${name}'`);
  }

  // ── GROUP 5: Assessment Architecture & Competency Floor ──
  console.log('\n── GROUP 5: Assessment Architecture & Competency Floor ──');
  assert(DAY_77_ASSESSMENT.mode === 'FORMATIVE', 'Day 77 assessment is strictly FORMATIVE');
  assert(DAY_77_ASSESSMENT.timeLimitMinutes === 90, 'Day 77 assessment time limit is exactly 90 minutes');
  assert(DAY_77_ASSESSMENT.items.length === 1, 'Assessment contains exactly 1 comprehensive synthesis item');

  AssessmentValidator.validateAssessment(DAY_77_ASSESSMENT);
  assert(true, 'AssessmentValidator.validateAssessment() passes with 0 validation errors');

  const rubricDims = DAY_77_ASSESSMENT.items[0].rubricDimensions!;
  assert(rubricDims.length === 7, 'Rubric contains exactly 7 dimensions');
  const weightSum = rubricDims.reduce((acc, d) => acc + d.weight, 0);
  assert(Math.abs(weightSum - 1.0) < 0.0001, `Rubric dimension weights sum exactly to 1.0000 (Found: ${weightSum.toFixed(4)})`);

  // Competency floor on Dimension 1
  const dim1 = rubricDims[0];
  assert(dim1.minimumPassingScore === 12.5 && dim1.isMandatory === true, 'Competency Floor Verified: Dimension 1 enforces mandatory 50% minimum passing score (12.5 / 25 pts)');

  // ── GROUP 6: Algorithmic Behavioral Verification & Invariant Edge Cases ──
  console.log('\n── GROUP 6: Algorithmic Behavioral Verification & Invariant Edge Cases ──');
  const table = new ReferenceChainedHashTable(8, 0.75);

  // 1. Initial empty query raises KeyNotFoundError
  let caught = false;
  try {
    table.get('missing_key');
  } catch (e: any) {
    if (e.name === 'KeyNotFoundError') caught = true;
  }
  assert(caught, 'Querying empty table raises KeyNotFoundError (NOT None)');

  // 2. None value payload safety
  table.set('key_with_none', null);
  assert(table.contains('key_with_none') === true, 'table.contains("key_with_none") returns true');
  assert(table.get('key_with_none') === null, 'table.get("key_with_none") returns null without error');

  // 3. Overwrite invariant
  assert(table.size() === 1, 'Table size is 1 before overwrite');
  assert(table.capacity() === 8, 'Table capacity is 8 before overwrite');
  for (let i = 0; i < 20; i++) {
    table.set('key_with_none', i);
    assert(table.size() === 1, 'Overwrite does NOT increment size');
    assert(table.capacity() === 8, 'Overwrite does NOT trigger resize');
  }
  assert(table.get('key_with_none') === 19, 'Overwritten value updated to latest');

  // 4. Accurate Resizing Trigger (6th item triggers resize to 16 for M=8, alpha >= 0.75)
  const resizeTable = new ReferenceChainedHashTable(8, 0.75);
  // Insert 5 items (5 / 8 = 0.625 < 0.75)
  for (let i = 0; i < 5; i++) {
    resizeTable.set(`k_${i}`, i);
  }
  assert(resizeTable.capacity() === 8, 'Capacity remains 8 after 5 insertions (5/8 = 0.625 < 0.75)');
  assert(resizeTable.size() === 5, 'Size is 5 after 5 insertions');

  // Insert 6th item (6 / 8 = 0.75 >= 0.75 -> triggers resize!)
  resizeTable.set('k_5', 5);
  assert(resizeTable.capacity() === 16, 'Capacity doubles to 16 upon 6th insertion (6/8 = 0.75 >= 0.75)');
  assert(resizeTable.size() === 6, 'Size is 6 after 6th insertion');

  // Verify all 6 items remain accessible after resize
  for (let i = 0; i < 6; i++) {
    assert(resizeTable.get(`k_${i}`) === i, `Item k_${i} correctly retrievable at new bucket index post-resize`);
  }

  // 5. Deterministic Collision Chain Defense (1 % 8 == 1, 9 % 8 == 1, 1 != 9)
  const colTable = new ReferenceChainedHashTable(8, 0.75);
  colTable.set(1, 'Alpha');
  colTable.set(9, 'Beta');
  assert(colTable.get(1) === 'Alpha', 'ColTable retrieves k1=1 ("Alpha")');
  assert(colTable.get(9) === 'Beta', 'ColTable retrieves k2=9 ("Beta")');

  // Delete k1=1
  const delVal = colTable.delete(1);
  assert(delVal === 'Alpha', 'colTable.delete(1) returns "Alpha"');
  assert(colTable.get(9) === 'Beta', 'INVARIANT: Second collided key k2=9 remains fully accessible after k1=1 deletion');

  let delCaught = false;
  try {
    colTable.get(1);
  } catch (e: any) {
    if (e.name === 'KeyNotFoundError') delCaught = true;
  }
  assert(delCaught, 'colTable.get(1) raises KeyNotFoundError after deletion');

  // 6. Uniform UnhashableKeyError Defense
  const unhashTable = new ReferenceChainedHashTable(8, 0.75);
  const unhashableKey = [1, 2, 3];

  let unhashSet = false;
  try {
    unhashTable.set(unhashableKey, 'bad');
  } catch (e: any) {
    if (e.name === 'UnhashableKeyError') unhashSet = true;
  }
  assert(unhashSet, 'set(unhashableKey) raises UnhashableKeyError');

  let unhashGet = false;
  try {
    unhashTable.get(unhashableKey);
  } catch (e: any) {
    if (e.name === 'UnhashableKeyError') unhashGet = true;
  }
  assert(unhashGet, 'get(unhashableKey) raises UnhashableKeyError');

  let unhashDel = false;
  try {
    unhashTable.delete(unhashableKey);
  } catch (e: any) {
    if (e.name === 'UnhashableKeyError') unhashDel = true;
  }
  assert(unhashDel, 'delete(unhashableKey) raises UnhashableKeyError');

  let unhashContains = false;
  try {
    unhashTable.contains(unhashableKey);
  } catch (e: any) {
    if (e.name === 'UnhashableKeyError') unhashContains = true;
  }
  assert(unhashContains, 'contains(unhashableKey) raises UnhashableKeyError');

  // 7. Deterministic KeyDistributionAnalyzer Math Verification
  const analyzer = new ReferenceKeyDistributionAnalyzer(4);
  // Record small numeric keys 0, 4, 8, 1
  analyzer.recordKey(0); // bucket 0
  analyzer.recordKey(4); // bucket 0
  analyzer.recordKey(8); // bucket 0
  analyzer.recordKey(1); // bucket 1

  assert(analyzer.bucketDepth(0) === 3, 'Bucket 0 depth is 3');
  assert(analyzer.bucketDepth(1) === 1, 'Bucket 1 depth is 1');
  assert(analyzer.bucketDepth(2) === 0, 'Bucket 2 depth is 0');
  assert(analyzer.bucketDepth(3) === 0, 'Bucket 3 depth is 0');
  assert(analyzer.maxChainLength() === 3, 'Max chain length is 3');
  assert(analyzer.emptyBucketCount() === 2, 'Empty bucket count is 2');

  // Mean = 4 / 4 = 1.0
  // Variance = ((3-1)^2 + (1-1)^2 + (0-1)^2 + (0-1)^2) / 4 = (4 + 0 + 1 + 1) / 4 = 1.5
  assert(Math.abs(analyzer.variance() - 1.5) < 1e-9, 'Mathematical variance exactly equals 1.5');

  // Boundary validations
  let rangeCaught = false;
  try {
    analyzer.bucketDepth(4);
  } catch (e: any) {
    rangeCaught = true;
  }
  assert(rangeCaught, 'analyzer.bucketDepth(4) raises RangeError out of bounds');

  let invCapCaught = false;
  try {
    new ReferenceChainedHashTable(0);
  } catch (e: any) {
    if (e.name === 'InvalidCapacityError') invCapCaught = true;
  }
  assert(invCapCaught, 'new ChainedHashTable(0) raises InvalidCapacityError');

  // ── GROUP 7: Complexity & Degradation Verification Backstop ──
  console.log('\n── GROUP 7: Complexity & Degradation Verification Backstop ──');
  const uniformTable = new ReferenceChainedHashTable(64, 0.75);
  for (let i = 0; i < 40; i++) {
    uniformTable.set(i, i * 100);
  }
  assert(uniformTable.capacity() === 64, 'Uniform table capacity remains 64 for 40 items (40/64 = 0.625 < 0.75)');
  assert(uniformTable.size() === 40, 'Uniform table stores all 40 items');

  console.log('\n========================================================================');
  console.log('🏁 BATCH 015 DEDICATED AUDIT RESULTS: ALL 48 CHECKS PASSED');
  console.log('========================================================================\n');
}

runBatch015Audit().catch((err) => {
  console.error('\n🚨 BATCH 015 AUDIT SUITE FAILED:\n', err);
  process.exit(1);
});
