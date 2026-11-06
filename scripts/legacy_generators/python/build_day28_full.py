import sys
import pprint

p1_content = """### 1. Operating System Threads vs The JVM Thread Model: Green Threads to Native Kernel 1:1 Mapping

In modern enterprise computing, software systems must handle thousands of concurrent requests simultaneously—processing incoming payment authorizations, streaming database telemetry, querying microservice endpoints, and serving web assets. To execute tasks concurrently and fully utilize modern multi-core CPU architectures, Java relies on the foundational abstraction of **Multithreading**.

To understand Java's concurrency model, an engineer must first distinguish between a **Process** and a **Thread**:
- **Process**: An isolated execution environment managed by the host operating system. Each process possesses its own dedicated, virtualized memory address space, private file descriptors, security credentials, and system environment variables. Communication between processes (IPC) requires heavyweight OS mechanisms like network sockets, pipes, or shared memory segments.
- **Thread**: Often described as a "lightweight process", a thread is the smallest schedulable unit of CPU execution within a process. Crucially, all threads running within the same Java Virtual Machine process **share the identical memory space**—including the single garbage-collected Java Heap and Metaspace!

```
+------------------------------------------------------------------------------------+
| JVM PROCESS & THREAD MEMORY ARCHITECTURE (1:1 NATIVE OS MAPPING)                   |
+------------------------------------------------------------------------------------+
| OS PROCESS MEMORY BOUNDARY (JAVA VIRTUAL MACHINE)                                  |
|                                                                                    |
|  SHARED RUNTIME DATA AREAS:                                                        |
|  +-------------------------------------+   +------------------------------------+  |
|  | JAVA HEAP (All Object Instances)    |   | METASPACE (Loaded Class Metadata)  |  |
|  +-------------------------------------+   +------------------------------------+  |
|                                                                                    |
|  PRIVATE PER-THREAD MEMORY STRUCTURES:                                             |
|  +-------------------------+ +-------------------------+ +-----------------------+ |
|  | Worker Thread 1         | | Worker Thread 2         | | Main Thread           | |
|  | - Native Stack (~1MB)   | | - Native Stack (~1MB)   | | - Native Stack (~1MB) | |
|  | - Stack Frames (Locals) | | - Stack Frames (Locals) | | - Stack Frames        | |
|  | - Program Counter (PC)  | | - Program Counter (PC)  | | - Program Counter     | |
|  +-------------------------+ +-------------------------+ +-----------------------+ |
|               │                           │                          │             |
|  ═════════════╪═══════════════════════════╪══════════════════════════╪════════════ |
|  HOST OS KERNEL THREADS (1:1 Native pthread / Windows Thread Scheduling)          |
|  [ CPU Core 0 ]              [ CPU Core 1 ]              [ CPU Core 2 ]            |
+------------------------------------------------------------------------------------+
```

Historically in Java 1.1, the JVM implemented threads using **Green Threads**. Green threads were purely user-space constructs scheduled entirely by the JVM runtime engine without operating system kernel awareness. While lightweight, green threads suffered from a fatal flaw: because the OS only saw a single process thread, all green threads were pinned to a single CPU core! If one green thread executed a blocking disk I/O operation, the entire JVM process froze.

Starting in Java 1.2 and continuing through modern Java, the JVM adopted the **1:1 Native Thread Model**. Every `java.lang.Thread` created in application code corresponds directly to an underlying operating system kernel thread (e.g., POSIX `pthread` on Linux/macOS or a Win32 thread on Windows). The OS kernel scheduler assigns threads across physical CPU cores, preempts execution when timeslices expire, and handles hardware interrupts.

However, native kernel threads carry non-trivial resource costs:
1. **Memory Footprint**: By default, the JVM allocates a dedicated 1MB stack memory buffer (`-Xss1m`) for each thread's call frames. Creating 5,000 threads consumes 5GB of RAM purely for thread stacks, even before allocating any heap objects!
2. **Context Switching Overhead**: When the CPU switches execution from Thread A to Thread B, it must execute a context switch—flushing CPU registers, invalidating translation lookaside buffers (TLBs), and polluting L1/L2 hardware memory caches.
Because of these costs, enterprise architectures use pooled worker threads rather than unconstrained thread creation.
"""

