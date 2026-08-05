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

export const BCOM_ANALYTICS_KNOWLEDGE_GRAPH: KnowledgeModule[] = [
  {
    id: 'analytics-mod-1',
    title: 'Module 1 — Foundations of Business Analytics',
    daysRange: 'Days 1–4',
    learningGoal: 'Build the mindset that business decisions should be driven by data rather than assumptions.',
    topics: [
      {
        id: 'analytics-topic-1-1',
        title: 'Data-Driven Organizations & Data Types',
        concepts: [
          {
            id: 'analytics-concept-1-1-1',
            title: 'Business Analytics & Decision Frameworks',
            description: 'Definition of business analytics, value of data-driven organizations, and solving business challenges with analytics.',
            objectives: [
              {
                id: 'analytics-obj-1-1-1-a',
                statement: 'Identify data-driven decision opportunities in corporate environments.',
                questIds: ['analytics-day1-q1', 'analytics-day1-q2', 'analytics-day1-q3']
              }
            ]
          },
          {
            id: 'analytics-concept-1-1-2',
            title: 'Business Functions & KPI Metrics',
            description: 'Analytics across Sales, Marketing, Finance, HR, and Operations; core business KPIs and metrics.',
            objectives: [
              {
                id: 'analytics-obj-1-1-2-a',
                statement: 'Map key metrics (Revenue, Profit, CSAT, Productivity) to operational departments.',
                questIds: ['analytics-day2-q1', 'analytics-day2-q2', 'analytics-day2-q3']
              }
            ]
          }
        ]
      },
      {
        id: 'analytics-topic-1-2',
        title: 'Data Sources, Quality & Ethics',
        concepts: [
          {
            id: 'analytics-concept-1-2-1',
            title: 'Data Collection & Data Quality',
            description: 'Structured, semi-structured, and unstructured data; internal vs external data sources; data quality audit.',
            objectives: [
              {
                id: 'analytics-obj-1-2-1-a',
                statement: 'Evaluate business data quality and collection methodologies.',
                questIds: ['analytics-day3-q1', 'analytics-day3-q2', 'analytics-day3-q3', 'analytics-day3-q4', 'analytics-day3-q5']
              }
            ]
          },
          {
            id: 'analytics-concept-1-2-2',
            title: 'Data Privacy & Ethics',
            description: 'Responsible data usage, privacy regulations (GDPR/DPDP), and ethical data stewardship.',
            objectives: [
              {
                id: 'analytics-obj-1-2-2-a',
                statement: 'Enforce ethical guidelines and privacy compliance when handling corporate data.',
                questIds: ['analytics-day4-q1', 'analytics-day4-q2', 'analytics-day4-q3', 'analytics-day4-q4', 'analytics-day4-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analytics-mod-2',
    title: 'Module 2 — Microsoft Excel for Business Analytics',
    daysRange: 'Days 5–9',
    learningGoal: 'Master spreadsheet analytics: formulas, VLOOKUP/XLOOKUP, sorting, filtering, conditional formatting, charts, and Pivot Tables.',
    topics: [
      {
        id: 'analytics-topic-2-1',
        title: 'Excel Data Wrangling & Lookup Functions',
        concepts: [
          {
            id: 'analytics-concept-2-1-1',
            title: 'Formulas, VLOOKUP & Data Formatting',
            description: 'Cell references, mathematical functions, string manipulation, VLOOKUP, XLOOKUP, and INDEX/MATCH.',
            objectives: [
              {
                id: 'analytics-obj-2-1-1-a',
                statement: 'Perform multi-table data lookups and mathematical modeling in Excel.',
                questIds: ['analytics-day5-q1', 'analytics-day5-q2', 'analytics-day5-q3', 'analytics-day5-q4', 'analytics-day5-q5', 'analytics-day6-q1', 'analytics-day6-q2', 'analytics-day6-q3', 'analytics-day6-q4', 'analytics-day6-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'analytics-topic-2-2',
        title: 'Pivot Tables & Dynamic Excel Charts',
        concepts: [
          {
            id: 'analytics-concept-2-2-1',
            title: 'Pivot Tables & Data Summarization',
            description: 'Creating Pivot Tables, calculated fields, slicers, timeline filters, and dynamic dashboard charts.',
            objectives: [
              {
                id: 'analytics-obj-2-2-1-a',
                statement: 'Construct automated Pivot Table dashboards for executive reporting.',
                questIds: ['analytics-day7-q1', 'analytics-day7-q2', 'analytics-day7-q3', 'analytics-day7-q4', 'analytics-day7-q5', 'analytics-day8-q1', 'analytics-day8-q2', 'analytics-day8-q3', 'analytics-day8-q4', 'analytics-day8-q5', 'analytics-day9-q1', 'analytics-day9-q2', 'analytics-day9-q3', 'analytics-day9-q4', 'analytics-day9-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analytics-mod-3',
    title: 'Module 3 — Data Analysis & Visualization',
    daysRange: 'Days 10–13',
    learningGoal: 'Clean messy data, handle missing values and outliers, compute descriptive statistics, select optimal visual charts, and present data stories.',
    topics: [
      {
        id: 'analytics-topic-3-1',
        title: 'Data Cleaning & Descriptive Statistics',
        concepts: [
          {
            id: 'analytics-concept-3-1-1',
            title: 'Data Transformation & Statistical Summary',
            description: 'Removing duplicates, treating missing values, calculating Mean/Median/Mode, Standard Deviation, and Quartiles.',
            objectives: [
              {
                id: 'analytics-obj-3-1-1-a',
                statement: 'Clean raw business datasets and calculate statistical summaries.',
                questIds: ['analytics-day10-q1', 'analytics-day10-q2', 'analytics-day10-q3', 'analytics-day10-q4', 'analytics-day10-q5', 'analytics-day11-q1', 'analytics-day11-q2', 'analytics-day11-q3', 'analytics-day11-q4', 'analytics-day11-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'analytics-topic-3-2',
        title: 'Chart Selection & Data Storytelling',
        concepts: [
          {
            id: 'analytics-concept-3-2-1',
            title: 'Visual Hierarchy & Dashboard Storytelling',
            description: 'Choosing bar/line/scatter/pie charts, visual design principles, and presenting insights to stakeholders.',
            objectives: [
              {
                id: 'analytics-obj-3-2-1-a',
                statement: 'Design visual dashboards that communicate compelling business narratives.',
                questIds: ['analytics-day12-q1', 'analytics-day12-q2', 'analytics-day12-q3', 'analytics-day12-q4', 'analytics-day12-q5', 'analytics-day13-q1', 'analytics-day13-q2', 'analytics-day13-q3', 'analytics-day13-q4', 'analytics-day13-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analytics-mod-4',
    title: 'Module 4 — Business Intelligence with Power BI',
    daysRange: 'Days 14–18',
    learningGoal: 'Master Power BI Desktop: Power Query data ingestion, data modeling, relationships, DAX formulas, interactive visuals, and report publishing.',
    topics: [
      {
        id: 'analytics-topic-4-1',
        title: 'Power Query & Data Modeling',
        concepts: [
          {
            id: 'analytics-concept-4-1-1',
            title: 'Data Transformation & Relational Modeling',
            description: 'Connecting to data sources, Power Query transformations, Star Schema data modeling, and relationships.',
            objectives: [
              {
                id: 'analytics-obj-4-1-1-a',
                statement: 'Build relational data models in Power BI from disparate business sources.',
                questIds: ['analytics-day14-q1', 'analytics-day14-q2', 'analytics-day14-q3', 'analytics-day14-q4', 'analytics-day14-q5', 'analytics-day15-q1', 'analytics-day15-q2', 'analytics-day15-q3', 'analytics-day15-q4', 'analytics-day15-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'analytics-topic-4-2',
        title: 'DAX Measures & Interactive BI Dashboards',
        concepts: [
          {
            id: 'analytics-concept-4-2-1',
            title: 'DAX Calculations & BI Publishing',
            description: 'CALCULATE, SUMX, Time Intelligence DAX, interactive visual cards, matrix tables, slicers, and Power BI Service publishing.',
            objectives: [
              {
                id: 'analytics-obj-4-2-1-a',
                statement: 'Create DAX calculated measures and publish interactive Power BI dashboards.',
                questIds: ['analytics-day16-q1', 'analytics-day16-q2', 'analytics-day16-q3', 'analytics-day16-q4', 'analytics-day16-q5', 'analytics-day17-q1', 'analytics-day17-q2', 'analytics-day17-q3', 'analytics-day17-q4', 'analytics-day17-q5', 'analytics-day18-q1', 'analytics-day18-q2', 'analytics-day18-q3', 'analytics-day18-q4', 'analytics-day18-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analytics-mod-5',
    title: 'Module 5 — Databases & SQL Fundamentals',
    daysRange: 'Days 19–22',
    learningGoal: 'Understand relational databases, primary/foreign keys, and master SQL queries: SELECT, WHERE, ORDER BY, GROUP BY, HAVING, and Aggregations.',
    topics: [
      {
        id: 'analytics-topic-5-1',
        title: 'Relational Database Schema & Basic Queries',
        concepts: [
          {
            id: 'analytics-concept-5-1-1',
            title: 'Database Architecture & SELECT Statements',
            description: 'Tables, records, fields, keys, basic SELECT queries, filtering with WHERE, and sorting with ORDER BY.',
            objectives: [
              {
                id: 'analytics-obj-5-1-1-a',
                statement: 'Query relational database tables to extract targeted business subsets.',
                questIds: ['analytics-day19-q1', 'analytics-day19-q2', 'analytics-day19-q3', 'analytics-day19-q4', 'analytics-day19-q5', 'analytics-day20-q1', 'analytics-day20-q2', 'analytics-day20-q3', 'analytics-day20-q4', 'analytics-day20-q5']
              }
            ]
          }
        ]
      },
      {
        id: 'analytics-topic-5-2',
        title: 'SQL Aggregations & Grouping',
        concepts: [
          {
            id: 'analytics-concept-5-2-1',
            title: 'GROUP BY, HAVING & Summary Metrics',
            description: 'COUNT, SUM, AVG, MIN, MAX aggregation functions, GROUP BY clause, and HAVING filters.',
            objectives: [
              {
                id: 'analytics-obj-5-2-1-a',
                statement: 'Write aggregated SQL queries to compute departmental metrics and summary totals.',
                questIds: ['analytics-day21-q1', 'analytics-day21-q2', 'analytics-day21-q3', 'analytics-day21-q4', 'analytics-day21-q5', 'analytics-day22-q1', 'analytics-day22-q2', 'analytics-day22-q3', 'analytics-day22-q4', 'analytics-day22-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analytics-mod-6',
    title: 'Module 6 — Business Performance & KPI Analysis',
    daysRange: 'Days 23–25',
    learningGoal: 'Design and monitor departmental KPIs (Financial, Sales, Marketing, HR, Operations), performance dashboards, and industry benchmarking.',
    topics: [
      {
        id: 'analytics-topic-6-1',
        title: 'KPI Frameworks & Performance Benchmarking',
        concepts: [
          {
            id: 'analytics-concept-6-1-1',
            title: 'Departmental Metric Tracking',
            description: 'Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), Churn Rate, ROAS, HR Retention, and Operational Bottlenecks.',
            objectives: [
              {
                id: 'analytics-obj-6-1-1-a',
                statement: 'Define, track, and benchmark performance KPIs across corporate departments.',
                questIds: ['analytics-day23-q1', 'analytics-day23-q2', 'analytics-day23-q3', 'analytics-day23-q4', 'analytics-day23-q5', 'analytics-day24-q1', 'analytics-day24-q2', 'analytics-day24-q3', 'analytics-day24-q4', 'analytics-day24-q5', 'analytics-day25-q1', 'analytics-day25-q2', 'analytics-day25-q3', 'analytics-day25-q4', 'analytics-day25-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analytics-mod-7',
    title: 'Module 7 — Decision Intelligence',
    daysRange: 'Days 26–27',
    learningGoal: 'Apply structured problem-solving: Root Cause Analysis, 5 Whys, SWOT, Decision Trees, Scenario Planning, and Evidence-Based Business Recommendations.',
    topics: [
      {
        id: 'analytics-topic-7-1',
        title: 'Root Cause & Strategic Scenario Analysis',
        concepts: [
          {
            id: 'analytics-concept-7-1-1',
            title: 'Decision Frameworks & Risk Tradeoffs',
            description: 'Methodologies for diagnosing business failures, modeling alternative scenario outcomes, and writing executive action plans.',
            objectives: [
              {
                id: 'analytics-obj-7-1-1-a',
                statement: 'Apply evidence-based decision models to solve complex operational challenges.',
                questIds: ['analytics-day26-q1', 'analytics-day26-q2', 'analytics-day26-q3', 'analytics-day26-q4', 'analytics-day26-q5', 'analytics-day27-q1', 'analytics-day27-q2', 'analytics-day27-q3', 'analytics-day27-q4', 'analytics-day27-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analytics-mod-8',
    title: 'Module 8 — AI & Future of Business Analytics',
    daysRange: 'Days 28–29',
    learningGoal: 'Explore AI-assisted analytics, Predictive/Prescriptive models, Automated reporting, AI Dashboards, Generative AI for Business, and Data Governance.',
    topics: [
      {
        id: 'analytics-topic-8-1',
        title: 'AI Analytics & Automated Reporting',
        concepts: [
          {
            id: 'analytics-concept-8-1-1',
            title: 'Predictive Models & AI Insights',
            description: 'Leveraging LLMs and Machine Learning for automated anomaly detection, natural language querying, and forecasting.',
            objectives: [
              {
                id: 'analytics-obj-8-1-1-a',
                statement: 'Integrate AI analytics tools to accelerate reporting and insight discovery.',
                questIds: ['analytics-day28-q1', 'analytics-day28-q2', 'analytics-day28-q3', 'analytics-day28-q4', 'analytics-day28-q5', 'analytics-day29-q1', 'analytics-day29-q2', 'analytics-day29-q3', 'analytics-day29-q4', 'analytics-day29-q5']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analytics-mod-9',
    title: 'Day 30 — Integrated Business Analytics Capstone',
    daysRange: 'Day 30',
    learningGoal: 'Synthesize complete data lifecycle: collection, cleaning, Excel analysis, SQL querying, Power BI dashboard creation, and C-suite recommendations.',
    topics: [
      {
        id: 'analytics-topic-9-1',
        title: 'Master Enterprise Analytics Capstone',
        concepts: [
          {
            id: 'analytics-concept-9-1-1',
            title: 'End-to-End Decision Intelligence Project',
            description: 'Executing a complete business analytics project on a raw corporate dataset and presenting executive recommendations.',
            objectives: [
              {
                id: 'analytics-obj-9-1-1-a',
                statement: 'Deliver an end-to-end data analytics and decision intelligence portfolio project.',
                questIds: ['analytics-day30-q1', 'analytics-day30-q2', 'analytics-day30-q3', 'analytics-day30-q4', 'analytics-day30-q5']
              }
            ]
          }
        ]
      }
    ]
  }
];
