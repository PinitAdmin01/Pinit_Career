import sys
import pprint

p1_content = """### 1. Defensive Programming & Fail-Fast Architecture: Preconditions and Invariant Enforcement

In high-reliability enterprise systems, software defects rarely manifest at the exact origin of corrupt state. Instead, invalid inputs, unvetted null references, or out-of-range numerical parameters often slip undetected through multiple architectural tiers—crossing microservices, mutating cache stores, and corrupting relational database tables—before finally erupting as catastrophic failures hours or days later. To prevent this insidious delayed corruption, professional Java architects adhere to the **Fail-Fast Principle**.

The Fail-Fast principle states: **Validate all inputs immediately upon entry, and halt execution the instant an illegal condition or contract breach is detected.** Rather than attempting to guess a user's intent or tolerating invalid states by silently defaulting to zero or empty strings, a resilient system raises an explicit, unambiguous exception at the earliest possible boundary. This protects the internal state of the system from corruption and produces clear stack traces pinpointing the exact offending caller.

```
+------------------------------------------------------------------------------------+
| FAIL-FAST BOUNDARY VALIDATION vs SILENT CORRUPTION PROPAGATION                     |
+------------------------------------------------------------------------------------+
| SILENT PROPAGATION (ANTI-PATTERN):                                                 |
| [Client sends amt = -500] ──► [Service ignores invalid input] ──► [Ledger updated]  |
|                                                                    │                |
|                                         CORRUPT BALANCE COMMITTED ◄┘                |
+------------------------------------------------------------------------------------+
| FAIL-FAST VALIDATION (ENTERPRISE STANDARD):                                        |
| [Client sends amt = -500] ──► [Boundary Guard: if (amt <= 0) throw ...]            |
|                                     │                                              |
|                                     ▼                                              |
|                       [IllegalArgumentException thrown]                            |
|                       [Execution halts; DB untouched; HTTP 400 Bad Request returned]|
+------------------------------------------------------------------------------------+
```

The theoretical foundation of this approach originates in Bertrand Meyer's **Design by Contract (DbC)** model, which partitions software guarantees into three categories:
1. **Preconditions**: Requirements that the caller must satisfy before invoking a routine (e.g., "the deposit amount must be strictly greater than zero", "the user age must not be negative"). If a precondition is violated, the method refuses to proceed and immediately throws an exception.
2. **Postconditions**: Guarantees that the method promises to deliver upon successful completion (e.g., "the account balance will increase by exactly the deposited amount").
3. **Class Invariants**: Universal truths regarding an object's internal state that must remain true throughout its entire existence (e.g., "an account's balance must never fall below its overdraft limit").

To enforce preconditions, the Java standard library provides standard runtime exceptions:
- **`java.lang.IllegalArgumentException`**: The method caller passed an illegal or inappropriate argument (such as a negative deposit amount, an invalid enum string, or an out-of-range percentage).
- **`java.lang.IllegalStateException`**: The arguments may be valid, but the target object is currently in an inappropriate state to process the request (e.g., calling `connection.send()` when the socket is closed, or attempting to deposit money into a frozen bank account).
- **`java.lang.NullPointerException`**: An argument is null when the method contract strictly requires a non-null reference.
- **`java.lang.IndexOutOfBoundsException`**: An array or collection index lies outside the valid range `[0, size - 1]`.

By consistently throwing `IllegalArgumentException` on invalid arguments, you turn silent bugs into noisy, deterministic, easily remediated runtime failures.

A foundational architectural question in enterprise software is: where should defensive checks be placed? A common rule of thumb is:
1. **Public API Boundaries**: Every public and protected method in an enterprise service or domain entity must assume that input could be malicious or malformed. Defensive preconditions must be rigorously enforced at every public boundary.
2. **Internal Private Helpers**: Within private helper methods inside an internal package, excessive defensive validation can lead to redundant checks. If a public method has already proven that `amt > 0`, re-checking `amt > 0` across five private helper methods introduces unnecessary branch instructions.
3. **Hardware & JIT Compiler Synergy**: Modern HotSpot JIT compilers are remarkably adept at optimizing defensive checks. When an `if (amt <= 0) throw new IllegalArgumentException(...)` branch is rarely taken in production, the JIT compiler marks the throw branch as **cold code**. It rearranges the compiled machine code so that the happy path executes as a straight-line sequence of CPU instructions with zero pipeline stalls, while the exception instantiation code is relocated to an out-of-line memory cache line. Thus, fail-fast defensive guards provide maximum security with virtually zero steady-state performance overhead.

"""

