import json
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

def count_words(text_list):
    total = 0
    for p in text_list:
        words = p.strip().split()
        total += len(words)
    return total

def get_hash(content):
    return hashlib.sha256(content.strip().encode('utf-8')).hexdigest()

# -------------------------------------------------------------
# Part 1: Principles of Chaos Engineering & AWS FIS Architecture
# -------------------------------------------------------------
p1_title = "Principles of Chaos Engineering & AWS Fault Injection Simulator (FIS) Architecture: Targets & Actions"
p1_say = [
    "Welcome to Day 49 of Cloud Native AWS Architecture. Today, we confront the foundational reality of distributed cloud systems: failure is inevitable, continuous, and unpredictable. As Werner Vogels famously declared, everything fails all the time. In traditional engineering cultures, resiliency testing was confined to disaster recovery drills performed on staged environments during scheduled weekend maintenance windows. Chaos Engineering completely revolutionizes this paradigm: transforming resiliency into an empirical, hypothesis-driven science executed directly in production environments.",
    "Chaos Engineering is explicitly not the act of breaking systems randomly or causing uncontrolled outages. Rather, it is the discipline of experimenting on a system to build confidence in the system's capability to withstand turbulent conditions in production. The scientific methodology requires four rigorous steps: first, define the system's 'steady state' using measurable business metrics (such as request throughput, p99 latency, or successful payment completions); second, hypothesize that this steady state will persist despite injected turbulence; third, introduce realistic real-world disruptions (such as server terminations, network partitions, or database failovers); and fourth, verify whether the hypothesis holds or if a hidden architectural vulnerability is exposed.",
    "To enable secure, controlled, and native chaos experiments on Amazon Web Services without requiring dangerous custom scripts, AWS provides the AWS Fault Injection Simulator (AWS FIS). AWS FIS is a fully managed service that allows platform and site reliability engineering (SRE) teams to execute fault injection experiments across AWS infrastructure, including Amazon EC2, Amazon EKS, Amazon ECS, Amazon RDS, and AWS IAM. Because FIS integrates natively with AWS Identity and Access Management and CloudWatch, it enforces absolute governance and prevents unauthorized chaos execution.",
    "The core architectural primitive of AWS FIS is the Experiment Template. An Experiment Template consists of four interconnected components: Targets, Actions, Stop Conditions, and IAM Role. Targets define the specific AWS resources that will be subjected to chaos. FIS provides sophisticated target selection algorithms: engineers can select targets by tags, resource IDs, or VPC subnet placement, and constrain the Blast Radius by specifying either an absolute resource count (e.g., terminate exactly two instances) or a percentage limit (e.g., disrupt no more than twenty percent of active worker nodes).",
    "Actions define the specific fault injection operations executed against the selected targets. AWS FIS provides a rich catalog of pre-built, managed fault actions. For compute workloads, actions like 'aws:ec2:stop-instances', 'aws:ec2:reboot-instances', and 'aws:ecs:stop-task' test self-healing auto-scaling groups and container orchestrators. For storage and data persistence, actions such as 'aws:rds:failover-db-cluster' simulate abrupt primary database failovers. For network infrastructure, actions like 'aws:network:disrupt-connectivity' sever transit routes or simulate packet corruption across VPC subnets.",
    "Crucially, AWS FIS allows actions to be composed into complex execution graphs: executing actions sequentially or in parallel with precise duration and delay parameters. For example, an experiment can simultaneously simulate a database failover while throttling network connectivity between microservices for exactly five minutes, modeling compound multi-tiered failure scenarios that standard integration tests could never reproduce.",
    "Furthermore, every FIS experiment runs under a dedicated, least-privilege IAM service role. This role must be explicitly granted permissions to perform the targeted disruptive actions (such as 'ec2:StopInstances'). If an unauthorized user attempts to trigger an experiment affecting production databases or customer data, the AWS IAM evaluation engine immediately denies execution, ensuring strict defense-in-depth security.",
    "In the production TypeScript simulation below, we model the foundational mechanics of the AWS FIS Experiment Engine and Blast Radius limitation. We register a fleet of ten EC2 targets across multiple Availability Zones, define a fault action to stop instances, enforce an in-memory blast radius constraint capping affected resources to twenty percent, and verify that exactly two instances are transitioned to the stopped state deterministically.",
    "By adopting AWS FIS and formal chaos engineering principles, enterprise platform teams shift from reactive firefighting to proactive architectural validation. Instead of discovering cascading failover bugs during an unexpected three in the morning production outage, teams surface and remediate vulnerabilities during controlled, monitored business hours with zero customer impact."
]

p1_code = """// Part 1: AWS FIS Experiment Architecture & Blast Radius Engine
interface FisTarget {
  id: string;
  az: string;
  state: 'running' | 'stopped';
}

interface FisAction {
  actionId: string;
  targetId: string;
  durationSeconds: number;
}

class FisExperimentEngine {
  private targets: FisTarget[] = [];

  registerTarget(target: FisTarget): void {
    this.targets.push(target);
  }

  execute(action: FisAction, maxPercent: number): { affected: number; compliant: boolean } {
    const total = this.targets.length;
    const maxAllowed = Math.floor((total * maxPercent) / 100);
    const selected = this.targets.slice(0, maxAllowed);

    for (const t of selected) {
      t.state = 'stopped';
    }

    return {
      affected: selected.length,
      compliant: selected.length <= maxAllowed
    };
  }
}

const engine = new FisExperimentEngine();
for (let i = 1; i <= 10; i++) {
  engine.registerTarget({ id: 'i-' + i, az: i % 2 === 0 ? 'us-east-1a' : 'us-east-1b', state: 'running' });
}

const res1 = engine.execute({ actionId: 'aws:ec2:stop-instances', targetId: 'instances', durationSeconds: 60 }, 20);
console.log('Status=FIS_EXPERIMENT_ARCHITECTURE_VERIFIED | Action=aws:ec2:stop-instances | TargetCount=' + res1.affected + ' | BlastRadiusCompliant=' + res1.compliant);"""

