// Deterministic TypeScript simulations for Course 5 Month 2 Batch 5 (Days 51 to 55)
import fs from 'fs';

const outputs: Record<string, string> = {};

function capture(key: string, fn: () => void) {
  const originalLog = console.log;
  const lines: string[] = [];
  console.log = (...args: any[]) => {
    lines.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  outputs[key] = lines.join('\n');
}

// ==========================================
// DAY 51: OS Threads vs Java Thread & Runnable
// ==========================================

// Day 51 Part 1: OS Kernel Thread Model & Java Thread States
capture('d51p1', () => {
  enum JavaThreadState {
    NEW = 'NEW',
    RUNNABLE = 'RUNNABLE',
    BLOCKED = 'BLOCKED',
    WAITING = 'WAITING',
    TIMED_WAITING = 'TIMED_WAITING',
    TERMINATED = 'TERMINATED'
  }

  class ThreadLifecycleSimulator {
    private state: JavaThreadState = JavaThreadState.NEW;

    getState(): JavaThreadState {
      return this.state;
    }

    start(): void {
      if (this.state !== JavaThreadState.NEW) throw new Error("IllegalThreadStateException");
      this.state = JavaThreadState.RUNNABLE;
    }

    terminate(): void {
      this.state = JavaThreadState.TERMINATED;
    }
  }

  const thread = new ThreadLifecycleSimulator();
  console.log("Initial State:", thread.getState());
  thread.start();
  console.log("Post-Start State:", thread.getState());
  thread.terminate();
  console.log("Final State:", thread.getState());
});

// Day 51 Part 2: Detective Lab: The Synchronous Run Illusion
capture('d51p2', () => {
  function executeWorker(asyncMode: boolean): { executedOnThread: string; sequentialBlockedMs: number } {
    if (!asyncMode) {
      // Calling .run() executes on caller thread (main)
      return { executedOnThread: "main", sequentialBlockedMs: 450 };
    } else {
      // Calling .start() spawns dedicated OS kernel thread
      return { executedOnThread: "Thread-1", sequentialBlockedMs: 0 };
    }
  }

  const syncRun = executeWorker(false);
  const asyncStart = executeWorker(true);
  console.log("Direct .run() Thread:", syncRun.executedOnThread, "Blocked Ms:", syncRun.sequentialBlockedMs);
  console.log("Native .start() Thread:", asyncStart.executedOnThread, "Blocked Ms:", asyncStart.sequentialBlockedMs);
});

// Day 51 Part 3: Mastery Assignment: Parallel Batch File Downloader
capture('d51p3', () => {
  interface DownloadTask {
    fileId: string;
    sizeKb: number;
    completed: boolean;
  }

  class ParallelBatchDownloader {
    private tasks: DownloadTask[] = [];

    addTask(fileId: string, sizeKb: number) {
      this.tasks.push({ fileId, sizeKb, completed: false });
    }

    simulateJoinAll(): number {
      for (const t of this.tasks) {
        t.completed = true;
      }
      return this.tasks.length;
    }
  }

  const downloader = new ParallelBatchDownloader();
  downloader.addTask("ledger_batch_01.csv", 450);
  downloader.addTask("ledger_batch_02.csv", 820);
  downloader.addTask("ledger_batch_03.csv", 310);
  const finished = downloader.simulateJoinAll();
  console.log("Parallel Joined Tasks:", finished);
  console.log("Thread Synchronization:", "All worker threads joined to main thread");
});

// Day 51 Part 4: Production Incident Lab: Thread Leak Outage in Microservices
capture('d51p4', () => {
  function simulateThreadChurn(unboundedSpawns: number): { osThreadLimitReached: boolean; error?: string } {
    const OS_MAX_USER_PROCESSES = 1024;
    if (unboundedSpawns > OS_MAX_USER_PROCESSES) {
      return { osThreadLimitReached: true, error: "OutOfMemoryError: unable to create new native thread" };
    }
    return { osThreadLimitReached: false };
  }

  const incident = simulateThreadChurn(2000);
  console.log("Thread Limit Exceeded:", incident.osThreadLimitReached);
  console.log("OS Kernel Error:", incident.error);
});

// Day 51 Part 5: Comprehensive Thread Lifecycle Viva Gate
capture('d51p5', () => {
  console.log("Thread Mapping:", "1:1 Native OS Kernel Thread to Java Thread");
  console.log("Thread Stack Memory:", "1 MB default stack per thread (-Xss1024k)");
  console.log("Start Invariant:", "Calling thread.start() invokes JVM_StartThread in hotspot/src/share/vm/prims/jvm.cpp");
});

// ==========================================
// DAY 52: Race Conditions & Lost Updates
// ==========================================

// Day 52 Part 1: Bytecode Disassembly of count++
capture('d52p1', () => {
  console.log("Bytecode Step 1:", "getfield #2 (Read field value from heap into operand stack)");
  console.log("Bytecode Step 2:", "iconst_1 + iadd (Add 1 in CPU ALU)");
  console.log("Bytecode Step 3:", "putfield #2 (Write updated value back to heap field)");
  console.log("Atomicity Invariant:", "count++ is NOT atomic; 3 distinct bytecode instructions");
});

// Day 52 Part 2: Detective Lab: The Vanishing Balance Discrepancy
capture('d52p2', () => {
  // Simulating interleaved thread context switches causing lost updates
  function simulateLostUpdates(expectedIncrements: number): number {
    // Under un-synchronized concurrency, ~30% of updates are lost
    return Math.floor(expectedIncrements * 0.71);
  }

  const expected = 20000;
  const actual = simulateLostUpdates(expected);
  console.log("Expected Counter:", expected);
  console.log("Corrupted Counter (Lost Updates):", actual);
  console.log("Lost Increments Count:", expected - actual);
});

// Day 52 Part 3: Mastery Assignment: Thread Interleaving Simulator
capture('d52p3', () => {
  interface AccountState {
    balance: number;
  }

  class CheckThenActSimulator {
    static executeUnsafeWithdrawal(account: AccountState, amount: number): boolean {
      // Check-then-act race window
      if (account.balance >= amount) {
        account.balance -= amount;
        return true;
      }
      return false;
    }
  }

  const acc: AccountState = { balance: 60 };
  const tx1 = CheckThenActSimulator.executeUnsafeWithdrawal(acc, 50);
  const tx2 = CheckThenActSimulator.executeUnsafeWithdrawal(acc, 50); // Interleaved execution
  console.log("Tx 1 Success:", tx1);
  console.log("Tx 2 Success (Overdrawn):", tx2);
  console.log("Final Corrupted Balance:", acc.balance);
});

// Day 52 Part 4: Production Incident Lab: High-Frequency Settlement Race Condition
capture('d52p4', () => {
  function verifyMutualExclusion(isSynchronized: boolean): { discrepancy: number; safe: boolean } {
    if (!isSynchronized) {
      return { discrepancy: 5769, safe: false };
    }
    return { discrepancy: 0, safe: true };
  }

  const unshielded = verifyMutualExclusion(false);
  const shielded = verifyMutualExclusion(true);
  console.log("Unshielded Ledger Discrepancy:", unshielded.discrepancy, "Safe:", unshielded.safe);
  console.log("Shielded Ledger Discrepancy:", shielded.discrepancy, "Safe:", shielded.safe);
});

// Day 52 Part 5: Comprehensive Critical Section Viva Gate
capture('d52p5', () => {
  console.log("Critical Section Invariant:", "Mutual Exclusion (Mutex) required on shared mutable state");
  console.log("Check-Then-Act Race:", "Time-of-Check to Time-of-Use (TOCTOU) vulnerability");
  console.log("Hardware Interleaving:", "CPU preemptive scheduler context switches between getfield and putfield");
});

// ==========================================
// DAY 53: Intrinsic Locks & synchronized
// ==========================================

// Day 53 Part 1: Monitor Enter / Exit Bytecode Mechanics
capture('d53p1', () => {
  console.log("Bytecode Instruction 1:", "monitorenter (Acquires object monitor lock, increments recursion count)");
  console.log("Bytecode Instruction 2:", "monitorexit (Decrements recursion count, releases lock at 0)");
  console.log("Exception Safety:", "Compiler generates Exception Table handler to guarantee monitorexit on throw");
});

// Day 53 Part 2: Detective Lab: The New Object Lock Trap
capture('d53p2', () => {
  class LockTrapSimulator {
    static testLockType(sharedLock: boolean): { threadSafetyEnforced: boolean } {
      if (!sharedLock) {
        // Anti-pattern: locking on new Object() creates independent monitors
        return { threadSafetyEnforced: false };
      }
      // Correct pattern: private final Object lock = new Object();
      return { threadSafetyEnforced: true };
    }
  }

  console.log("synchronized(new Object()):", LockTrapSimulator.testLockType(false).threadSafetyEnforced);
  console.log("synchronized(privateFinalLock):", LockTrapSimulator.testLockType(true).threadSafetyEnforced);
});

// Day 53 Part 3: Mastery Assignment: Thread-Safe Banking Ledger with Fine-Grained Locking
capture('d53p3', () => {
  class ThreadSafeTransferEngine {
    // Ordered lock acquisition prevents circular deadlocks
    transfer(acc1Id: string, acc2Id: string, amount: number): string {
      const firstLock = acc1Id < acc2Id ? acc1Id : acc2Id;
      const secondLock = acc1Id < acc2Id ? acc2Id : acc1Id;
      return `Locked ${firstLock} then ${secondLock}; Transferred $${amount} cleanly`;
    }
  }

  const engine = new ThreadSafeTransferEngine();
  const res = engine.transfer("ACC-B", "ACC-A", 500);
  console.log("Ordered Lock Execution:", res);
  console.log("Deadlock Prevention:", "Resource ordering breaks Coffman circular wait condition");
});

// Day 53 Part 4: Production Incident Lab: The Coarse-Grained Bottleneck
capture('d53p4', () => {
  function compareLockContention(coarseGrained: boolean): { latencyMs: number; throughputTps: number } {
    if (coarseGrained) {
      return { latencyMs: 8200, throughputTps: 1 };
    }
    return { latencyMs: 4, throughputTps: 15000 };
  }

  const coarse = compareLockContention(true);
  const fine = compareLockContention(false);
  console.log("Coarse Method Lock Latency:", coarse.latencyMs, "ms | Throughput:", coarse.throughputTps, "TPS");
  console.log("Fine-Grained Critical Section Latency:", fine.latencyMs, "ms | Throughput:", fine.throughputTps, "TPS");
});

// Day 53 Part 5: Comprehensive Intrinsic Lock Viva Gate
capture('d53p5', () => {
  console.log("Reentrancy Guarantee:", "Same thread can acquire held monitor multiple times without self-deadlock");
  console.log("Object Header Mark Word:", "Lock state stored in 2-bit tag (Biased, Thin, Fat monitor)");
  console.log("Lock Inflation:", "Contended locks inflate from thin CAS spinlocks to OS mutex heavyweight monitors");
});

// ==========================================
// DAY 54: The Java Memory Model & volatile
// ==========================================

// Day 54 Part 1: Hardware Memory Architecture & Happens-Before Order
capture('d54p1', () => {
  console.log("JMM Abstraction:", "Thread Working Memory (L1/L2 Cache) vs Main Memory (RAM)");
  console.log("CPU Store Buffer:", "Asynchronous write buffer flushes delayed without memory barrier");
  console.log("Happens-Before Rule:", "A write to volatile variable happens-before every subsequent read of that variable");
});

// Day 54 Part 2: Detective Lab: The Invisible Flag Infinite Loop
capture('d54p2', () => {
  function simulateVisibilityBarrier(isVolatile: boolean): { loopsForever: boolean; terminationMs: number } {
    if (!isVolatile) {
      // Worker thread reads stale cached value in CPU L1 register
      return { loopsForever: true, terminationMs: Infinity };
    }
    // volatile forces CPU bus lock / memory fence (mfence)
    return { loopsForever: false, terminationMs: 2 };
  }

  const nonVolatile = simulateVisibilityBarrier(false);
  const withVolatile = simulateVisibilityBarrier(true);
  console.log("Non-Volatile Stop Flag Loops Forever:", nonVolatile.loopsForever);
  console.log("Volatile Stop Flag Terminated In:", withVolatile.terminationMs, "ms");
});

// Day 54 Part 3: Mastery Assignment: Thread-Safe State Machine with Volatile State
capture('d54p3', () => {
  enum ServiceStatus {
    INITIALIZING = 'INITIALIZING',
    RUNNING = 'RUNNING',
    SHUTTING_DOWN = 'SHUTTING_DOWN',
    TERMINATED = 'TERMINATED'
  }

  class GracefulShutdownCoordinator {
    private volatileStatus: ServiceStatus = ServiceStatus.INITIALIZING;

    setStatus(s: ServiceStatus) {
      this.volatileStatus = s;
    }

    getStatus(): ServiceStatus {
      return this.volatileStatus;
    }
  }

  const coord = new GracefulShutdownCoordinator();
  coord.setStatus(ServiceStatus.RUNNING);
  console.log("Active Service Status:", coord.getStatus());
  coord.setStatus(ServiceStatus.SHUTTING_DOWN);
  console.log("Broadcasted Shutdown State:", coord.getStatus());
});

// Day 54 Part 4: Production Incident Lab: The Volatile Increment Illusion
capture('d54p4', () => {
  console.log("Volatile Counter Invariant:", "volatile guarantees VISIBILITY of reads/writes, NOT ATOMICITY");
  console.log("volatile int count++:", "Still 3 instructions; reads latest value but lost updates still occur");
  console.log("Remediation Standard:", "Use AtomicInteger or synchronized for compound operations");
});

// Day 54 Part 5: Comprehensive Memory Barrier Viva Gate
capture('d54p5', () => {
  console.log("Instruction Reordering:", "Compiler and CPU prevented from moving instructions across volatile fence");
  console.log("Memory Fence Assembly:", "x86 lock addl $0x0,(%rsp) or mfence instruction emitted");
  console.log("Double-Checked Locking:", "volatile required on singleton instance to prevent reading half-initialized object");
});

// ==========================================
// DAY 55: Milestone 10: Producer-Consumer Work Queue with wait() / notifyAll()
// ==========================================

// Day 55 Part 1: Monitor Wait Set & Spurious Wakeup Guard
capture('d55p1', () => {
  console.log("Wait Set Mechanics:", "wait() releases monitor lock and places thread in Object Wait Set");
  console.log("Spurious Wakeup Defense:", "Always enclose wait() inside while(condition) loop, NEVER if(condition)");
  console.log("Notification Delivery:", "notifyAll() transitions all waiting threads to Blocked Queue to compete for lock");
});

// Day 55 Part 2: Detective Lab: The Starved Producer Deadlock
capture('d55p2', () => {
  function compareNotificationStrategy(useNotifyAll: boolean): { systemDeadlocked: boolean; activeWorkersWaiting: number } {
    if (!useNotifyAll) {
      // notify() woke another producer who immediately slept; all consumers remained asleep forever
      return { systemDeadlocked: true, activeWorkersWaiting: 12 };
    }
    return { systemDeadlocked: false, activeWorkersWaiting: 0 };
  }

  const badNotify = compareNotificationStrategy(false);
  const goodNotifyAll = compareNotificationStrategy(true);
  console.log("Single notify() Deadlocked:", badNotify.systemDeadlocked, "Sleeping Threads:", badNotify.activeWorkersWaiting);
  console.log("notifyAll() Deadlocked:", goodNotifyAll.systemDeadlocked, "Sleeping Threads:", goodNotifyAll.activeWorkersWaiting);
});

// Day 55 Part 3: Mastery Assignment: Bounded Blocking Work Queue
capture('d55p3', () => {
  class BoundedBlockingQueue<T> {
    private items: T[] = [];
    constructor(private readonly capacity: number) {}

    enqueue(item: T): boolean {
      if (this.items.length >= this.capacity) return false;
      this.items.push(item);
      return true;
    }

    dequeue(): T | null {
      if (this.items.length === 0) return null;
      return this.items.shift() || null;
    }

    size(): number {
      return this.items.length;
    }
  }

  const queue = new BoundedBlockingQueue<string>(2);
  queue.enqueue("ORDER-1");
  queue.enqueue("ORDER-2");
  const rejected = queue.enqueue("ORDER-3"); // Bounded rejection/blocking
  console.log("Bounded Queue Size:", queue.size());
  console.log("Buffer Overflow Blocked:", !rejected);
  console.log("Dequeued Item:", queue.dequeue());
});

// Day 55 Part 4: Production Incident Lab: Spurious Wakeup Buffer Corruption
capture('d55p4', () => {
  console.log("Spurious Wakeup Failure Mode:", "Thread wakes up with zero notify signals due to OS kernel interrupts");
  console.log("If-Statement Defect:", "Proceeds to dequeue from empty buffer, throwing NoSuchElementException");
  console.log("While-Loop Invariant:", "Thread re-checks condition upon waking, surviving spurious signals");
});

// Day 55 Part 5: Milestone 10 Capstone Viva Gate
capture('d55p5', () => {
  console.log("Milestone 10 Engine:", "Concurrent Producer-Consumer Work Queue Active");
  console.log("Worker Configuration:", "4 Producer Threads & 8 Consumer Threads");
  console.log("Throughput Target:", "100,000 orders coordinated with zero lost updates");
  console.log("Deadlock Defense:", "notifyAll() + while-loop guards verified");
  console.log("Milestone 10 Gate Status:", "100% SPEC COMPLIANT");
});

// Write outputs to JSON
fs.writeFileSync('scripts/java_days51_55_outputs.json', JSON.stringify(outputs, null, 2));
console.log('Successfully captured outputs for Days 51 to 55!');
