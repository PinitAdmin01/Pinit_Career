// src/lib/ats/atsScreener.ts
// PinIT Vendor-Inspired ATS Screener & 5-Point Quick Wins Engine
// Architecture:
// 1. Parseability & Structural Extraction (Sections, Contacts, Dates, Layout Risk)
// 2. Content Quality & Impact Evaluation (Action Verbs, Metric Quantification, XYZ Formula)
// 3. Role-Aware & JD-Aware Keyword Matching (Taxonomy by Career Track)
// 4. 6 Vendor-Inspired Simulation Profiles (Greenhouse, Lever, Workday, Taleo, iCIMS, Ashby)
// 5. 5-Point Quick Wins Engine (Ranked by Impact × Confidence × Ease)

export const ATS_ENGINE_VERSION = 'v1.0';

export const ATS_LEGAL_DISCLAIMER =
  'These profiles are PinIT educational simulation models based on public recruitment heuristics and industry benchmarks, not official algorithms of Greenhouse Software Inc., Workday Inc., Oracle Taleo, iCIMS Inc., Lever Inc., or Ashby Inc.';

export type RoleCategory =
  | 'sde'
  | 'backend'
  | 'frontend'
  | 'devops'
  | 'data_analyst'
  | 'pm'
  | 'business_analyst'
  | 'sales_marketing'
  | 'general_tech'
  | 'general_non_tech';

export interface ExtractedContacts {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  location?: string;
}

export interface SkillTaxonomy {
  languages: string[];
  frameworks: string[];
  databases: string[];
  cloudDevOps: string[];
  toolsPractices: string[];
  domainBusiness: string[];
}

export interface QuickWinItem {
  rank: number;
  title: string;
  category: 'impact' | 'skills' | 'structure' | 'contact' | 'formatting';
  impactTier: 'High' | 'Medium' | 'Low';
  easeTier: 'Easy' | 'Moderate' | 'In-depth';
  issue: string;
  recommendation: string;
  exampleBefore?: string;
  exampleAfter?: string;
}

export interface VendorSimulationScores {
  greenhouseInspired: number; // Focus: Strict section hierarchy & strong power verbs
  leverInspired: number;      // Focus: Skill categorization & profile links
  workdayInspired: number;    // Focus: Single-column parseability & standard date formats
  taleoInspired: number;      // Focus: Exact keyword density & education accreditation
  icimsInspired: number;      // Focus: Quantitative metric frequency
  ashbyInspired: number;      // Focus: Modern tech stack recency & XYZ formula impact
}

export interface AtsAuditReport {
  engineVersion: string;
  targetRole: RoleCategory;
  compositeScore: number;
  compatibilityScores: {
    parseabilityScore: number;
    contentQualityScore: number;
    jobMatchScore: number;
  };
  vendorProfiles: VendorSimulationScores;
  extractedProfile: {
    contacts: ExtractedContacts;
    sectionsDetected: string[];
    missingSections: string[];
    skillsDetected: string[];
    matchedSkills: string[];
    missingSkills: string[];
    quantifiedBulletsCount: number;
    totalBulletsCount: number;
    powerVerbsCount: number;
    layoutRisk: 'Low' | 'Medium' | 'High';
  };
  quickWins: QuickWinItem[];
  disclaimer: string;
}

// ─── ROLE SKILL TAXONOMY ────────────────────────────────────────────────────────

