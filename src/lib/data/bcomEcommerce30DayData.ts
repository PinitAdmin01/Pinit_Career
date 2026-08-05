import { CourseQuest } from './coursesData';

// Helper function to generate all 146 E-Commerce & Digital Business Quests
function generate146EcommerceQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'ecom-day1-q1',
    title: 'Day 1 - Quest 1: Introduction to E-Commerce',
    desc: 'Understand what E-Commerce is, the historical evolution from brick-and-mortar to digital stores, traditional vs digital business models, and why companies transition online.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What is E-Commerce?', 'Evolution of Commerce', 'Traditional vs Digital Business', 'Why Businesses Go Online'],
    hint: 'E-commerce eliminates geographic barriers, lowers overheads, and operates 24/7/365.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ecom-day1-q2',
    title: 'Day 1 - Quest 2: The Digital Business Ecosystem',
    desc: 'Explore the key stakeholders in digital commerce: Customers, Sellers, Payment & Logistics Service Providers, Digital Platforms, and Technology Partners.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Customers & Sellers', 'Service Providers', 'Digital Platforms', 'Technology Partners'],
    hint: 'Digital platforms connect buyers and sellers while leveraging third-party logistics and payment APIs.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ecom-day1-q3',
    title: 'Day 1 - Quest 3: Types of E-Commerce Models',
    desc: 'Deconstruct core e-commerce transaction models: B2B (Business-to-Business), B2C (Business-to-Consumer), C2C (Consumer-to-Consumer), C2B (Consumer-to-Business), and D2C (Direct-to-Consumer).',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['B2B', 'B2C', 'C2C', 'C2B', 'D2C'],
    hint: 'D2C brands cut out traditional retail middlemen to own the end-to-end customer relationship and margins.',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'ecom-day2-q1',
    title: 'Day 2 - Quest 1: Digital Business Models',
    desc: 'Examine monetization and operating models: Marketplaces, Subscription Commerce, SaaS Platforms, Digital Goods, and Service-Based Businesses.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Marketplace', 'Subscription', 'SaaS', 'Digital Products', 'Service-Based Business'],
    hint: 'Subscription models generate predictable recurring revenue (MRR), whereas marketplaces earn commission fees.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ecom-day2-q2',
    title: 'Day 2 - Quest 2: The Business Value Chain',
    desc: 'Trace the digital business value chain: Product Sourcing -> Marketing -> Online Sales -> Order Delivery -> Customer Support.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Product Sourcing', 'Marketing', 'Sales', 'Delivery', 'Customer Support'],
    hint: 'A bottleneck at any stage (e.g. slow delivery) will damage the overall brand perception.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ecom-day2-q3',
    title: 'Day 2 - Quest 3: Customer Journey in E-Commerce',
    desc: 'Map the e-commerce shopper lifecycle: Discovery -> Evaluation -> Purchase -> Delivery -> Retention -> Brand Loyalty.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Discovery', 'Evaluation', 'Purchase', 'Delivery', 'Retention & Loyalty'],
    hint: 'Post-purchase delivery communications are crucial for turning first-time buyers into loyal advocates.',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - Store Fundamentals & Opportunities', topics: ['Digital Business Components', 'Online Store Fundamentals', 'Business Opportunities in Digital Economy'] },
    4: { moduleName: 'Module 1 - Business Ethics & Regulations', topics: ['Digital Business Ethics', 'Consumer Trust & Security', 'Online Business Regulations'] },
    5: { moduleName: 'Module 2 - Product Selection & Research', topics: ['Product Selection Criteria', 'Product Research & Demand', 'Product Lifecycle in E-Commerce'] },
    6: { moduleName: 'Module 2 - Catalog & SKU Management', topics: ['Product Catalog Architecture', 'SKU Generation & Management', 'Product Information Systems'] },
    7: { moduleName: 'Module 2 - E-Commerce Pricing Strategies', topics: ['Cost-Plus & Margin Calculation', 'Dynamic & Competitor Pricing', 'Psychological Pricing Rules'] },
    8: { moduleName: 'Module 2 - Marketplace Standards', topics: ['Product Images & Media Standards', 'Searchable Product Titles', 'Marketplace Listing Optimization'] },
    9: { moduleName: 'Module 3 - Store Navigation & Taxonomy', topics: ['Category Taxonomy', 'Site Navigation & Filters', 'Mobile Storefront Optimization'] },
    10: { moduleName: 'Module 3 - Cart & Checkout UX', topics: ['Shopping Cart UX', 'Frictionless One-Page Checkout', 'Guest Checkout vs Accounts'] },
    11: { moduleName: 'Module 3 - Order Management Systems', topics: ['Order Processing Lifecycle', 'Inventory Sync Across Channels', 'Order Status Tracking'] },
    12: { moduleName: 'Module 3 - Returns & Customer Support', topics: ['Return & Refund Policies', 'Reverse Logistics Workflow', 'Customer Support Integration'] },
    13: { moduleName: 'Module 4 - Digital Payment Systems', topics: ['Payment Gateway Architecture', 'UPI, Cards & Net Banking', 'Gateway Settlement & Fees'] },
    14: { moduleName: 'Module 4 - Cash on Delivery (COD)', topics: ['COD Operations in Emerging Markets', 'RTO Risk Reduction', 'COD Cash Reconciliation'] },
    15: { moduleName: 'Module 4 - Warehousing & Inventory', topics: ['Safety Stock & Reorder Points', '3PL Warehousing Models', 'Pick, Pack & Ship Workflows'] },
    16: { moduleName: 'Module 4 - Logistics & Fulfillment', topics: ['First-Mile & Last-Mile Delivery', 'Shipping Aggregators & Rates', 'Real-Time Delivery Tracking'] },
    17: { moduleName: 'Module 5 - Customer Support & CRM', topics: ['Customer Service Standards', 'CRM Database Management', 'Omnichannel Customer Support'] },
    18: { moduleName: 'Module 5 - Retention & Loyalty', topics: ['Repeat Purchase Rate', 'Loyalty Program Tier Design', 'VIP Customer Benefits'] },
    19: { moduleName: 'Module 5 - Reviews & Ratings', topics: ['User Reviews & Ratings', 'Social Proof Widgets', 'Negative Review Resolution'] },
    20: { moduleName: 'Module 5 - Personalization & CSAT', topics: ['Personalized Product Recommendations', 'CSAT & NPS Surveys', 'Customer Delighting Tactics'] },
    21: { moduleName: 'Module 6 - Sales & Conversion Analytics', topics: ['E-Commerce Conversion Rate', 'Cart Abandonment Mitigation', 'Checkout Drop-Off Analytics'] },
    22: { moduleName: 'Module 6 - Average Order Value (AOV)', topics: ['Average Order Value (AOV)', 'Cross-Selling & Upselling Mechanics', 'Product Bundling Strategies'] },
    23: { moduleName: 'Module 6 - E-Commerce Dashboards', topics: ['Gross Revenue vs Net Revenue', 'Cost of Goods Sold (COGS)', 'Contribution Margin Analysis'] },
    24: { moduleName: 'Module 6 - Unit Economics & Performance', topics: ['Customer Acquisition Cost (CAC)', 'Customer Lifetime Value (CLV)', 'CLV:CAC Ratio Optimization'] },
    25: { moduleName: 'Module 7 - Marketplace Seller Operations', topics: ['Marketplace Seller Central Basics', 'Vendor vs Seller Models (1P vs 3P)', 'Marketplace Fee Structures'] },
    26: { moduleName: 'Module 7 - Multi-Channel Selling', topics: ['Multi-Channel Listing Systems', 'Centralized Inventory Management', 'Brand Protection & IP Rights'] },
    27: { moduleName: 'Module 7 - Digital Entrepreneurship', topics: ['Bootstrapping vs Venture Scaling', 'International E-Commerce Sales', 'Business Expansion Roadmaps'] },
    28: { moduleName: 'Module 8 - AI Product Recommendations', topics: ['AI Recommendation Engines', 'Algorithmic Dynamic Pricing', 'Personalized Shopping Feeds'] },
    29: { moduleName: 'Module 8 - AI Support & Forecasting', topics: ['AI Conversational Chatbots', 'Predictive Inventory Forecasting', 'Future Trends in E-Commerce'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['E-Commerce Operations', 'Digital Business', 'Store Analytics'] };

    // Teaching 1
    quests.push({
      id: `ecom-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `Comprehensive lecture on ${info.topics[0]} with real-world digital business case studies.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Operational Architecture', 'Industry Standards'],
      hint: `Understand how ${info.topics[0]} improves store efficiency or revenue.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `ecom-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed breakdown of ${info.topics[1]} and operational execution.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Technical Integration', 'Workflow Mechanics'],
      hint: `Focus on metrics that validate the success of ${info.topics[1]}.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `ecom-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and scaling operations.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Performance Metrics', 'Executive Dashboards'],
      hint: `Ensure processes for ${info.topics[2]} can scale smoothly as order volume grows.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive e-commerce solver / margin calculator / SKU builder)
    quests.push({
      id: `ecom-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Assignment - ${info.topics[0]}`,
      desc: `Execute practical e-commerce tasks: calculate gross profit margins, design product listing SKUs, compute reorder points, or evaluate payment gateway fees.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function processEcommerceAssignmentDay${day}(orderData) {\n  // Calculate AOV, Gross Margin, or Shipping Costs\n  return {\n    aov: 1450,\n    grossMarginPct: 42.5,\n    reorderPointUnits: 250,\n    orderValidated: true\n  };\n}`,
      testSuite: `if (typeof processEcommerceAssignmentDay${day} !== 'function') throw new Error('Assignment solver missing');`,
      hint: `Formula check: AOV = Total Revenue / Total Orders. Gross Margin = ((Revenue - COGS) / Revenue) * 100.`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical E-Commerce Exam)
    quests.push({
      id: `ecom-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily E-Commerce Mastery Exam - ${info.moduleName}`,
      desc: `Evaluates digital business operations, inventory math, and logistics management under timed exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function validateEcommerceExamDay${day}(answers) {\n  // Validate store calculations and operational decisions\n  return true;\n}`,
      testSuite: `if (typeof validateEcommerceExamDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Review unit economics (COGS, AOV, CAC, CLV) before submitting your answers.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Integrated Digital Business Strategy Capstone (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'ecom-day30-q1',
    title: 'Day 30 - Quest 1: Digital Business Framework Synthesis',
    desc: 'Synthesize the overarching digital business framework: Business Model -> Target Customers -> Product Catalog -> Monetization & Revenue.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Digital Business Synthesis', 'Value Proposition Alignment', 'Monetization Architecture'],
    hint: 'A solid digital business model aligns customer value directly with sustainable gross margins.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'ecom-day30-q2',
    title: 'Day 30 - Quest 2: E-Commerce Operations Framework Synthesis',
    desc: 'Unify Order Management, Payment Systems, Warehousing, Shipping Logistics, and Customer Experience into an integrated operational engine.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Order Lifecycle Integration', 'Logistics & Payment Sync', 'Customer Experience Operations'],
    hint: 'Operational excellence ensures orders are picked, packed, shipped, and delivered seamlessly.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'ecom-day30-q3',
    title: 'Day 30 - Quest 3: Scaling a Digital Business & AI Integration',
    desc: 'Align Analytics Dashboards, Multi-Channel Selling, Growth Marketing, Automation, and AI Tools for scaling digital enterprises.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Scaling Operations', 'Multi-Channel Strategy', 'AI-Powered Commerce'],
    hint: 'Leverage AI for demand forecasting and dynamic pricing while maintaining strong supplier relationships.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Master Integrated E-Commerce Business Plan Project
  quests.push({
    id: 'ecom-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Complete E-Commerce Business Plan',
    desc: 'Develop a complete e-commerce business plan for launching an online store or marketplace: business model selection, product catalog design, pricing & margin strategy, store navigation structure, payment gateway selection, logistics & fulfillment plan, customer support workflow, KPI financial scorecard, and growth scaling roadmap.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function executeEcommerceBusinessPlanCapstone(businessModelBrief) {\n  // 1. Select Model (D2C / Marketplace / Subscription)\n  // 2. Build SKU Catalog & Pricing (Target 40%+ Gross Margin)\n  // 3. Define Payment Gateways (UPI/Cards) & Logistics (3PL/COD)\n  // 4. Calculate Projected AOV, CAC, and CLV\n  return {\n    businessModel: "D2C Premium Apparel",\n    catalogSKUCount: 150,\n    targetGrossMarginPct: 55.0,\n    paymentPartners: ["Razorpay (UPI/Cards)", "Cashfree (COD Verification)"],\n    logisticsModel: "3PL Aggregator Fulfillment",\n    kpiScorecard: {\n      targetAOV: 1850,\n      targetCAC: 420,\n      projectedCLV: 5500\n    },\n    businessPlanComplete: true\n  };\n}`,
    testSuite: `if (typeof executeEcommerceBusinessPlanCapstone !== 'function') throw new Error('Capstone solver missing');\nconst res = executeEcommerceBusinessPlanCapstone({});\nif (!res.businessPlanComplete || !res.paymentPartners) throw new Error('Capstone business plan incomplete');`,
    hint: `Ensure all key operational areas (business model, catalog, payments, logistics, and unit economics) are defined!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional E-Commerce Certification
  quests.push({
    id: 'ecom-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - E-Commerce & Digital Business',
    desc: 'Mastery certification assessment covering E-Commerce Fundamentals, Digital Business Models, Product & Catalog Management, Store Operations, Payments, Logistics, Customer Experience, Marketplace Strategy, Analytics, and AI in Digital Commerce.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalEcommerceCertificationExam(candidateAnswers) {\n  // Validate comprehensive 90-minute e-commerce & digital business exam\n  return {\n    scorePct: 97,\n    passed: true,\n    certificationTitle: "Certified E-Commerce & Digital Business Specialist"\n  };\n}`,
    testSuite: `if (typeof executeFinalEcommerceCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalRes = executeFinalEcommerceCertificationExam({});\nif (!evalRes.passed) throw new Error('Certification evaluation failed');`,
    hint: `Review all 8 modules before initiating the final comprehensive certification assessment.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_ECOMMERCE_30_DAYS_QUESTS: CourseQuest[] = generate146EcommerceQuests();
