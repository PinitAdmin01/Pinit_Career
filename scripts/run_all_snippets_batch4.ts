// scripts/run_all_snippets_batch4.ts
import * as fs from "fs";
const outputs: Record<string, string> = {};

function capture(key: string, fn: () => void) {
  const originalLog = console.log;
  const logs: string[] = [];
  console.log = (...args: any[]) => {
    logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));
  };
  try {
    fn();
  } catch (err: any) {
    logs.push("ERROR: " + err.message);
  } finally {
    console.log = originalLog;
  }
  outputs[key] = logs.join("\n");
}

// --- day46_part1 ---
capture("day46_part1", () => {
  interface EquityGrant {
    type: 'ISO' | 'NSO' | 'RSU';
    shares: number;
    strikePrice: number;
    currentValuationPerShare: number;
    vestingYears: number;
    cliffMonths: number;
    liquidationPreferenceMultiple: number;
  }
  
  function evaluateEquityRealization(grant: EquityGrant, exitValuationPerShare: number): {
    grossValue: number;
    exerciseCost: number;
    netPreTaxGain: number;
    dilutionAdjustedShares: number;
  } {
    const dilutionFactor = 0.82; // standard 18% dilution across follow-on growth
    const effectiveShares = Math.floor(grant.shares * (grant.type === 'RSU' ? 1.0 : dilutionFactor));
    const effectiveExit = Math.max(0, exitValuationPerShare - (grant.liquidationPreferenceMultiple > 1.0 ? 0.5 : 0.0));
    const grossValue = effectiveShares * effectiveExit;
    const exerciseCost = grant.type === 'RSU' ? 0 : effectiveShares * grant.strikePrice;
    const netPreTaxGain = Math.max(0, grossValue - exerciseCost);
  
    return { grossValue, exerciseCost, netPreTaxGain, dilutionAdjustedShares: effectiveShares };
  }
  
  const startupGrant: EquityGrant = {
    type: 'ISO',
    shares: 40000,
    strikePrice: 1.25,
    currentValuationPerShare: 6.50,
    vestingYears: 4,
    cliffMonths: 12,
    liquidationPreferenceMultiple: 1.0
  };
  
  const result = evaluateEquityRealization(startupGrant, 18.00);
  console.log(`Grant Type: ${startupGrant.type}`);
  console.log(`Dilution Adjusted Shares: ${result.dilutionAdjustedShares}`);
  console.log(`Exercise Cost: $${result.exerciseCost.toLocaleString()}`);
  console.log(`Estimated Pre-Tax Realization: $${result.netPreTaxGain.toLocaleString()}`);
});

// --- day46_part2 ---
capture("day46_part2", () => {
  interface OfferPackage {
    company: string;
    tier: 'PublicBigTech' | 'SeriesCUnicorn' | 'PreSeed';
    baseSalary: number;
    annualEquity: number;
    targetBonusPct: number;
    signOnBonusProratedYear1: number;
    liquidityDiscount: number;
  }
  
  function calculateAnnualizedTC(offer: OfferPackage): {
    nominalTC: number;
    riskAdjustedTC: number;
  } {
    const bonus = offer.baseSalary * (offer.targetBonusPct / 100);
    const nominalTC = offer.baseSalary + bonus + offer.annualEquity + offer.signOnBonusProratedYear1;
    const discountedEquity = offer.annualEquity * (1 - offer.liquidityDiscount);
    const riskAdjustedTC = offer.baseSalary + bonus + discountedEquity + offer.signOnBonusProratedYear1;
    return { nominalTC, riskAdjustedTC };
  }
  
  const offers: OfferPackage[] = [
    { company: 'CloudScale Inc', tier: 'PublicBigTech', baseSalary: 195000, annualEquity: 140000, targetBonusPct: 15, signOnBonusProratedYear1: 30000, liquidityDiscount: 0.05 },
    { company: 'HyperVanguard', tier: 'SeriesCUnicorn', baseSalary: 180000, annualEquity: 165000, targetBonusPct: 10, signOnBonusProratedYear1: 25000, liquidityDiscount: 0.35 },
    { company: 'StealthKernel', tier: 'PreSeed', baseSalary: 140000, annualEquity: 220000, targetBonusPct: 0, signOnBonusProratedYear1: 0, liquidityDiscount: 0.75 }
  ];
  
  console.log("=== 4-YEAR TOTAL COMPENSATION COMPARISON (YEAR 1) ===");
  for (const o of offers) {
    const res = calculateAnnualizedTC(o);
    console.log(`${o.company} [${o.tier}]: Nominal=$${res.nominalTC.toLocaleString()} | RiskAdjusted=$${res.riskAdjustedTC.toLocaleString()}`);
  }
});

