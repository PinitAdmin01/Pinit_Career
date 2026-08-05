export interface SalesCrmKnowledgeModule {
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

export const BCOM_SALES_CRM_KNOWLEDGE_GRAPH: SalesCrmKnowledgeModule[] = [
  {
    id: 'scrm-mod-1',
    title: 'Module 1 — Foundations of Sales & Customer Success',
    dayRange: 'Days 1–4',
    goal: 'Help students understand that sales is about solving customer problems and building trust, not simply selling products.',
    topics: [
      {
        name: 'Introduction to Sales & Customer Understanding',
        concepts: ['What is Sales?', 'Why Sales Matters', 'Sales vs Marketing', 'Value Creation in Sales', 'Customer Needs & Expectations', 'Buying Behaviour'],
        learningObjectives: [
          'Differentiate modern problem-solving sales from traditional product pushing',
          'Analyze customer buying behavior and decision-making criteria'
        ],
        quests: ['scrm-day1-q1', 'scrm-day1-q2', 'scrm-day1-q3']
      },
      {
        name: 'Types of Sales & The Customer Journey',
        concepts: ['Types of Sales (B2B, B2C, Retail, Enterprise, Consultative)', 'Sales Process Overview (Prospecting, Qualification, Presentation, Negotiation, Closing, Follow-up)', 'Introduction to Customer Success (CSAT, Retention, CLV)'],
        learningObjectives: [
          'Compare B2B, B2C, and Consultative sales models',
          'Map customer success metrics (CSAT, Retention, CLV) across the customer lifecycle'
        ],
        quests: ['scrm-day2-q1', 'scrm-day2-q2', 'scrm-day2-q3']
      },
      {
        name: 'Customer Communication & Professional Behavior',
        concepts: ['Customer Communication Standards', 'Professional Business Conduct', 'Active Listening in Business'],
        learningObjectives: [
          'Apply professional communication standards across customer touchpoints'
        ],
        quests: ['scrm-day3-q1', 'scrm-day3-q2', 'scrm-day3-q3', 'scrm-day3-q4', 'scrm-day3-q5']
      },
      {
        name: 'Sales Ethics, Trust Building & Relationship Selling',
        concepts: ['Sales Ethics & Honest Disclosure', 'Trust Building Strategies', 'Relationship Selling Principles'],
        learningObjectives: [
          'Identify ethical sales practices and build long-term customer trust'
        ],
        quests: ['scrm-day4-q1', 'scrm-day4-q2', 'scrm-day4-q3', 'scrm-day4-q4', 'scrm-day4-q5']
      }
    ]
  },
  {
    id: 'scrm-mod-2',
    title: 'Module 2 — Sales Process & Lead Management',
    dayRange: 'Days 5–8',
    goal: 'Master lead generation, prospect qualification (BANT framework), sales pipeline management, and closing techniques.',
    topics: [
      {
        name: 'Lead Generation & Prospect Identification',
        concepts: ['Inbound vs Outbound Prospecting', 'Lead Generation Tactics', 'Prospect Profiling'],
        learningObjectives: [
          'Generate and profile high-intent sales prospects'
        ],
        quests: ['scrm-day5-q1', 'scrm-day5-q2', 'scrm-day5-q3', 'scrm-day5-q4', 'scrm-day5-q5']
      },
      {
        name: 'Lead Qualification (BANT Framework)',
        concepts: ['BANT Qualification (Budget, Authority, Need, Timeline)', 'Sales Funnel Stages', 'Lead Scoring Basics'],
        learningObjectives: [
          'Qualify prospects using the BANT framework'
        ],
        quests: ['scrm-day6-q1', 'scrm-day6-q2', 'scrm-day6-q3', 'scrm-day6-q4', 'scrm-day6-q5']
      },
      {
        name: 'Sales Discovery & Product Demonstrations',
        concepts: ['Discovery Calls & Pain Point Diagnosis', 'Effective Product Demos', 'Value Proposition Alignment'],
        learningObjectives: [
          'Conduct structured discovery calls and tailored product demonstrations'
        ],
        quests: ['scrm-day7-q1', 'scrm-day7-q2', 'scrm-day7-q3', 'scrm-day7-q4', 'scrm-day7-q5']
      },
      {
        name: 'Pipeline Management & Closing Techniques',
        concepts: ['Sales Pipeline Velocity', 'Closing Techniques (Assumptive, Summary, Urgent)', 'Sales Documentation & Proposals'],
        learningObjectives: [
          'Manage sales pipeline stages and apply appropriate closing techniques'
        ],
        quests: ['scrm-day8-q1', 'scrm-day8-q2', 'scrm-day8-q3', 'scrm-day8-q4', 'scrm-day8-q5']
      }
    ]
  },
  {
    id: 'scrm-mod-3',
    title: 'Module 3 — Communication, Negotiation & Objection Handling',
    dayRange: 'Days 9–12',
    goal: 'Develop active listening, win-win negotiation tactics, objection handling frameworks (LAER), and professional follow-ups.',
    topics: [
      {
        name: 'Active Listening & Business Presentation',
        concepts: ['Active Listening Mechanics', 'Persuasive Business Presentations', 'Storytelling in Sales'],
        learningObjectives: [
          'Deliver compelling sales presentations using active listening insights'
        ],
        quests: ['scrm-day9-q1', 'scrm-day9-q2', 'scrm-day9-q3', 'scrm-day9-q4', 'scrm-day9-q5']
      },
      {
        name: 'Principled Sales Negotiation',
        concepts: ['Win-Win Negotiation Frameworks', 'BATNA (Best Alternative to a Negotiated Agreement)', 'Concession Management'],
        learningObjectives: [
          'Negotiate contract terms and prices while protecting gross margins'
        ],
        quests: ['scrm-day10-q1', 'scrm-day10-q2', 'scrm-day10-q3', 'scrm-day10-q4', 'scrm-day10-q5']
      },
      {
        name: 'Objection Handling (LAER Framework)',
        concepts: ['LAER Framework (Listen, Acknowledge, Explore, Respond)', 'Common Objections (Price, Trust, Timing, Need)', 'Reframing Value'],
        learningObjectives: [
          'Overcome price and timing objections systematically using LAER'
        ],
        quests: ['scrm-day11-q1', 'scrm-day11-q2', 'scrm-day11-q3', 'scrm-day11-q4', 'scrm-day11-q5']
      },
      {
        name: 'Professional Sales Email & Cadence',
        concepts: ['Cold & Warm Email Writing', 'Follow-up Cadences', 'Conflict Resolution in Accounts'],
        learningObjectives: [
          'Draft high-converting sales emails and structured follow-up cadences'
        ],
        quests: ['scrm-day12-q1', 'scrm-day12-q2', 'scrm-day12-q3', 'scrm-day12-q4', 'scrm-day12-q5']
      }
    ]
  },
  {
    id: 'scrm-mod-4',
    title: 'Module 4 — Customer Success & Relationship Management',
    dayRange: 'Days 13–16',
    goal: 'Build customer onboarding workflows, customer health scores, retention tactics, and customer advocacy programs.',
    topics: [
      {
        name: 'Customer Onboarding & Education',
        concepts: ['Frictionless Customer Onboarding', 'Customer Education & Enablement', 'Time-to-Value (TTV) Acceleration'],
        learningObjectives: [
          'Design onboarding roadmaps to minimize initial customer friction'
        ],
        quests: ['scrm-day13-q1', 'scrm-day13-q2', 'scrm-day13-q3', 'scrm-day13-q4', 'scrm-day13-q5']
      },
      {
        name: 'Customer Health Scores & Engagement',
        concepts: ['Customer Health Score Metrics', 'Proactive Customer Engagement', 'Churn Risk Detection'],
        learningObjectives: [
          'Calculate customer health scores to detect churn risk early'
        ],
        quests: ['scrm-day14-q1', 'scrm-day14-q2', 'scrm-day14-q3', 'scrm-day14-q4', 'scrm-day14-q5']
      },
      {
        name: 'Support & Escalation Management',
        concepts: ['Support Ticket SLA Management', 'Complaint Resolution Workflows', 'Customer Feedback Loops (NPS/CSAT)'],
        learningObjectives: [
          'Manage escalation workflows and resolve customer grievances'
        ],
        quests: ['scrm-day15-q1', 'scrm-day15-q2', 'scrm-day15-q3', 'scrm-day15-q4', 'scrm-day15-q5']
      },
      {
        name: 'Customer Retention & Advocacy',
        concepts: ['Customer Retention Workflows', 'Customer Advocacy Programs', 'Case Study & Testimonial Capture'],
        learningObjectives: [
          'Build customer retention workflows and leverage satisfied clients for referrals'
        ],
        quests: ['scrm-day16-q1', 'scrm-day16-q2', 'scrm-day16-q3', 'scrm-day16-q4', 'scrm-day16-q5']
      }
    ]
  },
  {
    id: 'scrm-mod-5',
    title: 'Module 5 — CRM Fundamentals',
    dayRange: 'Days 17–20',
    goal: 'Master CRM database architecture: Contacts, Companies, Deals/Opportunities, Lead Activity Tracking, and Pipeline Reporting.',
    topics: [
      {
        name: 'CRM Concepts & Database Architecture',
        concepts: ['What is CRM?', 'CRM Lifecycle', 'Contact & Account Hierarchy'],
        learningObjectives: [
          'Understand CRM database structures (Contacts, Accounts, Leads, Deals)'
        ],
        quests: ['scrm-day17-q1', 'scrm-day17-q2', 'scrm-day17-q3', 'scrm-day17-q4', 'scrm-day17-q5']
      },
      {
        name: 'Opportunity & Activity Management',
        concepts: ['Opportunity Deal Stages', 'Sales Activity Logging (Calls, Meetings, Emails)', 'Task & Follow-up Scheduling'],
        learningObjectives: [
          'Track deal stage progression and schedule automated follow-up tasks'
        ],
        quests: ['scrm-day18-q1', 'scrm-day18-q2', 'scrm-day18-q3', 'scrm-day18-q4', 'scrm-day18-q5']
      },
      {
        name: 'CRM Reports & Dashboards',
        concepts: ['Sales Pipeline Reports', 'Activity Tracking Dashboards', 'Lead Source Attribution'],
        learningObjectives: [
          'Generate executive CRM dashboards to monitor sales team activity'
        ],
        quests: ['scrm-day19-q1', 'scrm-day19-q2', 'scrm-day19-q3', 'scrm-day19-q4', 'scrm-day19-q5']
      },
      {
        name: 'CRM Best Practices & Data Hygiene',
        concepts: ['CRM Data Cleanliness & Deduplication', 'Field Standardization', 'Adoption Best Practices'],
        learningObjectives: [
          'Maintain CRM data hygiene and prevent duplicate contact records'
        ],
        quests: ['scrm-day20-q1', 'scrm-day20-q2', 'scrm-day20-q3', 'scrm-day20-q4', 'scrm-day20-q5']
      }
    ]
  },
  {
    id: 'scrm-mod-6',
    title: 'Module 6 — Sales Analytics & Business Performance',
    dayRange: 'Days 21–24',
    goal: 'Measure core sales metrics: Win Rate, Conversion Rates, CLV:CAC ratio, Sales Velocity, and Revenue Forecasting.',
    topics: [
      {
        name: 'Sales KPIs & Conversion Rates',
        concepts: ['Lead-to-Opportunity Conversion Rate', 'Opportunity Win Rate', 'Sales Cycle Length'],
        learningObjectives: [
          'Calculate conversion rates and average sales cycle length'
        ],
        quests: ['scrm-day21-q1', 'scrm-day21-q2', 'scrm-day21-q3', 'scrm-day21-q4', 'scrm-day21-q5']
      },
      {
        name: 'Financial Unit Economics (CLV & CAC)',
        concepts: ['Customer Acquisition Cost (CAC)', 'Customer Lifetime Value (CLV)', 'CLV:CAC Ratio Optimization'],
        learningObjectives: [
          'Calculate CAC and CLV to ensure profitable customer acquisition'
        ],
        quests: ['scrm-day22-q1', 'scrm-day22-q2', 'scrm-day22-q3', 'scrm-day22-q4', 'scrm-day22-q5']
      },
      {
        name: 'Sales Forecasting Methods',
        concepts: ['Weighted Pipeline Forecasting', 'Historical Trend Forecasting', 'Quarterly Revenue Target Planning'],
        learningObjectives: [
          'Construct weighted pipeline sales forecasts'
        ],
        quests: ['scrm-day23-q1', 'scrm-day23-q2', 'scrm-day23-q3', 'scrm-day23-q4', 'scrm-day23-q5']
      },
      {
        name: 'Sales Executive Performance Dashboards',
        concepts: ['Quota Attainment Monitoring', 'Sales Velocity Calculation', 'Performance Optimization Audits'],
        learningObjectives: [
          'Build sales velocity dashboards and audit quota attainment'
        ],
        quests: ['scrm-day24-q1', 'scrm-day24-q2', 'scrm-day24-q3', 'scrm-day24-q4', 'scrm-day24-q5']
      }
    ]
  },
  {
    id: 'scrm-mod-7',
    title: 'Module 7 — Account Management & Business Growth',
    dayRange: 'Days 25–27',
    goal: 'Master Key Account Management (KAM), upselling, cross-selling, contract renewals, and long-term partnership growth.',
    topics: [
      {
        name: 'Key Account Management (KAM)',
        concepts: ['Key Account Identification', 'Strategic Account Plans', 'Executive Relationship Building'],
        learningObjectives: [
          'Develop strategic account growth plans for enterprise clients'
        ],
        quests: ['scrm-day25-q1', 'scrm-day25-q2', 'scrm-day25-q3', 'scrm-day25-q4', 'scrm-day25-q5']
      },
      {
        name: 'Upselling, Cross-Selling & Expansion',
        concepts: ['Account Expansion Playbooks', 'Cross-Selling Complementary Products', 'Upselling Premium Tiers'],
        learningObjectives: [
          'Identify expansion opportunities to grow Net Revenue Retention (NRR)'
        ],
        quests: ['scrm-day26-q1', 'scrm-day26-q2', 'scrm-day26-q3', 'scrm-day26-q4', 'scrm-day26-q5']
      },
      {
        name: 'Contract Renewals & Strategic Partnerships',
        concepts: ['Contract Renewal Workflows', 'Mitigating Churn at Renewal', 'Strategic Partnership Alliances'],
        learningObjectives: [
          'Manage multi-year contract renewals and build strategic partner channels'
        ],
        quests: ['scrm-day27-q1', 'scrm-day27-q2', 'scrm-day27-q3', 'scrm-day27-q4', 'scrm-day27-q5']
      }
    ]
  },
  {
    id: 'scrm-mod-8',
    title: 'Module 8 — AI & Future of Sales',
    dayRange: 'Days 28–29',
    goal: 'Utilize AI tools for predictive lead scoring, sales email automation, AI support chatbots, and CRM intelligence.',
    topics: [
      {
        name: 'AI Lead Scoring & Sales Automation',
        concepts: ['Predictive AI Lead Scoring', 'AI Sales Outreach Generation', 'CRM Workflow Automation'],
        learningObjectives: [
          'Implement AI lead scoring and automated sales email drafting'
        ],
        quests: ['scrm-day28-q1', 'scrm-day28-q2', 'scrm-day28-q3', 'scrm-day28-q4', 'scrm-day28-q5']
      },
      {
        name: 'AI Customer Support & Future Trends',
        concepts: ['AI Support Agents & Chatbots', 'Predictive Sales Forecasting', 'Future of Customer Relationship Management'],
        learningObjectives: [
          'Deploy AI support bots while preserving high-touch human relationship channels'
        ],
        quests: ['scrm-day29-q1', 'scrm-day29-q2', 'scrm-day29-q3', 'scrm-day29-q4', 'scrm-day29-q5']
      }
    ]
  },
  {
    id: 'scrm-mod-9',
    title: 'Day 30 — Integrated Sales & Customer Success Strategy Capstone',
    dayRange: 'Day 30',
    goal: 'Synthesize buyer personas, lead generation, sales pipeline, negotiation, CRM workflows, onboarding, retention, KPIs, and AI tools into a master customer management strategy.',
    topics: [
      {
        name: 'Integrated Customer Strategy & Capstone Assessment',
        concepts: ['End-to-End Customer Strategy', 'Sales & CS Playbook Assembly', 'Certified Sales & CRM Specialist Assessment'],
        learningObjectives: [
          'Develop an integrated sales, CRM, and customer success playbook for a enterprise or B2B/B2C business'
        ],
        quests: ['scrm-day30-q1', 'scrm-day30-q2', 'scrm-day30-q3', 'scrm-day30-q4', 'scrm-day30-q5']
      }
    ]
  }
];
