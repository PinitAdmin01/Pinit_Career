// src/lib/onboarding/diagnosticRegistryGeneral.ts
/**
 * PinIT Career OS — Production Universal Onboarding Diagnostic V1 Question Registry
 * 
 * Target Students:
 * Students outside BCA, B.Com/M.Com, and BBA/MBA:
 * - BA, BSc, BTech / BE (non-CS), BDes, BFA, BSW, BJMC / Journalism
 * - Biotechnology, Life Sciences, Psychology, Mathematics / Statistics, Economics
 * - Architecture, Law, Pharmacy, Education, Hotel Management / Hospitality
 * - and all other undergraduate / postgraduate programs
 * 
 * CORE LAWS:
 * 1. Goal != Persona: Goal discovery questions NEVER directly determine PH / EX / ST / SIQ.
 * 2. An answer is evidence, not a diagnosis.
 * 3. Degree is context, career is requirements, answers are behavioral evidence.
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
   PART 1 — UNIVERSAL GOAL DISCOVERY QUESTIONS (Q1 – Q11)
   ========================================================================== */

export const GENERAL_GOAL_DISCOVERY_QUESTIONS: GoalDiscoveryQuestion[] = [
  {
    id: 'Q1_GEN_STUDY_IDENTITY',
    title: 'Current Study & Educational Field',
    subtitle: 'What are you currently studying? (Degree / Specialization / Institution)',
    type: 'single_select',
    options: [
      { id: 'gen_study_bsc_stats_math', label: 'BSc / Statistics / Mathematics', description: 'Statistics, data modeling, probability, quantitative analysis and analytical methods', mappedValue: 'science_research' },
      { id: 'gen_study_bsc_science', label: 'BSc / Natural & Life Sciences', description: 'Physics, chemistry, biology, biotechnology, environmental science & wet lab sciences', mappedValue: 'science_research' },
      { id: 'gen_study_ba_humanities', label: 'BA / Humanities & Social Sciences', description: 'Psychology, sociology, English literature, history, political science & philosophy', mappedValue: 'arts_humanities' },
      { id: 'gen_study_btech_eng', label: 'B.Tech / BE / Engineering (Core & Non-CS)', description: 'Mechanical, civil, electrical, chemical, aerospace, industrial & robotics engineering', mappedValue: 'engineering_technical' },
      { id: 'gen_study_bdes_bfa', label: 'BDes / BFA / Design & Creative Arts', description: 'UI/UX design, visual communication, industrial design, animation, fashion & digital arts', mappedValue: 'design_creative' },
      { id: 'gen_study_journalism_media', label: 'BJMC / Journalism / Media / Mass Comm', description: 'Digital media, broadcasting, investigative journalism, communications & public relations', mappedValue: 'arts_humanities' },
      { id: 'gen_study_law', label: 'Law / LLB / BA LLB / BBA LLB / LLM', description: 'Corporate law, constitutional jurisprudence, intellectual property, litigation & compliance', mappedValue: 'law' },
      { id: 'gen_study_pharmacy_health', label: 'Pharmacy / Allied Health / Public Health', description: 'B.Pharm, pharmacology, public health administration, epidemiology & clinical practice', mappedValue: 'healthcare_life_sciences' },
      { id: 'gen_study_education', label: 'Education / B.Ed / M.Ed / Pedagogy', description: 'Curriculum development, instructional design, educational psychology & teaching methods', mappedValue: 'education' },
      { id: 'gen_study_hospitality', label: 'Hotel Management / Hospitality / Tourism', description: 'Resort operations, guest relations, food & beverage systems, culinary arts & events', mappedValue: 'operations' },
      { id: 'gen_study_economics', label: 'Economics / Econometrics / Financial Economics', description: 'Macroeconomics, microeconomic policy, econometrics, market dynamics & game theory', mappedValue: 'science_research' },
      { id: 'gen_study_other', label: 'Other Undergraduate / Postgraduate Degree', description: 'Interdisciplinary, emerging studies, double major, or specialized academic programs', mappedValue: 'other' }
    ]
  },
  {
    id: 'Q2_GEN_PRIMARY_OBJECTIVE',
    title: 'Primary Target Objective',
    subtitle: 'What are you primarily trying to achieve with PinIT Career OS?',
    type: 'single_select',
    options: [
      { id: 'gen_achieve_internship', label: 'Internship', description: 'Secure a high-value corporate, industry, clinical, or research internship', mappedValue: 'internship' },
      { id: 'gen_achieve_first_job', label: 'First Job', description: 'Land my first on-campus or off-campus entry-level professional role', mappedValue: 'first_job' },
      { id: 'gen_achieve_higher_studies', label: 'Higher Studies', description: 'Master degree, doctoral research, GATE, GRE, CAT, or graduate fellowship preparation', mappedValue: 'higher_studies' },
      { id: 'gen_achieve_professional_qual', label: 'Professional Qualification', description: 'Attain specialized licensure, chartered certifications, or technical accreditations', mappedValue: 'professional_qualification' },
      { id: 'gen_achieve_research_career', label: 'Research Career', description: 'Publish peer-reviewed papers, join research laboratories, or pursue academic scholarship', mappedValue: 'research_career' },
      { id: 'gen_achieve_freelance', label: 'Freelance / Independent Work', description: 'Acquire direct clients, deliver contract projects, or establish an independent practice', mappedValue: 'freelance' },
      { id: 'gen_achieve_start_business', label: 'Start a Business', description: 'Launch a venture, commercial MVP, startup product, or specialized consultancy', mappedValue: 'start_business' },
      { id: 'gen_achieve_portfolio', label: 'Build a Portfolio', description: 'Construct demonstrable evidence-backed projects, prototypes, or case studies', mappedValue: 'portfolio' },
      { id: 'gen_achieve_competitive_exams', label: 'Prepare for Competitive / Government Exams', description: 'Civil services (UPSC/State), regulatory bodies, public sector units, or banking', mappedValue: 'competitive_exams' },
      { id: 'gen_achieve_change_career', label: 'Change Career Direction', description: 'Pivot out of my current field into a high-growth modern industry or tech role', mappedValue: 'change_career' },
      { id: 'gen_achieve_still_exploring', label: 'Still Exploring', description: 'Discover high-fit career pathways based on my diagnostic cognitive and operational strengths', mappedValue: 'exploring' }
    ]
  },
  {
    id: 'Q3_GEN_CAREER_CONSIDERATION',
    title: 'Target Career Field',
    subtitle: 'What type of career are you currently considering?',
    type: 'role_select',
    options: [
      { id: 'gen_field_tech', label: 'Technology & Software', description: 'Software engineering, web apps, cloud computing, cybersecurity & systems', mappedValue: 'technology' },
      { id: 'gen_field_research', label: 'Research & Academia', description: 'Scientific investigation, university teaching, thesis work, and academic research', mappedValue: 'research' },
      { id: 'gen_field_data', label: 'Data & Analytics', description: 'Data analytics, quantitative modeling, business intelligence, SQL & statistics', mappedValue: 'data' },
      { id: 'gen_field_design', label: 'Design & UI/UX', description: 'User experience, interface architecture, design systems, visual and product design', mappedValue: 'design' },
      { id: 'gen_field_media', label: 'Media & Journalism', description: 'Digital media, investigative journalism, broadcasting, corporate communications & PR', mappedValue: 'media' },
      { id: 'gen_field_education', label: 'Education & Teaching', description: 'K-12 instruction, higher education, educational technology, corporate training', mappedValue: 'education' },
      { id: 'gen_field_healthcare', label: 'Healthcare & Life Sciences', description: 'Clinical research, healthcare administration, pharmacy, biotechnology & diagnostics', mappedValue: 'healthcare' },
      { id: 'gen_field_public_sector', label: 'Public Sector & Governance', description: 'Public policy, civil administration, government agencies, municipal planning', mappedValue: 'public_sector' },
      { id: 'gen_field_consulting', label: 'Consulting & Strategy', description: 'Management consulting, policy advisory, strategic planning & corporate problem solving', mappedValue: 'consulting' },
      { id: 'gen_field_business', label: 'Business & Management', description: 'General management, corporate operations, cross-functional administration & leadership', mappedValue: 'business' },
      { id: 'gen_field_finance', label: 'Finance & Banking', description: 'Financial markets, investment analysis, commercial banking, risk & valuation', mappedValue: 'finance' },
      { id: 'gen_field_marketing', label: 'Marketing & Brand Growth', description: 'Brand management, growth marketing, digital advertising, content & consumer research', mappedValue: 'marketing' },
      { id: 'gen_field_operations', label: 'Operations & Logistics', description: 'Supply chain management, process optimization, logistics, warehouse & service ops', mappedValue: 'operations' },
      { id: 'gen_field_law', label: 'Law & Legal Compliance', description: 'Legal advisory, regulatory compliance, contract law, litigation & intellectual property', mappedValue: 'law' },
      { id: 'gen_field_engineering', label: 'Engineering & Hardware', description: 'Core engineering design, mechanical systems, robotics, electrical & infrastructure', mappedValue: 'engineering' },
      { id: 'gen_field_scientific', label: 'Scientific & Laboratory Work', description: 'Laboratory diagnostics, experimental sciences, biochemistry, environmental testing', mappedValue: 'scientific' },
      { id: 'gen_field_creative', label: 'Creative & Digital Arts', description: 'Animation, copywriting, video editing, game art, fine arts & creative direction', mappedValue: 'creative' },
      { id: 'gen_field_entrepreneurship', label: 'Entrepreneurship & Startups', description: 'Venture creation, startup execution, bootstrapping, business development', mappedValue: 'entrepreneurship' },
      { id: 'gen_field_social_sector', label: 'Social Sector & Non-Profit', description: 'NGO leadership, community development, social enterprise & philanthropic programs', mappedValue: 'social_sector' },
      { id: 'gen_field_other', label: 'Other Domain', description: 'Any specialized domain or interdisciplinary combination not listed above', mappedValue: 'other' },
      { id: 'gen_field_not_sure', label: 'Not Sure Yet', description: 'Open to guided discovery through diagnostic feedback and exploratory projects', mappedValue: 'not_sure' }
    ]
  },
  {
    id: 'Q4_GEN_SUCCESS_OUTCOME',
    title: 'Success Milestone (6–12 Months)',
    subtitle: 'What outcome would make you feel that the next 6–12 months were a genuine success?',
    type: 'single_select',
    options: [
      { id: 'gen_succ_internship', label: 'Get an internship', description: 'Land a professional or industry internship in my chosen domain', mappedValue: 'internship' },
      { id: 'gen_succ_job', label: 'Get a job', description: 'Receive an attractive job offer in my target professional field', mappedValue: 'job' },
      { id: 'gen_succ_projects', label: 'Build 2–3 strong projects', description: 'Construct and showcase demonstrable, production-quality deliverables', mappedValue: 'projects' },
      { id: 'gen_succ_employable', label: 'Become employable in my target field', description: 'Bridge skill gaps and pass technical/domain recruiter screening bars', mappedValue: 'employable' },
      { id: 'gen_succ_higher_studies', label: 'Qualify for higher studies', description: 'Crack entrance exams or earn admission into a prestigious graduate program', mappedValue: 'higher_studies' },
      { id: 'gen_succ_practical_exp', label: 'Build practical experience', description: 'Gain genuine hands-on execution experience beyond classroom theory', mappedValue: 'practical_experience' },
      { id: 'gen_succ_earn_indep', label: 'Start earning independently', description: 'Generate sustainable freelance, consulting, or client income', mappedValue: 'earn_independently' },
      { id: 'gen_succ_confident', label: 'Become confident in a professional environment', description: 'Speak clearly, present convincingly, and operate without impostor syndrome', mappedValue: 'professional_confidence' },
      { id: 'gen_succ_not_sure', label: 'I am not sure yet', description: 'Establish clarity through the diagnostic process before locking an outcome', mappedValue: 'not_sure' }
    ]
  },
  {
    id: 'Q5_GEN_MOTIVATION_PROFILE',
    title: 'Motivation Drivers',
    subtitle: 'Why are you considering this career direction? (Choose up to 3)',
    type: 'multi_select',
    maxSelections: 3,
    options: [
      { id: 'gen_mot_enjoy', label: 'I enjoy the subject', description: 'Genuine curiosity and fascination with the underlying domain', mappedValue: 'enjoy_subject' },
      { id: 'gen_mot_opps', label: 'Career opportunities', description: 'Abundant job openings, hiring velocity, and long-term career growth', mappedValue: 'career_opportunities' },
      { id: 'gen_mot_finance', label: 'Financial goals', description: 'High earning potential, compensation packages, and economic mobility', mappedValue: 'financial_goals' },
      { id: 'gen_mot_stability', label: 'Job stability', description: 'Predictable employment, steady demand, and low sector volatility', mappedValue: 'job_stability' },
      { id: 'gen_mot_interest', label: 'Personal interest', description: 'Aligns with personal values, hobbies, and personal lifestyle aspirations', mappedValue: 'personal_interest' },
      { id: 'gen_mot_family', label: 'Family expectations', description: 'Respecting family advice, heritage, or parental encouragement', mappedValue: 'family_expectations' },
      { id: 'gen_mot_good_at_it', label: 'I am good at it', description: 'Natural aptitude, academic strength, and intuitive ease with the work', mappedValue: 'good_at_it' },
      { id: 'gen_mot_solve_real', label: 'I want to solve real problems', description: 'Desire to tackle tangible human, societal, environmental or technical challenges', mappedValue: 'solve_real_problems' },
      { id: 'gen_mot_independence', label: 'I want independence', description: 'Autonomy over my schedule, decisions, work environment, and creative agency', mappedValue: 'independence' },
      { id: 'gen_mot_create', label: 'I want to create something', description: 'Building original products, systems, artworks, or intellectual properties', mappedValue: 'create_something' },
      { id: 'gen_mot_research', label: 'I want research / learning', description: 'Continuous intellectual discovery, deep scholarship, and pushing boundaries', mappedValue: 'research_learning' },
      { id: 'gen_mot_exploring', label: 'I am still exploring', description: 'Testing the waters across multiple possibilities to find what resonates', mappedValue: 'exploring' }
    ]
  },
  {
    id: 'Q6_GEN_GOAL_CERTAINTY',
    title: 'Goal Certainty',
    subtitle: 'How certain are you about your current career direction?',
    type: 'single_select',
    options: [
      { id: 'gen_cert_1', label: '1 — I have almost no idea.', description: 'Completely open canvas; seeking diagnostic guidance on where my strengths lie', mappedValue: 1 },
      { id: 'gen_cert_2', label: '2 — I have a few possibilities.', description: 'Weighing two or three distinct career options without a final decision', mappedValue: 2 },
      { id: 'gen_cert_3', label: '3 — I have one main direction but open to alternatives.', description: 'Favoring a target field while keeping an open mind for pivot opportunities', mappedValue: 3 },
      { id: 'gen_cert_4', label: '4 — I am fairly sure.', description: 'Clear focus; need concrete step-by-step roadmap execution to reach it', mappedValue: 4 },
      { id: 'gen_cert_5', label: '5 — I know exactly what I am targeting.', description: '100% committed to a specific role, company tier, or academic milestone', mappedValue: 5 }
    ]
  },
  {
    id: 'Q7_GEN_PRACTICAL_ABILITY',
    title: 'Current Practical Capability',
    subtitle: 'Which statement most accurately describes your current practical ability?',
    type: 'single_select',
    options: [
      { id: 'gen_cap_theory', label: 'I mostly know theory.', description: 'Familiar with textbook concepts, formulas, and academic models, but limited hands-on practice', mappedValue: 'theory_only' },
      { id: 'gen_cap_guided', label: 'I can complete guided tasks.', description: 'Able to follow tutorials, laboratory manuals, SOPs, and step-by-step instructions successfully', mappedValue: 'guided_tasks' },
      { id: 'gen_cap_independent_normal', label: 'I can complete normal tasks independently.', description: 'Handle standard assignments, routine projects, or typical workflows without constant supervision', mappedValue: 'independent_normal' },
      { id: 'gen_cap_unfamiliar', label: 'I can solve unfamiliar problems with some difficulty.', description: 'Can diagnose ambiguous hurdles, research solutions independently, and iterate to success', mappedValue: 'unfamiliar_solver' },
      { id: 'gen_cap_real_world', label: 'I can independently handle real-world work.', description: 'Ready to deliver production-grade output, interface with clients/stakeholders, and manage ambiguity', mappedValue: 'real_world_independent' }
    ]
  },
  {
    id: 'Q8_GEN_EXPERIENCE_OUTSIDE',
    title: 'Experience Outside Classroom',
    subtitle: 'What have you actually done outside normal classroom lectures? (Select all that apply)',
    type: 'multi_select',
    options: [
      { id: 'gen_exp_personal_proj', label: 'Personal project', description: 'Built an independent creation, software app, prototype, or creative piece', mappedValue: 'personal_project' },
      { id: 'gen_exp_academic_proj', label: 'Academic project', description: 'Major/minor capstone or practical semester research assignment', mappedValue: 'academic_project' },
      { id: 'gen_exp_research', label: 'Research', description: 'Formal laboratory or theoretical research under faculty or institute', mappedValue: 'research' },
      { id: 'gen_exp_internship', label: 'Internship', description: 'Completed a corporate, agency, NGO, or institutional internship', mappedValue: 'internship' },
      { id: 'gen_exp_part_time', label: 'Part-time work', description: 'Paid employment alongside academic coursework', mappedValue: 'part_time_work' },
      { id: 'gen_exp_freelance', label: 'Freelance work', description: 'Delivered paid or portfolio client gigs independently', mappedValue: 'freelance' },
      { id: 'gen_exp_volunteer', label: 'Volunteer work', description: 'Contributed time and effort to community or non-profit causes', mappedValue: 'volunteer_work' },
      { id: 'gen_exp_competition', label: 'Competition', description: 'Participated in case comps, design challenges, science fairs, or quizzes', mappedValue: 'competition' },
      { id: 'gen_exp_hackathon', label: 'Hackathon', description: 'Built rapid prototypes under 24–48 hour sprint hackathon constraints', mappedValue: 'hackathon' },
      { id: 'gen_exp_publication', label: 'Publication', description: 'Co-authored a paper, journal article, blog series, or book chapter', mappedValue: 'publication' },
      { id: 'gen_exp_presentation', label: 'Presentation', description: 'Presented research or proposals at conferences, seminars, or summits', mappedValue: 'presentation' },
      { id: 'gen_exp_portfolio', label: 'Portfolio', description: 'Curated a public portfolio, GitHub repo, Behance profile, or website', mappedValue: 'portfolio' },
      { id: 'gen_exp_student_org', label: 'Student organization', description: 'Active member of a student committee, club, or collegiate chapter', mappedValue: 'student_organization' },
      { id: 'gen_exp_leadership', label: 'Leadership role', description: 'Elected or appointed leader managing a team or running initiatives', mappedValue: 'leadership_role' },
      { id: 'gen_exp_client_work', label: 'Real client work', description: 'Handled actual client deliverables, revenue, or customer satisfaction', mappedValue: 'real_client_work' },
      { id: 'gen_exp_community', label: 'Community work', description: 'Organized community workshops, local outreach, or peer study groups', mappedValue: 'community_work' },
      { id: 'gen_exp_family_biz', label: 'Family business', description: 'Managed operations, sales, accounts, or services in a family enterprise', mappedValue: 'family_business' },
      { id: 'gen_exp_none', label: 'None', description: 'Starting fresh; excited to build my first verifiable portfolio experiences', mappedValue: 'none' }
    ]
  },
  {
    id: 'Q9_GEN_TOOLS_METHODS',
    title: 'Tools & Methods Used',
    subtitle: 'What tools, technologies, or methods have you actually used? (Select all that apply)',
    type: 'multi_select',
    options: [
      { id: 'gen_tool_excel', label: 'Excel / Spreadsheets', description: 'Formulas, VLOOKUP, pivot tables, Google Sheets, or data models', mappedValue: 'excel' },
      { id: 'gen_tool_python', label: 'Python', description: 'Scripts, automation, data science libraries (Pandas, NumPy), or web dev', mappedValue: 'python' },
      { id: 'gen_tool_sql', label: 'SQL / Databases', description: 'SELECT queries, joins, relational schema design, or database management', mappedValue: 'sql' },
      { id: 'gen_tool_lab', label: 'Lab equipment / Wet lab protocols', description: 'Titration, PCR, spectrophotometry, microscopy, chromatography, or chemical testing', mappedValue: 'lab_equipment' },
      { id: 'gen_tool_stat', label: 'Statistical software', description: 'R, SPSS, Stata, SAS, JASP, or statistical hypothesis packages', mappedValue: 'statistical_software' },
      { id: 'gen_tool_cad', label: 'CAD / 3D Modeling software', description: 'AutoCAD, SolidWorks, Revit, Fusion 360, Rhino, or Blender', mappedValue: 'cad' },
      { id: 'gen_tool_design', label: 'Design software', description: 'Figma, Adobe Photoshop, Illustrator, InDesign, Canva, or UI wireframing', mappedValue: 'design_software' },
      { id: 'gen_tool_video', label: 'Video / Audio editing tools', description: 'Premiere Pro, DaVinci Resolve, Final Cut, Audacity, or CapCut', mappedValue: 'video_editing' },
      { id: 'gen_tool_research_db', label: 'Academic research databases', description: 'PubMed, IEEE Xplore, ScienceDirect, JSTOR, Google Scholar, or Scopus', mappedValue: 'research_databases' },
      { id: 'gen_tool_prog_lang', label: 'Programming languages', description: 'C, C++, Java, JavaScript, TypeScript, MATLAB, or shell scripting', mappedValue: 'programming_languages' },
      { id: 'gen_tool_writing', label: 'Writing & publishing tools', description: 'LaTeX, Overleaf, Markdown, Notion, WordPress, or Ghost CMS', mappedValue: 'writing_tools' },
      { id: 'gen_tool_presentation', label: 'Presentation & Deck tools', description: 'PowerPoint, Google Slides, Keynote, Gamma, or Pitch', mappedValue: 'presentation_tools' },
      { id: 'gen_tool_survey', label: 'Survey & data collection tools', description: 'Qualtrics, Google Forms, Typeform, SurveyMonkey, or field interviews', mappedValue: 'survey_tools' },
      { id: 'gen_tool_business_sw', label: 'Business software & ERPs', description: 'Tally, SAP, Salesforce, Zoho CRM, HubSpot, or Jira', mappedValue: 'business_software' },
      { id: 'gen_tool_specialized', label: 'Specialized professional tools', description: 'Domain-specific instrumentation, legal search tools (SCC, Manupatra), etc.', mappedValue: 'specialized_tools' },
      { id: 'gen_tool_other', label: 'Other', description: 'Other specialized software, hardware, or research methods', mappedValue: 'other' }
    ]
  },
  {
    id: 'Q10_GEN_HARDEST_AREAS',
    title: 'Biggest Constraints & Hardest Areas',
    subtitle: 'What currently feels hardest or most intimidating for you? (Choose up to 3)',
    type: 'multi_select',
    maxSelections: 3,
    options: [
      { id: 'gen_obs_concepts', label: 'Understanding concepts', description: 'Abstract theories and complex foundational knowledge', mappedValue: 'understanding_concepts' },
      { id: 'gen_obs_apply', label: 'Applying concepts', description: 'Bridging the chasm between classroom theory and practical tasks', mappedValue: 'applying_concepts' },
      { id: 'gen_obs_unfamiliar', label: 'Solving unfamiliar problems', description: 'Handling open-ended challenges where no manual exists', mappedValue: 'solving_unfamiliar' },
      { id: 'gen_obs_starting', label: 'Starting work', description: 'Overcoming inertia, blank page anxiety, and procrastination', mappedValue: 'starting_work' },
      { id: 'gen_obs_consistency', label: 'Staying consistent', description: 'Maintaining disciplined study and work routines over weeks', mappedValue: 'staying_consistent' },
      { id: 'gen_obs_finishing', label: 'Finishing work', description: 'Pushing through the final 10% to ship completed deliverables', mappedValue: 'finishing_work' },
      { id: 'gen_obs_time', label: 'Managing time', description: 'Balancing college classes, exams, assignments, and career prep', mappedValue: 'managing_time' },
      { id: 'gen_obs_decisions', label: 'Making decisions', description: 'Second-guessing choices, career branches, and technology stacks', mappedValue: 'making_decisions' },
      { id: 'gen_obs_researching', label: 'Researching', description: 'Sifting through massive information to find high-signal sources', mappedValue: 'researching' },
      { id: 'gen_obs_communicating', label: 'Communicating', description: 'Articulating ideas concisely in writing and professional conversations', mappedValue: 'communicating' },
      { id: 'gen_obs_presenting', label: 'Presenting', description: 'Speaking before an audience, demos, and oral defense', mappedValue: 'presenting' },
      { id: 'gen_obs_others', label: 'Working with others', description: 'Team alignment, navigating disagreements, and group dynamics', mappedValue: 'working_with_others' },
      { id: 'gen_obs_independent', label: 'Working independently', description: 'Structuring self-directed work without someone giving directions', mappedValue: 'working_independently' },
      { id: 'gen_obs_choosing_learn', label: 'Choosing what to learn', description: 'Information overload on which skills actually matter for jobs', mappedValue: 'choosing_what_to_learn' },
      { id: 'gen_obs_practical_exp', label: 'Getting practical experience', description: 'Catch-22 of needing experience to land an internship/job', mappedValue: 'getting_practical_experience' },
      { id: 'gen_obs_portfolio', label: 'Building a portfolio', description: 'Showcasing proof-of-work that stands out to recruiters', mappedValue: 'building_portfolio' },
      { id: 'gen_obs_interviews', label: 'Interview preparation', description: 'Answering behavioral, technical, and domain-specific questions under pressure', mappedValue: 'interview_preparation' },
      { id: 'gen_obs_opportunities', label: 'Finding opportunities', description: 'Discovering hidden openings, networking, and off-campus placements', mappedValue: 'finding_opportunities' },
      { id: 'gen_obs_dont_know', label: "I don't know yet", description: 'Looking to identify my blind spots through PinIT diagnostics', mappedValue: 'dont_know_yet' }
    ]
  },
  {
    id: 'Q11_GEN_DAILY_AVAILABILITY',
    title: 'Daily Time Commitment',
    subtitle: 'How much time can you realistically dedicate to PinIT career preparation each day?',
    type: 'single_select',
    options: [
      { id: 'gen_time_30m', label: '<30 minutes / day', description: 'Micro-learning: focused quick quizzes, flash diagnostics, and conceptual nuggets', mappedValue: 30 },
      { id: 'gen_time_60m', label: '30–60 minutes / day', description: 'Steady sprint: daily targeted drills, reading, and structured micro-projects', mappedValue: 60 },
      { id: 'gen_time_90m', label: '1–2 hours / day', description: 'Optimal fellowship pace: rigorous hands-on projects, labs, and interview drills', mappedValue: 90 },
      { id: 'gen_time_150m', label: '2–3 hours / day', description: 'Accelerated track: building full capstones, comprehensive case study analysis', mappedValue: 150 },
      { id: 'gen_time_180m', label: '3+ hours / day', description: 'Immersive boot-camp mode: rapid career transition and deep daily engineering/research', mappedValue: 180 }
    ]
  }
];

