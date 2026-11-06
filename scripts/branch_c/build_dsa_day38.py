# scripts/branch_c/build_dsa_day38.py
import json

part1_say = [
    "Welcome to Day 38 of Advanced Data Structures and Algorithmic Optimization. Today we master the Z-algorithm, one of the most elegant, powerful, and geometrically intuitive linear-time string processing algorithms in computer science. Given a string S of length N, the fundamental query in text analysis is understanding how suffixes of S overlap with prefixes of S. The Z-algorithm computes an integer array Z of length N in strictly linear O(N) time and O(N) auxiliary space, where each entry Z[i] is defined as the length of the longest substring starting at position i that matches a prefix of S. Formally, Z[i] equals the maximum value k such that S[i .. i + k - 1] matches S[0 .. k - 1]. By mathematical convention, Z[0] is typically initialized to zero or N; in pattern matching workflows, setting Z[0] to zero avoids redundant self-comparisons and preserves clarity during sliding-window operations.",
    "To appreciate the computational breakthrough of the Z-algorithm, consider the naive approach to computing the Z-array. For every index i from 1 to N minus 1, an unoptimized nested loop compares characters S[i + k] against S[k] starting from k equals zero until a mismatch occurs. On highly repetitive strings such as a sequence of identical characters like 'aaaa...a', this naive algorithm performs quadratic comparisons, degrading to O(N squared) time. In high-throughput systems processing gigabyte-scale genomic sequences, web-scale search indexes, or real-time network packet buffers, quadratic string scanning causes severe latency spikes and CPU exhaustion. The Z-algorithm overcomes this bottleneck by maintaining an active reference interval known as the Z-box, represented as a closed index range [L, R], which represents the substring S[L .. R] that matches a prefix of S and has the strictly maximum right boundary R achieved so far.",
    "The maintenance of the Z-box [L, R] establishes a profound structural invariant that eliminates redundant character comparisons. Suppose we have computed the Z-values up to index i minus 1 and we maintain the interval [L, R] such that S[L .. R] equals S[0 .. R - L]. When considering index i, two mutually exclusive geometric conditions arise. In the first condition, index i lies entirely outside the current Z-box, meaning i is strictly greater than R. Because we possess no prior information about the characters starting at i, we execute an explicit character-by-character comparison starting from i and zero until a mismatch is encountered. If a non-trivial match of length k greater than zero is discovered, we update the Z-box boundaries by setting L equal to i and R equal to i plus k minus 1. This re-establishes a fresh rightward frontier.",
    "In the second condition, index i lies inside the current Z-box, meaning i is less than or equal to R. Here lies the algorithmic magic of the Z-box. Because S[L .. R] is identical to the prefix S[0 .. R - L], the character at index i corresponds directly to the character at index k equals i minus L within the prefix. Consequently, we can inspect the previously computed value Z[k]. If Z[k] is strictly less than the remaining capacity of the Z-box, which is R minus i plus 1, the longest common prefix starting at i cannot possibly extend beyond R. Therefore, we can immediately copy Z[i] equals Z[k] in O(1) time without performing a single character comparison! However, if Z[k] is greater than or equal to R minus i plus 1, the matching prefix reaches or exceeds the boundary R. In this scenario, we initialize Z[i] to R minus i plus 1 and resume explicit comparisons starting from index R plus 1. Whenever comparisons succeed, R advances strictly rightward, and L is reset to i.",
    "The amortized complexity proof of the Z-algorithm is rigorous and deterministic. Notice that character comparisons only occur when index i is greater than R, or when extending the match past the current boundary R. Each successful comparison strictly increments the value of R. Because R can never exceed N minus 1 and never decreases, the total number of successful comparisons across the entire execution loop is bounded above by N. Furthermore, each index i experiences at most one unsuccessful comparison that halts the extension loop. Therefore, the total number of character comparisons is at most 2N, guaranteeing a deterministic linear running time of O(N). Because the Z-algorithm operates on contiguous primitive memory arrays without dynamic node allocations, tree traversals, or pointer dereferencing, it exhibits near-optimal CPU cache locality and pipeline prefetching efficiency on modern server hardware."
]

