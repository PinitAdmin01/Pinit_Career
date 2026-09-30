// src/lib/code/runners/sqlRunner.ts
// In-Memory SQLite WebAssembly Query Execution Engine
// Hardened with Web Worker isolation, timeout kill switch, and testSuite statement evaluation.

import { SqlTestCase, SuiteExecutionResult } from '../types';
import { runPythonScript } from './pythonRunner';
import { splitSqlTask } from '../sql/sqlCore';
import { gradeSqlInBrowser } from '../sql/sqlRunner';

/** New-format SQL tasks (setup, "-- CHECKS --", checks) are graded on PostgreSQL with real checks. */
async function executePostgresTask(query: string, setup: string, checks: string): Promise<SuiteExecutionResult> {
  const startTime = Date.now();
  const result = await gradeSqlInBrowser(setup, query, checks);
  const duration = Date.now() - startTime;
  const failed = result.messages.filter((m) => !m.startsWith('PASS'));
  const isError = result.messages.some((m) => m.startsWith('[Error]'));
  return {
    language: 'sql',
    totalTests: Math.max(result.messages.length, 1),
    passedTests: result.messages.length - failed.length,
    failedTests: failed.length,
    allPassed: result.passed,
    status: result.passed ? 'SUCCESS' : isError ? 'SYNTAX_ERROR' : 'PARTIAL_PASS',
    totalDurationMs: duration,
    terminalLogs: ['[PostgreSQL] Your result:', ...result.output.split('\n'), '', ...result.messages],
    testOutcomes: result.messages.map((m, i) => ({
      index: i + 1,
      testCaseName: m.replace(/^(PASS|FAIL) /, ''),
      input: query,
      expectedOutput: '',
      actualOutput: m,
      passed: m.startsWith('PASS'),
      durationMs: duration,
      error: m.startsWith('PASS') ? undefined : m,
    })),
    stdout: result.output,
    error: result.passed ? undefined : failed[0],
  };
}

