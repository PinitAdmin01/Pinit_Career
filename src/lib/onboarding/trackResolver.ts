/**
 * Picks the student's career track (role label, roadmap course, skills, weak areas) from their
 * onboarding goal. The goal is either an option id from the onboarding questions
 * (diagnosticRegistry*.ts: Q2_PRIMARY_ROLE, Q1_COMMERCE_GOAL, Q1_BBA_CAREER_DIRECTION,
 * Q3_GEN_CAREER_CONSIDERATION), mapped exactly, or free text typed in the chat, matched on whole
 * words and phrases so short keywords never match inside other words ("ml" in "html", "ui" in
 * "build", "next" in any sentence, "front" in "front office").
 */

export interface ResolvedTrack {
  targetRoleLabel: string;
  courseId: string;
  skillsList: string;
  weakAreas: string[];
}

type TrackKey =
  | 'ai' | 'analytics' | 'cyber' | 'frontend' | 'devops' | 'uiux' | 'fullstack' | 'accounting' | 'banking'
  | 'investment' | 'hr' | 'digitalMarketing' | 'marketing' | 'ecommerce' | 'entrepreneur' | 'sales'
  | 'digitalTransformation' | 'finance' | 'consulting' | 'product' | 'operations' | 'iot' | 'qa' | 'research'
  | 'policy' | 'education' | 'healthcare' | 'media' | 'hardware' | 'creative' | 'social' | 'java'
  | 'mobile' | 'blockchain' | 'pythonBackend' | 'dsa';

