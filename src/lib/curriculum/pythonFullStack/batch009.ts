// src/lib/curriculum/pythonFullStack/batch009.ts
// Single Source of Truth for PINIT BATCH 009: Month 3 · Week 9 · Days 41–45
// Logging, Defensive Validation & Professional CLI Engineering
// Pedagogical Flow: UNDERSTAND (Logging & Observability) -> APPLY (Defensive Validation) -> BUILD (argparse & Entry Points) -> DEBUG (Production Diagnostics) -> TRANSFER (Production CLI Audit & Telemetry Tool)

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

export const COMPETENCY_ID_LOGGING_CLI_ENGINEERING = 'comp-pfs-m3-009';

// ── DAY 41: UNDERSTAND — Logging & Observability Foundations ──────────────────
export const DAY_41_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w9-009',
  dayNumber: 1,
  title: 'Logging & Observability Foundations',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b9-d41-01',
      type: 'THEORY',
      order: 1,
      title: 'From print() to Operational Logging: Levels, Handlers & Formatters',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn why production software replaces print() with the standard library logging module, understanding LogRecord objects, severity levels, handlers, formatters, and clean exception capture.',
      whatItIs: 'Python\'s standard `logging` module provides a flexible framework for generating diagnostic messages. It defines Loggers (`logging.getLogger(__name__)`), standard severity levels (DEBUG, INFO, WARNING, ERROR, CRITICAL), Handlers (directing output to console, files, or streams), Formatters (specifying message layout and metadata), and Filters.',
      whyItExists: 'Using `print()` for diagnostics scatters unstructured text to stdout, cannot be toggled by severity in production, loses timestamps and module context, and cannot easily route errors to dedicated files while keeping console output clean.',
      problemSolved: 'Enables operators to dynamically adjust verbosity, capture tracebacks with context, and route operational telemetry without modifying application source code.',
      mentalModel: 'Flight Telemetry vs Casual Shouting: `print()` is a developer shouting in the room during development; `logging` is the aircraft\'s flight data recorder. Each log record carries a timestamp, severity, logger name, and message. Handlers should be configured deliberately at the application boundary (the entry point), while internal module loggers emit events and rely on hierarchical propagation upward to ancestor handlers.',
      realWorldUse: 'Observing web services, tracing database query latencies, diagnosing failed payment transactions, and recording operational audit events.',
      commonMistakes: [
        'Scattering `print()` statements across library code instead of using `logging.getLogger(__name__)`.',
        'Marking every log message as `INFO`, eliminating the ability to filter by severity.',
        'Using string formatting inside exception blocks like `logger.error(f"Failed: {err}")` instead of `logger.exception("Failed")`, which discards the underlying traceback.',
        'Adding handlers inside library functions or using `if not logger.handlers:` as a false safeguard; child loggers still propagate to ancestor handlers, causing duplicate logs.',
      ],
      commonMisconceptions: [
        'Misconception: "Python standard logging natively outputs JSON structured logs in one line." Reality: Standard library logging formats plain text strings by default. Structured log output (recording consistent key=value or JSON-formatted strings) is achieved by configuring a custom Formatter that serializes LogRecord attributes.',
        'Misconception: "You should never, ever use print() in Python." Reality: `print()` is completely appropriate for interactive CLI output meant directly for the end-user (e.g. user prompts, table displays). `logging` is meant for operational diagnostics and audit trails.',
        'Misconception: "`if not logger.handlers:` guarantees logs will never duplicate." Reality: It only checks handlers attached directly to that logger instance; it does NOT check whether ancestor loggers will also process the record via hierarchical propagation.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b9-d41-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Configuring Loggers, Handlers & Capturing Exceptions',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating deliberate application boundary logging configuration, hierarchical propagation, and logger.exception() traceback preservation.',
      language: 'python',
      codeSnippet: `import logging
import sys

# 1. Preferred Application Boundary Pattern:
# Handlers are configured deliberately at the application entry point.
# Loggers use hierarchical propagation intentionally.
app_logger = logging.getLogger("service")
app_logger.setLevel(logging.DEBUG)

# Attach handler once at top-level logger (application boundary)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
console_formatter = logging.Formatter(
    "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
console_handler.setFormatter(console_formatter)
app_logger.addHandler(console_handler)

# 2. Internal module logger inherits handler via propagation:
logger = logging.getLogger("service.audit")

# 3. Emitting operational logs with appropriate severity
def execute_security_scan(target_host, port):
    logger.debug(f"Initiating network probe on {target_host}:{port}")
    if port < 1 or port > 65535:
        logger.error(f"Invalid port specified: {port}")
        return False

    logger.info(f"Scan dispatched for target {target_host} on port {port}")
    try:
        # Simulate an unexpected operational failure
        if target_host == "malformed.local":
            raise ConnectionResetError("Remote host forcibly dropped connection probe")
        return True
    except ConnectionResetError as err:
        # logger.exception automatically attaches the full traceback to the ERROR log!
        logger.exception(f"Network failure while probing target {target_host}: {err}")
        return False

# Demonstration
execute_security_scan("prod-api.internal", 443)
execute_security_scan("malformed.local", 8080)`,
      expectedOutput: `[2026-09-03 15:00:00] [INFO] [service.audit] Scan dispatched for target prod-api.internal on port 443
[2026-09-03 15:00:00] [INFO] [service.audit] Scan dispatched for target malformed.local on port 8080
[2026-09-03 15:00:00] [ERROR] [service.audit] Network failure while probing target malformed.local: Remote host forcibly dropped connection probe
Traceback (most recent call last):
  ...
ConnectionResetError: Remote host forcibly dropped connection probe`,
    } as ExampleBlock,
    {
      id: 'blk-b9-d41-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Refactoring Unstructured print() to Multi-Level Logging',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Review the provided legacy script that relies on scattered `print()` statements.',
        'Configure the application-level logger `app` with `DEBUG` level and a `StreamHandler`.',
        'Acquire child logger `app.ingestion` that relies on propagation to the top-level handler.',
        'Replace debugging `print()` statements with `logger.debug()`.',
        'Replace lifecycle milestones with `logger.info()`.',
        'Replace unexpected failures inside exception blocks with `logger.exception()`.',
      ],
      starterCode: `import logging
import sys

# Preferred pattern: Configure handlers at the application boundary
def configure_application_logging():
    app_logger = logging.getLogger("app")
    app_logger.setLevel(logging.DEBUG)
    if not app_logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        fmt = logging.Formatter("[%(levelname)s] [%(name)s] %(message)s")
        handler.setFormatter(fmt)
        app_logger.addHandler(handler)
    return app_logger

# Module code acquires its own logger and relies on propagation
def process_batch(records, logger=None):
    log = logger or logging.getLogger("app.ingestion")
    log.debug(f"Starting batch processing of {len(records)} records")
    successful = 0
    for r in records:
        rec_id = r.get("id")
        if not rec_id:
            log.warning("Skipping record with missing required 'id' field")
            continue
        try:
            val = float(r.get("value", 0.0))
            if val < 0.0:
                log.error(f"Record {rec_id} has negative value {val}; rejecting")
                continue
            successful += 1
            log.info(f"Successfully processed record {rec_id} with value {val:.2f}")
        except (ValueError, TypeError):
            log.exception(f"Unexpected data corruption encountered on record {rec_id}")
    return successful

# Test run
configure_application_logging()
sample_data = [
    {"id": "REC-01", "value": "15.50"},
    {"value": "20.00"},  # Missing ID
    {"id": "REC-02", "value": "-5.00"},  # Negative
    {"id": "REC-03", "value": "corrupt_data"},  # Exception
]
count = process_batch(sample_data)
print(f"Total processed: {count}")`,
      hints: [
        'Use `log.warning` for expected recoverable rejections.',
        'Use `log.exception` when an exception is caught to preserve stack trace.',
      ],
      expectedOutcome: 'Learner chooses accurate logging levels and replaces print statements with structured operational logger calls.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b9-d41-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic Check: Severity Selection & Traceback Preservation',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'When handling an unexpected runtime exception in a production service, why is `logger.exception("Operation failed")` strongly preferred over `logger.error(f"Operation failed: {err}")`?',
      options: [
        'Because logger.exception() automatically suppresses the error so the program continues running.',
        'Because logger.exception() automatically inspects sys.exc_info() and appends the full traceback to the ERROR log, while string formatting only logs the brief exception message.',
        'Because logger.error() cannot accept strings in Python 3.14.',
        'Because logger.exception() sends an immediate email alert to system administrators.',
      ],
      correctIndex: 1,
      explanation: '`logger.exception()` sets `exc_info=True`, capturing the full traceback and execution frame context. Logging only `{err}` loses the file name, line number, and call stack, making root-cause diagnostics significantly more difficult.',
      misconceptionIdentified: 'Believing logging an exception message string is equivalent to preserving full traceback telemetry.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b9-d41-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Python 3.14 Documentation: Logging HOWTO & Library Architecture',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Logging HOWTO',
          url: 'https://docs.python.org/3/howto/logging.html',
          description: 'Official Python guide on loggers, handlers, formatters, and basic logging configuration.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 42: APPLY — Defensive Validation & Input Boundaries ───────────────────
