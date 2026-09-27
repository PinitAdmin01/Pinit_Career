// scripts/test_batch017.ts
// Comprehensive technical, structural, and behavioral audit test suite for PinIT Batch 017 (Days 83–87)
// Advanced Python: Closures, Lexical Scoping Invariants, First-Class Functions & Decorator Architecture

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_017_MANIFEST,
  DAY_83_MANIFEST,
  DAY_84_MANIFEST,
  DAY_85_MANIFEST,
  DAY_86_MANIFEST,
  DAY_87_MANIFEST,
  DAY_87_ASSESSMENT,
  COMPETENCY_ID_CLOSURES_AND_DECORATORS,
} from '../src/lib/curriculum/pythonFullStack/batch017';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';

let totalChecks = 0;
let passedChecks = 0;

function assert(condition: boolean, message: string) {
  totalChecks++;
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedChecks++;
  console.log(`  ✅ [PASS] ${message}`);
}

// ── CANONICAL DOMAIN EXCEPTIONS (TypeScript counterparts for behavioral tests) ──
class DecoratorStructureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DecoratorStructureError';
  }
}

class MetadataPreservationError extends DecoratorStructureError {
  constructor(message: string) {
    super(message);
    this.name = 'MetadataPreservationError';
  }
}

class SignatureMismatchError extends DecoratorStructureError {
  constructor(message: string) {
    super(message);
    this.name = 'SignatureMismatchError';
  }
}

class RetryExhaustedError extends DecoratorStructureError {
  constructor(message: string) {
    super(message);
    this.name = 'RetryExhaustedError';
  }
}

class UnhashableArgumentError extends DecoratorStructureError {
  constructor(message: string) {
    super(message);
    this.name = 'UnhashableArgumentError';
  }
}

class RateLimitExceededError extends DecoratorStructureError {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitExceededError';
  }
}

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (Mirroring Python Contracts) ──

// 1. Retry with Backoff Factory
function referenceRetryWithBackoff(options: {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryExceptions?: (new (...args: any[]) => Error)[];
  sleeper?: (delay: number) => void;
} = {}) {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelay = options.baseDelay ?? 1.0;
  const maxDelay = options.maxDelay ?? 10.0;
  const backoffFactor = options.backoffFactor ?? 2.0;
  const retryExceptions = options.retryExceptions ?? [Error];
  const sleeper = options.sleeper ?? ((_d: number) => {});

  return function (func: (...args: any[]) => any) {
    const wrapper = function (this: any, ...args: any[]) {
      let lastErr: any = null;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return func.apply(this, args);
        } catch (e: any) {
          lastErr = e;
          const isRetryable = retryExceptions.some((cls) => e instanceof cls || e.name === cls.name);
          if (!isRetryable) {
            // Immediate outward propagation for non-retryable exceptions
            throw e;
          }
          if (attempt < maxRetries) {
            const k = attempt + 1; // 1-indexed retry number
            const delay = Math.min(baseDelay * Math.pow(backoffFactor, k - 1), maxDelay);
            sleeper(delay);
          } else {
            throw new RetryExhaustedError(`Function ${func.name || 'anonymous'} exhausted ${maxRetries} retries: ${e.message}`);
          }
        }
      }
      throw new RetryExhaustedError(`Retries exhausted: ${lastErr?.message}`);
    };

    // Metadata preservation and __wrapped__ exposure
    (wrapper as any).__wrapped__ = func;
    Object.defineProperty(wrapper, 'name', { value: func.name, configurable: true });
    return wrapper;
  };
}

