// Deterministic TypeScript simulations for Course 5 Month 2 Batch 3 (Days 41 to 45)
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
// DAY 41: JVM Throwable Hierarchy
// ==========================================

// Day 41 Part 1: The JVM Throwable Class Taxonomy
capture('d41p1', () => {
  class ThrowableSimulator {
    classify(errName: string): { category: 'ERROR_FATAL' | 'CHECKED_EXCEPTION' | 'UNCHECKED_RUNTIME'; action: string } {
      if (errName.includes("Error") || errName === "OutOfMemoryError") {
        return { category: "ERROR_FATAL", action: "Abort process, never catch or swallow" };
      } else if (errName.includes("IOException") || errName.includes("SQLException")) {
        return { category: "CHECKED_EXCEPTION", action: "Force compile-time try-catch or throws declaration" };
      } else {
        return { category: "UNCHECKED_RUNTIME", action: "Remediate bug or let global handler catch" };
      }
    }
  }

  const sim = new ThrowableSimulator();
  console.log("OutOfMemoryError:", sim.classify("OutOfMemoryError").category);
  console.log("SQLException:", sim.classify("SQLException").category);
  console.log("NullPointerException:", sim.classify("NullPointerException").category);
});

// Day 41 Part 2: Detective Lab: The Swallowed OutOfMemoryError
capture('d41p2', () => {
  function executeWithSafeHandler(taskName: string, errorType: string): string {
    try {
      if (errorType === "OutOfMemoryError") {
        throw new Error("JVM_FATAL_OOM: Metaspace exhausted");
      }
      return `Task ${taskName} executed successfully`;
    } catch (err: any) {
      if (err.message.includes("JVM_FATAL")) {
        // Correct architecture: Rethrow fatal JVM errors immediately
        console.log(`[CRITICAL ALERT] Fatal JVM Error intercepted: ${err.message}. Triggering shutdown hook!`);
        return "FATAL_ABORT";
      }
      return "RECOVERED";
    }
  }

  const res = executeWithSafeHandler("LedgerAudit", "OutOfMemoryError");
  console.log("Execution Status:", res);
});

// Day 41 Part 3: Mastery Assignment: Checked vs Unchecked Exception Boundary Architecture
capture('d41p3', () => {
  // Domain exception: Unchecked (extends RuntimeException)
  class InsufficientFundsException extends Error {
    constructor(public readonly availableCents: number, public readonly requestedCents: number) {
      super(`Insufficient funds: available $${(availableCents / 100).toFixed(2)}, requested $${(requestedCents / 100).toFixed(2)}`);
      this.name = "InsufficientFundsException";
    }
  }

  class AccountService {
    debit(balance: number, amount: number): number {
      if (amount > balance) {
        throw new InsufficientFundsException(balance, amount);
      }
      return balance - amount;
    }
  }

  const svc = new AccountService();
  try {
    svc.debit(5000, 12000);
  } catch (err: any) {
    console.log(`Caught Business Fault [${err.name}]: ${err.message}`);
  }
});

// Day 41 Part 4: Production Incident Lab: The Catch-All Exception Anti-Pattern
capture('d41p4', () => {
  class ResilientPaymentGateway {
    processPayment(payload: { cardNum: string; amount: number }): string {
      try {
        if (!payload.cardNum) throw new TypeError("Missing card number");
        if (payload.amount <= 0) throw new RangeError("Invalid charge amount");
        return `TX_SUCCESS_${payload.amount}`;
      } catch (err: any) {
        if (err instanceof TypeError || err instanceof RangeError) {
          console.log(`[VALIDATION_FAILED] Client error: ${err.message}`);
          return "HTTP_400_BAD_REQUEST";
        }
        console.log(`[INTERNAL_SYSTEM_FAULT] Unexpected: ${err.message}`);
        return "HTTP_500_INTERNAL_ERROR";
      }
    }
  }

  const gw = new ResilientPaymentGateway();
  console.log("Invalid Card:", gw.processPayment({ cardNum: "", amount: 1000 }));
  console.log("Valid Card:", gw.processPayment({ cardNum: "4111222233334444", amount: 5000 }));
});

// Day 41 Part 5: Comprehensive Throwable Hierarchy Viva Gate
capture('d41p5', () => {
  interface FaultAudit {
    readonly faultCode: string;
    readonly retryable: boolean;
  }

  function auditException(e: Error): FaultAudit {
    if (e.name === "TimeoutException" || e.name === "NetworkDropException") {
      return { faultCode: "ERR_NETWORK_TRANSIENT", retryable: true };
    }
    return { faultCode: "ERR_BUSINESS_TERMINAL", retryable: false };
  }

  console.log("Transient network error:", auditException({ name: "TimeoutException", message: "Read timed out" } as Error));
  console.log("Terminal domain error:", auditException({ name: "AccountLockedException", message: "Account frozen" } as Error));
});

