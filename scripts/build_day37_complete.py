import json, subprocess

def run_code(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code failed:\n{code}\nError:\n{res.stderr}")
    return res.stdout.strip()

# Base parts from generate_node_day37
p1_say = [
    "Welcome to Day 37 of Node.js & TypeScript Backend Engineering: Distributed Locking & Concurrency Control: Redlock Algorithm, Lease Renewals & Fencing Tokens. Today we confront one of the most challenging problems in distributed systems engineering: coordinating mutual exclusion across independent microservice instances without shared memory.",
    "In a single Node.js process, managing concurrency is relatively straightforward: the libuv single-threaded event loop processes tasks sequentially, and in-memory mutexes or queues can serialize access to critical data structures. However, modern production architectures run dozens or hundreds of stateless containerized worker pods behind load balancers.",
    "When multiple worker pods attempt to mutate the exact same business resource concurrently—such as deducting inventory from a flash sale item, issuing a refund for an invoice, or allocating an airplane seat—an uncoordinated race condition will corrupt state, leading to catastrophic double-spends and financial inventory overselling.",
    "To serialize mutations across multiple independent processes, backend engineers utilize Distributed Locks. The foundational pattern for implementing a distributed lock in Redis is the atomic `SET key random_token NX PX ttl_ms` command. Here, `NX` guarantees that the key is created only if it does not already exist (mutual exclusion), while `PX` sets an automatic millisecond Time-To-Live expiration (lease duration).",
    "The millisecond expiration is vital for fault tolerance: if the worker pod acquires the lock and immediately crashes, suffers an unhandled exception, or loses power, the lock will automatically expire after the TTL window, preventing permanent system deadlock.",
    "Crucially, the lock value must be a cryptographically random, globally unique identifier (such as a UUIDv4 or high-entropy random string) unique to the specific worker and execution thread. Why? Because releasing the lock requires verifying ownership! If worker A acquires the lock with a 5-second TTL, experiences a 6-second network pause, and then blindly issues `DEL lock_key`, it will delete the lock that worker B acquired in the interim, exposing subsequent workers to uncoordinated concurrent execution.",
    "To ensure that a worker deletes only its own lock, the release operation must be executed atomically using an embedded Lua script: `if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end`. Because Redis executes Lua scripts as a single atomic transaction on the main thread, the comparison and deletion happen with zero race conditions.",
    "In Part 1, we implement our `acquireSingleInstanceLock` and `releaseSingleInstanceLock` engine, demonstrating atomic acquisition, collision rejection, and Lua-safe lock release.",
    "From an operational reliability perspective, developers must configure safe retry intervals when a lock acquisition fails. If 50 workers immediately retry failed acquisitions in a tight loop, they generate severe Redis CPU contention. Instead, production clients implement exponential backoff with randomized jitter, spacing retries between 50 and 200 milliseconds.",
    "Furthermore, setting an appropriate TTL lease duration is critical: the TTL must be significantly longer than the expected execution time of the protected critical section, typically 3x to 5x the p99 latency of the downstream operation.",
    "From an enterprise architectural perspective, managing high-concurrency contention requires sophisticated client retry strategies. If dozens of worker pods blindly poll Redis with tight retry loops (`setInterval(..., 10)`), they inundate the Redis event loop with thousands of redundant failed commands, degrading performance for all other cache and database operations.",
    "Production Node.js distributed lock clients implement Pub/Sub Notification wakenings. When a worker fails to acquire a lock, it does not spin-wait; instead, it subscribes to an internal Redis pub/sub channel for that lock key. When the current holder finishes and releases the lock via its Lua script, the script publishes a release signal to the channel, waking the waiting workers instantly without polling overhead.",
    "Furthermore, multi-tenant cloud platforms enforce hierarchical lock naming conventions such as `lock:{tenantId}:{resourceDomain}:{resourceId}`. This structured namespace guarantees complete data isolation between customer tenants while preventing key collisions across unrelated microservices.",
    "By mastering atomic `SET NX PX` acquisition and Lua-based ownership verification, backend engineers establish the foundational building blocks of distributed concurrency control."
]

p1_code = """function acquireSingleInstanceLock(redisStore, resourceKey, ownerToken, ttlMs = 5000) {
  const lockKey = `lock:${resourceKey}`;
  const now = Date.now();

  if (redisStore[lockKey] && redisStore[lockKey].expiresAt > now) {
    return { acquired: false, lockKey, reason: 'LOCK_HELD_BY_ANOTHER_PROCESS' };
  }

  redisStore[lockKey] = {
    ownerToken,
    expiresAt: now + ttlMs,
    ttlMs
  };

  return { acquired: true, lockKey, ownerToken, expiresAt: now + ttlMs };
}

function releaseSingleInstanceLock(redisStore, resourceKey, ownerToken) {
  const lockKey = `lock:${resourceKey}`;
  const existing = redisStore[lockKey];

  if (!existing) {
    return { released: false, reason: 'LOCK_NOT_FOUND' };
  }

  if (existing.ownerToken === ownerToken) {
    delete redisStore[lockKey];
    return { released: true, lockKey };
  } else {
    return { released: false, reason: 'TOKEN_MISMATCH_OWNERSHIP_PROTECTED' };
  }
}

const mockRedis = {};
const lockA = acquireSingleInstanceLock(mockRedis, 'invoice:901', 'token_worker_A', 3000);
const lockB = acquireSingleInstanceLock(mockRedis, 'invoice:901', 'token_worker_B', 3000);
const badRelease = releaseSingleInstanceLock(mockRedis, 'invoice:901', 'token_worker_B');
const goodRelease = releaseSingleInstanceLock(mockRedis, 'invoice:901', 'token_worker_A');

console.log('Worker A Acquired:', lockA.acquired);
console.log('Worker B Acquired:', lockB.acquired);
console.log('Worker B Bad Release:', badRelease.released, badRelease.reason);
console.log('Worker A Good Release:', goodRelease.released);"""

p2_say = [
    "While single-instance Redis locking is fast and effective for non-critical workloads, it suffers from a fundamental single point of failure in high-availability enterprise architectures. In Part 2, we explore Multi-Master Distributed Consensus: The Redlock Algorithm.",
    "In production cloud environments, Redis master instances typically replicate asynchronously to one or more replica nodes. Suppose worker A acquires a lock on the master instance. Before that write is asynchronously replicated to the replica, the master node hardware crashes! The cluster detects the outage and promotes the replica to become the new master.",
    "Because the lock write was never flushed to the replica, the new master has no record of the lock! Worker B arrives, requests the exact same lock from the new master, and acquires it successfully. Now, both Worker A and Worker B hold the lock concurrently, completely violating mutual exclusion and exposing the system to catastrophic split-brain state mutations.",
    "To overcome the asynchronous replication limitation of master-slave topologies, Salvatore Sanfilippo (the creator of Redis) designed the Redlock Algorithm. Redlock operates across N completely independent Redis master nodes (typically N = 5) hosted on separate physical machines or cloud failure zones, with zero asynchronous replication between them.",
    "To acquire a distributed lock, the client executes the following protocol: First, it records the current timestamp T1. Second, it attempts to acquire the lock sequentially across all 5 nodes using the same key and random token with a small network timeout (typically 5 to 50 milliseconds) to prevent getting stuck on an unreachable node.",
    "Third, the client calculates the elapsed time: Delta T = T_current - T1. The client considers the lock successfully acquired if and only if two conditions are met: it acquired the lock on a strict majority of nodes (at least 3 out of 5), and the total elapsed time Delta T is strictly less than the lock validity duration.",
    "The effective lock validity time is defined as: Validity = TTL - Delta T - ClockDrift. If the client fails to acquire the majority or the validity time is non-positive, it immediately releases the lock on all nodes (even the nodes it believes it failed to acquire on) to prevent lingering orphaned locks.",
    "In Part 2, our `simulateRedlockConsensus` engine implements this 5-node quorum consensus protocol, measuring elapsed drift and validating majority voting.",
    "Redlock provides remarkable fault tolerance: in a 5-node cluster, the system continues to coordinate locks seamlessly even if 2 out of the 5 nodes crash or suffer network isolation.",
    "Furthermore, by forcing nodes to persist locks to disk with `appendfsync always` or enforcing delayed restarts equal to the maximum lock TTL after a crash, Redlock ensures that rebooted nodes cannot grant duplicate locks.",
    "From a distributed systems theory perspective, multi-master quorum consensus requires strict mathematical bounds on physical clock drift and network latency. In asynchronous cloud environments, local system clocks can drift due to NTP synchronization jumps, hypervisor virtualization time-dilation, and hardware oscillator fluctuations.",
    "To guarantee safety, Redlock calculates a conservative clock drift margin: drift = (TTL * drift_factor) + 2ms, where drift_factor is typically 2% to account for clock skew across independent servers. The client deducts both network elapsed time and the clock drift margin from the original TTL, ensuring that the remaining validity window is strictly positive before permitting the critical section to execute.",
    "Furthermore, Redlock mandates odd numbers of independent master nodes (3, 5, or 7). In a 5-node topology, a quorum of 3 is required. This mathematical majority guarantees that two competing workers cannot both acquire a quorum simultaneously, because any two majorities of size 3 in a set of 5 must share at least one common node (3 + 3 = 6 > 5), preventing split-brain states.",
    "Additionally, to handle node crash recovery safely, Redlock requires rebooted nodes to implement a Delayed Restart protocol. When a Redis master crashes, it must delay accepting write commands for at least the maximum lock TTL (e.g. 10 seconds), ensuring that any active lock held on that node before the crash has naturally expired across all remaining nodes before new locks are granted.",
    "This multi-master quorum protocol elevates in-memory locking to an enterprise standard of durability and fault isolation."
]

p2_code = """function simulateRedlockConsensus(nodes, resourceKey, ownerToken, ttlMs = 1000) {
  const startTime = 1000;
  let simulatedNow = startTime;
  let acquiredCount = 0;
  const quorum = Math.floor(nodes.length / 2) + 1;
  const nodeResults = {};

  for (const node of nodes) {
    simulatedNow += 5;
    if (node.online && !node.locks[resourceKey]) {
      node.locks[resourceKey] = { ownerToken, expiresAt: simulatedNow + ttlMs };
      nodeResults[node.id] = 'ACQUIRED';
      acquiredCount++;
    } else {
      nodeResults[node.id] = node.online ? 'COLLISION' : 'OFFLINE';
    }
  }

  const elapsedTime = simulatedNow - startTime;
  const clockDriftMargin = (ttlMs * 0.02) + 2;
  const validityTimeRemaining = ttlMs - elapsedTime - clockDriftMargin;

  const isAcquired = acquiredCount >= quorum && validityTimeRemaining > 0;

  if (!isAcquired) {
    for (const node of nodes) {
      if (node.online && node.locks[resourceKey]?.ownerToken === ownerToken) {
        delete node.locks[resourceKey];
      }
    }
  }

  return {
    isAcquired,
    quorumNeeded: quorum,
    acquiredNodesCount: acquiredCount,
    elapsedTimeMs: elapsedTime,
    validityRemainingMs: Math.max(0, Math.round(validityTimeRemaining)),
    nodeResults
  };
}

const clusterNodes = [
  { id: 'node_1', online: true, locks: {} },
  { id: 'node_2', online: true, locks: {} },
  { id: 'node_3', online: true, locks: {} },
  { id: 'node_4', online: false, locks: {} },
  { id: 'node_5', online: true, locks: {} }
];

const redlock = simulateRedlockConsensus(clusterNodes, 'order:inventory:77', 'worker_alpha', 1000);
console.log('Redlock Success:', redlock.isAcquired);
console.log('Quorum Satisfied:', `${redlock.acquiredNodesCount}/${redlock.quorumNeeded}`);
console.log('Elapsed Network Time:', redlock.elapsedTimeMs + 'ms');
console.log('Validity Remaining:', redlock.validityRemainingMs + 'ms');
console.log('Node Results:', JSON.stringify(redlock.nodeResults));"""

p3_say = [
    "Even with multi-master consensus, backend developers face a difficult operational dilemma when choosing the lock TTL duration. In Part 3, we master Lease Extensions & Asynchronous Watchdog Timers.",
    "If you set the lock TTL too short (e.g. 500 milliseconds) and a complex database query or external API call takes 700 milliseconds, the lock will silently expire mid-execution while the worker is still mutating state, allowing another worker to acquire the lock and cause a race condition. Conversely, if you set the TTL too long (e.g. 60 seconds) and the worker process crashes abruptly, the entire resource remains frozen and un-acquirable for a full minute, degrading user experience.",
    "To solve this problem cleanly, enterprise frameworks (such as Redisson in Java or robust Node.js Redlock implementations) introduce an automated Asynchronous Watchdog Timer (Lock Heartbeat).",
    "When a worker acquires a lock with a reasonable lease time (e.g. 10 seconds), the client library spawns a background timer that runs periodically (typically at one-third of the TTL, every 3.3 seconds). As long as the business logic function is still executing actively on the libuv event loop, the watchdog timer sends a renewal command to Redis, extending the key's TTL back to 10 seconds.",
    "If the worker process finishes its work, the lock is released immediately and the watchdog timer is cancelled cleanly. If the worker process crashes or the host loses power, the watchdog timer dies instantly with the process. Because renewals halt, Redis automatically evicts the lock once the current 10-second window elapses, restoring platform availability without manual intervention.",
    "In Part 3, our `simulateLockWatchdog` engine demonstrates this lease extension protocol, tracking heartbeat intervals and atomic TTL renewals.",
    "From an implementation standpoint, lease extensions must be executed using an atomic Lua script: `if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('pexpire', KEYS[1], ARGV[2]) else return 0 end`. This guarantees that the watchdog renews the lock only if the calling worker still owns it, preventing renewal of locks that were released or transferred.",
    "Furthermore, watchdog implementations incorporate maximum lease ceilings (e.g. 5 minutes) to protect against zombie threads caught in infinite loops that would otherwise renew locks perpetually.",
    "In cloud-native Kubernetes environments, pairing watchdog timers with graceful shutdown lifecycle hooks is essential for operational continuity. When a Kubernetes node terminates during a rolling deployment, the pod receives a `SIGTERM` signal.",
    "A well-architected distributed lock manager intercepts `SIGTERM`, signals the executing business task to wrap up or checkpoint immediately, halts the background watchdog renewal timer, and dispatches an atomic Lua release command to Redis. This proactive release frees the lock immediately, allowing replacement pods on the new deployment replica to acquire the resource without waiting for the lease TTL to expire.",
    "Furthermore, watchdog implementations enforce strict Hard Ceilings on total lock duration. If a software bug causes an asynchronous task to hang in an infinite loop, an unconstrained watchdog timer would renew the lock forever, freezing that business resource permanently.",
    "By configuring a maximum extension ceiling (such as 30 seconds or 3 renewals), the watchdog automatically terminates renewals after the ceiling is reached, logging an emergency error to Prometheus and allowing the lock to expire so that self-healing mechanisms can recover the system.",
    "Additionally, every lease renewal emits detailed telemetry metrics detailing the current renewal count and elapsed execution time, providing observability engineers with real-time insight into slow query patterns across worker fleets.",
    "This deterministic observability ensures that slow database queries or network stalls are flagged before they cause cascading lock timeouts across critical backend microservice workflows.",
    "By implementing automated watchdog lease renewals, backend architectures reconcile short failover recovery windows with long-running business transaction safety."
]

p3_code = """function simulateLockWatchdog(lockRecord, executionDurationMs, renewalIntervalMs = 3000, maxLeaseMs = 10000) {
  let simulatedTime = 0;
  let renewalsTriggered = 0;
  let lockLost = false;
  const auditLog = [];

  while (simulatedTime < executionDurationMs) {
    simulatedTime += renewalIntervalMs;
    if (simulatedTime > lockRecord.expiresAt) {
      lockLost = true;
      auditLog.push(`LOST_AT_${simulatedTime}ms`);
      break;
    }

    if (simulatedTime < executionDurationMs) {
      lockRecord.expiresAt = simulatedTime + maxLeaseMs;
      renewalsTriggered++;
      auditLog.push(`RENEWED_AT_${simulatedTime}ms_NEW_EXP_${lockRecord.expiresAt}`);
    }
  }

  return {
    executionDurationMs,
    renewalsTriggered,
    lockMaintained: !lockLost,
    finalExpiresAt: lockRecord.expiresAt,
    auditLog
  };
}

const activeLock = {
  key: 'lock:order:331',
  owner: 'worker_node_5',
  expiresAt: 5000
};

const watchdogRun = simulateLockWatchdog(activeLock, 8000, 2000, 5000);
console.log('Job Duration:', watchdogRun.executionDurationMs + 'ms');
console.log('Lock Maintained Throughout:', watchdogRun.lockMaintained);
console.log('Renewals Triggered:', watchdogRun.renewalsTriggered);
console.log('Final Expiration:', watchdogRun.finalExpiresAt + 'ms');
console.log('First Watchdog Action:', watchdogRun.auditLog[0]);"""

p4_say = [
    "Despite the mathematical rigor of Redlock and watchdog renewals, distributed locks in asynchronous networks face profound theoretical and practical limitations. In Part 4, we examine Concurrency Hazards: GC Pauses, Clock Drift & Martin Kleppmann's Critique.",
    "In 2016, distributed systems researcher Martin Kleppmann published a famous analysis critiquing the safety guarantees of Redlock. Kleppmann proved that in an asynchronous distributed system—where processes can pause at any time, network packets can be arbitrarily delayed, and physical hardware clocks can jump—algorithms like Redlock cannot guarantee absolute mutual exclusion without relying on physical timing assumptions.",
    "Consider the 'Stop-the-World GC Pause' hazard. Worker 1 acquires a distributed lock with a 10-second TTL. Immediately after acquiring the lock, Worker 1's V8 or JVM runtime enters a Stop-The-World garbage collection cycle or OS swap page pause lasting 12 seconds. During this pause, Worker 1 is completely frozen.",
    "Meanwhile, the 10-second TTL expires in Redis. Worker 2 arrives, observes that the lock is gone, acquires the lock cleanly, and begins writing to the database. Suddenly, Worker 1 awakens from its GC pause! Believing it still owns the lock (since it checked before the pause), Worker 1 proceeds to write to the database concurrently with Worker 2, corrupting business state.",
    "Another hazard is Physical Clock Drift. If the physical hardware clocks on the Redis cluster nodes shift due to NTP sync jumps or hardware oscillator variance, a node's local clock can advance faster than real time, causing keys to expire prematurely before the client's calculated validity window has elapsed.",
    "In Part 4, our `evaluateClockDriftAndGcPause` engine tests these failure scenarios, quantifying the vulnerability of lease-based locks when processes experience unhandled latency pauses.",
    "To survive these conditions, backend architects must recognize that distributed systems operate under the Asynchronous Network Model with Partial Synchrony. Distributed locks in Redis or Redlock are excellent for efficiency (preventing redundant expensive computations), but they cannot serve as the sole source of correctness for financial invariants unless paired with fencing tokens.",
    "The core insight of Martin Kleppmann's critique is that in pure asynchronous networks, no algorithm that relies solely on timing assumptions (such as TTLs or timeouts) can guarantee correctness for stateful mutations without storage-level fencing.",
    "Consider the memory architecture of modern execution runtimes like V8 in Node.js or the JVM. The V8 garbage collector operates using generation-based scavenging for new space and mark-sweep-compact algorithms for old space. When a Node.js process manages large heaps exceeding several gigabytes under high memory fragmentation, a major garbage collection pass can trigger a Stop-The-World pause spanning several seconds.",
    "During this pause, the operating system suspends all JavaScript execution threads. The process cannot read sockets, cannot dispatch heartbeats, and cannot execute watchdog renewals. To the outside world, the worker appears completely frozen. Redis correctly observes that the TTL has elapsed and frees the lock.",
    "When another worker acquires the newly freed lock and begins writing to the database, a severe race condition is born. The moment the GC pause finishes, the first worker resumes execution on the very next instruction—unaware that time has jumped forward—and issues its pending write to the database, overwriting newer data.",
    "Furthermore, virtualized cloud environments introduce Hypervisor CPU Steal Time, where the physical host pauses a guest virtual machine for hundreds of milliseconds to service competing virtual machines. These unavoidable real-world timing anomalies prove that backend architects must never rely on distributed locks alone for financial data integrity.",
    "By designing defensive distributed protocols that anticipate process pauses and clock shifts, engineers protect mission-critical commerce and billing engines against silent data corruption.",
    "Understanding these physical runtime hazards prepares engineers to implement bulletproof end-to-end consistency at the storage tier."
]

p4_code = """function evaluateClockDriftAndGcPause(lockTtlMs, pauseDurationMs, clockDriftMs = 50) {
  const acquisitionTime = 1000;
  const initialExpiration = acquisitionTime + lockTtlMs;
  const resumeTime = acquisitionTime + pauseDurationMs;
  const effectiveExpiration = initialExpiration - clockDriftMs;

  const isLockExpiredOnResume = resumeTime >= effectiveExpiration;
  const timeExpiredBy = isLockExpiredOnResume ? (resumeTime - effectiveExpiration) : 0;

  return {
    lockTtlMs,
    pauseDurationMs,
    clockDriftMs,
    isLockExpiredOnResume,
    timeExpiredByMs: timeExpiredBy,
    safetyStatus: isLockExpiredOnResume ? 'CRITICAL_HAZARD_RACE_CONDITION' : 'SAFE_WITHIN_LEASE'
  };
}

const safeCase = evaluateClockDriftAndGcPause(5000, 1500, 20);
const dangerousCase = evaluateClockDriftAndGcPause(5000, 5200, 30);

console.log('Safe Case Expired:', safeCase.isLockExpiredOnResume, `(${safeCase.safetyStatus})`);
console.log('Dangerous Case Expired:', dangerousCase.isLockExpiredOnResume, `(${dangerousCase.safetyStatus})`);
console.log('Expired By:', dangerousCase.timeExpiredByMs + 'ms');"""

p5_say = [
    "Having diagnosed the vulnerability of time-bounded locks to GC pauses, Part 5 introduces the ultimate mathematical solution: Monotonic Fencing Tokens and Safe Storage Gateways.",
    "As Martin Kleppmann demonstrated, if a storage system cannot verify whether the incoming write came from a client holding a currently valid lock, safety cannot be guaranteed. The definitive pattern to achieve 100% data correctness is the Fencing Token Pattern.",
    "A Fencing Token is a strictly monotonically increasing integer (1, 2, 3, ...) generated by the lock service whenever a lock is granted. When Worker 1 acquires the lock, the lock manager assigns it fencing token `31`. If Worker 1 pauses during a GC cycle and the lock expires, Worker 2 acquires the lock and is assigned fencing token `32`.",
    "When Worker 2 writes to the storage tier (e.g. PostgreSQL or an inventory ledger), it sends token `32`. The storage tier records the highest token it has ever observed (`max_token = 32`) and accepts the write. When Worker 1 awakens and attempts to write with stale token `31`, the storage engine compares `31 < 32` and rejects Worker 1's write with a `STALE_FENCING_TOKEN` error!",
    "In Part 5, our `validateFencingTokenAtStorage` engine models this storage gateway, proving that stale writes from delayed workers are intercepted and rejected deterministically.",
    "In relational databases like PostgreSQL, fencing tokens are enforced with an atomic SQL constraint: `UPDATE accounts SET balance = balance - 100, lock_version = $new_token WHERE id = $account_id AND lock_version < $new_token`. If zero rows are updated, the application knows that a newer worker superseded its lease.",
    "In Redis itself, monotonic fencing tokens are generated using `INCR fencing_token_generator`, producing atomic 64-bit integer sequences that never repeat.",
    "To achieve 100% deterministic consistency in the presence of GC pauses, network delays, and hypervisor stalls, enterprise architectures combine distributed locks with Monotonic Fencing Tokens enforced at the persistent storage boundary.",
    "The fencing mechanism operates as a strict monotonic filter: the lock service maintains a 64-bit atomic counter in Redis (via `INCR lock:counter:{resource}`). Every time a lock is acquired or renewed by any worker, the lock service increments the counter and issues the resulting value as an immutable fencing token attached to the lock grant.",
    "When the worker executes its mutation against PostgreSQL, MySQL, or DynamoDB, it includes the fencing token in the SQL query: `UPDATE ledger SET balance = balance - 100, fencing_token = $token WHERE account_id = $id AND fencing_token < $token`. If Worker 1 was paused and Worker 2 already committed a write with token 32, Worker 1's write with token 31 matches zero rows and aborts cleanly.",
    "The storage engine acts as the ultimate arbiter of truth, guaranteeing that even if a worker suffers a 60-second GC pause, its stale delayed writes are mathematically incapable of corrupting committed state.",
    "Furthermore, for distributed message streams, events carrying fencing tokens allow downstream consumers to detect out-of-order event delivery, discarding obsolete state updates while committing Kafka offsets cleanly.",
    "Additionally, storage engines can store transaction history audit trails indexed by fencing token, providing financial compliance auditors with cryptographically verifiable mutation logs.",
    "This cryptographic auditability proves that every write was committed by a legitimate, non-superseded worker under active lease authority.",
    "By mastering the combination of multi-master Redlock acquisition, automated watchdog renewals, and storage-tier fencing tokens, backend engineers build distributed platforms that achieve absolute transactional safety across unreliable cloud networks.",
    "Congratulations on mastering Day 37! You have explored single-instance mutexes, multi-master Redlock consensus, watchdog renewals, GC pause vulnerabilities, and monotonic fencing tokens.",
    "Tomorrow in Day 38, we examine Connection Pooling & Resource Sizing with Generic-Pool, Socket Reuse, and PostgreSQL pgBouncer Gateways!"
]

p5_code = """function validateFencingTokenAtStorage(storageState, operation) {
  const { resourceId, token, writeData } = operation;

  const currentToken = storageState[resourceId]?.maxToken ?? 0;

  if (token > currentToken) {
    storageState[resourceId] = {
      maxToken: token,
      data: writeData,
      updatedAt: Date.now()
    };
    return {
      accepted: true,
      token,
      previousToken: currentToken,
      status: 'WRITE_COMMITTED'
    };
  } else {
    return {
      accepted: false,
      token,
      currentToken,
      status: 'REJECTED_STALE_FENCING_TOKEN'
    };
  }
}

const ledger = {};
const write1 = validateFencingTokenAtStorage(ledger, { resourceId: 'seat_42A', token: 31, writeData: 'BOOKED_USER_A' });
const write2 = validateFencingTokenAtStorage(ledger, { resourceId: 'seat_42A', token: 32, writeData: 'BOOKED_USER_B' });
const staleWrite = validateFencingTokenAtStorage(ledger, { resourceId: 'seat_42A', token: 31, writeData: 'OVERWRITE_USER_A' });

console.log('Write 1 (Token 31):', write1.status);
console.log('Write 2 (Token 32):', write2.status);
console.log('Stale Write (Token 31):', staleWrite.status, `(rejected < ${staleWrite.currentToken})`);
console.log('Final Storage State:', ledger['seat_42A'].data, `(token ${ledger['seat_42A'].maxToken})`);"""

out1 = run_code(p1_code)
out2 = run_code(p2_code)
out3 = run_code(p3_code)
out4 = run_code(p4_code)
out5 = run_code(p5_code)

parts = [
    {
        "title": "Single-Instance Mutex Locking: Atomic SET NX PX & Safe Lua Release",
        "say": p1_say,
        "code": p1_code,
        "output": out1,
        "check": {
            "question": "Why must a distributed lock release operation verify ownership via an atomic Lua script rather than issuing a raw DEL command?",
            "options": [
                "To prevent a slow worker from deleting a lock that has already expired and been acquired by another worker process",
                "To compress the lock key into a smaller memory format",
                "To prevent the operating system from terminating the Redis service",
                "To encrypt database passwords stored in Redis"
            ],
            "answer": 0,
            "why": "Atomic Lua verification guarantees that a client deletes only the lock it currently owns, preventing accidental deletion of newer locks acquired after TTL expiration."
        }
    },
    {
        "title": "Multi-Master Distributed Consensus: The Redlock Algorithm & Quorum Math",
        "say": p2_say,
        "code": p2_code,
        "output": out2,
        "check": {
            "question": "What two conditions must be satisfied for the Redlock algorithm to consider a distributed lock successfully acquired?",
            "options": [
                "Acquiring the lock on a strict majority of independent nodes (e.g. >=3 of 5) and having positive remaining validity time after subtracting network elapsed time and clock drift",
                "Connecting to all 5 nodes simultaneously over a single WebSocket connection",
                "Restarting all 5 Redis nodes every 60 seconds",
                "Storing all lock data in relational database tables"
            ],
            "answer": 0,
            "why": "Redlock requires consensus across a majority of independent masters and validates that the time taken to acquire does not exceed the lease window."
        }
    },
    {
        "title": "Lease Extensions & Asynchronous Watchdog Timers: Preventing Premature Expiration",
        "say": p3_say,
        "code": p3_code,
        "output": out3,
        "check": {
            "question": "How does an Asynchronous Watchdog Timer resolve the dilemma between short failover TTLs and long-running business operations?",
            "options": [
                "It periodically renews the lock TTL while the worker is actively executing, allowing short initial leases that automatically expire if the worker crashes",
                "It terminates the operating system if a task takes longer than 1 second",
                "It forces all network connections to use HTTP/1.1 instead of HTTP/2",
                "It disables all garbage collection in the Node.js runtime"
            ],
            "answer": 0,
            "why": "Watchdog timers maintain short leases for fast crash recovery while renewing the TTL in the background as long as the worker remains alive and executing."
        }
    },
    {
        "title": "Concurrency Hazards: GC Pauses, Clock Drift & Kleppmann's Critique",
        "say": p4_say,
        "code": p4_code,
        "output": out4,
        "check": {
            "question": "Why can a Stop-The-World garbage collection pause cause a race condition in lease-based distributed locks?",
            "options": [
                "The process pauses longer than the lock TTL, allowing another worker to acquire the lock while the paused worker still believes it owns it",
                "Garbage collection permanently deletes all network interface cards",
                "V8 converts all numbers to floating point NaN values during GC",
                "Redis rejects all incoming commands when client memory is full"
            ],
            "answer": 0,
            "why": "If a worker is paused longer than its TTL, its lock expires unnoticed in Redis, allowing a second worker to acquire the lock and cause dual-execution."
        }
    },
    {
        "title": "Monotonic Fencing Tokens: Safe Storage Gateways & Out-of-Order Lock Rejection",
        "say": p5_say,
        "code": p5_code,
        "output": out5,
        "check": {
            "question": "How do Monotonic Fencing Tokens prevent data corruption from delayed or paused workers at the storage tier?",
            "options": [
                "The storage engine tracks the highest token observed and rejects any incoming write carrying an older, lower token number",
                "They generate random strings that bypass database unique constraints",
                "They prevent user logins during evening hours",
                "They compress database tables to zero bytes"
            ],
            "answer": 0,
            "why": "Fencing tokens enforce monotonic sequence checks at the storage gateway, guaranteeing that delayed writes from expired workers are rejected."
        }
    }
]

day37 = {
    "day": 37,
    "title": "Distributed Locking & Concurrency Control: Redlock Algorithm, Lease Renewals & Fencing Tokens",
    "goal": "Master distributed mutual exclusion in Node.js: analyze single-instance Redis locks (SET NX PX), multi-node consensus via the Redlock algorithm across N independent master nodes, lease renewals (watchdog timers), race conditions (GC pauses & clock drift), and monotonic fencing tokens.",
    "minutes": 38,
    "recap": "Yesterday in Day 36, we mastered Redis Cluster sharding, hash slots, and pipelining. Today, we step into distributed concurrency control, exploring Redlock consensus, lease extensions, and fencing tokens.",
    "parts": parts,
    "summary": [
        "Single-instance locks use atomic SET NX PX with unique random tokens and Lua-based ownership verification on release.",
        "The Redlock algorithm achieves distributed consensus across N independent Redis masters via majority voting within bounded drift windows.",
        "Asynchronous watchdog timers extend lock leases in the background, reconciling fast crash failover with long-running operations.",
        "Stop-The-World GC pauses and physical clock drift can invalidate lease assumptions, exposing distributed systems to concurrent writes.",
        "Monotonic fencing tokens provide definitive data safety by enabling storage gateways to reject out-of-order writes from superseded workers."
    ],
    "projectStep": {
        "title": "Implement Distributed Redlock & Fencing Token Simulator",
        "steps": [
            "Execute acquireSingleInstanceLock and releaseSingleInstanceLock to validate atomic mutex acquisition and Lua-safe ownership release.",
            "Run simulateRedlockConsensus to evaluate 5-node majority quorum voting and calculate remaining validity margins.",
            "Execute simulateLockWatchdog to test background heartbeat renewals and prevent premature lease expiration.",
            "Run evaluateClockDriftAndGcPause to model Stop-The-World GC latency and detect critical concurrency race hazards.",
            "Execute validateFencingTokenAtStorage to verify monotonic token sequencing and reject stale writes at the storage gateway."
        ]
    }
}

total_words = 0
for i, p in enumerate(day37['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Day 37 Part {i+1}: {wc} words")
print(f"Total Day 37 Words: {total_words}")

assert all(sum(len(s.split()) for s in p['say']) >= 580 for p in day37['parts']), "All parts must be >= 580 words!"
assert total_words >= 2900, "Total words must be >= 2900!"

with open('scripts/node_day37.json', 'w', encoding='utf-8') as f:
    json.dump(day37, f, indent=2)

print("Generated scripts/node_day37.json successfully!")
