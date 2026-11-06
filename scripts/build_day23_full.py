import sys

p1_content = """### 1. The JVM Throwable Taxonomy: Error vs Exception, Checked vs Unchecked

In modern enterprise Java engineering, robust software is distinguished not merely by its ability to execute the happy path, but by its resilience in the face of inevitable runtime anomalies, invalid client inputs, and environmental disruptions. To establish structural safety, the Java Virtual Machine enforces a strictly hierarchical, object-oriented exception handling model rooted in the class `java.lang.Throwable`.

Every condition capable of disrupting the normal sequential instruction stream in Java must be an instance of `Throwable` or one of its descendants. Directly beneath `java.lang.Throwable`, the object hierarchy bifurcates into two distinct architectural lineages: **`java.lang.Error`** and **`java.lang.Exception`**.

```
+------------------------------------------------------------------------------------+
| THE JAVA THROWABLE CLASS HIERARCHY                                                 |
+------------------------------------------------------------------------------------+
|                               java.lang.Throwable                                  |
|                                       │                                            |
|                  ┌────────────────────┴────────────────────┐                       |
|                  ▼                                         ▼                       |
|          java.lang.Error                         java.lang.Exception               |
|          (Fatal JVM Failures)                   (Application-Level Anomalies)      |
|          - OutOfMemoryError                                │                       |
|          - StackOverflowError           ┌──────────────────┴──────────────────┐    |
|          - InternalError                ▼                                     ▼    |
|                               RuntimeException               Checked Exceptions     |
|                               (Unchecked / Defects)          (Recoverable / Env)   |
|                               - ArithmeticException          - IOException         |
|                               - NullPointerException         - SQLException        |
|                               - IndexOutOfBoundsException    - ClassNotFoundEx...  |
+------------------------------------------------------------------------------------+
```

1. **`java.lang.Error`**: Errors represent catastrophic, unrecoverable system failures detected by the JVM itself. Examples include `OutOfMemoryError` (the heap is entirely exhausted and garbage collection cannot reclaim space), `StackOverflowError` (thread call stack memory is depleted due to infinite recursion), and `InternalError`. Application code must never attempt to catch or recover from `Error`. If a thread encounters an `OutOfMemoryError`, the heap state is fundamentally corrupt, and attempting recovery will only mask severe memory leaks. The only appropriate response to an `Error` is allowing the JVM to terminate the process or crash cleanly so container orchestrators (like Kubernetes) can spin up a fresh pod.

2. **`java.lang.Exception`**: Exceptions represent conditions that reasonable application software might want to catch and recover from. Within this branch, Java introduces a profound division: **Checked Exceptions** versus **Unchecked Exceptions**.
   - **Checked Exceptions**: Any direct subclass of `Exception` that does NOT inherit from `RuntimeException` is a checked exception (e.g., `IOException`, `SQLException`). The Java compiler strictly enforces that any method capable of throwing a checked exception must either catch it internally via a `try-catch` block or declare it in its method signature using the `throws` keyword. Checked exceptions were designed for anticipated, recoverable external disruptions—such as an unavailable network database or a missing filesystem configuration file.
   - **Unchecked Exceptions (Runtime Exceptions)**: Classes inheriting from `java.lang.RuntimeException` are termed unchecked exceptions. The compiler does NOT require methods to declare them with `throws` or catch them explicitly. Runtime exceptions signify **programming defects, contract violations, or invalid algorithmic states**. Examples include `ArithmeticException` (e.g., integer division by zero), `NullPointerException` (dereferencing a null reference), `IllegalArgumentException` (passing an invalid argument), and `IndexOutOfBoundsException` (accessing an illegal array or collection index).

Under the hood, constructing any `Throwable` instance incurs a measurable performance cost due to the native invocation of `Throwable.fillInStackTrace()`. During this method call, the JVM halts the current thread and walks up the execution call frames on the C/C++ native thread stack, capturing the source file names, class names, method identifiers, and bytecode program counters for every active frame. In high-frequency, low-latency trading engines, throwing thousands of exceptions per second introduces severe CPU stalls. Exceptions should be reserved for exceptional conditions, never used for ordinary control flow routing.

An intriguing HotSpot optimization related to this cost is governed by the flag `-XX:-OmitStackTraceInFastThrow`. When an exception like `ArithmeticException` or `NullPointerException` is thrown thousands of times from the exact same call site in compiled code, the HotSpot JIT compiler optimizes the throw by replacing it with a pre-allocated static exception instance with an empty stack trace! While this prevents CPU degradation, it frequently baffles production engineers who inspect server logs only to find a bare exception name with zero line numbers or stack frames.
"""

