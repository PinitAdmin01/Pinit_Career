// src/lib/onboarding/diagnosticRegistry.ts
/**
 * PinIT Career OS — Production Onboarding Diagnostic V1 Question Registry
 * 
 * CORE LAWS:
 * 1. Goal != Persona: Goal discovery questions NEVER directly increase or decrease PH, EX, ST, or SIQ.
 * 2. An answer is evidence, not a diagnosis.
 * 3. Options must be randomized at render; store optionId, never screen index A/B/C/D.
 * 4. Four Behavioral Operating Dimensions:
 *    - PH  : Pattern Hunter        -> Analytical Structuring
 *    - EX  : Explorer              -> Experimental Exploration
 *    - ST  : Stabilizer            -> Structured Execution
 *    - SIQ : Social IQ             -> Perspective Coordination
 */

export type BehavioralDimension = 'PH' | 'EX' | 'ST' | 'SIQ';

export type DiagnosticContext = 
  | 'scoping' 
  | 'debugging' 
  | 'delivery' 
  | 'learning' 
  | 'collaboration' 
  | 'feedback' 
  | 'unblocking' 
  | 'uncertainty' 
  | 'starting' 
  | 'completing';

export interface GoalDiscoveryOption {
  id: string;
  label: string;
  description?: string;
  mappedValue: string | number;
}

export interface GoalDiscoveryQuestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'single_select' | 'multi_select' | 'role_select';
  options: GoalDiscoveryOption[];
  maxSelections?: number;
}

export interface SJTOption {
  id: string;
  text: string;
  dimension: BehavioralDimension;
  evidence: number; // typically +2
  context: DiagnosticContext;
}

export interface SJTQuestion {
  id: string;
  title: string;
  scenario: string;
  prompt: string;
  instruction: string;
  options: SJTOption[];
}

export interface MatrixItem {
  id: string;
  dimension: BehavioralDimension;
  statement: string;
}

export interface MatrixScenario {
  id: string;
  title: string;
  scenario: string;
  context: DiagnosticContext;
  items: MatrixItem[];
}

export interface TradeoffOption {
  id: string;
  text: string;
  pole: 'exploration' | 'execution' | 'analytical_depth' | 'fast_progress' | 'independent_investigation' | 'perspective_coordination' | 'structured_plan' | 'adaptive_pivot';
  dimensionAffinity: BehavioralDimension;
}

export interface TradeoffProbe {
  id: string;
  title: string;
  scenario: string;
  prompt: string;
  tradeoffType: 'explore_vs_finish' | 'depth_vs_speed' | 'solo_vs_consult' | 'plan_vs_adapt';
  options: [TradeoffOption, TradeoffOption];
}

/* ==========================================================================
   PART A — GOAL DISCOVERY (Q1 – Q8)
   ========================================================================== */

