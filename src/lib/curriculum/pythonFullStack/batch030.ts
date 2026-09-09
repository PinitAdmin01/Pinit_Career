// src/lib/curriculum/pythonFullStack/batch030.ts
// Single Source of Truth for PINIT BATCH 030 (COMPLETE · DAYS 148–152): Month 8 · Week 30 · Days 1–5
// Advanced SQL Querying, Joins, Aggregations & QuerySet Compilation Internals
// Pedagogical Flow: UNDERSTAND (Relational Algebra & Compiler) -> APPLY (Window Functions & Annotations) -> BUILD (Subqueries & Raw SQL) -> DEBUG (N+1 & Cartesian Explosion) -> TRANSFER (Formative Assessment: Analytics Engine)

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

export const COMPETENCY_ID_SQL_JOINS_AND_QUERYSETS = 'comp-pfs-m8-030';

// ── DAY 148: UNDERSTAND — Relational Algebra, SQL Joins & Django QuerySet Compiler Internals ──
export const DAY_148_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w30-030',
  dayNumber: 1,
  title: 'Relational Algebra, SQL Joins & Django QuerySet Compiler Internals',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b30-d148-01',
      type: 'THEORY',
      order: 1,
      title: 'Relational Algebra, SQL Join Types & Django QuerySet Compiler Architecture',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master relational algebra foundations and Django 6.0 QuerySet compilation mechanics on Python 3.14: relational selection, projection, join families (INNER, LEFT OUTER, RIGHT OUTER, FULL OUTER, CROSS), QuerySet Abstract Syntax Tree (AST) construction, sql_with_params compilation, and deterministic lazy evaluation triggers.',
      whatItIs: 'Django QuerySets are high-level abstractions over mathematical relational algebra:\n1. Relational Algebra Foundations:\n   - Selection (σ): Filtering rows based on a predicate (QuerySet.filter()).\n   - Projection (π): Restricting attributes/columns returned (QuerySet.values(), .only()).\n   - Cartesian Product (×): Multiplying every row of relation R by every row of relation S.\n   - Joins: Combining relations based on join conditions.\n2. SQL Join Families in PostgreSQL:\n   - INNER JOIN: Returns rows where the join predicate matches in both relations.\n   - LEFT OUTER JOIN: Returns all rows from the left relation, padding unmatched right columns with NULL.\n   - RIGHT OUTER JOIN: Returns all rows from the right relation, padding unmatched left columns with NULL.\n   - FULL OUTER JOIN: Returns all rows from both relations, padding unmatched columns on either side with NULL.\n   - CROSS JOIN: Explicit Cartesian product of all rows.\n3. The Django QuerySet SQL Compiler Pipeline:\n   - A QuerySet is NOT a database query; it is a Python data structure describing an Abstract Syntax Tree (AST).\n   - When evaluated, Django invokes django.db.models.sql.compiler.SQLCompiler.\n   - The compiler resolves table aliases (T1, T2), builds the SELECT clause, generates JOIN clauses based on model relationships, constructs the WHERE tree (WhereNode), and calls as_sql() returning (sql_string, params_tuple).\n4. Deterministic Lazy Evaluation Triggers:\n   - QuerySets are lazy: chaining filter(), exclude(), order_by() executes zero database I/O.\n   - Database execution is triggered strictly when:\n     * Iteration: for item in queryset: ...\n     * Slicing with step: queryset[0:10:2]\n     * Serialization / representation: repr(queryset), list(queryset)\n     * Boolean evaluation: if queryset: ... (Note: use queryset.exists() instead!)\n     * Length evaluation: len(queryset) (Note: use queryset.count() instead!)',
      whyItExists: 'Enables engineers to predict the exact SQL produced by Django ORM expressions, preventing inefficient table scans and unintended query execution.',
      problemSolved: 'Eliminates unexpected database calls, prevents memory bloat from premature QuerySet evaluation, and demystifies complex multi-table joins.',
      mentalModel: 'The Architectural Blueprints vs Construction Crew: Defining a QuerySet is drafting an architectural blueprint on paper (AST). You can erase lines, add balconies, and change room layouts (filter, annotate) without spending a dime on concrete. The database query is only dispatched when the construction crew arrives on site to build the house (iteration, list(), bool()). Calling bool(queryset) builds the entire skyscraper just to check if the front door exists.',
      realWorldUse: 'Enterprise reporting pipelines, high-throughput search queries, and high-concurrency API endpoints.',
      commonMistakes: [
        'Using if queryset: instead of if queryset.exists():, which pulls thousands of model instances into Python memory just to check for presence.',
        'Using len(queryset) instead of queryset.count():, which executes a SELECT * and instantiates objects instead of executing a lightweight SELECT COUNT(*).',
        'Assuming filter() chains always produce INNER JOINs (filtering on nullable foreign keys or reverse relations can generate LEFT OUTER JOINs).',
        'Calling list(queryset) inside loops, executing redundant queries and causing severe memory bloat.',
      ],
      commonMisconceptions: [
        'Django QuerySets execute SQL immediately upon calling .filter() (QuerySets are completely lazy until evaluated).',
        'QuerySet.count() is always identical in performance to len() (count() runs entirely in the database engine; len() fetches all rows into Python memory).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b29-d148-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Inspecting QuerySet AST & SQL Compiler Output via sql_with_params()',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models, connection
from django.db.models import Q

class Company(models.Model):
    name = models.CharField(max_length=255)

class Employee(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='employees')
    name = models.CharField(max_length=255)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

# 1. Constructing lazy QuerySet (Zero Database I/O)
qs = Employee.objects.filter(
    company__name='Acme Corp',
    salary__gte=75000
).select_related('company')

# 2. Inspecting the Compiler AST & Generated SQL without executing it
compiler = qs.query.get_compiler(using=connection.alias)
sql, params = compiler.as_sql()

print("Generated SQL String:")
print(sql)
# Outputs:
# SELECT "employee"."id", "employee"."company_id", "employee"."name", 
#        "employee"."salary", "employee"."is_active", "company"."id", "company"."name"
# FROM "employee"
# INNER JOIN "company" ON ("employee"."company_id" = "company"."id")
# WHERE ("company"."name" = %s AND "employee"."salary" >= %s)

print("Bound Parameter Tuple:", params)
# Outputs: ('Acme Corp', Decimal('75000'))`,
      explanation: 'Demonstrates how the Django SQL compiler transforms high-level Python ORM expressions into an AST and generates parameterized SQL with strict alias resolution and safe bind parameters.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b30-d148-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Tracing Join Types & QuerySet Evaluation Boundaries',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Trace the exact SQL generated by various QuerySet chaining operations and replace premature evaluation anti-patterns with lazy database primitives.',
      instructions: [
        'Analyze a codebase that makes extensive use of len(qs) and if qs: in view controllers.',
        'Refactor the view logic to use qs.count() and qs.exists() to prevent pulling millions of rows into Python memory.',
        'Construct a query joining nullable relationships and inspect whether the compiler produces INNER JOIN or LEFT OUTER JOIN.',
        'Write a utility function inspect_query(qs) that returns the raw SQL string and parameters tuple.',
      ],
      hints: [
        'Access qs.query.sql_with_params() or compiler.as_sql() to inspect SQL without executing queries.',
        'QuerySet evaluation only occurs when data is explicitly consumed.',
      ],
      expectedOutcome: 'Zero unnecessary memory allocation in Python views and complete transparency into QuerySet SQL compiler behavior.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b30-d148-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: QuerySet Evaluation & Compiler Mechanics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which of the following operations will NOT trigger an immediate SQL query execution against the database when called on a Django QuerySet?',
      options: [
        'qs.filter(status="ACTIVE").order_by("-created_at")',
        'bool(qs)',
        'list(qs)',
        'len(qs)',
      ],
      correctIndex: 0,
      explanation: 'Chaining .filter() and .order_by() simply modifies the internal AST on the QuerySet object. QuerySets are lazy and execute no SQL until explicitly evaluated (such as by bool, list, or len).',
      misconceptionIdentified: 'Believing that query methods like filter() execute database calls immediately.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b30-d148-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Lazy Evaluation as a Scalability Invariant',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why Django\'s lazy QuerySet evaluation model allows building composable, highly reusable query filters across complex enterprise service layers.',
      guidingQuestions: [
        'How does lazy evaluation allow a base service function to define a core query that downstream API views can paginate and filter without running multiple queries?',
        'What is the catastrophic consequence of accidentally calling list(qs) at the top of a service function?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b30-d148-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 030 Reference Sheet: Relational Algebra & QuerySet Internals',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: When QuerySets are evaluated',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/querysets/#when-querysets-are-evaluated',
        },
        {
          title: 'PostgreSQL 18 Documentation: Joins Between Tables',
          url: 'https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-FROM',
        },
      ],
      documentationExtracts: [
        'Lazy Execution: You can evaluate a QuerySet by iterating over it, slicing it, pickling it, or calling repr(), len(), list(), or bool().',
        'Exists vs Count: exists() performs a SELECT (1) AS a FROM table LIMIT 1, which is vastly faster than counting or loading rows.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 149: APPLY — Advanced Aggregations, Annotations & SQL Window Functions in Django ──
export const DAY_149_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w30-030',
  dayNumber: 2,
  title: 'Advanced Aggregations, Annotations & SQL Window Functions in Django',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b30-d149-01',
      type: 'THEORY',
      order: 1,
      title: 'Aggregation Math, Conditional Expressions & SQL Window Functions in Django 6.0',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master multi-dimensional data aggregation in Django 6.0 on Python 3.14 with PostgreSQL 18: aggregate() vs annotate(), group-by semantics via values(), conditional expressions (Case, When, Coalesce), and native SQL Window Functions (RowNumber, Rank, DenseRank, Lead, Lag) with partition_by and order_by clauses.',
      whatItIs: 'Django provides full support for PostgreSQL analytical querying and window functions:\n1. aggregate() vs annotate():\n   - aggregate(): Reduces an entire QuerySet to a dictionary of summary scalar values (e.g. {"avg_salary": 85000.00}). Terminal operation.\n   - annotate(): Computes values for each item in the QuerySet, returning an annotated QuerySet that can be further filtered, sliced, or grouped.\n2. Group-By Semantics via values().annotate():\n   - In Django, calling .values("department").annotate(total=Sum("salary")) generates a SQL GROUP BY department.\n   - INVARIANT: Any fields in the default model ordering (Meta.ordering) are automatically added to the GROUP BY clause unless explicitly cleared via .order_by(), which can unintentionally fragment aggregation groups.\n3. Conditional Aggregation Expressions:\n   - models.Case and models.When: Implements SQL CASE WHEN cond THEN val ELSE default END.\n   - Coalesce: Returns the first non-null argument (e.g. Coalesce(Sum("bonus"), Value(0))).\n4. SQL Window Functions in Django ORM:\n   - Window functions perform calculations across sets of rows related to the current row without collapsing them into a single row like GROUP BY does.\n   - Syntax: Window(expression=RowNumber(), partition_by=[F("department_id")], order_by=F("salary").desc()).\n   - Core Window Functions: RowNumber() (unique sequential row number), Rank() (ranks with gaps), DenseRank() (ranks without gaps), Lead(offset=1) (accesses next row), Lag(offset=1) (accesses prior row).',
      whyItExists: 'Allows executing complex analytical, financial, and ranking calculations directly inside the PostgreSQL database engine in a single query, avoiding slow in-memory Python loops.',
      problemSolved: 'Eliminates multi-step Python calculations for running balances, leaderboard rankings, and cohort metrics.',
      mentalModel: 'The Classroom Report Card vs Honor Roll Ranking: Standard GROUP BY is calculating the average grade for the entire 10th grade class (collapsing 100 students into 1 average number). A Window Function is writing each student\'s individual class rank (1st, 2nd, 3rd) on their individual report card while preserving every student\'s individual record in the list.',
      realWorldUse: 'Financial running balances, employee salary rankings by department, time-series difference calculations, and cohort retention metrics.',
      commonMistakes: [
        'Forgetting that Meta.ordering fields are implicitly appended to GROUP BY clauses, causing unintended group fragmentation.',
        'Attempting to filter directly on Window function annotations using .filter() (SQL disallows window functions in WHERE clauses; subqueries are required).',
        'Failing to use Coalesce on Sum aggregations, resulting in None instead of 0 when no rows match.',
        'Calculating running totals by fetching all rows into Python and accumulating in a loop instead of using Window(Sum(...)).',
      ],
      commonMisconceptions: [
        'Window functions collapse rows like GROUP BY (window functions preserve original row cardinality while attaching partitioned calculations).',
        'Filtering on annotated fields always works immediately in WHERE clauses (aggregations use HAVING, while window functions require subquery wrapping).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b30-d149-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Department Salary Ranking and Running Total via Window Functions',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models
from django.db.models import F, Sum, Value, Window
from django.db.models.functions import RowNumber, DenseRank, Coalesce

class PayrollRecord(models.Model):
    department = models.CharField(max_length=100, db_index=True)
    employee_name = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    effective_date = models.DateField()

# 1. Computing Department Salary Rank & Running Total in a Single Query
ranked_payroll = PayrollRecord.objects.annotate(
    # Rank employees within their department by salary descending
    dept_salary_rank=Window(
        expression=DenseRank(),
        partition_by=[F('department')],
        order_by=F('salary').desc()
    ),
    # Running total of payroll within department ordered by effective_date
    running_dept_payroll=Window(
        expression=Sum('salary'),
        partition_by=[F('department')],
        order_by=F('effective_date').asc()
    )
).order_by('department', 'dept_salary_rank')

# Output verified:
# Each employee record retains full detail while holding exact rank and running balance!`,
      explanation: 'Demonstrates native Django Window expressions partitioned by department and ordered by salary or date, executing complex analytical ranking and running totals in a single SQL query without row collapse.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b30-d149-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Building Financial Running Balances & Leaderboard Rankings',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Implement a customer ledger query that calculates running account balances and assigns global loyalty tier ranks using Django Window functions.',
      instructions: [
        'Define a CustomerTransaction model with account_id, amount, and timestamp.',
        'Construct an annotated QuerySet using Window(Sum("amount")) partitioned by account_id to produce a running_balance.',
        'Use DenseRank() ordered by total spend to assign customer loyalty rankings.',
        'Use Coalesce to guarantee that accounts with zero transactions return 0.00 rather than None.',
      ],
      hints: [
        'Remember to specify partition_by=[F("account_id")] on the running balance window.',
        'Always clear default ordering using .order_by() if grouping by specific attributes.',
      ],
      expectedOutcome: 'A high-speed analytical query calculating precise running balances and partitioned rankings directly in PostgreSQL in sub-5ms.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b30-d149-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: SQL Window Functions vs Group By',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What is the primary operational difference between using .values("department").annotate(total=Sum("salary")) and using Window(expression=Sum("salary"), partition_by=[F("department")])?',
      options: [
        'values().annotate() collapses all rows in each department into a single summary row, whereas the Window function returns every individual row with the department sum attached.',
        'values().annotate() runs in the database, whereas Window functions run entirely in Python memory.',
        'Window functions only work on primary key fields, whereas annotate works on any field.',
        'Window functions require dropping all foreign key constraints before execution.',
      ],
      correctIndex: 0,
      explanation: 'GROUP BY aggregates and collapses rows, reducing output cardinality. Window functions compute aggregate metrics across partitions while preserving the full individual row count.',
      misconceptionIdentified: 'Confusing window partitioning with row-collapsing group-by aggregations.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b30-d149-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Database-Side Analytics vs In-Memory Processing',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how pushing analytical math into PostgreSQL window functions changes the scalability profile of an application from O(N) memory consumption in Python to O(1) memory overhead.',
      guidingQuestions: [
        'What happens to server memory when calculating running balances for 1,000,000 transactions in Python vs in PostgreSQL?',
        'How do PostgreSQL B-Tree indexes on partition_by and order_by columns accelerate window function execution?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b30-d149-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 030 Reference Sheet: Django Window Functions & Aggregations',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Window expressions',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/expressions/#window-expressions',
        },
        {
          title: 'PostgreSQL 18 Documentation: Window Function Calls',
          url: 'https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS',
        },
      ],
      documentationExtracts: [
        'Window Expressions: A Window expression allows adding a OVER clause to an expression in a QuerySet. Functions like RowNumber, Rank, and DenseRank require a Window wrapper.',
        'Partitioning: partition_by determines how rows are grouped for the calculation; order_by determines the order in which rows are processed in the window.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 150: BUILD — Correlated Subqueries, Set Operations & Parameterized Raw SQL Safety ──
export const DAY_150_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w30-030',
  dayNumber: 3,
  title: 'Correlated Subqueries, Set Operations & Parameterized Raw SQL Safety',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b30-d150-01',
      type: 'THEORY',
      order: 1,
      title: 'Correlated Subqueries (Subquery, Exists, OuterRef), Set Operations & Safe Raw SQL',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Architect advanced query compositions in Django 6.0 on Python 3.14 with PostgreSQL 18: correlated subqueries with Subquery, Exists, and OuterRef, SQL set operations (union, intersection, difference), and safe parameterized raw SQL execution using Manager.raw() and connection.cursor() with absolute SQL injection defense.',
      whatItIs: 'Django provides sophisticated query composition primitives for complex relational problems:\n1. Correlated Subqueries via OuterRef:\n   - A correlated subquery is a subquery that references columns from the outer query.\n   - OuterRef("field_name"): Points to a field on the outer query model.\n   - Subquery(queryset.values("column")[:1]): Injects a scalar subquery into an annotation or filter. Must strictly return exactly one column and one row (using [:1] slice).\n   - Exists(queryset): Renders a highly optimized WHERE EXISTS (SELECT 1 FROM ...) condition without pulling foreign table data.\n2. SQL Set Operations in Django ORM:\n   - qs1.union(qs2): Combines results using SQL UNION (or union(all=True) for UNION ALL).\n   - qs1.intersection(qs2): Returns rows present in both QuerySets (SQL INTERSECT).\n   - qs1.difference(qs2): Returns rows present in qs1 but not in qs2 (SQL EXCEPT).\n3. Safe Parameterized Raw SQL Execution:\n   - When ORM expressions are insufficient for highly specialized database features, Django provides raw query interfaces:\n     * Model.objects.raw("SELECT id, name FROM app_model WHERE code = %s", [code])\n     * with connection.cursor() as cursor: cursor.execute("SELECT ... WHERE code = %s", [code])\n   - NON-NEGOTIABLE SECURITY INVARIANT: NEVER use Python string formatting (f-strings, %, .format()) to build SQL queries. Always pass user input as separate parameters in the parameters list, allowing the database driver to safely escape parameters and completely prevent SQL Injection (OWASP A03:2021).',
      whyItExists: 'Enables fine-grained control over complex relational data fetching while maintaining ironclad defense against SQL injection attacks.',
      problemSolved: 'Eliminates in-memory joins for correlated child data, enables mathematical set operations, and provides safe escape hatches for raw SQL.',
      mentalModel: 'The Telescope vs The Courier: Loading all child records into Python to find the latest invoice date is sending a courier to haul all 50,000 files to your desk, flipping through them, and throwing 49,999 away. A Correlated Subquery with OuterRef is looking through a telescope directly into the exact line item on the shelf and reading just that one date without moving a single file.',
      realWorldUse: 'Fetching latest comment or activity date per user in a list view, filtering accounts with pending orders via Exists, and executing specialized PostgreSQL analytical queries.',
      commonMistakes: [
        'Omitting [:1] on a Subquery expression, causing a database error: "more than one row returned by a subquery used as an expression".',
        'Concatenating user input into raw SQL queries using f-strings (f"SELECT * FROM users WHERE email = \'{email}\'") creating critical SQL injection vulnerabilities.',
        'Using Subquery when a standard select_related or prefetch_related join would be significantly simpler and faster.',
        'Attempting to mutate or filter fields on a union() QuerySet that PostgreSQL disallows after set operations.',
      ],
      commonMisconceptions: [
        'Raw SQL in Django is always vulnerable to SQL injection (raw SQL using proper %s parameter binding is completely secure).',
        'Subqueries are always slower than joins (in PostgreSQL, correlated EXISTS subqueries frequently outperform outer joins with distinct filters).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b30-d150-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Correlated Subquery via OuterRef and Parameterized Raw SQL Execution',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models, connection
from django.db.models import OuterRef, Subquery, Exists

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    placed_at = models.DateTimeField()
    status = models.CharField(max_length=32)

# 1. Correlated Subquery: Annotate each customer with their latest order amount
latest_order_subquery = Order.objects.filter(
    customer=OuterRef('pk')
).order_by('-placed_at').values('amount')[:1]

has_pending_orders_subquery = Order.objects.filter(
    customer=OuterRef('pk'),
    status='PENDING'
)

customers_with_stats = Customer.objects.annotate(
    latest_order_amount=Subquery(latest_order_subquery),
    has_pending=Exists(has_pending_orders_subquery)
)

# 2. Safe Parameterized Raw SQL Execution (SQL Injection Defense)
def find_customers_by_status_raw(status_code: str):
    # SECURE: Bind parameters passed as second argument to raw()
    query = """
        SELECT c.id, c.name, c.email
        FROM app_customer c
        WHERE EXISTS (
            SELECT 1 FROM app_order o
            WHERE o.customer_id = c.id AND o.status = %s
        )
    """
    return list(Customer.objects.raw(query, [status_code]))`,
      explanation: 'Demonstrates correlated subqueries fetching scalar values from child tables using OuterRef and [:1], and proves how safe parameterization in Manager.raw() eliminates SQL injection vulnerabilities.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b30-d150-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Composing Correlated Subqueries & Defending Raw SQL',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Refactor an inefficient multi-query user listing view into a single query using Subquery and OuterRef, and patch an insecure raw SQL endpoint.',
      instructions: [
        'Identify an N+1 query pattern where a customer list iterates through each customer to fetch their most recent order date.',
        'Replace the loop with an annotated Subquery using OuterRef("pk") and order_by("-placed_at").values("placed_at")[:1].',
        'Identify a SQL injection flaw in a raw search endpoint that formats strings via f"SELECT ... WHERE code = \'{code}\'".',
        'Refactor the raw search endpoint to use parameterized cursor.execute(query, [code]).',
      ],
      hints: [
        'Always slice the Subquery with [:1] to ensure it returns a single row.',
        'Parameterized queries in Django PostgreSQL use %s placeholders, not ? or named parameters.',
      ],
      expectedOutcome: 'Reduction from 1,001 database queries down to 1 query, and absolute remediation of the SQL injection vulnerability.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b30-d150-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Subquery Invariants & SQL Injection Defense',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does Django require a Subquery expression used in an annotate() clause to explicitly slice its result with [:1]?',
      options: [
        'Because SQL syntax requires a scalar subquery in a SELECT clause to return at most one row; returning multiple rows causes the database engine to abort with a runtime error.',
        'Because Django\'s SQL compiler only supports single-digit array indices.',
        'Because PostgreSQL limits subqueries to 1 kilobyte of memory.',
        'Because slicing with [:1] automatically encrypts the subquery output.',
      ],
      correctIndex: 0,
      explanation: 'A subquery in a SELECT or annotation context must evaluate to a scalar (single value). If the subquery returns more than one row, SQL engines raise "more than one row returned by a subquery used as an expression". Slicing [:1] appends LIMIT 1.',
      misconceptionIdentified: 'Believing that subqueries can return arbitrary result sets in scalar annotation contexts.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b30-d150-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: The Power and Responsibility of Raw SQL',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why senior engineers prioritize the Django ORM for 95% of application logic, reserving raw SQL only for targeted, audited performance optimizations.',
      guidingQuestions: [
        'How does using ORM expressions protect codebases against database portability issues and silent schema drift?',
        'When is a raw SQL query with parameterization genuinely justified over an ORM expression?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b30-d150-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 030 Reference Sheet: Correlated Subqueries & Safe SQL',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Subquery expressions',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/expressions/#subquery-expressions',
        },
        {
          title: 'OWASP SQL Injection Prevention Cheat Sheet',
          url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html',
        },
      ],
      documentationExtracts: [
        'Subquery and OuterRef: You can add an explicit subquery to a QuerySet using the Subquery expression. OuterRef is used when a subquery needs to refer to a field from the outer query.',
        'SQL Injection Defense: Parameterized queries ensure that the database treats user input strictly as data, never as executable SQL code.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 151: DEBUG — Diagnostic Lab: Query Performance, Cartesian Explosion & SQL Anti-Patterns ──
export const DAY_151_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w30-030',
  dayNumber: 4,
  title: 'Diagnostic Lab: Query Performance, Cartesian Explosion & SQL Anti-Patterns',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b30-d151-01',
      type: 'THEORY',
      order: 1,
      title: 'Diagnosing N+1 Cascades, Cartesian Multi-Join Explosion & Subquery Scoping Errors',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Diagnose and eliminate critical Django ORM performance anti-patterns: the N+1 query problem, select_related vs prefetch_related mechanics, Cartesian product explosion caused by multiple annotate(Count(...)) joins across Many-to-Many relations, and OuterRef scope resolution failures.',
      whatItIs: 'Query performance bottlenecks typically arise from misunderstanding how ORM calls translate to SQL:\n1. The N+1 Query Problem:\n   - Occurs when an application executes 1 initial query to fetch N parent records, and then executes N separate subsequent queries inside a loop to fetch related child objects.\n   - DEFECT: Iterating over 1,000 orders to read order.customer.name triggers 1,001 SQL queries, causing latency to scale linearly with dataset size.\n   - REMEDIATION:\n     * select_related: Executes an SQL INNER/LEFT JOIN in the initial query. Used for single-valued relationships (ForeignKey, OneToOneField).\n     * prefetch_related: Executes 2 queries (one for parents, one for all children using WHERE id IN (...)) and joins them in Python memory. Used for multi-valued relationships (ManyToManyField, reverse ForeignKey).\n2. Cartesian Product Multi-Join Explosion:\n   - DEFECT: Calling Book.objects.annotate(author_count=Count("authors"), review_count=Count("reviews")) joins both ManyToMany tables simultaneously.\n   - Consequence: If a book has 5 authors and 10 reviews, the SQL join generates 50 intermediate rows. Count("authors") calculates 50 instead of 5, producing corrupted mathematical counts and high memory consumption.\n   - REMEDIATION: Pass distinct=True to the aggregation (Count("authors", distinct=True)), or use separate Subqueries to count related items independently.\n3. OuterRef Scope Resolution Errors:\n   - DEFECT: Using OuterRef in a subquery that is not passed into an outer QuerySet\'s annotate() or filter() raises ValueError: This queryset contains a reference to an outer query and may only be used in a subquery.\n   - REMEDIATION: Ensure OuterRef expressions remain within bounded Subquery objects attached to outer QuerySets.',
      whyItExists: 'Equips engineers with the analytical methodology to profile, diagnose, and remediate severe database query bottlenecks that degrade user experience and overwhelm database connection pools.',
      problemSolved: 'Eliminates N+1 query cascades, prevents corrupt mathematical counts from Cartesian products, and corrects broken subquery scopes.',
      mentalModel: 'The Grocery Shopping Trip: The N+1 problem is driving to the grocery store to buy pasta, driving home, driving back to buy tomato sauce, driving home, driving back to buy cheese. 1 trip + 10 ingredient trips = 11 car journeys. select_related is buying pasta, sauce, and cheese all in one single shopping cart (SQL JOIN). prefetch_related is sending one person to the dairy aisle and one to the pantry aisle simultaneously, combining the bags at checkout (2 queries combined in memory).',
      realWorldUse: 'High-traffic REST API viewsets, dashboard metrics rendering, and batch processing pipelines.',
      commonMistakes: [
        'Using select_related on a ManyToManyField (Django raises a runtime error; ManyToMany requires prefetch_related).',
        'Combining multiple Count() annotations on different reverse relations without distinct=True, causing severe Cartesian product data corruption.',
        'Calling prefetch_related followed by a fresh .filter() in Python, which bypasses the prefetched cache and executes a brand-new SQL query.',
        'Failing to use Prefetch objects when prefetching custom filtered subsets of child records.',
      ],
      commonMisconceptions: [
        'prefetch_related is always slower than select_related (prefetch_related avoids massive Cartesian product join tables when relationships have high cardinality).',
        'Count() in Django always counts unique records (Count() counts matching joined rows unless distinct=True is explicitly specified).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b30-d151-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Diagnosing & Fixing Cartesian Product Explosion in Multi-Annotation QuerySets',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models
from django.db.models import Count

class Author(models.Model):
    name = models.CharField(max_length=100)

class Tag(models.Model):
    name = models.CharField(max_length=50)

class Article(models.Model):
    title = models.CharField(max_length=200)
    authors = models.ManyToManyField(Author, related_name='articles')
    tags = models.ManyToManyField(Tag, related_name='articles')

# ── DEFECT: Cartesian Product Explosion ──
# If an article has 3 authors and 4 tags, the SQL join generates 12 rows!
# author_count will evaluate to 12 (CORRUPTED) and tag_count will evaluate to 12 (CORRUPTED)!
vulnerable_qs = Article.objects.annotate(
    author_count=Count('authors'),
    tag_count=Count('tags')
)

# ── REMEDIATION 1: Explicit distinct=True ──
fixed_distinct_qs = Article.objects.annotate(
    author_count=Count('authors', distinct=True),
    tag_count=Count('tags', distinct=True)
)

# ── REMEDIATION 2: Independent Subqueries (Optimal for large relations) ──
from django.db.models import OuterRef, Subquery

author_subquery = Author.objects.filter(
    articles=OuterRef('pk')
).values('articles').annotate(cnt=Count('id')).values('cnt')

tag_subquery = Tag.objects.filter(
    articles=OuterRef('pk')
).values('articles').annotate(cnt=Count('id')).values('cnt')

fixed_subquery_qs = Article.objects.annotate(
    author_count=Subquery(author_subquery),
    tag_count=Subquery(tag_subquery)
)`,
      explanation: 'Contrasts a corrupted multi-join annotation that multiplies counts due to Cartesian product explosion with two production remediations: distinct=True and independent scalar Subqueries.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b30-d151-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Eliminating N+1 Cascades & Correcting Cartesian Joins',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Profile a slow API endpoint, eliminate an N+1 query pattern using Prefetch objects, and correct corrupt aggregation counts caused by Cartesian joins.',
      instructions: [
        'Profile an endpoint that renders a list of 50 blog posts with author details and comment counts.',
        'Use select_related("author") to collapse the author queries into the primary SELECT.',
        'Use prefetch_related(Prefetch("comments", queryset=Comment.objects.filter(is_approved=True))) to prefetch only approved comments.',
        'Verify with connection.queries (when DEBUG=True) that total queries drop from 101 to exactly 2.',
      ],
      hints: [
        'select_related is for ForeignKey / OneToOne; prefetch_related is for ManyToMany / Reverse ForeignKey.',
        'Prefetch objects allow customizing the query used to populate the relationship cache.',
      ],
      expectedOutcome: 'Reduction of query count by 98% and verified accuracy of all aggregated numeric counts.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b30-d151-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Cartesian Joins in Annotations',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'If an Article model has 2 Authors and 3 Tags via ManyToMany relationships, what does Article.objects.annotate(a=Count("authors"), t=Count("tags")).first().a return if distinct=True is omitted?',
      options: [
        '6, because the SQL query joins both ManyToMany tables simultaneously, producing a Cartesian product of 2 × 3 = 6 rows.',
        '2, because Django automatically detects multiple ManyToMany counts and separates the joins.',
        '0, because ManyToMany fields cannot be annotated.',
        'An IntegrityError exception.',
      ],
      correctIndex: 0,
      explanation: 'Without distinct=True, joining two separate ManyToMany tables creates a Cartesian product of all matching rows (2 × 3 = 6). The Count() function counts all rows in the intermediate join table, resulting in 6 instead of 2.',
      misconceptionIdentified: 'Assuming Django automatically prevents Cartesian product multiplication across multiple ManyToMany joins.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b30-d151-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Verification of Query Budgets',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why production test suites should enforce strict query budget assertions (assertNumQueries) to prevent performance regressions from creeping into codebases.',
      guidingQuestions: [
        'How does a small change in a Django template tag (e.g. {{ post.author.profile.bio }}) secretly reintroduce an N+1 query bug?',
        'Why are automated query count tests superior to manual profiling?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b30-d151-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 030 Reference Sheet: Query Optimization & Anti-Patterns',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Database access optimization',
          url: 'https://docs.djangoproject.com/en/6.0/topics/db/optimization/',
        },
        {
          title: 'Django 6.0 Documentation: select_related and prefetch_related',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/querysets/#select-related',
        },
      ],
      documentationExtracts: [
        'select_related: Returns a QuerySet that will "follow" foreign-key relationships, selecting additional related-object data when it executes its query.',
        'prefetch_related: Does a separate lookup for each relationship, and does the "joining" in Python. This allows it to prefetch many-to-many and many-to-one objects.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 152: TRANSFER — Architectural Challenge & Formative Assessment: Enterprise Analytics Engine ──
export const DAY_152_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m8-w30-030',
  dayNumber: 5,
  title: 'Architectural Transfer Challenge & Formative Assessment: Enterprise Analytics Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b30-d152-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Batch 030 Formative Assessment: Enterprise SaaS Billing & Analytics Engine',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'High-volume multi-tenant cloud telecommunications and SaaS platform billing millions of API calls across tiered enterprise organizations.',
      task: 'Architect and implement a high-performance analytics, cohort ranking, and revenue reporting engine in Django 6.0 and PostgreSQL 18 using window functions, correlated subqueries, and conditional aggregation with a strict fixture-specific query budget contract.',
      constraints: [
        'For the supplied evaluation dataset and defined access pattern, the solution must execute no more than 3 SQL queries while producing the exact required analytics output.',
        'Must use SQL Window Functions (DenseRank or RowNumber) to calculate organization usage ranks within industry tiers.',
        'Must use correlated subqueries with OuterRef to annotate each tenant with their most recent invoice total and timestamp.',
        'Must use conditional aggregation (Case, When, Coalesce) to compute revenue breakdown across active vs churning subscription tiers.',
        'Must ensure zero Cartesian product count corruption and zero N+1 query cascades.',
      ],
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 60,
      targetCompetencyId: COMPETENCY_ID_SQL_JOINS_AND_QUERYSETS,
    } as TransferChallengeBlock,
    {
      id: 'blk-b30-d152-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Batch 030 Synthesis Check: High-Performance Relational Query Design',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In an enterprise Django application with complex reporting requirements, what combination of ORM primitives provides the highest performance and lowest memory footprint when generating a ranked summary table across millions of records?',
      options: [
        'Combining Window functions for partitioned rankings, Subqueries for correlated scalar child metrics, and conditional aggregation (Case/When/Coalesce) within a single QuerySet, asserting a strict query budget.',
        'Fetching all records into Python with list(qs), looping through them, and sorting in Python using sorted().',
        'Running 1 query per customer inside a Celery background task without database indexes.',
        'Converting all database tables to unindexed text files and reading them with Python regex.',
      ],
      correctIndex: 0,
      explanation: 'Pushing calculations into the PostgreSQL engine using Window expressions, Subqueries, and conditional aggregation ensures that only the final computed dataset is transferred over the wire, optimizing memory and execution speed.',
      misconceptionIdentified: 'Believing that application-level Python loops scale better than relational database engine query execution.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b30-d152-03',
      type: 'REFLECTION',
      order: 3,
      title: 'Engineering Reflection: Mastering the Relational Engine',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how mastering SQL joins, window functions, and QuerySet compiler internals elevates you from a developer who merely writes code to a software architect who designs high-performance database-backed systems.',
      guidingQuestions: [
        'How does understanding query budgets change the way you review pull requests in an engineering team?',
        'Why is query profiling an essential tool before deploying features to production?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b30-d152-04',
      type: 'REFERENCE',
      order: 4,
      title: 'Batch 030 Architecture Summary & Query Performance Guidelines',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PostgreSQL 18 Documentation: Performance Tips & EXPLAIN',
          url: 'https://www.postgresql.org/docs/current/performance-tips.html',
        },
        {
          title: 'Django 6.0 Documentation: Database instrumentation and queries',
          url: 'https://docs.djangoproject.com/en/6.0/topics/db/instrumentation/',
        },
      ],
      documentationExtracts: [
        'Query Budgets: In automated tests, use assertNumQueries(N) to ensure that code paths maintain predictable, constant query counts as data volume grows.',
        'Cartesian Safety: Always verify multi-relation joins using distinct=True or independent subqueries to prevent corrupted counts.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 030 FORMATIVE ASSESSMENT (DAY 152) ──
export const DAY_152_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m8-w30-030',
  moduleId: 'module-pfs-m8',
  courseId: 'course-python-fullstack',
  title: 'Batch 030 Formative Assessment: Advanced SQL Querying, Joins & QuerySet Compilation',
  description: 'Synthesize relational algebra, SQL window functions, correlated subqueries, and query budget optimization in an enterprise analytics and billing engine.',
  type: 'FORMATIVE',
  mode: 'FORMATIVE',
  passingScore: 80,
  maxScore: 100,
  timeLimitMinutes: 60,
  rubric: [
    {
      id: 'rub-b30-01',
      criteria: 'Relational Algebra & QuerySet Compiler Mechanics',
      weight: 0.20,
      description: 'Accurate comprehension of SQL join families, AST compiler mechanics, and deterministic lazy evaluation triggers.',
    },
    {
      id: 'rub-b30-02',
      criteria: 'Advanced Aggregations & SQL Window Functions',
      weight: 0.20,
      description: 'Effective use of Window expressions (DenseRank, RowNumber, Sum) with partition_by and order_by, and conditional Case/When aggregation.',
    },
    {
      id: 'rub-b30-03',
      criteria: 'Correlated Subqueries & Set Operations',
      weight: 0.20,
      description: 'Disciplined use of Subquery, Exists, and OuterRef with strict scalar [:1] slicing and set operations.',
    },
    {
      id: 'rub-b30-04',
      criteria: 'Safe Parameterized Raw SQL & Injection Defense',
      weight: 0.20,
      description: 'Strict enforcement of parameterization (%s bind parameters) in Manager.raw() and connection.cursor() eliminating SQL injection.',
    },
    {
      id: 'rub-b30-05',
      criteria: 'Query Optimization & Fixture Query Budget Contract',
      weight: 0.20,
      description: 'Adherence to the fixture-specific query budget (<= 3 SQL queries for the supplied access pattern), elimination of N+1 cascades, and Cartesian join defense.',
    },
  ],
  questions: [
    {
      id: 'q-b30-01',
      questionText: 'Explain how multiple annotate(Count(...)) joins across different ManyToMany relations cause Cartesian product explosion and how to prevent it.',
      expectedAnswerSnippet: 'Joining multiple ManyToMany tables simultaneously produces a Cartesian product multiplying row counts; prevent by passing distinct=True or using independent Subqueries.',
      points: 20,
    },
  ],
};

// ── BATCH 030 MANIFEST (COMPLETE BATCH · DAYS 148–152 · 425 MIN) ──
export const BATCH_030_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m8-w30-030',
  batchCode: 'P2-M8-W30-BATCH030',
  title: 'Advanced SQL Querying, Joins, Aggregations & QuerySet Compilation Internals',
  difficulty: 'ADVANCED',
  days: [
    DAY_148_MANIFEST,
    DAY_149_MANIFEST,
    DAY_150_MANIFEST,
    DAY_151_MANIFEST,
    DAY_152_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-09T00:00:00.000Z',
  updatedAt: '2026-09-09T00:00:00.000Z',
};