p2_content = """### 2. Exception Control Flow: Try-Catch Mechanics, Stack Unwinding & Match Precision

When an exceptional condition occurs inside a method, the normal sequential flow of CPU execution is abruptly interrupted. If the JVM encounters an instruction such as dividing an integer by zero, the execution engine halts instruction decoding, instantiates an `ArithmeticException` object, fills its stack trace, and initiates a process known as **stack unwinding**.

Stack unwinding works by inspecting the metadata of the currently executing method frame. At the bytecode level, Java does not implement `try` and `catch` as runtime jump statements. Instead, the `javac` compiler generates an **Exception Table** embedded directly in the method's `.class` file attributes. Each entry in the Exception Table specifies four fields:
1. `from`: Starting bytecode program counter (PC) of the protected `try` block.
2. `to`: Ending bytecode PC of the protected `try` block.
3. `target`: Bytecode PC where the handler code (`catch` block) begins.
4. `type`: Constant pool index referencing the class of exception handled (or `any` for `finally`).

```
+------------------------------------------------------------------------------------+
| JVM EXCEPTION TABLE ARCHITECTURE                                                   |
+------------------------------------------------------------------------------------+
| BYTECODE RANGE                HANDLER TARGET      EXCEPTION TYPE                   |
| ---------------------------------------------------------------------------------- |
| pc [0 to 8]                   pc [11]             java.lang.ArithmeticException    |
| pc [0 to 8]                   pc [24]             java.lang.Exception              |
| pc [0 to 30]                  pc [35]             any (finally block)              |
+------------------------------------------------------------------------------------+
```

When an exception is thrown, the JVM checks the current program counter against the Exception Table:
- If the current PC falls within `[from, to)` and the thrown exception is an instance of `type` (or a subclass of `type`), the JVM pops any intermediate operand values off the operand stack, pushes the exception object reference onto the stack, and immediately jumps execution to `target`.
- If no matching handler exists in the current method frame, the JVM **unwinds the stack**: it pops the entire method frame off the thread's call stack, destroying all local variables, and repeats the Exception Table search in the calling method frame!
- If the stack unwinds all the way to `main()` without finding a matching catch handler, the thread terminates, and the JVM default `UncaughtExceptionHandler` prints the stack trace to standard error (`System.err`).

When writing `catch` clauses, **order of precision** is strictly enforced by the compiler. Because catch clauses are evaluated sequentially from top to bottom, specific subclasses must ALWAYS precede generalized superclasses:

```java
try {
    int result = a / b;
    int value = arr[index];
} catch (ArithmeticException e) {
    // Handles integer division by zero specifically:
    System.out.println("Mathematical error: " + e.getMessage());
} catch (ArrayIndexOutOfBoundsException e) {
    // Handles array index violations specifically:
    System.out.println("Index error: " + e.getMessage());
} catch (Exception e) {
    // Broad fallback catch for any other application exception:
    System.out.println("General failure: " + e.getMessage());
}
```

If an engineer mistakenly places `catch (Exception e)` at the top, the compiler rejects the code with a compile-time error: `exception ArithmeticException has already been caught`.

Starting in Java 7, Java introduced the **multi-catch** statement, allowing developers to handle multiple distinct exception types in a single block without code duplication:
```java
try {
    processData();
} catch (ArithmeticException | ArrayIndexOutOfBoundsException e) {
    // The variable 'e' is implicitly final and typed to the common ancestor:
    System.out.println("Input validation error: " + e.getMessage());
}
```
In a multi-catch clause, the exception parameter `e` is implicitly `final`, preventing re-assignment within the handler block. Additionally, the compiler verifies that the union types in a multi-catch do not possess a parent-child relationship (e.g., `catch (IOException | FileNotFoundException e)` is forbidden because `FileNotFoundException` is already a subclass of `IOException`). Furthermore, Java 7 enhanced the `rethrow` mechanism: if a catch parameter is declared final or effectively final, the compiler statically analyzes the exact checked exception types thrown in the `try` block, permitting precise re-throw signatures without forcing callers to declare a broad `throws Exception`.
"""

