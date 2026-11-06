# scripts/branch_c/build_day53_full.py
import json

part1_code = '''function buildSuffixArrayPrefixDoubling(s: string): number[] {
  const n = s.length;
  let sa = Array.from({ length: n }, (_, i) => i);
  let rank = Array.from({ length: n }, (_, i) => s.charCodeAt(i));
  let tmp = new Array(n).fill(0);

  for (let k = 1; k < n; k <<= 1) {
    sa.sort((a, b) => {
      if (rank[a] !== rank[b]) return rank[a] - rank[b];
      const rankA_k = a + k < n ? rank[a + k] : -1;
      const rankB_k = b + k < n ? rank[b + k] : -1;
      return rankA_k - rankB_k;
    });

    tmp[sa[0]] = 0;
    for (let i = 1; i < n; i++) {
      const prev = sa[i - 1];
      const curr = sa[i];
      const prevNext = prev + k < n ? rank[prev + k] : -1;
      const currNext = curr + k < n ? rank[curr + k] : -1;
      tmp[curr] = (rank[curr] === rank[prev] && currNext === prevNext)
        ? tmp[prev]
        : tmp[prev] + 1;
    }
    for (let i = 0; i < n; i++) rank[i] = tmp[i];
    if (rank[sa[n - 1]] === n - 1) break;
  }
  return sa;
}

const sampleStr = 'banana$';
const sa = buildSuffixArrayPrefixDoubling(sampleStr);
console.log('--- Part 1: Suffix Array ---');
console.log('Suffix Array for "banana$":', sa);
console.log('Sorted suffixes:', sa.map(i => sampleStr.slice(i)).join(', '));'''

part1_output = '''--- Part 1: Suffix Array ---
Suffix Array for "banana$": [
  6, 5, 3, 1,
  0, 4, 2
]
Sorted suffixes: $, a$, ana$, anana$, banana$, na$, nana$'''

part2_code = '''function getEquivalenceClasses(s: string, sa: number[]): { sa: number[]; rank: number[] } {
  const n = s.length;
  const rank = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    rank[sa[i]] = i;
  }
  return { sa, rank };
}

const eq = getEquivalenceClasses(sampleStr, sa);
console.log('--- Part 2: Inverted Rank Array ---');
console.log('Rank array:', eq.rank);'''

part2_output = '''--- Part 2: Inverted Rank Array ---
Rank array: [
  4, 3, 6, 2,
  5, 1, 0
]'''

part3_code = '''function buildLCPArrayKasai(s: string, sa: number[]): number[] {
  const n = s.length;
  const rank = new Array(n).fill(0);
  for (let i = 0; i < n; i++) rank[sa[i]] = i;

  const lcp = new Array(n).fill(0);
  let h = 0;

  for (let i = 0; i < n; i++) {
    if (rank[i] > 0) {
      const j = sa[rank[i] - 1];
      while (i + h < n && j + h < n && s[i + h] === s[j + h]) {
        h++;
      }
      lcp[rank[i]] = h;
      if (h > 0) h--;
    } else {
      h = 0;
    }
  }
  return lcp;
}

const lcp = buildLCPArrayKasai(sampleStr, sa);
console.log('--- Part 3: Kasai LCP Array ---');
console.log('LCP array:', lcp);'''

part3_output = '''--- Part 3: Kasai LCP Array ---
LCP array: [
  0, 0, 1, 3,
  0, 0, 2
]'''

part4_code = '''class LcpRangeMinimumQuery {
  private st: number[][];
  private logTable: number[];
  private n: number;

  constructor(lcp: number[]) {
    this.n = lcp.length;
    this.logTable = new Array(this.n + 1).fill(0);
    for (let i = 2; i <= this.n; i++) {
      this.logTable[i] = this.logTable[i >> 1] + 1;
    }

    const k = this.logTable[this.n] + 1;
    this.st = Array.from({ length: k }, () => new Array(this.n).fill(0));
    for (let i = 0; i < this.n; i++) this.st[0][i] = lcp[i];

    for (let j = 1; j < k; j++) {
      for (let i = 0; i + (1 << j) <= this.n; i++) {
        this.st[j][i] = Math.min(
          this.st[j - 1][i],
          this.st[j - 1][i + (1 << (j - 1))]
        );
      }
    }
  }

  query(l: number, r: number): number {
    if (l > r) [l, r] = [r, l];
    const j = this.logTable[r - l + 1];
    return Math.min(this.st[j][l], this.st[j][r - (1 << j) + 1]);
  }
}

const rmq = new LcpRangeMinimumQuery(lcp);
console.log('--- Part 4: RMQ on LCP ---');
console.log('RMQ LCP between sa[2] and sa[4]:', rmq.query(3, 4));'''