p2_content = """### 2. The `throw` Keyword vs `throws` Clause: Syntactic and Bytecode Contrasts

In the Java syntax grammar, the words **`throw`** and **`throws`** sound almost identical, yet they serve entirely different purposes at both the compiler language level and the JVM bytecode execution level. Confusing the two is a classic stumbling block for developing engineers.

The **`throw` keyword** is an **imperative execution statement**. It instructs the JVM to actively construct and raise an exception instance at runtime. The syntax requires an instance of `java.lang.Throwable` (or any subclass) immediately following the keyword:

```java
public static void validateDeposit(int amt) {
    if (amt <= 0) {
        throw new IllegalArgumentException("Deposit amount must be positive: " + amt);
    }
}
```

When the `javac` compiler translates a `throw` statement into bytecode, it emits the **`athrow`** instruction. The `athrow` instruction operates as follows:
1. It pops the object reference pointing to the instantiated `Throwable` off the operand stack.
2. It verifies that the object reference is non-null (if it is null, the JVM throws a `NullPointerException` instead!).
3. It inspects the method's Exception Table to locate an enclosing `catch` handler that matches the exception type.
4. If no local catch block matches, the current stack frame is destroyed, and the exception begins unwinding the caller's call stack.

Crucially, because an unconditional `throw` statement immediately terminates the normal control flow of a method, any statements placed directly after a `throw` without a conditional branch are strictly **unreachable code**. The compiler will reject the program with a compile-time error: `unreachable statement`.

```
+------------------------------------------------------------------------------------+
| KEYWORD COMPARISON: throw vs throws                                                |
+------------------------------------------------------------------------------------+
| FEATURE           | throw (Statement)             | throws (Clause)                |
| ----------------- | ----------------------------- | ------------------------------ |
| Placement         | Inside method body            | In method signature header     |
| Purpose           | Actively triggers an exception| Declares potential exceptions  |
| Operand           | Concrete Throwable object     | Comma-separated Class types    |
| Bytecode          | athrow instruction            | Exceptions attribute in .class |
| Requirement       | Triggers immediate jump       | Mandatory for checked except.  |
+------------------------------------------------------------------------------------+
```

In contrast, the **`throws` clause** is a **declarative signature contract**. It appears in the method header (e.g., `public void readFile() throws IOException, SQLException`). It does not execute instructions; rather, it informs the compiler and external callers that the method might propagate the specified **checked exceptions**.

Why does `validateDeposit(int amt)` NOT declare `throws IllegalArgumentException`?
Because `IllegalArgumentException` is an **unchecked exception** (it inherits from `java.lang.RuntimeException`). The Java compiler does not enforce `throws` clauses for unchecked exceptions. While you can optionally add `throws IllegalArgumentException` to your method header for documentation purposes, idiomatic Java omits it from the signature and documents it instead using the Javadoc `@throws IllegalArgumentException` tag.

Let us examine the exact JVM bytecode generated by `javac` for the `validateDeposit(int amt)` method to appreciate how the runtime executes the `throw` statement:
```
public static void validateDeposit(int);
  Code:
   0: iload_0              // Push local variable 0 (amt) onto operand stack
   1: ifle          8      // If amt <= 0, jump to offset 8
   4: return               // Happy path: amt > 0, return immediately
   8: new           #2     // class java/lang/IllegalArgumentException
  11: dup                  // Duplicate the top operand stack reference
  12: ldc           #3     // String "Deposit amount must be positive"
  14: invokespecial #4     // Method java/lang/IllegalArgumentException."<init>":(Ljava/lang/String;)V
  17: athrow               // Pop exception reference and throw it
```
Notice the crucial instruction pair at offsets `8` and `11`: `new` followed by `dup`. Why does Java duplicate the newly allocated exception reference? Because the constructor invocation `invokespecial <init>` is an instance method call that consumes the top reference on the operand stack as its `this` pointer! Without the `dup` instruction, the operand stack would be empty after the constructor completes, leaving no reference for the subsequent `athrow` instruction. The `athrow` instruction then pops this remaining duplicate reference and initiates the JVM stack unwinding sequence.

"""

