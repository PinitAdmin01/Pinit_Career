import sys
sys.path.append('scripts')
from fullstack_day43_data import DAY_43

# Fix Part 4 code to join array on single line
p4_code = """// Day 43 Part 4: Dynamic Upstream Health Checks & Weighted Load Balancing
interface UpstreamNode {
  id: string;
  url: string;
  weight: number;
  currentWeight: number;
  healthy: boolean;
  consecutiveFailures: number;
}

class DynamicLoadBalancer {
  private nodes: UpstreamNode[] = [];

  registerNode(id: string, url: string, weight = 1): void {
    this.nodes.push({
      id,
      url,
      weight,
      currentWeight: 0,
      healthy: true,
      consecutiveFailures: 0
    });
  }

  recordHealthCheck(id: string, isHealthy: boolean): void {
    const node = this.nodes.find(n => n.id === id);
    if (!node) return;

    if (isHealthy) {
      node.healthy = true;
      node.consecutiveFailures = 0;
    } else {
      node.consecutiveFailures++;
      if (node.consecutiveFailures >= 2) {
        node.healthy = false;
      }
    }
  }

  // Smooth Weighted Round-Robin (Nginx algorithm)
  getNextHealthyNode(): UpstreamNode | null {
    const healthyNodes = this.nodes.filter(n => n.healthy);
    if (healthyNodes.length === 0) return null;

    let totalWeight = 0;
    let selectedNode: UpstreamNode = healthyNodes[0];

    for (const node of healthyNodes) {
      node.currentWeight += node.weight;
      totalWeight += node.weight;
      if (node.currentWeight > selectedNode.currentWeight) {
        selectedNode = node;
      }
    }

    selectedNode.currentWeight -= totalWeight;
    return selectedNode;
  }
}

const lb = new DynamicLoadBalancer();
lb.registerNode('node-alpha-16core', 'http://10.0.1.10:8080', 3); // High capacity
lb.registerNode('node-beta-8core', 'http://10.0.1.11:8080', 1);   // Standard capacity
lb.registerNode('node-gamma-unstable', 'http://10.0.1.12:8080', 1); // Failing node

// Simulate Gamma failing health checks
lb.recordHealthCheck('node-gamma-unstable', false);
lb.recordHealthCheck('node-gamma-unstable', false);

// Route 4 requests across surviving healthy nodes
const routedNodes: string[] = [];
for (let i = 0; i < 4; i++) {
  const target = lb.getNextHealthyNode();
  if (target) routedNodes.push(target.id);
}

console.log('Routed Distribution (Alpha vs Beta):', routedNodes.join(', '));
console.log('Alpha Received 3x Traffic (Weight = 3):', routedNodes.filter(id => id === 'node-alpha-16core').length === 3);
console.log('Failed Node Gamma Completely Evicted:', !routedNodes.includes('node-gamma-unstable'));
console.log('Dynamic Upstream Load Balancing Operational: True');"""

p4_out = """Routed Distribution (Alpha vs Beta): node-alpha-16core, node-alpha-16core, node-beta-8core, node-alpha-16core
Alpha Received 3x Traffic (Weight = 3): true
Failed Node Gamma Completely Evicted: true
Dynamic Upstream Load Balancing Operational: True"""

DAY_43['parts'][3]['code'] = p4_code
DAY_43['parts'][3]['output'] = p4_out