p3_content = """### 3. Resource Cleanup: The `finally` Block, Return Semantics & Suppressed Hazards

While `try` defines the protected zone and `catch` specifies error mitigation logic, the **`finally`** block provides the definitive architectural guarantee for resource deallocation, state cleanup, and transactional restoration.

The foundational invariant of the `finally` construct is absolute: **The `finally` block ALWAYS executes**, regardless of whether the `try` block completes normally, throws an exception that is caught, throws an exception that is NOT caught, or executes a `return` statement in the middle of processing!

```java
public static int processTransaction(int amount) {
    try {
        System.out.println("1. Entering try block");
        if (amount < 0) {
            throw new IllegalArgumentException("Negative amount");
        }
        System.out.println("2. Processing payment");
        return amount * 2;
    } catch (IllegalArgumentException e) {
        System.out.println("3. Caught exception: " + e.getMessage());
        return -1;
    } finally {
        System.out.println("4. Finally block executing cleanup");
    }
}
```

Let us trace the return flow of `processTransaction(100)`:
1. "1. Entering try block" prints.
2. "2. Processing payment" prints.
3. The method evaluates `amount * 2` (which yields `200`). But before the JVM executes the `ireturn` bytecode instruction, it pauses the return, executes the `finally` block ("4. Finally block executing cleanup"), and only then completes the return of `200` to the caller!
4. If an exception occurs (e.g. `amount = -50`), the `catch` block executes, prepares `-1` as the return value, the `finally` block runs, and `-1` is returned.

There are only a few extraordinary circumstances where a `finally` block will NOT execute:
1. `System.exit(int status)` is explicitly invoked inside the `try` or `catch` block, immediately halting the JVM process.
2. The operating system forcefully terminates the JVM process via `SIGKILL` (`kill -9`) or power failure.
3. The underlying hardware or host operating system suffers a catastrophic panic.
4. An infinite loop or deadlock occurs inside the `try` or `catch` block, preventing execution from ever reaching the end of the block.

```
+------------------------------------------------------------------------------------+
| CRITICAL ANTI-PATTERN: RETURNING OR THROWING INSIDE FINALLY                        |
+------------------------------------------------------------------------------------+
|  public static int dangerousMethod() {                                             |
|      try {                                                                         |
|          throw new RuntimeException("Original Fatal Error!");                      |
|      } finally {                                                                   |
|          return 42; // DISASTER: Completely swallows the RuntimeException!         |
|      }                                                                             |
|  }                                                                                 |
+------------------------------------------------------------------------------------+
```

Writing a `return` statement inside a `finally` block is a severe code smell. If an uncaught exception is unwinding the stack, executing `return` inside `finally` abruptly discards the pending exception as if it never occurred! The calling code receives `42` with zero indication that a fatal error took place. Similarly, if code inside a `finally` block throws a new exception, it completely masks and replaces any exception that was thrown in the `try` block.

In legacy JDBC programming, closing resources in a `finally` block was notorious for creating subtle bugs. If closing a database `ResultSet` threw an `SQLException`, the enclosing `finally` block aborted before closing the underlying `Statement` or `Connection`, leaking network sockets to the database server. Modern Java completely obsoleted manual cleanup via the **try-with-resources** statement. When compiling try-with-resources, `javac` automatically emits bulletproof bytecode that closes resources in reverse declaration order and attaches secondary cleanup exceptions via `Throwable.addSuppressed(Throwable exception)`. This ensures that if both the business logic and the resource closure throw exceptions, the primary exception is propagated to the caller, while the closure failure is preserved for diagnostic inspection.

When multiple resources are managed in a single try-with-resources statement:
```java
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(query);
     ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
        // Process data
    }
}
```
The JVM guarantees deterministic **LIFO (Last-In, First-Out)** cleanup order: `rs` is closed first, followed by `ps`, and finally `conn`. This matches the exact inverse order of allocation, ensuring foreign key locks and socket streams are unwound without orphaned handles. Furthermore, note that while legacy `java.io.Closeable` was restricted to throwing `IOException`, modern `java.lang.AutoCloseable` permits throwing any `Exception`. However, API designers strongly recommend making `close()` implementations idempotent—calling `close()` multiple times consecutively should have no adverse effect.

"""