export const ROLE_TAXONOMY: Record<RoleCategory, SkillTaxonomy> = {
  sde: {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'Spring Boot'],
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    cloudDevOps: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions'],
    toolsPractices: ['Data Structures', 'Algorithms', 'REST APIs', 'GraphQL', 'System Design', 'Git', 'Unit Testing'],
    domainBusiness: ['Agile', 'Scrum', 'Code Review']
  },
  backend: {
    languages: ['Java', 'Python', 'Go', 'C++', 'TypeScript', 'SQL'],
    frameworks: ['Spring Boot', 'Django', 'FastAPI', 'Node.js', 'Express', 'gRPC'],
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch'],
    cloudDevOps: ['AWS', 'Docker', 'Kubernetes', 'Kafka', 'RabbitMQ', 'Terraform'],
    toolsPractices: ['Distributed Systems', 'System Design', 'Microservices', 'Database Indexing', 'Concurrency', 'REST APIs'],
    domainBusiness: ['API Design', 'Performance Optimization', 'High Availability']
  },
  frontend: {
    languages: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
    frameworks: ['React', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'Redux'],
    databases: ['IndexedDB', 'Firebase', 'Supabase'],
    cloudDevOps: ['Vercel', 'Netlify', 'AWS S3', 'Cloudflare'],
    toolsPractices: ['Responsive Design', 'Web Performance', 'Accessibility', 'Jest', 'Cypress', 'Webpack', 'Vite'],
    domainBusiness: ['UI/UX Design', 'Design Systems', 'Cross-Browser Compatibility']
  },
  devops: {
    languages: ['Python', 'Bash', 'Go', 'YAML', 'HCL'],
    frameworks: ['Terraform', 'Ansible', 'Puppet', 'Helm'],
    databases: ['PostgreSQL', 'Redis', 'Prometheus'],
    cloudDevOps: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'ArgoCD'],
    toolsPractices: ['Infrastructure as Code', 'Site Reliability Engineering', 'Grafana', 'ELK Stack', 'Security', 'Telemetry'],
    domainBusiness: ['Disaster Recovery', 'Zero-Downtime Deployment', 'Cost Optimization']
  },
  data_analyst: {
    languages: ['SQL', 'Python', 'R'],
    frameworks: ['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn'],
    databases: ['PostgreSQL', 'Snowflake', 'BigQuery', 'Redshift', 'MySQL'],
    cloudDevOps: ['AWS S3', 'Airflow', 'dbt'],
    toolsPractices: ['Data Modeling', 'ETL Pipelines', 'Tableau', 'Power BI', 'Excel', 'Statistics', 'A/B Testing'],
    domainBusiness: ['Business Intelligence', 'KPI Dashboards', 'Customer Segmentation', 'Funnel Analysis']
  },
  pm: {
    languages: ['SQL', 'Python'],
    frameworks: ['Jira', 'Linear', 'Confluence', 'Figma'],
    databases: ['Data Analytics', 'BigQuery'],
    cloudDevOps: ['Telemetry', 'Mixpanel', 'Amplitude'],
    toolsPractices: ['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'Sprint Planning', 'Wireframing'],
    domainBusiness: ['Go-to-Market', 'Product Lifecycle', 'Unit Economics', 'Stakeholder Management', 'PRD Writing']
  },
  business_analyst: {
    languages: ['SQL', 'Excel', 'Python'],
    frameworks: ['Tableau', 'Power BI', 'Jira', 'BPMN'],
    databases: ['PostgreSQL', 'Oracle', 'Snowflake'],
    cloudDevOps: ['Cloud Reporting'],
    toolsPractices: ['Process Mapping', 'Financial Modeling', 'Requirement Gathering', 'Gap Analysis', 'Data Analysis'],
    domainBusiness: ['Cost-Benefit Analysis', 'Operations Strategy', 'Stakeholder Communication', 'Risk Assessment']
  },
  sales_marketing: {
    languages: ['HTML', 'SQL'],
    frameworks: ['HubSpot', 'Salesforce', 'Google Analytics', 'Marketo'],
    databases: ['CRM Data', 'Lead Pipelines'],
    cloudDevOps: ['Email Automation', 'Zapier'],
    toolsPractices: ['SEO', 'SEM', 'Content Strategy', 'Cold Outreach', 'Conversion Optimization', 'Pipeline Management'],
    domainBusiness: ['B2B Sales', 'Lead Generation', 'Customer Acquisition Cost', 'Lifetime Value', 'Negotiation']
  },
  general_tech: {
    languages: ['Python', 'JavaScript', 'Java', 'SQL', 'C++'],
    frameworks: ['React', 'Node.js', 'Spring Boot', 'Express'],
    databases: ['PostgreSQL', 'MongoDB', 'MySQL'],
    cloudDevOps: ['AWS', 'Docker', 'Git', 'CI/CD'],
    toolsPractices: ['Data Structures', 'Algorithms', 'REST APIs', 'Software Engineering Principles'],
    domainBusiness: ['Problem Solving', 'Team Collaboration', 'Documentation']
  },
  general_non_tech: {
    languages: ['Excel', 'SQL'],
    frameworks: ['Power BI', 'Google Analytics', 'Jira'],
    databases: ['Spreadsheet Modeling'],
    cloudDevOps: ['Office 365', 'Google Workspace'],
    toolsPractices: ['Data Analysis', 'Project Management', 'Market Research'],
    domainBusiness: ['Written Communication', 'Strategic Planning', 'Operations', 'Client Relations']
  }
};