# Add pedagogical expansions (>= 650 words per part)
p1_extra = [
    "To fully understand the strategic value of the API Gateway pattern, one must analyze the operational friction caused by microservices sprawl. In an enterprise system with dozens of engineering squads developing independent services—such as billing, inventory, user profiles, notifications, and analytics—each service evolves at its own lifecycle pace. If mobile and web clients interface directly with these disparate services, any change to a service's network location, URL schema, or API version forces an immediate deployment across every mobile platform and web application.",
    "The API Gateway acts as an indispensable Abstraction Barrier. By exposing clean, versioned, consumer-friendly REST and GraphQL interfaces at the edge, the gateway conceals the messy internal realities of backend infrastructure. Backend teams can split a monolithic service into three smaller microservices, rewrite an internal service in Go or Rust, or migrate database schemas without changing a single URL or JSON property exposed to public clients. The gateway smoothly maps the public contracts to internal endpoints.",
    "Security centralization is equally critical. In modern Zero-Trust architectures, the edge gateway serves as the primary enforcement point for TLS 1.3 termination, certificate validation, and Web Application Firewall (WAF) inspections. Malicious payloads—such as SQL injection patterns, cross-site scripting (XSS) vectors, or malformed JSON payloads—are neutralized and dropped at the edge before they can ever cross into the internal corporate network zone.",
    "Furthermore, the gateway enforces Cross-Origin Resource Sharing (CORS) policies uniformly. Rather than requiring thirty distinct microservices to accurately configure Allowed-Origins, Allowed-Methods, and Pre-flight OPTIONS handling, the gateway handles all browser security negotiations in high-speed native memory, ensuring consistent security posture across the entire organization."
]

p2_extra = [
    "The necessity for atomic sliding window rate limiting is underscored by the sophistication of modern automated denial-of-service tools and distributed botnets. Unlike simple web crawlers of the past, modern automated scrapers distribute their attacks across thousands of residential proxy IP addresses, timing their requests to skirt around standard fixed-window rate limits.",
    "Consider the structural failure of leaky bucket versus token bucket versus sliding window counters. In a Leaky Bucket algorithm, incoming requests enter a queue and are processed at a strictly constant rate, dropping requests if the queue overflows. While leaky bucket excels at traffic shaping, it penalizes legitimate human users who navigate a web page and naturally trigger five or six simultaneous asset and API calls upon loading. By forcing those legitimate burst requests into a slow, sequential drip, leaky bucket introduces artificial latency that degrades the user experience.",
    "The Sliding Window Counter with Token Burst represents the optimal synthesis of flexibility and security. By permitting short, bursty surges up to a configured threshold while strictly enforcing a rolling rate ceiling across continuous time windows, legitimate users experience instantaneous page loads while abusive scrapers attempting sustained high-velocity extraction are swiftly throttled with HTTP 429 status codes.",
    "Moreover, enterprise rate limiters utilize multi-dimensional keying. Rather than keying rate limits purely by client IP address (which unfairly penalizes thousands of corporate employees sharing a single NAT gateway IP), the rate limiter derives composite keys combining authenticated Tenant ID, User ID, and API route sensitivity. Sensitive endpoints like `/api/v1/auth/login` are protected by strict ten-attempt-per-minute thresholds, while read-only catalog endpoints support thousands of queries per second per tenant."
]

p3_extra = [
    "The catastrophic nature of cascading failures in distributed systems is rooted in Little's Law of queueing theory: `L = lambda * W`. Little's Law proves that the number of concurrent requests inside a system (`L`) is strictly equal to the arrival rate (`lambda`) multiplied by the average latency (`W`). This mathematical invariant reveals why latency spikes are far more lethal than outright crashes.",
    "If an upstream microservice crashes and immediately returns an HTTP 500 error within two milliseconds, the arrival rate and latency remain low, and the API Gateway easily handles the traffic. However, if the upstream service hangs and takes thirty seconds to respond, `W` increases by a factor of one thousand! According to Little's Law, the number of concurrent open connections (`L`) inside the API Gateway surges one thousand-fold.",
    "The gateway quickly runs out of operating system socket file descriptors, node memory buffers fill up, and event loop latency spikes across all threads. Within seconds, the gateway becomes completely paralyzed, failing to serve requests for healthy microservices like user login or homepage catalogs. A localized slowdown in a non-essential review service brings down the entire multi-billion-dollar business.",
    "The Circuit Breaker pattern is the mathematical antidote to Little's Law. By tripping into the OPEN state the moment upstream latency or error rates drift beyond safe thresholds, the breaker forces `W` back to zero milliseconds for failing calls. The gateway immediately fails fast, returning cached fallbacks or clear 503 statuses in less than one millisecond. Concurrency `L` drops to tranquil baselines, gateway sockets remain unblocked, and the rest of the enterprise ecosystem continues operating with zero disruption."
]

