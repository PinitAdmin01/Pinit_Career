// Dynamic Corporate Communication Scenarios Catalog & Engine
// PinIT Career OS - Real-World Workplace Dilemmas

export interface CommunicationScenario {
  id: string;
  title: string;
  role: string;
  domain: 'tech' | 'product' | 'client' | 'career' | 'commerce';
  badge: string;
  difficulty: 'Junior' | 'Mid-Level' | 'Senior';
  courseIds?: string[];
  situation: string;
  prompt: string;
  placeholder: string;
  sampleKeywords: string[];
  etiquetteTip: string;
  defaultRewrites: {
    executive: string;
    professional: string;
    native: string;
  };
}

export const DYNAMIC_SCENARIO_CATALOG: CommunicationScenario[] = [
  // ── TECH & SOFTWARE ENGINEERING ──
  {
    id: 'outage',
    title: '🚨 Production Database Connection Spike',
    role: 'Engineering / Backend',
    domain: 'tech',
    badge: 'Critical Incident',
    difficulty: 'Mid-Level',
    courseIds: ['python', 'java', 'cloud', 'devops'],
    situation: 'The primary PostgreSQL cluster hit connection limits during peak traffic, triggering HTTP 504 gateway timeouts for checkout requests.',
    prompt: 'How would you inform your Engineering Manager and on-call team about the immediate blast radius, your mitigation action, and when service will stabilize?',
    placeholder: 'e.g. Hi team, connection pool exhaustion on the checkout DB caused 504 timeouts between 2:10 and 2:22 PM. I bumped max_connections and deployed PgBouncer pooling...',
    sampleKeywords: ['connection pool', 'blast radius', 'rollback', 'hotfix', 'pgbouncer', 'mitigation', 'eta'],
    etiquetteTip: 'Anchor incident updates with three elements: current customer impact, immediate mitigation step, and the exact next checkpoint time.',
    defaultRewrites: {
      executive: 'We mitigated the checkout DB connection saturation within 12 minutes. Traffic is normalized; connection pooling was resized and a blameless post-mortem will be published by 5 PM.',
      professional: 'Hi team, the checkout service experienced 504 errors due to a connection pool spike at 2:10 PM. We recycled stale connections, verified recovery, and are monitoring latency metrics closely.',
      native: 'Quick heads-up team: we had a DB connection spike that tripped 504s for about 12 minutes. Traffic is back to normal now, and I will keep everyone posted if anything looks off.',
    },
  },
  {
    id: 'pr_review',
    title: '💬 Disagreeing with a Senior Architect on PR Feedback',
    role: 'Software Developer',
    domain: 'tech',
    badge: 'Technical Debate',
    difficulty: 'Junior',
    courseIds: ['python', 'java', 'dsa'],
    situation: 'A Senior Architect commented on your Pull Request: "This nested loop design is unacceptable and will not scale past 10k items."',
    prompt: 'Respond professionally without getting defensive, explaining the legacy constraints that prompted your initial design while proposing an optimized hash map refactor.',
    placeholder: 'e.g. Thanks for the review! I used nested loops due to legacy payload schema constraints, but I agree O(N) lookup with a HashMap is far superior. I will push the refactor today...',
    sampleKeywords: ['complexity', 'hashmap', 'tradeoff', 'refactor', 'legacy', 'benchmark', 'constraints'],
    etiquetteTip: 'Acknowledge the technical validity of the critique first, explain context neutrally, and commit to the superior architectural solution.',
    defaultRewrites: {
      executive: 'Agreed on the scaling constraints. Refactoring the data traversal from O(N^2) to an indexed hash map lookup reduces execution time to O(N). Benchmark results will be attached to the PR.',
      professional: 'Thanks for catching that. The initial approach accommodated legacy payload formatting, but a HashMap lookup is clearly the right architectural path. I am pushing the refactored commit now.',
      native: 'Appreciate the feedback! You are totally right about the scaling bottleneck. I worked around legacy schema quirks initially, but I am refactoring it to a hash map right away.',
    },
  },
  {
    id: 'security_leak',
    title: '🔒 Accidental API Secret in Git Commit',
    role: 'Cybersecurity & Cloud',
    domain: 'tech',
    badge: 'Security Vulnerability',
    difficulty: 'Mid-Level',
    courseIds: ['cyber', 'cloud', 'devops'],
    situation: 'A junior teammate accidentally committed a staging AWS secret key to a shared branch that was pushed to GitHub.',
    prompt: 'How do you notify your Security Lead and the teammate immediately without causing public panic, ensuring secret rotation and git history scrubbing?',
    placeholder: 'e.g. Security alert: A staging AWS access key was exposed in commit abc1234. I have immediately revoked the key in IAM and am running git-filter-repo to sanitize the commit tree...',
    sampleKeywords: ['revoke', 'rotate', 'iam', 'blast radius', 'audit log', 'git filter', 'sanitized'],
    etiquetteTip: 'Treat credential exposure with blameless urgency: rotate the credential first, assess access logs second, and scrub history third.',
    defaultRewrites: {
      executive: 'We detected and revoked a staging AWS key exposed on GitHub within 8 minutes. CloudTrail audit shows zero unauthorized API calls, and the repository history has been fully sanitized.',
      professional: 'Security notification: Staging credential exposed in commit abc1234 was immediately revoked in IAM. We rotated the secret across environments and purged the commit from the remote history.',
      native: 'Heads-up on a quick security patch: a staging key landed in a commit, so I immediately revoked it in AWS and rotated the secret. No unauthorized calls were recorded in the audit logs.',
    },
  },
  {
    id: 'broken_pipeline',
    title: '⚙️ CI/CD Pipeline Failure on Release Friday',
    role: 'DevOps & Reliability',
    domain: 'tech',
    badge: 'Deployment Risk',
    difficulty: 'Mid-Level',
    courseIds: ['devops', 'cloud'],
    situation: 'A Docker build cache invalidation caused the automated release pipeline to fail 45 minutes before the scheduled customer maintenance window.',
    prompt: 'Communicate the deployment blocker to the Release Manager, explaining the root cause and recommending either a targeted hotfix or a clean abort.',
    placeholder: 'e.g. Hi Sarah, our release pipeline hit a Docker cache error on step 4. Fixing the base layer will take 40 minutes, which cuts too close to the window. I recommend holding off until Monday...',
    sampleKeywords: ['pipeline', 'docker cache', 'maintenance window', 'postpone', 'rollback', 'risk assessment'],
    etiquetteTip: 'Never rush a compromised deployment under deadline pressure. Present concrete trade-offs and advocate for system stability.',
    defaultRewrites: {
      executive: 'Pipeline build instability poses high deployment risk for the 5 PM maintenance window. I recommend aborting the release to maintain platform SLAs and scheduling a clean rollout for Monday 9 AM.',
      professional: 'The release pipeline failed at the container build stage. Remediation requires approximately 45 minutes, conflicting with the customer window. I advise postponing to guarantee production safety.',
      native: 'Hey team, the Docker build broke on step 4 and fixing it will cut too close to the release window. Let us hold off until Monday morning so we do not risk downtime over the weekend.',
    },
  },

  // ── PRODUCT, DELIVERY & AGILE ──
  {
    id: 'delay',
    title: '⏳ Project Deadline & Scope Delay',
    role: 'Product / Agile',
    domain: 'product',
    badge: 'Timeline Risk',
    difficulty: 'Junior',
    courseIds: ['python', 'java', 'dsa'],
    situation: 'A third-party authentication API changed its contract without notice, making it impossible to deliver user onboarding by Friday.',
    prompt: 'How would you communicate this timeline risk to your Product Manager while maintaining stakeholder confidence and offering clear trade-off choices?',
    placeholder: 'e.g. Hi Sarah, due to an unannounced auth API schema change, completing feature X by Friday risks regressions. I propose we ship the core flow now and follow up with OAuth next Tuesday...',
    sampleKeywords: ['trade-off', 'mvp', 'timeline', 'blocker', 'phased rollout', 're-estimate', 'confidence'],
    etiquetteTip: 'Deliver bad news early with viable alternatives. Never announce a delay without presenting an MVP de-scoping option.',
    defaultRewrites: {
      executive: 'Third-party OAuth API contract changes impact Friday delivery. To protect quality, we can either release core email onboarding on schedule or deliver the full unified suite next Tuesday.',
      professional: 'Hi Sarah, an unexpected third-party API breaking change requires 16 additional engineering hours. I recommend releasing Phase 1 on Friday and delivering the secondary integrations on Tuesday.',
      native: 'Quick update on Friday sprint goals: the vendor changed their auth API specs, so shipping everything by Friday introduces risk. I suggest we ship the main flow now and wrap up OAuth by Tuesday.',
    },
  },
  {
    id: 'scope_creep',
    title: '🛑 Pushing Back on Late Scope Creep from Sales',
    role: 'Product / Tech Lead',
    domain: 'product',
    badge: 'Scope Integrity',
    difficulty: 'Mid-Level',
    courseIds: ['python', 'java', 'cloud'],
    situation: 'A Sales VP asks you to "quickly squeeze in a custom Excel export" two days before code freeze for a prospective client demo.',
    prompt: 'How do you decline or defer the request diplomatically without burning bridges, explaining sprint capacity and protecting current team commitments?',
    placeholder: 'e.g. Thanks for sharing this client opportunity! Because sprint commitments are locked for QA freeze, adding custom exports now would jeopardize our core release. Let us backlog this for Sprint 14...',
    sampleKeywords: ['capacity', 'code freeze', 'backlog', 'sprint goal', 'trade-off', 'prioritize', 'roadmap'],
    etiquetteTip: 'Do not say a flat "no". Frame your response around protecting promised customer deliverables and offer an immediate backlog scheduling path.',
    defaultRewrites: {
      executive: 'We cannot incorporate custom Excel export prior to Thursday freeze without dropping core compliance features. I have scheduled this as priority item #1 for the upcoming sprint starting Monday.',
      professional: 'I understand this is a valuable sales opportunity. However, our engineering capacity is fully committed to code freeze testing. I recommend presenting mock data for the demo while we build it next sprint.',
      native: 'Totally hear you on the client demo! We are locked into testing for Thursday release, so squeezing this in now would risk breaking things. Let us tackle it first thing next sprint on Monday.',
    },
  },

  // ── CLIENT & STAKEHOLDER MANAGEMENT ──
  {
    id: 'client_apology',
    title: '🤝 Enterprise Client Escalation & SLA Breach',
    role: 'Client Advisory / Account Lead',
    domain: 'client',
    badge: 'Executive Advisory',
    difficulty: 'Senior',
    courseIds: ['cloud', 'devops', 'cyber'],
    situation: 'An enterprise client CEO is furious because the reporting dashboard was unreachable for 3 hours during their quarterly board meeting.',
    prompt: 'Draft an executive email to the client CEO taking full ownership without making excuses, explaining the root cause, and outlining preventative infrastructure hardening.',
    placeholder: 'e.g. Dear Mark, I am writing to sincerely apologize for the outage during your board presentation. Our infrastructure team identified a cache deadlock. Here is our remediation plan...',
    sampleKeywords: ['sla', 'ownership', 'apology', 'root cause', 'preventative measures', 'redundancy', 'credit'],
    etiquetteTip: 'Never blame third parties or junior employees. Take unconditional executive accountability, state what was fixed, and offer an SLA service credit.',
    defaultRewrites: {
      executive: 'Dear Mark, I offer my sincere apologies for today service disruption during your board meeting. We identified and eliminated the cache deadlock, implemented active failover, and applied full SLA credits to your account.',
      professional: 'Dear Mr. Davis, I am reaching out directly regarding the outage experienced earlier today. We take full ownership of the failure. Our engineering team has doubled regional cluster redundancy to permanently eliminate this bottleneck.',
      native: 'Dear Mark, I am truly sorry about the disruption during your meeting today. There is no excuse for the downtime. We resolved the caching failure, deployed redundant failovers, and will share the full incident debrief by EOD.',
    },
  },
  {
    id: 'budget_alert',
    title: '📈 Explaining an Unexpected Cloud Infrastructure Spike',
    role: 'Cloud FinOps / Tech Lead',
    domain: 'client',
    badge: 'Financial Transparency',
    difficulty: 'Mid-Level',
    courseIds: ['cloud', 'devops'],
    situation: 'Last month cloud bill came in $14,200 over budget due to un-indexed analytics queries running against an unpartitioned BigQuery dataset.',
    prompt: 'Communicate this cost overrun to the VP of Finance, explaining why it occurred, the immediate partitioning fix implemented, and your ongoing cost governance guardrails.',
    placeholder: 'e.g. Hi David, the $14.2k variance in our cloud invoice stemmed from full-table scans in our analytics pipeline. We have applied date partitioning and automated billing alerts to prevent recurring spikes...',
    sampleKeywords: ['finops', 'variance', 'bigquery', 'partitioning', 'guardrails', 'budget alert', 'cost optimization'],
    etiquetteTip: 'State the exact dollar amount and root cause upfront, demonstrate that the leak is plugged, and show forecasted future savings.',
    defaultRewrites: {
      executive: 'The $14.2k cloud invoice variance resulted from unpartitioned analytics queries during our product launch. Partitioning and clustering rules are now enforced, reducing projected query spend by 78%.',
      professional: 'Hi David, regarding the cloud budget overage: full-table scans on raw analytics data drove higher compute charges. We partitioned the tables yesterday, capped query byte limits, and configured alert thresholds.',
      native: 'Quick debrief on the cloud bill overage: an unpartitioned analytics table ran full scans during peak traffic. We plugged the leak with date partitioning, which cuts query costs down by nearly 80% moving forward.',
    },
  },

  // ── COMMERCE, FINANCE & AUDIT ──
  {
    id: 'audit_variance',
    title: '📑 Communicating a $45,000 Ledger Reconciliation Discrepancy',
    role: 'Financial Analyst / Audit',
    domain: 'commerce',
    badge: 'Statutory Compliance',
    difficulty: 'Mid-Level',
    courseIds: ['bcom_acc', 'bcom_aud', 'bcom_fin'],
    situation: 'During month-end close, you uncovered a $45,000 discrepancy between the ERP general ledger and the bank settlement statement.',
    prompt: 'Brief your Senior Controller on the variance, isolating the timing delay in credit card receivables, and confirm when the reconciliation will balance.',
    placeholder: 'e.g. Hi Priya, I identified a $45,000 variance between GL account 1010 and the merchant payout. It is a 48-hour batch settlement timing difference from the holiday weekend, not missing funds...',
    sampleKeywords: ['reconciliation', 'timing difference', 'general ledger', 'variance', 'settlement', 'controller', 'clearing'],
    etiquetteTip: 'Distinguish timing differences from structural losses immediately to prevent unnecessary audit alarms.',
    defaultRewrites: {
      executive: 'The $45,000 month-end variance is a confirmed 48-hour batch settlement timing difference from the holiday weekend. Bank confirmation has been received and the ledger will balance by 2 PM today.',
      professional: 'Hi Priya, I reviewed the $45k reconciliation variance on GL account 1010. The funds are accounted for in the merchant settlement pipeline and will clear automatically upon today bank transfer.',
      native: 'Good news on the $45k variance: it turns out to be just a timing delay from the bank holiday batch. All merchant logs match up, and the ledger will be fully squared away by this afternoon.',
    },
  },
  {
    id: 'vendor_pushback',
    title: '🏢 Vendor Demanding Payment Without Signed PO',
    role: 'Corporate Procurement / Accounts Payable',
    domain: 'commerce',
    badge: 'Procurement Policy',
    difficulty: 'Junior',
    courseIds: ['bcom_ban', 'bcom_acc'],
    situation: 'An external software vendor threatens to cut off licensing access unless an invoice is paid today, but internal compliance requires an executive purchase order signature.',
    prompt: 'How do you respond firmly yet cordially, upholding organizational compliance while expediting internal procurement approvals to avoid service termination?',
    placeholder: 'e.g. Dear Sarah, we value our partnership and want to ensure timely settlement. Our financial policy requires a counter-signed PO for invoice processing. I have marked this high priority with our CFO...',
    sampleKeywords: ['compliance', 'purchase order', 'expedite', 'governance', 'partnership', 'approval workflow'],
    etiquetteTip: 'Never bypass financial controls under vendor pressure. Empathize with their billing cycle while actively owning the internal escalation.',
    defaultRewrites: {
      executive: 'We are committed to honoring payment commitments promptly. To comply with corporate audit standards, invoice disbursement requires a validated PO. I have submitted this for emergency CFO sign-off today.',
      professional: 'Dear Sarah, thank you for your patience. Corporate financial controls require an approved PO prior to fund release. I have escalated this to our Director of Finance to secure expedited approval today.',
      native: 'Hi Sarah, totally understand the urgency on this invoice. Our audit policy requires a signed PO before finance can release payment, but I have already flagged it as an emergency with our controller.',
    },
  },

  // ── CAREER & WORKPLACE LEADERSHIP ──
  {
    id: 'negotiation',
    title: '💼 Counter-Offering Salary & Equity Offer Letter',
    role: 'Career Readiness / Talent',
    domain: 'career',
    badge: 'Offer Negotiation',
    difficulty: 'Junior',
    courseIds: ['python', 'java', 'cloud', 'bcom_fin', 'bcom_mkt'],
    situation: 'A hiring manager offered $82,000 base salary, but based on market benchmarks and your demonstrated full-stack capabilities, your target range is $94,000–$98,000.',
    prompt: 'Draft a diplomatic counter-offer email expressing enthusiasm for the role, grounding your target in market data and unique architectural competencies.',
    placeholder: 'e.g. Thank you so much for extending this offer! I am thrilled about the opportunity to build the data platform. Based on current market benchmarks and my track record in distributed systems...',
    sampleKeywords: ['market rate', 'value proposition', 'enthusiasm', 'counter-offer', 'benchmarks', 'compensation'],
    etiquetteTip: 'Express enthusiasm for the team first, justify the counter-offer with concrete skills and market data second, and maintain a collaborative tone.',
    defaultRewrites: {
      executive: 'Thank you for the offer; I am very excited about driving the roadmap. In light of my distributed systems expertise and current market benchmarks, I am seeking a base salary of $95,000 to finalize our agreement.',
      professional: 'Thank you for this compelling offer. I am genuinely enthusiastic about joining the team. Based on verified market compensation data for senior developers in this domain, could we explore a base of $95,000?',
      native: 'Thanks so much for extending the offer! I am really excited about joining the team. Given my experience with cloud migrations and current market rates, I was hoping we could land closer to $95k base.',
    },
  },
  {
    id: 'credit_conflict',
    title: '👥 Addressing a Colleague Taking Credit for Your Work',
    role: 'Team Dynamics / Leadership',
    domain: 'career',
    badge: 'Workplace Conflict',
    difficulty: 'Mid-Level',
    courseIds: ['python', 'java', 'bcom_mkt'],
    situation: 'During an all-hands demo, a peer presented the caching architecture you designed and implemented as solely their own accomplishment.',
    prompt: 'How would you address this with your colleague 1-on-1 constructively without creating toxic friction, while ensuring future collaborative alignment and visibility?',
    placeholder: 'e.g. Hey Alex, great job presenting the demo today! I noticed the caching architecture was presented as an individual project. In the future, I would appreciate co-attribution so leadership sees our joint efforts...',
    sampleKeywords: ['attribution', 'collaboration', '1-on-1', 'alignment', 'visibility', 'constructive feedback'],
    etiquetteTip: 'Address attribution issues directly in private, praise the presentation quality first, and establish explicit guidelines for shared credit.',
    defaultRewrites: {
      executive: 'Alex, strong execution on the demo today. Given that the caching architecture and benchmarking were my primary deliverables, I expect mutual attribution in stakeholder presentations going forward.',
      professional: 'Hi Alex, great job walking through the demo. I wanted to touch base regarding the caching architecture slides: since I architected and implemented that service, I would appreciate shared attribution in team updates.',
      native: 'Hey Alex, nice delivery on the demo! Quick heads-up though: since I spent the last month building that caching engine, it felt a bit surprising not to see co-attribution. Let us make sure we both get credit on future presentations.',
    },
  },
];

/**
 * Filter or generate scenarios dynamically based on the student's active course or category
 */
export function getScenariosForContext(courseId?: string, domainFilter?: string): CommunicationScenario[] {
  let list = [...DYNAMIC_SCENARIO_CATALOG];

  if (domainFilter && domainFilter !== 'all') {
    list = list.filter((s) => s.domain === domainFilter);
  }

  if (courseId) {
    const courseMatches = list.filter((s) => s.courseIds?.includes(courseId.toLowerCase()));
    if (courseMatches.length > 0) {
      // Prioritize course matches to the front
      const others = list.filter((s) => !s.courseIds?.includes(courseId.toLowerCase()));
      list = [...courseMatches, ...others];
    }
  }

  return list;
}
