// src/lib/onboarding/diagnosticRegistryCommerce.ts
/**
 * PinIT Career OS — Production B.Com / M.Com & Commerce Diagnostic Question Registry V1
 * 
 * Target Students:
 * - B.Com, M.Com, Commerce, Finance, Banking, Auditing, Taxation, Corporate Management, Analytics
 * 
 * CORE LAWS:
 * 1. Goal != Persona: Career goals & degree selection NEVER directly alter PH, EX, ST, or SIQ.
 * 2. An answer is evidence, not a diagnosis.
 * 3. Options must be randomized at render; store optionId, never screen index A/B/C/D.
 * 4. Natural Phrasing ("Smart Answer" Defense): Do not use obvious professional jargon;
 *    actions must represent natural behavior (e.g. "I would break the numbers apart and see what changed").
 * 5. Operating Dimensions:
 *    - PH  : Analytical Structuring (Pattern Hunter)
 *    - EX  : Experimental Exploration (Explorer)
 *    - ST  : Structured Execution (Stabilizer)
 *    - SIQ : Perspective Coordination (Social IQ)
 */

import {
  BehavioralDimension,
  DiagnosticContext,
  GoalDiscoveryQuestion,
  SJTQuestion,
  MatrixScenario,
  TradeoffProbe
} from './diagnosticRegistry';

/* ==========================================================================
   PART A — B.COM / M.COM GOAL DISCOVERY QUESTIONS (Q1 – Q8)
   ========================================================================== */

