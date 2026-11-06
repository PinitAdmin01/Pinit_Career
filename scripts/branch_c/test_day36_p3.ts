/**
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

main();
