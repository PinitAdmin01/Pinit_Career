// src/lib/ats/practicalVerificationEngine.ts
/**
 * ============================================================================
 * PRACTICAL CAPABILITY VERIFICATION & SOCRATIC QUEST ENGINE
 * ============================================================================
 * 
 * Purpose:
 * Implements the rigorous capability verification lifecycle required by the 4-Pillars framework:
 * 
 * Capability Lifecycle:
 *   DOCUMENT_SUPPORTED (Claimed on Resume, QT1 = 0)
 *            ↓
 *   DEMONSTRATED (Passed Practical Quest / Code Challenge, QT1 increases)
 *            ↓
 *   VERIFIED_COMPETENCY (Defended in Socratic Sandbox / Independent Novel Task)
 * 
 * Why this is essential for AI paired programming & enterprise integrity:
 * 1. Prevents resume inflation: A candidate cannot merely write "Python, AWS, React" to gain points.
 * 2. Deterministic grading: Tests evaluate syntactic understanding, edge case handling, and Socratic rationale.
 * 3. Dynamic QT1 Recalibration: Recomputes Capability Score (0–100) based on verified work.
 */

export type CapabilityStatus = 'CLAIMED' | 'DEMONSTRATED' | 'VERIFIED_COMPETENCY';

export interface PracticalChallenge {
  id: string;
  skillName: string;
  category: 'programming' | 'system_design' | 'database' | 'cloud' | 'web_frontend';
  title: string;
  scenario: string;
  codeSnippet?: string;
  taskType: 'CODE_FIX' | 'CODE_REVIEW' | 'COMPLEXITY_ANALYSIS' | 'IMPLEMENTATION';
  expectedConcepts: string[];
  testCases?: { input: any; expectedOutput: any; description: string }[];
  socraticQuestions: {
    question: string;
    acceptableKeyterms: string[];
    rubricHint: string;
  }[];
}

export interface VerificationSubmission {
  challengeId: string;
  skillName: string;
  candidateCode?: string;
  socraticAnswers: { questionIndex: number; answerText: string }[];
  timeSpentSeconds?: number;
}

export interface VerificationEvaluation {
  passed: boolean;
  score: number; // 0 to 100
  newCapabilityStatus: CapabilityStatus;
  feedback: string;
  conceptBreakdown: { concept: string; mastered: boolean }[];
  earnedCompetencyBadge?: string;
  evaluatedAt: number;
}

/**
 * Registry of deterministic Socratic practical challenges indexed by canonical skill name.
 */
