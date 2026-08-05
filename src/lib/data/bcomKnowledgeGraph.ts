export interface KnowledgeObjective {
  id: string;
  statement: string;
  questIds: string[];
}

export interface KnowledgeConcept {
  id: string;
  title: string;
  description: string;
  objectives: KnowledgeObjective[];
}

export interface KnowledgeTopic {
  id: string;
  title: string;
  concepts: KnowledgeConcept[];
}

export interface KnowledgeModule {
  id: string;
  title: string;
  daysRange: string;
  learningGoal: string;
  topics: KnowledgeTopic[];
}

export const BCOM_ACCOUNTING_KNOWLEDGE_GRAPH: KnowledgeModule[] = [
  {
    id: 'mod-1',
    title: 'Module 1 – Understanding Business & Accounting',
    daysRange: 'Days 1–4',
    learningGoal: 'Build a strong mental model of why accounting exists before introducing calculations.',
    topics: [
      {
        id: 'topic-1-1',
        title: 'Business & Accounting Fundamentals',
        concepts: [
          {
            id: 'concept-1-1-1',
            title: 'Nature of Business',
            description: 'Types of businesses, operational models, and why accounting is essential.',
            objectives: [
              {
                id: 'obj-1-1-1-a',
                statement: 'Understand business entities, profit vs non-profit, and business objectives.',
                questIds: ['bcom-day1-q1', 'bcom-day1-q2', 'bcom-day1-q3']
              }
            ]
          },
          {
            id: 'concept-1-1-2',
            title: 'Accounting Concepts & Principles',
            description: 'Business entity, going concern, matching principle, and revenue recognition.',
            objectives: [
              {
                id: 'obj-1-1-2-a',
                statement: 'Apply fundamental GAAP principles to financial events.',
                questIds: ['bcom-day2-q1', 'bcom-day2-q2', 'bcom-day2-q3']
              }
            ]
          }
        ]
      },
      {
        id: 'topic-1-2',
        title: 'Transactions & Account Classification',
        concepts: [
          {
            id: 'concept-1-2-1',
            title: 'Business Transactions & Source Documents',
            description: 'Invoices, receipts, vouchers, and transaction identification.',
            objectives: [
              {
                id: 'obj-1-2-1-a',
                statement: 'Identify financial transactions from raw activity logs and receipts.',
                questIds: ['bcom-day3-q1', 'bcom-day3-q2', 'bcom-day3-q3', 'bcom-day3-q4', 'bcom-day3-q5']
              }
            ]
          },
          {
            id: 'concept-1-2-2',
            title: 'Types of Accounts & Classification',
            description: 'Personal, Real, and Nominal accounts.',
            objectives: [
              {
                id: 'obj-1-2-2-a',
                statement: 'Classify accounts accurately into assets, liabilities, expenses, and revenues.',
                questIds: ['bcom-day4-q1', 'bcom-day4-q2', 'bcom-day4-q3', 'bcom-day4-q4', 'bcom-day4-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-2',
    title: 'Module 2 – Journal & Ledger',
    daysRange: 'Days 5–9',
    learningGoal: 'Master double-entry bookkeeping, debit/credit golden rules, journal entries, ledger posting, and trial balance verification.',
    topics: [
      {
        id: 'topic-2-1',
        title: 'Golden Rules & Journalization',
        concepts: [
          {
            id: 'concept-2-1-1',
            title: 'Rules of Debit & Credit',
            description: 'Applying golden rules for Personal, Real, and Nominal accounts.',
            objectives: [
              {
                id: 'obj-2-1-1-a',
                statement: 'Formulate accurate single and compound journal entries.',
                questIds: ['bcom-day5-q1', 'bcom-day5-q2', 'bcom-day5-q3', 'bcom-day5-q4', 'bcom-day5-q5', 'bcom-day6-q1', 'bcom-day6-q2', 'bcom-day6-q3', 'bcom-day6-q4', 'bcom-day6-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'topic-2-2',
        title: 'Subsidiary Books & Ledger Posting',
        concepts: [
          {
            id: 'concept-2-2-1',
            title: 'Ledgers & Subsidiary Books',
            description: 'Cash book, purchase book, sales book, and T-account postings.',
            objectives: [
              {
                id: 'obj-2-2-1-a',
                statement: 'Post journal entries to ledger T-accounts and maintain subsidiary books.',
                questIds: ['bcom-day7-q1', 'bcom-day7-q2', 'bcom-day7-q3', 'bcom-day7-q4', 'bcom-day7-q5', 'bcom-day8-q1', 'bcom-day8-q2', 'bcom-day8-q3', 'bcom-day8-q4', 'bcom-day8-q5']
              }
            ]
          },
          {
            id: 'concept-2-2-2',
            title: 'Trial Balance & Error Rectification',
            description: 'Balancing accounts, preparing trial balance, and identifying errors.',
            objectives: [
              {
                id: 'obj-2-2-2-a',
                statement: 'Extract trial balance and locate accounting errors.',
                questIds: ['bcom-day9-q1', 'bcom-day9-q2', 'bcom-day9-q3', 'bcom-day9-q4', 'bcom-day9-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-3',
    title: 'Module 3 – Financial Statements',
    daysRange: 'Days 10–13',
    learningGoal: 'Construct complete Trading Accounts, Profit & Loss Statements, Balance Sheets, Cash Flows, and Financial Ratio analysis.',
    topics: [
      {
        id: 'topic-3-1',
        title: 'Trading & Profit Loss Statements',
        concepts: [
          {
            id: 'concept-3-1-1',
            title: 'Gross Profit & Operating Profit',
            description: 'Direct vs indirect expenses, cost of goods sold, and gross profit.',
            objectives: [
              {
                id: 'obj-3-1-1-a',
                statement: 'Calculate COGS, Gross Profit, and Net Profit from trial balance data.',
                questIds: ['bcom-day10-q1', 'bcom-day10-q2', 'bcom-day10-q3', 'bcom-day10-q4', 'bcom-day10-q5', 'bcom-day11-q1', 'bcom-day11-q2', 'bcom-day11-q3', 'bcom-day11-q4', 'bcom-day11-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'topic-3-2',
        title: 'Balance Sheet & Financial Ratios',
        concepts: [
          {
            id: 'concept-3-2-1',
            title: 'Balance Sheet & Liquidity Analysis',
            description: 'Assets, liabilities, equity, working capital, and financial ratio metrics.',
            objectives: [
              {
                id: 'obj-3-2-1-a',
                statement: 'Structure Balance Sheets and compute liquidity & profitability ratios.',
                questIds: ['bcom-day12-q1', 'bcom-day12-q2', 'bcom-day12-q3', 'bcom-day12-q4', 'bcom-day12-q5', 'bcom-day13-q1', 'bcom-day13-q2', 'bcom-day13-q3', 'bcom-day13-q4', 'bcom-day13-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-4',
    title: 'Module 4 – Digital Accounting (Tally Prime)',
    daysRange: 'Days 14–18',
    learningGoal: 'Master modern ERP workflows in Tally Prime, voucher types, cost centers, inventory management, and digital reports.',
    topics: [
      {
        id: 'topic-4-1',
        title: 'ERP & Tally Basics',
        concepts: [
          {
            id: 'concept-4-1-1',
            title: 'Tally Setup & Ledgers',
            description: 'Company creation, chart of accounts, groups, and ledgers in Tally Prime.',
            objectives: [
              {
                id: 'obj-4-1-1-a',
                statement: 'Create companies, custom ledger groups, and voucher categories.',
                questIds: ['bcom-day14-q1', 'bcom-day14-q2', 'bcom-day14-q3', 'bcom-day14-q4', 'bcom-day14-q5', 'bcom-day15-q1', 'bcom-day15-q2', 'bcom-day15-q3', 'bcom-day15-q4', 'bcom-day15-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'topic-4-2',
        title: 'Vouchers, Inventory & Reports',
        concepts: [
          {
            id: 'concept-4-2-1',
            title: 'Digital Vouchers & Cost Centers',
            description: 'Payment, receipt, sales, purchase vouchers, stock items, and banking reconciliation.',
            objectives: [
              {
                id: 'obj-4-2-1-a',
                statement: 'Execute digital accounting vouchers and generate automated ERP reports.',
                questIds: ['bcom-day16-q1', 'bcom-day16-q2', 'bcom-day16-q3', 'bcom-day16-q4', 'bcom-day16-q5', 'bcom-day17-q1', 'bcom-day17-q2', 'bcom-day17-q3', 'bcom-day17-q4', 'bcom-day17-q5', 'bcom-day18-q1', 'bcom-day18-q2', 'bcom-day18-q3', 'bcom-day18-q4', 'bcom-day18-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-5',
    title: 'Module 5 – GST & Indirect Taxation',
    daysRange: 'Days 19–22',
    learningGoal: 'Understand CGST, SGST, IGST, tax invoice mechanics, Input Tax Credit (ITC), GSTR filings, E-Way bills, and E-Invoicing.',
    topics: [
      {
        id: 'topic-5-1',
        title: 'GST Framework & Invoicing',
        concepts: [
          {
            id: 'concept-5-1-1',
            title: 'GST Structure & Tax Computation',
            description: 'Intrastate vs interstate tax, tax invoice format, HSN codes, and taxable value.',
            objectives: [
              {
                id: 'obj-5-1-1-a',
                statement: 'Compute CGST, SGST, and IGST for business transactions.',
                questIds: ['bcom-day19-q1', 'bcom-day19-q2', 'bcom-day19-q3', 'bcom-day19-q4', 'bcom-day19-q5', 'bcom-day20-q1', 'bcom-day20-q2', 'bcom-day20-q3', 'bcom-day20-q4', 'bcom-day20-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'topic-5-2',
        title: 'ITC & GST Compliance',
        concepts: [
          {
            id: 'concept-5-2-1',
            title: 'Input Tax Credit & E-Invoicing',
            description: 'Setting off ITC against output liability, GSTR-1/GSTR-3B filings, and E-Way bills.',
            objectives: [
              {
                id: 'obj-5-2-1-a',
                statement: 'Reconcile Input Tax Credit and calculate net GST payable.',
                questIds: ['bcom-day21-q1', 'bcom-day21-q2', 'bcom-day21-q3', 'bcom-day21-q4', 'bcom-day21-q5', 'bcom-day22-q1', 'bcom-day22-q2', 'bcom-day22-q3', 'bcom-day22-q4', 'bcom-day22-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-6',
    title: 'Module 6 – Payroll & Business Compliance',
    daysRange: 'Days 23–25',
    learningGoal: 'Compute salary structures, statutory deductions (PF, ESI, PT, TDS), payroll processing, and compliance calendars.',
    topics: [
      {
        id: 'topic-6-1',
        title: 'Payroll Calculations & Statutory Deductions',
        concepts: [
          {
            id: 'concept-6-1-1',
            title: 'Gross Salary to Net Pay',
            description: 'Basic pay, HRA, allowances, Provident Fund (PF), ESI, Professional Tax, and TDS on salary.',
            objectives: [
              {
                id: 'obj-6-1-1-a',
                statement: 'Generate complete monthly employee payslips and statutory compliance sheets.',
                questIds: ['bcom-day23-q1', 'bcom-day23-q2', 'bcom-day23-q3', 'bcom-day23-q4', 'bcom-day23-q5', 'bcom-day24-q1', 'bcom-day24-q2', 'bcom-day24-q3', 'bcom-day24-q4', 'bcom-day24-q5', 'bcom-day25-q1', 'bcom-day25-q2', 'bcom-day25-q3', 'bcom-day25-q4', 'bcom-day25-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-7',
    title: 'Module 7 – Income Tax Fundamentals',
    daysRange: 'Days 26–27',
    learningGoal: 'Grasp direct taxation, PAN/TAN, residential status, 5 heads of income, tax slabs, Chapter VI-A deductions, and ITR filing.',
    topics: [
      {
        id: 'topic-7-1',
        title: 'Direct Tax & Income Assessment',
        concepts: [
          {
            id: 'concept-7-1-1',
            title: 'Heads of Income & Tax Deductions',
            description: 'Salary, House Property, PGBP, Capital Gains, Other Sources, 80C to 80U deductions.',
            objectives: [
              {
                id: 'obj-7-1-1-a',
                statement: 'Compute taxable income and calculate total income tax liability under new vs old regime.',
                questIds: ['bcom-day26-q1', 'bcom-day26-q2', 'bcom-day26-q3', 'bcom-day26-q4', 'bcom-day26-q5', 'bcom-day27-q1', 'bcom-day27-q2', 'bcom-day27-q3', 'bcom-day27-q4', 'bcom-day27-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-8',
    title: 'Module 8 – Modern Accounting & Automation',
    daysRange: 'Days 28–29',
    learningGoal: 'Explore cloud accounting (Zoho Books, QuickBooks), OCR invoice processing, AI in accounting, digital audit trails, and financial cybersecurity.',
    topics: [
      {
        id: 'topic-8-1',
        title: 'Cloud Tools & AI Automation',
        concepts: [
          {
            id: 'concept-8-1-1',
            title: 'Automated Financial Systems',
            description: 'Bank feeds, automated reconciliations, OCR document extraction, and AI fraud detection.',
            objectives: [
              {
                id: 'obj-8-1-1-a',
                statement: 'Apply cloud accounting workflows and automated reconciliation logic.',
                questIds: ['bcom-day28-q1', 'bcom-day28-q2', 'bcom-day28-q3', 'bcom-day28-q4', 'bcom-day28-q5', 'bcom-day29-q1', 'bcom-day29-q2', 'bcom-day29-q3', 'bcom-day29-q4', 'bcom-day29-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-9',
    title: 'Day 30 – Capstone Integration',
    daysRange: 'Day 30',
    learningGoal: 'Synthesize complete accounting, GST, payroll, income tax, and digital software capabilities into a master business accounting portfolio.',
    topics: [
      {
        id: 'topic-9-1',
        title: 'Comprehensive Master Capstone',
        concepts: [
          {
            id: 'concept-9-1-1',
            title: 'End-to-End Financial Execution',
            description: 'Full business cycle execution from journal entries to tax compliance and executive reporting.',
            objectives: [
              {
                id: 'obj-9-1-1-a',
                statement: 'Execute complete end-to-end accounting and tax filing for a enterprise entity.',
                questIds: ['bcom-day30-q1', 'bcom-day30-q2', 'bcom-day30-q3', 'bcom-day30-q4', 'bcom-day30-q5']
              }
            ]
          }
        ]
      }
    ]
  }
];
