// src/lib/curriculum/pythonFullStack/batch032.ts
// Single Source of Truth for PINIT BATCH 032 (COMPLETE · DAYS 158–162): Month 8 · Week 32 · Days 1–5
// PostgreSQL Indexing Architecture, Query Planning & Performance Tuning
// Pedagogical Flow: UNDERSTAND (B-Tree & Skip Scans) -> APPLY (GIN, GiST, BRIN & Covering) -> BUILD (EXPLAIN ANALYZE & Buffers) -> DEBUG (Index Bloat, VACUUM & Non-Atomic Migrations) -> TRANSFER (Multi-Attribute Catalog Optimization & Formative Assessment)

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

export const COMPETENCY_ID_POSTGRES_INDEXING = 'comp-pfs-m8-032';

// ── DAY 158: UNDERSTAND — PostgreSQL Index Internals: B-Tree Architecture & Skip-Scan Dynamics ──
export const DAY_158_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w32-032',
  dayNumber: 1,
  title: 'PostgreSQL Index Internals: B-Tree Architecture & Skip-Scan Dynamics',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b32-d158-01',
      type: 'THEORY',
      order: 1,
      title: 'Physical Anatomy of B-Trees, Visibility Maps & PostgreSQL 18 Skip-Scan Dynamics',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master B-Tree index physical internals in PostgreSQL 18: metapages, internal branch pages, leaf node (key, TID) structures, Index-Only Scans governed by heap Visibility Maps, partial indexes, expression indexes, and PostgreSQL 18 multicolumn B-tree skip-scan cost modeling.',
      whatItIs: 'A PostgreSQL B-Tree is a self-balancing search tree organized into 8KB disk pages:\n1. Physical B-Tree Page Hierarchy:\n   - Metapage (Block 0): Stores index metadata, B-Tree version, root page block pointer, and tree level depth.\n   - Root & Internal Branch Pages: Contain downlinks (block pointers) and high keys that guide binary search navigation from the root down to leaf pages with logarithmic O(log N) page I/O.\n   - Leaf Pages: Store index tuples containing the indexed key value(s) and the Item Pointer / TID (Tuple Identifier: (block_number, offset_number)) pointing to the physical row in the heap table.\n2. Multicolumn Indexes & Modern PostgreSQL 18 Skip Scans:\n   - Traditional Rule: Composite B-Trees are strictly ordered by (col_a, col_b, col_c). Equality on leading column col_a enables efficient logarithmic search.\n   - PostgreSQL 18 Skip Scan Invariant: A multicolumn B-tree is most effective when leading columns are constrained. PostgreSQL 18 may use B-tree skip scans when constraints on later columns make that strategy worthwhile, as determined by the query planner\'s cost model.\n3. Index-Only Scans & Visibility Maps:\n   - An Index-Only Scan answers a query entirely from the B-Tree leaf pages without reading heap table pages.\n   - Because PostgreSQL MVCC stores transaction visibility (xmin, xmax) on the heap tuple header, the engine consults the Visibility Map (VM) for the heap page. If the VM bit is set (all tuples on the page are visible to all current transactions), PostgreSQL skips reading the heap page entirely. If the bit is 0, it must visit the heap page to verify visibility.\n4. Partial & Expression Indexes:\n   - Partial Index (CREATE INDEX ... WHERE is_active = true): Indexes only a subset of rows matching a predicate, reducing index footprint and maintenance overhead.\n   - Expression Index (CREATE INDEX ... ON (lower(email))): Indexes the evaluated result of a deterministic function, accelerating case-insensitive lookups.',
      whyItExists: 'Understanding physical B-Tree mechanics enables engineers to design composite indexes that minimize random page I/O and capitalize on PostgreSQL 18 execution capabilities.',
      problemSolved: 'Eliminates costly Sequential Scans on large tables, avoids redundant composite indexes, and maximizes Index-Only Scan efficiency.',
      mentalModel: 'The Library Card Catalog & Yellow Highlighter: A B-Tree is a multi-tier card catalog in a grand library. Branch drawers point you to the right cabinet, cabinet labels point to drawers, and index cards (leaf tuples) contain the book title and shelf location (TID). An Index-Only Scan is when the card itself answers your question without walking to the shelf. The Visibility Map is a yellow highlighter mark on the shelf: if highlighted, no books are currently checked out or being reshelved, so the librarian trusts the card catalog directly.',
      realWorldUse: 'High-throughput catalog search, primary key indexing, tenant-scoped compound filters, and email uniqueness lookups.',
      commonMistakes: [
        'Creating separate single-column B-Trees on col_a and col_b expecting the query planner to combine them as effectively as a compound index (leads to Bitmap Index Scan overhead).',
        'Expecting Index-Only Scans to avoid heap page reads on tables with heavy concurrent updates and stale Visibility Maps (VACUUM has not run).',
        'Indexing low-cardinality boolean columns globally instead of using a partial index for the rare status flag.',
        'Filtering by lower(email) in Django when only an index on email (case-sensitive) exists, causing a Sequential Scan.',
      ],
      commonMisconceptions: [
        'PostgreSQL never uses a composite index if the leading column is omitted in the query (PostgreSQL 18 can utilize B-tree skip scans if cost models determine it is faster than sequential scan).',
        'Indexes make all queries faster (indexes add write amplification overhead to every INSERT, UPDATE, and DELETE).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b32-d158-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Composite, Partial & Expression Indexes in Django 6.0 Models',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models
from django.db.models.functions import Lower

class CustomerAccount(models.Model):
    organization_id = models.UUIDField()
    email = models.EmailField()
    status = models.CharField(max_length=16, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'created_at'], name='idx_cust_org_created'),
            models.Index(Lower('email'), name='idx_cust_email_lower'),
            models.Index(fields=['organization_id'], name='idx_cust_active_org', condition=models.Q(status='ACTIVE')),
        ]`,
      explanation: 'Demonstrates configuring composite B-Trees with prefix alignment, lower() expression indexes, and partial indexes in Django Meta.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b32-d158-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Designing Optimized Partial Indexes for Soft-Deleted Records',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Define a Django model for an enterprise Document entity that uses a soft-delete boolean flag is_deleted. Create a partial composite index on (folder_id, updated_at) restricted strictly to non-deleted documents.',
      instructions: [
        'Create Document model with folder_id, title, is_deleted, and updated_at.',
        'Configure Meta.indexes with models.Index.',
        'Add condition=models.Q(is_deleted=False) to avoid indexing deleted records.',
        'Verify with sqlmigrate that generated SQL includes WHERE NOT is_deleted.',
      ],
      expectedOutcome: 'High selectivity partial index reducing storage by 90% and accelerating non-deleted document lookups.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b32-d158-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Evaluating B-Tree Skip Scans & Visibility Map Checks',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Under what circumstances does PostgreSQL 18 utilize a B-tree skip scan on a multicolumn composite index?',
      options: [
        'Whenever all columns of the table are indexed in alphabetical order.',
        'A multicolumn B-tree is most effective when leading columns are constrained. PostgreSQL 18 may use B-tree skip scans when constraints on later columns make that strategy worthwhile, as determined by the query planner\'s cost model.',
        'Only when the table has fewer than 100 rows and autovacuum is disabled.',
        'Whenever an Index-Only Scan fails a Visibility Map check.',
      ],
      correctIndex: 1,
      explanation: 'A multicolumn B-tree is most effective when leading columns are constrained; PostgreSQL 18 query planners may deploy B-tree skip scans when constraints on later columns make that strategy worthwhile according to cost estimations.',
      misconceptionIdentified: 'Believing that composite indexes can never be used if the leading column is missing, or conversely that skip scans are used unconditionally without cost evaluation.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b32-d158-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Trade-offs: The Write Amplification Tax of Indexes',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why adding an index is never a "free" performance boost, and how partial indexes reduce write amplification.',
      guidingQuestions: [
        'How does an INSERT on a table with 8 B-Tree indexes impact disk I/O and transaction latency compared to a table with 1 index?',
        'Why does a partial index with condition=Q(status="PENDING") avoid write amplification on 95% of row updates once status transitions to COMPLETED?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b32-d158-06',
      type: 'REFERENCE',
      order: 6,
      title: 'PostgreSQL B-Tree & Django Index Options Reference',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: B-Tree Indexes',
          url: 'https://www.postgresql.org/docs/current/btree-intro.html',
        },
        {
          title: 'Django 6.0 Documentation: Model Index options',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/indexes/',
        },
      ],
      documentationExtracts: [
        'B-tree skip scans: PostgreSQL 18 supports skipping over distinct prefixes in a B-tree index when evaluating constraints on trailing index attributes.',
        'Visibility Map: Maintains two bits per heap page: all-visible (for index-only scans) and all-frozen (for vacuum acceleration).',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 159: APPLY — Specialized Index Architectures: GIN, GiST, BRIN & Covering Indexes ──
export const DAY_159_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w32-032',
  dayNumber: 2,
  title: 'Specialized Index Architectures: GIN, GiST, BRIN & Covering Indexes',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b32-d159-01',
      type: 'THEORY',
      order: 1,
      title: 'GIN for JSONB, BRIN for Append-Only Time Series & Covering Indexes with INCLUDE',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master specialized PostgreSQL 18 index architectures in Django 6.0: GIN (Generalized Inverted Indexes) for JSONB containment (@>) and full-text search, BRIN (Block Range Indexes) for multi-gigabyte append-only ordered tables, GiST for multi-dimensional spatial data, and covering indexes with INCLUDE clauses for Index-Only Scans.',
      whatItIs: 'PostgreSQL provides specialized index access methods tailored to distinct data models:\n1. GIN (Generalized Inverted Index):\n   - Internal Architecture: An inverted index mapping individual elements (keys, array values, tsvectors) to a posting list or posting tree of TIDs containing that element.\n   - Primary Use: JSONB containment queries (data @> \'{\"role\": \"admin\"}\'), full-text search (tsvector @@ tsquery), and array membership (tags @> ARRAY[\'python\']).\n   - Operator Classes: jsonb_ops (default: indexes all keys and values) vs jsonb_path_ops (hashes path-value pairs, 50% smaller footprint, accelerates @> containment exclusively).\n2. BRIN (Block Range Index):\n   - Internal Architecture: Stores only the minimum and maximum values for physical ranges of table pages (default: 128 pages / 1MB of table heap per index entry).\n   - Primary Use: Massive (millions/billions of rows), physically correlated append-only tables (audit logs, time-series metrics, sensor streams).\n   - Advantages: Tiny index size (often less than 1% of a B-Tree), negligible write overhead.\n3. GiST (Generalized Search Tree):\n   - Balanced tree structure supporting lossy or lossless spatial hierarchies (bounding boxes for geometry/geography), range types (tsrange, daterange), and nearest-neighbor search.\n4. Covering Indexes via INCLUDE:\n   - Syntax: CREATE INDEX idx_users_email_inc ON users (email) INCLUDE (first_name, last_name);\n   - Mechanics: The key column (email) is sorted in the B-Tree navigation nodes. The included payload columns (first_name, last_name) are stored only in the leaf nodes.\n   - Invariant: Permits Index-Only Scans that select email, first_name, and last_name without bloating internal branch pages or adding sort overhead to non-key attributes.',
      whyItExists: 'Selecting the appropriate index architecture yields orders-of-magnitude reductions in index storage and query latency for non-scalar data types.',
      problemSolved: 'Eliminates 100x query slowdowns on semi-structured JSONB queries and solves the multi-gigabyte index bloat of B-Trees on massive append-only logging tables.',
      mentalModel: 'The Specialized Tools: A B-Tree is an alphabetized card index. GIN is the back-of-the-book index: each keyword lists all pages where it appears. BRIN is a summary label on the outside of storage boxes: "Box 4 contains receipts from Jan 1 to Jan 15": if you are looking for March, you skip the entire box without opening it. A Covering Index with INCLUDE is stapling a photocopy of the author\'s photo to the library index card so you don\'t have to walk to the stacks to see what they look like.',
      realWorldUse: 'SaaS tenant feature flags in JSONB, multi-million-row financial ledger audit queries, and covering user profile lookups.',
      commonMistakes: [
        'Creating standard B-Tree indexes on large JSONB columns, which only accelerates equality on the entire JSON document rather than key/value lookups.',
        'Using BRIN on tables where rows are inserted out of physical order or updated heavily, destroying range selectivity and degrading to full table scans.',
        'Putting all query columns into the B-Tree key definition instead of using INCLUDE, causing excessive B-Tree node split overhead and slow index maintenance.',
      ],
      commonMisconceptions: [
        'GIN indexes have fast write performance (GIN inserts require updating posting lists and often rely on fastupdate buffers to defer inverted list maintenance).',
        'INCLUDE columns are part of the B-Tree sort order (they are non-searchable payloads stored exclusively on leaf pages).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b32-d159-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Implementing GIN, BRIN & Covering Indexes in Django 6.0',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models
from django.contrib.postgres.indexes import GinIndex, BrinIndex

class SystemAuditLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    event_payload = models.JSONField()

    class Meta:
        indexes = [
            BrinIndex(fields=['timestamp'], name='idx_audit_ts_brin', pages_per_range=128),
            GinIndex(fields=['event_payload'], name='idx_audit_payload_gin', opclasses=['jsonb_path_ops']),
        ]`,
      explanation: 'Configures BRIN for time-series append ranges and GIN with jsonb_path_ops for fast JSONB @> containment in PostgreSQL.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b32-d159-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Optimizing E-Commerce Product Metadata with GIN jsonb_path_ops',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Define a ProductCatalogItem model with attributes stored in a JSONField. Add a GIN index configured with jsonb_path_ops to accelerate attribute containment queries (e.g. {"color": "blue", "size": "XL"}).',
      instructions: [
        'Define ProductCatalogItem with sku and attributes JSONField.',
        'Add GinIndex to Meta.indexes specifying fields=["attributes"].',
        'Set opclasses=["jsonb_path_ops"] to reduce index size by 50%.',
        'Verify queries using attributes__contains execute via Bitmap Index Scan.',
      ],
      expectedOutcome: 'Sub-millisecond containment queries on dynamic JSONB attributes without sequential scans.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b32-d159-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Selecting the Optimal Index Access Method',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is a BRIN index dramatically superior to a standard B-Tree for a 100-million row immutable telemetry table queried by timestamp ranges?',
      options: [
        'BRIN indexes lock the entire table to prevent concurrent writes.',
        'BRIN indexes store only min/max summaries per range of physical disk blocks, resulting in an index footprint measured in kilobytes rather than gigabytes with near-zero write amplification.',
        'BRIN indexes convert all timestamps to integer Unix epochs automatically.',
        'PostgreSQL disables B-Tree indexes on tables with more than 10 million rows.',
      ],
      correctIndex: 1,
      explanation: 'BRIN summarizes block ranges (e.g. 128 pages). On physically sorted append-only data, it provides high range selectivity with orders-of-magnitude less disk and RAM consumption than B-Trees.',
      misconceptionIdentified: 'Assuming B-Tree is always the default choice regardless of table size and append-only physics.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b32-d159-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Selection: B-Tree vs GIN vs BRIN',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how choosing the wrong index type can silently degrade database performance and deplete memory caches.',
      guidingQuestions: [
        'What happens to database shared_buffers when a 25GB B-Tree index on a logging table must be kept in RAM?',
        'How does GIN jsonb_path_ops reduce index size compared to standard jsonb_ops?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b32-d159-06',
      type: 'REFERENCE',
      order: 6,
      title: 'PostgreSQL GIN & BRIN Official Documentation',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: GIN Indexes',
          url: 'https://www.postgresql.org/docs/current/gin-intro.html',
        },
        {
          title: 'PostgreSQL 18 Documentation: BRIN Indexes',
          url: 'https://www.postgresql.org/docs/current/brin-intro.html',
        },
      ],
      documentationExtracts: [
        'GIN: Generalized Inverted Indexes are designed for handling cases where items to be indexed are composite values, and queries search for element values that appear within the items.',
        'INCLUDE clauses: Allows non-key attributes to be stored in the leaf pages of an index to enable Index-Only Scans.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 160: BUILD — Query Execution Planning: Mastering EXPLAIN (ANALYZE, BUFFERS) ──
export const DAY_160_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w32-032',
  dayNumber: 3,
  title: 'Query Execution Planning: Mastering EXPLAIN (ANALYZE, BUFFERS)',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b32-d160-01',
      type: 'THEORY',
      order: 1,
      title: 'Execution Plan Trees, Cost Estimations & Buffer Cache Profiling',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master PostgreSQL 18 query plan interpretation: understanding execution plan trees, startup vs total cost (cost=X..Y), estimated vs actual row counts, scan node types (Seq Scan, Index Scan, Index Only Scan, Bitmap Scan), join algorithms (Nested Loop, Hash Join, Merge Join), and memory buffer I/O diagnostics via BUFFERS (Shared Hit vs Shared Read).',
      whatItIs: 'PostgreSQL query optimization transforms SQL queries into procedural execution plans evaluated by the cost-based optimizer:\n1. Anatomy of an EXPLAIN Plan Node:\n   - Node Header: e.g. ->  Index Scan using idx_users_email on users  (cost=0.42..8.44 rows=1 width=72) (actual time=0.031..0.033 rows=1 loops=1)\n   - Startup Cost (0.42): Estimated arbitrary units before first row is emitted.\n   - Total Cost (8.44): Estimated units to return all matching rows.\n   - Estimated Rows vs Actual Rows: Cardinality comparison. Discrepancies indicate stale statistics requiring ANALYZE.\n2. Core Scan Nodes:\n   - Sequential Scan: Reads every page of the table heap sequentially. Best for retrieving a high percentage of rows (> 20%).\n   - Index Scan: Traverses B-Tree to find TIDs, then fetches individual rows from table heap. Optimal for low cardinality (< 5%).\n   - Index Only Scan: Reads exclusively from B-Tree leaf pages without visiting heap (requires Visibility Map bit = 1).\n   - Bitmap Index Scan + Bitmap Heap Scan: Builds a bitmap of matching pages in memory, sorts by physical disk block order, and visits heap sequentially to eliminate random I/O.\n3. Join Algorithms:\n   - Nested Loop: For each outer row, executes an inner scan (efficient when inner side uses an index).\n   - Hash Join: Builds an in-memory hash table of the inner relation, then probes it with outer rows (efficient for large unsorted sets).\n   - Merge Join: Merges two relations pre-sorted on join keys (optimal for large sorted datasets).\n4. Buffer Cache Diagnostics via BUFFERS:\n   - Shared Hit: Page found in RAM buffer cache (shared_buffers) — near-zero latency.\n   - Shared Read: Page read from OS page cache or physical NVMe disk — higher latency.\n   - Dirtied: Pages modified in memory during execution.\n   - Written: Dirty pages flushed to disk during query execution.',
      whyItExists: 'EXPLAIN (ANALYZE, BUFFERS) provides objective, mathematical ground truth on query performance, diagnosing why slow queries occur and verifying index efficacy.',
      problemSolved: 'Eliminates guesswork in database tuning, identifies inaccurate planner statistics, and uncovers hidden table scans and disk read bottlenecks.',
      mentalModel: 'The X-Ray Machine & Heart Rate Monitor: Standard EXPLAIN is a blueprint or map: what the planner intends to do. EXPLAIN ANALYZE is running the patient on a treadmill while recording their actual heart rate and oxygen consumption (executes the query, measures real milliseconds). BUFFERS tells you whether the blood flowed effortlessly through arteries (Shared Hit in RAM) or had to be pumped against extreme resistance (Shared Read from physical disk).',
      realWorldUse: 'Diagnosing p99 API latency spikes, tuning database indexes in staging, and validating query optimization pull requests.',
      commonMistakes: [
        'Running EXPLAIN ANALYZE on destructive queries (DELETE or UPDATE) in production without realizing that ANALYZE physically executes the statement.',
        'Focusing solely on execution time while ignoring Shared Read counts (queries appear fast in local tests because all data fits in RAM, but crawl in production due to disk I/O).',
        'Assuming a Sequential Scan is always bad (for small tables under 100 rows or queries returning 50% of the table, Seq Scan is faster than Index Scan due to sequential I/O).',
      ],
      commonMisconceptions: [
        'The cost numbers in EXPLAIN represent milliseconds (costs are arbitrary relative units normalized to seq_page_cost = 1.0).',
        'The planner always chooses the absolute fastest plan (it chooses the plan estimated to be cheapest based on available statistical samples).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b32-d160-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Inspecting Query Plans in Django via explain(analyze=True, buffers=True)',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from myapp.models import CustomerOrder

def inspect_query_plan():
    qs = CustomerOrder.objects.filter(organization_id='org-123', status='SHIPPED').order_by('-created_at')[:10]
    plan = qs.explain(analyze=True, buffers=True)
    print(plan)`,
      explanation: 'Uses Django 6.0 QuerySet.explain() with analyze and buffers flags to inspect execution nodes and RAM vs disk page access.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b32-d160-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Parsing EXPLAIN Output Programmatically to Verify Buffer Cache Hits',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Write a Python utility function parse_plan_buffers(plan_text: str) that extracts shared hit and shared read page counts from an EXPLAIN (ANALYZE, BUFFERS) text output and calculates the buffer cache hit ratio.',
      instructions: [
        'Use regular expressions to search for shared hit and shared read counts.',
        'Calculate total buffer pages queried by the statement.',
        'Compute hit ratio percentage: (shared_hit / total) * 100.',
        'Return structured dictionary with parsed metrics.',
      ],
      expectedOutcome: 'Automated verification that queries achieve >= 95% buffer hit ratio under warm cache conditions.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b32-d160-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnosing Plan Costs and Buffer Metrics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In an EXPLAIN (ANALYZE, BUFFERS) plan, what does a large Shared Read count combined with high execution time indicate?',
      options: [
        'The query is running entirely in RAM and cannot be optimized further.',
        'The required data pages were not present in shared_buffers and had to be fetched from disk storage or the OS page cache, incurring I/O latency.',
        'The database has run out of disk space.',
        'The query planner chose an Index-Only scan with 100% Visibility Map coverage.',
      ],
      correctIndex: 1,
      explanation: 'Shared Read indicates physical page reads from disk into the PostgreSQL buffer cache. A high read count indicates that the working dataset exceeds cache capacity or missing indexes are forcing table scans.',
      misconceptionIdentified: 'Confusing Shared Hit (RAM) with Shared Read (disk/OS I/O).',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b32-d160-05',
      type: 'REFLECTION',
      order: 5,
      title: 'The Discipline of Query Profiling Before Deployment',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why checking EXPLAIN (ANALYZE, BUFFERS) during PR reviews prevents production outages.',
      guidingQuestions: [
        'Why does a query that takes 2ms on a developer machine with 500 rows take 15 seconds in production with 5,000,000 rows?',
        'How can observing estimated rows vs actual rows detect when PostgreSQL statistics are stale?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b32-d160-06',
      type: 'REFERENCE',
      order: 6,
      title: 'PostgreSQL EXPLAIN & Planner Statistics Reference',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: Using EXPLAIN',
          url: 'https://www.postgresql.org/docs/current/using-explain.html',
        },
        {
          title: 'PostgreSQL 18 Documentation: Planner Statistics',
          url: 'https://www.postgresql.org/docs/current/planner-stats.html',
        },
      ],
      documentationExtracts: [
        'BUFFERS: Includes information on buffer usage. Specifically, includes the number of shared blocks hit, read, dirtied, and written.',
        'ANALYZE option: Causes the statement to be actually executed and actual run times and other statistics displayed.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 161: DEBUG — Index Bloat, Table Fragmentation, VACUUM & Non-Atomic Django Migrations ──
export const DAY_161_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w32-032',
  dayNumber: 4,
  title: 'Index Bloat, Table Fragmentation, VACUUM & Non-Atomic Django Migrations',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b32-d161-01',
      type: 'THEORY',
      order: 1,
      title: 'MVCC Dead Tuples, Index Bloat Dynamics & Non-Atomic Concurrent Index Migrations',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master database maintenance, bloat remediation, and non-blocking DDL in PostgreSQL 18 and Django 6.0: MVCC dead tuple generation, B-Tree index bloat, VACUUM and autovacuum tuning, and the strict transactional and operational rules of CREATE INDEX CONCURRENTLY using Django non-atomic migrations (atomic = False) and AddIndexConcurrently.',
      whatItIs: 'PostgreSQL\'s Multi-Version Concurrency Control (MVCC) architecture creates new row versions on updates and marks old versions dead on delete:\n1. Dead Tuples and Index Bloat Mechanics:\n   - An UPDATE in PostgreSQL is physically an INSERT of a new tuple followed by marking the old tuple dead (xmax set).\n   - Index entries must point to all tuple versions. If rows are repeatedly updated or deleted, dead index pointers accumulate in B-Tree leaf pages.\n   - Index Bloat: When dead entries prevent page compaction, B-Tree indexes expand with sparsely filled pages, degrading cache locality and increasing page traversal depth.\n2. Autovacuum Tuning & Table Maintenance:\n   - autovacuum reclaims space occupied by dead tuples and updates Visibility Maps.\n   - Key parameters: autovacuum_vacuum_scale_factor (fraction of table dead tuples to trigger vacuum) and autovacuum_vacuum_cost_limit (I/O throttle).\n   - REINDEX: Rebuilds an index from scratch to completely eliminate bloat.\n3. CREATE INDEX CONCURRENTLY & Django Non-Atomic Migration Boundary:\n   - Standard CREATE INDEX acquires an SHARE lock on the table, blocking all concurrent INSERT, UPDATE, and DELETE queries for the entire duration of the build.\n   - CREATE INDEX CONCURRENTLY avoids write downtime by executing two passes over the table while acquiring only a SHARE UPDATE EXCLUSIVE lock (allows concurrent reads and writes).\n   - Strict PostgreSQL Rule: PostgreSQL strictly forbids CREATE INDEX CONCURRENTLY inside an active transaction block. Invoking it inside BEGIN...COMMIT raises: ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block.\n   - Django Integration: To use AddIndexConcurrently, the migration class MUST set atomic = False.\n   - Operational Reality: "Concurrent" does NOT mean "zero locks"; it acquires SHARE UPDATE EXCLUSIVE locks, takes significantly longer, and leaves INVALID index artifacts if cancelled or failed, which consume disk space and must be dropped manually.',
      whyItExists: 'Enables zero-downtime schema evolution and index maintenance in production databases without locking out customer transactions.',
      problemSolved: 'Prevents catastrophic table locks during production schema migrations and fixes performance degradation caused by index bloat.',
      mentalModel: 'The Highway Bridge Construction: A standard CREATE INDEX completely shuts down the entire highway to build a new overpass (no cars can pass until it is finished). CREATE INDEX CONCURRENTLY builds the overpass while traffic continues flowing underneath; it takes twice as long, requires flaggers (SHARE UPDATE EXCLUSIVE locks), and if a storm interrupts construction, the unfinished scaffolding remains on the road marked "INVALID" and must be cleared away before starting over.',
      realWorldUse: 'Adding indexes to multi-million row production tables, reclaiming disk space on high-churn tables, and autovacuum optimization.',
      commonMistakes: [
        'Attempting to run AddIndexConcurrently without setting atomic = False on the Migration class, causing Django to fail with TransactionManagementError.',
        'Assuming CREATE INDEX CONCURRENTLY acquires zero locks (it acquires SHARE UPDATE EXCLUSIVE, which conflicts with ALTER TABLE and autovacuum).',
        'Failing to clean up INVALID indexes after an interrupted concurrent migration (an invalid index is never used by queries but slows down all INSERTs).',
        'Disabling autovacuum because it uses disk I/O, leading to exponential table bloat and query degradation.',
      ],
      commonMisconceptions: [
        'Concurrent index builds are faster than standard index builds (concurrent builds take at least 2x longer because they require two full table scans and lock synchronization).',
        'VACUUM returns disk space to the operating system (standard VACUUM only marks space reusable for future rows; VACUUM FULL reclaims OS disk space but locks the table exclusively).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b32-d161-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Production Non-Atomic Migration with AddIndexConcurrently in Django 6.0',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import migrations, models
from django.contrib.postgres.operations import AddIndexConcurrently

class Migration(migrations.Migration):
    # 🚨 MANDATORY: atomic MUST be False for concurrent index creation
    atomic = False

    dependencies = [('billing', '0041_prev')]

    operations = [
        AddIndexConcurrently(
            model_name='invoice',
            index=models.Index(fields=['organization_id', 'status'], name='idx_inv_org_stat')
        )
    ]`,
      explanation: 'Shows non-atomic migration declaring atomic = False to allow AddIndexConcurrently without transaction block syntax errors.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b32-d161-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Remediating Failed INVALID Indexes in PostgreSQL Catalog',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Write a SQL maintenance script that queries pg_index and pg_class to identify any INVALID indexes resulting from aborted concurrent builds and drops them safely.',
      instructions: [
        'Query pg_index joining pg_class where indisvalid = false.',
        'Filter by current namespace schema public.',
        'Generate DROP INDEX CONCURRENTLY IF EXISTS commands for invalid indexes.',
        'Verify cleanup with database catalog queries.',
      ],
      expectedOutcome: 'Safe identification and removal of orphaned INVALID index artifacts.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b32-d161-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Enforcing Migration Boundaries for CREATE INDEX CONCURRENTLY',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why must a Django migration using AddIndexConcurrently explicitly declare atomic = False?',
      options: [
        'atomic = False disables all database logging to accelerate index creation.',
        'PostgreSQL strictly prohibits CREATE INDEX CONCURRENTLY inside transaction blocks; setting atomic = False prevents Django from wrapping the migration in BEGIN...COMMIT.',
        'Django migrations cannot use transactions if they alter tables with more than 100,000 rows.',
        'atomic = False instructs PostgreSQL to acquire an ACCESS EXCLUSIVE table lock.',
      ],
      correctIndex: 1,
      explanation: 'PostgreSQL throws a syntax error if CREATE INDEX CONCURRENTLY is executed inside a transaction block. atomic = False runs the migration statements directly outside transaction wrappers.',
      misconceptionIdentified: 'Believing all Django migrations should be atomic by default without exception.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b32-d161-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Zero-Downtime DDL: Managing Production Migration Risk',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how running standard CREATE INDEX on a 20GB production table during business hours can bring down an entire web application.',
      guidingQuestions: [
        'How does a SHARE table lock cause connection pool exhaustion when hundreds of HTTP requests try to INSERT rows into the locked table?',
        'What operational precautions should you take before triggering a concurrent index build in production?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b32-d161-06',
      type: 'REFERENCE',
      order: 6,
      title: 'PostgreSQL Concurrently & Django Migration Reference',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: Building Indexes Concurrently',
          url: 'https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY',
        },
        {
          title: 'Django 6.0 Documentation: Non-atomic migrations',
          url: 'https://docs.djangoproject.com/en/6.0/howto/writing-migrations/#non-atomic-migrations',
        },
      ],
      documentationExtracts: [
        'CREATE INDEX CONCURRENTLY: Building an index concurrently takes significantly longer than normal, but avoids locking out concurrent writes.',
        'Non-atomic migrations: Set atomic = False on migration classes that execute non-transactional statements such as concurrent index creation.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 162: TRANSFER — Multi-Attribute Catalog Search Optimization & Formative Assessment ──
export const DAY_162_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w32-032',
  dayNumber: 5,
  title: 'Multi-Attribute Catalog Search Optimization & Formative Assessment',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b32-d162-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Batch 032 Capstone Challenge: Multi-Attribute Catalog Performance Engine',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'High-traffic e-commerce product catalog with 100,000 items, concurrent facet filtering, and strict p95 latency requirements.',
      task: 'Synthesize composite B-Trees with skip-scan awareness, GIN indexes for JSONB faceted filtering, covering indexes with INCLUDE, and non-atomic migrations into an enterprise catalog search architecture satisfying a rigorous performance SLA.',
      constraints: [
        'For the supplied evaluation fixture, dataset size (100,000 catalog rows), defined hardware profile, warm buffer cache state, and single-client concurrency, measured p95 query latency across 1,000 iterations must be below 15ms.',
        'Must configure composite B-Tree with leading category_id prefix alignment.',
        'Must configure GIN index with jsonb_path_ops on dynamic attributes.',
        'Must use covering index with INCLUDE for tile data enabling Index-Only Scans.',
        'Must define all index creations in a non-atomic migration declaring atomic = False and AddIndexConcurrently.',
      ],
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 60,
      targetCompetencyId: COMPETENCY_ID_POSTGRES_INDEXING,
    } as TransferChallengeBlock,
    {
      id: 'blk-b32-d162-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Synthesizing Catalog Performance & Non-Blocking DDL',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which combination of design decisions guarantees sub-15ms catalog search while avoiding production deployment downtime?',
      options: [
        'Using a single B-Tree on dynamic_specs and applying it using standard atomic migrations.',
        'Deploying composite B-Trees with prefix alignment, GIN jsonb_path_ops for attributes, covering indexes with INCLUDE for tile data, and non-atomic migrations with AddIndexConcurrently.',
        'Disabling autovacuum and using raw SQL string formatting for all catalog queries.',
        'Indexing every table column in separate single-column B-Trees and disabling the Visibility Map.',
      ],
      correctIndex: 1,
      explanation: 'Composite B-Trees handle structured filters, GIN handles semi-structured specs, covering indexes enable Index-Only Scans, and non-atomic migrations prevent write locks during deployment.',
      misconceptionIdentified: 'Believing indexing can be done without considering query shapes or deployment lock impacts.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b32-d162-03',
      type: 'REFLECTION',
      order: 3,
      title: 'Batch 032 Capstone Reflection: The Database Performance Architect',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how understanding the physical layout of B-Trees, GIN, BRIN, and execution plan buffers changes your approach to backend system design.',
      guidingQuestions: [
        'How does knowing the physical cost of random disk I/O influence your decision to design covering indexes with INCLUDE?',
        'Why is understanding non-atomic migrations essential for continuous delivery in enterprise production environments?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b32-d162-04',
      type: 'REFERENCE',
      order: 4,
      title: 'Batch 032 Architecture Summary & Performance SLA',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: Index Types',
          url: 'https://www.postgresql.org/docs/current/indexes-types.html',
        },
        {
          title: 'Django 6.0 Documentation: Postgres Indexes',
          url: 'https://docs.djangoproject.com/en/6.0/ref/contrib/postgres/indexes/',
        },
      ],
      documentationExtracts: [
        'SLA Contract: For the supplied evaluation fixture, dataset size (100,000 catalog rows), defined hardware profile, warm buffer cache state, and single-client concurrency, measured p95 query latency across 1,000 iterations must be below 15ms.',
        'Non-blocking DDL: AddIndexConcurrently requires atomic = False on the Migration class to prevent transaction block syntax violations.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 032 FORMATIVE ASSESSMENT (DAY 162) ──
export const DAY_162_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m8-w32-032',
  moduleId: 'module-pfs-m8',
  courseId: 'course-python-fullstack',
  title: 'Batch 032 Formative Assessment: Multi-Attribute Catalog Search Optimization',
  description: 'Synthesize B-Tree indexing, skip-scan dynamics, GIN jsonb_path_ops, covering indexes with INCLUDE, EXPLAIN buffer diagnostics, and non-atomic migrations in an enterprise product catalog search engine.',
  type: 'FORMATIVE',
  mode: 'FORMATIVE',
  passingScore: 80,
  maxScore: 100,
  timeLimitMinutes: 60,
  rubric: [
    {
      id: 'rub-b32-01',
      criteria: 'Composite Index Prefix Alignment & Skip-Scan Awareness',
      weight: 0.20,
      description: 'Accurate design of compound B-Tree indexes matching filter cardinality and cost-aware skip scan mechanics.',
    },
    {
      id: 'rub-b32-02',
      criteria: 'Covering Index Construction (INCLUDE for Index-Only Scans)',
      weight: 0.20,
      description: 'Disciplined use of INCLUDE clauses to enable Index-Only Scans without bloating internal branch nodes.',
    },
    {
      id: 'rub-b32-03',
      criteria: 'GIN JSONB Containment Optimization',
      weight: 0.20,
      description: 'Implementation of GIN with jsonb_path_ops accelerating @> containment queries on dynamic attribute dictionaries.',
    },
    {
      id: 'rub-b32-04',
      criteria: 'Buffer Cache I/O Efficiency & Plan Verification',
      weight: 0.20,
      description: 'Validation of EXPLAIN (ANALYZE, BUFFERS) plans demonstrating high shared hit ratios and sub-15ms p95 latency on the 100,000-row fixture.',
    },
    {
      id: 'rub-b32-05',
      criteria: 'Non-Atomic Migration & Non-Blocking DDL Invariants',
      weight: 0.20,
      description: 'Strict enforcement of atomic = False and AddIndexConcurrently, documenting lock modes and INVALID index cleanup.',
    },
  ],
  questions: [
    {
      id: 'q-b32-01',
      questionText: 'Explain why AddIndexConcurrently requires setting atomic = False on the Migration class in Django, and what lock mode PostgreSQL acquires during concurrent index creation.',
      expectedAnswerSnippet: 'PostgreSQL forbids CREATE INDEX CONCURRENTLY inside a transaction block; atomic = False prevents transaction wrapping. It acquires SHARE UPDATE EXCLUSIVE locks allowing concurrent reads and writes.',
      points: 20,
    },
  ],
};

// ── BATCH 032 MANIFEST (COMPLETE BATCH · DAYS 158–162 · 425 MIN) ──
export const BATCH_032_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m8-w32-032',
  batchCode: 'P2-M8-W32-BATCH032',
  title: 'PostgreSQL Indexing Architecture, Query Planning & Performance Tuning',
  difficulty: 'ADVANCED',
  days: [
    DAY_158_MANIFEST,
    DAY_159_MANIFEST,
    DAY_160_MANIFEST,
    DAY_161_MANIFEST,
    DAY_162_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-10T00:00:00.000Z',
  updatedAt: '2026-09-10T00:00:00.000Z',
};