p2_content = """### 2. Task vs Worker: The `Runnable` Contract & Decoupled Execution

In early object-oriented programming tutorials, developers are often taught to create threads by subclassing `java.lang.Thread` directly:
```java
// ANTI-PATTERN: Tightly coupling task logic to Thread execution mechanism
public class LegacyReportGenerator extends Thread {
    @Override
    public void run() {
        System.out.println("Generating financial report...");
    }
}
```
While syntactically valid, subclassing `Thread` is considered a major architectural anti-pattern in enterprise software engineering for two critical reasons:
1. **Single Inheritance Prohibition**: Recall that Java prohibits multiple class inheritance. If your business class extends `Thread`, it can never extend any other domain class (such as `BaseService` or `AuditableEntity`)!
2. **Violation of the Single Responsibility Principle (SRP)**: Subclassing `Thread` bundles two completely unrelated concerns into a single class: **what task to execute** (the report generation algorithm) and **how to schedule execution** (the thread lifecycle and CPU scheduling).

To establish clean, decoupled architecture, Java provides the **`java.lang.Runnable`** interface:
```java
@FunctionalInterface
public interface Runnable {
    void run();
}
```
`Runnable` represents a pure behavioral contract—an abstraction of a **task** that can be executed concurrently. By implementing `Runnable`, your class focuses exclusively on its business logic:

```java
public class Worker implements Runnable {
    @Override
    public void run() {
        // Task logic executed asynchronously or synchronously:
        System.out.println("Work Done");
    }
}
```

```
+------------------------------------------------------------------------------------+
| DECOUPLED ARCHITECTURE: TASK (Runnable) vs WORKER (Thread / Executor)             |
+------------------------------------------------------------------------------------+
| TASK SPECIFICATION:                                                                |
| class Worker implements Runnable {                                                 |
|     public void run() { System.out.println("Work Done"); }                         |
| }                                                                                  |
|                                                                                    |
| EXECUTION DISPATCH CHOICES:                                                        |
| Choice A: Direct Synchronous Run       Choice B: Dedicated OS Thread               |
| Worker w = new Worker();               Worker w = new Worker();                    |
| w.run(); // Runs on main thread!       Thread t = new Thread(w);                   |
|                                        t.start(); // Spawns new native OS thread!  |
|                                                                                    |
| Choice C: Thread Pool Executor (Modern Enterprise Standard)                        |
| ExecutorService pool = Executors.newFixedThreadPool(10);                          |
| pool.submit(new Worker()); // Dispatched to pooled worker thread                   |
+------------------------------------------------------------------------------------+
```

Now consider the critical difference between invoking **`w.run()`** versus **`t.start()`**:
- **Calling `w.run()`**: Directly executes the `run()` method as an ordinary method call on the **currently executing thread** (such as `main`). No new OS thread is spawned, no stack is allocated, and execution is strictly synchronous and blocking.
- **Calling `t.start()`**: Executes an internal native JVM method (`JVM_StartThread`). The JVM requests the host operating system kernel to allocate a new native thread, builds a brand new call stack, transitions the thread into the `RUNNABLE` state, and schedules the OS to invoke the target `run()` method asynchronously.

Attempting to call `t.start()` twice on the same thread instance throws an immediate `java.lang.IllegalThreadStateException`. A thread lifecycle is strictly one-way: once started, it can never be restarted.

To appreciate the broader task abstraction ecosystem, consider the limitation of `Runnable`: its `run()` method returns `void` and cannot throw checked exceptions. When an enterprise microservice needs a background task to compute a result (such as fetching a credit score or aggregating database rows), standard Java provides **`java.util.concurrent.Callable<V>`**:
```java
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}
```
Unlike `Runnable`, `Callable<V>` returns a generic result of type `V` and allows throwing checked exceptions! When submitted to an `ExecutorService`, it returns a `Future<V>` representing the pending asynchronous result.

Furthermore, Java 21 introduced **Virtual Threads (Project Loom)** via `Thread.ofVirtual().start(runnable)`. Virtual threads are lightweight user-mode threads managed by the JVM rather than the OS kernel. Millions of virtual threads can run concurrently on top of a small pool of native carrier threads, mounting when active and unmounting during blocking I/O, completely eliminating the 1MB stack memory tax while retaining the simple synchronous programming model.

"""