part1_code = """export function computeZArray(s: string): number[] {
  const n = s.length;
  const z = new Array<number>(n).fill(0);
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

const sample = "abacaba";
const zArr = computeZArray(sample);
console.log(`String: "${sample}"`);
console.log(`Z-Array: [${zArr.join(", ")}]`);"""

part1_output = """String: "abacaba"
Z-Array: [0, 0, 1, 0, 3, 0, 1]"""

part2_say = [
    "Now that we have constructed the linear Z-array engine, we examine its primary application in enterprise systems: linear exact pattern matching. Given a pattern string P of length M and a target text string T of length N, our objective is to identify all starting positions in T where P occurs as an exact substring. Traditional naive scanning requires O(N times M) worst-case comparisons, which quickly degrades when scanning long genomic reads or dense network packet traces. By synthesizing a combined string S formed by concatenating P, a unique delimiter sentinel character not present in the alphabet, and the text T, the Z-algorithm resolves the exact pattern matching problem in strictly linear O(N + M) time.",
    "The role of the sentinel delimiter character, traditionally written as a dollar sign '$' or null byte '\\0', is of paramount architectural importance. The sentinel guarantees that the Z-box can never extend beyond the boundaries of the pattern P. When computing the Z-array for the concatenated string S equals P plus '$' plus T, every character comparison against P halts immediately when encountering the sentinel character, because the sentinel appears nowhere else in P or T. Consequently, for any index i corresponding to a position in T (that is, for all indices i strictly greater than M), the value Z[i] cannot exceed the pattern length M. An exact match of pattern P starting at index i minus M minus 1 within text T occurs if and only if Z[i] equals M.",
    "Let us trace the geometric behavior of the concatenated string during execution. Suppose the pattern P is 'ATCG' of length 4, and the text T is 'GATCGATCGATATCG' of length 15. The concatenated string S becomes 'ATCG$GATCGATCGATATCG' of total length 20. As the Z-algorithm traverses S, it skips index zero and computes Z-values for the pattern and sentinel. Once index i reaches position 5 (the first character of text T), it evaluates the overlap with the prefix of S, which is P. At index 6 (character 'A' in the first 'ATCG' of T), the algorithm matches 4 characters ('A', 'T', 'C', 'G') before hitting the mismatch with '$' in the pattern prefix. Thus, Z[6] equals 4. Because 4 matches the pattern length M, an exact occurrence is reported at text index 6 minus 4 minus 1 equals 1. The search continues seamlessly across the entire text in a single contiguous forward sweep.",
    "Compared to the Knuth-Morris-Pratt (KMP) algorithm, the Z-algorithm offers distinct cognitive and operational advantages. While KMP requires understanding the prefix failure function pi and conceptually maintaining backward jump links or a deterministic finite automaton state machine, the Z-algorithm is completely forward-facing and symmetric. It asks one clean question at every position: how many characters starting from here match the beginning of our reference string? There is no state backtracking or recursive transition chasing. Furthermore, the Z-array directly reveals prefix-suffix overlaps and repetitive structures across the entire string without requiring additional automaton transformations, making it exceptionally versatile for multi-disciplinary text analytics.",
    "From an enterprise systems engineering perspective, concatenated pattern matching via the Z-algorithm can be implemented with minimal memory overhead. While naively constructing the concatenated string S consumes M plus N plus 1 bytes of memory, high-performance streaming architectures can virtualize the character lookup. By defining an accessor function or custom iterator that maps virtual index i to P[i] when i is less than M, to the delimiter when i equals M, and to T[i - M - 1] when i is greater than M, the Z-algorithm can process streaming inputs with only O(M) working memory for the pattern and Z-box pointers. This architectural pattern allows gigabyte-scale logs and live sensor streams to be inspected at line rate without triggering garbage collection pauses."
]

part2_code = """import { computeZArray } from "./day38_p1";

export function findPatternOccurrencesZ(pattern: string, text: string): number[] {
  const sentinel = "$";
  const combined = `${pattern}${sentinel}${text}`;
  const z = computeZArray(combined);
  const m = pattern.length;
  const occurrences: number[] = [];

  for (let i = m + 1; i < combined.length; i++) {
    if (z[i] === m) {
      occurrences.push(i - m - 1);
    }
  }
  return occurrences;
}

const pattern = "ATCG";
const text = "GATCGATCGATATCG";
const matches = findPatternOccurrencesZ(pattern, text);
console.log(`Pattern: "${pattern}", Text: "${text}"`);
console.log(`Matches at indices: [${matches.join(", ")}]`);"""

