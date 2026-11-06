import sys
sys.path.insert(0, 'scripts')
import pprint

from block5_day23 import DAY_23

d23_codes = [
    """public class ThrowableHierarchyLab {
    public static void main(String[] args) {
        System.out.println("=== THROWABLE TAXONOMY DEMONSTRATION ===");

        // Unchecked RuntimeException: Programming defect (division by zero)
        try {
            int result = 100 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Caught RuntimeException: " + e.getClass().getName());
            System.out.println("Message: " + e.getMessage());
            System.out.println("Is instance of Throwable: " + (e instanceof Throwable));
            System.out.println("Is instance of RuntimeException: " + (e instanceof RuntimeException));
        }

        // Defensive check: Avoid costly exception instantiation when possible
        int divisor = 0;
        if (divisor != 0) {
            int safe = 100 / divisor;
        } else {
            System.out.println("Defensive guard avoided ArithmeticException allocation!");
        }
    }
}""",
    """public class TryCatchControlLab {
    public static int parseAndDivide(String textA, String textB) {
        try {
            int a = Integer.parseInt(textA); // May throw NumberFormatException
            int b = Integer.parseInt(textB);
            return a / b;                    // May throw ArithmeticException
        } catch (NumberFormatException e) {
            System.out.println("  [SPECIFIC HANDLER] Malformed number: " + e.getMessage());
            return -1;
        } catch (ArithmeticException e) {
            System.out.println("  [SPECIFIC HANDLER] Division by zero: " + e.getMessage());
            return -1;
        } catch (Exception e) {
            System.out.println("  [GENERAL FALLBACK] Unexpected error: " + e.getMessage());
            return -1;
        }
    }

    public static void main(String[] args) {
        System.out.println("10 / 2:   " + parseAndDivide("10", "2"));   // 5
        System.out.println("10 / 0:   " + parseAndDivide("10", "0"));   // -1
        System.out.println("10 / ABC: " + parseAndDivide("10", "ABC")); // -1
    }
}""",
    """public class FinallyExecutionLab {
    public static String executeWithCleanup(boolean triggerError) {
        try {
            System.out.println("1. Entering try block");
            if (triggerError) {
                throw new RuntimeException("Simulated processing anomaly");
            }
            System.out.println("2. Processing successful, preparing return value");
            return "SUCCESS_PAYLOAD";
        } catch (RuntimeException e) {
            System.out.println("3. Caught in catch block: " + e.getMessage());
            return "ERROR_PAYLOAD";
        } finally {
            // GUARANTEED: Runs before return completes!
            System.out.println("4. FINALLY block executed: Releasing database connection / socket");
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Normal Run ---");
        String res1 = executeWithCleanup(false);
        System.out.println("Returned: " + res1);

        System.out.println("\n--- Exception Run ---");
        String res2 = executeWithCleanup(true);
        System.out.println("Returned: " + res2);
    }
}""",
    """public class ExceptionPatternsLab {
    // Domain-specific business exception preserving causal chain:
    public static class PaymentProcessingException extends RuntimeException {
        public PaymentProcessingException(String message, Throwable cause) {
            super(message, cause); // Preserves root cause stack trace!
        }
    }

    public static void processPayment(double amount) {
        try {
            if (amount <= 0) {
                throw new IllegalArgumentException("Payment amount must be strictly positive: " + amount);
            }
            System.out.println("Payment of $" + amount + " authorized");
        } catch (IllegalArgumentException e) {
            // Anti-pattern fix: Translate technical exception to domain exception with cause!
            throw new PaymentProcessingException("Gateway failed to process payment", e);
        }
    }

    public static void main(String[] args) {
        try {
            processPayment(-50.0);
        } catch (PaymentProcessingException e) {
            System.out.println("Caught Domain Exception: " + e.getMessage());
            System.out.println("Original Root Cause:     " + e.getCause().getMessage());
        }
    }
}""",
    """public class SolutionLab {
    public static class Solution {
        public static int safeDivide(int a, int b) {
            try {
                return a / b;
            } catch (ArithmeticException e) {
                return -1;
            }
        }

        public static int safeGet(int[] arr, int i) {
            try {
                if (arr == null) return -1;
                return arr[i];
            } catch (ArrayIndexOutOfBoundsException e) {
                return -1;
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("safeDivide(10, 2):  " + Solution.safeDivide(10, 2));  // 5
        System.out.println("safeDivide(10, 0):  " + Solution.safeDivide(10, 0));  // -1
        int[] arr = {10, 20, 30};
        System.out.println("safeGet(arr, 1):    " + Solution.safeGet(arr, 1));    // 20
        System.out.println("safeGet(arr, 5):    " + Solution.safeGet(arr, 5));    // -1
        System.out.println("safeGet(arr, -1):   " + Solution.safeGet(arr, -1));   // -1
        System.out.println("safeGet(null, 0):   " + Solution.safeGet(null, 0));   // -1
    }
}"""
]

