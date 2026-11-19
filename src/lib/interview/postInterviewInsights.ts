/**
 * Post-Interview Forensic Insights:
 * 1. Canonical Defended Tech Stack Extractor
 * 2. Question-by-Question "Your Spoken Answer vs. Ideal Benchmark Answer" Matrix Generator
 */

export interface QuestionBenchmarkItem {
  index: number;
  question: string;
  candidateAnswer: string;
  idealAnswer: string;
  score: number;
  feedback: string;
  missedConcepts: string[];
}

const TECH_CANONICAL_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: 'Python', regex: /\bpython\b/i },
  { label: 'TypeScript', regex: /\b(typescript|tsx)\b/i },
  { label: 'JavaScript', regex: /\b(javascript|es6|node\.js|nodejs)\b/i },
  { label: 'Java', regex: /\bjava\b(?!script)/i },
  { label: 'C++', regex: /\b(c\+\+|cpp|std::)\b/i },
  { label: 'SQL', regex: /\b(sql|postgres|postgresql|mysql|sqlite)\b/i },
  { label: 'React', regex: /\breact(?:\.js|js)?\b/i },
  { label: 'Next.js', regex: /\bnext(?:\.js|js)?\b/i },
  { label: 'Redis Cache', regex: /\bredis\b/i },
  { label: 'Kafka / Queue', regex: /\b(kafka|rabbitmq|sqs|pub\/sub|message queue)\b/i },
  { label: 'Docker', regex: /\bdocker\b/i },
  { label: 'Kubernetes', regex: /\b(kubernetes|k8s)\b/i },
  { label: 'AWS / Cloud', regex: /\b(aws|s3|lambda|ec2|gcp|azure|cloudflare|cdn)\b/i },
  { label: 'Load Balancer', regex: /\b(load balancer|nginx|api gateway)\b/i },
  { label: 'WebRTC / WS', regex: /\b(webrtc|websocket|websockets)\b/i },
  { label: 'GraphQL / REST', regex: /\b(graphql|rest api)\b/i },
  { label: 'Vector DB / RAG', regex: /\b(vector|pgvector|pinecone|rag|embedding)\b/i },
  { label: 'DCF / Valuation', regex: /\b(dcf|ebitda|npv|irr|wacc|moic|lbo)\b/i },
  { label: 'IFRS / Audit', regex: /\b(ifrs|gaap|audit|reconciliation|ledger|statutory)\b/i },
  { label: 'Unit Economics', regex: /\b(cac|ltv|roas|churn|conversion|margin)\b/i }
];

const LANG_DISPLAY_MAP: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  sql: 'SQL',
  cpp: 'C++',
  typescript: 'TypeScript'
};

export const SKIP_TURN_REGEX = /^(?:\[Candidate skipped question\]|I would like to skip\b)/i;

/**
 * Extracts verified, defended technologies & domain frameworks from candidate transcript,
 * selected coding language, and whiteboard architecture nodes (max 10 items).
 */
export function extractDefendedTechStack(
  messages: Array<{ role: string; content: string }>,
  selectedLang?: string,
  topology?: any
): string[] {
  const found = new Set<string>();

  if (selectedLang && LANG_DISPLAY_MAP[selectedLang.toLowerCase()]) {
    found.add(LANG_DISPLAY_MAP[selectedLang.toLowerCase()]);
  }

  const candidateCorpus = (messages || [])
    .filter(m => m?.role === 'user' && typeof m.content === 'string' && !SKIP_TURN_REGEX.test(m.content.trim()))
    .map(m => m.content)
    .join(' ');

  const nodeCorpus = Array.isArray(topology?.nodes)
    ? topology.nodes.map((n: any) => `${n?.type || ''} ${n?.label || ''}`).join(' ')
    : '';

  const fullCorpus = `${candidateCorpus} ${nodeCorpus}`;

  for (const item of TECH_CANONICAL_PATTERNS) {
    if (item.regex.test(fullCorpus)) {
      found.add(item.label);
    }
    if (found.size >= 10) break;
  }

  return Array.from(found).slice(0, 10);
}

function cleanInterviewerQuestion(raw: string): string {
  return String(raw || '')
    .replace(/\s*—\s*(?:Ms\.|Mr\.|Dr\.)?\s*[\w\s]+$/i, '')
    .replace(/^(?:Ms\.|Mr\.|Dr\.)?\s*[\w\s]+:\s*/i, '')
    .trim();
}

