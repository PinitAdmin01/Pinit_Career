with open('scripts/enrich_day36_cloud.py', 'r', encoding='utf-8') as f:
    c = f.read()

p2_extra = '''    "Beyond filesystem and seccomp sandboxing, the Jailer enforces network isolation using dedicated Linux network namespaces (`ip netns`). Each Firecracker microVM receives a private network namespace possessing only a loopback interface and a single TAP interface linked to a host virtual bridge or AWS VPC CNI routing table. Because the microVM process possesses zero raw socket creation privileges (`CAP_NET_RAW` is permanently stripped during user namespace transition), rogue code inside the guest cannot execute ARP spoofing, packet sniffing, or man-in-the-middle attacks against adjacent microVMs operating on the same physical bare-metal host. This network namespace boundary guarantees that all east-west network traffic between serverless functions is routed through AWS security groups and VPC route tables with the exact same security posture as physical server racks.",\n'''

p5_extra = '''    "From an observability perspective, operating serverless microVMs at scale requires continuous telemetry ingestion. AWS Lambda integrates with Amazon CloudWatch Embedded Metric Format (EMF) to emit asynchronous, zero-latency execution metrics directly from the microVM runtime. By inspecting CloudWatch Lambda Insights, SRE teams analyze cold start distributions across p50, p90, and p99 percentiles, isolating whether latency spikes stem from Firecracker microVM provisioning, Java class loading, or downstream database connection handshakes. Distributed traces captured by AWS X-Ray break down each invocation into discrete subsegments: `Initialization` (cold boot overhead), `Restore` (SnapStart memory page streaming), and `Invocation` (business logic execution). When Provisioned Concurrency spillover occurs, automated CloudWatch metric alarms trigger proactive auto-scaling policies, ensuring zero user-facing degradation during unexpected traffic surges.",\n'''

c = c.replace('p2_new = [\n', 'p2_new = [\n' + p2_extra)
c = c.replace('p5_new = [\n', 'p5_new = [\n' + p5_extra)

with open('scripts/enrich_day36_cloud.py', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated enrich_day36_cloud.py')
