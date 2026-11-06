import sys

p1_content = """### 1. Class-Level State vs Heap Instance State: Static Fields in the Metaspace and Shared Object Memory

In the Java programming language, memory organization fundamentally splits runtime data between heap-allocated object instances and class-level metadata managed by the ClassLoader subsystem. When an engineer defines an ordinary field within a class without any access modifiers beyond visibility, that field is an **instance variable**. Every single time the `new` operator allocates memory for an object, the Java Virtual Machine (JVM) creates a fresh object header, followed by dedicated memory slots for all instance fields belonging to that instance. If your system instantiates ten thousand instances of a user session class, the JVM allocates ten thousand independent copies of every instance field across the garbage-collected heap.

Conversely, declaring a field with the `static` modifier instructs the compiler and runtime to allocate exactly one shared storage cell for that field, tied directly to the loaded class rather than any individual object instance. Historically in Java 7 and earlier, static fields and class metadata resided in a specialized non-heap memory space known as the Permanent Generation (PermGen). Starting in Java 8, PermGen was completely replaced by **Metaspace**, which allocates class metadata in native off-heap memory. However, to simplify garbage collection and object reference tracking, the static variables themselves reside directly inside the mirror `java.lang.Class` object associated with that type, allocated on the standard Java heap! Because the `java.lang.Class` instance is held by the defining `ClassLoader`, its static fields persist for the lifetime of that ClassLoader.

```
+-----------------------------------------------------------------------------------+
| JVM MEMORY ARCHITECTURE & FIELD ALLOCATION                                         |
+-----------------------------------------------------------------------------------+
|  JAVA HEAP                                                                        |
|  +---------------------------+   +-----------------------+   +------------------+ |
|  | Instance 1 (Counter)      |   | Instance 2 (Counter)  |   | Instance 3 (...) | |
|  | - Object Header (12-16B)  |   | - Object Header       |   | - Object Header  | |
|  | (No instance fields)      |   | (No instance fields)  |   |                  | |
|  +---------------------------+   +-----------------------+   +------------------+ |
|                                                                                   |
|  +------------------------------------------------------------------------------+ |
|  | java.lang.Class<Counter> Object (Heap Mirror held by AppClassLoader)          | |
|  | - Type metadata reference -> Metaspace Counter Class Definition             | |
|  | - static int count = 3    <--- SINGLE SHARED SLOT ACROSS ALL INSTANCES       | |
|  +------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

Understanding this single shared slot is critical when tracking enterprise resources or tracking creation metrics. Consider the classic `Counter` pattern utilized in telemetry and resource monitors. When you declare:

```java
class Counter {
    static int count = 0;

    Counter() {
        count++;
    }
}
```

Every time the constructor `Counter()` executes, it does not modify a local or per-instance slot. Instead, the bytecode emits an `iputstatic` instruction that updates the single `count` variable held in the `Class<Counter>` structure.
1. When `new Counter()` executes for the first time, `Counter.count` increments from `0` to `1`.
2. When `new Counter()` executes a second time, a separate heap object is allocated for the second counter instance, but its constructor targets the exact same static slot, incrementing `Counter.count` from `1` to `2`.
3. When `new Counter()` executes a third time, `Counter.count` increments from `2` to `3`.

If an engineer inspects `c1.count`, `c2.count`, and `Counter.count`, all three evaluate to `3`. In fact, accessing a static field through an object reference (e.g., `instance.count`) is a major anti-pattern in Java. The compiler merely translates `instance.count` into `Counter.count` at compile time and emits a compiler warning, because the instance reference is completely discarded at runtime. Even if `instance` evaluates to `null`, invoking `((Counter) null).count` executes successfully without throwing a `NullPointerException`! This astonishing quirk proves that static fields belong strictly to the type namespace, not the heap instance.

In high-throughput enterprise systems, relying on static variables requires extreme caution. Because a static field is rooted in the `ClassLoader`, any object reference assigned to a static field will never be collected by the Garbage Collector as long as the ClassLoader remains alive. Assigning large collections, caches, or connection pools to static references without explicit eviction mechanisms creates severe memory leaks that eventually trigger `java.lang.OutOfMemoryError: Java heap space`. Always ensure static fields are either primitive counters, immutable configuration constants, or safely managed singletons with bounded lifecycles.
"""

