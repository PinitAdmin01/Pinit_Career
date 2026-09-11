// src/lib/curriculum/pythonFullStack/batch033.ts
// Single Source of Truth for PINIT BATCH 033 (COMPLETE · DAYS 163–167): Month 9 · Week 33 · Days 1–5
// Advanced Django Full-Stack Architecture, Custom QuerySets, Tiered Caching & HTMX
// Pedagogical Flow: UNDERSTAND (Custom QuerySets & Tenant Guards) -> APPLY (Tiered Caching & on_commit) -> BUILD (Hypermedia & HTMX) -> DEBUG (HTMX CSRF & Desync Traps) -> TRANSFER (Reactive SaaS Management Portal & Formative Assessment)

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

export const COMPETENCY_ID_DJANGO_FULLSTACK_HTMX = 'comp-pfs-m9-033';

// ── DAY 163: UNDERSTAND — Custom Model Managers, Domain QuerySets & Multi-Tenant Boundaries ──
export const DAY_163_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m9-w33-033',
  dayNumber: 1,
  title: 'Custom Model Managers, Domain QuerySets & Multi-Tenant Boundaries',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b33-d163-01',
      type: 'THEORY',
      order: 1,
      title: 'Custom QuerySets, Manager Delegation & Multi-Tenant Security Boundaries',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master enterprise Django 6.0 data encapsulation on Python 3.14: subclassing models.QuerySet, chainable domain query methods, exposing QuerySets via CustomQuerySet.as_manager(), and the vital distinction between application-level Manager.get_queryset() query guards and complete server-side tenant authorization boundaries.',
      whatItIs: 'Django architectures encapsulate domain query logic and enforce multi-tenant separation using specialized QuerySet and Manager patterns:\n1. The Custom QuerySet Pattern:\n   - Subclassing models.QuerySet allows defining domain-meaningful, chainable filters directly on the collection (e.g. Invoice.objects.unpaid().due_within(7).for_organization(org)).\n   - CustomQuerySet.as_manager() creates a Manager that automatically copies all custom QuerySet methods onto the manager itself, eliminating duplicate delegation code.\n2. Separation of Concerns:\n   - Views and controllers should never construct raw, multi-clause Q-object filters or complex SQL joins directly.\n   - Domain query logic belongs in the QuerySet; table-level creation logic belongs in the Manager; entity state machines belong on the Model.\n3. The Multi-Tenant Security Invariant (Crucial Boundary):\n   - Overriding Manager.get_queryset() to filter by current tenant (e.g. filter(tenant_id=current_tenant_id)) is an application-level default query guard, NOT a complete security or authorization boundary.\n   - Vulnerability Boundary: Default manager filters can be bypassed if an engineer uses Model._default_manager, raw SQL (connection.cursor()), bulk operations, or third-party libraries.\n   - Mandatory Requirement: Applications must enforce independent server-side tenant authorization at the service/view/domain boundary (verifying permissions on every request), with database-level isolation (e.g. PostgreSQL Row-Level Security / RLS) providing defense-in-depth.',
      whyItExists: 'Encapsulates complex database filtering into expressive, reusable domain methods while preventing data leakage across tenant boundaries in multi-tenant SaaS platforms.',
      problemSolved: 'Eliminates repetitive, error-prone .filter() spaghetti across views and prevents multi-tenant data leaks caused by relying solely on ORM manager filters.',
      mentalModel: 'The Hotel Receptionist vs The Electronic Keycard: A Custom Manager with get_queryset() is a helpful receptionist who only points hotel guests toward their assigned wing. However, if a guest walks around the reception desk or takes the fire stairs (bypasses manager), they could enter another room. Independent authorization and database RLS are the electronic RFID locks on every room door: even if you reach the room, the door refuses to open without valid cryptographic credentials.',
      realWorldUse: 'Multi-tenant B2B SaaS platforms, healthcare patient record isolation, e-commerce order management, and role-based access control.',
      commonMistakes: [
        'Assuming Manager.get_queryset() provides complete multi-tenant security, leaving the system vulnerable if raw SQL or un-scoped managers are accessed.',
        'Duplicating filter logic across both a CustomManager and a CustomQuerySet instead of defining methods on QuerySet and using as_manager().',
        'Calling get_queryset() directly inside model methods, bypassing domain chaining.',
        'Filtering tenant records on the client side rather than enforcing server-side authorization checks.',
      ],
      commonMisconceptions: [
        'Django managers enforce database-level access control (managers are Python-level abstractions that produce SQL; PostgreSQL has no knowledge of Django managers unless RLS is configured).',
        'Custom QuerySets execute queries immediately upon chaining (they remain 100% lazy until evaluated).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b33-d163-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Domain-Driven QuerySets & Multi-Tenant Authorization Enforcement',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.db import models
from django.core.exceptions import PermissionDenied

class InvoiceQuerySet(models.QuerySet):
    def unpaid(self):
        return self.filter(status='UNPAID')

    def for_organization(self, org_id: str):
        return self.filter(organization_id=org_id)

class Invoice(models.Model):
    organization_id = models.UUIDField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=16, default='UNPAID')
    objects = InvoiceQuerySet.as_manager()

