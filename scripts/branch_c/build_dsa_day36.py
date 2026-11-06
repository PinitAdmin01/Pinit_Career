import json
import os

# ----------------- PART 1 -----------------
p1_say = [
    "In large-scale string processing, genomic sequence analysis, source code deduplication, and high-performance search engines, comparing arbitrary substrings of massive text corpora in constant time represents a foundational computational requirement. In naive string implementations, checking whether two substrings s[i..i+L] and s[j..j+L] of length L are identical requires character-by-character comparison in linear time O(L). When an application executes millions of substring comparisons across gigabytes of streaming data—such as detecting duplicated code blocks in Git repositories or matching signatures in intrusion detection systems—linear scans incur prohibitive quadratic time overhead O(Q * L). To overcome this bottleneck, computer scientists developed Polynomial Rolling Hashes, a mathematical technique that maps arbitrary substrings to compact numerical fingerprints with O(1) equality verification.",
    "The mathematical foundation of polynomial string hashing treats a string s of length N over an alphabet Sigma as a polynomial whose coefficients are determined by character values. Specifically, given a fixed prime base p strictly greater than the cardinality of the alphabet (such as p = 31 for lowercase English letters, p = 53 for mixed-case alphabets, or p = 257 for arbitrary ASCII byte streams) and a large prime modulus m, the polynomial hash of string s is formally defined as H(s) = (sum_{i=0}^{N-1} s[i] * p^(N - 1 - i)) mod m. Alternatively, in the forward ascending representation, the hash is formulated as H(s) = (sum_{i=0}^{N-1} s[i] * p^i) mod m. Both formulations map arbitrary sequences of characters to integers in the finite field Z_m.",
    "The true computational power of polynomial hashing emerges when we compute prefix hashes for an entire string in a single linear-time precomputation pass. By allocating a prefix hash array prefixHash of size N + 1 and an array powers storing successive powers of the base (powers[k] = p^k mod m), the hash of any prefix of length i is defined recursively: prefixHash[0] = 0, and prefixHash[i + 1] = (prefixHash[i] * p + s[i]) mod m. Once this O(N) precomputation is complete, the hash of any arbitrary substring s[L..R] (where 0 <= L <= R < N) can be extracted in strictly constant O(1) time using the arithmetic relation: Hash(s[L..R]) = (prefixHash[R + 1] - prefixHash[L] * p^(R - L + 1)) mod m.",
    "Handling modular arithmetic correctly is vital in systems programming to prevent integer underflow and truncation errors. Because modular subtraction in the formula (prefixHash[R + 1] - prefixHash[L] * p^(R - L + 1)) can yield a negative integer before the modulus is applied, robust implementations compute raw = (prefixHash[R + 1] - (prefixHash[L] * powers[len]) % m) % m, and normalize the result via (raw + m) % m. In languages such as TypeScript and JavaScript, utilizing BigInt primitives or 64-bit unsigned integers (uint64) avoids the IEEE 754 53-bit safe integer limit, ensuring exact arithmetic without precision loss when multiplying large hash coefficients.",
    "Choosing the prime base p and modulus m requires rigorous mathematical discipline. If base p is chosen smaller than the alphabet size (for instance, choosing p = 10 for English characters), distinct characters like 'a' and 'k' produce identical hash contributions at adjacent powers, causing catastrophic hash collisions where completely distinct strings generate identical fingerprints. Furthermore, choosing a non-prime modulus m (such as 2^64 via automatic unsigned integer overflow) exposes the hash function to adversarial collision attacks, such as Thue-Morse sequence constructions, where malicious actors craft inputs that force constant collisions. Therefore, enterprise systems select large prime moduli, such as 10^9 + 7 or 10^9 + 9, to preserve uniform distribution across the hash space.",
    "By establishing an O(1) substring hash extraction primitive, complex algorithmic queries become dramatically more tractable. For instance, testing whether a pattern of length M occurs anywhere in a text of length N can be performed by sliding a window of length M and comparing the precomputed pattern hash against each candidate substring hash. This foundation directly powers the classical Rabin-Karp algorithm and enables near-instantaneous deduplication across planetary-scale datasets."
]

p1_example = (
    "Consider an enterprise cloud code repository platform like GitHub analyzing millions of source code commits to detect code plagiarism and license compliance violations across open-source projects. Comparing incoming code files against a global index of billions of existing functions using naive character comparison would exhaust data center compute clusters. Instead, the platform's indexing pipeline treats each source file as a continuous stream of tokens, computes prefix polynomial hashes using prime base p = 53 and modulus m = 1,000,000,007, and stores prefix power arrays in memory. When analyzing a 10,000-line source file, the engine can extract the exact numerical fingerprint of any arbitrary 50-line function block in 4 nanoseconds using a single O(1) modular arithmetic evaluation. This allows the system to compare incoming commits against millions of indexed code blocks per second with minimal CPU load."
)

p1_tryIt = (
    "Examine the PolynomialStringHasher implementation below. Review how the constructor precomputes both the prefix hash array and the powers array in a single O(N) linear sweep using BigInt modular arithmetic. Trace the querySubstringHash() method to see how it aligns powers and normalizes negative differences via (raw + mod) % mod. Test how querying identical substrings at distinct offsets produces identical hash integers, while querying non-identical substrings yields completely distinct fingerprints in O(1) time."
)

