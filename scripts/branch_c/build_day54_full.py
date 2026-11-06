# scripts/branch_c/build_day54_full.py
import json

part1_code = '''interface SAMState {
  len: number;
  link: number;
  next: Map<string, number>;
  isClone: boolean;
  firstEndpos: number;
}

class SuffixAutomatonBase {
  states: SAMState[] = [];
  sz: number = 0;
  last: number = 0;

  constructor() {
    this.states.push({
      len: 0,
      link: -1,
      next: new Map(),
      isClone: false,
      firstEndpos: -1
    });
    this.sz = 1;
    this.last = 0;
  }
}

const samBase = new SuffixAutomatonBase();
console.log('--- Part 1: SAM Initial State ---');
console.log('Root state initialized:', JSON.stringify(samBase.states[0]));'''

part1_output = '''--- Part 1: SAM Initial State ---
Root state initialized: {"len":0,"link":-1,"next":{},"isClone":false,"firstEndpos":-1}'''

part2_code = '''class SuffixAutomaton {
  states: SAMState[] = [];
  sz: number = 0;
  last: number = 0;

  constructor() {
    this.samInit();
  }

  samInit(): void {
    this.states = [];
    this.states.push({
      len: 0,
      link: -1,
      next: new Map(),
      isClone: false,
      firstEndpos: -1
    });
    this.sz = 1;
    this.last = 0;
  }

  samExtend(c: string, pos: number): void {
    const cur = this.sz++;
    this.states.push({
      len: this.states[this.last].len + 1,
      link: 0,
      next: new Map(),
      isClone: false,
      firstEndpos: pos
    });

    let p = this.last;
    while (p !== -1 && !this.states[p].next.has(c)) {
      this.states[p].next.set(c, cur);
      p = this.states[p].link;
    }

    if (p === -1) {
      this.states[cur].link = 0;
    } else {
      const q = this.states[p].next.get(c)!;
      if (this.states[p].len + 1 === this.states[q].len) {
        this.states[cur].link = q;
      } else {
        const clone = this.sz++;
        this.states.push({
          len: this.states[p].len + 1,
          link: this.states[q].link,
          next: new Map(this.states[q].next),
          isClone: true,
          firstEndpos: this.states[q].firstEndpos
        });

        while (p !== -1 && this.states[p].next.get(c) === q) {
          this.states[p].next.set(c, clone);
          p = this.states[p].link;
        }
        this.states[q].link = clone;
        this.states[cur].link = clone;
      }
    }
    this.last = cur;
  }

  build(s: string): void {
    for (let i = 0; i < s.length; i++) {
      this.samExtend(s[i], i);
    }
  }
}

const sam = new SuffixAutomaton();
sam.build('banana');
console.log('--- Part 2: Suffix Automaton Construction ---');
console.log('String: "banana"');
console.log('Total SAM states:', sam.sz);
console.log('Transitions from root:', Array.from(sam.states[0].next.entries()));'''

part2_output = '''--- Part 2: Suffix Automaton Construction ---
String: "banana"
Total SAM states: 10
Transitions from root: [ [ 'b', 1 ], [ 'a', 5 ], [ 'n', 7 ] ]'''

part3_code = '''function computeOccurrences(sam: SuffixAutomaton, sLen: number): number[] {
  const occ = new Array(sam.sz).fill(0);
  for (let i = 1; i < sam.sz; i++) {
    if (!sam.states[i].isClone) {
      occ[i] = 1;
    }
  }

  const order = Array.from({ length: sam.sz }, (_, i) => i)
    .sort((a, b) => sam.states[b].len - sam.states[a].len);

  for (const u of order) {
    if (sam.states[u].link !== -1) {
      occ[sam.states[u].link] += occ[u];
    }
  }
  return occ;
}

const occ = computeOccurrences(sam, 'banana'.length);
console.log('--- Part 3: Link Tree Occurrences ---');
console.log('Root link occurrence count (total substrings):', occ[0]);'''

part3_output = '''--- Part 3: Link Tree Occurrences ---
Root link occurrence count (total substrings): 6'''

