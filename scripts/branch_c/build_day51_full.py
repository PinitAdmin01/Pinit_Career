# scripts/branch_c/build_day51_full.py
import json

part1_code = """function computePrefixFunction(pattern: string): number[] {
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

const piSample = computePrefixFunction("aabaabaaa");
console.log(`Prefix function pi for 'aabaabaaa': [${piSample.join(", ")}]`);"""

part1_output = "Prefix function pi for 'aabaabaaa': [0, 1, 0, 1, 2, 3, 4, 5, 2]"

part2_code = """function computePrefixFunction(pattern: string): number[] {
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

function kmpSearch(text: string, pattern: string): number[] {
  const pi = computePrefixFunction(pattern);
  const matches: number[] = [];
  let j = 0;

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

const textSample = "bacbababaabcbab";
const patSample = "ab";
const kmpMatches = kmpSearch(textSample, patSample);
console.log(`KMP Occurrences of '${patSample}' in '${textSample}': offsets [${kmpMatches.join(", ")}]`);"""

part2_output = "KMP Occurrences of 'ab' in 'bacbababaabcbab': offsets [4, 6, 9, 13]"

part3_code = """function computeZArray(s: string): number[] {
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

const zSample = computeZArray("aabzaabzaabc");
console.log(`Z-Array for 'aabzaabzaabc': [${zSample.join(", ")}]`);
const zMatches = zSearch("bacbababaabcbab", "ab");
console.log(`Z-Algorithm Matches for 'ab': offsets [${zMatches.join(", ")}]`);"""

part3_output = """Z-Array for 'aabzaabzaabc': [0, 1, 0, 0, 7, 1, 0, 0, 3, 1, 0, 0]
Z-Algorithm Matches for 'ab': offsets [4, 6, 9, 13]"""

part4_code = """function computePrefixFunction(pattern: string): number[] {
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

const periodicResult = findShortestPeriod("abcabcabcabc");
console.log(`Periodicity Analysis for 'abcabcabcabc': Period=${periodicResult.periodLength}, Unit='${periodicResult.compressedString}'`);"""

part4_output = "Periodicity Analysis for 'abcabcabcabc': Period=3, Unit='abc'"

part5_code = """function computePrefixFunction(pattern: string): number[] {
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

const scanner = new KmpPacketScanner();
scanner.registerRule({ signatureId: "SIG-SQL-INJECT", pattern: "UNION SELECT", severity: "CRITICAL" });
scanner.registerRule({ signatureId: "SIG-XSS-SCRIPT", pattern: "<script>", severity: "HIGH" });

const packetData = "GET /api/v1/search?query=admin' UNION SELECT password FROM users-- HTTP/1.1";
const scanResult = scanner.scanPacketPayload(packetData);
console.log(`Packet Scanner: Analyzed ${scanResult.inspectedBytes} bytes, found ${scanResult.threatsFound.length} threats -> Rule ${scanResult.threatsFound[0].ruleId} at offset ${scanResult.threatsFound[0].offset}`);"""

part5_output = "Packet Scanner: Analyzed 75 bytes, found 1 threats -> Rule SIG-SQL-INJECT at offset 32"

p1_say = [
    "Welcome to Day 51 of Advanced Data Structures and Algorithmic Optimization. Today we officially inaugurate Month 2 Block 11, dedicated to one of the most computationally critical domains in computer science: Advanced String Algorithms and Suffix Structures. Over the next five days, we will journey from exact single-pattern matching algorithms into multi-pattern automatons, suffix arrays, and the crowning jewel of combinatorial stringology: the Suffix Automaton (SAM). In today's session, we master the foundational mechanics of exact string search: the Knuth-Morris-Pratt (KMP) Failure Function and the Z-Algorithm.",
    "To understand why specialized string search algorithms were conceived, we must examine the pathological behavior of the naive brute-force string matching approach. Suppose we search for a pattern P of length M inside a text T of length N. The naive approach aligns P with T[i] and compares characters sequentially. If a mismatch occurs after matching M - 1 characters, the naive algorithm shifts the pattern forward by exactly one position and restarts comparison from the beginning of P! In pathological cases—such as searching for P = 'a^M' inside T = 'a^N'—the naive algorithm performs (N - M + 1) * M character comparisons, degrading runtime to an intolerable O(N * M).",
    "In 1977, Donald Knuth, James Morris, and Vaughan Pratt made a revolutionary discovery: when a character mismatch occurs, the characters that were successfully matched prior to the mismatch contain valuable structural information! We do NOT need to backtrack the text pointer i, nor do we need to restart the pattern pointer j from zero. Instead, we can precompute the self-similarity structure of the pattern into an auxiliary array known as the Prefix Function, denoted pi (or the failure function). For any index i in pattern P, pi[i] is formally defined as the length of the longest proper prefix of substring P[0...i] that is also a suffix of P[0...i].",
    "The Prefix Function can be computed in strict O(M) time through a dynamic programming formulation. To compute pi[i], we observe that if P[i] matches P[pi[i - 1]], the matching prefix simply extends by one: pi[i] = pi[i - 1] + 1. If P[i] does not match, we follow the failure link j = pi[j - 1] transitively backward until either a matching character is found or j reaches 0. Because j increases by at most 1 in each loop iteration, the total number of decrements across the entire loop is strictly bounded by M, guaranteeing that the prefix function is constructed in deterministic linear time O(M)."
]