function deriveIdealAnswerAndConcepts(
  question: string,
  topic: string,
  isNonTech: boolean
): { idealAnswer: string; expectedConcepts: string[] } {
  const q = question.toLowerCase();
  const cleanTopic = (topic || 'Engineering').trim();

  if (/\b(trade-?off|differently|alternative|compromise|retrospective|revisit)\b/i.test(q)) {
    return {
      idealAnswer: isNonTech
        ? `Initially we prioritized rapid market execution in ${cleanTopic}; in retrospect, introducing automated risk controls and unit-economic guardrails earlier would have preserved margins without slowing deal velocity.`
        : `We initially chose a unified monolith in ${cleanTopic} for rapid iteration; in retrospect, decoupling heavy write paths via idempotent asynchronous queues and Redis caching earlier would have eliminated lock contention under 5x load.`,
      expectedConcepts: isNonTech
        ? ['Explicit trade-off (speed vs risk)', 'Process/control evolution', 'Quantified unit-economic impact']
        : ['Initial constraint rationale', 'Specific architectural alternative', 'Quantified latency/scale gain']
    };
  }

  if (/\b(complexity|edge case|boundary|null|empty|concurrent|race|code|implement|solution)\b/i.test(q)) {
    return {
      idealAnswer: `Stated exact O(N) / O(N log N) time and O(N) space complexity bounds, verified null/empty and negative/duplicate edge cases explicitly, and guarded shared mutations with idempotent or thread-safe invariants.`,
      expectedConcepts: ['Big-O Time & Space analysis', 'Empty/negative/duplicate boundaries', 'Concurrency or invariant safety']
    };
  }

  if (/\b(fail|mistake|outage|incident|crash|bottleneck|latency|scale|cache|partition|consistency)\b/i.test(q)) {
    return {
      idealAnswer: `Diagnosed the bottleneck via telemetry, contained impact (rollback or circuit breaker), decoupled hot-path reads with TTL caching/replication, enforced idempotency across retries, and added automated regression monitors.`,
      expectedConcepts: ['Root-cause telemetry diagnosis', 'Failure containment & failover', 'Measurable p99/SLA recovery']
    };
  }

  if (/\b(conflict|disagree|stakeholder|team|deadline|pressure|priorit)\b/i.test(q)) {
    return {
      idealAnswer: `Framed the disagreement around objective criteria or MoSCoW critical-path priorities, validated options with lightweight benchmarks or stakeholder alignment, and shipped on time with zero critical defects.`,
      expectedConcepts: ['Data-backed conflict resolution', 'Stakeholder alignment', 'Concrete delivery outcome']
    };
  }

  return {
    idealAnswer: isNonTech
      ? `Connected specific ${cleanTopic} experience to business KPIs, walked through analytical decision steps clearly, and concluded with quantified financial or operational impact.`
      : `Grounded the answer in specific ${cleanTopic} projects, detailed the technical decisions made, and concluded with measurable reliability, latency, or product outcomes.`,
    expectedConcepts: ['Concrete real-world example', 'Clear reasoning & decisions', 'Quantified result metric']
  };
}

/**
 * Deterministically pairs substantive interviewer turns with candidate answers to construct
 * an honest Question-by-Question Benchmark Comparison Matrix when LLM per-question breakdown
 * is unavailable or incomplete.
 */
export function buildQuestionBenchmarks(
  messages: Array<{ role: string; content: string }>,
  topic: string = 'Software Engineering',
  domainStream: 'tech' | 'non_tech' = 'tech'
): QuestionBenchmarkItem[] {
  const safeMsgs = Array.isArray(messages) ? messages : [];
  const isNonTech = domainStream === 'non_tech';
  const items: QuestionBenchmarkItem[] = [];

  for (let i = 0; i < safeMsgs.length - 1; i++) {
    const cur = safeMsgs[i];
    const next = safeMsgs[i + 1];
    if (cur?.role !== 'assistant' || next?.role !== 'user') continue;

    const cleanQ = cleanInterviewerQuestion(cur.content);
    const candidateAns = String(next.content || '').trim();
    if (!cleanQ || !candidateAns || SKIP_TURN_REGEX.test(candidateAns)) continue;
    // Skip connection error placeholders
    if (/having trouble connecting|could not review that/i.test(cleanQ)) continue;

    const { idealAnswer, expectedConcepts } = deriveIdealAnswerAndConcepts(cleanQ, topic, isNonTech);
    const words = candidateAns.split(/\s+/).filter(Boolean);
    const lowerAns = candidateAns.toLowerCase();

    const hasReasoning = /\b(because|therefore|so that|trade-off|tradeoff|however|whereas|due to|to prevent|in order to)\b/i.test(lowerAns);
    const hasMetrics = /(\d+%|\d+x|\d+\s*(ms|s|sec|minutes|users|rps|req\/s|mb|gb|\$))/i.test(lowerAns);
    const hasTechnicalGrounding = extractDefendedTechStack([{ role: 'user', content: candidateAns }]).length > 0;

    let score = 45;
    if (words.length >= 12) score += 12;
    if (words.length >= 25) score += 8;
    if (hasReasoning) score += 14;
    if (hasMetrics) score += 12;
    if (hasTechnicalGrounding) score += 9;
    score = Math.min(98, Math.max(30, score));

    const missedConcepts: string[] = [];
    if (!hasReasoning) missedConcepts.push(expectedConcepts[0] || 'Causal trade-off reasoning');
    if (!hasTechnicalGrounding) missedConcepts.push(expectedConcepts[1] || 'Specific technologies or domain mechanics');
    if (!hasMetrics) missedConcepts.push(expectedConcepts[2] || 'Quantified metrics (latency, %, $, SLA)');

    const feedback = missedConcepts.length === 0
      ? 'Strong, structured answer combining clear technical grounding, causal reasoning, and measurable outcomes.'
      : `Addressed the prompt${words.length < 15 ? ' briefly' : ''}; strengthen this answer by adding ${missedConcepts.join(' and ').toLowerCase()}.`;

    items.push({
      index: items.length + 1,
      question: cleanQ,
      candidateAnswer: candidateAns,
      idealAnswer,
      score,
      feedback,
      missedConcepts
    });

    if (items.length >= 8) break;
  }

  return items;
}