d23_checks = [
    [
        {
            "question": "Which of the following is an unchecked exception inheriting from RuntimeException in Java?",
            "options": [
                "ArithmeticException (e.g. integer division by zero)",
                "IOException (filesystem and network read failures)",
                "SQLException (database query failures)",
                "ClassNotFoundException (reflection classloading errors)"
            ],
            "answer": 0,
            "explanation": "ArithmeticException inherits from RuntimeException, making it an unchecked exception that does not require mandatory try-catch or throws clauses."
        },
        {
            "question": "What is the primary architectural purpose of java.lang.Error in Java?",
            "options": [
                "To represent catastrophic, unrecoverable system failures detected by the JVM (e.g. OutOfMemoryError)",
                "To handle user form validation errors in web applications",
                "To format numbers into currency strings",
                "To manage thread pool sleep intervals"
            ],
            "answer": 0,
            "explanation": "Errors represent fatal JVM problems like OutOfMemoryError or StackOverflowError; application code should never attempt to catch or recover from Error."
        },
        {
            "question": "What performance cost is incurred when constructing a Throwable instance in Java?",
            "options": [
                "The JVM walks the native thread stack to capture class names, method names, and line numbers via fillInStackTrace()",
                "The JVM writes the entire heap to persistent disk storage",
                "The operating system reboots the network interface card",
                "The JVM clears all CPU cache lines across all cores"
            ],
            "answer": 0,
            "explanation": "Throwable.fillInStackTrace() performs an expensive native walk of the C++ thread call frames, capturing stack trace frames."
        },
        {
            "question": "Why does the Java compiler enforce mandatory handling for checked exceptions like IOException?",
            "options": [
                "To ensure developers explicitly handle anticipated, recoverable environmental disruptions like missing files or dropped sockets",
                "To convert checked exceptions into C++ pointers at runtime",
                "Because checked exceptions automatically terminate the operating system",
                "To prevent the Garbage Collector from freeing heap objects"
            ],
            "answer": 0,
            "explanation": "Checked exceptions represent anticipated environmental failures that robust software must either catch and remediate or declare with 'throws'."
        }
    ],
    [
        {
            "question": "How does the JVM locate the appropriate catch block when an exception is thrown inside a method?",
            "options": [
                "By consulting the method's Exception Table in the bytecode to match the program counter and exception type hierarchy",
                "By sending an HTTP request to an external cluster registry",
                "By rebooting the CPU operating system kernel",
                "By deleting all local variables and restarting the entire Java program from main()"
            ],
            "answer": 0,
            "explanation": "The JVM consults the Exception Table in the method's bytecode attributes, matching the current instruction program counter with the target handler."
        },
        {
            "question": "In what order must catch blocks be declared when handling related exception types?",
            "options": [
                "Specific subclasses must precede generalized superclasses",
                "Generalized superclasses must always come first",
                "Order is completely arbitrary and has no effect on execution",
                "Catch blocks can only be ordered alphabetically by class name"
            ],
            "answer": 0,
            "explanation": "Catch blocks are evaluated sequentially; placing a superclass (e.g. Exception) before a subclass (e.g. ArithmeticException) results in unreachable code compile errors."
        },
        {
            "question": "What happens during JVM stack unwinding if no matching catch block is found in the current method?",
            "options": [
                "The current stack frame is popped and the search continues in the calling method frame",
                "The computer immediately halts all running processes",
                "The exception is converted into an integer 0 and execution continues",
                "The JVM re-executes the method from line 1 in an infinite loop"
            ],
            "answer": 0,
            "explanation": "Stack unwinding pops each stack frame sequentially until a matching catch block is encountered or the thread terminates at UncaughtExceptionHandler."
        },
        {
            "question": "In Java 7+ multi-catch syntax (catch (ArithmeticException | NullPointerException e)), what is true of 'e'?",
            "options": [
                "The variable 'e' is implicitly final and cannot be reassigned within the catch block",
                "The variable 'e' is automatically converted to an integer",
                "The variable 'e' can only be read once and is then deleted",
                "The variable 'e' must be declared public static"
            ],
            "answer": 0,
            "explanation": "In a multi-catch clause, the exception variable parameter 'e' is implicitly final, preventing re-assignment."
        }
    ],
    [
        {
            "question": "Under what condition will code inside a finally block NOT execute?",
            "options": [
                "When System.exit() is explicitly invoked inside the try or catch block",
                "When an unhandled RuntimeException is thrown inside the try block",
                "When the try block executes an explicit return statement",
                "When the catch block handles an ArrayIndexOutOfBoundsException"
            ],
            "answer": 0,
            "explanation": "Finally executes even when returns or unhandled exceptions occur; it only fails to execute if the JVM halts abruptly via System.exit() or SIGKILL."
        },
        {
            "question": "Why is writing an explicit 'return' statement inside a finally block considered a dangerous anti-pattern?",
            "options": [
                "It abruptly discards any pending uncaught exception, silently swallowing errors without warning",
                "It causes the JVM compiler to delete the .class file",
                "It converts all numbers into floating-point NaN values",
                "It triggers an immediate StackOverflowError"
            ],
            "answer": 0,
            "explanation": "Returning from inside a finally block silently suppresses any exception thrown in the try or catch block, masking critical failures from callers."
        },
        {
            "question": "In what order are resources closed in a Java try-with-resources statement with multiple resources?",
            "options": [
                "In reverse order of their declaration (Last-In, First-Out)",
                "In the exact forward order of their declaration",
                "Concurrently on separate background threads",
                "Randomly based on memory address"
            ],
            "answer": 0,
            "explanation": "Try-with-resources closes resources in reverse declaration order (LIFO), unwinding dependencies cleanly."
        },
        {
            "question": "How does try-with-resources handle an exception thrown during resource close() when try also threw an exception?",
            "options": [
                "It attaches the closure exception as a suppressed exception via Throwable.addSuppressed()",
                "It discards the primary exception and only throws the close exception",
                "It crashes the JVM immediately",
                "It ignores the close exception completely without recording it"
            ],
            "answer": 0,
            "explanation": "Try-with-resources preserves the primary business exception while appending closure exceptions via Throwable.addSuppressed()."
        }
    ],
    [
        {
            "question": "Why is an empty catch block considered dangerous in enterprise production?",
            "options": [
                "It silently swallows errors, masking bugs and leaving the application in a corrupt, un-diagnosable state",
                "It causes the JVM compiler to delete the source code file from disk",
                "It automatically charges fees to the cloud hosting provider account",
                "It converts all integer variables into floating-point numbers"
            ],
            "answer": 0,
            "explanation": "Empty catch blocks swallow exceptions silently, hiding bugs and leaving data structures or database transactions in corrupt states."
        },
        {
            "question": "What is the problem with the 'Log and Throw' anti-pattern across microservice architectural layers?",
            "options": [
                "It creates duplicate redundant stack traces in log aggregators at every layer for a single root error",
                "It causes the JVM to reboot the CPU",
                "It deletes previous log files from disk",
                "It prevents exceptions from reaching the catch block"
            ],
            "answer": 0,
            "explanation": "Logging and rethrowing at every tier floods central logs with redundant identical stack traces; either log and handle, or rethrow with cause."
        },
        {
            "question": "What is a major limitation of returning sentinel values like -1 to indicate error conditions?",
            "options": [
                "Ambiguity: callers cannot distinguish between a legitimate result of -1 and an error condition",
                "The JVM cannot return negative numbers from static methods",
                "Sentinel values cause memory leaks in Metaspace",
                "Sentinel values can only be used in C programs"
            ],
            "answer": 0,
            "explanation": "Sentinel values like -1 create ambiguity when -1 is a valid output of the calculation (e.g. -10 / 10 = -1)."
        },
        {
            "question": "Why is using exceptions for normal loop termination an anti-pattern?",
            "options": [
                "It degrades performance by up to 100x by disabling JIT loop optimizations and allocating excessive exception objects",
                "Java prohibits using try blocks inside loops",
                "It corrupts the CPU register state permanently",
                "It turns all arrays into LinkedLists"
            ],
            "answer": 0,
            "explanation": "Exceptions are for exceptional situations; using them for normal loop termination degrades CPU branch prediction and exhausts young-gen heap memory."
        }
    ],
    [
        {
            "question": "In the Day 23 safeDivide challenge, what does safeDivide(10, 0) return and why?",
            "options": [
                "Returns -1 because integer division by zero throws ArithmeticException which is caught by the try-catch block",
                "Returns 0 because any number divided by zero in Java equals zero",
                "Returns positive infinity as a floating-point Double.POSITIVE_INFINITY",
                "Crashes the application and shuts down the JVM"
            ],
            "answer": 0,
            "explanation": "Integer division by zero throws ArithmeticException; the catch block intercepts this exception and safely returns -1."
        },
        {
            "question": "What does Solution.safeDivide(15, 3) return?",
            "options": [
                "5",
                "-1",
                "0",
                "15"
            ],
            "answer": 0,
            "explanation": "15 / 3 evaluates cleanly to 5; no exception is thrown, so 5 is returned."
        },
        {
            "question": "In the Day 23 safeGet assignment, what does safeGet(new int[]{10, 20}, 5) return?",
            "options": [
                "-1 because index 5 exceeds array length 2, throwing ArrayIndexOutOfBoundsException",
                "20",
                "0",
                "10"
            ],
            "answer": 0,
            "explanation": "Accessing index 5 on an array of length 2 triggers an ArrayIndexOutOfBoundsException, which is caught and returns -1."
        },
        {
            "question": "What does safeGet(null, 0) return when protected with a defensive null check?",
            "options": [
                "-1 cleanly without throwing NullPointerException",
                "0",
                "Throws NullPointerException and terminates",
                "Returns Integer.MAX_VALUE"
            ],
            "answer": 0,
            "explanation": "The defensive guard 'if (arr == null) return -1;' intercepts null array references safely."
        }
    ]
]