// 2. Stateful Memoization Factory with Deterministic Key Normalization
function referenceMemoizeWithStats(options: { maxsize?: number | null } = {}) {
  const maxsize = options.maxsize ?? null;

  return function (func: (...args: any[]) => any) {
    const cache = new Map<string, any>();
    let hits = 0;
    let misses = 0;

    // Helper checking hashability: objects/arrays are treated as unhashable unless primitive/null
    function assertHashable(val: any) {
      if (val !== null && typeof val === 'object') {
        throw new UnhashableArgumentError(`Argument is unhashable: ${JSON.stringify(val)}`);
      }
    }

    const wrapper = function (this: any, ...args: any[]) {
      // Deterministic key contract: args as array, kwargs as sorted key-value pairs
      // If the last argument is an object of named kwargs:
      let positionalArgs = args;
      let kwargs: Record<string, any> = {};

      // For testing kwargs in TS, inspect if caller provided kwargs object marker
      if (args.length > 0 && args[args.length - 1] && (args[args.length - 1] as any).__is_kwargs__) {
        positionalArgs = args.slice(0, -1);
        kwargs = { ...(args[args.length - 1] as any) };
        delete kwargs.__is_kwargs__;
      }

      // Check hashability of all positional args
      for (const arg of positionalArgs) {
        assertHashable(arg);
      }

      // Check hashability of all kwargs
      const sortedKwargKeys = Object.keys(kwargs).sort();
      for (const k of sortedKwargKeys) {
        assertHashable(kwargs[k]);
      }

      const argsKey = JSON.stringify(positionalArgs);
      const kwargsKey = JSON.stringify(sortedKwargKeys.map((k) => [k, kwargs[k]]));
      const cacheKey = `(${argsKey}, ${kwargsKey})`;

      if (cache.has(cacheKey)) {
        hits++;
        (wrapper as any).hits = hits;
        return cache.get(cacheKey);
      }

      misses++;
      (wrapper as any).misses = misses;
      const result = func.apply(this, args);

      if (maxsize !== null && maxsize > 0 && cache.size >= maxsize) {
        // Evict oldest inserted entry (FIFO)
        const oldestKey = cache.keys().next().value;
        if (oldestKey !== undefined) {
          cache.delete(oldestKey);
        }
      }

      cache.set(cacheKey, result);
      return result;
    };

    function cacheClear() {
      cache.clear();
      hits = 0;
      misses = 0;
      (wrapper as any).hits = 0;
      (wrapper as any).misses = 0;
    }

    function stats() {
      return { hits, misses, size: cache.size };
    }

    (wrapper as any).__wrapped__ = func;
    Object.defineProperty(wrapper, 'name', { value: func.name, configurable: true });
    (wrapper as any).hits = 0;
    (wrapper as any).misses = 0;
    (wrapper as any).cache_clear = cacheClear;
    (wrapper as any).stats = stats;

    return wrapper;
  };
}

// 3. Fixed-Window Rate Limiter Factory with Controllable Clock
function referenceRateLimiter(maxCalls: number, periodSeconds: number, clockFunc: () => number = () => Date.now() / 1000) {
  return function (func: (...args: any[]) => any) {
    let windowStart: number | null = null;
    let callCount = 0;

    const wrapper = function (this: any, ...args: any[]) {
      const now = clockFunc();
      if (windowStart === null || now - windowStart >= periodSeconds) {
        windowStart = now;
        callCount = 1;
        return func.apply(this, args);
      }

      if (callCount < maxCalls) {
        callCount++;
        return func.apply(this, args);
      } else {
        throw new RateLimitExceededError(`Rate limit exceeded: ${maxCalls} calls per ${periodSeconds}s.`);
      }
    };

    (wrapper as any).__wrapped__ = func;
    Object.defineProperty(wrapper, 'name', { value: func.name, configurable: true });
    return wrapper;
  };
}

