// src/lib/curriculum/pythonFullStack/batch031.ts
// Single Source of Truth for PINIT BATCH 031 (PARTIAL · DAY 153 · HORIZON END): Month 8 · Week 31 · Day 1
// Database Transactions, ACID Guarantees & Concurrency Control in Django 6.0
// Pedagogical Flow: UNDERSTAND (ACID Properties, Isolation Levels & transaction.atomic())
// STRICT SCOPE BOUNDARY: Day 153 covers ACID properties, PostgreSQL isolation levels, transaction.atomic(), and outermost on_commit() semantics.
// Day 154+ (Pessimistic locking, select_for_update, deadlock defense, and performance indexing) is deferred to the next horizon.

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';

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

// ── BATCH 031 MANIFEST (PARTIAL BATCH · DAY 153 · HORIZON END · 85 MIN) ──
export const BATCH_031_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m8-w31-031',
  batchCode: 'P2-M8-W31-BATCH031',
  title: 'Database Transactions, ACID Guarantees & Concurrency Control in Django',
  difficulty: 'ADVANCED',
  days: [
    DAY_153_MANIFEST,
  ],
  isPartial: true,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-09T00:00:00.000Z',
  updatedAt: '2026-09-09T00:00:00.000Z',
};
