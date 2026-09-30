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
  tier: '1m' | '3m' | '6m' | '9m' | '12m' | '24m';
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
  /** Plan-specific wording of the capstone sprints (see getCapstoneSprints). */
  capstoneSprintsByTrack?: Partial<Record<'web_fullstack' | 'python_ai', Partial<Record<1 | 2 | 3 | 4, {
    title?: string;
    description?: string;
    check?: string;
    field?: { label: string; placeholder: string };
  }>>>>;
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

/**
 * The internship / PinIT Labs fellowship phase is not built yet (owner decision 2026-09-27: hide it
 * until it exists). While false, plans shown to students and buyers promise no internship, no
 * fellowship step and no internship certificate. Set to true once the internship module ships.
 */
export const INTERNSHIP_AVAILABLE = false;

const ALL_CRASH_COURSE_PLANS: CrashPlan[] = [
  {
    id: 'plan-1m-sprint',
    tier: '1m',
    title: '1-Month Fast-Track Sprint',
    subtitle: 'Foundation & Core Competency Booster',
    highlightColor: '#38bdf8',
    trainingDurationMonths: 1,
    trainingDurationDays: 30,
    dailyCommitment: 'About 1 hour a day: lesson, practice and a project step',
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
        title: 'Recipe Finder & Weekly Meal Planner',
        desc: 'Your own React app, built on your own: search recipes from a free public API, save favourites, plan meals for the week, and put it online with a live link.',
        tech: ['React', 'React Router', 'Vite', 'Vitest'],
        icon: '🍲'
      },
      python_ai: {
        title: 'Study Planner API',
        desc: 'Your own Python web API, built on your own: add subjects and study tasks with due dates, see what is due this week and your progress per subject, save the data as JSON, test it with pytest, and put it online with a live /docs page.',
        tech: ['Python', 'FastAPI', 'Pydantic', 'pytest'],
        icon: '📚'
      }
    },
    capstoneSprintsByTrack: {
      python_ai: {
        1: {
          title: 'Sprint 1: Plan & Repository',
          description: 'Create a public GitHub repository for your capstone API and add PLAN.md with your user stories, the shape of one task and your list of functions, like you did on Day 23.',
          check: 'We check that the repository is public and your plan file exists in it.',
          field: { label: 'Plan', placeholder: 'https://github.com/you/study-planner/blob/main/PLAN.md' }
        },
        2: {
          title: 'Sprint 2: Core Features',
          description: 'Build the API in the same repository: a logic module and api.py with routes to add and list tasks, mark them done and see a summary per subject, plus pytest tests, like the Expense Tracker on Days 24 to 27.',
          check: 'We check that the API file you link exists in your repository.',
          field: { label: 'API code', placeholder: 'https://github.com/you/study-planner/blob/main/api.py' }
        },
        3: {
          description: 'Put the API online (for example on Render, like on Day 29) and submit its live https address, such as your /docs page.'
        },
        4: {
          description: 'Explain and defend your API in the AI capstone interview (free for enrolled students).'
        }
      },
      web_fullstack: {
        1: {
          title: 'Sprint 1: Plan & Repository',
          description: 'Create a public GitHub repository for your capstone app and add PLAN.md with your user stories, data shape and component tree, like you did on Day 23.',
          check: 'We check that the repository is public and your plan file exists in it.',
          field: { label: 'Plan', placeholder: 'https://github.com/you/recipe-planner/blob/main/PLAN.md' }
        },
        2: {
          title: 'Sprint 2: Core Features',
          description: 'Build the main screens as React components in the same repository: recipe search from the API, a recipe details page, favourites and the weekly plan.',
          check: 'We check that the components folder you link exists in your repository.',
          field: { label: 'Components', placeholder: 'https://github.com/you/recipe-planner/tree/main/src/components' }
        },
        3: {
          description: 'Put the app online (for example on Vercel, like on Day 29) and submit its live https address.'
        },
        4: {
          description: 'Explain and defend your app in the AI capstone interview (free for enrolled students).'
        }
      }
    },
    journeySteps: [
      { step: 1, title: 'Daily 1-Hr Quests', subtitle: 'Core React/Python Foundation', duration: 'Month 1', icon: '⚡' },
      { step: 2, title: '1-Month Capstone Project', subtitle: 'Build and deploy your own app', duration: 'Month 2', icon: '🚀' },
      { step: 3, title: 'PinIT Labs Fellowship', subtitle: 'Code Review & SHA-256 Pass', duration: 'Months 3–4', icon: '🏢' }
    ],
    features: [
      'Daily 1-Hour Micro-Learning & Hands-on Quests',
      '1-Month Production Capstone Project',
      '2-3 Months Real-Time Industry Internship',
      'Verifiable Project-Based Certificate (QR)',
      'Real-Time Internship Certificate & Recommendation',
      'A short test after every 5 lessons, with explanations',
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
      practiceTestsCount: 6
    },
    modulesByTrack: {
      web_fullstack: [
        {
          month: 1,
          courseId: 'course-react-web',
          title: 'Month 1: From JavaScript to React',
          desc: 'JavaScript basics, React components, state, forms, pages and hooks, while building and deploying a Job Tracker app.',
          icon: '⚛️',
          skills: ['JavaScript', 'React', 'React Router', 'Git']
        }
      ],
      python_ai: [
        {
          month: 1,
          courseId: 'course-python-backend',
          title: 'Month 1: From Python Basics to a Web API',
          desc: 'Python basics, lists and dictionaries, files and JSON, classes, testing and Git, while building an Expense Tracker and turning it into a FastAPI web API online.',
          icon: '🐍',
          skills: ['Python', 'FastAPI', 'pytest', 'Git']
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
          title: 'Month 3: Databases with SQL and PostgreSQL',
          desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.',
          icon: '💾',
          skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes']
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
          courseId: 'course-dsa-python',
          title: 'Month 2: Algorithms & Problem Solving',
          desc: 'Data structures, algorithm optimization, and competitive coding.',
          icon: '⚡',
          skills: ['DSA', 'Complexity Analysis', 'Dynamic Programming']
        },
        {
          month: 3,
          courseId: 'course-database-eng',
          title: 'Month 3: Databases with SQL and PostgreSQL',
          desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.',
          icon: '💾',
          skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes']
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
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL', desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.', icon: '💾', skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes'] },
        { month: 4, courseId: 'course-devops-cicd', title: 'Month 4: CI/CD & Containers', desc: 'Docker, GitHub Actions, and Pipeline Ops', icon: '🔄', skills: ['Docker', 'CI/CD'] },
        { month: 5, courseId: 'course-cloud-native', title: 'Month 5: Cloud Native Deployments', desc: 'AWS/GCP Cloud Architecture & Serverless', icon: '☁️', skills: ['AWS', 'Cloud'] },
        { month: 6, courseId: 'course-design-systems', title: 'Month 6: Design Systems & UX', desc: 'Enterprise Component Libraries & Accessibility', icon: '🎨', skills: ['Design Systems', 'UX'] }
      ],
      python_ai: [
        { month: 1, courseId: 'course-python-backend', title: 'Month 1: Python Engineering', desc: 'Core Python, AsyncIO, and APIs', icon: '🐍', skills: ['Python', 'FastAPI'] },
        { month: 2, courseId: 'course-dsa-python', title: 'Month 2: Advanced DSA', desc: 'Graph algorithms, Trees, and Optimization', icon: '⚡', skills: ['DSA', 'Algorithms'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL', desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.', icon: '💾', skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes'] },
        { month: 4, courseId: 'course-ai-python', title: 'Month 4: Machine Learning & LLMs', desc: 'Applied AI, Vector DBs, and Embeddings', icon: '🤖', skills: ['Machine Learning', 'LLMs'] },
        { month: 5, courseId: 'course-distributed-python', title: 'Month 5: Distributed Computing', desc: 'Microservices, Message Brokers, and Queues', icon: '🌐', skills: ['Kafka', 'Distributed Systems'] },
        { month: 6, courseId: 'course-cloud-python', title: 'Month 6: Production Cloud AI', desc: 'Model deployment, Monitoring, and MLOps', icon: '☁️', skills: ['MLOps', 'Cloud Deployment'] }
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
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL', desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.', icon: '💾', skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes'] },
        { month: 4, courseId: 'course-dsa-optim', title: 'Month 4: System DSA & LeetCode Prep', desc: 'Data Structures and Speed Optimization', icon: '⚡', skills: ['DSA', 'Algorithms'] },
        { month: 5, courseId: 'course-devops-cicd', title: 'Month 5: DevOps & Kubernetes', desc: 'Docker, CI/CD, and Container Orchestration', icon: '🔄', skills: ['Docker', 'Kubernetes'] },
        { month: 6, courseId: 'course-cloud-native', title: 'Month 6: High-Scale Cloud Systems', desc: 'Serverless, CDN, and Security', icon: '☁️', skills: ['AWS', 'Cloud Security'] },
        { month: 7, courseId: 'course-distributed-sys', title: 'Month 7: Microservices & Event Streams', desc: 'Kafka, RabbitMQ, and Distributed Consistency', icon: '🌐', skills: ['Kafka', 'Microservices'] },
        { month: 8, courseId: 'course-cybersecurity', title: 'Month 8: AppSec & Enterprise Defense', desc: 'OWASP, JWT Hardening, and Pentesting', icon: '🛡️', skills: ['Security', 'OAuth'] },
        { month: 9, courseId: 'course-ai-eng', title: 'Month 9: Applied AI Integrations', desc: 'LLMs, AI Agents, and Intelligent Features', icon: '🤖', skills: ['AI Agents', 'OpenAI API'] }
      ],
      python_ai: [
        { month: 1, courseId: 'course-python-backend', title: 'Month 1: Python Core & AsyncIO', desc: 'High-performance Python Services', icon: '🐍', skills: ['Python', 'FastAPI'] },
        { month: 2, courseId: 'course-dsa-python', title: 'Month 2: Algorithms & Problem Solving', desc: 'DSA Optimization & Interview Patterns', icon: '⚡', skills: ['DSA', 'Patterns'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL', desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.', icon: '💾', skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes'] },
        { month: 4, courseId: 'course-ai-python', title: 'Month 4: Machine Learning Pipelines', desc: 'Scikit-learn, Vector DBs, and Embeddings', icon: '🤖', skills: ['ML', 'Vector DBs'] },
        { month: 5, courseId: 'course-distributed-python', title: 'Month 5: Distributed Data Streams', desc: 'Kafka, Celery Workers, and Redis Queues', icon: '🌐', skills: ['Celery', 'Kafka'] },
        { month: 6, courseId: 'course-cloud-python', title: 'Month 6: Cloud Native MLOps', desc: 'Docker, AWS SageMaker, and Kubernetes', icon: '☁️', skills: ['AWS', 'MLOps'] },
        { month: 7, courseId: 'course-nlp-python', title: 'Month 7: Natural Language Processing', desc: 'Transformers, HuggingFace, and Fine-Tuning', icon: '🧠', skills: ['Transformers', 'NLP'] },
        { month: 8, courseId: 'course-quant-python', title: 'Month 8: High-Frequency Analytics', desc: 'Quant Algorithms & Real-time Dashboards', icon: '📈', skills: ['Quant', 'Pandas'] },
        { month: 9, courseId: 'course-ai-prompt-python', title: 'Month 9: Autonomous AI Agents', desc: 'LangChain, Multi-Agent Systems & Production', icon: '⚡', skills: ['AI Agents', 'LangChain'] }
      ]
    }
  },
  {
    id: 'plan-12m-fellow',
    tier: '12m',
    title: '12-Month Advanced Industry Fellowship',
    subtitle: 'Enterprise Scale, Cloud Native & Global Tech Placement',
    badge: '🚀 GLOBAL FELLOWSHIP',
    highlightColor: '#8b5cf6',
    trainingDurationMonths: 12,
    trainingDurationDays: 360,
    dailyCommitment: 'Daily 1 Hr Learning + Practice Labs',
    projectDurationMonths: 2,
    internshipDurationMonths: '4-6 Months',
    totalProgramDuration: '16-18 Months Total Immersion',
    pinsPrice: 4500,
    inrPrice: 34999,
    scholarCashbackPins: 1500,
    targetRole: 'Senior Full-Stack Engineer / Cloud AI Architect',
    hireabilityBoost: '+95% Hireability Jump',
    competitorSavings: 'Save ₹4,50,000 vs executive degree / premium bootcamps',
    flagshipBuildByTrack: {
      web_fullstack: {
        title: 'Multi-Region Distributed High-Availability SaaS Cloud',
        desc: 'Global active-active microservices platform with geo-DNS routing, Kafka events, automated failover, and compliance auditing.',
        tech: ['Next.js 14', 'Go / Node.js', 'Kubernetes', 'Kafka', 'Terraform', 'PostgreSQL'],
        icon: '🌐'
      },
      python_ai: {
        title: 'Autonomous Multi-Agent Enterprise Research & Trading Desk',
        desc: 'Distributed multi-agent pipeline executing real-time data ingestion, fine-tuned LLaMA-3 inference, and automated risk scoring.',
        tech: ['Python 3.12', 'Ray', 'PyTorch', 'FastAPI', 'Redis', 'Docker'],
        icon: '🤖'
      }
    },
    journeySteps: [
      { step: 1, title: 'Daily 1-Hr Quests', subtitle: 'Architecture, Cloud & DSA', duration: 'Months 1–12', icon: '🏛️' },
      { step: 2, title: '2-Month Flagship Capstone', subtitle: 'Multi-Region Distributed Platform', duration: 'Months 13–14', icon: '🚀' },
      { step: 3, title: 'Corporate Fellowship', subtitle: 'Tier-1 Company Real-Time Apprenticeship', duration: 'Months 15–18', icon: '🏢' }
    ],
    features: [
      '360 Days of Rigorous Architectural & Systems Engineering',
      '2-Month Multi-Region Enterprise Capstone Project',
      '4-6 Months Guaranteed Real-Time Industry Fellowship',
      'Dual Verifiable Credentials (Flagship Project + Corporate Fellowship)',
      'Direct Tier-1 Product Company Referral Pipeline',
      'Comprehensive Practice Assessments with Live Diagnostic Reports',
      'Complete Global Language Suite: English, German, French & Japanese',
      'Senior Executive Board Oral Capstone Defense & Recommendation Letter'
    ],
    deliverables: {
      projectCertificate: true,
      internshipCertificate: true,
      fullPortfolio: true,
      trainingProofSha256: true,
      timelineTracker: true,
      careerGrowthGraph: true,
      interviewPrep: 'Senior Technical Architecture, System Design & Board Rounds',
      languagesIncluded: ['Corporate Level English', 'German', 'French', 'Japanese'],
      practiceTestsCount: 48
    },
    modulesByTrack: {
      web_fullstack: [
        { month: 1, courseId: 'course-react-web', title: 'Month 1: Frontend Architecture', desc: 'React, Next.js, and Modern UI', icon: '⚛️', skills: ['React', 'Next.js'] },
        { month: 2, courseId: 'course-fullstack-js', title: 'Month 2: Distributed Node Services', desc: 'Backend APIs & REST/GraphQL', icon: '⚙️', skills: ['Node.js', 'APIs'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL', desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.', icon: '💾', skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes'] },
        { month: 4, courseId: 'course-dsa-optim', title: 'Month 4: System DSA & LeetCode Prep', desc: 'Data Structures and Speed Optimization', icon: '⚡', skills: ['DSA', 'Algorithms'] },
        { month: 5, courseId: 'course-devops-cicd', title: 'Month 5: DevOps & Kubernetes', desc: 'Docker, CI/CD, and Container Orchestration', icon: '🔄', skills: ['Docker', 'Kubernetes'] },
        { month: 6, courseId: 'course-cloud-native', title: 'Month 6: High-Scale Cloud Systems', desc: 'Serverless, CDN, and Security', icon: '☁️', skills: ['AWS', 'Cloud Security'] },
        { month: 7, courseId: 'course-distributed-sys', title: 'Month 7: Microservices & Event Streams', desc: 'Kafka, RabbitMQ, and Consistency', icon: '🌐', skills: ['Kafka', 'Microservices'] },
        { month: 8, courseId: 'course-cybersecurity', title: 'Month 8: AppSec & Enterprise Defense', desc: 'OWASP, JWT Hardening, and Pentesting', icon: '🛡️', skills: ['Security', 'OAuth'] },
        { month: 9, courseId: 'course-ai-eng', title: 'Month 9: Applied AI Integrations', desc: 'LLMs, AI Agents, and Intelligent Features', icon: '🤖', skills: ['AI Agents', 'OpenAI API'] },
        { month: 10, courseId: 'course-cloud-native', title: 'Month 10: Multi-Cloud Reliability', desc: 'Terraform, Site Reliability Engineering & SLOs', icon: '📊', skills: ['Terraform', 'SRE'] },
        { month: 11, courseId: 'course-distributed-sys', title: 'Month 11: High-Throughput Streaming', desc: 'Apache Flink, Spark Streaming & Big Data', icon: '🌊', skills: ['Big Data', 'Streaming'] },
        { month: 12, courseId: 'course-ai-prompt-literacy', title: 'Month 12: Production AI Deployment', desc: 'Model Optimization, Quantization & Serving', icon: '⚡', skills: ['Model Serving', 'Triton'] }
      ],
      python_ai: [
        { month: 1, courseId: 'course-python-backend', title: 'Month 1: Python Core & AsyncIO', desc: 'High-performance Python Services', icon: '🐍', skills: ['Python', 'FastAPI'] },
        { month: 2, courseId: 'course-dsa-python', title: 'Month 2: Algorithms & Problem Solving', desc: 'DSA Optimization & Interview Patterns', icon: '⚡', skills: ['DSA', 'Patterns'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL', desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.', icon: '💾', skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes'] },
        { month: 4, courseId: 'course-ai-python', title: 'Month 4: Machine Learning Pipelines', desc: 'Scikit-learn, Vector DBs, and Embeddings', icon: '🤖', skills: ['ML', 'Vector DBs'] },
        { month: 5, courseId: 'course-distributed-python', title: 'Month 5: Distributed Data Streams', desc: 'Kafka, Celery Workers, and Redis Queues', icon: '🌐', skills: ['Celery', 'Kafka'] },
        { month: 6, courseId: 'course-cloud-python', title: 'Month 6: Cloud Native MLOps', desc: 'Docker, AWS SageMaker, and Kubernetes', icon: '☁️', skills: ['AWS', 'MLOps'] },
        { month: 7, courseId: 'course-nlp-python', title: 'Month 7: Natural Language Processing', desc: 'Transformers, HuggingFace, and Fine-Tuning', icon: '🧠', skills: ['Transformers', 'NLP'] },
        { month: 8, courseId: 'course-quant-python', title: 'Month 8: High-Frequency Analytics', desc: 'Quant Algorithms & Real-time Dashboards', icon: '📈', skills: ['Quant', 'Pandas'] },
        { month: 9, courseId: 'course-ai-prompt-python', title: 'Month 9: Autonomous AI Agents', desc: 'LangChain, Multi-Agent Systems & Production', icon: '⚡', skills: ['AI Agents', 'LangChain'] },
        { month: 10, courseId: 'course-train-python', title: 'Month 10: Distributed Model Training', desc: 'DeepSpeed, FSDP & Multi-GPU Clusters', icon: '🔥', skills: ['DeepSpeed', 'Distributed Training'] },
        { month: 11, courseId: 'course-vector-python', title: 'Month 11: Production Vector Engines', desc: 'Milvus, Pinecone & Hybrid Search Systems', icon: '🔍', skills: ['Vector DBs', 'Semantic Search'] },
        { month: 12, courseId: 'course-safety-python', title: 'Month 12: Production AI Safety & Guardrails', desc: 'Alignment, Adversarial Robustness & Auditing', icon: '🛡️', skills: ['AI Safety', 'Guardrails'] }
      ]
    }
  },
  {
    id: 'plan-24m-master',
    tier: '24m',
    title: '24-Month Master Engineering & Degree Track',
    subtitle: 'Comprehensive 2-Year Staff Engineer & Technical Leadership Degree Track',
    badge: '👑 STAFF LEVEL DEGREE TRACK',
    highlightColor: '#ec4899',
    trainingDurationMonths: 24,
    trainingDurationDays: 720,
    dailyCommitment: 'Daily 1 Hr Learning + Practice Labs',
    projectDurationMonths: 3,
    internshipDurationMonths: '6-8 Months',
    totalProgramDuration: '30-32 Months Total Immersion',
    pinsPrice: 7500,
    inrPrice: 59999,
    scholarCashbackPins: 2500,
    targetRole: 'Staff Software Engineer / VP of Technology / Startup Founder',
    hireabilityBoost: '+99% Industry Benchmark Supremacy',
    competitorSavings: 'Save ₹12,00,000 vs private university Master of Technology (M.Tech)',
    flagshipBuildByTrack: {
      web_fullstack: {
        title: 'Autonomous Enterprise Cloud Operating System & Compute Grid',
        desc: 'Full-stack cloud virtualization engine with multi-tenant isolation, real-time telemetry, WASM edge execution, and automated Kubernetes orchestration.',
        tech: ['Rust / Go', 'Next.js 14', 'WASM', 'Kubernetes', 'Distributed Consensus (Raft)', 'PostgreSQL'],
        icon: '👑'
      },
      python_ai: {
        title: 'Foundational Multimodal LLM & Autonomous Robotics Brain',
        desc: 'End-to-end proprietary multimodal transformer pipeline with vision-language action tokens, distributed inference clusters, and continuous reinforcement learning.',
        tech: ['Python 3.12', 'PyTorch', 'CUDA', 'Ray', 'Triton', 'vLLM'],
        icon: '🧠'
      }
    },
    journeySteps: [
      { step: 1, title: 'Year 1: Core & Advanced Systems', subtitle: 'Full-Stack, DSA, Distributed Systems & AI', duration: 'Months 1–12', icon: '📚' },
      { step: 2, title: 'Year 2: Staff Architect Specialization', subtitle: 'Large-Scale Infrastructure & Leadership', duration: 'Months 13–24', icon: '🏛️' },
      { step: 3, title: '3-Month Master Capstone', subtitle: 'Proprietary Cloud Grid / Foundational Model', duration: 'Months 25–27', icon: '🚀' },
      { step: 4, title: 'Enterprise Fellowship', subtitle: 'Staff-Level Corporate Engineering Fellowship', duration: 'Months 28–32', icon: '🏢' }
    ],
    features: [
      '720 Days of Elite Staff-Level Software & AI Engineering',
      '3-Month Flagship Master Thesis Capstone Project',
      '6-8 Months Guaranteed Corporate Engineering Fellowship',
      'Dual Verifiable Degree-Equivalent Diplomas (Master Capstone + Fellowship)',
      '1-on-1 Mentorship from Staff Engineers at Top-Tier Tech Companies',
      'Comprehensive Practice Test Suites with Real-Time Dynamic Debugging',
      'Mastery of 4 Languages: Corporate English, German, French, Spanish or Mandarin',
      'Lifelong Priority Corporate Referral Pipeline & VC Angel Introductions'
    ],
    deliverables: {
      projectCertificate: true,
      internshipCertificate: true,
      fullPortfolio: true,
      trainingProofSha256: true,
      timelineTracker: true,
      careerGrowthGraph: true,
      interviewPrep: 'Staff-Level Systems Design, Behavioral Leadership & Executive Board Rounds',
      languagesIncluded: ['Corporate Level English', 'German', 'French', 'Spanish', 'Mandarin'],
      practiceTestsCount: 96
    },
    modulesByTrack: {
      web_fullstack: [
        { month: 1, courseId: 'course-react-web', title: 'Month 1: Frontend Architecture', desc: 'React, Next.js, and Modern UI', icon: '⚛️', skills: ['React', 'Next.js'] },
        { month: 2, courseId: 'course-fullstack-js', title: 'Month 2: Distributed Node Services', desc: 'Backend APIs & REST/GraphQL', icon: '⚙️', skills: ['Node.js', 'APIs'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL', desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.', icon: '💾', skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes'] },
        { month: 4, courseId: 'course-dsa-optim', title: 'Month 4: System DSA & LeetCode Prep', desc: 'Data Structures and Speed Optimization', icon: '⚡', skills: ['DSA', 'Algorithms'] },
        { month: 5, courseId: 'course-devops-cicd', title: 'Month 5: DevOps & Kubernetes', desc: 'Docker, CI/CD, and Container Orchestration', icon: '🔄', skills: ['Docker', 'Kubernetes'] },
        { month: 6, courseId: 'course-cloud-native', title: 'Month 6: High-Scale Cloud Systems', desc: 'Serverless, CDN, and Security', icon: '☁️', skills: ['AWS', 'Cloud Security'] },
        { month: 7, courseId: 'course-distributed-sys', title: 'Month 7: Microservices & Event Streams', desc: 'Kafka, RabbitMQ, and Consistency', icon: '🌐', skills: ['Kafka', 'Microservices'] },
        { month: 8, courseId: 'course-cybersecurity', title: 'Month 8: AppSec & Enterprise Defense', desc: 'OWASP, JWT Hardening, and Pentesting', icon: '🛡️', skills: ['Security', 'OAuth'] },
        { month: 9, courseId: 'course-ai-eng', title: 'Month 9: Applied AI Integrations', desc: 'LLMs, AI Agents, and Intelligent Features', icon: '🤖', skills: ['AI Agents', 'OpenAI API'] },
        { month: 10, courseId: 'course-cloud-native', title: 'Month 10: Multi-Cloud Reliability', desc: 'Terraform, Site Reliability Engineering & SLOs', icon: '📊', skills: ['Terraform', 'SRE'] },
        { month: 11, courseId: 'course-distributed-sys', title: 'Month 11: High-Throughput Streaming', desc: 'Apache Flink, Spark Streaming & Big Data', icon: '🌊', skills: ['Big Data', 'Streaming'] },
        { month: 12, courseId: 'course-ai-prompt-literacy', title: 'Month 12: Production AI Deployment', desc: 'Model Optimization, Quantization & Serving', icon: '⚡', skills: ['Model Serving', 'Triton'] },
        { month: 13, courseId: 'course-distributed-sys', title: 'Month 13: Distributed Consensus Protocols', desc: 'Raft, Paxos, and Distributed State Machines', icon: '🔗', skills: ['Raft', 'Consensus'] },
        { month: 14, courseId: 'course-cybersecurity', title: 'Month 14: Zero-Trust Cloud Security', desc: 'mTLS, SPIFFE/SPIRE, and Cryptographic Identity', icon: '🔐', skills: ['Zero Trust', 'mTLS'] },
        { month: 15, courseId: 'course-cloud-native', title: 'Month 15: Edge Computing & WASM', desc: 'Cloudflare Workers, WebAssembly & Low Latency', icon: '⚡', skills: ['WASM', 'Edge'] },
        { month: 16, courseId: 'course-database-eng', title: 'Month 16: Globally Distributed Databases', desc: 'CockroachDB, Spanner & Multi-Master Replication', icon: '🌍', skills: ['Spanner', 'Distributed DB'] },
        { month: 17, courseId: 'course-devops-cicd', title: 'Month 17: Platform Engineering & GitOps', desc: 'ArgoCD, Custom Kubernetes CRDs & Operator SDK', icon: '⚙️', skills: ['Kubernetes Operators', 'GitOps'] },
        { month: 18, courseId: 'course-fullstack-js', title: 'Month 18: Real-Time Media & WebRTC', desc: 'Peer-to-Peer Streaming, SFUs & Video Pipelines', icon: '🎥', skills: ['WebRTC', 'Media Streams'] },
        { month: 19, courseId: 'course-ai-eng', title: 'Month 19: AI Multi-Agent Mesh', desc: 'Swarm Intelligence & Enterprise Agent Workflows', icon: '🐝', skills: ['Agent Swarms', 'AutoGen'] },
        { month: 20, courseId: 'course-cloud-native', title: 'Month 20: Cost Optimization & FinOps', desc: 'Cloud Billing Optimization & Performance Profiling', icon: '💰', skills: ['FinOps', 'Profiling'] },
        { month: 21, courseId: 'course-cybersecurity', title: 'Month 21: Disaster Recovery & Chaos Engineering', desc: 'Chaos Monkey, Failure Injection & Resiliency', icon: '💥', skills: ['Chaos Engineering', 'Resilience'] },
        { month: 22, courseId: 'course-distributed-sys', title: 'Month 22: High-Performance Networking', desc: 'eBPF, Kernel Bypass & High-Speed Packet Engines', icon: '🚀', skills: ['eBPF', 'Networking'] },
        { month: 23, courseId: 'course-design-systems', title: 'Month 23: Technical Leadership & RFCs', desc: 'System Architecture RFCs & Engineering Governance', icon: '📝', skills: ['RFCs', 'Tech Leadership'] },
        { month: 24, courseId: 'course-dsa-optim', title: 'Month 24: Staff SDE Interview Mastery', desc: 'Elite System Design, Leadership & Placement', icon: '🏆', skills: ['Staff SDE', 'System Design'] }
      ],
      python_ai: [
        { month: 1, courseId: 'course-python-backend', title: 'Month 1: Python Core & AsyncIO', desc: 'High-performance Python Services', icon: '🐍', skills: ['Python', 'FastAPI'] },
        { month: 2, courseId: 'course-dsa-python', title: 'Month 2: Algorithms & Problem Solving', desc: 'DSA Optimization & Interview Patterns', icon: '⚡', skills: ['DSA', 'Patterns'] },
        { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL', desc: 'Tables, queries, joins, grouping, window functions, good design, transactions, indexes and views on PostgreSQL, with a Canteen database project.', icon: '💾', skills: ['PostgreSQL', 'SQL', 'Joins', 'Indexes'] },
        { month: 4, courseId: 'course-ai-python', title: 'Month 4: Machine Learning Pipelines', desc: 'Scikit-learn, Vector DBs, and Embeddings', icon: '🤖', skills: ['ML', 'Vector DBs'] },
        { month: 5, courseId: 'course-distributed-python', title: 'Month 5: Distributed Data Streams', desc: 'Kafka, Celery Workers, and Redis Queues', icon: '🌐', skills: ['Celery', 'Kafka'] },
        { month: 6, courseId: 'course-cloud-python', title: 'Month 6: Cloud Native MLOps', desc: 'Docker, AWS SageMaker, and Kubernetes', icon: '☁️', skills: ['AWS', 'MLOps'] },
        { month: 7, courseId: 'course-nlp-python', title: 'Month 7: Natural Language Processing', desc: 'Transformers, HuggingFace, and Fine-Tuning', icon: '🧠', skills: ['Transformers', 'NLP'] },
        { month: 8, courseId: 'course-quant-python', title: 'Month 8: High-Frequency Analytics', desc: 'Quant Algorithms & Real-time Dashboards', icon: '📈', skills: ['Quant', 'Pandas'] },
        { month: 9, courseId: 'course-ai-prompt-python', title: 'Month 9: Autonomous AI Agents', desc: 'LangChain, Multi-Agent Systems & Production', icon: '⚡', skills: ['AI Agents', 'LangChain'] },
        { month: 10, courseId: 'course-train-python', title: 'Month 10: Distributed Model Training', desc: 'DeepSpeed, FSDP & Multi-GPU Clusters', icon: '🔥', skills: ['DeepSpeed', 'Distributed Training'] },
        { month: 11, courseId: 'course-vector-python', title: 'Month 11: Production Vector Engines', desc: 'Milvus, Pinecone & Hybrid Search Systems', icon: '🔍', skills: ['Vector DBs', 'Semantic Search'] },
        { month: 12, courseId: 'course-ai-python', title: 'Month 12: Production AI Safety & Guardrails', desc: 'Alignment, Adversarial Robustness & Auditing', icon: '🛡️', skills: ['AI Safety', 'Guardrails'] },
        { month: 13, courseId: 'course-ai-python', title: 'Month 13: Transformer Architecture from Scratch', desc: 'Attention Mechanisms, RoPE & CUDA Kernels', icon: '⚙️', skills: ['Custom Attention', 'CUDA'] },
        { month: 14, courseId: 'course-quant-python', title: 'Month 14: LLM Quantization & Hardware Acceleration', desc: 'AWQ, GPTQ, GGUF & TensorRT-LLM', icon: '⚡', skills: ['Quantization', 'TensorRT'] },
        { month: 15, courseId: 'course-nlp-python', title: 'Month 15: Multimodal Vision-Language Models', desc: 'CLIP, LLaVA & Vision Encoders', icon: '👁️', skills: ['Vision Models', 'Multimodal'] },
        { month: 16, courseId: 'course-ai-python', title: 'Month 16: Reinforcement Learning from Human Feedback', desc: 'PPO, DPO & Reward Modeling', icon: '🎯', skills: ['RLHF', 'DPO'] },
        { month: 17, courseId: 'course-distributed-python', title: 'Month 17: Large-Scale Synthetic Data Engines', desc: 'Data Distillation, Filtering & Quality Scanners', icon: '🧪', skills: ['Synthetic Data', 'Data Quality'] },
        { month: 18, courseId: 'course-cloud-python', title: 'Month 18: High-Throughput Inference Clusters', desc: 'vLLM, Continuous Batching & PagedAttention', icon: '🚀', skills: ['vLLM', 'Inference Ops'] },
        { month: 19, courseId: 'course-ai-prompt-python', title: 'Month 19: Long-Horizon Agent Planning', desc: 'Tree-of-Thoughts, ReAct & Sandboxed Execution', icon: '🌲', skills: ['Agent Planning', 'Sandboxing'] },
        { month: 20, courseId: 'course-database-eng', title: 'Month 20: Graph Neural Networks & Knowledge Graphs', desc: 'PyTorch Geometric, Neo4j & Graph Embeddings', icon: '🕸️', skills: ['GNN', 'Knowledge Graphs'] },
        { month: 21, courseId: 'course-cyber-python', title: 'Month 21: Model Extraction & Red Teaming', desc: 'Jailbreaks, Prompt Injections & Model Armor', icon: '🛡️', skills: ['AI Red Teaming', 'Security'] },
        { month: 22, courseId: 'course-cloud-python', title: 'Month 22: Edge AI & Mobile Neural Engines', desc: 'ONNX Runtime, CoreML & TFLite Deployment', icon: '📱', skills: ['Edge AI', 'Mobile Models'] },
        { month: 23, courseId: 'course-design-systems', title: 'Month 23: AI Ethics, Compliance & Governance', desc: 'EU AI Act, Bias Auditing & Watermarking', icon: '⚖️', skills: ['AI Governance', 'Compliance'] },
        { month: 24, courseId: 'course-dsa-python', title: 'Month 24: Principal AI Architect Defense', desc: 'Foundational Model Defense & Staff Level Placements', icon: '🏆', skills: ['Staff AI', 'Architecture'] }
      ]
    }
  }
];

const INTERNSHIP_TEXT = /intern|fellowship|apprentice/i;

/** A plan as it can honestly be sold today: no internship, fellowship or internship certificate. */
function withoutInternship(plan: CrashPlan): CrashPlan {
  const features = plan.features.filter((f) => !INTERNSHIP_TEXT.test(f));
  if (plan.deliverables.projectCertificate && !features.some((f) => /project certificate/i.test(f))) {
    features.push('Verifiable Capstone Project Certificate (online verification)');
  }
  return {
    ...plan,
    internshipDurationMonths: '',
    totalProgramDuration: `${plan.trainingDurationMonths + plan.projectDurationMonths} Months Total`,
    journeySteps: plan.journeySteps.filter((s) => !INTERNSHIP_TEXT.test(`${s.title} ${s.subtitle}`)),
    features,
    deliverables: { ...plan.deliverables, internshipCertificate: false },
  };
}

export const CRASH_COURSE_PLANS: CrashPlan[] = INTERNSHIP_AVAILABLE
  ? ALL_CRASH_COURSE_PLANS
  : ALL_CRASH_COURSE_PLANS.map(withoutInternship);

export function getCrashPlanById(id: string): CrashPlan | undefined {
  return CRASH_COURSE_PLANS.find(p => p.id === id);
}

export function getCrashPlanByTier(tier: '1m' | '3m' | '6m' | '9m' | '12m' | '24m'): CrashPlan | undefined {
  return CRASH_COURSE_PLANS.find(p => p.tier === tier);
}
