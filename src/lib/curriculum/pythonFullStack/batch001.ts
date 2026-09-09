// src/lib/curriculum/pythonFullStack/batch001.ts
// Single Source of Truth for PINIT BATCH 001: Month 1 · Week 1 · Days 1–5
// Computing & Developer Foundations (UNDERSTAND -> APPLY -> BUILD -> DEBUG -> TRANSFER)

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

export const COMPETENCY_ID_ENV_FOUNDATIONS = 'comp-pfs-m1-001';

// ── DAY 1: UNDERSTAND — Program Execution, Memory & OS Architecture ──────────
export const DAY_1_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w1-001',
  dayNumber: 1,
  title: 'Program Execution, Memory & OS Architecture',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b1-d1-01',
      type: 'THEORY',
      order: 1,
      title: 'How Software Actually Runs on a Computer',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Demystifies program execution by tracing how source code becomes a running operating system process managed by the CPU and RAM.',
      whatItIs: 'A computer program is a structured collection of instructions. When executed, the operating system allocates a dedicated memory space (RAM), loads the program instructions, and directs the Central Processing Unit (CPU) to execute those instructions sequentially.',
      whyItExists: 'Computers do not understand human intention. They require precise mechanical coordination between persistent storage (SSD/HDD), volatile working memory (RAM), and processing hardware (CPU) mediated by an Operating System (OS).',
      problemSolved: 'Eliminates the "magic black box" misconception that code runs spontaneously in the cloud or terminal without hardware constraints.',
      mentalModel: 'Source Code (Recipe on Disk) -> Python Runtime (Bytecode Compiler & Interpreter) -> OS Kernel (Kitchen Manager allocating Process in RAM) -> CPU (Hardware executing machine instructions). Note: This is a high-level conceptual model of execution.',
      realWorldUse: 'Essential for diagnosing memory leaks, unhandled crashes, slow execution loops, and resource exhaustion in production web services.',
      commonMistakes: [
        'Confusing permanent storage (SSD/Disk) with active working memory (RAM).',
        'Believing Python code runs directly on bare CPU hardware without an interpreter process.',
        'Thinking a closed terminal window leaves a foreground program running in memory.',
      ],
      commonMisconceptions: [
        'Misconception: "Python is never compiled." Reality: Python source code (.py) is compiled into bytecode (.pyc) before the Python Virtual Machine (PVM) interprets it.',
        'Misconception: "Variables are saved permanently on disk automatically." Reality: Variables live in volatile process RAM and disappear when the process terminates unless explicitly written to a file or database.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b1-d1-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Inspecting the Active Python Process & Object Identity',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Using Python standard library modules (os and sys), we can inspect our active process ID (PID) and the Python runtime. We can also inspect an object identity with id(), which in CPython corresponds to its memory address in RAM (though application code should not depend on this implementation detail).',
      language: 'python',
      codeSnippet: `import os
import sys

# 1. Inspect the Operating System Process ID (PID)
pid = os.getpid()
print(f"[Process State] Active PID: {pid}")

# 2. Inspect the Python Runtime Version & Binary Location
print(f"[Python Runtime] Version: {sys.version.split()[0]}")
print(f"[Interpreter Binary] Executable Path: {sys.executable}")

# 3. Object Identity Demo (id() returns unique identity integer)
greeting = "Hello, PinIT Engineering!"
obj_id = id(greeting)
print(f"[Object Identity] String '{greeting}' has identity ID: {hex(obj_id)} (CPython RAM address)"),`,
      expectedOutput: `[Process State] Active PID: 14280
[Python Runtime] Version: 3.14.0
[Interpreter Binary] Executable Path: /usr/bin/python3
[Object Identity] String 'Hello, PinIT Engineering!' has identity ID: 0x7f9a12c4b8e0 (CPython RAM address)`,
    } as ExampleBlock,
    {
      id: 'blk-b1-d1-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Interactive Process & Object Identity Exploration',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Open your Python REPL or script file.',
        'Import the `sys` and `os` modules.',
        'Print the current process ID and Python platform string (`sys.platform`).',
        'Create an integer variable `counter = 42` and print its hex identity using `hex(id(counter))`.',
        'Reassign `counter = counter + 1` and observe how the identity changes (immutable integer re-binding).',
      ],
      starterCode: `import os
import sys

# Step 1: Print PID and Platform
print("My PID:", os.getpid())
print("My Platform:", sys.platform)

# Step 2: Inspect identity of an immutable value
counter = 42
print("Identity before:", hex(id(counter)))

# Step 3: Increment counter and inspect new identity
counter = counter + 1
print("Identity after:", hex(id(counter)))`,
      hints: [
        'In Python, `id(object)` returns an integer representing the object\'s unique identity for its lifetime. In CPython, this corresponds to its memory address in RAM, but Python programs should treat this as an implementation detail.',
        'Integers in Python are immutable; changing their value binds the variable name to a new object in memory.',
      ],
      expectedOutcome: 'The student observes that process ID and object identities are real runtime coordinates managed by the OS and runtime.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b1-d1-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic Concept Check: Hardware & OS Roles',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A student writes a Python script that calculates business metrics. The script runs for 5 seconds and prints results to the terminal. After the script finishes and the terminal prompt returns, where do the script variables reside?',
      options: [
        'They remain permanently stored in RAM at their original memory addresses.',
        'They are automatically saved to a hidden configuration file on the SSD.',
        'They are erased from RAM because the OS reclaims all process memory upon termination.',
        'They are retained in the CPU L1 cache until the computer is rebooted.',
      ],
      correctIndex: 2,
      explanation: 'When an OS process terminates, the operating system reclaims all volatile memory (RAM) allocated to that process. Data only persists if explicitly written to persistent storage (such as disk files or databases).',
      misconceptionIdentified: 'Belief that program variables linger in system memory indefinitely after process termination.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b1-d1-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Documentation & Standards',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Docs: The sys Module',
          url: 'https://docs.python.org/3/library/sys.html',
          description: 'Standard runtime system parameters and functions.',
        },
        {
          title: 'Python Official Docs: The os Module',
          url: 'https://docs.python.org/3/library/os.html',
          description: 'Miscellaneous operating system interfaces.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 2: APPLY — Terminal Navigation, PATH & Environment Variables ─────────
export const DAY_2_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w1-001',
  dayNumber: 2,
  title: 'Terminal Navigation, PATH & Environment Variables',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b1-d2-01',
      type: 'THEORY',
      order: 1,
      title: 'Filesystem Paths & The PATH Search Mechanism',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master how command-line shells resolve binary executable names using the PATH environment variable and navigate directory trees.',
      whatItIs: 'The Command Line Interface (CLI) is a text-based interface to the OS. The PATH environment variable is a primary mechanism used by shells to locate executable commands across directories. The exact command resolution rules and precedence depend on the specific shell and operating system (e.g. Windows PowerShell vs POSIX Bash). The Current Working Directory (CWD) is the reference location from which relative paths are resolved.',
      whyItExists: 'Without PATH, you would have to type the exact full binary path (e.g. `/usr/local/bin/python3` or `C:\\Python314\\python.exe`) every single time you ran a tool.',
      problemSolved: 'Explains why "\'python\' is not recognized" or "command not found" errors happen, and how to fix them definitively.',
      mentalModel: 'PATH is like a prioritized directory list. When you type a command, the shell checks folders in sequential order. It executes the first matching executable found according to shell resolution rules.',
      commonMistakes: [
        'Assuming a command runs from where the file lives rather than where your terminal CWD currently is.',
        'Using backslashes (\\) in POSIX shells or unquoted spaces in directory names.',
        'Thinking adding a directory to PATH changes existing open terminal sessions without restarting them.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b1-d2-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Cross-Platform Command Reference & Path Inspection',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Comparison of essential filesystem and PATH inspection commands across Windows (PowerShell/CMD) and POSIX (Linux/macOS Bash/Zsh).',
      language: 'bash',
      codeSnippet: `# ── POSIX (Linux / macOS) ───────────────────────────────────
pwd                     # Print working directory
ls -la                  # List all files with permissions
echo $PATH              # Print PATH search list
which python3           # Locate exact binary resolved by shell
export DEBUG_MODE=true  # Set environment variable

# ── Windows (PowerShell) ────────────────────────────────────
# Get-Location (pwd)    # Print working directory
# Get-ChildItem (dir)   # List files
# $env:PATH             # Print PATH search list
# Get-Command python    # Locate exact binary resolved
# $env:DEBUG_MODE="true"# Set environment variable`,
    } as ExampleBlock,
    {
      id: 'blk-b1-d2-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: PATH Resolution & Environment Variables',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Inspect and manipulate environment variables from Python and terminal.',
      instructions: [
        'Open terminal and check current working directory.',
        'Run `python -c "import os; print(os.getcwd())"` to verify Python detects the same working directory.',
        'Run `python -c "import os; print(os.environ.get(\'PATH\').split(os.pathsep)[:3])"` to view the top 3 directories searched for executables.',
        'Set a custom environment variable `APP_ENV=development` in your shell and verify Python reads it via `os.getenv(\'APP_ENV\')`.',
      ],
      starterFiles: {
        'inspect_env.py': `import os
import sys

print("[CWD]:", os.getcwd())
print("[OS Separator]:", os.sep)
print("[Path Separator]:", os.pathsep)

# Read custom environment variable
app_env = os.getenv("APP_ENV", "NOT_SET")
print(f"[Custom Config APP_ENV]: {app_env}")`,
      },
      expectedBehavior: 'Script correctly prints CWD and reflects the value of APP_ENV.',
    } as GuidedLabBlock,
    {
      id: 'blk-b1-d2-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Cross-Platform Path Normalizer',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Write a Python function `normalize_and_validate_path(target_path: str) -> dict` that takes a relative or absolute path string and returns a dictionary with absolute path, existence boolean, and whether it is a directory or file.',
      starterCode: `import os

def normalize_and_validate_path(target_path: str) -> dict:
    # TODO: Resolve absolute path
    # TODO: Check existence
    # TODO: Check if directory vs file
    pass`,
      hints: [
        'Use `os.path.abspath()` to convert relative paths to absolute.',
        'Use `os.path.exists()`, `os.path.isdir()`, and `os.path.isfile()`.',
      ],
      verificationRequirements: [
        'Returns dictionary with keys: `absolute_path`, `exists`, `is_dir`, `is_file`.',
        'Handles non-existent paths gracefully without throwing unhandled exceptions.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b1-d2-05',
      type: 'KNOWLEDGE_CHECK',
      order: 5,
      title: 'Diagnostic Check: PATH Precedence Mechanics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A developer has two Python versions installed: Python 3.10 in `/usr/bin/python3` and Python 3.14 in `/usr/local/bin/python3`. When they type `python3` in terminal, Python 3.10 starts. Their PATH is `/usr/bin:/usr/local/bin`. Why did this happen?',
      options: [
        'Because the OS always selects the older version for backwards compatibility.',
        'Because the shell searches directories listed in PATH in left-to-right order and `/usr/bin` appears before `/usr/local/bin`.',
        'Because Python 3.14 requires an administrator password to execute.',
        'Because the terminal caches the first version installed and ignores PATH changes.',
      ],
      correctIndex: 1,
      explanation: 'Shells search directories in the PATH variable sequentially from left to right. Because `/usr/bin` precedes `/usr/local/bin`, the binary in `/usr/bin` is found first and executed, shadowing the newer binary in `/usr/local/bin`.',
      misconceptionIdentified: 'Misunderstanding PATH priority ordering and binary shadowing.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 3: BUILD — Python 3.14 Installation, Virtualenv & Packaging ──────────
export const DAY_3_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w1-001',
  dayNumber: 3,
  title: 'Python 3.14 Installation, Virtualenv & Packaging',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b1-d3-01',
      type: 'THEORY',
      order: 1,
      title: 'Why Virtual Environments are the Standard Practice in Python',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn why virtual environments are the recommended industry standard for isolating project-specific dependencies without polluting global operating system Python.',
      whatItIs: 'A virtual environment is a lightweight, isolated directory containing its own Python executable and independent package library (`site-packages`). It redirects package installations so Project A can use Django 6.0 while Project B uses Django 5.1 on the same computer without conflicts.',
      whyItExists: 'Installing third-party packages globally into the system Python can cause irreconcilable version conflicts (Dependency Hell) and makes project reproducibility difficult across different developer machines.',
      problemSolved: 'Guarantees that every project has an explicit, isolated, and reproducible set of dependencies recorded in `requirements.txt`.',
      mentalModel: 'Global Python is a shared public kitchen. A virtual environment is your own personal lockbox of ingredients for a specific recipe.',
      commonMistakes: [
        'Installing packages via `pip install` without activating the virtual environment first.',
        'Committing the entire `.venv` directory to Git repository instead of listing dependencies in `requirements.txt`.',
        'Moving or renaming a virtual environment folder (hardcoded binary paths will break; must re-create).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b1-d3-02',
      type: 'GUIDED_LAB',
      order: 2,
      title: 'Guided Build: Creating & Verifying an Isolated Virtualenv',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build and verify an isolated Python virtual environment from terminal.',
      instructions: [
        'Create a project directory `mkdir pinit_starter && cd pinit_starter`.',
        'Create a virtual environment: `python3 -m venv .venv` (or `python -m venv .venv` on Windows).',
        'Activate virtual environment: `source .venv/bin/activate` (POSIX) or `.\\.venv\\Scripts\\Activate.ps1` (Windows PowerShell).',
        'Verify active environment by checking `python -c "import sys; print(sys.prefix != sys.base_prefix)"`. It should output `True`.',
        'Inspect installed packages using `python -m pip list`.',
      ],
      starterFiles: {
        'check_isolation.py': `import sys

is_virtualenv = sys.prefix != sys.base_prefix
print(f"[Virtualenv Active]: {is_virtualenv}")
print(f"[Base Prefix]: {sys.base_prefix}")
print(f"[Active Prefix]: {sys.prefix}")

if not is_virtualenv:
    print("⚠️ WARNING: You are running inside the Global System Python!")
else:
    print("✅ SUCCESS: You are running in an Isolated Virtual Environment.")`,
      },
      expectedBehavior: 'When executed inside the activated virtualenv, `is_virtualenv` is True and prefixes differ.',
    } as GuidedLabBlock,
    {
      id: 'blk-b1-d3-03',
      type: 'INDEPENDENT_PRACTICE',
      order: 3,
      title: 'Independent Practice: Dependency Manifest Generator',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Write a Python utility `generate_environment_manifest(output_filename="env_manifest.txt")` that writes the active Python version, platform, whether venv is active, and executable location to an output file.',
      starterCode: `import sys
import platform
import os

def generate_environment_manifest(output_filename="env_manifest.txt") -> str:
    # TODO: Collect environment telemetry
    # TODO: Write to output file
    # TODO: Return formatted summary string
    pass`,
      hints: [
        'Check virtualenv status using `sys.prefix != sys.base_prefix`.',
        'Use `platform.python_version()` and `platform.system()`.',
      ],
      verificationRequirements: [
        'Creates output file with UTF-8 encoding.',
        'Contains Python version, platform, venv status, and executable path.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b1-d3-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Environment vs Package vs Application',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'In your own words, explain the difference between: 1) The Python Installation, 2) A Virtual Environment, 3) A Package Manager (pip), 4) A Package, and 5) An Application.',
      guidingQuestions: [
        'Where does pip install packages when a virtualenv is active vs inactive?',
        'Why should `.venv` be added to `.gitignore` while `requirements.txt` is committed to Git?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 4: DEBUG / DEEPEN — Broken Environment Diagnostics & Path Resolution ─
export const DAY_4_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w1-001',
  dayNumber: 4,
  title: 'Broken Environment Diagnostics & Path Resolution',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b1-d4-01',
      type: 'THEORY',
      order: 1,
      title: 'The 8-Stage Professional Troubleshooting Framework',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn the systematic engineering methodology for diagnosing environment, path, and runtime failures without guessing.',
      whatItIs: 'A structured debugging protocol: 1. OBSERVE (read exact error message and traceback) -> 2. REPRODUCE (consistently trigger the failure) -> 3. FORM HYPOTHESIS (deduce possible root causes) -> 4. INSPECT (examine variables, PATH, executable paths) -> 5. IDENTIFY ROOT CAUSE (confirm the exact defect) -> 6. FIX (apply targeted correction) -> 7. VERIFY (prove the fix works) -> 8. EXPLAIN (document why it broke and how to prevent it).',
      whyItExists: 'Randomly changing files or pasting commands from the web without understanding creates cascading environment corruption.',
      problemSolved: 'Transforms beginners from panic-driven guessers into confident, methodical problem solvers.',
      mentalModel: 'Treat an error message like an aircraft telemetry report: read the exact error type, line number, and active environment parameters before taking action.',
    } as TheoryBlock,
    {
      id: 'blk-b1-d4-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The Ghost Package Failure',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A developer ran `pip install colorama` in their terminal and saw "Successfully installed colorama". However, when running their script `app.py`, it immediately crashes with `ModuleNotFoundError: No module named \'colorama\'`.',
      symptom: 'Traceback (most recent call last):\n  File "app.py", line 1, in <module>\n    import colorama\nModuleNotFoundError: No module named \'colorama\'',
      brokenArtifact: `# app.py
# Problem: Script executed with global python while package was installed in .venv
import sys
import os

try:
    import colorama
    print("Colorama loaded successfully!")
except ModuleNotFoundError as e:
    print(f"CRITICAL ERROR: {e}")
    print(f"Current sys.executable: {sys.executable}")
    print(f"Current sys.path: {sys.path[:2]}")
    raise`,
      expectedBehavior: 'Script detects whether it is running in the correct virtualenv before importing dependencies and provides a clear diagnostic remediation message.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Check `sys.executable`. Which Python interpreter is running the script vs where pip installed the package?',
        'Hint 2: Was the virtual environment activated in the terminal session where `python app.py` was executed?',
        'Hint 3: In a dual-environment setup, `pip` and `python` might point to different installations if `python -m pip` was not used.',
      ],
      targetCompetencyId: COMPETENCY_ID_ENV_FOUNDATIONS,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b1-d4-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: The Working Directory Path Assumption Defect',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A script `services/processor.py` opens `config.json` using relative path `open("config.json")`. It works when run from the `services/` directory, but crashes with `FileNotFoundError` when run from the project root (`python services/processor.py`).',
      symptom: 'FileNotFoundError: [Errno 2] No such file or directory: \'config.json\'',
      brokenArtifact: `# services/processor.py
import os

# DEFECT: Assumes CWD is always the folder where processor.py lives
def load_config():
    with open("config.json", "r") as f: # Broken relative path
        return f.read()`,
      expectedBehavior: 'Script calculates the absolute path to config.json relative to `__file__` (the script location) rather than relying on the volatile `os.getcwd()` (Current Working Directory).',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: What is `os.getcwd()` when you run `python services/processor.py` from root vs from `services/`?',
        'Hint 2: `__file__` contains the path to the current script file.',
        'Hint 3: Use `os.path.dirname(os.path.abspath(__file__))` to build a reliable absolute path to sibling files.',
      ],
      targetCompetencyId: COMPETENCY_ID_ENV_FOUNDATIONS,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 5: TRANSFER + ASSESSMENT — Cross-Platform System Diagnostic CLI ──────
export const DAY_5_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w1-001',
  dayNumber: 5,
  title: 'Cross-Platform System Diagnostic CLI Utility',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b1-d5-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Build the PinIT System Diagnostic CLI Utility',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'DevOps & Developer Tooling: Engineering teams frequently need an automated, zero-dependency environment verification script to diagnose junior developer setup issues and CI runner environments.',
      task: `Implement a standalone, zero-dependency Python diagnostic utility function:
\`diagnose_environment(check_paths: list[str] = None) -> dict\`

The utility must return a dictionary with the following exact structure:
{
  "python_version": str (e.g. "3.14.0" or "3.12.2"),
  "python_major_minor": tuple (e.g. (3, 14) or (3, 12)),
  "platform_name": str (e.g. "linux", "darwin", "win32"),
  "os_name": str (e.g. "Linux", "Darwin", "Windows"),
  "executable_path": str (absolute path to Python binary),
  "cwd": str (absolute current working directory),
  "is_virtualenv": bool (True if running in venv, False otherwise),
  "path_directories_count": int (number of directories in PATH),
  "checked_paths": dict (mapping of each input path to {"exists": bool, "is_dir": bool, "is_file": bool}),
  "status": "HEALTHY" | "DEGRADED"
}

STATUS RULES:
- If Python major version is < 3: status must be "DEGRADED".
- If Python major version >= 3 and valid: status is "HEALTHY".
- Must run cross-platform on Windows, macOS, and Linux without external third-party dependencies.`,
      constraints: [
        'Strictly zero external dependencies: use ONLY standard library (`sys`, `os`, `platform`).',
        'Must handle empty or None `check_paths` gracefully.',
        'Must NOT require administrator/root privileges.',
        'Must NOT collect or leak sensitive PII.',
      ],
      difficulty: 'BEGINNER',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_ENV_FOUNDATIONS,
      assessmentRef: 'asm-pfs-m1-w1-diag-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 5 INDEPENDENT ASSESSMENT DEFINITION ──────────────────────────────────
export const DAY_5_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m1-w1-diag-001',
  assessmentCode: 'ASM-PFS-M1-W1-DIAG',
  title: 'Cross-Platform Developer Environment Diagnostic Assessment',
  description: 'Independent formative learning assessment evaluating Python environment inspection, path resolution, virtualenv detection, and cross-platform CLI implementation within the formative sandbox.',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'BEGINNER',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_ENV_FOUNDATIONS,
  items: [
    {
      id: 'item-diag-01',
      assessmentId: 'asm-pfs-m1-w1-diag-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Write a function \`diagnose_environment(check_paths=None)\` in Python that inspects the runtime environment and returns a telemetry dictionary adhering to the specification.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-diag-01',
          name: 'Basic Telemetry Schema & Keys Check',
          input: '{"check_paths": []}',
          expectedOutput: '{"has_required_keys": true, "has_valid_types": true}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-diag-02',
          name: 'Virtualenv Detection Accuracy',
          input: '{"check_paths": ["."]}',
          expectedOutput: '{"cwd_exists": true, "is_virtualenv_bool": true}',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-diag-01',
          name: 'Path Inspection Accuracy with Multiple Valid & Invalid Paths',
          input: '{"check_paths": [".", "non_existent_dir_99999", "/dev/null"]}',
          expectedOutput: '{"checked_count": 3, "non_existent_is_false": true}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-diag-02',
          name: 'Null & Empty Argument Resilience',
          input: '{"check_paths": null}',
          expectedOutput: '{"handled_gracefully": true, "checked_paths_empty": true}',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-diag-01',
          name: 'Anti-Hardcoding Dynamic Memory Probe',
          input: '{"probe_vector": "RANDOM_CWD_VERIFICATION"}',
          expectedOutput: '{"cwd_matches_actual_os_cwd": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-01', name: 'Correctness', description: 'Accurately inspects Python version, platform, CWD, and virtualenv status.', weight: 0.45, maxPoints: 45 },
        { id: 'rub-02', name: 'Reasoning', description: 'Uses standard library APIs cleanly without brittle hardcoded string assumptions.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-03', name: 'Architecture', description: 'Handles missing paths, None inputs, and non-existent files gracefully without crashing.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-04', name: 'CodeQuality', description: 'Clean naming, modular structure, docstrings, and type hints.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-05', name: 'Testing', description: 'Passes visible, private edge case, and dynamic integrity test suites.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-06', name: 'Performance', description: 'Runs efficiently and cross-platform without blocking or elevated privileges.', weight: 0.10, maxPoints: 10 },
      ],
    },
  ],
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};

export const DAY_05_ASSESSMENT = DAY_5_ASSESSMENT;

// ── BATCH 001 COMPLETE MANIFEST (5 DAYS) ─────────────────────────────────────
export const BATCH_001_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m1-w1-001',
  batchCode: 'P1-M1-W1-BATCH001',
  title: 'Computing & Developer Foundations (Days 1–5)',
  difficulty: 'BEGINNER',
  days: [
    DAY_1_MANIFEST,
    DAY_2_MANIFEST,
    DAY_3_MANIFEST,
    DAY_4_MANIFEST,
    DAY_5_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};
