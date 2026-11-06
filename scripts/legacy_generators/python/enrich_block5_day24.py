import sys
sys.path.insert(0, 'scripts')
import pprint

from block5_day24 import DAY_24

d24_codes = [
    """public class PreconditionLab {
    public static class BankAccount {
        private final String accountId;
        private double balance;
        private boolean frozen;

        public BankAccount(String id, double initialBalance) {
            // Fail-fast precondition validation:
            if (id == null || id.trim().isEmpty()) {
                throw new IllegalArgumentException("Account ID cannot be null or empty");
            }
            if (initialBalance < 0) {
                throw new IllegalArgumentException("Initial balance cannot be negative: " + initialBalance);
            }
            this.accountId = id;
            this.balance = initialBalance;
            this.frozen = false;
        }

        public void withdraw(double amount) {
            // State precondition check:
            if (frozen) {
                throw new IllegalStateException("Cannot withdraw from frozen account: " + accountId);
            }
            // Argument precondition check:
            if (amount <= 0) {
                throw new IllegalArgumentException("Withdrawal amount must be positive: " + amount);
            }
            if (amount > balance) {
                throw new IllegalArgumentException("Insufficient funds. Requested: " + amount + ", Available: " + balance);
            }
            balance -= amount;
        }
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("ACC-101", 500.0);
        acc.withdraw(200.0);
        System.out.println("Withdrawal successful, remaining balance verified");
    }
}""",
    """public class ThrowBytecodeLab {
    // throw: Imperative statement executing athrow bytecode instruction
    public static void validateAmount(int amount) {
        if (amount <= 0) {
            // Bytecode sequence: new, dup, ldc, invokespecial, athrow
            throw new IllegalArgumentException("Amount must be positive: " + amount);
        }
        System.out.println("Amount validated: " + amount);
    }

    // throws: Declarative method signature clause for checked exceptions
    public static void readConfiguration(String path) throws java.io.IOException {
        if (path == null) {
            throw new java.io.FileNotFoundException("Path is null");
        }
        System.out.println("Config loaded from: " + path);
    }

    public static void main(String[] args) {
        validateAmount(100);
        try {
            validateAmount(-50);
        } catch (IllegalArgumentException e) {
            System.out.println("Caught expected precondition violation: " + e.getMessage());
        }
    }
}""",
    """public class CustomExceptionLab {
    // Custom domain exception hierarchy:
    public static class InsufficientFundsException extends RuntimeException {
        private final String accountId;
        private final double attemptedAmount;
        private final double currentBalance;

        public InsufficientFundsException(String accountId, double attempted, double current) {
            super(String.format("Account %s overdraft: attempted %.2f with balance %.2f",
                    accountId, attempted, current));
            this.accountId = accountId;
            this.attemptedAmount = attempted;
            this.currentBalance = current;
        }

        public String getAccountId() { return accountId; }
        public double getAttemptedAmount() { return attemptedAmount; }
        public double getCurrentBalance() { return currentBalance; }
    }

    public static void debit(String accId, double balance, double amount) {
        if (amount > balance) {
            throw new InsufficientFundsException(accId, amount, balance);
        }
    }

    public static void main(String[] args) {
        try {
            debit("ACC-9021", 150.0, 500.0);
        } catch (InsufficientFundsException e) {
            System.out.println("Structured Error Code: INSUFFICIENT_FUNDS");
            System.out.println("Account: " + e.getAccountId() + ", Deficit: $" + (e.getAttemptedAmount() - e.getCurrentBalance()));
        }
    }
}""",
    """import java.util.Objects;

public class ValidationUtilitiesLab {
    public static class UserProfile {
        private final String username;
        private final String email;

        public UserProfile(String username, String email) {
            // Fluent null-checking: returns reference if non-null, throws NPE if null
            this.username = Objects.requireNonNull(username, "Username must not be null");
            this.email = Objects.requireNonNull(email, "Email must not be null");

            if (username.trim().isEmpty()) {
                throw new IllegalArgumentException("Username must not be blank");
            }
        }

        public String getUsername() { return username; }
        public String getEmail() { return email; }
    }

    public static void main(String[] args) {
        UserProfile user = new UserProfile("vinay_dev", "vinay@enterprise.internal");
        System.out.println("User initialized: " + user.getUsername());

        // Range checking utility in modern Java:
        int[] items = {10, 20, 30};
        int validIndex = Objects.checkIndex(1, items.length); // returns 1
        System.out.println("Index validated via Objects.checkIndex: " + validIndex);
    }
}""",
    """public class SolutionLab {
    public static class Solution {
        public static void validateDeposit(int amt) {
            if (amt <= 0) {
                throw new IllegalArgumentException("Deposit amount must be positive: " + amt);
            }
        }
    }

    public static class SolutionAdv {
        public static void checkAge(int age) {
            if (age < 18) {
                throw new IllegalArgumentException("Underage");
            }
        }
    }

    public static void main(String[] args) {
        // Test validateDeposit happy path and failure:
        Solution.validateDeposit(500); // OK
        try {
            Solution.validateDeposit(0);
        } catch (IllegalArgumentException e) {
            System.out.println("Caught expected zero deposit rejection: " + e.getMessage());
        }

        // Test checkAge happy path and failure:
        SolutionAdv.checkAge(25); // OK
        SolutionAdv.checkAge(18); // OK
        try {
            SolutionAdv.checkAge(16);
        } catch (IllegalArgumentException e) {
            System.out.println("Caught expected underage rejection: " + e.getMessage());
        }
    }
}"""
]

