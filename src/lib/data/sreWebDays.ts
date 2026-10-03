import { DayConfig } from './curriculumEnricher';

/**
 * Multi-Cloud Reliability & SRE in TypeScript (course-sre-web, prefix: sre-web):
 * 30 course days covering SLIs/SLOs/SLAs, error budgets and burn rates,
 * availability math (serial and parallel), composite availability, infrastructure
 * as code as data (plan/diff/apply of resource maps, drift detection),
 * multi-region and failover planning, load balancing algorithms (round-robin,
 * weighted, least-connections, consistent hashing), health checks (liveness,
 * readiness, startup probes), retries with exponential backoff and jitter,
 * circuit breakers (closed/open/half-open states), bulkheads and timeout
 * isolation, observability pillars (metrics, logs, traces), percentile math
 * (p50/p95/p99), histogram bucketing, structured log parsing and correlation,
 * distributed trace spans and context propagation, alert rules and noise
 * reduction (burn-rate alerting), incident response (severity levels, timelines,
 * MTTD/MTTR), blameless postmortems (five whys, action items), capacity planning
 * and queuing theory (Little's Law), cost modeling (reserved vs on-demand,
 * spot instances), chaos experiments (failure injection, steady-state hypothesis),
 * deployment strategies (blue/green, canary analysis, rolling updates), runbooks
 * as code (decision trees, automation playbooks), and the final capstone:
 * a multi-cloud reliability scorecard.
 *
 * Practice tasks are in sreWeb30DayData.ts; lessons in sreWebLongLessons.ts.
 */