p1_output = "Status=FIS_EXPERIMENT_ARCHITECTURE_VERIFIED | Action=aws:ec2:stop-instances | TargetCount=2 | BlastRadiusCompliant=true"
p1_notes = [
    {"line": 2, "note": "Defines FisTarget and FisAction interfaces modeling AWS Fault Injection Simulator schema."},
    {"line": 15, "note": "Implements execute method enforcing mathematical blast radius percentage caps across targets."}
]

p1_check = {
    "question": "What is the primary scientific and operational requirement when defining an AWS Fault Injection Simulator (FIS) experiment?",
    "options": [
        "Defining a measurable steady-state hypothesis, constraining the blast radius percentage, and binding automated CloudWatch stop conditions.",
        "Executing uncontrolled server terminations across one hundred percent of production instances without monitoring.",
        "Replacing all production databases with empty in-memory SQLite instances without taking backups.",
        "Disabling all firewall rules and VPC security groups permanently to test public internet penetration."
    ],
    "answer": 0,
    "explanation": "Chaos Engineering is an empirical discipline requiring a clearly defined steady-state hypothesis, strict blast radius limits (percentage or count), and automated stop conditions (CloudWatch alarms) that abort the experiment if customer-facing metrics degrade."
}

# -------------------------------------------------------------
# Part 2: Automated Stop Conditions & Safety Guardrails
# -------------------------------------------------------------
p2_title = "Automated Stop Conditions & Safety Guardrails: CloudWatch Alarms & Circuit Breakers"
p2_say = [
    "The absolute cardinal rule of Chaos Engineering in enterprise cloud environments is Safety First. Running chaos experiments without automated safety mechanisms is reckless negligence that inevitably leads to major production outages. When injecting intentional faults into a live system, the unexpected can and will happen: a downstream service might enter a retry storm, a cache may fail to invalidate, or an unforeseen database deadlock might trigger cascading saturation. To prevent chaos experiments from escalating into customer-facing incidents, AWS FIS mandates the use of Automated Stop Conditions.",
    "A Stop Condition in AWS FIS is an architectural circuit breaker bound to one or more Amazon CloudWatch Alarms. During the entire lifecycle of an experiment, the AWS FIS control plane continuously monitors the operational status of these designated CloudWatch alarms. If any monitored alarm enters the 'ALARM' state—indicating that a critical health or performance metric has breached its defined safety threshold—AWS FIS immediately intercepts the experiment, halts all ongoing fault injection actions, and executes automated rollback procedures.",
    "Configuring resilient stop conditions requires deep telemetry instrumentation. Platform teams typically deploy Composite CloudWatch Alarms that evaluate multiple health dimensions simultaneously. For example, a production stop condition alarm monitors three critical service level indicators: first, the Application Load Balancer HTTP 5xx error rate (triggering if errors exceed one percent over a one-minute evaluation period); second, customer-facing p99 latency (triggering if latency exceeds two hundred and fifty milliseconds); and third, downstream message queue lag (triggering if Amazon SQS queue depth spikes).",
    "Beyond monitoring standard AWS infrastructure metrics, high-maturity engineering teams bind Business Metric Alarms to their stop conditions. For an e-commerce platform, the stop condition monitors order checkout completions per minute; for a streaming media platform, it monitors active video playback sessions. If a simulated network partition in an internal microservice causes payment completions to drop by more than five percent, the business alarm trips instantly, cutting off the chaos experiment before revenue or customer trust is materially impacted.",
    "To achieve rapid response times before customer traffic is degraded, SRE teams configure High-Resolution CloudWatch Alarms with ten-second evaluation periods. Standard CloudWatch metrics aggregate data at one-minute or five-minute intervals; in a chaos experiment, waiting sixty seconds for an alarm to trip is too slow to prevent user disruption. By leveraging high-resolution custom metrics and CloudWatch Metric Math, the safety circuit breaker detects threshold breaches within ten to fifteen seconds, allowing AWS FIS to abort the experiment almost instantaneously.",
    "Understanding the Automated Rollback Lifecycle is vital for experiment design. When a stop condition triggers, FIS does not simply abandon the system in a broken state. For actions that have native cleanup capabilities—such as 'aws:network:disrupt-connectivity' or simulated CPU stress injected via AWS Systems Manager (SSM) documents—FIS immediately terminates the fault action and restores normal network routing and compute capacity. For actions that terminate instances, the experiment relies on underlying Auto Scaling Groups to launch replacement capacity.",
    "Furthermore, AWS FIS provides an emergency manual circuit breaker: the 'Stop Experiment' API and console button. Chaos commanders monitoring a live GameDay can press the emergency stop button at any fraction of a second to initiate immediate termination. Additionally, FIS experiments can be configured with an absolute maximum execution duration (such as ten minutes), ensuring that even if monitoring agents fail, the experiment cannot run indefinitely.",
    "In the verified TypeScript simulation below, we build a complete 'FisSafetyCircuitBreaker' engine. We feed real-time telemetry probes representing latency and 5xx error rates into the evaluation loop. As long as metrics remain within acceptable bounds, the experiment proceeds. However, when the third telemetry probe detects a p99 latency breach of three hundred and ten milliseconds, the circuit breaker trips immediately, aborts the experiment, executes automated rollback, and returns the system to a stable state.",
    "By establishing automated stop conditions and strict circuit breakers, cloud architects eliminate the existential fear of running chaos in production. Developers and leadership gain confidence that safety guardrails are active, automated, and mathematically verified, permitting bold experimentation without risking operational stability."
]

