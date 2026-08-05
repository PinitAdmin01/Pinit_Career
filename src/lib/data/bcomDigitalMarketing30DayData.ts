import { CourseQuest } from './coursesData';

// Helper function to generate all 146 Digital Marketing & Growth Strategy Quests
function generate146DigitalMarketingQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'dmkt-day1-q1',
    title: 'Day 1 - Quest 1: Introduction to Digital Marketing',
    desc: 'Understand what Digital Marketing is, the evolution from traditional channels, and why modern businesses rely on digital channels for customer acquisition.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What is Digital Marketing?', 'Evolution of Marketing', 'Traditional vs Digital Marketing', 'Why Businesses Need Digital Marketing'],
    hint: 'Digital marketing enables precise targeting, real-time analytics, and measurable ROI unlike traditional print/TV.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'dmkt-day1-q2',
    title: 'Day 1 - Quest 2: The Digital Marketing Ecosystem',
    desc: 'Explore the interconnected digital touchpoints: Websites, Search Engines, Social Media, Email, Mobile Apps, and Online Marketplaces.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Websites', 'Search Engines', 'Social Media', 'Email', 'Mobile', 'Online Marketplaces'],
    hint: 'Websites act as the central hub of your digital ecosystem, while channels drive traffic to it.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'dmkt-day1-q3',
    title: 'Day 1 - Quest 3: The Customer Digital Journey',
    desc: 'Map the multi-stage digital journey: Awareness -> Interest -> Consideration -> Purchase -> Retention -> Advocacy.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Awareness', 'Interest', 'Consideration', 'Purchase', 'Retention', 'Advocacy'],
    hint: 'Different digital content formats suit different stages of the consumer decision journey.',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'dmkt-day2-q1',
    title: 'Day 2 - Quest 1: Marketing Funnel Fundamentals',
    desc: 'Deconstruct the marketing funnel architecture: Top of Funnel (TOFU), Middle of Funnel (MOFU), Bottom of Funnel (BOFU), and Customer Lifecycle Management.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['TOFU (Top of Funnel)', 'MOFU (Middle of Funnel)', 'BOFU (Bottom of Funnel)', 'Customer Lifecycle'],
    hint: 'TOFU builds awareness, MOFU educates and builds trust, and BOFU drives final conversion.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'dmkt-day2-q2',
    title: 'Day 2 - Quest 2: Digital Marketing Channels',
    desc: 'Master the POEM media framework: Paid Media, Owned Media, Earned Media, and Organic Search.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Organic Media', 'Paid Media', 'Owned Media', 'Earned Media'],
    hint: 'Owned media includes your blog/site; paid media accelerates reach; earned media provides social proof.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'dmkt-day2-q3',
    title: 'Day 2 - Quest 3: Digital Marketing Metrics',
    desc: 'Understand foundational performance metrics: Impressions, Reach, Clicks, Click-Through Rate (CTR), Engagement, and Conversions.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Impressions & Reach', 'Clicks & CTR', 'Engagement Rate', 'Conversions'],
    hint: 'CTR = (Clicks / Impressions) * 100; higher CTR indicates compelling ad copy or offer alignment.',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - Digital Planning & Personas', topics: ['Digital Marketing Planning', 'Business Goals vs Marketing Goals', 'Target Audience & Buyer Personas'] },
    4: { moduleName: 'Module 1 - Content Basics & Ethics', topics: ['Content Marketing Basics', 'Digital Consumer Behaviour', 'Marketing Ethics & Privacy'] },
    5: { moduleName: 'Module 2 - Website UX & Search Engines', topics: ['Website Fundamentals & UX', 'Search Engine Crawling & Indexing', 'Search Intent Analysis'] },
    6: { moduleName: 'Module 2 - Keyword Research & On-Page SEO', topics: ['Keyword Research Strategies', 'On-Page SEO Optimization', 'Meta Tags & Content Formatting'] },
    7: { moduleName: 'Module 2 - Technical SEO & Audits', topics: ['Technical SEO & Core Web Vitals', 'XML Sitemaps & Indexing', 'SEO Site Audits'] },
    8: { moduleName: 'Module 2 - Off-Page & Local SEO', topics: ['Off-Page SEO & Backlinks', 'Domain Authority & Link Building', 'Google Business Profile & Local SEO'] },
    9: { moduleName: 'Module 3 - Content Strategy & Blogging', topics: ['Content Strategy & Pillars', 'Blogging & Editorial Planning', 'Content Distribution Channels'] },
    10: { moduleName: 'Module 3 - Copywriting & Storytelling', topics: ['Persuasive Copywriting Formulas', 'Brand Storytelling Techniques', 'Headlines & CTA Writing'] },
    11: { moduleName: 'Module 3 - Social Media Strategy', topics: ['Social Media Platform Strategies', 'Community Building', 'Social Media Editorial Calendars'] },
    12: { moduleName: 'Module 3 - Video & Influencers', topics: ['Short-Form Video Marketing', 'Influencer Campaign Strategy', 'Social Video Analytics'] },
    13: { moduleName: 'Module 4 - PPC & Search Ads', topics: ['Pay-Per-Click (PPC) Advertising', 'Google Search Ads Concepts', 'Quality Score & Ad Auctions'] },
    14: { moduleName: 'Module 4 - Meta Ads & Social Media Ads', topics: ['Meta Ads & Social Advertising', 'Audience Targeting & Lookalikes', 'Ad Placement Selection'] },
    15: { moduleName: 'Module 4 - Ad Budgeting & Creatives', topics: ['Ad Budgeting & Bidding Strategies', 'Ad Creative Testing', 'Ad Copy Variations'] },
    16: { moduleName: 'Module 4 - Conversion Tracking & Pixel', topics: ['Conversion Pixel Tracking', 'Remarketing & Retargeting Lists', 'Attribution Modeling Basics'] },
    17: { moduleName: 'Module 5 - Email List Building', topics: ['Email Marketing Best Practices', 'Lead Magnets & Opt-in Forms', 'Subscriber List Hygiene'] },
    18: { moduleName: 'Module 5 - Automated Email Funnels', topics: ['Automated Email Drip Sequences', 'Welcome & Onboarding Workflows', 'Abandoned Cart Automation'] },
    19: { moduleName: 'Module 5 - CRM & Subscriber Segmentation', topics: ['Subscriber Behavior Segmentation', 'CRM Lead Scoring', 'Lifecycle Stage Tagging'] },
    20: { moduleName: 'Module 5 - Retention & Re-engagement', topics: ['Customer Retention Strategies', 'Re-engagement Email Campaigns', 'Customer Loyalty Loops'] },
    21: { moduleName: 'Module 6 - Web Analytics & Traffic', topics: ['Google Analytics Concepts', 'Traffic Acquisition Channels', 'User Behavior Metrics'] },
    22: { moduleName: 'Module 6 - Conversion Rate Optimization', topics: ['Conversion Rate Optimization (CRO)', 'Bounce Rate & Exit Rate Analysis', 'Funnel Drop-Off Mitigation'] },
    23: { moduleName: 'Module 6 - Landing Pages & A/B Testing', topics: ['High-Converting Landing Page Design', 'A/B Split Testing Methods', 'Heatmaps & Click Tracking'] },
    24: { moduleName: 'Module 6 - ROI & Attribution', topics: ['ROAS & ROI Analysis', 'Multi-Touch Attribution Models', 'Executive Campaign Reporting'] },
    25: { moduleName: 'Module 7 - Growth Hacking & Funnels', topics: ['Growth Marketing Fundamentals', 'AARRR Funnel Architecture', 'Rapid Growth Experimentation'] },
    26: { moduleName: 'Module 7 - Referral Loops & Viral Growth', topics: ['Referral Marketing Systems', 'Viral Coefficient (K-Factor)', 'Incentivized Growth Loops'] },
    27: { moduleName: 'Module 7 - Growth Experiments & Scaling', topics: ['Growth Experimentation (ICE Score)', 'North Star Metric Selection', 'Scaling Acquisition Channels'] },
    28: { moduleName: 'Module 8 - AI Copy & Content Tools', topics: ['AI Copywriting & Prompting', 'AI Image & Video Generators', 'Responsible AI Content Workflows'] },
    29: { moduleName: 'Module 8 - AI Automation & Personalization', topics: ['Chatbots & Conversational AI', 'Predictive Customer Analytics', 'Hyper-Personalization at Scale'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['Digital Marketing', 'Growth Strategy', 'Analytics'] };

    // Teaching 1
    quests.push({
      id: `dmkt-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `Comprehensive lecture on ${info.topics[0]} with practical real-world execution examples.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Strategic Frameworks', 'Channel Best Practices'],
      hint: `Understand how ${info.topics[0]} fits into the overall digital acquisition funnel.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `dmkt-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed breakdown of ${info.topics[1]} and digital campaign implementation.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Technical Setup', 'Optimization Tactics'],
      hint: `Focus on metrics that validate the effectiveness of ${info.topics[1]}.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `dmkt-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and performance scaling.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Performance Metrics', 'Executive Dashboards'],
      hint: `Ensure insights from ${info.topics[2]} drive actionable campaign adjustments.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive digital calculator / SEO auditor / ad campaign planner)
    quests.push({
      id: `dmkt-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Assignment - ${info.topics[0]}`,
      desc: `Execute practical digital marketing tasks: calculate CTR/ROAS, optimize on-page SEO tags, write ad copy, or design email workflows.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function processDigitalAssignmentDay${day}(campaignInput) {\n  // Calculate CTR, ROAS, or keyword optimization\n  return {\n    ctrPct: 4.8,\n    roasRatio: 3.2,\n    seoScore: 92,\n    campaignApproved: true\n  };\n}`,
      testSuite: `if (typeof processDigitalAssignmentDay${day} !== 'function') throw new Error('Assignment solver missing');`,
      hint: `Formula check: CTR = (Clicks / Impressions) * 100. ROAS = Revenue / Ad Spend.`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical Digital Marketing Exam)
    quests.push({
      id: `dmkt-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily Growth Mastery Exam - ${info.moduleName}`,
      desc: `Evaluates digital strategy, campaign mechanics, and analytical performance under timed exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function validateDigitalExamDay${day}(answers) {\n  // Validate performance choices and calculation accuracy\n  return true;\n}`,
      testSuite: `if (typeof validateDigitalExamDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Review funnel stages, SEO rules, and ad metrics before submitting your answers.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Integrated Digital Growth Strategy Capstone (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'dmkt-day30-q1',
    title: 'Day 30 - Quest 1: Digital Marketing Framework Synthesis',
    desc: 'Synthesize the overarching digital marketing framework: Audience Insights -> Channel Selection -> Content Strategy -> Campaign Execution.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Digital Architecture Synthesis', 'Multi-Channel Integration', 'Cohesive Strategy Alignment'],
    hint: 'A successful digital strategy connects audience intent directly to high-converting channels.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'dmkt-day30-q2',
    title: 'Day 30 - Quest 2: Growth Funnel Design Synthesis',
    desc: 'Unify Acquisition, Engagement, Conversion, Retention, and Advocacy into a self-reinforcing growth engine.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Full-Funnel Architecture', 'Conversion Optimization Sync', 'Retention & Advocacy Engines'],
    hint: 'Optimizing retention yields higher compounding growth than constantly funding top-of-funnel acquisition.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'dmkt-day30-q3',
    title: 'Day 30 - Quest 3: Modern Marketing Execution & AI Integration',
    desc: 'Align SEO, Content, Paid Ads, Analytics, and AI Automation into a modern digital marketing stack.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Modern Execution Stack', 'AI Automation Workflows', 'Continuous Growth Iteration'],
    hint: 'Leverage AI for rapid content creation and predictive analytics while keeping strategy human-directed.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Master Integrated Digital Growth Strategy Project
  quests.push({
    id: 'dmkt-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Complete Digital Marketing & Growth Strategy Plan',
    desc: 'Develop a complete digital marketing strategy for a business: target audience & buyer persona, marketing funnel architecture, SEO roadmap, 30-day content calendar, social media strategy, paid advertising campaign plan, automated email drip workflow, KPI dashboard, and viral growth plan.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function executeDigitalGrowthStrategyCapstone(businessBrief) {\n  // 1. Define Buyer Personas & Funnel Stages\n  // 2. Build SEO & Content Strategy\n  // 3. Plan Meta/Google Ads & Email Automation\n  // 4. Set ROAS, CAC, and Viral K-Factor Targets\n  return {\n    personaDefined: true,\n    funnelArchitecture: {\n      tofu: "SEO Blog & Educational Reels",\n      mofu: "Lead Magnet Ebook & Email Drip",\n      bofu: "Retargeting Ads & Demo Offer"\n    },\n    paidAdsPlan: {\n      platform: "Google Search + Meta Retargeting",\n      monthlyBudget: 50000,\n      targetROAS: 4.0\n    },\n    growthStrategyComplete: true\n  };\n}`,
    testSuite: `if (typeof executeDigitalGrowthStrategyCapstone !== 'function') throw new Error('Capstone solver missing');\nconst res = executeDigitalGrowthStrategyCapstone({});\nif (!res.growthStrategyComplete || !res.paidAdsPlan) throw new Error('Capstone growth strategy incomplete');`,
    hint: `Ensure all funnel stages (TOFU, MOFU, BOFU) and paid ad ROAS targets are explicitly defined!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional Digital Marketing Certification
  quests.push({
    id: 'dmkt-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - Digital Marketing & Growth Strategy',
    desc: 'Mastery certification assessment covering Digital Marketing Fundamentals, Customer Journeys, SEO, Content Strategy, Social Media Marketing, Paid Advertising, Email Automation, Analytics & CRO, Growth Marketing, and AI in Marketing.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalDigitalCertificationExam(candidateAnswers) {\n  // Validate comprehensive 90-minute digital marketing & growth exam\n  return {\n    scorePct: 98,\n    passed: true,\n    certificationTitle: "Certified Digital Marketing & Growth Strategist"\n  };\n}`,
    testSuite: `if (typeof executeFinalDigitalCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalRes = executeFinalDigitalCertificationExam({});\nif (!evalRes.passed) throw new Error('Certification evaluation failed');`,
    hint: `Review all 8 modules before initiating the final comprehensive certification assessment.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_DIGITAL_MARKETING_30_DAYS_QUESTS: CourseQuest[] = generate146DigitalMarketingQuests();