/* ==========================================================================
   PART 2 — UNIVERSAL BEHAVIORAL SJTs (Q12 – Q26)
   ========================================================================== */

export const GENERAL_SJT_QUESTIONS: SJTQuestion[] = [
  {
    id: 'Q12_GEN_UNFAMILIAR_PROBLEM',
    title: 'An Unfamiliar Problem',
    scenario: 'You are given a complex problem you have never solved before.',
    prompt: 'What do you do first?',
    instruction: 'Choose what you would actually do first. Do not choose what sounds smartest.',
    options: [
      {
        id: 'q12_gen_ph',
        text: 'Break it into smaller parts and identify what is known, unknown and dependent on something else.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q12_gen_ex',
        text: 'Try a small approach and learn from what happens.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q12_gen_st',
        text: 'Define the expected outcome and organize the work into steps.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q12_gen_siq',
        text: 'Find out what the people involved actually need or expect.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q13_GEN_EXPLANATION_MISFIT',
    title: "Explanation Doesn't Fit Evidence",
    scenario: 'You expected one result, but the actual result is significantly different.',
    prompt: 'How do you investigate the discrepancy?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q13_gen_ph',
        text: 'Re-examine the assumptions and reasoning behind the original explanation.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q13_gen_ex',
        text: 'Try another approach and compare the result.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q13_gen_st',
        text: 'Check whether the work was performed according to the required process.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q13_gen_siq',
        text: 'Ask someone affected by the result how they understand the situation.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q14_GEN_UNCLEAR_BEST_APPROACH',
    title: "You Don't Know the Best Approach",
    scenario: 'Several distinct approaches seem possible, but there is no obvious standard choice.',
    prompt: 'How do you decide how to move forward?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q14_gen_ph',
        text: 'Compare the reasoning and assumptions behind each approach.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'uncertainty'
      },
      {
        id: 'q14_gen_ex',
        text: 'Try small versions of the most promising approaches.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'uncertainty'
      },
      {
        id: 'q14_gen_st',
        text: 'Define criteria and choose one approach systematically.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'uncertainty'
      },
      {
        id: 'q14_gen_siq',
        text: 'Ask people with relevant perspectives what constraints matter most.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q15_GEN_UNCLEAR_INSTRUCTIONS',
    title: 'The Instructions Are Unclear',
    scenario: 'You receive a task but the expected output or deliverable is not clearly defined.',
    prompt: 'What is your immediate first reaction?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q15_gen_ph',
        text: 'Break down the possible interpretations and determine what information is missing.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'scoping'
      },
      {
        id: 'q15_gen_ex',
        text: 'Create a rough first version and use it to discover what is required.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'scoping'
      },
      {
        id: 'q15_gen_st',
        text: 'Clarify the required output, scope and deadline before proceeding.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'scoping'
      },
      {
        id: 'q15_gen_siq',
        text: 'Talk to the person requesting the work and understand what outcome they actually need.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'scoping'
      }
    ]
  },
  {
    id: 'Q16_GEN_CONFLICTING_INFORMATION',
    title: 'Conflicting Information',
    scenario: 'Two reliable-looking sources or reference points directly disagree on key facts.',
    prompt: 'How do you handle the contradiction?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q16_gen_ph',
        text: 'Compare their assumptions, definitions and underlying evidence.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q16_gen_ex',
        text: 'Find another piece of evidence that can distinguish between them.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q16_gen_st',
        text: 'Establish a consistent method for evaluating both sources.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q16_gen_siq',
        text: 'Understand the context and perspective from which each source was produced.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q17_GEN_COMPLEX_PROJECT_MANAGEMENT',
    title: 'Project Becoming Difficult to Manage',
    scenario: 'There are too many moving tasks and several things are happening at once.',
    prompt: 'What do you do to regain control?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q17_gen_ph',
        text: 'Identify dependencies and determine which issues are causing the complexity.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'delivery'
      },
      {
        id: 'q17_gen_ex',
        text: 'Try a simpler alternative approach.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'delivery'
      },
      {
        id: 'q17_gen_st',
        text: 'Prioritize the tasks and create a clear execution sequence.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'delivery'
      },
      {
        id: 'q17_gen_siq',
        text: 'Discuss priorities with the people affected by the work.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'delivery'
      }
    ]
  },
  {
    id: 'Q18_GEN_FIRST_ATTEMPT_FAILS',
    title: 'Your First Attempt Fails',
    scenario: 'You have invested significant effort into an approach, but it completely fails.',
    prompt: 'What do you do next?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q18_gen_ph',
        text: 'Determine why the reasoning or assumptions failed.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'unblocking'
      },
      {
        id: 'q18_gen_ex',
        text: 'Try a different approach and compare the results.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'unblocking'
      },
      {
        id: 'q18_gen_st',
        text: 'Review the required conditions and check the process systematically.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'unblocking'
      },
      {
        id: 'q18_gen_siq',
        text: 'Get another perspective before deciding what to do next.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'unblocking'
      }
    ]
  },
  {
    id: 'Q19_GEN_TEAM_MEMBER_DISAGREES',
    title: 'Team Member Disagrees with You',
    scenario: 'A project partner or peer strongly challenges your proposed solution.',
    prompt: 'How do you handle the disagreement?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q19_gen_ph',
        text: 'Compare the assumptions and reasoning behind both positions.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'collaboration'
      },
      {
        id: 'q19_gen_ex',
        text: 'Try a small test that could provide evidence.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'collaboration'
      },
      {
        id: 'q19_gen_st',
        text: 'Agree on decision criteria and determine the next step.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'collaboration'
      },
      {
        id: 'q19_gen_siq',
        text: 'Understand what the other person is concerned about and why.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'collaboration'
      }
    ]
  },
  {
    id: 'Q20_GEN_DEADLINE_MOVED_FORWARD',
    title: 'Deadline Suddenly Moves Forward',
    scenario: 'A deliverable deadline is pulled forward unexpectedly by your supervisor or client.',
    prompt: 'How do you react to the sudden time pressure?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q20_gen_ph',
        text: 'Determine which dependencies create the biggest risk.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'delivery'
      },
      {
        id: 'q20_gen_ex',
        text: 'Find a simpler way to achieve the essential outcome.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'delivery'
      },
      {
        id: 'q20_gen_st',
        text: 'Reduce scope, prioritize and establish a new execution plan.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'delivery'
      },
      {
        id: 'q20_gen_siq',
        text: 'Clarify with stakeholders what is genuinely essential.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'delivery'
      }
    ]
  },
  {
    id: 'Q21_GEN_UNEXPECTED_OPPORTUNITY',
    title: 'Unexpected Opportunity Discovered',
    scenario: 'While working, you notice an unexpected approach that might produce a far better outcome than planned.',
    prompt: 'What is your immediate response?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q21_gen_ph',
        text: 'Investigate why the new approach might work.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'scoping'
      },
      {
        id: 'q21_gen_ex',
        text: 'Test the opportunity on a small scale.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'scoping'
      },
      {
        id: 'q21_gen_st',
        text: 'Evaluate whether it can be incorporated without disrupting the objective.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'scoping'
      },
      {
        id: 'q21_gen_siq',
        text: 'Understand who would benefit from or be affected by the change.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'scoping'
      }
    ]
  },
  {
    id: 'Q22_GEN_LIMITED_INFORMATION',
    title: 'Limited Information',
    scenario: 'You must make immediate progress on a project without knowing all the facts.',
    prompt: 'How do you proceed under high ambiguity?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q22_gen_ph',
        text: 'Identify the unknowns that could materially change the outcome.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'uncertainty'
      },
      {
        id: 'q22_gen_ex',
        text: 'Test the highest-value uncertainty.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'uncertainty'
      },
      {
        id: 'q22_gen_st',
        text: 'Define explicit assumptions and proceed with a controlled plan.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'uncertainty'
      },
      {
        id: 'q22_gen_siq',
        text: 'Gather relevant perspectives from people with useful context.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'uncertainty'
      }
    ]
  },
  {
    id: 'Q23_GEN_MISUNDERSTOOD_WORK',
    title: 'Work Technically Correct but Misunderstood',
    scenario: 'Your deliverable is completely accurate, but key stakeholders interpret it incorrectly.',
    prompt: 'How do you address the misunderstanding?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q23_gen_ph',
        text: 'Determine exactly where the reasoning could have been misunderstood.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'feedback'
      },
      {
        id: 'q23_gen_ex',
        text: 'Try another way of presenting the same idea.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'feedback'
      },
      {
        id: 'q23_gen_st',
        text: 'Create a clearer structure and documentation.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'feedback'
      },
      {
        id: 'q23_gen_siq',
        text: 'Ask the person what they understood and adapt the explanation.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'feedback'
      }
    ]
  },
  {
    id: 'Q24_GEN_TOO_MANY_LEARNING_PATHS',
    title: 'Too Many Learning Paths',
    scenario: 'You want to master a new skill, but there are dozens of competing courses, paths, and books.',
    prompt: 'How do you select what to learn?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q24_gen_ph',
        text: 'Compare what each path actually develops and what assumptions each makes.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'learning'
      },
      {
        id: 'q24_gen_ex',
        text: 'Try small parts of several paths before choosing.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'learning'
      },
      {
        id: 'q24_gen_st',
        text: 'Choose one path and create a structured progression.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'learning'
      },
      {
        id: 'q24_gen_siq',
        text: 'Talk to people who have used the paths in real situations.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'learning'
      }
    ]
  },
  {
    id: 'Q25_GEN_PROCESS_MISTAKES',
    title: 'A Process Repeatedly Produces Mistakes',
    scenario: 'A routine project workflow repeatedly causes minor errors and quality issues.',
    prompt: 'How do you eliminate the recurring errors?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q25_gen_ph',
        text: 'Find the underlying conditions that cause the errors.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q25_gen_ex',
        text: 'Try a modified process and see whether error rates change.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q25_gen_st',
        text: 'Standardize the process and introduce clear checks.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'debugging'
      },
      {
        id: 'q25_gen_siq',
        text: 'Talk with the people doing the work to understand practical causes.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'debugging'
      }
    ]
  },
  {
    id: 'Q26_GEN_PRESENT_IMPORTANT_RESULT',
    title: 'Presenting an Important Result',
    scenario: 'You must deliver an important presentation to an influential audience.',
    prompt: 'What is your primary focus when preparing the presentation?',
    instruction: 'Choose what you would actually do first.',
    options: [
      {
        id: 'q26_gen_ph',
        text: 'Make sure the evidence logically supports the conclusion.',
        dimension: 'PH',
        evidence: 2.0,
        context: 'collaboration'
      },
      {
        id: 'q26_gen_ex',
        text: 'Try different ways of presenting the result and see which communicates it best.',
        dimension: 'EX',
        evidence: 2.0,
        context: 'collaboration'
      },
      {
        id: 'q26_gen_st',
        text: 'Organize the presentation around a clear sequence and objective.',
        dimension: 'ST',
        evidence: 2.0,
        context: 'collaboration'
      },
      {
        id: 'q26_gen_siq',
        text: 'Adapt the explanation to what the audience needs to understand.',
        dimension: 'SIQ',
        evidence: 2.0,
        context: 'collaboration'
      }
    ]
  }
];

