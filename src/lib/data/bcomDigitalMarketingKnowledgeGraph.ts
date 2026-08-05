export interface DigitalMarketingKnowledgeModule {
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

export const BCOM_DIGITAL_MARKETING_KNOWLEDGE_GRAPH: DigitalMarketingKnowledgeModule[] = [
  {
    id: 'dmkt-mod-1',
    title: 'Module 1 — Foundations of Digital Marketing',
    dayRange: 'Days 1–4',
    goal: 'Help students understand how businesses attract, convert, and retain customers using digital channels.',
    topics: [
      {
        name: 'Introduction to Digital Marketing & Ecosystem',
        concepts: ['What is Digital Marketing?', 'Traditional vs Digital Marketing', 'Digital Marketing Ecosystem (Websites, Search, Social, Email, Marketplaces)'],
        learningObjectives: [
          'Differentiate digital marketing from traditional channels',
          'Map the components of a digital marketing ecosystem'
        ],
        quests: ['dmkt-day1-q1', 'dmkt-day1-q2', 'dmkt-day1-q3']
      },
      {
        name: 'Marketing Funnel Fundamentals & Metrics',
        concepts: ['TOFU, MOFU, BOFU Funnel Stages', 'Organic vs Paid vs Owned vs Earned Media', 'Digital Metrics (Impressions, Reach, Clicks, Engagement, Conversions)'],
        learningObjectives: [
          'Deconstruct marketing funnels into acquisition and conversion stages',
          'Calculate basic campaign engagement and conversion rates'
        ],
        quests: ['dmkt-day2-q1', 'dmkt-day2-q2', 'dmkt-day2-q3']
      },
      {
        name: 'Digital Marketing Planning & Buyer Personas',
        concepts: ['Digital Marketing Planning Framework', 'Business Goals vs Marketing Goals', 'Digital Buyer Personas'],
        learningObjectives: [
          'Formulate digital goals aligned with business objectives',
          'Construct detailed digital buyer personas'
        ],
        quests: ['dmkt-day3-q1', 'dmkt-day3-q2', 'dmkt-day3-q3', 'dmkt-day3-q4', 'dmkt-day3-q5']
      },
      {
        name: 'Content Marketing & Digital Consumer Behaviour',
        concepts: ['Content Marketing Basics', 'Digital Consumer Decision Journeys', 'Marketing Ethics & Privacy (GDPR, Cookies)'],
        learningObjectives: [
          'Evaluate ethical digital practices and privacy compliance'
        ],
        quests: ['dmkt-day4-q1', 'dmkt-day4-q2', 'dmkt-day4-q3', 'dmkt-day4-q4', 'dmkt-day4-q5']
      }
    ]
  },
  {
    id: 'dmkt-mod-2',
    title: 'Module 2 — Website & Search Engine Optimization (SEO)',
    dayRange: 'Days 5–8',
    goal: 'Master search engine mechanics, keyword intent, technical SEO, on-page optimization, and site audits.',
    topics: [
      {
        name: 'Website Fundamentals & Search Engine Mechanics',
        concepts: ['Website UX & Information Architecture', 'Search Engine Crawling, Indexing & Ranking', 'Search Intent (Informational, Commercial, Transactional)'],
        learningObjectives: [
          'Explain how search engines index and rank web pages'
        ],
        quests: ['dmkt-day5-q1', 'dmkt-day5-q2', 'dmkt-day5-q3', 'dmkt-day5-q4', 'dmkt-day5-q5']
      },
      {
        name: 'Keyword Research & On-Page SEO',
        concepts: ['Keyword Research & Search Volume', 'On-Page SEO (Title Tags, H1, Meta Descriptions)', 'Content Optimization for Search Intent'],
        learningObjectives: [
          'Conduct keyword research and optimize on-page HTML elements'
        ],
        quests: ['dmkt-day6-q1', 'dmkt-day6-q2', 'dmkt-day6-q3', 'dmkt-day6-q4', 'dmkt-day6-q5']
      },
      {
        name: 'Technical SEO & Site Audits',
        concepts: ['Page Speed & Core Web Vitals', 'Mobile Responsiveness', 'XML Sitemaps & Robots.txt', 'Technical SEO Audits'],
        learningObjectives: [
          'Identify technical site errors impacting search rankings'
        ],
        quests: ['dmkt-day7-q1', 'dmkt-day7-q2', 'dmkt-day7-q3', 'dmkt-day7-q4', 'dmkt-day7-q5']
      },
      {
        name: 'Off-Page SEO & Local SEO',
        concepts: ['Backlinks & Domain Authority', 'Off-Page Link Building Strategies', 'Google Business Profile & Local SEO'],
        learningObjectives: [
          'Formulate ethical link-building and local search strategies'
        ],
        quests: ['dmkt-day8-q1', 'dmkt-day8-q2', 'dmkt-day8-q3', 'dmkt-day8-q4', 'dmkt-day8-q5']
      }
    ]
  },
  {
    id: 'dmkt-mod-3',
    title: 'Module 3 — Content Marketing & Social Media',
    dayRange: 'Days 9–12',
    goal: 'Develop content planning, persuasive copywriting, social media distribution, and community building strategies.',
    topics: [
      {
        name: 'Content Strategy & Planning',
        concepts: ['Content Marketing Strategy', 'Blogging & Long-Form Content', 'Content Pillar Framework'],
        learningObjectives: [
          'Build multi-channel content pillars aligned with brand goals'
        ],
        quests: ['dmkt-day9-q1', 'dmkt-day9-q2', 'dmkt-day9-q3', 'dmkt-day9-q4', 'dmkt-day9-q5']
      },
      {
        name: 'Copywriting & Storytelling',
        concepts: ['Persuasive Copywriting Formulas (PAS, AIDA)', 'Brand Storytelling', 'Headlines & Call-to-Action (CTA) Writing'],
        learningObjectives: [
          'Craft high-converting ad copy and blog headlines'
        ],
        quests: ['dmkt-day10-q1', 'dmkt-day10-q2', 'dmkt-day10-q3', 'dmkt-day10-q4', 'dmkt-day10-q5']
      },
      {
        name: 'Social Media Strategy & Platforms',
        concepts: ['Platform Nuances (LinkedIn, Instagram, YouTube, X)', 'Community Building', 'Social Media Content Calendars'],
        learningObjectives: [
          'Design platform-native social media strategies and editorial calendars'
        ],
        quests: ['dmkt-day11-q1', 'dmkt-day11-q2', 'dmkt-day11-q3', 'dmkt-day11-q4', 'dmkt-day11-q5']
      },
      {
        name: 'Video Marketing & Influencer Collaboration',
        concepts: ['Short-Form Video (Reels/Shorts)', 'Influencer Campaign Strategy', 'Social Engagement Tracking'],
        learningObjectives: [
          'Evaluate influencer partnerships and video engagement metrics'
        ],
        quests: ['dmkt-day12-q1', 'dmkt-day12-q2', 'dmkt-day12-q3', 'dmkt-day12-q4', 'dmkt-day12-q5']
      }
    ]
  },
  {
    id: 'dmkt-mod-4',
    title: 'Module 4 — Paid Advertising & Performance Marketing',
    dayRange: 'Days 13–16',
    goal: 'Plan pay-per-click (PPC) campaigns, manage ad budgets, target audiences, and track ad conversions.',
    topics: [
      {
        name: 'PPC & Digital Advertising Fundamentals',
        concepts: ['Pay-Per-Click (PPC) Model', 'Ad Auction & Quality Score', 'Google Search Ads vs Display Ads'],
        learningObjectives: [
          'Understand ad auction mechanics and ad quality scores'
        ],
        quests: ['dmkt-day13-q1', 'dmkt-day13-q2', 'dmkt-day13-q3', 'dmkt-day13-q4', 'dmkt-day13-q5']
      },
      {
        name: 'Meta Ads & Social Media Advertising',
        concepts: ['Paid Social Advertising', 'Audience Targeting (Lookalike, Interest, Custom)', 'Campaign Objectives & Placement'],
        learningObjectives: [
          'Structure social ad campaigns across awareness, consideration, and conversion'
        ],
        quests: ['dmkt-day14-q1', 'dmkt-day14-q2', 'dmkt-day14-q3', 'dmkt-day14-q4', 'dmkt-day14-q5']
      },
      {
        name: 'Ad Budgeting, Bidding & Creatives',
        concepts: ['Budgeting & Bidding Strategies (CPC, CPM, CPA)', 'Ad Creative Design & Testing', 'Ad Copy Variations'],
        learningObjectives: [
          'Calculate target CPA and optimize bidding strategies'
        ],
        quests: ['dmkt-day15-q1', 'dmkt-day15-q2', 'dmkt-day15-q3', 'dmkt-day15-q4', 'dmkt-day15-q5']
      },
      {
        name: 'Conversion Tracking & Retargeting',
        concepts: ['Conversion Pixels & API Tracking', 'Remarketing / Retargeting Lists', 'Attribution Modeling Basics'],
        learningObjectives: [
          'Set up conversion tracking and retargeting campaigns'
        ],
        quests: ['dmkt-day16-q1', 'dmkt-day16-q2', 'dmkt-day16-q3', 'dmkt-day16-q4', 'dmkt-day16-q5']
      }
    ]
  },
  {
    id: 'dmkt-mod-5',
    title: 'Module 5 — Email Marketing & Customer Automation',
    dayRange: 'Days 17–20',
    goal: 'Build email subscriber lists, lead magnets, automated email funnels, CRM workflows, and customer retention systems.',
    topics: [
      {
        name: 'Email Marketing & Subscriber List Building',
        concepts: ['Email Marketing Best Practices', 'Lead Magnets & Opt-in Forms', 'List Health & Deliverability'],
        learningObjectives: [
          'Design high-converting lead magnets and maintain email deliverability'
        ],
        quests: ['dmkt-day17-q1', 'dmkt-day17-q2', 'dmkt-day17-q3', 'dmkt-day17-q4', 'dmkt-day17-q5']
      },
      {
        name: 'Automated Email Funnels & Drip Campaigns',
        concepts: ['Welcome Sequences', 'Nurture Drip Campaigns', 'Abandoned Cart Workflows'],
        learningObjectives: [
          'Construct automated email drip sequences based on subscriber actions'
        ],
        quests: ['dmkt-day18-q1', 'dmkt-day18-q2', 'dmkt-day18-q3', 'dmkt-day18-q4', 'dmkt-day18-q5']
      },
      {
        name: 'Customer Segmentation & CRM Basics',
        concepts: ['Subscriber Behavior Segmentation', 'CRM Lead Scoring', 'Lifecycle Stage Tagging'],
        learningObjectives: [
          'Segment subscribers for personalized marketing campaigns'
        ],
        quests: ['dmkt-day19-q1', 'dmkt-day19-q2', 'dmkt-day19-q3', 'dmkt-day19-q4', 'dmkt-day19-q5']
      },
      {
        name: 'Customer Retention & Re-engagement',
        concepts: ['Re-engagement Campaigns', 'Customer Churn Reduction', 'Loyalty Programs'],
        learningObjectives: [
          'Design win-back campaigns to re-engage inactive subscribers'
        ],
        quests: ['dmkt-day20-q1', 'dmkt-day20-q2', 'dmkt-day20-q3', 'dmkt-day20-q4', 'dmkt-day20-q5']
      }
    ]
  },
  {
    id: 'dmkt-mod-6',
    title: 'Module 6 — Analytics & Conversion Optimization',
    dayRange: 'Days 21–24',
    goal: 'Analyze web traffic metrics, execute landing page A/B tests, measure bounce rates, and optimize conversion funnels.',
    topics: [
      {
        name: 'Marketing Analytics & Traffic Sources',
        concepts: ['Google Analytics Concepts', 'Acquisition Channels (Organic, Paid, Direct, Referral)', 'Session & User Metrics'],
        learningObjectives: [
          'Analyze traffic sources and user behavior metrics'
        ],
        quests: ['dmkt-day21-q1', 'dmkt-day21-q2', 'dmkt-day21-q3', 'dmkt-day21-q4', 'dmkt-day21-q5']
      },
      {
        name: 'Conversion Rate & Bounce Rate Analysis',
        concepts: ['Conversion Rate Optimization (CRO)', 'Bounce Rate & Exit Rate Analysis', 'Funnel Drop-Off Points'],
        learningObjectives: [
          'Identify conversion bottlenecks in user journeys'
        ],
        quests: ['dmkt-day22-q1', 'dmkt-day22-q2', 'dmkt-day22-q3', 'dmkt-day22-q4', 'dmkt-day22-q5']
      },
      {
        name: 'Landing Page Design & A/B Testing',
        concepts: ['High-Converting Landing Page Elements', 'A/B Split Testing Methodology', 'Heatmaps & Click Tracking'],
        learningObjectives: [
          'Design and evaluate landing page A/B tests'
        ],
        quests: ['dmkt-day23-q1', 'dmkt-day23-q2', 'dmkt-day23-q3', 'dmkt-day23-q4', 'dmkt-day23-q5']
      },
      {
        name: 'Customer Insights & Campaign ROI',
        concepts: ['Multi-Touch Attribution', 'ROAS (Return on Ad Spend)', 'Campaign Performance Reporting'],
        learningObjectives: [
          'Calculate ROAS and present performance reports to stakeholders'
        ],
        quests: ['dmkt-day24-q1', 'dmkt-day24-q2', 'dmkt-day24-q3', 'dmkt-day24-q4', 'dmkt-day24-q5']
      }
    ]
  },
  {
    id: 'dmkt-mod-7',
    title: 'Module 7 — Growth Strategy & Business Scaling',
    dayRange: 'Days 25–27',
    goal: 'Implement growth hacking methodologies, customer acquisition/retention engines, referral loops, and viral coefficient calculations.',
    topics: [
      {
        name: 'Growth Marketing & Acquisition Engines',
        concepts: ['Growth Hacking Principles', 'AARRR Funnel (Acquisition, Activation, Retention, Revenue, Referral)', 'Rapid Experimentation'],
        learningObjectives: [
          'Apply the AARRR funnel framework to scale businesses'
        ],
        quests: ['dmkt-day25-q1', 'dmkt-day25-q2', 'dmkt-day25-q3', 'dmkt-day25-q4', 'dmkt-day25-q5']
      },
      {
        name: 'Referral Marketing & Viral Loops',
        concepts: ['Viral Coefficient (K-Factor) Calculation', 'Referral Loop Mechanics', 'Incentive Program Design'],
        learningObjectives: [
          'Calculate viral K-factor and build user referral loops'
        ],
        quests: ['dmkt-day26-q1', 'dmkt-day26-q2', 'dmkt-day26-q3', 'dmkt-day26-q4', 'dmkt-day26-q5']
      },
      {
        name: 'Growth Strategy Planning & Scaling',
        concepts: ['Growth Experiment Prioritization (ICE Score)', 'North Star Metric Selection', 'Scaling Channels'],
        learningObjectives: [
          'Prioritize growth experiments using ICE scoring'
        ],
        quests: ['dmkt-day27-q1', 'dmkt-day27-q2', 'dmkt-day27-q3', 'dmkt-day27-q4', 'dmkt-day27-q5']
      }
    ]
  },
  {
    id: 'dmkt-mod-8',
    title: 'Module 8 — AI & Future of Digital Marketing',
    dayRange: 'Days 28–29',
    goal: 'Integrate AI tools for content generation, automated copywriting, predictive customer analytics, chatbots, and hyper-personalization.',
    topics: [
      {
        name: 'AI Content & Copywriting Tools',
        concepts: ['AI Prompting for Copywriting', 'AI Image & Video Generation', 'Responsible AI Use'],
        learningObjectives: [
          'Utilize AI generators to accelerate content production'
        ],
        quests: ['dmkt-day28-q1', 'dmkt-day28-q2', 'dmkt-day28-q3', 'dmkt-day28-q4', 'dmkt-day28-q5']
      },
      {
        name: 'AI Marketing Automation & Personalization',
        concepts: ['Chatbots & Conversational Marketing', 'Predictive Customer Churn AI', 'Hyper-Personalization at Scale'],
        learningObjectives: [
          'Design AI-driven personalizations across email and website channels'
        ],
        quests: ['dmkt-day29-q1', 'dmkt-day29-q2', 'dmkt-day29-q3', 'dmkt-day29-q4', 'dmkt-day29-q5']
      }
    ]
  },
  {
    id: 'dmkt-mod-9',
    title: 'Day 30 — Integrated Digital Growth Strategy Capstone',
    dayRange: 'Day 30',
    goal: 'Synthesize audience analysis, SEO, content calendar, paid ad strategy, email workflows, CRO analytics, growth funnels, and AI automation into a complete plan.',
    topics: [
      {
        name: 'Integrated Growth Strategy & Capstone Assessment',
        concepts: ['Digital Growth Architecture', 'Comprehensive Strategy Deck', 'Certified Digital Growth Specialist Assessment'],
        learningObjectives: [
          'Build an end-to-end digital growth strategy deck for a scaling business'
        ],
        quests: ['dmkt-day30-q1', 'dmkt-day30-q2', 'dmkt-day30-q3', 'dmkt-day30-q4', 'dmkt-day30-q5']
      }
    ]
  }
];