p2_content = """### 2. Static Methods & The Absence of `this`: Why Class Utilities Cannot Access Instance Context

In Java object-oriented design, methods define the behavioral capabilities of a software model. However, methods operate under two distinctly different execution contexts depending on whether the `static` keyword is attached to their declaration: **instance methods** and **static methods**. The difference lies not merely in syntax, but at the foundational level of JVM bytecode execution and stack frame memory layouts.

When a thread calls an instance method, the JVM executes the `invokevirtual` (or `invokespecial` for private/super calls) bytecode instruction. Crucially, the JVM stack frame created for an instance method reserves index `0` of its Local Variable Table for a hidden reference: the `this` pointer, which points directly to the target object instance on the heap. Any invocation of instance fields like `this.balance` or instance methods like `this.deposit()` reads through this hidden reference. If an instance method is called on a reference that evaluates to `null`, the JVM attempts to dereference slot `0` and immediately throws a `NullPointerException`.

In stark contrast, when a thread calls a **static method**, the compiler emits the `invokestatic` bytecode instruction. In the stack frame of a static method:
- There is NO `this` reference placed in local variable slot `0`.
- Local variable slot `0` is immediately occupied by the first declared method argument (or the first slot of a primitive).
- The method operates entirely detached from any individual heap object instance.
- Consequently, attempting to write `this.something` or calling an unadorned instance method inside a static method produces a compile-time error: `non-static variable this cannot be referenced from a static context`.

```
+------------------------------------------------------------------------------------+
| JVM STACK FRAME LOCAL VARIABLE TABLE COMPARISON                                    |
+------------------------------------------------------------------------------------+
| INSTANCE METHOD STACK FRAME (invokevirtual)                                        |
| Slot 0: [ this reference (pointer to heap object instance) ]                       |
| Slot 1: [ parameter 1 (e.g. int amount)                    ]                       |
| Slot 2: [ parameter 2 / local variable                     ]                       |
+------------------------------------------------------------------------------------+
| STATIC METHOD STACK FRAME (invokestatic)                                           |
| Slot 0: [ parameter 1 (e.g. int n) - NO THIS POINTER!      ]                       |
| Slot 1: [ parameter 2 / local variable                     ]                       |
| Slot 2: [ local variable                                   ]                       |
+------------------------------------------------------------------------------------+
```

Because static methods do not require an existing heap object instance, they serve as the premier mechanism for implementing **pure utility methods** and **stateless mathematical algorithms**. Consider the classic `MathUtil` class:

```java
public class MathUtil {
    // Private constructor prevents unwanted heap instantiations:
    private MathUtil() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    public static int square(int n) {
        return n * n;
    }

    public static int max(int a, int b) {
        return (a >= b) ? a : b;
    }
}
```

Notice the deliberate design patterns in `MathUtil`:
1. **Direct Class Invocation**: Callers do not execute `new MathUtil().square(6)`. Doing so would waste garbage collection cycles allocating a useless object header and zero fields. Instead, callers write `MathUtil.square(6)`. The call dispatches instantly via `invokestatic`, providing peak CPU cache locality and zero heap churn.
2. **Defensive Private Constructor**: If an engineer attempts to write `MathUtil util = new MathUtil();`, the compiler rejects it with `MathUtil() has private access in MathUtil`. Even if an attacker attempts reflection bypass via `Constructor.setAccessible(true)`, the explicit `UnsupportedOperationException` halts instantiation at runtime. This pattern is identically utilized across standard Java libraries such as `java.lang.Math`, `java.util.Collections`, and `java.util.Arrays`.
3. **Stateless Idempotency**: Pure static methods depend exclusively on the arguments passed into their parameters. Given input `6`, `MathUtil.square(6)` will return `36` every time, across every thread, with zero side effects. This makes static utility methods trivially testable, deterministic, and optimal candidates for HotSpot JIT compiler inlining.
"""