// Power action verbs vs passive phrases
export const POWER_ACTION_VERBS = [
  'architected', 'engineered', 'spearheaded', 'orchestrated', 'streamlined',
  'optimized', 'formulated', 'implemented', 'scaled', 'refactored',
  'accelerated', 'automated', 'deployed', 'designed', 'established',
  'developed', 'delivered', 'built', 'reduced', 'increased', 'integrated'
];

export const WEAK_PASSIVE_PHRASES = [
  'worked on', 'responsible for', 'helped with', 'assisted in', 'handled',
  'participated in', 'duties included', 'was involved in'
];

// Standard ATS Section Headers
export const STANDARD_SECTIONS = [
  { key: 'experience', label: 'Work Experience', regex: /(?:work\s+experience|professional\s+experience|employment\s+history|experience)/i },
  { key: 'education', label: 'Education', regex: /(?:education|academic\s+background|qualifications)/i },
  { key: 'skills', label: 'Technical Skills', regex: /(?:technical\s+skills|skills|technologies|core\s+competencies)/i },
  { key: 'projects', label: 'Projects', regex: /(?:projects|technical\s+projects|academic\s+projects)/i },
  { key: 'certifications', label: 'Certifications', regex: /(?:certifications|licenses|courses|accreditations)/i }
];

// Date Regex: MM/YYYY or Month YYYY or YYYY - YYYY / Present
export const DATE_RANGE_REGEX = /(?:(?:0?[1-9]|1[0-2])\/20\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+20\d{2}|20\d{2})\s*(?:-|–|to)\s*(?:(?:0?[1-9]|1[0-2])\/20\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+20\d{2}|20\d{2}|Present|Current)/gi;

// Metric Regex (Percentage, Currency, Scale Numbers, Multipliers)
export const METRIC_REGEX = /(?:\b\d+(?:\.\d+)?%\b|\$\s*\d+(?:,\d+)*(?:\.\d+)?[kKmMbB]?|\b\d+\s*(?:ms|seconds|x|users|clients|records|requests|qps|endpoints|students|projects|teams)\b|\b(?:reduced|increased|boosted|cut|saved|scaled)\s+by\s+\d+)/gi;

// ─── CORE PARSER FUNCTIONS ──────────────────────────────────────────────────────

/**
 * Extracts contact information from document text
 */
export function extractContacts(text: string): ExtractedContacts {
  const contacts: ExtractedContacts = {};

  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) contacts.email = emailMatch[0];

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
  if (phoneMatch) contacts.phone = phoneMatch[0];

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|profile)\/[A-Za-z0-9_-]+/i);
  if (linkedinMatch) contacts.linkedin = linkedinMatch[0];

  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+/i);
  if (githubMatch) contacts.github = githubMatch[0];

  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9_-]+\.(?:dev|io|tech|me|com)\b/i);
  if (portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github')) {
    contacts.portfolio = portfolioMatch[0];
  }

  return contacts;
}

