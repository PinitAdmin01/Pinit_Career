/**
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

main();