export const GOAL_DISCOVERY_QUESTIONS: GoalDiscoveryQuestion[] = [
  {
    id: 'Q1_OUTCOME',
    title: 'Target Career Outcome',
    subtitle: 'What is the main outcome you want from PinIT Career OS?',
    type: 'single_select',
    options: [
      { id: 'opt_internship', label: 'Get an internship', description: 'Land a professional industry internship in the next 3–6 months', mappedValue: 'internship' },
      { id: 'opt_full_time', label: 'Get a full-time job', description: 'Secure an on-campus or off-campus entry-level or junior role', mappedValue: 'full_time_job' },
      { id: 'opt_freelance', label: 'Work independently / freelance', description: 'Build direct client projects, contract deliverables, or freelance agency', mappedValue: 'freelance' },
      { id: 'opt_portfolio', label: 'Build a portfolio & project-ready proof', description: 'Construct production-grade deliverables and pass technical screener audits', mappedValue: 'portfolio_ready' },
      { id: 'opt_higher_studies', label: 'Higher studies or competitive exams', description: 'Prepare strong academic foundations, GATE, GRE, or master track', mappedValue: 'higher_studies' },
      { id: 'opt_startup', label: 'Start building a business / product', description: 'Launch a tech MVP, SaaS application, or student venture', mappedValue: 'entrepreneurial' }
    ]
  },
  {
    id: 'Q2_PRIMARY_ROLE',
    title: 'Primary Career Track',
    subtitle: 'Which specific role are you primarily targeting?',
    type: 'role_select',
    options: [
      { id: 'role_frontend', label: 'Frontend Developer', description: 'React, Next.js, TypeScript, UI Architecture & CSS', mappedValue: 'frontend_developer' },
      { id: 'role_backend', label: 'Backend Developer', description: 'Node.js, Java Spring Boot, Python, SQL & APIs', mappedValue: 'backend_developer' },
      { id: 'role_fullstack', label: 'Full-Stack Developer', description: 'End-to-end web apps, databases, state & deployment', mappedValue: 'full_stack_developer' },
      { id: 'role_ai_ml', label: 'AI / Machine Learning Engineer', description: 'Python, PyTorch, LLMs, Vector DBs & Prompt Engineering', mappedValue: 'ai_ml_engineer' },
      { id: 'role_data_analytics', label: 'Data Analyst / Data Science', description: 'SQL, Python, Excel, PowerBI & Statistical Modeling', mappedValue: 'data_analyst' },
      { id: 'role_ui_ux', label: 'UI/UX Designer', description: 'Figma wireframing, design systems, usability research', mappedValue: 'ui_ux_designer' },
      { id: 'role_qa_automation', label: 'QA / Test Automation Engineer', description: 'Jest, Playwright, Cypress, CI test pipelines & TDD', mappedValue: 'qa_engineer' },
      { id: 'role_cybersecurity', label: 'Cybersecurity Analyst', description: 'Network defense, security audits, OWASP & vulnerability management', mappedValue: 'cybersecurity' },
      { id: 'role_cloud_devops', label: 'Cloud & DevOps Engineer', description: 'Docker, Kubernetes, AWS/GCP, Terraform & CI/CD', mappedValue: 'cloud_devops' },
      { id: 'role_product_mgmt', label: 'Product & Project Manager', description: 'PRDs, user stories, agile sprints, roadmaps & metrics', mappedValue: 'product_manager' },
      { id: 'role_fintech_analyst', label: 'Financial & FinTech Analyst', description: 'Financial modeling, valuation, Excel, SQL, ledger audit', mappedValue: 'financial_analyst' },
      { id: 'role_digital_marketing', label: 'Digital Marketing & Growth Lead', description: 'Growth funnels, SEO, content strategy & conversion analytics', mappedValue: 'digital_marketing' }
    ]
  },
  {
    id: 'Q3_HORIZON',
    title: 'Target Goal Horizon',
    subtitle: 'When do you need to reach this outcome?',
    type: 'single_select',
    options: [
      { id: 'horizon_3m', label: 'Within 3 months', description: 'Intensive sprint: high prioritization, minimum viable core, rapid shipping', mappedValue: 3 },
      { id: 'horizon_6m', label: '3–6 months', description: 'Balanced fellowship: solid project progression, interview drills & mock exams', mappedValue: 6 },
      { id: 'horizon_12m', label: '6–12 months', description: 'Comprehensive track: deep skill coverage, large capstones, enterprise grade', mappedValue: 12 },
      { id: 'horizon_24m', label: '1–2 years', description: 'Long-term foundational mastery: multi-tier specialization & degree tracks', mappedValue: 24 },
      { id: 'horizon_exploring', label: 'I am exploring and do not know yet', description: 'Flexible exploration: exploratory modules with dynamic recalibration', mappedValue: 0 }
    ]
  },
  {
    id: 'Q4_MOTIVATION',
    title: 'Core Motivation',
    subtitle: 'Why is this goal important to you?',
    type: 'single_select',
    options: [
      { id: 'mot_job', label: 'I want a high-paying job or internship', mappedValue: 'career_placement' },
      { id: 'mot_independence', label: 'I want financial independence and stability', mappedValue: 'financial_independence' },
      { id: 'mot_enjoyment', label: 'I genuinely enjoy building software and solving technical problems', mappedValue: 'intrinsic_enjoyment' },
      { id: 'mot_mastery', label: 'I want to master difficult skills and prove my capability', mappedValue: 'self_mastery' },
      { id: 'mot_startup', label: 'I want to build my own products and venture', mappedValue: 'venture_creation' },
      { id: 'mot_expectation', label: 'Family, university, or external expectations', mappedValue: 'external_expectation' },
      { id: 'mot_exploring', label: 'I am curious and discovering what suits me', mappedValue: 'curiosity' }
    ]
  },
  {
    id: 'Q5_EXPERIENCE',
    title: 'Prior Experience Artifacts',
    subtitle: 'What have you already done in this field? (Select all that apply)',
    type: 'multi_select',
    options: [
      { id: 'exp_nothing', label: 'Nothing yet — starting fresh from scratch', mappedValue: 'fresh_start' },
      { id: 'exp_coursework', label: 'College coursework & laboratory assignments', mappedValue: 'college_coursework' },
      { id: 'exp_personal_proj', label: 'Built personal hobby projects', mappedValue: 'personal_project' },
      { id: 'exp_college_proj', label: 'Final year or semester group project', mappedValue: 'college_project' },
      { id: 'exp_hackathon', label: 'Competed in a Hackathon or coding contest', mappedValue: 'hackathon' },
      { id: 'exp_cert', label: 'Completed online certification or course', mappedValue: 'certification' },
      { id: 'exp_internship', label: 'Completed an industry internship', mappedValue: 'internship' },
      { id: 'exp_freelance', label: 'Completed paid freelance or client work', mappedValue: 'freelance' },
      { id: 'exp_opensource', label: 'Contributed to open-source software (GitHub PR)', mappedValue: 'open_source' },
      { id: 'exp_production', label: 'Deployed live application with real users/customers', mappedValue: 'production_deployment' }
    ]
  },
  {
    id: 'Q6_CAPABILITY',
    title: 'Self-Perceived Capability',
    subtitle: 'Which statement best describes your present capability?',
    type: 'single_select',
    options: [
      { id: 'cap_concepts_only', label: 'I mostly understand concepts but struggle to build independently', mappedValue: 'theory_only' },
      { id: 'cap_guided_builder', label: 'I can build simple things when following a tutorial or guidance', mappedValue: 'guided_builder' },
      { id: 'cap_independent_needs_help', label: 'I can build projects independently but get stuck on complex bugs or architecture', mappedValue: 'independent_intermediate' },
      { id: 'cap_confident_builder', label: 'I can independently build, debug, and finish real software projects', mappedValue: 'independent_advanced' },
      { id: 'cap_production_ready', label: 'I can build, test, deploy, and explain complex systems with confidence', mappedValue: 'production_ready' }
    ]
  },
  {
    id: 'Q7_TIME_BUDGET',
    title: 'Daily Dedicated Time',
    subtitle: 'How much time can you realistically invest into PinIT each day?',
    type: 'single_select',
    options: [
      { id: 'time_micro', label: 'Less than 30 minutes / day', description: 'Micro-learning pace (1 quest / day)', mappedValue: 25 },
      { id: 'time_short', label: '30–60 minutes / day', description: 'Steady sprint pace (2 quests / day)', mappedValue: 45 },
      { id: 'time_standard', label: '1–2 hours / day', description: 'Recommended industry pace (3 quests / day)', mappedValue: 90 },
      { id: 'time_intensive', label: '2–3 hours / day', description: 'Accelerated bootcamp pace (4–5 quests / day)', mappedValue: 150 },
      { id: 'time_fulltime', label: '3+ hours / day', description: 'Full-time immersive fellowship pace (6+ quests / day)', mappedValue: 200 }
    ]
  },
  {
    id: 'Q8_PRIMARY_CONSTRAINTS',
    title: 'Primary Constraints & Blockers',
    subtitle: 'What currently limits your progress the most? (Choose up to 3)',
    type: 'multi_select',
    maxSelections: 3,
    options: [
      { id: 'con_time', label: 'Lack of daily time / college schedule pressure', mappedValue: 'time_scarcity' },
      { id: 'con_knowledge', label: 'Not knowing what to learn or where to start', mappedValue: 'knowledge_roadmap_gap' },
      { id: 'con_consistency', label: 'Starting projects with enthusiasm but not finishing them', mappedValue: 'consistency_execution_gap' },
      { id: 'con_confidence', label: 'Lack of confidence / imposter syndrome', mappedValue: 'confidence_gap' },
      { id: 'con_communication', label: 'Difficulty communicating or speaking in English interviews', mappedValue: 'communication_gap' },
      { id: 'con_projects', label: 'Finding realistic project ideas that recruiters respect', mappedValue: 'portfolio_project_gap' },
      { id: 'con_distraction', label: 'Tool-hopping or easily getting distracted by new frameworks', mappedValue: 'tool_hopping_distraction' },
      { id: 'con_expectations', label: 'Not knowing what companies actually expect in technical rounds', mappedValue: 'market_expectations_gap' },
      { id: 'con_interview', label: 'Freezing under live coding interview conditions', mappedValue: 'interview_pressure_gap' }
    ]
  }
];