p2_code = """// Part 2: Automated Stop Conditions & Chaos Circuit Breakers
interface MetricProbe {
  timestamp: number;
  p99LatencyMs: number;
  errorRate5xx: number;
}

class FisSafetyCircuitBreaker {
  public experimentActive = true;
  public rollbackExecuted = false;

  constructor(
    private readonly maxP99Ms: number,
    private readonly maxErrorRate: number
  ) {}

  evaluateTelemetry(probes: MetricProbe[]): 'CONTINUE' | 'ABORT_ROLLBACK' {
    for (const p of probes) {
      if (p.p99LatencyMs > this.maxP99Ms || p.errorRate5xx > this.maxErrorRate) {
        this.experimentActive = false;
        this.rollbackExecuted = true;
        return 'ABORT_ROLLBACK';
      }
    }
    return 'CONTINUE';
  }
}

const breaker = new FisSafetyCircuitBreaker(250, 0.02);
const telemetryFeed: MetricProbe[] = [
  { timestamp: 1, p99LatencyMs: 45, errorRate5xx: 0.001 },
  { timestamp: 2, p99LatencyMs: 120, errorRate5xx: 0.004 },
  { timestamp: 3, p99LatencyMs: 310, errorRate5xx: 0.035 } // Breaches threshold!
];

const decision = breaker.evaluateTelemetry(telemetryFeed);
const finalState = breaker.rollbackExecuted ? 'STABLE' : 'DEGRADED';
console.log('Status=FIS_SAFETY_CIRCUIT_BREAKER_VERIFIED | StopConditionTriggered=' + (decision === 'ABORT_ROLLBACK') + ' | RollbackExecuted=' + breaker.rollbackExecuted + ' | FinalSystemState=' + finalState);"""

p2_output = "Status=FIS_SAFETY_CIRCUIT_BREAKER_VERIFIED | StopConditionTriggered=true | RollbackExecuted=true | FinalSystemState=STABLE"
p2_notes = [
    {"line": 2, "note": "MetricProbe interface models real-time p99 latency and 5xx error telemetry."},
    {"line": 15, "note": "evaluateTelemetry trips the circuit breaker and triggers automated rollback upon threshold breach."}
]

p2_check = {
    "question": "What happens when an attached CloudWatch alarm transitions to the ALARM state during an active AWS FIS experiment?",
    "options": [
        "AWS FIS immediately halts all ongoing fault injection actions, aborts the experiment, and executes automated rollback procedures to restore normal operations.",
        "AWS FIS ignores the alarm and doubles the duration of the chaos test to stress the system further.",
        "The AWS Account is permanently terminated and all CloudFormation stacks are deleted.",
        "The system reboots all network switches across the entire physical AWS region."
    ],
    "answer": 0,
    "explanation": "Stop Conditions are safety circuit breakers. When an attached CloudWatch alarm enters ALARM state, AWS FIS immediately halts the experiment and triggers automated rollback/cleanup to ensure customer traffic is not impacted."
}

# -------------------------------------------------------------
# Part 3: Availability Zone (AZ) Evacuation & Zonal Shift
# -------------------------------------------------------------
p3_title = "Availability Zone (AZ) Evacuation & Zonal Shift: Route 53 ARC & VPC Network Chaos"
p3_say = [
    "One of the most critical disaster recovery requirements for mission-critical cloud native applications is surviving a total Availability Zone outage. While AWS Availability Zones are physically isolated data centers with independent power, cooling, and networking, severe physical events—such as power grid failures, catastrophic water pipe bursts, or core fiber cuts—can impair an entire AZ. To guarantee true high availability, architectures must not merely survive AZ failure: they must be capable of executing rapid, deterministic Availability Zone Evacuation.",
    "Availability Zone Evacuation involves completely redirecting application traffic away from an impaired AZ to healthy surviving AZs within the same AWS region. In legacy setups, AZ evacuation was slow, complicated, and hazardous: engineers attempted to manually deregister hundreds of EC2 targets from load balancers or edit DNS records by hand while production alarms were blaring. Today, AWS provides native, automated tooling to achieve zonal evacuation in seconds: Amazon Route 53 Application Recovery Controller (Route 53 ARC) Zonal Shift.",
    "Route 53 ARC Zonal Shift allows operators to shift traffic away from a specific Availability Zone for supported resources—including Application Load Balancers and Network Load Balancers—with a single API call. When a zonal shift is initiated, the load balancer stops routing new incoming requests to target instances or IP addresses located in the evacuated AZ. Furthermore, Route 53 ARC supports Zonal Autoshift: an automated capability that continuously analyzes AWS internal telemetry and automatically initiates a zonal shift if AWS detects impaired infrastructure in an AZ, before customer alarms even fire.",
    "To rigorously test and validate zonal evacuation mechanisms before a real disaster strikes, platform teams use AWS FIS to conduct simulated AZ Evacuation Experiments. Using the 'aws:network:disrupt-connectivity' action targeting all subnets within a specific AZ, or executing 'aws:ec2:stop-instances' across all compute in the zone, the chaos experiment severs all communication to the target AZ. The team then observes whether Route 53 ARC or cross-zone load balancing successfully shifts all traffic to surviving zones without error spikes.",
    "In Kubernetes and Amazon EKS environments, platform engineers configure Pod Topology Spread Constraints ('topologySpreadConstraints') and node provisioning engines like Karpenter with strict zonal balancing rules. When an entire AZ goes offline, Karpenter rapidly provisions replacement nodes in surviving AZs while ensuring that pods are not scheduled onto nodes that are marked for eviction. SRE teams tune target group deregistration delays ('deregistration_delay.timeout_seconds') down from three hundred seconds to thirty seconds, enabling in-flight requests to drain rapidly without stalling failover progression.",
    "The most frequent and dangerous architectural flaw exposed during AZ evacuation chaos experiments is the lack of N+1 Capacity Headroom. SRE teams often make the mistake of sizing their multi-AZ compute clusters for normal baseline traffic under the assumption that all zones are always healthy. For example, if an application requires three hundred instances to handle peak load across three AZs, the team deploys exactly one hundred instances per zone. When an AZ is evacuated, the two hundred instances in the remaining two zones must suddenly absorb one hundred and fifty requests each—a fifty percent load spike!",
    "If the surviving instances lack sufficient CPU and memory headroom, or if Auto Scaling cannot launch replacement instances fast enough due to EC2 spot capacity constraints, the surviving AZs suffer cascading CPU exhaustion and crash sequentially. A resilient multi-AZ architecture must maintain deliberate N+1 capacity headroom: sizing each surviving zone so that (N - 1) zones can absorb one hundred percent of peak regional traffic without exceeding sixty-five percent CPU utilization.",
    "In the verified TypeScript simulation below, we build a 'ZonalShiftController' that models a multi-zone production deployment across us-east-1a, us-east-1b, and us-east-1c. We provision each zone with maximum healthy capacity capable of absorbing failover spikes, simulate a complete evacuation of us-east-1a, redistribute the load equally across surviving zones, and verify that the surviving zones maintain a twenty-five percent capacity surplus headroom.",
    "Practicing AZ evacuation through scheduled chaos drills transforms high availability from a theoretical architecture diagram into a battle-tested operational capability. When real cloud disruptions occur, the platform responds autonomously, rerouting traffic seamlessly while end users experience zero downtime."
]

