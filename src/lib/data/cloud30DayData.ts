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
    "eDesc": "Implement function getResponsibilityOwner(cloudLayer, serviceModel) returning 'AWS' or 'CUSTOMER'.",
    "eStarter": "function getResponsibilityOwner(cloudLayer, serviceModel) {\n  if (cloudLayer === 'PHYSICAL_DATACENTER' || cloudLayer === 'HYPERVISOR_HARDWARE') return 'AWS';\n  if (serviceModel === 'IaaS') {\n    if (['OS_PATCHING', 'APP_CODE', 'IAM_CONFIG', 'NETWORK_FIREWALL_RULES'].includes(cloudLayer)) return 'CUSTOMER';\n  }\n  if (serviceModel === 'PaaS') {\n    if (['OS_PATCHING', 'RUNTIME_ENVIRONMENT'].includes(cloudLayer)) return 'AWS';\n    if (['APP_CODE', 'IAM_CONFIG'].includes(cloudLayer)) return 'CUSTOMER';\n  }\n  if (serviceModel === 'SaaS') return 'AWS';\n  return 'CUSTOMER';\n}",
    "eHint": "Physical datacenter is always AWS; on IaaS customer manages OS patching and app code; on SaaS AWS manages everything except customer data.",
    "eTest": "if (getResponsibilityOwner('PHYSICAL_DATACENTER', 'IaaS') !== 'AWS') throw new Error('Physical DC must be AWS');\nif (getResponsibilityOwner('OS_PATCHING', 'IaaS') !== 'CUSTOMER') throw new Error('IaaS OS patching is Customer');\nif (getResponsibilityOwner('OS_PATCHING', 'PaaS') !== 'AWS') throw new Error('PaaS OS patching is AWS');",
    "aTitle": "Cloud Model Categorizer",
    "aDesc": "Implement function categorizeCloudModel(awsService) returning IaaS, PaaS, or SaaS.",
    "aStarter": "function categorizeCloudModel(service) {\n  const map = { 'EC2': 'IaaS', 'EBS': 'IaaS', 'Beanstalk': 'PaaS', 'RDS': 'PaaS', 'WorkDocs': 'SaaS' };\n  return map[service] || 'UNKNOWN';\n}",
    "aHint": "Map EC2/EBS to IaaS, RDS/Beanstalk to PaaS, WorkDocs to SaaS.",
    "aTest": "if (categorizeCloudModel('EC2') !== 'IaaS' || categorizeCloudModel('RDS') !== 'PaaS') throw new Error('Service categorization failed');"
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
    "eDesc": "Implement function isTopologyFaultTolerant(nodeDeployments) returning true if nodes span at least 2 distinct Availability Zones.",
    "eStarter": "function isTopologyFaultTolerant(nodes) {\n  const uniqueAZs = new Set(nodes.map(n => n.availabilityZone));\n  return uniqueAZs.size >= 2;\n}",
    "eHint": "Count distinct availabilityZone values across nodes using a Set.",
    "eTest": "const singleAz = [{ id: 'i-1', availabilityZone: 'us-east-1a' }, { id: 'i-2', availabilityZone: 'us-east-1a' }];\nif (isTopologyFaultTolerant(singleAz) !== false) throw new Error('Single AZ topology is not fault tolerant');\nconst multiAz = [{ id: 'i-1', availabilityZone: 'us-east-1a' }, { id: 'i-2', availabilityZone: 'us-east-1b' }];\nif (isTopologyFaultTolerant(multiAz) !== true) throw new Error('Multi AZ topology must be fault tolerant');",
    "aTitle": "Region Code Validator",
    "aDesc": "Implement function isValidAwsRegion(regionCode) validating standard region format.",
    "aStarter": "function isValidAwsRegion(code) {\n  return /^[a-z]{2}-[a-z]+-[0-9]+$/.test(code);\n}",
    "aHint": "Verify standard pattern like us-east-1, eu-west-1, ap-south-1.",
    "aTest": "if (isValidAwsRegion('us-east-1') !== true || isValidAwsRegion('invalid-region') !== false) throw new Error('Region regex failed');"
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
    "eDesc": "Implement function getUsableSubnetIps(cidrMask) calculating usable host IPs after deducting AWS 5 reserved addresses.",
    "eStarter": "function getUsableSubnetIps(cidrMask) {\n  if (cidrMask < 16 || cidrMask > 28) return 0;\n  const totalIps = Math.pow(2, 32 - cidrMask);\n  return Math.max(0, totalIps - 5); // 5 AWS reserved addresses\n}",
    "eHint": "Total IPs is 2^(32 - mask); deduct 5 AWS reserved IPs.",
    "eTest": "if (getUsableSubnetIps(24) !== 251) throw new Error('/24 must have 256 - 5 = 251 usable IPs');\nif (getUsableSubnetIps(28) !== 11) throw new Error('/28 must have 16 - 5 = 11 usable IPs');",
    "aTitle": "Public Route Table Inspector",
    "aDesc": "Implement function hasInternetGatewayRoute(routes) returning true if route exists to 0.0.0.0/0 via igw-.",
    "aStarter": "function hasInternetGatewayRoute(routes) {\n  return routes.some(r => r.destination === '0.0.0.0/0' && r.target.startsWith('igw-'));\n}",
    "aHint": "Check for 0.0.0.0/0 target pointing to IGW.",
    "aTest": "const r = [{ destination: '10.0.0.0/16', target: 'local' }, { destination: '0.0.0.0/0', target: 'igw-123' }];\nif (hasInternetGatewayRoute(r) !== true) throw new Error('IGW check failed');"
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
    "eDesc": "Implement function evaluateSecurityGroupTraffic(ruleList, traffic) returning true if an allow rule matches protocol and port range.",
    "eStarter": "function evaluateSecurityGroupTraffic(rules, packet) {\n  if (packet.isReturnTraffic) return true; // Stateful return traffic automatically allowed!\n  return rules.some(r => {\n    if (r.protocol !== 'ALL' && r.protocol !== packet.protocol) return false;\n    if (packet.port < r.fromPort || packet.port > r.toPort) return false;\n    return r.cidr === '0.0.0.0/0' || r.cidr === packet.sourceIp;\n  });\n}",
    "eHint": "Return traffic is automatically allowed due to stateful connection tracking.",
    "eTest": "const rules = [{ protocol: 'TCP', fromPort: 443, toPort: 443, cidr: '0.0.0.0/0' }];\nif (evaluateSecurityGroupTraffic(rules, { protocol: 'TCP', port: 443, sourceIp: '1.2.3.4' }) !== true) throw new Error('Port 443 HTTPS should be allowed');\nif (evaluateSecurityGroupTraffic(rules, { protocol: 'TCP', port: 80, sourceIp: '1.2.3.4' }) !== false) throw new Error('Port 80 HTTP should be blocked');\nif (evaluateSecurityGroupTraffic([], { protocol: 'TCP', port: 9999, isReturnTraffic: true }) !== true) throw new Error('Stateful return traffic must be allowed');",
    "aTitle": "NACL Rule Number Sorter",
    "aDesc": "Implement function sortNaclRules(rules) sorting ascending by rule number.",
    "aStarter": "function sortNaclRules(rules) {\n  return [...rules].sort((a, b) => a.ruleNumber - b.ruleNumber);\n}",
    "aHint": "Sort array ascending by ruleNumber.",
    "aTest": "const sorted = sortNaclRules([{ ruleNumber: 200 }, { ruleNumber: 100 }]);\nif (sorted[0].ruleNumber !== 100) throw new Error('NACL sort failed');"
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
    "eDesc": "Implement function validateVpcTopology(vpcConfig) ensuring at least 2 AZs, 2 public subnets with IGW, and 2 private subnets with NAT Gateways.",
    "eStarter": "function validateVpcTopology(cfg) {\n  if (!cfg.cidr || !cfg.subnets || cfg.subnets.length < 4) return { valid: false, error: 'INSUFFICIENT_SUBNETS' };\n  const azs = new Set(cfg.subnets.map(s => s.az));\n  if (azs.size < 2) return { valid: false, error: 'REQUIRES_MULTI_AZ' };\n  const publicSubnets = cfg.subnets.filter(s => s.type === 'PUBLIC');\n  const privateSubnets = cfg.subnets.filter(s => s.type === 'PRIVATE');\n  if (publicSubnets.length < 2 || privateSubnets.length < 2) return { valid: false, error: 'MISSING_REDUNDANT_TIERS' };\n  if (!cfg.hasInternetGateway) return { valid: false, error: 'MISSING_IGW' };\n  if (!cfg.hasNatGateway) return { valid: false, error: 'MISSING_NAT_GATEWAY' };\n  return { valid: true, azCount: azs.size, subnetCount: cfg.subnets.length };\n}",
    "eHint": "Verify at least 2 AZs, 2 public, 2 private, hasInternetGateway, and hasNatGateway.",
    "eTest": "const validVpc = {\n  cidr: '10.0.0.0/16',\n  hasInternetGateway: true,\n  hasNatGateway: true,\n  subnets: [\n    { id: 's-1', az: 'us-east-1a', type: 'PUBLIC' },\n    { id: 's-2', az: 'us-east-1b', type: 'PUBLIC' },\n    { id: 's-3', az: 'us-east-1a', type: 'PRIVATE' },\n    { id: 's-4', az: 'us-east-1b', type: 'PRIVATE' }\n  ]\n};\nconst res = validateVpcTopology(validVpc);\nif (!res.valid || res.azCount !== 2) throw new Error('Valid VPC topology was rejected');\nconst invalidVpc = { ...validVpc, hasNatGateway: false };\nif (validateVpcTopology(invalidVpc).valid !== false) throw new Error('VPC without NAT gateway should be rejected');",
    "aTitle": "Subnet CIDR Non-Overlap Checker",
    "aDesc": "Implement function areSubnetsDistinct(subnets) ensuring unique CIDR blocks.",
    "aStarter": "function areSubnetsDistinct(subnets) {\n  const cidrs = subnets.map(s => s.cidr);\n  return new Set(cidrs).size === cidrs.length;\n}",
    "aHint": "Check if Set size matches array length.",
    "aTest": "if (areSubnetsDistinct([{ cidr: '10.0.1.0/24' }, { cidr: '10.0.1.0/24' }]) !== false) throw new Error('Duplicate CIDR should fail');"
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
    "eDesc": "Implement function evaluateIamPermission(statements, request) resolving Allow/Deny decisions with Explicit Deny precedence.",
    "eStarter": "function evaluateIamPermission(statements, req) {\n  let hasAllow = false;\n  for (const s of statements) {\n    const actionMatch = s.action === '*' || s.action === req.action || (s.action.endsWith('*') && req.action.startsWith(s.action.slice(0, -1)));\n    const resourceMatch = s.resource === '*' || s.resource === req.resource;\n    if (actionMatch && resourceMatch) {\n      if (s.effect === 'Deny') return 'DENY'; // Explicit Deny overrides everything!\n      if (s.effect === 'Allow') hasAllow = true;\n    }\n  }\n  return hasAllow ? 'ALLOW' : 'DENY'; // Default Implicit Deny\n}",
    "eHint": "Iterate statements; if explicit Deny matches, return DENY immediately; default is Implicit Deny.",
    "eTest": "const statements = [\n  { effect: 'Allow', action: 's3:GetObject', resource: 'arn:aws:s3:::my-bucket/*' },\n  { effect: 'Deny', action: 's3:GetObject', resource: 'arn:aws:s3:::my-bucket/confidential/*' }\n];\nif (evaluateIamPermission(statements, { action: 's3:GetObject', resource: 'arn:aws:s3:::my-bucket/photo.jpg' }) !== 'ALLOW') throw new Error('Photo read should be allowed');\nif (evaluateIamPermission(statements, { action: 's3:GetObject', resource: 'arn:aws:s3:::my-bucket/confidential/keys.txt' }) !== 'DENY') throw new Error('Explicit Deny failed to override Allow');",
    "aTitle": "ARN String Parser",
    "aDesc": "Implement function parseArn(arnString) extracting service, region, account, and resource.",
    "aStarter": "function parseArn(arn) {\n  const parts = arn.split(':');\n  return { partition: parts[1], service: parts[2], region: parts[3], account: parts[4], resource: parts.slice(5).join(':') };\n}",
    "aHint": "Split by colon delimiter.",
    "aTest": "const p = parseArn('arn:aws:s3:us-east-1:123456789012:bucket/key');\nif (p.service !== 's3' || p.region !== 'us-east-1') throw new Error('ARN parser failed');"
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
    "eDesc": "Implement function calculateDesiredCapacity(currentCapacity, currentMetric, targetMetric, minCapacity, maxCapacity) returning next instance count.",
    "eStarter": "function calculateDesiredCapacity(curr, metric, target, min, max) {\n  const desired = Math.ceil(curr * (metric / target));\n  return Math.min(max, Math.max(min, desired));\n}",
    "eHint": "Formula is curr * (metric / target), clamped between min and max.",
    "eTest": "if (calculateDesiredCapacity(4, 80, 50, 2, 10) !== 7) throw new Error('Scale out failed: 4 * (80/50) = 6.4 -> 7 instances');\nif (calculateDesiredCapacity(4, 20, 50, 2, 10) !== 2) throw new Error('Scale in clamped to min 2 instances');",
    "aTitle": "Spot Instance Interruption Notice Simulator",
    "aDesc": "Implement function isSpotInterruptionImminent(minutesNotice) returning true if <= 2 minutes.",
    "aStarter": "function isSpotInterruptionImminent(noticeMin) {\n  return noticeMin <= 2;\n}",
    "aHint": "AWS Spot instances receive a 2-minute termination warning.",
    "aTest": "if (isSpotInterruptionImminent(2) !== true || isSpotInterruptionImminent(5) !== false) throw new Error('Spot notice check failed');"
  },
  {
    "day": 8,
    "title": "Application Load Balancer (ALB), Target Groups & Health Probes",
    "desc": "Configure Application Load Balancers (Layer 7), path-based routing, target health checks, and SSL termination.",
    "syllabus": [
      "ALB (Layer 7 HTTP/HTTPS) vs NLB (Layer 4 TCP/UDP Ultra-Low Latency).",
      "Target Groups: Registering EC2 instances, ECS containers, or Lambda functions with `/healthz` check intervals.",
      "Path-Based Routing: `/api/*` $\\to$ Backend Target Group, `/static/*` $\\to$ CDN/S3."
    ],
    "eTitle": "ALB Path-Based Route Dispatcher",
    "eDesc": "Implement function dispatchAlbRequest(rules, request) routing request to matching Target Group ARN.",
    "eStarter": "function dispatchAlbRequest(rules, req) {\n  for (const rule of rules) {\n    if (rule.pathPattern === '/*' || (rule.pathPattern.endsWith('/*') && req.path.startsWith(rule.pathPattern.slice(0, -2)))) {\n      return { targetGroupArn: rule.targetGroupArn, status: 200 };\n    }\n  }\n  return { targetGroupArn: null, status: 404 };\n}",
    "eHint": "Iterate rules; match prefix on wildcard rules.",
    "eTest": "const rules = [\n  { pathPattern: '/api/v1/*', targetGroupArn: 'arn:aws:tg-api' },\n  { pathPattern: '/*', targetGroupArn: 'arn:aws:tg-web' }\n];\nif (dispatchAlbRequest(rules, { path: '/api/v1/users' }).targetGroupArn !== 'arn:aws:tg-api') throw new Error('API route failed');\nif (dispatchAlbRequest(rules, { path: '/about' }).targetGroupArn !== 'arn:aws:tg-web') throw new Error('Default route failed');",
    "aTitle": "Target Health Status Aggregator",
    "aDesc": "Implement function getHealthyTargetCount(targets) counting healthy status.",
    "aStarter": "function getHealthyTargetCount(targets) {\n  return targets.filter(t => t.healthStatus === 'HEALTHY').length;\n}",
    "aHint": "Filter targets with healthStatus HEALTHY.",
    "aTest": "const t = [{ healthStatus: 'HEALTHY' }, { healthStatus: 'UNHEALTHY' }, { healthStatus: 'HEALTHY' }];\nif (getHealthyTargetCount(t) !== 2) throw new Error('Health counter failed');"
  },
  {
    "day": 9,
    "title": "Amazon S3 Object Storage & Lifecycle Management Tiering",
    "desc": "Master S3 Standard, S3 Intelligent-Tiering, Glacier Deep Archive, and automated lifecycle migration rules.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon S3 Object Storage & Lifecycle Management Tiering.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "S3 Lifecycle Transition Cost Calculator",
    "eDesc": "Implement function resolveS3StorageClass(objectAgeDays, accessFrequency) returning optimal storage tier.",
    "eStarter": "function resolveS3StorageClass(ageDays, freq) {\n  if (ageDays < 30) return 'S3_STANDARD';\n  if (freq === 'INFREQUENT' && ageDays < 90) return 'S3_STANDARD_IA';\n  if (ageDays >= 365) return 'S3_GLACIER_DEEP_ARCHIVE';\n  if (ageDays >= 90) return 'S3_GLACIER_FLEXIBLE';\n  return 'S3_INTELLIGENT_TIERING';\n}",
    "eHint": "Map <30d to STANDARD, 30-90d infrequent to IA, >=90d to GLACIER, >=365d to DEEP ARCHIVE.",
    "eTest": "if (resolveS3StorageClass(10, 'FREQUENT') !== 'S3_STANDARD') throw new Error('Fresh object must be S3_STANDARD');\nif (resolveS3StorageClass(400, 'INFREQUENT') !== 'S3_GLACIER_DEEP_ARCHIVE') throw new Error('Old archive must be GLACIER_DEEP_ARCHIVE');",
    "aTitle": "S3 Key Sanitizer",
    "aDesc": "Implement function sanitizeS3Key(key) replacing spaces with underscores.",
    "aStarter": "function sanitizeS3Key(key) { return key.replace(/\\s+/g, '_'); }",
    "aHint": "Replace whitespace.",
    "aTest": "if (sanitizeS3Key('my photo.png') !== 'my_photo.png') throw new Error('S3 key sanitize failed');"
  },
  {
    "day": 10,
    "title": "Amazon S3 Security, Block Public Access & Bucket Policies",
    "desc": "Enforce S3 Block Public Access (BPA), TLS encryption in transit (`aws:SecureTransport`), and SSE-KMS at rest.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon S3 Security, Block Public Access & Bucket Policies.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "S3 Bucket Policy Enforce HTTPS Transport Validator",
    "eDesc": "Implement function validateS3BucketPolicy(policy) ensuring an explicit Deny statement exists for requests where `aws:SecureTransport` is false.",
    "eStarter": "function validateS3BucketPolicy(policy) {\n  return policy.Statement.some(s => \n    s.Effect === 'Deny' && \n    s.Condition?.Bool?.['aws:SecureTransport'] === 'false'\n  );\n}",
    "eHint": "Look for Deny statement with Condition Bool aws:SecureTransport === 'false'.",
    "eTest": "const validPolicy = {\n  Statement: [\n    { Effect: 'Deny', Action: 's3:*', Resource: '*', Condition: { Bool: { 'aws:SecureTransport': 'false' } } }\n  ]\n};\nif (validateS3BucketPolicy(validPolicy) !== true) throw new Error('Valid HTTPS enforce policy failed');\nif (validateS3BucketPolicy({ Statement: [] }) !== false) throw new Error('Empty policy should fail');",
    "aTitle": "S3 Block Public Access Config Verifier",
    "aDesc": "Implement function isBlockPublicAccessComplete(cfg) verifying all 4 BPA flags are true.",
    "aStarter": "function isBlockPublicAccessComplete(c) {\n  return c.blockPublicAcls && c.ignorePublicAcls && c.blockPublicPolicy && c.restrictPublicBuckets;\n}",
    "aHint": "All 4 BPA booleans must be true.",
    "aTest": "const c = { blockPublicAcls: true, ignorePublicAcls: true, blockPublicPolicy: true, restrictPublicBuckets: true };\nif (isBlockPublicAccessComplete(c) !== true) throw new Error('BPA check failed');"
  },
  {
    "day": 11,
    "title": "Serverless AWS Lambda: Concurrency, Memory & Cold Starts",
    "desc": "Optimize serverless microVM execution, provisioned concurrency, memory-to-vCPU allocation, and cold start reduction.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Serverless AWS Lambda: Concurrency, Memory & Cold Starts.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Lambda Memory & vCPU Scaling Estimator",
    "eDesc": "Implement function getLambdaVcpu(memoryMb) calculating allocated vCPU (1769MB memory = 1 full vCPU core).",
    "eStarter": "function getLambdaVcpu(memoryMb) {\n  if (memoryMb < 128 || memoryMb > 10240) return 0;\n  return Number((memoryMb / 1769).toFixed(2));\n}",
    "eHint": "Divide memoryMb by 1769 and format to 2 decimal places.",
    "eTest": "if (getLambdaVcpu(1769) !== 1) throw new Error('1769MB must equal 1.00 vCPU');\nif (getLambdaVcpu(3538) !== 2) throw new Error('3538MB must equal 2.00 vCPUs');",
    "aTitle": "Lambda Timeout Validator",
    "aDesc": "Implement function isLambdaTimeoutValid(timeoutSeconds) validating between 1 and 900 seconds (15 mins max).",
    "aStarter": "function isLambdaTimeoutValid(sec) { return sec >= 1 && sec <= 900; }",
    "aHint": "Check range [1, 900].",
    "aTest": "if (isLambdaTimeoutValid(300) !== true || isLambdaTimeoutValid(1000) !== false) throw new Error('Timeout check failed');"
  },
  {
    "day": 12,
    "title": "Amazon API Gateway V2 HTTP & Lambda Authorizers",
    "desc": "Build serverless API interfaces, JWT Lambda authorizers, request throttling, and payload validations.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon API Gateway V2 HTTP & Lambda Authorizers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Lambda Authorizer IAM Policy Generator",
    "eDesc": "Implement function generateAuthorizerResponse(principalId, effect, resourceArn) returning API Gateway auth policy.",
    "eStarter": "function generateAuthorizerResponse(principalId, effect, resourceArn) {\n  return {\n    principalId,\n    policyDocument: {\n      Version: '2012-10-17',\n      Statement: [\n        { Action: 'execute-api:Invoke', Effect: effect, Resource: resourceArn }\n      ]\n    }\n  };\n}",
    "eHint": "Return principalId and policyDocument granting execute-api:Invoke.",
    "eTest": "const auth = generateAuthorizerResponse('user_101', 'Allow', 'arn:aws:execute-api:us-east-1:*:*/*');\nif (auth.principalId !== 'user_101' || auth.policyDocument.Statement[0].Effect !== 'Allow') throw new Error('Authorizer policy generator failed');",
    "aTitle": "API Gateway HTTP Status Code Translator",
    "aDesc": "Implement function getGatewayErrorStatus(errorType) returning status code.",
    "aStarter": "function getGatewayErrorStatus(type) {\n  const map = { 'UNAUTHORIZED': 401, 'FORBIDDEN': 403, 'THROTTLED': 429 };\n  return map[type] || 500;\n}",
    "aHint": "Map error types to 401, 403, 429.",
    "aTest": "if (getGatewayErrorStatus('THROTTLED') !== 429) throw new Error('Throttled must return 429');"
  },
  {
    "day": 13,
    "title": "Amazon DynamoDB Partition Keys & Global Secondary Indexes (GSI)",
    "desc": "Master NoSQL single-digit millisecond scale, Partition Key hashing, Sort Keys, GSIs, and Hot Partition avoidance.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon DynamoDB Partition Keys & Global Secondary Indexes (GSI).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "DynamoDB Partition Hash & Shard Router Simulator",
    "eDesc": "Implement function getPartitionShard(partitionKey, totalShards = 16) returning target shard ID via consistent hashing.",
    "eStarter": "function getPartitionShard(pk, totalShards = 16) {\n  let hash = 0;\n  for (let i = 0; i < pk.length; i++) hash = (hash * 31 + pk.charCodeAt(i)) >>> 0;\n  return hash % totalShards;\n}",
    "eHint": "Compute polynomial string hash modulo totalShards.",
    "eTest": "const shardA = getPartitionShard('user_101', 8);\nconst shardB = getPartitionShard('user_101', 8);\nif (shardA !== shardB || shardA < 0 || shardA >= 8) throw new Error('Consistent partition hashing failed');",
    "aTitle": "DynamoDB Attribute Type Formatter",
    "aDesc": "Implement function formatDynamoAttribute(val) returning DynamoDB typed format { S: val } or { N: String(val) }.",
    "aStarter": "function formatDynamoAttribute(val) {\n  if (typeof val === 'number') return { N: String(val) };\n  return { S: String(val) };\n}",
    "aHint": "Return N for number, S for string.",
    "aTest": "if (formatDynamoAttribute(42).N !== '42' || formatDynamoAttribute('hi').S !== 'hi') throw new Error('Dynamo formatting failed');"
  },
  {
    "day": 14,
    "title": "Amazon RDS Multi-AZ High Availability & Read Replicas",
    "desc": "Design relational database architectures with synchronous Multi-AZ standby failover and asynchronous Read Replicas.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon RDS Multi-AZ High Availability & Read Replicas.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "RDS Database Failover State Machine",
    "eDesc": "Implement function triggerRdsMultiAzFailover(dbCluster) promoting standby AZ instance to Primary on primary outage.",
    "eStarter": "function triggerRdsMultiAzFailover(cluster) {\n  if (!cluster.multiAzEnabled) return { success: false, error: 'NO_STANDBY_INSTANCE' };\n  const previousPrimary = cluster.primaryAz;\n  cluster.primaryAz = cluster.standbyAz;\n  cluster.standbyAz = previousPrimary;\n  return {\n    success: true,\n    newPrimaryAz: cluster.primaryAz,\n    failoverDowntimeSec: 45\n  };\n}",
    "eHint": "Swap primaryAz and standbyAz if multiAzEnabled.",
    "eTest": "const cluster = { primaryAz: 'us-east-1a', standbyAz: 'us-east-1b', multiAzEnabled: true };\nconst res = triggerRdsMultiAzFailover(cluster);\nif (!res.success || cluster.primaryAz !== 'us-east-1b') throw new Error('RDS Multi-AZ failover failed');",
    "aTitle": "Read Replica Traffic Router",
    "aDesc": "Implement function routeDatabaseQuery(isWriteQuery, primaryEndpoint, replicaEndpoints)",
    "aStarter": "function routeDatabaseQuery(isWrite, primary, replicas) {\n  if (isWrite || replicas.length === 0) return primary;\n  return replicas[Math.floor(Math.random() * replicas.length)];\n}",
    "aHint": "Writes go to primary, reads go to replicas.",
    "aTest": "if (routeDatabaseQuery(true, 'primary-db', ['rep-1']) !== 'primary-db') throw new Error('Write query must hit primary');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine",
    "desc": "Milestone 2: Build an end-to-end serverless video pipeline: S3 Upload Trigger $\\to$ EventBridge $\\to$ Lambda Transcoder $\\to$ DynamoDB metadata storage.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Serverless Video Ingest Pipeline Orchestrator",
    "eDesc": "Implement function orchestrateVideoPipeline(s3Event, dynamoDb, transcodeService) processing upload event and recording status.",
    "eStarter": "async function orchestrateVideoPipeline(event, db, transcoder) {\n  const bucket = event.Records[0].s3.bucket.name;\n  const key = event.Records[0].s3.object.key;\n  if (!key.endsWith('.mp4')) return { success: false, error: 'UNSUPPORTED_FORMAT' };\n  const jobId = `job_${Date.now()}`;\n  db.set(jobId, { status: 'PROCESSING', bucket, key });\n  const result = await transcoder.transcode(bucket, key);\n  db.set(jobId, { status: 'COMPLETED', bucket, key, outputUrl: result.url });\n  return { success: true, jobId, outputUrl: result.url };\n}",
    "eHint": "Extract bucket and key, check .mp4 extension, record in DB, and execute transcoder.",
    "eTest": "const db = new Map();\nconst transcoder = { transcode: async (b, k) => ({ url: `https://${b}.s3.amazonaws.com/processed/${k}` }) };\nconst event = { Records: [{ s3: { bucket: { name: 'raw-videos' }, object: { key: 'demo.mp4' } } }] };\nconst res = await orchestrateVideoPipeline(event, db, transcoder);\nif (!res.success || !res.outputUrl.includes('processed/demo.mp4')) throw new Error('Serverless video pipeline failed');",
    "aTitle": "S3 Event Notification Payload Extractor",
    "aDesc": "Implement function extractS3EventInfo(event) extracting bucket and key.",
    "aStarter": "function extractS3EventInfo(e) { return { bucket: e.Records[0].s3.bucket.name, key: e.Records[0].s3.object.key }; }",
    "aHint": "Extract from Records[0].s3.",
    "aTest": "const info = extractS3EventInfo({ Records: [{ s3: { bucket: { name: 'b' }, object: { key: 'k' } } }] });\nif (info.bucket !== 'b' || info.key !== 'k') throw new Error('Event info extraction failed');"
  },
  {
    "day": 16,
    "title": "Amazon CloudFront Global CDN & Edge Functions (Lambda@Edge)",
    "desc": "Accelerate global content delivery, configure Edge Cache behaviors, SSL certs with ACM, and CloudFront Functions.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon CloudFront Global CDN & Edge Functions (Lambda@Edge).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CloudFront Cache Key & TTL Evaluator",
    "eDesc": "Implement function calculateEdgeTtl(cacheControlHeader, defaultTtlSec = 86400) extracting max-age from header.",
    "eStarter": "function calculateEdgeTtl(header = '', defaultTtl = 86400) {\n  const match = header.match(/max-age=(\\d+)/);\n  return match ? parseInt(match[1], 10) : defaultTtl;\n}",
    "eHint": "Regex match max-age=(\\d+).",
    "eTest": "if (calculateEdgeTtl('public, max-age=3600') !== 3600) throw new Error('max-age parsing failed');\nif (calculateEdgeTtl('') !== 86400) throw new Error('Default TTL fallback failed');",
    "aTitle": "CloudFront Viewer Request Header Normalizer",
    "aDesc": "Implement function normalizeViewerHeaders(headers) lowercasing header keys.",
    "aStarter": "function normalizeViewerHeaders(h) {\n  const out = {};\n  Object.keys(h).forEach(k => { out[k.toLowerCase()] = h[k]; });\n  return out;\n}",
    "aHint": "Lowercase keys.",
    "aTest": "if (normalizeViewerHeaders({ 'Host': 'pinit.io' })['host'] !== 'pinit.io') throw new Error('Header normalize failed');"
  },
  {
    "day": 17,
    "title": "Amazon Route 53 DNS Routing Policies & Health Checks",
    "desc": "Configure Simple, Weighted, Latency, Geolocation, and Failover DNS routing policies with automated health probes.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon Route 53 DNS Routing Policies & Health Checks.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Route 53 DNS Failover Routing Resolver",
    "eDesc": "Implement function resolveDnsEndpoint(recordConfig, primaryHealthStatus) returning primary IP if healthy, else secondary IP.",
    "eStarter": "function resolveDnsEndpoint(cfg, isPrimaryHealthy) {\n  if (cfg.routingPolicy === 'FAILOVER') {\n    return isPrimaryHealthy ? cfg.primaryIp : cfg.secondaryIp;\n  }\n  return cfg.primaryIp;\n}",
    "eHint": "If policy is FAILOVER, return primaryIp when healthy, else secondaryIp.",
    "eTest": "const cfg = { routingPolicy: 'FAILOVER', primaryIp: '1.1.1.1', secondaryIp: '2.2.2.2' };\nif (resolveDnsEndpoint(cfg, true) !== '1.1.1.1') throw new Error('Healthy should route to primary');\nif (resolveDnsEndpoint(cfg, false) !== '2.2.2.2') throw new Error('Unhealthy must failover to secondary');",
    "aTitle": "DNS Record Type Validator",
    "aDesc": "Implement function isValidDnsRecordType(type) validating A, AAAA, CNAME, TXT, MX, ALIAS.",
    "aStarter": "function isValidDnsRecordType(t) {\n  return ['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'ALIAS'].includes(t.toUpperCase());\n}",
    "aHint": "Check standard DNS types.",
    "aTest": "if (isValidDnsRecordType('CNAME') !== true || isValidDnsRecordType('INVALID') !== false) throw new Error('DNS type check failed');"
  },
  {
    "day": 18,
    "title": "Amazon SQS: Standard vs FIFO Queues & Visibility Timeouts",
    "desc": "Decouple backend workloads with Amazon Simple Queue Service (SQS), Visibility Timeouts, Long Polling, and Dead-Letter Queues.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon SQS: Standard vs FIFO Queues & Visibility Timeouts.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "SQS Visibility Timeout Lease Manager",
    "eDesc": "Implement function isMessageVisibilityExpired(receivedAtTimestamp, visibilityTimeoutSeconds) returning true if lease expired.",
    "eStarter": "function isMessageVisibilityExpired(receivedAt, timeoutSec) {\n  return Date.now() >= receivedAt + (timeoutSec * 1000);\n}",
    "eHint": "Check if Date.now() is past receivedAt + timeout in ms.",
    "eTest": "const now = Date.now();\nif (isMessageVisibilityExpired(now - 40000, 30) !== true) throw new Error('40s past 30s timeout must be expired');\nif (isMessageVisibilityExpired(now - 10000, 30) !== false) throw new Error('10s past 30s timeout must remain hidden');",
    "aTitle": "SQS FIFO Message Group ID Builder",
    "aDesc": "Implement function buildFifoMessage(body, groupId, dedupId) returning SQS FIFO payload object.",
    "aStarter": "function buildFifoMessage(body, groupId, dedupId) {\n  return { MessageBody: JSON.stringify(body), MessageGroupId: groupId, MessageDeduplicationId: dedupId };\n}",
    "aHint": "Return object with MessageBody, MessageGroupId, MessageDeduplicationId.",
    "aTest": "const m = buildFifoMessage({ order: 1 }, 'group_1', 'dedup_1');\nif (m.MessageGroupId !== 'group_1') throw new Error('FIFO message format failed');"
  },
  {
    "day": 19,
    "title": "Amazon SNS: Pub/Sub Topic Fanout & Push Notifications",
    "desc": "Broadcast event notifications to multiple subscriber endpoints (SQS queues, Lambda functions, HTTP webhooks, Email/SMS).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon SNS: Pub/Sub Topic Fanout & Push Notifications.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "SNS Topic Fanout Dispatcher Simulator",
    "eDesc": "Implement function fanoutSnsMessage(subscriptions, messagePayload) delivering message to all active subscribed queues.",
    "eStarter": "function fanoutSnsMessage(subscriptions, payload) {\n  const deliveries = [];\n  for (const sub of subscriptions) {\n    if (sub.status === 'CONFIRMED') {\n      deliveries.push({ targetArn: sub.endpointArn, delivered: true, payload });\n    }\n  }\n  return { totalDelivered: deliveries.length, deliveries };\n}",
    "eHint": "Iterate confirmed subscriptions and collect deliveries.",
    "eTest": "const subs = [{ endpointArn: 'arn:sqs:queueA', status: 'CONFIRMED' }, { endpointArn: 'arn:sqs:queueB', status: 'CONFIRMED' }, { endpointArn: 'arn:sqs:queueC', status: 'PENDING' }];\nconst res = fanoutSnsMessage(subs, { event: 'ORDER_PLACED' });\nif (res.totalDelivered !== 2) throw new Error('SNS Fanout should deliver to exactly 2 confirmed subscriptions');",
    "aTitle": "SNS Subscription Filter Policy Matcher",
    "aDesc": "Implement function matchesFilterPolicy(policy, messageAttributes) evaluating attribute matching.",
    "aStarter": "function matchesFilterPolicy(policy, attrs) {\n  for (const key of Object.keys(policy)) {\n    if (!attrs[key] || !policy[key].includes(attrs[key])) return false;\n  }\n  return true;\n}",
    "aHint": "Check all policy keys exist in attrs and match values.",
    "aTest": "if (matchesFilterPolicy({ state: ['NY', 'CA'] }, { state: 'NY' }) !== true) throw new Error('Filter policy match failed');"
  },
  {
    "day": 20,
    "title": "Amazon EventBridge: Serverless Event Bus & Schema Registry",
    "desc": "Build loosely-coupled event-driven architectures with EventBridge default and custom event buses, rules, and content filters.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon EventBridge: Serverless Event Bus & Schema Registry.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "EventBridge Event Pattern Matcher Engine",
    "eDesc": "Implement function matchEventPattern(pattern, event) evaluating source, detail-type, and detail attributes.",
    "eStarter": "function matchEventPattern(pattern, event) {\n  if (pattern.source && !pattern.source.includes(event.source)) return false;\n  if (pattern['detail-type'] && !pattern['detail-type'].includes(event['detail-type'])) return false;\n  if (pattern.detail) {\n    for (const k of Object.keys(pattern.detail)) {\n      if (!event.detail || !pattern.detail[k].includes(event.detail[k])) return false;\n    }\n  }\n  return true;\n}",
    "eHint": "Verify source, detail-type, and detail key matches.",
    "eTest": "const pattern = { source: ['pinit.billing'], 'detail-type': ['PaymentSucceeded'] };\nconst event = { source: 'pinit.billing', 'detail-type': 'PaymentSucceeded', detail: { amount: 500 } };\nif (matchEventPattern(pattern, event) !== true) throw new Error('Valid EventBridge pattern was rejected');\nconst badEvent = { source: 'pinit.auth', 'detail-type': 'Login' };\nif (matchEventPattern(pattern, badEvent) !== false) throw new Error('Mismatched EventBridge pattern should fail');",
    "aTitle": "EventBridge Custom Event Envelope Generator",
    "aDesc": "Implement function createEventEnvelope(source, detailType, detail) formatting standard EventBridge JSON envelope.",
    "aStarter": "function createEventEnvelope(source, detailType, detail) {\n  return { Source: source, DetailType: detailType, Detail: JSON.stringify(detail), Time: new Date().toISOString() };\n}",
    "aHint": "Return Source, DetailType, Detail as JSON string, Time.",
    "aTest": "const env = createEventEnvelope('app', 'UserCreated', { id: 1 });\nif (env.Source !== 'app' || !env.Time) throw new Error('EventBridge envelope format failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus with SQS/SNS Fanout",
    "desc": "Milestone 3: Build an enterprise asynchronous microservices communication backbone using EventBridge, SNS Topics, and SQS Queues.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus with SQS/SNS Fanout.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Microservices Event Bus Dispatch & SQS Routing Engine",
    "eDesc": "Implement function routeMicroserviceEvent(event, routingRules, queueStore) matching EventBridge rules and enqueuing to target SQS queues.",
    "eStarter": "function routeMicroserviceEvent(event, rules, queues) {\n  let matchedRules = 0;\n  for (const rule of rules) {\n    if (rule.source === event.source && rule.detailType === event['detail-type']) {\n      matchedRules++;\n      const q = queues.get(rule.targetQueue) || [];\n      q.push(event.detail);\n      queues.set(rule.targetQueue, q);\n    }\n  }\n  return { matchedRules, dispatched: matchedRules > 0 };\n}",
    "eHint": "Match rule source and detailType; push event.detail to target queue in map.",
    "eTest": "const queues = new Map([['inventory_queue', []], ['notification_queue', []]]);\nconst rules = [\n  { source: 'order_service', detailType: 'OrderCreated', targetQueue: 'inventory_queue' },\n  { source: 'order_service', detailType: 'OrderCreated', targetQueue: 'notification_queue' }\n];\nconst event = { source: 'order_service', 'detail-type': 'OrderCreated', detail: { orderId: 'ord_99' } };\nconst res = routeMicroserviceEvent(event, rules, queues);\nif (res.matchedRules !== 2 || queues.get('inventory_queue').length !== 1 || queues.get('notification_queue').length !== 1) throw new Error('Microservices event fanout routing failed');",
    "aTitle": "Queue Message Depth Inspector",
    "aDesc": "Implement function getQueueDepth(queues, queueName) returning length of array in map.",
    "aStarter": "function getQueueDepth(queues, name) { return (queues.get(name) || []).length; }",
    "aHint": "Return length.",
    "aTest": "const q = new Map([['q1', [1, 2]]]);\nif (getQueueDepth(q, 'q1') !== 2) throw new Error('Queue depth failed');"
  },
  {
    "day": 22,
    "title": "AWS ECS & AWS Fargate Serverless Container Architecture",
    "desc": "Run Docker containers on AWS Elastic Container Service (ECS) with serverless Fargate compute, Task Definitions, and Service auto-scaling.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of AWS ECS & AWS Fargate Serverless Container Architecture.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ECS Task Definition Resource Sizing Validator",
    "eDesc": "Implement function validateFargateTaskSize(cpuUnits, memoryMb) verifying valid AWS Fargate CPU-to-Memory configurations.",
    "eStarter": "function validateFargateTaskSize(cpu, memory) {\n  const validCombos = {\n    256: [512, 1024, 2048],\n    512: [1024, 2048, 3072, 4096],\n    1024: [2048, 3072, 4096, 5120, 6144, 7168, 8192]\n  };\n  return Boolean(validCombos[cpu]?.includes(memory));\n}",
    "eHint": "Verify 256 CPU supports 512-2048MB, 512 CPU supports 1024-4096MB, 1024 CPU supports 2048-8192MB.",
    "eTest": "if (validateFargateTaskSize(256, 512) !== true) throw new Error('256 CPU with 512MB RAM must be valid');\nif (validateFargateTaskSize(256, 8192) !== false) throw new Error('256 CPU cannot support 8192MB RAM');",
    "aTitle": "Container Port Mapping Validator",
    "aDesc": "Implement function isPortValid(port) verifying between 1 and 65535.",
    "aStarter": "function isPortValid(port) { return port >= 1 && port <= 65535; }",
    "aHint": "Check port bounds.",
    "aTest": "if (isPortValid(8080) !== true || isPortValid(70000) !== false) throw new Error('Port validation failed');"
  },
  {
    "day": 23,
    "title": "AWS Step Functions & Distributed Saga Pattern Orchestration",
    "desc": "Orchestrate complex multi-service workflows, error handling, parallel branches, and compensating transactions with Step Functions.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of AWS Step Functions & Distributed Saga Pattern Orchestration.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Saga Pattern Compensating Transaction Engine",
    "eDesc": "Implement function executeSagaWorkflow(steps, context) executing steps in order and running rollback compensating actions in reverse order on failure.",
    "eStarter": "async function executeSagaWorkflow(steps, ctx) {\n  const executed = [];\n  for (const step of steps) {\n    try {\n      await step.execute(ctx);\n      executed.push(step);\n    } catch (err) {\n      for (let i = executed.length - 1; i >= 0; i--) {\n        await executed[i].compensate(ctx);\n      }\n      return { success: false, failedAt: step.name, rolledBackCount: executed.length };\n    }\n  }\n  return { success: true, executedCount: executed.length };\n}",
    "eHint": "Execute steps; on error, iterate executed in reverse calling compensate().",
    "eTest": "let compensated = 0;\nconst steps = [\n  { name: 'ReserveHotel', execute: async () => {}, compensate: async () => { compensated++; } },\n  { name: 'ChargeCard', execute: async () => { throw new Error('Declined'); }, compensate: async () => {} }\n];\nconst res = await executeSagaWorkflow(steps, {});\nif (res.success !== false || compensated !== 1) throw new Error('Saga pattern failed to execute compensating transaction');",
    "aTitle": "Step Functions State Machine Type Validator",
    "aDesc": "Implement function isStateValid(type) checking Task, Parallel, Choice, Wait, Pass, Fail, Succeed.",
    "aStarter": "function isStateValid(t) { return ['Task', 'Parallel', 'Choice', 'Wait', 'Pass', 'Fail', 'Succeed'].includes(t); }",
    "aHint": "Check valid ASL states.",
    "aTest": "if (isStateValid('Choice') !== true || isStateValid('Unknown') !== false) throw new Error('State validator failed');"
  },
  {
    "day": 24,
    "title": "Infrastructure as Code (IaC) with Terraform & State Management",
    "desc": "Declare cloud infrastructure as code using Terraform (HCL), remote S3 state backends, DynamoDB state locking, and drift detection.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Infrastructure as Code (IaC) with Terraform & State Management.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Terraform State Lock & Concurrency Manager",
    "eDesc": "Implement class TerraformStateLock supporting acquireLock(lockId, info) and releaseLock(lockId) preventing concurrent state corruption.",
    "eStarter": "class TerraformStateLock {\n  constructor() { this.currentLock = null; }\n  acquireLock(lockId, info) {\n    if (this.currentLock && this.currentLock.lockId !== lockId) {\n      return { acquired: false, error: 'STATE_LOCKED_BY_ANOTHER_PROCESS', lockedBy: this.currentLock.info };\n    }\n    this.currentLock = { lockId, info, acquiredAt: Date.now() };\n    return { acquired: true };\n  }\n  releaseLock(lockId) {\n    if (this.currentLock && this.currentLock.lockId === lockId) {\n      this.currentLock = null;\n      return { released: true };\n    }\n    return { released: false };\n  }\n}",
    "eHint": "Store currentLock object; reject acquireLock if lock exists with different ID.",
    "eTest": "const lock = new TerraformStateLock();\nconst l1 = lock.acquireLock('lock_1', 'Engineer_A_Applying');\nif (!l1.acquired) throw new Error('First lock acquire failed');\nconst l2 = lock.acquireLock('lock_2', 'Engineer_B_Applying');\nif (l2.acquired !== false || l2.error !== 'STATE_LOCKED_BY_ANOTHER_PROCESS') throw new Error('Concurrent lock was not blocked');\nlock.releaseLock('lock_1');\nconst l3 = lock.acquireLock('lock_2', 'Engineer_B_Applying');\nif (!l3.acquired) throw new Error('Lock acquire after release failed');",
    "aTitle": "Terraform Resource Name Formatter",
    "aDesc": "Implement function formatTerraformResourceName(env, service, resource) returning string.",
    "aStarter": "function formatTerraformResourceName(env, s, r) { return `${env}_${s}_${r}`.toLowerCase(); }",
    "aHint": "Join with underscores and lowercase.",
    "aTest": "if (formatTerraformResourceName('Prod', 'Auth', 'Vpc') !== 'prod_auth_vpc') throw new Error('Resource naming failed');"
  },
  {
    "day": 25,
    "title": "Amazon CloudWatch Metrics, Log Insights & Alarms",
    "desc": "Monitor infrastructure telemetry with custom CloudWatch metrics, metric filters, High-Resolution alarms, and SNS paging triggers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Amazon CloudWatch Metrics, Log Insights & Alarms.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CloudWatch Alarm State Evaluator",
    "eDesc": "Implement function evaluateCloudWatchAlarm(datapoints, threshold, comparisonOperator, evaluationPeriods) returning OK, ALARM, or INSUFFICIENT_DATA.",
    "eStarter": "function evaluateCloudWatchAlarm(points, threshold, op, periods) {\n  if (!points || points.length < periods) return 'INSUFFICIENT_DATA';\n  const recent = points.slice(-periods);\n  const breaching = recent.filter(p => {\n    if (op === 'GreaterThanThreshold') return p > threshold;\n    if (op === 'LessThanThreshold') return p < threshold;\n    return false;\n  });\n  return breaching.length === periods ? 'ALARM' : 'OK';\n}",
    "eHint": "Slice last evaluationPeriods points; if all points breach threshold, return ALARM, else OK.",
    "eTest": "const pts = [45, 60, 85, 90, 95];\nif (evaluateCloudWatchAlarm(pts, 80, 'GreaterThanThreshold', 3) !== 'ALARM') throw new Error('3 consecutive breaches should trigger ALARM');\nif (evaluateCloudWatchAlarm([70, 75, 80], 80, 'GreaterThanThreshold', 3) !== 'OK') throw new Error('Non-breaching points should return OK');",
    "aTitle": "CloudWatch Metric Dimension Builder",
    "aDesc": "Implement function buildMetricDimension(name, value) returning { Name: name, Value: value }.",
    "aStarter": "function buildMetricDimension(n, v) { return { Name: n, Value: v }; }",
    "aHint": "Return object.",
    "aTest": "if (buildMetricDimension('InstanceId', 'i-123').Name !== 'InstanceId') throw new Error('Dimension failed');"
  },
  {
    "day": 26,
    "title": "AWS Key Management Service (KMS) & Envelope Encryption",
    "desc": "Master symmetric/asymmetric KMS keys (KMS CMK), Data Encryption Keys (DEK), envelope encryption, and Secrets Manager rotation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of AWS Key Management Service (KMS) & Envelope Encryption.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "KMS Envelope Encryption Simulator",
    "eDesc": "Implement function simulateEnvelopeEncryption(plaintextData, kmsKmkKey) generating encrypted data with encrypted Data Key (DEK).",
    "eStarter": "function simulateEnvelopeEncryption(plaintext, kmk) {\n  const plaintextDek = 'dek_' + Math.random().toString(36).slice(2, 10);\n  const encryptedDek = Buffer.from(`${plaintextDek}:${kmk}`).toString('base64');\n  const ciphertext = Buffer.from(`${plaintext}:${plaintextDek}`).toString('base64');\n  return {\n    ciphertext,\n    encryptedDataKey: encryptedDek,\n    kmsMasterKeyId: kmk\n  };\n}",
    "eHint": "Generate plaintext DEK, encrypt data with DEK, encrypt DEK with master key (KMK), and return envelope package.",
    "eTest": "const env = simulateEnvelopeEncryption('CustomerSSN_123', 'arn:aws:kms:us-east-1:key-123');\nif (!env.ciphertext || !env.encryptedDataKey || env.kmsMasterKeyId !== 'arn:aws:kms:us-east-1:key-123') throw new Error('Envelope encryption failed');",
    "aTitle": "KMS Key Policy Action Verifier",
    "aDesc": "Implement function hasKmsDecryptPermission(actions) returning true if kms:Decrypt is allowed.",
    "aStarter": "function hasKmsDecryptPermission(actions) { return actions.includes('kms:Decrypt') || actions.includes('kms:*'); }",
    "aHint": "Check for kms:Decrypt or kms:*.",
    "aTest": "if (hasKmsDecryptPermission(['kms:Decrypt']) !== true) throw new Error('KMS action check failed');"
  },
  {
    "day": 27,
    "title": "AWS WAF & AWS Shield: DDoS & SQLi/XSS Protection",
    "desc": "Defend public endpoints with Web Application Firewall (WAF) WebACL rules, rate-based IP blocking, and AWS Shield Advanced DDoS mitigation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of AWS WAF & AWS Shield: DDoS & SQLi/XSS Protection.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "AWS WAF WebACL Inspection Engine",
    "eDesc": "Implement function inspectWafRequest(webAclRules, request) evaluating RateLimit and SQLi/XSS inspection rules, returning ALLOW or BLOCK.",
    "eStarter": "function inspectWafRequest(rules, req) {\n  for (const rule of rules) {\n    if (rule.type === 'RATE_LIMIT' && req.ipRequestCount > rule.limit) return { action: 'BLOCK', reason: 'RATE_EXCEEDED' };\n    if (rule.type === 'SQLI' && (/('|--|UNION|SELECT)/i).test(req.body || req.query)) return { action: 'BLOCK', reason: 'SQLI_DETECTED' };\n    if (rule.type === 'GEO_BLOCK' && rule.blockedCountries.includes(req.country)) return { action: 'BLOCK', reason: 'GEO_BLOCKED' };\n  }\n  return { action: 'ALLOW' };\n}",
    "eHint": "Inspect request against rate limit, SQLi patterns, and blocked countries.",
    "eTest": "const rules = [{ type: 'SQLI' }, { type: 'RATE_LIMIT', limit: 100 }];\nif (inspectWafRequest(rules, { query: \"SELECT * FROM users\" }).action !== 'BLOCK') throw new Error('SQLi was not blocked by WAF');\nif (inspectWafRequest(rules, { query: 'page=1', ipRequestCount: 50 }).action !== 'ALLOW') throw new Error('Clean request was not allowed by WAF');",
    "aTitle": "WAF IP Set Format Validator",
    "aDesc": "Implement function isValidCidrIp(ipCidr) verifying CIDR format.",
    "aStarter": "function isValidCidrIp(cidr) { return /^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\/\\d{1,2}$/.test(cidr); }",
    "aHint": "Check IP/mask regex.",
    "aTest": "if (isValidCidrIp('192.168.1.0/24') !== true) throw new Error('CIDR validation failed');"
  },
  {
    "day": 28,
    "title": "AWS FinOps: Cost Optimization, Compute Savings Plans & Cost Allocation Tags",
    "desc": "Implement Cloud FinOps strategies, Cost Allocation Tags, Compute Savings Plans, AWS Cost Explorer forecasting, and right-sizing idle resources.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of AWS FinOps: Cost Optimization, Compute Savings Plans & Cost Allocation Tags.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "AWS Cost Allocation & Savings Plan Optimization Calculator",
    "eDesc": "Implement function calculateCloudBill(onDemandHours, savingsPlanRate, onDemandRate, savingsPlanCommitmentHours) calculating total bill with discount.",
    "eStarter": "function calculateCloudBill(totalHours, spRate, odRate, spCommitHours) {\n  const coveredHours = Math.min(totalHours, spCommitHours);\n  const excessHours = Math.max(0, totalHours - spCommitHours);\n  const totalCost = (coveredHours * spRate) + (excessHours * odRate);\n  return Number(totalCost.toFixed(2));\n}",
    "eHint": "Multiply covered hours by savings plan rate and remaining excess by on-demand rate.",
    "eTest": "if (calculateCloudBill(100, 0.05, 0.10, 80) !== 6.00) throw new Error('FinOps bill calculation failed: (80 * 0.05) + (20 * 0.10) = 6.00');",
    "aTitle": "Cost Allocation Tag Enforcer",
    "aDesc": "Implement function hasRequiredCostTags(tags) ensuring Environment, CostCenter, Owner exist.",
    "aStarter": "function hasRequiredCostTags(tags) { return Boolean(tags.Environment && tags.CostCenter && tags.Owner); }",
    "aHint": "Check Environment, CostCenter, Owner.",
    "aTest": "if (hasRequiredCostTags({ Environment: 'Prod', CostCenter: 'Engineering', Owner: 'Alex' }) !== true) throw new Error('Tag check failed');"
  },
  {
    "day": 29,
    "title": "Disaster Recovery (DR) Strategies: Backup, Pilot Light & Warm Standby",
    "desc": "Compare Disaster Recovery RTO (Recovery Time Objective) and RPO (Recovery Point Objective) across Backup & Restore, Pilot Light, Warm Standby, and Multi-Site Active-Active.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Disaster Recovery (DR) Strategies: Backup, Pilot Light & Warm Standby.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "DR Strategy RTO/RPO SLA Evaluator",
    "eDesc": "Implement function selectDrStrategy(maxRtoMinutes, maxRpoMinutes) returning BackupAndRestore, PilotLight, WarmStandby, or MultiSiteActiveActive.",
    "eStarter": "function selectDrStrategy(rtoMin, rpoMin) {\n  if (rtoMin <= 0 && rpoMin <= 0) return 'MultiSiteActiveActive';\n  if (rtoMin <= 15 && rpoMin <= 5) return 'WarmStandby';\n  if (rtoMin <= 120 && rpoMin <= 60) return 'PilotLight';\n  return 'BackupAndRestore';\n}",
    "eHint": "Map sub-minute zero-downtime to MultiSiteActiveActive, <=15m to WarmStandby, <=2h to PilotLight, else BackupAndRestore.",
    "eTest": "if (selectDrStrategy(0, 0) !== 'MultiSiteActiveActive') throw new Error('Zero downtime requires MultiSiteActiveActive');\nif (selectDrStrategy(10, 5) !== 'WarmStandby') throw new Error('10m RTO requires WarmStandby');\nif (selectDrStrategy(60, 30) !== 'PilotLight') throw new Error('60m RTO requires PilotLight');",
    "aTitle": "RTO Recovery Time Delta Calculator",
    "aDesc": "Implement function calculateActualRto(outageTimestamp, recoveryTimestamp) returning duration in minutes.",
    "aStarter": "function calculateActualRto(outage, recovery) { return Math.round((recovery - outage) / 60000); }",
    "aHint": "Divide ms delta by 60000.",
    "aTest": "if (calculateActualRto(1000000, 1600000) !== 10) throw new Error('RTO calculation failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Global Resilient Multi-Region FinTech Banking Infrastructure with Active-Active Failover",
    "desc": "Final Capstone Synthesis: The complete production enterprise cloud native infrastructure featuring Multi-Region Active-Active VPCs, Route 53 latency routing, DynamoDB Global Tables, Auto-Scaling Fargate containers, KMS encryption, and sub-second automated failover.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Global Resilient Multi-Region FinTech Banking Infrastructure with Active-Active Failover.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Capstone Multi-Region Active-Active Traffic Controller",
    "eDesc": "Implement function routeGlobalBankingTransaction(regions, txPayload) resolving closest healthy region with DynamoDB replication sync.",
    "eStarter": "function routeGlobalBankingTransaction(regions, payload) {\n  const healthyRegions = regions.filter(r => r.healthStatus === 'HEALTHY');\n  if (healthyRegions.length === 0) return { success: false, error: 'GLOBAL_CATASTROPHIC_OUTAGE' };\n  healthyRegions.sort((a, b) => a.latencyMs - b.latencyMs);\n  const selected = healthyRegions[0];\n  return {\n    success: true,\n    routedRegion: selected.regionCode,\n    latencyMs: selected.latencyMs,\n    transactionId: `tx_${Date.now()}`,\n    replicatedRegions: healthyRegions.map(r => r.regionCode)\n  };\n}",
    "eHint": "Filter healthy regions, sort by latencyMs ascending, and route to closest region.",
    "eTest": "const regions = [\n  { regionCode: 'us-east-1', healthStatus: 'HEALTHY', latencyMs: 25 },\n  { regionCode: 'eu-west-1', healthStatus: 'HEALTHY', latencyMs: 110 },\n  { regionCode: 'ap-southeast-1', healthStatus: 'UNHEALTHY', latencyMs: 15 }\n];\nconst res = routeGlobalBankingTransaction(regions, { amount: 5000 });\nif (res.success !== true || res.routedRegion !== 'us-east-1') throw new Error('Global banking transaction should route to closest healthy region us-east-1');",
    "aTitle": "Capstone Architecture Certification Auditor",
    "aDesc": "Implement function auditCloudCapstoneStatus() returning certified grade.",
    "aStarter": "function auditCloudCapstoneStatus() { return { certified: true, score: '100/100', tier: 'AWS_WELL_ARCHITECTED' }; }",
    "aHint": "Return certification object.",
    "aTest": "if (auditCloudCapstoneStatus().certified !== true) throw new Error('Capstone audit failed');"
  }
];

export const CLOUD_30_DAYS_QUESTS: CourseQuest[] = CLOUD_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('cloud-native', idx + 1, cfg)
);
