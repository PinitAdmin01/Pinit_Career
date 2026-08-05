import { CourseQuest } from './coursesData';

// Helper function to generate all 146 Operations, Supply Chain & Business Compliance Quests
function generate146OperationsQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'ops-day1-q1',
    title: 'Day 1 - Quest 1: Introduction to Business Operations',
    desc: 'Understand what Business Operations are, why operational excellence matters, how internal activities create value, and operational transformation frameworks.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What are Business Operations?', 'Why Operations Matter', 'Value Creation Mechanics', 'Operational Excellence'],
    hint: 'Operations represent the core engine transforming resources into market-ready customer value.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ops-day1-q2',
    title: 'Day 1 - Quest 2: Business Processes',
    desc: 'Examine business process architecture: Inputs, Transformation Activities, Outputs, Final Outcomes, and End-to-End Process Flow mapping.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Inputs & Transformation', 'Activities & Outputs', 'Outcomes', 'Process Flow Mapping'],
    hint: 'Optimizing inputs and transformation activities directly improves output quality and customer satisfaction.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ops-day1-q3',
    title: 'Day 1 - Quest 3: Business Functions',
    desc: 'Map the interdependencies between key business functions: Operations, Finance, Marketing, Human Resources (HR), Information Technology (IT), and Customer Support.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Operations & Finance Sync', 'Marketing & Sales Sync', 'HR, IT & Support Functions'],
    hint: 'Operational excellence requires seamless cross-functional alignment across all business units.',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'ops-day2-q1',
    title: 'Day 2 - Quest 1: Introduction to Supply Chain',
    desc: 'Deconstruct supply chain networks: Component Suppliers, Manufacturers, Distributors, Wholesalers, Retailers, and End Customers.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What is a Supply Chain?', 'Suppliers & Manufacturers', 'Distributors & Retailers', 'End Customer Delivery'],
    hint: 'A supply chain is only as strong as its weakest link; visibility across all nodes is essential.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ops-day2-q2',
    title: 'Day 2 - Quest 2: Business Resources',
    desc: 'Analyze the 5 Ms of business resources: People (Labor), Materials (Inventory), Machines (Equipment), Money (Capital), and Information (Data).',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['People & Materials', 'Machines & Equipment', 'Capital & Information'],
    hint: 'Efficient resource allocation prevents capital tie-up and machine downtime.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'ops-day2-q3',
    title: 'Day 2 - Quest 3: Business Compliance Fundamentals',
    desc: 'Understand business compliance: Statutory laws, regulatory frameworks, industry standards, and legal vs ethical organizational responsibilities.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What is Compliance?', 'Why Compliance Matters', 'Legal vs Ethical Responsibilities'],
    hint: 'Compliance protects organizations from legal penalties, regulatory shutdowns, and reputational damage.',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - Process Mapping & Workflows', topics: ['Business Process Mapping', 'Operational Workflows', 'Process Standardization & SOPs'] },
    4: { moduleName: 'Module 1 - Operational Efficiency & Bottlenecks', topics: ['Operational Efficiency Metrics', 'Productivity Ratios', 'Continuous Improvement (Kaizen)'] },
    5: { moduleName: 'Module 2 - Procurement & Vendor Management', topics: ['Procurement Fundamentals', 'Vendor Selection Criteria', 'Purchase Order Workflows'] },
    6: { moduleName: 'Module 2 - Inventory & Economic Order Quantity', topics: ['Inventory Concepts', 'Economic Order Quantity (EOQ)', 'Inventory Cost Optimization'] },
    7: { moduleName: 'Module 2 - Reorder Points & Safety Stock', topics: ['Safety Stock Calculations', 'Reorder Point (ROP) Formulas', 'Lead Time Management'] },
    8: { moduleName: 'Module 2 - Warehouse Operations & Audits', topics: ['Warehouse Layout Basics', 'ABC Inventory Control', 'Physical Stock Audits'] },
    9: { moduleName: 'Module 3 - Supply Chain & Demand Planning', topics: ['Supply Chain Planning', 'Demand Forecasting', 'Bullwhip Effect Mitigation'] },
    10: { moduleName: 'Module 3 - Transportation & Distribution', topics: ['Transportation Modes', 'Warehousing Hubs', 'Distribution Networks'] },
    11: { moduleName: 'Module 3 - Last-Mile & Reverse Logistics', topics: ['Last-Mile Delivery', 'Reverse Logistics & Returns', 'Green Supply Chains'] },
    12: { moduleName: 'Module 3 - Global Supply Chains & Risks', topics: ['Global Supply Chains', 'Global Sourcing Tariffs', 'Supply Chain Risk Mitigation'] },
    13: { moduleName: 'Module 4 - Capacity & Job Scheduling', topics: ['Capacity Planning', 'Gantt Chart Scheduling', 'Theory of Constraints (TOC)'] },
    14: { moduleName: 'Module 4 - Resource Allocation & Redesign', topics: ['Resource Allocation', 'Workflow Optimization', 'Process Redesign'] },
    15: { moduleName: 'Module 4 - Lean Principles & 5S Workplaces', topics: ['Lean Fundamentals (7 Wastes)', '5S Workplace Organization', 'Kanban Pull Systems'] },
    16: { moduleName: 'Module 4 - Six Sigma & DMAIC Roadmap', topics: ['Six Sigma Concepts', 'DMAIC Methodology', 'Operational Performance KPIs'] },
    17: { moduleName: 'Module 5 - Quality Assurance vs Quality Control', topics: ['Quality Fundamentals', 'Quality Standards', 'Quality Assurance (QA) vs Control (QC)'] },
    18: { moduleName: 'Module 5 - ISO Quality Standards & Audits', topics: ['ISO 9001 Framework', 'TQM Principles', 'Quality Audit Protocols'] },
    19: { moduleName: 'Module 5 - Root Cause Analysis (Fishbone/5 Whys)', topics: ['Fishbone (Ishikawa) Diagrams', '5 Whys Problem Solving', 'Pareto 80/20 Analysis'] },
    20: { moduleName: 'Module 5 - Corrective & Preventive Action (CAPA)', topics: ['Corrective Actions (CAPA)', 'Continuous Improvement Loops', 'Zero-Defect Quality Culture'] },
    21: { moduleName: 'Module 6 - Business Laws & Corporate Compliance', topics: ['Business Laws Overview', 'Corporate Compliance (Companies Act)', 'Labor Laws & Workplace Safety'] },
    22: { moduleName: 'Module 6 - Tax & Environmental Compliance', topics: ['Tax Compliance (GST)', 'Environmental Regulations (ESG)', 'Documentation & Regulatory Filings'] },
    23: { moduleName: 'Module 6 - Internal Controls & SoD', topics: ['Internal Control Frameworks (COSO)', 'Segregation of Duties (SoD)', 'Operational Risk Management'] },
    24: { moduleName: 'Module 6 - Compliance Audits & Remediation', topics: ['Compliance Audit Protocols', 'Compliance Gap Analysis', 'Gap Remediation Planning'] },
    25: { moduleName: 'Module 7 - ERP Fundamentals & Integration', topics: ['ERP Concepts (SAP/Oracle/Odoo)', 'Business Process Integration', 'Centralized Data Management'] },
    26: { moduleName: 'Module 7 - Digital Procurement & Inventory Systems', topics: ['Procurement Systems', 'Digital Inventory Systems (RFID/Barcode)', 'Order Management Systems'] },
    27: { moduleName: 'Module 7 - Workflow Automation & Dashboards', topics: ['Workflow Automation', 'Real-Time Business Dashboards', 'Digital Operations Scaling'] },
    28: { moduleName: 'Module 8 - AI Maintenance & Forecasting', topics: ['AI in Operations', 'Predictive Maintenance', 'AI Demand Forecasting'] },
    29: { moduleName: 'Module 8 - Smart Inventory & Robotics', topics: ['Smart Inventory Systems', 'Warehouse Robotics & Automation', 'Digital Twins in Supply Chains'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['Operations Strategy', 'Supply Chain Management', 'Business Compliance'] };

    // Teaching 1
    quests.push({
      id: `ops-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `Comprehensive lecture on ${info.topics[0]} with real-world enterprise execution case studies.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Operational Architecture', 'Industry Best Practices'],
      hint: `Understand how ${info.topics[0]} streamlines internal workflows and reduces waste.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `ops-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed breakdown of ${info.topics[1]} and supply chain mechanics.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Process Controls', 'Compliance Protocols'],
      hint: `Focus on metrics that validate the efficiency of ${info.topics[1]}.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `ops-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and digital enterprise operations.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Performance Dashboards', 'Continuous Improvement'],
      hint: `Ensure processes for ${info.topics[2]} are compliant and resilient to supply chain shocks.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive operations solver / EOQ calculator / ROP & Fishbone diagram solver)
    quests.push({
      id: `ops-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Assignment - ${info.topics[0]}`,
      desc: `Execute practical operations tasks: calculate Economic Order Quantity (EOQ), compute Reorder Point (ROP) with safety stock, perform ABC inventory analysis, or map Fishbone root causes.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function processOperationsAssignmentDay${day}(inventoryData) {\n  // Calculate EOQ, Reorder Point (ROP), or DPMO metrics\n  return {\n    eoqUnits: 450,\n    reorderPointUnits: 120,\n    safetyStockUnits: 30,\n    dpmoScore: 3.4,\n    processValidated: true\n  };\n}`,
      testSuite: `if (typeof processOperationsAssignmentDay${day} !== 'function') throw new Error('Assignment solver missing');`,
      hint: `Formula check: EOQ = Math.sqrt((2 * Demand * OrderingCost) / HoldingCost). ROP = (Daily Usage * Lead Time) + Safety Stock.`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical Operations Exam)
    quests.push({
      id: `ops-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily Operations Mastery Exam - ${info.moduleName}`,
      desc: `Evaluates inventory calculations, process optimization, and compliance protocols under timed exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function validateOperationsExamDay${day}(answers) {\n  // Validate operational decisions and inventory calculations\n  return true;\n}`,
      testSuite: `if (typeof validateOperationsExamDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Review EOQ, ROP, Lean wastes, and ISO audit protocols before submitting your answers.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Integrated Operations Strategy Capstone (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'ops-day30-q1',
    title: 'Day 30 - Quest 1: Business Operations Framework Synthesis',
    desc: 'Synthesize internal operations architecture: Raw Inputs -> Process Transformation -> Operational Outputs -> Customer Value Delivery.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Business Operations Architecture', 'Transformation Mechanics', 'Operational Value Delivery'],
    hint: 'Operational excellence turns organizational inputs into high-margin, defect-free customer value.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'ops-day30-q2',
    title: 'Day 30 - Quest 2: Supply Chain Framework Synthesis',
    desc: 'Unify Strategic Procurement, Inventory Control (EOQ/ROP), Transportation Networks, Warehousing, and Last-Mile Distribution.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Supply Chain Integration', 'Procurement & Inventory Sync', 'Distribution & Logistics Network'],
    hint: 'An integrated supply chain minimizes carrying costs while guaranteeing high order fulfillment rates.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'ops-day30-q3',
    title: 'Day 30 - Quest 3: Modern Operations, Compliance & AI Synthesis',
    desc: 'Align ERP Integration, Statutory Compliance, Quality Systems (QA/QC/CAPA), Operational Risk Audits, and AI Predictive Maintenance.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['ERP & System Integration', 'Compliance & Quality Controls', 'AI-Driven Predictive Operations'],
    hint: 'Combine automated ERP workflows and AI predictive forecasting with robust statutory compliance controls.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Master Integrated Operations Strategy Project
  quests.push({
    id: 'ops-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Complete Operations & Supply Chain Strategy Plan',
    desc: 'Develop a complete operations strategy for a business: process flow map, procurement & vendor selection plan, inventory control plan (EOQ, ROP, safety stock), supply chain & logistics network design, quality assurance (QA/QC) & CAPA protocol, compliance checklist (Companies Act, GST, OSHA), operational KPI dashboard, risk mitigation matrix, and AI operations roadmap.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function executeOperationsStrategyCapstone(businessBrief) {\n  // 1. Map Process Flow & Write SOPs\n  // 2. Calculate EOQ, ROP & Safety Stock\n  // 3. Design Logistics Network & ISO QA/QC Standards\n  // 4. Draft Compliance Checklist & AI Predictive Operations Roadmap\n  return {\n    processFlowMap: "SOP-101 Order-to-Delivery Workflows",\n    inventoryPolicy: {\n      eoqUnits: 1200,\n      ropUnits: 350,\n      safetyStockUnits: 80\n    },\n    logisticsNetwork: "3PL Multi-Hub Regional Warehousing",\n    qualityStandard: "ISO 9001 Compliant QA/QC CAPA Protocols",\n    complianceChecklist: ["Corporate Filings", "GST Tax Compliance", "OSHA Workplace Safety"],\n    operationalKPIs: {\n      targetThroughputRate: 98.5,\n      targetDPMO: 3.4,\n      onTimeDeliveryPct: 99.2\n    },\n    operationsPlanComplete: true\n  };\n}`,
    testSuite: `if (typeof executeOperationsStrategyCapstone !== 'function') throw new Error('Capstone solver missing');\nconst res = executeOperationsStrategyCapstone({});\nif (!res.operationsPlanComplete || !res.inventoryPolicy) throw new Error('Capstone operations plan incomplete');`,
    hint: `Ensure all key operational areas (process, inventory EOQ/ROP, logistics, quality, compliance, and KPIs) are fully specified!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional Operations & Supply Chain Certification
  quests.push({
    id: 'ops-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - Operations, Supply Chain & Business Compliance',
    desc: 'Mastery certification assessment covering Operations Fundamentals, Business Processes, Procurement, Inventory Management, Supply Chain Management, Logistics, Quality Management, Business Compliance, ERP Concepts, and AI in Operations.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalOperationsCertificationExam(candidateAnswers) {\n  // Validate comprehensive 90-minute operations, supply chain & compliance exam\n  return {\n    scorePct: 98,\n    passed: true,\n    certificationTitle: "Certified Operations, Supply Chain & Compliance Specialist"\n  };\n}`,
    testSuite: `if (typeof executeFinalOperationsCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalRes = executeFinalOperationsCertificationExam({});\nif (!evalRes.passed) throw new Error('Certification evaluation failed');`,
    hint: `Review all 8 modules before initiating the final comprehensive certification assessment.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_OPERATIONS_30_DAYS_QUESTS: CourseQuest[] = generate146OperationsQuests();