d24_checks = [
    [
        {
            "question": "What is the primary objective of the Fail-Fast principle in enterprise Java software?",
            "options": [
                "To immediately detect and reject invalid state or arguments at the earliest boundary, preventing delayed data corruption",
                "To reboot the application server whenever a user logs out",
                "To delete database records as quickly as possible to save disk space",
                "To convert all checked exceptions into compiled C code"
            ],
            "answer": 0,
            "explanation": "Fail-fast ensures invalid input is rejected at the system boundary before corrupted data propagates into databases or internal state."
        },
        {
            "question": "When should IllegalArgumentException be thrown versus IllegalStateException?",
            "options": [
                "IllegalArgumentException for inappropriate caller arguments; IllegalStateException when the target object is in an unsuitable state to process the call",
                "IllegalArgumentException for numbers; IllegalStateException for strings",
                "IllegalArgumentException is for checked exceptions; IllegalStateException is for unchecked exceptions",
                "They are interchangeable with no semantic distinction"
            ],
            "answer": 0,
            "explanation": "IllegalArgumentException indicates the caller passed bad arguments; IllegalStateException indicates the receiver object's current state cannot fulfill the request."
        },
        {
            "question": "In Bertrand Meyer's Design by Contract model, what is a Precondition?",
            "options": [
                "A requirement that the caller must satisfy before invoking a routine",
                "A guarantee that a method promises to deliver after completion",
                "An invariant that only applies to database transactions",
                "A compiler flag that enables 64-bit memory addresses"
            ],
            "answer": 0,
            "explanation": "Preconditions define the obligations of the caller; if violated, the method refuses execution by throwing an exception."
        },
        {
            "question": "Why should method preconditions be enforced at public API boundaries?",
            "options": [
                "Because public methods accept external, untrusted input that could corrupt internal invariants if left unvalidated",
                "Because private methods are forbidden from using if statements in Java",
                "Because public methods run in separate operating system processes",
                "Because JIT compilation only works on validated methods"
            ],
            "answer": 0,
            "explanation": "Public methods represent the perimeter of an architectural component and must defensively validate inputs from untrusted callers."
        }
    ],
    [
        {
            "question": "Which bytecode instruction does the Java compiler emit when executing a 'throw new IllegalArgumentException()' statement?",
            "options": [
                "athrow",
                "invokestatic",
                "goto_w",
                "monitorenter"
            ],
            "answer": 0,
            "explanation": "athrow pops the exception object reference from the operand stack and initiates stack unwinding."
        },
        {
            "question": "Why does javac emit a 'dup' instruction directly after allocating a new exception with 'new'?",
            "options": [
                "Because invokespecial <init> consumes one reference, leaving the duplicate reference for the subsequent athrow instruction",
                "Because exceptions must always exist in pairs in JVM memory",
                "To duplicate the exception across all CPU cores",
                "To copy the exception string into the native C heap"
            ],
            "answer": 0,
            "explanation": "Constructors consume the top stack reference as 'this'; dup leaves a copy on the stack so athrow can consume it."
        },
        {
            "question": "What is the key syntactic difference between the 'throw' statement and the 'throws' clause?",
            "options": [
                "throw is an executable statement inside a method body; throws is a declarative clause in the method signature",
                "throw is only for unchecked exceptions; throws is only for errors",
                "throw creates a thread; throws terminates a thread",
                "They are alternate spellings of the same keyword"
            ],
            "answer": 0,
            "explanation": "throw is an imperative statement that raises an exception; throws is a method header declaration listing checked exceptions."
        },
        {
            "question": "Why does Solution.validateDeposit(int amt) NOT require a declarative 'throws IllegalArgumentException' clause?",
            "options": [
                "Because IllegalArgumentException is an unchecked exception (subclass of RuntimeException)",
                "Because validateDeposit returns void",
                "Because static methods are exempted from all exception declarations",
                "Because the method name starts with 'validate'"
            ],
            "answer": 0,
            "explanation": "Unchecked exceptions inherit from RuntimeException and do not require declarative 'throws' clauses in method signatures."
        }
    ],
    [
        {
            "question": "Why is it advantageous to store structured domain fields (like accountId and attemptedAmount) in custom business exceptions?",
            "options": [
                "It allows upstream API controllers to access typed error data and serialize structured JSON responses without parsing error strings",
                "It forces the JVM to encrypt the thread stack frames using AES-256",
                "It bypasses all garbage collection pauses across the entire cluster",
                "It automatically creates new database tables at runtime"
            ],
            "answer": 0,
            "explanation": "Typed fields allow web frameworks and REST handlers to serialize clean, structured error responses directly from domain metadata."
        },
        {
            "question": "Why should enterprise custom exceptions provide a constructor accepting (String message, Throwable cause)?",
            "options": [
                "To preserve the causal chain and original stack trace of underlying technical errors for diagnostic troubleshooting",
                "To allow the exception to be converted into an HTML webpage",
                "To double the execution speed of the catch block",
                "Because Java prohibits exceptions without causes"
            ],
            "answer": 0,
            "explanation": "Preserving the cause prevents losing diagnostic information when translating low-level technical errors into domain exceptions."
        },
        {
            "question": "What is the modern industry consensus on choosing between checked and unchecked exceptions for custom domain exceptions?",
            "options": [
                "Prefer unchecked exceptions (subclasses of RuntimeException) to avoid cluttering signatures and leaking abstractions",
                "Always make every custom exception checked to force maximum try-catch boilerplate",
                "Extend java.lang.Error directly for all business rules",
                "Never create custom exceptions; use integer return codes only"
            ],
            "answer": 0,
            "explanation": "Modern enterprise frameworks prefer unchecked exceptions for domain violations because they do not contaminate method signatures."
        },
        {
            "question": "What is a Composite Validation Exception used for in enterprise systems?",
            "options": [
                "To accumulate multiple field validation failures into a single exception rather than failing on the first error",
                "To compress exception stack traces using gzip",
                "To combine Java exceptions with Python exceptions",
                "To run validation on multiple threads simultaneously"
            ],
            "answer": 0,
            "explanation": "Composite exceptions collect all invalid field errors across a form or payload, allowing users to remediate all issues at once."
        }
    ],
    [
        {
            "question": "What does Objects.requireNonNull(userId, 'userId must not be null') do if userId is valid and non-null?",
            "options": [
                "Returns the userId reference directly, allowing fluent inline assignment",
                "Throws an IllegalArgumentException to halt execution",
                "Deletes the object from heap memory",
                "Converts the userId string into an array of integers"
            ],
            "answer": 0,
            "explanation": "Objects.requireNonNull returns the validated reference directly, enabling fluent constructor field initialization like 'this.id = Objects.requireNonNull(id)'."
        },
        {
            "question": "Why should Java's 'assert' statement NEVER be used to validate arguments in production software?",
            "options": [
                "Assertions are disabled by default in production JVM runtimes unless explicitly enabled via -ea flag",
                "The assert statement was removed from the Java language in Java 8",
                "Assertions can only be executed by the root operating system user",
                "Assertions cause the JVM to allocate 1 GB of memory per check"
            ],
            "answer": 0,
            "explanation": "Assertions are disabled by default in production JVMs, meaning assert checks are skipped entirely unless -ea is passed."
        },
        {
            "question": "What does Objects.checkIndex(int index, int length) do if index is out of bounds?",
            "options": [
                "Throws an IndexOutOfBoundsException with the offending index and length",
                "Returns -1 cleanly",
                "Expands the array to fit the index",
                "Throws a NullPointerException"
            ],
            "answer": 0,
            "explanation": "Objects.checkIndex validates bounds, throwing IndexOutOfBoundsException if index < 0 or index >= length."
        },
        {
            "question": "What are Helpful NullPointerExceptions (introduced in Java 14)?",
            "options": [
                "JVM diagnostics that pinpoint the exact variable or method invocation in an expression that evaluated to null",
                "A library that converts all null references into empty strings",
                "A compiler plugin that deletes all null checks",
                "An automatic code formatter"
            ],
            "answer": 0,
            "explanation": "Helpful NPEs inspect bytecode at the fault instruction to clearly state which specific sub-expression was null."
        }
    ],
    [
        {
            "question": "In the Day 24 checkAge challenge, what happens when checkAge(16) is called?",
            "options": [
                "It throws an IllegalArgumentException with the message 'Underage'",
                "It prints 'Underage' to standard output and returns true",
                "It increments the age to 18 automatically",
                "It terminates the JVM process with exit code 1"
            ],
            "answer": 0,
            "explanation": "16 < 18 evaluates to true, triggering 'throw new IllegalArgumentException(\"Underage\")'."
        },
        {
            "question": "What happens when SolutionAdv.checkAge(18) is called?",
            "options": [
                "The method completes normally without throwing any exception",
                "It throws an IllegalArgumentException('Underage')",
                "It returns false",
                "It prints a warning to standard error"
            ],
            "answer": 0,
            "explanation": "18 < 18 is false; age 18 meets the legal threshold, so the method finishes execution cleanly."
        },
        {
            "question": "In the Day 24 validateDeposit challenge, what happens when validateDeposit(0) is called?",
            "options": [
                "It throws an IllegalArgumentException because 0 is not strictly positive",
                "It deposits 0 dollars into the account",
                "It returns 0 as a success code",
                "It throws an ArithmeticException"
            ],
            "answer": 0,
            "explanation": "0 <= 0 evaluates to true, so an IllegalArgumentException is actively thrown."
        },
        {
            "question": "What happens when validateDeposit(500) is called?",
            "options": [
                "The method finishes execution normally without throwing an exception",
                "It throws an IllegalArgumentException",
                "It prints 'Deposit amount must be positive' to the console",
                "It converts 500 to a negative number"
            ],
            "answer": 0,
            "explanation": "500 <= 0 evaluates to false, so the guard does not fire and the method completes cleanly."
        }
    ]
]

