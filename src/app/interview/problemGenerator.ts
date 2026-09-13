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
      python: `def ${safeFn}(input_data, threshold):\n    # Process ${topicName} records in O(N)\n    return {"status": "Optimal", "count": len(input_data) if hasattr(input_data, '__len__') else 1}`,
      javascript: `function ${safeFn}(inputData, threshold) {\n    return { status: "Optimal", count: Array.isArray(inputData) ? inputData.length : 1 };\n}`,
      java: `public class Solution {\n    public boolean ${safeFn}(int[] data) { return true; }\n}`,
      sql: `SELECT department_id, COUNT(*) as emp_count, AVG(salary) as avg_sal FROM employees GROUP BY department_id;`
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
      python: `def batch_state_updates(initial_state, actions):\n    state = dict(initial_state)\n    for act in actions:\n        if act.get('type') == 'SET':\n            state[act['key']] = act['value']\n    return state`,
      javascript: `function batchStateUpdates(initialState, actions) {\n    return actions.reduce((acc, act) => {\n        if (act.type === 'SET') return { ...acc, [act.key]: act.value };\n        return acc;\n    }, { ...initialState });\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public Map<String, Object> batchState(Map<String, Object> state, List<Map<String, Object>> actions) {\n        return new HashMap<>(state);\n    }\n}`,
      sql: `SELECT action_type, COUNT(*) as action_count FROM audit_logs GROUP BY action_type;`
    };
  } else if (lower.includes('sql') || lower.includes('database') || lower.includes('db')) {
    problemTitle = `${topic}: High-Throughput Aggregations`;
    problemDesc = `Write an optimized query or function calculating monthly department expenditure and identifying salary outliers.`;
    starterCodeMap = {
      sql: `SELECT department_id, COUNT(*) as headcount, AVG(salary) as avg_salary\nFROM employees\nGROUP BY department_id\nHAVING AVG(salary) > 50000;`,
      python: `def analyze_department_salaries(records, min_avg):\n    # Filter and group employee records\n    return [{"department_id": 101, "avg_salary": 92500}]`,
      javascript: `function analyzeDepartmentSalaries(records, minAvg) {\n    return [{ departmentId: 101, avgSalary: 92500 }];\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public List<Map<String, Object>> analyzeSalaries(List<Map<String, Object>> records) {\n        return new ArrayList<>();\n    }\n}`
    };
  } else if (lower.includes('cloud') || lower.includes('devops') || lower.includes('microservice') || lower.includes('distributed')) {
    problemTitle = `${topic}: Token Bucket Rate Limiter`;
    problemDesc = `Implement function 'is_request_allowed' enforcing a maximum requests-per-second limit with burst tolerance.`;
    starterCodeMap = {
      python: `def is_request_allowed(client_id, timestamp_ms, capacity=10, refill_rate=1.0):\n    # Return True if request passes token bucket threshold\n    return True`,
      javascript: `function isRequestAllowed(clientId, timestampMs, capacity = 10, refillRate = 1.0) {\n    return true;\n}`,
      java: `public class Solution {\n    public boolean isRequestAllowed(String clientId, long timestampMs) {\n        return true;\n    }\n}`,
      sql: `SELECT client_ip, COUNT(*) as req_count FROM access_logs WHERE req_time > NOW() - INTERVAL '1 minute' GROUP BY client_ip;`
    };
  } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('data')) {
    problemTitle = `${topic}: Cosine Similarity & Vector Matching`;
    problemDesc = `Calculate cosine similarity between query embedding vector A and candidate vector B to score relevance.`;
    starterCodeMap = {
      python: `import math\ndef cosine_similarity(vec_a, vec_b):\n    dot = sum(a * b for a, b in zip(vec_a, vec_b))\n    norm_a = math.sqrt(sum(a * a for a in vec_a))\n    norm_b = math.sqrt(sum(b * b for b in vec_b))\n    return round(dot / (norm_a * norm_b), 4) if (norm_a * norm_b) > 0 else 0.0`,
      javascript: `function cosineSimilarity(vecA, vecB) {\n    const dot = vecA.reduce((sum, a, i) => sum + a * (vecB[i] || 0), 0);\n    const normA = Math.sqrt(vecA.reduce((s, a) => s + a * a, 0));\n    const normB = Math.sqrt(vecB.reduce((s, b) => s + b * b, 0));\n    return (normA * normB) > 0 ? +(dot / (normA * normB)).toFixed(4) : 0;\n}`,
      java: `public class Solution {\n    public double cosineSimilarity(double[] a, double[] b) {\n        return 1.0;\n    }\n}`,
      sql: `SELECT doc_id, vector_distance FROM documents ORDER BY vector_distance ASC LIMIT 5;`
    };
  } else {
    problemTitle = `${topic}: Longest Valid Throughput Window`;
    problemDesc = `Given an array of throughput metric integers, find the length of the longest contiguous subsegment meeting SLA bounds.`;
    starterCodeMap = {
      python: `def max_throughput_window(metrics, min_sla):\n    max_len, cur_len = 0, 0\n    for val in metrics:\n        if val >= min_sla:\n            cur_len += 1\n            max_len = max(max_len, cur_len)\n        else:\n            cur_len = 0\n    return max_len`,
      javascript: `function maxThroughputWindow(metrics, minSla) {\n    let maxLen = 0, curLen = 0;\n    for (const val of metrics) {\n        if (val >= minSla) { curLen++; maxLen = Math.max(maxLen, curLen); }\n        else { curLen = 0; }\n    }\n    return maxLen;\n}`,
      java: `public class Solution {\n    public int maxThroughputWindow(int[] metrics, int minSla) {\n        int max = 0, cur = 0;\n        for (int m : metrics) {\n            if (m >= minSla) { cur++; max = Math.max(max, cur); }\n            else { cur = 0; }\n        }\n        return max;\n    }\n}`,
      sql: `SELECT MAX(streak) FROM (SELECT department_id, COUNT(*) as streak FROM metrics WHERE status = 'OK' GROUP BY department_id) t;`
    };
  }

  return {
    title: problemTitle,
    description: problemDesc,
    starterCode: starterCodeMap[lang] || starterCodeMap.python || ''
  };
}
