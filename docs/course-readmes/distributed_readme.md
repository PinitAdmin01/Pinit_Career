# High-Scale Distributed System Design — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **High-Scale Distributed System Design (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🌐 Course Overview
* **Name**: High-Scale Distributed System Design
* **ID**: `course-distributed-sys`
* **Duration**: 30 Days (6 Weeks)
* **Target Audience**: Backend Architects / Distributed Systems SDEs
* **Learning Interface**: System node rings, consensus voter sheets, partition boundaries logs, and replication latency metrics.
* **Evaluation Sandbox**: Computational engines checking sticky sessions hashes, consistent hashing partitions maps, server heartbeat pings, voter consensus majorities, cache thundering herd locks, database sharding routing indexes, and SLA compliance metrics.

---

## 📅 Detailed Day-by-Day Syllabus

### 🌐 Week 1: Scale Foundations, Sticky Sessions & Consistent Hashing

#### 🟢 Day 1: Introduction to Distributed Systems & Scale
* **Lecture Syllabus**:
  - Monolith vs Distributed architecture models
  - Vertical scaling vs Horizontal scaling
  - Measuring systems availability and reliability
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Computer Networks & The Request Lifecycle
* **Lecture Syllabus**:
  - Request lifecycle from browser to backend
  - TCP/IP vs UDP transport layers
  - Reverse proxies and CDNs routing patterns
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: Stateless Scaling & Sticky Sessions
* **Lecture Syllabus**:
  - Designing stateless application tiers
  - Sticky sessions routing algorithms
  - Shared distributed session stores
* **Coding Exam**: `distributed-basics-exam-day-3` (`routeStickySession`)
  - **Task**: Write a JS function `routeStickySession(userId, servers)` routing user requests to correct server nodes.
  - **Test**: `routeStickySession('usr-1', ['srv-A', 'srv-B'])` correctly hashes session traffic.
* **Coding Assignment**: `distributed-basics-assign-day-3` (`isTokenValid`)
  - **Task**: Write a JS function `isTokenValid(token)` checking stateless token prefixes and lengths.
  - **Test**: Checks session_ prefix and minimum length of 16.

#### 🟢 Day 4: Load Balancers: Consistent Hashing partitions
* **Lecture Syllabus**:
  - Consistent hashing ring structures
  - Hashing keys partitions mapping
  - Virtual node allocations limits
* **Coding Exam**: `distributed-basics-exam-day-4` (`routeConsistentHash`)
  - **Task**: Write a JS function `routeConsistentHash(keyHash, nodesList)` resolving requests over hash rings.
  - **Test**: Selects target node hash ranges, wrapping around rings boundaries.
* **Coding Assignment**: `distributed-basics-assign-day-4` (`getHashDistance`)
  - **Task**: Write a JS function `getHashDistance(h1, h2, ringSize)` calculating ring node intervals.
  - **Test**: Modular arithmetic calculations checks.

#### 🟢 Day 5: Load Balancers: Heartbeat health checks
* **Lecture Syllabus**:
  - Heartbeat ping systems architectures
  - Tracking sequential failed pings thresholds
  - Evicting bad nodes from active routing tables
* **Coding Exam**: `distributed-basics-exam-day-5` (`isServerOffline`)
  - **Task**: Write a JS function `isServerOffline(sequentialFailures, threshold)` checking node states.
  - **Test**: Returns true if failure triggers equal or exceed threshold.
* **Coding Assignment**: `distributed-basics-assign-day-5` (`resetFailuresOnSuccess`)
  - **Task**: Write a JS function `resetFailuresOnSuccess(statusCode)` clearing failures on success HTTP 200 statuses.
  - **Test**: Returns 0 when status is 200.

#### 🟢 Day 6: CAP Theorem: Paxos consensus quorum voters
* **Lecture Syllabus**:
  - CAP theorem consistency availability boundaries
  - Quorum consensus calculations rules
  - Leader voter election processes
* **Coding Exam**: `distributed-basics-exam-day-6` (`isQuorumAchieved`)
  - **Task**: Write a JS function `isQuorumAchieved(activeVotes, totalNodes)` checking voter consensus.
  - **Test**: Enforces strict majority active votes limits.
* **Coding Assignment**: `distributed-basics-assign-day-6` (`getMinQuorum`)
  - **Task**: Write a JS function `getMinQuorum(totalNodes)` finding quorum minimum thresholds.
  - **Test**: Checks integer division formulas.

#### 🟢 Day 7: Distributed Caching: Cache Stampede lock guards
* **Lecture Syllabus**:
  - Cache stampede (thundering herd) concepts
  - Mutual exclusion cache lock algorithms
  - Configuring cache TTL expirations values
* **Coding Exam**: `distributed-basics-exam-day-7` (`shouldFetchFromDb`)
  - **Task**: Write a JS function `shouldFetchFromDb(cacheExpired, isLocked)` implementing lock guard safety checks.
  - **Test**: Restricts parallel DB queries during cache rebuild windows.
* **Coding Assignment**: `distributed-basics-assign-day-7` (`isLockExpired`)
  - **Task**: Write a JS function `isLockExpired(lockAcquiredTime, ttl, current)` checking lock status.
  - **Test**: Asserts lock timestamps boundaries.

---

### 🌐 Week 2: Sharding Partition Rules & Infrastructure Auditing

#### 🟢 Day 8: Database Sharding: Hash range keys mapping
* **Lecture Syllabus**:
  - Database sharding partition schemes
  - Hash partitioning ranges configurations
  - Calculating shard indexes targets
* **Coding Exam**: `distributed-basics-exam-day-8` (`getShardId`)
  - **Task**: Write a JS function `getShardId(userId, totalShards)` mapping key partitions.
  - **Test**: Modulo route mapping checks.
* **Coding Assignment**: `distributed-basics-assign-day-8` (`isKeyInShardRange`)
  - **Task**: Write a JS function `isKeyInShardRange(key, minKey, maxKey)` verifying range bounds.
  - **Test**: Checks bounds.

#### 🟢 Day 9: Final Capstone: Distributed Infrastructure Audit
* **Lecture Syllabus**:
  - Consistent hashing partition audits
  - Consensus voter quorum verification
  - Evaluating cache Stampede lock boundaries
* **Coding Exam**: `distributed-basics-exam-day-9` (`evaluateInfrastructure`)
  - **Task**: Write a JS function `evaluateInfrastructure(report)` auditing distributed systems compliance.
  - **Test**: Verifies quorum statuses, sharding distributions, and stampede locks.
* **Coding Assignment**: `distributed-basics-assign-day-9` (`getAvailabilityRating`)
  - **Task**: Write a JS function `getAvailabilityRating(uptimePct)` rating uptime SLA.
  - **Test**: Enforces 99.99% (four nines) standards thresholds.

---

### 🌐 Week 3: Applied Distributed Systems Optimization & Scale Reviews

#### 🟢 Day 10: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 11: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

---

### 🌐 Week 4: Applied Distributed Systems Optimization & Scale Reviews (Review)

#### 🟢 Day 15: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Reviewing consistent hash rings
  - Assembling infrastructure audit checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Distributed Infrastructure Audit (Review)
* **Lecture Syllabus**:
  - Assemble final distributed infrastructure deployment and scale audit report
  - Verify consistent hashing rings partitions and leader voter consensus quorums
  - Confirm database sharding routers and cache thundering herd locks configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
