import { CourseQuest } from './coursesData';

// Helper function to generate all 146 Entrepreneurship & Business Management Quests
function generate146EntrepreneurshipQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'ent-day1-q1',
    title: 'Day 1 - Quest 1: Introduction to Entrepreneurship',
    desc: 'Understand what Entrepreneurship is, who entrepreneurs are, why businesses exist to create value, and the fundamental differences between entrepreneurship and employment.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What is Entrepreneurship?', 'Who is an Entrepreneur?', 'Why Businesses Exist', 'Entrepreneurship vs Employment'],
    hint: 'Entrepreneurs take calculated risks to solve market pain points and create economic value.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ent-day1-q2',
    title: 'Day 1 - Quest 2: Business Fundamentals',
    desc: 'Examine core business primitives: Products, Services, Target Customers, Value Creation mechanisms, and Revenue Generation.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Products vs Services', 'Target Customers', 'Value Creation', 'Revenue Generation'],
    hint: 'A business only survives if its value creation exceeds its operational cost structure.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ent-day1-q3',
    title: 'Day 1 - Quest 3: Types of Business Entities',
    desc: 'Compare legal business structures: Sole Proprietorship, Partnership, Limited Liability Partnership (LLP), Private Limited Company, Public Limited Company, and Social Enterprises.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Sole Proprietorship & Partnership', 'LLP & Pvt Ltd', 'Public Limited Company', 'Social Enterprise'],
    hint: 'Pvt Ltd structures protect personal assets via limited liability and make raising equity capital easier.',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'ent-day2-q1',
    title: 'Day 2 - Quest 1: The Entrepreneurial Mindset',
    desc: 'Cultivate essential entrepreneurial competencies: Creativity, Problem Solving, Leadership, Innovation, and Decision Making under uncertainty.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Creativity & Innovation', 'Problem Solving', 'Leadership & Decision Making', 'Risk Appetite'],
    hint: 'An entrepreneurial mindset sees problems as market opportunities waiting for elegant solutions.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ent-day2-q2',
    title: 'Day 2 - Quest 2: The Business Ecosystem',
    desc: 'Explore the external business ecosystem: Customers, Suppliers, Competitors, Investors, Government Regulators, and Trade Associations.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Customers & Suppliers', 'Competitors & Investors', 'Government & Regulatory Bodies'],
    hint: 'Successful businesses navigate ecosystem dynamics by balancing stakeholder interests.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ent-day2-q3',
    title: 'Day 2 - Quest 3: The Business Lifecycle',
    desc: 'Trace the 5-stage business lifecycle: Ideation -> Startup Launch -> Growth & Scaling -> Expansion -> Maturity or Renewal.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Ideation & Startup', 'Growth & Scaling', 'Expansion', 'Maturity & Renewal'],
    hint: 'Different lifecycle stages require distinct management priorities, capital requirements, and leadership styles.',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - Opportunities & Problem Recognition', topics: ['Business Opportunities', 'Problem Identification', 'Opportunity Recognition'] },
    4: { moduleName: 'Module 1 - Business Ethics & CSR', topics: ['Business Ethics', 'Social Responsibility', 'Sustainable Business Models'] },
    5: { moduleName: 'Module 2 - Business Model Canvas (BMC)', topics: ['Business Model Fundamentals', 'Business Model Canvas (BMC)', 'Value Proposition Design'] },
    6: { moduleName: 'Module 2 - Customer Segments & Validation', topics: ['Customer Segment Profiling', 'Customer Problem Validation', 'Problem-Solution Fit'] },
    7: { moduleName: 'Module 2 - Revenue Streams & Cost Structure', topics: ['Revenue Stream Design', 'Cost Structure Optimization', 'Profit Margin Dynamics'] },
    8: { moduleName: 'Module 2 - Channels & Key Partnerships', topics: ['Distribution Channels', 'Key Operational Activities', 'Strategic Business Partnerships'] },
    9: { moduleName: 'Module 3 - Vision, Mission & Goals', topics: ['Vision & Mission Crafting', 'SMART Business Goals', 'Core Value Alignment'] },
    10: { moduleName: 'Module 3 - Strategic SWOT Audit', topics: ['Internal Strengths & Weaknesses', 'External Opportunities & Threats', 'TOWS Strategic Matrix'] },
    11: { moduleName: 'Module 3 - Competitive Advantage', topics: ['Porters Generic Strategies', 'Competitive Advantage & Moats', 'Market Positioning'] },
    12: { moduleName: 'Module 3 - Formal Business Planning', topics: ['Executive Summary Writing', 'Strategic Market Analysis', 'Master Business Plan Assembly'] },
    13: { moduleName: 'Module 4 - Operations & Process Management', topics: ['Operations Management Design', 'Capacity Planning', 'Process Optimization'] },
    14: { moduleName: 'Module 4 - Supply Chain & Inventory', topics: ['Supply Chain Logistics', 'Resource Management', 'Inventory Control Systems'] },
    15: { moduleName: 'Module 4 - Quality & Lean Operations', topics: ['Productivity Management', 'Quality Control & TQM', 'Lean Process Improvement'] },
    16: { moduleName: 'Module 4 - Team & Corporate Compliance', topics: ['Organizational Structures', 'Delegation & Accountability', 'Business Documentation & Compliance'] },
    17: { moduleName: 'Module 5 - Startup Finance & Budgeting', topics: ['Startup Capital Requirements', 'Operating Budgeting', 'Cash Flow Management'] },
    18: { moduleName: 'Module 5 - Cost & Break-Even Analysis', topics: ['Revenue Model Selection', 'Cost Management', 'Break-Even Analysis'] },
    19: { moduleName: 'Module 5 - Pricing & Profitability', topics: ['Pricing Strategy Optimization', 'Profitability Audits', 'Revenue Engine Scaling'] },
    20: { moduleName: 'Module 5 - Funding & Investor Readiness', topics: ['Funding Sources (Angel/VC)', 'Equity vs Debt Financing', 'Investor Pitch Deck Readiness'] },
    21: { moduleName: 'Module 6 - Leadership & Delegation', topics: ['Leadership Style Application', 'Effective Delegation', 'Decision Making Under Risk'] },
    22: { moduleName: 'Module 6 - Team Building & Hiring', topics: ['Core Team Building', 'Talent Acquisition & Hiring', 'Employee Motivation Models'] },
    23: { moduleName: 'Module 6 - Communication & Conflict', topics: ['Executive Communication', 'Workplace Conflict Resolution', 'Business Negotiation Tactics'] },
    24: { moduleName: 'Module 6 - Culture & Performance (OKRs)', topics: ['Organizational Culture', 'Performance Management (KPIs/OKRs)', 'Talent Retention Systems'] },
    25: { moduleName: 'Module 7 - Innovation & Design Thinking', topics: ['Innovation Frameworks', 'Design Thinking Process', 'Product-Market Fit Iteration'] },
    26: { moduleName: 'Module 7 - Risk Management', topics: ['Business Risk Identification', 'Risk Assessment Matrix', 'Contingency Planning'] },
    27: { moduleName: 'Module 7 - Business Scaling & Digital Shift', topics: ['Business Scaling Strategies', 'Business Expansion & Franchising', 'Digital Transformation Management'] },
    28: { moduleName: 'Module 8 - AI Market Research & Planning', topics: ['AI for Market Research', 'AI Business Plan Generation', 'Operational Process Automation'] },
    29: { moduleName: 'Module 8 - AI Support & Future Business', topics: ['AI Decision Support Systems', 'AI Customer Service Agents', 'Future Trends in Entrepreneurship'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['Business Management', 'Entrepreneurship', 'Venture Strategy'] };

    // Teaching 1
    quests.push({
      id: `ent-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `Comprehensive lecture on ${info.topics[0]} with real-world entrepreneurial case studies.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Venture Strategy', 'Operational Frameworks'],
      hint: `Understand how ${info.topics[0]} enhances competitive positioning and value creation.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `ent-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed breakdown of ${info.topics[1]} and business management mechanics.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Strategic Implementation', 'Management Controls'],
      hint: `Focus on metrics that validate the effectiveness of ${info.topics[1]}.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `ent-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and scaling business operations.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Performance Metrics', 'Executive Dashboards'],
      hint: `Ensure strategies for ${info.topics[2]} are resilient to market risk and competition.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive venture solver / BMC generator / break-even calculator)
    quests.push({
      id: `ent-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Assignment - ${info.topics[0]}`,
      desc: `Execute practical business management tasks: calculate break-even volume, build Business Model Canvas blocks, draft vision/mission statements, or structure OKRs.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function processEntrepreneurshipAssignmentDay${day}(ventureData) {\n  // Calculate Break-Even Units, Contribution Margin, or BMC metrics\n  return {\n    contributionMarginPerUnit: 450,\n    breakEvenUnits: 1200,\n    bmcValidated: true,\n    ventureApproved: true\n  };\n}`,
      testSuite: `if (typeof processEntrepreneurshipAssignmentDay${day} !== 'function') throw new Error('Assignment solver missing');`,
      hint: `Formula check: Contribution Margin = Selling Price - Variable Cost. Break-Even Units = Fixed Costs / Contribution Margin.`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical Venture Exam)
    quests.push({
      id: `ent-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily Entrepreneurship Exam - ${info.moduleName}`,
      desc: `Evaluates strategic management, financial feasibility, and operational execution under timed exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function validateEntrepreneurshipExamDay${day}(answers) {\n  // Validate business strategy choices and financial calculations\n  return true;\n}`,
      testSuite: `if (typeof validateEntrepreneurshipExamDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Review BMC blocks, break-even formulas, and SWOT principles before submitting your answers.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Integrated Business Management Capstone (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'ent-day30-q1',
    title: 'Day 30 - Quest 1: Business Creation Framework Synthesis',
    desc: 'Synthesize the business creation lifecycle: Opportunity Recognition -> Business Model Canvas -> Strategic Planning -> Operational Execution.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Opportunity to Execution', 'BMC Architecture', 'Strategic Plan Synthesis'],
    hint: 'A successful startup aligns market opportunity with operational and financial feasibility.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'ent-day30-q2',
    title: 'Day 30 - Quest 2: Business Operations Framework Synthesis',
    desc: 'Unify Financial Budgeting, Operations Management, Marketing Strategy, and Leadership Systems into a cohesive operating model.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Operations & Finance Integration', 'Marketing & Sales Sync', 'Leadership & Organizational Culture'],
    hint: 'Operational excellence ensures efficient capital allocation and high team productivity.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'ent-day30-q3',
    title: 'Day 30 - Quest 3: Business Growth & AI Framework Synthesis',
    desc: 'Integrate Innovation, Scaling Strategies, Risk Management, Sustainability, and AI Tools into a future-proof enterprise roadmap.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Scaling Systems', 'Risk & Sustainability', 'AI & Digital Business Transformation'],
    hint: 'Leverage AI for market intelligence and process automation while maintaining human-centered leadership.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Master Integrated Venture Business Plan Project
  quests.push({
    id: 'ent-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Complete Business Plan for a New Venture',
    desc: 'Develop a complete investor-ready business plan for a new venture: problem statement, target customer segment, value proposition canvas, 9-block Business Model Canvas, operations plan, marketing strategy, 12-month financial projections (revenue, break-even, cash flow), organizational team structure, risk assessment matrix, and AI growth scaling roadmap.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function executeVentureBusinessPlanCapstone(ventureBrief) {\n  // 1. Define Problem, Customer Segment & Value Proposition\n  // 2. Build Business Model Canvas & Operations Workflow\n  // 3. Construct Financial Plan (Capex/Opex, Break-even, P&L)\n  // 4. Draft Risk Matrix & AI Growth Strategy\n  return {\n    problemStatement: "Fragmented B2B supply chain for regional retailers",\n    targetCustomerSegment: "Tier-2 & Tier-3 Small Retail Enterprises",\n    bmcComplete: true,\n    financialPlan: {\n      initialCapitalRequired: 2500000,\n      monthlyBreakEvenRevenue: 650000,\n      projectedYear1Revenue: 12000000\n    },\n    riskMitigationMatrix: "Operational & Credit Risk Audited",\n    venturePlanComplete: true\n  };\n}`,
    testSuite: `if (typeof executeVentureBusinessPlanCapstone !== 'function') throw new Error('Capstone solver missing');\nconst res = executeVentureBusinessPlanCapstone({});\nif (!res.venturePlanComplete || !res.financialPlan) throw new Error('Capstone venture business plan incomplete');`,
    hint: `Ensure all key business pillars (problem, customer, BMC, operations, financials, risk) are fully specified!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional Entrepreneurship & Management Certification
  quests.push({
    id: 'ent-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - Entrepreneurship & Business Management',
    desc: 'Mastery certification assessment covering Entrepreneurship Fundamentals, Business Models, Strategic Planning, Business Operations, Startup Finance, Leadership, Innovation, Risk Management, Business Growth, and AI in Business.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalEntrepreneurshipCertificationExam(candidateAnswers) {\n  // Validate comprehensive 90-minute entrepreneurship & management exam\n  return {\n    scorePct: 98,\n    passed: true,\n    certificationTitle: "Certified Entrepreneur & Business Manager"\n  };\n}`,
    testSuite: `if (typeof executeFinalEntrepreneurshipCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalRes = executeFinalEntrepreneurshipCertificationExam({});\nif (!evalRes.passed) throw new Error('Certification evaluation failed');`,
    hint: `Review all 8 modules before initiating the final comprehensive certification assessment.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_ENTREPRENEURSHIP_30_DAYS_QUESTS: CourseQuest[] = generate146EntrepreneurshipQuests();
