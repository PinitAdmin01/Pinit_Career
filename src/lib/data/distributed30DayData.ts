import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const DISTRIBUTED_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Distributed Systems Foundations & Fallacies",
    "desc": "Understand the 8 fallacies of distributed computing: network reliability, zero latency, infinite bandwidth, and single administrator topology.",
    "syllabus": [
      "The 8 Fallacies of Distributed Computing (L. Peter Deutsch).",
      "Network Partitions & Timeout handling with exponential backoff.",
      "Idempotency and retry semantics over unreliable networks."
    ],
    "eTitle": "Network Timeout & Exponential Backoff Retry Engine",
    "eDesc": "Implement function executeWithBackoff(networkCall, maxRetries = 3, baseDelayMs = 100) retrying on transient network failures with exponential backoff and jitter.",
    "eStarter": "async function executeWithBackoff(fn, maxRetries = 3, baseDelay = 100) {\n  // TODO: write your code here\n}",
    "eHint": "Try fn(), on catch increment attempt, delay baseDelay * 2^(attempt-1), retry until maxRetries.",
    "eTest": "let calls = 0;\nconst flaky = async () => { calls++; if (calls < 3) throw new Error('NET_TIMEOUT'); return 'OK'; };\nawait executeWithBackoff(flaky, 3, 10).then(res => {\n  if (res !== 'OK' || calls !== 3) throw new Error('Exponential backoff failed to recover flaky network call');\n});",
    "aTitle": "Backoff Delay Calculator",
    "aDesc": "Implement function calculateBackoffDelay(attempt, baseDelay = 100) returning `baseDelay * 2^(attempt - 1)`.",
    "aStarter": "function calculateBackoffDelay(a, b = 100) {\n  // TODO: write your code here\n}",
    "aHint": "Compute base * 2^(attempt - 1).",
    "aTest": "if (calculateBackoffDelay(1, 100) !== 100 || calculateBackoffDelay(3, 100) !== 400) throw new Error('Delay calc failed');"
  },
  {
    "day": 2,
    "title": "The CAP Theorem & PACELC Theorem",
    "desc": "Analyze Consistency, Availability, Partition tolerance trade-offs and PACELC (If Partition: Availability or Consistency; Else: Latency or Consistency).",
    "syllabus": [
      "CAP Theorem: In the presence of a network partition (P), choose Consistency (CP) or Availability (AP).",
      "PACELC Theorem: In normal operation (E), trade off Latency (L) vs Consistency (C).",
      "Real-world mappings: DynamoDB (PA/EL), Spanner (PC/EC), Cassandra (PA/EL), MongoDB (PC/EC)."
    ],
    "eTitle": "CAP & PACELC System Classifier",
    "eDesc": "Implement function classifyDistributedSystem(partitionPolicy, normalPolicy) returning system trade-off classification string.",
    "eStarter": "function classifyDistributedSystem(partition, normal) {\n  // TODO: write your code here\n}",
    "eHint": "Match partition (AP/CP) and normal (EL/EC).",
    "eTest": "if (!classifyDistributedSystem('AP', 'EL').includes('DynamoDB')) throw new Error('DynamoDB classification failed');\nif (!classifyDistributedSystem('CP', 'EC').includes('Spanner')) throw new Error('Spanner classification failed');",
    "aTitle": "Partition Quorum Validator",
    "aDesc": "Implement function isQuorumAvailable(activeNodes, totalNodes) returning true if active > total / 2.",
    "aStarter": "function isQuorumAvailable(active, total) {\n  // TODO: write your code here\n}",
    "aHint": "Check active > total / 2.",
    "aTest": "if (isQuorumAvailable(3, 5) !== true || isQuorumAvailable(2, 5) !== false) throw new Error('Quorum check failed');"
  },
  {
    "day": 3,
    "title": "RPC Communication & Protocol Buffers Binary Serialization",
    "desc": "Design compact binary serialization interfaces, gRPC streaming, and HTTP/2 multiplexed Remote Procedure Calls.",
    "syllabus": [
      "JSON (Verbose text) vs Protocol Buffers (Compact binary wire format).",
      "gRPC 4 Communication Modes: Unary, Server Streaming, Client Streaming, Bidirectional.",
      "HTTP/2 Multiplexing: Eliminating Head-of-Line blocking across a single TCP connection."
    ],
    "eTitle": "Protobuf Varint Binary Serializer Simulator",
    "eDesc": "Implement function encodeVarint(value) encoding unsigned integers into variable-length bytes (7-bit payloads with MSB continuation flag).",
    "eStarter": "function encodeVarint(val) {\n  // TODO: write your code here\n}",
    "eHint": "Extract 7 bits, set 8th bit if remainder > 0.",
    "eTest": "const singleByte = encodeVarint(1); // 0x01\nconst twoBytes = encodeVarint(300); // 300 = 0xAC 0x02\nif (singleByte.length !== 1 || singleByte[0] !== 1) throw new Error('Single byte varint failed');\nif (twoBytes.length !== 2 || twoBytes[0] !== 0xAC || twoBytes[1] !== 0x02) throw new Error('Multi-byte varint failed');",
    "aTitle": "Protobuf Wire Type Decoder",
    "aDesc": "Implement function getWireType(tagByte) returning wire type from lowest 3 bits (`tagByte & 0x07`). Use these exact values: getWireType() returns 'LENGTH_DELIMITED'.",
    "aStarter": "function getWireType(t) {\n  // TODO: write your code here\n}",
    "aHint": "Extract tag & 7.",
    "aTest": "if (getWireType(0x08) !== 'VARINT' || getWireType(0x12) !== 'LENGTH_DELIMITED') throw new Error('Wire type decoder failed');"
  },
  {
    "day": 4,
    "title": "Consistent Hashing & Virtual Nodes Distribution",
    "desc": "Distribute billions of keys across dynamic server clusters with Consistent Hashing rings and virtual nodes to eliminate hash remap storms ($K/N$ migration).",
    "syllabus": [
      "Modulo Hashing ($K \\pmod N$) disaster: Adding 1 node forces 99% key reshuffle.",
      "Consistent Hash Ring: Mapping keys and nodes onto $[0, 2^{32}-1]$ integer circle.",
      "Virtual Nodes (V-Nodes): Ensuring uniform load distribution across heterogeneous nodes."
    ],
    "eTitle": "Consistent Hash Ring with Virtual Nodes",
    "eDesc": "Implement class ConsistentHashRing with addNode(nodeId, vnodes = 3), removeNode(nodeId), and getNode(key) routing to next clockwise node.",
    "eStarter": "class ConsistentHashRing {\n  constructor(hashFn = (s) => {\n    let h = 0;\n    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;\n    return Math.abs(h);\n  }) {\n    this.hashFn = hashFn;\n    this.ring = []; // [{ hash, nodeId }]\n    this.nodes = new Set();\n  }\n  addNode(nodeId, vnodes = 3) {\n    // TODO: write your code here\n  }\n  removeNode(nodeId) {\n    // TODO: write your code here\n  }\n  getNode(key) {\n    // TODO: write your code here\n  }\n}",
    "eHint": "Store virtual nodes sorted by hash, find first node where hash >= keyHash, wrap to ring[0].",
    "eTest": "const ring = new ConsistentHashRing();\nring.addNode('Server-A', 5);\nring.addNode('Server-B', 5);\nring.addNode('Server-C', 5);\nconst target = ring.getNode('user_session_1001');\nif (!['Server-A', 'Server-B', 'Server-C'].includes(target)) throw new Error('Routing to unknown node');\nring.removeNode(target);\nconst fallback = ring.getNode('user_session_1001');\nif (fallback === target) throw new Error('Removed node should not receive keys');",
    "aTitle": "Ring Key Migration Counter",
    "aDesc": "Implement function calculateMigrationRatio(totalKeys, totalNodes) returning expected fraction $1 / (N + 1)$.",
    "aStarter": "function calculateMigrationRatio(keys, nodes) {\n  // TODO: write your code here\n}",
    "aHint": "Compute 1 / (nodes + 1).",
    "aTest": "if (calculateMigrationRatio(1000, 9) !== '10.0%') throw new Error('Migration calc failed for 9 nodes');\nif (calculateMigrationRatio(500, 3) !== '25.0%') throw new Error('Migration calc failed for 3 nodes');\nif (calculateMigrationRatio(1000, 1) !== '50.0%') throw new Error('Migration calc failed for 1 node');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense",
    "desc": "Milestone 1: Build a production distributed cache layer: Cache-Aside pattern, Write-Through / Write-Back replication, TTL jitter, and Mutex Singleflight to completely eliminate Thundering Herd stampedes.",
    "syllabus": [
      "Cache-Aside (Lazy loading) vs Write-Through vs Write-Back (Write-Behind).",
      "Cache Stampede (Thundering Herd): 10,000 requests hit database simultaneously on cache key expiration.",
      "Singleflight Mutex: Merging concurrent identical key misses into a single database fetch."
    ],
    "eTitle": "Singleflight Mutex Distributed Cache Engine",
    "eDesc": "Implement class SingleflightCache with getOrFetch(key, dbFetchFn, ttlSeconds) ensuring only 1 DB query executes during concurrent cache misses.",
    "eStarter": "class SingleflightCache {\n  constructor() {\n    this.store = new Map();\n    this.inFlight = new Map(); // key -> Promise\n  }\n  async getOrFetch(key, dbFetchFn, ttlSec = 60) {\n    // TODO: write your code here\n  }\n}",
    "eHint": "Use inFlight map of promises to merge concurrent fetches.",
    "eTest": "const cache = new SingleflightCache();\nlet dbQueries = 0;\nconst mockDbFetch = async () => {\n  dbQueries++;\n  await new Promise(r => setTimeout(r, 20));\n  return { user: 'Alice', balance: 500 };\n};\nawait Promise.all([\n  cache.getOrFetch('user_1', mockDbFetch, 10),\n  cache.getOrFetch('user_1', mockDbFetch, 10),\n  cache.getOrFetch('user_1', mockDbFetch, 10)\n]).then(results => {\n  if (dbQueries !== 1) throw new Error(`Thundering herd failure: DB queried ${dbQueries} times instead of 1`);\n  if (results[0].user !== 'Alice') throw new Error('Data mismatch');\n});",
    "aTitle": "TTL Jitter Calculator",
    "aDesc": "Implement function calculateTtlWithJitter(baseTtlSec, maxJitterSec = 10) returning randomized TTL.",
    "aStarter": "function calculateTtlWithJitter(base, maxJitter = 10) {\n  // TODO: write your code here\n}",
    "aHint": "Add random jitter to base.",
    "aTest": "const t1 = calculateTtlWithJitter(100, 5);\nif (typeof t1 !== 'number' || t1 < 100 || t1 >= 105) throw new Error('TTL jitter out of range for base 100');\nconst t2 = calculateTtlWithJitter(500, 10);\nif (typeof t2 !== 'number' || t2 < 500 || t2 >= 510) throw new Error('TTL jitter out of range for base 500');\nconst t3 = calculateTtlWithJitter(1000, 20);\nif (typeof t3 !== 'number' || t3 < 1000 || t3 >= 1020) throw new Error('TTL jitter out of range for base 1000');\nconst ttls = new Set();\nfor (let i = 0; i < 50; i++) ttls.add(calculateTtlWithJitter(60, 10));\nif (ttls.size < 3) throw new Error('TTL must produce varied jitter values across repeated calls');"
  },
  {
    "day": 6,
    "title": "Distributed Locks: Redis Redlock & Fencing Tokens",
    "desc": "Acquire cluster-wide mutual exclusion locks safely using Redis Redlock algorithm, TTL leases, auto-renew heartbeats, and monotonic Fencing Tokens.",
    "syllabus": [
      "The distributed lock dilemma: GC pauses and network delays causing split-brain race conditions (Martin Kleppmann critique).",
      "Redis Redlock Algorithm: Acquiring lock across $N/2 + 1$ independent Redis masters.",
      "Fencing Tokens: Monotonically increasing integers validating storage write ordering."
    ],
    "eTitle": "Distributed Lock with Monotonic Fencing Token",
    "eDesc": "Implement class DistributedLockManager with acquireLock(resourceId, ttlMs) and releaseLock(resourceId, lockId) generating monotonic fencing tokens. The result must have the field: `success`.",
    "eStarter": "class DistributedLockManager {\n  constructor() {\n    this.locks = new Map();\n    this.fencingCounter = 0;\n  }\n  acquireLock(resource, ttlMs = 1000) {\n    // TODO: write your code here\n  }\n  releaseLock(resource, lockId) {\n    // TODO: write your code here\n  }\n}",
    "eHint": "Track lockId, expiresAt, and incrementing fencingToken.",
    "eTest": "const manager = new DistributedLockManager();\nconst l1 = manager.acquireLock('order_9981', 1000);\nconst l2 = manager.acquireLock('order_9981', 1000);\nif (!l1.success || l2.success) throw new Error('Mutual exclusion failed');\nif (l1.fencingToken !== 1) throw new Error('Fencing token should start at 1');\nmanager.releaseLock('order_9981', l1.lockId);\nconst l3 = manager.acquireLock('order_9981', 1000);\nif (!l3.success || l3.fencingToken <= l1.fencingToken) throw new Error('Subsequent lock must receive higher monotonic fencing token');",
    "aTitle": "Lock Validity Duration Checker",
    "aDesc": "Implement function isLockValid(acquiredAt, ttlMs, driftMs = 50) checking if `(now - acquiredAt + drift) < ttl`.",
    "aStarter": "function isLockValid(at, ttl, drift = 50) {\n  // TODO: write your code here\n}",
    "aHint": "Check elapsed time < ttl.",
    "aTest": "if (isLockValid(Date.now(), 1000) !== true) throw new Error('Fresh lock should be valid');\nif (isLockValid(Date.now() - 5000, 1000) !== false) throw new Error('A lock taken 5 seconds ago with a 1 second TTL has expired');"
  },
  {
    "day": 7,
    "title": "Leader Election: Bully Algorithm & Raft Heartbeats",
    "desc": "Coordinate distributed cluster leadership: Bully Algorithm (Highest node ID wins), Ring Election, and Raft randomized heartbeat elections.",
    "syllabus": [
      "Leader-Follower (Master-Replica) coordination topology.",
      "The Bully Algorithm: Highest process ID broadcasts `COORDINATOR` message.",
      "Split-Brain Prevention: Requiring strict majority quorum ($N/2 + 1$) to elect leader."
    ],
    "eTitle": "Bully Leader Election Protocol Engine",
    "eDesc": "Implement function runBullyElection(activeNodeIds, failedNodeId) selecting highest ID active node and broadcasting coordinator status. Use these exact values: `status`: 'LEADER_ELECTION_COMPLETE'. The result must have the field: `newLeaderId`.",
    "eStarter": "function runBullyElection(activeNodes, failedLeaderId) {\n  // TODO: write your code here\n}",
    "eHint": "Filter out failed leader, find max node ID, return coordinator broadcast.",
    "eTest": "const res1 = runBullyElection([101, 102, 105, 108], 108);\nif (res1.newLeaderId !== 105 || res1.status !== 'LEADER_ELECTION_COMPLETE') throw new Error('Bully leader election failed for 108');\nconst res2 = runBullyElection([10, 20, 30], 30);\nif (res2.newLeaderId !== 20 || res2.status !== 'LEADER_ELECTION_COMPLETE') throw new Error('Bully leader election failed for 30');\nconst res3 = runBullyElection([5, 15, 25, 35], 25);\nif (res3.newLeaderId !== 35 || res3.status !== 'LEADER_ELECTION_COMPLETE') throw new Error('Bully leader election failed for 25');",
    "aTitle": "Election Quorum Checker",
    "aDesc": "Implement function hasMajorityVotes(votes, total) returning true if votes >= floor(total/2) + 1.",
    "aStarter": "function hasMajorityVotes(v, t) {\n  // TODO: write your code here\n}",
    "aHint": "Check v >= floor(t/2) + 1.",
    "aTest": "if (hasMajorityVotes(3, 5) !== true || hasMajorityVotes(2, 5) !== false) throw new Error('Majority vote check failed');"
  },
  {
    "day": 8,
    "title": "Distributed Unique ID Generation: Twitter Snowflake & ULID",
    "desc": "Generate 64-bit globally unique, roughly time-sorted integers without central coordination using Twitter Snowflake (Timestamp + Worker ID + Sequence).",
    "syllabus": [
      "UUIDv4 (128-bit random, bad database B-Tree index fragmentation) vs Snowflake (64-bit time-ordered).",
      "Snowflake Bit Layout: 1 bit sign | 41 bits timestamp (69 years) | 10 bits machine/datacenter ID (1024 workers) | 12 bits sequence (4096 IDs/ms).",
      "Clock Backward Drift (NTP rewind) handling."
    ],
    "eTitle": "Twitter Snowflake 64-Bit ID Generator",
    "eDesc": "Implement class SnowflakeIdGenerator with nextId() producing monotonically increasing BigInt 64-bit IDs.",
    "eStarter": "class SnowflakeIdGenerator {\n  constructor(workerId = 1, datacenterId = 1, epoch = 1704067200000n) {\n    this.workerId = BigInt(workerId);\n    this.datacenterId = BigInt(datacenterId);\n    this.epoch = epoch;\n    this.sequence = 0n;\n    this.lastTimestamp = -1n;\n  }\n  nextId() {\n    // TODO: write your code here\n  }\n}",
    "eHint": "Shift (now - epoch) << 22, datacenter << 17, worker << 12, sequence; handle sequence wrap.",
    "eTest": "const gen = new SnowflakeIdGenerator(5, 2);\nconst id1 = gen.nextId();\nconst id2 = gen.nextId();\nif (BigInt(id2) <= BigInt(id1)) throw new Error('Snowflake IDs must be monotonically increasing');\nif (typeof id1 !== 'string' || id1.length < 10) throw new Error('Snowflake ID string format invalid');",
    "aTitle": "ULID Timestamp Extractor",
    "aDesc": "Implement function getUlidPrefix(timestamp) returning timestamp slice.",
    "aStarter": "function getUlidPrefix(t) {\n  // TODO: write your code here\n}",
    "aHint": "Convert to base36.",
    "aTest": "if (typeof getUlidPrefix(1700000000) !== 'string') throw new Error('ULID prefix failed');\nif (getUlidPrefix(1700000000) === getUlidPrefix(1700000001)) throw new Error('Different timestamps must give different prefixes');\nif (getUlidPrefix(1700000000) !== getUlidPrefix(1700000000)) throw new Error('The same timestamp must always give the same prefix');"
  },
  {
    "day": 9,
    "title": "Consensus Protocols: Raft Log Replication & Quorum Mathematics",
    "desc": "Replicate distributed state machine logs safely with Raft: Leader Term, Log Entry Index, Heartbeats, and Quorum Commit confirmation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Consensus Protocols: Raft Log Replication & Quorum Mathematics.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Raft Log Replication State Machine",
    "eDesc": "Implement function replicateRaftLog(leaderLog, followerLog, prevLogIndex, prevLogTerm, newEntries) verifying consistency and appending entries. The result must have these fields: `success`, `updatedLog`.",
    "eStarter": "function replicateRaftLog(leaderLog, followerLog, prevIndex, prevTerm, entries) {\n  // TODO: write your code here\n}",
    "eHint": "Check followerLog[prevIndex].term === prevTerm, slice and concat entries.",
    "eTest": "const fLog1 = [{ term: 1, cmd: 'x=1' }];\nconst res1 = replicateRaftLog(null, fLog1, 0, 1, [{ term: 2, cmd: 'y=2' }]);\nif (!res1.success || res1.updatedLog.length !== 2 || res1.updatedLog[1].cmd !== 'y=2') throw new Error('Raft append failed');\nconst res2 = replicateRaftLog(null, fLog1, 0, 999, [{ term: 2, cmd: 'z=3' }]);\nif (res2.success !== false) throw new Error('Raft inconsistency check failed to reject mismatched term');\nconst res3 = replicateRaftLog(null, [], -1, 0, [{ term: 1, cmd: 'a=1' }, { term: 1, cmd: 'b=2' }]);\nif (!res3.success || res3.updatedLog.length !== 2 || res3.updatedLog[0].cmd !== 'a=1') throw new Error('Raft empty follower log append failed');",
    "aTitle": "Raft Quorum Commit Checker",
    "aDesc": "Implement function isLogCommitted(matchCounts, clusterSize) returning true if matchCounts > clusterSize / 2.",
    "aStarter": "function isLogCommitted(m, c) {\n  // TODO: write your code here\n}",
    "aHint": "Check m > floor(c/2).",
    "aTest": "if (isLogCommitted(3, 5) !== true || isLogCommitted(2, 5) !== false) throw new Error('Commit quorum failed');"
  },
  {
    "day": 10,
    "title": "Two-Phase Commit (2PC) vs Three-Phase Commit (3PC)",
    "desc": "Coordinate atomic multi-database transactions with Two-Phase Commit (Prepare $\\to$ Commit) and understand coordinator blocking failure modes.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Two-Phase Commit (2PC) vs Three-Phase Commit (3PC).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Two-Phase Commit (2PC) Distributed Transaction Coordinator",
    "eDesc": "Implement function execute2PC(cohorts) coordinating Phase 1: Prepare (Vote YES/NO) and Phase 2: Global Commit or Global Abort. Use these exact values: `txStatus`: 'GLOBAL_ABORTED'.",
    "eStarter": "async function execute2PC(cohorts) {\n  // TODO: write your code here\n}",
    "eHint": "If all cohorts vote VOTE_COMMIT then commit, else abort all.",
    "eTest": "const c1 = { prepare: async () => 'VOTE_COMMIT', commit: async () => 'OK', abort: async () => 'OK' };\nconst c2 = { prepare: async () => 'VOTE_ABORT', commit: async () => 'OK', abort: async () => 'OK' };\nawait execute2PC([c1, c2]).then(res => {\n  if (res.txStatus !== 'GLOBAL_ABORTED') throw new Error('2PC must abort when 1 cohort votes abort');\n});",
    "aTitle": "2PC Vote Counter",
    "aDesc": "Implement function countVotes(votes) returning counts of commit and abort votes. Votes are 'VOTE_COMMIT' or 'VOTE_ABORT'; return { commit, abort }.",
    "aStarter": "function countVotes(v) {\n  // TODO: write your code here\n}",
    "aHint": "Filter commit and abort.",
    "aTest": "const c1 = countVotes(['VOTE_COMMIT', 'VOTE_ABORT']);\nif (c1.commit !== 1 || c1.abort !== 1) throw new Error('Vote count failed for 1 commit, 1 abort');\nconst c2 = countVotes(['VOTE_COMMIT', 'VOTE_COMMIT', 'VOTE_COMMIT']);\nif (c2.commit !== 3 || c2.abort !== 0) throw new Error('Vote count failed for 3 commits');\nconst c3 = countVotes(['VOTE_ABORT', 'VOTE_ABORT']);\nif (c3.commit !== 0 || c3.abort !== 2) throw new Error('Vote count failed for 2 aborts');"
  },
  {
    "day": 11,
    "title": "The Saga Pattern: Orchestration vs Choreography & Compensating Actions",
    "desc": "Execute long-running distributed microservice transactions without 2PC blocking locks using Sagas and backward Compensating Transactions.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of The Saga Pattern: Orchestration vs Choreography & Compensating Actions.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Saga Orchestrator with Backward Compensating Rollback",
    "eDesc": "Implement function executeSagaOrchestrator(sagaSteps) executing forward actions and running compensating actions in reverse order on failure. Use these exact values: `status`: 'SAGA_FAILED_COMPENSATED'.",
    "eStarter": "async function executeSagaOrchestrator(steps) {\n  // TODO: write your code here\n}",
    "eHint": "Execute actions sequentially; on catch loop completed in reverse calling compensate().",
    "eTest": "let compensated = [];\nconst steps = [\n  { name: 'ReserveCredit', action: async () => true, compensate: async () => compensated.push('Credit') },\n  { name: 'ReserveInventory', action: async () => { throw new Error('OUT_OF_STOCK'); }, compensate: async () => compensated.push('Inventory') }\n];\nawait executeSagaOrchestrator(steps).then(res => {\n  if (res.status !== 'SAGA_FAILED_COMPENSATED' || compensated[0] !== 'Credit') throw new Error('Saga backward compensation failed');\n});",
    "aTitle": "Saga Step Status Formatter",
    "aDesc": "Implement function formatSagaLog(stepName, status) returning `[SAGA]: ${stepName} -> ${status}`.",
    "aStarter": "function formatSagaLog(n, s) {\n  // TODO: write your code here\n}",
    "aHint": "Format log string.",
    "aTest": "if (formatSagaLog('Payment', 'DONE') !== '[SAGA]: Payment -> DONE') throw new Error('Saga log format failed for Payment');\nif (formatSagaLog('Inventory', 'RESERVED') !== '[SAGA]: Inventory -> RESERVED') throw new Error('Saga log format failed for Inventory');\nif (formatSagaLog('Shipping', 'FAILED') !== '[SAGA]: Shipping -> FAILED') throw new Error('Saga log format failed for Shipping');"
  },
  {
    "day": 12,
    "title": "Event-Driven Messaging: Kafka Partitions & Consumer Group Rebalancing",
    "desc": "Scale streaming event throughput with Apache Kafka topic partitioning, consumer group rebalances, and partition key hashing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Event-Driven Messaging: Kafka Partitions & Consumer Group Rebalancing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Kafka Partition Router & Consumer Rebalance Allocator",
    "eDesc": "Implement function assignPartitionsToConsumers(numPartitions, consumerIds) evenly assigning partition IDs across active consumers.",
    "eStarter": "function assignPartitionsToConsumers(partitions, consumers) {\n  // TODO: write your code here\n}",
    "eHint": "Assign partition p to consumers[p % consumers.length].",
    "eTest": "const res1 = assignPartitionsToConsumers(6, ['c1', 'c2', 'c3']);\nif (res1.c1.length !== 2 || res1.c2.length !== 2 || res1.c3.length !== 2) throw new Error('Kafka rebalance 6:3 failed');\nif (res1.c1[0] !== 0 || res1.c1[1] !== 3) throw new Error('Round-robin order incorrect for 6:3');\nconst res2 = assignPartitionsToConsumers(4, ['c1', 'c2']);\nif (res2.c1.length !== 2 || res2.c2.length !== 2 || res2.c1[0] !== 0 || res2.c1[1] !== 2) throw new Error('Kafka rebalance 4:2 failed');\nconst res3 = assignPartitionsToConsumers(3, ['c1']);\nif (res3.c1.length !== 3 || JSON.stringify(res3.c1) !== JSON.stringify([0, 1, 2])) throw new Error('Kafka rebalance 3:1 failed');",
    "aTitle": "Partition Key Hash Router",
    "aDesc": "Implement function routeToPartition(key, totalPartitions) returning `hash(key) % total`.",
    "aStarter": "function routeToPartition(k, total) {\n  // TODO: write your code here\n}",
    "aHint": "Compute abs(hash) % total.",
    "aTest": "const p = routeToPartition('order_101', 4);\nif (!Number.isInteger(p) || p < 0 || p >= 4) throw new Error('Partition routing out of range');\nif (routeToPartition('order_101', 4) !== p) throw new Error('The same key must always go to the same partition');\nconst used = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((k) => routeToPartition('order_' + k, 4)));\nif (used.size < 2) throw new Error('Different keys must spread over more than one partition');"
  },
  {
    "day": 13,
    "title": "Message Delivery Guarantees: At-Least-Once, At-Most-Once & Exactly-Once Idempotency",
    "desc": "Eliminate duplicate side-effects over at-least-once messaging queues using Idempotency Keys (SHA-256 hash in Redis) and transactional outbox.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Message Delivery Guarantees: At-Least-Once, At-Most-Once & Exactly-Once Idempotency.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Idempotent Message Handler with SHA-256 Hash Deduplication",
    "eDesc": "Implement function processIdempotentMessage(messageId, payloadHash, idempotencyStore, processFn) ensuring handler executes at most once per key.",
    "eStarter": "async function processIdempotentMessage(msgId, hash, store, fn) {\n  // TODO: write your code here\n}",
    "eHint": "Check store[key]; if present return duplicate: true, else execute and save result.",
    "eTest": "const store = {};\nlet processed = 0;\nconst mockFn = async () => { processed++; return { paymentId: 'pay_9981' }; };\nconst r1 = await processIdempotentMessage('msg_1', 'hashA', store, mockFn);\nif (!r1 || r1.duplicate !== false || !r1.result || r1.result.paymentId !== 'pay_9981') throw new Error('The first message must run and return { duplicate: false, result }');\nconst r2 = await processIdempotentMessage('msg_1', 'hashA', store, mockFn);\nif (processed !== 1 || !r2 || !r2.duplicate) throw new Error('Duplicate message was executed more than once');",
    "aTitle": "Idempotency Key Generator",
    "aDesc": "Implement function generateIdempotencyKey(userId, orderId) returning `idemp_${userId}_${orderId}`.",
    "aStarter": "function generateIdempotencyKey(u, o) {\n  // TODO: write your code here\n}",
    "aHint": "Format key string.",
    "aTest": "if (generateIdempotencyKey('u1', 'o99') !== 'idemp_u1_o99') throw new Error('Key generator failed for u1, o99');\nif (generateIdempotencyKey('u42', 'ord_500') !== 'idemp_u42_ord_500') throw new Error('Key generator failed for u42, ord_500');\nif (generateIdempotencyKey('usr_alpha', 'txn_beta') !== 'idemp_usr_alpha_txn_beta') throw new Error('Key generator failed for alpha, beta');"
  },
  {
    "day": 14,
    "title": "Dead Letter Queues (DLQ), Exponential Backoff & Poison Pill Handling",
    "desc": "Isolate malformed poison-pill messages into Dead Letter Queues (DLQs) after max retries with exponential backoff.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Dead Letter Queues (DLQ), Exponential Backoff & Poison Pill Handling.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Dead Letter Queue (DLQ) Pipeline Router",
    "eDesc": "Implement function handleQueueMessage(message, maxAttempts = 3, dlqQueue, processFn) routing to DLQ after exceeding max retry attempts. Use these exact values: `status`: 'ROUTED_TO_DEAD_LETTER_QUEUE'.",
    "eStarter": "async function handleQueueMessage(msg, maxAttempts = 3, dlq, fn) {\n  // TODO: write your code here\n}",
    "eHint": "Catch error, increment retryCount, if >= maxAttempts push to dlq.",
    "eTest": "const dlq = [];\nconst poisonPill = { id: 'msg_bad', payload: 'corrupt', retryCount: 2 };\nconst failFn = async () => { throw new Error('JSON_PARSE_ERROR'); };\nawait handleQueueMessage(poisonPill, 3, dlq, failFn).then(res => {\n  if (res.status !== 'ROUTED_TO_DEAD_LETTER_QUEUE' || dlq.length !== 1) throw new Error('Poison pill failed to route to DLQ');\n});",
    "aTitle": "DLQ Message Formatter",
    "aDesc": "Implement function formatDlqEntry(msgId, err) returning formatted DLQ object.",
    "aStarter": "function formatDlqEntry(id, e) {\n  // TODO: write your code here\n}",
    "aHint": "Return formatted object.",
    "aTest": "const e1 = formatDlqEntry('m1', 'timeout');\nif (e1.msgId !== 'm1' || e1.error !== 'timeout' || typeof e1.dlqTimestamp !== 'number') throw new Error('DLQ format failed for m1');\nconst e2 = formatDlqEntry('m99', 'schema_invalid');\nif (e2.msgId !== 'm99' || e2.error !== 'schema_invalid') throw new Error('DLQ format failed for m99');\nconst e3 = formatDlqEntry('m1000', 'corrupted_payload');\nif (e3.msgId !== 'm1000' || e3.error !== 'corrupted_payload') throw new Error('DLQ format failed for m1000');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys",
    "desc": "Milestone 2: Build a production distributed event-driven engine: Kafka message consumer, Idempotent deduplication, Saga orchestrator with backward compensation rollbacks, and DLQ poison-pill isolation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Resilient Distributed Transaction Engine",
    "eDesc": "Implement function runDistributedTransaction(event, idempotencyStore, sagaSteps, dlq) executing end-to-end event transaction workflow. Use these exact values: `status`: 'TRANSACTION_SUCCESSFULLY_COMMITTED'.",
    "eStarter": "async function runDistributedTransaction(event, store, steps, dlq) {\n  // TODO: write your code here\n}",
    "eHint": "Check idempotency -> run saga -> on failure compensate and DLQ -> commit.",
    "eTest": "const store = {};\nconst dlq = [];\nconst steps = [{ execute: async () => true, compensate: async () => true }];\nawait runDistributedTransaction({ idempotencyKey: 'tx_101' }, store, steps, dlq).then(res => {\n  if (res.status !== 'TRANSACTION_SUCCESSFULLY_COMMITTED' || store.tx_101 !== 'COMMITTED') throw new Error('Distributed transaction milestone failed');\n});",
    "aTitle": "Transaction Duration Timer",
    "aDesc": "Implement function measureTxDuration(startMs) returning elapsed ms.",
    "aStarter": "function measureTxDuration(s) {\n  // TODO: write your code here\n}",
    "aHint": "Compute elapsed ms.",
    "aTest": "const now = Date.now();\nconst d1 = measureTxDuration(now - 150);\nconst n1 = parseInt(d1);\nif (!d1.endsWith('ms') || n1 < 140 || n1 > 1000) throw new Error('Timer failed for 150ms');\nconst d2 = measureTxDuration(now - 500);\nconst n2 = parseInt(d2);\nif (!d2.endsWith('ms') || n2 < 480 || n2 > 1500) throw new Error('Timer failed for 500ms');\nconst d3 = measureTxDuration(now - 50);\nconst n3 = parseInt(d3);\nif (!d3.endsWith('ms') || n3 < 40 || n3 > 500) throw new Error('Timer failed for 50ms');\nif (d1 === d2 || d2 === d3) throw new Error('Durations must differ for different start timestamps');"
  },
  {
    "day": 16,
    "title": "Physical Clocks, NTP Drift, Lamport Timestamps & Vector Clocks",
    "desc": "Capture causal event ordering across nodes without physical clock synchronization using Lamport Timestamps and Vector Clocks.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Physical Clocks, NTP Drift, Lamport Timestamps & Vector Clocks.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Vector Clock Causality Matrix & Concurrent Conflict Detector",
    "eDesc": "Implement function compareVectorClocks(clockA, clockB) determining if Clock A happened before Clock B, after Clock B, or if they are Concurrent Conflicts. Use these exact values: compareVectorClocks() returns 'B_HAPPENED_BEFORE_A' or 'CONCURRENT_CONFLICT' (whichever fits the case).",
    "eStarter": "function compareVectorClocks(vA, vB) {\n  // TODO: write your code here\n}",
    "eHint": "Compare all keys: if both aGreater and bGreater are true, events are concurrent.",
    "eTest": "const v1 = { N1: 2, N2: 1 };\nconst v2 = { N1: 2, N2: 2 };\nconst v3 = { N1: 3, N2: 0 };\nif (compareVectorClocks(v1, v2) !== 'B_HAPPENED_BEFORE_A') throw new Error('Causality ordering failed');\nif (compareVectorClocks(v2, v3) !== 'CONCURRENT_CONFLICT') throw new Error('Concurrent conflict went undetected');",
    "aTitle": "Lamport Timestamp Advancer",
    "aDesc": "Implement function advanceLamportClock(localClock, receivedClock) returning `max(local, received) + 1`.",
    "aStarter": "function advanceLamportClock(l, r) {\n  // TODO: write your code here\n}",
    "aHint": "Compute max(l, r) + 1.",
    "aTest": "if (advanceLamportClock(3, 7) !== 8) throw new Error('Lamport clock advance failed');"
  },
  {
    "day": 17,
    "title": "Conflict-Free Replicated Data Types (CRDTs): G-Counter, PN-Counter & LWW-Set",
    "desc": "Replicate collaborative data across disconnected nodes with guaranteed convergence using CRDTs (State-based PN-Counters and LWW-Registers).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Conflict-Free Replicated Data Types (CRDTs): G-Counter, PN-Counter & LWW-Set.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "PN-Counter (Positive-Negative) CRDT State Merger",
    "eDesc": "Implement class PNCounter with increment(nodeId, val), decrement(nodeId, val), value(), and merge(otherCounter) taking pairwise max.",
    "eStarter": "class PNCounter {\n  constructor(nodeId) {\n    this.nodeId = nodeId;\n    this.P = {}; // Positive increments\n    this.N = {}; // Negative decrements\n  }\n  increment(v = 1) {\n    // TODO: write your code here\n  }\n  decrement(v = 1) {\n    // TODO: write your code here\n  }\n  value() {\n    // TODO: write your code here\n  }\n  merge(other) {\n    // TODO: write your code here\n  }\n}",
    "eHint": "In merge() take Math.max(this[k], other[k]) for both P and N maps.",
    "eTest": "const cA = new PNCounter('nodeA');\nconst cB = new PNCounter('nodeB');\ncA.increment(10);\ncB.decrement(3);\ncA.merge(cB);\nif (cA.value() !== 7) throw new Error(`CRDT PN-Counter merge failed: expected 7, got ${cA.value()}`);",
    "aTitle": "LWW-Register Resolver",
    "aDesc": "Implement function resolveLwwRegister(regA, regB) returning value with highest timestamp.",
    "aStarter": "function resolveLwwRegister(a, b) {\n  // TODO: write your code here\n}",
    "aHint": "Compare timestamps.",
    "aTest": "if (resolveLwwRegister({ val: 'old', ts: 100 }, { val: 'new', ts: 200 }) !== 'new') throw new Error('LWW failed');"
  },
  {
    "day": 18,
    "title": "Database Sharding Strategies: Range, Hash & Directory Sharding",
    "desc": "Partition massive database tables across multi-terabyte clusters with Hash Sharding, Range Sharding, and Directory Sharding lookup tables.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Database Sharding Strategies: Range, Hash & Directory Sharding.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Directory-Based Database Shard Router",
    "eDesc": "Implement function getShardForCustomer(customerId, shardDirectory, defaultShard = 'shard_0') returning assigned database shard connection string.",
    "eStarter": "function getShardForCustomer(custId, directory, defaultShard = 'shard_0') {\n  // TODO: write your code here\n}",
    "eHint": "Check directory first, else compute hash modulo total shards.",
    "eTest": "const dir = { enterprise_client_1: 'shard_dedicated_enterprise' };\nif (getShardForCustomer('enterprise_client_1', dir) !== 'shard_dedicated_enterprise') throw new Error('Directory shard lookup failed');\nif (!getShardForCustomer('regular_client_2', dir).startsWith('shard_')) throw new Error('Hash fallback shard failed');",
    "aTitle": "Range Shard Evaluator",
    "aDesc": "Implement function getRangeShard(userId) returning shard based on user ID ranges (e.g. 0-1000 -> shard_1).",
    "aStarter": "function getRangeShard(id) {\n  // TODO: write your code here\n}",
    "aHint": "Check ID range.",
    "aTest": "if (getRangeShard(500) !== 'shard_1' || getRangeShard(1500) !== 'shard_2') throw new Error('Range shard failed');"
  },
  {
    "day": 19,
    "title": "Read Replicas, Replication Lag & Read-Your-Own-Writes Consistency",
    "desc": "Scale database read throughput with Read Replicas while preventing stale data glitches using Read-Your-Own-Writes session routing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Read Replicas, Replication Lag & Read-Your-Own-Writes Consistency.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Read-Your-Own-Writes Database Connection Router",
    "eDesc": "Implement function routeDatabaseQuery(operation, sessionState, masterDb, replicaDbs) routing writes and recent writes (< 5s) to Master, and stale reads to Replicas. The result must have the field: `target`. Return { target, connection }: target is 'MASTER_DB' for writes and for reads within 5 seconds of the session's last write, otherwise 'READ_REPLICA'.",
    "eStarter": "function routeDatabaseQuery(op, session, master, replicas) {\n  // TODO: write your code here\n}",
    "eHint": "If write or recent write (< 5s) route to master, else route to replica.",
    "eTest": "const session = { lastWriteTimestamp: Date.now() - 1000 };\nconst res = routeDatabaseQuery('READ', session, 'master_conn', ['rep1', 'rep2']);\nif (!res.target.includes('MASTER_DB')) throw new Error('Read-your-writes should route recent write to master');",
    "aTitle": "Replication Lag Alert Checker",
    "aDesc": "Implement function isReplicationLagExceeded(lagSeconds, maxLag = 10) returning true if lag > maxLag.",
    "aStarter": "function isReplicationLagExceeded(lag, max = 10) {\n  // TODO: write your code here\n}",
    "aHint": "Check lag > max.",
    "aTest": "if (isReplicationLagExceeded(15, 10) !== true) throw new Error('Lag alert failed');\nif (isReplicationLagExceeded(5, 10) !== false) throw new Error('5 seconds of lag is under the 10 second limit');"
  },
  {
    "day": 20,
    "title": "Circuit Breakers (Resilience4j / Envoy) & Bulkhead Isolation",
    "desc": "Prevent cascading cluster outages with Circuit Breakers: Closed $\\to$ Open (Fail fast on threshold) $\\to$ Half-Open (Canary test requests) $\\to$ Closed.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Circuit Breakers (Resilience4j / Envoy) & Bulkhead Isolation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Circuit Breaker Three-State Machine",
    "eDesc": "Implement class CircuitBreaker with execute(fn) transitioning across CLOSED, OPEN, and HALF_OPEN states based on failure rates and timeouts. execute(fn) passes on the error when fn fails. After `threshold` failures the state becomes 'OPEN', and while it is open execute throws new Error('CIRCUIT_OPEN_FAST_FAIL') without calling fn.",
    "eStarter": "class CircuitBreaker {\n  constructor(threshold = 3, resetTimeoutMs = 500) {\n    this.state = 'CLOSED';\n    this.failureCount = 0;\n    this.threshold = threshold;\n    this.resetTimeout = resetTimeoutMs;\n    this.lastFailureTime = 0;\n  }\n  async execute(fn) {\n    // TODO: write your code here\n  }\n}",
    "eHint": "Manage CLOSED -> failure threshold -> OPEN -> timeout -> HALF_OPEN -> success -> CLOSED.",
    "eTest": "const cb = new CircuitBreaker(2, 50);\nconst failFn = async () => { throw new Error('SERVICE_DOWN'); };\nfor (let i = 0; i < 2; i++) {\n  let threw = false;\n  try { await cb.execute(failFn); } catch { threw = true; }\n  if (!threw) throw new Error('execute must pass on the error from a failing service');\n}\nif (cb.state !== 'OPEN') throw new Error('Circuit breaker failed to trip to OPEN state');\nlet fast = '';\ntry { await cb.execute(async () => 'ok'); } catch (e) { fast = e && e.message; }\nif (fast !== 'CIRCUIT_OPEN_FAST_FAIL') throw new Error('An open circuit must fail fast with CIRCUIT_OPEN_FAST_FAIL');",
    "aTitle": "Circuit State String Formatter",
    "aDesc": "Implement function formatCircuitStatus(state) returning `[CIRCUIT]: ${state}`.",
    "aStarter": "function formatCircuitStatus(s) {\n  // TODO: write your code here\n}",
    "aHint": "Format status string.",
    "aTest": "if (formatCircuitStatus('OPEN') !== '[CIRCUIT]: OPEN') throw new Error('Circuit format failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway",
    "desc": "Milestone 3: Build a production distributed API Gateway edge: Token Bucket rate limiting in Redis, Circuit Breaker fail-fast trips, Bulkhead concurrent pool isolation, and CORS proxy routing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Resilient Distributed API Gateway Middleware",
    "eDesc": "Implement function handleGatewayRequest(req, rateLimiter, circuitBreaker, backendService) protecting backend from overload and cascading failures. The result must have the field: `httpStatus`.",
    "eStarter": "async function handleGatewayRequest(req, limiter, cb, backend) {\n  // TODO: write your code here\n}",
    "eHint": "Check rate limiter -> run inside circuit breaker -> return 200, 429, or 503.",
    "eTest": "const mockLimiter = { isAllowed: (id) => id === 'client_ok' };\nconst mockCb = { execute: async (fn) => fn() };\nconst mockBackend = { call: async () => ({ status: 'OK' }) };\nawait handleGatewayRequest({ clientId: 'client_bad' }, mockLimiter, mockCb, mockBackend).then(res => {\n  if (res.httpStatus !== 429) throw new Error('Gateway failed to block rate-limited client');\n});",
    "aTitle": "Gateway Latency Tracker",
    "aDesc": "Implement function formatGatewayLatency(ms) returning formatted string.",
    "aStarter": "function formatGatewayLatency(ms) {\n  // TODO: write your code here\n}",
    "aHint": "Format header string.",
    "aTest": "if (formatGatewayLatency(12) !== 'X-Response-Time: 12ms') throw new Error('Latency format failed');"
  },
  {
    "day": 22,
    "title": "Gossip Protocols: SWIM Failure Detection & Cluster Membership",
    "desc": "Discover dynamic cluster nodes and detect crash failures in $O(1)$ time with Gossip protocols (SWIM: Structured Weakly-consistent Infection-style Membership).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Gossip Protocols: SWIM Failure Detection & Cluster Membership.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "SWIM Gossip Protocol Indirect Ping Failure Detector",
    "eDesc": "Implement function executeSwimPing(targetNodeId, directPingFn, peerNodes) sending direct ping and triggering indirect peer pings on timeout. Use these exact values: `method`: 'INDIRECT_PING_CONSENSUS'. The result must have the field: `nodeStatus`.",
    "eStarter": "async function executeSwimPing(targetId, directPing, peers) {\n  // TODO: write your code here\n}",
    "eHint": "Try directPing; on catch run indirect pings via peers; if all fail mark SUSPECT_FAILED.",
    "eTest": "const mockDirectFail = async () => { throw new Error('TIMEOUT'); };\nawait executeSwimPing('node_9', mockDirectFail, ['node_1', 'node_2']).then(res => {\n  if (res.nodeStatus !== 'SUSPECT_FAILED' || res.method !== 'INDIRECT_PING_CONSENSUS') throw new Error('SWIM indirect failure detection failed');\n});",
    "aTitle": "Gossip Fanout Counter",
    "aDesc": "Implement function getFanoutPeers(allPeers, k = 3) returning first k peers.",
    "aStarter": "function getFanoutPeers(p, k = 3) {\n  // TODO: write your code here\n}",
    "aHint": "Slice k peers.",
    "aTest": "if (getFanoutPeers(['n1', 'n2', 'n3', 'n4'], 2).length !== 2) throw new Error('Fanout slice failed');"
  },
  {
    "day": 23,
    "title": "Load Balancing Algorithms: Weighted Round-Robin, Least Connections & Consistent Hash Ring",
    "desc": "Balance cluster traffic across heterogeneous backend pools with Weighted Round-Robin, Least Connections, and IP Hash algorithms.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Load Balancing Algorithms: Weighted Round-Robin, Least Connections & Consistent Hash Ring.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Weighted Round-Robin Load Balancer Engine",
    "eDesc": "Implement class WeightedRoundRobinBalancer with addServer(serverId, weight) and getNextServer() distributing requests proportionally to weight.",
    "eStarter": "class WeightedRoundRobinBalancer {\n  constructor() {\n    this.servers = []; // [{ id, weight, currentWeight }]\n  }\n  addServer(id, weight) {\n    // TODO: write your code here\n  }\n  getNextServer() {\n    // TODO: write your code here\n  }\n}",
    "eHint": "Smooth Weighted Round-Robin: add weight to currentWeight, pick max, subtract totalWeight.",
    "eTest": "const lb = new WeightedRoundRobinBalancer();\nlb.addServer('S1', 5); // Weight 5\nlb.addServer('S2', 1); // Weight 1\nconst hits = { S1: 0, S2: 0 };\nfor (let i = 0; i < 6; i++) hits[lb.getNextServer()]++;\nif (hits.S1 !== 5 || hits.S2 !== 1) throw new Error('Weighted round-robin distribution failed: expected 5:1 ratio');",
    "aTitle": "Least Connection Picker",
    "aDesc": "Implement function getLeastLoadedServer(servers) returning server with lowest activeConnections.",
    "aStarter": "function getLeastLoadedServer(s) {\n  // TODO: write your code here\n}",
    "aHint": "Sort by activeConnections.",
    "aTest": "if (getLeastLoadedServer([{ id: 's1', activeConnections: 10 }, { id: 's2', activeConnections: 2 }]) !== 's2') throw new Error('Least loaded failed');"
  },
  {
    "day": 24,
    "title": "Service Discovery & Heartbeat Health Checking (Consul / Zookeeper)",
    "desc": "Register dynamic microservice instances with Service Discovery registries (Consul, Eureka, Zookeeper) and perform active health checking.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Service Discovery & Heartbeat Health Checking (Consul / Zookeeper).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Service Discovery Registry & Health Lease Manager",
    "eDesc": "Implement class ServiceRegistry with register(serviceName, instanceId, url, ttlMs), heartbeat(serviceName, instanceId), and getHealthyInstances(serviceName).",
    "eStarter": "class ServiceRegistry {\n  constructor() {\n    this.services = new Map(); // name -> Map(instanceId, { url, expiresAt })\n  }\n  register(name, id, url, ttlMs = 5000) {\n    // TODO: write your code here\n  }\n  heartbeat(name, id) {\n    // TODO: write your code here\n  }\n  getHealthyInstances(name) {\n    // TODO: write your code here\n  }\n}",
    "eHint": "Store instances with expiresAt; in getHealthyInstances filter expiresAt > now and delete expired.",
    "eTest": "const reg = new ServiceRegistry();\nreg.register('payment-service', 'inst-1', 'http://10.0.0.1:8080', 1000);\nreg.register('payment-service', 'inst-2', 'http://10.0.0.2:8080', 0); // Expired immediately\nconst healthy = reg.getHealthyInstances('payment-service');\nif (healthy.length !== 1 || healthy[0].id !== 'inst-1') throw new Error('Service discovery failed to filter expired unhealthy instance');",
    "aTitle": "Instance URL Formatter",
    "aDesc": "Implement function formatInstanceUrl(ip, port) returning `http://${ip}:${port}`.",
    "aStarter": "function formatInstanceUrl(ip, p) {\n  // TODO: write your code here\n}",
    "aHint": "Format URL string.",
    "aTest": "if (formatInstanceUrl('10.0.0.1', 8080) !== 'http://10.0.0.1:8080') throw new Error('URL format failed');"
  },
  {
    "day": 25,
    "title": "API Gateways & Backend-For-Frontend (BFF) Pattern",
    "desc": "Aggregate backend microservices with Backend-For-Frontend (BFF) gateways: response stitching, protocol translation (gRPC to JSON), and CORS handling.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of API Gateways & Backend-For-Frontend (BFF) Pattern.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "BFF Response Aggregator & Composite Payload Stitcher",
    "eDesc": "Implement function aggregateBffProfile(userId, userService, orderService, reviewService) querying microservices in parallel and stitching unified payload. The result must have these fields: `recentOrdersCount`, `totalReviews`.",
    "eStarter": "async function aggregateBffProfile(userId, userSvc, orderSvc, reviewSvc) {\n  // TODO: write your code here\n}",
    "eHint": "Use Promise.all to fetch user, orders, and reviews concurrently and stitch into 1 object.",
    "eTest": "const uSvc = { getUser: async (id) => ({ id, name: 'Alice' }) };\nconst oSvc = { getRecentOrders: async () => [{ id: 'o1' }, { id: 'o2' }] };\nconst rSvc = { getUserReviews: async () => [{ id: 'r1' }] };\nawait aggregateBffProfile('u_101', uSvc, oSvc, rSvc).then(res => {\n  if (res.name !== 'Alice' || res.recentOrdersCount !== 2 || res.totalReviews !== 1) throw new Error('BFF response stitching failed');\n});",
    "aTitle": "CORS Header Builder",
    "aDesc": "Implement function getCorsHeaders(origin) returning standard CORS headers object.",
    "aStarter": "function getCorsHeaders(o) {\n  // TODO: write your code here\n}",
    "aHint": "Return CORS headers.",
    "aTest": "if (getCorsHeaders('*')['Access-Control-Allow-Origin'] !== '*') throw new Error('CORS header failed');"
  },
  {
    "day": 26,
    "title": "Distributed Tracing: OpenTelemetry, W3C TraceContext & Span Propagation",
    "desc": "Trace distributed requests across microservice boundaries with OpenTelemetry, W3C `traceparent` headers, spans, and child contextual linking.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Distributed Tracing: OpenTelemetry, W3C TraceContext & Span Propagation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "W3C TraceContext Header Parser & Span Propagator",
    "eDesc": "Implement function createChildSpan(traceparentHeader, newSpanName) parsing W3C `00-${traceId}-${parentId}-${flags}` and generating child span. The result must have the field: `parentSpanId`.",
    "eStarter": "function createChildSpan(traceparent, spanName) {\n  // TODO: write your code here\n}",
    "eHint": "Parse traceparent parts, retain traceId, generate new spanId, format outgoing traceparent.",
    "eTest": "const incoming = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';\nconst child = createChildSpan(incoming, 'db_query');\nif (child.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736') throw new Error('Distributed traceId was not propagated to child span');\nif (child.parentSpanId !== '00f067aa0ba902b7') throw new Error('Parent span ID mismatch');",
    "aTitle": "Traceparent Validator",
    "aDesc": "Implement function isValidTraceparent(h) checking `00-32hex-16hex-01` format.",
    "aStarter": "function isValidTraceparent(h) {\n  // TODO: write your code here\n}",
    "aHint": "Test with regex.",
    "aTest": "if (isValidTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01') !== true) throw new Error('Validation failed');\nif (isValidTraceparent('00-short-01') !== false) throw new Error('A malformed traceparent must be rejected');"
  },
  {
    "day": 27,
    "title": "Data Consistency Models: Linearizable vs Sequential vs Eventual Consistency",
    "desc": "Master consistency levels: Linearizability (Strict real-time global ordering), Sequential Consistency, and Eventual Consistency.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Data Consistency Models: Linearizable vs Sequential vs Eventual Consistency.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Linearizability vs Eventual Consistency Audit Validator",
    "eDesc": "Implement function auditConsistencyModel(readEvents, writeEvents) verifying whether reads observe strictly newer global timestamps. The result must have the field: `isLinearizable`.",
    "eStarter": "function auditConsistencyModel(reads, writes) {\n  // TODO: write your code here\n}",
    "eHint": "Check if reads after write completion observe the latest written value.",
    "eTest": "const writes = [{ value: 'v1', completedAt: 100 }, { value: 'v2', completedAt: 200 }];\nconst goodReads = [{ startedAt: 250, observedValue: 'v2' }];\nconst staleReads = [{ startedAt: 250, observedValue: 'v1' }];\nif (auditConsistencyModel(goodReads, writes).isLinearizable !== true) throw new Error('Fresh read failed linearizability check');\nif (auditConsistencyModel(staleReads, writes).isLinearizable !== false) throw new Error('Stale read falsely passed linearizability check');",
    "aTitle": "Consistency Model Classifier",
    "aDesc": "Implement function getConsistencyLevel(mode) returning description.",
    "aStarter": "function getConsistencyLevel(m) {\n  // TODO: write your code here\n}",
    "aHint": "Return description.",
    "aTest": "if (!getConsistencyLevel('STRONG').includes('Linearizable')) throw new Error('Level check failed');"
  },
  {
    "day": 28,
    "title": "Reverse Proxies & CDN Edge Caching with Cache-Control Invalidation",
    "desc": "Cache high-throughput assets globally with CDNs (Cloudflare, CloudFront, NGINX), `stale-while-revalidate`, and surrogate key invalidations.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Reverse Proxies & CDN Edge Caching with Cache-Control Invalidation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "HTTP Cache-Control & Stale-While-Revalidate Evaluator",
    "eDesc": "Implement function evaluateEdgeCache(cacheControlHeader, ageSeconds) determining if asset is FRESH, STALE_REVALIDATING, or EXPIRED. Use these exact values: `status`: 'CACHE_HIT_FRESH' or 'CACHE_HIT_STALE_WHILE_REVALIDATING' or 'CACHE_MISS_EXPIRED' (whichever fits the case).",
    "eStarter": "function evaluateEdgeCache(header, age) {\n  // TODO: write your code here\n}",
    "eHint": "Check age <= maxAge (FRESH), age <= maxAge + swr (STALE_REVALIDATE), else EXPIRED.",
    "eTest": "const header = 'public, max-age=60, stale-while-revalidate=30';\nif (evaluateEdgeCache(header, 30).status !== 'CACHE_HIT_FRESH') throw new Error('Fresh cache check failed');\nif (evaluateEdgeCache(header, 75).status !== 'CACHE_HIT_STALE_WHILE_REVALIDATING') throw new Error('SWR check failed');\nif (evaluateEdgeCache(header, 100).status !== 'CACHE_MISS_EXPIRED') throw new Error('Expired check failed');",
    "aTitle": "Surrogate Key Header Formatter",
    "aDesc": "Implement function formatSurrogateKeys(keys) returning `Surrogate-Key: ${keys.join(' ')}`.",
    "aStarter": "function formatSurrogateKeys(k) {\n  // TODO: write your code here\n}",
    "aHint": "Join keys with space.",
    "aTest": "if (formatSurrogateKeys(['k1', 'k2']) !== 'Surrogate-Key: k1 k2') throw new Error('Surrogate key failed');"
  },
  {
    "day": 29,
    "title": "Disaster Recovery: Multi-Region Active-Passive vs Active-Active Deployments",
    "desc": "Architect multi-region failover (RPO: Recovery Point Objective & RTO: Recovery Time Objective) with DNS Anycast, DynamoDB Global Tables, and Aurora Multi-Region.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Disaster Recovery: Multi-Region Active-Passive vs Active-Active Deployments.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Multi-Region Disaster Recovery RPO & RTO Calculator",
    "eDesc": "Implement function calculateDrCompliance(actualRpoMinutes, actualRtoMinutes, targetRpo, targetRto) verifying SLA compliance. Use these exact values: `grade`: 'DR_TIER_1_CERTIFIED'; `rpoStatus`: 'RPO_SLA_BREACHED'. The result must have the field: `isCompliant`.",
    "eStarter": "function calculateDrCompliance(actualRpo, actualRto, targetRpo, targetRto) {\n  // TODO: write your code here\n}",
    "eHint": "Check actualRpo <= targetRpo and actualRto <= targetRto.",
    "eTest": "const res = calculateDrCompliance(2, 5, 5, 15);\nif (!res.isCompliant || res.grade !== 'DR_TIER_1_CERTIFIED') throw new Error('DR compliance calculation failed');\nconst breach = calculateDrCompliance(10, 5, 5, 15);\nif (breach.isCompliant || breach.rpoStatus !== 'RPO_SLA_BREACHED') throw new Error('RPO breach went undetected');",
    "aTitle": "RTO Formatter",
    "aDesc": "Implement function formatRto(minutes) returning `${minutes} min RTO`.",
    "aStarter": "function formatRto(m) {\n  // TODO: write your code here\n}",
    "aHint": "Format string.",
    "aTest": "if (formatRto(15) !== '15 min RTO') throw new Error('RTO format failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Global Real-Time Financial Trading & Ledger Exchange Engine",
    "desc": "Final Capstone Synthesis: The complete distributed trading and financial ledger engine: Consistent Hashing partition routing, Raft consensus order replication, Saga rollback orchestrator, Monotonic Fencing Tokens, Singleflight Caching, and OpenTelemetry distributed tracing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Enterprise Global Real-Time Financial Trading & Ledger Exchange Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Capstone Financial Ledger Exchange Engine",
    "eDesc": "Implement function executeGlobalTradeTransaction(orderPayload, exchangeServices) orchestrating rate limiting, lock acquisition with fencing tokens, consensus replication, and ledger persistence. Use these exact values: `tradeStatus`: 'EXECUTED_AND_COMMITTED'.",
    "eStarter": "async function executeGlobalTradeTransaction(order, services) {\n  // TODO: write your code here\n}",
    "eHint": "Check rate limit -> acquire lock -> replicate consensus -> commit ledger -> release lock.",
    "eTest": "const services = {\n  rateLimiter: { isAllowed: () => true },\n  lockManager: { acquire: async () => ({ success: true, lockId: 'l1', fencingToken: 42 }), release: async () => true },\n  consensus: { replicate: async () => true },\n  ledger: { commit: async (o) => ({ id: 'rec_9981' }) }\n};\nawait executeGlobalTradeTransaction({ accountId: 'acc_1', orderId: 'ord_1', amount: 500 }, services).then(res => {\n  if (!res.success || res.tradeStatus !== 'EXECUTED_AND_COMMITTED' || res.fencingToken !== 42) throw new Error('Capstone financial trading exchange engine failed');\n});",
    "aTitle": "Capstone Distributed Systems Certification Auditor",
    "aDesc": "Implement function auditDistributedCapstoneStatus() returning certification grade. The result must have the field: `certified`.",
    "aStarter": "function auditDistributedCapstoneStatus() {\n  // TODO: write your code here\n}",
    "aHint": "Return certification object.",
    "aTest": "if (auditDistributedCapstoneStatus().certified !== true) throw new Error('Capstone audit failed');"
  }
];

export const DISTRIBUTED_30_DAYS_QUESTS: CourseQuest[] = DISTRIBUTED_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('dist', idx + 1, cfg)
);
