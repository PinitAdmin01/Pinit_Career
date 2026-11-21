/**
 * Post-Interview Forensic Insights:
 * 1. Canonical Defended Tech & Domain Stack Extractor (strictly evidence-based)
 * 2. Real, Zero-Floor Question-by-Question Benchmark & Round Partitioning Engine
 */

export interface QuestionBenchmarkItem {
  index: number;
  round: 1 | 2 | 3 | 4;
  question: string;
  candidateAnswer: string;
  idealAnswer: string;
  score: number;
  feedback: string;
  missedConcepts: string[];
  isTrivial?: boolean;
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
  { label: 'IFRS / Audit', regex: /\b(ifrs|gaap|ind\s*as|audit|reconciliation|ledger|statutory|gst|tds)\b/i },
  { label: 'Unit Economics', regex: /\b(cac|ltv|roas|churn|conversion|margin|dscr|working capital|current ratio)\b/i }
];

const LANG_DISPLAY_MAP: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  sql: 'SQL',
  cpp: 'C++',
  typescript: 'TypeScript'
};

export const SKIP_TURN_REGEX = /^(?:\[Candidate skipped (?:question|round)\]|I would like to skip\b)/i;

const TRIVIAL_GREETING_OR_NON_ANSWER_REGEX =
  /^(?:(?:hi|hello|hey|hii+|good\s+(?:morning|afternoon|evening)|namaste|ok|okay|yes|yeah|yep|no|nope|nah|sure|ready|im\s+ready|i\s+am\s+ready|nothing|none|idk|i\s+don'?t\s+know|dont\s+know|no\s+idea|pass|skip|wait|what|huh|test|testing)(?:[\s,!?.]+(?:hi|hello|hey|there|ma'?am|sir|my\s+name\s+is\s+\w+|i\s+am\s+\w+|i'?m\s+\w+|ready|ok|okay|nothing|know|it|this|that))*[\s,!?.]*)$/i;

/**
 * Identifies greetings, filler acknowledgments, or "I don't know" replies that carry
 * zero substantive domain/technical/behavioral evidence.
 */
export function isTrivialOrNonSubstantiveAnswer(text: string): boolean {
  const trimmed = String(text || '').trim();
  if (!trimmed) return true;
  if (SKIP_TURN_REGEX.test(trimmed)) return true;
  if (TRIVIAL_GREETING_OR_NON_ANSWER_REGEX.test(trimmed)) return true;

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= 5) {
    // Allow short answers ONLY if they contain real technical/domain/numeric terms
    const hasSubstance =
      TECH_CANONICAL_PATTERNS.some(p => p.regex.test(trimmed)) ||
      /\b(o\([n1log\s*]+\)|binary|hash|cache|index|api|schema|balance|asset|liability|revenue|profit|margin|ratio|audit|gst|tax|funnel|cohort)\b/i.test(trimmed) ||
      /\d+(?:\.\d+)?\s*(%|x|ms|cr|lakh|rs|₹|\$)/i.test(trimmed);
    if (!hasSubstance) return true;
  }

  // Catch explicit non-experience / refusal phrases with no substance
  if (
    words.length <= 16 &&
    /\b(i\s+don'?t\s+know|dont\s+know|no\s+idea|have\s+not\s+done\s+anything|haven'?t\s+done\s+anything|not\s+a\s+software\s+developer|nothing\s+till\s+date|never\s+tried)\b/i.test(trimmed)
  ) {
    return true;
  }

  return false;
}

/**
 * Infers which interview round (1–4) an assistant turn belongs to based on
 * canonical stage welcome banners in the transcript.
 */
export function inferMessageRounds(
  messages: Array<{ role: string; content: string }>
): Array<{ role: string; content: string; round: 1 | 2 | 3 | 4 }> {
  let currentRound: 1 | 2 | 3 | 4 = 1;
  return (messages || []).map(m => {
    const content = String(m?.content || '');
    if (m?.role === 'assistant') {
      if (/\bwelcome\s+to\s+round\s*2\b/i.test(content)) currentRound = 2;
      else if (/\bwelcome\s+to\s+round\s*3\b/i.test(content)) currentRound = 3;
      else if (/\bwelcome\s+to\s+round\s*4\b/i.test(content)) currentRound = 4;
    }
    return {
      role: String(m?.role || ''),
      content,
      round: currentRound,
    };
  });
}

/**
 * Extracts verified, defended technologies & domain frameworks strictly from:
 * - substantive candidate transcript turns
 * - placed whiteboard topology nodes
 * - selected coding language ONLY when the candidate actually submitted code (`codeSubmitted = true`)
 */
export function extractDefendedTechStack(
  messages: Array<{ role: string; content: string }>,
  selectedLang?: string,
  topology?: any,
  codeSubmitted: boolean = true
): string[] {
  const found = new Set<string>();

  if (codeSubmitted && selectedLang && LANG_DISPLAY_MAP[selectedLang.toLowerCase()]) {
    found.add(LANG_DISPLAY_MAP[selectedLang.toLowerCase()]);
  }

  const candidateCorpus = (messages || [])
    .filter(
      m =>
        m?.role === 'user' &&
        typeof m.content === 'string' &&
        !SKIP_TURN_REGEX.test(m.content.trim()) &&
        !isTrivialOrNonSubstantiveAnswer(m.content)
    )
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
      idealAnswer: isNonTech
        ? `Isolated the funnel or working-capital bottleneck using cohort/ledger metrics, tightened approval controls, reallocated spend toward highest-margin channels, and tracked weekly KPI recovery.`
        : `Diagnosed the bottleneck via telemetry, contained impact (rollback or circuit breaker), decoupled hot-path reads with TTL caching/replication, enforced idempotency across retries, and added automated regression monitors.`,
      expectedConcepts: isNonTech
        ? ['Metric-driven bottleneck diagnosis', 'Risk/margin containment plan', 'Measurable KPI recovery']
        : ['Root-cause telemetry diagnosis', 'Failure containment & failover', 'Measurable p99/SLA recovery']
    };
  }

  if (/\b(conflict|disagree|stakeholder|team|deadline|pressure|priorit)\b/i.test(q)) {
    return {
      idealAnswer: `Framed the disagreement around objective criteria or critical-path priorities, validated options with lightweight benchmarks or stakeholder alignment, and shipped on time with zero critical defects.`,
      expectedConcepts: ['Data-backed conflict resolution', 'Stakeholder alignment', 'Concrete delivery outcome']
    };
  }

  return {
    idealAnswer: isNonTech
      ? `Connected specific ${cleanTopic} experience to business KPIs (margins, working capital, CAC/LTV, or audit controls), walked through analytical decision steps clearly, and concluded with quantified financial or operational impact.`
      : `Grounded the answer in specific ${cleanTopic} projects, detailed the technical decisions made, and concluded with measurable reliability, latency, or product outcomes.`,
    expectedConcepts: ['Concrete real-world example', 'Clear reasoning & decisions', 'Quantified result metric']
  };
}