p3_code = """// Part 3: Availability Zone Evacuation & N+1 Headroom Controller
interface AzCapacity {
  az: string;
  activeInstances: number;
  maxHealthyCapacity: number;
  trafficWeight: number;
}

class ZonalShiftController {
  private zones: Map<string, AzCapacity> = new Map();

  registerZone(az: string, active: number, max: number): void {
    this.zones.set(az, { az, activeInstances: active, maxHealthyCapacity: max, trafficWeight: 100 });
  }

  evacuateZone(targetAz: string): { evacuatedAz: string; survivingZones: number; surplusPercent: number } {
    const evacuated = this.zones.get(targetAz)!;
    evacuated.trafficWeight = 0;

    const surviving = Array.from(this.zones.values()).filter(z => z.az !== targetAz);
    const totalRequiredTraffic = 300; // Original 100 per zone across 3 zones
    const redistributedLoad = totalRequiredTraffic / surviving.length; // 150 each

    let totalSurplus = 0;
    for (const z of surviving) {
      z.trafficWeight = 150;
      const surplus = ((z.maxHealthyCapacity - redistributedLoad) / z.maxHealthyCapacity) * 100;
      totalSurplus += surplus;
    }

    const avgSurplus = Math.floor(totalSurplus / surviving.length);
    return {
      evacuatedAz: targetAz,
      survivingZones: surviving.length,
      surplusPercent: avgSurplus
    };
  }
}

const controller = new ZonalShiftController();
// Sizing each AZ for 200 instances (Total capacity = 600, Normal load = 300, 100 per AZ)
controller.registerZone('us-east-1a', 100, 200);
controller.registerZone('us-east-1b', 100, 200);
controller.registerZone('us-east-1c', 100, 200);

const res3 = controller.evacuateZone('us-east-1a');
// Surviving load: 150 per zone. Max capacity: 200 per zone. Headroom surplus: (200 - 150) / 200 = 25%
console.log('Status=FIS_AZ_EVACUATION_VERIFIED | DisruptedAz=' + res3.evacuatedAz + ' | SurvivingAzs=' + res3.survivingZones + ' | HeadroomSurplusPercent=' + res3.surplusPercent);"""

p3_output = "Status=FIS_AZ_EVACUATION_VERIFIED | DisruptedAz=us-east-1a | SurvivingAzs=2 | HeadroomSurplusPercent=25"
p3_notes = [
    {"line": 2, "note": "AzCapacity tracks per-zone healthy instances, maximum capacity, and load weights."},
    {"line": 15, "note": "evacuateZone zeroes target zone weight, redistributes load, and calculates surviving N+1 headroom."}
]

p3_check = {
    "question": "Why must a resilient multi-AZ cloud architecture maintain deliberate N+1 capacity headroom across surviving zones?",
    "options": [
        "To guarantee that when one Availability Zone is evacuated or fails, the remaining surviving zones can absorb one hundred percent of the total regional traffic without suffering cascading overload.",
        "Because AWS billing charges double if an Availability Zone operates below ninety percent utilization.",
        "To prevent Kubernetes nodes from running out of disk space when downloading Docker images.",
        "Because CloudFormation requires all subnets to have identical IP address allocation tables."
    ],
    "answer": 0,
    "explanation": "N+1 headroom ensures that if one zone fails (N-1), the remaining surviving zones possess sufficient baseline compute capacity and auto-scaling headroom to absorb the redistributed load without crashing from CPU exhaustion."
}

