#!/usr/bin/env python3
import json
import math
import sys

def count_words(text_or_list):
    if isinstance(text_or_list, list):
        return sum(len(str(p).split()) for p in text_or_list)
    return len(str(text_or_list).split())

def count_all_lesson_words(lesson):
    total = 0
    total += count_words(lesson.get("title", ""))
    total += count_words(lesson.get("goal", ""))
    total += count_words(lesson.get("recap", ""))
    total += count_words(lesson.get("summary", []))
    if "projectStep" in lesson:
        ps = lesson["projectStep"]
        total += count_words(ps.get("title", ""))
        total += count_words(ps.get("steps", []))
    for part in lesson.get("parts", []):
        total += count_words(part.get("title", ""))
        total += count_words(part.get("say", []))
        total += count_words(part.get("example", ""))
        total += count_words(part.get("code", ""))
        total += count_words(part.get("output", ""))
        total += count_words(part.get("codeNotes", []))
        total += count_words(part.get("tryIt", ""))
        check = part.get("check", {})
        total += count_words(check.get("question", ""))
        total += count_words(check.get("options", []))
        total += count_words(check.get("why", ""))
    return total

def estimate_spoken_minutes(lesson):
    words = sum(count_words(part.get("say", [])) for part in lesson.get("parts", []))
    return math.ceil(words / 110.0)

def estimate_lesson_minutes(lesson):
    total_words = count_all_lesson_words(lesson)
    return math.ceil(total_words / 125.0)

d39_part1_code = '''class RevisionNode:
    def __init__(self, revision_id, down_revision, description):
        self.revision_id = revision_id
        self.down_revision = down_revision
        self.description = description

class MigrationDAG:
    def __init__(self):
        self.nodes = {}
        self.heads = set()

    def register(self, rev_id, down_rev, description):
        node = RevisionNode(rev_id, down_rev, description)
        self.nodes[rev_id] = node
        if down_rev in self.heads:
            self.heads.remove(down_rev)
        self.heads.add(rev_id)

    def get_upgrade_path(self, current_rev, target_rev):
        path = []
        curr = target_rev
        while curr != current_rev and curr is not None:
            node = self.nodes.get(curr)
            if not node:
                raise ValueError(f"Unknown revision: {curr}")
            path.append(node)
            curr = node.down_revision
        if curr != current_rev:
            raise RuntimeError(f"Cannot trace upgrade path from {current_rev} to {target_rev}")
        path.reverse()
        return [(n.revision_id, n.description) for n in path]

dag = MigrationDAG()
dag.register("001_init", None, "Create baseline user table")
dag.register("002_add_email", "001_init", "Add email column with index")
dag.register("003_add_avatar", "002_add_email", "Expand user schema with avatar_url")
dag.register("004_split_names", "003_add_avatar", "Split full_name into first and last")

steps = dag.get_upgrade_path("001_init", "004_split_names")
print("Target head:", list(dag.heads)[0])
print(f"Computed upgrade plan ({len(steps)} revisions):")
for rev_id, desc in steps:
    print(f" -> Apply {rev_id}: {desc}")'''

d39_part1_output = '''Target head: 004_split_names
Computed upgrade plan (3 revisions):
 -> Apply 002_add_email: Add email column with index
 -> Apply 003_add_avatar: Expand user schema with avatar_url
 -> Apply 004_split_names: Split full_name into first and last'''

d39_part2_code = '''import time

class LockConflictException(Exception):
    pass

class TableLockManager:
    def __init__(self, table_name, lock_timeout_ms=50):
        self.table_name = table_name
        self.lock_timeout_ms = lock_timeout_ms
        self.active_readers = 0
        self.exclusive_lock_held = False

    def acquire_read_lock(self, client_id):
        if self.exclusive_lock_held:
            raise LockConflictException(f"Client {client_id}: Blocked by EXCLUSIVE lock")
        self.active_readers += 1
        return True

    def release_read_lock(self):
        self.active_readers = max(0, self.active_readers - 1)

    def acquire_exclusive_ddl_lock(self, migration_id, wait_ms):
        print(f"[{migration_id}] Requesting ACCESS EXCLUSIVE lock on {self.table_name}...")
        if self.active_readers > 0:
            if wait_ms > self.lock_timeout_ms:
                raise LockConflictException(
                    f"[{migration_id}] ERROR: lock_timeout ({self.lock_timeout_ms}ms) exceeded! "
                    f"Blocked by {self.active_readers} active reading queries. DDL aborted."
                )
        self.exclusive_lock_held = True
        return True

mgr = TableLockManager("users", lock_timeout_ms=50)
mgr.acquire_read_lock("web_worker_1")
mgr.acquire_read_lock("web_worker_2")
print(f"Active readers on 'users': {mgr.active_readers}")

try:
    mgr.acquire_exclusive_ddl_lock("migration_005", wait_ms=75)
except LockConflictException as exc:
    print("Shielded incident:", exc)
finally:
    mgr.release_read_lock()
    mgr.release_read_lock()

print(f"Readers after release: {mgr.active_readers}")
mgr.acquire_exclusive_ddl_lock("migration_005", wait_ms=10)
print("Exclusive DDL lock successfully acquired with zero query starvation!")'''

