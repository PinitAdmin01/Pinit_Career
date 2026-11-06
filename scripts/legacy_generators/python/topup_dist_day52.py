# scripts/topup_dist_day52.py

with open("scripts/create_dist_day52_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 1 addition
p1_target = '"Notice how an HTTP request for `/api/v1/orders/101`'
p1_extra = '''    "From an operating system networking perspective, traffic redirection into the Envoy sidecar is executed using Linux Netfilter `iptables` rules or modern extended Berkeley Packet Filter (eBPF) programs. During pod initialization, an ephemeral init-container (`istio-init`) configures `iptables` PREROUTING and OUTPUT chains to redirect all inbound TCP packets on port 80 or 8080 to Envoy local listener port 15006, and all outbound packets to Envoy outbound listener port 15001.",
    "In newer kernel environments, eBPF programs attached to Linux socket operations (sockops) bypass `iptables` Netfilter traversal entirely. eBPF rewrites socket memory pointers directly in kernel space, transferring bytes between the application socket and the Envoy sidecar socket without traversing the TCP/IP network stack twice, slashing sidecar latency overhead by an additional twenty-five percent.",
    "Notice how an HTTP request for `/api/v1/orders/101`'''

content = content.replace(p1_target, p1_extra)

# Part 2 addition
p2_target = '"Notice how a valid SPIFFE ID belonging to'
p2_extra = '''    "To prevent cryptanalytic exposure and minimize the blast radius of compromised container keys, service mesh certificates enforce Short-Lived Ephemeral Lifespans (typically twelve to twenty-four hours). The Secret Discovery Service (SDS) protocol establishes an asynchronous gRPC streaming channel between Envoy and the local node agent (such as `spire-agent` or Istio agent). When a certificate reaches sixty percent of its lifespan, the agent automatically mints a new private key, requests a signed certificate from the control plane CA, and pushes the new credentials into Envoy memory.",
    "Envoy performs zero-downtime certificate rotation: in-flight TLS connections continue on the previous certificate until completion, while new handshakes seamlessly utilize the updated certificate, eliminating manual renewal toil and preventing catastrophic outages caused by expired certificates.",
    "Notice how a valid SPIFFE ID belonging to'''

content = content.replace(p2_target, p2_extra)

# Part 3 addition
p3_target = '"Notice how a random roll of 0.45 routes to orders-v1'
p3_extra = '''    "In addition to weighted canary shifting and header matching, Envoy supports Advanced Traffic Mirroring (Shadowing). Under traffic mirroring, the sidecar sends one hundred percent of live production traffic to stable version 1, and concurrently clones (mirrors) a copy of every request asynchronously to canary version 2 on a fire-and-forget basis! Envoy discards the response from version 2, ensuring that any bugs, crashes, or high latencies in the canary code cannot impact real users.",
    "Traffic mirroring is extraordinarily valuable for mission-critical banking ledgers and high-frequency trading backends: it allows performance engineers to benchmark new software versions under authentic production concurrency, cache access patterns, and payload variations before a single customer is routed to the new release.",
    "Furthermore, service mesh route configurations support Automated Request Retries and Timeout Budgets. If a transient network glitch causes an RPC call to time out after two hundred milliseconds, Envoy automatically executes an exponential backoff retry against a different healthy pod replica, shielding upstream callers from transient cloud failures.",
    "Notice how a random roll of 0.45 routes to orders-v1'''

content = content.replace(p3_target, p3_extra)

# Part 4 addition
p4_target = '"Notice how recording three consecutive 503 errors on pod-101'
p4_extra = '''    "Beyond consecutive 5xx error thresholds, production Envoy proxies implement Success Rate Outlier Detection. Under success rate detection, Envoy periodically computes the mean success rate across all healthy endpoints in a cluster over a statistical evaluation window (e.g., one hundred requests). If an individual pod's success rate falls below two standard deviations from the cluster mean, Envoy automatically ejects that pod, even if its errors are interspersed with occasional successful responses.",
    "To prevent an entire cluster from collapsing during an enterprise-wide cascading failure, Envoy enforces the Max Ejection Percent Threshold (typically configured to ten or twenty percent). If a systemic database outage causes ninety percent of all pods to fail simultaneously, outlier detection stops ejecting pods once the threshold is reached! This circuit breaker safety prevents Envoy from ejecting all endpoints and causing total service unavailability.",
    "Notice how recording three consecutive 503 errors on pod-101'''

content = content.replace(p4_target, p4_extra)

# Part 5 addition
p5_target = '"Notice how the production audit confirms 15,000,000 requests'
p5_extra = '''    "From a cloud infrastructure cost perspective, our service mesh architecture delivers immense operational ROI. By decoupling Layer 7 traffic routing from pod replica counts, engineering teams run compact, rightsized Kubernetes clusters without over-provisioning redundant pods solely to achieve fine-grained canary splits, reducing cloud compute expenses by up to thirty-five percent.",
    "Furthermore, our deployment undergoes automated Bi-Weekly Game-Day Drills. SRE teams intentionally terminate sidecars, inject twenty-percent network packet loss, and simulate certificate authority downtime. Throughout every chaos scenario, our Envoy proxies maintain continuous uptime: mTLS tunnels heal automatically, degraded pods are quarantined within milliseconds, and canary deployments execute with textbook mathematical fidelity.",
    "Notice how the production audit confirms 15,000,000 requests'''

content = content.replace(p5_target, p5_extra)

with open("scripts/create_dist_day52_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Day 52 data script!")