/**
 * Extracts recognized section headings and checks for missing mandatory sections
 */
export function extractSections(text: string): { detected: string[]; missing: string[] } {
  const detected: string[] = [];
  const missing: string[] = [];

  STANDARD_SECTIONS.forEach(sec => {
    if (sec.regex.test(text)) {
      detected.push(sec.label);
    } else {
      missing.push(sec.label);
    }
  });

  return { detected, missing };
}

/**
 * Extracts all matched skills from the role taxonomy and job description
 */
export function extractSkills(
  text: string,
  roleKey: RoleCategory = 'sde',
  jobDescription?: string
): { detectedSkills: string[]; matchedSkills: string[]; missingSkills: string[] } {
  const taxonomy = ROLE_TAXONOMY[roleKey] || ROLE_TAXONOMY.sde;
  const allRoleSkills = [
    ...taxonomy.languages,
    ...taxonomy.frameworks,
    ...taxonomy.databases,
    ...taxonomy.cloudDevOps,
    ...taxonomy.toolsPractices,
    ...taxonomy.domainBusiness
  ];

  const lowerText = text.toLowerCase();
  const detectedSkills: string[] = [];

  allRoleSkills.forEach(skill => {
    const escaped = skill.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lowerText) && !detectedSkills.includes(skill)) {
      detectedSkills.push(skill);
    }
  });

  // If a Job Description is provided, extract JD-specific target keywords
  let targetRequiredSkills = allRoleSkills.slice(0, 10);
  if (jobDescription) {
    const lowerJd = jobDescription.toLowerCase();
    const jdSkills = allRoleSkills.filter(skill => {
      const escaped = skill.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(lowerJd);
    });
    if (jdSkills.length > 0) {
      targetRequiredSkills = jdSkills;
    }
  }

  const matchedSkills = targetRequiredSkills.filter(s => detectedSkills.includes(s));
  const missingSkills = targetRequiredSkills.filter(s => !detectedSkills.includes(s));

  return {
    detectedSkills,
    matchedSkills,
    missingSkills
  };
}

/**
 * Evaluates bullet points for action verbs, quantification metrics, and XYZ formula structure
 */
export function analyzeBullets(text: string): {
  totalBullets: number;
  quantifiedBullets: number;
  powerVerbsCount: number;
  weakPhrasesCount: number;
  unquantifiedSamples: string[];
} {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Filter out contact lines, section headers, and key-value skill lines
  const isExcludedHeaderOrSkill = (l: string) => {
    if (/^(?:languages|frameworks|databases|cloud|tools|practices|domain|education|experience|projects|skills|certifications|summary):/i.test(l)) return true;
    if (/^[A-Z\s|&]{4,}$/.test(l) && l.length < 40) return true; // Section headers like TECHNICAL SKILLS, WORK EXPERIENCE
    if (/@|\.com|\.dev|\(\d{3}\)/.test(l)) return true; // Contact lines
    return false;
  };

  const bulletLines = lines.filter(l => {
    if (isExcludedHeaderOrSkill(l)) return false;
    if (/^[•\-\*▪\d\.]\s+/.test(l)) return true;
    const lower = l.toLowerCase();
    const startsWithAction = POWER_ACTION_VERBS.some(v => lower.startsWith(v)) || WEAK_PASSIVE_PHRASES.some(w => lower.startsWith(w));
    if (startsWithAction && l.length > 20) return true;
    return false;
  });

  // Fallback: if no bullet markers found, take non-header sentences > 25 chars
  const effectiveBullets = bulletLines.length > 0
    ? bulletLines
    : lines.filter(l => !isExcludedHeaderOrSkill(l) && l.length > 25);

  let quantifiedCount = 0;
  let powerVerbs = 0;
  let weakPhrases = 0;
  const unquantifiedSamples: string[] = [];

  effectiveBullets.forEach(line => {
    const lower = line.toLowerCase();
    
    // Check metric
    const hasMetric = METRIC_REGEX.test(line);
    METRIC_REGEX.lastIndex = 0; // Reset regex state
    if (hasMetric) {
      quantifiedCount++;
    } else if (line.length > 25 && unquantifiedSamples.length < 3) {
      unquantifiedSamples.push(line);
    }

    // Check power verb
    const hasPowerVerb = POWER_ACTION_VERBS.some(v => lower.includes(v));
    if (hasPowerVerb) powerVerbs++;

    // Check weak passive phrase
    const hasWeak = WEAK_PASSIVE_PHRASES.some(w => lower.includes(w));
    if (hasWeak) weakPhrases++;
  });

  return {
    totalBullets: Math.max(effectiveBullets.length, 1),
    quantifiedBullets: quantifiedCount,
    powerVerbsCount: powerVerbs,
    weakPhrasesCount: weakPhrases,
    unquantifiedSamples
  };
}

