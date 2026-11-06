# Script to expand day32, day33, day34, day35 to >= 585 words per part
import json
import os
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

sys.path.append(os.path.join(os.getcwd(), 'scripts'))

from day32_data import d32
from day33_data import d33
from day34_data import d34
from day35_data import d35

# Targeted technical expansions for Day 32
d32_additions = [
    # Part 1 (needs ~50 words)
    [
        "In production observability, JVM Flight Recorder (JFR) records allocation events (jdk.ObjectAllocationInNewTLAB) during Phase 1. When an application generates excessive transient objects, allocation profiling identifies hot call sites that trigger premature garbage collections.",
        "By analyzing memory allocations at the constructor boundary, Principal Engineers tune TLAB sizing flags (-XX:TLABSize and -XX:+ResizeTLAB) to match the thread concurrency profile, eliminating thread synchronization locks during heap allocation."
    ],
    # Part 2 (needs ~160 words)
    [
        "In enterprise microservices architectures, parameterized constructors are often coupled with Bean Validation (JSR 380) annotations like @NotNull, @Positive, and @Size. However, relying purely on framework annotations has a major flaw: annotations are only validated if an external framework interceptor invokes the validator.",
        "If a developer or background worker instantiates the class directly with 'new', the annotations are completely ignored! That is why domain-driven design insists on hardcoded programmatic assertions inside the constructor body itself, ensuring that validation invariants are enforced unconditionally regardless of whether Spring or Jakarta is active.",
        "Furthermore, when constructors throw checked exceptions versus unchecked exceptions, architectural guidelines strongly favor unchecked exceptions (IllegalArgumentException, IllegalStateException). Unchecked exceptions signal catastrophic programming errors that callers cannot meaningfully recover from without fixing the calling code."
    ],
    # Part 3 (needs ~160 words)
    [
        "In addition to parameter shadowing in constructors, shadowing can occur in standard setter methods and nested inner classes. When working inside an anonymous inner class or lambda expression, 'this' refers to the inner class instance rather than the outer enclosing instance. Disambiguating outer state requires qualifying with the outer class name: 'EnclosingClass.this.field'.",
        "Understanding bytecode offsets for 'this' clarifies JVM calling conventions: in every non-static method, the JVM bytecode instruction 'aload_0' pushes 'this' onto the operand stack before executing putfield or getfield. If 'this' is omitted in a shadowed assignment, the bytecode emits 'aload_1' followed by 'astore_1', storing the parameter back into its own local variable slot without touching the heap.",
        "By inspecting bytecode using 'javap -c', engineers verify that assignments target 'putfield' (modifying heap instance state) rather than 'astore' (overwriting local stack frame variables), guaranteeing that parameter shadowing bugs never slip into production releases."
    ],
    # Part 4 (needs ~190 words)
    [
        "In complex domain entities with dozens of optional attributes, constructor chaining can lead to the Telescoping Constructor anti-pattern: writing five, six, or seven overloaded constructors, each adding one more parameter to the chain ('Account(id)', 'Account(id, currency)', 'Account(id, currency, balance)', 'Account(id, currency, balance, limit)').",
        "Telescoping constructors become difficult to read and error-prone when multiple adjacent parameters share the same primitive type, such as three consecutive int or double parameters. In such scenarios, developers can accidentally swap the order of arguments without triggering any compiler type mismatch errors.",
        "To resolve telescoping constructor complexity while preserving constructor chaining invariants, Principal Engineers transition to the Builder Pattern (or Java 17+ Record Compact Constructors). The Builder accumulates optional parameters fluently and passes the validated parameters in a single atomic invocation to a private canonical constructor.",
        "This architectural synthesis guarantees that the object remains immutable and invariant-checked, while client code enjoys a clean, readable, self-documenting construction API that completely eliminates argument swapping defects."
    ],
    # Part 5 (needs ~280 words)
    [
        "In large enterprise repositories containing millions of lines of code, static analysis rules must be calibrated to achieve zero false positives. If a linter rule emits hundreds of false warnings on valid code, developers develop warning fatigue and begin ignoring all linter feedback entirely. Google Error Prone achieves near-zero false positive rates by hooking directly into the javac compiler frontend.",
        "When Error Prone parses an assignment statement within a constructor, it resolves the symbol table bindings for both operands. If both operands point to the exact same VariableSymbol residing in the local method scope, Error Prone flags the AST node with high confidence as a 'SelfAssignment' violation. The build immediately halts with an actionable error message and a suggested diff showing the required 'this.' qualification.",
        "Furthermore, enterprise CI/CD gates pair static AST linting with automated Mutation Testing using tools like PIT (Pitest). Mutation testing deliberately injects synthetic faults into constructor bodies—such as zeroing out parameter assignments or removing 'this.'—and executes the test suite to verify that unit tests immediately detect the defect and fail.",
        "If a unit test suite passes even after a constructor assignment is removed, the mutation test flags the constructor as having surviving mutants, exposing gaps in test coverage. Combining AST static analysis with mutation testing guarantees 100% test efficacy and complete immunity from uninitialized field anomalies across the enterprise codebase."
    ]
]

# Apply additions to d32
for i, adds in enumerate(d32_additions):
    d32["parts"][i]["say"].extend(adds)

# Write out updated day32_data.py
out_path = os.path.join(os.getcwd(), 'scripts', 'day32_data.py')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(f"# Day 32 Full Masterclass Data\nimport json\nimport os\n\noutputs_path = os.path.join(os.getcwd(), 'scripts', 'java_days31_35_outputs.json')\nwith open(outputs_path, 'r', encoding='utf-8') as f:\n    outputs = json.load(f)\n\nd32 = {json.dumps(d32, indent=4)}\n")

print("day32_data.py successfully expanded.")