p1_check = {
    "question": "In polynomial string hashing with prefix array prefixHash, why is the substring hash of s[L..R] computed as (prefixHash[R + 1] - prefixHash[L] * p^(R - L + 1)) mod m rather than simply prefixHash[R + 1] - prefixHash[L]?",
    "options": [
        "Because prefixHash[L] contains the hash of the prefix s[0..L-1] shifted to the power p^(R - L + 1); multiplying by p^(R - L + 1) aligns the positional exponents so that subtracting eliminates the prefix contribution exactly",
        "Because multiplying by p^(R - L + 1) converts the characters from ASCII byte values into UTF-16 Unicode code points",
        "Because the modulus m requires both operands to have identical prime factorizations before subtraction can take place",
        "Because subtracting without exponent alignment causes the hash value to become zero for all palindromic strings"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "In the polynomial hash formulation H(s) = sum s[i] * p^(n - 1 - i), each character's contribution is scaled by a power of p corresponding to its position. The prefix hash prefixHash[R + 1] incorporates all characters s[0..R], while prefixHash[L] contains s[0..L-1]. In prefixHash[R + 1], the prefix s[0..L-1] has been multiplied by p an additional (R - L + 1) times. Multiplying prefixHash[L] by p^(R - L + 1) aligns the powers perfectly, so subtracting cancels out s[0..L-1] and isolates s[L..R]."
}

p1_code = """/**
 * Day 36 - Part 1: Polynomial Rolling Hash & O(1) Substring Hash Extraction
 */

class PolynomialStringHasher {
  private base: bigint;
  private mod: bigint;
  private prefixHash: bigint[];
  private powers: bigint[];

  constructor(s: string, base: bigint = 31n, mod: bigint = 1_000_000_007n) {
    this.base = base;
    this.mod = mod;
    const n = s.length;
    this.prefixHash = new Array(n + 1).fill(0n);
    this.powers = new Array(n + 1).fill(1n);

    for (let i = 0; i < n; i++) {
      const charVal = BigInt(s.charCodeAt(i) - 96); // 1-indexed for 'a'-'z'
      this.prefixHash[i + 1] = (this.prefixHash[i] * this.base + charVal) % this.mod;
      this.powers[i + 1] = (this.powers[i] * this.base) % this.mod;
    }
  }

  // Returns hash of substring s[left..right] (0-indexed inclusive)
  querySubstringHash(left: number, right: number): bigint {
    const len = BigInt(right - left + 1);
    const raw = (this.prefixHash[right + 1] - (this.prefixHash[left] * this.powers[Number(len)]) % this.mod) % this.mod;
    return (raw + this.mod) % this.mod;
  }
}

function main(): void {
  const text = "abacaba";
  const hasher = new PolynomialStringHasher(text);

  // Substrings: s[0..2] is "aba", s[4..6] is "aba"
  const hash1 = hasher.querySubstringHash(0, 2);
  const hash2 = hasher.querySubstringHash(4, 6);
  // Substring: s[1..3] is "bac"
  const hash3 = hasher.querySubstringHash(1, 3);

  console.log(`[StringHasher] Text: "${text}"`);
  console.log(`[StringHasher] Hash("aba" @ [0..2]): ${hash1}`);
  console.log(`[StringHasher] Hash("aba" @ [4..6]): ${hash2}`);
  console.log(`[StringHasher] Substrings Equal ("aba" === "aba"): ${hash1 === hash2}`);
  console.log(`[StringHasher] Hash("bac" @ [1..3]): ${hash3}`);
  console.log(`[StringHasher] Substrings Differ ("aba" !== "bac"): ${hash1 !== hash3}`);
}

main();"""

p1_output = """[StringHasher] Text: "abacaba"
[StringHasher] Hash("aba" @ [0..2]): 1024
[StringHasher] Hash("aba" @ [4..6]): 1024
[StringHasher] Substrings Equal ("aba" === "aba"): true
[StringHasher] Hash("bac" @ [1..3]): 1956
[StringHasher] Substrings Differ ("aba" !== "bac"): true"""

p1_codeNotes = [
    {"line": 5, "note": "Defines PolynomialStringHasher class storing base, modulus, prefix hash array, and powers array"},
    {"line": 18, "note": "Populates prefixHash array using Horner's method and precomputes powers of base mod m in O(N)"},
    {"line": 26, "note": "Extracts arbitrary substring hash s[left..right] in O(1) time using modular exponent alignment"},
    {"line": 28, "note": "Normalizes negative modulo differences by adding mod before the final modulo operation"},
    {"line": 35, "note": "Demonstrates identical hash output for identical substrings at different offsets in text"}
]

# ----------------- PART 2 -----------------
p2_say = [
    "While single-modulus polynomial hashing provides exceptionally fast O(1) substring comparisons, relying on a single hash value introduces a critical vulnerability: hash collisions. In computational complexity theory, a collision occurs when two distinct strings s != t yield identical hash values H(s) = H(t). In mission-critical enterprise environments—such as financial transaction deduplication, cryptographic ledger audit trails, and automated compiler symbol resolution—treating two non-identical strings as identical due to an unhandled hash collision leads to silent data corruption, invalid authorization bypasses, or catastrophic logic crashes.",
    "The probability of hash collisions is governed by the Birthday Paradox. In a finite hash space of size m, when we compare k distinct strings, the probability that at least two strings share the exact same hash value is approximated by P(collision) approx 1 - exp(-k^2 / (2m)). For a standard single prime modulus m approx 10^9 (such as 1,000,000,007), a 50% collision probability is reached after hashing merely k approx sqrt(2 * 10^9 * ln 2) approx 37,230 distinct strings. In modern web applications and distributed databases processing millions of substrings per second, evaluating 40,000 strings is achieved in a matter of milliseconds, making single-modulus collisions an mathematical certainty rather than a remote anomaly.",
    "To achieve absolute collision immunity across planetary-scale datasets without paying the prohibitive cost of character-by-character string verification, enterprise systems deploy Double Polynomial Rolling Hashing. Double hashing pairs two completely independent prime bases and prime moduli: (base_1, mod_1) and (base_2, mod_2). Common standard pairs include base_1 = 31 with mod_1 = 1,000,000,007, and base_2 = 53 with mod_2 = 1,000,000,009. Each substring s[L..R] is mapped to a 2-tuple of hashes: H_double(s) = (H_1(s) mod mod_1, H_2(s) mod mod_2).",
    "Because mod_1 and mod_2 are coprime primes, the Chinese Remainder Theorem establishes that the combined hash space has an effective cardinality of M_eff = mod_1 * mod_2 approx 10^9 * 10^9 = 10^18. In a hash space of size 10^18, reaching a 50% collision probability requires hashing k approx sqrt(2 * 10^18 * ln 2) approx 1,177,000,000 (over 1.17 billion) distinct substrings. Even if a system processes 10 million distinct strings daily, the probability of a collision occurring over decades of continuous operation remains well below 10^-6, providing carrier-grade statistical safety.",
    "At the data structure level, a double string hasher maintains two parallel prefix hash arrays (pref1, pref2) and two parallel power arrays (pow1, pow2). When querying a substring, both hashes are extracted in parallel in O(1) time and packaged into a lightweight record { h1: bigint, h2: bigint }. Two substrings are judged equal if and only if both h1 and h2 match identically. This dual-key equality check requires merely two 64-bit integer comparisons, maintaining sub-microsecond latency while providing virtually unbreakable collision resistance.",
    "Furthermore, double hashing frustrates algorithmic complexity attacks. In open web services, adversaries can craft adversarial collision payloads against known single-modulus hash functions to force worst-case hash-table degradation. Because constructing inputs that simultaneously collide across two large coprime prime moduli requires solving complex multi-variable diophantine modular equations, double hashing acts as an effective defense against denial-of-service (DoS) hash flooding exploits.",
    "Hardware implementation considerations also strongly favor 32-bit prime moduli over 64-bit non-prime integers. When developers attempt 64-bit hashing using native unsigned 64-bit integer overflow (mod 2^64), the hash function fails Fermat's primality guarantees. The presence of even divisors in 2^64 allows subtle periodicities to accumulate across power products, creating known collision generators like the Thue-Morse sequence that produce identical hashes for inputs under 100 characters. By strictly employing two large prime moduli, our dual-hashing architecture preserves rigorous mathematical uniformity across all bit positions.",
    "Finally, enterprise distributed systems benefit from the deterministic composability of double hashes across distributed microservices. When multiple cluster worker nodes compute hash tuples independently on partitioned data streams, the resulting { h1, h2 } composite tokens can be compared across network boundaries without sharing the underlying text payload, drastically reducing inter-service bandwidth consumption in large data processing pipelines."
]

p2_example = (
    "Consider an enterprise web security gateway inspecting incoming HTTP payloads for zero-day threat signatures and malicious shellcode fragments across 100 Gbps network interfaces. The threat intelligence engine maintains a database of 500,000 known malware hex signatures. If the gateway relied on a single 32-bit polynomial hash with modulus 10^9+7, birthday paradox dynamics would generate hundreds of false collision matches per day, causing legitimate customer API traffic to be erroneously blocked by the firewall. By upgrading to a Double Polynomial Rolling Hasher with dual primes (10^9+7 and 10^9+9), the effective hash space expands to 10^18. Over five years of continuous production traffic, the gateway processes trillions of HTTP packet payloads with zero false positive collision alarms, ensuring flawless threat detection without disrupting legitimate enterprise services."
)

p2_tryIt = (
    "Review the DoubleStringHasher implementation below. Notice how the class constructs two independent sets of prefix arrays and power arrays using distinct prime bases (31 and 53) and distinct prime moduli (1,000,000,007 and 1,000,000,009). Follow the query() method to see how it extracts the dual hash tuple in O(1) time. Test the DoubleStringHasher.equals() static comparator on identical repeated phrases versus distinct substrings, verifying that dual-key matching provides foolproof equality identification."
)

p2_check = {
    "question": "Why does pairing two independent 32-bit prime moduli (mod_1 approx 10^9 and mod_2 approx 10^9) in double hashing expand the effective hash space to 10^18, according to the Chinese Remainder Theorem?",
    "options": [
        "Because mod_1 and mod_2 are distinct prime numbers (coprime), every unique pair of residues (r_1, r_2) corresponds to a unique integer modulo (mod_1 * mod_2), multiplying the total possible hash states",
        "Because squaring the modulus doubles the clock speed of the CPU's arithmetic logic unit (ALU) during division operations",
        "Because two prime moduli automatically eliminate all odd numbers from the hash space, compressing memory addresses by half",
        "Because modular addition cancels out all prime factors, transforming modular arithmetic into floating-point matrix multiplication"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "By the Chinese Remainder Theorem, if m_1 and m_2 are coprime, the system of congruences x = r_1 (mod m_1) and x = r_2 (mod m_2) has a unique solution modulo m_1 * m_2. Since m_1 and m_2 are distinct primes of magnitude ~10^9, they are strictly coprime, and there are m_1 * m_2 ~ 10^18 distinct pairs of residues (r_1, r_2). This increases the size of the hash universe from 10^9 to 10^18, drastically raising the number of strings needed to trigger a birthday paradox collision."
}

p2_code = """/**
 * Day 36 - Part 2: Double Polynomial Rolling Hash for Collision Immunity
 */

interface DoubleHash {
  h1: bigint;
  h2: bigint;
}

class DoubleStringHasher {
  private base1: bigint = 31n;
  private mod1: bigint = 1_000_000_007n;
  private base2: bigint = 53n;
  private mod2: bigint = 1_000_000_009n;

  private pref1: bigint[];
  private pref2: bigint[];
  private pow1: bigint[];
  private pow2: bigint[];

  constructor(s: string) {
    const n = s.length;
    this.pref1 = new Array(n + 1).fill(0n);
    this.pref2 = new Array(n + 1).fill(0n);
    this.pow1 = new Array(n + 1).fill(1n);
    this.pow2 = new Array(n + 1).fill(1n);

    for (let i = 0; i < n; i++) {
      const code = BigInt(s.charCodeAt(i));
      this.pref1[i + 1] = (this.pref1[i] * this.base1 + code) % this.mod1;
      this.pref2[i + 1] = (this.pref2[i] * this.base2 + code) % this.mod2;
      this.pow1[i + 1] = (this.pow1[i] * this.base1) % this.mod1;
      this.pow2[i + 1] = (this.pow2[i] * this.base2) % this.mod2;
    }
  }

  query(left: number, right: number): DoubleHash {
    const len = BigInt(right - left + 1);
    const r1 = (this.pref1[right + 1] - (this.pref1[left] * this.pow1[Number(len)]) % this.mod1) % this.mod1;
    const r2 = (this.pref2[right + 1] - (this.pref2[left] * this.pow2[Number(len)]) % this.mod2) % this.mod2;
    return {
      h1: (r1 + this.mod1) % this.mod1,
      h2: (r2 + this.mod2) % this.mod2
    };
  }

  static equals(a: DoubleHash, b: DoubleHash): boolean {
    return a.h1 === b.h1 && a.h2 === b.h2;
  }
}

function main(): void {
  const corpus = "enterprise_security_kernel_enterprise_security_token";
  const hasher = new DoubleStringHasher(corpus);

  // Substring 1: "enterprise_security" @ [0..18]
  const dHash1 = hasher.query(0, 18);
  // Substring 2: "enterprise_security" @ [27..45]
  const dHash2 = hasher.query(27, 45);
  // Substring 3: "kernel_enterprise_s" @ [20..38]
  const dHash3 = hasher.query(20, 38);

  console.log(`[DoubleHasher] Dual Module Mod1: 10^9+7, Mod2: 10^9+9`);
  console.log(`[DoubleHasher] Substring [0..18] Hash: (${dHash1.h1}, ${dHash1.h2})`);
  console.log(`[DoubleHasher] Substring [27..45] Hash: (${dHash2.h1}, ${dHash2.h2})`);
  console.log(`[DoubleHasher] Duplicate Identity Match: ${DoubleStringHasher.equals(dHash1, dHash2)}`);
  console.log(`[DoubleHasher] Distinct Substring Equality: ${DoubleStringHasher.equals(dHash1, dHash3)}`);
}

main();"""

p2_output = """[DoubleHasher] Dual Module Mod1: 10^9+7, Mod2: 10^9+9
[DoubleHasher] Substring [0..18] Hash: (34437297, 451577068)
[DoubleHasher] Substring [27..45] Hash: (34437297, 451577068)
[DoubleHasher] Duplicate Identity Match: true
[DoubleHasher] Distinct Substring Equality: false"""

p2_codeNotes = [
    {"line": 5, "note": "Defines DoubleHash interface holding two 64-bit integer components h1 and h2"},
    {"line": 10, "note": "Configures dual prime moduli 1,000,000,007 and 1,000,000,009 with independent bases 31 and 53"},
    {"line": 26, "note": "Precomputes parallel prefix hash and power arrays for both modular domains in a single pass"},
    {"line": 36, "note": "Extracts dual-hash tuple for substring [left..right] in O(1) time"},
    {"line": 46, "note": "Implements strict dual-component equality comparator verifying identical match across both moduli"}
]

# ----------------- PART 3 -----------------
p3_say = [
    "One of the most celebrated algorithmic breakthroughs in computer science is the Rabin-Karp string search algorithm, published by Michael Rabin and Richard Karp in 1987. The fundamental challenge addressed by Rabin-Karp is locating all occurrences of a search pattern P of length M within a larger text T of length N. The naive brute-force approach tests every possible starting position i in text T by comparing P against T[i..i+M-1] character by character. In the worst case—such as searching for pattern 'aaab' within text 'aaaaaaaaab'—the naive algorithm performs M comparisons for each of the N - M + 1 windows, resulting in quadratic time complexity O(N * M).",
    "Rabin-Karp transforms this search problem by using a sliding window rolling hash. Instead of recomputing the hash of each window of length M from scratch—which would still consume O(M) time per window—the algorithm computes the hash of the next window from the current window in strictly constant O(1) time. When the window slides from index i to index i + 1, exactly one character leaves the window (the leading character T[i]) and exactly one character enters the window (the trailing character T[i + M]).",
    "The mathematical transition between consecutive sliding window hashes is governed by a modular subtraction, multiplication, and addition. In polynomial representation H(w) = (sum_{j=0}^{M-1} w[j] * base^(M - 1 - j)) mod m, the contribution of the leading character T[i] is T[i] * base^(M - 1). To slide the window, the algorithm first subtracts this leading term: H_temp = (H(w) - T[i] * base^(M - 1)) mod m. It then multiplies the intermediate result by base to shift all remaining characters one position to the left: H_shifted = (H_temp * base) mod m. Finally, it adds the new incoming character: H(w_next) = (H_shifted + T[i + M]) mod m.",
    "By maintaining highPow = base^(M - 1) mod m, every window transition executes in a handful of arithmetic operations, requiring O(1) time. Consequently, computing the hash for all N - M + 1 windows consumes O(N) total time. Whenever the current window hash matches the precomputed pattern hash (windowHash === patternHash), the algorithm performs a secondary verification step: it checks whether the characters of T[i..i+M-1] match P exactly. This verification pass guarantees that even if an improbable hash collision occurs, false positive matches are filtered out deterministically.",
    "Under a uniformly distributed hash function with modulus m, the probability of a hash collision at any given window is at most 1 / m. Therefore, the expected number of false positive collisions across the entire text is (N - M + 1) / m. By choosing m >> N (such as m = 10^9 + 7 for texts of length up to 10^6), the expected number of spurious character verifications is practically zero. Thus, the expected running time of Rabin-Karp is strictly linear O(N + M), matching more complex automata-based algorithms like Knuth-Morris-Pratt while remaining far simpler to implement and generalize.",
    "A major practical advantage of Rabin-Karp over alternative algorithms is its effortless extensibility to multi-pattern searching and multi-dimensional pattern matching. If an application needs to search for K patterns of identical length M simultaneously, the hashes of all K patterns can be inserted into a hash set in O(K * M) time. As the window slides across text T, checking whether the current window matches any of the K patterns requires a single O(1) set lookup, enabling multi-pattern search in O(N + K * M) expected time.",
    "In streaming network architectures, Rabin-Karp can be deployed without buffering the entire input stream in memory. Because the rolling hash maintains state exclusively through an integer accumulator and a circular buffer of the most recent M characters, memory consumption is strictly O(M). In modern eBPF/XDP kernel programs or FPGA network interface cards, this compact state allows wire-speed payload filtering directly on incoming packet ring buffers without touching host memory."
]

p3_example = (
    "Consider an enterprise database firewall monitoring raw SQL wire-protocol packets on an ingress network switch. The security rule engine inspects the streaming payload for dangerous SQL injection signatures, such as 'UNION SELECT' or 'OR 1=1--'. Using Rabin-Karp, the engine precomputes the hash of the malicious signature string. As thousands of incoming network packets stream past, the engine slides a window of size M across the packet payload buffer, updating the 64-bit rolling hash in constant time per byte. Out of billions of analyzed bytes, only when a rolling hash exactly matches the signature hash does the engine trigger a character verification check and drop the malicious connection. This streaming architecture operates at multi-gigabit wire speed without buffering entire streams in memory."
)

p3_tryIt = (
    "Examine the RabinKarpSearcher implementation below. Trace how highPow = base^(m - 1) % mod is computed during initialization to facilitate rapid leading-character subtraction. Follow the sliding window loop as it compares windowHash against patternHash, performs character verification upon match, and updates the rolling hash in O(1) time. Observe how the searcher finds all four occurrences of the genomic motif 'CGATCG' across the target sequence cleanly."
)

p3_check = {
    "question": "What is the expected time complexity of the Rabin-Karp algorithm when searching for a pattern of length M within a text of length N using a sufficiently large prime modulus m >> N?",
    "options": [
        "O(N + M) expected time, because precomputing pattern and window hashes takes O(M) and sliding the window takes O(1) per step with near-zero expected collision verifications",
        "O(N * M) expected time, because every single sliding window requires full character-by-character array comparison",
        "O(N * log M) expected time, because binary search must be executed over the pattern prefix tree at each window offset",
        "O(M^2) expected time, because the prime modulus must be dynamically factored into prime roots during every iteration"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Rabin-Karp precomputes the pattern hash and the initial text window hash in O(M) time. For each of the remaining N - M positions, updating the rolling hash requires constant O(1) time. With a large prime modulus m >> N, the probability of a false positive hash collision is negligible (<= N / m), meaning character-by-character verification is only triggered on true matches. Hence, the expected total time complexity is linear O(N + M)."
}

p3_code = """/**
 * Day 36 - Part 3: Rabin-Karp Sliding Window Pattern Matching
 */

class RabinKarpSearcher {
  private base: bigint = 256n;
  private mod: bigint = 1_000_000_007n;

  searchAll(pattern: string, text: string): number[] {
    const m = pattern.length;
    const n = text.length;
    if (m === 0 || n < m) return [];

    const occurrences: number[] = [];
    let patternHash = 0n;
    let windowHash = 0n;
    let highPow = 1n;

    // highPow = (base^(m-1)) % mod
    for (let i = 0; i < m - 1; i++) {
      highPow = (highPow * this.base) % this.mod;
    }

    // Initial hashes for pattern and first window
    for (let i = 0; i < m; i++) {
      patternHash = (patternHash * this.base + BigInt(pattern.charCodeAt(i))) % this.mod;
      windowHash = (windowHash * this.base + BigInt(text.charCodeAt(i))) % this.mod;
    }

    // Slide window across text
    for (let i = 0; i <= n - m; i++) {
      if (patternHash === windowHash) {
        // Verification pass to avoid false positive collisions
        if (text.substring(i, i + m) === pattern) {
          occurrences.push(i);
        }
      }

      if (i < n - m) {
        // Remove leading character and add trailing character
        const lead = (BigInt(text.charCodeAt(i)) * highPow) % this.mod;
        const trail = BigInt(text.charCodeAt(i + m));
        windowHash = ((windowHash - lead) % this.mod + this.mod) % this.mod;
        windowHash = (windowHash * this.base + trail) % this.mod;
      }
    }

    return occurrences;
  }
}

function main(): void {
  const searcher = new RabinKarpSearcher();
  const text = "CGATCGTACGATCGATCGTACGATCG";
  const pattern = "CGATCG";

  const matches = searcher.searchAll(pattern, text);
  console.log(`[RabinKarp] Text Length: ${text.length}, Pattern: "${pattern}" (Length: ${pattern.length})`);
  console.log(`[RabinKarp] Matching Indices Found: [${matches.join(", ")}]`);
  console.log(`[RabinKarp] Match Count: ${matches.length}`);
}

main();"""

p3_output = """[RabinKarp] Text Length: 26, Pattern: "CGATCG" (Length: 6)
[RabinKarp] Matching Indices Found: [0, 8, 12, 20]
[RabinKarp] Match Count: 4"""

p3_codeNotes = [
    {"line": 5, "note": "Defines RabinKarpSearcher class configured with ASCII base 256 and prime modulus 1,000,000,007"},
    {"line": 18, "note": "Precomputes highPow = base^(m-1) % mod to remove leading characters in O(1)"},
    {"line": 23, "note": "Computes initial polynomial hash for pattern and the first text window"},
    {"line": 31, "note": "Compares window hash against pattern hash; executes verification check on hash match"},
    {"line": 39, "note": "Slides window by subtracting leading character, multiplying by base, and adding incoming character"}
]

# ----------------- PART 4 -----------------
p4_say = [
    "Beyond single pattern matching, polynomial string hashing unlocks powerful analytical capabilities that solve complex structural string queries in logarithmic or constant time. Two of the most essential queries in advanced string algorithmics are finding the Longest Common Prefix (LCP) between two arbitrary suffixes and verifying whether an arbitrary substring forms a palindrome. In naive implementations, both queries require linear time O(L), which severely degrades algorithms like Suffix Array construction, Burrows-Wheeler Transform compression, and Manacher's palindromic factorization.",
    "Computing the Longest Common Prefix (LCP) between two suffixes s[i..N-1] and s[j..N-1] asks for the maximum integer k such that s[i..i+k-1] is identical to s[j..j+k-1]. Because substring equality can be tested in O(1) time using our precomputed prefix hashes, and because the property 'prefixes of length k are equal' is monotonically decreasing (if prefixes of length k match, all shorter prefixes < k match; if they differ, all longer prefixes > k must differ), we can solve for k using Binary Search over the length interval [1, min(N - i, N - j)].",
    "The binary search maintains bounds low = 1 and high = min(N - i, N - j). At each step, it probes midpoint mid = (low + high) / 2. It queries the hash of s[i..i+mid-1] and s[j..j+mid-1] in O(1) time. If the hashes match, the common prefix is at least mid, so the algorithm records lcp = mid and searches for a longer prefix in [mid + 1, high]. If the hashes differ, the mismatch occurs within the first mid characters, so it searches the shorter range [low, mid - 1]. Because each step halves the search space and evaluates hashes in O(1), the total time complexity to find the exact LCP is strictly O(log N).",
    "Another extraordinary capability enabled by polynomial hashing is constant-time Palindrome Verification. A substring s[L..R] is a palindrome if and only if it reads identically forwards and backwards: s[L..R] == reverse(s[L..R]). In standard architectures, testing palindromes requires character pointer convergence from outer boundaries toward the center in O(R - L + 1) time. However, by precomputing two parallel prefix hash arrays—a forward prefix hash prefForward on string s, and a reverse prefix hash prefReverse on the reversed string s_rev—we can verify palindromes in strictly O(1) time.",
    "To map substring coordinates accurately, an original substring s[L..R] in a string of length N corresponds to the index range [N - 1 - R, N - 1 - L] in the reversed string. By extracting the forward hash H_f = getForwardHash(L, R) and the reverse hash H_r = getReverseHash(L, R), the router verifies palindromicity via a single integer equality check: H_f === H_r. If the forward and reverse polynomial hashes are identical, the substring is guaranteed to be a palindrome (with probability 1 - 1/m).",
    "This O(1) palindrome oracle enables rapid discovery of palindromic structures throughout text. For example, finding the longest palindromic substring centered at index c can be determined by binary searching the radius r in O(log N) time using our O(1) palindrome checker. Across all 2N candidate centers, the entire set of maximal palindromes can be extracted in O(N log N) time without allocating additional strings or modifying memory.",
    "Furthermore, pairing LCP binary search with suffix sorting provides an intuitive, lightweight alternative to Ukkonen's suffix tree algorithm. To sort N suffixes of string s in lexicographical order, standard quicksort or mergesort performs O(N log N) suffix comparisons. Comparing two arbitrary suffixes s[i..] and s[j..] naively takes O(N) time, yielding O(N^2 log N) overall complexity. However, by querying LCP(i, j) in O(log N) time, the comparison simply jumps directly to index i + LCP and compares the first differing character s[i + LCP] with s[j + LCP] in O(1). This reduces suffix comparison to O(log N) and suffix sorting to O(N log^2 N), enabling rapid Suffix Array construction in just a few dozen lines of code."
]

p4_example = (
    "Consider a bio-computational genomics engine searching for palindromic inverted repeats in human DNA sequences. Inverted repeat sequences in cellular chromosomes often form hairpin stem-loop structures that regulate gene transcription or serve as binding targets for restriction enzymes like CRISPR-Cas9. The genomic engine precomputes forward and reverse polynomial rolling hash arrays for a 100,000-base-pair gene sequence in 15 milliseconds. Using the FastStringOracle, the system evaluates millions of candidate promoter windows in parallel, verifying palindromic hairpin stems in O(1) time and computing longest common flanking extensions in O(log N) binary search iterations. This enables automated chromosome annotation at speeds orders of magnitude faster than physical sequencing assays."
)

p4_tryIt = (
    "Examine the FastStringOracle implementation below. Follow how both prefForward and prefReverse arrays are constructed simultaneously in a single loop over the text. Trace the index transformation in getReverseHash() which maps [l, r] to [n - 1 - r, n - 1 - l]. Observe how computeLCP() performs binary search over substring lengths in O(log N) time, and verify how isPalindrome() checks for palindromic symmetry in O(1) time across words like 'racecar' and 'radar'."
)

p4_check = {
    "question": "How does combining polynomial string hashing with binary search achieve an O(log N) time complexity for Longest Common Prefix (LCP) queries between arbitrary suffixes?",
    "options": [
        "Because substring equality is tested in O(1) time via hash extraction, and prefix matching is monotonic, allowing binary search over the prefix length to halve the search interval at each step in O(log N) iterations",
        "Because binary search sorts all characters in alphabetical order, allowing the CPU cache to compress duplicate prefixes into zero-byte tokens",
        "Because the hash function automatically computes all suffix trees in O(1) space using recursive modular inversion",
        "Because prefix hashes convert string characters into floating-point vectors that can be intersected using constant-time dot products"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The property 'prefixes of length k are identical' is monotonic: if s[i..i+k-1] == s[j..j+k-1], then all prefixes of length < k are also identical. Conversely, if prefixes of length k differ, no prefix of length > k can be equal. Because our polynomial hash extracts and compares substring hashes of length k in O(1) time, binary searching for the maximum matching length k over [1, N] takes log2(N) steps, each costing O(1), yielding an overall O(log N) time complexity."
}

p4_code = """/**
 * Day 36 - Part 4: O(log N) LCP via Binary Search and O(1) Palindromic Verification
 */

class FastStringOracle {
  private n: number;
  private s: string;
  private prefForward: bigint[];
  private prefReverse: bigint[];
  private powers: bigint[];
  private base: bigint = 37n;
  private mod: bigint = 1_000_000_007n;

  constructor(s: string) {
    this.s = s;
    this.n = s.length;
    this.prefForward = new Array(this.n + 1).fill(0n);
    this.prefReverse = new Array(this.n + 1).fill(0n);
    this.powers = new Array(this.n + 1).fill(1n);

    for (let i = 0; i < this.n; i++) {
      const codeF = BigInt(s.charCodeAt(i));
      const codeR = BigInt(s.charCodeAt(this.n - 1 - i));
      this.prefForward[i + 1] = (this.prefForward[i] * this.base + codeF) % this.mod;
      this.prefReverse[i + 1] = (this.prefReverse[i] * this.base + codeR) % this.mod;
      this.powers[i + 1] = (this.powers[i] * this.base) % this.mod;
    }
  }

  getForwardHash(l: number, r: number): bigint {
    const len = BigInt(r - l + 1);
    const raw = (this.prefForward[r + 1] - (this.prefForward[l] * this.powers[Number(len)]) % this.mod) % this.mod;
    return (raw + this.mod) % this.mod;
  }

  getReverseHash(l: number, r: number): bigint {
    // [l, r] in original string corresponds to [n - 1 - r, n - 1 - l] in reversed string
    const revL = this.n - 1 - r;
    const revR = this.n - 1 - l;
    const len = BigInt(revR - revL + 1);
    const raw = (this.prefReverse[revR + 1] - (this.prefReverse[revL] * this.powers[Number(len)]) % this.mod) % this.mod;
    return (raw + this.mod) % this.mod;
  }

  isPalindrome(l: number, r: number): boolean {
    return this.getForwardHash(l, r) === this.getReverseHash(l, r);
  }

  // Computes Longest Common Prefix (LCP) between s[i..] and s[j..] in O(log N)
  computeLCP(i: number, j: number): number {
    let low = 1;
    let high = Math.min(this.n - i, this.n - j);
    let lcp = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const h1 = this.getForwardHash(i, i + mid - 1);
      const h2 = this.getForwardHash(j, j + mid - 1);

      if (h1 === h2) {
        lcp = mid;
        low = mid + 1; // Try longer prefix
      } else {
        high = mid - 1; // Try shorter prefix
      }
    }

    return lcp;
  }
}

function main(): void {
  const text = "racecar_radar_madam_racecar";
  const oracle = new FastStringOracle(text);

  // Palindrome checks
  console.log(`[StringOracle] Palindrome("racecar" @ [0..6]): ${oracle.isPalindrome(0, 6)}`);
  console.log(`[StringOracle] Palindrome("radar" @ [8..12]): ${oracle.isPalindrome(8, 12)}`);
  console.log(`[StringOracle] Palindrome("race" @ [0..3]): ${oracle.isPalindrome(0, 3)}`);

  // LCP between s[0..] ("racecar_radar...") and s[20..] ("racecar")
  const lcp1 = oracle.computeLCP(0, 20);
  console.log(`[StringOracle] LCP between s[0..] and s[20..]: ${lcp1} chars ("${text.substring(0, lcp1)}")`);

  // LCP between s[8..] ("radar_madam...") and s[14..] ("madam_racecar")
  const lcp2 = oracle.computeLCP(8, 14);
  console.log(`[StringOracle] LCP between s[8..] and s[14..]: ${lcp2} chars`);
}

main();"""

p4_output = """[StringOracle] Palindrome("racecar" @ [0..6]): true
[StringOracle] Palindrome("radar" @ [8..12]): true
[StringOracle] Palindrome("race" @ [0..3]): false
[StringOracle] LCP between s[0..] and s[20..]: 7 chars ("racecar")
[StringOracle] LCP between s[8..] and s[14..]: 0 chars"""

p4_codeNotes = [
    {"line": 5, "note": "Defines FastStringOracle storing forward and reverse prefix hash arrays for dual-directional queries"},
    {"line": 21, "note": "Builds forward and reverse polynomial hashes in parallel in a single linear O(N) constructor sweep"},
    {"line": 34, "note": "Maps original substring bounds [l, r] to reversed indices [n-1-r, n-1-l] to extract reverse hash in O(1)"},
    {"line": 42, "note": "Implements isPalindrome(l, r) by verifying forward and reverse hash equality in strict O(1) time"},
    {"line": 47, "note": "Executes binary search over prefix lengths in O(log N) to find the exact Longest Common Prefix (LCP)"}
]

# ----------------- PART 5 -----------------
p5_say = [
    "To consolidate the theoretical and practical dimensions of string hashing, we examine a production-grade enterprise architecture: the GenomicSequenceHashOracle. In modern bioinformatics, high-throughput DNA sequencing machines generate terabytes of raw genomic reads containing billions of nucleotide base pairs (Adenine, Cytosine, Guanine, and Thymine). Computational biologists and clinical diagnostics pipelines must identify repetitive promoter motifs, detect viral integrations, and deduplicate sequencing fragments (k-mers) in real time. Analyzing these massive biological sequences using quadratic character comparisons is computationally impossible; it requires an industrial-strength rolling hash oracle operating with sub-microsecond latency and zero collision risk.",
    "The GenomicSequenceHashOracle addresses this challenge by combining a specialized 4-character alphabet mapping, Double Polynomial Rolling Hashing, and high-speed hash indexing. In genomic data, the alphabet Sigma consists exclusively of {'A', 'C', 'G', 'T'}. Instead of using standard ASCII byte values (which range from 65 to 84 and introduce large gaps), the oracle maps nucleotide characters to dense consecutive integers: A -> 1, C -> 2, G -> 3, T -> 4. By pairing this compact 4-element domain with two small coprime prime bases (base_1 = 5, base_2 = 7) and dual prime moduli (mod_1 = 1,000,000,007, mod_2 = 1,000,000,009), the hash function maximizes entropy and distributes k-mer fingerprints uniformly across the 10^18 hash universe.",
    "The core operational workflow of GenomicSequenceHashOracle proceeds through three high-performance stages: Ingestion and Prefix Indexing, Sliding Window K-Mer Extraction, and Duplication Grouping. In Stage 1, the oracle ingests the raw FASTA nucleotide sequence and precomputes dual prefix hash arrays (pref1, pref2) and dual power arrays (pow1, pow2) in linear O(N) time. In Stage 2, the oracle slides a window of fixed length k across the sequence, extracting the dual-hash fingerprint of each k-mer in O(1) time using our modular subtraction formula.",
    "In Stage 3, each extracted dual hash is encoded as a compact string key 'h1:h2' and inserted into a high-throughput hash map that groups identical genomic occurrences by starting offset. Because double hashing provides an effective modulus of 10^18, every distinct k-mer maps to a unique key without collisions. Substrings that appear multiple times across the genome are immediately isolated as repetitive promoters or duplicated gene families, sorted in descending order of repetition frequency.",
    "In addition to k-mer extraction, the oracle supports direct O(1) substring equality verification across arbitrary offsets. When comparing distant genomic regions—such as testing whether an exon at offset 0 matches an exon at offset 32—the system evaluates queryDoubleHash(0, 9) === queryDoubleHash(32, 41) in a few nanoseconds, bypassing memory allocations and avoiding cache misses. This capability allows bioinformaticians to screen whole chromosomes for duplicated retrotransposons and structural variations with deterministic linear O(N) throughput.",
    "At the systems engineering level, GenomicSequenceHashOracle operates with exceptional cache efficiency. The dual prefix and power arrays occupy contiguous 64-bit integer buffers in memory, facilitating sequential memory prefetching by modern CPU hardware prefetchers. During the sliding window k-mer extraction pass, memory access patterns are perfectly linear, achieving instruction-level parallelism (ILP) and sustaining processing rates exceeding ten million base pairs per second per CPU core. Through this capstone design, string hashing proves to be an indispensable algorithmic pillar powering modern genomics, cloud infrastructure, and enterprise data analytics.",
    "Furthermore, this genomic oracle architecture extends directly to metagenomic de novo assembly and short-read mapping. When short sequencing reads (typically 150 to 300 base pairs) from Illumina or PacBio sequencers must be aligned against a 3-billion-base-pair reference genome, the oracle builds an indexed database of minimizers—the smallest rolling hash within a sliding window of w consecutive k-mers. Minimizers reduce index size by over 90% while preserving exact substring hit locations, enabling whole-genome alignment algorithms like Minimap2 to map millions of reads per minute on standard server hardware."
]

p5_example = (
    "Consider a high-throughput biomedical sequencing facility analyzing whole-genome sequencing (WGS) data from patient tumor biopsies. The oncology pipeline must detect repetitive telomeric repeats and gene duplications that indicate oncogenic chromosomal instability. Using GenomicSequenceHashOracle, the facility indexes a 50-megabase chromosome arm in under 3 seconds. The engine slides a 21-mer window across the sequence, grouping millions of fragments into frequency buckets. It instantly identifies that an oncogene promoter sequence is duplicated 48 times across aberrant chromosomal translocations, flagging the mutation for targeted chemotherapy. The entire pipeline executes with zero hash collisions and deterministic performance, demonstrating the carrier-grade reliability of double polynomial rolling hashing."
)

p5_tryIt = (
    "Run the complete GenomicSequenceHashOracle suite below. Observe how the constructor maps the DNA alphabet ('A','C','G','T') to consecutive integers [1..4] and computes dual prefix hash arrays using bases 5 and 7. Trace the findDuplicateKMers() method as it slides a 10-mer window across the sequence, extracts dual hashes in O(1) time, and groups repeated genomic promoters cleanly. Notice how the direct double-hash query at offsets 0 and 32 confirms an exact 10-base-pair duplication in O(1) time."
)

p5_check = {
    "question": "Why does GenomicSequenceHashOracle map nucleotide characters ('A','C','G','T') to consecutive integers [1..4] rather than using their raw ASCII values (65, 67, 71, 84)?",
    "options": [
        "Mapping to a dense alphabet [1..4] permits selecting smaller prime bases (such as base 5 and 7) that tightly bound polynomial coefficients, maximizing entropy and reducing modulo overflow risk during intermediate products",
        "Because raw ASCII values contain hidden negative numbers that cause JavaScript BigInt operations to throw exceptions",
        "Because DNA sequencing machines cannot read characters that are larger than 32 bits in memory",
        "Because mapping to integers eliminates the need to use prime numbers for the modular arithmetic divisors"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "In polynomial hashing, the base p should be strictly greater than the maximum character value. If raw ASCII values are used, the maximum value is 84 ('T'), requiring base p >= 89. With a larger base, polynomial powers grow much faster and intermediate products can overflow 64-bit registers before reduction. Mapping the 4 DNA nucleotides to dense integers [1..4] allows using small prime bases like 5 and 7, keeping coefficients compact, maximizing hash entropy across the finite field, and preventing numerical overflow."
}

p5_code = """/**
 * Day 36 - Part 5: Enterprise Genomic Sequence Alignment & Deduplication Engine
 */

interface KMerLocation {
  kMer: string;
  positions: number[];
  count: number;
}

class GenomicSequenceHashOracle {
  private sequence: string;
  private n: number;
  private base1: bigint = 5n;
  private mod1: bigint = 1_000_000_007n;
  private base2: bigint = 7n;
  private mod2: bigint = 1_000_000_009n;

  private pref1: bigint[];
  private pref2: bigint[];
  private pow1: bigint[];
  private pow2: bigint[];

  constructor(sequence: string) {
    this.sequence = sequence.toUpperCase();
    this.n = this.sequence.length;
    this.pref1 = new Array(this.n + 1).fill(0n);
    this.pref2 = new Array(this.n + 1).fill(0n);
    this.pow1 = new Array(this.n + 1).fill(1n);
    this.pow2 = new Array(this.n + 1).fill(1n);

    const charMap: Record<string, bigint> = { 'A': 1n, 'C': 2n, 'G': 3n, 'T': 4n };

    for (let i = 0; i < this.n; i++) {
      const val = charMap[this.sequence[i]] ?? 1n;
      this.pref1[i + 1] = (this.pref1[i] * this.base1 + val) % this.mod1;
      this.pref2[i + 1] = (this.pref2[i] * this.base2 + val) % this.mod2;
      this.pow1[i + 1] = (this.pow1[i] * this.base1) % this.mod1;
      this.pow2[i + 1] = (this.pow2[i] * this.base2) % this.mod2;
    }
  }

  queryDoubleHash(l: number, r: number): string {
    const len = BigInt(r - l + 1);
    const r1 = (this.pref1[r + 1] - (this.pref1[l] * this.pow1[Number(len)]) % this.mod1) % this.mod1;
    const r2 = (this.pref2[r + 1] - (this.pref2[l] * this.pow2[Number(len)]) % this.mod2) % this.mod2;
    const h1 = (r1 + this.mod1) % this.mod1;
    const h2 = (r2 + this.mod2) % this.mod2;
    return `${h1}:${h2}`;
  }

  findDuplicateKMers(k: number): KMerLocation[] {
    const hashMap: Map<string, number[]> = new Map();

    for (let i = 0; i <= this.n - k; i++) {
      const hKey = this.queryDoubleHash(i, i + k - 1);
      if (!hashMap.has(hKey)) {
        hashMap.set(hKey, []);
      }
      hashMap.get(hKey)!.push(i);
    }

    const duplicates: KMerLocation[] = [];
    for (const [_, positions] of hashMap.entries()) {
      if (positions.length > 1) {
        duplicates.push({
          kMer: this.sequence.substring(positions[0], positions[0] + k),
          positions,
          count: positions.length
        });
      }
    }

    return duplicates.sort((a, b) => b.count - a.count);
  }
}

function main(): void {
  // Synthetic FASTA genomic fragment with repetitive regulatory promoters
  const dnaCorpus = "ATGCGATCGTAGCTAGCTAGCGATCGTAGCTAATGCGATCGTATCGTAGCTA";
  const oracle = new GenomicSequenceHashOracle(dnaCorpus);

  console.log("=== Genomic Sequence Hash Oracle: Enterprise Deduplication Suite ===");
  console.log(`[GenomicOracle] Sequence Length: ${dnaCorpus.length} bp`);

  const k = 10;
  const duplicates = oracle.findDuplicateKMers(k);
  console.log(`[GenomicOracle] Repetitive ${k}-mer Promoters Detected: ${duplicates.length}`);

  for (const dup of duplicates.slice(0, 3)) {
    console.log(`  -> Pattern "${dup.kMer}" repeated ${dup.count}x at offsets: [${dup.positions.join(", ")}]`);
  }

  // Fast equality verification
  const hFirst = oracle.queryDoubleHash(0, 9);
  const hSecond = oracle.queryDoubleHash(32, 41);
  console.log(`[GenomicOracle] Direct O(1) Double-Hash Match (offset 0 vs 32): ${hFirst === hSecond}`);
}

main();"""

p5_output = """=== Genomic Sequence Hash Oracle: Enterprise Deduplication Suite ===
[GenomicOracle] Sequence Length: 52 bp
[GenomicOracle] Repetitive 10-mer Promoters Detected: 6
  -> Pattern "ATCGTAGCTA" repeated 3x at offsets: [5, 22, 42]
  -> Pattern "ATGCGATCGT" repeated 2x at offsets: [0, 32]
  -> Pattern "TGCGATCGTA" repeated 2x at offsets: [1, 33]
[GenomicOracle] Direct O(1) Double-Hash Match (offset 0 vs 32): true"""

p5_codeNotes = [
    {"line": 20, "note": "Maps DNA nucleotides to dense 1-4 integers and initializes dual rolling hash arrays"},
    {"line": 34, "note": "Computes parallel prefix hashes using bases 5 and 7 modulo 10^9+7 and 10^9+9 in linear O(N) time"},
    {"line": 43, "note": "Extracts composite dual-hash key 'h1:h2' for arbitrary genomic slice [l, r] in O(1) time"},
    {"line": 52, "note": "Slides window of length k across sequence, indexing k-mer positions in a hash map to isolate duplicates"},
    {"line": 84, "note": "Demonstrates rapid duplicate identification and verifies identical 10-mer match at offsets 0 and 32"}
]

day36_data = {
    "day": 36,
    "coursePrefix": "dsa-optim",
    "title": "String Hashing: Polynomial Rolling Hashes, Rabin-Karp & O(1) Substring Equality",
    "minutes": 38,
    "parts": [
        {
            "title": "Foundations of String Hashing, Polynomial Rolling Hashes & Prime Base Selection",
            "say": p1_say,
            "example": p1_example,
            "tryIt": p1_tryIt,
            "check": p1_check,
            "code": p1_code,
            "output": p1_output,
            "codeNotes": p1_codeNotes
        },
        {
            "title": "Collision Probabilities, The Birthday Paradox & 64-Bit Double Rolling Hashing",
            "say": p2_say,
            "example": p2_example,
            "tryIt": p2_tryIt,
            "check": p2_check,
            "code": p2_code,
            "output": p2_output,
            "codeNotes": p2_codeNotes
        },
        {
            "title": "The Rabin-Karp Substring Search Algorithm & Sliding Window Hashes",
            "say": p3_say,
            "example": p3_example,
            "tryIt": p3_tryIt,
            "check": p3_check,
            "code": p3_code,
            "output": p3_output,
            "codeNotes": p3_codeNotes
        },
        {
            "title": "High-Performance Substring Equality, O(log N) LCP & O(1) Palindrome Verification",
            "say": p4_say,
            "example": p4_example,
            "tryIt": p4_tryIt,
            "check": p4_check,
            "code": p4_code,
            "output": p4_output,
            "codeNotes": p4_codeNotes
        },
        {
            "title": "Enterprise Application: Genomic Sequence Alignment & Deduplication Engine",
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
        "title": "Industrial Case Study: High-Throughput Genomic Sequence Deduplication & Palindrome Oracle",
        "steps": [
            "Construct dual prefix hash and power arrays for genomic sequences using coprime prime bases and moduli.",
            "Deploy Rabin-Karp sliding window scanner with constant-time modular transitions to locate repetitive DNA motifs.",
            "Implement O(log N) Longest Common Prefix (LCP) binary search and O(1) dual-directional palindrome verification.",
            "Synthesize GenomicSequenceHashOracle to detect duplicated k-mers across multi-megabase genomic FASTA streams."
        ]
    },
    "summary": [
        "Polynomial rolling hashing maps arbitrary substrings to compact numerical fingerprints with O(1) equality verification.",
        "Precomputing prefix hashes and power arrays enables O(1) extraction of arbitrary substring hashes via modular arithmetic alignment.",
        "The Birthday Paradox dictates that single moduli (~10^9) suffer 50% collision risk after ~40k strings; Double Hashing expands the space to 10^18 for complete collision immunity.",
        "The Rabin-Karp algorithm uses rolling hashes to find pattern occurrences in linear O(N + M) expected time with constant-time window transitions.",
        "Combining string hashing with binary search yields an O(log N) Longest Common Prefix (LCP) oracle and an O(1) bidirectional palindrome verification engine."
    ]
}

# Verify word counts
total_words = 0
for idx, part in enumerate(day36_data["parts"]):
    words = sum(len(p.split()) for p in part["say"])
    total_words += words
    print(f"Part {idx + 1} say words: {words}")
    assert words >= 600, f"Part {idx + 1} words {words} < 600!"

print(f"Total Day 36 say words: {total_words}")
assert total_words >= 3100, f"Total words {total_words} < 3100!"

os.makedirs("scripts/branch_c", exist_ok=True)
with open("scripts/branch_c/day36_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day36_data, f, indent=2)

print("Saved scripts/branch_c/day36_lesson.json successfully!")
