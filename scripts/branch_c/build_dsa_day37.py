import json
import os

# ----------------- PART 1 -----------------
p1_say = [
    "In foundational computer science and modern computational systems, linear-time exact string matching stands as one of the most thoroughly analyzed algorithmic problems. When searching for a target pattern P of length M within a large text T of length N, naive brute-force scanning tests every possible starting index in T. Upon encountering a character mismatch between P[j] and T[i], the naive algorithm rewinds the text pointer back to i - j + 1 and resets the pattern pointer to index 0. This backwards rewinding causes worst-case quadratic degradation O(N * M), which becomes catastrophic when processing streaming data over non-rewindable network sockets or inspecting high-throughput memory buffers.",
    "The seminal breakthrough that eliminated text pointer backtracking was discovered independently by Donald Knuth, Vaughan Pratt, and James H. Morris in 1977, formalized as the Knuth-Morris-Pratt (KMP) algorithm. The conceptual cornerstone of KMP is the Prefix Function, universally denoted as pi[i] (or the Border Array). For a string s of length N, the prefix function value pi[i] is defined mathematically as the length of the longest proper prefix of the substring s[0..i] that is also a suffix of s[0..i]. A proper prefix is any prefix of s[0..i] that does not equal the entire substring s[0..i] itself. By convention, pi[0] = 0.",
    "To formalize the border concept, consider a string s[0..i]. A substring b of length k is classified as a border of s[0..i] if and only if b is both a prefix (b = s[0..k-1]) and a suffix (b = s[i-k+1..i]). The prefix function pi[i] simply captures the maximum length among all valid borders of s[0..i]. For example, in the string 'aabaaab', the substring s[0..4] is 'aabaa'. Its proper prefixes are {'a', 'aa', 'aab', 'aaba'}, and its suffixes are {'a', 'aa', 'baa', 'abaa'}. The longest common string present in both sets is 'aa' of length 2; therefore, pi[4] = 2. When the next character 'a' is appended at index 5, forming 'aabaaa', the common borders become {'a', 'aa'}; thus pi[5] = 2. When 'b' is appended at index 6, forming 'aabaaab', the longest border expands to 'aab' of length 3, yielding pi[6] = 3.",
    "Computing the prefix function naively by extracting all prefixes and suffixes for every position i takes cubic time O(N^3). However, Knuth, Morris, and Pratt demonstrated that pi can be computed in strictly linear O(N) time through an elegant inductive property. Suppose we have already computed pi[0], pi[1], ..., pi[i-1], and we wish to determine pi[i]. The fundamental invariant is that pi[i] can increase by at most 1 compared to pi[i-1]: pi[i] <= pi[i-1] + 1. If the character s[i] matches s[pi[i-1]], then the previous longest border simply extends by 1, and pi[i] = pi[i-1] + 1.",
    "The subtle algorithmic beauty arises when a mismatch occurs: s[i] !== s[j], where j = pi[i-1]. When the previous border cannot be extended, the algorithm must find the next longest border of s[0..i-1] that might be extendable by s[i]. Crucially, any border of a border of string s is itself a valid border of s. Therefore, the next candidate border length is simply encoded in the prefix function itself: j = pi[j - 1]. The algorithm repeatedly steps backwards through the chain of borders j = pi[j - 1] until either s[i] === s[j] (in which case pi[i] = j + 1) or j reaches 0 (meaning no non-empty border exists, so pi[i] = (s[i] === s[0] ? 1 : 0)).",
    "Because the variable j increases by at most 1 in each outer iteration of the loop (at most N times total) and decreases whenever the inner while loop executes, the total number of decrements of j across the entire algorithm cannot exceed the total number of increments. By amortized analysis, the inner while loop executes at most N times across all N steps combined. Consequently, the entire prefix function computation terminates in deterministic linear O(N) time and requires only O(N) integer storage, providing an optimal foundation for linear-time pattern matching."
]

p1_example = (
    "Consider an enterprise web crawler indexing HTML and Markdown documents across thousands of corporate wikis. During ingestion, the document parser must identify repetitive header delimiters, markdown formatting markers, and custom macro tags (such as '[[wiki_link]]'). By computing the prefix function array pi for tokenized marker sequences, the indexing engine identifies self-similar repetitive borders across template headers in linear time. In a corpus of 500,000 document lines, the prefix function computes border arrays in under 8 milliseconds, allowing the tokenizer to classify structural boundaries without incurring the exponential backtrack penalties typical of naive regular expression engines."
)

p1_tryIt = (
    "Examine the PrefixFunctionOracle implementation below. Follow the computePi() method as it iterates from i = 1 to n - 1, maintaining the border candidate pointer j. Trace how the while (j > 0 && s[i] !== s[j]) loop steps backwards through previous borders via j = pi[j - 1] without ever rewinding the outer loop index i. Test the oracle with repetitive strings like 'aabaaab' and 'abcabcdabc' to observe how border lengths expand and contract deterministically in linear O(N) time."
)