/* ==========================================================================
   PART 3 — UNIVERSAL FREQUENCY BEHAVIOR MATRIX (M1 – M4)
   ========================================================================== */

export const GENERAL_MATRIX_SCENARIOS: MatrixScenario[] = [
  {
    id: 'M1_GEN_PROBLEM_SOLVING',
    title: 'Problem Solving',
    scenario: 'You encounter a problem with no obvious solution.',
    context: 'debugging',
    items: [
      { id: 'm1_gen_ph', dimension: 'PH', statement: 'I break the problem into smaller components and look for relationships between them.' },
      { id: 'm1_gen_ex', dimension: 'EX', statement: 'I try different approaches to discover what works.' },
      { id: 'm1_gen_st', dimension: 'ST', statement: 'I create a systematic way to work through the problem.' },
      { id: 'm1_gen_siq', dimension: 'SIQ', statement: 'I seek perspectives from people who understand the situation.' }
    ]
  },
  {
    id: 'M2_GEN_LEARNING',
    title: 'Learning Unfamiliar Material',
    scenario: 'You need to learn something unfamiliar.',
    context: 'learning',
    items: [
      { id: 'm2_gen_ph', dimension: 'PH', statement: 'I try to understand how the concepts fit together.' },
      { id: 'm2_gen_ex', dimension: 'EX', statement: 'I learn by trying things and adjusting based on the result.' },
      { id: 'm2_gen_st', dimension: 'ST', statement: 'I follow a structured learning sequence.' },
      { id: 'm2_gen_siq', dimension: 'SIQ', statement: 'I learn from people with relevant experience.' }
    ]
  },
  {
    id: 'M3_GEN_PROJECT_WORK',
    title: 'Project Work & Execution',
    scenario: 'You are responsible for completing a project.',
    context: 'delivery',
    items: [
      { id: 'm3_gen_ph', dimension: 'PH', statement: 'I identify dependencies and potential failure points.' },
      { id: 'm3_gen_ex', dimension: 'EX', statement: 'I explore ways to improve the approach.' },
      { id: 'm3_gen_st', dimension: 'ST', statement: 'I track progress and ensure commitments are completed.' },
      { id: 'm3_gen_siq', dimension: 'SIQ', statement: 'I keep the relevant people aligned on expectations.' }
    ]
  },
  {
    id: 'M4_GEN_UNCERTAINTY',
    title: 'Operating Under Uncertainty',
    scenario: 'Important information is missing.',
    context: 'uncertainty',
    items: [
      { id: 'm4_gen_ph', dimension: 'PH', statement: 'I identify which missing information matters most.' },
      { id: 'm4_gen_ex', dimension: 'EX', statement: 'I test assumptions using the information available.' },
      { id: 'm4_gen_st', dimension: 'ST', statement: 'I make explicit assumptions and proceed systematically.' },
      { id: 'm4_gen_siq', dimension: 'SIQ', statement: 'I seek context from people who may know what is missing.' }
    ]
  }
];