part4_output = '''--- Part 4: RMQ on LCP ---
RMQ LCP between sa[2] and sa[4]: 0'''

part5_code = '''interface DuplicateSpan {
  substring: string;
  length: number;
  occurrences: number[];
}

class SuffixLogDeduplicator {
  private text: string;
  private sa: number[];
  private lcp: number[];
  private rank: number[];

  constructor(logs: string) {
    this.text = logs + '$';
    this.sa = buildSuffixArrayPrefixDoubling(this.text);
    this.lcp = buildLCPArrayKasai(this.text, this.sa);
    this.rank = new Array(this.text.length).fill(0);
    for (let i = 0; i < this.text.length; i++) this.rank[this.sa[i]] = i;
  }

  findMaximalRepeatedSubstrings(minLength: number = 8): DuplicateSpan[] {
    const rawMatches: DuplicateSpan[] = [];
    const n = this.text.length;

    for (let i = 1; i < n; i++) {
      if (this.lcp[i] >= minLength) {
        const len = this.lcp[i];
        const matchStr = this.text.slice(this.sa[i], this.sa[i] + len);
        rawMatches.push({
          substring: matchStr,
          length: len,
          occurrences: [this.sa[i - 1], this.sa[i]]
        });
      }
    }

    rawMatches.sort((a, b) => b.length - a.length);
    const maximal: DuplicateSpan[] = [];
    for (const item of rawMatches) {
      const alreadySubsumed = maximal.some(m => m.substring.includes(item.substring));
      if (!alreadySubsumed) {
        maximal.push(item);
      }
    }
    return maximal;
  }
}

const logStream = 'ERROR:DATABASE_TIMEOUT at node-01; INFO:JOB_COMPLETED; ERROR:DATABASE_TIMEOUT at node-02;';
const dedup = new SuffixLogDeduplicator(logStream);
const dupes = dedup.findMaximalRepeatedSubstrings(12);
console.log('--- Part 5: Log Deduplicator ---');
console.log('Maximal repeated log patterns detected:', dupes.length);
dupes.forEach(d => console.log(`Dupe: "${d.substring}" (len ${d.length}) at offsets ${d.occurrences.join(', ')}`));'''

part5_output = '''--- Part 5: Log Deduplicator ---
Maximal repeated log patterns detected: 1
Dupe: "ERROR:DATABASE_TIMEOUT at node-0" (len 32) at offsets 0, 55'''

