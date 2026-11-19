/**
 * Curated Company Intelligence Profiles for Target Company Interview Presets.
 * Clean-room TypeScript synthesis tailored for PinIT's 4-round enterprise interview loop.
 */

export interface CompanyInterviewProfile {
  id: string;
  name: string;
  industry: string;
  interviewStyle: string;
  culturalValues: string[];
  roundFocus: {
    behavioral: string;
    coding: string;
    systems: string;
    star: string;
  };
  aliases: string[];
}

export const COMPANY_PROFILES: CompanyInterviewProfile[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    industry: 'Cloud & E-Commerce (AWS)',
    interviewStyle: 'Leadership Principles & Bar-Raiser Rigor',
    culturalValues: [
      'Customer Obsession',
      'Ownership',
      'Dive Deep',
      'Bias for Action',
      'Have Backbone; Disagree and Commit',
      'Deliver Results'
    ],
    roundFocus: {
      behavioral: 'Probe explicitly for Ownership, Customer Obsession, Disagree and Commit, and Dive Deep with unambiguous "I" actions rather than "we".',
      coding: 'Emphasize clean object-oriented maintainability, edge-case discipline, and O(N)/O(log N) scalability.',
      systems: 'Stress-test multi-region availability, SQS/SNS async decoupling, idempotency, and operational alarms.',
      star: 'Demand strict Situation-Task-Action-Result evidence tied to Amazon Leadership Principles and quantified metrics.'
    },
    aliases: ['aws', 'amazon web services', 'amzn']
  },
  {
    id: 'google',
    name: 'Google',
    industry: 'Search, Cloud & AI Systems',
    interviewStyle: 'GCA (General Cognitive Ability) & Algorithms',
    culturalValues: [
      'General Cognitive Ability (GCA)',
      'Googleyness (humility & collaboration)',
      'Role-Related Knowledge',
      'Data-Driven Ambiguity Resolution',
      'Comfort with 10x Scale'
    ],
    roundFocus: {
      behavioral: 'Assess structured problem-solving under ambiguity, psychological safety, and navigating disagreement with data.',
      coding: 'Require optimal asymptotic time/space complexity, dry runs, and clean algorithmic invariants before coding.',
      systems: 'Probe planetary 10x scale, sharding keys, tail-latency p99 mitigation, and consistency vs availability trade-offs.',
      star: 'Evaluate emergent leadership, cross-team alignment on ambiguous problems, and measurable reliability impact.'
    },
    aliases: ['alphabet', 'google deepmind', 'deepmind', 'gcp']
  },
  {
    id: 'meta',
    name: 'Meta',
    industry: 'Social Platforms & AI Infrastructure',
    interviewStyle: 'High-Velocity Execution & Product Architecture',
    culturalValues: [
      'Move Fast',
      'Focus on Long-Term Impact',
      'Be Bold',
      'Build Social Value',
      'Live in the Future'
    ],
    roundFocus: {
      behavioral: 'Explore fast iteration cycles, learning from bold failures, and resolving cross-functional friction rapidly.',
      coding: 'Expect rapid, bug-free production code on graphs, trees, and strings with clear complexity analysis.',
      systems: 'Focus on feed fan-out, write-heavy ingestion, TAO/Memcached caching tiers, and rate limiting at massive QPS.',
      star: 'Challenge the candidate on execution velocity, pragmatic MVP scoping vs technical debt, and user-level impact.'
    },
    aliases: ['fb', 'facebook', 'meta platforms']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    industry: 'Enterprise Cloud & Productivity Platforms',
    interviewStyle: 'Growth Mindset & Collaborative Architecture',
    culturalValues: [
      'Growth Mindset',
      'Customer Obsession',
      'One Microsoft Collaboration',
      'Enterprise Reliability & Security'
    ],
    roundFocus: {
      behavioral: 'Evaluate learn-it-all mindset, mentoring peers, and turning setbacks into durable process improvements.',
      coding: 'Assess clean modular abstractions, defensive null/boundary checks, and practical data structure choices.',
      systems: 'Emphasize multi-tenant isolation, RBAC security boundaries, enterprise SLAs, and backward-compatible APIs.',
      star: 'Probe long-term maintainability choices, cross-org collaboration, and measurable developer or customer gains.'
    },
    aliases: ['msft', 'azure', 'ms']
  },
  {
    id: 'apple',
    name: 'Apple',
    industry: 'Consumer Hardware, OS & Services',
    interviewStyle: 'Craftsmanship, Privacy & End-to-End Integration',
    culturalValues: [
      'Obsessive User Experience Craft',
      'Privacy & On-Device Security',
      'Cross-Disciplinary Secrecy & Ownership',
      'Performance & Battery Efficiency'
    ],
    roundFocus: {
      behavioral: 'Probe relentless attention to quality detail, refusing mediocre shortcuts, and collaborating across hardware/software.',
      coding: 'Focus on memory footprint, deterministic latency, clean state machines, and zero-leak resource management.',
      systems: 'Evaluate end-to-end privacy encryption, offline-first synchronization, graceful degradation, and low-power budgets.',
      star: 'Highlight individual craftsmanship, debugging elusive race conditions, and protecting end-user trust.'
    },
    aliases: ['aapl', 'ios']
  },
  {
    id: 'netflix',
    name: 'Netflix',
    industry: 'Global Streaming & Distributed Media',
    interviewStyle: 'Context Not Control & Radical Candor',
    culturalValues: [
      'Freedom and Responsibility',
      'Context, Not Control',
      'Highly Aligned, Loosely Coupled',
      'Candid Feedback & Judgment'
    ],
    roundFocus: {
      behavioral: 'Look for senior independent judgment, candidly challenging flawed assumptions, and high ownership without micromanagement.',
      coding: 'Assess clean resilient streaming/retry algorithms, concurrent state safety, and clear trade-off articulation.',
      systems: 'Test chaos engineering, circuit breakers, adaptive bitrate CDN routing, and graceful degradation under regional outage.',
      star: 'Probe high-stakes autonomous decisions, radical candor moments, and resilience improvements.'
    },
    aliases: ['nflx']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    industry: 'Global Financial Infrastructure & APIs',
    interviewStyle: 'API Ergonomics, Idempotency & Correctness',
    culturalValues: [
      'Users First',
      'Think Rigorously',
      'Move with Urgency and Focus',
      'Meticulous Financial Accuracy'
    ],
    roundFocus: {
      behavioral: 'Explore obsession with developer empathy, meticulous debugging of edge cases, and principled engineering standards.',
      coding: 'Evaluate clean real-world parsing, state transitions, currency precision (integer cents), and defensive validation.',
      systems: 'Demand strict idempotency keys, ledger double-entry consistency, webhook retries with exponential backoff, and PCI boundaries.',
      star: 'Assess incident prevention in mission-critical money movement and long-term API backward compatibility.'
    },
    aliases: ['stripe payments']
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    industry: 'Accelerated Computing, GPUs & AI Systems',
    interviewStyle: 'Hardware-Software Co-Design & Throughput',
    culturalValues: [
      'Intellectual Honesty',
      'Speed of Light Performance Optimization',
      'First-Principles Systems Thinking',
      'Cross-Stack Collaboration'
    ],
    roundFocus: {
      behavioral: 'Probe deep root-cause debugging at system boundaries and objective data-first technical debates.',
      coding: 'Focus on memory locality, cache efficiency, concurrency synchronization, and low-overhead algorithms.',
      systems: 'Stress-test GPU/inference serving pipelines, batching throughput vs p99 latency, telemetry, and memory bandwidth limits.',
      star: 'Require concrete profiling evidence, bottleneck elimination metrics, and first-principles engineering.'
    },
    aliases: ['nvda']
  },
  {
    id: 'uber',
    name: 'Uber',
    industry: 'Real-Time Mobility & Marketplace Logistics',
    interviewStyle: 'Geo-Distributed Scale & Real-Time Dispatch',
    culturalValues: [
      'Go Get It & Ownership',
      'Great Minds Don’t Think Alike',
      'Build With Heart for Real-World Scale',
      'Do the Right Thing'
    ],
    roundFocus: {
      behavioral: 'Explore fast triage during live operational incidents and balancing competing marketplace stakeholders.',
      coding: 'Assess spatial/graph heuristics, priority scheduling, sliding windows, and high-concurrency correctness.',
      systems: 'Probe geospatial indexing (H3/geohash), low-latency matching loops, Kafka event pipelines, and surge isolation.',
      star: 'Highlight production reliability improvements affecting real-time SLA compliance and marketplace health.'
    },
    aliases: ['uber technologies']
  },
  {
    id: 'atlassian',
    name: 'Atlassian',
    industry: 'Team Collaboration & Developer SaaS',
    interviewStyle: 'Values-Aligned Collaboration & SaaS Scale',
    culturalValues: [
      'Open Company, No Bullshit',
      'Play, as a Team',
      'Build with Heart and Balance',
      'Don’t #@!% the Customer'
    ],
    roundFocus: {
      behavioral: 'Assess transparent communication, healthy conflict resolution, and putting team velocity over ego.',
      coding: 'Evaluate readable, well-tested modular code, permission modeling, and predictable complexity.',
      systems: 'Focus on multi-tenant SaaS sharding, audit logs, webhook/event buses, and zero-downtime migrations.',
      star: 'Probe cross-team unblocking, blameless post-mortems, and customer-centric reliability wins.'
    },
    aliases: ['team', 'jira']
  },
  {
    id: 'goldman_sachs',
    name: 'Goldman Sachs',
    industry: 'Investment Banking & Quantitative Finance',
    interviewStyle: 'Fiduciary Rigor, Low-Latency & Quantitative Precision',
    culturalValues: [
      'Client Service & Fiduciary Integrity',
      'Excellence & Quantitative Precision',
      'Meritocracy & Risk Discipline',
      'Teamwork Under Market Pressure'
    ],
    roundFocus: {
      behavioral: 'Probe composure under high-pressure market deadlines, ethical judgment, and attention to numerical accuracy.',
      coding: 'Emphasize deterministic order-book/numerical precision, zero floating-point drift, and predictable low latency.',
      systems: 'Test auditability, risk controls, active-active failover, reconciliation ledgers, and regulatory compliance.',
      star: 'Demand quantifiable financial or latency risk mitigation and disciplined stakeholder accountability.'
    },
    aliases: ['goldman', 'gs', 'goldman sachs group']
  },
  {
    id: 'jpmorgan',
    name: 'JPMorgan Chase',
    industry: 'Global Banking, Payments & Treasury',
    interviewStyle: 'Resilient Financial Architecture & Compliance',
    culturalValues: [
      'Operational Resilience & Security',
      'Exceptional Client Service',
      'Disciplined Risk & Controls',
      'High-Integrity Teamwork'
    ],
    roundFocus: {
      behavioral: 'Evaluate adherence to verification controls, handling competing regulatory vs product priorities, and ownership.',
      coding: 'Assess thread-safe transaction processing, ledger invariants, boundary validation, and SQL/data integrity.',
      systems: 'Focus on ACID settlement guarantees, idempotent clearing queues, audit trails, and disaster recovery RTO/RPO.',
      star: 'Probe modernization of legacy workflows, defect prevention, and measurable operational savings.'
    },
    aliases: ['jpm', 'jpmorgan', 'jp morgan', 'chase']
  },
  {
    id: 'mckinsey',
    name: 'McKinsey & Company',
    industry: 'Management & Strategy Consulting',
    interviewStyle: 'MECE Case Structuring & Personal Impact',
    culturalValues: [
      'Obligation to Dissent',
      'MECE Structured Problem Solving',
      'Quantifiable Client Impact',
      'Top-Down Executive Communication'
    ],
    roundFocus: {
      behavioral: 'Test PEI (Personal Experience Interview): leading without authority, dissenting respectfully with data, and entrepreneurial drive.',
      coding: 'Focus on clean analytical decomposition, unit-economics modeling, and sanity-checking edge assumptions.',
      systems: 'Evaluate MECE workflow decomposition, bottleneck identification, ROI trade-offs, and scalability roadmaps.',
      star: 'Require crisp top-down executive synthesis backed by concrete percentages, dollars, and stakeholder alignment.'
    },
    aliases: ['mckinsey', 'mck', 'mckinsey & co']
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    industry: 'Audit, Assurance, Advisory & Cloud Consulting',
    interviewStyle: 'Statutory Precision, Client Advisory & Delivery',
    culturalValues: [
      'Integrity & Professional Skepticism',
      'Client Trust & Advisory Clarity',
      'Auditability & Compliance',
      'Cross-Functional Execution'
    ],
    roundFocus: {
      behavioral: 'Explore managing difficult client stakeholders, upholding audit/quality independence, and tight deadline execution.',
      coding: 'Assess structured logic, reconciliation/validation accuracy, SQL aggregation, and defensive error handling.',
      systems: 'Focus on compliance gates, ERP/data governance, Segregation of Duties, and traceable workflow pipelines.',
      star: 'Highlight quantifiable efficiency improvements, audit defect prevention, and client communication wins.'
    },
    aliases: ['deloitte consulting', 'deloitte touchet']
  }
];