part2_output = """Pattern: "ATCG", Text: "GATCGATCGATATCG"
Matches at indices: [1, 5, 11]"""

part3_say = [
    "In Part 3, we explore one of the deepest theoretical insights in formal stringology: the algorithmic duality and mathematical equivalence between the Z-array and the Knuth-Morris-Pratt prefix function pi. While software engineers often treat KMP and the Z-algorithm as competing techniques, theoretical computer science proves that they represent two dual perspectives of the identical underlying combinatorial structure of a string. Specifically, both arrays completely capture the border hierarchy and periodicity of all prefixes and substrings. Furthermore, any algorithm that computes one can be transformed into the other in strictly linear O(N) time without rescanning the underlying character string.",
    "To understand this mathematical duality, let us formalize the definitions of both arrays. For a string S of length N, the prefix function entry pi[i] represents the length of the longest proper border of the prefix S[0 .. i]. That is, pi[i] is the length of the longest prefix of S that is also a strict suffix of S[0 .. i]. In contrast, the Z-array entry Z[i] represents the length of the longest common prefix between the entire string S and the suffix starting at index i, namely S[i .. N - 1]. Notice the geometric inversion: pi looks backward from index i toward the start of the string, measuring how much of the suffix matches a prefix. Conversely, Z looks forward from index i toward the end of the string, measuring how much of the substring matches a prefix.",
    "This geometric relationship enables a direct O(N) conversion from the Z-array to the prefix function pi. Consider a non-zero value Z[i] greater than zero. This value asserts that the substring starting at i and ending at right equals i plus Z[i] minus 1 matches the prefix S[0 .. Z[i] - 1]. Therefore, at index right, there exists a suffix of length Z[i] that matches a prefix of length Z[i]. This means that the border at index right is at least Z[i]. If multiple i values contribute a border ending at the same position right, we take the maximum value, setting pi[right] equal to the maximum of its current value and Z[i]. Once all right endpoints have been populated in a single linear forward scan, we propagate the border values backward: if a prefix of length k matches at index j, then a prefix of length k minus 1 matches at index j minus 1. A single backward pass setting pi[j - 1] equals the maximum of pi[j - 1] and pi[j] minus 1 completes the transformation in deterministic O(N) time.",
    "The converse conversion—transforming a prefix function pi into a Z-array in linear time—is equally elegant and relies on KMP string reconstruction or prefix-tree traversal. By understanding this bidirectional mapping, systems architects can leverage the specific strengths of each representation depending on runtime constraints. For example, the prefix function pi is uniquely suited for online, character-by-character stream processing because each new incoming character can update the current state using only the previous state and failure links. On the other hand, the Z-array is vastly superior for batch string indexing, longest common prefix queries, and bidirectional wildcard searches, because it provides direct geometric bounds on substring spans without chasing pointer chains.",
    "In enterprise analytics and database engine design, the Z-to-pi duality is heavily leveraged in query optimizers. When an SQL engine compiles a LIKE pattern query containing complex wildcards, the optimizer analyzes the pattern's periodicity. If the pattern exhibits high periodicity (such as 'abacabacaba'), the optimizer can use the Z-array to factor the string into minimal repeating periods (the Lyndon factorization or run-length decomposition) and synthesize a compact state machine. By unifying KMP and the Z-algorithm into a single coherent theoretical framework, engineers can fluidly alternate between forward substring bounds and backward border transitions."
]

part3_code = """import { computeZArray } from "./day38_p1";

export function zToPrefixFunction(z: number[]): number[] {
  const n = z.length;
  const pi = new Array<number>(n).fill(0);

  for (let i = 1; i < n; i++) {
    if (z[i] > 0) {
      const right = i + z[i] - 1;
      pi[right] = Math.max(pi[right], z[i]);
    }
  }

  for (let i = n - 1; i > 0; i--) {
    pi[i - 1] = Math.max(pi[i - 1], pi[i] - 1);
  }

  return pi;
}

const testStr = "abacaba";
const zTest = computeZArray(testStr);
const piCalculated = zToPrefixFunction(zTest);
console.log(`Z-array: [${zTest.join(", ")}]`);
console.log(`Converted Pi array: [${piCalculated.join(", ")}]`);"""