async function runBatch017Audit() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 017 (DAYS 83–87) TECHNICAL AUDIT TEST SUITE');
  console.log('Advanced Python: Closures, Lexical Scoping & Decorator Architecture');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_017_MANIFEST.batchCode === 'P2-M5-W17-BATCH017', 'Batch code is P2-M5-W17-BATCH017');
  assert(BATCH_017_MANIFEST.batchId === 'batch-pfs-m5-w17-017', 'Batch ID is batch-pfs-m5-w17-017');
  assert(BATCH_017_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 83–87)');
  assert(BATCH_017_MANIFEST.difficulty === 'INTERMEDIATE', 'Difficulty is INTERMEDIATE');
  assert(COMPETENCY_ID_CLOSURES_AND_DECORATORS === 'comp-pfs-m5-017', 'Competency matches comp-pfs-m5-017');

  ContentValidator.validateBatchManifest(BATCH_017_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  // Verify Day Numbers and Pedagogical Intents
  assert(DAY_83_MANIFEST.dayNumber === 1, 'Day 83 is Day 1 with dayNumber 1');
  assert(DAY_83_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 83 has canonical intent UNDERSTAND');

  assert(DAY_84_MANIFEST.dayNumber === 2, 'Day 84 is Day 2 with dayNumber 2');
  assert(DAY_84_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 84 has canonical intent APPLY');

  assert(DAY_85_MANIFEST.dayNumber === 3, 'Day 85 is Day 3 with dayNumber 3');
  assert(DAY_85_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 85 has canonical intent BUILD');

  assert(DAY_86_MANIFEST.dayNumber === 4, 'Day 86 is Day 4 with dayNumber 4');
  assert(DAY_86_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 86 has canonical intent DEBUG');

  assert(DAY_87_MANIFEST.dayNumber === 5, 'Day 87 is Day 5 with dayNumber 5');
  assert(DAY_87_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 87 has canonical intent TRANSFER');

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const d83Min = DAY_83_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const d84Min = DAY_84_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const d85Min = DAY_85_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const d86Min = DAY_86_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);
  const d87Min = DAY_87_MANIFEST.blocks.reduce((acc, b) => acc + b.estimatedMinutes, 0);

  assert(d83Min === 85, `Day 83 workload is exactly 85 minutes (Found: ${d83Min})`);
  assert(d84Min === 85, `Day 84 workload is exactly 85 minutes (Found: ${d84Min})`);
  assert(d85Min === 85, `Day 85 workload is exactly 85 minutes (Found: ${d85Min})`);
  assert(d86Min === 85, `Day 86 workload is exactly 85 minutes (Found: ${d86Min})`);
  assert(d87Min === 95, `Day 87 workload is exactly 95 minutes (Found: ${d87Min})`);

  const totalMin = d83Min + d84Min + d85Min + d86Min + d87Min;
  const totalHours = totalMin / 60;
  assert(totalMin === 435, `Total batch instructional minutes is exactly 435 (Found: ${totalMin})`);
  assert(totalHours >= 6.5 && totalHours <= 7.5, `Batch 017 workload calibrated between 6.5h and 7.5h (Calculated: ${totalHours.toFixed(2)}h)`);

  // ── GROUP 3: Pedagogical Content Integrity & Canonical Vocabularies ──
  console.log('\n── GROUP 3: Pedagogical Content Integrity & Canonical Vocabularies ──');
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), 'src/lib/curriculum/pythonFullStack/batch017.ts'),
    'utf-8'
  );

  const canonicalExceptions = [
    'DecoratorStructureError',
    'MetadataPreservationError',
    'SignatureMismatchError',
    'RetryExhaustedError',
    'UnhashableArgumentError',
    'RateLimitExceededError',
  ];

  canonicalExceptions.forEach((exc) => {
    assert(fileContent.includes(`class ${exc}`), `Canonical exception '${exc}' is defined in Batch 017`);
  });

  // Verify core concepts are taught
  assert(fileContent.includes('functools.wraps'), 'functools.wraps metadata preservation is taught');
  assert(fileContent.includes('__wrapped__'), '__wrapped__ introspection is taught');
  assert(fileContent.includes('nonlocal'), 'nonlocal lexical rebinding is taught');
  assert(fileContent.includes('Late Binding'), 'Late binding closure trap is explained and resolved');
  assert(fileContent.includes('cell_contents'), 'Closure cell objects and cell_contents are taught');
  assert(fileContent.includes('fixed-window'), 'Fixed-window rate limiting semantics are defined');
  assert(fileContent.includes('exponential backoff'), 'Exponential backoff retry formula is documented');

  // ── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──
  console.log('\n── GROUP 4: Prerequisite Firewall & Forbidden Concept AST Scan ──');
  const forbiddenPatterns = [
    { name: 'Premature Django Framework', regex: /\bfrom\s+django\b|\bimport\s+django\b/ },
    { name: 'Premature FastAPI Framework', regex: /\bfrom\s+fastapi\b|\bimport\s+fastapi\b/ },
    { name: 'Premature Celery Framework', regex: /\bfrom\s+celery\b|\bimport\s+celery\b/ },
    { name: 'Premature Docker', regex: /\bFROM\s+python:|\bDockerfile\b/ },
    { name: 'Premature Database ORM', regex: /\bsqlalchemy\b|\bpeewee\b/ },
    { name: 'Premature Async Endpoints (async def)', regex: /\basync\s+def\b/ },
  ];

  forbiddenPatterns.forEach((pat) => {
    assert(!pat.regex.test(fileContent), `Prerequisite Firewall: Zero occurrences of forbidden concept '${pat.name}'`);
  });

  // ── GROUP 5: Assessment Architecture & Honest Test Tiers ──
  console.log('\n── GROUP 5: Assessment Architecture & Honest Test Tiers ──');
  assert(DAY_87_ASSESSMENT.mode === 'FORMATIVE', 'Day 87 assessment is strictly FORMATIVE');
  assert(DAY_87_ASSESSMENT.timeLimitMinutes === 95, 'Day 87 assessment time limit is exactly 95 minutes');
  assert(DAY_87_ASSESSMENT.items.length === 1, 'Assessment contains exactly 1 comprehensive synthesis item');

  AssessmentValidator.validateAssessment(DAY_87_ASSESSMENT);
  assert(true, 'AssessmentValidator.validateAssessment() passes with 0 validation errors');

  const item = DAY_87_ASSESSMENT.items[0];
  const rubric = item.rubricDimensions || [];
  assert(rubric.length === 7, 'Rubric contains exactly 7 dimensions');

  const weightSum = rubric.reduce((sum, d) => sum + d.weight, 0);
  assert(Math.abs(weightSum - 1.0) < 0.0001, `Rubric dimension weights sum exactly to 1.0000 (Found: ${weightSum.toFixed(4)})`);

  // Verify Honest Formative Test Tiers (ADVERSARIAL instead of PRIVATE)
  assert(!item.privateTests || item.privateTests.length === 0, 'No misleading PRIVATE test fixtures present');
  assert(item.adversarialTests !== undefined && item.adversarialTests.length > 0, 'Honest ADVERSARIAL client-accessible formative fixtures present');
  assert(item.visibleTests !== undefined && item.visibleTests.length > 0, 'VISIBLE test fixtures present');
  assert(item.integrityTests !== undefined && item.integrityTests.length > 0, 'INTEGRITY test fixtures present');

  // Verify Dual Competency Floors
  const dim1 = rubric.find((d) => d.id === 'dim-b17-01');
  assert(dim1 !== undefined && (dim1 as any).criteria.includes('MANDATORY COMPETENCY FLOOR: Minimum 50% score'), 'Competency Floor 1 Verified: Dimension 1 (Retry with Backoff) enforces 50% minimum passing score');

  const dim5 = rubric.find((d) => d.id === 'dim-b17-05');
  assert(dim5 !== undefined && (dim5 as any).criteria.includes('MANDATORY COMPETENCY FLOOR: Minimum 50% score'), 'Competency Floor 2 Verified: Dimension 5 (Memoization with Stats) enforces 50% minimum passing score');

  // ── GROUP 6: Closures & Decorator Behavioral Invariants ──
  console.log('\n── GROUP 6: Closures & Decorator Behavioral Invariants ──');

  // 1. Late-binding behavior demonstration
  const brokenLambdas: (() => number)[] = [];
  for (let i = 0; i < 3; i++) {
    // Sharing the mutable reference loop variable
    brokenLambdas.push(() => i);
  }
  // In JS with 'let', loop variable is block-scoped, but let's emulate shared reference:
  let sharedIndex = 0;
  const sharedRefLambdas: (() => number)[] = [];
  for (sharedIndex = 0; sharedIndex < 3; sharedIndex++) {
    sharedRefLambdas.push(() => sharedIndex);
  }
  assert(sharedRefLambdas.map((f) => f()).every((v) => v === 3), 'Late binding trap verified: all closures evaluated to final loop value');

  // Fixed snapshotting
  const snapshotLambdas: (() => number)[] = [];
  for (let s = 0; s < 3; s++) {
    ((captured) => {
      snapshotLambdas.push(() => captured);
    })(s);
  }
  assert(JSON.stringify(snapshotLambdas.map((f) => f())) === JSON.stringify([0, 1, 2]), 'Snapshotting pattern captures distinct values at definition time');

  // 2. Fixed-Window Rate Limiter boundary tests with controllable clock
  let simulatedClock = 1000.0;
  const rateLimiter = referenceRateLimiter(2, 5.0, () => simulatedClock);
  const rateLimitedOp = rateLimiter(() => 'OK');

  assert(rateLimitedOp() === 'OK', 'Rate limiter call 1 allowed in window');
  assert(rateLimitedOp() === 'OK', 'Rate limiter call 2 allowed in window');

  let rateExceededCaught = false;
  try {
    rateLimitedOp();
  } catch (e: any) {
    rateExceededCaught = e instanceof RateLimitExceededError;
  }
  assert(rateExceededCaught, 'Rate limiter call 3 in same window raises RateLimitExceededError');

  // Advance controllable clock past window
  simulatedClock += 5.1;
  assert(rateLimitedOp() === 'OK', 'After window expiration, counter resets and call is allowed');

  // 3. Stacked __wrapped__ layer-by-layer peeling verification
  function rawBase(x: number) {
    return x * 10;
  }

  const memoizer = referenceMemoizeWithStats();
  const retrier = referenceRetryWithBackoff({ maxRetries: 2 });

  // Stack: @retrier \n @memoizer \n def rawBase
  const layered = retrier(memoizer(rawBase));

  assert(layered(5) === 50, 'Stacked decorator executes successfully');
  assert(hasWrapper(layered), 'Outer layer has __wrapped__');
  const innerWrapper = (layered as any).__wrapped__;
  assert(innerWrapper !== rawBase, '__wrapped__ points to the NEXT wrapped decorator layer, not raw base');
  assert((innerWrapper as any).__wrapped__ === rawBase, 'Second __wrapped__ access reaches original base function');

  function hasWrapper(fn: any) {
    return typeof fn === 'function' && fn.__wrapped__ !== undefined;
  }

  // ── GROUP 7: Parameterized Factories, Backoff & Adversarial Invariants ──
  console.log('\n── GROUP 7: Parameterized Factories, Backoff & Adversarial Invariants ──');

  // 1. Retry attempt counting and exact backoff delays
  const recordedDelays: number[] = [];
  let serviceCalls = 0;
  const mockSleeper = (d: number) => {
    recordedDelays.push(d);
  };

  class TransientNetworkError extends Error {
    constructor() {
      super('Transient network failure');
      this.name = 'TransientNetworkError';
    }
  }

  const retryDecorated = referenceRetryWithBackoff({
    maxRetries: 3,
    baseDelay: 1.0,
    backoffFactor: 2.0,
    maxDelay: 10.0,
    retryExceptions: [TransientNetworkError],
    sleeper: mockSleeper,
  })(() => {
    serviceCalls++;
    if (serviceCalls < 3) {
      throw new TransientNetworkError();
    }
    return 'SUCCESS';
  });

  const retryResult = retryDecorated();
  assert(retryResult === 'SUCCESS', 'Retry decorator recovers on attempt 3');
  assert(serviceCalls === 3, 'Total service invocations = 3 (1 initial + 2 retries)');
  assert(JSON.stringify(recordedDelays) === JSON.stringify([1.0, 2.0]), 'Exact backoff formula verified: recorded delays are [1.0, 2.0]');

  // 2. Non-matching exception immediate propagation (no retry)
  class FatalAuthError extends Error {
    constructor() {
      super('Invalid credentials');
      this.name = 'FatalAuthError';
    }
  }

  let fatalCalls = 0;
  const fatalDecorated = referenceRetryWithBackoff({
    maxRetries: 3,
    retryExceptions: [TransientNetworkError],
    sleeper: mockSleeper,
  })(() => {
    fatalCalls++;
    throw new FatalAuthError();
  });

  let fatalPropagated = false;
  try {
    fatalDecorated();
  } catch (e: any) {
    fatalPropagated = e instanceof FatalAuthError;
  }
  assert(fatalPropagated, 'Non-retryable exception propagated immediately without retrying');
  assert(fatalCalls === 1, 'Non-retryable exception had exactly 1 invocation (attempt 0)');

  // 3. Retry exhaustion raises RetryExhaustedError
  let exhaustedCalls = 0;
  const exhaustedDecorated = referenceRetryWithBackoff({
    maxRetries: 2,
    retryExceptions: [TransientNetworkError],
    sleeper: (_d) => {},
  })(() => {
    exhaustedCalls++;
    throw new TransientNetworkError();
  });

  let exhaustedCaught = false;
  try {
    exhaustedDecorated();
  } catch (e: any) {
    exhaustedCaught = e instanceof RetryExhaustedError;
  }
  assert(exhaustedCaught, 'Exhausting all retries raises RetryExhaustedError');
  assert(exhaustedCalls === 3, 'Exhausted retries executed exactly 1 + max_retries = 3 total attempts');

  // 4. Memoize hits, misses, cache clear, and deterministic keying
  let computeCalls = 0;
  const memoizedAdd = referenceMemoizeWithStats({ maxsize: 2 })((a: number, b: number) => {
    computeCalls++;
    return a + b;
  });

  assert(memoizedAdd(2, 3) === 5, 'Initial call computes result');
  assert(computeCalls === 1, 'Initial call is a miss (computeCalls = 1)');
  assert(memoizedAdd(2, 3) === 5, 'Second identical call retrieves cached result');
  assert(computeCalls === 1, 'Second call is a hit (computeCalls remains 1)');

  const statsAfterHit = memoizedAdd.stats();
  assert(statsAfterHit.hits === 1, 'Stats reports exactly 1 hit');
  assert(statsAfterHit.misses === 1, 'Stats reports exactly 1 miss');
  assert(statsAfterHit.size === 1, 'Stats reports cache size 1');

  // 5. Unhashable argument defense
  let unhashableCaught = false;
  try {
    memoizedAdd([1, 2], 3); // Passing mutable array
  } catch (e: any) {
    unhashableCaught = e instanceof UnhashableArgumentError;
  }
  assert(unhashableCaught, 'Passing unhashable argument raises UnhashableArgumentError');

  // 6. Bounded cache FIFO eviction
  memoizedAdd(10, 20); // miss 2, size 2 (keys: (2,3), (10,20))
  assert(memoizedAdd.stats().size === 2, 'Cache at maxsize 2');

  memoizedAdd(30, 40); // miss 3, triggers FIFO eviction of (2,3), size remains 2
  assert(memoizedAdd.stats().size === 2, 'Cache size remains capped at maxsize 2');

  computeCalls = 0;
  memoizedAdd(2, 3); // was evicted! Must re-compute
  assert(computeCalls === 1, 'Evicted key (2,3) recomputed upon subsequent call');

  // 7. cache_clear() verification
  memoizedAdd.cache_clear();
  assert(memoizedAdd.stats().size === 0, 'cache_clear() emptied cache');
  assert(memoizedAdd.stats().hits === 0, 'cache_clear() reset hits to 0');
  assert(memoizedAdd.stats().misses === 0, 'cache_clear() reset misses to 0');

  console.log('\n========================================================================');
  console.log(`🏁 BATCH 017 DEDICATED AUDIT RESULTS: ALL ${passedChecks}/${totalChecks} CHECKS PASSED CLEANLY`);
  console.log('========================================================================\n');
}

runBatch017Audit().catch((err) => {
  console.error('\n🚨 BATCH 017 AUDIT SUITE FAILED:\n', err);
  process.exit(1);
});