export const BCOM_GOAL_DISCOVERY_QUESTIONS: GoalDiscoveryQuestion[] = [
  {
    id: 'Q1_COMMERCE_GOAL',
    title: 'Primary Career Domain',
    subtitle: 'What is your primary career goal in commerce & business?',
    type: 'single_select',
    options: [
      { id: 'comm_accounting_finance', label: 'Accounting / Finance', description: 'Financial statements, corporate accounting, management accounting & reporting', mappedValue: 'accounting_finance' },
      { id: 'comm_banking_services', label: 'Banking / Financial Services', description: 'Retail/investment banking, credit analysis, loan appraisal & fintech services', mappedValue: 'banking_services' },
      { id: 'comm_audit_taxation', label: 'Audit / Taxation / Compliance', description: 'Internal & statutory audits, GST, Income Tax filing, statutory compliance', mappedValue: 'audit_taxation' },
      { id: 'comm_business_analytics', label: 'Business Analytics / Data-driven Business', description: 'Excel modeling, SQL, PowerBI dashboards, statistical market insights', mappedValue: 'business_analytics' },
      { id: 'comm_investment_markets', label: 'Investment / Equity / Financial Markets', description: 'Equity research, portfolio valuation, trading strategies & asset management', mappedValue: 'investment_markets' },
      { id: 'comm_corporate_mgmt', label: 'Corporate / Management', description: 'Business operations, project management, corporate strategy & executive consulting', mappedValue: 'corporate_management' },
      { id: 'comm_human_resources', label: 'Human Resources (HR)', description: 'Talent acquisition, organizational behavior, employee relations & payroll', mappedValue: 'human_resources' },
      { id: 'comm_marketing_sales', label: 'Marketing / Sales', description: 'Brand management, growth funnels, customer acquisition & market research', mappedValue: 'marketing_sales' },
      { id: 'comm_entrepreneurship', label: 'Entrepreneurship / Business', description: 'Launching a business venture, commercial trading, or scaling family enterprise', mappedValue: 'entrepreneurship' },
      { id: 'comm_govt_exams', label: 'Government / Competitive Exams', description: 'RBI Grade B, SEBI, IBPS Banking, UPSC, SSC CGL & public finance', mappedValue: 'government_exams' },
      { id: 'comm_higher_studies', label: 'Higher Education / Research', description: 'M.Com, MBA, CFA, CA, CMA, ACCA, PhD or academic research', mappedValue: 'higher_education' },
      { id: 'comm_exploring', label: 'I am still exploring', description: 'Exploring career paths across commerce, accounting, and business sectors', mappedValue: 'exploring' }
    ]
  },
  {
    id: 'Q2_COMMERCE_OUTCOME',
    title: 'Target Outcome',
    subtitle: 'What is the outcome you want to achieve first?',
    type: 'single_select',
    options: [
      { id: 'out_internship', label: 'Land an Internship', description: 'Get a paid industry internship in finance, audit, or corporate office in 3–6 months', mappedValue: 'internship' },
      { id: 'out_first_job', label: 'First Full-time Job', description: 'Secure on-campus or off-campus entry-level analyst or associate role', mappedValue: 'first_job' },
      { id: 'out_career_switch', label: 'Career Switch', description: 'Transition into finance, data analytics, or modern business consulting', mappedValue: 'career_switch' },
      { id: 'out_higher_studies', label: 'Higher Studies Admission', description: 'Prepare for top MBA / Master degrees or international business schools', mappedValue: 'higher_studies' },
      { id: 'out_prof_qualification', label: 'Professional Qualification', description: 'Prepare for CA, CMA, CS, CFA, or ACCA exams with practical project proof', mappedValue: 'professional_qualification' },
      { id: 'out_freelancing', label: 'Freelancing / Independent Practice', description: 'Offer independent bookkeeping, GST returns, financial modeling or client consulting', mappedValue: 'freelancing' },
      { id: 'out_start_business', label: 'Start a Business / Commercial Venture', description: 'Formulate business model, handle ledger economics, and launch an enterprise', mappedValue: 'start_business' },
      { id: 'out_still_exploring', label: 'I am still exploring', description: 'Building general foundational literacy before committing to one path', mappedValue: 'exploring' }
    ]
  },
  {
    id: 'Q3_COMMERCE_TIMELINE',
    title: 'Target Goal Horizon',
    subtitle: 'What timeline are you working with to reach this outcome?',
    type: 'single_select',
    options: [
      { id: 'hor_0_3m', label: '0–3 months', description: 'High-intensity sprint: core Excel/finance skills, resume portfolio, rapid placement targeting', mappedValue: 3 },
      { id: 'hor_3_6m', label: '3–6 months', description: 'Balanced fellowship: solid domain projects, mock interview drills & case study mastery', mappedValue: 6 },
      { id: 'hor_6_12m', label: '6–12 months', description: 'Comprehensive track: multi-tier certifications, auditing frameworks, full-year capstones', mappedValue: 12 },
      { id: 'hor_1_2y', label: '1–2 years', description: 'Long-term foundational mastery alongside college graduation or professional qualification', mappedValue: 24 },
      { id: 'hor_2y_plus', label: 'More than 2 years', description: 'Extended career preparation & multi-year professional roadmap', mappedValue: 36 },
      { id: 'hor_unknown', label: "I don't know yet", description: 'Flexible pacing with dynamic timeline calibration based on weekly progress', mappedValue: 0 }
    ]
  },
  {
    id: 'Q4_COMMERCE_WORK_INTEREST',
    title: 'Core Work Preference',
    subtitle: 'Which kind of daily work sounds most interesting to you?',
    type: 'single_select',
    options: [
      { id: 'work_numbers', label: 'Working with numbers, financial records, and reports', mappedValue: 'financial_reporting' },
      { id: 'work_audit_risk', label: 'Investigating errors, risks, and compliance issues', mappedValue: 'risk_compliance' },
      { id: 'work_data_decisions', label: 'Understanding businesses and making decisions from data', mappedValue: 'data_decisions' },
      { id: 'work_people_clients', label: 'Working with customers, clients, or teams', mappedValue: 'client_facing' },
      { id: 'work_market_research', label: 'Researching markets, companies, and investments', mappedValue: 'investment_research' },
      { id: 'work_processes', label: 'Managing processes and ensuring work gets completed on time', mappedValue: 'operations_management' },
      { id: 'work_building_business', label: 'Building or growing a business venture', mappedValue: 'business_building' },
      { id: 'work_organizational', label: 'Managing people and solving organizational problems', mappedValue: 'organizational_management' }
    ]
  },
  {
    id: 'Q5_COMMERCE_EXPERIENCE',
    title: 'Prior Experience Artifacts',
    subtitle: 'What practical experience do you already have? (Select all that apply)',
    type: 'multi_select',
    options: [
      { id: 'exp_college_assign', label: 'College assignments & coursework', mappedValue: 'college_assignments' },
      { id: 'exp_accounting_proj', label: 'Accounting / Ledger projects', mappedValue: 'accounting_projects' },
      { id: 'exp_excel_proj', label: 'Excel spreadsheets & formula projects', mappedValue: 'excel_projects' },
      { id: 'exp_financial_anal', label: 'Financial analysis / Ratio analysis', mappedValue: 'financial_analysis' },
      { id: 'exp_internship', label: 'Completed an industry internship', mappedValue: 'internship' },
      { id: 'exp_audit_exposure', label: 'Audit exposure / Audit firm training', mappedValue: 'audit_exposure' },
      { id: 'exp_tax_exposure', label: 'Tax exposure (GST / Income Tax filing)', mappedValue: 'tax_exposure' },
      { id: 'exp_banking_exposure', label: 'Banking operations exposure', mappedValue: 'banking_exposure' },
      { id: 'exp_business_proj', label: 'Business case study or annual report review', mappedValue: 'business_project' },
      { id: 'exp_marketing_proj', label: 'Marketing or sales campaign project', mappedValue: 'marketing_project' },
      { id: 'exp_hr_proj', label: 'HR project or payroll simulation', mappedValue: 'hr_project' },
      { id: 'exp_freelance', label: 'Freelance accounting or client work', mappedValue: 'freelance_work' },
      { id: 'exp_family_biz', label: 'Worked in family business / commercial shop', mappedValue: 'family_business' },
      { id: 'exp_part_time', label: 'Part-time professional work', mappedValue: 'part_time_work' },
      { id: 'exp_full_time', label: 'Full-time professional experience', mappedValue: 'full_time_work' },
      { id: 'exp_stock_research', label: 'Stock market / equity research / Demat trading', mappedValue: 'stock_research' },
      { id: 'exp_tally_erp', label: 'Tally / ERP accounting software hands-on', mappedValue: 'tally_erp_experience' },
      { id: 'exp_power_bi', label: 'Power BI / Tableau / Analytics dashboards', mappedValue: 'power_bi_analytics' },
      { id: 'exp_real_client', label: 'Real client or customer exposure', mappedValue: 'real_client_exposure' },
      { id: 'exp_none', label: 'None yet — starting fresh from scratch', mappedValue: 'none' }
    ]
  },
  {
    id: 'Q6_COMMERCE_CAPABILITY',
    title: 'Self-Perceived Capability',
    subtitle: 'How would you describe your current ability in your target commerce area?',
    type: 'single_select',
    options: [
      { id: 'cap_guided_concepts', label: 'I understand basic concepts but need significant guidance', description: 'Know textbook theory; need step-by-step guidance on real Excel/accounting tasks', mappedValue: 'beginner_guided' },
      { id: 'cap_simple_tasks', label: 'I can complete simple tasks with guidance', description: 'Can prepare basic trial balance, journal entries, or clean simple data with mentor help', mappedValue: 'novice_supported' },
      { id: 'cap_normal_indep', label: 'I can handle normal tasks independently', description: 'Comfortable preparing financial statements, bank reconciliations, or standard models solo', mappedValue: 'intermediate_independent' },
      { id: 'cap_unfamiliar_prob', label: 'I can solve unfamiliar problems with limited help', description: 'Can diagnose reconciliation discrepancies, interpret complex GST rules, or build custom models', mappedValue: 'advanced_problem_solver' },
      { id: 'cap_real_world_exp', label: 'I can independently handle real-world work & explain my decisions', description: 'Ready for corporate presentations, audit defenses, and direct client deliverable sign-offs', mappedValue: 'professional_ready' }
    ]
  },
  {
    id: 'Q7_COMMERCE_TOOLS',
    title: 'Tools & Software Proficiency',
    subtitle: 'Which tools have you actually used hands-on? (Select all that apply)',
    type: 'multi_select',
    options: [
      { id: 'tool_ms_excel', label: 'MS Excel (Basic formulas, SUM, AVERAGE, sorting)', mappedValue: 'ms_excel' },
      { id: 'tool_adv_excel', label: 'Advanced Excel (VLOOKUP/XLOOKUP, Pivot Tables, INDEX/MATCH)', mappedValue: 'advanced_excel' },
      { id: 'tool_tally', label: 'Tally / TallyPrime', mappedValue: 'tally' },
      { id: 'tool_erp', label: 'ERP Software (Oracle / Microsoft Dynamics / Odoo)', mappedValue: 'erp_software' },
      { id: 'tool_power_bi', label: 'Power BI', mappedValue: 'power_bi' },
      { id: 'tool_sql', label: 'SQL (SELECT, JOIN, GROUP BY queries)', mappedValue: 'sql' },
      { id: 'tool_python', label: 'Python (Pandas, data analysis)', mappedValue: 'python' },
      { id: 'tool_sap', label: 'SAP (FICO / MM / SD)', mappedValue: 'sap' },
      { id: 'tool_quickbooks', label: 'QuickBooks / Zoho Books / Accounting cloud', mappedValue: 'quickbooks_zoho' },
      { id: 'tool_fin_platforms', label: 'Financial Platforms (Moneycontrol, TradingView, Bloomberg terminal)', mappedValue: 'financial_platforms' },
      { id: 'tool_google_sheets', label: 'Google Sheets (Collaborative workflows)', mappedValue: 'google_sheets' },
      { id: 'tool_canva', label: 'Canva / Presentation Design', mappedValue: 'canva' },
      { id: 'tool_crm', label: 'CRM Systems (HubSpot, Salesforce, Zoho CRM)', mappedValue: 'crm_systems' },
      { id: 'tool_other', label: 'Other specialized software', mappedValue: 'other_tools' },
      { id: 'tool_none', label: 'None yet — starting fresh', mappedValue: 'none' }
    ]
  },
  {
    id: 'Q8_COMMERCE_DAILY_TIME',
    title: 'Daily Time Investment',
    subtitle: 'How much time can you realistically invest each day?',
    type: 'single_select',
    options: [
      { id: 'time_under_30m', label: 'Less than 30 minutes / day', description: 'Micro-learning pace: 1 focused practical exercise / day', mappedValue: 25 },
      { id: 'time_30_60m', label: '30–60 minutes / day', description: 'Steady pace: 1–2 practical quests & case study drills / day', mappedValue: 45 },
      { id: 'time_1_2h', label: '1–2 hours / day', description: 'Recommended core pace: 2–3 hands-on spreadsheet / audit quests', mappedValue: 90 },
      { id: 'time_2_3h', label: '2–3 hours / day', description: 'Accelerated placement pace: comprehensive models & financial analysis', mappedValue: 150 },
      { id: 'time_3h_plus', label: '3+ hours / day', description: 'Full-time immersive track: intensive multi-case portfolio build', mappedValue: 200 }
    ]
  }
];

