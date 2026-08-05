import { CourseQuest } from './coursesData';

// Helper function to generate all 146 Finance & Investment Management Quests cleanly
function generate146FinanceQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'fin-day1-q1',
    title: 'Day 1 - Quest 1: Introduction to Finance & Core Definitions',
    desc: 'Understand what finance is, why money management matters, and the key differences between Personal and Business Finance.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['What is Finance?', 'Why Finance Matters', 'Personal vs Business Finance', 'Financial System Overview'],
    hint: 'Finance is the art and science of managing monetary resources efficiently over time.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'fin-day1-q2',
    title: 'Day 1 - Quest 2: Money & Financial Goals',
    desc: 'Explore Needs vs Wants, saving habits, disciplined spending, wealth creation through investing, and long-term financial planning.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Needs vs Wants', 'Budgeting & Saving Rules', 'Investing & Compounding', 'Financial Life Goals'],
    hint: 'Differentiating needs from wants is the foundational step of building financial security.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'fin-day1-q3',
    title: 'Day 1 - Quest 3: The Financial Ecosystem',
    desc: 'Understand the interconnected roles of Individuals, Businesses, Commercial Banks, Investors, and Governments in capital markets.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Individuals & Households', 'Business Corporations', 'Banking Institutions', 'Governments & Regulators'],
    hint: 'Banks act as financial intermediaries moving capital from surplus units (savers) to deficit units (borrowers).',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'fin-day2-q1',
    title: 'Day 2 - Quest 1: Business Money Flow',
    desc: 'Master the core flow of cash: Revenue generation, operating expenses, profit margins, losses, and free cash flow.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Revenue Channels', 'Operating & Fixed Costs', 'Gross vs Net Profit', 'Cash Flow vs Accounting Profit'],
    hint: 'Profit is an accounting measure, whereas cash flow is the liquid lifeblood keeping operations afloat.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'fin-day2-q2',
    title: 'Day 2 - Quest 2: Types of Business Finance',
    desc: 'Differentiate between Owner Capital, Bank Loans, Equity Capital, Debt Financing, and Internal Retained Earnings.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Equity vs Debt', 'Retained Earnings', 'Short-term vs Long-term Financing', 'Capital Cost Implications'],
    hint: 'Equity gives away ownership share without mandatory repayments; debt requires fixed interest payments.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'fin-day2-q3',
    title: 'Day 2 - Quest 3: Introduction to Financial Decisions',
    desc: 'Learn why businesses borrow funds, why companies make capital investments, financial risk assessment, and market opportunities.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Borrowing vs Dilution', 'Capital Allocation', 'Financial Risk Types', 'Return Expectations'],
    hint: 'Every financial decision balances expected return against associated risk.',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - Financial Statements', topics: ['Assets, Liabilities & Equity', 'Revenue & Profit Drivers', 'Cash vs Accounting Profit'] },
    4: { moduleName: 'Module 1 - Financial Objectives', topics: ['Business Financial Goals', 'Corporate Financial Planning', 'Business Lifecycle & Valuation'] },
    5: { moduleName: 'Module 2 - Time Value Concepts', topics: ['Importance of Time Value of Money', 'Simple Interest Math', 'Compound Interest Mechanics'] },
    6: { moduleName: 'Module 2 - Compounding & Inflation', topics: ['Compounding Frequencies (Annual vs Monthly)', 'Inflation & Purchasing Power Erosion', 'Real vs Nominal Interest Rates'] },
    7: { moduleName: 'Module 3 - Present & Future Value', topics: ['Future Value (FV) Formula', 'Present Value (PV) Discounting', 'Annuity Cash Flows'] },
    8: { moduleName: 'Module 2 - Discounting & Growth', topics: ['Discount Factors', 'Rule of 72 for Compounding', 'Wealth Accumulation Models'] },
    9: { moduleName: 'Module 3 - Budgeting Basics', topics: ['Personal Household Budgeting (50/30/20)', 'Corporate Master Budgeting', 'Operating & Revenue Budgets'] },
    10: { moduleName: 'Module 3 - Cash & Capital Budgets', topics: ['Cash Inflow & Outflow Forecasting', 'Capital Spending Budgets', 'Working Capital Requirements'] },
    11: { moduleName: 'Module 3 - Financial Forecasting', topics: ['Sales & Expense Projections', 'Rolling Forecasts', 'Scenario Planning'] },
    12: { moduleName: 'Module 3 - Variance Analysis', topics: ['Actual vs Budget Comparison', 'Favorable & Unfavorable Variances', 'Budget Control Action Plans'] },
    13: { moduleName: 'Module 4 - Cost Classification', topics: ['Fixed vs Variable Costs', 'Direct vs Indirect Expenses', 'Cost Allocation Methods'] },
    14: { moduleName: 'Module 4 - Break-Even Analysis', topics: ['Contribution Margin Ratio', 'Break-Even Point (BEP) in Units & Currency', 'Margin of Safety'] },
    15: { moduleName: 'Module 4 - Profit Planning', topics: ['Target Profit Volume Math', 'Cost-Volume-Profit (CVP) Analysis', 'Pricing Strategies'] },
    16: { moduleName: 'Module 4 - Cost Control', topics: ['Cost Reduction vs Cost Control', 'Operational Efficiency', 'Standard Costing'] },
    17: { moduleName: 'Module 5 - Capital Structure', topics: ['Debt-to-Equity Ratio', 'Weighted Average Cost of Capital (WACC)', 'Financial Leverage'] },
    18: { moduleName: 'Module 5 - Sources of Finance', topics: ['Venture Capital & Angel Investing', 'Bank Term Loans & Debentures', 'Commercial Paper & Working Capital Loans'] },
    19: { moduleName: 'Module 5 - Capital Budgeting', topics: ['Net Present Value (NPV) Decision Rule', 'Internal Rate of Return (IRR)', 'Payback Period Evaluation'] },
    20: { moduleName: 'Module 5 - Dividend & Financial Strategy', topics: ['Dividend Payout vs Retention', 'Financial Strategy Alignment', 'Corporate Value Maximization'] },
    21: { moduleName: 'Module 6 - Investment Fundamentals', topics: ['Why Invest (Beating Inflation)', 'Risk vs Return Spectrum', 'Asset Class Characteristics'] },
    22: { moduleName: 'Module 6 - Stocks & Bonds', topics: ['Equity Stock Investing', 'Fixed Income Bonds & Yields', 'Corporate & Government Securities'] },
    23: { moduleName: 'Module 6 - Funds & SIP Compounding', topics: ['Mutual Funds & Index ETFs', 'Systematic Investment Plan (SIP)', 'Gold & Fixed Deposits'] },
    24: { moduleName: 'Module 6 - Portfolio Diversification', topics: ['Asset Allocation Strategies', 'Unsystematic vs Systematic Risk', 'Rebalancing Investment Portfolios'] },
    25: { moduleName: 'Module 7 - Banking Architecture', topics: ['Reserve Bank of India (RBI) Role', 'Commercial Banking & Lending', 'Credit Scores & CIBIL Analysis'] },
    26: { moduleName: 'Module 7 - Digital Payments & Loans', topics: ['Digital Payment Infrastructure (UPI/IMPS)', 'Business & Personal Loan Products', 'Collateral & Interest Rate Types'] },
    27: { moduleName: 'Module 7 - Capital Markets & IPO', topics: ['Primary Market & IPO Process', 'Secondary Market & Stock Exchanges (NSE/BSE)', 'Market Indices (Nifty 50 & Sensex)'] },
    28: { moduleName: 'Module 8 - FinTech & Automation', topics: ['FinTech Ecosystem Overview', 'Payment Gateways & Neobanks', 'Robo-Advisors & AI Wealth Management'] },
    29: { moduleName: 'Module 8 - Modern Financial Security', topics: ['Blockchain & Smart Contracts in Finance', 'Financial Fraud & Cybersecurity', 'Automation in Corporate Financial Workflows'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['Financial Calculations', 'Capital Analysis', 'Investment Evaluation'] };

    // Teaching 1
    quests.push({
      id: `fin-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `In-depth breakdown of ${info.topics[0]} with real-world corporate & personal finance applications.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Theoretical Definitions', 'Practical Financial Applications'],
      hint: `Pay attention to how ${info.topics[0]} affects long-term capital growth and risk.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `fin-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed examination of ${info.topics[1]} and computational decision-making tools.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Formulae & Calculations', 'Case Study Execution'],
      hint: `Understand the step-by-step mathematical model for ${info.topics[1]}.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `fin-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and financial risk optimization.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Regulatory Framework', 'Best Practices'],
      hint: `Consider risk mitigation strategies when evaluating ${info.topics[2]}.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive JS financial solver / budgeting / yield calculation)
    quests.push({
      id: `fin-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Financial Assignment - ${info.topics[0]}`,
      desc: `Solve practical business finance problems by writing financial calculation functions.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function solveFinanceDay${day}(principal, rate, time) {\n  // Write financial calculation code here\n  return principal * Math.pow(1 + rate, time);\n}`,
      testSuite: `if (typeof solveFinanceDay${day} !== 'function') throw new Error('Method solveFinanceDay${day} missing');`,
      hint: `Use standard financial formulas (e.g., FV = PV * (1+r)^t) to return accurate figures.`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical Assessment)
    quests.push({
      id: `fin-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily Financial Mastery Exam - ${info.moduleName}`,
      desc: `Evaluates speed and accuracy on ${info.moduleName} under timed exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function validateFinanceExamDay${day}(answers) {\n  // Evaluate financial analysis answers\n  return true;\n}`,
      testSuite: `if (typeof validateFinanceExamDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Double check interest rate conversions and compounding periods before submitting.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Integrated Finance Capstone (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'fin-day30-q1',
    title: 'Day 30 - Quest 1: Business Financial Planning Synthesis',
    desc: 'Unify Revenue forecasting, Master Budget preparation, Cost structures, Net Profit calculation, and Cash Flow projection.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Full Enterprise Budgeting Sync', 'Cash Flow vs Income Statement Alignment', 'Strategic Financial Roadmapping'],
    hint: 'Cash flow timing must ensure solvency during high-growth expenditure phases.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'fin-day30-q2',
    title: 'Day 30 - Quest 2: Investment Decision-Making Synthesis',
    desc: 'Evaluate Risk vs Return tradeoffs, Capital Asset Pricing, Asset Allocation, and Portfolio Diversification.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['CAPM & Risk Premium', 'Optimal Asset Mix (Debt vs Equity)', 'Portfolio Yield Optimization'],
    hint: 'Diversification reduces unsystematic risk without sacrificing portfolio expected returns.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'fin-day30-q3',
    title: 'Day 30 - Quest 3: Modern Financial Management & Strategy',
    desc: 'Combine commercial banking solutions, capital market instruments, FinTech automation, and AI robo-advisory tools.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Corporate Financial Strategy', 'FinTech & AI Integration', 'Executive Value Creation'],
    hint: 'Modern financial managers leverage AI tools for real-time risk monitoring and automated treasury operations.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Comprehensive Enterprise Financial Plan
  quests.push({
    id: 'fin-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Small Business Complete Financial Plan',
    desc: 'Prepare a complete financial plan for a small enterprise: startup capital estimation, budget, cost analysis, cash flow projection, financing source selection, and surplus investment allocation.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function prepareEnterpriseFinancialPlan(startupData) {\n  // 1. Calculate Startup Capital & Operating Budget\n  // 2. Compute Break-Even Point & Cash Flow Projections\n  // 3. Recommend Debt/Equity Ratio & Surplus Investment Plan\n  return {\n    startupCapitalNeeded: 500000,\n    breakEvenUnits: 1250,\n    netCashFlowYear1: 180000,\n    recommendedFinancing: "60% Equity / 40% Term Loan",\n    surplusAllocation: "70% Liquid Funds / 30% Equity Index"\n  };\n}`,
    testSuite: `if (typeof prepareEnterpriseFinancialPlan !== 'function') throw new Error('Capstone financial planner missing');\nconst plan = prepareEnterpriseFinancialPlan({});\nif (!plan.startupCapitalNeeded || !plan.recommendedFinancing) throw new Error('Financial plan incomplete');`,
    hint: `Ensure financing mix balances cost of debt (WACC) with financial solvency!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional Finance Assessment
  quests.push({
    id: 'fin-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - Business Finance & Investment Management',
    desc: 'Mastery certification assessment covering Foundations of Finance, Time Value of Money, Budgeting, Cost Management, Corporate Finance, Investment Management, Banking, Financial Markets & FinTech.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalFinanceCertificationExam(answers) {\n  // Validate comprehensive 90-minute financial management exam\n  return {\n    scorePct: 96,\n    passed: true,\n    certificationTitle: "Certified Business Finance & Investment Specialist"\n  };\n}`,
    testSuite: `if (typeof executeFinalFinanceCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalRes = executeFinalFinanceCertificationExam({});\nif (!evalRes.passed) throw new Error('Certification evaluation failed');`,
    hint: `Review all 8 financial modules before starting the final certification evaluation.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_FINANCE_30_DAYS_QUESTS: CourseQuest[] = generate146FinanceQuests();