export const PRACTICAL_CHALLENGE_REGISTRY: Record<string, PracticalChallenge[]> = {
  'Python': [
    {
      id: 'py_01_generators_memory',
      skillName: 'Python',
      category: 'programming',
      title: 'Python Memory Optimization & Generators',
      scenario: 'You are processing a 10GB server log file. A colleague wrote `[line.strip() for line in open("large.log")]`. Explain why this crashes and provide the idiomatic memory-efficient generator solution.',
      taskType: 'CODE_FIX',
      expectedConcepts: ['generator', 'yield', 'lazy evaluation', 'O(1) memory', 'context manager'],
      socraticQuestions: [
        {
          question: 'Why does list comprehension cause an Out-Of-Memory error on large datasets, whereas a generator expression does not?',
          acceptableKeyterms: ['in-memory', 'heap', 'eager', 'lazy', 'generator', 'iterator', 'stream'],
          rubricHint: 'Must contrast eager list allocation with lazy on-demand yielding.'
        },
        {
          question: 'How should the file handle be opened to ensure deterministic file descriptor cleanup even if an exception occurs?',
          acceptableKeyterms: ['with', 'context manager', 'finally', '__enter__', '__exit__'],
          rubricHint: 'Must mention `with open(...)` or context manager.'
        }
      ]
    },
    {
      id: 'py_02_async_concurrency',
      skillName: 'Python',
      category: 'programming',
      title: 'Python Asyncio & Event Loop Concurrency',
      scenario: 'A microservice needs to fetch data from 50 external APIs concurrently. Compare `asyncio.gather` with threading and explain GIL implications for I/O-bound tasks.',
      taskType: 'COMPLEXITY_ANALYSIS',
      expectedConcepts: ['asyncio', 'event loop', 'coroutine', 'non-blocking', 'GIL'],
      socraticQuestions: [
        {
          question: 'Does Python Global Interpreter Lock (GIL) prevent `asyncio` from achieving high throughput on I/O-bound requests?',
          acceptableKeyterms: ['no', 'io bound', 'non-blocking', 'cooperative', 'release gil', 'await'],
          rubricHint: 'GIL only blocks CPU-bound parallel threads; I/O-bound operations yield control.'
        }
      ]
    }
  ],

  'JavaScript': [
    {
      id: 'js_01_event_loop_closures',
      skillName: 'JavaScript',
      category: 'web_frontend',
      title: 'JS Event Loop Microtasks & Closures',
      scenario: 'Analyze the execution order of `setTimeout`, `Promise.resolve().then()`, and `queueMicrotask`. Then explain how closures retain lexical scope variables in heap memory.',
      taskType: 'CODE_REVIEW',
      expectedConcepts: ['microtask', 'macrotask', 'call stack', 'event loop', 'closure', 'lexical scope'],
      socraticQuestions: [
        {
          question: 'In what order do Promise `.then()` callbacks and `setTimeout(fn, 0)` callbacks execute when both are scheduled in the same tick?',
          acceptableKeyterms: ['promise first', 'microtask first', 'before macrotask', 'microtask queue'],
          rubricHint: 'Promise microtask queue is drained before the next macrotask (setTimeout) runs.'
        },
        {
          question: 'What constitutes a closure in JavaScript, and what is a potential memory leak risk with unintended closure retention?',
          acceptableKeyterms: ['lexical environment', 'outer scope', 'garbage collection', 'retained reference'],
          rubricHint: 'Function holding reference to outer variable preventing garbage collection.'
        }
      ]
    }
  ],

  'HTML5 & CSS3': [
    {
      id: 'web_01_semantics_accessibility',
      skillName: 'HTML5 & CSS3',
      category: 'web_frontend',
      title: 'Semantic HTML5, CSS Flexbox/Grid & WCAG Accessibility',
      scenario: 'Refactor a layout built entirely with nested `<div>` and `onclick` tags into accessible semantic HTML with proper ARIA attributes, keyboard navigation, and responsive CSS Grid.',
      taskType: 'IMPLEMENTATION',
      expectedConcepts: ['semantic', 'accessibility', 'wcag', 'aria', 'grid', 'flexbox', 'rem/em'],
      socraticQuestions: [
        {
          question: 'Why is using `<button>` preferred over `<div onclick>` for interactive elements regarding keyboard accessibility and screen readers?',
          acceptableKeyterms: ['tabindex', 'keyboard focus', 'enter key', 'space key', 'screen reader', 'role'],
          rubricHint: 'Native buttons provide built-in focus, keyboard events (Enter/Space), and screen reader roles.'
        }
      ]
    }
  ],

  'SQL': [
    {
      id: 'sql_01_indexing_joins',
      skillName: 'SQL',
      category: 'database',
      title: 'SQL Query Optimization, B-Tree Indexes & Execution Plans',
      scenario: 'A query joining `orders` and `customers` on a 10-million row table is running in 12 seconds. Explain how to use `EXPLAIN ANALYZE` to identify sequential scans and design composite B-Tree indexes.',
      taskType: 'COMPLEXITY_ANALYSIS',
      expectedConcepts: ['explain analyze', 'seq scan', 'index scan', 'b-tree', 'foreign key', 'cardinality'],
      socraticQuestions: [
        {
          question: 'What is the difference between a Sequential Scan and an Index Scan in Postgres/MySQL execution plans?',
          acceptableKeyterms: ['sequential scan', 'full table scan', 'index scan', 'b-tree', 'lookup', 'io cost'],
          rubricHint: 'Seq scan reads all disk pages; index scan traverses tree to locate matching row pointers.'
        }
      ]
    }
  ],

  'TypeScript': [
    {
      id: 'ts_01_generics_unions',
      skillName: 'TypeScript',
      category: 'programming',
      title: 'TypeScript Discriminated Unions & Advanced Generics',
      scenario: 'Implement a type-safe redux-like reducer that enforces exhaustive compile-time pattern matching across discriminated union actions.',
      taskType: 'CODE_FIX',
      expectedConcepts: ['discriminated union', 'never', 'exhaustive check', 'generic constraint', 'keyof'],
      socraticQuestions: [
        {
          question: 'How do you enforce exhaustive checking at compile-time in a TypeScript switch-case block?',
          acceptableKeyterms: ['never', 'exhaustive', 'compile-time', 'type narrowing', 'assertnever', 'default'],
          rubricHint: 'Assigning to variable of type never in the default case throws compile-time type error if unhandled union branch exists.'
        }
      ]
    }
  ],

  'React': [
    {
      id: 'react_01_hooks_lifecycle',
      skillName: 'React',
      category: 'web_frontend',
      title: 'React Concurrent Mode, Reconciliation & Hook Memory Leaks',
      scenario: 'A polling dashboard component triggers state updates after unmounting, causing memory leak warnings. Refactor it with proper AbortController cleanup in useEffect.',
      taskType: 'CODE_FIX',
      expectedConcepts: ['useeffect', 'cleanup function', 'abortcontroller', 'stale closure', 'unmounted'],
      socraticQuestions: [
        {
          question: 'Why must cleanup functions be returned from `useEffect` when subscribing to events or network intervals?',
          acceptableKeyterms: ['cleanup', 'memory leak', 'unmount', 'stale closure', 'dangling subscription', 'abort'],
          rubricHint: 'Cleanup functions prevent state mutations on unmounted components and release resources.'
        }
      ]
    }
  ],

  'Node.js': [
    {
      id: 'node_01_streams_backpressure',
      skillName: 'Node.js',
      category: 'programming',
      title: 'Node.js Streams, Event Loop Phases & Backpressure',
      scenario: 'A file upload route buffering 500MB video payloads into memory causes Node process OOM crashes. Implement stream pipeline with backpressure.',
      taskType: 'CODE_FIX',
      expectedConcepts: ['pipeline', 'transform stream', 'backpressure', 'drain event', 'chunk buffer'],
      socraticQuestions: [
        {
          question: 'What causes stream backpressure in Node.js, and how does `stream.pipeline` manage buffer flow?',
          acceptableKeyterms: ['backpressure', 'highwatermark', 'drain', 'pause', 'resume', 'buffer', 'flow control'],
          rubricHint: 'Producer outpaces consumer; pipeline pauses readable stream until writable emits drain.'
        }
      ]
    }
  ],

  'Docker': [
    {
      id: 'docker_01_multi_stage_builds',
      skillName: 'Docker',
      category: 'cloud',
      title: 'Docker Multi-Stage Builds & Minimal Production Containers',
      scenario: 'A Next.js Docker image weighs 1.8GB because development dependencies and build tools are baked in. Write a multi-stage Dockerfile using Alpine/Distroless to reduce it below 120MB.',
      taskType: 'IMPLEMENTATION',
      expectedConcepts: ['multi-stage', 'distroless', 'alpine', 'layer cache', 'non-root user'],
      socraticQuestions: [
        {
          question: 'How do multi-stage Docker builds reduce container image surface area and build artifacts?',
          acceptableKeyterms: ['multi-stage', 'build stage', 'runtime stage', 'copy --from', 'layer size', 'attack surface'],
          rubricHint: 'Only artifacts copied from intermediate stages into the lean runtime container are preserved.'
        }
      ]
    }
  ],

  'Kubernetes': [
    {
      id: 'k8s_01_pod_lifecycle_probes',
      skillName: 'Kubernetes',
      category: 'cloud',
      title: 'Kubernetes Zero-Downtime Deployments & Health Probes',
      scenario: 'Rolling updates cause 502 errors because incoming traffic routes to starting pods before DB connections initialize. Configure readiness and liveness probes.',
      taskType: 'IMPLEMENTATION',
      expectedConcepts: ['readiness probe', 'liveness probe', 'rolling update', 'traffic routing', 'endpoints'],
      socraticQuestions: [
        {
          question: 'What is the operational difference between a Kubernetes Readiness Probe and a Liveness Probe?',
          acceptableKeyterms: ['readiness', 'liveness', 'endpoints', 'restart container', 'route traffic', 'service'],
          rubricHint: 'Readiness removes pod from Service endpoints; liveness restarts an unresponsive container.'
        }
      ]
    }
  ],

  'AWS': [
    {
      id: 'aws_01_iam_s3_presigned',
      skillName: 'AWS',
      category: 'cloud',
      title: 'AWS Least-Privilege IAM & S3 Presigned Uploads',
      scenario: 'Direct server file uploads saturate EC2 bandwidth. Architecture requires direct client-to-S3 uploads with scoped IAM credentials.',
      taskType: 'IMPLEMENTATION',
      expectedConcepts: ['presigned url', 'iam policy', 'least privilege', 's3 putobject', 'expiration'],
      socraticQuestions: [
        {
          question: 'Why are presigned S3 URLs preferable to proxying large file uploads through application servers?',
          acceptableKeyterms: ['bandwidth', 'ec2 load', 'direct upload', 'scoped permission', 'time-limited', 'offload'],
          rubricHint: 'Offloads network I/O from compute instances and grants temporary scoped access directly to S3.'
        }
      ]
    }
  ],

  'Go': [
    {
      id: 'go_01_concurrency_channels',
      skillName: 'Go',
      category: 'programming',
      title: 'Go Goroutines, Mutexes & Channel Orchestration',
      scenario: 'A concurrent data crawler spawns unbounded goroutines causing socket exhaustion. Implement a bounded worker pool pattern using buffered channels and sync.WaitGroup.',
      taskType: 'CODE_FIX',
      expectedConcepts: ['goroutine', 'worker pool', 'buffered channel', 'sync.waitgroup', 'context cancellation'],
      socraticQuestions: [
        {
          question: 'How do you prevent goroutine leaks when using channels and context cancellation?',
          acceptableKeyterms: ['goroutine leak', 'context done', 'select', 'buffered channel', 'close channel', 'cancel'],
          rubricHint: 'Always listen on ctx.Done() in select statements to exit blocking goroutines.'
        }
      ]
    }
  ],

  'Rust': [
    {
      id: 'rust_01_borrowing_lifetimes',
      skillName: 'Rust',
      category: 'programming',
      title: 'Rust Ownership, Borrow Checker & Lifetime Elision',
      scenario: 'Explain why the Rust borrow checker prevents data races at compile time. Write a struct holding borrowed string slices with explicit lifetime annotations.',
      taskType: 'CODE_REVIEW',
      expectedConcepts: ['ownership', 'borrow checker', 'lifetimes', 'mutable aliasing', 'data race', 'arc/mutex'],
      socraticQuestions: [
        {
          question: 'What core invariant does the Rust borrow checker enforce regarding mutable references?',
          acceptableKeyterms: ['aliasing xor mutability', 'single mutable', 'multiple immutable', 'data race', 'exclusive'],
          rubricHint: 'Either one mutable reference OR multiple immutable references, never both concurrently.'
        }
      ]
    }
  ]
};