p3_content = """### 3. Custom Exception Hierarchies: Designing Domain-Specific Exceptions

While the standard Java runtime provides dozens of built-in exceptions like `IllegalArgumentException` and `NullPointerException`, enterprise applications frequently require higher semantic fidelity. When an automated fraud engine flags a credit transaction or a customer attempts to withdraw more funds than their account allows, throwing a generic `IllegalArgumentException` fails to communicate the exact business domain failure.

To solve this, enterprise Java systems construct **Custom Domain Exception Hierarchies**. Creating a custom exception is as straightforward as creating a class that extends `java.lang.RuntimeException` (for unchecked domain exceptions) or `java.lang.Exception` (for checked domain exceptions).

```java
// Base domain exception for all banking operations:
public class BankingDomainException extends RuntimeException {
    public BankingDomainException(String message) {
        super(message);
    }

    public BankingDomainException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Specialized business rule violation:
public class InsufficientFundsException extends BankingDomainException {
    private final String accountId;
    private final double attemptedAmount;
    private final double currentBalance;

    public InsufficientFundsException(String accountId, double attemptedAmount, double currentBalance) {
        super(String.format("Account %s has insufficient funds: attempted %.2f with balance %.2f",
                accountId, attemptedAmount, currentBalance));
        this.accountId = accountId;
        this.attemptedAmount = attemptedAmount;
        this.currentBalance = currentBalance;
    }

    public String getAccountId() { return accountId; }
    public double getAttemptedAmount() { return attemptedAmount; }
    public double getCurrentBalance() { return currentBalance; }
}
```

Notice the crucial architectural standards demonstrated in this design:
1. **Four Standard Constructors**: Every enterprise exception class should generally support the four canonical constructors from `Throwable`:
   - No-arg constructor: `MyException()`
   - Message constructor: `MyException(String message)`
   - Cause constructor: `MyException(Throwable cause)`
   - Full constructor: `MyException(String message, Throwable cause)`
2. **Preserving Root Causes**: By accepting and passing `Throwable cause` to `super(message, cause)`, the exception maintains the full causal chain. If a low-level network timeout triggered the business failure, the original timeout stack trace remains intact for diagnostic inspection.
3. **Structured Domain Fields**: Notice that `InsufficientFundsException` stores `accountId`, `attemptedAmount`, and `currentBalance` as strongly-typed, immutable final fields! When an exception bubbles up to an enterprise REST API controller (such as a Spring `@ExceptionHandler` or JAX-RS provider), the controller does not have to parse fragile error message strings with regexes. Instead, it reads the strongly-typed fields directly and serializes a clean, structured JSON response with HTTP status `422 Unprocessable Entity`:
   ```json
   {
     "error": "INSUFFICIENT_FUNDS",
     "accountId": "ACC-9921",
     "attemptedAmount": 500.0,
     "currentBalance": 120.50
   }
   ```
4. **Checked vs Unchecked Decision**: In modern software engineering, the consensus is clear: **Prefer unchecked exceptions (`RuntimeException`) for domain business violations.** Checked exceptions clutter API signatures, force caller boilerplate, and leak implementation abstractions across layers. Frameworks like Spring, Hibernate, and the modern Java standard library are built almost entirely upon unchecked exception hierarchies.

Furthermore, in modern distributed enterprise microservices communicating via REST and gRPC, custom exceptions should integrate directly with centralized error code catalogs:
```java
public enum ErrorCode {
    INVALID_DEPOSIT_AMOUNT("ERR-BANK-1001", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_FUNDS("ERR-BANK-1002", HttpStatus.UNPROCESSABLE_ENTITY),
    ACCOUNT_FROZEN("ERR-BANK-1003", HttpStatus.FORBIDDEN),
    LEDGER_TIMEOUT("ERR-BANK-5001", HttpStatus.GATEWAY_TIMEOUT);

    private final String code;
    private final HttpStatus httpStatus;

    ErrorCode(String code, HttpStatus status) {
        this.code = code;
        this.httpStatus = status;
    }
    public String getCode() { return code; }
    public HttpStatus getHttpStatus() { return httpStatus; }
}
```
By associating each custom domain exception with a standardized `ErrorCode`, internationalization (i18n) becomes seamless. Instead of hardcoding localized strings in exception classes, the exception carries the error code and dynamic parameters. The presentation tier (e.g. mobile app gateway or web frontend) intercepts the error code and resolves the appropriate user-facing message from localized resource bundles based on the client's `Accept-Language` header. This guarantees strict architectural decoupling between core business rules and user-facing presentation logic.

Additionally, in enterprise batch processing and complex form validation, throwing an exception on the very first validation error is often undesirable. If a user fills out a loan application with ten fields and three are invalid, failing immediately on the first field forces the user to submit three times to discover all errors. To solve this, enterprise domain models utilize **Composite Validation Exceptions** (or validation result accumulators). The validator checks all fields, collects all error descriptors into an internal list, and if non-empty, throws a single `ValidationException` containing the full collection of field-level violations. This provides an optimal, user-friendly API experience while maintaining strict domain invariants.


"""

