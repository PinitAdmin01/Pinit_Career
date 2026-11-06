// scripts/branch_c/test_day39_snippets.ts

// --- Snippet 1: Keyword Trie Construction ---
export interface TrieNode {
  id: number;
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  pattern?: string;
}

export function buildTrie(keywords: string[]): { root: TrieNode; totalNodes: number } {
  let nodeIdCounter = 0;
  const root: TrieNode = { id: nodeIdCounter++, children: new Map(), isEndOfWord: false };

  for (const word of keywords) {
    let curr = root;
    for (const ch of word) {
      if (!curr.children.has(ch)) {
        curr.children.set(ch, { id: nodeIdCounter++, children: new Map(), isEndOfWord: false });
      }
      curr = curr.children.get(ch)!;
    }
    curr.isEndOfWord = true;
    curr.pattern = word;
  }
  return { root, totalNodes: nodeIdCounter };
}

console.log("=== Snippet 1: Keyword Trie ===");
const dictionary = ["he", "she", "his", "hers"];
const trie = buildTrie(dictionary);
console.log(`Dictionary: [${dictionary.join(", ")}]`);
console.log(`Total Trie Nodes: ${trie.totalNodes}`);
console.log(`Root branches: [${Array.from(trie.root.children.keys()).join(", ")}]`);

// --- Snippet 2: Aho-Corasick BFS Failure Links ---
export interface ACNode {
  id: number;
  children: Map<string, ACNode>;
  fail: ACNode | null;
  dictSuffix: ACNode | null;
  patterns: string[];
}

export function buildAhoCorasick(keywords: string[]): ACNode {
  let nodeIdCounter = 0;
  const root: ACNode = {
    id: nodeIdCounter++,
    children: new Map(),
    fail: null,
    dictSuffix: null,
    patterns: [],
  };

  // 1. Build Trie
  for (const word of keywords) {
    let curr = root;
    for (const ch of word) {
      if (!curr.children.has(ch)) {
        curr.children.set(ch, {
          id: nodeIdCounter++,
          children: new Map(),
          fail: null,
          dictSuffix: null,
          patterns: [],
        });
      }
      curr = curr.children.get(ch)!;
    }
    curr.patterns.push(word);
  }

  // 2. BFS Failure Links
  const queue: ACNode[] = [];
  for (const [, child] of root.children) {
    child.fail = root;
    queue.push(child);
  }

  while (queue.length > 0) {
    const curr = queue.shift()!;

    for (const [ch, child] of curr.children) {
      let fallback = curr.fail;
      while (fallback && !fallback.children.has(ch)) {
        fallback = fallback.fail;
      }
      child.fail = fallback ? fallback.children.get(ch)! : root;

      // Dictionary Suffix Link: nearest ancestor with matched patterns
      if (child.fail.patterns.length > 0) {
        child.dictSuffix = child.fail;
      } else {
        child.dictSuffix = child.fail.dictSuffix;
      }

      queue.push(child);
    }
  }

  return root;
}

console.log("\n=== Snippet 2: Aho-Corasick Failure Links ===");
const acRoot = buildAhoCorasick(dictionary);
console.log("Aho-Corasick Automaton Root initialized with failure links.");

// --- Snippet 3: Searching with Dictionary Suffix Links ---
export interface MatchOccurrence {
  pattern: string;
  startIndex: number;
  endIndex: number;
}

export function searchAhoCorasick(root: ACNode, text: string): MatchOccurrence[] {
  const matches: MatchOccurrence[] = [];
  let curr = root;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    while (curr !== root && !curr.children.has(ch)) {
      curr = curr.fail!;
    }

    curr = curr.children.get(ch) ?? root;

    // Direct patterns at current node
    for (const pat of curr.patterns) {
      matches.push({
        pattern: pat,
        startIndex: i - pat.length + 1,
        endIndex: i,
      });
    }

    // Follow dictionary suffix links for overlapping patterns
    let dictNode = curr.dictSuffix;
    while (dictNode) {
      for (const pat of dictNode.patterns) {
        matches.push({
          pattern: pat,
          startIndex: i - pat.length + 1,
          endIndex: i,
        });
      }
      dictNode = dictNode.dictSuffix;
    }
  }

  return matches;
}

console.log("\n=== Snippet 3: Multi-Pattern Search ===");
const corpus = "ushers";
const searchResults = searchAhoCorasick(acRoot, corpus);
console.log(`Corpus: "${corpus}"`);
for (const match of searchResults) {
  console.log(`  -> Match '${match.pattern}' at [${match.startIndex}..${match.endIndex}]`);
}

// --- Snippet 4: DFA Transition Matrix Compilation ---
export class AhoCorasickDFA {
  public transitionMatrix: Map<string, number>[] = [];
  public matchOutputs: string[][] = [];