// --- day46_part3 ---
capture("day46_part3", () => {
  class TotalCompSimulatorCLI {
    static simulateDilutionAndExit(initialOptions: number, strike: number, rounds: { name: string; dilution: number }[], exitSharePrice: number) {
      let currentShares = initialOptions;
      console.log(`Starting Baseline Options: ${currentShares.toLocaleString()} @ Strike $${strike.toFixed(2)}`);
      for (const r of rounds) {
        currentShares = Math.floor(currentShares * (1 - r.dilution));
        console.log(` -> After ${r.name} (Dilution ${r.dilution * 100}%): ${currentShares.toLocaleString()} shares`);
      }
      const grossValue = currentShares * exitSharePrice;
      const exerciseCost = currentShares * strike;
      const netProceeds = Math.max(0, grossValue - exerciseCost);
      const estimatedTax = netProceeds * 0.37; // estimated federal + state blended capital gains
      const netTakeHome = netProceeds - estimatedTax;
      return { currentShares, netProceeds, netTakeHome };
    }
  }
  
  const simulation = TotalCompSimulatorCLI.simulateDilutionAndExit(50000, 1.10, [
    { name: 'Series B Expansion', dilution: 0.15 },
    { name: 'Series C Growth', dilution: 0.12 },
    { name: 'Pre-IPO Mezzanine', dilution: 0.08 }
  ], 24.50);
  
  console.log(`Exit Share Value: $24.50 | Net Proceeds: $${Math.floor(simulation.netProceeds).toLocaleString()} | Net Take-Home: $${Math.floor(simulation.netTakeHome).toLocaleString()}`);
});

// --- day46_part4 ---
capture("day46_part4", () => {
  interface ContractClause {
    name: string;
    status: 'STANDARD' | 'PREDATORY' | 'WARNING';
    rationale: string;
  }
  
  function auditStartupOfferClauses(clauses: { clause: string; text: string }[]): ContractClause[] {
    return clauses.map(c => {
      if (c.clause === 'PTEW' && c.text.includes('30 days')) {
        return { name: 'Post-Termination Exercise Window', status: 'PREDATORY', rationale: '30-day PTEW forces golden handcuffs or forfeiture of vested equity upon departure; standard is 7-10 years.' };
      }
      if (c.clause === 'LIQUIDATION' && c.text.includes('3x participating')) {
        return { name: 'Liquidation Preference', status: 'PREDATORY', rationale: '3x participating preferred wipes out common stockholders in mid-tier acquisition exits.' };
      }
      if (c.clause === 'NON_COMPETE' && c.text.includes('18 months worldwide')) {
        return { name: 'Restrictive Covenant', status: 'WARNING', rationale: 'Overbroad non-compete clauses impede subsequent engineering employment mobility.' };
      }
      return { name: c.clause, status: 'STANDARD', rationale: 'Complies with standard Silicon Valley market conventions.' };
    });
  }
  
  const audited = auditStartupOfferClauses([
    { clause: 'PTEW', text: 'Vested options expire within 30 days of employment termination.' },
    { clause: 'LIQUIDATION', text: 'Series A Preferred shares carry 3x participating liquidation preference.' },
    { clause: 'NON_COMPETE', text: 'Employee agrees not to engage in competing tech services for 18 months worldwide.' },
    { clause: 'VESTING', text: 'Standard 4-year monthly vesting with 1-year cliff on initial grant.' }
  ]);
  
  for (const a of audited) {
    console.log(`[${a.status}] ${a.name}: ${a.rationale}`);
  }
});

// --- day46_part5 ---
capture("day46_part5", () => {
  class ApexEquityArchitect {
    static synthesizeOfferEvaluation() {
      return {
        status: 'VERIFIED',
        financialPillars: [
          'Total Compensation Realization Formula: TC = Base + LiquidRSUs + (Options * (1-Dilution) * ProbExit) + Bonus + SignOn',
          'Cap Table Forensics: 409A Fair Market Value vs Preferred Strike Spread & AMT Liability Buffer',
          'Risk-Weighted Discounting: Private equity discounted 35-70% depending on funding maturity stage',
          'Protective Covenants: Demand 7-10 year PTEW and 1x non-participating liquidation preference parity'
        ],
        readinessScore: 98.5
      };
    }
  }
  
  const audit = ApexEquityArchitect.synthesizeOfferEvaluation();
  console.log(`Apex Equity Evaluation Engine Status: ${audit.status} | Readiness: ${audit.readinessScore}%`);
  for (const p of audit.financialPillars) {
    console.log(` * ${p}`);
  }
});

// --- day47_part1 ---
capture("day47_part1", () => {
  interface NegotiationState {
    candidateBATNA: number; // reservation price / alternate offer TC
    companyInitialOffer: number;
    companyBudgetCeiling: number; // top of band
    candidateAspirationTarget: number;
  }
  
  function calculateZOPA(state: NegotiationState): {
    zopaExists: boolean;
    zopaFloor: number;
    zopaCeiling: number;
    recommendedAnchor: number;
  } {
    const zopaFloor = Math.max(state.candidateBATNA, state.companyInitialOffer);
    const zopaCeiling = state.companyBudgetCeiling;
    const zopaExists = zopaFloor <= zopaCeiling;
    const recommendedAnchor = Math.min(state.companyBudgetCeiling * 1.05, state.candidateAspirationTarget);
  
    return { zopaExists, zopaFloor, zopaCeiling, recommendedAnchor };
  }
  
  const state: NegotiationState = {
    candidateBATNA: 310000,
    companyInitialOffer: 295000,
    companyBudgetCeiling: 345000,
    candidateAspirationTarget: 340000
  };
  
  const zopa = calculateZOPA(state);
  console.log(`ZOPA Valid: ${zopa.zopaExists}`);
  console.log(`ZOPA Floor: $${zopa.zopaFloor.toLocaleString()} | Ceiling: $${zopa.zopaCeiling.toLocaleString()}`);
  console.log(`Recommended Strategic Anchor: $${zopa.recommendedAnchor.toLocaleString()}`);
});