p1_check = {
    "question": "In the linear computation of the prefix function pi[i], why does the algorithm update the candidate border pointer to j = pi[j - 1] when a character mismatch s[i] !== s[j] occurs?",
    "options": [
        "Because any border of an existing border of s[0..i-1] is itself a valid border of s[0..i-1]; the prefix array pi stores the exact length of this next-longest border at index j - 1",
        "Because decrementing j by 1 forces the CPU branch predictor to flush its instruction pipeline, resetting hardware cache registers",
        "Because pi[j - 1] contains the ASCII numerical difference between the mismatched characters, allowing arithmetic correction",
        "Because the algorithm must convert the prefix array into a binary search tree to locate the median character of the alphabet"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "A fundamental algebraic property of borders states that if b is a border of s, and c is a border of b, then c is also a border of s. When the longest border of length j cannot be extended by character s[i], the next longest candidate border of s[0..i-1] is precisely the longest border of the border s[0..j-1]. The length of that border is already precomputed and stored at pi[j - 1]. Hopping to j = pi[j - 1] allows the algorithm to check candidate borders in strictly descending order without re-examining intermediate characters."
}

p1_code = """/**
 * Day 37 - Part 1: Prefix Function (Pi Array) & Border Array Computation
 */

class PrefixFunctionOracle {
  static computePi(s: string): number[] {
    const n = s.length;
    const pi = new Array(n).fill(0);

    for (let i = 1; i < n; i++) {
      let j = pi[i - 1];
      while (j > 0 && s[i] !== s[j]) {
        j = pi[j - 1]; // Fallback to previous longest border
      }
      if (s[i] === s[j]) {
        j++;
      }
      pi[i] = j;
    }

    return pi;
  }
}

function main(): void {
  const s1 = "aabaaab";
  const pi1 = PrefixFunctionOracle.computePi(s1);
  console.log(`[PrefixFunction] String: "${s1}"`);
  console.log(`[PrefixFunction] Pi Array: [${pi1.join(", ")}]`);

  const s2 = "abcabcdabc";
  const pi2 = PrefixFunctionOracle.computePi(s2);
  console.log(`[PrefixFunction] String: "${s2}"`);
  console.log(`[PrefixFunction] Pi Array: [${pi2.join(", ")}]`);

  // Verification of longest border for s1: pi[6] = 3 ("aab")
  console.log(`[PrefixFunction] Final Border Length of "${s1}": ${pi1[pi1.length - 1]} ("${s1.substring(0, pi1[pi1.length - 1])}")`);
}

main();"""

p1_output = """[PrefixFunction] String: "aabaaab"
[PrefixFunction] Pi Array: [0, 1, 0, 1, 2, 2, 3]
[PrefixFunction] String: "abcabcdabc"
[PrefixFunction] Pi Array: [0, 0, 0, 1, 2, 3, 0, 1, 2, 3]
[PrefixFunction] Final Border Length of "aabaaab": 3 ("aab")"""

p1_codeNotes = [
    {"line": 5, "note": "Defines computePi method returning integer array of longest border lengths for all prefixes"},
    {"line": 10, "note": "Initializes j to pi[i-1], probing whether the previous longest border can be extended by s[i]"},
    {"line": 11, "note": "Executes while loop falling back to j = pi[j-1] on mismatch, testing successively shorter borders"},
    {"line": 14, "note": "Increments j if extending character matches, establishing the new border length for prefix s[0..i]"},
    {"line": 23, "note": "Demonstrates linear pi computation for 'aabaaab' and 'abcabcdabc' with exact border recovery"}
]

# ----------------- PART 2 -----------------
p2_say = [
    "Armed with the linear-time Prefix Function pi, we construct the full Knuth-Morris-Pratt (KMP) pattern matching algorithm. The goal of KMP is finding all occurrences of a search pattern P of length M within an arbitrarily long text T of length N. Traditional search routines suffer from text pointer backtracking: when a partial match of length k fails on the next character, naive engines rewind the text pointer by k - 1 positions. In high-performance systems handling continuous real-time data streams—such as live telemetry ingestion over TCP sockets, financial order books, or Linux system call tracing—rewinding a streaming pointer is physically impossible because past bytes have already exited hardware FIFO buffers.",
    "The Knuth-Morris-Pratt algorithm completely eliminates text pointer backtracking. During execution, the text pointer i advances strictly forward from 0 to N - 1, never decrementing. Simultaneously, a pattern pointer j (representing the active matched prefix length) traverses the pattern P. When character T[i] matches P[j], the pattern pointer increments (j++). If j reaches the full pattern length M, an exact occurrence has been located starting at text index i - M + 1. Immediately following a match, the algorithm uses the prefix function to reset the pattern pointer to j = pi[M - 1], allowing it to discover overlapping occurrences without restarting from index 0.",
    "When a character mismatch occurs (T[i] !== P[j] with j > 0), KMP does not rewind text index i. Instead, it recognizes that the substring T[i-j..i-1] matches the pattern prefix P[0..j-1] identically. The longest prefix of P that could possibly match the trailing suffix of the text we just saw is precisely the longest border of P[0..j-1], whose length is precomputed as pi[j - 1]. Therefore, the algorithm simply resets the pattern pointer to j = pi[j - 1] and immediately re-evaluates character T[i] against P[j]. This fallback process repeats until either a match is found or j becomes 0, at which point the text pointer i advances to the next character.",
    "An elegant alternative formulation of KMP involves string concatenation with an unmatchable sentinel delimiter. Given pattern P and text T, construct the composite string S = P + '#' + T, where '#' is a special delimiter symbol guaranteed not to appear anywhere in P or T. When the prefix function pi is evaluated over S, the delimiter '#' prevents any border from exceeding length M. Consequently, for every index i > M in the text segment, pi[i] <= M. Whenever pi[i] == M, the suffix of S ending at position i matches the prefix P of length M identically, proving that an occurrence of P terminates at index i. Because the prefix function runs in O(|S|) time, this concatenated approach executes in O(N + M) time and can be implemented in a single compact loop.",
    "In terms of memory efficiency, standard KMP requires O(M) auxiliary memory to store the prefix function array pi for the pattern. The text T can be processed as an unbuffered, infinite stream of characters one byte at a time. The amortized cost per input character is strictly O(1) operations, because the pattern pointer j increases at most N times and decreases via failure transitions at most N times across the entire text traversal. This guarantees deterministic real-time latency bounds, ensuring that no incoming packet causes unpredictable execution stalls.",
    "Furthermore, KMP provides ironclad algorithmic security against algorithmic complexity attacks (ReDoS). In contrast to non-deterministic finite automata (NFA) regex engines that exhibit catastrophic exponential backtracking O(2^N) on pathological inputs like P = 'a^M' and T = 'a^(N-1)b', KMP guarantees linear O(N + M) performance in all circumstances, regardless of pattern repetition or adversarial text composition."
]

p2_example = (
    "Consider an enterprise border firewall inspecting high-speed TLS SNI (Server Name Indication) extensions and DNS query payloads across 40 Gbps network interfaces. The intrusion prevention system must identify malicious domain signatures, such as 'malware-c2-command.org', embedded within gigabytes of transit packets. If the firewall used a backtracking pattern matcher, an adversary could stream repetitive decoy payloads like 'malware-c2-com...malware-c2-com...' designed to trigger worst-case quadratic backtracking, saturating firewall CPU cores and dropping benign traffic. By deploying the zero-backtrack KMP engine, the firewall processes each packet in linear time, guaranteeing constant per-byte latency and immunizing the infrastructure against algorithmic denial-of-service exploits."
)

p2_tryIt = (
    "Review the KMPMatcher implementation below. Trace how the constructor builds the failure table pi in O(M) time for the search pattern. Follow the searchAll() method as it iterates through the text string, using the while (j > 0 && text[i] !== this.pattern[j]) loop to execute instantaneous state fallbacks without ever decrementing the text index i. Notice how the engine finds the exact offset of the pattern 'ABABCABAB' in the test text cleanly."
)

p2_check = {
    "question": "Why is the Knuth-Morris-Pratt (KMP) algorithm uniquely suited for processing live streaming data over network sockets compared to naive string search algorithms?",
    "options": [
        "Because KMP advances the text pointer strictly monotonically forward with zero backwards rewinding, allowing incoming stream bytes to be discarded from memory immediately after inspection",
        "Because KMP compresses ASCII characters into 4-bit nibbles using Huffman coding before evaluating pattern matches",
        "Because KMP executes in logarithmic time O(log N) by dividing the streaming socket buffer into binary intervals",
        "Because KMP requires the text stream to be loaded into a GPU compute shader before pattern verification can start"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "In live network streaming, incoming bytes arrive sequentially over hardware sockets and cannot be rewound once consumed from the buffer. Naive pattern matching requires rewinding the text pointer upon encountering a mismatch, requiring unbounded stream buffering. KMP never decrements the text pointer (i strictly increases from 0 to N-1), making it capable of processing streaming data on-the-fly with constant O(1) memory overhead and zero backtracking."
}

p2_code = """/**
 * Day 37 - Part 2: Knuth-Morris-Pratt (KMP) Linear Pattern Matching Engine
 */

class KMPMatcher {
  private pattern: string;
  private pi: number[];

  constructor(pattern: string) {
    this.pattern = pattern;
    this.pi = this.buildPi(pattern);
  }

  private buildPi(p: string): number[] {
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

  // Searches pattern in streaming text in O(N) time with ZERO text pointer backtracks
  searchAll(text: string): number[] {
    const n = text.length;
    const m = this.pattern.length;
    if (m === 0 || n < m) return [];

    const matches: number[] = [];
    let j = 0; // State in pattern

    for (let i = 0; i < n; i++) {
      while (j > 0 && text[i] !== this.pattern[j]) {
        j = this.pi[j - 1]; // Fast transition via failure function
      }
      if (text[i] === this.pattern[j]) {
        j++;
      }
      if (j === m) {
        matches.push(i - m + 1); // Found exact occurrence
        j = this.pi[j - 1]; // Advance to next possible border
      }
    }

    return matches;
  }
}

function main(): void {
  const testText = "ABABDABACDABABCABAB";
  const testPattern = "ABABCABAB";
  const engine = new KMPMatcher(testPattern);
  const found = engine.searchAll(testText);

  console.log(`[KMPMatcher] Target Text: "${testText}" (Length: ${testText.length})`);
  console.log(`[KMPMatcher] Search Pattern: "${testPattern}" (Length: ${testPattern.length})`);
  console.log(`[KMPMatcher] Occurrences Located At Offsets: [${found.join(", ")}]`);
  console.log(`[KMPMatcher] Verified Match Substring: "${testText.substring(found[0], found[0] + testPattern.length)}"`);
}

main();"""

p2_output = """[KMPMatcher] Target Text: "ABABDABACDABABCABAB" (Length: 19)
[KMPMatcher] Search Pattern: "ABABCABAB" (Length: 9)
[KMPMatcher] Occurrences Located At Offsets: [10]
[KMPMatcher] Verified Match Substring: \"ABABCABAB\""""

p2_codeNotes = [
    {"line": 5, "note": "Defines KMPMatcher class encapsulating pattern string and precomputed failure table pi"},
    {"line": 13, "note": "Builds prefix function pi for search pattern in O(M) time during initialization"},
    {"line": 28, "note": "Implements searchAll scanning text in O(N) with strictly monotonically increasing index i"},
    {"line": 34, "note": "Falls back to j = pi[j-1] on mismatch without modifying text index i"},
    {"line": 40, "note": "Records matching index upon full pattern match and transitions to pi[j-1] for overlapping matches"}
]

# ----------------- PART 3 -----------------
p3_say = [
    "Beyond single pattern matching, the prefix function pi uncovers deep structural properties regarding string periodicity, cyclic symmetries, and lossless compression. In string combinatorics, a string s of length N is said to have a period k (where 1 <= k <= N) if s[i] == s[i + k] for all valid indices 0 <= i < N - k. In simpler terms, shifting string s by k positions aligns it with itself. When a string consists entirely of repetitions of a smaller fundamental substring u of length k (such that s = u^r where r = N / k >= 2), the string is defined as fully periodic (or a run of repetitions).",
    "The Period-Border Duality Theorem establishes a profound mathematical equivalence: for any string s of length N, a positive integer k is a period of s if and only if N - k is a border of s. In other words, every period k corresponds directly to a border of length N - k. Because the prefix function value pi[N - 1] represents the length of the absolute longest border of string s, the candidate value k = N - pi[N - 1] represents the absolute smallest period of string s.",
    "This duality provides a remarkably elegant and lightning-fast test for full periodicity and string compressibility. Given a string s of length N, compute its prefix function and examine the final value pi[N - 1]. Let k = N - pi[N - 1]. If pi[N - 1] > 0 and N mod k === 0, then the string s is strictly periodic with smallest period k, and it can be compressed into r = N / k repetitions of the unit prefix s[0..k-1]. Conversely, if N mod k !== 0 or pi[N - 1] === 0, the string cannot be represented as a pure repetition of any proper substring, and its smallest full period is N itself.",
    "For instance, consider the string 'abcabcabcabc' of length N = 12. Its longest border is 'abcabcabc' of length 9; hence pi[11] = 9. The candidate period is k = 12 - 9 = 3. Because 12 mod 3 === 0, the string is fully periodic with period 3, compressed into (12 / 3) = 4 repetitions of 'abc'. Next, consider 'aabaabaabaab' of length 12: its longest border is 'aabaabaab' of length 9, yielding k = 12 - 9 = 3, representing 4 repetitions of 'aab'. In contrast, for an irregular string like 'enterprise_infra' of length 16, pi[15] = 0, yielding k = 16 - 0 = 16, confirming zero periodic compressibility.",
    "This linear O(N) periodicity test forms the computational core of advanced run-length encoding (RLE) and data compression algorithms. In data storage systems and genomic databases, identifying repetitive tandem repeats allows massive multi-megabyte sequences to be compressed into a compact tuple { unit: string, count: number } in a single O(N) pass. Furthermore, in string synchronization protocols (such as rsync), identifying periodicity enables chunking algorithms to avoid generating redundant delta packets across repetitive data streams.",
    "Moreover, the periodicity theorem generalizes to all prefixes of string s. By scanning the entire array pi, we can identify all prefixes that are themselves fully periodic. For each prefix s[0..i] of length L = i + 1, let k_i = L - pi[i]. If pi[i] > 0 and L mod k_i === 0, then prefix s[0..i] is periodic with period k_i and repeat count L / k_i. This property allows algorithms to construct the complete Run Table (the set of all maximal periodic runs, also known as 'runs') of a string in optimal O(N) time, a cornerstone of modern stringology."
]

p3_example = (
    "Consider a high-performance streaming telemetry pipeline monitoring industrial IoT vibration sensors on high-speed turbine shafts. When a turbine bearing develops mechanical wear, sensor voltage waveforms generate periodic sinusoidal oscillations that appear in digitized telemetry as repeating byte patterns (e.g., 'A8F2A8F2A8F2...'). Using StringPeriodicityAnalyzer, the monitoring agent evaluates incoming 1024-byte telemetry buffers in linear O(N) time. The analyzer computes pi, extracts candidate period k = N - pi[N-1], and determines if the signal is fully periodic. Upon detecting a pure periodic run with repeat count r > 50, the agent flags bearing imbalance and compresses the buffer into a compact 4-byte descriptor, conserving bandwidth across industrial satellite uplinks."
)

p3_tryIt = (
    "Examine the StringPeriodicityAnalyzer implementation below. Follow the analyze() method as it computes the prefix function pi, extracts the candidate period k = n - pi[n - 1], and checks the modular divisibility condition n % k === 0. Test the analyzer with diverse repetitive strings ('abcabcabcabc', 'aabaabaabaab') and irregular strings to observe how it deterministically discovers the smallest repeating unit and repetition count in linear O(N) time."
)

p3_check = {
    "question": "Given a string s of length N with prefix function value pi[N - 1], why does the condition N % (N - pi[N - 1]) === 0 with pi[N - 1] > 0 prove that s is composed entirely of repetitions of its prefix of length k = N - pi[N - 1]?",
    "options": [
        "Because by the Period-Border Duality Theorem, any border of length L corresponds to a period k = N - L; if N is divisible by the smallest period k, the shift invariance propagates across the entire string length N without remainder",
        "Because dividing N by k produces an irrational number that forces modular arithmetic to terminate at index 0",
        "Because the prefix function pi sorts characters alphabetically, eliminating all non-repeating characters from the string",
        "Because pi[N - 1] > 0 implies that the string is a palindrome, and all palindromes are automatically periodic"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "By the Period-Border Duality Theorem, a string has period k if and only if it has a border of length N - k. The longest border pi[N - 1] gives the smallest candidate period k = N - pi[N - 1]. If N is a multiple of k, the periodic shift property s[i] == s[i + k] holds continuously from index 0 all the way to N - 1, meaning the string s is formed by concatenating the prefix s[0..k-1] exactly N / k times."
}

p3_code = """/**
 * Day 37 - Part 3: String Periodicity, Repetitions & Compression via Border Arrays
 */

interface PeriodicityResult {
  period: number;
  isFullyPeriodic: boolean;
  repeatCount: number;
  compressedUnit: string;
}

class StringPeriodicityAnalyzer {
  static analyze(s: string): PeriodicityResult {
    const n = s.length;
    if (n === 0) {
      return { period: 0, isFullyPeriodic: false, repeatCount: 0, compressedUnit: "" };
    }

    const pi = new Array(n).fill(0);
    for (let i = 1; i < n; i++) {
      let j = pi[i - 1];
      while (j > 0 && s[i] !== s[j]) {
        j = pi[j - 1];
      }
      if (s[i] === s[j]) j++;
      pi[i] = j;
    }

    const longestBorder = pi[n - 1];
    const candidatePeriod = n - longestBorder;
    const isFullyPeriodic = longestBorder > 0 && n % candidatePeriod === 0;

    return {
      period: candidatePeriod,
      isFullyPeriodic,
      repeatCount: isFullyPeriodic ? n / candidatePeriod : 1,
      compressedUnit: isFullyPeriodic ? s.substring(0, candidatePeriod) : s
    };
  }
}

function main(): void {
  const strings = [
    "abcabcabcabc",       // 4x "abc"
    "aabaabaabaab",       // 4x "aab"
    "enterprise_infra",   // non-periodic
    "xyzxyz"              // 2x "xyz"
  ];

  console.log("=== String Periodicity & Run-Length Compression Analysis ===");
  for (const s of strings) {
    const res = StringPeriodicityAnalyzer.analyze(s);
    console.log(`[Periodicity] String: "${s}" (Length: ${s.length})`);
    console.log(`  -> Smallest Period k: ${res.period}`);
    console.log(`  -> Fully Periodic: ${res.isFullyPeriodic}`);
    console.log(`  -> Compression: "${res.compressedUnit}" repeated ${res.repeatCount} times`);
  }
}

main();"""

p3_output = """=== String Periodicity & Run-Length Compression Analysis ===
[Periodicity] String: "abcabcabcabc" (Length: 12)
  -> Smallest Period k: 3
  -> Fully Periodic: true
  -> Compression: "abc" repeated 4 times
[Periodicity] String: "aabaabaabaab" (Length: 12)
  -> Smallest Period k: 3
  -> Fully Periodic: true
  -> Compression: "aab" repeated 4 times
[Periodicity] String: "enterprise_infra" (Length: 16)
  -> Smallest Period k: 16
  -> Fully Periodic: false
  -> Compression: "enterprise_infra" repeated 1 times
[Periodicity] String: "xyzxyz" (Length: 6)
  -> Smallest Period k: 3
  -> Fully Periodic: true
  -> Compression: "xyz" repeated 2 times"""

p3_codeNotes = [
    {"line": 5, "note": "Defines PeriodicityResult structure holding period k, periodicity flag, and compressed unit"},
    {"line": 18, "note": "Computes prefix function pi in O(N) to identify the longest proper border of the full string"},
    {"line": 28, "note": "Calculates candidate period k = n - pi[n-1] and tests divisibility n % k === 0"},
    {"line": 34, "note": "Constructs compressed representation if fully periodic, returning repeat count n / k"},
    {"line": 42, "note": "Tests both periodic strings ('abcabcabcabc', 'aabaabaabaab') and non-periodic strings cleanly"}
]

# ----------------- PART 4 -----------------
p4_say = [
    "While standard KMP achieves linear O(N) overall time complexity through amortized failure link traversal, individual character transitions can occasionally execute multiple while-loop fallback hops j = pi[j - 1] before matching or resetting to 0. In hard real-time systems, high-frequency trading (HFT) network interfaces, and FPGA coprocessors, amortized bounds are insufficient: every single input byte must be processed in strictly bounded, deterministic worst-case constant O(1) time without conditional loop jitter. To achieve true O(1) per-character processing, we compile the prefix function into a full Deterministic Finite Automaton (DFA), commonly known as the Prefix Automaton.",
    "A Deterministic Finite Automaton for a pattern P of length M over an alphabet Sigma consists of M + 1 states (numbered 0 through M). State 0 represents the empty match, state M represents a full pattern match, and each intermediate state s (where 0 <= s < M) indicates that the longest prefix of P matching the current text suffix has length s. The transition function delta(state, char) maps the current state and an incoming character c to the next state: delta : {0, ..., M} x Sigma -> {0, ..., M}.",
    "The construction of the transition table delta(s, c) is directly derived from the prefix function pi. For a given state s and character c, if s < M and c matches the next pattern character (c === P[s]), the automaton advances forward: delta(s, c) = s + 1. However, if character c does not match P[s], the automaton must transition to the next state that preserves the longest valid border of P[0..s-1] followed by character c. Instead of stepping through failure links at runtime, the DFA precomputes this fallback state during compilation: delta(s, c) = delta(pi[s - 1], c) for s > 0, and delta(0, c) = 0.",
    "This recursive relation delta(s, c) = delta(pi[s - 1], c) allows the entire transition table to be constructed in O(M * |Sigma|) time. Because the fallback state pi[s - 1] is strictly less than s, its transitions delta(pi[s - 1], c) have already been computed earlier in the loop. The compiler simply copies the transition row of state pi[s - 1] and overwrites the single character transition for c === P[s] with s + 1. For an ASCII alphabet of size 256 and a pattern of length 1,000, compiling the DFA requires a fraction of a millisecond and occupies a compact 256 KB 2D array in memory.",
    "Once the DFA is compiled, processing text becomes ridiculously fast and hardware-friendly. For each incoming character c in the text, the automaton updates its state in a single array lookup: state = dfa[state][c]. There are zero loops, zero conditional branch jumps, and zero pointer dereferences. In modern superscalar CPUs, this single array lookup translates to two machine instructions, eliminating CPU branch misprediction penalties and maximizing instruction-level parallelism.",
    "In cybersecurity and deep packet inspection (DPI), this Prefix Automaton serves as the foundational building block for hardware-accelerated signature matchers. Network interface cards (SmartNICs) and ASIC search engines load the transition matrix directly into high-speed on-chip SRAM or TCAM (Ternary Content-Addressable Memory). As packet payloads stream off the physical optical transceiver at 100 Gbps, each incoming byte triggers an instantaneous state lookup, achieving wire-speed threat detection without dropping a single frame.",
    "From a memory layout perspective, aligning each row of the transition table to 64-byte or 128-byte CPU cache line boundaries guarantees that state transitions never trigger multiple DRAM page activations. When the working alphabet is constrained—such as base64, hexadecimal, or alphanumeric characters—the transition table compresses down to tens of kilobytes, residing permanently inside the processor's ultra-low-latency L1 instruction or data cache for zero-jitter execution."
]

p4_example = (
    "Consider an electronic stock exchange matching engine processing continuous streams of FIX (Financial Information eXchange) protocol messages over a 25 Gbps Ethernet interface. The compliance surveillance engine must flag suspicious algorithmic order cancellation patterns, such as 'CancelReplaceOrd37=Reject', within strict sub-microsecond latency SLAs. If the surveillance engine used standard KMP with runtime failure link loops, transient burst traffic with repetitive characters could cause loop jitter, violating execution deadlines. By compiling the pattern into a Prefix DFA Automaton, the engine processes each byte in exactly one memory lookup (state = dfa[state][c]), guaranteeing deterministic 1.2-nanosecond per-byte throughput and satisfying regulatory real-time surveillance mandates."
)

p4_tryIt = (
    "Examine the PrefixDFAAutomaton implementation below. Follow the buildDFA() method as it computes the failure array pi and constructs the transition table dfa[state][char] in O(M * |Sigma|) time. Observe how mismatch transitions copy from the precomputed fallback state dfa[fallbackState][c]. Trace the simulateStream() loop to verify that each incoming byte updates the automaton state in a single constant-time array lookup, detecting all five occurrences of 'aba' across 'abababababa' cleanly."
)

p4_check = {
    "question": "What is the primary operational advantage of compiling the KMP prefix function into a full Deterministic Finite Automaton (DFA) transition matrix delta(state, char)?",
    "options": [
        "It guarantees strictly worst-case constant time O(1) per character with zero branch loops or runtime failure-link traversals, making it ideal for hard real-time and hardware NIC inspection",
        "It reduces the memory space needed to store the pattern from O(M) down to O(1) bits",
        "It converts non-deterministic regular expressions into recursive neural network weights",
        "It eliminates the need for an alphabet, allowing the engine to match arbitrary compressed binary files without decompression"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "In standard KMP, while the total running time is linear O(N), an individual character mismatch can trigger up to M failure link hops j = pi[j - 1] in the worst case, introducing latency variance and CPU branch mispredictions. Compiling the prefix function into a DFA precomputes all possible fallback transitions into a 2D matrix delta[state][char]. As a result, every incoming byte updates the state in exactly one table lookup (O(1) worst-case time), ensuring deterministic execution speed required by real-time hardware."
}

p4_code = """/**
 * Day 37 - Part 4: Deterministic Finite Automaton (DFA) Prefix Automaton
 */

class PrefixDFAAutomaton {
  private pattern: string;
  private m: number;
  private alphabetSize: number;
  public dfa: number[][];

  constructor(pattern: string, alphabetSize: number = 26) {
    this.pattern = pattern;
    this.m = pattern.length;
    this.alphabetSize = alphabetSize;
    this.dfa = this.buildDFA();
  }

  private buildDFA(): number[][] {
    const dfa: number[][] = Array.from({ length: this.m + 1 }, () => new Array(this.alphabetSize).fill(0));

    // Compute prefix function pi for fallback transitions
    const pi = new Array(this.m).fill(0);
    for (let i = 1; i < this.m; i++) {
      let j = pi[i - 1];
      while (j > 0 && this.pattern[i] !== this.pattern[j]) {
        j = pi[j - 1];
      }
      if (this.pattern[i] === this.pattern[j]) j++;
      pi[i] = j;
    }

    // Build transition table delta(state, char)
    for (let state = 0; state <= this.m; state++) {
      for (let c = 0; c < this.alphabetSize; c++) {
        if (state < this.m && c === this.pattern.charCodeAt(state) - 97) {
          dfa[state][c] = state + 1; // Direct advance
        } else if (state > 0) {
          const fallbackState = state === this.m ? pi[this.m - 1] : pi[state - 1];
          dfa[state][c] = dfa[fallbackState][c]; // Constant-time precomputed transition
        } else {
          dfa[state][c] = 0;
        }
      }
    }

    return dfa;
  }

  // Processes incoming character stream in strictly O(1) time per character
  simulateStream(text: string): { matchOffsets: number[]; finalState: number } {
    let state = 0;
    const matchOffsets: number[] = [];

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) - 97;
      if (charCode >= 0 && charCode < this.alphabetSize) {
        state = this.dfa[state][charCode];
      } else {
        state = 0;
      }

      if (state === this.m) {
        matchOffsets.push(i - this.m + 1);
      }
    }

    return { matchOffsets, finalState: state };
  }
}

function main(): void {
  const pattern = "aba";
  const automaton = new PrefixDFAAutomaton(pattern, 26);
  const text = "abababababa";

  const { matchOffsets, finalState } = automaton.simulateStream(text);
  console.log(`[PrefixDFA] Compiled Pattern: "${pattern}" (Target State: ${pattern.length})`);
  console.log(`[PrefixDFA] Streaming Text: "${text}" (Length: ${text.length})`);
  console.log(`[PrefixDFA] Match Offsets in O(1) Per Byte: [${matchOffsets.join(", ")}]`);
  console.log(`[PrefixDFA] Total Matches Detected: ${matchOffsets.length}, Final State: ${finalState}`);
}

main();"""

p4_output = """[PrefixDFA] Compiled Pattern: "aba" (Target State: 3)
[PrefixDFA] Streaming Text: "abababababa" (Length: 11)
[PrefixDFA] Match Offsets in O(1) Per Byte: [0, 2, 4, 6, 8]
[PrefixDFA] Total Matches Detected: 5, Final State: 3"""

p4_codeNotes = [
    {"line": 5, "note": "Defines PrefixDFAAutomaton allocating 2D transition table delta[state][char] for O(1) matching"},
    {"line": 18, "note": "Computes underlying prefix function pi to provide precalculated fallback state indices"},
    {"line": 31, "note": "Constructs transition matrix in O(M * |Sigma|), advancing matching state or copying fallback row"},
    {"line": 46, "note": "Processes streaming text characters with a single deterministic table lookup per byte"},
    {"line": 64, "note": "Simulates streaming input on 'abababababa', discovering all 5 occurrences of 'aba' with zero loop jitter"}
]

# ----------------- PART 5 -----------------
p5_say = [
    "To synthesize the full operational power of the Knuth-Morris-Pratt algorithm, we examine an enterprise-grade observability architecture: the StreamLogKMPMatcher. In modern cloud-native environments, distributed Kubernetes clusters, serverless API gateways, and microservices architectures generate hundreds of gigabytes of streaming logs every hour. Site Reliability Engineering (SRE) teams and Security Operations Centers (SOCs) must monitor these continuous log streams in real time to detect critical failure signatures—such as '502_BAD_GATEWAY', 'CONNECTION_REFUSED', or 'FATAL_OOM_KILLED'—and trigger immediate automated remediation workflows.",
    "Attempting to monitor streaming logs by loading full log files into memory or using regular expressions incurs catastrophic memory bloat and CPU exhaustion. Regex engines that rely on backtracking can suffer catastrophic latency degradation when processing unformatted log payloads, delaying alerting pipelines by minutes during critical production outages. StreamLogKMPMatcher solves this by implementing a zero-copy, stateful streaming KMP state machine that processes log streams chunk-by-chunk with zero memory buffering and deterministic linear O(N) throughput.",
    "The core architectural innovation of StreamLogKMPMatcher is chunk-boundary state continuity. In real-world logging systems, logs arrive in discrete network chunks or ring-buffer pages (e.g., 4 KB to 64 KB buffers). A critical failure signature like '502_BAD_GATEWAY' can easily be split across chunk boundaries—for instance, the prefix '502_BAD_' might arrive at the very end of Chunk 1, while the suffix 'GATEWAY' arrives at the beginning of Chunk 2. Naive line-based or buffer-based matchers fail to detect split signatures, creating blind spots in production monitoring.",
    "StreamLogKMPMatcher preserves state across chunk boundaries by maintaining an active pattern state variable j across successive scanLogChunk() invocations. When Chunk 1 ends, the matcher saves its final pattern state j = nextState. When Chunk 2 arrives, scanning resumes seamlessly from state j, evaluating the first character of Chunk 2 directly against the expected continuation of the pattern. If the boundary split matches the pattern, the signature is detected immediately, and the exact incident offset within the chunk is recorded without requiring chunk concatenation.",
    "Furthermore, the matcher pairs incident detection with automated severity classification and telemetry aggregation. Incidents are classified into severity tiers ('CRITICAL', 'WARNING', 'INFO') and populated with match counts and offset arrays. This telemetry stream feeds directly into automated incident response systems, such as PagerDuty alerts, circuit breaker trip commands, or auto-scaling governors, allowing cloud infrastructure to heal itself before customers experience prolonged service degradation.",
    "At the hardware and OS boundary, StreamLogKMPMatcher operates with extreme cache efficiency. The failure table pi for an error signature of length 20 occupies merely 80 bytes, fitting entirely within a single 64-byte L1 CPU data cache line. By eliminating buffer allocations, string copies, and regular expression compilation overhead, the matcher achieves sustained processing throughput exceeding five hundred megabytes per second per core, demonstrating that classical string algorithms remain the foundation of resilient cloud-native observability.",
    "In multi-core streaming architectures, incoming log streams from thousands of containers are partitioned across CPU worker cores using consistent hashing on container ID. Each worker thread instantiates a dedicated StreamLogKMPMatcher instance with zero lock contention. As worker threads ingest high-velocity TCP streams, match counts and byte offsets are emitted into lock-free ring buffers, enabling downstream stream processing frameworks like Apache Kafka and Apache Flink to aggregate cluster-wide error rates without bottlenecking ingress log shippers.",
    "To maximize instruction pipelining, modern SIMD (Single Instruction, Multiple Data) vector extensions like AVX-512 and ARM Neon can be combined with KMP. By broadcasting the first character of the signature across a 512-bit vector register, the engine scans 64 incoming stream bytes in a single clock cycle to locate candidate match points before invoking the KMP state machine, achieving extraordinary processing velocities.",
    "Finally, StreamLogKMPMatcher exports standardized OpenTelemetry metrics, exposing Prometheus counters for total bytes scanned, signatures matched, and boundary transition frequency. Real-time Grafana dashboards plot error frequency histograms, providing infrastructure engineers with instantaneous visibility into downstream cascading failures and enabling automated canary rollbacks before bad software deployments impact production SLAs."
]

p5_example = (
    "Consider an e-commerce platform during a global Black Friday sales event processing 250,000 checkout transactions per second. Ingress Envoy proxy pods stream access logs over a local Unix domain socket to a sidecar log surveillance daemon. An upstream payment gateway begins intermittently timing out, emitting '502_BAD_GATEWAY' errors across distributed proxy nodes. Using StreamLogKMPMatcher, the sidecar daemon scans incoming 64 KB socket chunks in real time. Within 12 milliseconds of the first failure, the matcher detects the error signature split across chunk boundaries, aggregates 15 matching incidents, and triggers an automated circuit breaker that reroutes checkout traffic to an alternate payment provider. The platform prevents millions of dollars in lost transactions, operating with zero latency overhead."
)

p5_tryIt = (
    "Run the complete StreamLogKMPMatcher verification suite below. Trace how the matcher initializes the failure table pi for the critical signature '502_BAD_GATEWAY'. Follow the runEnterpriseLogStreamPipeline() function as it passes simulated log chunks (chunk1 and chunk2) to scanLogChunk(), carrying the active state across chunk boundaries. Verify that the matcher detects both incidents accurately, logs exact byte offsets, and preserves continuous state without allocating intermediate buffers."
)

p5_check = {
    "question": "How does StreamLogKMPMatcher guarantee that an error signature split across two consecutive network chunks (e.g. '502_BAD_' in chunk 1 and 'GATEWAY' in chunk 2) is detected without concatenating the chunks in memory?",
    "options": [
        "By returning the active pattern pointer j as nextState at the end of chunk 1 and initializing the pattern pointer with nextState at the start of chunk 2, preserving automaton matching progress across chunk boundaries",
        "By writing all incoming chunks to a persistent PostgreSQL database and executing a recursive full-text search query",
        "By converting both chunks into base64 strings and calculating the SHA-256 cryptographic digest of their concatenation",
        "By pausing network ingestion until the entire multi-gigabyte log stream has completed and arrived in memory"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The KMP state machine encapsulates all matching history in a single integer variable j (the active matched prefix length). By saving j = nextState at the end of chunk 1 and passing it into scanLogChunk() for chunk 2, the algorithm continues evaluating the pattern exactly where it left off, detecting split signatures across boundaries without allocating memory or concatenating raw text buffers."
}

p5_code = """/**
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

runEnterpriseLogStreamPipeline();"""

p5_output = """=== StreamLogKMPMatcher: Enterprise Log Surveillance Pipeline ===
[StreamMatcher] Chunk 1 Scanned (118 bytes) - Incidents: 1 at offsets: [81]
[StreamMatcher] Chunk 2 Scanned (149 bytes) - Incidents: 1 at offsets: [81]
[StreamMatcher] Total Critical Incidents Detected: 2 (Severity: CRITICAL)
[StreamMatcher] Surveillance Complete: Zero-copy streaming state preserved across chunk boundaries"""

p5_codeNotes = [
    {"line": 5, "note": "Defines LogStreamIncident reporting signature, match frequency, offsets, and severity rating"},
    {"line": 19, "note": "Precomputes KMP failure table pi in O(M) time for target error signature"},
    {"line": 34, "note": "Executes scanLogChunk resuming from activeState without allocating temporary concatenation buffers"},
    {"line": 45, "note": "Returns detected incidents along with nextState to seamlessly bridge chunk boundaries"},
    {"line": 64, "note": "Demonstrates continuous state preservation and incident detection across simulated streaming chunks"}
]

day37_data = {
    "day": 37,
    "coursePrefix": "dsa-optim",
    "title": "Knuth-Morris-Pratt (KMP) Algorithm & Prefix Automaton",
    "minutes": 38,
    "parts": [
        {
            "title": "Failure Functions, Border Arrays & The Classical Prefix Function Pi",
            "say": p1_say,
            "example": p1_example,
            "tryIt": p1_tryIt,
            "check": p1_check,
            "code": p1_code,
            "output": p1_output,
            "codeNotes": p1_codeNotes
        },
        {
            "title": "The Knuth-Morris-Pratt (KMP) Linear Pattern Matching Engine",
            "say": p2_say,
            "example": p2_example,
            "tryIt": p2_tryIt,
            "check": p2_check,
            "code": p2_code,
            "output": p2_output,
            "codeNotes": p2_codeNotes
        },
        {
            "title": "String Periodicity, Repetitions & Compression via Border Arrays",
            "say": p3_say,
            "example": p3_example,
            "tryIt": p3_tryIt,
            "check": p3_check,
            "code": p3_code,
            "output": p3_output,
            "codeNotes": p3_codeNotes
        },
        {
            "title": "The Deterministic Finite Automaton (DFA) Prefix Automaton",
            "say": p4_say,
            "example": p4_example,
            "tryIt": p4_tryIt,
            "check": p4_check,
            "code": p4_code,
            "output": p4_output,
            "codeNotes": p4_codeNotes
        },
        {
            "title": "Enterprise Application: Real-Time Stream Log Pattern Filter & Metric Counter",
            "say": p5_say,
            "example": p5_example,
            "tryIt": p5_tryIt,
            "check": p5_check,
            "code": p5_code,
            "output": p5_output,
            "codeNotes": p5_codeNotes
        }
    ],
    "projectStep": {
        "title": "Industrial Case Study: High-Throughput Streaming Log Surveillance & Failure Matcher",
        "steps": [
            "Compute prefix function pi arrays and failure links for critical production error signatures.",
            "Deploy Knuth-Morris-Pratt (KMP) zero-backtracking stream scanner across multi-chunk log buffers.",
            "Incorporate string periodicity analysis to detect and compress repetitive turbine vibration waveforms.",
            "Synthesize StreamLogKMPMatcher to execute zero-copy incident detection across distributed proxy streams."
        ]
    },
    "summary": [
        "The Prefix Function pi[i] computes the length of the longest proper border of prefix s[0..i] in linear amortized O(N) time.",
        "The Knuth-Morris-Pratt (KMP) algorithm guarantees strictly monotonic text traversal with zero pointer backtracking in O(N + M) time.",
        "By the Period-Border Duality Theorem, the smallest period of string s is k = N - pi[N - 1], enabling O(N) periodicity and compressibility tests.",
        "Compiling the prefix function into a Deterministic Finite Automaton (DFA) enables O(1) worst-case transitions per byte with zero loop jitter.",
        "StreamLogKMPMatcher preserves state across chunk boundaries to detect split error signatures in multi-gigabit streams without buffer concatenation."
    ]
}

# Verify word counts
total_words = 0
for idx, part in enumerate(day37_data["parts"]):
    words = sum(len(p.split()) for p in part["say"])
    total_words += words
    print(f"Part {idx + 1} say words: {words}")
    assert words >= 600, f"Part {idx + 1} words {words} < 600!"

print(f"Total Day 37 say words: {total_words}")
assert total_words >= 3100, f"Total words {total_words} < 3100!"

os.makedirs("scripts/branch_c", exist_ok=True)
with open("scripts/branch_c/day37_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day37_data, f, indent=2)

print("Saved scripts/branch_c/day37_lesson.json successfully!")
