// scripts/test_cyber_day52_snippets.ts
import assert from 'node:assert';

// Snippet 1: Pyramid of Pain & Threat Indicator Classifier
type IndicatorType = 'HASH' | 'IP' | 'DOMAIN' | 'ARTIFACT' | 'TOOL' | 'TTP';

interface ThreatIndicator {
  type: IndicatorType;
  value: string;
  mitreTechniqueId?: string;
}

class PyramidOfPainEvaluator {
  static getPainLevel(type: IndicatorType): { painLevel: string; adversaryCost: number } {
    const table: Record<IndicatorType, { painLevel: string; adversaryCost: number }> = {
      HASH: { painLevel: 'Trivial', adversaryCost: 1 },
      IP: { painLevel: 'Easy', adversaryCost: 2 },
      DOMAIN: { painLevel: 'Simple', adversaryCost: 3 },
      ARTIFACT: { painLevel: 'Annoying', adversaryCost: 4 },
      TOOL: { painLevel: 'Challenging', adversaryCost: 5 },
      TTP: { painLevel: 'Tough', adversaryCost: 6 }
    };
    return table[type];
  }
}

const indicator1: ThreatIndicator = { type: 'TTP', value: 'Process Hollowing Injection', mitreTechniqueId: 'T1055.012' };
const pain1 = PyramidOfPainEvaluator.getPainLevel(indicator1.type);
assert.strictEqual(pain1.painLevel, 'Tough');
assert.strictEqual(pain1.adversaryCost, 6);

// Snippet 2: MITRE ATT&CK Coverage Matrix Analyzer
interface AttackTechnique {
  id: string;
  name: string;
  tactic: 'initial-access' | 'execution' | 'persistence' | 'lateral-movement' | 'exfiltration';
  coveredByDetectionRule: boolean;
}

class MitreCoverageAnalyzer {
  static calculateTacticalCoverage(techniques: AttackTechnique[]): { coveragePercent: number; uncoveredIds: string[] } {
    const covered = techniques.filter(t => t.coveredByDetectionRule).length;
    const uncovered = techniques.filter(t => !t.coveredByDetectionRule).map(t => t.id);
    return {
      coveragePercent: (covered / techniques.length) * 100,
      uncoveredIds: uncovered
    };
  }
}

const matrix: AttackTechnique[] = [
  { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'initial-access', coveredByDetectionRule: true },
  { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'execution', coveredByDetectionRule: true },
  { id: 'T1078', name: 'Valid Accounts', tactic: 'persistence', coveredByDetectionRule: true },
  { id: 'T1021', name: 'Remote Services', tactic: 'lateral-movement', coveredByDetectionRule: true },
  { id: 'T1048', name: 'Exfiltration Over Alternative Protocol', tactic: 'exfiltration', coveredByDetectionRule: true }
];
const coverage = MitreCoverageAnalyzer.calculateTacticalCoverage(matrix);
assert.strictEqual(coverage.coveragePercent, 100);
assert.strictEqual(coverage.uncoveredIds.length, 0);

// Snippet 3: Sigma Rule Parser & SIEM Query Transpiler
interface SigmaRule {
  title: string;
  id: string;
  status: string;
  logsource: { category: string; product?: string };
  detection: {
    selection: Record<string, string | string[]>;
    condition: string;
  };
  level: 'low' | 'medium' | 'high' | 'critical';
}

class SigmaQueryTranspiler {
  static toSplunkQuery(rule: SigmaRule): string {
    const clauses: string[] = [];
    for (const [key, val] of Object.entries(rule.detection.selection)) {
      if (Array.isArray(val)) {
        const orClauses = val.map(v => `${key}="${v}"`).join(' OR ');
        clauses.push(`(${orClauses})`);
      } else {
        clauses.push(`${key}="${val}"`);
      }
    }
    return `index=* sourcetype=${rule.logsource.category} ${clauses.join(' AND ')}`;
  }
}

const testSigma: SigmaRule = {
  title: 'Suspicious PowerShell Download Cradle',
  id: 'f87a8409-222a-4a2b-9e4b-76b9cf4b2d18',
  status: 'production',
  logsource: { category: 'process_creation', product: 'windows' },
  detection: {
    selection: {
      Image: '*\\powershell.exe',
      CommandLine: ['*Net.WebClient*', '*DownloadString*', '*Invoke-WebRequest*']
    },
    condition: 'selection'
  },
  level: 'high'
};
const splunkQuery = SigmaQueryTranspiler.toSplunkQuery(testSigma);
assert.ok(splunkQuery.includes('Image="*\\powershell.exe"'));
assert.ok(splunkQuery.includes('CommandLine="*DownloadString*"'));

// Snippet 4: YARA Malware Pattern Matcher
interface YaraRuleSpec {
  name: string;
  strings: { identifier: string; pattern: string; isHex: boolean }[];
  conditionLogic: (matchedIdentifiers: Set<string>, fileSize: number) => boolean;
}

class YaraScanner {
  static scanBuffer(buffer: Buffer, rule: YaraRuleSpec): { matched: boolean; matchedStrings: string[] } {
    const text = buffer.toString('utf-8');
    const matched = new Set<string>();

    for (const str of rule.strings) {
      if (!str.isHex) {
        if (text.includes(str.pattern)) {
          matched.add(str.identifier);
        }
      }
    }

    const isMatch = rule.conditionLogic(matched, buffer.length);
    return {
      matched: isMatch,
      matchedStrings: Array.from(matched)
    };
  }
}

const webshellRule: YaraRuleSpec = {
  name: 'Detect_PHP_Webshell',
  strings: [
    { identifier: '$eval', pattern: 'eval(base64_decode(', isHex: false },
    { identifier: '$cmd', pattern: 'system($_REQUEST[', isHex: false },
    { identifier: '$shell', pattern: 'passthru(', isHex: false }
  ],
  conditionLogic: (matched, size) => size < 50000 && matched.size >= 1
};
const mockMalwareBuffer = Buffer.from('<?php eval(base64_decode($_POST["code"])); ?>', 'utf-8');
const yaraResult = YaraScanner.scanBuffer(mockMalwareBuffer, webshellRule);
assert.strictEqual(yaraResult.matched, true);
assert.ok(yaraResult.matchedStrings.includes('$eval'));

// Snippet 5: Production Threat Hunting & Detection Engine Benchmark
interface ThreatHuntingEngineHealth {
  mitreCoveragePercent: number;
  sigmaRulesActive: number;
  yaraSignaturesVerified: number;
  huntingHypothesesTested: number;
  ttpDetectionRatio: number;
}

class ProductionThreatHuntingPlatform {
  static certifyPlatform(health: ThreatHuntingEngineHealth): { certified: boolean; score: number } {
    const checks = [
      health.mitreCoveragePercent >= 90,
      health.sigmaRulesActive >= 10,
      health.yaraSignaturesVerified >= 10,
      health.huntingHypothesesTested >= 5,
      health.ttpDetectionRatio >= 0.8
    ];
    const score = (checks.filter(Boolean).length / 5) * 100;
    return {
      certified: score === 100,
      score
    };
  }
}

const huntHealth: ThreatHuntingEngineHealth = {
  mitreCoveragePercent: 100,
  sigmaRulesActive: 25,
  yaraSignaturesVerified: 15,
  huntingHypothesesTested: 8,
  ttpDetectionRatio: 0.95
};
const certHunt = ProductionThreatHuntingPlatform.certifyPlatform(huntHealth);
assert.strictEqual(certHunt.certified, true);
assert.strictEqual(certHunt.score, 100);

console.log('All 5 Cyber Day 52 snippets passed unit tests!');
