// src/app/onboarding/types.ts
// Shared types, constants, and cognitive scoring formulas for Onboarding module

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export type ScreenType =
  | 'CHOOSE_GUIDE'
  | 'INTENT_SELECTION'
  | 'SLIDER'
  | 'EXPRESS_FORM'
  | 'DEEP_CHAT'
  | 'IDENTITY_QUESTIONS'
  | 'WORKPLACE_SIMULATION'
  | 'SPEECH_ASSESSMENT'
  | 'BLUEPRINT_REVEAL';

export function parseExperience(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('years') || t.includes('senior') || t.includes('lead')) {
    return 'experienced';
  }
  if (t.includes('intern') || t.includes('months')) {
    return 'intern';
  }
  if (
    t.includes('fresher') ||
    t.includes('student') ||
    t.includes('college') ||
    t.includes('no experience') ||
    t.includes('none') ||
    t.includes('arts') ||
    t.includes('science') ||
    t.includes('engineering') ||
    t.includes('undergrad')
  ) {
    return 'fresher';
  }
  return 'fresher';
}

export interface IdentityQuestion {
  id: string;
  category: string;
  text: string;
  left: string;
  right: string;
}

export const IDENTITY_QS: IdentityQuestion[] = [
  {
    id: 'logic_vs_empathy',
    category: 'Creation & Problem-Solving Focus',
    text: 'When creating or building something new, what excites you more?',
    left: '🎨 Understanding how people feel & use it (Social IQ)',
    right: '🧠 Solving the puzzle & how it works inside (Pattern Hunter)'
  },
  {
    id: 'pace_vs_depth',
    category: 'Learning & Exploration Style',
    text: 'When exploring a new subject or tool, what is your natural style?',
    left: '🚀 Jump straight in & learn by experimenting (Explorer)',
    right: '🔬 Understand the core concepts step-by-step (Pattern Hunter)'
  },
  {
    id: 'stability_vs_speed',
    category: 'Execution & Quality Instinct',
    text: 'When working on an important project with a deadline, what is your instinct?',
    left: '🛡️ Double-check every detail for perfection (Stabilizer)',
    right: '⚡ Build a working prototype fast & adapt live (Explorer)'
  },
  {
    id: 'collaboration_vs_deepfocus',
    category: 'Ideal Working Environment',
    text: 'In what environment do you produce your most energized work?',
    left: '🤝 Brainstorming & collaborating with a team (Social IQ)',
    right: '🎯 Quiet, uninterrupted solo deep focus (Pattern Hunter)'
  }
];

