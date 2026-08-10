import { COURSES_REGISTRY } from './coursesData';

export interface GateRequirements {
  minCourseCompletionPct: number;
  minCommunicationScore?: number;
  minDsaScore?: number;
  minAtsScore?: number;
  requireProjectVerification?: boolean;
}

export interface TrajectoryNode {
  nodeId: string;
  courseId: string;
  title: string;
  shortDesc: string;
  icon: string;
  skillsLearned: string[];
  careerImpact: string; // e.g. "+8% Job Readiness"
  estimatedDays: number;
  gate?: GateRequirements;
}

export interface CareerTrajectory {
  roleId: string;
  roleTitle: string;
  icon: string;
  description: string;
  averageSalaryRange: string;
  targetTotalDays: number;
  recommendationReason?: string;
  nodes: TrajectoryNode[];
}

export const CANONICAL_TRAJECTORIES: Record<string, CareerTrajectory> = {
  'fullstack-developer': {
    roleId: 'fullstack-developer',
    roleTitle: 'Full-Stack Software Developer',
    icon: '💻',
    description: 'Master end-to-end web applications, frontend state, backend APIs, and database engineering.',
    averageSalaryRange: '₹8–18 LPA',
    targetTotalDays: 120,
    nodes: [
      {
        nodeId: 'node-js-base',
        courseId: 'course-fullstack-js',
        title: 'Full-Stack JavaScript & Node.js',
        shortDesc: 'ES6+ syntax, async event loops, Express APIs, and REST endpoints',
        icon: '⚡',
        skillsLearned: ['JavaScript ES6+', 'Node.js', 'Express', 'Async/Await'],
        careerImpact: '+12% Job Readiness',
        estimatedDays: 30
      },
      {
        nodeId: 'node-dsa-base',
        courseId: 'course-dsa-optim',
        title: 'Data Structures & Algorithms',
        shortDesc: 'Optimize space-time complexity, arrays, trees & dynamic programming',
        icon: '🔢',
        skillsLearned: ['Arrays', 'Linked Lists', 'Stacks/Queues', 'Big-O'],
        careerImpact: '+18% Interview Mastery',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minDsaScore: 70
        }
      },
      {
        nodeId: 'node-db-base',
        courseId: 'course-database-eng',
        title: 'Database Engineering',
        shortDesc: 'Relational SQL queries, indexing, and transaction safety',
        icon: '💾',
        skillsLearned: ['PostgreSQL', 'SQL Joins', 'Indexes', 'ACID Transactions'],
        careerImpact: '+15% Backend Competency',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minCommunicationScore: 65
        }
      },
      {
        nodeId: 'node-react-base',
        courseId: 'course-react-web',
        title: 'Full-Stack React & Next.js',
        shortDesc: 'JSX, custom hooks, server-side rendering, and production deployments',
        icon: '⚛️',
        skillsLearned: ['React 18', 'Next.js', 'State Hooks', 'REST Consumption'],
        careerImpact: '+25% Full-Stack Capability',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 80,
          requireProjectVerification: true
        }
      }
    ]
  },
  'python-basic-to-advance': {
    roleId: 'python-basic-to-advance',
    roleTitle: 'Python Software Engineer (Basic to Advance)',
    icon: '🐍',
    description: 'Ultra-beginner to pro mastery roadmap covering Python fundamentals, OOP, Data Structures, and production Backend APIs.',
    averageSalaryRange: '₹10–24 LPA',
    targetTotalDays: 120,
    nodes: [
      {
        nodeId: 'node-py-foundation',
        courseId: 'course-python-backend',
        title: 'Python Foundations & Core Logic',
        shortDesc: 'Variables, data types, loops, functions, lists, dicts, and basic input/output',
        icon: '🐍',
        skillsLearned: ['Python 3.12', 'Variables & Control Flow', 'Functions & Scope', 'Lists & Dictionaries'],
        careerImpact: '+20% Python Core Competency',
        estimatedDays: 30
      },
      {
        nodeId: 'node-py-oop',
        courseId: 'course-python-backend',
        title: 'Advanced Python & Object-Oriented Programming',
        shortDesc: 'Classes, inheritance, encapsulation, module packaging, decorators, and file I/O',
        icon: '⚡',
        skillsLearned: ['Classes & OOP', 'Decorators & Generators', 'Exception Handling', 'File I/O'],
        careerImpact: '+25% Software Engineering Foundations',
        estimatedDays: 30
      },
      {
        nodeId: 'node-py-dsa',
        courseId: 'course-dsa-optim',
        title: 'Data Structures & Algorithmic Problem Solving',
        shortDesc: 'Big-O complexity, recursion, hash tables, stacks, queues, and searching/sorting',
        icon: '🔢',
        skillsLearned: ['Big-O Analysis', 'Hash Tables & Trees', 'Sorting & Searching', 'Memory Tuning'],
        careerImpact: '+25% Algorithmic Power',
        estimatedDays: 30
      },
      {
        nodeId: 'node-py-pro',
        courseId: 'course-python-backend',
        title: 'Python Backend APIs & System Architecture',
        shortDesc: 'FastAPI, AsyncIO, RESTful interfaces, database integration, and Docker containerization',
        icon: '🚀',
        skillsLearned: ['FastAPI', 'AsyncIO', 'PostgreSQL/Redis', 'Docker Containers'],
        careerImpact: '+30% Pro Systems Mastery',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          requireProjectVerification: true,
          minAtsScore: 80
        }
      }
    ]
  },
  'iot-embedded-engineer': {
    roleId: 'iot-embedded-engineer',
    roleTitle: 'IoT & Embedded Systems Engineer (Basic to Advance)',
    icon: '🔌',
    description: 'Ultra-beginner to pro mastery roadmap covering Microcontrollers, Circuit Design, IoT Wireless Networks, TinyML Edge AI, and Firmware Security.',
    averageSalaryRange: '₹9–22 LPA',
    targetTotalDays: 120,
    nodes: [
      {
        nodeId: 'node-iot-foundation',
        courseId: 'course-iot-embedded',
        title: 'IoT & Embedded Hardware Foundations',
        shortDesc: 'Microcontrollers (ESP32/Arduino), C/C++ Embedded syntax, GPIO pins, and sensor I/O',
        icon: '🔌',
        skillsLearned: ['Embedded C/C++', 'ESP32/Arduino', 'GPIO Pin Control', 'Sensor Interfacing'],
        careerImpact: '+20% Hardware Core',
        estimatedDays: 30
      },
      {
        nodeId: 'node-iot-net',
        courseId: 'course-iot-network',
        title: 'IoT Industrial Networks & Wireless Protocols',
        shortDesc: 'MQTT, Modbus, Zigbee, LoRaWAN, SPI/I2C/UART bus architectures, and cloud telemetry',
        icon: '🌐',
        skillsLearned: ['MQTT/Modbus', 'SPI/I2C Protocols', 'LoRaWAN', 'Cloud Telemetry'],
        careerImpact: '+25% Network Architecture',
        estimatedDays: 30
      },
      {
        nodeId: 'node-iot-edge',
        courseId: 'course-iot-edge-ai',
        title: 'IoT Edge AI & TinyML Optimization',
        shortDesc: 'On-device neural networks, MicroTVM, sensor data signal processing, and low-power tuning',
        icon: '🧠',
        skillsLearned: ['TinyML', 'MicroTVM', 'On-Device ML', 'Power Optimization'],
        careerImpact: '+25% Edge AI Power',
        estimatedDays: 30
      },
      {
        nodeId: 'node-iot-sec',
        courseId: 'course-iot-security',
        title: 'IoT Firmware & Hardware Security Capstone',
        shortDesc: 'Secure Boot, cryptographic co-processors, hardware security audits, and production capstone',
        icon: '🛡️',
        skillsLearned: ['Secure Boot', 'Hardware Crypto', 'Firmware Audits', 'Production Capstone'],
        careerImpact: '+30% Pro Hardware Mastery',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          requireProjectVerification: true,
          minAtsScore: 80
        }
      }
    ]
  },
  'ai-llm-engineer': {
    roleId: 'ai-llm-engineer',
    roleTitle: 'AI & LLM Systems Engineer',
    icon: '🤖',
    description: 'Build agentic AI workflows, RAG pipelines, vector search engines, and custom LLM integrations.',
    averageSalaryRange: '₹12–25 LPA',
    targetTotalDays: 120,
    nodes: [
      {
        nodeId: 'node-ai-py',
        courseId: 'course-python-backend',
        title: 'Python Foundations & AI Prerequisites',
        shortDesc: 'Core Python syntax, data structures, and environment setup',
        icon: '🐍',
        skillsLearned: ['Python 3.12', 'Data Structures', 'Data Parsing', 'Environment Config'],
        careerImpact: '+14% Core AI Readiness',
        estimatedDays: 30
      },
      {
        nodeId: 'node-ai-dsa',
        courseId: 'course-dsa-optim',
        title: 'Data Structures & Vector Math',
        shortDesc: 'Hash tables, matrix math, graph algorithms, and space optimizations',
        icon: '🔢',
        skillsLearned: ['Vector Embeddings', 'Graph Traversal', 'Hash Maps', 'Memory Tuning'],
        careerImpact: '+20% Algorithmic Power',
        estimatedDays: 30
      },
      {
        nodeId: 'node-ai-eng',
        courseId: 'course-ai-eng',
        title: 'AI Engineering & LLM Integration',
        shortDesc: 'RAG pipelines, vector databases, prompt engineering, and agent tools',
        icon: '🤖',
        skillsLearned: ['LangChain/LlamaIndex', 'Pinecone/pgvector', 'Prompt System', 'Agents'],
        careerImpact: '+35% AI Specialization',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          requireProjectVerification: true,
          minAtsScore: 80
        }
      }
    ]
  },
  'software-engineer': {
    roleId: 'software-engineer',
    roleTitle: 'Software Development Engineer (SDE)',
    icon: '💻',
    description: 'Master core object-oriented software design, data structures, and production code architecture.',
    averageSalaryRange: '₹10–22 LPA',
    targetTotalDays: 120,
    nodes: [
      {
        nodeId: 'node-sde-java',
        courseId: 'course-java-logic',
        title: 'Java Core & Object-Oriented Design',
        shortDesc: 'Encapsulation, inheritance, interface contracts, and memory management',
        icon: '☕',
        skillsLearned: ['Java 21', 'OOP Pillars', 'Memory Stack/Heap', 'Exception Handling'],
        careerImpact: '+15% System Logic',
        estimatedDays: 30
      },
      {
        nodeId: 'node-sde-dsa',
        courseId: 'course-dsa-optim',
        title: 'Data Structures & Algorithms',
        shortDesc: 'LeetCode problem-solving, Big-O complexity, and trees/graphs',
        icon: '🔢',
        skillsLearned: ['Binary Trees', 'Dynamic Programming', 'Graph Search', 'Complexity Analysis'],
        careerImpact: '+25% Coding Interview Readiness',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minDsaScore: 75
        }
      },
      {
        nodeId: 'node-sde-db',
        courseId: 'course-database-eng',
        title: 'Database Systems & SQL',
        shortDesc: 'Relational data models, indexing strategies, and query tuning',
        icon: '💾',
        skillsLearned: ['SQL Execution', 'Index B-Trees', 'Transactions', 'ORMs'],
        careerImpact: '+15% Database Architecture',
        estimatedDays: 30
      },
      {
        nodeId: 'node-sde-dist',
        courseId: 'course-distributed-sys',
        title: 'High-Scale Distributed Systems',
        shortDesc: 'Microservices, message queues, caching layers, and system design',
        icon: '🌐',
        skillsLearned: ['Kafka/RabbitMQ', 'Redis Cache', 'Load Balancers', 'CAP Theorem'],
        careerImpact: '+25% Senior SDE Capability',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minCommunicationScore: 70,
          minAtsScore: 85
        }
      }
    ]
  },
  'devops-engineer': {
    roleId: 'devops-engineer',
    roleTitle: 'DevOps & Pipeline Automation Engineer',
    icon: '🚀',
    description: 'Automate CI/CD pipelines, Docker containerization, Kubernetes clusters, and cloud infrastructure.',
    averageSalaryRange: '₹9–20 LPA',
    targetTotalDays: 120,
    nodes: [
      {
        nodeId: 'node-devops-dock',
        courseId: 'course-devops-cicd',
        title: 'Docker & CI/CD Pipelines',
        shortDesc: 'Containers, GitHub Actions runners, automated testing, and deployments',
        icon: '🐳',
        skillsLearned: ['Dockerfiles', 'GitHub Actions', 'YAML Workflows', 'Artifact Handling'],
        careerImpact: '+20% DevOps Foundation',
        estimatedDays: 30
      },
      {
        nodeId: 'node-devops-cloud',
        courseId: 'course-cloud-native',
        title: 'Cloud Native Architectures (AWS)',
        shortDesc: 'EC2 clusters, S3 buckets, IAM policies, and VPC networking',
        icon: '☁️',
        skillsLearned: ['AWS EC2', 'S3 Storage', 'VPC Networking', 'IAM Security'],
        careerImpact: '+25% Cloud Engineering',
        estimatedDays: 30
      },
      {
        nodeId: 'node-devops-py',
        courseId: 'course-python-backend',
        title: 'Infrastructure Automation with Python',
        shortDesc: 'Scripting infrastructure provisioners, API bots, and CLI tools',
        icon: '🐍',
        skillsLearned: ['Boto3', 'CLI Tooling', 'System Scripting', 'API Integration'],
        careerImpact: '+15% Automation Mastery',
        estimatedDays: 30
      }
    ]
  },
  'cloud-engineer': {
    roleId: 'cloud-engineer',
    roleTitle: 'Cloud Architect & Infrastructure Specialist',
    icon: '☁️',
    description: 'Design resilient, scalable cloud architectures on Amazon Web Services & microservice routers.',
    averageSalaryRange: '₹10–22 LPA',
    targetTotalDays: 120,
    nodes: [
      {
        nodeId: 'node-cloud-aws',
        courseId: 'course-cloud-native',
        title: 'AWS Cloud Fundamentals & VPC',
        shortDesc: 'Cloud computing paradigms, compute instances, storage, and networking',
        icon: '☁️',
        skillsLearned: ['AWS Architecture', 'Cloud Security', 'Serverless Lambda', 'API Gateways'],
        careerImpact: '+25% Cloud Foundation',
        estimatedDays: 30
      },
      {
        nodeId: 'node-cloud-devops',
        courseId: 'course-devops-cicd',
        title: 'Infrastructure as Code & CI/CD',
        shortDesc: 'Automated deployment pipelines, container orchestration, and telemetry',
        icon: '🚀',
        skillsLearned: ['Terraform Basics', 'Kubernetes Pods', 'CI/CD Automation', 'Docker Packaging'],
        careerImpact: '+25% Infrastructure Automation',
        estimatedDays: 30
      },
      {
        nodeId: 'node-cloud-dist',
        courseId: 'course-distributed-sys',
        title: 'Distributed System Resiliency',
        shortDesc: 'Fault tolerance, auto-scaling groups, CDN caching, and high availability',
        icon: '🌐',
        skillsLearned: ['Auto Scaling', 'Multi-Region Deployments', 'CDN Edge Caching', 'Failover Protocols'],
        careerImpact: '+30% Cloud Architect Seniority',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 80,
          requireProjectVerification: true
        }
      }
    ]
  },
  'digital-accountant': {
    roleId: 'digital-accountant',
    roleTitle: 'Digital Accountant & Taxation Specialist',
    icon: '📊',
    description: 'Master business accounting fundamentals, double-entry bookkeeping, Tally Prime ERP, GST, Payroll, Income Tax, and Cloud AI automation.',
    averageSalaryRange: '₹4.5–12 LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-acc-base',
        courseId: 'course-digital-accounting',
        title: 'Digital Accounting & Taxation Mastery',
        shortDesc: 'Complete 30-day curriculum: Journal, Ledger, Financial Statements, Tally Prime, GST, Payroll & Tax',
        icon: '📊',
        skillsLearned: ['Double-Entry Bookkeeping', 'Tally Prime ERP', 'GST Returns', 'Payroll TDS', 'Income Tax'],
        careerImpact: '+35% Industry Employability',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  },
  'financial-analyst': {
    roleId: 'financial-analyst',
    roleTitle: 'Financial Analyst & Investment Specialist',
    icon: '📈',
    description: 'Master business financial management, time value of money, cash budgeting, cost management, corporate finance, investment planning, and FinTech.',
    averageSalaryRange: '₹5.5–15 LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-fin-base',
        courseId: 'course-finance-investment',
        title: 'Business Finance & Investment Mastery',
        shortDesc: 'Complete 30-day curriculum: Financial Statements, TVM, Cash Budgeting, Capital Budgeting, Portfolio & FinTech',
        icon: '📈',
        skillsLearned: ['Financial Planning', 'Time Value of Money', 'Cash Budgeting', 'Break-Even Analysis', 'Portfolio Management'],
        careerImpact: '+35% Investment & Valuation Competency',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  },
  'business-analytics-specialist': {
    roleId: 'business-analytics-specialist',
    roleTitle: 'Business Analytics & Decision Intelligence Specialist',
    icon: '📊',
    description: 'Master business data literacy, Excel analytics, data visualization, Power BI, SQL querying, KPI performance tracking, and AI decision intelligence.',
    averageSalaryRange: '₹6–16 LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-analytics-base',
        courseId: 'course-business-analytics',
        title: 'Business Analytics & BI Mastery',
        shortDesc: 'Complete 30-day curriculum: Spreadsheet Analytics, Power BI Dashboards, SQL Querying, KPIs & Decision Intelligence',
        icon: '📊',
        skillsLearned: ['Excel Analytics', 'Data Visualization', 'Power BI', 'SQL Querying', 'KPI Monitoring', 'AI Analytics'],
        careerImpact: '+40% Decision Intelligence Capability',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  },
  'marketing-brand-manager': {
    roleId: 'marketing-brand-manager',
    roleTitle: 'Marketing & Brand Manager',
    icon: '🎯',
    description: 'Master customer research, market segmentation, target selection, brand identity systems, product management, pricing models, distribution channels, campaign strategy, and AI in marketing.',
    averageSalaryRange: '₹6–18 LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-mkt-base',
        courseId: 'course-marketing-branding',
        title: 'Marketing & Brand Management Mastery',
        shortDesc: 'Complete 30-day curriculum: Consumer Insights, STP Framework, Product Strategy, Pricing, Distribution, IMC Campaigns & AI Marketing',
        icon: '🎯',
        skillsLearned: ['Customer Research', 'Market Segmentation', 'Brand Development', 'Pricing Strategy', 'Campaign Planning', 'AI Marketing'],
        careerImpact: '+45% Strategic Brand Building Competency',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  },
  'digital-growth-marketer': {
    roleId: 'digital-growth-marketer',
    roleTitle: 'Digital Marketing & Growth Strategist',
    icon: '🚀',
    description: 'Master digital acquisition funnels, search engine optimization (SEO), performance paid ads, content strategy, email automation, CRO analytics, growth hacking, and AI-driven marketing execution.',
    averageSalaryRange: '₹7–20 LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-dmkt-base',
        courseId: 'course-digital-marketing',
        title: 'Digital Marketing & Growth Strategy Mastery',
        shortDesc: 'Complete 30-day curriculum: Marketing Funnels, SEO, Paid Ads, Email Automation, Analytics CRO, Growth Hacking & AI Tools',
        icon: '🚀',
        skillsLearned: ['SEO Optimization', 'Paid Performance Ads', 'Email Automation', 'Conversion Rate Optimization', 'Growth Hacking', 'AI Marketing'],
        careerImpact: '+50% Digital Growth Execution Capability',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  },
  'ecommerce-growth-manager': {
    roleId: 'ecommerce-growth-manager',
    roleTitle: 'E-Commerce & Digital Business Specialist',
    icon: '🛒',
    description: 'Master digital business models, product catalog management, pricing strategies, online store UX, payment systems (UPI/COD), warehousing logistics, customer experience, e-commerce analytics, and AI commerce.',
    averageSalaryRange: '₹7–22 LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-ecom-base',
        courseId: 'course-ecommerce-digital-biz',
        title: 'E-Commerce & Digital Business Mastery',
        shortDesc: 'Complete 30-day curriculum: Business Models, Catalogs, Store UX, Payment Gateways, Logistics, CX, Unit Economics & AI Commerce',
        icon: '🛒',
        skillsLearned: ['E-Commerce Strategy', 'Product Management', 'Digital Payments', 'Logistics Fulfillment', 'Conversion Analytics', 'AI Commerce'],
        careerImpact: '+55% E-Commerce Operations & Growth Capability',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  },
  'entrepreneur-business-manager': {
    roleId: 'entrepreneur-business-manager',
    roleTitle: 'Entrepreneur & Business Manager',
    icon: '💡',
    description: 'Master business opportunity identification, Business Model Canvas (BMC), strategic planning, operations management, startup finance & break-even analysis, leadership, innovation, risk management, and AI-driven business scaling.',
    averageSalaryRange: '₹8–30+ LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-ent-base',
        courseId: 'course-entrepreneurship-biz-mgmt',
        title: 'Entrepreneurship & Business Management Mastery',
        shortDesc: 'Complete 30-day curriculum: BMC Design, Strategic Planning, Operations, Startup Finance, Leadership, Risk Management & AI Growth',
        icon: '💡',
        skillsLearned: ['Opportunity Identification', 'Business Model Canvas', 'Strategic Planning', 'Startup Finance', 'Leadership', 'AI Business Management'],
        careerImpact: '+60% Venture Creation & Management Capability',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  },
  'sales-customer-success-manager': {
    roleId: 'sales-customer-success-manager',
    roleTitle: 'Sales, Customer Success & CRM Specialist',
    icon: '🤝',
    description: 'Master modern consultative selling, BANT lead qualification, active listening, LAER objection handling, win-win negotiation, customer onboarding, CRM database management, sales velocity analytics, Key Account Management (KAM), and AI sales automation.',
    averageSalaryRange: '₹6–24 LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-scrm-base',
        courseId: 'course-sales-crm-success',
        title: 'Sales, Customer Success & CRM Mastery',
        shortDesc: 'Complete 30-day curriculum: Lead Prospecting, BANT Qualification, Negotiation, Onboarding, CRM Setup, Sales Velocity & AI Automation',
        icon: '🤝',
        skillsLearned: ['Consultative Selling', 'Objection Handling (LAER)', 'Customer Success', 'CRM Management', 'Sales Velocity Analytics', 'AI Sales Automation'],
        careerImpact: '+55% Revenue Generation & Account Retention Capability',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  },
  'operations-supplychain-manager': {
    roleId: 'operations-supplychain-manager',
    roleTitle: 'Operations, Supply Chain & Compliance Specialist',
    icon: '⚙️',
    description: 'Master business process mapping, procurement workflows, inventory control (EOQ/ROP), supply chain logistics, capacity planning, Lean/Six Sigma, quality management (QA/QC/CAPA), statutory compliance, ERP systems, and AI-driven operations.',
    averageSalaryRange: '₹7–25 LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-ops-base',
        courseId: 'course-operations-supplychain-compliance',
        title: 'Operations, Supply Chain & Business Compliance Mastery',
        shortDesc: 'Complete 30-day curriculum: Process Mapping, EOQ Inventory, Logistics, Lean 5S, ISO Quality, Statutory Compliance, ERP & AI Operations',
        icon: '⚙️',
        skillsLearned: ['Process Mapping', 'Procurement & Inventory (EOQ/ROP)', 'Logistics Management', 'Lean & Six Sigma', 'Business Compliance', 'ERP & AI Operations'],
        careerImpact: '+60% Operational Throughput & Supply Chain Efficiency',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  },
  'ai-digital-transformation-leader': {
    roleId: 'ai-digital-transformation-leader',
    roleTitle: 'AI & Digital Transformation Business Specialist',
    icon: '🤖',
    description: 'Master AI business literacy, prompt engineering, functional AI (Finance, HR, Marketing, Ops), business intelligence, Robotic Process Automation (RPA), enterprise cloud systems, AI governance/ethics/security, and AI leadership.',
    averageSalaryRange: '₹8–28 LPA',
    targetTotalDays: 30,
    nodes: [
      {
        nodeId: 'node-ait-base',
        courseId: 'course-ai-digital-transformation',
        title: 'AI & Digital Transformation for Business Mastery',
        shortDesc: 'Complete 30-day curriculum: AI Literacy, Prompt Engineering, Functional AI, BI Dashboards, RPA Automation, Governance & Leadership',
        icon: '🤖',
        skillsLearned: ['AI Literacy', 'Prompt Engineering', 'RPA Process Automation', 'Business Intelligence', 'AI Governance', 'Digital Transformation Leadership'],
        careerImpact: '+65% Productivity & Enterprise AI Transformation Capability',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          minAtsScore: 85,
          requireProjectVerification: true
        }
      }
    ]
  }
};