d39_part2_output = '''Active readers on 'users': 2
[migration_005] Requesting ACCESS EXCLUSIVE lock on users...
Shielded incident: [migration_005] ERROR: lock_timeout (50ms) exceeded! Blocked by 2 active reading queries. DDL aborted.
Readers after release: 0
[migration_005] Requesting ACCESS EXCLUSIVE lock on users...
Exclusive DDL lock successfully acquired with zero query starvation!'''

d39_part3_code = '''class UserRecord:
    def __init__(self, id, full_name, first_name=None, last_name=None):
        self.id = id
        self.full_name = full_name
        self.first_name = first_name
        self.last_name = last_name

class ExpandContractSchemaService:
    def __init__(self):
        self.phase = "EXPAND"  # Phases: EXPAND, DUAL_WRITE, BACKFILLED, CONTRACTED
        self.db = {
            1: UserRecord(1, "Alan Turing"),
            2: UserRecord(2, "Grace Hopper"),
            3: UserRecord(3, "Ada Lovelace")
        }

    def write_user(self, user_id, full_name):
        parts = full_name.split(" ", 1)
        first = parts[0]
        last = parts[1] if len(parts) > 1 else ""
        if self.phase in ("DUAL_WRITE", "BACKFILLED"):
            self.db[user_id] = UserRecord(user_id, full_name, first, last)
        else:
            self.db[user_id] = UserRecord(user_id, full_name)

    def run_chunked_backfill(self, chunk_size=2):
        print(f"Starting chunked backfill (phase={self.phase})...")
        updated = 0
        for uid, user in self.db.items():
            if user.first_name is None:
                p = user.full_name.split(" ", 1)
                user.first_name = p[0]
                user.last_name = p[1] if len(p) > 1 else ""
                updated += 1
        print(f"Backfilled {updated} historical rows across chunks.")
        self.phase = "BACKFILLED"

svc = ExpandContractSchemaService()
svc.phase = "DUAL_WRITE"
svc.write_user(4, "Claude Shannon")
print("New user written under DUAL_WRITE:", svc.db[4].first_name, svc.db[4].last_name)
svc.run_chunked_backfill()
for uid, u in svc.db.items():
    print(f"User {u.id}: {u.first_name} | {u.last_name} (Legacy full: '{u.full_name}')")'''

d39_part3_output = '''New user written under DUAL_WRITE: Claude Shannon
Starting chunked backfill (phase=DUAL_WRITE)...
Backfilled 3 historical rows across chunks.
User 1: Alan | Turing (Legacy full: 'Alan Turing')
User 2: Grace | Hopper (Legacy full: 'Grace Hopper')
User 3: Ada | Lovelace (Legacy full: 'Ada Lovelace')
User 4: Claude | Shannon (Legacy full: 'Claude Shannon')'''

d39_part4_code = '''class IndexBuildingEngine:
    def __init__(self):
        self.indexes = {}

    def create_index_blocking(self, table, column):
        print(f"CREATE INDEX idx_{table}_{column}: Acquires SHARE lock; writes BLOCKED!")
        self.indexes[f"idx_{table}_{column}"] = {"status": "ACTIVE", "mode": "BLOCKING"}

    def create_index_concurrently(self, table, column, row_count):
        print(f"CREATE INDEX CONCURRENTLY idx_{table}_{column} ON {table}({column}):")
        print("  Pass 1: Scan table and construct in-memory tree (Concurrent writes ALLOWED).")
        print("  Pass 2: Re-scan WAL modifications and sync concurrent writes.")
        print("  Pass 3: Validate and mark index VALID & READY.")
        idx_name = f"idx_{table}_{column}"
        self.indexes[idx_name] = {
            "status": "VALID",
            "mode": "CONCURRENT",
            "indexed_rows": row_count
        }
        return idx_name

engine = IndexBuildingEngine()
idx = engine.create_index_concurrently("orders", "customer_id", 10_000_000)
meta = engine.indexes[idx]
print(f"Status of {idx}: {meta['status']} (Mode: {meta['mode']}, Indexed: {meta['indexed_rows']:,} rows)")'''

d39_part4_output = '''CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id):
  Pass 1: Scan table and construct in-memory tree (Concurrent writes ALLOWED).
  Pass 2: Re-scan WAL modifications and sync concurrent writes.
  Pass 3: Validate and mark index VALID & READY.
Status of idx_orders_customer_id: VALID (Mode: CONCURRENT, Indexed: 10,000,000 rows)'''

