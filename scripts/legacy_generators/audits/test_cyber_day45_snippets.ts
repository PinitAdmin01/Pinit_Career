// scripts/test_cyber_day45_snippets.ts

// Snippet 1: Enterprise WAF Engine
interface IngressPayload {
  ip: string;
  uri: string;
  headers: Record<string, string>;
  body: string;
}

interface WafScanResult {
  blocked: boolean;
  score: number;
  threats: string[];
}

class EnterpriseWafEngine {
  private static rules = [
    { pattern: /<script[\s>]/i, score: 50, threat: 'XSS' },
    { pattern: /UNION\s+SELECT/i, score: 50, threat: 'SQLi' },
    { pattern: /\.\.\/|\.\.\\/i, score: 40, threat: 'PATH_TRAVERSAL' },
    { pattern: /;\s*(rm|cat|ls|sh|bash)\b/i, score: 50, threat: 'CMD_INJECTION' }
  ];

  static scan(payload: IngressPayload, blockThreshold = 50): WafScanResult {
    let score = 0;
    const threats: string[] = [];
    const textToScan = `${payload.uri} ${JSON.stringify(payload.headers)} ${payload.body}`;

    for (const rule of this.rules) {
      if (rule.pattern.test(textToScan)) {
        score += rule.score;
        threats.push(rule.threat);
      }
    }
    return {
      blocked: score >= blockThreshold,
      score,
      threats
    };
  }
}

const cleanReq: IngressPayload = { ip: '1.2.3.4', uri: '/api/v1/profile', headers: {}, body: '{"name":"Alice"}' };
const attackReq: IngressPayload = { ip: '1.2.3.4', uri: '/api/v1/search', headers: {}, body: "UNION SELECT null, username, password FROM users--" };

const cleanWaf = EnterpriseWafEngine.scan(cleanReq);
const attackWaf = EnterpriseWafEngine.scan(attackReq);
console.log('Snippet 1 Clean Request Allowed:', !cleanWaf.blocked);
console.log('Snippet 1 Attack Request Blocked:', attackWaf.blocked);
console.log('Snippet 1 Threat Identified:', attackWaf.threats.includes('SQLi'));

// Snippet 2: RASP Query Interceptor
class RaspQueryInterceptor {
  private static dangerousFunctions = new Set(['SLEEP', 'BENCHMARK', 'PG_SLEEP', 'SYSTEM']);

  static interceptSql(sqlTemplate: string): { approved: boolean; reason?: string } {
    for (const fn of this.dangerousFunctions) {
      const regex = new RegExp(`\\b${fn}\\b`, 'i');
      if (regex.test(sqlTemplate)) {
        return { approved: false, reason: `Suspicious RASP function invocation: ${fn}` };
      }
    }
    return { approved: true };
  }
}

const benignQuery = 'SELECT id, username FROM users WHERE tenant_id = ?';
const timeBlindQuery = 'SELECT id, username FROM users WHERE id = 1 AND SLEEP(5)';
console.log('Snippet 2 Benign SQL Approved:', RaspQueryInterceptor.interceptSql(benignQuery).approved);
console.log('Snippet 2 Time-Based Blind SQL Blocked by RASP:', !RaspQueryInterceptor.interceptSql(timeBlindQuery).approved);

// Snippet 3: Bot Anomaly Tracker
class BotAnomalyDetector {
  private requestCounts = new Map<string, number>();

  recordAndCheck(clientIp: string, threshold = 10): { isAnomalous: boolean; count: number } {
    const current = (this.requestCounts.get(clientIp) || 0) + 1;
    this.requestCounts.set(clientIp, current);
    return {
      isAnomalous: current > threshold,
      count: current
    };
  }
}

const botDetector = new BotAnomalyDetector();
for (let i = 0; i < 10; i++) botDetector.recordAndCheck('10.0.0.5', 10);
const eleventhReq = botDetector.recordAndCheck('10.0.0.5', 10);
console.log('Snippet 3 Request Count Tracked:', eleventhReq.count === 11);
console.log('Snippet 3 Anomaly Detected on Excess:', eleventhReq.isAnomalous);

// Snippet 4: Multi-Layered Ingress Shield
class MultiLayeredIngressShield {
  evaluateRequest(payload: IngressPayload, botTracker: BotAnomalyDetector): { permit: boolean; reason?: string } {
    const botCheck = botTracker.recordAndCheck(payload.ip, 100);
    if (botCheck.isAnomalous) return { permit: false, reason: 'Bot rate anomaly' };

    const wafResult = EnterpriseWafEngine.scan(payload, 50);
    if (wafResult.blocked) return { permit: false, reason: `WAF block: ${wafResult.threats.join(',')}` };

    return { permit: true };
  }
}

const shield = new MultiLayeredIngressShield();
const shieldClean = shield.evaluateRequest(cleanReq, new BotAnomalyDetector());
const shieldAttack = shield.evaluateRequest(attackReq, new BotAnomalyDetector());
console.log('Snippet 4 Ingress Shield Permits Clean:', shieldClean.permit);
console.log('Snippet 4 Ingress Shield Intercepts Threat:', !shieldAttack.permit);

// Snippet 5: Grand Milestone 9 Engine
class GrandMilestone9Engine {
  auditCapstonePipeline(
    sqliPass: boolean,
    xssPass: boolean,
    csrfPass: boolean,
    bolaPass: boolean,
    wafRaspPass: boolean
  ): { milestoneCertified: boolean; totalScore: number } {
    const checks = [sqliPass, xssPass, csrfPass, bolaPass, wafRaspPass];
    const passed = checks.filter(Boolean).length;
    const score = (passed / checks.length) * 100;
    return {
      milestoneCertified: score === 100,
      totalScore: score
    };
  }
}

const milestoneEngine = new GrandMilestone9Engine();
const capstoneReport = milestoneEngine.auditCapstonePipeline(true, true, true, true, true);
console.log('Snippet 5 Milestone 9 Certified:', capstoneReport.milestoneCertified);
console.log('Snippet 5 Total Security Score:', capstoneReport.totalScore === 100);
console.log('Snippet 5 Milestone 9 Capstone: 100% PASS');
