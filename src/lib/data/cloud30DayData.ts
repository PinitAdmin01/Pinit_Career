import { buildEnrichedDayQuests } from './curriculumEnricher';
export interface DayConfig {
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export const CLOUD_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is Cloud Computing? — Why It Exists, 3 Service Models and Real-World Examples",
    desc: "Cloud computing means using someone else's computers and servers over the internet instead of buying your own. Before cloud computing, if you wanted to run a website, you had to buy physical servers (which cost tens of thousands of dollars each), find space to store them, install cooling systems, set up power backups, hire people to maintain them 24/7, and worry that if one server broke, your entire website went down. A single server room for a startup cost Rs 50 lakhs or more just to get started. Amazon Web Services (AWS) changed everything in 2006. Amazon had already built a massive computing infrastructure to run Amazon.com. They realised they could rent this infrastructure to other companies by the hour. Today AWS offers 200+ services — virtual machines, storage, databases, networking, AI, security — all available on-demand, pay-as-you-go, over the internet. No upfront purchase. No hardware maintenance. Pay only for what you actually use. Cloud computing has 3 service models. IaaS (Infrastructure as a Service): you rent raw infrastructure — virtual machines, storage, networking. You manage everything on top: the operating system, software, configuration, and security. AWS EC2 (virtual machines) and S3 (storage) are IaaS. Most control, most responsibility. PaaS (Platform as a Service): you rent a platform to run your code. The cloud provider manages the OS, runtime, and scaling. You only manage your application code. AWS Lambda and Elastic Beanstalk are PaaS. Less control but much faster development. SaaS (Software as a Service): you use a fully managed application over the internet. The provider manages everything — servers, OS, code, databases. Gmail, Slack, Salesforce, Netflix, Zoom are SaaS. You just use the product. Simple analogy: IaaS = you rent a kitchen and cook yourself. PaaS = you rent a restaurant kitchen with all the equipment and cook your dish. SaaS = you order food from a restaurant and just eat. The 4 key benefits of cloud: (1) On-demand — get 1,000 servers in 5 minutes, shut them down when done. (2) Pay-as-you-go — pay only for what you use, no upfront investment. (3) Global — deploy your app in Mumbai, Singapore, USA, Europe in minutes. (4) Reliable — AWS data centers have redundant power, cooling, and networking built-in. (Real world: Netflix runs entirely on AWS. When a popular show releases, Netflix needs 100x more servers for 2 hours. With cloud they spin up thousands of servers instantly, stream to 200 million users, then release the servers when the demand drops. Owning those servers permanently would cost billions — cloud makes it cost a few lakhs.)",
    syllabus: ["Cloud computing = renting servers, storage, databases over the internet instead of buying them. Before cloud: buy physical servers (Rs 50 lakh+), maintain 24/7, single server room failure = entire app down. After cloud: rent on-demand, pay per hour, AWS handles all hardware. AWS launched 2006 and now offers 200+ services.", "3 service models: IaaS (EC2, S3 — you manage OS+software+security, full control), PaaS (Lambda, Elastic Beanstalk — you manage only app code, AWS handles OS+scaling), SaaS (Gmail, Slack, Netflix — AWS/provider manages everything, you just use it). Analogy: IaaS=raw kitchen, PaaS=equipped kitchen, SaaS=restaurant.", "4 cloud benefits: (1) On-demand: get 1000 servers in minutes, cancel when done. (2) Pay-as-you-go: pay only actual usage, zero upfront. (3) Global: deploy in India, USA, Europe in minutes from AWS Console. (4) Reliable: every AWS data center has redundant power, cooling, networking — no more single-server failure killing your app."],
    eTitle: "Exam: Region Verification",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Infrastructure Basics",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "What is a VPC? — Your Private Isolated Network Inside AWS Explained from Scratch",
    desc: "Before you launch any server, database, or service on AWS, you need a Virtual Private Cloud (VPC). A VPC is your own isolated private network inside AWS. Think of it this way: AWS is a massive city with thousands of buildings (servers, databases, services). A VPC is your own private gated compound inside that city — other AWS accounts cannot see or access your compound unless you explicitly allow them. Without a VPC, all your servers would share one big public network with every other company's servers. That is a security disaster. A VPC gives you complete network isolation. When you create a VPC, you give it a block of private IP addresses written in CIDR notation. For example, 10.0.0.0/16 gives you 65,536 private IP addresses to assign to your servers. These IPs are private — they exist only inside your VPC and are invisible to the internet. Inside the VPC, you divide your IP space into subnets. A subnet is a smaller slice of your VPC's IP range, locked to one specific Availability Zone. Example layout: Public Subnet (10.0.1.0/24, 256 IPs) for web servers that need to receive internet traffic. Private Subnet (10.0.2.0/24, 256 IPs) for application servers that only talk to web servers. Database Subnet (10.0.3.0/24, 256 IPs) for databases that only talk to application servers. Servers in public subnets can receive internet traffic. Servers in private subnets cannot be reached from the internet — much safer for sensitive data and business logic. VPC security comes in layers: Security Groups act as virtual firewalls for individual servers (allow traffic on port 80 for HTTP, block everything else). Network ACLs act as firewalls for entire subnets (broader rules applying to all servers in a subnet). Route Tables control where network traffic flows (to the internet, to other subnets, to other VPCs). AWS automatically creates a default VPC in every region with public subnets so you can launch servers immediately without manual setup. But for production, you always design your own custom VPC with proper subnet isolation. (Real world: Flipkart's AWS infrastructure has separate VPCs for production, staging, and development. Production VPC contains real customer data. Staging VPC is for testing new releases. Development VPC is for engineers experimenting. Network-level isolation ensures a bug in development can never accidentally access production customer data.)",
    syllabus: ["VPC (Virtual Private Cloud) = your isolated private network inside AWS. Like a gated compound in the AWS city — other accounts cannot access your servers. Assign it a private IP range: 10.0.0.0/16 gives 65,536 IPs. VPC spans one AWS region. Everything you launch goes inside the VPC.", "Subnets divide your VPC into smaller zones, each locked to one Availability Zone. Public subnet: servers can receive internet traffic (web servers, load balancers). Private subnet: servers unreachable from internet (app servers, databases). Best practice: put sensitive systems (databases, internal APIs) always in private subnets.", "VPC security layers: Security Group = virtual firewall per EC2 instance (allow port 80, block others). Network ACL = firewall per subnet (applies to all servers in subnet). Route Table = controls traffic flow (local, internet, NAT). AWS creates a default VPC in each region automatically — but production systems always use custom VPCs with proper private subnet isolation."],
    eTitle: "Exam: Subnet Masks",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: VPC IP Boundaries",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "VPC Routing & Internet Gateways",
    desc: "Route Tables, routing target associations, Internet Gateways (IGW), and default public routes. (Real world: IGWs act as route targets allowing public subnet internet access.)",
    syllabus: ["Route Table configurations", "Internet Gateway routing", "Default route destination maps"],
    eTitle: "Exam: Public Route Table Evaluator",
    eDesc: "Write a JS function `evaluateVpcRoutes(routes)` where routes is an array of `{destination, target}` objects. Return true if there is a route where destination is '0.0.0.0/0' and target starts with 'igw-'.",
    eStarter: "function evaluateVpcRoutes(routes) {\n    // Write your code here\n    \n}",
    eHint: "Iterate array checking destination === '0.0.0.0/0' and target.startsWith('igw-').",
    eTest: "if (typeof evaluateVpcRoutes !== 'function') throw new Error('Method evaluateVpcRoutes not found.');\nif (evaluateVpcRoutes([{destination: '0.0.0.0/0', target: 'igw-123'}]) !== true) throw new Error('Validation failed');\nif (evaluateVpcRoutes([{destination: '10.0.0.0/16', target: 'local'}]) !== false) throw new Error('Private route passed incorrectly');",
    aTitle: "Assignment: Subnet Range Calculator",
    aDesc: "Write a JS function `subnetRangeCalculator(cidr)` returning true if cidr ends with '/16' or '/24'.",
    aStarter: "function subnetRangeCalculator(cidr) {\n    // Write your code here\n    \n}",
    aHint: "Check if cidr string ends with /16 or /24.",
    aTest: "if (typeof subnetRangeCalculator !== 'function') throw new Error('Method subnetRangeCalculator not found.');"
  },
  {
    title: "AWS Security Groups: Network access control ports rules",
    desc: "Master security groups rules. (Real world: Production servers lock network access ports, dropping connections not listed in CIDR whitelist rules.)",
    syllabus: ["Security Groups stateful rules configurations", "Ingress port boundaries whitelists", "Configuring outbound egress connection maps"],
    eTitle: "Exam: Ingress Port Auditor",
    eDesc: "Write a JS function `isPortOpen(rules, port, originCidr)` returning true if rules array contains an entry where fromPort <= port and toPort >= port and cidr === originCidr. Returns false otherwise.",
    eStarter: "function isPortOpen(rules, port, originCidr) {\n    // Write your code here\n    \n}",
    eHint: "Filter rule objects list matching target port ranges and origin whitelists.",
    eTest: "if (typeof isPortOpen !== 'function') throw new Error('Method isPortOpen not found');\nif (isPortOpen([{ fromPort: 80, toPort: 80, cidr: '0.0.0.0/0' }], 80, '0.0.0.0/0') !== true) throw new Error('Security group checks failed');",
    aTitle: "Assignment: SSH port restrictions checker",
    aDesc: "Write a JS function `isSshRestricted(rules)` returning true if all rules containing port 22 restrict CIDR to a specific IP (i.e. cidr !== '0.0.0.0/0').",
    aStarter: "function isSshRestricted(rules) {\n    // Write your code here\n    \n}",
    aHint: "Verify no wildcard rule maps to port 22.",
    aTest: "if (typeof isSshRestricted !== 'function') throw new Error('Method isSshRestricted not found');"
  },
  {
    title: "AWS EC2 instances sizes & storage maps",
    desc: "Master server resource scaling. (Real world: Applications choose EC2 instance families matching memory parameters, mounting EBS volumes for local data storage.)",
    syllabus: ["EC2 instance types and performance properties", "EBS volume block storage mappings", "Resource sizing bounds validations"],
    eTitle: "Exam: EC2 Sizing Calculator",
    eDesc: "Write a JS function `calculateEc2MonthlyCost(instanceType, hours, storageGb)` returning cost based on: instanceType 't3.micro' = 0.0104/hr, 't3.medium' = 0.0416/hr, and storageGb = 0.08/month. Return 0 if negative.",
    eStarter: "function calculateEc2MonthlyCost(instanceType, hours, storageGb) {\n    // Write your code here\n    \n}",
    eHint: "Multiply duration by instance rate, adding storage capacities fees.",
    eTest: "if (typeof calculateEc2MonthlyCost !== 'function') throw new Error('Method calculateEc2MonthlyCost not found');\nif (calculateEc2MonthlyCost('t3.medium', 720, 100) !== 37.952) throw new Error('EC2 pricing calculations failed');",
    aTitle: "Assignment: EBS volume capacity validator",
    aDesc: "Write a JS function `isEbsVolumeSafe(sizeGb, maxLimit)` returning true if sizeGb <= maxLimit.",
    aStarter: "function isEbsVolumeSafe(sizeGb, maxLimit) {\n    // Write your code here\n    \n}",
    aHint: "Compare input with thresholds.",
    aTest: "if (typeof isEbsVolumeSafe !== 'function') throw new Error('Method isEbsVolumeSafe not found');"
  },
  {
    title: "AWS S3: Storage bucket configurations & encryption keys",
    desc: "Master object storage security policies. (Real world: S3 storage buckets block public access configurations, enabling AES-256 server side encryption keys.)",
    syllabus: ["S3 bucket policies structures", "Blocking public access configurations flags", "Enabling KMS default encryption keys"],
    eTitle: "Exam: S3 Bucket Policy Auditor",
    eDesc: "Write a JS function `isBucketPolicySafe(policy)` returning true if policy.Effect !== 'Allow' or policy.Principal !== '*'. Returns false otherwise.",
    eStarter: "function isBucketPolicySafe(policy) {\n    // Write your code here\n    \n}",
    eHint: "Verify policy properties, rejecting public wildcards permissions configurations. Check null.",
    eTest: "if (typeof isBucketPolicySafe !== 'function') throw new Error('Method isBucketPolicySafe not found');\nif (isBucketPolicySafe({ Effect: 'Allow', Principal: '*' }) !== false) throw new Error('Public S3 bucket policy allowed');",
    aTitle: "Assignment: Storage class finder",
    aDesc: "Write a JS function `getS3StorageClass(accessDays)` returning 'Standard' if accessDays <= 30, 'Infrequent' if accessDays <= 90, 'Glacier' otherwise.",
    aStarter: "function getS3StorageClass(accessDays) {\n    // Write your code here\n    \n}",
    aHint: "Check access days limits.",
    aTest: "if (typeof getS3StorageClass !== 'function') throw new Error('Method getS3StorageClass not found');"
  },
  {
    title: "AWS Lambda serverless scaling trigger rules",
    desc: "Master event-driven architectures. (Real world: Lambda endpoints scale memory configurations, executing serverless functions inside execution timeout thresholds.)",
    syllabus: ["Lambda execution timeout limits", "Memory allocation boundaries", "Event payload trigger rules"],
    eTitle: "Exam: Lambda Resource Allocator",
    eDesc: "Write a JS function `isLambdaLimitAllowed(memoryMb, timeoutSec)` returning true if memoryMb <= 3008 and timeoutSec <= 900. Returns false otherwise.",
    eStarter: "function isLambdaLimitAllowed(memoryMb, timeoutSec) {\n    // Write your code here\n    \n}",
    eHint: "Verify input variables conform to AWS serverless boundaries guidelines.",
    eTest: "if (typeof isLambdaLimitAllowed !== 'function') throw new Error('Method isLambdaLimitAllowed not found');\nif (isLambdaLimitAllowed(1024, 60) !== true) throw new Error('Lambda resource limits failed');",
    aTitle: "Assignment: Execution retry checker",
    aDesc: "Write a JS function `canRetryExecution(failures)` returning true if failures < 3.",
    aStarter: "function canRetryExecution(failures) {\n    // Write your code here\n    \n}",
    aHint: "Check attempts bounds.",
    aTest: "if (typeof canRetryExecution !== 'function') throw new Error('Method canRetryExecution not found');"
  },
  {
    title: "AWS API Gateway: Route mappings & status pages",
    desc: "Master API request routing. (Real world: API Gateways route incoming URL parameters to backend Lambda triggers, formatting HTTP error responses.)",
    syllabus: ["API Gateway route configurations mapping", "HTTP integrations target types", "Formatting status codes returns"],
    eTitle: "Exam: API Gateway Router",
    eDesc: "Write a JS function `routeApiGateway(method, path)` returning 'LambdaTrigger' if path starts with '/api/' and method is 'GET' or 'POST'. Return 'DefaultError' otherwise.",
    eStarter: "function routeApiGateway(method, path) {\n    // Write your code here\n    \n}",
    eHint: "Verify HTTP method and path string prefix conditions.",
    eTest: "if (typeof routeApiGateway !== 'function') throw new Error('Method routeApiGateway not found');\nif (routeApiGateway('POST', '/api/users') !== 'LambdaTrigger') throw new Error('API Gateway router failed');",
    aTitle: "Assignment: API Rate limit bucket",
    aDesc: "Write a JS function `isRateLimitBucketSafe(bucketSize)` returning true if bucketSize >= 100.",
    aStarter: "function isRateLimitBucketSafe(bucketSize) {\n    // Write your code here\n    \n}",
    aHint: "Compare sizes.",
    aTest: "if (typeof isRateLimitBucketSafe !== 'function') throw new Error('Method isRateLimitBucketSafe not found');"
  },
  {
    title: "Final Capstone: Cloud Native compliance audit",
    desc: "Perform evaluations of VPC routing structures, check Security Group ingress ports safety, verify S3 bucket policies locks, and evaluate Lambda execution resource parameters. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["VPC routing compliance scans", "Security Group open ports audit", "S3 public bucket access audits"],
    eTitle: "Exam: Cloud Compliance Auditor",
    eDesc: "Write a JS function `evaluateCloudCompliance(report)` returning true if report.vpcRoutesSafe === true and report.portsRestricted === true and report.bucketsEncrypted === true.",
    eStarter: "function evaluateCloudCompliance(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.vpcRoutesSafe, report.portsRestricted, and report.bucketsEncrypted boolean properties in report.",
    eTest: "if (typeof evaluateCloudCompliance !== 'function') throw new Error('Method evaluateCloudCompliance not found');\nconst rep = { vpcRoutesSafe: true, portsRestricted: true, bucketsEncrypted: true };\nif (evaluateCloudCompliance(rep) !== true) throw new Error('Cloud compliance validation failed');",
    aTitle: "Assignment: Cost compliance scorer",
    aDesc: "Write a JS function `calcCostStatus(monthlyCost, budget)` returning monthlyCost > budget ? 'OVER_BUDGET' : 'WITHIN_BUDGET'.",
    aStarter: "function calcCostStatus(monthlyCost, budget) {\n    // Write your code here\n    \n}",
    aHint: "Verify cost ranges bounds.",
    aTest: "if (typeof calcCostStatus !== 'function') throw new Error('Method calcCostStatus not found');"
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Cloud Native compliance audit (Review)",
    desc: "Review cloud native architectures, evaluate VPC route table parameters, check security group access whitelists, and verify S3 bucket encryption keys. (Real world: Cloud architects audit AWS accounts, ensuring resources match secure landing zone blueprints.)",
    syllabus: ["Reviewing VPC routing bounds", "Assembling infrastructure security checklists", "Verifying database sharding parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  }
];

export const CLOUD_30_DAYS_QUESTS = CLOUD_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `cloud-basics-lecture-day-${dayNum}`,
    title: `Day ${dayNum} Learning: ${cfg.title}`,
    desc: cfg.desc,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };
  if (dayNum === 1) {
    return [
      lecture,
      {
        id: `cloud-basics-lecture2-day-1`,
        title: `Day 1 Deep Dive: Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `cloud-basics-lecture3-day-1`,
        title: `Day 1 Workshop: Real-World Industry Context & Visualization Guide`,
        desc: `Practical visualization guide and real-world system architecture context for Day 1. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  if (dayNum === 2) {
    return [
      lecture,
      {
        id: `cloud-basics-lecture2-day-2`,
        title: `Day 2 Deep Dive: Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `cloud-basics-lecture3-day-2`,
        title: `Day 2 Workshop: Practical Code Workshop & Edge Case Pitfall Warnings`,
        desc: `Practical code workshop analyzing common edge cases, off-by-one errors, and production traps. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  return buildEnrichedDayQuests('cloud-basics', dayNum, cfg);
});