  constructor(keywords: string[]) {
    const root = buildAhoCorasick(keywords);
    // Collect all nodes in BFS order to assign continuous IDs
    const allNodes: ACNode[] = [];
    const queue: ACNode[] = [root];
    const visited = new Set<number>();

    while (queue.length > 0) {
      const node = queue.shift()!;
      if (visited.has(node.id)) continue;
      visited.add(node.id);
      allNodes.push(node);

      for (const [, child] of node.children) {
        queue.push(child);
      }
    }

    // Map each node ID to continuous matrix row index
    const idToIdx = new Map<number, number>();
    allNodes.forEach((node, idx) => idToIdx.set(node.id, idx));

    // Alphabet: distinct characters across all keywords
    const alphabet = new Set<string>();
    for (const kw of keywords) {
      for (const ch of kw) alphabet.add(ch);
    }

    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      const row = new Map<string, number>();

      for (const ch of alphabet) {
        let dest: ACNode | null = node;
        while (dest && !dest.children.has(ch) && dest !== root) {
          dest = dest.fail;
        }
        const nextNode = dest?.children.get(ch) ?? root;
        row.set(ch, idToIdx.get(nextNode.id)!);
      }
      this.transitionMatrix.push(row);

      // Collect all output patterns for this state
      const patterns: string[] = [...node.patterns];
      let dictNode = node.dictSuffix;
      while (dictNode) {
        patterns.push(...dictNode.patterns);
        dictNode = dictNode.dictSuffix;
      }
      this.matchOutputs.push(patterns);
    }
  }

  public scan(text: string): { pattern: string; index: number }[] {
    const results: { pattern: string; index: number }[] = [];
    let state = 0;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const nextState = this.transitionMatrix[state]?.get(ch) ?? 0;
      state = nextState;

      for (const pat of this.matchOutputs[state]) {
        results.push({ pattern: pat, index: i - pat.length + 1 });
      }
    }
    return results;
  }
}

console.log("\n=== Snippet 4: Compiled DFA Execution ===");
const dfa = new AhoCorasickDFA(dictionary);
console.log(`Compiled DFA states: ${dfa.transitionMatrix.length}`);
const dfaMatches = dfa.scan("ushers");
console.log(`DFA scanned "ushers" with ${dfaMatches.length} matches found.`);

// --- Snippet 5: Enterprise DLP / PII Content Redactor ---
export interface SensitiveRule {
  term: string;
  category: "PII" | "SECRET" | "COMPLIANCE";
}

export interface RedactionResult {
  redactedText: string;
  violationsFound: number;
  auditLog: { term: string; category: string; position: number }[];
}

export class AhoCorasickDLPFilter {
  private root: ACNode;
  private ruleMap = new Map<string, string>();

  constructor(rules: SensitiveRule[]) {
    const terms = rules.map((r) => r.term);
    this.root = buildAhoCorasick(terms);
    rules.forEach((r) => this.ruleMap.set(r.term, r.category));
  }

  public inspectAndRedact(content: string, maskChar = "*"): RedactionResult {
    const matches = searchAhoCorasick(this.root, content);
    if (matches.length === 0) {
      return { redactedText: content, violationsFound: 0, auditLog: [] };
    }

    const chars = content.split("");
    const auditLog: { term: string; category: string; position: number }[] = [];

    for (const match of matches) {
      const category = this.ruleMap.get(match.pattern) ?? "UNKNOWN";
      auditLog.push({
        term: match.pattern,
        category,
        position: match.startIndex,
      });

      // Mask sensitive characters
      for (let k = match.startIndex; k <= match.endIndex; k++) {
        chars[k] = maskChar;
      }
    }

    return {
      redactedText: chars.join(""),
      violationsFound: matches.length,
      auditLog,
    };
  }
}

console.log("\n=== Snippet 5: Enterprise DLP Redaction Engine ===");
const dlpRules: SensitiveRule[] = [
  { term: "CONFIDENTIAL_PROJECT_TITAN", category: "SECRET" },
  { term: "AWS_SECRET_KEY_PROD", category: "SECRET" },
  { term: "john.doe@enterprise.com", category: "PII" },
  { term: "SSN_987654321", category: "COMPLIANCE" },
];

const dlpFilter = new AhoCorasickDLPFilter(dlpRules);
const payload = "Incident report for john.doe@enterprise.com regarding CONFIDENTIAL_PROJECT_TITAN leaked on slack.";
const dlpResult = dlpFilter.inspectAndRedact(payload);
console.log(`Original: "${payload}"`);
console.log(`Redacted: "${dlpResult.redactedText}"`);
console.log(`Violations detected: ${dlpResult.violationsFound}`);
for (const log of dlpResult.auditLog) {
  console.log(`  -> Detected [${log.category}] "${log.term}" at position ${log.position}`);
}
