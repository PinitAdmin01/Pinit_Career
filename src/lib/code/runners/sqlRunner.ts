// src/lib/code/runners/sqlRunner.ts
// In-Memory SQLite WebAssembly Query Execution Engine

import { SqlTestCase, SuiteExecutionResult } from '../types';
import { loadPyodideRuntime } from './pythonRunner';

export async function executeSqlSuite(
  query: string,
  config: SqlTestCase,
  timeoutMs: number = 4000
): Promise<SuiteExecutionResult> {
  const startTime = Date.now();
  const terminalLogs: string[] = [];

  terminalLogs.push(`[SQL RUNTIME] Initializing in-memory SQLite database...`);

  let py: any;
  try {
    py = await loadPyodideRuntime();
  } catch (err: any) {
    const duration = Date.now() - startTime;
    return {
      language: 'sql',
      totalTests: 1,
      passedTests: 0,
      failedTests: 1,
      allPassed: false,
      status: 'RUNTIME_ERROR',
      totalDurationMs: duration,
      terminalLogs: [`[SQL ERROR] Failed to initialize SQLite runtime: ${err?.message}`],
      testOutcomes: []
    };
  }

  const defaultSchema = `
    CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
    INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 95000);
    INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 65000);
    INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 105000);
    INSERT INTO employees VALUES (4, 'David', 'Sales', 72000);
  `;

  const schema = (config.schemaSql || defaultSchema) + '\n' + (config.seedSql || '');
  const cleanUserQuery = query.trim().replace(/;+$/, '');

  const sqlRunnerScript = `
import sqlite3, json

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Run Schema & Seeds
for statement in """${schema.replace(/"""/g, "'''")}""".split(';'):
    stmt = statement.strip()
    if stmt:
        cursor.execute(stmt)
conn.commit()

# Execute User Query
cursor.execute("""${cleanUserQuery.replace(/"""/g, "'''")}""")
cols = [desc[0] for desc in cursor.description] if cursor.description else []
rows = cursor.fetchall()

_sql_cols = json.dumps(cols)
_sql_rows = json.dumps(rows)
`;

  try {
    await py.runPythonAsync(sqlRunnerScript);

    const cols: string[] = JSON.parse(py.globals.get('_sql_cols') || '[]');
    const rows: any[][] = JSON.parse(py.globals.get('_sql_rows') || '[]');
    const duration = Date.now() - startTime;

    terminalLogs.push(`[SQL RUNTIME] Query executed successfully in ${duration}ms.`);
    terminalLogs.push(`[TABLE RESULT] Columns: [${cols.join(', ')}] (${rows.length} rows returned)`);

    // Render ASCII preview of table
    if (rows.length > 0) {
      const headerLine = `| ${cols.join(' | ')} |`;
      const dividerLine = `| ${cols.map(c => '-'.repeat(c.length)).join(' | ')} |`;
      terminalLogs.push(headerLine);
      terminalLogs.push(dividerLine);
      rows.slice(0, 5).forEach(r => {
        terminalLogs.push(`| ${r.join(' | ')} |`);
      });
      if (rows.length > 5) {
        terminalLogs.push(`... (${rows.length - 5} more rows)`);
      }
    }

    // Comparison with expected
    let passed = true;
    let failReason = '';

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
    terminalLogs.push(`[SQL SYNTAX ERROR] ${msg}`);

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
