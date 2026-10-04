import { DayConfig } from './curriculumEnricher';

/**
 * Cloud Native Architectures (AWS) (course-cloud-native, prefix: cloud):
 * 30 course days covering AWS global infrastructure, IAM access control,
 * VPC networking, EC2 compute, S3 storage, RDS/DynamoDB databases,
 * Serverless Lambda & API Gateway, ECS/EKS containerization, CloudWatch monitoring,
 * and CloudFormation/Terraform Infrastructure as Code.
 *
 * Practice tasks are in cloud30DayData.ts; lessons in cloudWebLongLessons.ts.
 */
export const CLOUD_DAYS: DayConfig[] = [
  {
    "day": 1,
    "title": "Cloud Computing Models (IaaS, PaaS, SaaS) & Shared Responsibility",
    "desc": "Compare infrastructure, platform, and software models and total cost of ownership under the AWS Shared Responsibility Model.",
    "syllabus": [
      "IaaS vs PaaS vs SaaS: EC2 vs Elastic Beanstalk vs Amazon WorkMail.",
      "AWS Shared Responsibility Model: Security OF the Cloud (AWS) vs Security IN the Cloud (Customer).",
      "Total Cost of Ownership (TCO) & Capital Expenditure (CapEx) to Operational Expenditure (OpEx)."
    ]
  },
  {
    "day": 2,
    "title": "AWS Global Infrastructure, Regions & Availability Zones",
    "desc": "Understand AWS Regions, Availability Zones (AZs), Edge Locations, and low-latency fault-tolerant topologies.",
    "syllabus": [
      "Regions vs AZs: Geographic clusters containing multiple isolated physical datacenters.",
      "Edge Locations & AWS Global Backbone: CloudFront and Global Accelerator point-of-presence (PoP).",
      "High Availability Invariant: Multi-AZ active-active deployment vs Single-AZ disaster vulnerability."
    ]
  },
  {
    "day": 3,
    "title": "Virtual Private Cloud (VPC) Architecture & CIDR Subnetting",
    "desc": "Design isolated VPC networks, public and private subnets, CIDR block calculations, and route tables.",
    "syllabus": [
      "VPC CIDR Blocks: RFC 1918 private IPv4 ranges (10.0.0.0/16, 172.16.0.0/16, 192.168.0.0/16).",
      "AWS Reserved IP Addresses: 5 reserved IPs per subnet (.0 network, .1 router, .2 DNS, .3 future, .255 broadcast).",
      "Public Subnet (IGW route) vs Private Subnet (No direct internet ingress)."
    ]
  },
  {
    "day": 4,
    "title": "Security Groups vs Network Access Control Lists (NACLs)",
    "desc": "Master stateful instance-level firewalls (Security Groups) vs stateless subnet-level packet filters (NACLs).",
    "syllabus": [
      "Security Groups: Stateful (Return traffic automatically allowed), allow-rules only, evaluated as a whole.",
      "NACLs: Stateless (Inbound and Outbound evaluated separately), support Allow and Deny rules, evaluated in numbered order.",
      "Defense-in-Depth Layering: Subnet perimeter NACL + EC2 instance Security Group."
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host",
    "desc": "Milestone 1: Build a production AWS VPC network featuring redundant Public/Private Subnets across 2 AZs, NAT Gateways, Internet Gateway, and Secure Bastion Host access.",
    "syllabus": [
      "Production Multi-AZ VPC Architecture: 2 Public Subnets + 2 Private App Subnets + 2 Isolated DB Subnets.",
      "NAT Gateway Egress Routing: Allowing private subnet instances to fetch security patches without public IPs.",
      "Bastion Host (Jump Box) / AWS Systems Manager Session Manager for SSH-less management."
    ]
  },
  {
    "day": 6,
    "title": "IAM Role Least-Privilege, Policies & Principal Trust",
    "desc": "Construct least-privilege IAM JSON policies, IAM Roles for EC2/Lambda (Instance Profiles), and AssumeRole trust policies.",
    "syllabus": [
      "IAM Policy Anatomy: `Effect: Allow|Deny`, `Action`, `Resource`, and `Condition` blocks.",
      "Explicit Deny Invariant: An explicit Deny ALWAYS overrides any Allow.",
      "IAM Roles vs IAM Users: Temporary short-lived credentials via AWS STS instead of hardcoded API keys."
    ]
  },
  {
    "day": 7,
    "title": "EC2 Compute Classes, Spot Instances & Auto-Scaling Groups",
    "desc": "Select optimal EC2 instance types (General Purpose, Compute, Memory), Spot Instance arbitrage, and Target Tracking Auto-Scaling.",
    "syllabus": [
      "Instance Types: `t4g` (Burstable ARM Graviton), `c7g` (Compute Heavy), `r7g` (Memory Heavy), `i4i` (High I/O Storage).",
      "Purchasing Models: On-Demand, Reserved Instances (RI), Savings Plans (up to 72% discount), and Spot Instances (up to 90% discount).",
      "Auto-Scaling Groups (ASG): Target Tracking on average CPU utilization (e.g. Target 70%)."
    ]
  },
  {
    "day": 8,
    "title": "Application Load Balancer (ALB), Target Groups & Health Probes",
    "desc": "Route traffic with Layer 7 Application Load Balancers: Host-based routing, path-based routing, target group health checks, and connection draining.",
    "syllabus": [
      "ALB vs NLB: Layer 7 (HTTP/HTTPS/gRPC) content routing vs Layer 4 (TCP/UDP) ultra-low latency.",
      "Target Groups & Health Checks: Consecutive healthy/unhealthy threshold counts and HTTP status matchers (e.g. 200-299).",
      "Deregistration Delay (Connection Draining): Graceful in-flight HTTP request completion before terminating instances."
    ]
  },
  {
    "day": 9,
    "title": "Amazon S3 Object Storage & Lifecycle Management Tiering",
    "desc": "Architect scalable object storage: S3 Standard, S3 Intelligent-Tiering, S3 Glacier Flexible / Deep Archive, and Lifecycle rules.",
    "syllabus": [
      "Storage Classes: Standard (High availability), Intelligent-Tiering (Auto cost optimization), Glacier Deep Archive (Lowest cost).",
      "S3 Consistency Model: Strong read-after-write consistency for PUTs and DELETEs.",
      "S3 Lifecycle Transitions: Noncurrent version expiration and automated transition to Glacier after N days."
    ]
  },
  {
    "day": 10,
    "title": "Amazon S3 Security, Block Public Access & Bucket Policies",
    "desc": "Enforce enterprise S3 security: S3 Block Public Access (Account & Bucket level), Bucket Policies, CORS, SSE-S3 / SSE-KMS encryption.",
    "syllabus": [
      "S3 Block Public Access: 4 settings preventing public ACLs and public policies.",
      "Server-Side Encryption: SSE-S3 (AES-256), SSE-KMS (Audit trail via CloudTrail), SSE-C (Customer keys).",
      "Enforcing TLS: S3 Bucket Policy condition `aws:SecureTransport: false` -> Explicit Deny."
    ]
  },
  {
    "day": 11,
    "title": "Serverless AWS Lambda: Concurrency, Memory & Cold Starts",
    "desc": "Design high-performance serverless functions: Reserved vs Provisioned Concurrency, Execution context reuse, and minimizing Cold Starts.",
    "syllabus": [
      "Lambda Execution Lifecycle: Init phase (Cold start), Invoke phase (Warm execution), Shutdown phase.",
      "Memory & CPU Coupling: Allocating 1,769 MB memory yields exactly 1 vCPU equivalent compute.",
      "Provisioned Concurrency: Keeping pre-initialized execution environments warm for latency-sensitive microservices."
    ]
  },
  {
    "day": 12,
    "title": "Amazon API Gateway V2 HTTP & Lambda Authorizers",
    "desc": "Build secure REST/HTTP APIs: Lambda Proxy Integration, JWT Authorizers, CORS headers, and API Gateway caching.",
    "syllabus": [
      "REST APIs vs HTTP APIs: HTTP APIs offer 70% lower cost and lower latency with native OIDC/JWT support.",
      "Lambda Proxy Integration: Passing full HTTP request (headers, queryParams, body) directly to Lambda.",
      "Lambda Custom Authorizer: Returning an IAM policy with `PrincipalId` and `Statement[0].Effect: Allow|Deny`."
    ]
  },
  {
    "day": 13,
    "title": "Amazon DynamoDB Partition Keys & Global Secondary Indexes (GSI)",
    "desc": "Design NoSQL single-table database schemas: Partition Key (PK) hashing, Sort Key (SK) range queries, Global Secondary Indexes, and RCU/WCU capacity.",
    "syllabus": [
      "Partition Key Hashing: MD5 hashing mapping items evenly across DynamoDB storage partitions.",
      "Composite Primary Key: Partition Key + Sort Key (`PK = USER#123`, `SK = ORDER#2024-01`).",
      "Read/Write Capacity Units: 1 RCU = 1 strongly consistent read/sec (up to 4KB); 1 WCU = 1 write/sec (up to 1KB)."
    ]
  },
  {
    "day": 14,
    "title": "Amazon RDS Multi-AZ High Availability & Read Replicas",
    "desc": "Scale relational databases: RDS Multi-AZ synchronous replication (Automatic failover), Read Replicas (Asynchronous read scaling), and Aurora Global Databases.",
    "syllabus": [
      "Multi-AZ Synchronous Replication: Physical standby in separate AZ with automatic DNS CNAME failover in 60-120s.",
      "Read Replicas: Up to 15 cross-AZ/cross-region read replicas offloading BI and analytics queries.",
      "Amazon Aurora Architecture: Distributed storage engine replicating 6 copies across 3 AZs with quorums."
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine",
    "desc": "Milestone 2: Construct an event-driven serverless video processing pipeline: S3 ObjectCreated triggers -> Lambda Transcoder -> DynamoDB Metadata Indexing -> CloudFront CDN delivery.",
    "syllabus": [
      "Event-Driven Architecture: Asynchronous S3 event notifications invoking Lambda execution.",
      "Idempotency & Dead Letter Queues (DLQ): Handling poisoned video payloads safely.",
      "End-to-end media transcoding microservice architecture."
    ]
  },
  {
    "day": 16,
    "title": "Amazon CloudFront Global CDN & Edge Functions (Lambda@Edge)",
    "desc": "Accelerate global content delivery: Edge Locations, Origin Shield, Cache Behaviors, Cache-Control headers, Lambda@Edge, and CloudFront Functions.",
    "syllabus": [
      "CloudFront Architecture: Edge Caches, Regional Edge Caches (REC), and Origins (S3, ALB, Custom HTTP).",
      "Cache Invalidation & TTL Hierarchy: `min-ttl`, `default-ttl`, `max-ttl` vs `Cache-Control: max-age`.",
      "Edge Compute: CloudFront Functions (Sub-millisecond lightweight JS) vs Lambda@Edge (Full Node.js/Python)."
    ]
  },
  {
    "day": 17,
    "title": "Amazon Route 53 DNS Routing Policies & Health Checks",
    "desc": "Route global internet traffic with Amazon Route 53: Simple, Weighted, Latency-Based, Geolocation, Geoproximity, and Failover Routing Policies.",
    "syllabus": [
      "DNS Record Types: A, AAAA, CNAME, and Route 53 ALIAS records (Zone apex mapping without CNAME RFC restrictions).",
      "Health Checks & DNS Failover: Active-Passive and Active-Active multi-region disaster recovery routing.",
      "Latency-Based Routing (LBR): Directing users automatically to the AWS Region offering lowest round-trip latency."
    ]
  },
  {
    "day": 18,
    "title": "Amazon SQS: Standard vs FIFO Queues & Visibility Timeouts",
    "desc": "Decouple distributed microservices with Amazon SQS: Standard Queues (At-least-once, unlimited throughput) vs FIFO Queues (Exactly-once, ordered), and Dead Letter Queues (DLQ).",
    "syllabus": [
      "Standard vs FIFO Queues: Message Deduplication ID + Message Group ID for strict partition ordering.",
      "Visibility Timeout: Hiding in-flight messages from other consumers during processing (Default 30s).",
      "Dead Letter Queue (DLQ): Capturing poison pills after `maxReceiveCount` consecutive processing failures."
    ]
  },
  {
    "day": 19,
    "title": "Amazon SNS: Pub/Sub Topic Fanout & Push Notifications",
    "desc": "Implement publish/subscribe messaging patterns: SNS Topics, SQS Fanout architecture, message filtering policies, and mobile push notifications.",
    "syllabus": [
      "Publish/Subscribe Architecture: 1-to-N asynchronous message fanout to multiple decoupled microservices.",
      "SNS + SQS Fanout Pattern: Publishing event once to SNS topic, delivering copies to individual service SQS queues.",
      "Message Filtering: Subscription filter policies routing subsets of messages based on JSON attributes."
    ]
  },
  {
    "day": 20,
    "title": "Amazon EventBridge: Serverless Event Bus & Schema Registry",
    "desc": "Architect enterprise event-driven systems with Amazon EventBridge: Custom event buses, content-based event pattern matching, and 3rd-party SaaS integrations.",
    "syllabus": [
      "EventBridge vs SNS: EventBridge inspects full JSON payload body; SNS inspects only message attributes.",
      "Content-Based Routing: JSON pattern matching (prefix, numeric range, exists, anything-but).",
      "Schema Registry: Auto-generating OpenAPI schemas from live event traffic for TypeScript/Java SDKs."
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus with SQS/SNS Fanout",
    "desc": "Milestone 3: Build an enterprise-grade distributed event routing engine: EventBridge Event Bus routing e-commerce order events to Inventory SQS, Payment SQS, and Notification SNS queues.",
    "syllabus": [
      "Enterprise Microservices Integration Architecture.",
      "Asynchronous fanout, dead-lettering, and guaranteed delivery.",
      "High-throughput event bus scalability stress test."
    ]
  },
  {
    "day": 22,
    "title": "AWS ECS & AWS Fargate Serverless Container Architecture",
    "desc": "Run containers without managing EC2 servers: ECS Task Definitions, Fargate compute configurations, task networking (awsvpc), and IAM Task Execution Roles.",
    "syllabus": [
      "ECS Launch Types: EC2 Launch Type (Managed instance cluster) vs AWS Fargate (Serverless container runtime).",
      "Task Execution Role (Pulling ECR images/logs) vs Task Role (Application AWS API permissions).",
      "`awsvpc` Network Mode: Every Fargate container receives dedicated ENI and private IP inside VPC."
    ]
  },
  {
    "day": 23,
    "title": "AWS Step Functions & Distributed Saga Pattern Orchestration",
    "desc": "Orchestrate multi-step distributed microservice workflows with AWS Step Functions: State machine definition (ASL), Parallel states, Choice states, and Distributed Sagas with compensation transactions.",
    "syllabus": [
      "Amazon States Language (ASL): JSON-based state machines defining Task, Choice, Parallel, Map, and Fail states.",
      "The Saga Pattern: Managing distributed transactions across microservices via forward execution and reverse compensating rollbacks.",
      "Standard Workflows (Auditable, up to 1 year) vs Express Workflows (High-volume, sub-second)."
    ]
  },
  {
    "day": 24,
    "title": "Infrastructure as Code (IaC) with Terraform & State Management",
    "desc": "Automate cloud infrastructure declaratively with Terraform: HCL syntax, Providers, Resources, Variables, Remote State S3 backends with DynamoDB locking.",
    "syllabus": [
      "Declarative IaC: Terraform HCL (`resource \"aws_s3_bucket\"`) vs Imperative scripts.",
      "Terraform State (`terraform.tfstate`): Mapping declarative configuration to real-world AWS resource IDs.",
      "State Locking: Amazon S3 remote state + DynamoDB LockID table preventing concurrent conflicting applies."
    ]
  },
  {
    "day": 25,
    "title": "Amazon CloudWatch Metrics, Log Insights & Alarms",
    "desc": "Observe cloud workloads: CloudWatch Metrics, Metric Math, Log Groups with filter patterns, Composite Alarms, and automated SNS notifications.",
    "syllabus": [
      "CloudWatch Metric Dimensions: Name, Value, Timestamp, Unit, and Dimensions (e.g. `InstanceId`).",
      "CloudWatch Alarms: Static thresholds vs Anomaly Detection; Evaluation Periods (e.g. 3 consecutive breaches).",
      "CloudWatch Logs Insights: Fast indexing and SQL-like structured querying (`fields @timestamp, @message | filter status >= 500`)."
    ]
  },
  {
    "day": 26,
    "title": "AWS Key Management Service (KMS) & Envelope Encryption",
    "desc": "Protect sensitive data with AWS KMS: Customer Managed Keys (CMK), Key Policies, Envelope Encryption (`GenerateDataKey`), and CloudTrail key auditability.",
    "syllabus": [
      "Envelope Encryption: Encrypting plaintext data with a Data Key (DEK), and encrypting the Data Key with a KMS Master Key (CMK).",
      "KMS Key Hierarchy: Root HSM Master Key -> Customer Managed Key (CMK) -> Plaintext/Ciphertext Data Encryption Key.",
      "Automatic Key Rotation: Annual automated rotation of cryptographic key material without re-encrypting existing data."
    ]
  },
  {
    "day": 27,
    "title": "AWS WAF & AWS Shield: DDoS & SQLi/XSS Protection",
    "desc": "Defend web applications from attacks: AWS WAF Web ACLs, Managed Rule Groups (SQL Injection, XSS, Common Rule Set), Rate-based rules, and AWS Shield Advanced.",
    "syllabus": [
      "Layer 7 Web Application Firewall: Inspecting HTTP headers, body, query strings, and URI paths.",
      "Rate-Based Rules: Automatically blocking IP addresses exceeding N requests per 5-minute evaluation window.",
      "AWS Shield Standard (Automatic SYN/UDP flood protection) vs AWS Shield Advanced (DDoS response team + cost protection)."
    ]
  },
  {
    "day": 28,
    "title": "AWS FinOps: Cost Optimization, Compute Savings Plans & Cost Allocation Tags",
    "desc": "Govern cloud spending with FinOps principles: Cost Allocation Tags, Compute Savings Plans, EC2 Right-Sizing, S3 Storage Lens, and AWS Budgets alerts.",
    "syllabus": [
      "The FinOps Framework: Inform (Visibility/Allocation), Optimize (Right-sizing/Discounts), Operate (Continuous governance).",
      "Savings Plans vs Reserved Instances: Compute Savings Plans offer flexibility across EC2, Fargate, and Lambda.",
      "Cost Allocation Tags: Mandatory tagging (`Environment`, `CostCenter`, `Project`) for departmental chargebacks."
    ]
  },
  {
    "day": 29,
    "title": "Disaster Recovery (DR) Strategies: Backup, Pilot Light & Warm Standby",
    "desc": "Architect multi-region Disaster Recovery architectures: Recovery Time Objective ($RTO$), Recovery Point Objective ($RPO$), Backup & Restore, Pilot Light, Warm Standby, and Multi-Site Active-Active.",
    "syllabus": [
      "RTO vs RPO: RTO = Maximum allowable downtime; RPO = Maximum allowable data loss in time.",
      "The 4 DR Strategies: 1. Backup & Restore (Hours/Days, Lowest cost); 2. Pilot Light (Core data live, minutes); 3. Warm Standby (Scaled-down live replica, seconds); 4. Multi-Site Active-Active (Real-time, zero downtime).",
      "Automating Multi-Region Failover: Route 53 health check alarms triggering Aurora global database failover."
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Global Resilient Multi-Region FinTech Banking Infrastructure with Active-Active Failover",
    "desc": "Final Capstone Synthesis: Build a global resilient FinTech banking platform: Multi-Region Active-Active deployment, DynamoDB Global Tables, Route 53 Latency routing, SQS/SNS microservices, AWS WAF, KMS envelope encryption, and automated multi-region DR failover.",
    "syllabus": [
      "Enterprise Multi-Region Active-Active Cloud Architecture Synthesis.",
      "Zero-Data-Loss FinTech Transaction Invariants & Cryptographic Auditing.",
      "Master Cloud Architect Boardroom Certification."
    ]
  }
];

export const CLOUD_WEB_DAYS: DayConfig[] = CLOUD_DAYS;