p3_content = """### 3. Class Initialization Lifecycle: Static Initializers, `<clinit>` vs `<init>`, and Execution Order

To effectively navigate complex enterprise systems, an architect must understand the exact chronological lifecycle through which the Java Virtual Machine brings a class from raw `.class` bytecode bytes into fully initialized runtime execution. Many difficult bugs arise when engineers confuse class loading and static initialization with object instantiation.

The JVM class lifecycle consists of three distinct phases: **Loading**, **Linking** (comprising Verification, Preparation, and Resolution), and **Initialization**.
1. **Loading**: The ClassLoader locates the binary bytecode for the class (from a `.jar` archive, network stream, or filesystem) and builds a `java.lang.Class` instance in memory.
2. **Linking**: The JVM verifies bytecode security constraints, prepares static fields by zeroing their memory (e.g., setting numeric static fields to `0` and object references to `null`), and resolves symbolic references into direct memory pointers.
3. **Initialization**: The JVM executes the synthesized class initializer method, known internally at the bytecode level as `<clinit>`.

The `<clinit>` method is automatically generated by `javac`. It bundles together all inline static variable initializers (such as `static int limit = 100;`) and all explicit `static { ... }` blocks in the exact textual order in which they appear in the source code.

```java
public class SystemConfig {
    // 1. Static field initializer:
    public static int BASE_PORT = 8080;
    public static String HOST_NAME;

    // 2. Static initialization block:
    static {
        String envPort = System.getenv("APP_PORT");
        if (envPort != null) {
            BASE_PORT = Integer.parseInt(envPort);
        }
        HOST_NAME = "cluster.prod.internal";
        System.out.println("<clinit> executed: SystemConfig class initialized");
    }

    // 3. Instance field initializer:
    private int connectionId;

    // 4. Instance constructor (<init>):
    public SystemConfig(int id) {
        this.connectionId = id;
        System.out.println("<init> executed: Instance created with id " + id);
    }
}
```

Now observe the critical execution guarantees established by the JVM specification:
- `<clinit>` executes **lazily and exactly ONCE per ClassLoader**. It is triggered ONLY when the class is first actively used—such as referencing a static field (`SystemConfig.BASE_PORT`), invoking a static method, or creating an instance via `new SystemConfig(1)`.
- `<clinit>` execution is strictly synchronized by the JVM internal class loading locks. Even if a hundred threads simultaneously reference `SystemConfig` for the first time, only one thread executes `<clinit>`, while all ninety-nine other threads block until initialization finishes.
- Once `<clinit>` completes, subsequent instantiations via `new SystemConfig(...)` NEVER run `<clinit>` again! Instead, each `new` allocation runs only the instance initialization method `<init>` (which runs instance field initializers and the constructor).

Furthermore, when inheritance hierarchies are loaded, the JVM enforces a strict hierarchical initialization protocol. If class `SubClass` extends `SuperClass`, the JVM mandates that `SuperClass`'s `<clinit>` must finish executing completely before `SubClass`'s `<clinit>` begins! This prevents a subclass static initializer from reading uninitialized static state from its parent.

```
EXECUTION LIFECYCLE CHRONOLOGY:
[Trigger: First reference to SystemConfig]
   │
   ▼
[Phase 1: JVM ClassLoader loads SystemConfig.class bytes]
   │
   ▼
[Phase 2: Linking -> Zero-initialize static fields (BASE_PORT=0, HOST_NAME=null)]
   │
   ▼
[Phase 3: <clinit> runs ONCE (BASE_PORT=8080, static block executes)]
   │
   ├─► First `new SystemConfig(1)` runs <init> (Instance 1 allocated on Heap)
   ├─► Second `new SystemConfig(2)` runs <init> (Instance 2 allocated on Heap)
   └─► Third `new SystemConfig(3)` runs <init> (Instance 3 allocated on Heap)
```

Be wary of exceptions thrown inside static initializers! If any statement inside a `static { ... }` block throws an uncaught runtime exception (such as `NumberFormatException` or `NullPointerException`), the JVM wraps it in a `java.lang.ExceptionInInitializerError`. Once a class fails initialization, any subsequent attempt by any thread to touch that class will immediately throw a `java.lang.NoClassDefFoundError: Could not initialize class ...`, permanently disabling the class for the lifetime of that application run. Always guard static initializers with bulletproof error handling, and never write unchecked external network or disk calls inside static blocks.
"""