/**
 * Evaluates document layout risk (multi-column tables, graphics, unicode clutter)
 */
export function evaluateLayoutRisk(text: string): {
  layoutRisk: 'Low' | 'Medium' | 'High';
  reasons: string[];
} {
  const reasons: string[] = [];
  
  // Table or pipe delimiter density
  const pipeCount = (text.match(/\|/g) || []).length;
  if (pipeCount > 15) {
    reasons.push('High density of pipe characters indicates tabular data or multi-column layout.');
  }

  // Excessive symbol noise
  const symbolClutter = (text.match(/[★✦■◆▲►✓✔✗✘]/g) || []).length;
  if (symbolClutter > 8) {
    reasons.push('Excessive graphic/symbol glyphs may disrupt OCR/text parsing.');
  }

  // Unrecognized or short broken lines
  const lines = text.split('\n');
  const shortFragmentLines = lines.filter(l => l.trim().length > 0 && l.trim().length < 10).length;
  if (shortFragmentLines > 20) {
    reasons.push('High volume of short text fragments may indicate fragmented multi-column text boxes.');
  }

  let layoutRisk: 'Low' | 'Medium' | 'High' = 'Low';
  if (reasons.length >= 2) layoutRisk = 'High';
  else if (reasons.length === 1) layoutRisk = 'Medium';

  return { layoutRisk, reasons };
}

// ─── 5-POINT ACTIONABLE QUICK WINS ENGINE ────────────────────────────────────────

/**
 * Generates prioritized 5-Point Quick Wins ranked by Impact × Confidence × Ease
 */