// --- day47_part2 ---
capture("day47_part2", () => {
  interface EmailArtifact {
    stage: string;
    recipient: string;
    subject: string;
    keyPhrase: string;
  }
  
  function generateMultiOfferBiddingSequence(): EmailArtifact[] {
    return [
      {
        stage: 'Initial Anchor / Enthusiastic Delay',
        recipient: 'Lead Recruiter @ Primary Choice',
        subject: 'Offer Discussion & Expressed Gratitude — Staff Infrastructure Role',
        keyPhrase: 'I am thrilled by the team and roadmap; to evaluate this alongside existing late-stage processes with full diligence, I request until Friday the 24th.'
      },
      {
        stage: 'Competing Offer Leverage Introduction',
        recipient: 'Lead Recruiter @ Primary Choice',
        subject: 'Update on Evaluation Timeline & Competing Market Data',
        keyPhrase: 'ApexCorp has extended a confirmed offer at $340k TC. Because your mission remains my absolute top priority, if we can close the gap to $335k TC, I am prepared to sign immediately.'
      },
      {
        stage: 'Closing Confirmation',
        recipient: 'Lead Recruiter @ Primary Choice',
        subject: 'Signed Offer Letter & Next Steps — Thrilled to Join',
        keyPhrase: 'Thank you for adjusting the equity and signing components to reach parity. I have countersigned and look forward to day one.'
      }
    ];
  }
  
  const sequence = generateMultiOfferBiddingSequence();
  for (const s of sequence) {
    console.log(`[STAGE: ${s.stage}] To: ${s.recipient}`);
    console.log(`  Subject: ${s.subject}`);
    console.log(`  Anchor: "${s.keyPhrase}"`);
  }
});

// --- day47_part3 ---
capture("day47_part3", () => {
  class CounterOfferGeneratorCLI {
    static generateCounter(currentBase: number, currentEquity: number, currentSignOn: number, targetTC: number) {
      const currentTC = currentBase + currentEquity + currentSignOn;
      const delta = Math.max(0, targetTC - currentTC);
      // Standard negotiation distribution: 40% base, 40% equity, 20% signon
      const proposedBase = currentBase + Math.floor(delta * 0.35);
      const proposedEquity = currentEquity + Math.floor(delta * 0.45);
      const proposedSignOn = currentSignOn + Math.floor(delta * 0.20);
      const proposedTC = proposedBase + proposedEquity + proposedSignOn;
  
      return {
        currentTC,
        targetTC,
        proposedBase,
        proposedEquity,
        proposedSignOn,
        proposedTC,
        rationale: `Reallocates $${delta.toLocaleString()} delta with emphasis on equity alignment and sign-on bridge to protect hiring manager base budget constraints.`
      };
    }
  }
  
  const counter = CounterOfferGeneratorCLI.generateCounter(200000, 90000, 20000, 350000);
  console.log(`Current TC: $${counter.currentTC.toLocaleString()} -> Proposed Counter TC: $${counter.proposedTC.toLocaleString()}`);
  console.log(`Base: $${counter.proposedBase.toLocaleString()} | Equity: $${counter.proposedEquity.toLocaleString()} | Sign-On: $${counter.proposedSignOn.toLocaleString()}`);
  console.log(`Strategy: ${counter.rationale}`);
});

// --- day47_part4 ---
capture("day47_part4", () => {
  interface PhoneTacticsResponse {
    recruiterTactic: string;
    recommendedResponse: string;
    emotionalPoiseRule: string;
  }
  
  function resolveRecruiterHardballTactics(tactic: string): PhoneTacticsResponse {
    switch (tactic) {
      case 'EXPLODING_DEADLINE':
        return {
          recruiterTactic: 'You have 48 hours to sign or the offer is rescinded.',
          recommendedResponse: 'I appreciate the timeline constraints. Signing this offer is a multi-year commitment, and I want to ensure 100% certainty so I hit the ground running. Let us establish next Tuesday so I can complete final due diligence.',
          emotionalPoiseRule: 'Never panic. Exploding deadlines are almost always artificial psychological pressure.'
        };
      case 'WHAT_IS_YOUR_CURRENT_SALARY':
        return {
          recruiterTactic: 'What are you currently making at your current company?',
          recommendedResponse: 'My current compensation reflects historical scope from three years ago. Based on the responsibilities of this Staff role and current market data, I am targeting $330k-$350k total compensation.',
          emotionalPoiseRule: 'Deflect politely to target value; never disclose legacy compensation.'
        };
      default:
        return {
          recruiterTactic: 'This is the absolute top of our band.',
          recommendedResponse: 'Understood on the base salary constraint. Can we explore bridging the difference via a one-time sign-on bonus or additional equity grant?',
          emotionalPoiseRule: 'Pivot flexibly to alternative non-base compensation levers.'
        };
    }
  }
  
  const triage = resolveRecruiterHardballTactics('EXPLODING_DEADLINE');
  console.log(`Recruiter Tactic: "${triage.recruiterTactic}"`);
  console.log(`Candidate Response: "${triage.recommendedResponse}"`);
  console.log(`Poise Guideline: ${triage.emotionalPoiseRule}`);
});

