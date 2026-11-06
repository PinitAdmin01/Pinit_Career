# scripts/topup_dist_day52_round2.py

with open("scripts/create_dist_day52_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 2 addition
p2_target = '"Notice how a valid SPIFFE ID belonging to'
p2_extra = '''    "Additionally, service mesh authorization policies enforce Granular Role-Based Access Control (RBAC) at Layer 7. In addition to verifying that incoming traffic carries valid mTLS certificates, Envoy parses HTTP request methods, paths, and headers, asserting that service A is authorized only to perform `GET /api/v1/catalog` and strictly forbidding it from executing `POST /api/v1/admin/purge`, implementing the principle of least privilege across all service boundaries.",
    "Notice how a valid SPIFFE ID belonging to'''

content = content.replace(p2_target, p2_extra)

# Part 3 addition
p3_target = '"Notice how a random roll of 0.45 routes to orders-v1'
p3_extra = '''    "From a multi-cluster federation perspective, advanced service mesh deployments support Locality-Prioritized Load Balancing. When a client sidecar selects an upstream endpoint, it evaluates geographic locality metadata (region, zone, and sub-zone). Envoy preferentially routes ninety-nine percent of traffic to endpoints located within the exact same availability zone, routing cross-zone only during failovers to minimize inter-zone cloud egress bandwidth billing.",
    "Notice how a random roll of 0.45 routes to orders-v1'''

content = content.replace(p3_target, p3_extra)

# Part 5 addition
p5_target = '"Notice how the production audit confirms 15,000,000 requests'
p5_extra = '''    "From an enterprise observability perspective, Envoy sidecar proxies automatically generate uniform Golden Signals (Latency, Traffic, Errors, and Saturation) for every single inter-service RPC call without requiring application developers to write manual metrics code. These proxy metrics stream continuously into Prometheus and Grafana dashboards, alerting SRE teams to localized latency spikes within seconds of occurrence.",
    "Notice how the production audit confirms 15,000,000 requests'''

content = content.replace(p5_target, p5_extra)

with open("scripts/create_dist_day52_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Round 2 for Day 52!")
