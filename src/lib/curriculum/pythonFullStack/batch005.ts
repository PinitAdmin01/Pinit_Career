// src/lib/curriculum/pythonFullStack/batch005.ts
// Single Source of Truth for PINIT BATCH 005: Month 2 · Week 5 · Days 21–25
// Python Application Engineering Foundations: Errors, Files, JSON & Persistent Architecture
// Pedagogical Flow: UNDERSTAND (Exceptions) -> APPLY (File I/O) -> BUILD (JSON) -> DEBUG (Corrupt Data/Recovery) -> TRANSFER (Persistent App Architecture)

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

export const COMPETENCY_ID_APP_ENGINEERING = 'comp-pfs-m2-005';

// ── DAY 21: UNDERSTAND — Errors, Exceptions & Recovery ────────────────────────
export const DAY_21_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w5-005',
  dayNumber: 1,
  title: 'Errors, Exceptions & Recovery',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b5-d21-01',
      type: 'THEORY',
      order: 1,
      title: 'Errors vs Exceptions: Stack Traces, Targeted Exception Handling & Recovery',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand the difference between syntax errors and runtime exceptions, read tracebacks, master targeted try-except-else-finally handling, and distinguish expected recoverable failures from unexpected bugs.',
      whatItIs: 'Syntax errors occur when Python parsing fails before execution begins. Runtime exceptions occur during program execution when an operation fails (e.g. ValueError, TypeError, ZeroDivisionError, FileNotFoundError). Python provides the `try...except...else...finally` control structure to intercept exceptions and enable graceful recovery or cleanup.',
      whyItExists: 'Real-world software interacts with unpredictable external conditions (user input, missing files, network states). Programs must handle expected failures gracefully rather than crashing abruptly.',
      problemSolved: 'Prevents unhandled runtime crashes, separates error-handling logic from normal execution flow, and allows applications to report clear diagnostics to users while logging details for developers.',
      mentalModel: 'Exception Lifecycle Mental Model: An operation executes. If successful, control proceeds normally to the `else` block. If a runtime failure occurs, Python raises an exception object that propagates up the call stack until an matching `except` block catches it. The `finally` block always executes regardless of whether an exception occurred.',
      realWorldUse: 'Validating user input, handling missing configuration files, preventing divide-by-zero crashes in financial calculations, and guaranteeing resource cleanup.',
      commonMistakes: [
        'Using a bare `except:` without an exception type, which inadvertently catches SystemExit, KeyboardInterrupt, and masks critical programming bugs.',
        'Swallowing exceptions silently (e.g. `except Exception: pass`) without logging or handling, leaving the application in a corrupt or undefined state.',
        'Catching the wrong exception type (e.g. catching `TypeError` when `int("abc")` raises `ValueError`).',
      ],
      commonMisconceptions: [
        'Misconception: "Exceptions mean the programmer wrote bad code." Reality: Many exceptions represent normal, expected runtime conditions (such as invalid user input or missing files) that robust programs are designed to intercept and recover from.',
        'Misconception: "The `finally` block only runs if an error occurs." Reality: The `finally` block ALWAYS executes, whether an exception was raised, caught, or not raised at all.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b5-d21-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Targeted Exception Handling with try, except, else, finally & Explicit raise',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating specific exception catching, error diagnostics, the else and finally clauses, and explicit exception raising.',
      language: 'python',
      codeSnippet: `# 1. Targeted Exception Handling with Specific Types
def parse_percentage(raw_input):
    try:
        val = float(raw_input)
        if val < 0.0 or val > 100.0:
            raise ValueError(f"Percentage must be between 0 and 100, got {val}")
    except ValueError as err:
        print(f"[RECOVERED] Invalid input: {err}")
        return None
    except TypeError as err:
        print(f"[RECOVERED] Wrong type provided: {err}")
        return None
    else:
        print(f"[SUCCESS] Parsed value: {val}%")
        return val
    finally:
        print("[CLEANUP] parse_percentage operation completed.")

# 2. Testing various inputs
print("--- Case 1: Valid Input ---")
res1 = parse_percentage("85.5")

print("\\n--- Case 2: Out of Range (Explicit raise) ---")
res2 = parse_percentage("150.0")

print("\\n--- Case 3: Malformed String ---")
res3 = parse_percentage("not_a_number")`,
      expectedOutput: `--- Case 1: Valid Input ---
[SUCCESS] Parsed value: 85.5%
[CLEANUP] parse_percentage operation completed.

--- Case 2: Out of Range (Explicit raise) ---
[RECOVERED] Invalid input: Percentage must be between 0 and 100, got 150.0
[CLEANUP] parse_percentage operation completed.

--- Case 3: Malformed String ---
[RECOVERED] Invalid input: could not convert string to float: 'not_a_number'
[CLEANUP] parse_percentage operation completed.`,
    } as ExampleBlock,
    {
      id: 'blk-b5-d21-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Safe Conversion & Arithmetic Boundary Drills',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Implement `safe_divide(numerator, denominator, default=0.0)` catching ZeroDivisionError and TypeError.',
        'Implement `safe_int_conversion(value, fallback=0)` catching ValueError and TypeError.',
        'Implement `calculate_batch_average(values)` that skips invalid entries and computes the average of valid numbers without crashing.',
      ],
      starterCode: `def safe_divide(numerator, denominator, default=0.0):
    try:
        return float(numerator) / float(denominator)
    except (ZeroDivisionError, ValueError, TypeError):
        return default

def safe_int_conversion(value, fallback=0):
    try:
        return int(value)
    except (ValueError, TypeError):
        return fallback

def calculate_batch_average(values):
    total = 0.0
    valid_count = 0
    for item in values:
        try:
            num = float(item)
            total += num
            valid_count += 1
        except (ValueError, TypeError):
            continue
    
    if valid_count == 0:
        return 0.0
    return round(total / valid_count, 2)`,
      hints: [
        'Use tuple syntax `except (ZeroDivisionError, TypeError):` to catch multiple specific exceptions in a single block.',
        'Never use bare `except:` — always name the specific exceptions you intend to handle.',
      ],
      expectedOutcome: 'Learner constructs resilient helper functions that intercept expected runtime exceptions without terminating the program.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b5-d21-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic Check: Bare except vs Targeted Exception Handling',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is using a bare `except:` or `except BaseException:` considered a dangerous anti-pattern in Python application engineering?',
      options: [
        'Because Python raises a SyntaxError whenever a bare `except:` is encountered.',
        'Because bare `except:` intercepts SystemExit, KeyboardInterrupt (Ctrl+C), and unhandled NameErrors, masking severe bugs and preventing clean program termination.',
        'Because bare `except:` executes slower than catching specific exceptions.',
        'Because bare `except:` cannot be used inside functions.',
      ],
      correctIndex: 1,
      explanation: 'In Python, `BaseException` is the root of the exception hierarchy, including `KeyboardInterrupt` and `SystemExit`. A bare `except:` catches all subclasses of `BaseException`, preventing the user from interrupting a stuck script with Ctrl+C and hiding unexpected programming bugs (such as misspelled variable names or logic errors). Production Python code should always catch specific expected exception classes (e.g. `except (ValueError, KeyError):`).',
      misconceptionIdentified: 'Believing that catching all exceptions with bare except is safe defense.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b5-d21-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Documentation & Standards: Errors and Exceptions',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Tutorial: Errors and Exceptions',
          url: 'https://docs.python.org/3/tutorial/errors.html',
          description: 'Official Python reference on syntax errors, exception handling, raising exceptions, and cleanup actions.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 22: APPLY — File I/O, Paths & Safe Persistence ────────────────────────