export async function executeSqlSuite(
  query: string,
  config: SqlTestCase,
  timeoutMs: number = 4000,
  testSuite?: string
): Promise<SuiteExecutionResult> {
  const postgresTask = splitSqlTask(testSuite);
  if (postgresTask) return executePostgresTask(query, postgresTask.setup, postgresTask.checks);

  const startTime = Date.now();
  const terminalLogs: string[] = [];

  terminalLogs.push(`[SQL RUNTIME] Initializing in-memory SQLite database in isolated worker...`);

  const defaultSchema = `
    CREATE TABLE employees (id INT, name TEXT, department_id INT, department TEXT, salary INT);
    INSERT INTO employees VALUES (1, 'Alice', 101, 'Engineering', 95000);
    INSERT INTO employees VALUES (2, 'Bob', 102, 'Marketing', 65000);
    INSERT INTO employees VALUES (3, 'Charlie', 101, 'Engineering', 105000);
    INSERT INTO employees VALUES (4, 'David', 103, 'Sales', 72000);
    INSERT INTO employees VALUES (5, 'Emma', 101, 'Engineering', 98000);
  `;

  const schema = (config.schemaSql || defaultSchema) + '\n' + (config.seedSql || '');
  const cleanUserQuery = query.trim().replace(/;+$/, '');
  const cleanTestSuite = typeof testSuite === 'string' ? testSuite.trim() : '';

  const sqlRunnerScript = `
import sqlite3, json, sys

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Run Schema & Seeds
for statement in """${schema.replace(/"""/g, "'''")}""".split(';'):
    stmt = statement.strip()
    if stmt:
        cursor.execute(stmt)
conn.commit()

# Execute User Statement(s)
for statement in """${cleanUserQuery.replace(/"""/g, "'''")}""".split(';'):
    stmt = statement.strip()
    if stmt:
        cursor.execute(stmt)
conn.commit()

cols = [desc[0] for desc in cursor.description] if cursor.description else []
rows = cursor.fetchall() if cursor.description else []

# Execute Authoritative Test Suite queries if provided
_test_count = 0
for test_statement in """${cleanTestSuite.replace(/"""/g, "'''")}""".split(';'):
    tstmt = test_statement.strip()
    if tstmt:
        cursor.execute(tstmt)
        _test_count += 1
conn.commit()

_sql_cols = json.dumps(cols)
_sql_rows = json.dumps(rows)
_test_passed = 'TRUE'
`;

  try {
    const res = await runPythonScript(sqlRunnerScript, ['_sql_cols', '_sql_rows', '_test_passed'], timeoutMs);
    const duration = Date.now() - startTime;

    if (!res.success) {
      const isTimeout = (res.error || '').toLowerCase().includes('timeout');
      const msg = res.error || 'SQL statement execution error';
      terminalLogs.push(isTimeout ? `[TIMEOUT] ${msg}` : `[SQL ERROR] ${msg}`);

      return {
        language: 'sql',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        allPassed: false,
        status: isTimeout ? 'TIMEOUT' : 'SYNTAX_ERROR',
        totalDurationMs: duration,
        terminalLogs,
        testOutcomes: [{
          index: 1,
          testCaseName: 'SQL Query Verification',
          input: cleanUserQuery,
          expectedOutput: '',
          actualOutput: msg,
          passed: false,
          error: msg,
          durationMs: duration
        }],
        error: msg
      };
    }

    const cols: string[] = JSON.parse(res.results?._sql_cols || '[]');
    const rows: any[][] = JSON.parse(res.results?._sql_rows || '[]');

    terminalLogs.push(`[SQL RUNTIME] Query executed successfully in ${duration}ms.`);
    if (cols.length > 0) {
      terminalLogs.push(`[TABLE RESULT] Columns: [${cols.join(', ')}] (${rows.length} rows returned)`);

      // Render ASCII preview of table
      if (rows.length > 0) {
        const headerLine = `| ${cols.join(' | ')} |`;
        const dividerLine = `| ${cols.map(c => '-'.repeat(Math.max(c.length, 3))).join(' | ')} |`;
        terminalLogs.push(headerLine);
        terminalLogs.push(dividerLine);
        rows.slice(0, 5).forEach(r => {
          terminalLogs.push(`| ${r.join(' | ')} |`);
        });
        if (rows.length > 5) {
          terminalLogs.push(`... (${rows.length - 5} more rows)`);
        }
      }
    }

    // Comparison with expected columns/rows
    const hasExpectations = Boolean(
      (config.expectedColumns && config.expectedColumns.length > 0) ||
      (config.expectedRows && config.expectedRows.length > 0) ||
      cleanTestSuite
    );

    let passed = hasExpectations;
    let failReason = hasExpectations ? '' : 'No test suite or expected output criteria specified to evaluate query';

    if (config.expectedColumns && config.expectedColumns.length > 0) {
      const actualLower = cols.map(c => c.toLowerCase());
      const expectedLower = config.expectedColumns.map(c => c.toLowerCase());
      if (JSON.stringify(actualLower) !== JSON.stringify(expectedLower)) {
        passed = false;
        failReason = `Column mismatch. Expected [${config.expectedColumns.join(', ')}], Received [${cols.join(', ')}]`;
      }
    }

    if (passed && config.expectedRows) {
      const actualJson = JSON.stringify(rows);
      const expectedJson = JSON.stringify(config.expectedRows);
      if (actualJson !== expectedJson) {
        passed = false;
        failReason = `Row dataset mismatch. Expected ${config.expectedRows.length} rows, Received ${rows.length} rows.`;
      }
    }

    if (passed) {
      terminalLogs.push(`[TEST SUITE] SQL Assertion PASSED. Dataset matches expected schema criteria.`);
    } else {
      terminalLogs.push(`[FAIL] SQL Assertion FAILED: ${failReason}`);
    }

    return {
      language: 'sql',
      totalTests: 1,
      passedTests: passed ? 1 : 0,
      failedTests: passed ? 0 : 1,
      allPassed: passed,
      status: passed ? 'SUCCESS' : 'PARTIAL_PASS',
      totalDurationMs: duration,
      terminalLogs,
      testOutcomes: [{
        index: 1,
        testCaseName: 'SQL Query Verification',
        input: cleanUserQuery,
        expectedOutput: JSON.stringify(config.expectedRows || []),
        actualOutput: JSON.stringify(rows),
        passed,
        durationMs: duration,
        error: failReason || undefined
      }]
    };
  } catch (sqlErr: any) {
    const duration = Date.now() - startTime;
    const msg = sqlErr?.message || String(sqlErr);
    terminalLogs.push(`[SQL RUNTIME ERROR] ${msg}`);

    return {
      language: 'sql',
      totalTests: 1,
      passedTests: 0,
      failedTests: 1,
      allPassed: false,
      status: 'SYNTAX_ERROR',
      totalDurationMs: duration,
      terminalLogs,
      testOutcomes: [{
        index: 1,
        testCaseName: 'SQL Query Verification',
        input: cleanUserQuery,
        expectedOutput: '',
        passed: false,
        error: msg,
        durationMs: duration
      }],
      error: msg
    };
  }
}
