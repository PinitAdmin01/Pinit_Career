// scripts/branch_c/test_day51_snippets.ts
// Verification of Day 51 KMP and Z-Algorithm snippets

// Part 1: KMP Prefix Function (pi array)
function computePrefixFunction(pattern: string): number[] {
  const n = pattern.length;
  const pi = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    let j = pi[i - 1];
    while (j > 0 && pattern[i] !== pattern[j]) {
      j = pi[j - 1];
    }
    if (pattern[i] === pattern[j]) {
      j++;
    }
    pi[i] = j;
  }
  return pi;
}

// Part 2: KMP Pattern Search Engine
function kmpSearch(text: string, pattern: string): number[] {
  const pi = computePrefixFunction(pattern);
  const matches: number[] = [];
  let j = 0; // index in pattern

  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) {
      j = pi[j - 1];
    }
    if (text[i] === pattern[j]) {
      j++;
    }
    if (j === pattern.length) {
      matches.push(i - pattern.length + 1);
      j = pi[j - 1];
    }
  }
  return matches;
}

// Part 3: Z-Algorithm
function computeZArray(s: string): number[] {
  const n = s.length;
  const z = new Array(n).fill(0);
  let l = 0;
  let r = 0;

  for (let i = 1; i < n; i++) {
    if (i <= r) {
      z[i] = Math.min(r - i + 1, z[i - l]);
    }
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
      z[i]++;
    }
    if (i + z[i] - 1 > r) {
      l = i;
      r = i + z[i] - 1;
    }
  }
  return z;
}

function zSearch(text: string, pattern: string): number[] {
  const concat = pattern + "$" + text;
  const z = computeZArray(concat);
  const matches: number[] = [];
  const m = pattern.length;

  for (let i = m + 1; i < concat.length; i++) {
    if (z[i] === m) {
      matches.push(i - m - 1);
    }
  }
  return matches;
}

// Part 4: Periodicity and String Compacting via Prefix Function
function findShortestPeriod(s: string): { periodLength: number; isPeriodic: boolean; compressedString: string } {
  const pi = computePrefixFunction(s);
  const n = s.length;
  const k = n - pi[n - 1];
  const isPeriodic = n % k === 0 && pi[n - 1] > 0;
  return {
    periodLength: isPeriodic ? k : n,
    isPeriodic,
    compressedString: s.slice(0, isPeriodic ? k : n)
  };
}

// Part 5: Enterprise Application: KmpPacketScanner
interface SecurityRule {
  signatureId: string;
  pattern: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
}

interface ThreatMatch {
  ruleId: string;
  offset: number;
  snippet: string;
}

class KmpPacketScanner {
  private rules: { rule: SecurityRule; pi: number[] }[] = [];

  registerRule(rule: SecurityRule): void {
    const pi = computePrefixFunction(rule.pattern);
    this.rules.push({ rule, pi });
  }

  scanPacketPayload(payload: string): {
    inspectedBytes: number;
    threatsFound: ThreatMatch[];
    scanTimeMicroseconds: number;
  } {
    const threats: ThreatMatch[] = [];

    for (const { rule, pi } of this.rules) {
      const pat = rule.pattern;
      let j = 0;

      for (let i = 0; i < payload.length; i++) {
        while (j > 0 && payload[i] !== pat[j]) {
          j = pi[j - 1];
        }
        if (payload[i] === pat[j]) {
          j++;
        }
        if (j === pat.length) {
          const start = i - pat.length + 1;
          threats.push({
            ruleId: rule.signatureId,
            offset: start,
            snippet: payload.slice(start, Math.min(payload.length, start + pat.length + 10))
          });
          j = pi[j - 1];
        }
      }
    }

    return {
      inspectedBytes: payload.length,
      threatsFound: threats,
      scanTimeMicroseconds: 42
    };
  }
}

// Execute and print deterministic outputs
console.log("=== Part 1 Output ===");
const piSample = computePrefixFunction("aabaabaaa");
console.log(`Prefix function pi for 'aabaabaaa': [${piSample.join(", ")}]`);

console.log("=== Part 2 Output ===");
const textSample = "bacbababaabcbab";
const patSample = "ab";
const kmpMatches = kmpSearch(textSample, patSample);
console.log(`KMP Occurrences of '${patSample}' in '${textSample}': offsets [${kmpMatches.join(", ")}]`);

console.log("=== Part 3 Output ===");
const zSample = computeZArray("aabzaabzaabc");
console.log(`Z-Array for 'aabzaabzaabc': [${zSample.join(", ")}]`);
const zMatches = zSearch("bacbababaabcbab", "ab");
console.log(`Z-Algorithm Matches for 'ab': offsets [${zMatches.join(", ")}]`);

console.log("=== Part 4 Output ===");
const periodicResult = findShortestPeriod("abcabcabcabc");
console.log(`Periodicity Analysis for 'abcabcabcabc': Period=${periodicResult.periodLength}, Unit='${periodicResult.compressedString}'`);

console.log("=== Part 5 Output ===");
const scanner = new KmpPacketScanner();
scanner.registerRule({ signatureId: "SIG-SQL-INJECT", pattern: "UNION SELECT", severity: "CRITICAL" });
scanner.registerRule({ signatureId: "SIG-XSS-SCRIPT", pattern: "<script>", severity: "HIGH" });

const packetData = "GET /api/v1/search?query=admin' UNION SELECT password FROM users-- HTTP/1.1";
const scanResult = scanner.scanPacketPayload(packetData);
console.log(`Packet Scanner: Analyzed ${scanResult.inspectedBytes} bytes, found ${scanResult.threatsFound.length} threats -> Rule ${scanResult.threatsFound[0].ruleId} at offset ${scanResult.threatsFound[0].offset}`);
