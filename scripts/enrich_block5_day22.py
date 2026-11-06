import sys
sys.path.insert(0, 'scripts')
import pprint

# Day 22 Enrichment
from block5_day22 import DAY_22

d22_codes = [
    """public class SharedMemoryLab {
    public static class Counter {
        // Shared class-level variable in Class<Counter> mirror on heap:
        static int count = 0;
        int instanceId;

        Counter(int id) {
            this.instanceId = id;
            count++; // Bytecode: getstatic, iconst_1, iadd, putstatic
        }
    }

    public static void main(String[] args) {
        System.out.println("Initial shared count: " + Counter.count); // 0
        Counter c1 = new Counter(101);
        Counter c2 = new Counter(102);
        Counter c3 = new Counter(103);
        System.out.println("Final shared count across all instances: " + Counter.count); // 3
        System.out.println("c1 sees count: " + c1.count + ", instanceId: " + c1.instanceId);
    }
}""",
    """public class MathUtilLab {
    public static class MathUtil {
        // Private constructor prevents instantiation:
        private MathUtil() {
            throw new UnsupportedOperationException("Utility class cannot be instantiated");
        }

        // Pure static utility methods:
        public static int square(int n) {
            return n * n; // Invokestatic: no 'this' pointer in local variable slot 0
        }

        public static int max(int a, int b) {
            return (a >= b) ? a : b;
        }
    }

    public static void main(String[] args) {
        int sq = MathUtil.square(6); // 36
        int m = MathUtil.max(15, 42); // 42
        System.out.println("MathUtil.square(6) = " + sq);
        System.out.println("MathUtil.max(15, 42) = " + m);
    }
}""",
    """public class ClassInitLab {
    public static class SystemConfig {
        public static int BASE_PORT = 8080;
        public static String REGION;

        // Static initialization block (<clinit>):
        static {
            REGION = "us-east-1";
            System.out.println("  [<clinit>] SystemConfig class initialized lazily");
        }

        // Instance constructor (<init>):
        public SystemConfig() {
            System.out.println("  [<init>] Instance created on Heap");
        }
    }

    public static void main(String[] args) {
        System.out.println("Before touching SystemConfig...");
        // Touching static field triggers <clinit> ONCE:
        System.out.println("Accessing BASE_PORT: " + SystemConfig.BASE_PORT);
        // Instantiations only run <init>:
        new SystemConfig();
        new SystemConfig();
    }
}""",
    """import java.util.concurrent.atomic.AtomicInteger;

public class StaticHazardLab {
    // Thread-safe lock-free static counter using CPU Compare-And-Swap:
    public static final AtomicInteger GLOBAL_REQUEST_COUNT = new AtomicInteger(0);

    // Thread-isolated context storage:
    private static final ThreadLocal<String> TRANSACTION_ID = new ThreadLocal<>();

    public static void processRequest(String txId) {
        TRANSACTION_ID.set(txId);
        try {
            GLOBAL_REQUEST_COUNT.incrementAndGet(); // Thread-safe CAS
            System.out.println("Thread " + Thread.currentThread().getName() + " handling tx: " + TRANSACTION_ID.get());
        } finally {
            TRANSACTION_ID.remove(); // Prevent ThreadLocal memory leaks in thread pools!
        }
    }

    public static void main(String[] args) {
        processRequest("TX-9901");
        System.out.println("Total requests processed: " + GLOBAL_REQUEST_COUNT.get());
    }
}""",
    """public class SolutionLab {
    static class Counter {
        static int count = 0;
        Counter() {
            count++;
        }
    }

    static class MathUtil {
        public static int square(int n) {
            return n * n;
        }
    }

    public static class Solution {
        public static int testCount() {
            Counter.count = 0; // Reset for test isolation
            new Counter();
            new Counter();
            new Counter();
            return Counter.count; // Returns 3
        }
    }

    public static void main(String[] args) {
        int c = Solution.testCount();
        int s = MathUtil.square(6);
        System.out.println("Counter test result: " + c); // 3
        System.out.println("MathUtil.square(6):   " + s); // 36
    }
}"""
]

