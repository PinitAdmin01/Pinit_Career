import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const CLOUD_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Cloud Computing Models (IaaS, PaaS, SaaS) & Shared Responsibility",
    "desc": "Compare infrastructure, platform, and software models and total cost of ownership under the AWS Shared Responsibility Model.",
    "syllabus": [
      "IaaS vs PaaS vs SaaS: EC2 vs Elastic Beanstalk vs Amazon WorkMail.",
      "AWS Shared Responsibility Model: Security OF the Cloud (AWS) vs Security IN the Cloud (Customer).",
      "Total Cost of Ownership (TCO) & Capital Expenditure (CapEx) to Operational Expenditure (OpEx)."
    ],
    "eTitle": "Shared Responsibility Matrix Evaluator",
    "eDesc": "Implement function `getResponsibilityOwner(cloudLayer, serviceModel)` returning 'AWS' or 'CUSTOMER'.",
    "eStarter": "function getResponsibilityOwner(cloudLayer, serviceModel) {\n  // TODO: Determine whether AWS or CUSTOMER is responsible for the layer under the given service model\n  \n}",
    "eHint": "Physical datacenter is always AWS; on IaaS customer manages OS patching and app code; on SaaS AWS manages everything except customer data.",
    "eTest": "if (getResponsibilityOwner('PHYSICAL_DATACENTER', 'IaaS') !== 'AWS') throw new Error('Physical DC must be AWS');\nif (getResponsibilityOwner('OS_PATCHING', 'IaaS') !== 'CUSTOMER') throw new Error('IaaS OS patching is Customer');\nif (getResponsibilityOwner('OS_PATCHING', 'PaaS') !== 'AWS') throw new Error('PaaS OS patching is AWS');",
    "aTitle": "Cloud Model Categorizer",
    "aDesc": "Implement function `categorizeCloudModel(awsService)` returning 'IaaS', 'PaaS', or 'SaaS' based on cloud management tier.",
    "aStarter": "function categorizeCloudModel(service) {\n  // TODO: Map AWS services to their primary cloud service classification (IaaS, PaaS, or SaaS)\n  \n}",
    "aHint": "Map EC2/EBS to IaaS, RDS/Beanstalk to PaaS, WorkDocs to SaaS; return the string model name.",
    "aTest": "if (categorizeCloudModel('EC2') !== 'IaaS' || categorizeCloudModel('RDS') !== 'PaaS') throw new Error('Service categorization failed');\nif (categorizeCloudModel('WorkDocs') !== 'SaaS') throw new Error('SaaS categorization failed');"
  },
  {
    "day": 2,
    "title": "AWS Global Infrastructure, Regions & Availability Zones",
    "desc": "Understand AWS Regions, Availability Zones (AZs), Edge Locations, and low-latency fault-tolerant topologies.",
    "syllabus": [
      "Regions vs AZs: Geographic clusters containing multiple isolated physical datacenters.",
      "Edge Locations & AWS Global Backbone: CloudFront and Global Accelerator point-of-presence (PoP).",
      "High Availability Invariant: Multi-AZ active-active deployment vs Single-AZ disaster vulnerability."
    ],
    "eTitle": "Multi-AZ Fault Tolerance Evaluator",
    "eDesc": "Implement function `isTopologyFaultTolerant(nodeDeployments)` returning true if nodes span at least 2 distinct Availability Zones.",
    "eStarter": "function isTopologyFaultTolerant(nodes) {\n  // TODO: Count distinct availabilityZone values across nodes using a Set\n  \n}",
    "eHint": "Count distinct availabilityZone values across nodes using a Set; return set.size >= 2 to guarantee multi-AZ redundancy.",
    "eTest": "const singleAz = [{ id: 'i-1', availabilityZone: 'us-east-1a' }, { id: 'i-2', availabilityZone: 'us-east-1a' }];\nif (isTopologyFaultTolerant(singleAz) !== false) throw new Error('Single AZ topology is not fault tolerant');\nconst multiAz = [{ id: 'i-1', availabilityZone: 'us-east-1a' }, { id: 'i-2', availabilityZone: 'us-east-1b' }];\nif (isTopologyFaultTolerant(multiAz) !== true) throw new Error('Multi AZ topology must be fault tolerant');\nconst emptyNodes = isTopologyFaultTolerant([]);\nif (emptyNodes !== false) throw new Error('Empty deployment should not be fault tolerant');",
    "aTitle": "Region Code Validator",
    "aDesc": "Implement function `isValidAwsRegion(regionCode)` validating standard region formats like us-east-1, eu-west-1, and ap-south-1.",
    "aStarter": "function isValidAwsRegion(code) {\n  // TODO: Verify standard AWS region naming pattern using regex\n  \n}",
    "aHint": "Use a regular expression matching /^[a-z]{2}-(north|south|east|west|central)-\\d+$/; return boolean test result.",
    "aTest": "if (isValidAwsRegion('us-east-1') !== true || isValidAwsRegion('invalid-region') !== false) throw new Error('Region regex failed');\nif (isValidAwsRegion('ap-south-1') !== true) throw new Error('ap-south-1 region failed');"
  },
  {
    "day": 3,
    "title": "Virtual Private Cloud (VPC) Architecture & CIDR Subnetting",
    "desc": "Design isolated VPC networks, public and private subnets, CIDR block calculations, and route tables.",
    "syllabus": [
      "VPC CIDR Blocks: RFC 1918 private IPv4 ranges (10.0.0.0/16, 172.16.0.0/16, 192.168.0.0/16).",
      "AWS Reserved IP Addresses: 5 reserved IPs per subnet (.0 network, .1 router, .2 DNS, .3 future, .255 broadcast).",
      "Public Subnet (IGW route) vs Private Subnet (No direct internet ingress)."
    ],
    "eTitle": "Subnet Usable IP Address Calculator",
    "eDesc": "Implement function `getUsableSubnetIps(cidrMask)` calculating usable host IPs after deducting AWS 5 reserved addresses.",
    "eStarter": "function getUsableSubnetIps(cidrMask) {\n  // TODO: Compute total IPs as 2^(32 - mask) and subtract 5 AWS reserved addresses\n  \n}",
    "eHint": "Total IPs is Math.pow(2, 32 - cidrMask); deduct 5 AWS reserved IPs; return Math.max(0, total - 5).",
    "eTest": "if (getUsableSubnetIps(24) !== 251) throw new Error('/24 must have 256 - 5 = 251 usable IPs');\nif (getUsableSubnetIps(28) !== 11) throw new Error('/28 must have 16 - 5 = 11 usable IPs');\nif (getUsableSubnetIps(16) !== 65531) throw new Error('/16 must have 65536 - 5 = 65531 usable IPs');",
    "aTitle": "Public Route Table Inspector",
    "aDesc": "Implement function `hasInternetGatewayRoute(routes)` returning true if a default 0.0.0.0/0 route exists pointing to an igw- target.",
    "aStarter": "function hasInternetGatewayRoute(routes) {\n  // TODO: Check if any route in the table targets 0.0.0.0/0 via an internet gateway prefix\n  \n}",
    "aHint": "Iterate route objects checking if route.destination === '0.0.0.0/0' && route.target.startsWith('igw-'); return boolean.",
    "aTest": "const r = [{ destination: '10.0.0.0/16', target: 'local' }, { destination: '0.0.0.0/0', target: 'igw-123' }];\nif (hasInternetGatewayRoute(r) !== true) throw new Error('IGW check failed');\nconst noIgw = [{ destination: '10.0.0.0/16', target: 'local' }, { destination: '0.0.0.0/0', target: 'nat-123' }];\nif (hasInternetGatewayRoute(noIgw) !== false) throw new Error('NAT gateway should not count as direct IGW');"
  },
  {
    "day": 4,
    "title": "Security Groups vs Network Access Control Lists (NACLs)",
    "desc": "Master stateful instance-level firewalls (Security Groups) vs stateless subnet-level packet filters (NACLs).",
    "syllabus": [
      "Security Groups: Stateful (Return traffic automatically allowed), allow-rules only, evaluated as a whole.",
      "NACLs: Stateless (Inbound and Outbound evaluated separately), support Allow and Deny rules, evaluated in numbered order.",
      "Defense-in-Depth Layering: Subnet perimeter NACL + EC2 instance Security Group."
    ],
    "eTitle": "Security Group Stateful Traffic Evaluator",
    "eDesc": "Implement function `evaluateSecurityGroupTraffic(ruleList, traffic)` returning true if an allow rule matches protocol and port range.",
    "eStarter": "function evaluateSecurityGroupTraffic(rules, packet) {\n  // TODO: If return traffic, allow immediately; otherwise match inbound rules against protocol and port\n  \n}",
    "eHint": "Return traffic is automatically allowed due to stateful connection tracking; for new packets, check if rule matches protocol and port range.",
    "eTest": "const rules = [{ protocol: 'TCP', fromPort: 443, toPort: 443, cidr: '0.0.0.0/0' }];\nif (evaluateSecurityGroupTraffic(rules, { protocol: 'TCP', port: 443, sourceIp: '1.2.3.4' }) !== true) throw new Error('Port 443 HTTPS should be allowed');\nif (evaluateSecurityGroupTraffic(rules, { protocol: 'TCP', port: 80, sourceIp: '1.2.3.4' }) !== false) throw new Error('Port 80 HTTP should be blocked');\nif (evaluateSecurityGroupTraffic([], { protocol: 'TCP', port: 9999, isReturnTraffic: true }) !== true) throw new Error('Stateful return traffic must be allowed');",
    "aTitle": "NACL Rule Number Sorter",
    "aDesc": "Implement function `sortNaclRules(rules)` sorting rules ascending by ruleNumber to simulate lowest-number-wins priority.",
    "aStarter": "function sortNaclRules(rules) {\n  // TODO: Sort array ascending by numeric ruleNumber property\n  \n}",
    "aHint": "Use rules.slice().sort((a, b) => a.ruleNumber - b.ruleNumber); return the sorted array of NACL rules.",
    "aTest": "const sorted = sortNaclRules([{ ruleNumber: 200 }, { ruleNumber: 100 }, { ruleNumber: 150 }]);\nif (sorted[0].ruleNumber !== 100 || sorted[1].ruleNumber !== 150) throw new Error('NACL sort failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host",
    "desc": "Milestone 1: Build a production AWS VPC network featuring redundant Public/Private Subnets across 2 AZs, NAT Gateways, Internet Gateway, and Secure Bastion Host access.",
    "syllabus": [
      "Production Multi-AZ VPC Architecture: 2 Public Subnets + 2 Private App Subnets + 2 Isolated DB Subnets.",
      "NAT Gateway Egress Routing: Allowing private subnet instances to fetch security patches without public IPs.",
      "Bastion Host (Jump Box) / AWS Systems Manager Session Manager for SSH-less management."
    ],
    "eTitle": "VPC Network Topology Validator",
    "eDesc": "Implement function `validateVpcTopology(vpcConfig)` ensuring at least 2 AZs, 2 public subnets with IGW, and 2 private subnets with NAT Gateways.",
    "eStarter": "function validateVpcTopology(cfg) {\n  // TODO: Validate that VPC contains at least 2 AZs, public subnets with IGW, and private subnets with NAT\n  \n}",
    "eHint": "Verify at least 2 AZs, 2 public, 2 private, hasInternetGateway, and hasNatGateway; return { valid: boolean, azCount: number }.",
    "eTest": "const validVpc = {\n  cidr: '10.0.0.0/16',\n  hasInternetGateway: true,\n  hasNatGateway: true,\n  subnets: [\n    { id: 's-1', az: 'us-east-1a', type: 'PUBLIC' },\n    { id: 's-2', az: 'us-east-1b', type: 'PUBLIC' },\n    { id: 's-3', az: 'us-east-1a', type: 'PRIVATE' },\n    { id: 's-4', az: 'us-east-1b', type: 'PRIVATE' }\n  ]\n};\nconst res = validateVpcTopology(validVpc);\nif (!res.valid || res.azCount !== 2) throw new Error('Valid VPC topology was rejected');\nconst invalidVpc = { ...validVpc, hasNatGateway: false };\nif (validateVpcTopology(invalidVpc).valid !== false) throw new Error('VPC without NAT gateway should be rejected');\nconst singleAzVpc = { ...validVpc, subnets: [{ id: 's-1', az: 'us-east-1a', type: 'PUBLIC' }] };\nif (validateVpcTopology(singleAzVpc).valid !== false) throw new Error('Single AZ VPC should be rejected');",
    "aTitle": "Subnet CIDR Non-Overlap Checker",
    "aDesc": "Implement function `areSubnetsDistinct(subnets)` ensuring unique, non-overlapping CIDR blocks across all configured VPC subnets.",
    "aStarter": "function areSubnetsDistinct(subnets) {\n  // TODO: Verify all subnet CIDR strings are unique by comparing Set size with array length\n  \n}",
    "aHint": "Extract cidr strings into a Set; return set.size === subnets.length to guarantee no exact duplicate subnet ranges.",
    "aTest": "if (areSubnetsDistinct([{ cidr: '10.0.1.0/24' }, { cidr: '10.0.1.0/24' }]) !== false) throw new Error('Duplicate CIDR should fail');\nif (areSubnetsDistinct([{ cidr: '10.0.1.0/24' }, { cidr: '10.0.2.0/24' }]) !== true) throw new Error('Distinct CIDRs should pass');"
  },
  {
    "day": 6,
    "title": "IAM Role Least-Privilege, Policies & Principal Trust",
    "desc": "Construct least-privilege IAM JSON policies, IAM Roles for EC2/Lambda (Instance Profiles), and AssumeRole trust policies.",
    "syllabus": [
      "IAM Policy Anatomy: `Effect: Allow|Deny`, `Action`, `Resource`, and `Condition` blocks.",
      "Explicit Deny Invariant: An explicit Deny ALWAYS overrides any Allow.",
      "IAM Roles vs IAM Users: Temporary short-lived credentials via AWS STS instead of hardcoded API keys."
    ],
    "eTitle": "IAM Policy Decision Evaluator Engine",
    "eDesc": "Implement function `evaluateIamPermission(statements, request)` resolving Allow/Deny decisions with Explicit Deny precedence.",
    "eStarter": "function evaluateIamPermission(statements, req) {\n  // TODO: Check for explicit Deny matches first, then check for Allow matches, defaulting to Implicit Deny\n  \n}",
    "eHint": "Iterate statements: if any matching statement has effect 'Deny' return 'DENY'; if any matches with 'Allow' return 'ALLOW'; otherwise default to 'DENY'.",
    "eTest": "const statements = [\n  { effect: 'Allow', action: 's3:GetObject', resource: 'arn:aws:s3:::my-bucket/*' },\n  { effect: 'Deny', action: 's3:GetObject', resource: 'arn:aws:s3:::my-bucket/confidential/*' }\n];\nif (evaluateIamPermission(statements, { action: 's3:GetObject', resource: 'arn:aws:s3:::my-bucket/photo.jpg' }) !== 'ALLOW') throw new Error('Photo read should be allowed');\nif (evaluateIamPermission(statements, { action: 's3:GetObject', resource: 'arn:aws:s3:::my-bucket/confidential/keys.txt' }) !== 'DENY') throw new Error('Explicit Deny failed to override Allow');\nif (evaluateIamPermission(statements, { action: 'sqs:SendMessage', resource: 'arn:aws:sqs:::queue' }) !== 'DENY') throw new Error('Implicit deny failed for unlisted action');",
    "aTitle": "ARN String Parser",
    "aDesc": "Implement function `parseArn(arnString)` extracting service, region, accountId, and resource path components.",
    "aStarter": "function parseArn(arn) {\n  // TODO: Split ARN by colon delimiter and map to { partition, service, region, account, resource }\n  \n}",
    "aHint": "Split string by ':'; parts[2] is service, parts[3] is region, parts[4] is account, parts[5] is resource.",
    "aTest": "const p = parseArn('arn:aws:s3:us-east-1:123456789012:bucket/key');\nif (p.service !== 's3' || p.region !== 'us-east-1') throw new Error('ARN parser failed');\nif (p.account !== '123456789012') throw new Error('ARN account parse failed');"
  },
  {
    "day": 7,
    "title": "EC2 Compute Classes, Spot Instances & Auto-Scaling Groups",
    "desc": "Select optimal EC2 instance types (General Purpose, Compute, Memory), Spot Instance arbitrage, and Target Tracking Auto-Scaling.",
    "syllabus": [
      "Instance Types: `t4g` (Burstable ARM Graviton), `c7g` (Compute Heavy), `r7g` (Memory Heavy), `i4i` (High I/O Storage).",
      "Purchasing Models: On-Demand, Reserved Instances (RI), Savings Plans (up to 72% discount), and Spot Instances (up to 90% discount).",
      "Auto-Scaling Groups (ASG): Target Tracking on average CPU utilization (e.g. Target 70%)."
    ],
    "eTitle": "Auto-Scaling Target Tracking Capacity Calculator",
    "eDesc": "Implement function `calculateDesiredCapacity(currentCapacity, currentMetric, targetMetric, minCapacity, maxCapacity)` returning next instance count.",
    "eStarter": "function calculateDesiredCapacity(curr, metric, target, min, max) {\n  // TODO: Compute raw capacity as curr * (metric / target), round up, and clamp between min and max\n  \n}",
    "eHint": "Formula is Math.ceil(curr * (metric / target)); clamp between min and max using Math.max(min, Math.min(max, raw)).",
    "eTest": "if (calculateDesiredCapacity(4, 80, 50, 2, 10) !== 7) throw new Error('Scale out failed: 4 * (80/50) = 6.4 -> 7 instances');\nif (calculateDesiredCapacity(4, 20, 50, 2, 10) !== 2) throw new Error('Scale in clamped to min 2 instances');\nif (calculateDesiredCapacity(8, 90, 50, 2, 10) !== 10) throw new Error('Scale out clamped to max 10 instances');",
    "aTitle": "Spot Instance Interruption Notice Simulator",
    "aDesc": "Implement function `isSpotInterruptionImminent(minutesNotice)` returning true if warning window is 2 minutes or less.",
    "aStarter": "function isSpotInterruptionImminent(minutes) {\n  // TODO: Return true if notice window is less than or equal to AWS 2-minute spot rebalance notice\n  \n}",
    "aHint": "AWS Spot instances receive a 2-minute termination notice; check if minutesNotice <= 2.",
    "aTest": "if (isSpotInterruptionImminent(2) !== true || isSpotInterruptionImminent(5) !== false) throw new Error('Spot notice check failed');\nif (isSpotInterruptionImminent(0.5) !== true) throw new Error('Sub-minute spot notice failed');"
  },
  {
    "day": 8,
    "title": "Application Load Balancer (ALB), Target Groups & Health Probes",
    "desc": "Route traffic with Layer 7 Application Load Balancers: Host-based routing, path-based routing, target group health checks, and connection draining.",
    "syllabus": [
      "ALB vs NLB: Layer 7 (HTTP/HTTPS/gRPC) content routing vs Layer 4 (TCP/UDP) ultra-low latency.",
      "Target Groups & Health Checks: Consecutive healthy/unhealthy threshold counts and HTTP status matchers (e.g. 200-299).",
      "Deregistration Delay (Connection Draining): Graceful in-flight HTTP request completion before terminating instances."
    ],
    "eTitle": "ALB Path-Based Routing Rule Dispatcher",
    "eDesc": "Implement function `routeAlbRequest(pathRules, incomingPath)` resolving the matching target group ARN or returning default target group.",
    "eStarter": "function routeAlbRequest(rules, path) {\n  // TODO: Match incomingPath against rule path patterns, returning matched targetGroupArn or default target\n  \n}",
    "eHint": "Iterate path rules; if path matches pattern (or wildcard), return rule.targetGroupArn; else return default target group ARN.",
    "eTest": "const rules = [\n  { pathPattern: '/api/v1/*', targetGroupArn: 'arn:tg:api-v1' },\n  { pathPattern: '/static/*', targetGroupArn: 'arn:tg:static-assets' }\n];\nif (routeAlbRequest(rules, '/api/v1/users') !== 'arn:tg:api-v1') throw new Error('API v1 routing failed');\nif (routeAlbRequest(rules, '/static/logo.png') !== 'arn:tg:static-assets') throw new Error('Static asset routing failed');\nif (routeAlbRequest(rules, '/home') !== 'arn:tg:default') throw new Error('Default fallback routing failed');",
    "aTitle": "ALB Health Probe Status Classifier",
    "aDesc": "Implement function `isTargetHealthy(consecutiveSuccesses, healthyThreshold)` determining if instance is marked InService.",
    "aStarter": "function isTargetHealthy(successes, threshold) {\n  // TODO: Check if consecutive health probe successes meet or exceed the healthy threshold count\n  \n}",
    "aHint": "Compare successes >= threshold; return boolean indicating target group healthy state.",
    "aTest": "if (isTargetHealthy(3, 3) !== true || isTargetHealthy(2, 3) !== false) throw new Error('Health probe threshold check failed');\nif (isTargetHealthy(5, 3) !== true) throw new Error('Excess successes healthy check failed');"
  },
  {
    "day": 9,
    "title": "Amazon S3 Object Storage & Lifecycle Management Tiering",
    "desc": "Architect scalable object storage: S3 Standard, S3 Intelligent-Tiering, S3 Glacier Flexible / Deep Archive, and Lifecycle rules.",
    "syllabus": [
      "Storage Classes: Standard (High availability), Intelligent-Tiering (Auto cost optimization), Glacier Deep Archive (Lowest cost).",
      "S3 Consistency Model: Strong read-after-write consistency for PUTs and DELETEs.",
      "S3 Lifecycle Transitions: Noncurrent version expiration and automated transition to Glacier after N days."
    ],
    "eTitle": "S3 Lifecycle Transition Rule Evaluator",
    "eDesc": "Implement function `getS3StorageClass(objectAgeDays, accessFrequency)` determining optimal storage tier.",
    "eStarter": "function getS3StorageClass(ageDays, freq) {\n  // TODO: Return Glacier Deep Archive if age >= 365, Glacier if age >= 90, Intelligent-Tiering if low freq, else Standard\n  \n}",
    "eHint": "Evaluate objectAgeDays: >= 365 -> 'DEEP_ARCHIVE'; >= 90 -> 'GLACIER_FLEXIBLE'; freq === 'INFREQUENT' -> 'INTELLIGENT_TIERING'; default -> 'STANDARD'.",
    "eTest": "if (getS3StorageClass(400, 'INFREQUENT') !== 'DEEP_ARCHIVE') throw new Error('365+ days should transition to Deep Archive');\nif (getS3StorageClass(100, 'INFREQUENT') !== 'GLACIER_FLEXIBLE') throw new Error('90+ days should transition to Glacier');\nif (getS3StorageClass(10, 'FREQUENT') !== 'STANDARD') throw new Error('Fresh frequently accessed data must be Standard');",
    "aTitle": "S3 Versioning Delete Marker Inspector",
    "aDesc": "Implement function `isObjectAccessible(isDeleted, hasDeleteMarker)` checking object accessibility when versioning is enabled.",
    "aStarter": "function isObjectAccessible(isDeleted, hasMarker) {\n  // TODO: If delete marker is current revision, object is logically deleted; return false\n  \n}",
    "aHint": "In S3 versioned buckets, a delete creates a Delete Marker; return !isDeleted && !hasMarker.",
    "aTest": "if (isObjectAccessible(true, true) !== false || isObjectAccessible(false, false) !== true) throw new Error('S3 delete marker check failed');\nif (isObjectAccessible(false, true) !== false) throw new Error('Active delete marker should hide object');"
  },
  {
    "day": 10,
    "title": "Amazon S3 Security, Block Public Access & Bucket Policies",
    "desc": "Enforce enterprise S3 security: S3 Block Public Access (Account & Bucket level), Bucket Policies, CORS, SSE-S3 / SSE-KMS encryption.",
    "syllabus": [
      "S3 Block Public Access: 4 settings preventing public ACLs and public policies.",
      "Server-Side Encryption: SSE-S3 (AES-256), SSE-KMS (Audit trail via CloudTrail), SSE-C (Customer keys).",
      "Enforcing TLS: S3 Bucket Policy condition `aws:SecureTransport: false` -> Explicit Deny."
    ],
    "eTitle": "S3 Bucket Policy TLS Enforcement Validator",
    "eDesc": "Implement function `validateS3TlsEnforcement(bucketPolicy)` verifying explicit deny for insecure HTTP requests.",
    "eStarter": "function validateS3TlsEnforcement(policy) {\n  // TODO: Search policy statements for Effect: Deny where aws:SecureTransport is false\n  \n}",
    "eHint": "Iterate statements; look for effect === 'Deny' with condition matching aws:SecureTransport === false; return boolean.",
    "eTest": "const securePolicy = {\n  Statement: [\n    {\n      Effect: 'Deny',\n      Action: 's3:*',\n      Resource: 'arn:aws:s3:::my-bucket/*',\n      Condition: { Bool: { 'aws:SecureTransport': 'false' } }\n    }\n  ]\n};\nif (validateS3TlsEnforcement(securePolicy) !== true) throw new Error('Valid TLS enforcing policy was rejected');\nconst insecurePolicy = { Statement: [{ Effect: 'Allow', Action: 's3:GetObject' }] };\nif (validateS3TlsEnforcement(insecurePolicy) !== false) throw new Error('Insecure policy should fail validation');\nconst emptyPolicy = { Statement: [] };\nif (validateS3TlsEnforcement(emptyPolicy) !== false) throw new Error('Empty policy should fail validation');",
    "aTitle": "S3 Bucket Name Syntax Validator",
    "aDesc": "Implement function `isValidBucketName(name)` ensuring bucket conforms to DNS-compliant AWS naming rules (3-63 chars, lowercase, digits, hyphens).",
    "aStarter": "function isValidBucketName(name) {\n  // TODO: Check bucket name length between 3 and 63 chars and match /^[a-z0-9][a-z0-9.-]+[a-z0-9]$/\n  \n}",
    "aHint": "Use regex /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/ and ensure no adjacent periods or IP address formats.",
    "aTest": "if (isValidBucketName('my-valid-bucket.123') !== true || isValidBucketName('INVALID_NAME') !== false) throw new Error('Bucket name validator failed');\nif (isValidBucketName('ab') !== false) throw new Error('Short bucket name should fail');"
  },
  {
    "day": 11,
    "title": "Serverless AWS Lambda: Concurrency, Memory & Cold Starts",
    "desc": "Design high-performance serverless functions: Reserved vs Provisioned Concurrency, Execution context reuse, and minimizing Cold Starts.",
    "syllabus": [
      "Lambda Execution Lifecycle: Init phase (Cold start), Invoke phase (Warm execution), Shutdown phase.",
      "Memory & CPU Coupling: Allocating 1,769 MB memory yields exactly 1 vCPU equivalent compute.",
      "Provisioned Concurrency: Keeping pre-initialized execution environments warm for latency-sensitive microservices."
    ],
    "eTitle": "Lambda Pricing & Memory Allocation Optimizer",
    "eDesc": "Implement function `calculateLambdaExecutionCost(invocations, durationMs, memoryMb)` calculating monthly compute cost.",
    "eStarter": "function calculateLambdaExecutionCost(invocations, durationMs, memoryMb) {\n  // TODO: Compute gigabyte-seconds = invocations * (durationMs / 1000) * (memoryMb / 1024), multiply by $0.0000166667\n  \n}",
    "eHint": "Compute gbSeconds = invocations * (durationMs / 1000) * (memoryMb / 1024); cost = gbSeconds * 0.0000166667; return Number(cost.toFixed(4)).",
    "eTest": "const cost = calculateLambdaExecutionCost(1000000, 200, 512); // 1M * 0.2s * 0.5 GB = 100,000 GB-s * 0.0000166667 = $1.6667\nif (cost !== 1.6667) throw new Error('Lambda cost computation failed');\nconst lowMem = calculateLambdaExecutionCost(1000000, 100, 128); // 1M * 0.1 * 0.125 = 12,500 GB-s * 0.0000166667 = $0.2083\nif (lowMem !== 0.2083) throw new Error('Low memory Lambda cost failed');\nconst zeroCost = calculateLambdaExecutionCost(0, 500, 1024);\nif (zeroCost !== 0.0000) throw new Error('Zero invocations cost check failed');",
    "aTitle": "Lambda Cold Start Mitigator",
    "aDesc": "Implement function `selectConcurrencyModel(p99LatencyMs, isLatencyCritical)` returning 'PROVISIONED_CONCURRENCY' or 'STANDARD_ON_DEMAND'.",
    "aStarter": "function selectConcurrencyModel(p99, isCritical) {\n  // TODO: Return PROVISIONED_CONCURRENCY if latency is critical and p99 exceeds 100ms threshold\n  \n}",
    "aHint": "If isLatencyCritical && p99LatencyMs > 100 return 'PROVISIONED_CONCURRENCY'; else return 'STANDARD_ON_DEMAND'.",
    "aTest": "if (selectConcurrencyModel(250, true) !== 'PROVISIONED_CONCURRENCY') throw new Error('Critical high latency should use Provisioned Concurrency');\nif (selectConcurrencyModel(50, false) !== 'STANDARD_ON_DEMAND') throw new Error('Standard on demand check failed');"
  },
  {
    "day": 12,
    "title": "Amazon API Gateway V2 HTTP & Lambda Authorizers",
    "desc": "Build secure REST/HTTP APIs: Lambda Proxy Integration, JWT Authorizers, CORS headers, and API Gateway caching.",
    "syllabus": [
      "REST APIs vs HTTP APIs: HTTP APIs offer 70% lower cost and lower latency with native OIDC/JWT support.",
      "Lambda Proxy Integration: Passing full HTTP request (headers, queryParams, body) directly to Lambda.",
      "Lambda Custom Authorizer: Returning an IAM policy with `PrincipalId` and `Statement[0].Effect: Allow|Deny`."
    ],
    "eTitle": "API Gateway Lambda Authorizer Response Generator",
    "eDesc": "Implement function `generateAuthorizerResponse(principalId, effect, resourceArn)` building valid IAM policy response document.",
    "eStarter": "function generateAuthorizerResponse(principalId, effect, resourceArn) {\n  // TODO: Return IAM policy document with principalId and policyDocument containing Statement array\n  \n}",
    "eHint": "Return object { principalId, policyDocument: { Version: '2012-10-17', Statement: [{ Action: 'execute-api:Invoke', Effect: effect, Resource: resourceArn }] } }.",
    "eTest": "const auth = generateAuthorizerResponse('user_101', 'Allow', 'arn:aws:execute-api:us-east-1:*:*/*');\nif (auth.principalId !== 'user_101' || auth.policyDocument.Statement[0].Effect !== 'Allow') throw new Error('Authorizer policy generator failed');\nconst denyAuth = generateAuthorizerResponse('user_bad', 'Deny', 'arn:aws:execute-api:us-east-1:*:*/*');\nif (denyAuth.policyDocument.Statement[0].Effect !== 'Deny') throw new Error('Deny authorizer effect failed');\nif (auth.policyDocument.Statement[0].Action !== 'execute-api:Invoke') throw new Error('Authorizer action failed');",
    "aTitle": "CORS Header Generator",
    "aDesc": "Implement function `generateCorsHeaders(allowedOrigin)` returning standard Access-Control headers for browser web applications.",
    "aStarter": "function generateCorsHeaders(origin) {\n  // TODO: Construct standard CORS response headers including Access-Control-Allow-Origin\n  \n}",
    "aHint": "Return object with 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'.",
    "aTest": "const cors = generateCorsHeaders('https://app.pinit.com');\nif (cors['Access-Control-Allow-Origin'] !== 'https://app.pinit.com') throw new Error('CORS header generator failed');\nif (!cors['Access-Control-Allow-Methods']) throw new Error('CORS methods header missing');"
  },
  {
    "day": 13,
    "title": "Amazon DynamoDB Partition Keys & Global Secondary Indexes (GSI)",
    "desc": "Design NoSQL single-table database schemas: Partition Key (PK) hashing, Sort Key (SK) range queries, Global Secondary Indexes, and RCU/WCU capacity.",
    "syllabus": [
      "Partition Key Hashing: MD5 hashing mapping items evenly across DynamoDB storage partitions.",
      "Composite Primary Key: Partition Key + Sort Key (`PK = USER#123`, `SK = ORDER#2024-01`).",
      "Read/Write Capacity Units: 1 RCU = 1 strongly consistent read/sec (up to 4KB); 1 WCU = 1 write/sec (up to 1KB)."
    ],
    "eTitle": "DynamoDB Partition Key Shard Hasher",
    "eDesc": "Implement function `getPartitionShard(partitionKey, totalShards)` calculating deterministic shard index using character code checksum.",
    "eStarter": "function getPartitionShard(partitionKey, totalShards) {\n  // TODO: Compute sum of char codes in partitionKey and return sum % totalShards\n  \n}",
    "eHint": "Sum char codes in partitionKey string: key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % totalShards.",
    "eTest": "const shardA = getPartitionShard('user_101', 8);\nconst shardB = getPartitionShard('user_101', 8);\nif (shardA !== shardB || shardA < 0 || shardA >= 8) throw new Error('Consistent partition hashing failed');\nconst shardC = getPartitionShard('user_102', 8);\nif (typeof shardC !== 'number') throw new Error('Shard must return integer number');\nconst singleShard = getPartitionShard('user_999', 1);\nif (singleShard !== 0) throw new Error('Single shard index should be 0');",
    "aTitle": "DynamoDB RCU Provisioning Calculator",
    "aDesc": "Implement function `calculateRequiredRcu(itemSizeBytes, readsPerSec, isStronglyConsistent)` calculating required provisioned RCU.",
    "aStarter": "function calculateRequiredRcu(itemBytes, rps, strong) {\n  // TODO: 1 RCU per 4KB chunk (strongly consistent) or 2 reads per RCU (eventually consistent)\n  \n}",
    "aHint": "chunks = Math.ceil(itemSizeBytes / 4096); rcuPerRead = isStronglyConsistent ? chunks : chunks / 2; return Math.ceil(rcuPerRead * readsPerSec).",
    "aTest": "const rcu = calculateRequiredRcu(8192, 10, true); // 8KB = 2 chunks * 10 = 20 RCU\nif (rcu !== 20) throw new Error('Strongly consistent RCU calculation failed');\nconst eventRcu = calculateRequiredRcu(4096, 10, false); // 4KB = 1 chunk * 10 / 2 = 5 RCU\nif (eventRcu !== 5) throw new Error('Eventually consistent RCU failed');"
  },
  {
    "day": 14,
    "title": "Amazon RDS Multi-AZ High Availability & Read Replicas",
    "desc": "Scale relational databases: RDS Multi-AZ synchronous replication (Automatic failover), Read Replicas (Asynchronous read scaling), and Aurora Global Databases.",
    "syllabus": [
      "Multi-AZ Synchronous Replication: Physical standby in separate AZ with automatic DNS CNAME failover in 60-120s.",
      "Read Replicas: Up to 15 cross-AZ/cross-region read replicas offloading BI and analytics queries.",
      "Amazon Aurora Architecture: Distributed storage engine replicating 6 copies across 3 AZs with quorums."
    ],
    "eTitle": "RDS Multi-AZ Failover Orchestration Simulator",
    "eDesc": "Implement function `triggerRdsMultiAzFailover(clusterState)` swapping primary and standby AZs and recording DNS CNAME propagation.",
    "eStarter": "function triggerRdsMultiAzFailover(cluster) {\n  // TODO: Swap primaryAz and standbyAz if multiAzEnabled is true and return success status\n  \n}",
    "eHint": "If (!cluster.multiAzEnabled) return { success: false, reason: 'MULTI_AZ_DISABLED' }; swap primaryAz and standbyAz; return { success: true, newPrimaryAz: cluster.primaryAz }.",
    "eTest": "const cluster = { primaryAz: 'us-east-1a', standbyAz: 'us-east-1b', multiAzEnabled: true };\nconst res = triggerRdsMultiAzFailover(cluster);\nif (!res.success || cluster.primaryAz !== 'us-east-1b') throw new Error('RDS Multi-AZ failover failed');\nconst failCluster = { primaryAz: 'us-east-1a', standbyAz: null, multiAzEnabled: false };\nif (triggerRdsMultiAzFailover(failCluster).success !== false) throw new Error('Disabled Multi-AZ should reject failover');\nif (cluster.standbyAz !== 'us-east-1a') throw new Error('Standby AZ swap failed');",
    "aTitle": "Read Replica Query Router",
    "aDesc": "Implement function `routeSqlQuery(queryType, primaryEndpoint, replicaEndpoints)` routing writes to primary and reads to read replicas.",
    "aStarter": "function routeSqlQuery(type, primary, replicas) {\n  // TODO: If SELECT query, round-robin across replicas; if INSERT/UPDATE/DELETE, route to primaryEndpoint\n  \n}",
    "aHint": "Check if queryType === 'READ' || queryType === 'SELECT'; if true return a replica endpoint; else return primaryEndpoint.",
    "aTest": "const ep = routeSqlQuery('SELECT', 'db-primary.aws.com', ['db-replica-1.aws.com']);\nif (ep !== 'db-replica-1.aws.com') throw new Error('Read query should route to replica');\nconst writeEp = routeSqlQuery('INSERT', 'db-primary.aws.com', ['db-replica-1.aws.com']);\nif (writeEp !== 'db-primary.aws.com') throw new Error('Write query should route to primary');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine",
    "desc": "Milestone 2: Construct an event-driven serverless video processing pipeline: S3 ObjectCreated triggers -> Lambda Transcoder -> DynamoDB Metadata Indexing -> CloudFront CDN delivery.",
    "syllabus": [
      "Event-Driven Architecture: Asynchronous S3 event notifications invoking Lambda execution.",
      "Idempotency & Dead Letter Queues (DLQ): Handling poisoned video payloads safely.",
      "End-to-end media transcoding microservice architecture."
    ],
    "eTitle": "Serverless Video Pipeline Orchestrator",
    "eDesc": "Implement function `orchestrateVideoPipeline(s3Event, dbStore, transcoderClient)` executing end-to-end event-driven video transcoding.",
    "eStarter": "function orchestrateVideoPipeline(event, db, transcoder) {\n  // TODO: Extract bucket and key from s3Event, trigger transcoding, and record status in dbStore\n  \n}",
    "eHint": "Extract bucket = event.Records[0].s3.bucket.name and key = event.Records[0].s3.object.key; call transcoder.transcode(bucket, key); write metadata to db; return result.",
    "eTest": "const db = new Map();\nconst transcoder = { transcode: async (b, k) => ({ url: `https://${b}.s3.amazonaws.com/processed/${k}` }) };\nconst event = { Records: [{ s3: { bucket: { name: 'raw-videos' }, object: { key: 'demo.mp4' } } }] };\nconst res = await orchestrateVideoPipeline(event, db, transcoder);\nif (!res.success || !res.outputUrl.includes('processed/demo.mp4')) throw new Error('Serverless video pipeline failed');\nif (!db.has('demo.mp4')) throw new Error('Database metadata record was not persisted');\nconst invalidEvent = { Records: [] };\nconst failRes = await orchestrateVideoPipeline(invalidEvent, db, transcoder);\nif (failRes.success !== false) throw new Error('Empty event records should fail gracefully');",
    "aTitle": "S3 Event Record Parser",
    "aDesc": "Implement function `extractS3EventDetails(record)` returning object `{ bucketName: string, objectKey: string, sizeBytes: number }`.",
    "aStarter": "function extractS3EventDetails(record) {\n  // TODO: Extract bucket.name, object.key, and object.size from S3 event record payload\n  \n}",
    "aHint": "Safely navigate record.s3.bucket.name and record.s3.object.key, decoding URI components if needed; return structured object.",
    "aTest": "const details = extractS3EventDetails({ s3: { bucket: { name: 'b1' }, object: { key: 'vid.mp4', size: 1024 } } });\nif (details.bucketName !== 'b1' || details.objectKey !== 'vid.mp4') throw new Error('Event parser failed');\nif (details.sizeBytes !== 1024) throw new Error('Event size parsing failed');"
  },
  {
    "day": 16,
    "title": "Amazon CloudFront Global CDN & Edge Functions (Lambda@Edge)",
    "desc": "Accelerate global content delivery: Edge Locations, Origin Shield, Cache Behaviors, Cache-Control headers, Lambda@Edge, and CloudFront Functions.",
    "syllabus": [
      "CloudFront Architecture: Edge Caches, Regional Edge Caches (REC), and Origins (S3, ALB, Custom HTTP).",
      "Cache Invalidation & TTL Hierarchy: `min-ttl`, `default-ttl`, `max-ttl` vs `Cache-Control: max-age`.",
      "Edge Compute: CloudFront Functions (Sub-millisecond lightweight JS) vs Lambda@Edge (Full Node.js/Python)."
    ],
    "eTitle": "CloudFront Cache-Control TTL Parser & Resolver",
    "eDesc": "Implement function `calculateEdgeTtl(cacheControlHeader, defaultTtlSeconds)` extracting max-age directive or applying default TTL.",
    "eStarter": "function calculateEdgeTtl(header, defaultTtl = 86400) {\n  // TODO: Parse max-age=N from cacheControlHeader; if not found, return defaultTtl\n  \n}",
    "eHint": "Check if header contains 'max-age='; extract integer using regex /max-age=(\\d+)/; if match return parseInt(match[1]), else return defaultTtlSeconds.",
    "eTest": "if (calculateEdgeTtl('public, max-age=3600') !== 3600) throw new Error('max-age parsing failed');\nif (calculateEdgeTtl('') !== 86400) throw new Error('Default TTL fallback failed');\nif (calculateEdgeTtl('no-cache', 60) !== 60) throw new Error('Custom default TTL fallback failed');",
    "aTitle": "Edge Function Request Header Normalizer",
    "aDesc": "Implement function `normalizeEdgeHeaders(headers)` converting incoming HTTP header keys to lowercase for consistent cache key generation.",
    "aStarter": "function normalizeEdgeHeaders(headers) {\n  // TODO: Iterate header keys and construct a new object with all lowercase keys\n  \n}",
    "aHint": "Loop Object.entries(headers); build new object with key.toLowerCase() as property names; return normalized headers.",
    "aTest": "const norm = normalizeEdgeHeaders({ 'Content-Type': 'application/json', 'X-Custom-Auth': 'token123' });\nif (norm['content-type'] !== 'application/json' || norm['x-custom-auth'] !== 'token123') throw new Error('Edge header normalization failed');"
  },
  {
    "day": 17,
    "title": "Amazon Route 53 DNS Routing Policies & Health Checks",
    "desc": "Route global internet traffic with Amazon Route 53: Simple, Weighted, Latency-Based, Geolocation, Geoproximity, and Failover Routing Policies.",
    "syllabus": [
      "DNS Record Types: A, AAAA, CNAME, and Route 53 ALIAS records (Zone apex mapping without CNAME RFC restrictions).",
      "Health Checks & DNS Failover: Active-Passive and Active-Active multi-region disaster recovery routing.",
      "Latency-Based Routing (LBR): Directing users automatically to the AWS Region offering lowest round-trip latency."
    ],
    "eTitle": "Route 53 DNS Routing Policy Dispatcher",
    "eDesc": "Implement function `resolveDnsEndpoint(routingConfig, isPrimaryHealthy)` selecting appropriate IP address based on Failover policy.",
    "eStarter": "function resolveDnsEndpoint(cfg, isPrimaryHealthy) {\n  // TODO: If FAILOVER policy, return primaryIp if isPrimaryHealthy is true, otherwise return secondaryIp\n  \n}",
    "eHint": "If cfg.routingPolicy === 'FAILOVER' return isPrimaryHealthy ? cfg.primaryIp : cfg.secondaryIp; else return cfg.primaryIp.",
    "eTest": "const cfg = { routingPolicy: 'FAILOVER', primaryIp: '1.1.1.1', secondaryIp: '2.2.2.2' };\nif (resolveDnsEndpoint(cfg, true) !== '1.1.1.1') throw new Error('Healthy should route to primary');\nif (resolveDnsEndpoint(cfg, false) !== '2.2.2.2') throw new Error('Unhealthy must failover to secondary');\nconst simpleCfg = { routingPolicy: 'SIMPLE', primaryIp: '3.3.3.3' };\nif (resolveDnsEndpoint(simpleCfg, false) !== '3.3.3.3') throw new Error('Simple routing should ignore health checks');",
    "aTitle": "Weighted DNS Record Target Selector",
    "aDesc": "Implement function `selectWeightedEndpoint(records, randomRoll)` picking target record based on cumulative integer weights.",
    "aStarter": "function selectWeightedEndpoint(records, roll) {\n  // TODO: Iterate records, accumulate weights, and return endpoint where roll falls within cumulative weight range\n  \n}",
    "aHint": "Calculate cumulative weights: track currentSum += record.weight; if roll < currentSum return record.endpoint.",
    "aTest": "const recs = [{ endpoint: 'ep1', weight: 70 }, { endpoint: 'ep2', weight: 30 }];\nif (selectWeightedEndpoint(recs, 40) !== 'ep1' || selectWeightedEndpoint(recs, 80) !== 'ep2') throw new Error('Weighted DNS selection failed');"
  },
  {
    "day": 18,
    "title": "Amazon SQS: Standard vs FIFO Queues & Visibility Timeouts",
    "desc": "Decouple distributed microservices with Amazon SQS: Standard Queues (At-least-once, unlimited throughput) vs FIFO Queues (Exactly-once, ordered), and Dead Letter Queues (DLQ).",
    "syllabus": [
      "Standard vs FIFO Queues: Message Deduplication ID + Message Group ID for strict partition ordering.",
      "Visibility Timeout: Hiding in-flight messages from other consumers during processing (Default 30s).",
      "Dead Letter Queue (DLQ): Capturing poison pills after `maxReceiveCount` consecutive processing failures."
    ],
    "eTitle": "SQS Visibility Timeout Expiration Checker",
    "eDesc": "Implement function `isMessageVisibilityExpired(receivedTimestampMs, visibilityTimeoutSeconds)` checking if message should become visible again.",
    "eStarter": "function isMessageVisibilityExpired(receivedTimestampMs, timeoutSeconds) {\n  // TODO: Compare elapsed time since receivedTimestampMs with timeout in milliseconds\n  \n}",
    "eHint": "Compute elapsed = Date.now() - receivedTimestampMs; return elapsed >= timeoutSeconds * 1000 to determine if visibility expired.",
    "eTest": "const now = Date.now();\nif (isMessageVisibilityExpired(now - 40000, 30) !== true) throw new Error('40s past 30s timeout must be expired');\nif (isMessageVisibilityExpired(now - 10000, 30) !== false) throw new Error('10s past 30s timeout must remain hidden');\nif (isMessageVisibilityExpired(now, 10) !== false) throw new Error('Brand new message should remain invisible');",
    "aTitle": "SQS FIFO Deduplication Window Evaluator",
    "aDesc": "Implement function `isMessageDuplicate(dedupId, recentDedupIds, windowSeconds)` checking for duplicate messages within the 5-minute FIFO window.",
    "aStarter": "function isMessageDuplicate(dedupId, recentIds, windowSec) {\n  // TODO: Check if dedupId exists in recentIds map and timestamp is within windowSec\n  \n}",
    "aHint": "Check if recentDedupIds.has(dedupId) and whether (Date.now() - recentDedupIds.get(dedupId)) <= windowSeconds * 1000; return boolean.",
    "aTest": "const map = new Map([['msg_1', Date.now() - 5000]]);\nif (isMessageDuplicate('msg_1', map, 300) !== true) throw new Error('Duplicate FIFO message failed to detect');\nif (isMessageDuplicate('msg_2', map, 300) !== false) throw new Error('New FIFO message flagged as duplicate');"
  },
  {
    "day": 19,
    "title": "Amazon SNS: Pub/Sub Topic Fanout & Push Notifications",
    "desc": "Implement publish/subscribe messaging patterns: SNS Topics, SQS Fanout architecture, message filtering policies, and mobile push notifications.",
    "syllabus": [
      "Publish/Subscribe Architecture: 1-to-N asynchronous message fanout to multiple decoupled microservices.",
      "SNS + SQS Fanout Pattern: Publishing event once to SNS topic, delivering copies to individual service SQS queues.",
      "Message Filtering: Subscription filter policies routing subsets of messages based on JSON attributes."
    ],
    "eTitle": "SNS Topic Subscription Fanout Dispatcher",
    "eDesc": "Implement function `fanoutSnsMessage(subscriptions, messagePayload)` dispatching payload to all confirmed subscriber endpoints.",
    "eStarter": "function fanoutSnsMessage(subs, payload) {\n  // TODO: Filter confirmed subscriptions, dispatch message to endpoints, and return delivery summary\n  \n}",
    "eHint": "Filter subscriptions where sub.status === 'CONFIRMED'; map to delivered array; return { totalDelivered: confirmed.length, subscribers: confirmed.map(s => s.endpointArn) }.",
    "eTest": "const subs = [{ endpointArn: 'arn:sqs:queueA', status: 'CONFIRMED' }, { endpointArn: 'arn:sqs:queueB', status: 'CONFIRMED' }, { endpointArn: 'arn:sqs:queueC', status: 'PENDING' }];\nconst res = fanoutSnsMessage(subs, { event: 'ORDER_PLACED' });\nif (res.totalDelivered !== 2) throw new Error('SNS Fanout should deliver to exactly 2 confirmed subscriptions');\nconst emptyRes = fanoutSnsMessage([], { event: 'TEST' });\nif (emptyRes.totalDelivered !== 0) throw new Error('Empty subscription list should deliver to 0 endpoints');\nif (res.subscribers[0] !== 'arn:sqs:queueA') throw new Error('Subscriber ARN mismatch');",
    "aTitle": "SNS Subscription Filter Policy Matcher",
    "aDesc": "Implement function `matchesSnsFilterPolicy(filterPolicy, messageAttributes)` evaluating string and numeric attribute criteria.",
    "aStarter": "function matchesSnsFilterPolicy(policy, attrs) {\n  // TODO: Verify that all filterPolicy keys exist in messageAttributes with matching values\n  \n}",
    "aHint": "For each key in filterPolicy, check if messageAttributes[key] exists and policy[key].includes(messageAttributes[key].Value); return boolean.",
    "aTest": "const policy = { customerType: ['VIP', 'ENTERPRISE'] };\nconst msg = { customerType: { Type: 'String', Value: 'VIP' } };\nif (matchesSnsFilterPolicy(policy, msg) !== true) throw new Error('SNS filter policy should match VIP');\nif (matchesSnsFilterPolicy(policy, { customerType: { Value: 'BASIC' } }) !== false) throw new Error('Basic customer should not match');"
  },
  {
    "day": 20,
    "title": "Amazon EventBridge: Serverless Event Bus & Schema Registry",
    "desc": "Architect enterprise event-driven systems with Amazon EventBridge: Custom event buses, content-based event pattern matching, and 3rd-party SaaS integrations.",
    "syllabus": [
      "EventBridge vs SNS: EventBridge inspects full JSON payload body; SNS inspects only message attributes.",
      "Content-Based Routing: JSON pattern matching (prefix, numeric range, exists, anything-but).",
      "Schema Registry: Auto-generating OpenAPI schemas from live event traffic for TypeScript/Java SDKs."
    ],
    "eTitle": "EventBridge JSON Event Pattern Matcher",
    "eDesc": "Implement function `matchEventPattern(pattern, eventPayload)` matching event source and detail-type array filters.",
    "eStarter": "function matchEventPattern(pattern, event) {\n  // TODO: Check if event.source matches pattern.source and event['detail-type'] matches pattern['detail-type']\n  \n}",
    "eHint": "Check if (!pattern.source || pattern.source.includes(event.source)) && (!pattern['detail-type'] || pattern['detail-type'].includes(event['detail-type'])); return boolean.",
    "eTest": "const pattern = { source: ['pinit.billing'], 'detail-type': ['PaymentSucceeded'] };\nconst event = { source: 'pinit.billing', 'detail-type': 'PaymentSucceeded', detail: { amount: 500 } };\nif (matchEventPattern(pattern, event) !== true) throw new Error('Valid EventBridge pattern was rejected');\nconst badEvent = { source: 'pinit.auth', 'detail-type': 'Login' };\nif (matchEventPattern(pattern, badEvent) !== false) throw new Error('Mismatched EventBridge pattern should fail');\nconst wildcardPattern = {};\nif (matchEventPattern(wildcardPattern, event) !== true) throw new Error('Empty pattern should match any event');",
    "aTitle": "CloudWatch Event Envelope Formatter",
    "aDesc": "Implement function `createEventBridgeEnvelope(source, detailType, detailObject)` creating standard AWS event payload.",
    "aStarter": "function createEventBridgeEnvelope(src, type, detail) {\n  // TODO: Construct standard EventBridge envelope with Version, Id, Source, DetailType, Time, and Detail\n  \n}",
    "aHint": "Return object with version: '0', id: 'evt_' + Math.random(), source, 'detail-type': detailType, time: new Date().toISOString(), detail: detailObject.",
    "aTest": "const env = createEventBridgeEnvelope('pinit.orders', 'OrderPlaced', { id: 101 });\nif (env.source !== 'pinit.orders' || env['detail-type'] !== 'OrderPlaced') throw new Error('Envelope formatting failed');\nif (!env.time || env.version !== '0') throw new Error('Envelope metadata failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus with SQS/SNS Fanout",
    "desc": "Milestone 3: Build an enterprise-grade distributed event routing engine: EventBridge Event Bus routing e-commerce order events to Inventory SQS, Payment SQS, and Notification SNS queues.",
    "syllabus": [
      "Enterprise Microservices Integration Architecture.",
      "Asynchronous fanout, dead-lettering, and guaranteed delivery.",
      "High-throughput event bus scalability stress test."
    ],
    "eTitle": "Microservices Event Bus Dispatcher Kernel",
    "eDesc": "Implement function `routeMicroserviceEvent(event, routingRules, queueStore)` matching event patterns and pushing messages to targeted service queues.",
    "eStarter": "function routeMicroserviceEvent(event, rules, queues) {\n  // TODO: Match event against routingRules and push event payload into matched queueStore targets\n  \n}",
    "eHint": "Iterate rules; if rule.source === event.source && rule.detailType === event['detail-type'], push event to queues.get(rule.targetQueue); return { matchedRules: count, status: 'EVENT_ROUTED_SUCCESSFULLY' }.",
    "eTest": "const queues = new Map([['inventory_queue', []], ['notification_queue', []]]);\nconst rules = [\n  { source: 'order_service', detailType: 'OrderCreated', targetQueue: 'inventory_queue' },\n  { source: 'order_service', detailType: 'OrderCreated', targetQueue: 'notification_queue' }\n];\nconst event = { source: 'order_service', 'detail-type': 'OrderCreated', detail: { orderId: 'ord_99' } };\nconst res = routeMicroserviceEvent(event, rules, queues);\nif (res.matchedRules !== 2 || queues.get('inventory_queue').length !== 1 || queues.get('notification_queue').length !== 1) throw new Error('Microservices event fanout routing failed');\nconst unmatchedEvent = { source: 'auth_service', 'detail-type': 'UserLogin' };\nconst unres = routeMicroserviceEvent(unmatchedEvent, rules, queues);\nif (unres.matchedRules !== 0) throw new Error('Unmatched event should route to 0 queues');\nif (res.status !== 'EVENT_ROUTED_SUCCESSFULLY') throw new Error('Status flag check failed');",
    "aTitle": "Dead Letter Queue (DLQ) Redrive Policy Evaluator",
    "aDesc": "Implement function `shouldSendToDlq(receiveCount, maxReceiveCount)` determining if failed message should be routed to DLQ.",
    "aStarter": "function shouldSendToDlq(receives, maxReceives) {\n  // TODO: Return true if receiveCount strictly exceeds the configured maxReceiveCount threshold\n  \n}",
    "aHint": "Compare receiveCount > maxReceiveCount; return boolean indicating whether message must transition to Dead Letter Queue.",
    "aTest": "if (shouldSendToDlq(4, 3) !== true || shouldSendToDlq(2, 3) !== false) throw new Error('DLQ redrive check failed');\nif (shouldSendToDlq(3, 3) !== false) throw new Error('Equal receive count should attempt processing before DLQ');"
  },
  {
    "day": 22,
    "title": "AWS ECS & AWS Fargate Serverless Container Architecture",
    "desc": "Run containers without managing EC2 servers: ECS Task Definitions, Fargate compute configurations, task networking (awsvpc), and IAM Task Execution Roles.",
    "syllabus": [
      "ECS Launch Types: EC2 Launch Type (Managed instance cluster) vs AWS Fargate (Serverless container runtime).",
      "Task Execution Role (Pulling ECR images/logs) vs Task Role (Application AWS API permissions).",
      "`awsvpc` Network Mode: Every Fargate container receives dedicated ENI and private IP inside VPC."
    ],
    "eTitle": "AWS Fargate CPU & RAM Valid Combination Validator",
    "eDesc": "Implement function `validateFargateTaskSize(cpuUnits, memoryMb)` verifying that CPU and RAM configuration adheres to AWS Fargate hardware rules.",
    "eStarter": "function validateFargateTaskSize(cpu, memory) {\n  // TODO: Validate that cpuUnits (256, 512, 1024, 2048, 4096) and memoryMb are an allowed AWS Fargate combination\n  \n}",
    "eHint": "Check cpu: 256 -> 512, 1024, 2048 MB; 512 -> 1024-4096 MB; 1024 -> 2048-8192 MB; 2048 -> 4096-16384 MB; 4096 -> 8192-30720 MB; return boolean.",
    "eTest": "if (validateFargateTaskSize(256, 512) !== true) throw new Error('256 CPU with 512MB RAM must be valid');\nif (validateFargateTaskSize(256, 8192) !== false) throw new Error('256 CPU cannot support 8192MB RAM');\nif (validateFargateTaskSize(1024, 4096) !== true) throw new Error('1024 CPU with 4096MB RAM must be valid');",
    "aTitle": "ECS Container Definition Environment Fuser",
    "aDesc": "Implement function `fuseContainerEnvVars(baseEnv, secretsList)` merging plain-text environment variables and Secrets Manager ARNs into task definition format.",
    "aStarter": "function fuseContainerEnvVars(base, secrets) {\n  // TODO: Merge base environment array and secrets array into a unified ECS container definition environment list\n  \n}",
    "aHint": "Return object containing environment: baseEnv, secrets: secretsList, totalVariableCount: baseEnv.length + secretsList.length.",
    "aTest": "const f = fuseContainerEnvVars([{ name: 'PORT', value: '8080' }], [{ name: 'DB_PASS', valueFrom: 'arn:secret' }]);\nif (f.totalVariableCount !== 2 || f.environment[0].name !== 'PORT') throw new Error('ECS environment fusion failed');"
  },
  {
    "day": 23,
    "title": "AWS Step Functions & Distributed Saga Pattern Orchestration",
    "desc": "Orchestrate multi-step distributed microservice workflows with AWS Step Functions: State machine definition (ASL), Parallel states, Choice states, and Distributed Sagas with compensation transactions.",
    "syllabus": [
      "Amazon States Language (ASL): JSON-based state machines defining Task, Choice, Parallel, Map, and Fail states.",
      "The Saga Pattern: Managing distributed transactions across microservices via forward execution and reverse compensating rollbacks.",
      "Standard Workflows (Auditable, up to 1 year) vs Express Workflows (High-volume, sub-second)."
    ],
    "eTitle": "Distributed Saga Workflow Compensation Engine",
    "eDesc": "Implement function `executeSagaWorkflow(stepsArray, transactionContext)` executing steps sequentially and executing reverse compensation handlers on failure.",
    "eStarter": "function executeSagaWorkflow(steps, ctx) {\n  // TODO: Execute steps sequentially; if any step throws, execute compensate() on all previously succeeded steps in reverse order\n  \n}",
    "eHint": "Track completed steps in a stack; try executing step.execute(ctx); on catch, iterate completed stack in reverse calling step.compensate(ctx); return { success: boolean }.",
    "eTest": "let compensated = 0;\nconst steps = [\n  { name: 'ReserveHotel', execute: async () => {}, compensate: async () => { compensated++; } },\n  { name: 'ChargeCard', execute: async () => { throw new Error('Declined'); }, compensate: async () => {} }\n];\nconst res = await executeSagaWorkflow(steps, {});\nif (res.success !== false || compensated !== 1) throw new Error('Saga pattern failed to execute compensating transaction');\nconst okSteps = [{ name: 'Step1', execute: async () => {}, compensate: async () => {} }];\nconst okRes = await executeSagaWorkflow(okSteps, {});\nif (okRes.success !== true) throw new Error('Successful saga execution failed');\nif (compensated !== 1) throw new Error('Compensation count mismatch');",
    "aTitle": "Step Functions ASL State Type Validator",
    "aDesc": "Implement function `isValidAslStateType(stateType)` verifying that stateType belongs to standard ASL states (Task, Choice, Parallel, Map, Pass, Wait, Succeed, Fail).",
    "aStarter": "function isValidAslStateType(type) {\n  // TODO: Check if type string is in ['Task', 'Choice', 'Parallel', 'Map', 'Pass', 'Wait', 'Succeed', 'Fail']\n  \n}",
    "aHint": "Use a Set of valid ASL state type strings: Task, Choice, Parallel, Map, Pass, Wait, Succeed, Fail; return set.has(stateType).",
    "aTest": "if (isValidAslStateType('Task') !== true || isValidAslStateType('UnknownState') !== false) throw new Error('ASL state type check failed');\nif (isValidAslStateType('Parallel') !== true) throw new Error('Parallel ASL state check failed');"
  },
  {
    "day": 24,
    "title": "Infrastructure as Code (IaC) with Terraform & State Management",
    "desc": "Automate cloud infrastructure declaratively with Terraform: HCL syntax, Providers, Resources, Variables, Remote State S3 backends with DynamoDB locking.",
    "syllabus": [
      "Declarative IaC: Terraform HCL (`resource \"aws_s3_bucket\"`) vs Imperative scripts.",
      "Terraform State (`terraform.tfstate`): Mapping declarative configuration to real-world AWS resource IDs.",
      "State Locking: Amazon S3 remote state + DynamoDB LockID table preventing concurrent conflicting applies."
    ],
    "eTitle": "Terraform Resource Address Identifier Parser",
    "eDesc": "Implement function `parseTerraformAddress(addressString)` extracting resource type, resource name, and module hierarchy.",
    "eStarter": "function parseTerraformAddress(address) {\n  // TODO: Parse standard Terraform address string (e.g. module.vpc.aws_subnet.public[0]) into structured object\n  \n}",
    "eHint": "Split address by '.'; parse module prefix if present; extract resourceType (e.g. aws_s3_bucket) and resourceName.",
    "eTest": "const res = parseTerraformAddress('aws_s3_bucket.data_lake');\nif (res.resourceType !== 'aws_s3_bucket' || res.resourceName !== 'data_lake') throw new Error('Standard Terraform address parse failed');\nconst modRes = parseTerraformAddress('module.vpc.aws_subnet.public');\nif (modRes.module !== 'vpc' || modRes.resourceType !== 'aws_subnet') throw new Error('Module Terraform address parse failed');\nif (modRes.resourceName !== 'public') throw new Error('Module resource name failed');",
    "aTitle": "Terraform State Lock Table Schema Validator",
    "aDesc": "Implement function `isValidDynamoDbLockTable(tableSchema)` verifying that DynamoDB lock table has primary partition key named 'LockID' of type String.",
    "aStarter": "function isValidDynamoDbLockTable(schema) {\n  // TODO: Verify schema has partition key AttributeName === 'LockID' and AttributeType === 'S'\n  \n}",
    "aHint": "Check if schema.partitionKey.name === 'LockID' && schema.partitionKey.type === 'S'; return boolean.",
    "aTest": "const valid = { partitionKey: { name: 'LockID', type: 'S' } };\nif (isValidDynamoDbLockTable(valid) !== true) throw new Error('Valid LockID schema was rejected');\nconst invalid = { partitionKey: { name: 'id', type: 'N' } };\nif (isValidDynamoDbLockTable(invalid) !== false) throw new Error('Invalid lock schema should fail');"
  },
  {
    "day": 25,
    "title": "Amazon CloudWatch Metrics, Log Insights & Alarms",
    "desc": "Observe cloud workloads: CloudWatch Metrics, Metric Math, Log Groups with filter patterns, Composite Alarms, and automated SNS notifications.",
    "syllabus": [
      "CloudWatch Metric Dimensions: Name, Value, Timestamp, Unit, and Dimensions (e.g. `InstanceId`).",
      "CloudWatch Alarms: Static thresholds vs Anomaly Detection; Evaluation Periods (e.g. 3 consecutive breaches).",
      "CloudWatch Logs Insights: Fast indexing and SQL-like structured querying (`fields @timestamp, @message | filter status >= 500`)."
    ],
    "eTitle": "CloudWatch Consecutive Datapoint Alarm Evaluator",
    "eDesc": "Implement function `evaluateCloudWatchAlarm(datapoints, threshold, comparisonOperator, evaluationPeriods)` determining if alarm triggers.",
    "eStarter": "function evaluateCloudWatchAlarm(datapoints, threshold, op, periods) {\n  // TODO: Check if last N datapoints consecutively breach threshold according to comparisonOperator\n  \n}",
    "eHint": "Slice last evaluationPeriods datapoints; verify if every point breaches threshold based on op ('GreaterThanThreshold' -> pt > threshold); return 'ALARM' or 'OK'.",
    "eTest": "const pts = [45, 60, 85, 90, 95];\nif (evaluateCloudWatchAlarm(pts, 80, 'GreaterThanThreshold', 3) !== 'ALARM') throw new Error('3 consecutive breaches should trigger ALARM');\nif (evaluateCloudWatchAlarm([70, 75, 80], 80, 'GreaterThanThreshold', 3) !== 'OK') throw new Error('Non-breaching points should return OK');\nif (evaluateCloudWatchAlarm([85, 90, 75], 80, 'GreaterThanThreshold', 3) !== 'OK') throw new Error('Intermittent dip must reset consecutive alarm evaluation');",
    "aTitle": "CloudWatch Log Insights Query Filter Formatter",
    "aDesc": "Implement function `formatLogFilterQuery(statusCodeThreshold)` generating a standard CloudWatch Logs Insights query string to isolate error logs.",
    "aStarter": "function formatLogFilterQuery(codeThreshold) {\n  // TODO: Return CloudWatch Logs Insights query string filtering logs where status is greater than or equal to threshold\n  \n}",
    "aHint": "Return string formatted as: `fields @timestamp, @message | filter status >= ${statusCodeThreshold} | sort @timestamp desc | limit 50`.",
    "aTest": "const q = formatLogFilterQuery(500);\nif (!q.includes('filter status >= 500') || !q.includes('fields @timestamp')) throw new Error('Log query formatter failed');"
  },
  {
    "day": 26,
    "title": "AWS Key Management Service (KMS) & Envelope Encryption",
    "desc": "Protect sensitive data with AWS KMS: Customer Managed Keys (CMK), Key Policies, Envelope Encryption (`GenerateDataKey`), and CloudTrail key auditability.",
    "syllabus": [
      "Envelope Encryption: Encrypting plaintext data with a Data Key (DEK), and encrypting the Data Key with a KMS Master Key (CMK).",
      "KMS Key Hierarchy: Root HSM Master Key -> Customer Managed Key (CMK) -> Plaintext/Ciphertext Data Encryption Key.",
      "Automatic Key Rotation: Annual automated rotation of cryptographic key material without re-encrypting existing data."
    ],
    "eTitle": "KMS Envelope Encryption Simulator",
    "eDesc": "Implement function `simulateEnvelopeEncryption(plainData, kmsMasterKeyArn)` generating simulated data key and encrypted payload.",
    "eStarter": "function simulateEnvelopeEncryption(plainData, masterKeyArn) {\n  // TODO: Simulate GenerateDataKey, encrypt plainData with dataKey, and return { ciphertext, encryptedDataKey, kmsMasterKeyId }\n  \n}",
    "eHint": "Generate random dataKey; simulate encryption of plainData; encrypt dataKey with masterKeyArn; return envelope object containing ciphertext, encryptedDataKey, and kmsMasterKeyId.",
    "eTest": "const env = simulateEnvelopeEncryption('CustomerSSN_123', 'arn:aws:kms:us-east-1:key-123');\nif (!env.ciphertext || !env.encryptedDataKey || env.kmsMasterKeyId !== 'arn:aws:kms:us-east-1:key-123') throw new Error('Envelope encryption failed');\nif (env.ciphertext.includes('CustomerSSN_123')) throw new Error('Plaintext must not be exposed in ciphertext');\nconst env2 = simulateEnvelopeEncryption('CreditCard_456', 'arn:aws:kms:us-east-1:key-456');\nif (env2.kmsMasterKeyId !== 'arn:aws:kms:us-east-1:key-456') throw new Error('Key ARN assignment failed');",
    "aTitle": "KMS Key Policy Condition Checker",
    "aDesc": "Implement function `isKeyPolicyRestricted(keyPolicy)` verifying that KMS policy contains explicit ViaService or Principal restrictions.",
    "aStarter": "function isKeyPolicyRestricted(policy) {\n  // TODO: Check if any statement in keyPolicy enforces kms:ViaService or specific Principal ARNs\n  \n}",
    "aHint": "Check if policy.Statement.some(s => s.Condition && (s.Condition['StringEquals'] && s.Condition['StringEquals']['kms:ViaService'])); return boolean.",
    "aTest": "const pol = { Statement: [{ Effect: 'Allow', Condition: { StringEquals: { 'kms:ViaService': 's3.us-east-1.amazonaws.com' } } }] };\nif (isKeyPolicyRestricted(pol) !== true) throw new Error('ViaService restriction check failed');\nconst openPol = { Statement: [{ Effect: 'Allow', Principal: '*' }] };\nif (isKeyPolicyRestricted(openPol) !== false) throw new Error('Open policy should not be marked restricted');"
  },
  {
    "day": 27,
    "title": "AWS WAF & AWS Shield: DDoS & SQLi/XSS Protection",
    "desc": "Defend web applications from attacks: AWS WAF Web ACLs, Managed Rule Groups (SQL Injection, XSS, Common Rule Set), Rate-based rules, and AWS Shield Advanced.",
    "syllabus": [
      "Layer 7 Web Application Firewall: Inspecting HTTP headers, body, query strings, and URI paths.",
      "Rate-Based Rules: Automatically blocking IP addresses exceeding N requests per 5-minute evaluation window.",
      "AWS Shield Standard (Automatic SYN/UDP flood protection) vs AWS Shield Advanced (DDoS response team + cost protection)."
    ],
    "eTitle": "AWS WAF Web ACL Request Inspection Engine",
    "eDesc": "Implement function `inspectWafRequest(webAclRules, httpRequest)` evaluating SQL injection signatures and IP rate limits to decide ALLOW or BLOCK.",
    "eStarter": "function inspectWafRequest(rules, req) {\n  // TODO: Check for SQLi patterns in query/body or IP rate limit breaches and return { action: 'BLOCK' | 'ALLOW' }\n  \n}",
    "eHint": "Iterate rules: if rule.type === 'SQLI' and query matches /SELECT|INSERT|DROP|OR 1=1/i, return { action: 'BLOCK', reason: 'SQLI_DETECTED' }; if rule.type === 'RATE_LIMIT' and ipRequestCount > rule.limit return { action: 'BLOCK', reason: 'RATE_EXCEEDED' }; default { action: 'ALLOW' }.",
    "eTest": "const rules = [{ type: 'SQLI' }, { type: 'RATE_LIMIT', limit: 100 }];\nif (inspectWafRequest(rules, { query: 'SELECT * FROM users' }).action !== 'BLOCK') throw new Error('SQLi was not blocked by WAF');\nif (inspectWafRequest(rules, { query: 'page=1', ipRequestCount: 50 }).action !== 'ALLOW') throw new Error('Clean request was not allowed by WAF');\nif (inspectWafRequest(rules, { query: 'page=1', ipRequestCount: 150 }).action !== 'BLOCK') throw new Error('Rate limit breach was not blocked by WAF');",
    "aTitle": "WAF IP Set CIDR Block Range Validator",
    "aDesc": "Implement function `isValidWafIpSet(ipRanges)` ensuring that all elements are valid IPv4 or IPv6 CIDR notations.",
    "aStarter": "function isValidWafIpSet(ips) {\n  // TODO: Validate that every string in ips array conforms to standard IPv4 or IPv6 CIDR format\n  \n}",
    "aHint": "Use regex /^(\\d{1,3}\\.){3}\\d{1,3}\\/\\d{1,2}$/ to validate IPv4 CIDRs; verify all array items match.",
    "aTest": "if (isValidWafIpSet(['192.168.1.0/24', '10.0.0.0/8']) !== true || isValidWafIpSet(['not-an-ip']) !== false) throw new Error('WAF IP set validation failed');"
  },
  {
    "day": 28,
    "title": "AWS FinOps: Cost Optimization, Compute Savings Plans & Cost Allocation Tags",
    "desc": "Govern cloud spending with FinOps principles: Cost Allocation Tags, Compute Savings Plans, EC2 Right-Sizing, S3 Storage Lens, and AWS Budgets alerts.",
    "syllabus": [
      "The FinOps Framework: Inform (Visibility/Allocation), Optimize (Right-sizing/Discounts), Operate (Continuous governance).",
      "Savings Plans vs Reserved Instances: Compute Savings Plans offer flexibility across EC2, Fargate, and Lambda.",
      "Cost Allocation Tags: Mandatory tagging (`Environment`, `CostCenter`, `Project`) for departmental chargebacks."
    ],
    "eTitle": "Compute Savings Plan Cost & Break-Even Calculator",
    "eDesc": "Implement function `calculateCloudBill(totalHours, savingsPlanRate, onDemandRate, committedHours)` computing blended monthly cloud computing bill.",
    "eStarter": "function calculateCloudBill(totalHours, spRate, odRate, committedHours) {\n  // TODO: Compute spHours = min(totalHours, committedHours), odHours = max(0, totalHours - committedHours), and total bill\n  \n}",
    "eHint": "spCost = Math.min(totalHours, committedHours) * savingsPlanRate; odCost = Math.max(0, totalHours - committedHours) * onDemandRate; return Number((spCost + odCost).toFixed(2)).",
    "eTest": "if (calculateCloudBill(100, 0.05, 0.10, 80) !== 6.00) throw new Error('FinOps bill calculation failed: (80 * 0.05) + (20 * 0.10) = 6.00');\nif (calculateCloudBill(60, 0.05, 0.10, 0) !== 6.00) throw new Error('All on-demand: 60 * 0.10 should equal 6.00');\nif (calculateCloudBill(100, 0.05, 0.10, 100) !== 5.00) throw new Error('100% savings plan coverage failed');",
    "aTitle": "Mandatory Cost Allocation Tag Auditor",
    "aDesc": "Implement function `auditResourceTags(tagsObject, requiredTags)` verifying that required organizational cost tags (Environment, Project, Owner) are present.",
    "aStarter": "function auditResourceTags(tags, required) {\n  // TODO: Check if every string in required tags list exists as a non-empty key in tagsObject\n  \n}",
    "aHint": "Check if requiredTags.every(t => tagsObject && tagsObject[t] && tagsObject[t].length > 0); return boolean.",
    "aTest": "const tags = { Environment: 'production', CostCenter: 'CC-101', Owner: 'devops' };\nif (auditResourceTags(tags, ['Environment', 'CostCenter']) !== true) throw new Error('Valid tags should pass audit');\nif (auditResourceTags(tags, ['Environment', 'BillingId']) !== false) throw new Error('Missing tag should fail audit');"
  },
  {
    "day": 29,
    "title": "Disaster Recovery (DR) Strategies: Backup, Pilot Light & Warm Standby",
    "desc": "Architect multi-region Disaster Recovery architectures: Recovery Time Objective ($RTO$), Recovery Point Objective ($RPO$), Backup & Restore, Pilot Light, Warm Standby, and Multi-Site Active-Active.",
    "syllabus": [
      "RTO vs RPO: RTO = Maximum allowable downtime; RPO = Maximum allowable data loss in time.",
      "The 4 DR Strategies: 1. Backup & Restore (Hours/Days, Lowest cost); 2. Pilot Light (Core data live, minutes); 3. Warm Standby (Scaled-down live replica, seconds); 4. Multi-Site Active-Active (Real-time, zero downtime).",
      "Automating Multi-Region Failover: Route 53 health check alarms triggering Aurora global database failover."
    ],
    "eTitle": "Disaster Recovery Strategy Selector",
    "eDesc": "Implement function `selectDrStrategy(targetRtoMinutes, targetRpoMinutes)` recommending optimal DR tier balancing cost and business continuity.",
    "eStarter": "function selectDrStrategy(rtoMinutes, rpoMinutes) {\n  // TODO: Return MultiSiteActiveActive if rto==0, WarmStandby if rto<=15, PilotLight if rto<=120, else BackupAndRestore\n  \n}",
    "eHint": "If (targetRtoMinutes === 0 && targetRpoMinutes === 0) return 'MultiSiteActiveActive'; if (targetRtoMinutes <= 15) return 'WarmStandby'; if (targetRtoMinutes <= 120) return 'PilotLight'; return 'BackupAndRestore'.",
    "eTest": "if (selectDrStrategy(0, 0) !== 'MultiSiteActiveActive') throw new Error('Zero downtime requires MultiSiteActiveActive');\nif (selectDrStrategy(10, 5) !== 'WarmStandby') throw new Error('10m RTO requires WarmStandby');\nif (selectDrStrategy(60, 30) !== 'PilotLight') throw new Error('60m RTO requires PilotLight');\nif (selectDrStrategy(1440, 720) !== 'BackupAndRestore') throw new Error('24h RTO should use BackupAndRestore');",
    "aTitle": "RPO Data Loss Financial Impact Calculator",
    "aDesc": "Implement function `calculateRpoDataLossCost(rpoMinutes, transactionsPerMinute, averageTransactionValue)` computing financial revenue loss during data recovery window.",
    "aStarter": "function calculateRpoDataLossCost(rpo, tpm, avgVal) {\n  // TODO: Compute total lost transactions = rpoMinutes * transactionsPerMinute and multiply by averageTransactionValue\n  \n}",
    "aHint": "Compute totalLostTransactions = rpoMinutes * transactionsPerMinute; return totalLostTransactions * averageTransactionValue.",
    "aTest": "const loss = calculateRpoDataLossCost(15, 100, 50); // 15 * 100 * 50 = $75,000\nif (loss !== 75000) throw new Error('RPO loss calculation failed');\nif (calculateRpoDataLossCost(0, 100, 50) !== 0) throw new Error('Zero RPO loss should equal 0');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Global Resilient Multi-Region FinTech Banking Infrastructure with Active-Active Failover",
    "desc": "Final Capstone Synthesis: Build a global resilient FinTech banking platform: Multi-Region Active-Active deployment, DynamoDB Global Tables, Route 53 Latency routing, SQS/SNS microservices, AWS WAF, KMS envelope encryption, and automated multi-region DR failover.",
    "syllabus": [
      "Enterprise Multi-Region Active-Active Cloud Architecture Synthesis.",
      "Zero-Data-Loss FinTech Transaction Invariants & Cryptographic Auditing.",
      "Master Cloud Architect Boardroom Certification."
    ],
    "eTitle": "Global Multi-Region Active-Active Transaction Router",
    "eDesc": "Implement function `routeGlobalBankingTransaction(regionStates, transactionPayload)` routing transactions to closest healthy region with lowest latency.",
    "eStarter": "function routeGlobalBankingTransaction(regions, tx) {\n  // TODO: Filter healthy regions, sort by latencyMs ascending, and route transaction to best region\n  \n}",
    "eHint": "Filter regions where region.healthStatus === 'HEALTHY'; sort by latencyMs ascending; if empty return { success: false, reason: 'NO_HEALTHY_REGIONS' }; return { success: true, routedRegion: healthy[0].regionCode, latencyMs: healthy[0].latencyMs }.",
    "eTest": "const regions = [\n  { regionCode: 'us-east-1', healthStatus: 'HEALTHY', latencyMs: 25 },\n  { regionCode: 'eu-west-1', healthStatus: 'HEALTHY', latencyMs: 110 },\n  { regionCode: 'ap-southeast-1', healthStatus: 'UNHEALTHY', latencyMs: 15 }\n];\nconst res = routeGlobalBankingTransaction(regions, { amount: 5000 });\nif (res.success !== true || res.routedRegion !== 'us-east-1') throw new Error('Global banking transaction should route to closest healthy region us-east-1');\nconst allDead = [{ regionCode: 'us-east-1', healthStatus: 'UNHEALTHY', latencyMs: 20 }];\nif (routeGlobalBankingTransaction(allDead, {}).success !== false) throw new Error('All unhealthy regions should fail gracefully');\nif (res.latencyMs !== 25) throw new Error('Latency property mismatch');",
    "aTitle": "Multi-Region Cloud Architecture Readiness Auditor",
    "aDesc": "Implement function `auditGlobalCloudReadiness(multiRegionReady, securityReady, finOpsScore, backupValidated)` certifying enterprise cloud architecture readiness.",
    "aStarter": "function auditGlobalCloudReadiness(mr, sec, finOps, backup) {\n  // TODO: Verify all readiness flags are true and finOpsScore >= 80, returning certification report\n  \n}",
    "aHint": "isCertified = Boolean(multiRegionReady && securityReady && finOpsScore >= 80 && backupValidated); return { isEnterpriseCertified: isCertified, complianceGrade: isCertified ? 'TIER_1_ENTERPRISE_CLOUD_ARCHITECT' : 'REMEDIATION_REQUIRED' }.",
    "aTest": "const cert = auditGlobalCloudReadiness(true, true, 85, true);\nif (!cert.isEnterpriseCertified || cert.complianceGrade !== 'TIER_1_ENTERPRISE_CLOUD_ARCHITECT') throw new Error('Cloud readiness certification failed');\nconst fail = auditGlobalCloudReadiness(true, false, 90, true);\nif (fail.isEnterpriseCertified) throw new Error('Unsecured architecture should not pass certification');"
  }
];

export const CLOUD_30_DAYS_QUESTS: CourseQuest[] = CLOUD_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('cloud', idx + 1, cfg)
);