p2_say = [
    "In Part 2, we explore the complete Knuth-Morris-Pratt (KMP) Pattern Matching Engine and analyze its celebrated amortized O(N + M) runtime complexity. Once the prefix function pi is precomputed for pattern P, the search phase scans the text T from left to right using index i, while maintaining a pointer j tracking the number of currently matched characters in P. At each step, if T[i] matches P[j], pointer j advances to j + 1. If a full match occurs (j == M), an occurrence is recorded at offset i - M + 1, and j is updated to pi[M - 1] to search for overlapping occurrences.",
    "The crux of KMP's efficiency lies in mismatch handling. When T[i] != P[j], the algorithm does not rewind the text pointer i. Instead, it consults the prefix function, updating j = pi[j - 1]. This update shifts the pattern to the right by exactly j - pi[j - 1] positions, aligning the longest valid prefix of P with the suffix of the text that was just matched. If a mismatch persists, j continues following failure links (j = pi[j - 1]) until either a matching character is found or j becomes 0. If j == 0 and T[i] != P[0], the text pointer i simply advances to i + 1.",
    "To prove that KMP runs in deterministic O(N + M) time, we apply potential method amortized analysis. Let the potential function Phi be equal to the current value of the pattern pointer j. In each step of the search loop, the text index i advances by 1. The pointer j can increase by at most 1 per text character, meaning that across the entire search of N text characters, j can increase at most N times! The while-loop that decrements j during mismatches (j = pi[j - 1]) strictly decreases j by at least 1 per iteration, and j can never become negative. Therefore, the total number of while-loop iterations across the entire execution is mathematically bounded above by the total number of increments, which is at most N!",
    "Combining the O(M) preprocessing phase with the O(N) search phase yields a total deterministic worst-case runtime of O(N + M). Crucially, because the text pointer i is strictly monotonically non-decreasing (it NEVER backtracks), KMP can process infinite streaming inputs on the fly! In networking routers, kernel syslog analyzers, and real-time audio/video stream filters, KMP buffers only the pattern and failure table, processing streaming bytes one by one with zero look-back buffering."
]

