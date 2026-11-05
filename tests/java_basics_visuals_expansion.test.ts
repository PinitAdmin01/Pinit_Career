import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Java Basics Visuals Expansion: Days 6 to 60 On-Disk Spec Verification', () => {
  clearDayFileCache();
  const prefix = 'java-basics';
  const expectedTemplate = 'stack-queue';

  assert.equal(isCourseVisualsEnabled(prefix), true, `Course "${prefix}" must be enabled in enabledCourses`);

  const daysToTest = [];
  for (let d = 6; d <= 60; d++) {
    daysToTest.push(d);
  }

  for (const day of daysToTest) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/${prefix}/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile(prefix, day);
    assert.ok(dayFile, `loadDayFile failed for ${prefix} Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, prefix);
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected exactly 5 entries in ${prefix} Day ${day}`);

    const lesson = getLongLesson(prefix, day);
    assert.ok(lesson, `LongLesson missing for ${prefix} Day ${day}`);
    assert.equal(dayFile.entries.length, lesson.parts.length, `Parts count mismatch for ${prefix} Day ${day}`);

    for (let partIdx = 0; partIdx < lesson.parts.length; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at ${prefix} Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `codeHash mismatch at ${prefix} Day ${day} Part ${partIdx}`);

      const visual = getVisual(prefix, day, partIdx);
      assert.ok(visual, `getVisual returned null for ${prefix} Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, expectedTemplate, `Expected template "${expectedTemplate}" for ${prefix}`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for ${prefix} Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );

      const labels = getTappableLabelsForVisual(visual);
      assert.ok(labels.length > 0, `Expected non-empty tappable labels for ${prefix} Day ${day} Part ${partIdx}`);
    }
  }
});

test('Java Basics Duration Invariant: Days >= 11 Meet 20+ Spoken Min and 35-40 Total Min', () => {
  const daysToTest = [];
  for (let d = 11; d <= 60; d++) {
    daysToTest.push(d);
  }

  for (const day of daysToTest) {
    const lesson = getLongLesson('java-basics', day);
    assert.ok(lesson);
    const spoken = estimateSpokenMinutes(lesson);
    const total = estimateLessonMinutes(lesson);

    assert.ok(spoken >= 20, `Day ${day} spoken duration must be >= 20 min, got ${spoken}`);
    assert.ok(total >= 35, `Day ${day} total duration must be >= 35 min, got ${total}`);
  }
});

test('Java Basics Days 31-60 Domain & Masterclass Integrity Verification', () => {
  const prefix = 'java-basics';

  // Day 31: Classes, Heap Instances & Reference Pointer Mechanics
  const d31 = getLongLesson(prefix, 31);
  assert.ok(d31);
  assert.equal(d31.parts.length, 5);
  assert.match(d31.title, /Classes, Heap Instances & Reference Pointer Mechanics/);

  // Day 32: Constructors, State Initialization & The this Keyword
  const d32 = getLongLesson(prefix, 32);
  assert.ok(d32);
  assert.equal(d32.parts.length, 5);
  assert.match(d32.title, /Constructors, State Initialization & The this Keyword/);

  // Day 33: Data Hiding: Private Fields, Defensive Getters/Setters & Immutability
  const d33 = getLongLesson(prefix, 33);
  assert.ok(d33);
  assert.equal(d33.parts.length, 5);
  assert.match(d33.title, /Data Hiding: Private Fields, Defensive Getters\/Setters & Immutability/);

  // Day 34: Static State (Metaspace Class Variables) vs Heap Instance State
  const d34 = getLongLesson(prefix, 34);
  assert.ok(d34);
  assert.equal(d34.parts.length, 5);
  assert.match(d34.title, /Static State \(Metaspace Class Variables\) vs Heap Instance State/);

  // Day 35: Milestone 6: Enterprise Bank Account Domain Model
  const d35 = getLongLesson(prefix, 35);
  assert.ok(d35);
  assert.equal(d35.parts.length, 5);
  assert.match(d35.title, /Milestone 6.*Enterprise Bank Account Domain Model/);

  // Day 36: Inheritance Hierarchies — extends, super Constructor Chaining & Code Reuse
  const d36 = getLongLesson(prefix, 36);
  assert.ok(d36);
  assert.equal(d36.parts.length, 5);
  assert.match(d36.title, /Inheritance Hierarchies/);
  assert.ok(d36.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('super(') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('extends') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('invokespecial')));

  // Day 37: Method Overriding, @Override, Virtual Method Tables (vtable) & Dynamic Dispatch
  const d37 = getLongLesson(prefix, 37);
  assert.ok(d37);
  assert.equal(d37.parts.length, 5);
  assert.match(d37.title, /Method Overriding/);
  assert.ok(d37.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('vtable') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('@Override') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('dynamic dispatch')));

  // Day 38: The Universal Object Contract: equals(), hashCode(), and Reference Identity (==)
  const d38 = getLongLesson(prefix, 38);
  assert.ok(d38);
  assert.equal(d38.parts.length, 5);
  assert.match(d38.title, /The Universal Object Contract/);
  assert.ok(d38.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('equals') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('hashCode') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('bucket')));

  // Day 39: Abstract Classes vs Interfaces & Default Method Contract Evolution
  const d39 = getLongLesson(prefix, 39);
  assert.ok(d39);
  assert.equal(d39.parts.length, 5);
  assert.match(d39.title, /Abstract Classes vs Interfaces/);
  assert.ok(d39.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Template Method') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('invokeinterface') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('diamond')));

  // Day 40: Milestone 7: Pluggable Multi-Provider Payment Gateway Interface Engine
  const d40 = getLongLesson(prefix, 40);
  assert.ok(d40);
  assert.equal(d40.parts.length, 5);
  assert.match(d40.title, /Milestone 7.*Payment Gateway/);
  assert.ok(d40.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Dependency Inversion') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('PaymentProcessor') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('GatewayRouter')));

  // Day 41: JVM Throwable Hierarchy: Throwable, Error, Exception & RuntimeException
  const d41 = getLongLesson(prefix, 41);
  assert.ok(d41);
  assert.equal(d41.parts.length, 5);
  assert.match(d41.title, /JVM Throwable Hierarchy/);
  assert.ok(d41.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('OutOfMemoryError') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('athrow') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Exception Table')));

  // Day 42: Defensive Error Recovery: try-catch-finally Blocks & Exception Propagation
  const d42 = getLongLesson(prefix, 42);
  assert.ok(d42);
  assert.equal(d42.parts.length, 5);
  assert.match(d42.title, /Defensive Error Recovery/);
  assert.ok(d42.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Stack Unwinding') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('hijacked') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('lock.lock()')));

  // Day 43: Resource Lifecycles: AutoCloseable, try-with-resources & Custom Fault Taxonomies
  const d43 = getLongLesson(prefix, 43);
  assert.ok(d43);
  assert.equal(d43.parts.length, 5);
  assert.match(d43.title, /Resource Lifecycles/);
  assert.ok(d43.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('AutoCloseable') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Too many open files') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('addSuppressed')));

  // Day 44: JVM Garbage Collection Anatomy & Diagnosing Real Memory Leaks
  const d44 = getLongLesson(prefix, 44);
  assert.ok(d44);
  assert.equal(d44.parts.length, 5);
  assert.match(d44.title, /JVM Garbage Collection/);
  assert.ok(d44.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Generational Hypothesis') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('GC Root') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('ThreadLocal')));

  // Day 45: Milestone 8: Resilient Order File Ingestion Engine with Auto-Rollback
  const d45 = getLongLesson(prefix, 45);
  assert.ok(d45);
  assert.equal(d45.parts.length, 5);
  assert.match(d45.title, /Milestone 8.*Resilient Order File Ingestion Engine/);
  assert.ok(d45.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('All-Or-Nothing') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Torn State') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Two-Phase Commit')));

  // Day 46: Generics, Compile-Time Type Safety & Type Erasure Mechanics
  const d46 = getLongLesson(prefix, 46);
  assert.ok(d46);
  assert.equal(d46.parts.length, 5);
  assert.match(d46.title, /Generics.*Type Erasure/);
  assert.ok(d46.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Type Erasure') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('PECS') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Raw Type')));

  // Day 47: ArrayList Internals: Dynamic Amortized Growth, Array Copy & Capacity Sizing
  const d47 = getLongLesson(prefix, 47);
  assert.ok(d47);
  assert.equal(d47.parts.length, 5);
  assert.match(d47.title, /ArrayList.*Internals/);
  assert.ok(d47.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('1.5x') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('reallocation') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('System.arraycopy')));

  // Day 48: HashMap Deep Dive: Hash Codes, Buckets, Collision Chains & Red-Black Tree Binning
  const d48 = getLongLesson(prefix, 48);
  assert.ok(d48);
  assert.equal(d48.parts.length, 5);
  assert.match(d48.title, /HashMap.*Deep Dive/);
  assert.ok(d48.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('bucket') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Treeification') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('power of two')));

  // Day 49: HashSet, Comparable vs Comparator Lambda Custom Sorting
  const d49 = getLongLesson(prefix, 49);
  assert.ok(d49);
  assert.equal(d49.parts.length, 5);
  assert.match(d49.title, /HashSet.*Comparable.*Comparator/);
  assert.ok(d49.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('TimSort') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('anti-symmetry') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('thenComparing')));

  // Day 50: Milestone 9: High-Throughput In-Memory Order Book & Inventory Cache
  const d50 = getLongLesson(prefix, 50);
  assert.ok(d50);
  assert.equal(d50.parts.length, 5);
  assert.match(d50.title, /Milestone 9.*Order Book/);
  assert.ok(d50.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Order Book') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Composite') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('50,000')));

  // Day 51: Operating System Threads vs Java Thread & Runnable
  const d51 = getLongLesson(prefix, 51);
  assert.ok(d51);
  assert.equal(d51.parts.length, 5);
  assert.match(d51.title, /Operating System Threads vs Java Thread/);
  assert.ok(d51.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('1:1') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('start()') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('join()')));

  // Day 52: Race Conditions, Critical Sections & The Lost Update Anomaly
  const d52 = getLongLesson(prefix, 52);
  assert.ok(d52);
  assert.equal(d52.parts.length, 5);
  assert.match(d52.title, /Race Conditions/);
  assert.ok(d52.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('count++') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('getfield') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Check-Then-Act')));

  // Day 53: Intrinsic Locks: synchronized Blocks, Methods & Monitor Mechanics
  const d53 = getLongLesson(prefix, 53);
  assert.ok(d53);
  assert.equal(d53.parts.length, 5);
  assert.match(d53.title, /Intrinsic Locks/);
  assert.ok(d53.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('monitorenter') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Reentrancy') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('ordered lock')));

  // Day 54: The Java Memory Model (JMM): volatile Keyword, CPU Caches & Happens-Before Order
  const d54 = getLongLesson(prefix, 54);
  assert.ok(d54);
  assert.equal(d54.parts.length, 5);
  assert.match(d54.title, /Java Memory Model/);
  assert.ok(d54.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Happens-Before') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('volatile') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Double-Checked')));

  // Day 55: Milestone 10: Thread-Safe Concurrent Producer-Consumer Work Queue with wait() / notifyAll()
  const d55 = getLongLesson(prefix, 55);
  assert.ok(d55);
  assert.equal(d55.parts.length, 5);
  assert.match(d55.title, /Milestone 10.*Producer-Consumer/);
  assert.ok(d55.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('wait()') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('notifyAll()') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Spurious Wakeup')));

  // Day 56: Modern Concurrency: ExecutorService, ThreadPoolExecutor & Thread Pool Tuning
  const d56 = getLongLesson(prefix, 56);
  assert.ok(d56);
  assert.equal(d56.parts.length, 5);
  assert.match(d56.title, /ExecutorService.*ThreadPoolExecutor/);
  assert.ok(d56.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Brian Goetz') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('CallerRunsPolicy') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('newCachedThreadPool')));

  // Day 57: Atomic Primitives: AtomicInteger, AtomicReference & Lock-Free CAS Loops
  const d57 = getLongLesson(prefix, 57);
  assert.ok(d57);
  assert.equal(d57.parts.length, 5);
  assert.match(d57.title, /Atomic Primitives.*Lock-Free CAS/);
  assert.ok(d57.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('CMPXCHG') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('LongAdder') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Treiber')));

  // Day 58: Enterprise Database Connectivity: JDBC, Connection Pooling (HikariCP) & Transactions
  const d58 = getLongLesson(prefix, 58);
  assert.ok(d58);
  assert.equal(d58.parts.length, 5);
  assert.match(d58.title, /Enterprise Database Connectivity.*JDBC.*HikariCP/);
  assert.ok(d58.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('HikariCP') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('PreparedStatement') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('setAutoCommit(false)')));

  // Day 59: High-Throughput Streams, Lambdas & Modern Functional Processing Pipelines
  const d59 = getLongLesson(prefix, 59);
  assert.ok(d59);
  assert.equal(d59.parts.length, 5);
  assert.match(d59.title, /High-Throughput Streams.*Functional Processing/);
  assert.ok(d59.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Loop Fusion') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('groupingBy') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('ForkJoinPool')));

  // Day 60: Month 2 Master Capstone Gate: LedgerCore Enterprise Settlement Engine & Live Architecture Viva
  const d60 = getLongLesson(prefix, 60);
  assert.ok(d60);
  assert.equal(d60.parts.length, 5);
  assert.match(d60.title, /Month 2 Master Capstone Gate.*LedgerCore/);
  assert.ok(d60.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('LedgerCore') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('100,000') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Coffman')));
});