p4_content = """### 4. Production Hazards: Static Memory Leaks, Concurrency Hazards, and Mutable Static State

While the `static` keyword provides high utility and seamless global accessibility, it represents one of the most abused features in enterprise software engineering. In production environments, mutable static state is a notorious source of severe architectural anti-patterns, catastrophic memory leaks, and insidious concurrency bugs.

The first major hazard is the **Static Reference Memory Leak**. When an object is allocated on the Java heap, its eligibility for Garbage Collection (GC) is governed by GC Roots. GC Roots include active thread stack frames, JNI references, and, crucially, **classes loaded by system ClassLoaders and their static fields**. If a static variable holds a reference to a collection:

```java
// SEVERE ANTI-PATTERN: Unbounded static cache!
public class RequestTracker {
    public static final List<HttpRequest> HISTORY = new ArrayList<>();

    public static void log(HttpRequest request) {
        HISTORY.add(request); // Objects are permanently anchored to the ClassLoader!
    }
}
```

Because `RequestTracker.class` is held by the application ClassLoader, the `HISTORY` list will NEVER be garbage collected. As HTTP requests pour into the microservice, the list expands indefinitely. Each `HttpRequest` anchors byte buffers, header strings, and user payload objects. Within hours or days, the JVM heap exhausts available memory, triggering frequent Stop-The-World GC pauses and culminating in an unrecoverable `OutOfMemoryError`. In enterprise systems, caching must always be delegated to bounded cache engines (such as Caffeine or Guava Cache) configured with strict time-to-live (TTL) and maximum capacity eviction policies, never unmanaged static lists.

The second critical hazard is **Static Concurrency Race Conditions**. Because a static field is globally shared across every thread running inside the JVM process, concurrent writes without explicit synchronization cause race conditions, torn reads, and lost updates. Consider our `Counter` class running in a web server where fifty worker threads process inbound requests concurrently:

```java
class Counter {
    static int count = 0;
    Counter() {
        count++; // CRITICAL RACE CONDITION: count++ is NOT atomic!
    }
}
```

The increment expression `count++` compiles down to three separate bytecode operations:
1. `getstatic`: Fetch the current value from the shared static memory cell into the local operand stack.
2. `iadd`: Add `1` to the value on the operand stack.
3. `putstatic`: Write the incremented value back into the static memory cell.

If Thread A and Thread B simultaneously execute step 1 when `count` is `5`, both threads compute `6`, and both write `6` back to memory. Two objects were instantiated, but `count` only incremented by `1`. The update is permanently lost! To eliminate this race condition in production without heavy locking overhead, Java provides high-performance atomic primitives in `java.util.concurrent.atomic`:

```java
import java.util.concurrent.atomic.AtomicInteger;

public class ThreadSafeCounter {
    private static final AtomicInteger COUNT = new AtomicInteger(0);

    public ThreadSafeCounter() {
        COUNT.incrementAndGet(); // Lock-free hardware CAS (Compare-And-Swap)
    }

    public static int getCount() {
        return COUNT.get();
    }
}
```

By leveraging `AtomicInteger`, updates utilize lock-free CPU-level Compare-And-Swap (CAS) instructions, guaranteeing absolute atomicity and memory visibility across all CPU cores without deadlocks.

Another essential technique for per-thread isolation is `java.lang.ThreadLocal<T>`. When state must be accessible across multiple service layers without passing it as an explicit method parameter, a `static final ThreadLocal<RequestContext>` allocates an isolated variable copy for each executing thread. However, beware: when worker threads are managed by application server thread pools (e.g., Tomcat or Netty), failing to call `threadLocal.remove()` in a `finally` block creates serious memory leaks and context leakage across recycled requests.

Finally, distinguish between mutable static variables and immutable constants. Declaring `public static final double SALES_TAX = 0.0825;` creates a compile-time constant that HotSpot inlines directly into bytecode call sites. But beware of arrays: `public static final int[] NUMBERS = {1, 2, 3};` makes the reference immutable, but the array elements can still be mutated by any external code (`NUMBERS[0] = 999;`)! Always wrap collections in `Collections.unmodifiableList()` or `List.of()` to guarantee true immutability.
"""