/* ==========================================================================
   PART B — BEHAVIORAL SITUATIONAL JUDGEMENT TESTS (Q9 – Q20)
   ========================================================================== */

export const SJT_INSTRUCTION = 'Choose what you would actually do first, not the answer that sounds most professional. There is no "good student" answer.';

export const SJT_QUESTIONS: SJTQuestion[] = [
  {
    id: 'Q9_UNCLEAR_ASSIGNMENT',
    title: 'Unclear Assignment',
    scenario: 'You receive a task: "Build the user authentication experience and make it production ready." You are given no further specifications.',
    prompt: 'What do you do first?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q9_ph',
        text: 'Break the task into assumptions, technical unknowns, security dependencies, and core system questions.',
        dimension: 'PH',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q9_ex',
        text: 'Build a small prototype authentication form immediately to discover what is missing hands-on.',
        dimension: 'EX',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q9_st',
        text: 'Define the required deliverables, acceptance criteria, test cases, and a sequence of work steps.',
        dimension: 'ST',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q9_siq',
        text: 'Ask the person who assigned it what users actually need and clarify ambiguous business requirements.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'scoping'
      }
    ]
  },
  {
    id: 'Q10_MULTIPLE_CAUSE_BUG',
    title: 'Multi-Cause Bug',
    scenario: 'A critical feature in your project suddenly stops working, and there are several possible reasons.',
    prompt: 'What do you do first?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q10_ex',
        text: 'Create a quick, isolated test harness to test conditions and see which change reproduces the failure.',
        dimension: 'EX',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q10_ph',
        text: 'Trace the data flow backwards through the code, mapping assumptions and finding the root architectural flaw.',
        dimension: 'PH',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q10_st',
        text: 'Check recent git commits, verify against specifications, and step through your checklist systematically.',
        dimension: 'ST',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q10_siq',
        text: 'Ask the person who reported the bug to reproduce it while explaining exactly what they saw and felt.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q11_DEADLINE_MOVED_FORWARD',
    title: 'Deadline Moved Forward',
    scenario: 'Your project deadline is suddenly moved from next Friday to tomorrow afternoon.',
    prompt: 'What do you do first?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q11_st',
        text: 'Identify the minimum acceptable deliverable, freeze non-essential work, and execute a strict schedule.',
        dimension: 'ST',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q11_siq',
        text: 'Talk with the stakeholder to clarify what parts are non-negotiable and negotiate what can be postponed.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q11_ex',
        text: 'Identify the highest-risk unknown component and run a fast experimental spike to clear it.',
        dimension: 'EX',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q11_ph',
        text: 'Analyze the system dependencies to determine which critical components can fail under compressed time.',
        dimension: 'PH',
        evidence: 2,
        context: 'delivery'
      }
    ]
  },
  {
    id: 'Q12_UNFAMILIAR_TECH',
    title: 'Unfamiliar Technology',
    scenario: 'You need to use a framework or library you have never seen before for an important milestone.',
    prompt: 'How do you approach learning it?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q12_ex',
        text: 'Build a tiny sandbox prototype right away and play with the code to see how it behaves.',
        dimension: 'EX',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q12_ph',
        text: 'Read the official architectural docs first to understand the mental model, lifecycles, and core patterns.',
        dimension: 'PH',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q12_st',
        text: 'Follow a structured tutorial curriculum step-by-step and complete each exercise before building.',
        dimension: 'ST',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q12_siq',
        text: 'Look at open-source production projects to see how experienced developers structure it and ask questions in forums.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'learning'
      }
    ]
  },
  {
    id: 'Q13_TEAMMATE_DISAGREEMENT',
    title: 'Teammate Technical Disagreement',
    scenario: 'A teammate strongly argues against your technical approach and suggests a completely different architecture.',
    prompt: 'What do you do first?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q13_siq',
        text: 'Listen to their full perspective and understand their context, trade-offs, and reasoning before responding.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q13_ph',
        text: 'Compare both technical designs objectively on latency, modularity, and algorithmic efficiency.',
        dimension: 'PH',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q13_ex',
        text: 'Build a quick benchmark test pitting both solutions against each other with real sample data.',
        dimension: 'EX',
        evidence: 2,
        context: 'collaboration'
      },
      {
        id: 'q13_st',
        text: 'Agree on explicit evaluation criteria (stability, maintainability, deadline) and select the safest route.',
        dimension: 'ST',
        evidence: 2,
        context: 'collaboration'
      }
    ]
  },
  {
    id: 'Q14_SCOPE_CREEP',
    title: 'Expanding Scope',
    scenario: 'A project that originally had 5 features has now expanded to 12 requested features with no deadline extension.',
    prompt: 'What do you do first?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q14_ph',
        text: 'Map all new dependencies to analyze how additional features destabilize the core system architecture.',
        dimension: 'PH',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q14_siq',
        text: 'Discuss with users/mentors to clarify which three features deliver 80% of the true perceived value.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q14_st',
        text: 'Freeze version 1.0 at the original scope and move all new requests into a formal Phase 2 backlog.',
        dimension: 'ST',
        evidence: 2,
        context: 'scoping'
      },
      {
        id: 'q14_ex',
        text: 'Quickly experiment with a lightweight 3rd-party library to see if it can handle several requests at once.',
        dimension: 'EX',
        evidence: 2,
        context: 'scoping'
      }
    ]
  },
  {
    id: 'Q15_FAILED_SOLUTION',
    title: 'First Solution Fails',
    scenario: 'You invested 4 hours into an approach you were confident would work, but it completely failed.',
    prompt: 'What do you naturally do next?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q15_ex',
        text: 'Change a key variable, pivot to an alternative technique, and test the new idea immediately.',
        dimension: 'EX',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q15_ph',
        text: 'Step back to analyze your original assumptions and find the exact logical flaw in your deduction.',
        dimension: 'PH',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q15_st',
        text: 'Re-read the specifications and error logs line-by-line to ensure you did not violate an explicit constraint.',
        dimension: 'ST',
        evidence: 2,
        context: 'debugging'
      },
      {
        id: 'q15_siq',
        text: 'Explain the problem out loud to a peer or rubber duck to get an external angle on why it failed.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q16_USER_FEEDBACK_CONFLICT',
    title: 'User Feedback Conflict',
    scenario: 'A user tests your project and says: "It is technically impressive, but confusing and difficult for me to use."',
    prompt: 'What is your immediate response?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q16_siq',
        text: 'Ask them to show you where they felt lost and listen without defending your technical choices.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q16_ph',
        text: 'Examine the user journey flow and mental model to locate where the interaction pattern broke down.',
        dimension: 'PH',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q16_ex',
        text: 'Build two alternative interaction sketches right away and ask the user which feels more natural.',
        dimension: 'EX',
        evidence: 2,
        context: 'feedback'
      },
      {
        id: 'q16_st',
        text: 'Convert the critique into concrete usability requirements with measurable pass/fail acceptance criteria.',
        dimension: 'ST',
        evidence: 2,
        context: 'feedback'
      }
    ]
  },
  {
    id: 'Q17_PROJECT_STUCK',
    title: 'Project Movement Blocked',
    scenario: 'A team project has stalled because members disagree on the next step and motivation is dropping.',
    prompt: 'What do you do first to get it moving?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q17_siq',
        text: 'Check in with each person individually to understand their concerns and align everyone on a shared goal.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'unblocking'
      },
      {
        id: 'q17_ph',
        text: 'Pinpoint the single technical blocker or missing decision that is causing the paralysis.',
        dimension: 'PH',
        evidence: 2,
        context: 'unblocking'
      },
      {
        id: 'q17_ex',
        text: 'Suggest building a quick disposable prototype to get momentum back instead of debating.',
        dimension: 'EX',
        evidence: 2,
        context: 'unblocking'
      },
      {
        id: 'q17_st',
        text: 'Establish clear owners for the next three immediate actions, set dates, and document the workflow.',
        dimension: 'ST',
        evidence: 2,
        context: 'unblocking'
      }
    ]
  },
  {
    id: 'Q18_TWO_LEARNING_PATHS',
    title: 'Two Competing Learning Paths',
    scenario: 'You can either deeply master one technology for 3 months, or build 4 mini projects across 4 different technologies.',
    prompt: 'What feels most natural to you?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q18_st',
        text: 'Pick one proven technology and follow a structured curriculum until you achieve complete mastery.',
        dimension: 'ST',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q18_ph',
        text: 'Analyze the underlying architectural differences and pick the one with superior long-term principles.',
        dimension: 'PH',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q18_ex',
        text: 'Build mini projects with each technology to experience how they actually feel in practice.',
        dimension: 'EX',
        evidence: 2,
        context: 'learning'
      },
      {
        id: 'q18_siq',
        text: 'Talk with engineers working in your target role and ask which toolset opened the most doors for them.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'learning'
      }
    ]
  },
  {
    id: 'Q19_CRUNCH_BEFORE_DEMO',
    title: 'Showstopper Bug 10 Mins Before Demo',
    scenario: 'Ten minutes before demonstrating your live project to evaluators, a major component crashes.',
    prompt: 'What do you do first?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q19_st',
        text: 'Disable the broken component and revert to the last stable release that is guaranteed to run cleanly.',
        dimension: 'ST',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q19_ex',
        text: 'Try a fast one-line workaround or monkey patch to bypass the failing condition.',
        dimension: 'EX',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q19_ph',
        text: 'Inspect the stack trace with laser focus to find the exact line causing the runtime exception.',
        dimension: 'PH',
        evidence: 2,
        context: 'delivery'
      },
      {
        id: 'q19_siq',
        text: 'Frame the presentation narrative so the demo focuses on the working highlights, explaining the bug transparently.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'delivery'
      }
    ]
  },
  {
    id: 'Q20_AMBIGUOUS_CHALLENGE',
    title: 'Ambiguous Challenge',
    scenario: 'You are presented with an open-ended problem that has no obvious tutorial or known solution pattern.',
    prompt: 'What feels most natural to you?',
    instruction: SJT_INSTRUCTION,
    options: [
      {
        id: 'q20_ph',
        text: 'Decompose the ambiguity into fundamental first-principles questions and structured sub-problems.',
        dimension: 'PH',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q20_ex',
        text: 'Try several creative, lightweight ideas quickly to see what happens and learn from the failures.',
        dimension: 'EX',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q20_st',
        text: 'Create a repeatable research process and work systematically toward a defined, testable outcome.',
        dimension: 'ST',
        evidence: 2,
        context: 'uncertainty'
      },
      {
        id: 'q20_siq',
        text: 'Reach out to people who have encountered adjacent problems and synthesize their experiences.',
        dimension: 'SIQ',
        evidence: 2,
        context: 'uncertainty'
      }
    ]
  }
];