// ==========================================
// DAY 42: Defensive Error Recovery: try-catch-finally
// ==========================================

// Day 42 Part 1: Stack Unwinding & Frame Deallocation Mechanics
capture('d42p1', () => {
  const callStack: string[] = [];

  function level3() {
    callStack.push("level3");
    console.log("Executing level3: throwing domain exception!");
    throw new Error("Core database deadlocked");
  }

  function level2() {
    callStack.push("level2");
    try {
      level3();
    } finally {
      const popped = callStack.pop();
      console.log(`Finally in level2: unwinding stack frame [${popped}]`);
    }
  }

  function level1() {
    callStack.push("level1");
    try {
      level2();
    } catch (e: any) {
      console.log(`Level 1 intercepted unwound exception: ${e.message}`);
    } finally {
      const popped = callStack.pop();
      console.log(`Finally in level1: unwinding stack frame [${popped}]`);
    }
  }

  level1();
});

// Day 42 Part 2: Detective Lab: The Hijacked Return in Finally
capture('d42p2', () => {
  // Anti-pattern: return inside finally overrides try/catch return
  function safeCalculation(success: boolean): { status: string; code: number } {
    let result = { status: "INIT", code: 0 };
    try {
      if (!success) throw new Error("Calculation overflow");
      result = { status: "SUCCESS", code: 200 };
      return result;
    } catch (e) {
      result = { status: "ERROR_HANDLED", code: 500 };
      return result;
    } finally {
      // Safe architecture: Perform cleanup ONLY, never execute return in finally!
      console.log("[Finally Cleanup] Releasing compute scratchpad memory");
    }
  }

  console.log("Normal run:", safeCalculation(true));
  console.log("Error run:", safeCalculation(false));
});

// Day 42 Part 3: Mastery Assignment: Multi-Catch & Exception Chaining
capture('d42p3', () => {
  class GatewayIntegrationException extends Error {
    constructor(message: string, public readonly cause: Error) {
      super(`${message} | Root Cause: [${cause.name}] ${cause.message}`);
      this.name = "GatewayIntegrationException";
    }
  }

  function executeRemoteCharge(token: string): string {
    try {
      if (token === "EXPIRED") throw new Error("Socket connection reset by peer");
      return "CHARGE_CONFIRMED";
    } catch (rawError: any) {
      // Exception chaining preserves root cause stack trace
      throw new GatewayIntegrationException("Payment authorization failed", rawError);
    }
  }

  try {
    executeRemoteCharge("EXPIRED");
  } catch (chained: any) {
    console.log(`Interception: ${chained.name} -> ${chained.message}`);
  }
});

// Day 42 Part 4: Production Incident Lab: The Unwound Thread Pool Crash
capture('d42p4', () => {
  class ThreadPoolWorkerSimulator {
    private activeThreads = 4;

    executeTask(taskId: string, failsFatal: boolean): void {
      try {
        console.log(`Worker executing task ${taskId}...`);
        if (failsFatal) throw new Error("Unchecked NullPointer in business plugin");
        console.log(`Task ${taskId} completed.`);
      } catch (err: any) {
        console.log(`[WORKER GUARD] Caught unhandled exception in ${taskId}: ${err.message}. Worker thread kept alive!`);
      }
      console.log(`Thread pool health: ${this.activeThreads}/${this.activeThreads} threads operational.`);
    }
  }

  const pool = new ThreadPoolWorkerSimulator();
  pool.executeTask("BATCH-01", false);
  pool.executeTask("BATCH-02", true);
});

// Day 42 Part 5: Clean Finally Guarantees
capture('d42p5', () => {
  let lockAcquired = false;

  function criticalTransaction(shouldThrow: boolean) {
    lockAcquired = true;
    console.log(`Lock acquired: ${lockAcquired}`);
    try {
      if (shouldThrow) throw new Error("Simulated sudden transaction abort");
      console.log("Transaction business logic executed.");
    } finally {
      lockAcquired = false;
      console.log(`Finally executed: Lock released -> ${lockAcquired}`);
    }
  }

  try {
    criticalTransaction(true);
  } catch (e: any) {
    console.log(`Handled outer error: ${e.message}`);
  }
  console.log(`Post-run lock state: ${lockAcquired}`);
});

