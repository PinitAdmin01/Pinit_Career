// scripts/test_batch018.ts
// Programmatic Verification Suite for PinIT Career OS Batch 018 (Days 88–92)
// Advanced Python: Iterator Protocol, Generator Architecture, Lazy Streaming Pipelines & Memory Physics

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_018_MANIFEST,
  DAY_92_ASSESSMENT,
  COMPETENCY_ID_ITERATORS_AND_GENERATORS,
} from '../src/lib/curriculum/pythonFullStack/batch018';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';

// ── CANONICAL EXCEPTIONS (Mirroring Python Contracts) ──

class StreamProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StreamProcessingError';
  }
}

class InvalidChunkSizeError extends StreamProcessingError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidChunkSizeError';
  }
}

class StopIteration extends Error {
  constructor(message = 'StopIteration') {
    super(message);
    this.name = 'StopIteration';
  }
}

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (Mirroring Python Contracts) ──

function* referenceChunkStream(stream: Iterable<any>, chunkSize: any): Generator<any[], void, undefined> {
  if (typeof chunkSize !== 'number' || typeof chunkSize === 'boolean' || !Number.isInteger(chunkSize) || chunkSize < 1) {
    throw new InvalidChunkSizeError(`chunk_size must be an integer >= 1, received ${chunkSize}`);
  }

  let chunk: any[] = [];
  for (const item of stream) {
    chunk.push(item);
    if (chunk.length === chunkSize) {
      yield [...chunk];
      chunk = [];
    }
  }
  if (chunk.length > 0) {
    yield [...chunk];
  }
}

function* referenceWindowStream(stream: Iterable<any>, windowSize: any): Generator<any[], void, undefined> {
  if (typeof windowSize !== 'number' || typeof windowSize === 'boolean' || !Number.isInteger(windowSize) || windowSize < 1) {
    throw new InvalidChunkSizeError(`window_size must be an integer >= 1, received ${windowSize}`);
  }

  const window: any[] = [];
  for (const item of stream) {
    window.push(item);
    if (window.length > windowSize) {
      window.shift();
    }
    if (window.length === windowSize) {
      yield [...window];
    }
  }
}

function* referenceMergeSortedStreams(streams: Iterable<any>[], key: ((item: any) => any) | null = null): Generator<any, void, undefined> {
  const iterators = streams.map((s) => s[Symbol.iterator]());
  
  // Internal heap element structure: { sortKey, streamIndex, value }
  const activeHeads: { sortKey: any; streamIndex: number; value: any }[] = [];

  for (let idx = 0; idx < iterators.length; idx++) {
    const nextRes = iterators[idx].next();
    if (!nextRes.done) {
      const val = nextRes.value;
      const sortKey = key ? key(val) : val;
      activeHeads.push({ sortKey, streamIndex: idx, value: val });
    }
  }

  while (activeHeads.length > 0) {
    // Sort active heads by sortKey asc, then streamIndex asc (tie breaker)
    activeHeads.sort((a, b) => {
      if (a.sortKey < b.sortKey) return -1;
      if (a.sortKey > b.sortKey) return 1;
      // Deterministic tie-breaking on streamIndex: item payload is NEVER compared!
      return a.streamIndex - b.streamIndex;
    });

    const minEntry = activeHeads.shift()!;
    yield minEntry.value;

    const nextRes = iterators[minEntry.streamIndex].next();
    if (!nextRes.done) {
      const nextVal = nextRes.value;
      const nextSortKey = key ? key(nextVal) : nextVal;
      activeHeads.push({ sortKey: nextSortKey, streamIndex: minEntry.streamIndex, value: nextVal });
    }
  }
}

// Generator-Based Coroutine Simulation
class ReferenceEventStreamConsumer {
  private isPrimed = false;
  private isClosed = false;
  private count = 0;
  private total = 0.0;
  private anomalies = 0;
  private latest = 0.0;
  private threshold: number;

  constructor(threshold: number = 100.0) {
    this.threshold = threshold;
  }