export function getIdentityQuestions(studentType: string = ''): IdentityQuestion[] {
  const isCommerce = studentType.includes('Commerce') || studentType.includes('B.Com');
  const isManagement = studentType.includes('Management') || studentType.includes('BBA');

  if (isCommerce) {
    return [
      {
        id: 'logic_vs_empathy',
        category: 'Decision-Making Focus',
        text: 'When planning financial or business decisions, what drives your focus?',
        left: '🎨 Understanding client needs & market sentiment (Social IQ)',
        right: '📊 Crunching numbers & balancing ledger logic (Pattern Hunter)'
      },
      {
        id: 'pace_vs_depth',
        category: 'Growth & Strategy Pace',
        text: 'When exploring new financial opportunities, what is your preference?',
        left: '🚀 Testing innovative growth opportunities fast (Explorer)',
        right: '🔬 Analyzing deep valuation & risk factors first (Pattern Hunter)'
      },
      {
        id: 'stability_vs_speed',
        category: 'Risk Management Instinct',
        text: 'When managing budgets under tight timelines, what matters most to you?',
        left: '🛡️ 100% compliance, zero errors & safe structure (Stabilizer)',
        right: '⚡ Quick capital deployment to capture opportunities (Explorer)'
      },
      {
        id: 'collaboration_vs_deepfocus',
        category: 'Teamwork & Strategy Style',
        text: 'How do you perform best when solving major financial challenges?',
        left: '🤝 Collaborative discussions with stakeholders (Social IQ)',
        right: '🎯 Focused solo financial analysis & modeling (Pattern Hunter)'
      }
    ];
  }

  if (isManagement) {
    return [
      {
        id: 'logic_vs_empathy',
        category: 'Product & Leadership Focus',
        text: 'When designing a product or service, where do you begin?',
        left: '🎨 Understanding user emotions & user stories (Social IQ)',
        right: '📈 Analyzing performance data & success metrics (Pattern Hunter)'
      },
      {
        id: 'pace_vs_depth',
        category: 'Innovation Pace vs Systems Depth',
        text: 'When launching new initiatives, how do you like to execute?',
        left: '🚀 Quick market launches & live feedback loops (Explorer)',
        right: '🔬 Deep operational structure & unit economics (Pattern Hunter)'
      },
      {
        id: 'stability_vs_speed',
        category: 'Execution Instinct',
        text: 'When project deadlines are tight, what is your priority?',
        left: '🛡️ Ensuring strict quality control & zero flaws (Stabilizer)',
        right: '⚡ Shipping a fast working MVP and refining later (Explorer)'
      },
      {
        id: 'collaboration_vs_deepfocus',
        category: 'Collaboration Style',
        text: 'Where do you make your biggest impact?',
        left: '🤝 Uniting and motivating a cross-functional team (Social IQ)',
        right: '🎯 Deep strategic planning and problem decomposition (Pattern Hunter)'
      }
    ];
  }

  return IDENTITY_QS;
}

export interface WorkplaceScenarioOption {
  text: string;
  trait: string;
  scores: Record<string, number>;
}

export interface WorkplaceScenario {
  id: string;
  title: string;
  text: string;
  options: WorkplaceScenarioOption[];
}