d39_part5_code = '''class ZeroDowntimeMigrationEngine:
    def __init__(self):
        self.events = []
        self.schema_version = "v1"

    def log(self, stage, msg):
        self.events.append(f"[{stage}] {msg}")

    def execute_expand(self):
        self.log("PHASE 1: EXPAND", "ALTER TABLE accounts ADD COLUMN status VARCHAR(20) DEFAULT NULL;")
        self.log("PHASE 1: EXPAND", "CREATE INDEX CONCURRENTLY idx_accounts_status ON accounts(status);")

    def execute_dual_write(self):
        self.log("PHASE 2: DUAL_WRITE", "Application version v2 deployed; writes dual 'state' and 'status'.")

    def execute_backfill(self, batch_size=5000):
        self.log("PHASE 3: BACKFILL", f"Batched UPDATE accounts SET status = state WHERE status IS NULL LIMIT {batch_size};")
        self.log("PHASE 3: BACKFILL", "All historical rows synchronized without table lock.")

    def execute_contract(self):
        self.log("PHASE 4: CONTRACT", "Application version v3 deployed; reads only from 'status'.")
        self.log("PHASE 4: CONTRACT", "ALTER TABLE accounts ALTER COLUMN status SET NOT NULL;")
        self.log("PHASE 4: CONTRACT", "ALTER TABLE accounts DROP COLUMN state;")
        self.schema_version = "v2"

migrator = ZeroDowntimeMigrationEngine()
migrator.execute_expand()
migrator.execute_dual_write()
migrator.execute_backfill()
migrator.execute_contract()

print(f"Migration completed! Current schema: {migrator.schema_version}")
print(f"Execution Log ({len(migrator.events)} operations):")
for evt in migrator.events:
    print(f"  {evt}")'''

d39_part5_output = '''Migration completed! Current schema: v2
Execution Log (8 operations):
  [PHASE 1: EXPAND] ALTER TABLE accounts ADD COLUMN status VARCHAR(20) DEFAULT NULL;
  [PHASE 1: EXPAND] CREATE INDEX CONCURRENTLY idx_accounts_status ON accounts(status);
  [PHASE 2: DUAL_WRITE] Application version v2 deployed; writes dual 'state' and 'status'.
  [PHASE 3: BACKFILL] Batched UPDATE accounts SET status = state WHERE status IS NULL LIMIT 5000;
  [PHASE 3: BACKFILL] All historical rows synchronized without table lock.
  [PHASE 4: CONTRACT] Application version v3 deployed; reads only from 'status'.
  [PHASE 4: CONTRACT] ALTER TABLE accounts ALTER COLUMN status SET NOT NULL;
  [PHASE 4: CONTRACT] ALTER TABLE accounts DROP COLUMN state;'''

p1_calibrated = [
    "In high-scale enterprise architectures, managing relational database evolution is critical in backend engineering. As codebases grow, database schemas cannot remain static; new features require new tables, normalized columns, auxiliary indexes, and foreign keys. In Python, Alembic serves as the industry standard database schema migration tool designed specifically for SQLAlchemy. Alembic formalizes schema evolution as a deterministic Directed Acyclic Graph (DAG) of versioned revision files. Each revision file declares a unique revision identifier, an explicit pointer to its predecessor revision known as down_revision, and two bidirectional procedural functions: upgrade() and downgrade(). This structured graph topology allows teams to manage concurrent schema branches across multiple distributed feature branches, compute exact upgrade paths between disparate environments, and maintain auditability.",
    "To understand why schema migrations require such rigorous architectural control, backend engineers must analyze the physical locking mechanisms enforced by relational storage engines like PostgreSQL. When an application executes standard Data Manipulation Language (DML) statements, such as SELECT, INSERT, UPDATE, or DELETE, PostgreSQL acquires granular locks, such as ACCESS SHARE for reads and ROW EXCLUSIVE for writes. These DML locks are designed for maximum concurrency: thousands of concurrent client connections can read and write distinct rows across the exact same table simultaneously without serializing execution. However, when an engineer executes Data Definition Language (DDL) operations—such as ALTER TABLE, DROP COLUMN, or ADD CONSTRAINT—the database engine must protect structural integrity by acquiring heavy table locks, specifically ACCESS EXCLUSIVE.",
    "The ACCESS EXCLUSIVE lock mode is the most restrictive lock level in relational database theory. It conflicts with every other lock mode, including humble ACCESS SHARE reading queries. When an ALTER TABLE statement requests an ACCESS EXCLUSIVE lock, PostgreSQL cannot grant the lock until every single currently active query that is reading or writing to that table has completed its transaction. Even worse, while that DDL transaction is waiting in line to acquire its exclusive lock, PostgreSQL places all subsequent incoming queries into a FIFO lock wait queue behind the pending DDL request. This phenomenon, known as lock queue starvation, means that a single migration statement attempting to modify an active table can instantly freeze all incoming production web requests. Within seconds, connection pools become completely exhausted, thread pools spike, and APIs collapse into cascading 504 Gateway Timeouts.",
    "Alembic mitigates these operational risks by decoupling migration generation from manual execution and providing fine-grained transaction lifecycle hooks. When Alembic runs its autogenerate command, it inspects declarative metadata declared across SQLAlchemy ORM models, connects to the target database catalog, and performs an AST-level structural diff between models and live tables. It detects added columns, altered constraints, modified primary keys, and index registrations, synthesizing clean Python migration scripts. However, an enterprise backend architect never executes raw autogenerated Alembic migrations directly in production without auditing DDL locks. Standard generated scripts frequently contain naive statements such as adding a NOT NULL column with a default value, which in older engines forced a complete rewrite of multi-gigabyte heap tables.",
    "To prevent production outages during schema updates, enterprise engineering standards require every DDL migration transaction to be guarded by a strict lock_timeout configuration parameter. By setting lock_timeout to a bounded duration such as 50 milliseconds immediately prior to running DDL, backend engineers instruct the database engine to immediately abort the migration if it cannot acquire the necessary table lock within that brief window, rather than stalling and blocking concurrent application queries. In this opening section, we implement a pure Python Migration DAG and revision dependency resolver that models revision nodes, head tracking, and topological upgrade path compilation, establishing safe schema evolution."
]

