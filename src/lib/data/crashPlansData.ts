export interface CrashPlanCourseModule {
  month: number;
  courseId: string;
  title: string;
  desc: string;
  icon: string;
  skills: string[];
}

export interface CrashPlan {
  id: string;
  tier: '1m' | '3m' | '6m' | '9m';
  title: string;
  subtitle: string;
  badge?: string;
  highlightColor: string;
  trainingDurationMonths: number;
  trainingDurationDays: number;
  dailyCommitment: string;
  projectDurationMonths: number;
  internshipDurationMonths: string;
  totalProgramDuration: string;
  pinsPrice: number;
  inrPrice: number;
  scholarCashbackPins: number;
  targetRole: string;
  hireabilityBoost: string;
  competitorSavings: string;
  flagshipBuildByTrack: {
    web_fullstack: {
      title: string;
      desc: string;
      tech: string[];
      icon: string;
    };
    python_ai: {
      title: string;
      desc: string;
      tech: string[];
      icon: string;
    };
  };
  journeySteps: Array<{
    step: number;
    title: string;
    subtitle: string;
    duration: string;
    icon: string;
  }>;
  features: string[];
  deliverables: {
    projectCertificate: boolean;
    internshipCertificate: boolean;
    fullPortfolio: boolean;
    trainingProofSha256: boolean;
    timelineTracker: boolean;
    careerGrowthGraph: boolean;
    interviewPrep: string;
    languagesIncluded: string[];
    practiceTestsCount: number;
  };
  modulesByTrack: {
    web_fullstack: CrashPlanCourseModule[];
    python_ai: CrashPlanCourseModule[];
  };
}