/* ==========================================================================
   PART C — BEHAVIORAL FREQUENCY MATRIX (M1 – M4)
   ========================================================================== */

export const MATRIX_SCALE_CONFIG = {
  1: { label: 'Almost Never', evidence: 0.0 },
  2: { label: 'Rarely',       evidence: 0.5 },
  3: { label: 'Sometimes',    evidence: 1.0 },
  4: { label: 'Often',        evidence: 1.5 },
  5: { label: 'Almost Always',evidence: 2.0 },
};

export const MATRIX_SCENARIOS: MatrixScenario[] = [
  {
    id: 'M1_STARTING_PROJECT',
    title: 'Starting an Unfamiliar Project',
    scenario: 'You are assigned a complex project or codebase you have never worked on before.',
    context: 'starting',
    items: [
      { id: 'M1_PH', dimension: 'PH', statement: 'I break the problem into parts and identify what I do not yet understand.' },
      { id: 'M1_EX', dimension: 'EX', statement: 'I build a small throwaway version quickly to learn what works hands-on.' },
      { id: 'M1_ST', dimension: 'ST', statement: 'I define the expected deliverables and create a sequence of structured tasks.' },
      { id: 'M1_SIQ', dimension: 'SIQ', statement: 'I identify who has important context and ask targeted questions to clarify expectations.' }
    ]
  },
  {
    id: 'M2_WHEN_SOMETHING_FAILS',
    title: 'When Something Goes Wrong',
    scenario: 'A feature you built behaves completely differently from what was expected.',
    context: 'debugging',
    items: [
      { id: 'M2_PH', dimension: 'PH', statement: 'I trace the problem backwards through assumptions and dependencies to find the root cause.' },
      { id: 'M2_EX', dimension: 'EX', statement: 'I isolate variables and test alternative explanations by running rapid code changes.' },
      { id: 'M2_ST', dimension: 'ST', statement: 'I compare the current implementation against the original requirements and checklists.' },
      { id: 'M2_SIQ', dimension: 'SIQ', statement: 'I ask another person what they observed to verify if my perspective is biased.' }
    ]
  },
  {
    id: 'M3_WORKING_UNDER_UNCERTAINTY',
    title: 'Working Under Uncertainty',
    scenario: 'You do not know the best way to solve a difficult technical problem.',
    context: 'uncertainty',
    items: [
      { id: 'M3_PH', dimension: 'PH', statement: 'I decompose the uncertainty into smaller, logically solvable sub-questions.' },
      { id: 'M3_EX', dimension: 'EX', statement: 'I try multiple experimental approaches in parallel and learn from the results.' },
      { id: 'M3_ST', dimension: 'ST', statement: 'I define a manageable, structured process and move through it step-by-step.' },
      { id: 'M3_SIQ', dimension: 'SIQ', statement: 'I seek out perspectives from people who bring different experience or constraints.' }
    ]
  },
  {
    id: 'M4_COMPLETING_IMPORTANT_WORK',
    title: 'Completing Important Deliverables',
    scenario: 'You are personally responsible for delivering a milestone that significantly impacts your career.',
    context: 'completing',
    items: [
      { id: 'M4_PH', dimension: 'PH', statement: 'I review all architectural dependencies and edge cases to ensure zero hidden flaws.' },
      { id: 'M4_EX', dimension: 'EX', statement: 'I explore last-mile improvements and alternative features that could elevate the project.' },
      { id: 'M4_ST', dimension: 'ST', statement: 'I track progress relentlessly to ensure the deliverables reach 100% completion.' },
      { id: 'M4_SIQ', dimension: 'SIQ', statement: 'I verify that the stakeholders and evaluators understand the result and next steps.' }
    ]
  }
];

