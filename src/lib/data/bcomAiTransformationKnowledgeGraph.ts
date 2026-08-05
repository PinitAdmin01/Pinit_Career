export interface AiTransformationKnowledgeModule {
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

export const BCOM_AI_TRANSFORMATION_KNOWLEDGE_GRAPH: AiTransformationKnowledgeModule[] = [
  {
    id: 'ait-mod-1',
    title: 'Module 1 — Foundations of AI & Digital Transformation',
    dayRange: 'Days 1–4',
    goal: 'Help students understand what AI is, why businesses are adopting it, and how digital transformation changes organizations.',
    topics: [
      {
        name: 'Introduction to Artificial Intelligence & Digital Transformation',
        concepts: ['What is AI?', 'Evolution of AI', 'Myths vs Reality', 'What is Digital Transformation?', 'Traditional vs Digital Business', 'Business Value Creation'],
        learningObjectives: [
          'Differentiate real business AI applications from marketing hype',
          'Understand how digital transformation reshapes business value delivery'
        ],
        quests: ['ait-day1-q1', 'ait-day1-q2', 'ait-day1-q3']
      },
      {
        name: 'Types of AI, Technologies & Business Opportunities',
        concepts: ['Rule-Based Systems vs Machine Learning vs Generative AI', 'Cloud, Big Data, IoT & APIs', 'AI Opportunities & Limitations', 'Human + AI Collaboration'],
        learningObjectives: [
          'Classify AI technologies (Rule-based, ML, GenAI) and their enterprise limits',
          'Design Human-in-the-Loop AI collaboration models'
        ],
        quests: ['ait-day2-q1', 'ait-day2-q2', 'ait-day2-q3']
      },
      {
        name: 'History of Transformation, Innovation & Industry 4.0',
        concepts: ['History of Industrial Revolutions', 'Industry 4.0 Technologies', 'Business Innovation Strategies'],
        learningObjectives: [
          'Identify Industry 4.0 transformation opportunities in traditional businesses'
        ],
        quests: ['ait-day3-q1', 'ait-day3-q2', 'ait-day3-q3', 'ait-day3-q4', 'ait-day3-q5']
      },
      {
        name: 'AI Ethics, Privacy, Bias & Security',
        concepts: ['AI Ethics Principles', 'Responsible AI Deployment', 'Data Privacy, Algorithmic Bias & Cybersecurity Risks'],
        learningObjectives: [
          'Evaluate ethical AI risks, bias, and privacy regulations in enterprise AI'
        ],
        quests: ['ait-day4-q1', 'ait-day4-q2', 'ait-day4-q3', 'ait-day4-q4', 'ait-day4-q5']
      }
    ]
  },
  {
    id: 'ait-mod-2',
    title: 'Module 2 — AI Productivity & Business Workflows',
    dayRange: 'Days 5–8',
    goal: 'Master prompt engineering fundamentals, AI business research, AI document writing/summarization, spreadsheet assistance, and automated workflows.',
    topics: [
      {
        name: 'Prompt Engineering & AI Productivity Basics',
        concepts: ['Prompt Engineering Principles (Context, Task, Persona, Format)', 'AI Research & Fact-Checking', 'AI Business Writing'],
        learningObjectives: [
          'Craft structured prompts for accurate executive research and document generation'
        ],
        quests: ['ait-day5-q1', 'ait-day5-q2', 'ait-day5-q3', 'ait-day5-q4', 'ait-day5-q5']
      },
      {
        name: 'AI Summarization & Presentation Creation',
        concepts: ['AI Executive Summarization', 'AI Deck & Presentation Builders', 'Visualizing AI Data'],
        learningObjectives: [
          'Summarize lengthy business reports and generate presentation slides using AI'
        ],
        quests: ['ait-day6-q1', 'ait-day6-q2', 'ait-day6-q3', 'ait-day6-q4', 'ait-day6-q5']
      },
      {
        name: 'AI Spreadsheet Assistance & Formula Generation',
        concepts: ['AI Formula Generation (Excel/Sheets)', 'Data Cleaning with AI', 'Automated Spreadsheet Insights'],
        learningObjectives: [
          'Use AI assistants to construct complex formulas and clean messy business datasets'
        ],
        quests: ['ait-day7-q1', 'ait-day7-q2', 'ait-day7-q3', 'ait-day7-q4', 'ait-day7-q5']
      },
      {
        name: 'AI Workflow Automation & Collaboration',
        concepts: ['AI Documentation', 'Personalized AI Assistants', 'Human-AI Collaboration Workflows'],
        learningObjectives: [
          'Design personal AI assistant workflows to augment daily business output'
        ],
        quests: ['ait-day8-q1', 'ait-day8-q2', 'ait-day8-q3', 'ait-day8-q4', 'ait-day8-q5']
      }
    ]
  },
  {
    id: 'ait-mod-3',
    title: 'Module 3 — AI Across Business Functions',
    dayRange: 'Days 9–12',
    goal: 'Examine functional AI applications across Finance, Marketing, Sales, HR, Operations, Customer Support, Analytics, and Entrepreneurship.',
    topics: [
      {
        name: 'AI in Finance, Marketing & Sales',
        concepts: ['AI Financial Fraud Detection & Forecasting', 'AI Marketing Personalization & Ad Copy', 'AI Sales Lead Scoring & Outreach'],
        learningObjectives: [
          'Select AI tools for financial forecasting, marketing, and sales pipelines'
        ],
        quests: ['ait-day9-q1', 'ait-day9-q2', 'ait-day9-q3', 'ait-day9-q4', 'ait-day9-q5']
      },
      {
        name: 'AI in HR, Operations & Customer Support',
        concepts: ['AI Recruitment & Talent Screening', 'AI Operations Optimization', 'AI Customer Support Chatbots'],
        learningObjectives: [
          'Evaluate AI solutions for HR talent acquisition and customer support'
        ],
        quests: ['ait-day10-q1', 'ait-day10-q2', 'ait-day10-q3', 'ait-day10-q4', 'ait-day10-q5']
      },
      {
        name: 'AI in Supply Chain, Analytics & Entrepreneurship',
        concepts: ['AI Supply Chain Demand Sensing', 'AI Business Analytics & Insights', 'AI Tools for Startup Founders'],
        learningObjectives: [
          'Formulate departmental AI recommendation roadmaps for enterprise teams'
        ],
        quests: ['ait-day11-q1', 'ait-day11-q2', 'ait-day11-q3', 'ait-day11-q4', 'ait-day11-q5']
      },
      {
        name: 'Cross-Functional AI Strategy Alignment',
        concepts: ['Silo Breaking with AI', 'Cross-Functional AI Projects', 'Enterprise AI Value Assessment'],
        learningObjectives: [
          'Align cross-functional AI initiatives to broader business goals'
        ],
        quests: ['ait-day12-q1', 'ait-day12-q2', 'ait-day12-q3', 'ait-day12-q4', 'ait-day12-q5']
      }
    ]
  },
  {
    id: 'ait-mod-4',
    title: 'Module 4 — Business Data & AI Decision Support',
    dayRange: 'Days 13–16',
    goal: 'Understand data quality, business intelligence dashboards, predictive analytics, AI-assisted decision support, and forecasting.',
    topics: [
      {
        name: 'Business Data Fundamentals & Data Quality',
        concepts: ['Data Quality Principles (Accuracy, Completeness, Consistency)', 'Structured vs Unstructured Data', 'Data Preparation for AI'],
        learningObjectives: [
          'Audit data quality and prepare structured/unstructured datasets for AI processing'
        ],
        quests: ['ait-day13-q1', 'ait-day13-q2', 'ait-day13-q3', 'ait-day13-q4', 'ait-day13-q5']
      },
      {
        name: 'Business Intelligence & Dashboards',
        concepts: ['BI Dashboard Design', 'Real-Time KPI Monitoring', 'Data Visualization Best Practices'],
        learningObjectives: [
          'Construct BI dashboards for executive KPI tracking'
        ],
        quests: ['ait-day14-q1', 'ait-day14-q2', 'ait-day14-q3', 'ait-day14-q4', 'ait-day14-q5']
      },
      {
        name: 'Predictive Analytics & AI Insights',
        concepts: ['Predictive Analytics Models', 'AI Insight Generation', 'Trend & Anomaly Detection'],
        learningObjectives: [
          'Utilize predictive AI models for trend detection and business forecasting'
        ],
        quests: ['ait-day15-q1', 'ait-day15-q2', 'ait-day15-q3', 'ait-day15-q4', 'ait-day15-q5']
      },
      {
        name: 'Decision Support Systems (DSS) & Data-Driven Management',
        concepts: ['Decision Support System Architecture', 'AI Scenario Modeling', 'Data-Driven Executive Leadership'],
        learningObjectives: [
          'Leverage AI Decision Support Systems for scenario planning and resource allocation'
        ],
        quests: ['ait-day16-q1', 'ait-day16-q2', 'ait-day16-q3', 'ait-day16-q4', 'ait-day16-q5']
      }
    ]
  },
  {
    id: 'ait-mod-5',
    title: 'Module 5 — Business Process Automation',
    dayRange: 'Days 17–20',
    goal: 'Master process automation, Robotic Process Automation (RPA), AI document processing, intelligent chatbots, and workflow redesign.',
    topics: [
      {
        name: 'Automation Fundamentals & Workflow Redesign',
        concepts: ['Automation Readiness Assessment', 'Manual vs Automated Workflows', 'Business Process Redesign'],
        learningObjectives: [
          'Identify manual process inefficiencies ripe for automation'
        ],
        quests: ['ait-day17-q1', 'ait-day17-q2', 'ait-day17-q3', 'ait-day17-q4', 'ait-day17-q5']
      },
      {
        name: 'Robotic Process Automation (RPA) & AI Automation',
        concepts: ['RPA Software Bots', 'Cognitive AI Automation', 'API Integration Rules'],
        learningObjectives: [
          'Design RPA bot rules for repetitive data entry and system transfers'
        ],
        quests: ['ait-day18-q1', 'ait-day18-q2', 'ait-day18-q3', 'ait-day18-q4', 'ait-day18-q5']
      },
      {
        name: 'Document Processing & Approval Workflows',
        concepts: ['Intelligent Document Processing (IDP/OCR)', 'Automated Approval Matrix Workflows', 'Invoice & Receipt Extraction'],
        learningObjectives: [
          'Implement IDP solutions for automated invoice and document processing'
        ],
        quests: ['ait-day19-q1', 'ait-day19-q2', 'ait-day19-q3', 'ait-day19-q4', 'ait-day19-q5']
      },
      {
        name: 'Chatbots, Customer Automation & Productivity Optimization',
        concepts: ['Conversational AI Agents', 'Self-Service Customer Workflows', 'Productivity Optimization Metrics'],
        learningObjectives: [
          'Deploy conversational chatbots for 24/7 automated customer self-service'
        ],
        quests: ['ait-day20-q1', 'ait-day20-q2', 'ait-day20-q3', 'ait-day20-q4', 'ait-day20-q5']
      }
    ]
  },
  {
    id: 'ait-mod-6',
    title: 'Module 6 — Enterprise AI & Digital Transformation',
    dayRange: 'Days 21–24',
    goal: 'Master Enterprise AI architecture, ERP/CRM AI integration, cloud platforms, change management, digital culture, and innovation execution.',
    topics: [
      {
        name: 'Enterprise AI & Cloud Platforms',
        concepts: ['Enterprise AI Architecture', 'Cloud Infrastructure (AWS/Azure/GCP)', 'ERP & CRM AI Augmentation'],
        learningObjectives: [
          'Evaluate enterprise cloud platforms and ERP/CRM AI integrations'
        ],
        quests: ['ait-day21-q1', 'ait-day21-q2', 'ait-day21-q3', 'ait-day21-q4', 'ait-day21-q5']
      },
      {
        name: 'Digital Transformation Strategy & Roadmapping',
        concepts: ['Digital Transformation Roadmap', 'Technology Stack Selection', 'ROI & Value Realization Frameworks'],
        learningObjectives: [
          'Construct multi-year digital transformation roadmaps with ROI milestones'
        ],
        quests: ['ait-day22-q1', 'ait-day22-q2', 'ait-day22-q3', 'ait-day22-q4', 'ait-day22-q5']
      },
      {
        name: 'Change Management & Employee Adoption',
        concepts: ['Kotters 8-Step Change Framework', 'Overcoming Employee Resistance', 'Upskilling & Reskilling Programs'],
        learningObjectives: [
          'Formulate change management plans to drive employee AI adoption'
        ],
        quests: ['ait-day23-q1', 'ait-day23-q2', 'ait-day23-q3', 'ait-day23-q4', 'ait-day23-q5']
      },
      {
        name: 'Digital Culture & Innovation Management',
        concepts: ['Fostering an Agile Digital Culture', 'Innovation Portfolio Management', 'Continuous Transformation Loops'],
        learningObjectives: [
          'Build an agile organizational culture supporting continuous innovation'
        ],
        quests: ['ait-day24-q1', 'ait-day24-q2', 'ait-day24-q3', 'ait-day24-q4', 'ait-day24-q5']
      }
    ]
  },
  {
    id: 'ait-mod-7',
    title: 'Module 7 — AI Governance, Security & Risk',
    dayRange: 'Days 25–27',
    goal: 'Build AI governance frameworks, data governance policies, cybersecurity defenses, compliance checklists, and business continuity plans.',
    topics: [
      {
        name: 'AI Governance & Data Policies',
        concepts: ['AI Governance Committees', 'Corporate Data Governance Policies', 'AI Model Transparency & Auditability'],
        learningObjectives: [
          'Draft enterprise AI governance guidelines and model auditability standards'
        ],
        quests: ['ait-day25-q1', 'ait-day25-q2', 'ait-day25-q3', 'ait-day25-q4', 'ait-day25-q5']
      },
      {
        name: 'Cybersecurity, Compliance & AI Risks',
        concepts: ['AI System Cybersecurity Vulnerabilities', 'Regulatory Compliance (EU AI Act, Data Protection Laws)', 'Hallucination & IP Infringement Risks'],
        learningObjectives: [
          'Audit AI risks regarding data leaks, model hallucinations, and regulatory compliance'
        ],
        quests: ['ait-day26-q1', 'ait-day26-q2', 'ait-day26-q3', 'ait-day26-q4', 'ait-day26-q5']
      },
      {
        name: 'Responsible Deployment & Business Continuity',
        concepts: ['Responsible AI Deployment Audits', 'Vendor AI Due Diligence', 'AI Disaster Recovery & Continuity'],
        learningObjectives: [
          'Establish business continuity protocols in case of AI platform failure'
        ],
        quests: ['ait-day27-q1', 'ait-day27-q2', 'ait-day27-q3', 'ait-day27-q4', 'ait-day27-q5']
      }
    ]
  },
  {
    id: 'ait-mod-8',
    title: 'Module 8 — Future Business & AI Leadership',
    dayRange: 'Days 28–29',
    goal: 'Explore autonomous AI agents, hyperautomation, digital twins, evolving future skills, and visionary AI leadership.',
    topics: [
      {
        name: 'AI Agents, Hyperautomation & Digital Twins',
        concepts: ['Autonomous AI Agent Frameworks', 'Hyperautomation Systems', 'Digital Twins of Enterprises'],
        learningObjectives: [
          'Evaluate autonomous AI agent workflows and enterprise hyperautomation'
        ],
        quests: ['ait-day28-q1', 'ait-day28-q2', 'ait-day28-q3', 'ait-day28-q4', 'ait-day28-q5']
      },
      {
        name: 'Future Skills, AI Leadership & Evolving Trends',
        concepts: ['Human Skills in the AI Era (Critical Thinking, Empathy)', 'Visionary AI Leadership', 'Future Business Trends'],
        learningObjectives: [
          'Develop executive leadership strategies to guide human-AI teams'
        ],
        quests: ['ait-day29-q1', 'ait-day29-q2', 'ait-day29-q3', 'ait-day29-q4', 'ait-day29-q5']
      }
    ]
  },
  {
    id: 'ait-mod-9',
    title: 'Day 30 — Integrated AI Business Transformation Capstone',
    dayRange: 'Day 30',
    goal: 'Synthesize strategy, people, processes, technology, AI automation, decision intelligence, governance, and leadership into a master proposal.',
    topics: [
      {
        name: 'Integrated AI Transformation Proposal & Capstone Assessment',
        concepts: ['End-to-End AI Transformation Blueprint', 'Boardroom Transformation Pitch', 'Certified AI & Digital Transformation Specialist Assessment'],
        learningObjectives: [
          'Develop an enterprise-wide AI & digital transformation proposal for board approval'
        ],
        quests: ['ait-day30-q1', 'ait-day30-q2', 'ait-day30-q3', 'ait-day30-q4', 'ait-day30-q5']
      }
    ]
  }
];