/* ==========================================================================
   PART B — B.COM / M.COM BEHAVIORAL SJTS (Q9 – Q22: 14 SCENARIOS)
   ========================================================================== */

export const COMMERCE_SJT_INSTRUCTION = 'Choose what you would actually do first. Do not choose the answer that sounds most impressive. There is no "good student" answer.';

export const BCOM_SJT_QUESTIONS: SJTQuestion[] = [
  {
    id: 'Q9_COMMERCE_UNEXPECTED_EXPENSE',
    title: 'Financial Report Unexpected Number',
    scenario: 'You are preparing a monthly business report. One expense item is significantly higher than expected.',
    prompt: 'What do you do first?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q9_comm_ph',
        text: 'Break the figure into its underlying components and investigate which transactions or assumptions explain the change.',
        dimension: 'PH',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q9_comm_ex',
        text: 'Try a quick alternative calculation using another way of grouping the data to see what happens.',
        dimension: 'EX',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q9_comm_st',
        text: 'Check the reporting requirements and systematically reconcile the expense against source vouchers and records.',
        dimension: 'ST',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q9_comm_siq',
        text: 'Ask the person or department responsible for the expense what changed and clarify the business context.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q10_COMMERCE_ACCOUNTS_RECONCILE',
    title: 'Accounts Do Not Reconcile',
    scenario: 'You find that two key financial records (like bank statement and internal cash ledger) do not match.',
    prompt: 'What do you do first?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q10_comm_ex',
        text: 'Test several possible transaction paths or common discrepancies to isolate where the difference appears.',
        dimension: 'EX',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q10_comm_st',
        text: 'Follow the standard reconciliation process step-by-step and verify each required record in sequence.',
        dimension: 'ST',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q10_comm_ph',
        text: 'Trace the discrepancy through the underlying transactions and identify the root cause formula or timing mismatch.',
        dimension: 'PH',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q10_comm_siq',
        text: 'Speak with the team members who entered or approved the transactions to understand what happened on the ground.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q11_COMMERCE_AUDIT_FINDING',
    title: 'Audit Finding Appears',
    scenario: 'During an audit assignment, you notice a large transaction that does not appear consistent with the available supporting documentation.',
    prompt: 'What do you do first?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q11_comm_ph',
        text: 'Examine the transaction, related ledger entries, and accounting assumptions to determine the underlying financial impact.',
        dimension: 'PH',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q11_comm_ex',
        text: 'Check several plausible explanations against the available evidence to see which one fits best.',
        dimension: 'EX',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q11_comm_st',
        text: 'Document the specific variance, verify the required compliance checklist, and follow the standard audit procedure.',
        dimension: 'ST',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q11_comm_siq',
        text: 'Discuss it with the accountant or manager involved to understand the operational context before drawing any conclusions.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q12_COMMERCE_EXCEL_SURPRISE',
    title: 'Excel Analysis Unexpected Result',
    scenario: 'You are analyzing sales and margin data, and your formula produces a summary result that seems mathematically impossible.',
    prompt: 'What do you naturally do first?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q12_comm_ex',
        text: 'Change one variable in the formula or pivot table and test whether the result moves as expected.',
        dimension: 'EX',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q12_comm_ph',
        text: 'Check the mathematical assumptions, formula dependencies, and data relationships behind the calculation.',
        dimension: 'PH',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q12_comm_st',
        text: 'Verify the raw source rows systematically and reproduce the calculation step-by-step from the beginning.',
        dimension: 'ST',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q12_comm_siq',
        text: 'Ask a colleague or business owner how they view the practical reality represented by the sales data.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q13_COMMERCE_AMBIGUOUS_TASK',
    title: 'Manager Gives Ambiguous Task',
    scenario: 'Your finance manager says: "Prepare something useful about our customer financial performance before Friday." No format is specified.',
    prompt: 'What do you do first?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q13_comm_siq',
        text: 'Clarify what specific decision or meeting the manager needs the analysis to support.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q13_comm_ph',
        text: 'Break down the possible performance drivers and determine what financial ratios would answer each one.',
        dimension: 'PH',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q13_comm_ex',
        text: 'Create a quick 1-page sample draft dashboard immediately to get early reactions on what is useful.',
        dimension: 'EX',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q13_comm_st',
        text: 'Define the expected deliverables, timeline milestone checks, and required data sources before starting.',
        dimension: 'ST',
        evidence: 2,
        context: 'scoping'
      }
    ]
  },
  {
    id: 'Q14_COMMERCE_BANK_DATA_PATTERNS',
    title: 'Conflicting Customer Data Patterns',
    scenario: 'You notice that loan default rates across two customer branch segments behave in completely opposite ways.',
    prompt: 'What do you do?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q14_comm_ph',
        text: 'Analyze the underlying economic variables, income tiers, and terms that explain why the two groups differ.',
        dimension: 'PH',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q14_comm_ex',
        text: 'Test several different segmentation criteria to see what new patterns emerge across the cohorts.',
        dimension: 'EX',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q14_comm_st',
        text: 'Create a structured benchmarking template and document the comparison criteria consistently.',
        dimension: 'ST',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q14_comm_siq',
        text: 'Talk with the branch officers who interact directly with customers to understand their local reality.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q15_COMMERCE_TAX_TREATMENT',
    title: 'Tax Treatment Is Unclear',
    scenario: 'You encounter a complex business transaction where the GST/tax classification is not immediately obvious.',
    prompt: 'What do you do first?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q15_comm_ph',
        text: 'Break down the contract terms and identify the underlying legal assumptions that determine taxability.',
        dimension: 'PH',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q15_comm_ex',
        text: 'Check a few plausible interpretations against similar real-world tax rulings and precedent examples.',
        dimension: 'EX',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q15_comm_st',
        text: 'Follow the tax department circulars and checklists, verifying each statutory rule item by item.',
        dimension: 'ST',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q15_comm_siq',
        text: 'Discuss the transaction with a tax senior or consultant who understands how authorities interpret it in practice.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'scoping'
      }
    ]
  },
  {
    id: 'Q16_COMMERCE_INVESTMENT_SIGNALS',
    title: 'Conflicting Investment Signals',
    scenario: 'You are researching a company for an investment pitch, and analyst reports give conflicting Buy/Sell ratings.',
    prompt: 'What do you do?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q16_comm_ph',
        text: 'Compare the valuation models and growth assumptions behind each report to see why their conclusions differ.',
        dimension: 'PH',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q16_comm_ex',
        text: 'Explore alternative upside and downside scenarios to see how sensitive the valuation is to key assumptions.',
        dimension: 'EX',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q16_comm_st',
        text: 'Build a standard evaluation framework with fixed financial metrics (P/E, DCF, Debt/Equity) and score it objectively.',
        dimension: 'ST',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q16_comm_siq',
        text: 'Study the perspectives of industry suppliers, customers, and management commentary to understand market sentiment.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'learning'
      }
    ]
  },
  {
    id: 'Q17_COMMERCE_TEAM_BEHIND',
    title: 'Team Project Falling Behind',
    scenario: 'Your financial case study project is due in four days, but two sections remain untouched and team energy is low.',
    prompt: 'What do you do first?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q17_comm_st',
        text: 'Break the remaining slides into specific tasks, assign clear ownership, and set daily deadlines.',
        dimension: 'ST',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q17_comm_siq',
        text: 'Call a quick check-in with the team to understand what is blocking them and re-align our morale.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q17_comm_ph',
        text: 'Identify which calculations and slides are critical dependencies and eliminate non-essential work.',
        dimension: 'PH',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q17_comm_ex',
        text: 'Propose a simpler way to present the financial charts so we can finish the hardest part in half the time.',
        dimension: 'EX',
        evidence: 2,
        context: 'delivery'
      }
    ]
  },
  {
    id: 'Q18_COMMERCE_CHALLENGED_NUMBERS',
    title: 'Presentation Numbers Challenged',
    scenario: 'During your presentation, an executive interrupts: "I don\'t think your gross margin calculation supports this conclusion."',
    prompt: 'What do you do?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q18_comm_siq',
        text: 'Ask which part of the conclusion concerns them most and listen carefully to understand their perspective.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q18_comm_ph',
        text: 'Walk through the exact mathematical assumptions and formula bridging the gross margin data to the conclusion.',
        dimension: 'PH',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q18_comm_ex',
        text: 'Quickly adjust the margin assumption on screen to show how the strategic recommendation holds up.',
        dimension: 'EX',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q18_comm_st',
        text: 'Refer back to the approved accounting standards and verified ledger figures from which the numbers were drawn.',
        dimension: 'ST',
        evidence: 2,
        context: 'feedback'
      }
    ]
  },
  {
    id: 'Q19_COMMERCE_FALLING_PROFITS',
    title: 'Falling Profits Investigation',
    scenario: 'A company asks: "Why are our quarterly net profits falling despite rising revenues?" You have raw operational data.',
    prompt: 'What do you do first?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q19_comm_ph',
        text: 'Decompose net profit into margin drivers (COGS, operating overheads, finance cost) and inspect cost ratios.',
        dimension: 'PH',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q19_comm_ex',
        text: 'Run quick comparative tests on recent product discounts and marketing spends to see what jumps out.',
        dimension: 'EX',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q19_comm_st',
        text: 'Establish a structured diagnostic checklist and work through revenue leakage categories systematically.',
        dimension: 'ST',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q19_comm_siq',
        text: 'Interview sales, procurement, and warehouse heads to find out what practical changes occurred recently.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'scoping'
      }
    ]
  },
  {
    id: 'Q20_COMMERCE_DASHBOARD_CONFLICT',
    title: 'Report vs Customer Feedback Conflict',
    scenario: 'The internal financial dashboard shows customer satisfaction and retention are high, but client complaints have tripled.',
    prompt: 'What do you do?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q20_comm_ph',
        text: 'Investigate how the retention metric is calculated and identify data lags or flaws that mask the dissatisfaction.',
        dimension: 'PH',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q20_comm_ex',
        text: 'Pull an alternative customer segment sample to test whether the issue is isolated to a new product line.',
        dimension: 'EX',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q20_comm_st',
        text: 'Audit the data collection pipeline and verify that all customer feedback channels feed into the report properly.',
        dimension: 'ST',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q20_comm_siq',
        text: 'Meet directly with customer support agents and read recent complaint transcripts to hear the direct human story.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q21_COMMERCE_GROUP_DIFFERENT_IDEAS',
    title: 'Conflicting Team Approaches',
    scenario: 'In a business simulation competition, four team members strongly advocate four different pricing and growth strategies.',
    prompt: 'What do you do?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q21_comm_ph',
        text: 'Compare the unit economics and underlying assumptions of each proposal side-by-side.',
        dimension: 'PH',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q21_comm_ex',
        text: 'Propose running a quick small-scale pilot or simulation of the top two ideas to compare real outcomes.',
        dimension: 'EX',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q21_comm_st',
        text: 'Agree on a structured evaluation matrix with clear scoring criteria that the team can execute objectively.',
        dimension: 'ST',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q21_comm_siq',
        text: 'Facilitate an open discussion to ensure everyone\'s priorities and concerns are genuinely heard before deciding.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'collaboration'
      }
    ]
  },
  {
    id: 'Q22_COMMERCE_INCOMPLETE_DATA',
    title: 'Incomplete Business Data Before Deadline',
    scenario: 'You have to submit a corporate valuation model tomorrow morning, but several supplier cost figures have not arrived.',
    prompt: 'What do you do first?',
    instruction: COMMERCE_SJT_INSTRUCTION,
    options: [
      {
        id: 'q22_comm_ph',
        text: 'Estimate the missing numbers based on historical industry averages and evaluate how sensitive the valuation is.',
        dimension: 'PH',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q22_comm_ex',
        text: 'Create a working model with placeholder assumptions immediately and adjust them as new inputs arrive.',
        dimension: 'EX',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q22_comm_st',
        text: 'Document every assumed number clearly, create an audit note, and complete the model using a standard process.',
        dimension: 'ST',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q22_comm_siq',
        text: 'Contact the supplier manager right away to negotiate an urgent partial estimate of the critical numbers.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'delivery'
      }
    ]
  }
];

