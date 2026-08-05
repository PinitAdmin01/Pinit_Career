import { CourseQuest } from './coursesData';

// Helper function to generate all 146 Business Analytics & Decision Intelligence Quests
function generate146AnalyticsQuests(): CourseQuest[] {
  const quests: CourseQuest[] = [];

  // Day 1: Teaching Only (3 Quests)
  quests.push({
    id: 'analytics-day1-q1',
    title: 'Day 1 - Quest 1: Introduction to Business Analytics',
    desc: 'Understand what Business Analytics is, why data-driven decision making outperforms intuition, and how corporate organizations leverage data.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Definition of Business Analytics', 'Value of Data-Driven Culture', 'Gut Feeling vs Empirical Evidence', 'Analytics Maturity Spectrum'],
    hint: 'Business analytics translates raw operational data into actionable intelligence for decision makers.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'analytics-day1-q2',
    title: 'Day 1 - Quest 2: Business Problems & Decision Frameworks',
    desc: 'Explore real-world business challenges, decision-making bottlenecks, and the structural role of data analytics in framing solution hypotheses.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Framing Business Questions', 'Root Bottleneck Identification', 'Decision Impact Metrics', 'Hypothesis-Driven Problem Solving'],
    hint: 'A well-framed business question is half the solution in business analytics.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'analytics-day1-q3',
    title: 'Day 1 - Quest 3: Types of Business Data',
    desc: 'Differentiate between Structured, Semi-Structured, and Unstructured Data, as well as Internal Operational Data vs External Market Intelligence.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Structured Data (Tables/SQL)', 'Semi-Structured Data (JSON/XML)', 'Unstructured Data (Text/Media)', 'Internal vs External Data Sources'],
    hint: 'Structured data fits neatly into rows and columns, while unstructured data requires extraction tools.',
    xp: 50,
    pins: 10
  });

  // Day 2: Teaching Only (3 Quests)
  quests.push({
    id: 'analytics-day2-q1',
    title: 'Day 2 - Quest 1: Business Functions Using Analytics',
    desc: 'Examine how different corporate departments—Sales, Marketing, Finance, HR, and Operations—rely on domain-specific analytics.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Sales Funnel Analytics', 'Marketing Attribution', 'Financial Variance Analytics', 'People & HR Analytics', 'Supply Chain Analytics'],
    hint: 'Marketing analytics focuses on customer acquisition cost (CAC), whereas HR analytics tracks turnover and productivity.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'analytics-day2-q2',
    title: 'Day 2 - Quest 2: The 6-Step Analytics Process',
    desc: 'Master the end-to-end analytical workflow: Ask -> Collect -> Analyze -> Interpret -> Decide -> Improve.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Step 1: Ask Business Questions', 'Step 2: Data Collection', 'Step 3: Analytical Execution', 'Step 4: Interpretation', 'Step 5: Decision', 'Step 6: Continuous Improvement'],
    hint: 'The analytics loop never ends; decisions produce new data that fuels continuous optimization.',
    xp: 50,
    pins: 10
  });
  quests.push({
    id: 'analytics-day2-q3',
    title: 'Day 2 - Quest 3: Business Metrics & Key Performance Indicators (KPIs)',
    desc: 'Learn how to define, measure, and track core business metrics: Revenue, Profitability, Customer Satisfaction (CSAT), Productivity, and Churn.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Core Revenue Metrics (MRR/ARR)', 'Customer Satisfaction Metrics (NPS/CSAT)', 'Productivity & Efficiency Ratios', 'Growth Rate Calculations'],
    hint: 'Metrics record raw performance, but KPIs measure progress toward strategic business goals.',
    xp: 50,
    pins: 10
  });

  // Days 3 to 29 (27 Days x 5 Quests = 135 Quests)
  const DAY_MODULE_MAP: Record<number, { moduleName: string; topics: string[] }> = {
    3: { moduleName: 'Module 1 - Data Collection & Quality', topics: ['Data Sources & Ingestion', 'Data Collection Methods', 'Data Quality Assessment'] },
    4: { moduleName: 'Module 1 - Data Ethics & Privacy', topics: ['Data Ethics & Governance', 'Privacy Laws (GDPR & DPDP)', 'Responsible Corporate Data Use'] },
    5: { moduleName: 'Module 2 - Excel Interface & Cell Basics', topics: ['Excel Grid Navigation & Data Types', 'Cell Referencing (Absolute vs Relative)', 'Formatting & Styles'] },
    6: { moduleName: 'Module 2 - Essential Excel Formulas', topics: ['SUM, AVERAGE, COUNT, COUNTA', 'IF, AND, OR Logical Operators', 'Text Functions (CONCAT, LEFT, RIGHT)'] },
    7: { moduleName: 'Module 2 - Excel Lookup Functions', topics: ['VLOOKUP Masterclass', 'XLOOKUP & INDEX/MATCH', 'Data Validation & Dropdowns'] },
    8: { moduleName: 'Module 2 - Excel Data Sorting & Filtering', topics: ['Multi-Level Data Sorting', 'AutoFilters & Advanced Filters', 'Conditional Formatting Rules'] },
    9: { moduleName: 'Module 2 - Pivot Tables & Excel Charts', topics: ['Building Pivot Tables', 'Pivot Chart Visualizations', 'Slicers & Timelines'] },
    10: { moduleName: 'Module 3 - Data Cleaning Techniques', topics: ['Removing Duplicate Records', 'Handling Missing Values', 'Outlier Detection & Removal'] },
    11: { moduleName: 'Module 3 - Descriptive Statistics', topics: ['Mean, Median, Mode Concepts', 'Standard Deviation & Variance', 'Min, Max, and Percentile Analysis'] },
    12: { moduleName: 'Module 3 - Data Visualization Principles', topics: ['Selecting Bar vs Line Charts', 'Scatter Plots & Distribution Histograms', 'Dashboard Formatting Rules'] },
    13: { moduleName: 'Module 3 - Storytelling with Data', topics: ['Data Narrative Structuring', 'Executive Insight Presentation', 'Visual Hierarchy & Colors'] },
    14: { moduleName: 'Module 4 - Intro to Power BI', topics: ['Power BI Desktop Overview', 'Connecting to Data Sources', 'Power Query Ingestion'] },
    15: { moduleName: 'Module 4 - Power BI Data Modeling', topics: ['Creating Table Relationships', 'Star Schema vs Snowflake Schema', 'Cardinality (1:Many, Many:Many)'] },
    16: { moduleName: 'Module 4 - DAX Basics in Power BI', topics: ['Calculated Columns vs Measures', 'SUM, AVERAGE, COUNT in DAX', 'CALCULATE & Filter Overrides'] },
    17: { moduleName: 'Module 4 - Building Interactive BI Visuals', topics: ['Bar, Column & Line Visuals', 'Matrix Tables & KPI Cards', 'Interactive Slicers & Tooltips'] },
    18: { moduleName: 'Module 4 - Power BI Publishing & Dashboards', topics: ['Dashboard Canvas Design', 'Publishing to Power BI Service', 'Report Sharing & Security'] },
    19: { moduleName: 'Module 5 - Relational Databases & SQL', topics: ['Database Tables, Rows & Columns', 'Primary & Foreign Keys', 'SQL Syntax & SELECT Statements'] },
    20: { moduleName: 'Module 5 - SQL Filtering & Sorting', topics: ['Filtering with WHERE Clause', 'AND, OR, IN, LIKE Operators', 'Sorting Results with ORDER BY'] },
    21: { moduleName: 'Module 5 - SQL Aggregation Functions', topics: ['COUNT, SUM, AVG Functions', 'Grouping Records with GROUP BY', 'Filtering Groups with HAVING'] },
    22: { moduleName: 'Module 5 - Multi-Table SQL Queries', topics: ['INNER JOIN Mechanics', 'LEFT JOIN & RIGHT JOIN', 'Business Query Case Studies'] },
    23: { moduleName: 'Module 6 - Departmental KPIs', topics: ['Financial & Sales KPIs', 'Marketing & Customer KPIs', 'Operational & HR KPIs'] },
    24: { moduleName: 'Module 6 - Performance Dashboards', topics: ['KPI Scorecards', 'Executive Performance Grids', 'Trend & Cohort Analysis'] },
    25: { moduleName: 'Module 6 - Business Benchmarking', topics: ['Competitor Benchmarking', 'Historical Baseline Comparison', 'Variance Action Plans'] },
    26: { moduleName: 'Module 7 - Root Cause & SWOT Analysis', topics: ['Root Cause Analysis (5 Whys)', 'SWOT Matrix Evaluation', 'Fishbone Diagram Analysis'] },
    27: { moduleName: 'Module 7 - Decision Trees & Scenario Planning', topics: ['Decision Tree Probability Modeling', 'Best Case vs Worst Case Scenarios', 'Evidence-Based Recommendations'] },
    28: { moduleName: 'Module 8 - AI in Business Analytics', topics: ['Predictive & Prescriptive Analytics', 'Automated Anomaly Detection', 'Generative AI for Executive Summaries'] },
    29: { moduleName: 'Module 8 - AI Dashboards & Future BI', topics: ['AI-Powered Smart Visuals', 'Natural Language Q&A in BI', 'Data Governance & Future BI Strategy'] }
  };

  for (let day = 3; day <= 29; day++) {
    const info = DAY_MODULE_MAP[day] || { moduleName: `Module Day ${day}`, topics: ['Business Analytics', 'Data Processing', 'Decision Intelligence'] };

    // Teaching 1
    quests.push({
      id: `analytics-day${day}-q1`,
      title: `Day ${day} - Quest 1: ${info.topics[0]}`,
      desc: `In-depth breakdown of ${info.topics[0]} with practical business case studies.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[0], 'Analytical Methodologies', 'Corporate Best Practices'],
      hint: `Pay attention to how ${info.topics[0]} improves business decision clarity.`,
      xp: 60,
      pins: 10
    });

    // Teaching 2
    quests.push({
      id: `analytics-day${day}-q2`,
      title: `Day ${day} - Quest 2: ${info.topics[1]}`,
      desc: `Detailed examination of ${info.topics[1]} and software implementation.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[1], 'Technical Execution', 'Workflow Integration'],
      hint: `Master the step-by-step procedure for ${info.topics[1]}.`,
      xp: 60,
      pins: 10
    });

    // Teaching 3
    quests.push({
      id: `analytics-day${day}-q3`,
      title: `Day ${day} - Quest 3: ${info.topics[2]}`,
      desc: `Advanced masterclass on ${info.topics[2]} and executive reporting.`,
      type: 'lecture',
      category: 'learning',
      requiresAvatar: true,
      syllabus: [info.topics[2], 'Quality Controls', 'Executive Communication'],
      hint: `Ensure insights derived from ${info.topics[2]} are actionable.`,
      xp: 60,
      pins: 10
    });

    // Assignment Quest (Interactive JS analytics solver / formula runner / SQL query evaluator)
    quests.push({
      id: `analytics-day${day}-q4`,
      title: `Day ${day} - Quest 4: Practical Analytics Assignment - ${info.topics[0]}`,
      desc: `Analyze business data by writing Excel formula logic, SQL query functions, or KPI evaluators.`,
      type: 'coding',
      category: 'assignment',
      requiresAvatar: false,
      starterCode: `function processAnalyticsDay${day}(dataset) {\n  // Write data cleaning, formula, or query logic here\n  return dataset.filter(row => row.status === 'Active');\n}`,
      testSuite: `if (typeof processAnalyticsDay${day} !== 'function') throw new Error('Method processAnalyticsDay${day} missing');`,
      hint: `Clean and transform raw dataset rows before calculating final KPI aggregations.`,
      xp: 100,
      pins: 25
    });

    // Exam Quest (Timed Quiz / Practical Analytics Assessment)
    quests.push({
      id: `analytics-day${day}-q5`,
      title: `Day ${day} - Quest 5: Daily Analytics Mastery Exam - ${info.moduleName}`,
      desc: `Evaluates speed and accuracy on ${info.moduleName} under timed exam conditions.`,
      type: 'coding',
      category: 'exam',
      requiresAvatar: false,
      starterCode: `function validateAnalyticsExamDay${day}(answers) {\n  // Validate statistical calculations and dashboard insights\n  return true;\n}`,
      testSuite: `if (typeof validateAnalyticsExamDay${day} !== 'function') throw new Error('Exam validator missing');`,
      hint: `Verify data accuracy and check for missing values before submitting your final report.`,
      xp: 150,
      pins: 50
    });
  }

  // Day 30: Integrated Business Analytics Capstone (5 Quests)
  // Teaching Quest 1
  quests.push({
    id: 'analytics-day30-q1',
    title: 'Day 30 - Quest 1: Business Data Lifecycle Synthesis',
    desc: 'Unify the entire data lifecycle: Ingestion -> Cleaning -> Excel Processing -> SQL Querying -> Power BI Visualization -> Reporting.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['End-to-End Analytics Pipeline', 'Data Model Alignment', 'Automated Refresh Sync'],
    hint: 'A seamless pipeline ensures data flows from raw databases into executive dashboards automatically.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 2
  quests.push({
    id: 'analytics-day30-q2',
    title: 'Day 30 - Quest 2: Business Decision Framework Synthesis',
    desc: 'Synthesize KPI scorecards, root cause insights, scenario modeling, and strategic action plans into C-suite recommendations.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['KPI Scorecard Synthesis', 'Decision Tree Scenario Evaluation', 'Actionable Executive Recommendations'],
    hint: 'Great analytics does not stop at showing what happened—it recommends what actions to take next.',
    xp: 100,
    pins: 20
  });

  // Teaching Quest 3
  quests.push({
    id: 'analytics-day30-q3',
    title: 'Day 30 - Quest 3: Modern Business Intelligence & AI Alignment',
    desc: 'Integrate Microsoft Excel, SQL databases, Power BI Desktop, and AI tools for enterprise decision intelligence.',
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: ['Modern BI Stack Integration', 'AI Analytics Assistants', 'Future-Proof Analytical Strategy'],
    hint: 'Combine automated AI reporting with human domain judgment for optimal business outcomes.',
    xp: 100,
    pins: 20
  });

  // Assignment Quest: Master Enterprise Analytics Project
  quests.push({
    id: 'analytics-day30-q4',
    title: 'Day 30 - Quest 4: Capstone Assignment - Enterprise Dataset Analysis & Dashboard',
    desc: 'Analyze a complete corporate dataset: clean raw data, calculate key metrics, run SQL queries, build dynamic dashboard visualizations, write business insights, and provide strategic C-suite recommendations.',
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: `function executeEnterpriseAnalyticsCapstone(rawDataset) {\n  // 1. Clean data and remove duplicate/null records\n  // 2. Compute Revenue, Churn Rate, and CAC\n  // 3. Generate summary table and executive recommendation\n  return {\n    dataCleaned: true,\n    totalRevenue: 4850000,\n    churnRatePct: 4.2,\n    cac: 1200,\n    dashboardBuilt: true,\n    recommendation: "Increase marketing allocation to Channel A by 15% to lower CAC by 8%."\n  };\n}`,
    testSuite: `if (typeof executeEnterpriseAnalyticsCapstone !== 'function') throw new Error('Capstone solver missing');\nconst res = executeEnterpriseAnalyticsCapstone([]);\nif (!res.dataCleaned || !res.dashboardBuilt) throw new Error('Capstone execution incomplete');`,
    hint: `Ensure all statistical metrics are accurately calculated before formulating strategic recommendations!`,
    xp: 300,
    pins: 100
  });

  // Final Exam Quest: Comprehensive Professional Analytics Assessment
  quests.push({
    id: 'analytics-day30-q5',
    title: 'Day 30 - Quest 5: Final Comprehensive Exam - Business Analytics & Decision Intelligence',
    desc: 'Mastery certification assessment covering Business Analytics Fundamentals, Excel, Data Analysis, Visualization, Power BI, SQL, KPI Tracking, Decision Intelligence & AI.',
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: `function executeFinalAnalyticsCertificationExam(candidateAnswers) {\n  // Validate comprehensive 90-minute business analytics exam\n  return {\n    scorePct: 97,\n    passed: true,\n    certificationTitle: "Certified Business Analytics & Decision Intelligence Specialist"\n  };\n}`,
    testSuite: `if (typeof executeFinalAnalyticsCertificationExam !== 'function') throw new Error('Final exam runner missing');\nconst evalRes = executeFinalAnalyticsCertificationExam({});\nif (!evalRes.passed) throw new Error('Certification evaluation failed');`,
    hint: `Review all 8 modules before initiating the final comprehensive certification assessment.`,
    xp: 500,
    pins: 200
  });

  return quests;
}

export const BCOM_ANALYTICS_30_DAYS_QUESTS: CourseQuest[] = generate146AnalyticsQuests();
