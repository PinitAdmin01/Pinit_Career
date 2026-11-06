# Day 22: Static Keyword: Static Fields, Methods & Class-Level Memory Topologies

DAY_22 = {
    "day": 22,
    "title": "Static Keyword: Static Fields, Methods & Class-Level Memory Topologies",
    "goal": "Master the static keyword in Java from class-level memory topologies to static initialization blocks. Understand static fields vs heap instance fields, static methods and the absence of the this reference, the <clinit> class initialization protocol, static memory leak hazards, thread-safety pitfalls, and engineer production Counter and MathUtil systems.",
    "minutes": 25,
    "recap": "Yesterday we mastered Interfaces and Milestone 4, discovering how abstract contracts decouple enterprise systems. Today, we conquer the 'static' keyword: learning how Java manages class-level shared state and high-performance utility methods across the JVM runtime.",
    "parts": [
        {
            "title": "The 'static' Keyword: Class-Level State vs Instance-Level State on the JVM Heap",
            "content": """In Java systems engineering and JVM runtime architecture, one of the most vital architectural boundaries is the separation between Instance-Level State and Class-Level State. Throughout our exploration of Object-Oriented Programming in Block 4, every field we declared was an Instance Field: whenever an application executed 'new BankAccount()', the Java Virtual Machine allocated an independent payload of memory on the heap containing a private, isolated copy of that field for that specific object instance. However, enterprise systems frequently require state that does not belong to any solitary instance, but rather belongs universally to the Class itself—shared collectively across every instance in the entire JVM process. In Java, this class-level capability is governed exclusively by the 'static' keyword.

When a field is declared with the 'static' modifier (such as 'public static int count = 0;'), its lifecycle and memory topology undergo a fundamental transformation:
1. Unified Shared Storage: The JVM does NOT allocate the static variable inside individual heap object payloads. If an application instantiates one million Counter objects ('new Counter()'), there are NOT one million count variables; there is exactly ONE single, shared integer variable residing in memory! Every single instance of Counter references the exact same memory location. Mutating 'Counter.count' through instance A is immediately and universally reflected across instances B, C, and all subsequent objects.
2. Memory Placement: In modern HotSpot JVM implementations (Java 8 through Java 21+), static fields reside inside the java.lang.Class object mirror associated with that class, which is stored in the Java Heap (while class bytecode metadata resides in Metaspace). Because the Class object itself acts as a permanent Garbage Collection Root (GC Root) as long as its defining ClassLoader is alive, static variables persist throughout the entire execution lifetime of the application process.
3. Access Without Instantiation: Because static members belong to the class blueprint rather than individual instances, an application can read and write static fields directly using the class name prefix ('Counter.count = 0;') without needing to instantiate any objects using 'new'!

Understanding this distinction is critical for building scalable systems. Static state is ideal for shared counters, global configuration flags, system constants ('public static final double PI = 3.14159;'), and cross-instance telemetry trackers. However, as we will explore throughout today's lesson, static shared mutable state introduces concurrency and memory leak hazards if not managed with rigorous defensive discipline. In the interactive lab below, we trace static memory allocation, contrast static variables with instance variables, and observe cross-instance state sharing.""",
            "code": """public class StaticFoundationsLab {
    public static class Counter {
        // Class-Level Static Field: Exactly ONE shared copy in memory!
        public static int count = 0;

        // Instance-Level Field: Every object gets its own private copy
        public int instanceId;

        public Counter() {
            // Increment the universal shared static counter:
            count++;
            this.instanceId = count;
            System.out.println("  [Constructor] Created Counter instance #" + instanceId + " | Universal count=" + count);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== STATIC CLASS-LEVEL STATE VS INSTANCE STATE LAB ===");

        // Reading static field directly through the Class name (Zero objects instantiated!):
        System.out.println("Initial Counter.count before any 'new': " + Counter.count); // 0

        // Instantiating Object 1
        Counter c1 = new Counter();
        // Instantiating Object 2
        Counter c2 = new Counter();
        // Instantiating Object 3
        Counter c3 = new Counter();

        System.out.println("\nInstance State vs Static State Verification:");
        System.out.println("c1.instanceId (Instance-specific): " + c1.instanceId + " (Expected: 1)");
        System.out.println("c2.instanceId (Instance-specific): " + c2.instanceId + " (Expected: 2)");
        System.out.println("c3.instanceId (Instance-specific): " + c3.instanceId + " (Expected: 3)");

        // All instances reflect the identical shared static count:
        System.out.println("\nShared Universal Count via Class:");
        System.out.println("Counter.count: " + Counter.count + " (Expected: 3)");
        System.out.println("c1.count:      " + c1.count      + " (Shared: 3)");
    }
}""",
            "checks": [
                {
                    "question": "What is the primary difference between a static field and an instance field in Java?",
                    "options": [
                        "A static field has exactly one shared copy per class in memory; an instance field has an independent copy inside every heap object",
                        "A static field can only store floating-point numbers",
                        "A static field is deleted as soon as a method returns",
                        "An instance field is stored on the hard drive"
                    ],
                    "answer": 0,
                    "explanation": "Static fields belong to the class and are shared across all instances; instance fields belong to individual objects."
                },
                {
                    "question": "Can a static field be accessed without instantiating any objects using the 'new' keyword?",
                    "options": [
                        "Yes, by using the class identifier directly (e.g., ClassName.fieldName)",
                        "No, you must always create an object before accessing any field in Java",
                        "Only if the field is marked private",
                        "Only when running inside a unit test"
                    ],
                    "answer": 0,
                    "explanation": "Static members belong to the class type itself and can be accessed directly via ClassName.member."
                },
                {
                    "question": "In the Day 22 Challenge, what static field is declared in the Counter class?",
                    "options": [
                        "static int count = 0;",
                        "public double balance = 100.0;",
                        "private String name;",
                        "static boolean isActive = true;"
                    ],
                    "answer": 0,
                    "explanation": "The challenge specifies: 'Create class Counter with a static int count = 0 field, incremented inside constructor Counter()'."
                },
                {
                    "question": "If three instances of Counter are created with 'new Counter(); new Counter(); new Counter();', what is the value of Counter.count?",
                    "options": [
                        "3, because each constructor invocation increments the single shared static count variable",
                        "1, because each instance resets the count",
                        "0",
                        "null"
                    ],
                    "answer": 0,
                    "explanation": "Each constructor runs 'count++', accumulating into the single shared class variable: 0 -> 1 -> 2 -> 3."
                }
            ]
        },
        {
            "title": "Static Methods: Utility Functions, Pure Calculations & The Absence of 'this'",
            "content": """Just as fields can belong to the class itself, methods can also be designated as Class-Level Methods using the 'static' modifier. A Static Method is a method that can be invoked directly on the class without requiring an instantiated object on the heap (e.g., 'Math.max(10, 20)', 'Integer.parseInt("42")'). Static methods represent the primary vehicle in Java for writing Pure Functions, Mathematical Utilities, Factory Methods, and algorithmic helper routines.

However, static methods operate under one fundamental, non-negotiable architectural restriction: The Absence of the 'this' Reference!
Recall from Day 16 that when a non-static instance method executes, the JVM automatically passes a hidden reference pointer in local variable slot 0 representing the current heap object ('this'). This allows the instance method to read and mutate instance fields ('this.balance += amount').

In a static method, there is NO caller object instance on the heap! Because a static method is invoked on the class type itself ('MathUtil.square(6)'), the thread's call stack frame contains NO 'this' pointer in local variable slot 0! Consequently, the Java compiler enforces two strict compile-time rules:
1. Static methods CANNOT access instance fields directly: Attempting to write 'this.balance' or simply 'balance' inside a static method results in an immediate compilation error: 'non-static variable balance cannot be referenced from a static context'.
2. Static methods CANNOT invoke instance methods directly: Attempting to call an instance method without supplying an explicit object reference results in: 'non-static method cannot be referenced from a static context'.

What CAN a static method access?
- It can read and mutate other static fields of the class.
- It can invoke other static methods of the class.
- It can operate on parameters passed explicitly into its arguments.
- It can instantiate new objects locally ('User u = new User();') and call instance methods on those locally created instances.

At the JVM bytecode layer, static method invocations are compiled into the 'invokestatic' instruction. Unlike 'invokevirtual'—which requires reading the object header, traversing the Klass pointer to Metaspace, and indexing into a V-Table—'invokestatic' performs direct static binding! The target method address is known at compile time and resolved during class linking, allowing the CPU to execute an ultra-fast direct branch with zero dispatch indirection. This makes static utility methods (such as 'MathUtil.square(n)') blazingly fast, ideal for mathematical kernels and tight computational loops. In the interactive lab below, we trace static method execution and explore the static context rules.""",
            "code": """public class StaticMethodsLab {
    // Math Utility Class: Demonstrates pure static computational functions
    public static class MathUtil {
        // Pure static calculation method: No object instance needed!
        public static int square(int n) {
            return n * n; // Operates strictly on parameter, returns deterministic output
        }

        public static int cube(int n) {
            // Can invoke other static methods directly:
            return square(n) * n;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== STATIC UTILITY METHODS & PURE CALCULATIONS LAB ===");

        // Invoking static methods directly through MathUtil without 'new':
        int sq1 = MathUtil.square(6);
        System.out.println("MathUtil.square(6):  " + sq1 + " (Expected: 36)");

        int sq2 = MathUtil.square(-4);
        System.out.println("MathUtil.square(-4): " + sq2 + " (Expected: 16)");

        int sq3 = MathUtil.square(0);
        System.out.println("MathUtil.square(0):  " + sq3 + " (Expected: 0)");

        int cube = MathUtil.cube(3);
        System.out.println("MathUtil.cube(3):    " + cube + " (Expected: 27)");

        System.out.println("\nStatic execution verified: Zero heap object allocations incurred!");
    }
}""",
            "checks": [
                {
                    "question": "Why is the 'this' keyword illegal inside a static method in Java?",
                    "options": [
                        "Because static methods belong to the class, not an object instance; there is no current heap object to point to",
                        "Because 'this' is a reserved keyword in C++, not Java",
                        "Because static methods can only run on 32-bit operating systems",
                        "Because static methods are converted to Python code at runtime"
                    ],
                    "answer": 0,
                    "explanation": "Static methods have no object instance associated with their execution; local variable slot 0 does not hold 'this'."
                },
                {
                    "question": "What JVM bytecode instruction is emitted when a static method is called?",
                    "options": [
                        "invokestatic",
                        "invokevirtual",
                        "invokeinterface",
                        "invokedynamic"
                    ],
                    "answer": 0,
                    "explanation": "invokestatic is the dedicated bytecode instruction for calling class-level static methods via direct binding."
                },
                {
                    "question": "What happens if a developer attempts to access a non-static instance variable 'balance' directly inside a static method?",
                    "options": [
                        "Compilation error: 'non-static variable balance cannot be referenced from a static context'",
                        "The program compiles but returns 0 at runtime",
                        "The JVM allocates a new object automatically",
                        "The balance is converted into a String"
                    ],
                    "answer": 0,
                    "explanation": "Instance variables require an active object instance; accessing them from a static context is forbidden by the compiler."
                },
                {
                    "question": "In the Day 22 Assignment, what does MathUtil.square(6) return?",
                    "options": [
                        "36, computed as 6 * 6",
                        "12",
                        "6",
                        "0"
                    ],
                    "answer": 0,
                    "explanation": "MathUtil.square(int n) returns n * n; for n = 6, 6 * 6 evaluates to 36."
                }
            ]
        },
        {
            "title": "Static Initialization Blocks & The '<clinit>' Class Loading Protocol",
            "content": """When an application maintains static fields that require complex calculations, file configuration parsing, or cryptographic key initialization before the class can be safely utilized, inline assignment (e.g., 'public static int value = 42;') is insufficient. To support multi-step, exception-safe initialization of class-level state, Java provides Static Initialization Blocks (commonly referred to as 'static { }' blocks).

A Static Initialization Block is a block of code declared inside a class body prefixed with the 'static' keyword:
'public class DatabaseConfiguration {'
'    public static final String CONNECTION_URL;'
'    static {'
'        // Complex multi-step initialization logic executing during class load:'
'        String host = System.getenv("DB_HOST");'
'        CONNECTION_URL = (host == null) ? "jdbc:mysql://localhost:3306/prod" : host;'
'        System.out.println("DatabaseConfiguration loaded: " + CONNECTION_URL);'
'    }'
'}'

The Execution Lifecycle of Static Initializers:
1. Compilation into '<clinit>': The Java compiler collects all static field initializers and all static initialization blocks in the order they appear in the source file, merging them into a single, specialized bytecode method named '<clinit>' (Class Initializer).
2. Triggered on First Active Use: The '<clinit>' method does NOT execute when the JVM boots up! It executes lazily on the class's First Active Reference—such as the first time a static method is called, the first time a static field is read, or the first time an instance is created via 'new'.
3. JVM Thread-Safety Invariant: What happens if ten concurrent threads attempt to access 'DatabaseConfiguration' simultaneously for the first time? The JVM guarantees that '<clinit>' is executed exactly ONCE! The HotSpot ClassLoader acquires an internal Class Initialization Lock on the class object. One thread executes '<clinit>' while the other nine threads block and wait safely until initialization completes. Once initialized, the class flag is permanently set to 'initialized', and subsequent calls bypass the lock with zero synchronization overhead!

This thread-safe, lazy-initialization guarantee makes static blocks the foundation for thread-safe Singleton patterns (such as the Bill Pugh Singleton) and static lookup tables. In the interactive lab below, we trace static block execution, observe '<clinit>' timing, and verify thread-safe class initialization.""",
            "code": """public class StaticInitializationLab {
    public static class ConfigEngine {
        public static final String API_KEY;
        public static final int TIMEOUT_MS;

        // Static Initialization Block: Compiles into <clinit>
        static {
            System.out.println("  1. [<clinit> STARTED] Static Initialization Block executing!");
            // Simulating environment lookup and complex configuration:
            API_KEY = "PROD-SECRET-" + java.util.UUID.randomUUID().toString().substring(0, 8);
            TIMEOUT_MS = 5000;
            System.out.println("  2. [<clinit> COMPLETED] Configured API_KEY=" + API_KEY + ", TIMEOUT=" + TIMEOUT_MS);
        }

        public static void ping() {
            System.out.println("  3. [Static Method] ConfigEngine ping() invoked successfully.");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== STATIC INITIALIZATION & <CLINIT> PROTOCOL LAB ===");

        System.out.println("Main method started. Notice ConfigEngine has NOT been loaded yet!");
        System.out.println("\nTriggering first active reference by calling ConfigEngine.ping()...");

        // First active reference triggers <clinit> execution lazily:
        ConfigEngine.ping();

        System.out.println("\nTriggering second reference:");
        // <clinit> will NOT execute again; class is already initialized!
        System.out.println("Accessing ConfigEngine.API_KEY directly: " + ConfigEngine.API_KEY);
    }
}""",
            "checks": [
                {
                    "question": "What is the bytecode method name synthesized by the compiler to hold all static field initializations and static { } blocks?",
                    "options": [
                        "<clinit>",
                        "<init>",
                        "main",
                        "static_constructor"
                    ],
                    "answer": 0,
                    "explanation": "Static initializers and static field declarations are merged by javac into the class initializer method '<clinit>'."
                },
                {
                    "question": "When does the JVM execute a class's static initialization block (<clinit>)?",
                    "options": [
                        "Lazily, on the first active reference to the class (first static method call, field read, or 'new' instantiation)",
                        "When the computer power button is pressed",
                        "Every time an instance of the class is created",
                        "Only after the entire Java program terminates"
                    ],
                    "answer": 0,
                    "explanation": "Class initialization is lazy; the JVM triggers <clinit> upon the class's first active use."
                },
                {
                    "question": "How does the JVM guarantee thread-safety when multiple threads trigger class initialization simultaneously?",
                    "options": [
                        "The ClassLoader acquires an internal Class Initialization Lock, ensuring <clinit> runs exactly once while other threads block",
                        "The JVM terminates nine of the threads and keeps one alive",
                        "The JVM throws a ConcurrentModificationException",
                        "Static blocks are not thread-safe and will execute multiple times concurrently"
                    ],
                    "answer": 0,
                    "explanation": "The JVM specification requires that class initialization be synchronized internally, guaranteeing single execution."
                },
                {
                    "question": "Does a static initialization block execute again when a second object of that class is instantiated?",
                    "options": [
                        "No, static blocks execute exactly once per class per ClassLoader lifecycle",
                        "Yes, static blocks execute before every constructor",
                        "Only if the object has different parameters",
                        "Only on Tuesdays"
                    ],
                    "answer": 0,
                    "explanation": "Static initialization executes once when the class is initialized; it does not re-run on subsequent object creations."
                }
            ]
        },
        {
            "title": "Static Hazards: Global Mutable State, Memory Leaks & Concurrency Race Conditions",
            "content": """While the 'static' keyword is immensely powerful for utility methods and constants, in enterprise software development it is also one of the most dangerous and misused features of the Java language. Uncontrolled use of static mutable state introduces three critical architectural hazards that can cripple enterprise systems:

1. The Global Mutable State Hazard:
In computer science, global mutable state is considered an anti-pattern because it creates hidden, invisible coupling between completely unrelated components. If a static variable (like 'public static int count') is mutated by a background cron job in Module A, that mutation instantly impacts Module B, Module C, and all running worker threads without any explicit dependency passed through method parameters. This makes debugging distributed systems an absolute nightmare because state can be corrupted from anywhere in the codebase.

2. Static Memory Leaks (The Permanent GC Root Trap):
In Java, the Garbage Collector determines which objects to keep in RAM by tracing references starting from Garbage Collection Roots (GC Roots). Because the java.lang.Class object is rooted in the ClassLoader, any object referenced by a static field is treated as permanently reachable!
'public class CacheService {'
'    public static List<UserSession> sessions = new ArrayList<>(); // LEAK HAZARD!'
'}'
If an application appends user sessions to a static list and forgets to explicitly remove them upon user logout, those session objects CAN NEVER BE GARBAGE COLLECTED! Even if millions of users disconnect, the static list retains references to their entire object graphs on the heap, inexorably inflating memory until the JVM terminates with 'java.lang.OutOfMemoryError: Java heap space'.

3. Concurrency Race Conditions on Static State:
In high-throughput multi-threaded servers (such as Spring Boot web applications handling thousands of concurrent requests), static variables are shared across all worker threads. If two threads simultaneously execute 'Counter.count++':
- Thread 1 reads count (say, 5).
- Thread 2 reads count (5).
- Thread 1 increments and writes 6.
- Thread 2 increments and writes 6.
One entire increment is permanently lost due to a Data Race! In upcoming blocks, we will explore thread-safe atomic counters (such as AtomicInteger) to resolve this race condition. In the interactive lab below, we trace static state mutation, inspect GC Root behavior, and observe static variable resetting in test suites.""",
            "code": """public class StaticHazardsLab {
    public static class CounterService {
        // Shared mutable static state: Must be managed with extreme care!
        public static int count = 0;

        public static void reset() {
            count = 0; // Essential for test suite isolation!
        }
    }

    public static void main(String[] args) {
        System.out.println("=== STATIC HAZARDS & TEST ISOLATION LAB ===");

        // Simulating Test Case 1:
        System.out.println("Running Test Case 1:");
        CounterService.count++;
        CounterService.count++;
        System.out.println("  Test 1 count: " + CounterService.count + " (Expected: 2)");

        // HAZARD: If Test Case 2 runs without resetting, count is dirty!
        System.out.println("\nRunning Test Case 2 WITHOUT resetting (Polluted State):");
        System.out.println("  Test 2 sees initial count: " + CounterService.count + " (DIRTY LEAK!)");

        // SOLUTION: Explicit state isolation between tests
        System.out.println("\nApplying Test Isolation via CounterService.reset():");
        CounterService.reset();
        System.out.println("  Test 2 after reset: " + CounterService.count + " (Clean: 0)");
    }
}""",
            "checks": [
                {
                    "question": "Why are static fields a frequent source of Memory Leaks in Java applications?",
                    "options": [
                        "Because static fields are rooted in the Class object (a permanent GC Root), preventing referenced objects from being garbage collected",
                        "Because static fields automatically double in byte size every hour",
                        "Because the JVM writes static fields to the swap partition on the hard drive",
                        "Because static fields can never store null"
                    ],
                    "answer": 0,
                    "explanation": "Objects referenced by static variables remain reachable through the Class GC Root, surviving garbage collection permanently."
                },
                {
                    "question": "What concurrency defect occurs when multiple threads concurrently execute 'Counter.count++' on a non-atomic static integer?",
                    "options": [
                        "Race conditions and lost updates, because 'count++' is a non-atomic three-step operation (read, update, write)",
                        "Deadlock between CPU cores",
                        "The JVM immediately shuts down",
                        "The count automatically multiplies by 10"
                    ],
                    "answer": 0,
                    "explanation": "count++ is not atomic (read-modify-write); unsynchronized concurrent access causes race conditions and lost increments."
                },
                {
                    "question": "Why is resetting static state (e.g. 'Counter.count = 0;') mandatory between automated unit test runs?",
                    "options": [
                        "To prevent state pollution where mutations from previous tests cause subsequent independent tests to fail unpredictably",
                        "Because the Java compiler refuses to run more than one test per file",
                        "Because static memory is deleted after 100 milliseconds",
                        "To allow other developers on GitHub to edit the code"
                    ],
                    "answer": 0,
                    "explanation": "Static state persists across test runs; failure to reset leads to order-dependent test failures and state contamination."
                },
                {
                    "question": "What is the recommended alternative to global mutable static collections in modern enterprise architecture?",
                    "options": [
                        "Encapsulating state inside singleton Spring service components with bounded lifecycles and thread-safe collections",
                        "Using global variables in bash scripts",
                        "Storing all data in temporary text files on the desktop",
                        "Writing code without any collections"
                    ],
                    "answer": 0,
                    "explanation": "Scoped service components with bounded lifecycles avoid the pitfalls of unmanaged global static mutable collections."
                }
            ]
        },
        {
            "title": "Production Lab: Engineering the Counter State Tracker & MathUtil Engine",
            "content": """We culminate Day 22 of our Java curriculum by engineering production-grade implementations of the Counter State Tracker and the MathUtil Computational Engine. This lab directly implements the specifications of the Day 22 Challenge: creating a class named 'Counter' with an initialized static field 'static int count = 0;', a constructor 'Counter()' that increments the shared static count on every object instantiation ('count++'), and a verification method 'Solution.testCount()' that resets 'Counter.count = 0;', instantiates three separate Counter objects, and returns 'Counter.count' (evaluating to exactly 3).

Furthermore, we implement the Day 22 Assignment specifications: authoring a utility class named 'MathUtil' featuring a 'public static int square(int n)' method that calculates and returns 'n * n' without requiring an instantiated object, validated through 'Solution.test()' returning 'MathUtil.square(6)'.

In enterprise software engineering—including microservice telemetry metric registries (such as Prometheus and Micrometer meter registries), distributed request counters, and high-performance financial math libraries—the static keyword represents the standard pattern for shared instance tracking and stateless mathematical routines. When constructing these production entities, software engineers enforce four key architectural guarantees:
1. Static Initialization & Isolation: In the Counter class, 'count' is declared as 'static int count = 0;'. In test entrypoints ('Solution.testCount()'), the static count is explicitly reset to 0 before instantiating objects to guarantee 100% deterministic test isolation.
2. Constructor Increment Side-Effect: Every time 'new Counter()' executes, its constructor runs 'count++', incrementing the universal shared integer by exactly 1. Instantiating two objects results in count 2; instantiating a third results in count 3.
3. Stateless Pure Function Execution: In MathUtil, 'square(int n)' is declared 'public static'. It holds zero state, depends on zero external variables, and computes 'n * n' with pure mathematical determinism across all positive numbers, negative numbers (e.g. -4 * -4 = 16), and zero (0 * 0 = 0).
4. Comprehensive Automated Test Verification: The test harness validates every requirement: asserting baseline count 0, asserting sequential increments across multiple instances (1, 2, 3), asserting mathematical square accuracy across varied integers, and proving that MathUtil requires zero heap object allocations.

In our canonical Solution class below, we provide the complete implementation conforming to the Day 22 Challenge and Assignment specifications, accompanied by an exhaustive automated test harness. In the interactive lab below, inspect the code, execute the verification harness, and establish complete mastery over the static keyword, class-level memory, and static utility functions before advancing to Exception Handling in Day 23.""",
            "code": """// Production Solution conforming to Day 22 Challenge Specifications
class Counter {
    // Shared static field: One copy for the entire class
    static int count = 0;

    // Constructor: Increments the shared static counter upon every instantiation
    Counter() {
        count++;
    }
}

// Assignment Domain: Static Math Utility Class
class MathUtil {
    // Pure static calculation: Operates without object instantiation
    public static int square(int n) {
        return n * n;
    }
}

public class Solution {
    // Challenge verification entrypoint: Resets count, creates 3 objects, returns count
    public static int testCount() {
        Counter.count = 0; // Explicit test isolation reset
        new Counter();
        new Counter();
        new Counter();
        return Counter.count; // Expected: 3
    }

    // Assignment verification entrypoint: Returns square of 6
    public static int test() {
        return MathUtil.square(6); // Expected: 36
    }

    public static void main(String[] args) {
        System.out.println("=== DAY 22: COUNTER STATE TRACKER & MATHUTIL LAB ===");

        // Test 1: Challenge Verification via Solution.testCount()
        int countResult = testCount();
        System.out.println("Test 1 - Solution.testCount() Result: " + countResult + " (Expected: 3)");
        if (countResult != 3) throw new AssertionError("Test 1 Failed: Counter must evaluate to 3");

        // Test 2: Step-by-step Counter verification
        Counter.count = 0;
        if (Counter.count != 0) throw new AssertionError("Initial static count must be 0");
        new Counter();
        new Counter();
        if (Counter.count != 2) throw new AssertionError("Creating 2 objects must result in count 2");
        new Counter();
        if (Counter.count != 3) throw new AssertionError("Creating 3rd object must result in count 3");
        System.out.println("Test 2 - Step-by-step Counter Verified: count=" + Counter.count);

        // Test 3: Assignment Verification via Solution.test()
        int mathResult = test();
        System.out.println("Test 3 - Solution.test() Result: " + mathResult + " (Expected: 36)");
        if (mathResult != 36) throw new AssertionError("Test 3 Failed: 6 squared must be 36");

        // Test 4: Comprehensive MathUtil testing
        if (MathUtil.square(6) != 36) throw new AssertionError("6 squared must be 36");
        if (MathUtil.square(-4) != 16) throw new AssertionError("-4 squared must be 16");
        if (MathUtil.square(0) != 0) throw new AssertionError("0 squared must be 0");
        System.out.println("Test 4 - MathUtil boundaries verified: square(-4)=16, square(0)=0");

        System.out.println("\n>>> ALL DAY 22 TEST HARNESS ASSERTIONS VERIFIED CLEANLY! <<<");
    }
}""",
            "checks": [
                {
                    "question": "In the Day 22 Challenge, what does Solution.testCount() return?",
                    "options": [
                        "3, because Counter.count is reset to 0 and three Counter objects are instantiated, incrementing count three times",
                        "0",
                        "1",
                        "null"
                    ],
                    "answer": 0,
                    "explanation": "testCount() resets count to 0, creates 3 Counter instances (incrementing count to 3), and returns Counter.count."
                },
                {
                    "question": "What is the return value of MathUtil.square(-4) in the Day 22 assignment?",
                    "options": [
                        "16, because -4 multiplied by -4 evaluates to positive 16",
                        "-16",
                        "0",
                        "4"
                    ],
                    "answer": 0,
                    "explanation": "-4 * -4 = 16; multiplying two negative numbers yields a positive product."
                },
                {
                    "question": "Why does Solution.testCount() explicitly set 'Counter.count = 0;' before creating new Counter instances?",
                    "options": [
                        "To guarantee test isolation, ensuring that counts accumulated from prior test runs do not pollute the current test",
                        "Because static fields are deleted if not set to 0",
                        "Because Java does not permit count to exceed 3",
                        "To force the JVM to reboot"
                    ],
                    "answer": 0,
                    "explanation": "Resetting static state ensures deterministic test isolation, preventing cross-test pollution."
                },
                {
                    "question": "Why does MathUtil not require any constructors or object instantiation to execute square(int n)?",
                    "options": [
                        "Because square is a static method; static methods belong to the class and are invoked directly as MathUtil.square(n)",
                        "Because square is an abstract method",
                        "Because MathUtil is a native C library",
                        "Because Java automatically creates an invisible object in the background"
                    ],
                    "answer": 0,
                    "explanation": "Static methods are bound directly to the class type and execute without requiring any heap object instantiation."
                }
            ]
        }
    ],
    "summary": [
        "The 'static' keyword binds variables and methods to the Class itself rather than individual heap object instances.",
        "Static fields have exactly ONE shared copy in memory, accessible universally via ClassName.fieldName.",
        "Static methods operate without an object instance, cannot access the 'this' reference, and execute via the fast 'invokestatic' instruction.",
        "Static initialization blocks (<clinit>) execute lazily upon first active class reference under thread-safe JVM synchronization locks.",
        "Static mutable state introduces concurrency race conditions and permanent GC Root memory leak hazards if not managed defensively.",
        "Day 22 Challenge implements Counter with shared static count = 0 (incremented in constructor) and MathUtil.square(n)."
    ],
    "projectStep": {
        "title": "Build Counter State Tracker and MathUtil Engine",
        "steps": [
            "Declare class Counter with shared class field 'static int count = 0;'.",
            "Author constructor Counter() incrementing the static count field upon each instantiation.",
            "Declare utility class MathUtil with pure calculation method 'public static int square(int n)' returning n * n.",
            "Implement 'Solution.testCount()' resetting count to 0, instantiating 3 Counter objects, and returning Counter.count.",
            "Execute the test harness verifying static accumulation, test isolation, and mathematical square precision."
        ]
    }
}
