import { JAVA_30_DAYS_QUESTS } from './java30DayData';
import { REACT_30_DAYS_QUESTS } from './react30DayData';
import { CLOUD_30_DAYS_QUESTS } from './cloud30DayData';
import { DEVOPS_30_DAYS_QUESTS } from './devops30DayData';
import { DESIGN_30_DAYS_QUESTS } from './design30DayData';
import { DSA_30_DAYS_QUESTS } from './dsa30DayData';
import { MOBILE_30_DAYS_QUESTS } from './mobile30DayData';
import { CYBER_30_DAYS_QUESTS } from './cybersecurity30DayData';
import { DATABASE_30_DAYS_QUESTS } from './database30DayData';
import { DISTRIBUTED_30_DAYS_QUESTS } from './distributed30DayData';
import { AI_30_DAYS_QUESTS } from './ai30DayData';
import { FULLSTACK_30_DAYS_QUESTS } from './fullstack30DayData';
import { IOT_EMBEDDED_30_DAYS_QUESTS } from './iotEmbedded30DayData';
import { GRAPHICS_3D_30_DAYS_QUESTS } from './graphics3d30DayData';
import { BLOCKCHAIN_30_DAYS_QUESTS } from './blockchain30DayData';
import { IOT_NETWORK_30_DAYS_QUESTS } from './iotNetwork30DayData';
import { IOT_EDGE_AI_30_DAYS_QUESTS } from './iotEdgeAi30DayData';
import { IOT_SECURITY_30_DAYS_QUESTS } from './iotSecurity30DayData';
import { PYTHON_30_DAYS_QUESTS } from './python30DayData';
import { QUANT_SYSTEMS_30_DAYS_QUESTS } from './quant30DayData';
import { BCOM_ACCOUNTING_30_DAYS_QUESTS } from './bcomAccounting30DayData';
import { BCOM_FINANCE_30_DAYS_QUESTS } from './bcomFinance30DayData';
import { BCOM_ANALYTICS_30_DAYS_QUESTS } from './bcomAnalytics30DayData';
import { BCOM_MARKETING_30_DAYS_QUESTS } from './bcomMarketing30DayData';
import { BCOM_DIGITAL_MARKETING_30_DAYS_QUESTS } from './bcomDigitalMarketing30DayData';
import { BCOM_ECOMMERCE_30_DAYS_QUESTS } from './bcomEcommerce30DayData';
import { BCOM_ENTREPRENEURSHIP_30_DAYS_QUESTS } from './bcomEntrepreneurship30DayData';
import { BCOM_SALES_CRM_30_DAYS_QUESTS } from './bcomSalesCrm30DayData';
import { BCOM_OPERATIONS_30_DAYS_QUESTS } from './bcomOperations30DayData';
import { BCOM_AI_TRANSFORMATION_30_DAYS_QUESTS } from './bcomAiTransformation30DayData';


export interface CourseQuest {
  id: string;
  title: string;
  desc: string;
  type: 'coding' | 'lecture' | 'interactive';
  category: 'learning' | 'exam' | 'assignment';
  requiresAvatar: boolean;
  starterCode?: string;
  hint?: string;
  testSuite?: string;
  syllabus?: string[];
  skillCategory?: 'programming' | 'soft-skills' | 'communication' | 'leadership' | 'theory';
  xp: number;
  pins: number;
}

export interface Course {
  id: string;
  title: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  icon: string;
  quests: CourseQuest[];
}