/* ==========================================================================
   PART C — B.COM / M.COM FREQUENCY MATRIX (M1 – M4)
   Scale: 1 = Almost never, 2 = Rarely, 3 = Sometimes, 4 = Often, 5 = Almost always
   ========================================================================== */

export const BCOM_MATRIX_SCENARIOS: MatrixScenario[] = [
  {
    id: 'M1_COMMERCE_FINANCIAL_ANALYSIS',
    title: 'Financial Analysis Habit',
    scenario: 'You are given a complex financial spreadsheet and asked to explain an unexpected quarterly variation.',
    context: 'debugging',
    items: [
      { id: 'm1_comm_ph', dimension: 'PH', statement: 'I break the figures into underlying revenue/cost drivers before concluding what happened.' },
      { id: 'm1_comm_ex', dimension: 'EX', statement: 'I test different calculations or views of the data to see what reveals the pattern.' },
      { id: 'm1_comm_st', dimension: 'ST', statement: 'I follow a consistent, step-by-step checklist for verifying ledger entries and totals.' },
      { id: 'm1_comm_siq', dimension: 'SIQ', statement: 'I seek operational context from the business managers working behind the numbers.' }
    ]
  },
  {
    id: 'M2_COMMERCE_AUDIT_COMPLIANCE',
    title: 'Audit & Compliance Habit',
    scenario: 'You discover an accounting record or expense voucher that does not match expected tax rules.',
    context: 'uncertainty',
    items: [
      { id: 'm2_comm_ph', dimension: 'PH', statement: 'I trace the transaction through supporting contracts to understand the root cause.' },
      { id: 'm2_comm_ex', dimension: 'EX', statement: 'I test different plausible interpretations against available evidence.' },
      { id: 'm2_comm_st', dimension: 'ST', statement: 'I document the variance formally and follow standard compliance protocols.' },
      { id: 'm2_comm_siq', dimension: 'SIQ', statement: 'I talk with the person who authorized the voucher to understand their operational context.' }
    ]
  },
  {
    id: 'M3_COMMERCE_BUSINESS_DECISION',
    title: 'Business Decision Habit',
    scenario: 'You need to recommend a pricing or budget decision when some market information is missing.',
    context: 'scoping',
    items: [
      { id: 'm3_comm_ph', dimension: 'PH', statement: 'I identify the economic variables that could materially change the profit outcome.' },
      { id: 'm3_comm_ex', dimension: 'EX', statement: 'I model and compare multiple quick scenarios before finalizing an opinion.' },
      { id: 'm3_comm_st', dimension: 'ST', statement: 'I define clear decision criteria and evaluate our options systematically.' },
      { id: 'm3_comm_siq', dimension: 'SIQ', statement: 'I consider how different stakeholders (clients, employees, partners) will be affected.' }
    ]
  },
  {
    id: 'M4_COMMERCE_TEAM_EXECUTION',
    title: 'Team Project Delivery Habit',
    scenario: 'You are responsible for delivering a commerce group presentation on an upcoming deadline.',
    context: 'delivery',
    items: [
      { id: 'm4_comm_ph', dimension: 'PH', statement: 'I identify technical bottlenecks and key presentation dependencies early.' },
      { id: 'm4_comm_ex', dimension: 'EX', statement: 'I look for ways to simplify the slide design or try innovative formats.' },
      { id: 'm4_comm_st', dimension: 'ST', statement: 'I track task checklists and make sure every member delivers on time.' },
      { id: 'm4_comm_siq', dimension: 'SIQ', statement: 'I keep team communication open and ensure everyone feels heard and supported.' }
    ]
  }
];