/* ==========================================================================
   PART 4 — UNIVERSAL TRADEOFF PROBES (Q27 – Q30)
   ========================================================================== */

export const GENERAL_TRADEOFF_PROBES: TradeoffProbe[] = [
  {
    id: 'Q27_GEN_UNDERSTANDING_VS_PROGRESS',
    title: 'Deep Understanding vs Fast Progress',
    scenario: 'You could spend another three hours understanding a problem in depth, or start producing a practical result right now.',
    prompt: 'Which direction would you prioritize?',
    tradeoffType: 'depth_vs_speed',
    options: [
      {
        id: 'q27_gen_understand_deeply',
        text: 'Understand the problem more deeply first before producing output.',
        pole: 'analytical_depth',
        dimensionAffinity: 'PH'
      },
      {
        id: 'q27_gen_try_practical',
        text: 'Try something practical immediately and learn through the result.',
        pole: 'fast_progress',
        dimensionAffinity: 'EX'
      }
    ]
  },
  {
    id: 'Q28_GEN_EXPLORATION_VS_COMPLETION',
    title: 'Exploration vs Completion',
    scenario: 'You have a working solution, but several alternative approaches look very interesting.',
    prompt: 'How do you proceed with the alternatives?',
    tradeoffType: 'explore_vs_finish',
    options: [
      {
        id: 'q28_gen_experiment_alts',
        text: 'Experiment with the alternatives to discover if a superior solution exists.',
        pole: 'exploration',
        dimensionAffinity: 'EX'
      },
      {
        id: 'q28_gen_finish_current',
        text: 'Finish the current solution and record alternatives for later.',
        pole: 'execution',
        dimensionAffinity: 'ST'
      }
    ]
  },
  {
    id: 'Q29_GEN_INDEPENDENT_VS_CONSULTING',
    title: 'Independent Work vs Asking Others',
    scenario: 'You are blocked on a challenging problem.',
    prompt: 'What is your immediate response to being blocked?',
    tradeoffType: 'solo_vs_consult',
    options: [
      {
        id: 'q29_gen_investigate_solo',
        text: 'Investigate independently and exhaust own hypotheses before asking.',
        pole: 'independent_investigation',
        dimensionAffinity: 'PH'
      },
      {
        id: 'q29_gen_ask_context',
        text: 'Ask someone with relevant context early to maintain momentum.',
        pole: 'perspective_coordination',
        dimensionAffinity: 'SIQ'
      }
    ]
  },
  {
    id: 'Q30_GEN_PLAN_VS_ADAPTATION',
    title: 'Plan vs Adaptation',
    scenario: 'Your original plan stops making sense because unexpected new information appears.',
    prompt: 'How do you navigate the invalidated plan?',
    tradeoffType: 'plan_vs_adapt',
    options: [
      {
        id: 'q30_gen_update_plan',
        text: 'Update the plan and continue in a controlled, systematic way.',
        pole: 'structured_plan',
        dimensionAffinity: 'ST'
      },
      {
        id: 'q30_gen_test_new_approach',
        text: 'Test a new approach dynamically and adapt through experimentation.',
        pole: 'adaptive_pivot',
        dimensionAffinity: 'EX'
      }
    ]
  }
];

