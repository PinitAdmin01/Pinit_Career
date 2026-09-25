// src/lib/onboarding/diagnosticRegistryBBA.ts
/**
 * PinIT Career OS — Production BBA / MBA Onboarding Diagnostic V1 Question Registry
 * 
 * Target Students:
 * - BBA, MBA, MBA freshers, MBA with work experience, Business / Management students
 * - Specializations: Strategy, Marketing, Sales, Corporate Finance, Consulting, HR, Operations, Business Analytics, Product Management, Entrepreneurship, Banking
 * 
 * CORE LAWS:
 * 1. Goal != Persona: Goal discovery questions NEVER directly determine PH / EX / ST / SIQ.
 * 2. An answer is evidence, not a diagnosis.
 * 3. Options must be randomized at render; store optionId, never screen index A/B/C/D.
 * 4. Four Behavioral Operating Dimensions:
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
   PART 1 — BBA / MBA GOAL DISCOVERY QUESTIONS (Q1 – Q9, Q34)
   ========================================================================== */

export const BBA_GOAL_DISCOVERY_QUESTIONS: GoalDiscoveryQuestion[] = [
  {
    id: 'Q1_BBA_CAREER_DIRECTION',
    title: 'Career Direction',
    subtitle: 'What is your main career direction in business and management?',
    type: 'single_select',
    options: [
      { id: 'bba_dir_mgmt_strategy', label: 'Management / Business Strategy', description: 'Corporate strategy, executive planning, general management and leadership', mappedValue: 'management_strategy' },
      { id: 'bba_dir_marketing_brand', label: 'Marketing / Brand / Growth', description: 'Brand management, growth hacking, consumer insights & performance marketing', mappedValue: 'marketing_growth' },
      { id: 'bba_dir_sales_bizdev', label: 'Sales / Business Development', description: 'Revenue generation, enterprise sales, key account management & partnerships', mappedValue: 'sales_bizdev' },
      { id: 'bba_dir_finance_corp', label: 'Finance / Corporate Finance', description: 'Financial modeling, valuation, capital budgeting, M&A and treasury', mappedValue: 'corporate_finance' },
      { id: 'bba_dir_consulting', label: 'Consulting', description: 'Management consulting, strategy consulting, operational problem solving for clients', mappedValue: 'consulting' },
      { id: 'bba_dir_human_resources', label: 'Human Resources', description: 'Talent management, organizational design, HR analytics, people operations', mappedValue: 'human_resources' },
      { id: 'bba_dir_operations_supplychain', label: 'Operations / Supply Chain', description: 'Process optimization, supply chain logistics, inventory, Lean Six Sigma', mappedValue: 'operations_supplychain' },
      { id: 'bba_dir_business_analytics', label: 'Business Analytics', description: 'Data-driven decision intelligence, business intelligence dashboards, predictive modeling', mappedValue: 'business_analytics' },
      { id: 'bba_dir_product_mgmt', label: 'Product Management', description: 'Product strategy, user roadmap, PRD writing, agile execution & cross-functional leadership', mappedValue: 'product_management' },
      { id: 'bba_dir_entrepreneurship', label: 'Entrepreneurship / Startup', description: 'Venture building, startup execution, scaling new business models, family business', mappedValue: 'entrepreneurship_startup' },
      { id: 'bba_dir_banking', label: 'Banking / Financial Services', description: 'Commercial/investment banking, credit appraisal, wealth management & fintech', mappedValue: 'banking_financial_services' },
      { id: 'bba_dir_exploring', label: 'I am still exploring', description: 'Open to discovering high-fit business domains based on diagnostic strengths', mappedValue: 'exploring' }
    ]
  },
  {
    id: 'Q2_BBA_IMMEDIATE_GOAL',
    title: 'Target Objective',
    subtitle: 'What do you want PinIT to help you achieve first?',
    type: 'single_select',
    options: [
      { id: 'bba_achieve_internship', label: 'Get an internship', description: 'Secure a high-impact corporate, summer, or pre-placement internship', mappedValue: 'internship' },
      { id: 'bba_achieve_first_job', label: 'Get my first job', description: 'Campus placements or off-campus entry-level corporate hiring', mappedValue: 'first_job' },
      { id: 'bba_achieve_better_role', label: 'Switch into a better role', description: 'Transition into higher-growth companies or target management track', mappedValue: 'role_switch' },
      { id: 'bba_achieve_move_mgmt', label: 'Move into management', description: 'Advance from individual contributor to team lead or managerial level', mappedValue: 'management_track' },
      { id: 'bba_achieve_biz_profile', label: 'Build a strong business profile', description: 'Portfolio of case studies, financial models, strategy deck credentials', mappedValue: 'profile_building' },
      { id: 'bba_achieve_prof_qual', label: 'Prepare for a professional qualification', description: 'CFA, FRM, PMP, Six Sigma, SHRM, or corporate certification', mappedValue: 'professional_qualification' },
      { id: 'bba_achieve_start_biz', label: 'Start a business', description: 'Launch a venture, startup, commercial trading, or scale family business', mappedValue: 'start_business' },
      { id: 'bba_achieve_higher_studies', label: 'Prepare for higher studies', description: 'GMAT, CAT, Executive MBA, or specialized master degree programs', mappedValue: 'higher_studies' },
      { id: 'bba_achieve_exploring', label: 'I am still exploring', description: 'Explore multiple options before committing to a singular track', mappedValue: 'exploring' }
    ]
  },
  {
    id: 'Q3_BBA_TIME_HORIZON',
    title: 'Time Horizon',
    subtitle: 'What is your target time horizon for reaching your next career milestone?',
    type: 'single_select',
    options: [
      { id: 'bba_hor_0_3', label: '0–3 months', description: 'Immediate placement drive or active internship interviews', mappedValue: 3 },
      { id: 'bba_hor_3_6', label: '3–6 months', description: 'Next semester placement cycle or scheduled recruitment window', mappedValue: 6 },
      { id: 'bba_hor_6_12', label: '6–12 months', description: 'Comprehensive skill build, portfolio compilation, and strategic prep', mappedValue: 12 },
      { id: 'bba_hor_1_2', label: '1–2 years', description: 'Multi-year MBA / BBA graduation pathway roadmap', mappedValue: 24 },
      { id: 'bba_hor_2_plus', label: 'More than 2 years', description: 'Long-term foundational management capabilities and executive track', mappedValue: 36 },
      { id: 'bba_hor_unsure', label: 'Not sure yet', description: 'Flexible pacing adapted dynamically to learning progress', mappedValue: 6 }
    ]
  },
  {
    id: 'Q4_BBA_PROBLEM_AFFINITY',
    title: 'Business Problem Affinity',
    subtitle: 'Which type of business problem attracts you most? (Career-interest signal)',
    type: 'single_select',
    options: [
      { id: 'bba_prob_deviations', label: 'Why is something performing differently from expectations?', description: 'Root cause analysis, financial variance investigation, diagnostic problem solving', mappedValue: 'deviations_investigation' },
      { id: 'bba_prob_new_approach', label: 'How can we try a new approach and see whether it works?', description: 'Testing innovative campaigns, pilot experiments, testing new business models', mappedValue: 'experimental_approach' },
      { id: 'bba_prob_organize_deliver', label: 'How can we organize people and resources to deliver the result?', description: 'Structuring projects, operational workflows, resource allocations, accountability systems', mappedValue: 'organization_execution' },
      { id: 'bba_prob_stakeholder_behavior', label: 'Why do customers, employees or stakeholders behave differently from what we expected?', description: 'Consumer psychology, organizational dynamics, leadership influence, stakeholder negotiation', mappedValue: 'stakeholder_behavior' }
    ]
  },
  {
    id: 'Q5_BBA_EXPERIENCE_ARTIFACTS',
    title: 'Practical Experience',
    subtitle: 'What practical experience do you actually have? (Select all that apply)',
    type: 'multi_select',
    options: [
      { id: 'bba_exp_college_proj', label: 'College project', mappedValue: 'college_project' },
      { id: 'bba_exp_case_comp', label: 'Business case competition', mappedValue: 'business_case_competition' },
      { id: 'bba_exp_marketing_proj', label: 'Marketing project', mappedValue: 'marketing_project' },
      { id: 'bba_exp_finance_proj', label: 'Finance project', mappedValue: 'finance_project' },
      { id: 'bba_exp_hr_proj', label: 'HR project', mappedValue: 'hr_project' },
      { id: 'bba_exp_ops_proj', label: 'Operations project', mappedValue: 'operations_project' },
      { id: 'bba_exp_internship', label: 'Internship', mappedValue: 'internship' },
      { id: 'bba_exp_part_time', label: 'Part-time work', mappedValue: 'part_time_work' },
      { id: 'bba_exp_full_time', label: 'Full-time work', mappedValue: 'full_time_work' },
      { id: 'bba_exp_freelance', label: 'Freelance work', mappedValue: 'freelance_work' },
      { id: 'bba_exp_family_biz', label: 'Family business', mappedValue: 'family_business' },
      { id: 'bba_exp_startup', label: 'Startup experience', mappedValue: 'startup_experience' },
      { id: 'bba_exp_leadership', label: 'Leadership role', mappedValue: 'leadership_role' },
      { id: 'bba_exp_student_org', label: 'Student organization', mappedValue: 'student_organization' },
      { id: 'bba_exp_event_mgmt', label: 'Event management', mappedValue: 'event_management' },
      { id: 'bba_exp_client_interaction', label: 'Client interaction', mappedValue: 'client_interaction' },
      { id: 'bba_exp_sales_interaction', label: 'Sales/customer interaction', mappedValue: 'sales_customer_interaction' },
      { id: 'bba_exp_research', label: 'Research', mappedValue: 'research' },
      { id: 'bba_exp_biz_analytics', label: 'Business analytics', mappedValue: 'business_analytics' },
      { id: 'bba_exp_consulting', label: 'Consulting/project work', mappedValue: 'consulting_project_work' },
      { id: 'bba_exp_none', label: 'None yet', mappedValue: 'none' }
    ]
  },
  {
    id: 'Q6_BBA_ACTUAL_LEVEL',
    title: 'Actual Experience Level',
    subtitle: 'How would you characterize your real-world business experience level?',
    type: 'single_select',
    options: [
      { id: 'bba_lvl_mostly_academic', label: 'Mostly academic; little practical exposure', description: 'Classroom concepts, exams, textbook theories without corporate hands-on', mappedValue: 'academic_only' },
      { id: 'bba_lvl_academic_plus', label: 'Academic projects with some practical exposure', description: 'College presentations, course simulations, student club initiatives', mappedValue: 'academic_plus_projects' },
      { id: 'bba_lvl_internship_tasks', label: 'Internship/project experience with real-world tasks', description: 'Delivered actual corporate deliverables, stakeholder reports, or customer tasks', mappedValue: 'internship_practical' },
      { id: 'bba_lvl_regular_work', label: 'Regular practical/work experience', description: '1–2 years of professional work, operations, client handling or business execution', mappedValue: 'regular_work_experience' },
      { id: 'bba_lvl_substantial_prof', label: 'Substantial professional/business experience', description: '3+ years of full-time professional experience, managing teams or operational units', mappedValue: 'substantial_professional' }
    ]
  },
  {
    id: 'Q7_BBA_TOOLS_USED',
    title: 'Business Tools Proficiency',
    subtitle: 'Which business tools have you actually used hands-on? (Select all that apply)',
    type: 'multi_select',
    options: [
      { id: 'bba_tool_excel', label: 'Excel (Standard formulas, charts, tables)', mappedValue: 'excel' },
      { id: 'bba_tool_adv_excel', label: 'Advanced Excel (VLOOKUP/XLOOKUP, Pivot Tables, What-If)', mappedValue: 'advanced_excel' },
      { id: 'bba_tool_power_bi', label: 'Power BI', mappedValue: 'power_bi' },
      { id: 'bba_tool_tableau', label: 'Tableau', mappedValue: 'tableau' },
      { id: 'bba_tool_sql', label: 'SQL (Querying relational databases)', mappedValue: 'sql' },
      { id: 'bba_tool_google_sheets', label: 'Google Sheets (Collaborative workflows)', mappedValue: 'google_sheets' },
      { id: 'bba_tool_crm', label: 'CRM (Salesforce, HubSpot, Zoho CRM)', mappedValue: 'crm' },
      { id: 'bba_tool_erp', label: 'ERP (SAP, Oracle, Odoo)', mappedValue: 'erp' },
      { id: 'bba_tool_sap', label: 'SAP', mappedValue: 'sap' },
      { id: 'bba_tool_tally', label: 'Tally / TallyPrime', mappedValue: 'tally' },
      { id: 'bba_tool_fin_tools', label: 'Financial analysis tools (DCF models, Capital IQ)', mappedValue: 'financial_tools' },
      { id: 'bba_tool_mkt_analytics', label: 'Marketing analytics tools (Google Analytics, Meta Ads)', mappedValue: 'marketing_analytics' },
      { id: 'bba_tool_pm_tools', label: 'Project management tools (Jira, Asana, Trello, Notion)', mappedValue: 'pm_tools' },
      { id: 'bba_tool_presentation', label: 'Presentation/business planning tools (PowerPoint, Pitch)', mappedValue: 'presentation_tools' },
      { id: 'bba_tool_survey_research', label: 'Survey/research tools (Qualtrics, Google Forms, Typeform)', mappedValue: 'survey_research_tools' },
      { id: 'bba_tool_other', label: 'Other specialized software', mappedValue: 'other_tools' },
      { id: 'bba_tool_none', label: 'None yet — starting fresh', mappedValue: 'none' }
    ]
  },
  {
    id: 'Q8_BBA_BIGGEST_OBSTACLE',
    title: 'Current Obstacles',
    subtitle: 'What currently feels like your biggest obstacle? (Choose up to three)',
    type: 'multi_select',
    maxSelections: 3,
    options: [
      { id: 'bba_obs_career_choice', label: 'Not knowing what career to choose', mappedValue: 'career_uncertainty' },
      { id: 'bba_obs_lack_experience', label: 'Lack of practical experience', mappedValue: 'lack_practical_experience' },
      { id: 'bba_obs_weak_skills', label: 'Weak technical/business skills', mappedValue: 'weak_business_skills' },
      { id: 'bba_obs_communication', label: 'Communication', mappedValue: 'communication' },
      { id: 'bba_obs_leadership', label: 'Leadership', mappedValue: 'leadership' },
      { id: 'bba_obs_consistency', label: 'Consistency', mappedValue: 'consistency' },
      { id: 'bba_obs_time_mgmt', label: 'Time management', mappedValue: 'time_management' },
      { id: 'bba_obs_analysis', label: 'Analysis', mappedValue: 'analysis' },
      { id: 'bba_obs_decision_making', label: 'Decision-making', mappedValue: 'decision_making' },
      { id: 'bba_obs_interview_prep', label: 'Interview preparation', mappedValue: 'interview_prep' },
      { id: 'bba_obs_networking', label: 'Networking', mappedValue: 'networking' },
      { id: 'bba_obs_confidence', label: 'Confidence', mappedValue: 'confidence' },
      { id: 'bba_obs_too_many_paths', label: 'Too many possible career paths', mappedValue: 'path_sprawl' },
      { id: 'bba_obs_getting_started', label: 'Getting started', mappedValue: 'getting_started' },
      { id: 'bba_obs_finishing', label: 'Finishing what I start', mappedValue: 'finishing_deliverables' },
      { id: 'bba_obs_other', label: 'Other challenges', mappedValue: 'other_obstacle' }
    ]
  },
  {
    id: 'Q9_BBA_DAILY_TIME',
    title: 'Daily Availability',
    subtitle: 'How much time can you realistically dedicate to PinIT per day?',
    type: 'single_select',
    options: [
      { id: 'bba_time_under_30', label: '< 30 minutes/day', description: 'Micro-learning sprints and quick daily check-ins', mappedValue: 25 },
      { id: 'bba_time_30_60', label: '30–60 minutes/day', description: 'Steady pace: complete 1–2 practical business quests per day', mappedValue: 45 },
      { id: 'bba_time_1_2', label: '1–2 hours/day', description: 'Standard commitment: deep case studies, simulations, and modeling', mappedValue: 90 },
      { id: 'bba_time_2_3', label: '2–3 hours/day', description: 'Accelerated career transformation and rigorous placement prep', mappedValue: 150 },
      { id: 'bba_time_3_plus', label: '3+ hours/day', description: 'Intensive immersion: full capstone projects, portfolio building, and mock rounds', mappedValue: 180 }
    ]
  },
  {
    id: 'Q34_BBA_WORK_ENVIRONMENT_EXPERIENCE',
    title: 'Professional Environment Context',
    subtitle: 'Have you personally worked in a professional or corporate business environment?',
    type: 'single_select',
    options: [
      { id: 'bba_work_none', label: 'No', description: 'Fresher with purely academic / classroom coursework exposure', mappedValue: 'no_experience' },
      { id: 'bba_work_internship', label: 'Internship only', description: 'Completed a corporate summer internship or winter project', mappedValue: 'internship_only' },
      { id: 'bba_work_part_freelance', label: 'Part-time / freelance', description: 'Handled client deliverables, freelance consulting, or part-time roles', mappedValue: 'part_time_freelance' },
      { id: 'bba_work_1_2', label: '1–2 years', description: 'Worked full-time in corporate/startup environment for 1 to 2 years', mappedValue: '1_to_2_years' },
      { id: 'bba_work_3_plus', label: '3+ years', description: 'Seasoned professional with 3 or more years of industry experience', mappedValue: '3_plus_years' }
    ]
  }
];

