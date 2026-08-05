export interface OperationsKnowledgeModule {
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

export const BCOM_OPERATIONS_KNOWLEDGE_GRAPH: OperationsKnowledgeModule[] = [
  {
    id: 'ops-mod-1',
    title: 'Module 1 — Foundations of Business Operations',
    dayRange: 'Days 1–4',
    goal: 'Help students understand how businesses function internally to deliver value.',
    topics: [
      {
        name: 'Introduction to Business Operations & Value Delivery',
        concepts: ['What are Business Operations?', 'Why Operations Matter', 'Value Creation', 'Operational Excellence', 'Inputs, Activities, Outputs & Outcomes'],
        learningObjectives: [
          'Understand how internal operations transform raw inputs into customer value',
          'Analyze business process flows from inputs to final outcomes'
        ],
        quests: ['ops-day1-q1', 'ops-day1-q2', 'ops-day1-q3']
      },
      {
        name: 'Business Functions, Supply Chains & Compliance',
        concepts: ['Interconnected Functions (Operations, Finance, Marketing, HR, IT, Support)', 'Supply Chain Participants (Suppliers, Manufacturers, Distributors, Retailers)', 'Business Resources (5 Ms: People, Materials, Machines, Money, Info)', 'Compliance Fundamentals'],
        learningObjectives: [
          'Map cross-functional relationships across business departments',
          'Differentiate legal compliance from ethical organizational responsibilities'
        ],
        quests: ['ops-day2-q1', 'ops-day2-q2', 'ops-day2-q3']
      },
      {
        name: 'Business Process Mapping & Standardization',
        concepts: ['Process Mapping Techniques', 'Operational Workflows', 'Standardization & SOPs'],
        learningObjectives: [
          'Map operational workflows and write Standard Operating Procedures (SOPs)'
        ],
        quests: ['ops-day3-q1', 'ops-day3-q2', 'ops-day3-q3', 'ops-day3-q4', 'ops-day3-q5']
      },
      {
        name: 'Operational Efficiency & Bottleneck Analysis',
        concepts: ['Operational Efficiency Metrics', 'Productivity Ratios', 'Continuous Improvement (Kaizen)', 'Bottleneck Identification'],
        learningObjectives: [
          'Identify operational bottlenecks and compute labor/machine productivity'
        ],
        quests: ['ops-day4-q1', 'ops-day4-q2', 'ops-day4-q3', 'ops-day4-q4', 'ops-day4-q5']
      }
    ]
  },
  {
    id: 'ops-mod-2',
    title: 'Module 2 — Procurement & Inventory Management',
    dayRange: 'Days 5–8',
    goal: 'Master procurement fundamentals, vendor evaluation, purchase order workflows, inventory control models, and warehouse audits.',
    topics: [
      {
        name: 'Procurement & Vendor Selection',
        concepts: ['Procurement Fundamentals', 'Vendor Evaluation & Selection', 'Purchase Order (PO) Workflows', 'Supplier Relationship Management (SRM)'],
        learningObjectives: [
          'Formulate vendor evaluation scorecards and execute PO workflows'
        ],
        quests: ['ops-day5-q1', 'ops-day5-q2', 'ops-day5-q3', 'ops-day5-q4', 'ops-day5-q5']
      },
      {
        name: 'Inventory Control & Economic Order Quantity (EOQ)',
        concepts: ['Inventory Types (Raw Materials, WIP, Finished Goods)', 'Economic Order Quantity (EOQ)', 'Carrying vs Ordering Costs'],
        learningObjectives: [
          'Calculate EOQ to minimize combined holding and ordering costs'
        ],
        quests: ['ops-day6-q1', 'ops-day6-q2', 'ops-day6-q3', 'ops-day6-q4', 'ops-day6-q5']
      },
      {
        name: 'Reorder Points & Safety Stock',
        concepts: ['Lead Time Variance', 'Safety Stock Calculations', 'Reorder Point (ROP) Formulas'],
        learningObjectives: [
          'Calculate Reorder Points (ROP) considering demand lead time'
        ],
        quests: ['ops-day7-q1', 'ops-day7-q2', 'ops-day7-q3', 'ops-day7-q4', 'ops-day7-q5']
      },
      {
        name: 'Warehouse Operations & Inventory Auditing',
        concepts: ['Warehouse Layout Basics', 'ABC Inventory Analysis', 'Physical Stock Audits & Cycle Counting'],
        learningObjectives: [
          'Perform ABC inventory classification and cycle counting audits'
        ],
        quests: ['ops-day8-q1', 'ops-day8-q2', 'ops-day8-q3', 'ops-day8-q4', 'ops-day8-q5']
      }
    ]
  },
  {
    id: 'ops-mod-3',
    title: 'Module 3 — Supply Chain & Logistics',
    dayRange: 'Days 9–12',
    goal: 'Design supply chain networks, demand forecasting models, transportation systems, warehousing hubs, and last-mile delivery.',
    topics: [
      {
        name: 'Supply Chain Planning & Demand Forecasting',
        concepts: ['Supply Chain Network Architecture', 'Demand Forecasting Methods', 'Bullwhip Effect Mitigation'],
        learningObjectives: [
          'Apply quantitative demand forecasting and reduce the Bullwhip Effect'
        ],
        quests: ['ops-day9-q1', 'ops-day9-q2', 'ops-day9-q3', 'ops-day9-q4', 'ops-day9-q5']
      },
      {
        name: 'Transportation & Logistics Management',
        concepts: ['Modes of Freight Transportation', 'Route Optimization', 'Distribution Network Design'],
        learningObjectives: [
          'Optimize transportation modes and distribution routes'
        ],
        quests: ['ops-day10-q1', 'ops-day10-q2', 'ops-day10-q3', 'ops-day10-q4', 'ops-day10-q5']
      },
      {
        name: 'Last-Mile Delivery & Reverse Logistics',
        concepts: ['Last-Mile Delivery Optimization', 'Reverse Logistics & Returns', 'Green Supply Chain Practices'],
        learningObjectives: [
          'Manage last-mile fulfillment hubs and reverse logistics returns'
        ],
        quests: ['ops-day11-q1', 'ops-day11-q2', 'ops-day11-q3', 'ops-day11-q4', 'ops-day11-q5']
      },
      {
        name: 'Global Supply Chains & Risk Mitigation',
        concepts: ['Global Sourcing & Tariffs', 'Supply Chain Vulnerabilities', 'Supply Chain Risk Mitigation'],
        learningObjectives: [
          'Build resilient global supply chains resistant to geopolitical disruption'
        ],
        quests: ['ops-day12-q1', 'ops-day12-q2', 'ops-day12-q3', 'ops-day12-q4', 'ops-day12-q5']
      }
    ]
  },
  {
    id: 'ops-mod-4',
    title: 'Module 4 — Operations Management',
    dayRange: 'Days 13–16',
    goal: 'Optimize capacity planning, job scheduling, resource allocation, Lean principles (5S, Kanban), and Six Sigma quality.',
    topics: [
      {
        name: 'Capacity Planning & Job Scheduling',
        concepts: ['Design vs Effective Capacity', 'Gantt Charts & Job Scheduling', 'Theory of Constraints (TOC)'],
        learningObjectives: [
          'Build job scheduling Gantt charts and apply Goldratts Theory of Constraints'
        ],
        quests: ['ops-day13-q1', 'ops-day13-q2', 'ops-day13-q3', 'ops-day13-q4', 'ops-day13-q5']
      },
      {
        name: 'Resource Allocation & Workflow Redesign',
        concepts: ['Resource Allocation Optimization', 'Workflow Redesign Mechanics', 'Operational Throughput'],
        learningObjectives: [
          'Balance operational line capacity to maximize throughput'
        ],
        quests: ['ops-day14-q1', 'ops-day14-q2', 'ops-day14-q3', 'ops-day14-q4', 'ops-day14-q5']
      },
      {
        name: 'Lean Principles & 5S Methodology',
        concepts: ['Lean Manufacturing Fundamentals', 'Elimination of 7 Wastes (Muda)', '5S Workplace Organization', 'Kanban Pull Systems'],
        learningObjectives: [
          'Implement 5S organizational systems and visual Kanban boards'
        ],
        quests: ['ops-day15-q1', 'ops-day15-q2', 'ops-day15-q3', 'ops-day15-q4', 'ops-day15-q5']
      },
      {
        name: 'Six Sigma & Operational Performance Monitoring',
        concepts: ['Six Sigma DMAIC Roadmap', 'Defects Per Million Opportunities (DPMO)', 'Operational KPI Scorecards'],
        learningObjectives: [
          'Calculate DPMO and build operational performance scorecards'
        ],
        quests: ['ops-day16-q1', 'ops-day16-q2', 'ops-day16-q3', 'ops-day16-q4', 'ops-day16-q5']
      }
    ]
  },
  {
    id: 'ops-mod-5',
    title: 'Module 5 — Quality Management',
    dayRange: 'Days 17–20',
    goal: 'Master Quality Assurance (QA), Quality Control (QC), ISO standards, Root Cause Analysis (Fishbone/5 Whys), and CAPA.',
    topics: [
      {
        name: 'Quality Assurance vs Quality Control',
        concepts: ['Quality Fundamentals', 'Quality Assurance (QA) vs Control (QC)', 'Customer Quality Expectations'],
        learningObjectives: [
          'Distinguish proactive QA process controls from reactive QC inspections'
        ],
        quests: ['ops-day17-q1', 'ops-day17-q2', 'ops-day17-q3', 'ops-day17-q4', 'ops-day17-q5']
      },
      {
        name: 'Quality Standards & ISO Systems',
        concepts: ['ISO 9001 Quality Framework', 'Quality Audit Protocols', 'Total Quality Management (TQM)'],
        learningObjectives: [
          'Prepare organizations for ISO 9001 quality audits'
        ],
        quests: ['ops-day18-q1', 'ops-day18-q2', 'ops-day18-q3', 'ops-day18-q4', 'ops-day18-q5']
      },
      {
        name: 'Root Cause Analysis Tools',
        concepts: ['Ishikawa (Fishbone) Diagram', '5 Whys Problem Solving Method', 'Pareto Analysis (80/20 Rule)'],
        learningObjectives: [
          'Perform Fishbone and 5 Whys root cause investigations'
        ],
        quests: ['ops-day19-q1', 'ops-day19-q2', 'ops-day19-q3', 'ops-day19-q4', 'ops-day19-q5']
      },
      {
        name: 'Corrective & Preventive Action (CAPA)',
        concepts: ['Corrective Action & Preventive Action (CAPA)', 'Continuous Improvement Loops', 'Zero-Defect Culture'],
        learningObjectives: [
          'Implement CAPA protocols to prevent recurrent quality failures'
        ],
        quests: ['ops-day20-q1', 'ops-day20-q2', 'ops-day20-q3', 'ops-day20-q4', 'ops-day20-q5']
      }
    ]
  },
  {
    id: 'ops-mod-6',
    title: 'Module 6 — Business Compliance & Risk Management',
    dayRange: 'Days 21–24',
    goal: 'Understand corporate, labor, tax, and environmental laws, internal control frameworks, risk matrices, and compliance audits.',
    topics: [
      {
        name: 'Business Laws & Corporate Compliance Overview',
        concepts: ['Corporate Law Basics (Companies Act)', 'Labor Laws & Workplace Safety (OSHA)', 'Contract Law Principles'],
        learningObjectives: [
          'Audit business compliance against corporate and labor regulations'
        ],
        quests: ['ops-day21-q1', 'ops-day21-q2', 'ops-day21-q3', 'ops-day21-q4', 'ops-day21-q5']
      },
      {
        name: 'Tax, Environmental & Regulatory Compliance',
        concepts: ['GST & Tax Compliance Documentation', 'Environmental Regulations (ESG)', 'Regulatory Filing Timelines'],
        learningObjectives: [
          'Maintain statutory tax compliance calendars and ESG filings'
        ],
        quests: ['ops-day22-q1', 'ops-day22-q2', 'ops-day22-q3', 'ops-day22-q4', 'ops-day22-q5']
      },
      {
        name: 'Internal Controls & Risk Assessment',
        concepts: ['COSO Internal Control Framework', 'Segregation of Duties (SoD)', 'Operational Risk Matrices'],
        learningObjectives: [
          'Design internal controls and segregation of duties matrices'
        ],
        quests: ['ops-day23-q1', 'ops-day23-q2', 'ops-day23-q3', 'ops-day23-q4', 'ops-day23-q5']
      },
      {
        name: 'Compliance Audits & Remediation',
        concepts: ['Internal & External Compliance Audits', 'Compliance Gap Analysis', 'Remediation Action Plans'],
        learningObjectives: [
          'Conduct compliance audits and draft gap remediation plans'
        ],
        quests: ['ops-day24-q1', 'ops-day24-q2', 'ops-day24-q3', 'ops-day24-q4', 'ops-day24-q5']
      }
    ]
  },
  {
    id: 'ops-mod-7',
    title: 'Module 7 — ERP & Digital Operations',
    dayRange: 'Days 25–27',
    goal: 'Master Enterprise Resource Planning (ERP) fundamentals, procurement/inventory software integration, order management, and operational dashboards.',
    topics: [
      {
        name: 'ERP Fundamentals & Process Integration',
        concepts: ['What is ERP? (SAP, Oracle, Odoo)', 'Cross-Departmental ERP Integration', 'Centralized Data Repositories'],
        learningObjectives: [
          'Map business processes into integrated ERP module workflows'
        ],
        quests: ['ops-day25-q1', 'ops-day25-q2', 'ops-day25-q3', 'ops-day25-q4', 'ops-day25-q5']
      },
      {
        name: 'Digital Procurement & Order Management Systems',
        concepts: ['Automated Requisition Systems', 'Digital Inventory Tracking (RFID/Barcodes)', 'Integrated Order Fulfillment Workflows'],
        learningObjectives: [
          'Implement RFID/barcode digital inventory tracking within ERPs'
        ],
        quests: ['ops-day26-q1', 'ops-day26-q2', 'ops-day26-q3', 'ops-day26-q4', 'ops-day26-q5']
      },
      {
        name: 'Digital Dashboards & Workflow Automation',
        concepts: ['Real-Time Operational Dashboards', 'Workflow Automation Rules', 'Digital Operations Scaling'],
        learningObjectives: [
          'Build real-time operational executive dashboards'
        ],
        quests: ['ops-day27-q1', 'ops-day27-q2', 'ops-day27-q3', 'ops-day27-q4', 'ops-day27-q5']
      }
    ]
  },
  {
    id: 'ops-mod-8',
    title: 'Module 8 — AI & Future of Operations',
    dayRange: 'Days 28–29',
    goal: 'Leverage AI for predictive maintenance, demand forecasting, smart inventory, warehouse robotics, digital twins, and autonomous supply chains.',
    topics: [
      {
        name: 'AI Predictive Maintenance & Demand Forecasting',
        concepts: ['IoT Sensor Predictive Maintenance', 'AI-Driven Demand Forecasting', 'Smart Inventory Reordering'],
        learningObjectives: [
          'Deploy AI predictive maintenance to prevent unscheduled downtime'
        ],
        quests: ['ops-day28-q1', 'ops-day28-q2', 'ops-day28-q3', 'ops-day28-q4', 'ops-day28-q5']
      },
      {
        name: 'Warehouse Robotics, Digital Twins & Autonomous Supply Chains',
        concepts: ['Warehouse Automation & Robotics (AMRs)', 'Digital Twins of Supply Chain Networks', 'Future Trends in Operations'],
        learningObjectives: [
          'Evaluate digital twins and robotic automation for warehouse scaling'
        ],
        quests: ['ops-day29-q1', 'ops-day29-q2', 'ops-day29-q3', 'ops-day29-q4', 'ops-day29-q5']
      }
    ]
  },
  {
    id: 'ops-mod-9',
    title: 'Day 30 — Integrated Operations Strategy Capstone',
    dayRange: 'Day 30',
    goal: 'Synthesize process mapping, procurement, inventory (EOQ/ROP), supply chain networks, Lean/Six Sigma, quality QA/QC, compliance, ERP, and AI into a master operations plan.',
    topics: [
      {
        name: 'Integrated Operations Strategy & Capstone Assessment',
        concepts: ['End-to-End Operational Architecture', 'Operations Strategy Master Blueprint', 'Certified Operations & Supply Chain Specialist Assessment'],
        learningObjectives: [
          'Build a comprehensive operations, supply chain, and compliance blueprint for an enterprise or startup'
        ],
        quests: ['ops-day30-q1', 'ops-day30-q2', 'ops-day30-q3', 'ops-day30-q4', 'ops-day30-q5']
      }
    ]
  }
];
