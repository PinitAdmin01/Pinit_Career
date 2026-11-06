// scripts/branch_c/test_day53_snippets.ts

// --- Part 1: Suffix Array Foundations ---
function buildSuffixArrayPrefixDoubling(s: string): number[] {
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
console.log('Sorted suffixes:', sa.map(i => sampleStr.slice(i)).join(', '));

// --- Part 2: Radix Sort Acceleration & Equivalence Classes ---
function getEquivalenceClasses(s: string, sa: number[]): { sa: number[]; rank: number[] } {
  const n = s.length;
  const rank = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    rank[sa[i]] = i;
  }
  return { sa, rank };
}

const eq = getEquivalenceClasses(sampleStr, sa);
console.log('--- Part 2: Inverted Rank Array ---');
console.log('Rank array:', eq.rank);

// --- Part 3: Kasai\'s Algorithm for LCP Array ---
function buildLCPArrayKasai(s: string, sa: number[]): number[] {
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
console.log('LCP array:', lcp);

// --- Part 4: Sparse Table Range Minimum Query on LCP ---
class LcpRangeMinimumQuery {
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
console.log('RMQ LCP between sa[2] and sa[4]:', rmq.query(3, 4));

// --- Part 5: Enterprise SuffixLogDeduplicator ---
interface DuplicateSpan {
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

    // Sort by length descending and deduplicate overlapping sub-strings
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
dupes.forEach(d => console.log(`Dupe: "${d.substring}" (len ${d.length}) at offsets ${d.occurrences.join(', ')}`));