p4_content = """### 4. Enterprise Validation Frameworks & Null Safety: Objects.requireNonNull and Guava Preconditions

As software codebases grow to hundreds of thousands of lines of code, manually writing repetitive `if` statements and throwing exceptions becomes verbose and tedious:

```java
// Repetitive boilerplate:
if (username == null) {
    throw new NullPointerException("Username cannot be null");
}
if (username.trim().isEmpty()) {
    throw new IllegalArgumentException("Username cannot be empty");
}
```

To eliminate boilerplate and standardize precondition checks across industry codebases, the Java ecosystem introduced elegant validation utilities.

First and foremost is **`java.util.Objects.requireNonNull`**, introduced into standard Java in version 7:
```java
import java.util.Objects;

public class UserSession {
    private final String userId;

    public UserSession(String userId) {
        // Fast, fluent null validation:
        this.userId = Objects.requireNonNull(userId, "userId must not be null");
    }
}
```
`Objects.requireNonNull` evaluates the expression. If the argument is non-null, it returns the reference directly, allowing seamless inline assignment inside constructors! If the argument is `null`, it throws `NullPointerException` with the customized error message. Starting in Java 8, it also supports lazy message suppliers (`Objects.requireNonNull(obj, () -> "Failed to load " + expensiveKey)`), which prevents allocating string concatenation memory when the object is valid.

Starting in Java 9 and 16, Java also introduced built-in range check utilities directly on `java.util.Objects`:
- `Objects.checkIndex(int index, int length)`: Throws `IndexOutOfBoundsException` if `index < 0` or `index >= length`.
- `Objects.checkFromToIndex(int fromIndex, int toIndex, int length)`: Validates that a sub-range `[fromIndex, toIndex)` lies cleanly within `[0, length)`.

In the broader enterprise ecosystem, Google Guava's **`Preconditions`** class is widely recognized as the gold standard for precondition enforcement:
```java
import static com.google.common.base.Preconditions.*;

public void transferFunds(String sourceAccount, double amount) {
    checkNotNull(sourceAccount, "Source account cannot be null");
    checkArgument(amount > 0, "Transfer amount must be positive, received: %s", amount);
    checkState(this.isSystemActive(), "Cannot transfer funds while banking engine is offline");
}
```
Notice the elegant semantic separation:
- `checkArgument`: Throws `IllegalArgumentException` when an argument violates a condition.
- `checkNotNull`: Throws `NullPointerException` when a reference is null.
- `checkState`: Throws `IllegalStateException` when the object or system state is invalid.

Furthermore, Java 14 introduced **Helpful NullPointerExceptions** (JEP 358). In older Java runtimes, if an expression like `a.getB().getC().getName()` threw an NPE, the stack trace merely indicated the line number, leaving developers guessing which access was null. Modern JVMs analyze the exact bytecode instruction at the fault address and print precise diagnostics: `Cannot invoke "C.getName()" because the return value of "B.getC()" is null`. Combining helpful NPEs with proactive fail-fast preconditions ensures that your applications are exceptionally easy to debug and maintain.

Another vital distinction in defensive Java engineering is the difference between programmatic preconditions and Java's built-in **`assert` statement**:
```java
// DANGEROUS IN PRODUCTION FOR ARGUMENT VALIDATION:
assert amt > 0 : "Amount must be positive";
```
The `assert` keyword was introduced in Java 1.4 to support internal invariant checking during development and debugging. However, **assertions are completely disabled by default in production JVM runtimes** unless the process is explicitly started with the `-ea` (`-enableassertions`) command-line flag! If an enterprise banking application relies on `assert amt > 0` for security or ledger integrity, those checks are completely ignored at runtime in standard production deployments. Consequently, **the `assert` statement must NEVER be used to validate method arguments or security contracts in production software**. Always use explicit `if (...) throw new IllegalArgumentException(...)` or `Objects.requireNonNull`.

In modern enterprise frameworks, declarative validation via **Jakarta Bean Validation (JSR 380)** provides an additional complementary layer:
```java
public class DepositRequest {
    @NotNull(message = "Account ID cannot be null")
    private String accountId;

    @Positive(message = "Deposit amount must be strictly greater than zero")
    private int amount;
}
```
When using frameworks like Spring Boot or Quarkus, incoming HTTP payloads annotated with `@Valid` are checked automatically before the controller method is even invoked, rejecting invalid requests at the HTTP gateway before domain services execute.

"""