part3_output = """Z-array: [0, 0, 1, 0, 3, 0, 1]
Converted Pi array: [0, 0, 1, 0, 1, 2, 3]"""

part4_say = [
    "In Part 4, we tackle one of the most challenging problems in text analytics and biological informatics: approximate string matching with wildcards and substitutions. In real-world applications, input data is rarely pristine. Optical character recognition (OCR) systems misread noisy scanned documents, network transmissions drop occasional packets, and biological DNA sequencing instruments introduce chemical read errors at known statistical error rates. Consequently, enterprise search engines and genomic diagnostic platforms require algorithms that can locate occurrences of a pattern P of length M inside a text T of length N with at most k mismatches (Hamming distance less than or equal to k), where k is a small tolerance parameter such as 1 or 2.",
    "A naive approach to 1-mismatch pattern matching tests every candidate window in the text by performing character comparisons until 2 mismatches are encountered, consuming O(N times M) time in the worst case. Remarkably, by combining forward and backward Z-arrays, we can solve the 1-mismatch pattern matching problem in strictly linear O(N + M) time! The foundational insight relies on the fact that if a pattern P of length M matches a text substring T[j .. j + M - 1] with at most 1 mismatch, the mismatch must occur at some specific offset p within the window, while the prefix P[0 .. p - 1] matches T[j .. j + p - 1] exactly, and the suffix P[p + 1 .. M - 1] matches T[j + p + 1 .. j + M - 1] exactly.",
    "To compute these prefix and suffix matches simultaneously in linear time, we construct two separate Z-arrays. First, we compute the forward Z-array, Z_fwd, on the concatenated string P plus '$' plus T. The entry Z_fwd[M + 1 + j] gives us the exact length of the longest common prefix (LCP), denoted L1, between pattern P and the text starting at index j. If L1 is greater than or equal to M, the pattern matches with zero mismatches. However, if L1 is strictly less than M, a character mismatch occurs at index j plus L1. We then need to know whether the remaining characters of the pattern match the remaining characters of the text window.",
    "This is where the backward Z-array demonstrates its brilliance. We reverse both the pattern P and the text T, producing rev(P) and rev(T), and compute a second Z-array, Z_bwd, on the concatenated reversed string rev(P) plus '$' plus rev(T). The backward Z-array measures the longest common suffix (LCS) between the pattern and the text window. Specifically, for text window starting at index j and ending at index j plus M minus 1, the corresponding start position in the reversed text rev(T) is index N minus j minus M. The value L2 equals Z_bwd[M + 1 + (N - j - M)] represents the length of the longest common suffix. The necessary and sufficient condition for the text window to match pattern P with at most 1 mismatch is simply: L1 plus 1 plus L2 is greater than or equal to M!",
    "When this condition is satisfied, the single mismatch is located exactly at text position j plus L1, and the mismatched character can be inspected and classified immediately. The entire procedure requires exactly two linear Z-array evaluations and one single linear scan across the text windows, achieving an optimal O(N + M) running time. This dual-Z algorithm is orders of magnitude faster than dynamic programming edit-distance matrices (which require O(N times M) space and time) or seed-and-extend heuristics, providing provably optimal linear throughput for clinical variant discovery, network signature fuzzy matching, and typo-tolerant search engines.",
    "Furthermore, this dual-Z framework generalizes gracefully to Don't-Care characters and wildcard matching. If the pattern contains an explicit wildcard symbol (such as '?' representing any single arbitrary character at a fixed offset), the Z-algorithm can treat the wildcard position as a known structural breakpoint. For arbitrary k-mismatch matching where k is small (such as k up to 3), the technique can be extended using recursive partition trees or kangaroo hopping with longest common prefix queries, maintaining sub-quadratic bounds. By pairing forward prefix bounds with backward suffix bounds, engineers gain total algorithmic mastery over noisy character streams without surrendering linear runtime guarantees."
]