/**
 * Intelligent AI Trajectory Resolver
 * Merges user goal + QT1 (Technical Foundation) + QT2 (Mindset Archetype)
 */
export function recommendCareerTrajectory(
  userGoal?: string,
  qt1Score: number = 70,
  qt2Score: number = 75,
  archetype: string = 'Pattern Hunter'
): CareerTrajectory {
  const goalClean = (userGoal || '').toLowerCase().trim();

  // Direct match if goal is specified — Check ML specifically FIRST
  if (
    goalClean === 'ml' || 
    goalClean === 'machine learning' || 
    goalClean.includes('machine learning') || 
    goalClean.includes('python to ml') || 
    goalClean.includes('python ml') ||
    goalClean === 'ai/ml' ||
    goalClean === 'ml and ai' ||
    goalClean === 'ai and ml'
  ) {
    return {
      roleId: 'python-ml-engineer',
      roleTitle: 'Machine Learning Engineer (Python to ML)',
      icon: '🧠',
      description: 'Master Python fundamentals, NumPy/Pandas data manipulation, PyTorch neural networks, and Machine Learning model deployment.',
      averageSalaryRange: '₹12–26 LPA',
      targetTotalDays: 120,
      recommendationReason: 'Matched goal "ML": Full Python-to-Machine-Learning Pipeline (Python Core ➔ Vector Data Math ➔ Neural Networks & PyTorch ML ➔ Model Deployment).',
      nodes: [
        {
          nodeId: 'node-py-base',
          courseId: 'course-python-backend',
          title: 'Python Foundations & Data Structures',
          shortDesc: 'Variables, loops, functions, lists, dicts, OOP, and data processing',
          icon: '🐍',
          skillsLearned: ['Python 3.12', 'Functions & Lambdas', 'Lists & Dicts', 'AsyncIO'],
          careerImpact: '+20% Python Core Competency',
          estimatedDays: 30
        },
        {
          nodeId: 'node-ml-math',
          courseId: 'course-dsa-optim',
          title: 'NumPy, Vector Math & Data Structures',
          shortDesc: 'Matrix operations, vector math, memory tuning, and array algorithms',
          icon: '🔢',
          skillsLearned: ['Vector Embeddings', 'Matrix Multiplication', 'NumPy Arrays', 'Big-O'],
          careerImpact: '+25% Machine Learning Foundations',
          estimatedDays: 30
        },
        {
          nodeId: 'node-ml-core',
          courseId: 'course-ai-eng',
          title: 'Machine Learning, Neural Networks & PyTorch',
          shortDesc: 'Supervised/unsupervised learning, PyTorch models, evaluation, and LLM integration',
          icon: '🧠',
          skillsLearned: ['PyTorch', 'Neural Networks', 'Model Evaluation', 'LLMs & RAG'],
          careerImpact: '+40% ML Engineer Mastery',
          estimatedDays: 30,
          gate: {
            minCourseCompletionPct: 100,
            requireProjectVerification: true,
            minAtsScore: 85
          }
        }
      ]
    };
  }

  if (
    goalClean === 'python' ||
    goalClean === 'basic python' ||
    goalClean.includes('basic python') ||
    goalClean.includes('python basic') ||
    goalClean.includes('python to advance') ||
    goalClean.includes('python to advanced') ||
    goalClean.includes('python from scratch') ||
    goalClean.includes('python zero to hero') ||
    goalClean.includes('python complete') ||
    goalClean === 'python programming' ||
    goalClean === 'learn python'
  ) {
    return {
      ...CANONICAL_TRAJECTORIES['python-basic-to-advance'],
      recommendationReason: `Matched goal "${userGoal}": Zero-to-Pro Python Pipeline (Foundations ➔ OOP ➔ Data Structures ➔ Backend APIs).`
    };
  }

  if (
    goalClean.includes('iot') ||
    goalClean.includes('embedded') ||
    goalClean.includes('hardware') ||
    goalClean.includes('microcontroller') ||
    goalClean.includes('arduino') ||
    goalClean.includes('esp32') ||
    goalClean.includes('robotics') ||
    goalClean.includes('tinyml') ||
    goalClean.includes('firmware') ||
    goalClean.includes('circuit')
  ) {
    return {
      ...CANONICAL_TRAJECTORIES['iot-embedded-engineer'],
      recommendationReason: `Matched goal "${userGoal}": Zero-to-Pro IoT & Hardware Systems Pipeline (Foundations ➔ Wireless Networks ➔ Edge AI ➔ Firmware Security).`
    };
  }

  if (
    goalClean.includes('ai') || 
    goalClean.includes('llm') || 
    goalClean.includes('deep learning') || 
    goalClean.includes('neural') || 
    goalClean.includes('ai eng')
  ) {
    return { ...CANONICAL_TRAJECTORIES['ai-llm-engineer'], recommendationReason: 'Matched your goal to AI & LLM Systems Engineering (Python, Neural Networks, PyTorch & LLM Integration).' };
  }

  // Fused Goals (e.g. "python+business" or "ai+business")
  if ((goalClean.includes('python') || goalClean.includes('ai') || goalClean.includes('ml')) && (goalClean.includes('business') || goalClean.includes('analytics') || goalClean.includes('management'))) {
    return {
      roleId: 'fused-python-business-leader',
      roleTitle: 'Python AI & Business Intelligence Strategist',
      icon: '🧠',
      description: 'Combines Python AI development with strategic Business Intelligence analysis.',
      averageSalaryRange: '$110,000 - $175,000',
      targetTotalDays: 90,
      recommendationReason: 'Fused Goal Active: Dynamically combined Python AI Engineering with Business Intelligence & Analytics.',
      nodes: [
        CANONICAL_TRAJECTORIES['ai-llm-engineer'].nodes[0], // Stage 1: AI & LLM Systems (Python)
        CANONICAL_TRAJECTORIES['business-analytics-specialist'].nodes[0], // Stage 2: Business Analytics & Decision Intelligence
        CANONICAL_TRAJECTORIES['ai-digital-transformation-leader'].nodes[0] // Stage 3: AI Transformation Leadership
      ]
    };
  }

  // ── 1. JAVA ZERO-TO-PRO ──
  if (goalClean.includes('java') && !goalClean.includes('javascript')) {
    return {
      roleId: 'java-basic-to-advance',
      roleTitle: 'Java Enterprise Engineer (Basic to Advance)',
      icon: '☕',
      description: 'Ultra-beginner to pro mastery roadmap covering Java syntax, OOP pillars, Data Structures, Spring Boot, and Microservices.',
      averageSalaryRange: '₹10–22 LPA',
      targetTotalDays: 120,
      recommendationReason: `Matched goal "${userGoal}": Zero-to-Pro Java Pipeline (Foundations ➔ OOP ➔ Data Structures ➔ Enterprise Backend).`,
      nodes: [
        { nodeId: 'j1', courseId: 'course-java-logic', title: 'Java Foundations & Basic Syntax', shortDesc: 'Variables, data types, operators, loops, arrays, and methods', icon: '☕', skillsLearned: ['Java 21', 'Basic Syntax', 'Control Flow', 'Methods'], careerImpact: '+20% Java Core', estimatedDays: 30 },
        { nodeId: 'j2', courseId: 'course-java-logic', title: 'Object-Oriented Java & Exception Handling', shortDesc: 'Classes, encapsulation, inheritance, polymorphism, and try-catch', icon: '⚡', skillsLearned: ['OOP Pillars', 'Interfaces', 'Exceptions', 'Collections'], careerImpact: '+25% OOP Mastery', estimatedDays: 30 },
        { nodeId: 'j3', courseId: 'course-dsa-optim', title: 'Data Structures & Algorithmic Logic', shortDesc: 'LinkedLists, Trees, HashMaps, recursion, and Big-O efficiency', icon: '🔢', skillsLearned: ['Data Structures', 'Recursion', 'Sorting', 'Big-O'], careerImpact: '+25% Algorithmic Power', estimatedDays: 30 },
        { nodeId: 'j4', courseId: 'course-java-logic', title: 'Enterprise Java & System Architecture', shortDesc: 'Spring Boot, REST APIs, JPA/Hibernate, and Microservices', icon: '🚀', skillsLearned: ['Spring Boot', 'REST APIs', 'SQL/JPA', 'Microservices'], careerImpact: '+30% Enterprise Systems', estimatedDays: 30 }
      ]
    };
  }

  // ── 2. REACT & WEB ZERO-TO-PRO ──
  if (goalClean.includes('react') || goalClean.includes('frontend') || goalClean.includes('web dev')) {
    return {
      roleId: 'react-basic-to-advance',
      roleTitle: 'React & Web Developer (Basic to Advance)',
      icon: '⚛️',
      description: 'Ultra-beginner to pro mastery roadmap covering HTML/CSS/JS, React Components, Next.js, and Full-Stack APIs.',
      averageSalaryRange: '₹8–20 LPA',
      targetTotalDays: 120,
      recommendationReason: `Matched goal "${userGoal}": Zero-to-Pro React Web Pipeline (Web Basics ➔ React Components ➔ Next.js ➔ Full-Stack Web).`,
      nodes: [
        { nodeId: 'r1', courseId: 'course-react-web', title: 'HTML, CSS & JavaScript Foundations', shortDesc: 'DOM manipulation, ES6+ syntax, async fetch, and responsive layouts', icon: '🌐', skillsLearned: ['HTML5/CSS3', 'JavaScript ES6+', 'DOM API', 'Fetch API'], careerImpact: '+20% Web Core', estimatedDays: 30 },
        { nodeId: 'r2', courseId: 'course-react-web', title: 'React Core Components & State Management', shortDesc: 'JSX, useState, useEffect, props, custom hooks, and context API', icon: '⚛️', skillsLearned: ['React Hooks', 'State & Props', 'Component Architecture', 'Context API'], careerImpact: '+25% React Mastery', estimatedDays: 30 },
        { nodeId: 'r3', courseId: 'course-fullstack-js', title: 'Next.js, Server Components & Routing', shortDesc: 'App router, SSR/SSG prerendering, API routes, and Tailwind styling', icon: '⚡', skillsLearned: ['Next.js 14', 'App Router', 'Server Actions', 'API Routes'], careerImpact: '+25% Next.js Power', estimatedDays: 30 },
        { nodeId: 'r4', courseId: 'course-fullstack-js', title: 'High-Performance Full-Stack Web Architecture', shortDesc: 'Node.js Express backend, database ORMs, authentication, and Vercel deployment', icon: '🚀', skillsLearned: ['Node.js/Express', 'PostgreSQL/Prisma', 'JWT Auth', 'Vercel Deployment'], careerImpact: '+30% Full-Stack Pro', estimatedDays: 30 }
      ]
    };
  }

  // ── 3. EXCEL & DATA ANALYTICS ZERO-TO-PRO ──
  if (goalClean.includes('excel') || goalClean.includes('data analytics') || goalClean.includes('power bi')) {
    return {
      roleId: 'excel-basic-to-advance',
      roleTitle: 'Excel & Business Data Specialist (Basic to Advance)',
      icon: '📊',
      description: 'Ultra-beginner to pro mastery roadmap covering Excel formulas, XLOOKUP, Pivot Tables, Power BI, and executive dashboards.',
      averageSalaryRange: '₹6–16 LPA',
      targetTotalDays: 120,
      recommendationReason: `Matched goal "${userGoal}": Zero-to-Pro Excel Pipeline (Grid Mechanics ➔ Lookups & Logic ➔ Pivot Tables ➔ Dashboards).`,
      nodes: [
        { nodeId: 'e1', courseId: 'course-excel-data-viz', title: 'Excel Grid Mechanics & Math Formulas', shortDesc: 'Cells, ranges, SUM, AVERAGE, and absolute vs relative references', icon: '📊', skillsLearned: ['Excel Basics', 'Grid Mechanics', 'Math Functions', 'Cell Referencing'], careerImpact: '+20% Excel Core', estimatedDays: 30 },
        { nodeId: 'e2', courseId: 'course-excel-data-viz', title: 'Logical Formulas & Advanced Lookups', shortDesc: 'IF/AND/OR logic, VLOOKUP, XLOOKUP, and INDEX/MATCH', icon: '⚡', skillsLearned: ['Logical IF Statements', 'XLOOKUP', 'INDEX/MATCH', 'Data Validation'], careerImpact: '+25% Analytical Logic', estimatedDays: 30 },
        { nodeId: 'e3', courseId: 'course-business-analytics', title: 'Pivot Tables & Data Summarization', shortDesc: 'Grouping, filtering, calculated fields, and multi-sheet summaries', icon: '🔢', skillsLearned: ['Pivot Tables', 'Data Cleaning', 'Calculated Fields', 'Power Query'], careerImpact: '+25% Data Wrangling', estimatedDays: 30 },
        { nodeId: 'e4', courseId: 'course-excel-data-viz', title: 'Dynamic Executive Dashboards & KPI Reporting', shortDesc: 'Interactive charts, KPI scorecards, Power BI integration, and automated reports', icon: '🚀', skillsLearned: ['Executive Dashboards', 'Power BI', 'KPI Metrics', 'Report Automation'], careerImpact: '+30% Executive Reporting', estimatedDays: 30 }
      ]
    };
  }

  // ── 4. SQL & DATABASE ZERO-TO-PRO ──
  if (goalClean.includes('sql') || goalClean.includes('database')) {
    return {
      roleId: 'sql-basic-to-advance',
      roleTitle: 'Database & SQL Engineer (Basic to Advance)',
      icon: '🗄️',
      description: 'Ultra-beginner to pro mastery roadmap covering SQL queries, joins, schema design, B-Tree indexes, and database optimization.',
      averageSalaryRange: '₹8–22 LPA',
      targetTotalDays: 120,
      recommendationReason: `Matched goal "${userGoal}": Zero-to-Pro SQL Pipeline (Query Basics ➔ Joins & Aggregation ➔ Indexing & ACID ➔ High-Scale DBs).`,
      nodes: [
        { nodeId: 's1', courseId: 'course-database-eng', title: 'SQL Query Basics & Data Types', shortDesc: 'SELECT, WHERE, INSERT, UPDATE, DELETE, and data type rules', icon: '🗄️', skillsLearned: ['ANSI SQL', 'CRUD Operations', 'Filtering', 'Data Types'], careerImpact: '+20% SQL Core', estimatedDays: 30 },
        { nodeId: 's2', courseId: 'course-database-eng', title: 'Complex Joins, Aggregations & Schema Design', shortDesc: 'INNER/LEFT/RIGHT JOINs, GROUP BY, HAVING, and 3NF Normalization', icon: '⚡', skillsLearned: ['SQL Joins', 'Aggregations', 'Schema Normalization', 'Foreign Keys'], careerImpact: '+25% Relational Design', estimatedDays: 30 },
        { nodeId: 's3', courseId: 'course-database-eng', title: 'B-Tree Indexing & Query Optimization', shortDesc: 'EXPLAIN ANALYZE, B-Trees, composite indexes, and slow query tuning', icon: '🔢', skillsLearned: ['B-Tree Indexes', 'Execution Plans', 'Query Tuning', 'ACID Rules'], careerImpact: '+25% Query Performance', estimatedDays: 30 },
        { nodeId: 's4', courseId: 'course-distributed-sys', title: 'NoSQL, Redis Caching & Distributed Sharding', shortDesc: 'MongoDB, Redis in-memory cache, read replicas, and horizontal sharding', icon: '🚀', skillsLearned: ['Redis Caching', 'MongoDB', 'Database Replication', 'Sharding'], careerImpact: '+30% Enterprise DB Infra', estimatedDays: 30 }
      ]
    };
  }

  // ── 5. UNIVERSAL ZERO-TO-PRO DYNAMIC GENERATOR FOR ANY OTHER INPUT ──
  const subjectTitle = userGoal ? userGoal.trim().replace(/^basic\s+/i, '').replace(/\s+to\s+advanc(e|ed)$/i, '') : 'Technology';
  const cleanSubjectName = subjectTitle.charAt(0).toUpperCase() + subjectTitle.slice(1);

  return {
    roleId: `dynamic-${cleanSubjectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-pro`,
    roleTitle: `${cleanSubjectName} Specialist (Basic to Advance)`,
    icon: '🎯',
    description: `Comprehensive ultra-beginner to pro mastery roadmap for ${cleanSubjectName}.`,
    averageSalaryRange: '₹8–22 LPA',
    targetTotalDays: 120,
    recommendationReason: `Matched custom goal "${userGoal}": Tailored 4-Stage Zero-to-Pro Pipeline for ${cleanSubjectName}.`,
    nodes: [
      {
        nodeId: 'dyn-n1',
        courseId: 'course-computer-fundamentals',
        title: `${cleanSubjectName} Foundations & Core Mechanics`,
        shortDesc: `Fundamental principles, syntax rules, and zero-to-one concepts of ${cleanSubjectName}`,
        icon: '🌱',
        skillsLearned: [`${cleanSubjectName} Basics`, 'Core Mechanics', 'Environment Setup', 'Execution Rules'],
        careerImpact: '+20% Core Foundation',
        estimatedDays: 30
      },
      {
        nodeId: 'dyn-n2',
        courseId: 'course-java-logic',
        title: `Intermediate ${cleanSubjectName} & Architecture`,
        shortDesc: `Design patterns, module structure, and practical implementations of ${cleanSubjectName}`,
        icon: '⚡',
        skillsLearned: [`${cleanSubjectName} Architecture`, 'Design Patterns', 'Best Practices', 'Error Handling'],
        careerImpact: '+25% Applied Engineering',
        estimatedDays: 30
      },
      {
        nodeId: 'dyn-n3',
        courseId: 'course-dsa-optim',
        title: 'Data Structures & Algorithmic Problem Solving',
        shortDesc: 'Big-O complexity, memory optimization, and algorithmic execution efficiency',
        icon: '🔢',
        skillsLearned: ['Algorithm Design', 'Data Structures', 'Big-O Complexity', 'Performance Tuning'],
        careerImpact: '+25% Algorithmic Mastery',
        estimatedDays: 30
      },
      {
        nodeId: 'dyn-n4',
        courseId: 'course-ai-eng',
        title: `High-Scale Production ${cleanSubjectName} & System Integration`,
        shortDesc: `Enterprise system deployment, performance monitoring, and production capstone`,
        icon: '🚀',
        skillsLearned: ['Enterprise Architecture', 'API Integration', 'Cloud Deployment', 'System Audit'],
        careerImpact: '+30% Pro Specialization',
        estimatedDays: 30,
        gate: {
          minCourseCompletionPct: 100,
          requireProjectVerification: true,
          minAtsScore: 80
        }
      }
    ]
  };
}