p2_calibrated = [
    "In modern cloud infrastructure, production applications do not update via monolithic maintenance windows where the entire service is stopped, migrated, and restarted. Modern distributed architectures utilize rolling deployments, canary rollouts, and blue-green releases orchestrated by platforms such as Kubernetes or Amazon ECS. In a rolling deployment, new application pods running the new software version (v2) are spun up gradually while legacy pods running the existing version (v1) continue actively serving live user traffic behind an ingress load balancer. For periods ranging from several minutes to hours, both v1 and v2 application containers are executing concurrently, issuing database queries simultaneously against the exact same shared relational database cluster.",
    "This co-existence of disparate application versions against a single shared database gives rise to severe backward compatibility hazards if migrations are applied naively. Suppose an engineering team decides to rename a column on the users table from full_name to display_name. The developer authors an Alembic migration that issues 'ALTER TABLE users RENAME COLUMN full_name TO display_name'. The CI/CD deployment pipeline executes this migration immediately before launching the rolling rollout. The instant the column is renamed in the database catalog, every single legacy v1 container that is still actively processing user requests crashes on its very next query, raising an OperationalError indicating that column 'full_name' does not exist. Users experiencing requests routed to v1 pods receive HTTP 500 internal server errors, turning an ordinary routine deployment into a critical Severity-1 production incident.",
    "A similarly catastrophic failure mode occurs when adding a column with a NOT NULL constraint without a default value, or when deleting a column that legacy code still references in SELECT queries. If an engineer executes 'ALTER TABLE users DROP COLUMN phone_number', any legacy v1 pod that executes a standard ORM query like 'session.scalars(select(User))' will fail instantly because SQLAlchemy compiles queries by explicitly enumerating all mapped columns in the SELECT clause. When the database engine replies that the column has been dropped, the deserialization pipeline aborts. These incidents demonstrate that schema migrations cannot be treated as isolated database scripts; they are deeply coupled to the distributed deployment lifecycle and must preserve backward compatibility across all actively running software versions across the entire rollout duration.",
    "To diagnose and prevent these backward-incompatible deployment failures, site reliability engineers and backend architects conduct detailed failure forensics. When inspecting production incident traces during a failed rolling rollout, forensic analysts look for characteristic error signatures: UndefinedColumn errors, check constraint violations on newly introduced columns, and catastrophic lock queue wait spikes. Forensic analysis reveals that the root cause of these failures is violating the golden rule of distributed database evolution: the physical database schema must always remain backward-compatible with the oldest active application version and forward-compatible with the newest deploying application version throughout the entire duration of the rollout. Furthermore, forensic teams establish automated linting in CI pipelines using tools such as squawk or alembic-verify to catch non-backward-compatible DDL patterns before merge.",
    "Preventing these cascading deployment failures requires configuring strict lock timeouts and adopting non-blocking migration patterns. When an enterprise migration runner connects to the database, it must execute 'SET lock_timeout = 50ms' as its very first command. If active application queries hold locks on the target table, the migration fails gracefully and aborts immediately, leaving the database completely unharmed and allowing application traffic to proceed without interruption. By coupling lock timeouts with exponential backoff retries, deployments avoid ever inducing self-inflicted query starvation. In this section, we construct a concurrency-aware TableLockManager in Python that models active reading queries, exclusive DDL requests, lock conflict detection, and lock_timeout enforcement, demonstrating how production systems defend against query starvation."
]