// --- day47_part5 ---
capture("day47_part5", () => {
  class ApexNegotiationEngine {
    static synthesizeNegotiationPlaybook() {
      return {
        status: 'MASTER_LEVEL',
        corePrinciples: [
          'Unconditional Rapport: Position yourself as an excited partner solving a compensation puzzle together',
          'ZOPA Optimization: Identify company budget bands and anchor near the 90th percentile with competing market data',
          'Multi-Lever Tradeoffs: Trade base salary limits for liquid RSUs, signing bonuses, accelerated vesting, or remote tiering',
          'The Definitive Closing Trigger: Always offer a signed agreement guarantee if target parity is met'
        ],
        confidenceIndex: 99.2
      };
    }
  }
  
  const playbook = ApexNegotiationEngine.synthesizeNegotiationPlaybook();
  console.log(`Apex Negotiation Master Playbook: ${playbook.status} (Confidence: ${playbook.confidenceIndex}%)`);
  for (const p of playbook.corePrinciples) {
    console.log(` - ${p}`);
  }
});

// --- day48_part1 ---
capture("day48_part1", () => {
  type CandorQuadrant = 'RadicalCandor' | 'ObnoxiousAggression' | 'RuinousEmpathy' | 'ManipulativeInsincerity';
  
  interface BehaviorProfile {
    engineer: string;
    carePersonally: boolean;
    challengeDirectly: boolean;
    quadrant: CandorQuadrant;
    consequence: string;
  }
  
  function classifyRadicalCandor(care: boolean, challenge: boolean): { quadrant: CandorQuadrant; consequence: string } {
    if (care && challenge) return { quadrant: 'RadicalCandor', consequence: 'High trust, rapid feedback loops, psychological safety, and continuous growth.' };
    if (!care && challenge) return { quadrant: 'ObnoxiousAggression', consequence: 'Defensive posturing, demoralized engineers, high attrition, and toxic politics.' };
    if (care && !challenge) return { quadrant: 'RuinousEmpathy', consequence: 'Unaddressed errors, substandard code escaping to production, sudden shock PIPs.' };
    return { quadrant: 'ManipulativeInsincerity', consequence: 'Passive aggression, backstabbing, political maneuvering, and organizational cynicism.' };
  }
  
  const feedbackScenarios = [
    { name: 'Direct coaching with deep support', care: true, challenge: true },
    { name: 'Sugarcoating chronic missed deadlines', care: true, challenge: false },
    { name: 'Public dressing down in team Slack', care: false, challenge: true }
  ];
  
  for (const s of feedbackScenarios) {
    const res = classifyRadicalCandor(s.care, s.challenge);
    console.log(`Scenario: ${s.name} -> [${res.quadrant}]: ${res.consequence}`);
  }
});

// --- day48_part2 ---
capture("day48_part2", () => {
  interface PerformanceIncident {
    date: string;
    deliverable: string;
    expectedBehavior: string;
    actualOutcome: string;
    impactOnTeam: string;
  }
  
  class PIPDossier {
    private incidents: PerformanceIncident[] = [];
  
    recordIncident(incident: PerformanceIncident) {
      this.incidents.push(incident);
    }
  
    generateAuditSummary() {
      return this.incidents.map((inc, i) => 
        `Incident #${i + 1} (${inc.date}): [Deliverable: ${inc.deliverable}] Expected: ${inc.expectedBehavior} | Observed: ${inc.actualOutcome} | Impact: ${inc.impactOnTeam}`
      );
    }
  }
  
  const dossier = new PIPDossier();
  dossier.recordIncident({
    date: '2026-09-14',
    deliverable: 'Auth0 JWT Migration RFC',
    expectedBehavior: 'Deliver complete spec with security sign-off by Sprint 44 close',
    actualOutcome: 'Zero documentation submitted; missed sprint review without notice',
    impactOnTeam: 'Blocked 3 backend service migrations; delayed Q4 release by 10 days'
  });
  dossier.recordIncident({
    date: '2026-10-02',
    deliverable: 'On-Call Incident Escalation',
    expectedBehavior: 'Acknowledge P1 latency alert within 15-minute SLA',
    actualOutcome: 'Alert unacknowledged for 85 minutes; required secondary page',
    impactOnTeam: 'Customer-facing checkout degraded across 12,000 checkout sessions'
  });
  
  console.log("=== OBJECTIVE PERFORMANCE DOCUMENTATION SUMMARY ===");
  for (const line of dossier.generateAuditSummary()) {
    console.log(line);
  }
});