def get_tenant_invoices(request_user, org_id: str):
    # Mandatory independent server-side authorization check
    if not request_user.has_org_access(org_id):
        raise PermissionDenied("Access to organization denied.")
    return Invoice.objects.for_organization(org_id).unpaid()`,
      explanation: 'Demonstrates custom QuerySet chaining paired with mandatory independent server-side tenant permission checks.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b33-d163-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Constructing Composable QuerySets for Subscription Billing',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Build a SubscriptionQuerySet with methods active(), expiring_soon(days=7), and for_tenant(tenant_id). Expose it on the Subscription model using as_manager().',
      instructions: [
        'Subclass models.QuerySet creating SubscriptionQuerySet.',
        'Implement active() filtering on status="ACTIVE".',
        'Implement expiring_soon(days=7) calculating target date from timezone.now().',
        'Implement for_tenant(tenant_id) scoping records to tenant.',
        'Assign SubscriptionQuerySet.as_manager() to objects on Subscription.',
      ],
      expectedOutcome: 'Clean, chainable domain queries: Subscription.objects.for_tenant(t).active().expiring_soon().',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b33-d163-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Evaluating Multi-Tenant Isolation & QuerySet Boundaries',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is overriding Manager.get_queryset() to filter by tenant_id insufficient as a sole security boundary in a multi-tenant SaaS application?',
      options: [
        'Because Django managers can only filter tables with fewer than 1,000 rows.',
        'Manager.get_queryset() is an application-level default query guard that can be bypassed by un-scoped queries, raw SQL, or alternative managers; independent server-side authorization and database-level RLS are required.',
        'Because PostgreSQL disables all WHERE clauses when executing under high concurrency.',
        'Django forbids filtering by foreign key fields inside model managers.',
      ],
      correctIndex: 1,
      explanation: 'Manager scoping is an application-level convenience and query guard, not a security boundary. It does not protect against raw queries, direct table access, or model manager overrides. Independent server-side authorization is mandatory.',
      misconceptionIdentified: 'Treating Django ORM managers as equivalent to database-level security and authorization boundaries.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b33-d163-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Defense: The Swiss-Cheese Security Model',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why defense-in-depth (combining domain QuerySets, view authorization decorators, and PostgreSQL RLS) is standard practice in multi-tenant SaaS systems.',
      guidingQuestions: [
        'If an engineer inadvertently writes raw SQL without a tenant WHERE clause, how does PostgreSQL RLS prevent data leakage?',
        'How does domain query encapsulation improve testability and code review velocity?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b33-d163-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Django Custom Managers & QuerySets Documentation',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Custom Managers and QuerySets',
          url: 'https://docs.djangoproject.com/en/6.0/topics/db/managers/',
        },
        {
          title: 'PostgreSQL 18 Documentation: Row Security Policies (RLS)',
          url: 'https://www.postgresql.org/docs/current/ddl-rowsecurity.html',
        },
      ],
      documentationExtracts: [
        'as_manager(): Creates a Manager instance with a copy of the custom QuerySet’s methods.',
        'Multi-tenant Boundary: Manager.get_queryset() scoping is an application-level default query guard, NOT a complete security boundary. Independent server-side tenant authorization is mandatory.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 164: APPLY — Tiered Database Caching & Safe Invalidation with on_commit ──
export const DAY_164_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m9-w33-033',
  dayNumber: 2,
  title: 'Tiered Database Caching & Safe Invalidation with on_commit',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b33-d164-01',
      type: 'THEORY',
      order: 1,
      title: 'Caching Tiers, Stampede Mitigation & Transactional Invalidation Safety',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master enterprise caching in Django 6.0: tiered caching architectures (low-level cache API, template fragment caching, per-view caching), cache stampede (thundering herd) mitigation using probabilistic early expiration and atomic cache.add() locks, and the vital rule of tying cache invalidation strictly to transaction.on_commit().',
      whatItIs: 'Caching stores expensive database query computations in fast, in-memory key-value stores (e.g. Redis) to relieve database load:\n1. Django Caching Tiers:\n   - Low-Level Cache API (django.core.cache.cache): Direct programmatic get(), set(), add(), delete() operations with TTLs.\n   - Template Fragment Caching ({% cache 500 sidebar user.id %}): Caches rendered HTML fragments in template trees.\n   - Per-View Caching (@cache_page): Caches the entire HTTP response for public endpoints.\n2. Cache Stampede (Thundering Herd) Mitigation:\n   - When a popular cached key expires, hundreds of concurrent requests simultaneously observe a cache miss and hammer the database with identical heavy queries.\n   - Mitigation 1: Lock-based regeneration using cache.add("lock:" + key, 1, timeout=10). Only the worker that acquires the lock regenerates the cache; other workers wait or serve stale data.\n   - Mitigation 2: Probabilistic early expiration (XFetch algorithm).\n3. Transactional Cache Invalidation Safety (Mandatory Rule):\n   - Never delete or invalidate cache keys directly inside a transaction.atomic() block before the transaction commits!\n   - Failure Sequence: If you invalidate the cache at Step 2 inside a transaction, a concurrent reader thread immediately gets a cache miss, queries the database, reads uncommitted or pre-transaction state, and repopulates the cache with stale data. If the transaction rolls back, the cache remains corrupted indefinitely.\n   - Invariant: Cache invalidation must strictly execute inside transaction.on_commit(lambda: cache.delete(key)), guaranteeing that invalidation occurs only after changes are durable on disk.',
      whyItExists: 'Reduces database CPU load by 90%+ and slashes p95 response latencies while eliminating cache-state corruption under concurrent writes.',
      problemSolved: 'Eliminates database overload during traffic spikes, prevents stale cache pollution from aborted transactions, and mitigates thundering herd stampedes.',
      mentalModel: 'The Restaurant Menu Whiteboard: The whiteboard out front (cache) lists the daily chef\'s special. If the chef runs out of salmon, they do not erase the whiteboard while still arguing with the fish supplier (inside transaction). If they do, a waiter immediately writes "Salmon" back on the board. The chef erases the whiteboard only after the delivery invoice is signed and filed in the office safe (transaction.on_commit).',
      realWorldUse: 'E-commerce product availability, SaaS analytics dashboards, user permission caches, and global navigation menus.',
      commonMistakes: [
        'Calling cache.delete() inside a transaction before commit, leading to race-condition repopulation of stale data.',
        'Not setting TTLs on cache keys, causing Redis memory exhaustion.',
        'Using un-namespaced cache keys (e.g. "dashboard") that collide across tenants or environments.',
        'Allowing thundering herds to take down the primary database when a top-level cache key expires.',
      ],
      commonMisconceptions: [
        'Cache invalidation is simple (cache invalidation and naming things are the two hardest problems in computer science).',
        'Redis transactions guarantee database transaction atomicity (Redis and PostgreSQL are distinct systems; on_commit is required to synchronize them).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b33-d164-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Atomic Cache Stampede Defense & Safe on_commit Invalidation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.core.cache import cache
from django.db import transaction
from myapp.models import OrganizationMetrics

def update_billing_plan(org_id: str, new_plan: str):
    with transaction.atomic():
        org = OrganizationMetrics.objects.select_for_update().get(id=org_id)
        org.plan = new_plan
        org.save(update_fields=['plan'])

        # 🚨 MANDATORY INVARIANT: Invalidation fires ONLY after database commit!
        cache_key = f"dashboard:org:{org_id}:v1"
        transaction.on_commit(lambda: cache.delete(cache_key))`,
      explanation: 'Schedules cache.delete inside transaction.on_commit to prevent race conditions and stale cache repopulation.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b33-d164-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Building a Versioned Tenant Cache Invalidation Helper',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Write a helper function invalidate_tenant_cache_on_commit(tenant_id: str, scope: str) that schedules the deletion of a versioned cache key inside transaction.on_commit().',
      instructions: [
        'Construct namespaced cache key: tenant:{tenant_id}:{scope}.',
        'Register callback with transaction.on_commit().',
        'Verify in unit tests that callback does not execute if transaction rolls back.',
        'Verify cache key is cleared upon successful commit.',
      ],
      expectedOutcome: 'Guaranteed cache consistency with zero stale reads after database transactions.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b33-d164-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Evaluating Transactional Cache Invalidation Invariants',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What race condition occurs if cache.delete(key) is invoked immediately after Model.save() inside an active database transaction rather than via transaction.on_commit()?',
      options: [
        'The database transaction fails with a Redis protocol error.',
        'A concurrent reader thread can observe the cache miss, query the database before the transaction commits, and repopulate the cache with pre-commit or uncommitted stale data.',
        'Redis automatically aborts the PostgreSQL transaction.',
        'The cache key is locked permanently until server reboot.',
      ],
      correctIndex: 1,
      explanation: 'Deleting the cache key before commit allows concurrent readers to fetch stale data from the database (or dirty uncommitted data) and write it back into the cache, corrupting the cache even if the transaction rolls back.',
      misconceptionIdentified: 'Assuming cache invalidation inside a transaction is safe because the local code executed after .save().',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b33-d164-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Cache Coherency vs Performance: The Eventual Consistency Boundary',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why cache-aside with on_commit invalidation is the gold standard for web architectures.',
      guidingQuestions: [
        'How does on_commit invalidation guarantee that uncommitted rollbacks never leave orphaned cache states?',
        'Why is lock-based regeneration (cache.add) critical for endpoints receiving 5,000 requests per second?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b33-d164-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Django Cache Framework & on_commit Reference',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Django\'s cache framework',
          url: 'https://docs.djangoproject.com/en/6.0/topics/cache/',
        },
        {
          title: 'Django 6.0 Documentation: transaction.on_commit()',
          url: 'https://docs.djangoproject.com/en/6.0/topics/db/transactions/#performing-actions-after-commit',
        },
      ],
      documentationExtracts: [
        'cache.add(): Stores a value only if the key does not already exist. It takes the same parameters as set(). Returns True if the value was added, False otherwise.',
        'on_commit(): Ensures cache invalidations only happen after changes have successfully persisted to disk.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 165: BUILD — Hypermedia-Driven Architecture: Modern Dynamic UI with HTMX & Django ──
export const DAY_165_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m9-w33-033',
  dayNumber: 3,
  title: 'Hypermedia-Driven Architecture: Modern Dynamic UI with HTMX & Django',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b33-d165-01',
      type: 'THEORY',
      order: 1,
      title: 'Hypermedia as the Engine of Application State (HATEOAS), HTMX Core & Django Partials',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master hypermedia-driven architecture using HTMX with Django 6.0: REST and HATEOAS philosophy, exchanging HTML partial fragments instead of heavy JSON APIs, core HTMX attributes (hx-get, hx-post, hx-target, hx-swap, hx-trigger), debounced live search, inline editing, and handling partial vs full-page rendering via request.headers.get("HX-Request").',
      whatItIs: 'HTMX extends standard HTML into a full reactive UI framework without the complexity of client-side Single Page Applications (SPAs):\n1. REST & HATEOAS Core Philosophy:\n   - Traditional SPAs treat the server as a dumb JSON storage API, duplicating routing, validation, and state logic in JavaScript bundles.\n   - Hypermedia-driven systems treat HTML fragments as the engine of state: the server sends ready-to-render HTML partials containing both data and valid next actions (hyperlinks and forms).\n2. Core HTMX Declarative Attributes:\n   - hx-get / hx-post / hx-put / hx-delete: Issues AJAX requests directly from any HTML element.\n   - hx-target: CSS selector of the DOM element to update with the returned HTML.\n   - hx-swap: Controls how the response is swapped (innerHTML, outerHTML, beforebegin, afterend).\n   - hx-trigger: Specifies the event that triggers the request (e.g. keyup changed delay:300ms, click, load).\n3. Django View Architecture for Partials:\n   - Django views inspect request.headers.get("HX-Request") == "true".\n   - If True, the view renders only the partial snippet template (e.g. _member_table_rows.html).\n   - If False (initial direct browser navigation or bookmark), the view renders the full base layout (base.html) containing headers, navigation, and HTMX scripts.\n4. Dynamic UX Without JavaScript Frameworks:\n   - Debounced live search inputs filter tabular datasets instantaneously.\n   - Click-to-edit inline forms replace rows with editing controls in place.\n   - Modal dialogs fetch form partials and swap into dedicated modal target containers.',
      whyItExists: 'Allows full-stack Python engineers to build fluid, real-time user experiences with a fraction of the code, complexity, and maintenance overhead of React/Vue SPAs.',
      problemSolved: 'Eliminates frontend/backend state synchronization bugs, eliminates massive node_modules dependencies, and accelerates feature delivery.',
      mentalModel: 'The Live Document vs The Construction Kit: A React SPA is shipping a box of raw plastic bricks and an instruction manual to the customer\'s browser and making their phone assemble the toy. HTMX is the server assembling the toy in its workshop and delivering the finished piece directly to the customer\'s table, updating only the specific part that changed.',
      realWorldUse: 'SaaS administration consoles, interactive data tables, CRM pipelines, and internal company portals.',
      commonMistakes: [
        'Returning a full HTML page with <html>, <head>, and <body> from an HTMX request meant for an inner target, duplicating page headers and breaking styles.',
        'Forgetting debouncing (delay:300ms) on live search input fields, generating an HTTP request on every single keystroke.',
        'Not configuring CSRF protection for HTMX POST requests, resulting in 403 Forbidden errors.',
      ],
      commonMisconceptions: [
        'HTMX is just jQuery with modern syntax (HTMX is a declarative hypermedia engine adhering strictly to REST and HATEOAS principles).',
        'HTMX cannot build modern, responsive applications (HTMX powers thousands of high-traffic commercial SaaS platforms with sub-50ms interactions).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b33-d165-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Live Debounced Search & Partial Template Rendering in Django 6.0',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from myapp.models import TeamMember

def member_directory_view(request: HttpRequest) -> HttpResponse:
    query = request.GET.get('q', '').strip()
    members = TeamMember.objects.filter(name__icontains=query) if query else TeamMember.objects.all()
    context = {'members': members}
    if request.headers.get('HX-Request') == 'true':
        return render(request, 'members/_rows.html', context)
    return render(request, 'members/directory.html', context)`,
      explanation: 'Inspects HX-Request header to conditionally return partial table rows for HTMX or full layout for direct navigation.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b33-d165-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Building an Inline Status Toggle with hx-post and outerHTML Swap',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Create a Django view toggle_task_status and HTMX button markup that toggles a task between PENDING and COMPLETED on click, replacing the button itself using hx-swap="outerHTML".',
      instructions: [
        'Write toggle_task_status decorated with @require_POST.',
        'Fetch task, invert is_completed, and save(update_fields=["is_completed"]).',
        'Render partial button template _status_button.html.',
        'Configure button with hx-post and hx-swap="outerHTML".',
      ],
      expectedOutcome: 'Instant in-place DOM replacement of button without refreshing surrounding page.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b33-d165-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Evaluating HTMX Hypermedia Swaps & View Logic',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why should a Django view inspect request.headers.get("HX-Request") when responding to HTMX requests?',
      options: [
        'To decrypt the client-side session cookie.',
        'To return only the HTML partial fragment required for the target DOM element instead of wasting bandwidth re-rendering the full base layout.',
        'Because HTMX requests cannot parse HTML and require XML.',
        'To verify that the database is running in serializable isolation mode.',
      ],
      correctIndex: 1,
      explanation: 'When HX-Request is true, the view renders only the relevant partial template for insertion into the target element, preserving client-side DOM state and saving bandwidth.',
      misconceptionIdentified: 'Thinking HTMX requires separate API endpoints instead of sharing unified views that conditionally render partials.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b33-d165-05',
      type: 'REFLECTION',
      order: 5,
      title: 'The Simplification Paradigm: Choosing Hypermedia Over SPA Complexity',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how HTMX shifts state management back to the server where it belongs.',
      guidingQuestions: [
        'How does hypermedia eliminate the entire class of bugs caused by client/server JSON state desynchronization?',
        'Why does debouncing (delay:300ms) prevent server-side query flooding during user typing?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b33-d165-06',
      type: 'REFERENCE',
      order: 6,
      title: 'HTMX Core Attributes & Django Integration Guide',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'HTMX Official Documentation: Core Attributes',
          url: 'https://htmx.org/reference/',
        },
        {
          title: 'Hypermedia Systems Book',
          url: 'https://hypermedia.systems/',
        },
      ],
      documentationExtracts: [
        'hx-swap: Can be innerHTML, outerHTML, beforebegin, afterbegin, beforeend, afterend, delete, or none.',
        'HX-Request: Header sent with every HTMX request with value true.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 166: DEBUG — HTMX Interaction Traps, CSRF Failures & Cache-State Desync ──
export const DAY_166_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m9-w33-033',
  dayNumber: 4,
  title: 'HTMX Interaction Traps, CSRF Failures & Cache-State Desync',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b33-d166-01',
      type: 'THEORY',
      order: 1,
      title: 'Diagnostic Lab: Resolving Production HTMX & Full-Stack Integration Defects',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master full-stack diagnostic engineering across HTMX and Django: resolving 4 common production failure modes including HTMX POST 403 Forbidden CSRF token omissions, out-of-band updates (hx-swap-oob="true") failing due to target ID mismatches, premature cache invalidation before database commit, and layout nesting bugs.',
      whatItIs: 'Production hypermedia architectures encounter subtle integration defects that require systematic debugging:\n1. Defect 1: HTMX POST 403 Forbidden (Missing CSRF Token):\n   - Cause: Unlike standard HTML <form> submissions that include {% csrf_token %} inputs, AJAX requests triggered by non-form elements (buttons, divs) do not include the CSRF token by default.\n   - Solution: Configure hx-headers=\'{\"X-CSRFToken\": \"{{ csrf_token }}\"}\' on the <body> tag or include django-htmx middleware / JavaScript event listener htmx:configRequest.\n2. Defect 2: Out-Of-Band Updates (hx-swap-oob) Target ID Mismatch:\n   - Cause: When updating multiple disconnected elements (e.g. updating a table row and simultaneously updating a badge count in the navbar), HTMX uses hx-swap-oob=\"true\". If the returned element\'s id does not exactly match the DOM element in the page, the out-of-band swap silently fails.\n   - Solution: Enforce strict ID parity and verify returned HTML contains id=\"cart-count\" matching the navbar element.\n3. Defect 3: Premature Cache Invalidation Before Database Commit:\n   - Cause: Invalidation code calls cache.delete() before transaction.atomic() exits. A concurrent reader thread queries the database, reads stale data, and repopulates the cache.\n   - Solution: Move cache invalidation to transaction.on_commit().\n4. Defect 4: Template Inheritance Leak (Modal Nested Inside Full Layout):\n   - Cause: A view handling a modal form forgets to check request.headers.get("HX-Request"), returning a full base.html into the modal target container, producing an entire nested page inside the modal.\n   - Solution: Add conditional template selection based on HX-Request.',
      whyItExists: 'Equips engineers with rigorous diagnostic workflows to isolate, reproduce, and resolve full-stack hypermedia and caching bugs rapidly.',
      problemSolved: 'Fixes broken CSRF submissions, resolves ghost UI states from failed out-of-band swaps, and eliminates nested layout rendering bugs.',
      mentalModel: 'The Multi-Point Diagnostic Probe: Diagnosing hypermedia issues is like troubleshooting an electrical circuit. You test the battery voltage (database state), verify the switch contacts (CSRF headers in browser devtools Network tab), check the wire gauge (HTMX target selectors), and verify the bulb socket (hx-swap attributes). If the light fails to turn on, you isolate which segment broke.',
      realWorldUse: 'Troubleshooting customer checkout forms, fixing notification badge desynchronization, and securing AJAX API endpoints.',
      commonMistakes: [
        'Disabling Django\'s CSRF middleware (@csrf_exempt) to "fix" HTMX 403 errors, creating severe security vulnerabilities.',
        'Not checking the browser Network tab response tab to inspect the exact HTML returned by the server.',
        'Using hx-swap-oob without an id attribute on the top-level partial element.',
      ],
      commonMisconceptions: [
        'HTMX errors appear in the browser console like JavaScript errors (HTMX network failures appear in the Network tab as HTTP status codes).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b33-d166-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Configuring Global HTMX CSRF Injection & Out-of-Band Swaps',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `<!-- base.html configuration -->
<body hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
  <div id="unread-count" class="badge">3</div>
  <div id="main-content"></div>
</body>

<!-- Response returning main swap and out-of-band badge update -->
<div id="main-content">
  <p>New message content</p>
</div>
<div id="unread-count" hx-swap-oob="true" class="badge">4</div>`,
      explanation: 'Configures body-level hx-headers with CSRF token and demonstrates simultaneous primary swap and out-of-band badge counter update.',
      language: 'html',
    } as ExampleBlock,
    {
      id: 'blk-b33-d166-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Debugging and Resolving a 403 CSRF Failure on HTMX POST',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'A developer reports that clicking an HTMX-powered delete button results in HTTP 403 Forbidden. Inspect the code, identify the missing CSRF configuration, and provide the corrected template markup.',
      instructions: [
        'Identify missing CSRF token on standalone HTMX button.',
        'Add hx-headers containing X-CSRFToken header.',
        'Verify request reaches server view with valid CSRF verification.',
        'Add hx-confirm for user confirmation prompt.',
      ],
      expectedOutcome: 'Successful authenticated POST requests with CSRF validation passing.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b33-d166-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Troubleshooting Out-of-Band (OOB) Swap Failures',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'When an HTMX response includes an element with hx-swap-oob="true", what is required for HTMX to successfully update the matching element on the page?',
      options: [
        'The element must be an HTML <form> element with action="/oob/".',
        'The returned partial element must have an id attribute matching the exact id of an existing DOM element in the current page.',
        'The page must be refreshed completely via location.reload().',
        'The response must have Content-Type: application/json.',
      ],
      correctIndex: 1,
      explanation: 'HTMX uses the id attribute of elements with hx-swap-oob="true" to find and update the corresponding element in the DOM regardless of where the main request was targeted.',
      misconceptionIdentified: 'Assuming OOB swaps match on CSS class names rather than unique element IDs.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b33-d166-05',
      type: 'REFLECTION',
      order: 5,
      title: 'The Discipline of Production Devtools Diagnostics',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how inspecting the Network tab and DOM tree systematically isolates 99% of full-stack integration defects.',
      guidingQuestions: [
        'How does checking response headers (e.g. HX-Trigger, Content-Type) confirm that Django executed the intended branch?',
        'Why should you never disable CSRF middleware as a shortcut to fix AJAX errors?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b33-d166-06',
      type: 'REFERENCE',
      order: 6,
      title: 'HTMX Security & Out-of-Band Swap Reference',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'HTMX Documentation: Out of Band Swaps',
          url: 'https://htmx.org/attributes/hx-swap-oob/',
        },
        {
          title: 'Django Documentation: Cross Site Request Forgery protection',
          url: 'https://docs.djangoproject.com/en/6.0/ref/csrf/',
        },
      ],
      documentationExtracts: [
        'hx-swap-oob: Allows you to specify that some content in a response should be swapped into the DOM somewhere other than the target.',
        'CSRF Protection: In AJAX requests, the token can be passed in the X-CSRFToken header.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 167: TRANSFER — Full-Stack Reactive SaaS Management Portal & Formative Assessment ──
export const DAY_167_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m9-w33-033',
  dayNumber: 5,
  title: 'Full-Stack Reactive SaaS Management Portal & Formative Assessment',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b33-d167-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Batch 033 Capstone Challenge: Reactive SaaS Portal Engine',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Multi-tenant enterprise cloud management console with real-time member administration, billing status toggling, and high concurrency.',
      task: 'Synthesize custom domain QuerySets, independent server-side tenant authorization, safe on_commit tiered caching, and HTMX reactive hypermedia into a complete, high-performance enterprise SaaS management portal.',
      constraints: [
        'Must encapsulate queries in custom QuerySet exposed via as_manager().',
        'Must enforce independent view/service level tenant authorization before executing queries.',
        'Must schedule cache invalidation strictly via transaction.on_commit().',
        'Must configure global CSRF header injection for all HTMX interactions.',
        'Must adhere strictly to constant query budget (<= 3 SQL queries per dashboard request).',
      ],
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 60,
      targetCompetencyId: COMPETENCY_ID_DJANGO_FULLSTACK_HTMX,
    } as TransferChallengeBlock,
    {
      id: 'blk-b33-d167-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Synthesizing Full-Stack SaaS Architecture Invariants',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In the completed reactive SaaS portal architecture, what ensures that client UI updates remain responsive while maintaining absolute database integrity?',
      options: [
        'Writing all business logic in client-side JavaScript and disabling Django CSRF protection.',
        'Combining server-side custom QuerySets, independent tenant authorization, on_commit cache invalidation, and declarative HTMX hypermedia partial swaps.',
        'Using MongoDB for user authentication and disabling database transactions.',
        'Reloading the entire browser window on every button click.',
      ],
      correctIndex: 1,
      explanation: 'This full-stack synthesis provides instantaneous reactive interactions (HTMX) backed by strict data modeling (QuerySets), security authorization boundaries, and cache consistency (on_commit).',
      misconceptionIdentified: 'Believing that modern reactive UX requires giving up server-side Django data integrity or adopting client-side JavaScript SPAs.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b33-d167-03',
      type: 'REFLECTION',
      order: 3,
      title: 'Batch 033 Capstone Reflection: The Modern Full-Stack Python Architect',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how mastering the full stack from PostgreSQL transactions and indexes up through Django QuerySets, caching, and HTMX positions you as a complete software engineer.',
      guidingQuestions: [
        'How does owning the entire stack from database I/O to hypermedia UI elevate your ability to deliver high-impact software independently?',
        'Why is understanding security boundaries at every layer the defining hallmark of a senior engineer?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b33-d167-04',
      type: 'REFERENCE',
      order: 4,
      title: 'Batch 033 Architecture Summary & Full-Stack Invariants',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Topic Guides',
          url: 'https://docs.djangoproject.com/en/6.0/topics/',
        },
        {
          title: 'HTMX Official Examples',
          url: 'https://htmx.org/examples/',
        },
      ],
      documentationExtracts: [
        'Full-Stack Invariant: Combine server-side domain QuerySets with independent authorization checks and transactional on_commit caching.',
        'Hypermedia Invariant: Use HTMX declarative attributes to exchange HTML partials, preserving client state and eliminating SPA framework bloat.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 033 FORMATIVE ASSESSMENT (DAY 167) ──
export const DAY_167_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m9-w33-033',
  moduleId: 'module-pfs-m9',
  courseId: 'course-python-fullstack',
  title: 'Batch 033 Formative Assessment: Full-Stack Reactive SaaS Management Portal',
  description: 'Synthesize custom domain QuerySets, independent tenant authorization, safe on_commit caching, HTMX hypermedia partials, and query budget optimization in an enterprise SaaS portal.',
  type: 'FORMATIVE',
  mode: 'FORMATIVE',
  passingScore: 80,
  maxScore: 100,
  timeLimitMinutes: 60,
  rubric: [
    {
      id: 'rub-b33-01',
      criteria: 'Custom QuerySet Domain Encapsulation',
      weight: 0.20,
      description: 'Disciplined use of models.QuerySet subclassing and as_manager() to encapsulate domain filtering and eliminate view spaghetti.',
    },
    {
      id: 'rub-b33-02',
      criteria: 'Independent Tenant Authorization & Manager Scoping',
      weight: 0.20,
      description: 'Strict enforcement of view-level tenant authorization checks, treating Manager.get_queryset() as a query guard rather than a complete security boundary.',
    },
    {
      id: 'rub-b33-03',
      criteria: 'Safe Invalidation via Outermost on_commit()',
      weight: 0.20,
      description: 'Strict scheduling of cache invalidation inside transaction.on_commit(), preventing stale cache pollution from aborted transactions.',
    },
    {
      id: 'rub-b33-04',
      criteria: 'HTMX CSRF & Hypermedia Partial Swap Architecture',
      weight: 0.20,
      description: 'Correct configuration of X-CSRFToken headers, HX-Request inspection for partial rendering, and out-of-band updates.',
    },
    {
      id: 'rub-b33-05',
      criteria: 'Query Budget & N+1 Query Elimination',
      weight: 0.20,
      description: 'Adherence to the fixture-specific query budget (<= 3 SQL queries) using select_related and prefetch_related on all tenant views.',
    },
  ],
  questions: [
    {
      id: 'q-b33-01',
      questionText: 'Explain why cache invalidation must be wrapped in transaction.on_commit() and why Manager.get_queryset() scoping cannot serve as the sole security boundary in a multi-tenant SaaS application.',
      expectedAnswerSnippet: 'Invalidating cache before commit allows concurrent readers to cache stale data if the transaction rolls back. Manager scoping is an application query guard that can be bypassed by un-scoped or raw queries; independent view/service authorization is mandatory.',
      points: 20,
    },
  ],
};

// ── BATCH 033 MANIFEST (COMPLETE BATCH · DAYS 163–167 · 425 MIN) ──
export const BATCH_033_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m9-w33-033',
  batchCode: 'P2-M9-W33-BATCH033',
  title: 'Advanced Django Full-Stack Architecture, Custom QuerySets, Tiered Caching & HTMX',
  difficulty: 'ADVANCED',
  days: [
    DAY_163_MANIFEST,
    DAY_164_MANIFEST,
    DAY_165_MANIFEST,
    DAY_166_MANIFEST,
    DAY_167_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-10T00:00:00.000Z',
  updatedAt: '2026-09-10T00:00:00.000Z',
};
