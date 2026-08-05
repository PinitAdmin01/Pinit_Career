export interface MarketingKnowledgeModule {
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

export const BCOM_MARKETING_KNOWLEDGE_GRAPH: MarketingKnowledgeModule[] = [
  {
    id: 'mkt-mod-1',
    title: 'Module 1 — Foundations of Marketing',
    dayRange: 'Days 1–4',
    goal: 'Develop the mindset that marketing is about creating customer value, not just selling products.',
    topics: [
      {
        name: 'Introduction to Marketing & Customer Understanding',
        concepts: ['Definition of Marketing', 'Marketing vs Selling', 'Customer Needs, Wants & Demand', 'Customer Value & Satisfaction'],
        learningObjectives: [
          'Differentiate marketing from simple selling activities',
          'Understand the evolution of marketing mindsets',
          'Analyze customer needs, wants, and purchasing power'
        ],
        quests: ['mkt-day1-q1', 'mkt-day1-q2', 'mkt-day1-q3']
      },
      {
        name: 'Marketing Environment & Marketing Mix',
        concepts: ['Micro vs Macro Environment', 'SWOT Analysis Basics', '4 Ps of Marketing (Product, Price, Place, Promotion)'],
        learningObjectives: [
          'Evaluate internal and external market forces',
          'Map business elements into the 4 Ps framework',
          'Formulate initial marketing strategies'
        ],
        quests: ['mkt-day2-q1', 'mkt-day2-q2', 'mkt-day2-q3']
      },
      {
        name: 'Customer Buying Behaviour & Consumer Journey',
        concepts: ['Psychological & Social Buying Factors', 'Consumer Decision-Making Process', 'Touchpoint Mapping'],
        learningObjectives: [
          'Map stages of the consumer decision journey',
          'Identify key buying influences and triggers'
        ],
        quests: ['mkt-day3-q1', 'mkt-day3-q2', 'mkt-day3-q3', 'mkt-day3-q4', 'mkt-day3-q5']
      },
      {
        name: 'Marketing Ethics & Customer Lifetime Value',
        concepts: ['Ethical Marketing Practices', 'Customer Relationship Management (CRM)', 'Customer Lifetime Value (CLV)'],
        learningObjectives: [
          'Evaluate ethical vs deceptive marketing tactics',
          'Calculate basic Customer Lifetime Value (CLV)'
        ],
        quests: ['mkt-day4-q1', 'mkt-day4-q2', 'mkt-day4-q3', 'mkt-day4-q4', 'mkt-day4-q5']
      }
    ]
  },
  {
    id: 'mkt-mod-2',
    title: 'Module 2 — Market Research & Consumer Insights',
    dayRange: 'Days 5–8',
    goal: 'Learn how to collect, analyze, and interpret customer insights through quantitative and qualitative research methods.',
    topics: [
      {
        name: 'Primary & Secondary Market Research',
        concepts: ['Primary Data Collection (Surveys, Interviews)', 'Secondary Data Ingestion', 'Research Design & Questionnaires'],
        learningObjectives: [
          'Design effective survey instruments',
          'Distinguish between primary empirical data and secondary reports'
        ],
        quests: ['mkt-day5-q1', 'mkt-day5-q2', 'mkt-day5-q3', 'mkt-day5-q4', 'mkt-day5-q5']
      },
      {
        name: 'Qualitative Customer Insights',
        concepts: ['Focus Groups', 'Observational Studies', 'Ethnographic Research'],
        learningObjectives: [
          'Extract qualitative customer sentiment and unspoken pain points'
        ],
        quests: ['mkt-day6-q1', 'mkt-day6-q2', 'mkt-day6-q3', 'mkt-day6-q4', 'mkt-day6-q5']
      },
      {
        name: 'Customer Persona Creation',
        concepts: ['Buyer Personas', 'Demographics vs Psychographics', 'User Story Mapping'],
        learningObjectives: [
          'Synthesize market research into actionable customer personas'
        ],
        quests: ['mkt-day7-q1', 'mkt-day7-q2', 'mkt-day7-q3', 'mkt-day7-q4', 'mkt-day7-q5']
      },
      {
        name: 'Customer Journey & Market Trends',
        concepts: ['End-to-End Journey Mapping', 'Trend Spotting', 'Competitive Benchmarking'],
        learningObjectives: [
          'Identify conversion friction points across customer touchpoints'
        ],
        quests: ['mkt-day8-q1', 'mkt-day8-q2', 'mkt-day8-q3', 'mkt-day8-q4', 'mkt-day8-q5']
      }
    ]
  },
  {
    id: 'mkt-mod-3',
    title: 'Module 3 — Segmentation, Targeting & Positioning (STP)',
    dayRange: 'Days 9–12',
    goal: 'Master the STP framework to divide heterogeneous markets, select high-value targets, and establish a distinct brand position.',
    topics: [
      {
        name: 'Market Segmentation Methods',
        concepts: ['Geographic & Demographic Segmentation', 'Psychographic Lifestyle Segmentation', 'Behavioral Usage Segmentation'],
        learningObjectives: [
          'Segment consumer markets using multi-variable criteria'
        ],
        quests: ['mkt-day9-q1', 'mkt-day9-q2', 'mkt-day9-q3', 'mkt-day9-q4', 'mkt-day9-q5']
      },
      {
        name: 'Target Market Selection',
        concepts: ['Segment Attractiveness Evaluation', 'Targeting Strategies (Undifferentiated, Niche, Micro)'],
        learningObjectives: [
          'Assess market size, growth potential, and segment profitability'
        ],
        quests: ['mkt-day10-q1', 'mkt-day10-q2', 'mkt-day10-q3', 'mkt-day10-q4', 'mkt-day10-q5']
      },
      {
        name: 'Product Positioning & Perceptual Mapping',
        concepts: ['Positioning Strategies', 'Perceptual Maps', 'Competitive Differentiation'],
        learningObjectives: [
          'Construct perceptual maps to pinpoint market white space'
        ],
        quests: ['mkt-day11-q1', 'mkt-day11-q2', 'mkt-day11-q3', 'mkt-day11-q4', 'mkt-day11-q5']
      },
      {
        name: 'Crafting Value Propositions',
        concepts: ['Value Proposition Canvas', 'Unique Selling Proposition (USP)', 'Positioning Statements'],
        learningObjectives: [
          'Formulate compelling value proposition statements for target audiences'
        ],
        quests: ['mkt-day12-q1', 'mkt-day12-q2', 'mkt-day12-q3', 'mkt-day12-q4', 'mkt-day12-q5']
      }
    ]
  },
  {
    id: 'mkt-mod-4',
    title: 'Module 4 — Product & Brand Management',
    dayRange: 'Days 13–16',
    goal: 'Learn how to manage product lifecycles, build strong brand identities, and engineer long-term brand equity.',
    topics: [
      {
        name: 'Product Strategy & Life Cycle',
        concepts: ['Product Levels (Core, Actual, Augmented)', 'Product Life Cycle (PLC) Stages', 'New Product Development'],
        learningObjectives: [
          'Manage marketing tactics across PLC stages (Intro, Growth, Maturity, Decline)'
        ],
        quests: ['mkt-day13-q1', 'mkt-day13-q2', 'mkt-day13-q3', 'mkt-day13-q4', 'mkt-day13-q5']
      },
      {
        name: 'Product Portfolio & BCG Matrix',
        concepts: ['Product Mix Width & Depth', 'BCG Growth-Share Matrix (Stars, Cash Cows, Question Marks, Dogs)'],
        learningObjectives: [
          'Optimize product portfolios for long-term corporate growth'
        ],
        quests: ['mkt-day14-q1', 'mkt-day14-q2', 'mkt-day14-q3', 'mkt-day14-q4', 'mkt-day14-q5']
      },
      {
        name: 'Branding & Brand Identity Systems',
        concepts: ['Brand Elements (Logo, Tone, Vision)', 'Brand Identity vs Image', 'Packaging & Labeling Design'],
        learningObjectives: [
          'Design consistent brand identity guidelines'
        ],
        quests: ['mkt-day15-q1', 'mkt-day15-q2', 'mkt-day15-q3', 'mkt-day15-q4', 'mkt-day15-q5']
      },
      {
        name: 'Brand Equity & Architecture',
        concepts: ['Brand Equity Valuation', 'Brand Extensions', 'Brand Architecture (House of Brands vs Branded House)'],
        learningObjectives: [
          'Evaluate brand equity drivers and corporate brand structures'
        ],
        quests: ['mkt-day16-q1', 'mkt-day16-q2', 'mkt-day16-q3', 'mkt-day16-q4', 'mkt-day16-q5']
      }
    ]
  },
  {
    id: 'mkt-mod-5',
    title: 'Module 5 — Pricing & Distribution Strategy',
    dayRange: 'Days 17–20',
    goal: 'Formulate profitable pricing strategies and design efficient retail, wholesale, and direct distribution channels.',
    topics: [
      {
        name: 'Pricing Fundamentals & Objectives',
        concepts: ['Price Elasticity of Demand', 'Pricing Objectives', 'Price Sensitivity Factors'],
        learningObjectives: [
          'Calculate price elasticity and determine pricing power'
        ],
        quests: ['mkt-day17-q1', 'mkt-day17-q2', 'mkt-day17-q3', 'mkt-day17-q4', 'mkt-day17-q5']
      },
      {
        name: 'Pricing Strategies & Models',
        concepts: ['Cost-Plus Pricing', 'Value-Based Pricing', 'Skimming vs Penetration Pricing', 'Dynamic & Promotional Pricing'],
        learningObjectives: [
          'Select optimal pricing models based on market dynamics'
        ],
        quests: ['mkt-day18-q1', 'mkt-day18-q2', 'mkt-day18-q3', 'mkt-day18-q4', 'mkt-day18-q5']
      },
      {
        name: 'Distribution Channels & Retail Strategy',
        concepts: ['Direct vs Indirect Channels', 'Wholesale & Retail Dynamics', 'Omnichannel Distribution'],
        learningObjectives: [
          'Design channel structures balancing coverage and margin control'
        ],
        quests: ['mkt-day19-q1', 'mkt-day19-q2', 'mkt-day19-q3', 'mkt-day19-q4', 'mkt-day19-q5']
      },
      {
        name: 'Supply Chain & Channel Conflicts',
        concepts: ['Logistics Basics', 'Channel Conflicts & Mitigation', 'Vertical Marketing Systems'],
        learningObjectives: [
          'Resolve channel conflict between online and offline partners'
        ],
        quests: ['mkt-day20-q1', 'mkt-day20-q2', 'mkt-day20-q3', 'mkt-day20-q4', 'mkt-day20-q5']
      }
    ]
  },
  {
    id: 'mkt-mod-6',
    title: 'Module 6 — Marketing Communication',
    dayRange: 'Days 21–24',
    goal: 'Design integrated marketing communication (IMC) campaigns across advertising, PR, promotions, and sales.',
    topics: [
      {
        name: 'Integrated Marketing Communication (IMC)',
        concepts: ['IMC Framework', 'AIDA Model (Attention, Interest, Desire, Action)', 'Message Structuring'],
        learningObjectives: [
          'Align messaging across diverse communication channels'
        ],
        quests: ['mkt-day21-q1', 'mkt-day21-q2', 'mkt-day21-q3', 'mkt-day21-q4', 'mkt-day21-q5']
      },
      {
        name: 'Advertising & Public Relations (PR)',
        concepts: ['Creative Strategy', 'Media Planning & Scheduling', 'PR & Crisis Communication'],
        learningObjectives: [
          'Formulate advertising budgets and media reach strategies'
        ],
        quests: ['mkt-day22-q1', 'mkt-day22-q2', 'mkt-day22-q3', 'mkt-day22-q4', 'mkt-day22-q5']
      },
      {
        name: 'Sales Promotion & Personal Selling',
        concepts: ['Consumer & Trade Promotions', 'Personal Selling Process', 'Sales Force Management'],
        learningObjectives: [
          'Design short-term sales incentives and B2B sales pipelines'
        ],
        quests: ['mkt-day23-q1', 'mkt-day23-q2', 'mkt-day23-q3', 'mkt-day23-q4', 'mkt-day23-q5']
      },
      {
        name: 'Campaign Planning & Media Budgeting',
        concepts: ['Campaign Brief Creation', 'Objective & Task Budgeting', 'Reach vs Frequency'],
        learningObjectives: [
          'Develop comprehensive campaign plans and media allocation budgets'
        ],
        quests: ['mkt-day24-q1', 'mkt-day24-q2', 'mkt-day24-q3', 'mkt-day24-q4', 'mkt-day24-q5']
      }
    ]
  },
  {
    id: 'mkt-mod-7',
    title: 'Module 7 — Marketing Performance & Strategy',
    dayRange: 'Days 25–27',
    goal: 'Measure marketing ROI, track financial KPIs (CAC, CLV), conduct SWOT evaluations, and optimize campaign performance.',
    topics: [
      {
        name: 'Marketing KPIs & Financial Metrics',
        concepts: ['Customer Acquisition Cost (CAC)', 'Customer Lifetime Value (CLV)', 'Return on Marketing Investment (ROMI)'],
        learningObjectives: [
          'Calculate CAC, CLV, and payback period to evaluate unit economics'
        ],
        quests: ['mkt-day25-q1', 'mkt-day25-q2', 'mkt-day25-q3', 'mkt-day25-q4', 'mkt-day25-q5']
      },
      {
        name: 'Competitor Analysis & SWOT Evaluation',
        concepts: ['Competitive Intelligence', 'SWOT Matrix', 'Porters Five Forces in Marketing'],
        learningObjectives: [
          'Perform strategic competitive audits and SWOT evaluations'
        ],
        quests: ['mkt-day26-q1', 'mkt-day26-q2', 'mkt-day26-q3', 'mkt-day26-q4', 'mkt-day26-q5']
      },
      {
        name: 'Marketing Audits & Growth Strategy',
        concepts: ['Ansoff Growth Matrix (Market Penetration, Development, Diversification)', 'Marketing Audits', 'Strategic Marketing Plan'],
        learningObjectives: [
          'Formulate corporate growth strategies using the Ansoff Matrix'
        ],
        quests: ['mkt-day27-q1', 'mkt-day27-q2', 'mkt-day27-q3', 'mkt-day27-q4', 'mkt-day27-q5']
      }
    ]
  },
  {
    id: 'mkt-mod-8',
    title: 'Module 8 — Modern Branding & AI in Marketing',
    dayRange: 'Days 28–29',
    goal: 'Explore modern omni-channel brand building, influencer dynamics, marketing automation, and AI-driven customer intelligence.',
    topics: [
      {
        name: 'Modern Omnichannel & Influencer Branding',
        concepts: ['Omnichannel Brand Experience', 'Influencer Marketing Dynamics', 'Personal Branding'],
        learningObjectives: [
          'Build consistent brand presences across physical and digital touchpoints'
        ],
        quests: ['mkt-day28-q1', 'mkt-day28-q2', 'mkt-day28-q3', 'mkt-day28-q4', 'mkt-day28-q5']
      },
      {
        name: 'AI & Marketing Automation',
        concepts: ['AI Consumer Insights', 'Automated Campaign Optimization', 'Predictive Customer Analytics'],
        learningObjectives: [
          'Utilize AI tools to personalize customer journeys and predict churn'
        ],
        quests: ['mkt-day29-q1', 'mkt-day29-q2', 'mkt-day29-q3', 'mkt-day29-q4', 'mkt-day29-q5']
      }
    ]
  },
  {
    id: 'mkt-mod-9',
    title: 'Day 30 — Integrated Marketing Strategy Capstone',
    dayRange: 'Day 30',
    goal: 'Synthesize customer research, STP, product development, pricing, distribution, communications, and performance KPIs into a complete strategy.',
    topics: [
      {
        name: 'Integrated Strategy & Capstone Assessment',
        concepts: ['Integrated Marketing Framework', 'C-Suite Strategy Deck', 'Comprehensive Professional Marketing Certification'],
        learningObjectives: [
          'Build an end-to-end marketing and brand management strategy for a new business launch'
        ],
        quests: ['mkt-day30-q1', 'mkt-day30-q2', 'mkt-day30-q3', 'mkt-day30-q4', 'mkt-day30-q5']
      }
    ]
  }
];