/**
 * Deterministically pairs interviewer turns with candidate answers to construct
 * an honest, zero-floor Question-by-Question Benchmark Comparison Matrix.
 * Bare greetings / non-answers score 0–5%, never an inflated 45%.
 */
export function buildQuestionBenchmarks(
  messages: Array<{ role: string; content: string }>,
  topic: string = 'Software Engineering',
  domainStream: 'tech' | 'non_tech' = 'tech'
): QuestionBenchmarkItem[] {
  const annotated = inferMessageRounds(messages);
  const isNonTech = domainStream === 'non_tech';
  const items: QuestionBenchmarkItem[] = [];

  const pairs: Array<{ round: 1 | 2 | 3 | 4; question: string; answer: string }> = [];

  // Handle compact transcripts that begin directly with a candidate opening response
  if (annotated.length > 0 && annotated[0].role === 'user') {
    const firstAns = annotated[0].content.trim();
    if (firstAns && !SKIP_TURN_REGEX.test(firstAns)) {
      pairs.push({
        round: annotated[0].round,
        question: `Introduce yourself and walk through your relevant ${topic || 'domain'} experience.`,
        answer: firstAns,
      });
    }
  }

  for (let i = 0; i < annotated.length - 1; i++) {
    const cur = annotated[i];
    const next = annotated[i + 1];
    if (cur.role !== 'assistant' || next.role !== 'user') continue;

    const cleanQ = cleanInterviewerQuestion(cur.content);
    const candidateAns = next.content.trim();
    if (!cleanQ || !candidateAns || SKIP_TURN_REGEX.test(candidateAns)) continue;
    if (/having trouble connecting|could not review that/i.test(cleanQ)) continue;

    pairs.push({ round: cur.round, question: cleanQ, answer: candidateAns });
  }

  for (const pair of pairs) {
    const cleanQ = pair.question;
    const candidateAns = pair.answer;

    const { idealAnswer, expectedConcepts } = deriveIdealAnswerAndConcepts(cleanQ, topic, isNonTech);
    const words = candidateAns.split(/\s+/).filter(Boolean);
    const lowerAns = candidateAns.toLowerCase();
    const trivial = isTrivialOrNonSubstantiveAnswer(candidateAns);

    if (trivial) {
      const isPureRefusal = /\b(don'?t\s+know|dont\s+know|no\s+idea|nothing|none)\b/i.test(lowerAns);
      items.push({
        index: items.length + 1,
        round: pair.round,
        question: cleanQ,
        candidateAnswer: candidateAns,
        idealAnswer,
        score: isPureRefusal ? 0 : 5,
        feedback: isPureRefusal
          ? 'No domain answer provided. Attempt a structured breakdown using a concrete example or explain how you would investigate the problem.'
          : 'Brief greeting only — did not answer the question with background, project details, or reasoning.',
        missedConcepts: expectedConcepts,
        isTrivial: true,
      });
      if (items.length >= 10) break;
      continue;
    }

    const hasReasoning = /\b(because|therefore|so that|trade-?off|however|whereas|due to|to prevent|in order to|so we|which reduced|which improved)\b/i.test(lowerAns);
    const hasMetrics = /(\d+(?:\.\d+)?%|\d+(?:\.\d+)?x|\d+\s*(ms|s|sec|minutes|users|rps|req\/s|mb|gb|cr|crore|lakh|lakhs|rs|inr)|[₹$]\s*\d+)/i.test(lowerAns);
    const hasDomainGrounding =
      extractDefendedTechStack([{ role: 'user', content: candidateAns }], undefined, undefined, false).length > 0 ||
      /\b(project|built|designed|implemented|optimized|audited|reconciled|analyzed|managed|deployed|tested|margin|revenue|ledger|ratio|funnel|campaign|customer|database|service|api|algorithm|firmware|kernel|register|rtos|rom|ecdsa|signature|gateway|buffer|telemetry|hardware)\b/i.test(lowerAns);
    const hasConcreteAction = /\b(i\s+(?:built|created|designed|led|implemented|migrated|reduced|increased|calculated|audited|analyzed|fixed|optimized|proposed|developed|wrote|managed|engineered|anchored|configured)|we\s+(?:built|anchored|deployed|implemented|engineered|designed|migrated))\b/i.test(lowerAns);

    let score = 0;
    if (words.length >= 6) score += 12;
    if (words.length >= 14) score += 10;
    if (words.length >= 26) score += 8;
    if (hasDomainGrounding) score += 22;
    if (hasConcreteAction) score += 14;
    if (hasReasoning) score += 18;
    if (hasMetrics) score += 14;
    score = Math.min(98, Math.max(0, score));

    const missedConcepts: string[] = [];
    if (!hasDomainGrounding && !hasConcreteAction) missedConcepts.push(expectedConcepts[0] || 'Concrete project or domain example');
    if (!hasReasoning) missedConcepts.push(expectedConcepts[1] || 'Causal trade-off reasoning');
    if (!hasMetrics) missedConcepts.push(expectedConcepts[2] || 'Quantified outcome metric');

    const feedback =
      missedConcepts.length === 0
        ? 'Strong, structured answer combining clear domain grounding, causal reasoning, and measurable outcomes.'
        : `Addressed the prompt${words.length < 15 ? ' briefly' : ''}; strengthen this answer by adding ${missedConcepts.join(' and ').toLowerCase()}.`;

    items.push({
      index: items.length + 1,
      round: pair.round,
      question: cleanQ,
      candidateAnswer: candidateAns,
      idealAnswer,
      score,
      feedback,
      missedConcepts,
      isTrivial: false,
    });

    if (items.length >= 10) break;
  }

  return items;
}