/* ==========================================================================
   PART D — DIRECT TRADE-OFF PROBES (Q21 – Q24)
   ========================================================================== */

export const TRADEOFF_PROBES: TradeoffProbe[] = [
  {
    id: 'Q21_EXPLORE_VS_FINISH',
    title: 'Explore vs. Finish',
    scenario: 'Your project already meets all minimum requirements. You have one day left.',
    prompt: 'Which choice do you naturally prefer?',
    tradeoffType: 'explore_vs_finish',
    options: [
      {
        id: 'q21_a',
        text: 'Spend the remaining day investigating potentially better architectures or exciting new features.',
        pole: 'exploration',
        dimensionAffinity: 'EX'
      },
      {
        id: 'q21_b',
        text: 'Lock the current implementation, double-check test suites, and polish the final deliverable.',
        pole: 'execution',
        dimensionAffinity: 'ST'
      }
    ]
  },
  {
    id: 'Q22_DEPTH_VS_SPEED',
    title: 'Deep Understanding vs. Fast Progress',
    scenario: 'You are studying a new technical topic required for an upcoming deadline.',
    prompt: 'How do you prefer to invest your study time?',
    tradeoffType: 'depth_vs_speed',
    options: [
      {
        id: 'q22_a',
        text: 'Understand how the underlying system works deeply from first principles before writing code.',
        pole: 'analytical_depth',
        dimensionAffinity: 'PH'
      },
      {
        id: 'q22_b',
        text: 'Learn just enough to get it running, then learn the deeper nuances through building and practice.',
        pole: 'fast_progress',
        dimensionAffinity: 'EX'
      }
    ]
  },
  {
    id: 'Q23_SOLO_VS_CONSULT',
    title: 'Independent Investigation vs. Perspective Seeking',
    scenario: 'You hit an unexpected technical roadblock in your code.',
    prompt: 'What is your natural instinct?',
    tradeoffType: 'solo_vs_consult',
    options: [
      {
        id: 'q23_a',
        text: 'Exhaust all personal research, debugging, and documentation searches before asking anyone.',
        pole: 'independent_investigation',
        dimensionAffinity: 'PH'
      },
      {
        id: 'q23_b',
        text: 'Ask a colleague, mentor, or peer early to confirm whether this is a known issue before wasting hours.',
        pole: 'perspective_coordination',
        dimensionAffinity: 'SIQ'
      }
    ]
  },
  {
    id: 'Q24_PLAN_VS_ADAPT',
    title: 'Follow Plan vs. Adapt to Discovery',
    scenario: 'Halfway through a planned project, you discover a new technology that makes parts of your plan suboptimal.',
    prompt: 'What do you decide to do?',
    tradeoffType: 'plan_vs_adapt',
    options: [
      {
        id: 'q24_a',
        text: 'Stick to the established plan and finish on schedule; apply the new discovery in a later project.',
        pole: 'structured_plan',
        dimensionAffinity: 'ST'
      },
      {
        id: 'q24_b',
        text: 'Adjust your plan immediately to integrate the better solution, even if it shifts the schedule.',
        pole: 'adaptive_pivot',
        dimensionAffinity: 'EX'
      }
    ]
  }
];

