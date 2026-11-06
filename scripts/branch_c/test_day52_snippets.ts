// scripts/branch_c/test_day52_snippets.ts

// --- Part 1: Prefix Trie Foundations ---
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  wordCount: number = 0;
}

class PrefixTrie {
  root: TrieNode = new TrieNode();

  insert(word: string): void {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) {
        curr.children.set(char, new TrieNode());
      }
      curr = curr.children.get(char)!;
    }
    curr.isEndOfWord = true;
    curr.wordCount++;
  }

  search(word: string): boolean {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) return false;
      curr = curr.children.get(char)!;
    }
    return curr.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children.has(char)) return false;
      curr = curr.children.get(char)!;
    }
    return true;
  }
}

const trie = new PrefixTrie();
['apple', 'app', 'apply', 'banana'].forEach(w => trie.insert(w));
console.log('--- Part 1: Prefix Trie ---');
console.log('Search "app":', trie.search('app'));
console.log('Search "appl":', trie.search('appl'));
console.log('StartsWith "appl":', trie.startsWith('appl'));
console.log('StartsWith "ban":', trie.startsWith('ban'));
console.log('Search "orange":', trie.search('orange'));

// --- Part 2: BFS Failure Links ---
interface ACNode {
  id: number;
  char: string;
  children: Map<string, ACNode>;
  fail: ACNode | null;
  output: string[];
}

function createACNode(id: number, char: string = ''): ACNode {
  return { id, char, children: new Map(), fail: null, output: [] };
}

let nodeCounter = 0;
const acRoot = createACNode(nodeCounter++);

function acInsert(root: ACNode, pattern: string): void {
  let curr = root;
  for (const c of pattern) {
    if (!curr.children.has(c)) {
      curr.children.set(c, createACNode(nodeCounter++, c));
    }
    curr = curr.children.get(c)!;
  }
  curr.output.push(pattern);
}

function buildFailureLinks(root: ACNode): void {
  const queue: ACNode[] = [];
  root.fail = root;

  for (const child of root.children.values()) {
    child.fail = root;
    queue.push(child);
  }

  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const [char, child] of curr.children.entries()) {
      let fallback = curr.fail;
      while (fallback !== root && !fallback!.children.has(char)) {
        fallback = fallback!.fail;
      }
      if (fallback!.children.has(char) && fallback!.children.get(char) !== child) {
        child.fail = fallback!.children.get(char)!;
      } else {
        child.fail = root;
      }
      // Inherit output
      child.output = child.output.concat(child.fail.output);
      queue.push(child);
    }
  }
}

['he', 'she', 'his', 'hers'].forEach(p => acInsert(acRoot, p));
buildFailureLinks(acRoot);
console.log('--- Part 2: BFS Failure Links ---');
console.log('Root children:', Array.from(acRoot.children.keys()).join(', '));
console.log('Total AC nodes created:', nodeCounter);

// --- Part 3: Output Link Optimization & Multi-Pattern Search ---
interface ACMatch {
  pattern: string;
  index: number;
}

function acSearch(root: ACNode, text: string): ACMatch[] {
  const matches: ACMatch[] = [];
  let curr = root;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    while (curr !== root && !curr.children.has(char)) {
      curr = curr.fail!;
    }
    curr = curr.children.get(char) || root;

    for (const pat of curr.output) {
      matches.push({ pattern: pat, index: i - pat.length + 1 });
    }
  }

  return matches;
}

const sampleMatches = acSearch(acRoot, 'ushers');
console.log('--- Part 3: Multi-Pattern Search ---');
console.log('Matches in "ushers":', sampleMatches.map(m => `${m.pattern}@${m.index}`).join(', '));

// --- Part 4: Dynamic Rule Ingestion & Trie Statistics ---
class DynamicAhoCorasick {
  root: ACNode = createACNode(0);
  counter: number = 1;
  compiled: boolean = false;
  patterns: Set<string> = new Set();

  addPattern(pattern: string): void {
    if (this.patterns.has(pattern)) return;
    this.patterns.add(pattern);
    let curr = this.root;
    for (const c of pattern) {
      if (!curr.children.has(c)) {
        curr.children.set(c, createACNode(this.counter++, c));
      }
      curr = curr.children.get(c)!;
    }
    curr.output.push(pattern);
    this.compiled = false;
  }

