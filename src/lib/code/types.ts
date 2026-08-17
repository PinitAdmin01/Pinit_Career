// src/lib/code/types.ts
// Standardized Type Contracts for PinIT Multi-Language In-Browser Code Runner

export type CodeLanguage = 'javascript' | 'python' | 'sql' | 'java' | 'cpp';

export interface TestCase {
  input: string;              // Serialized input, e.g. "[10, 20, 30]" or "(3, 5)"
  output: string;             // Expected serialized output, e.g. "true" or "8"
  hidden?: boolean;
  explanation?: string;
  name?: string;
}

export interface SqlTestCase {
  query: string;
  schemaSql?: string;         // e.g. "CREATE TABLE users (id INT, name TEXT, salary INT);"
  seedSql?: string;           // e.g. "INSERT INTO users VALUES (1, 'Alice', 90000);"
  expectedColumns?: string[]; // e.g. ["id", "name"]
  expectedRows?: any[][];     // e.g. [[1, 'Alice']]
}

export interface SingleTestOutcome {
  index: number;
  testCaseName?: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed: boolean;
  error?: string;
  durationMs: number;
  stdout?: string;
}

export interface SuiteExecutionResult {
  language: CodeLanguage;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  allPassed: boolean;
  status: 'SUCCESS' | 'PARTIAL_PASS' | 'SYNTAX_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT' | 'WORKER_CRASH';
  totalDurationMs: number;
  terminalLogs: string[];
  testOutcomes: SingleTestOutcome[];
  error?: string;
}

export interface WorkerExecutionRequest {
  id: string;
  language: CodeLanguage;
  code: string;
  functionName?: string;
  testCases?: TestCase[];
  sqlConfig?: SqlTestCase;
  timeoutMs?: number;
}

export interface WorkerExecutionResponse {
  id: string;
  success: boolean;
  result?: SuiteExecutionResult;
  error?: string;
}
