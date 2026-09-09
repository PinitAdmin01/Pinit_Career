// src/lib/curriculum/pythonFullStack/batch011.ts
// Single Source of Truth for PINIT BATCH 011: Month 3 · Week 11 · Days 51–55
// Automated Testing Foundations, pytest Mechanics & Regression Defense
// Pedagogical Flow: UNDERSTAND (Testing Mindset & pytest Setup) -> APPLY (Exceptions & Parameterization) -> BUILD (Fixtures & Isolated Filesystem) -> DEBUG (Isolation, Monkeypatch & Flaky Tests) -> TRANSFER (Contract-Focused Test Suite Capstone)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  GuidedLabBlock,
  DebuggingChallengeBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_TESTING_FOUNDATIONS = 'comp-pfs-m3-011';

// ── DAY 51: UNDERSTAND — The Testing Mindset, Project Setup & pytest Mechanics ──
export const DAY_51_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w11-011',
  dayNumber: 1,
  title: 'The Testing Mindset, Project Setup & pytest Mechanics',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b11-d51-01',
      type: 'THEORY',
      order: 1,
      title: 'The Testing Mindset: Deterministic Verification vs Ad-Hoc Scripts',
      estimatedMinutes: 18,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand why automated testing is the foundational safety net of professional software engineering, transitioning from manual print debugging to deterministic, automated test suites.',
      whatItIs: 'An automated test is an executable program that runs code under controlled conditions, supplies fixed inputs, and asserts that the actual output matches expected behavioral invariants. The Arrange-Act-Assert (AAA) pattern is the universal standard structure: Arrange sets up test data; Act invokes the code under test; Assert verifies results.',
      whyItExists: 'Manual verification (e.g. running scripts by hand, inspecting print statements) is slow, subjective, unrepeatable, and incapable of detecting regressions across large codebases when changes occur.',
      problemSolved: 'Eliminates regression anxiety and proves that code functions correctly according to a written contract, allowing safe refactoring and continuous feature expansion.',
      mentalModel: 'The Safety Net & Executable Specification: Tests are not bureaucratic overhead; they are living documentation and automated guards. A passing test suite guarantees that previously solved problems remain solved.',
      realWorldUse: 'Verifying business calculations, parsers, algorithms, API endpoints, and configuration loaders in Continuous Integration (CI) pipelines before deploying to production.',
      commonMistakes: [
        'Writing tests that verify internal implementation details rather than observable behavior, making tests brittle during refactoring.',
        'Testing only the "happy path" (ideal valid input) while ignoring boundary conditions, empty inputs, and invalid states.',
        'Putting multiple unrelated actions and assertions in a single test, making failure diagnosis difficult.',
      ],
      commonMisconceptions: [
        'Misconception: "If my code runs without raising an exception when I test it manually once, it is correct." Reality: Manual testing misses edge cases and provides zero protection against future regressions introduced by subsequent changes.',
        'Misconception: "Tests take too much time to write." Reality: Writing automated tests saves hours of manual debugging, reproduction, and defect triage over the lifetime of a project.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b11-d51-02',
      type: 'THEORY',
      order: 2,
      title: 'Project Test Setup, CLI Invocation & AST Introspection',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn how to configure pytest in a Python development environment, discover and run tests, interpret exit codes, and leverage pytest bare assert introspection.',
      whatItIs: 'pytest is the industry-standard Python testing framework. It discovers test files matching `test_*.py` or `*_test.py` and executes functions prefixed with `test_*`. Unlike the built-in `unittest` module which requires inheriting from `TestCase` and calling methods like `self.assertEqual()`, pytest uses Python standard bare `assert` expressions and rewrites the abstract syntax tree (AST) to provide rich diagnostic diffs upon failure.',
      whyItExists: 'Provides a clean, ergonomic, and expressive syntax for writing tests with minimal boilerplate while offering deep failure explanations out of the box.',
      problemSolved: 'Removes the verbosity of class-based testing hierarchies and turns standard Python assertions into clear, readable error reports showing intermediate expression values.',
      mentalModel: 'The Test Runner Pipeline: Project Environment -> pytest Command -> Automatic Discovery (`tests/test_*.py`) -> AST Expression Rewriting -> Execution -> Exit Status Code (0 = All Passed, 1 = Tests Failed, 4 = CLI Usage Error / No Tests Collected).',
      realWorldUse: 'Executing local test suites with `pytest`, targeting individual files (`pytest tests/test_parser.py`), or targeting specific test functions (`pytest tests/test_parser.py::test_empty_input`).',
      commonMistakes: [
        'Naming test files without the `test_` prefix (e.g. `my_tests.py`), causing pytest to skip them during discovery.',
        'Confusing an environment or setup failure (exit code 4 or ImportError) with a test assertion failure (exit code 1).',
        'Using pytest in a different virtual environment than where project dependencies are installed, leading to module resolution errors.',
      ],
      commonMisconceptions: [
        'Misconception: "pytest bare assert only tells you True or False." Reality: Through AST rewriting, pytest prints the exact values of all variables, subexpressions, and differences in sequences when an assertion fails.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b11-d51-03',
      type: 'EXAMPLE',
      order: 3,
      title: 'First Contact with pytest: AAA Structure and Bare Assert',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating a clean unit test file using the Arrange-Act-Assert pattern and pytest bare assert against a pure domain calculation module.',
      language: 'python',
      codeSnippet: `# src/calculator.py
def calculate_discount(price: float, discount_percent: float) -> float:
    """Calculates discounted price. Validates bounds."""
    if price < 0:
        raise ValueError("Price cannot be negative")
    if not (0 <= discount_percent <= 100):
        raise ValueError("Discount must be between 0 and 100")
    return round(price * (1 - discount_percent / 100), 2)


# tests/test_calculator.py
import pytest
from src.calculator import calculate_discount

def test_calculate_discount_standard():
    # 1. Arrange: setup inputs and expected invariant
    original_price = 100.0
    discount = 20.0
    expected_price = 80.0

    # 2. Act: invoke the function under test
    actual_price = calculate_discount(original_price, discount)

    # 3. Assert: verify observable behavior with bare assert
    assert actual_price == expected_price

def test_calculate_discount_zero_percent():
    # Arrange & Act
    result = calculate_discount(50.0, 0.0)

    # Assert
    assert result == 50.0

def test_calculate_discount_full_discount():
    # Arrange & Act
    result = calculate_discount(75.50, 100.0)

    # Assert
    assert result == 0.0
`,
      expectedOutput: `============================= test session starts =============================
collected 3 items

tests/test_calculator.py ...                                             [100%]

============================== 3 passed in 0.02s ==============================`,
    } as ExampleBlock,
    {
      id: 'blk-b11-d51-04',
      type: 'GUIDED_PRACTICE',
      order: 4,
      title: 'Authoring Your First Unit Test Suite with AAA Pattern',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Review the provided `normalize_tag` function that strips whitespace and lowercases hashtag strings.',
        'Write `test_normalize_tag_happy_path` verifying standard inputs like "  Python  " -> "python".',
        'Write `test_normalize_tag_leading_hash` verifying that "#coding" -> "coding".',
        'Write `test_normalize_tag_empty_string` verifying that an empty string returns an empty string "".',
        'Structure each test clearly with Arrange-Act-Assert sections and bare assert expressions.',
      ],
      starterCode: `def normalize_tag(raw_tag: str) -> str:
    cleaned = raw_tag.strip()
    if cleaned.startswith("#"):
        cleaned = cleaned[1:]
    return cleaned.lower()

# TODO: Write test functions matching pytest discovery conventions
def test_normalize_tag_happy_path():
    pass

def test_normalize_tag_leading_hash():
    pass

def test_normalize_tag_empty_string():
    pass
`,
      hints: [
        'Follow Arrange-Act-Assert: prepare the input string, call normalize_tag, and assert result == expected.',
        'Name your test functions clearly so that failure logs immediately communicate what scenario broke.',
      ],
      expectedOutcome: 'Three passing test functions verifying happy path, leading hash removal, and empty string boundary handling.',
      solutionReference: `def test_normalize_tag_happy_path():
    raw = "  Python  "
    result = normalize_tag(raw)
    assert result == "python"

def test_normalize_tag_leading_hash():
    raw = "#Coding"
    result = normalize_tag(raw)
    assert result == "coding"

def test_normalize_tag_empty_string():
    raw = ""
    result = normalize_tag(raw)
    assert result == ""
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b11-d51-05',
      type: 'KNOWLEDGE_CHECK',
      order: 5,
      title: 'Diagnostic Check: pytest Discovery, AST Introspection & Exit Status',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'You execute `pytest tests/test_auth.py` in your terminal. The command returns exit status 1. What does this exit code indicate?',
      options: [
        'pytest is not installed in the current environment or the command syntax is invalid.',
        'All tests in the file were successfully collected and all executed assertions passed.',
        'pytest collected tests successfully, but at least one test assertion or failure occurred.',
        'No tests were found matching the discovery pattern in the specified file.',
      ],
      correctIndex: 2,
      explanation: 'In pytest standard CLI semantics, exit code 0 indicates all tests passed; exit code 1 indicates tests were collected and run, but one or more failed; exit code 4 indicates command-line usage error or no tests were collected. Exit code 1 means tests executed and found defects.',
      misconceptionIdentified: 'Confusing test failure (exit code 1) with environment or configuration unavailability (exit code 4 or shell command-not-found 127).',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 52: APPLY — Testing Exceptions, Failure Modes & Parameterized Tests ──
export const DAY_52_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w11-011',
  dayNumber: 2,
  title: 'Testing Exceptions, Failure Modes & Parameterized Tests',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b11-d52-01',
      type: 'THEORY',
      order: 1,
      title: 'Testing Failure Conditions with pytest.raises',
      estimatedMinutes: 18,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master testing that defensive code raises the expected domain exception when given invalid input, without letting the exception crash the test runner.',
      whatItIs: '`pytest.raises(ExpectedException)` is a context manager that intercepts and verifies that the block of code inside it raises the specified exception class. It can capture the exception instance via `as exc_info` so you can assert specific error messages, attributes, or domain error codes.',
      whyItExists: 'A function that fails silently or returns an incorrect fallback value when given malformed input violates defensive invariants. Testing that exceptions are raised correctly is just as critical as testing success states.',
      problemSolved: 'Allows developers to write automated tests for validation errors and boundary violations while asserting exact error messages.',
      mentalModel: 'The Negative Assertion Trap: Inside `with pytest.raises(ValueError):`, if the code raises `ValueError`, the test succeeds. If the code completes without raising an exception, or raises an unexpected exception type, the test fails.',
      realWorldUse: 'Verifying input validation in parsers, ensuring unauthorized calls raise permission exceptions, and testing configuration loaders with missing required keys.',
      commonMistakes: [
        'Catching `pytest.raises(Exception)` instead of specific domain exceptions (e.g. `KeyError`, `ValueError`), which can mask unintended bugs like `NameError` or `TypeError`.',
        'Placing multiple lines of code inside the `with pytest.raises(...)` context manager, making it unclear which specific line was expected to raise.',
      ],
      commonMisconceptions: [
        'Misconception: "Tests should only test code that succeeds." Reality: Robust applications spend significant logic preventing invalid states. Error pathways must be verified with equal rigor.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b11-d52-02',
      type: 'THEORY',
      order: 2,
      title: 'Parameterized Testing with @pytest.mark.parametrize',
      estimatedMinutes: 18,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Eliminate copy-paste test duplication by parameterizing tests with clear input-output matrix tables.',
      whatItIs: '`@pytest.mark.parametrize` is a decorator that runs a single test function multiple times with different sets of arguments. Each parameter tuple becomes an independent, distinct test case in the pytest test execution report.',
      whyItExists: 'Testing multiple boundary values (e.g. 0, -1, 100, 1000) using separate test functions causes repetitive boilerplate. Testing them in a loop inside a single test stops at the first failure and hides subsequent results.',
      problemSolved: 'Runs every test case independently so that failures in one input set do not prevent testing other inputs, providing clear granular reporting per case.',
      mentalModel: 'The Test Matrix: `@pytest.mark.parametrize("arg1, arg2, expected", [(v1, v2, exp1), (v3, v4, exp2)])` expands one test function into N isolated test executions.',
      realWorldUse: 'Testing mathematical calculations, string normalization tables, validation rule tables, and boundary matrices.',
      commonMistakes: [
        'Misspelling the argument string in `@pytest.mark.parametrize("val, exp", ...)` so it does not match the test function parameter names.',
        'Grouping too many unrelated behavioral scenarios into one parameter table, making test intention obscure.',
      ],
      commonMisconceptions: [
        'Misconception: "Parameterized tests are just a for-loop inside a test." Reality: In a loop, the first failing assertion aborts the entire test; with parametrize, pytest treats each row as a completely isolated test invocation.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b11-d52-03',
      type: 'EXAMPLE',
      order: 3,
      title: 'Exception Assertions and Parameterized Test Matrix',
      estimatedMinutes: 18,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating how to test expected domain exceptions and parameterize clean input-expected tables.',
      language: 'python',
      codeSnippet: `import pytest

def parse_port(port_str: str) -> int:
    """Parses network port string, enforcing 1-65535 range."""
    try:
        val = int(port_str)
    except (ValueError, TypeError):
        raise ValueError(f"Port must be an integer, got '{port_str}'")
    if not (1 <= val <= 65535):
        raise ValueError(f"Port out of valid range (1-65535): {val}")
    return val

# ── 1. Parameterized Happy Path & Boundaries ──
@pytest.mark.parametrize("port_input, expected_port", [
    ("80", 80),
    ("443", 443),
    ("1", 1),         # Lower boundary
    ("65535", 65535), # Upper boundary
    ("8080", 8080),
])
def test_parse_port_valid_inputs(port_input: str, expected_port: int):
    # Act
    actual = parse_port(port_input)
    # Assert
    assert actual == expected_port

# ── 2. Parameterized Error Cases with pytest.raises ──
@pytest.mark.parametrize("invalid_input, error_fragment", [
    ("0", "out of valid range"),
    ("65536", "out of valid range"),
    ("-80", "out of valid range"),
    ("http", "Port must be an integer"),
    ("", "Port must be an integer"),
])
def test_parse_port_invalid_inputs(invalid_input: str, error_fragment: str):
    # Act & Assert
    with pytest.raises(ValueError) as exc_info:
        parse_port(invalid_input)
    assert error_fragment in str(exc_info.value)
`,
      expectedOutput: `tests/test_port.py ..........                                            [100%]
10 passed in 0.03s`,
    } as ExampleBlock,
    {
      id: 'blk-b11-d52-04',
      type: 'GUIDED_PRACTICE',
      order: 4,
      title: 'Refactoring Duplicate Tests into Parameterized Matrix & Exception Checks',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Review the provided `validate_username` function which enforces 3-16 alphanumeric chars.',
        'Refactor the manual repetitive test cases into a single `@pytest.mark.parametrize` table for valid usernames.',
        'Implement an exception test using `@pytest.mark.parametrize` and `pytest.raises(ValueError)` to verify rejection of usernames that are too short, too long, or contain invalid symbols.',
      ],
      starterCode: `import pytest

def validate_username(username: str) -> str:
    if not isinstance(username, str):
        raise TypeError("Username must be a string")
    cleaned = username.strip()
    if len(cleaned) < 3:
        raise ValueError("Username too short (minimum 3 characters)")
    if len(cleaned) > 16:
        raise ValueError("Username too long (maximum 16 characters)")
    if not cleaned.isalnum():
        raise ValueError("Username must contain only letters and numbers")
    return cleaned

# TODO: Write parameterized valid username test
def test_validate_username_valid():
    pass

# TODO: Write parameterized invalid username test asserting ValueError
def test_validate_username_invalid():
    pass
`,
      hints: [
        'Decorate test_validate_username_valid with @pytest.mark.parametrize("raw, expected", [("alice", "alice"), ...]).',
        'In test_validate_username_invalid, use `with pytest.raises(ValueError): validate_username(bad_input)`.',
      ],
      expectedOutcome: 'Clean, parameterized tests covering valid inputs and verifying precise ValueError exceptions for invalid inputs.',
      solutionReference: `@pytest.mark.parametrize("raw, expected", [
    ("alice", "alice"),
    ("  bob123  ", "bob123"),
    ("developer", "developer"),
])
def test_validate_username_valid(raw: str, expected: str):
    assert validate_username(raw) == expected

@pytest.mark.parametrize("invalid_raw, msg_snippet", [
    ("ab", "too short"),
    ("a" * 17, "too long"),
    ("user@name", "only letters and numbers"),
    ("   ", "too short"),
])
def test_validate_username_invalid(invalid_raw: str, msg_snippet: str):
    with pytest.raises(ValueError) as exc_info:
        validate_username(invalid_raw)
    assert msg_snippet in str(exc_info.value)
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b11-d52-05',
      type: 'KNOWLEDGE_CHECK',
      order: 5,
      title: 'Diagnostic Check: Test Failure vs Test Error',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In a pytest test run, Test A prints "FAILED (assert 5 == 10)" and Test B prints "ERROR (ZeroDivisionError: division by zero in setup)". What is the fundamental difference?',
      options: [
        'Test A failed because the test file was corrupt; Test B failed because the test runner timed out.',
        'Test A is a test failure (the code ran and an assertion disproved expected behavior); Test B is a test error (an unexpected crash occurred before or during test execution, such as during fixture setup).',
        'Both indicate identical outcomes and pytest treats them with the exact same reporting category.',
        'Test A failed on a happy path; Test B failed because pytest.raises was called incorrectly.',
      ],
      correctIndex: 1,
      explanation: 'In testing taxonomy, a "Failure" occurs when the code runs to completion but an assertion fails (actual != expected). An "Error" occurs when an unhandled exception crashes the test runner before assertions can evaluate (e.g. broken import, setup crash, missing variable).',
      misconceptionIdentified: 'Believing that assertion failures and unhandled runtime crashes in test setup represent the same category of testing problem.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 53: BUILD — Fixtures, Test Setup & State Management ───────────────────
export const DAY_53_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w11-011',
  dayNumber: 3,
  title: 'Fixtures, Test Setup & State Management',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b11-d53-01',
      type: 'THEORY',
      order: 1,
      title: 'Reusable Test Setup with @pytest.fixture',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn how fixtures provide reusable test setup and dependencies to test functions cleanly without repetitive boilerplate or inheritance.',
      whatItIs: 'A fixture is a function decorated with `@pytest.fixture` that prepares and provides data, configuration, or state to test functions. Test functions request a fixture by declaring its name as a parameter in their signature. pytest automatically resolves and invokes the fixture before running the test.',
      whyItExists: 'Without fixtures, tests duplicate setup code (e.g. creating sample objects, mock records, config dictionaries). If setup logic changes, dozens of tests break.',
      problemSolved: 'Centralizes test setup logic, guarantees a fresh instance per test by default, and separates setup code from test assertions.',
      mentalModel: 'Dependency Provider: Fixtures supply clean, fresh instances to test functions. The test function declares: "I need `sample_user`," and pytest provides it.',
      realWorldUse: 'Providing authenticated user objects, sample inventory items, pre-populated database models, or API client configurations to test suites.',
      commonMistakes: [
        'Mutating a fixture object in one test and assuming another test will get the mutated state (fixtures are recreated per test by default to maintain isolation).',
        'Calling fixture functions directly like `my_fixture()` instead of passing them as function parameters to the test.',
      ],
      commonMisconceptions: [
        'Misconception: "Fixtures are just global variables." Reality: Global variables leak mutable state between tests; fixtures provide controlled, isolated setup and teardown per test function.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b11-d53-02',
      type: 'THEORY',
      order: 2,
      title: 'conftest.py and the tmp_path Filesystem Fixture',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Share fixtures across multiple test modules using conftest.py and isolate filesystem tests using the built-in tmp_path fixture.',
      whatItIs: '`conftest.py` is a special pytest file recognized automatically across a directory tree. Fixtures defined in `conftest.py` are globally available to all tests in that directory without needing explicit `import` statements. `tmp_path` is a built-in pytest fixture that provides a unique, temporary `pathlib.Path` directory for each test function.',
      whyItExists: 'Testing code that reads or writes files (e.g. JSON, CSV, logs) with hardcoded file paths causes test pollution, race conditions, and left-over clutter on the host disk.',
      problemSolved: '`tmp_path` creates a completely isolated sandbox directory per test function that is cleaned up automatically, ensuring file operations cannot collide across tests.',
      mentalModel: 'The Isolated Workspace: Every test requesting `tmp_path` receives its own fresh temporary directory. It can create files, read them, modify them, and delete them without affecting other tests or the repository root.',
      realWorldUse: 'Testing file parsers, CSV export utilities, configuration writers, and file-based caching systems.',
      commonMistakes: [
        'Importing fixtures from `conftest.py` explicitly with `from conftest import my_fixture` (pytest discovers `conftest.py` automatically; importing it manually causes registration warnings).',
        'Using hardcoded paths like `"./data/test.json"` instead of `tmp_path / "test.json"`.',
      ],
      commonMisconceptions: [
        'Misconception: "I need to manually write teardown code to delete files in tmp_path." Reality: pytest manages temporary directory lifecycle and keeps the host filesystem clean.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b11-d53-03',
      type: 'EXAMPLE',
      order: 3,
      title: 'Building File Tests with tmp_path and conftest Fixtures',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating how to define shared fixtures and test file reading/writing using pytest built-in tmp_path.',
      language: 'python',
      codeSnippet: `# src/report_saver.py
import json
from pathlib import Path

def save_audit_summary(filepath: Path, service_name: str, score: float) -> int:
    """Writes audit record to JSON file. Returns bytes written."""
    if score < 0 or score > 100:
        raise ValueError("Score must be between 0 and 100")
    payload = {"service": service_name, "score": score, "verified": True}
    filepath.parent.mkdir(parents=True, exist_ok=True)
    content = json.dumps(payload, indent=2)
    filepath.write_text(content, encoding="utf-8")
    return len(content)


# tests/test_report_saver.py
import json
from pathlib import Path
import pytest
from src.report_saver import save_audit_summary

@pytest.fixture
def valid_service_name() -> str:
    return "payment-gateway"

def test_save_audit_summary_creates_file(tmp_path: Path, valid_service_name: str):
    # Arrange: use tmp_path to construct an isolated destination
    target_file = tmp_path / "reports" / "summary.json"

    # Act
    bytes_written = save_audit_summary(target_file, valid_service_name, 98.5)

    # Assert: verify file exists, bytes written > 0, and JSON content matches
    assert target_file.exists()
    assert bytes_written > 0
    
    saved_data = json.loads(target_file.read_text(encoding="utf-8"))
    assert saved_data["service"] == "payment-gateway"
    assert saved_data["score"] == 98.5
    assert saved_data["verified"] is True
`,
      expectedOutput: `tests/test_report_saver.py .                                             [100%]
1 passed in 0.02s`,
    } as ExampleBlock,
    {
      id: 'blk-b11-d53-04',
      type: 'GUIDED_LAB',
      order: 4,
      title: 'Constructing a Modular Test Harness with Fixtures & tmp_path',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a robust test harness for an inventory CSV reader using custom fixtures and tmp_path filesystem isolation.',
      instructions: [
        'Implement an `inventory_csv_content` fixture providing a valid 3-row CSV string.',
        'Write a test `test_load_inventory_csv` that writes the fixture content to a file in `tmp_path` and verifies that `load_inventory_csv` returns 3 parsed dictionaries.',
        'Write a test `test_load_inventory_missing_file` verifying that a non-existent file path raises `FileNotFoundError`.',
      ],
      starterFiles: {
        'src/inventory_loader.py': `import csv
from pathlib import Path
from typing import List, Dict

def load_inventory_csv(filepath: Path) -> List[Dict[str, str]]:
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)
`,
        'tests/test_inventory_loader.py': `import pytest
from pathlib import Path
from src.inventory_loader import load_inventory_csv

# TODO: Define inventory_csv_content fixture
@pytest.fixture
def inventory_csv_content() -> str:
    pass

# TODO: Implement test using tmp_path and the fixture
def test_load_inventory_csv(tmp_path: Path, inventory_csv_content: str):
    pass

def test_load_inventory_missing_file(tmp_path: Path):
    pass
`,
      },
      expectedBehavior: 'All tests pass using isolated tmp_path without writing files to project root.',
    } as GuidedLabBlock,
    {
      id: 'blk-b11-d53-05',
      type: 'REFLECTION',
      order: 5,
      title: 'The Cost of Shared Mutable State',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why is sharing a single static test file (e.g. `test_data.csv`) committed to git dangerous for a test suite compared to generating dynamic files via `tmp_path`?',
      guidingQuestions: [
        'What happens when two tests run in parallel or in reverse order if one test modifies the file?',
        'How does hardcoding file paths create environment-specific bugs (e.g. Windows vs Linux permissions)?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 54: DEBUG — Test Isolation, Mocking & Flaky Test Diagnostics ──────────
export const DAY_54_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w11-011',
  dayNumber: 4,
  title: 'Test Isolation, Mocking & Flaky Test Diagnostics',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b11-d54-01',
      type: 'THEORY',
      order: 1,
      title: 'The Law of Test Isolation and Flaky Test Anatomy',
      estimatedMinutes: 18,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand the causes of flaky, order-dependent test failures and how to enforce absolute test isolation.',
      whatItIs: 'A flaky test is a test that intermittently passes and fails on identical source code without any logic changes. The Law of Test Isolation states: every test must be completely independent; it must pass or fail whether executed in isolation, first, last, or in reverse order.',
      whyItExists: 'Flaky tests erode team trust in automated testing. When engineers ignore failing tests because "it always fails sometimes," real production defects slip through.',
      problemSolved: 'Diagnoses hidden state leaks (global dictionaries, unreset module variables, environment variables, floating-point rounding) and eliminates order-dependent coupling.',
      mentalModel: 'The Clean Slate Rule: A test must assume nothing about what ran before it and must clean up any temporary external mutations so subsequent tests start with a clean slate.',
      realWorldUse: 'Preventing CI build failures caused by tests leaking environment variables or modifying global state.',
      commonMistakes: [
        'Using direct equality (`assert actual == 0.1 + 0.2`) on floating point numbers instead of `assert actual == pytest.approx(0.3)`.',
        'Mutating `os.environ` directly in test code without cleaning up, breaking later tests.',
      ],
      commonMisconceptions: [
        'Misconception: "pytest randomly shuffles test order natively by default." Reality: Standard pytest executes tests sequentially in the order they are defined in files. Reproducing order-dependent failures requires a controlled test-order mechanism or an approved test-order plugin (an optional testing tool, not a core language feature).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b11-d54-02',
      type: 'THEORY',
      order: 2,
      title: 'Safe Environment & Attribute Patching with monkeypatch',
      estimatedMinutes: 18,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Use the built-in monkeypatch fixture to safely override environment variables and functions with automatic per-test cleanup.',
      whatItIs: '`monkeypatch` is a built-in pytest fixture that provides safe utilities (`setenv`, `delenv`, `setattr`, `delattr`) to temporarily modify environment variables, dictionary keys, or function attributes during a test. When the test finishes, `monkeypatch` automatically reverses all modifications.',
      whyItExists: 'Testing code that reads environment variables (like `APP_ENV` or `DATABASE_URL`) by mutating `os.environ` directly leaves mutated values for subsequent tests.',
      problemSolved: 'Guarantees that environment overrides exist only for the duration of a single test function, preventing cross-test pollution.',
      mentalModel: 'The Temporary Lens: `monkeypatch.setenv("ENV", "staging")` puts on a temporary lens for this test only. The moment the test completes (pass or fail), the lens is removed and the original environment is restored.',
      realWorldUse: 'Testing configuration loaders under different environments (dev vs staging vs prod) and testing fallback logic when an environment variable is absent.',
      commonMistakes: [
        'Assigning to `os.environ["VAR"] = "val"` directly inside a test instead of using `monkeypatch.setenv("VAR", "val")`.',
        'Over-mocking business logic so that tests pass against artificial mock behavior while real production code fails.',
      ],
      commonMisconceptions: [
        'Misconception: "monkeypatch persists changes across the test session." Reality: monkeypatch fixtures are strictly function-scoped; all modifications are undone immediately after the test returns.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b11-d54-03',
      type: 'EXAMPLE',
      order: 3,
      title: 'Safe Configuration Testing with monkeypatch and pytest.approx',
      estimatedMinutes: 18,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating how to test environment-dependent configuration and floating-point computations safely.',
      language: 'python',
      codeSnippet: `import os
import pytest

def get_app_timeout() -> float:
    """Reads timeout from environment with default."""
    raw = os.getenv("APP_TIMEOUT_SECONDS", "30.0")
    try:
        val = float(raw)
    except ValueError:
        raise ValueError(f"Invalid timeout: {raw}")
    if val <= 0:
        raise ValueError("Timeout must be positive")
    return val

def calculate_tax(amount: float, tax_rate: float) -> float:
    return amount * tax_rate

# ── 1. monkeypatch: Environment Override Testing ──
def test_get_app_timeout_custom_env(monkeypatch: pytest.MonkeyPatch):
    # Arrange: set temporary environment variable
    monkeypatch.setenv("APP_TIMEOUT_SECONDS", "45.5")

    # Act
    timeout = get_app_timeout()

    # Assert
    assert timeout == 45.5

def test_get_app_timeout_default(monkeypatch: pytest.MonkeyPatch):
    # Arrange: ensure variable is deleted for this test
    monkeypatch.delenv("APP_TIMEOUT_SECONDS", raising=False)

    # Act & Assert
    assert get_app_timeout() == 30.0

# ── 2. Floating-Point Precision Testing with pytest.approx ──
def test_calculate_tax_floating_precision():
    # 0.1 * 3 in binary floating point is 0.30000000000000004
    actual = calculate_tax(0.1, 3.0)
    
    # Bare assert actual == 0.3 can fail due to precision; approx handles it safely
    assert actual == pytest.approx(0.3)
`,
      expectedOutput: `tests/test_config.py ...                                                 [100%]
3 passed in 0.02s`,
    } as ExampleBlock,
    {
      id: 'blk-b11-d54-04',
      type: 'DEBUGGING_CHALLENGE',
      order: 4,
      title: 'Diagnosing a Leaky Global State and Order-Dependent Flaky Suite',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'INTERMEDIATE',
      targetCompetencyId: COMPETENCY_ID_TESTING_FOUNDATIONS,
      problemDescription: 'A test suite passes when run together in default order, but `test_load_production_config` fails with an unexpected KeyError or invalid value when run alone or in reverse order.',
      symptom: 'Running `pytest tests/test_broken.py` passes, but running `pytest tests/test_broken.py::test_load_production_config` fails because it relied on `test_load_dev_config` having run first and left an uncleaned environment variable.',
      brokenArtifact: `import os
import pytest

def load_database_url() -> str:
    env = os.getenv("APP_ENV", "development")
    if env == "production":
        return os.environ["DATABASE_PROD_URL"]
    return "sqlite:///dev.db"

# BUGGY SUITE: Mutates os.environ directly without cleanup!
def test_load_dev_config():
    os.environ["APP_ENV"] = "development"
    assert load_database_url() == "sqlite:///dev.db"

def test_load_production_config():
    # Relies on someone else having set or not set env, but sets prod URL directly
    os.environ["APP_ENV"] = "production"
    os.environ["DATABASE_PROD_URL"] = "postgresql://prod:5432/db"
    assert load_database_url() == "postgresql://prod:5432/db"

def test_fallback_when_no_env():
    # FAILS if test_load_production_config ran right before it!
    # os.environ["APP_ENV"] still contains "production", causing KeyError!
    assert load_database_url() == "sqlite:///dev.db"
`,
      expectedBehavior: 'All three tests pass independently and in any execution order by using the monkeypatch fixture for all environment mutations.',
      hints: [
        'Replace all direct assignments to `os.environ` with `monkeypatch.setenv()`.',
        'In `test_fallback_when_no_env`, use `monkeypatch.delenv("APP_ENV", raising=False)` to guarantee a clean slate.',
      ],
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 55: TRANSFER — Comprehensive Test Suite & Regression Defense Capstone ─
export const DAY_55_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w11-011',
  dayNumber: 5,
  title: 'Comprehensive Test Suite & Regression Defense Capstone',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b11-d55-01',
      type: 'THEORY',
      order: 1,
      title: 'Comprehensive Contract-Focused Testing: Behavior over Blind Line Coverage',
      estimatedMinutes: 18,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn why high line coverage alone does not guarantee correctness, and master writing contract-focused test suites that systematically verify observable behavior, boundary conditions, and defensive error pathways.',
      whatItIs: 'Contract-focused testing treats code as an implementation of a strict behavioral specification: given valid inputs in state S, produce expected output O; given invalid inputs or state violations, fail deterministically with domain error E. Code coverage measures which lines were executed during a test run, but 100% line coverage can easily be achieved with zero meaningful assertions.',
      whyItExists: 'Engineers who rely purely on coverage targets often write superficial tests that execute code without asserting boundary outputs, leading to false confidence.',
      problemSolved: 'Refocuses testing on behavioral contracts, critical edge cases, and regression defense rather than bureaucratic line-counting metrics.',
      mentalModel: 'The Behavioral Contract: Test what the code is promised to do, not how many lines it takes to do it. Verify success boundaries, verify failure contracts, and verify state integrity.',
      realWorldUse: 'Designing complete automated regression suites for enterprise business engines, parsers, and financial transaction processors.',
      commonMistakes: [
        'Writing tests that assert trivial invariants (like `assert result is not None`) instead of verifying exact values and boundary states.',
        'Neglecting error branches that protect downstream systems from corrupt data.',
      ],
      commonMisconceptions: [
        'Misconception: "If my test coverage is 100%, my application has zero bugs." Reality: Code coverage only tracks execution, not assertions. Tests must explicitly assert correct behavior across edge cases to detect defects.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b11-d55-02',
      type: 'TRANSFER_CHALLENGE',
      order: 2,
      title: 'The Resilient File Ingestion & Metrics Engine Test Suite',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'INTERMEDIATE',
      timeExpectationMinutes: 60,
      targetCompetencyId: COMPETENCY_ID_TESTING_FOUNDATIONS,
      unfamiliarDomainContext: 'Telemetric Data Ingestion & Batch Error Rate Analytics Engine',
      task: 'You are delivered an existing telemetric ingestion engine (`TelemetricEngine`) with 3 seeded defects firmly within existing prerequisite boundaries. You must write a comprehensive contract-focused test suite that verifies the behavioral contract, surfaces the 3 defects through failing tests, and patches the application so all tests pass cleanly.',
      constraints: [
        'Follow Arrange-Act-Assert structure in every test.',
        'Use @pytest.mark.parametrize for boundary value testing.',
        'Use pytest.raises to verify defensive error pathways (e.g. malformed files, invalid config).',
        'Use the tmp_path fixture for all file operations — no hardcoded or permanent files on disk.',
        'Use monkeypatch for environment variable overrides — no direct os.environ mutations.',
        'Student success criterion: The student must implement tests that correctly encode the supplied behavioral contract, detect the seeded defects, cover required boundary/error cases, and achieve a passing suite.',
      ],
      starterArtifact: `# telemetric_engine.py
import json
import os
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Any

class IngestionError(Exception):
    """Raised when telemetric data cannot be ingested or validated."""
    pass

@dataclass(frozen=True)
class TelemetricMetric:
    service: str
    total_requests: int
    failed_requests: int
    error_rate: float

class TelemetricEngine:
    def __init__(self, config_dir: Path):
        self.config_dir = config_dir

    def calculate_error_rate(self, total: int, failed: int) -> float:
        """Calculates error rate percentage: (failed / total) * 100."""
        # DEFECT 1: ZeroDivisionError crash when total is 0 instead of returning 0.0
        return (failed / total) * 100.0

    def ingest_payload(self, filepath: Path) -> List[TelemetricMetric]:
        """Reads JSON payload from filepath, validates fields, returns metrics."""
        # DEFECT 2: Relative path without validation crashes if file does not exist
        if not filepath.exists():
            raise IngestionError(f"Telemetry file not found: {filepath}")
            
        raw_text = filepath.read_text(encoding="utf-8")
        
        # DEFECT 3: Malformed JSON swallowed or crashes with json.JSONDecodeError 
        # instead of raising domain IngestionError
        data = json.loads(raw_text)
        
        results = []
        for item in data.get("records", []):
            svc = item.get("service", "unknown")
            tot = int(item.get("total", 0))
            fail = int(item.get("failed", 0))
            rate = self.calculate_error_rate(tot, fail)
            results.append(TelemetricMetric(service=svc, total_requests=tot, failed_requests=fail, error_rate=rate))
        return results
`,
    } as TransferChallengeBlock,
    {
      id: 'blk-b11-d55-03',
      type: 'REFERENCE',
      order: 3,
      title: 'pytest Developer Reference & Command Cheat Sheet',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        { title: 'pytest Official Documentation', url: 'https://docs.pytest.org/en/stable/' },
        { title: 'pytest Built-in Fixtures Guide', url: 'https://docs.pytest.org/en/stable/how-to/fixtures.html' },
      ],
      documentationExtracts: [
        'CLI Flags: `pytest -v` (verbose), `pytest -x` (stop at first failure), `pytest -k "name"` (filter by test name), `pytest --tb=short` (concise tracebacks).',
        'Directory Structure: Store application source in `src/` and tests in `tests/`. pytest automatically discovers `tests/test_*.py`.',
        'Assertions: Use standard Python expressions `assert a == b`. pytest inspects and pretty-prints diffs automatically.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 55 ASSESSMENT: Formative Assessment for Batch 011 ────────────────────
export const DAY_55_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m3-w11-011',
  assessmentCode: 'ASM-PFS-M3-W11-TEST',
  title: 'Formative Assessment: Automated Testing Foundations, pytest Fixtures & Regression Defense',
  description: 'Demonstrate competency in writing deterministic pytest suites: Arrange-Act-Assert structure, parameterized boundary testing, exception validation with pytest.raises, tmp_path filesystem isolation, monkeypatch environment safety, and contract-focused regression defense.',
  type: 'TRANSFER',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  targetCompetencyId: COMPETENCY_ID_TESTING_FOUNDATIONS,
  difficulty: 'INTERMEDIATE',
  passingScore: 80,
  timeLimitMinutes: 65,
  attemptPolicy: 'UNLIMITED',
  maxAttempts: 0,
  items: [
    {
      id: 'item-asm-b11-d55-01',
      assessmentId: 'asm-pfs-m3-w11-011',
      version: '1.0.0',
      itemType: 'TRANSFER',
      prompt: 'Implement a comprehensive pytest suite and patched application for the TelemetricEngine. Your tests must detect the 3 seeded defects, verify behavioral boundaries, and pass cleanly upon patching the defects.',
      points: 100,
      order: 1,
      timeEstimateMinutes: 65,
      starterCode: `# Write your comprehensive test suite in tests/test_telemetric_engine.py
# Verify:
# 1. Error rate calculation including total=0 boundary (returns 0.0)
# 2. Parameterized error rate calculation across valid ratios
# 3. Malformed JSON handling raises IngestionError with descriptive message
# 4. Missing file raises IngestionError
# 5. File ingestion parsing valid JSON via tmp_path fixture
`,
      visibleTests: [
        {
          id: 'vt-test-01',
          name: 'Error Rate Zero Division Boundary Check',
          input: '{"action": "test_zero_division", "total": 0, "failed": 0}',
          expectedOutput: '{"status": "PASS", "rate": 0.0}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-test-02',
          name: 'Malformed JSON Ingestion Raises IngestionError',
          input: '{"action": "test_malformed_json", "content": "{malformed json"}',
          expectedOutput: '{"status": "PASS", "error_raised": "IngestionError"}',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-test-01',
          name: 'Parameterized Rate Calculation Matrix',
          input: '{"action": "test_rate_matrix", "cases": [[100, 5, 5.0], [200, 50, 25.0], [50, 50, 100.0]]}',
          expectedOutput: '{"status": "PASS", "all_cases_verified": true}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-test-02',
          name: 'Isolated Filesystem Ingestion via tmp_path',
          input: '{"action": "test_tmp_path_ingest", "records": [{"service": "auth", "total": 100, "failed": 2}]}',
          expectedOutput: '{"status": "PASS", "records_parsed": 1, "service": "auth", "error_rate": 2.0}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-test-03',
          name: 'Missing Telemetry File Raises IngestionError',
          input: '{"action": "test_missing_file", "filename": "non_existent.json"}',
          expectedOutput: '{"status": "PASS", "error_raised": "IngestionError"}',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-test-01',
          name: 'Anti-Hardcoding Dynamic Assertion Evaluation Probe',
          input: '{"probe_vector": "DYNAMIC_PYTEST_VERIFICATION_PROBE"}',
          expectedOutput: '{"dynamically_verified": true, "no_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-b11-01', name: 'FunctionalCorrectness', description: 'Accurately encodes behavioral contracts and achieves clean test execution across all cases.', weight: 0.25, maxPoints: 25 },
        { id: 'rub-b11-02', name: 'Testing', description: 'Uses AAA pattern, parameterized tests with @pytest.mark.parametrize, and bare asserts with clear diagnostic feedback.', weight: 0.20, maxPoints: 20 },
        { id: 'rub-b11-03', name: 'ErrorHandling', description: 'Verifies defensive error pathways with pytest.raises, inspecting domain exception classes and error messages.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-b11-04', name: 'DebuggingDiagnostics', description: 'Surfaces all 3 seeded defects through failing tests and patches application code cleanly.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-b11-05', name: 'EdgeCaseRobustness', description: 'Systematically tests boundary conditions including zero total records, empty sets, and missing files.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-b11-06', name: 'CodeQualityMaintainability', description: 'Structures test modules cleanly, leveraging tmp_path and monkeypatch without global state leakage.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-b11-07', name: 'Reasoning', description: 'Understands and defends why contract-focused testing is superior to blind line-coverage metrics.', weight: 0.05, maxPoints: 5 },
      ],
    },
  ],
  createdAt: '2026-09-05T00:00:00.000Z',
  updatedAt: '2026-09-05T00:00:00.000Z',
};

// ── BATCH 011 COMPLETE MANIFEST (DAYS 51–55) ─────────────────────────────────
export const BATCH_011_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m3-w11-011',
  batchCode: 'P1-M3-W11-BATCH011',
  title: 'Automated Testing Foundations, pytest Mechanics & Regression Defense (Days 51–55)',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_51_MANIFEST,
    DAY_52_MANIFEST,
    DAY_53_MANIFEST,
    DAY_54_MANIFEST,
    DAY_55_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-05T00:00:00.000Z',
  updatedAt: '2026-09-05T00:00:00.000Z',
};