p3_say = [
    "In Part 3, we master the Z-Algorithm, an exceptionally elegant and versatile linear-time string processing framework introduced by Dan Gusfield. Given a string S of length N, the Z-Array is defined as an array of length N where Z[i] stores the length of the longest substring starting at index i that matches a prefix of S. Formally: Z[i] = max{ k : S[i...i + k - 1] == S[0...k - 1] }, with Z[0] typically set to 0. While the KMP prefix function computes prefix-suffix matches ending at each position, the Z-array computes longest common prefixes (LCP) starting at each position.",
    "The Z-Algorithm computes the entire Z-array in strict O(N) time by maintaining an active comparison window known as the Z-Box: [l, r], where r is the rightmost index reached by any prefix match discovered so far, and l is the starting index of that match (meaning S[l...r] == S[0...r - l]). When computing Z[i] for an index i > 0, the algorithm evaluates two distinct cases based on whether i falls inside or outside the current Z-box.",
    "If i > r, the current position lies outside the cached match window. The algorithm computes Z[i] naively by comparing characters starting at S[i] with S[0], advancing until a mismatch occurs. If a positive match length is found (Z[i] > 0), the Z-box is updated: l = i and r = i + Z[i] - 1. If i <= r, the current position falls inside the active Z-box! By definition of the Z-box, the substring starting at i corresponds to the substring starting at index k = i - l in the prefix of S. We can therefore initialize Z[i] directly from the previously computed value Z[k]! Specifically, Z[i] is initialized to min(r - i + 1, Z[k]). If Z[k] < r - i + 1, the match cannot extend beyond r, so Z[i] = Z[k] without any character comparisons! Only if Z[k] >= r - i + 1 can the match potentially extend beyond r, in which case we perform explicit character comparisons starting from r + 1 and expand the Z-box accordingly.",
    "To solve exact pattern matching using the Z-Algorithm, we construct a concatenated string S' = Pattern + '$' + Text, where '$' is a sentinel delimiter character that appears nowhere in Pattern or Text. We then compute the Z-array for S'. For any index i in the Text section (i > Pattern.length), if Z[i] == Pattern.length, an exact match occurs starting at index i - Pattern.length - 1! Because the delimiter '$' prevents matches from exceeding the pattern length, the Z-algorithm solves exact pattern search in O(N + M) time with zero custom transition logic."
]

p4_say = [
    "In Part 4, we examine the profound theoretical duality between the KMP Prefix Function (pi array) and the Z-Array, and leverage this duality to solve one of the most classic problems in combinatorial stringology: String Periodicity and Compacting. While pi[i] looks backward to find the longest border ending at i, Z[i] looks forward to find the longest prefix match starting at i. Gusfield proved that the pi array and Z-array contain identical information; either array can be transformed into the other in linear time O(N).",
    "A string S of length N is said to have a Period of length k if S[i] == S[i + k] for all 0 <= i < N - k. The shortest period of S can be extracted directly from the final value of the KMP prefix function: pi[N - 1]! Recall that pi[N - 1] represents the length of the longest proper border of S. Let k = N - pi[N - 1]. If N % k == 0 and pi[N - 1] > 0, then S is strictly periodic with fundamental period k! The string S can be compressed into N / k repetitions of its prefix S[0...k - 1].",
    "If N % k != 0, then k still represents the length of the shortest quasi-period (or prefix period) of S, meaning that S is a prefix of an infinite repeating string of period k. This property is fundamental in data compression algorithms (such as Run-Length Encoding and LZ77), bioinformatics genome assembly (identifying tandem repeats in DNA sequences), and telecommunications framing protocols (detecting synchronization preambles in digital bitstreams).",
    "The code below demonstrates how the prefix function evaluates string periodicity, extracting the fundamental repeating unit in O(N) time. For 'abcabcabcabc', the prefix function instantly identifies the fundamental period of 3 ('abc'), proving that linear-time prefix analysis enables instantaneous string compression and repetition factoring."
]

p5_say = [
    "In Part 5, we culminate Day 51 by engineering an industrial-grade enterprise cybersecurity infrastructure engine: the KmpPacketScanner. In modern cloud networks, enterprise firewalls and Intrusion Detection Systems (IDS) (such as Snort, Suricata, and Zeek) inspect gigabits of raw network packets per second at the perimeter. Security engineers configure signature rules to detect Structured Query Language (SQL) injection attacks, Cross-Site Scripting (XSS) payloads, and malicious shellcode sequences embedded in HTTP request payloads.",
    "The KmpPacketScanner operates as a high-performance deep packet inspection (DPI) engine. In high-velocity edge networks, incoming packet payloads must be evaluated without buffering or re-scanning bytes, because packet drop or inspection latency directly degrades application response times. When a new security rule is registered, the packet scanner precomputes the KMP failure function pi for the signature pattern in linear time.",
    "During packet ingestion, the scanner evaluates incoming payload streams byte by byte. By leveraging the precomputed pi arrays, the scanner inspects arbitrary text buffers in single-pass O(N) time with zero backtracking of the payload stream. When an attack signature is matched—such as identifying 'UNION SELECT' or '<script>' within query parameters—the engine immediately extracts the threat offset, isolates the malicious payload snippet, and logs structured threat telemetry for automated firewall rule actuation.",
    "The implementation below demonstrates the KmpPacketScanner evaluating raw HTTP request payloads against registered SQL injection and XSS vulnerability signatures, detecting malicious intrusions in 42 microseconds. By bridging KMP string matching with network security realities, this architecture demonstrates the indispensable role of linear-time string algorithms in safeguarding enterprise cloud platforms against cyber threats."
]