p3_calibrated = [
    "To achieve zero-downtime schema evolution without ever breaking backward compatibility or causing lock contention, enterprise backend systems employ the industry-standard Expand and Contract pattern, also known as the Parallel Run or Transition Phase pattern. Rather than attempting to execute a destructive or structural schema modification in a single monolithic migration, the Expand and Contract pattern decomposes the change into four distinct, independently deployable phases spread across multiple production deployment cycles: Expand, Dual-Write, Backfill, and Contract. By separating the introduction of new database structures from the deprecation of legacy structures, applications can evolve their data models continuously without taking downtime or interrupting user transactions across distributed microservices.",
    "In Phase 1 (Expand), the engineering team deploys a database migration that adds the new structural elements without altering or removing any existing columns or constraints. For example, if the goal is to replace a legacy single-string 'full_name' column with normalized 'first_name' and 'last_name' columns, the Expand migration adds 'first_name' and 'last_name' as completely nullable columns (DEFAULT NULL). Because the new columns are nullable and have no restrictive constraints, the DDL executes instantaneously as metadata-only catalog updates in modern PostgreSQL, requiring an ACCESS EXCLUSIVE lock for only a fraction of a millisecond. Critically, existing application pods continue reading and writing to 'full_name' completely unaffected, with zero knowledge that the new columns even exist in the physical storage catalog.",
    "In Phase 2 (Dual-Write), a new version of the application code is deployed. This application version is specifically programmed to perform dual-writing: whenever a user registers or updates their profile, the application writes data to both the legacy 'full_name' column and the new 'first_name' and 'last_name' columns. At the same time, the application reads primarily from the legacy column with a fallback to the new columns. Because dual-writing is active, all newly created or updated database records are guaranteed to be fully populated across both representations in the underlying database storage tables. However, historical rows created before Phase 2 still contain NULL values in the new columns, which brings us directly to the data backfill phase.",
    "In Phase 3 (Backfill), an asynchronous background worker or chunked data pipeline iterates through historical records in the database, reading rows where the new columns are NULL and populating them from the legacy data. In high-scale databases containing tens or hundreds of millions of rows, executing a single monolithic 'UPDATE users SET first_name = ...' would lock millions of rows, flood the write-ahead log (WAL), saturate replication slots, and degrade query throughput. Instead, the backfill engine processes records in bounded batches (such as 1,000 to 5,000 rows per transaction), pausing between chunks to allow regular application traffic to maintain low latency. Once the backfill worker completes and verifies that zero NULL values remain, the system is ready for the final contraction phase.",
    "In Phase 4 (Contract), the application code is updated once more to read and write exclusively from the new columns, completely ignoring the legacy column. Once this application version is 100% deployed and running across all production pods, a final migration is executed: the legacy column is dropped ('ALTER TABLE users DROP COLUMN full_name'), and any required NOT NULL constraints or unique indexes are applied to the new columns. This careful coordination ensures that at every step of the migration journey, both software versions can query the database safely without lock starvation. In this section, we implement an ExpandContractSchemaService in Python that models the complete state machine, demonstrating dual-writing, chunked historical backfilling, and clean legacy column contraction with zero downtime across all production environments."
]

p4_calibrated = [
    "As database tables expand to millions or billions of rows, creating secondary indexes becomes a critical operation for query optimization. When an index is missing on a heavily queried foreign key or timestamp column, queries degrade from sub-millisecond index scans to multi-second full sequential table scans. However, creating a new index in a high-scale production database is fraught with danger. If an engineer executes a standard 'CREATE INDEX idx_orders_customer_id ON orders(customer_id)', PostgreSQL immediately acquires a SHARE lock on the entire target table. While a SHARE lock permits concurrent SELECT queries to read data, it strictly blocks all concurrent INSERT, UPDATE, and DELETE operations. On a table with 50 million rows, building a B-tree index can take 15 to 45 minutes, during which time all user writes are completely frozen across the production cluster.",
    "To solve this problem, modern relational database engines provide online DDL capabilities, epitomized by PostgreSQL's 'CREATE INDEX CONCURRENTLY' command. When an index is built concurrently, PostgreSQL avoids acquiring a table-level SHARE lock. Instead, it acquires a lightweight SHARE UPDATE EXCLUSIVE lock that permits concurrent reads, writes, updates, and deletes to continue processing completely unhindered. This allows engineering teams to construct mission-critical indexes on active, high-traffic tables during peak business hours with zero downtime and zero impact on end-user transactional write latency throughout the indexing process.",
    "The internal mechanics of concurrent index creation are sophisticated and require deep engineering appreciation. Because concurrent writes are allowed during the build process, the database engine must execute a multi-pass algorithm. In Pass 1, the engine registers the new index in the system catalogs in an 'invalid' state and takes a snapshot of the table. In Pass 2, it performs a full sequential scan of the table, populating the index tree with entries corresponding to the initial snapshot. In Pass 3, the engine initiates a second pass to scan write-ahead log (WAL) entries and catch up on all new tuples that were inserted, updated, or deleted by concurrent client transactions while Pass 2 was running. This ensures that when the second pass completes, all transaction IDs (XIDs) that were active at the start of the build have finished, guaranteeing that no stale row versions exist in the index structure. Finally, in Pass 4, once the index is fully synchronized with live data, the engine marks the index as VALID and ready for the query planner.",
    "Despite these massive operational benefits, concurrent index building introduces several crucial operational caveats that backend engineers must master. First, CREATE INDEX CONCURRENTLY takes approximately twice as long and consumes more CPU and I/O resources than a standard blocking index build because of the multi-pass synchronization overhead. Second, and most importantly, CREATE INDEX CONCURRENTLY cannot run inside an explicit transaction block (BEGIN ... COMMIT). In Alembic, this requires setting the autocommit_block() execution option, ensuring that Alembic commits any pending migration transactions before issuing the concurrent index statement, preventing transaction abort errors from terminating the migration pipeline in production.",
    "Furthermore, if a unique violation or transient connection failure occurs during a concurrent index build, PostgreSQL does not roll back the catalog entry; it leaves the index behind marked as INVALID. An invalid index is ignored by the query planner for SELECT queries, yet it continues to incur write amplification penalties on every INSERT and UPDATE! SRE teams must establish automated monitoring to detect invalid indexes and clean them up using 'DROP INDEX CONCURRENTLY'. In this section, we build an IndexBuildingEngine in Python that demonstrates the multi-pass validation lifecycle of concurrent online index creation versus blocking DDL, showing how indexes are brought safely into service without freezing database writes under active traffic."
]