DAY_24["minutes"] = 25
DAY_24["recap"] = "Yesterday we mastered try-catch-finally control flow and the Throwable taxonomy. Today, we focus on proactive defensive validation, the throw statement, athrow bytecode, custom domain exceptions, and precondition verification."
DAY_24["summary"] = [
    "The Fail-Fast principle demands immediate validation at API boundaries to prevent delayed data corruption.",
    "The throw statement actively instantiates and raises an exception via the athrow bytecode instruction.",
    "Unchecked exceptions (inheriting from RuntimeException) do not require declarative 'throws' signatures.",
    "Custom domain exceptions encapsulate business logic failures with typed fields (e.g. accountId, attemptedAmount).",
    "Utilities like Objects.requireNonNull provide concise, fluent precondition checks with informative messages.",
    "The validateDeposit and checkAge challenges enforce business boundary constraints through IllegalArgumentException."
]
DAY_24["projectStep"] = {
    "title": "Implement the Defensive Boundary and Precondition Validation Engine",
    "steps": [
        "Author Solution.validateDeposit(int amt) throwing IllegalArgumentException if amt <= 0.",
        "Author SolutionAdv.checkAge(int age) throwing IllegalArgumentException('Underage') if age < 18.",
        "Verify that valid positive amounts and adult ages (>= 18) complete cleanly without throwing exceptions.",
        "Write unit tests utilizing JUnit 5 assertThrows to verify expected exception messages and types."
    ]
}

for i in range(5):
    DAY_24["parts"][i]["code"] = d24_codes[i]
    DAY_24["parts"][i]["checks"] = d24_checks[i]
    if "check" in DAY_24["parts"][i]:
        del DAY_24["parts"][i]["check"]

with open("scripts/block5_day24.py", "w", encoding="utf-8") as f:
    f.write("# Day 24: Exception Handling II: The throw Statement, Defensive Validation & Custom Exception Hierarchies\n\nDAY_24 = ")
    f.write(pprint.pformat(DAY_24, indent=4, width=120))
    f.write("\n")

print("Enriched Day 24 successfully")