/**
 * STAGE 1/4: Generates appropriate Socratic practical challenges for candidate-claimed skills.
 */
export function getChallengesForSkill(skillName: string): PracticalChallenge[] {
  console.log(`\n🎯 [STAGE 1/4 - Quest Generator]: Fetching challenges for skill "${skillName}"...`);
  const canonical = Object.keys(PRACTICAL_CHALLENGE_REGISTRY).find(
    k => k.toLowerCase() === skillName.toLowerCase()
  );

  if (canonical && PRACTICAL_CHALLENGE_REGISTRY[canonical]) {
    const list = PRACTICAL_CHALLENGE_REGISTRY[canonical];
    console.log(`✅ [STAGE 1/4 - Quests Found]: Found ${list.length} practical challenge(s) for "${canonical}".`);
    return list;
  }

  // Fallback: Universal software engineering challenge for uncatalogued technical skills
  console.log(`🔍 [STAGE 1/4 - Fallback Generator]: Creating dynamic challenge for "${skillName}"...`);
  return [
    {
      id: `generic_${skillName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      skillName,
      category: 'programming',
      title: `${skillName} Production Reliability & Architecture Defense`,
      scenario: `Demonstrate your practical competency in ${skillName}. Explain how you handle error boundaries, concurrency, and performance tuning when deploying ${skillName} in production.`,
      taskType: 'CODE_REVIEW',
      expectedConcepts: ['error handling', 'performance', 'scalability', 'production', 'testing'],
      socraticQuestions: [
        {
          question: `What is the most critical production failure mode you have encountered or mitigated when working with ${skillName}, and how did you resolve it?`,
          acceptableKeyterms: ['latency', 'memory', 'concurrency', 'error', 'exception', 'test', 'cache', 'timeout'],
          rubricHint: 'Must describe a concrete architectural or operational mitigation strategy.'
        }
      ]
    }
  ];
}

/**
 * Strips single-line and multi-line comments and string literals to prevent
 * candidates from gaming concept matching via comment dumps.
 */
export function stripCodeCommentsAndStrings(code: string): string {
  if (!code) return '';
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(?:\/\/|#).*$/gm, '')
    .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, '');
}

/**
 * Validates basic syntactic integrity and delimiter balance.
 */
export function validateCodeStructure(code: string): { isValid: boolean; reason?: string } {
  const stripped = stripCodeCommentsAndStrings(code).trim();
  if (stripped.length < 15) {
    return { isValid: false, reason: 'Submission contains no functional, executable code.' };
  }
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const ch of stripped) {
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else if (ch === ')' || ch === '}' || ch === ']') {
      if (stack.pop() !== pairs[ch]) {
        return { isValid: false, reason: 'Syntax error: unbalanced delimiters.' };
      }
    }
  }
  if (stack.length > 0) {
    return { isValid: false, reason: 'Syntax error: unclosed delimiters.' };
  }
  return { isValid: true };
}

/**
 * STAGE 2/4 & 3/4: Evaluates candidate submission and transitions capability lifecycle.
 */
export function evaluateVerificationSubmission(
  challenge: PracticalChallenge,
  submission: VerificationSubmission
): VerificationEvaluation {
  console.log(`\n🔬 [STAGE 2/4 - Submission Evaluator]: Evaluating challenge "${challenge.id}" for skill "${challenge.skillName}"...`);
  let earnedScore = 0;
  const conceptBreakdown: { concept: string; mastered: boolean }[] = [];

  // 1. Evaluate Socratic Answers (Defect 093: Enforce min 80 chars, >= 2 domain terms, and reasoning keywords)
  let socraticPassedCount = 0;
  const totalQuestions = challenge.socraticQuestions.length;
  const reasoningMarkers = [
    'because', 'mitigate', 'implemented', 'reduced', 'prevented',
    'tradeoff', 'trade-off', 'resolved', 'handling', 'ensured',
    'configured', 'designed', 'optimized', 'overhead', 'latency', 'throughput'
  ];

  challenge.socraticQuestions.forEach((q, idx) => {
    const candidateAns = submission.socraticAnswers.find(a => a.questionIndex === idx)?.answerText?.toLowerCase() || '';
    const matchedTerms = q.acceptableKeyterms.filter(term => candidateAns.includes(term.toLowerCase()));
    const hasReasoning = reasoningMarkers.some(marker => candidateAns.includes(marker));
    const requiredTerms = Math.min(2, q.acceptableKeyterms.length);

    // Strict validation: min 80 chars + >= 2 distinct terms + technical reasoning
    const isQualityAnswer = candidateAns.length >= 80 && matchedTerms.length >= requiredTerms && hasReasoning;
    if (isQualityAnswer) {
      socraticPassedCount++;
    }
  });

  const socraticScorePct = totalQuestions > 0 ? (socraticPassedCount / totalQuestions) * 100 : 80;

  // 2. Evaluate Code Submission (Defect 092: Strip comments & strings, require syntactic validity)
  let codeScorePct = 100;
  if (challenge.taskType === 'CODE_FIX' || challenge.taskType === 'IMPLEMENTATION') {
    const rawCode = submission.candidateCode || '';
    const codeSyntax = validateCodeStructure(rawCode);
    const cleanCode = stripCodeCommentsAndStrings(rawCode);

    if (!codeSyntax.isValid || cleanCode.length === 0) {
      codeScorePct = 0;
      challenge.expectedConcepts.forEach(c => {
        conceptBreakdown.push({ concept: c, mastered: false });
      });
    } else {
      const CONCEPT_SYNONYMS: Record<string, string[]> = {
        'generator': ['generator', 'yield', '__iter__', '__next__'],
        'yield': ['yield'],
        'lazy evaluation': ['yield', 'lazy', 'generator', 'next('],
        'o(1) memory': ['yield', 'o(1)', 'constant memory', 'stream', 'chunk'],
        'context manager': ['with ', 'contextmanager', '__enter__', '__exit__'],
        'discriminated union': ['type', 'interface', 'switch', 'kind', 'status'],
        'exhaustive check': ['never', 'assertnever', 'default:'],
      };

      const isConceptMatched = (c: string) => {
        const lowerC = c.toLowerCase();
        if (cleanCode.toLowerCase().includes(lowerC)) return true;
        const syns = CONCEPT_SYNONYMS[lowerC];
        return syns ? syns.some(s => cleanCode.toLowerCase().includes(s)) : false;
      };

      const matchedConcepts = challenge.expectedConcepts.filter(isConceptMatched);
      codeScorePct = challenge.expectedConcepts.length > 0
        ? (matchedConcepts.length / challenge.expectedConcepts.length) * 100
        : 80;

      challenge.expectedConcepts.forEach(c => {
        conceptBreakdown.push({
          concept: c,
          mastered: isConceptMatched(c)
        });
      });
    }
  }

  // Composite Evaluation Score
  earnedScore = Math.round(socraticScorePct * 0.6 + codeScorePct * 0.4);
  const passed = earnedScore >= 60;

  // STAGE 3/4: Capability Lifecycle Transition (Defect 094: Unregistered fallback skills require portfolio review)
  let newStatus: CapabilityStatus = 'CLAIMED';
  const isUnregistered = challenge.id.startsWith('generic_');

  if (earnedScore >= 85) {
    newStatus = isUnregistered ? 'DEMONSTRATED' : 'VERIFIED_COMPETENCY';
  } else if (earnedScore >= 60) {
    newStatus = 'DEMONSTRATED';
  }

  console.log(`📊 [STAGE 3/4 - Evaluation Result]: Score = ${earnedScore}/100 | Passed = ${passed} | New Status = "${newStatus}"`);

  let feedback = passed
    ? `✓ Successfully demonstrated practical competency in ${challenge.skillName}. Score: ${earnedScore}/100.`
    : `Submission did not meet required passing threshold (Scored ${earnedScore}/100, needed 60/100). Review core concepts and retry.`;

  if (isUnregistered && passed) {
    feedback += ' Note: Unregistered skills earn DEMONSTRATED status. Connect verified GitHub commits or faculty review for VERIFIED_COMPETENCY.';
  }

  return {
    passed,
    score: earnedScore,
    newCapabilityStatus: newStatus,
    feedback,
    conceptBreakdown,
    earnedCompetencyBadge: passed ? `${challenge.skillName} Practical Master` : undefined,
    evaluatedAt: Date.now()
  };
}

/**
 * STAGE 4/4: Recalibrates QT1 Capability based on newly demonstrated competencies.
 */
export function calculateProgressiveQT1(
  verifiedCompetenciesCount: number,
  verifiedProjectsCount: number,
  assessmentAveragePct: number
): { qt1Score: number; breakdown: { competencies: number; projects: number; assessments: number } } {
  console.log(`\n🎯 [STAGE 4/4 - QT1 Recalibration]: Recomputing QT1 with ${verifiedCompetenciesCount} verified competencies, ${verifiedProjectsCount} verified projects, and ${assessmentAveragePct}% assessment avg...`);

  // Formulation: 55% Competencies + 25% Projects + 20% Assessments
  const competencyPoints = Math.min(55, verifiedCompetenciesCount * 11.0); // 5 competencies maxes out 55 pts
  const projectPoints = Math.min(25, verifiedProjectsCount * 12.5); // 2 projects maxes out 25 pts
  const assessmentPoints = Math.min(20, Math.round((assessmentAveragePct / 100) * 20));

  const totalQT1 = Math.min(100, Math.round(competencyPoints + projectPoints + assessmentPoints));
  console.log(`✅ [STAGE 4/4 - Recalibrated QT1]: Total = ${totalQT1}/100 (Competencies: ${competencyPoints}, Projects: ${projectPoints}, Assessments: ${assessmentPoints})`);

  return {
    qt1Score: totalQT1,
    breakdown: {
      competencies: competencyPoints,
      projects: projectPoints,
      assessments: assessmentPoints
    }
  };
}