export const TRACKS: Record<TrackKey, ResolvedTrack> = {
  ai: {
    targetRoleLabel: 'AI & LLM Systems Engineer',
    courseId: 'course-ai-eng',
    skillsList: 'Python 3.12, PyTorch, LangChain, Vector Databases (pgvector/Pinecone), RAG Architecture, LLM Prompt Engineering',
    weakAreas: ['Vector Index Tuning', 'Model Evaluation & Grounding', 'Async Agent Pipelines'],
  },
  analytics: {
    targetRoleLabel: 'Data & Business Analytics Specialist',
    courseId: 'course-business-analytics',
    skillsList: 'SQL Analytics, Advanced Excel, Python Data Science, Pandas, PowerBI Dashboarding, Statistical Modeling',
    weakAreas: ['A/B Test Design', 'Data Pipeline ETL', 'Predictive Modeling'],
  },
  cyber: {
    targetRoleLabel: 'Cybersecurity Analyst',
    courseId: 'course-cybersecurity',
    skillsList: 'Network Defense, OWASP Top 10, Penetration Testing, SIEM Log Analysis, Cryptography, Vulnerability Assessment',
    weakAreas: ['Zero Trust Architecture', 'Cloud Security Posture', 'Incident Response Playbooks'],
  },
  frontend: {
    targetRoleLabel: 'React Frontend Web SDE',
    courseId: 'course-react-web',
    skillsList: 'React 18, Next.js SSR, TypeScript, TailwindCSS, CSS Architecture, State Management (Zustand), Web Performance',
    weakAreas: ['Webpack / Vite Bundling', 'Core Web Vitals Optimization', 'React Testing Library'],
  },
  devops: {
    targetRoleLabel: 'Cloud & DevOps Engineer',
    courseId: 'course-devops-cicd',
    skillsList: 'Docker Containers, Kubernetes, CI/CD GitHub Actions, AWS Cloud Infrastructure, Terraform IaC, Prometheus Monitoring',
    weakAreas: ['Kubernetes Security Policies', 'Terraform State Management', 'Multi-Region High Availability'],
  },
  uiux: {
    targetRoleLabel: 'UI/UX Product Designer',
    courseId: 'course-design-systems',
    skillsList: 'Figma Wireframing & Prototyping, Design Systems & Tokens, User Research, Usability Testing, Micro-interactions',
    weakAreas: ['Design System Tokens Architecture', 'Accessibility (WCAG 2.1 AA)', 'A/B Testing Experiments'],
  },
  fullstack: {
    targetRoleLabel: 'Full-Stack Software Developer',
    courseId: 'course-fullstack-js',
    skillsList: 'JavaScript ES6+, TypeScript, Next.js, Node.js REST APIs, PostgreSQL, Prisma/Drizzle, Docker Basics',
    weakAreas: ['Database Indexing & Transactions', 'Serverless Cold Starts', 'Authentication Security'],
  },
  accounting: {
    targetRoleLabel: 'Audit, Taxation & Digital Accounting Specialist',
    courseId: 'course-digital-accounting',
    skillsList: 'Double-Entry Bookkeeping, Tally Prime ERP, GST Return Filing, Statutory Audit Checklists, Internal Controls, Indian Income Tax',
    weakAreas: ['Input Tax Credit (ITC) Reconciliations', 'Transfer Pricing Basics', 'Audit Sampling Procedures'],
  },
  banking: {
    targetRoleLabel: 'Banking & Financial Services Specialist',
    courseId: 'course-finance-investment',
    skillsList: 'Credit Appraisal, Commercial Lending, KYC/AML Compliance, Treasury Management, Retail Banking Operations, Financial Products',
    weakAreas: ['Credit Risk Scoring', 'NPA Provisioning Norms', 'Forex Hedging Operations'],
  },
  investment: {
    targetRoleLabel: 'Investment & Equity Research Analyst',
    courseId: 'course-finance-investment',
    skillsList: 'Discounted Cash Flow (DCF), Equity Research, Company Valuation, Financial Modeling, Portfolio Theory, Technical Analysis',
    weakAreas: ['WACC Calculation Variations', 'Monte Carlo Simulation', 'M&A Accretion/Dilution Analysis'],
  },
  hr: {
    targetRoleLabel: 'Human Resources & Talent Lead',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Talent Acquisition, Statutory HR Compliance, Payroll Management, Performance Appraisal Frameworks, Employee Relations',
    weakAreas: ['Labor Law Compliance', 'Attrition Predictive Modeling', 'Compensation & Benefits Benchmarking'],
  },
  digitalMarketing: {
    targetRoleLabel: 'Digital Marketing & Growth Strategist',
    courseId: 'course-digital-marketing',
    skillsList: 'Growth Marketing Funnels, SEO & Search Strategy, Conversion Rate Optimization (CRO), Google Analytics 4, Paid Performance Ads',
    weakAreas: ['Attribution Modeling', 'Paid Acquisition Unit Economics', 'Lifecycle Marketing Automation'],
  },
  marketing: {
    targetRoleLabel: 'Marketing & Brand Manager',
    courseId: 'course-marketing-branding',
    skillsList: 'Customer Research, Market Segmentation, Brand Development, Product Management, Pricing Strategy, Campaign Strategy',
    weakAreas: ['Consumer Psychology Analytics', 'Brand Equity Measurement', 'Multi-Channel Media Mix'],
  },
  ecommerce: {
    targetRoleLabel: 'E-Commerce & Digital Business Specialist',
    courseId: 'course-ecommerce-digital-biz',
    skillsList: 'E-Commerce Strategy, Catalog Architecture, Payment Gateways (UPI/COD), Logistics Fulfillment, Conversion Rate Analytics',
    weakAreas: ['Cart Abandonment Optimization', 'Inventory Turnover Analytics', 'Cross-Border Logistics'],
  },
  entrepreneur: {
    targetRoleLabel: 'Entrepreneur & Business Manager',
    courseId: 'course-entrepreneurship-biz-mgmt',
    skillsList: 'Business Model Canvas (BMC), Startup Finance, Break-Even Analysis, Strategic Planning, Operations, Leadership',
    weakAreas: ['Investor Pitch Valuation', 'Working Capital Management', 'Go-To-Market Execution'],
  },
  sales: {
    targetRoleLabel: 'Sales, Customer Success & CRM Specialist',
    courseId: 'course-sales-crm-success',
    skillsList: 'Consultative Selling, BANT Qualification, LAER Objection Handling, CRM Management, Sales Velocity Analytics',
    weakAreas: ['Quota Forecasting Models', 'Enterprise Contract Negotiation', 'Churn Mitigation Playbooks'],
  },
  digitalTransformation: {
    targetRoleLabel: 'AI & Digital Transformation Business Specialist',
    courseId: 'course-ai-digital-transformation',
    skillsList: 'AI Business Literacy, Prompt Engineering, RPA Automation, Business Intelligence Dashboards, AI Governance',
    weakAreas: ['RPA Workflow Optimization', 'Enterprise AI Risk Auditing', 'Change Management Architecture'],
  },
  finance: {
    targetRoleLabel: 'Financial & Investment Analyst',
    courseId: 'course-finance-investment',
    skillsList: 'Financial Modeling, Corporate Valuation, Excel Analysis, SQL, Financial Statement Analysis, Auditing & Compliance',
    weakAreas: ['Derivatives Valuation', 'Regulatory Tech (RegTech)', 'Corporate Restructuring Modeling'],
  },
  consulting: {
    targetRoleLabel: 'Management Consultant & Business Strategist',
    courseId: 'course-entrepreneurship-biz-mgmt',
    skillsList: 'Hypothesis-Driven Problem Solving, MECE Structuring, Market Sizing, Corporate Valuation, Executive Presentation Storytelling',
    weakAreas: ['Market Sizing Estimation', 'M&A Synergy Modeling', 'Executive Slide Architecture'],
  },
  product: {
    targetRoleLabel: 'Product Manager (Tech & Business Strategy)',
    courseId: 'course-design-systems',
    skillsList: 'Product Strategy, User Research, PRD Authoring, Agile Sprint Planning, North Star Metrics, Feature Prioritization (RICE)',
    weakAreas: ['RICE Prioritization Trade-offs', 'Telemetry Funnel Drop-off Auditing', 'Technical Architecture Feasibility'],
  },
  operations: {
    targetRoleLabel: 'Operations, Supply Chain & Compliance Specialist',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Business Process Mapping, Inventory Management (EOQ/ROP), Logistics, Lean & Six Sigma, Business Compliance',
    weakAreas: ['Supply Chain Bottleneck Analysis', 'Lean Six Sigma Root Cause', 'Regulatory Audit Preparation'],
  },
  iot: {
    targetRoleLabel: 'IoT & Embedded Systems Engineer',
    courseId: 'course-iot-embedded',
    skillsList: 'Embedded C/C++, ESP32/Arduino, GPIO Sensor Interfacing, MQTT & Wireless Protocols, TinyML, Hardware Security',
    weakAreas: ['Low-Power Duty Cycling', 'Secure Boot & Co-Processors', 'Firmware Over-The-Air (FOTA) Updates'],
  },
  qa: {
    targetRoleLabel: 'QA & Test Automation Engineer',
    courseId: 'course-fullstack-js',
    skillsList: 'Jest Unit Testing, Playwright E2E, Cypress, API Integration Testing, CI/CD Test Automation, Performance Testing',
    weakAreas: ['Flaky Test Isolation', 'Contract Testing', 'Load & Stress Testing'],
  },
  research: {
    targetRoleLabel: 'Scientific & Quantitative Research Specialist',
    courseId: 'course-business-analytics',
    skillsList: 'Research Methodology, Quantitative Analysis, Statistical Modeling, Python for Research, Data Visualization, Report Writing',
    weakAreas: ['Statistical Hypothesis Testing', 'Large Dataset Wrangling', 'Peer-Review Publication Standards'],
  },
  policy: {
    targetRoleLabel: 'Public Policy, Compliance & Legal Specialist',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Regulatory Compliance, Statutory Analysis, Policy Evaluation, Governance Frameworks, Legal Research & Documentation',
    weakAreas: ['Statutory Interpretation Nuances', 'Cross-Border Regulatory Alignment', 'Administrative Hearing Procedures'],
  },
  education: {
    targetRoleLabel: 'Education & Learning Technology Specialist',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Instructional Design, Pedagogical Assessment, Learning Outcomes Measurement, Curriculum Scaffolding, Educational Tech',
    weakAreas: ['Formative Assessment Rubrics', 'Differentiated Instruction Delivery', 'EdTech Analytics Integration'],
  },
  healthcare: {
    targetRoleLabel: 'Healthcare & Clinical Operations Analyst',
    courseId: 'course-business-analytics',
    skillsList: 'Healthcare Data Management, Clinical Trial Analytics, Health Informatics, Patient Journey Mapping, Quality Standards',
    weakAreas: ['Healthcare Compliance (HIPAA/NABH)', 'Electronic Health Records (EHR) Auditing', 'Clinical KPI Dashboards'],
  },
  media: {
    targetRoleLabel: 'Digital Media & Communications Specialist',
    courseId: 'course-digital-marketing',
    skillsList: 'Investigative Journalism, Multimedia Content Creation, Digital Publishing, Editorial Standards, Audience Analytics',
    weakAreas: ['Fact-Checking Protocols', 'SEO Content Architecture', 'Digital Media Ethics & Defamation'],
  },
  hardware: {
    targetRoleLabel: 'Core Systems & Hardware Engineer',
    courseId: 'course-iot-embedded',
    skillsList: 'Embedded Systems, Circuit Design, Microcontroller Interfacing, Hardware Debugging, RTOS Basics, Hardware-Software Integration',
    weakAreas: ['Real-Time Operating Systems (RTOS)', 'PCB Layout & Noise Mitigation', 'Hardware Security Modules'],
  },
  creative: {
    targetRoleLabel: 'Creative & Digital Arts Specialist',
    courseId: 'course-design-systems',
    skillsList: 'Visual Design, Digital Illustration, Creative Direction, Concept Art, UI/UX Prototyping, Brand Storytelling',
    weakAreas: ['Interactive Prototyping', '3D Asset Optimization', 'Cross-Platform Responsive Design'],
  },
  social: {
    targetRoleLabel: 'Social Impact & Non-Profit Program Manager',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Program Management, Grant Writing, Stakeholder Alignment, Impact Measurement, Non-Profit Governance',
    weakAreas: ['Monitoring & Evaluation (M&E) Frameworks', 'Donor Reporting Metrics', 'Statutory NGO Compliance'],
  },
  // Tracks reached from typed goals only (each has its own course).
  mobile: {
    targetRoleLabel: 'Mobile App Developer',
    courseId: 'course-mobile-dev',
    skillsList: 'React Native, Cross-Platform UI, Touch & Gesture Handling, Device Hardware APIs, App Store Deployment',
    weakAreas: ['Offline Sync & Caching', 'Mobile Performance Profiling', 'Push Notifications'],
  },
  blockchain: {
    targetRoleLabel: 'Blockchain & Web3 Developer',
    courseId: 'course-blockchain-web3',
    skillsList: 'Solidity Smart Contracts, Ethereum & EVM, Merkle Trees & Hashing, Wallet Integration (MetaMask / JSON-RPC), Web3 dApps',
    weakAreas: ['Smart Contract Security Audits', 'Gas Optimization', 'Layer-2 Scaling'],
  },
  pythonBackend: {
    targetRoleLabel: 'Python Backend Developer',
    courseId: 'course-python-backend',
    skillsList: 'Python Data Models, FastAPI (Async ASGI), SQLAlchemy ORM, Token Authentication, Production Deployment',
    weakAreas: ['Async Concurrency Pitfalls', 'Database Migrations', 'API Rate Limiting'],
  },
  dsa: {
    targetRoleLabel: 'Software Engineer (DSA & Problem Solving)',
    courseId: 'course-dsa-optim',
    skillsList: 'Arrays & Hash Tables, Trees & Graph Traversals, Dynamic Programming, Complexity Analysis (Big-O), Competitive Problem Solving',
    weakAreas: ['Dynamic Programming State Design', 'Graph Shortest Paths', 'Amortized Complexity'],
  },
  java: {
    targetRoleLabel: 'Java Backend SDE',
    courseId: 'course-java-logic',
    skillsList: 'Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design',
    weakAreas: ['Docker Containers', 'System Design', 'Microservices Architecture'],
  },
};