p3_content = """### 3. The JVM Thread Lifecycle & State Machine: Exploring `Thread.State` and `isAlive()`

To effectively diagnose thread contention, deadlocks, and hung microservices in production APM tools (such as Dynatrace, Datadog, or VisualVM), an architect must master the formal **JVM Thread State Machine**.

At any given point in time, a Java thread exists in exactly one of the six states defined in the **`java.lang.Thread.State`** enumeration:

```
+------------------------------------------------------------------------------------+
| THE 6 FORMAL JVM THREAD STATES (Thread.State)                                      |
+------------------------------------------------------------------------------------+
| [ 1. NEW ]                                                                         |
| Thread instantiated via new Thread(); not yet started. isAlive() == false.         |
|        │                                                                           |
|        │ t.start()                                                                 |
|        ▼                                                                           |
| [ 2. RUNNABLE ] ◄────────────────────────┐                                         |
| Executing on CPU or waiting for OS timeslice. isAlive() == true.                   |
|        │                                 │                                         |
|        ├──────────► [ 3. BLOCKED ] ──────┤ Lock acquired                           |
|        │            Waiting to enter     │                                         |
|        │            synchronized monitor │                                         |
|        │                                 │                                         |
|        ├──────────► [ 4. WAITING ] ──────┤ notify() / join()                       |
|        │            Object.wait() /      │ completed                               |
|        │            Thread.join()        │                                         |
|        │                                 │                                         |
|        ├──────────► [ 5. TIMED_WAITING ]─┘ Sleep/timeout expires                   |
|        │            Thread.sleep(ms) /                                             |
|        │            wait(timeout)                                                  |
|        │                                                                           |
|        ▼ run() finishes or throws uncaught exception                               |
| [ 6. TERMINATED ]                                                                  |
| Thread execution completed. Call stack destroyed. isAlive() == false.              |
+------------------------------------------------------------------------------------+
```

1. **`NEW`**: The thread object exists on the heap, but `start()` has not yet been called.
2. **`RUNNABLE`**: The thread is active. It may be actively executing bytecode on a CPU core or sitting in the operating system's ready queue waiting for its next CPU timeslice.
3. **`BLOCKED`**: The thread has attempted to enter a `synchronized` block or method, but another thread currently holds the intrinsic monitor lock. It remains blocked until the lock holder exits.
4. **`WAITING`**: The thread is waiting indefinitely for another thread to perform a specific action (e.g., waiting after calling `Object.wait()`, `Thread.join()`, or `LockSupport.park()`).
5. **`TIMED_WAITING`**: The thread is sleeping or waiting with a bounded timeout (e.g., `Thread.sleep(1000)`, `Object.wait(5000)`, `LockSupport.parkNanos()`).
6. **`TERMINATED`**: The `run()` method has completed either normally or abruptly due to an uncaught exception. Its stack frame memory is reclaimed.

Crucially, Java provides the **`t.isAlive()`** method to check a thread's active operational status.
The specification for `isAlive()` is strictly defined:
- **`isAlive()` returns `true`** if the thread has been started and has not yet died. This encompasses states `RUNNABLE`, `BLOCKED`, `WAITING`, and `TIMED_WAITING`.
- **`isAlive()` returns `false`** if the thread has not yet been started (`NEW`) OR if the thread has finished executing (`TERMINATED`).

In defensive enterprise engineering, status checking methods must also handle `null` thread references gracefully:
```java
public static boolean isRunning(Thread t) {
    return t != null && t.isAlive();
}
```
If a caller passes an uninitialized or dead thread reference, `isRunning` safely evaluates to `false` without throwing a `NullPointerException`.

Understanding how threads transition between `WAITING` and `BLOCKED` during monitor coordination is essential for mastering Java thread synchronization.
When a thread calls `lock.wait()`:
1. The calling thread must already hold the intrinsic monitor lock on `lock` (inside a `synchronized(lock)` block).
2. Invoking `wait()` atomically releases the monitor lock and places the thread into the object's **Wait Set**, transitioning its state from `RUNNABLE` to `WAITING`.
3. The thread remains asleep in the Wait Set until another thread acquires the exact same monitor lock and calls `lock.notify()` or `lock.notifyAll()`.
4. Crucially, when notified, the thread does NOT immediately return to `RUNNABLE`! It moves from the Wait Set into the object's **Entry Set**, transitioning to `BLOCKED`! It must re-compete for and acquire the monitor lock before it can resume execution.

When diagnosing production application freezes, site reliability engineers generate a **Thread Dump** using `jcmd <pid> Thread.print` or `jstack`. The thread dump reveals the exact state and call stack of every active thread, allowing engineers to spot threads stuck in `BLOCKED` waiting for contended database locks or threads trapped in `WAITING` due to lost notification signals.

"""

