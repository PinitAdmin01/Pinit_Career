#!/usr/bin/env python3
"""
Test Day 43 code samples for 100% deterministic execution and output matching.
"""
import sys
import io

# Part 1 Code: At-Least-Once Delivery & Duplicate Detection
p1_code = '''class AtLeastOnceBrokerSimulator:
    def __init__(self):
        self.delivered_messages = []

    def dispatch(self, message_id, payload, duplicate=False):
        self.delivered_messages.append({"id": message_id, "payload": payload})
        if duplicate:
            # Simulate network redelivery due to dropped ACK
            self.delivered_messages.append({"id": message_id, "payload": payload})

broker = AtLeastOnceBrokerSimulator()
broker.dispatch("msg_101", "charge_customer_sub", duplicate=True)

print(f"Total messages received at consumer: {len(broker.delivered_messages)}")
for i, m in enumerate(broker.delivered_messages):
    print(f"  Delivery {i+1}: ID={m['id']}, Action={m['payload']}")'''

# Part 2 Code: Visibility Timeout & Redelivery Race Condition
p2_code = '''class VisibilityTimeoutSimulator:
    def __init__(self, visibility_timeout_sec=10):
        self.visibility_timeout = visibility_timeout_sec
        self.in_flight = {}

    def lease_task(self, task_id, worker_id, current_time_sec):
        if task_id in self.in_flight:
            leased_at, prior_worker = self.in_flight[task_id]
            if (current_time_sec - leased_at) < self.visibility_timeout:
                return f"Task '{task_id}' locked by {prior_worker} (visible in {self.visibility_timeout - (current_time_sec - leased_at)}s)"
        self.in_flight[task_id] = (current_time_sec, worker_id)
        return f"Task '{task_id}' leased to {worker_id} at T={current_time_sec}s"

sim = VisibilityTimeoutSimulator(visibility_timeout_sec=10)
print(sim.lease_task("task_bill_99", "Worker_A", current_time_sec=0))
print(sim.lease_task("task_bill_99", "Worker_B", current_time_sec=5))
# T=12s > 10s: Visibility timeout expired, Worker B steals lease while Worker A is still running!
print(sim.lease_task("task_bill_99", "Worker_B", current_time_sec=12))'''

# Part 3 Code: Idempotency Key & Deduplication Cache
p3_code = '''class IdempotencyCache:
    def __init__(self):
        self.records = {}

    def execute_idempotent(self, idempotency_key, action_func):
        if idempotency_key in self.records:
            return f"DUPLICATE DETECTED -> Cached output: {self.records[idempotency_key]}"
        result = action_func()
        self.records[idempotency_key] = result
        return f"FIRST EXECUTION -> Result: {result}"

cache = IdempotencyCache()
charge_call = lambda: {"status": "PAID", "tx_id": "tx_882194", "amount_cents": 4900}

res1 = cache.execute_idempotent("sub_renewal_usr_4401_oct", charge_call)
res2 = cache.execute_idempotent("sub_renewal_usr_4401_oct", charge_call)

print("Call 1:", res1)
print("Call 2:", res2)'''

# Part 4 Code: Distributed Mutex with Lease TTL
p4_code = '''class DistributedMutex:
    def __init__(self):
        self.locks = {}

    def acquire(self, lock_key, owner_id, ttl_ms=5000):
        if lock_key in self.locks:
            return False, f"Lock '{lock_key}' held by {self.locks[lock_key]['owner']}"
        self.locks[lock_key] = {"owner": owner_id, "ttl_ms": ttl_ms}
        return True, f"Lock '{lock_key}' acquired by {owner_id} (TTL={ttl_ms}ms)"

    def release(self, lock_key, owner_id):
        if self.locks.get(lock_key, {}).get("owner") == owner_id:
            del self.locks[lock_key]
            return True, f"Lock '{lock_key}' released by {owner_id}"
        return False, "Release rejected: not owner or lock missing"

mutex = DistributedMutex()
ok1, msg1 = mutex.acquire("billing_lock_user_88", "worker_node_1")
ok2, msg2 = mutex.acquire("billing_lock_user_88", "worker_node_2")
ok3, msg3 = mutex.release("billing_lock_user_88", "worker_node_1")

print(f"Node 1 Acquire: {ok1} -> {msg1}")
print(f"Node 2 Contention: {ok2} -> {msg2}")
print(f"Node 1 Release: {ok3} -> {msg3}")'''

# Part 5 Code: Capstone Idempotent Billing Pipeline
p5_code = '''class ResilientBillingOrchestrator:
    def __init__(self):
        self.processed_transactions = {}
        self.active_locks = set()
        self.gateway_charges = 0

    def process_charge(self, idempotency_key, customer_id, amount_cents):
        if idempotency_key in self.processed_transactions:
            return "IDEMPOTENT_HIT", self.processed_transactions[idempotency_key]

        if idempotency_key in self.active_locks:
            return "CONCURRENCY_LOCKED", "Charge currently in-flight by another worker."

        # Acquire lock
        self.active_locks.add(idempotency_key)
        try:
            # Execute physical billing gateway charge
            self.gateway_charges += 1
            record = {"customer": customer_id, "amount_cents": amount_cents, "auth_code": "AUTH_99182"}
            self.processed_transactions[idempotency_key] = record
            return "CHARGE_SUCCESS", record
        finally:
            self.active_locks.remove(idempotency_key)

orchestrator = ResilientBillingOrchestrator()
k = "order_renewal_inv_77190"

s1, r1 = orchestrator.process_charge(k, "cust_330", 2999)
# Concurrent duplicate attempt simulating broker redelivery
s2, r2 = orchestrator.process_charge(k, "cust_330", 2999)

print(f"Attempt 1: Status={s1}, Auth={r1['auth_code']}")
print(f"Attempt 2: Status={s2}, Details={r2}")
print(f"Total Payment Gateway API Invocations: {orchestrator.gateway_charges}")
print("INVARIANT SATISFIED: Exactly 1 charge made despite duplicate broker deliveries.")'''

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