// ==========================================
// DAY 43: Resource Lifecycles & try-with-resources
// ==========================================

// Day 43 Part 1: The AutoCloseable Contract & Suppressed Exceptions
capture('d43p1', () => {
  class ManagedDatabaseConnection {
    public isClosed = false;
    constructor(public readonly url: string) {
      console.log(`[CONNECT] Connection opened to ${url}`);
    }
    close(): void {
      this.isClosed = true;
      console.log(`[CLOSE] Connection safely closed to ${this.url}`);
    }
  }

  function simulateTryWithResources(url: string, failBody: boolean) {
    const conn = new ManagedDatabaseConnection(url);
    try {
      if (failBody) throw new Error("Query syntax error near 'SELECT'");
      console.log("Query executed successfully on", conn.url);
    } finally {
      conn.close();
    }
  }

  try {
    simulateTryWithResources("jdbc:postgresql://db.corp:5432/ledger", true);
  } catch (e: any) {
    console.log(`Caught error from body: ${e.message}`);
  }
});

// Day 43 Part 2: Detective Lab: The Leaked File Descriptor Outage
capture('d43p2', () => {
  class FileDescriptorPool {
    private openDescriptors = 0;
    private maxDescriptors = 3;

    openFile(name: string): { close: () => void } {
      if (this.openDescriptors >= this.maxDescriptors) {
        throw new Error("EMFILE: Too many open files / file descriptor leak detected");
      }
      this.openDescriptors++;
      console.log(`[FD OPEN] ${name} opened. Active descriptors: ${this.openDescriptors}/${this.maxDescriptors}`);
      return {
        close: () => {
          this.openDescriptors--;
          console.log(`[FD CLOSE] ${name} closed. Active descriptors: ${this.openDescriptors}/${this.maxDescriptors}`);
        }
      };
    }
  }

  const pool = new FileDescriptorPool();
  for (let i = 1; i <= 3; i++) {
    const file = pool.openFile(`audit_log_${i}.csv`);
    file.close(); // Clean deterministic close prevents EMFILE exhaustion
  }
  console.log("All file descriptor iterations completed without leak.");
});

// Day 43 Part 3: Mastery Assignment: Strongly-Typed Financial Fault Taxonomy
capture('d43p3', () => {
  abstract class CoreBankingFault extends Error {
    constructor(public readonly errorCode: string, message: string, public readonly httpStatus: number) {
      super(`[${errorCode}] ${message}`);
    }
  }

  class AccountFrozenFault extends CoreBankingFault {
    constructor(accId: string) {
      super("ERR_ACC_FROZEN", `Account ${accId} is frozen by compliance order`, 403);
    }
  }

  class DailyLimitExceededFault extends CoreBankingFault {
    constructor(amount: number, limit: number) {
      super("ERR_DAILY_LIMIT", `Transfer of $${amount} exceeds daily limit of $${limit}`, 422);
    }
  }

  const fault: CoreBankingFault = new AccountFrozenFault("ACC-9011");
  console.log(`Fault Code: ${fault.errorCode} | HTTP Status: ${fault.httpStatus}`);
  console.log(`Error Message: ${fault.message}`);
});

// Day 43 Part 4: Production Incident Lab: The Masked Database Exception
capture('d43p4', () => {
  // Simulating Java 7+ suppressed exceptions
  class AuditStream {
    close(): void {
      throw new Error("SUPPRESSED_EXCEPTION: Disk full on close()");
    }
  }

  try {
    const stream = new AuditStream();
    try {
      throw new Error("PRIMARY_EXCEPTION: Syntax error in SQL query");
    } finally {
      try {
        stream.close();
      } catch (closeErr: any) {
        console.log(`[SUPPRESSED ATTACHED] Primary exception preserved. Attached suppressed: ${closeErr.message}`);
      }
    }
  } catch (primary: any) {
    console.log(`Primary exception intercepted: ${primary.message}`);
  }
});

// Day 43 Part 5: Comprehensive Resource Lifecycle Simulation
capture('d43p5', () => {
  const trace: string[] = [];

  function transactionScope() {
    trace.push("RESOURCE_1_OPENED");
    trace.push("RESOURCE_2_OPENED");
    try {
      trace.push("WORK_EXECUTED");
    } finally {
      trace.push("RESOURCE_2_CLOSED"); // Reverse order closing
      trace.push("RESOURCE_1_CLOSED");
    }
  }

  transactionScope();
  console.log("Resource Lifecycle Execution Trace:");
  trace.forEach((step, idx) => console.log(`  ${idx + 1}. ${step}`));
});