export const DAY_22_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w5-005',
  dayNumber: 2,
  title: 'File I/O, Paths & Safe Persistence',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b5-d22-01',
      type: 'THEORY',
      order: 1,
      title: 'In-Memory State vs Filesystem Persistence, pathlib & Resource Management',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Transition from volatile in-memory variables to persistent disk storage, mastering cross-platform filesystem paths with pathlib and safe resource management with the with statement.',
      whatItIs: 'In-memory variables exist only during the lifetime of a running process; when the program terminates, RAM state is cleared. Files provide persistent storage on disk that survives across program runs. Python provides `open()` with modes (\'r\' for read, \'w\' for overwrite, \'a\' for append), the `with` statement for deterministic file closing, and the `pathlib` standard library module for cross-platform path manipulation.',
      whyItExists: 'Real applications must save user configurations, logs, transaction histories, and domain records permanently so they can be reloaded on future executions.',
      problemSolved: 'Enables state to survive program restarts, handles cross-platform path separators (Windows backslashes vs POSIX forward slashes), and prevents file descriptor leaks.',
      mentalModel: 'Volatile RAM vs Persistent Storage: Variables in Python memory are like notes written on a whiteboard that gets erased when the room is locked (process exit). Files on disk are like books in a physical filing cabinet: when you restart the application tomorrow, the book is still exactly where you left it.',
      realWorldUse: 'Configuration loading, log file writing, user session persistence, and data archiving in backend services.',
      commonMistakes: [
        'Opening a file with `f = open(...)` without a `with` block or closing it, leaking file handles and risking unwritten buffered data.',
        'Hardcoding Windows (`\\`) or Linux (`/`) path separators as raw strings instead of using `pathlib.Path`.',
        'Forgetting to specify `encoding="utf-8"`, leading to platform-dependent encoding bugs across Windows and Linux.',
        'Using write mode (\'w\') when append mode (\'a\') was intended, unintentionally erasing existing file contents.',
      ],
      commonMisconceptions: [
        'Misconception: "Opening a file in \'w\' mode adds data to the end of the file." Reality: Mode \'w\' truncates (erases) the file immediately upon opening. Use mode \'a\' to append new content to an existing file.',
        'Misconception: "`pathlib.Path` is only for creating directories." Reality: `Path` objects provide full cross-platform path operations, existence checks (`.exists()`, `.is_file()`), and convenience methods like `.read_text()` and `.write_text()`.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b5-d22-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'File Writing, Appending, Reading & Cross-Platform pathlib Operations',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating safe file persistence using with open(), utf-8 encoding, append mode, and cross-platform pathlib.Path operations.',
      language: 'python',
      codeSnippet: `from pathlib import Path

# 1. Defining cross-platform paths
storage_dir = Path("app_data")
log_file = storage_dir / "audit_log.txt"

# 2. Writing text (Overwriting mode 'w')
# Ensure directory exists
storage_dir.mkdir(parents=True, exist_ok=True)

with open(log_file, "w", encoding="utf-8") as f:
    f.write("SESSION_START: 2026-09-02T10:00:00Z\\n")
    f.write("USER: admin_operator\\n")

# 3. Appending records (Append mode 'a')
with open(log_file, "a", encoding="utf-8") as f:
    f.write("ACTION: CONFIG_UPDATED status=SUCCESS\\n")
    f.write("ACTION: BACKUP_TRIGGERED status=SUCCESS\\n")

# 4. Reading file contents safely with existence verification
if log_file.exists() and log_file.is_file():
    with open(log_file, "r", encoding="utf-8") as f:
        content = f.read()
    print("--- Stored Audit Log Contents ---")
    print(content.strip())
else:
    print(f"Log file {log_file} does not exist.")`,
      expectedOutput: `--- Stored Audit Log Contents ---
SESSION_START: 2026-09-02T10:00:00Z
USER: admin_operator
ACTION: CONFIG_UPDATED status=SUCCESS
ACTION: BACKUP_TRIGGERED status=SUCCESS`,
    } as ExampleBlock,
    {
      id: 'blk-b5-d22-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Persistent Daily Journal & Log Manager Module',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a modular text-file persistence module that stores and queries timestamped journal entries.',
      instructions: [
        'Implement `save_entry(file_path, entry_text)` appending a formatted entry to disk.',
        'Implement `read_all_entries(file_path)` returning a list of entry lines or an empty list if file is missing.',
        'Implement `count_entries(file_path)` returning the number of recorded entries.',
        'Ensure all file operations specify `encoding="utf-8"` and use `with open(...)`.',
      ],
      starterFiles: {
        'journal_storage.py': `from pathlib import Path

def save_entry(file_path, entry_text):
    path = Path(file_path)
    if path.parent and not path.parent.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry_text.strip() + "\\n")
    return True

def read_all_entries(file_path):
    path = Path(file_path)
    if not path.exists() or not path.is_file():
        return []
    
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]

def count_entries(file_path):
    entries = read_all_entries(file_path)
    return len(entries)

# Demonstration
storage = "sandbox_journal.txt"
save_entry(storage, "Entry 1: Initialized application workspace.")
save_entry(storage, "Entry 2: Tested persistence across process restarts.")

print("Total entries:", count_entries(storage))
print("Entries:", read_all_entries(storage))`,
      },
      expectedBehavior: 'Module safely creates files, appends entries without data loss, handles non-existent paths gracefully, and reads lines accurately.',
    } as GuidedLabBlock,
    {
      id: 'blk-b5-d22-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Server Event Stream Archiver',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Create `archive_server_event(log_path, event_type, details)` and `search_events_by_type(log_path, target_type)` using file persistence and exception handling.',
      starterCode: `from pathlib import Path

def archive_server_event(log_path, event_type, details):
    # TODO: Append "[EVENT_TYPE] details\\n" to log_path safely with utf-8 encoding
    pass

def search_events_by_type(log_path, target_type):
    # TODO: Read log_path lines and return list of lines matching target_type. Handle missing file.
    pass`,
      hints: [
        'Use `pathlib.Path(log_path)` and handle `FileNotFoundError` or check `.exists()` before reading.',
        'Always use `with open(..., "a", encoding="utf-8") as f:` for appending.',
      ],
      verificationRequirements: [
        'Correctly appends formatted events to file.',
        'Returns matching events and handles missing file gracefully without throwing unhandled exceptions.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b5-d22-05',
      type: 'KNOWLEDGE_CHECK',
      order: 5,
      title: 'Diagnostic Check: Resource Management with the with Statement',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is `with open("data.txt", "r", encoding="utf-8") as f:` preferred over `f = open("data.txt", "r")` followed by manual `f.close()`?',
      options: [
        'The `with` statement runs the file read operations asynchronously in the background.',
        'The `with` statement guarantees the file is properly closed and buffers are flushed even if an unhandled exception occurs inside the block.',
        'The `with` statement automatically converts text to a Python dictionary.',
        'The `with` statement prevents other programs from reading the file permanently.',
      ],
      correctIndex: 1,
      explanation: 'The `with` statement establishes a managed resource context. Even if an exception is raised while reading or writing inside the `with` block, Python guarantees that the file descriptor is closed properly and system buffers are flushed, preventing file descriptor leaks and data loss.',
      misconceptionIdentified: 'Believing manual close is sufficient even when exceptions can occur.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 23: BUILD — JSON & Structured Application Data ────────────────────────
export const DAY_23_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w5-005',
  dayNumber: 3,
  title: 'JSON & Structured Application Data',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b5-d23-01',
      type: 'THEORY',
      order: 1,
      title: 'JSON Data Interchange Format: Serialization, Deserialization & Type Mapping',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn JSON as the universal structured data interchange format, understand Python-to-JSON type mapping, and master serialization and deserialization with error handling.',
      whatItIs: 'JSON (JavaScript Object Notation) is a standardized text format for structured data interchange. Python\'s built-in `json` module provides `json.dumps()` / `json.loads()` for string conversion and `json.dump()` / `json.load()` for file streams. Type mapping: Python `dict` $\\leftrightarrow$ JSON Object, Python `list` $\\leftrightarrow$ JSON Array, Python `str` $\\leftrightarrow$ JSON String, Python `int`/`float` $\\leftrightarrow$ JSON Number, Python `bool` $\\leftrightarrow$ JSON Boolean (`true`/`false`), Python `None` $\\leftrightarrow$ JSON `null`.',
      whyItExists: 'Plain text files lack standard structure for complex nested data (records, lists of entities, configuration dictionaries). JSON provides a universal, human-readable, cross-language structured format.',
      problemSolved: 'Enables applications to save, load, validate, and exchange complex nested data models without inventing proprietary text file parsing logic.',
      mentalModel: 'Serialization vs Deserialization Mental Model: Serialization (`dumps`/`dump`) translates in-memory Python objects (dictionaries, lists) into a standardized UTF-8 text representation (JSON string or file). Deserialization (`loads`/`load`) parses the JSON text back into live in-memory Python data structures. If the text format is malformed, Python raises `json.JSONDecodeError`.',
      realWorldUse: 'Configuration files (`config.json`), REST API payloads, persistent local state storage, and application settings.',
      commonMistakes: [
        'Confusing `json.dumps()` (serializes object to Python `str`) with `json.dump()` (writes directly to a file stream).',
        'Confusing `json.loads()` (deserializes string to Python object) with `json.load()` (reads directly from a file stream).',
        'Attempting to serialize non-JSON types (e.g. `set` objects or custom objects) directly without converting them to lists or strings first.',
        'Failing to catch `json.JSONDecodeError` when reading corrupted or empty storage files.',
      ],
      commonMisconceptions: [
        'Misconception: "JSON is a Python dictionary." Reality: JSON is a text-based data format. A JSON object decodes into a Python dictionary, and a Python dictionary can be serialized to JSON, but they are fundamentally distinct concepts.',
        'Misconception: "An empty file is valid JSON." Reality: An empty file contains zero bytes; parsing it with `json.load()` raises `json.JSONDecodeError: Expecting value: line 1 column 1 (char 0)`. Valid empty JSON is `{}` or `[]`.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b5-d23-02',
      type: 'GUIDED_LAB',
      order: 2,
      title: 'Guided Build: Modular JSON Storage Engine for Application State',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a robust JSON storage manager that handles loading, saving, initial default setup, and invalid JSON recovery.',
      instructions: [
        'Implement `load_data(file_path, default_data)` loading JSON or returning default on missing/corrupt file.',
        'Implement `save_data(file_path, data)` serializing data to disk with indentation.',
        'Implement `update_record(file_path, record_id, record_dict)` modifying a record in storage.',
        'Maintain strict separation between storage operations and application data modeling.',
      ],
      starterFiles: {
        'json_storage.py': `import json
from pathlib import Path

def load_data(file_path, default_data=None):
    if default_data is None:
        default_data = {}
    
    path = Path(file_path)
    if not path.exists() or not path.is_file():
        return default_data
    
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as err:
        print(f"[STORAGE WARNING] Failed to load JSON from {file_path}: {err}. Using default.")
        return default_data

def save_data(file_path, data):
    path = Path(file_path)
    if path.parent and not path.parent.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return True
    except (TypeError, OSError) as err:
        print(f"[STORAGE ERROR] Failed to save JSON to {file_path}: {err}")
        return False

# Demonstration
storage_file = "app_state.json"
initial_state = {
    "version": "1.0",
    "settings": {"theme": "dark", "auto_save": True},
    "users": ["admin", "alice"]
}

save_data(storage_file, initial_state)
loaded = load_data(storage_file)
print("Loaded State Theme:", loaded["settings"]["theme"])`,
      },
      expectedBehavior: 'Functions safely serialize and deserialize structured JSON data, handle missing and malformed files gracefully, and preserve nested dictionary/list hierarchies.',
    } as GuidedLabBlock,
    {
      id: 'blk-b5-d23-03',
      type: 'INDEPENDENT_PRACTICE',
      order: 3,
      title: 'Independent Practice: User Profile & Preference JSON Repository',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a modular profile repository supporting `save_user_profile(storage_path, username, email, roles)` and `get_user_roles(storage_path, username)` backed by a JSON file.',
      starterCode: `import json
from pathlib import Path

def save_user_profile(storage_path, username, email, roles):
    # TODO: Load existing user database JSON, insert/update profile, and save back to disk
    pass

def get_user_roles(storage_path, username):
    # TODO: Load database JSON, return list of roles for username or empty list if not found
    pass`,
      hints: [
        'Store users in a top-level dictionary keyed by username: `{"users": {username: {"email": email, "roles": roles}}}`.',
        'Ensure `save_user_profile` creates parent directories if needed and uses `json.dump()`.',
      ],
      verificationRequirements: [
        'Correctly serializes and updates nested user profile structures.',
        'Handles non-existent files by initializing a fresh storage dictionary.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b5-d23-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Why Data Interchange Formats Are Decoupled from In-Memory Objects',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why is it important for software engineering that JSON is an independent text-based standard rather than a Python-specific binary dump? What architectural advantages does this provide when building APIs and microservices?',
      guidingQuestions: [
        'Can a JavaScript frontend or a Go backend read a JSON file written by Python?',
        'What would happen if an application saved raw language-specific memory dumps instead of standardized formats like JSON?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 24: DEBUG / DEEPEN — Corrupt Data, Missing Files & Recovery ────────────
export const DAY_24_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w5-005',
  dayNumber: 4,
  title: 'Corrupt Data, Missing Files & Recovery',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b5-d24-01',
      type: 'THEORY',
      order: 1,
      title: 'Resilient Persistence: Debugging Missing Files, Malformed JSON & Schema Drift',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master systematic debugging of persistence failures including missing files, malformed JSON, empty files, missing schema fields, type drift, and accidental data overwrites.',
      whatItIs: 'In persistent applications, runtime failures frequently originate outside application code: files may be deleted, corrupted by partial writes, contain invalid JSON, or have outdated schemas. Resilient applications inspect external data, handle `FileNotFoundError` and `JSONDecodeError`, validate field presence, and recover safely without losing existing valid records.',
      whyItExists: 'Applications operating in production cannot assume disk storage is always valid, intact, or formatted correctly.',
      problemSolved: 'Prevents application startup crashes due to corrupted local state, safeguards user data against accidental truncation, and establishes safe fallback strategies.',
      mentalModel: 'The Systematic Recovery Workflow: Observe symptom $\\to$ Reproduce with target file $\\to$ Read exception traceback $\\to$ Form hypothesis $\\to$ Inspect raw file content $\\to$ Identify root cause $\\to$ Apply targeted exception handling and validation $\\to$ Verify recovery $\\to$ Ensure valid data is preserved.',
      commonMistakes: [
        'Attempting to parse an empty file with `json.load()` without checking file size or catching `JSONDecodeError`.',
        'Overwriting a corrupted file with empty data immediately, permanently destroying salvageable user records.',
        'Assuming all JSON records contain the expected dictionary keys without verifying with `.get()` or validation checks.',
      ],
      commonMisconceptions: [
        'Misconception: "If JSON parsing fails, we should crash so the user notices." Reality: The application should report a clear diagnostic to the user, quarantine or backup the corrupted file, and initialize a safe working session without crashing.',
        'Misconception: "`FileNotFoundError` and `JSONDecodeError` are the same error." Reality: `FileNotFoundError` occurs at the OS/filesystem layer when opening a path; `JSONDecodeError` occurs at the data parsing layer after the file is opened.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b5-d24-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The Empty File & Missing Path Startup Crash',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A telemetry service crashes on initial startup when the storage file does not exist, and crashes with JSONDecodeError when a user creates an empty 0-byte file.',
      symptom: 'FileNotFoundError on initial run; json.decoder.JSONDecodeError on empty file.',
      brokenArtifact: `import json

# config_loader.py
def load_app_configuration(config_path):
    # DEFECT: Unconditionally opens file without checking existence or catching FileNotFoundError
    # DEFECT: Fails on empty file because empty string is invalid JSON
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)
    return config

# Demonstration of failure:
# load_app_configuration("missing_config.json") -> FileNotFoundError
# load_app_configuration("empty_file.json") -> JSONDecodeError`,
      expectedBehavior: 'Return a default configuration dictionary (e.g. `{"status": "INITIALIZED", "settings": {}}`) if the file is missing, empty, or unreadable, without throwing an unhandled exception.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Look at `open(...)`. If the file does not exist on disk, Python immediately raises `FileNotFoundError`. Catch this exception or check `Path(config_path).exists()`.',
        'Hint 2: An empty file contains 0 bytes. Passing an empty stream to `json.load(f)` raises `json.JSONDecodeError`. Catch `json.JSONDecodeError`.',
        'Hint 3: Wrap the file read and JSON parse in a `try...except (FileNotFoundError, json.JSONDecodeError):` block and return the default configuration.',
      ],
      targetCompetencyId: COMPETENCY_ID_APP_ENGINEERING,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b5-d24-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: Accidental File Truncation & Overwrite Bug',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A student gradebook application attempts to add a new student by opening the file in "w" mode before loading existing students, wiping all previous student records.',
      symptom: 'Previous student records disappear after saving a single new student.',
      brokenArtifact: `import json
from pathlib import Path

# gradebook.py
def add_student_record(storage_file, student_id, name, score):
    # DEFECT: Opens file in 'w' mode BEFORE reading existing data, truncating the file immediately!
    path = Path(storage_file)
    
    # Intending to read and append, but 'w' erased existing content!
    with open(path, "w", encoding="utf-8") as f:
        # Existing data is already lost!
        new_data = {student_id: {"name": name, "score": score}}
        json.dump(new_data, f)
    return True`,
      expectedBehavior: 'Load existing JSON data into memory first (or initialize empty dict if missing), update the in-memory dictionary with the new record, and then write the complete dataset back to disk.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: In Python, opening a file in `"w"` mode immediately erases (truncates) the file contents on disk.',
        'Hint 2: To update JSON storage, you must first READ the existing data into memory, modify the Python dictionary/list, and only then WRITE the updated data back.',
        'Hint 3: Use a two-step approach: Step 1 (Read existing records using `"r"` or fallback to `{}`); Step 2 (Insert new record into dict); Step 3 (Write back complete dictionary using `"w"`).',
      ],
      targetCompetencyId: COMPETENCY_ID_APP_ENGINEERING,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b5-d24-04',
      type: 'DEBUGGING_CHALLENGE',
      order: 4,
      title: 'Debugging Challenge 3: Missing Required Schema Fields & Type Drift',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'An invoice calculation script crashes with KeyError: "amount" and TypeError: unsupported operand type(s) when processing older stored records missing fields or containing string amounts.',
      symptom: 'KeyError and TypeError when calculating total invoice values.',
      brokenArtifact: `import json

# invoice_calculator.py
def calculate_total_revenue(invoices_json_path):
    # DEFECT: Assumes every record has numeric "amount" and "status" keys
    with open(invoices_json_path, "r", encoding="utf-8") as f:
        invoices = json.load(f)
    
    total = 0.0
    for inv in invoices:
        # Crashes if "status" missing, "amount" missing, or amount is string "150.00"
        if inv["status"] == "PAID":
            total += inv["amount"]
    return round(total, 2)`,
      expectedBehavior: 'Safely validate each invoice dictionary: use `.get("status")`, convert amount safely using `float(inv.get("amount", 0.0))` within exception guards, and skip malformed records without crashing.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Direct key lookup `inv["status"]` raises `KeyError` if a record is missing the key. Use `inv.get("status", "UNPAID")`.',
        'Hint 2: If `inv["amount"]` is stored as a string or None, `total += inv["amount"]` raises `TypeError`. Use a safe numeric conversion.',
        'Hint 3: Use `try...except (ValueError, TypeError)` when parsing individual record amounts so bad records are skipped safely.',
      ],
      targetCompetencyId: COMPETENCY_ID_APP_ENGINEERING,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 25: TRANSFER + ASSESSMENT — Persistent Python App Architecture ────────
export const DAY_25_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w5-005',
  dayNumber: 5,
  title: 'Persistent Python Application Architecture',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b5-d25-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Personal Expense & Budget Ledger Application Engine',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Personal Financial Operations & Audit Tracking: Applications that manage financial transactions, operational expenditures, and categorized budget limits require robust data persistence, strict input validation, resilient recovery from missing or corrupted storage, and clean separation between user operations, business calculation logic, and file storage.',
      task: `Design and implement an integrated persistent expense ledger processing engine:
\`process_expense_ledger(operations, storage_file)\`

PARAMETER DATA FORMATS:
1. \`operations\`: A sequence of operation request dictionaries:
   - \`{"action": "ADD", "id": "EXP-101", "desc": "Cloud Hosting", "category": "INFRA", "amount": 45.50}\`
   - \`{"action": "LIST"}\`
   - \`{"action": "SUMMARY"}\`
   - \`{"action": "FILTER", "category": "INFRA"}\`
2. \`storage_file\`: A filesystem path string pointing to the JSON persistence file.

YOUR FUNCTION MUST PROCESS THE OPERATIONS IN SEQUENCE AND RETURN A FORMATTED EXECUTION REPORT STRING:
"""
INITIALIZED: TRUE
RECORDS_PROCESSED: 3
VALID_EXPENSES_COUNT: 2
TOTAL_EXPENDITURE: 75.5
TOP_CATEGORY: INFRA
REJECTED_OPERATIONS: 1
CORRUPT_RECOVERY_APPLIED: FALSE
"""

FUNCTIONAL & DOMAIN REQUIREMENTS:
1. STORAGE INITIALIZATION & SAFE CORRUPTION PRESERVATION:
   - MISSING FILE: If \`storage_file\` does not exist, initialize fresh valid storage.
   - ZERO-BYTE FILE: If \`storage_file\` is empty (0 bytes), initialize valid empty storage.
   - VALID JSON: Load stored records and perform structural/type validation.
   - MALFORMED JSON (JSONDecodeError) or INVALID ROOT SCHEMA:
     - Report corruption: \`CORRUPT_RECOVERY_APPLIED: TRUE\`.
     - CRITICAL DATA SAFETY RULE: PRESERVE THE ORIGINAL CORRUPTED FILE ON DISK! NEVER silently overwrite or erase the user's corrupted file with empty data.
     - Process the current session in a safe in-memory state without destroying the original disk file.
2. STRUCTURAL & BUSINESS VALIDATION:
   - Validate each operation and loaded record:
     - \`"id"\`, \`"desc"\`, and \`"category"\` must be non-empty strings.
     - \`"amount"\` must be convertible to a positive float (> 0.0).
   - For valid \`"ADD"\` actions: record the expense, persist to disk (if storage is not in corrupt-quarantine state), and increment valid count.
   - For invalid \`"ADD"\` actions (missing keys, empty text, negative/zero amounts, malformed types): reject operation and increment rejected count.
3. SUMMARY METRICS:
   - Calculate \`TOTAL_EXPENDITURE\` = sum of all valid active expense amounts (rounded to 2 decimal places).
   - Determine \`TOP_CATEGORY\` = category with the highest total expenditure (or "NONE" if no records).
4. BOUNDARY BEHAVIOR:
   - If no valid expenses exist, report \`TOTAL_EXPENDITURE: 0.0\`, \`TOP_CATEGORY: NONE\`, \`VALID_EXPENSES_COUNT: 0\`.`,
      constraints: [
        'Structure your code cleanly by separating responsibilities: Input Handling/Dispatching, Business Logic & Calculations, and JSON File Persistence.',
        'Zero global state: all data must pass via parameters and return values.',
        'Zero classes, zero external libraries, zero type annotations in student-required code.',
        'Preserve corrupted files on disk without destructive silent overwrites.',
      ],
      difficulty: 'BEGINNER',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_APP_ENGINEERING,
      assessmentRef: 'asm-pfs-m2-w5-app-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 25 INDEPENDENT FORMATIVE ASSESSMENT ──────────────────────────────────
export const DAY_25_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m2-w5-app-001',
  assessmentCode: 'ASM-PFS-M2-W5-APP',
  title: 'Persistent Python Application Architecture — Integrated Application Engine Assessment',
  description: 'Independent formative assessment evaluating exception recovery, JSON file persistence, input validation, and clean application responsibility separation in the browser sandbox.',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'BEGINNER',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_APP_ENGINEERING,
  items: [
    {
      id: 'item-app-01',
      assessmentId: 'asm-pfs-m2-w5-app-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Implement a modular persistent application engine with \`process_expense_ledger(operations, storage_file)\` that validates inputs, manages JSON file persistence, handles errors, and returns the formatted execution report string.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-app-01',
          name: 'Standard Expense Addition and Summary Calculation',
          input: JSON.stringify({
            operations: [
              { action: 'ADD', id: 'E-01', desc: 'Server Hosting', category: 'INFRA', amount: 50.0 },
              { action: 'ADD', id: 'E-02', desc: 'Office Supplies', category: 'OFFICE', amount: 25.5 },
              { action: 'SUMMARY' },
            ],
            storage_file: 'sandbox_expenses_vt1.json',
          }),
          expectedOutput: 'INITIALIZED: TRUE\\nRECORDS_PROCESSED: 3\\nVALID_EXPENSES_COUNT: 2\\nTOTAL_EXPENDITURE: 75.5\\nTOP_CATEGORY: INFRA\\nREJECTED_OPERATIONS: 0\\nCORRUPT_RECOVERY_APPLIED: FALSE',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-app-02',
          name: 'Rejection of Invalid Operations & Zero Amount Guard',
          input: JSON.stringify({
            operations: [
              { action: 'ADD', id: 'E-10', desc: 'Domain Name', category: 'INFRA', amount: 15.0 },
              { action: 'ADD', id: 'E-11', desc: '', category: 'INFRA', amount: 30.0 }, // Empty desc
              { action: 'ADD', id: 'E-12', desc: 'Invalid Amount', category: 'MISC', amount: -10.0 }, // Negative amount
            ],
            storage_file: 'sandbox_expenses_vt2.json',
          }),
          expectedOutput: 'INITIALIZED: TRUE\\nRECORDS_PROCESSED: 3\\nVALID_EXPENSES_COUNT: 1\\nTOTAL_EXPENDITURE: 15.0\\nTOP_CATEGORY: INFRA\\nREJECTED_OPERATIONS: 2\\nCORRUPT_RECOVERY_APPLIED: FALSE',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-app-01',
          name: 'Safe Recovery from Corrupted Storage File',
          input: JSON.stringify({
            operations: [
              { action: 'ADD', id: 'E-99', desc: 'Emergency Fix', category: 'OPS', amount: 120.0 },
            ],
            storage_file: 'corrupt_test_file.json',
          }),
          expectedOutput: 'INITIALIZED: TRUE\\nRECORDS_PROCESSED: 1\\nVALID_EXPENSES_COUNT: 1\\nTOTAL_EXPENDITURE: 120.0\\nTOP_CATEGORY: OPS\\nREJECTED_OPERATIONS: 0\\nCORRUPT_RECOVERY_APPLIED: TRUE',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-app-02',
          name: 'Empty Operation Stream on Missing Storage',
          input: JSON.stringify({
            operations: [],
            storage_file: 'empty_test_storage.json',
          }),
          expectedOutput: 'INITIALIZED: TRUE\\nRECORDS_PROCESSED: 0\\nVALID_EXPENSES_COUNT: 0\\nTOTAL_EXPENDITURE: 0.0\\nTOP_CATEGORY: NONE\\nREJECTED_OPERATIONS: 0\\nCORRUPT_RECOVERY_APPLIED: FALSE',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-app-01',
          name: 'Anti-Hardcoding Dynamic Stream Assessment Probe',
          input: '{"probe_vector": "DYNAMIC_EXPENSE_STREAM_PROBE"}',
          expectedOutput: '{"dynamically_computed": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-app-01', name: 'Correctness', description: 'Accurately parses operations, updates balances, and calculates category spending summaries.', weight: 0.35, maxPoints: 35 },
        { id: 'rub-app-02', name: 'Persistence', description: 'Safely reads, serializes, and persists valid JSON data across multiple operations.', weight: 0.20, maxPoints: 20 },
        { id: 'rub-app-03', name: 'ErrorHandling', description: 'Handles missing files, corrupted JSON, and invalid numeric conversions cleanly without unhandled crashes.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-app-04', name: 'ApplicationSeparation', description: 'Demonstrates clean modular separation between I/O dispatching, calculation logic, and file storage.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-app-05', name: 'DataValidation', description: 'Validates input field presence, non-empty descriptions, and positive amounts.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-app-06', name: 'CodeQuality', description: 'Readable naming, clean error recovery flow, and zero unhandled exceptions.', weight: 0.05, maxPoints: 5 },
      ],
    },
  ],
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};

// ── BATCH 005 COMPLETE MANIFEST (DAYS 21–25) ─────────────────────────────────
export const BATCH_005_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m2-w5-005',
  batchCode: 'P1-M2-W5-BATCH005',
  title: 'Python Application Engineering Foundations (Days 21–25)',
  difficulty: 'BEGINNER',
  days: [
    DAY_21_MANIFEST,
    DAY_22_MANIFEST,
    DAY_23_MANIFEST,
    DAY_24_MANIFEST,
    DAY_25_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};