export function generateQuickWins(
  contacts: ExtractedContacts,
  sections: { detected: string[]; missing: string[] },
  skills: { detectedSkills: string[]; missingSkills: string[] },
  bullets: { totalBullets: number; quantifiedBullets: number; unquantifiedSamples: string[]; weakPhrasesCount: number },
  layout: { layoutRisk: 'Low' | 'Medium' | 'High' }
): QuickWinItem[] {
  const candidateWins: Array<{
    score: number;
    win: Omit<QuickWinItem, 'rank'>;
  }> = [];

  // 1. Missing Quantified Metrics in Experience Bullets
  const quantificationRatio = bullets.quantifiedBullets / Math.max(bullets.totalBullets, 1);
  if (quantificationRatio < 0.5) {
    candidateWins.push({
      score: 95, // High impact, high ease
      win: {
        title: 'Quantify Achievements with Measurable Outcomes (XYZ Formula)',
        category: 'impact',
        impactTier: 'High',
        easeTier: 'Easy',
        issue: `Only ${Math.round(quantificationRatio * 100)}% of your bullet points contain measurable metrics (%, $, user scale, latency).`,
        recommendation: 'Use the XYZ structure: "Accomplished [X], as measured by [Y], by doing [Z]". Add specific percentages, user scale, or performance numbers to your project achievements.',
        exampleBefore: bullets.unquantifiedSamples[0] || 'Worked on backend API to optimize database queries.',
        exampleAfter: 'Architected backend caching layer with Redis, reducing API p95 query latency by 42% across 100k daily requests.'
      }
    });
  }

  // 2. Missing Core Role Skills
  if (skills.missingSkills.length > 0) {
    const topMissing = skills.missingSkills.slice(0, 3).join(', ');
    candidateWins.push({
      score: 90,
      win: {
        title: `Incorporate Target Role Keywords: ${topMissing}`,
        category: 'skills',
        impactTier: 'High',
        easeTier: 'Easy',
        issue: `Target role keywords (${topMissing}) were not detected in your skills or experience sections.`,
        recommendation: `Add verifiable experience or project bullet points demonstrating your practical work with ${topMissing}.`,
        exampleBefore: 'Implemented web features and backend tools.',
        exampleAfter: `Developed modular services using ${skills.missingSkills[0] || 'Docker'} and deployed automated pipelines.`
      }
    });
  }

  // 3. Missing Standard Section Headings
  if (sections.missing.length > 0) {
    candidateWins.push({
      score: 85,
      win: {
        title: `Add Standard Section Header: ${sections.missing[0]}`,
        category: 'structure',
        impactTier: 'High',
        easeTier: 'Easy',
        issue: `Your resume is missing a recognized "${sections.missing[0]}" heading, causing parsers to miss relevant experience.`,
        recommendation: `Include a clear, bold top-level header titled "${sections.missing[0]}" without embedding it inside multi-column tables.`,
        exampleBefore: 'Stuff I Did in College',
        exampleAfter: 'TECHNICAL PROJECTS'
      }
    });
  }

  // 4. Missing GitHub or LinkedIn Profile Links
  if (!contacts.github || !contacts.linkedin) {
    const missingLink = !contacts.github && !contacts.linkedin ? 'GitHub and LinkedIn' : !contacts.github ? 'GitHub' : 'LinkedIn';
    candidateWins.push({
      score: 75,
      win: {
        title: `Add Active ${missingLink} Hyperlink`,
        category: 'contact',
        impactTier: 'Medium',
        easeTier: 'Easy',
        issue: `Recruitment parsers and technical interviewers prioritize verifying code repositories via ${missingLink}.`,
        recommendation: `Place your clean, clickable ${missingLink} URL in the top contact header (e.g. github.com/username).`,
        exampleBefore: 'Contact: Name, City',
        exampleAfter: 'github.com/username | linkedin.com/in/username | candidate@email.com'
      }
    });
  }

  // 5. Weak Passive Language Replacement
  if (bullets.weakPhrasesCount > 0) {
    candidateWins.push({
      score: 70,
      win: {
        title: 'Replace Passive Verbs with High-Impact Power Action Verbs',
        category: 'formatting',
        impactTier: 'Medium',
        easeTier: 'Easy',
        issue: 'Detected passive verbs (e.g. "worked on", "responsible for") which dilute perceived ownership.',
        recommendation: 'Start every bullet point with strong power action verbs like "Architected", "Engineered", "Orchestrated", "Streamlined", or "Automated".',
        exampleBefore: 'Responsible for managing the payment gateway integration.',
        exampleAfter: 'Engineered Stripe webhook integration with idempotency keys, handling $50k+ in transactions with 99.9% uptime.'
      }
    });
  }

  // 6. Layout / Formatting Risk
  if (layout.layoutRisk === 'High') {
    candidateWins.push({
      score: 80,
      win: {
        title: 'Simplify Multi-Column Formatting to Single-Column Hierarchy',
        category: 'formatting',
        impactTier: 'High',
        easeTier: 'Moderate',
        issue: 'Detected multi-column tables or non-standard visual blocks that create parsing dropouts in legacy enterprise parsers.',
        recommendation: 'Convert complex two-column layouts into a single-column top-to-bottom hierarchy with standard margins (0.5–1.0 inch).',
        exampleBefore: 'Two-column split table with sidebar skills.',
        exampleAfter: 'Single-column linear document with distinct section dividers.'
      }
    });
  }

  // Sort by priority score and take top 5
  candidateWins.sort((a, b) => b.score - a.score);
  return candidateWins.slice(0, 5).map((item, index) => ({
    rank: index + 1,
    ...item.win
  }));
}