/* ==========================================================================
   PART 5 — DEGREE-NEUTRAL SPECIALIZATION BRANCHES (Q31)
   ========================================================================== */

export interface GeneralSpecializationOption {
  id: string;
  label: string;
  description?: string;
  affinityDimension?: BehavioralDimension;
}

export interface GeneralSpecializationQuestion {
  domainId: string;
  questionId: string;
  title: string;
  subtitle: string;
  options: GeneralSpecializationOption[];
}

export const GENERAL_SPECIALIZATION_QUESTIONS: Record<string, GeneralSpecializationQuestion> = {
  science_research: {
    domainId: 'science_research',
    questionId: 'Q31_SCI_EXPERIMENTAL_RESULT',
    title: 'Science & Research Specialization',
    subtitle: 'You obtain an unexpected experimental or statistical pattern. What interests you most?',
    options: [
      { id: 'spec_gen_sci_assumptions', label: 'Identify which assumptions or variables could explain it. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_gen_sci_retest', label: 'Repeat or modify the experiment to test alternative explanations. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_gen_sci_verify', label: 'Verify the experimental procedure, records, and instrumentation. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_gen_sci_discuss', label: 'Discuss the result with people who have relevant subject or practical context. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  engineering_technical: {
    domainId: 'engineering_technical',
    questionId: 'Q31_ENG_SYSTEM_TROUBLESHOOTING',
    title: 'Engineering & Technical Specialization',
    subtitle: 'A system or mechanism is not performing as expected. What do you do first?',
    options: [
      { id: 'spec_gen_eng_arch', label: 'Analyze the system architecture, tolerances, and dependencies. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_gen_eng_test', label: 'Test individual components or alternative configurations. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_gen_eng_troubleshoot', label: 'Follow a structured troubleshooting checklist and inspection sequence. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_gen_eng_operator', label: 'Understand operator observations and user requirements. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  arts_humanities: {
    domainId: 'arts_humanities',
    questionId: 'Q31_ARTS_CONFLICTING_INTERPRETATION',
    title: 'Arts & Humanities Specialization',
    subtitle: 'You encounter two conflicting interpretations of the same societal or historical issue. What is your approach?',
    options: [
      { id: 'spec_gen_arts_assumptions', label: 'Examine the assumptions and evidence underlying each interpretation. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_gen_arts_perspectives', label: 'Look for additional evidence or perspectives that might distinguish them. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_gen_arts_framework', label: 'Create a consistent framework for comparing them. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_gen_arts_lived_exp', label: 'Understand how different people or groups experience the issue. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  design_creative: {
    domainId: 'design_creative',
    questionId: 'Q31_DESIGN_CONCEPT_FAILURE',
    title: 'Design & Creative Specialization',
    subtitle: 'A first design concept does not work well. What do you explore next?',
    options: [
      { id: 'spec_gen_des_assumptions', label: 'Identify which design assumptions caused the problem. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_gen_des_prototype', label: 'Create another concept and test it with a prototype. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_gen_des_spec', label: 'Check the design against requirements and constraints. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_gen_des_users', label: 'Observe how users/audience members respond and understand their needs. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  law: {
    domainId: 'law',
    questionId: 'Q31_LAW_PLAUSIBLE_ARGUMENTS',
    title: 'Law & Jurisprudence Specialization',
    subtitle: 'Two interpretations of a legal case or statute appear equally plausible. What is your primary focus?',
    options: [
      { id: 'spec_gen_law_reasoning', label: 'Compare the underlying reasoning, facts, and judicial assumptions. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_gen_law_precedents', label: 'Research alternative interpretations and comparative precedents. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_gen_law_framework', label: 'Follow a structured legal-analysis framework and statutory hierarchy. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_gen_law_interests', label: 'Understand the interests, motives, and perspectives of the parties involved. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  education: {
    domainId: 'education',
    questionId: 'Q31_EDU_STUDENT_STRUGGLE',
    title: 'Education & Pedagogy Specialization',
    subtitle: 'Students are consistently struggling with a core concept. What do you investigate first?',
    options: [
      { id: 'spec_gen_edu_misconception', label: 'Determine which underlying misconception is causing difficulty. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_gen_edu_method', label: 'Try another interactive teaching method or medium. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_gen_edu_plan', label: 'Create a structured intervention plan with measurable checkpoints. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_gen_edu_interviews', label: 'Talk to students to understand their perspective and personal difficulties. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  },
  healthcare_life_sciences: {
    domainId: 'healthcare_life_sciences',
    questionId: 'Q31_HLT_UNEXPECTED_OUTCOME',
    title: 'Healthcare & Life Sciences Specialization',
    subtitle: 'You observe an unexpected clinical, patient, or laboratory outcome. What is your immediate priority?',
    options: [
      { id: 'spec_gen_hlt_causes', label: 'Investigate possible physiological or biochemical underlying causes. (Analytical Structuring)', affinityDimension: 'PH' },
      { id: 'spec_gen_hlt_evidence', label: 'Compare possible explanations using available diagnostic evidence. (Experimental Exploration)', affinityDimension: 'EX' },
      { id: 'spec_gen_hlt_protocol', label: 'Follow the required clinical protocol and verify records. (Structured Execution)', affinityDimension: 'ST' },
      { id: 'spec_gen_hlt_patient', label: 'Gather qualitative information from the people involved and affected. (Perspective Coordination)', affinityDimension: 'SIQ' }
    ]
  }
};
