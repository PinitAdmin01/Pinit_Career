/**
 * Day 37 - Part 2: Knuth-Morris-Pratt (KMP) Linear Pattern Matching Engine
 */

class KMPMatcher {
  private pattern: string;
  private pi: number[];

  constructor(pattern: string) {
    this.pattern = pattern;
    this.pi = this.buildPi(pattern);
  }

  private buildPi(p: string): number[] {
    const m = p.length;
    const pi = new Array(m).fill(0);
    for (let i = 1; i < m; i++) {
      let j = pi[i - 1];
      while (j > 0 && p[i] !== p[j]) {
        j = pi[j - 1];
      }
      if (p[i] === p[j]) j++;
      pi[i] = j;
    }
    return pi;
  }

  // Searches pattern in streaming text in O(N) time with ZERO text pointer backtracks
  searchAll(text: string): number[] {
    const n = text.length;
    const m = this.pattern.length;
    if (m === 0 || n < m) return [];

    const matches: number[] = [];
    let j = 0; // State in pattern

    for (let i = 0; i < n; i++) {
      while (j > 0 && text[i] !== this.pattern[j]) {
        j = this.pi[j - 1]; // Fast transition via failure function
      }
      if (text[i] === this.pattern[j]) {
        j++;
      }
      if (j === m) {
        matches.push(i - m + 1); // Found exact occurrence
        j = this.pi[j - 1]; // Advance to next possible border
      }
    }

    return matches;
  }
}

function main(): void {
  const text = "bacbababaabcbab";
  const pattern = "ababaca";
  const kmp = new KMPMatcher(pattern);

  const testText = "ABABDABACDABABCABAB";
  const testPattern = "ABABCABAB";
  const engine = new KMPMatcher(testPattern);
  const found = engine.searchAll(testText);

  console.log(`[KMPMatcher] Target Text: "${testText}" (Length: ${testText.length})`);
  console.log(`[KMPMatcher] Search Pattern: "${testPattern}" (Length: ${testPattern.length})`);
  console.log(`[KMPMatcher] Occurrences Located At Offsets: [${found.join(", ")}]`);
  console.log(`[KMPMatcher] Verified Match Substring: "${testText.substring(found[0], found[0] + testPattern.length)}"`);
}

main();
