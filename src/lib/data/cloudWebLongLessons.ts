import { LongLesson } from './longLessons';

/**
 * Cloud Native Architectures (AWS) (course-cloud-native, prefix: cloud):
 * 30 comprehensive long-format lessons (20-30 minutes each, >= 9.2 spoken minutes)
 * covering AWS global infrastructure, IAM access control, VPC networking,
 * EC2 compute, S3 storage, RDS/DynamoDB databases, Serverless Lambda & API Gateway,
 * ECS/EKS containerization, CloudWatch monitoring, and Terraform IaC.
 */
export const CLOUD_WEB_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "Cloud Computing Models (IaaS, PaaS, SaaS) & Shared Responsibility",
    "goal": "Differentiate IaaS, PaaS, and SaaS cloud delivery models and analyze security boundaries under the AWS Shared Responsibility Model.",
    "minutes": 25,
    "recap": "Welcome to Cloud Native Architectures on AWS. Today we launch your journey into scalable cloud infrastructure by establishing foundational cloud service models and security boundaries.",
    "parts": [
      {
        "title": "Infrastructure as a Service (IaaS) Mechanics",
        "say": [
          "Infrastructure as a Service represents the foundational tier of modern cloud computing.",
          "In an IaaS deployment, a cloud provider provisions virtualized computing hardware, physical networking backbones, and raw storage devices within enterprise datacenters.",
          "As the customer, you receive complete administrative autonomy over the guest operating system, runtime libraries, background system services, and application binaries.",
          "Flagship services like Amazon Elastic Compute Cloud, commonly known as Amazon EC2, operate squarely within this IaaS model.",
          "With EC2, you choose your Linux distribution or Windows Server release, configure kernel parameters, establish swap space, and schedule operating system security updates.",
          "However, this unprecedented flexibility introduces substantial administrative operational overhead for your systems engineering team.",
          "If an unpatched OpenSSL vulnerability emerges in your Linux kernel, your operations team must apply the corresponding security patch across your entire server fleet.",
          "AWS assumes no responsibility for customer operating system vulnerabilities, guest network firewall configurations, or corrupt runtime binaries on IaaS nodes.",
          "Understanding IaaS means recognizing that full architectural control requires taking ownership of the operating system maintenance lifecycle."
        ],
        "example": "Renting an unfurnished apartment where the property management maintains the exterior roof and plumbing, but you must bring your own furniture, install interior door locks, and replace light bulbs.",
        "code": "interface IaaSComponent {\n  layer: string;\n  managedBy: 'Customer' | 'AWS';\n  description: string;\n}\n\nconst ec2Stack: IaaSComponent[] = [\n  { layer: 'Physical Datacenter & Hypervisor', managedBy: 'AWS', description: 'Nitro hypervisor and server racks' },\n  { layer: 'Guest Operating System', managedBy: 'Customer', description: 'Ubuntu 24.04 LTS kernel and packages' },\n  { layer: 'Application Runtime', managedBy: 'Customer', description: 'Node.js v20 engine and native modules' },\n  { layer: 'Network Firewall (Security Group)', managedBy: 'Customer', description: 'Inbound port 443 rules' },\n];\n\nfor (const comp of ec2Stack) {\n  console.log(`[${comp.managedBy}] ${comp.layer}: ${comp.description}`);\n}",
        "output": "[AWS] Physical Datacenter & Hypervisor: Nitro hypervisor and server racks\n[Customer] Guest Operating System: Ubuntu 24.04 LTS kernel and packages\n[Customer] Application Runtime: Node.js v20 engine and native modules\n[Customer] Network Firewall (Security Group): Inbound port 443 rules",
        "codeNotes": [
          {
            "line": 6,
            "note": "Defines the IaaS responsibility layers separating customer duties from cloud provider boundaries."
          },
          {
            "line": 14,
            "note": "Loops through each architectural layer to display which entity actively manages the component."
          }
        ],
        "tryIt": "Add a database storage volume layer to the stack and specify whether disk encryption is configured by the customer.",
        "check": {
          "question": "In an IaaS service such as Amazon EC2, who is responsible for applying operating system security patches?",
          "options": [
            "AWS automatically patches all EC2 guest operating systems nightly",
            "The customer is fully responsible for patching the guest operating system",
            "Operating system patching is unnecessary in virtualized cloud environments"
          ],
          "answer": 1,
          "why": "In IaaS, the customer retains administrative control over the guest OS and must manage all operating system updates and patches."
        }
      },
      {
        "title": "Platform as a Service (PaaS) & Abstraction",
        "say": [
          "Platform as a Service abstracts away the underlying operating system and physical server provisioning entirely.",
          "In a PaaS paradigm, the cloud vendor manages virtual machine provisioning, operating system upgrades, runtime installation, and automated horizontal scaling.",
          "Developers simply supply their production application source code or prebuilt container images alongside declarative deployment configurations.",
          "Services such as AWS Elastic Beanstalk and AWS App Runner illustrate this high-productivity platform abstraction.",
          "When deploying an application with AWS App Runner, you connect a GitHub repository or Amazon Elastic Container Registry image.",
          "App Runner automatically handles load balancing, health checks, TLS certificate termination, and scaling from zero to hundreds of concurrent instances.",
          "This dramatic reduction in operational toil allows development teams to ship client-facing features in days rather than spending weeks tuning Linux daemons.",
          "The strategic tradeoff for this increased velocity is reduced control over low-level operating system configurations and kernel modules.",
          "If your enterprise software requires custom kernel device drivers or exotic network protocols, a standard PaaS environment will prove restrictive."
        ],
        "example": "Staying in a fully furnished serviced apartment where maid service cleans the floors and management replaces broken appliances, but you control who enters and what personal activities occur inside.",
        "code": "interface PaasService {\n  name: string;\n  runtime: string;\n  autoScaling: boolean;\n  managedOs: boolean;\n}\n\nconst services: PaasService[] = [\n  { name: 'App Runner', runtime: 'Node.js 20', autoScaling: true, managedOs: true },\n  { name: 'Elastic Beanstalk', runtime: 'Python 3.11', autoScaling: true, managedOs: true },\n];\n\nconst summary = services.map(s => `${s.name} (${s.runtime}) -> OS Managed: ${s.managedOs}, AutoScale: ${s.autoScaling}`);\nconsole.log(summary.join(' | '));",
        "output": "App Runner (Node.js 20) -> OS Managed: true, AutoScale: true | Elastic Beanstalk (Python 3.11) -> OS Managed: true, AutoScale: true",
        "codeNotes": [
          {
            "line": 8,
            "note": "Declares PaaS services where operating system management is handled transparently by the cloud vendor."
          },
          {
            "line": 14,
            "note": "Formats deployment characteristics showing automated scaling and managed runtime infrastructure."
          }
        ],
        "tryIt": "Add AWS Lambda to the services list as a serverless PaaS variant and note its scaling model.",
        "check": {
          "question": "What is the primary operational advantage of choosing a PaaS solution like AWS App Runner over IaaS EC2?",
          "options": [
            "PaaS provides direct root shell access to the hypervisor hardware",
            "PaaS eliminates the operational burden of managing and patching the operating system",
            "PaaS costs zero dollars regardless of traffic volume"
          ],
          "answer": 1,
          "why": "PaaS automates server provisioning, OS patching, and runtime updates so developers can focus solely on application logic."
        }
      },
      {
        "title": "Software as a Service (SaaS) in Cloud Ecosystems",
        "say": [
          "Software as a Service represents the highest layer of cloud abstraction and software delivery.",
          "In a SaaS model, the service provider owns, operates, and maintains the entire technology stack from hardware to user interface.",
          "End users access the application over public internet connections via web browsers, mobile client applications, or REST APIs.",
          "Examples of AWS-hosted SaaS applications include Amazon WorkMail for corporate email, Amazon QuickSight for business intelligence, and Amazon Connect for cloud contact centers.",
          "As an enterprise customer, you perform zero server configuration, write zero application maintenance code, and manage no database backups.",
          "Your administrative responsibilities are confined entirely to user identity management, role assignment, and organization-wide data access policies.",
          "SaaS delivers unmatched time-to-value because organizations can onboard thousands of global employees with a few administrative clicks.",
          "However, organizations surrender custom software tailoring; you cannot alter the core underlying codebase or database schema of a SaaS solution.",
          "Selecting SaaS is ideal for business utilities where standard commercial software provides complete utility without competitive software differentiation."
        ],
        "example": "Dining at a high-end restaurant where the chefs select ingredients, cook the meal, and wash the dishes, while you simply review the menu, enjoy the food, and pay the bill.",
        "code": "interface SaasTenant {\n  tenantId: string;\n  tier: 'Standard' | 'Enterprise';\n  licensedSeats: number;\n  features: string[];\n}\n\nconst tenant: SaasTenant = {\n  tenantId: 'cust-corp-88',\n  tier: 'Enterprise',\n  licensedSeats: 250,\n  features: ['SSO', 'Custom Domain', 'Audit Export']\n};\n\nconsole.log(`Tenant: ${tenant.tenantId} (${tenant.tier}) - Seats: ${tenant.licensedSeats} - SSO Enabled: ${tenant.features.includes('SSO')}`);",
        "output": "Tenant: cust-corp-88 (Enterprise) - Seats: 250 - SSO Enabled: true",
        "codeNotes": [
          {
            "line": 8,
            "note": "Models a SaaS enterprise customer configuration record managed through high-level administrative knobs."
          },
          {
            "line": 15,
            "note": "Evaluates licensed seats and security features without interacting with any low-level infrastructure."
          }
        ],
        "tryIt": "Add a compliance logging feature flag to the tenant features array and print whether it is active.",
        "check": {
          "question": "Which responsibility falls to the customer when consuming a Software as a Service (SaaS) product?",
          "options": [
            "Patching the relational database engine",
            "Configuring virtual machine hypervisor hyperthreading",
            "Managing user accounts and data access permissions"
          ],
          "answer": 2,
          "why": "In SaaS, the vendor manages the entire infrastructure and application stack; the customer only manages user accounts and permissions."
        }
      },
      {
        "title": "The AWS Shared Responsibility Model",
        "say": [
          "Security and compliance in cloud computing is governed by the foundational AWS Shared Responsibility Model.",
          "This model explicitly draws a boundary between Security OF the Cloud and Security IN the Cloud.",
          "AWS assumes absolute responsibility for Security OF the Cloud.",
          "This includes the physical security of all global datacenters, biometric building access controls, environmental power and cooling, hardware maintenance, and hypervisors.",
          "AWS also secures the virtualization layer, edge location points of presence, and underlying fiber optic network cabling.",
          "Conversely, the customer assumes full accountability for Security IN the Cloud.",
          "Security IN the Cloud encompasses customer data classification, Identity and Access Management policies, database encryption keys, and operating system firewalls.",
          "For instance, if an engineer leaves an Amazon S3 storage bucket publicly readable with sensitive credit card records, AWS did not suffer a breach.",
          "The customer failed their responsibility by misconfiguring identity access controls within their provisioned cloud environment.",
          "Internalizing this demarcation ensures that your engineering team proactively implements defense-in-depth across all provisioned cloud resources."
        ],
        "example": "A bank vault where the commercial bank guarantees the structural concrete walls, armed guards, and vault door alarms, but individual box holders are responsible for guarding their personal keys and contents.",
        "code": "type ResponsibilityScope = 'AWS' | 'Customer';\n\ninterface SecurityDomain {\n  domain: string;\n  owner: ResponsibilityScope;\n  standard: string;\n}\n\nconst matrix: SecurityDomain[] = [\n  { domain: 'Physical Datacenter Perimeter', owner: 'AWS', standard: 'Biometric gates & 24/7 CCTV' },\n  { domain: 'Virtualization Hypervisor (Nitro)', owner: 'AWS', standard: 'Hardware-isolated microVMs' },\n  { domain: 'Customer Database Encryption Keys', owner: 'Customer', standard: 'AWS KMS customer-managed keys' },\n  { domain: 'IAM User Password Strength & MFA', owner: 'Customer', standard: 'FIDO2 hardware security keys' },\n];\n\nconst customerTasks = matrix.filter(m => m.owner === 'Customer');\nconsole.log(`Customer Action Items: ${customerTasks.map(t => t.domain).join(', ')}`);",
        "output": "Customer Action Items: Customer Database Encryption Keys, IAM User Password Strength & MFA",
        "codeNotes": [
          {
            "line": 9,
            "note": "Defines the concrete split between AWS infrastructure safeguards and customer-managed security postures."
          },
          {
            "line": 16,
            "note": "Filters the matrix to isolate duties that fall squarely on internal security engineers."
          }
        ],
        "tryIt": "Add Network Subnet NACL rules to the matrix and verify whether it belongs to AWS or Customer responsibility.",
        "check": {
          "question": "Under the AWS Shared Responsibility Model, which of the following is strictly the customer's responsibility?",
          "options": [
            "Replacing failed server power supplies and defective hard drives",
            "Encrypting application data at rest and managing user access credentials",
            "Maintaining physical security guards at regional datacenter locations"
          ],
          "answer": 1,
          "why": "Data encryption and credential management are Security IN the Cloud, which is exclusively the customer's responsibility."
        }
      },
      {
        "title": "Total Cost of Ownership: CapEx vs OpEx",
        "say": [
          "Adopting cloud native infrastructure fundamentally transforms how modern enterprises finance digital technology.",
          "In traditional on-premises IT, organizations operate under a Capital Expenditure, or CapEx, financial model.",
          "CapEx requires spending millions of dollars upfront purchasing physical server racks, SAN storage arrays, and uninterruptible power supplies.",
          "Because hardware takes months to procure, engineers are forced to forecast peak traffic years in advance, leading to massive over-provisioning.",
          "Most on-premises datacenters run at less than twenty percent average capacity during normal business hours, wasting substantial capital.",
          "Cloud computing shifts enterprise IT spending to an Operational Expenditure, or OpEx, billing model.",
          "Under an OpEx model, there are zero upfront hardware capital investments; you pay solely for compute cycles and storage gigabytes consumed per second.",
          "When web traffic surges on Black Friday, your Auto Scaling Groups dynamically provision additional compute capacity to handle the load.",
          "When traffic recedes overnight, those instances terminate immediately, reducing your operational invoice down to baseline requirements.",
          "This elasticity eliminates idle hardware waste and aligns technology expenses directly with customer business demand."
        ],
        "example": "Buying a private executive jet with multimillion-dollar upfront financing and hangar fees versus purchasing commercial flight tickets only when your staff actually needs to travel.",
        "code": "function compareThreeYearTco(onPremServers: number, cloudMonthlyCost: number) {\n  const hardwarePerServer = 6000;\n  const maintenanceAnnualPerServer = 1200;\n  const capexTotal = (onPremServers * hardwarePerServer) + (onPremServers * maintenanceAnnualPerServer * 3);\n  const opexTotal = cloudMonthlyCost * 36;\n  const delta = capexTotal - opexTotal;\n  return { capexTotal, opexTotal, savings: delta };\n}\n\nconst analysis = compareThreeYearTco(20, 2800);\nconsole.log(`On-Prem CapEx: $${analysis.capexTotal} | Cloud OpEx: $${analysis.opexTotal} | Cloud Savings: $${analysis.savings}`);",
        "output": "On-Prem CapEx: $192000 | Cloud OpEx: $100800 | Cloud Savings: $91200",
        "codeNotes": [
          {
            "line": 2,
            "note": "Calculates total on-premises capital investments including hardware purchase and ongoing maintenance."
          },
          {
            "line": 10,
            "note": "Compares 36 months of elastic cloud consumption against fixed multi-year datacenter hardware outlays."
          }
        ],
        "tryIt": "Increase cloud monthly cost to simulate heavy machine learning workloads and observe the financial crossover point.",
        "check": {
          "question": "How does the cloud Operational Expenditure (OpEx) model differ from traditional on-premises CapEx?",
          "options": [
            "OpEx requires large multi-year upfront hardware purchases before launching any service",
            "OpEx replaces upfront server procurement with pay-as-you-go elastic billing aligned to actual usage",
            "OpEx guarantees that computing hardware is physically owned and depreciated over five years"
          ],
          "answer": 1,
          "why": "OpEx allows organizations to pay for cloud resources as they consume them, avoiding costly upfront hardware investments."
        }
      },
      {
        "title": "Cost Allocation & AWS Billing Dimensions",
        "say": [
          "While elastic cloud billing provides immense flexibility, unmonitored resources can quickly generate unexpected cloud spend.",
          "To govern cloud expenditures across large engineering organizations, AWS provides structured cost allocation mechanisms.",
          "Cost Allocation Tags act as metadata key-value pairs affixed to every provisioned cloud resource.",
          "Common tag keys include Environment with values like production or staging, CostCenter referencing corporate finance units, and Project designating the service.",
          "When activated in the AWS Billing Console, AWS Cost Explorer and AWS Budgets group spending across these precise tag dimensions.",
          "Financial controllers can set automated budget alarms that notify engineering leads when monthly database spend breaches eighty percent of budget.",
          "Furthermore, AWS Organizations enables Consolidated Billing across hundreds of dedicated departmental accounts.",
          "Consolidated Billing aggregates volume usage discounts across the entire enterprise while preserving strict account-level billing attribution.",
          "Establishing tagging discipline on Day 1 ensures that every dollar spent in the cloud is directly tied to business value."
        ],
        "example": "Issuing corporate credit cards where each swipe must be tagged with a department code and project ID so accounting can track spending by business unit.",
        "code": "interface CostRecord {\n  service: string;\n  costCenter: string;\n  environment: 'production' | 'staging';\n  amountUsd: number;\n}\n\nconst expenses: CostRecord[] = [\n  { service: 'EC2', costCenter: 'CC-101', environment: 'production', amountUsd: 1450 },\n  { service: 'RDS', costCenter: 'CC-101', environment: 'production', amountUsd: 890 },\n  { service: 'S3', costCenter: 'CC-202', environment: 'staging', amountUsd: 120 },\n];\n\nconst totalProduction = expenses\n  .filter(e => e.environment === 'production')\n  .reduce((sum, e) => sum + e.amountUsd, 0);\n\nconsole.log(`Total Production Spend: $${totalProduction} across ${expenses.length} records`);",
        "output": "Total Production Spend: $2340 across 3 records",
        "codeNotes": [
          {
            "line": 8,
            "note": "Represents granular AWS cost allocation records mapped to environment and cost center tags."
          },
          {
            "line": 14,
            "note": "Filters and aggregates spend specifically targeting production workloads for financial governance."
          }
        ],
        "tryIt": "Calculate total spend grouped by costCenter and print the breakdown for CC-101 and CC-202.",
        "check": {
          "question": "What is the primary function of AWS Cost Allocation Tags?",
          "options": [
            "Encrypting S3 storage objects using symmetric AES-256 keys",
            "Assigning metadata to resources to track and categorize costs across teams and environments",
            "Speeding up CPU execution speeds on virtual machine instances"
          ],
          "answer": 1,
          "why": "Cost Allocation Tags organize and categorize resource expenditures across departments, projects, and environments in billing reports."
        }
      }
    ],
    "summary": [
      "IaaS delivers total operating system and runtime autonomy at the expense of manual operational maintenance and security patching.",
      "PaaS abstracts infrastructure layers to enable rapid application delivery through automated provisioning, scaling, and runtime maintenance.",
      "The AWS Shared Responsibility Model cleanly separates physical Security OF the Cloud (AWS) from data and access Security IN the Cloud (Customer)."
    ],
    "projectStep": {
      "title": "Workload Classification & Cloud Cost Strategy",
      "steps": [
        "Audit application components to classify each tier as IaaS, PaaS, or SaaS",
        "Define an enterprise AWS Shared Responsibility policy matrix for corporate data assets",
        "Establish standardized Cost Allocation Tags for Environment, CostCenter, and Owner across all resources"
      ]
    }
  },
  {
    "day": 2,
    "title": "AWS Global Infrastructure, Regions & Availability Zones",
    "goal": "Architect fault-tolerant systems using AWS Regions, Availability Zones, and low-latency Edge Locations.",
    "minutes": 25,
    "recap": "Yesterday we learned the core cloud service models and shared responsibility. Today we explore physical cloud topologies: how AWS organizes datacenters across the globe to achieve fault tolerance.",
    "parts": [
      {
        "title": "AWS Regions and Data Sovereignty",
        "say": [
          "An AWS Region is an entirely separate geographic territory around the globe containing multiple isolated datacenters.",
          "Examples include us-east-1 in Northern Virginia, eu-west-1 in Dublin, Ireland, and ap-south-1 in Mumbai, India.",
          "Every AWS Region is completely independent from all other regions, engineered with its own dedicated power grids, water supplies, and cooling systems.",
          "This absolute independence ensures maximum blast radius isolation: an unforeseen power grid failure in North America cannot cascade into European regions.",
          "When selecting an AWS Region for your production workloads, you must balance four critical architectural criteria.",
          "The first criterion is compliance and legal data sovereignty, such as the European Union General Data Protection Regulation requiring citizen data to remain in Europe.",
          "The second criterion is network latency to your primary user base, positioning compute nodes physically close to clients to minimize packet round-trips.",
          "The third criterion is regional service availability, since cutting-edge AI or database features frequently roll out in flagship regions first.",
          "Finally, pricing varies across regions based on local real estate, electricity, and telecommunication costs, requiring financial scrutiny before committing."
        ],
        "example": "A global logistics shipping network maintaining fully independent distribution warehouses in North America, Europe, and Asia, ensuring that a snowstorm closing one hub has zero impact on another.",
        "code": "interface RegionProfile {\n  regionCode: string;\n  location: string;\n  gdprCompliant: boolean;\n  baseLatencyMs: number;\n}\n\nconst regions: RegionProfile[] = [\n  { regionCode: 'us-east-1', location: 'N. Virginia', gdprCompliant: false, baseLatencyMs: 35 },\n  { regionCode: 'eu-west-1', location: 'Ireland', gdprCompliant: true, baseLatencyMs: 15 },\n  { regionCode: 'ap-south-1', location: 'Mumbai', gdprCompliant: false, baseLatencyMs: 120 },\n];\n\nconst europeanTarget = regions.find(r => r.gdprCompliant && r.baseLatencyMs < 20);\nconsole.log(`Selected GDPR Region: ${europeanTarget?.regionCode} (${europeanTarget?.location}) with ${europeanTarget?.baseLatencyMs}ms latency`);",
        "output": "Selected GDPR Region: eu-west-1 (Ireland) with 15ms latency",
        "codeNotes": [
          {
            "line": 8,
            "note": "Defines AWS region profiles annotated with compliance constraints and regional network baseline latency."
          },
          {
            "line": 15,
            "note": "Filters regions according to strict European data residency mandates and performance SLA thresholds."
          }
        ],
        "tryIt": "Add ap-southeast-1 to the region profiles with 65ms latency and evaluate its suitability for Asian regional deployments.",
        "check": {
          "question": "Why does AWS engineer regions to be completely isolated and independent from one another?",
          "options": [
            "To prevent customers from transferring data between different accounts",
            "To guarantee blast radius containment so that an outage in one region does not affect another",
            "Because international law forbids undersea communication cables between continents"
          ],
          "answer": 1,
          "why": "Complete regional independence ensures blast radius isolation, preventing localized catastrophic events from cascading globally."
        }
      },
      {
        "title": "Availability Zones: The Building Blocks of High Availability",
        "say": [
          "Inside every AWS Region lies a collection of physically discrete locations called Availability Zones, or AZs.",
          "Every modern AWS Region contains at least three Availability Zones, designated by appending letters to the region code, such as us-east-1a, us-east-1b, and us-east-1c.",
          "An Availability Zone is not simply a single computer room; an AZ consists of one or more physical datacenters with redundant power, networking, and flood protection.",
          "Crucially, AZs within the same region are separated by a physical distance of several kilometers to tens of kilometers.",
          "This geographic separation protects the region against localized disasters such as fires, localized flooding, or transformer explosions.",
          "At the same time, all AZs in a region are interconnected through private, high-bandwidth, ultra-low-latency dark fiber optical networks.",
          "Inter-AZ latency remains in the low single-digit milliseconds, allowing synchronous database replication across zones without degrading transactional throughput.",
          "To avoid resource imbalances across accounts, AWS maps AZ names dynamically; us-east-1a in your account may point to a different physical datacenter than us-east-1a in a colleague's account.",
          "Using Multi-AZ deployments forms the cornerstone of every highly available cloud native system on AWS."
        ],
        "example": "A municipal emergency hospital network operating three separate hospital campuses spaced across a metropolitan area, connected by private ambulances and synchronized electronic medical records.",
        "code": "interface AvailabilityZone {\n  azId: string;\n  zoneName: string;\n  datacenters: number;\n  interAzLatencyMs: number;\n}\n\nconst irelandAzs: AvailabilityZone[] = [\n  { azId: 'euw1-az1', zoneName: 'eu-west-1a', datacenters: 2, interAzLatencyMs: 1.2 },\n  { azId: 'euw1-az2', zoneName: 'eu-west-1b', datacenters: 3, interAzLatencyMs: 1.4 },\n  { azId: 'euw1-az3', zoneName: 'eu-west-1c', datacenters: 2, interAzLatencyMs: 1.1 },\n];\n\nconst avgLatency = (irelandAzs.reduce((sum, az) => sum + az.interAzLatencyMs, 0) / irelandAzs.length).toFixed(2);\nconsole.log(`Configured ${irelandAzs.length} AZs across Ireland. Average Inter-AZ Latency: ${avgLatency}ms`);",
        "output": "Configured 3 AZs across Ireland. Average Inter-AZ Latency: 1.23ms",
        "codeNotes": [
          {
            "line": 8,
            "note": "Represents Availability Zones backed by multiple physical datacenters and low single-digit millisecond latency."
          },
          {
            "line": 14,
            "note": "Calculates average interconnect latency across all three availability zones within the regional cluster."
          }
        ],
        "tryIt": "Calculate total physical datacenters backing the entire regional cluster across all three zones.",
        "check": {
          "question": "What physical characteristic allows Availability Zones in the same region to support synchronous data replication?",
          "options": [
            "They share the exact same physical server rack and power strip",
            "They are connected by redundant, ultra-low-latency private dark fiber networks",
            "They communicate exclusively over the public public internet using satellite links"
          ],
          "answer": 1,
          "why": "Private dark fiber links provide low single-digit millisecond round-trips, making synchronous multi-AZ writes fast and reliable."
        }
      },
      {
        "title": "Edge Locations and the AWS Global Backbone",
        "say": [
          "Beyond full-featured Regions and Availability Zones, AWS operates a vast worldwide network of Edge Locations.",
          "Edge Locations are Points of Presence, or PoPs, situated in major metropolitan population centers across dozens of countries.",
          "Currently, AWS manages hundreds of Edge Locations connected directly to the private AWS global network backbone.",
          "Services like Amazon CloudFront and AWS Global Accelerator leverage these Edge Locations to bring content closer to global end users.",
          "When a user in Sydney requests a static image cached in a CloudFront distribution, the request terminates at the nearest Sydney Edge Location in milliseconds.",
          "The user avoids waiting for network packets to traverse Pacific undersea cables to reach origin servers located in Northern Virginia.",
          "Furthermore, AWS Global Accelerator provides static Anycast IP addresses that route traffic directly into the nearest AWS Edge Location.",
          "Once your user traffic enters the AWS edge, it travels entirely over AWS's private, congestion-free fiber optic backbone rather than the unpredictable public internet.",
          "This architecture dramatically reduces TCP connection setup times, packet loss, and jitter for global web applications."
        ],
        "example": "A national newspaper printing and distributing local editions in regional city kiosks every morning rather than shipping every single physical newspaper from one central printing press.",
        "code": "function compareEdgeVsOrigin(originDistanceKm: number, edgeDistanceKm: number) {\n  const speedOfLightInFiberKmMs = 200; // km per millisecond\n  const originRttMs = (originDistanceKm * 2) / speedOfLightInFiberKmMs;\n  const edgeRttMs = (edgeDistanceKm * 2) / speedOfLightInFiberKmMs;\n  return {\n    originRttMs: Math.round(originRttMs),\n    edgeRttMs: Math.round(edgeRttMs),\n    latencyReductionPct: Math.round(((originRttMs - edgeRttMs) / originRttMs) * 100)\n  };\n}\n\nconst perf = compareEdgeVsOrigin(12000, 150);\nconsole.log(`Origin RTT: ${perf.originRttMs}ms | Edge RTT: ${perf.edgeRttMs}ms | Speedup: ${perf.latencyReductionPct}%`);",
        "output": "Origin RTT: 120ms | Edge RTT: 2ms | Speedup: 99%",
        "codeNotes": [
          {
            "line": 2,
            "note": "Models optical fiber propagation delay to demonstrate latency differentials between distant origins and local edge PoPs."
          },
          {
            "line": 12,
            "note": "Computes round-trip latency reduction percentage achieved by terminating client connections at metropolitan Edge Locations."
          }
        ],
        "tryIt": "Change origin distance to 16,000 km for an antipodal connection and observe the increased latency reduction.",
        "check": {
          "question": "What is the primary architectural purpose of AWS Edge Locations?",
          "options": [
            "Running massive relational database clusters and heavy batch data pipelines",
            "Caching web content and terminating user network traffic close to global users for low latency",
            "Physically warehousing replacement hard drives for AWS technician dispatch"
          ],
          "answer": 1,
          "why": "Edge Locations cache static/dynamic content and terminate connections near users to minimize round-trip network latency."
        }
      },
      {
        "title": "Multi-AZ High Availability vs Single-AZ Vulnerability",
        "say": [
          "Deploying a web application within a single Availability Zone creates an unacceptable Single Point of Failure, or SPOF.",
          "If a severe weather event, power substation explosion, or physical fiber cut disrupts that single zone, your application goes completely offline.",
          "To engineer enterprise-grade resilience, cloud architects deploy applications in an active-active Multi-AZ configuration.",
          "In a Multi-AZ topology, stateless web and application servers are distributed evenly across two or more Availability Zones.",
          "An Application Load Balancer continuously conducts automated health checks against every instance across all active zones.",
          "If an entire Availability Zone experiences an outage, the load balancer automatically detects the unhealthy targets and steers one hundred percent of user traffic to healthy zones.",
          "For stateful data stores like Amazon RDS, Multi-AZ provisioning creates a synchronous standby replica in a second Availability Zone.",
          "When the primary database instance fails, RDS initiates an automated DNS failover to the standby replica within sixty to one hundred twenty seconds.",
          "This automated failover process guarantees minimal Recovery Time Objective, or RTO, without manual operator intervention."
        ],
        "example": "A twin-engine passenger aircraft where each engine is fueled by independent fuel lines and electrical generators, allowing normal flight even if one engine suddenly stalls mid-air.",
        "code": "interface AzNode {\n  az: string;\n  instanceId: string;\n  healthy: boolean;\n}\n\nconst fleet: AzNode[] = [\n  { az: 'us-east-1a', instanceId: 'i-001', healthy: true },\n  { az: 'us-east-1a', instanceId: 'i-002', healthy: true },\n  { az: 'us-east-1b', instanceId: 'i-003', healthy: true },\n  { az: 'us-east-1b', instanceId: 'i-004', healthy: true },\n];\n\nfunction simulateAzFailure(nodes: AzNode[], failedAz: string) {\n  const remaining = nodes.filter(n => n.az !== failedAz && n.healthy);\n  return {\n    operationalNodes: remaining.length,\n    trafficCapacityPct: (remaining.length / nodes.length) * 100\n  };\n}\n\nconst status = simulateAzFailure(fleet, 'us-east-1a');\nconsole.log(`Simulated AZ Failure: ${status.operationalNodes} nodes remaining (${status.trafficCapacityPct}% capacity online)`);",
        "output": "Simulated AZ Failure: 2 nodes remaining (50% capacity online)",
        "codeNotes": [
          {
            "line": 7,
            "note": "Initializes a balanced compute fleet distributed evenly across two independent Availability Zones."
          },
          {
            "line": 14,
            "note": "Simulates an immediate catastrophic outage of us-east-1a and measures remaining operational traffic capacity."
          }
        ],
        "tryIt": "Distribute 6 instances across 3 Availability Zones and calculate surviving capacity when one zone fails.",
        "check": {
          "question": "How does Amazon RDS Multi-AZ maintain high availability in the event of primary database host failure?",
          "options": [
            "It requires database administrators to manually restore nightly tape backups into a new region",
            "It automatically executes a DNS failover to a synchronized standby instance in a second Availability Zone",
            "It shuts down the web application until the physical host is repaired by technicians"
          ],
          "answer": 1,
          "why": "RDS Multi-AZ maintains a synchronous standby in another AZ and performs automated DNS failover if the primary fails."
        }
      },
      {
        "title": "Cross-Region Replication & Disaster Recovery Topology",
        "say": [
          "While Multi-AZ architecture protects against local datacenter failures, enterprise disaster recovery requires multi-region redundancy.",
          "A regional disaster, such as a major hurricane knocking out regional power grids or undersea trunk cables, can impact an entire AWS Region.",
          "To satisfy strict business continuity mandates, cloud architects implement Cross-Region Replication, or CRR.",
          "Amazon Simple Storage Service supports automated, asynchronous Cross-Region Replication of binary storage objects.",
          "Whenever a new document or media file is written to an S3 bucket in us-east-1, S3 automatically encrypts and transmits the object to a replica bucket in eu-west-1.",
          "Similarly, Amazon DynamoDB Global Tables provide fully managed active-active multi-region database replication with sub-second replication latency.",
          "When designing multi-region architectures, two metrics govern engineering decisions: Recovery Time Objective, and Recovery Point Objective.",
          "RTO defines the maximum acceptable duration of application downtime before full operational service is restored.",
          "RPO defines the maximum acceptable volume of data loss measured in time, representing data written since the last successful replication sync.",
          "Cross-region data replication involves asynchronous network propagation, meaning your RPO will typically range from seconds to several minutes."
        ],
        "example": "Maintaining identical digital copies of corporate financial records in secure bank vaults in both New York and Zurich to withstand continental banking disruptions.",
        "code": "interface DisasterRecoveryTarget {\n  primaryRegion: string;\n  drRegion: string;\n  rtoMinutes: number;\n  rpoMinutes: number;\n  replicationType: 'Synchronous' | 'Asynchronous';\n}\n\nconst bankingDr: DisasterRecoveryTarget = {\n  primaryRegion: 'us-east-1',\n  drRegion: 'us-west-2',\n  rtoMinutes: 15,\n  rpoMinutes: 2,\n  replicationType: 'Asynchronous'\n};\n\nconsole.log(`DR Blueprint: ${bankingDr.primaryRegion} -> ${bankingDr.drRegion} | Target RTO: ${bankingDr.rtoMinutes}m | Target RPO: ${bankingDr.rpoMinutes}m (${bankingDr.replicationType})`);",
        "output": "DR Blueprint: us-east-1 -> us-west-2 | Target RTO: 15m | Target RPO: 2m (Asynchronous)",
        "codeNotes": [
          {
            "line": 9,
            "note": "Defines enterprise disaster recovery objectives establishing stringent recovery time and data loss boundaries."
          },
          {
            "line": 17,
            "note": "Logs the primary-to-DR failover configuration with its targeted recovery SLA."
          }
        ],
        "tryIt": "Change replication type to Synchronous and consider why physical speed-of-light constraints make synchronous cross-region writes difficult.",
        "check": {
          "question": "What is the key difference between Recovery Time Objective (RTO) and Recovery Point Objective (RPO)?",
          "options": [
            "RTO measures cloud subscription costs, while RPO measures network bandwidth consumption",
            "RTO measures the time to restore service after failure, while RPO measures acceptable data loss in time",
            "RTO applies only to virtual machines, while RPO applies only to S3 storage buckets"
          ],
          "answer": 1,
          "why": "RTO is the time allowed to bring services back online, while RPO is the maximum time interval of data loss tolerated."
        }
      },
      {
        "title": "Regional Service Scopes vs Global AWS Services",
        "say": [
          "Understanding AWS architecture requires knowing whether a provisioned service is scoped globally, regionally, or to an Availability Zone.",
          "Global Services operate across the entire worldwide AWS infrastructure from a single unified control plane.",
          "AWS Identity and Access Management, Amazon CloudFront, Amazon Route 53, and AWS WAF are quintessential Global Services.",
          "When you create an IAM role or register a Route 53 domain name, that configuration propagates globally across all AWS points of presence.",
          "In contrast, Regional Services are scoped to the specific AWS Region where you provision them.",
          "Amazon EC2, Amazon VPC, Amazon S3, Amazon RDS, and AWS Lambda are Regional Services.",
          "An S3 bucket name must be globally unique across all AWS customers, but the bucket itself physically resides within a single designated region.",
          "Finally, some cloud components are strictly AZ-Scoped resources.",
          "An Amazon Elastic Block Store, or EBS volume, exists only inside a single Availability Zone and cannot be attached directly to an EC2 instance in another zone.",
          "Similarly, individual VPC subnets reside entirely within a single AZ; a subnet can never span multiple Availability Zones."
        ],
        "example": "A national government identity database (global) issuing national passports, versus regional state courts (regional), versus local municipal polling booths (AZ-scoped).",
        "code": "type ServiceScope = 'Global' | 'Regional' | 'AZ-Scoped';\n\ninterface AwsResource {\n  name: string;\n  scope: ServiceScope;\n  example: string;\n}\n\nconst resources: AwsResource[] = [\n  { name: 'AWS IAM', scope: 'Global', example: 'IAM Roles and Policies' },\n  { name: 'Amazon CloudFront', scope: 'Global', example: 'Global CDN Distributions' },\n  { name: 'Amazon VPC', scope: 'Regional', example: '10.0.0.0/16 Virtual Network' },\n  { name: 'Amazon EBS Volume', scope: 'AZ-Scoped', example: 'gp3 Block Storage Drive' },\n];\n\nfor (const r of resources) {\n  console.log(`[${r.scope}] ${r.name}: ${r.example}`);\n}",
        "output": "[Global] AWS IAM: IAM Roles and Policies\n[Global] Amazon CloudFront: Global CDN Distributions\n[Regional] Amazon VPC: 10.0.0.0/16 Virtual Network\n[AZ-Scoped] Amazon EBS Volume: gp3 Block Storage Drive",
        "codeNotes": [
          {
            "line": 8,
            "note": "Classifies core AWS cloud resources into Global, Regional, and Availability-Zone-specific architectural scopes."
          },
          {
            "line": 15,
            "note": "Iterates through the resource array to reinforce operational boundaries and cross-zone constraints."
          }
        ],
        "tryIt": "Add VPC Subnet to the resources array and verify why it must be categorized as AZ-Scoped.",
        "check": {
          "question": "Can an Amazon Elastic Block Store (EBS) volume be directly attached to an Amazon EC2 instance running in a different Availability Zone?",
          "options": [
            "Yes, EBS volumes can attach to any EC2 instance anywhere in the world without latency",
            "No, EBS volumes are strictly AZ-scoped and can only attach to instances in the same Availability Zone",
            "Yes, but only if both instances are running the same operating system kernel"
          ],
          "answer": 1,
          "why": "EBS volumes are AZ-scoped storage resources; an instance and its attached EBS volume must reside in the exact same Availability Zone."
        }
      }
    ],
    "summary": [
      "AWS Regions provide isolated geographic environments that enforce legal data sovereignty and limit blast radius.",
      "Availability Zones are clusters of discrete datacenters interconnected with redundant low-latency dark fiber for active-active high availability.",
      "Cloud resources adhere to distinct operational scopes: Global (IAM, CloudFront), Regional (VPC, S3), and AZ-Scoped (Subnets, EBS volumes)."
    ],
    "projectStep": {
      "title": "Global Infrastructure Design & AZ Topology",
      "steps": [
        "Select primary and disaster recovery AWS Regions based on compliance and latency analysis",
        "Catalog existing services into Global, Regional, and AZ-Scoped architectural tiers",
        "Architect a Multi-AZ compute topology balancing instances across at least two Availability Zones"
      ]
    }
  },
  {
    "day": 3,
    "title": "Virtual Private Cloud (VPC) Architecture & CIDR Subnetting",
    "goal": "Design secure Virtual Private Cloud networks, configure CIDR subnets, and establish route table pathing.",
    "minutes": 25,
    "recap": "Yesterday we toured AWS Regions and Availability Zones. Today we carve out your private virtual datacenter in the cloud: the Amazon Virtual Private Cloud (VPC).",
    "parts": [
      {
        "title": "VPC Foundations and RFC 1918 Private IPv4 Address Spaces",
        "say": [
          "An Amazon Virtual Private Cloud, or VPC, provides a logically isolated private network dedicated entirely to your AWS account.",
          "Within your VPC, you have complete control over virtual networking infrastructure, including IP address range selection, subnets, route tables, and network gateways.",
          "When creating a VPC, you assign an IPv4 Classless Inter-Domain Routing, or CIDR, block adhering to RFC 1918 private networking standards.",
          "RFC 1918 defines three private non-routable address ranges: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.",
          "In modern enterprise cloud architectures, the 10.0.0.0/16 CIDR block is the industry standard default choice.",
          "A /16 subnet mask provides 65,536 total IPv4 addresses, giving organizations ample capacity to divide into smaller subnets.",
          "The most crucial network planning rule is avoiding overlapping CIDR blocks with on-premises corporate datacenters or peered VPCs.",
          "If your on-premises headquarters uses 10.100.0.0/16 and your AWS VPC also uses 10.100.0.0/16, network packets cannot be routed over VPNs or AWS Direct Connect.",
          "Careful upfront IP address management prevents catastrophic network redesigns as your enterprise infrastructure expands."
        ],
        "example": "Assigning room numbers in an office building with clear floor prefixes so that floor ten extensions never collide with floor twenty extensions.",
        "code": "function calculateCidrCapacity(prefixLength: number) {\n  const hostBits = 32 - prefixLength;\n  const totalIps = Math.pow(2, hostBits);\n  const awsUsableIps = totalIps >= 5 ? totalIps - 5 : 0;\n  return { prefixLength, totalIps, awsUsableIps };\n}\n\nconst vpcCidr = calculateCidrCapacity(16);\nconst subnetCidr = calculateCidrCapacity(24);\nconsole.log(`VPC /16 -> Total: ${vpcCidr.totalIps} | Subnet /24 -> Total: ${subnetCidr.totalIps}, Usable: ${subnetCidr.awsUsableIps}`);",
        "output": "VPC /16 -> Total: 65536 | Subnet /24 -> Total: 256, Usable: 251",
        "codeNotes": [
          {
            "line": 2,
            "note": "Computes total IPv4 space from CIDR prefix bits and deducts 5 AWS reserved addresses."
          },
          {
            "line": 9,
            "note": "Demonstrates capacity differences between a /16 parent VPC block and a standard /24 subnet slice."
          }
        ],
        "tryIt": "Calculate total and usable IP addresses for a smaller /28 micro-subnet.",
        "check": {
          "question": "Why must cloud network engineers ensure that a new VPC CIDR block does not overlap with existing on-premises IP ranges?",
          "options": [
            "Overlapping IP ranges cause AWS billing systems to double-charge for compute instances",
            "Overlapping IP ranges make it impossible to route network traffic between on-premises and the VPC via VPN or Direct Connect",
            "AWS automatically deletes any VPC whose CIDR block contains the number ten"
          ],
          "answer": 1,
          "why": "Routers cannot determine where to deliver packets if both the cloud VPC and on-premises datacenters share identical IP addresses."
        }
      },
      {
        "title": "AWS Reserved IP Addresses per Subnet",
        "say": [
          "When you carve out a subnet within an Amazon VPC, not every IP address in the CIDR block is available for your compute instances.",
          "In every VPC subnet you provision, AWS automatically reserves exactly five IP addresses for internal networking and routing operations.",
          "Consider a standard /24 subnet containing 256 theoretical IPv4 addresses, such as 10.0.1.0/24.",
          "The first reserved address is 10.0.1.0, which represents the network address for the subnet.",
          "The second reserved address is 10.0.1.1, assigned by AWS to the default VPC router serving that subnet.",
          "The third reserved address is 10.0.1.2, assigned to the Amazon DNS server, commonly known as AmazonProvidedDNS or Route 53 Resolver.",
          "The fourth reserved address is 10.0.1.3, reserved by AWS for future internal platform capabilities.",
          "The fifth and final reserved address is 10.0.1.255, representing the network broadcast address, which AWS retains because VPC networks do not support standard broadcast.",
          "Therefore, the total assignable host capacity in any AWS subnet is calculated as 2^(32 - prefix) minus 5.",
          "For a /24 subnet, exactly 251 IP addresses are usable for EC2 instances, RDS databases, and Elastic Load Balancers."
        ],
        "example": "A new housing development where the first four lot numbers are reserved for the security gatehouse, water pumping station, mailbox center, and future utilities, while the last lot is a fire turnaround zone.",
        "code": "interface SubnetReservedTable {\n  offset: number;\n  ipSuffix: string;\n  purpose: string;\n}\n\nconst reservations: SubnetReservedTable[] = [\n  { offset: 0, ipSuffix: '.0', purpose: 'Network address' },\n  { offset: 1, ipSuffix: '.1', purpose: 'VPC Router' },\n  { offset: 2, ipSuffix: '.2', purpose: 'AmazonProvidedDNS (Route 53 Resolver)' },\n  { offset: 3, ipSuffix: '.3', purpose: 'Future AWS internal reservation' },\n  { offset: 4, ipSuffix: '.255', purpose: 'Network broadcast emulation' },\n];\n\nconsole.log(`AWS reserves ${reservations.length} addresses per subnet: ${reservations.map(r => r.ipSuffix).join(', ')}`);",
        "output": "AWS reserves 5 addresses per subnet: .0, .1, .2, .3, .255",
        "codeNotes": [
          {
            "line": 7,
            "note": "Catalogues the 5 invariant reserved IP addresses present in every provisioned AWS subnet."
          },
          {
            "line": 15,
            "note": "Logs the reserved IP suffixes that network engineers cannot assign to compute workloads."
          }
        ],
        "tryIt": "Calculate the exact usable host IP count for a /26 subnet containing 64 total addresses.",
        "check": {
          "question": "How many IP addresses does AWS reserve in every provisioned VPC subnet?",
          "options": [
            "Zero, all IP addresses in the CIDR block are assignable to customer servers",
            "Exactly five IP addresses (.0, .1, .2, .3, and .255)",
            "Ten IP addresses evenly distributed throughout the block"
          ],
          "answer": 1,
          "why": "AWS reserves 5 IP addresses in every subnet for network address, VPC router, DNS, future use, and broadcast emulation."
        }
      },
      {
        "title": "Public Subnet Architecture and the Internet Gateway (IGW)",
        "say": [
          "A subnet inside a VPC is classified as either a Public Subnet or a Private Subnet based purely on its route table configuration.",
          "A Public Subnet is explicitly configured to allow direct inbound and outbound connectivity to the public internet.",
          "To enable public internet routing, an engineer must attach an Internet Gateway, or IGW, to the parent VPC.",
          "An Internet Gateway is a horizontally scaled, redundant, highly available VPC component that introduces zero bandwidth bottlenecks.",
          "Next, the route table associated with the public subnet must contain a default route: destination 0.0.0.0/0 targeting the Internet Gateway ID.",
          "In addition to route table pathing, any instance launched in a public subnet must possess a publicly routable IPv4 address.",
          "This public IP can be assigned dynamically from the AWS public pool upon instance creation, or statically using an Elastic IP address.",
          "Instances in a public subnet typically include public Application Load Balancers, API gateways, and administrative Bastion hosts.",
          "Database servers and backend business microservices should never be placed in a public subnet."
        ],
        "example": "The main revolving glass doors of an office lobby opening directly onto a busy downtown public boulevard, welcoming pedestrian traffic from outside.",
        "code": "interface RouteEntry {\n  destinationCidr: string;\n  target: string;\n  isInternetRoutable: boolean;\n}\n\nconst publicRouteTable: RouteEntry[] = [\n  { destinationCidr: '10.0.0.0/16', target: 'local', isInternetRoutable: false },\n  { destinationCidr: '0.0.0.0/0', target: 'igw-0abc123', isInternetRoutable: true },\n];\n\nconst hasDefaultIgw = publicRouteTable.some(r => r.destinationCidr === '0.0.0.0/0' && r.target.startsWith('igw-'));\nconsole.log(`Public Subnet Verification: Default IGW route active: ${hasDefaultIgw}`);",
        "output": "Public Subnet Verification: Default IGW route active: true",
        "codeNotes": [
          {
            "line": 7,
            "note": "Defines route table entries demonstrating local VPC peering alongside the default 0.0.0.0/0 internet gateway rule."
          },
          {
            "line": 12,
            "note": "Validates that the subnet qualifies as truly public by verifying the presence of an active IGW target."
          }
        ],
        "tryIt": "Add an IPv6 default route (::/0) targeting the Internet Gateway and verify dual-stack connectivity.",
        "check": {
          "question": "What configuration element designates a VPC subnet as a Public Subnet?",
          "options": [
            "Naming the subnet with the word 'public' in the AWS Management Console",
            "A route table entry pointing destination 0.0.0.0/0 to an attached Internet Gateway (IGW)",
            "Disabling all firewall rules and security groups on the instances"
          ],
          "answer": 1,
          "why": "A subnet is public if and only if its route table routes 0.0.0.0/0 traffic directly to an attached Internet Gateway."
        }
      },
      {
        "title": "Private Subnet Architecture and NAT Gateways",
        "say": [
          "The vast majority of enterprise cloud workloads belong in Private Subnets.",
          "A Private Subnet is a subnet whose associated route table lacks a direct route to an Internet Gateway.",
          "Instances residing in private subnets cannot be reached directly from the public internet, protecting backend databases from unauthorized scans.",
          "However, private application servers frequently require outbound internet access to download software security patches or query third-party APIs.",
          "To satisfy this requirement without exposing servers to unsolicited ingress, AWS provides the managed NAT Gateway.",
          "A Network Address Translation, or NAT, Gateway must be deployed physically within a Public Subnet and assigned a static Elastic IP.",
          "The route table of the private subnet is then configured with a default route of 0.0.0.0/0 pointing directly to the NAT Gateway ID.",
          "When a private instance initiates an outbound connection, the NAT Gateway rewrites the packet source IP to its own public Elastic IP.",
          "When the external server replies, the NAT Gateway translates the response back to the private instance IP.",
          "Crucially, the NAT Gateway allows outbound-initiated traffic only; external actors cannot initiate unsolicited inbound connections through the NAT."
        ],
        "example": "A one-way emergency security exit door in a theater that allows patrons inside to push through to the street, but cannot be opened from the outside street inward.",
        "code": "interface SubnetRoutingModel {\n  subnetName: string;\n  tier: 'Public' | 'Private';\n  defaultRouteTarget: string;\n  directInboundInternetAllowed: boolean;\n}\n\nconst subnets: SubnetRoutingModel[] = [\n  { subnetName: 'public-subnet-1a', tier: 'Public', defaultRouteTarget: 'igw-001', directInboundInternetAllowed: true },\n  { subnetName: 'private-app-1a', tier: 'Private', defaultRouteTarget: 'nat-001', directInboundInternetAllowed: false },\n];\n\nfor (const sub of subnets) {\n  console.log(`[${sub.tier}] ${sub.subnetName} -> Gateway: ${sub.defaultRouteTarget} (Ingress: ${sub.directInboundInternetAllowed})`);\n}",
        "output": "[Public] public-subnet-1a -> Gateway: igw-001 (Ingress: true)\n[Private] private-app-1a -> Gateway: nat-001 (Ingress: false)",
        "codeNotes": [
          {
            "line": 8,
            "note": "Models public and private subnets contrasting their default route targets (IGW vs NAT Gateway)."
          },
          {
            "line": 14,
            "note": "Outputs network isolation characteristics showing that private subnets strictly reject direct internet ingress."
          }
        ],
        "tryIt": "Add an isolated database subnet whose defaultRouteTarget is 'none' and observe its total network isolation.",
        "check": {
          "question": "Where must an AWS NAT Gateway be physically provisioned in order to provide outbound connectivity for private subnets?",
          "options": [
            "Inside the private subnet alongside the application servers",
            "Inside a public subnet that possesses an active route to an Internet Gateway",
            "On an on-premises physical datacenter router"
          ],
          "answer": 1,
          "why": "NAT Gateways must reside in a public subnet with an Internet Gateway route and an Elastic IP to translate traffic."
        }
      },
      {
        "title": "Multi-Tier Subnet Segmentation (Web, App, Data)",
        "say": [
          "Enterprise architecture mandates implementing a multi-tier network topology to enforce strict security segmentation.",
          "A production VPC should be structured into three distinct subnet tiers across at least two Availability Zones.",
          "The outermost tier is the Public Web Tier, housing public Application Load Balancers and Bastion jump hosts.",
          "The middle tier is the Private Application Tier, housing backend Node.js microservices, container tasks, and worker nodes.",
          "Instances in the Application Tier communicate with the outside world strictly through the NAT Gateway and receive traffic exclusively from the Web Tier.",
          "The innermost tier is the Isolated Data Tier, housing relational databases such as Amazon RDS PostgreSQL or Aurora clusters.",
          "The Data Tier route table contains zero internet routes: no Internet Gateway, no NAT Gateway, and zero external egress.",
          "Database instances communicate only locally within the VPC with authorized application instances.",
          "If an attacker somehow compromises a web server, the isolated data tier prevents direct exfiltration of database tables to public internet endpoints.",
          "This multi-tier defense-in-depth posture isolates damage and prevents horizontal lateral movement during security incidents."
        ],
        "example": "A medieval castle designed with three concentric defensive rings: the outer moat and drawbridge, the interior courtyard barracks, and the heavily guarded deep treasury vault.",
        "code": "type ArchitectureTier = 'Web' | 'Application' | 'Database';\n\ninterface SubnetSlice {\n  name: string;\n  tier: ArchitectureTier;\n  cidr: string;\n  hasInternetEgress: boolean;\n}\n\nconst threeTierArch: SubnetSlice[] = [\n  { name: 'web-1a', tier: 'Web', cidr: '10.0.1.0/24', hasInternetEgress: true },\n  { name: 'app-1a', tier: 'Application', cidr: '10.0.10.0/24', hasInternetEgress: true },\n  { name: 'db-1a', tier: 'Database', cidr: '10.0.20.0/24', hasInternetEgress: false },\n];\n\nconst secureDb = threeTierArch.find(s => s.tier === 'Database');\nconsole.log(`Isolated Tier: ${secureDb?.name} (${secureDb?.cidr}) - External Egress: ${secureDb?.hasInternetEgress}`);",
        "output": "Isolated Tier: db-1a (10.0.20.0/24) - External Egress: false",
        "codeNotes": [
          {
            "line": 8,
            "note": "Defines a three-tier subnet architecture isolating the database tier from all internet egress routes."
          },
          {
            "line": 15,
            "note": "Verifies that the database subnet possesses zero external egress capabilities for data protection."
          }
        ],
        "tryIt": "Duplicate the subnet configuration for Availability Zone 1b with distinct CIDR blocks (10.0.2.0/24, 10.0.11.0/24, 10.0.21.0/24).",
        "check": {
          "question": "Why should production database subnets have no route to either an Internet Gateway or a NAT Gateway?",
          "options": [
            "Because database software cannot operate if network packets are routable",
            "To prevent unauthorized data exfiltration and eliminate external attack vectors against database ports",
            "Because AWS charges a million dollars per minute for database internet connections"
          ],
          "answer": 1,
          "why": "Total network isolation prevents external hackers from probing database ports and prevents compromised hosts from exfiltrating data."
        }
      },
      {
        "title": "VPC Peering & Transit Gateway Scalability",
        "say": [
          "As modern organizations expand, multiple VPCs are created to segregate development, staging, production, and shared services.",
          "To allow services in separate VPCs to communicate privately without routing over the public internet, AWS offers VPC Peering.",
          "A VPC Peering connection is a private, point-to-point, encrypted network connection between two VPCs using AWS private fiber.",
          "Traffic traversing a peering link never touches the public internet, benefiting from high throughput and low latency.",
          "However, VPC Peering possesses a fundamental architectural limitation: it is strictly non-transitive.",
          "If VPC A is peered with VPC B, and VPC B is peered with VPC C, VPC A cannot communicate with VPC C through VPC B.",
          "For an enterprise with N VPCs desiring full interconnection, the number of required peering connections scales as N*(N-1)/2.",
          "Managing ten VPCs requires 45 peering links; managing one hundred VPCs requires an unmanageable 4,950 peering links.",
          "To resolve this operational bottleneck, AWS created AWS Transit Gateway.",
          "Transit Gateway acts as a central cloud router connecting hundreds of VPCs and corporate on-premises VPNs in an elegant hub-and-spoke star topology."
        ],
        "example": "Connecting ten offices with direct dedicated telephone wires between every pair of desks versus installing a single central automated telephone switchboard.",
        "code": "function calculatePeeringMeshLinks(vpcCount: number) {\n  const meshLinks = (vpcCount * (vpcCount - 1)) / 2;\n  const transitGatewayAttachments = vpcCount;\n  return { vpcCount, meshLinks, transitGatewayAttachments };\n}\n\nconst smallNet = calculatePeeringMeshLinks(5);\nconst largeNet = calculatePeeringMeshLinks(20);\nconsole.log(`5 VPCs: ${smallNet.meshLinks} peerings vs ${smallNet.transitGatewayAttachments} TGW attachments | 20 VPCs: ${largeNet.meshLinks} peerings vs ${largeNet.transitGatewayAttachments} TGW attachments`);",
        "output": "5 VPCs: 10 peerings vs 5 TGW attachments | 20 VPCs: 190 peerings vs 20 TGW attachments",
        "codeNotes": [
          {
            "line": 2,
            "note": "Applies the complete mesh formula N*(N-1)/2 to calculate required peerings versus hub-and-spoke attachments."
          },
          {
            "line": 9,
            "note": "Contrasts the exponential explosion of peering links against linear Transit Gateway attachment scaling."
          }
        ],
        "tryIt": "Calculate link counts for a massive enterprise network containing 50 interconnected VPCs.",
        "check": {
          "question": "What is the primary operational advantage of AWS Transit Gateway over a full mesh of VPC Peering connections?",
          "options": [
            "Transit Gateway provides free unlimited compute instances for all connected accounts",
            "Transit Gateway provides a centralized hub-and-spoke router, replacing complex point-to-point meshes with linear attachments",
            "Transit Gateway bypasses all Security Groups and IAM permissions automatically"
          ],
          "answer": 1,
          "why": "Transit Gateway replaces hundreds of point-to-point peering connections with a single hub-and-spoke router, simplifying management."
        }
      }
    ],
    "summary": [
      "VPCs provide isolated private IPv4 networks using RFC 1918 CIDR blocks with exactly five addresses reserved per subnet.",
      "Public subnets route 0.0.0.0/0 to an Internet Gateway, while private subnets route outbound egress through a public NAT Gateway.",
      "A three-tier architecture separates public web balancers, private application runtimes, and completely isolated databases."
    ],
    "projectStep": {
      "title": "VPC Subnet & Route Table Architecture",
      "steps": [
        "Carve out non-overlapping /24 subnets across two AZs for Web, Application, and Database tiers",
        "Attach an Internet Gateway to the VPC and configure public subnet route tables with default 0.0.0.0/0 routes",
        "Deploy a NAT Gateway in the public subnet and link the private application route table for outbound egress"
      ]
    }
  },
  {
    "day": 4,
    "title": "Security Groups vs Network Access Control Lists (NACLs)",
    "goal": "Master stateful instance-level firewalls (Security Groups) vs stateless subnet-level packet filters (NACLs).",
    "minutes": 25,
    "recap": "Yesterday we structured subnets and routing inside our VPC. Today we construct the firewalls that protect those subnets and instances: Security Groups and NACLs.",
    "parts": [
      {
        "title": "Security Groups: Stateful Instance-Level Firewalls",
        "say": [
          "Security Groups operate as the primary virtual firewall protecting individual compute instances and Elastic Network Interfaces, or ENIs.",
          "When you attach a Security Group to an EC2 instance, it inspects network traffic directly at the hypervisor network interface layer.",
          "The most fundamental rule governing Security Groups is that they are stateful.",
          "Stateful filtering means that if an inbound request is permitted through the firewall, the corresponding outbound response is automatically allowed.",
          "The firewall automatically tracks active connection state in memory; you never need to configure matching outbound rules for legitimate inbound replies.",
          "Furthermore, Security Groups support Allow Rules only; you cannot write explicit Deny rules.",
          "By default, a freshly created Security Group blocks all inbound traffic from every source.",
          "Unless you explicitly authorize a port and CIDR block, all incoming packets are silently dropped by the hypervisor.",
          "Security Groups evaluate all configured allow rules simultaneously before making an authorization decision.",
          "This stateful behavior makes Security Groups intuitive, secure, and resilient against misconfiguration."
        ],
        "example": "A hotel guest keycard: once you unlock the door from the outside to enter your room, you can always open the door from the inside to walk out without needing a second key.",
        "code": "interface SecurityGroupRule {\n  protocol: 'tcp' | 'udp' | 'icmp';\n  port: number;\n  sourceCidr: string;\n  description: string;\n}\n\nconst webSgRules: SecurityGroupRule[] = [\n  { protocol: 'tcp', port: 443, sourceCidr: '0.0.0.0/0', description: 'Public HTTPS ingress' },\n  { protocol: 'tcp', port: 80, sourceCidr: '0.0.0.0/0', description: 'HTTP redirection ingress' },\n];\n\nfunction isTrafficAllowed(rules: SecurityGroupRule[], port: number, proto: string) {\n  return rules.some(r => r.port === port && r.protocol === proto);\n}\n\nconsole.log(`Port 443 Allowed: ${isTrafficAllowed(webSgRules, 443, 'tcp')} | Port 22 SSH Allowed: ${isTrafficAllowed(webSgRules, 22, 'tcp')}`);",
        "output": "Port 443 Allowed: true | Port 22 SSH Allowed: false",
        "codeNotes": [
          {
            "line": 8,
            "note": "Defines explicit Security Group allow rules authorizing incoming web traffic on ports 80 and 443."
          },
          {
            "line": 15,
            "note": "Evaluates whether specific ports are allowed, showing that unlisted ports like SSH 22 are denied by default."
          }
        ],
        "tryIt": "Add an administrative rule allowing port 22 only from a corporate office CIDR (198.51.100.14/32).",
        "check": {
          "question": "What does it mean that an AWS Security Group is 'stateful'?",
          "options": [
            "It remembers user login sessions and password cookies across browser restarts",
            "If an inbound packet is allowed in, the outbound return response is automatically permitted regardless of outbound rules",
            "It only functions within a single United States geographic state"
          ],
          "answer": 1,
          "why": "Stateful firewalls automatically track connection state, allowing response traffic out without needing explicit outbound rules."
        }
      },
      {
        "title": "Security Group Chaining and Source Referencing",
        "say": [
          "In a production cloud environment, you should never allow application servers to connect to databases using hardcoded IP addresses.",
          "EC2 instances and containers frequently scale up, terminate, and restart with newly assigned private IP addresses.",
          "To solve this problem cleanly, AWS Security Groups support Security Group Chaining, also known as Source Referencing.",
          "Instead of entering an IP address CIDR block in a rule, you specify the ID of another Security Group as the authorized source.",
          "Consider a standard two-tier application consisting of web servers and a private database.",
          "You create a Web Security Group with ID sg-web, and a Database Security Group with ID sg-db.",
          "In sg-db, you add an inbound PostgreSQL rule on port 5432 with the source set to sg-web.",
          "Now, any compute instance associated with sg-web is automatically permitted to query the database on port 5432.",
          "If your Auto Scaling Group launches twenty additional web instances, they can communicate with the database immediately.",
          "Zero firewall configuration changes are required, eliminating manual IP management and hardcoded network rules."
        ],
        "example": "A backstage VIP festival lounge that grants entry to anyone wearing an official blue crew wristband, without checking individual employee names or driver licenses.",
        "code": "interface ChainedRule {\n  targetPort: number;\n  sourceSecurityGroupId: string;\n}\n\nconst dbSecurityGroup: { id: string; inbound: ChainedRule[] } = {\n  id: 'sg-database-99',\n  inbound: [\n    { targetPort: 5432, sourceSecurityGroupId: 'sg-app-servers-01' }\n  ]\n};\n\nfunction canConnectToDb(clientSgId: string, port: number) {\n  return dbSecurityGroup.inbound.some(r => r.targetPort === port && r.sourceSecurityGroupId === clientSgId);\n}\n\nconsole.log(`App Server (sg-app-servers-01): ${canConnectToDb('sg-app-servers-01', 5432)} | Rogue Server (sg-untrusted-02): ${canConnectToDb('sg-untrusted-02', 5432)}`);",
        "output": "App Server (sg-app-servers-01): true | Rogue Server (sg-untrusted-02): false",
        "codeNotes": [
          {
            "line": 6,
            "note": "Declares a database Security Group rule where the source is another Security Group ID rather than a CIDR IP block."
          },
          {
            "line": 15,
            "note": "Tests connection authorization based on the client instance's attached security group identity."
          }
        ],
        "tryIt": "Add a secondary rule allowing cache queries on port 6379 from the same application security group.",
        "check": {
          "question": "What is the primary benefit of referencing another Security Group ID as the source in an inbound rule?",
          "options": [
            "It automatically lowers AWS network bandwidth fees by fifty percent",
            "It allows instances in the source security group to connect without needing to maintain brittle, changing IP address lists",
            "It encrypts database network traffic without requiring SSL or TLS certificates"
          ],
          "answer": 1,
          "why": "Referencing Security Group IDs allows dynamic fleets of instances to communicate seamlessly without tracking individual IP addresses."
        }
      },
      {
        "title": "Network Access Control Lists (NACLs): Stateless Subnet Firewalls",
        "say": [
          "While Security Groups protect individual instances, Network Access Control Lists, or NACLs, guard entire subnets.",
          "A NACL operates as a perimeter packet filter at the boundary of a VPC subnet.",
          "Any network packet entering or exiting the subnet must pass through the associated NACL before reaching an instance's Security Group.",
          "The defining characteristic of a NACL is that it is stateless.",
          "A stateless firewall does not track connection state; it evaluates every single incoming and outgoing packet independently.",
          "If an incoming HTTP request is permitted on inbound port 80, the return response packet is not automatically allowed.",
          "You must explicitly author an outbound rule permitting the response traffic out of the subnet.",
          "Unlike Security Groups, NACLs support both explicit Allow and explicit Deny rules.",
          "This capability makes NACLs the primary mechanism for blocking malicious IP addresses or compromised CIDR blocks at the subnet perimeter.",
          "Every subnet in a VPC must be associated with exactly one NACL at all times."
        ],
        "example": "An international border checkpoint where customs officers inspect every vehicle entering the country and re-inspect every vehicle departing, keeping no memory of previous entries.",
        "code": "type NaclAction = 'ALLOW' | 'DENY';\n\ninterface NaclRule {\n  ruleNumber: number;\n  protocol: string;\n  port: number;\n  cidr: string;\n  action: NaclAction;\n}\n\nconst subnetNaclInbound: NaclRule[] = [\n  { ruleNumber: 50, protocol: 'tcp', port: 443, cidr: '198.51.100.23/32', action: 'DENY' },\n  { ruleNumber: 100, protocol: 'tcp', port: 443, cidr: '0.0.0.0/0', action: 'ALLOW' },\n  { ruleNumber: 32767, protocol: 'all', port: 0, cidr: '0.0.0.0/0', action: 'DENY' }, // default catch-all\n];\n\nconsole.log(`Configured ${subnetNaclInbound.length} NACL rules. Rule 50 explicitly blocks malicious IP: ${subnetNaclInbound[0].cidr}`);",
        "output": "Configured 3 NACL rules. Rule 50 explicitly blocks malicious IP: 198.51.100.23/32",
        "codeNotes": [
          {
            "line": 11,
            "note": "Defines an ordered list of NACL rules featuring explicit DENY before a broader ALLOW rule."
          },
          {
            "line": 17,
            "note": "Shows that explicit IP blacklisting occurs at the subnet perimeter via low-numbered rule precedence."
          }
        ],
        "tryIt": "Add rule 60 to deny inbound traffic from an entire compromised subnet CIDR (203.0.113.0/24).",
        "check": {
          "question": "Why must a network engineer configure outbound rules on a NACL when allowing inbound web traffic on port 443?",
          "options": [
            "Because NACLs are stateless and do not automatically permit return response packets",
            "Because web browsers refuse to connect unless port 443 is encrypted twice",
            "Because AWS requires outbound rules to generate billing invoices"
          ],
          "answer": 0,
          "why": "NACLs are stateless; outbound return traffic is evaluated independently and must be explicitly allowed."
        }
      },
      {
        "title": "NACL Rule Evaluation and Numbered Priority",
        "say": [
          "NACL rules are evaluated in strict ascending numerical order, starting from the lowest rule number.",
          "Rule numbers range from 1 to 32,766, with an immutable asterisk rule evaluated last as a default deny catch-all.",
          "As soon as a packet matches a rule's criteria, AWS immediately applies the action (ALLOW or DENY) and halts further processing.",
          "No subsequent rules are ever evaluated once an earlier rule match occurs.",
          "For example, suppose rule 100 explicitly ALLOWS port 443 from 0.0.0.0/0, and rule 200 DENIES port 443 from a known attacker IP.",
          "Because 100 is evaluated before 200, the attacker matches rule 100 and is allowed in; rule 200 is never reached.",
          "To properly block the attacker, you must assign the DENY rule a lower number than the broad allow rule, such as rule 50.",
          "When designing NACL rules, engineers space rule numbers by increments of 10 or 100, such as 100, 110, and 120.",
          "This numbering strategy provides ample room to insert urgent block rules between existing rules during security incidents.",
          "Disciplined rule numbering ensures predictable, deterministic subnet packet filtering."
        ],
        "example": "A legal contract where clause number 10 states a specific exception that takes precedence over the broad general rules stated in clause 100.",
        "code": "function evaluateNacl(rules: NaclRule[], clientIp: string, port: number): NaclAction {\n  // Sort rules ascending by ruleNumber\n  const sorted = [...rules].sort((a, b) => a.ruleNumber - b.ruleNumber);\n  for (const r of sorted) {\n    if (r.port === port && (r.cidr === '0.0.0.0/0' || r.cidr.includes(clientIp))) {\n      return r.action; // First match terminates evaluation\n    }\n  }\n  return 'DENY';\n}\n\nconst rules: NaclRule[] = [\n  { ruleNumber: 100, protocol: 'tcp', port: 80, cidr: '0.0.0.0/0', action: 'ALLOW' },\n  { ruleNumber: 40, protocol: 'tcp', port: 80, cidr: '198.51.100.99', action: 'DENY' },\n];\n\nconsole.log(`Attacker (198.51.100.99): ${evaluateNacl(rules, '198.51.100.99', 80)} | Legitimate User (10.0.5.12): ${evaluateNacl(rules, '10.0.5.12', 80)}`);",
        "output": "Attacker (198.51.100.99): DENY | Legitimate User (10.0.5.12): ALLOW",
        "codeNotes": [
          {
            "line": 4,
            "note": "Sorts rules by ascending rule number to enforce lowest-number-wins priority evaluation."
          },
          {
            "line": 17,
            "note": "Demonstrates that rule 40 DENY intercepts the attacker before rule 100 ALLOW is evaluated."
          }
        ],
        "tryIt": "Swap rule numbers so ALLOW is 30 and DENY is 50, and observe how the attacker is mistakenly allowed in.",
        "check": {
          "question": "If rule 100 allows port 80 from 0.0.0.0/0 and rule 150 denies port 80 from 192.0.2.1, what happens to packets from 192.0.2.1?",
          "options": [
            "The packets are dropped because DENY rules always take precedence regardless of number",
            "The packets are allowed because rule 100 is evaluated first and immediately permits the traffic",
            "The NACL crashes and drops all subnet traffic"
          ],
          "answer": 1,
          "why": "NACL rules are processed in ascending order; rule 100 matches first and immediately permits the packet, so rule 150 is ignored."
        }
      },
      {
        "title": "Ephemeral Port Management in Stateless Firewalls",
        "say": [
          "One of the most common mistakes when configuring custom NACLs is failing to accommodate Ephemeral Ports.",
          "When an external client initiates an HTTPS connection to your web server on port 443, your web server must send a response back.",
          "The client does not receive the response on port 443; the client operating system opens a high-numbered temporary port.",
          "These temporary receiving ports are known as Ephemeral Ports.",
          "Different client operating systems utilize different ephemeral port ranges.",
          "Linux clients typically allocate ports 32,768 through 60,999, while Windows clients use ports 1,024 through 65,535.",
          "AWS NAT Gateways utilize ports 1,024 through 65,535 to manage outbound connections from private subnets.",
          "Because NACLs are stateless, you must configure an outbound rule allowing response traffic to ports 1,024 through 65,535.",
          "If you configure an outbound NACL rule allowing port 443 only, incoming requests reach your web server, but every response is blocked at the subnet perimeter.",
          "The client browser times out, creating a baffling network issue that can only be diagnosed by understanding stateless ephemeral routing."
        ],
        "example": "Sending a letter to a corporate office: you address the envelope to their main street address, but include your private apartment number on the return label so their response reaches your mailbox.",
        "code": "interface EphemeralCheck {\n  sourcePort: number;\n  destPort: number;\n  isEphemeralResponse: boolean;\n}\n\nfunction classifyOutboundPacket(destPort: number): EphemeralCheck {\n  // AWS recommended ephemeral range: 1024 - 65535\n  const isEphemeral = destPort >= 1024 && destPort <= 65535;\n  return { sourcePort: 443, destPort, isEphemeralResponse: isEphemeral };\n}\n\nconst clientA = classifyOutboundPacket(49152);\nconst badClient = classifyOutboundPacket(22);\nconsole.log(`Client Ephemeral Port 49152: Allowed = ${clientA.isEphemeralResponse} | Port 22: Allowed = ${badClient.isEphemeralResponse}`);",
        "output": "Client Ephemeral Port 49152: Allowed = true | Port 22: Allowed = false",
        "codeNotes": [
          {
            "line": 8,
            "note": "Inspects outbound destination ports against the standard AWS ephemeral response range (1024-65535)."
          },
          {
            "line": 14,
            "note": "Demonstrates that return web traffic directed to high-numbered client ports passes the ephemeral check."
          }
        ],
        "tryIt": "Test a client port of 80 to verify that return traffic cannot be sent to low-numbered privileged ports.",
        "check": {
          "question": "Why must an outbound NACL for a web server allow traffic to destination ports 1024 through 65535?",
          "options": [
            "Because web servers secretly run peer-to-peer torrent clients",
            "Because client computers receive responses on temporary high-numbered ephemeral ports chosen by their operating system",
            "Because AWS charges penalty fees if high ports are closed"
          ],
          "answer": 1,
          "why": "Clients allocate temporary ephemeral ports (1024-65535) to receive replies; stateless NACLs must permit outbound traffic to them."
        }
      },
      {
        "title": "Defense-in-Depth: Combining NACLs and Security Groups",
        "say": [
          "Enterprise cloud security relies on Defense-in-Depth: layering multiple independent security controls throughout the architecture.",
          "NACLs and Security Groups are not competing alternatives; they are complementary defenses operating at different network layers.",
          "The Network ACL acts as the coarse-grained subnet boundary checkpoint.",
          "It is ideal for broad geographic IP blocklisting, rejecting unwanted traffic before packets ever consume hypervisor compute cycles.",
          "Inside the subnet, Security Groups provide fine-grained, stateful, instance-level microsegmentation.",
          "Security Groups enforce role-based access, chaining application tiers and restricting communication strictly to necessary service ports.",
          "For an incoming packet to reach your application process, it must successfully pass both firewalls in sequence.",
          "First, the NACL evaluates its numbered rules and permits the packet into the subnet.",
          "Second, the instance Security Group evaluates its allow rules and permits the packet into the virtual network interface.",
          "If either firewall rejects the packet, the traffic is immediately dropped, providing robust protection against administrative misconfigurations."
        ],
        "example": "A gated residential community where a security guard checkpoint at the main entrance gate verifies all arriving vehicles, while individual homeowners maintain digital smart locks on their front doors.",
        "code": "interface Packet {\n  srcIp: string;\n  dstPort: number;\n}\n\nfunction simulateDefenseInDepth(packet: Packet, blockedIps: string[], allowedPorts: number[]): { passed: boolean; stoppedBy?: string } {\n  // Layer 1: Stateless Subnet NACL check\n  if (blockedIps.includes(packet.srcIp)) {\n    return { passed: false, stoppedBy: 'NACL Perimeter Block' };\n  }\n  // Layer 2: Stateful Security Group check\n  if (!allowedPorts.includes(packet.dstPort)) {\n    return { passed: false, stoppedBy: 'Security Group Port Deny' };\n  }\n  return { passed: true };\n}\n\nconst p1 = simulateDefenseInDepth({ srcIp: '198.51.100.4', dstPort: 443 }, ['198.51.100.4'], [443]);\nconst p2 = simulateDefenseInDepth({ srcIp: '10.0.1.5', dstPort: 22 }, ['198.51.100.4'], [443]);\nconst p3 = simulateDefenseInDepth({ srcIp: '10.0.1.5', dstPort: 443 }, ['198.51.100.4'], [443]);\n\nconsole.log(`Attacker: ${p1.stoppedBy} | Wrong Port: ${p2.stoppedBy} | Legitimate: Passed = ${p3.passed}`);",
        "output": "Attacker: NACL Perimeter Block | Wrong Port: Security Group Port Deny | Legitimate: Passed = true",
        "codeNotes": [
          {
            "line": 7,
            "note": "Executes Layer 1 subnet NACL filtering to block blacklisted IP addresses at the perimeter."
          },
          {
            "line": 11,
            "note": "Executes Layer 2 Security Group microsegmentation to enforce strict application port authorization."
          }
        ],
        "tryIt": "Add a third security layer checking for valid TLS encryption protocols.",
        "check": {
          "question": "In what order are an inbound network packet's firewall checks evaluated when arriving from the internet to an EC2 instance?",
          "options": [
            "First the EC2 Security Group is evaluated, followed by the Subnet NACL",
            "First the Subnet NACL is evaluated at the perimeter, followed by the instance Security Group",
            "Only the Security Group is evaluated; NACLs are purely optional diagnostic logs"
          ],
          "answer": 1,
          "why": "Packets cross the subnet boundary first (evaluated by NACLs) before reaching the instance ENI (evaluated by Security Groups)."
        }
      }
    ],
    "summary": [
      "Security Groups are stateful firewalls operating at the ENI layer that support allow-only rules and source security group chaining.",
      "NACLs are stateless packet filters operating at the subnet boundary that evaluate numbered rules in strict ascending order.",
      "Defense-in-depth pairs subnet NACL IP blocklisting with instance Security Group microsegmentation for dual-layer protection."
    ],
    "projectStep": {
      "title": "Perimeter Firewall Hardening & SG Chaining",
      "steps": [
        "Create an ALB Security Group allowing inbound HTTP/HTTPS from 0.0.0.0/0",
        "Create an App Security Group allowing ingress on port 8080 strictly from the ALB Security Group ID",
        "Configure custom NACL rules blocking known malicious CIDRs while allowing outbound ephemeral return traffic (1024-65535)"
      ]
    }
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host",
    "goal": "Construct a production-grade multi-AZ VPC architecture with redundant public/private subnets, NAT gateways, and a secure Bastion host.",
    "minutes": 30,
    "recap": "Over the last four days we mastered cloud computing models, global infrastructure, VPC subnetting, and network security firewalls. Today we bring them all together in Milestone 1 to build a production VPC topology.",
    "parts": [
      {
        "title": "Production Multi-AZ Topology Blueprint",
        "say": [
          "Congratulations on reaching Milestone 1 in your cloud native engineering journey.",
          "Today we synthesize your networking knowledge to construct a production-ready AWS VPC architecture.",
          "Our production blueprint spans two distinct Availability Zones within our chosen region to guarantee fault tolerance.",
          "Across these two zones, we provision exactly six subnets: three subnets in Zone A, and three subnets in Zone B.",
          "In Zone A, we create public-subnet-1a, private-app-1a, and isolated-db-1a.",
          "In Zone B, we create public-subnet-1b, private-app-1b, and isolated-db-1b.",
          "The parent VPC is assigned a 10.0.0.0/16 CIDR block, while each individual subnet is allocated a dedicated /24 slice.",
          "This architecture ensures that if a physical power outage knocks out all datacenters in Zone A, our applications continue running in Zone B.",
          "By separating public load balancers, private compute runtimes, and isolated databases, we achieve world-class security and resilience.",
          "Let us inspect the complete blueprint structure."
        ],
        "example": "A twin-hull catamaran ocean vessel: if one hull is damaged by ocean debris, the second hull keeps the entire vessel afloat and operational.",
        "code": "interface SubnetSpec {\n  name: string;\n  az: string;\n  cidr: string;\n  type: 'Public' | 'App' | 'Database';\n}\n\nconst milestoneVpc: SubnetSpec[] = [\n  { name: 'public-1a', az: 'us-east-1a', cidr: '10.0.1.0/24', type: 'Public' },\n  { name: 'public-1b', az: 'us-east-1b', cidr: '10.0.2.0/24', type: 'Public' },\n  { name: 'app-1a', az: 'us-east-1a', cidr: '10.0.11.0/24', type: 'App' },\n  { name: 'app-1b', az: 'us-east-1b', cidr: '10.0.12.0/24', type: 'App' },\n  { name: 'db-1a', az: 'us-east-1a', cidr: '10.0.21.0/24', type: 'Database' },\n  { name: 'db-1b', az: 'us-east-1b', cidr: '10.0.22.0/24', type: 'Database' },\n];\n\nconst azSet = new Set(milestoneVpc.map(s => s.az));\nconsole.log(`VPC Topology: ${milestoneVpc.length} subnets distributed across ${azSet.size} Availability Zones`);",
        "output": "VPC Topology: 6 subnets distributed across 2 Availability Zones",
        "codeNotes": [
          {
            "line": 8,
            "note": "Defines the complete 6-subnet production blueprint spanning two independent Availability Zones."
          },
          {
            "line": 17,
            "note": "Verifies multi-AZ redundancy by confirming that subnets are balanced across both zones."
          }
        ],
        "tryIt": "Expand the topology to a 3-AZ configuration adding Zone 1c subnets and compute the total subnet count.",
        "check": {
          "question": "Why does our production VPC topology feature six separate subnets across two Availability Zones?",
          "options": [
            "Because AWS forces all VPCs to have exactly six subnets upon creation",
            "To isolate Web, Application, and Database tiers while ensuring high availability across two independent physical zones",
            "To allow employees to watch streaming television during work breaks"
          ],
          "answer": 1,
          "why": "Six subnets provide three tiers of security isolation (Public, App, DB) across two physical AZs for high availability."
        }
      },
      {
        "title": "Redundant NAT Gateway Placement",
        "say": [
          "A critical architectural requirement for high availability is deploying redundant NAT Gateways across Availability Zones.",
          "In a naïve, cost-cutting setup, an engineer might deploy a single NAT Gateway in public-subnet-1a and route both private subnets through it.",
          "However, this creates a catastrophic cross-AZ Single Point of Failure.",
          "If Availability Zone A suffers an outage, the NAT Gateway goes offline, causing all instances in private-app-1b to lose outbound internet connectivity.",
          "Furthermore, routing traffic across Availability Zone boundaries incurs unnecessary AWS cross-AZ data transfer fees.",
          "In our production Milestone 1 architecture, we deploy two independent NAT Gateways: nat-gw-1a in public-subnet-1a, and nat-gw-1b in public-subnet-1b.",
          "Private-app-1a uses a route table pointing 0.0.0.0/0 directly to nat-gw-1a.",
          "Private-app-1b uses an independent route table pointing 0.0.0.0/0 directly to nat-gw-1b.",
          "Traffic remains entirely within its respective Availability Zone, eliminating cross-AZ failure propagation and avoiding extra data transfer costs.",
          "Redundancy at every networking layer is the core hallmark of enterprise cloud architecture."
        ],
        "example": "An office building with two separate stairwells having independent emergency exits on both sides, ensuring that a blockage in the east stairwell does not trap workers in the west wing.",
        "code": "interface NatMapping {\n  appSubnet: string;\n  assignedNatGateway: string;\n  natAz: string;\n  appAz: string;\n}\n\nconst natArchitecture: NatMapping[] = [\n  { appSubnet: 'app-1a', assignedNatGateway: 'nat-gw-1a', natAz: 'us-east-1a', appAz: 'us-east-1a' },\n  { appSubnet: 'app-1b', assignedNatGateway: 'nat-gw-1b', natAz: 'us-east-1b', appAz: 'us-east-1b' },\n];\n\nconst crossAzRisk = natArchitecture.some(m => m.natAz !== m.appAz);\nconsole.log(`NAT Gateway Redundancy Active: ${natArchitecture.length} Gateways. Cross-AZ Failure Risk: ${crossAzRisk}`);",
        "output": "NAT Gateway Redundancy Active: 2 Gateways. Cross-AZ Failure Risk: false",
        "codeNotes": [
          {
            "line": 8,
            "note": "Maps private application subnets to dedicated NAT Gateways residing in the exact same Availability Zone."
          },
          {
            "line": 13,
            "note": "Asserts that zero cross-AZ dependencies exist between application instances and their respective NAT Gateways."
          }
        ],
        "tryIt": "Simulate a cost-optimized single-NAT setup and observe how crossAzRisk becomes true.",
        "check": {
          "question": "What is the primary risk of using a single NAT Gateway to serve private subnets across multiple Availability Zones?",
          "options": [
            "NAT Gateways cannot handle more than three concurrent HTTP connections",
            "The single NAT Gateway becomes a Single Point of Failure; if its AZ fails, all private subnets lose internet access",
            "AWS immediately locks the user's root account for violating terms of service"
          ],
          "answer": 1,
          "why": "A single NAT Gateway creates a single point of failure; an outage in its zone breaks egress for all connected subnets."
        }
      },
      {
        "title": "Bastion Host (Jump Box) Architecture",
        "say": [
          "Because instances in private subnets lack public IP addresses, administrators cannot connect to them directly over the public internet.",
          "To enable secure administrative terminal access for operations staff, traditional architectures employ a Bastion Host, also known as a Jump Box.",
          "A Bastion Host is a heavily hardened, minimal Linux or Windows EC2 instance deployed inside a Public Subnet.",
          "Administrators establish an SSH connection to the public IP of the Bastion Host using an asymmetric cryptographic key pair.",
          "Once authenticated on the Bastion, the administrator can SSH into private instances over internal 10.0.0.0/16 private IP addresses.",
          "To secure a Bastion Host against automated internet attacks, strict firewall rules must be enforced.",
          "The Bastion's Security Group should never permit SSH from 0.0.0.0/0.",
          "Inbound port 22 must be locked down strictly to the specific static public IP addresses of corporate headquarters or authorized VPN gateways.",
          "All unnecessary background software services, compilers, and user accounts must be stripped from the Bastion operating system image.",
          "The Bastion serves as the tightly guarded front gate to your private infrastructure."
        ],
        "example": "A secure security guard station at the entrance of a high-tech corporate campus where visitors must present photo identification and sign the visitor log before being escorted into private research labs.",
        "code": "interface BastionConfig {\n  instanceName: string;\n  subnetPlacement: string;\n  allowedSshCidr: string;\n  isHardened: boolean;\n}\n\nconst bastion: BastionConfig = {\n  instanceName: 'prod-bastion-jump-01',\n  subnetPlacement: 'public-1a',\n  allowedSshCidr: '198.51.100.50/32', // Corporate HQ static IP\n  isHardened: true\n};\n\nconst isSecure = bastion.allowedSshCidr !== '0.0.0.0/0' && bastion.isHardened;\nconsole.log(`Bastion: ${bastion.instanceName} on ${bastion.subnetPlacement} | Locked to: ${bastion.allowedSshCidr} | Hardened: ${isSecure}`);",
        "output": "Bastion: prod-bastion-jump-01 on public-1a | Locked to: 198.51.100.50/32 | Hardened: true",
        "codeNotes": [
          {
            "line": 8,
            "note": "Configures a Bastion jump host deployed in a public subnet with strict single-IP CIDR restriction."
          },
          {
            "line": 15,
            "note": "Validates that the Bastion host rejects universal 0.0.0.0/0 internet SSH ingress."
          }
        ],
        "tryIt": "Change allowedSshCidr to 0.0.0.0/0 and observe how security validation detects the vulnerability.",
        "check": {
          "question": "What security rule must be strictly applied to an SSH Bastion Host's Security Group?",
          "options": [
            "Open port 22 to 0.0.0.0/0 so developers can connect from airport Wi-Fi without VPNs",
            "Restrict inbound port 22 strictly to known corporate static IP addresses or VPN gateways",
            "Disable all encryption protocols to speed up terminal rendering"
          ],
          "answer": 1,
          "why": "Bastions must restrict port 22 to authorized corporate IPs to prevent automated brute-force attacks from the internet."
        }
      },
      {
        "title": "AWS Systems Manager (SSM) Session Manager: The Modern Bastion",
        "say": [
          "While Bastion hosts provide secure access, managing SSH key pairs, rotating credentials, and maintaining public EC2 instances introduces operational friction.",
          "AWS Systems Manager Session Manager provides a modern, cloud-native replacement for traditional Bastion jump boxes.",
          "Session Manager enables secure, one-click browser-based terminal access to EC2 instances without opening any inbound ports.",
          "You do not need to open port 22, and instances do not need public IP addresses or Bastion hosts.",
          "The architecture relies on the lightweight Amazon SSM Agent preinstalled on modern Amazon Linux and Ubuntu AMIs.",
          "The SSM Agent initiates an outbound encrypted HTTPS connection over port 443 to the regional AWS Systems Manager service endpoint.",
          "Authentication is managed entirely through AWS IAM policies rather than fragile SSH keys.",
          "Every keystroke and session command is automatically logged and can be streamed directly to Amazon CloudWatch Logs and encrypted S3 buckets for compliance auditing.",
          "Access can be gated behind Multi-Factor Authentication and restricted based on IAM user roles.",
          "Session Manager completely eliminates inbound attack surfaces while delivering superior security auditability."
        ],
        "example": "A secure video conference call initiated from inside a private vault outward to authorized staff, requiring no open exterior doorway or telephone line.",
        "code": "interface SsmSessionProfile {\n  targetInstanceId: string;\n  hasPublicIp: boolean;\n  inboundPort22Open: boolean;\n  iamRoleAttached: boolean;\n  cloudWatchLoggingEnabled: boolean;\n}\n\nconst ssmTarget: SsmSessionProfile = {\n  targetInstanceId: 'i-0987654321fedcba',\n  hasPublicIp: false,\n  inboundPort22Open: false,\n  iamRoleAttached: true,\n  cloudWatchLoggingEnabled: true\n};\n\nconst isZeroTrustCompliant = !ssmTarget.hasPublicIp && !ssmTarget.inboundPort22Open && ssmTarget.iamRoleAttached;\nconsole.log(`SSM Target: ${ssmTarget.targetInstanceId} | Inbound Port 22 Open: ${ssmTarget.inboundPort22Open} | Zero-Trust Compliant: ${isZeroTrustCompliant}`);",
        "output": "SSM Target: i-0987654321fedcba | Inbound Port 22 Open: false | Zero-Trust Compliant: true",
        "codeNotes": [
          {
            "line": 9,
            "note": "Models an SSM-managed instance operating with zero open inbound ports and no public IP address."
          },
          {
            "line": 17,
            "note": "Evaluates zero-trust compliance demonstrating secure shell access governed entirely via IAM and outbound HTTPS."
          }
        ],
        "tryIt": "Simulate disabling IAM role attachment and observe why Session Manager cannot establish a control channel.",
        "check": {
          "question": "How does AWS Systems Manager Session Manager allow administrators to access a private EC2 terminal without opening port 22?",
          "options": [
            "It secretly opens port 22 when an administrator clicks connect and closes it afterward",
            "The SSM Agent on the instance initiates an outbound HTTPS connection to AWS SSM service endpoints",
            "It routes commands through public social media APIs"
          ],
          "answer": 1,
          "why": "The SSM Agent dials outbound over HTTPS (port 443) to AWS endpoints, allowing remote shell access with zero open inbound ports."
        }
      },
      {
        "title": "VPC Flow Logs for Network Observability",
        "say": [
          "To maintain operational visibility and audit network traffic throughout your VPC, AWS provides VPC Flow Logs.",
          "VPC Flow Logs capture detailed telemetry metadata regarding IP traffic flowing to and from network interfaces in your VPC.",
          "You can enable Flow Logs at three distinct granularities: at the VPC level, at the Subnet level, or on an individual Elastic Network Interface.",
          "Flow log records capture critical network fields including source IP, destination IP, source port, destination port, protocol number, packet count, and byte count.",
          "Most importantly, each record includes an action status: ACCEPT when traffic was permitted by Security Groups and NACLs, or REJECT when traffic was blocked.",
          "Flow log streams can be published directly to Amazon CloudWatch Logs for real-time alerting or stored in Amazon S3 for long-term historical analysis.",
          "Security operations teams use CloudWatch Metric Filters to alert when REJECT records spike on sensitive database ports, indicating active vulnerability scans.",
          "Network engineers analyze Flow Logs to diagnose connectivity issues when an application suddenly cannot reach a backend API.",
          "VPC Flow Logs introduce zero latency overhead because packet metadata is mirrored asynchronously by the AWS hypervisor."
        ],
        "example": "Automated highway traffic monitoring cameras capturing the license plate number, timestamp, and speed of every vehicle passing an intersection, flagging stolen vehicles without slowing traffic.",
        "code": "interface FlowLogRecord {\n  srcAddr: string;\n  dstAddr: string;\n  dstPort: number;\n  protocol: number; // 6 = TCP\n  action: 'ACCEPT' | 'REJECT';\n}\n\nconst capturedLogs: FlowLogRecord[] = [\n  { srcAddr: '198.51.100.9', dstAddr: '10.0.1.15', dstPort: 443, protocol: 6, action: 'ACCEPT' },\n  { srcAddr: '203.0.113.88', dstAddr: '10.0.21.5', dstPort: 5432, protocol: 6, action: 'REJECT' },\n  { srcAddr: '198.51.100.9', dstAddr: '10.0.1.15', dstPort: 22, protocol: 6, action: 'REJECT' },\n];\n\nconst securityThreats = capturedLogs.filter(l => l.action === 'REJECT');\nconsole.log(`Captured ${capturedLogs.length} flows. Blocked Intrusion Attempts: ${securityThreats.length} (${securityThreats.map(t => `Port ${t.dstPort}`).join(', ')})`);",
        "output": "Captured 3 flows. Blocked Intrusion Attempts: 2 (Port 5432, Port 22)",
        "codeNotes": [
          {
            "line": 9,
            "note": "Simulates VPC Flow Log records capturing traffic metadata and firewall enforcement actions (ACCEPT/REJECT)."
          },
          {
            "line": 15,
            "note": "Filters flow records to isolate security threats rejected by perimeter firewall rules."
          }
        ],
        "tryIt": "Add an ACCEPT record for internal microservice communication on port 8080.",
        "check": {
          "question": "What does an action status of REJECT indicate in an AWS VPC Flow Log record?",
          "options": [
            "The instance operating system crashed and refused to boot",
            "The network traffic was blocked by either a Security Group or a Network Access Control List rule",
            "The customer exceeded their monthly cloud data transfer budget"
          ],
          "answer": 1,
          "why": "An action of REJECT in Flow Logs means the packet was evaluated and blocked by either a Security Group or a NACL rule."
        }
      },
      {
        "title": "Milestone 1 Architecture Verification & Health Check",
        "say": [
          "With all components designed, we conclude Milestone 1 by conducting a rigorous architectural verification.",
          "A production-grade cloud native VPC must satisfy four immutable architectural criteria.",
          "First, the network must span at least two Availability Zones with symmetric subnet sizing across all three tiers.",
          "Second, the Internet Gateway must be attached to the VPC with default route propagation active in all public subnets.",
          "Third, dedicated NAT Gateways must be positioned in each public subnet with private route tables configured for AZ-local egress.",
          "Fourth, database subnets must remain completely isolated with zero internet routes, and all administrative access must be secured via SSM Session Manager.",
          "Let us execute our automated architectural validation suite to verify complete compliance with Milestone 1 standards.",
          "Passing this verification proves that our foundational cloud infrastructure is ready to host mission-critical microservices.",
          "Tomorrow, in Course Module 2, we will build upon this rock-solid network to master Identity and Access Management and compute fleets."
        ],
        "example": "The comprehensive pre-flight checklist conducted by commercial airline pilots, verifying navigation, engines, fuel reserves, and communications before takeoff.",
        "code": "interface VpcHealthCheck {\n  multiAzRedundancy: boolean;\n  publicSubnetCount: number;\n  privateSubnetCount: number;\n  isolatedDbSubnetCount: number;\n  natGatewaysConfigured: number;\n  ssmEnabled: boolean;\n}\n\nfunction verifyMilestoneOne(audit: VpcHealthCheck): boolean {\n  return audit.multiAzRedundancy &&\n    audit.publicSubnetCount >= 2 &&\n    audit.privateSubnetCount >= 2 &&\n    audit.isolatedDbSubnetCount >= 2 &&\n    audit.natGatewaysConfigured >= 2 &&\n    audit.ssmEnabled;\n}\n\nconst auditResult = verifyMilestoneOne({\n  multiAzRedundancy: true,\n  publicSubnetCount: 2,\n  privateSubnetCount: 2,\n  isolatedDbSubnetCount: 2,\n  natGatewaysConfigured: 2,\n  ssmEnabled: true\n});\n\nconsole.log(`Milestone 1 Production VPC Audit Passed: ${auditResult}`);",
        "output": "Milestone 1 Production VPC Audit Passed: true",
        "codeNotes": [
          {
            "line": 10,
            "note": "Defines the health check verification function evaluating multi-AZ redundancy and tier isolation."
          },
          {
            "line": 26,
            "note": "Executes the comprehensive audit and prints the final validation result."
          }
        ],
        "tryIt": "Simulate missing the second NAT gateway and verify that the audit properly flags the resilience violation.",
        "check": {
          "question": "Which of the following confirms that our Milestone 1 VPC satisfies high-availability standards?",
          "options": [
            "All subnets and NAT gateways are concentrated inside a single Availability Zone",
            "Subnets and redundant NAT gateways are balanced across at least two distinct Availability Zones with tier isolation",
            "All database ports are exposed directly to the public internet for fast debugging"
          ],
          "answer": 1,
          "why": "Distributing subnets and redundant NAT gateways across two or more AZs guarantees high availability during datacenter outages."
        }
      }
    ],
    "summary": [
      "Milestone 1 delivers a production-grade 6-subnet VPC spanning two Availability Zones for comprehensive fault tolerance.",
      "Redundant NAT Gateways placed in each public subnet eliminate cross-AZ failure dependency and avoid cross-AZ data fees.",
      "AWS Systems Manager Session Manager replaces legacy Bastions, enabling secure, audited shell access with zero open inbound ports."
    ],
    "projectStep": {
      "title": "Milestone 1 Production VPC Network Deployment",
      "steps": [
        "Provision a 10.0.0.0/16 VPC across two AZs with 6 subnets configured for Web, Application, and Database tiers",
        "Deploy redundant NAT Gateways in each public subnet and link private route tables to local gateways",
        "Configure SSM Session Manager IAM instance profiles and verify secure, keyless terminal access to private instances"
      ]
    }
  },
  {
    "day": 6,
    "title": "IAM Role Least-Privilege, Policies & Principal Trust",
    "goal": "Formulate least-privilege IAM policies, manage IAM roles, and configure principal trust relationships for compute workloads.",
    "minutes": 25,
    "recap": "Yesterday we completed Milestone 1 by building a production multi-AZ VPC. Today we master Identity and Access Management (IAM): controlling exactly who and what can perform actions on your cloud resources.",
    "parts": [
      {
        "title": "IAM Architecture: Users, Groups, and the Root Account",
        "say": [
          "AWS Identity and Access Management, or IAM, forms the security control plane governing authentication and authorization across all cloud resources.",
          "At the apex of an AWS account sits the Root User, created when the account is initially registered with an email address.",
          "The Root User possesses irrevocable, omnipotent administrative superpowers over every resource, service, and billing configuration in the account.",
          "Best practice mandates that the Root User credentials should never be utilized for everyday engineering tasks, automation scripts, or API interactions.",
          "You must lock away the root email and password, enable physical hardware Multi-Factor Authentication (MFA), and create zero programmatic access keys for root.",
          "For human engineers, organizations configure IAM Identity Center with Single Sign-On (SSO) or create individual IAM Users.",
          "IAM Groups act as collections of IAM users sharing identical job functions, such as Developers, SecurityAuditors, or DatabaseAdministrators.",
          "Instead of attaching individual permissions to hundreds of separate human accounts, permissions are attached directly to the group.",
          "When an employee transfers departments, removing them from the Developer group immediately strips all associated cloud privileges, enforcing clean governance.",
          "IAM operates as a global service, meaning users, groups, and permissions are synchronized worldwide across all AWS regions instantaneously."
        ],
        "example": "A master building vault key kept in a bank safe deposit box for rare emergencies, while company employees are issued electronic keycards granting access only to their specific department offices.",
        "code": "interface IamGroup {\n  groupName: string;\n  assignedPolicies: string[];\n  members: string[];\n}\n\nconst engineeringOrg: IamGroup[] = [\n  { groupName: 'Developers', assignedPolicies: ['ReadOnlyAccess', 'LambdaDeployerPolicy'], members: ['alice', 'bob'] },\n  { groupName: 'SecurityAuditors', assignedPolicies: ['SecurityAudit', 'CloudTrailReadOnly'], members: ['charlie'] },\n];\n\nfunction listUserPrivileges(user: string): string[] {\n  const groups = engineeringOrg.filter(g => g.members.includes(user));\n  return groups.flatMap(g => g.assignedPolicies);\n}\n\nconsole.log(`Privileges for alice: ${listUserPrivileges('alice').join(', ')}`);",
        "output": "Privileges for alice: ReadOnlyAccess, LambdaDeployerPolicy",
        "codeNotes": [
          {
            "line": 7,
            "note": "Defines IAM groups associating standardized policies with authorized corporate users."
          },
          {
            "line": 12,
            "note": "Aggregates policies from all groups a user belongs to, demonstrating role-based access control."
          }
        ],
        "tryIt": "Add a new member to SecurityAuditors and print their inherited audit privileges.",
        "check": {
          "question": "Why should everyday engineering tasks never be performed using the AWS Root User?",
          "options": [
            "Because the root user runs on slower compute hardware than normal IAM users",
            "Because the root user has unlimited power and cannot be restricted by IAM policies, presenting severe security risk",
            "Because AWS charges ten dollars every time the root user logs into the console"
          ],
          "answer": 1,
          "why": "The root user has unlimited, unrestrictable permissions; compromising root means losing total control of the entire AWS account."
        }
      },
      {
        "title": "JSON Policy Structure: Effect, Action, Resource, Condition",
        "say": [
          "IAM permissions are formally declared as JSON documents known as IAM Policies.",
          "Every permission statement inside an IAM policy relies on four core elements: Effect, Action, Resource, and Condition.",
          "The Effect element specifies whether the statement explicitly allows or denies the requested action, taking the value 'Allow' or 'Deny'.",
          "The Action element lists the specific AWS API operations being permitted, such as 's3:GetObject' or 'dynamodb:PutItem'.",
          "The Resource element defines the Amazon Resource Name, or ARN, of the specific entity upon which the actions can occur.",
          "Using wildcards like 's3:*' or 'Resource: *' violates the principle of least privilege by granting dangerous, blanket access across the entire account.",
          "Finally, the Condition element establishes contextual restrictions that must be satisfied for the policy to apply.",
          "Conditions can enforce multi-factor authentication, restrict access to a corporate IP address range, or require encrypted TLS connections.",
          "Authoring tight, granular JSON policy statements ensures that compromised application credentials cannot be weaponized against unrelated resources."
        ],
        "example": "A signed search warrant allowing investigators to examine specific filing cabinets in Room 204 between 9 AM and 5 PM, while explicitly forbidding searching any other office or safe.",
        "code": "interface PolicyStatement {\n  Effect: 'Allow' | 'Deny';\n  Action: string[];\n  Resource: string;\n  Condition?: Record<string, any>;\n}\n\nconst secureS3Policy: PolicyStatement = {\n  Effect: 'Allow',\n  Action: ['s3:GetObject', 's3:ListBucket'],\n  Resource: 'arn:aws:s3:::company-app-assets/*',\n  Condition: { Bool: { 'aws:SecureTransport': 'true' } }\n};\n\nconsole.log(`Policy Statement: Effect=${secureS3Policy.Effect} | Actions=${secureS3Policy.Action.join(', ')} | Resource=${secureS3Policy.Resource}`);",
        "output": "Policy Statement: Effect=Allow | Actions=s3:GetObject, s3:ListBucket | Resource=arn:aws:s3:::company-app-assets/*",
        "codeNotes": [
          {
            "line": 8,
            "note": "Constructs a least-privilege IAM policy statement permitting specific S3 read actions on a single bucket."
          },
          {
            "line": 12,
            "note": "Applies a condition enforcing TLS encrypted transport for all data access requests."
          }
        ],
        "tryIt": "Add an s3:PutObject action and observe how the policy expands to support file uploads.",
        "check": {
          "question": "What principle requires cloud architects to grant only the minimum permissions necessary for an application to perform its function?",
          "options": [
            "The Principle of Maximum Velocity",
            "The Principle of Least Privilege",
            "The Principle of Unrestricted Execution"
          ],
          "answer": 1,
          "why": "The Principle of Least Privilege mandates granting only the minimum permissions necessary for an identity to complete its task."
        }
      },
      {
        "title": "IAM Roles and Instance Profiles",
        "say": [
          "One of the most dangerous anti-patterns in cloud computing is hardcoding static AWS Access Keys directly into application code or configuration files.",
          "If a developer accidentally commits those access keys to a public GitHub repository, automated bots steal the credentials within seconds to deploy unauthorized crypto-miners.",
          "AWS eliminates the need for hardcoded credentials entirely through IAM Roles.",
          "An IAM Role is an identity that can be assumed by anyone or anything that needs temporary security credentials.",
          "Unlike an IAM user, an IAM role does not possess a permanent password or permanent access keys.",
          "To allow an Amazon EC2 instance to access cloud services, you attach the IAM Role to an Instance Profile, which is then assigned to the instance.",
          "The internal AWS EC2 Instance Metadata Service (IMDS) automatically generates temporary security credentials via AWS Security Token Service (STS).",
          "The AWS SDK running inside your application automatically fetches and transparently refreshes these temporary credentials every few hours.",
          "Even if an attacker gains read access to your application source code, there are zero static AWS keys to compromise.",
          "IAM Roles represent the gold standard for securing compute workloads across EC2, ECS, and Lambda."
        ],
        "example": "A temporary electronic visitor security badge issued at a corporate reception desk that automatically deactivates at 5 PM, rather than giving a visitor an permanent master building key.",
        "code": "interface TemporaryCredentials {\n  accessKeyId: string;\n  secretAccessKey: string;\n  sessionToken: string;\n  expiration: string;\n}\n\nfunction simulateStsAssumeRole(roleArn: string): TemporaryCredentials {\n  const randomSuffix = Math.random().toString(36).substring(7).toUpperCase();\n  return {\n    accessKeyId: `ASIA${randomSuffix}`, // ASIA prefix denotes STS temporary credentials\n    secretAccessKey: 'sec_temp_' + btoa(roleArn).substring(0, 16),\n    sessionToken: 'token_sample_' + Date.now(),\n    expiration: new Date(Date.now() + 3600 * 1000).toISOString()\n  };\n}\n\nconst creds = simulateStsAssumeRole('arn:aws:iam::123456789012:role/AppS3Reader');\nconsole.log(`Assumed Role: ${creds.accessKeyId.substring(0, 8)}... (Expires: ${creds.expiration})`);",
        "output": "Assumed Role: ASIAS261... (Expires: 2026-10-02T10:34:02.996Z)",
        "codeNotes": [
          {
            "line": 9,
            "note": "Simulates AWS STS temporary credential generation with standard ASIA prefix."
          },
          {
            "line": 18,
            "note": "Logs the ephemeral access key and its one-hour automated expiration timestamp."
          }
        ],
        "tryIt": "Inspect the expiration timestamp and verify that temporary credentials expire exactly one hour in the future.",
        "check": {
          "question": "Why should EC2 instances access AWS services using IAM Roles rather than hardcoded IAM user access keys?",
          "options": [
            "IAM Roles provide temporary, automatically rotated credentials through STS, eliminating hardcoded secret leaks",
            "IAM user access keys only work on Windows servers, while IAM Roles only work on Linux",
            "IAM Roles double the network bandwidth of the instance"
          ],
          "answer": 0,
          "why": "IAM Roles provide temporary credentials rotated automatically by STS, eliminating the risk of hardcoded credential leaks."
        }
      },
      {
        "title": "Trust Policies (AssumeRolePolicyDocument) vs Permission Policies",
        "say": [
          "Every IAM Role in AWS is defined by two fundamentally distinct JSON policy documents.",
          "The first document is the Trust Policy, known formally in the AWS API as the AssumeRolePolicyDocument.",
          "The Trust Policy answers the question: Who is allowed to put on this role?",
          "The Trust Policy defines the Principal, which can be an AWS service like ec2.amazonaws.com or lambda.amazonaws.com, or an external AWS account ID.",
          "Unless a service or entity is explicitly declared as a trusted principal in the trust policy, AWS strictly forbids that entity from assuming the role.",
          "The second document is the Permission Policy, which answers the question: What is this role allowed to do once assumed?",
          "The Permission Policy attaches standard IAM statements granting actions like 's3:GetObject' or 'sqs:SendMessage'.",
          "A role can have the most powerful administrative permission policy attached to it, but if its trust policy only trusts lambda.amazonaws.com, an EC2 instance cannot use it.",
          "Separating the Trust Policy from the Permission Policy enforces a clean, modular boundary between authentication and authorization."
        ],
        "example": "A theatrical costume and badge: the trust policy specifies that only verified stunt actors registered with the stage manager can put on the police uniform, while the permission policy specifies what stage areas the uniform grants access to.",
        "code": "interface TrustPolicy {\n  Statement: [{\n    Effect: 'Allow';\n    Principal: { Service: string };\n    Action: 'sts:AssumeRole';\n  }];\n}\n\nconst ec2TrustPolicy: TrustPolicy = {\n  Statement: [{\n    Effect: 'Allow',\n    Principal: { Service: 'ec2.amazonaws.com' },\n    Action: 'sts:AssumeRole'\n  }]\n};\n\nfunction canServiceAssume(policy: TrustPolicy, serviceName: string): boolean {\n  return policy.Statement.some(s => s.Principal.Service === serviceName);\n}\n\nconsole.log(`EC2 Service Allowed: ${canServiceAssume(ec2TrustPolicy, 'ec2.amazonaws.com')} | Lambda Service Allowed: ${canServiceAssume(ec2TrustPolicy, 'lambda.amazonaws.com')}`);",
        "output": "EC2 Service Allowed: true | Lambda Service Allowed: false",
        "codeNotes": [
          {
            "line": 9,
            "note": "Defines an IAM Role Trust Policy explicitly authorizing the EC2 service principal to assume the role."
          },
          {
            "line": 17,
            "note": "Verifies whether a requesting AWS service principal matches the trusted entity specification."
          }
        ],
        "tryIt": "Update the trust policy to allow both 'ec2.amazonaws.com' and 'ecs-tasks.amazonaws.com' as trusted principals.",
        "check": {
          "question": "What is the primary architectural purpose of an IAM Role's Trust Policy?",
          "options": [
            "It lists the specific DynamoDB tables that the role is permitted to read",
            "It defines which principals (services, users, or accounts) are authorized to assume the role",
            "It configures the billing credit card for compute instances running the role"
          ],
          "answer": 1,
          "why": "The Trust Policy defines the trusted principals (such as the EC2 service) authorized to assume the IAM role."
        }
      },
      {
        "title": "IAM Evaluation Logic: Explicit Deny Precedence",
        "say": [
          "When an identity attempts to invoke an AWS API action, the IAM evaluation engine evaluates all applicable policies following a strict algorithm.",
          "The foundational baseline of the evaluation engine is the Default Deny.",
          "By default, all requests are implicitly denied unless an explicit allow exists.",
          "The engine first scans all applicable policies (Identity Policies, Resource Policies, SCPs, and Permission Boundaries) for any Explicit Deny.",
          "If even a single statement in any policy issues an explicit 'Deny' on the action and resource, the request is immediately rejected.",
          "An Explicit Deny overrules every other policy statement in existence; a hundred 'Allow' statements cannot override a single 'Deny'.",
          "If no explicit deny is found, the engine scans for an Explicit Allow.",
          "If at least one valid statement allows the action on the targeted resource, and all conditions are satisfied, the request is permitted.",
          "If no explicit allow is found, the request falls back to the Default Deny and is blocked.",
          "Understanding this deterministic evaluation hierarchy is critical for troubleshooting access denied errors in complex multi-account environments."
        ],
        "example": "A company building security rule stating that any employee with an active badge can enter the laboratory, except if an employee has been placed on the temporary safety quarantine list, which immediately blocks entry.",
        "code": "type EvaluationResult = 'ALLOWED' | 'DENIED';\n\ninterface PolicyCheckInput {\n  explicitDenyPresent: boolean;\n  explicitAllowPresent: boolean;\n}\n\nfunction evaluateIamRequest(input: PolicyCheckInput): EvaluationResult {\n  // Rule 1: Explicit Deny always overrules\n  if (input.explicitDenyPresent) return 'DENIED';\n  // Rule 2: Explicit Allow permits access\n  if (input.explicitAllowPresent) return 'ALLOWED';\n  // Rule 3: Default Deny\n  return 'DENIED';\n}\n\nconst req1 = evaluateIamRequest({ explicitDenyPresent: false, explicitAllowPresent: true });\nconst req2 = evaluateIamRequest({ explicitDenyPresent: true, explicitAllowPresent: true });\nconst req3 = evaluateIamRequest({ explicitDenyPresent: false, explicitAllowPresent: false });\n\nconsole.log(`Allow Only: ${req1} | Allow + Deny: ${req2} | No Policy (Default): ${req3}`);",
        "output": "Allow Only: ALLOWED | Allow + Deny: DENIED | No Policy (Default): DENIED",
        "codeNotes": [
          {
            "line": 8,
            "note": "Implements the core IAM evaluation logic algorithm: Explicit Deny -> Explicit Allow -> Default Deny."
          },
          {
            "line": 17,
            "note": "Demonstrates that an explicit deny statement unconditionally overrides an explicit allow statement."
          }
        ],
        "tryIt": "Simulate a Permission Boundary that fails to allow an action, causing the request to result in Default Deny.",
        "check": {
          "question": "If an IAM user has an identity policy that allows 's3:PutObject', but an SCP or group policy explicitly denies 's3:PutObject', what is the result?",
          "options": [
            "The request is ALLOWED because identity policies always take priority over group policies",
            "The request is DENIED because an explicit deny overrules all allow statements",
            "AWS averages the permissions and allows uploads up to 50% capacity"
          ],
          "answer": 1,
          "why": "In AWS IAM evaluation logic, an explicit Deny unconditionally overrides any number of Allow statements."
        }
      },
      {
        "title": "Credential Hardening: IAM Access Analyzer & Auditing",
        "say": [
          "Maintaining least-privilege security over time requires automated auditing and continuous monitoring of provisioned credentials.",
          "AWS CloudTrail automatically records every single API request executed in your account, capturing the caller identity, timestamp, IP address, and request parameters.",
          "Security teams ingest CloudTrail logs to detect unauthorized privilege escalation attempts and investigate anomalous access spikes.",
          "In addition, AWS provides IAM Access Analyzer, an automated reasoning tool that continuously scans resource policies across your account.",
          "Access Analyzer inspects S3 bucket policies, IAM role trust policies, KMS key policies, and SQS queue policies.",
          "It flags any policy statement that allows access to external AWS accounts or public internet users, preventing accidental data leaks.",
          "Furthermore, security administrators regularly generate the IAM Credential Report.",
          "The Credential Report audits every IAM user in the account, identifying access keys that have not been rotated in over ninety days or accounts lacking MFA.",
          "Enforcing continuous credential hygiene ensures that your organization's attack surface shrinks as infrastructure expands."
        ],
        "example": "A corporate building security auditor who reviews electronic door swipe logs weekly, immediately deactivating badges that have been inactive for over ninety days.",
        "code": "interface CredentialReportRow {\n  user: string;\n  mfaActive: boolean;\n  accessKey1AgeDays: number;\n  lastUsedDaysAgo: number;\n}\n\nconst report: CredentialReportRow[] = [\n  { user: 'deployer-bot', mfaActive: false, accessKey1AgeDays: 45, lastUsedDaysAgo: 1 },\n  { user: 'legacy-admin', mfaActive: false, accessKey1AgeDays: 240, lastUsedDaysAgo: 110 },\n  { user: 'sec-lead', mfaActive: true, accessKey1AgeDays: 30, lastUsedDaysAgo: 2 },\n];\n\nconst flaggedUsers = report.filter(u => u.accessKey1AgeDays > 90 || (!u.mfaActive && u.user.includes('admin')));\nconsole.log(`Audited ${report.length} users. Security Risk Flagged: ${flaggedUsers.map(u => u.user).join(', ')}`);",
        "output": "Audited 3 users. Security Risk Flagged: legacy-admin",
        "codeNotes": [
          {
            "line": 8,
            "note": "Models AWS IAM credential report entries tracking key age and MFA activation."
          },
          {
            "line": 14,
            "note": "Flags high-risk accounts violating the 90-day key rotation rule or lacking mandatory administrative MFA."
          }
        ],
        "tryIt": "Update legacy-admin to rotate their access key (age: 5 days) and enable MFA, then verify the audit passes.",
        "check": {
          "question": "What security compliance practice is recommended for AWS IAM access keys?",
          "options": [
            "Store access keys in public web client JavaScript files for easy access",
            "Regularly rotate access keys every 90 days and deactivate unused credentials",
            "Share a single set of access keys among all developers on the team"
          ],
          "answer": 1,
          "why": "Rotating keys every 90 days and deactivating dormant credentials significantly limits the blast radius of potential leaks."
        }
      }
    ],
    "summary": [
      "The AWS Root User possesses unrestricted administrative power and should be secured behind hardware MFA with zero access keys.",
      "IAM Roles provide temporary, automatically rotated STS credentials for compute instances via Instance Profiles, eliminating hardcoded keys.",
      "In IAM evaluation logic, an Explicit Deny unconditionally overrides all Allow statements, falling back to Default Deny if no Allow exists."
    ],
    "projectStep": {
      "title": "IAM Role & Least-Privilege Policy Configuration",
      "steps": [
        "Create an EC2 Instance Profile associated with an IAM Role trusting 'ec2.amazonaws.com'",
        "Author a least-privilege JSON permission policy granting S3 read access strictly to your application bucket ARN",
        "Enable IAM Access Analyzer and generate a credential report to verify zero root access keys exist"
      ]
    }
  },
  {
    "day": 7,
    "title": "EC2 Compute Classes, Spot Instances & Auto-Scaling Groups",
    "goal": "Select optimal EC2 instance classes, leverage Spot instances for cost reduction, and configure dynamic Auto Scaling Groups.",
    "minutes": 25,
    "recap": "Yesterday we locked down cloud permissions with IAM roles. Today we power our application workloads using Amazon EC2 compute classes, Spot pricing, and Auto Scaling Groups.",
    "parts": [
      {
        "title": "EC2 Instance Families and Workload Sizing",
        "say": [
          "Amazon Elastic Compute Cloud provides hundreds of distinct virtual server configurations organized into specialized Instance Families.",
          "Choosing the correct instance family ensures that your application achieves peak performance while avoiding over-provisioning costs.",
          "The General Purpose family, designated by the 'm' and 't' series (such as m7g or t4g), delivers a balanced ratio of compute, memory, and networking.",
          "General Purpose instances are ideal for standard web applications, small backend microservices, and development environments.",
          "The Compute Optimized family, designated by the 'c' series (such as c7g), features high-frequency processors with high compute-to-memory ratios.",
          "Compute Optimized instances excel at batch data processing, high-performance computing, distributed analytics, and media video encoding.",
          "The Memory Optimized family, designated by the 'r' and 'x' series, delivers vast RAM capacity per vCPU.",
          "Memory Optimized nodes power in-memory caching tiers like Redis, high-throughput message brokers, and large relational databases.",
          "Finally, instances featuring the 'g' suffix are powered by AWS Graviton ARM-based processors, delivering up to forty percent better price-performance over comparable x86 chips."
        ],
        "example": "A commercial transportation fleet selecting vehicles based on task: passenger sedans for office commuters (General Purpose), sports cars for rapid delivery (Compute Optimized), and large cargo trucks for heavy freight (Memory/Storage Optimized).",
        "code": "interface InstanceFamily {\n  prefix: string;\n  category: 'General' | 'Compute' | 'Memory' | 'Storage';\n  idealWorkload: string;\n  armAvailable: boolean;\n}\n\nconst families: InstanceFamily[] = [\n  { prefix: 'm7g', category: 'General', idealWorkload: 'Web applications & APIs', armAvailable: true },\n  { prefix: 'c7g', category: 'Compute', idealWorkload: 'Video encoding & batch jobs', armAvailable: true },\n  { prefix: 'r7g', category: 'Memory', idealWorkload: 'In-memory Redis caches & DBs', armAvailable: true },\n];\n\nfor (const fam of families) {\n  console.log(`[${fam.category}] ${fam.prefix}: ${fam.idealWorkload} (Graviton ARM: ${fam.armAvailable})`);\n}",
        "output": "[General] m7g: Web applications & APIs (Graviton ARM: true)\n[Compute] c7g: Video encoding & batch jobs (Graviton ARM: true)\n[Memory] r7g: In-memory Redis caches & DBs (Graviton ARM: true)",
        "codeNotes": [
          {
            "line": 8,
            "note": "Catalogues EC2 instance families categorized by workload characteristics and processor architecture."
          },
          {
            "line": 14,
            "note": "Displays sizing recommendations highlighting AWS Graviton ARM price-performance advantages."
          }
        ],
        "tryIt": "Add the storage-optimized 'i4i' family suited for high-IOPS NVMe transactional databases.",
        "check": {
          "question": "Which EC2 instance family is best suited for running an in-memory Redis cluster requiring massive RAM capacity?",
          "options": [
            "Compute Optimized (c7g series)",
            "Memory Optimized (r7g series)",
            "Burstable General Purpose (t4g.nano)"
          ],
          "answer": 1,
          "why": "The Memory Optimized (r series) family provides high RAM-to-vCPU ratios ideal for in-memory databases like Redis."
        }
      },
      {
        "title": "Burstable Performance and CPU Credits (T3/T4g Instances)",
        "say": [
          "Many web applications experience intermittent, bursty traffic patterns: idle for long stretches, punctuated by sudden spikes of user activity.",
          "Running high-end instances twenty-four hours a day for bursty workloads wastes significant cloud spend.",
          "Amazon EC2 Burstable Performance instances, specifically the T3 and T4g families, provide an ingenious economic solution.",
          "T-series instances deliver a guaranteed baseline CPU performance, such as twenty percent of a physical CPU core.",
          "Whenever your instance operates below its baseline threshold, it accumulates CPU Credits into a virtual credit balance.",
          "One CPU Credit equals one vCPU running at one hundred percent utilization for one full minute.",
          "When traffic surges, your instance automatically spends accumulated CPU credits to burst up to one hundred percent CPU utilization with zero throttling.",
          "Under standard mode, if an instance exhausts its credit balance, its CPU is capped at baseline until new credits accumulate.",
          "Under T-Unlimited mode, the instance can burst indefinitely beyond its credit balance, incurring a small additional hourly fee.",
          "T4g Graviton instances offer the best price-performance for bursty microservices, background queues, and staging environments."
        ],
        "example": "A mobile phone plan with rollover data: during quiet weekdays when you are on office Wi-Fi, unused megabytes accumulate in your balance so you can stream high-definition videos on the weekend.",
        "code": "class CpuCreditAccount {\n  balance: number = 0;\n  constructor(public baselinePct: number) {}\n\n  processInterval(currentCpuPct: number, durationMinutes: number) {\n    const delta = this.baselinePct - currentCpuPct;\n    const creditDelta = (delta / 100) * durationMinutes;\n    this.balance = Math.max(0, this.balance + creditDelta);\n  }\n}\n\nconst node = new CpuCreditAccount(20);\nnode.processInterval(5, 60); // 1 hour idle at 5% CPU\nconst accumulated = node.balance;\nnode.processInterval(80, 15); // 15 min burst at 80% CPU\nconsole.log(`Accumulated Credits: ${accumulated.toFixed(1)} | Balance After Burst: ${node.balance.toFixed(1)}`);",
        "output": "Accumulated Credits: 9.0 | Balance After Burst: 0.0",
        "codeNotes": [
          {
            "line": 5,
            "note": "Models the CPU credit accounting algorithm calculating credit gain when below baseline and spend during bursts."
          },
          {
            "line": 15,
            "note": "Simulates an hour of idle accumulation followed by a 15-minute high-load burst."
          }
        ],
        "tryIt": "Simulate a 30-minute burst at 100% CPU and observe whether the credit balance drops to zero.",
        "check": {
          "question": "What happens on a standard-mode T3 instance when its accumulated CPU credit balance is completely exhausted?",
          "options": [
            "The instance immediately crashes and terminates",
            "The instance CPU performance is throttled down to its configured baseline level",
            "AWS charges a hundred dollar penalty on the monthly invoice"
          ],
          "answer": 1,
          "why": "In standard mode, exhausting CPU credits throttles the instance back down to its baseline CPU performance limit."
        }
      },
      {
        "title": "Purchasing Options: On-Demand, Savings Plans, and Spot",
        "say": [
          "Amazon EC2 provides multiple pricing models that allow cloud architects to slash compute bills by up to ninety percent.",
          "The default purchasing model is On-Demand, which charges a fixed hourly or per-second rate for compute capacity.",
          "On-Demand offers absolute flexibility with zero upfront commitment; you can launch a server and terminate it five minutes later.",
          "However, On-Demand is also the most expensive way to purchase AWS compute.",
          "For steady-state workloads that run continuously, AWS offers Compute Savings Plans and Reserved Instances.",
          "By committing to a consistent dollar-per-hour compute spend for a one-year or three-year term, organizations receive discounts up to seventy-two percent.",
          "Savings Plans apply automatically across EC2, AWS Fargate, and AWS Lambda regardless of instance family, region, or operating system.",
          "Finally, AWS offers Spot Instances, which represent unused spare EC2 capacity available at discounts up to ninety percent off On-Demand rates.",
          "The critical tradeoff with Spot Instances is that AWS can reclaim the instance at any time with a two-minute warning when On-Demand capacity is needed.",
          "Spot Instances are ideal for stateless web tiers, batch data processing, machine learning training, and CI/CD testing runners."
        ],
        "example": "Booking hotel rooms: paying the standard walk-in rack rate (On-Demand), signing a multi-year corporate contract for guaranteed rooms (Savings Plans), or bidding on discount standby rooms that can be reassigned if a full-paying guest arrives (Spot).",
        "code": "interface PricingComparison {\n  model: 'On-Demand' | '1-Yr Savings Plan' | 'Spot';\n  hourlyRate: number;\n  annualCost: number;\n  savingsVsOnDemandPct: number;\n}\n\nconst onDemandRate = 0.10; // $0.10/hr\nconst models: PricingComparison[] = [\n  { model: 'On-Demand', hourlyRate: 0.10, annualCost: 0.10 * 8760, savingsVsOnDemandPct: 0 },\n  { model: '1-Yr Savings Plan', hourlyRate: 0.065, annualCost: 0.065 * 8760, savingsVsOnDemandPct: 35 },\n  { model: 'Spot', hourlyRate: 0.025, annualCost: 0.025 * 8760, savingsVsOnDemandPct: 75 },\n];\n\nfor (const m of models) {\n  console.log(`[${m.model}] Hourly: $${m.hourlyRate.toFixed(3)} -> Annual: $${Math.round(m.annualCost)} (Savings: ${m.savingsVsOnDemandPct}%)`);\n}",
        "output": "[On-Demand] Hourly: $0.100 -> Annual: $876 (Savings: 0%)\n[1-Yr Savings Plan] Hourly: $0.065 -> Annual: $569 (Savings: 35%)\n[Spot] Hourly: $0.025 -> Annual: $219 (Savings: 75%)",
        "codeNotes": [
          {
            "line": 8,
            "note": "Models annual compute cost across 8,760 hours comparing On-Demand against Savings Plans and Spot."
          },
          {
            "line": 15,
            "note": "Prints comparative savings demonstrating massive financial optimization through strategic purchasing options."
          }
        ],
        "tryIt": "Calculate total annual savings if an engineering fleet operates 50 instances on Spot instead of On-Demand.",
        "check": {
          "question": "What is the primary operational constraint when using Amazon EC2 Spot Instances?",
          "options": [
            "Spot instances cannot be connected to the internet",
            "AWS can reclaim and terminate Spot instances with a two-minute warning when capacity is needed",
            "Spot instances only run during weekends"
          ],
          "answer": 1,
          "why": "Spot instances offer up to 90% discounts but can be reclaimed by AWS with a 2-minute interruption notice."
        }
      },
      {
        "title": "Spot Fleet & Handling the 2-Minute Interruption Notice",
        "say": [
          "To utilize Spot Instances reliably in production, your applications must be engineered to handle sudden instance terminations gracefully.",
          "When AWS reclaims a Spot instance, it publishes an interruption notice two minutes before terminating the virtual machine.",
          "This notification is made available to the instance through the local EC2 Instance Metadata Service (IMDS) at http://169.254.169.254.",
          "Simultaneously, AWS emits a 'Spot Instance Interruption Warning' event into Amazon EventBridge.",
          "A production application runs a background daemon or EventBridge listener that intercepts this two-minute warning immediately.",
          "Upon receiving the warning, the node initiates graceful connection draining.",
          "It notifies the upstream Application Load Balancer to stop forwarding new incoming HTTP requests.",
          "It flushes in-memory transaction logs to an Amazon S3 bucket or DynamoDB database, and completes in-flight requests.",
          "Furthermore, deploying a Spot Fleet with diverse instance types (such as m5.large, m6g.large, and c5.large) minimizes interruption risk.",
          "Because AWS rarely experiences capacity crunches across multiple instance families simultaneously, Spot Fleets maintain high uptime."
        ],
        "example": "An airport standby passenger listening for the gate loudspeaker announcement: upon hearing the two-minute final boarding call, they quickly pack their laptop and vacate the seat without dropping any belongings.",
        "code": "interface SpotMetadataResponse {\n  action: 'stop' | 'terminate';\n  time: string;\n}\n\nfunction handleSpotInterruption(event: SpotMetadataResponse | null) {\n  if (!event) return { status: 'NORMAL', drainActive: false };\n  // Interruption received! Initiate 2-minute graceful drain\n  const terminationTime = new Date(event.time).getTime();\n  const secondsRemaining = Math.max(0, Math.round((terminationTime - Date.now()) / 1000));\n  return {\n    status: 'DRAINING',\n    action: event.action,\n    secondsRemaining: 120 // simulated 2-minute window\n  };\n}\n\nconst warning: SpotMetadataResponse = { action: 'terminate', time: new Date(Date.now() + 120000).toISOString() };\nconst drainPlan = handleSpotInterruption(warning);\nconsole.log(`Spot Interruption Handled: Status=${drainPlan.status}, Action=${drainPlan.action}, Window=${drainPlan.secondsRemaining}s`);",
        "output": "Spot Interruption Handled: Status=DRAINING, Action=terminate, Window=120s",
        "codeNotes": [
          {
            "line": 6,
            "note": "Evaluates the Spot interruption event to trigger automated application connection draining."
          },
          {
            "line": 18,
            "note": "Simulates interception of the two-minute warning window allowing graceful state persistence."
          }
        ],
        "tryIt": "Pass null to handleSpotInterruption and verify that normal application operation continues without draining.",
        "check": {
          "question": "How much advance notice does AWS provide before reclaiming an EC2 Spot Instance?",
          "options": [
            "Exactly 24 hours via email",
            "Exactly two minutes via instance metadata and EventBridge",
            "Zero notice; the instance is killed instantly"
          ],
          "answer": 1,
          "why": "AWS provides a 2-minute warning via IMDS and EventBridge, allowing applications to drain connections and save state."
        }
      },
      {
        "title": "Auto Scaling Groups (ASG) & Launch Templates",
        "say": [
          "Building resilient, elastic cloud systems requires abstracting individual servers into dynamic Auto Scaling Groups (ASGs).",
          "An Auto Scaling Group manages a collection of EC2 instances, automatically adding or removing capacity based on demand.",
          "An ASG is configured using two fundamental components: a Launch Template, and capacity boundaries.",
          "A Launch Template serves as the immutable recipe for creating new virtual machines.",
          "It defines the Amazon Machine Image (AMI) ID, instance type, IAM Instance Profile, security groups, EBS storage volumes, and user data bootstrap script.",
          "The Auto Scaling Group itself defines the operational scaling boundaries: Minimum capacity, Maximum capacity, and Desired capacity.",
          "If Desired capacity is set to four, the ASG continuously ensures that exactly four healthy instances are running across your subnets.",
          "If an instance crashes or fails an EC2 status check, the ASG terminates the defective node and automatically provisions a healthy replacement.",
          "Crucially, an ASG automatically balances instances across multiple Availability Zones, ensuring that an AZ outage never degrades service availability."
        ],
        "example": "A car rental company maintaining a fleet blueprint that specifies standard vehicle models, automatically buying new cars when the fleet drops below ten and selling extras when the fleet exceeds fifty.",
        "code": "interface AsgConfig {\n  name: string;\n  minSize: number;\n  maxSize: number;\n  desiredCapacity: number;\n  availabilityZones: string[];\n}\n\nfunction adjustCapacity(asg: AsgConfig, target: number): number {\n  // Constrain target within [minSize, maxSize]\n  const clamped = Math.max(asg.minSize, Math.min(asg.maxSize, target));\n  asg.desiredCapacity = clamped;\n  return asg.desiredCapacity;\n}\n\nconst prodAsg: AsgConfig = {\n  name: 'prod-api-asg',\n  minSize: 2,\n  maxSize: 10,\n  desiredCapacity: 4,\n  availabilityZones: ['us-east-1a', 'us-east-1b']\n};\n\nadjustCapacity(prodAsg, 15); // Exceeds max\nconst clampedMax = prodAsg.desiredCapacity;\nadjustCapacity(prodAsg, 6); // Valid target\nconsole.log(`ASG Clamped Target: ${clampedMax} (Max: ${prodAsg.maxSize}) | Adjusted Desired Capacity: ${prodAsg.desiredCapacity}`);",
        "output": "ASG Clamped Target: 10 (Max: 10) | Adjusted Desired Capacity: 6",
        "codeNotes": [
          {
            "line": 9,
            "note": "Clamps desired scaling capacity strictly within the configured minimum and maximum boundaries."
          },
          {
            "line": 24,
            "note": "Demonstrates capacity enforcement preventing runaway scaling costs or dangerous under-provisioning."
          }
        ],
        "tryIt": "Attempt to scale desired capacity down to 1 and observe how the minimum size boundary (2) protects availability.",
        "check": {
          "question": "If an EC2 instance in an Auto Scaling Group fails its health checks and terminates, what action does the ASG take?",
          "options": [
            "It permanently deletes the Auto Scaling Group and alerts the billing department",
            "It automatically launches a new healthy replacement instance to restore desired capacity",
            "It leaves the group running at degraded capacity until a human engineer logs in"
          ],
          "answer": 1,
          "why": "An ASG automatically replaces unhealthy instances to maintain the configured desired capacity."
        }
      },
      {
        "title": "Scaling Policies: Target Tracking, Step, and Predictive",
        "say": [
          "While manual scaling adjusts capacity statically, production Auto Scaling Groups rely on dynamic Scaling Policies.",
          "AWS provides three major types of dynamic scaling policies: Target Tracking, Step Scaling, and Predictive Scaling.",
          "Target Tracking Scaling is the modern industry standard and operates like a home thermostat.",
          "You specify a target metric, such as 'maintain average ASG CPU utilization at 60 percent' or 'maintain 1000 requests per target'.",
          "AWS automatically calculates the required instance count and scales the group up or down to keep the metric near your target.",
          "Step Scaling allows granular multi-tier thresholds, such as adding two instances if CPU breaches 70 percent, and adding five instances if CPU breaches 85 percent.",
          "Predictive Scaling uses machine learning models trained on your application's historical CloudWatch traffic data.",
          "It forecasts daily or weekly traffic cycles and pre-warms additional instances fifteen minutes before the traffic surge arrives.",
          "Finally, Scale-In Protection prevents the ASG from terminating long-running batch workers during downscaling operations.",
          "Combining Target Tracking with Predictive Scaling ensures seamless performance during viral traffic surges while aggressively minimizing cloud spend."
        ],
        "example": "A commercial air conditioning system with a smart thermostat that automatically ramps up cooling power as the afternoon heat rises, maintaining a steady room temperature of 72 degrees.",
        "code": "function calculateTargetTrackingCapacity(currentInstances: number, currentMetricValue: number, targetValue: number): number {\n  // New Capacity = Current Capacity * (Current Metric / Target Metric)\n  const ratio = currentMetricValue / targetValue;\n  return Math.ceil(currentInstances * ratio);\n}\n\nconst currentNodes = 4;\nconst targetCpuPct = 60;\nconst spikeNodes = calculateTargetTrackingCapacity(currentNodes, 85, targetCpuPct);\nconst quietNodes = calculateTargetTrackingCapacity(currentNodes, 30, targetCpuPct);\n\nconsole.log(`Baseline: ${currentNodes} nodes | Spike (85% CPU): Scale to ${spikeNodes} nodes | Quiet (30% CPU): Scale to ${quietNodes} nodes`);",
        "output": "Baseline: 4 nodes | Spike (85% CPU): Scale to 6 nodes | Quiet (30% CPU): Scale to 2 nodes",
        "codeNotes": [
          {
            "line": 2,
            "note": "Applies the AWS Target Tracking formula: instances scaled proportionally to metric ratio."
          },
          {
            "line": 11,
            "note": "Demonstrates automated dynamic elasticity: adding nodes during traffic surges and pruning during lulls."
          }
        ],
        "tryIt": "Simulate a massive 95% CPU spike and calculate the required instance fleet expansion.",
        "check": {
          "question": "How does an Auto Scaling Group Target Tracking policy decide when and how much to scale?",
          "options": [
            "It scales randomly based on a random number generator",
            "It continuously adjusts instance count to keep a specified metric (like average CPU) near a target threshold",
            "It requires an administrator to approve every scaling event via Slack"
          ],
          "answer": 1,
          "why": "Target Tracking continuously monitors metrics and automatically adjusts capacity to hold the metric near your specified target."
        }
      }
    ],
    "summary": [
      "EC2 instance families provide specialized hardware optimizations: General (m/t), Compute (c), and Memory (r), with Graviton ARM offering 40% price-performance gains.",
      "Spot Instances offer up to 90% savings for fault-tolerant workloads, requiring graceful handling of the 2-minute interruption notice.",
      "Auto Scaling Groups combine Launch Templates with Target Tracking policies to dynamically balance capacity across multiple Availability Zones."
    ],
    "projectStep": {
      "title": "Auto Scaling Fleet & Launch Template Provisioning",
      "steps": [
        "Create an EC2 Launch Template specifying Graviton ARM instances, custom AMI, and attached IAM Instance Profile",
        "Deploy an Auto Scaling Group spanning two private application subnets with min: 2, desired: 2, max: 10",
        "Attach a Target Tracking Scaling Policy maintaining 60% average CPU utilization across the fleet"
      ]
    }
  },
  {
    "day": 8,
    "title": "Application Load Balancer (ALB), Target Groups & Health Probes",
    "goal": "Deploy Application Load Balancers, configure Target Groups, and establish active health check probes.",
    "minutes": 25,
    "recap": "Yesterday we configured Auto Scaling Groups. Today we distribute client traffic seamlessly across those compute instances using the AWS Application Load Balancer.",
    "parts": [
      {
        "title": "Load Balancing Layer 7 (ALB) vs Layer 4 (NLB)",
        "say": [
          "Elastic Load Balancing distributes incoming application traffic across multiple targets to ensure fault tolerance and horizontal scale.",
          "AWS provides two primary modern load balancer types: the Application Load Balancer (ALB), and the Network Load Balancer (NLB).",
          "An Application Load Balancer operates at Layer 7 of the Open Systems Interconnection (OSI) model: the Application Layer.",
          "Operating at Layer 7 means the ALB inspects HTTP and HTTPS packet payloads, including request paths, host headers, HTTP cookies, and query strings.",
          "ALBs support advanced features like routing requests based on URL paths (e.g. /api vs /static), WebSocket streaming, and native HTTP/2.",
          "In contrast, the Network Load Balancer operates at Layer 4: the Transport Layer.",
          "NLBs inspect only raw TCP, UDP, and TLS connections without decoding application payloads.",
          "Operating at Layer 4 allows NLBs to handle tens of millions of requests per second with ultra-low, sub-millisecond latencies.",
          "NLBs also provide static Anycast IP addresses and can attach directly to Elastic IPs.",
          "For standard REST APIs, microservices, and web applications, the Application Load Balancer is the optimal, feature-rich choice."
        ],
        "example": "A hotel concierge reading the department name written on an envelope to hand-deliver it to the executive kitchen (Layer 7) versus a rapid automated conveyor belt sorting sealed metal cargo boxes purely by barcoded tracking number (Layer 4).",
        "code": "type OsiLayer = 4 | 7;\n\ninterface LoadBalancerType {\n  name: string;\n  layer: OsiLayer;\n  protocols: string[];\n  latencyClass: 'Sub-millisecond' | 'Single-digit millisecond';\n  routingFeatures: string[];\n}\n\nconst lbs: LoadBalancerType[] = [\n  { name: 'Application Load Balancer (ALB)', layer: 7, protocols: ['HTTP', 'HTTPS', 'gRPC'], latencyClass: 'Single-digit millisecond', routingFeatures: ['Path routing', 'Host routing', 'OIDC Auth'] },\n  { name: 'Network Load Balancer (NLB)', layer: 4, protocols: ['TCP', 'UDP', 'TLS'], latencyClass: 'Sub-millisecond', routingFeatures: ['Static IP', 'Ultra-low latency', 'PrivateLink'] },\n];\n\nfor (const lb of lbs) {\n  console.log(`[${lb.name}] Layer ${lb.layer} -> Protocols: ${lb.protocols.join(', ')} (${lb.latencyClass})`);\n}",
        "output": "[Application Load Balancer (ALB)] Layer 7 -> Protocols: HTTP, HTTPS, gRPC (Single-digit millisecond)\n[Network Load Balancer (NLB)] Layer 4 -> Protocols: TCP, UDP, TLS (Sub-millisecond)",
        "codeNotes": [
          {
            "line": 9,
            "note": "Defines the architectural differences between Layer 7 ALBs and Layer 4 NLBs."
          },
          {
            "line": 15,
            "note": "Displays protocols and operational latency profiles for each load balancer family."
          }
        ],
        "tryIt": "Add gRPC routing support to ALB features and observe how it enhances microservice communication.",
        "check": {
          "question": "Which AWS load balancer should you choose if you need to route traffic based on HTTP URL path (/api/v1 vs /images)?",
          "options": [
            "Network Load Balancer (NLB)",
            "Application Load Balancer (ALB)",
            "Classic Load Balancer (deprecated)"
          ],
          "answer": 1,
          "why": "Application Load Balancers operate at Layer 7 and can inspect HTTP request paths, headers, and cookies to route traffic."
        }
      },
      {
        "title": "Target Groups and Routing Algorithms",
        "say": [
          "An Application Load Balancer routes client requests to logical collections of backend compute nodes called Target Groups.",
          "Targets registered inside a Target Group can be EC2 instance IDs, private IPv4 addresses, or AWS Lambda serverless functions.",
          "Target Groups allow you to decouple backend compute implementations from external routing endpoints.",
          "When distributing incoming requests, ALBs support two primary load balancing algorithms.",
          "The default algorithm is Round Robin, which distributes incoming requests sequentially and evenly across all healthy registered targets.",
          "Round Robin works well when all requests require roughly identical processing time.",
          "However, if some requests are lightweight while others involve heavy database queries, Round Robin can overload certain instances.",
          "To solve this, ALBs support the Least Outstanding Requests algorithm.",
          "With Least Outstanding Requests, the load balancer inspects the number of currently active, in-flight HTTP transactions on each node.",
          "Incoming requests are routed to the instance currently handling the fewest concurrent requests, preventing hot-spotting."
        ],
        "example": "A busy bank branch where a queue coordinator directs the next customer to the specific teller window with the fewest people waiting in line, rather than cycling mechanically across windows.",
        "code": "interface TargetNode {\n  targetId: string;\n  activeRequests: number;\n}\n\nfunction selectLeastOutstandingTarget(targets: TargetNode[]): string {\n  // Find target with minimum active in-flight requests\n  const sorted = [...targets].sort((a, b) => a.activeRequests - b.activeRequests);\n  return sorted[0].targetId;\n}\n\nconst nodes: TargetNode[] = [\n  { targetId: 'i-app-01', activeRequests: 14 },\n  { targetId: 'i-app-02', activeRequests: 3 },\n  { targetId: 'i-app-03', activeRequests: 8 },\n];\n\nconst selected = selectLeastOutstandingTarget(nodes);\nconsole.log(`Least Outstanding Target Selected: ${selected} (Active Requests: ${nodes.find(n => n.targetId === selected)?.activeRequests})`);",
        "output": "Least Outstanding Target Selected: i-app-02 (Active Requests: 3)",
        "codeNotes": [
          {
            "line": 6,
            "note": "Implements the Least Outstanding Requests routing algorithm by sorting nodes by concurrent request count."
          },
          {
            "line": 17,
            "note": "Demonstrates that the least busy node (i-app-02 with 3 requests) is selected for the next incoming request."
          }
        ],
        "tryIt": "Update node 2 active requests to 20 and verify that node 3 becomes the newly selected target.",
        "check": {
          "question": "When is the Least Outstanding Requests routing algorithm superior to standard Round Robin?",
          "options": [
            "When all compute instances run identical clock speeds",
            "When incoming requests vary significantly in processing duration and complexity",
            "When the load balancer is operating without an internet connection"
          ],
          "answer": 1,
          "why": "Least Outstanding Requests prevents overloading when requests have varied processing times by routing to the least busy node."
        }
      },
      {
        "title": "Active Health Checks and Unhealthy Host Deregistration",
        "say": [
          "To prevent routing traffic to dead or malfunctioning servers, an Application Load Balancer conducts continuous Active Health Checks.",
          "The ALB periodically sends an HTTP GET request to a configured endpoint on each registered target, such as '/healthz' or '/api/health'.",
          "Your backend application must evaluate its internal health (such as database connectivity) and return an HTTP 200 OK status code.",
          "Health check behavior is governed by four critical configuration parameters.",
          "HealthCheckIntervalSeconds defines how frequently the ALB probes each instance, with thirty seconds being the standard default.",
          "HealthCheckTimeoutSeconds defines how long the ALB waits for a response before counting the probe as a failure.",
          "UnhealthyThresholdCount specifies how many consecutive failed probes must occur before the ALB marks an instance as 'unhealthy'.",
          "HealthyThresholdCount specifies how many consecutive successful probes are required to restore an instance to 'healthy' status.",
          "As soon as an instance is marked unhealthy, the ALB immediately stops routing new user traffic to it, shielding users from application errors.",
          "If the instance is managed by an Auto Scaling Group, the ASG detects the unhealthy status and automatically provisions a healthy replacement."
        ],
        "example": "A restaurant manager performing a quick check on kitchen prep stations every ten minutes; if a line cook fails to respond twice in a row, orders are redirected to another prep line immediately.",
        "code": "class HealthCheckStateMachine {\n  consecutiveSuccesses: number = 0;\n  consecutiveFailures: number = 0;\n  status: 'HEALTHY' | 'UNHEALTHY' = 'HEALTHY';\n\n  constructor(public healthyThreshold: number = 2, public unhealthyThreshold: number = 3) {}\n\n  recordProbe(statusCode: number) {\n    if (statusCode >= 200 && statusCode < 300) {\n      this.consecutiveSuccesses++;\n      this.consecutiveFailures = 0;\n      if (this.consecutiveSuccesses >= this.healthyThreshold) this.status = 'HEALTHY';\n    } else {\n      this.consecutiveFailures++;\n      this.consecutiveSuccesses = 0;\n      if (this.consecutiveFailures >= this.unhealthyThreshold) this.status = 'UNHEALTHY';\n    }\n  }\n}\n\nconst probe = new HealthCheckStateMachine(2, 3);\nprobe.recordProbe(500);\nprobe.recordProbe(500);\nconst interimStatus = probe.status;\nprobe.recordProbe(500); // 3rd failure\nconsole.log(`After 2 Failures: ${interimStatus} | After 3rd Failure: ${probe.status}`);",
        "output": "After 2 Failures: HEALTHY | After 3rd Failure: UNHEALTHY",
        "codeNotes": [
          {
            "line": 6,
            "note": "Models the active health check state machine tracking consecutive successes and failures against thresholds."
          },
          {
            "line": 24,
            "note": "Demonstrates that 3 consecutive HTTP 500 errors transition the instance status from HEALTHY to UNHEALTHY."
          }
        ],
        "tryIt": "Send two consecutive HTTP 200 OK probes to verify that the instance transitions back to HEALTHY.",
        "check": {
          "question": "What happens when an EC2 instance in a Target Group fails its configured UnhealthyThresholdCount number of health checks?",
          "options": [
            "The ALB immediately halts and reboots the load balancer hardware",
            "The ALB stops sending new client requests to the unhealthy instance",
            "AWS charges double the price for incoming HTTP requests"
          ],
          "answer": 1,
          "why": "The load balancer stops routing new requests to instances marked unhealthy, directing traffic only to healthy targets."
        }
      },
      {
        "title": "Connection Draining (Deregistration Delay)",
        "say": [
          "When an instance is being decommissioned by an Auto Scaling Group or undergoing rolling updates, it must be removed from the Target Group.",
          "If the load balancer were to instantly sever connections, users currently uploading files or submitting payments would receive broken TCP errors.",
          "To ensure zero downtime deployments, ALBs implement Connection Draining, officially called Deregistration Delay.",
          "When an instance is deregistered, the ALB transitions its state to 'draining'.",
          "In the draining state, the ALB immediately ceases forwarding any new incoming HTTP requests to that instance.",
          "However, the ALB allows all existing, in-flight HTTP connections to complete normally.",
          "The Deregistration Delay timer defines the maximum duration the ALB will wait for in-flight requests to finish, with a default of 300 seconds.",
          "For fast REST APIs, reducing this delay to 30 or 60 seconds accelerates CI/CD deployment pipelines.",
          "Once all active connections have completed or the timeout expires, the instance is fully deregistered and can be safely terminated.",
          "Connection draining guarantees graceful, error-free rolling deployments."
        ],
        "example": "A restaurant host who stops seating new guests at 9:30 PM, but allows all patrons currently seated at tables to finish their dinners and coffee peacefully before locking the doors at 10:00 PM.",
        "code": "interface DrainingNode {\n  targetId: string;\n  state: 'active' | 'draining' | 'deregistered';\n  inFlightRequests: number;\n}\n\nfunction processDrainingTick(node: DrainingNode, secondsElapsed: number, maxDelay: number) {\n  if (node.state !== 'draining') return node.state;\n  // Simulate requests finishing over time\n  node.inFlightRequests = Math.max(0, node.inFlightRequests - 5);\n  if (node.inFlightRequests === 0 || secondsElapsed >= maxDelay) {\n    node.state = 'deregistered';\n  }\n  return node.state;\n}\n\nconst worker: DrainingNode = { targetId: 'i-old-ver-88', state: 'draining', inFlightRequests: 8 };\nprocessDrainingTick(worker, 10, 300);\nconst tick1 = { ...worker };\nprocessDrainingTick(worker, 20, 300);\nconsole.log(`Tick 1: In-Flight=${tick1.inFlightRequests}, State=${tick1.state} | Tick 2: In-Flight=${worker.inFlightRequests}, State=${worker.state}`);",
        "output": "Tick 1: In-Flight=3, State=draining | Tick 2: In-Flight=0, State=deregistered",
        "codeNotes": [
          {
            "line": 7,
            "note": "Models connection draining logic: reducing in-flight requests while blocking new ingress."
          },
          {
            "line": 21,
            "note": "Demonstrates node transitioning to 'deregistered' once all in-flight connections finish gracefully."
          }
        ],
        "tryIt": "Simulate an in-flight request count of 50 and observe the node remaining in draining state until completion.",
        "check": {
          "question": "What is the primary architectural purpose of ALB Deregistration Delay (Connection Draining)?",
          "options": [
            "To flush cached DNS records from client browsers",
            "To allow in-flight HTTP requests to complete gracefully before terminating an instance, preventing client errors",
            "To cool down the physical CPU chips before powering down the server"
          ],
          "answer": 1,
          "why": "Deregistration delay lets existing in-flight connections finish gracefully without error before the target is detached."
        }
      },
      {
        "title": "Content-Based Routing: Host, Path, and Header Rules",
        "say": [
          "One of the greatest architectural strengths of the Application Load Balancer is Content-Based Routing.",
          "In traditional setups, each microservice required its own dedicated load balancer, multiplying operational costs.",
          "An ALB allows dozens of independent microservices to share a single load balancer and public IP address.",
          "ALB Listener Rules evaluate incoming requests using priority-ordered conditional rules.",
          "The most common routing strategy is Path-Based Routing.",
          "You can configure a rule sending traffic matching '/api/orders/*' to an Orders Target Group, and traffic matching '/api/users/*' to a Users Target Group.",
          "ALBs also support Host-Based Routing, inspecting the HTTP Host header to route 'api.company.com' differently from 'app.company.com'.",
          "Furthermore, rules can inspect HTTP request headers, query string parameters, and client source CIDR blocks.",
          "ALBs can also execute automated actions directly at the edge without hitting backend instances, such as redirecting HTTP port 80 to HTTPS 443.",
          "Consolidating microservice routing into a single ALB simplifies architecture and significantly lowers cloud infrastructure spend."
        ],
        "example": "A major airport terminal with electronic signage directing passengers to Flight 100 on Concourse A, Flight 200 on Concourse B, and international arrivals directly to Customs.",
        "code": "interface ListenerRule {\n  priority: number;\n  condition: { pathPattern?: string; hostHeader?: string };\n  targetGroup: string;\n}\n\nconst albRules: ListenerRule[] = [\n  { priority: 10, condition: { pathPattern: '/api/v1/orders*' }, targetGroup: 'tg-orders-service' },\n  { priority: 20, condition: { pathPattern: '/api/v1/users*' }, targetGroup: 'tg-users-service' },\n  { priority: 999, condition: {}, targetGroup: 'tg-frontend-web' }, // default fallback\n];\n\nfunction routeIncomingRequest(path: string): string {\n  const sorted = [...albRules].sort((a, b) => a.priority - b.priority);\n  for (const r of sorted) {\n    if (!r.condition.pathPattern || path.startsWith(r.condition.pathPattern.replace('*', ''))) {\n      return r.targetGroup;\n    }\n  }\n  return 'tg-frontend-web';\n}\n\nconsole.log(`/api/v1/orders/99 -> ${routeIncomingRequest('/api/v1/orders/99')} | /dashboard -> ${routeIncomingRequest('/dashboard')}`);",
        "output": "/api/v1/orders/99 -> tg-orders-service | /dashboard -> tg-frontend-web",
        "codeNotes": [
          {
            "line": 7,
            "note": "Defines prioritized ALB listener rules mapping URL path patterns to targeted microservice groups."
          },
          {
            "line": 22,
            "note": "Demonstrates content-based routing resolving specific APIs to dedicated backend target groups."
          }
        ],
        "tryIt": "Add a host header condition routing 'admin.company.com' to an admin target group with priority 5.",
        "check": {
          "question": "How does ALB Path-Based Routing benefit microservice architectures?",
          "options": [
            "It allows multiple distinct microservices to share a single load balancer by routing requests based on URL path",
            "It automatically writes SQL queries on behalf of the microservices",
            "It eliminates the need for containerization or Docker"
          ],
          "answer": 0,
          "why": "Path-based routing routes requests based on URL paths, allowing dozens of microservices to share a single ALB."
        }
      },
      {
        "title": "Cross-Zone Load Balancing & TLS Termination",
        "say": [
          "To complete our mastery of Application Load Balancers, we explore two critical enterprise features: Cross-Zone Load Balancing and TLS Termination.",
          "In a multi-AZ deployment, clients connect to load balancer nodes distributed across multiple Availability Zones.",
          "Without Cross-Zone Load Balancing, each ALB node only distributes traffic among the targets residing in its own local Availability Zone.",
          "If Zone A has two instances and Zone B has eight instances, instances in Zone A will receive four times more traffic per server than instances in Zone B.",
          "With Cross-Zone Load Balancing enabled, every load balancer node distributes traffic evenly across all targets across all enabled Availability Zones.",
          "On Application Load Balancers, Cross-Zone Load Balancing is enabled by default with zero additional data transfer fees.",
          "In addition, ALBs provide native TLS/SSL Termination.",
          "Rather than burdening backend EC2 instances with computing intensive cryptographic handshakes, TLS certificates are bound directly to the ALB listener.",
          "Using AWS Certificate Manager (ACM), you can provision free, auto-renewing SSL/TLS certificates.",
          "The ALB decrypts HTTPS traffic at the edge and passes plaintext HTTP traffic to backend instances inside private subnets, maximizing compute efficiency."
        ],
        "example": "An international summit where professional translators at the entrance translate all foreign incoming speeches into English, allowing the conference delegates inside to focus entirely on policy discussions.",
        "code": "interface TargetDistribution {\n  az: string;\n  targetCount: number;\n}\n\nfunction calculateCrossZoneTraffic(zones: TargetDistribution[], totalRequests: number) {\n  const totalTargets = zones.reduce((sum, z) => sum + z.targetCount, 0);\n  const requestsPerTarget = Math.round(totalRequests / totalTargets);\n  return { totalTargets, requestsPerTarget };\n}\n\nconst deployment: TargetDistribution[] = [\n  { az: 'us-east-1a', targetCount: 2 },\n  { az: 'us-east-1b', targetCount: 6 },\n];\n\nconst traffic = calculateCrossZoneTraffic(deployment, 8000);\nconsole.log(`Total Targets: ${traffic.totalTargets} across ${deployment.length} AZs -> Balanced Load: ${traffic.requestsPerTarget} req/target`);",
        "output": "Total Targets: 8 across 2 AZs -> Balanced Load: 1000 req/target",
        "codeNotes": [
          {
            "line": 6,
            "note": "Calculates uniform traffic distribution across targets regardless of asymmetric AZ instance counts."
          },
          {
            "line": 16,
            "note": "Shows that cross-zone load balancing distributes exactly 1,000 requests to every target evenly."
          }
        ],
        "tryIt": "Add a third Availability Zone with 4 instances and verify that requests per target re-balances uniformly.",
        "check": {
          "question": "What is the primary benefit of terminating TLS/SSL certificates at the Application Load Balancer?",
          "options": [
            "It offloads expensive cryptographic processing from backend instances and centralizes certificate renewal via ACM",
            "It makes web applications visible to search engines faster",
            "It converts all relational database data to plain text"
          ],
          "answer": 0,
          "why": "ALB TLS termination offloads CPU-heavy decryption from backend servers and automates certificate management via ACM."
        }
      }
    ],
    "summary": [
      "Application Load Balancers operate at Layer 7, providing path/host routing, WebSocket streaming, and native ACM TLS termination.",
      "Target Groups support Round Robin and Least Outstanding Requests algorithms, with active health checks isolating unhealthy hosts.",
      "Connection Draining (Deregistration Delay) ensures in-flight requests finish gracefully before instance termination, preventing client 502 errors."
    ],
    "projectStep": {
      "title": "ALB, Target Group & Path Routing Provisioning",
      "steps": [
        "Deploy an internet-facing Application Load Balancer spanning two public subnets with an ACM TLS certificate",
        "Create an App Target Group with active health checks probing '/healthz' every 15 seconds",
        "Configure ALB Listener Rules routing '/api/*' to the App Target Group with a 30-second Deregistration Delay"
      ]
    }
  },
  {
    "day": 9,
    "title": "Amazon S3 Object Storage & Lifecycle Management Tiering",
    "goal": "Master Amazon S3 object storage primitives, implement storage classes, and configure automated lifecycle transition policies.",
    "minutes": 25,
    "recap": "Yesterday we balanced web traffic with ALBs. Today we store unstructured data at global scale using the bedrock of AWS storage: Amazon Simple Storage Service (S3).",
    "parts": [
      {
        "title": "S3 Foundations: Buckets, Keys, and Object Immutability",
        "say": [
          "Amazon Simple Storage Service, or Amazon S3, is an industry-defining object storage service engineered for 99.999999999 percent (eleven 9s) of data durability.",
          "Unlike traditional block storage (EBS) or file storage (EFS), S3 stores data as discrete Objects inside flat containers called Buckets.",
          "Every S3 bucket name must be globally unique across all AWS customers worldwide, much like a public domain name.",
          "An object in S3 consists of data, a unique Key string, and Metadata.",
          "The Key is the full path identifier of the object, such as 'images/2026/avatar.png'.",
          "Although graphical consoles display folders, S3 possesses no true directory tree; it is a completely flat key-value store where slashes are simply delimiter characters.",
          "S3 objects are strictly immutable: you cannot edit a single byte inside an existing S3 object.",
          "To modify a file, you upload a replacement object, which atomically overwrites the old version or creates a new version if Versioning is enabled.",
          "Every S3 object can store up to 5 terabytes of data, with single HTTP PUT uploads supporting up to 5 gigabytes per request.",
          "S3 provides strong read-after-write consistency for all HTTP PUT and DELETE operations across all AWS regions."
        ],
        "example": "A massive digital warehouse where every item is sealed in a numbered container with an exterior barcode tag; you cannot open the container to adjust the item, but you can replace the entire container with a new one.",
        "code": "interface S3ObjectMetadata {\n  bucket: string;\n  key: string;\n  sizeBytes: number;\n  contentType: string;\n  etag: string;\n}\n\nfunction parseS3Uri(s3Uri: string): { bucket: string; key: string } {\n  const match = s3Uri.match(/^s3:\\/\\/([^\\/]+)\\/(.+)$/);\n  if (!match) throw new Error('Invalid S3 URI');\n  return { bucket: match[1], key: match[2] };\n}\n\nconst parsed = parseS3Uri('s3://prod-media-vault/uploads/avatars/user_99.png');\nconsole.log(`Parsed S3 URI -> Bucket: ${parsed.bucket} | Object Key: ${parsed.key}`);",
        "output": "Parsed S3 URI -> Bucket: prod-media-vault | Object Key: uploads/avatars/user_99.png",
        "codeNotes": [
          {
            "line": 9,
            "note": "Parses standard S3 protocol URIs into canonical bucket name and flat object key identifiers."
          },
          {
            "line": 15,
            "note": "Demonstrates that simulated folder structures are actually single flat string keys in S3."
          }
        ],
        "tryIt": "Parse an S3 URI pointing to a deep document path like 's3://legal-docs/2026/q1/contracts/master.pdf'.",
        "check": {
          "question": "Can an application open an existing Amazon S3 object and modify a single byte in the middle of the file?",
          "options": [
            "Yes, S3 functions like a standard Linux ext4 file system supporting in-place byte editing",
            "No, S3 objects are immutable; updating an object requires uploading a complete replacement file",
            "Yes, but only if the file size is under one megabyte"
          ],
          "answer": 1,
          "why": "S3 objects are strictly immutable; modifying data requires uploading a complete new version of the object."
        }
      },
      {
        "title": "S3 Storage Classes: Standard, Intelligent-Tiering, and Glacier",
        "say": [
          "Not all data requires the same performance characteristics or storage economics.",
          "To optimize costs across varying access patterns, Amazon S3 provides specialized Storage Classes.",
          "S3 Standard is the default storage class, engineered for frequently accessed data requiring high throughput and low-latency millisecond access.",
          "S3 Standard replicates data across at least three physical Availability Zones, delivering 99.99 percent availability and eleven 9s of durability.",
          "S3 Standard-Infrequent Access (S3 Standard-IA) is designed for data accessed less than once a month, such as older backups or completed project files.",
          "S3 Standard-IA features a lower storage cost per gigabyte than Standard, but charges a small retrieval fee per gigabyte read.",
          "For archival workloads, S3 provides the Amazon Glacier family.",
          "S3 Glacier Flexible Archive offers low-cost cold storage with retrieval times ranging from minutes to hours.",
          "S3 Glacier Deep Archive represents the lowest-cost cloud storage in the world, storing data for less than a dollar per terabyte per month.",
          "Retrievals from Glacier Deep Archive take up to twelve hours, making it ideal for regulatory tax records and compliance archives."
        ],
        "example": "Organizing personal possessions: keeping daily clothes in bedroom closets (Standard), seasonal ski gear in the garage (Infrequent Access), and childhood memory albums in a distant rented storage locker (Glacier).",
        "code": "interface S3ClassEconomics {\n  storageClass: string;\n  costPerGbMonth: number;\n  retrievalFeePerGb: number;\n  retrievalSpeed: string;\n}\n\nconst tierPricing: S3ClassEconomics[] = [\n  { storageClass: 'S3 Standard', costPerGbMonth: 0.023, retrievalFeePerGb: 0, retrievalSpeed: 'Milliseconds' },\n  { storageClass: 'S3 Standard-IA', costPerGbMonth: 0.0125, retrievalFeePerGb: 0.01, retrievalSpeed: 'Milliseconds' },\n  { storageClass: 'S3 Glacier Deep Archive', costPerGbMonth: 0.00099, retrievalFeePerGb: 0.02, retrievalSpeed: 'Hours (12h)' },\n];\n\nfunction calculateMonthlyCost(sizeGb: number, readsGb: number, tier: S3ClassEconomics) {\n  return (sizeGb * tier.costPerGbMonth) + (readsGb * tier.retrievalFeePerGb);\n}\n\nconst standardCost = calculateMonthlyCost(10000, 1000, tierPricing[0]);\nconst deepArchiveCost = calculateMonthlyCost(10000, 0, tierPricing[2]);\nconsole.log(`10TB Standard (Active): $${standardCost.toFixed(2)}/mo | 10TB Deep Archive (Cold): $${deepArchiveCost.toFixed(2)}/mo`);",
        "output": "10TB Standard (Active): $230.00/mo | 10TB Deep Archive (Cold): $9.90/mo",
        "codeNotes": [
          {
            "line": 8,
            "note": "Defines storage economics comparing S3 Standard against Infrequent Access and Glacier Deep Archive."
          },
          {
            "line": 20,
            "note": "Contrasts monthly costs for 10TB of data, demonstrating massive 95%+ savings for archival tiers."
          }
        ],
        "tryIt": "Calculate monthly cost for S3 Standard-IA storing 10,000 GB with 500 GB retrieved.",
        "check": {
          "question": "Which Amazon S3 storage class offers the lowest storage cost per gigabyte for regulatory compliance archives?",
          "options": [
            "S3 Standard",
            "S3 Glacier Deep Archive",
            "S3 One Zone-IA"
          ],
          "answer": 1,
          "why": "S3 Glacier Deep Archive provides the lowest storage cost in the cloud (~$0.00099/GB/month) for long-term cold archives."
        }
      },
      {
        "title": "S3 Intelligent-Tiering: Automatic Cost Optimization",
        "say": [
          "In real-world applications, predicting exact data access patterns in advance is extremely difficult.",
          "Some files uploaded today are never read again, while a video uploaded six months ago might suddenly go viral.",
          "If you manually move data to Infrequent Access, unexpected reads incur heavy retrieval fees.",
          "To automate cost savings with zero operational risk, AWS created S3 Intelligent-Tiering.",
          "S3 Intelligent-Tiering is the only cloud storage class that automatically delivers cost savings without operational overhead or retrieval fees.",
          "It continuously monitors access patterns at the object level and dynamically moves data between access tiers.",
          "Objects begin in the Frequent Access Tier.",
          "If an object is not accessed for 30 consecutive days, S3 automatically moves it to the Infrequent Access Tier, saving 40 percent on storage.",
          "If untouched for 90 days, it moves to the Archive Instant Access Tier, saving 68 percent on storage.",
          "Crucially, as soon as an archived object is accessed, S3 immediately moves it back to the Frequent Access Tier with zero retrieval penalties.",
          "S3 Intelligent-Tiering is the ideal default choice for data lakes, analytics, and user-generated content with unpredictable access patterns."
        ],
        "example": "A smart automated library assistant who moves books you haven't opened in a month to higher shelves, and books untouched in three months to basement archives, but instantly returns them to your desk without charging an extra fee if requested.",
        "code": "type IntelligentTier = 'Frequent' | 'Infrequent' | 'Archive Instant';\n\ninterface ObjectLifecycleState {\n  objectId: string;\n  daysUntouched: number;\n}\n\nfunction resolveIntelligentTier(obj: ObjectLifecycleState): { tier: IntelligentTier; savingsPct: number } {\n  if (obj.daysUntouched >= 90) return { tier: 'Archive Instant', savingsPct: 68 };\n  if (obj.daysUntouched >= 30) return { tier: 'Infrequent', savingsPct: 40 };\n  return { tier: 'Frequent', savingsPct: 0 };\n}\n\nconst file1 = resolveIntelligentTier({ objectId: 'doc_active.pdf', daysUntouched: 5 });\nconst file2 = resolveIntelligentTier({ objectId: 'photo_summer.jpg', daysUntouched: 42 });\nconst file3 = resolveIntelligentTier({ objectId: 'report_2024.zip', daysUntouched: 120 });\n\nconsole.log(`File 1: ${file1.tier} (0%) | File 2: ${file2.tier} (Savings: ${file2.savingsPct}%) | File 3: ${file3.tier} (Savings: ${file3.savingsPct}%)`);",
        "output": "File 1: Frequent (0%) | File 2: Infrequent (Savings: 40%) | File 3: Archive Instant (Savings: 68%)",
        "codeNotes": [
          {
            "line": 7,
            "note": "Models the automated S3 Intelligent-Tiering evaluation based on consecutive days untouched (30 and 90-day thresholds)."
          },
          {
            "line": 17,
            "note": "Demonstrates automatic tier classification delivering progressive storage discounts with zero retrieval fees."
          }
        ],
        "tryIt": "Test an object that was untouched for 35 days, then accessed today (daysUntouched reset to 0), and observe its tier.",
        "check": {
          "question": "What is the primary advantage of S3 Intelligent-Tiering over manually configuring S3 Standard-IA?",
          "options": [
            "Intelligent-Tiering automatically optimizes storage tiers with zero retrieval fees when data is read",
            "Intelligent-Tiering automatically translates foreign language text documents",
            "Intelligent-Tiering is only available for text files under 1 kilobyte"
          ],
          "answer": 0,
          "why": "Intelligent-Tiering automatically moves data between tiers based on usage and never charges data retrieval fees."
        }
      },
      {
        "title": "Lifecycle Management Transition & Expiration Policies",
        "say": [
          "To enforce automated corporate data governance and prevent storage bloat, S3 provides Lifecycle Management Rules.",
          "A Lifecycle configuration consists of declarative XML or JSON rules attached directly to an S3 bucket.",
          "Each rule defines a target prefix or object tag, and specifies two major types of actions: Transition Actions, and Expiration Actions.",
          "Transition Actions define when objects should migrate to cheaper storage tiers based on their age in days.",
          "For example, an enterprise rule can automatically transition raw log files to S3 Standard-IA after 30 days, and to Glacier Deep Archive after 90 days.",
          "Expiration Actions define when objects should be permanently deleted from the bucket.",
          "For instance, temporary build artifacts or compliance audit logs can be configured to expire automatically after 365 days.",
          "Another vital lifecycle rule is AbortIncompleteMultipartUploads.",
          "When a multi-gigabyte upload is interrupted, uploaded parts remain stored in S3 indefinitely, quietly billing your account.",
          "Configuring a lifecycle rule to abort incomplete multipart uploads after 7 days automatically purges orphaned data, saving significant cloud spend."
        ],
        "example": "A corporate paper document retention policy stating that customer correspondence is kept in office filing cabinets for 30 days, moved to basement boxes for one year, and then shredded permanently after seven years.",
        "code": "interface LifecycleRule {\n  targetPrefix: string;\n  transitions: { days: number; storageClass: string }[];\n  expirationDays: number;\n}\n\nconst logBucketPolicy: LifecycleRule = {\n  targetPrefix: 'logs/',\n  transitions: [\n    { days: 30, storageClass: 'STANDARD_IA' },\n    { days: 90, storageClass: 'GLACIER_DEEP_ARCHIVE' }\n  ],\n  expirationDays: 365\n};\n\nfunction evaluateObjectAction(ageDays: number, rule: LifecycleRule): string {\n  if (ageDays >= rule.expirationDays) return 'PERMANENTLY_EXPIRE';\n  const applicableTransitions = rule.transitions.filter(t => ageDays >= t.days);\n  if (applicableTransitions.length > 0) {\n    return `TRANSITION_TO_${applicableTransitions[applicableTransitions.length - 1].storageClass}`;\n  }\n  return 'REMAIN_STANDARD';\n}\n\nconsole.log(`Age 10d: ${evaluateObjectAction(10, logBucketPolicy)} | Age 45d: ${evaluateObjectAction(45, logBucketPolicy)} | Age 400d: ${evaluateObjectAction(400, logBucketPolicy)}`);",
        "output": "Age 10d: REMAIN_STANDARD | Age 45d: TRANSITION_TO_STANDARD_IA | Age 400d: PERMANENTLY_EXPIRE",
        "codeNotes": [
          {
            "line": 7,
            "note": "Declares a complete S3 lifecycle rule defining multi-stage storage transitions and permanent expiration."
          },
          {
            "line": 24,
            "note": "Evaluates object actions across 10, 45, and 400 days demonstrating automated lifecycle transitions."
          }
        ],
        "tryIt": "Add an expiration policy rule deleting temporary files in 'tmp/' after 3 days.",
        "check": {
          "question": "Why should every production S3 bucket configure an 'Abort Incomplete Multipart Uploads' lifecycle rule?",
          "options": [
            "To prevent hackers from executing SQL injection attacks inside S3",
            "To automatically purge hidden orphaned file parts from failed uploads that would otherwise accumulate storage costs indefinitely",
            "Because AWS deletes the entire bucket if multipart uploads are enabled"
          ],
          "answer": 1,
          "why": "Incomplete multipart uploads leave orphaned parts that incur storage fees indefinitely unless automatically purged."
        }
      },
      {
        "title": "S3 Versioning and MFA Delete Protection",
        "say": [
          "Accidental deletion or malicious overwriting of production data represents a catastrophic business continuity threat.",
          "Amazon S3 Versioning provides a foundational safeguard by preserving every version of every object stored in your bucket.",
          "Once Versioning is enabled on an S3 bucket, it can never be disabled; it can only be suspended.",
          "When you upload an object with an existing key, S3 does not overwrite the data; it assigns a unique Version ID and places the new object at the top of the version stack.",
          "When a user issues an HTTP DELETE command against a versioned object, S3 does not destroy the file.",
          "Instead, S3 inserts a Delete Marker at the top of the stack.",
          "Subsequent GET requests return 404 Not Found, but the older versions remain fully intact and can be restored simply by deleting the delete marker.",
          "To provide ultimate protection against rogue employees or compromised administrator credentials, S3 offers MFA Delete.",
          "MFA Delete mandates that permanently deleting an object version or altering bucket versioning requires authentication with a physical hardware TOTP MFA token.",
          "Combining Versioning with MFA Delete makes production S3 buckets practically impervious to ransomware and accidental data destruction."
        ],
        "example": "A legal document tracking system where striking through a paragraph does not erase the old text, but keeps the complete audit history, requiring two senior partners with biometric keys to permanently shred the file.",
        "code": "interface S3VersionRecord {\n  versionId: string;\n  isDeleteMarker: boolean;\n  timestamp: number;\n}\n\nclass S3VersionStack {\n  versions: S3VersionRecord[] = [];\n\n  putObject(): string {\n    const vId = 'v_' + Math.random().toString(36).substring(7);\n    this.versions.unshift({ versionId: vId, isDeleteMarker: false, timestamp: Date.now() });\n    return vId;\n  }\n\n  deleteObject(): string {\n    const markerId = 'del_' + Math.random().toString(36).substring(7);\n    this.versions.unshift({ versionId: markerId, isDeleteMarker: true, timestamp: Date.now() });\n    return markerId;\n  }\n\n  isAvailable(): boolean {\n    return this.versions.length > 0 && !this.versions[0].isDeleteMarker;\n  }\n}\n\nconst file = new S3VersionStack();\nfile.putObject(); // v1\nfile.putObject(); // v2 (update)\nfile.deleteObject(); // soft delete marker\nconsole.log(`Total Versions Preserved: ${file.versions.length} | Currently Visible: ${file.isAvailable()}`);",
        "output": "Total Versions Preserved: 3 | Currently Visible: false",
        "codeNotes": [
          {
            "line": 7,
            "note": "Models the S3 Versioning stack demonstrating non-destructive object updates and delete markers."
          },
          {
            "line": 31,
            "note": "Shows that deleting a file merely inserts a delete marker while all previous versions remain safely preserved."
          }
        ],
        "tryIt": "Pop the delete marker off the version stack and verify that the previous object version becomes instantly visible again.",
        "check": {
          "question": "What actually happens when a user deletes an object from an S3 bucket that has Versioning enabled?",
          "options": [
            "All physical hard drives storing the object are shredded immediately",
            "S3 inserts a Delete Marker at the top of the version stack, preserving all previous versions for recovery",
            "The bucket is automatically reset to empty"
          ],
          "answer": 1,
          "why": "With versioning enabled, S3 inserts a Delete Marker; the underlying data remains intact and can be restored."
        }
      },
      {
        "title": "S3 Multipart Upload & Transfer Acceleration",
        "say": [
          "Uploading large files over the public internet is susceptible to network interruptions, packet loss, and high latency.",
          "If a 10-gigabyte file upload fails at 99 percent, restarting the entire upload from byte zero is unacceptable.",
          "Amazon S3 solves this with the Multipart Upload API.",
          "Multipart upload allows you to upload a single large object as a set of independent parts.",
          "Parts can be uploaded in parallel by multiple threads, dramatically increasing aggregate throughput.",
          "If any single part fails due to a network glitch, only that specific part needs to be retried.",
          "AWS recommends multipart upload for all files larger than 100 megabytes, and strictly mandates multipart upload for files exceeding 5 gigabytes.",
          "Once all parts are uploaded, S3 stitches the parts together into the final object atomically.",
          "In addition, for global users uploading files across oceans, AWS offers S3 Transfer Acceleration.",
          "Transfer Acceleration routes traffic through the nearest AWS Edge Location over the private, optimized AWS global network backbone.",
          "Using Transfer Acceleration can speed up cross-border file uploads by fifty to five hundred percent."
        ],
        "example": "Shipping a massive pre-fabricated modular home in ten separate flatbed trucks traveling in parallel on highways, then assembling the parts at the destination, rather than attempting to haul the entire house on one truck.",
        "code": "interface UploadPart {\n  partNumber: number;\n  sizeMb: number;\n  etag: string;\n}\n\nfunction assembleMultipartUpload(parts: UploadPart[]): { totalParts: number; totalSizeMb: number; isComplete: boolean } {\n  // Sort parts by part number ascending\n  const sorted = [...parts].sort((a, b) => a.partNumber - b.partNumber);\n  const totalSizeMb = sorted.reduce((sum, p) => sum + p.sizeMb, 0);\n  return {\n    totalParts: sorted.length,\n    totalSizeMb,\n    isComplete: sorted.length === 3 // simulated 3-part manifest\n  };\n}\n\nconst parts: UploadPart[] = [\n  { partNumber: 2, sizeMb: 50, etag: '\"etag-part-2\"' },\n  { partNumber: 1, sizeMb: 50, etag: '\"etag-part-1\"' },\n  { partNumber: 3, sizeMb: 45, etag: '\"etag-part-3\"' },\n];\n\nconst completed = assembleMultipartUpload(parts);\nconsole.log(`Multipart Upload Complete: ${completed.isComplete} | Total Size: ${completed.totalSizeMb}MB across ${completed.totalParts} parts`);",
        "output": "Multipart Upload Complete: true | Total Size: 145MB across 3 parts",
        "codeNotes": [
          {
            "line": 7,
            "note": "Assembles discrete uploaded parts in ascending part order to construct the unified target object."
          },
          {
            "line": 22,
            "note": "Demonstrates parallel out-of-order part ingestion resolved into an atomic 145MB finished file."
          }
        ],
        "tryIt": "Add a 4th part to the upload and verify that total object size increases dynamically.",
        "check": {
          "question": "When does AWS mandate the use of S3 Multipart Upload?",
          "options": [
            "For any file uploaded on a weekend",
            "For single objects larger than 5 gigabytes in size",
            "Only for files stored in Glacier Deep Archive"
          ],
          "answer": 1,
          "why": "Single HTTP PUT operations in S3 are limited to 5GB; objects larger than 5GB strictly require Multipart Upload."
        }
      }
    ],
    "summary": [
      "Amazon S3 provides 11 9s of durability for flat, immutable object storage accessible via globally unique bucket names.",
      "S3 storage classes range from Standard to Glacier Deep Archive, with Intelligent-Tiering providing automatic cost savings with zero retrieval fees.",
      "Lifecycle rules automate tier transitions and object expirations, while Versioning and MFA Delete guard against data loss and ransomware."
    ],
    "projectStep": {
      "title": "S3 Bucket Architecture & Lifecycle Policy Implementation",
      "steps": [
        "Create a production S3 bucket with globally unique naming and enable S3 Versioning",
        "Configure an S3 Intelligent-Tiering lifecycle configuration for all unstructured media objects",
        "Add a lifecycle rule aborting incomplete multipart uploads after 7 days and expiring old versions after 90 days"
      ]
    }
  },
  {
    "day": 10,
    "title": "Amazon S3 Security, Block Public Access & Bucket Policies",
    "goal": "Harden Amazon S3 buckets using Block Public Access, author least-privilege Bucket Policies, and enforce encryption at rest.",
    "minutes": 25,
    "recap": "Yesterday we learned S3 object storage classes and lifecycle tiering. Today we secure your data: locking down S3 buckets with Block Public Access, JSON bucket policies, and encryption.",
    "parts": [
      {
        "title": "S3 Block Public Access: The Account & Bucket Kill-Switch",
        "say": [
          "Securing data stored in Amazon S3 is the single most scrutinized operational duty of every cloud engineer.",
          "Over the past decade, dozens of high-profile data breaches occurred not because AWS infrastructure was hacked, but because customers accidentally configured buckets to be publicly readable.",
          "To eradicate public data exposure, AWS introduced S3 Block Public Access (BPA).",
          "Block Public Access acts as a centralized master circuit breaker that overrides all bucket policies, access points, and Access Control Lists.",
          "BPA provides four distinct granular controls.",
          "BlockPublicAcls blocks the granting of public permissions via newly added ACLs.",
          "IgnorePublicAcls causes S3 to ignore all existing public ACLs attached to the bucket or its objects.",
          "BlockPublicPolicy rejects the saving of any bucket policy that grants public access.",
          "RestrictPublicBuckets restricts access to an existing public policy bucket strictly to AWS service principals and authorized account users.",
          "Since April 2023, AWS enables all four Block Public Access settings by default on every newly created S3 bucket.",
          "You should also activate Block Public Access at the AWS Account level, ensuring that zero public buckets can ever be created in your entire organization."
        ],
        "example": "The main master electrical breaker in a corporate building: flipping this master switch cuts all power to exterior plugs regardless of what switches are turned on in individual offices.",
        "code": "interface BlockPublicAccessConfig {\n  blockPublicAcls: boolean;\n  ignorePublicAcls: boolean;\n  blockPublicPolicy: boolean;\n  restrictPublicBuckets: boolean;\n}\n\nfunction isFullySecured(config: BlockPublicAccessConfig): boolean {\n  return config.blockPublicAcls &&\n    config.ignorePublicAcls &&\n    config.blockPublicPolicy &&\n    config.restrictPublicBuckets;\n}\n\nconst productionBpa: BlockPublicAccessConfig = {\n  blockPublicAcls: true,\n  ignorePublicAcls: true,\n  blockPublicPolicy: true,\n  restrictPublicBuckets: true\n};\n\nconsole.log(`S3 Block Public Access Status: Fully Secured = ${isFullySecured(productionBpa)}`);",
        "output": "S3 Block Public Access Status: Fully Secured = true",
        "codeNotes": [
          {
            "line": 8,
            "note": "Defines the 4 essential S3 Block Public Access configuration flags."
          },
          {
            "line": 21,
            "note": "Validates that all four BPA settings are active, guaranteeing zero public data exposure."
          }
        ],
        "tryIt": "Simulate setting blockPublicPolicy to false and observe how the security check flags the vulnerability.",
        "check": {
          "question": "What occurs if an engineer attempts to apply a public bucket policy to an S3 bucket that has Block Public Access enabled?",
          "options": [
            "The policy is accepted, but AWS sends an alert email to the billing team",
            "S3 immediately rejects the policy update with an Access Denied error",
            "The S3 bucket is converted into a public web server"
          ],
          "answer": 1,
          "why": "Block Public Access acts as an account-level circuit breaker that immediately rejects any policy granting public access."
        }
      },
      {
        "title": "S3 Bucket Policies vs IAM Policies vs ACLs",
        "say": [
          "Managing access to Amazon S3 involves understanding three distinct authorization mechanisms: Bucket Policies, IAM Policies, and Access Control Lists.",
          "Bucket Policies are resource-based policies attached directly to the S3 bucket itself.",
          "Because they are attached to the resource, Bucket Policies can authorize cross-account access: allowing users from an external partner AWS account to read files.",
          "IAM Policies, in contrast, are attached to IAM users, groups, or compute roles within your own account.",
          "Access Control Lists, or ACLs, are a legacy permission mechanism dating back to the launch of S3 in 2006.",
          "ACLs manage permissions on individual objects, creating complex, fragmented permission sprawl.",
          "AWS strongly recommends disabling ACLs entirely on all buckets by configuring S3 Object Ownership to 'Bucket owner enforced'.",
          "When Bucket Owner Enforced is active, ACLs are completely ignored; the bucket owner automatically owns all uploaded objects, and permissions are governed solely by IAM and Bucket Policies.",
          "This centralization eliminates credential confusion and guarantees unified security governance."
        ],
        "example": "The rules posted on the exterior glass door of a secure building (Bucket Policy) versus the electronic access permissions programmed onto your employee keycard (IAM Policy).",
        "code": "interface BucketPolicyStatement {\n  Sid: string;\n  Effect: 'Allow' | 'Deny';\n  Principal: string | { AWS: string };\n  Action: string[];\n  Resource: string;\n}\n\nconst crossAccountReadPolicy: BucketPolicyStatement = {\n  Sid: 'AllowPartnerAccountRead',\n  Effect: 'Allow',\n  Principal: { AWS: 'arn:aws:iam::999888777666:root' }, // External partner account\n  Action: ['s3:GetObject'],\n  Resource: 'arn:aws:s3:::corporate-data-share/*'\n};\n\nconsole.log(`Bucket Policy [${crossAccountReadPolicy.Sid}]: Granted ${crossAccountReadPolicy.Action.join(', ')} to Partner Account`);",
        "output": "Bucket Policy [AllowPartnerAccountRead]: Granted s3:GetObject to Partner Account",
        "codeNotes": [
          {
            "line": 9,
            "note": "Defines a resource-based S3 bucket policy explicitly authorizing cross-account access to a partner AWS account."
          },
          {
            "line": 16,
            "note": "Logs the cross-account read grant demonstrating resource-level authorization."
          }
        ],
        "tryIt": "Change the Action array to support both 's3:GetObject' and 's3:ListBucket'.",
        "check": {
          "question": "Why does AWS recommend disabling S3 Access Control Lists (ACLs) using the 'Bucket Owner Enforced' setting?",
          "options": [
            "ACLs cannot store more than 10 bytes of data",
            "Disabling ACLs centralizes all access control under modern, auditable IAM and Bucket Policies",
            "ACLs are only supported on Windows operating systems"
          ],
          "answer": 1,
          "why": "Bucket Owner Enforced disables fragmented legacy ACLs, simplifying governance through IAM and Bucket Policies."
        }
      },
      {
        "title": "Enforcing TLS / HTTPS in Transit via Bucket Policies",
        "say": [
          "Securing data in transit across the network is mandatory for compliance with industry standards like PCI-DSS, HIPAA, and SOC 2.",
          "By default, an S3 bucket endpoint will accept incoming HTTP requests transmitted in unencrypted plaintext.",
          "An attacker conducting a man-in-the-middle attack or sniffing network packets could intercept sensitive data as it traverses the wire.",
          "To prevent unencrypted transmission, cloud engineers author a Bucket Policy statement that explicitly denies all non-HTTPS requests.",
          "The policy leverages the AWS global condition key: 'aws:SecureTransport'.",
          "By configuring Effect: 'Deny', Action: 's3:*', and Condition: { Bool: { 'aws:SecureTransport': 'false' } }, any request made over plain HTTP is immediately rejected.",
          "Because an Explicit Deny overrules all allow permissions in AWS, this single policy guarantees that 100 percent of traffic entering or leaving the bucket is encrypted with TLS.",
          "Applying this policy template across all S3 buckets is an automated baseline requirement in every enterprise security pipeline."
        ],
        "example": "A bank branch policy stating that tellers will immediately reject and shred any cash deposit sent in an open unsealed envelope, requiring all deposits to arrive inside locked, tamper-evident security bags.",
        "code": "interface TlsPolicyRule {\n  Effect: 'Deny';\n  Action: string;\n  Resource: string;\n  Condition: { Bool: { 'aws:SecureTransport': string } };\n}\n\nconst enforceTlsPolicy: TlsPolicyRule = {\n  Effect: 'Deny',\n  Action: 's3:*',\n  Resource: 'arn:aws:s3:::finance-vault/*',\n  Condition: { Bool: { 'aws:SecureTransport': 'false' } }\n};\n\nfunction testTlsTransmission(isHttps: boolean, policy: TlsPolicyRule): 'REJECTED' | 'ALLOWED' {\n  if (!isHttps && policy.Condition.Bool['aws:SecureTransport'] === 'false') {\n    return 'REJECTED'; // Explicit Deny triggered\n  }\n  return 'ALLOWED';\n}\n\nconsole.log(`Plaintext HTTP Request: ${testTlsTransmission(false, enforceTlsPolicy)} | Encrypted HTTPS Request: ${testTlsTransmission(true, enforceTlsPolicy)}`);",
        "output": "Plaintext HTTP Request: REJECTED | Encrypted HTTPS Request: ALLOWED",
        "codeNotes": [
          {
            "line": 8,
            "note": "Defines the canonical S3 Bucket Policy enforcing TLS encryption in transit using aws:SecureTransport."
          },
          {
            "line": 20,
            "note": "Demonstrates that unencrypted plaintext HTTP requests are immediately rejected by the explicit deny rule."
          }
        ],
        "tryIt": "Verify that changing isHttps to true allows requests to proceed without triggering the explicit deny.",
        "check": {
          "question": "Which condition key is used in an S3 Bucket Policy to explicitly deny all unencrypted HTTP traffic?",
          "options": [
            "'aws:NetworkProtocol' equals 'tcp'",
            "'aws:SecureTransport' equals 'false'",
            "'s3:EncryptionEnabled' equals 'off'"
          ],
          "answer": 1,
          "why": "The 'aws:SecureTransport': 'false' condition with Effect: 'Deny' immediately blocks all non-HTTPS requests."
        }
      },
      {
        "title": "Encryption at Rest: SSE-S3 vs SSE-KMS vs SSE-C",
        "say": [
          "In addition to securing data in transit, cloud architects must encrypt all data stored at rest on physical disks.",
          "Amazon S3 provides three distinct Server-Side Encryption (SSE) mechanisms.",
          "The first is SSE-S3 (Server-Side Encryption with Amazon S3-Managed Keys).",
          "Under SSE-S3, each object is encrypted with a unique key using 256-bit Advanced Encryption Standard (AES-256).",
          "AWS manages the encryption keys automatically with zero configuration overhead and zero additional cost.",
          "Since January 2023, SSE-S3 is automatically enabled by default on all S3 buckets.",
          "The second mechanism is SSE-KMS (Server-Side Encryption with AWS Key Management Service).",
          "SSE-KMS uses Customer Managed Keys (CMKs) stored in AWS KMS, giving organizations full control over key rotation policies and IAM key access.",
          "Crucially, every single encrypt and decrypt event using SSE-KMS is logged in AWS CloudTrail, providing an immutable audit trail of who accessed sensitive data.",
          "The third mechanism is SSE-C (Customer-Provided Keys), where the customer supplies the encryption key in the HTTP headers of every single request.",
          "AWS never stores the SSE-C key; if the customer loses the key, the stored data is permanently unrecoverable."
        ],
        "example": "A hotel guest safe: using the hotel's master electronic safe code (SSE-S3), programming your own digital pin with an audit log recording every door opening (SSE-KMS), or bringing your own physical padlock from home (SSE-C).",
        "code": "type SseMode = 'SSE-S3' | 'SSE-KMS' | 'SSE-C';\n\ninterface EncryptionOption {\n  mode: SseMode;\n  keyManager: string;\n  auditLoggingInCloudTrail: boolean;\n  extraCost: boolean;\n}\n\nconst encryptionOptions: EncryptionOption[] = [\n  { mode: 'SSE-S3', keyManager: 'AWS Managed Keys', auditLoggingInCloudTrail: false, extraCost: false },\n  { mode: 'SSE-KMS', keyManager: 'Customer Managed KMS Key', auditLoggingInCloudTrail: true, extraCost: true },\n  { mode: 'SSE-C', keyManager: 'Customer Manages On-Prem', auditLoggingInCloudTrail: false, extraCost: false },\n];\n\nfor (const opt of encryptionOptions) {\n  console.log(`[${opt.mode}] Managed By: ${opt.keyManager} | CloudTrail Audit: ${opt.auditLoggingInCloudTrail}`);\n}",
        "output": "[SSE-S3] Managed By: AWS Managed Keys | CloudTrail Audit: false\n[SSE-KMS] Managed By: Customer Managed KMS Key | CloudTrail Audit: true\n[SSE-C] Managed By: Customer Manages On-Prem | CloudTrail Audit: false",
        "codeNotes": [
          {
            "line": 10,
            "note": "Defines the 3 server-side encryption modes supported by Amazon S3."
          },
          {
            "line": 16,
            "note": "Highlights that SSE-KMS is the only encryption mode providing granular CloudTrail audit logs for every read/write."
          }
        ],
        "tryIt": "Identify which encryption mode is required if your compliance team demands a CloudTrail audit trail for every decrypt operation.",
        "check": {
          "question": "What is the primary operational advantage of SSE-KMS over standard SSE-S3 for enterprise compliance?",
          "options": [
            "SSE-KMS compresses images by fifty percent automatically",
            "SSE-KMS logs every single key access and decryption event in AWS CloudTrail for auditability",
            "SSE-KMS makes S3 buckets run ten times faster"
          ],
          "answer": 1,
          "why": "SSE-KMS provides user access control over keys and logs every decryption request in AWS CloudTrail for compliance auditing."
        }
      },
      {
        "title": "S3 Pre-Signed URLs for Secure Temporary Client Uploads/Downloads",
        "say": [
          "In web applications, users frequently upload large profile photos, videos, or PDF documents.",
          "A common architectural bottleneck is streaming those gigabytes through your backend Node.js EC2 instances or Lambda functions.",
          "Routing file uploads through backend application servers wastes CPU cycles, consumes memory buffers, and requires scaling compute fleets solely to proxy bytes.",
          "Amazon S3 provides an elegant cloud-native alternative: Pre-Signed URLs.",
          "A Pre-Signed URL is a temporary URL generated by your backend application using its own IAM credentials.",
          "The URL embeds cryptographic authentication query parameters, a specific HTTP method (GET or PUT), and a strict expiration timestamp (such as 15 minutes).",
          "When a user wants to upload a file, your backend generates an S3 pre-signed PUT URL and returns it to the client browser in a JSON response.",
          "The client browser then uploads the file directly to the S3 bucket using a standard HTTP PUT request.",
          "Your backend servers never touch the raw payload bytes, eliminating compute bottlenecks and allowing S3 to handle massive horizontal ingest.",
          "Pre-signed URLs can also grant temporary read access to private S3 files without making the bucket public."
        ],
        "example": "A parking attendant issuing a printed barcode ticket that allows a delivery driver to open the private parking garage gate for exactly twenty minutes, without giving the driver a master remote control.",
        "code": "interface PreSignedUrlParams {\n  bucket: string;\n  key: string;\n  operation: 'getObject' | 'putObject';\n  expiresInSeconds: number;\n}\n\nfunction generatePreSignedUrl(params: PreSignedUrlParams): { url: string; expiresAt: string } {\n  const expiresAt = new Date(Date.now() + (params.expiresInSeconds * 1000)).toISOString();\n  const signature = btoa(`${params.bucket}/${params.key}/${expiresAt}`).substring(0, 12);\n  const url = `https://${params.bucket}.s3.amazonaws.com/${params.key}?X-Amz-Expires=${params.expiresInSeconds}&X-Amz-Signature=${signature}`;\n  return { url, expiresAt };\n}\n\nconst uploadToken = generatePreSignedUrl({\n  bucket: 'user-uploads-vault',\n  key: 'avatars/user_101.jpg',\n  operation: 'putObject',\n  expiresInSeconds: 900 // 15 minutes\n});\n\nconsole.log(`Pre-Signed URL Generated (Expires in 15m): ${uploadToken.url.substring(0, 65)}...`);",
        "output": "Pre-Signed URL Generated (Expires in 15m): https://user-uploads-vault.s3.amazonaws.com/avatars/user_101.jpg?...",
        "codeNotes": [
          {
            "line": 8,
            "note": "Simulates generating an S3 pre-signed URL containing cryptographic signatures and strict expiration parameters."
          },
          {
            "line": 20,
            "note": "Demonstrates secure direct client-to-S3 uploads bypassing backend application server bottlenecks."
          }
        ],
        "tryIt": "Change the expiration to 3600 seconds (1 hour) for long video upload operations.",
        "check": {
          "question": "How do S3 Pre-Signed URLs improve performance for web applications handling user file uploads?",
          "options": [
            "They force the client computer to encrypt files twice before transmitting",
            "They allow client browsers to upload files directly to S3, bypassing backend servers and eliminating compute bottlenecks",
            "They automatically make all uploaded files public so anyone can view them"
          ],
          "answer": 1,
          "why": "Pre-signed URLs allow clients to upload directly to S3, removing load from backend servers and speeding up transfers."
        }
      },
      {
        "title": "S3 Object Lock & Compliance Retention Modes",
        "say": [
          "For highly regulated industries like financial services, healthcare, and government contracting, data immutability is mandated by law.",
          "Regulations like SEC Rule 17a-4 require electronic records to be stored in Write Once, Read Many (WORM) format.",
          "Amazon S3 satisfies these legal requirements through S3 Object Lock.",
          "S3 Object Lock prevents an object from being deleted or overwritten for a fixed retention period or an indefinite legal hold.",
          "Object Lock offers two distinct retention modes: Governance Mode, and Compliance Mode.",
          "In Governance Mode, objects are protected from deletion by normal users, but administrators possessing the special 's3:BypassGovernanceRetention' IAM permission can delete the object or alter the retention period if necessary.",
          "Governance Mode is ideal for protecting corporate data against accidental deletion while retaining administrative flexibility.",
          "In Compliance Mode, the protection is absolute: no user, including the AWS account Root User, can delete or overwrite the object until the retention period expires.",
          "Even AWS support engineers cannot bypass Compliance Mode.",
          "S3 Object Lock provides verifiable, mathematically enforced data integrity against rogue employees, compromised administrators, and ransomware attacks."
        ],
        "example": "A tamper-evident financial evidence locker equipped with a physical mechanical timer lock that physically cannot be unlocked or destroyed by anyone, including the bank president, until seven years have elapsed.",
        "code": "type ObjectLockMode = 'GOVERNANCE' | 'COMPLIANCE';\n\ninterface ObjectLockStatus {\n  key: string;\n  mode: ObjectLockMode;\n  retainUntil: string;\n  legalHoldActive: boolean;\n}\n\nfunction canDeleteObject(obj: ObjectLockStatus, userHasBypassPermission: boolean): boolean {\n  if (obj.legalHoldActive) return false; // Legal hold blocks all deletion\n  const isRetained = new Date(obj.retainUntil).getTime() > Date.now();\n  if (!isRetained) return true; // Retention period has expired\n  // During retention:\n  if (obj.mode === 'COMPLIANCE') return false; // Nobody can delete, even root!\n  if (obj.mode === 'GOVERNANCE' && userHasBypassPermission) return true;\n  return false;\n}\n\nconst lockedRecord: ObjectLockStatus = {\n  key: 'audit_tax_2026.pdf',\n  mode: 'COMPLIANCE',\n  retainUntil: new Date(Date.now() + 86400000 * 365).toISOString(),\n  legalHoldActive: false\n};\n\nconsole.log(`Compliance Mode Delete Allowed (Root User): ${canDeleteObject(lockedRecord, true)}`);",
        "output": "Compliance Mode Delete Allowed (Root User): false",
        "codeNotes": [
          {
            "line": 10,
            "note": "Evaluates S3 Object Lock deletion permissions under Compliance Mode vs Governance Mode."
          },
          {
            "line": 26,
            "note": "Proves that in Compliance Mode, deletion is strictly prohibited even for users with full bypass permissions."
          }
        ],
        "tryIt": "Change mode to 'GOVERNANCE' and verify that an administrator with bypass permission can delete the object.",
        "check": {
          "question": "Can an AWS account Root User delete an object locked under S3 Object Lock Compliance Mode before the retention period expires?",
          "options": [
            "Yes, the root user can always override all S3 settings at any time",
            "No, in Compliance Mode, not even the root user or AWS support can delete the object until the retention period expires",
            "Yes, but only if they delete the bucket first"
          ],
          "answer": 1,
          "why": "Under S3 Object Lock Compliance Mode, no identity (including root) can delete or alter the object during retention."
        }
      }
    ],
    "summary": [
      "S3 Block Public Access acts as a centralized circuit breaker that overrides all policies to prevent public data exposure.",
      "Bucket policies enforce security in transit using 'aws:SecureTransport': 'false' to deny unencrypted plaintext HTTP traffic.",
      "Pre-signed URLs enable secure direct client uploads to S3, while Object Lock Compliance Mode enforces immutable WORM data retention."
    ],
    "projectStep": {
      "title": "S3 Security Hardening & Bucket Policy Deployment",
      "steps": [
        "Enable all four S3 Block Public Access settings on your production media and document buckets",
        "Attach a Bucket Policy enforcing TLS encryption in transit by denying requests where 'aws:SecureTransport' is false",
        "Implement backend generation of temporary S3 Pre-Signed URLs for direct client document uploads"
      ]
    }
  }
];