/* ==========================================================================
   PART 2 & 3 — BBA / MBA BEHAVIORAL SITUATIONAL JUDGEMENT TESTS (Q10 – Q28)
   ========================================================================== */

export const BBA_SJT_QUESTIONS: SJTQuestion[] = [
  {
    id: 'Q10_BBA_METRIC_DROPS',
    title: 'A Business Metric Suddenly Drops',
    scenario: "A company's customer retention rate has fallen sharply over the last quarter.",
    prompt: 'What would you do first?',
    instruction: 'Choose the action you would most naturally take in real life.',
    options: [
      {
        id: 'q10_bba_ph',
        text: 'Break the metric into relevant segments and investigate what relationships or assumptions may explain the change.',
        dimension: 'PH',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q10_bba_ex',
        text: 'Try several quick cuts of the data to see whether a different pattern appears.',
        dimension: 'EX',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q10_bba_st',
        text: 'Verify the data, definitions and reporting process before proceeding with the analysis.',
        dimension: 'ST',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q10_bba_siq',
        text: 'Speak with people close to customers to understand what may have changed in practice.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q11_BBA_UNCLEAR_PROBLEM',
    title: 'An Unclear Business Problem',
    scenario: 'Your manager tells you: “Find out why sales aren\'t growing.” No further instructions or guidance are given.',
    prompt: 'What do you do first?',
    instruction: 'Choose your natural starting move.',
    options: [
      {
        id: 'q11_bba_siq',
        text: 'Clarify what decision the manager ultimately needs the analysis to support.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q11_bba_ph',
        text: 'Break the problem into possible drivers such as volume, price, customer mix and channel.',
        dimension: 'PH',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q11_bba_ex',
        text: 'Start with a quick analysis and use the initial result to decide what to investigate next.',
        dimension: 'EX',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q11_bba_st',
        text: 'Define the required output, scope, data and deadline before starting.',
        dimension: 'ST',
        evidence: 2,
        context: 'scoping'
      }
    ]
  },
  {
    id: 'Q12_BBA_TWO_STRATEGIES',
    title: 'Two Promising Strategies',
    scenario: 'You are comparing two marketing strategies but there is not enough historical data to know which one will work.',
    prompt: 'How do you evaluate them?',
    instruction: 'Choose your natural decision approach.',
    options: [
      {
        id: 'q12_bba_ex',
        text: 'Run a small test with both approaches.',
        dimension: 'EX',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q12_bba_ph',
        text: 'Identify the assumptions on which each strategy depends and compare their logic.',
        dimension: 'PH',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q12_bba_st',
        text: 'Define decision criteria and evaluate both strategies against the same framework.',
        dimension: 'ST',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q12_bba_siq',
        text: 'Talk to customers and relevant stakeholders about how each approach may affect them.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q13_BBA_TEAM_DISAGREE',
    title: 'Team Disagrees on Solution',
    scenario: 'Your project team strongly disagrees about the best solution to a strategic business case.',
    prompt: 'How do you lead the team toward resolution?',
    instruction: 'Choose your natural resolution method.',
    options: [
      {
        id: 'q13_bba_ph',
        text: 'Compare the assumptions and reasoning behind the different proposals.',
        dimension: 'PH',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q13_bba_ex',
        text: 'Try a small part of the strongest alternatives and compare the results.',
        dimension: 'EX',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q13_bba_st',
        text: 'Agree on evaluation criteria, decision ownership and the next action.',
        dimension: 'ST',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q13_bba_siq',
        text: "Make sure each person's concern and underlying constraint is understood before deciding.",
        dimension: 'SIQ',
        evidence: 2,
        context: 'collaboration'
      }
    ]
  },
  {
    id: 'Q14_BBA_CUSTOMER_COMPLAINTS',
    title: 'Customer Complaints vs Metrics',
    scenario: "Customer complaints suddenly surge, while the company's internal operational dashboard still shows all green.",
    prompt: 'What do you do first?',
    instruction: 'Choose your immediate investigation action.',
    options: [
      {
        id: 'q14_bba_ph',
        text: 'Investigate how the two measures are defined and identify possible reasons for the contradiction.',
        dimension: 'PH',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q14_bba_ex',
        text: 'Test additional samples or measurements to see whether the complaint pattern is real.',
        dimension: 'EX',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q14_bba_st',
        text: 'Check the process and reporting system to ensure data are being captured correctly.',
        dimension: 'ST',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q14_bba_siq',
        text: 'Speak with customers and frontline employees to understand the problem from their perspective.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'feedback'
      }
    ]
  },
  {
    id: 'Q15_BBA_ONE_WEEK_LAUNCH',
    title: 'One Week to Product Launch',
    scenario: 'Your team has one week until launch, but there is far more work remaining than the team can realistically finish.',
    prompt: 'What do you do first?',
    instruction: 'Choose your immediate triage move.',
    options: [
      {
        id: 'q15_bba_st',
        text: 'Separate essential deliverables from optional work and establish owners and deadlines.',
        dimension: 'ST',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q15_bba_ph',
        text: 'Map dependencies and identify which parts create the largest downstream risk.',
        dimension: 'PH',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q15_bba_ex',
        text: 'Look for a simpler way to achieve the required outcome.',
        dimension: 'EX',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q15_bba_siq',
        text: 'Confirm what stakeholders consider essential before cutting scope.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'delivery'
      }
    ]
  },
  {
    id: 'Q16_BBA_CONFLICTING_RESEARCH',
    title: 'Conflicting Research Reports',
    scenario: 'Two reputable market research reports reach completely opposite conclusions regarding industry demand.',
    prompt: 'How do you resolve the conflict?',
    instruction: 'Choose your analytical approach.',
    options: [
      {
        id: 'q16_bba_ph',
        text: 'Compare their assumptions, definitions, samples and reasoning.',
        dimension: 'PH',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q16_bba_ex',
        text: 'Look for another dataset or test that can distinguish between the two conclusions.',
        dimension: 'EX',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q16_bba_st',
        text: 'Create a consistent evaluation framework and compare both reports against it.',
        dimension: 'ST',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q16_bba_siq',
        text: 'Understand who produced each report and what business perspective or stakeholder context they may represent.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q17_BBA_RECOMMENDATION_CHALLENGED',
    title: 'Senior Leader Challenges Recommendation',
    scenario: 'During your executive presentation, a senior leader abruptly interrupts: “I don\'t agree with your recommendation.”',
    prompt: 'What do you do first?',
    instruction: 'Choose your immediate response.',
    options: [
      {
        id: 'q17_bba_siq',
        text: 'Ask what part of the recommendation they disagree with and understand their reasoning.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q17_bba_ph',
        text: 'Examine which assumptions or evidence led to the disagreement.',
        dimension: 'PH',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q17_bba_ex',
        text: 'Consider testing an alternative recommendation.',
        dimension: 'EX',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q17_bba_st',
        text: 'Return to the agreed decision criteria and evaluate the recommendation against them.',
        dimension: 'ST',
        evidence: 2,
        context: 'feedback'
      }
    ]
  },
  {
    id: 'Q18_BBA_CAMPAIGN_POOR',
    title: 'First Campaign Performs Poorly',
    scenario: 'Your first marketing campaign generates poor conversions and fails to hit its acquisition targets.',
    prompt: 'What do you do first?',
    instruction: 'Choose your troubleshooting step.',
    options: [
      {
        id: 'q18_bba_ex',
        text: 'Change one element and run another small test.',
        dimension: 'EX',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q18_bba_ph',
        text: 'Break the campaign funnel down to determine where performance changed.',
        dimension: 'PH',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q18_bba_st',
        text: 'Review whether the campaign was implemented according to the original plan and objectives.',
        dimension: 'ST',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q18_bba_siq',
        text: 'Talk to customers or the sales team to understand why the message may not have worked.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q19_BBA_PROJECT_STUCK',
    title: 'Project Paralyzed in Debate',
    scenario: 'Your project team has been endlessly debating approach options for several days with virtually no tangible progress.',
    prompt: 'What do you do first?',
    instruction: 'Choose your unblocking move.',
    options: [
      {
        id: 'q19_bba_st',
        text: 'Turn the discussion into concrete decisions, owners and deadlines.',
        dimension: 'ST',
        evidence: 2,
        context: 'unblocking'
      },
      {
        id: 'q19_bba_siq',
        text: 'Find out what different team members believe is blocking progress.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'unblocking'
      },
      {
        id: 'q19_bba_ph',
        text: 'Identify the underlying decision or dependency causing the blockage.',
        dimension: 'PH',
        evidence: 2,
        context: 'unblocking'
      },
      {
        id: 'q19_bba_ex',
        text: 'Try a small version of one approach to create evidence and move the discussion forward.',
        dimension: 'EX',
        evidence: 2,
        context: 'unblocking'
      }
    ]
  },
  {
    id: 'Q20_BBA_INCOMPLETE_MARKET_INFO',
    title: 'Incomplete Market Information',
    scenario: 'Your manager asks whether a new product should be launched, but several critical market metrics are missing.',
    prompt: 'How do you handle the decision?',
    instruction: 'Choose your operating method.',
    options: [
      {
        id: 'q20_bba_ph',
        text: 'Determine which missing information could actually change the decision.',
        dimension: 'PH',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q20_bba_ex',
        text: 'Build a small test or scenario using the information available.',
        dimension: 'EX',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q20_bba_st',
        text: 'Document the known information, assumptions and decision process.',
        dimension: 'ST',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q20_bba_siq',
        text: 'Speak with customers or stakeholders to obtain context that the existing data cannot provide.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q21_BBA_PROCESS_INEFFICIENT',
    title: 'An Inefficient Process',
    scenario: 'A core operational fulfillment process is taking twice as long as the corporate standard.',
    prompt: 'What do you do first?',
    instruction: 'Choose your improvement strategy.',
    options: [
      {
        id: 'q21_bba_ph',
        text: 'Map the process and identify where delays or dependencies accumulate.',
        dimension: 'PH',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q21_bba_ex',
        text: 'Try a modified version of the process on a small scale.',
        dimension: 'EX',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q21_bba_st',
        text: 'Standardize the process and define clear steps, owners and controls.',
        dimension: 'ST',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q21_bba_siq',
        text: 'Speak with the people performing the process to understand practical difficulties.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q22_BBA_ENGAGEMENT_FALLS',
    title: 'Employee Engagement Drop',
    scenario: 'Employee engagement scores have dropped noticeably across an operational department.',
    prompt: 'What do you do first?',
    instruction: 'Choose your initial investigative step.',
    options: [
      {
        id: 'q22_bba_siq',
        text: 'Talk to employees and managers to understand what they are experiencing.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q22_bba_ph',
        text: 'Compare engagement with workload, manager, role, tenure and other relevant variables.',
        dimension: 'PH',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q22_bba_ex',
        text: 'Try a small intervention and compare the results with the current situation.',
        dimension: 'EX',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q22_bba_st',
        text: 'Review whether existing processes, responsibilities and communication routines are being followed consistently.',
        dimension: 'ST',
        evidence: 2,
        context: 'feedback'
      }
    ]
  },
  {
    id: 'Q23_BBA_DISCOVER_RISK',
    title: 'Discovery of an Unconsidered Risk',
    scenario: 'You identify a substantial business risk that your leadership team has not previously factored in.',
    prompt: 'What do you do first?',
    instruction: 'Choose your risk response.',
    options: [
      {
        id: 'q23_bba_ph',
        text: 'Determine the assumptions and dependencies that make the risk possible.',
        dimension: 'PH',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q23_bba_ex',
        text: 'Test a small scenario to estimate how the risk behaves.',
        dimension: 'EX',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q23_bba_st',
        text: 'Document the risk, assign ownership and establish a response plan.',
        dimension: 'ST',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q23_bba_siq',
        text: 'Discuss the risk with affected stakeholders to understand how serious it is operationally.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q24_BBA_DIRECTION_CHANGE',
    title: 'Senior Leader Changes Direction',
    scenario: 'Halfway through an operational rollout, executive leadership changes the primary objective.',
    prompt: 'What do you do first?',
    instruction: 'Choose your realignment action.',
    options: [
      {
        id: 'q24_bba_st',
        text: 'Assess the impact, update the plan and reorganize priorities.',
        dimension: 'ST',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q24_bba_ph',
        text: 'Determine which assumptions from the original plan are no longer valid.',
        dimension: 'PH',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q24_bba_ex',
        text: 'Explore whether the new direction creates an alternative approach that could work better.',
        dimension: 'EX',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q24_bba_siq',
        text: 'Clarify why the change happened and what different stakeholders now expect.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'delivery'
      }
    ]
  },
  {
    id: 'Q25_BBA_SPEED_VS_ANALYSIS',
    title: 'Speed vs Deeper Analysis',
    scenario: 'You have enough information to make a preliminary decision, but further research could improve accuracy.',
    prompt: 'How do you decide whether to proceed or research further?',
    instruction: 'Choose your decision heuristic.',
    options: [
      {
        id: 'q25_bba_ph',
        text: 'Identify what unresolved assumptions could materially change the decision.',
        dimension: 'PH',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q25_bba_ex',
        text: 'Run a small additional analysis to test the most important uncertainty.',
        dimension: 'EX',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q25_bba_st',
        text: 'Use the agreed decision process and make the decision within the required timeline.',
        dimension: 'ST',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q25_bba_siq',
        text: 'Clarify how much uncertainty the decision-maker is comfortable accepting.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q26_BBA_UNEXPECTED_SUCCESS',
    title: 'Unexpected Strategy Success',
    scenario: 'A pilot growth strategy performs significantly better than your team predicted.',
    prompt: 'What do you naturally do next?',
    instruction: 'Choose your follow-up action.',
    options: [
      {
        id: 'q26_bba_ph',
        text: 'Investigate which underlying factors caused the stronger result.',
        dimension: 'PH',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q26_bba_ex',
        text: 'Try another controlled variation to see whether the effect can be reproduced.',
        dimension: 'EX',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q26_bba_st',
        text: 'Document what worked and incorporate it into the operating process.',
        dimension: 'ST',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q26_bba_siq',
        text: 'Talk to customers or team members to understand why the strategy worked from their perspective.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'learning'
      }
    ]
  },
  {
    id: 'Q27_BBA_PERFORMANCE_GAP',
    title: 'Two Team Members Performing Differently',
    scenario: 'One team member is consistently finishing work early, while another is consistently missing deadlines.',
    prompt: 'What do you do first as manager?',
    instruction: 'Choose your natural management intervention.',
    options: [
      {
        id: 'q27_bba_ph',
        text: 'Understand whether differences in workload, dependencies or task complexity explain the performance gap.',
        dimension: 'PH',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q27_bba_ex',
        text: 'Try a different allocation of work for a small period and observe what happens.',
        dimension: 'EX',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q27_bba_st',
        text: 'Clarify expectations, responsibilities and deadlines for both people.',
        dimension: 'ST',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q27_bba_siq',
        text: 'Speak individually with both people to understand what is affecting their performance.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'collaboration'
      }
    ]
  },
  {
    id: 'Q28_BBA_NEW_TEAM_RESPONSIBILITY',
    title: 'Responsible for a New Team',
    scenario: 'You are given leadership responsibility for a cross-functional business team you have not worked with before.',
    prompt: 'What do you do first in Week 1?',
    instruction: 'Choose your initial leadership priority.',
    options: [
      {
        id: 'q28_bba_siq',
        text: "Understand the team's expectations, concerns and working relationships.",
        dimension: 'SIQ',
        evidence: 2,
        context: 'starting'
      },
      {
        id: 'q28_bba_ph',
        text: "Understand the team's structure, responsibilities and dependencies.",
        dimension: 'PH',
        evidence: 2,
        context: 'starting'
      },
      {
        id: 'q28_bba_ex',
        text: "Try a small working approach and learn from the team's response.",
        dimension: 'EX',
        evidence: 2,
        context: 'starting'
      },
      {
        id: 'q28_bba_st',
        text: 'Establish objectives, responsibilities, routines and operating expectations.',
        dimension: 'ST',
        evidence: 2,
        context: 'starting'
      }
    ]
  }
];

/* ==========================================================================
   PART 4 — BBA / MBA BEHAVIORAL TRADE-OFF PROBES (Q29 – Q32)
   ========================================================================== */

export const BBA_TRADEOFF_PROBES: TradeoffProbe[] = [
  {
    id: 'Q29_BBA_RESEARCH_VS_ACTION',
    title: 'Research vs Immediate Action',
    scenario: 'You are evaluating an urgent new business opportunity. You could continue researching for another week, or launch a small test now.',
    prompt: 'Which tension pressure do you align with more naturally?',
    tradeoffType: 'depth_vs_speed',
    options: [
      {
        id: 'q29_bba_research',
        text: 'Research further because an important underlying assumption may still be wrong.',
        pole: 'analytical_depth',
        dimensionAffinity: 'PH'
      },
      {
        id: 'q29_bba_action',
        text: 'Run a small experiment now and learn from the empirical result.',
        pole: 'fast_progress',
        dimensionAffinity: 'EX'
      }
    ]
  },
  {
    id: 'Q30_BBA_STRATEGY_VS_EXECUTION',
    title: 'Strategy Formulation vs Practical Execution',
    scenario: 'Your team has formulated an impressive business strategy, but has not yet implemented anything operationally.',
    prompt: 'What concerns you most about the strategy?',
    tradeoffType: 'plan_vs_adapt',
    options: [
      {
        id: 'q30_bba_strategy',
        text: "Whether the strategy's underlying analytical assumptions are verified and logically sound.",
        pole: 'structured_plan',
        dimensionAffinity: 'PH'
      },
      {
        id: 'q30_bba_execution',
        text: 'Whether there is a practical execution system with clear ownership and measurable delivery controls.',
        pole: 'adaptive_pivot',
        dimensionAffinity: 'ST'
      }
    ]
  },
  {
    id: 'Q31_BBA_LEADERSHIP_DECISION',
    title: 'Leadership Decision Under Time Pressure',
    scenario: 'A crucial business decision must be finalized by 5 PM today, but the team has incomplete information.',
    prompt: 'How do you lead the decision?',
    tradeoffType: 'explore_vs_finish',
    options: [
      {
        id: 'q31_bba_identify_unknowns',
        text: 'Identify and pressure-test the most important unknown variables before locking the decision.',
        pole: 'exploration',
        dimensionAffinity: 'PH'
      },
      {
        id: 'q31_bba_make_decision',
        text: 'Make the best decision using explicit criteria, assign clear owners, and establish rigorous follow-up.',
        pole: 'execution',
        dimensionAffinity: 'ST'
      }
    ]
  },
  {
    id: 'Q32_BBA_INTERDEPARTMENTAL_CONFLICT',
    title: 'Conflict Between Departments',
    scenario: 'Marketing wants one launch direction, Operations wants another, and Finance insists on something completely different.',
    prompt: 'How do you resolve the interdepartmental impasse?',
    tradeoffType: 'solo_vs_consult',
    options: [
      {
        id: 'q32_bba_map_constraints',
        text: 'Map the analytical assumptions, operational dependencies, and financial constraints behind each position.',
        pole: 'independent_investigation',
        dimensionAffinity: 'PH'
      },
      {
        id: 'q32_bba_align_stakeholders',
        text: 'Understand the distinct priorities of each department leader and facilitate cross-functional alignment.',
        pole: 'perspective_coordination',
        dimensionAffinity: 'SIQ'
      }
    ]
  }
];

/* ==========================================================================
   PART 5 — BBA / MBA FREQUENCY BEHAVIORAL MATRIX (M1 – M4)
   ========================================================================== */

export const BBA_MATRIX_SCENARIOS: MatrixScenario[] = [
  {
    id: 'M1_BBA_BUSINESS_PROBLEM',
    title: 'Business Problem',
    scenario: 'You receive a business problem with an unclear cause.',
    context: 'debugging',
    items: [
      { id: 'm1_bba_ph', dimension: 'PH', statement: 'I break the problem into possible drivers and relationships.' },
      { id: 'm1_bba_ex', dimension: 'EX', statement: 'I try small analyses or approaches to discover what might work.' },
      { id: 'm1_bba_st', dimension: 'ST', statement: 'I define a systematic process for investigating the problem.' },
      { id: 'm1_bba_siq', dimension: 'SIQ', statement: 'I gather perspectives from the people affected by the problem.' }
    ]
  },
  {
    id: 'M2_BBA_UNCERTAIN_DECISION',
    title: 'Decision Under Uncertainty',
    scenario: 'You must recommend a decision without having complete information.',
    context: 'uncertainty',
    items: [
      { id: 'm2_bba_ph', dimension: 'PH', statement: 'I identify the assumptions that could materially change the recommendation.' },
      { id: 'm2_bba_ex', dimension: 'EX', statement: 'I test alternative scenarios or approaches.' },
      { id: 'm2_bba_st', dimension: 'ST', statement: 'I use explicit criteria and move through the decision process systematically.' },
      { id: 'm2_bba_siq', dimension: 'SIQ', statement: 'I consider the constraints and perspectives of the stakeholders involved.' }
    ]
  },
  {
    id: 'M3_BBA_TEAM_DELIVERY',
    title: 'Team Delivery',
    scenario: 'You are responsible for a team project.',
    context: 'delivery',
    items: [
      { id: 'm3_bba_ph', dimension: 'PH', statement: 'I identify dependencies and potential failure points.' },
      { id: 'm3_bba_ex', dimension: 'EX', statement: 'I look for ways to improve or simplify the approach.' },
      { id: 'm3_bba_st', dimension: 'ST', statement: 'I track work and ensure commitments are completed.' },
      { id: 'm3_bba_siq', dimension: 'SIQ', statement: 'I check that people understand responsibilities and expectations.' }
    ]
  },
  {
    id: 'M4_BBA_CUSTOMER_PROBLEM',
    title: 'Customer / Market Problem',
    scenario: 'Customer behavior does not match what the business expected.',
    context: 'feedback',
    items: [
      { id: 'm4_bba_ph', dimension: 'PH', statement: 'I investigate the underlying patterns and possible causes.' },
      { id: 'm4_bba_ex', dimension: 'EX', statement: 'I test alternative explanations with small experiments.' },
      { id: 'm4_bba_st', dimension: 'ST', statement: 'I verify the measurement process and analyze the problem systematically.' },
      { id: 'm4_bba_siq', dimension: 'SIQ', statement: 'I seek direct perspectives from customers or frontline employees.' }
    ]
  }
];

/* ==========================================================================
   PART 6 — SPECIALIZATION BRANCHES (Q33)
   ========================================================================== */

export interface BBASpecializationOption {
  id: string;
  label: string;
  description?: string;
  affinityDimension?: BehavioralDimension;
}

export interface BBASpecializationQuestion {
  domainId: string;
  questionId: string;
  title: string;
  subtitle: string;
  options: BBASpecializationOption[];
}

export const BBA_SPECIALIZATION_QUESTIONS: Record<string, BBASpecializationQuestion> = {
  corporate_finance: {
    domainId: 'corporate_finance',
    questionId: 'Q33_F_FINANCE',
    title: 'Finance / Corporate Finance Specialization',
    subtitle: "A company's profitability has declined. Which question would you most naturally investigate first?",
    options: [
      { id: 'spec_bba_f_drivers', label: 'Which financial and cost drivers explain the change? (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_bba_f_alternative', label: 'What alternative strategy or revenue model could improve it? (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_bba_f_process', label: 'Which part of the financial process needs immediate operational action? (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_bba_f_stakeholders', label: 'How are different business teams and department heads explaining the decline? (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  marketing_growth: {
    domainId: 'marketing_growth',
    questionId: 'Q33_M_MARKETING',
    title: 'Marketing / Growth Specialization',
    subtitle: 'A campaign gets high visibility but very few conversions. What interests you most?',
    options: [
      { id: 'spec_bba_m_funnel', label: 'Which part of the customer funnel is causing the drop? (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_bba_m_message', label: 'Which message, creative, or promotional offer should we test next? (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_bba_m_process', label: 'How should the campaign tracking and lead management process be restructured? (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_bba_m_experience', label: 'What are prospective customers actually experiencing or thinking? (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  sales_bizdev: {
    domainId: 'sales_bizdev',
    questionId: 'Q33_S_SALES',
    title: 'Sales / Business Development Specialization',
    subtitle: 'A sales team generates many inbound leads but closes very few conversions.',
    options: [
      { id: 'spec_bba_s_funnel', label: 'Analyze where and why the conversion funnel is breaking down. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_bba_s_trial', label: 'Try different pitch scripts and closing approaches with a small pilot group. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_bba_s_standardize', label: 'Standardize the qualification, CRM logging, and follow-up cadence. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_bba_s_objections', label: 'Speak with prospects directly to understand their authentic unstated objections. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  human_resources: {
    domainId: 'human_resources',
    questionId: 'Q33_H_HR',
    title: 'Human Resources & People Operations',
    subtitle: 'Employee retention has decreased noticeably across key operational departments.',
    options: [
      { id: 'spec_bba_h_patterns', label: 'Analyze attrition patterns by role, tenure, manager, compensation and workload. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_bba_h_intervention', label: 'Test a small targeted retention perk or scheduling intervention. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_bba_h_policy', label: 'Review and improve the employee onboarding, evaluation, and policy frameworks. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_bba_h_interviews', label: 'Conduct 1-on-1 interviews with departing and current employees to understand reasons. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  operations_supplychain: {
    domainId: 'operations_supplychain',
    questionId: 'Q33_O_OPERATIONS',
    title: 'Operations & Supply Chain Specialization',
    subtitle: 'An operational process is producing inconsistent throughput and unpredictable delivery times.',
    options: [
      { id: 'spec_bba_o_mapping', label: 'Map the end-to-end workflow and determine where variance originates. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_bba_o_prototype', label: 'Test a modified, streamlined process on a small batch scale. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_bba_o_sop', label: 'Standardize execution, introduce rigid controls, checklists and ownership. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_bba_o_operators', label: 'Speak directly with the line workers operating the process to understand friction points. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  consulting_strategy: {
    domainId: 'consulting_strategy',
    questionId: 'Q33_C_CONSULTING',
    title: 'Consulting & Business Strategy Specialization',
    subtitle: 'A corporate client approaches you: “Our core market growth has slowed. What should we do?”',
    options: [
      { id: 'spec_bba_c_hypotheses', label: 'Structure the problem into mutually exclusive hypotheses and root revenue drivers. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_bba_c_scenarios', label: 'Investigate several alternative strategic interventions and potential market entries. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_bba_c_roadmap', label: 'Build a practical, phased implementation plan with resource milestones. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_bba_c_stakeholders', label: "Understand the client leadership's internal politics, goals, and risk appetites. (Perspective Coordination)", affinityDimension: 'SIQ' }
    ]
  },
  entrepreneurship_startup: {
    domainId: 'entrepreneurship_startup',
    questionId: 'Q33_E_ENTREPRENEURSHIP',
    title: 'Entrepreneurship & Venture Building',
    subtitle: 'You have a compelling new business venture idea. What do you want to establish first?',
    options: [
      { id: 'spec_bba_e_unit_econ', label: 'What unit economic assumptions must be true for the business model to be viable? (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_bba_e_mvp', label: 'Whether a quick prototype or MVP test can empirically prove customer willingness to pay. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_bba_e_operating_plan', label: 'What startup capital, operating resources, and legal setup are required. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_bba_e_customer_pain', label: 'Whether prospective customers genuinely experience the pain point deeply. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  business_analytics: {
    domainId: 'business_analytics',
    questionId: 'Q33_A_ANALYTICS',
    title: 'Business Analytics & Decision Intelligence',
    subtitle: 'An executive dashboard highlights an unexpected shift in customer lifetime value (LTV).',
    options: [
      { id: 'spec_bba_a_variables', label: 'Investigate the multi-variable regressions and cohort relationships behind the trend. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_bba_a_hypotheses', label: 'Run alternative data slices and hypothesis tests to verify if the pattern is robust. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_bba_a_pipeline', label: 'Verify the data pipeline ETL integrity, tracking tags, and dashboard calculation logic. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_bba_a_business_context', label: 'Engage department heads to understand the real-world operational context behind the numbers. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  product_management: {
    domainId: 'product_management',
    questionId: 'Q33_P_PRODUCT',
    title: 'Product Management Specialization',
    subtitle: 'Users are suddenly abandoning a newly released core product feature after onboarding.',
    options: [
      { id: 'spec_bba_p_funnel', label: 'Analyze event telemetry to pinpoint exactly where and why the user journey breaks. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_bba_p_ab_test', label: 'Quickly design and deploy two alternative UX feature variants to A/B test. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_bba_p_specs', label: 'Re-organize product tickets into clear acceptance criteria, bug priorities, and sprint deliverables. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_bba_p_interviews', label: 'Conduct 5 user discovery interviews to hear directly about their frustrations. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  }
};