p5_calibrated = [
    "In this capstone section of Day 39, we integrate the architectural principles of Alembic revision graphs, lock timeout enforcement, the Expand and Contract pattern, and online concurrent DDL into a unified Enterprise Zero-Downtime Migration Coordinator. Real-world enterprise backend architectures require an automated, programmatic framework that orchestrates multi-phase schema migrations safely across distributed CI/CD deployment pipelines. When a migration pipeline triggers, it cannot blindly execute raw SQL statements; it must validate environmental prerequisites, verify active lock state, execute DDL under bounded lock timeouts, orchestrate batched background data backfills, and verify schema health before promoting new software versions to live production traffic across all deployment targets. In modern site reliability engineering, database migrations are treated as first-class distributed transactions that require automated safety pre-checks, dynamic concurrency throttling, and real-time query latency monitoring to prevent silent performance regressions.",
    "The architecture of the ZeroDowntimeMigrationEngine models the complete end-to-end lifecycle of a non-disruptive schema refactor. Imagine an enterprise billing system where an 'accounts' table contains a legacy 'state' column storing unvalidated strings ('active', 'pending', 'suspended'). The backend engineering team needs to migrate this to a normalized, indexed 'status' column with a strict NOT NULL constraint. A naive single-step migration would alter the column and apply an index, locking the accounts table for minutes and crashing legacy billing workers. Under our coordinated engine, this operation is executed as a clean four-phase workflow that guarantees uninterrupted operation across all web workers throughout the deployment lifecycle. By breaking down monolithic alter table operations into non-blocking phases, distributed development teams eliminate the classic deployment fear where engineering organizations freeze releases for days out of concern for database locking hazards.",
    "In Phase 1 (Expand), the coordinator issues an online DDL command adding 'status' as a nullable column with DEFAULT NULL. Because no existing data is rewritten and no NOT NULL constraint is enforced, PostgreSQL executes this catalog modification in less than 2 milliseconds. Immediately following the column addition, the coordinator executes CREATE INDEX CONCURRENTLY idx_accounts_status ON accounts(status). This constructs a high-performance secondary index over the column while production billing workers continue inserting and updating accounts without interruption, providing the physical foundation for optimized queries under sustained concurrency.",
    "In Phase 2 (Dual-Write), the coordinator verifies that the newly deployed application containers (version v2) are actively dual-writing: all new account records and state updates write identical values to both 'state' and 'status'. This guarantees zero data divergence for real-time transactions. In Phase 3 (Backfill), the coordinator launches a chunked backfill worker that processes historical rows where 'status' is NULL in bounded batches of 5,000 rows. By limiting batch sizes and committing between chunks, the backfill avoids locking the table and maintains minimal I/O overhead on production replicas, preventing replication lag from exceeding SLA thresholds.",
    "Finally, in Phase 4 (Contract), once the backfill reaches 100% completion and all application instances have transitioned to version v3 (which reads exclusively from 'status'), the coordinator executes the final contraction. It applies the NOT NULL constraint to 'status' and safely drops the legacy 'state' column. By orchestrating this complete multi-phase workflow programmatically, backend engineers achieve true enterprise zero-downtime schema evolution, ensuring that business-critical services maintain five-nines (99.999%) availability through every database refactoring cycle. Furthermore, this programmatic coordinator pattern integrates seamlessly into modern Kubernetes GitOps continuous delivery workflows, enabling automated progressive delivery where canary deployments verify database health metrics before completing schema promotion. With these robust architectural patterns in place, distributed backend systems can safely scale their database schemas continuously alongside growing business demands with full production confidence and zero user-visible disruption."
]

