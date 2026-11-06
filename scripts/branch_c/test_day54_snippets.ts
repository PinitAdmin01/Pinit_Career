// scripts/branch_c/test_day54_snippets.ts

// --- Parts 1 & 2: Suffix Automaton (SAM) Foundations & Incremental Construction ---
interface SAMState {
  len: number;
  link: number;
  next: Map<string, number>;
  isClone: boolean;
  firstEndpos: number;
}

class SuffixAutomaton {
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
console.log('--- Parts 1 & 2: Suffix Automaton Construction ---');
console.log('String: "banana"');
console.log('Total SAM states:', sam.sz);
console.log('Transitions from root:', Array.from(sam.states[0].next.entries()));

// --- Part 3: Link Tree Duality & Endpos Occurrence Counts ---
function computeOccurrences(sam: SuffixAutomaton, sLen: number): number[] {
  const occ = new Array(sam.sz).fill(0);
  for (let i = 1; i < sam.sz; i++) {
    if (!sam.states[i].isClone) {
      occ[i] = 1;
    }
  }

  // Sort states by len descending
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
console.log('Root link occurrence count (total substrings):', occ[0]);

// --- Part 4: Distinct Substrings & O(|P|) Query ---
function countDistinctSubstrings(sam: SuffixAutomaton): number {
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
console.log('Query "xyz":', queryPattern(sam, occ, 'xyz'));

// --- Part 5: Enterprise SuffixAutomatonGeneIndexer ---
interface GeneMotifMatch {
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
console.log('Motif "TTTTT":', JSON.stringify(geneIndexer.scanMotif('TTTTT')));