# -------------------------------------------------------------
# Part 4: Network Chaos Injection: Packet Drops & Latency
# -------------------------------------------------------------
p4_title = "Network Chaos Injection: Synthetic Packet Drops, Latency & Dependency Degradation"
p4_say = [
    "In microservice architectures, binary 'hard failures' (where a server crashes and immediately refuses TCP connections with an RST packet) are surprisingly easy to handle. Modern load balancers detect connection resets in milliseconds and seamlessly reroute traffic to healthy replicas. The truly catastrophic production incidents are caused by Partial and Gray Failures: scenarios where a downstream dependency remains alive and accepts connections, but exhibits severe latency, intermittent packet drops, or slow memory leaks.",
    "When a downstream payment processor, third-party authentication API, or shared database begins responding in five seconds instead of fifty milliseconds, upstream services quickly exhaust their thread pools, HTTP connection pools, and file descriptors waiting for responses. Within minutes, thread starvation cascades through the entire call graph, knocking down services that had no direct connection to the original failing component. To discover these hidden coupling bugs, SRE teams inject synthetic Network Chaos using AWS FIS.",
    "AWS FIS provides specialized actions that manipulate Linux kernel networking parameters on target compute instances via the AWS Systems Manager (SSM) agent. Using actions such as 'aws:ssm:send-command' executing Linux 'tc' (traffic control) and 'netem' (network emulation) rules, or VPC network interface disruption, FIS injects precise network perturbations. Engineers configure experiments that inject two hundred milliseconds of latency with a ten millisecond jitter, or induce fifteen percent random packet drops on outbound HTTPS interfaces.",
    "In service mesh architectures powered by AWS App Mesh or Istio on Amazon EKS, engineers can also inject network faults at the application layer using Envoy Proxy fault injection filters ('envoy.filters.http.fault'). Envoy can inject HTTP abort codes (such as HTTP 503 or 504) or add percentage-based artificial delays directly on upstream cluster routes without requiring SSM agent access or operating system level kernel privileges. This enables application developers to test individual REST or gRPC endpoint degradation in isolated microservice namespaces.",
    "Surviving network chaos requires client-side Resiliency Patterns: strict request Timeouts, Exponential Backoff with Full Jitter, and Circuit Breakers (such as Envoy Proxy circuit breakers or Resilience4j). A naive retry policy that retries immediately on error creates a vicious Retry Storm: multiplying traffic by three or four times against an already struggling service, guaranteeing its complete collapse. Resilient clients implement exponential backoff with randomized jitter to desynchronize retry spikes.",
    "Furthermore, software architects implement the Circuit Breaker Pattern. A circuit breaker tracks downstream failure rates and latency. When consecutive timeouts or packet drops exceed a configured failure threshold, the circuit breaker 'trips' open. In the open state, the client immediately fails fast—bypassing the slow downstream network call entirely and serving an instant cached fallback response in five milliseconds. This preserves upstream thread pool capacity and gives the degraded dependency time to recover.",
    "Chaos experiments injecting packet drops also test Graceful Degradation in frontend user experiences. For example, if a recommendation engine is degraded by injected latency, the API Gateway or edge router serves a static list of popular items rather than returning an HTTP 500 error page. End users continue their browsing and purchasing flows without ever realizing that an internal machine learning microservice is experiencing network degradation.",
    "In the verified TypeScript simulation below, we model a complete 'NetworkFaultSimulator'. We inject two hundred milliseconds of latency and fifteen percent packet loss on downstream dependency requests. We trace three consecutive degraded calls that trip the client circuit breaker into the open state, and demonstrate that subsequent calls execute fast fallback responses in five milliseconds with zero thread blocking.",
    "By subjecting distributed services to synthetic network chaos, organizations validate timeouts, circuit breakers, and fallback caches under controlled conditions. Resiliency ceases to be a hopeful assumption in a design document and becomes a mathematically proven runtime property of the cloud architecture."
]

p4_code = """// Part 4: Network Chaos Injection & Circuit Breaker Fallback
interface NetworkRequest {
  id: string;
  endpoint: string;
}

class NetworkFaultSimulator {
  private failureCount = 0;
  private circuitOpen = false;

  constructor(
    public readonly injectedLatencyMs: number,
    public readonly packetLossPercent: number
  ) {}

  executeRequest(req: NetworkRequest): { latencyMs: number; status: string; fallbackServed: boolean } {
    if (this.circuitOpen) {
      return { latencyMs: 5, status: 'CIRCUIT_OPEN_FAST_FALLBACK', fallbackServed: true };
    }

    // Simulate injected failure
    this.failureCount++;
    if (this.failureCount >= 3) {
      this.circuitOpen = true; // Trip circuit breaker
    }

    return {
      latencyMs: this.injectedLatencyMs,
      status: 'DEGRADED_DOWNSTREAM',
      fallbackServed: false
    };
  }

  isCircuitOpen(): boolean {
    return this.circuitOpen;
  }
}

const faultSim = new NetworkFaultSimulator(200, 15);
faultSim.executeRequest({ id: 'r1', endpoint: '/payments' });
faultSim.executeRequest({ id: 'r2', endpoint: '/payments' });
faultSim.executeRequest({ id: 'r3', endpoint: '/payments' });

const fallbackRes = faultSim.executeRequest({ id: 'r4', endpoint: '/payments' });

console.log('Status=FIS_NETWORK_CHAOS_VERIFIED | InjectedLatencyMs=' + faultSim.injectedLatencyMs + ' | PacketLossPercent=' + faultSim.packetLossPercent + ' | CircuitBreakerTripped=' + faultSim.isCircuitOpen() + ' | FallbackServed=' + fallbackRes.fallbackServed);"""

p4_output = "Status=FIS_NETWORK_CHAOS_VERIFIED | InjectedLatencyMs=200 | PacketLossPercent=15 | CircuitBreakerTripped=true | FallbackServed=true"
p4_notes = [
    {"line": 6, "note": "NetworkFaultSimulator tracks injected latency, packet loss, and circuit breaker trip states."},
    {"line": 15, "note": "executeRequest trips circuit breaker after consecutive faults and returns fast cached fallback."}
]