day53_lesson = {
  "day": 53,
  "coursePrefix": "dsa-optim",
  "title": "Suffix Structures I: Suffix Array, LCP Array & Kasai's Algorithm",
  "minutes": 38,
  "parts": [
    {
      "title": "Suffix Array Foundations & O(N log^2 N) Prefix Doubling",
      "say": [
        "Welcome to Day 53 of Advanced Data Structures and Algorithmic Optimization. Having explored pattern matching automata on Days 51 and 52, today we enter the majestic landscape of Full-Text Suffix Indexing. In enterprise full-text search, bioinformatics, and big-data analytics, the text corpus is massive, static, and queried millions of times with arbitrary substring queries. Preprocessing the text into a full-text index allows arbitrary substring search in time proportional solely to the query pattern length, completely decoupled from corpus size.",
        "The historical gold standard for full-text indexing was the Suffix Tree, introduced by Weiner and refined by Ukkonen. However, a Suffix Tree is notoriously memory-intensive: each node contains multiple child pointers, character edge bounds, and suffix links, consuming between 20 and 45 bytes per input character. For a 3-gigabyte human genome or a 50-gigabyte enterprise log repository, materializing a Suffix Tree requires over 100 gigabytes of RAM, inducing severe memory exhaustion and cache thrashing on standard servers.",
        "To conquer this spatial bottleneck, Udi Manber and Gene Myers introduced the Suffix Array in 1990. A Suffix Array SA of a string S of length N is simply an array of integers representing the starting indices of all N suffixes of S, sorted in lexicographical order. Because each suffix is uniquely identified by its single integer starting offset, the Suffix Array consumes exactly 4 bytes per character (using 32-bit integers)—an 80% reduction in memory compared to Suffix Trees, while preserving all fundamental indexing capabilities."
      ],
      "example": "For string 'banana$', the 7 suffixes sorted alphabetically are '$' (idx 6), 'a$' (idx 5), 'ana$' (idx 3), 'anana$' (idx 1), 'banana$' (idx 0), 'na$' (idx 4), and 'nana$' (idx 2). The resulting Suffix Array is [6, 5, 3, 1, 0, 4, 2]. Using binary search on this array, any query substring such as 'nan' is located in O(M * log N) time.",
      "code": part1_code,
      "output": part1_output,
      "tryIt": "Examine the TypeScript code below. Follow how buildSuffixArrayPrefixDoubling sorts suffixes by doubling k (1, 2, 4...) and assigning temporary ranks. Notice how 'banana$' yields sorted suffix array [6, 5, 3, 1, 0, 4, 2]. Run the code to verify suffix array generation.",
      "check": {
        "question": "What is the primary memory advantage of a Suffix Array over a traditional Suffix Tree?",
        "options": [
          "A Suffix Array represents sorted suffixes as a flat contiguous array of integer indices (consuming 4 bytes per character), eliminating tree pointer and edge node overhead.",
          "A Suffix Array converts characters into 8-bit audio files for streaming compression.",
          "A Suffix Array requires zero memory because it computes suffixes lazily on every keystroke.",
          "A Suffix Tree cannot store English words containing more than five characters."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "A Suffix Array replaces complex pointer graphs with a single flat integer array of starting positions, reducing memory consumption from 20-45 bytes/char down to just 4 bytes/char."
      }
    },
    {
      "title": "Radix Sort Acceleration & Inverted Rank Equivalence Classes",
      "say": [
        "In Part 2, we dissect the Prefix Doubling algorithmic paradigm that makes Suffix Array construction practical. A naive sorting of all N suffixes using quicksort or mergesort takes O(N^2 * log N) time, because comparing two suffixes can require up to N character comparisons. In 1990, Manber and Myers introduced the prefix doubling technique, sorting prefixes of length 2^k using the precomputed ranks of prefixes of length 2^(k-1).",
        "At step k, the relative order of suffix i and suffix j is determined by comparing the 2-tuple: (rank[i], rank[i + 2^(k-1)]). If the primary ranks differ, their order is already resolved; if they tie, the secondary rank breaks the tie. By pairing comparison-based sorting (such as std::sort) with log N doubling stages, we achieve O(N * log^2 N) construction runtime with minimal implementation complexity.",
        "Furthermore, by replacing comparison-based sorting with 2-pass Radix Sort (or Counting Sort) on the pair of integer ranks at each doubling stage, Manber and Myers accelerated the construction runtime to strict O(N * log N). Later algorithms such as SA-IS (Suffix Array by Induced Sorting) and DC3 (Difference Cover 3 / Kärkkäinen-Sanders) pushed this bound to linear O(N) time. In practice, prefix doubling remains exceptionally fast and cache-friendly for text files up to hundreds of megabytes."
      ],
      "example": "In a source code search engine indexing large git repositories, a code repository of 10 million lines is indexed into a Suffix Array. Using prefix doubling with 32-bit rank equivalence classes, the repository is fully indexed in seconds, enabling developers to search for any function call or identifier across millions of files in microseconds.",
      "code": part2_code,
      "output": part2_output,
      "tryIt": "Examine the TypeScript code below. Follow how getEquivalenceClasses inverts the suffix array into the rank array where rank[sa[i]] = i. Notice how rank reflects the lexicographical position of each starting suffix. Run the code to inspect rank array values.",
      "check": {
        "question": "How does prefix doubling reduce the time complexity of suffix sorting from O(N^2 log N) to O(N log^2 N)?",
        "options": [
          "It compares length-2^k prefixes by looking up precomputed ranks of length-2^(k-1) halves in O(1) time, eliminating character-by-character string comparisons.",
          "It discards all suffixes containing vowels to halve the problem size.",
          "It executes the entire sorting algorithm on quantum processors.",
          "It replaces sorting with random shuffling until suffixes appear in order."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Prefix doubling represents the comparison of two length-2^k prefixes as a comparison of two integer pairs of previously computed ranks, making each suffix comparison an O(1) operation."
      }
    },
    {
      "title": "Longest Common Prefix (LCP) & Kasai's Linear-Time O(N) Algorithm",
      "say": [
        "In Part 3, we introduce the indispensable companion to the Suffix Array: the Longest Common Prefix (LCP) Array. While the Suffix Array tells us the lexicographical order of all suffixes, it does not reveal how much adjacent suffixes in the sorted order overlap. The LCP array is defined such that LCP[i] is the length of the longest common prefix between suffix SA[i] and suffix SA[i - 1] (with LCP[0] defined as 0).",
        "Together, the Suffix Array and LCP array (augmented with auxiliary child tables) form the Enhanced Suffix Array (ESA), which can simulate every single traversal, pattern search, and structural query of a full Suffix Tree in equivalent asymptotic time while consuming a fraction of the memory.",
        "In 2001, Toru Kasai, Gunho Lee, Hiroki Arimura, Setsuo Arikawa, and Kunsoo Park published a breathtakingly elegant linear-time algorithm to construct the LCP array in strict O(N) time. Kasai observed a profound mathematical invariant: when moving from suffix i (at position S[i..N-1]) to suffix i + 1 (at position S[i+1..N-1]), the length of the common prefix with its lexicographically preceding neighbor can decrease by at most 1: LCP[rank[i + 1]] >= LCP[rank[i]] - 1!"
      ],
      "example": "For 'banana$' with SA = [6, 5, 3, 1, 0, 4, 2], the adjacent suffixes are ('$', 'a$') with overlap 0, ('a$', 'ana$') with overlap 1 ('a'), ('ana$', 'anana$') with overlap 3 ('ana'), ('anana$', 'banana$') with overlap 0, ('banana$', 'na$') with overlap 0, and ('na$', 'nana$') with overlap 2 ('na'). The LCP array is [0, 0, 1, 3, 0, 0, 2].",
      "code": part3_code,
      "output": part3_output,
      "tryIt": "Examine the TypeScript code below. Trace how buildLCPArrayKasai iterates through suffixes in original text order i from 0 to N - 1, using rank to find the lexicographical neighbor j = sa[rank[i] - 1]. Follow how h decrements by at most 1 before expanding. Run the code to verify LCP values.",
      "check": {
        "question": "What is the core mathematical invariant that guarantees Kasai's algorithm runs in linear O(N) time?",
        "options": [
          "The common prefix length h can decrease by at most 1 when advancing from suffix i to suffix i + 1, bounding total decrements to N and character comparisons to 2N.",
          "It uses binary search on a precomputed Fibonacci tree to skip character checks.",
          "It computes LCP values in random order using Monte Carlo hashing.",
          "It requires that all characters in the string be distinct."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Because S[i+1..] is S[i..] with the first character stripped, any common prefix shared by S[i..] and its predecessor drops by at most 1 character, ensuring the pointer h advances at most 2N times total."
      }
    },
    {
      "title": "Range Minimum Query (RMQ) on LCP Arrays for Arbitrary Suffix LCP",
      "say": [
        "In Part 4, we unlock one of the most powerful capabilities of suffix structures: querying the Longest Common Prefix between ANY two arbitrary suffixes in O(1) time. The LCP array stores the overlap between consecutive suffixes in sorted order: LCP[i] = lcp(SA[i], SA[i - 1]). How do we determine the overlap between two arbitrary suffixes SA[l] and SA[r] that are far apart in the sorted suffix array?",
        "By fundamental properties of lexicographical ordering, the longest common prefix between SA[l] and SA[r] (where l < r) is equal to the minimum value in the LCP array subarray between indices l + 1 and r: LCP(SA[l], SA[r]) = min(LCP[l + 1 .. r]). This converts arbitrary suffix comparison into a classic Range Minimum Query (RMQ) problem over static arrays.",
        "Using a Sparse Table constructed in O(N log N) preprocessing time and space, we can answer RMQ queries over the LCP array in strict O(1) time. Combining the Suffix Array with Sparse Table RMQ allows us to count distinct substrings in O(N) time, find the longest repeated substring in O(N) time, and locate the longest common substring between two documents in linear time."
      ],
      "example": "Given string 'banana$', suppose we want the common prefix between suffix 1 ('anana$') and suffix 5 ('a$'). In the sorted suffix array, 'a$' is at index 1 and 'anana$' is at index 3. The LCP array values between indices 2 and 3 are LCP[2] = 1 ('a') and LCP[3] = 3 ('ana'). The minimum value is min(1, 3) = 1, confirming their shared prefix is 'a' of length 1 in O(1) time.",
      "code": part4_code,
      "output": part4_output,
      "tryIt": "Examine the TypeScript code below. Follow how LcpRangeMinimumQuery constructs a Sparse Table over the LCP array and answers range minimum queries in O(1) time. Notice how logTable accelerates power-of-two interval decomposition. Run the code to verify RMQ results.",
      "check": {
        "question": "How is the Longest Common Prefix between arbitrary suffixes SA[l] and SA[r] computed using the LCP array?",
        "options": [
          "By finding the minimum value in the LCP array in the range [l + 1 .. r], solvable in O(1) time using a Sparse Table RMQ.",
          "By summing all values in the LCP array between l and r.",
          "By multiplying the lengths of both suffixes together.",
          "By re-running the Knuth-Morris-Pratt algorithm from scratch."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Lexicographical ordering dictates that the common prefix of any two suffixes is bounded by the least shared prefix among all intermediate sorted suffixes: min(LCP[l+1..r])."
      }
    },
    {
      "title": "Enterprise Application: Large-Scale Distributed Log Deduplication Engine (SuffixLogDeduplicator)",
      "say": [
        "In Part 5, we culminate Day 53 by engineering an enterprise infrastructure engine: the SuffixLogDeduplicator. In cloud-scale hyperscaler environments, distributed services produce petabytes of log telemetry daily. During major system outages or network partitions, microservices emit millions of identical or near-identical cascading error stack traces, inundating log aggregation pipelines like Elasticsearch, Datadog, and Loki with redundant text.",
        "Traditional log compaction approaches rely on fixed window matching or hashing of entire log lines. However, modern distributed logs contain dynamic timestamps, process IDs, and transient thread identifiers interleaved with static template messages, rendering line-level hashing completely ineffective. Our SuffixLogDeduplicator leverages Suffix Arrays and Kasai's LCP algorithm to perform deep, substring-level log deduplication.",
        "The engine ingests streaming log batches, constructs a unified Suffix Array and LCP array, and extracts maximal repeated substrings exceeding a configurable minimum length threshold. By clustering identical repeating log templates and isolating dynamic variable parameters, the deduplicator compresses multi-megabyte log bursts into compact template summaries, saving up to 85% in network ingestion bandwidth and storage costs while accelerating root cause analysis for incident response teams."
      ],
      "example": "A cloud cluster encounters a cascading database partition. Five microservices emit 50,000 log lines containing 'ERROR:DATABASE_TIMEOUT at node-01...'. The SuffixLogDeduplicator analyzes the concatenated log stream, discovers that 'ERROR:DATABASE_TIMEOUT at node-0' is repeated across 50,000 positions via LCP peak clustering, and condenses the massive flood into a single deduplicated incident alert.",
      "code": part5_code,
      "output": part5_output,
      "tryIt": "Explore the SuffixLogDeduplicator class below. Trace how findMaximalRepeatedSubstrings evaluates LCP peaks to identify repeating error signatures in log streams. Notice how subsumed shorter substrings are filtered to isolate maximal repeated templates. Run the simulation to verify automated log deduplication.",
      "check": {
        "question": "Why is Suffix Array and LCP analysis superior to line hashing for distributed log deduplication?",
        "options": [
          "It identifies shared repeating substring templates even when lines differ in dynamic timestamps, thread IDs, or variable parameters.",
          "It deletes all log files permanently so developers don't have to read them.",
          "It converts text logs into encrypted blockchain ledgers.",
          "It only works on English text and cannot process computer error logs."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Suffix Array and LCP analysis detects recurring common substrings of any length regardless of where they appear, uncovering shared log templates even when surrounded by unique timestamps and variables."
      }
    }
  ],
  "projectStep": {
    "title": "Deploying the SuffixLogDeduplicator in Enterprise Observability Pipelines",
    "steps": [
      "Instantiate SuffixLogDeduplicator and ingest multi-megabyte distributed log buffers containing repeating error bursts.",
      "Compute the Suffix Array using prefix doubling and construct the LCP array in linear O(N) time using Kasai's algorithm.",
      "Extract maximal repeated log templates, deduplicating redundant telemetry and reporting compressed incident summaries."
    ]
  },
  "summary": [
    "Suffix Arrays represent all sorted suffixes as a flat 4-byte-per-char integer index array, eliminating 80% of Suffix Tree memory overhead.",
    "Prefix Doubling constructs Suffix Arrays in O(N log^2 N) time by sorting length-2^k prefixes using precomputed length-2^(k-1) rank pairs.",
    "Kasai's algorithm computes the Longest Common Prefix (LCP) array in linear O(N) time utilizing the h >= h - 1 decremental invariant.",
    "Sparse Table Range Minimum Query (RMQ) enables O(1) LCP evaluation between any two arbitrary suffixes across the entire corpus.",
    "The SuffixLogDeduplicator demonstrates enterprise application, isolating maximal repeated log patterns to compress distributed telemetry bursts."
  ]
}

with open("scripts/branch_c/day53_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day53_lesson, f, indent=2, ensure_ascii=False)

print("day53_lesson.json successfully created.")
