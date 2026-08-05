export interface EntrepreneurshipKnowledgeModule {
  id: string;
  title: string;
  dayRange: string;
  goal: string;
  topics: {
    name: string;
    concepts: string[];
    learningObjectives: string[];
    quests: string[];
  }[];
}

export const BCOM_ENTREPRENEURSHIP_KNOWLEDGE_GRAPH: EntrepreneurshipKnowledgeModule[] = [
  {
    id: 'ent-mod-1',
    title: 'Module 1 — Foundations of Entrepreneurship',
    dayRange: 'Days 1–4',
    goal: 'Develop an entrepreneurial mindset and explain how businesses create value.',
    topics: [
      {
        name: 'Introduction to Entrepreneurship & Business Fundamentals',
        concepts: ['What is Entrepreneurship?', 'Who is an Entrepreneur?', 'Why Businesses Exist', 'Entrepreneurship vs Employment', 'Value Creation & Revenue'],
        learningObjectives: [
          'Differentiate entrepreneurship from traditional employment',
          'Understand value creation mechanisms in business'
        ],
        quests: ['ent-day1-q1', 'ent-day1-q2', 'ent-day1-q3']
      },
      {
        name: 'Types of Businesses & Entrepreneurial Mindset',
        concepts: ['Legal Structures (Sole Proprietorship, Partnership, LLP, Pvt Ltd, Public, Social Enterprise)', 'Entrepreneurial Mindset (Creativity, Problem Solving, Leadership, Innovation)', 'Business Ecosystem', 'Business Lifecycle'],
        learningObjectives: [
          'Compare business legal structures and entity liabilities',
          'Map the stages of the business lifecycle from idea to maturity'
        ],
        quests: ['ent-day2-q1', 'ent-day2-q2', 'ent-day2-q3']
      },
      {
        name: 'Business Opportunities & Problem Identification',
        concepts: ['Market Problem Identification', 'Opportunity Recognition', 'Feasibility Assessment'],
        learningObjectives: [
          'Recognize real-world market friction and turn problems into business opportunities'
        ],
        quests: ['ent-day3-q1', 'ent-day3-q2', 'ent-day3-q3', 'ent-day3-q4', 'ent-day3-q5']
      },
      {
        name: 'Business Ethics, CSR & Sustainable Business',
        concepts: ['Business Ethics', 'Corporate Social Responsibility (CSR)', 'Sustainable Business Models'],
        learningObjectives: [
          'Evaluate ethical dilemmas and build sustainable business practices'
        ],
        quests: ['ent-day4-q1', 'ent-day4-q2', 'ent-day4-q3', 'ent-day4-q4', 'ent-day4-q5']
      }
    ]
  },
  {
    id: 'ent-mod-2',
    title: 'Module 2 — Business Model & Value Proposition',
    dayRange: 'Days 5–8',
    goal: 'Master the Business Model Canvas (BMC), value proposition design, customer segments, revenue streams, and cost structures.',
    topics: [
      {
        name: 'Business Model Canvas (BMC) Overview',
        concepts: ['Business Model Concept', '9 Building Blocks of BMC', 'Value Proposition Canvas'],
        learningObjectives: [
          'Deconstruct business models using the 9-block BMC framework'
        ],
        quests: ['ent-day5-q1', 'ent-day5-q2', 'ent-day5-q3', 'ent-day5-q4', 'ent-day5-q5']
      },
      {
        name: 'Customer Segments & Problem Validation',
        concepts: ['Customer Segment Profiling', 'Jobs-to-be-Done (JTBD)', 'Problem-Solution Fit'],
        learningObjectives: [
          'Validate problem-solution fit with target customer segments'
        ],
        quests: ['ent-day6-q1', 'ent-day6-q2', 'ent-day6-q3', 'ent-day6-q4', 'ent-day6-q5']
      },
      {
        name: 'Revenue Streams & Cost Structure',
        concepts: ['Revenue Models (Transactional, Recurring, Freemium, Licensing)', 'Fixed vs Variable Costs', 'Cost Structure Optimization'],
        learningObjectives: [
          'Design sustainable revenue streams and cost structures'
        ],
        quests: ['ent-day7-q1', 'ent-day7-q2', 'ent-day7-q3', 'ent-day7-q4', 'ent-day7-q5']
      },
      {
        name: 'Channels, Key Activities & Strategic Partnerships',
        concepts: ['Distribution & Communication Channels', 'Key Operations & Resources', 'Key Strategic Partnerships'],
        learningObjectives: [
          'Map key activities, resources, and strategic alliances'
        ],
        quests: ['ent-day8-q1', 'ent-day8-q2', 'ent-day8-q3', 'ent-day8-q4', 'ent-day8-q5']
      }
    ]
  },
  {
    id: 'ent-mod-3',
    title: 'Module 3 — Business Planning & Strategy',
    dayRange: 'Days 9–12',
    goal: 'Define vision, mission, strategic goals, perform SWOT audits, and build competitive advantages.',
    topics: [
      {
        name: 'Vision, Mission & Strategic Goals',
        concepts: ['Crafting Vision & Mission Statements', 'SMART Strategic Goals', 'Core Business Values'],
        learningObjectives: [
          'Formulate inspiring vision/mission statements and SMART goals'
        ],
        quests: ['ent-day9-q1', 'ent-day9-q2', 'ent-day9-q3', 'ent-day9-q4', 'ent-day9-q5']
      },
      {
        name: 'SWOT Analysis & Environmental Audit',
        concepts: ['Internal Strengths & Weaknesses', 'External Opportunities & Threats', 'TOWS Matrix Alignment'],
        learningObjectives: [
          'Perform detailed SWOT audits and TOWS matrix strategic planning'
        ],
        quests: ['ent-day10-q1', 'ent-day10-q2', 'ent-day10-q3', 'ent-day10-q4', 'ent-day10-q5']
      },
      {
        name: 'Competitive Advantage & Market Positioning',
        concepts: ['Porters Generic Strategies (Cost Leadership, Differentiation, Focus)', 'Sustainable Competitive Advantage (Moats)', 'Market Positioning'],
        learningObjectives: [
          'Build sustainable competitive moats around business offerings'
        ],
        quests: ['ent-day11-q1', 'ent-day11-q2', 'ent-day11-q3', 'ent-day11-q4', 'ent-day11-q5']
      },
      {
        name: 'Comprehensive Business Plan Architecture',
        concepts: ['Executive Summary Writing', 'Market Analysis Section', 'Financial & Operational Plan Assembly'],
        learningObjectives: [
          'Assemble formal business plans for investors and stakeholders'
        ],
        quests: ['ent-day12-q1', 'ent-day12-q2', 'ent-day12-q3', 'ent-day12-q4', 'ent-day12-q5']
      }
    ]
  },
  {
    id: 'ent-mod-4',
    title: 'Module 4 — Business Operations & Management',
    dayRange: 'Days 13–16',
    goal: 'Organize operations, manage supply chains, optimize resources, improve processes, and enforce quality control.',
    topics: [
      {
        name: 'Operations Management & Process Design',
        concepts: ['Operations Workflow Design', 'Capacity Planning', 'Service & Manufacturing Operations'],
        learningObjectives: [
          'Design efficient operational workflows and capacity plans'
        ],
        quests: ['ent-day13-q1', 'ent-day13-q2', 'ent-day13-q3', 'ent-day13-q4', 'ent-day13-q5']
      },
      {
        name: 'Supply Chain & Inventory Basics',
        concepts: ['Supply Chain Logistics', 'Vendor & Supplier Management', 'Inventory Control'],
        learningObjectives: [
          'Manage vendor relationships and inventory turnover'
        ],
        quests: ['ent-day14-q1', 'ent-day14-q2', 'ent-day14-q3', 'ent-day14-q4', 'ent-day14-q5']
      },
      {
        name: 'Quality Management & Process Improvement',
        concepts: ['Total Quality Management (TQM)', 'Lean Principles & Waste Elimination', 'Standard Operating Procedures (SOPs)'],
        learningObjectives: [
          'Write SOPs and apply Lean principles to eliminate operational waste'
        ],
        quests: ['ent-day15-q1', 'ent-day15-q2', 'ent-day15-q3', 'ent-day15-q4', 'ent-day15-q5']
      },
      {
        name: 'Team Management & Business Documentation',
        concepts: ['Organizational Structures', 'Delegation & Workflow Accountability', 'Corporate Documentation & Compliance'],
        learningObjectives: [
          'Structure organizational charts and maintain regulatory compliance'
        ],
        quests: ['ent-day16-q1', 'ent-day16-q2', 'ent-day16-q3', 'ent-day16-q4', 'ent-day16-q5']
      }
    ]
  },
  {
    id: 'ent-mod-5',
    title: 'Module 5 — Finance & Business Growth',
    dayRange: 'Days 17–20',
    goal: 'Master startup finance, budgeting, cash flow, pricing, break-even analysis, funding sources, and profitability.',
    topics: [
      {
        name: 'Startup Finance & Budgeting',
        concepts: ['Capital Requirements (Capex vs Opex)', 'Operating Budgets', 'Cash Flow Forecasting'],
        learningObjectives: [
          'Construct operating budgets and 12-month cash flow forecasts'
        ],
        quests: ['ent-day17-q1', 'ent-day17-q2', 'ent-day17-q3', 'ent-day17-q4', 'ent-day17-q5']
      },
      {
        name: 'Cost Management & Break-Even Analysis',
        concepts: ['Contribution Margin', 'Break-Even Point in Units and Value', 'Margin of Safety'],
        learningObjectives: [
          'Calculate break-even volume and margin of safety'
        ],
        quests: ['ent-day18-q1', 'ent-day18-q2', 'ent-day18-q3', 'ent-day18-q4', 'ent-day18-q5']
      },
      {
        name: 'Pricing & Revenue Optimization',
        concepts: ['Value-Based & Competitive Pricing', 'Profitability Audits', 'Revenue Engine Scaling'],
        learningObjectives: [
          'Audit product lines for profitability and pricing optimization'
        ],
        quests: ['ent-day19-q1', 'ent-day19-q2', 'ent-day19-q3', 'ent-day19-q4', 'ent-day19-q5']
      },
      {
        name: 'Funding Sources & Investor Readiness',
        concepts: ['Bootstrapping', 'Angel Investors & Venture Capital (VC)', 'Debt vs Equity Financing', 'Investor Pitching'],
        learningObjectives: [
          'Evaluate financing options and prepare investor pitch decks'
        ],
        quests: ['ent-day20-q1', 'ent-day20-q2', 'ent-day20-q3', 'ent-day20-q4', 'ent-day20-q5']
      }
    ]
  },
  {
    id: 'ent-mod-6',
    title: 'Module 6 — Leadership & People Management',
    dayRange: 'Days 21–24',
    goal: 'Develop leadership skills, build high-performing teams, resolve workplace conflicts, and foster positive organizational culture.',
    topics: [
      {
        name: 'Leadership Styles & Delegation',
        concepts: ['Transformational vs Transactional Leadership', 'Effective Delegation', 'Decision Making Under Uncertainty'],
        learningObjectives: [
          'Apply situational leadership and delegate tasks effectively'
        ],
        quests: ['ent-day21-q1', 'ent-day21-q2', 'ent-day21-q3', 'ent-day21-q4', 'ent-day21-q5']
      },
      {
        name: 'Team Building & Talent Acquisition',
        concepts: ['Hiring Core Teams', 'Role Fit & Onboarding', 'Employee Motivation Theories (Maslow, Herzberg)'],
        learningObjectives: [
          'Structure hiring pipelines and motivate team members'
        ],
        quests: ['ent-day22-q1', 'ent-day22-q2', 'ent-day22-q3', 'ent-day22-q4', 'ent-day22-q5']
      },
      {
        name: 'Communication & Conflict Resolution',
        concepts: ['Interpersonal Business Communication', 'Workplace Conflict Resolution Strategies', 'Negotiation Skills'],
        learningObjectives: [
          'Resolve team conflicts and negotiate win-win agreements'
        ],
        quests: ['ent-day23-q1', 'ent-day23-q2', 'ent-day23-q3', 'ent-day23-q4', 'ent-day23-q5']
      },
      {
        name: 'Organizational Culture & Performance',
        concepts: ['Company Culture & Values', 'Performance Management (KPIs & OKRs)', 'Retaining Top Talent'],
        learningObjectives: [
          'Establish OKR frameworks and build a strong company culture'
        ],
        quests: ['ent-day24-q1', 'ent-day24-q2', 'ent-day24-q3', 'ent-day24-q4', 'ent-day24-q5']
      }
    ]
  },
  {
    id: 'ent-mod-7',
    title: 'Module 7 — Innovation, Risk & Business Scaling',
    dayRange: 'Days 25–27',
    goal: 'Apply design thinking, manage operational/financial risks, execute business scaling strategies, and lead digital transformation.',
    topics: [
      {
        name: 'Innovation & Design Thinking',
        concepts: ['Design Thinking Framework (Empathize, Define, Ideate, Prototype, Test)', 'Disruptive Innovation', 'Product-Market Fit Iteration'],
        learningObjectives: [
          'Utilize design thinking to innovate products and services'
        ],
        quests: ['ent-day25-q1', 'ent-day25-q2', 'ent-day25-q3', 'ent-day25-q4', 'ent-day25-q5']
      },
      {
        name: 'Business Risk Assessment & Mitigation',
        concepts: ['Financial, Operational & Market Risks', 'Risk Matrix Assessment', 'Contingency Planning'],
        learningObjectives: [
          'Perform risk assessments and design mitigation strategies'
        ],
        quests: ['ent-day26-q1', 'ent-day26-q2', 'ent-day26-q3', 'ent-day26-q4', 'ent-day26-q5']
      },
      {
        name: 'Scaling Strategies & Digital Transformation',
        concepts: ['Organic vs Inorganic Scaling', 'Franchising & Licensing', 'Digital Transformation & Change Management'],
        learningObjectives: [
          'Formulate expansion strategies for scaling business operations'
        ],
        quests: ['ent-day27-q1', 'ent-day27-q2', 'ent-day27-q3', 'ent-day27-q4', 'ent-day27-q5']
      }
    ]
  },
  {
    id: 'ent-mod-8',
    title: 'Module 8 — AI & Future of Entrepreneurship',
    dayRange: 'Days 28–29',
    goal: 'Integrate AI tools for business automation, market research, financial planning, decision support, and operational efficiency.',
    topics: [
      {
        name: 'AI for Business Automation & Research',
        concepts: ['AI Market Research Assistance', 'Automated Business Planning', 'Operational Process Automation'],
        learningObjectives: [
          'Utilize AI tools to accelerate market research and process automation'
        ],
        quests: ['ent-day28-q1', 'ent-day28-q2', 'ent-day28-q3', 'ent-day28-q4', 'ent-day28-q5']
      },
      {
        name: 'AI Customer Support & Decision Intelligence',
        concepts: ['AI Decision Support Tools', 'AI Customer Service Agents', 'Future of Entrepreneurship'],
        learningObjectives: [
          'Deploy AI assistants for executive decision support and customer service'
        ],
        quests: ['ent-day29-q1', 'ent-day29-q2', 'ent-day29-q3', 'ent-day29-q4', 'ent-day29-q5']
      }
    ]
  },
  {
    id: 'ent-mod-9',
    title: 'Day 30 — Integrated Business Management Capstone',
    dayRange: 'Day 30',
    goal: 'Synthesize opportunity recognition, BMC design, strategic planning, operations, finance, leadership, risk assessment, and AI scaling into a full business plan.',
    topics: [
      {
        name: 'Integrated Venture Business Plan & Capstone Assessment',
        concepts: ['Comprehensive Business Architecture', 'Investor Pitch Presentation', 'Certified Entrepreneur & Business Manager Assessment'],
        learningObjectives: [
          'Build an investor-ready comprehensive business plan for a new or scaling venture'
        ],
        quests: ['ent-day30-q1', 'ent-day30-q2', 'ent-day30-q3', 'ent-day30-q4', 'ent-day30-q5']
      }
    ]
  }
];