// ─── 6 VENDOR-INSPIRED SIMULATION ENGINE ────────────────────────────────────────

/**
 * Evaluates compatibility across 6 major enterprise ATS vendor profiles
 */
export function calculateVendorProfiles(
  parseabilityScore: number,
  contentQualityScore: number,
  jobMatchScore: number,
  contacts: ExtractedContacts,
  datesFoundCount: number,
  layoutRisk: 'Low' | 'Medium' | 'High'
): VendorSimulationScores {
  const layoutPenalty = layoutRisk === 'High' ? 18 : layoutRisk === 'Medium' ? 8 : 0;
  const linkBonus = (contacts.linkedin ? 4 : 0) + (contacts.github ? 4 : 0);
  const dateCompleteness = datesFoundCount >= 2 ? 100 : datesFoundCount === 1 ? 60 : 30;

  // 1. Greenhouse-Inspired: Balanced parseability + high content quality + links
  const greenhouse = Math.round(
    parseabilityScore * 0.35 +
    contentQualityScore * 0.40 +
    jobMatchScore * 0.25 -
    layoutPenalty * 0.7 +
    linkBonus
  );

  // 2. Lever-Inspired: Heavy skill categorization + candidate profile link integration
  const lever = Math.round(
    jobMatchScore * 0.45 +
    contentQualityScore * 0.30 +
    parseabilityScore * 0.25 +
    linkBonus * 1.5 -
    layoutPenalty * 0.5
  );

  // 3. Workday-Inspired: Heavy layout parseability + strict date range formatting
  const workday = Math.round(
    parseabilityScore * 0.45 +
    dateCompleteness * 0.25 +
    jobMatchScore * 0.20 +
    contentQualityScore * 0.10 -
    layoutPenalty * 1.2
  );

  // 4. Taleo-Inspired: Exact keyword matching density + educational structure
  const taleo = Math.round(
    jobMatchScore * 0.50 +
    parseabilityScore * 0.30 +
    contentQualityScore * 0.20 -
    layoutPenalty * 0.8
  );

  // 5. iCIMS-Inspired: Quantitative metric density + impact-to-experience linkage
  const icims = Math.round(
    contentQualityScore * 0.45 +
    jobMatchScore * 0.30 +
    parseabilityScore * 0.25 -
    layoutPenalty * 0.6
  );

  // 6. Ashby-Inspired: Modern tech stack recency + XYZ impact structure + GitHub presence
  const ashby = Math.round(
    contentQualityScore * 0.40 +
    jobMatchScore * 0.35 +
    parseabilityScore * 0.25 +
    (contacts.github ? 6 : 0) -
    layoutPenalty * 0.5
  );

  return {
    greenhouseInspired: Math.max(10, Math.min(100, greenhouse)),
    leverInspired: Math.max(10, Math.min(100, lever)),
    workdayInspired: Math.max(10, Math.min(100, workday)),
    taleoInspired: Math.max(10, Math.min(100, taleo)),
    icimsInspired: Math.max(10, Math.min(100, icims)),
    ashbyInspired: Math.max(10, Math.min(100, ashby))
  };
}

// ─── MASTER ATS AUDIT CONTROLLER ────────────────────────────────────────────────

/**
 * Main entrypoint: Performs deterministic multi-vendor ATS audit and quick-wins synthesis
 */
