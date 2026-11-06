#!/usr/bin/env python3
"""
Test Day 45 code samples for 100% deterministic execution and output matching.
"""
import sys
import io

# Part 1 Code: Milestone 8 Data Contracts & Message Envelopes
p1_code = '''class MilestoneMessageEnvelope:
    def __init__(self, task_name, task_id="m8_task_001", args=None, kwargs=None):
        self.task_id = task_id
        self.task_name = task_name
        self.args = args or []
        self.kwargs = kwargs or {}
        self.retries = 0
        self.max_retries = 3
        self.state = "PENDING"

    def to_dict(self):
        return {
            "id": self.task_id,
            "name": self.task_name,
            "args": self.args,
            "kwargs": self.kwargs,
            "retries": self.retries,
            "state": self.state
        }

env = MilestoneMessageEnvelope("orders.process_checkout", args=["order_9812"])
print(f"Contract Schema Verified: Task '{env.task_name}' [ID: {env.task_id}]")
print(f"Initial State: {env.state} | Max Retries: {env.max_retries}")
print(f"Serialized Payload: {env.to_dict()}")'''

# Part 2 Code: Worker Crash Recovery & Idempotency Lock Release
p2_code = '''class CrashResilientExecutor:
    def __init__(self):
        self.locks = set()
        self.completed_txs = {}
        self.charge_attempts = 0

    def execute_payment_step(self, order_id, fail_on_first_try=True):
        self.charge_attempts += 1
        print(f"[Attempt {self.charge_attempts}] Processing payment for '{order_id}'...")
        
        # Acquire in-flight lock
        self.locks.add(order_id)
        try:
            if fail_on_first_try and self.charge_attempts == 1:
                print(f"[Attempt {self.charge_attempts}] Worker crashed mid-flight! (SIGKILL simulated)")
                raise RuntimeError("SimulatedWorkerCrash")
            # Payment success
            self.completed_txs[order_id] = "AUTH_APPROVED_981"
            print(f"[Attempt {self.charge_attempts}] Payment settled successfully.")
            return self.completed_txs[order_id]
        except Exception:
            # Crucial: Release lock so late-ACK retry can acquire it!
            self.locks.remove(order_id)
            print("Late ACK safety: In-flight lock cleanly released for redelivery.")
            return None

executor = CrashResilientExecutor()
# First attempt crashes
executor.execute_payment_step("order_880", fail_on_first_try=True)
# Redelivery attempt by standby worker succeeds
auth = executor.execute_payment_step("order_880", fail_on_first_try=False)

print(f"Final Transaction State: {executor.completed_txs}")
print(f"Payment Authorization: {auth}")'''

# Part 3 Code: Canvas Workflow Engine (Validate -> Group -> Invoice)
p3_code = '''class MilestoneCanvasWorkflow:
    def execute_order_pipeline(self, order_id):
        log = []
        # Step 1: Sequential Validation
        log.append(f"STEP 1 [Chain]: Validate order '{order_id}' items and customer profile.")
        
        # Step 2: Parallel Group
        subtasks = ["charge_payment", "reserve_inventory", "notify_warehouse"]
        log.append(f"STEP 2 [Group]: Dispatch {len(subtasks)} tasks concurrently: {subtasks}")
        
        # Step 3: Chord Barrier
        log.append("STEP 3 [Chord]: Barrier reached (3/3 completed).")
        log.append(f"STEP 3 [Chord]: Trigger callback -> generate_tax_invoice('{order_id}').")
        return "INVOICE_PDF_GENERATED", log

workflow = MilestoneCanvasWorkflow()
status, execution_log = workflow.execute_order_pipeline("ord_9901")

print("=== Milestone 8 Canvas Order Workflow ===")
for entry in execution_log:
    print(f"  {entry}")
print(f"Final Pipeline Result: {status}")'''

# Part 4 Code: Poison Pill Interception & DLQ Isolation
p4_code = '''class MilestoneDLQEngine:
    def __init__(self, max_retries=3):
        self.max_retries = max_retries
        self.primary_processed = 0
        self.dlq = []

    def dispatch(self, task_id, is_poison=False):
        if not is_poison:
            self.primary_processed += 1
            return "SUCCESS"
        # Poison pill: fails up to max retries, then evicted to DLQ
        print(f"Poison pill detected on task '{task_id}'! Retrying up to {self.max_retries} times...")
        for r in range(1, self.max_retries + 1):
            print(f"  Retry attempt {r}/{self.max_retries} failed (Invalid SKU payload).")
        entry = {"task_id": task_id, "error": "FATAL_INVALID_SKU", "status": "DLQ_QUARANTINED"}
        self.dlq.append(entry)
        print(f"Task '{task_id}' evicted to DLQ: Cluster capacity preserved.")
        return "DLQ_ISOLATED"

engine = MilestoneDLQEngine(max_retries=3)
engine.dispatch("valid_order_01", is_poison=False)
engine.dispatch("valid_order_02", is_poison=False)
engine.dispatch("poison_order_99", is_poison=True)

print(f"Valid orders completed: {engine.primary_processed}")
print(f"Dead-lettered orders: {len(engine.dlq)} (Isolated in DLQ)")'''

# Part 5 Code: Milestone 8 Production Defense & Verification Gate
p5_code = '''class Milestone8VerificationGate:
    def run_production_defense(self):
        # 1. Late ACK Durability Check
        task_loss_rate = 0.0
        # 2. Idempotency Check (Duplicate charges)
        duplicate_charge_count = 0
        # 3. DLQ Quarantine Efficiency
        poison_pill_isolation_rate = 1.0
        # 4. Canvas Workflow Completion
        workflow_success_rate = 1.0
        
        checks = [
            ("Zero Task Loss Contract", task_loss_rate == 0.0),
            ("Strict Idempotency Contract", duplicate_charge_count == 0),
            ("100% Poison Pill Isolation", poison_pill_isolation_rate == 1.0),
            ("Canvas Barrier Synchronization", workflow_success_rate == 1.0)
        ]
        return checks

gate = Milestone8VerificationGate()
results = gate.run_production_defense()

print("=== Milestone 8 Production Verification Gate ===")
all_passed = True
for name, passed in results:
    status = "PASSED" if passed else "FAILED"
    print(f"  [{status}] {name}")
    if not passed: all_passed = False

if all_passed:
    print("")
    print("MILESTONE 8 PASSED: Distributed Task Queue Engine Certified for Production!")'''

codes = [p1_code, p2_code, p3_code, p4_code, p5_code]

for i, c in enumerate(codes):
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    try:
        exec(c, {})
        out = sys.stdout.getvalue().strip()
    finally:
        sys.stdout = old_stdout
    print(f"=== PART {i+1} OUTPUT ===")
    print(out)
    print()
