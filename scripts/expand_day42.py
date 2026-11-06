import sys
sys.path.append('scripts')
from fullstack_day42_data import DAY_42

# 1. Fix Part 3 output
p3_out = """Attempt 1 State: RETRY_DELAYED | Delay Calculated: 31ms
Attempt 2 State: RETRY_DELAYED | Delay Calculated: 41ms
Attempt 3 State: DLQ | Quarantined in DLQ: true
Dead-Letter Queue Governance Verified: True"""
DAY_42['parts'][2]['output'] = p3_out

# 2. Fix Part 5 code and output
p5_code = """// Day 42 Part 5: Enterprise Stalled Job Watchdog & Health Sentinel
interface MonitoredJob {
  id: string;
  name: string;
  workerId: string;
  lastHeartbeat: number;
  stalledCount: number;
  status: 'ACTIVE' | 'RECOVERED' | 'DLQ';
}

class QueueStalledJobWatchdog {
  private activeJobs = new Map<string, MonitoredJob>();
  public recoveredCount = 0;
  public dlqEscalations = 0;
  private lockTtlMs = 1000; // 1 second lock TTL for simulation

  registerActiveJob(id: string, name: string, workerId: string, initialTimestamp = Date.now()): void {
    this.activeJobs.set(id, {
      id,
      name,
      workerId,
      lastHeartbeat: initialTimestamp,
      stalledCount: 0,
      status: 'ACTIVE'
    });
  }

  recordHeartbeat(id: string, timestamp = Date.now()): void {
    const job = this.activeJobs.get(id);
    if (job) job.lastHeartbeat = timestamp;
  }

  auditAndRecoverStalledJobs(now: number): void {
    for (const [id, job] of this.activeJobs.entries()) {
      const elapsedSinceHeartbeat = now - job.lastHeartbeat;
      if (elapsedSinceHeartbeat > this.lockTtlMs) {
        job.stalledCount++;
        if (job.stalledCount >= 2) {
          job.status = 'DLQ';
          this.dlqEscalations++;
          this.activeJobs.delete(id);
        } else {
          job.status = 'RECOVERED';
          job.lastHeartbeat = now;
          this.recoveredCount++;
        }
      }
    }
  }
}

const watchdog = new QueueStalledJobWatchdog();
const t0 = 1000000;

// Job 1: Normal worker with continuous heartbeats
watchdog.registerActiveJob('job_clean_101', 'export_csv', 'worker-pod-1', t0);
// Job 2: Crashed worker (no heartbeats)
watchdog.registerActiveJob('job_crashed_202', 'render_video', 'worker-pod-2', t0);

// Simulate 1.5 seconds later: Worker 1 sent heartbeat, Worker 2 crashed
watchdog.recordHeartbeat('job_clean_101', t0 + 1200);
watchdog.auditAndRecoverStalledJobs(t0 + 1500);

console.log('Stalled Jobs Successfully Recovered to Waiting Queue:', watchdog.recoveredCount);
console.log('Toxic Jobs Escalated to Dead-Letter Queue:', watchdog.dlqEscalations);
console.log('Stalled Job Sentinel Operational: True');"""

p5_out = """Stalled Jobs Successfully Recovered to Waiting Queue: 1
Toxic Jobs Escalated to Dead-Letter Queue: 0
Stalled Job Sentinel Operational: True"""

DAY_42['parts'][4]['code'] = p5_code
DAY_42['parts'][4]['output'] = p5_out