p4_content = """### 4. Concurrency Hazards: Race Conditions, Memory Visibility & Thread Termination

While multithreading unlocks massive performance scalability, concurrent execution in a shared-memory environment introduces treacherous hazards that can silently corrupt enterprise data.

The first major hazard is **Memory Invisibility**. On modern multi-core hardware, each CPU core possesses its own private L1 and L2 memory caches and write buffers. When Thread A writes a value to a shared variable on the heap, the update initially sits in Core 0's local cache. Thread B running on Core 1 reads from its own L1 cache and may never see Thread A's update!
To guarantee memory visibility across all CPU cores, Java provides the **`volatile`** keyword:
```java
private volatile boolean active = true;
```
Declaring a variable `volatile` establishes a **happens-before relationship** under the Java Memory Model (JMM). It forces writes to flush immediately to main memory (RAM) and invalidates stale CPU cache lines on other cores, ensuring all threads read the latest value.

The second critical hazard is **Race Conditions and Non-Atomic Updates**. An operation like `count++` is not a single CPU instruction—it is three separate operations: read, increment, and write. If two threads execute `count++` simultaneously, they read the same initial value, causing one increment to be lost. To prevent data corruption, operations must be synchronized using intrinsic locks (`synchronized`), explicit locks (`ReentrantLock`), or lock-free hardware atomics (`AtomicInteger`).

```
+------------------------------------------------------------------------------------+
| THREAD TERMINATION ETIQUETTE: COOPERATIVE INTERRUPTION vs DEPRECATED STOP          |
+------------------------------------------------------------------------------------+
| DANGEROUS: Thread.stop() (DEPRECATED)                                              |
| Forcefully terminates thread mid-execution. Immediately unlocks all monitors,       |
| leaving banking balances, database transactions, and data structures CORRUPT!     |
+------------------------------------------------------------------------------------+
| SAFE & IDIOMATIC: Cooperative Interruption via Thread.interrupt()                  |
| 1. External thread signals request: workerThread.interrupt();                       |
| 2. Worker thread checks status periodically: if (Thread.currentThread().isInterrupted())|
| 3. Worker cleans up database connections, releases locks, and terminates cleanly.  |
+------------------------------------------------------------------------------------+
```

Finally, consider **Thread Termination Etiquette**. In legacy Java, `Thread.stop()` allowed one thread to forcefully kill another thread. However, `Thread.stop()` was rapidly deprecated and permanently disabled because it immediately releases all locks held by the terminated thread, leaving partially updated objects in hopelessly corrupt states.

Instead, modern Java enforces **Cooperative Interruption**:
1. When a controller needs a worker to stop, it calls `workerThread.interrupt()`.
2. This sets an internal boolean flag on the worker thread.
3. If the worker thread is blocked in `Thread.sleep()` or `wait()`, the blocking call immediately unblocks and throws an `InterruptedException`.
4. The worker thread catches `InterruptedException` or checks `Thread.currentThread().isInterrupted()`, performs clean resource cleanup, and returns normally from `run()`.

Another catastrophic concurrency failure in distributed and multi-threaded systems is **Deadlock**. A deadlock occurs when two or more threads are permanently blocked, each holding a lock that the other needs, waiting in a circular dependency that can never resolve.

Computer scientist Edward Coffman formalized the four necessary conditions for a deadlock:
1. **Mutual Exclusion**: At least one resource is held in a non-shareable mode.
2. **Hold and Wait**: A thread holding at least one resource is waiting to acquire additional resources held by other threads.
3. **No Preemption**: Resources cannot be forcefully confiscated from threads; they must be released voluntarily.
4. **Circular Wait**: A closed chain of threads exists where Thread A waits for a resource held by Thread B, and Thread B waits for a resource held by Thread A.

To prevent deadlocks in production Java code, architects enforce **Global Lock Ordering**: if multiple locks (e.g. Account Lock A and Account Lock B) must be acquired, all threads across the entire codebase must acquire them in the exact same deterministic order (e.g., sorted by account ID). Alternatively, modern code utilizes `java.util.concurrent.locks.ReentrantLock` with `tryLock(long timeout, TimeUnit unit)`. If a thread cannot acquire both locks within 500 milliseconds, it releases all held locks, backs off, and retries, breaking the hold-and-wait condition and preventing deadlocks.

"""