part4_code = """import { computeZArray } from "./day38_p1";

export interface ApproximateMatch {
  index: number;
  mismatches: number;
  mismatchPos?: number;
}

export function findMatchesWithOneMismatch(pattern: string, text: string): ApproximateMatch[] {
  const m = pattern.length;
  const n = text.length;
  if (m > n) return [];

  const fwdStr = `${pattern}$${text}`;
  const zFwd = computeZArray(fwdStr);

  const revP = pattern.split("").reverse().join("");
  const revT = text.split("").reverse().join("");
  const bwdStr = `${revP}$${revT}`;
  const zBwd = computeZArray(bwdStr);

  const results: ApproximateMatch[] = [];

  for (let j = 0; j <= n - m; j++) {
    const l1 = zFwd[m + 1 + j];
    if (l1 >= m) {
      results.push({ index: j, mismatches: 0 });
      continue;
    }
    const revOffset = n - j - m;
    const l2 = zBwd[m + 1 + revOffset];

    if (l1 + 1 + l2 >= m) {
      results.push({
        index: j,
        mismatches: 1,
        mismatchPos: j + l1,
      });
    }
  }
  return results;
}

const genomeRef = "ATGCATCGATGC";
const probe = "ATCC";
const approxMatches = findMatchesWithOneMismatch(probe, genomeRef);
console.log(`Probe: "${probe}", Genome: "${genomeRef}"`);
for (const m of approxMatches) {
  console.log(`Match at index ${m.index}: mismatches=${m.mismatches}${m.mismatchPos !== undefined ? `, mismatchPos=${m.mismatchPos}` : ""}`);
}"""

part4_output = """Probe: "ATCC", Genome: "ATGCATCGATGC"
Match at index 0: mismatches=1, mismatchPos=2
Match at index 4: mismatches=1, mismatchPos=7
Match at index 8: mismatches=1, mismatchPos=10"""

part5_say = [
    "In Part 5, we culminate Day 38 by engineering an enterprise-grade biological sequence variant scanner: the GenomicVariantZScanner. In modern clinical genomics and oncology diagnostics, next-generation sequencing (NGS) platforms generate hundreds of millions of short DNA sequence fragments known as reads (typically 100 to 300 base pairs in length). These reads must be rapidly aligned against a reference human genome containing over three billion base pairs to identify genetic mutations, Single Nucleotide Variants (SNVs), and structural alterations. High clinical diagnostic accuracy demands that alignment algorithms detect both exact matches and single-base substitutions with mathematical certainty and zero tolerance for missed variants.",
    "Our GenomicVariantZScanner encapsulates the dual forward-backward Z-array engine developed in Part 4 into a robust, object-oriented, production-ready pipeline. When initialized with a reference genome sequence (or a targeted genetic locus such as the BRCA1 or TP53 tumor suppressor genes), the scanner accepts incoming sequence reads, maps them against the reference genome, and emits structured mutation reports. Each mutation report details the chromosome identifier, read ID, exact zero-based reference coordinate, mutation classification (EXACT versus SNV_MUTATION), the reference and alternative alleles, and an empirical confidence calibration score.",
    "Let us examine how the scanner handles single nucleotide variants. Suppose the reference genome contains the regulatory motif 'ACGTACGTGACGTACGT' and the sequencing instrument yields a read 'ACAT'. The probe 'ACAT' matches the reference sequence 'ACGT' except for a single base substitution at index 2 where Guanine ('G') has mutated into Adenine ('A'). When the scanRead method processes this read, the forward Z-array determines that the first two bases 'AC' match the reference, yielding L1 equals 2. The backward Z-array matches the terminal base 'T', yielding L2 equals 1. Because L1 plus 1 plus L2 equals 2 plus 1 plus 1 equals 4 (the exact read length), the scanner detects the SNV mutation, computes the exact genomic coordinate of the mutated nucleotide, extracts the reference and alternate bases, and packages the diagnostic record.",
    "In production high-throughput bioinformatics environments, the GenomicVariantZScanner can be scaled horizontally across cluster nodes using partitioned reference intervals. Because each Z-array computation is completely independent and read-only, reference chromosomes can be stored in shared memory segments via memory-mapped files (mmap) across multiple worker processes. By combining the Z-algorithm with hardware-level SIMD (Single Instruction, Multiple Data) vectorization—such as AVX-512 instructions comparing 64 bytes in parallel per CPU cycle—the genomic scanner can process tens of millions of sequencing reads per second, accelerating clinical cancer variant interpretation from days to minutes.",
    "To ensure resilience against common sequencing artifacts, enterprise implementations must also account for edge conditions such as ambiguous nucleotide bases (represented by 'N' in IUPAC notation), homopolymer runs (stretches of identical nucleotides that induce base calling slippage), and read ends with low Phred quality scores. By configuring the GenomicVariantZScanner with strict quality score filtering and alignment confidence scoring, clinical diagnostic pipelines achieve regulatory accreditation (such as CAP/CLIA and ISO 15189 compliance) while maintaining peak algorithmic efficiency.",
    "Finally, consider the role of the Z-scanner in comprehensive clinical variant filtering. When oncologists analyze somatic mutations in tumor biopsy samples, they frequently observe sub-clonal mutations that appear at variant allele frequencies (VAF) as low as 1 to 5 percent. A deterministic linear-time variant scanner guarantees that every read spanning the locus is classified without statistical sampling bias or heuristic pruning. When combined with downstream BAM/VCF file emitters and variant annotation databases like ClinVar and COSMIC, the GenomicVariantZScanner forms the core computational engine of modern precision oncology and personalized genomic therapeutics."
]