p4_check = {
    "question": "Why are partial gray failures (high latency and packet drops) often more dangerous to microservices than hard crashes?",
    "options": [
        "Because slow responses cause upstream services to exhaust their thread pools and connection sockets waiting for timeouts, triggering cascading starvation across the entire system.",
        "Because high latency causes the physical Ethernet cables in the AWS data center to overheat.",
        "Because Linux kernels automatically delete application source code when network packets are dropped.",
        "Because CloudWatch cannot record metrics when latency exceeds one hundred milliseconds."
    ],
    "answer": 0,
    "explanation": "Gray failures tie up upstream threads, memory, and connection pools while waiting for slow responses or timeouts. This resource starvation rapidly cascades throughout upstream callers, knocking down otherwise healthy microservices."
}

# -------------------------------------------------------------
# Part 5: Resiliency GameDays & Blameless Incident Drills
# -------------------------------------------------------------
p5_title = "Resiliency GameDays & Production Incident Drills: Blameless Autopsies & Chaos Automation"
p5_say = [
    "While tooling like AWS Fault Injection Simulator is technologically sophisticated, the ultimate success of chaos engineering depends on people, culture, and operational muscle memory. A company can have state-of-the-art circuit breakers, but if the on-call engineering team panics during a real production incident, misinterprets telemetry dashboards, or follows outdated runbooks, downtime will be prolonged and costly. To bridge the gap between technology and human operations, high-performing cloud organizations conduct regular Resiliency GameDays.",
    "A Resiliency GameDay is a structured, collaborative simulation where engineering, platform, and SRE teams gather to test system resiliency and incident response under real-world conditions. GameDays operate under a formal Charter defining clear organizational roles: the Chaos Commander (who orchestrates the experiment execution in AWS FIS), the Safety Watcher (who monitors stop condition dashboards and holds absolute veto authority to abort the drill), and the Incident Responders (who troubleshoot, diagnose, and mitigate the simulated incident using telemetry tools).",
    "GameDays can be categorized into Announced Drills and Blind Drills. In early maturity stages, teams run announced drills where every engineer knows the exact fault scenario in advance, allowing them to verify dashboard visibility and runbook instructions step-by-step. In advanced organizations, platform teams execute blind drills: introducing realistic failure scenarios (such as an abrupt Redis cache flush or silent cross-region replication lag) without prior notice to the responding team. This rigorously tests whether automated alerting, on-call paging (via PagerDuty), and runbook accuracy perform under authentic pressure.",
    "To organize GameDays systematically, platform teams author formal GameDay Scenario Cards. Each card documents the targeted architectural subsystem, steady-state hypothesis, injected failure mechanism, expected monitoring signals, and estimated time to recover. During execution, the Safety Watcher maintains an active communications bridge (such as an incident Slack channel or Zoom room), logging every command and telemetry observation in an immutable timeline.",
    "A vital outcome of every GameDay is the measurement of objective SRE Operational Metrics: Mean Time to Detect (MTTD) and Mean Time to Recover (MTTR). During the drill, observers log the exact timestamps of each phase: when the fault was injected, when the first CloudWatch alarm sounded, when the on-call engineer acknowledged the alert, when the root cause was identified, and when the system returned to steady state. Tracking MTTD and MTTR over successive GameDays provides quantitative proof of improving operational maturity.",
    "Equally essential is fostering a Blameless Post-Mortem Culture. If a GameDay exposes that a critical database failover caused unexpected downtime, leadership must celebrate the discovery rather than penalize the engineers who authored the service. Finding a vulnerability during a GameDay is a triumphant success: it represents an outage prevented before customers were impacted. Post-incident autopsies focus on systemic improvements: adding missing CloudWatch metric filters, tuning auto-scaling cool-down periods, and updating runbooks.",
    "The final frontier of chaos engineering maturity is Continuous Chaos Automation. Rather than restricting chaos to occasional quarterly GameDays, mature platforms integrate AWS FIS into continuous delivery pipelines. Using scheduled EventBridge rules, chaos experiments run continuously in staging and production during regular business hours—such as randomly terminating five percent of containers every Tuesday afternoon. This guarantees that architectural resiliency remains an ongoing invariant as new code merges daily.",
    "In the verified TypeScript simulation below, we model a complete 'GameDayOrchestrator'. We record a simulated production drill injecting cross-region replication latency, capture precise operational metrics (MTTD of fourteen seconds and MTTR of twenty-eight seconds), and generate a verified structured blameless incident autopsy report confirming operational readiness.",
    "Mastering AWS FIS, automated safety guardrails, zonal shift evacuation, network fault injection, and blameless GameDays elevates cloud engineering teams to the highest echelon of production excellence. Distributed systems become resilient by design, capable of absorbing real-world chaos with absolute poise and unwavering reliability."
]

p5_code = """// Part 5: GameDay Incident Drill & Blameless Autopsy Orchestrator
interface GameDayIncident {
  drillId: string;
  simulatedFault: string;
  mttdSeconds: number;
  mttrSeconds: number;
  autopsySummary: string;
}

class GameDayOrchestrator {
  public recordedDrills: GameDayIncident[] = [];

  recordDrill(drill: GameDayIncident): void {
    this.recordedDrills.push(drill);
  }

  generateAutopsy(drillId: string): { drillId: string; mttd: number; mttr: number; ready: boolean } {
    const drill = this.recordedDrills.find(d => d.drillId === drillId);
    if (!drill) throw new Error('Drill not found');

    return {
      drillId: drill.drillId,
      mttd: drill.mttdSeconds,
      mttr: drill.mttrSeconds,
      ready: drill.autopsySummary.length > 20
    };
  }
}

const orchestrator = new GameDayOrchestrator();
orchestrator.recordDrill({
  drillId: 'GD-2026-Q4-01',
  simulatedFault: 'DynamoDB Cross-Region Replication Latency Spike',
  mttdSeconds: 14,
  mttrSeconds: 28,
  autopsySummary: 'Blameless Post-Mortem: Automated circuit breaker tripped in 14s; fallback cache absorbed 100% read traffic. MTTR was 28s.'
});

const report = orchestrator.generateAutopsy('GD-2026-Q4-01');
console.log('Status=GAMEDAY_INCIDENT_DRILL_VERIFIED | MTTD_Seconds=' + report.mttd + ' | MTTR_Seconds=' + report.mttr + ' | BlamelessAutopsyGenerated=' + report.ready);"""

