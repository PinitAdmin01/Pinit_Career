// src/lib/curriculum/pythonFullStack/batch010.ts
// Single Source of Truth for PINIT BATCH 010: Month 3 · Week 10 · Days 46–50
// Configuration, Type-Modeled Data & Modern Python Packaging
// Pedagogical Flow: UNDERSTAND (Configuration & Environment) -> APPLY (Basic Type Annotations & Dataclasses) -> BUILD (pyproject.toml, Build, Install & CLI Entry Points) -> DEBUG (Packaging & Environment Diagnostics) -> TRANSFER (Distributable Python Application)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  GuidedLabBlock,
  IndependentPracticeBlock,
  DebuggingChallengeBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_PACKAGING_CONFIGURATION = 'comp-pfs-m3-010';

// ── DAY 46: UNDERSTAND — Configuration & Environment Management ────────────────
export const DAY_46_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w10-010',
  dayNumber: 1,
  title: 'Configuration & Environment Management',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b10-d46-01',
      type: 'THEORY',
      order: 1,
      title: 'Separation of Code and Configuration: os.environ, Precedence & Secrets',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn why production software externalizes configuration from application source code, mastering environment variable access, configuration precedence hierarchies, and safe secret handling.',
      whatItIs: 'Configuration encompasses all values that vary between deployment environments (development, staging, production) such as port numbers, timeout thresholds, log levels, and service URLs. Python provides access to OS-level environment variables via the standard library `os.environ` dictionary and `os.getenv(key, default)`.',
      whyItExists: 'Hardcoding environment values in source code forces code changes for every deployment, prevents running identical code across multiple environments, and risks committing sensitive credentials to public repositories.',
      problemSolved: 'Allows the same codebase to run securely and predictably across development and production environments by loading settings dynamically from the runtime environment.',
      mentalModel: 'The Configuration Pipeline & Precedence: Raw Sources -> Parse -> Normalize -> Validate -> Effective Configuration -> Application. Precedence Strategy: Explicit CLI arguments override Environment Variables; Environment Variables override Configuration Files; Configuration Files override Application Defaults. Note: This hierarchy is an architectural strategy chosen by the application, not an automatic Python runtime feature.',
      realWorldUse: 'Configuring web servers, background job processors, database connections, and operational CLI utilities without changing source code.',
      commonMistakes: [
        'Accessing `os.environ["OPTIONAL_VAR"]` directly without checking or using `os.getenv()`, causing unexpected `KeyError` crashes when the variable is unset.',
        'Committing `.env` files containing real secrets, database passwords, or API keys to version control.',
        'Dumping `os.environ` wholesale to console or log files, exposing sensitive host credentials.',
        'Treating values from `os.getenv()` as typed values; environment variables are ALWAYS strings and must be explicitly parsed and validated.',
      ],
      commonMisconceptions: [
        'Misconception: "A `.env` file is a built-in Python standard library feature." Reality: Python does NOT automatically read `.env` files. `.env` is a common ecosystem convention for storing local developer settings. In production, real environment variables are injected by the host or container runtime.',
        'Misconception: "Environment variables provide automatic cryptographic protection for secrets." Reality: Environment variables are plain strings accessible to any child process or process inspector. They must be validated, protected from log leakage, and handled defensively.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b10-d46-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building a Multi-Tier Configuration Loader with Validation',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating configuration loading with precedence (CLI > Env > Default), type normalization, and boundary validation.',
      language: 'python',
      codeSnippet: `import os
import sys

# Application default settings
APP_DEFAULTS = {
    "host": "127.0.0.1",
    "port": 8000,
    "log_level": "INFO",
    "timeout_sec": 30.0,
}

def load_effective_config(cli_overrides=None):
    """Loads and validates configuration following precedence: CLI > Env > Default."""
    overrides = cli_overrides or {}
    config = {}

    # 1. Host resolution
    config["host"] = overrides.get("host") or os.getenv("APP_HOST") or APP_DEFAULTS["host"]
    config["host"] = str(config["host"]).strip()

    # 2. Port resolution with type conversion and validation
    raw_port = overrides.get("port") or os.getenv("APP_PORT") or APP_DEFAULTS["port"]
    try:
        port = int(raw_port)
        if port < 1 or port > 65535:
            raise ValueError(f"Port {port} out of range [1, 65535]")
        config["port"] = port
    except (ValueError, TypeError) as err:
        raise ValueError(f"Invalid port configuration: {err}")

    # 3. Log level resolution
    raw_level = overrides.get("log_level") or os.getenv("APP_LOG_LEVEL") or APP_DEFAULTS["log_level"]
    level = str(raw_level).strip().upper()
    if level not in {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}:
        raise ValueError(f"Unsupported log level: {level}")
    config["log_level"] = level

    # 4. Timeout resolution
    raw_timeout = overrides.get("timeout_sec") or os.getenv("APP_TIMEOUT") or APP_DEFAULTS["timeout_sec"]
    try:
        timeout = float(raw_timeout)
        if timeout <= 0.0:
            raise ValueError("Timeout must be positive")
        config["timeout_sec"] = round(timeout, 1)
    except (ValueError, TypeError) as err:
        raise ValueError(f"Invalid timeout configuration: {err}")

    return config

# Demonstration
os.environ["APP_PORT"] = "9000"
os.environ["APP_LOG_LEVEL"] = "DEBUG"

# CLI override beats environment variable:
cli_args = {"port": 9500}
effective = load_effective_config(cli_args)
print("Effective Configuration:", effective)`,
      expectedOutput: `Effective Configuration: {'host': '127.0.0.1', 'port': 9500, 'log_level': 'DEBUG', 'timeout_sec': 30.0}`,
    } as ExampleBlock,
    {
      id: 'blk-b10-d46-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Refactoring Hardcoded Application Secrets to Environment Variables',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Review the provided script with hardcoded API keys and endpoints.',
        'Refactor the configuration loader to read `SERVICE_API_KEY` from `os.environ`.',
        'If `SERVICE_API_KEY` is missing or empty, raise a descriptive `RuntimeError`.',
        'Read `SERVICE_MAX_RETRIES` with default `3`, ensuring it parses to a non-negative integer.',
        'Never log or print the raw API key; output only a redacted preview `[KEY-SET]`.',
      ],
      starterCode: `import os

# Legacy defect: Hardcoded credentials
# API_KEY = "super-secret-prod-token-12345"
# RETRIES = 5

def get_service_config():
    api_key = os.getenv("SERVICE_API_KEY")
    if not api_key or not api_key.strip():
        raise RuntimeError("Missing required environment variable: SERVICE_API_KEY")

    raw_retries = os.getenv("SERVICE_MAX_RETRIES", "3")
    try:
        retries = int(raw_retries)
        if retries < 0:
            raise ValueError("Must be non-negative")
    except ValueError:
        raise ValueError(f"Invalid integer for SERVICE_MAX_RETRIES: '{raw_retries}'")

    return {
        "api_key": api_key.strip(),
        "max_retries": retries,
    }

# Test run with mock environment
os.environ["SERVICE_API_KEY"] = "mock-secret-key-xyz"
os.environ["SERVICE_MAX_RETRIES"] = "4"
cfg = get_service_config()
print(f"Config loaded: retries={cfg['max_retries']}, key={'[SET]' if cfg['api_key'] else '[EMPTY]'}")`,
      hints: [
        'Use `os.getenv("SERVICE_API_KEY")` and check if the result is empty or None.',
        'Cast strings to integers with a try/except block for defensive error handling.',
      ],
      expectedOutcome: 'Learner eliminates hardcoded configuration, enforces required environment keys, and prevents secret exposure.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b10-d46-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Configuration Precedence & Safety Check',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is it considered dangerous to execute `print(f"Current Environment: {os.environ}")` in an application startup routine?',
      options: [
        'Because printing dictionaries in Python 3.14 raises a DeprecationWarning.',
        'Because os.environ contains all host and process environment variables, which often include database passwords, cloud tokens, and system secrets that will be leaked to console logs.',
        'Because os.environ is an iterator that cannot be printed directly.',
        'Because environment variables can only be inspected using third-party packages.',
      ],
      correctIndex: 1,
      explanation: 'Dumping `os.environ` prints all environment variables on the machine, including AWS keys, database connection strings, and system paths. In production, logs are stored and viewed by multiple team members and telemetry systems, resulting in catastrophic secret leaks.',
      misconceptionIdentified: 'Believing environment variables only contain harmless application flags and are safe to dump wholesale.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b10-d46-05',
      type: 'REFERENCE',
      order: 5,
      title: '12-Factor App: Configuration & Environment Standards',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'The Twelve-Factor App: Config',
          url: 'https://12factor.net/config',
          description: 'Standard architectural guide on separating code from configuration using environment variables.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 47: APPLY — Basic Type Annotations + Dataclasses ───────────────────────