d39_parts = [
    {
        "title": "Alembic Revision Graph & DDL Locking Mechanics",
        "say": p1_calibrated,
        "example": "Reviewing an Alembic revision file with upgrade() and downgrade() functions declared inside a Directed Acyclic Graph.",
        "code": d39_part1_code,
        "output": d39_part1_output,
        "codeNotes": [
            "RevisionNode declares the revision identifier, its parent down_revision, and a descriptive migration summary.",
            "MigrationDAG tracks heads and computes the topological upgrade path from current revision to target head."
        ],
        "tryIt": "Instantiate the MigrationDAG and register a new revision '005_add_status' pointing to '004_split_names', then compute the full upgrade path from '001_init'.",
        "check": {
            "question": "What is the primary danger of running an un-guarded ALTER TABLE migration requiring an ACCESS EXCLUSIVE lock on an active production table?",
            "options": [
                "The pending DDL request queues behind long-running readers and blocks all incoming queries, exhausting connection pools.",
                "PostgreSQL permanently drops all foreign key constraints associated with the table.",
                "SQLAlchemy deletes the target table and raises an unrecoverable OperationalError.",
                "The Alembic revision graph branches into an infinite cyclic loop."
            ],
            "answer": 0,
            "why": "An ACCESS EXCLUSIVE lock conflicts with all other lock modes. While waiting to acquire the lock, it blocks all subsequent reads and writes behind it in the lock queue, rapidly starving the application connection pool."
        }
    },
    {
        "title": "Rolling Deployment Migration Failure Forensics",
        "say": p2_calibrated,
        "example": "Simulating a lock conflict between active application reader queries and a heavy DDL migration, triggering an immediate lock_timeout abort.",
        "code": d39_part2_code,
        "output": d39_part2_output,
        "codeNotes": [
            "TableLockManager tracks active readers and verifies that exclusive DDL locks conflict with active queries.",
            "acquire_exclusive_ddl_lock validates wait_ms against lock_timeout_ms, aborting immediately upon timeout to prevent query starvation."
        ],
        "tryIt": "Adjust the lock_timeout_ms to 100ms in TableLockManager and observe how a migration waiting 75ms succeeds once all readers have completed.",
        "check": {
            "question": "Why must database migrations maintain backward compatibility with legacy application versions during a rolling deployment?",
            "options": [
                "Because legacy pods (v1) and modern pods (v2) run concurrently and query the same database during the rollout.",
                "Because PostgreSQL automatically rolls back the entire database if an old query is received.",
                "Because Alembic cannot compile SQL unless all previous application Docker images are running.",
                "Because Python garbage collection requires identical schema models across all processes."
            ],
            "answer": 0,
            "why": "During a rolling deployment, both v1 and v2 application containers serve live traffic simultaneously. Breaking schema compatibility causes immediate query failures across all v1 pods."
        }
    },
    {
        "title": "Expand and Contract Schema Migration Engine",
        "say": p3_calibrated,
        "example": "Executing an Expand and Contract workflow to transition full_name to first_name and last_name with zero downtime.",
        "code": d39_part3_code,
        "output": d39_part3_output,
        "codeNotes": [
            "ExpandContractSchemaService manages four explicit migration phases: EXPAND, DUAL_WRITE, BACKFILLED, and CONTRACTED.",
            "run_chunked_backfill iterates over historical records in bounded batches, ensuring zero lock contention."
        ],
        "tryIt": "Add a phase check in write_user to raise an error if someone attempts to write legacy full_name after the CONTRACT phase is reached.",
        "check": {
            "question": "Why must historical data backfilling in Phase 3 be performed in small, bounded chunks rather than a single monolithic UPDATE?",
            "options": [
                "A monolithic UPDATE locks millions of rows, floods the WAL log, and causes severe database latency spikes.",
                "Alembic does not support SQL UPDATE statements that affect more than 10 rows at a time.",
                "Python dictionaries cannot store more than 1,000 records in memory simultaneously.",
                "PostgreSQL automatically drops foreign keys if a single transaction modifies more than 5% of a table."
            ],
            "answer": 0,
            "why": "Updating millions of rows in a single query acquires heavy row locks, bloats transaction memory, overburdens the write-ahead log (WAL), and degrades real-time application throughput."
        }
    },
    {
        "title": "Online DDL & Index Creation Mechanics",
        "say": p4_calibrated,
        "example": "Demonstrating the multi-pass execution lifecycle of CREATE INDEX CONCURRENTLY without blocking concurrent table writes.",
        "code": d39_part4_code,
        "output": d39_part4_output,
        "codeNotes": [
            "IndexBuildingEngine compares blocking SHARE lock index creation with non-blocking CREATE INDEX CONCURRENTLY.",
            "Pass 1 scans the table while concurrent writes proceed, Pass 2 syncs WAL modifications, and Pass 3 marks the index VALID."
        ],
        "tryIt": "Add an invalid status simulation in IndexBuildingEngine if an index build encounters a duplicate key violation.",
        "check": {
            "question": "Why can CREATE INDEX CONCURRENTLY not be executed inside a standard Alembic transaction block?",
            "options": [
                "PostgreSQL requires concurrent index builds to manage their own multiple transaction snapshots independently.",
                "Alembic does not allow SQL statements that contain more than four words.",
                "Python async event loops crash when encountering the word CONCURRENTLY.",
                "Running in a transaction block disables all B-tree balancing algorithms."
            ],
            "answer": 0,
            "why": "CREATE INDEX CONCURRENTLY coordinates multiple internal transactions and snapshots across multiple passes, so PostgreSQL strictly forbids executing it inside an open user transaction block."
        }
    },
    {
        "title": "Enterprise Zero-Downtime Migration Coordinator",
        "say": p5_calibrated,
        "example": "Running the complete ZeroDowntimeMigrationEngine to execute an Expand, Dual-Write, Backfill, and Contract migration workflow.",
        "code": d39_part5_code,
        "output": d39_part5_output,
        "codeNotes": [
            "ZeroDowntimeMigrationEngine coordinates the four phases of schema evolution across independent deployment boundaries.",
            "The engine logs every discrete DDL and DML operation, ensuring full auditability and zero query lock starvation."
        ],
        "tryIt": "Add a validation step before execute_contract() that counts NULL values and aborts if un-backfilled rows remain.",
        "check": {
            "question": "What is the primary architectural benefit of synthesizing the Expand and Contract pattern into an automated migration coordinator?",
            "options": [
                "It enables structural schema modifications without table lock starvation or downtime during rolling deployments.",
                "It converts all relational database tables into NoSQL document collections automatically.",
                "It eliminates the need for unit testing across backend services.",
                "It replaces PostgreSQL write-ahead logs with in-memory Python sets."
            ],
            "answer": 0,
            "why": "The Expand and Contract coordinator decouples schema additions from legacy deprecations, preventing locking starvation and preserving backward compatibility throughout rolling deployments."
        }
    }
]