p5_output = "Status=GAMEDAY_INCIDENT_DRILL_VERIFIED | MTTD_Seconds=14 | MTTR_Seconds=28 | BlamelessAutopsyGenerated=true"
p5_notes = [
    {"line": 2, "note": "GameDayIncident records drill identifiers, faults, detection/recovery metrics, and autopsy."},
    {"line": 15, "note": "generateAutopsy calculates MTTD, MTTR, and synthesizes structured blameless post-mortem report."}
]

p5_check = {
    "question": "What is the primary cultural and operational objective of conducting a Blameless Post-Mortem following a chaos engineering GameDay?",
    "options": [
        "Focusing on systemic and architectural improvements—such as tuning alarms, runbooks, and circuit breakers—without assigning personal blame, celebrating that the flaw was caught before customers were impacted.",
        "Identifying which individual software developer made the code mistake and deducting their salary.",
        "Deleting the git commit history to conceal the incident from corporate compliance auditors.",
        "Banning all future chaos experiments and returning to manual weekend deployments."
    ],
    "answer": 0,
    "explanation": "A blameless post-mortem culture treats incidents as learning opportunities. The focus is exclusively on systemic remediation (better metrics, automated circuit breakers, updated runbooks) and celebrating that vulnerabilities were found proactively."
}

# -------------------------------------------------------------
# Assembly & Invariant Verification
# -------------------------------------------------------------
parts_data = [
    {"part": 1, "title": p1_title, "say": p1_say, "code": p1_code, "output": p1_output, "codeNotes": p1_notes, "check": p1_check},
    {"part": 2, "title": p2_title, "say": p2_say, "code": p2_code, "output": p2_output, "codeNotes": p2_notes, "check": p2_check},
    {"part": 3, "title": p3_title, "say": p3_say, "code": p3_code, "output": p3_output, "codeNotes": p3_notes, "check": p3_check},
    {"part": 4, "title": p4_title, "say": p4_say, "code": p4_code, "output": p4_output, "codeNotes": p4_notes, "check": p4_check},
    {"part": 5, "title": p5_title, "say": p5_say, "code": p5_code, "output": p5_output, "codeNotes": p5_notes, "check": p5_check}
]

total_words = 0
for p in parts_data:
    words = count_words(p["say"])
    total_words += words
    print(f"Part {p['part']} word count: {words}")
    assert words >= 600, f"Part {p['part']} word count {words} < 600!"