p5_content = """### 5. Guided Coding Lab & Milestone Verification: Building `Counter` and `MathUtil`

To solidify your mastery of static fields, static methods, and class-level memory mechanics, we now construct the complete production implementations required for the Day 22 curriculum milestones: the **Static Instance Counter** and the **Static Math Utility**.

In the first challenge, we create a class named `Counter` featuring a package-private static integer field `count` initialized to `0`. The constructor `Counter()` must increment this shared static field each time a new instance is created. We then construct `Solution.testCount()` which resets `Counter.count = 0`, instantiates three separate `Counter` objects via `new Counter()`, and returns the final value of `Counter.count`.

```java
// ============================================================================
// CHALLENGE 1: STATIC INSTANCE COUNTER
// ============================================================================
class Counter {
    // Package-private static field shared by all instances:
    static int count = 0;

    // Default constructor increments the shared class-level count:
    Counter() {
        count++;
    }
}

public class Solution {
    public static int testCount() {
        // Step 1: Explicitly reset the static state to ensure test isolation:
        Counter.count = 0;

        // Step 2: Instantiate three distinct objects on the heap:
        new Counter(); // count becomes 1
        new Counter(); // count becomes 2
        new Counter(); // count becomes 3

        // Step 3: Return the shared static counter value:
        return Counter.count; // Returns 3
    }
}
```

Let us trace the execution of `Solution.testCount()` step-by-step:
1. `Counter.count = 0;`: The JVM emits `iconst_0` and `putstatic Counter.count:I`. The shared memory location in `Class<Counter>` is explicitly zeroed. This reset is vital in automated test runners because previous test executions might have left residual counts in static memory.
2. `new Counter();`: The JVM allocates an instance on the heap, pushes its reference, invokes `invokespecial Counter.<init>()`. Inside `<init>`, the constructor loads `Counter.count`, increments it to `1`, and writes it back via `putstatic`.
3. The next two instantiations repeat this sequence, driving `Counter.count` to `2` and then `3`.
4. `return Counter.count;`: The method emits `getstatic Counter.count:I` and `ireturn`, delivering `3`.

In automated test suites (such as JUnit 5), static fields introduce state pollution between independent unit tests. If Test A leaves `Counter.count` at `5` and Test B expects it to start at `0`, Test B will fail spuriously. Always use `@BeforeEach` teardown hooks to reset static counters, or better yet, inject fresh state through constructors to preserve test independence.

In the second challenge, we create the `MathUtil` class containing a static utility method `square(int n)` that computes and returns the square of the integer `n` without requiring any object instantiation.

```java
// ============================================================================
// CHALLENGE 2: STATIC MATH UTILITY
// ============================================================================
class MathUtil {
    // Static method: callable directly via class name without instantiating MathUtil:
    public static int square(int n) {
        return n * n;
    }
}

public class SolutionAdv {
    public static int test() {
        // Direct invocation via class identifier:
        return MathUtil.square(6); // Evaluates to 36
    }
}
```

Notice the critical characteristics of `MathUtil.square(int n)`:
- Calling `MathUtil.square(6)` dispatches via `invokestatic MathUtil.square:(I)I`. The integer literal `6` is pushed onto the operand stack, multiplied by itself via `imul`, and returned via `ireturn`.
- Edge cases to consider in production:
  - If `n = 0`, `0 * 0 = 0`.
  - If `n` is negative, such as `-5`, `(-5) * (-5) = 25` (the result is always non-negative for inputs within integer square limits).
  - Integer overflow: If `n = 100,000`, `100,000 * 100,000 = 10,000,000,000`, which exceeds `Integer.MAX_VALUE` (`2,147,483,647`) and overflows to `1,410,065,408`. In mission-critical financial software, you should check for overflow using `Math.multiplyExact(n, n)` or use 64-bit `long` arithmetic.

By completing both challenges, you have verified the two pillars of static architecture: shared class-level state via static fields and zero-allocation stateless operations via static utility methods.
"""

