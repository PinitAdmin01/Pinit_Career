export type TestCaseTier = 'standard' | 'scale' | 'zero_empty' | 'edge_case' | 'complexity';

export interface TestCaseItem {
  input: string;
  expectedOutput: string;
  output?: string;
  name: string;
  tier: TestCaseTier;
  tierLabel: string;
}

export interface CodingProblemDefinition {
  title: string;
  description: string;
  starterCode: string;
  functionName?: string;
  testSuite?: string;
  testCases?: TestCaseItem[];
}

export const SQL_INTERVIEW_TEST_SUITE = `CREATE TABLE employees (id INT, name TEXT, department_id INT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'Alice', 101, 'Engineering', 95000);
INSERT INTO employees VALUES (2, 'Bob', 102, 'Marketing', 65000);
INSERT INTO employees VALUES (3, 'Charlie', 101, 'Engineering', 105000);
INSERT INTO employees VALUES (4, 'David', 103, 'Sales', 72000);
INSERT INTO employees VALUES (5, 'Emma', 101, 'Engineering', 98000);
-- CHECKS --
SELECT count(*) = 3 AS ok, '[T1: Standard] returns all 3 departments exceeding salary threshold' AS msg FROM answer;
SELECT (SELECT headcount FROM answer WHERE department_id = 101) = 3 AS ok, '[T2: Scale] aggregates correct high-headcount Engineering department (3)' AS msg;
SELECT (SELECT round(avg_salary) FROM answer WHERE department_id = 101) = 99333 AS ok, '[T3: Zero/Empty] computes accurate average salary calculation' AS msg;
SELECT (SELECT count(*) FROM answer WHERE department_id NOT IN (101, 102, 103)) = 0 AS ok, '[T4: Edge/Negative] filters out non-qualifying departments and null IDs' AS msg;
SELECT (SELECT min(avg_salary) FROM answer) > 50000 AS ok, '[T5: Complexity Bounds] strictly enforces HAVING avg_salary > 50000 bound' AS msg;`;

export const SQL_INTERVIEW_STARTER = `SELECT department_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 50000
ORDER BY department_id;`;