/* ==========================================================================
   PART 0 — DEGREE & EDUCATIONAL STREAM SELECTION (STEP 0)
   ========================================================================== */

export const DEGREE_SELECTION_QUESTION: GoalDiscoveryQuestion = {
  id: 'Q0_DEGREE',
  title: 'Degree & Educational Stream',
  subtitle: 'Select your degree track so PinIT calibrates your curriculum, problem contexts, and diagnostic scenarios.',
  type: 'single_select',
  options: [
    {
      id: 'degree_btech_bca_mca',
      label: 'B.Tech / BCA / MCA / Computer Science / Engineering',
      description: 'Software development, backend, cloud, AI/ML, cybersecurity, systems engineering',
      mappedValue: 'btech_bca_mca'
    },
    {
      id: 'degree_bcom_mcom',
      label: 'B.Com / M.Com / Commerce & Finance',
      description: 'Accounting, banking, auditing, financial markets, taxation, business analytics',
      mappedValue: 'bcom_mcom'
    },
    {
      id: 'degree_bba_mba',
      label: 'BBA / MBA / Business Management',
      description: 'Product management, corporate operations, consulting, marketing & growth',
      mappedValue: 'bba_mba'
    },
    {
      id: 'degree_other',
      label: 'Other / Non-Tech Degree',
      description: 'Arts, humanities, physical sciences, interdisciplinary, general exploration',
      mappedValue: 'other'
    }
  ]
};