day22_code = f'''# Day 22: Static Keyword: Static Fields, Methods & Class-Level Memory Topologies

DAY_22 = {{
    "day": 22,
    "title": "Static Keyword: Static Fields, Methods & Class-Level Memory Topologies",
    "goal": "Master the static keyword in Java from class-level memory topologies to static initialization blocks. Understand static fields vs heap instance fields, static methods and the absence of the this reference, the <clinit> class initialization protocol, static memory leak hazards, thread-safety pitfalls, and hands-on implementation of the Counter and MathUtil challenges.",
    "parts": [
        {{
            "part": 1,
            "title": "Class-Level State vs Heap Instance State: Static Fields in the Metaspace and Shared Object Memory",
            "content": """{p1_content.strip()}""",
            "check": {{
                "question": "Where do static variables reside in modern Java (Java 8+) memory architecture?",
                "options": [
                    "Inside the mirror java.lang.Class object on the Java heap, referenced by the defining ClassLoader",
                    "Directly inside each individual heap object instance header",
                    "Inside the JVM stack frame of the currently executing thread",
                    "In external operating system swap memory outside the JVM address space"
                ],
                "answer": 0
            }}
        }},
        {{
            "part": 2,
            "title": "Static Methods & The Absence of this: Why Class Utilities Cannot Access Instance Context",
            "content": """{p2_content.strip()}""",
            "check": {{
                "question": "Why is the 'this' reference unavailable inside a static method in Java?",
                "options": [
                    "Because static methods are invoked via invokestatic and do not receive an object instance reference in local variable slot 0",
                    "Because static methods run in a separate C++ process where Java pointers are prohibited",
                    "Because static methods can only be executed by the Garbage Collector thread",
                    "Because 'this' is deprecated in modern Java syntax"
                ],
                "answer": 0
            }}
        }},
        {{
            "part": 3,
            "title": "Class Initialization Lifecycle: Static Initializers, <clinit> vs <init>, and Execution Order",
            "content": """{p3_content.strip()}""",
            "check": {{
                "question": "When does the JVM execute the synthesized static initializer method <clinit> for a class?",
                "options": [
                    "Lazily and exactly once when the class is first actively referenced or initialized by a ClassLoader",
                    "Every time a new instance of the class is created using the 'new' operator",
                    "Continuously on every background garbage collection cycle",
                    "Only when the JVM process is shutting down"
                ],
                "answer": 0
            }}
        }},
        {{
            "part": 4,
            "title": "Production Hazards: Static Memory Leaks, Concurrency Hazards, and Mutable Static State",
            "content": """{p4_content.strip()}""",
            "check": {{
                "question": "Why does storing objects in an unmanaged static collection frequently cause memory leaks in Java?",
                "options": [
                    "Because static fields act as GC Roots through the ClassLoader, preventing referenced objects from being garbage collected",
                    "Because static collections automatically encrypt their data and hide it from the operating system",
                    "Because the JVM deletes the heap whenever a static collection exceeds ten elements",
                    "Because static collections can only store primitive integers and reject object references"
                ],
                "answer": 0
            }}
        }},
        {{
            "part": 5,
            "title": "Guided Coding Lab & Milestone Verification: Building Counter and MathUtil",
            "content": """{p5_content.strip()}""",
            "check": {{
                "question": "In the Day 22 Counter challenge, why does Counter.count evaluate to 3 after three instantiations?",
                "options": [
                    "Because count is a shared static field incremented by 1 inside the constructor each time new Counter() is called",
                    "Because the Java compiler hardcodes 3 whenever any class named Counter is compiled",
                    "Because each new Counter() allocates a brand new count variable that overrides previous values to 3",
                    "Because static variables multiply their value by the number of active CPU cores"
                ],
                "answer": 0
            }}
        }}
    ]
}}
'''

with open("scripts/block5_day22.py", "w", encoding="utf-8") as f:
    f.write(day22_code)
print("Wrote scripts/block5_day22.py successfully")