d22_checks = [
    [
        {
            "question": "Where do static variables reside in modern Java (Java 8+) memory architecture?",
            "options": [
                "Inside the mirror java.lang.Class object on the Java heap, referenced by the defining ClassLoader",
                "Directly inside each individual heap object instance header",
                "Inside the JVM stack frame of the currently executing thread",
                "In external operating system swap memory outside the JVM address space"
            ],
            "answer": 0,
            "explanation": "In Java 8+, class metadata resides in native Metaspace while static fields reside directly in the java.lang.Class instance on the Java Heap."
        },
        {
            "question": "What happens to a static field when multiple instances of a class are instantiated?",
            "options": [
                "All instances share and modify the exact same single static storage location",
                "Each instance allocates a private independent copy of the static field",
                "The static field is deleted and re-created from scratch on every 'new' call",
                "The static field is moved to CPU registers and hidden from other threads"
            ],
            "answer": 0,
            "explanation": "Static fields belong to the class type itself; all instances share the single memory cell allocated in the Class object."
        },
        {
            "question": "Which bytecode instruction is used by the JVM to update a static field?",
            "options": [
                "putstatic",
                "putfield",
                "invokevirtual",
                "aaload"
            ],
            "answer": 0,
            "explanation": "putstatic writes values to static fields, whereas putfield writes values to instance fields on the heap."
        },
        {
            "question": "Why does accessing ((Counter) null).count not throw a NullPointerException at runtime?",
            "options": [
                "Because static field access is resolved by the compiler at compile-time to the class type, discarding the instance reference",
                "Because Java automatically creates a dummy object when null is dereferenced",
                "Because count is automatically initialized to Integer.MAX_VALUE",
                "Because the JVM disables null checking when running in production mode"
            ],
            "answer": 0,
            "explanation": "The compiler transforms ((Counter) null).count into Counter.count at compile time; the instance reference is never dereferenced at runtime."
        }
    ],
    [
        {
            "question": "Why is the 'this' reference unavailable inside a static method in Java?",
            "options": [
                "Because static methods are invoked via invokestatic and do not receive an object instance reference in local variable slot 0",
                "Because static methods run in a separate C++ process where Java pointers are prohibited",
                "Because static methods can only be executed by the Garbage Collector thread",
                "Because 'this' is deprecated in modern Java syntax"
            ],
            "answer": 0,
            "explanation": "Static methods dispatch via invokestatic without an object context, so slot 0 of the local variable array contains the first parameter rather than 'this'."
        },
        {
            "question": "Which bytecode instruction executes a static method call in Java?",
            "options": [
                "invokestatic",
                "invokevirtual",
                "invokeinterface",
                "invokedynamic"
            ],
            "answer": 0,
            "explanation": "invokestatic is the dedicated bytecode instruction for invoking class-level static methods without dynamic V-Table lookup."
        },
        {
            "question": "Why should pure utility classes declare a private constructor?",
            "options": [
                "To prevent external callers and frameworks from instantiating useless heap objects",
                "To force the JVM to run in 32-bit compatibility mode",
                "To make all methods in the class run asynchronously",
                "To automatically convert the class into an interface"
            ],
            "answer": 0,
            "explanation": "Declaring a private constructor prevents accidental instantiation of stateless utility classes, saving heap memory and GC overhead."
        },
        {
            "question": "What compile-time error occurs if a static method attempts to call an unadorned instance method?",
            "options": [
                "non-static method cannot be referenced from a static context",
                "class file format version mismatch",
                "cyclic dependency detected in bytecode",
                "illegal memory access exception"
            ],
            "answer": 0,
            "explanation": "Static methods lack an instance context ('this'), so invoking an instance method without an explicit object reference is rejected by javac."
        }
    ],
    [
        {
            "question": "When does the JVM execute the synthesized static initializer method <clinit> for a class?",
            "options": [
                "Lazily and exactly once when the class is first actively referenced or initialized by a ClassLoader",
                "Every time a new instance of the class is created using the 'new' operator",
                "Continuously on every background garbage collection cycle",
                "Only when the JVM process is shutting down"
            ],
            "answer": 0,
            "explanation": "<clinit> runs lazily upon first active use of the class (referencing a static field/method or creating an instance) and executes exactly once per ClassLoader."
        },
        {
            "question": "If an uncaught exception is thrown inside a static initialization block, what does the JVM propagate?",
            "options": [
                "java.lang.ExceptionInInitializerError",
                "java.lang.NullPointerException",
                "java.lang.StackOverflowError",
                "java.lang.IllegalArgumentException"
            ],
            "answer": 0,
            "explanation": "The JVM wraps any uncaught runtime exception thrown inside <clinit> inside an ExceptionInInitializerError, permanently failing the class."
        },
        {
            "question": "In an inheritance hierarchy (class SubClass extends SuperClass), in what order do static initializers run?",
            "options": [
                "SuperClass <clinit> runs and completes before SubClass <clinit> begins",
                "SubClass <clinit> runs first, then SuperClass <clinit>",
                "Both execute concurrently on separate threads without synchronization",
                "Static initializers are prohibited in classes with inheritance"
            ],
            "answer": 0,
            "explanation": "The JVM guarantees that a superclass's static initialization (<clinit>) completes fully before any subclass static initialization begins."
        },
        {
            "question": "How does the JVM guarantee thread safety during class initialization?",
            "options": [
                "The ClassLoader acquires an internal initialization lock so only one thread executes <clinit> while others block",
                "By disabling all other CPU cores until initialization completes",
                "By serializing all classes to disk before loading",
                "Class initialization is not thread-safe and requires external synchronized blocks"
            ],
            "answer": 0,
            "explanation": "The JVM specification mandates class-level initialization locks during class loading, guaranteeing strictly thread-safe single execution."
        }
    ],
    [
        {
            "question": "Why does storing objects in an unmanaged static collection frequently cause memory leaks in Java?",
            "options": [
                "Because static fields act as GC Roots through the ClassLoader, preventing referenced objects from being garbage collected",
                "Because static collections automatically encrypt their data and hide it from the operating system",
                "Because the JVM deletes the heap whenever a static collection exceeds ten elements",
                "Because static collections can only store primitive integers and reject object references"
            ],
            "answer": 0,
            "explanation": "Classes loaded by system ClassLoaders remain alive for the lifetime of the JVM; static references prevent the GC from reclaiming referenced objects."
        },
        {
            "question": "Why is 'count++' on a static variable thread-unsafe in concurrent environments?",
            "options": [
                "Because count++ compiles to three non-atomic bytecode instructions: getstatic, iadd, and putstatic",
                "Because the CPU refuses to perform addition on static variables",
                "Because Java forces static variables to be read-only",
                "Because integer addition only works on single-threaded CPUs"
            ],
            "answer": 0,
            "explanation": "count++ is not atomic; concurrent threads reading and writing simultaneously experience race conditions and lost updates."
        },
        {
            "question": "What class from java.util.concurrent.atomic should be used for thread-safe lock-free integer counters?",
            "options": [
                "AtomicInteger",
                "SynchronizedInt",
                "ThreadSafeNumber",
                "VolatileInt"
            ],
            "answer": 0,
            "explanation": "AtomicInteger provides lock-free hardware-level Compare-And-Swap (CAS) instructions like incrementAndGet() for high-throughput counters."
        },
        {
            "question": "Why is 'public static final int[] NUMS = {1, 2}' not truly immutable?",
            "options": [
                "Because while the array reference cannot change, the internal array elements can still be mutated by external code",
                "Because the 'final' keyword is ignored on arrays by the compiler",
                "Because the array will be deleted after 10 seconds by the GC",
                "Because primitive arrays cannot be declared static"
            ],
            "answer": 0,
            "explanation": "In Java, final on an array prevents reassigning NUMS to a new array, but the array elements (NUMS[0]) remain fully mutable."
        }
    ],
    [
        {
            "question": "In the Day 22 Counter challenge, why does Counter.count evaluate to 3 after three instantiations?",
            "options": [
                "Because count is a shared static field incremented by 1 inside the constructor each time new Counter() is called",
                "Because the Java compiler hardcodes 3 whenever any class named Counter is compiled",
                "Because each new Counter() allocates a brand new count variable that overrides previous values to 3",
                "Because static variables multiply their value by the number of active CPU cores"
            ],
            "answer": 0,
            "explanation": "The shared static variable count is incremented once per constructor call, accumulating from 0 to 1 to 2 to 3."
        },
        {
            "question": "In Solution.testCount(), why is 'Counter.count = 0;' executed before instantiating objects?",
            "options": [
                "To isolate unit test state and ensure previous test runs do not pollute the static counter",
                "Because Java requires all static variables to be zero before constructors can run",
                "To signal to the Garbage Collector to clean the heap",
                "Because static variables lose their memory if not reset explicitly"
            ],
            "answer": 0,
            "explanation": "Because static state persists across method invocations, resetting Counter.count ensures test isolation in automated test runners."
        },
        {
            "question": "What does MathUtil.square(6) return in the Day 22 assignment?",
            "options": [
                "36",
                "12",
                "6",
                "0"
            ],
            "answer": 0,
            "explanation": "MathUtil.square(6) computes 6 * 6, returning 36."
        },
        {
            "question": "What happens if MathUtil.square(0) is executed?",
            "options": [
                "Returns 0 cleanly without exception",
                "Throws an ArithmeticException",
                "Returns -1 as an error code",
                "Hangs the thread in an infinite loop"
            ],
            "answer": 0,
            "explanation": "0 * 0 evaluates to 0 without any error or exception."
        }
    ]
]

