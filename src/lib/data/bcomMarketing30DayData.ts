import { CourseQuest } from './coursesData';

// Helper function to generate all 146 Marketing & Brand Management Quests
function generate146MarketingQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'mkt-day1-q1',
    title: 'Day 1 - Quest 1: Introduction to Marketing',
    desc: 'Understand what Marketing is, why Marketing matters to businesses, the evolution of marketing mindsets, and the fundamental distinction between Marketing and Selling.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Definition of Marketing', 'Why Marketing Matters', 'Evolution of Marketing', 'Marketing vs Selling'],
    hint: 'Selling focuses on seller needs to turn product into cash; marketing focuses on buyer needs to create value.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'mkt-day1-q2',
    title: 'Day 1 - Quest 2: Understanding Customers',
    desc: 'Explore core customer concepts: Needs, Wants, Demands, Customer Value, and Satisfaction.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Customer Needs', 'Wants', 'Demand', 'Value', 'Satisfaction'],
    hint: 'Needs are basic human requirements; wants are needs directed to specific objects; demands are wants backed by ability to pay.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'mkt-day1-q3',
    title: 'Day 1 - Quest 3: Business & Markets',
    desc: 'Examine types of markets and customer interactions: B2B (Business-to-Business), B2C (Business-to-Consumer), and C2C (Consumer-to-Consumer).',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Types of Markets', 'Types of Customers', 'B2B', 'B2C', 'C2C'],
    hint: 'B2B purchases involve multiple decision-makers and longer sales cycles than B2C consumer purchases.',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'mkt-day2-q1',
    title: 'Day 2 - Quest 1: Marketing Environment',
    desc: 'Analyze internal and external forces acting on a firm: Micro Environment (suppliers, intermediaries, competitors) and Macro Environment (PESTLE).',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Internal Environment', 'External Environment', 'Micro Environment', 'Macro Environment'],
    hint: 'Companies can influence their micro environment, but must adapt to their macro environment.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'mkt-day2-q2',
    title: 'Day 2 - Quest 2: The Marketing Process',
    desc: 'Master the end-to-end marketing management process: Research -> Planning -> Execution -> Measurement -> Improvement.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Research', 'Planning', 'Execution', 'Measurement', 'Improvement'],
    hint: 'Effective execution requires continuous measurement to feed insights back into strategic planning.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'mkt-day2-q3',
    title: 'Day 2 - Quest 3: Introduction to the Marketing Mix (4 Ps)',
    desc: 'Deconstruct the foundational 4 Ps framework: Product, Price, Place (Distribution), and Promotion.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Product', 'Price', 'Place', 'Promotion'],
    hint: 'All 4 Ps must work in harmony to deliver a cohesive value proposition to the target audience.',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - Consumer Behaviour', topics: ['Customer Buying Behaviour', 'Factors Influencing Buying Decisions', 'Consumer Decision Journey'] },
    4: { moduleName: 'Module 1 - Marketing Ethics & CLV', topics: ['Marketing Ethics & Responsibility', 'Customer Relationships (CRM)', 'Customer Lifetime Value (CLV)'] },
    5: { moduleName: 'Module 2 - Primary & Secondary Research', topics: ['Market Research Fundamentals', 'Primary Research & Data Collection', 'Secondary Research Ingestion'] },
    6: { moduleName: 'Module 2 - Qualitative Insights', topics: ['Surveys & Questionnaires', 'Qualitative Interviews & Observation', 'Focus Group Management'] },
    7: { moduleName: 'Module 2 - Customer Personas', topics: ['Customer Personas & Profiles', 'Demographic vs Psychographic Profiles', 'User Pain Point Analysis'] },
    8: { moduleName: 'Module 2 - Journey & Trends', topics: ['Consumer Behaviour Deep-Dive', 'Customer Journey Mapping', 'Market Trends & Sentiment'] },
    9: { moduleName: 'Module 3 - Market Segmentation', topics: ['Geographic & Demographic Segmentation', 'Psychographic Lifestyle Segmentation', 'Behavioral Usage Segmentation'] },
    10: { moduleName: 'Module 3 - Target Market Selection', topics: ['Target Market Selection Criteria', 'Segment Attractiveness Evaluation', 'Targeting Strategies'] },
    11: { moduleName: 'Module 3 - Product Positioning', topics: ['Product Positioning Principles', 'Perceptual Mapping Techniques', 'Competitive Differentiation'] },
    12: { moduleName: 'Module 3 - Value Propositions', topics: ['Value Proposition Framework', 'Unique Selling Proposition (USP)', 'Positioning Statement Creation'] },
    13: { moduleName: 'Module 4 - Product Strategy & PLC', topics: ['Product Strategy & Core Levels', 'Product Life Cycle (PLC) Stages', 'New Product Development Process'] },
    14: { moduleName: 'Module 4 - Product Portfolio', topics: ['Product Portfolio Management', 'Product Line Width & Depth', 'BCG Growth-Share Matrix'] },
    15: { moduleName: 'Module 4 - Branding Fundamentals', topics: ['Branding & Brand Identity Systems', 'Logo, Tone & Brand Guidelines', 'Packaging & Labeling Design'] },
    16: { moduleName: 'Module 4 - Brand Equity', topics: ['Brand Equity Valuation', 'Brand Positioning & Extensions', 'Brand Architecture Systems'] },
    17: { moduleName: 'Module 5 - Pricing Fundamentals', topics: ['Pricing Fundamentals & Elasticity', 'Pricing Objectives', 'Cost-Based Pricing Models'] },
    18: { moduleName: 'Module 5 - Pricing Strategies', topics: ['Value-Based Pricing Models', 'Competitive & Skimming Pricing', 'Promotional & Dynamic Pricing'] },
    19: { moduleName: 'Module 6 - Distribution Channels', topics: ['Distribution Channels & Paths', 'Retail & Wholesale Dynamics', 'Direct-to-Consumer (D2C) Models'] },
    20: { moduleName: 'Module 5 - Supply Chain & Logistics', topics: ['Supply Chain Basics', 'Channel Conflict Resolution', 'Omnichannel Logistics'] },
    21: { moduleName: 'Module 6 - Marketing Communications', topics: ['Marketing Communication (IMC)', 'AIDA Communication Model', 'Advertising Principles'] },
    22: { moduleName: 'Module 6 - PR & Public Relations', topics: ['Public Relations & Media Relations', 'Crisis Communication Planning', 'Event & Sponsorship Marketing'] },
    23: { moduleName: 'Module 6 - Promotions & Sales', topics: ['Sales Promotion Tactics', 'Personal Selling Process', 'Direct Marketing Channels'] },
    24: { moduleName: 'Module 6 - Campaign Planning', topics: ['Integrated Marketing Campaigns', 'Campaign Media Budgeting', 'Reach & Frequency Metrics'] },
    25: { moduleName: 'Module 7 - Marketing KPIs & ROI', topics: ['Marketing KPIs & Scorecards', 'Customer Acquisition Cost (CAC)', 'Customer Lifetime Value (CLV) & ROI'] },
    26: { moduleName: 'Module 7 - Competitor & SWOT Analysis', topics: ['Competitor Intelligence Audits', 'SWOT Analysis Matrix', 'Brand Performance Metrics'] },
    27: { moduleName: 'Module 7 - Marketing Strategy', topics: ['Marketing Strategy Formulation', 'Ansoff Growth Matrix', 'Strategic Growth Planning'] },
    28: { moduleName: 'Module 8 - Modern Branding', topics: ['Digital Brand Presence', 'Omni-Channel Brand Consistency', 'Influencer & Personal Branding'] },
    29: { moduleName: 'Module 8 - AI in Marketing', topics: ['AI in Marketing & Insights', 'Marketing Automation Workflows', 'Future of Brand Management'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['Marketing Strategy', 'Brand Management', 'Customer Insights'] };

    // Teaching 1
    quests.push({
      id: `mkt-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `Comprehensive lecture on ${info.topics[0]} with real-world corporate case studies.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Strategic Frameworks', 'Industry Best Practices'],
      hint: `Understand how ${info.topics[0]} impacts long-term customer perception.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `mkt-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed analysis of ${info.topics[1]} and practical business application.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Operational Execution', 'Consumer Dynamics'],
      hint: `Apply ${info.topics[1]} to solve core marketing bottlenecks.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `mkt-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and performance optimization.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Measurement Metrics', 'Executive Reporting'],
      hint: `Focus on measuring the impact of ${info.topics[2]} on market share.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive marketing calculator / segmentation / campaign evaluator)
    quests.push({
      id: `mkt-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Assignment - ${info.topics[0]}`,
      desc: `Execute practical marketing analysis by evaluating customer segments, calculating CLV/CAC, or designing positioning statements.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function processMarketingAssignmentDay${day}(campaignData) {\n  // Calculate conversion rates, CAC, or segment positioning\n  return {\n    targetSegment: "Tech-savvy Professionals",\n    positioningValid: true,\n    estimatedCAC: 450\n  };\n}`,
      testSuite: `if (typeof processMarketingAssignmentDay${day} !== 'function') throw new Error('Assignment solver missing');`,
      hint: `Verify that target segment profiles align with your value proposition!`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical Marketing Exam)
    quests.push({
      id: `mkt-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily Marketing Mastery Exam - ${info.moduleName}`,
      desc: `Evaluates understanding of ${info.moduleName} under timed exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function validateMarketingExamDay${day}(answers) {\n  // Validate strategic choices and calculation accuracy\n  return true;\n}`,
      testSuite: `if (typeof validateMarketingExamDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Review key frameworks (4 Ps, STP, PLC, CLV) before submitting your answers.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Integrated Marketing Strategy Capstone (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'mkt-day30-q1',
    title: 'Day 30 - Quest 1: Marketing Strategy Framework Synthesis',
    desc: 'Synthesize the core marketing strategy framework: Customer Insights -> Market Opportunity -> Product Value -> Brand Positioning.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Customer-Centric Synthesis', 'Market Opportunity Audit', 'Integrated Marketing Framework'],
    hint: 'A successful marketing strategy aligns customer pain points directly with product capabilities.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'mkt-day30-q2',
    title: 'Day 30 - Quest 2: Integrated Brand Management Synthesis',
    desc: 'Unify Positioning, Pricing, Distribution Channels, and Marketing Communications into a seamless brand strategy.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Positioning Alignment', 'Pricing & Channel Integration', 'Unified IMC Messaging'],
    hint: 'Inconsistent pricing or distribution will undermine a premium brand positioning statement.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'mkt-day30-q3',
    title: 'Day 30 - Quest 3: Modern Marketing Leadership & AI Alignment',
    desc: 'Explore modern marketing leadership: leveraging data, AI, customer experience management, and continuous optimization.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Modern Marketing Leadership', 'Data & AI in Campaign Strategy', 'Customer Experience Optimization'],
    hint: 'Leaders use AI to personalize customer experiences while preserving core human brand values.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Comprehensive Marketing & Brand Strategy Capstone
  quests.push({
    id: 'mkt-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Complete Marketing & Brand Strategy Plan',
    desc: 'Develop a complete marketing and brand strategy for a new product launch: target audience analysis, customer segmentation, brand identity guidelines, positioning statement, pricing model, distribution plan, campaign roadmap, and KPI performance scorecards.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function executeMarketingBrandStrategyCapstone(productLaunchData) {\n  // 1. Define Target Segment & Positioning\n  // 2. Formulate 4 Ps Strategy (Product, Price, Place, Promotion)\n  // 3. Compute CAC, CLV, and ROMI projections\n  return {\n    targetAudienceDefined: true,\n    positioningStatement: "For urban professionals needing healthy meal options, GreenBites provides premium organic kits that deliver chef-crafted nutrition in 15 minutes.",\n    pricingModel: "Value-Based Tiered Subscription",\n    distributionChannels: ["D2C E-commerce", "Select Premium Grocery Retailers"],\n    kpiScorecard: {\n      targetCAC: 350,\n      projectedCLV: 4200,\n      targetROMI: 3.5\n    },\n    strategyComplete: true\n  };\n}`,
    testSuite: `if (typeof executeMarketingBrandStrategyCapstone !== 'function') throw new Error('Capstone solver missing');\nconst res = executeMarketingBrandStrategyCapstone({});\nif (!res.strategyComplete || !res.positioningStatement) throw new Error('Capstone strategy plan incomplete');`,
    hint: `Ensure all 4 Ps and key financial metrics (CAC, CLV, ROMI) are explicitly defined in your strategy!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional Marketing Certification
  quests.push({
    id: 'mkt-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - Marketing & Brand Management',
    desc: 'Mastery certification assessment covering Marketing Fundamentals, Consumer Behaviour, Market Research, STP Framework, Product & Brand Management, Pricing, Distribution, Communications, Marketing KPIs, and AI in Marketing.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalMarketingCertificationExam(candidateAnswers) {\n  // Validate comprehensive 90-minute marketing & brand management exam\n  return {\n    scorePct: 96,\n    passed: true,\n    certificationTitle: "Certified Marketing & Brand Management Specialist"\n  };\n}`,
    testSuite: `if (typeof executeFinalMarketingCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalRes = executeFinalMarketingCertificationExam({});\nif (!evalRes.passed) throw new Error('Certification evaluation failed');`,
    hint: `Review all 8 modules before initiating the final comprehensive certification assessment.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_MARKETING_30_DAYS_QUESTS: CourseQuest[] = generate146MarketingQuests();
