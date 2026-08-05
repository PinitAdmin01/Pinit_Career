import { CourseQuest } from './coursesData';

// Helper function to generate all 146 Sales, Customer Success & CRM Quests
function generate146SalesCrmQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'scrm-day1-q1',
    title: 'Day 1 - Quest 1: Introduction to Sales',
    desc: 'Understand what Sales is, why modern revenue generation matters, sales vs marketing functions, and how sales creates long-term customer value.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What is Sales?', 'Why Sales Matters', 'Sales vs Marketing', 'Value Creation in Sales'],
    hint: 'Modern sales is about problem-solving and value creation rather than pushing unwanted products.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'scrm-day1-q2',
    title: 'Day 1 - Quest 2: Understanding Customers',
    desc: 'Examine customer psychology: Customer Needs, Wants, Expectations, Buying Behaviour, and Decision-Making triggers.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Customer Needs & Wants', 'Customer Expectations', 'Buying Behaviour', 'Decision Making Triggers'],
    hint: 'Buyers make emotional purchasing decisions supported by logical justifications.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'scrm-day1-q3',
    title: 'Day 1 - Quest 3: The Customer Journey',
    desc: 'Map the 7-stage customer lifecycle: Awareness -> Interest -> Evaluation -> Purchase -> Onboarding -> Retention -> Brand Advocacy.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Awareness & Interest', 'Evaluation & Purchase', 'Onboarding & Retention', 'Brand Advocacy'],
    hint: 'The sale is only the beginning of the relationship; retention drives compounding business growth.',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'scrm-day2-q1',
    title: 'Day 2 - Quest 1: Types of Sales',
    desc: 'Deconstruct sales business models: B2B (Business-to-Business), B2C (Business-to-Consumer), Retail, Enterprise Sales, and Consultative Selling.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['B2B & B2C Sales', 'Retail Sales', 'Enterprise Sales', 'Consultative Selling'],
    hint: 'B2B sales involve multiple stakeholders, longer deal cycles, and higher contract values.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'scrm-day2-q2',
    title: 'Day 2 - Quest 2: Sales Process Overview',
    desc: 'Trace the 6-stage sales process: Prospecting -> Qualification -> Presentation -> Negotiation -> Closing -> Post-Sale Follow-up.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Prospecting & Qualification', 'Presentation & Negotiation', 'Closing & Follow-up'],
    hint: 'Strict adherence to a defined sales process dramatically increases closing conversion rates.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'scrm-day2-q3',
    title: 'Day 2 - Quest 3: Introduction to Customer Success',
    desc: 'Understand Customer Success fundamentals: Customer Satisfaction (CSAT), Customer Retention Rate, Customer Loyalty, and Lifetime Value (CLV).',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Customer Satisfaction', 'Customer Retention', 'Customer Loyalty', 'Lifetime Value (CLV)'],
    hint: 'Customer Success proactively helps clients achieve their desired outcomes using your solution.',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - Customer Communication & Conduct', topics: ['Customer Communication', 'Professional Behaviour', 'Business Communication Fundamentals'] },
    4: { moduleName: 'Module 1 - Sales Ethics & Relationship Building', topics: ['Sales Ethics', 'Trust Building', 'Relationship Selling'] },
    5: { moduleName: 'Module 2 - Lead Generation & Prospecting', topics: ['Lead Generation Tactics', 'Prospect Identification', 'Prospect Profiling'] },
    6: { moduleName: 'Module 2 - Qualification & Pipeline Stages', topics: ['Lead Qualification (BANT)', 'Sales Pipeline Stages', 'Sales Funnel Management'] },
    7: { moduleName: 'Module 2 - Customer Discovery & Demos', topics: ['Customer Discovery Calls', 'Product Demonstration', 'Value Proposition Alignment'] },
    8: { moduleName: 'Module 2 - Closing & Sales Documentation', topics: ['Follow-up Cadences', 'Closing Techniques', 'Sales Documentation & Proposals'] },
    9: { moduleName: 'Module 3 - Active Listening & Presentations', topics: ['Communication Skills', 'Active Listening', 'Persuasive Presentation Skills'] },
    10: { moduleName: 'Module 3 - Principled Sales Negotiation', topics: ['Negotiation Principles', 'Win-Win Bargaining', 'BATNA & Concession Management'] },
    11: { moduleName: 'Module 3 - Objection Handling (LAER)', topics: ['Objection Handling (LAER)', 'Handling Price Objections', 'Reframing Value'] },
    12: { moduleName: 'Module 3 - Conflict Resolution & Emails', topics: ['Conflict Resolution', 'Persuasion through Value', 'Professional Email Writing'] },
    13: { moduleName: 'Module 4 - Customer Onboarding & Education', topics: ['Customer Onboarding Workflows', 'Customer Education & Training', 'Time-to-Value Acceleration'] },
    14: { moduleName: 'Module 4 - Customer Health & Engagement', topics: ['Customer Health Scores', 'Proactive Customer Engagement', 'Churn Risk Mitigation'] },
    15: { moduleName: 'Module 4 - Support & Complaint Resolution', topics: ['Customer Support Systems', 'Complaint Resolution Workflows', 'Customer Feedback Loops'] },
    16: { moduleName: 'Module 4 - Retention & Brand Advocacy', topics: ['Customer Retention Tactics', 'Loyalty & Referral Programs', 'Customer Advocacy Systems'] },
    17: { moduleName: 'Module 5 - CRM Concepts & Architecture', topics: ['What is CRM?', 'CRM Lifecycle', 'Contact & Account Hierarchy'] },
    18: { moduleName: 'Module 5 - CRM Opportunity & Activity Tracking', topics: ['Opportunity Management', 'Sales Activity Logging', 'Task & Follow-up Scheduling'] },
    19: { moduleName: 'Module 5 - CRM Reporting & Dashboards', topics: ['CRM Pipeline Reports', 'Activity Dashboards', 'Lead Source Attribution'] },
    20: { moduleName: 'Module 5 - CRM Data Hygiene & Adoption', topics: ['CRM Data Hygiene', 'Deduplication & Fields', 'CRM Best Practices'] },
    21: { moduleName: 'Module 6 - Sales KPIs & Conversion Metrics', topics: ['Sales KPIs Tracking', 'Lead Conversion Rate', 'Opportunity Win Rate'] },
    22: { moduleName: 'Module 6 - Financial Unit Economics', topics: ['Customer Acquisition Cost (CAC)', 'Customer Lifetime Value (CLV)', 'CLV:CAC Ratio Optimization'] },
    23: { moduleName: 'Module 6 - Sales Forecasting Methods', topics: ['Sales Forecasting', 'Weighted Pipeline Forecasts', 'Revenue Target Planning'] },
    24: { moduleName: 'Module 6 - Executive Sales Velocity', topics: ['Quota Attainment Monitoring', 'Sales Velocity Calculation', 'Performance Dashboards'] },
    25: { moduleName: 'Module 7 - Key Account Management (KAM)', topics: ['Key Account Management', 'Strategic Account Planning', 'Executive Relationship Building'] },
    26: { moduleName: 'Module 7 - Upselling & Account Expansion', topics: ['Upselling Strategies', 'Cross-Selling Tactics', 'Customer Expansion (NRR)'] },
    27: { moduleName: 'Module 7 - Renewals & Long-Term Alliances', topics: ['Renewal Strategies', 'Mitigating Renewal Churn', 'Partnership Building'] },
    28: { moduleName: 'Module 8 - AI Lead Scoring & Automation', topics: ['AI Lead Scoring', 'AI Sales Outreach Generation', 'CRM Workflow Automation'] },
    29: { moduleName: 'Module 8 - AI Customer Support & Forecasting', topics: ['AI Support Agents & Chatbots', 'Predictive Sales Forecasting', 'Future of Customer Success'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['Sales Strategy', 'CRM Workflows', 'Customer Retention'] };

    // Teaching 1
    quests.push({
      id: `scrm-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `Comprehensive lecture on ${info.topics[0]} with real-world B2B/B2C execution examples.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Sales Frameworks', 'Customer Relationship Tactics'],
      hint: `Understand how ${info.topics[0]} accelerates pipeline velocity or improves customer retention.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `scrm-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed breakdown of ${info.topics[1]} and customer management operations.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Operational Execution', 'CRM Best Practices'],
      hint: `Focus on metrics that validate the effectiveness of ${info.topics[1]}.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `scrm-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and revenue scaling.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Performance Metrics', 'Executive Dashboards'],
      hint: `Ensure strategies for ${info.topics[2]} build long-term trust and customer lifetime value.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive sales pipeline solver / CRM deal stage validator / objection handler)
    quests.push({
      id: `scrm-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Assignment - ${info.topics[0]}`,
      desc: `Execute practical sales/CRM tasks: calculate win rates, qualify leads via BANT, calculate CLV:CAC ratios, or draft objection responses using LAER.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function processSalesCrmAssignmentDay${day}(dealInput) {\n  // Calculate Win Rate, CLV:CAC ratio, or BANT lead score\n  return {\n    winRatePct: 32.5,\n    clvCacRatio: 4.2,\n    bantQualified: true,\n    dealApproved: true\n  };\n}`,
      testSuite: `if (typeof processSalesCrmAssignmentDay${day} !== 'function') throw new Error('Assignment solver missing');`,
      hint: `Formula check: Win Rate = (Deals Won / Total Opportunities) * 100. CLV:CAC Ratio = Customer Lifetime Value / Acquisition Cost.`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical Sales Exam)
    quests.push({
      id: `scrm-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily Sales & CRM Mastery Exam - ${info.moduleName}`,
      desc: `Evaluates sales pipeline management, negotiation tactics, and CRM database operations under timed exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function validateSalesCrmExamDay${day}(answers) {\n  // Validate sales decisions and CRM calculations\n  return true;\n}`,
      testSuite: `if (typeof validateSalesCrmExamDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Review BANT criteria, LAER objection steps, and CLV metrics before submitting your answers.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Integrated Sales & Customer Success Strategy Capstone (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'scrm-day30-q1',
    title: 'Day 30 - Quest 1: Sales Lifecycle Framework Synthesis',
    desc: 'Synthesize the overarching sales lifecycle: Lead Prospecting -> BANT Qualification -> Discovery & Proposal -> Negotiation -> Deal Close.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Full Sales Lifecycle', 'Pipeline Velocity Optimization', 'Deal Closing Frameworks'],
    hint: 'A structured sales process translates lead generation investments into predictable closed revenue.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'scrm-day30-q2',
    title: 'Day 30 - Quest 2: Customer Success Framework Synthesis',
    desc: 'Unify Frictionless Onboarding, Proactive Engagement, Health Score Monitoring, CSAT Audits, and Customer Retention Systems.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Customer Success Architecture', 'Onboarding & Health Scores', 'Retention & Advocacy Engines'],
    hint: 'High customer retention compounds revenue faster than top-of-funnel acquisition alone.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'scrm-day30-q3',
    title: 'Day 30 - Quest 3: Modern CRM & AI Business Growth Synthesis',
    desc: 'Integrate CRM System Architecture, Sales Analytics Dashboards, AI Lead Scoring, Outreach Automation, and Key Account Management.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['CRM Architecture Integration', 'Sales Analytics & Forecasting', 'AI Automation & KAM Growth'],
    hint: 'Leverage AI for lead scoring and administrative automation while keeping human trust at the center of account management.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Master Integrated Customer Management Strategy Project
  quests.push({
    id: 'scrm-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Complete Customer Management & CRM Strategy Plan',
    desc: 'Develop a complete customer management playbook for a business: customer persona definition, lead generation & BANT qualification criteria, sales process stages, communication & objection handling plan, CRM database schema & workflow, customer onboarding plan, retention & health score strategy, sales KPI scorecard (Win Rate, CLV, CAC), and AI sales automation roadmap.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function executeCustomerManagementStrategyCapstone(businessBrief) {\n  // 1. Target Customer Persona & BANT Criteria\n  // 2. Sales Pipeline Stages & Objection Playbook\n  // 3. CRM Database Setup & Onboarding Workflow\n  // 4. Target Win Rate, CAC, CLV Scorecard & AI Automation\n  return {\n    targetPersona: "Head of Procurement in Mid-Market Tech Enterprises",\n    qualificationCriteria: "BANT (Min Budget $25k, Timeline < 90 Days)",\n    salesPipelineStages: ["Lead Qualified", "Discovery Call", "Proposal Sent", "Negotiation", "Closed Won"],\n    crmArchitecture: {\n      database: "Enterprise CRM Schema",\n      automatedTasks: true\n    },\n    onboardingPlan: "14-Day High-Touch Time-to-Value Roadmap",\n    kpiScorecard: {\n      targetWinRatePct: 35.0,\n      targetCAC: 1200,\n      projectedCLV: 15000\n    },\n    strategyPlanComplete: true\n  };\n}`,
    testSuite: `if (typeof executeCustomerManagementStrategyCapstone !== 'function') throw new Error('Capstone solver missing');\nconst res = executeCustomerManagementStrategyCapstone({});\nif (!res.strategyPlanComplete || !res.kpiScorecard) throw new Error('Capstone customer management strategy incomplete');`,
    hint: `Ensure all key relationship stages (qualification, pipeline, CRM, onboarding, metrics) are explicitly defined!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional Sales, Customer Success & CRM Certification
  quests.push({
    id: 'scrm-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - Sales, Customer Success & CRM',
    desc: 'Mastery certification assessment covering Sales Fundamentals, Customer Psychology, Sales Process, Communication, Negotiation & Objection Handling, Customer Success, CRM Systems, Sales Analytics, Key Account Management, and AI in Sales.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalSalesCrmCertificationExam(candidateAnswers) {\n  // Validate comprehensive 90-minute sales, customer success & CRM exam\n  return {\n    scorePct: 98,\n    passed: true,\n    certificationTitle: "Certified Sales, Customer Success & CRM Specialist"\n  };\n}`,
    testSuite: `if (typeof executeFinalSalesCrmCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalRes = executeFinalSalesCrmCertificationExam({});\nif (!evalRes.passed) throw new Error('Certification evaluation failed');`,
    hint: `Review all 8 modules before initiating the final comprehensive certification assessment.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_SALES_CRM_30_DAYS_QUESTS: CourseQuest[] = generate146SalesCrmQuests();
