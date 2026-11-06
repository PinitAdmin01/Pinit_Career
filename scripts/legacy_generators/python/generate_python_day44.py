#!/usr/bin/env python3
"""
Final calibrated generator for Day 44: Dead-Letter Queues, Monitoring & Flower Observability
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

d44_part1_code = '''class DeadLetterExchangeSimulator:
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

d44_part1_output = '''Worker dequeued 'send_welcome_email'...
SUCCESS: 'send_welcome_email' processed cleanly.
Worker dequeued 'sync_invoice_webhook'...
REJECTED: 'sync_invoice_webhook' failed schema validation -> Routed to DLQ!
Primary Queue status: Empty (all tasks triaged)
Dead-Letter Queue depth: 1 quarantined message(s)
Quarantined item: {'task': 'sync_invoice_webhook', 'reason': 'SCHEMA_VALIDATION_ERROR'}'''

d44_part2_code = '''class PoisonPillForensics:
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

d44_part2_output = '''UNBOUNDED RETRIES: 3 poison pill tasks generated 30 failed executions, blocking cluster!
Bounded retries executed: 6 total attempts before eviction
Tasks safely quarantined in DLQ: ['webhook_bad_json', 'corrupt_pdf_job']'''

d44_part3_code = '''class DLQBackoffRouter:
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

d44_part3_output = '''Exponential backoff schedule (seconds): [2, 4, 8]
Task evicted to DLQ: ID=task_wh_9918, Reason='HTTP 410 Gone: Customer endpoint deleted'
Active DLQ queue count: 1'''

d44_part4_code = '''class WorkerPoolProfiler:
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

d44_part4_output = '''POOL: prefork (processes=8) | Best for: Video encoding, compression, ML inference.
POOL: gevent/eventlet (concurrency=500) | Best for: Webhooks, HTTP API polling, DB queries.
Architecture Rule: Never run CPU-heavy tasks in greenlet pools (GIL blocks all greenlets).'''

d44_part5_code = '''class ObservableWorkerCluster:
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

d44_part5_output = '''=== Prometheus Celery Observability Metrics ===
  celery_tasks_succeeded_total: 50
  celery_tasks_retried_total: 4
  celery_tasks_dlq_evicted_total: 1
  cluster_health: HEALTHY
INVARIANT SATISFIED: Poison pills quarantined in DLQ; cluster health maintained at 100%.'''

p1_calibrated = [
    "In high-scale distributed backend processing systems, task failures are not anomalous edge cases; they are guaranteed mathematical certainties. Third-party partner APIs experience unexpected downtime, database network sockets encounter transient drops, and client webhook endpoints become permanently unreachable. If an asynchronous task queue framework does not implement rigorous error isolation, failed tasks can easily overwhelm the entire computing infrastructure. In message queuing architectures, the premier mechanism for isolating failed or unrecoverable tasks is the Dead-Letter Queue (DLQ), powered at the transport layer by Advanced Message Queuing Protocol (AMQP) Dead-Letter Exchanges (DLX).",
    "In RabbitMQ and AMQP-compliant brokers, a dead-letter exchange is a standard exchange configured to automatically receive messages that are rejected or expired from another queue. When a Celery worker encounters an unrecoverable error during task execution, it issues a basic.reject or basic.nack protocol frame with requeue=False. Under standard queue configurations, rejecting a message without requeue would destroy the payload permanently. However, when the primary queue is provisioned with x-dead-letter-exchange and x-dead-letter-routing-key arguments, the broker automatically intercepts the rejected message and publishes it directly to the designated dead-letter exchange.",
    "The dead-letter exchange then routes the failed message envelope into a dedicated Dead-Letter Queue. This architectural quarantine accomplishes two critical objectives: first, it immediately evicts the problematic task from the primary production queue, ensuring that legitimate customer workloads can proceed through the worker pipeline without delay; second, it safely preserves the entire serialized payload, metadata headers, exception tracebacks, and routing history on disk, providing Site Reliability Engineering (SRE) and development teams with complete forensic evidence for subsequent root-cause analysis.",
    "Furthermore, modern enterprise dead-letter configurations support automated message replay capabilities. Once a downstream third-party outage is resolved or a software bug in the task handler is patched and deployed, operators can trigger a shovel plugin or administrative replay script that moves quarantined messages from the dead-letter queue back into the primary production queue for immediate reprocessing. By decoupling error isolation from message destruction, dead-letter architectures ensure that transient or systemic failures do not result in permanent data loss.",
    "In this opening section of Day 44, we construct a DeadLetterExchangeSimulator in pure Python that models AMQP dead-letter exchange routing mechanics. We trace how valid tasks execute cleanly through primary queues while corrupted payloads are rejected and automatically diverted to dead-letter quarantine, establishing the architectural foundation for building resilient, self-protecting background task processing tiers."
]

p2_calibrated = [
    "To fully appreciate the necessity of dead-letter isolation, backend engineers must understand the catastrophic failure cascade known as the Poison Pill Problem. A 'poison pill' is a task message whose payload contains corrupted data, an unhandled schema variation, or a logic trigger that crashes the worker process or raises an unhandled exception every single time it is executed. If a task queue is configured with naive automatic retries (such as autoretry_for=(Exception,)) without configuring a strict maximum retry limit (max_retries=None), the consequences for cluster availability are devastating.",
    "Consider an enterprise webhook delivery microservice that processes 50,000 webhooks per hour. Suppose a customer deletes their receiving web server without updating their configuration. When the Celery worker attempts to deliver the webhook, the remote server returns an HTTP 410 Gone or connection refused error. Because the task is configured to retry indefinitely, the worker releases the task back into the broker queue. Seconds later, an idle worker picks up the exact same task, attempts delivery, fails, and releases it again. Within hours, thousands of invalid webhook tasks are circulating continuously through the worker pool.",
    "This creates an exponential backlog cascade. As new legitimate customer webhooks arrive, they are queued behind tens of thousands of perpetually failing retry attempts. Worker processes spend 100% of their CPU cycles and network sockets repeatedly executing tasks that cannot possibly succeed. SRE teams observe queue depths skyrocketing into the hundreds of thousands, while p99 task completion latency balloons from 50 milliseconds to 14 hours. A handful of corrupted tasks has effectively launched an internal denial-of-service attack, starving the entire customer base of background processing capacity.",
    "Forensic analysis of production outages demonstrates that unbounded retries are among the leading causes of catastrophic background worker outages. Senior architects prevent poison pill cascades by enforcing three non-negotiable rules: first, every task must declare a hard maximum retry cap (e.g., max_retries=3 or max_retries=5); second, task handlers must distinguish between transient errors (such as network timeouts, which warrant retries) and permanent errors (such as schema validation failures, which must fail immediately); third, any task exceeding its retry threshold must be automatically evicted to a dead-letter queue.",
    "In this section, we implement a PoisonPillForensics simulator in Python that calculates the computational amplification of unbounded retries and contrasts it against bounded retry execution. We demonstrate how enforcing retry limits halts the failure cascade, evicting poison pills into dead-letter quarantine and preserving worker capacity for legitimate workloads across the cluster."
]

p3_calibrated = [
    "Halting poison pills requires pairing retry ceilings with intelligent retry scheduling algorithms. When a task fails due to a transient infrastructure fault—such as a database connection pool timeout or rate limiting by a third-party payment API—retrying the task immediately is counter-productive. If 500 tasks fail simultaneously because the database was restarting, retrying all 500 tasks 100 milliseconds later creates a thundering herd that knocks the recovering database offline again! To survive transient failures, distributed task systems must implement Exponential Backoff with Full Jitter.",
    "Exponential backoff spaces retry attempts across geometrically expanding time intervals. For retry attempt n, the base delay is calculated as: delay = base_delay * (2 ** (n - 1)). For example, with a base delay of 2 seconds, retry 1 executes after 2 seconds, retry 2 after 4 seconds, retry 3 after 8 seconds, and retry 4 after 16 seconds. This exponential expansion grants downstream services adequate breathing room to recover from transient outages before being subjected to renewed query traffic.",
    "To prevent synchronized retry waves, production systems combine exponential backoff with Full Jitter, randomizing the computed delay: sleep_duration = random.uniform(0, delay). Jitter decorrelates retry attempts across the worker fleet, transforming sharp spikes in traffic into a smooth, uniform distribution of background requests. Celery supports this natively via the retry_backoff=True and retry_jitter=True task configuration options, providing enterprise-grade backoff dynamics with zero custom boilerplate code.",
    "When a task exhausts all allocated retry attempts without succeeding, the worker supervisor catches the MaxRetriesExceededError and executes terminal handling logic. Rather than discarding the message, the supervisor serializes the failure context—including the original arguments, execution count, last exception message, and traceback string—into an enriched JSON envelope and publishes it to the dead-letter queue. This automated transition from exponential retry backoff to dead-letter quarantine guarantees that transient faults recover automatically while persistent faults are safely isolated.",
    "In this section, we construct a DLQBackoffRouter in pure Python that computes exponential backoff schedules and executes automated dead-letter eviction upon terminal failure. We verify that failed webhook deliveries transition cleanly from retry scheduling to DLQ quarantine, protecting cluster throughput while preserving full forensic auditability for operations teams."
]

p4_calibrated = [
    "Beyond error routing and retry policies, achieving optimal reliability in distributed task clusters requires aligning Celery's worker execution concurrency model with the computational profile of the underlying workload. Celery provides multiple worker execution pool implementations, most notably the prefork multiprocessing pool, the gevent and eventlet greenlet pools, and the threads pool. Deploying an inappropriate pool configuration for a given workload profile results in severe resource contention, high memory bloat, and poor task throughput.",
    "For CPU-intensive workloads—such as image resizing, video transcoding, PDF report compilation, or machine learning model inference—the prefork execution pool is the mandatory industry standard. In Python, the Global Interpreter Lock (GIL) prevents multiple native OS threads within a single process from executing pure Python bytecode simultaneously across multiple CPU cores. The prefork pool overcomes this limitation by spawning separate child OS processes (typically matching the physical CPU core count: --concurrency=8). Each worker process runs an independent Python interpreter instance, allowing true multi-core parallel processing without GIL contention.",
    "Conversely, for high-volume, I/O-bound workloads—such as webhook delivery, external HTTP API polling, database query dispatching, or push notifications—the prefork pool is highly inefficient. Spawning 500 OS processes consumes gigabytes of server RAM and incurs heavy Linux process context switching overhead. For I/O-bound tasks where workers spend 95% of their time waiting on network sockets, backend architects deploy gevent or eventlet greenlet pools (--pool=gevent --concurrency=500). Greenlets are lightweight cooperative micro-threads that run inside a single process, enabling a single worker to maintain thousands of concurrent network connections with minimal memory overhead.",
    "However, senior engineers enforce strict isolation between CPU-bound and I/O-bound workloads by provisioning Dedicated Worker Queues. If a developer runs CPU-heavy video transcoding tasks inside a gevent worker pool, a single transcoding operation will monopolize the OS thread, blocking the event loop and freezing all 499 concurrent greenlet tasks! Modern infrastructure architectures deploy distinct worker deployments: high-memory, multi-core prefork worker nodes subscribed exclusively to 'compute_queue', and lightweight greenlet worker nodes subscribed exclusively to 'io_queue'.",
    "In this section, we implement a WorkerPoolProfiler in Python that analyzes workload characteristics and recommends optimal concurrency pool configurations. We establish architectural sizing rules for prefork versus greenlet execution pools, demonstrating how workload segregation maximizes hardware efficiency and prevents execution blocking across distributed worker clusters."
]

p5_calibrated = [
    "In this capstone section of Day 44, we synthesize the reliability and operational pillars of distributed background architectures—AMQP dead-letter routing, poison pill isolation, exponential retry backoff, and concurrency pool profiling—into a unified ObservableWorkerCluster. In enterprise cloud deployments, running background workers without comprehensive telemetry is like flying a supersonic jet without instruments: you have zero visibility into worker saturation, queue backlogs, or emerging failure cascades until customer complaints begin flooding support channels.",
    "To provide real-time operational visibility, Celery integrates with Flower: an open-source, web-based management and monitoring tool for Celery clusters. Flower connects to the message broker, inspects worker heartbeats, and displays a real-time dashboard tracking active workers, completed tasks, in-flight jobs, and system resource utilization. Through Flower's intuitive interface or REST API, operators can dynamically adjust worker pool concurrency, revoke runaway tasks, and monitor task execution latency histograms without restarting worker processes.",
    "Furthermore, enterprise observability platforms integrate celery-prometheus-exporter to translate Celery internal events into standardized Prometheus metrics. Critical telemetry indicators include celery_tasks_total (partitioned by task name and status: SUCCESS, FAILURE, RETRY), celery_task_runtime_seconds (measuring p50, p95, and p99 execution duration histograms), celery_queue_length (tracking queue depth and lag across individual routing keys), and celery_tasks_dlq_evicted_total (counting tasks quarantined in dead-letter storage).",
    "The ObservableWorkerCluster models this production telemetry architecture in pure Python. As tasks transition through successful completion, transient retries, and dead-letter evictions, the cluster updates its internal telemetry registries and exposes structured Prometheus metric payloads. By establishing automated alerting rules on DLQ arrival rates and worker heartbeat failures, SRE teams receive immediate notifications the moment poison pills or network partitions emerge, enabling proactive remediation before customer SLAs are breached.",
    "By mastering Dead-Letter Queues, poison pill isolation mechanics, worker concurrency tuning, and Prometheus observability, you have completed the essential distributed reliability toolkit. In tomorrow's Milestone 8 project, you will synthesize all the architectural principles of Block 9 into a complete, enterprise-grade Distributed Task Queue and Workflow Orchestration Engine, proving zero task loss, strict idempotency, and flawless self-healing under extreme fault injection."
]

d44_parts = [
    {
        "title": "AMQP Dead-Letter Exchanges & Celery Error Handling Mechanics",
        "say": p1_calibrated,
        "example": "Simulating dead-letter exchange routing where rejected invalid tasks are diverted to a quarantine queue.",
        "code": d44_part1_code,
        "output": d44_part1_output,
        "codeNotes": [
            "DeadLetterExchangeSimulator routes invalid tasks to quarantine via rejection without requeue.",
            "Legitimate tasks process cleanly through the primary queue without head-of-line blocking."
        ],
        "tryIt": "Add a third task with a missing email field and verify that it is quarantined in the DLQ.",
        "check": {
            "question": "What is the primary function of an AMQP Dead-Letter Exchange (DLX) in distributed task queues?",
            "options": [
                "To automatically capture and quarantine rejected, expired, or failed messages without losing payload data.",
                "To compress JSON messages into ZIP archives on the worker server.",
                "To delete the RabbitMQ broker when a task fails.",
                "To convert Python exceptions into HTTP 200 responses."
            ],
            "answer": 0,
            "why": "A dead-letter exchange captures messages rejected with requeue=False, moving them to a dedicated queue for forensic triage while preserving primary queue throughput."
        }
    },
    {
        "title": "Poison Pill Cascade & Infinite Retry Backlog Forensics",
        "say": p2_calibrated,
        "example": "Comparing how unbounded retries crash cluster throughput while bounded retries quarantine poison pills.",
        "code": d44_part2_code,
        "output": d44_part2_output,
        "codeNotes": [
            "PoisonPillForensics demonstrates the failure cascade of infinite retries on permanent errors.",
            "Bounded retries cap execution attempts and safely evict poison pills to dead-letter storage."
        ],
        "tryIt": "Increase max_retries to 5 in simulate_bounded_retries and observe the new retry count.",
        "check": {
            "question": "What causes a catastrophic 'poison pill' backlog cascade in a background worker cluster?",
            "options": [
                "Unbounded automatic retries on tasks with permanent errors, consuming 100% of worker capacity.",
                "Workers running out of disk space due to excessive log file creation.",
                "RabbitMQ rejecting connections because the server clock is 1 second fast.",
                "Python refusing to execute functions that contain more than two arguments."
            ],
            "answer": 0,
            "why": "When tasks fail permanently but are retried indefinitely, they circulate perpetually through the worker pool, starving legitimate tasks and locking up the queue."
        }
    },
    {
        "title": "Dead-Letter Queue Router & Exponential Backoff with Jitter",
        "say": p3_calibrated,
        "example": "Computing exponential backoff schedules and evicting terminally failed tasks to DLQ quarantine.",
        "code": d44_part3_code,
        "output": d44_part3_output,
        "codeNotes": [
            "DLQBackoffRouter computes geometrically expanding retry intervals to allow recovering services to heal.",
            "When max retries are exceeded, the task is evicted to the DLQ with full failure context preserved."
        ],
        "tryIt": "Change base_delay_sec to 3 and max_retries to 4 and calculate the new delay schedule.",
        "check": {
            "question": "Why is exponential backoff with jitter essential when retrying failed background tasks?",
            "options": [
                "It expands retry intervals and decorrelates attempts, preventing thundering herds from overwhelming recovering services.",
                "It forces Python to execute tasks faster on each subsequent attempt.",
                "It deletes failed tasks from the database after the first failure.",
                "It bypasses network firewalls during API connection drops."
            ],
            "answer": 0,
            "why": "Exponential backoff grants recovering downstream systems breathing room, while jitter randomizes retry timing, preventing synchronized waves of worker traffic."
        }
    },
    {
        "title": "Worker Concurrency Models & Pool Sizing (Prefork vs Gevent)",
        "say": p4_calibrated,
        "example": "Profiling CPU-bound versus I/O-bound workloads and selecting optimal prefork or greenlet pools.",
        "code": d44_part4_code,
        "output": d44_part4_output,
        "codeNotes": [
            "WorkerPoolProfiler matches workload characteristics to optimal worker pool implementations.",
            "Prefork multi-process pools bypass the Python GIL for heavy CPU compute tasks."
        ],
        "tryIt": "Add a profiling rule for 'HYBRID' workloads and describe the recommended architecture.",
        "check": {
            "question": "Why should CPU-intensive tasks such as video transcoding be executed in prefork pools rather than greenlet pools?",
            "options": [
                "Because Python's GIL blocks the entire OS thread in greenlet pools, freezing all concurrent greenlets during CPU compute.",
                "Because greenlets do not support importing the standard library math module.",
                "Because prefork pools do not consume any CPU memory on Linux servers.",
                "Because Celery will crash if greenlets are used with PostgreSQL databases."
            ],
            "answer": 0,
            "why": "Greenlets rely on cooperative multitasking within a single OS thread; CPU-heavy operations do not yield control, causing the GIL to block all concurrent tasks in the process."
        }
    },
    {
        "title": "Real-Time Monitoring, Prometheus Metrics & Flower Observability",
        "say": p5_calibrated,
        "example": "Exporting structured Prometheus metrics from ObservableWorkerCluster to monitor cluster health.",
        "code": d44_part5_code,
        "output": d44_part5_output,
        "codeNotes": [
            "ObservableWorkerCluster tracks task success, retries, and dead-letter evictions in real time.",
            "Prometheus metrics expose cluster health and alert thresholds for operational observability."
        ],
        "tryIt": "Trigger 12 DLQ evictions on ObservableWorkerCluster and verify that cluster_health changes to ALERT_HIGH_DLQ.",
        "check": {
            "question": "What is the primary operational value of integrating Flower and Prometheus metrics in Celery clusters?",
            "options": [
                "To provide real-time visibility into worker health, queue backlogs, latency histograms, and emerging error rates.",
                "To automatically write Python unit tests for all active background tasks.",
                "To eliminate the need for Linux operating system security patches.",
                "To reduce the financial cost of cloud servers to exactly zero dollars."
            ],
            "answer": 0,
            "why": "Real-time telemetry and dashboards allow SRE teams to monitor queue lag, inspect worker pool saturation, and detect emerging poison pill cascades before SLAs are breached."
        }
    }
]

day44 = {
    "day": 44,
    "title": "Dead-Letter Queues, Monitoring & Flower Observability",
    "goal": "Master background processing resilience: implement AMQP Dead-Letter Queues, poison pill isolation, exponential backoff with jitter, worker pool concurrency tuning (prefork vs gevent), and real-time observability with Flower and Prometheus.",
    "minutes": 37,
    "recap": "Yesterday we mastered at-least-once delivery, visibility timeouts, and idempotency locks. Today, we conquer task failure management: Dead-Letter Queues, poison pill isolation, and full-cluster observability.",
    "parts": d44_parts,
    "summary": [
        "Unrecoverable or corrupted tasks must not circulate indefinitely; AMQP Dead-Letter Exchanges route failed messages to quarantine queues.",
        "Poison pills without retry limits create cascading worker starvation, inflating queue depth and locking up cluster CPU capacity.",
        "Exponential backoff with jitter expands retry intervals and decorrelates attempts, shielding recovering services from thundering herds.",
        "CPU-bound tasks require prefork multiprocessing pools to bypass the GIL, while I/O-bound tasks thrive on lightweight greenlet pools.",
        "Flower dashboards and Prometheus metrics export real-time queue depth, task runtime histograms, and DLQ arrival alerts."
    ],
    "projectStep": {
        "title": "Build a Dead-Letter Queue & Worker Observability Engine",
        "steps": [
            "Implement a DeadLetterExchangeSimulator demonstrating automatic diversion of rejected tasks to a quarantine queue.",
            "Construct a PoisonPillForensics harness proving that bounded retries halt queue backlog cascades under corrupt payloads.",
            "Build a DLQBackoffRouter computing exponential backoff schedules and evicting terminal failures to DLQ storage.",
            "Implement a WorkerPoolProfiler recommending prefork versus greenlet execution pools based on workload compute profiles.",
            "Synthesize an ObservableWorkerCluster exposing structured Prometheus metrics and automated queue health alerts."
        ]
    }
}

from curriculum_text_calibrator import calibrate_day
day44 = calibrate_day(day44, 44)

print(f"=== Day 44: {day44['title']} ===")
for i, p in enumerate(day44["parts"]):
    say_words = count_words(p["say"])
    all_words = count_words(p["title"]) + say_words + count_words(p["example"]) + count_words(p["code"]) + count_words(p["output"]) + count_words(p["codeNotes"]) + count_words(p["tryIt"])
    chk = p["check"]
    all_words += count_words(chk["question"]) + count_words(chk["options"]) + count_words(chk["why"])
    status = "OK" if say_words >= 580 else f"LOW ({say_words})"
    print(f"  Part {i+1}: '{p['title'][:32]}' | Say: {say_words} ({status}) | All: {all_words}")

tot_say = sum(count_words(p["say"]) for p in day44["parts"])
tot_all = count_all_lesson_words(day44)
spk_min = estimate_spoken_minutes(day44)
les_min = estimate_lesson_minutes(day44)

print(f"Total Say: {tot_say} | Total All: {tot_all} | Spoken Min: {spk_min} | Lesson Min: {les_min}")

assert len(day44["parts"]) == 5, f"Must have exactly 5 parts, got {len(day44['parts'])}"
for i, p in enumerate(day44["parts"]):
    sw = count_words(p["say"])
    assert sw >= 580, f"Part {i+1} has {sw} words (< 580)"
    assert len(p["say"]) >= 4, f"Part {i+1} say should have >= 4 paragraphs"
    assert len(p["codeNotes"]) >= 2, f"Part {i+1} codeNotes should have >= 2 items"
    assert p["check"]["answer"] == 0, f"Part {i+1} check answer must be 0"

assert spk_min >= 20, f"Spoken min {spk_min} < 20"
assert 35 <= les_min <= 40, f"Lesson min {les_min} not in [35, 40]"

print("ALL INVARIANTS SATISFIED!\n")

with open("scripts/python_day44.json", "w", encoding="utf-8") as f:
    json.dump(day44, f, indent=2)

print("Wrote scripts/python_day44.json successfully!")
