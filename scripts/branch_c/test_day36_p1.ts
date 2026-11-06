/**
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

main();