// --- day48_part3 ---
capture("day48_part3", () => {
  interface DifficultConversationScript {
    openingStatement: string;
    observationPhrase: string;
    listeningPrompt: string;
    actionContract: string;
  }
  
  function generateFeedbackScript(name: string, metric: string, baseline: string, current: string): DifficultConversationScript {
    return {
      openingStatement: `Thank you for meeting with me, ${name}. I care deeply about your success on this team, which is why I want to be completely candid about your recent delivery trends.`,
      observationPhrase: `Over the past two quarters, your ${metric} has shifted from ${baseline} to ${current}, and our last two major milestones were blocked.`,
      listeningPrompt: `I want to understand your perspective: what structural, personal, or technical roadblocks are you facing right now?`,
      actionContract: `Let us co-design a clear 30-day recovery plan with weekly checkpoints. My goal is to give you every resource possible to get back to thriving.`
    };
  }
  
  const script = generateFeedbackScript('Alex', 'PR Throughput & SLA Adherence', '8 PRs/sprint (100% on-time)', '2 PRs/sprint with 4 missed deadlines');
  console.log(`[OPENING] ${script.openingStatement}`);
  console.log(`[OBSERVATION] ${script.observationPhrase}`);
  console.log(`[INQUIRY] ${script.listeningPrompt}`);
  console.log(`[CONTRACT] ${script.actionContract}`);
});

// --- day48_part4 ---
capture("day48_part4", () => {
  interface DeescalationStrategy {
    emotionalResponse: string;
    managerialResponse: string;
    coreRule: string;
  }
  
  function handleEmotionalReactions(reaction: 'TEARS' | 'ANGER_DENIAL' | 'SHUTDOWN'): DeescalationStrategy {
    switch (reaction) {
      case 'TEARS':
        return {
          emotionalResponse: 'Engineer breaks down weeping due to personal stress or feeling inadequate.',
          managerialResponse: 'Offer a moment of quiet pause: "Let us take a 5-minute break. I am here with you, and this conversation is about finding a path forward together."',
          coreRule: 'Normalize emotion without diluting the performance reality. Never retract feedback out of discomfort.'
        };
      case 'ANGER_DENIAL':
        return {
          emotionalResponse: 'Engineer raises voice, accuses manager of unfairness, and claims teammates are sabotaging them.',
          managerialResponse: 'Maintain low voice tone and calm cadence: "I understand this is frustrating to hear. Let us review the objective delivery logs and timeline together so we are grounded in facts."',
          coreRule: 'Refuse to mirror emotional volume; anchor strictly to immutable artifacts and timeline data.'
        };
      case 'SHUTDOWN':
        return {
          emotionalResponse: 'Engineer goes completely silent, offering only monosyllabic responses.',
          managerialResponse: '"I notice you have stepped back into silence. Take the time you need to process this. Let us schedule 20 minutes tomorrow morning to review next steps."',
          coreRule: 'Allow emotional processing latency; do not force premature agreement during shock.'
        };
    }
  }
  
  const triage = handleEmotionalReactions('ANGER_DENIAL');
  console.log(`Reaction Type: ${triage.emotionalResponse}`);
  console.log(`Manager Action: ${triage.managerialResponse}`);
  console.log(`Guideline: ${triage.coreRule}`);
});

// --- day48_part5 ---
capture("day48_part5", () => {
  class ApexDifficultConversationSuite {
    static verifyManagingOutEthics() {
      return {
        status: 'ETHICALLY_SOUND',
        protocols: [
          'No Surprises Principle: A formal PIP or separation must never be the first time an engineer hears of underperformance',
          'Radical Candor Alignment: Pair unrelenting candor on standards with compassionate support and active resource allocation',
          'Artifact-Driven Objectivity: Base evaluations solely on code reviews, SLA metrics, and documented commitments',
          'Dignity Preservation: Ensure graceful, respected transitions that protect the engineer self-worth and team morale'
        ],
        complianceChecklistPassed: true
      };
    }
  }
  
  const audit = ApexDifficultConversationSuite.verifyManagingOutEthics();
  console.log(`Difficult Conversations Protocol: ${audit.status} | Compliance Passed: ${audit.complianceChecklistPassed}`);
  for (const p of audit.protocols) {
    console.log(` - ${p}`);
  }
});

// --- day49_part1 ---
capture("day49_part1", () => {
  interface IncidentTelemetry {
    projectName: string;
    daysToTargetLaunch: number;
    criticalBlockerCount: number;
    testPassRatePct: number;
    burnDownVelocityDeficitPct: number;
  }
  
  function evaluateEscalationUrgency(incident: IncidentTelemetry): {
    urgency: 'IMMEDIATE_ESCALATION' | 'MONITOR_CLOSELY' | 'ON_TRACK';
    rationale: string;
  } {
    if (incident.daysToTargetLaunch <= 14 && (incident.criticalBlockerCount > 0 || incident.testPassRatePct < 90)) {
      return {
        urgency: 'IMMEDIATE_ESCALATION',
        rationale: `Critical threshold breached: ${incident.criticalBlockerCount} blockers with ${incident.daysToTargetLaunch} days remaining. Concealment guarantees catastrophic launch failure.`
      };
    }
    if (incident.burnDownVelocityDeficitPct > 25) {
      return {
        urgency: 'MONITOR_CLOSELY',
        rationale: `Velocity deficit of ${incident.burnDownVelocityDeficitPct}% threatens target completion horizon.`
      };
    }
    return { urgency: 'ON_TRACK', rationale: 'Project metrics remain within nominal operational boundaries.' };
  }
  
  const telemetry: IncidentTelemetry = {
    projectName: 'Payment Gateway v2 PCI-DSS Migration',
    daysToTargetLaunch: 12,
    criticalBlockerCount: 3,
    testPassRatePct: 78.5,
    burnDownVelocityDeficitPct: 38.0
  };
  
  const assessment = evaluateEscalationUrgency(telemetry);
  console.log(`Project: ${telemetry.projectName}`);
  console.log(`Urgency Level: ${assessment.urgency}`);
  console.log(`Diagnosis: ${assessment.rationale}`);
});

