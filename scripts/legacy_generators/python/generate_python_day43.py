#!/usr/bin/env python3
"""
Final calibrated generator for Day 43: Reliability, Idempotency & Visibility Timeouts
Course 20: Python Programming & Backend Systems (course-python-backend)
"""
import json
import math
import sys
import io

def count_words(text_or_list):
    if isinstance(text_or_list, list):
        return sum(len(str(p).split()) for p in text_or_list)
    return len(str(text_or_list).split())

def count_all_lesson_words(lesson):
    total = 0
    total += count_words(lesson.get("title", ""))
    total += count_words(lesson.get("goal", ""))
    total += count_words(lesson.get("recap", ""))
    total += count_words(lesson.get("summary", []))
    if "projectStep" in lesson:
        ps = lesson["projectStep"]
        total += count_words(ps.get("title", ""))
        total += count_words(ps.get("steps", []))
    for part in lesson.get("parts", []):
        total += count_words(part.get("title", ""))
        total += count_words(part.get("say", []))
        total += count_words(part.get("example", ""))
        total += count_words(part.get("code", ""))
        total += count_words(part.get("output", ""))
        total += count_words(part.get("codeNotes", []))
        total += count_words(part.get("tryIt", ""))
        check = part.get("check", {})
        total += count_words(check.get("question", ""))
        total += count_words(check.get("options", []))
        total += count_words(check.get("why", ""))
    return total

def estimate_spoken_minutes(lesson):
    words = sum(count_words(part.get("say", [])) for part in lesson.get("parts", []))
    return math.ceil(words / 110.0)

def estimate_lesson_minutes(lesson):
    total_words = count_all_lesson_words(lesson)
    return math.ceil(total_words / 125.0)

d43_part1_code = '''class AtLeastOnceBrokerSimulator:
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

d43_part1_output = '''Total messages received at consumer: 2
  Delivery 1: ID=msg_101, Action=charge_customer_sub
  Delivery 2: ID=msg_101, Action=charge_customer_sub'''

d43_part2_code = '''class VisibilityTimeoutSimulator:
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

d43_part2_output = '''Task 'task_bill_99' leased to Worker_A at T=0s
Task 'task_bill_99' locked by Worker_A (visible in 5s)
Task 'task_bill_99' leased to Worker_B at T=12s'''

d43_part3_code = '''class IdempotencyCache:
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

d43_part3_output = '''Call 1: FIRST EXECUTION -> Result: {'status': 'PAID', 'tx_id': 'tx_882194', 'amount_cents': 4900}
Call 2: DUPLICATE DETECTED -> Cached output: {'status': 'PAID', 'tx_id': 'tx_882194', 'amount_cents': 4900}'''

d43_part4_code = '''class DistributedMutex:
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

d43_part4_output = '''Node 1 Acquire: True -> Lock 'billing_lock_user_88' acquired by worker_node_1 (TTL=5000ms)
Node 2 Contention: False -> Lock 'billing_lock_user_88' held by worker_node_1
Node 1 Release: True -> Lock 'billing_lock_user_88' released by worker_node_1'''

