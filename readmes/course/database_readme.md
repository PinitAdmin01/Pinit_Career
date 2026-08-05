# Database Engineering & Query Performance — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Database Engineering & Query Performance (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 💾 Course Overview
* **Name**: Database Engineering & Query Performance
* **ID**: `course-database-eng`
* **Duration**: 30 Days (5 Weeks)
* **Target Audience**: Database Administrators / Backend Engineers / Infrastructure SDEs
* **Learning Interface**: Execution plans charts, indexes scan timelines, replication lag trackers, and locks tables.
* **Evaluation Sandbox**: Relational engines checking SQL JOIN structures, aggregate query builders, scan optimization costs, transaction isolation safeties, master-slave replicas routing routers, and replication lag metrics.

---

## 📅 Detailed Day-by-Day Syllabus

### 💾 Week 1: SQL Schemas, Filtering & Multi-Table Joins

#### 🟢 Day 1: Introduction to Databases, SQL vs NoSQL & RDBMS
* **Lecture Syllabus**:
  - Relational Database Management Systems (RDBMS)
  - Database tables, rows, columns, and schemas
  - SQL vs NoSQL data modeling trade-offs
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: SQL CRUD Operations: SELECT, INSERT, UPDATE, DELETE
* **Lecture Syllabus**:
  - Writing SELECT queries and column selections
  - Inserting database rows using INSERT
  - Modifying and deleting records safely
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: SQL Filtering: WHERE, LIKE, IN, BETWEEN & ORDER BY
* **Lecture Syllabus**:
  - WHERE clauses and comparison operators
  - Pattern matching using LIKE and wildcards
  - Ordering and limiting results with ORDER BY and LIMIT
* **Coding Exam**: `database-basics-exam-day-3` (`buildFilterQuery`)
  - **Task**: Write a JS function `buildFilterQuery(minAge, category)` building SQL strings.
  - **Test**: `buildFilterQuery(18, 'premium') === "SELECT * FROM users WHERE age >= 18 AND category = 'premium'"`.
* **Coding Assignment**: `database-basics-assign-day-3` (`buildSortedQuery`)
  - **Task**: Write a JS function `buildSortedQuery(col, direction)` formatting sorting conditions.
  - **Test**: Compiles sort queries.

#### 🟢 Day 4: SQL Joins: Combining multi-tables data fields
* **Lecture Syllabus**:
  - INNER JOIN and LEFT JOIN structures
  - Joining tables over foreign key maps
  - Filtering joined queries records
* **Coding Exam**: `database-basics-exam-day-4` (`buildJoinQuery`)
  - **Task**: Write a JS function `buildJoinQuery(table1, table2, joinKey)` generating INNER JOIN.
  - **Test**: Links table key coordinates correctly.
* **Coding Assignment**: `database-basics-assign-day-4` (`buildLeftJoinQuery`)
  - **Task**: Write a JS function `buildLeftJoinQuery(t1, t2, key)` compiling LEFT JOIN queries.
  - **Test**: Constructs valid syntax.

#### 🟢 Day 5: SQL Aggregations: SUM, AVG, COUNT, MIN, MAX & GROUP BY
* **Lecture Syllabus**:
  - Aggregate calculations functions syntax
  - Grouping rows using GROUP BY
  - Filtering aggregated groups with HAVING
* **Coding Exam**: `database-basics-exam-day-5` (`buildGroupQuery`)
  - **Task**: Write a JS function `buildGroupQuery(table, col, agg)` returning GROUP BY query.
  - **Test**: Groups columns.
* **Coding Assignment**: `database-basics-assign-day-5` (`buildHavingQuery`)
  - **Task**: Write a JS function `buildHavingQuery(limit)` appending HAVING thresholds.
  - **Test**: Validates limit variables.

---

### 💾 Week 2: Query Index Optimization & Performance Auditing

#### 🟢 Day 6: Database Indexing: Index scans vs Sequential scans
* **Lecture Syllabus**:
  - Sequential vs Index execution scans
  - B-Tree index structure advantages
  - Auditing execution scan cost parameters
* **Coding Exam**: `database-basics-exam-day-6` (`isScanOptimized`)
  - **Task**: Write a JS function `isScanOptimized(scanType, cost)` checking scan bounds.
  - **Test**: Restricts expensive Sequential Scans cost values.
* **Coding Assignment**: `database-basics-assign-day-6` (`getCostReduction`)
  - **Task**: Write a JS function `getCostReduction(oldCost, newCost)` finding improvement ratio.
  - **Test**: Divides values.

#### 🟢 Day 7: Transaction isolation levels & ACIDs rules
* **Lecture Syllabus**:
  - ACID transaction properties parameters
  - Dirty reads, non-repeatable reads, phantom reads
  - Read Committed vs Serializable isolations limits
* **Coding Exam**: `database-basics-exam-day-7` (`isIsolationSafe`)
  - **Task**: Write a JS function `isIsolationSafe(level)` verifying transaction security.
  - **Test**: Enforces REPEATABLE READ or SERIALIZABLE.
* **Coding Assignment**: `database-basics-assign-day-7` (`hasPhantomRisk`)
  - **Task**: Write a JS function `hasPhantomRisk(level)` checking phantom risks.
  - **Test**: Flags READ COMMITTED.

#### 🟢 Day 8: Database Replication: Master-Slave configurations
* **Lecture Syllabus**:
  - Synchronous vs Asynchronous replication pipelines
  - Read replicas load distributions
  - Master node failover recovery procedures
* **Coding Exam**: `database-basics-exam-day-8` (`routeQuery`)
  - **Task**: Write a JS function `routeQuery(queryType)` routing SQL queries.
  - **Test**: Sends writes to PRIMARY and reads to REPLICA.
* **Coding Assignment**: `database-basics-assign-day-8` (`isReplicaHealthy`)
  - **Task**: Write a JS function `isReplicaHealthy(syncLagSec)` validating replication lags.
  - **Test**: Confirms sync is below 5 seconds.

#### 🟢 Day 9: Final Capstone: Database Query Optimizer & Compliance Audit
* **Lecture Syllabus**:
  - Query execution plan analysis
  - Index scans optimization criteria
  - Transaction isolation levels compliance checks
* **Coding Exam**: `database-basics-exam-day-9` (`evaluateDbOptimizations`)
  - **Task**: Write a JS function `evaluateDbOptimizations(report)` verifying database performance report.
  - **Test**: Audits scan types, sync delays, and isolation safety.
* **Coding Assignment**: `database-basics-assign-day-9` (`getOptimizationScore`)
  - **Task**: Write a JS function `getOptimizationScore(oldCost, newCost)` scoring speedups.
  - **Test**: Returns rounded percentage reduction.

---

### 💾 Week 3: Applied Database Optimizations & Replication Reviews

#### 🟢 Day 10: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 11: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

---

### 💾 Week 4: Applied Database Optimizations & Replication Reviews (Review)

#### 🟢 Day 15: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing query indexing structures
  - Assembling query optimization checklists
  - Verifying replication status parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Database Query Optimizer & Compliance Audit (Review)
* **Lecture Syllabus**:
  - Assemble final database performance and query optimization audit report
  - Verify SQL Joins, Aggregation group builds and query indexes scans cost reductions
  - Confirm transaction isolations safety states and primary-replica query router configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
