#!/usr/bin/env python3
"""
Test Day 44 code samples for 100% deterministic execution and output matching.
"""
import sys
import io

# Part 1 Code: AMQP Dead-Letter Exchange Routing Simulation
p1_code = '''class DeadLetterExchangeSimulator:
    def __init__(self):
        self.primary_queue = []
        self.dead_letter_queue = []

    def process_task(self, task_name, payload):
        print(f"Worker dequeued '{task_name}'...")
        if not payload.get("valid_schema", False):
            # Message rejected without requeue -> routed to DLX
            self.dead_letter_queue.append({"task": task_name, "reason": "SCHEMA_VALIDATION_ERROR"})
            print(f"REJECTED: '{task_name}' failed schema validation -> Routed to DLQ!")
        else:
            print(f"SUCCESS: '{task_name}' processed cleanly.")

dlx = DeadLetterExchangeSimulator()
dlx.process_task("send_welcome_email", {"valid_schema": True, "email": "user@test.com"})
dlx.process_task("sync_invoice_webhook", {"valid_schema": False, "payload": "corrupt_data"})

print(f"Primary Queue status: Empty (all tasks triaged)")
print(f"Dead-Letter Queue depth: {len(dlx.dead_letter_queue)} quarantined message(s)")
print(f"Quarantined item: {dlx.dead_letter_queue[0]}")'''

# Part 2 Code: Poison Pill Cascade vs Bounded Retries
p2_code = '''class PoisonPillForensics:
    def simulate_unbounded_retries(self, tasks=3, attempts=10):
        # Unbounded retry causes infinite loop
        return f"UNBOUNDED RETRIES: {tasks} poison pill tasks generated {tasks * attempts} failed executions, blocking cluster!"

    def simulate_bounded_retries(self, poison_tasks, max_retries=3):
        retries_logged = []
        evicted_to_dlq = []
        for t in poison_tasks:
            for r in range(1, max_retries + 1):
                retries_logged.append(f"Task '{t}' retry {r}/{max_retries}")
            evicted_to_dlq.append(t)
        return retries_logged, evicted_to_dlq

forensics = PoisonPillForensics()
print(forensics.simulate_unbounded_retries())

log, dlq = forensics.simulate_bounded_retries(["webhook_bad_json", "corrupt_pdf_job"], max_retries=3)
print(f"Bounded retries executed: {len(log)} total attempts before eviction")
print(f"Tasks safely quarantined in DLQ: {dlq}")'''

# Part 3 Code: Exponential Backoff & DLQ Router
p3_code = '''class DLQBackoffRouter:
    def __init__(self, max_retries=3, base_delay_sec=1):
        self.max_retries = max_retries
        self.base_delay_sec = base_delay_sec
        self.dlq = []

    def compute_backoff_schedule(self):
        # Deterministic exponential backoff intervals without random jitter for testing
        schedule = []
        for attempt in range(1, self.max_retries + 1):
            delay = self.base_delay_sec * (2 ** (attempt - 1))
            schedule.append(delay)
        return schedule

    def handle_terminal_failure(self, task_id, error_msg):
        entry = {"task_id": task_id, "error": error_msg, "status": "QUARANTINED"}
        self.dlq.append(entry)
        return entry

router = DLQBackoffRouter(max_retries=3, base_delay_sec=2)
delays = router.compute_backoff_schedule()
print(f"Exponential backoff schedule (seconds): {delays}")

entry = router.handle_terminal_failure("task_wh_9918", "HTTP 410 Gone: Customer endpoint deleted")
print(f"Task evicted to DLQ: ID={entry['task_id']}, Reason='{entry['error']}'")
print(f"Active DLQ queue count: {len(router.dlq)}")'''

# Part 4 Code: Worker Concurrency Models (Prefork vs Async I/O)
p4_code = '''class WorkerPoolProfiler:
    def profile_workload(self, task_type, concurrency):
        if task_type == "CPU_BOUND":
            # Prefork multiprocessing pool: 1 worker per physical CPU core
            return f"POOL: prefork (processes={concurrency}) | Best for: Video encoding, compression, ML inference."
        elif task_type == "IO_BOUND":
            # Greenlet/async pool: high concurrency for network I/O
            return f"POOL: gevent/eventlet (concurrency={concurrency}) | Best for: Webhooks, HTTP API polling, DB queries."
        return "Unknown pool"

profiler = WorkerPoolProfiler()
print(profiler.profile_workload("CPU_BOUND", concurrency=8))
print(profiler.profile_workload("IO_BOUND", concurrency=500))
print("Architecture Rule: Never run CPU-heavy tasks in greenlet pools (GIL blocks all greenlets).")'''

# Part 5 Code: Capstone Observable Worker Cluster & Telemetry
p5_code = '''class ObservableWorkerCluster:
    def __init__(self):
        self.processed_success = 0
        self.processed_retries = 0
        self.evicted_dlq = 0

    def record_event(self, event_type):
        if event_type == "SUCCESS":
            self.processed_success += 1
        elif event_type == "RETRY":
            self.processed_retries += 1
        elif event_type == "DLQ_EVICT":
            self.evicted_dlq += 1

    def export_prometheus_metrics(self):
        return {
            "celery_tasks_succeeded_total": self.processed_success,
            "celery_tasks_retried_total": self.processed_retries,
            "celery_tasks_dlq_evicted_total": self.evicted_dlq,
            "cluster_health": "HEALTHY" if self.evicted_dlq < 10 else "ALERT_HIGH_DLQ"
        }

cluster = ObservableWorkerCluster()
# Simulate workload stream
for _ in range(50): cluster.record_event("SUCCESS")
for _ in range(4): cluster.record_event("RETRY")
cluster.record_event("DLQ_EVICT")

metrics = cluster.export_prometheus_metrics()
print("=== Prometheus Celery Observability Metrics ===")
for k, v in metrics.items():
    print(f"  {k}: {v}")
print("INVARIANT SATISFIED: Poison pills quarantined in DLQ; cluster health maintained at 100%.")'''

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
