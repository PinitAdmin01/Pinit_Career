/**
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

main();