/* ==========================================================================
   PART D — B.COM / M.COM TRADE-OFF PROBES (Q23 – Q26)
   ========================================================================== */

export const BCOM_TRADEOFF_PROBES: TradeoffProbe[] = [
  {
    id: 'Q23_COMMERCE_ACCURACY_VS_DEADLINE',
    title: 'Accuracy vs Submission Deadline',
    scenario: 'You have 30 minutes left before a client financial report must be sent. The analysis is 95% complete, but a small discrepancy remains unverified.',
    prompt: 'What do you naturally prefer?',
    tradeoffType: 'depth_vs_speed',
    options: [
      {
        id: 't23_comm_depth',
        text: 'Spend the remaining time investigating the discrepancy to ensure mathematical perfection, even if delivery is at the deadline wire.',
        pole: 'analytical_depth',
        dimensionAffinity: 'PH'
      },
      {
        id: 't23_comm_speed',
        text: 'Perform a high-level sanity check, add an explanatory footnote for the small item, and submit the clean report on time.',
        pole: 'fast_progress',
        dimensionAffinity: 'ST'
      }
    ]
  },
  {
    id: 'Q24_COMMERCE_RESEARCH_VS_DECISION',
    title: 'Research vs Decision Time',
    scenario: 'You are evaluating two marketing investment proposals. You could spend another 2 days researching competitor pricing or decide now with current data.',
    prompt: 'What is your natural instinct?',
    tradeoffType: 'explore_vs_finish',
    options: [
      {
        id: 't24_comm_explore',
        text: 'Keep researching further because an important assumption about competitor reaction may still be unverified.',
        pole: 'exploration',
        dimensionAffinity: 'PH'
      },
      {
        id: 't24_comm_execute',
        text: 'Make the decision now based on current available evidence and adjust our plan as live market results come in.',
        pole: 'execution',
        dimensionAffinity: 'ST'
      }
    ]
  },
  {
    id: 'Q25_COMMERCE_SOLO_VS_CONSULT',
    title: 'Independent Investigation vs Early Consultation',
    scenario: 'You are stuck while building a discounted cash flow (DCF) model because terminal growth formulas produce an erratic valuation.',
    prompt: 'What do you do first?',
    tradeoffType: 'solo_vs_consult',
    options: [
      {
        id: 't25_comm_solo',
        text: 'Keep digging into finance textbooks, formulas, and spreadsheet cells independently until I master the mechanics myself.',
        pole: 'independent_investigation',
        dimensionAffinity: 'PH'
      },
      {
        id: 't25_comm_consult',
        text: 'Reach out to a finance mentor or senior after 10 minutes so I can understand the industry convention and keep moving.',
        pole: 'perspective_coordination',
        dimensionAffinity: 'SIQ'
      }
    ]
  },
  {
    id: 'Q26_COMMERCE_PLAN_VS_ADAPT',
    title: 'Structured Plan vs Live Adaptability',
    scenario: 'Halfway through an audit review, a new company policy is released that alters how inventory valuations are calculated.',
    prompt: 'How do you naturally respond?',
    tradeoffType: 'plan_vs_adapt',
    options: [
      {
        id: 't26_comm_plan',
        text: 'Formally assess the scope impact, update our audit timetable, and execute the revised procedure systematically.',
        pole: 'structured_plan',
        dimensionAffinity: 'ST'
      },
      {
        id: 't26_comm_adapt',
        text: 'Immediately pivot our testing approach, explore sample adjustments, and adapt flexibly to the new policy.',
        pole: 'adaptive_pivot',
        dimensionAffinity: 'EX'
      }
    ]
  }
];