p5_content = """### 5. Guided Coding Lab & Milestone Verification: Building `Worker` and `isRunning`

To conclude Day 28, we construct and thoroughly verify the two fundamental multithreading implementations assigned in the PinIT Career OS curriculum: the **Parallel Task Runner (`Worker`)** and the **Thread Status Checker (`isRunning`)**.

In the primary challenge, we implement `Worker implements Runnable`. The specification mandates that `Worker` must implement the `java.lang.Runnable` interface and override the `run()` method to print the exact message `"Work Done"` to standard output (`System.out.println`). We then implement `Solution.execute()` which instantiates a `Worker` instance and invokes its `run()` method.

```java
// ============================================================================
// CHALLENGE 1: PARALLEL TASK RUNNER
// ============================================================================
class Worker implements Runnable {
    /**
     * Executes the background task logic.
     * Prints 'Work Done' to standard output.
     */
    @Override
    public void run() {
        System.out.println("Work Done");
    }
}

public class Solution {
    public static void execute() {
        // Step 1: Instantiate the task worker:
        Worker w = new Worker();

        // Step 2: Execute task logic:
        w.run();
    }
}
```

Let us trace `Solution.execute()`:
1. `Worker w = new Worker();`: An instance of `Worker` is allocated on the heap.
2. `w.run();`: The `run()` method executes directly on the current thread. The string `"Work Done"` is printed to standard output.
3. Notice that `Worker` can also be passed directly to a dedicated `Thread` or an `ExecutorService`:
   ```java
   Thread t = new Thread(new Worker());
   t.start(); // Executes "Work Done" asynchronously on a background OS thread!
   ```

In the secondary assignment, we construct `SolutionAdv.isRunning(Thread t)`. The method must defensively inspect the provided `Thread` reference:
- If `t` is `null`, it must return `false`.
- If `t` is not null and currently active (i.e. `t.isAlive()` evaluates to `true`), it must return `true`.
- If `t` has not been started (`NEW`) or has already finished executing (`TERMINATED`), `t.isAlive()` evaluates to `false`, so it returns `false`.

```java
// ============================================================================
// CHALLENGE 2: THREAD STATUS CHECKER
// ============================================================================
public class SolutionAdv {
    /**
     * Determines whether a given thread is currently active and alive.
     * Returns true if t is non-null AND t.isAlive() is true; false otherwise.
     */
    public static boolean isRunning(Thread t) {
        // Defensive check: null-safe verification
        if (t == null) {
            return false;
        }
        // Returns true if thread is in RUNNABLE, BLOCKED, WAITING, or TIMED_WAITING state
        return t.isAlive();
    }
}
```

Let us analyze the test verification cases:
- **Case 1 (Null Reference)**: `isRunning(null)`. The `t == null` guard evaluates to `false` immediately, avoiding any `NullPointerException`.
- **Case 2 (Unstarted Thread - NEW)**: `Thread t = new Thread(new Worker()); isRunning(t)`. Because `t.start()` has not been called, `t.isAlive()` is `false`. Returns `false`.
- **Case 3 (Active Thread - TIMED_WAITING)**:
  ```java
  Thread t = new Thread(() -> {
      try { Thread.sleep(2000); } catch (InterruptedException e) {}
  });
  t.start();
  // While sleeping, t is alive:
  boolean running = SolutionAdv.isRunning(t); // true
  ```
- **Case 4 (Finished Thread - TERMINATED)**: Once the sleep expires and the `run()` method returns, `t.isAlive()` becomes `false`. `isRunning(t)` cleanly returns `false`.

In automated test suites with JUnit 5:
```java
@Test
void testParallelTaskRunner() {
    Worker w = new Worker();
    assertTrue(w instanceof Runnable);
    Solution.execute(); // Verifies execution with zero exceptions
}

@Test
void testThreadStatusChecker() throws InterruptedException {
    assertFalse(SolutionAdv.isRunning(null));

    Thread t = new Thread(() -> {
        try { Thread.sleep(500); } catch (InterruptedException ignored) {}
    });
    assertFalse(SolutionAdv.isRunning(t)); // NEW: not yet alive

    t.start();
    assertTrue(SolutionAdv.isRunning(t));  // RUNNING: alive

    t.join();
    assertFalse(SolutionAdv.isRunning(t)); // TERMINATED: no longer alive
}
```
Both implementations satisfy all curriculum specifications and pass all automated test validations with zero regressions.

Finally, distinguish between **User Threads** and **Daemon Threads**. By default, all threads created via `new Thread()` are user threads. The JVM will keep running as long as at least one user thread remains alive, even if the `main` method has completely finished executing! In contrast, a daemon thread (marked via `thread.setDaemon(true)` before calling `start()`) serves as a background support worker (e.g., the Garbage Collector or background cache evictors). When all user threads terminate, the JVM shuts down immediately, abruptly halting all daemon threads without waiting for them to finish.

"""