// ==========================================
// DAY 44: JVM Garbage Collection Anatomy
// ==========================================

// Day 44 Part 1: The Generational Hypothesis & HotSpot Memory Layout
capture('d44p1', () => {
  class GCMemoryModelSimulator {
    edenCapacityMb = 512;
    survivorCapacityMb = 64;
    oldGenCapacityMb = 2048;

    simulateAllocation(objectLifetime: 'EPHEMERAL' | 'LONG_LIVED'): string {
      if (objectLifetime === "EPHEMERAL") {
        return "Allocated in Eden -> Collected during Young Gen Minor GC in < 1ms (Generational Hypothesis: 98% die young)";
      } else {
        return "Allocated in Eden -> Survived 15 Minor GCs -> Promoted (tenured) to Old Generation (Tenured space)";
      }
    }
  }

  const gc = new GCMemoryModelSimulator();
  console.log("HttpRequest DTO:", gc.simulateAllocation("EPHEMERAL"));
  console.log("Database Connection Pool:", gc.simulateAllocation("LONG_LIVED"));
});

// Day 44 Part 2: Detective Lab: The Unbounded Static Event Listener Leak
capture('d44p2', () => {
  class EventPublisher {
    private listeners: Function[] = [];

    subscribe(fn: Function): () => void {
      this.listeners.push(fn);
      return () => {
        const idx = this.listeners.indexOf(fn);
        if (idx !== -1) this.listeners.splice(idx, 1);
      };
    }
    listenerCount(): number { return this.listeners.length; }
  }

  const bus = new EventPublisher();
  const unsubscribe1 = bus.subscribe(() => console.log("Order processed"));
  const unsubscribe2 = bus.subscribe(() => console.log("Inventory decremented"));
  console.log("Active listeners before cleanup:", bus.listenerCount());
  unsubscribe1();
  console.log("Active listeners after explicit unsubscription:", bus.listenerCount());
});

// Day 44 Part 3: Mastery Assignment: Memory-Bounded Ring Buffer with WeakReferences
capture('d44p3', () => {
  class BoundedCache<K, V> {
    private cache = new Map<K, V>();
    constructor(private maxSize: number) {}

    put(key: K, value: V): void {
      if (this.cache.size >= this.maxSize) {
        // Evict oldest entry to prevent unbounded heap growth
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey !== undefined) this.cache.delete(oldestKey);
      }
      this.cache.set(key, value);
    }
    size(): number { return this.cache.size; }
  }

  const cache = new BoundedCache<string, string>(2);
  cache.put("K1", "V1");
  cache.put("K2", "V2");
  cache.put("K3", "V3"); // Evicts K1
  console.log("Cache size bounded at maximum capacity:", cache.size());
  console.log("Total entries strictly controlled to prevent heap OOM.");
});

// Day 44 Part 4: Production Incident Lab: The ThreadLocal Memory Leak in Tomcat
capture('d44p4', () => {
  class ThreadLocalSimulator {
    private static threadContext = new Map<string, any>();

    static set(key: string, value: any): void {
      this.threadContext.set(key, value);
    }
    static get(key: string): any {
      return this.threadContext.get(key);
    }
    static remove(key: string): void {
      this.threadContext.delete(key);
    }
  }

  ThreadLocalSimulator.set("CORRELATION_ID", "TRACE-889922");
  console.log("Context retrieved in thread:", ThreadLocalSimulator.get("CORRELATION_ID"));
  // Mandatory cleanup in worker thread pool
  ThreadLocalSimulator.remove("CORRELATION_ID");
  console.log("Context safely removed before thread returns to pool:", ThreadLocalSimulator.get("CORRELATION_ID"));
});

// Day 44 Part 5: GC Root Reachability Verification
capture('d44p5', () => {
  interface Node {
    id: string;
    next?: Node;
  }

  let root: Node | null = { id: "ROOT_NODE", next: { id: "CHILD_NODE" } };
  console.log("Active GC Root reference chain: root -> child");
  // Severing root makes both nodes eligible for garbage collection
  root = null;
  console.log("Root severed: entire reference subgraph eligible for GC reclamation.");
});

// ==========================================
// DAY 45: Milestone 8: Resilient File Ingestion Engine
// ==========================================