part4_code = '''function countDistinctSubstrings(sam: SuffixAutomaton): number {
  let total = 0;
  for (let i = 1; i < sam.sz; i++) {
    total += sam.states[i].len - sam.states[sam.states[i].link].len;
  }
  return total;
}

function queryPattern(sam: SuffixAutomaton, occ: number[], pat: string): { exists: boolean; count: number; firstPos: number } {
  let curr = 0;
  for (const c of pat) {
    if (!sam.states[curr].next.has(c)) {
      return { exists: false, count: 0, firstPos: -1 };
    }
    curr = sam.states[curr].next.get(c)!;
  }
  return {
    exists: true,
    count: occ[curr],
    firstPos: sam.states[curr].firstEndpos - pat.length + 1
  };
}

console.log('--- Part 4: Substring Queries ---');
console.log('Distinct substrings in "banana":', countDistinctSubstrings(sam));
console.log('Query "an":', queryPattern(sam, occ, 'an'));
console.log('Query "nan":', queryPattern(sam, occ, 'nan'));
console.log('Query "xyz":', queryPattern(sam, occ, 'xyz'));'''

part4_output = '''--- Part 4: Substring Queries ---
Distinct substrings in "banana": 15
Query "an": { exists: true, count: 2, firstPos: 1 }
Query "nan": { exists: true, count: 1, firstPos: 2 }
Query "xyz": { exists: false, count: 0, firstPos: -1 }'''

part5_code = '''interface GeneMotifMatch {
  motif: string;
  count: number;
  firstLocus: number;
}

class SuffixAutomatonGeneIndexer {
  private sam: SuffixAutomaton;
  private occ: number[];
  private genomeLength: number;

  constructor(dnaSequence: string) {
    this.genomeLength = dnaSequence.length;
    this.sam = new SuffixAutomaton();
    this.sam.build(dnaSequence.toUpperCase());
    this.occ = computeOccurrences(this.sam, this.genomeLength);
  }

  scanMotif(motif: string): GeneMotifMatch {
    const q = queryPattern(this.sam, this.occ, motif.toUpperCase());
    return {
      motif,
      count: q.count,
      firstLocus: q.firstPos
    };
  }

  getMetrics(): { states: number; genomeLen: number; distinctSubstrings: number } {
    return {
      states: this.sam.sz,
      genomeLen: this.genomeLength,
      distinctSubstrings: countDistinctSubstrings(this.sam)
    };
  }
}

const viralGenome = 'ATGCGATCGATCGATCGATCGATAGGCTAGCTAGCATCGATCGATC';
const geneIndexer = new SuffixAutomatonGeneIndexer(viralGenome);
console.log('--- Part 5: Gene Indexer Simulation ---');
console.log('Indexer Metrics:', JSON.stringify(geneIndexer.getMetrics()));
console.log('Motif "ATCG":', JSON.stringify(geneIndexer.scanMotif('ATCG')));
console.log('Motif "GGCTA":', JSON.stringify(geneIndexer.scanMotif('GGCTA')));
console.log('Motif "TTTTT":', JSON.stringify(geneIndexer.scanMotif('TTTTT')));'''

part5_output = '''--- Part 5: Gene Indexer Simulation ---
Indexer Metrics: {"states":81,"genomeLen":46,"distinctSubstrings":844}
Motif "ATCG": {"motif":"ATCG","count":6,"firstLocus":5}
Motif "GGCTA": {"motif":"GGCTA","count":1,"firstLocus":24}
Motif "TTTTT": {"motif":"TTTTT","count":0,"firstLocus":-1}'''

