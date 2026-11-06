# scripts/expand_dist_day55.py
import re

content = open("scripts/create_dist_day55_data.py", "r", encoding="utf-8").read()

p1_extra = """    "Sixth, Knowledge Base & Adaptive Thresholding: The final and most crucial component of the MAPE-K loop is the shared Knowledge repository. Traditional threshold-based alerting suffers from acute brittleness: setting a static latency alert at 200ms triggers false alarms during morning traffic surges while failing to detect catastrophic micro-drops in throughput at midnight. Our autonomous control loop incorporates statistical Holt-Winters exponential smoothing and historical baseline profiling within the Knowledge base, allowing the mesh to dynamically adapt alert sensitivity to time-of-day seasonal patterns and business event schedules.",
"""

p2_extra = """    "Beyond histograms and trace links, real-time telemetry fusion unifies Distributed Profiling via continuous eBPF sampling (such as Parca or Pyroscope). While metrics declare *what* is failing (e.g., checkout API latency spiked to 2 seconds), and distributed traces show *where* it is failing (e.g., inside the cryptographic token verification function), continuous eBPF CPU and memory profiling reveals *why* it is failing down to the exact assembly instruction or memory allocation line without requiring application code changes or intrusive bytecode instrumentation.",
    "Furthermore, our telemetry fusion engine feeds a Unified Dependency Topology Graph. As Envoy sidecars and OpenTelemetry SDKs report trace parent-child relationships and Prometheus service metrics, the telemetry engine dynamically synthesizes a live directed acyclic graph (DAG) of the entire microservice ecosystem. When an anomaly emerges, graph centrality algorithms (such as PageRank or downstream reachability analysis) pinpoint the upstream blast radius and prevent alert storms by suppressing alerts from secondary victims.",
"""

p3_extra = """    "In addition to standard outlier detection, advanced mesh routing implements Locality-Prioritized Load Balancing and Multi-Cluster Failover. When an entire cloud availability zone suffers a localized power brownout or fiber cut, Envoy proxies automatically route traffic to the nearest surviving availability zone with sub-millisecond route convergence. The xDS control plane continually balances cross-zone egress network charges against application latency, ensuring optimal cloud economics during normal operations and instant survival during regional cataclysms.",
    "Furthermore, the mesh enforces Strict mTLS Cryptographic Quarantine. If a container exhibits abnormal security telemetry—such as attempting unauthorized port scans against neighboring pods or triggering anomalous payload deserialization errors—the control plane revokes the pod's SPIFFE/SPIRE cryptographic X.509 certificate within five milliseconds, instantly cutting the compromised container off from the service mesh network and preventing lateral threat traversal across cluster nodes.",
"""

p4_extra = """    "Beyond individual container restarts, enterprise self-healing addresses Complex Distributed State Corruption: Automated Split-Brain Resolution and Distributed Cache Flushing. In distributed caching tiers (such as the Redis Cluster topologies mastered in Day 43), a network partition can create cache-aside inconsistencies or poison-pill hot keys. The autonomous remediator coordinates with distributed coordination services (such as etcd or Consul) to execute lease revocations, flush corrupted cache partitions, and repopulate state from durable commit logs before unlocking upstream traffic gates.",
    "Furthermore, the remediator integrates Graceful Degradation Feature Flags. If a database cluster reaches ninety percent IOPS saturation despite horizontal read replica scale-out, the remediator autonomously flips dynamic feature flags via Consul or LaunchDarkly: disabling non-essential features (such as personalized recommendations, live chat widgets, and social feeds) to preserve one hundred percent compute capacity for the primary revenue-generating checkout transaction stream.",
"""

p5_extra = """    "Fifth, Financial Cost Governance & Autonomous Cloud Efficiency: In addition to technical resilience, our capstone mesh continuously balances reliability against cloud operational costs. Autonomous autoscaling algorithms often suffer from runaway resource inflation when misconfigured to spin up hundreds of expensive cloud instances during transient spikes. Our autonomous mesh integrates FinOps cost guardrails that evaluate hourly cloud spending budgets in real time, intelligently selecting spot instances for stateless worker pools and reserving on-demand instances strictly for mission-critical transactional cores.",
    "Sixth, Continuous Chaos CI/CD Pipeline Integration: The capstone platform enforces a mandatory resilience verification gate before any software release reaches production. Every new Git pull request triggers an automated ephemeral staging environment where the autonomous mesh injects synthetic latency, kills database pods, and simulates network partitions. Pull requests that suffer steady-state degradation or fail to recover autonomously within 500 milliseconds are automatically blocked from merging, cementing an unyielding engineering culture of zero-downtime reliability.",
"""

lines = content

# Inject p1_extra before "Consider the everyday physical analogy of the autonomic nervous system"
lines = lines.replace(
    '    "Consider the everyday physical analogy of the autonomic nervous system',
    f'{p1_extra}    "Consider the everyday physical analogy of the autonomic nervous system'
)

# Inject p2_extra before "Consider the everyday physical analogy of a hospital emergency room"
lines = lines.replace(
    '    "Consider the everyday physical analogy of a hospital emergency room',
    f'{p2_extra}    "Consider the everyday physical analogy of a hospital emergency room'
)

# Inject p3_extra before "Consider the everyday physical analogy of high-speed railroad track switching"
lines = lines.replace(
    '    "Consider the everyday physical analogy of high-speed railroad track switching',
    f'{p3_extra}    "Consider the everyday physical analogy of high-speed railroad track switching'
)

# Inject p4_extra before "Consider the everyday physical analogy of an automated submarine damage control system"
lines = lines.replace(
    '    "Consider the everyday physical analogy of an automated submarine damage control system',
    f'{p4_extra}    "Consider the everyday physical analogy of an automated submarine damage control system'
)

# Inject p5_extra before "Consider the final physical analogy of an interplanetary deep-space probe"
lines = lines.replace(
    '    "Consider the final physical analogy of an interplanetary deep-space probe',
    f'{p5_extra}    "Consider the final physical analogy of an interplanetary deep-space probe'
)

# Restore assert statements
lines = lines.replace("# assert wc >= 600", "assert wc >= 600").replace("# assert total_words >= 3000", "assert total_words >= 3000")

open("scripts/create_dist_day55_data.py", "w", encoding="utf-8").write(lines)
print("Updated scripts/create_dist_day55_data.py with expansions.")