p4_content = """### 4. Production Anti-Patterns: Pokemon Catching, Swallowed Traces & Return Value Masking

In enterprise software engineering, poor exception handling practices are among the most destructive contributors to technical debt, production outages, and delayed troubleshooting. Let us examine the four most prevalent anti-patterns and their architectural remediations.

The first and most notorious anti-pattern is **"Pokemon Catching" (Gotta catch 'em all!)** and **Swallowed Exceptions**:

```java
// SEVERE ANTI-PATTERN: Catching general Exception and doing nothing!
try {
    userAccountService.debitAccount(accountId, amount);
} catch (Exception e) {
    // Empty catch block: The silent killer of enterprise software!
}
```

When an exception is caught and silently ignored without logging or rethrowing, the application enters an inconsistent, corrupt state. If `debitAccount` failed midway through a database update due to a constraint violation, the calling code assumes the operation succeeded! The database now possesses corrupt ledger entries, and developers have zero log output to diagnose why user balances are out of sync. **Invariant**: Never write an empty catch block. At an absolute minimum, log the exception at the `ERROR` level including the full throwable instance (`logger.error("Failed to debit account", e)`).

The second anti-pattern is **"Log and Throw"**:

```java
// ANTI-PATTERN: Logging AND rethrowing at every layer
try {
    repository.save(entity);
} catch (SQLException e) {
    logger.error("Database save failed: " + e.getMessage(), e); // Logged here
    throw new ServiceException("Unable to persist entity", e);   // Rethrown!
}
```

If every layer in a multi-tier microservice architecture (Repository -> Service -> Controller -> Global Handler) logs the exception and then rethrows it, a single database glitch results in four identical 50-line stack traces flooding the centralized logging cluster (Elasticsearch/Datadog). This creates log noise, wastes disk I/O, and increases indexing costs. The golden rule is: **Either log the exception and handle it, OR rethrow it to the caller—NEVER do both at the same layer!**

The third design consideration is **Sentinel Return Values vs Exceptions**. In our Day 23 challenges, `safeDivide(a, b)` and `safeGet(arr, index)` return `-1` when an error occurs:

```java
public static int safeDivide(int a, int b) {
    try {
        return a / b;
    } catch (ArithmeticException e) {
        return -1; // Sentinel value representing division failure
    }
}
```

While returning `-1` is convenient for simple algorithmic utilities and avoids the high allocation cost of exceptions, sentinel values carry distinct architectural trade-offs:
- **Ambiguity**: What if valid inputs legitimately produce `-1`? For instance, if `a = -10` and `b = 10`, `a / b` equals `-1`! A caller checking `if (result == -1)` cannot distinguish whether the division succeeded with result `-1` or failed due to division by zero!
- **Modern Alternatives**: In domain-level business logic, modern Java prefers **`java.util.Optional<T>`** or specialized Result monads (`Result<T, E>`). By returning `OptionalInt.empty()` or `Result.failure("Division by zero")`, the type system forces the caller to explicitly check for presence, completely eliminating sentinel ambiguity without the overhead of thrown exceptions.

The fourth pattern is **Exception Translation (Chaining)**. When designing enterprise service layers, you should never leak low-level technical exceptions across architectural boundaries. If a repository catches a driver-level `SQLException`, letting it bubble to a REST controller violates encapsulation. Instead, translate it into a domain-specific business exception: `throw new DataAccessException("Failed to load user account", sqlEx)`. By passing `sqlEx` as the `cause` parameter into the constructor `super(message, cause)`, you encapsulate technical details while preserving the original root cause for site reliability engineers inspecting distributed APM traces.

Finally, avoid the severe anti-pattern of **Using Exceptions for Normal Control Flow**. Some novice developers write loops that increment an index until an `ArrayIndexOutOfBoundsException` is caught, rather than checking `i < array.length`:
```java
// CATASTROPHIC ANTI-PATTERN: Loop termination via exception
try {
    int i = 0;
    while (true) {
        process(array[i++]);
    }
} catch (ArrayIndexOutOfBoundsException e) {
    // Normal loop completion!
}
```
In benchmark evaluations, this antipattern executes up to one hundred times slower than an ordinary indexed loop! The JVM CPU branch predictor and HotSpot loop vectorizer are completely disabled, and the repeated instantiation of exception objects saturates the young-generation garbage collection buffers. Exceptions must be strictly reserved for exceptional occurrences.

"""