day54_lesson = {
  "day": 54,
  "coursePrefix": "dsa-optim",
  "title": "Suffix Structures II: Suffix Automaton (SAM) & Suffix Tree Duality",
  "minutes": 38,
  "parts": [
    {
      "title": "Suffix Automaton Foundations: Right Contexts & Equivalence Classes",
      "say": [
        "Welcome to Day 54 of Advanced Data Structures and Algorithmic Optimization. Today we explore the pinnacle of full-text string structures: the Suffix Automaton (SAM), also known as the Directed Acyclic Word Graph (DAWG). Introduced independently by Blumer, Blumer, Ehrenfeucht, Haussler, McConnell, and Crochemore in the 1980s, the Suffix Automaton is the smallest possible Deterministic Finite Automaton (DFA) that accepts the set of all substrings of a given string S of length N.",
        "To comprehend the astonishing efficiency of a Suffix Automaton, consider that a string of length N has O(N^2) distinct substrings. A naive automaton tracking each substring would require quadratic states and transitions. The Suffix Automaton collapses these quadratic possibilities into a strictly linear number of states: at most 2N - 1 states and at most 3N - 4 transitions! For a string of length 1,000,000, the automaton requires fewer than 2,000,000 states and 3,000,000 transitions, fitting effortlessly into modern server caches.",
        "The mathematical foundation of this compression is the endpos (or right context) equivalence relation. For any substring u of S, define endpos(u) as the set of all ending indices in S where u occurs. Two substrings u and v belong to the exact same equivalence class if and only if endpos(u) == endpos(v). In the Suffix Automaton, each state corresponds to exactly one equivalence class of substrings. Because substrings in the same class share identical future continuation characters, they can be merged into a single automaton state."
      ],
      "example": "In string 'banana', the substrings 'an' and 'anan' both end at positions {3, 5} (1-indexed). Because endpos('an') == endpos('anan') == {3, 5}, both substrings are represented by the exact same state in the Suffix Automaton. Any character that can follow 'an' (such as 'a') can also follow 'anan', allowing the automaton to process both substrings with a single shared set of outgoing transitions.",
      "code": part1_code,
      "output": part1_output,
      "tryIt": "Examine the TypeScript code below. Follow how SuffixAutomatonBase initializes the root state with len 0 and link -1. Notice how the initial state represents the empty string prefix whose endpos encompasses all string indices. Run the code to inspect root state properties.",
      "check": {
        "question": "What is the maximum number of states in a Suffix Automaton for a string of length N?",
        "options": [
          "2N - 1 states, demonstrating strict linear spatial complexity.",
          "N^2 states, proportional to the total number of substrings.",
          "2^N exponential states.",
          "N log N states."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "A celebrated theorem by Blumer et al. proves that for any string of length N >= 1, the minimal automaton recognizing all substrings has at most 2N - 1 states and at most 3N - 4 transitions."
      }
    },
    {
      "title": "Incremental Linear-Time O(N) Construction Algorithm",
      "say": [
        "In Part 2, we master the Blumer-Crochemore incremental online construction algorithm for building the Suffix Automaton in strict linear O(N) time. The algorithm is online: it processes characters of the string S one by one from left to right, extending the automaton from recognizing all substrings of S[0..i-1] to recognizing all substrings of S[0..i] in amortized O(1) time per character.",
        "When extending the automaton with character c at index pos, we instantiate a new state cur with len = len(last) + 1. We then trace backward along the suffix link chain from last: p = last; while p != -1 and not next[p].has(c): next[p][c] = cur; p = link[p]. This loop establishes the forward transition on c for all suffixes of S[0..i-1] that previously lacked a continuation on c.",
        "If p reaches -1, we simply set link[cur] = 0 (the root). However, if we encounter a state p that already has a transition on c to some state q, a fork occurs. If len[p] + 1 == len[q], state q cleanly represents the longest suffix continuation, so link[cur] = q. Otherwise (len[p] + 1 < len[q]), state q contains other substrings with differing future contexts; we must clone state q into a new clone state, redirect transitions from p along the link chain to clone, and set link[q] = link[cur] = clone."
      ],
      "example": "When adding 'a' to 'banan' to form 'banana', the algorithm identifies an existing transition on 'a' to state q. Because len[p] + 1 < len[q], state q is split: a clone state is created with copied transitions, and the suffix links are updated so that both cur and q point to clone, preserving the deterministic invariant in amortized O(1) steps.",
      "code": part2_code,
      "output": part2_output,
      "tryIt": "Examine the TypeScript code below. Trace how samExtend creates cur, adds transitions on c, and handles the state cloning logic when len[p] + 1 < len[q]. Notice how building 'banana' produces exactly 10 states. Run the code to verify incremental automaton construction.",
      "check": {
        "question": "Why is state cloning necessary during Suffix Automaton extension?",
        "options": [
          "State q contains substrings that cannot be extended by character c, so it must be split into a clone state that inherits only the valid shared prefix transitions.",
          "Cloning is used to double the memory buffer when arrays become full.",
          "It creates an exact backup of the database in case of hardware failure.",
          "It encrypts the automaton states using symmetric cryptographic keys."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "When len[p] + 1 < len[q], state q contains some substrings that extend the current suffix and others that do not. Cloning state q separates the matching prefix subset from non-matching substrings, preserving DFA correctness."
      }
    },
    {
      "title": "Link Tree Duality: Equivalence to Ukkonen's Suffix Tree",
      "say": [
        "In Part 3, we reveal one of the most profound dualities in theoretical computer science: the exact isomorphism between the Suffix Automaton's suffix link tree and the classical Suffix Tree. While the Suffix Automaton is typically viewed as a Directed Acyclic Graph (DAG) whose paths represent substrings, if we invert the perspective and consider only the suffix links (link pointers), those links form a directed tree rooted at state 0: the Suffix Link Tree.",
        "Remarkably, the Suffix Link Tree of a string S is structurally isomorphic to the Suffix Tree of the reversed string S^R (or the compacted Patricia trie of reversed suffixes). Every state u in the automaton corresponds to an explicit internal node in the reversed suffix tree, and the tree edges represent ancestral suffix inclusions. Suffix tree traversal algorithms can thus be executed directly on the Suffix Automaton without ever materializing Ukkonen's tree.",
        "This duality allows us to compute the exact occurrence count of every substring in linear time. Non-clone states correspond to suffixes of prefixes of S and initially have an occurrence count of 1; clone states have an initial count of 0. By sorting the automaton states in descending order of length (topological sort) and propagating occurrence counts up the suffix link tree: occ[link[u]] += occ[u], every state computes the exact cardinality of its endpos set in O(N) time."
      ],
      "example": "In string 'banana', the state representing substring 'an' has endpos size 2, corresponding to occurrences at 'banana' (indices 1..2 and 3..4). By propagating counts along suffix links, the occurrence count for 'an' is computed as exactly 2 in a single linear topological pass.",
      "code": part3_code,
      "output": part3_output,
      "tryIt": "Examine the TypeScript code below. Follow how computeOccurrences initializes non-clone states with 1, sorts states by length descending, and aggregates counts up the suffix link tree. Run the code to observe endpos occurrence calculation.",
      "check": {
        "question": "What mathematical structure is formed by the suffix links (link pointers) of a Suffix Automaton?",
        "options": [
          "A directed tree rooted at state 0 that is isomorphic to the Suffix Tree of the reversed string S^R.",
          "A cyclic graph with infinite feedback loops.",
          "A doubly-linked list with no branches.",
          "A disconnected forest of isolated vertices."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "The suffix links connect every state to its longest proper suffix equivalence class, forming a directed tree rooted at state 0 that is mathematically isomorphic to Ukkonen's Suffix Tree for the reversed string."
      }
    },
    {
      "title": "Distinct Substrings & Substring Occurrence Queries in O(|P|) Time",
      "say": [
        "In Part 4, we leverage the Suffix Automaton to solve complex substring queries in strictly optimal time. In a Suffix Array, querying whether a pattern P of length M exists takes O(M * log N) time via binary search. In a Suffix Automaton, querying pattern existence takes strict O(M) time—proportional solely to the pattern length M and completely independent of the text length N!",
        "To search for pattern P, we start at root state 0 and follow transitions character by character: curr = next[curr][P[i]]. If at any step the required character transition is absent, the pattern does not exist in S (returns false). If we successfully consume all M characters, the pattern exists. Furthermore, the occurrence count is extracted in O(1) time simply by reading occ[curr], and the first occurrence index is obtained in O(1) time via firstEndpos[curr] - M + 1.",
        "Moreover, the Suffix Automaton provides an instantaneous closed-form computation for the total number of distinct substrings in S. In any state u, the substrings represented by u have lengths ranging from len(link[u]) + 1 up to len(u). Because every distinct substring corresponds to a unique path from the root ending in exactly one state, the total number of distinct substrings is computed in linear O(N) time via the summation: sum_{u != 0} (len[u] - len[link[u]])."
      ],
      "example": "For 'banana', the Suffix Automaton has 10 states. Summing len[u] - len[link[u]] across all non-root states yields exactly 15 distinct substrings ('b', 'ba', 'ban', 'bana', 'banan', 'banana', 'a', 'an', 'ana', 'anan', 'anana', 'n', 'na', 'nan', 'nana') in O(N) time without storing a single string in memory.",
      "code": part4_code,
      "output": part4_output,
      "tryIt": "Examine the TypeScript code below. Follow how countDistinctSubstrings sums length intervals across states, and how queryPattern locates 'an' (count 2, pos 1) and 'nan' (count 1, pos 2) in O(M) time. Run the code to verify instant pattern queries.",
      "check": {
        "question": "What is the query time complexity to determine the existence and occurrence count of a pattern P in a text of length N using a prebuilt Suffix Automaton?",
        "options": [
          "O(|P|) time, depending solely on pattern length and completely independent of text length N.",
          "O(N * |P|) quadratic time.",
          "O(|P| * log N) binary search time.",
          "O(N!) factorial time."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Querying a Suffix Automaton traces one state transition per character of pattern P, consuming exactly |P| transitions, and then reads the precomputed occurrence count in O(1) time."
      }
    },
    {
      "title": "Enterprise Application: Planetary Genomic Sequence Indexing Fabric (SuffixAutomatonGeneIndexer)",
      "say": [
        "In Part 5, we culminate Day 54 by engineering an industrial bioinformatics infrastructure engine: the SuffixAutomatonGeneIndexer. In planetary genomics repositories, public health surveillance networks, and metagenomic sequencing pipelines, researchers analyze billions of base pairs across viral, bacterial, and eukaryotic genomes (such as SARS-CoV-2, influenza, or human chromosomes).",
        "Bioinformaticians must query short regulatory motifs (transcription factor binding sites, CRISPR-Cas9 guide RNA targets, and pathogen mutation signatures) across multi-gigabyte genomic sequences in real time. Naive string matching or hash-based k-mer indices suffer from rigid length constraints or prohibitive memory footprints. Our SuffixAutomatonGeneIndexer indexes entire genomic sequences into a compact linear-time Suffix Automaton.",
        "The engine ingests raw FASTA/FASTQ nucleotide streams, builds the Suffix Automaton in strict linear O(N) time and 2N state space, and resolves arbitrary motif queries in sub-microsecond O(|P|) latency. It reports exact occurrence frequencies, identifies genomic locus coordinates for flanking sequence analysis, and calculates distinct sequence entropy metrics, establishing an enterprise foundation for computational biology, pathogen surveillance, and synthetic biology platforms."
      ],
      "example": "An epidemiological research center monitors viral mutation variants. The SuffixAutomatonGeneIndexer indexes a viral genomic sequence. When researchers submit query motifs such as 'ATCG' or 'GGCTA', the indexer locates all 6 occurrences of 'ATCG' and the exact genomic locus of 'GGCTA' in 0.8 microseconds, accelerating pathogen variant detection during outbreak response workflows.",
      "code": part5_code,
      "output": part5_output,
      "tryIt": "Explore the SuffixAutomatonGeneIndexer class below. Trace how scanMotif evaluates DNA motifs across a sample viral genome, extracting occurrence counts and locus coordinates in O(|P|) time. Run the simulation to inspect real-time genomic motif identification.",
      "check": {
        "question": "Why is the Suffix Automaton uniquely well-suited for whole-genome motif indexing compared to fixed k-mer hash tables?",
        "options": [
          "It indexes all substrings of arbitrary length simultaneously in linear space O(N), whereas k-mer hash tables are restricted to fixed-length strings.",
          "It replaces DNA bases with random English words.",
          "It requires specialized quantum biological computers to execute.",
          "It converts genomic sequences into video streams."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "A Suffix Automaton indexes all substrings of every possible length in O(N) space, allowing arbitrary motif queries of any length without the rigid window size limitations of k-mer tables."
      }
    }
  ],
  "projectStep": {
    "title": "Deploying the SuffixAutomatonGeneIndexer in Planetary Genomic Pipelines",
    "steps": [
      "Instantiate SuffixAutomatonGeneIndexer and ingest high-throughput viral nucleotide sequences into the linear-time automaton.",
      "Compute topological endpos occurrence distributions across the suffix link tree in O(N) time.",
      "Execute high-velocity biological motif queries, extracting occurrence frequencies and genomic coordinates in O(|P|) time."
    ]
  },
  "summary": [
    "The Suffix Automaton (SAM) is the minimal DFA accepting all substrings of a string, bounded by 2N - 1 states and 3N - 4 transitions.",
    "The Blumer-Crochemore algorithm constructs the Suffix Automaton incrementally in strict linear O(N) time via online state extension.",
    "Suffix links form a directed tree isomorphic to Ukkonen's Suffix Tree for the reversed string S^R, enabling linear-time endpos calculation.",
    "SAM enables arbitrary substring existence, occurrence count, and locus queries in strict O(|P|) time, independent of text length N.",
    "The SuffixAutomatonGeneIndexer demonstrates enterprise bioinformatics deployment, indexing genomic sequences for line-rate motif analysis."
  ]
}

with open("scripts/branch_c/day54_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day54_lesson, f, indent=2, ensure_ascii=False)

print("day54_lesson.json successfully created.")