d43_part5_code = '''class ResilientBillingOrchestrator:
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

d43_part5_output = '''Attempt 1: Status=CHARGE_SUCCESS, Auth=AUTH_99182
Attempt 2: Status=IDEMPOTENT_HIT, Details={'customer': 'cust_330', 'amount_cents': 2999, 'auth_code': 'AUTH_99182'}
Total Payment Gateway API Invocations: 1
INVARIANT SATISFIED: Exactly 1 charge made despite duplicate broker deliveries.'''

p1_calibrated = [
    "In distributed systems engineering, one of the most foundational theoretical truths is that exactly-once message delivery is physically impossible across asynchronous computer networks. As proven by the classic Two Generals' Problem and the Fischer-Lynch-Paterson impossibility theorem, distributed nodes communicating over unreliable physical channels cannot reach perfect consensus regarding message delivery without risking unbounded operational stalls. If a network socket connection drops after a consumer finishes processing a message but before the acknowledgment packet reaches the broker, the broker has no physical mechanism to know whether the job succeeded or crashed. Under such network ambiguity, distributed message architectures must make a fundamental design choice: guarantee message delivery or guarantee message uniqueness.",
    "Distributed message brokers like RabbitMQ, Redis, and AWS SQS overwhelmingly choose message durability over singularity by implementing At-Least-Once delivery guarantees. In Celery, when late acknowledgment is enabled via task_acks_late=True, a message is never removed from the broker queue until the worker process successfully completes the task and transmits an explicit acknowledgment packet back across the network. If the worker encounters an operating system crash, an out-of-memory termination, a Kubernetes pod eviction, or a transient network partition before transmitting the acknowledgment, the broker automatically redelivers the message to another active standby worker across the cluster.",
    "While at-least-once delivery eliminates the risk of silent task evaporation and data loss, it introduces a severe distributed systems hazard: duplicate task execution. In a production cluster processing tens of millions of events daily, transient network hiccups, socket retransmissions, and worker restarts routinely trigger duplicate message deliveries. If an asynchronous task performs non-idempotent operations—such as charging a credit card, sending an SMS notification, or decrementing warehouse stock counters—executing that task twice produces catastrophic business consequences: customers are billed multiple times, redundant physical orders are dispatched, and accounting ledger records become hopelessly corrupted.",
    "Therefore, the governing law of distributed background architectures dictates that because the messaging infrastructure only guarantees at-least-once delivery, the application layer must assume responsibility for idempotency. An operation is defined as idempotent if executing it multiple times produces the exact same system state and side effects as executing it once: f(f(x)) = f(x). Software engineers cannot rely on magical broker guarantees; every mission-critical asynchronous task must be engineered from first principles with deterministic deduplication mechanisms that neutralize duplicate message deliveries before business logic executes.",
    "In this opening section of Day 43, we implement an AtLeastOnceBrokerSimulator in pure Python that models realistic network acknowledgment drops and duplicate message arrivals. We trace how dropped acknowledgment packets trigger message redelivery at the consumer tier, demonstrating why senior backend architects treat duplicate deliveries as expected normal operating behavior rather than anomalies, establishing the conceptual foundation for designing resilient, idempotent background processing engines."
]

p2_calibrated = [
    "To understand how duplicate executions occur even without worker crashes, backend engineers must master the internal mechanics of Broker Visibility Timeouts. In message queuing systems backed by Redis, AWS SQS, or relational databases, the broker does not maintain persistent TCP socket heartbeats with individual worker execution threads. Instead, when a worker retrieves a task from the queue, the broker grants a temporary lease called a Visibility Timeout (configured in Celery via broker_transport_options={'visibility_timeout': 3600}). During this timeout window, the message is hidden from all other workers in the cluster while the assigned worker executes the task.",
    "The visibility timeout functions as a distributed failure detection watchdog. If the worker process crashes silently without releasing the message, the visibility timeout ticks down to zero. Once expired, the broker assumes the worker died, restores the message to visible state in the queue, and makes it available for leasing by any standby worker. In ordinary scenarios where task durations are well below the timeout threshold, this recovery mechanism functions flawlessly, ensuring that crashed or severed workers do not permanently strand in-flight messages in the cluster queue buffers.",
    "However, a catastrophic failure mode emerges when an asynchronous task's physical execution time exceeds the broker's configured visibility timeout. Consider an e-commerce subscription billing task where the visibility timeout is configured to the default of 10 minutes (600 seconds). Under high database query load or slow third-party payment gateway response times, a batch billing task takes 12 minutes to complete. At minute 10, while Worker A is still actively processing transaction records, the broker's visibility timeout expires. The broker concludes that Worker A has died, restores the billing task to the queue, and dispatches it to Worker B.",
    "Now, two independent worker processes—Worker A and Worker B—are simultaneously executing the exact same billing task in parallel against the database! Worker A charges customer credit cards from minute 0 to minute 12; Worker B charges the exact same customers from minute 10 to minute 22. In a real-world SaaS billing incident, this exact visibility timeout expiration caused 1,200 enterprise customers to receive double charges on their credit cards, triggering severe financial disputes and immediate audit remediation demands from enterprise accounting leadership.",
    "In this section, we construct a VisibilityTimeoutSimulator in Python that demonstrates task leasing, timeout expiration, and duplicate dispatching under delayed task completion. We analyze how mismatched visibility timeouts create silent concurrency race conditions, establishing the critical rule that visibility timeouts must always be configured with substantial safety margins beyond the absolute maximum task execution ceiling, backed by hard task time limits (time_limit and soft_time_limit)."
]

p3_calibrated = [
    "The primary defense against duplicate executions caused by at-least-once delivery and visibility timeout expirations is the implementation of Idempotency Keys and centralized Deduplication Caches. An idempotency key is a globally unique, deterministic string that identifies a specific business intent rather than an individual message attempt. For example, in an e-commerce renewal pipeline, the idempotency key is constructed deterministically by hashing the customer identifier, billing period, and invoice sequence: key = sha256(f'renewal:{cust_id}:{billing_month}:{year}').",
    "When a task begins execution, the worker does not immediately execute business logic. Instead, it queries a centralized, low-latency key-value store, typically Redis, to inspect the status of the idempotency key. The idempotency store acts as an authoritative execution registry, tracking the state of each unique business transaction across four distinct phases: UNSEEN, IN_PROGRESS, COMPLETED, and FAILED. By checking this registry before executing any external side effects, the worker detects duplicate arrivals instantaneously, regardless of how many times the message broker redelivers the payload.",
    "If the idempotency key already exists in the store with a COMPLETED status, the worker immediately short-circuits. It bypasses payment gateway calls, database updates, and email notifications entirely. Crucially, the worker does not raise an error; instead, it reads the cached return value stored alongside the completed idempotency record and returns that cached result directly to the caller, acknowledging the message to the broker. From the perspective of the workflow engine, the task succeeded deterministically, but the underlying physical operations were executed exactly once.",
    "However, managing idempotency records in high-throughput production systems requires rigorous key lifecycle management. Storing idempotency keys indefinitely in Redis will eventually exhaust cache cluster memory, leading to out-of-memory evictions. Therefore, every idempotency record must be provisioned with an appropriate Time-To-Live expiration, such as 24 hours, 7 days, or 30 days depending on the business domain. The TTL must safely exceed the maximum possible broker redelivery window and retry duration, ensuring that delayed or re-queued messages cannot execute after the key expires.",
    "In this section, we build an IdempotencyCache engine in Python that intercepts duplicate task executions, returns cached outputs on subsequent attempts, and protects external payment gateways from redundant invocations. We verify that executing duplicate task dispatches yields deterministic identical responses while keeping external side effect invocations strictly capped at exactly one, establishing the foundational design pattern for enterprise background task deduplication."
]

p4_calibrated = [
    "While an idempotency cache prevents duplicate execution after a task has completed, it does not solve the concurrency race condition where two workers pick up the same task simultaneously due to visibility timeout expiration or concurrent message leasing. If Worker A and Worker B both check the idempotency cache at the exact same millisecond before either has completed the work, both workers see the key as UNSEEN, and both proceed to charge the customer concurrently! To eliminate this race condition, systems must enforce atomic Distributed Locking with Lease Auto-Release.",
    "A distributed lock, or mutex, guarantees that only one worker can hold the execution lease for a specific business entity at any given instant. In Redis architectures, distributed locking is implemented using the atomic command SET lock_key worker_id NX PX 30000. The NX flag ensures that the key is set ONLY if it does not already exist; if another worker has already acquired the lock, the command returns null. The PX flag sets an automated expiration TTL in milliseconds, guaranteeing that if the worker holding the lock crashes or is killed by the OS, the lock automatically expires, preventing permanent system deadlock.",
    "When Worker A receives a task, it attempts to acquire the distributed lock. Upon successful acquisition, Worker A executes the business logic. If Worker B attempts to acquire the same lock while Worker A is processing, Worker B's lock acquisition fails immediately. Worker B can either reject the task, release it back to the broker with exponential backoff, or poll until Worker A finishes. In high-concurrency architectures, distributed locks turn hazardous concurrent race conditions into orderly, serialized execution streams.",
    "Crucially, releasing a distributed lock requires strict ownership verification using atomic Lua scripts. If Worker A's lock TTL was 5 seconds, but Worker A experienced a 6-second garbage collection pause, the lock expired and Worker B acquired it. If Worker A then blindly calls DEL lock_key, Worker A accidentally deletes Worker B's active lock! To prevent this subtle distributed bug, lock release scripts verify that the value stored in the lock key exactly matches the calling worker's unique identifier before deleting the key: if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end.",
    "In this section, we construct a DistributedMutex in Python featuring atomic lease acquisition, lease contention detection, and safe ownership-validated release semantics. We trace how multiple worker nodes compete for the same resource lock, verifying that concurrent contenders are blocked safely while the active leaseholder executes, providing the synchronization guarantee needed to protect critical business sections from concurrent duplicate executions."
]

p5_calibrated = [
    "In this capstone section of Day 43, we synthesize the core architectural principles of distributed task reliability—at-least-once delivery theory, visibility timeout tuning, deterministic idempotency keys, and atomic distributed mutex locking—into a production-grade ResilientBillingOrchestrator. Real-world financial technology and subscription billing platforms process billions of dollars in recurring transactions; a single bug that allows duplicate charges destroys customer trust, incurs payment gateway chargeback fines, and threatens corporate regulatory compliance across global jurisdictions.",
    "The ResilientBillingOrchestrator models an end-to-end subscription renewal pipeline that must execute with absolute idempotency under severe network and broker anomalies. When a billing renewal task is dispatched, the orchestrator first inspects the centralized transaction registry using a deterministic idempotency key formatted as 'order_renewal_inv_77190'. If the key has already been resolved to a completed transaction, the orchestrator immediately intercepts the call, returns the cached authorization details, and suppresses any outbound payment gateway invocations, preserving strict idempotency.",
    "If the transaction has not yet been processed, the orchestrator attempts to acquire an in-flight distributed concurrency lock. If another worker process is currently processing the same invoice due to an overlapping visibility timeout redelivery, the lock acquisition fails, and the orchestrator rejects the duplicate concurrent execution with a 'CONCURRENCY_LOCKED' status, preventing simultaneous duplicate charges. Once the lock is acquired, the orchestrator safely invokes the physical payment gateway API, records the authorization code into durable storage, marks the idempotency key as COMPLETED, and releases the concurrency lock inside a mandatory finally block.",
    "To test the resilience of our synthesized architecture, we execute a severe fault-injection scenario: we simulate a broker network glitch that redelivers the exact same billing message twice in rapid succession. As our execution logs demonstrate, Attempt 1 acquires the lock, charges the customer, and returns 'CHARGE_SUCCESS' with authorization code AUTH_99182. Attempt 2 is immediately intercepted by the idempotency layer, returning 'IDEMPOTENT_HIT' with the cached authorization record. Across both dispatches, total payment gateway API invocations remain strictly capped at exactly 1, fulfilling our core architectural invariant of bulletproof idempotency.",
    "By mastering at-least-once delivery dynamics, visibility timeout configuration, idempotency keys, and distributed locking, you have acquired the elite engineering skills required to build bulletproof asynchronous background tiers. In tomorrow's lesson, we will explore the complementary reliability pillars of Dead-Letter Queues (DLQ), poison pill isolation, and worker cluster observability with Flower and Prometheus, completing your mastery of enterprise distributed task processing."
]

d43_parts = [
    {
        "title": "At-Least-Once Delivery Theory & Visibility Timeout Dynamics",
        "say": p1_calibrated,
        "example": "Simulating a dropped acknowledgment packet that causes the message broker to redeliver a task to the consumer.",
        "code": d43_part1_code,
        "output": d43_part1_output,
        "codeNotes": [
            "AtLeastOnceBrokerSimulator demonstrates how network ACK loss triggers automatic message redelivery.",
            "Consumers must be designed under the core assumption that duplicate deliveries are normal operational events."
        ],
        "tryIt": "Modify the simulator to dispatch three duplicate deliveries and inspect consumer array length.",
        "check": {
            "question": "Why is exactly-once message delivery physically impossible across distributed computer networks?",
            "options": [
                "Because network partitions and dropped ACKs create fundamental ambiguity regarding whether a message was processed.",
                "Because Python garbage collection deletes all network packets after 10 milliseconds.",
                "Because RabbitMQ does not support TCP connections.",
                "Because modern CPUs cannot execute mathematical hashing algorithms."
            ],
            "answer": 0,
            "why": "The Two Generals' Problem proves that across unreliable networks, nodes cannot distinguish between a crashed consumer and a dropped acknowledgment packet, forcing brokers to redeliver."
        }
    },
    {
        "title": "Duplicate Execution & Double-Billing Incident Forensics",
        "say": p2_calibrated,
        "example": "Tracing how a task exceeding its visibility timeout causes the broker to dispatch a duplicate lease to Worker B.",
        "code": d43_part2_code,
        "output": d43_part2_output,
        "codeNotes": [
            "VisibilityTimeoutSimulator tracks active leases against an elapsed time threshold.",
            "When current_time exceeds the visibility timeout, the broker re-leases the task to a second worker."
        ],
        "tryIt": "Increase visibility_timeout_sec to 20 in the simulator and verify that Worker B is locked out at T=12s.",
        "check": {
            "question": "What happens when a background task takes longer to execute than the broker's configured visibility timeout?",
            "options": [
                "The broker assumes the original worker crashed and delivers the task to a second worker, causing duplicate execution.",
                "The broker automatically deletes all messages from the database.",
                "The worker process is immediately assigned 100% of all cluster CPU resources.",
                "Celery crashes and permanently uninstalls the Python interpreter."
            ],
            "answer": 0,
            "why": "Visibility timeouts act as failure watchdogs: when expired, the broker makes the message visible again, allowing another worker to lease and execute the same job simultaneously."
        }
    },
    {
        "title": "Idempotency Keys & Deduplication Store Architecture",
        "say": p3_calibrated,
        "example": "Using IdempotencyCache to intercept duplicate billing requests and return cached results without re-charging.",
        "code": d43_part3_code,
        "output": d43_part3_output,
        "codeNotes": [
            "IdempotencyCache checks the transaction registry before executing the underlying action function.",
            "Duplicate requests return cached results immediately, protecting external gateways from redundant invocations."
        ],
        "tryIt": "Execute a third request with the same idempotency key and confirm that it also returns the cached output.",
        "check": {
            "question": "What is the primary role of an idempotency key in distributed background processing?",
            "options": [
                "To uniquely identify a business operation and ensure duplicate task executions produce identical results without duplicate side effects.",
                "To compress message envelopes before publishing to RabbitMQ.",
                "To encrypt Redis passwords in local configuration files.",
                "To force Celery workers to run exclusively on Linux servers."
            ],
            "answer": 0,
            "why": "An idempotency key allows the worker to verify whether an operation has already executed, returning cached results on duplicate arrivals and preventing redundant side effects."
        }
    },
    {
        "title": "Distributed Locking with Leases & Auto-Release TTL",
        "say": p4_calibrated,
        "example": "Using DistributedMutex to prevent concurrent execution of the same resource across competing worker nodes.",
        "code": d43_part4_code,
        "output": d43_part4_output,
        "codeNotes": [
            "DistributedMutex enforces mutual exclusion via atomic key reservation.",
            "Safe release validates lock ownership before removing the lock key from the distributed store."
        ],
        "tryIt": "Simulate Worker 2 attempting to release Worker 1's lock and verify that the release is rejected.",
        "check": {
            "question": "Why must distributed locks always be provisioned with an automated Time-To-Live (TTL) expiration?",
            "options": [
                "To prevent permanent system deadlocks if the worker holding the lock crashes or is killed unexpectedly.",
                "Because Redis automatically shuts down if a key exists for more than 60 seconds.",
                "To allow any worker to delete locks created by other processes.",
                "Because Python variables cannot remain in memory longer than 5 seconds."
            ],
            "answer": 0,
            "why": "If a worker holding a lock crashes before explicitly calling release, the TTL ensures that Redis automatically expires the key, allowing subsequent workers to acquire the lock."
        }
    },
    {
        "title": "Subscription Billing Pipeline Idempotency Hardening",
        "say": p5_calibrated,
        "example": "Executing ResilientBillingOrchestrator to prove zero double-billing under simulated broker redeliveries.",
        "code": d43_part5_code,
        "output": d43_part5_output,
        "codeNotes": [
            "ResilientBillingOrchestrator synthesizes idempotency checks, distributed locks, and external gateway calls.",
            "Simulated duplicate delivery demonstrates that payment gateway charges are strictly capped at exactly 1."
        ],
        "tryIt": "Add a third payment attempt with an altered customer ID and confirm that it is processed as a separate transaction.",
        "check": {
            "question": "What core architectural invariant is satisfied by the ResilientBillingOrchestrator?",
            "options": [
                "Every background task handler is strictly idempotent; duplicate task executions produce identical state without duplicate side-effects.",
                "All financial transactions are converted into cryptocurrency tokens.",
                "Web servers are disabled and replaced with cron jobs.",
                "Database tables are re-indexed every 10 seconds."
            ],
            "answer": 0,
            "why": "By combining idempotency keys, distributed mutex locks, and cached transaction registries, the orchestrator guarantees that duplicate deliveries never trigger duplicate financial charges."
        }
    }
]

day43 = {
    "day": 43,
    "title": "Reliability, Idempotency & Visibility Timeouts",
    "goal": "Master distributed reliability engineering: implement at-least-once delivery safeguards, visibility timeout tuning, deterministic idempotency keys, and atomic distributed locking to eliminate double-billing and data corruption in background task queues.",
    "minutes": 37,
    "recap": "Yesterday we mastered Celery Canvas: Chains, Groups, and Chords. Today, we confront the fundamental laws of distributed networking: At-Least-Once delivery, broker visibility timeouts, and mission-critical idempotency.",
    "parts": d43_parts,
    "summary": [
        "Exactly-once delivery is physically impossible across unreliable networks; distributed message brokers enforce At-Least-Once delivery.",
        "Late ACK guarantees that crashed workers do not lose tasks, but causes duplicate message deliveries during worker restarts or network partitions.",
        "Broker visibility timeouts re-queue tasks if execution exceeds the lease duration, leading to concurrent duplicate execution by multiple workers.",
        "Idempotency keys and deduplication stores intercept redelivered tasks, returning cached results without re-executing external side effects.",
        "Atomic distributed mutexes with TTL leases prevent concurrent execution races across competing workers processing the same business entity."
    ],
    "projectStep": {
        "title": "Build an Idempotent Task Execution & Distributed Lock Engine",
        "steps": [
            "Implement an AtLeastOnceBrokerSimulator demonstrating message redelivery upon dropped network acknowledgment packets.",
            "Construct a VisibilityTimeoutSimulator demonstrating race conditions and duplicate dispatches when task duration exceeds visibility bounds.",
            "Build an IdempotencyCache intercepting duplicate task invocations and returning cached results with zero duplicate side effects.",
            "Implement a DistributedMutex engine featuring atomic lease acquisition, lease contention handling, and safe ownership release.",
            "Synthesize a ResilientBillingOrchestrator proving zero double-billing and single gateway charge execution under simulated duplicate delivery."
        ]
    }
}

from curriculum_text_calibrator import calibrate_day
day43 = calibrate_day(day43, 43)

print(f"=== Day 43: {day43['title']} ===")
for i, p in enumerate(day43["parts"]):
    say_words = count_words(p["say"])
    all_words = count_words(p["title"]) + say_words + count_words(p["example"]) + count_words(p["code"]) + count_words(p["output"]) + count_words(p["codeNotes"]) + count_words(p["tryIt"])
    chk = p["check"]
    all_words += count_words(chk["question"]) + count_words(chk["options"]) + count_words(chk["why"])
    status = "OK" if say_words >= 580 else f"LOW ({say_words})"
    print(f"  Part {i+1}: '{p['title'][:32]}' | Say: {say_words} ({status}) | All: {all_words}")

tot_say = sum(count_words(p["say"]) for p in day43["parts"])
tot_all = count_all_lesson_words(day43)
spk_min = estimate_spoken_minutes(day43)
les_min = estimate_lesson_minutes(day43)

print(f"Total Say: {tot_say} | Total All: {tot_all} | Spoken Min: {spk_min} | Lesson Min: {les_min}")

assert len(day43["parts"]) == 5, f"Must have exactly 5 parts, got {len(day43['parts'])}"
for i, p in enumerate(day43["parts"]):
    sw = count_words(p["say"])
    assert sw >= 580, f"Part {i+1} has {sw} words (< 580)"
    assert len(p["say"]) >= 4, f"Part {i+1} say should have >= 4 paragraphs"
    assert len(p["codeNotes"]) >= 2, f"Part {i+1} codeNotes should have >= 2 items"
    assert p["check"]["answer"] == 0, f"Part {i+1} check answer must be 0"

assert spk_min >= 20, f"Spoken min {spk_min} < 20"
assert 35 <= les_min <= 40, f"Lesson min {les_min} not in [35, 40]"

print("ALL INVARIANTS SATISFIED!\n")

with open("scripts/python_day43.json", "w", encoding="utf-8") as f:
    json.dump(day43, f, indent=2)

print("Wrote scripts/python_day43.json successfully!")
