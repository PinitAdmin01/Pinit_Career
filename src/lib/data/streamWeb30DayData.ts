import { DayConfig, buildEnrichedDayQuests } from './curriculumEnricher';
import { STREAM_DAYS } from './streamWebDays';

const lines = (...l: string[]) => l.join('\n');

export const STREAM_WEB_30_DAYS_CONFIGS: DayConfig[] = [
  // ── DAY 1 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[0],
    eTitle: "Append Event to Monotonic In-Memory Log",
    eDesc: "Write `appendEventLog(log: { offset: number; payload: string; timestamp: number }[], payload: string, timestamp: number): { offset: number; payload: string; timestamp: number }` that appends a record with offset = log.length (monotonically increasing 0-based index) and returns the appended record.",
    eLanguage: "typescript",
    eStarter: lines(
      "function appendEventLog(log: { offset: number; payload: string; timestamp: number }[], payload: string, timestamp: number): { offset: number; payload: string; timestamp: number } {",
      "  // Append record with sequential offset",
      "  return { offset: -1, payload: '', timestamp: 0 };",
      "}"
    ),
    eHint: "Create record with offset = log.length, push it to log array, and return it.",
    eTest: lines(
      "if (typeof appendEventLog !== 'function') throw new Error('appendEventLog not found');",
      "const log = [];",
      "const r1 = appendEventLog(log, 'msg-1', 1000);",
      "if (r1.offset !== 0 || r1.payload !== 'msg-1' || r1.timestamp !== 1000) throw new Error('Failed first append');",
      "if (log.length !== 1 || log[0].offset !== 0) throw new Error('Log array not mutated');",
      "const r2 = appendEventLog(log, 'msg-2', 1050);",
      "if (r2.offset !== 1 || r2.payload !== 'msg-2' || r2.timestamp !== 1050) throw new Error('Failed second append');",
      "if (log.length !== 2) throw new Error('Log length mismatch');"
    ),
    aTitle: "Binary Search Log Offset by Target Timestamp",
    aDesc: "Write `findFirstOffsetAtOrAfter(log: { offset: number; timestamp: number }[], targetTimestamp: number): number | null` returning the offset of the first event whose timestamp >= targetTimestamp, or null if no such event exists. Log is sorted by timestamp.",
    aLanguage: "typescript",
    aStarter: lines(
      "function findFirstOffsetAtOrAfter(log: { offset: number; timestamp: number }[], targetTimestamp: number): number | null {",
      "  // Binary search for offset >= targetTimestamp",
      "  return null;",
      "}"
    ),
    aHint: "Use binary search on log: if mid.timestamp >= target, record candidate and search left, else search right.",
    aTest: lines(
      "if (typeof findFirstOffsetAtOrAfter !== 'function') throw new Error('findFirstOffsetAtOrAfter not found');",
      "const entries = [",
      "  { offset: 0, timestamp: 100 },",
      "  { offset: 1, timestamp: 200 },",
      "  { offset: 2, timestamp: 300 },",
      "  { offset: 3, timestamp: 400 }",
      "];",
      "if (findFirstOffsetAtOrAfter(entries, 250) !== 2) throw new Error('Failed at 250 -> 2');",
      "if (findFirstOffsetAtOrAfter(entries, 100) !== 0) throw new Error('Failed at 100 -> 0');",
      "if (findFirstOffsetAtOrAfter(entries, 400) !== 3) throw new Error('Failed at 400 -> 3');",
      "if (findFirstOffsetAtOrAfter(entries, 450) !== null) throw new Error('Failed at 450 -> null');",
      "if (findFirstOffsetAtOrAfter([], 100) !== null) throw new Error('Failed empty -> null');"
    )
  },

  // ── DAY 2 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[1],
    eTitle: "Deterministic Partition Key Hasher",
    eDesc: "Write `hashKeyToPartition(key: string, partitionCount: number): number` using a deterministic 32-bit hash algorithm (djb2 hash: hash = ((hash << 5) + hash) + charCode; start with 5381, clamp to non-negative Math.abs(hash) % partitionCount). If partitionCount <= 0, return 0.",
    eLanguage: "typescript",
    eStarter: lines(
      "function hashKeyToPartition(key: string, partitionCount: number): number {",
      "  // Deterministic djb2 partition hashing",
      "  return 0;",
      "}"
    ),
    eHint: "Iterate over chars of key, updating 32-bit hash with ((hash << 5) + hash) + charCode. Return Math.abs(hash) % partitionCount.",
    eTest: lines(
      "if (typeof hashKeyToPartition !== 'function') throw new Error('hashKeyToPartition not found');",
      "if (hashKeyToPartition('user-101', 4) < 0 || hashKeyToPartition('user-101', 4) >= 4) throw new Error('Out of bounds');",
      "const p1 = hashKeyToPartition('user-101', 8);",
      "const p2 = hashKeyToPartition('user-101', 8);",
      "if (p1 !== p2) throw new Error('Non-deterministic hash');",
      "const p3 = hashKeyToPartition('user-999', 8);",
      "if (hashKeyToPartition('test', 0) !== 0) throw new Error('Zero partitions handled');",
      "if (p1 === p3 && hashKeyToPartition('user-a', 8) === p1 && hashKeyToPartition('user-b', 8) === p1) throw new Error('Poor distribution');"
    ),
    aTitle: "Round-Robin State Partitioner with Sticky Batching",
    aDesc: "Write `createStickyRoundRobinPartitioner(partitionCount: number, batchSizeLimit: number): (key: string | null) => number` that assigns null-keyed records in batches to the same partition before cycling to the next partition in round-robin order. If key is non-null, use key.length % partitionCount.",
    aLanguage: "typescript",
    aStarter: lines(
      "function createStickyRoundRobinPartitioner(partitionCount: number, batchSizeLimit: number): (key: string | null) => number {",
      "  // Sticky round-robin partitioner",
      "  return (_key: string | null) => 0;",
      "}"
    ),
    aHint: "Maintain currentPartition and currentBatchCount. When null, increment count; if >= batchSizeLimit rotate partition.",
    aTest: lines(
      "if (typeof createStickyRoundRobinPartitioner !== 'function') throw new Error('createStickyRoundRobinPartitioner not found');",
      "const partitioner = createStickyRoundRobinPartitioner(3, 2);",
      "if (partitioner(null) !== 0) throw new Error('Batch 1 item 1 should be partition 0');",
      "if (partitioner(null) !== 0) throw new Error('Batch 1 item 2 should be partition 0');",
      "if (partitioner(null) !== 1) throw new Error('Batch 2 item 1 should rotate to partition 1');",
      "if (partitioner(null) !== 1) throw new Error('Batch 2 item 2 should be partition 1');",
      "if (partitioner(null) !== 2) throw new Error('Batch 3 item 1 should rotate to partition 2');",
      "if (partitioner('abc') !== 0) throw new Error('Keyed should use length % count');"
    )
  },

  // ── DAY 3 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[2],
    eTitle: "Bounded Consumer Polling against High-Water Mark",
    eDesc: "Write `pollPartitionRecords(records: { offset: number; payload: string }[], currentOffset: number, maxRecords: number, highWaterMark: number): { records: { offset: number; payload: string }[]; nextOffset: number }` that reads records starting at currentOffset up to highWaterMark (exclusive) with limit maxRecords.",
    eLanguage: "typescript",
    eStarter: lines(
      "function pollPartitionRecords(records: { offset: number; payload: string }[], currentOffset: number, maxRecords: number, highWaterMark: number): { records: { offset: number; payload: string }[]; nextOffset: number } {",
      "  // Poll records bounded by HWM",
      "  return { records: [], nextOffset: currentOffset };",
      "}"
    ),
    eHint: "Filter records where offset >= currentOffset and offset < highWaterMark, take up to maxRecords, compute nextOffset.",
    eTest: lines(
      "if (typeof pollPartitionRecords !== 'function') throw new Error('pollPartitionRecords not found');",
      "const log = [",
      "  { offset: 0, payload: 'a' },",
      "  { offset: 1, payload: 'b' },",
      "  { offset: 2, payload: 'c' },",
      "  { offset: 3, payload: 'd' },",
      "  { offset: 4, payload: 'e' }",
      "];",
      "const r1 = pollPartitionRecords(log, 1, 2, 4);",
      "if (r1.records.length !== 2 || r1.records[0].offset !== 1 || r1.records[1].offset !== 2 || r1.nextOffset !== 3) {",
      "  throw new Error('Failed poll 1: ' + JSON.stringify(r1));",
      "}",
      "const r2 = pollPartitionRecords(log, 3, 5, 4);",
      "if (r2.records.length !== 1 || r2.records[0].offset !== 3 || r2.nextOffset !== 4) {",
      "  throw new Error('Failed poll 2 bounded by HWM: ' + JSON.stringify(r2));",
      "}",
      "const r3 = pollPartitionRecords(log, 4, 5, 4);",
      "if (r3.records.length !== 0 || r3.nextOffset !== 4) {",
      "  throw new Error('Failed poll at HWM boundary: ' + JSON.stringify(r3));",
      "}"
    ),
    aTitle: "Calculate Consumer Group Partition Lag Telemetry",
    aDesc: "Write `computeConsumerLag(hwms: Record<number, number>, committed: Record<number, number>): { totalLag: number; perPartitionLag: Record<number, number>; maxLagPartition: number; maxLag: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function computeConsumerLag(hwms: Record<number, number>, committed: Record<number, number>): { totalLag: number; perPartitionLag: Record<number, number>; maxLagPartition: number; maxLag: number } {",
      "  // Compute consumer lag",
      "  return { totalLag: 0, perPartitionLag: {}, maxLagPartition: -1, maxLag: 0 };",
      "}"
    ),
    aHint: "For each partition in hwms, lag = Math.max(0, hwm - (committed[p] || 0)). Sum totalLag and track maxLag.",
    aTest: lines(
      "if (typeof computeConsumerLag !== 'function') throw new Error('computeConsumerLag not found');",
      "const hwms = { 0: 100, 1: 250, 2: 80 };",
      "const committed = { 0: 90, 1: 200, 2: 80 };",
      "const res = computeConsumerLag(hwms, committed);",
      "if (res.totalLag !== 60) throw new Error('Total lag mismatch: ' + res.totalLag);",
      "if (res.perPartitionLag[0] !== 10 || res.perPartitionLag[1] !== 50 || res.perPartitionLag[2] !== 0) throw new Error('Per-partition lag mismatch: ' + JSON.stringify(res.perPartitionLag));",
      "if (res.maxLagPartition !== 1 || res.maxLag !== 50) throw new Error('Max lag partition mismatch: ' + res.maxLagPartition);",
      "const empty = computeConsumerLag({}, {});",
      "if (empty.totalLag !== 0 || empty.maxLagPartition !== -1) throw new Error('Empty lag failed');"
    )
  },

  // ── DAY 4 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[3],
    eTitle: "Validate Partition Monotonic Sequence Ordering",
    eDesc: "Write `validatePartitionSequences(events: { partition: number; offset: number; sequence: number }[]): { valid: boolean; violations: { partition: number; expected: number; actual: number }[] }` where within each partition, sequence numbers must be strictly monotonically increasing (seq[i] > seq[i-1]).",
    eLanguage: "typescript",
    eStarter: lines(
      "function validatePartitionSequences(events: { partition: number; offset: number; sequence: number }[]): { valid: boolean; violations: { partition: number; expected: number; actual: number }[] } {",
      "  // Validate per-partition strict sequence ordering",
      "  return { valid: false, violations: [] };",
      "}"
    ),
    eHint: "Track lastSeq per partition. If event.sequence <= lastSeq, append violation with expected = lastSeq + 1.",
    eTest: lines(
      "if (typeof validatePartitionSequences !== 'function') throw new Error('validatePartitionSequences not found');",
      "const validEvents = [",
      "  { partition: 0, offset: 0, sequence: 1 },",
      "  { partition: 1, offset: 0, sequence: 10 },",
      "  { partition: 0, offset: 1, sequence: 2 },",
      "  { partition: 1, offset: 1, sequence: 11 },",
      "];",
      "const r1 = validatePartitionSequences(validEvents);",
      "if (!r1.valid || r1.violations.length !== 0) throw new Error('Valid stream marked invalid: ' + JSON.stringify(r1));",
      "const invalidEvents = [",
      "  { partition: 0, offset: 0, sequence: 5 },",
      "  { partition: 0, offset: 1, sequence: 4 },",
      "  { partition: 1, offset: 0, sequence: 1 },",
      "];",
      "const r2 = validatePartitionSequences(invalidEvents);",
      "if (r2.valid || r2.violations.length !== 1 || r2.violations[0].partition !== 0) throw new Error('Invalid stream missed: ' + JSON.stringify(r2));"
    ),
    aTitle: "Deterministic K-Way Merge for Timestamp-Ordered Stream Slices",
    aDesc: "Write `mergeTimestampedPartitions(partitions: { partition: number; timestamp: number; payload: string }[][]): { partition: number; timestamp: number; payload: string }[]` that merges sorted partition streams into a single globally chronologically sorted array. In case of identical timestamps, break ties by ascending partition ID.",
    aLanguage: "typescript",
    aStarter: lines(
      "function mergeTimestampedPartitions(partitions: { partition: number; timestamp: number; payload: string }[][]): { partition: number; timestamp: number; payload: string }[] {",
      "  // K-way merge timestamped partition streams",
      "  return [];",
      "}"
    ),
    aHint: "Flatten array of partitions and sort primarily by timestamp ascending and secondarily by partition ID ascending.",
    aTest: lines(
      "if (typeof mergeTimestampedPartitions !== 'function') throw new Error('mergeTimestampedPartitions not found');",
      "const p0 = [{ partition: 0, timestamp: 10, payload: 'p0-1' }, { partition: 0, timestamp: 30, payload: 'p0-2' }];",
      "const p1 = [{ partition: 1, timestamp: 10, payload: 'p1-1' }, { partition: 1, timestamp: 20, payload: 'p1-2' }];",
      "const merged = mergeTimestampedPartitions([p0, p1]);",
      "if (merged.length !== 4) throw new Error('Merged length mismatch: ' + merged.length);",
      "if (merged[0].payload !== 'p0-1' || merged[1].payload !== 'p1-1' || merged[2].payload !== 'p1-2' || merged[3].payload !== 'p0-2') {",
      "  throw new Error('Incorrect merge order: ' + JSON.stringify(merged));",
      "}",
      "if (mergeTimestampedPartitions([]).length !== 0) throw new Error('Empty merge failed');"
    )
  },

  // ── DAY 5 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[4],
    eTitle: "In-Memory Partitioned Topic Broker",
    eDesc: "Implement `class InMemoryEventBroker` with `constructor(numPartitions: number)`, `produce(key: string, payload: string): { partition: number; offset: number }`, `consume(partition: number, startOffset: number, maxCount: number): { offset: number; key: string; payload: string }[]`, and `getHighWaterMark(partition: number): number`. Key hashing uses `key.length % numPartitions`.",
    eLanguage: "typescript",
    eStarter: lines(
      "class InMemoryEventBroker {",
      "  constructor(public numPartitions: number) {}",
      "  produce(key: string, payload: string): { partition: number; offset: number } {",
      "    return { partition: 0, offset: 0 };",
      "  }",
      "  consume(partition: number, startOffset: number, maxCount: number): { offset: number; key: string; payload: string }[] {",
      "    return [];",
      "  }",
      "  getHighWaterMark(partition: number): number {",
      "    return 0;",
      "  }",
      "}"
    ),
    eHint: "Maintain an array of partitions where each partition is an array of records. Partition = key.length % numPartitions.",
    eTest: lines(
      "if (typeof InMemoryEventBroker !== 'function') throw new Error('InMemoryEventBroker not found');",
      "const broker = new InMemoryEventBroker(2);",
      "const p1 = broker.produce('ab', 'payload-1');",
      "const p2 = broker.produce('abc', 'payload-2');",
      "const p3 = broker.produce('cd', 'payload-3');",
      "if (p1.partition !== 0 || p1.offset !== 0) throw new Error('Produce 1 failed: ' + JSON.stringify(p1));",
      "if (p2.partition !== 1 || p2.offset !== 0) throw new Error('Produce 2 failed: ' + JSON.stringify(p2));",
      "if (p3.partition !== 0 || p3.offset !== 1) throw new Error('Produce 3 failed: ' + JSON.stringify(p3));",
      "if (broker.getHighWaterMark(0) !== 2) throw new Error('HWM part 0 should be 2');",
      "if (broker.getHighWaterMark(1) !== 1) throw new Error('HWM part 1 should be 1');",
      "const msgs = broker.consume(0, 0, 10);",
      "if (msgs.length !== 2 || msgs[1].payload !== 'payload-3') throw new Error('Consume failed: ' + JSON.stringify(msgs));"
    ),
    aTitle: "Broker Consumer Group Offset Coordinator",
    aDesc: "Implement `class ConsumerGroupCoordinator` with `commit(groupId: string, partition: number, offset: number): void`, `getCommitted(groupId: string, partition: number): number | null`, and `getGroupSummary(groupId: string): Record<number, number>`.",
    aLanguage: "typescript",
    aStarter: lines(
      "class ConsumerGroupCoordinator {",
      "  commit(groupId: string, partition: number, offset: number): void {}",
      "  getCommitted(groupId: string, partition: number): number | null {",
      "    return null;",
      "  }",
      "  getGroupSummary(groupId: string): Record<number, number> {",
      "    return {};",
      "  }",
      "}"
    ),
    aHint: "Store a nested map of groupId -> partition -> offset.",
    aTest: lines(
      "if (typeof ConsumerGroupCoordinator !== 'function') throw new Error('ConsumerGroupCoordinator not found');",
      "const coord = new ConsumerGroupCoordinator();",
      "coord.commit('analytics-grp', 0, 105);",
      "coord.commit('analytics-grp', 1, 42);",
      "if (coord.getCommitted('analytics-grp', 0) !== 105) throw new Error('Commit part 0 failed');",
      "if (coord.getCommitted('analytics-grp', 1) !== 42) throw new Error('Commit part 1 failed');",
      "if (coord.getCommitted('analytics-grp', 2) !== null) throw new Error('Uncommitted part should be null');",
      "const summary = coord.getGroupSummary('analytics-grp');",
      "if (summary[0] !== 105 || summary[1] !== 42) throw new Error('Summary failed: ' + JSON.stringify(summary));"
    )
  },

  // ── DAY 6 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[5],
    eTitle: "Range Partition Assignment Protocol",
    eDesc: "Write `assignPartitionsRange(numPartitions: number, consumers: string[]): Record<string, number[]>` allocating contiguous ranges of partitions across sorted consumers. If numPartitions = 5 and consumers = ['c1', 'c2'], c1 gets [0, 1, 2] and c2 gets [3, 4]. If consumers is empty, return {}.",
    eLanguage: "typescript",
    eStarter: lines(
      "function assignPartitionsRange(numPartitions: number, consumers: string[]): Record<string, number[]> {",
      "  // Allocate range partitions",
      "  return {};",
      "}"
    ),
    eHint: "Sort consumers. Compute base = floor(numPartitions / count) and remainder = numPartitions % count. Distribute partitions sequentially.",
    eTest: lines(
      "if (typeof assignPartitionsRange !== 'function') throw new Error('assignPartitionsRange not found');",
      "const r1 = assignPartitionsRange(5, ['c2', 'c1']);",
      "if (!r1['c1'] || r1['c1'].length !== 3 || r1['c1'][0] !== 0 || r1['c1'][2] !== 2) throw new Error('c1 range mismatch: ' + JSON.stringify(r1));",
      "if (!r1['c2'] || r1['c2'].length !== 2 || r1['c2'][0] !== 3 || r1['c2'][1] !== 4) throw new Error('c2 range mismatch: ' + JSON.stringify(r1));",
      "const r2 = assignPartitionsRange(2, ['c1', 'c2', 'c3']);",
      "if (r2['c3'].length !== 0) throw new Error('Idle consumer should have empty array: ' + JSON.stringify(r2));",
      "if (Object.keys(assignPartitionsRange(4, [])).length !== 0) throw new Error('Empty consumers should return empty');"
    ),
    aTitle: "Round-Robin Partition Assignment Protocol",
    aDesc: "Write `assignPartitionsRoundRobin(numPartitions: number, consumers: string[]): Record<string, number[]>` assigning partitions sequentially (partition i assigned to consumers[i % consumers.length]) across sorted consumers.",
    aLanguage: "typescript",
    aStarter: lines(
      "function assignPartitionsRoundRobin(numPartitions: number, consumers: string[]): Record<string, number[]> {",
      "  // Round-robin partition assignor",
      "  return {};",
      "}"
    ),
    aHint: "Sort consumers. Loop i from 0 to numPartitions - 1, assigning partition i to sorted[i % count].",
    aTest: lines(
      "if (typeof assignPartitionsRoundRobin !== 'function') throw new Error('assignPartitionsRoundRobin not found');",
      "const rr1 = assignPartitionsRoundRobin(5, ['b', 'a']);",
      "if (!rr1['a'] || JSON.stringify(rr1['a']) !== JSON.stringify([0, 2, 4])) throw new Error('Consumer a mismatch: ' + JSON.stringify(rr1));",
      "if (!rr1['b'] || JSON.stringify(rr1['b']) !== JSON.stringify([1, 3])) throw new Error('Consumer b mismatch: ' + JSON.stringify(rr1));",
      "if (Object.keys(assignPartitionsRoundRobin(3, [])).length !== 0) throw new Error('Empty consumers failed');"
    )
  },

  // ── DAY 7 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[6],
    eTitle: "Calculate Cooperative Sticky Rebalance Partition Migrations",
    eDesc: "Write `calculateStickyMigrations(currentAssignment: Record<string, number[]>, newAssignment: Record<string, number[]>): { retained: Record<string, number[]>; revoked: Record<string, number[]>; assigned: Record<string, number[]> }` computing retained, revoked, and newly assigned partitions per consumer.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateStickyMigrations(currentAssignment: Record<string, number[]>, newAssignment: Record<string, number[]>): { retained: Record<string, number[]>; revoked: Record<string, number[]>; assigned: Record<string, number[]> } {",
      "  // Compute sticky migrations",
      "  return { retained: {}, revoked: {}, assigned: {} };",
      "}"
    ),
    eHint: "For each consumer in both current and new: retained = intersection, revoked = current - new, assigned = new - current.",
    eTest: lines(
      "if (typeof calculateStickyMigrations !== 'function') throw new Error('calculateStickyMigrations not found');",
      "const curr = { c1: [0, 1], c2: [2, 3] };",
      "const next = { c1: [0], c2: [1, 2, 3] };",
      "const res = calculateStickyMigrations(curr, next);",
      "if (JSON.stringify(res.retained.c1) !== JSON.stringify([0])) throw new Error('c1 retained fail: ' + JSON.stringify(res));",
      "if (JSON.stringify(res.revoked.c1) !== JSON.stringify([1])) throw new Error('c1 revoked fail: ' + JSON.stringify(res));",
      "if (JSON.stringify(res.assigned.c2) !== JSON.stringify([1])) throw new Error('c2 assigned fail: ' + JSON.stringify(res));",
      "if (JSON.stringify(res.retained.c2) !== JSON.stringify([2, 3])) throw new Error('c2 retained fail: ' + JSON.stringify(res));",
      "const curr2 = { c1: [0] };",
      "const next2 = { c1: [0, 1] };",
      "const res2 = calculateStickyMigrations(curr2, next2);",
      "if (JSON.stringify(res2.assigned.c1) !== JSON.stringify([1]) || res2.revoked.c1.length !== 0) throw new Error('res2 fail: ' + JSON.stringify(res2));"
    ),
    aTitle: "Consumer Heartbeat Liveness & Dead Member Eviction",
    aDesc: "Implement `class ConsumerHeartbeatTracker` with `constructor(sessionTimeoutMs: number)`, `heartbeat(consumerId: string, timestampMs: number): void`, and `getDeadMembers(currentTimestampMs: number): string[]` returning consumers whose elapsed time > sessionTimeoutMs.",
    aLanguage: "typescript",
    aStarter: lines(
      "class ConsumerHeartbeatTracker {",
      "  constructor(public sessionTimeoutMs: number) {}",
      "  heartbeat(consumerId: string, timestampMs: number): void {}",
      "  getDeadMembers(currentTimestampMs: number): string[] {",
      "    return [];",
      "  }",
      "}"
    ),
    aHint: "Track lastHeartbeat timestamp per consumer. Check if currentTimestampMs - lastHeartbeat > sessionTimeoutMs.",
    aTest: lines(
      "if (typeof ConsumerHeartbeatTracker !== 'function') throw new Error('ConsumerHeartbeatTracker not found');",
      "const tracker = new ConsumerHeartbeatTracker(3000);",
      "tracker.heartbeat('c1', 1000);",
      "tracker.heartbeat('c2', 2500);",
      "const dead1 = tracker.getDeadMembers(4500);",
      "if (dead1.length !== 1 || dead1[0] !== 'c1') throw new Error('Dead members mismatch at 4500: ' + JSON.stringify(dead1));",
      "const dead2 = tracker.getDeadMembers(6000);",
      "if (dead2.length !== 2) throw new Error('Both should be dead at 6000: ' + JSON.stringify(dead2));"
    )
  },

  // ── DAY 8 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[7],
    eTitle: "Batch Offset Commit Tracker with High-Water Mark Gating",
    eDesc: "Implement `class BatchOffsetTracker` with `recordProcessed(partition: number, offset: number): void`, `getPendingCommits(): Record<number, number>` (returning the highest processed offset + 1 for each partition), and `commit(): Record<number, number>` which marks all pending as committed and returns them.",
    eLanguage: "typescript",
    eStarter: lines(
      "class BatchOffsetTracker {",
      "  recordProcessed(partition: number, offset: number): void {}",
      "  getPendingCommits(): Record<number, number> {",
      "    return {};",
      "  }",
      "  commit(): Record<number, number> {",
      "    return {};",
      "  }",
      "}"
    ),
    eHint: "Store max processed offset + 1 per partition. On commit(), snapshot and clear pending.",
    eTest: lines(
      "if (typeof BatchOffsetTracker !== 'function') throw new Error('BatchOffsetTracker not found');",
      "const tracker = new BatchOffsetTracker();",
      "tracker.recordProcessed(0, 10);",
      "tracker.recordProcessed(0, 11);",
      "tracker.recordProcessed(1, 5);",
      "const pending = tracker.getPendingCommits();",
      "if (pending[0] !== 12 || pending[1] !== 6) throw new Error('Pending commit mismatch: ' + JSON.stringify(pending));",
      "const committed = tracker.commit();",
      "if (committed[0] !== 12 || committed[1] !== 6) throw new Error('Committed mismatch: ' + JSON.stringify(committed));",
      "const afterPending = tracker.getPendingCommits();",
      "if (Object.keys(afterPending).length !== 0) throw new Error('Pending should be empty after commit: ' + JSON.stringify(afterPending));"
    ),
    aTitle: "Exponential Retry Backoff with Truncated Cap for Commit Failures",
    aDesc: "Write `computeCommitRetryDelay(attempt: number, baseDelayMs: number, maxDelayMs: number, backoffFactor: number = 2): number` computing baseDelayMs * (backoffFactor ** attempt) capped at maxDelayMs. If attempt < 0, return 0.",
    aLanguage: "typescript",
    aStarter: lines(
      "function computeCommitRetryDelay(attempt: number, baseDelayMs: number, maxDelayMs: number, backoffFactor: number = 2): number {",
      "  // Compute exponential commit retry delay",
      "  return 0;",
      "}"
    ),
    aHint: "Multiply baseDelayMs by backoffFactor ** attempt, round result, and cap with Math.min(maxDelayMs).",
    aTest: lines(
      "if (typeof computeCommitRetryDelay !== 'function') throw new Error('computeCommitRetryDelay not found');",
      "if (computeCommitRetryDelay(0, 50, 1000) !== 50) throw new Error('Attempt 0 failed');",
      "if (computeCommitRetryDelay(1, 50, 1000) !== 100) throw new Error('Attempt 1 failed');",
      "if (computeCommitRetryDelay(2, 50, 1000) !== 200) throw new Error('Attempt 2 failed');",
      "if (computeCommitRetryDelay(5, 50, 1000) !== 1000) throw new Error('Capped attempt 5 failed');",
      "if (computeCommitRetryDelay(-1, 50, 1000) !== 0) throw new Error('Negative attempt failed');"
    )
  },

  // ── DAY 9 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[8],
    eTitle: "Simulate Streaming Delivery Semantics & Failure Vectors",
    eDesc: "Write `evaluateDeliveryOutcome(strategy: 'at-most-once' | 'at-least-once', crashDuringProcessing: boolean): { dataLossPossible: boolean; duplicatesPossible: boolean; offsetCommitted: boolean; messageProcessed: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateDeliveryOutcome(strategy: 'at-most-once' | 'at-least-once', crashDuringProcessing: boolean): { dataLossPossible: boolean; duplicatesPossible: boolean; offsetCommitted: boolean; messageProcessed: boolean } {",
      "  // Evaluate delivery semantics outcome",
      "  return { dataLossPossible: false, duplicatesPossible: false, offsetCommitted: false, messageProcessed: false };",
      "}"
    ),
    eHint: "At-most-once commits offset first (crash causes data loss, no duplicates). At-least-once commits after processing (crash causes duplicates, no data loss).",
    eTest: lines(
      "if (typeof evaluateDeliveryOutcome !== 'function') throw new Error('evaluateDeliveryOutcome not found');",
      "const r1 = evaluateDeliveryOutcome('at-most-once', true);",
      "if (!r1.dataLossPossible || r1.duplicatesPossible || !r1.offsetCommitted || r1.messageProcessed) throw new Error('Failed at-most-once crash: ' + JSON.stringify(r1));",
      "const r2 = evaluateDeliveryOutcome('at-least-once', true);",
      "if (r2.dataLossPossible || !r2.duplicatesPossible || r2.offsetCommitted || r2.messageProcessed) throw new Error('Failed at-least-once crash: ' + JSON.stringify(r2));",
      "const r3 = evaluateDeliveryOutcome('at-least-once', false);",
      "if (r3.dataLossPossible || r3.duplicatesPossible || !r3.offsetCommitted || !r3.messageProcessed) throw new Error('Failed clean at-least-once: ' + JSON.stringify(r3));"
    ),
    aTitle: "Sliding Window LRU Message Deduplication Filter",
    aDesc: "Implement `class DeduplicationWindowFilter` with `constructor(windowCapacity: number)` and `checkAndMark(messageId: string): boolean` (returns true if message was ALREADY seen, or false if it is new and marks it as seen, evicting the oldest message if capacity exceeded).",
    aLanguage: "typescript",
    aStarter: lines(
      "class DeduplicationWindowFilter {",
      "  constructor(public windowCapacity: number) {}",
      "  checkAndMark(messageId: string): boolean {",
      "    return false;",
      "  }",
      "}"
    ),
    aHint: "Use a Set for fast lookup and an array/queue for tracking FIFO eviction order.",
    aTest: lines(
      "if (typeof DeduplicationWindowFilter !== 'function') throw new Error('DeduplicationWindowFilter not found');",
      "const filter = new DeduplicationWindowFilter(2);",
      "if (filter.checkAndMark('msg-1') !== false) throw new Error('msg-1 should be new');",
      "if (filter.checkAndMark('msg-1') !== true) throw new Error('msg-1 should be duplicate');",
      "if (filter.checkAndMark('msg-2') !== false) throw new Error('msg-2 should be new');",
      "if (filter.checkAndMark('msg-3') !== false) throw new Error('msg-3 should be new, evicting msg-1');",
      "if (filter.checkAndMark('msg-1') !== false) throw new Error('msg-1 was evicted, should be new again');"
    )
  },

  // ── DAY 10 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[9],
    eTitle: "Idempotent Producer Monotonic Sequence Sequencer",
    eDesc: "Implement `class IdempotentProducerSequencer` with `constructor(producerId: number, epoch: number)` and `nextEnvelope(partition: number, payload: string): { producerId: number; epoch: number; partition: number; sequence: number; payload: string }` maintaining independent monotonic 0-based sequence numbers per partition.",
    eLanguage: "typescript",
    eStarter: lines(
      "class IdempotentProducerSequencer {",
      "  constructor(public producerId: number, public epoch: number) {}",
      "  nextEnvelope(partition: number, payload: string): { producerId: number; epoch: number; partition: number; sequence: number; payload: string } {",
      "    return { producerId: 0, epoch: 0, partition: 0, sequence: 0, payload: '' };",
      "  }",
      "}"
    ),
    eHint: "Map partition to next sequence integer. Return envelope with current sequence then increment map entry.",
    eTest: lines(
      "if (typeof IdempotentProducerSequencer !== 'function') throw new Error('IdempotentProducerSequencer not found');",
      "const seq = new IdempotentProducerSequencer(101, 1);",
      "const e1 = seq.nextEnvelope(0, 'hello');",
      "const e2 = seq.nextEnvelope(1, 'world');",
      "const e3 = seq.nextEnvelope(0, 'again');",
      "if (e1.producerId !== 101 || e1.epoch !== 1 || e1.partition !== 0 || e1.sequence !== 0) throw new Error('e1 mismatch: ' + JSON.stringify(e1));",
      "if (e2.producerId !== 101 || e2.epoch !== 1 || e2.partition !== 1 || e2.sequence !== 0) throw new Error('e2 mismatch: ' + JSON.stringify(e2));",
      "if (e3.producerId !== 101 || e3.epoch !== 1 || e3.partition !== 0 || e3.sequence !== 1) throw new Error('e3 mismatch: ' + JSON.stringify(e3));"
    ),
    aTitle: "Exactly-Once Transactional State & Offset Store",
    aDesc: "Implement `class TransactionalConsumerStateStore` with `processMessage(record: { id: string; partition: number; offset: number; amount: number }): boolean` (returns true if accepted, false if record.id was already processed), `getBalance(): number`, and `getPartitionOffsets(): Record<number, number>`.",
    aLanguage: "typescript",
    aStarter: lines(
      "class TransactionalConsumerStateStore {",
      "  processMessage(record: { id: string; partition: number; offset: number; amount: number }): boolean {",
      "    return false;",
      "  }",
      "  getBalance(): number {",
      "    return 0;",
      "  }",
      "  getPartitionOffsets(): Record<number, number> {",
      "    return {};",
      "  }",
      "}"
    ),
    aHint: "Track processed message IDs in a Set. If not present, add to balance and set offset to record.offset + 1.",
    aTest: lines(
      "if (typeof TransactionalConsumerStateStore !== 'function') throw new Error('TransactionalConsumerStateStore not found');",
      "const store = new TransactionalConsumerStateStore();",
      "const ok1 = store.processMessage({ id: 'tx-1', partition: 0, offset: 10, amount: 100 });",
      "const ok2 = store.processMessage({ id: 'tx-1', partition: 0, offset: 10, amount: 100 });",
      "const ok3 = store.processMessage({ id: 'tx-2', partition: 1, offset: 5, amount: 50 });",
      "if (!ok1) throw new Error('tx-1 should be accepted');",
      "if (ok2) throw new Error('tx-1 duplicate should be rejected');",
      "if (!ok3) throw new Error('tx-2 should be accepted');",
      "if (store.getBalance() !== 150) throw new Error('Balance mismatch: ' + store.getBalance());",
      "const offsets = store.getPartitionOffsets();",
      "if (offsets[0] !== 11 || offsets[1] !== 6) throw new Error('Offsets mismatch: ' + JSON.stringify(offsets));"
    )
  },

  // ── DAY 11 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[10],
    eTitle: "Bounded Ring Buffer with High/Low Watermark Flow Control",
    eDesc: "Implement `class BoundedFlowBuffer<T>` with `constructor(capacity: number, highWatermarkRatio: number = 0.8, lowWatermarkRatio: number = 0.4)`, `enqueue(item: T): boolean` (rejects if at full capacity), `dequeue(): T | null`, `isPaused(): boolean` (switches to true when occupancy >= highWatermark, and back to false when occupancy <= lowWatermark), and `size(): number`.",
    eLanguage: "typescript",
    eStarter: lines(
      "class BoundedFlowBuffer<T> {",
      "  constructor(public capacity: number, public highWatermarkRatio: number = 0.8, public lowWatermarkRatio: number = 0.4) {}",
      "  enqueue(item: T): boolean {",
      "    return false;",
      "  }",
      "  dequeue(): T | null {",
      "    return null;",
      "  }",
      "  isPaused(): boolean {",
      "    return false;",
      "  }",
      "  size(): number {",
      "    return 0;",
      "  }",
      "}"
    ),
    eHint: "Track queue array. Check size against capacity * highWatermarkRatio to pause, and capacity * lowWatermarkRatio to unpause.",
    eTest: lines(
      "if (typeof BoundedFlowBuffer !== 'function') throw new Error('BoundedFlowBuffer not found');",
      "const buf = new BoundedFlowBuffer(10, 0.8, 0.4);",
      "for (let i = 0; i < 7; i++) buf.enqueue(i);",
      "if (buf.isPaused()) throw new Error('Should not pause at 7/10');",
      "buf.enqueue(7);",
      "if (!buf.isPaused()) throw new Error('Should pause at 8/10');",
      "for (let i = 0; i < 3; i++) buf.dequeue();",
      "if (!buf.isPaused()) throw new Error('Should remain paused at 5/10');",
      "buf.dequeue();",
      "if (buf.isPaused()) throw new Error('Should unpause at 4/10');"
    ),
    aTitle: "Producer Semaphore In-Flight Slot Controller",
    aDesc: "Implement `class InFlightSlotController` with `constructor(maxInFlight: number)`, `acquire(): boolean` (returns true if slot obtained, false if max reached), `release(): void`, and `getInFlight(): number`.",
    aLanguage: "typescript",
    aStarter: lines(
      "class InFlightSlotController {",
      "  constructor(public maxInFlight: number) {}",
      "  acquire(): boolean {",
      "    return false;",
      "  }",
      "  release(): void {}",
      "  getInFlight(): number {",
      "    return 0;",
      "  }",
      "}"
    ),
    aHint: "Increment count if < maxInFlight. On release, decrement count if > 0.",
    aTest: lines(
      "if (typeof InFlightSlotController !== 'function') throw new Error('InFlightSlotController not found');",
      "const ctrl = new InFlightSlotController(2);",
      "if (!ctrl.acquire()) throw new Error('Slot 1 fail');",
      "if (!ctrl.acquire()) throw new Error('Slot 2 fail');",
      "if (ctrl.acquire()) throw new Error('Slot 3 should be rejected');",
      "if (ctrl.getInFlight() !== 2) throw new Error('Count should be 2');",
      "ctrl.release();",
      "if (ctrl.getInFlight() !== 1) throw new Error('Count should be 1');",
      "if (!ctrl.acquire()) throw new Error('Should re-acquire after release');"
    )
  },

  // ── DAY 12 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[11],
    eTitle: "Micro-Batch Ingestion Buffer with Size & Linger Flush Triggers",
    eDesc: "Implement `class MicroBatchAccumulator<T>` with `constructor(maxBatchSize: number, maxLingerMs: number)`, `add(item: T, timestampMs: number): { shouldFlush: boolean; batch: T[] | null }`, and `flush(): T[]`. Flush triggers when batch size reaches maxBatchSize or timestampMs - firstItemTimestamp >= maxLingerMs.",
    eLanguage: "typescript",
    eStarter: lines(
      "class MicroBatchAccumulator<T> {",
      "  constructor(public maxBatchSize: number, public maxLingerMs: number) {} ",
      "  add(item: T, timestampMs: number): { shouldFlush: boolean; batch: T[] | null } {",
      "    return { shouldFlush: false, batch: null };",
      "  }",
      "  flush(): T[] {",
      "    return [];",
      "  }",
      "}"
    ),
    eHint: "Track currentBatch array and firstTimestamp. When batch reaches maxBatchSize or elapsed >= maxLingerMs, call flush and return { shouldFlush: true, batch }.",
    eTest: lines(
      "if (typeof MicroBatchAccumulator !== 'function') throw new Error('MicroBatchAccumulator not found');",
      "const acc = new MicroBatchAccumulator(3, 50);",
      "const r1 = acc.add('m1', 100);",
      "if (r1.shouldFlush || r1.batch !== null) throw new Error('r1 should not flush');",
      "const r2 = acc.add('m2', 120);",
      "if (r2.shouldFlush) throw new Error('r2 should not flush');",
      "const r3 = acc.add('m3', 130);",
      "if (!r3.shouldFlush || !r3.batch || r3.batch.length !== 3) throw new Error('r3 should flush on size');",
      "const r4 = acc.add('m4', 200);",
      "const r5 = acc.add('m5', 260);",
      "if (!r5.shouldFlush || !r5.batch || r5.batch.length !== 2) throw new Error('r5 should flush on linger');"
    ),
    aTitle: "Adaptive Batch Size Tuner based on Queue Saturation",
    aDesc: "Write `tuneBatchSize(currentBatchSize: number, queueDepth: number, minBatch: number = 10, maxBatch: number = 1000): number`. If queueDepth > 500, increase batch size by 20% (Math.ceil(size * 1.2)). If queueDepth < 50, decrease by 20% (Math.floor(size * 0.8)). Otherwise keep constant. Clamp between minBatch and maxBatch.",
    aLanguage: "typescript",
    aStarter: lines(
      "function tuneBatchSize(currentBatchSize: number, queueDepth: number, minBatch: number = 10, maxBatch: number = 1000): number {",
      "  // Adaptive batch size tuning",
      "  return currentBatchSize;",
      "}"
    ),
    aHint: "Check queueDepth: > 500 => ceil(*1.2), < 50 => floor(*0.8). Clamp with min/max.",
    aTest: lines(
      "if (typeof tuneBatchSize !== 'function') throw new Error('tuneBatchSize not found');",
      "if (tuneBatchSize(100, 600, 10, 1000) !== 120) throw new Error('Increase failed');",
      "if (tuneBatchSize(100, 30, 10, 1000) !== 80) throw new Error('Decrease failed');",
      "if (tuneBatchSize(100, 200, 10, 1000) !== 100) throw new Error('Neutral failed');",
      "if (tuneBatchSize(950, 1000, 10, 1000) !== 1000) throw new Error('Max clamp failed');",
      "if (tuneBatchSize(12, 10, 10, 1000) !== 10) throw new Error('Min clamp failed');"
    )
  },

  // ── DAY 13 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[12],
    eTitle: "Evaluate Stream Batch Compression Ratio and Throughput",
    eDesc: "Write `evaluateStreamCompression(rawSizeBytes: number, compressedSizeBytes: number, durationMs: number): { ratio: number; spaceSavingsPercent: number; throughputMBps: number }` where ratio = raw / compressed (rounded to 2 decimals), spaceSavings = (1 - compressed / raw) * 100 (rounded to 2 decimals), and throughput = (rawSizeBytes / (1024 * 1024)) / (durationMs / 1000) (rounded to 2 decimals). If raw <= 0, return defaults.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateStreamCompression(rawSizeBytes: number, compressedSizeBytes: number, durationMs: number): { ratio: number; spaceSavingsPercent: number; throughputMBps: number } {",
      "  // Evaluate compression metrics",
      "  return { ratio: 1, spaceSavingsPercent: 0, throughputMBps: 0 };",
      "}"
    ),
    eHint: "Check for non-positive sizes/duration. Compute ratio, spaceSavingsPercent, and throughput in MB/s.",
    eTest: lines(
      "if (typeof evaluateStreamCompression !== 'function') throw new Error('evaluateStreamCompression not found');",
      "const m1 = evaluateStreamCompression(1048576, 262144, 100);",
      "if (m1.ratio !== 4 || m1.spaceSavingsPercent !== 75 || m1.throughputMBps !== 10) throw new Error('Failed m1: ' + JSON.stringify(m1));",
      "const m2 = evaluateStreamCompression(0, 0, 10);",
      "if (m2.ratio !== 1 || m2.spaceSavingsPercent !== 0 || m2.throughputMBps !== 0) throw new Error('Failed zero case');"
    ),
    aTitle: "Select Compression Algorithm based on Workload Profile",
    aDesc: "Write `selectCompressionCodec(criteria: { target: 'max_throughput' | 'min_bandwidth' | 'balanced'; networkCostPerGb: number }): 'lz4' | 'snappy' | 'zstd' | 'gzip'` returning 'lz4' for max_throughput, 'zstd' for min_bandwidth, and for balanced: if networkCostPerGb > 0.05 return 'zstd' else 'snappy'.",
    aLanguage: "typescript",
    aStarter: lines(
      "function selectCompressionCodec(criteria: { target: 'max_throughput' | 'min_bandwidth' | 'balanced'; networkCostPerGb: number }): 'lz4' | 'snappy' | 'zstd' | 'gzip' {",
      "  // Select compression codec",
      "  return 'lz4';",
      "}"
    ),
    aHint: "Check criteria.target: 'max_throughput' -> 'lz4', 'min_bandwidth' -> 'zstd', balanced checks networkCostPerGb.",
    aTest: lines(
      "if (typeof selectCompressionCodec !== 'function') throw new Error('selectCompressionCodec not found');",
      "if (selectCompressionCodec({ target: 'max_throughput', networkCostPerGb: 0.1 }) !== 'lz4') throw new Error('Throughput failed');",
      "if (selectCompressionCodec({ target: 'min_bandwidth', networkCostPerGb: 0.01 }) !== 'zstd') throw new Error('Bandwidth failed');",
      "if (selectCompressionCodec({ target: 'balanced', networkCostPerGb: 0.08 }) !== 'zstd') throw new Error('Expensive balanced failed');",
      "if (selectCompressionCodec({ target: 'balanced', networkCostPerGb: 0.02 }) !== 'snappy') throw new Error('Cheap balanced failed');"
    )
  },

  // ── DAY 14 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[13],
    eTitle: "Apply Little's Law to Streaming Pipeline Queue Sizing",
    eDesc: "Write `applyStreamLittlesLaw(arrivalRateMsgPerSec: number, avgLatencyMs: number): { inFlightMessages: number; recommendedQueueCapacity: number }` where inFlight = arrivalRate * (avgLatencyMs / 1000) (rounded to 2 decimals), and recommendedQueue = Math.ceil(inFlight * 2).",
    eLanguage: "typescript",
    eStarter: lines(
      "function applyStreamLittlesLaw(arrivalRateMsgPerSec: number, avgLatencyMs: number): { inFlightMessages: number; recommendedQueueCapacity: number } {",
      "  // Apply Little's Law",
      "  return { inFlightMessages: 0, recommendedQueueCapacity: 0 };",
      "}"
    ),
    eHint: "inFlight = arrivalRate * (avgLatencyMs / 1000). Double it and ceil for recommended capacity.",
    eTest: lines(
      "if (typeof applyStreamLittlesLaw !== 'function') throw new Error('applyStreamLittlesLaw not found');",
      "const res1 = applyStreamLittlesLaw(10000, 25);",
      "if (res1.inFlightMessages !== 250 || res1.recommendedQueueCapacity !== 500) throw new Error('Failed res1: ' + JSON.stringify(res1));",
      "const res2 = applyStreamLittlesLaw(500, 100);",
      "if (res2.inFlightMessages !== 50 || res2.recommendedQueueCapacity !== 100) throw new Error('Failed res2: ' + JSON.stringify(res2));"
    ),
    aTitle: "Calculate Network Bandwidth-Delay Product (BDP)",
    aDesc: "Write `calculateStreamBdp(bandwidthGbps: number, roundTripTimeMs: number): { bdpBytes: number; optimalBufferKilobytes: number }` where bdpBytes = Math.round((bandwidthGbps * 1e9 / 8) * (roundTripTimeMs / 1000)), and optimalBufferKb = Math.ceil(bdpBytes / 1024).",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateStreamBdp(bandwidthGbps: number, roundTripTimeMs: number): { bdpBytes: number; optimalBufferKilobytes: number } {",
      "  // Calculate BDP",
      "  return { bdpBytes: 0, optimalBufferKilobytes: 0 };",
      "}"
    ),
    aHint: "Convert Gbps to bytes/sec ((Gbps * 1e9) / 8), multiply by RTT in seconds, and divide by 1024 for KB.",
    aTest: lines(
      "if (typeof calculateStreamBdp !== 'function') throw new Error('calculateStreamBdp not found');",
      "const bdp1 = calculateStreamBdp(10, 20);",
      "if (bdp1.bdpBytes !== 25000000 || bdp1.optimalBufferKilobytes !== 24415) throw new Error('Failed bdp1: ' + JSON.stringify(bdp1));",
      "const bdp2 = calculateStreamBdp(1, 50);",
      "if (bdp2.bdpBytes !== 6250000 || bdp2.optimalBufferKilobytes !== 6104) throw new Error('Failed bdp2: ' + JSON.stringify(bdp2));"
    )
  },

  // ── DAY 15 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[14],
    eTitle: "High-Throughput Ingest Pipeline with Backpressure Throttler",
    eDesc: "Implement `class IngestPipelineEngine` with `constructor(capacity: number, batchLimit: number)`, `ingest(record: { id: string; payload: string }): { accepted: boolean; queueDepth: number; throttled: boolean }`, `drainBatch(): { id: string; payload: string }[]`, and `isThrottled(): boolean`. Throttling activates when queueDepth >= capacity * 0.75, and clears when queueDepth < capacity * 0.25.",
    eLanguage: "typescript",
    eStarter: lines(
      "class IngestPipelineEngine {",
      "  constructor(public capacity: number, public batchLimit: number) {} ",
      "  ingest(record: { id: string; payload: string }): { accepted: boolean; queueDepth: number; throttled: boolean } {",
      "    return { accepted: false, queueDepth: 0, throttled: false };",
      "  }",
      "  drainBatch(): { id: string; payload: string }[] {",
      "    return [];",
      "  }",
      "  isThrottled(): boolean {",
      "    return false;",
      "  }",
      "}"
    ),
    eHint: "Track queue array. Set throttled = true if length >= capacity * 0.75. On drainBatch, remove batchLimit items and set throttled = false if length < capacity * 0.25.",
    eTest: lines(
      "if (typeof IngestPipelineEngine !== 'function') throw new Error('IngestPipelineEngine not found');",
      "const engine = new IngestPipelineEngine(4, 2);",
      "const in1 = engine.ingest({ id: '1', payload: 'a' });",
      "const in2 = engine.ingest({ id: '2', payload: 'b' });",
      "const in3 = engine.ingest({ id: '3', payload: 'c' });",
      "if (!in1.accepted || in1.throttled) throw new Error('in1 failed');",
      "if (!in3.accepted || !in3.throttled || !engine.isThrottled()) throw new Error('in3 throttle trigger failed');",
      "const batch1 = engine.drainBatch();",
      "if (batch1.length !== 2 || batch1[0].id !== '1' || batch1[1].id !== '2') throw new Error('drain batch 1 failed');",
      "const batch2 = engine.drainBatch();",
      "if (engine.isThrottled()) throw new Error('throttle should be cleared after full drain');"
    ),
    aTitle: "Pipeline Ingest Telemetry & Performance Profiler",
    aDesc: "Write `computePipelineTelemetry(totalEvents: number, durationSec: number, latenciesMs: number[]): { throughputEventsPerSec: number; p50LatencyMs: number; p95LatencyMs: number; p99LatencyMs: number }` with sorted percentile index Math.min(len - 1, Math.max(0, Math.ceil((p / 100) * len) - 1)). Empty latencies returns 0.",
    aLanguage: "typescript",
    aStarter: lines(
      "function computePipelineTelemetry(totalEvents: number, durationSec: number, latenciesMs: number[]): { throughputEventsPerSec: number; p50LatencyMs: number; p95LatencyMs: number; p99LatencyMs: number } {",
      "  // Compute pipeline telemetry",
      "  return { throughputEventsPerSec: 0, p50LatencyMs: 0, p95LatencyMs: 0, p99LatencyMs: 0 };",
      "}"
    ),
    aHint: "Sort latencies. Compute throughput as totalEvents / durationSec. Index for p = ceil((p/100)*len) - 1.",
    aTest: lines(
      "if (typeof computePipelineTelemetry !== 'function') throw new Error('computePipelineTelemetry not found');",
      "const latencies = Array.from({ length: 100 }, (_, i) => i + 1);",
      "const t1 = computePipelineTelemetry(50000, 10, latencies);",
      "if (t1.throughputEventsPerSec !== 5000) throw new Error('Throughput failed: ' + t1.throughputEventsPerSec);",
      "if (t1.p50LatencyMs !== 50 || t1.p95LatencyMs !== 95 || t1.p99LatencyMs !== 99) throw new Error('Percentiles failed: ' + JSON.stringify(t1));",
      "const t2 = computePipelineTelemetry(0, 10, []);",
      "if (t2.throughputEventsPerSec !== 0 || t2.p95LatencyMs !== 0) throw new Error('Empty latencies failed');"
    )
  }

];

export const STREAM_WEB_30_DAYS_QUESTS = STREAM_WEB_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('stream-web', i + 1, cfg)
);
