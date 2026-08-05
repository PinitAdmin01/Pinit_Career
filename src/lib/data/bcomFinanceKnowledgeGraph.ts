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

export const BCOM_FINANCE_KNOWLEDGE_GRAPH: KnowledgeModule[] = [
  {
    id: 'fin-mod-1',
    title: 'Module 1 — Foundations of Finance',
    daysRange: 'Days 1–4',
    learningGoal: 'Build a strong intuitive model of what finance is, personal vs business finance, cash flow, and financial decision-making before calculations.',
    topics: [
      {
        id: 'fin-topic-1-1',
        title: 'Introduction to Finance & Ecosystem',
        concepts: [
          {
            id: 'fin-concept-1-1-1',
            title: 'Finance & Financial Goals',
            description: 'Definition of finance, needs vs wants, saving, spending, and investing fundamentals.',
            objectives: [
              {
                id: 'fin-obj-1-1-1-a',
                statement: 'Distinguish personal finance from corporate finance and set financial planning goals.',
                questIds: ['fin-day1-q1', 'fin-day1-q2', 'fin-day1-q3']
              }
            ]
          },
          {
            id: 'fin-concept-1-1-2',
            title: 'Business Money Flow & Capital Types',
            description: 'Revenue, expenses, profit, loss, cash flow, debt vs equity, and financial decision-making.',
            objectives: [
              {
                id: 'fin-obj-1-1-2-a',
                statement: 'Analyze business capital structures and borrowing vs investing decisions.',
                questIds: ['fin-day2-q1', 'fin-day2-q2', 'fin-day2-q3']
              }
            ]
          }
        ]
      },
      {
        id: 'fin-topic-1-2',
        title: 'Financial Statements Overview & Value Creation',
        concepts: [
          {
            id: 'fin-concept-1-2-1',
            title: 'Assets, Liabilities & Profitability',
            description: 'Understanding Balance Sheet components, revenue generation, and Cash vs Profit distinction.',
            objectives: [
              {
                id: 'fin-obj-1-2-1-a',
                statement: 'Evaluate a business position by analyzing assets, liabilities, and profitability.',
                questIds: ['fin-day3-q1', 'fin-day3-q2', 'fin-day3-q3', 'fin-day3-q4', 'fin-day3-q5']
              }
            ]
          },
          {
            id: 'fin-concept-1-2-2',
            title: 'Financial Planning & Business Lifecycle',
            description: 'Stakeholder goals, financial objectives, business value drivers, and growth cycles.',
            objectives: [
              {
                id: 'fin-obj-1-2-2-a',
                statement: 'Formulate financial strategies across different business growth stages.',
                questIds: ['fin-day4-q1', 'fin-day4-q2', 'fin-day4-q3', 'fin-day4-q4', 'fin-day4-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fin-mod-2',
    title: 'Module 2 — Time Value of Money',
    daysRange: 'Days 5–8',
    learningGoal: 'Master Simple Interest, Compound Interest, Present Value (PV), Future Value (FV), Inflation, Discounting, and purchasing power math.',
    topics: [
      {
        id: 'fin-topic-2-1',
        title: 'Interest & Compounding Mechanics',
        concepts: [
          {
            id: 'fin-concept-2-1-1',
            title: 'Simple vs Compound Interest',
            description: 'Mathematics of interest rates, compounding frequency, and wealth acceleration.',
            objectives: [
              {
                id: 'fin-obj-2-1-1-a',
                statement: 'Calculate future values of investments using compound interest formulas.',
                questIds: ['fin-day5-q1', 'fin-day5-q2', 'fin-day5-q3', 'fin-day5-q4', 'fin-day5-q5', 'fin-day6-q1', 'fin-day6-q2', 'fin-day6-q3', 'fin-day6-q4', 'fin-day6-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'fin-topic-2-2',
        title: 'Present Value & Inflation Discounting',
        concepts: [
          {
            id: 'fin-concept-2-2-1',
            title: 'Discounting & Real Purchasing Power',
            description: 'Present Value formulas, inflation-adjusted returns, and cash flow discounting.',
            objectives: [
              {
                id: 'fin-obj-2-2-1-a',
                statement: 'Discount future cash flows to evaluate real net worth and inflation erosion.',
                questIds: ['fin-day7-q1', 'fin-day7-q2', 'fin-day7-q3', 'fin-day7-q4', 'fin-day7-q5', 'fin-day8-q1', 'fin-day8-q2', 'fin-day8-q3', 'fin-day8-q4', 'fin-day8-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fin-mod-3',
    title: 'Module 3 — Budgeting & Financial Planning',
    daysRange: 'Days 9–12',
    learningGoal: 'Construct personal budgets, cash budgets, operating budgets, capital budgets, forecasting models, and variance analysis.',
    topics: [
      {
        id: 'fin-topic-3-1',
        title: 'Personal & Business Budgeting',
        concepts: [
          {
            id: 'fin-concept-3-1-1',
            title: 'Operating & Cash Budgets',
            description: 'Formulating cash inflow/outflow projections, operating budgets, and capital spending.',
            objectives: [
              {
                id: 'fin-obj-3-1-1-a',
                statement: 'Design operating budgets and project monthly cash flows for enterprises.',
                questIds: ['fin-day9-q1', 'fin-day9-q2', 'fin-day9-q3', 'fin-day9-q4', 'fin-day9-q5', 'fin-day10-q1', 'fin-day10-q2', 'fin-day10-q3', 'fin-day10-q4', 'fin-day10-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'fin-topic-3-2',
        title: 'Forecasting & Variance Analysis',
        concepts: [
          {
            id: 'fin-concept-3-2-1',
            title: 'Budget Variance & Control',
            description: 'Comparing actual vs budgeted figures, identifying favorable/unfavorable variances, and corrective planning.',
            objectives: [
              {
                id: 'fin-obj-3-2-1-a',
                statement: 'Execute variance analysis to control departmental expenditures.',
                questIds: ['fin-day11-q1', 'fin-day11-q2', 'fin-day11-q3', 'fin-day11-q4', 'fin-day11-q5', 'fin-day12-q1', 'fin-day12-q2', 'fin-day12-q3', 'fin-day12-q4', 'fin-day12-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fin-mod-4',
    title: 'Module 4 — Cost & Profit Management',
    daysRange: 'Days 13–16',
    learningGoal: 'Master fixed costs, variable costs, direct vs indirect expenses, contribution margin, break-even analysis, and profit control.',
    topics: [
      {
        id: 'fin-topic-4-1',
        title: 'Cost Structure & Break-Even Analysis',
        concepts: [
          {
            id: 'fin-concept-4-1-1',
            title: 'Break-Even Volume & Margin of Safety',
            description: 'Calculating break-even point (BEP) in units and currency, contribution margin ratio, and margin of safety.',
            objectives: [
              {
                id: 'fin-obj-4-1-1-a',
                statement: 'Calculate break-even points and contribution margins to guide pricing decisions.',
                questIds: ['fin-day13-q1', 'fin-day13-q2', 'fin-day13-q3', 'fin-day13-q4', 'fin-day13-q5', 'fin-day14-q1', 'fin-day14-q2', 'fin-day14-q3', 'fin-day14-q4', 'fin-day14-q5', 'fin-day15-q1', 'fin-day15-q2', 'fin-day15-q3', 'fin-day15-q4', 'fin-day15-q5', 'fin-day16-q1', 'fin-day16-q2', 'fin-day16-q3', 'fin-day16-q4', 'fin-day16-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fin-mod-5',
    title: 'Module 5 — Corporate Finance',
    daysRange: 'Days 17–20',
    learningGoal: 'Understand Capital Structure, Debt vs Equity, Cost of Capital (WACC), Working Capital Management, Capital Budgeting (NPV/IRR), and Dividend Strategies.',
    topics: [
      {
        id: 'fin-topic-5-1',
        title: 'Capital Structure & Investment Appraisal',
        concepts: [
          {
            id: 'fin-concept-5-1-1',
            title: 'Working Capital & Capital Budgeting',
            description: 'Net Working Capital management, NPV, Payback Period, Internal Rate of Return (IRR), and financing strategies.',
            objectives: [
              {
                id: 'fin-obj-5-1-1-a',
                statement: 'Appraise long-term corporate projects using NPV and Net Working Capital optimization.',
                questIds: ['fin-day17-q1', 'fin-day17-q2', 'fin-day17-q3', 'fin-day17-q4', 'fin-day17-q5', 'fin-day18-q1', 'fin-day18-q2', 'fin-day18-q3', 'fin-day18-q4', 'fin-day18-q5', 'fin-day19-q1', 'fin-day19-q2', 'fin-day19-q3', 'fin-day19-q4', 'fin-day19-q5', 'fin-day20-q1', 'fin-day20-q2', 'fin-day20-q3', 'fin-day20-q4', 'fin-day20-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fin-mod-6',
    title: 'Module 6 — Investment Management',
    daysRange: 'Days 21–24',
    learningGoal: 'Analyze Risk vs Return, Asset Classes (Stocks, Bonds, Mutual Funds, ETFs, Gold, FDs, SIPs), Portfolio Diversification, and Asset Allocation.',
    topics: [
      {
        id: 'fin-topic-6-1',
        title: 'Asset Classes & Portfolio Management',
        concepts: [
          {
            id: 'fin-concept-6-1-1',
            title: 'Diversification & Asset Allocation',
            description: 'Risk-return tradeoff, equity vs debt allocation, mutual funds, ETFs, SIP compounding, and portfolio rebalancing.',
            objectives: [
              {
                id: 'fin-obj-6-1-1-a',
                statement: 'Construct diversified investment portfolios tailored to investor risk profiles.',
                questIds: ['fin-day21-q1', 'fin-day21-q2', 'fin-day21-q3', 'fin-day21-q4', 'fin-day21-q5', 'fin-day22-q1', 'fin-day22-q2', 'fin-day22-q3', 'fin-day22-q4', 'fin-day22-q5', 'fin-day23-q1', 'fin-day23-q2', 'fin-day23-q3', 'fin-day23-q4', 'fin-day23-q5', 'fin-day24-q1', 'fin-day24-q2', 'fin-day24-q3', 'fin-day24-q4', 'fin-day24-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fin-mod-7',
    title: 'Module 7 — Banking & Financial Markets',
    daysRange: 'Days 25–27',
    learningGoal: 'Understand Central Banks (RBI), Commercial Banking, Digital Payments, Credit Scores (CIBIL), Capital Markets, Stock Exchanges (NSE/BSE), and IPOs.',
    topics: [
      {
        id: 'fin-topic-7-1',
        title: 'Banking Architecture & Primary/Secondary Markets',
        concepts: [
          {
            id: 'fin-concept-7-1-1',
            title: 'Central Banking & Stock Market Operations',
            description: 'RBI monetary policies, credit evaluation, primary markets (IPO), and secondary market trading.',
            objectives: [
              {
                id: 'fin-obj-7-1-1-a',
                statement: 'Navigate bank lending, credit scoring, and capital market listings.',
                questIds: ['fin-day25-q1', 'fin-day25-q2', 'fin-day25-q3', 'fin-day25-q4', 'fin-day25-q5', 'fin-day26-q1', 'fin-day26-q2', 'fin-day26-q3', 'fin-day26-q4', 'fin-day26-q5', 'fin-day27-q1', 'fin-day27-q2', 'fin-day27-q3', 'fin-day27-q4', 'fin-day27-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fin-mod-8',
    title: 'Module 8 — Modern Finance & FinTech',
    daysRange: 'Days 28–29',
    learningGoal: 'Explore FinTech innovation, digital payment gateways (UPI), AI Robo-Advisors, Blockchain & DeFi basics, financial cybersecurity, and automation.',
    topics: [
      {
        id: 'fin-topic-8-1',
        title: 'FinTech Innovation & AI Wealth Management',
        concepts: [
          {
            id: 'fin-concept-8-1-1',
            title: 'Robo-Advisors & Blockchain in Finance',
            description: 'Automated algorithmic trading, AI wealth advisory, distributed ledger technology, and digital payment security.',
            objectives: [
              {
                id: 'fin-obj-8-1-1-a',
                statement: 'Evaluate modern FinTech platforms, automated robo-advisors, and digital security.',
                questIds: ['fin-day28-q1', 'fin-day28-q2', 'fin-day28-q3', 'fin-day28-q4', 'fin-day28-q5', 'fin-day29-q1', 'fin-day29-q2', 'fin-day29-q3', 'fin-day29-q4', 'fin-day29-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fin-mod-9',
    title: 'Day 30 — Integrated Finance Capstone',
    daysRange: 'Day 30',
    learningGoal: 'Synthesize complete corporate financial planning, cash flow forecasting, investment evaluation, and FinTech strategy into a master business plan.',
    topics: [
      {
        id: 'fin-topic-9-1',
        title: 'Master Integrated Financial Management',
        concepts: [
          {
            id: 'fin-concept-9-1-1',
            title: 'End-to-End Enterprise Finance Execution',
            description: 'Startup capital estimation, operating budget, break-even analysis, cash projection, financing source selection, and portfolio allocation.',
            objectives: [
              {
                id: 'fin-obj-9-1-1-a',
                statement: 'Formulate an end-to-end enterprise financial plan and surplus wealth management strategy.',
                questIds: ['fin-day30-q1', 'fin-day30-q2', 'fin-day30-q3', 'fin-day30-q4', 'fin-day30-q5']
              }
            ]
          }
        ]
      }
    ]
  }
];