# 3. Pedagogical Slow-Reader Word Expansions (>= 650 words per part)
p1_extra = [
    "To fully master distributed queue architecture, one must examine the physical separation of concerns between web ingestion tiers and asynchronous processing tiers. In traditional monoliths, developers frequently succumb to the temptation of running asynchronous promises in the background of an HTTP request using unhandled background promises or fire-and-forget loops. This anti-pattern is known as the Phantom Task Vulnerability.",
    "When a Node.js process executes a fire-and-forget promise in the background without an external queue, that task lives exclusively in the local V8 process memory heap. If the operating system restarts the container, or if a Kubernetes autoscaler terminates the pod to scale down during low traffic, every in-flight background promise is instantly vaporized. The user receives no error, the database remains in an incomplete state, and critical business records vanish without a trace.",
    "Distributed job queues like BullMQ eliminate the phantom task vulnerability by externalizing job state into an independent, persistent data store—typically a Redis cluster or Apache Kafka topic. The moment an HTTP route enqueues a job, the job payload is written to Redis memory and persisted to disk via Redis Append-Only File (AOF) logs. Even if every single Node.js web server crashes simultaneously, the jobs remain safely stored in Redis, waiting for worker nodes to spin up and resume execution.",
    "Furthermore, separating web servers from background workers allows independent horizontal scaling. During marketing campaigns or product launches, web traffic might surge by a factor of twenty while background video encoding remains steady. Cloud infrastructure can scale up the web container count to absorb HTTP traffic while keeping worker pools steady, or scale worker pools aggressively overnight when electricity costs are low, optimizing infrastructure spend while upholding five-nines availability."
]

p2_extra = [
    "The necessity for cryptographic idempotency becomes painfully apparent during network partition events and distributed failovers. Consider an enterprise e-commerce platform processing a three-thousand-dollar checkout transaction. A worker pulls the job from the queue and successfully executes the payment API call against the payment gateway. The payment gateway confirms the deduction and sends an HTTP 200 response back across the internet.",
    "However, at that precise microsecond, an intermediate network router drops the TCP ACK packet. From the perspective of the Node.js worker, the request timed out. According to standard retry policies, the worker flags the attempt as a network failure and re-submits the job to the retry queue. Without application-level idempotency enforcement, a secondary worker pulls the retried job and dispatches a second payment call, resulting in a duplicate withdrawal of three thousand dollars from the customer's bank account.",
    "By attaching a deterministic idempotency key—such as a SHA-256 hash of the order identifier and customer UUID—the payment gateway's idempotency engine recognizes the second request as an identical duplicate of the first. Instead of executing a second financial transfer, the gateway simply returns the stored receipt from the first transaction. The worker receives confirmation, the queue marks the job as completed, and the customer is protected from erroneous charges.",
    "Moreover, robust idempotency designs implement time-to-live expiration on idempotency locks in Redis. If a worker acquires an idempotency lock but crashes before completing the transaction, the lock must automatically expire after a safe window (e.g., thirty minutes), allowing automated recovery mechanisms to evaluate whether the transaction committed or whether it requires a fresh retry. This delicate balance between mutual exclusion and fault recovery forms the cornerstone of financial-grade distributed systems."
]

p3_extra = [
    "The interaction between exponential backoff, jitter, and downstream service recovery illustrates the deep principles of queueing theory and oscillatory resonance in distributed computing. When an external microservice experiences an outage—such as an overloaded database running out of memory buffers—the service needs a window of tranquil silence to restart, replay its transaction logs, and warm up its internal caches.",
    "If thousands of distributed worker processes retry immediately in lockstep, the sheer volume of incoming retry connections re-saturates the service's network buffers before it can finish booting, trapping the service in a perpetual restart loop. This phenomenon is known in distributed systems literature as the Thundering Herd Retry Storm. By enforcing exponential backoff, workers progressively double the delay between attempts, giving the downstream service exponentially longer windows of calm to complete recovery.",
    "Full Jitter is the critical mathematical ingredient that breaks oscillatory resonance. In acoustic physics, when soldiers march in unison across a suspension bridge, the rhythmic frequency of their footsteps can match the bridge's natural resonance frequency, causing the bridge to violently sway and collapse. In computer networks, synchronized retries behave exactly like marching soldiers, hammering downstream servers at predictable periodic intervals.",
    "Full jitter disrupts this resonance completely by introducing continuous uniform randomness into the retry sleep duration. Because every worker selects a distinct, randomized sleep interval within the exponential envelope, the collective retry attempts arrive as a smooth, tranquil Poisson distribution rather than a concentrated wall of traffic. Downstream services recover smoothly, and overall cluster throughput returns to optimal baselines without human intervention."
]