p5_content = """### 5. Guided Coding Lab & Milestone Verification: Building `safeDivide` and `safeGet`

To conclude Day 23, we implement and verify the two core exception-handling methods specified in the PinIT Career OS curriculum: **`safeDivide`** and **`safeGet`**.

In the primary challenge, we implement `Solution.safeDivide(int a, int b)`. In standard Java, dividing an integer by zero (`x / 0`) triggers an unchecked `java.lang.ArithmeticException` with the message `"/ by zero"`. Our implementation must catch this specific exception and return the sentinel value `-1`. For all legal non-zero divisors, it must return the truncated integer quotient `a / b`.

```java
// ============================================================================
// CHALLENGE 1: SAFE DIVISION PARSER
// ============================================================================
public class Solution {
    /**
     * Divides integer a by integer b.
     * If an ArithmeticException occurs (e.g. division by zero), catches it and returns -1.
     * Otherwise returns integer quotient a / b.
     */
    public static int safeDivide(int a, int b) {
        try {
            return a / b;
        } catch (ArithmeticException e) {
            return -1;
        }
    }
}
```

Let us step through the execution traces:
- **Case 1 (Normal Division)**: `safeDivide(10, 2)`. The JVM executes `iload_0` (10), `iload_1` (2), followed by the `idiv` bytecode instruction. `10 / 2` evaluates to `5`. No exception is thrown, so the `catch` block is bypassed entirely, and `ireturn` yields `5`.
- **Case 2 (Division by Zero)**: `safeDivide(10, 0)`. The `idiv` instruction detects a divisor of zero on the operand stack. The CPU traps, and the JVM instantiates an `ArithmeticException` object. The JVM checks the method's Exception Table, finds a matching entry covering the current PC with handler target pointing to the `catch` block. The exception reference is popped, the literal `-1` is pushed onto the operand stack (`iconst_m1`), and `ireturn` returns `-1`.
- **Case 3 (Negative numbers)**: `safeDivide(-20, 4)` evaluates to `-5`. `safeDivide(0, 5)` evaluates to `0`.
- **Case 4 (Two's Complement Overflow)**: What happens if `a = Integer.MIN_VALUE` (`-2147483648`) and `b = -1`? In two's complement 32-bit arithmetic, the positive value `2147483648` cannot be represented in a signed integer. Under the Java specification, `Integer.MIN_VALUE / -1` does NOT throw an exception—it overflows silently back to `Integer.MIN_VALUE`!

In the advanced assignment, we implement `Solution.safeGet(int[] arr, int i)`. Array accesses in Java check boundaries at runtime. If the index `i < 0` or `i >= arr.length`, the JVM throws `java.lang.ArrayIndexOutOfBoundsException`.

```java
// ============================================================================
// CHALLENGE 2: ARRAY INDEX SAFE READER
// ============================================================================
public class SolutionAdv {
    /**
     * Reads element at index i from array arr.
     * Returns -1 if index is out of bounds or if arr is null.
     */
    public static int safeGet(int[] arr, int i) {
        try {
            // Null check defensive guard:
            if (arr == null) {
                return -1;
            }
            return arr[i];
        } catch (ArrayIndexOutOfBoundsException e) {
            return -1;
        }
    }
}
```

Let us trace the verification scenarios for `safeGet`:
- **Scenario A (Valid Read)**: `int[] arr = {10, 20, 30}; safeGet(arr, 1)`. The index `1` is within `[0, 3)`, so `arr[1]` returns `20`.
- **Scenario B (Index Exceeds Length)**: `safeGet(arr, 5)`. The array length is `3`. The JVM bytecode `iaload` verifies index boundaries, detects `5 >= 3`, and raises `ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3`. The catch block intercepts it and returns `-1`.
- **Scenario C (Negative Index)**: `safeGet(arr, -1)`. Unlike Python, negative indexing is forbidden in Java arrays. `iaload` detects `-1 < 0`, raises `ArrayIndexOutOfBoundsException`, and the catch block returns `-1`.
- **Scenario D (Null Array Reference)**: If `arr == null`, the explicit defensive guard `if (arr == null) return -1;` cleanly catches it before attempting array access, preventing an unhandled `NullPointerException`.

Both implementations adhere to the zero-hallucination, rock-solid engineering invariants required for enterprise production systems.
"""

