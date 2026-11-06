import subprocess, re

with open('scripts/generate_node_day37.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Add extra paragraphs to p1_say
p1_extra = [
    "From an enterprise architectural perspective, managing high-concurrency contention requires sophisticated client retry strategies. If dozens of worker pods blindly poll Redis with tight retry loops (`setInterval(..., 10)`), they inundate the Redis event loop with thousands of redundant failed commands, degrading performance for all other cache and database operations.",
    "Production Node.js distributed lock clients implement Pub/Sub Notification wakenings. When a worker fails to acquire a lock, it does not spin-wait; instead, it subscribes to an internal Redis pub/sub channel for that lock key. When the current holder finishes and releases the lock via its Lua script, the script publishes a release signal to the channel, waking the waiting workers instantly without polling overhead.",
    "Furthermore, multi-tenant cloud platforms enforce hierarchical lock naming conventions such as `lock:{tenantId}:{resourceDomain}:{resourceId}`. This structured namespace guarantees complete data isolation between customer tenants while preventing key collisions across unrelated microservices."
]

p2_extra = [
    "From a distributed systems theory perspective, multi-master quorum consensus requires strict mathematical bounds on physical clock drift and network latency. In asynchronous cloud environments, local system clocks can drift due to NTP synchronization jumps, hypervisor virtualization time-dilation, and hardware oscillator fluctuations.",
    "To guarantee safety, Redlock calculates a conservative clock drift margin: `drift = (TTL * drift_factor) + 2ms`, where `drift_factor` is typically 2% to account for clock skew across independent servers. The client deducts both network elapsed time and the clock drift margin from the original TTL, ensuring that the remaining validity window is strictly positive before permitting the critical section to execute.",
    "Furthermore, Redlock mandates odd numbers of independent master nodes (3, 5, or 7). In a 5-node topology, a quorum of 3 is required. This mathematical majority guarantees that two competing workers cannot both acquire a quorum simultaneously, because any two majorities of size 3 in a set of 5 must share at least one common node (`3 + 3 = 6 > 5`), preventing split-brain states.",
    "Additionally, to handle node crash recovery safely, Redlock requires rebooted nodes to implement a Delayed Restart protocol. When a Redis master crashes, it must delay accepting write commands for at least the maximum lock TTL (e.g. 10 seconds), ensuring that any active lock held on that node before the crash has naturally expired across all remaining nodes before new locks are granted."
]

p3_extra = [
    "In cloud-native Kubernetes environments, pairing watchdog timers with graceful shutdown lifecycle hooks is essential for operational continuity. When a Kubernetes node terminates during a rolling deployment, the pod receives a `SIGTERM` signal.",
    "A well-architected distributed lock manager intercepts `SIGTERM`, signals the executing business task to wrap up or checkpoint immediately, halts the background watchdog renewal timer, and dispatches an atomic Lua release command to Redis. This proactive release frees the lock immediately, allowing replacement pods on the new deployment replica to acquire the resource without waiting for the lease TTL to expire.",
    "Furthermore, watchdog implementations enforce strict Hard Ceilings on total lock duration. If a software bug causes an asynchronous task to hang in an infinite loop, an unconstrained watchdog timer would renew the lock forever, freezing that business resource permanently.",
    "By configuring a maximum extension ceiling (such as 30 seconds or 3 renewals), the watchdog automatically terminates renewals after the ceiling is reached, logging an emergency error to Prometheus and allowing the lock to expire so that self-healing mechanisms can recover the system.",
    "Additionally, every lease renewal emits detailed telemetry metrics detailing the current renewal count and elapsed execution time, providing observability engineers with real-time insight into slow query patterns across worker fleets."
]

p4_extra = [
    "The core insight of Martin Kleppmann's critique is that in pure asynchronous networks, no algorithm that relies solely on timing assumptions (such as TTLs or timeouts) can guarantee correctness for stateful mutations without storage-level fencing.",
    "Consider the memory architecture of modern execution runtimes like V8 in Node.js or the JVM. The V8 garbage collector operates using generation-based scavenging for new space and mark-sweep-compact algorithms for old space. When a Node.js process manages large heaps exceeding several gigabytes under high memory fragmentation, a major garbage collection pass can trigger a Stop-The-World pause spanning several seconds.",
    "During this pause, the operating system suspends all JavaScript execution threads. The process cannot read sockets, cannot dispatch heartbeats, and cannot execute watchdog renewals. To the outside world, the worker appears completely frozen. Redis correctly observes that the TTL has elapsed and frees the lock.",
    "When another worker acquires the newly freed lock and begins writing to the database, a severe race condition is born. The moment the GC pause finishes, the first worker resumes execution on the very next instruction—unaware that time has jumped forward—and issues its pending write to the database, overwriting newer data.",
    "Furthermore, virtualized cloud environments introduce Hypervisor CPU Steal Time, where the physical host pauses a guest virtual machine for hundreds of milliseconds to service competing virtual machines. These unavoidable real-world timing anomalies prove that backend architects must never rely on distributed locks alone for financial data integrity."
]

p5_extra = [
    "To achieve 100% deterministic consistency in the presence of GC pauses, network delays, and hypervisor stalls, enterprise architectures combine distributed locks with Monotonic Fencing Tokens enforced at the persistent storage boundary.",
    "The fencing mechanism operates as a strict monotonic filter: the lock service maintains a 64-bit atomic counter in Redis (via `INCR lock:counter:{resource}`). Every time a lock is acquired or renewed by any worker, the lock service increments the counter and issues the resulting value as an immutable fencing token attached to the lock grant.",
    "When the worker executes its mutation against PostgreSQL, MySQL, or DynamoDB, it includes the fencing token in the SQL query: `UPDATE ledger SET balance = balance - 100, fencing_token = $token WHERE account_id = $id AND fencing_token < $token`. If Worker 1 was paused and Worker 2 already committed a write with token 32, Worker 1's write with token 31 matches zero rows and aborts cleanly.",
    "The storage engine acts as the ultimate arbiter of truth, guaranteeing that even if a worker suffers a 60-second GC pause, its stale delayed writes are mathematically incapable of corrupting committed state.",
    "Furthermore, for distributed message streams, events carrying fencing tokens allow downstream consumers to detect out-of-order event delivery, discarding obsolete state updates while committing Kafka offsets cleanly.",
    "By mastering the combination of multi-master Redlock acquisition, automated watchdog renewals, and storage-tier fencing tokens, backend engineers build distributed platforms that achieve absolute transactional safety across unreliable cloud networks."
]

# Write replacement logic directly
def format_list(var_name, original_list, extra_items):
    combined = original_list + extra_items
    lines = [f"{var_name} = ["]
    for s in combined:
        lines.append(f'    {json.dumps(s)},')
    lines.append("]")
    return "\n".join(lines)

# Let's inspect generate_node_day37.py to replace p1_say..p5_say
import generate_node_day37 as g

new_p1 = format_list('p1_say', g.p1_say, p1_extra)
new_p2 = format_list('p2_say', g.p2_say, p2_extra)
new_p3 = format_list('p3_say', g.p3_say, p3_extra)
new_p4 = format_list('p4_say', g.p4_say, p4_extra)
new_p5 = format_list('p5_say', g.p5_say, p5_extra)

# Re-read file
with open('scripts/generate_node_day37.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace p1_say block
text = re.sub(r'p1_say = \[.*?\]\n\np1_code', f'{new_p1}\n\np1_code', text, flags=re.DOTALL)
text = re.sub(r'p2_say = \[.*?\]\n\np2_code', f'{new_p2}\n\np2_code', text, flags=re.DOTALL)
text = re.sub(r'p3_say = \[.*?\]\n\np3_code', f'{new_p3}\n\np3_code', text, flags=re.DOTALL)
text = re.sub(r'p4_say = \[.*?\]\n\np4_code', f'{new_p4}\n\np4_code', text, flags=re.DOTALL)
text = re.sub(r'p5_say = \[.*?\]\n\np5_code', f'{new_p5}\n\np5_code', text, flags=re.DOTALL)

with open('scripts/generate_node_day37.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated generate_node_day37.py successfully!")