// --- day49_part2 ---
capture("day49_part2", () => {
  interface ExecutiveEscalationMemo {
    situation: string;
    rootCause: string;
    impactAssessment: string;
    mitigationOptions: { option: string; tradeOff: string; recommendation: boolean }[];
  }
  
  function draftExecutiveBadNewsMemo(): ExecutiveEscalationMemo {
    return {
      situation: 'Payment Gateway v2 cutover cannot ship on Oct 31 due to asynchronous settlement deadlocks identified during 50,000 TPS load testing.',
      rootCause: 'Underlying distributed transactions violate eventual consistency guarantees under edge-case partition partitions.',
      impactAssessment: 'Proceeding with Oct 31 launch risks $4.2M in orphaned transactions and regulatory non-compliance.',
      mitigationOptions: [
        { option: 'Option A: 3-Week Delay with Full Architectural Patch', tradeOff: 'Delays Q4 financial marketing push by 21 days; guarantees 99.999% settlement reliability.', recommendation: true },
        { option: 'Option B: Phased Rollout to 5% Beta Merchants Only', tradeOff: 'Limits financial exposure to $50k maximum, but delays general merchant migration until Q1.', recommendation: false },
        { option: 'Option C: Abort Cutover and Revert to Legacy Monolith', tradeOff: 'Zero merchant disruption today, but maintains $120k/month legacy infrastructure cost.', recommendation: false }
      ]
    };
  }
  
  const memo = draftExecutiveBadNewsMemo();
  console.log("=== EXECUTIVE BAD NEWS ESCALATION MEMO ===");
  console.log(`SITUATION: ${memo.situation}`);
  console.log(`ROOT CAUSE: ${memo.rootCause}`);
  console.log(`BUSINESS IMPACT: ${memo.impactAssessment}`);
  console.log("MITIGATION PATHWAYS:");
  for (const opt of memo.mitigationOptions) {
    console.log(`  [${opt.recommendation ? 'RECOMMENDED' : 'ALTERNATIVE'}] ${opt.option} -> Trade-off: ${opt.tradeOff}`);
  }
});

// --- day49_part3 ---
capture("day49_part3", () => {
  class ProjectHealthRiskSentinel {
    static computeRiskIndex(jiraSlippageDays: number, stagingLatencyP99: number, openP0Bugs: number): {
      riskScore: number; // 0 to 100
      alertLevel: 'GREEN' | 'YELLOW' | 'RED';
      executiveTriggerMessage: string;
    } {
      let score = (jiraSlippageDays * 4) + (openP0Bugs * 25) + (stagingLatencyP99 > 300 ? 25 : 0);
      score = Math.min(100, score);
      const alertLevel = score >= 70 ? 'RED' : score >= 40 ? 'YELLOW' : 'GREEN';
      const executiveTriggerMessage = alertLevel === 'RED'
        ? `CRITICAL ALERT: Composite Risk Score ${score}/100. P0 Bugs: ${openP0Bugs}, Slippage: ${jiraSlippageDays}d. Trigger immediate executive escalation brief.`
        : `Operational Status: ${alertLevel} (Score: ${score}/100). Maintain standard sprint cadence.`;
  
      return { riskScore: score, alertLevel, executiveTriggerMessage };
    }
  }
  
  const sentinelReport = ProjectHealthRiskSentinel.computeRiskIndex(8, 420, 2);
  console.log(`Risk Score: ${sentinelReport.riskScore}/100 | Alert Level: ${sentinelReport.alertLevel}`);
  console.log(`Sentinel Output: ${sentinelReport.executiveTriggerMessage}`);
});

// --- day49_part4 ---
capture("day49_part4", () => {
  interface ExecutivePushbackTactic {
    executiveObjection: string;
    leadResponse: string;
    strategicPrinciple: string;
  }
  
  function resolveHostileExecutivePushback(objection: string): ExecutivePushbackTactic {
    if (objection.includes('Heads will roll')) {
      return {
        executiveObjection: 'We committed this date to Wall Street! If we miss this date, people are getting fired!',
        leadResponse: 'I understand the profound gravity of our investor commitments. Shipping with known transaction corruption will trigger SEC audit penalties and irreversible brand loss. Our 3-week remediation plan protects customer revenue and ensures sustainable compliance.',
        strategicPrinciple: 'Acknowledge emotional and business stakes without flinching; re-anchor to risk protection.'
      };
    }
    return {
      executiveObjection: 'Why are you telling me this only now instead of three weeks ago?',
      leadResponse: 'Three weeks ago, latency degradation appeared within standard tuning thresholds. When synthetic stress-testing isolated root deadlocks yesterday afternoon, we immediately convened this briefing. We took 14 hours to formulate three concrete solutions before coming to you.',
      strategicPrinciple: 'Demonstrate that bad news was communicated at the earliest responsible moment with solutions in hand.'
    };
  }
  
  const pushback = resolveHostileExecutivePushback('Heads will roll');
  console.log(`Executive: "${pushback.executiveObjection}"`);
  console.log(`Staff Lead: "${pushback.leadResponse}"`);
  console.log(`Principle: ${pushback.strategicPrinciple}`);
});