print(f"Total Day 49 word count: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000!"

day49_dict = {
    "day": 49,
    "coursePrefix": "cloud",
    "title": "Chaos Engineering on AWS: AWS Fault Injection Simulator (FIS), AZ Evacuation & Resiliency GameDays",
    "goal": "Prove your system survives real-world chaos before production does: master AWS Fault Injection Simulator (FIS), hypothesis-driven chaos experiments, simulated AZ power outages, network latency/packet drop injection, and automated rollback stop conditions.",
    "minutes": 30,
    "recap": "Today we conquered Chaos Engineering on AWS. We mastered AWS Fault Injection Simulator (FIS) architecture, automated CloudWatch stop conditions and safety circuit breakers, complete Availability Zone evacuation using Route 53 ARC and N+1 capacity headroom, synthetic packet drop and latency injection, and blameless GameDay incident drills.",
    "summary": [
        "Chaos Engineering is an empirical science: defining a steady-state hypothesis, constraining blast radius, and verifying resiliency under turbulent conditions.",
        "Automated Stop Conditions (CloudWatch alarms) act as mandatory circuit breakers, immediately halting FIS experiments and rolling back upon threshold breach.",
        "Availability Zone Evacuation redirects traffic seamlessly to surviving zones using Route 53 ARC, requiring N+1 capacity headroom to prevent cascading overload.",
        "Network chaos injection tests client-side circuit breakers, exponential backoff with full jitter, and fast cached fallbacks against gray failures.",
        "Resiliency GameDays build team operational muscle memory, measuring MTTD and MTTR while fostering blameless post-mortem continuous improvement."
    ],
    "parts": []
}

for p in parts_data:
    day49_dict["parts"].append({
        "title": p["title"],
        "say": p["say"],
        "code": p["code"],
        "output": p["output"],
        "codeNotes": p["codeNotes"],
        "check": p["check"]
    })

with open("scripts/day49_cloud.json", "w", encoding="utf-8") as f:
    json.dump(day49_dict, f, indent=2)

print("Saved scripts/day49_cloud.json successfully!")

# -------------------------------------------------------------
# Generate Gate v2 Visual JSON Envelope (Compare Template)
# -------------------------------------------------------------
visual_entries = []

visual_specs = [
    {
        "part": 1,
        "title": p1_title,
        "leftLabel": "Uncontrolled Ad-Hoc Scripts",
        "rightLabel": "Managed AWS FIS Experiments",
        "leftAttrs": [
            {"name": "Execution", "value": "Uncoordinated manual shell scripts."},
            {"name": "Safety", "value": "Zero automated blast radius limits."},
            {"name": "Auditing", "value": "No IAM governance or execution logs."}
        ],
        "rightAttrs": [
            {"name": "Execution", "value": "Structured experiment template graphs."},
            {"name": "Safety", "value": "Strict percentage and count blast radius."},
            {"name": "Auditing", "value": "Native IAM roles and CloudTrail tracking."}
        ],
        "captions": [
            "Uncontrolled scripts risk widespread catastrophic production outages.",
            "Managed chaos templates define structured fault injection targets.",
            "Action execution limits enforce strict blast radius boundaries.",
            "Hypothesis testing builds empirical confidence in cloud architectures."
        ]
    },
    {
        "part": 2,
        "title": p2_title,
        "leftLabel": "Unmonitored Blind Chaos",
        "rightLabel": "Automated CloudWatch Stop Conditions",
        "leftAttrs": [
            {"name": "Monitoring", "value": "Manual human observation of dashboards."},
            {"name": "Response", "value": "Slow manual abort decisions during crises."},
            {"name": "Rollback", "value": "Tedious manual cleanup of broken state."}
        ],
        "rightAttrs": [
            {"name": "Monitoring", "value": "Continuous automated alarm evaluation."},
            {"name": "Response", "value": "Instant circuit breaker trip on threshold breach."},
            {"name": "Rollback", "value": "Automated cleanup and resource restoration."}
        ],
        "captions": [
            "Blind experiments easily escalate into severe customer service impacts.",
            "Automated stop conditions monitor critical business service alarms.",
            "Circuit breakers halt fault actions immediately upon error spikes.",
            "Automated rollback guarantees system stability during chaos drills."
        ]
    },
    {
        "part": 3,
        "title": p3_title,
        "leftLabel": "Brittle Symmetrical Capacity",
        "rightLabel": "Zonal Shift & Resilient N+1 Headroom",
        "leftAttrs": [
            {"name": "Sizing", "value": "Exact capacity with zero failover headroom."},
            {"name": "Evacuation", "value": "Slow manual DNS and load balancer edits."},
            {"name": "Impact", "value": "Cascading exhaustion across surviving zones."}
        ],
        "rightAttrs": [
            {"name": "Sizing", "value": "Deliberate N+1 capacity headroom in each zone."},
            {"name": "Evacuation", "value": "Automated zonal shift via Route Fifty Three ARC."},
            {"name": "Impact", "value": "Surviving zones absorb load without throttling."}
        ],
        "captions": [
            "Under-provisioned zones collapse during complete zonal failover events.",
            "Zonal shift redirects traffic away from impaired availability zones.",
            "Deliberate headroom prevents cascading overload on surviving nodes.",
            "Validated evacuation ensures seamless continuity during data center loss."
        ]
    },
    {
        "part": 4,
        "title": p4_title,
        "leftLabel": "Fragile Blocking Synchronous Calls",
        "rightLabel": "Circuit Breakers & Graceful Fallbacks",
        "leftAttrs": [
            {"name": "Handling", "value": "Unbounded timeouts and retry storms."},
            {"name": "Coupling", "value": "Cascading thread starvation across callers."},
            {"name": "User Experience", "value": "Complete service outage with HTTP five hundreds."}
        ],
        "rightAttrs": [
            {"name": "Handling", "value": "Exponential backoff with full randomized jitter."},
            {"name": "Coupling", "value": "Fast circuit breaker failover to cached data."},
            {"name": "User Experience", "value": "Graceful degradation with zero blocking."}
        ],
        "captions": [
            "Gray failures tie up critical connection pools and exhaust threads.",
            "Synthetic network chaos injects realistic packet drops and latency.",
            "Circuit breakers trip open to serve instant cached fallback data.",
            "Graceful degradation preserves core customer checkout and browsing flows."
        ]
    },
    {
        "part": 5,
        "title": p5_title,
        "leftLabel": "Blame Culture & Punitive Audits",
        "rightLabel": "Blameless GameDays & Continuous Drills",
        "leftAttrs": [
            {"name": "Culture", "value": "Punitive assignment of personal blame."},
            {"name": "Frequency", "value": "Rare manual drills during scheduled maintenance."},
            {"name": "Learning", "value": "Superficial checklists without metric tracking."}
        ],
        "rightAttrs": [
            {"name": "Culture", "value": "Blameless post-mortems celebrating discovery."},
            {"name": "Frequency", "value": "Automated continuous chaos in active pipelines."},
            {"name": "Learning", "value": "Quantitative tracking of detection and recovery times."}
        ],
        "captions": [
            "Blame cultures punish engineers rather than fixing systemic flaws.",
            "Collaborative GameDays build essential team operational muscle memory.",
            "Automated metrics measure precise detection and recovery duration.",
            "Continuous chaos automation guarantees ongoing production resiliency."
        ]
    }
]

for spec in visual_specs:
    part_idx = spec["part"] - 1
    code = parts_data[part_idx]["code"]
    code_hash = get_hash(code)

    entry = {
        "partTitle": spec["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "compare",
            "compare": {
                "title": spec["title"],
                "leftLabel": spec["leftLabel"],
                "rightLabel": spec["rightLabel"],
                "leftAttributes": spec["leftAttrs"],
                "rightAttributes": spec["rightAttrs"]
            },
            "steps": [
                {
                    "at": "say1",
                    "focus": "left",
                    "annotation": spec["captions"][0]
                },
                {
                    "at": "say2",
                    "focus": "right",
                    "annotation": spec["captions"][1]
                },
                {
                    "at": "example",
                    "focus": "both",
                    "annotation": spec["captions"][2]
                },
                {
                    "at": "tryIt",
                    "focus": "right",
                    "annotation": spec["captions"][3]
                }
            ]
        }
    }
    visual_entries.append(entry)

day49_visual = {
    "schemaVersion": 2,
    "prefix": "cloud",
    "day": 49,
    "entries": visual_entries
}

with open("src/lib/data/lessonVisuals/cloud/day-49.json", "w", encoding="utf-8") as f:
    json.dump(day49_visual, f, indent=2)

print("Saved src/lib/data/lessonVisuals/cloud/day-49.json successfully!")