export const COURSES_REGISTRY: Course[] = [
  {
    id: 'course-java-logic',
    title: 'Java Fundamentals & Core Logic',
    desc: 'Master basic primitive types, loop controls, object-oriented concepts, and core logical coding challenges.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '☕',
    quests: JAVA_30_DAYS_QUESTS as any
  },
  {
    id: 'course-react-web',
    title: 'Full-Stack React Web Development',
    desc: 'Deep dive into JSX, functional components, hooks, custom state managers, and Server-Side Rendering.',
    difficulty: 'Intermediate',
    durationWeeks: 6,
    icon: '⚛️',
    quests: REACT_30_DAYS_QUESTS as any
  },
  // Add remaining placeholder courses mapped to courseIds for registry completeness
  {
    id: 'course-cloud-native',
    title: 'Cloud Native Architectures (AWS)',
    desc: 'Explore Amazon Web Services, EC2 clusters, serverless Lambda, microservice routers, API gateways, and storage buckets.',
    difficulty: 'Advanced',
    durationWeeks: 6,
    icon: '☁️',
    quests: CLOUD_30_DAYS_QUESTS as any
  },
  {
    id: 'course-devops-cicd',
    title: 'DevOps & CI/CD Pipeline Automation',
    desc: 'Understand Docker containers, GitHub actions runners, CI/CD automated test suites, Kubernetes pods, and deployment pipelines.',
    difficulty: 'Advanced',
    durationWeeks: 6,
    icon: '🚀',
    quests: DEVOPS_30_DAYS_QUESTS as any
  },
  {
    id: 'course-design-systems',
    title: 'UI/UX Design Systems & Visual Frontend',
    desc: 'Create scalable design systems, typography grids, atomic components, CSS flexbox spacing systems, and responsive layouts.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '🎨',
    quests: DESIGN_30_DAYS_QUESTS as any
  },
  {
    id: 'course-dsa-optim',
    title: 'Data Structures & Algorithmic Optimizations',
    desc: 'Optimize logic space-time complexity. Study binary trees, hash tables, graph traversals, and dynamic programming.',
    difficulty: 'Intermediate',
    durationWeeks: 6,
    icon: '🔢',
    quests: DSA_30_DAYS_QUESTS as any
  },
  {
    id: 'course-mobile-dev',
    title: 'Mobile Application Development',
    desc: 'Build cross-platform mobile apps with React Native, touch event handlers, hardware API accesses, and app store deployment processes.',
    difficulty: 'Intermediate',
    durationWeeks: 5,
    icon: '📱',
    quests: MOBILE_30_DAYS_QUESTS as any
  },
  {
    id: 'course-cybersecurity',
    title: 'Cybersecurity Principles & Secure Systems',
    desc: 'Protect code against OWASP top 10 security holes, CSRF injections, identity tokens validation, and cryptographic hash mechanisms.',
    difficulty: 'Advanced',
    durationWeeks: 6,
    icon: '🛡️',
    quests: CYBER_30_DAYS_QUESTS as any
  },
  {
    id: 'course-database-eng',
    title: 'Database Engineering & Query Performance',
    desc: 'Optimize relational indexes, query execution pathways, database isolation modes, replication models, and transaction safety checks.',
    difficulty: 'Advanced',
    durationWeeks: 5,
    icon: '💾',
    quests: DATABASE_30_DAYS_QUESTS as any
  },
  {
    id: 'course-distributed-sys',
    title: 'High-Scale Distributed System Design',
    desc: 'Design systems carrying millions of transactions. Cover load distribution routers, key-value caches, and partition tolerance models.',
    difficulty: 'Advanced',
    durationWeeks: 6,
    icon: '🌐',
    quests: DISTRIBUTED_30_DAYS_QUESTS as any
  },
  {
    id: 'course-ai-eng',
    title: 'AI Engineering & LLM Integration',
    desc: 'Deploy custom LLM agents, dynamic prompting templates, RAG query pipelines, vector databases, and agentic workflows.',
    difficulty: 'Intermediate',
    durationWeeks: 4,
    icon: '🤖',
    quests: AI_30_DAYS_QUESTS as any
  },
  {
    id: 'course-fullstack-js',
    title: 'Full-Stack JavaScript Engineering',
    desc: 'Master Node.js RESTful APIs design, ORM schemas migrations, client-server data synchronization, and state management hooks cache.',
    difficulty: 'Intermediate',
    durationWeeks: 4,
    icon: '💻',
    quests: FULLSTACK_30_DAYS_QUESTS as any
  },
  {
    id: 'course-iot-embedded',
    title: 'IoT, Firmware & Embedded Systems',
    desc: 'Develop embedded microcontroller firmware, configure analog sensor ADC conversions, structure MQTT telemetry payloads, and optimize RTOS schedulers.',
    difficulty: 'Intermediate',
    durationWeeks: 4,
    icon: '🔌',
    quests: IOT_EMBEDDED_30_DAYS_QUESTS as any
  },
  {
    id: 'course-3d-graphics',
    title: '3D Interactive Graphics & Avatar Animation',
    desc: 'Structure WebGL renderer canvas, calculate perspective projection matrices, rig bone joints skinning weights, and map morph targets blendshapes.',
    difficulty: 'Advanced',
    durationWeeks: 4,
    icon: '🔮',
    quests: GRAPHICS_3D_30_DAYS_QUESTS as any
  },
  {
    id: 'course-blockchain-web3',
    title: 'Blockchain, Web3 & Smart Contracts',
    desc: 'Deploy Solidity smart contracts, analyze SHA-256 block difficulty parameters, hash transaction Merkle Trees, and connect MetaMask JSON-RPC providers.',
    difficulty: 'Intermediate',
    durationWeeks: 4,
    icon: '🪙',
    quests: BLOCKCHAIN_30_DAYS_QUESTS as any
  },
  {
    id: 'course-iot-network',
    title: 'IoT Wireless Networks & Protocols',
    desc: 'Master LoRaWAN gateway setups, cellular NB-IoT frequencies, BLE characteristics services, and CoAP UDP packet serializations.',
    difficulty: 'Intermediate',
    durationWeeks: 4,
    icon: '📶',
    quests: IOT_NETWORK_30_DAYS_QUESTS as any
  },
  {
    id: 'course-iot-edge-ai',
    title: 'Edge AI, DSP & TinyML Systems',
    desc: 'Deploy quantized neural networks, configure DSP sampling intervals, optimize window moving averages, and validate accelerometer confidence scores.',
    difficulty: 'Advanced',
    durationWeeks: 4,
    icon: '🧠',
    quests: IOT_EDGE_AI_30_DAYS_QUESTS as any
  },
  {
    id: 'course-iot-security',
    title: 'Industrial IoT Security & Device Lifecycle',
    desc: 'Verify secure boot public key hashes, check AES IV block size constraints, prevent firmware versions downgrade rollbacks, and manage cert expiries.',
    difficulty: 'Advanced',
    durationWeeks: 4,
    icon: '🔒',
    quests: IOT_SECURITY_30_DAYS_QUESTS as any
  },
  {
    id: 'course-python-backend',
    title: 'Python Programming & Backend Systems',
    desc: 'Master Python data models, async ASGI services with FastAPI, relational databases with SQLAlchemy ORM, token authentication, and secure production deployments.',
    difficulty: 'Intermediate',
    durationWeeks: 4,
    icon: '🐍',
    quests: PYTHON_30_DAYS_QUESTS as any
  },
  {
    id: 'course-quant-systems',
    title: 'Quantitative Engineering & Low-Latency Trading Systems',
    desc: 'Master Limit Order Book (LOB) matching queues, volume-weighted average price (VWAP) execution algorithms, market slippage modeling, TCP socket kernel bypass, and geographic light-speed latency limits.',
    difficulty: 'Advanced',
    durationWeeks: 4,
    icon: '📈',
    quests: QUANT_SYSTEMS_30_DAYS_QUESTS as any
  },
  {
    id: 'course-digital-accounting',
    title: 'Digital Accounting & Taxation (B.Com / BBA)',
    desc: 'University-grade 30-day curriculum covering double-entry bookkeeping, Tally Prime ERP, GST, Payroll, Income Tax, and Cloud AI automation.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '📊',
    quests: BCOM_ACCOUNTING_30_DAYS_QUESTS as any
  },
  {
    id: 'course-finance-investment',
    title: 'Business Finance & Investment Management (B.Com / BBA)',
    desc: 'University-grade foundation curriculum covering financial statements, time value of money, cash budgeting, cost analysis, corporate finance, capital markets, and FinTech.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '📈',
    quests: BCOM_FINANCE_30_DAYS_QUESTS as any
  },
  {
    id: 'course-business-analytics',
    title: 'Business Analytics & Decision Intelligence (B.Com / BBA / MBA)',
    desc: 'University-grade foundation curriculum covering data literacy, Excel analytics, visualization, Power BI, SQL fundamentals, KPI performance tracking, and AI decision intelligence.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '📊',
    quests: BCOM_ANALYTICS_30_DAYS_QUESTS as any
  },
  {
    id: 'course-marketing-branding',
    title: 'Marketing & Brand Management (B.Com / BBA / MBA)',
    desc: 'University-grade foundation curriculum covering customer research, market segmentation, brand development, product management, pricing, distribution channels, campaign strategy, and AI in marketing.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '🎯',
    quests: BCOM_MARKETING_30_DAYS_QUESTS as any
  },
  {
    id: 'course-digital-marketing',
    title: 'Digital Marketing & Growth Strategy (B.Com / BBA / MBA)',
    desc: 'University-grade foundation curriculum covering customer journeys, SEO, content strategy, paid performance advertising, email automation, CRO analytics, growth hacking systems, and AI marketing tools.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '🚀',
    quests: BCOM_DIGITAL_MARKETING_30_DAYS_QUESTS as any
  },
  {
    id: 'course-ecommerce-digital-biz',
    title: 'E-Commerce & Digital Business (B.Com / BBA / MBA)',
    desc: 'University-grade foundation curriculum covering digital business models, product catalog management, pricing, online store UX, payment gateways, logistics fulfillment, customer support, e-commerce analytics, and AI commerce.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '🛒',
    quests: BCOM_ECOMMERCE_30_DAYS_QUESTS as any
  },
  {
    id: 'course-entrepreneurship-biz-mgmt',
    title: 'Entrepreneurship & Business Management (B.Com / BBA / MBA)',
    desc: 'University-grade foundation curriculum covering business fundamentals, Business Model Canvas (BMC), strategic planning, operations management, startup finance & break-even analysis, leadership, innovation, risk assessment, and AI tools for entrepreneurs.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '💡',
    quests: BCOM_ENTREPRENEURSHIP_30_DAYS_QUESTS as any
  },
  {
    id: 'course-sales-crm-success',
    title: 'Sales, Customer Success & CRM (B.Com / BBA / MBA)',
    desc: 'University-grade foundation curriculum covering sales prospecting, BANT lead qualification, active listening, LAER objection handling, win-win negotiation, customer onboarding & retention, CRM database architecture, sales velocity analytics, Key Account Management (KAM), and AI sales automation.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '🤝',
    quests: BCOM_SALES_CRM_30_DAYS_QUESTS as any
  },
  {
    id: 'course-operations-supplychain-compliance',
    title: 'Operations, Supply Chain & Business Compliance (B.Com / BBA / MBA)',
    desc: 'University-grade foundation curriculum covering business process mapping, procurement workflows, inventory control (EOQ/ROP), supply chain logistics, capacity planning, Lean/Six Sigma, quality management (QA/QC/CAPA), statutory compliance, ERP systems, and AI operations.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '⚙️',
    quests: BCOM_OPERATIONS_30_DAYS_QUESTS as any
  },
  {
    id: 'course-ai-digital-transformation',
    title: 'AI & Digital Transformation for Business (B.Com / BBA / MBA)',
    desc: 'University-grade foundation curriculum covering AI literacy, prompt engineering for business, functional AI (Finance, HR, Marketing, Ops), business intelligence & predictive analytics, Robotic Process Automation (RPA), enterprise ERP/CRM AI systems, AI governance/ethics/security, and AI leadership.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '🤖',
    quests: BCOM_AI_TRANSFORMATION_30_DAYS_QUESTS as any
  },
  // 🌐 UNIVERSAL FOUNDATIONAL COURSES (ESSENTIAL FOR BOTH TECH & NON-TECH)
  {
    id: 'course-computer-fundamentals',
    title: 'Computer Literacy, Digital Productivity & OS Fundamentals',
    desc: 'Universal Level 0 starting point for all students. Master operating system navigation, file systems, terminal CLI commands, keyboard shortcuts, cloud storage, browser developer tools, and digital security hygiene.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '💻',
    quests: [
      { id: 'cf-q1', title: 'Hardware vs Software & Operating System Architecture', desc: 'Dissect CPU, RAM, SSD storage, and OS kernel boundaries.', type: 'lecture', category: 'learning', requiresAvatar: true, xp: 100, pins: 10 },
      { id: 'cf-q2', title: 'File System Hierarchy & Directory Navigation', desc: 'Master absolute vs relative paths, folder nesting, and file extensions.', type: 'coding', category: 'assignment', requiresAvatar: false, xp: 120, pins: 15 },
      { id: 'cf-q3', title: 'Terminal Command Line Interface (CLI) Basics', desc: 'Run essential terminal commands (`cd`, `ls`, `mkdir`, `rm`, `cat`).', type: 'coding', category: 'learning', requiresAvatar: false, xp: 150, pins: 20 },
      { id: 'cf-q4', title: 'Cloud Storage & Remote File Synchronization', desc: 'Configure cloud drive sync, shared permissions, and versioning.', type: 'interactive', category: 'learning', requiresAvatar: true, xp: 110, pins: 10 },
      { id: 'cf-q5', title: 'Browser Developer Tools & Network Inspection', desc: 'Inspect HTML elements, inspect HTTP headers, and analyze console logs.', type: 'coding', category: 'assignment', requiresAvatar: false, xp: 140, pins: 15 }
    ] as any
  },
  {
    id: 'course-ai-prompt-literacy',
    title: 'Everyday AI Literacy & Prompt Engineering',
    desc: 'Essential AI skills for every modern worker. Master ChatGPT/Claude prompt engineering, AI web research (Perplexity), automated document summarization, AI image generation, and workflow automation.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '🤖',
    quests: [
      { id: 'ai-q1', title: 'Foundations of Generative AI & Large Language Models', desc: 'Understand how LLMs process tokens and predict text patterns.', type: 'lecture', category: 'learning', requiresAvatar: true, xp: 100, pins: 10 },
      { id: 'ai-q2', title: 'Crafting High-Precision System Prompts & Context', desc: 'Structure role, task, context, and output format for 10x better AI replies.', type: 'interactive', category: 'assignment', requiresAvatar: true, xp: 130, pins: 15 },
      { id: 'ai-q3', title: 'Few-Shot Prompting & Structured JSON Formatting', desc: 'Guide AI output with concrete input-output examples.', type: 'coding', category: 'learning', requiresAvatar: false, xp: 150, pins: 20 },
      { id: 'ai-q4', title: 'AI Research Tools & Citation Verification', desc: 'Utilize Perplexity and EuropePMC for verified scientific/business research.', type: 'interactive', category: 'learning', requiresAvatar: true, xp: 120, pins: 10 },
      { id: 'ai-q5', title: 'Automating Repetitive Workflows with AI Assistants', desc: 'Build automated email drafts, meeting summaries, and report outlines.', type: 'interactive', category: 'assignment', requiresAvatar: true, xp: 140, pins: 15 }
    ] as any
  },
  {
    id: 'course-excel-data-viz',
    title: 'Excel & Data Analysis Fundamentals',
    desc: 'The universal language of business & tech. Master Excel formulas, VLOOKUP/XLOOKUP, Pivot Tables, data cleaning, charts, and executive dashboard reporting.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '📊',
    quests: [
      { id: 'ex-q1', title: 'Excel Grid Mechanics, Cell Formatting & Math Formulas', desc: 'Master relative vs absolute cell references (`$A$1`).', type: 'lecture', category: 'learning', requiresAvatar: true, xp: 100, pins: 10 },
      { id: 'ex-q2', title: 'Logical Formulas & Conditional Statements (`IF`, `AND`, `OR`)', desc: 'Write nested conditional evaluation logic across data rows.', type: 'coding', category: 'assignment', requiresAvatar: false, xp: 130, pins: 15 },
      { id: 'ex-q3', title: 'Data Searching & Lookup Functions (`VLOOKUP`, `XLOOKUP`, `INDEX/MATCH`)', desc: 'Query data dynamically across multiple spreadsheet tables.', type: 'coding', category: 'learning', requiresAvatar: false, xp: 150, pins: 20 },
      { id: 'ex-q4', title: 'Pivot Tables, Grouping & Summary Aggregations', desc: 'Summarize 10,000 raw sales records into executive summary tables.', type: 'interactive', category: 'learning', requiresAvatar: true, xp: 140, pins: 15 },
      { id: 'ex-q5', title: 'Creating Executive Dashboards & Dynamic Charts', desc: 'Build interactive bar charts, trend lines, and KPI scorecards.', type: 'interactive', category: 'assignment', requiresAvatar: true, xp: 160, pins: 20 }
    ] as any
  },
  {
    id: 'course-git-version-control',
    title: 'Git, GitHub & Version Control Basics',
    desc: 'Essential collaboration skills for tech and digital teams. Master Git repositories, commits, branches, merge conflicts, pull requests, and GitHub project management.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '🐙',
    quests: [
      { id: 'git-q1', title: 'Version Control Concepts & Local Repository Setup (`git init`)', desc: 'Understand working tree, staging area, and commit history.', type: 'lecture', category: 'learning', requiresAvatar: true, xp: 100, pins: 10 },
      { id: 'git-q2', title: 'Staging, Committing & History Logs (`git add`, `git commit`)', desc: 'Create atomic commits with meaningful commit log messages.', type: 'coding', category: 'assignment', requiresAvatar: false, xp: 120, pins: 15 },
      { id: 'git-q3', title: 'Branching Strategies & Parallel Feature Development (`git branch`)', desc: 'Create, switch, and manage isolated feature branches.', type: 'coding', category: 'learning', requiresAvatar: false, xp: 140, pins: 20 },
      { id: 'git-q4', title: 'Resolving Merge Conflicts & Code Auditing', desc: 'Analyze diff markers and resolve overlapping branch changes.', type: 'coding', category: 'assignment', requiresAvatar: false, xp: 160, pins: 20 },
      { id: 'git-q5', title: 'Remote Repositories & GitHub Pull Requests (`git push`, `git pull`)', desc: 'Push commits to GitHub, open PRs, and conduct code reviews.', type: 'interactive', category: 'learning', requiresAvatar: true, xp: 150, pins: 15 }
    ] as any
  },
  {
    id: 'course-softskills-communication',
    title: 'Professional Tech Communication & Interview Mastery',
    desc: 'Essential soft skills for career acceleration. Master professional email writing, technical documentation, pitch presentations, active listening, teamwork, and interview confidence.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    icon: '🗣️',
    quests: [
      { id: 'comm-q1', title: 'Professional Written Communication & Email Etiquette', desc: 'Draft concise, impactful business emails and status updates.', type: 'lecture', category: 'learning', requiresAvatar: true, xp: 100, pins: 10 },
      { id: 'comm-q2', title: 'Technical Documentation & Architecture Writing', desc: 'Write clear READMEs, API specs, and technical user guides.', type: 'interactive', category: 'assignment', requiresAvatar: true, xp: 130, pins: 15 },
      { id: 'comm-q3', title: 'Elevator Pitch & Product Presentation Skills', desc: 'Deliver compelling 2-minute project presentations to stakeholders.', type: 'interactive', category: 'learning', requiresAvatar: true, xp: 140, pins: 15 },
      { id: 'comm-q4', title: 'Cross-Functional Teamwork & Agile Collaboration', desc: 'Navigate sprint standups, feedback loops, and conflict resolution.', type: 'interactive', category: 'learning', requiresAvatar: true, xp: 130, pins: 10 },
      { id: 'comm-q5', title: 'Behavioral Interview Mastery (STAR Method)', desc: 'Structure STAR (Situation, Task, Action, Result) interview responses.', type: 'interactive', category: 'assignment', requiresAvatar: true, xp: 160, pins: 20 }
    ] as any
  }
];

// Fallback registry matching standard quests registry if custom course quests are missing
export function getFallbackQuestsForCourse(courseId: string): CourseQuest[] {
  const course = COURSES_REGISTRY.find(c => c.id === courseId);
  if (course && course.quests && course.quests.length > 0) {
    return course.quests;
  }
  const javaCourse = COURSES_REGISTRY.find(c => c.id === 'course-java-logic');
  return javaCourse?.quests || [];
}