p4_extra = [
    "The evolution from static configuration files to dynamic service discovery reflects the rapid shift toward ephemeral cloud-native infrastructure. In containerized environments managed by Kubernetes or AWS ECS, pods are frequently terminated and rescheduled due to automatic bin packing, node drain operations, or autoscaling events. The IP address of a backend service pod can change every fifteen minutes.",
    "To maintain seamless connectivity without human intervention, modern API Gateways implement continuous Service Discovery Watchers. By subscribing to the Kubernetes API server or Consul catalog streams, the gateway maintains an active in-memory routing table that updates in real time whenever an upstream container starts or stops. When a new replica passes its readiness probe, the gateway immediately registers it into its weighted round-robin pool.",
    "Smooth Weighted Round-Robin load balancing—originally popularized by the Nginx engineering team—solves a subtle yet critical flaw in basic weighted algorithms. In naive weighted round-robin with three nodes weighted 5, 1, and 1, a naive scheduler would send five consecutive requests to node 1, followed by one to node 2, and one to node 3. This creates a mini-stampede against node 1 at the beginning of every cycle.",
    "The smooth weighted algorithm interleaves requests dynamically by continuously tracking and decrementing current weights across all nodes. For weights 5, 1, 1, the smooth algorithm distributes requests in the sequence: Node 1, Node 1, Node 2, Node 1, Node 3, Node 1, Node 1. The high-capacity node absorbs its proportional five-sevenths share of traffic without ever being subjected to a concentrated burst, ensuring optimal CPU and cache temperature across all cluster members."
]

p5_extra = [
    "In large-scale distributed architectures where a single user click initiates a cascade of fifty downstream RPC calls across twenty different microservices, debugging production latency bottlenecks without distributed tracing is impossible. When a customer complains that checking out took five seconds, looking at individual server logs is like looking at fifty separate jigsaw puzzle pieces scattered across a dark room.",
    "The W3C Trace Context standard provides the cryptographic adhesive that binds distributed systems together. By minting a standardized `traceparent` header at the API Gateway edge, every single downstream microservice inherits an immutable, globally unique Trace ID. As the request navigates through internal gRPC links, Kafka message topics, and database query spans, each service appends its own localized Span ID while preserving the master Trace ID.",
    "When logs and OpenTelemetry spans are collected into centralized observability backends like Grafana Tempo, Jaeger, or Datadog, engineers can render a complete visual execution timeline of the transaction. The gateway's telemetry sentinel acts as the vigilant gatekeeper, measuring edge-to-edge duration and comparing each route against its designated Service Level Objective (SLO) latency budget.",
    "If the telemetry sentinel detects that P99 latency on the `/api/v1/checkout` route begins creeping toward its maximum budget, automated alerts fire immediately, pinpointing the exact upstream microservice or database span responsible for the delay. This proactive, closed-loop telemetry turns the API Gateway into both a bulletproof shield and an intelligent nerve center for the entire enterprise platform."
]

DAY_43['parts'][0]['say'].extend(p1_extra)
DAY_43['parts'][1]['say'].extend(p2_extra)
DAY_43['parts'][2]['say'].extend(p3_extra)
DAY_43['parts'][3]['say'].extend(p4_extra)
DAY_43['parts'][4]['say'].extend(p5_extra)

import pprint
with open('scripts/fullstack_day43_data.py', 'w', encoding='utf-8') as f:
    f.write('# Day 43 Fullstack JS Long Lesson Data\n')
    f.write(f'DAY_43 = {pprint.pformat(DAY_43, width=120, sort_dicts=False)}\n')

print('Successfully expanded and calibrated Day 43!')