export const CRASH_COURSE_PLANS: CrashPlan[] = [
  {
    id: 'plan-1m-sprint',
    tier: '1m',
    title: '1-Month Fast-Track Sprint',
    subtitle: 'Foundation & Core Competency Booster',
    highlightColor: '#38bdf8',
    trainingDurationMonths: 1,
    trainingDurationDays: 30,
    dailyCommitment: 'Daily 1 Hr Learning + Practice Labs',
    projectDurationMonths: 1,
    internshipDurationMonths: '2-3 Months',
    totalProgramDuration: '3-4 Months Total',
    pinsPrice: 500,
    inrPrice: 4999,
    scholarCashbackPins: 150,
    targetRole: 'Junior Frontend / React Engineer',
    hireabilityBoost: '+25% Hireability Jump',
    competitorSavings: 'Save ₹45,000 vs short-term bootcamps with zero debt',
    flagshipBuildByTrack: {
      web_fullstack: {
        title: 'Distributed Real-Time Chat & Presence Engine',
        desc: 'Production WebSocket/Redis engine with channels, user presence indicators, and message persistence.',
        tech: ['Next.js 14', 'TypeScript', 'Redis', 'Tailwind'],
        icon: '💬'
      },
      python_ai: {
        title: 'High-Concurrency Async REST API & Ingestion Engine',
        desc: 'FastAPI asynchronous microservice processing batch data feeds with rate limiting and Redis cache.',
        tech: ['Python 3.12', 'FastAPI', 'Redis', 'Pydantic'],
        icon: '⚡'
      }
    },
    journeySteps: [
      { step: 1, title: 'Daily 1-Hr Quests', subtitle: 'Core React/Python Foundation', duration: 'Month 1', icon: '⚡' },
      { step: 2, title: '1-Month Live Capstone', subtitle: 'Ship Production Chat/API', duration: 'Month 2', icon: '🚀' },
      { step: 3, title: 'PinIT Labs Fellowship', subtitle: 'Code Review & SHA-256 Pass', duration: 'Months 3–4', icon: '🏢' }
    ],
    features: [
      'Daily 1-Hour Micro-Learning & Hands-on Quests',
      '1-Month Production Capstone Project',
      '2-3 Months Real-Time Industry Internship',
      'Verifiable Project-Based Certificate (QR)',
      'Real-Time Internship Certificate & Recommendation',
      'Weekly Practice Tests with Instant Diagnostic Reports',
      'Corporate Level English Communication Module',
      'Verified Skill Passport with SHA-256 Ledger'
    ],
    deliverables: {
      projectCertificate: true,
      internshipCertificate: true,
      fullPortfolio: true,
      trainingProofSha256: true,
      timelineTracker: true,
      careerGrowthGraph: true,
      interviewPrep: 'Basic Resume Audit & Tech Screening Q&A',
      languagesIncluded: ['Corporate Level English'],
      practiceTestsCount: 4
    },
    modulesByTrack: {
      web_fullstack: [
        {
          month: 1,
          courseId: 'course-react-web',
          title: 'Modern Frontend & Component Engineering',
          desc: 'Modern React, state architectures, and dynamic web user interfaces.',
          icon: '⚛️',
          skills: ['React', 'JavaScript', 'Tailwind', 'Hooks']
        }
      ],
      python_ai: [
        {
          month: 1,
          courseId: 'course-python-backend',
          title: 'Python Core & Scripting Fundamentals',
          desc: 'Python syntax, data structures, OOP paradigms, and automation.',
          icon: '🐍',
          skills: ['Python', 'OOP', 'Data Structures', 'Scripting']
        }
      ]
    }
  },
  {
    id: 'plan-3m-accelerator',
    tier: '3m',
    title: '3-Month Career Accelerator',
    subtitle: 'Full Stack Architecture & Production APIs',
    badge: '★ MOST POPULAR',
    highlightColor: '#6366f1',
    trainingDurationMonths: 3,
    trainingDurationDays: 90,
    dailyCommitment: 'Daily 1 Hr Learning + Practice Labs',
    projectDurationMonths: 1,
    internshipDurationMonths: '2-3 Months',
    totalProgramDuration: '5-6 Months Total',
    pinsPrice: 1200,
    inrPrice: 9999,
    scholarCashbackPins: 350,
    targetRole: 'Associate Full-Stack Engineer (SDE-1)',
    hireabilityBoost: '+45% Hireability Jump',
    competitorSavings: 'Save ₹2,45,000 vs Scaler/Masai (Zero ISA Debt)',
    flagshipBuildByTrack: {
      web_fullstack: {
        title: 'Multi-Tenant SaaS Engine with Webhooks & RBAC',
        desc: 'Complete commercial SaaS platform with workspace isolation, Razorpay subscription webhooks, and audit logs.',
        tech: ['Next.js 14', 'PostgreSQL', 'Supabase', 'Razorpay', 'RBAC'],
        icon: '💼'
      },
      python_ai: {
        title: 'RAG Knowledge Graph Search & Document Retrieval Engine',
        desc: 'Vector similarity search engine with chunking, pgvector indexing, and semantic hybrid retrieval API.',
        tech: ['Python', 'FastAPI', 'pgvector', 'LangChain', 'PostgreSQL'],
        icon: '🧠'
      }
    },
    journeySteps: [
      { step: 1, title: 'Daily 1-Hr Quests', subtitle: 'Frontend, APIs & Databases', duration: 'Months 1–3', icon: '📚' },
      { step: 2, title: '1-Month Live Capstone', subtitle: 'Build Multi-Tenant Platform', duration: 'Month 4', icon: '🚀' },
      { step: 3, title: 'PinIT Labs Fellowship', subtitle: 'Sprint Audits & Experience Letter', duration: 'Months 5–6', icon: '🏢' }
    ],
    features: [
      '90 Days of Structured Daily 1-Hour Curriculum',
      '1-Month End-to-End Capstone Project with Code Review',
      '2-3 Months Real-Time Industry Internship Experience',
      'Dual Verifiable Certificates (Project + Real-Time Internship)',
      'Production Student Portfolio Hosted & Live on Web',
      'Bi-Weekly Practice Tests with Immediate Radar Reports',
      'AI-Powered Mock Technical & HR Interviews',
      'Corporate English + Business Presentation Training'
    ],
    deliverables: {
      projectCertificate: true,
      internshipCertificate: true,
      fullPortfolio: true,
      trainingProofSha256: true,
      timelineTracker: true,
      careerGrowthGraph: true,
      interviewPrep: 'AI Interview Practice + Behavioral & System Basics',
      languagesIncluded: ['Corporate Level English'],
      practiceTestsCount: 12
    },
    modulesByTrack: {
      web_fullstack: [
        {
          month: 1,
          courseId: 'course-react-web',
          title: 'Month 1: Frontend & React Ecosystem',
          desc: 'Component design, state management, and modern responsive UI.',
          icon: '⚛️',
          skills: ['React', 'TypeScript', 'Tailwind', 'CSS Architecture']
        },
        {
          month: 2,
          courseId: 'course-fullstack-js',
          title: 'Month 2: Backend APIs & Node Services',
          desc: 'RESTful API construction, Express/Node.js, authentication & security.',
          icon: '⚙️',
          skills: ['Node.js', 'Express', 'JWT Auth', 'API Architecture']
        },
        {
          month: 3,
          courseId: 'course-database-eng',
          title: 'Month 3: Database Engineering & Deployments',
          desc: 'Relational & NoSQL databases, indexing, migrations, and cloud hosting.',
          icon: '💾',
          skills: ['PostgreSQL', 'MongoDB', 'Prisma', 'Cloud Deployment']
        }
      ],
      python_ai: [
        {
          month: 1,
          courseId: 'course-python-backend',
          title: 'Month 1: Python Architecture & APIs',
          desc: 'High-performance Python backend engineering and FastAPI services.',
          icon: '🐍',
          skills: ['Python', 'FastAPI', 'Pydantic', 'AsyncIO']
        },
        {
          month: 2,
          courseId: 'course-dsa-optim',
          title: 'Month 2: Algorithms & Problem Solving',
          desc: 'Data structures, algorithm optimization, and competitive coding.',
          icon: '⚡',
          skills: ['DSA', 'Complexity Analysis', 'Dynamic Programming']
        },
        {
          month: 3,
          courseId: 'course-database-eng',
          title: 'Month 3: Databases & Data Pipelines',
          desc: 'Relational data modeling, SQL query tuning, and pipeline ingestion.',
          icon: '📊',
          skills: ['PostgreSQL', 'SQL Optimization', 'ORM', 'ETL Basics']
        }
      ]
    }
  },
  {
    id: 'plan-6m-pro',
    tier: '6m',
    title: '6-Month Professional Crash Program',
    subtitle: 'High-Scale Systems, Cloud Native & DevOps',
    badge: '★ RECOMMENDED',
    highlightColor: '#10b981',
    trainingDurationMonths: 6,
    trainingDurationDays: 180,
    dailyCommitment: 'Daily 1 Hr Learning + Practice Labs',
    projectDurationMonths: 1,
    internshipDurationMonths: '2-3 Months',
    totalProgramDuration: '8-9 Months Total',
    pinsPrice: 2200,
    inrPrice: 17999,
    scholarCashbackPins: 700,
    targetRole: 'Full-Stack Systems Engineer / DevOps SDE',
    hireabilityBoost: '+70% Hireability Jump',
    competitorSavings: 'Save ₹2,80,000 vs full-time bootcamp with flexible pacing',
    flagshipBuildByTrack: {
      web_fullstack: {
        title: 'Enterprise Microservices & Event-Driven Cloud Platform',
        desc: 'Decoupled service architecture with Kafka/RabbitMQ events, Docker orchestration, and CI/CD automated testing.',
        tech: ['Node.js', 'Docker', 'Kubernetes', 'Kafka', 'PostgreSQL', 'AWS'],
        icon: '🌐'
      },
      python_ai: {
        title: 'Distributed Autonomous Agent Orchestration Pipeline',
        desc: 'Multi-agent decision framework with tool execution, memory state persistence, and streaming telemetry.',
        tech: ['Python', 'FastAPI', 'Celery', 'Docker', 'Redis', 'OpenAI'],
        icon: '🤖'
      }
    },
    journeySteps: [
      { step: 1, title: 'Daily 1-Hr Quests', subtitle: 'Full-Stack, Cloud & DevOps', duration: 'Months 1–6', icon: '⚙️' },
      { step: 2, title: '1-Month Live Capstone', subtitle: 'Enterprise Distributed System', duration: 'Month 7', icon: '🚀' },
      { step: 3, title: 'PinIT Labs Fellowship', subtitle: 'Senior Code Defense & Letters', duration: 'Months 8–9', icon: '🏢' }
    ],
    features: [
      '180 Days of Advanced Multi-Tier Software Engineering',
      '1-Month Production Enterprise Capstone Project',
      '2-3 Months Real-Time Industry Internship with Live Mentorship',
      'Dual Verifiable Certificates (Project + Real-Time Internship)',
      'Multi-Repository Production Portfolio on GitHub',
      'Weekly Comprehensive Mock Tests with Skill Gap Diagnosis',
      '1v1 Mock Interviews with Senior Industry Evaluators',
      'Corporate English + Choice of German or French Language Training'
    ],
    deliverables: {
      projectCertificate: true,
      internshipCertificate: true,
      fullPortfolio: true,
      trainingProofSha256: true,
      timelineTracker: true,
      careerGrowthGraph: true,
      interviewPrep: '1v1 Mock Technical Boards + System Design Rounds',
      languagesIncluded: ['Corporate Level English', 'German (A1-A2)', 'French (A1)'],
      practiceTestsCount: 24
    },
    modulesByTrack: {
      web_fullstack: [
        { month: 1, courseId: 'course-react-web', title: 'Month 1: Frontend Mastery', desc: 'React, Next.js, and Modern UI', icon: '⚛️', skills: ['React', 'Next.js'] },
        { month: 2, courseId: 'course-fullstack-js', title: 'Month 2: Backend Architecture', desc: 'Distributed Node Services & REST/GraphQL', icon: '⚙️', skills: ['Node.js', 'APIs'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Scalable Databases', desc: 'SQL, NoSQL, and Caching', icon: '💾', skills: ['PostgreSQL', 'Redis'] },
        { month: 4, courseId: 'course-devops-cicd', title: 'Month 4: CI/CD & Containers', desc: 'Docker, GitHub Actions, and Pipeline Ops', icon: '🔄', skills: ['Docker', 'CI/CD'] },
        { month: 5, courseId: 'course-cloud-native', title: 'Month 5: Cloud Native Deployments', desc: 'AWS/GCP Cloud Architecture & Serverless', icon: '☁️', skills: ['AWS', 'Cloud'] },
        { month: 6, courseId: 'course-design-systems', title: 'Month 6: Design Systems & UX', desc: 'Enterprise Component Libraries & Accessibility', icon: '🎨', skills: ['Design Systems', 'UX'] }
      ],
      python_ai: [
        { month: 1, courseId: 'course-python-backend', title: 'Month 1: Python Engineering', desc: 'Core Python, AsyncIO, and APIs', icon: '🐍', skills: ['Python', 'FastAPI'] },
        { month: 2, courseId: 'course-dsa-optim', title: 'Month 2: Advanced DSA', desc: 'Graph algorithms, Trees, and Optimization', icon: '⚡', skills: ['DSA', 'Algorithms'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Data Warehousing', desc: 'PostgreSQL, Data Modeling & ETL', icon: '💾', skills: ['SQL', 'Data Modeling'] },
        { month: 4, courseId: 'course-ai-eng', title: 'Month 4: Machine Learning & LLMs', desc: 'Applied AI, Vector DBs, and Embeddings', icon: '🤖', skills: ['Machine Learning', 'LLMs'] },
        { month: 5, courseId: 'course-distributed-sys', title: 'Month 5: Distributed Computing', desc: 'Microservices, Message Brokers, and Queues', icon: '🌐', skills: ['Kafka', 'Distributed Systems'] },
        { month: 6, courseId: 'course-cloud-native', title: 'Month 6: Production Cloud AI', desc: 'Model deployment, Monitoring, and MLOps', icon: '☁️', skills: ['MLOps', 'Cloud Deployment'] }
      ]
    }
  },
  {
    id: 'plan-9m-master',
    tier: '9m',
    title: '9-Month Master Fellowship',
    subtitle: 'Zero-to-Hero Engineering & Guaranteed Placement Readiness',
    badge: '🏆 ENTERPRISE GRADE',
    highlightColor: '#f59e0b',
    trainingDurationMonths: 9,
    trainingDurationDays: 270,
    dailyCommitment: 'Daily 1 Hr Learning + Practice Labs',
    projectDurationMonths: 1,
    internshipDurationMonths: '2-3 Months',
    totalProgramDuration: '1 Year Total Immersion',
    pinsPrice: 3500,
    inrPrice: 24999,
    scholarCashbackPins: 1200,
    targetRole: 'Lead Full-Stack AI Engineer / Systems Architect',
    hireabilityBoost: '+90% Hireability Jump',
    competitorSavings: 'Save ₹3,25,000 vs university postgraduate diploma',
    flagshipBuildByTrack: {
      web_fullstack: {
        title: 'Autonomous Multi-Agent Copilot Platform with Vector Search',
        desc: 'End-to-end AI-first operating system with real-time audio streaming, sandboxed code runner, and enterprise security.',
        tech: ['Next.js 14', 'TypeScript', 'pgvector', 'Docker', 'OAuth2', 'WebSockets'],
        icon: '🏆'
      },
      python_ai: {
        title: 'Enterprise Production MLOps & Real-Time Inference Gateway',
        desc: 'High-throughput LLM gateway with model fallback routing, token bucket rate limits, and latency telemetry.',
        tech: ['Python 3.12', 'Torch', 'FastAPI', 'Triton', 'PostgreSQL', 'Grafana'],
        icon: '🔮'
      }
    },
    journeySteps: [
      { step: 1, title: 'Daily 1-Hr Quests', subtitle: 'Full Software Lifecycle & AI', duration: 'Months 1–9', icon: '🎓' },
      { step: 2, title: '1-Month Live Capstone', subtitle: 'Flagship Autonomous Platform', duration: 'Month 10', icon: '🚀' },
      { step: 3, title: 'PinIT Labs Fellowship', subtitle: 'Venture Studio Apprenticeship', duration: 'Months 11–12', icon: '🏢' }
    ],
    features: [
      '270 Days of Rigorous Full-Lifecycle Software Engineering',
      '1-Month Enterprise Scaled Capstone (Multi-service Production)',
      '2-3 Months Real-Time Industry Internship with Corporate Credentials',
      'Dual Verifiable Certificates (Project + Real-Time Internship)',
      'Full Placement-Ready Interview Preparation & Company Specific Mock Tests',
      'Comprehensive Practice Tests with Instant Diagnostic Reports & Skill Heatmap',
      'Complete Language Suite: Corporate English, German, French & Spanish',
      'Verified Career Growth Graph & Oral Capstone Defense Board Review'
    ],
    deliverables: {
      projectCertificate: true,
      internshipCertificate: true,
      fullPortfolio: true,
      trainingProofSha256: true,
      timelineTracker: true,
      careerGrowthGraph: true,
      interviewPrep: 'Full Placement Readiness, Referral Pipeline & FAANG/MNC Prep',
      languagesIncluded: ['Corporate Level English', 'German', 'French', 'Spanish'],
      practiceTestsCount: 36
    },
    modulesByTrack: {
      web_fullstack: [
        { month: 1, courseId: 'course-react-web', title: 'Month 1: Frontend Architecture', desc: 'React, Next.js, and Modern UI', icon: '⚛️', skills: ['React', 'Next.js'] },
        { month: 2, courseId: 'course-fullstack-js', title: 'Month 2: Distributed Node Services', desc: 'Backend APIs & REST/GraphQL', icon: '⚙️', skills: ['Node.js', 'APIs'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Scalable Databases', desc: 'SQL, NoSQL, and Caching', icon: '💾', skills: ['PostgreSQL', 'Redis'] },
        { month: 4, courseId: 'course-dsa-optim', title: 'Month 4: System DSA & LeetCode Prep', desc: 'Data Structures and Speed Optimization', icon: '⚡', skills: ['DSA', 'Algorithms'] },
        { month: 5, courseId: 'course-devops-cicd', title: 'Month 5: DevOps & Kubernetes', desc: 'Docker, CI/CD, and Container Orchestration', icon: '🔄', skills: ['Docker', 'Kubernetes'] },
        { month: 6, courseId: 'course-cloud-native', title: 'Month 6: High-Scale Cloud Systems', desc: 'Serverless, CDN, and Security', icon: '☁️', skills: ['AWS', 'Cloud Security'] },
        { month: 7, courseId: 'course-distributed-sys', title: 'Month 7: Microservices & Event Streams', desc: 'Kafka, RabbitMQ, and Distributed Consistency', icon: '🌐', skills: ['Kafka', 'Microservices'] },
        { month: 8, courseId: 'course-cybersecurity', title: 'Month 8: AppSec & Enterprise Defense', desc: 'OWASP, JWT Hardening, and Pentesting', icon: '🛡️', skills: ['Security', 'OAuth'] },
        { month: 9, courseId: 'course-ai-eng', title: 'Month 9: Applied AI Integrations', desc: 'LLMs, AI Agents, and Intelligent Features', icon: '🤖', skills: ['AI Agents', 'OpenAI API'] }
      ],
      python_ai: [
        { month: 1, courseId: 'course-python-backend', title: 'Month 1: Python Core & AsyncIO', desc: 'High-performance Python Services', icon: '🐍', skills: ['Python', 'FastAPI'] },
        { month: 2, courseId: 'course-dsa-optim', title: 'Month 2: Algorithms & Problem Solving', desc: 'DSA Optimization & Interview Patterns', icon: '⚡', skills: ['DSA', 'Patterns'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Big Data Stores & SQL', desc: 'Database Engineering and Tuning', icon: '💾', skills: ['PostgreSQL', 'SQL'] },
        { month: 4, courseId: 'course-ai-eng', title: 'Month 4: Machine Learning Pipelines', desc: 'Scikit-learn, Vector DBs, and Embeddings', icon: '🤖', skills: ['ML', 'Vector DBs'] },
        { month: 5, courseId: 'course-distributed-sys', title: 'Month 5: Distributed Data Streams', desc: 'Kafka, Celery Workers, and Redis Queues', icon: '🌐', skills: ['Celery', 'Kafka'] },
        { month: 6, courseId: 'course-cloud-native', title: 'Month 6: Cloud Native MLOps', desc: 'Docker, AWS SageMaker, and Kubernetes', icon: '☁️', skills: ['AWS', 'MLOps'] },
        { month: 7, courseId: 'course-nlp', title: 'Month 7: Natural Language Processing', desc: 'Transformers, HuggingFace, and Fine-Tuning', icon: '🧠', skills: ['Transformers', 'NLP'] },
        { month: 8, courseId: 'course-quant-systems', title: 'Month 8: High-Frequency Analytics', desc: 'Quant Algorithms & Real-time Dashboards', icon: '📈', skills: ['Quant', 'Pandas'] },
        { month: 9, courseId: 'course-ai-prompt-literacy', title: 'Month 9: Autonomous AI Agents', desc: 'LangChain, Multi-Agent Systems & Production', icon: '⚡', skills: ['AI Agents', 'LangChain'] }
      ]
    }
  }
];

export function getCrashPlanById(id: string): CrashPlan | undefined {
  return CRASH_COURSE_PLANS.find(p => p.id === id);
}

export function getCrashPlanByTier(tier: '1m' | '3m' | '6m' | '9m'): CrashPlan | undefined {
  return CRASH_COURSE_PLANS.find(p => p.tier === tier);
}