export const DAY_47_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w10-010',
  dayNumber: 2,
  title: 'Basic Type Annotations + Dataclasses',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b10-d47-01',
      type: 'THEORY',
      order: 1,
      title: 'Intent Communication & Data Modeling: Basic Annotations & @dataclass',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn basic Python type annotations and standard library dataclasses, understanding generated methods, default factories, immutability with frozen=True, and post-init validation.',
      whatItIs: 'Type annotations (`name: str`, `port: int`, `enabled: bool`) communicate intended data types to developers and tools. Python\'s standard library `@dataclass` decorator uses these annotations to generate boilerplate methods automatically (`__init__`, `__repr__`, `__eq__`).',
      whyItExists: 'Writing repetitive `__init__` constructors, assignments, string representations, and equality checks for pure data containers produces boilerplate and invites bugs.',
      problemSolved: 'Eliminates repetitive data class boilerplate, provides clean object representation, and enables immutable data structures with `frozen=True`.',
      mentalModel: 'Annotations Document Intent; Dataclasses Automate Structure: 1) Type annotations by themselves do NOT validate types at runtime; passing a string to an `int` field will not raise an error unless validated explicitly. 2) `@dataclass` inspects annotated attributes to synthesize `__init__(self, ...)`, `__repr__`, and `__eq__`. 3) `frozen=True` prevents direct assignment or deletion of attributes on the instance (`instance.x = 10` raises `FrozenInstanceError`); it does NOT make nested mutable containers (like lists) recursively immutable. 4) Use `field(default_factory=list)` for mutable defaults to prevent sharing mutable state across instances.',
      realWorldUse: 'Configuration modeling, API request/response transfer objects, telemetry records, and domain entity structures.',
      commonMistakes: [
        'Assuming type annotations automatically enforce runtime type checking (e.g. thinking `port: int` prevents someone from assigning a string).',
        'Using mutable default values directly in a dataclass like `tags: list = []`, which causes all instances to share the exact same list.',
        'Believing `frozen=True` provides deep recursive immutability; modifying an item inside a frozen dataclass\'s list attribute is still possible.',
      ],
      commonMisconceptions: [
        'Misconception: "Dataclasses are a third-party framework like Pydantic." Reality: `dataclasses` is part of the standard library since Python 3.7. Unlike Pydantic, standard library dataclasses focus on code generation and do not parse or coerce untrusted types automatically.',
        'Misconception: "Frozen dataclasses cannot perform validation." Reality: Dataclasses provide a `__post_init__` hook that executes immediately after `__init__`, allowing explicit boundary and range validation before the instance is returned.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b10-d47-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Modeling Immutable Configuration with @dataclass(frozen=True)',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating type-annotated dataclasses with default values, default_factory for lists, frozen immutability, and __post_init__ validation.',
      language: 'python',
      codeSnippet: `from dataclasses import dataclass, field
from typing import List

@dataclass(frozen=True)
class ServerConfig:
    host: str
    port: int = 8000
    debug_mode: bool = False
    timeout: float = 30.0
    allowed_origins: List[str] = field(default_factory=list)

    def __post_init__(self):
        # Validation hook: Enforce contracts during initialization
        if not self.host or not self.host.strip():
            raise ValueError("Host cannot be empty")
        if self.port < 1 or self.port > 65535:
            raise ValueError(f"Invalid port {self.port}; must be between 1 and 65535")
        if self.timeout <= 0.0:
            raise ValueError(f"Timeout must be positive, got {self.timeout}")

# Demonstration
config = ServerConfig(
    host="api.production.internal",
    port=443,
    debug_mode=False,
    allowed_origins=["https://dashboard.internal"]
)
print("Config Object:", config)

# Immutability verification:
try:
    config.port = 8080 # Attempting to mutate a frozen dataclass instance
except Exception as err:
    print("Mutation Prevented:", type(err).__name__)`,
      expectedOutput: `Config Object: ServerConfig(host='api.production.internal', port=443, debug_mode=False, timeout=30.0, allowed_origins=['https://dashboard.internal'])
Mutation Prevented: FrozenInstanceError`,
    } as ExampleBlock,
    {
      id: 'blk-b10-d47-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Building a Type-Modeled Operational Telemetry Dataclass',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Create an immutable dataclass `ServiceMetrics` with typed fields, default factory for tags, and post-init range checks.',
      instructions: [
        'Define `@dataclass(frozen=True) class ServiceMetrics`.',
        'Declare annotated fields: `service_name: str`, `request_count: int = 0`, `error_count: int = 0`, `latency_ms: float = 0.0`, `tags: list = field(default_factory=list)`.',
        'In `__post_init__`, verify `request_count >= 0`, `error_count >= 0`, and `latency_ms >= 0.0`.',
        'Add a method `error_rate(self)` that returns `error_count / request_count` (or 0.0 if request_count is 0).',
      ],
      starterFiles: {
        'metrics.py': `from dataclasses import dataclass, field

@dataclass(frozen=True)
class ServiceMetrics:
    # TODO: Define type-annotated fields with defaults
    pass`,
      },
      expectedBehavior: 'Class synthesizes __init__, blocks attribute mutation, enforces non-negative numbers in __post_init__, and computes error rate.',
    } as GuidedLabBlock,
    {
      id: 'blk-b10-d47-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Safe Factory vs Shared Mutable Defaults',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Explain and demonstrate why `field(default_factory=list)` must be used instead of `tags: list = []` in a dataclass.',
      starterCode: `from dataclasses import dataclass, field

# TODO: Define a dataclass that correctly isolates mutable list fields per instance
@dataclass
class JobQueue:
    queue_name: str
    pending_tasks: list = field(default_factory=list)

# Verify isolation
q1 = JobQueue("high-priority")
q2 = JobQueue("low-priority")
q1.pending_tasks.append("task-101")
assert len(q2.pending_tasks) == 0, "q2 shared mutable state with q1!"
print("Isolation verified: q1 has", q1.pending_tasks, "and q2 has", q2.pending_tasks)`,
      hints: [
        'Default arguments in Python functions and dataclass fields evaluate once at definition time.',
        '`default_factory` invokes the callable (e.g. `list`) fresh for each new instance.',
      ],
      verificationRequirements: [
        'Uses `field(default_factory=list)`.',
        'Demonstrates that modifying instance A does not affect instance B.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b10-d47-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Python 3.14 Standard Library: dataclasses Specification',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python dataclasses Documentation',
          url: 'https://docs.python.org/3/library/dataclasses.html',
          description: 'Official Python standard library documentation on dataclasses, fields, frozen instances, and post-init hooks.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 48: BUILD — pyproject.toml + Build + Install + CLI Entry Points ────────
export const DAY_48_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w10-010',
  dayNumber: 3,
  title: 'pyproject.toml + Build + Install + CLI Entry Points',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b10-d48-01',
      type: 'THEORY',
      order: 1,
      title: 'Modern Python Packaging: pyproject.toml, Build Backends & [project.scripts]',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn the modern PyPA packaging standard, understanding pyproject.toml tables, build backends vs frontends, sdist vs wheel artifacts, and installed [project.scripts] console entry points.',
      whatItIs: 'Modern Python packaging is defined by the PyPA `pyproject.toml` specification. It declares `[build-system]` specifying a standard build backend (our primary hands-on backend is `setuptools.build_meta`), `[project]` (package name, version, dependencies), and `[project.scripts]` (defining installed command-line entry points). Other backends like `flit_core` or `hatchling` exist in the ecosystem with similar interfaces.',
      whyItExists: 'Legacy `setup.py` scripts executed arbitrary Python code during installation, lacked standardized build declarations, and caused fragile dependency resolution. `pyproject.toml` provides a declarative, secure standard.',
      problemSolved: 'Transforms a local Python script into an installable distribution package with automated CLI command wrapper installation.',
      mentalModel: 'Source -> Build Backend -> Wheel -> Installed Binary: 1) A build frontend (e.g. `python -m build`) reads `pyproject.toml` and invokes the build backend. 2) The backend packages source files into distribution artifacts: a Source Distribution (`.tar.gz`) and a built Wheel (`.whl`). 3) When installed via `pip install`, the package files are copied into the virtual environment\'s `site-packages`. 4) For `[project.scripts]`, the installer writes an executable command wrapper into the environment\'s `bin/` (or `Scripts/` on Windows) that invokes your callable without arguments. The returned integer becomes the process exit status.',
      realWorldUse: 'Distributing open-source Python packages, building enterprise microservice CLI tools, and packaging internal utilities.',
      commonMistakes: [
        'Believing `pyproject.toml` itself is the build engine; it is a declarative configuration file read by build frontends and backends.',
        'Targeting a non-callable or missing function in `[project.scripts]` (e.g. `tool = "pkg.cli"` instead of `tool = "pkg.cli:main"`).',
        'Confusing source tree execution with installed package execution; a tool working locally in its repository folder can still fail when installed if files are missing from the package.',
      ],
      commonMisconceptions: [
        'Misconception: "Console scripts are a special Python language syntax." Reality: `[project.scripts]` is packaging distribution metadata. The installer creates an OS executable wrapper that imports your module and executes your function.',
        'Misconception: "You need complex legacy setup.cfg or setup.py files." Reality: Modern PyPA standards declare everything inside `pyproject.toml`.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b10-d48-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Standard pyproject.toml Configuration & Package Structure',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating a clean modern pyproject.toml with metadata, dependencies, and [project.scripts] entry point.',
      language: 'python',
      codeSnippet: `# Modern Package Layout:
# my_audit_pkg/
# ├── pyproject.toml
# └── src/
#     └── my_audit_pkg/
#         ├── __init__.py
#         └── cli.py

# --- pyproject.toml content ---
PYPROJECT_TOML_CONTENT = """
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "my-audit-pkg"
version = "0.1.0"
description = "Operational health audit and telemetry CLI utility"
readme = "README.md"
requires-python = ">=3.10"
authors = [
    { name = "PinIT Student", email = "student@pinit.internal" }
]
dependencies = []

[project.scripts]
audit-tool = "my_audit_pkg.cli:main"
"""

# --- src/my_audit_pkg/cli.py content ---
CLI_PY_CONTENT = """
import sys
import argparse

def main():
    parser = argparse.ArgumentParser(prog="audit-tool")
    parser.add_argument("--service", default="core-api", help="Target service name")
    args = parser.parse_args()
    print(f"Operational Audit running for: {args.service}")
    return 0 # Returned integer becomes shell exit code

if __name__ == "__main__":
    sys.exit(main())
"""

print("Declared pyproject.toml:")
print(PYPROJECT_TOML_CONTENT.strip())`,
      expectedOutput: `Declared pyproject.toml:
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "my-audit-pkg"
version = "0.1.0"
description = "Operational health audit and telemetry CLI utility"
readme = "README.md"
requires-python = ">=3.10"
authors = [
    { name = "PinIT Student", email = "student@pinit.internal" }
]
dependencies = []

[project.scripts]
audit-tool = "my_audit_pkg.cli:main"`,
    } as ExampleBlock,
    {
      id: 'blk-b10-d48-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Building, Installing and Running an Entry-Point CLI',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a valid Python package distribution, verify wheel creation, and inspect entry-point command wrapper behavior.',
      instructions: [
        'Construct a `pyproject.toml` declaring `[build-system]` and `[project]`.',
        'Configure `[project.scripts]` mapping command `system-health` to `health_pkg.entrypoint:run`.',
        'Implement `health_pkg/entrypoint.py` with `run()` returning `0` on healthy status and `1` on error.',
        'Simulate package installation and verify the entry-point callable contract.',
      ],
      starterFiles: {
        'pyproject.toml': `[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "system-health-pkg"
version = "1.0.0"
description = "System Health Diagnostics"
dependencies = []

[project.scripts]
# TODO: Define CLI entry point
`,
        'src/health_pkg/entrypoint.py': `import sys

def run():
    # TODO: Implement entry point returning integer exit status
    print("Health Status: OK")
    return 0
`,
      },
      expectedBehavior: 'Package defines valid TOML metadata, maps entry point to callable without args, and verifies returned integer exit status.',
    } as GuidedLabBlock,
    {
      id: 'blk-b10-d48-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Source Tree Execution vs Installed Packages',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why does running `python mypkg/cli.py` inside your local repository give a false sense of security about whether your package is installable? What failure modes occur only after `pip install` in a clean environment?',
      guidingQuestions: [
        'What role does the current working directory play in Python\'s import search path (`sys.path`)?',
        'What happens if an external dependency is missing from `pyproject.toml` dependencies, but happened to be installed in your local development environment?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 49: DEBUG / DEEPEN — Packaging & Environment Diagnostics ──────────────
export const DAY_49_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w10-010',
  dayNumber: 4,
  title: 'Packaging / Environment / Installation Debugging',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b10-d49-01',
      type: 'THEORY',
      order: 1,
      title: 'Packaging Diagnostics: Systematic Troubleshooting of Distribution Failures',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the diagnostic loop for packaging and installation failures: OBSERVE -> REPRODUCE -> INSPECT ENVIRONMENT -> INSPECT METADATA -> ROOT CAUSE -> FIX -> REINSTALL -> VERIFY -> EXPLAIN.',
      whatItIs: 'Packaging diagnostics isolates failures that occur when turning code into distributions: command not found, wrong virtual environment active, broken entry-point targets, missing runtime dependencies, and stale installed versions.',
      whyItExists: 'Developers frequently face the "it works on my machine" bug when code runs from source checkouts but fails for users after installation.',
      problemSolved: 'Diagnoses missing file declarations, invalid entry point specifications, and virtual environment path desynchronization.',
      mentalModel: 'Source Success != Installed Success: Always inspect the installed environment. Verify which python is running (`which python` / `where python`), check `sys.path`, and inspect `pyproject.toml` metadata before guessing.',
      commonMistakes: [
        'Testing only in the repository source directory, where local files shadow installed packages.',
        'Targeting an invalid module or function in `[project.scripts]` (e.g. `cli:run()` with parentheses instead of `cli:run`).',
        'Installing a package into Environment A while running a terminal with Environment B active.',
      ],
      commonMisconceptions: [
        'Misconception: "If I modify Python files in my source tree, the installed CLI command updates automatically." Reality: A regular `pip install .` copies files into `site-packages`. Edits in the source folder do not reflect in the installed command until reinstalled.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b10-d49-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The Broken [project.scripts] Entry Point',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'After installing the package, running the CLI command `data-audit` declared in [project.scripts] fails with: `ImportError: cannot import name "start" from "audit_pkg.cli"`.',
      symptom: 'Command crashes upon invocation with AttributeError or ImportError.',
      brokenArtifact: `# pyproject.toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "audit-pkg"
version = "0.1.0"
dependencies = []

[project.scripts]
# DEFECT: Target specifies function "start", but the module actually defines "main"!
data-audit = "audit_pkg.cli:start"

# src/audit_pkg/cli.py
def main():
    print("Audit running...")
    return 0`,
      expectedBehavior: 'Correct the entry-point specification in `pyproject.toml` to point to the actual callable: `data-audit = "audit_pkg.cli:main"`.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Inspect `src/audit_pkg/cli.py`. What function names are actually defined in the module?',
        'Hint 2: Entry point syntax is `module_path:callable_name`. Ensure `callable_name` matches an exported function.',
      ],
      targetCompetencyId: COMPETENCY_ID_PACKAGING_CONFIGURATION,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b10-d49-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: The Source-Tree Dependency Masking',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'An application runs fine when tested from the source-tree repository root, but crashes with `ModuleNotFoundError: No module named "audit_pkg.helpers"` when installed into a clean virtual environment.',
      symptom: 'Submodule missing in installed distribution wheel.',
      brokenArtifact: `# Project layout:
# repo/
# ├── pyproject.toml
# ├── helpers.py  <-- DEFECT: Placed outside the package directory!
# └── src/
#     └── audit_pkg/
#         ├── __init__.py
#         └── cli.py  <-- Does: from helpers import format_report

# When running in repo/, Python finds helpers.py in current working directory.
# When built and installed, helpers.py is NOT packaged, causing ModuleNotFoundError!`,
      expectedBehavior: 'Move `helpers.py` inside `src/audit_pkg/helpers.py` so build backends include it in the distribution artifact.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Check where `helpers.py` is located relative to `src/audit_pkg/`.',
        'Hint 2: Build backends only package files inside the declared package directory.',
      ],
      targetCompetencyId: COMPETENCY_ID_PACKAGING_CONFIGURATION,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b10-d49-04',
      type: 'DEBUGGING_CHALLENGE',
      order: 4,
      title: 'Debugging Challenge 3: Environment Desynchronization & Stale Installation',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'Due to environment desynchronization and stale installation, a developer fixed a bug in their package code, but running the CLI tool still prints the old buggy output.',
      symptom: 'Code changes do not take effect when invoking the installed command wrapper.',
      brokenArtifact: `# Diagnostic sequence:
# 1. Developer edited src/app/cli.py
# 2. Developer ran: audit-tool
# 3. Output: "v1.0 (buggy)"
# DEFECT: Developer forgot to reinstall the package into the virtual environment!
# The installed command wrapper in site-packages still executes the OLD compiled files.`,
      expectedBehavior: 'Reinstall the updated distribution (`pip install .` or rebuild and install the new wheel) so the virtual environment updates its site-packages.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Where does the installed command wrapper load code from? The repository folder, or site-packages?',
        'Hint 2: Standard installations copy files. Changes in source do not automatically update site-packages without reinstallation.',
      ],
      targetCompetencyId: COMPETENCY_ID_PACKAGING_CONFIGURATION,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 50: TRANSFER + FORMATIVE ASSESSMENT — Distributable Python Application ─
export const DAY_50_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w10-010',
  dayNumber: 5,
  title: 'Distributable Python Application',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b10-d50-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Distributable Python Application',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Enterprise Application Packaging & Configuration Architecture: A team needs an operational system monitoring tool packaged as an installable Python distribution. The tool must parse multi-tier configuration, model settings with type-annotated dataclasses, validate input boundaries, and expose a clean CLI entry point defined via pyproject.toml metadata. The evaluation accepts multiple valid software and packaging designs.',
      task: `Design and implement an installable, configurable operational monitor:
\`package_and_run_application(pyproject_content, env_dict, cli_args, test_payload)\`

PACKAGE & ARCHITECTURE REQUIREMENTS:
1. Configuration & Dataclass Modeling:
   - Configuration must load with precedence: \`cli_args\` > \`env_dict\` > default values.
   - Core settings modeled via a typed \`@dataclass(frozen=True)\`:
     - \`service_name: str\` (required, non-empty)
     - \`port: int\` (range 1-65535, default 8080)
     - \`alert_threshold: float\` (range 0.0 - 100.0, default 80.0)
     - \`tags: list\` (list of string tags, default empty via default_factory)
   - Perform boundary validation; reject invalid port or threshold values.
   - Secret safety: Never log or return unredacted tokens/secrets.

2. Packaging Metadata (\`pyproject.toml\`):
   - Valid TOML configuration declaring:
     - \`[build-system]\` with \`requires\` and \`build-backend\`
     - \`[project]\` with \`name\`, \`version\`, and \`dependencies\`
     - \`[project.scripts]\` defining a console command mapping to a callable entry point (e.g. \`cmd = "pkg.cli:main"\`)

3. Entry-Point Execution:
   - When invoked, the entry-point callable processes \`test_payload\`, applies configuration, and returns a structured operational status dictionary:
     \`{"status": "OK" | "ALERT" | "CONFIG_ERROR", "service": str, "port": int, "exit_code": int}\`
   - Exit code must be 0 on \`"OK"\`, 1 on \`"ALERT"\`, and 2 on \`"CONFIG_ERROR"\`.

CONSTRAINTS & AUTOGRADER FLEXIBILITY:
- Autograder is non-prescriptive and accepts multiple valid package directory structures (e.g. \`src/\` layout or flat package layout).
- No rigid class or function names are mandated.
- Evaluates configuration precedence, dataclass immutability, pyproject metadata validity, and exit code accuracy.`,
      constraints: [
        'Enforce configuration precedence and dataclass immutability.',
        'Declare valid pyproject.toml with modern [project.scripts].',
        'Zero global mutable state; all state passes via arguments and return value.',
        'Autograder accepts multiple valid software and package designs.',
      ],
      difficulty: 'INTERMEDIATE',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_PACKAGING_CONFIGURATION,
      assessmentRef: 'asm-pfs-m3-w10-pkg-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 50 INDEPENDENT FORMATIVE ASSESSMENT ──────────────────────────────────
export const DAY_50_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m3-w10-pkg-001',
  assessmentCode: 'ASM-PFS-M3-W10-PKG',
  title: 'Distributable Python Application Formative Assessment',
  description: 'Independent formative practice assessment evaluating configuration loading, dataclass modeling, pyproject.toml packaging metadata, and CLI entry point execution in the sandbox. (Client-accessible formative test fixtures; not certification-grade).',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'INTERMEDIATE',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_PACKAGING_CONFIGURATION,
  items: [
    {
      id: 'item-pkg-01',
      assessmentId: 'asm-pfs-m3-w10-pkg-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Implement \`package_and_run_application(pyproject_content, env_dict, cli_args, test_payload)\` that validates pyproject metadata, resolves configuration precedence, models data with a typed frozen dataclass, and executes the CLI entry point returning the execution summary dictionary. Multiple valid architectures are accepted.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-pkg-01',
          name: 'Standard Configuration Precedence & Healthy Application Run',
          input: JSON.stringify({
            pyproject_content: `
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "monitor-pkg"
version = "0.1.0"
dependencies = []

[project.scripts]
monitor = "monitor_pkg.cli:main"
`,
            env_dict: { APP_PORT: '9000', APP_SERVICE: 'auth-gateway' },
            cli_args: { port: 9500 }, // CLI override beats Env
            test_payload: { cpu_usage: 45.0 },
          }),
          expectedOutput: JSON.stringify({
            status: 'OK',
            service: 'auth-gateway',
            port: 9500,
            exit_code: 0,
          }),
          tier: 'VISIBLE',
        },
        {
          id: 'vt-pkg-02',
          name: 'Alert Status When Threshold Exceeded',
          input: JSON.stringify({
            pyproject_content: `
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "monitor-pkg"
version = "0.1.0"
dependencies = []

[project.scripts]
monitor = "monitor_pkg.cli:main"
`,
            env_dict: { APP_SERVICE: 'billing-worker' },
            cli_args: { alert_threshold: 50.0 },
            test_payload: { cpu_usage: 85.0 }, // Exceeds 50.0 -> ALERT
          }),
          expectedOutput: JSON.stringify({
            status: 'ALERT',
            service: 'billing-worker',
            port: 8080,
            exit_code: 1,
          }),
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-pkg-01',
          name: 'Configuration Boundary Rejection on Invalid Port',
          input: JSON.stringify({
            pyproject_content: `
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "monitor-pkg"
version = "0.1.0"

[project.scripts]
monitor = "monitor_pkg.cli:main"
`,
            env_dict: { APP_PORT: '999999' }, // Out of range [1, 65535]
            cli_args: {},
            test_payload: { cpu_usage: 10.0 },
          }),
          expectedOutput: JSON.stringify({
            status: 'CONFIG_ERROR',
            service: 'UNKNOWN',
            port: 0,
            exit_code: 2,
          }),
          tier: 'PRIVATE',
        },
        {
          id: 'pt-pkg-02',
          name: 'Invalid pyproject.toml Missing [project.scripts]',
          input: JSON.stringify({
            pyproject_content: `
[project]
name = "broken-pkg"
version = "0.1.0"
`,
            env_dict: {},
            cli_args: {},
            test_payload: {},
          }),
          expectedOutput: JSON.stringify({
            status: 'CONFIG_ERROR',
            service: 'UNKNOWN',
            port: 0,
            exit_code: 2,
          }),
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-pkg-01',
          name: 'Anti-Hardcoding Dynamic Configuration Evaluation Probe',
          input: '{"probe_vector": "DYNAMIC_PACKAGING_PROBE"}',
          expectedOutput: '{"dynamically_computed": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-pkg-01', name: 'FunctionalCorrectness', description: 'Correctly parses input, resolves configuration precedence, and computes exit codes.', weight: 0.25, maxPoints: 25 },
        { id: 'rub-pkg-02', name: 'PackagingInstallation', description: 'Validates pyproject.toml tables, build backend, and [project.scripts] mapping.', weight: 0.25, maxPoints: 25 },
        { id: 'rub-pkg-03', name: 'ConfigurationManagement', description: 'Loads settings from CLI and environment with proper fallback hierarchy.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-pkg-04', name: 'CLIEntryPoint', description: 'Implements entry-point execution returning integer exit codes.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-pkg-05', name: 'DebuggingEnvironmentReasoning', description: 'Defensively handles invalid configuration and malformed metadata.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-pkg-06', name: 'CodeQualityMaintainability', description: 'Uses typed frozen dataclasses and clean modular function separation.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-pkg-07', name: 'SecuritySecretHandling', description: 'Safely handles credentials without leaking sensitive keys.', weight: 0.05, maxPoints: 5 },
      ],
    },
  ],
  createdAt: '2026-09-03T00:00:00.000Z',
  updatedAt: '2026-09-03T00:00:00.000Z',
};

// ── BATCH 010 COMPLETE MANIFEST (DAYS 46–50) ─────────────────────────────────
export const BATCH_010_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m3-w10-010',
  batchCode: 'P1-M3-W10-BATCH010',
  title: 'Configuration, Type-Modeled Data & Modern Python Packaging (Days 46–50)',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_46_MANIFEST,
    DAY_47_MANIFEST,
    DAY_48_MANIFEST,
    DAY_49_MANIFEST,
    DAY_50_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-03T00:00:00.000Z',
  updatedAt: '2026-09-03T00:00:00.000Z',
};
