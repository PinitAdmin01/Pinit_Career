# scripts/expand_dist_day54.py
import re

content = open("scripts/create_dist_day54_data.py", "r", encoding="utf-8").read()

# Part 1: add ~70 words on game days and blameless postmortems
p1_extra = """    "Sixth, Cultural Prerequisite: Blameless Postmortems & Psychological Safety: Chaos Engineering cannot succeed in an organization paralyzed by fear or punitive blame. If engineers are punished when a chaos experiment exposes a flaw, teams will inevitably resist testing or configure trivial, meaningless experiments that hide risk. High-performing engineering cultures embrace Blameless Postmortems: failures uncovered by chaos experiments are celebrated as victories because a flaw identified during a controlled experiment is a disaster prevented in production! Chaos engineering transforms operational risk into continuous architectural learning.",
"""

# Part 2: add ~130 words on eBPF network chaos, packet corruption, and reordering
p2_extra = """    "Beyond latency and packet drops, modern chaos frameworks leverage Extended Berkeley Packet Filters (eBPF) to inject Packet Corruption and Packet Reordering at the Linux socket layer. In high-throughput protocols such as gRPC or HTTP/2 multiplexing, out-of-order packets can stall TCP receive buffers and force head-of-line blocking, while corrupted checksums trigger silent packet discards that confound traditional application-level metrics. By attaching eBPF programs to kernel tracepoints (such as `sock:sock_ops` or XDP hooks), engineers simulate subtle bit flips and TCP window exhaustion with zero host overhead.",
    "Furthermore, network chaos must be tested across cross-zone and cross-region topologies. When an entire cloud availability zone experiences degraded inter-region WAN bandwidth, distributed consensus protocols (such as Raft or Paxos) can suffer leader election thrashing as heartbeats fail intermittently. Network chaos experiments validate that Raft election timeouts and leader lease renewals are properly tuned to prevent catastrophic split-brain flapping during transient network blips.",
"""

# Part 3: add ~200 words on memory leaks, OOM killer, disk fill, and ephemeral storage
p3_extra = """    "In addition to pod deletion and node drains, infrastructure chaos encompasses Disk I/O Saturation and Ephemeral Storage Exhaustion. If an unmanaged debug log or temporary file fills a node's root filesystem to one hundred percent capacity, the Kubernetes Kubelet immediately transitions the node into the `DiskPressure` condition, initiating wholesale pod evictions and halting container image pulls across the host. Chaos experiments simulate disk exhaustion using tools like `fallocate` or synthetic I/O hogs to verify that container volume mounts, log rotation daemons, and storage quotas prevent node-level disk paralysis.",
    "Similarly, Memory Pressure experiments validate operating system cgroups and Linux Out-Of-Memory (OOM) killer handling. When a container exceeds its declared `resources.limits.memory`, the Linux kernel triggers the OOM killer (`dmesg: oom-kill: Killed process`), abruptly terminating the container with exit code 137. Chaos experiments systematically ramp up synthetic memory allocations to verify that the application terminates gracefully without corrupting shared database files, and that Kubernetes restarts the container with zero impact to active user sessions.",
"""

# Part 4: add ~140 words on bulkheads, adaptive concurrency limits, and retry storms
p4_extra = """    "Complementing circuit breakers, resilient architectures implement Bulkhead Isolation (named after the watertight bulkheads dividing ship hulls so a breach in one compartment cannot sink the vessel). In software, bulkheads isolate thread pools, CPU cores, or database connection pools per downstream dependency: if the analytics service becomes unresponsive during a chaos experiment, only its dedicated four-thread pool becomes saturated; the critical thirty-two-thread pool servicing user checkout remains completely unimpacted and pristine.",
    "Furthermore, architects configure Adaptive Concurrency Limits (such as Netflix's concurrency-limits library utilizing the TCP Vegas algorithm). Rather than relying on hardcoded static thread pool limits, adaptive concurrency monitors round-trip latency gradients: when latency begins to climb due to injected chaos, the calling service automatically throttles its concurrency window dynamically, shedding excess load before queues back up and preventing devastating retry storms from overwhelming compromised dependencies.",
"""

# Part 5: add ~150 words on Canary deployments, continuous chaos pipelines, and SLO budget burn
p5_extra = """    "Sixth, Canary Deployments & Chaos Automation Pipelines: Leading technology organizations integrate chaos experimentation directly into automated Continuous Delivery (CD) pipelines. When a new microservice release is deployed to a Canary instance handling five percent of production traffic, the automated CD orchestrator triggers a localized chaos test suite against the canary: injecting latency, killing dependencies, and evaluating error budgets. If the canary's steady-state metrics breach defined SLO thresholds, the pipeline automatically halts the rollout, terminates the canary, and rolls back the deployment within seconds.",
    "Seventh, Error Budget Governance & Game Day Cadence: Chaos experiments consume a portion of an engineering team's Service Level Objective (SLO) Error Budget. If a service boasts a 99.9% monthly availability SLO, the team possesses an allowable downtime budget of approximately 43 minutes per month. Disciplined SRE organizations intentionally spend a calculated fraction of their monthly error budget on production chaos game days! If recent production incidents have depleted the error budget, automated chaos experiments are suspended until the system stabilizes, ensuring that resilience verification never compromises agreed-upon customer reliability commitments.",
"""

# Now let's inject into create_dist_day54_data.py
# Let's inspect say_p1 through say_p5 and insert before "Consider the everyday" or "Consider the final"

lines = content

# Inject p1_extra before "Consider the everyday" in say_p1
lines = lines.replace(
    '    "Consider the everyday physical analogy of human vaccination',
    f'{p1_extra}    "Consider the everyday physical analogy of human vaccination'
)

# Inject p2_extra before "Consider the everyday" in say_p2
lines = lines.replace(
    '    "Consider the everyday physical analogy of testing an airplane',
    f'{p2_extra}    "Consider the everyday physical analogy of testing an airplane'
)

# Inject p3_extra before "Consider the everyday" in say_p3
lines = lines.replace(
    '    "Consider the everyday physical analogy of an emergency fire drill',
    f'{p3_extra}    "Consider the everyday physical analogy of an emergency fire drill'
)

# Inject p4_extra before "Consider the everyday" in say_p4
lines = lines.replace(
    '    "Consider the everyday physical analogy of an electrical circuit breaker',
    f'{p4_extra}    "Consider the everyday physical analogy of an electrical circuit breaker'
)

# Inject p5_extra before "Consider the final" in say_p5
lines = lines.replace(
    '    "Consider the final physical analogy of a state-of-the-art earthquake-resistant skyscraper.',
    f'{p5_extra}    "Consider the final physical analogy of a state-of-the-art earthquake-resistant skyscraper.'
)

# Restore assert statements if needed
lines = lines.replace("# assert wc >= 600", "assert wc >= 600").replace("# assert total_words >= 3000", "assert total_words >= 3000")

open("scripts/create_dist_day54_data.py", "w", encoding="utf-8").write(lines)
print("Updated scripts/create_dist_day54_data.py")