// --- day49_part5 ---
capture("day49_part5", () => {
  class ApexExecutiveBadNewsProtocol {
    static generateStandards() {
      return {
        status: 'GOVERNANCE_CERTIFIED',
        coreTenets: [
          'Bad News Ages Like Milk: Escalate within 24 hours of root cause identification; never delay hoping for miracles',
          'Always Bring the Triple Option: Never present an unmitigated disaster; always supply Recommended, Contingency, and Abort pathways',
          'Own the Accountability: Never blame individuals or third-party vendors in executive escalation; focus on systemic repair',
          'Preserve Executive Trust: Leaders forgive delayed launches with solid engineering rationale; they never forgive being blindsided'
        ],
        auditPassed: true
      };
    }
  }
  
  const audit = ApexExecutiveBadNewsProtocol.generateStandards();
  console.log(`Bad News Delivery Governance: ${audit.status} | Audit Passed: ${audit.auditPassed}`);
  for (const t of audit.coreTenets) {
    console.log(` * ${t}`);
  }
});

// --- day50_part1 ---
capture("day50_part1", () => {
  interface PlayerPayoff {
    candidateAction: 'ACCEPT_IMMEDIATE' | 'COUNTER_AGGRESSIVE' | 'VALUE_ANCHOR_WITH_BATNA';
    recruiterAction: 'HOLD_FIRM' | 'MATCH_TARGET' | 'SPLIT_DIFFERENCE';
    candidatePayoff: number; // in $1,000s net value
    recruiterPayoff: number; // in satisfaction index 0-100
  }
  
  function computeNegotiationPayoff(cAction: string, rAction: string): PlayerPayoff {
    if (cAction === 'VALUE_ANCHOR_WITH_BATNA' && rAction === 'SPLIT_DIFFERENCE') {
      return {
        candidateAction: 'VALUE_ANCHOR_WITH_BATNA',
        recruiterAction: 'SPLIT_DIFFERENCE',
        candidatePayoff: 335, // $335k TC
        recruiterPayoff: 90   // High closing probability, budget preserved
      };
    }
    if (cAction === 'COUNTER_AGGRESSIVE' && rAction === 'HOLD_FIRM') {
      return {
        candidateAction: 'COUNTER_AGGRESSIVE',
        recruiterAction: 'HOLD_FIRM',
        candidatePayoff: 295,
        recruiterPayoff: 40
      };
    }
    return {
      candidateAction: 'ACCEPT_IMMEDIATE',
      recruiterAction: 'HOLD_FIRM',
      candidatePayoff: 295,
      recruiterPayoff: 85
    };
  }
  
  const payoff = computeNegotiationPayoff('VALUE_ANCHOR_WITH_BATNA', 'SPLIT_DIFFERENCE');
  console.log(`Game Theory Strategy Equilibrium: [${payoff.candidateAction}] vs [${payoff.recruiterAction}]`);
  console.log(`Candidate Realized Payoff: $${payoff.candidatePayoff}k TC | Recruiter Satisfaction Index: ${payoff.recruiterPayoff}/100`);
});

// --- day50_part2 ---
capture("day50_part2", () => {
  interface ApexNegotiationDossier {
    candidateName: string;
    targetRole: string;
    initialOfferTC: number;
    competingOffers: { company: string; tc: number }[];
    targetNegotiatedTC: number;
    executiveCrisisPlan: { crisis: string; immediateRemediation: string };
  }
  
  function compileApexDossier(): ApexNegotiationDossier {
    return {
      candidateName: 'Elena Rostova',
      targetRole: 'Principal Staff Infrastructure Architect',
      initialOfferTC: 320000,
      competingOffers: [
        { company: 'ApexHyperscale', tc: 375000 },
        { company: 'NovaCloud Systems', tc: 360000 }
      ],
      targetNegotiatedTC: 370000,
      executiveCrisisPlan: {
        crisis: 'Core Sharding Tier 200ms Tail Latency Spike 3 Weeks Pre-Black Friday',
        immediateRemediation: 'Deploy partition isolation layer + activate read-replica caching fallback to preserve checkout SLA'
      }
    };
  }
  
  const dossier = compileApexDossier();
  console.log(`=== APEX NEGOTIATION MASTER DOSSIER ===`);
  console.log(`Candidate: ${dossier.candidateName} | Target: ${dossier.targetRole}`);
  console.log(`Initial Offer: $${dossier.initialOfferTC.toLocaleString()} -> Target TC: $${dossier.targetNegotiatedTC.toLocaleString()}`);
  console.log(`Competing Benchmarks: ${dossier.competingOffers.map(c => `${c.company} ($${c.tc.toLocaleString()})`).join(', ')}`);
  console.log(`Executive Crisis Protocol: ${dossier.executiveCrisisPlan.crisis} -> ${dossier.executiveCrisisPlan.immediateRemediation}`);
});

