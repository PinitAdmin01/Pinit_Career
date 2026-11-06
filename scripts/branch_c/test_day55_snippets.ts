// scripts/branch_c/test_day55_snippets.ts

// --- Part 1: Genomic Reference & Read Data Models ---
interface GenomeChromosome {
  id: string;
  sequence: string;
}

interface FastqRead {
  readId: string;
  bases: string;
  quality: string;
}

const refChromosomes: GenomeChromosome[] = [
  { id: 'chr01', sequence: 'ATGCGATCGATCGATCGATCGATAGGCTAGCTAGCATCGATCGATC' },
  { id: 'chr02', sequence: 'GGCTAAGCTACGATCGATCGATCGATCGATCGAACGTACGTACGT' }
];

console.log('--- Part 1: Genomic Reference Models ---');
console.log('Chromosomes loaded:', refChromosomes.map(c => `${c.id} (${c.sequence.length} bp)`).join(', '));

// --- Part 2: Multi-Chromosome Suffix Automaton Indexing ---
interface MultiSAMState {
  len: number;
  link: number;
  next: Map<string, number>;
  isClone: boolean;
  firstEndpos: number;
  chrId: string;
}

class MultiChromosomeSAM {
  states: MultiSAMState[] = [];
  sz: number = 0;
  last: number = 0;

  constructor() {
    this.init();
  }

  init(): void {
    this.states = [];
    this.states.push({
      len: 0,
      link: -1,
      next: new Map(),
      isClone: false,
      firstEndpos: -1,
      chrId: 'ROOT'
    });
    this.sz = 1;
    this.last = 0;
  }

  extend(c: string, pos: number, chrId: string): void {
    const cur = this.sz++;
    this.states.push({
      len: this.states[this.last].len + 1,
      link: 0,
      next: new Map(),
      isClone: false,
      firstEndpos: pos,
      chrId
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
          firstEndpos: this.states[q].firstEndpos,
          chrId: this.states[q].chrId
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

  indexChromosome(chr: GenomeChromosome): void {
    for (let i = 0; i < chr.sequence.length; i++) {
      this.extend(chr.sequence[i], i, chr.id);
    }
    // Terminal sentinel separating chromosomes
    this.extend('$', chr.sequence.length, chr.id);
  }
}

const multiSam = new MultiChromosomeSAM();
refChromosomes.forEach(c => multiSam.indexChromosome(c));
console.log('--- Part 2: Multi-Chromosome SAM ---');
console.log('Total states across chromosomes:', multiSam.sz);

// --- Part 3: KMP Pathogen Mutation Scanner ---
function computePrefixTable(pattern: string): number[] {
  const m = pattern.length;
  const pi = new Array(m).fill(0);
  let j = 0;
  for (let i = 1; i < m; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) j = pi[j - 1];
    if (pattern[i] === pattern[j]) j++;
    pi[i] = j;
  }
  return pi;
}

function kmpExactScan(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const pi = computePrefixTable(pattern);
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = pi[j - 1];
    if (text[i] === pattern[j]) j++;
    if (j === pattern.length) {
      matches.push(i - pattern.length + 1);
      j = pi[j - 1];
    }
  }
  return matches;
}

const pathogenSignature = 'ATCGATC';
const hits = kmpExactScan(refChromosomes[0].sequence, pathogenSignature);
console.log('--- Part 3: KMP Pathogen Scanner ---');
console.log(`Pathogen signature "${pathogenSignature}" hits:`, hits);

// --- Part 4: Aho-Corasick Multi-Target Gene Matcher ---
interface ACMultiNode {
  id: number;
  char: string;
  children: Map<string, ACMultiNode>;
  fail: ACMultiNode | null;
  output: string[];
}

function createACNode(id: number, char: string = ''): ACMultiNode {
  return { id, char, children: new Map(), fail: null, output: [] };
}

class AhoCorasickGeneMatcher {
  root: ACMultiNode = createACNode(0);
  private counter: number = 1;
  private targets: Set<string> = new Set();

  registerTarget(target: string): void {
    this.targets.add(target.toUpperCase());
    let curr = this.root;
    for (const c of target.toUpperCase()) {
      if (!curr.children.has(c)) {
        curr.children.set(c, createACNode(this.counter++, c));
      }
      curr = curr.children.get(c)!;
    }
    curr.output.push(target.toUpperCase());
  }