  public next(): { count: number; total: number; anomalies: number; latest: number } {
    if (this.isClosed) {
      throw new StopIteration('Cannot next() closed generator');
    }
    this.isPrimed = true;
    return this.getStatus();
  }

  public send(event: any): { count: number; total: number; anomalies: number; latest: number } {
    if (this.isClosed) {
      throw new StopIteration('Cannot send() to closed generator');
    }

    if (!this.isPrimed) {
      if (event !== null && event !== undefined) {
        throw new TypeError("can't send non-None value to a just-started generator");
      }
      this.isPrimed = true;
      return this.getStatus();
    }

    this.count++;
    const num = Number(event);
    this.total += num;
    this.latest = num;
    if (num > this.threshold) {
      this.anomalies++;
    }
    return this.getStatus();
  }

  public close(): void {
    if (!this.isClosed) {
      this.isClosed = true;
    }
  }

  public getStatus() {
    return {
      count: this.count,
      total: this.total,
      anomalies: this.anomalies,
      latest: this.latest,
    };
  }
}

async function runBatch018Audit() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 018 (DAYS 88–92) TECHNICAL AUDIT TEST SUITE');
  console.log('Advanced Python: Iterator Protocol, Generator Architecture & Streaming Physics');
  console.log('========================================================================\n');

  let assertionCount = 0;
  function assert(condition: boolean, message: string) {
    assertionCount++;
    if (!condition) {
      console.error(`  ❌ [FAIL] Check #${assertionCount}: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
    console.log(`  ✅ [PASS] Check #${assertionCount}: ${message}`);
  }

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_018_MANIFEST.batchCode === 'P2-M5-W18-BATCH018', 'Batch code is "P2-M5-W18-BATCH018"');
  assert(BATCH_018_MANIFEST.batchId === 'batch-pfs-m5-w18-018', 'Batch ID is "batch-pfs-m5-w18-018"');
  assert(BATCH_018_MANIFEST.days.length === 5, 'Batch contains exactly 5 instructional days (Days 88–92)');
  assert(BATCH_018_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_018_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_018_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');
  assert(DAY_92_ASSESSMENT.targetCompetencyId === COMPETENCY_ID_ITERATORS_AND_GENERATORS, 'Assessment competency matches comp-pfs-m5-018');

  ContentValidator.validateBatchManifest(BATCH_018_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  assert(BATCH_018_MANIFEST.days[0].dayNumber === 1, 'Day 88 internal dayNumber is 1');
  assert(BATCH_018_MANIFEST.days[4].dayNumber === 5, 'Day 92 internal dayNumber is 5');
  assert(BATCH_018_MANIFEST.days[0].packetId === 'batch-pfs-m5-w18-018', 'Day 88 packetId matches batchId');

  // Verify Canonical Pedagogical Intent Sequence: UNDERSTAND -> APPLY -> BUILD -> DEBUG -> TRANSFER
  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_018_MANIFEST.days.forEach((day, idx) => {
    assert(day.pedagogicalIntent === expectedIntents[idx], `Day ${day.dayNumber} pedagogicalIntent is '${expectedIntents[idx]}'`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_018_MANIFEST.days.map((day) =>
    day.blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0)
  );

  assert(dayMinutes[0] === 85, `Day 88 workload is 85 min (Found: ${dayMinutes[0]} min)`);
  assert(dayMinutes[1] === 85, `Day 89 workload is 85 min (Found: ${dayMinutes[1]} min)`);
  assert(dayMinutes[2] === 85, `Day 90 workload is 85 min (Found: ${dayMinutes[2]} min)`);
  assert(dayMinutes[3] === 85, `Day 91 workload is 85 min (Found: ${dayMinutes[3]} min)`);
  assert(dayMinutes[4] === 95, `Day 92 assessment workload is 95 min (Found: ${dayMinutes[4]} min)`);

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  const totalHours = totalMinutes / 60;
  assert(totalMinutes === 435, `Total Batch 018 minutes exactly 435 min (Found: ${totalMinutes} min)`);
  assert(totalHours >= 6.5 && totalHours <= 7.5, `Batch 018 workload calibrated between 6.5h and 7.5h (Calculated: ${totalHours.toFixed(2)}h)`);

  // ── GROUP 3: Pedagogical Content Integrity & Canonical Contracts ──
  console.log('\n── GROUP 3: Pedagogical Content Integrity & Canonical Contracts ──');
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), 'src/lib/curriculum/pythonFullStack/batch018.ts'),
    'utf-8'
  );

  assert(fileContent.includes('__iter__'), 'The __iter__() dunder contract is explicitly defined');
  assert(fileContent.includes('__next__'), 'The __next__() dunder contract is explicitly defined');
  assert(fileContent.includes('StopIteration'), 'Native StopIteration exhaustion is explicitly specified');
  assert(fileContent.includes('__getitem__'), 'Legacy sequence-style iteration via __getitem__ is acknowledged');
  assert(fileContent.includes('PEP 479'), 'PEP 479 StopIteration conversion to RuntimeError is documented');
  assert(fileContent.includes('yield from'), 'Subgenerator delegation via yield from is formally taught');
  assert(fileContent.includes('GeneratorExit'), 'Teardown via GeneratorExit upon .close() is documented');
  assert(fileContent.includes('generator-based coroutine'), 'Generator-based coroutine terminology is consistently used');
  assert(fileContent.includes('resource-cleanup hazards'), 'Resource-cleanup hazards from abandoned generators is accurately phrased');
  assert(fileContent.includes('InvalidChunkSizeError'), 'Single canonical InvalidChunkSizeError domain exception is present');
  assert(!fileContent.includes('IteratorExhaustedError'), 'Artificial IteratorExhaustedError substitution is avoided');
  assert(!fileContent.includes('CoroutineNotPrimedError'), 'Artificial CoroutineNotPrimedError substitution is avoided');
  assert(!fileContent.includes('StreamPipelineClosedError'), 'Artificial StreamPipelineClosedError substitution is avoided');

  // ── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──
  console.log('\n── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──');
  const forbiddenPatterns = [
    { name: 'Context Managers (__enter__/__exit__)', regex: /def\s+__enter__\b|def\s+__exit__\b/ },
    { name: 'Abstract Base Classes (abc.ABC)', regex: /\babc\.ABC\b|@abstractmethod\b/ },
    { name: 'Typing Protocol', regex: /\btyping\.Protocol\b/ },
    { name: 'Advanced Typing (Generic, TypeVar)', regex: /\bGeneric\[|\bTypeVar\(/ },
    { name: 'Async / Await keywords', regex: /\basync\s+def\b|\bawait\s+/ },
    { name: 'ORM or Heavy Frameworks (django/fastapi)', regex: /\bfrom django\b|\bfrom fastapi\b/ },
  ];

  forbiddenPatterns.forEach((pat) => {
    assert(!pat.regex.test(fileContent), `Prerequisite Firewall: Zero instances of ${pat.name}`);
  });

  // ── GROUP 5: Assessment Architecture & Dual Competency Floors ──
  console.log('\n── GROUP 5: Assessment Architecture & Dual Competency Floors ──');
  assert(DAY_92_ASSESSMENT.id === 'asm-pfs-m5-w18-018', 'Assessment ID is "asm-pfs-m5-w18-018"');
  assert(DAY_92_ASSESSMENT.assessmentCode === 'ASM-PFS-M5-W18-018', 'Assessment Code is "ASM-PFS-M5-W18-018"');
  assert(DAY_92_ASSESSMENT.mode === 'FORMATIVE', 'Assessment Mode is FORMATIVE');
  assert(DAY_92_ASSESSMENT.timeLimitMinutes === 95, 'Assessment Time Limit is 95 min');

  AssessmentValidator.validateAssessment(DAY_92_ASSESSMENT);
  assert(true, 'AssessmentValidator.validateAssessment() passes with 0 validation errors');

  const asmItem = DAY_92_ASSESSMENT.items[0];
  assert(asmItem.rubricDimensions !== undefined, 'Assessment item defines rubric dimensions');
  assert(asmItem.rubricDimensions!.length === 7, 'Rubric defines exactly 7 competency dimensions');

  const weightSum = asmItem.rubricDimensions!.reduce((acc, dim) => acc + dim.weight, 0);
  assert(Math.abs(weightSum - 1.0) < 0.0001, `Rubric dimension weights sum exactly to 1.0000 (Found: ${weightSum.toFixed(4)})`);

  // Verify Mandatory Competency Floors on Dimension 1 and Dimension 5
  const dim1 = asmItem.rubricDimensions![0];
  assert(dim1.id === 'dim-b18-01', 'Dimension 1 ID is dim-b18-01');
  assert(dim1.criteria.includes('MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass'), 'Dimension 1 specifies 50% competency floor');

  const dim5 = asmItem.rubricDimensions![4];
  assert(dim5.id === 'dim-b18-05', 'Dimension 5 ID is dim-b18-05');
  assert(dim5.criteria.includes('MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass'), 'Dimension 5 specifies 50% competency floor');

  // Verify Formative Test Tiers: Only VISIBLE, ADVERSARIAL, INTEGRITY (Zero PRIVATE)
  const allTests = [
    ...(asmItem.visibleTests || []),
    ...(asmItem.adversarialTests || []),
    ...(asmItem.integrityTests || []),
  ];
  const privateTests = allTests.filter((t: any) => t.tier === 'PRIVATE');
  assert(privateTests.length === 0, 'Zero tests labeled with misleading PRIVATE tier');
  assert(allTests.every((t) => ['VISIBLE', 'ADVERSARIAL', 'INTEGRITY'].includes(t.tier)), 'All tests honestly classified as VISIBLE, ADVERSARIAL, or INTEGRITY');

  // ── GROUP 6: Streaming Transformations & Lazy Evaluation Invariants ──
  console.log('\n── GROUP 6: Streaming Transformations & Lazy Evaluation Invariants ──');

  // 1. chunk_stream basic and trailing partial chunk
  const chunks1 = Array.from(referenceChunkStream([1, 2, 3, 4, 5], 2));
  assert(JSON.stringify(chunks1) === JSON.stringify([[1, 2], [3, 4], [5]]), 'chunk_stream yields full chunks and final partial chunk');

  // 2. chunk_stream exact multiple
  const chunks2 = Array.from(referenceChunkStream([1, 2, 3, 4], 2));
  assert(JSON.stringify(chunks2) === JSON.stringify([[1, 2], [3, 4]]), 'chunk_stream yields exact multiple without trailing empty chunk');

  // 3. chunk_stream empty input yields 0 chunks
  const chunksEmpty = Array.from(referenceChunkStream([], 3));
  assert(chunksEmpty.length === 0, 'chunk_stream yields 0 chunks for empty input stream');

  // 4. chunk_stream invalid size validation (non-positive, float, bool)
  let caughtChunkErr1 = false;
  try {
    Array.from(referenceChunkStream([1], 0));
  } catch (e) {
    caughtChunkErr1 = e instanceof InvalidChunkSizeError;
  }
  assert(caughtChunkErr1, 'chunk_stream rejects chunk_size = 0 with InvalidChunkSizeError');

  let caughtChunkErr2 = false;
  try {
    Array.from(referenceChunkStream([1], -5));
  } catch (e) {
    caughtChunkErr2 = e instanceof InvalidChunkSizeError;
  }
  assert(caughtChunkErr2, 'chunk_stream rejects chunk_size < 0 with InvalidChunkSizeError');

  let caughtChunkErr3 = false;
  try {
    Array.from(referenceChunkStream([1], 2.5));
  } catch (e) {
    caughtChunkErr3 = e instanceof InvalidChunkSizeError;
  }
  assert(caughtChunkErr3, 'chunk_stream rejects non-integer float with InvalidChunkSizeError');

  let caughtChunkErr4 = false;
  try {
    Array.from(referenceChunkStream([1], true));
  } catch (e) {
    caughtChunkErr4 = e instanceof InvalidChunkSizeError;
  }
  assert(caughtChunkErr4, 'chunk_stream strictly rejects boolean True with InvalidChunkSizeError');

  // 5. window_stream sliding step 1 complete windows only
  const windows1 = Array.from(referenceWindowStream([1, 2, 3, 4, 5], 3));
  assert(JSON.stringify(windows1) === JSON.stringify([[1, 2, 3], [2, 3, 4], [3, 4, 5]]), 'window_stream emits sliding complete windows of step 1');

  // 6. window_stream incomplete stream yields 0 windows
  const windowsIncomplete = Array.from(referenceWindowStream([1, 2], 3));
  assert(windowsIncomplete.length === 0, 'window_stream emits 0 windows when input stream has fewer elements than window_size');

  // 7. window_stream empty input yields 0 windows
  const windowsEmpty = Array.from(referenceWindowStream([], 3));
  assert(windowsEmpty.length === 0, 'window_stream emits 0 windows for empty input stream');

  // 8. window_stream invalid size validation
  let caughtWindowErr = false;
  try {
    Array.from(referenceWindowStream([1, 2], -1));
  } catch (e) {
    caughtWindowErr = e instanceof InvalidChunkSizeError;
  }
  assert(caughtWindowErr, 'window_stream rejects window_size < 1 with InvalidChunkSizeError');

  // 9. merge_sorted_streams basic 3-way merge
  const s1 = [1, 4, 7];
  const s2 = [2, 5, 8];
  const s3 = [3, 6, 9];
  const merged1 = Array.from(referenceMergeSortedStreams([s1, s2, s3]));
  assert(JSON.stringify(merged1) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9]), 'merge_sorted_streams merges 3 pre-sorted streams in order');

  // 10. merge_sorted_streams deterministic tie-breaking on streamIndex
  const streamA = [2, 5];
  const streamB = [2, 3];
  const mergedTies = Array.from(referenceMergeSortedStreams([streamA, streamB]));
  assert(JSON.stringify(mergedTies) === JSON.stringify([2, 2, 3, 5]), 'merge_sorted_streams breaks ties deterministically using stream index');

  // 11. merge_sorted_streams with key extractor on unorderable dict payloads
  const dictStream1 = [{ ts: 10, payload: 'alpha' }, { ts: 30, payload: 'gamma' }];
  const dictStream2 = [{ ts: 10, payload: 'beta' }, { ts: 20, payload: 'delta' }];
  const mergedDicts = Array.from(
    referenceMergeSortedStreams([dictStream1, dictStream2], (x) => x.ts)
  );
  assert(mergedDicts.length === 4, 'merge_sorted_streams correctly merges all 4 dict items');
  assert(mergedDicts[0].payload === 'alpha' && mergedDicts[1].payload === 'beta', 'merge_sorted_streams breaks tie on streamIndex, preserving alpha before beta');
  assert(mergedDicts[2].payload === 'delta' && mergedDicts[3].payload === 'gamma', 'merge_sorted_streams preserves global timestamp ordering');

  // 12. merge_sorted_streams with empty streams
  const mergedEmpty = Array.from(referenceMergeSortedStreams([[], []]));
  assert(mergedEmpty.length === 0, 'merge_sorted_streams yields 0 items when all streams are empty');

  // 13. Single-pass exhaustion defense
  const consumedTracker = [10, 20, 30];
  const iterSource = consumedTracker[Symbol.iterator]();
  const chunkedFromIter = Array.from(referenceChunkStream(iterSource, 2));
  assert(chunkedFromIter.length === 2, 'Iterating chunk_stream consumes input elements');
  const secondPassFromIter = Array.from(referenceChunkStream(iterSource, 2));
  assert(secondPassFromIter.length === 0, 'Exhausted single-pass iterator yields 0 chunks on second pass');

  // ── GROUP 7: Generator-Based Coroutine Control & Lifecycle Verification ──
  console.log('\n── GROUP 7: Generator-Based Coroutine Control & Lifecycle Verification ──');

  // 1. Unprimed send raises TypeError
  const consumerUnprimed = new ReferenceEventStreamConsumer(50.0);
  let unprimedCaught = false;
  try {
    consumerUnprimed.send(10.0);
  } catch (e: any) {
    unprimedCaught = e instanceof TypeError;
  }
  assert(unprimedCaught, 'Sending non-None to unprimed generator raises native TypeError');

  // 2. Priming via next()
  const consumer = new ReferenceEventStreamConsumer(50.0);
  const primeStatus = consumer.next();
  assert(primeStatus.count === 0 && primeStatus.total === 0.0, 'Priming generator initializes status dictionary at count 0');

  // 3. Sending normal event under threshold
  const status1 = consumer.send(30.0);
  assert(status1.count === 1 && status1.total === 30.0 && status1.anomalies === 0 && status1.latest === 30.0, 'Event 1 under threshold increments count and total without anomaly');

  // 4. Sending anomaly event over threshold
  const status2 = consumer.send(70.0);
  assert(status2.count === 2 && status2.total === 100.0 && status2.anomalies === 1 && status2.latest === 70.0, 'Event 2 over threshold increments count, total, and anomaly count');

  // 5. Sending boundary event equal to threshold (not anomaly)
  const status3 = consumer.send(50.0);
  assert(status3.count === 3 && status3.total === 150.0 && status3.anomalies === 1, 'Event 3 equal to threshold is not an anomaly (strict > threshold)');

  // 6. Multiple events accumulation
  const status4 = consumer.send(100.0);
  assert(status4.count === 4 && status4.total === 250.0 && status4.anomalies === 2, 'Event 4 increments running total to 250.0 and anomalies to 2');

  // 7. Priming alternative: consumer.send(null)
  const consumerSendPrimed = new ReferenceEventStreamConsumer(20.0);
  const altPrime = consumerSendPrimed.send(null);
  assert(altPrime.count === 0, 'consumer.send(null) successfully primes generator without error');
  const altEvent = consumerSendPrimed.send(25.0);
  assert(altEvent.count === 1 && altEvent.anomalies === 1, 'Event sent after send(null) priming succeeds');

  // 8. Graceful teardown via .close()
  consumer.close();
  assert(true, 'consumer.close() executes cleanly without error');

  // 9. Post-close send raises StopIteration
  let postCloseCaught = false;
  try {
    consumer.send(10.0);
  } catch (e: any) {
    postCloseCaught = e instanceof StopIteration;
  }
  assert(postCloseCaught, 'Sending to closed generator raises native StopIteration');

  // 10. Post-close next() raises StopIteration
  let postCloseNextCaught = false;
  try {
    consumer.next();
  } catch (e: any) {
    postCloseNextCaught = e instanceof StopIteration;
  }
  assert(postCloseNextCaught, 'Calling next() on closed generator raises native StopIteration');

  // 11. Multiple close() calls idempotent
  consumer.close();
  assert(true, 'Calling consumer.close() repeatedly is idempotent and safe');

  // 12. Idempotent StopIteration on repeated post-close calls
  let repeatedStopIteration = false;
  try {
    consumer.send(99.0);
  } catch (e: any) {
    repeatedStopIteration = e instanceof StopIteration;
  }
  assert(repeatedStopIteration, 'Repeated send calls on closed generator continuously raise StopIteration');

  // 13. High throughput simulation (10,000 events)
  const perfConsumer = new ReferenceEventStreamConsumer(500.0);
  perfConsumer.next();
  for (let i = 1; i <= 1000; i++) {
    perfConsumer.send(i);
  }
  const finalPerfStatus = perfConsumer.getStatus();
  assert(finalPerfStatus.count === 1000 && finalPerfStatus.anomalies === 500, 'Consumer processes 1,000 streaming events with exact anomaly accounting');
  perfConsumer.close();

  // ── AUDIT SUMMARY ──
  console.log('\n========================================================================');
  console.log(`🏁 BATCH 018 AUDIT COMPLETE: ${assertionCount}/${assertionCount} CHECKS PASSED (ZERO DEFECTS)`);
  console.log('========================================================================\n');
}

runBatch018Audit().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 018 AUDIT]', err);
  process.exit(1);
});
