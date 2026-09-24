export interface CodingProblemDefinition {
  title: string;
  description: string;
  starterCode: string;
}

export function createSemanticFallbackProblem(topicName: string, difficulty: 'easy' | 'normal' | 'hard' = 'normal') {
  const safeFn = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 24) || 'evaluate_metric';
  return {
    title: `${topicName} Assessment & Logic Evaluator`,
    description: `Implement function '${safeFn}' to evaluate constraints, metrics, and throughput for ${topicName}.`,
    functionName: safeFn,
    starterCode: {
      python: `def ${safeFn}(input_data, threshold):\n    # TODO: Implement ${topicName} evaluation logic\n    # Return dict with "status" and "count"\n    pass`,
      javascript: `function ${safeFn}(inputData, threshold) {\n    // TODO: Implement ${topicName} evaluation logic\n    // Return { status: "...", count: ... }\n}`,
      java: `public class Solution {\n    public boolean ${safeFn}(int[] data) {\n        // TODO: Implement solution\n        return false;\n    }\n}`,
      sql: `-- Query ${topicName} records meeting throughput criteria\nSELECT department_id, COUNT(*) as emp_count, AVG(salary) as avg_sal\nFROM employees\nGROUP BY department_id;`
    },
    testCases: [
      { input: '[10, 20, 30], 15', expectedOutput: 'Optimal', name: 'Standard Case' },
      { input: '[], 0', expectedOutput: 'Handled', name: 'Boundary Check' }
    ],
    suggestedWhiteboardNodes: [
      { id: 'gateway', label: 'Client / Gateway', type: 'api' },
      { id: 'engine', label: `${topicName} Service`, type: 'compute' },
      { id: 'cache', label: 'Redis Cache', type: 'cache' },
      { id: 'storage', label: 'Primary DB', type: 'database' }
    ]
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
      starterCode: cached.starterCode[lang] || cached.starterCode.python || ''
    };
  }

  const lower = (topic + ' ' + domainStream).toLowerCase();
  let problemTitle = `${topic} Technical Assessment`;
  let problemDesc = `Implement algorithmic logic to solve real-world constraints for ${topic}.`;
  let starterCodeMap: Record<string, string> = {};

  if (lower.includes('frontend') || lower.includes('react') || lower.includes('web') || lower.includes('ui')) {
    problemTitle = `${topic}: State Batcher & Reducer`;
    problemDesc = `Implement function 'batch_state_updates' to merge queued state actions without race conditions or memory leaks.`;
    starterCodeMap = {
      python: `def batch_state_updates(initial_state, actions):\n    # TODO: Merge actions into initial_state copy and return updated state\n    pass`,
      javascript: `function batchStateUpdates(initialState, actions) {\n    // TODO: Merge actions into initialState copy and return updated state\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public Map<String, Object> batchState(Map<String, Object> state, List<Map<String, Object>> actions) {\n        // TODO: Merge actions\n        return new HashMap<>(state);\n    }\n}`,
      sql: `SELECT action_type, COUNT(*) as action_count FROM audit_logs GROUP BY action_type;`
    };
  } else if (lower.includes('sql') || lower.includes('database') || lower.includes('db')) {
    problemTitle = `${topic}: High-Throughput Aggregations`;
    problemDesc = `Write an optimized query or function calculating monthly department expenditure and identifying salary outliers.`;
    starterCodeMap = {
      sql: `-- Write a query to return department_id, headcount, and avg_salary for depts with avg > 50000\nSELECT department_id, COUNT(*) as headcount, AVG(salary) as avg_salary\nFROM employees\nGROUP BY department_id\nHAVING AVG(salary) > 50000;`,
      python: `def analyze_department_salaries(records, min_avg):\n    # TODO: Group records by department_id and filter where avg_salary > min_avg\n    pass`,
      javascript: `function analyzeDepartmentSalaries(records, minAvg) {\n    // TODO: Group records by department_id and filter where avg_salary > minAvg\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public List<Map<String, Object>> analyzeSalaries(List<Map<String, Object>> records) {\n        // TODO: Implement salary aggregation\n        return new ArrayList<>();\n    }\n}`
    };
  } else if (lower.includes('cloud') || lower.includes('devops') || lower.includes('microservice') || lower.includes('distributed')) {
    problemTitle = `${topic}: Token Bucket Rate Limiter`;
    problemDesc = `Implement function 'is_request_allowed' enforcing a maximum requests-per-second limit with burst tolerance.`;
    starterCodeMap = {
      python: `def is_request_allowed(client_id, timestamp_ms, capacity=10, refill_rate=1.0):\n    # TODO: Enforce token bucket rate limit. Return True if allowed, False otherwise\n    pass`,
      javascript: `function isRequestAllowed(clientId, timestampMs, capacity = 10, refillRate = 1.0) {\n    // TODO: Enforce token bucket rate limit. Return true if allowed, false otherwise\n}`,
      java: `public class Solution {\n    public boolean isRequestAllowed(String clientId, long timestampMs) {\n        // TODO: Enforce rate limit\n        return true;\n    }\n}`,
      sql: `SELECT client_ip, COUNT(*) as req_count FROM access_logs WHERE req_time > NOW() - INTERVAL '1 minute' GROUP BY client_ip;`
    };
  } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('data')) {
    problemTitle = `${topic}: Cosine Similarity & Vector Matching`;
    problemDesc = `Calculate cosine similarity between query embedding vector A and candidate vector B to score relevance.`;
    starterCodeMap = {
      python: `import math\n\ndef cosine_similarity(vec_a, vec_b):\n    # TODO: Compute dot product divided by magnitude product (norm_a * norm_b)\n    # Return float rounded to 4 decimals, or 0.0 if norm is zero\n    pass`,
      javascript: `function cosineSimilarity(vecA, vecB) {\n    // TODO: Compute dot product divided by magnitude product\n    // Return number rounded to 4 decimals, or 0.0 if norm is zero\n}`,
      java: `public class Solution {\n    public double cosineSimilarity(double[] a, double[] b) {\n        // TODO: Compute cosine similarity\n        return 0.0;\n    }\n}`,
      sql: `SELECT doc_id, vector_distance FROM documents ORDER BY vector_distance ASC LIMIT 5;`
    };
  } else {
    problemTitle = `${topic}: Longest Valid Throughput Window`;
    problemDesc = `Given an array of throughput metric integers, find the length of the longest contiguous subsegment meeting SLA bounds.`;
    starterCodeMap = {
      python: `def max_throughput_window(metrics, min_sla):\n    # TODO: Find length of longest contiguous sequence where all values >= min_sla\n    pass`,
      javascript: `function maxThroughputWindow(metrics, minSla) {\n    // TODO: Find length of longest contiguous sequence where all values >= minSla\n}`,
      java: `public class Solution {\n    public int maxThroughputWindow(int[] metrics, int minSla) {\n        // TODO: Find length of longest contiguous sequence where all values >= minSla\n        return 0;\n    }\n}`,
      sql: `SELECT MAX(streak) FROM (SELECT department_id, COUNT(*) as streak FROM metrics WHERE status = 'OK' GROUP BY department_id) t;`
    };
  }

  return {
    title: problemTitle,
    description: problemDesc,
    starterCode: starterCodeMap[lang] || starterCodeMap.python || ''
  };
}
