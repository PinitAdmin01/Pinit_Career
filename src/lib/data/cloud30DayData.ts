import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const CLOUD_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "Cloud Computing Models (IaaS, PaaS, SaaS)",
    desc: "Compare infrastructure, platform, and software models and total cost of ownership.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Cloud Computing Models (IaaS, PaaS, SaaS).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Cloud Computing Models (IaaS, PaaS, SaaS) Validation",
    eDesc: "Implement a JavaScript validation function for Cloud Computing Models (IaaS, PaaS, SaaS).",
    eStarter: "function cloudTaskDay1(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay1 !== 'function') throw new Error('Function cloudTaskDay1 not found');\nif (cloudTaskDay1('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Cloud Computing Models (IaaS, PaaS, SaaS) Practice",
    aDesc: "Write an auxiliary helper function for Cloud Computing Models (IaaS, PaaS, SaaS).",
    aStarter: "function cloudTaskDay1Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay1Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS Global Infrastructure & Regions",
    desc: "Understand AWS Regions, Availability Zones (AZs), Edge Locations, and low-latency routing.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS Global Infrastructure & Regions.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS Global Infrastructure & Regions Validation",
    eDesc: "Implement a JavaScript validation function for AWS Global Infrastructure & Regions.",
    eStarter: "function cloudTaskDay2(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay2 !== 'function') throw new Error('Function cloudTaskDay2 not found');\nif (cloudTaskDay2('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS Global Infrastructure & Regions Practice",
    aDesc: "Write an auxiliary helper function for AWS Global Infrastructure & Regions.",
    aStarter: "function cloudTaskDay2Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay2Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Virtual Private Cloud (VPC) Architecture",
    desc: "Design isolated VPC networks, public and private subnets, CIDR blocks, and route tables.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Virtual Private Cloud (VPC) Architecture.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Virtual Private Cloud (VPC) Architecture Validation",
    eDesc: "Implement a JavaScript validation function for Virtual Private Cloud (VPC) Architecture.",
    eStarter: "function cloudTaskDay3(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay3 !== 'function') throw new Error('Function cloudTaskDay3 not found');\nif (cloudTaskDay3('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Virtual Private Cloud (VPC) Architecture Practice",
    aDesc: "Write an auxiliary helper function for Virtual Private Cloud (VPC) Architecture.",
    aStarter: "function cloudTaskDay3Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay3Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Internet Gateways & NAT Gateways",
    desc: "Route public traffic via IGW and enable secure outbound internet access for private subnets via NAT.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Internet Gateways & NAT Gateways.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Internet Gateways & NAT Gateways Validation",
    eDesc: "Implement a JavaScript validation function for Internet Gateways & NAT Gateways.",
    eStarter: "function cloudTaskDay4(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay4 !== 'function') throw new Error('Function cloudTaskDay4 not found');\nif (cloudTaskDay4('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Internet Gateways & NAT Gateways Practice",
    aDesc: "Write an auxiliary helper function for Internet Gateways & NAT Gateways.",
    aStarter: "function cloudTaskDay4Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay4Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Security Groups & Network ACLs",
    desc: "Configure stateful instance firewalls and stateless subnet packet filters.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Security Groups & Network ACLs.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Security Groups & Network ACLs Validation",
    eDesc: "Implement a JavaScript validation function for Security Groups & Network ACLs.",
    eStarter: "function cloudTaskDay5(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay5 !== 'function') throw new Error('Function cloudTaskDay5 not found');\nif (cloudTaskDay5('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Security Groups & Network ACLs Practice",
    aDesc: "Write an auxiliary helper function for Security Groups & Network ACLs.",
    aStarter: "function cloudTaskDay5Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay5Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Elastic Compute Cloud (EC2) Instances",
    desc: "Launch EC2 instance types, configure AMI images, EBS root volumes, and user data bootstrap scripts.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Elastic Compute Cloud (EC2) Instances.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Elastic Compute Cloud (EC2) Instances Validation",
    eDesc: "Implement a JavaScript validation function for Elastic Compute Cloud (EC2) Instances.",
    eStarter: "function cloudTaskDay6(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay6 !== 'function') throw new Error('Function cloudTaskDay6 not found');\nif (cloudTaskDay6('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Elastic Compute Cloud (EC2) Instances Practice",
    aDesc: "Write an auxiliary helper function for Elastic Compute Cloud (EC2) Instances.",
    aStarter: "function cloudTaskDay6Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay6Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Elastic Block Store (EBS) & Snapshots",
    desc: "Manage gp3/io2 SSD volumes, dynamic volume resizing, automated snapshot lifecycle managers, and encryption.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Elastic Block Store (EBS) & Snapshots.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Elastic Block Store (EBS) & Snapshots Validation",
    eDesc: "Implement a JavaScript validation function for Elastic Block Store (EBS) & Snapshots.",
    eStarter: "function cloudTaskDay7(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay7 !== 'function') throw new Error('Function cloudTaskDay7 not found');\nif (cloudTaskDay7('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Elastic Block Store (EBS) & Snapshots Practice",
    aDesc: "Write an auxiliary helper function for Elastic Block Store (EBS) & Snapshots.",
    aStarter: "function cloudTaskDay7Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay7Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Elastic Load Balancing (ALB, NLB)",
    desc: "Distribute HTTP/HTTPS traffic via Application Load Balancers and TCP streams via Network Load Balancers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Elastic Load Balancing (ALB, NLB).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Elastic Load Balancing (ALB, NLB) Validation",
    eDesc: "Implement a JavaScript validation function for Elastic Load Balancing (ALB, NLB).",
    eStarter: "function cloudTaskDay8(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay8 !== 'function') throw new Error('Function cloudTaskDay8 not found');\nif (cloudTaskDay8('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Elastic Load Balancing (ALB, NLB) Practice",
    aDesc: "Write an auxiliary helper function for Elastic Load Balancing (ALB, NLB).",
    aStarter: "function cloudTaskDay8Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay8Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Auto Scaling Groups (ASG) & Policies",
    desc: "Scale EC2 fleets dynamically based on CPU utilization, target tracking policies, and health checks.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Auto Scaling Groups (ASG) & Policies.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Auto Scaling Groups (ASG) & Policies Validation",
    eDesc: "Implement a JavaScript validation function for Auto Scaling Groups (ASG) & Policies.",
    eStarter: "function cloudTaskDay9(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay9 !== 'function') throw new Error('Function cloudTaskDay9 not found');\nif (cloudTaskDay9('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Auto Scaling Groups (ASG) & Policies Practice",
    aDesc: "Write an auxiliary helper function for Auto Scaling Groups (ASG) & Policies.",
    aStarter: "function cloudTaskDay9Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay9Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Simple Storage Service (S3) Buckets",
    desc: "Configure bucket policies, versioning, lifecycle transitions, and cross-region replication.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Simple Storage Service (S3) Buckets.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Simple Storage Service (S3) Buckets Validation",
    eDesc: "Implement a JavaScript validation function for Simple Storage Service (S3) Buckets.",
    eStarter: "function cloudTaskDay10(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay10 !== 'function') throw new Error('Function cloudTaskDay10 not found');\nif (cloudTaskDay10('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Simple Storage Service (S3) Buckets Practice",
    aDesc: "Write an auxiliary helper function for Simple Storage Service (S3) Buckets.",
    aStarter: "function cloudTaskDay10Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay10Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Amazon CloudFront CDN & Origin Routing",
    desc: "Distribute global cached content, configure edge caching behaviors, and enforce HTTPS certificates.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Amazon CloudFront CDN & Origin Routing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Amazon CloudFront CDN & Origin Routing Validation",
    eDesc: "Implement a JavaScript validation function for Amazon CloudFront CDN & Origin Routing.",
    eStarter: "function cloudTaskDay11(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay11 !== 'function') throw new Error('Function cloudTaskDay11 not found');\nif (cloudTaskDay11('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Amazon CloudFront CDN & Origin Routing Practice",
    aDesc: "Write an auxiliary helper function for Amazon CloudFront CDN & Origin Routing.",
    aStarter: "function cloudTaskDay11Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay11Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Route 53 DNS & Traffic Policies",
    desc: "Manage hosted zones, alias records, latency-based routing, geolocation routing, and DNS failover.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Route 53 DNS & Traffic Policies.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Route 53 DNS & Traffic Policies Validation",
    eDesc: "Implement a JavaScript validation function for Route 53 DNS & Traffic Policies.",
    eStarter: "function cloudTaskDay12(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay12 !== 'function') throw new Error('Function cloudTaskDay12 not found');\nif (cloudTaskDay12('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Route 53 DNS & Traffic Policies Practice",
    aDesc: "Write an auxiliary helper function for Route 53 DNS & Traffic Policies.",
    aStarter: "function cloudTaskDay12Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay12Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS Lambda & Serverless Compute",
    desc: "Write event-driven serverless functions, configure execution timeouts, memory allocations, and concurrency.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS Lambda & Serverless Compute.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS Lambda & Serverless Compute Validation",
    eDesc: "Implement a JavaScript validation function for AWS Lambda & Serverless Compute.",
    eStarter: "function cloudTaskDay13(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay13 !== 'function') throw new Error('Function cloudTaskDay13 not found');\nif (cloudTaskDay13('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS Lambda & Serverless Compute Practice",
    aDesc: "Write an auxiliary helper function for AWS Lambda & Serverless Compute.",
    aStarter: "function cloudTaskDay13Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay13Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Amazon API Gateway & HTTP/REST APIs",
    desc: "Create secure API proxies, integrate Lambda backends, configure request validation, and API rate limiting.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Amazon API Gateway & HTTP/REST APIs.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Amazon API Gateway & HTTP/REST APIs Validation",
    eDesc: "Implement a JavaScript validation function for Amazon API Gateway & HTTP/REST APIs.",
    eStarter: "function cloudTaskDay14(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay14 !== 'function') throw new Error('Function cloudTaskDay14 not found');\nif (cloudTaskDay14('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Amazon API Gateway & HTTP/REST APIs Practice",
    aDesc: "Write an auxiliary helper function for Amazon API Gateway & HTTP/REST APIs.",
    aStarter: "function cloudTaskDay14Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay14Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "DynamoDB NoSQL Single-Digit Latency",
    desc: "Design partition keys, sort keys, Global Secondary Indexes (GSIs), and on-demand capacity scaling.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of DynamoDB NoSQL Single-Digit Latency.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: DynamoDB NoSQL Single-Digit Latency Validation",
    eDesc: "Implement a JavaScript validation function for DynamoDB NoSQL Single-Digit Latency.",
    eStarter: "function cloudTaskDay15(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay15 !== 'function') throw new Error('Function cloudTaskDay15 not found');\nif (cloudTaskDay15('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: DynamoDB NoSQL Single-Digit Latency Practice",
    aDesc: "Write an auxiliary helper function for DynamoDB NoSQL Single-Digit Latency.",
    aStarter: "function cloudTaskDay15Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay15Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Relational Database Service (RDS) & Aurora",
    desc: "Deploy managed PostgreSQL/MySQL instances, multi-AZ high availability, and automated read replicas.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Relational Database Service (RDS) & Aurora.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Relational Database Service (RDS) & Aurora Validation",
    eDesc: "Implement a JavaScript validation function for Relational Database Service (RDS) & Aurora.",
    eStarter: "function cloudTaskDay16(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay16 !== 'function') throw new Error('Function cloudTaskDay16 not found');\nif (cloudTaskDay16('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Relational Database Service (RDS) & Aurora Practice",
    aDesc: "Write an auxiliary helper function for Relational Database Service (RDS) & Aurora.",
    aStarter: "function cloudTaskDay16Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay16Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Simple Queue Service (SQS) & Decoupling",
    desc: "Implement standard and FIFO message queues, visibility timeouts, and Dead Letter Queues (DLQs).",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Simple Queue Service (SQS) & Decoupling.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Simple Queue Service (SQS) & Decoupling Validation",
    eDesc: "Implement a JavaScript validation function for Simple Queue Service (SQS) & Decoupling.",
    eStarter: "function cloudTaskDay17(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay17 !== 'function') throw new Error('Function cloudTaskDay17 not found');\nif (cloudTaskDay17('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Simple Queue Service (SQS) & Decoupling Practice",
    aDesc: "Write an auxiliary helper function for Simple Queue Service (SQS) & Decoupling.",
    aStarter: "function cloudTaskDay17Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay17Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Simple Notification Service (SNS) & Pub/Sub",
    desc: "Broadcast event notifications across multiple fan-out subscribers, SQS queues, and HTTP endpoints.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Simple Notification Service (SNS) & Pub/Sub.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Simple Notification Service (SNS) & Pub/Sub Validation",
    eDesc: "Implement a JavaScript validation function for Simple Notification Service (SNS) & Pub/Sub.",
    eStarter: "function cloudTaskDay18(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay18 !== 'function') throw new Error('Function cloudTaskDay18 not found');\nif (cloudTaskDay18('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Simple Notification Service (SNS) & Pub/Sub Practice",
    aDesc: "Write an auxiliary helper function for Simple Notification Service (SNS) & Pub/Sub.",
    aStarter: "function cloudTaskDay18Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay18Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS ECS & Fargate Serverless Containers",
    desc: "Deploy Docker containers on managed ECS task definitions, ECR registries, and Fargate compute.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS ECS & Fargate Serverless Containers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS ECS & Fargate Serverless Containers Validation",
    eDesc: "Implement a JavaScript validation function for AWS ECS & Fargate Serverless Containers.",
    eStarter: "function cloudTaskDay19(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay19 !== 'function') throw new Error('Function cloudTaskDay19 not found');\nif (cloudTaskDay19('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS ECS & Fargate Serverless Containers Practice",
    aDesc: "Write an auxiliary helper function for AWS ECS & Fargate Serverless Containers.",
    aStarter: "function cloudTaskDay19Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay19Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS EKS (Managed Kubernetes) Deployments",
    desc: "Manage Kubernetes pods, ingress controllers, cluster node groups, and Helm chart releases on AWS.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS EKS (Managed Kubernetes) Deployments.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS EKS (Managed Kubernetes) Deployments Validation",
    eDesc: "Implement a JavaScript validation function for AWS EKS (Managed Kubernetes) Deployments.",
    eStarter: "function cloudTaskDay20(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay20 !== 'function') throw new Error('Function cloudTaskDay20 not found');\nif (cloudTaskDay20('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS EKS (Managed Kubernetes) Deployments Practice",
    aDesc: "Write an auxiliary helper function for AWS EKS (Managed Kubernetes) Deployments.",
    aStarter: "function cloudTaskDay20Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay20Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS Step Functions & Distributed Sagas",
    desc: "Design visual state machines, retry policies, catch handlers, and distributed transaction orchestration.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS Step Functions & Distributed Sagas.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS Step Functions & Distributed Sagas Validation",
    eDesc: "Implement a JavaScript validation function for AWS Step Functions & Distributed Sagas.",
    eStarter: "function cloudTaskDay21(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay21 !== 'function') throw new Error('Function cloudTaskDay21 not found');\nif (cloudTaskDay21('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS Step Functions & Distributed Sagas Practice",
    aDesc: "Write an auxiliary helper function for AWS Step Functions & Distributed Sagas.",
    aStarter: "function cloudTaskDay21Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay21Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Lambda@Edge & CloudFront Functions",
    desc: "Execute lightweight code at edge locations for URL rewrites, A/B testing, and security headers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Lambda@Edge & CloudFront Functions.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Lambda@Edge & CloudFront Functions Validation",
    eDesc: "Implement a JavaScript validation function for Lambda@Edge & CloudFront Functions.",
    eStarter: "function cloudTaskDay22(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay22 !== 'function') throw new Error('Function cloudTaskDay22 not found');\nif (cloudTaskDay22('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Lambda@Edge & CloudFront Functions Practice",
    aDesc: "Write an auxiliary helper function for Lambda@Edge & CloudFront Functions.",
    aStarter: "function cloudTaskDay22Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay22Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS IAM Policy Evaluation Logic & Roles",
    desc: "Structure least-privilege IAM policies, condition keys, assume-role STS credentials, and boundaries.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS IAM Policy Evaluation Logic & Roles.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS IAM Policy Evaluation Logic & Roles Validation",
    eDesc: "Implement a JavaScript validation function for AWS IAM Policy Evaluation Logic & Roles.",
    eStarter: "function cloudTaskDay23(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay23 !== 'function') throw new Error('Function cloudTaskDay23 not found');\nif (cloudTaskDay23('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS IAM Policy Evaluation Logic & Roles Practice",
    aDesc: "Write an auxiliary helper function for AWS IAM Policy Evaluation Logic & Roles.",
    aStarter: "function cloudTaskDay23Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay23Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS KMS & Envelope Encryption",
    desc: "Manage Customer Managed Keys, envelope encryption, automated key rotation, and TLS certificates.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS KMS & Envelope Encryption.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS KMS & Envelope Encryption Validation",
    eDesc: "Implement a JavaScript validation function for AWS KMS & Envelope Encryption.",
    eStarter: "function cloudTaskDay24(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay24 !== 'function') throw new Error('Function cloudTaskDay24 not found');\nif (cloudTaskDay24('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS KMS & Envelope Encryption Practice",
    aDesc: "Write an auxiliary helper function for AWS KMS & Envelope Encryption.",
    aStarter: "function cloudTaskDay24Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay24Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS CloudWatch & Operational Metrics",
    desc: "Configure custom metrics, alarm notification actions, dashboard widgets, and composite alarms.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS CloudWatch & Operational Metrics.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS CloudWatch & Operational Metrics Validation",
    eDesc: "Implement a JavaScript validation function for AWS CloudWatch & Operational Metrics.",
    eStarter: "function cloudTaskDay25(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay25 !== 'function') throw new Error('Function cloudTaskDay25 not found');\nif (cloudTaskDay25('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS CloudWatch & Operational Metrics Practice",
    aDesc: "Write an auxiliary helper function for AWS CloudWatch & Operational Metrics.",
    aStarter: "function cloudTaskDay25Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay25Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS CloudTrail & Security Auditing",
    desc: "Track API activity across all AWS accounts, detect unauthorized role changes, and log event histories.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS CloudTrail & Security Auditing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS CloudTrail & Security Auditing Validation",
    eDesc: "Implement a JavaScript validation function for AWS CloudTrail & Security Auditing.",
    eStarter: "function cloudTaskDay26(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay26 !== 'function') throw new Error('Function cloudTaskDay26 not found');\nif (cloudTaskDay26('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS CloudTrail & Security Auditing Practice",
    aDesc: "Write an auxiliary helper function for AWS CloudTrail & Security Auditing.",
    aStarter: "function cloudTaskDay26Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay26Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS Systems Manager & Fleet Patching",
    desc: "Manage EC2 instances without SSH keys using Session Manager, patch baselines, and parameter store.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS Systems Manager & Fleet Patching.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS Systems Manager & Fleet Patching Validation",
    eDesc: "Implement a JavaScript validation function for AWS Systems Manager & Fleet Patching.",
    eStarter: "function cloudTaskDay27(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay27 !== 'function') throw new Error('Function cloudTaskDay27 not found');\nif (cloudTaskDay27('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS Systems Manager & Fleet Patching Practice",
    aDesc: "Write an auxiliary helper function for AWS Systems Manager & Fleet Patching.",
    aStarter: "function cloudTaskDay27Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay27Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Disaster Recovery & Multi-Region Failover",
    desc: "Implement active-passive pilot light, warm standby, and active-active multi-region architectures.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Disaster Recovery & Multi-Region Failover.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Disaster Recovery & Multi-Region Failover Validation",
    eDesc: "Implement a JavaScript validation function for Disaster Recovery & Multi-Region Failover.",
    eStarter: "function cloudTaskDay28(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay28 !== 'function') throw new Error('Function cloudTaskDay28 not found');\nif (cloudTaskDay28('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Disaster Recovery & Multi-Region Failover Practice",
    aDesc: "Write an auxiliary helper function for Disaster Recovery & Multi-Region Failover.",
    aStarter: "function cloudTaskDay28Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay28Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AWS Cost Optimization & FinOps",
    desc: "Utilize Savings Plans, Reserved Instances, S3 intelligent tiering, and Cost Explorer budgets.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AWS Cost Optimization & FinOps.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AWS Cost Optimization & FinOps Validation",
    eDesc: "Implement a JavaScript validation function for AWS Cost Optimization & FinOps.",
    eStarter: "function cloudTaskDay29(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay29 !== 'function') throw new Error('Function cloudTaskDay29 not found');\nif (cloudTaskDay29('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AWS Cost Optimization & FinOps Practice",
    aDesc: "Write an auxiliary helper function for AWS Cost Optimization & FinOps.",
    aStarter: "function cloudTaskDay29Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay29Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Capstone: Multi-Tier High-Availability Cloud Architecture",
    desc: "Architect a resilient enterprise platform with VPC peering, auto-scaling Fargate, and global caching.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Capstone: Multi-Tier High-Availability Cloud Architecture.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Capstone: Multi-Tier High-Availability Cloud Architecture Validation",
    eDesc: "Implement a JavaScript validation function for Capstone: Multi-Tier High-Availability Cloud Architecture.",
    eStarter: "function cloudTaskDay30(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cloudTaskDay30 !== 'function') throw new Error('Function cloudTaskDay30 not found');\nif (cloudTaskDay30('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Capstone: Multi-Tier High-Availability Cloud Architecture Practice",
    aDesc: "Write an auxiliary helper function for Capstone: Multi-Tier High-Availability Cloud Architecture.",
    aStarter: "function cloudTaskDay30Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cloudTaskDay30Aux !== 'function') throw new Error('Auxiliary function not found');"
  }
];

export const CLOUD_30_DAYS_QUESTS = CLOUD_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('cloud', i + 1, cfg)
);