  compile(): void {
    buildFailureLinks(this.root);
    this.compiled = true;
  }

  getStats(): { patternCount: number; nodeCount: number; isCompiled: boolean } {
    return {
      patternCount: this.patterns.size,
      nodeCount: this.counter,
      isCompiled: this.compiled
    };
  }
}

const dynAc = new DynamicAhoCorasick();
['api', 'auth', 'admin', 'user', 'token'].forEach(p => dynAc.addPattern(p));
dynAc.compile();
console.log('--- Part 4: Dynamic AC Stats ---');
console.log('Stats:', JSON.stringify(dynAc.getStats()));

// --- Part 5: Enterprise AhoCorasickWafEngine ---
interface WafThreat {
  signature: string;
  category: 'SQL_INJECTION' | 'XSS' | 'PATH_TRAVERSAL' | 'COMMAND_INJECTION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

interface WafAlert {
  signature: string;
  category: string;
  severity: string;
  position: number;
}

class AhoCorasickWafEngine {
  private root: ACNode = createACNode(0);
  private nodeCounter: number = 1;
  private ruleMap: Map<string, WafThreat> = new Map();
  private compiled: boolean = false;
  private totalPayloadsScanned: number = 0;
  private totalThreatsBlocked: number = 0;

  registerRule(threat: WafThreat): void {
    const norm = threat.signature.toLowerCase();
    this.ruleMap.set(norm, threat);

    let curr = this.root;
    for (const char of norm) {
      if (!curr.children.has(char)) {
        curr.children.set(char, createACNode(this.nodeCounter++, char));
      }
      curr = curr.children.get(char)!;
    }
    curr.output.push(norm);
    this.compiled = false;
  }

  compile(): void {
    buildFailureLinks(this.root);
    this.compiled = true;
  }

  scanPayload(payload: string): { isClean: boolean; alerts: WafAlert[] } {
    if (!this.compiled) this.compile();
    this.totalPayloadsScanned++;

    const alerts: WafAlert[] = [];
    const text = payload.toLowerCase();
    let curr = this.root;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      while (curr !== this.root && !curr.children.has(char)) {
        curr = curr.fail!;
      }
      curr = curr.children.get(char) || this.root;

      for (const sig of curr.output) {
        const meta = this.ruleMap.get(sig);
        if (meta) {
          alerts.push({
            signature: sig,
            category: meta.category,
            severity: meta.severity,
            position: i - sig.length + 1
          });
        }
      }
    }

    if (alerts.length > 0) this.totalThreatsBlocked++;
    return { isClean: alerts.length === 0, alerts };
  }

  getMetrics(): { scanned: number; blocked: number; rules: number; nodes: number } {
    return {
      scanned: this.totalPayloadsScanned,
      blocked: this.totalThreatsBlocked,
      rules: this.ruleMap.size,
      nodes: this.nodeCounter
    };
  }
}

const waf = new AhoCorasickWafEngine();
waf.registerRule({ signature: 'SELECT', category: 'SQL_INJECTION', severity: 'CRITICAL' });
waf.registerRule({ signature: 'UNION', category: 'SQL_INJECTION', severity: 'CRITICAL' });
waf.registerRule({ signature: '<script>', category: 'XSS', severity: 'HIGH' });
waf.registerRule({ signature: '../', category: 'PATH_TRAVERSAL', severity: 'HIGH' });
waf.registerRule({ signature: 'eval(', category: 'COMMAND_INJECTION', severity: 'CRITICAL' });
waf.compile();

const attackPayload = 'POST /login HTTP/1.1\\r\\nHost: api.enterprise.internal\\r\\nUser-Agent: Mozilla\\r\\n\\r\\nusername=admin&query=1 UNION SELECT password FROM users';
const res = waf.scanPayload(attackPayload);
console.log('--- Part 5: WAF Engine Simulation ---');
console.log('Payload clean?', res.isClean);
console.log('Threat alerts detected:', res.alerts.length);
res.alerts.forEach(a => console.log(`Alert: [${a.severity}] ${a.category} (${a.signature}) at offset ${a.position}`));
console.log('WAF Metrics:', JSON.stringify(waf.getMetrics()));
