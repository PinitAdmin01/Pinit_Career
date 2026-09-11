// src/lib/curriculum/pythonFullStack/batch031.ts
// Single Source of Truth for PINIT BATCH 031 (COMPLETE · DAYS 153–157): Month 8 · Week 31 · Days 1–5
// Database Transactions, Row-Level Locking, Deadlock Resolution & Concurrency Control
// Pedagogical Flow: UNDERSTAND (ACID & atomic()) -> APPLY (select_for_update & Row Locking) -> BUILD (Deadlock Resolution & Complete-Tx Retries) -> DEBUG (OCC & Version CAS) -> TRANSFER (High-Concurrency Seat Reservation & Formative Assessment)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_DATABASE_TRANSACTIONS = 'comp-pfs-m8-031';

// ── DAY 153: UNDERSTAND — ACID Guarantees, Transaction Isolation Levels & Django transaction.atomic() ──
export const DAY_153_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w31-031',
  dayNumber: 1,
  title: 'ACID Guarantees, Transaction Isolation Levels & Django transaction.atomic()',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b31-d153-01',
      type: 'THEORY',
      order: 1,
      title: 'ACID Foundations, PostgreSQL 18 Isolation Levels & Django Transaction Architecture',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master database transaction mechanics in Django 6.0 on Python 3.14 with PostgreSQL 18: ACID formal properties, PostgreSQL transaction isolation levels (Read Committed, Repeatable Read, Serializable), concurrency anomalies (Dirty Read, Non-Repeatable Read, Phantom Read, Serialization Anomaly), Django transaction.atomic() savepoint mechanics, and outermost transaction.on_commit() semantics.',
      whatItIs: 'A database transaction is an atomic unit of database execution governed by ACID guarantees:\n1. The Four ACID Properties:\n   - Atomicity: "All or nothing." If any statement inside a transaction fails, all changes are rolled back completely.\n   - Consistency: A transaction transitions the database from one valid state to another, preserving all schema constraints, check rules, and foreign key invariants.\n   - Isolation: Concurrent transactions execute without observing each other\'s intermediate uncommitted states.\n   - Durability: Once a transaction commits, its modifications are permanently recorded on disk (via PostgreSQL Write-Ahead Logging / WAL) and survive system crashes.\n2. PostgreSQL 18 Isolation Levels & Concurrency Anomalies:\n   - Read Committed (Default in PostgreSQL & Django): Prevents Dirty Reads. A statement sees only data committed before the statement began. Permitted anomalies: Non-Repeatable Reads (row re-read within same transaction returns different data) and Phantom Reads (re-running query sees newly inserted rows).\n   - Repeatable Read: Uses a snapshot taken at the start of the transaction. Prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads in PostgreSQL. Permitted anomaly: Serialization Anomaly.\n   - Serializable: Full mathematical serializability using Serializable Snapshot Isolation (SSI). Prevents all anomalies by monitoring read/write dependency graphs and aborting conflicting transactions with serialization failures.\n3. Django Transaction Management with transaction.atomic():\n   - atomic() context manager and decorator manages transaction boundaries.\n   - Nested atomic() blocks create PostgreSQL SAVEPOINTs. If an inner block catches an exception, it rolls back to the savepoint without aborting the enclosing outer transaction.\n4. Outermost transaction.on_commit() Semantics (Accurate Boundary):\n   - When business logic triggers external side effects (e.g. sending emails, enqueuing Celery tasks, charging payment gateways), use transaction.on_commit(callback).\n   - Crucial Invariant: The callback executes ONLY AFTER the outermost transaction successfully commits. If registered inside nested atomic() blocks, the callback waits until the root transaction commits.\n   - Post-Commit Failure Boundary: The callback itself runs outside the database transaction and can still fail (e.g. network timeout reaching an email server). Applications must implement retry queues or idempotent task execution rather than assuming on_commit() guarantees external success.',
      whyItExists: 'Guarantees business data integrity during financial transfers, order processing, and multi-step state transitions, preventing partial data corruption and phantom external actions.',
      problemSolved: 'Eliminates partial database writes during server crashes, prevents race-condition balance overdrafts, and guarantees external tasks only fire on successful database commit.',
      mentalModel: 'The Legal Contract Signing & Courier Dispatch: Transferring funds without a transaction is handing cash to someone before they sign the deed: if they run away, you lose your money. transaction.atomic() is placing the cash and the signed deed in an escrow lockbox: both transfer simultaneously, or neither does. transaction.on_commit() is instructing the courier: "Do not mail the victory announcement letter until the escrow lockbox is physically opened and the deed is recorded in the city registry."',
      realWorldUse: 'Double-entry banking transfers, e-commerce checkout pipelines, multi-service provisioning, and automated subscription renewal billing.',
      commonMistakes: [
        'Dispatching background tasks (e.g. send_confirmation_email.delay()) directly inside a transaction.atomic() block instead of inside transaction.on_commit(), causing emails to fire even if the transaction subsequently rolls back.',
        'Assuming transaction.on_commit() guarantees the external task succeeds (the callback runs after commit, but can still encounter network or runtime errors).',
        'Catching database exceptions inside an atomic() block without using a nested savepoint, leaving the connection in an uncommitted, broken transaction state.',
        'Assuming PostgreSQL\'s default Read Committed isolation level prevents concurrent race conditions on balance updates (requires pessimistic locking or Repeatable Read).',
      ],
      commonMisconceptions: [
        'on_commit() callbacks run inside the database transaction (they execute after the transaction has fully committed to disk).',
        'Nested atomic() blocks start separate physical transactions (relational databases only support one physical transaction per connection; Django implements nesting using SAVEPOINTs).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b31-d153-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Atomic Financial Transfer with Savepoints and Post-Commit Side Effects',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from decimal import Decimal
from django.db import models, transaction
from django.core.exceptions import ValidationError

class BankAccount(models.Model):
    account_number = models.CharField(max_length=32, unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2)

def transfer_funds_atomic(source_acc_no: str, dest_acc_no: str, amount: Decimal):
    """
    Executes an atomic transfer between two accounts.
    Enforces all-or-nothing atomicity and outermost on_commit execution.
    """
    if amount <= Decimal('0.00'):
        raise ValidationError("Transfer amount must be strictly positive.")

    # 1. Outermost atomic transaction boundary
    with transaction.atomic():
        source = BankAccount.objects.get(account_number=source_acc_no)
        dest = BankAccount.objects.get(account_number=dest_acc_no)

        if source.balance < amount:
            raise ValidationError("Insufficient funds for transfer.")

        source.balance -= amount
        source.save(update_fields=['balance'])

        dest.balance += amount
        dest.save(update_fields=['balance'])

        # 2. Register post-commit notification:
        # Executes ONLY after the outermost transaction commits to disk!
        # If the transaction aborts due to an error, this callback NEVER fires.
        transaction.on_commit(lambda: notify_parties_of_transfer(
            source_acc_no, dest_acc_no, amount
        ))

def notify_parties_of_transfer(source: str, dest: str, amount: Decimal):
    # Note: Runs post-commit outside DB transaction.
    # Must be idempotent in case of background retry.
    print(f"[AUDIT] Transfer of {amount} from {source} to {dest} committed successfully.")`,
      explanation: 'Demonstrates robust transaction management using transaction.atomic() to ensure debit and credit execute atomically, and uses transaction.on_commit() to ensure notification side effects only dispatch after the transaction is durable.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b31-d153-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Refactoring Multi-Step Mutation into Atomic Blocks',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Refactor an un-transactional order placement flow into an atomic transaction that uses savepoints for optional loyalty credit redemption and on_commit for inventory reservation webhooks.',
      instructions: [
        'Analyze an e-commerce checkout function that updates inventory, charges loyalty credits, and dispatches a fulfillment webhook.',
        'Wrap the multi-step mutations inside transaction.atomic().',
        'Use a nested transaction.atomic() block as a savepoint to attempt optional loyalty point redemption without failing the entire checkout if points are locked.',
        'Move the fulfillment webhook dispatch to transaction.on_commit() to ensure webhooks never fire for aborted orders.',
      ],
      hints: [
        'Exceptions inside an inner atomic() block roll back to the savepoint if caught inside Python.',
        'Always test that raising an exception before commit prevents on_commit() callbacks from executing.',
      ],
      expectedOutcome: 'Zero partial order state corruption and absolute elimination of phantom fulfillment webhooks on checkout failure.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b31-d153-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: transaction.on_commit() Execution Boundary',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'If a callback is registered via transaction.on_commit(callback) inside a nested transaction.atomic() block, when does Django execute the callback?',
      options: [
        'Only after the outermost (root) transaction successfully commits to disk; if the outer transaction rolls back, the callback is discarded.',
        'Immediately when the inner nested atomic() block exits.',
        'Before the SQL COMMIT statement is sent to the database.',
        'Inside a separate thread while the transaction is still open.',
      ],
      correctIndex: 0,
      explanation: 'Django documentation explicitly specifies that on_commit() callbacks are tied to the outermost transaction. Callbacks registered inside nested atomic() blocks wait until the root transaction commits successfully.',
      misconceptionIdentified: 'Assuming on_commit() executes when an inner savepoint/nested block exits.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b31-d153-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: The Illusion of External Guarantees',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why transaction.on_commit() solves the "phantom action on rollback" problem, but why applications must still handle post-commit external failures idempotently.',
      guidingQuestions: [
        'If on_commit() dispatches an HTTP webhook and the target API responds with 503 Service Unavailable, why can the database transaction NOT be rolled back?',
        'How does combining on_commit() with an outbox table or reliable task queue provide true reliability?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b31-d153-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 031 Reference Sheet: Django Database Transactions',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Database transactions',
          url: 'https://docs.djangoproject.com/en/6.0/topics/db/transactions/',
        },
        {
          title: 'PostgreSQL 18 Documentation: Transaction Isolation',
          url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
        },
      ],
      documentationExtracts: [
        'atomic(): Guarantees atomicity. If a block of code completes successfully, the changes are committed to the database. If there is an exception, the changes are rolled back.',
        'on_commit(): Registers a function to be called after the current transaction is successfully committed.',
      ],
    } as ReferenceBlock,
  ],
};


// ── DAY 154: APPLY — Row-Level Locking in PostgreSQL & Django (select_for_update) ──
export const DAY_154_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w31-031',
  dayNumber: 2,
  title: 'Row-Level Locking in PostgreSQL & Django (select_for_update)',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b31-d154-01',
      type: 'THEORY',
      order: 1,
      title: 'PostgreSQL Row-Lock Internals, Lock Modes & Django select_for_update Mechanics',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master pessimistic row-level locking in PostgreSQL 18 and Django 6.0 on Python 3.14: lock modes (FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE, FOR KEY SHARE), tuple-level lock storage mechanisms vs table-level locks, select_for_update() semantics, nowait=True immediate error handling, and the exact multi-worker FIFO task queue semantics of skip_locked=True.',
      whatItIs: 'PostgreSQL row-level locking provides pessimistic concurrency control across concurrent transactions:\n1. PostgreSQL Row-Lock Storage Mechanics:\n   - PostgreSQL records row-lock information using tuple-level mechanisms (xmax/infomasks) while also acquiring the required table-level lock associated with the locking clause; this is not automatic lock escalation.\n   - When a row lock is acquired, the locking transaction ID is written to the row\'s xmax header along with infomask bits indicating the lock type.\n2. Four PostgreSQL Row-Lock Modes:\n   - FOR UPDATE: Exclusive write lock. Blocks all concurrent FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE, and FOR KEY SHARE locks, as well as UPDATE and DELETE statements.\n   - FOR NO KEY UPDATE: Weaker lock acquired by UPDATE statements that do not alter unique/primary key columns. Allows concurrent FOR KEY SHARE.\n   - FOR SHARE: Shared read lock. Allows concurrent readers, blocks writers and exclusive lockers.\n   - FOR KEY SHARE: Weakest shared lock. Acquired by foreign key checks to verify referenced parent exists; allows concurrent FOR NO KEY UPDATE.\n3. Django ORM select_for_update() Integration:\n   - QuerySet.select_for_update(nowait=False, skip_locked=False, of=(), no_key=False).\n   - Mandatory Rule: select_for_update() must execute within an active transaction.atomic() block. Invoking it outside a transaction raises a TransactionManagementError.\n4. Waiting Semantics & Queue Processing:\n   - Default (nowait=False, skip_locked=False): Transaction blocks until the lock holder commits or rolls back.\n   - nowait=True: If any requested row is locked, PostgreSQL raises OperationalError/DatabaseError immediately without blocking.\n   - skip_locked=True: Skips locked rows from the result set. SKIP LOCKED produces an intentionally inconsistent/partial view of the table, specifically suited for multi-worker FIFO task consumption, not general-purpose reads.',
      whyItExists: 'Pessimistic locking prevents race conditions and lost updates on critical shared resources (e.g. inventory counters, wallet balances, booking slots) by holding exclusive access until transaction completion.',
      problemSolved: 'Eliminates double-spending anomalies, overselling under high concurrency, and worker contention in task processing queues.',
      mentalModel: 'The Fitting Room with Lock & Queue: FOR UPDATE is physically entering and locking the fitting room door: no other customer can enter until you exit. nowait=True is checking the door handle: if it is locked, you leave in frustration immediately. skip_locked=True is walking past occupied fitting rooms and claiming the first unoccupied room in line, allowing multiple shoppers to try clothes simultaneously without standing behind each other.',
      realWorldUse: 'High-concurrency wallet balance debiting, ticket seat reservation, warehouse stock allocation, and distributed task worker polling.',
      commonMistakes: [
        'Invoking select_for_update() outside a transaction.atomic() block, which releases the lock immediately after statement execution rather than holding it through business logic.',
        'Using select_for_update(skip_locked=True) for financial reporting or customer invoice generation, which silently ignores locked rows and returns incomplete, inconsistent aggregates.',
        'Holding row locks during slow external HTTP requests or disk operations inside the transaction, causing connection exhaustion and cascading timeouts.',
        'Locking parent rows with FOR UPDATE when only child foreign keys are being verified (use FOR KEY SHARE instead).',
      ],
      commonMisconceptions: [
        'PostgreSQL escalates row locks to table locks when thousands of rows are locked (PostgreSQL records row-lock state in tuple headers and never escalates row locks to table locks).',
        'skip_locked=True guarantees transactional consistency for general read queries (it deliberately provides an incomplete view suited only for queue workers).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b31-d154-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Pessimistic Balance Debit & Concurrent Task Worker Queue',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from decimal import Decimal
from django.db import models, transaction, DatabaseError
from django.core.exceptions import ValidationError

class UserWallet(models.Model):
    user_id = models.UUIDField(unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2)

def debit_wallet_pessimistic(user_id, amount: Decimal) -> Decimal:
    with transaction.atomic():
        wallet = UserWallet.objects.select_for_update().get(user_id=user_id)
        if wallet.balance < amount:
            raise ValidationError("Insufficient wallet funds.")
        wallet.balance -= amount
        wallet.save(update_fields=['balance'])
        return wallet.balance`,
      explanation: 'Demonstrates select_for_update inside an atomic block to prevent concurrent balance overdrafts during race conditions.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b31-d154-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Building a High-Concurrency Flash-Sale Inventory Locker',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Implement an inventory allocation function that uses select_for_update(nowait=True) to attempt reserving stock during a high-contention flash sale, returning an immediate failure if another customer holds the lock.',
      instructions: [
        'Define an InventoryItem model with sku and available_stock.',
        'Implement reserve_stock_nowait(product_id, quantity) wrapped in transaction.atomic().',
        'Use select_for_update(nowait=True) to query the item and catch DatabaseError if locked.',
        'Decrement available_stock and save if sufficient stock exists.',
      ],
      expectedOutcome: 'Immediate non-blocking rejection when contending for a locked row during flash sales.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b31-d154-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Evaluating Row-Lock Storage & SKIP LOCKED Semantics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which of the following statements accurately characterizes PostgreSQL row-level locking and Django\'s select_for_update(skip_locked=True)?',
      options: [
        'PostgreSQL automatically escalates row locks to table locks once more than 10,000 rows are locked.',
        'PostgreSQL records row-lock information using tuple-level mechanisms (xmax/infomasks) while also acquiring the required table-level lock associated with the locking clause; skip_locked=True produces an intentionally inconsistent view suited for queue workers.',
        'skip_locked=True guarantees a transactionally consistent snapshot across all tables in a financial ledger.',
        'select_for_update() can be called safely outside transaction.atomic() blocks and retains locks until process exit.',
      ],
      correctIndex: 1,
      explanation: 'PostgreSQL records row locks in tuple headers without automatic table lock escalation, while acquiring the required ROW SHARE table lock. skip_locked=True skips locked rows and produces an intentionally partial view suited specifically for task queues.',
      misconceptionIdentified: 'Believing that PostgreSQL has SQL Server-style automatic lock escalation or that SKIP LOCKED provides consistent snapshot reads.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b31-d154-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Trade-offs: Blocking vs NOWAIT vs SKIP LOCKED',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how choosing between standard blocking select_for_update(), nowait=True, and skip_locked=True dictates the architecture and failure modes of high-throughput services.',
      guidingQuestions: [
        'Why would using blocking select_for_update() in a 10,000 req/sec flash sale lead to HTTP request thread pool exhaustion?',
        'In what scenarios does skip_locked=True completely eliminate worker lock contention?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b31-d154-06',
      type: 'REFERENCE',
      order: 6,
      title: 'PostgreSQL Row Locking & Django ORM Syntax Reference',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: Explicit Locking',
          url: 'https://www.postgresql.org/docs/current/explicit-locking.html',
        },
        {
          title: 'Django 6.0 Documentation: QuerySet.select_for_update()',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/querysets/#select-for-update',
        },
      ],
      documentationExtracts: [
        'FOR UPDATE: Causes the rows retrieved by the SELECT statement to be locked as though for update. This prevents them from being locked, modified or deleted by other transactions.',
        'SKIP LOCKED: Any row that cannot be locked immediately is skipped. This is designed for building queues without lock contention.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 155: BUILD — Deadlock Mechanics, Graph Cycles, Detection & Complete-Transaction Retries ──
export const DAY_155_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w31-031',
  dayNumber: 3,
  title: 'Deadlock Mechanics, Graph Cycles, Detection & Complete-Transaction Retries',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b31-d155-01',
      type: 'THEORY',
      order: 1,
      title: 'Wait-For Graph Cycles, PostgreSQL Deadlock Detection & Complete-Transaction Replay Architecture',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master deadlock resolution and prevention in PostgreSQL 18 and Django 6.0: relational wait-for graphs, deadlock_timeout detection mechanics, deterministic resource sorting, and the complete-transaction retry protocol catching SQLSTATE 40P01 and 40001 with explicit rollback, exponential backoff, and full jitter.',
      whatItIs: 'A deadlock occurs when two or more transactions each hold a lock that the other needs, creating an unresolvable circular dependency:\n1. Relational Deadlock Mechanics & Wait-For Graphs:\n   - Transaction 1 locks Row A and requests Row B.\n   - Transaction 2 locks Row B and requests Row A.\n   - Neither transaction can proceed; both wait indefinitely, forming a closed cycle in the database wait-for graph.\n2. PostgreSQL Deadlock Detection & deadlock_timeout:\n   - PostgreSQL does not run cycle detection on every lock request (doing so would devastate throughput).\n   - When a transaction must wait for a lock, it starts a timer governed by deadlock_timeout (default: 1000ms / 1 second).\n   - If the lock is not granted before the timer expires, PostgreSQL executes cycle detection across active lock waiters.\n   - If a cycle is detected, PostgreSQL breaks the cycle by aborting one transaction with SQLSTATE 40P01 (deadlock_detected).\n3. Prevention: Deterministic Resource Sorting:\n   - Applications prevent deadlocks by sorting resource keys in ascending order before acquiring locks (e.g. locking Account min(id1, id2) before max(id1, id2)).\n   - This eliminates circular dependency: all transactions request resources in identical order.\n4. Remediation: Complete-Transaction Retry Pattern:\n   - Deadlocks and serialization failures cannot be recovered mid-transaction because the database server aborts the transaction.\n   - The retry logic must wrap the complete database transaction:\n     * Catch SQLSTATE 40P01 (deadlock_detected) and retryable SQLSTATE 40001 (serialization_failure).\n     * Issue an explicit ROLLBACK to terminate the aborted transaction.\n     * Re-execute all initial reads, domain logic, decisions, and writes from the very beginning with exponential backoff and full random jitter.\n5. The Generic Web Middleware Warning:\n   - Generic HTTP web middleware cannot blindly retry arbitrary HTTP POST requests upon deadlock because upstream non-idempotent side effects (payment gateway authorizations, SMS alerts, outbound emails) would be duplicated.\n   - Retries must be strictly localized to idempotent transaction boundaries.',
      whyItExists: 'Deadlocks are inevitable in high-concurrency systems with multi-row updates. Designing deterministic ordering and robust complete-transaction retries guarantees operational resiliency.',
      problemSolved: 'Eliminates stalled transaction cascades, unhandled 500 server crashes from 40P01 errors, and partial state corruption.',
      mentalModel: 'The Narrow Two-Way Bridge & Escrow Replay: Two cars meet on a one-lane bridge from opposite directions. Neither can move forward without the other reversing. Deterministic sorting is a rule: "The vehicle heading north always crosses first," preventing the gridlock entirely. Complete-transaction retry is: if a standoff occurs, one driver throws the car into reverse back to the entrance gate (ROLLBACK), waits a random few seconds, re-checks the bridge signals (fresh reads), and re-crosses from scratch.',
      realWorldUse: 'Inter-account fund transfers, order fulfillment reserving multiple line-item inventory SKUs, and batch reconciliation jobs.',
      commonMistakes: [
        'Attempting to catch 40P01 inside a try/except block without executing an explicit ROLLBACK or exiting the transaction, leaving the PostgreSQL connection broken with "current transaction is aborted".',
        'Retrying only the failed SQL write statement rather than the entire transaction, which operates on stale read data and violates business invariants.',
        'Implementing generic HTTP middleware that retries all POST requests, causing duplicate credit card charges or duplicate emails when a database deadlock occurs.',
        'Retrying without random jitter, causing synchronized transactions to collide and deadlock repeatedly (thundering herd contention).',
      ],
      commonMisconceptions: [
        'Deadlocks indicate a bug in the PostgreSQL database engine (deadlocks are an expected mathematical outcome of concurrent multi-resource locking).',
        'Setting deadlock_timeout to a smaller value prevents deadlocks (it only makes PostgreSQL check for cycles sooner, increasing CPU overhead).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b31-d155-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Deterministic Key Ordering & Complete-Transaction Retry Harness',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `import time, random
from decimal import Decimal
from django.db import models, transaction, OperationalError

class Account(models.Model):
    balance = models.DecimalField(max_digits=12, decimal_places=2)

def transfer_deterministic(source_id: int, dest_id: int, amount: Decimal):
    first_id, second_id = sorted([source_id, dest_id])
    with transaction.atomic():
        first = Account.objects.select_for_update().get(id=first_id)
        second = Account.objects.select_for_update().get(id=second_id)
        src = first if first.id == source_id else second
        dst = second if first.id == source_id else first
        if src.balance < amount:
            raise ValueError("Insufficient balance")
        src.balance -= amount
        dst.balance += amount
        src.save(update_fields=['balance'])
        dst.save(update_fields=['balance'])`,
      explanation: 'Demonstrates deterministic lock ordering by sorting resource IDs in ascending order, eliminating circular wait-for graph cycles.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b31-d155-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Implementing Full Transaction Replay for Multi-Item Order Reservation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Build a multi-product order reservation function that accepts a list of product IDs and quantities, sorts product IDs to prevent deadlock cycles, locks rows via select_for_update(), and wraps the operation in a transaction retry harness.',
      instructions: [
        'Sort product items by ID ascending prior to acquiring locks.',
        'Open transaction.atomic() and acquire select_for_update locks in sorted order.',
        'Verify stock for all requested products before updating any row.',
        'Catch OperationalError for 40P01 and 40001, executing complete transaction replay with jittered backoff.',
      ],
      expectedOutcome: 'Zero deadlock aborts under concurrent overlapping item reservations.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b31-d155-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Deadlock Detection & Complete-Transaction Retry Boundaries',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'When a database transaction aborts with SQLSTATE 40P01 (deadlock detected), what is the mandatory recovery protocol?',
      options: [
        'Retry only the failed SQL UPDATE statement inside the current transaction connection.',
        'Deploy generic web middleware that catches the exception and retries the HTTP POST request immediately.',
        'Issue an explicit ROLLBACK to terminate the aborted transaction, wait with exponential backoff and jitter, and replay the entire transaction (reads, logic, and writes) from the beginning.',
        'Increase deadlock_timeout to 60 seconds so the database will never abort transactions.',
      ],
      correctIndex: 2,
      explanation: 'A 40P01 error marks the transaction aborted by PostgreSQL; the connection cannot execute further statements until rolled back. Recovery requires re-running the entire transaction from scratch with backoff and jitter.',
      misconceptionIdentified: 'Believing that an aborted transaction can be continued by retrying only the individual failing SQL statement.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b31-d155-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Defense: Why Prevention Beats Detection',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why deterministic resource ordering is far superior to relying on PostgreSQL deadlock_timeout and retries in high-throughput architectures.',
      guidingQuestions: [
        'How does a 1-second deadlock_timeout impact latency percentiles (p99) when 5% of concurrent requests trigger wait-for cycles?',
        'Why does deterministic key sorting eliminate deadlock cycles entirely before the database engine is even involved?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b31-d155-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Deadlock Diagnostics & SQLSTATE Reference',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: Deadlocks',
          url: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-DEADLOCKS',
        },
        {
          title: 'PostgreSQL Error Codes: SQLSTATE 40P01 & 40001',
          url: 'https://www.postgresql.org/docs/current/errcodes-appendix.html',
        },
      ],
      documentationExtracts: [
        'SQLSTATE 40P01: deadlock_detected. The current transaction has been chosen as a deadlock victim and aborted.',
        'SQLSTATE 40001: serialization_failure. Transaction could not serialize access due to concurrent update conflicts.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 156: DEBUG — Optimistic Concurrency Control (OCC) & Lost Update Mitigation ──
export const DAY_156_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w31-031',
  dayNumber: 4,
  title: 'Optimistic Concurrency Control (OCC) & Lost Update Mitigation',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b31-d156-01',
      type: 'THEORY',
      order: 1,
      title: 'Pessimistic vs Optimistic Concurrency, Lost Update Anomalies & Atomic CAS with F() Expressions',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Optimistic Concurrency Control (OCC) in Django 6.0 and PostgreSQL 18: comparing pessimistic locking overhead against OCC scalability, diagnosing the classic lost update anomaly in read-modify-write loops, implementing integer versioning fields, and executing conditional compare-and-swap (CAS) queries using atomic F() expressions.',
      whatItIs: 'Optimistic Concurrency Control (OCC) is a concurrency control paradigm where transactions execute without acquiring row-level locks, validating at write time whether another transaction modified the row:\n1. Pessimistic vs Optimistic Trade-Offs:\n   - Pessimistic Locking (select_for_update): Locks rows during read. Ideal for high-contention, high-cost conflict scenarios (e.g. money debiting), but causes connection waiting and thread pool saturation.\n   - Optimistic Locking (OCC): No locks held during read. Scalable for read-heavy, low-to-moderate contention domains (e.g. document editing, profile updates, product catalog revisions).\n2. The Lost Update Anomaly:\n   - Thread A reads Product (stock=10).\n   - Thread B reads Product (stock=10).\n   - Thread A deducts 2, saves stock=8.\n   - Thread B deducts 3, saves stock=7, overwriting Thread A\'s change! 2 items vanished from inventory.\n3. OCC Implementation via Version Fields:\n   - Add an integer version column: version = models.IntegerField(default=0).\n   - Every modification verifies the row still matches the version observed at read time, and atomically increments it.\n4. Conditional Compare-and-Swap (CAS) with Django F() Expressions:\n   - Instead of instance.save(), execute an atomic UPDATE query:\n     ```python\n     updated_rows = Product.objects.filter(\n         id=product_id,\n         version=current_version,\n         stock__gte=quantity\n     ).update(\n         stock=F(\'stock\') - quantity,\n         version=F(\'version\') + 1\n     )\n     if updated_rows == 0:\n         raise ConcurrencyConflictError(\"Concurrent modification detected; retry.\")\n     ```\n   - If another transaction modified the row first, updated_rows returns 0. The application detects the conflict without locks and retries gracefully.',
      whyItExists: 'OCC allows high-throughput read operations without acquiring database locks, maximizing database connection concurrency while strictly preventing lost updates.',
      problemSolved: 'Eliminates lost update bugs caused by naive ORM .save() calls without the performance penalty of holding pessimistic database locks.',
      mentalModel: 'The Document Version Stamp: Two editors download Version 5 of a policy document to edit on their laptops. Editor A submits changes first; the server accepts them and increments the master document to Version 6. When Editor B attempts to submit changes tagged with Version 5, the server rejects them: "Your copy is based on outdated Version 5. Fetch Version 6 and reapply your edits."',
      realWorldUse: 'Wiki/CMS content editing, distributed document collaboration, shopping cart checkouts, and CRM contact record updates.',
      commonMistakes: [
        'Relying on model.save() after doing in-memory modifications on a versioned model, which issues an unconditional UPDATE statement and overwrites concurrent edits.',
        'Forgetting to check the return value of queryset.update() (if it returns 0, the CAS condition failed and an exception must be raised).',
        'Using OCC for high-contention resources (e.g. popular concert tickets) where hundreds of clients conflict simultaneously, causing high retry failure rates.',
        'Not including business predicates (e.g. stock__gte=quantity) directly in the atomic UPDATE query.',
      ],
      commonMisconceptions: [
        'OCC requires a database plugin or third-party package (it is natively implemented via standard SQL WHERE clauses and F() expressions).',
        'OCC completely replaces database transactions (OCC queries still benefit from transaction boundaries for multi-table atomicity).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b31-d156-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Diagnosing Lost Updates & Implementing Atomic Version CAS',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models
from django.db.models import F

class ProductCatalog(models.Model):
    stock = models.IntegerField(default=0)
    version = models.IntegerField(default=0)

def atomic_occ_purchase(product_id: int, quantity: int, current_version: int) -> bool:
    updated = ProductCatalog.objects.filter(
        id=product_id,
        version=current_version,
        stock__gte=quantity
    ).update(
        stock=F('stock') - quantity,
        version=F('version') + 1
    )
    return updated == 1`,
      explanation: 'Uses atomic F() expressions with conditional version checks to execute compare-and-swap update preventing lost updates without locks.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b31-d156-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Refactoring Naive User Profile Updates to OCC with Version Checks',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Refactor a vulnerable user settings update endpoint to use an integer version field and atomic F() expressions, raising ConcurrencyConflictError if a concurrent update occurs.',
      instructions: [
        'Add version = models.IntegerField(default=0) to UserProfile.',
        'Update profile with filter(id=user_id, version=expected_version).',
        'Use F("version") + 1 in update() payload.',
        'Raise ConcurrencyConflictError if updated rows equals 0.',
      ],
      expectedOutcome: 'Zero lost updates when multiple sessions update user profiles simultaneously.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b31-d156-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Comparing Pessimistic Locking vs Optimistic Version CAS',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Under what system conditions is Optimistic Concurrency Control (OCC) with atomic version verification preferred over pessimistic row locking (select_for_update)?',
      options: [
        'When write contention is extremely high and all conflicting transactions must queue up sequentially.',
        'In read-heavy domains with low-to-moderate write contention where holding open database locks would saturate connection pools.',
        'When transactions require table-level exclusive locks across all relations.',
        'When the database engine does not support relational transactions.',
      ],
      correctIndex: 1,
      explanation: 'OCC is optimal for read-heavy, low-to-moderate contention domains because it allows readers to query data without locking rows, validating consistency only at update time.',
      misconceptionIdentified: 'Believing pessimistic locking is universally better than OCC regardless of read/write access ratios.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b31-d156-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Designing for Contention: Matching Locking Patterns to Domain Reality',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how an e-commerce platform should combine both pessimistic locking and optimistic locking in different subsystems.',
      guidingQuestions: [
        'Why would you use OCC for user profile and shipping address updates, but pessimistic select_for_update() for warehouse inventory reservation?',
        'What metrics would you monitor in production to decide when an OCC endpoint has outgrown optimistic retries and requires queue-based serialization?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b31-d156-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Django F() Expressions & Atomic Updates Reference',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: F() expressions and avoiding race conditions',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/expressions/#f-expressions',
        },
        {
          title: 'PostgreSQL 18 Documentation: Concurrency Control',
          url: 'https://www.postgresql.org/docs/current/mvcc.html',
        },
      ],
      documentationExtracts: [
        'F() expressions: Avoid race conditions by allowing the database rather than Python memory to calculate the updated value at SQL execution time.',
        'QuerySet.update(): Performs an update query directly against the database and returns the number of rows affected.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 157: TRANSFER — High-Concurrency Seat Reservation Engine & Formative Assessment ──
export const DAY_157_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w31-031',
  dayNumber: 5,
  title: 'High-Concurrency Seat Reservation Engine & Formative Assessment',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b31-d157-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Batch 031 Capstone Challenge: Stadium Seat Reservation Engine',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'High-contention championship stadium ticketing where 50,000 concurrent fans attempt to purchase adjacent seat blocks during flash release windows.',
      task: 'Synthesize pessimistic row locking, deterministic deadlock sorting, savepoint error boundaries, outermost on_commit notifications, and optimistic CAS verification into an enterprise stadium seat reservation engine guaranteeing zero overselling under adversarial concurrency.',
      constraints: [
        'Zero overselling under the defined reservation transaction protocol and adversarial concurrency test fixture.',
        'Must sort seat IDs in ascending order prior to acquiring locks to prevent wait-for graph cycles.',
        'Must use select_for_update() inside transaction.atomic() to verify seat status before reservation.',
        'Must register external booking confirmation notifications strictly via transaction.on_commit().',
        'Must implement complete transaction retry handling for SQLSTATE 40P01 and 40001 with jittered exponential backoff.',
      ],
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 60,
      targetCompetencyId: COMPETENCY_ID_DATABASE_TRANSACTIONS,
    } as TransferChallengeBlock,
    {
      id: 'blk-b31-d157-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Synthesizing Concurrency Invariants & On-Commit Guarantees',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In the stadium seat reservation architecture, why must notification dispatch be registered via transaction.on_commit() rather than called directly after seat.save()?',
      options: [
        'on_commit() runs the notification inside the database transaction so the database engine can verify the email sent.',
        'Calling the notification directly inside the transaction would send booking confirmation emails even if a subsequent seat conflict rolls back the entire transaction.',
        'on_commit() automatically catches and resolves database deadlocks.',
        'Django models forbid sending HTTP requests unless wrapped in on_commit().',
      ],
      correctIndex: 1,
      explanation: 'Calling side effects inside a transaction causes phantom notifications if the transaction subsequently encounters an error or rolls back. on_commit() ensures callbacks fire only after successful database commit.',
      misconceptionIdentified: 'Believing that database rollback can recall or undo external network side effects like emails or webhooks.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b31-d157-03',
      type: 'REFLECTION',
      order: 3,
      title: 'Batch 031 Capstone Reflection: The Disciplined Concurrency Engineer',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how mastering ACID guarantees, row-level locks, deadlock prevention, complete-transaction retries, and optimistic concurrency transforms you into a backend engineer trusted with financial and mission-critical systems.',
      guidingQuestions: [
        'How do the techniques learned in Batch 031 distinguish senior backend architects from developers who only write simple CRUD applications?',
        'Why is rigorous adversarial concurrency testing essential before deploying high-traffic transaction code to production?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b31-d157-04',
      type: 'REFERENCE',
      order: 4,
      title: 'Batch 031 Architecture Summary & Concurrency Invariants',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: Concurrency Control',
          url: 'https://www.postgresql.org/docs/current/mvcc.html',
        },
        {
          title: 'Django 6.0 Documentation: Database Transactions',
          url: 'https://docs.djangoproject.com/en/6.0/topics/db/transactions/',
        },
      ],
      documentationExtracts: [
        'Concurrency Invariant: Zero overselling under the defined reservation transaction protocol and adversarial concurrency test fixture.',
        'Locking Order: Always sort resource identifiers in ascending sequence before acquiring locks to mathematically eliminate wait-for graph cycles.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 031 FORMATIVE ASSESSMENT (DAY 157) ──
export const DAY_157_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m8-w31-031',
  moduleId: 'module-pfs-m8',
  courseId: 'course-python-fullstack',
  title: 'Batch 031 Formative Assessment: High-Concurrency Seat Reservation Engine',
  description: 'Synthesize ACID guarantees, row-level pessimistic locking, deadlock cycle prevention, complete-transaction retries, and on_commit notification dispatch in a high-concurrency stadium ticketing system.',
  type: 'FORMATIVE',
  mode: 'FORMATIVE',
  passingScore: 80,
  maxScore: 100,
  timeLimitMinutes: 60,
  rubric: [
    {
      id: 'rub-b31-01',
      criteria: 'Concurrency Safety & Pessimistic Row Locking',
      weight: 0.20,
      description: 'Disciplined use of select_for_update() inside atomic transaction blocks to prevent race conditions and lost updates.',
    },
    {
      id: 'rub-b31-02',
      criteria: 'Deadlock Cycle Prevention via Deterministic Key Ordering',
      weight: 0.20,
      description: 'Deterministic ascending sorting of resource IDs prior to locking, mathematically eliminating wait-for cycles.',
    },
    {
      id: 'rub-b31-03',
      criteria: 'Outermost on_commit() Notification Dispatch',
      weight: 0.20,
      description: 'Strict separation of external side effects via transaction.on_commit(), preventing phantom actions upon transaction rollback.',
    },
    {
      id: 'rub-b31-04',
      criteria: 'Idempotent Reservation Execution & CAS Validation',
      weight: 0.20,
      description: 'Atomic status transitions, compare-and-swap validation, and prevention of double-booking or overselling.',
    },
    {
      id: 'rub-b31-05',
      criteria: 'Error Recovery, Savepoint Rollback & Complete-Tx Replay',
      weight: 0.20,
      description: 'Clean rollback handling on contention and full-transaction retry logic with exponential jittered backoff for 40P01/40001.',
    },
  ],
  questions: [
    {
      id: 'q-b31-01',
      questionText: 'Explain how deterministic ascending key sorting prevents deadlock cycles when concurrent transactions reserve overlapping resources.',
      expectedAnswerSnippet: 'Sorting resource keys before locking forces all transactions to acquire locks in identical order, eliminating circular wait-for dependencies in the database graph.',
      points: 20,
    },
  ],
};

// ── BATCH 031 MANIFEST (COMPLETE BATCH · DAYS 153–157 · 425 MIN) ──
export const BATCH_031_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m8-w31-031',
  batchCode: 'P2-M8-W31-BATCH031',
  title: 'Database Transactions, Row-Level Locking, Deadlock Resolution & Concurrency Control',
  difficulty: 'ADVANCED',
  days: [
    DAY_153_MANIFEST,
    DAY_154_MANIFEST,
    DAY_155_MANIFEST,
    DAY_156_MANIFEST,
    DAY_157_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-09T00:00:00.000Z',
  updatedAt: '2026-09-10T00:00:00.000Z',
};
