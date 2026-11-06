/**
 * Day 37 - Part 5: Enterprise Application - StreamLogKMPMatcher
 */

interface LogStreamIncident {
  signature: string;
  matchCount: number;
  offsets: number[];
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}

class StreamLogKMPMatcher {
  private signature: string;
  private pi: number[];
  private severity: 'CRITICAL' | 'WARNING' | 'INFO';

  constructor(signature: string, severity: 'CRITICAL' | 'WARNING' | 'INFO' = 'CRITICAL') {
    this.signature = signature;
    this.severity = severity;
    this.pi = this.buildFailureTable(signature);
  }

  private buildFailureTable(p: string): number[] {
    const m = p.length;
    const pi = new Array(m).fill(0);
    for (let i = 1; i < m; i++) {
      let j = pi[i - 1];
      while (j > 0 && p[i] !== p[j]) {
        j = pi[j - 1];
      }
      if (p[i] === p[j]) j++;
      pi[i] = j;
    }
    return pi;
  }

  // Processes incoming raw stream chunks without buffer concatenation
  scanLogChunk(chunk: string, activeState: number = 0): { incident: LogStreamIncident; nextState: number } {
    let j = activeState;
    const offsets: number[] = [];
    const m = this.signature.length;

    for (let i = 0; i < chunk.length; i++) {
      while (j > 0 && chunk[i] !== this.signature[j]) {
        j = this.pi[j - 1];
      }
      if (chunk[i] === this.signature[j]) {
        j++;
      }
      if (j === m) {
        offsets.push(i - m + 1);
        j = this.pi[j - 1];
      }
    }

    return {
      incident: {
        signature: this.signature,
        matchCount: offsets.length,
        offsets,
        severity: this.severity
      },
      nextState: j
    };
  }
}

function runEnterpriseLogStreamPipeline(): void {
  console.log("=== StreamLogKMPMatcher: Enterprise Log Surveillance Pipeline ===");

  const errorSignature = "502_BAD_GATEWAY";
  const matcher = new StreamLogKMPMatcher(errorSignature, 'CRITICAL');

  // Simulated streaming log chunks from distributed ingress proxies
  const chunk1 = "2026-10-25T01:00:12Z [INFO] Gateway alive | 2026-10-25T01:00:13Z [ERROR] Status: 502_BAD_GATEWAY downstream timeout | ";
  const chunk2 = "2026-10-25T01:00:14Z [INFO] Retry request | 2026-10-25T01:00:15Z [ERROR] Status: 502_BAD_GATEWAY upstream reset | 2026-10-25T01:00:16Z [OK] Recovered";

  const res1 = matcher.scanLogChunk(chunk1, 0);
  console.log(`[StreamMatcher] Chunk 1 Scanned (${chunk1.length} bytes) - Incidents: ${res1.incident.matchCount} at offsets: [${res1.incident.offsets.join(", ")}]`);

  const res2 = matcher.scanLogChunk(chunk2, res1.nextState);
  console.log(`[StreamMatcher] Chunk 2 Scanned (${chunk2.length} bytes) - Incidents: ${res2.incident.matchCount} at offsets: [${res2.incident.offsets.join(", ")}]`);

  const totalIncidents = res1.incident.matchCount + res2.incident.matchCount;
  console.log(`[StreamMatcher] Total Critical Incidents Detected: ${totalIncidents} (Severity: ${matcher['severity']})`);
  console.log("[StreamMatcher] Surveillance Complete: Zero-copy streaming state preserved across chunk boundaries");
}

runEnterpriseLogStreamPipeline();
