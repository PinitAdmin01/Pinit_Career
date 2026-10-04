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
,

  // ── DAY 16 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[15],
    eTitle: "Stateless Stream Operators: Map, Filter, FlatMap",
    eDesc: "Write `transformStream<T, U>(stream: T[], mapper?: (item: T) => U, predicate?: (item: T) => boolean, flatMapper?: (item: T) => U[]): U[]` applying filter (if provided), then flatMapper (if provided) or mapper (if provided). If neither mapper nor flatMapper is provided, return filtered items as U[].",
    eLanguage: "typescript",
    eStarter: lines(
      "function transformStream<T, U>(stream: T[], mapper?: (item: T) => U, predicate?: (item: T) => boolean, flatMapper?: (item: T) => U[]): U[] {",
      "  // Stateless stream transformation",
      "  return [];",
      "}"
    ),
    eHint: "Filter array by predicate if present. If flatMapper given, return flatMap. Else if mapper given, return map. Else return filtered as U[].",
    eTest: lines(
      "if (typeof transformStream !== 'function') throw new Error('transformStream not found');",
      "const nums = [1, 2, 3, 4, 5];",
      "const res1 = transformStream(nums, (x) => x * 10, (x) => x % 2 === 1);",
      "if (JSON.stringify(res1) !== JSON.stringify([10, 30, 50])) throw new Error('res1 fail: ' + JSON.stringify(res1));",
      "const res2 = transformStream(['a', 'b'], undefined, undefined, (s) => [s, s.toUpperCase()]);",
      "if (JSON.stringify(res2) !== JSON.stringify(['a', 'A', 'b', 'B'])) throw new Error('res2 fail: ' + JSON.stringify(res2));",
      "const res3 = transformStream([10, 20]);",
      "if (JSON.stringify(res3) !== JSON.stringify([10, 20])) throw new Error('res3 fail: ' + JSON.stringify(res3));"
    ),
    aTitle: "Topic Stream Branching Router",
    aDesc: "Write `branchStream<T>(events: T[], predicates: ((item: T) => boolean)[]): T[][]` distributing events into branches. Each event goes to the FIRST branch whose predicate returns true. If no predicate matches, it goes to a final default branch at the end of the returned array.",
    aLanguage: "typescript",
    aStarter: lines(
      "function branchStream<T>(events: T[], predicates: ((item: T) => boolean)[]): T[][] {",
      "  // Branch stream into partitioned sub-streams",
      "  return [];",
      "}"
    ),
    aHint: "Create predicates.length + 1 branch arrays. For each event, push to first matching predicate index, or default last index.",
    aTest: lines(
      "if (typeof branchStream !== 'function') throw new Error('branchStream not found');",
      "const evts = [1, 2, 3, 4, 5, 6, 7];",
      "const b1 = branchStream(evts, [(x) => x % 2 === 0, (x) => x < 5]);",
      "if (b1.length !== 3) throw new Error('Branch count mismatch: ' + b1.length);",
      "if (JSON.stringify(b1[0]) !== JSON.stringify([2, 4, 6])) throw new Error('Branch 0 fail: ' + JSON.stringify(b1[0]));",
      "if (JSON.stringify(b1[1]) !== JSON.stringify([1, 3])) throw new Error('Branch 1 fail: ' + JSON.stringify(b1[1]));",
      "if (JSON.stringify(b1[2]) !== JSON.stringify([5, 7])) throw new Error('Default branch fail: ' + JSON.stringify(b1[2]));",
      "const b2 = branchStream([], []);",
      "if (b2.length !== 1 || b2[0].length !== 0) throw new Error('Empty branch fail');"
    )
  },

  // ── DAY 17 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[16],
    eTitle: "Fixed-Duration Tumbling Window Aggregator",
    eDesc: "Write `aggregateTumblingWindows(events: { timestamp: number; value: number }[], windowDurationMs: number): { windowStart: number; windowEnd: number; count: number; sum: number }[]` where windowStart = timestamp - (timestamp % windowDurationMs), and windowEnd = windowStart + windowDurationMs. Output sorted by windowStart ascending.",
    eLanguage: "typescript",
    eStarter: lines(
      "function aggregateTumblingWindows(events: { timestamp: number; value: number }[], windowDurationMs: number): { windowStart: number; windowEnd: number; count: number; sum: number }[] {",
      "  // Aggregate into tumbling windows",
      "  return [];",
      "}"
    ),
    eHint: "Bucket events into windowStart = t - (t % duration). Accumulate count and sum in a Map, then sort by windowStart.",
    eTest: lines(
      "if (typeof aggregateTumblingWindows !== 'function') throw new Error('aggregateTumblingWindows not found');",
      "const evts1 = [",
      "  { timestamp: 1050, value: 10 },",
      "  { timestamp: 1400, value: 20 },",
      "  { timestamp: 2100, value: 5 },",
      "  { timestamp: 2999, value: 15 },",
      "  { timestamp: 3000, value: 100 }",
      "];",
      "const w1 = aggregateTumblingWindows(evts1, 1000);",
      "if (w1.length !== 3) throw new Error('Window count fail: ' + w1.length);",
      "if (w1[0].windowStart !== 1000 || w1[0].windowEnd !== 2000 || w1[0].count !== 2 || w1[0].sum !== 30) throw new Error('Window 0 fail: ' + JSON.stringify(w1[0]));",
      "if (w1[1].windowStart !== 2000 || w1[1].windowEnd !== 3000 || w1[1].count !== 2 || w1[1].sum !== 20) throw new Error('Window 1 fail: ' + JSON.stringify(w1[1]));",
      "if (w1[2].windowStart !== 3000 || w1[2].windowEnd !== 4000 || w1[2].count !== 1 || w1[2].sum !== 100) throw new Error('Window 2 fail: ' + JSON.stringify(w1[2]));",
      "const w2 = aggregateTumblingWindows([], 1000);",
      "if (w2.length !== 0) throw new Error('Empty fail');"
    ),
    aTitle: "Keyed Tumbling Window Count & Average",
    aDesc: "Write `aggregateKeyedTumblingWindows(events: { key: string; timestamp: number; value: number }[], windowDurationMs: number): { key: string; windowStart: number; count: number; avg: number }[]` with avg rounded to 2 decimals, sorted primarily by windowStart asc and secondarily by key asc.",
    aLanguage: "typescript",
    aStarter: lines(
      "function aggregateKeyedTumblingWindows(events: { key: string; timestamp: number; value: number }[], windowDurationMs: number): { key: string; windowStart: number; count: number; avg: number }[] {",
      "  // Keyed tumbling window aggregation",
      "  return [];",
      "}"
    ),
    aHint: "Map key and windowStart to count and sum. Round avg = sum / count to 2 decimals.",
    aTest: lines(
      "if (typeof aggregateKeyedTumblingWindows !== 'function') throw new Error('aggregateKeyedTumblingWindows not found');",
      "const evts = [",
      "  { key: 'btc', timestamp: 100, value: 50 },",
      "  { key: 'btc', timestamp: 150, value: 60 },",
      "  { key: 'eth', timestamp: 120, value: 10 },",
      "  { key: 'btc', timestamp: 220, value: 70 }",
      "];",
      "const r1 = aggregateKeyedTumblingWindows(evts, 100);",
      "if (r1.length !== 3) throw new Error('Result count fail: ' + r1.length);",
      "if (r1[0].key !== 'btc' || r1[0].windowStart !== 100 || r1[0].count !== 2 || r1[0].avg !== 55) throw new Error('btc window 100 fail: ' + JSON.stringify(r1[0]));",
      "if (r1[1].key !== 'eth' || r1[1].windowStart !== 100 || r1[1].count !== 1 || r1[1].avg !== 10) throw new Error('eth window 100 fail: ' + JSON.stringify(r1[1]));",
      "if (r1[2].key !== 'btc' || r1[2].windowStart !== 200 || r1[2].count !== 1 || r1[2].avg !== 70) throw new Error('btc window 200 fail: ' + JSON.stringify(r1[2]));",
      "const r2 = aggregateKeyedTumblingWindows([], 100);",
      "if (r2.length !== 0) throw new Error('Empty fail');"
    )
  },

  // ── DAY 18 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[17],
    eTitle: "Sliding Hopping Window Multi-Bucket Membership",
    eDesc: "Write `getSlidingWindowBuckets(eventTimestamp: number, windowDurationMs: number, slideIntervalMs: number): { windowStart: number; windowEnd: number }[]` returning all overlapping windows that contain eventTimestamp (windowStart <= eventTimestamp < windowEnd), sorted by windowStart ascending.",
    eLanguage: "typescript",
    eStarter: lines(
      "function getSlidingWindowBuckets(eventTimestamp: number, windowDurationMs: number, slideIntervalMs: number): { windowStart: number; windowEnd: number }[] {",
      "  // Compute sliding window buckets",
      "  return [];",
      "}"
    ),
    eHint: "Loop window start times in steps of slideIntervalMs from Math.max(0, eventTimestamp - windowDurationMs + 1) up to eventTimestamp.",
    eTest: lines(
      "if (typeof getSlidingWindowBuckets !== 'function') throw new Error('getSlidingWindowBuckets not found');",
      "const b1 = getSlidingWindowBuckets(15, 10, 5);",
      "if (b1.length !== 2) throw new Error('b1 length mismatch: ' + b1.length);",
      "if (b1[0].windowStart !== 10 || b1[0].windowEnd !== 20) throw new Error('b1[0] fail: ' + JSON.stringify(b1[0]));",
      "if (b1[1].windowStart !== 15 || b1[1].windowEnd !== 25) throw new Error('b1[1] fail: ' + JSON.stringify(b1[1]));",
      "const b2 = getSlidingWindowBuckets(25, 30, 10);",
      "if (b2.length !== 3) throw new Error('b2 length mismatch: ' + b2.length);",
      "if (b2[0].windowStart !== 0 || b2[2].windowStart !== 20) throw new Error('b2 fail: ' + JSON.stringify(b2));"
    ),
    aTitle: "Sliding Window Rolling Sum and Max",
    aDesc: "Write `computeSlidingWindowAggregates(events: { timestamp: number; value: number }[], windowDurationMs: number, slideIntervalMs: number): { windowStart: number; count: number; sum: number; max: number }[]` sorted by windowStart ascending.",
    aLanguage: "typescript",
    aStarter: lines(
      "function computeSlidingWindowAggregates(events: { timestamp: number; value: number }[], windowDurationMs: number, slideIntervalMs: number): { windowStart: number; count: number; sum: number; max: number }[] {",
      "  // Sliding window rolling aggregates",
      "  return [];",
      "}"
    ),
    aHint: "Distribute each event into all its sliding window starts. Track count, sum, and max per window start.",
    aTest: lines(
      "if (typeof computeSlidingWindowAggregates !== 'function') throw new Error('computeSlidingWindowAggregates not found');",
      "const evts = [",
      "  { timestamp: 5, value: 10 },",
      "  { timestamp: 12, value: 30 },",
      "  { timestamp: 18, value: 20 }",
      "];",
      "const res1 = computeSlidingWindowAggregates(evts, 10, 5);",
      "if (res1.length !== 4) throw new Error('res1 length mismatch: ' + res1.length);",
      "if (res1[0].windowStart !== 0 || res1[0].sum !== 10) throw new Error('res1[0] fail: ' + JSON.stringify(res1[0]));",
      "if (res1[1].windowStart !== 5 || res1[1].sum !== 40 || res1[1].max !== 30) throw new Error('res1[1] fail: ' + JSON.stringify(res1[1]));",
      "if (res1[2].windowStart !== 10 || res1[2].sum !== 50) throw new Error('res1[2] fail: ' + JSON.stringify(res1[2]));",
      "const res2 = computeSlidingWindowAggregates([], 10, 5);",
      "if (res2.length !== 0) throw new Error('Empty fail');"
    )
  },

  // ── DAY 19 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[18],
    eTitle: "Session Window Grouping by Inactivity Gap Threshold",
    eDesc: "Write `groupIntoSessionWindows(timestamps: number[], inactivityGapMs: number): { sessionStart: number; sessionEnd: number; eventCount: number }[]` grouping sorted timestamps into sessions where consecutive events with gap <= inactivityGapMs belong to the same session.",
    eLanguage: "typescript",
    eStarter: lines(
      "function groupIntoSessionWindows(timestamps: number[], inactivityGapMs: number): { sessionStart: number; sessionEnd: number; eventCount: number }[] {",
      "  // Group into session windows",
      "  return [];",
      "}"
    ),
    eHint: "Sort timestamps. If next timestamp - currentEnd <= gapMs, extend currentEnd; otherwise emit session and start new.",
    eTest: lines(
      "if (typeof groupIntoSessionWindows !== 'function') throw new Error('groupIntoSessionWindows not found');",
      "const ts1 = [100, 150, 200, 500, 520, 900];",
      "const s1 = groupIntoSessionWindows(ts1, 100);",
      "if (s1.length !== 3) throw new Error('Session count mismatch: ' + s1.length);",
      "if (s1[0].sessionStart !== 100 || s1[0].sessionEnd !== 200 || s1[0].eventCount !== 3) throw new Error('Session 1 fail: ' + JSON.stringify(s1[0]));",
      "if (s1[1].sessionStart !== 500 || s1[1].sessionEnd !== 520 || s1[1].eventCount !== 2) throw new Error('Session 2 fail: ' + JSON.stringify(s1[1]));",
      "if (s1[2].sessionStart !== 900 || s1[2].sessionEnd !== 900 || s1[2].eventCount !== 1) throw new Error('Session 3 fail: ' + JSON.stringify(s1[2]));",
      "const s2 = groupIntoSessionWindows([], 100);",
      "if (s2.length !== 0) throw new Error('Empty fail');"
    ),
    aTitle: "Merge Overlapping & Bridging Session Windows",
    aDesc: "Write `mergeSessionWindows(sessions: { start: number; end: number }[], gapMs: number): { start: number; end: number }[]` merging sessions that overlap or are within gapMs of each other, sorted by start ascending.",
    aLanguage: "typescript",
    aStarter: lines(
      "function mergeSessionWindows(sessions: { start: number; end: number }[], gapMs: number): { start: number; end: number }[] {",
      "  // Merge overlapping and bridging sessions",
      "  return [];",
      "}"
    ),
    aHint: "Sort sessions by start. Merge into previous session if cur.start <= prev.end + gapMs.",
    aTest: lines(
      "if (typeof mergeSessionWindows !== 'function') throw new Error('mergeSessionWindows not found');",
      "const input1 = [",
      "  { start: 10, end: 30 },",
      "  { start: 40, end: 60 },",
      "  { start: 100, end: 120 }",
      "];",
      "const m1 = mergeSessionWindows(input1, 15);",
      "if (m1.length !== 2) throw new Error('m1 length fail: ' + m1.length);",
      "if (m1[0].start !== 10 || m1[0].end !== 60) throw new Error('m1[0] fail: ' + JSON.stringify(m1[0]));",
      "if (m1[1].start !== 100 || m1[1].end !== 120) throw new Error('m1[1] fail: ' + JSON.stringify(m1[1]));",
      "const m2 = mergeSessionWindows([], 10);",
      "if (m2.length !== 0) throw new Error('Empty fail');"
    )
  },

  // ── DAY 20 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[19],
    eTitle: "Watermark Tracker and Late Event Detector",
    eDesc: "Implement `class WatermarkManager` with `constructor(maxLatenessMs: number)`, `onEvent(eventTimeMs: number): { watermark: number; isLate: boolean }` (updates watermark to max(currentWatermark, eventTimeMs - maxLatenessMs); an event is late if eventTimeMs < currentWatermark), and `getWatermark(): number`.",
    eLanguage: "typescript",
    eStarter: lines(
      "class WatermarkManager {",
      "  constructor(public maxLatenessMs: number) {}",
      "  onEvent(eventTimeMs: number): { watermark: number; isLate: boolean } {",
      "    return { watermark: 0, isLate: false };",
      "  }",
      "  getWatermark(): number {",
      "    return 0;",
      "  }",
      "}"
    ),
    eHint: "An event is late if eventTimeMs < currentWatermark. If not late, update watermark = Math.max(watermark, eventTimeMs - maxLatenessMs).",
    eTest: lines(
      "if (typeof WatermarkManager !== 'function') throw new Error('WatermarkManager not found');",
      "const wm = new WatermarkManager(100);",
      "const r1 = wm.onEvent(1000);",
      "if (r1.watermark !== 900 || r1.isLate) throw new Error('r1 fail: ' + JSON.stringify(r1));",
      "const r2 = wm.onEvent(1200);",
      "if (r2.watermark !== 1100 || r2.isLate) throw new Error('r2 fail: ' + JSON.stringify(r2));",
      "const r3 = wm.onEvent(1050);",
      "if (r3.watermark !== 1100 || !r3.isLate) throw new Error('r3 late fail: ' + JSON.stringify(r3));",
      "if (wm.getWatermark() !== 1100) throw new Error('getWatermark fail');"
    ),
    aTitle: "Window Closer Triggered by Watermark Progression",
    aDesc: "Write `evaluateWindowEmissions(watermark: number, openWindows: { windowId: string; windowEnd: number }[]): { closedWindows: string[]; remainingWindows: { windowId: string; windowEnd: number }[] }` where a window closes when windowEnd <= watermark.",
    aLanguage: "typescript",
    aStarter: lines(
      "function evaluateWindowEmissions(watermark: number, openWindows: { windowId: string; windowEnd: number }[]): { closedWindows: string[]; remainingWindows: { windowId: string; windowEnd: number }[] } {",
      "  // Evaluate window emissions on watermark",
      "  return { closedWindows: [], remainingWindows: [] };",
      "}"
    ),
    aHint: "Filter into closedWindows if windowEnd <= watermark, else remainingWindows.",
    aTest: lines(
      "if (typeof evaluateWindowEmissions !== 'function') throw new Error('evaluateWindowEmissions not found');",
      "const wins = [",
      "  { windowId: 'w1', windowEnd: 100 },",
      "  { windowId: 'w2', windowEnd: 200 },",
      "  { windowId: 'w3', windowEnd: 300 }",
      "];",
      "const r1 = evaluateWindowEmissions(200, wins);",
      "if (JSON.stringify(r1.closedWindows) !== JSON.stringify(['w1', 'w2'])) throw new Error('Closed fail: ' + JSON.stringify(r1.closedWindows));",
      "if (r1.remainingWindows.length !== 1 || r1.remainingWindows[0].windowId !== 'w3') throw new Error('Remaining fail: ' + JSON.stringify(r1.remainingWindows));",
      "const r2 = evaluateWindowEmissions(50, wins);",
      "if (r2.closedWindows.length !== 0 || r2.remainingWindows.length !== 3) throw new Error('None closed fail');"
    )
  },

  // ── DAY 21 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[20],
    eTitle: "In-Memory Key-Value State Store with Changelog Stream Producer",
    eDesc: "Implement `class ChangelogBackedStateStore` with `put(key: string, value: string): { offset: number; key: string; value: string }`, `get(key: string): string | null`, `delete(key: string): { offset: number; key: string; value: null }`, and `getChangelog(): { offset: number; key: string; value: string | null }[]` (where deletion appends a tombstone with value = null).",
    eLanguage: "typescript",
    eStarter: lines(
      "class ChangelogBackedStateStore {",
      "  put(key: string, value: string): { offset: number; key: string; value: string } {",
      "    return { offset: 0, key, value };",
      "  }",
      "  get(key: string): string | null {",
      "    return null;",
      "  }",
      "  delete(key: string): { offset: number; key: string; value: null } {",
      "    return { offset: 0, key, value: null };",
      "  }",
      "  getChangelog(): { offset: number; key: string; value: string | null }[] {",
      "    return [];",
      "  }",
      "}"
    ),
    eHint: "Store key-value pairs in a Map and log sequential mutations into an array with offset = length.",
    eTest: lines(
      "if (typeof ChangelogBackedStateStore !== 'function') throw new Error('ChangelogBackedStateStore not found');",
      "const store = new ChangelogBackedStateStore();",
      "const p1 = store.put('user-1', 'Alice');",
      "const p2 = store.put('user-2', 'Bob');",
      "if (p1.offset !== 0 || p2.offset !== 1) throw new Error('Put offsets fail');",
      "if (store.get('user-1') !== 'Alice') throw new Error('Get user-1 fail');",
      "const d1 = store.delete('user-1');",
      "if (d1.offset !== 2 || d1.value !== null) throw new Error('Delete fail');",
      "if (store.get('user-1') !== null) throw new Error('Tombstoned key should be null');",
      "const cl = store.getChangelog();",
      "if (cl.length !== 3 || cl[2].value !== null) throw new Error('Changelog length fail');"
    ),
    aTitle: "Replay Changelog to Rebuild Local State Store",
    aDesc: "Write `rebuildStateFromChangelog(changelog: { offset: number; key: string; value: string | null }[]): Record<string, string>` applying put and tombstone deletion (null value) in offset order.",
    aLanguage: "typescript",
    aStarter: lines(
      "function rebuildStateFromChangelog(changelog: { offset: number; key: string; value: string | null }[]): Record<string, string> {",
      "  // Rebuild state from changelog",
      "  return {};",
      "}"
    ),
    aHint: "Iterate through changelog. If value === null, delete key; else assign key to value.",
    aTest: lines(
      "if (typeof rebuildStateFromChangelog !== 'function') throw new Error('rebuildStateFromChangelog not found');",
      "const log1 = [",
      "  { offset: 0, key: 'k1', value: 'v1' },",
      "  { offset: 1, key: 'k2', value: 'v2' },",
      "  { offset: 2, key: 'k1', value: 'v1-updated' },",
      "  { offset: 3, key: 'k2', value: null }",
      "];",
      "const s1 = rebuildStateFromChangelog(log1);",
      "if (s1.k1 !== 'v1-updated' || 'k2' in s1) throw new Error('s1 fail: ' + JSON.stringify(s1));",
      "const s2 = rebuildStateFromChangelog([]);",
      "if (Object.keys(s2).length !== 0) throw new Error('Empty log fail');"
    )
  },

  // ── DAY 22 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[21],
    eTitle: "Log Compactor: Retain Latest Key Values and Purge Obsolete Records",
    eDesc: "Write `compactEventLog(records: { offset: number; key: string; value: string | null }[]): { offset: number; key: string; value: string }[]` returning only the latest record for each key that is NOT tombstoned (value !== null), ordered by original offset ascending.",
    eLanguage: "typescript",
    eStarter: lines(
      "function compactEventLog(records: { offset: number; key: string; value: string | null }[]): { offset: number; key: string; value: string }[] {",
      "  // Compact event log",
      "  return [];",
      "}"
    ),
    eHint: "Track latest record per key in a Map. Filter out tombstones and sort by offset ascending.",
    eTest: lines(
      "if (typeof compactEventLog !== 'function') throw new Error('compactEventLog not found');",
      "const recs1 = [",
      "  { offset: 0, key: 'a', value: '1' },",
      "  { offset: 1, key: 'b', value: '2' },",
      "  { offset: 2, key: 'a', value: '3' },",
      "  { offset: 3, key: 'b', value: null },",
      "  { offset: 4, key: 'c', value: '5' }",
      "];",
      "const c1 = compactEventLog(recs1);",
      "if (c1.length !== 2) throw new Error('c1 length fail: ' + c1.length);",
      "if (c1[0].key !== 'a' || c1[0].offset !== 2 || c1[0].value !== '3') throw new Error('c1[0] fail: ' + JSON.stringify(c1[0]));",
      "if (c1[1].key !== 'c' || c1[1].offset !== 4 || c1[1].value !== '5') throw new Error('c1[1] fail: ' + JSON.stringify(c1[1]));",
      "const c2 = compactEventLog([]);",
      "if (c2.length !== 0) throw new Error('Empty fail');"
    ),
    aTitle: "Stream-to-Table Reducer (KTable Materialization)",
    aDesc: "Write `materializeKTable(stream: { key: string; delta: number }[]): Record<string, number>` computing the running sum per key and omitting keys whose accumulated delta is 0.",
    aLanguage: "typescript",
    aStarter: lines(
      "function materializeKTable(stream: { key: string; delta: number }[]): Record<string, number> {",
      "  // Materialize KTable",
      "  return {};",
      "}"
    ),
    aHint: "Accumulate delta into table[key]. If balance reaches 0, delete key.",
    aTest: lines(
      "if (typeof materializeKTable !== 'function') throw new Error('materializeKTable not found');",
      "const str1 = [",
      "  { key: 'acc-1', delta: 100 },",
      "  { key: 'acc-2', delta: 50 },",
      "  { key: 'acc-1', delta: -40 },",
      "  { key: 'acc-2', delta: -50 }",
      "];",
      "const t1 = materializeKTable(str1);",
      "if (t1['acc-1'] !== 60 || 'acc-2' in t1) throw new Error('t1 fail: ' + JSON.stringify(t1));",
      "const t2 = materializeKTable([]);",
      "if (Object.keys(t2).length !== 0) throw new Error('Empty fail');"
    )
  },

  // ── DAY 23 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[22],
    eTitle: "Stream-Table Real-Time Event Enrichment Joiner",
    eDesc: "Write `joinStreamTable<E extends { id: string; foreignKey: string }, T>(stream: E[], table: Record<string, T>): (E & { enrichment: T | null })[]` enriching each stream record with the corresponding record in table by foreignKey.",
    eLanguage: "typescript",
    eStarter: lines(
      "function joinStreamTable<E extends { id: string; foreignKey: string }, T>(stream: E[], table: Record<string, T>): (E & { enrichment: T | null })[] {",
      "  // Join stream with table",
      "  return [];",
      "}"
    ),
    eHint: "Map each record in stream to a new object with enrichment: table[record.foreignKey] ?? null.",
    eTest: lines(
      "if (typeof joinStreamTable !== 'function') throw new Error('joinStreamTable not found');",
      "const orders = [",
      "  { id: 'o1', foreignKey: 'u1', amount: 50 },",
      "  { id: 'o2', foreignKey: 'u2', amount: 99 },",
      "  { id: 'o3', foreignKey: 'u3', amount: 15 }",
      "];",
      "const users = {",
      "  u1: { name: 'Alice', tier: 'gold' },",
      "  u2: { name: 'Bob', tier: 'silver' }",
      "};",
      "const j1 = joinStreamTable(orders, users);",
      "if (j1.length !== 3) throw new Error('Join length fail');",
      "if (!j1[0].enrichment || j1[0].enrichment.name !== 'Alice') throw new Error('j1[0] fail: ' + JSON.stringify(j1[0]));",
      "if (!j1[1].enrichment || j1[1].enrichment.tier !== 'silver') throw new Error('j1[1] fail: ' + JSON.stringify(j1[1]));",
      "if (j1[2].enrichment !== null) throw new Error('Missing lookup should be null: ' + JSON.stringify(j1[2]));",
      "const j2 = joinStreamTable([], {});",
      "if (j2.length !== 0) throw new Error('Empty join fail');"
    ),
    aTitle: "Dynamic Temporal Table Lookup Join",
    aDesc: "Write `joinTemporalTable(stream: { eventId: string; entityId: string; timestamp: number }[], dimensionVersions: { entityId: string; validFrom: number; validTo: number; status: string }[]): { eventId: string; status: string | null }[]` looking up the status where validFrom <= event.timestamp < validTo.",
    aLanguage: "typescript",
    aStarter: lines(
      "function joinTemporalTable(stream: { eventId: string; entityId: string; timestamp: number }[], dimensionVersions: { entityId: string; validFrom: number; validTo: number; status: string }[]): { eventId: string; status: string | null }[] {",
      "  // Join temporal dimension table",
      "  return [];",
      "}"
    ),
    aHint: "For each event, find dimension record matching entityId and validFrom <= timestamp < validTo.",
    aTest: lines(
      "if (typeof joinTemporalTable !== 'function') throw new Error('joinTemporalTable not found');",
      "const events = [",
      "  { eventId: 'e1', entityId: 'acc-1', timestamp: 150 },",
      "  { eventId: 'e2', entityId: 'acc-1', timestamp: 350 },",
      "  { eventId: 'e3', entityId: 'acc-2', timestamp: 200 }",
      "];",
      "const dims = [",
      "  { entityId: 'acc-1', validFrom: 100, validTo: 300, status: 'STANDARD' },",
      "  { entityId: 'acc-1', validFrom: 300, validTo: 500, status: 'PREMIUM' }",
      "];",
      "const r1 = joinTemporalTable(events, dims);",
      "if (r1.length !== 3) throw new Error('r1 length fail: ' + r1.length);",
      "if (r1[0].status !== 'STANDARD') throw new Error('e1 fail: ' + JSON.stringify(r1[0]));",
      "if (r1[1].status !== 'PREMIUM') throw new Error('e2 fail: ' + JSON.stringify(r1[1]));",
      "if (r1[2].status !== null) throw new Error('e3 missing fail: ' + JSON.stringify(r1[2]));",
      "const r2 = joinTemporalTable([], []);",
      "if (r2.length !== 0) throw new Error('Empty temporal join fail');"
    )
  },

  // ── DAY 24 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[23],
    eTitle: "Windowed Stream-Stream Correlated Joiner",
    eDesc: "Write `joinStreamStream(leftStream: { key: string; timestamp: number; payload: string }[], rightStream: { key: string; timestamp: number; payload: string }[], windowMs: number): { key: string; leftPayload: string; rightPayload: string; timeDeltaMs: number }[]` joining records with matching key where Math.abs(left.timestamp - right.timestamp) <= windowMs.",
    eLanguage: "typescript",
    eStarter: lines(
      "function joinStreamStream(leftStream: { key: string; timestamp: number; payload: string }[], rightStream: { key: string; timestamp: number; payload: string }[], windowMs: number): { key: string; leftPayload: string; rightPayload: string; timeDeltaMs: number }[] {",
      "  // Correlated stream-stream join",
      "  return [];",
      "}"
    ),
    eHint: "Match records from left and right with identical key and abs(delta) <= windowMs.",
    eTest: lines(
      "if (typeof joinStreamStream !== 'function') throw new Error('joinStreamStream not found');",
      "const left = [",
      "  { key: 'k1', timestamp: 100, payload: 'L1' },",
      "  { key: 'k2', timestamp: 500, payload: 'L2' }",
      "];",
      "const right = [",
      "  { key: 'k1', timestamp: 120, payload: 'R1' },",
      "  { key: 'k1', timestamp: 300, payload: 'R2' },",
      "  { key: 'k2', timestamp: 510, payload: 'R3' }",
      "];",
      "const j1 = joinStreamStream(left, right, 50);",
      "if (j1.length !== 2) throw new Error('j1 length mismatch: ' + j1.length);",
      "if (j1[0].leftPayload !== 'L1' || j1[0].rightPayload !== 'R1' || j1[0].timeDeltaMs !== 20) throw new Error('j1[0] fail: ' + JSON.stringify(j1[0]));",
      "if (j1[1].leftPayload !== 'L2' || j1[1].rightPayload !== 'R3' || j1[1].timeDeltaMs !== 10) throw new Error('j1[1] fail: ' + JSON.stringify(j1[1]));",
      "const j2 = joinStreamStream([], [], 50);",
      "if (j2.length !== 0) throw new Error('Empty join fail');"
    ),
    aTitle: "Validate Co-Partitioning Invariant for Stream Joins",
    aDesc: "Write `validateCoPartitioning(topicA: { partitions: number; hashAlgorithm: string }, topicB: { partitions: number; hashAlgorithm: string }): { valid: boolean; reason: string }` ensuring equal partition counts and identical hash algorithms.",
    aLanguage: "typescript",
    aStarter: lines(
      "function validateCoPartitioning(topicA: { partitions: number; hashAlgorithm: string }, topicB: { partitions: number; hashAlgorithm: string }): { valid: boolean; reason: string } {",
      "  // Validate co-partitioning",
      "  return { valid: false, reason: '' };",
      "}"
    ),
    aHint: "Check topicA.partitions === topicB.partitions first, then hashAlgorithm equality.",
    aTest: lines(
      "if (typeof validateCoPartitioning !== 'function') throw new Error('validateCoPartitioning not found');",
      "const r1 = validateCoPartitioning({ partitions: 8, hashAlgorithm: 'murmur3' }, { partitions: 8, hashAlgorithm: 'murmur3' });",
      "if (!r1.valid || r1.reason !== 'CO_PARTITIONED') throw new Error('r1 valid fail: ' + JSON.stringify(r1));",
      "const r2 = validateCoPartitioning({ partitions: 4, hashAlgorithm: 'murmur3' }, { partitions: 8, hashAlgorithm: 'murmur3' });",
      "if (r2.valid || r2.reason !== 'PARTITION_COUNT_MISMATCH') throw new Error('r2 partition mismatch fail: ' + JSON.stringify(r2));",
      "const r3 = validateCoPartitioning({ partitions: 8, hashAlgorithm: 'djb2' }, { partitions: 8, hashAlgorithm: 'murmur3' });",
      "if (r3.valid || r3.reason !== 'HASH_ALGORITHM_MISMATCH') throw new Error('r3 hash mismatch fail: ' + JSON.stringify(r3));"
    )
  },

  // ── DAY 25 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[24],
    eTitle: "Fault-Tolerant Stream Processor with Periodic Checkpointing",
    eDesc: "Implement `class CheckpointedStreamProcessor` with `constructor(checkpointIntervalRecords: number)`, `process(record: { offset: number; key: string; value: number }): { committedCheckpoint: boolean; currentTotal: number }`, `restoreFromCheckpoint(snapshot: { lastOffset: number; state: Record<string, number> }): void`, and `getCheckpointSnapshot(): { lastOffset: number; state: Record<string, number> }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "class CheckpointedStreamProcessor {",
      "  constructor(public checkpointIntervalRecords: number) {}",
      "  process(record: { offset: number; key: string; value: number }): { committedCheckpoint: boolean; currentTotal: number } {",
      "    return { committedCheckpoint: false, currentTotal: 0 };",
      "  }",
      "  restoreFromCheckpoint(snapshot: { lastOffset: number; state: Record<string, number> }): void {}",
      "  getCheckpointSnapshot(): { lastOffset: number; state: Record<string, number> } {",
      "    return { lastOffset: -1, state: {} };",
      "  }",
      "}"
    ),
    eHint: "Track recordsSinceCheckpoint. When count reaches interval, snapshot state and lastOffset, and reset counter.",
    eTest: lines(
      "if (typeof CheckpointedStreamProcessor !== 'function') throw new Error('CheckpointedStreamProcessor not found');",
      "const proc = new CheckpointedStreamProcessor(2);",
      "const p1 = proc.process({ offset: 10, key: 'k1', value: 50 });",
      "if (p1.committedCheckpoint || p1.currentTotal !== 50) throw new Error('p1 fail: ' + JSON.stringify(p1));",
      "const p2 = proc.process({ offset: 11, key: 'k2', value: 30 });",
      "if (!p2.committedCheckpoint || p2.currentTotal !== 80) throw new Error('p2 checkpoint fail: ' + JSON.stringify(p2));",
      "const snap = proc.getCheckpointSnapshot();",
      "if (snap.lastOffset !== 11 || snap.state.k1 !== 50 || snap.state.k2 !== 30) throw new Error('Snapshot fail: ' + JSON.stringify(snap));",
      "const proc2 = new CheckpointedStreamProcessor(2);",
      "proc2.restoreFromCheckpoint(snap);",
      "const p3 = proc2.process({ offset: 12, key: 'k1', value: 20 });",
      "if (p3.currentTotal !== 100) throw new Error('Restored total fail: ' + p3.currentTotal);"
    ),
    aTitle: "State Store Recovery from Snapshot Plus Tail Changelog",
    aDesc: "Write `recoverProcessorState(snapshot: { lastOffset: number; state: Record<string, number> }, changelogTail: { offset: number; key: string; delta: number }[]): { finalOffset: number; state: Record<string, number> }` applying deltas from records where offset > snapshot.lastOffset.",
    aLanguage: "typescript",
    aStarter: lines(
      "function recoverProcessorState(snapshot: { lastOffset: number; state: Record<string, number> }, changelogTail: { offset: number; key: string; delta: number }[]): { finalOffset: number; state: Record<string, number> } {",
      "  // Recover processor state",
      "  return { finalOffset: 0, state: {} };",
      "}"
    ),
    aHint: "Clone snapshot state. For each tail record with offset > lastOffset, add delta and update finalOffset.",
    aTest: lines(
      "if (typeof recoverProcessorState !== 'function') throw new Error('recoverProcessorState not found');",
      "const snap = { lastOffset: 100, state: { a: 10, b: 20 } };",
      "const tail = [",
      "  { offset: 99, key: 'a', delta: 50 },",
      "  { offset: 100, key: 'b', delta: 50 },",
      "  { offset: 101, key: 'a', delta: 5 },",
      "  { offset: 102, key: 'c', delta: 30 }",
      "];",
      "const r1 = recoverProcessorState(snap, tail);",
      "if (r1.finalOffset !== 102 || r1.state.a !== 15 || r1.state.b !== 20 || r1.state.c !== 30) throw new Error('r1 fail: ' + JSON.stringify(r1));",
      "const r2 = recoverProcessorState(snap, []);",
      "if (r2.finalOffset !== 100 || r2.state.a !== 10) throw new Error('Empty tail fail');"
    )
  },

  // ── DAY 26 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[25],
    eTitle: "Schema Registry Compatibility Checker (BACKWARD & FORWARD)",
    eDesc: "Write `validateSchemaEvolution(prevFields: { name: string; type: string; hasDefault: boolean }[], nextFields: { name: string; type: string; hasDefault: boolean }[], mode: 'BACKWARD' | 'FORWARD'): { compatible: boolean; reason: string }` (BACKWARD: all new fields in next must have defaults, and existing fields must not change type; FORWARD: deleted fields in next must have had defaults in prev).",
    eLanguage: "typescript",
    eStarter: lines(
      "function validateSchemaEvolution(prevFields: { name: string; type: string; hasDefault: boolean }[], nextFields: { name: string; type: string; hasDefault: boolean }[], mode: 'BACKWARD' | 'FORWARD'): { compatible: boolean; reason: string } {",
      "  // Validate schema evolution compatibility",
      "  return { compatible: false, reason: '' };",
      "}"
    ),
    eHint: "Check type changes first. For BACKWARD check new fields have defaults; for FORWARD check deleted fields had defaults.",
    eTest: lines(
      "if (typeof validateSchemaEvolution !== 'function') throw new Error('validateSchemaEvolution not found');",
      "const prev = [",
      "  { name: 'id', type: 'string', hasDefault: false },",
      "  { name: 'age', type: 'int', hasDefault: true }",
      "];",
      "const nextValid = [",
      "  { name: 'id', type: 'string', hasDefault: false },",
      "  { name: 'age', type: 'int', hasDefault: true },",
      "  { name: 'email', type: 'string', hasDefault: true }",
      "];",
      "const nextInvalid = [",
      "  { name: 'id', type: 'string', hasDefault: false },",
      "  { name: 'email', type: 'string', hasDefault: false }",
      "];",
      "const r1 = validateSchemaEvolution(prev, nextValid, 'BACKWARD');",
      "if (!r1.compatible || r1.reason !== 'COMPATIBLE') throw new Error('r1 fail: ' + JSON.stringify(r1));",
      "const r2 = validateSchemaEvolution(prev, nextInvalid, 'BACKWARD');",
      "if (r2.compatible || !r2.reason.includes('default')) throw new Error('r2 fail: ' + JSON.stringify(r2));",
      "const r3 = validateSchemaEvolution(prev, [{ name: 'id', type: 'string', hasDefault: false }], 'FORWARD');",
      "if (!r3.compatible) throw new Error('r3 fail: ' + JSON.stringify(r3));"
    ),
    aTitle: "Wire Protocol Schema ID Magic Byte Encoder & Decoder",
    aDesc: "Write `encodeWireMessage(schemaId: number, payloadUtf8: string): { magicByte: number; schemaId: number; payload: string }` and `parseWireMessage(wire: { magicByte: number; schemaId: number; payload: string }): { valid: boolean; schemaId: number; payload: string | null }` (magicByte must equal 0).",
    aLanguage: "typescript",
    aStarter: lines(
      "function encodeWireMessage(schemaId: number, payloadUtf8: string): { magicByte: number; schemaId: number; payload: string } {",
      "  return { magicByte: 0, schemaId: 0, payload: '' };",
      "}",
      "function parseWireMessage(wire: { magicByte: number; schemaId: number; payload: string }): { valid: boolean; schemaId: number; payload: string | null } {",
      "  return { valid: false, schemaId: 0, payload: null };",
      "}"
    ),
    aHint: "Magic byte is 0 for Confluent wire protocol. If wire.magicByte !== 0, return valid: false and payload: null.",
    aTest: lines(
      "if (typeof encodeWireMessage !== 'function' || typeof parseWireMessage !== 'function') throw new Error('Functions not found');",
      "const enc = encodeWireMessage(42, '{\"user\":\"alice\"}');",
      "if (enc.magicByte !== 0 || enc.schemaId !== 42 || enc.payload !== '{\"user\":\"alice\"}') throw new Error('Encode fail: ' + JSON.stringify(enc));",
      "const dec1 = parseWireMessage(enc);",
      "if (!dec1.valid || dec1.schemaId !== 42 || dec1.payload !== '{\"user\":\"alice\"}') throw new Error('Dec1 fail: ' + JSON.stringify(dec1));",
      "const dec2 = parseWireMessage({ magicByte: 1, schemaId: 42, payload: 'bad' });",
      "if (dec2.valid || dec2.payload !== null) throw new Error('Dec2 invalid magic byte fail');"
    )
  },

  // ── DAY 27 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[26],
    eTitle: "Non-Blocking Retry & DLQ Topic Router",
    eDesc: "Write `routeFailedMessage(record: { id: string; attempts: number; error: string }, maxRetries: number = 3): { destinationTopic: string; nextAttempt: number; isDeadLetter: boolean }` (if attempts + 1 > maxRetries, route to 'dead-letter-queue' with isDeadLetter = true; otherwise route to 'retry-step-' + (attempts + 1)).",
    eLanguage: "typescript",
    eStarter: lines(
      "function routeFailedMessage(record: { id: string; attempts: number; error: string }, maxRetries: number = 3): { destinationTopic: string; nextAttempt: number; isDeadLetter: boolean } {",
      "  // Route failed message to retry topic or DLQ",
      "  return { destinationTopic: '', nextAttempt: 0, isDeadLetter: false };",
      "}"
    ),
    eHint: "Increment attempts. If nextAttempt > maxRetries return DLQ, else return retry topic.",
    eTest: lines(
      "if (typeof routeFailedMessage !== 'function') throw new Error('routeFailedMessage not found');",
      "const r1 = routeFailedMessage({ id: 'm1', attempts: 0, error: 'timeout' }, 3);",
      "if (r1.destinationTopic !== 'retry-step-1' || r1.nextAttempt !== 1 || r1.isDeadLetter) throw new Error('r1 fail: ' + JSON.stringify(r1));",
      "const r2 = routeFailedMessage({ id: 'm1', attempts: 2, error: 'timeout' }, 3);",
      "if (r2.destinationTopic !== 'retry-step-3' || r2.nextAttempt !== 3 || r2.isDeadLetter) throw new Error('r2 fail: ' + JSON.stringify(r2));",
      "const r3 = routeFailedMessage({ id: 'm1', attempts: 3, error: 'crash' }, 3);",
      "if (r3.destinationTopic !== 'dead-letter-queue' || r3.nextAttempt !== 4 || !r3.isDeadLetter) throw new Error('r3 DLQ fail: ' + JSON.stringify(r3));"
    ),
    aTitle: "Dead-Letter Envelope Packaging with Diagnostics Context",
    aDesc: "Write `packageDlqEnvelope(record: { id: string; topic: string; partition: number; offset: number; payload: string }, error: Error, nowMs: number): { dlqId: string; originalTopic: string; partition: number; offset: number; errorMessage: string; quarantinedAtMs: number; rawPayload: string }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function packageDlqEnvelope(record: { id: string; topic: string; partition: number; offset: number; payload: string }, error: Error, nowMs: number): { dlqId: string; originalTopic: string; partition: number; offset: number; errorMessage: string; quarantinedAtMs: number; rawPayload: string } {",
      "  // Package DLQ envelope",
      "  return { dlqId: '', originalTopic: '', partition: 0, offset: 0, errorMessage: '', quarantinedAtMs: 0, rawPayload: '' };",
      "}"
    ),
    aHint: "Package properties including dlqId: 'dlq-' + record.id and errorMessage: error.message.",
    aTest: lines(
      "if (typeof packageDlqEnvelope !== 'function') throw new Error('packageDlqEnvelope not found');",
      "const err = new Error('Corrupted JSON syntax');",
      "const env1 = packageDlqEnvelope({ id: 'rec-1', topic: 'orders', partition: 2, offset: 104, payload: '{bad}' }, err, 1600000000);",
      "if (env1.dlqId !== 'dlq-rec-1' || env1.originalTopic !== 'orders' || env1.partition !== 2 || env1.offset !== 104 || env1.errorMessage !== 'Corrupted JSON syntax' || env1.quarantinedAtMs !== 1600000000 || env1.rawPayload !== '{bad}') {",
      "  throw new Error('env1 fail: ' + JSON.stringify(env1));",
      "}",
      "const env2 = packageDlqEnvelope({ id: 'rec-2', topic: 'payments', partition: 0, offset: 5, payload: 'x' }, new Error('Timeout'), 1700000000);",
      "if (env2.dlqId !== 'dlq-rec-2' || env2.errorMessage !== 'Timeout') throw new Error('env2 fail');"
    )
  },

  // ── DAY 28 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[27],
    eTitle: "Historical Timestamp-to-Offset Index Search for Stream Rewinding",
    eDesc: "Write `findReplayStartOffsets(partitionLogs: Record<number, { offset: number; timestamp: number }[]>, replayTimestamp: number): Record<number, number>` finding the earliest offset in each partition whose timestamp >= replayTimestamp. If all records are before replayTimestamp, use log.length (end of log). If partition empty, use 0.",
    eLanguage: "typescript",
    eStarter: lines(
      "function findReplayStartOffsets(partitionLogs: Record<number, { offset: number; timestamp: number }[]>, replayTimestamp: number): Record<number, number> {",
      "  // Find replay start offsets",
      "  return {};",
      "}"
    ),
    eHint: "Find first entry with timestamp >= replayTimestamp. If not found, use entries.length. If empty, use 0.",
    eTest: lines(
      "if (typeof findReplayStartOffsets !== 'function') throw new Error('findReplayStartOffsets not found');",
      "const logs = {",
      "  0: [{ offset: 0, timestamp: 100 }, { offset: 1, timestamp: 200 }, { offset: 2, timestamp: 300 }],",
      "  1: [{ offset: 0, timestamp: 150 }, { offset: 1, timestamp: 250 }],",
      "  2: []",
      "};",
      "const o1 = findReplayStartOffsets(logs, 180);",
      "if (o1[0] !== 1 || o1[1] !== 1 || o1[2] !== 0) throw new Error('o1 fail: ' + JSON.stringify(o1));",
      "const o2 = findReplayStartOffsets(logs, 500);",
      "if (o2[0] !== 3 || o2[1] !== 2 || o2[2] !== 0) throw new Error('o2 fail: ' + JSON.stringify(o2));",
      "const o3 = findReplayStartOffsets({}, 100);",
      "if (Object.keys(o3).length !== 0) throw new Error('o3 fail');"
    ),
    aTitle: "Zero-Downtime Consumer Group Switchover Orchestrator",
    aDesc: "Write `planGroupSwitchover(currentGroupId: string, targetVersion: string, activePartitions: number[]): { newGroupId: string; initialOffsetsSource: string; switchoverPlan: { step: number; action: string }[] }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function planGroupSwitchover(currentGroupId: string, targetVersion: string, activePartitions: number[]): { newGroupId: string; initialOffsetsSource: string; switchoverPlan: { step: number; action: string }[] } {",
      "  // Plan consumer group switchover",
      "  return { newGroupId: '', initialOffsetsSource: '', switchoverPlan: [] };",
      "}"
    ),
    aHint: "Create newGroupId = currentGroupId + '-' + targetVersion and return 4 sequential steps.",
    aTest: lines(
      "if (typeof planGroupSwitchover !== 'function') throw new Error('planGroupSwitchover not found');",
      "const plan1 = planGroupSwitchover('payment-consumer', 'v2', [0, 1, 2]);",
      "if (plan1.newGroupId !== 'payment-consumer-v2') throw new Error('New group ID fail: ' + plan1.newGroupId);",
      "if (plan1.initialOffsetsSource !== 'earliest') throw new Error('Initial offset fail');",
      "if (plan1.switchoverPlan.length !== 4) throw new Error('Plan step count fail: ' + plan1.switchoverPlan.length);",
      "if (!plan1.switchoverPlan[0].action.includes('Start payment-consumer-v2')) throw new Error('Step 1 fail');",
      "const plan2 = planGroupSwitchover('analytics', 'v3', [0]);",
      "if (plan2.newGroupId !== 'analytics-v3') throw new Error('plan2 fail');"
    )
  },

  // ── DAY 29 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[28],
    eTitle: "Consumer Lag Velocity and Backlog Time-to-Recover Predictor",
    eDesc: "Write `predictTimeToRecoverSeconds(currentLag: number, consumptionRateMsgPerSec: number, productionRateMsgPerSec: number): { willRecover: boolean; recoverySeconds: number | null; netDrainRateMsgPerSec: number }` (netDrain = consumption - production. If netDrain <= 0, willRecover is false and recoverySeconds is null; otherwise recoverySeconds = Math.ceil(currentLag / netDrain)).",
    eLanguage: "typescript",
    eStarter: lines(
      "function predictTimeToRecoverSeconds(currentLag: number, consumptionRateMsgPerSec: number, productionRateMsgPerSec: number): { willRecover: boolean; recoverySeconds: number | null; netDrainRateMsgPerSec: number } {",
      "  // Predict lag recovery time",
      "  return { willRecover: false, recoverySeconds: null, netDrainRateMsgPerSec: 0 };",
      "}"
    ),
    eHint: "netDrain = consumption - production. If lag <= 0 return 0s; if netDrain <= 0 return null.",
    eTest: lines(
      "if (typeof predictTimeToRecoverSeconds !== 'function') throw new Error('predictTimeToRecoverSeconds not found');",
      "const r1 = predictTimeToRecoverSeconds(10000, 1500, 1000);",
      "if (!r1.willRecover || r1.recoverySeconds !== 20 || r1.netDrainRateMsgPerSec !== 500) throw new Error('r1 fail: ' + JSON.stringify(r1));",
      "const r2 = predictTimeToRecoverSeconds(5000, 800, 1000);",
      "if (r2.willRecover || r2.recoverySeconds !== null || r2.netDrainRateMsgPerSec !== -200) throw new Error('r2 fail: ' + JSON.stringify(r2));",
      "const r3 = predictTimeToRecoverSeconds(0, 1000, 500);",
      "if (!r3.willRecover || r3.recoverySeconds !== 0) throw new Error('r3 zero lag fail: ' + JSON.stringify(r3));"
    ),
    aTitle: "Detect Partition Traffic Skew and Key Hotspotting",
    aDesc: "Write `detectPartitionHotspots(partitionMessageCounts: Record<number, number>, hotspotThresholdRatio: number = 2.0): { hasHotspot: boolean; averageMessages: number; hotspotPartitions: number[] }` (a partition is a hotspot if its count >= averageMessages * hotspotThresholdRatio).",
    aLanguage: "typescript",
    aStarter: lines(
      "function detectPartitionHotspots(partitionMessageCounts: Record<number, number>, hotspotThresholdRatio: number = 2.0): { hasHotspot: boolean; averageMessages: number; hotspotPartitions: number[] } {",
      "  // Detect partition hotspots",
      "  return { hasHotspot: false, averageMessages: 0, hotspotPartitions: [] };",
      "}"
    ),
    aHint: "Calculate average message count across all partitions. Filter partitions where count >= average * threshold.",
    aTest: lines(
      "if (typeof detectPartitionHotspots !== 'function') throw new Error('detectPartitionHotspots not found');",
      "const counts1 = { 0: 1000, 1: 1100, 2: 900, 3: 5000 };",
      "const h1 = detectPartitionHotspots(counts1, 2.0);",
      "if (!h1.hasHotspot || h1.averageMessages !== 2000 || JSON.stringify(h1.hotspotPartitions) !== JSON.stringify([3])) throw new Error('h1 fail: ' + JSON.stringify(h1));",
      "const counts2 = { 0: 1000, 1: 1000, 2: 1000 };",
      "const h2 = detectPartitionHotspots(counts2, 1.5);",
      "if (h2.hasHotspot || h2.hotspotPartitions.length !== 0) throw new Error('h2 fail: ' + JSON.stringify(h2));",
      "const h3 = detectPartitionHotspots({});",
      "if (h3.hasHotspot || h3.averageMessages !== 0) throw new Error('h3 empty fail');"
    )
  },

  // ── DAY 30 ──────────────────────────────────────────────────────────
  {
    ...STREAM_DAYS[29],
    eTitle: "Real-Time Fraud Detection Engine with Sliding Velocity Window",
    eDesc: "Implement `class FinancialFraudDetector` with `constructor(velocityWindowMs: number, maxCountPerWindow: number, maxTotalSpendPerWindow: number)`, `processTransaction(tx: { id: string; cardId: string; timestampMs: number; amount: number }): { flagged: boolean; reason: 'VELOCITY_COUNT_EXCEEDED' | 'VELOCITY_SPEND_EXCEEDED' | 'CLEAN' }`, and `getActiveCardVelocity(cardId: string, nowMs: number): { count: number; totalSpend: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "class FinancialFraudDetector {",
      "  constructor(public velocityWindowMs: number, public maxCountPerWindow: number, public maxTotalSpendPerWindow: number) {}",
      "  processTransaction(tx: { id: string; cardId: string; timestampMs: number; amount: number }): { flagged: boolean; reason: 'VELOCITY_COUNT_EXCEEDED' | 'VELOCITY_SPEND_EXCEEDED' | 'CLEAN' } {",
      "    return { flagged: false, reason: 'CLEAN' };",
      "  }",
      "  getActiveCardVelocity(cardId: string, nowMs: number): { count: number; totalSpend: number } {",
      "    return { count: 0, totalSpend: 0 };",
      "  }",
      "}"
    ),
    eHint: "Track transaction history per cardId. Filter out events older than velocityWindowMs. Flag if count > maxCount or totalSpend > maxSpend.",
    eTest: lines(
      "if (typeof FinancialFraudDetector !== 'function') throw new Error('FinancialFraudDetector not found');",
      "const detector = new FinancialFraudDetector(60000, 3, 500);",
      "const t1 = detector.processTransaction({ id: 'tx-1', cardId: 'c1', timestampMs: 1000, amount: 100 });",
      "const t2 = detector.processTransaction({ id: 'tx-2', cardId: 'c1', timestampMs: 5000, amount: 200 });",
      "if (t1.flagged || t1.reason !== 'CLEAN') throw new Error('t1 fail: ' + JSON.stringify(t1));",
      "if (t2.flagged || t2.reason !== 'CLEAN') throw new Error('t2 fail: ' + JSON.stringify(t2));",
      "const t3 = detector.processTransaction({ id: 'tx-3', cardId: 'c1', timestampMs: 10000, amount: 250 });",
      "if (!t3.flagged || t3.reason !== 'VELOCITY_SPEND_EXCEEDED') throw new Error('t3 spend fail: ' + JSON.stringify(t3));",
      "const t4 = detector.processTransaction({ id: 'tx-4', cardId: 'c2', timestampMs: 20000, amount: 10 });",
      "const t5 = detector.processTransaction({ id: 'tx-5', cardId: 'c2', timestampMs: 25000, amount: 10 });",
      "const t6 = detector.processTransaction({ id: 'tx-6', cardId: 'c2', timestampMs: 30000, amount: 10 });",
      "const t7 = detector.processTransaction({ id: 'tx-7', cardId: 'c2', timestampMs: 35000, amount: 10 });",
      "if (!t7.flagged || t7.reason !== 'VELOCITY_COUNT_EXCEEDED') throw new Error('t7 count fail: ' + JSON.stringify(t7));",
      "const v1 = detector.getActiveCardVelocity('c1', 10000);",
      "if (v1.count !== 3 || v1.totalSpend !== 550) throw new Error('Velocity c1 fail: ' + JSON.stringify(v1));"
    ),
    aTitle: "Audit Master Streaming Engine Capstone Certification Status",
    aDesc: "Write `auditStreamingPlatformCertification(completedDays: number, totalDays: number = 30): { certified: boolean; score: string; tier: string }` (certified when completedDays === totalDays, tier 'STREAMING_SYSTEMS_ARCHITECT_CERTIFIED' when certified, else 'INCOMPLETE_CURRICULUM').",
    aLanguage: "typescript",
    aStarter: lines(
      "function auditStreamingPlatformCertification(completedDays: number, totalDays: number = 30): { certified: boolean; score: string; tier: string } {",
      "  // Audit streaming platform certification",
      "  return { certified: false, score: '0/30', tier: 'INCOMPLETE_CURRICULUM' };",
      "}"
    ),
    aHint: "certified = completedDays === totalDays. If certified, tier is STREAMING_SYSTEMS_ARCHITECT_CERTIFIED.",
    aTest: lines(
      "if (typeof auditStreamingPlatformCertification !== 'function') throw new Error('auditStreamingPlatformCertification not found');",
      "const pass = auditStreamingPlatformCertification(30, 30);",
      "if (!pass.certified || pass.score !== '30/30' || pass.tier !== 'STREAMING_SYSTEMS_ARCHITECT_CERTIFIED') throw new Error('Pass audit failed: ' + JSON.stringify(pass));",
      "const fail = auditStreamingPlatformCertification(28, 30);",
      "if (fail.certified || fail.score !== '28/30' || fail.tier !== 'INCOMPLETE_CURRICULUM') throw new Error('Fail audit failed: ' + JSON.stringify(fail));"
    )
  }
];

export const STREAM_WEB_30_DAYS_QUESTS = STREAM_WEB_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('stream-web', i + 1, cfg)
);