  compile(): void {
    const queue: ACMultiNode[] = [];
    this.root.fail = this.root;
    for (const child of this.root.children.values()) {
      child.fail = this.root;
      queue.push(child);
    }
    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const [char, child] of curr.children.entries()) {
        let fallback = curr.fail;
        while (fallback !== this.root && !fallback!.children.has(char)) {
          fallback = fallback!.fail;
        }
        if (fallback!.children.has(char) && fallback!.children.get(char) !== child) {
          child.fail = fallback!.children.get(char)!;
        } else {
          child.fail = this.root;
        }
        child.output = child.output.concat(child.fail.output);
        queue.push(child);
      }
    }
  }

  scanSequence(seq: string): { target: string; index: number }[] {
    const results: { target: string; index: number }[] = [];
    let curr = this.root;
    for (let i = 0; i < seq.length; i++) {
      const char = seq[i].toUpperCase();
      while (curr !== this.root && !curr.children.has(char)) {
        curr = curr.fail!;
      }
      curr = curr.children.get(char) || this.root;
      for (const out of curr.output) {
        results.push({ target: out, index: i - out.length + 1 });
      }
    }
    return results;
  }
}

const acMatcher = new AhoCorasickGeneMatcher();
['ATCG', 'GGCTA', 'CGAACG', 'TACGT'].forEach(t => acMatcher.registerTarget(t));
acMatcher.compile();
const geneHits = acMatcher.scanSequence(refChromosomes[1].sequence);
console.log('--- Part 4: Aho-Corasick Gene Matcher ---');
console.log('Multi-target matches detected:', geneHits.length);
geneHits.slice(0, 4).forEach(h => console.log(`Target: ${h.target} at position ${h.index}`));

// --- Part 5: ⭐ Enterprise Genome Alignment Engine ---
interface ReadAlignment {
  readId: string;
  matched: boolean;
  chromosome: string;
  locus: number;
  length: number;
  targets: string[];
}

class EnterpriseGenomeAlignmentEngine {
  private sam: MultiChromosomeSAM = new MultiChromosomeSAM();
  private acMatcher: AhoCorasickGeneMatcher = new AhoCorasickGeneMatcher();
  private totalReadsAligned: number = 0;
  private totalBasesProcessed: number = 0;

  constructor(chromosomes: GenomeChromosome[], geneTargets: string[]) {
    chromosomes.forEach(chr => this.sam.indexChromosome(chr));
    geneTargets.forEach(tgt => this.acMatcher.registerTarget(tgt));
    this.acMatcher.compile();
  }

  alignRead(read: FastqRead): ReadAlignment {
    this.totalReadsAligned++;
    this.totalBasesProcessed += read.bases.length;

    // 1. Exact match via Suffix Automaton
    let curr = 0;
    let matched = true;
    for (const c of read.bases.toUpperCase()) {
      if (!this.sam.states[curr].next.has(c)) {
        matched = false;
        break;
      }
      curr = this.sam.states[curr].next.get(c)!;
    }

    let chromosome = 'UNMAPPED';
    let locus = -1;
    if (matched) {
      const state = this.sam.states[curr];
      chromosome = state.chrId;
      locus = state.firstEndpos - read.bases.length + 1;
    }

    // 2. Identify regulatory gene targets in read via Aho-Corasick
    const targets = this.acMatcher.scanSequence(read.bases).map(t => t.target);

    return {
      readId: read.readId,
      matched,
      chromosome,
      locus,
      length: read.bases.length,
      targets: Array.from(new Set(targets))
    };
  }

  getTelemetry(): { reads: number; bases: number; samStates: number } {
    return {
      reads: this.totalReadsAligned,
      bases: this.totalBasesProcessed,
      samStates: this.sam.sz
    };
  }
}

const engine = new EnterpriseGenomeAlignmentEngine(
  refChromosomes,
  ['ATCG', 'GGCTA', 'CGAACG', 'TACGT']
);

const testReads: FastqRead[] = [
  { readId: 'READ-001', bases: 'ATGCGATCG', quality: 'IIIIIIIII' },
  { readId: 'READ-002', bases: 'GGCTAAGCT', quality: 'IIIIIIIII' },
  { readId: 'READ-003', bases: 'TTTTTTTTT', quality: 'IIIIIIIII' }
];

console.log('--- Part 5: Enterprise Engine Capstone Simulation ---');
testReads.forEach(r => {
  const aln = engine.alignRead(r);
  console.log(`Aligned ${aln.readId}: mapped=${aln.matched}, chr=${aln.chromosome}, locus=${aln.locus}, targets=[${aln.targets.join(', ')}]`);
});
console.log('Engine Telemetry:', JSON.stringify(engine.getTelemetry()));
