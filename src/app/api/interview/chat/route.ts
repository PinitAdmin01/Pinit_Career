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
  transcriptForStage,
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
  intent: 'skip' | 'stuck' | 'greeting' | 'intro' | 'vague' | 'substantive' | 'readiness' | 'clarification' | 'coaching_request' | 'no_experience' | 'language_barrier';
  subject: string;
  keyTerm: string;
}

export function scopeHistoryToStage<T extends { role: string; content: string }>(
  history: T[],
  stage?: string
): T[] {
  if (!Array.isArray(history) || history.length === 0) return [];
  if (stage !== 'round2_coding' && stage !== 'round3_systems') return history;

  const markerRe = stage === 'round2_coding'
    ? /Welcome to Round 2\b|\[Round 2:|\[Entering Round 2/i
    : /Welcome to Round 3\b|\[Round 3:|\[Entering Round 3/i;

  for (let i = history.length - 1; i >= 0; i--) {
    if (markerRe.test(String(history[i]?.content || ''))) {
      return history.slice(i);
    }
  }

  const hasEarlierRoundContext = history.some((m) =>
    /Corporate Interview!|Welcome to your interview\.|Welcome to Round 1\b|Welcome to Round 2\b|\[Round 1:|\[Round 2:/i.test(String(m?.content || ''))
  );
  return hasEarlierRoundContext ? history.slice(-1) : history;
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

  // 2. Check for language barrier, communication mismatch, or deep incomprehension
  if (
    /\b(?:telugu|hindi|tamil|kannada|malayalam|bengali|marathi|gujarati)\b/i.test(lower) ||
    /\b(?:can'?t\s+understand|cannot\s+understand|what\s+are\s+you\s+saying|what\s+you\s+are\s+saying|don'?t\s+understand\s+english|speak\s+in\s+telugu|speak\s+in\s+hindi|wait\s+what\s+what|wait\s+what|can\s+not\s+understand|unable\s+to\s+understand|not\s+understanding)\b/i.test(lower)
  ) {
    return { intent: 'language_barrier', subject: subTopic, keyTerm: subTopic };
  }

  // 3. Check for candidate stating lack of experience / non-tech background / no projects / just attending
  if (
    /\b(?:have\s+not\s+done|haven'?t\s+done|never\s+done|haven'?t\s+tried|have\s+not\s+tried|don'?t\s+have\s+any\s+tried|not\s+done\s+anything|not\s+a\s+(?:software|developer|engineer|coder|programmer)|not\s+an\s+engineer|no\s+(?:software\s+)?course|no\s+(?:technical\s+)?project|no\s+practical\s+experience|no\s+coding\s+experience|just\s+attending\s+(?:interview|the\s+interview|right\s+now)|not\s+from\s+(?:cs|it|computer|tech)\s+background|zero\s+experience|not\s+done\s+any\s+course)\b/i.test(lower)
  ) {
    return { intent: 'no_experience', subject: subTopic, keyTerm: subTopic };
  }

  // 4. Check for candidate uncertainty, confusion, or "I don't know"
  if (
    /\b(don'?t know|do not know|no idea|not sure|not certain|never worked with|haven'?t worked|unclear|stuck|lost|what to do|cannot say|can'?t answer|not familiar|blanking)\b/i.test(lower) ||
    /^(?:i don'?t know|no idea|not sure|dunno|idk|nothing)[.!]?$/i.test(lower)
  ) {
    return { intent: 'stuck', subject: subTopic, keyTerm: subTopic };
  }

  // 3. Check for candidate readiness / start intent (e.g. "ok im ready", "i am ready", "let's start", "ready")
  if (
    /\b(?:i'?m\s+ready|im\s+ready|we\s+are\s+ready|ready\s+to\s+start|ready\s+now|let'?s\s+start|let'?s\s+begin|let'?s\s+go|all\s+set|start\s+interview|yes\s+ready)\b/i.test(lower) ||
    /^(?:ready|ok\s+ready|yes|start|begin)[.!]?$/i.test(lower)
  ) {
    return { intent: 'readiness', subject: subTopic, keyTerm: subTopic };
  }

  // 4. Check for clarification requests (e.g. "can u explain in depth", "could you clarify", "what do you mean?")
  if (
    /\b(?:can\s+(?:you|u)\s+(?:explain|exaplin|elaborate|clarify|rephrase|repeat)|(?:explain|exaplin)\s+(?:in\s+depth|more|further)|what\s+do\s+you\s+mean|what\s+does\s+that\s+mean|could\s+you\s+(?:clarify|explain|exaplin|elaborate)|did\s+not\s+understand|didn'?t\s+understand|please\s+(?:explain|exaplin)|elaborate\s+please)\b/i.test(lower)
  ) {
    return { intent: 'clarification', subject: subTopic, keyTerm: subTopic };
  }

  // 5. Check for coaching / answer guidance requests (e.g. "how to answer", "how should i answer", "what should i say")
  if (
    /\b(?:how\s+to\s+answer|how\s+should\s+i\s+answer|how\s+do\s+i\s+answer|what\s+should\s+i\s+say|how\s+to\s+respond|give\s+me\s+an\s+example|what\s+format|how\s+to\s+structure)\b/i.test(lower)
  ) {
    return { intent: 'coaching_request', subject: subTopic, keyTerm: subTopic };
  }

  // 6. Check for bare greetings without substance (e.g. "hi", "hello", "ok hi", "hey", "namaste", "hi there", "hi priya", "hello sir")
  if (
    /^(?:ok\s+)?(?:hi|hello|hey|greetings|good\s+(?:morning|afternoon|evening)|namaste|hola|yo|sup)(?:\s+(?:there|sir|ma'?am|team|everyone|all|[a-z]+))?[.!]?$/i.test(lower) ||
    (/^(?:ok\s+)?(?:hi|hello|hey)\b/i.test(lower) && clean.split(/\s+/).length <= 2)
  ) {
    return { intent: 'greeting', subject: subTopic, keyTerm: subTopic };
  }

  // 7. Metric match: e.g. "40%", "10x", "500ms", "3 team members", "millions of users"
  const metricMatch = clean.match(/(\d+%\s*(?:latency\s*(?:drop|reduction|increase)?|improvement|reduction|increase|drop)?|10x|5x|\d+\s*(?:ms|seconds|minutes|hours|users|req\/s|rps|nodes|servers|instances))/i);
  if (metricMatch) {
    return { intent: 'substantive', subject: metricMatch[1].trim(), keyTerm: metricMatch[1].trim() };
  }

  // 10. Common high-value technical & business keywords (matched with strict word boundaries)
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

  // 11. Broad self-introduction check (greeting or background introduction)
  const isIntroGreeting = /\b(?:my name is\b|i am a\b|i'm a\b|i am full stack\b|i'm full stack\b|as a software\b|fresher\b|recent graduate\b|student\b)/i.test(lower);
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

  // 12. Extract substantive action/problem clauses
  const actionMatch = clean.match(/(?:migrat|refactor|optimiz|debugg|deploy|resolv|implement|architect|scal|build|handl|manag|tackl)\w*\s+(?:the\s+)?[\w\s]{3,24}/i);
  if (actionMatch) {
    const rawPhrase = actionMatch[0].trim().replace(/\s+/g, ' ');
    const parts = rawPhrase.split(/\s+/);
    return { intent: 'substantive', subject: rawPhrase, keyTerm: parts.slice(-2).join(' ') };
  }

  // 13. Meaningful substantive response check (only if 8+ words and contains verbs/substance)
  const words = clean.split(/\s+/).filter(w => !/^(i|we|my|the|a|an|in|on|at|to|for|of|with|and|or|so|but|that|this|it|is|was|are|were|been|have|has|had|do|did|doing|done|does|would|could|should|can|will|just|really|basically|like|you|know|there|here|then|some|all|our|don'?t|dont|not|what|who|when|where|why|how|scenario|approach|hi|hello|hey|yes|no|ok|okay|anything|everything|course|courses|project|projects|something|saying|attending|interview|date|till|right|now|can't|cannot|understand)$/i.test(w));
  if (words.length >= 6) {
    return { intent: 'substantive', subject: subTopic, keyTerm: subTopic };
  }

  return { intent: 'vague', subject: subTopic, keyTerm: subTopic };
}

export function generateProgressiveFallbackQuestion(ctx: FallbackContext): string {
  const { stage, subTopic, history, interviewerName, stream = 'tech' } = ctx;

  const userTurns = (history || []).filter(m => m.role === 'user');
  const lastUserTurn = userTurns[userTurns.length - 1]?.content || '';
  const turnCount = userTurns.length;
  const analysis = analyzeCandidateTurn(lastUserTurn, subTopic);

  // 1. Candidate signaled readiness to start (e.g. "ok im ready", "ready", "let's start")
  if (analysis.intent === 'readiness') {
    return `Great, let's dive right in! To get started, please walk me through your background and tell me about one recent project you worked on in ${subTopic}.`;
  }

  // 2. Candidate asked for clarification or depth (e.g. "can u explain in depth", "what do you mean?")
  if (analysis.intent === 'clarification') {
    return `Of course! To put it simply: think of a real project or hands-on task you worked on in ${subTopic}. What was the primary challenge you navigated, and what specific steps did you take to deliver the outcome?`;
  }

  // 3. Candidate asked for guidance on how to answer (e.g. "how to answer", "what should i say")
  if (analysis.intent === 'coaching_request') {
    return `A solid framework is the STAR method: describe the Situation, the Task you owned, the Action you took, and the Result. Feel free to choose any project, internship, or practical coursework in ${subTopic}.`;
  }

  // First turn: warm welcome & initial background question (only turn that includes self-intro)
  if (turnCount <= 1 && (!lastUserTurn || lastUserTurn.length < 15) && analysis.intent !== 'substantive' && analysis.intent !== 'language_barrier' && analysis.intent !== 'no_experience' && analysis.intent !== 'stuck') {
    return `Welcome to your interview. I am ${interviewerName}. To get started, could you walk me through your background and your hands-on experience with ${subTopic}?`;
  }

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

  // 2. Candidate gave a bare greeting without substance (e.g. "hi", "hello", "ok hi")
  if (analysis.intent === 'greeting') {
    if (turnCount <= 1) {
      return `Welcome to your interview. I am ${interviewerName}. To get started, could you walk me through your background and your hands-on experience with ${subTopic}?`;
    }
    if (turnCount === 2) {
      return `Hello! To help us get underway, please share an overview of your background, your education, or any recent projects you've worked on in ${subTopic}.`;
    }
    return `Whenever you're ready, feel free to introduce yourself or describe any practical experience or coursework you've done in ${subTopic} so we can begin.`;
  }

  // 6. Candidate gave a broad introductory greeting or project summary
  if (analysis.intent === 'intro') {
    if (analysis.keyTerm && analysis.keyTerm !== subTopic) {
      return `Thanks for walking me through your background! You mentioned working with ${analysis.keyTerm} in your recent work. Could you dive into one specific project where you leveraged ${analysis.keyTerm}, explaining the core problem and your contribution?`;
    }
    return `Great to have you here! Diving into your hands-on experience with ${subTopic}, could you highlight one specific project you worked on, the core problem it addressed, and your direct contribution?`;
  }

  // 7. Candidate honestly stated no experience / not a developer / no projects / just attending
  if (analysis.intent === 'no_experience') {
    if (stage === 'round3_systems') {
      return stream === 'non_tech'
        ? `No worries at all—let's keep the workflow practical. Look at the canvas on the left: try placing two blocks (such as Customer Intake and Fulfillment), connect them, and tell me what could slow that handoff down.`
        : `No worries at all—we don't need prior production experience to start designing. Look at the whiteboard on the left: try placing Client App, API Gateway, and Postgres DB, connect them, and tell me where traffic flows first.`;
    }
    if (stage === 'round2_coding') {
      return `No problem at all—let's break the active challenge into one small step. Forget syntax for a moment: in plain English, what steps would you take to solve the prompt shown on the left?`;
    }
    const noExpPivots = [
      `Thank you for being upfront about that. Since you haven't worked on software or technical projects yet, could you share what your educational background is and what field or role you are aiming for?`,
      `I appreciate your honesty—everyone starts somewhere. Tell me a bit about your studies or any non-technical coursework, problem-solving activities, or personal interests you've pursued so far.`,
      `That is completely fine. What originally motivated you to attend this interview today, and what specific skills or subjects are you most excited to learn?`
    ];
    return noExpPivots[turnCount % noExpPivots.length];
  }

  // 8. Candidate expressed language barrier, incomprehension, or deep confusion
  if (analysis.intent === 'language_barrier') {
    if (stage === 'round3_systems') {
      return `Sorry if that sounded unclear! In simple words: please add a Client block and a Database block on the whiteboard on the left, then click Evaluate Architecture.`;
    }
    if (stage === 'round2_coding') {
      return `Sorry for the confusion! Let's make this simple: read the short problem at the top left and try writing your first step, or click Hints if you need a clue.`;
    }
    const langPivots = [
      `I apologize if my phrasing was complicated. Let's keep it very simple: could you tell me your name, what you studied in college, and what kind of job you are looking for?`,
      `No worries at all, let's take it slow and simple. In plain words, what are the subjects or areas that you feel most comfortable talking about?`,
      `I hear you—let's reset. Tell me simply: what is your educational background and what degree did you complete?`
    ];
    return langPivots[turnCount % langPivots.length];
  }

  // 9. Candidate gave an extremely brief or vague answer
  if (analysis.intent === 'vague') {
    const vaguePivots = [
      `Understood. Could you expand a bit more on that? Specifically, what was your personal responsibility and the primary challenge you navigated for ${subTopic}?`,
      `Got it. Could you share a bit more detail on that? For example, what tools or methods did you use, and what was the outcome?`,
      `Thanks for sharing. To help me understand better, could you walk me through one specific example of how you approached that?`
    ];
    return vaguePivots[turnCount % vaguePivots.length];
  }

  // 10. Candidate explicitly skipped
  if (analysis.intent === 'skip') {
    return `Understood—we'll note the skip and move forward. Let's pivot to another dimension of ${subTopic}: what is an area in this domain where you've spent significant hands-on time?`;
  }

  // 11. Candidate provided substantive response with technical / metric / action details
  const { keyTerm } = analysis;
  const opener = (keyTerm && keyTerm !== subTopic)
    ? `Regarding your experience with ${keyTerm}:`
    : [
        `Understood—thanks for walking through that scenario.`,
        `That provides helpful context on your approach.`,
        `Thanks for sharing that overview.`,
        `That gives good context on your background.`
      ][turnCount % 4];

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
      companyContext,
      topologyContext
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
      ? [...transcriptForStage(live, stage), ...(liveUserTurn ? [{ role: 'user', content: liveUserTurn.content }] : [])]
      : scopeHistoryToStage(Array.isArray(history) ? history : [], stage);

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
    const topologySummary = typeof topologyContext === 'string' && topologyContext.trim()
      ? topologyContext.trim().slice(0, 600)
      : 'Empty whiteboard (0 nodes placed yet)';
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
        ? `This is the final code-review decision for Round 2. STRICT STAGE LOCK: Assess ONLY the candidate's Round 2 code/case solution and explanation. If both meet the bar, briefly acknowledge why and append exactly [[ROUND_VERDICT:PASS]]. If the reasoning or implementation has a substantive gap, briefly explain it and append exactly [[ROUND_VERDICT:RETRY]]. Do not ask another question. Never include the marker in spoken prose.`
        : `This is Round 2 (Technical Assessment & Problem Solving). STRICT STAGE LOCK: Stay 100% focused on the active Round 2 challenge, algorithm/logic, complexity, edge cases, or case-study calculations. NEVER revert to Round 1 background, college degree, or generic introductory trivia. Review submitted code when available and ask one focused question; if asked for hints, give a conceptual clue without giving away the solution. Keep under 3 sentences.`;
    } else if (stage === 'round3_systems') {
      if (stream === 'non_tech') {
        stageContext = `This is Round 3 (Business Workflow Canvas). STRICT STAGE LOCK: Stay 100% focused on business workflow architecture, funnel conversion, monetization loops, and operational bottlenecks for ${subTopic}. NEVER ask Round 1 background/college/syntax questions. Current Canvas State: ${topologySummary}. If the canvas is empty, guide the candidate to place 2-3 workflow blocks and click Evaluate Architecture; otherwise probe one concrete trade-off or bottleneck. Keep under 3 sentences.`;
      } else {
        stageContext = `This is Round 3 (System Architecture Canvas). STRICT STAGE LOCK: Stay 100% focused on system architecture design for ${subTopic} (components, request flow, load balancing, caching, databases, queues, failure modes, and scaling). NEVER ask Round 1 personal background/degree questions or basic language syntax trivia (like Python lists vs tuples or intro web frameworks). Current Whiteboard State: ${topologySummary}. If the whiteboard is empty, guide the candidate to place 2-3 core blocks (such as Client App, API Gateway, Database) and explain how traffic flows; otherwise probe one concrete architectural trade-off or failure mode. Keep under 3 sentences.`;
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
3. If the candidate says "I don't know", expresses confusion, or feels stuck, NEVER pretend they gave an answer or praise them for not knowing. Supportively acknowledge it ("No problem at all—let's look at this from a different angle...") and guide them with a simpler stepping-stone question strictly inside the CURRENT stage (${stage || 'round1_behavioral'}) — NEVER drift back into Round 1 college background or unrelated syntax trivia during Round 2 or Round 3.
4. If the candidate gives a broad introductory greeting without project specifics, warmly acknowledge them and ask for one specific project, the technical problem it solved, and their direct contribution.
5. If the candidate gives a vague or high-level claim, press politely for a concrete number, trade-off, or failure mode. If they explicitly skip a question, briefly acknowledge the skip and pivot to a fresh topic.
6. Never give the complete code or answer away.
7. Keep response under 3 sentences max for natural spoken voice pacing.
8. If the candidate repeats a bare greeting (like "hi" or "hello") or says they do not know what to do, NEVER hallucinate that they made a technical decision or praise "your initial approach". Politely invite them to introduce their background or project experience in ${subTopic}.
9. If the candidate indicates readiness (e.g. "ok im ready", "ready to start"), welcome them enthusiastically and invite them directly to walk through their background and a key project in ${subTopic}.
10. If the candidate asks for clarification or asks to explain in depth (e.g. "can you explain in depth", "what do you mean?"), explain the question in simpler, practical terms. NEVER treat their question as a project name or technical approach.
11. If the candidate asks how to answer (e.g. "how to answer", "what should I say?"), briefly guide them to use the STAR method (Situation, Task, Action, Result).
12. NEVER parrot back raw candidate phrasing into templates like "You made an insightful observation around [candidate's words]". Always sound like a natural, empathetic, professional corporate hiring manager.
13. If the candidate states they have no software experience, have not done projects/courses, are not a software developer, or are attending without prior technical preparation: NEVER praise them for a "practical perspective" or ask how they balanced shipping speed. Acknowledge with genuine warmth and empathy; in Round 1 ask about their actual educational background or interests, whereas in Round 2/3 keep the stepping-stone prompt focused on solving a tiny piece of the current round's problem or placing 2 blocks on the architecture canvas.
14. If the candidate expresses language confusion or a communication barrier (e.g. mentions Telugu, Hindi, can't understand, or asks what you mean): NEVER hallucinate that this was a technical choice. Respond in very simple, reassuring, plain English, apologizing for any confusion, and ask a very simple opening question about their college or interests.`;

    // 6. Multi-Key & Multi-Model Rotation Pool & Provider Failover
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const GROQ_MODELS = [
      process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
      'openai/gpt-oss-20b',
      'openai/gpt-oss-120b'
    ];

    let reply = '';
    const formattedHistory = effectiveHistory.map((h) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: String(h.content || '') }));

    // A recorded interview needs the whole reply to store it, so it is answered without streaming.
    const wantsStream = !live && (Boolean(body.stream) || Boolean(body.streaming) || Boolean(req.headers.get('accept')?.includes('text/event-stream')));

    // 7. If client requested SSE streaming, attempt streaming Groq inference
    if (wantsStream) {
      streamLoop: for (const key of groqKeys) {
        for (const model of GROQ_MODELS) {
          try {
            console.log(`[Interview Chat API] Attempting streaming Groq inference with model ${model} and key ending in ...${key.slice(-4)}`);
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: 'system', content: systemPrompt },
                  ...formattedHistory
                ],
                max_tokens: 280,
                temperature: 0.7,
                stream: true
              }),
              signal: AbortSignal.timeout(6000)
            });

            if (res.ok && res.body) {
              console.log(`[Interview Chat API] Streaming Groq connection established with model ${model}`);
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
            console.warn(`[Interview Chat API] Groq streaming key/model failed (${model}):`, streamAttemptErr?.message);
          }
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

    // Attempt Groq Multi-Key & Multi-Model Pool with 6s timeout (Non-Streaming JSON)
    for (const key of groqKeys) {
      for (const model of GROQ_MODELS) {
        try {
          console.log(`[Interview Chat API] Attempting Groq inference with model ${model} and key ending in ...${key.slice(-4)}`);
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                ...formattedHistory
              ],
              max_tokens: 280,
              temperature: 0.7
            }),
            signal: AbortSignal.timeout(6000)
          });

          if (res.ok) {
            const data = await res.json();
            reply = (data.choices?.[0]?.message?.content || '').trim();
            if (reply) {
              console.log(`[Interview Chat API] Groq inference successful via ${model} (${reply.length} chars)`);
              break;
            }
          } else {
            console.warn(`[Interview Chat API] Groq model ${model} returned status: ${res.status}`);
          }
        } catch (err: any) {
          console.warn(`[Interview Chat API] Groq request failed for model ${model}:`, err?.message);
        }
      }
      if (reply) break;
    }

    // Fallback to Google Gemini API if Groq pool is exhausted
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_KEY;
    if (!reply && geminiKey) {
      try {
        console.log('[Interview Chat API] Falling back to Gemini inference...');
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
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
          signal: AbortSignal.timeout(6000)
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