DAY_23["minutes"] = 25
DAY_23["recap"] = "Yesterday we mastered the static keyword, class-level memory, and utility design. Today, we step into robust exception handling, exploring the JVM Throwable hierarchy, try-catch mechanics, and defensive recovery."
DAY_23["summary"] = [
    "Throwable is the root of the Java error hierarchy, bifurcating into JVM fatal Errors and application Exceptions.",
    "Checked exceptions represent recoverable external conditions enforced by the compiler, while RuntimeExceptions represent programming defects.",
    "Try-catch blocks are compiled into bytecode Exception Tables that match program counters during stack unwinding.",
    "The finally block provides absolute cleanup guarantees, executing before return statements complete.",
    "Avoid empty catch blocks and 'log and throw' anti-patterns; use specific catch clauses.",
    "The safeDivide and safeGet utilities demonstrate clean defensive sentinel fallbacks for arithmetic and bounds errors."
]
DAY_23["projectStep"] = {
    "title": "Build the Safe Arithmetic and Array Parser Engine",
    "steps": [
        "Author Solution.safeDivide(int a, int b) returning a / b or -1 upon ArithmeticException.",
        "Author SolutionAdv.safeGet(int[] arr, int i) returning arr[i] or -1 upon ArrayIndexOutOfBoundsException.",
        "Add defensive null validation to safeGet ensuring null inputs return -1 without throwing NullPointerException.",
        "Verify safeDivide(10, 0) returns -1 and safeGet(new int[]{1, 2}, 5) returns -1 across unit tests."
    ]
}

for i in range(5):
    DAY_23["parts"][i]["code"] = d23_codes[i]
    DAY_23["parts"][i]["checks"] = d23_checks[i]
    if "check" in DAY_23["parts"][i]:
        del DAY_23["parts"][i]["check"]

with open("scripts/block5_day23.py", "w", encoding="utf-8") as f:
    f.write("# Day 23: Exception Handling I: Throwable Hierarchy, Try-Catch-Finally & Defensive Recovery\n\nDAY_23 = ")
    f.write(pprint.pformat(DAY_23, indent=4, width=120))
    f.write("\n")

print("Enriched Day 23 successfully")