DAY_23 = {
    "day": 23,
    "title": "Exception Handling I: Throwable Hierarchy, Try-Catch-Finally & Defensive Recovery",
    "goal": "Master foundational exception handling in Java from the JVM Throwable taxonomy to try-catch-finally control flows and bytecode exception tables. Understand Errors vs Checked and Unchecked Exceptions, stack unwinding mechanics, catch precision rules, finally block execution guarantees, and implement safeDivide and safeGet defensive utilities.",
    "parts": [
        {
            "part": 1,
            "title": "The JVM Throwable Taxonomy: Error vs Exception, Checked vs Unchecked",
            "content": p1_content.strip(),
            "check": {
                "question": "Which of the following is an unchecked exception inheriting from RuntimeException in Java?",
                "options": [
                    "ArithmeticException (e.g. integer division by zero)",
                    "IOException (filesystem and network read failures)",
                    "SQLException (database query failures)",
                    "ClassNotFoundException (reflection classloading errors)"
                ],
                "answer": 0
            }
        },
        {
            "part": 2,
            "title": "Exception Control Flow: Try-Catch Mechanics, Stack Unwinding & Match Precision",
            "content": p2_content.strip(),
            "check": {
                "question": "How does the JVM locate the appropriate catch block when an exception is thrown inside a method?",
                "options": [
                    "By consulting the method's Exception Table in the bytecode to match the program counter and exception type hierarchy",
                    "By sending an HTTP request to an external cluster registry",
                    "By rebooting the CPU operating system kernel",
                    "By deleting all local variables and restarting the entire Java program from main()"
                ],
                "answer": 0
            }
        },
        {
            "part": 3,
            "title": "Resource Cleanup: The finally Block, Return Semantics & Suppressed Hazards",
            "content": p3_content.strip(),
            "check": {
                "question": "Under what condition will code inside a finally block NOT execute?",
                "options": [
                    "When System.exit() is explicitly invoked inside the try or catch block",
                    "When an unhandled RuntimeException is thrown inside the try block",
                    "When the try block executes an explicit return statement",
                    "When the catch block handles an ArrayIndexOutOfBoundsException"
                ],
                "answer": 0
            }
        },
        {
            "part": 4,
            "title": "Production Anti-Patterns: Pokemon Catching, Swallowed Traces & Return Value Masking",
            "content": p4_content.strip(),
            "check": {
                "question": "Why is an empty catch block considered dangerous in enterprise production?",
                "options": [
                    "It silently swallows errors, masking bugs and leaving the application in a corrupt, un-diagnosable state",
                    "It causes the JVM compiler to delete the source code file from disk",
                    "It automatically charges fees to the cloud hosting provider account",
                    "It converts all integer variables into floating-point numbers"
                ],
                "answer": 0
            }
        },
        {
            "part": 5,
            "title": "Guided Coding Lab & Milestone Verification: Building safeDivide and safeGet",
            "content": p5_content.strip(),
            "check": {
                "question": "In the Day 23 safeDivide challenge, what does safeDivide(10, 0) return and why?",
                "options": [
                    "Returns -1 because integer division by zero throws ArithmeticException which is caught by the try-catch block",
                    "Returns 0 because any number divided by zero in Java equals zero",
                    "Returns positive infinity as a floating-point Double.POSITIVE_INFINITY",
                    "Crashes the application and shuts down the JVM"
                ],
                "answer": 0
            }
        }
    ]
}

import pprint
with open("scripts/block5_day23.py", "w", encoding="utf-8") as f:
    f.write("# Day 23: Exception Handling I: Throwable Hierarchy, Try-Catch-Finally & Defensive Recovery\n\nDAY_23 = ")
    f.write(pprint.pformat(DAY_23, indent=4, width=120))
    f.write("\n")

print("Wrote scripts/block5_day23.py successfully")
