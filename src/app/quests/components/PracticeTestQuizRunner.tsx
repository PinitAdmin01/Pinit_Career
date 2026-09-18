'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────
export type TrackType = 'web_fullstack' | 'python_ai';
export type PlanTier = '1m' | '3m' | '6m' | '9m';

export interface PracticeTestResult {
  score: number;
  totalQuestions: number;
  accuracyPercent: number;
  timeTakenSeconds: number;
  topicBreakdown: Record<string, { correct: number; total: number }>;
  skillGaps: string[];
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  codeSnippet?: string;
  options: Option[];
}

// ─────────────────────────────────────────────────────────────────────
// Question Bank
// ─────────────────────────────────────────────────────────────────────
function getQuestions(track: TrackType): Question[] {
  const webQuestions: Question[] = [
    {
      id: 'w1', topic: 'React', difficulty: 'medium',
      question: 'Which React hook is used to memoize a computed value and prevent unnecessary recalculations on every render?',
      codeSnippet: `const memoizedValue = useMemo(() => {\n  return expensiveCalculation(data);\n}, [data]);`,
      options: [
        { id: 'w1a', text: 'useCallback', isCorrect: false },
        { id: 'w1b', text: 'useMemo', isCorrect: true },
        { id: 'w1c', text: 'useReducer', isCorrect: false },
        { id: 'w1d', text: 'useRef', isCorrect: false },
      ],
    },
    {
      id: 'w2', topic: 'Next.js', difficulty: 'hard',
      question: 'In the App Router, which file convention enables Server-Side Rendering for a specific route segment?',
      codeSnippet: `// app/dashboard/page.tsx\nexport const dynamic = 'force-dynamic';\nexport default async function Page() {\n  const data = await fetchData();\n  return <Dashboard data={data} />;\n}`,
      options: [
        { id: 'w2a', text: 'Adding "use client" directive', isCorrect: false },
        { id: 'w2b', text: 'Using server.js middleware', isCorrect: false },
        { id: 'w2c', text: 'Default Server Component (no "use client")', isCorrect: true },
        { id: 'w2d', text: 'Creating a getServerSideProps export', isCorrect: false },
      ],
    },
    {
      id: 'w3', topic: 'Node.js', difficulty: 'medium',
      question: 'What is the primary purpose of the Node.js event loop?',
      codeSnippet: `setTimeout(() => {\n  console.log('Timer fired');\n}, 0);\nPromise.resolve().then(() => {\n  console.log('Microtask');\n});`,
      options: [
        { id: 'w3a', text: 'To execute all code synchronously in order', isCorrect: false },
        { id: 'w3b', text: 'To handle asynchronous operations without blocking the main thread', isCorrect: true },
        { id: 'w3c', text: 'To manage memory allocation and garbage collection', isCorrect: false },
        { id: 'w3d', text: 'To compile JavaScript to machine code', isCorrect: false },
      ],
    },
    {
      id: 'w4', topic: 'SQL', difficulty: 'medium',
      question: 'Which SQL index type is most efficient for range queries on a sorted column?',
      codeSnippet: `CREATE INDEX idx_created_at\nON orders (created_at);\n-- Optimal for: WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'`,
      options: [
        { id: 'w4a', text: 'HASH index', isCorrect: false },
        { id: 'w4b', text: 'FULLTEXT index', isCorrect: false },
        { id: 'w4c', text: 'B-Tree index', isCorrect: true },
        { id: 'w4d', text: 'GIN index', isCorrect: false },
      ],
    },
    {
      id: 'w5', topic: 'React', difficulty: 'easy',
      question: 'What does JSX stand for?',
      options: [
        { id: 'w5a', text: 'JavaScript XML', isCorrect: true },
        { id: 'w5b', text: 'JavaScript XHTML', isCorrect: false },
        { id: 'w5c', text: 'Java Syntax Extension', isCorrect: false },
        { id: 'w5d', text: 'JSON XML', isCorrect: false },
      ],
    },
    {
      id: 'w6', topic: 'Next.js', difficulty: 'medium',
      question: 'Which Next.js feature automatically splits your bundle into smaller chunks for optimal loading?',
      options: [
        { id: 'w6a', text: 'Automatic Code Splitting', isCorrect: true },
        { id: 'w6b', text: 'Server Components', isCorrect: false },
        { id: 'w6c', text: 'Incremental Static Regeneration', isCorrect: false },
        { id: 'w6d', text: 'Middleware Proxy', isCorrect: false },
      ],
    },
    {
      id: 'w7', topic: 'Node.js', difficulty: 'hard',
      question: 'What is the difference between process.nextTick() and setImmediate() in Node.js?',
      codeSnippet: `process.nextTick(() => console.log('nextTick'));\nsetImmediate(() => console.log('setImmediate'));\n// nextTick executes before any I/O events`,
      options: [
        { id: 'w7a', text: 'They are identical in behavior', isCorrect: false },
        { id: 'w7b', text: 'nextTick runs before I/O; setImmediate runs after I/O phase', isCorrect: true },
        { id: 'w7c', text: 'setImmediate runs before nextTick', isCorrect: false },
        { id: 'w7d', text: 'Both run after the event loop completes', isCorrect: false },
      ],
    },
    {
      id: 'w8', topic: 'SQL', difficulty: 'medium',
      question: 'Which SQL clause is used to filter groups after aggregation?',
      codeSnippet: `SELECT department, COUNT(*) as emp_count\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5;`,
      options: [
        { id: 'w8a', text: 'WHERE', isCorrect: false },
        { id: 'w8b', text: 'HAVING', isCorrect: true },
        { id: 'w8c', text: 'GROUP BY', isCorrect: false },
        { id: 'w8d', text: 'ORDER BY', isCorrect: false },
      ],
    },
    {
      id: 'w9', topic: 'React', difficulty: 'medium',
      question: 'In React, what is the purpose of the `key` prop when rendering a list of elements?',
      codeSnippet: `{items.map(item => (\n  <li key={item.id}>{item.name}</li>\n))}`,
      options: [
        { id: 'w9a', text: 'To apply CSS styling to each item', isCorrect: false },
        { id: 'w9b', text: 'To help React identify which items changed, added, or removed', isCorrect: true },
        { id: 'w9c', text: 'To make items clickable', isCorrect: false },
        { id: 'w9d', text: 'To add animation transitions', isCorrect: false },
      ],
    },
    {
      id: 'w10', topic: 'Next.js', difficulty: 'hard',
      question: 'Which Next.js App Router file enables a route segment to stream data progressively using Suspense?',
      codeSnippet: `// app/layout.tsx\nexport const dynamic = 'force-dynamic';\n\nexport default function RootLayout({ children }) {\n  return (\n    <Suspense fallback={<Loading />}>\n      {children}\n    </Suspense>\n  );\n}`,
      options: [
        { id: 'w10a', text: 'layout.tsx with a Suspense boundary', isCorrect: true },
        { id: 'w10b', text: 'page.tsx with use client directive', isCorrect: false },
        { id: 'w10c', text: 'middleware.ts with streaming config', isCorrect: false },
        { id: 'w10d', text: 'route.js with a fetch cache setting', isCorrect: false },
      ],
    },
    {
      id: 'w11', topic: 'Node.js', difficulty: 'easy',
      question: 'What does npm stand for?',
      options: [
        { id: 'w11a', text: 'Node Package Manager', isCorrect: true },
        { id: 'w11b', text: 'Network Protocol Module', isCorrect: false },
        { id: 'w11c', text: 'Node Process Monitor', isCorrect: false },
        { id: 'w11d', text: 'Node Performance Metric', isCorrect: false },
      ],
    },
    {
      id: 'w12', topic: 'SQL', difficulty: 'hard',
      question: 'In a relational database, what is a "deadlock"?',
      options: [
        { id: 'w12a', text: 'When a database server crashes', isCorrect: false },
        { id: 'w12b', text: 'When two or more transactions wait indefinitely for each other to release locks', isCorrect: true },
        { id: 'w12c', text: 'When an index becomes corrupted', isCorrect: false },
        { id: 'w12d', text: 'When a table has no primary key', isCorrect: false },
      ],
    },
  ];

  const pythonQuestions: Question[] = [
    {
      id: 'p1', topic: 'AsyncIO', difficulty: 'medium',
      question: 'What is the purpose of the `asyncio` library in Python?',
      codeSnippet: `import asyncio\n\nasync def fetch_data():\n    await asyncio.sleep(1)\n    return {"data": 42}\n\nasync def main():\n    result = await fetch_data()\n    print(result)`,
      options: [
        { id: 'p1a', text: 'To handle synchronous blocking I/O operations', isCorrect: false },
        { id: 'p1b', text: 'To write concurrent code using the async/await syntax', isCorrect: true },
        { id: 'p1c', text: 'To compile Python to C extensions', isCorrect: false },
        { id: 'p1d', text: 'To manage database migrations', isCorrect: false },
      ],
    },
    {
      id: 'p2', topic: 'FastAPI', difficulty: 'medium',
      question: 'In FastAPI, what decorator is used to define a GET endpoint?',
      codeSnippet: `from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/items/{item_id}")\nasync def read_item(item_id: int):\n    return {"item_id": item_id}`,
      options: [
        { id: 'p2a', text: '@app.route', isCorrect: false },
        { id: 'p2b', text: '@app.get', isCorrect: true },
        { id: 'p2c', text: '@get.route', isCorrect: false },
        { id: 'p2d', text: '@api.get', isCorrect: false },
      ],
    },
    {
      id: 'p3', topic: 'DSA', difficulty: 'hard',
      question: 'What is the time complexity of binary search on a sorted array of n elements?',
      codeSnippet: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
      options: [
        { id: 'p3a', text: 'O(n)', isCorrect: false },
        { id: 'p3b', text: 'O(n log n)', isCorrect: false },
        { id: 'p3c', text: 'O(log n)', isCorrect: true },
        { id: 'p3d', text: 'O(1)', isCorrect: false },
      ],
    },
    {
      id: 'p4', topic: 'FastAPI', difficulty: 'medium',
      question: 'Which FastAPI dependency injection mechanism allows you to share database sessions across endpoints?',
      codeSnippet: `from fastapi import Depends, SQLiteDep\n\ndef get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\n@app.get("/items")\nasync def read_items(db: Session = Depends(get_db)):\n    return db.query(Item).all()`,
      options: [
        { id: 'p4a', text: 'Using `yield` in a generator function with `Depends`', isCorrect: true },
        { id: 'p4b', text: 'Creating a global variable for the database', isCorrect: false },
        { id: 'p4c', text: 'Using `@app.on_event("startup")`', isCorrect: false },
        { id: 'p4d', text: 'Passing `db` as a query parameter', isCorrect: false },
      ],
    },
    {
      id: 'p5', topic: 'DSA', difficulty: 'easy',
      question: 'What data structure uses FIFO (First In, First Out) ordering?',
      options: [
        { id: 'p5a', text: 'Stack', isCorrect: false },
        { id: 'p5b', text: 'Queue', isCorrect: true },
        { id: 'p5c', text: 'Binary Tree', isCorrect: false },
        { id: 'p5d', text: 'Hash Map', isCorrect: false },
      ],
    },
    {
      id: 'p6', topic: 'AsyncIO', difficulty: 'hard',
      question: 'What is the difference between `asyncio.gather()` and `asyncio.wait()`?',
      codeSnippet: `async def task1(): await asyncio.sleep(1)\nasync def task2(): await asyncio.sleep(2)\n\n# gather waits for all and returns results in order\nresults = await asyncio.gather(task1(), task2())\n# wait returns (done, pending) sets`,
      options: [
        { id: 'p6a', text: 'They are identical', isCorrect: false },
        { id: 'p6b', text: 'gather returns results; wait returns (done, pending) sets', isCorrect: true },
        { id: 'p6c', text: 'wait returns results; gather raises exceptions', isCorrect: false },
        { id: 'p6d', text: 'gather runs sequentially; wait runs concurrently', isCorrect: false },
      ],
    },
    {
      id: 'p7', topic: 'DB', difficulty: 'medium',
      question: 'What does ACID stand for in database transactions?',
      options: [
        { id: 'p7a', text: 'Atomicity, Consistency, Isolation, Durability', isCorrect: true },
        { id: 'p7b', text: 'Access, Concurrency, Integrity, Dependency', isCorrect: false },
        { id: 'p7c', text: 'Array, Cache, Index, Data', isCorrect: false },
        { id: 'p7d', text: 'Aggregation, Calculation, Iteration, Distribution', isCorrect: false },
      ],
    },
    {
      id: 'p8', topic: 'DSA', difficulty: 'medium',
      question: 'Which sorting algorithm has an average-case time complexity of O(n log n) and is not stable?',
      codeSnippet: `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)`,
      options: [
        { id: 'p8a', text: 'Merge Sort', isCorrect: false },
        { id: 'p8b', text: 'Quick Sort', isCorrect: true },
        { id: 'p8c', text: 'Bubble Sort', isCorrect: false },
        { id: 'p8d', text: 'Counting Sort', isCorrect: false },
      ],
    },
    {
      id: 'p9', topic: 'FastAPI', difficulty: 'easy',
      question: 'What type annotation does FastAPI use to automatically validate request parameters?',
      codeSnippet: `from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/users/{user_id}")\nasync def get_user(user_id: int):\n    return {"user_id": user_id}`,
      options: [
        { id: 'p9a', text: 'Using `type()` function', isCorrect: false },
        { id: 'p9b', text: 'Python type hints (e.g., `user_id: int`)', isCorrect: true },
        { id: 'p9c', text: 'Using `@validate` decorator', isCorrect: false },
        { id: 'p9d', text: 'Adding a schema attribute', isCorrect: false },
      ],
    },
    {
      id: 'p10', topic: 'AsyncIO', difficulty: 'medium',
      question: 'What is the purpose of `asyncio.create_task()`?',
      options: [
        { id: 'p10a', text: 'To create a new thread', isCorrect: false },
        { id: 'p10b', text: 'To schedule a coroutine concurrently on the event loop', isCorrect: true },
        { id: 'p10c', text: 'To create a multiprocessing pool', isCorrect: false },
        { id: 'p10d', text: 'To block the event loop until completion', isCorrect: false },
      ],
    },
    {
      id: 'p11', topic: 'DB', difficulty: 'easy',
      question: 'Which Python library is commonly used to interact with PostgreSQL databases?',
      options: [
        { id: 'p11a', text: 'pymongo', isCorrect: false },
        { id: 'p11b', text: 'psycopg2', isCorrect: true },
        { id: 'p11c', text: 'redis-py', isCorrect: false },
        { id: 'p11d', text: 'sqlite3-async', isCorrect: false },
      ],
    },
    {
      id: 'p12', topic: 'DSA', difficulty: 'hard',
      question: 'In Big-O notation, what does O(2^n) represent?',
      options: [
        { id: 'p12a', text: 'Constant time', isCorrect: false },
        { id: 'p12b', text: 'Linear time', isCorrect: false },
        { id: 'p12c', text: 'Quadratic time', isCorrect: false },
        { id: 'p12d', text: 'Exponential time', isCorrect: true },
      ],
    },
  ];

  return track === 'web_fullstack' ? webQuestions : pythonQuestions;
}

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────
interface PracticeTestQuizRunnerProps {
  testTitle: string;
  track: TrackType;
  planTier: PlanTier;
  onClose: () => void;
  onCompleteTest: (result: PracticeTestResult) => void;
}

