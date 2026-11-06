/**
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

main();