DAY_22["minutes"] = 25
DAY_22["recap"] = "Yesterday we mastered Interfaces and Milestone 4 Payment Gateway contracts. Today, we delve into class-level state and the static keyword, exploring Metaspace storage, static methods without this, class initialization <clinit>, and thread-safe counter patterns."
DAY_22["summary"] = [
    "The static keyword associates fields and methods with the class metadata mirror on the heap rather than individual instances.",
    "Static variables occupy a single shared memory cell per ClassLoader, making them ideal for global counters or shared constants.",
    "Static methods are invoked via invokestatic and lack a 'this' pointer in local variable slot 0, preventing access to instance state.",
    "Class initialization (<clinit>) executes lazily and exactly once per ClassLoader, synchronized across all threads.",
    "Unbounded static collections act as GC Roots and cause critical memory leaks in long-running services.",
    "The Counter and MathUtil challenges verify shared class-level state updates and stateless calculation utilities."
]
DAY_22["projectStep"] = {
    "title": "Implement the Static Counter and Math Utility Engine",
    "steps": [
        "Create class Counter with package-private static int count initialized to 0.",
        "Increment count inside constructor Counter() each time a new instance is created.",
        "Author Solution.testCount() resetting Counter.count = 0, creating three Counter instances, and returning Counter.count.",
        "Author MathUtil with public static int square(int n) computing n * n without object instantiation.",
        "Verify testCount() returns 3 and MathUtil.square(6) returns 36 across automated test runners."
    ]
}

for i in range(5):
    DAY_22["parts"][i]["code"] = d22_codes[i]
    DAY_22["parts"][i]["checks"] = d22_checks[i]
    if "check" in DAY_22["parts"][i]:
        del DAY_22["parts"][i]["check"]

with open("scripts/block5_day22.py", "w", encoding="utf-8") as f:
    f.write("# Day 22: Static Keyword: Static Fields, Methods & Class-Level Memory Topologies\n\nDAY_22 = ")
    f.write(pprint.pformat(DAY_22, indent=4, width=120))
    f.write("\n")

print("Enriched Day 22 successfully")