/**
 * Resolves a user-entered company name or alias into a curated CompanyInterviewProfile.
 */
export function resolveCompanyProfile(query?: string | null): CompanyInterviewProfile | null {
  if (!query || typeof query !== 'string') return null;
  const norm = query.trim().toLowerCase().replace(/[^a-z0-9\s&.-]/g, '').trim();
  if (!norm || norm === 'standard' || norm === 'none' || norm === 'general') return null;

  for (const profile of COMPANY_PROFILES) {
    if (profile.id === norm || profile.name.toLowerCase() === norm) {
      return profile;
    }
    if (profile.aliases.some(alias => alias.toLowerCase() === norm)) {
      return profile;
    }
  }

  for (const profile of COMPANY_PROFILES) {
    if (
      profile.name.toLowerCase().includes(norm) ||
      norm.includes(profile.name.toLowerCase()) ||
      profile.aliases.some(alias => norm.includes(alias.toLowerCase()))
    ) {
      return profile;
    }
  }

  return null;
}

/**
 * Builds a concise stage-specific instruction block for prompts (Chat, Assist, Evaluate).
 */
export function buildCompanyPromptContext(profile: CompanyInterviewProfile | null, stage: string): string {
  if (!profile) return '';

  let roundDirective = profile.roundFocus.behavioral;
  if (stage === 'round2_coding') roundDirective = profile.roundFocus.coding;
  else if (stage === 'round3_systems') roundDirective = profile.roundFocus.systems;
  else if (stage === 'round4_star') roundDirective = profile.roundFocus.star;
  else if (stage === 'results' || stage === 'evaluate' || stage === 'all') {
    roundDirective = [
      `Round 1 Behavioral: ${profile.roundFocus.behavioral}`,
      `Round 2 Coding: ${profile.roundFocus.coding}`,
      `Round 3 Systems: ${profile.roundFocus.systems}`,
      `Round 4 STAR: ${profile.roundFocus.star}`
    ].join(' | ');
  }

  return [
    `TARGET COMPANY SIMULATION: ${profile.name} (${profile.industry})`,
    `Hiring Bar & Style: ${profile.interviewStyle}`,
    `Core Cultural Values: ${profile.culturalValues.join(', ')}`,
    `Current Stage Directive: ${roundDirective}`,
    `Simulation Rule: Calibrate rigor to ${profile.name}'s hiring standards without claiming to be an actual employee of ${profile.name}.`
  ].join('\n');
}