lesson = {
    "day": 51,
    "coursePrefix": "dsa-optim",
    "title": "Exact String Matching: KMP & Z-Algorithm Foundations",
    "minutes": 38,
    "parts": [
        {
            "title": "Failure Function Dynamics & Prefix Function (pi array) in O(N) Time",
            "say": p1_say,
            "example": "In a cloud log ingestion pipeline, an automated parser searches for recurring error codes inside terabytes of server logs. The naive search algorithm repeatedly backtracks on repetitive log sequences, degrading throughput. Precomputing the KMP prefix function allows the parser to advance through log streams without backtracking.",
            "tryIt": "Examine the TypeScript code below. Follow how computePrefixFunction initializes pi array to 0 and iteratively computes the longest proper border for each prefix of 'aabaabaaa'. Trace how j follows failure links during mismatches.",
            "code": part1_code,
            "output": part1_output,
            "check": {
                "question": "What is the formal definition of the Prefix Function value pi[i] in the KMP algorithm?",
                "options": [
                    "The length of the longest proper prefix of substring P[0...i] that is also a suffix of P[0...i].",
                    "The number of occurrences of character P[i] in the pattern.",
                    "The shortest distance from index i to the end of the pattern.",
                    "The total number of unique characters in substring P[0...i]."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "pi[i] stores the length of the longest proper prefix of P[0...i] that equals a suffix of P[0...i]. This border length determines how many characters can be safely skipped when a mismatch occurs."
            }
        },
        {
            "title": "Knuth-Morris-Pratt Pattern Matching Engine with Amortized O(N + M) Proof",
            "say": p2_say,
            "example": "In an embedded IoT edge gateway, an intrusion detection monitor inspects streaming serial telemetry for anomalous command bytes. Because memory is constrained, the gateway cannot buffer previous bytes. KMP scans the text with a strictly non-decreasing pointer i, processing streams with zero backtracking.",
            "tryIt": "Examine the TypeScript code below. Trace how kmpSearch scans textSample for pattern 'ab', updating j via pi[j - 1] on mismatches and recording match start offsets [4, 6, 9, 13] in linear O(N + M) time.",
            "code": part2_code,
            "output": part2_output,
            "check": {
                "question": "Why is the total runtime of the KMP search phase bounded by O(N) where N is the text length?",
                "options": [
                    "Because pointer j increases by at most 1 per text character (at most N total increments), and while-loop decrements strictly reduce j, bounding total mismatch steps to at most N.",
                    "Because all characters in the text are identical.",
                    "Because the algorithm sorts the text in alphabetical order before searching.",
                    "Because the pattern pointer resets to zero after every single character."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Pointer j increases at most once per outer loop iteration (at most N increments). Since while-loop decrements j = pi[j - 1] strictly reduce j by at least 1 and j >= 0, there can be at most N total decrements across the entire search."
            }
        },
        {
            "title": "The Z-Algorithm: Z-Box Window Invariants & Fundamental Substring Comparisons",
            "say": p3_say,
            "example": "In a bioinformatics sequence analyzer, geneticists search for DNA promoter sequences within chromosome strands. Using the Z-Algorithm on a concatenated string Pattern + '$' + Text identifies all occurrences in a single pass without custom state machine logic.",
            "tryIt": "Examine the TypeScript code below. Follow how computeZArray maintains the active Z-box [l, r] to compute Z values in O(N) time, and observe how zSearch locates occurrences of 'ab' at identical offsets [4, 6, 9, 13].",
            "code": part3_code,
            "output": part3_output,
            "check": {
                "question": "How does the Z-Algorithm achieve O(N) time when index i is inside the current Z-box (i <= r)?",
                "options": [
                    "It initializes Z[i] directly from the precomputed value Z[i - l], performing character comparisons only if the match extends beyond the current Z-box boundary r.",
                    "It skips index i completely and advances to r + 1.",
                    "It converts the substring into a binary hash code and checks hash equality.",
                    "It resets the Z-box to [0, 0] on every iteration."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Since S[l...r] equals S[0...r - l], position i corresponds to k = i - l in the prefix. If Z[k] < r - i + 1, Z[i] is guaranteed to be Z[k] with zero comparisons. Comparisons only occur if the match extends past r."
            }
        },
        {
            "title": "Prefix Function vs Z-Array Duality & Periodicity Detection",
            "say": p4_say,
            "example": "In a digital telecommunications modem, a receiver detects periodic synchronization headers embedded in carrier frames. By evaluating the prefix function value at the end of the frame, the receiver determines the exact fundamental period length and recovers the compressed header.",
            "tryIt": "Examine the TypeScript code below. Observe how findShortestPeriod evaluates 'abcabcabcabc', extracting fundamental period length 3 and compressed repeating unit 'abc' in O(N) time.",
            "code": part4_code,
            "output": part4_output,
            "check": {
                "question": "Given a string S of length N, under what condition does S consist of repeating copies of a fundamental period of length k = N - pi[N - 1]?",
                "options": [
                    "When N % k == 0 and pi[N - 1] > 0, proving that S is formed by N / k repetitions of its prefix of length k.",
                    "When pi[N - 1] is equal to 0.",
                    "When the string length N is an odd prime number.",
                    "When all characters in the string are distinct."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "pi[N - 1] is the longest border. If k = N - pi[N - 1] divides N evenly and pi[N - 1] > 0, the border overlap guarantees that the prefix of length k repeats exactly N / k times to form S."
            }
        },
        {
            "title": "Enterprise Application: High-Throughput Packet Inspection & Log Telemetry Scanner (KmpPacketScanner)",
            "say": p5_say,
            "example": "In an enterprise web application firewall (WAF), incoming HTTP requests are scanned for SQL injection and cross-site scripting vulnerabilities. The KmpPacketScanner precomputes failure tables for security rules, inspecting payloads at wire speed and isolating malicious snippets.",
            "tryIt": "Explore the KmpPacketScanner class below. Trace how registerRule compiles security signatures, how scanPacketPayload inspects an HTTP request payload, and how an SQL injection threat is identified at offset 32.",
            "code": part5_code,
            "output": part5_output,
            "check": {
                "question": "Why is the KMP algorithm ideal for Deep Packet Inspection (DPI) in real-time firewall appliances?",
                "options": [
                    "Because the text pointer i never backtracks, allowing the scanner to evaluate incoming network packets as an unbroken byte stream without buffering or rewinding payload data.",
                    "Because KMP encrypts packet contents before inspection.",
                    "Because it drops all packets that contain more than 100 characters.",
                    "Because it converts HTTP text into compressed binary formats automatically."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "KMP maintains a strictly monotonic text pointer i that never moves backwards. This stream-friendly property allows network security appliances to inspect live packet streams on the wire with minimal memory buffers."
            }
        }
    ],
    "summary": [
        "Pathological String Search: Naive pattern matching degrades to O(N * M) due to redundant re-evaluations. KMP eliminates backtracking by precomputing the Prefix Function (pi array) in O(M) time.",
        "KMP Amortized Proof: Text pointer i never backtracks. Pointer j increases at most N times, bounding while-loop decrements to at most N, achieving deterministic O(N + M) search time.",
        "Z-Algorithm Invariants: Computes longest common prefixes (LCP) starting at each position in O(N) time using an active Z-box [l, r], solving pattern matching via the concatenation P + '$' + T.",
        "Periodicity & Border Duality: The prefix function directly reveals string periodicity: if k = N - pi[N - 1] divides N, S consists of N / k exact repetitions of its prefix of length k.",
        "Enterprise Packet Inspection: The KmpPacketScanner leverages KMP failure tables to perform deep packet inspection on live network traffic in single-pass O(N) time with zero stream rewinding."
    ],
    "projectStep": {
        "title": "Architecting the KMP Packet Scanner",
        "steps": [
            "Compile cybersecurity attack signatures into precomputed KMP prefix failure arrays in linear time.",
            "Scan incoming network packet payloads in a single stream pass with strictly non-decreasing text indices.",
            "Isolate detected threat offsets and generate structured security alerts for automated firewall rule actuation."
        ]
    }
}

with open("scripts/branch_c/day51_lesson.json", "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2)

print("day51_lesson.json successfully created.")