export const SRE_DAYS: DayConfig[] = [
  {
    "day": 1,
    "title": "SLIs, SLOs & the Service Level Contract Hierarchy",
    "desc": "Define Service Level Indicators (SLIs), Service Level Objectives (SLOs), and Service Level Agreements (SLAs), and understand the precision hierarchy from measurement to business contract.",
    "syllabus": [
      "SLI Definition: Measurable indicators of service health (latency, availability, throughput, error rate).",
      "SLO Targets: Internal reliability objectives expressed as percentages over rolling windows.",
      "SLA Contracts: External binding agreements with financial penalties for SLO breaches."
    ]
  },
  {
    "day": 2,
    "title": "Error Budgets, Burn Rates & Reliability Trade-offs",
    "desc": "Calculate error budgets from SLO targets, measure burn rates to detect accelerated failure consumption, and balance reliability investment against feature velocity.",
    "syllabus": [
      "Error Budget Formula: Budget = 1 - SLO target (e.g., 99.9% SLO → 0.1% error budget = 43.2 min/month).",
      "Burn Rate Calculation: Current error rate / allowed error rate over the budget window.",
      "Budget Policies: Freeze deployments when burn rate exceeds threshold; resume when budget recovers."
    ]
  },
  {
    "day": 3,
    "title": "Availability Math: Serial, Parallel & Composite Systems",
    "desc": "Compute end-to-end availability for serial dependency chains and parallel redundancy configurations, and model composite multi-tier system reliability.",
    "syllabus": [
      "Serial Availability: A_total = A1 × A2 × ... × An (each dependency reduces overall availability).",
      "Parallel Availability: A_total = 1 - (1 - A1) × (1 - A2) (redundancy increases availability).",
      "Composite Systems: Combining serial and parallel blocks to model real-world architectures."
    ]
  },
  {
    "day": 4,
    "title": "Uptime Windows, Downtime Budgets & Nines Conversion",
    "desc": "Convert between nines of availability (99.9%, 99.99%, 99.999%) and concrete downtime windows per day, month, and year.",
    "syllabus": [
      "Nines Table: 99.9% = 8.76h/year, 99.99% = 52.6min/year, 99.999% = 5.26min/year.",
      "Rolling Window SLOs: Calculating allowed downtime over 7-day and 30-day rolling windows.",
      "Downtime Budget Allocation: Distributing planned maintenance across quarterly windows."
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: SRE Reliability Calculator (SLI/SLO/Error Budget Engine)",
    "desc": "Build a complete SRE calculator that computes SLOs from SLIs, derives error budgets, calculates burn rates, and determines budget exhaustion timelines.",
    "syllabus": [
      "SLO Engine: Accept SLI measurements and compute SLO compliance percentages.",
      "Error Budget Tracker: Calculate remaining budget, burn rate, and estimated exhaustion time.",
      "Budget Policy Engine: Determine deployment freeze/resume decisions based on burn rate thresholds."
    ]
  },
  {
    "day": 6,
    "title": "Infrastructure as Data: Resource Maps, Plan & Diff",
    "desc": "Model infrastructure state as declarative resource maps, implement plan/diff operations to detect desired-state changes, and generate execution plans.",
    "syllabus": [
      "Desired State Model: Representing infrastructure as typed resource maps (Record<id, ResourceSpec>).",
      "Plan/Diff Algorithm: Comparing current state vs desired state to produce create/update/delete operations.",
      "Execution Plan Ordering: Topological sorting of resource dependencies for safe apply order."
    ]
  },
  {
    "day": 7,
    "title": "Drift Detection & Configuration Reconciliation",
    "desc": "Detect configuration drift between declared infrastructure state and actual state, classify drift severity, and implement reconciliation strategies.",
    "syllabus": [
      "Drift Detection: Comparing live resource attributes against declared specifications field by field.",
      "Drift Classification: Categorizing drift as cosmetic, functional, or critical based on affected properties.",
      "Reconciliation Strategies: Auto-correct (overwrite live), alert-only, or manual-review based on severity."
    ]
  },
  {
    "day": 8,
    "title": "Multi-Region Architecture & Failover Planning",
    "desc": "Design multi-region deployment topologies, implement region health scoring, and build failover decision logic for active-passive and active-active configurations.",
    "syllabus": [
      "Active-Passive Failover: Primary serves all traffic; secondary takes over on primary failure detection.",
      "Active-Active Architecture: Both regions serve traffic simultaneously with geographic routing.",
      "Failover Decision Logic: Health score thresholds, failover cooldown timers, and split-brain prevention."
    ]
  },
  {
    "day": 9,
    "title": "DNS-Based Traffic Management & Geographic Routing",
    "desc": "Implement DNS-based traffic distribution strategies including weighted routing, latency-based routing, and geographic routing with failover fallbacks.",
    "syllabus": [
      "Weighted DNS Routing: Distributing traffic proportionally across endpoints by assigned weights.",
      "Latency-Based Routing: Directing users to the nearest healthy region based on measured latency.",
      "Failover Chains: Cascading DNS records that promote secondary endpoints when primaries fail health checks."
    ]
  },
  {
    "day": 10,
    "title": "⭐ MILESTONE 2: Multi-Region Failover Simulator",
    "desc": "Build a multi-region failover simulator that models region health, detects failures, executes failover decisions, and validates recovery time objectives (RTO).",
    "syllabus": [
      "Region Health Monitor: Track latency, error rate, and saturation per region with rolling averages.",
      "Failover Controller: Trigger failover when health score drops below threshold with cooldown enforcement.",
      "RTO Validation: Measure actual recovery time against declared RTO targets and report compliance."
    ]
  },
  {
    "day": 11,
    "title": "Load Balancing Algorithms: Round-Robin, Weighted & Least-Connections",
    "desc": "Implement core load balancing algorithms and understand their throughput, fairness, and latency trade-offs for distributing requests across backend servers.",
    "syllabus": [
      "Round-Robin: Cycling through servers in fixed order; simple but ignores server capacity differences.",
      "Weighted Round-Robin: Assigning capacity weights so stronger servers receive proportionally more traffic.",
      "Least-Connections: Routing to the server with fewest active connections for adaptive load distribution."
    ]
  },
  {
    "day": 12,
    "title": "Health Checks: Liveness, Readiness & Startup Probes",
    "desc": "Design multi-layer health check systems with liveness probes (is the process alive?), readiness probes (can it serve traffic?), and startup probes (has it finished initializing?).",
    "syllabus": [
      "Liveness Probes: Detect zombie processes; restart containers that are alive but not making progress.",
      "Readiness Probes: Gate traffic until dependencies (database, cache) are confirmed healthy.",
      "Startup Probes: Allow slow-starting applications a grace period before liveness checks begin."
    ]
  },
  {
    "day": 13,
    "title": "Retries with Exponential Backoff & Jitter",
    "desc": "Implement retry strategies with exponential backoff to avoid thundering herds, add jitter for desynchronization, and set maximum retry budgets.",
    "syllabus": [
      "Exponential Backoff Formula: delay = baseDelay × 2^attempt (1s, 2s, 4s, 8s, ...).",
      "Full Jitter: delay = random(0, baseDelay × 2^attempt) to decorrelate retrying clients.",
      "Retry Budgets: Limiting total retries per time window to prevent retry storms during outages."
    ]
  },
  {
    "day": 14,
    "title": "Circuit Breakers: Closed, Open & Half-Open States",
    "desc": "Implement the circuit breaker pattern with three states to protect services from cascading failures and allow automatic recovery probing.",
    "syllabus": [
      "Closed State: Requests flow normally; failures are counted against a threshold window.",
      "Open State: All requests are immediately rejected; a timeout timer starts for recovery probing.",
      "Half-Open State: A limited number of probe requests are allowed to test if the downstream has recovered."
    ]
  },
  {
    "day": 15,
    "title": "Bulkheads, Timeouts & Isolation Patterns",
    "desc": "Apply the bulkhead pattern to isolate failure domains, set per-operation timeouts to prevent resource exhaustion, and combine patterns for defense in depth.",
    "syllabus": [
      "Bulkhead Isolation: Partitioning connection pools so one failing dependency cannot exhaust all resources.",
      "Timeout Hierarchies: Setting cascading timeouts (client > gateway > service > database) to prevent hanging.",
      "Combined Resilience: Layering retries inside circuit breakers inside bulkheads for multi-level protection."
    ]
  },
  {
    "day": 16,
    "title": "Metrics Collection: Counters, Gauges & Histograms",
    "desc": "Instrument services with the three fundamental metric types: monotonic counters for totals, gauges for current values, and histograms for distribution analysis.",
    "syllabus": [
      "Counters: Monotonically increasing values (total requests, total errors) used to derive rates.",
      "Gauges: Point-in-time values (current connections, memory usage, queue depth) that can go up or down.",
      "Histograms: Bucketed observations (request durations) enabling percentile and distribution analysis."
    ]
  },
  {
    "day": 17,
    "title": "Percentile Math: p50, p95, p99 & Latency Analysis",
    "desc": "Calculate percentiles from observation data, understand why averages hide tail latency, and use percentile analysis to set meaningful SLOs.",
    "syllabus": [
      "Percentile Calculation: Sorting observations and finding the value at the Nth percentile rank.",
      "Tail Latency Impact: Why p99 matters more than average — 1% of users experience the worst performance.",
      "Histogram-to-Percentile: Estimating percentiles from bucketed histogram data using linear interpolation."
    ]
  },
  {
    "day": 18,
    "title": "Structured Logging, Log Parsing & Correlation IDs",
    "desc": "Build structured JSON logging pipelines, parse and extract fields from log entries, and use correlation IDs to trace requests across distributed services.",
    "syllabus": [
      "Structured Logging: Emitting JSON log lines with consistent fields (timestamp, level, service, traceId).",
      "Log Parsing: Extracting and filtering structured fields for aggregation and anomaly detection.",
      "Correlation IDs: Propagating a unique request identifier across service boundaries for end-to-end tracing."
    ]
  },
  {
    "day": 19,
    "title": "Distributed Traces: Spans, Context Propagation & Waterfall Analysis",
    "desc": "Model distributed trace spans with parent-child relationships, implement context propagation across service boundaries, and analyze waterfall timelines.",
    "syllabus": [
      "Trace and Span Model: A trace is a DAG of spans; each span has traceId, spanId, parentSpanId, start, duration.",
      "Context Propagation: Passing trace context (traceparent header) across HTTP calls and message queues.",
      "Waterfall Analysis: Visualizing span timelines to identify bottlenecks, serial calls, and parallelization opportunities."
    ]
  },
  {
    "day": 20,
    "title": "Alert Rules, Burn-Rate Alerting & Noise Reduction",
    "desc": "Design alert rules based on SLO burn rates, implement multi-window alerting for sensitivity tuning, and reduce alert fatigue with grouping and inhibition.",
    "syllabus": [
      "Burn-Rate Alerts: Triggering when error budget consumption rate exceeds 1× over a long window or 10× over a short window.",
      "Multi-Window Strategy: Combining fast (5-min) and slow (1-hour) windows to catch both spikes and sustained degradation.",
      "Alert Noise Reduction: Grouping related alerts, inhibiting downstream alerts during known outages, and setting minimum duration thresholds."
    ]
  },
  {
    "day": 21,
    "title": "Incident Response: Severity Levels, Timelines & MTTD/MTTR",
    "desc": "Define incident severity levels (SEV1-SEV4), build incident timelines with key milestones, and calculate Mean Time to Detect (MTTD) and Mean Time to Recover (MTTR).",
    "syllabus": [
      "Severity Classification: SEV1 (total outage) through SEV4 (cosmetic) with escalation rules and response SLAs.",
      "Incident Timeline: Tracking detection, triage, mitigation, resolution, and postmortem milestones with timestamps.",
      "MTTD/MTTR Metrics: Calculating detection and recovery times from incident data to measure operational maturity."
    ]
  },
  {
    "day": 22,
    "title": "Blameless Postmortems: Root Cause Analysis & Action Items",
    "desc": "Conduct blameless postmortems using the five-whys technique, identify contributing factors, and generate prioritized action items to prevent recurrence.",
    "syllabus": [
      "Five Whys Technique: Iteratively asking 'why' to trace symptoms back to systemic root causes.",
      "Contributing Factors: Identifying multiple contributing factors beyond a single root cause (human, process, tooling).",
      "Action Item Tracking: Generating prioritized, assignable action items with deadlines and verification criteria."
    ]
  },
  {
    "day": 23,
    "title": "Capacity Planning: Queuing Theory & Little's Law",
    "desc": "Apply queuing theory and Little's Law (L = λW) to predict system capacity requirements, model queue build-up under load, and plan scaling triggers.",
    "syllabus": [
      "Little's Law: L = λ × W (average items in system = arrival rate × average time in system).",
      "Capacity Headroom: Planning for peak load with headroom factor (e.g., 2× average for burst absorption).",
      "Scaling Triggers: Setting auto-scale thresholds based on queue depth, CPU utilization, and request latency."
    ]
  },
  {
    "day": 24,
    "title": "Cloud Cost Modeling: Reserved, On-Demand & Spot Pricing",
    "desc": "Build cost models comparing reserved, on-demand, and spot instance pricing strategies, calculate break-even points, and optimize cost-reliability trade-offs.",
    "syllabus": [
      "Reserved vs On-Demand: Calculating break-even utilization for committed-use discounts (typically 40-60% savings).",
      "Spot Instance Economics: Modeling cost savings with interruption risk and implementing graceful preemption handling.",
      "Cost Allocation: Tagging resources by team/service, building per-service unit economics (cost per request)."
    ]
  },
  {
    "day": 25,
    "title": "⭐ MILESTONE 3: Observability & Incident Management Platform",
    "desc": "Build a comprehensive observability platform that collects metrics, correlates logs and traces, evaluates alert rules, manages incidents, and produces postmortem reports.",
    "syllabus": [
      "Metrics Pipeline: Ingest counters, gauges, and histograms; compute rates and percentiles over sliding windows.",
      "Incident Lifecycle: Automated severity classification, escalation, timeline tracking, and MTTD/MTTR computation.",
      "Postmortem Generator: Automated five-whys analysis, contributing factor identification, and action item templating."
    ]
  },
  {
    "day": 26,
    "title": "Chaos Engineering: Failure Injection & Steady-State Hypothesis",
    "desc": "Design chaos experiments with steady-state hypotheses, inject controlled failures (latency, errors, resource exhaustion), and validate system resilience.",
    "syllabus": [
      "Steady-State Hypothesis: Defining measurable normal behavior (e.g., p99 latency < 200ms, error rate < 0.1%).",
      "Failure Injection Types: Latency injection, error injection, resource exhaustion, network partition simulation.",
      "Experiment Evaluation: Comparing steady-state metrics before and during chaos to verify resilience or discover weaknesses."
    ]
  },
  {
    "day": 27,
    "title": "Deployment Strategies: Blue/Green, Canary & Rolling Updates",
    "desc": "Implement blue/green deployments for instant rollback, canary releases with progressive traffic shifting, and rolling updates with health-gated progression.",
    "syllabus": [
      "Blue/Green Deployment: Running two identical environments; switching traffic atomically via load balancer.",
      "Canary Analysis: Shifting 1% → 5% → 25% → 100% traffic with automated metric comparison at each stage.",
      "Rolling Updates: Replacing instances one-at-a-time with health checks gating each step; automatic rollback on failure."
    ]
  },
  {
    "day": 28,
    "title": "Canary Analysis: Statistical Comparison & Auto-Promotion",
    "desc": "Build automated canary analysis that statistically compares canary metrics against baseline, determines promotion or rollback, and enforces minimum observation windows.",
    "syllabus": [
      "Metric Comparison: Computing error rate delta and latency delta between canary and baseline cohorts.",
      "Statistical Thresholds: Setting maximum acceptable degradation (e.g., error rate increase < 0.5%, p99 increase < 10%).",
      "Auto-Promotion Pipeline: Automated promote/rollback decisions with configurable observation windows and approval gates."
    ]
  },
  {
    "day": 29,
    "title": "Runbooks as Code: Decision Trees & Automation Playbooks",
    "desc": "Encode operational runbooks as executable decision trees, automate diagnostic and remediation steps, and validate runbook completeness against incident types.",
    "syllabus": [
      "Decision Tree Model: Encoding diagnostic steps as condition → action nodes with branching logic.",
      "Automated Remediation: Executing safe automated actions (restart, scale-up, failover) when conditions match.",
      "Runbook Coverage: Mapping runbooks to incident types and alerting on coverage gaps for new failure modes."
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Multi-Cloud Reliability Scorecard with SLO Compliance, Chaos Validation & Deployment Safety",
    "desc": "Final Capstone Synthesis: Build a complete multi-cloud reliability scorecard that evaluates SLO compliance, error budget health, chaos experiment results, deployment safety scores, incident response maturity, and produces an overall reliability grade.",
    "syllabus": [
      "SLO Compliance Scoring: Evaluating each service's SLO adherence, error budget remaining, and burn rate trends.",
      "Chaos Resilience Score: Aggregating chaos experiment pass/fail results into a resilience confidence percentage.",
      "Reliability Grade: Computing a weighted composite score (SLO compliance + chaos resilience + incident maturity + deployment safety) and assigning an overall grade (A-F)."
    ]
  }
];
