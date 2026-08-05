export interface EcommerceKnowledgeModule {
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

export const BCOM_ECOMMERCE_KNOWLEDGE_GRAPH: EcommerceKnowledgeModule[] = [
  {
    id: 'ecom-mod-1',
    title: 'Module 1 — Foundations of E-Commerce & Digital Business',
    dayRange: 'Days 1–4',
    goal: 'Help students understand how businesses operate in the digital economy before introducing platforms or tools.',
    topics: [
      {
        name: 'Introduction to E-Commerce & Digital Business Ecosystem',
        concepts: ['What is E-Commerce?', 'Evolution of Commerce', 'Traditional vs Digital Business', 'Digital Business Ecosystem'],
        learningObjectives: [
          'Differentiate digital business operations from traditional retail',
          'Understand key players in the digital business ecosystem'
        ],
        quests: ['ecom-day1-q1', 'ecom-day1-q2', 'ecom-day1-q3']
      },
      {
        name: 'E-Commerce Business Models & Value Chain',
        concepts: ['B2B, B2C, C2C, C2B, D2C Models', 'Marketplace vs Subscription vs SaaS Models', 'Digital Value Chain', 'E-Commerce Customer Journey'],
        learningObjectives: [
          'Classify online business models (Marketplace, D2C, Subscription)',
          'Map the e-commerce customer journey from discovery to loyalty'
        ],
        quests: ['ecom-day2-q1', 'ecom-day2-q2', 'ecom-day2-q3']
      },
      {
        name: 'Digital Business Components & Opportunities',
        concepts: ['Core Online Store Components', 'Digital Economy Opportunities', 'Business Goal Alignment'],
        learningObjectives: [
          'Identify key technological components of an online business'
        ],
        quests: ['ecom-day3-q1', 'ecom-day3-q2', 'ecom-day3-q3', 'ecom-day3-q4', 'ecom-day3-q5']
      },
      {
        name: 'Digital Ethics, Consumer Trust & Regulations',
        concepts: ['Digital Business Ethics', 'Consumer Trust & Security', 'Online Business Regulations (Consumer Protection, Data Privacy)'],
        learningObjectives: [
          'Evaluate ethical online business practices and regulatory compliance'
        ],
        quests: ['ecom-day4-q1', 'ecom-day4-q2', 'ecom-day4-q3', 'ecom-day4-q4', 'ecom-day4-q5']
      }
    ]
  },
  {
    id: 'ecom-mod-2',
    title: 'Module 2 — Product & Marketplace Management',
    dayRange: 'Days 5–8',
    goal: 'Master product selection, research, catalog creation, SKU management, pricing strategies, and marketplace standards.',
    topics: [
      {
        name: 'Product Research & Selection',
        concepts: ['Product Selection Criteria', 'Niche & Demand Research', 'Product Lifecycle in E-Commerce'],
        learningObjectives: [
          'Evaluate product profitability and market demand for online selling'
        ],
        quests: ['ecom-day5-q1', 'ecom-day5-q2', 'ecom-day5-q3', 'ecom-day5-q4', 'ecom-day5-q5']
      },
      {
        name: 'Product Catalog & SKU Management',
        concepts: ['Product Catalog Architecture', 'SKU Generation & Management', 'Product Information Management (PIM)'],
        learningObjectives: [
          'Design organized product catalog structures and SKU taxonomies'
        ],
        quests: ['ecom-day6-q1', 'ecom-day6-q2', 'ecom-day6-q3', 'ecom-day6-q4', 'ecom-day6-q5']
      },
      {
        name: 'E-Commerce Product Pricing Strategies',
        concepts: ['Cost-Plus & Margin Calculation', 'Dynamic & Competitor-Based Pricing', 'Psychological Pricing in E-Commerce'],
        learningObjectives: [
          'Calculate gross margins, net margins, and break-even pricing'
        ],
        quests: ['ecom-day7-q1', 'ecom-day7-q2', 'ecom-day7-q3', 'ecom-day7-q4', 'ecom-day7-q5']
      },
      {
        name: 'Marketplace Standards & Listing Optimization',
        concepts: ['Product Images & Media Standards', 'Searchable Product Titles & Descriptions', 'Marketplace Listing Optimization'],
        learningObjectives: [
          'Create high-converting product listings conforming to marketplace standards'
        ],
        quests: ['ecom-day8-q1', 'ecom-day8-q2', 'ecom-day8-q3', 'ecom-day8-q4', 'ecom-day8-q5']
      }
    ]
  },
  {
    id: 'ecom-mod-3',
    title: 'Module 3 — Online Store Operations',
    dayRange: 'Days 9–12',
    goal: 'Design seamless online store architecture, navigation, checkout workflows, order management, and return/refund processes.',
    topics: [
      {
        name: 'Store Structure & Navigation UX',
        concepts: ['Category Taxonomy', 'Site Navigation & Search Filters', 'Mobile Storefront Optimization'],
        learningObjectives: [
          'Build intuitive store navigation and category hierarchy'
        ],
        quests: ['ecom-day9-q1', 'ecom-day9-q2', 'ecom-day9-q3', 'ecom-day9-q4', 'ecom-day9-q5']
      },
      {
        name: 'Shopping Cart & Frictionless Checkout',
        concepts: ['Shopping Cart UX', 'Frictionless One-Page Checkout', 'Guest Checkout vs Account Creation'],
        learningObjectives: [
          'Identify and remove friction points in the online checkout flow'
        ],
        quests: ['ecom-day10-q1', 'ecom-day10-q2', 'ecom-day10-q3', 'ecom-day10-q4', 'ecom-day10-q5']
      },
      {
        name: 'Order Management Systems (OMS)',
        concepts: ['Order Processing Lifecycle', 'Inventory Sync Across Channels', 'Order Status Tracking'],
        learningObjectives: [
          'Map the complete order lifecycle from placement to fulfillment'
        ],
        quests: ['ecom-day11-q1', 'ecom-day11-q2', 'ecom-day11-q3', 'ecom-day11-q4', 'ecom-day11-q5']
      },
      {
        name: 'Reverse Logistics, Returns & Support',
        concepts: ['Return & Refund Policies', 'Reverse Logistics Workflow', 'Customer Support Integration'],
        learningObjectives: [
          'Design customer-friendly return policies while managing reverse shipping costs'
        ],
        quests: ['ecom-day12-q1', 'ecom-day12-q2', 'ecom-day12-q3', 'ecom-day12-q4', 'ecom-day12-q5']
      }
    ]
  },
  {
    id: 'ecom-mod-4',
    title: 'Module 4 — Digital Payments & Logistics',
    dayRange: 'Days 13–16',
    goal: 'Understand payment gateways (UPI, Cards, COD), gateway fees, warehousing, shipping logistics, and order fulfillment.',
    topics: [
      {
        name: 'Digital Payment Systems & Gateways',
        concepts: ['Payment Gateway Architecture', 'UPI, Net Banking, Cards & Wallets', 'Gateway Transaction Fees & Settlement'],
        learningObjectives: [
          'Evaluate payment gateway options based on security and transaction costs'
        ],
        quests: ['ecom-day13-q1', 'ecom-day13-q2', 'ecom-day13-q3', 'ecom-day13-q4', 'ecom-day13-q5']
      },
      {
        name: 'Cash on Delivery (COD) Management',
        concepts: ['COD Operations in India/Emerging Markets', 'RTO (Return to Origin) Risk Reduction', 'COD Reconciliation'],
        learningObjectives: [
          'Formulate strategies to minimize Cash-on-Delivery RTO losses'
        ],
        quests: ['ecom-day14-q1', 'ecom-day14-q2', 'ecom-day14-q3', 'ecom-day14-q4', 'ecom-day14-q5']
      },
      {
        name: 'Warehousing & Inventory Management',
        concepts: ['Inventory Stock Levels (Safety Stock, Reorder Point)', 'Warehousing Models (3PL, Dark Stores)', 'Pick, Pack & Ship Workflows'],
        learningObjectives: [
          'Calculate reorder points and safety stock levels for physical inventory'
        ],
        quests: ['ecom-day15-q1', 'ecom-day15-q2', 'ecom-day15-q3', 'ecom-day15-q4', 'ecom-day15-q5']
      },
      {
        name: 'Logistics Partners & Order Fulfillment',
        concepts: ['First-Mile vs Last-Mile Delivery', 'Shipping Aggregators & Rate Cards', 'Real-Time Delivery Tracking'],
        learningObjectives: [
          'Select logistics partners and optimize shipping costs across zones'
        ],
        quests: ['ecom-day16-q1', 'ecom-day16-q2', 'ecom-day16-q3', 'ecom-day16-q4', 'ecom-day16-q5']
      }
    ]
  },
  {
    id: 'ecom-mod-5',
    title: 'Module 5 — Customer Experience & CRM',
    dayRange: 'Days 17–20',
    goal: 'Build exceptional customer service systems, CRM workflows, loyalty programs, review management, and omnichannel CX.',
    topics: [
      {
        name: 'Customer Service & CRM Fundamentals',
        concepts: ['E-Commerce Customer Service Standards', 'CRM Database Management', 'Omnichannel Customer Support'],
        learningObjectives: [
          'Structure customer support workflows across chat, email, and social'
        ],
        quests: ['ecom-day17-q1', 'ecom-day17-q2', 'ecom-day17-q3', 'ecom-day17-q4', 'ecom-day17-q5']
      },
      {
        name: 'Customer Retention & Loyalty Programs',
        concepts: ['Repeat Purchase Rate', 'Loyalty Tier Design', 'VIP Customer Benefits'],
        learningObjectives: [
          'Design points-based and tiered loyalty programs to drive repeat purchases'
        ],
        quests: ['ecom-day18-q1', 'ecom-day18-q2', 'ecom-day18-q3', 'ecom-day18-q4', 'ecom-day18-q5']
      },
      {
        name: 'Reviews, Ratings & Social Proof',
        concepts: ['User-Generated Reviews & Ratings', 'Social Proof Widgets', 'Negative Review Escalation & Resolution'],
        learningObjectives: [
          'Manage online customer reviews and turn complaints into trust'
        ],
        quests: ['ecom-day19-q1', 'ecom-day19-q2', 'ecom-day19-q3', 'ecom-day19-q4', 'ecom-day19-q5']
      },
      {
        name: 'Personalization & Customer Satisfaction (CSAT)',
        concepts: ['Personalized Product Recommendations', 'CSAT & Net Promoter Score (NPS) Surveys', 'Customer Delighting Strategies'],
        learningObjectives: [
          'Measure NPS and CSAT scores to improve store satisfaction'
        ],
        quests: ['ecom-day20-q1', 'ecom-day20-q2', 'ecom-day20-q3', 'ecom-day20-q4', 'ecom-day20-q5']
      }
    ]
  },
  {
    id: 'ecom-mod-6',
    title: 'Module 6 — E-Commerce Analytics & Business Growth',
    dayRange: 'Days 21–24',
    goal: 'Track core e-commerce financial KPIs: Conversion Rate, Average Order Value (AOV), Cart Abandonment Rate, and CLV.',
    topics: [
      {
        name: 'Sales & Conversion Analytics',
        concepts: ['E-Commerce Conversion Rate', 'Cart Abandonment Rate Mitigation', 'Checkout Drop-Off Analytics'],
        learningObjectives: [
          'Analyze conversion funnel metrics and implement cart recovery tactics'
        ],
        quests: ['ecom-day21-q1', 'ecom-day21-q2', 'ecom-day21-q3', 'ecom-day21-q4', 'ecom-day21-q5']
      },
      {
        name: 'Average Order Value (AOV) Optimization',
        concepts: ['Average Order Value (AOV)', 'Cross-Selling & Upselling Mechanics', 'Product Bundling Strategies'],
        learningObjectives: [
          'Design product bundles and threshold discounts to increase AOV'
        ],
        quests: ['ecom-day22-q1', 'ecom-day22-q2', 'ecom-day22-q3', 'ecom-day22-q4', 'ecom-day22-q5']
      },
      {
        name: 'E-Commerce Financial Dashboards',
        concepts: ['Gross Revenue vs Net Revenue', 'Cost of Goods Sold (COGS)', 'Contribution Margin Analysis'],
        learningObjectives: [
          'Construct e-commerce contribution margin P&L statements'
        ],
        quests: ['ecom-day23-q1', 'ecom-day23-q2', 'ecom-day23-q3', 'ecom-day23-q4', 'ecom-day23-q5']
      },
      {
        name: 'Growth KPIs & Performance Tuning',
        concepts: ['Customer Acquisition Cost (CAC) vs CLV', 'Return on Investment (ROI)', 'Performance Optimization Tuning'],
        learningObjectives: [
          'Evaluate store unit economics and calculate CLV:CAC ratios'
        ],
        quests: ['ecom-day24-q1', 'ecom-day24-q2', 'ecom-day24-q3', 'ecom-day24-q4', 'ecom-day24-q5']
      }
    ]
  },
  {
    id: 'ecom-mod-7',
    title: 'Module 7 — Marketplace Strategy & Digital Entrepreneurship',
    dayRange: 'Days 25–27',
    goal: 'Master multi-channel marketplace operations (Amazon, Flipkart, Meesho), seller management, and digital expansion.',
    topics: [
      {
        name: 'Marketplace Seller Operations',
        concepts: ['Marketplace Seller Central Basics', 'Vendor vs Seller Models (1P vs 3P)', 'Marketplace Fee Structures'],
        learningObjectives: [
          'Compare 1P vendor vs 3P seller models on major marketplaces'
        ],
        quests: ['ecom-day25-q1', 'ecom-day25-q2', 'ecom-day25-q3', 'ecom-day25-q4', 'ecom-day25-q5']
      },
      {
        name: 'Multi-Channel Selling & Inventory Sync',
        concepts: ['Multi-Channel Listing Management', 'Centralized Inventory Management', 'Brand Protection & IP Rights'],
        learningObjectives: [
          'Manage multi-channel store inventory without overselling'
        ],
        quests: ['ecom-day26-q1', 'ecom-day26-q2', 'ecom-day26-q3', 'ecom-day26-q4', 'ecom-day26-q5']
      },
      {
        name: 'Digital Entrepreneurship & Scaling',
        concepts: ['Bootstrapping vs Venture Scaling', 'International E-Commerce Cross-Border Sales', 'Business Expansion Roadmaps'],
        learningObjectives: [
          'Formulate growth roadmaps for scaling digital businesses globally'
        ],
        quests: ['ecom-day27-q1', 'ecom-day27-q2', 'ecom-day27-q3', 'ecom-day27-q4', 'ecom-day27-q5']
      }
    ]
  },
  {
    id: 'ecom-mod-8',
    title: 'Module 8 — AI & Future of Digital Commerce',
    dayRange: 'Days 28–29',
    goal: 'Leverage AI for personalized product recommendations, automated customer support chatbots, dynamic pricing, and inventory forecasting.',
    topics: [
      {
        name: 'AI Product Recommendations & Dynamic Pricing',
        concepts: ['AI Recommendation Engines', 'Algorithmic Dynamic Pricing', 'Personalized Shopping Feeds'],
        learningObjectives: [
          'Implement AI recommendation rules to boost cross-sell conversion'
        ],
        quests: ['ecom-day28-q1', 'ecom-day28-q2', 'ecom-day28-q3', 'ecom-day28-q4', 'ecom-day28-q5']
      },
      {
        name: 'AI Customer Support & Predictive Inventory',
        concepts: ['AI Conversational Chatbots', 'Predictive Inventory Demand Forecasting', 'Future Trends in E-Commerce'],
        learningObjectives: [
          'Utilize predictive AI for stock forecasting and automated support'
        ],
        quests: ['ecom-day29-q1', 'ecom-day29-q2', 'ecom-day29-q3', 'ecom-day29-q4', 'ecom-day29-q5']
      }
    ]
  },
  {
    id: 'ecom-mod-9',
    title: 'Day 30 — Integrated Digital Business Strategy Capstone',
    dayRange: 'Day 30',
    goal: 'Synthesize business model, catalog, pricing, store structure, payments, logistics, customer support, KPIs, and AI growth into a complete plan.',
    topics: [
      {
        name: 'Integrated Business Strategy & Capstone Assessment',
        concepts: ['Digital Business Architecture', 'Comprehensive Pitch Deck', 'Certified E-Commerce Specialist Assessment'],
        learningObjectives: [
          'Build an end-to-end e-commerce business plan for launching or scaling a digital store'
        ],
        quests: ['ecom-day30-q1', 'ecom-day30-q2', 'ecom-day30-q3', 'ecom-day30-q4', 'ecom-day30-q5']
      }
    ]
  }
];
