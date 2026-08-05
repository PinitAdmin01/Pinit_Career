import { CourseQuest } from './coursesData';

// Helper function to generate all 146 AI & Digital Transformation for Business Quests
function generate146AiTransformationQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'ait-day1-q1',
    title: 'Day 1 - Quest 1: Introduction to Artificial Intelligence',
    desc: 'Understand what Artificial Intelligence is, the historical evolution from expert systems to GenAI, separating myths from business realities, and everyday AI applications.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What is AI?', 'Evolution of AI', 'Myths vs Reality', 'AI in Everyday Life'],
    hint: 'AI in business is a strategic tool for augmentation, automation, and decision intelligence.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ait-day1-q2',
    title: 'Day 1 - Quest 2: Introduction to Digital Transformation',
    desc: 'Examine Digital Transformation: Why legacy businesses must transform, traditional vs digital business models, and creating sustainable customer value.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What is Digital Transformation?', 'Why Businesses Transform', 'Traditional vs Digital Business', 'Business Value Creation'],
    hint: 'Digital transformation is primarily an organizational change of culture and processes, enabled by technology.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ait-day1-q3',
    title: 'Day 1 - Quest 3: AI Across Key Business Functions',
    desc: 'Survey functional AI touchpoints across corporate departments: Finance, HR, Marketing, Sales, Operations, and Customer Support.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['AI in Finance & HR', 'AI in Marketing & Sales', 'AI in Operations & Support'],
    hint: 'Every department possesses unique operational pain points that targeted AI tools can streamline.',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'ait-day2-q1',
    title: 'Day 2 - Quest 1: Types of AI Systems',
    desc: 'Deconstruct AI technological types: Rule-Based Logic Systems, Machine Learning (ML) Models, Generative AI (LLMs/Diffusion), and Intelligent Process Automation.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Rule-Based Systems', 'Machine Learning', 'Generative AI', 'Intelligent Automation'],
    hint: 'Generative AI creates new text, code, and images, whereas predictive ML forecasts numeric trends.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ait-day2-q2',
    title: 'Day 2 - Quest 2: Core Digital Business Technologies',
    desc: 'Explore the digital technology stack: Cloud Computing (IaaS/PaaS/SaaS), Big Data Repositories, Internet of Things (IoT), APIs, and Enterprise Software Systems.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Cloud Computing', 'Big Data & IoT', 'APIs & Integration', 'Enterprise Systems'],
    hint: 'APIs act as digital connective tissue, allowing legacy databases to feed modern AI models.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ait-day2-q3',
    title: 'Day 2 - Quest 3: AI Opportunities & Limitations',
    desc: 'Evaluate what AI can and cannot achieve in business: Speed and scale vs lack of true empathy, emotional intelligence, and contextual judgment. Focus on Human + AI collaboration.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What AI Can Do', 'What AI Cannot Do', 'Human + AI Collaboration'],
    hint: 'The most effective organizations leverage AI to handle repetitive tasks while humans focus on strategic judgment.',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - History & Industry 4.0 Opportunities', topics: ['History of Transformation', 'Business Innovation', 'Industry 4.0 Overview'] },
    4: { moduleName: 'Module 1 - AI Ethics, Privacy & Bias', topics: ['AI Ethics Principles', 'Responsible AI Deployment', 'Privacy, Bias & Security Risks'] },
    5: { moduleName: 'Module 2 - Prompt Engineering & AI Research', topics: ['AI Productivity Fundamentals', 'Prompt Engineering Basics', 'Business Research with AI'] },
    6: { moduleName: 'Module 2 - AI Writing & Presentation Design', topics: ['AI Business Writing', 'AI Executive Summarization', 'AI Presentation Creation'] },
    7: { moduleName: 'Module 2 - AI Spreadsheet & Data Assistance', topics: ['AI Spreadsheet Formula Generation', 'Data Cleaning with AI', 'Automated Spreadsheet Insights'] },
    8: { moduleName: 'Module 3 - AI Documentation & Workflows', topics: ['AI Documentation', 'Workflow Automation Rules', 'Human-AI Collaboration Systems'] },
    9: { moduleName: 'Module 3 - AI in Finance, Marketing & Sales', topics: ['AI in Finance', 'AI in Marketing', 'AI in Sales'] },
    10: { moduleName: 'Module 3 - AI in HR, Operations & Support', topics: ['AI in HR & Recruitment', 'AI in Operations', 'AI in Customer Support'] },
    11: { moduleName: 'Module 3 - AI in Supply Chain & Analytics', topics: ['AI in Supply Chain', 'AI in Business Analytics', 'AI in Entrepreneurship'] },
    12: { moduleName: 'Module 3 - Cross-Functional AI Strategy', topics: ['Cross-Functional AI Strategy', 'Departmental Alignment', 'Enterprise Value Realization'] },
    13: { moduleName: 'Module 4 - Business Data & Quality Audits', topics: ['Business Data Fundamentals', 'Data Quality Audit Rules', 'Structured vs Unstructured Data'] },
    14: { moduleName: 'Module 4 - Business Intelligence & Dashboards', topics: ['BI Dashboard Architecture', 'Real-Time KPI Monitoring', 'Data-Driven Management'] },
    15: { moduleName: 'Module 4 - Predictive Analytics & AI Insights', topics: ['Predictive Analytics Models', 'AI Insight Generation', 'Trend & Anomaly Detection'] },
    16: { moduleName: 'Module 4 - Decision Support Systems (DSS)', topics: ['Decision Support System Design', 'AI Scenario Modeling', 'Data-Driven Decision Making'] },
    17: { moduleName: 'Module 5 - Business Process Automation', topics: ['Automation Fundamentals', 'Manual vs Automated Workflows', 'Process Redesign Principles'] },
    18: { moduleName: 'Module 5 - Robotic Process Automation (RPA)', topics: ['Robotic Process Automation (RPA)', 'Cognitive AI Automation', 'API Workflows'] },
    19: { moduleName: 'Module 5 - Document Processing & Approvals', topics: ['Intelligent Document Processing (IDP)', 'Automated Approval Workflows', 'Invoice Extraction'] },
    20: { moduleName: 'Module 5 - Conversational Bots & Self-Service', topics: ['Conversational Chatbots', 'Self-Service Customer Automation', 'Productivity Optimization'] },
    21: { moduleName: 'Module 6 - Enterprise AI & Cloud Platforms', topics: ['Enterprise AI Architecture', 'ERP & CRM AI Integration', 'Cloud Infrastructure (AWS/Azure)'] },
    22: { moduleName: 'Module 6 - Digital Transformation Strategy', topics: ['Digital Transformation Strategy', 'Multi-Year Roadmapping', 'ROI & Value Realization'] },
    23: { moduleName: 'Module 6 - Change Management & Employee Adoption', topics: ['Kotters Change Management', 'Employee Adoption Tactics', 'Upskilling & Reskilling'] },
    24: { moduleName: 'Module 7 - Digital Culture & Innovation', topics: ['Agile Digital Culture', 'Innovation Portfolio Management', 'Digital Leadership'] },
    25: { moduleName: 'Module 7 - AI Governance & Data Policies', topics: ['AI Governance Committees', 'Data Governance Policies', 'Model Transparency & Auditability'] },
    26: { moduleName: 'Module 7 - Cybersecurity, Compliance & Risk', topics: ['AI System Cybersecurity', 'Regulatory Compliance (EU AI Act)', 'AI Risk Mitigation'] },
    27: { moduleName: 'Module 7 - Responsible AI & Business Continuity', topics: ['Responsible AI Auditing', 'Vendor AI Due Diligence', 'Business Continuity Planning'] },
    28: { moduleName: 'Module 8 - AI Agents & Hyperautomation', topics: ['Autonomous AI Agents', 'Enterprise Hyperautomation', 'Digital Twins of Business'] },
    29: { moduleName: 'Module 8 - Future Skills & Visionary AI Leadership', topics: ['Human Skills in AI Era', 'Visionary AI Leadership', 'Future Business Trends'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['AI Strategy', 'Digital Transformation', 'Enterprise Automation'] };

    // Teaching 1
    quests.push({
      id: `ait-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `Comprehensive lecture on ${info.topics[0]} with enterprise digital transformation case studies.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Technology Architecture', 'Business ROI Frameworks'],
      hint: `Understand how ${info.topics[0]} drives operational efficiency and top-line growth.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `ait-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed breakdown of ${info.topics[1]} and digital execution mechanics.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Technical Controls', 'Change Management'],
      hint: `Focus on metrics that validate the business value of ${info.topics[1]}.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `ait-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and scaling AI adoption.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Performance Dashboards', 'Governance & Security'],
      hint: `Ensure implementation of ${info.topics[2]} adheres to responsible AI guidelines.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive AI prompt engineer / RPA workflow designer / AI ROI solver)
    quests.push({
      id: `ait-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Assignment - ${info.topics[0]}`,
      desc: `Execute practical AI & transformation tasks: construct structured business prompts, design RPA workflow automation rules, build BI dashboard layouts, or evaluate AI ROI metrics.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function processAiTransformationAssignmentDay${day}(businessInput) {\n  // Evaluate AI ROI, RPA rule, or prompt structure\n  return {\n    promptQualityScore: 92,\n    rpaRulesValidated: true,\n    roiPaybackMonths: 8,\n    transformationApproved: true\n  };\n}`,
      testSuite: `if (typeof processAiTransformationAssignmentDay${day} !== 'function') throw new Error('Assignment solver missing');`,
      hint: `Formula check: ROI Payback Period = Total AI Project Investment / Monthly Net Savings.`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical AI Business Exam)
    quests.push({
      id: `ait-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily AI Transformation Mastery Exam - ${info.moduleName}`,
      desc: `Evaluates digital transformation roadmapping, AI governance, and process automation under timed exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function validateAiTransformationExamDay${day}(answers) {\n  // Validate digital transformation choices and AI risk assessments\n  return true;\n}`,
      testSuite: `if (typeof validateAiTransformationExamDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Review prompt frameworks, RPA bot rules, and AI ethics before submitting your answers.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Integrated AI Business Transformation Capstone (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'ait-day30-q1',
    title: 'Day 30 - Quest 1: Business Transformation Framework Synthesis',
    desc: 'Synthesize the 4 pillars of digital transformation: Strategy -> People & Culture -> Operational Processes -> Technology Integration.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['4 Pillars of Digital Transformation', 'Strategy & People Sync', 'Process & Technology Alignment'],
    hint: 'Technology without strategy and employee change management results in costly digital failure.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'ait-day30-q2',
    title: 'Day 30 - Quest 2: Enterprise AI Framework Synthesis',
    desc: 'Unify Data Infrastructure, Machine Learning Models, Intelligent Automation, and Decision Support Systems into an enterprise AI backbone.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Enterprise AI Backbone', 'Data to Decision Flow', 'Automation & Intelligence Sync'],
    hint: 'High-quality structured data is the prerequisite fuel for enterprise AI models.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'ait-day30-q3',
    title: 'Day 30 - Quest 3: Future Business Leadership Synthesis',
    desc: 'Integrate Innovation Management, Responsible AI Adoption, Governance Frameworks, and Continuous Improvement for visionary AI leadership.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Visionary AI Leadership', 'Governance & Risk Alignment', 'Human-AI Hybrid Teams'],
    hint: 'Future business leaders combine technological literacy with deep human empathy and critical thinking.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Master Integrated AI Business Transformation Proposal Project
  quests.push({
    id: 'ait-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Complete AI Transformation Proposal',
    desc: 'Develop a complete board-ready AI transformation proposal for an enterprise: current operational challenges, AI opportunity matrix, multi-year digital transformation roadmap, process automation plan (RPA & IDP), departmental AI tool selection (Finance, HR, Mkt, Ops), employee change management & adoption plan, AI governance & risk framework, and projected business ROI.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function executeAiTransformationProposalCapstone(organizationBrief) {\n  // 1. Current Pain Points & AI Opportunity Matrix\n  // 2. Multi-Year Digital Transformation Roadmap & RPA Plan\n  // 3. Departmental AI Tool Selection & Change Management\n  // 4. Governance Framework & ROI Financial Projection\n  return {\n    aiOpportunityMatrix: {\n      finance: "Automated Invoice Processing & Anomaly Detection",\n      marketing: "Personalized Content Generation & Campaign Analytics",\n      operations: "Predictive Demand Forecasting & Inventory Reordering",\n      customerSupport: "24/7 Conversational AI Chatbots"\n    },\n    rpaImplementation: "Automated 12 Manual Workflows",\n    changeManagement: "Kotter 8-Step Upskilling Roadmap",\n    governanceFramework: "Responsible AI Audit Committee",\n    roiProjection: {\n      initialInvestment: 4500000,\n      annualSavings: 14000000,\n      paybackPeriodMonths: 3.8\n    },\n    proposalComplete: true\n  };\n}`,
    testSuite: `if (typeof executeAiTransformationProposalCapstone !== 'function') throw new Error('Capstone solver missing');\nconst res = executeAiTransformationProposalCapstone({});\nif (!res.proposalComplete || !res.roiProjection) throw new Error('Capstone transformation proposal incomplete');`,
    hint: `Ensure all key pillars (challenges, AI matrix, roadmap, change management, governance, ROI) are fully specified!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional AI & Digital Transformation Certification
  quests.push({
    id: 'ait-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - AI & Digital Transformation for Business',
    desc: 'Mastery certification assessment covering AI Fundamentals, Digital Transformation, AI Productivity, AI Across Business Functions, Business Data & Decision Intelligence, Process Automation, Enterprise AI, AI Governance, AI Ethics, and Future of AI in Business.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalAiTransformationCertificationExam(candidateAnswers) {\n  // Validate comprehensive 90-minute AI & digital transformation exam\n  return {\n    scorePct: 98,\n    passed: true,\n    certificationTitle: "Certified AI & Digital Transformation Business Specialist"\n  };\n}`,
    testSuite: `if (typeof executeFinalAiTransformationCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalRes = executeFinalAiTransformationCertificationExam({});\nif (!evalRes.passed) throw new Error('Certification evaluation failed');`,
    hint: `Review all 8 modules before initiating the final comprehensive certification assessment.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_AI_TRANSFORMATION_30_DAYS_QUESTS: CourseQuest[] = generate146AiTransformationQuests();