p5_content = """### 5. Guided Coding Lab & Milestone Verification: Building `validateDeposit` and `checkAge`

To conclude Day 24, we implement and verify the two core defensive validation challenges assigned in the PinIT Career OS curriculum: **`validateDeposit`** and **`checkAge`**.

In the first challenge, we create `Solution.validateDeposit(int amt)`. The method contract specifies that if `amt` is zero or negative (`amt <= 0`), the method must actively throw an `IllegalArgumentException` with an informative error message. If the amount is strictly positive (`amt > 0`), the method completes normally without raising an exception.

```java
// ============================================================================
// CHALLENGE 1: VALIDATE DEPOSIT AMOUNT
// ============================================================================
public class Solution {
    /**
     * Validates a monetary deposit amount.
     * Throws IllegalArgumentException if amt is zero or negative (<= 0).
     * Completes normally if amt is positive.
     */
    public static void validateDeposit(int amt) {
        if (amt <= 0) {
            throw new IllegalArgumentException("Deposit amount must be strictly positive: " + amt);
        }
    }
}
```

Let us step through the execution dynamics:
- **Trace 1 (Valid Positive Deposit)**: `validateDeposit(500)`.
  The JVM evaluates the conditional expression `amt <= 0`. Because `500 <= 0` evaluates to `false`, the `if` branch is skipped. The method reaches the implicit `return` instruction and terminates normally.
- **Trace 2 (Zero Deposit Attempt)**: `validateDeposit(0)`.
  The conditional `0 <= 0` evaluates to `true`. The JVM executes `new IllegalArgumentException(...)`, constructing the exception object on the heap and capturing the thread's stack trace. The `athrow` bytecode instruction is executed. Because there is no enclosing `try-catch` block inside `validateDeposit`, the method frame is popped and the exception propagates upward to the caller.
- **Trace 3 (Negative Deposit Attempt)**: `validateDeposit(-50)`.
  `-50 <= 0` is `true`. An `IllegalArgumentException` is immediately thrown, preventing invalid negative credits from contaminating the financial ledger.

In the second challenge, we implement `SolutionAdv.checkAge(int age)`. The specification mandates that if `age` is below 18 (`age < 18`), the method must throw `IllegalArgumentException` with the exact message `"Underage"`.

```java
// ============================================================================
// CHALLENGE 2: AGE VALIDATOR
// ============================================================================
public class SolutionAdv {
    /**
     * Verifies that the provided age meets the legal threshold of 18.
     * Throws IllegalArgumentException("Underage") if age < 18.
     * Completes normally if age >= 18.
     */
    public static void checkAge(int age) {
        if (age < 18) {
            throw new IllegalArgumentException("Underage");
        }
    }
}
```

Let us analyze the test boundary conditions:
- **Boundary Condition (Age = 17)**: `17 < 18` is `true`. The method throws `IllegalArgumentException("Underage")`.
- **Exact Threshold (Age = 18)**: `18 < 18` is `false`. An individual who is 18 has achieved legal maturity under the contract. The method executes cleanly with no exception.
- **Adult (Age = 25)**: `25 < 18` is `false`. Normal execution.
- **Extreme Negative Input (Age = -5)**: `-5 < 18` is `true`. Throws `IllegalArgumentException("Underage")`. (In a production system, you might further distinguish between negative age inputs and minor status, but for this milestone specification, checking `age < 18` satisfies the contract completely).

In modern unit testing with JUnit 5, methods that throw exceptions are tested using `assertThrows`:
```java
@Test
void testValidateDepositRejectsZero() {
    IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
        Solution.validateDeposit(0);
    });
    assertTrue(ex.getMessage().contains("strictly positive"));
}

@Test
void testCheckAgeUnderage() {
    IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
        SolutionAdv.checkAge(16);
    });
    assertEquals("Underage", ex.getMessage());
}
```
This automated verification guarantees that any violation of the business contract is caught instantaneously with zero risk of silent data corruption.

Let us also examine the behavior when verifying extreme numerical edge cases. For instance, what occurs if an attacker supplies `Integer.MIN_VALUE` (`-2,147,483,648`) to `validateDeposit(int amt)`?
Because `-2,147,483,648 <= 0` evaluates to `true`, our defensive guard cleanly catches the negative integer and throws `IllegalArgumentException`. However, if a developer had carelessly written:
```java
// SEVERE BUG: Absolute value overflow!
if (Math.abs(amt) != amt) {
    throw new IllegalArgumentException();
}
```
In two's complement 32-bit arithmetic, `Math.abs(Integer.MIN_VALUE)` overflows and returns `Integer.MIN_VALUE` (a negative number)! Relying on mathematical transformations rather than direct relational comparisons (`amt <= 0`) can introduce subtle security vulnerabilities. Always use direct relational operators (`<= 0`) for monotonic validation.

"""