export const DAY_42_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w9-009',
  dayNumber: 2,
  title: 'Defensive Validation & Input Boundaries',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b9-d42-01',
      type: 'THEORY',
      order: 1,
      title: 'Input Boundaries: Validation vs Normalization vs Sanitization',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master defensive data boundaries by understanding the distinct roles of validation, normalization, and sanitization, enforcing contracts early, and rejecting untrusted input explicitly.',
      whatItIs: 'Defensive validation is the engineering practice of establishing strict trust boundaries around an application. It treats all external inputs (CLI flags, files, JSON payloads, network requests) as untrusted until verified against explicit contracts.',
      whyItExists: 'Assuming input is well-formed leads to runtime crashes (`KeyError`, `ValueError`, `TypeError`), corrupted state, and cascading bugs deep inside core domain logic.',
      problemSolved: 'Stops malformed data at the perimeter, prevents state pollution, and provides clear, actionable failure messages.',
      mentalModel: 'Validation vs Normalization vs Sanitization: 1) VALIDATION asks: "Does this input satisfy our contract?" (e.g. is port between 1 and 65535?). If no, reject immediately. 2) NORMALIZATION transforms acceptable variants into a canonical representation (e.g. `strip()`, `upper()`, parsing string `"50"` to int `50`). 3) SANITIZATION removes or escapes unwanted elements for a specific context (e.g. stripping control characters). Principle: Never rely on blind sanitization to "fix" fundamentally invalid input; VALIDATE, REJECT invalid data, and ONLY ACCEPT data that meets the contract.',
      realWorldUse: 'Perimeter guards for financial transactions, configuration loaders, CLI argument processing, and data ingestion pipelines.',
      commonMistakes: [
        'Attempting to "sanitize" invalid data into valid data automatically instead of rejecting it with an informative error.',
        'Performing validation deep inside business logic instead of at the input boundary.',
        'Validating types but forgetting range or format boundaries (e.g., accepting negative balances or empty string IDs).',
      ],
      commonMisconceptions: [
        'Misconception: "Sanitization makes any input completely safe." Reality: Sanitization is context-dependent. A string sanitized for a terminal might still be dangerous in a file path. Rejection of non-compliant data at the boundary is the primary security defense.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b9-d42-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building a Deterministic Validation & Normalization Pipeline',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating the pipeline: Raw Input -> Normalize -> Validate Rules (Type, Range, Required) -> Accept/Reject.',
      language: 'python',
      codeSnippet: `class ValidationError(ValueError):
    """Raised when an external input violates domain boundary rules."""
    def __init__(self, field_name, reason):
        self.field_name = field_name
        self.reason = reason
        super().__init__(f"Validation failed for '{field_name}': {reason}")


def validate_service_request(raw_payload):
    # 1. Structural check: Must be a dictionary
    if not isinstance(raw_payload, dict):
        raise ValidationError("payload", "Request payload must be a dictionary")

    # 2. Required field check
    required_keys = ["service_name", "max_retries", "timeout_seconds"]
    for key in required_keys:
        if key not in raw_payload:
            raise ValidationError(key, f"Missing mandatory field '{key}'")

    # 3. Normalization: Clean string identifiers
    service_name = str(raw_payload["service_name"]).strip()
    if not service_name or len(service_name) < 3:
        raise ValidationError("service_name", "Must be a non-empty string of at least 3 characters")

    # 4. Type & Range Validation: max_retries
    try:
        retries = int(raw_payload["max_retries"])
    except (ValueError, TypeError):
        raise ValidationError("max_retries", "Must be an integer")

    if retries < 0 or retries > 10:
        raise ValidationError("max_retries", f"Value {retries} out of allowable range [0, 10]")

    # 5. Type & Range Validation: timeout_seconds
    try:
        timeout = float(raw_payload["timeout_seconds"])
    except (ValueError, TypeError):
        raise ValidationError("timeout_seconds", "Must be a numeric float")

    if timeout <= 0.0 or timeout > 300.0:
        raise ValidationError("timeout_seconds", f"Value {timeout} out of allowable range (0.0, 300.0]")

    # 6. Accepted & Normalized Contract
    return {
        "service_name": service_name,
        "max_retries": retries,
        "timeout_seconds": round(timeout, 2),
    }


# Demonstration
valid_input = {"service_name": "  auth_gateway  ", "max_retries": "3", "timeout_seconds": 30.5}
print("Normalized Output:", validate_service_request(valid_input))

try:
    validate_service_request({"service_name": "api", "max_retries": 100, "timeout_seconds": 10})
except ValidationError as err:
    print(f"Rejected: Field='{err.field_name}', Reason='{err.reason}'")`,
      expectedOutput: `Normalized Output: {'service_name': 'auth_gateway', 'max_retries': 3, 'timeout_seconds': 30.5}
Rejected: Field='max_retries', Reason='Value 100 out of allowable range [0, 10]'`,
    } as ExampleBlock,
    {
      id: 'blk-b9-d42-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Pipeline Quality & Audit Record Ingestion Validator',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Construct an input validation pipeline that validates operational audit records, collecting validation errors or returning normalized data.',
      instructions: [
        'Define `AuditRecordValidationError(Exception)` with `field` and `details`.',
        'Implement `normalize_and_validate_record(record_dict)`.',
        'Verify `timestamp_iso` matches format length and is non-empty.',
        'Verify `severity` is one of `{"INFO", "WARNING", "ERROR", "CRITICAL"}`.',
        'Verify `metric_value` is float between `-1000.0` and `1000.0`.',
      ],
      starterFiles: {
        'validator.py': `class AuditRecordValidationError(Exception):
    def __init__(self, field, details):
        self.field = field
        self.details = details
        super().__init__(f"Validation error on '{field}': {details}")

ALLOWED_SEVERITIES = {"INFO", "WARNING", "ERROR", "CRITICAL"}

def normalize_and_validate_record(record):
    if not isinstance(record, dict):
        raise AuditRecordValidationError("record", "Must be a dictionary")

    # TODO: Validate and normalize record fields
    # Return normalized dictionary: {"event_id", "severity", "metric_value"}
    pass`,
      },
      expectedBehavior: 'Pipeline enforces contracts, normalizes strings and floats, and raises descriptive validation errors on non-compliant input.',
    } as GuidedLabBlock,
    {
      id: 'blk-b9-d42-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Multi-Field Operational Threshold Validator',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a cross-field validator `validate_threshold_rule(min_val, max_val, alert_level)` ensuring min_val < max_val and alert_level is valid.',
      starterCode: `def validate_threshold_rule(min_val, max_val, alert_level):
    # TODO: Implement defensive validation and cross-field check
    # Ensure min_val < max_val and alert_level in ("LOW", "MEDIUM", "HIGH")
    pass`,
      hints: [
        'Cast values to float before comparing.',
        'Reject equal min and max values (`min_val >= max_val`).',
      ],
      verificationRequirements: [
        'Rejects non-numeric min and max values.',
        'Rejects cross-field contradiction (min_val >= max_val).',
        'Rejects invalid alert levels.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b9-d42-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Defensive Programming & Boundary Control Architecture',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Defensive Programming Principles',
          url: 'https://docs.python.org/3/tutorial/errors.html',
          description: 'Python design guide on boundary validation, type checking, and explicit failure reporting.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 43: BUILD — CLI Design with argparse ──────────────────────────────────
export const DAY_43_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w9-009',
  dayNumber: 3,
  title: 'CLI Design with argparse',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b9-d43-01',
      type: 'THEORY',
      order: 1,
      title: 'Professional Command-Line Interfaces: sys.argv vs argparse',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn to design user-friendly, professional command-line interfaces using the standard library argparse module, understanding argument parsing, help generation, types, flags, choices, and exit codes.',
      whatItIs: 'A Command-Line Interface (CLI) is an application entry point that receives arguments from the operating system shell. `sys.argv` is the list of command-line argument strings supplied to the Python process. Python\'s standard library `argparse` module provides declarative argument definition, automatic `--help` generation, type validation, default values, and standard exit codes.',
      whyItExists: 'Parsing raw `sys.argv` strings manually using index lookups is tedious, fragile, lacks automated usage documentation, and handles user syntax errors poorly.',
      problemSolved: 'Standardizes argument parsing, ensures predictable flag syntax (`-v`, `--verbose`), generates clear `--help` usage documentation, and exits with standard exit codes (0 for success, non-zero for error).',
      mentalModel: 'The Application Entry Point & Parser: 1) `sys.argv` provides the list of command-line argument strings supplied to the Python process. 2) `argparse` provides structured parsing, validation, help text, and error handling. 3) The `if __name__ == "__main__":` block is the application execution entry point. Note: Installed command-line entry points are introduced later with Python packaging metadata in Batch 010.',
      realWorldUse: 'Database migration tools, backup runners, deployment scripts, system diagnostic utilities, and CLI developer tools.',
      commonMistakes: [
        'Using `sys.argv[1]` directly without checking `len(sys.argv)`, causing `IndexError` crashes when users pass no arguments.',
        'Exiting with `sys.exit(0)` on failure, tricking CI/CD pipelines and shell scripts into believing a broken command succeeded.',
        'Mixing application logic inside the argument parser definition instead of delegating to domain functions.',
      ],
      commonMisconceptions: [
        'Misconception: "`sys.argv` is deprecated and should never be used." Reality: `sys.argv` is the underlying Python runtime primitive; `argparse` sits on top of that model. For trivial 1-line scripts, inspecting `sys.argv` directly is still standard.',
        'Misconception: "Defining a CLI script automatically installs it as a global shell command." Reality: Executing a script with `python script.py` runs the local file. Installed command-line entry points are introduced later with Python packaging metadata in Batch 010.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b9-d43-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building a Structured CLI Tool with argparse',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating ArgumentParser configuration with positional arguments, optional flags, choices, defaults, type casting, and clean exit codes.',
      language: 'python',
      codeSnippet: `import argparse
import sys

def build_parser():
    parser = argparse.ArgumentParser(
        prog="audit_tool",
        description="PinIT Operational Telemetry & Health Audit Utility"
    )
    # Positional required argument
    parser.add_argument("target", help="Target service or hostname to audit")
    
    # Optional flags with defaults and types
    parser.add_argument(
        "-p", "--port",
        type=int,
        default=443,
        help="Target port number (default: 443)"
    )
    parser.add_argument(
        "-f", "--format",
        choices=["text", "json"],
        default="text",
        help="Output report format (choices: text, json; default: text)"
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose operational diagnostics"
    )
    return parser

def run_audit(target, port, output_format, verbose):
    if verbose:
        print(f"[DIAGNOSTIC] Checking connectivity to {target}:{port}...")
    
    if port < 1 or port > 65535:
        print(f"Error: Invalid port {port}. Must be between 1 and 65535.", file=sys.stderr)
        return 1

    if output_format == "json":
        print(f'{{"target": "{target}", "port": {port}, "status": "HEALTHY"}}')
    else:
        print(f"TARGET: {target} | PORT: {port} | STATUS: HEALTHY")
    return 0

def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)
    exit_code = run_audit(args.target, args.port, args.format, args.verbose)
    return exit_code

if __name__ == "__main__":
    sys.exit(main())`,
      expectedOutput: `TARGET: prod-api.internal | PORT: 443 | STATUS: HEALTHY`,
    } as ExampleBlock,
    {
      id: 'blk-b9-d43-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Building an Operational Log Ingestion CLI',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build an operational CLI tool that parses arguments, validates flags, routes logging, and returns proper exit codes.',
      instructions: [
        'Create an ArgumentParser with a positional `logfile` argument.',
        'Add an optional flag `--min-severity` with choices `["DEBUG", "INFO", "WARNING", "ERROR"]`.',
        'Add an optional `--limit` flag with `type=int` and default `100`.',
        'Implement `main(argv=None)` that executes parsing and returns exit code 0 on success or 1 on error.',
      ],
      starterFiles: {
        'cli.py': `import argparse
import sys

def build_parser():
    parser = argparse.ArgumentParser(description="Log Ingestion & Summary CLI")
    parser.add_argument("logfile", help="Path to operational log file")
    parser.add_argument(
        "--min-severity",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default="INFO",
        help="Minimum severity threshold to report"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=100,
        help="Maximum records to process"
    )
    return parser

def main(argv=None):
    parser = build_parser()
    try:
        args = parser.parse_args(argv)
    except SystemExit as err:
        return err.code

    if args.limit <= 0:
        print("Error: --limit must be a positive integer", file=sys.stderr)
        return 1

    print(f"Processing '{args.logfile}' with severity >= {args.min_severity} (limit={args.limit})")
    return 0

if __name__ == "__main__":
    sys.exit(main())`,
      },
      expectedBehavior: 'CLI parses inputs cleanly, displays automated help when requested with --help, and enforces choices and positive limits.',
    } as GuidedLabBlock,
    {
      id: 'blk-b9-d43-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Exit Codes & The Unix Pipeline Contract',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why do command-line programs communicate success via exit code 0 and errors via non-zero integers? What happens when a Python script catches an error, prints a message, but exits with code 0?',
      guidingQuestions: [
        'How do CI/CD pipelines (like GitHub Actions) decide if a test or deployment step failed?',
        'Why should operational error messages be printed to sys.stderr rather than sys.stdout?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 44: DEBUG / DEEPEN — Production Diagnostics & Failure Analysis ────────
export const DAY_44_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w9-009',
  dayNumber: 4,
  title: 'Production Diagnostics & Failure Analysis',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b9-d44-01',
      type: 'THEORY',
      order: 1,
      title: 'Operational Diagnostics: Evidence-Based Problem Solving',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn systematic failure diagnosis in production environments, debugging duplicate log propagation, silent argument parsing failures, and late-validation state corruption.',
      whatItIs: 'Operational diagnostics is the discipline of isolating root causes in interacting software systems using verifiable evidence: OBSERVE -> REPRODUCE -> COLLECT LOGS -> READ TRACEBACK -> FORM HYPOTHESIS -> ROOT CAUSE -> FIX -> VERIFY -> EXPLAIN.',
      whyItExists: 'In production systems, guessing causes cascading failures. Systematic analysis of logs, exit codes, and boundary contracts reveals the exact defect.',
      problemSolved: 'Resolves duplicate log explosion, prevents exit code masking, and stops state corruption caused by late validation.',
      mentalModel: 'Evidence Before Guessing: Never modify code based on a hunch. Inspect the exact log record, check which handler received it, examine the CLI exit code, and trace the data boundary.',
      commonMistakes: [
        'Assuming duplicate log entries are caused by the code running twice, when it is actually a logger configured with multiple handlers or propagating to the root logger.',
        'Swallowing argparse errors and exiting with 0, hiding failures from automated pipelines.',
        'Performing validation after modifying state, leaving data half-corrupted when validation fails.',
      ],
      commonMisconceptions: [
        'Misconception: "If a logger has no handlers, it cannot output logs." Reality: In Python, loggers propagate events up to their parent loggers (and ultimately the root logger) by default unless `propagate = False` is set.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b9-d44-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The Duplicate Log Explosion',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'An engineer reports that every time `audit_service.log_event()` is called, duplicate log lines are printed two times to the console due to unexpected handler propagation.',
      symptom: 'Duplicate console log records:\n[CHILD] [INFO] Audit event recorded\n[PARENT] [INFO] Audit event recorded',
      brokenArtifact: `# service.py
import logging
import sys

# Application boundary setup: Top-level ancestor logger has a console handler
parent_logger = logging.getLogger("service")
parent_logger.setLevel(logging.INFO)
parent_handler = logging.StreamHandler(sys.stdout)
parent_handler.setFormatter(logging.Formatter("[PARENT] [%(levelname)s] %(message)s"))
parent_logger.addHandler(parent_handler)

# DEFECT: Child module logger attaches its own handler while propagation remains active!
child_logger = logging.getLogger("service.audit")
child_handler = logging.StreamHandler(sys.stdout)
child_handler.setFormatter(logging.Formatter("[CHILD] [%(levelname)s] %(message)s"))
child_logger.addHandler(child_handler)

# When child_logger emits a record:
# 1. child_handler handles the record and prints [CHILD]
# 2. Record propagates up to parent_logger, and parent_handler prints [PARENT] again!
child_logger.info("Audit event recorded")`,
      expectedBehavior: 'Understand handler placement at the application boundary. Resolve duplicates either by removing redundant child handlers (relying on propagation to ancestor) or setting child_logger.propagate = False if child requires dedicated formatting.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Trace logger propagation: does child_logger send records up to parent_logger?',
        'Hint 2: In standard library logging, records bubble up to ancestors by default. Avoid attaching handlers in child modules when the parent already handles output.',
      ],
      targetCompetencyId: COMPETENCY_ID_LOGGING_CLI_ENGINEERING,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b9-d44-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: The Masked CLI Exit Code',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A automated deployment pipeline deployed invalid configuration because the validation CLI printed an error message but exited with exit code 0.',
      symptom: 'Shell exits with $? = 0 despite error message printed to console.',
      brokenArtifact: `# deploy_checker.py
import sys

def check_config(config_dict):
    if "api_url" not in config_dict:
        print("ERROR: Missing api_url in deployment configuration!", file=sys.stderr)
        # DEFECT: Returns None / exits without non-zero status
        return

def main():
    check_config({})
    # DEFECT: Script finishes execution normally, reporting exit code 0 to OS!
    print("Check finished.")

if __name__ == "__main__":
    main()`,
      expectedBehavior: 'Explicitly exit with a non-zero exit code (`sys.exit(1)`) whenever validation or operational checks fail.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Check what exit code the OS receives when `main()` completes without `sys.exit()`.',
        'Hint 2: Raise an exception or return a status code and call `sys.exit(1)` on error.',
      ],
      targetCompetencyId: COMPETENCY_ID_LOGGING_CLI_ENGINEERING,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b9-d44-04',
      type: 'DEBUGGING_CHALLENGE',
      order: 4,
      title: 'Debugging Challenge 3: Late Validation & Partial State Corruption',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A batch processor exhibited late validation by modifying in-memory account state before validating transaction limits, leaving accounts deducted when an invalid transfer was rejected.',
      symptom: 'Account balance was deducted even though the overall transfer operation failed.',
      brokenArtifact: `# processor.py
def process_transfer(source_account, target_account, amount):
    # DEFECT: Deducting balance before validating target and limits!
    source_account["balance"] -= amount

    # Late validation:
    if amount > 10000.0:
        raise ValueError("Transfer exceeds maximum single transaction limit of 10000.0")
    if not target_account.get("active"):
        raise ValueError("Target account is inactive")

    target_account["balance"] += amount
    return True`,
      expectedBehavior: 'Move all validation rules to the boundary before any state mutation occurs.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Trace the order of operations: when does `source_account["balance"] -= amount` execute relative to the validation checks?',
        'Hint 2: Validate all constraints first; only mutate balances after all checks pass.',
      ],
      targetCompetencyId: COMPETENCY_ID_LOGGING_CLI_ENGINEERING,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 45: TRANSFER + FORMATIVE ASSESSMENT — Operational CLI Audit Tool ────────
export const DAY_45_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w9-009',
  dayNumber: 5,
  title: 'Operational CLI Audit & Telemetry Tool',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b9-d45-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Operational CLI Audit & Telemetry Tool',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Cloud Infrastructure Observability & Security Audit Tooling: Operations teams run automated CLI utilities to ingest raw server operational logs, filter events by severity and time boundaries, validate incoming telemetry against strict safety schemas, and produce structured diagnostic summaries with clean exit codes. The tool must operate without leaking sensitive data (passwords, tokens) and format logs cleanly.',
      task: `Design and implement an operational CLI audit and telemetry processor:
\`run_audit_tool(cli_args, telemetry_records)\`

PARAMETER DATA FORMATS:
1. \`cli_args\`: A list of command-line argument strings (e.g. \`["--min-severity", "WARNING", "--service", "auth-api"]\`).
   Supported CLI flags:
   - \`--min-severity\`: One of \`["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]\` (default: \`"INFO"\`).
   - \`--service\`: Optional string filter for service name (if omitted, accepts all services).
   - \`--format\`: One of \`["summary", "detailed"]\` (default: \`"summary"\`).
   - \`--max-records\`: Positive integer limit on records to process (default: \`1000\`).

2. \`telemetry_records\`: A list of telemetry dictionary records:
   - \`{"event_id": "EVT-101", "service": "auth-api", "severity": "WARNING", "message": "Failed login attempt", "duration_ms": 45.2}\`

OPERATIONAL VALIDATION & SANITIZATION RULES:
1. Raw Record Validation:
   - Must be a dictionary.
   - Required fields: \`event_id\`, \`service\`, \`severity\`, \`message\`.
   - \`severity\` must be one of \`DEBUG\`, \`INFO\`, \`WARNING\`, \`ERROR\`, \`CRITICAL\`.
   - \`duration_ms\` (if present) must be numeric and >= 0.0.
   - Non-compliant records are counted as \`REJECTED_RECORDS\` and skipped.
2. Security & Redaction Rule:
   - If \`message\` contains non-compliant sensitive tokens (\`"password="\`, \`"secret="\`, \`"token="\`), the sensitive value must be redacted to \`"[REDACTED]"\` in any output or log representation.
3. Filtering & Counting:
   - Only evaluate valid records whose severity meets or exceeds \`--min-severity\` (Severity order: DEBUG < INFO < WARNING < ERROR < CRITICAL).
   - If \`--service\` is provided, only include records matching the service name (case-insensitive).
   - Stop processing if \`--max-records\` limit is reached.

RETURN FORMAT:
The function must return a structured operational report string:
"""
PROCESSED_RECORDS_COUNT: 3
MATCHED_RECORDS_COUNT: 2
REJECTED_RECORDS_COUNT: 1
CRITICAL_ERROR_COUNT: 0
PRIMARY_SERVICE: auth-api
AUDIT_STATUS: PASS
"""
- \`AUDIT_STATUS\`: \`"PASS"\` if \`CRITICAL_ERROR_COUNT == 0\`; \`"ALERT"\` if \`CRITICAL_ERROR_COUNT > 0\`; \`"EMPTY"\` if no records processed.
- \`PRIMARY_SERVICE\`: The service name with the most matched records (or "NONE" if empty).
- If CLI arguments are malformed (e.g. invalid flag, negative limit), return error string:
  \`"CLI_ERROR: Invalid arguments provided"\`.`,
      constraints: [
        'Apply argparse or clean argument parsing logic.',
        'Enforce boundary validation before state aggregation.',
        'Zero global mutable state; all state passes via arguments and return value.',
        'Autograder is non-prescriptive and accepts multiple valid software designs.',
      ],
      difficulty: 'BEGINNER',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_LOGGING_CLI_ENGINEERING,
      assessmentRef: 'asm-pfs-m3-w9-cli-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 45 INDEPENDENT FORMATIVE ASSESSMENT ──────────────────────────────────
export const DAY_45_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m3-w9-cli-001',
  assessmentCode: 'ASM-PFS-M3-W9-CLI',
  title: 'Operational CLI Audit & Telemetry Tool Formative Assessment',
  description: 'Independent formative practice assessment evaluating CLI argument parsing, defensive validation pipelines, operational logging, and telemetry report generation in the browser sandbox. (Client-accessible formative test fixtures; not certification-grade).',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'BEGINNER',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_LOGGING_CLI_ENGINEERING,
  items: [
    {
      id: 'item-cli-01',
      assessmentId: 'asm-pfs-m3-w9-cli-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Implement an operational telemetry processor \`run_audit_tool(cli_args, telemetry_records)\` that parses CLI arguments, validates records defensively, redacts sensitive tokens, and returns the formatted execution report string. Multiple valid software architectures are accepted.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-cli-01',
          name: 'Standard Filtering by Service and Severity with Clean Records',
          input: JSON.stringify({
            cli_args: ['--min-severity', 'WARNING', '--service', 'auth-api'],
            telemetry_records: [
              { event_id: 'E-01', service: 'auth-api', severity: 'INFO', message: 'User logged in' },
              { event_id: 'E-02', service: 'auth-api', severity: 'WARNING', message: 'Failed attempt' },
              { event_id: 'E-03', service: 'data-sync', severity: 'WARNING', message: 'Sync lag' },
            ],
          }),
          expectedOutput: 'PROCESSED_RECORDS_COUNT: 3\\nMATCHED_RECORDS_COUNT: 1\\nREJECTED_RECORDS_COUNT: 0\\nCRITICAL_ERROR_COUNT: 0\\nPRIMARY_SERVICE: auth-api\\nAUDIT_STATUS: PASS',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-cli-02',
          name: 'Defensive Rejection of Malformed Records and Critical Error Count',
          input: JSON.stringify({
            cli_args: ['--min-severity', 'INFO'],
            telemetry_records: [
              { event_id: 'E-10', service: 'billing-svc', severity: 'CRITICAL', message: 'Database connection failed' },
              { service: 'corrupt-record-no-id' }, // Missing event_id & severity -> reject
            ],
          }),
          expectedOutput: 'PROCESSED_RECORDS_COUNT: 1\\nMATCHED_RECORDS_COUNT: 1\\nREJECTED_RECORDS_COUNT: 1\\nCRITICAL_ERROR_COUNT: 1\\nPRIMARY_SERVICE: billing-svc\\nAUDIT_STATUS: ALERT',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-cli-01',
          name: 'Malformed CLI Arguments Error Handling',
          input: JSON.stringify({
            cli_args: ['--invalid-flag-xyz'],
            telemetry_records: [],
          }),
          expectedOutput: 'CLI_ERROR: Invalid arguments provided',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-cli-02',
          name: 'Empty Telemetry Records Boundary Handling',
          input: JSON.stringify({
            cli_args: [],
            telemetry_records: [],
          }),
          expectedOutput: 'PROCESSED_RECORDS_COUNT: 0\\nMATCHED_RECORDS_COUNT: 0\\nREJECTED_RECORDS_COUNT: 0\\nCRITICAL_ERROR_COUNT: 0\\nPRIMARY_SERVICE: NONE\\nAUDIT_STATUS: EMPTY',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-cli-01',
          name: 'Anti-Hardcoding Dynamic Redaction and Count Probe',
          input: '{"probe_vector": "DYNAMIC_CLI_PROBE"}',
          expectedOutput: '{"dynamically_computed": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-cli-01', name: 'FunctionalCorrectness', description: 'Accurately parses inputs, counts events, filters severity, and computes status.', weight: 0.30, maxPoints: 30 },
        { id: 'rub-cli-02', name: 'CLIDesign', description: 'Implements clean argument parsing, handles defaults, choices, and invalid flags.', weight: 0.20, maxPoints: 20 },
        { id: 'rub-cli-03', name: 'ValidationErrorHandling', description: 'Applies defensive validation to reject non-compliant telemetry records.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-cli-04', name: 'LoggingObservability', description: 'Applies operational observability principles without leaking sensitive tokens.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-cli-05', name: 'DebuggingDiagnostics', description: 'Safely handles boundary cases such as empty records and malformed arguments.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-cli-06', name: 'CodeQualityMaintainability', description: 'Clean modular structure, readable functions, and sensible error boundaries.', weight: 0.10, maxPoints: 10 },
      ],
    },
  ],
  createdAt: '2026-09-03T00:00:00.000Z',
  updatedAt: '2026-09-03T00:00:00.000Z',
};

// ── BATCH 009 COMPLETE MANIFEST (DAYS 41–45) ─────────────────────────────────
export const BATCH_009_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m3-w9-009',
  batchCode: 'P1-M3-W9-BATCH009',
  title: 'Logging, Defensive Validation & Professional CLI Engineering (Days 41–45)',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_41_MANIFEST,
    DAY_42_MANIFEST,
    DAY_43_MANIFEST,
    DAY_44_MANIFEST,
    DAY_45_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-03T00:00:00.000Z',
  updatedAt: '2026-09-03T00:00:00.000Z',
};
