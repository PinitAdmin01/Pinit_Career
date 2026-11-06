with open('scripts/build_day49_cloud.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add paragraph to p2_say
p2_target = '''    "Understanding the Automated Rollback Lifecycle is vital for experiment design.'''
p2_replacement = '''    "To achieve rapid response times before customer traffic is degraded, SRE teams configure High-Resolution CloudWatch Alarms with ten-second evaluation periods. Standard CloudWatch metrics aggregate data at one-minute or five-minute intervals; in a chaos experiment, waiting sixty seconds for an alarm to trip is too slow to prevent user disruption. By leveraging high-resolution custom metrics and CloudWatch Metric Math, the safety circuit breaker detects threshold breaches within ten to fifteen seconds, allowing AWS FIS to abort the experiment almost instantaneously.",
    "Understanding the Automated Rollback Lifecycle is vital for experiment design.'''

# Add paragraph to p3_say
p3_target = '''    "The most frequent and dangerous architectural flaw exposed during AZ evacuation chaos experiments is the lack of N+1 Capacity Headroom.'''
p3_replacement = '''    "In Kubernetes and Amazon EKS environments, platform engineers configure Pod Topology Spread Constraints ('topologySpreadConstraints') and node provisioning engines like Karpenter with strict zonal balancing rules. When an entire AZ goes offline, Karpenter rapidly provisions replacement nodes in surviving AZs while ensuring that pods are not scheduled onto nodes that are marked for eviction. SRE teams tune target group deregistration delays ('deregistration_delay.timeout_seconds') down from three hundred seconds to thirty seconds, enabling in-flight requests to drain rapidly without stalling failover progression.",
    "The most frequent and dangerous architectural flaw exposed during AZ evacuation chaos experiments is the lack of N+1 Capacity Headroom.'''

# Add paragraph to p4_say
p4_target = '''    "Surviving network chaos requires client-side Resiliency Patterns: strict request Timeouts,'''
p4_replacement = '''    "In service mesh architectures powered by AWS App Mesh or Istio on Amazon EKS, engineers can also inject network faults at the application layer using Envoy Proxy fault injection filters ('envoy.filters.http.fault'). Envoy can inject HTTP abort codes (such as HTTP 503 or 504) or add percentage-based artificial delays directly on upstream cluster routes without requiring SSM agent access or operating system level kernel privileges. This enables application developers to test individual REST or gRPC endpoint degradation in isolated microservice namespaces.",
    "Surviving network chaos requires client-side Resiliency Patterns: strict request Timeouts,'''

# Add paragraph to p5_say
p5_target = '''    "A vital outcome of every GameDay is the measurement of objective SRE Operational Metrics: Mean Time to Detect (MTTD) and Mean Time to Recover (MTTR).'''
p5_replacement = '''    "To organize GameDays systematically, platform teams author formal GameDay Scenario Cards. Each card documents the targeted architectural subsystem, steady-state hypothesis, injected failure mechanism, expected monitoring signals, and estimated time to recover. During execution, the Safety Watcher maintains an active communications bridge (such as an incident Slack channel or Zoom room), logging every command and telemetry observation in an immutable timeline.",
    "A vital outcome of every GameDay is the measurement of objective SRE Operational Metrics: Mean Time to Detect (MTTD) and Mean Time to Recover (MTTR).'''

assert p2_target in content, "p2_target not found"
assert p3_target in content, "p3_target not found"
assert p4_target in content, "p4_target not found"
assert p5_target in content, "p5_target not found"

content = content.replace(p2_target, p2_replacement)
content = content.replace(p3_target, p3_replacement)
content = content.replace(p4_target, p4_replacement)
content = content.replace(p5_target, p5_replacement)

with open('scripts/build_day49_cloud.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully injected paragraphs into build_day49_cloud.py!")