/* ==========================================================================
   MULTI-STREAM REGISTRY ACCESSORS & LOOKUP UNION
   ========================================================================== */

import {
  BCOM_GOAL_DISCOVERY_QUESTIONS,
  BCOM_SJT_QUESTIONS,
  BCOM_MATRIX_SCENARIOS,
  BCOM_TRADEOFF_PROBES,
  COMMERCE_SPECIALIZATION_QUESTIONS
} from './diagnosticRegistryCommerce';

export {
  BCOM_GOAL_DISCOVERY_QUESTIONS,
  BCOM_SJT_QUESTIONS,
  BCOM_MATRIX_SCENARIOS,
  BCOM_TRADEOFF_PROBES,
  COMMERCE_SPECIALIZATION_QUESTIONS
};

/**
 * Returns stream-specific Goal Discovery questions.
 */
export function getGoalDiscoveryQuestions(degreeTrack: string = 'btech_bca_mca'): GoalDiscoveryQuestion[] {
  const norm = (degreeTrack || '').toLowerCase();
  if (norm.includes('bcom') || norm.includes('mcom') || norm.includes('commerce') || norm.includes('finance')) {
    return BCOM_GOAL_DISCOVERY_QUESTIONS;
  }
  return GOAL_DISCOVERY_QUESTIONS;
}

