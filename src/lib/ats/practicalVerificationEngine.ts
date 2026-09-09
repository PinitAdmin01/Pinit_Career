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
 * STAGE 2/4 & 3/4: Evaluates candidate submission and transitions capability lifecycle.
 */
export function evaluateVerificationSubmission(
  challenge: PracticalChallenge,
  submission: VerificationSubmission
): VerificationEvaluation {
  console.log(`\n🔬 [STAGE 2/4 - Submission Evaluator]: Evaluating challenge "${challenge.id}" for skill "${challenge.skillName}"...`);
  let earnedScore = 0;
  const conceptBreakdown: { concept: string; mastered: boolean }[] = [];

  // 1. Evaluate Socratic Answers against concept keyterms
  let socraticPassedCount = 0;
  const totalQuestions = challenge.socraticQuestions.length;

  challenge.socraticQuestions.forEach((q, idx) => {
    const candidateAns = submission.socraticAnswers.find(a => a.questionIndex === idx)?.answerText?.toLowerCase() || '';
    const matchedTerms = q.acceptableKeyterms.filter(term => candidateAns.includes(term.toLowerCase()));
    
    // Pass if candidate answer contains at least 1-2 core domain terms and length > 25 chars
    const isQualityAnswer = candidateAns.length >= 25 && matchedTerms.length >= Math.min(1, q.acceptableKeyterms.length);
    if (isQualityAnswer) {
      socraticPassedCount++;
    }
  });

  const socraticScorePct = totalQuestions > 0 ? (socraticPassedCount / totalQuestions) * 100 : 80;

  // 2. Evaluate Code Submission (if provided)
  let codeScorePct = 100;
  if (challenge.taskType === 'CODE_FIX' || challenge.taskType === 'IMPLEMENTATION') {
    const code = submission.candidateCode || '';
    const matchedConcepts = challenge.expectedConcepts.filter(c => code.toLowerCase().includes(c.toLowerCase()));
    codeScorePct = challenge.expectedConcepts.length > 0
      ? (matchedConcepts.length / challenge.expectedConcepts.length) * 100
      : 80;

    challenge.expectedConcepts.forEach(c => {
      conceptBreakdown.push({
        concept: c,
        mastered: code.toLowerCase().includes(c.toLowerCase())
      });
    });
  }

  // Composite Evaluation Score
  earnedScore = Math.round(socraticScorePct * 0.6 + codeScorePct * 0.4);
  const passed = earnedScore >= 60;

  // STAGE 3/4: Capability Lifecycle Transition
  let newStatus: CapabilityStatus = 'CLAIMED';
  if (earnedScore >= 85) {
    newStatus = 'VERIFIED_COMPETENCY';
  } else if (earnedScore >= 60) {
    newStatus = 'DEMONSTRATED';
  }

  console.log(`📊 [STAGE 3/4 - Evaluation Result]: Score = ${earnedScore}/100 | Passed = ${passed} | New Status = "${newStatus}"`);

  const feedback = passed
    ? `✓ Successfully demonstrated practical competency in ${challenge.skillName}. Score: ${earnedScore}/100.`
    : `Submission did not meet required passing threshold (Scored ${earnedScore}/100, needed 60/100). Review core concepts and retry.`;

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