export const WORKPLACE_SCENARIOS: WorkplaceScenario[] = [
  {
    id: 'bug_launch',
    title: 'Sudden Glitch Right Before Project Launch',
    text: 'An unexpected error is discovered right before releasing your project to thousands of users. What is your immediate reaction?',
    options: [
      { text: '🛑 Pause & Diagnose: Postpone the release, carefully trace the issue to fix the root cause, and add automated tests.', trait: 'Stabilizer', scores: { Stabilizer: 40, PatternHunter: 20 } },
      { text: '🚀 Quick Workaround: Turn off the broken part, launch the working core now, and push an update shortly after.', trait: 'Explorer', scores: { Explorer: 35, Stabilizer: 20 } },
      { text: '🧩 Deep Puzzle Solve: Zoom into the exact line where the logic fails, patch it with laser precision, and test in minutes.', trait: 'PatternHunter', scores: { PatternHunter: 45, Explorer: 15 } },
      { text: '📢 Team Alignment: Call a quick team check-in, explain the situation calmly, and coordinate next steps together.', trait: 'SocialIQ', scores: { SocialIQ: 45, Stabilizer: 15 } }
    ]
  },
  {
    id: 'stack_selection',
    title: 'Choosing the Tools for a New Project',
    text: 'Your team is starting an exciting new project from scratch. How do you decide which tools and technologies to use?',
    options: [
      { text: '📊 Test & Compare Data: Run hands-on tests and compare performance benchmarks before making a smart, data-driven choice.', trait: 'PatternHunter', scores: { PatternHunter: 40, Stabilizer: 20 } },
      { text: '🛡️ Proven & Reliable: Pick the industry-standard, battle-tested tools known for long-term stability and reliability.', trait: 'Stabilizer', scores: { Stabilizer: 45, PatternHunter: 15 } },
      { text: '✨ New & Cutting-Edge: Pick the newest, most innovative tools to build with maximum speed and modern developer experience.', trait: 'Explorer', scores: { Explorer: 45, SocialIQ: 15 } },
      { text: '🤝 Team Consensus: Discuss with the team to see what everyone feels most confident and productive using.', trait: 'SocialIQ', scores: { SocialIQ: 40, Explorer: 20 } }
    ]
  },
  {
    id: 'ambiguous_reqs',
    title: 'Unclear Project Requirements',
    text: 'You are given a project with very vague, open-ended instructions that need to be finished soon. What is your strategy?',
    options: [
      { text: '💬 Talk to Users / Mentor: Ask clarifying questions to the users or mentor to understand what they truly need.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '📐 Map Clear Logic: Break down the vague goal into step-by-step logical diagrams and structured rules.', trait: 'PatternHunter', scores: { PatternHunter: 40, Stabilizer: 20 } },
      { text: '🎨 Build a Quick Prototype: Create a quick working prototype in a few hours to show and get instant visual feedback.', trait: 'Explorer', scores: { Explorer: 40, SocialIQ: 20 } },
      { text: '📋 Step-by-Step Checklist: Write down every possible edge case and create a rigorous checklist before starting.', trait: 'Stabilizer', scores: { Stabilizer: 40, PatternHunter: 20 } }
    ]
  },
  {
    id: 'code_review_conflict',
    title: 'Handling Differing Opinions on Your Work',
    text: 'A teammate gives critical feedback suggesting a completely different way to do what you just built. How do you handle it?',
    options: [
      { text: '💡 Collaborative Discussion: Have a friendly chat to understand their perspective and combine the best of both ideas.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '🔬 Objective Comparison: Compare the pros, cons, speed, and efficiency of both approaches side-by-side.', trait: 'PatternHunter', scores: { PatternHunter: 45, Stabilizer: 15 } },
      { text: '🛡️ Follow Best Standards: Adopt their suggestions if it makes the overall project cleaner, safer, and easier to maintain.', trait: 'Stabilizer', scores: { Stabilizer: 40, SocialIQ: 15 } },
      { text: '🚀 Test Both Fast: Spend 20 minutes building a quick test of their idea to see which one actually works better.', trait: 'Explorer', scores: { Explorer: 40, PatternHunter: 20 } }
    ]
  }
];

export const WORKPLACE_SCENARIOS_BUSINESS: WorkplaceScenario[] = [
  {
    id: 'budget_crisis',
    title: 'Critical Q4 Budget & Revenue Variance 10 Days Before Audit',
    text: 'Your unit discovers a 15% budget overrun and unallocated vendor costs right before fiscal audit. How do you respond?',
    options: [
      { text: '🛡️ Audit & Reallocate: Freeze non-essential expenditure, perform itemized ledger audit, and reallocate reserves.', trait: 'Stabilizer', scores: { Stabilizer: 45, PatternHunter: 20 } },
      { text: '🚀 Growth Push: Pivot marketing to high-margin campaigns immediately to cover the revenue gap with rapid growth.', trait: 'Explorer', scores: { Explorer: 40, SocialIQ: 15 } },
      { text: '📊 Financial Model: Build a multi-scenario sensitivity matrix to isolate the root variance driver and optimize margin.', trait: 'PatternHunter', scores: { PatternHunter: 45, Stabilizer: 15 } },
      { text: '🤝 Executive Alignment: Call an emergency leadership sync to present transparent risk options and align board strategy.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } }
    ]
  },
  {
    id: 'vendor_erp_selection',
    title: 'Selecting Enterprise ERP & Financial Systems Vendor',
    text: 'Your organization is evaluating software vendors for core enterprise ERP/Accounting operations. How do you decide?',
    options: [
      { text: '🔬 Analytical Benchmark: Run quantitative ROI & compliance benchmarks across 3 top vendors before deciding.', trait: 'PatternHunter', scores: { PatternHunter: 45, Stabilizer: 15 } },
      { text: '🛡️ Proven Industry Standard: Select the established tier-1 vendor with proven long-term compliance and SLA track record.', trait: 'Stabilizer', scores: { Stabilizer: 45, PatternHunter: 15 } },
      { text: '✨ Modern SaaS Solution: Choose an innovative cloud-first SaaS tool to unlock rapid deployment and modern UI/UX.', trait: 'Explorer', scores: { Explorer: 40, SocialIQ: 20 } },
      { text: '🤝 Department Workshops: Conduct cross-department interviews to ensure user adoption, training ease, and team buy-in.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } }
    ]
  },
  {
    id: 'ambiguous_market_brief',
    title: 'Handling Ambiguous Product & Market Strategy Brief',
    text: 'The leadership team asks for a market expansion strategy with incomplete customer demographic data. What is your approach?',
    options: [
      { text: '💬 Stakeholder Interviews: Interview target customers and sales reps directly to build accurate buyer personas.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '📐 Data Decomposition: Deconstruct market reports into structured SWOT, PESTLE, and financial unit-economic models.', trait: 'PatternHunter', scores: { PatternHunter: 40, Stabilizer: 20 } },
      { text: '🎨 Rapid Pilot Campaign: Launch a 3-day micro-test ad campaign to gather empirical user conversion signals live.', trait: 'Explorer', scores: { Explorer: 45, SocialIQ: 15 } },
      { text: '📋 Risk & Governance Matrix: Document regulatory constraints, capital reserve requirements, and downside mitigations first.', trait: 'Stabilizer', scores: { Stabilizer: 40, PatternHunter: 20 } }
    ]
  },
  {
    id: 'resource_conflict',
    title: 'Inter-Departmental Resource & Priority Conflict',
    text: 'Marketing and Product Finance clash over Q3 budget allocation for a new product line. How do you resolve it?',
    options: [
      { text: '💡 Joint Strategy Sync: Facilitate a structured negotiation huddle to align both teams on shared OKRs.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '📊 Unit Economics Model: Present a clear LTV/CAC and payback period analysis to let numbers guide the decision.', trait: 'PatternHunter', scores: { PatternHunter: 45, Stabilizer: 15 } },
      { text: '🛡️ Balanced Reserve Allocation: Split funding 50/50 with strict milestone checkpoints to minimize downside risk.', trait: 'Stabilizer', scores: { Stabilizer: 40, SocialIQ: 15 } },
      { text: '🚀 Growth Experiment Sprint: Allocate a 2-week agile test budget to whichever initiative proves fastest traction.', trait: 'Explorer', scores: { Explorer: 40, PatternHunter: 20 } }
    ]
  }
];

export interface QT2MindsetBreakdown {
  patternHunter: number;
  stabilizer: number;
  socialIQ: number;
  explorer: number;
  dominantTraits: string[];
  blendTitle: string;
  blendDescription: string;
  selfAwarenessScore: number;
  selfAwarenessLabel: string;
}

export function calculateQT2MindsetBreakdown(
  identityScores: Record<string, number>,
  simulationScores: Record<string, number>,
  voiceArchetype?: string | null
): QT2MindsetBreakdown {
  let bPH = simulationScores['PatternHunter'] || 0;
  let bST = simulationScores['Stabilizer'] || 0;
  let bSQ = simulationScores['SocialIQ'] || 0;
  let bEX = simulationScores['Explorer'] || 0;

  const bTotal = Math.max(1, bPH + bST + bSQ + bEX);
  const bNormPH = (bPH / bTotal) * 100;
  const bNormST = (bST / bTotal) * 100;
  const bNormSQ = (bSQ / bTotal) * 100;
  const bNormEX = (bEX / bTotal) * 100;

  let sPH = 0, sST = 0, sSQ = 0, sEX = 0;
  const q1 = identityScores['logic_vs_empathy'] ?? 50;
  sPH += q1; sSQ += (100 - q1);

  const q2 = identityScores['pace_vs_depth'] ?? 50;
  sPH += q2; sEX += (100 - q2);

  const q3 = identityScores['stability_vs_speed'] ?? 50;
  sST += (100 - q3); sEX += q3;

  const q4 = identityScores['collaboration_vs_deepfocus'] ?? 50;
  sPH += q4; sSQ += (100 - q4);

  const sTotal = Math.max(1, sPH + sST + sSQ + sEX);
  const sNormPH = (sPH / sTotal) * 100;
  const sNormST = (sST / sTotal) * 100;
  const sNormSQ = (sSQ / sTotal) * 100;
  const sNormEX = (sEX / sTotal) * 100;

  const diffPH = Math.abs(bNormPH - sNormPH);
  const diffST = Math.abs(bNormST - sNormST);
  const diffSQ = Math.abs(bNormSQ - sNormSQ);
  const diffEX = Math.abs(bNormEX - sNormEX);
  const avgDivergence = (diffPH + diffST + diffSQ + diffEX) / 4;
  const selfAwarenessScore = Math.max(55, Math.min(99, Math.round(100 - avgDivergence * 0.8)));

  let selfAwarenessLabel = 'High Cognitive Self-Awareness (Realistic Self-Perception)';
  if (selfAwarenessScore < 75) {
    selfAwarenessLabel = 'Recalibrated Alignment (Aspiration vs Action Divergence Corrected)';
  }

  let ph = bNormPH * 0.7 + sNormPH * 0.3;
  let st = bNormST * 0.7 + sNormST * 0.3;
  let sq = bNormSQ * 0.7 + sNormSQ * 0.3;
  let ex = bNormEX * 0.7 + sNormEX * 0.3;

  if (voiceArchetype === 'Reflective Analyst') {
    ph += 6; st += 6;
  } else if (voiceArchetype === 'Expressive Communicator') {
    sq += 8; ex += 4;
  } else if (voiceArchetype === 'Direct Builder') {
    ex += 6; ph += 6;
  }

  ph = Math.max(12, ph);
  st = Math.max(12, st);
  sq = Math.max(12, sq);
  ex = Math.max(12, ex);

  const total = ph + st + sq + ex;
  let phPct = Math.round((ph / total) * 100);
  let stPct = Math.round((st / total) * 100);
  let sqPct = Math.round((sq / total) * 100);
  let exPct = Math.round((ex / total) * 100);

  const diff = 100 - (phPct + stPct + sqPct + exPct);
  phPct += diff;

  const traitList = [
    { name: 'Pattern Hunter', icon: '🧩', pct: phPct },
    { name: 'Stabilizer', icon: '🛡️', pct: stPct },
    { name: 'Social IQ', icon: '🤝', pct: sqPct },
    { name: 'Explorer', icon: '🚀', pct: exPct },
  ].sort((a, b) => b.pct - a.pct);

  const top1 = traitList[0];
  const top2 = traitList[1];
  const top3 = traitList[2];

  let blendTitle = '';
  let blendDescription = '';

  if (top1.pct >= 52) {
    blendTitle = `Dominant ${top1.name} (${top1.pct}%)`;
    blendDescription = `Your cognitive DNA shows a dominant preference for ${top1.name} methodologies, backed by ${top2.name} (${top2.pct}%) and ${top3.name} (${top3.pct}%). Self-Awareness Index: ${selfAwarenessScore}%.`;
  } else if (top1.pct - top2.pct <= 14) {
    blendTitle = `${top1.name} (${top1.pct}%) & ${top2.name} (${top2.pct}%) Hybrid`;
    blendDescription = `You possess a powerful dual-mindset combining high ${top1.name} analytical strength with resilient ${top2.name} execution. Self-Awareness Index: ${selfAwarenessScore}%.`;
  } else {
    blendTitle = `Tri-Blend: ${top1.name} / ${top2.name} / ${top3.name}`;
    blendDescription = `A dynamic, highly adaptive engineering mindset balancing ${top1.name} (${top1.pct}%), ${top2.name} (${top2.pct}%), and ${top3.name} (${top3.pct}%). Self-Awareness Index: ${selfAwarenessScore}%.`;
  }

  return {
    patternHunter: phPct,
    stabilizer: stPct,
    socialIQ: sqPct,
    explorer: exPct,
    dominantTraits: [top1.name, top2.name],
    blendTitle,
    blendDescription,
    selfAwarenessScore,
    selfAwarenessLabel
  };
}
