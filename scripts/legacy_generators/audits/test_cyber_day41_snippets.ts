// scripts/test_cyber_day41_snippets.ts
import crypto from 'node:crypto';

// Snippet 1: SQL Injection Vulnerability vs Tokenizer
interface QueryAnalysis {
  isTainted: boolean;
  detectedTaintPattern?: string;
}

class SqlTaintAnalyzer {
  private static dangerousPatterns = [
    /--/,
    /\/\*/,
    /'\s*OR\s*'1'\s*=\s*'1/i,
    /UNION\s+SELECT/i,
    /;\s*DROP\s+TABLE/i
  ];

  static analyze(rawQueryInput: string): QueryAnalysis {
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(rawQueryInput)) {
        return { isTainted: true, detectedTaintPattern: pattern.source };
      }
    }
    return { isTainted: false };
  }
}

const safeInput = 'john.doe';
const maliciousSql = "admin' OR '1'='1";
console.log('Snippet 1 Safe Query Detected:', !SqlTaintAnalyzer.analyze(safeInput).isTainted);
console.log('Snippet 1 SQLi Taint Detected:', SqlTaintAnalyzer.analyze(maliciousSql).isTainted);

// Snippet 2: Parameterized Query Engine
interface ParameterizedQuery {
  sql: string;
  params: (string | number)[];
}

class ParameterizedQueryBuilder {
  static buildUserLookup(username: string, tenantId: number): ParameterizedQuery {
    return {
      sql: 'SELECT id, username, email, role FROM users WHERE username = ? AND tenant_id = ?',
      params: [username, tenantId]
    };
  }
}

const pq = ParameterizedQueryBuilder.buildUserLookup("admin' OR '1'='1", 101);
console.log('Snippet 2 Parameterized SQL:', pq.sql.includes('?'));
console.log('Snippet 2 Parameter Escaped Safely:', pq.params[0] === "admin' OR '1'='1");

// Snippet 3: NoSQL Injection Sanitizer
class MongoQuerySanitizer {
  static sanitize(input: any): any {
    if (typeof input !== 'object' || input === null) {
      return input;
    }
    if (Array.isArray(input)) {
      return input.map(item => this.sanitize(item));
    }
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      if (key.startsWith('$')) {
        throw new Error(`Disallowed Mongo operator detected: ${key}`);
      }
      clean[key] = this.sanitize(value);
    }
    return clean;
  }
}

const cleanObj = MongoQuerySanitizer.sanitize({ username: 'alice', active: true });
console.log('Snippet 3 Clean NoSQL Query Allowed:', cleanObj.username === 'alice');
let blockedOperator = false;
try {
  MongoQuerySanitizer.sanitize({ username: { $ne: null } });
} catch (e) {
  blockedOperator = true;
}
console.log('Snippet 3 $ne Operator Blocked:', blockedOperator);

// Snippet 4: Command Injection Defense - Argument Vectorization
interface SafeCommandExecution {
  command: string;
  args: string[];
}

class SafeProcessExecutor {
  static buildSafePing(host: string): SafeCommandExecution {
    // Disallow shell characters and enforce hostname/ip regex
    const hostRegex = /^[a-zA-Z0-9.-]+$/;
    if (!hostRegex.test(host)) {
      throw new Error('Invalid host format: shell metacharacters disallowed');
    }
    return {
      command: 'ping',
      args: ['-c', '4', host]
    };
  }
}

const safePing = SafeProcessExecutor.buildSafePing('example.com');
console.log('Snippet 4 Safe Ping Formed:', safePing.args[2] === 'example.com');
let cmdInjected = false;
try {
  SafeProcessExecutor.buildSafePing('example.com; rm -rf /');
} catch {
  cmdInjected = true;
}
console.log('Snippet 4 Command Injection Blocked:', cmdInjected);

// Snippet 5: Production Injection Defense Gateway Benchmark
class ProductionInjectionGateway {
  inspectRequest(sqlInput: string, nosqlInput: any, cmdHost: string): { certified: boolean; violations: string[] } {
    const violations: string[] = [];

    if (SqlTaintAnalyzer.analyze(sqlInput).isTainted) {
      violations.push('SQLi pattern detected');
    }

    try {
      MongoQuerySanitizer.sanitize(nosqlInput);
    } catch {
      violations.push('NoSQL operator injection detected');
    }

    try {
      SafeProcessExecutor.buildSafePing(cmdHost);
    } catch {
      violations.push('Command metacharacters detected');
    }

    return {
      certified: violations.length === 0,
      violations
    };
  }
}

const gw = new ProductionInjectionGateway();
const cleanReport = gw.inspectRequest('alice', { user: 'alice' }, '127.0.0.1');
const attackReport = gw.inspectRequest(maliciousSql, { user: { $gt: '' } }, 'localhost; ls');
console.log('Snippet 5 Gateway Clean Request Certified:', cleanReport.certified);
console.log('Snippet 5 Gateway Attacks Intercepted Count:', attackReport.violations.length === 3);