/* ==========================================================================
   PART E — SPECIALIZATION QUESTIONS (BRANCH BASED ON Q1 CAREER GOAL)
   ========================================================================== */

export interface SpecializationQuestion {
  domainId: string;
  questionId: string;
  title: string;
  subtitle: string;
  options: {
    id: string;
    label: string;
    description?: string;
    affinityDimension?: BehavioralDimension;
  }[];
}

export const COMMERCE_SPECIALIZATION_QUESTIONS: Record<string, SpecializationQuestion> = {
  accounting_finance: {
    domainId: 'accounting_finance',
    questionId: 'Q27_A_ACCOUNTING_FINANCE',
    title: 'Accounting & Finance Specialization',
    subtitle: 'Which specific task would you most like to become highly capable at?',
    options: [
      { id: 'spec_af_statements', label: 'Preparing and interpreting complex financial statements' },
      { id: 'spec_af_modelling', label: 'Financial modeling, ratio analysis, and cash flow forecasting' },
      { id: 'spec_af_systems', label: 'Accounting systems, ERP integration, and ledger workflows' },
      { id: 'spec_af_valuation', label: 'Corporate investment, valuation, and M&A advisory' },
      { id: 'spec_af_controls', label: 'Financial reporting, internal controls, and compliance' },
      { id: 'spec_af_unsure', label: 'I am still exploring various finance specializations' }
    ]
  },
  audit_taxation: {
    domainId: 'audit_taxation',
    questionId: 'Q27_B_AUDIT_TAX',
    title: 'Audit & Taxation Focus',
    subtitle: 'Which type of audit and tax work interests you most?',
    options: [
      { id: 'spec_at_inconsistency', label: 'Finding discrepancies, ledger errors, and statutory variances' },
      { id: 'spec_at_regulations', label: 'Mastering tax laws, GST circulars, and regulatory compliance' },
      { id: 'spec_at_risk', label: 'Corporate risk assessment and financial vulnerability audits' },
      { id: 'spec_at_tax_planning', label: 'Corporate tax planning, structuring, and advisory' },
      { id: 'spec_at_governance', label: 'Internal control frameworks and corporate governance' },
      { id: 'spec_at_unsure', label: 'I am still exploring audit and tax opportunities' }
    ]
  },
  banking_services: {
    domainId: 'banking_services',
    questionId: 'Q27_C_BANKING',
    title: 'Banking & Financial Services Focus',
    subtitle: 'Which banking domain activity interests you most?',
    options: [
      { id: 'spec_bk_credit', label: 'Credit appraisal and loan risk analysis' },
      { id: 'spec_bk_products', label: 'Designing and managing retail/commercial financial products' },
      { id: 'spec_bk_client_rel', label: 'Corporate relationship banking and high-value client advisory' },
      { id: 'spec_bk_risk', label: 'Liquidity, treasury, and market risk management' },
      { id: 'spec_bk_wealth', label: 'Wealth management and private portfolio advisory' },
      { id: 'spec_bk_operations', label: 'Banking operations, clearing processes, and fintech systems' },
      { id: 'spec_bk_unsure', label: 'I am still exploring the banking sector' }
    ]
  },
  business_analytics: {
    domainId: 'business_analytics',
    questionId: 'Q27_D_ANALYTICS',
    title: 'Business Analytics Focus',
    subtitle: 'Which analytical activity sounds most compelling?',
    options: [
      { id: 'spec_ba_patterns', label: 'Finding hidden profitability patterns in customer & sales data' },
      { id: 'spec_ba_dashboards', label: 'Building interactive executive dashboards in Power BI / Tableau' },
      { id: 'spec_ba_predictive', label: 'Predicting customer churn, demand, and business outcomes' },
      { id: 'spec_ba_metrics', label: 'Explaining root causes behind why key business metrics moved' },
      { id: 'spec_ba_management', label: 'Translating complex data models into strategic management decisions' },
      { id: 'spec_ba_unsure', label: 'I am still exploring analytics applications' }
    ]
  },
  human_resources: {
    domainId: 'human_resources',
    questionId: 'Q27_E_HR_MGMT',
    title: 'Human Resources & People Operations',
    subtitle: 'Which organizational area interests you most?',
    options: [
      { id: 'spec_hr_talent', label: 'Talent acquisition, recruitment strategies, and interview design' },
      { id: 'spec_hr_processes', label: 'Optimizing HR operations, payroll, and statutory employee compliance' },
      { id: 'spec_hr_culture', label: 'Employee engagement, workplace culture, and conflict resolution' },
      { id: 'spec_hr_performance', label: 'Performance management, appraisal frameworks, and KPIs' },
      { id: 'spec_hr_ld', label: 'Corporate training, skill development, and executive coaching' },
      { id: 'spec_hr_unsure', label: 'I am still exploring human resources paths' }
    ]
  },
  marketing_sales: {
    domainId: 'marketing_sales',
    questionId: 'Q27_F_MARKETING',
    title: 'Marketing & Sales Growth Focus',
    subtitle: 'Which commercial growth challenge would you most like to tackle?',
    options: [
      { id: 'spec_mk_consumer', label: 'Understanding consumer psychology and why customers buy' },
      { id: 'spec_mk_funnel', label: 'Designing acquisition funnels and driving measurable sales growth' },
      { id: 'spec_mk_retention', label: 'Improving customer loyalty, retention, and lifetime value (LTV)' },
      { id: 'spec_mk_campaigns', label: 'Measuring marketing ROI and digital campaign performance' },
      { id: 'spec_mk_brand', label: 'Brand positioning, storytelling, and market communications' },
      { id: 'spec_mk_unsure', label: 'I am still exploring marketing and commercial channels' }
    ]
  },
  entrepreneurship: {
    domainId: 'entrepreneurship',
    questionId: 'Q27_G_ENTREPRENEURSHIP',
    title: 'Entrepreneurship & Business Building',
    subtitle: 'You have a business idea. What would you most naturally want to investigate first?',
    options: [
      { id: 'spec_ent_customers', label: 'Validate whether real customers actually have the problem (Social IQ / Market Need)', affinityDimension: 'SIQ' },
      { id: 'spec_ent_economics', label: 'Calculate the unit economics, margins, and financial break-even (Pattern Hunter / Economics)', affinityDimension: 'PH' },
      { id: 'spec_ent_prototype', label: 'Build a small quick prototype or MVP and test it live (Explorer / Experimentation)', affinityDimension: 'EX' },
      { id: 'spec_ent_operations', label: 'Create a structured operational plan for launching and delivering it (Stabilizer / Execution)', affinityDimension: 'ST' }
    ]
  }
};
