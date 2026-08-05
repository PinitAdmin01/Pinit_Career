import { CourseQuest } from './coursesData';

// Helper function to build 146 Quests cleanly across 30 Days
function generate146AccountingQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'bcom-day1-q1',
    title: 'Day 1 - Quest 1: What is Business & Operational Types',
    desc: 'Understand business entities, profit vs non-profit organizations, sole proprietorships, partnerships, and corporations.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Business Definition', 'Sole Proprietorship', 'Partnership', 'Private/Public Limited Companies'],
    hint: 'A business is an organization engaged in commercial, industrial, or professional activities.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'bcom-day1-q2',
    title: 'Day 1 - Quest 2: What is Accounting & Core Objectives',
    desc: 'Explore why accounting is the language of business, its core objectives, and primary stakeholders.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Definition of Accounting', 'Objectives: Record, Measure, Communicate', 'Internal vs External Users'],
    hint: 'Accounting measures business activity, processes information into reports, and communicates results to decision makers.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'bcom-day1-q3',
    title: 'Day 1 - Quest 3: Branches of Accounting',
    desc: 'Differentiate between Financial Accounting, Cost Accounting, Management Accounting, and Tax Accounting.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Financial Accounting', 'Cost Accounting', 'Management Accounting', 'Tax Accounting'],
    hint: 'Tax accounting focuses specifically on tax returns and tax payments to authorities.',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'bcom-day2-q1',
    title: 'Day 2 - Quest 1: Accounting Concepts & Business Entity Rule',
    desc: 'Master the Business Entity Concept and Going Concern assumption in financial record keeping.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Business Entity Concept', 'Going Concern Assumption', 'Money Measurement Concept'],
    hint: 'The owner and the business are treated as separate legal & financial entities.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'bcom-day2-q2',
    title: 'Day 2 - Quest 2: GAAP Principles - Matching & Revenue Recognition',
    desc: 'Learn how the Matching Principle and Accrual Accounting match revenues with corresponding expenses.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Matching Principle', 'Revenue Recognition Concept', 'Accrual vs Cash Basis'],
    hint: 'Revenues are recognized when earned, regardless of when cash is physically received.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'bcom-day2-q3',
    title: 'Day 2 - Quest 3: The Accounting Cycle Overview',
    desc: 'Walk through the 8-step accounting cycle from raw transaction to audited financial statements.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Transaction Identification', 'Journalizing', 'Posting to Ledger', 'Trial Balance', 'Financial Statements'],
    hint: 'The cycle repeats every financial accounting period (usually monthly or annually).',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - Transactions', topics: ['Business Transactions', 'Source Documents', 'Identifying Events'] },
    4: { moduleName: 'Module 1 - Classification', topics: ['Personal Accounts', 'Real Accounts', 'Nominal Accounts'] },
    5: { moduleName: 'Module 2 - Golden Rules', topics: ['Debit and Credit', 'Golden Rules', 'Simple Journal Entries'] },
    6: { moduleName: 'Module 2 - Journal Entries', topics: ['Compound Journal Entries', 'Trade Discount', 'Cash Discount'] },
    7: { moduleName: 'Module 2 - Ledger Posting', topics: ['T-Accounts', 'Posting Journal to Ledger', 'Account Balancing'] },
    8: { moduleName: 'Module 2 - Cash & Subsidiary Books', topics: ['Single & Double Column Cash Book', 'Purchase Book', 'Sales Book'] },
    9: { moduleName: 'Module 2 - Trial Balance & Errors', topics: ['Trial Balance Preparation', 'Suspense Account', 'Rectification of Errors'] },
    10: { moduleName: 'Module 3 - Trading Account', topics: ['Cost of Goods Sold (COGS)', 'Direct Expenses', 'Gross Profit Calculation'] },
    11: { moduleName: 'Module 3 - Profit & Loss Account', topics: ['Indirect Expenses', 'Operating Revenue', 'Net Profit Calculation'] },
    12: { moduleName: 'Module 3 - Balance Sheet Structure', topics: ['Assets & Liabilities', 'Owner Equity', 'Balance Sheet Equation'] },
    13: { moduleName: 'Module 3 - Cash Flow & Financial Ratios', topics: ['Cash Flow Statement', 'Liquidity Ratios', 'Profitability Ratios'] },
    14: { moduleName: 'Module 4 - Digital Accounting (Tally Prime)', topics: ['Introduction to ERP', 'Why Digital Accounting', 'Tally Prime Interface'] },
    15: { moduleName: 'Module 4 - Company & Ledger Setup', topics: ['Company Creation in Tally', 'Chart of Accounts Groups', 'Creating Ledgers'] },
    16: { moduleName: 'Module 4 - Voucher Entry in Tally', topics: ['Payment & Receipt Vouchers', 'Sales & Purchase Vouchers', 'Contra Vouchers'] },
    17: { moduleName: 'Module 4 - Inventory & Cost Centres', topics: ['Stock Items & Stock Groups', 'Units of Measure', 'Cost Centre Allocations'] },
    18: { moduleName: 'Module 4 - Bank Rec & Digital Reports', topics: ['Bank Reconciliation Statement', 'Auto Financial Reports', 'Backup & Security'] },
    19: { moduleName: 'Module 5 - GST Fundamentals', topics: ['Introduction to GST', 'CGST, SGST & IGST', 'Dual GST Model in India'] },
    20: { moduleName: 'Module 5 - Tax Invoicing & HSN', topics: ['GST Tax Invoice Format', 'HSN & SAC Codes', 'Taxable Value Calculation'] },
    21: { moduleName: 'Module 5 - Input Tax Credit (ITC)', topics: ['ITC Rules & Eligibility', 'Setting off ITC against Output Tax', 'Reconciliation'] },
    22: { moduleName: 'Module 5 - GST Returns & Compliance', topics: ['GSTR-1 & GSTR-3B Filings', 'E-Way Bill Generation', 'E-Invoicing System'] },
    23: { moduleName: 'Module 6 - Payroll Structure', topics: ['Basic Pay & HRA', 'Gross Salary Calculation', 'Allowances & Perquisites'] },
    24: { moduleName: 'Module 6 - Statutory Payroll Deductions', topics: ['Provident Fund (PF)', 'Employee State Insurance (ESI)', 'Professional Tax & TDS'] },
    25: { moduleName: 'Module 6 - Payroll Processing & Compliance', topics: ['Monthly Payroll Sheet', 'Employee Payslip Generation', 'Compliance Calendar'] },
    26: { moduleName: 'Module 7 - Income Tax & 5 Heads', topics: ['PAN & TAN Overview', 'Residential Status', '5 Heads of Income'] },
    27: { moduleName: 'Module 7 - Tax Slabs & Deductions', topics: ['Tax Slabs (New vs Old)', 'Chapter VI-A Deductions (80C-80U)', 'ITR Filing Overview'] },
    28: { moduleName: 'Module 8 - Cloud Accounting Tools', topics: ['Zoho Books Overview', 'QuickBooks Cloud Workflows', 'Bank Feeds Integration'] },
    29: { moduleName: 'Module 8 - Accounting Automation & AI', topics: ['OCR Invoice Scanning', 'AI Fraud Detection', 'Digital Audit Trails'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['Accounting Logic', 'Tax Computation', 'Financial Analysis'] };

    // Teaching 1
    quests.push({
      id: `bcom-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `In-depth breakdown of ${info.topics[0]} with real-world corporate examples.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Conceptual Definitions', 'Practical Execution'],
      hint: `Focus on how ${info.topics[0]} impacts financial reporting accuracy.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `bcom-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed examination of ${info.topics[1]} and computational workflows.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Formulae & Standards', 'Industry Case Study'],
      hint: `Understand the step-by-step methodology for ${info.topics[1]}.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `bcom-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and software implementation.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Compliance Guidelines', 'Error Avoidance'],
      hint: `Double check regulatory requirements when processing ${info.topics[2]}.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive JS function / classification / voucher calculation)
    quests.push({
      id: `bcom-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Assignment - ${info.topics[0]}`,
      desc: `Solve realistic business scenarios by writing accounting logic functions or classifying entries.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function processAccountingDay${day}(data) {\n  // Write your financial calculation or classification code here\n  return data;\n}`,
      testSuite: `if (typeof processAccountingDay${day} !== 'function') throw new Error('Method processAccountingDay${day} missing');`,
      hint: `Apply the rules learned in Quests 1-3 to compute the correct output.`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical Assessment)
    quests.push({
      id: `bcom-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily Mastery Exam - ${info.moduleName}`,
      desc: `Evaluates speed and accuracy on ${info.moduleName} concepts under exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function calculateExamScoreDay${day}(answers) {\n  // Validate financial calculations and ledger balances\n  return true;\n}`,
      testSuite: `if (typeof calculateExamScoreDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Ensure all debits equal credits before submitting your balance sheet exam.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Capstone Integration (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'bcom-day30-q1',
    title: 'Day 30 - Quest 1: Integrated Accounting Workflow',
    desc: 'Trace a financial transaction from raw source document to Journal -> Ledger -> Trial Balance -> Financial Statements.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Full Accounting Cycle Integration', 'Auditing Ledger Postings', 'Final Balance Sheet Verification'],
    hint: 'Double entry equilibrium must be maintained across all 8 stages.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'bcom-day30-q2',
    title: 'Day 30 - Quest 2: Integrated Taxation Workflow',
    desc: 'Unify GST Input Tax Credit set-off, Employee Statutory Payroll deductions, and Direct Income Tax provisions.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['GST + Payroll + Income Tax Synthesis', 'Compliance Calendar Sync', 'Corporate Tax Optimization'],
    hint: 'Net GST liability is calculated after deducting eligible ITC from output tax.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'bcom-day30-q3',
    title: 'Day 30 - Quest 3: The Modern Digital Accountant',
    desc: 'Synthesize traditional accounting rigor with ERP (Tally Prime), cloud suites (Zoho Books), and AI automation.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Digital Accountant Competencies', 'Automation Ethics', 'AI Financial Advisory'],
    hint: 'Technology automates data entry; accountants provide strategic financial insights.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Capstone Business Accounts
  quests.push({
    id: 'bcom-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Small Business Full Books',
    desc: 'Prepare complete accounts for a small business: journalize 10 transactions, post ledgers, balance trial balance, calculate GST & payroll, and generate Balance Sheet.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function prepareCapstoneAccounts(transactions) {\n  // 1. Calculate Gross Revenue\n  // 2. Calculate Total Expenses & GST\n  // 3. Compute Net Profit & Balance Sheet Total\n  return {\n    balanceSheetBalanced: true,\n    netProfit: 150000,\n    gstLiability: 27000\n  };\n}`,
    testSuite: `if (typeof prepareCapstoneAccounts !== 'function') throw new Error('Capstone method missing');\nconst res = prepareCapstoneAccounts([]);\nif (!res.balanceSheetBalanced) throw new Error('Balance sheet did not balance');`,
    hint: `Total Assets must equal Total Liabilities + Owner Equity!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional Assessment
  quests.push({
    id: 'bcom-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - Digital Accounting & Taxation',
    desc: 'Mastery certification exam covering Accounting Fundamentals, Journal & Ledger, Financial Statements, Tally Prime, GST, Payroll, Income Tax & AI Automation.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalAccountingCertificationExam(candidateAnswers) {\n  // Validate comprehensive multi-section exam\n  return {\n    scorePct: 95,\n    passed: true,\n    certificateIssued: true\n  };\n}`,
    testSuite: `if (typeof executeFinalAccountingCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalResult = executeFinalAccountingCertificationExam({});\nif (!evalResult.passed) throw new Error('Final exam verification failed');`,
    hint: `Review all 8 modules before attempting the final 90-minute evaluation.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_ACCOUNTING_30_DAYS_QUESTS: CourseQuest[] = generate146AccountingQuests();