export default function PracticeTestQuizRunner({
  testTitle,
  track,
  planTier,
  onClose,
  onCompleteTest,
}: PracticeTestQuizRunnerProps) {
  const questions = useMemo(() => getQuestions(track), [track]);
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Countdown timer (20 minutes)
  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleAutoSubmit = useCallback(() => {
    setSubmitted(true);
    setShowResults(true);
  }, []);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id] ?? null;

  // Topic breakdown
  const topicBreakdown = useMemo(() => {
    const breakdown: Record<string, { correct: number; total: number }> = {};
    questions.forEach(q => {
      if (!breakdown[q.topic]) breakdown[q.topic] = { correct: 0, total: 0 };
      breakdown[q.topic].total += 1;
      if (answers[q.id] && q.options.find(o => o.id === answers[q.id])?.isCorrect) {
        breakdown[q.topic].correct += 1;
      }
    });
    return breakdown;
  }, [answers, questions]);

  // Score calculation
  const score = useMemo(() => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] && q.options.find(o => o.id === answers[q.id])?.isCorrect) {
        correct += 1;
      }
    });
    return correct;
  }, [answers, questions]);

  const accuracyPercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const timeTakenSeconds = (20 * 60) - timeLeft;

  // Skill gaps detection
  const skillGaps = useMemo(() => {
    const gaps: string[] = [];
    Object.entries(topicBreakdown).forEach(([topic, data]) => {
      if (data.total > 0 && data.correct / data.total < 0.5) {
        gaps.push(`${topic} (${data.correct}/${data.total})`);
      }
    });
    return gaps.length > 0 ? gaps : ['None detected — excellent performance!'];
  }, [topicBreakdown]);

  // Handle answer selection
  const handleAnswer = (optionId: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  // Navigation
  const goNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(prev => prev + 1);
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };
  const goToQuestion = (idx: number) => {
    if (!submitted && idx >= 0 && idx < totalQuestions) setCurrentIndex(idx);
  };

  // Submit
  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
    const result: PracticeTestResult = {
      score,
      totalQuestions,
      accuracyPercent,
      timeTakenSeconds,
      topicBreakdown,
      skillGaps,
    };
    onCompleteTest(result);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 24,
      }} aria-modal="true" role="dialog" aria-label="Test Results">
        <div style={{
          maxWidth: 640, width: '100%',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 20, overflow: 'hidden', padding: 32,
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', marginBottom: 24, textAlign: 'center' }}>
            📊 Test Complete — Results
          </h2>

          {/* Score Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Score', value: `${score}/${totalQuestions}`, color: '#10b981' },
              { label: 'Accuracy', value: `${accuracyPercent}%`, color: '#6366f1' },
              { label: 'Time Taken', value: formatTime(timeTakenSeconds), color: '#f59e0b' },
              { label: 'Tier', value: planTier.toUpperCase(), color: '#38bdf8' },
            ].map(card => (
              <div key={card.label} style={{
                padding: 16, borderRadius: 12, background: 'var(--bg3)',
                border: '1px solid var(--border)', textAlign: 'center',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>{card.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: card.color, fontFamily: 'var(--font-display)' }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Topic Breakdown */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>Topic Breakdown</h3>
            {Object.entries(topicBreakdown).map(([topic, data]) => (
              <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', width: 100 }}>{topic}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--bg3)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${data.total > 0 ? (data.correct / data.total) * 100 : 0}%`,
                    height: '100%', borderRadius: 4,
                    background: data.correct / data.total >= 0.7 ? '#10b981' : data.correct / data.total >= 0.4 ? '#f59e0b' : '#ef4444',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', width: 60, textAlign: 'right' }}>
                  {data.correct}/{data.total}
                </span>
              </div>
            ))}
          </div>

          {/* Skill Gaps */}
          <div style={{ marginBottom: 24, padding: 14, borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b', marginBottom: 6 }}>🔍 Detected Skill Gaps</h3>
            {skillGaps.map((gap, i) => (
              <div key={i} style={{ fontSize: 12.5, color: 'var(--t2)', marginBottom: 2 }}>• {gap}</div>
            ))}
          </div>

          <button onClick={onClose} style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: '#fff', fontSize: 14, fontWeight: 800,
            cursor: 'pointer', fontFamily: 'var(--font-display)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
          }}>
            Close Results
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 24,
    }} aria-modal="true" role="dialog" aria-label={testTitle}>
      <div style={{
        maxWidth: 760, width: '100%',
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        maxHeight: '90vh',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--bg3)', flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>{testTitle}</h2>
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>
              {track === 'web_fullstack' ? '🌐 Web Fullstack' : '🐍 Python & AI'} • {planTier.toUpperCase()} Plan • Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Time Remaining</div>
              <div style={{
                fontSize: 20, fontWeight: 900,
                color: timeLeft < 120 ? '#ef4444' : '#10b981',
                fontFamily: 'var(--font-display)',
              }}>{formatTime(timeLeft)}</div>
            </div>
            <button onClick={onClose} style={{
              padding: '6px 12px', borderRadius: 8,
              background: 'var(--bg3)', border: '1px solid var(--border)',
              color: 'var(--t2)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }} aria-label="Close test">✕</button>
          </div>
        </div>

        {/* Top Progress Bar */}
        <div style={{ height: 4, background: 'var(--bg3)', flexShrink: 0 }}>
          <div style={{
            height: '100%', width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Question Card */}
          <div style={{
            padding: 20, borderRadius: 14, background: 'var(--bg3)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                padding: '3px 8px', borderRadius: 6,
                background: currentQuestion.difficulty === 'easy' ? 'rgba(16,185,129,0.12)' :
                  currentQuestion.difficulty === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                color: currentQuestion.difficulty === 'easy' ? '#10b981' :
                  currentQuestion.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
              }}>{currentQuestion.difficulty}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{currentQuestion.topic}</span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 14, lineHeight: 1.5 }}>{currentQuestion.question}</h3>

            {/* Code Snippet */}
            {currentQuestion.codeSnippet && (
              <div style={{
                marginBottom: 14, padding: 12, borderRadius: 10,
                background: '#0a0e17', border: '1px solid rgba(99,102,241,0.15)',
                overflow: 'auto',
              }}>
                <pre style={{
                  margin: 0, fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: 11.5, lineHeight: 1.6, color: '#94a3b8', whiteSpace: 'pre-wrap',
                }}>
                  <code>{currentQuestion.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentQuestion.options.map(opt => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                const isCorrect = opt.isCorrect;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id)}
                    disabled={submitted}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', borderRadius: 10,
                      border: isSelected
                        ? '1.5px solid var(--accent)'
                        : '1px solid var(--border)',
                      background: isSelected
                        ? 'rgba(99,102,241,0.12)'
                        : 'transparent',
                      color: 'var(--t1)', fontSize: 13.5, fontWeight: 600,
                      cursor: submitted ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all 0.15s ease',
                      opacity: submitted && !isCorrect ? 0.5 : 1,
                      fontFamily: 'inherit',
                    }}
                    aria-label={opt.text}
                  >
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isSelected ? 'var(--accent)' : 'var(--bg3)',
                      color: isSelected ? '#fff' : 'var(--t3)',
                      fontSize: 12, fontWeight: 800,
                      border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    }}>
                      {String.fromCharCode(65 + currentQuestion.options.indexOf(opt))}
                    </span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Navigation Pills */}
          <div style={{
            padding: 14, borderRadius: 12, background: 'var(--bg3)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 10 }}>
              Question Navigation ({answeredCount}/{totalQuestions} answered)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    aria-label={`Question ${idx + 1}${isAnswered ? ' answered' : ' unanswered'}`}
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      border: isCurrent ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: isCurrent ? 'rgba(99,102,241,0.2)' :
                        isAnswered ? 'rgba(16,185,129,0.15)' : 'var(--bg2)',
                      color: isCurrent ? 'var(--accent)' : isAnswered ? '#10b981' : 'var(--t3)',
                      fontSize: 11, fontWeight: 800, cursor: 'pointer',
                      fontFamily: 'var(--font-display)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--bg3)', flexShrink: 0,
        }}>
          <button
            onClick={goPrev} disabled={currentIndex === 0}
            style={{
              padding: '10px 20px', borderRadius: 10,
              background: currentIndex === 0 ? 'var(--bg2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', color: currentIndex === 0 ? 'var(--t4)' : '#fff',
              fontSize: 13, fontWeight: 800, cursor: currentIndex === 0 ? 'default' : 'pointer',
              fontFamily: 'var(--font-display)', opacity: currentIndex === 0 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>

          <span style={{ fontSize: 12, color: 'var(--t3)' }}>
            {answeredCount} of {totalQuestions} answered
          </span>

          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 24px', borderRadius: 10,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', color: '#fff', fontSize: 13, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'var(--font-display)',
                boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
              }}
            >
              Submit Test ✓
            </button>
          ) : (
            <button
              onClick={goNext}
              style={{
                padding: '10px 20px', borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', color: '#fff', fontSize: 13, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'var(--font-display)',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