p4_extra = [
    "In multi-tenant software architecture, maintaining resource fairness is an essential operational requirement. When thousands of corporate organizations share a common infrastructure pool, the behavior of an individual tenant must never degrade the performance or availability experienced by peer tenants. This principle is formalised as Tenant Isolation and Noisy Neighbor Defense.",
    "Consider an enterprise CRM SaaS platform where Company A triggers an automated bulk export of two million customer contacts, while Company B simply requests a password reset email for an executive. If the background queue operated as a simple First-In-First-Out (FIFO) queue, Company B's critical password reset would sit behind two million export jobs, forcing the executive to wait four hours for an email. Such failures destroy customer trust and violate enterprise Service Level Agreements.",
    "Token bucket rate limiting solves this by decoupling ingestion priority from worker dispatch. By maintaining separate token balances for each tenant in Redis, the queue engine treats tenant requests as distinct, rate-controlled streams. When Company A exhausts its token allowance, its remaining jobs are gracefully paused in a delayed waiting pool until its tokens replenish at its contracted rate. Meanwhile, Company B's single job consumes an available token immediately and executes without delay.",
    "Furthermore, advanced queue architectures implement priority lanes: high-priority interactive jobs (like password resets and two-factor authentication codes) bypass bulk batch queues entirely, routing to dedicated high-priority worker pools. By pairing multi-lane prioritization with per-tenant token buckets, enterprise platforms guarantee sub-second execution for critical interactive workflows while accommodating planetary-scale bulk processing in background lanes."
]

p5_extra = [
    "The necessity for active queue telemetry sentinels is proven by the brutal reality of production failure modes. In large-scale cloud clusters running hundreds of microservices, transient hardware faults, kernel panics, and out-of-memory container terminations are everyday occurrences. A distributed queue system that assumes worker processes will always terminate cleanly is fundamentally fragile.",
    "Heartbeat lease renewal is the industry-standard mechanism for establishing distributed liveness. By continuously issuing lightweight Redis commands every ten seconds to extend the lock TTL of active jobs, workers declare their ongoing health to the cluster. If a worker process hangs due to an infinite loop, blocks on an un-timeouted network socket, or suffers an unhandled segmentation fault, the heartbeat ceases. The expiration of the lock in Redis acts as an unambiguous dead-man's switch.",
    "When the telemetry watchdog discovers an expired lock, it must act with extreme precision. Rather than immediately concluding the worker is dead and causing a duplicate execution (if the worker was merely experiencing a temporary garbage collection pause), the watchdog inspects cluster metrics before safely reclaiming the job. If the job repeatedly stalls across multiple distinct worker pods, the watchdog flags the job as 'poison'—a malformed input that exploits a software bug to crash whichever worker attempts to parse it.",
    "Poison jobs are automatically quarantined into the Dead-Letter Queue (DLQ), accompanied by a comprehensive diagnostic snapshot containing the payload, worker stack trace, and execution history. PagerDuty notifications alert on-call systems engineers, who can inspect the quarantined payload in an administrative dashboard, patch the underlying parser vulnerability, and safely replay the job with zero downtime. This closed-loop observability architecture represents the pinnacle of modern enterprise resilience."
]

DAY_42['parts'][0]['say'].extend(p1_extra)
DAY_42['parts'][1]['say'].extend(p2_extra)
DAY_42['parts'][2]['say'].extend(p3_extra)
DAY_42['parts'][3]['say'].extend(p4_extra)
DAY_42['parts'][4]['say'].extend(p5_extra)

import pprint
with open('scripts/fullstack_day42_data.py', 'w', encoding='utf-8') as f:
    f.write('# Day 42 Fullstack JS Long Lesson Data\n')
    f.write(f'DAY_42 = {pprint.pformat(DAY_42, width=120, sort_dicts=False)}\n')

print('Successfully expanded and calibrated Day 42!')