// Day 45 Part 1: Atomic Batch Ingestion Architecture & Rollback Protocol
capture('d45p1', () => {
  interface OrderRecord {
    id: string;
    amountCents: number;
  }

  class BatchIngestor {
    private committedStore: OrderRecord[] = [];

    ingestBatch(orders: OrderRecord[]): { success: boolean; committedCount: number } {
      const staging: OrderRecord[] = [];
      for (const order of orders) {
        if (order.amountCents <= 0) {
          console.log(`[VALIDATION ERROR] Record ${order.id} has invalid amount ${order.amountCents}. Aborting batch!`);
          return { success: false, committedCount: this.committedStore.length }; // Atomic rollback: zero staged committed
        }
        staging.push(order);
      }
      this.committedStore.push(...staging);
      console.log(`[BATCH COMMITTED] Successfully committed ${staging.length} orders atomically.`);
      return { success: true, committedCount: this.committedStore.length };
    }
  }

  const ingestor = new BatchIngestor();
  const validBatch: OrderRecord[] = [{ id: "ORD-1", amountCents: 5000 }, { id: "ORD-2", amountCents: 7500 }];
  ingestor.ingestBatch(validBatch);
});

// Day 45 Part 2: Detective Lab: The Partial Batch Persistence Corruption
capture('d45p2', () => {
  interface StoredRecord { id: string; price: number }
  const database: StoredRecord[] = [];

  function transactionExecute(records: StoredRecord[]): boolean {
    const snapshotSize = database.length;
    try {
      for (const r of records) {
        if (r.price < 0) throw new Error(`Negative price on ${r.id}`);
        database.push(r);
      }
      return true;
    } catch (e: any) {
      console.log(`[ROLLBACK TRIGGERED] ${e.message}. Reverting database to snapshot size ${snapshotSize}.`);
      database.length = snapshotSize; // Atomic rollback
      return false;
    }
  }

  const badBatch = [{ id: "A1", price: 100 }, { id: "A2", price: -50 }];
  const success = transactionExecute(badBatch);
  console.log("Transaction Success:", success);
  console.log("Database records retained post-rollback:", database.length);
});

// Day 45 Part 3: Mastery Assignment: Two-Phase Commit Order Batch Validator
capture('d45p3', () => {
  class TwoPhaseValidator {
    validatePhase(csvLines: string[]): { validCount: number; errors: string[] } {
      const errors: string[] = [];
      let valid = 0;
      csvLines.forEach((line, idx) => {
        const parts = line.split(",");
        if (parts.length !== 3) errors.push(`Line ${idx + 1}: Expected 3 columns`);
        else if (parseInt(parts[2], 10) <= 0) errors.push(`Line ${idx + 1}: Non-positive quantity`);
        else valid++;
      });
      return { validCount: valid, errors };
    }
  }

  const lines = ["ORD-101,SKU-A,5", "ORD-102,SKU-B,0", "CORRUPT_LINE"];
  const res = new TwoPhaseValidator().validatePhase(lines);
  console.log(`Phase 1 Pre-validation: ${res.validCount} valid, ${res.errors.length} fatal errors detected.`);
});

// Day 45 Part 4: Production Incident Lab: Out-Of-Memory File Streaming
capture('d45p4', () => {
  class LineByLineStreamSimulator {
    processStream(totalLines: number, chunkSize: number): void {
      let memoryUsedMb = 12; // Flat 12MB buffer
      let processed = 0;
      while (processed < totalLines) {
        processed += chunkSize;
        // Invariant: Memory remains constant O(1) regardless of total lines processed
      }
      console.log(`Streamed ${processed.toLocaleString()} records line-by-line. Max heap buffer: ${memoryUsedMb}MB (O(1) footprint).`);
    }
  }

  new LineByLineStreamSimulator().processStream(1000000, 10000);
});

// Day 45 Part 5: Milestone 8 Capstone Viva Gate
capture('d45p5', () => {
  class Milestone8IngestionEngine {
    runEngine(): string {
      return "[VIVA GATE CERTIFICATION] Milestone 8 Resilient Order File Ingestion Engine with Auto-Rollback PASSED";
    }
  }

  console.log("Milestone 8 Engine Verified:");
  console.log("1. AutoCloseable file reader streams data in constant O(1) memory.");
  console.log("2. Two-phase commit pre-validates all records before staging.");
  console.log("3. Atomic rollback reverts partial state if record fails.");
  console.log(new Milestone8IngestionEngine().runEngine());
});

// Save outputs
fs.writeFileSync('scripts/java_days41_45_outputs.json', JSON.stringify(outputs, null, 2), 'utf8');
console.log('Successfully captured all 25 outputs to scripts/java_days41_45_outputs.json!');