/** Onboarding option ids (the four goal questions) → track. Options not listed ("exploring", "other", …) use the degree fallback. */
const OPTION_TRACK: Record<string, TrackKey> = {
  // Q2_PRIMARY_ROLE (tech)
  frontend_developer: 'frontend',
  backend_developer: 'java',
  full_stack_developer: 'fullstack',
  ai_ml_engineer: 'ai',
  data_analyst: 'analytics',
  ui_ux_designer: 'uiux',
  qa_engineer: 'qa',
  cybersecurity: 'cyber',
  cloud_devops: 'devops',
  product_manager: 'product',
  financial_analyst: 'finance',
  digital_marketing: 'digitalMarketing',
  // Q1_COMMERCE_GOAL
  accounting_finance: 'accounting',
  banking_services: 'banking',
  audit_taxation: 'accounting',
  business_analytics: 'analytics',
  investment_markets: 'investment',
  corporate_management: 'consulting',
  human_resources: 'hr',
  marketing_sales: 'marketing',
  entrepreneurship: 'entrepreneur',
  higher_education: 'research',
  // Q1_BBA_CAREER_DIRECTION
  management_strategy: 'consulting',
  marketing_growth: 'digitalMarketing',
  sales_bizdev: 'sales',
  corporate_finance: 'finance',
  consulting: 'consulting',
  operations_supplychain: 'operations',
  product_management: 'product',
  entrepreneurship_startup: 'entrepreneur',
  banking_financial_services: 'banking',
  // Q3_GEN_CAREER_CONSIDERATION
  technology: 'fullstack',
  research: 'research',
  data: 'analytics',
  design: 'uiux',
  media: 'media',
  education: 'education',
  healthcare: 'healthcare',
  public_sector: 'policy',
  business: 'entrepreneur',
  finance: 'finance',
  marketing: 'marketing',
  operations: 'operations',
  law: 'policy',
  engineering: 'hardware',
  scientific: 'research',
  creative: 'creative',
  social_sector: 'social',
  // Express onboarding trajectories (useOnboardingWizard `trajectory`)
  java_sde: 'java',
  react_frontend: 'frontend',
  devops_cloud: 'devops',
  business_analyst: 'analytics',
};