DAY_28 = {
    "day": 28,
    "title": "Multithreading & Concurrency Fundamentals: Threads, Runnables & Execution Lifecycle",
    "goal": "Master multithreading and concurrent execution foundations in Java. Understand operating system process vs thread models and 1:1 native kernel mapping, explore the Runnable task contract vs subclassing Thread, analyze the 6 formal JVM thread states in Thread.State, learn cooperative thread interruption, and implement the Worker parallel task runner and isRunning status checker.",
    "minutes": 25,
    "recap": "Yesterday we mastered compile-time Generics, type erasure, and bounded wildcards. Today, we step into concurrent systems engineering, exploring how the JVM coordinates multi-core execution through Threads and the Runnable contract.",
    "summary": [
        "Threads share the same JVM process memory (Heap and Metaspace) while maintaining private call stacks and program counters.",
        "Modern Java uses a 1:1 Native Thread Model where each java.lang.Thread maps directly to an OS kernel thread.",
        "Implementing Runnable decouples task logic from thread scheduling, adhering to the Single Responsibility Principle.",
        "Calling thread.run() executes synchronously on the current thread; calling thread.start() spawns an asynchronous OS thread.",
        "The JVM thread lifecycle consists of 6 formal states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, and TERMINATED.",
        "The Worker and isRunning challenges demonstrate decoupled task execution and null-safe thread lifecycle inspection."
    ],
    "projectStep": {
        "title": "Build the Parallel Task Worker and Status Inspector",
        "steps": [
            "Author class Worker implementing Runnable whose run() method prints 'Work Done'.",
            "Author Solution.execute() instantiating Worker and invoking w.run().",
            "Author SolutionAdv.isRunning(Thread t) returning true if t is non-null and t.isAlive().",
            "Verify that isRunning returns false for null, false for unstarted NEW threads, and true for active threads."
        ]
    },
    "parts": [
        {
            "part": 1,
            "title": "Operating System Threads vs The JVM Thread Model: Green Threads to Native Kernel 1:1 Mapping",
            "content": p1_content.strip(),
            "code": """public class ThreadMemoryModelLab {
    public static void main(String[] args) {
        System.out.println("=== JVM THREAD MEMORY MODEL LAB ===");

        // Main thread details:
        Thread current = Thread.currentThread();
        System.out.println("Executing thread:     " + current.getName());
        System.out.println("Thread ID:            " + current.threadId());
        System.out.println("Priority (1 to 10):   " + current.getPriority());
        System.out.println("Is Daemon thread:     " + current.isDaemon());
        System.out.println("Thread Group:         " + current.getThreadGroup().getName());

        // Available hardware processing cores:
        int cores = Runtime.getRuntime().availableProcessors();
        System.out.println("Available CPU cores:  " + cores);
    }
}""",
            "checks": [
                {
                    "question": "What memory area is shared across all threads running inside a single JVM process?",
                    "options": [
                        "The Java Heap and Metaspace",
                        "The private thread call stack",
                        "The CPU Program Counter register",
                        "Local variable arrays"
                    ],
                    "answer": 0,
                    "explanation": "Threads share the process-wide Heap and Metaspace, while each thread maintains a private call stack and program counter."
                },
                {
                    "question": "What is the 1:1 Native Thread Model used by modern Java runtimes?",
                    "options": [
                        "Each java.lang.Thread instance corresponds directly to an underlying operating system kernel thread",
                        "One Java thread runs on exactly one computer in the cloud",
                        "All threads are executed sequentially by a single core",
                        "Java threads run exclusively in web browser tabs"
                    ],
                    "answer": 0,
                    "explanation": "Under the 1:1 model, the JVM delegates thread scheduling and CPU dispatch directly to native OS kernel threads."
                },
                {
                    "question": "What was the critical flaw of Java 1.1 Green Threads?",
                    "options": [
                        "They ran entirely in user space and were pinned to a single OS core, freezing the whole JVM on blocking I/O",
                        "They consumed 1 GB of memory per thread",
                        "They only worked on green-screen monochrome monitors",
                        "They could only execute once per day"
                    ],
                    "answer": 0,
                    "explanation": "Green threads were scheduled in user space without OS support, preventing multi-core scaling and blocking on I/O."
                },
                {
                    "question": "What is the default call stack memory size (-Xss) allocated per thread in standard 64-bit JVMs?",
                    "options": [
                        "Approximately 1 MB (1024 KB)",
                        "10 GB",
                        "128 bytes",
                        "0 bytes (threads have no stack)"
                    ],
                    "answer": 0,
                    "explanation": "Standard 64-bit HotSpot JVMs allocate approximately 1MB per thread stack for call frames and local variables."
                }
            ]
        },
        {
            "part": 2,
            "title": "Task vs Worker: The Runnable Contract & Decoupled Execution",
            "content": p2_content.strip(),
            "code": """public class RunnableVsThreadLab {
    // Decoupled task:
    public static class Task implements Runnable {
        private final String taskName;
        public Task(String name) { this.taskName = name; }

        @Override
        public void run() {
            System.out.println("  [TASK EXECUTING] " + taskName + " on thread: " + Thread.currentThread().getName());
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Task task = new Task("TelemetryAudit");

        // 1. Direct synchronous execution (runs on main thread):
        System.out.println("Calling task.run() directly:");
        task.run();

        // 2. Asynchronous execution on dedicated OS thread:
        System.out.println("\nSpawning dedicated OS thread via thread.start():");
        Thread dedicated = new Thread(task, "Dedicated-Worker-1");
        dedicated.start(); // Asynchronous native dispatch!
        dedicated.join();  // Wait for completion
    }
}""",
            "checks": [
                {
                    "question": "Why is implementing Runnable preferred over extending Thread in Java?",
                    "options": [
                        "It decouples task logic from thread scheduling and preserves the single inheritance slot for domain classes",
                        "Because extending Thread causes compilation errors in modern Java",
                        "Because Runnable methods run 100 times faster",
                        "Because Thread cannot be instantiated directly"
                    ],
                    "answer": 0,
                    "explanation": "Implementing Runnable separates task definition from execution mechanisms and avoids wasting Java's single inheritance capability."
                },
                {
                    "question": "What happens if you invoke thread.run() instead of thread.start()?",
                    "options": [
                        "The run() method executes synchronously on the calling thread without spawning a new OS thread",
                        "The JVM crashes with an IllegalThreadStateException",
                        "A new thread is spawned in the background automatically",
                        "The computer reboots"
                    ],
                    "answer": 0,
                    "explanation": "Calling run() directly is merely a standard synchronous method invocation; only start() spawns a new asynchronous OS thread."
                },
                {
                    "question": "What occurs if you attempt to call thread.start() twice on the same Thread instance?",
                    "options": [
                        "Throws java.lang.IllegalThreadStateException",
                        "Spawns two identical threads concurrently",
                        "Restarts the thread from the beginning",
                        "Silently ignores the second call"
                    ],
                    "answer": 0,
                    "explanation": "A thread lifecycle is unidirectional; once started, calling start() again violates the state machine and throws IllegalThreadStateException."
                },
                {
                    "question": "What method does Runnable define?",
                    "options": [
                        "public void run()",
                        "public void start()",
                        "public void execute()",
                        "public void terminate()"
                    ],
                    "answer": 0,
                    "explanation": "Runnable is a Single Abstract Method (SAM) interface declaring exactly one method: 'void run()'."
                }
            ]
        },
        {
            "part": 3,
            "title": "The JVM Thread Lifecycle & State Machine: Exploring Thread.State and isAlive()",
            "content": p3_content.strip(),
            "code": """public class ThreadLifecycleLab {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== THREAD STATE LIFECYCLE LAB ===");

        Thread worker = new Thread(() -> {
            try {
                // TIMED_WAITING state:
                Thread.sleep(300);
            } catch (InterruptedException e) {
                System.out.println("Interrupted!");
            }
        });

        // 1. State: NEW
        System.out.println("1. After new Thread():  State = " + worker.getState() + ", isAlive = " + worker.isAlive());

        // 2. State: RUNNABLE / TIMED_WAITING
        worker.start();
        Thread.sleep(50); // Give worker a moment to start sleeping
        System.out.println("2. While sleeping:      State = " + worker.getState() + ", isAlive = " + worker.isAlive());

        // 3. State: TERMINATED
        worker.join(); // Wait for worker to finish
        System.out.println("3. After completion:    State = " + worker.getState() + ", isAlive = " + worker.isAlive());
    }
}""",
            "checks": [
                {
                    "question": "Which of the following are the 6 formal states defined in java.lang.Thread.State?",
                    "options": [
                        "NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED",
                        "START, RUN, SLEEP, PAUSE, STOP, DESTROY",
                        "INIT, ACTIVE, IDLE, FROZEN, KILLED, DEAD",
                        "READY, RUNNING, FINISHED, ERROR, CANCELLED, ABORTED"
                    ],
                    "answer": 0,
                    "explanation": "The 6 formal states in Java are NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, and TERMINATED."
                },
                {
                    "question": "What does thread.isAlive() return for a thread in the TIMED_WAITING state?",
                    "options": [
                        "true",
                        "false",
                        "null",
                        "Throws an exception"
                    ],
                    "answer": 0,
                    "explanation": "isAlive() returns true for any thread that has been started and has not yet completed (RUNNABLE, BLOCKED, WAITING, TIMED_WAITING)."
                },
                {
                    "question": "What state is a thread in when it is waiting to enter a synchronized block held by another thread?",
                    "options": [
                        "BLOCKED",
                        "WAITING",
                        "NEW",
                        "TERMINATED"
                    ],
                    "answer": 0,
                    "explanation": "BLOCKED specifically represents a thread waiting to acquire an intrinsic monitor lock to enter a synchronized block or method."
                },
                {
                    "question": "What does thread.isAlive() return for a newly created Thread instance before start() is called?",
                    "options": [
                        "false (the thread is in the NEW state)",
                        "true",
                        "-1",
                        "It hangs the calling thread"
                    ],
                    "answer": 0,
                    "explanation": "Before start() is called, the thread has not yet begun execution, so isAlive() evaluates to false."
                }
            ]
        },
        {
            "part": 4,
            "title": "Concurrency Hazards: Race Conditions, Memory Visibility & Thread Termination",
            "content": p4_content.strip(),
            "code": """public class ConcurrencyHazardsLab {
    // volatile ensures changes are immediately visible to all CPU core caches
    private static volatile boolean keepRunning = true;

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            long count = 0;
            // Reads volatile flag from main memory:
            while (keepRunning) {
                count++;
            }
            System.out.println("Worker stopped cleanly after " + count + " iterations.");
        });

        worker.start();
        Thread.sleep(100);

        // Main thread requests cooperative termination:
        System.out.println("Signaling worker to stop...");
        keepRunning = false; // Memory write flushed across CPU caches

        worker.join();
        System.out.println("Execution halted safely with zero corrupt state.");
    }
}""",
            "checks": [
                {
                    "question": "What does the 'volatile' keyword guarantee in the Java Memory Model?",
                    "options": [
                        "Memory visibility: changes made by one thread are immediately visible to all other threads, preventing stale CPU cache reads",
                        "It makes all operations on the variable atomic",
                        "It encrypts the variable in RAM",
                        "It prevents the variable from ever being modified"
                    ],
                    "answer": 0,
                    "explanation": "Volatile guarantees memory visibility and establishes happens-before ordering, but does NOT guarantee compound atomicity (like ++)."
                },
                {
                    "question": "Why was Thread.stop() deprecated and permanently disabled in Java?",
                    "options": [
                        "It forcefully killed threads mid-execution, abruptly releasing locks and leaving shared data structures corrupt",
                        "Because operating systems no longer allow killing threads",
                        "Because it deleted the compiled .class file from disk",
                        "Because it was replaced by a paid feature"
                    ],
                    "answer": 0,
                    "explanation": "Thread.stop() unlocked monitors instantly without letting threads finish invariants, corrupting shared memory state."
                },
                {
                    "question": "How should a thread be gracefully requested to terminate in modern Java?",
                    "options": [
                        "Via cooperative interruption: calling thread.interrupt() and having the worker check isInterrupted()",
                        "By calling System.exit(0)",
                        "By disconnecting the computer from power",
                        "By setting all thread variables to null"
                    ],
                    "answer": 0,
                    "explanation": "Cooperative interruption allows the worker thread to detect the cancellation signal and cleanly finalize resources."
                },
                {
                    "question": "What happens when a thread sleeping in Thread.sleep(5000) is interrupted via thread.interrupt()?",
                    "options": [
                        "Thread.sleep wakes up immediately and throws an InterruptedException",
                        "The thread is deleted from memory",
                        "The sleep duration is extended by another 5 seconds",
                        "The CPU core freezes"
                    ],
                    "answer": 0,
                    "explanation": "Blocking operations like sleep() and wait() monitor interruption status, waking up instantly with InterruptedException upon interrupt."
                }
            ]
        },
        {
            "part": 5,
            "title": "Guided Coding Lab & Milestone Verification: Building Worker and isRunning",
            "content": p5_content.strip(),
            "code": """public class SolutionLab {
    // Challenge 1: Parallel Task Runner
    static class Worker implements Runnable {
        @Override
        public void run() {
            System.out.println("Work Done");
        }
    }

    public static class Solution {
        public static void execute() {
            Worker w = new Worker();
            w.run();
        }
    }

    // Challenge 2: Thread Status Checker
    public static class SolutionAdv {
        public static boolean isRunning(Thread t) {
            return t != null && t.isAlive();
        }
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println("Testing Solution.execute():");
        Solution.execute(); // Prints "Work Done"

        System.out.println("\nTesting SolutionAdv.isRunning():");
        System.out.println("isRunning(null):             " + SolutionAdv.isRunning(null)); // false

        Thread unstarted = new Thread(new Worker());
        System.out.println("isRunning(unstarted NEW):    " + SolutionAdv.isRunning(unstarted)); // false

        Thread active = new Thread(() -> {
            try { Thread.sleep(200); } catch (InterruptedException ignored) {}
        });
        active.start();
        System.out.println("isRunning(active RUNNABLE):  " + SolutionAdv.isRunning(active)); // true

        active.join();
        System.out.println("isRunning(TERMINATED):       " + SolutionAdv.isRunning(active)); // false
    }
}""",
            "checks": [
                {
                    "question": "In the Day 28 Worker challenge, what does Worker.run() print to standard output?",
                    "options": [
                        "'Work Done'",
                        "'Done'",
                        "'Task Completed'",
                        "'Running'"
                    ],
                    "answer": 0,
                    "explanation": "Worker implements Runnable whose run() method executes System.out.println('Work Done')."
                },
                {
                    "question": "What does SolutionAdv.isRunning(null) return?",
                    "options": [
                        "false cleanly without throwing NullPointerException",
                        "true",
                        "Throws a NullPointerException",
                        "-1"
                    ],
                    "answer": 0,
                    "explanation": "The null guard 'if (t == null) return false;' intercepts null references safely."
                },
                {
                    "question": "In SolutionAdv.isRunning(Thread t), what does it return for a thread in the NEW state?",
                    "options": [
                        "false because the thread has not yet been started via start() and isAlive() is false",
                        "true",
                        "null",
                        "Throws an IllegalStateException"
                    ],
                    "answer": 0,
                    "explanation": "NEW threads have not been started, so t.isAlive() returns false."
                },
                {
                    "question": "What interface does the Worker class implement in the Day 28 challenge?",
                    "options": [
                        "java.lang.Runnable",
                        "java.util.concurrent.Callable",
                        "java.io.Serializable",
                        "java.lang.Cloneable"
                    ],
                    "answer": 0,
                    "explanation": "Worker implements Runnable, declaring 'class Worker implements Runnable'."
                }
            ]
        }
    ]
}

with open("scripts/block6_day28.py", "w", encoding="utf-8") as f:
    f.write("# Day 28: Multithreading & Concurrency Fundamentals: Threads, Runnables & Execution Lifecycle\n\nDAY_28 = ")
    f.write(pprint.pformat(DAY_28, indent=4, width=120))
    f.write("\n")

print("Wrote scripts/block6_day28.py successfully")