export function auditResumeATS(
  resumeText: string,
  options?: {
    targetRole?: RoleCategory;
    jobDescription?: string;
  }
): AtsAuditReport {
  const targetRole = options?.targetRole || 'sde';
  const text = (resumeText || '').trim();

  // 1. Extraction Layer
  const contacts = extractContacts(text);
  const sections = extractSections(text);
  const skills = extractSkills(text, targetRole, options?.jobDescription);
  const bullets = analyzeBullets(text);
  const layout = evaluateLayoutRisk(text);

  const datesMatched = (text.match(DATE_RANGE_REGEX) || []).length;

  // 2. Three-Tier Score Computation
  // Tier A: Parseability (0-100)
  let parseability = 40;
  if (contacts.email) parseability += 15;
  if (contacts.phone) parseability += 10;
  if (contacts.linkedin || contacts.github) parseability += 10;
  parseability += Math.min(sections.detected.length * 5, 25);
  if (datesMatched >= 2) parseability += 10;
  if (layout.layoutRisk === 'High') parseability -= 20;
  else if (layout.layoutRisk === 'Medium') parseability -= 10;
  const parseabilityScore = Math.max(15, Math.min(100, parseability));

  // Tier B: Content Quality & Impact (0-100)
  const quantRatio = bullets.quantifiedBullets / Math.max(bullets.totalBullets, 1);
  const powerVerbRatio = bullets.powerVerbsCount / Math.max(bullets.totalBullets, 1);
  let contentQuality = 30;
  contentQuality += Math.round(quantRatio * 40);
  contentQuality += Math.round(powerVerbRatio * 30);
  if (bullets.weakPhrasesCount > 0) contentQuality -= Math.min(bullets.weakPhrasesCount * 5, 15);
  const contentQualityScore = Math.max(15, Math.min(100, contentQuality));

  // Tier C: Job / Role Keyword Match (0-100)
  const totalTargetSkills = skills.matchedSkills.length + skills.missingSkills.length;
  const matchRatio = totalTargetSkills > 0 ? skills.matchedSkills.length / totalTargetSkills : 0.5;
  let jobMatch = Math.round(matchRatio * 75);
  if (skills.detectedSkills.length >= 8) jobMatch += 25;
  else jobMatch += skills.detectedSkills.length * 3;
  const jobMatchScore = Math.max(15, Math.min(100, jobMatch));

  // 3. Vendor Profiles Simulation
  const vendorProfiles = calculateVendorProfiles(
    parseabilityScore,
    contentQualityScore,
    jobMatchScore,
    contacts,
    datesMatched,
    layout.layoutRisk
  );

  // 4. Composite Overall ATS Compatibility Score
  const compositeScore = Math.round(
    parseabilityScore * 0.35 +
    contentQualityScore * 0.35 +
    jobMatchScore * 0.30
  );

  // 5. Synthesize Top 5 Actionable Quick Wins
  const quickWins = generateQuickWins(contacts, sections, skills, bullets, layout);

  return {
    engineVersion: ATS_ENGINE_VERSION,
    targetRole,
    compositeScore: Math.max(15, Math.min(100, compositeScore)),
    compatibilityScores: {
      parseabilityScore,
      contentQualityScore,
      jobMatchScore
    },
    vendorProfiles,
    extractedProfile: {
      contacts,
      sectionsDetected: sections.detected,
      missingSections: sections.missing,
      skillsDetected: skills.detectedSkills,
      matchedSkills: skills.matchedSkills,
      missingSkills: skills.missingSkills,
      quantifiedBulletsCount: bullets.quantifiedBullets,
      totalBulletsCount: bullets.totalBullets,
      powerVerbsCount: bullets.powerVerbsCount,
      layoutRisk: layout.layoutRisk
    },
    quickWins,
    disclaimer: ATS_LEGAL_DISCLAIMER
  };
}