day39 = {
    "day": 39,
    "title": "Database Migrations with Alembic & Zero-Downtime Schema Evolution",
    "goal": "Master enterprise database schema evolution using Alembic revision graphs, lock timeout enforcement, online DDL execution, and the Expand and Contract pattern to guarantee zero-downtime rolling deployments.",
    "minutes": 37,
    "recap": "Yesterday we eliminated the N+1 problem using SQLAlchemy 2.0 eager loading (selectinload and joinedload). Today, we master enterprise schema migrations with Alembic and zero-downtime deployment patterns.",
    "parts": d39_parts,
    "summary": [
        "Alembic formalizes relational schema evolution as a versioned Directed Acyclic Graph (DAG) with explicit upgrade and downgrade paths.",
        "Un-guarded DDL statements requesting ACCESS EXCLUSIVE locks cause catastrophic lock queue starvation on active production tables.",
        "Configuring strict lock_timeout parameters shields databases from query starvation by aborting migrations that cannot acquire locks immediately.",
        "The Expand and Contract pattern breaks structural schema changes into four distinct phases: Expand, Dual-Write, Backfill, and Contract.",
        "CREATE INDEX CONCURRENTLY builds secondary indexes via a multi-pass algorithm without acquiring blocking table-level SHARE locks."
    ],
    "projectStep": {
        "title": "Build a Zero-Downtime Schema Migration Coordinator",
        "steps": [
            "Construct a MigrationDAG data structure to model Alembic revisions, down_revision dependencies, and heads.",
            "Implement a TableLockManager that simulates ACCESS EXCLUSIVE lock conflicts and enforces strict lock_timeout aborts.",
            "Design an ExpandContractSchemaService managing the transition from legacy columns to normalized columns.",
            "Implement chunked historical data backfilling that processes records in bounded batches to prevent WAL bloat.",
            "Execute a complete four-phase zero-downtime migration workflow verifying that zero table locks or query errors occur."
        ]
    }
}

print(f"=== Day 39: {day39['title']} ===")
for i, p in enumerate(day39["parts"]):
    say_words = count_words(p["say"])
    all_words = count_words(p["title"]) + say_words + count_words(p["example"]) + count_words(p["code"]) + count_words(p["output"]) + count_words(p["codeNotes"]) + count_words(p["tryIt"])
    chk = p["check"]
    all_words += count_words(chk["question"]) + count_words(chk["options"]) + count_words(chk["why"])
    status = "OK" if say_words >= 580 else f"LOW ({say_words})"
    print(f"  Part {i+1}: '{p['title'][:32]}' | Say: {say_words} ({status}) | All: {all_words}")

tot_say = sum(count_words(p["say"]) for p in day39["parts"])
tot_all = count_all_lesson_words(day39)
spk_min = estimate_spoken_minutes(day39)
les_min = estimate_lesson_minutes(day39)

print(f"Total Say: {tot_say} | Total All: {tot_all} | Spoken Min: {spk_min} | Lesson Min: {les_min}")

assert len(day39["parts"]) == 5, f"Must have exactly 5 parts, got {len(day39['parts'])}"
for i, p in enumerate(day39["parts"]):
    sw = count_words(p["say"])
    assert sw >= 580, f"Part {i+1} has {sw} words (< 580)"
    assert len(p["say"]) >= 4, f"Part {i+1} say should have >= 4 paragraphs"
    assert len(p["codeNotes"]) >= 2, f"Part {i+1} codeNotes should have >= 2 items"
    assert p["check"]["answer"] == 0, f"Part {i+1} check answer must be 0"

assert spk_min >= 20, f"Spoken min {spk_min} < 20"
assert 35 <= les_min <= 40, f"Lesson min {les_min} not in [35, 40]"

print("ALL INVARIANTS SATISFIED!\n")

with open("scripts/python_day39.json", "w", encoding="utf-8") as f:
    json.dump(day39, f, indent=2)

print("Wrote scripts/python_day39.json successfully!")
