import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { recordActiveLiveInterview } from '@/lib/interview/activeSessionRegistry';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import {
  appendLiveTurns,
  clampTurn,
  codeSubmissionTurn,
  loadActiveLiveSession,
  stageMarker,
  transcriptForModel,
  type LiveSession,
} from '@/lib/interview/liveSession';

// Comprehensive Interviewer Persona Roster matching all frontend 3D VRoid Avatars
const INTERVIEWERS_MAP: Record<string, { name: string; role: string; nature: string }> = {
  sneha: {
    name: 'Ms. Sneha',
    role: 'HR & Talent Acquisition Director',
    nature: 'You are an insightful, warm, but incisive HR Director. You focus on leadership, cultural adaptability, situational conflict resolution, and the STAR framework (Situation, Task, Action, Result).'
  },
  priya: {
    name: 'Ms. Sneha', // Priya is platform mentor only; legacy interview calls map to Sneha
    role: 'HR & Talent Acquisition Director',
    nature: 'You are an insightful, warm, but incisive HR Director. You focus on leadership, cultural adaptability, situational conflict resolution, and the STAR framework (Situation, Task, Action, Result).'
  },
  rohan: {
    name: 'Mr. Rohan',
    role: 'Lead Software Architect & Tech Lead',
    nature: 'You are a pragmatic, seasoned software architect. You probe deep into clean code, algorithmic efficiency, time/space complexity, error handling, and modular component design.'
  },
  vikram: {
    name: 'Mr. Vikram',
    role: 'Principal Systems Specialist & Recruiter',
    nature: 'You have a professional, direct, and impatient recruiting style. You demand numeric metrics, architectural resilience, and often ask candidates to justify distributed trade-offs under high time pressure.'
  },
  aisha: {
    name: 'Ms. Aisha',
    role: 'Executive STAR Evaluator & Strategy Lead',
    nature: 'You are a sharp, analytical executive interviewer. You drill into high-stakes business decisions, trade-offs under uncertainty, and quantitative project outcomes.'
  },
  shalini: {
    name: 'Ms. Shalini',
    role: 'The Meticulous Assessor',
    nature: 'You are stoic, silent, and meticulous. You keep your tone formal and give zero verbal verification. You test candidate composure and confidence under quiet observation.'
  },
  aditya: {
    name: 'Mr. Aditya',
    role: 'The Strategy & Domain Lead',
    nature: 'You are a brilliant domain strategist. You focus microscopic attention on domain metrics, unit economics, and operational frameworks, asking candidates to justify every decision.'
  },
  neha: {
    name: 'Ms. Neha',
    role: 'The High-Stress Scenario Driller',
    nature: 'You prepare candidates for high-stress production outages and crisis management: "What if production crashes right now? Walk me through your triage step-by-step."'
  },
  kashyap: {
    name: 'Kashyap Sir',
    role: 'Principal Computer Science Mentor',
    nature: 'You value rigorous mathematical logic, algorithmic correctness, and fundamental first-principles reasoning.'
  },
  karthic: {
    name: 'Karthic Sir',
    role: 'Competitive Systems & Performance Specialist',
    nature: 'You focus on speed, execution precision, high-concurrency optimizations, and benchmark verification.'
  },
  maya: {
    name: 'Ms. Maya',
    role: 'UI/UX & Product Experience Architect',
    nature: 'You focus on user-centric design, state management responsiveness, accessibility standards, and frontend performance.'
  },
  divya: {
    name: 'Ms. Divya',
    role: 'Cloud Infrastructure & SRE Specialist',
    nature: 'You focus on zero-downtime deployments, Kubernetes orchestration, telemetry metrics, and fault-tolerant cloud architecture.'
  },
  rajesh: {
    name: 'Mr. Rajesh',
    role: 'Operations & Supply Chain Director',
    nature: 'You focus on inventory models, unit economics, logistics bottlenecks, and ERP/data modeling.'
  },
  abhijit: {
    name: 'Mr. Abhijit',
    role: 'Quantitative Finance & Economics Specialist',
    nature: 'You focus on EBITDA calculations, balance sheet solvency, financial ratios, and DCF valuation models.'
  }
};


interface FallbackContext {
  stage: string;
  subTopic: string;
  history: Array<{ role: string; content: string }>;
  difficulty: string;
  interviewerName: string;
  stream?: 'tech' | 'non_tech';
}

export interface CandidateTurnAnalysis {
  intent: 'skip' | 'stuck' | 'greeting' | 'intro' | 'vague' | 'substantive';
  subject: string;
  keyTerm: string;
}

export function stripInterviewerSignoff(text: string): string {
  return text
    .replace(/^(?:(?:Ms\.|Mr\.|Dr\.)\s*[A-Za-z]+|Interviewer)\s*:\s*/i, '')
    .replace(/\s*[—~–-]\s*(?:(?:Ms\.|Mr\.|Dr\.)\s*)?[A-Za-z]+(?:\s*\(.*?\))?\s*$/i, '')
    .replace(/\s*—\s*[^.!?]+$/i, '')
    .trim();
}