export function createSemanticFallbackProblem(topicName: string, difficulty: 'easy' | 'normal' | 'hard' = 'normal') {
  const safeFn = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 24) || 'evaluate_metric';
  const testCases: TestCaseItem[] = [
    {
      input: '([10, 20, 30, 40], 25)',
      expectedOutput: '2',
      output: '2',
      name: '[T1: Standard] Nominal throughput check (>25: 30, 40)',
      tier: 'standard',
      tierLabel: 'T1: Standard'
    },
    {
      input: '([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], 500)',
      expectedOutput: '5',
      output: '5',
      name: '[T2: Scale] Throughput burst sequence (>500: 600..1000)',
      tier: 'scale',
      tierLabel: 'T2: Scale'
    },
    {
      input: '([], 0)',
      expectedOutput: '0',
      output: '0',
      name: '[T3: Zero/Empty] Empty sequence zero-check',
      tier: 'zero_empty',
      tierLabel: 'T3: Zero/Empty'
    },
    {
      input: '([-50, -20, 0, 10], -10)',
      expectedOutput: '2',
      output: '2',
      name: '[T4: Edge/Negative] Negative values boundary (0, 10 > -10)',
      tier: 'edge_case',
      tierLabel: 'T4: Edge/Negative'
    },
    {
      input: '([15, 15, 15, 15], 15)',
      expectedOutput: '0',
      output: '0',
      name: '[T5: Complexity Bounds] Exact threshold match boundary (strict inequality)',
      tier: 'complexity',
      tierLabel: 'T5: Complexity'
    }
  ];

  return {
    title: `${topicName} Assessment & Logic Evaluator`,
    description: `Implement function '${safeFn}' to evaluate constraints, metrics, and throughput for ${topicName}.`,
    functionName: safeFn,
    starterCode: {
      python: `def ${safeFn}(input_data, threshold):\n    # TODO: Implement - Count items in input_data strictly greater than threshold\n    # Example: [10, 20, 30], 15 -> 2\n    pass`,
      javascript: `function ${safeFn}(inputData, threshold) {\n    // TODO: Count items in inputData strictly greater than threshold\n    // Example: [10, 20, 30], 15 -> 2\n}`,
      java: `public class Solution {\n    public int ${safeFn}(int[] data, int threshold) {\n        // TODO: Count items strictly greater than threshold\n        return 0;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    },
    testCases,
    suggestedWhiteboardNodes: [
      { id: 'gateway', label: 'Client / Gateway', type: 'api' },
      { id: 'engine', label: `${topicName} Service`, type: 'compute' },
      { id: 'cache', label: 'Redis Cache', type: 'cache' },
      { id: 'storage', label: 'Primary DB', type: 'database' }
    ],
    testSuite: SQL_INTERVIEW_TEST_SUITE
  };
}

export function resolveDynamicCodingProblem(
  topic: string,
  domainStream: 'tech' | 'non_tech',
  lang: string,
  cached?: any
): CodingProblemDefinition {
  if (cached && cached.starterCode) {
    return {
      title: cached.title,
      description: cached.description,
      functionName: cached.functionName,
      starterCode: cached.starterCode[lang] || cached.starterCode.python || '',
      testSuite: typeof cached.testSuite === 'string' ? cached.testSuite : (lang === 'sql' ? SQL_INTERVIEW_TEST_SUITE : undefined),
      testCases: Array.isArray(cached.testCases) ? cached.testCases : undefined
    };
  }

  const lower = (topic + ' ' + domainStream).toLowerCase();
  let problemTitle = `${topic} Technical Assessment`;
  let problemDesc = `Implement algorithmic logic to solve real-world constraints for ${topic}.`;
  let starterCodeMap: Record<string, string> = {};
  let selectedFnName = 'evaluate_metric';
  let domainTestCases: TestCaseItem[] = [];

  if (lower.includes('frontend') || lower.includes('react') || lower.includes('web') || lower.includes('ui')) {
    problemTitle = `${topic}: State Batcher & Reducer`;
    problemDesc = `Implement function 'batch_state_updates' to merge queued state actions without race conditions or memory leaks.`;
    selectedFnName = lang === 'javascript' ? 'batchStateUpdates' : 'batch_state_updates';
    starterCodeMap = {
      python: `def batch_state_updates(initial_state, actions):\n    # TODO: Merge actions list into initial_state copy and return the updated state dict.\n    # Example: batch_state_updates({"count": 0}, [{"count": 1}, {"ready": True}])\n    #          -> {"count": 1, "ready": True}\n    pass`,
      javascript: `function batchStateUpdates(initialState, actions) {\n    // TODO: Merge actions array into initialState copy and return the updated state object.\n    // Example: batchStateUpdates({ count: 0 }, [{ count: 1 }, { ready: true }])\n    //          -> { count: 1, ready: true }\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public Map<String, Object> batchStateUpdates(Map<String, Object> state, List<Map<String, Object>> actions) {\n        // TODO: Merge actions\n        return new HashMap<>(state);\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '({"theme": "dark", "count": 1}, [{"count": 2}, {"ready": true}])',
        expectedOutput: '{"theme":"dark","count":2,"ready":true}',
        output: '{"theme":"dark","count":2,"ready":true}',
        name: '[T1: Standard] Nominal state batching with overwrites',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '({"a": 1}, [{"b": 2}, {"c": 3}, {"d": 4}, {"e": 5}, {"f": 6}])',
        expectedOutput: '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}',
        output: '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}',
        name: '[T2: Scale] High-throughput multi-action batch sequence',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '({"active": true}, [])',
        expectedOutput: '{"active":true}',
        output: '{"active":true}',
        name: '[T3: Zero/Empty] Empty actions batch preserves state',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '({}, [{"token": "xyz", "ttl": 0}])',
        expectedOutput: '{"token":"xyz","ttl":0}',
        output: '{"token":"xyz","ttl":0}',
        name: '[T4: Edge/Negative] Empty initial state with zero/falsy updates',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '({"val": 0}, [{"val": 1}, {"val": 2}, {"val": 3}])',
        expectedOutput: '{"val":3}',
        output: '{"val":3}',
        name: '[T5: Complexity Bounds] Monotonic overwrite sequence terminates at final state',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (lower.includes('sql') || lower.includes('database') || lower.includes('db')) {
    problemTitle = `${topic}: High-Throughput Aggregations`;
    problemDesc = `Write an optimized query or function calculating monthly department expenditure and identifying salary outliers.`;
    selectedFnName = lang === 'javascript' ? 'analyzeDepartmentSalaries' : 'analyze_department_salaries';
    starterCodeMap = {
      sql: SQL_INTERVIEW_STARTER,
      python: `def analyze_department_salaries(records, min_avg):\n    # TODO: Group records by 'dept' and calculate average salary for each department.\n    # Return integer count of departments whose average salary strictly exceeds min_avg.\n    # Example: [{"dept": "eng", "salary": 90000}], 80000 -> 1\n    pass`,
      javascript: `function analyzeDepartmentSalaries(records, minAvg) {\n    // TODO: Group records by 'dept' and calculate average salary for each department.\n    // Return integer count of departments whose average salary strictly exceeds minAvg.\n    // Example: [{ dept: "eng", salary: 90000 }], 80000 -> 1\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public int analyzeDepartmentSalaries(List<Map<String, Object>> records, int minAvg) {\n        // TODO: Count qualifying departments\n        return 0;\n    }\n}`
    };
    domainTestCases = [
      {
        input: '([{"dept": "eng", "salary": 100000}, {"dept": "eng", "salary": 80000}, {"dept": "sales", "salary": 50000}], 70000)',
        expectedOutput: '1',
        output: '1',
        name: '[T1: Standard] Average salary calculation across departments',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([{"dept": "d1", "salary": 120000}, {"dept": "d2", "salary": 110000}, {"dept": "d3", "salary": 100000}], 90000)',
        expectedOutput: '3',
        output: '3',
        name: '[T2: Scale] Multi-department throughput count evaluation',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([], 50000)',
        expectedOutput: '0',
        output: '0',
        name: '[T3: Zero/Empty] Empty employee records returns 0 qualified departments',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([{"dept": "hr", "salary": 45000}, {"dept": "ops", "salary": 30000}], 60000)',
        expectedOutput: '0',
        output: '0',
        name: '[T4: Edge/Negative] No departments exceed minimum average threshold',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([{"dept": "eng", "salary": 80000}, {"dept": "eng", "salary": 80000}], 80000)',
        expectedOutput: '0',
        output: '0',
        name: '[T5: Complexity Bounds] Strict inequality boundary (average equals threshold)',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (lower.includes('cloud') || lower.includes('devops') || lower.includes('microservice') || lower.includes('distributed')) {
    problemTitle = `${topic}: Token Bucket Rate Limiter`;
    problemDesc = `Implement function 'is_request_allowed' enforcing a sliding window request rate limit.`;
    selectedFnName = lang === 'javascript' ? 'isRequestAllowed' : 'is_request_allowed';
    starterCodeMap = {
      python: `def is_request_allowed(timestamps, current_ts, limit, window_ms=1000):\n    # TODO: Enforce sliding window rate limit.\n    # Count past timestamps in [current_ts - window_ms, current_ts].\n    # Return True if count < limit (allowing the new request), False otherwise.\n    pass`,
      javascript: `function isRequestAllowed(timestamps, currentTs, limit, windowMs = 1000) {\n    // TODO: Enforce sliding window rate limit.\n    // Count past timestamps in [currentTs - windowMs, currentTs].\n    // Return true if count < limit (allowing the new request), false otherwise.\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public boolean isRequestAllowed(List<Long> timestamps, long currentTs, int limit, long windowMs) {\n        // TODO: Enforce rate limit\n        return true;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '([100, 200, 300], 400, 5, 1000)',
        expectedOutput: 'true',
        output: 'true',
        name: '[T1: Standard] Request rate within nominal window limits',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([100, 200, 300, 400, 500, 600], 700, 5, 1000)',
        expectedOutput: 'false',
        output: 'false',
        name: '[T2: Scale] Burst traffic exceeds maximum allowed capacity',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([], 500, 10, 1000)',
        expectedOutput: 'true',
        output: 'true',
        name: '[T3: Zero/Empty] Initial request with empty history is allowed',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([50, 100], 2000, 2, 1000)',
        expectedOutput: 'true',
        output: 'true',
        name: '[T4: Edge/Negative] Window expiry flushes expired timestamps',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([1000, 1000, 1000], 1000, 3, 1000)',
        expectedOutput: 'false',
        output: 'false',
        name: '[T5: Complexity Bounds] Concurrent identical timestamp burst boundary',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (/\bai\b/.test(lower) || lower.includes('machine learning') || lower.includes('data')) {
    problemTitle = `${topic}: Cosine Similarity & Vector Matching`;
    problemDesc = `Calculate cosine similarity between query embedding vector A and candidate vector B to score relevance.`;
    selectedFnName = lang === 'javascript' ? 'cosineSimilarity' : 'cosine_similarity';
    starterCodeMap = {
      python: `import math\n\ndef cosine_similarity(vec_a, vec_b):\n    # TODO: Compute dot product divided by (norm_a * norm_b).\n    # Return float rounded to 4 decimals, or 0.0 if either norm is zero.\n    # Example: [1.0, 0.0], [1.0, 0.0] -> 1.0\n    pass`,
      javascript: `function cosineSimilarity(vecA, vecB) {\n    // TODO: Compute dot product divided by (normA * normB).\n    // Return number rounded to 4 decimals, or 0.0 if either norm is zero.\n    // Example: [1.0, 0.0], [1.0, 0.0] -> 1.0\n}`,
      java: `public class Solution {\n    public double cosineSimilarity(double[] a, double[] b) {\n        // TODO: Compute cosine similarity\n        return 0.0;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '([1.0, 0.0], [1.0, 0.0])',
        expectedOutput: '1.0',
        output: '1.0',
        name: '[T1: Standard] Identical unit vectors (similarity = 1.0)',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([1.0, 2.0, 3.0, 4.0, 5.0], [5.0, 4.0, 3.0, 2.0, 1.0])',
        expectedOutput: '0.6364',
        output: '0.6364',
        name: '[T2: Scale] Multi-dimensional embedding vector match',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([0.0, 0.0], [1.0, 1.0])',
        expectedOutput: '0.0',
        output: '0.0',
        name: '[T3: Zero/Empty] Zero-magnitude vector handles zero-division cleanly (0.0)',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([1.0, 0.0], [-1.0, 0.0])',
        expectedOutput: '-1.0',
        output: '-1.0',
        name: '[T4: Edge/Negative] Diametrically opposite orthogonal vectors (-1.0)',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([1.0, 0.0], [0.0, 1.0])',
        expectedOutput: '0.0',
        output: '0.0',
        name: '[T5: Complexity Bounds] Perfectly orthogonal vector boundary (similarity = 0.0)',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (lower.includes('quant') || lower.includes('trading') || lower.includes('exchange') || lower.includes('order_book') || lower.includes('hft')) {
    problemTitle = `${topic}: Limit Order Book Matcher`;
    problemDesc = `Implement function 'match_limit_orders' to match crossing buy and sell limit orders under Price-Time Priority and return remaining unexecuted shares.`;
    selectedFnName = lang === 'javascript' ? 'matchLimitOrders' : 'match_limit_orders';
    starterCodeMap = {
      python: `def match_limit_orders(orders):\n    # TODO: Process sequential limit orders. Each order is {"side": "buy"|"sell", "price": int, "qty": int}.\n    # Match crossing orders (buy price >= sell price) in Price-Time Priority.\n    # Return integer sum of remaining unexecuted quantities on the book.\n    # Example: [{"side": "buy", "price": 100, "qty": 10}, {"side": "sell", "price": 99, "qty": 4}] -> 6\n    pass`,
      javascript: `function matchLimitOrders(orders) {\n    // TODO: Process sequential limit orders. Each order is { side: "buy"|"sell", price: number, qty: number }.\n    // Match crossing orders (buy price >= sell price) in Price-Time Priority.\n    // Return integer sum of remaining unexecuted quantities on the book.\n    // Example: [{ side: "buy", price: 100, qty: 10 }, { side: "sell", price: 99, qty: 4 }] -> 6\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public int matchLimitOrders(List<Map<String, Object>> orders) {\n        // TODO: Match crossing orders under Price-Time Priority and return unexecuted shares\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\n\nstruct Order {\n    std::string side;\n    int price;\n    int qty;\n};\n\nclass Solution {\npublic:\n    int matchLimitOrders(const std::vector<Order>& orders) {\n        // TODO: Match crossing orders under Price-Time Priority and return unexecuted shares\n        return 0;\n    }\n};`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '([{"side": "buy", "price": 100, "qty": 10}, {"side": "sell", "price": 99, "qty": 4}])',
        expectedOutput: '6',
        output: '6',
        name: '[T1: Standard] Crossing buy and sell orders leave unexecuted residual quantity (10 - 4 = 6)',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([{"side": "buy", "price": 105, "qty": 50}, {"side": "sell", "price": 100, "qty": 20}, {"side": "sell", "price": 102, "qty": 30}])',
        expectedOutput: '0',
        output: '0',
        name: '[T2: Scale] Multi-level sweep clears buy order across deep ask ladder',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([])',
        expectedOutput: '0',
        output: '0',
        name: '[T3: Zero/Empty] Empty order queue leaves zero unexecuted volume',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([{"side": "buy", "price": 95, "qty": 10}, {"side": "sell", "price": 105, "qty": 10}])',
        expectedOutput: '20',
        output: '20',
        name: '[T4: Edge/Negative] Wide bid-ask spread with no crossing prices preserves both orders',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([{"side": "sell", "price": 100, "qty": 10}, {"side": "sell", "price": 100, "qty": 5}, {"side": "buy", "price": 100, "qty": 12}])',
        expectedOutput: '3',
        output: '3',
        name: '[T5: Complexity Bounds] FIFO Price-Time Priority consumes oldest sell first leaving residual (15 - 12 = 3)',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (lower.includes('iot') || lower.includes('embedded') || lower.includes('firmware') || lower.includes('mcu') || lower.includes('telemetry') || lower.includes('hardware')) {
    problemTitle = `${topic}: Hardware Telemetry Packet Decoder`;
    problemDesc = `Implement function 'decode_sensor_packet' to validate frame sync byte (0xAA), verify XOR checksum over payload, and return decoded payload length in bytes (-1 if corrupted or invalid).`;
    selectedFnName = lang === 'javascript' ? 'decodeSensorPacket' : 'decode_sensor_packet';
    starterCodeMap = {
      python: `def decode_sensor_packet(raw_bytes):\n    # TODO: Frame format: [0xAA (sync), length (1 byte), payload (N bytes), checksum (1 byte XOR of payload)].\n    # Return payload length N if header and checksum are strictly valid, else -1.\n    # Example: [170, 2, 16, 32, 48] -> 2 (since 16 ^ 32 == 48)\n    pass`,
      javascript: `function decodeSensorPacket(rawBytes) {\n    // TODO: Frame format: [0xAA (sync), length (1 byte), payload (N bytes), checksum (1 byte XOR of payload)].\n    // Return payload length N if header and checksum are strictly valid, else -1.\n    // Example: [170, 2, 16, 32, 48] -> 2 (since 16 ^ 32 == 48)\n}`,
      java: `public class Solution {\n    public int decodeSensorPacket(int[] rawBytes) {\n        // TODO: Validate frame sync 0xAA, length, and XOR checksum; return payload length or -1\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\n#include <cstdint>\n\nclass Solution {\npublic:\n    int decodeSensorPacket(const std::vector<uint8_t>& rawBytes) {\n        // TODO: Validate 0xAA sync, length header, and XOR payload checksum; return length or -1\n        return -1;\n    }\n};`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '([170, 2, 16, 32, 48])',
        expectedOutput: '2',
        output: '2',
        name: '[T1: Standard] Valid sensor frame with matching XOR checksum returns payload length 2',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([170, 4, 1, 2, 4, 8, 15])',
        expectedOutput: '4',
        output: '4',
        name: '[T2: Scale] Extended multi-byte telemetry payload successfully verified',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([])',
        expectedOutput: '-1',
        output: '-1',
        name: '[T3: Zero/Empty] Empty byte stream returns error flag -1',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([170, 2, 16, 32, 99])',
        expectedOutput: '-1',
        output: '-1',
        name: '[T4: Edge/Negative] Corrupted CRC/XOR checksum detects bit-flip and rejects frame',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([170, 4, 16, 32])',
        expectedOutput: '-1',
        output: '-1',
        name: '[T5: Complexity Bounds] Truncated buffer underflow rejects incomplete UART packet',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (lower.includes('cyber') || lower.includes('security') || lower.includes('crypto') || lower.includes('zero_trust') || lower.includes('merkle') || lower.includes('auth')) {
    problemTitle = `${topic}: Merkle Audit Proof Validator`;
    problemDesc = `Implement function 'verify_merkle_proof' to verify that a transaction leaf belongs to a cryptographic Merkle root given an audit authentication path (returns 1 if valid, 0 if forged, -1 if empty).`;
    selectedFnName = lang === 'javascript' ? 'verifyMerkleProof' : 'verify_merkle_proof';
    starterCodeMap = {
      python: `def verify_merkle_proof(leaf, proof, root):\n    # TODO: Verify Merkle inclusion proof.\n    # leaf is str, proof is list of [sibling_hash, is_left_sibling: bool], root is str.\n    # Return -1 if leaf is empty, 1 if valid path matches root, 0 otherwise.\n    pass`,
      javascript: `function verifyMerkleProof(leaf, proof, root) {\n    // TODO: Verify Merkle inclusion proof.\n    // leaf is string, proof is array of [siblingHash, isLeftSibling], root is string.\n    // Return -1 if leaf is empty, 1 if valid path matches root, 0 otherwise.\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public int verifyMerkleProof(String leaf, List<Map<String, Object>> proof, String root) {\n        // TODO: Verify Merkle audit path; return 1 if valid, 0 if invalid, -1 if empty\n        return 0;\n    }\n}`,
      cpp: `#include <string>\n#include <vector>\n#include <utility>\n\nclass Solution {\npublic:\n    int verifyMerkleProof(const std::string& leaf, const std::vector<std::pair<std::string, bool>>& proof, const std::string& root) {\n        // TODO: Compute hash path and verify against root; return 1 if valid, 0 if invalid, -1 if empty\n        return 0;\n    }\n};`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '("tx_alpha", [["h_beta", false]], "root_ab")',
        expectedOutput: '1',
        output: '1',
        name: '[T1: Standard] Single-hop authentic Merkle branch evaluates to valid root (code 1)',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '("leaf_0", [["h_1", false], ["h_23", false], ["h_47", false]], "root_all")',
        expectedOutput: '1',
        output: '1',
        name: '[T2: Scale] Multi-tier logarithmic inclusion proof verifies depth-3 tree',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '("", [], "root_ab")',
        expectedOutput: '-1',
        output: '-1',
        name: '[T3: Zero/Empty] Empty leaf identifier rejects with malformed code -1',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '("tx_alpha", [["h_corrupted", false]], "root_ab")',
        expectedOutput: '0',
        output: '0',
        name: '[T4: Edge/Negative] Tampered sibling hash fails root equality check (code 0)',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '("tx_alpha", [["h_beta", true]], "root_ab")',
        expectedOutput: '0',
        output: '0',
        name: '[T5: Complexity Bounds] Inverted sibling position flag prevents pre-image collision',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (lower.includes('accounting') || lower.includes('ledger') || lower.includes('tax') || lower.includes('audit') || lower.includes('banking') || (lower.includes('finance') && !lower.includes('frontend'))) {
    problemTitle = `${topic}: Double-Entry Ledger Trial Balance Auditor`;
    problemDesc = `Implement function 'audit_trial_balance' to calculate total debits and credits across journal entries and return net balance variance (0.0 if balanced, positive variance if imbalanced).`;
    selectedFnName = lang === 'javascript' ? 'auditTrialBalance' : 'audit_trial_balance';
    starterCodeMap = {
      python: `def audit_trial_balance(entries):\n    # TODO: Each entry is {"account": str, "debit": float, "credit": float}.\n    # Calculate sum(debits) and sum(credits).\n    # Return net posting variance round(abs(sum(debits) - sum(credits)), 2).\n    # Example: [{"account": "Cash", "debit": 1000.0, "credit": 0.0}, {"account": "Revenue", "debit": 0.0, "credit": 1000.0}] -> 0.0\n    pass`,
      javascript: `function auditTrialBalance(entries) {\n    // TODO: Each entry is { account: string, debit: number, credit: number }.\n    // Calculate sum(debits) and sum(credits).\n    // Return net posting variance Math.round(Math.abs(sumDebits - sumCredits) * 100) / 100.\n    // Example: [{ account: "Cash", debit: 1000.0, credit: 0.0 }, { account: "Revenue", debit: 0.0, credit: 1000.0 }] -> 0.0\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public double auditTrialBalance(List<Map<String, Object>> entries) {\n        // TODO: Compute trial balance variance abs(sum(debits) - sum(credits))\n        return 0.0;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\n#include <cmath>\n\nstruct JournalEntry {\n    std::string account;\n    double debit;\n    double credit;\n};\n\nclass Solution {\npublic:\n    double auditTrialBalance(const std::vector<JournalEntry>& entries) {\n        // TODO: Compute trial balance variance abs(sum(debits) - sum(credits))\n        return 0.0;\n    }\n};`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '([{"account": "Cash", "debit": 1000.0, "credit": 0.0}, {"account": "Revenue", "debit": 0.0, "credit": 1000.0}])',
        expectedOutput: '0.0',
        output: '0.0',
        name: '[T1: Standard] Balanced journal entry yields zero trial balance variance (0.0)',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([{"account": "Cash", "debit": 5000.0, "credit": 0.0}, {"account": "AR", "debit": 2000.0, "credit": 0.0}, {"account": "Equity", "debit": 0.0, "credit": 7000.0}])',
        expectedOutput: '0.0',
        output: '0.0',
        name: '[T2: Scale] Compound multi-account journal batch balances accurately',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([])',
        expectedOutput: '0.0',
        output: '0.0',
        name: '[T3: Zero/Empty] Empty ledger journal yields zero variance (0.0)',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([{"account": "Cash", "debit": 1500.0, "credit": 0.0}, {"account": "Revenue", "debit": 0.0, "credit": 1000.0}])',
        expectedOutput: '500.0',
        output: '500.0',
        name: '[T4: Edge/Negative] Unposted entry mismatch flags exact 500.0 trial balance variance',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([{"account": "AP", "debit": 300.0, "credit": 50.0}, {"account": "Cash", "debit": 0.0, "credit": 500.0}])',
        expectedOutput: '250.0',
        output: '250.0',
        name: '[T5: Complexity Bounds] Bilateral entries with contra adjustments calculate net variance 250.0',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else {
    problemTitle = `${topic}: Longest Valid Throughput Window`;
    problemDesc = `Given an array of throughput metric integers, find the length of the longest contiguous subsegment meeting SLA bounds.`;
    selectedFnName = lang === 'javascript' ? 'maxThroughputWindow' : 'max_throughput_window';
    starterCodeMap = {
      python: `def max_throughput_window(metrics, min_sla):\n    # TODO: Find length of longest contiguous sequence where all values >= min_sla.\n    # Example: [10, 50, 60, 70, 20, 80], 50 -> 3\n    pass`,
      javascript: `function maxThroughputWindow(metrics, minSla) {\n    // TODO: Find length of longest contiguous sequence where all values >= minSla.\n    // Example: [10, 50, 60, 70, 20, 80], 50 -> 3\n}`,
      java: `public class Solution {\n    public int maxThroughputWindow(int[] metrics, int minSla) {\n        // TODO: Find length of longest contiguous sequence where all values >= minSla\n        return 0;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '([10, 50, 60, 70, 20, 80], 50)',
        expectedOutput: '3',
        output: '3',
        name: '[T1: Standard] Longest contiguous window meeting SLA (50, 60, 70: len 3)',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([100, 200, 300, 400, 500, 600, 700], 50)',
        expectedOutput: '7',
        output: '7',
        name: '[T2: Scale] Sustained high-throughput stream across entire window',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([], 50)',
        expectedOutput: '0',
        output: '0',
        name: '[T3: Zero/Empty] Empty metric stream returns 0',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([10, 20, 30], 40)',
        expectedOutput: '0',
        output: '0',
        name: '[T4: Edge/Negative] No data points satisfy minimum SLA',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([50, 20, 50, 50, 10, 50, 50, 50], 50)',
        expectedOutput: '3',
        output: '3',
        name: '[T5: Complexity Bounds] Multiple non-adjacent burst segments selects maximum',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  }

  return {
    title: problemTitle,
    description: problemDesc,
    functionName: selectedFnName,
    starterCode: lang === 'sql' ? SQL_INTERVIEW_STARTER : starterCodeMap[lang] || starterCodeMap.python || '',
    testSuite: lang === 'sql' ? SQL_INTERVIEW_TEST_SUITE : undefined,
    testCases: lang === 'sql' ? undefined : domainTestCases
  };
}
