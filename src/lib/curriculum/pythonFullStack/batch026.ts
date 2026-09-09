// src/lib/curriculum/pythonFullStack/batch026.ts
// Single Source of Truth for PINIT BATCH 026 (COMPLETE · DAYS 128–132): Month 7 · Week 26 · Days 1–5
// Django 6.0 Object-Relational Mapping (ORM), Reversible Migrations & QuerySet Optimization
// Pedagogical Flow: UNDERSTAND (ORM Models & Constraints) -> APPLY (Reversible Migrations & Expand-Contract) -> BUILD (Referential Integrity & M2M Intermediaries) -> DEBUG (Lazy QuerySets & N+1 Profiling) -> TRANSFER (Formative Assessment: Enterprise Clinical Data Warehouse)

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

export const COMPETENCY_ID_DJANGO_ORM_AND_MIGRATIONS = 'comp-pfs-m7-026';

// ── DAY 128: UNDERSTAND — Django ORM Architecture, Model Layer, Field Invariants & Declarative Constraints ──
export const DAY_128_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w26-026',
  dayNumber: 1,
  title: 'Django ORM Architecture, Model Layer, Field Invariants & Declarative Constraints',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b26-d128-01',
      type: 'THEORY',
      order: 1,
      title: 'Django ORM Architecture, Field Types, Null vs Blank Semantics & Database Constraints',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 ORM architecture on Python 3.14: mapping Python model classes to relational schemas, fundamental field types, the critical architectural distinction between null=True and blank=True, and declarative database constraints (CheckConstraint, UniqueConstraint) with Q expressions.',
      whatItIs: 'The Django Object-Relational Mapper (ORM) translates declarative Python classes into relational database tables:\n1. Model Architecture & Python 3.14 Runtime:\n   - Subclassing models.Model defines a database table schema.\n   - Each class attribute represents a database column and provides descriptor-based access.\n   - Django 6.0.8 leverages modern Python type hints and database connection pooling.\n2. Core Field Types & Database Mappings:\n   - CharField(max_length=N): Maps to VARCHAR(N).\n   - TextField(): Maps to TEXT, unbounded text storage.\n   - IntegerField(), BigIntegerField(): Maps to INTEGER and BIGINT.\n   - BooleanField(default=True): Maps to BOOLEAN.\n   - DateTimeField(auto_now_add=True, auto_now=True): auto_now_add records creation timestamp (immutable); auto_now updates timestamp on every save.\n   - UUIDField(default=uuid.uuid4, editable=False): Native UUID column.\n   - DecimalField(max_digits=10, decimal_places=2): High-precision fixed-point numeric storage (mandatory for financial/clinical metrics; never use FloatField for currency).\n3. Critical Field Invariant: null=True vs blank=True:\n   - null=True is purely database-related: it instructs the SQL database to create the column as NULLABLE (accepting NULL values).\n   - blank=True is purely validation-related: it instructs Django form and model validation (full_clean) that the field may be empty (accepting empty string "").\n   - ANTI-PATTERN: For text-based fields (CharField, TextField), setting null=True, blank=True creates two distinct representations for missing data (SQL NULL and empty string ""). The authoritative Django best practice is to set blank=True alone without null=True, enforcing a single consistent empty string "" representation in the database.\n4. Declarative Database Constraints in Meta:\n   - Application-level validation (clean()) is bypassed by bulk operations (bulk_create, bulk_update, QuerySet.update). Therefore, business invariants must be enforced at the database level using Meta.constraints.\n   - CheckConstraint(condition=Q(...), name=...): Enforces arbitrary boolean predicates at the database engine level (e.g. Q(dosage__gt=0)).\n   - UniqueConstraint(fields=[...], name=..., condition=Q(...)): Enforces single or multi-column uniqueness, with optional partial index conditions.',
      whyItExists: 'Provides type-safe, database-agnostic data modeling while ensuring data integrity is enforced by the database engine rather than brittle application code.',
      problemSolved: 'Eliminates SQL injection vulnerabilities, avoids data corruption from dual-empty states, and prevents invalid records from bypassing application validation.',
      mentalModel: 'The Architectural Blueprints and Building Code Inspector: Writing a Django Model is drawing an architectural blueprint. Setting field types specifies the physical materials (steel, concrete, glass). Setting blank=True tells the receptionist whether a form field can be skipped. Setting null=True changes the foundation pillars in the dirt. Meta constraints are the municipal building codes: even if a corrupt contractor tries to bypass the receptionist (bulk_create), the municipal inspector (PostgreSQL/SQLite constraint engine) halts construction immediately.',
      realWorldUse: 'High-reliability enterprise systems, clinical medical records, fintech transaction engines, and multi-tenant SaaS databases.',
      commonMistakes: [
        'Setting null=True on CharField or TextField, resulting in ambiguous data where some rows have NULL and others have empty strings.',
        'Relying solely on model clean() methods for critical invariants, forgetting that bulk_create() and update() bypass clean() entirely.',
        'Using FloatField for financial calculations or precise clinical measurements, introducing IEEE 754 binary floating-point rounding errors.',
        'Forgetting to assign a unique, descriptive name parameter to CheckConstraint and UniqueConstraint.',
      ],
      commonMisconceptions: [
        'blank=True allows NULL values in the database (blank=True only affects form/model validation; null=True affects the database schema).',
        'Model clean() is called automatically when calling save() (clean() is only called automatically by ModelForms; to invoke it programmatically you must call model_instance.full_clean()).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b26-d128-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Clinical Data Model with Explicit Constraints and Null/Blank Invariants',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `import uuid
from decimal import Decimal
from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError

class ClinicalPatientRecord(models.Model):
    """
    Demonstrates Django 6.0 model invariants:
    - UUID primary key
    - Safe string handling (blank=True without null=True)
    - High-precision DecimalField
    - Database-enforced CheckConstraint and UniqueConstraint
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Globally unique clinical record identifier"
    )
    national_id = models.CharField(
        max_length=32,
        unique=True,
        help_text="Mandatory national healthcare registry identifier"
    )
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    middle_name = models.CharField(
        max_length=64,
        blank=True,
        default="",
        help_text="Optional middle name: stored as empty string, NEVER null"
    )
    biomarker_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Clinical score between 0.00 and 100.00"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Soft-deletion / operational status"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "clinical_patient_records"
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=Q(biomarker_score__gte=Decimal("0.00")) & Q(biomarker_score__lte=Decimal("100.00")),
                name="chk_clinical_biomarker_range"
            ),
            models.CheckConstraint(
                condition=~Q(national_id=""),
                name="chk_clinical_national_id_not_empty"
            ),
            models.UniqueConstraint(
                fields=["first_name", "last_name", "national_id"],
                name="uq_clinical_patient_identity"
            )
        ]

    def __str__(self) -> str:
        return f"Patient {self.national_id} ({self.last_name}, {self.first_name})"
`,
      explanation: 'Exemplifies Django 6.0 model best practices: UUID primary key, string fields with blank=True avoiding null=True, DecimalField for exact numerical precision, and database-level CheckConstraint enforcing ranges that cannot be bypassed by bulk SQL operations.',
    } as ExampleBlock,
    {
      id: 'blk-b26-d128-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Eliminating Dual-Empty States and Hardening Model Constraints',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Review a legacy model containing anti-pattern null=True, blank=True on string columns and missing database constraints.',
        'Refactor the string fields to use blank=True and default="" alone, eliminating dual-empty states.',
        'Replace application-level if checks with a database-level CheckConstraint using Q objects.',
        'Add a partial UniqueConstraint that enforces uniqueness only for active records (condition=Q(is_active=True)).',
      ],
      expectedOutcome: `from decimal import Decimal
from django.db import models
from django.db.models import Q

class PrescriptionOrder(models.Model):
    dosage_mg = models.DecimalField(max_digits=6, decimal_places=2)
    instructions = models.TextField(blank=True, default="")
    batch_code = models.CharField(max_length=32)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(dosage_mg__gt=Decimal("0.00")),
                name="chk_prescription_positive_dosage"
            ),
            models.UniqueConstraint(
                fields=["batch_code"],
                condition=Q(is_active=True),
                name="uq_active_prescription_batch"
            ),
        ]
`,
      hints: [
        'Avoid setting null=True on TextField and CharField unless you have an external legacy schema constraint.',
        'Database constraints defined in Meta.constraints apply to both single save() and bulk_create() operations.',
        'Partial UniqueConstraints use the condition parameter with a Q expression.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_ORM_AND_MIGRATIONS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b26-d128-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Field Semantics & Database Constraints',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does the Django core documentation strongly discourage setting null=True on string-based fields (CharField, TextField)?',
      options: [
        'Because it creates two possible database values for "no data" (NULL and empty string ""), leading to inconsistent query filtering and redundant data checks.',
        'Because relational databases like PostgreSQL and MySQL refuse to create VARCHAR columns with NULL values.',
        'Because Python 3.14 raises a TypeError whenever a str object is converted to None.',
        'Because setting null=True disables all indexing and primary keys across the entire table.',
      ],
      correctIndex: 0,
      explanation: 'The Django convention for string fields is to use empty string "" as the single authoritative representation for "no data". Setting null=True creates two distinct states (NULL and ""), requiring developers to write cumbersome queries like Q(field__isnull=True) | Q(field="") to catch all empty rows.',
      misconceptionIdentified: 'Believing null=True is required whenever a text field is optional in forms.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b26-d128-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Database-Level vs Application-Level Integrity',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why defense-in-depth data architecture requires constraints to be enforced at the relational database engine level rather than solely within application code.',
      guidingQuestions: [
        'What common ORM operations bypass model clean() and full_clean() validation entirely?',
        'How do database CheckConstraints protect data integrity when multiple microservices or ETL pipelines write directly to the same database?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b26-d128-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 026 Reference Sheet: Django 6.0 Models & Constraints',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Models',
          url: 'https://docs.djangoproject.com/en/6.0/topics/db/models/',
        },
        {
          title: 'Django 6.0 Documentation: Model Constraints',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/constraints/',
        },
        {
          title: 'Django Model Field Reference: null vs blank',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/fields/#null',
        },
      ],
      documentationExtracts: [
        'Django Field Options: Avoid using null=True on string-based fields such as CharField and TextField. If a string-based field has null=True, that means it has two possible values for "no data": NULL, and the empty string.',
        'Django Constraints: Constraints allow you to define rules that the database must check when inserting or updating data. Always prefer database constraints over model validation when data integrity is critical.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 129: APPLY — Declarative Schema Migrations, Reversible Operations & Backward-Compatible Evolution ──
export const DAY_129_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w26-026',
  dayNumber: 2,
  title: 'Declarative Schema Migrations, Reversible Operations & Backward-Compatible Evolution',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b26-d129-01',
      type: 'THEORY',
      order: 1,
      title: 'Django Migration Engine, Reversible Data Operations & Backward-Compatible Evolution',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 migration internals: migration dependency graphs, declarative schema migrations versus imperative data migrations, the strict reversibility contract for RunPython and RunSQL, and backward-compatible schema evolution using the Expand/Contract pattern to minimize deployment interruption.',
      whatItIs: 'Django migrations provide version control for relational database schemas:\n1. The Migration Graph & django_migrations Table:\n   - Migrations are structured as a Directed Acyclic Graph (DAG) of dependencies.\n   - Applied migrations are recorded in the django_migrations database table with app label, name, and applied timestamp.\n   - Commands: makemigrations inspects model diffs and generates migration files; migrate walks the dependency graph and applies unapplied migrations within atomic transactions.\n2. Declarative Schema Operations vs Imperative Data Operations:\n   - Declarative Schema Operations: CreateModel, AddField, AlterField, RemoveField, AddConstraint. Django can generate reverse schema operations for many structural modifications (e.g. reversing AddField issues DROP COLUMN). However, reversing a schema operation DOES NOT restore transformed or deleted data.\n   - Imperative Data Migrations: Used for data backfilling and format transformations via migrations.RunPython(code, reverse_code) and migrations.RunSQL(sql, reverse_sql).\n3. Strict Reversibility Contract:\n   - Every production data migration MUST supply an explicit reverse handler (reverse_code or reverse_sql).\n   - Setting reverse_code=migrations.RunPython.noop or omitting it entirely causes migrate <app> <previous_migration> to raise an IrreversibleMigration error or leave the database in an inconsistent state if a deployment must be rolled back.\n   - In data migrations, always use apps.get_model("app_label", "ModelName") rather than directly importing model classes, ensuring operations execute against the historical schema state at that point in migration history.\n4. Backward-Compatible Schema Evolution (The Expand/Contract Pattern):\n   - When evolving production schemas under active traffic, breaking changes (such as renaming or splitting columns) cannot be executed in a single atomic migration without risking deployment errors.\n   - Phase 1 (Expand): Add the new column as NULLABLE (or with default). Deploy application code that reads from old column and dual-writes to both old and new columns.\n   - Phase 2 (Backfill): Run a reversible RunPython data migration backfilling historical records from old column to new column in batches.\n   - Phase 3 (Switch Read): Update application code to read from and write to the new column.\n   - Phase 4 (Contract): Remove the old column in a subsequent deployment once all systems are verified.\n   - Operational Bounding: The Expand/Contract pattern minimizes deployment interruption and enables safe phased rollouts, but zero-downtime is an operational goal dependent on traffic volume, database locks, and infrastructure orchestration—not a magic property of code alone.',
      whyItExists: 'Enables safe, reproducible, and reversible schema changes across multi-developer environments and continuous delivery deployment pipelines.',
      problemSolved: 'Prevents database corruption during rollbacks, eliminates schema drift across environments, and prevents deployment lockups during schema updates.',
      mentalModel: 'The Dual-Track Railway Switch: Imagine replacing a rail section while high-speed trains are running. You do not tear up the active track (destructive single migration). Instead, you build a parallel siding track (Expand: new column). You route trains across both tracks while testing the switch (dual-write). You ensure empty cars on the old track are transferred across (Backfill data migration). Once all traffic runs smoothly on the new track, you decommission the old rails (Contract: drop column). And crucially, the switch must have a reverse lever (reversible migrations) in case the new line needs inspection.',
      realWorldUse: 'Zero-interruption production deployments at high-scale tech firms, financial institutions running 24/7 payment ledgers, and compliance-audited healthcare systems.',
      commonMistakes: [
        'Writing migrations.RunPython(forward_func) without providing a reverse_code argument, making database rollbacks impossible in emergency incidents.',
        'Importing models directly (from myapp.models import MyModel) inside migration files instead of using apps.get_model(), causing migrations to fail when models evolve in later commits.',
        'Renaming a production column in a single migration without Expand/Contract, causing active application instances to crash with column not found errors.',
        'Executing large table alterations without analyzing DDL lock durations on high-write production databases.',
      ],
      commonMisconceptions: [
        'Django declarative migrations automatically restore deleted data when reversed (Django only reverses the DDL schema structure; dropped columns and deleted data are permanently lost unless backed up).',
        'Expand/Contract guarantees 100% zero-downtime automatically (table-level ACCESS EXCLUSIVE locks during DDL execution can still queue transactions if not carefully managed).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b26-d129-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Reversible Data Migration with Historical Model Resolution & Expand/Contract',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `# Generated migration file: 0002_backfill_patient_full_name.py
from django.db import migrations

def backfill_full_name_forward(apps, schema_editor):
    """
    Phase 2 of Expand/Contract:
    Backfill new 'canonical_name' field from existing 'first_name' and 'last_name'.
    Uses apps.get_model() to respect historical schema state.
    """
    Patient = apps.get_model("clinical", "ClinicalPatientRecord")
    db_alias = schema_editor.connection.alias

    # Process in batches to avoid high memory consumption
    patients_to_update = []
    for patient in Patient.objects.using(db_alias).filter(canonical_name="").iterator(chunk_size=500):
        middle = f" {patient.middle_name}" if patient.middle_name else ""
        patient.canonical_name = f"{patient.last_name}, {patient.first_name}{middle}".strip()
        patients_to_update.append(patient)

        if len(patients_to_update) >= 500:
            Patient.objects.using(db_alias).bulk_update(patients_to_update, ["canonical_name"])
            patients_to_update.clear()

    if patients_to_update:
        Patient.objects.using(db_alias).bulk_update(patients_to_update, ["canonical_name"])

def backfill_full_name_reverse(apps, schema_editor):
    """
    Explicit reverse handler:
    Clears backfilled data so migration rollback is 100% safe and reproducible.
    """
    Patient = apps.get_model("clinical", "ClinicalPatientRecord")
    db_alias = schema_editor.connection.alias
    Patient.objects.using(db_alias).update(canonical_name="")

class Migration(migrations.Migration):

    dependencies = [
        ("clinical", "0001_initial"),
    ]

    operations = [
        # Note: In Phase 1, 'canonical_name' was added as blank=True, default=""
        migrations.RunPython(
            code=backfill_full_name_forward,
            reverse_code=backfill_full_name_reverse,
            hints={"target_model": "ClinicalPatientRecord"}
        ),
    ]
`,
      explanation: 'Demonstrates a production-grade data migration: uses apps.get_model() for historical isolation, implements batching for memory safety, executes against schema_editor.connection.alias, and provides an explicit reverse_code handler guaranteeing rollback reversibility.',
    } as ExampleBlock,
    {
      id: 'blk-b26-d129-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Writing a Fully Reversible Data Migration with apps.get_model',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Write a data migration that splits a legacy full_address string into street and postal_code.',
        'Ensure the forward function resolves the model via apps.get_model("logistics", "DeliveryLocation").',
        'Implement the reverse function that recombines street and postal_code back into full_address.',
        'Register both functions inside migrations.RunPython(code=..., reverse_code=...).',
      ],
      expectedOutcome: `from django.db import migrations

def forward_split_address(apps, schema_editor):
    DeliveryLocation = apps.get_model("logistics", "DeliveryLocation")
    db_alias = schema_editor.connection.alias
    for loc in DeliveryLocation.objects.using(db_alias).iterator():
        parts = loc.full_address.rsplit(" ", 1)
        loc.street = parts[0] if parts else ""
        loc.postal_code = parts[1] if len(parts) > 1 else ""
        loc.save(update_fields=["street", "postal_code"])

def reverse_merge_address(apps, schema_editor):
    DeliveryLocation = apps.get_model("logistics", "DeliveryLocation")
    db_alias = schema_editor.connection.alias
    for loc in DeliveryLocation.objects.using(db_alias).iterator():
        loc.full_address = f"{loc.street} {loc.postal_code}".strip()
        loc.save(update_fields=["full_address"])

class Migration(migrations.Migration):
    dependencies = [("logistics", "0001_initial")]
    operations = [
        migrations.RunPython(forward_split_address, reverse_merge_address),
    ]
`,
      hints: [
        'Never import the model from models.py inside migrations.',
        'Always pass schema_editor.connection.alias to .using() so multi-database migrations route queries to the correct database.',
        'Ensure reverse_code is never omitted on data transformations.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_ORM_AND_MIGRATIONS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b26-d129-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Reversibility & Migration Graphs',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why must migrations.RunPython provide an explicit reverse_code argument in enterprise production environments?',
      options: [
        'Without reverse_code, rolling back the migration via manage.py migrate <app> <previous_migration> raises IrreversibleMigration, blocking automated rollbacks during deployment failures.',
        'Django will automatically delete all tables in the database if reverse_code is omitted.',
        'Python 3.14 forbids calling functions with fewer than two parameters in migration classes.',
        'reverse_code is required only if the target database is SQLite.',
      ],
      correctIndex: 0,
      explanation: 'If a data migration omits reverse_code, Django designates the migration as irreversible. If a deployment fails and the operations team attempts to rollback schema versions using manage.py migrate <app> <prior_num>, Django halts with an IrreversibleMigration exception, leaving the system stranded in a broken state.',
      misconceptionIdentified: 'Believing Django can introspect Python code and automatically reverse custom data transformations.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b26-d129-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Rollback Readiness and Migration Discipline',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how migration discipline and the Expand/Contract pattern transform database deployments from high-risk events into routine, low-risk engineering operations.',
      guidingQuestions: [
        'Why is testing migration rollbacks (running migrate forward then backward) in CI just as important as testing forward migrations?',
        'How does the Expand/Contract pattern decouple database schema evolution from application software releases?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b26-d129-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 026 Reference Sheet: Django Migrations & Operations',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Migrations',
          url: 'https://docs.djangoproject.com/en/6.0/topics/migrations/',
        },
        {
          title: 'Django 6.0 Documentation: Migration Operations (RunPython & RunSQL)',
          url: 'https://docs.djangoproject.com/en/6.0/ref/migration-operations/#runpython',
        },
        {
          title: 'Martin Fowler: Evolutionary Database Design & Expand/Contract',
          url: 'https://martinfowler.com/articles/evodb.html',
        },
      ],
      documentationExtracts: [
        'Django RunPython: RunPython takes two arguments: the first is the callable to run forwards, and the second is the callable to run in reverse. If you do not supply the reverse callable, the migration cannot be reversed.',
        'Historical Models: You should always use apps.get_model("app_name", "model_name") inside data migrations. This ensures you are querying the historical model as it existed at the time the migration was written.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 130: BUILD — Relational Integrity, Foreign Keys, Intermediate Tables & Multi-Table Relationships ──
export const DAY_130_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w26-026',
  dayNumber: 3,
  title: 'Relational Integrity, Foreign Keys, Intermediate Tables & Multi-Table Relationships',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b26-d130-01',
      type: 'THEORY',
      order: 1,
      title: 'Referential Integrity, On-Delete Semantics, Related Names & Explicit Intermediate Models',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master multi-table relational modeling in Django 6.0: ForeignKey and OneToOneField relationships, strict on_delete referential integrity invariants (models.PROTECT vs models.CASCADE), reverse descriptor naming with related_name, and ManyToManyField relationships with explicit intermediate (through) models.',
      whatItIs: 'Relational integrity links independent entity models while enforcing business and referential constraints:\n1. ForeignKey & Referential Deletion Semantics (on_delete):\n   - When a referenced parent record is deleted, on_delete dictates the fate of child records.\n   - models.PROTECT: Prevents deletion of the referenced parent by raising models.ProtectedError if child records exist. MANDATORY for financial records, clinical audits, and enterprise invoices where accidental cascading deletes cause catastrophic data loss.\n   - models.CASCADE: Deletes all child records referencing the deleted parent. Suitable only for tightly coupled child entities (e.g. order line items deleted with a draft order).\n   - models.SET_NULL: Sets foreign key column to NULL (requires null=True on the field).\n   - models.RESTRICT: Similar to PROTECT, but permits deletion if the cascade is satisfied via a separate allowed cascade path.\n2. Reverse Relationships & related_name Invariant:\n   - Defines the attribute name exposed on the target model pointing back to this model.\n   - Default name is lowercase model name followed by _set (e.g. order_set).\n   - Best Practice: Explicit related_name (e.g. related_name="prescriptions") avoids collisions, documents intent, and enables readable reverse querying.\n   - Setting related_name="+" explicitly disables reverse descriptor generation when not needed.\n3. Many-to-Many Relationships with Explicit Intermediate Models (through):\n   - Standard ManyToManyField auto-generates a hidden two-column join table.\n   - Enterprise Anti-Pattern: Auto-generated join tables cannot store audit metadata, timestamps, assignment roles, or status flags.\n   - Authoritative Solution: Always define an explicit intermediate model specified via through="ModelName". This enables storing rich metadata (e.g. assigned_by, assigned_at, role, is_primary) and enforces multi-column unique constraints on the relationship.',
      whyItExists: 'Enables modeling complex relational domains while protecting against catastrophic accidental data loss and providing rich metadata on relationship edges.',
      problemSolved: 'Eliminates silent cascading deletion of critical audit trails and provides flexible schema evolution for many-to-many business relationships.',
      mentalModel: 'The Corporate Safety Deposit Vault and Keycard Registry: A bank customer (Parent) holds a safety deposit box (Child). If the bank closes customer accounts, you do not shred the deposit box with cash inside (CASCADE danger)! You post a guard (models.PROTECT) who refuses to close the account until the deposit box is formally audited and emptied. And when multiple bank officers access a vault (ManyToMany), you do not use an anonymous notebook; you use an explicit official visitor ledger (Intermediate Through Model) recording the timestamp, purpose, and badge number of every entry.',
      realWorldUse: 'Clinical patient-provider care teams, enterprise role-based permissions, financial transaction routing, and supply chain inventory hierarchies.',
      commonMistakes: [
        'Defaulting to on_delete=models.CASCADE on critical enterprise models, allowing a single deleted user to silently wipe out historical transactions or patient charts.',
        'Using auto-generated ManyToManyField tables without a through model, later realizing you need to add an assigned_at timestamp and having to perform a painful table migration.',
        'Choosing ambiguous related_name strings (e.g. related_name="data"), causing name collisions across different relationship fields.',
        'Forgetting to add a UniqueConstraint on [source_id, target_id] in custom through models, permitting duplicate relationship rows.',
      ],
      commonMisconceptions: [
        'models.PROTECT and models.RESTRICT are identical (models.RESTRICT permits deletion if a separate cascading relationship also deletes the referencing records, whereas PROTECT strictly forbids parent deletion as long as references exist).',
        'through models require manual querying for everything (Django still allows accessing target_model.filter(m2m_field=...) directly through the intermediate model).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b26-d130-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Enterprise Clinical Care Team Architecture with PROTECT & Explicit Through Model',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `import uuid
from django.db import models

class Clinician(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    license_number = models.CharField(max_length=64, unique=True)
    full_name = models.CharField(max_length=128)
    specialty = models.CharField(max_length=64)

    class Meta:
        db_table = "clinical_clinicians"

    def __str__(self) -> str:
        return f"Dr. {self.full_name} ({self.specialty})"

class PatientCareTeam(models.Model):
    """
    Patient aggregate root with M2M clinicians via an explicit intermediate model.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.CharField(max_length=32, unique=True)
    care_unit = models.CharField(max_length=64)
    clinicians = models.ManyToManyField(
        Clinician,
        through="CareTeamAssignment",
        related_name="care_teams",
        help_text="Clinicians assigned to this patient's care team"
    )

    class Meta:
        db_table = "clinical_patient_care_teams"

class CareTeamAssignment(models.Model):
    """
    Explicit intermediate through-model capturing rich relational metadata.
    Enforces referential PROTECT to preserve clinical audit trails.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    care_team = models.ForeignKey(
        PatientCareTeam,
        on_delete=models.CASCADE,
        related_name="assignments"
    )
    clinician = models.ForeignKey(
        Clinician,
        on_delete=models.PROTECT,
        related_name="assignments",
        help_text="Clinician cannot be deleted if assigned to historical or active care teams"
    )
    role = models.CharField(
        max_length=32,
        choices=[
            ("PRIMARY", "Primary Attending"),
            ("CONSULTING", "Consulting Specialist"),
            ("NURSE", "Lead Nurse"),
        ],
        default="PRIMARY"
    )
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "clinical_care_team_assignments"
        constraints = [
            models.UniqueConstraint(
                fields=["care_team", "clinician", "role"],
                name="uq_care_team_clinician_role"
            )
        ]
`,
      explanation: 'Demonstrates enterprise relational invariants: Clinician uses on_delete=models.PROTECT to prevent historical data loss, ManyToManyField uses explicit through="CareTeamAssignment", and the intermediate table tracks assignment role and timestamp with a UniqueConstraint preventing duplicate roles.',
    } as ExampleBlock,
    {
      id: 'blk-b26-d130-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Modeling Protected Audit Invariants with Custom Junction Tables',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Define a MedicalDevice model with a UUID primary key and serial_number.',
        'Define a MaintenanceLog model referencing MedicalDevice using on_delete=models.PROTECT to prevent deleting devices with active maintenance histories.',
        'Specify explicit related_name="maintenance_logs" on the ForeignKey.',
        'Add a technician M2M relationship through an explicit DeviceInspection junction table recording inspected_at and passed_certification boolean.',
      ],
      expectedOutcome: `import uuid
from django.db import models

class MedicalDevice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    serial_number = models.CharField(max_length=64, unique=True)

class Technician(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)

class DeviceInspection(models.Model):
    device = models.ForeignKey(MedicalDevice, on_delete=models.PROTECT, related_name="inspections")
    technician = models.ForeignKey(Technician, on_delete=models.PROTECT, related_name="inspections")
    inspected_at = models.DateTimeField(auto_now_add=True)
    passed_certification = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["device", "technician", "inspected_at"], name="uq_inspection_event")
        ]
`,
      hints: [
        'Always use models.PROTECT for regulatory and audit log models.',
        'Explicit related_name prevents Django from using default _set suffixes.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_ORM_AND_MIGRATIONS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b26-d130-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Referential Integrity & Through Models',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In an enterprise clinical application, what is the critical architectural reason to use on_delete=models.PROTECT instead of models.CASCADE on Clinician foreign keys?',
      options: [
        'models.PROTECT prevents accidental deletion of a clinician record when active patient charts or historical prescriptions reference it, raising ProtectedError and preserving medical audit integrity.',
        'models.CASCADE causes database deadlocks whenever two users update a clinician simultaneously.',
        'models.PROTECT automatically encrypts all clinician medical records using AES-256.',
        'models.CASCADE is deprecated in Django 6.0 and removed on Python 3.14.',
      ],
      correctIndex: 0,
      explanation: 'models.PROTECT raises a django.db.models.ProtectedError if an attempt is made to delete a referenced entity while child records exist. In medical, financial, and legal domains, cascading deletions can erase mission-critical historical audit trails and violate regulatory compliance.',
      misconceptionIdentified: 'Assuming CASCADE is the standard default for all foreign keys without evaluating data retention regulations.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b26-d128-05-ref',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Designing for Auditability and Data Retention',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on the long-term operational consequences of choosing CASCADE versus PROTECT in database design.',
      guidingQuestions: [
        'How does using explicit through models simplify auditing changes in user permissions or clinical care assignments?',
        'What data recovery challenges arise when a cascading delete wipes out thousands of rows across five related tables?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b26-d128-06-ref',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 026 Reference Sheet: Relational Modeling & Integrity',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: ForeignKey on_delete Options',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/fields/#arguments',
        },
        {
          title: 'Django 6.0 Documentation: Many-to-Many Relationships with through',
          url: 'https://docs.djangoproject.com/en/6.0/topics/db/models/#extra-fields-on-many-to-many-relationships',
        },
      ],
      documentationExtracts: [
        'ForeignKey on_delete: When an object referenced by a ForeignKey is deleted, Django will emulate the behavior of the SQL constraint specified by the on_delete argument.',
        'models.PROTECT: Prevent deletion of the referenced object by raising ProtectedError, a subclass of django.db.IntegrityError.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 131: DEBUG — QuerySet Internals, Lazy Evaluation, N+1 Query Debugging & Profiled Join Strategies ──
export const DAY_131_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w26-026',
  dayNumber: 4,
  title: 'QuerySet Internals, Lazy Evaluation, N+1 Query Debugging & Profiled Join Strategies',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b26-d131-01',
      type: 'THEORY',
      order: 1,
      title: 'QuerySet Lazy Evaluation, Caching Mechanics, N+1 Defect Diagnosis & Profiled Joins',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 QuerySet internals: lazy evaluation and result cache mechanics, connection.queries development diagnostics versus production database telemetry, systematic N+1 query diagnosis, and engineering trade-offs between select_related (SQL JOIN) and prefetch_related (batched IN lookups).',
      whatItIs: 'Understanding QuerySet evaluation internals is essential for high-performance data systems:\n1. Lazy Evaluation & The Result Cache (_result_cache):\n   - Creating a QuerySet (e.g. qs = Patient.objects.filter(is_active=True)) does NOT execute SQL.\n   - QuerySets are evaluated only when their results are materialized: by iterating (for p in qs:), slicing with a step ([::2]), calling len(), bool(), list(), or serializing.\n   - Once evaluated, results are cached in memory on the QuerySet instance in qs._result_cache. Subsequent iterations on that same QuerySet instance reuse the cached list without touching the database.\n2. Invariant: connection.queries is ONLY Populated When DEBUG = True:\n   - django.db.connection.queries stores a historical list of all executed SQL queries and elapsed times in memory during development (DEBUG = True).\n   - In production (DEBUG = False), connection.queries is intentionally an empty list to avoid catastrophic unbounded memory leaks from recording every query executed by long-running WSGI/ASGI worker processes.\n   - Production query monitoring and N+1 tracking MUST use database-level telemetry (such as PostgreSQL pg_stat_statements) or APM distributed tracing.\n3. The N+1 Query Anti-Pattern:\n   - Occurs when code fetches N child records in 1 query, and then iterates through them accessing a foreign key or M2M relation, triggering an additional query for each row: 1 + N total database queries.\n   - At 1,000 rows, this generates 1,001 network roundtrips, causing catastrophic database connection pool exhaustion and latency spikes.\n4. Profiled Optimization Trade-offs:\n   - select_related(*fields): Executes a single SQL query using an INNER JOIN or LEFT OUTER JOIN. Best for single-valued relationships (ForeignKey, OneToOneField). Trade-off: wide joins with large text columns increase memory usage and database server load.\n   - prefetch_related(*lookups): Executes separate queries using WHERE id IN (...) and performs the relationship stitching in Python memory. Mandatory for multi-valued relationships (ManyToManyField, reverse ForeignKey). Trade-off: passing tens of thousands of IDs in an IN clause risks parameter limits and memory spikes.\n   - Engineering Principle: Never treat select_related and prefetch_related as mechanical rules; always profile query counts, execution times, and memory footprint.',
      whyItExists: 'Prevents severe performance degradation, resource exhaustion, and database crashes under concurrent production query workloads.',
      problemSolved: 'Eliminates thousands of redundant database roundtrips and provides principled architectural strategies for query optimization.',
      mentalModel: 'The Grocery Shopping Trip: The N+1 problem is driving to the supermarket to buy a shopping list of 50 ingredients, but driving back home after buying each individual item (51 round trips!). Using select_related is like having the grocery store bundle the items together in one large crate before you leave (1 trip, larger box). Using prefetch_related is sending two shoppers with distinct lists who meet back in the kitchen and combine their groceries on the counter (2 trips, parallel efficiency).',
      realWorldUse: 'High-throughput REST APIs, GraphQL resolvers, microservice data aggregations, and large-scale reporting dashboards.',
      commonMistakes: [
        'Attempting to inspect connection.queries in production and finding an empty list, unaware that it requires DEBUG=True.',
        'Iterating over a reverse foreign key inside a template loop without prefetch_related, triggering hundreds of hidden SQL queries.',
        'Using select_related across five levels of deeply nested relations, creating massive join queries that overwhelm database query planners.',
        'Re-evaluating QuerySets repeatedly by calling .filter() in a loop instead of leveraging the result cache.',
      ],
      commonMisconceptions: [
        'select_related works on ManyToManyField (select_related only supports single-valued relationships; ManyToManyField requires prefetch_related).',
        'prefetch_related executes a single complex SQL join (it executes separate SQL queries and stitches the records together in Python memory).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b26-d131-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Diagnosing and Eliminating N+1 Queries with Profiled select_related & prefetch_related',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `import time
from django.db import connection, reset_queries
from django.conf import settings
from clinical.models import CareTeamAssignment, PatientCareTeam

def demonstrate_query_profiling():
    """
    Demonstrates measuring query counts and eliminating N+1 regressions.
    NOTE: connection.queries is populated ONLY when settings.DEBUG is True!
    """
    assert settings.DEBUG is True, "connection.queries profiling requires DEBUG=True"

    # --- SCENARIO A: The N+1 Query Trap ---
    reset_queries()
    start_time = time.perf_counter()

    # Query 1: Fetch all assignments
    assignments = list(CareTeamAssignment.objects.all()[:50])
    # Queries 2..51: N queries to fetch clinician and care_team foreign keys
    care_summary = []
    for a in assignments:
        care_summary.append(f"{a.clinician.full_name} -> {a.care_team.patient_id}")

    n_plus_1_queries = len(connection.queries)
    n_plus_1_time = (time.perf_counter() - start_time) * 1000.0

    print(f"[NAIVE N+1] Executed {n_plus_1_queries} queries in {n_plus_1_time:.2f}ms")

    # --- SCENARIO B: Profiled select_related Optimization ---
    reset_queries()
    start_time = time.perf_counter()

    # Single SQL Query with INNER JOINs for clinician and care_team
    optimized_assignments = list(
        CareTeamAssignment.objects.select_related("clinician", "care_team").all()[:50]
    )
    for a in optimized_assignments:
        care_summary.append(f"{a.clinician.full_name} -> {a.care_team.patient_id}")

    optimized_queries = len(connection.queries)
    optimized_time = (time.perf_counter() - start_time) * 1000.0

    print(f"[OPTIMIZED] Executed {optimized_queries} query in {optimized_time:.2f}ms")
    assert optimized_queries == 1, "Expected exactly 1 SQL query with select_related"

    # --- SCENARIO C: Profiled prefetch_related for M2M Relations ---
    reset_queries()
    # Exactly 2 SQL queries: (1) care teams, (2) clinicians for those care teams
    teams = list(PatientCareTeam.objects.prefetch_related("clinicians").all()[:50])
    for team in teams:
        clinician_names = [c.full_name for c in team.clinicians.all()]

    m2m_queries = len(connection.queries)
    assert m2m_queries == 2, f"Expected exactly 2 SQL queries with prefetch_related, found {m2m_queries}"
`,
      explanation: 'Shows real-world query profiling: documents the DEBUG=True constraint on connection.queries, proves how select_related reduces 51 queries to 1 single JOIN, and demonstrates prefetch_related executing exactly 2 queries for ManyToMany relations.',
    } as ExampleBlock,
    {
      id: 'blk-b26-d131-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Identifying and Refactoring N+1 Query Regressions',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Audit an endpoint executing an N+1 query loop across a Patient -> Prescription -> Medication hierarchy.',
        'Use select_related on single-valued foreign keys (Prescription -> Medication).',
        'Use prefetch_related on the multi-valued reverse relationship (Patient -> prescriptions).',
        'Write an assertion validating that the total query count is bounded to exactly 2 queries regardless of the number of patients returned.',
      ],
      expectedOutcome: `from django.db import connection, reset_queries
from django.db.models import Prefetch
from clinical.models import Patient, Prescription

def get_optimized_patient_charts():
    reset_queries()
    
    # Exactly 2 queries:
    # Query 1: Patients
    # Query 2: Prescriptions joined with Medications via select_related
    prescription_prefetch = Prefetch(
        "prescriptions",
        queryset=Prescription.objects.select_related("medication")
    )
    
    patients = list(Patient.objects.prefetch_related(prescription_prefetch).all())
    
    # Iteration executes zero additional database queries
    for p in patients:
        for rx in p.prescriptions.all():
            _ = rx.medication.name
            
    return patients
`,
      hints: [
        'Prefetch objects allow combining prefetch_related with an inner select_related.',
        'Remember that QuerySet evaluation happens when calling list() or iterating.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_ORM_AND_MIGRATIONS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b26-d131-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: QuerySet Evaluation & Profiling Invariants',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Under what runtime condition does django.db.connection.queries record executed SQL queries, and why is this behavior designed this way?',
      options: [
        'Only when DEBUG = True. In production (DEBUG = False), it is an empty list to prevent catastrophic unbounded memory leaks from recording every query executed by worker processes.',
        'Only when using SQLite. When using PostgreSQL or MySQL, connection.queries is disabled by default.',
        'Only when settings.DATABASES specifies a replica reader connection.',
        'It is always enabled in both development and production and cannot be turned off.',
      ],
      correctIndex: 0,
      explanation: 'In development (DEBUG=True), Django records every SQL query and execution duration in connection.queries. In production (DEBUG=False), this logging is deactivated to prevent worker processes from continuously consuming memory until they are killed by OOM (Out-Of-Memory) supervisors.',
      misconceptionIdentified: 'Assuming connection.queries can be used for live production telemetry and APM monitoring.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b26-d131-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: The Art and Trade-offs of QuerySet Optimization',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why query optimization requires balancing network roundtrips, database server memory, and application server memory.',
      guidingQuestions: [
        'Why might a single giant SQL query with 10 INNER JOINs perform worse than two simpler queries executed via prefetch_related?',
        'How do tools like pg_stat_statements help identify production query bottlenecks that cannot be caught with connection.queries?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b26-d131-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 026 Reference Sheet: QuerySet Performance & Profiling',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: QuerySet API Reference',
          url: 'https://docs.djangoproject.com/en/6.0/ref/models/querysets/',
        },
        {
          title: 'Django 6.0 Documentation: Database Access Optimization',
          url: 'https://docs.djangoproject.com/en/6.0/topics/db/optimization/',
        },
        {
          title: 'PostgreSQL Documentation: pg_stat_statements',
          url: 'https://www.postgresql.org/docs/current/pgstatstatements.html',
        },
      ],
      documentationExtracts: [
        'Database Optimization: Understand QuerySet evaluation. QuerySets are lazy: the act of creating a QuerySet doesn\'t involve any database activity.',
        'select_related vs prefetch_related: select_related works by creating an SQL join and including the fields of the related object in the SELECT statement. prefetch_related does a separate lookup for each relationship and does the "joining" in Python.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 132: TRANSFER — Formative Assessment: Enterprise Clinical Data Warehouse ──
export const DAY_132_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m7-w26-026',
  title: 'Formative Assessment: Enterprise Clinical Data Warehouse: Relational Persistence, Reversible Schema Evolution & Profiled Query Optimization',
  type: 'FORMATIVE',
  mode: 'FORMATIVE',
  passingScore: 80,
  timeLimitMinutes: 60,
  rubric: [
    {
      id: 'rub-b26-01',
      title: 'Relational Model Schema & Declarative Invariants',
      description: 'Clean models with UUID primary keys, high-precision DecimalFields, string fields using blank=True avoiding dual-empty states, and database-enforced CheckConstraints with Q expressions.',
      weight: 0.20,
    },
    {
      id: 'rub-b26-02',
      title: 'Reversible Schema & Data Migrations with Expand/Contract',
      description: 'Declarative schema migrations, backward-compatible Expand/Contract schema evolution, and imperative RunPython/RunSQL data operations with explicit reverse handlers using apps.get_model().',
      weight: 0.20,
    },
    {
      id: 'rub-b26-03',
      title: 'Referential Integrity & Explicit Junction Models',
      description: 'Explicit on_delete=models.PROTECT guarding clinical audit trails, meaningful related_names, and ManyToMany relationships implemented via explicit through models with metadata.',
      weight: 0.20,
    },
    {
      id: 'rub-b26-04',
      title: 'QuerySet Internals & N+1 Query Elimination',
      description: 'Understanding lazy evaluation, result caching, systematic diagnosis of N+1 query loops, and strict bounds on query counts.',
      weight: 0.20,
    },
    {
      id: 'rub-b26-05',
      title: 'Profiled Join Optimization & Production Query Telemetry',
      description: 'Disciplined application of select_related and prefetch_related, awareness of connection.queries DEBUG limitation, and production query telemetry strategies.',
      weight: 0.20,
    },
  ],
};

export const DAY_132_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w26-026',
  dayNumber: 5,
  title: 'Formative Assessment: Enterprise Clinical Data Warehouse: Relational Persistence, Reversible Schema Evolution & Profiled Query Optimization',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b26-d132-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Formative Assessment: Architect and Optimize the Clinical Data Warehouse',
      estimatedMinutes: 75,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Enterprise Clinical Genomics & Patient Registry Data Warehouse',
      task: 'Design, implement, and optimize the relational persistence layer for an enterprise clinical genomics data warehouse running Django 6.0.8 on Python 3.14. You must define hardened patient and diagnostic models with database CheckConstraints, execute a backward-compatible Expand/Contract data migration with an explicit reversible RunPython handler, enforce referential integrity using on_delete=models.PROTECT and an explicit through model for clinician care teams, and eliminate N+1 query defects using profiled select_related and prefetch_related strategies.',
      constraints: [
        'Must pin Django==6.0.8 running on Python 3.14 baseline.',
        'All string fields must use blank=True and default="" alone; null=True on CharField/TextField is strictly forbidden.',
        'All numerical clinical scores must use DecimalField; FloatField is forbidden for medical metrics.',
        'All critical foreign keys must use on_delete=models.PROTECT to preserve clinical audit trails.',
        'All data migrations must implement an explicit reverse_code callable using apps.get_model() to guarantee 100% rollback reversibility.',
        'Endpoint queries must eliminate N+1 regressions and bound total queries to a constant count regardless of result set size.',
      ],
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 75,
      targetCompetencyId: COMPETENCY_ID_DJANGO_ORM_AND_MIGRATIONS,
      assessmentRef: 'asm-pfs-m7-w26-026',
    } as TransferChallengeBlock,
    {
      id: 'blk-b26-d132-02',
      type: 'REFLECTION',
      order: 2,
      title: 'Batch 026 Retrospective: Relational Discipline and Database Stewardship',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on completing Batch 026: how treating the database as an authoritative stateful foundation (rather than just a dumb storage layer for Python objects) elevates software architecture quality.',
      guidingQuestions: [
        'How does enforcing constraints at the database level defend against catastrophic bugs across microservices?',
        'Why is understanding the physical SQL queries generated by an ORM the hallmark of a senior backend engineer?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b26-d132-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 026 Master Reference Sheet',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Release Notes',
          url: 'https://docs.djangoproject.com/en/6.0/releases/6.0/',
        },
        {
          title: 'PostgreSQL Constraints Documentation',
          url: 'https://www.postgresql.org/docs/current/ddl-constraints.html',
        },
        {
          title: 'Database Reliability Engineering Best Practices',
          url: 'https://sre.google/sre-book/table-of-contents/',
        },
      ],
      documentationExtracts: [
        'Data Integrity: The ultimate guarantee of data correctness is the database engine. Application layers come and go, but data outlives code.',
        'Zero Downtime: Continuous deployment of database applications requires backward-compatible evolutionary schema transformations.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 026 MANIFEST (COMPLETE BATCH · DAYS 128–132 · 5 DAYS · 425 MIN) ──
export const BATCH_026_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m7-w26-026',
  batchCode: 'P2-M7-W26-BATCH026',
  title: 'Django 6.0 Object-Relational Mapping (ORM), Reversible Migrations & QuerySet Optimization',
  difficulty: 'ADVANCED',
  days: [
    DAY_128_MANIFEST,
    DAY_129_MANIFEST,
    DAY_130_MANIFEST,
    DAY_131_MANIFEST,
    DAY_132_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
};