interface KeywordRule {
  track: TrackKey;
  /** Whole words. */
  words?: string[];
  /** Whole phrases (words separated by single spaces, after the text is tokenized). */
  phrases?: string[];
  /** The rule does not apply when one of these phrases is present. */
  unless?: string[];
}

/** Free-text rules, most specific first. */
const KEYWORD_RULES: KeywordRule[] = [
  { track: 'digitalTransformation', words: ['rpa'], phrases: ['digital transformation', 'ai transformation', 'ai business', 'ai strategy'] },
  { track: 'ai', words: ['ai', 'ml', 'llm', 'llms', 'genai', 'nlp', 'aiml'], phrases: ['artificial intelligence', 'machine learning', 'deep learning', 'computer vision', 'generative ai'] },
  {
    track: 'analytics',
    words: ['analytics', 'bi', 'powerbi', 'tableau', 'data'],
    phrases: ['data analyst', 'data analysis', 'data science', 'data scientist', 'data engineer', 'data engineering', 'business analyst', 'big data', 'power bi'],
    unless: ['data structure', 'data structures'],
  },
  { track: 'dsa', words: ['dsa', 'algorithm', 'algorithms', 'leetcode'], phrases: ['data structure', 'data structures', 'competitive programming'] },
  { track: 'blockchain', words: ['blockchain', 'web3', 'solidity', 'crypto', 'ethereum', 'dapp', 'dapps'], phrases: ['smart contract', 'smart contracts'] },
  { track: 'cyber', words: ['cyber', 'cybersecurity', 'security', 'infosec', 'pentester', 'pentesting'], phrases: ['cyber security', 'ethical hacking', 'penetration testing'] },
  { track: 'mobile', words: ['mobile', 'android', 'ios', 'flutter', 'kotlin', 'swift'], phrases: ['react native', 'mobile app', 'mobile apps', 'app developer'] },
  { track: 'fullstack', words: ['fullstack', 'mern', 'mean'], phrases: ['full stack'] },
  { track: 'frontend', words: ['frontend', 'react', 'reactjs', 'nextjs', 'html', 'css', 'website', 'websites'], phrases: ['front end', 'next js', 'web developer', 'web development', 'web dev'] },
  { track: 'pythonBackend', words: ['python', 'django', 'flask', 'fastapi'] },
  { track: 'java', words: ['backend', 'java', 'spring', 'sde'], phrases: ['back end', 'software engineer', 'software engineering', 'software developer', 'spring boot'] },
  { track: 'devops', words: ['devops', 'cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'sre', 'terraform'] },
  { track: 'qa', words: ['qa', 'tester', 'testing', 'sdet'], phrases: ['quality assurance', 'test automation', 'test engineer', 'automation testing'] },
  {
    track: 'uiux',
    words: ['ui', 'ux', 'figma', 'design', 'designer'],
    phrases: ['user experience', 'user interface', 'product designer', 'interaction design'],
    unless: ['system design', 'circuit design', 'chip design', 'graphic design', 'graphic designer', 'game design'],
  },
  { track: 'iot', words: ['iot', 'embedded', 'firmware', 'arduino', 'microcontroller', 'microcontrollers'] },
  { track: 'accounting', words: ['tax', 'taxation', 'audit', 'auditor', 'auditing', 'compliance', 'accounting', 'accountant', 'tally', 'bookkeeping', 'gst'], phrases: ['chartered accountant'] },
  { track: 'banking', words: ['bank', 'banking', 'banker', 'credit', 'lending', 'loan', 'loans'] },
  { track: 'investment', words: ['investment', 'investments', 'investing', 'equity', 'trading', 'trader', 'stock', 'stocks', 'markets'], phrases: ['stock market', 'equity research', 'capital markets'] },
  { track: 'hr', words: ['hr', 'recruiter', 'recruiting', 'recruitment', 'talent'], phrases: ['human resource', 'human resources', 'people ops', 'people operations'] },
  { track: 'digitalMarketing', words: ['seo', 'sem', 'growth'], phrases: ['digital marketing', 'performance marketing', 'social media marketing', 'growth marketing'] },
  { track: 'ecommerce', words: ['ecommerce'], phrases: ['e commerce', 'online store', 'online business'] },
  { track: 'marketing', words: ['marketing', 'marketer', 'brand', 'branding', 'market'] },
  { track: 'entrepreneur', words: ['entrepreneur', 'entrepreneurship', 'startup', 'startups', 'founder', 'venture'], phrases: ['family business', 'own business', 'start a business', 'my own company'] },
  { track: 'sales', words: ['sales', 'sale', 'salesperson', 'crm', 'bizdev'], phrases: ['customer success', 'client relations', 'business development'] },
  { track: 'finance', words: ['finance', 'financial', 'fintech', 'cfa'] },
  { track: 'consulting', words: ['consultant', 'consulting', 'consult', 'strategy', 'strategist'], phrases: ['management consultant', 'business strategy'] },
  { track: 'product', phrases: ['product manager', 'product management', 'project manager', 'project management', 'product owner'] },
  { track: 'operations', words: ['operations', 'logistics', 'supplychain', 'procurement'], phrases: ['supply chain', 'front office', 'back office'] },
  {
    track: 'research',
    words: ['research', 'researcher', 'science', 'scientist', 'academic', 'academia', 'biotech', 'phd', 'lab', 'laboratory'],
    unless: ['computer science'],
  },
  { track: 'policy', words: ['law', 'legal', 'lawyer', 'advocate', 'policy', 'governance'], phrases: ['public sector', 'public policy'] },
  { track: 'education', words: ['education', 'teaching', 'teacher', 'pedagogy', 'tutor', 'edtech'] },
  { track: 'healthcare', words: ['health', 'healthcare', 'clinical', 'pharma', 'pharmacy', 'pharmaceutical', 'hospital', 'medical', 'nursing'] },
  { track: 'media', words: ['media', 'journalism', 'journalist', 'content', 'writing', 'writer', 'copywriter', 'editor'] },
  { track: 'creative', words: ['creative', 'animation', 'animator', 'illustration', 'illustrator', 'artist'], phrases: ['game art', 'graphic design', 'graphic designer', 'motion graphics', 'video editing'] },
  { track: 'hardware', words: ['engineering', 'hardware', 'robotics', 'electronics', 'vlsi'], unless: ['software engineering'] },
  { track: 'social', words: ['ngo', 'nonprofit'], phrases: ['non profit', 'social sector', 'social impact', 'social work'] },
];

/** Lowercase words of the text ("Full-Stack / Next.js" → ["full", "stack", "next", "js"]). */
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/&/g, ' and ').split(/[^a-z0-9+#]+/).filter(Boolean);
}

function matches(rule: KeywordRule, words: Set<string>, padded: string): boolean {
  const has = (phrase: string) => padded.includes(` ${phrase} `);
  if (rule.unless?.some(has)) {
    // Only the phrase-level signals count then (e.g. "data structures" is not data analytics,
    // but "data structures and a data science career" still is).
    return Boolean(rule.phrases?.some(has));
  }
  return Boolean(rule.words?.some((w) => words.has(w)) || rule.phrases?.some(has));
}

export function resolveTrackFromGoal(goalRole?: string, profileType?: string): ResolvedTrack {
  const goal = (goalRole || '').trim().toLowerCase();
  const profile = (profileType || '').toLowerCase();

  const option = OPTION_TRACK[goal];
  if (option) return TRACKS[option];

  const tokens = tokenize(goal);
  const words = new Set(tokens);
  const padded = ` ${tokens.join(' ')} `;
  const rule = KEYWORD_RULES.find((r) => matches(r, words, padded));
  if (rule) return TRACKS[rule.track];

  // Nothing in the goal: fall back on the degree.
  if (/\bcommerce\b|b\.?com\b|m\.?com\b/.test(profile)) return TRACKS.finance;
  if (/\bmanagement\b|\bbba\b|\bmba\b/.test(profile)) return TRACKS.operations;
  return TRACKS.java;
}