/**
 * Returns stream-specific Behavioral SJT questions.
 */
export function getSjtQuestions(degreeTrack: string = 'btech_bca_mca'): SJTQuestion[] {
  const norm = (degreeTrack || '').toLowerCase();
  if (norm.includes('bcom') || norm.includes('mcom') || norm.includes('commerce') || norm.includes('finance')) {
    return BCOM_SJT_QUESTIONS;
  }
  return SJT_QUESTIONS;
}

/**
 * Returns stream-specific Frequency Matrix scenarios.
 */
export function getMatrixScenarios(degreeTrack: string = 'btech_bca_mca'): MatrixScenario[] {
  const norm = (degreeTrack || '').toLowerCase();
  if (norm.includes('bcom') || norm.includes('mcom') || norm.includes('commerce') || norm.includes('finance')) {
    return BCOM_MATRIX_SCENARIOS;
  }
  return MATRIX_SCENARIOS;
}

/**
 * Returns stream-specific Tradeoff probes.
 */
export function getTradeoffProbes(degreeTrack: string = 'btech_bca_mca'): TradeoffProbe[] {
  const norm = (degreeTrack || '').toLowerCase();
  if (norm.includes('bcom') || norm.includes('mcom') || norm.includes('commerce') || norm.includes('finance')) {
    return BCOM_TRADEOFF_PROBES;
  }
  return TRADEOFF_PROBES;
}

/**
 * Complete union of all SJT questions across all streams for diagnostic engine lookup.
 */
export const ALL_SJT_QUESTIONS: SJTQuestion[] = [
  ...SJT_QUESTIONS,
  ...BCOM_SJT_QUESTIONS
];

/**
 * Complete union of all Frequency Matrix scenarios across all streams.
 */
export const ALL_MATRIX_SCENARIOS: MatrixScenario[] = [
  ...MATRIX_SCENARIOS,
  ...BCOM_MATRIX_SCENARIOS
];

/**
 * Complete union of all Tradeoff Probes across all streams.
 */
export const ALL_TRADEOFF_PROBES: TradeoffProbe[] = [
  ...TRADEOFF_PROBES,
  ...BCOM_TRADEOFF_PROBES
];

