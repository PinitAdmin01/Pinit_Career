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
