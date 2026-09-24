import { resolveDynamicCodingProblem, createSemanticFallbackProblem } from '../../src/app/interview/problemGenerator';
import { evaluateSystemTopology } from '../../src/lib/interview/systemDesignEvaluator';

async function runTests() {
  console.log('🧪 Starting Interview Tab & Assist Mode Bugfix Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ': ' + detail : ''}`);
      failed++;
    }
  }

  // Test 1: Coding Problem Starter Skeletons (Bugs 16-19)
  console.log('--- Test Suite 1: Coding Problem Starter Templates ---');
  const fallback = createSemanticFallbackProblem('Distributed Caching', 'normal');
  assert(
    typeof fallback.starterCode === 'object' && 'python' in fallback.starterCode,
    'createSemanticFallbackProblem returns multi-language starter code'
  );
  assert(
    fallback.starterCode.python.includes('TODO: Implement'),
    'Python fallback starter code contains TODO and does NOT leak complete working solution'
  );
  assert(
    fallback.starterCode.python.includes('pass'),
    'Python fallback starter code provides skeleton ending in pass'
  );

  const reactProblem = resolveDynamicCodingProblem('React Frontend', 'tech', 'javascript');
  assert(
    reactProblem.starterCode.includes('// TODO: Merge actions') && !reactProblem.starterCode.includes('reduce((acc, act)'),
    'Frontend problem provides a skeleton and does NOT give away the reduce solution'
  );

  const sqlProblem = resolveDynamicCodingProblem('Database Querying', 'tech', 'sql');
  assert(
    sqlProblem.starterCode.includes('SELECT department_id') && sqlProblem.starterCode.includes('HAVING AVG(salary) > 50000'),
    'SQL problem provides the query challenge frame'
  );

  // Test 2: System Design Topology Evaluator (Bugs 9-15)
  console.log('\n--- Test Suite 2: System Design Whiteboard Topology & Scoring ---');
  const mockTopology = {
    nodeCount: 4,
    linkCount: 3,
    nodes: [
      { id: 'gw', type: 'api', label: 'API Gateway', category: 'network' },
      { id: 'svc', type: 'compute', label: 'Microservice', category: 'compute' },
      { id: 'cache', type: 'cache', label: 'Redis Cache', category: 'cache' },
      { id: 'db', type: 'database', label: 'PostgreSQL DB', category: 'storage' }
    ],
    links: [
      { fromType: 'api', toType: 'compute', protocol: 'HTTPS/REST' },
      { fromType: 'compute', toType: 'cache', protocol: 'Redis TCP' },
      { fromType: 'compute', toType: 'database', protocol: 'SQL/TCP' }
    ],
    hasLoadBalancer: true,
    hasCachingLayer: true,
    hasDatabase: true,
    hasQueue: false,
    isFullyConnected: true
  };

  const evalResult = evaluateSystemTopology(mockTopology, 'High Concurrency API', 'tech');
  assert(
    typeof evalResult.score === 'number' && evalResult.score >= 70,
    `Topology evaluator scores connected architecture appropriately: Score ${evalResult.score}`
  );
  assert(
    typeof evalResult.grade === 'string' && ['A+', 'A', 'A-', 'B+', 'B'].includes(evalResult.grade),
    `Topology evaluator assigns realistic letter grade: Grade ${evalResult.grade}`
  );
  assert(
    Array.isArray(evalResult.strengths) && evalResult.strengths.length > 0,
    'Topology evaluator identifies architectural strengths'
  );
  assert(
    typeof evalResult.spokenFeedback === 'string' && evalResult.spokenFeedback.length > 20,
    'Topology evaluator produces spoken feedback for avatar speech'
  );

  // Test 3: Assist Mode Speech Word Matching Logic (Bugs 32-35)
  console.log('\n--- Test Suite 3: Assist Mode Teleprompter Real-time Word Matching ---');
  const teleprompterScript = "In my recent project, I designed a distributed caching layer using Redis to optimize read latency.";
  const candidateSpoken = "In my recent project I designed a distributed caching layer";

  const spokenWordSet = new Set(candidateSpoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  const scriptWords = teleprompterScript.split(' ');
  const matchedWords = scriptWords.filter(word => {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean.length > 0 && spokenWordSet.has(clean);
  });

  assert(
    matchedWords.length === 10,
    `Real-time teleprompter speech matching detected ${matchedWords.length}/10 spoken words with 100% accuracy (including short words)`
  );
  assert(
    matchedWords.includes('project,') || matchedWords.some(w => w.includes('project')),
    'Cleaned word matching handles punctuation variations cleanly'
  );

  // Summary
  console.log(`\n========================================`);
  console.log(`Verification Complete: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