DAY_24 = {
    "day": 24,
    "title": "Exception Handling II: The throw Statement, Defensive Validation & Custom Exception Hierarchies",
    "goal": "Master active exception throwing and defensive programming in Java. Understand the fail-fast principle, compare the throw statement and athrow bytecode instruction against declarative throws clauses, architect custom domain exception hierarchies with structured diagnostic metadata, utilize Objects.requireNonNull, and implement validateDeposit and checkAge precondition validators.",
    "parts": [
        {
            "part": 1,
            "title": "Defensive Programming & Fail-Fast Architecture: Preconditions and Invariant Enforcement",
            "content": p1_content.strip(),
            "check": {
                "question": "What is the primary objective of the Fail-Fast principle in enterprise Java software?",
                "options": [
                    "To immediately detect and reject invalid state or arguments at the earliest boundary, preventing delayed data corruption",
                    "To reboot the application server whenever a user logs out",
                    "To delete database records as quickly as possible to save disk space",
                    "To convert all checked exceptions into compiled C code"
                ],
                "answer": 0
            }
        },
        {
            "part": 2,
            "title": "The throw Keyword vs throws Clause: Syntactic and Bytecode Contrasts",
            "content": p2_content.strip(),
            "check": {
                "question": "Which bytecode instruction does the Java compiler emit when executing a 'throw new IllegalArgumentException()' statement?",
                "options": [
                    "athrow",
                    "invokestatic",
                    "goto_w",
                    "monitorenter"
                ],
                "answer": 0
            }
        },
        {
            "part": 3,
            "title": "Custom Exception Hierarchies: Designing Domain-Specific Exceptions",
            "content": p3_content.strip(),
            "check": {
                "question": "Why is it advantageous to store structured domain fields (like accountId and attemptedAmount) in custom business exceptions?",
                "options": [
                    "It allows upstream API controllers to access typed error data and serialize structured JSON responses without parsing error strings",
                    "It forces the JVM to encrypt the thread stack frames using AES-256",
                    "It bypasses all garbage collection pauses across the entire cluster",
                    "It automatically creates new database tables at runtime"
                ],
                "answer": 0
            }
        },
        {
            "part": 4,
            "title": "Enterprise Validation Frameworks & Null Safety: Objects.requireNonNull and Guava Preconditions",
            "content": p4_content.strip(),
            "check": {
                "question": "What does Objects.requireNonNull(userId, 'userId must not be null') do if userId is valid and non-null?",
                "options": [
                    "Returns the userId reference directly, allowing fluent inline assignment",
                    "Throws an IllegalArgumentException to halt execution",
                    "Deletes the object from heap memory",
                    "Converts the userId string into an array of integers"
                ],
                "answer": 0
            }
        },
        {
            "part": 5,
            "title": "Guided Coding Lab & Milestone Verification: Building validateDeposit and checkAge",
            "content": p5_content.strip(),
            "check": {
                "question": "In the Day 24 checkAge challenge, what happens when checkAge(16) is called?",
                "options": [
                    "It throws an IllegalArgumentException with the message 'Underage'",
                    "It prints 'Underage' to standard output and returns true",
                    "It increments the age to 18 automatically",
                    "It terminates the JVM process with exit code 1"
                ],
                "answer": 0
            }
        }
    ]
}

with open("scripts/block5_day24.py", "w", encoding="utf-8") as f:
    f.write("# Day 24: Exception Handling II: The throw Statement, Defensive Validation & Custom Exception Hierarchies\n\nDAY_24 = ")
    f.write(pprint.pformat(DAY_24, indent=4, width=120))
    f.write("\n")

print("Wrote scripts/block5_day24.py successfully")