// --- day50_part3 ---
capture("day50_part3", () => {
  class ApexNegotiationSimulatorAI {
    static evaluateCandidatePitch(tactic: string, candidateStatement: string): {
      score: number; // 0-100
      verdict: 'OFFER_INCREASED' | 'DEADLOCK' | 'RESCINDED';
      feedback: string;
    } {
      if (candidateStatement.toLowerCase().includes('match or i walk')) {
        return { score: 25, verdict: 'RESCINDED', feedback: 'Combative ultimatums trigger organizational risk aversion and offer rescission.' };
      }
      if (candidateStatement.toLowerCase().includes('top choice') && candidateStatement.toLowerCase().includes('competing')) {
        return { score: 96, verdict: 'OFFER_INCREASED', feedback: 'Masterful leverage: validates cultural fit while using objective market data to unlock top-of-band budget.' };
      }
      return { score: 65, verdict: 'DEADLOCK', feedback: 'Generic request without market anchor or signing commitment leaves recruiter unable to justify budget exception.' };
    }
  }
  
  const testPitch = ApexNegotiationSimulatorAI.evaluateCandidatePitch(
    'COMPETING_OFFER_LEVERAGE',
    'NovaCloud is my absolute top choice. ApexHyperscale extended a confirmed $375k package; if we can reach $370k total compensation, I will decline all pending interviews and sign today.'
  );
  
  console.log(`Simulation Pitch Score: ${testPitch.score}/100 | Verdict: ${testPitch.verdict}`);
  console.log(`Recruiter AI Feedback: ${testPitch.feedback}`);
});

// --- day50_part4 ---
capture("day50_part4", () => {
  interface GauntletStage {
    phase: string;
    adversary: string;
    challenge: string;
    candidateCounterMove: string;
    result: 'PASSED' | 'FAILED';
  }
  
  function runApexGauntletSimulation(): GauntletStage[] {
    return [
      {
        phase: 'Phase 1: Recruiter Budget Lock',
        adversary: 'Corporate Head of Talent Acquisition',
        challenge: 'Recruiter states $320k is the absolute hard ceiling for Level 6 and demands verbal acceptance.',
        candidateCounterMove: 'Acknowledge base salary band constraints; pivot to $35k signing bonus bridge + $25k equity top-up.',
        result: 'PASSED'
      },
      {
        phase: 'Phase 2: Board Crisis Escalation',
        adversary: 'Chief Technology Officer & VP Engineering',
        challenge: 'CTO furiously challenges a 3-week delay on Black Friday readiness.',
        candidateCounterMove: 'Deliver 3-part mitigation memo: isolate checkout path, drop non-critical analytics, guarantee zero financial outage.',
        result: 'PASSED'
      }
    ];
  }
  
  const gauntlet = runApexGauntletSimulation();
  console.log("=== APEX GAUNTLET SIMULATION EXECUTION ===");
  for (const g of gauntlet) {
    console.log(`[${g.result}] ${g.phase} vs ${g.adversary}`);
    console.log(`  Adversary Challenge: "${g.challenge}"`);
    console.log(`  Candidate Defense: "${g.candidateCounterMove}"`);
  }
});

// --- day50_part5 ---
capture("day50_part5", () => {
  class ApexNegotiationCertificationSuite {
    static grantStaffCertification() {
      return {
        certificationTitle: 'ApexNegotiation Master Technologist & Executive Strategist (L7)',
        candidate: 'Elena Rostova',
        month2CompletionRate: '50 / 60 Days (83.3%)',
        unlockedCapabilities: [
          'Advanced Tech Equity Cap Table & Dilution Modeling (ISOs, RSUs, AMT, Waterfalls)',
          'Strategic High-Leverage Compensation Negotiation with Competing Multi-Offer Anchoring',
          'Empathetic High-Performance Leadership & Dignified Performance Coaching',
          'High-Reliability Executive Crisis Communication & Bad News De-escalation',
          'Boardroom Game-Theoretic Negotiation Mastery & Conflict De-escalation'
        ],
        boardEndorsement: 'UNANIMOUS_PASS'
      };
    }
  }
  
  const cert = ApexNegotiationCertificationSuite.grantStaffCertification();
  console.log(`Certification: ${cert.certificationTitle}`);
  console.log(`Candidate: ${cert.candidate} | Month 2 Cadence: ${cert.month2CompletionRate}`);
  console.log(`Board Endorsement: ${cert.boardEndorsement}`);
  for (const cap of cert.unlockedCapabilities) {
    console.log(` + ${cap}`);
  }
});

fs.writeFileSync("scripts/soft_skills_days46_50_outputs.json", JSON.stringify(outputs, null, 2));
console.log("Successfully ran all 25 snippets and wrote scripts/soft_skills_days46_50_outputs.json");