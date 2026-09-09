// src/lib/curriculum/pythonFullStack/batch029.ts
// Single Source of Truth for PINIT BATCH 029 (COMPLETE · DAYS 143–147): Month 8 · Week 29 · Days 1–5
// PostgreSQL 18 Relational Schemas, Constraints & Advanced Data Types in Django 6.0
// Pedagogical Flow: UNDERSTAND (Normalization & Storage) -> APPLY (Production Constraints) -> BUILD (Advanced Types & JSONB) -> DEBUG (Integrity & Bloat) -> TRANSFER (Formative Assessment: Append-Oriented Ledger)

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

export const COMPETENCY_ID_POSTGRES_SCHEMAS_AND_TYPES = 'comp-pfs-m8-029';

// ── DAY 143: UNDERSTAND — Relational Engine Architecture, Normalization & PostgreSQL Storage Internals ──
export const DAY_143_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w29-029',
  dayNumber: 1,
  title: 'Relational Engine Architecture, Normalization & PostgreSQL Storage Internals',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b29-d143-01',
      type: 'THEORY',
      order: 1,
      title: 'Relational Normalization Theory, MVCC Tuple Visibility & PostgreSQL Storage Fundamentals',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master relational data modeling and PostgreSQL 18 storage engine fundamentals on Python 3.14: 1NF through BCNF normalization trade-offs, controlled denormalization for read optimization, standard 8KB page/block heap storage, Multi-Version Concurrency Control (MVCC) tuple visibility (xmin/xmax), dead tuple accumulation, VACUUM maintenance, and the row-threshold TOAST activation model.',
      whatItIs: 'PostgreSQL 18 is an ACID-compliant object-relational database management system:\n1. Relational Normalization Invariants:\n   - 1NF: All attributes contain atomic (indivisible) values; no repeating groups.\n   - 2NF: In 1NF and every non-key attribute is fully functionally dependent on the primary key (eliminates partial key dependencies).\n   - 3NF: In 2NF and no non-key attribute is transitively dependent on the primary key (X -> Y -> Z eliminated).\n   - BCNF: A stricter version of 3NF where every determinant must be a candidate key.\n   - Controlled Denormalization: Consciously introducing redundant columns (e.g. caching total_amount on Order) to avoid expensive multi-table joins on high-throughput read paths, balanced against write amplification and synchronization complexity.\n2. PostgreSQL Storage Engine Internals (Conceptual Foundation):\n   - Standard Page/Block Size: PostgreSQL stores table and index data in fixed-size blocks (default 8KB in standard builds). Each page contains a page header, item pointers (line pointers), free space, and heap tuples.\n   - Heap Tuples: A tuple consists of a header (containing xmin, xmax, infomask flags) and user data attributes.\n3. Multi-Version Concurrency Control (MVCC) & Dead Tuples:\n   - When a row is updated in PostgreSQL, the engine does NOT overwrite the existing row in place. Instead, it writes a new version of the tuple and marks the old tuple with xmax = current_transaction_id.\n   - Dead Tuples: Once all active transactions can no longer see the old tuple version, it becomes a "dead tuple".\n   - VACUUM & Autovacuum: Routine maintenance processes reclaim dead tuple space within 8KB pages so future inserts/updates can reuse it, preventing catastrophic table bloat.\n4. Accurate TOAST Row-Threshold Model:\n   - The Oversized-Attribute Storage Technique (TOAST) activates when the stored row exceeds the applicable threshold (TOAST_TUPLE_THRESHOLD, normally around 2 KB in standard configurations).\n   - Wide, compressible column values (e.g. long text, JSONB, bytea) are first compressed inline. If the row remains too wide, chunks are moved out-of-line into a separate TOAST table, preserving fixed-size fast scanning in the primary heap.',
      whyItExists: 'Provides foundational understanding of how relational theory and database physical storage models explain observable application performance, disk utilization, and transaction behavior.',
      problemSolved: 'Eliminates data redundancy and update anomalies via normalization, while explaining disk bloat, dead tuple buildup, and wide-column latency.',
      mentalModel: 'The Physical Archive Filing Cabinet: The database is a room of filing cabinets. Each drawer holds folders of exactly 8KB capacity (Pages). Inside each folder are paper documents (Tuples). When a document is revised (UPDATE), the clerk does not erase the paper with pencil; they stamp "SUPERSEDED" on the old page (xmax) and file a brand-new page (new tuple). At night, the janitorial crew (autovacuum) sweeps the folders, shredding superseded papers to free space for tomorrow\'s filings. If a file is too thick to fit in the folder (>2KB TOAST threshold), it is placed in an overflow locker down the hall (TOAST table) with an index slip in the folder.',
      realWorldUse: 'High-throughput transactional databases, enterprise SaaS data models, and large-scale billing engines.',
      commonMistakes: [
        'Prematurely denormalizing schemas before establishing clean 3NF relational boundaries, leading to data inconsistency and orphan records.',
        'Assuming UPDATE statements modify records in-place without disk I/O overhead (PostgreSQL updates are append operations creating dead tuples).',
        'Disabling autovacuum in production because of CPU concerns, leading to massive table bloat and degraded query performance.',
        'Assuming every individual column over 2KB triggers TOAST (TOAST activates based on total row width exceeding the row threshold).',
      ],
      commonMisconceptions: [
        'Normalization makes queries slower in all cases (proper normalization reduces row width, allowing more tuples per 8KB page and increasing buffer pool cache efficiency).',
        'PostgreSQL deletes rows immediately from disk upon DELETE (rows are marked dead and only reclaimed when VACUUM runs).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b29-d143-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Normalized Enterprise Schema vs Controlled Denormalization in Django',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models
from decimal import Decimal

# ── 3NF NORMALIZED RELATIONAL DESIGN ──
class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    # Controlled Denormalization: Caching total_amount on the order table
    # to avoid summing thousands of OrderItem rows on every invoice listing.
    # Invariant: Must be strictly maintained via atomic transaction hooks.
    cached_total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        db_index=True
    )

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_sku = models.CharField(max_length=64)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    @property
    def line_total(self) -> Decimal:
        return self.unit_price * self.quantity`,
      explanation: 'Illustrates clean 3NF relational design separating Customers, Orders, and OrderItems, with explicit, disciplined controlled denormalization of order totals bounded by clear application synchronization invariants.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b29-d143-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Evaluating Normalization Forms & Observable MVCC Behavior',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Normalize a flat spreadsheet-style customer invoice table into 3NF entities and explain how frequent updates impact PostgreSQL MVCC dead tuple accumulation.',
      instructions: [
        'Analyze an unnormalized Invoice table containing repeating item columns and customer address details.',
        'Decompose the table into 3 distinct 3NF models: Customer, Invoice, and InvoiceLineItem.',
        'Define appropriate primary keys and foreign key constraints enforcing referential integrity.',
        'Explain in a written analysis why updating a customer address on a normalized Customer table creates only 1 dead tuple, whereas updating it across 10,000 flat invoice rows creates 10,000 dead tuples in PostgreSQL.',
      ],
      hints: [
        '1NF requires eliminating repeating column groups like item_1_name, item_2_name.',
        '2NF requires that all non-key fields depend on the whole primary key.',
        '3NF requires removing transitive dependencies like customer_city depending on customer_id rather than invoice_id.',
      ],
      expectedOutcome: 'A clean 3NF decomposition and an articulate engineering explanation connecting relational normalization to physical MVCC dead-tuple minimization.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b29-d143-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: PostgreSQL Storage & MVCC Visibility',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'When a row in a PostgreSQL table is modified using an UPDATE statement, what physical action does the PostgreSQL storage engine execute?',
      options: [
        'It inserts a brand-new tuple version with the updated data and writes the current transaction ID to the xmax field of the old tuple, leaving the old tuple to be reclaimed later by VACUUM.',
        'It overwrites the bytes in place inside the existing 8KB disk page without altering any transaction metadata.',
        'It immediately deletes the old row from the disk block and defragments the entire table file.',
        'It moves the entire row to a TOAST table regardless of row width.',
      ],
      correctIndex: 0,
      explanation: 'Under PostgreSQL MVCC, an UPDATE does not overwrite in-place. It creates a new tuple version and sets the xmax on the old tuple. Once all transactions that could see the old tuple complete, the old tuple becomes dead and can be reclaimed by VACUUM.',
      misconceptionIdentified: 'Believing that relational database updates overwrite disk bytes in-place like file systems.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b29-d143-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Storage Internals as a Diagnostic Tool',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how understanding PostgreSQL\'s 8KB page architecture and MVCC model helps you diagnose query latency without having to guess.',
      guidingQuestions: [
        'Why does a query on a table with 90% dead tuples run significantly slower than on a vacuumed table with the same number of active rows?',
        'How does keeping row sizes below the TOAST threshold improve table scan throughput?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b29-d143-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 029 Reference Sheet: Relational Theory & PostgreSQL Storage',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: Chapter 73 — Database Physical Storage',
          url: 'https://www.postgresql.org/docs/current/storage.html',
        },
        {
          title: 'PostgreSQL 18 Documentation: TOAST (The Oversized-Attribute Storage Technique)',
          url: 'https://www.postgresql.org/docs/current/storage-toast.html',
        },
      ],
      documentationExtracts: [
        'Page Layout: PostgreSQL table data is stored in arrays of 8KB blocks. Tuple headers record xmin (creation transaction) and xmax (deletion/supersession transaction).',
        'TOAST Threshold: TOAST activates when a row exceeds TOAST_TUPLE_THRESHOLD (normally around 2 KB). Large compressible attributes are compressed or moved out-of-line.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 144: APPLY — Production Constraint Engineering: Check, Unique & Exclusion Constraints ──
export const DAY_144_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w29-029',
  dayNumber: 2,
  title: 'Production Constraint Engineering: Check, Unique & Exclusion Constraints',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b29-d144-01',
      type: 'THEORY',
      order: 1,
      title: 'Database Constraints in Django 6.0 & PostgreSQL Referential Integrity Actions',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Implement enterprise database constraints in Django 6.0 on Python 3.14 with PostgreSQL 18: declarative CheckConstraint with Q expressions, partial UniqueConstraint with conditional filters, ExclusionConstraint with GiST indexes for temporal ranges, and precise foreign key deletion semantics (PROTECT, RESTRICT, NO ACTION deferral, CASCADE).',
      whatItIs: 'Database constraints guarantee structural and domain integrity at the lowest physical layer:\n1. Declarative Check Constraints (models.CheckConstraint):\n   - Enforces boolean validation logic in PostgreSQL DDL.\n   - Example: CheckConstraint(check=Q(end_date__gte=F("start_date")), name="check_valid_date_range").\n   - Guaranteed to execute on raw SQL, bulk inserts, and ORM operations.\n2. Partial & Conditional Unique Constraints (models.UniqueConstraint):\n   - Enforces uniqueness only over a subset of rows matching a condition.\n   - Example: UniqueConstraint(fields=["email", "tenant_id"], condition=Q(is_deleted=False), name="unique_active_tenant_email").\n   - Enables soft-delete architectures where historical deleted rows do not block active users from registering the same email.\n3. PostgreSQL Exclusion Constraints (django.contrib.postgres.constraints.ExclusionConstraint):\n   - Enforces that no two rows overlap across generalized operators (e.g. && overlap operator for ranges) using a GiST index.\n   - Solves the classic room booking or scheduling race condition: prevents two overlapping reservations for the same room without table locking.\n4. Precise Foreign Key Deletion Semantics (Django vs PostgreSQL):\n   - PROTECT: Django-side behavior. Prevents deletion by raising django.db.models.ProtectedError if referenced by dependent objects.\n   - RESTRICT: Django-side restricted-deletion semantics. Raises django.db.models.RestrictedError. In standard PostgreSQL SQL, RESTRICT is an immediate check that CANNOT be deferred.\n   - NO ACTION: PostgreSQL standard foreign key action. In PostgreSQL, NO ACTION checks integrity at the statement level, and MAY BE DEFERRED to the end of the transaction if declared DEFERRABLE INITIALLY DEFERRED.\n   - CASCADE: Deletes referencing dependent rows automatically.\n   - SET_NULL: Sets referencing foreign key columns to NULL (requires null=True).',
      whyItExists: 'Application-level validation (e.g. form.clean()) cannot prevent concurrent race conditions. Database constraints provide non-bypassable, hardware-level integrity invariants.',
      problemSolved: 'Eliminates concurrent booking collisions, prevents invalid temporal states, and provides mathematically sound referential integrity.',
      mentalModel: 'The Airport Turnstile & Air Traffic Control: An application form check is a flight attendant asking "Do you have your ticket?" A passenger can lie or two passengers can speak simultaneously. A database CheckConstraint is the physical turnstile that mechanically blocks entry if the ticket barcode is invalid. A PostgreSQL ExclusionConstraint is Air Traffic Control radar ensuring two aircraft never occupy the same airspace altitude and coordinate at the same time.',
      realWorldUse: 'Financial account balance bounds, room/vehicle reservation systems, soft-delete identity models, and healthcare appointment scheduling.',
      commonMistakes: [
        'Confusing RESTRICT with deferred checking (PostgreSQL RESTRICT is immediate and cannot be deferred; NO ACTION is the deferrable action).',
        'Confusing Django\'s on_delete=RESTRICT (which raises RestrictedError in Python) with database-level deferred constraint checking.',
        'Relying on Python if start_date < end_date checks to prevent overlapping reservations, which fails under concurrent HTTP requests due to race conditions.',
        'Forgetting to install the btree_gist extension in PostgreSQL when using ExclusionConstraint with combined scalar and range types.',
      ],
      commonMisconceptions: [
        'UniqueConstraint cannot handle soft-deleted records (conditional UniqueConstraints with condition=Q(is_deleted=False) fully support soft-delete designs).',
        'Database constraints slow down applications (constraints prevent invalid writes instantly and create specialized indexes that accelerate queries).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b29-d144-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Enterprise Room Reservation with Exclusion, Check & Partial Unique Constraints',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models
from django.db.models import Q, F
from django.contrib.postgres.constraints import ExclusionConstraint
from django.contrib.postgres.fields import DateTimeRangeField, RangeOperators

class ConferenceRoom(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(capacity__gt=0),
                name='check_room_capacity_positive'
            )
        ]

class RoomBooking(models.Model):
    room = models.ForeignKey(ConferenceRoom, on_delete=models.PROTECT, related_name='bookings')
    booked_by_email = models.EmailField()
    timespan = DateTimeRangeField()
    is_cancelled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            # 1. ExclusionConstraint: Prevent overlapping active bookings for the same room
            ExclusionConstraint(
                name='exclude_overlapping_room_bookings',
                expressions=[
                    ('room', RangeOperators.EQUAL),
                    ('timespan', RangeOperators.OVERLAPS),
                ],
                condition=Q(is_cancelled=False),
            ),
            # 2. Partial UniqueConstraint: Ensure booking email unique per timespan if active
            models.UniqueConstraint(
                fields=['room', 'timespan'],
                condition=Q(is_cancelled=False),
                name='unique_active_room_timespan'
            )
        ]`,
      explanation: 'Demonstrates real-world production constraint modeling combining models.CheckConstraint for scalar bounds, partial UniqueConstraint for active records, and PostgreSQL ExclusionConstraint using GiST for non-overlapping temporal ranges.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b29-d144-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Implementing Partial Unique & Exclusion Invariants',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Architect a medical appointment scheduling schema that enforces non-overlapping doctor appointment times and prevents duplicate active patient insurance claims.',
      instructions: [
        'Define a MedicalAppointment model with doctor foreign key, appointment_range (DateTimeRangeField), and status.',
        'Attach an ExclusionConstraint ensuring a doctor cannot have overlapping active appointments.',
        'Define an InsuranceClaim model with patient foreign key, claim_reference, and is_archived boolean.',
        'Attach a partial UniqueConstraint ensuring claim_reference is unique among unarchived claims.',
        'Verify that attempting to insert overlapping appointment records raises a database IntegrityError.',
      ],
      hints: [
        'ExclusionConstraint requires the btree_gist PostgreSQL extension in a migration.',
        'Use RangeOperators.EQUAL for foreign key matching and RangeOperators.OVERLAPS for the range field.',
      ],
      expectedOutcome: 'A rock-solid relational model that completely prevents double-booking and duplicate claims at the database engine level.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b29-d144-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Foreign Key Deletion Semantics in PostgreSQL',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In standard PostgreSQL foreign key actions, what is the critical technical difference between RESTRICT and NO ACTION regarding constraint evaluation?',
      options: [
        'RESTRICT enforces an immediate check that cannot be deferred, whereas NO ACTION checks at statement end and may be deferred to the end of the transaction if declared DEFERRABLE.',
        'RESTRICT automatically deletes dependent rows, whereas NO ACTION raises a ProtectedError in Python.',
        'RESTRICT is only evaluated in memory, whereas NO ACTION writes to the WAL log.',
        'There is no technical difference; they are exact aliases in PostgreSQL.',
      ],
      correctIndex: 0,
      explanation: 'PostgreSQL explicitly defines RESTRICT as an immediate check that cannot be deferred. In contrast, NO ACTION allows constraint checking to be deferred until the transaction commits if the constraint is created with DEFERRABLE INITIALLY DEFERRED.',
      misconceptionIdentified: 'Believing that RESTRICT is a deferrable constraint check.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b29-d144-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Database Invariants vs Application Checks',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why senior backend engineers treat application-level validation as user experience (UX) and database constraints as security/integrity invariants.',
      guidingQuestions: [
        'What happens when two simultaneous requests pass form.is_valid() concurrently before either has written to the database?',
        'Why can background worker jobs or batch scripts bypass Django forms entirely but never bypass database constraints?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b29-d144-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 029 Reference Sheet: Production Database Constraints',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Model constraint reference',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/constraints/',
        },
        {
          title: 'PostgreSQL 18 Documentation: Constraints & Foreign Keys',
          url: 'https://www.postgresql.org/docs/current/ddl-constraints.html',
        },
      ],
      documentationExtracts: [
        'Exclusion Constraints: Ensure that if any two rows are compared on the specified columns using the specified operators, at least one of these operator comparisons will return false or null.',
        'Foreign Key Actions: RESTRICT prevents deletion immediately. NO ACTION prevents deletion at the end of the statement or transaction.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 145: BUILD — Advanced PostgreSQL Data Types in Django: JSONField, ArrayField & UUIDs ──
export const DAY_145_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w29-029',
  dayNumber: 3,
  title: 'Advanced PostgreSQL Data Types in Django: JSONField, ArrayField & UUIDs',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b29-d145-01',
      type: 'THEORY',
      order: 1,
      title: 'Specialized PostgreSQL Types: JSONB Querying, GIN Acceleration & UUID Architectures',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Architect specialized PostgreSQL 18 data types in Django 6.0 on Python 3.14: models.JSONField (JSONB binary format, nested key lookups, containment operators), Generalized Inverted Indexing (GIN) for query acceleration vs separate cryptographic digest fields, ArrayField operations, and primary key architectures comparing random UUIDv4 with time-ordered UUIDv7 and sequential BigAutoField.',
      whatItIs: 'PostgreSQL provides native support for complex, semi-structured, and specialized data types:\n1. PostgreSQL JSONB (models.JSONField):\n   - Stored in a decomposed binary format (JSONB) rather than raw text.\n   - Lookup syntax: data__audit__actor_id, containment lookups (data__contains={"status": "VERIFIED"}), and key existence (data__has_key="compliance_code").\n2. Indexing vs Cryptographic Integrity Boundary:\n   - GIN Index (django.contrib.postgres.indexes.GinIndex): Creates a Generalized Inverted Index over JSONB keys and values. GIN provides query acceleration; it does NOT provide cryptographic integrity or tampering defense.\n   - Cryptographic Evidence: Tamper-evident verification requires separate cryptographic digest fields (e.g. SHA-256 HMAC or cryptographic hash chains).\n3. ArrayField (django.contrib.postgres.fields.ArrayField):\n   - Stores homogeneous arrays of scalar types in a single column (e.g. ArrayField(models.CharField(max_length=50))).\n   - Supports array containment (tags__contains=["urgent"]), overlap (tags__overlap=["critical", "high"]), and len lookups.\n4. Primary Key Architectures: Sequential vs UUIDs:\n   - BigAutoField: Sequential 64-bit integer. Ideal for B-Tree index locality and high write throughput, but exposes predictable sequential counters.\n   - UUIDv4: Randomly generated 128-bit identifier. Prevents predictable sequential enumeration, but causes random B-Tree page splits under heavy write volume.\n   - UUIDv7 (PostgreSQL 18 native): Time-ordered UUID containing a Unix millisecond timestamp component, combining B-Tree index locality with global uniqueness.\n   - UUID Security Reality: UUIDs reduce predictable identifier enumeration, but they do NOT prevent IDOR or replace server-side object authorization.',
      whyItExists: 'Allows applications to combine rigid relational integrity with flexible semi-structured document storage and robust, globally unique identity architectures.',
      problemSolved: 'Eliminates entity-attribute-value (EAV) relational anti-patterns, accelerates semi-structured queries with GIN indexes, and resolves primary key enumeration vulnerabilities.',
      mentalModel: 'The Passport Document with Digital Chip: A relational row is the printed passport page with strict fields (Name, Birthdate). JSONField is the embedded RFID microchip storing flexible visa stamps and biometric metadata. A GIN index is the rapid airport scanner that instantly finds every traveler with a specific visa stamp. The cryptographic digest is the digital hologram signature across the page: changing a single bit in the chip invalidates the hologram, proving tampering.',
      realWorldUse: 'Audit log event payloads, multi-tenant configuration profiles, payment gateway raw responses, and e-commerce dynamic product attributes.',
      commonMistakes: [
        'Assuming a GIN index on a JSONB column provides cryptographic immutability (GIN is an indexing mechanism for search acceleration; integrity requires cryptographic digests).',
        'Believing UUID primary keys eliminate the need for object-level authorization (attackers who obtain a UUID can still exploit IDOR if access controls are absent).',
        'Using raw text JSON columns instead of PostgreSQL binary JSONB (models.JSONField in modern Django uses JSONB on PostgreSQL).',
        'Over-using JSONField for core relational attributes that should be normalized columns with foreign key constraints.',
      ],
      commonMisconceptions: [
        'JSONB cannot be indexed in relational databases (PostgreSQL GIN indexes provide sub-millisecond lookups on JSONB paths).',
        'UUIDs always cause terrible database performance (UUIDv7 in PostgreSQL 18 provides time-ordered clustering that drastically mitigates B-Tree fragmentation).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b29-d145-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Enterprise Audit Event Model with JSONB, GIN Indexing & Cryptographic Digest',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `import uuid
import hashlib
import json
from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.fields import ArrayField

class AuditEvent(models.Model):
    # Primary Key: UUIDv4 identifier
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=64, db_index=True)
    tags = ArrayField(models.CharField(max_length=32), default=list, blank=True)
    
    # Semi-structured event payload (JSONB)
    payload = models.JSONField(default=dict)
    
    # Cryptographic integrity evidence: SHA-256 digest of normalized payload
    payload_digest = models.CharField(max_length=64, editable=False)
    recorded_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            # GIN index for accelerating JSONB path lookups and ArrayField queries
            GinIndex(fields=['payload'], name='audit_payload_gin_idx'),
            GinIndex(fields=['tags'], name='audit_tags_gin_idx'),
        ]

    def save(self, *args, **kwargs):
        # Compute SHA-256 digest of deterministic JSON serialization
        canonical_json = json.dumps(self.payload, sort_keys=True)
        self.payload_digest = hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()
        super().save(*args, **kwargs)

    def verify_integrity(self) -> bool:
        canonical_json = json.dumps(self.payload, sort_keys=True)
        expected_digest = hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()
        return self.payload_digest == expected_digest`,
      explanation: 'Demonstrates the architectural separation between GIN indexing (for query acceleration on payload and tags) and cryptographic integrity evidence (via SHA-256 payload_digest computed deterministically).',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b29-d145-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Indexing Semi-Structured JSONB & Enforcing Data Verification',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Build an event auditing pipeline that queries nested JSONB metadata using GIN indexes and validates record integrity using cryptographic digests.',
      instructions: [
        'Define a SecurityIncident model with UUID primary key, incident_metadata JSONField, and metadata_digest CharField.',
        'Configure a GinIndex on incident_metadata in the model Meta class.',
        'Implement an automated save() method that computes the SHA-256 hash of sorted JSON keys.',
        'Write a queryset filter querying security incidents where incident_metadata__severity__in=["CRITICAL", "HIGH"].',
        'Verify that tampering with the JSON payload in a test causes verify_integrity() to return False.',
      ],
      hints: [
        'Always use json.dumps(obj, sort_keys=True) to ensure deterministic serialization before computing hashes.',
        'GIN indexes require the django.contrib.postgres app in INSTALLED_APPS.',
      ],
      expectedOutcome: 'A high-performance, tamper-evident audit logging architecture combining fast GIN querying with cryptographic verification.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b29-d145-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: GIN Indexing vs Cryptographic Verification',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which statement accurately characterizes the relationship between a PostgreSQL GIN index on a JSONB column and cryptographic data integrity?',
      options: [
        'A GIN index provides query acceleration for nested key lookups and containment operations; it does not provide cryptographic integrity or tampering defense, which requires cryptographic digest fields.',
        'A GIN index automatically signs every JSONB row with a private key, making external hashes redundant.',
        'A GIN index prevents any user, including database superusers, from updating the JSONB column.',
        'A GIN index encrypts the JSONB data on disk using AES-256.',
      ],
      correctIndex: 0,
      explanation: 'GIN is an inverted index data structure designed solely for fast query retrieval across complex types. It does not provide cryptographic guarantees, encryption, or tamper resistance. Cryptographic digests or HMACs are required for integrity verification.',
      misconceptionIdentified: 'Confusing database index acceleration mechanisms with cryptographic security controls.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b29-d145-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: UUID Architectures & Authorization Reality',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why relying on non-sequential UUIDs to protect resources from unauthorized access is a dangerous security anti-pattern.',
      guidingQuestions: [
        'If an attacker intercepts a patient UUID in a browser URL or server log, what stops them from viewing the record if object-level authorization is missing?',
        'How does PostgreSQL 18\'s native UUIDv7 improve on UUIDv4 while maintaining uniqueness?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b29-d145-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 029 Reference Sheet: Advanced PostgreSQL Data Types',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: JSON Types and Functions',
          url: 'https://www.postgresql.org/docs/current/datatype-json.html',
        },
        {
          title: 'Django 6.0 Documentation: PostgreSQL specific model fields and indexes',
          url: 'https://docs.djangoproject.com/en/6.0/ref/contrib/postgres/fields/',
        },
      ],
      documentationExtracts: [
        'JSONB Binary Storage: JSONB data is stored in a parsed format that takes slightly longer to input due to conversion overhead, but is significantly faster to query and supports GIN indexing.',
        'UUIDv7 in PostgreSQL 18: Combines 48-bit millisecond timestamps with 74 bits of randomness, optimizing B-Tree index insertion locality while ensuring global uniqueness.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 146: DEBUG — Diagnostic Lab: Database Integrity, Constraint Contention & Storage Bloat ──
export const DAY_146_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w29-029',
  dayNumber: 4,
  title: 'Diagnostic Lab: Database Integrity, Constraint Contention & Storage Bloat',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b29-d146-01',
      type: 'THEORY',
      order: 1,
      title: 'Diagnosing Foreign Key Performance, Lock Contention, Table Bloat & Deadlocks',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Diagnose and resolve production PostgreSQL performance and integrity bottlenecks: foreign-key performance and lock-contention problems caused by missing indexes on referencing columns including expensive scans during referenced-row deletes/updates, table and TOAST bloat from high-frequency updates, and deadlocks arising from concurrent range constraint evaluations.',
      whatItIs: 'Production database performance is governed by indexing, lock semantics, and physical disk maintenance:\n1. Foreign-Key Performance & Lock-Contention from Missing Indexes:\n   - In PostgreSQL, creating a foreign key does NOT automatically create an index on the referencing (child) column.\n   - DEFECT: When a referenced (parent) row is updated or deleted, PostgreSQL must check referencing child tables to verify referential integrity. If the child table lacks an index on the foreign key column, PostgreSQL must perform an expensive sequential scan of the entire child table, holding locks for extended durations and causing severe lock contention across concurrent transactions.\n   - REMEDIATION: Always declare db_index=True on ForeignKey fields in Django, or create an explicit index on foreign keys in child tables.\n2. Table and TOAST Bloat from High-Frequency Updates:\n   - Updating rows with large text or JSONB attributes frequently creates obsolete tuple versions in both the primary heap and the TOAST table.\n   - DEFECT: If autovacuum cannot keep up with high write rates, dead tuples accumulate, bloating disk files and forcing sequential scans to read gigabytes of dead data.\n   - REMEDIATION: Tune autovacuum settings (autovacuum_vacuum_scale_factor, autovacuum_vacuum_cost_limit) and avoid updating large JSONB columns unless contents actually change.\n3. Constraint Contention & Overlap Deadlocks:\n   - Concurrent transactions attempting to insert overlapping intervals governed by ExclusionConstraint will wait for the first transaction to commit or roll back.\n   - DEFECT: If concurrent transactions acquire row locks in conflicting orders, PostgreSQL aborts one transaction with a deadlock detected error.\n   - REMEDIATION: Order row mutations deterministically and implement application-level retry loops with exponential backoff for transient serialization/deadlock failures.',
      whyItExists: 'Provides engineers with the diagnostic tools to resolve severe production database bottlenecks before they cause downtime, query timeouts, or disk exhaustion.',
      problemSolved: 'Eliminates table-wide sequential scans during foreign key cascades, mitigates TOAST bloat, and resolves database deadlock exceptions.',
      mentalModel: 'The Library Cross-Reference Index: A book catalog references author IDs. If someone deletes an author, the librarian must verify no books exist by that author. If the books have an Author Index (indexed FK), the librarian checks the card catalog in 2 seconds. If there is no Author Index (unindexed FK), the librarian must physically walk every aisle and inspect all 500,000 books on the shelves (full sequential scan) while locking the library doors (lock contention).',
      realWorldUse: 'High-volume e-commerce order processing, real-time telemetry ingestion, and SaaS multi-tenant databases.',
      commonMistakes: [
        'Assuming PostgreSQL automatically indexes foreign keys (PostgreSQL indexes primary keys and unique constraints automatically, but NOT foreign keys).',
        'Repeatedly updating huge JSONB documents with minor timestamp changes, generating massive TOAST table bloat.',
        'Failing to handle database deadlocks (IntegrityError or OperationalError) gracefully with retry mechanisms.',
        'Running manual VACUUM FULL during peak traffic hours (VACUUM FULL takes an exclusive table lock, blocking all reads and writes).',
      ],
      commonMisconceptions: [
        'Foreign key cascades are always fast (cascades on unindexed child columns cause disastrous full table scans).',
        'Database deadlocks are caused by application software bugs (deadlocks are normal concurrency events in relational databases that require application retry handling).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b29-d146-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Diagnosing Unindexed Foreign Keys & Lock Contention in PostgreSQL',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `# ── UNINDEXED FOREIGN KEY (PERFORMANCE DEFECT) ──
# Deleting a Patient row forces PostgreSQL to sequentially scan
# 10,000,000 VitalsMeasurement rows to check referential integrity!
class VitalsMeasurementVulnerable(models.Model):
    patient = models.ForeignKey(
        'Patient',
        on_delete=models.CASCADE,
        db_index=False  # DEFECT: Missing index causes full table scan & lock contention!
    )
    heart_rate = models.IntegerField()
    recorded_at = models.DateTimeField(auto_now_add=True)

# ── OPTIMIZED REFACTORED FOREIGN KEY ──
class VitalsMeasurementOptimized(models.Model):
    patient = models.ForeignKey(
        'Patient',
        on_delete=models.CASCADE,
        db_index=True   # Index enables immediate B-Tree lookup during parent updates/deletions
    )
    heart_rate = models.IntegerField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            # Composite index covering both foreign key and timestamp for high-frequency queries
            models.Index(fields=['patient', '-recorded_at'], name='vitals_patient_rec_idx')
        ]`,
      explanation: 'Demonstrates the critical difference between an unindexed foreign key that causes expensive table scans and lock contention during parent row deletions, versus an indexed foreign key providing sub-millisecond B-Tree referential checks.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b29-d146-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Resolving Foreign Key Contention & TOAST Bloat',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Analyze a slow PostgreSQL query log, identify an unindexed foreign key causing sequential scans during parent deletions, and optimize an overgrown JSONB column.',
      instructions: [
        'Review an EXPLAIN ANALYZE output showing a 4.2-second Seq Scan on an OrderItem table during an Order deletion.',
        'Identify the missing index on order_id in the child table causing the sequential scan.',
        'Write a Django migration adding db_index=True and an index definition to the foreign key.',
        'Refactor an accompanying EventLog model to prevent unnecessary updates to an oversized JSONB column, mitigating TOAST bloat.',
      ],
      hints: [
        'Look for "Seq Scan on order_item" with filter "order_id = $1" in the EXPLAIN output.',
        'Django foreign keys have db_index=True by default, but it can be inadvertently disabled or overridden in legacy models.',
      ],
      expectedOutcome: 'Resolution of the sequential scan down to an Index Scan under 1 millisecond, and elimination of unnecessary TOAST dead-tuple generation.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b29-d146-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Unindexed Foreign Keys in PostgreSQL',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does deleting a row from a parent table cause severe lock contention and high latency if a child table references it via an unindexed foreign key?',
      options: [
        'Because PostgreSQL must perform a full sequential scan of the entire child table to verify referential integrity, holding locks for extended durations while reading every block.',
        'Because PostgreSQL deletes the child table index automatically and rebuilds it from scratch.',
        'Because unindexed foreign keys cause PostgreSQL to shut down autovacuum on all related tables.',
        'Because PostgreSQL escalates all row locks to an exclusive database cluster lock.',
      ],
      correctIndex: 0,
      explanation: 'Without an index on the referencing foreign key column, PostgreSQL has no fast path to check whether child rows exist. It must sequentially scan the entire child table, taking significant I/O time and extending lock durations.',
      misconceptionIdentified: 'Believing that foreign keys are automatically indexed in PostgreSQL.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b29-d146-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Proactive Indexing vs Reactive Firefighting',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how schema-level design decisions (such as indexing referencing columns and managing TOAST row thresholds) prevent database outages long before query volume scales.',
      guidingQuestions: [
        'Why do unindexed foreign key issues often remain invisible in development environments with small datasets, only surfacing as catastrophic failures in production?',
        'How can database linting tools automatically catch missing foreign key indexes during CI/CD?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b29-d146-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 029 Reference Sheet: Database Performance & Diagnostics',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL Wiki: Foreign Keys and Missing Indexes',
          url: 'https://wiki.postgresql.org/wiki/Index_maintenance#Unindexed_Foreign_Keys',
        },
        {
          title: 'PostgreSQL 18 Documentation: Routine Vacuuming and Bloat',
          url: 'https://www.postgresql.org/docs/current/routine-vacuuming.html',
        },
      ],
      documentationExtracts: [
        'Referencing Indexes: Because foreign keys are often queried from the child side to find parent rows, and because updates/deletes of parent rows require checking child rows, indexing referencing columns is strongly recommended.',
        'Bloat Management: Regular autovacuum runs remove dead rows, preventing pages from filling up with obsolete versions that degrade scan performance.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 147: TRANSFER — Architectural Challenge & Formative Assessment: Append-Oriented Financial Ledger ──
export const DAY_147_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w29-029',
  dayNumber: 5,
  title: 'Architectural Transfer Challenge & Formative Assessment: Append-Oriented Financial Ledger',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b29-d147-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Batch 029 Formative Assessment: Append-Oriented Double-Entry Financial Ledger',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'High-volume international banking and treasury exchange engine handling multi-currency ledger transactions with strict regulatory audit requirements.',
      task: 'Architect and implement an append-oriented double-entry financial ledger and audit trail schema in Django 6.0 and PostgreSQL 18 with enforced application and database invariants, GIN-indexed JSONB audit metadata, and separate cryptographic digest verification fields.',
      constraints: [
        'Must design an append-oriented double-entry ledger schema with Account, JournalEntry, and LedgerTransaction models.',
        'Must enforce database-level CheckConstraint ensuring transaction amounts are strictly positive and account types conform to valid enumerations.',
        'Must attach partial UniqueConstraint to prevent duplicate idempotency keys among active (unreversed) transactions.',
        'Must use JSONField with GIN indexing for structured audit metadata, accompanied by a separate SHA-256 payload digest field for integrity evidence.',
        'Must configure foreign keys with explicit PROTECT deletion semantics to prevent accidental cascading data loss.',
      ],
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 60,
      targetCompetencyId: COMPETENCY_ID_POSTGRES_SCHEMAS_AND_TYPES,
    } as TransferChallengeBlock,
    {
      id: 'blk-b29-d147-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Batch 029 Synthesis Check: Production Relational Architecture',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In a production financial database on PostgreSQL 18, why is an append-oriented ledger architecture combined with database constraints and cryptographic digests superior to allowing row updates on account balances?',
      options: [
        'Because append-only designs eliminate update dead tuples, preserve a verifiable historical audit trail, avoid in-place data corruption, and allow cryptographic digests to prove historical integrity.',
        'Because append-only designs allow disabling autovacuum completely across the entire cluster.',
        'Because PostgreSQL cannot execute UPDATE queries on tables that have foreign keys.',
        'Because append-only designs encrypt all data automatically on disk.',
      ],
      correctIndex: 0,
      explanation: 'An append-oriented ledger guarantees an immutable historical audit trail, avoids MVCC update bloat on hot rows, and enables deterministic cryptographic verification of historical entries.',
      misconceptionIdentified: 'Believing that updating account balance rows in-place is safe for financial accounting systems.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b29-d147-03',
      type: 'REFLECTION',
      order: 3,
      title: 'Engineering Reflection: Database-Enforced Business Invariants',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how designing database-level constraints and append-oriented schemas provides mathematical certainty that application bugs cannot corrupt critical business records.',
      guidingQuestions: [
        'How does an append-oriented ledger simplify regulatory compliance audits compared to a database with mutable row updates?',
        'Why are database constraints the ultimate line of defense in modern distributed microservice architectures?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b29-d147-04',
      type: 'REFERENCE',
      order: 4,
      title: 'Batch 029 Architecture Summary & Database Standards Matrix',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: Indexing and Constraints Overview',
          url: 'https://www.postgresql.org/docs/current/indexes.html',
        },
        {
          title: 'Martin Fowler: Accounting Patterns and Immutable Ledgers',
          url: 'https://martinfowler.com/eaaDev/AccountingTransaction.html',
        },
      ],
      documentationExtracts: [
        'Double-Entry Bookkeeping: Every financial transaction consists of at least two entries: a debit and a credit. The sum of debits must equal the sum of credits.',
        'Append-Only Invariants: Ledger entries should never be updated or deleted; errors are corrected by appending compensating reversal entries.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 029 FORMATIVE ASSESSMENT (DAY 147) ──
export const DAY_147_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m8-w29-029',
  moduleId: 'module-pfs-m8',
  courseId: 'course-python-fullstack',
  title: 'Batch 029 Formative Assessment: PostgreSQL 18 Relational Schemas, Constraints & Types',
  description: 'Synthesize relational normalization, advanced database constraints, foreign key deletion actions, and specialized PostgreSQL data types in an append-oriented financial ledger.',
  type: 'FORMATIVE',
  mode: 'FORMATIVE',
  passingScore: 80,
  maxScore: 100,
  timeLimitMinutes: 60,
  rubric: [
    {
      id: 'rub-b29-01',
      criteria: 'Relational Normalization & Storage Architecture',
      weight: 0.20,
      description: 'Sound 3NF schema decomposition, accurate understanding of 8KB page storage and MVCC dead tuple mechanics.',
    },
    {
      id: 'rub-b29-02',
      criteria: 'Production Constraint Modeling (Check, Unique & Exclusion)',
      weight: 0.20,
      description: 'Effective declarative CheckConstraints, partial UniqueConstraints with Q conditions, and ExclusionConstraints with GiST indexes.',
    },
    {
      id: 'rub-b29-03',
      criteria: 'PostgreSQL Foreign Key Deletion Semantics',
      weight: 0.20,
      description: 'Accurate application of PROTECT, RESTRICT immediate checking, and NO ACTION deferral rules to safeguard referential integrity.',
    },
    {
      id: 'rub-b29-04',
      criteria: 'Advanced Data Types & GIN Indexing Architecture',
      weight: 0.20,
      description: 'Disciplined use of JSONField with GIN index acceleration, separate SHA-256 cryptographic digest fields, and UUIDv4 vs UUIDv7 analysis.',
    },
    {
      id: 'rub-b29-05',
      criteria: 'Append-Oriented Ledger Integrity & Performance Diagnostics',
      weight: 0.20,
      description: 'Robust append-only business invariants, proper indexing of foreign keys to eliminate sequential scan lock contention, and TOAST bloat mitigation.',
    },
  ],
  questions: [
    {
      id: 'q-b29-01',
      questionText: 'Explain why a GIN index on a JSONB column provides search acceleration but does NOT provide cryptographic immutability.',
      expectedAnswerSnippet: 'GIN is an inverted index data structure designed for fast retrieval; cryptographic integrity requires separate cryptographic hash digests to prove data has not been altered.',
      points: 20,
    },
  ],
};

// ── BATCH 029 MANIFEST (COMPLETE BATCH · DAYS 143–147 · 425 MIN) ──
export const BATCH_029_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m8-w29-029',
  batchCode: 'P2-M8-W29-BATCH029',
  title: 'PostgreSQL 18 Relational Schemas, Constraints & Advanced Data Types in Django 6.0',
  difficulty: 'ADVANCED',
  days: [
    DAY_143_MANIFEST,
    DAY_144_MANIFEST,
    DAY_145_MANIFEST,
    DAY_146_MANIFEST,
    DAY_147_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-09T00:00:00.000Z',
  updatedAt: '2026-09-09T00:00:00.000Z',
};