part5_code = """import { findMatchesWithOneMismatch } from "./day38_p4";

export interface MutationReport {
  chromosome: string;
  readId: string;
  position: number;
  type: "EXACT" | "SNV_MUTATION";
  refAllele: string;
  altAllele: string;
  confidence: number;
}

export class GenomicVariantZScanner {
  constructor(private referenceGenome: string) {}

  public scanRead(chromosome: string, readId: string, readSeq: string): MutationReport[] {
    const matches = findMatchesWithOneMismatch(readSeq, this.referenceGenome);
    const reports: MutationReport[] = [];

    for (const match of matches) {
      if (match.mismatches === 0) {
        reports.push({
          chromosome,
          readId,
          position: match.index,
          type: "EXACT",
          refAllele: readSeq,
          altAllele: readSeq,
          confidence: 1.0,
        });
      } else if (match.mismatches === 1 && match.mismatchPos !== undefined) {
        const refChar = this.referenceGenome[match.mismatchPos];
        const altChar = readSeq[match.mismatchPos - match.index];
        reports.push({
          chromosome,
          readId,
          position: match.index,
          type: "SNV_MUTATION",
          refAllele: `${match.mismatchPos}:${refChar}`,
          altAllele: `${match.mismatchPos}:${altChar}`,
          confidence: 0.985,
        });
      }
    }
    return reports;
  }
}

const scanner = new GenomicVariantZScanner("ACGTACGTGACGTACGT");
const read1 = "ACGT";
const read2 = "ACAT";
console.log("Scanning Exact Read 'ACGT':", scanner.scanRead("chr1", "READ_01", read1).length, "alignments found");
const snvReports = scanner.scanRead("chr1", "READ_02", read2);
console.log("Scanning Variant Read 'ACAT':", snvReports.length, "alignments found");
for (const rep of snvReports) {
  console.log(`  -> Pos ${rep.position} [${rep.type}] Ref=${rep.refAllele} Alt=${rep.altAllele} Conf=${rep.confidence}`);
}"""

part5_output = """Scanning Exact Read 'ACGT': 4 alignments found
Scanning Variant Read 'ACAT': 4 alignments found
  -> Pos 0 [SNV_MUTATION] Ref=2:G Alt=2:A Conf=0.985
  -> Pos 4 [SNV_MUTATION] Ref=6:G Alt=6:A Conf=0.985
  -> Pos 9 [SNV_MUTATION] Ref=11:G Alt=11:A Conf=0.985
  -> Pos 13 [SNV_MUTATION] Ref=15:G Alt=15:A Conf=0.985"""

# Check word counts
parts = [part1_say, part2_say, part3_say, part4_say, part5_say]
total_words = 0
for idx, p in enumerate(parts, 1):
    w = sum(len(s.split()) for s in p)
    total_words += w
    print(f"Part {idx} say words: {w}")
print(f"Total say words across all 5 parts: {total_words}")
