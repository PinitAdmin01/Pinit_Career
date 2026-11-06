// scripts/branch_c/test_day38_snippets.ts

export function computeZArray(s: string): number[] {
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

// Snippet 1 test
console.log("=== Snippet 1: Linear Z-Array Computation ===");
const sample = "abacaba";
const zArr = computeZArray(sample);
console.log(`String: "${sample}"`);
console.log(`Z-Array: [${zArr.join(", ")}]`);

// Snippet 2 test
console.log("\n=== Snippet 2: Pattern Matching via Concatenation ===");
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
console.log(`Matches at indices: [${matches.join(", ")}]`);

// Snippet 3 test: Z-array to Prefix Function (Pi) conversion in O(N)
console.log("\n=== Snippet 3: Z-Array to Pi Duality Conversion ===");
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
console.log(`Converted Pi array: [${piCalculated.join(", ")}]`);

// Snippet 4 test: 1-Mismatch Pattern Matching using Forward & Backward Z-Arrays
console.log("\n=== Snippet 4: 1-Mismatch Pattern Matching ===");
export interface ApproximateMatch {
  index: number;
  mismatches: number;
  mismatchPos?: number;
}

export function findMatchesWithOneMismatch(pattern: string, text: string): ApproximateMatch[] {
  const m = pattern.length;
  const n = text.length;
  if (m > n) return [];

  // Forward Z: P + "$" + T
  const fwdStr = `${pattern}$${text}`;
  const zFwd = computeZArray(fwdStr);

  // Backward Z: rev(P) + "$" + rev(T)
  const revP = pattern.split("").reverse().join("");
  const revT = text.split("").reverse().join("");
  const bwdStr = `${revP}$${revT}`;
  const zBwd = computeZArray(bwdStr);

  const results: ApproximateMatch[] = [];

  for (let j = 0; j <= n - m; j++) {
    const l1 = zFwd[m + 1 + j]; // LCP from left
    if (l1 >= m) {
      results.push({ index: j, mismatches: 0 });
      continue;
    }
    // Backward offset: in rev(T), index corresponding to end of window j+m-1
    // index in rev(T) is n - 1 - (j + m - 1) = n - j - m
    const revOffset = n - j - m;
    const l2 = zBwd[m + 1 + revOffset]; // LCS from right

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
const probe = "ATCC"; // mismatch at pos 3 ('C' vs 'G')
const approxMatches = findMatchesWithOneMismatch(probe, genomeRef);
console.log(`Probe: "${probe}", Genome: "${genomeRef}"`);
for (const m of approxMatches) {
  console.log(`Match at index ${m.index}: mismatches=${m.mismatches}${m.mismatchPos !== undefined ? `, mismatchPos=${m.mismatchPos}` : ""}`);
}

// Snippet 5 test: Enterprise GenomicVariantZScanner
console.log("\n=== Snippet 5: GenomicVariantZScanner ===");
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
}