export function extractCandidateKeyContext(text: string): { phrase: string; keyTerm: string; type: 'tech' | 'action' | 'metric' | 'general' } {
  const analysis = analyzeCandidateTurn(text, 'your work');
  return {
    phrase: analysis.subject,
    keyTerm: analysis.keyTerm,
    type: analysis.intent === 'substantive' ? 'tech' : 'general'
  };
}

export function analyzeCandidateTurn(text: string, subTopic: string): CandidateTurnAnalysis {
  const clean = text.replace(/```[\s\S]*?```/g, '').replace(/[^\w\s.,%'-]/g, ' ').trim();
  const lower = clean.toLowerCase();

  // 1. Check for explicit skip
  if (/^(?:\[Candidate skipped question\]|I would like to skip\b|skip\b|let'?s move on\b|next question\b)/i.test(lower)) {
    return { intent: 'skip', subject: subTopic, keyTerm: subTopic };
  }

  // 2. Check for candidate uncertainty, confusion, or "I don't know"
  if (
    /\b(don'?t know|do not know|no idea|not sure|not certain|never worked with|haven'?t worked|haven'?t done|unclear|stuck|lost|what to do|cannot say|can'?t answer|not familiar|blanking)\b/i.test(lower) ||
    /^(?:i don'?t know|no idea|not sure|dunno|idk|nothing)[.!]?$/i.test(lower)
  ) {
    return { intent: 'stuck', subject: subTopic, keyTerm: subTopic };
  }

  // 3. Check for bare greetings without substance (e.g. "hi", "hello", "hey", "namaste", "hi there", "hi priya", "hello sir")
  if (
    /^(?:hi|hello|hey|greetings|good\s+(?:morning|afternoon|evening)|namaste|hola|yo|sup)(?:\s+(?:there|sir|ma'?am|team|everyone|all|[a-z]+))?[.!]?$/i.test(lower) ||
    (/^(?:hi|hello|hey)\b/i.test(lower) && clean.split(/\s+/).length <= 2)
  ) {
    return { intent: 'greeting', subject: subTopic, keyTerm: subTopic };
  }

  // 3. Metric match: e.g. "40%", "10x", "500ms", "3 team members", "millions of users"
  const metricMatch = clean.match(/(\d+%\s*(?:latency\s*(?:drop|reduction|increase)?|improvement|reduction|increase|drop)?|10x|5x|\d+\s*(?:ms|seconds|minutes|hours|users|req\/s|rps|nodes|servers|instances))/i);
  if (metricMatch) {
    return { intent: 'substantive', subject: metricMatch[1].trim(), keyTerm: metricMatch[1].trim() };
  }

  // 4. Common high-value technical & business keywords (matched with strict word boundaries)
  const techKeywords = [
    'redis', 'kafka', 'postgresql', 'postgres', 'mongodb', 'mysql', 'docker', 'kubernetes',
    'k8s', 'microservices', 'monolith', 'graphql', 'rest api', 'api', 'websocket', 'websockets',
    'caching', 'indexes', 'indexing', 'sharding', 'replication', 'concurrency', 'race condition',
    'deadlock', 'mutex', 'thread pool', 'event loop', 'async/await', 'load balancer', 'nginx',
    'react', 'next.js', 'nextjs', 'typescript', 'python', 'golang', 'java', 'spring boot',
    'ci/cd', 'github actions', 'aws', 's3', 'lambda', 'ec2', 'cloud', 'security', 'oauth', 'jwt',
    'rate limit', 'circuit breaker', 'idempotency', 'acid', 'eventual consistency', 'cap theorem',
    'bloom filter', 'trie', 'binary search', 'dynamic programming', 'graph', 'tree', 'queue',
    'cash flow', 'ebitda', 'unit economics', 'cac', 'ltv', 'margin', 'inventory', 'supply chain',
    'turnover', 'compliance', 'audit', 'taxation', 'statutory', 'reconciliation', 'ledger'
  ];

  let matchedTech: string | null = null;
  for (const tk of techKeywords) {
    const escaped = tk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:s|es)?(?:[^a-z0-9]|$)`, 'i');
    if (regex.test(lower)) {
      matchedTech = tk;
      break;
    }
  }

  // 5. Broad self-introduction check (greeting or background introduction)
  const isIntroGreeting = /\b(?:hi\b|hello\b|hey\b|greetings\b|my name is\b|i am a\b|i'm a\b|i am full stack\b|i'm full stack\b|as a software\b|fresher\b|recent graduate\b|student\b)/i.test(lower);
  if (isIntroGreeting) {
    return {
      intent: 'intro',
      subject: matchedTech || subTopic,
      keyTerm: matchedTech || subTopic
    };
  }

  if (matchedTech) {
    return { intent: 'substantive', subject: matchedTech, keyTerm: matchedTech };
  }

  // 6. Extract substantive action/problem clauses
  const actionMatch = clean.match(/(?:migrat|refactor|optimiz|debugg|deploy|resolv|implement|architect|scal|build|handl|manag|tackl)\w*\s+(?:the\s+)?[\w\s]{3,24}/i);
  if (actionMatch) {
    const rawPhrase = actionMatch[0].trim().replace(/\s+/g, ' ');
    const parts = rawPhrase.split(/\s+/);
    return { intent: 'substantive', subject: rawPhrase, keyTerm: parts.slice(-2).join(' ') };
  }

  // 7. Meaningful non-filler words for general substantive input
  const words = clean.split(/\s+/).filter(w => !/^(i|we|my|the|a|an|in|on|at|to|for|of|with|and|or|so|but|that|this|it|is|was|are|were|been|have|has|had|do|did|doing|done|does|would|could|should|can|will|just|really|basically|like|you|know|there|here|then|some|all|our|don'?t|dont|not|what|who|when|where|why|how|scenario|approach|hi|hello|hey|yes|no|ok|okay)$/i.test(w));
  if (words.length >= 2) {
    let snippet = words.slice(0, 3).join(' ');
    snippet = snippet.replace(/^(?:focusing on|working with|regarding|around|tackling)\s+/i, '').trim();
    if (snippet.length >= 3) {
      return { intent: 'substantive', subject: snippet, keyTerm: snippet };
    }
  }

  return { intent: 'vague', subject: subTopic, keyTerm: subTopic };
}

export function generateProgressiveFallbackQuestion(ctx: FallbackContext): string {
  const { stage, subTopic, history, interviewerName, stream = 'tech' } = ctx;

  const userTurns = (history || []).filter(m => m.role === 'user');
  const lastUserTurn = userTurns[userTurns.length - 1]?.content || '';
  const turnCount = userTurns.length;

  // First turn: warm welcome & initial background question (only turn that includes self-intro)
  if (turnCount <= 1 && (!lastUserTurn || lastUserTurn.length < 15)) {
    return `Welcome to your interview. I am ${interviewerName}. To get started, could you walk me through your background and your hands-on experience with ${subTopic}?`;
  }

  const analysis = analyzeCandidateTurn(lastUserTurn, subTopic);

  // 1. Candidate is stuck or explicitly says "I don't know" — never praise or fake success!
  if (analysis.intent === 'stuck') {
    if (stage === 'round1_behavioral') {
      const stuckPivots = [
        `That's completely fine—interviews often touch on unfamiliar ground. Let's take a step back: think of a project or task in ${subTopic} where you felt confident. What was the core problem you solved?`,
        `No worries at all, let's look at this from a different angle. When you run into a scenario where you're not sure how to proceed, what is your systematic process for investigating and finding a path forward?`,
        `Understood—let's pivot. In your recent experience with ${subTopic}, what has been the most satisfying technical challenge you successfully resolved?`
      ];
      return stuckPivots[turnCount % stuckPivots.length];
    }

    if (stage === 'round2_coding') {
      const stuckCodingPivots = [
        `That is completely alright—let's break it down into smaller steps. What would be the simplest baseline or brute-force approach you can think of, even if it's not optimal?`,
        `No problem at all. Looking at the requirements for ${subTopic}, what is the very first boundary condition or input validation check you would write?`,
        `Take your time. If you trace a small sample input with 2 or 3 elements by hand, what pattern or intermediate state emerges?`
      ];
      return stuckCodingPivots[turnCount % stuckCodingPivots.length];
    }

    if (stage === 'round3_systems') {
      const stuckSystemsPivots = [
        `No problem at all—system design is fundamentally about exploring trade-offs. If we start with the simplest single-service architecture for ${subTopic}, where would the first bottleneck appear as traffic grows?`,
        `That's completely fine. Which part of the architecture do you feel most comfortable discussing first—the client request ingress, the service logic, or the storage layer?`,
        `Understood. Let's simplify: suppose you have 1,000 active users and one database. What simple caching or indexing strategy would you add first to keep latency low?`
      ];
      return stuckSystemsPivots[turnCount % stuckSystemsPivots.length];
    }

    // round4_star
    const stuckStarPivots = [
      `Understood, let's pivot to a different angle. Can you describe a situation where you had to learn a new tool or technology under a tight deadline to deliver results?`,
      `That's completely fine. Tell me about a scenario where you collaborated closely with a teammate or stakeholder to resolve a challenging roadblock.`,
      `No problem. Looking back across your projects, what is one achievement in ${subTopic} that you are most proud of?`
    ];
    return stuckStarPivots[turnCount % stuckStarPivots.length];
  }

  // 2. Candidate gave a bare greeting without substance (e.g. "hi", "hello")
  if (analysis.intent === 'greeting') {
    if (turnCount <= 1) {
      return `Welcome to your interview. I am ${interviewerName}. To get started, could you walk me through your background and your hands-on experience with ${subTopic}?`;
    }
    if (turnCount === 2) {
      return `Hello! To help us get underway, please share an overview of your background, your education, or any recent projects you've worked on in ${subTopic}.`;
    }
    return `Whenever you're ready, feel free to introduce yourself or describe any practical experience or coursework you've done in ${subTopic} so we can begin.`;
  }

  // 3. Candidate gave a broad introductory greeting or project summary
  if (analysis.intent === 'intro') {
    if (analysis.keyTerm && analysis.keyTerm !== subTopic) {
      return `Thanks for walking me through your background! You mentioned working with ${analysis.keyTerm} in your recent work. Could you dive into one specific project where you leveraged ${analysis.keyTerm}, explaining the core problem and your contribution?`;
    }
    return `Great to have you here! Diving into your hands-on experience with ${subTopic}, could you highlight one specific project you worked on, the core problem it addressed, and your direct contribution?`;
  }

  // 3. Candidate gave an extremely brief or vague answer
  if (analysis.intent === 'vague') {
    return `Understood. Could you expand a bit more on that? Specifically, what was your personal responsibility and the primary technical challenge you navigated for ${subTopic}?`;
  }

  // 4. Candidate explicitly skipped
  if (analysis.intent === 'skip') {
    return `Understood—we'll note the skip and move forward. Let's pivot to another dimension of ${subTopic}: what is an area in this domain where you've spent significant hands-on time?`;
  }

  // 5. Candidate provided substantive response with technical / metric / action details
  const { subject, keyTerm } = analysis;
  const reflectionOpeners = [
    `I see your point regarding ${subject}.`,
    `You made an insightful observation around ${subject}.`,
    `Working with ${subject} is a solid direction for ${subTopic}.`,
    `Regarding your approach with ${subject}:`,
    `That is a very practical consideration around ${subject}.`
  ];
  const opener = reflectionOpeners[turnCount % reflectionOpeners.length];

  // Stage-specific contextual follow-up questions (Natural spoken dialogue — no robotic sign-offs)
  if (stage === 'round1_behavioral') {
    const behavioralFollowUps = [
      `When navigating that, what was the most significant roadblock or cross-functional disagreement you encountered, and how did you resolve it?`,
      `Looking back at that scenario, what is one key ${stream === 'non_tech' ? 'strategic or stakeholder' : 'technical or process'} trade-off you would approach differently today?`,
      `Under tight deadline pressure, how did you balance ${stream === 'non_tech' ? 'analytical rigor against commercial urgency' : 'technical excellence against shipping speed'} while driving that forward?`,
      `What measurable signal or feedback confirmed to you and your team that this decision was a success?`
    ];
    const question = behavioralFollowUps[turnCount % behavioralFollowUps.length];
    return `${opener} ${question}`;
  }

  if (stage === 'round2_coding') {
    const codingFollowUps = stream === 'non_tech'
      ? [
          `Looking closely at your numbers around ${keyTerm}, what sensitivity assumptions or downside scenarios would flip your recommendation?`,
          `How do you validate data integrity and edge-case anomalies before presenting these ${subTopic} calculations to executive leadership?`,
          `If acquisition costs rose 25% or margins compressed unexpectedly, how would your model adapt to protect ROI?`,
          `Which single KPI in this analysis is the strongest leading indicator of execution risk?`
        ]
      : [
          `Given that approach with ${keyTerm}, what is the exact time and space complexity, and where could memory usage spike under large inputs?`,
          `How does your implementation handle critical boundary conditions, such as null/empty inputs, duplicate records, or extreme numerical ranges?`,
          `If multiple concurrent threads or API requests hit this logic simultaneously, what race condition or state corruption risks arise, and how would you safeguard against them?`,
          `How would you structure unit tests to thoroughly verify the correctness and failure modes of that logic before shipping to production?`
        ];
    const question = codingFollowUps[turnCount % codingFollowUps.length];
    return `${opener} ${question}`;
  }

  if (stage === 'round3_systems') {
    const systemsFollowUps = stream === 'non_tech'
      ? [
          `In your workflow around ${keyTerm}, where is the steepest conversion drop-off or operational bottleneck, and what experiment would you run first?`,
          `How do you align incentives across finance, operations, and customer support when scaling that ${subTopic} loop?`,
          `What leading KPI dashboard and escalation thresholds would alert you before churn or margin leakage compounds?`,
          `If budget were cut by 30% tomorrow, which stage of that workflow would you defend and which would you automate?`
        ]
      : [
          `Looking at the role of ${keyTerm} in your architecture, how does the system behave if that specific component experiences a sudden crash or network partition during peak load?`,
          `Where do you foresee the primary throughput or IO bottleneck in that data path, and how would caching or asynchronous queuing alleviate it?`,
          `How do you enforce idempotency and maintain data consistency across distributed boundaries if an operation fails midway?`,
          `What telemetry metrics, error budgets, and health check signals would you establish to monitor that tier in real time?`
        ];
    const question = systemsFollowUps[turnCount % systemsFollowUps.length];
    return `${opener} ${question}`;
  }

  if (stage === 'round4_star') {
    const starFollowUps = [
      `How does your choice around ${keyTerm} directly drive the overall ${stream === 'non_tech' ? 'business KPIs' : 'system SLAs'} and measurable business impact?`,
      `What empirical metrics or benchmarks did you monitor to demonstrate that your solution achieved its intended goal?`,
      `If a ${stream === 'non_tech' ? 'VP or CFO' : 'principal architect or executive'} challenged that trade-off, what quantitative data and counter-arguments would you present?`,
      `Which part of your execution or design would you revisit first if demand grew by a factor of 10x?`
    ];
    const question = starFollowUps[turnCount % starFollowUps.length];
    return `${opener} ${question}`;
  }

  return `${opener} Could you elaborate on the key trade-offs and decisions you made for ${subTopic}?`;
}

export async function POST(req: Request) {
  console.log('[Interview Chat API] Incoming request received at /api/interview/chat');
  
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`llm_${ip}`, { limit: 30, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    // 1. Authenticate Request via Bearer Token
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      console.warn('[Interview Chat API] Auth rejection: Missing or invalid Bearer token');
      return gated.error;
    }

    const body = await req.json();
    const {
      message,
      interviewerId,
      stage,
      reviewDecision = false,
      history = [],
      telemetry,
      difficulty,
      customTopic,
      domainStream,
      domainSubTopic,
      jdContext,
      companyContext
    } = body;

    const selectedInterviewer = INTERVIEWERS_MAP[interviewerId] || INTERVIEWERS_MAP.vikram;

    // Recorded interview: the server's record is the conversation (the browser's history is not
    // used), and the topic is the one the interview was started with.
    const admin = body.liveSessionId ? getSupabaseAdmin() : null;
    let live: LiveSession | null = null;
    if (admin) {
      const found = await loadActiveLiveSession(admin, gated.user.id, body.liveSessionId);
      if (!found.ok) {
        return NextResponse.json(
          { error: `INTERVIEW_RECORD_${found.error}`, message: 'This interview can no longer continue. Please start a new one.' },
          { status: 409 }
        );
      }
      live = found.session;
    }
    const recordTurns = async (turns: Parameters<typeof appendLiveTurns>[2]) => {
      if (!admin || !live) return;
      const saved = await appendLiveTurns(admin, live, turns);
      if (saved) { live = saved; return; }
      // Another request updated the record first: reload once and append again.
      const again = await loadActiveLiveSession(admin, gated.user.id, live.id);
      if (again.ok) live = (await appendLiveTurns(admin, again.session, turns)) ?? again.session;
    };

    const stream = live ? live.domain_stream : (domainStream === 'non_tech' ? 'non_tech' : 'tech');
    const topicSource = live ? live.topic : (customTopic || domainSubTopic || (stream === 'non_tech' ? 'Finance & Strategy' : 'Software Engineering'));
    const subTopic = String(topicSource).trim();

    // Round changes, skipped questions and code submissions happen on the page; the record notes them.
    if (live && (body.event === 'stage' || body.event === 'skip' || body.event === 'code')) {
      if (body.event === 'code') {
        const turn = codeSubmissionTurn(body.code, body.language, body.problemTitle, stage);
        if (!turn) return NextResponse.json({ error: 'CODE_REQUIRED', message: 'No code to record.' }, { status: 400 });
        await recordTurns([turn]);
      } else if (body.event === 'stage') {
        await recordTurns([clampTurn('assistant', stageMarker(String(stage || '')), stage)]);
      } else {
        await recordTurns([
          clampTurn('user', '[Candidate skipped question]', stage),
          clampTurn('assistant', `Moving on to our next question for ${live.topic}.`, stage),
        ]);
      }
      return NextResponse.json({ ok: true, recorded: true });
    }
    const liveUserTurn = live ? clampTurn('user', message, stage) : null;
    const effectiveHistory: Array<{ role: string; content: string }> = live
      ? [...transcriptForModel(live), ...(liveUserTurn ? [{ role: 'user', content: liveUserTurn.content }] : [])]
      : (Array.isArray(history) ? history : []);

        console.log(`[Interview Chat API] Authenticated User: ${gated.user.id} | Interviewer: ${selectedInterviewer.name} (${interviewerId}) | Stage: ${stage} | Topic: ${subTopic}`);
    if (gated.user?.id) {
      recordActiveLiveInterview(gated.user.id, subTopic, stage || 'round1_behavioral');
    }

    // 2. Build Difficulty Context
    let difficultyPrompt = '';
    if (difficulty === 'easy') {
      difficultyPrompt = 'Scale difficulty to EASY. Maintain a supportive, encouraging tone, ask basic conceptual questions, and guide the candidate gently.';
    } else if (difficulty === 'hard') {
      difficultyPrompt = 'Scale difficulty to HARD. Be demanding, ask deep edge cases, query precise performance/financial metrics, and challenge claims aggressively.';
    } else {
      difficultyPrompt = 'Scale difficulty to NORMAL. Act as a typical corporate lead interviewer with standard expectations.';
    }

    // 3. Build Topic Context
    let topicPrompt = `The candidate is being interviewed for [${subTopic}] in the [${stream === 'non_tech' ? 'Non-Tech / Corporate / Business' : 'Tech / Software / Systems'}] stream.`;
    const topicFocus = live ? live.topic : (typeof customTopic === 'string' ? customTopic.trim() : '');
    if (topicFocus) {
      topicPrompt += ` Topic Focus: "${topicFocus}". Align all questions and technical drill-downs strictly to this domain.`;
    }
    if (typeof companyContext === 'string' && companyContext.trim()) {
      topicPrompt += `\n${companyContext.trim().slice(0, 1200)}`;
    }
    if (typeof jdContext === 'string' && jdContext.trim()) {
      topicPrompt += `\n${jdContext.trim().slice(0, 1200)}`;
    }

    // 4. Build Stage-Specific Context
    let stageContext = '';
    if (stage === 'round1_behavioral') {
      const historyLength = effectiveHistory.length;
      if (historyLength <= 1) {
        stageContext = `This is Round 1 (Behavioral & Background). Acknowledge the candidate warmly, introduce yourself briefly as ${selectedInterviewer.name}, and ask them to introduce their background and experience with ${subTopic}. Keep under 3 sentences.`;
      } else {
        stageContext = `This is Round 1 (Behavioral). Listen to the candidate's last answer. If the candidate merely says "hi", "hello", or gives a vague greeting, do NOT praise them or pretend they made a decision; instead, politely re-ask them to introduce themselves and highlight one project or practical experience in ${subTopic}. If they gave a substantive response, acknowledge one specific detail they mentioned, then ask a structured behavioral or background follow-up question related to ${subTopic}. Keep under 3 sentences.`;
      }
    } else if (stage === 'round2_coding') {
      stageContext = reviewDecision
        ? `This is the final code-review decision for Round 2. Assess the candidate's code and their explanation in the conversation. If both meet the bar, briefly acknowledge why and append exactly [[ROUND_VERDICT:PASS]]. If the reasoning or implementation has a substantive gap, briefly explain it and append exactly [[ROUND_VERDICT:RETRY]]. Do not ask another question. Never include the marker in spoken prose.`
        : `This is Round 2 (Technical Assessment & Problem Solving). Review the submitted code when available and ask exactly one focused question about its logic, complexity, edge cases, or trade-offs. If they ask for hints, provide a conceptual clue without giving away code or the complete solution. Keep under 3 sentences.`;
    } else if (stage === 'round3_systems') {
      if (stream === 'non_tech') {
        stageContext = `This is Round 3 (Business Workflow Canvas). Ask about the conversion funnel, monetization loops, and bottleneck mitigations in their strategy for ${subTopic}. Keep under 3 sentences.`;
      } else {
        stageContext = `This is Round 3 (System Architecture Canvas). Ask the candidate about failure modes, load balancing, caching consistency, and database scaling trade-offs in ${subTopic}. Keep under 3 sentences.`;
      }
    } else if (stage === 'round4_star') {
      stageContext = `This is Round 4 (Executive Deep Dive). Use the candidate's actual earlier-round background, submitted code, and architecture choices from the conversation. Ask one probing question that connects at least two rounds—for example, why they chose that implementation, how it fits the system they designed, what trade-off it creates, and how they would measure its impact. Avoid generic STAR prompts when specific project evidence is present. Keep under 3 sentences.`;
    }

    // 5. Telemetry Context (Advisory)
    let telemetryContext = '';
    const hasWpm = typeof telemetry?.wpm === 'number' && !isNaN(telemetry.wpm) && telemetry.wpm > 0;
    const hasFillerWords = typeof telemetry?.fillerWords === 'number' && !isNaN(telemetry.fillerWords);
    if (hasWpm || hasFillerWords) {
      const parts: string[] = [];
      if (hasWpm) parts.push(`WPM: ${telemetry.wpm}`);
      if (hasFillerWords) parts.push(`Filler Words: ${telemetry.fillerWords}`);
      telemetryContext = `[Diagnostic Signal: ${parts.join(', ')}]. Maintain crisp verbal engagement.`;
    }

    const systemPrompt = `You are ${selectedInterviewer.name}, ${selectedInterviewer.role}. ${selectedInterviewer.nature}.
${difficultyPrompt}
${topicPrompt}
${stageContext}
${telemetryContext}
RULES:
1. Speak in first person as ${selectedInterviewer.name} in natural spoken dialogue (no markdown bullets, no numbered lists, and NEVER append a sign-off or your name like '— ${selectedInterviewer.name}').
2. ${reviewDecision ? 'For the final code-review decision, provide a concise verdict and use the required marker; do not ask a question.' : 'Ask exactly ONE sharp, non-repetitive follow-up question per turn that directly reacts to what the candidate just said.'}
3. If the candidate says "I don't know", expresses confusion, or feels stuck, NEVER pretend they gave an answer or praise them for not knowing. Supportively acknowledge it ("No problem at all—let's look at this from a different angle...") and guide them with a simpler stepping-stone question or an alternative practical angle in ${subTopic}.
4. If the candidate gives a broad introductory greeting without project specifics, warmly acknowledge them and ask for one specific project, the technical problem it solved, and their direct contribution.
5. If the candidate gives a vague or high-level claim, press politely for a concrete number, trade-off, or failure mode. If they explicitly skip a question, briefly acknowledge the skip and pivot to a fresh topic.
6. Never give the complete code or answer away.
7. Keep response under 3 sentences max for natural spoken voice pacing.
8. If the candidate repeats a bare greeting (like "hi" or "hello") or says they do not know what to do, NEVER hallucinate that they made a technical decision or praise "your initial approach". Politely invite them to introduce their background or project experience in ${subTopic}.`;

    // 6. Multi-Key Rotation Pool & Provider Failover
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let reply = '';
    const formattedHistory = effectiveHistory.map((h) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: String(h.content || '') }));

    // A recorded interview needs the whole reply to store it, so it is answered without streaming.
    const wantsStream = !live && (Boolean(body.stream) || Boolean(body.streaming) || Boolean(req.headers.get('accept')?.includes('text/event-stream')));

    // 7. If client requested SSE streaming, attempt streaming Groq inference
    if (wantsStream) {
      for (const key of groqKeys) {
        try {
          console.log(`[Interview Chat API] Attempting streaming Groq inference with key ending in ...${key.slice(-4)}`);
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant',
              messages: [
                { role: 'system', content: systemPrompt },
                ...formattedHistory
              ],
              max_tokens: 280,
              temperature: 0.7,
              stream: true
            }),
            signal: AbortSignal.timeout(3500)
          });

          if (res.ok && res.body) {
            console.log('[Interview Chat API] Streaming Groq connection established');
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();
            const groqReader = res.body.getReader();

            const streamResponse = new ReadableStream({
              async start(controller) {
                let buffer = '';
                try {
                  while (true) {
                    const { done, value } = await groqReader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                      const trimmed = line.trim();
                      if (!trimmed || trimmed.startsWith(':')) continue;
                      if (trimmed === 'data: [DONE]') {
                        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                        controller.close();
                        return;
                      }
                      if (trimmed.startsWith('data: ')) {
                        try {
                          const json = JSON.parse(trimmed.slice(6));
                          const token = json.choices?.[0]?.delta?.content;
                          if (token) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
                          }
                        } catch {
                          // Ignore parse error on partial chunks
                        }
                      }
                    }
                  }
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                } catch (streamErr) {
                  controller.error(streamErr);
                }
              }
            });

            return new Response(streamResponse, {
              headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
              }
            });
          }
        } catch (streamAttemptErr: any) {
          console.warn('[Interview Chat API] Groq streaming key failed:', streamAttemptErr?.message);
        }
      }

      // If streaming Groq was offline, stream the deterministic fallback
      const fallback = generateProgressiveFallbackQuestion({ stage: stage || 'round1_behavioral', subTopic, history: formattedHistory, difficulty: difficulty || 'normal', interviewerName: selectedInterviewer.name, stream });
      const encoder = new TextEncoder();
      const fallbackStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: fallback })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });
      return new Response(fallbackStream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive'
        }
      });
    }

    // Attempt Groq Multi-Key Pool with ultra-fast 8B conversational model and 3.5s timeout (Non-Streaming JSON)
    for (const key of groqKeys) {
      try {
        console.log(`[Interview Chat API] Attempting Groq inference with key ending in ...${key.slice(-4)}`);
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: systemPrompt },
              ...formattedHistory
            ],
            max_tokens: 280,
            temperature: 0.7
          }),
          signal: AbortSignal.timeout(3500)
        });

        if (res.ok) {
          const data = await res.json();
          reply = (data.choices?.[0]?.message?.content || '').trim();
          if (reply) {
            console.log(`[Interview Chat API] Groq inference successful (${reply.length} chars)`);
            break;
          }
        } else {
          console.warn(`[Interview Chat API] Groq key returned status: ${res.status}`);
        }
      } catch (err: any) {
        console.warn(`[Interview Chat API] Groq request failed for key:`, err?.message);
      }
    }

    // Fallback to Google Gemini API if Groq pool is exhausted
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_KEY;
    if (!reply && geminiKey) {
      try {
        console.log('[Interview Chat API] Falling back to Gemini inference...');
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nConversation History:\n${formattedHistory.map(h => `${h.role}: ${h.content}`).join('\n')}\n\nRespond as ${selectedInterviewer.name}:` }]
              }
            ],
            generationConfig: {
              maxOutputTokens: 280,
              temperature: 0.7
            }
          }),
          signal: AbortSignal.timeout(3500)
        });
        if (geminiRes.ok) {
          const gemData = await geminiRes.json();
          reply = (gemData?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
          if (reply) {
            console.log(`[Interview Chat API] Gemini inference successful (${reply.length} chars)`);
          }
        }
      } catch (gemErr: any) {
        console.warn('[Interview Chat API] Gemini fallback failed:', gemErr?.message);
      }
    }

    // Fallback to OpenRouter if Groq pool is exhausted
    if (!reply && openRouterKey) {
      try {
        console.log('[Interview Chat API] Falling back to OpenRouter inference...');
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://pinit-careers.web.app',
            'X-Title': 'PinIT Interview AI'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              ...formattedHistory
            ],
            max_tokens: 280,
            temperature: 0.7
          }),
          signal: AbortSignal.timeout(4000)
        });

        if (res.ok) {
          const data = await res.json();
          reply = (data.choices?.[0]?.message?.content || '').trim();
          console.log('[Interview Chat API] OpenRouter fallback successful');
        }
      } catch (err: any) {
        console.warn('[Interview Chat API] OpenRouter fallback failed:', err?.message);
      }
    }

    // Deterministic fallback if all external LLMs are offline
    if (!reply) {
      console.warn('[Interview Chat API] External LLMs unavailable, using contextual deterministic fallback');
      if (reviewDecision) {
        const finalAnswer = [...formattedHistory].reverse().find(turn => turn.role === 'user')?.content || '';
        const answer = finalAnswer.toLowerCase();
        const hasReasoning = ['because', 'complexity', 'edge case', 'trade-off', 'tradeoff', 'test', 'memory', 'time'].some(term => answer.includes(term));
        const passes = finalAnswer.trim().split(/\s+/).length >= 18 && hasReasoning;
        reply = passes
          ? `Your explanation connects the implementation to its complexity or edge cases. That meets the review bar. [[ROUND_VERDICT:PASS]]`
          : `I need a clearer explanation of the reasoning behind your implementation and how it handles complexity or edge cases. [[ROUND_VERDICT:RETRY]]`;
      } else {
        reply = generateProgressiveFallbackQuestion({ stage: stage || 'round1_behavioral', subTopic, history: formattedHistory, difficulty: difficulty || 'normal', interviewerName: selectedInterviewer.name, stream });
      }
    }

    let roundVerdict: 'PASS' | 'RETRY' | undefined = undefined;
    if (reviewDecision) {
      const verdictMatch = reply.match(/\[\[ROUND_VERDICT:(PASS|RETRY)\]\]/i);
      if (verdictMatch) {
        roundVerdict = verdictMatch[1].toUpperCase() === 'PASS' ? 'PASS' : 'RETRY';
      } else {
        // Word-boundary + negation-aware fallback when LLM omits the exact bracket tag
        const lowerReply = reply.toLowerCase();
        const negatedPositivePattern = /\b(?:not|never|no|doesn'?t|does not|did not|didn'?t|won'?t|will not|cannot|can'?t|failed to)\s+(?:\w+\s+){0,2}(?:looks? good|meets? the bar|well explained|good explanation|solid approach|approved|correctly addressed|optimal|great job|excellent|pass|sufficient)\b/gi;
        const hasNegatedPositive = negatedPositivePattern.test(lowerReply);
        const scrubbedForPositive = lowerReply.replace(negatedPositivePattern, '');
        const isPositive = /\b(looks good|meets the bar|well explained|good explanation|solid approach|approved|correctly addressed|optimal|great job|excellent|pass)\b/i.test(scrubbedForPositive);
        const scrubbedPositiveNegations = lowerReply.replace(/\b(?:no|not|never|didn'?t|zero)\s+(?:substantive\s+gaps?|gaps?|missed|unclear|issues?)\b/gi, '');
        const isNegative = hasNegatedPositive || /\b(retry|explain again|does not address|substantive gap|unclear|insufficient|incomplete|missed)\b/i.test(scrubbedPositiveNegations);
        roundVerdict = (isPositive && !isNegative) ? 'PASS' : 'RETRY';
      }
    }
    const sanitizedReply = stripInterviewerSignoff(sanitizeLLMOutput(reviewDecision ? reply.replace(/\[\[ROUND_VERDICT:(PASS|RETRY)\]\]/i, '').trim() : reply));
    if (live) {
      await recordTurns([liveUserTurn, clampTurn('assistant', sanitizedReply, stage)]);
      return NextResponse.json({ reply: sanitizedReply, recorded: true, roundVerdict });
    }
    return NextResponse.json({ reply: sanitizedReply, roundVerdict });

  } catch (err: any) {
    console.error('[Interview Chat API Critical Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error in interview chat' }, { status: 500 });
  }
}
