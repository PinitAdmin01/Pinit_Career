# scripts/branch_c/build_day39_full.py
import json

part1_say = [
    "Welcome to Day 39 of Advanced Data Structures and Algorithmic Optimization. Today we enter the domain of multi-pattern dictionary matching, one of the most critical algorithmic disciplines in modern enterprise computing. In single-pattern search algorithms such as Knuth-Morris-Pratt, Boyer-Moore, or the Z-algorithm, our objective was locating occurrences of one pattern P of length M inside a text T of length N in O(N + M) time. However, in enterprise firewall inspection, automated content moderation, antivirus signature detection, and biological genomics, systems do not search for one isolated pattern. Instead, they must simultaneously search for thousands or even millions of distinct target patterns against continuous, high-volume data streams.",
    "Consider the catastrophic computational cost of applying single-pattern algorithms to the multi-pattern search problem. Suppose our dictionary contains K distinct keywords whose total length across all words is M. If we naively iterate over each pattern individually, running K separate KMP or Z-algorithm scans across a text T of length N, the aggregate time complexity explodes to O(K times N + M). In a modern deep packet inspection firewall monitoring a ten-gigabit network link with a signature database of fifty thousand threat rules, scanning every incoming packet fifty thousand times is physically impossible, resulting in catastrophic packet dropping and server failure.",
    "The initial step toward scalable multi-pattern search is organizing the dictionary into a Trie, also known as a prefix tree or digital search tree. In a Trie, common prefixes among dictionary keywords are merged into shared sequences of tree edges. The root node represents the empty string. Every directed edge represents a single character from the alphabet, and every path from the root to an interior or leaf node represents a prefix of one or more keywords. Nodes corresponding to the terminal character of a keyword are marked with an end-of-word flag or store a pointer to the matched pattern. This compact hierarchical representation eliminates redundant prefix storage and enables rapid prefix lookups.",
    "However, a standard Trie alone is insufficient for streaming substring discovery. If we attempt to search a text T by traversing the Trie starting at text index zero, we might advance several characters deep into the tree before encountering a character mismatch. When a mismatch occurs, a naive Trie traversal has no mechanism for state retention: it must reset its search pointer back to the root and advance the text index by one, re-evaluating characters from scratch. In the worst case, searching a text of length N with a Trie containing overlapping repetitive keywords requires O(N times L_max) operations, where L_max is the maximum pattern length. To overcome this limitation, we need an automaton that never rewinds text pointers.",
    "Today we master the legendary Aho-Corasick algorithm, published by Alfred Aho and Margaret Corasick in 1975. By augmenting a standard keyword Trie with precomputed failure transitions and dictionary suffix links, Aho-Corasick converts a static prefix tree into a fully autonomous finite state machine. The resulting automaton processes input text in strictly linear time proportional to the length of the text plus the number of matches found, completely independent of the number of dictionary keywords. Whether the dictionary contains ten words or one million words, the text is scanned in a single forward pass without a single character re-examination."
]

part1_code = """export interface TrieNode {
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

const dictionary = ["he", "she", "his", "hers"];
const trie = buildTrie(dictionary);
console.log(`Dictionary: [${dictionary.join(", ")}]`);
console.log(`Total Trie Nodes: ${trie.totalNodes}`);
console.log(`Root branches: [${Array.from(trie.root.children.keys()).join(", ")}]`);"""

part1_output = """Dictionary: [he, she, his, hers]
Total Trie Nodes: 10
Root branches: [h, s]"""

part1_example = "Consider an enterprise network security appliance inspecting live packet streams for a cluster of malicious domain names and URL parameters. The threat intelligence feed provides twenty thousand suspicious hostnames that must be identified in incoming web requests. By organizing the hostnames into a keyword trie, the network gateway unifies prefix lookups into a single structured memory graph, completing batch validation across incoming payload buffers without quadratic iteration."

part1_tryIt = "Examine the buildTrie function implementation below. Trace how each keyword is inserted character by character, creating child nodes only when a branch does not already exist. Notice how shared prefixes such as 'he' and 'hers' reuse the initial branch nodes. Run the script with test dictionary words and inspect the total node count and root branches printed to the console."

part1_check = {
    "question": "Why is scanning a text of length N against a dictionary of K keywords using K separate single-pattern string matching runs unacceptable for real-time systems?",
    "options": [
        "Because running K separate scans requires O(K times N + M) total time, which causes severe latency spikes and CPU exhaustion on large dictionaries",
        "Because single-pattern algorithms cannot process strings containing ASCII characters greater than 127",
        "Because the memory footprint of single-pattern algorithms scales exponentially with the number of CPU cores",
        "Because single-pattern algorithms require hashing the entire text into 64-bit integer blocks before scanning"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Running K individual scans multiplies the text length N by the number of patterns K. For large dictionaries (e.g., 50,000 firewall rules), O(K * N) operations degrade throughput by orders of magnitude, making real-time streaming inspection impossible."
}

part2_say = [
    "In Part 2, we construct the core theoretical engine of the Aho-Corasick automaton: Breadth-First Search (BFS) failure links. Recall from yesterday's study of the Knuth-Morris-Pratt algorithm how the prefix failure function pi[i] identified the longest proper border of a single pattern prefix, allowing the search pointer to jump backward without rescanning matched text characters. The Aho-Corasick failure link generalizes this exact principle from a single linear string to a branching tree of strings. For every node u in the keyword Trie, its failure link fail(u) points to the unique node v in the Trie that represents the longest proper suffix of the string represented by u.",
    "To understand why failure links must be computed in breadth-first order (level by level), consider the dependencies of the failure function. The failure link of a node at depth d depends exclusively on the failure links of nodes at depth d minus 1 or less. Formally, for the root node (depth 0), the failure link is undefined or points to itself. For all immediate children of the root (depth 1), representing single-character prefixes, their only proper suffix is the empty string; therefore, their failure links point directly to the root node. These depth-1 nodes are pushed into a standard FIFO queue to seed the breadth-first traversal.",
    "During the BFS traversal, when processing a node curr from the queue, we compute the failure links for all of its children. For each child node representing transition character ch, let us determine where its failure link should point. We examine the failure link of its parent, setting fallback equals curr.fail. If the node fallback does not have an outgoing edge labeled with character ch, we iteratively follow fallback equals fallback.fail until we find an ancestor that possesses a child labeled ch, or until fallback becomes null. If such an ancestor is found, the child's failure link is assigned to that ancestor's child for character ch; otherwise, the failure link defaults to the root node.",
    "This elegant construction guarantees that every failure transition points to the deepest possible node in the Trie whose prefix matches a suffix of the current path. Furthermore, notice how the failure transitions create an implicit directed acyclic graph (DAG) superimposed on top of the original Trie hierarchy. When an incoming text stream matches characters along a Trie path and then encounters an unexpected character, the search pointer follows the failure link. The pointer does not return to the root; instead, it transitions to the longest valid partial match that could potentially lead to a complete keyword occurrence.",
    "The computational complexity of constructing failure links across the entire Trie is strictly linear in the total number of Trie nodes, which is bounded above by the sum of lengths of all keywords M. Because each edge traversal during failure link construction is amortized against the depth of nodes in the Trie, the entire precomputation step completes in O(M) time and O(M) auxiliary space. Once constructed, the failure links ensure that text characters are never re-evaluated, establishing the foundation for wire-speed multi-pattern matching."
]

part2_code = """export interface ACNode {
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

const dictionary = ["he", "she", "his", "hers"];
const acRoot = buildAhoCorasick(dictionary);
console.log("Aho-Corasick Automaton Root initialized with failure links.");"""

part2_output = """Aho-Corasick Automaton Root initialized with failure links."""

part2_example = "In an enterprise antivirus endpoint scanner, security agents inspect executable binary headers against thousands of malware family signatures. When scanning memory buffers, if a sequence of bytes partially matches a Trojan signature and then diverges, the Aho-Corasick failure link redirects the scan state to alternative overlapping exploit signatures without restarting the binary scan from byte zero, sustaining full system performance during background audits."

part2_tryIt = "Inspect the buildAhoCorasick function below. Observe how the breadth-first search queue processes nodes layer by layer, assigning failure links for children by chasing fallback pointers. Notice how depth-one nodes are linked directly to the root before the main loop begins. Run the script and confirm that the automaton initializes successfully."

part2_check = {
    "question": "In the Aho-Corasick automaton, what does the failure link fail(u) of a Trie node u represent?",
    "options": [
        "The unique node in the Trie that represents the longest proper suffix of the string represented by node u",
        "The parent node of node u in the original keyword Trie hierarchy",
        "The node representing the lexicographically smallest keyword in the dictionary",
        "The root node of the inverted suffix tree for the text corpus"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "By definition, the failure link fail(u) points to the node in the Trie corresponding to the longest proper suffix of the string represented by u. This ensures the automaton preserves the maximum matched context when a mismatch occurs."
}

part3_say = [
    "In Part 3, we address a subtle yet critical performance challenge in multi-pattern dictionary matching: detecting overlapping patterns that terminate simultaneously. Suppose our dictionary contains the words 'she' and 'he'. When the text contains the sequence 'she', notice that at the moment character 'e' is processed, both the pattern 'she' and the pattern 'he' match the text! The word 'he' is a proper suffix of the word 'she'. If our automaton only checks whether the current Trie node is marked as an end-of-word, it will successfully emit 'she', but completely fail to discover 'he'!",
    "A naive solution to this problem traverses the entire chain of failure links backwards from the current node at every single character of the text, inspecting whether any failure ancestor represents a completed pattern. However, this naive failure traversal ruins our linear time guarantee! In adversarial cases where the dictionary contains many nested patterns (such as 'a', 'aa', 'aaa', 'aaaa'), traversing the failure chain at every character can consume O(depth) steps per text character, degrading overall search performance to O(N times L_max).",
    "To eliminate this overhead and preserve strict linear efficiency, Aho and Corasick introduced Dictionary Suffix Links, also referred to as Output Links or Compressed Suffix Links. For any node u, its dictionary suffix link dictSuffix(u) points directly to the nearest node along its failure chain that represents an actual completed dictionary keyword. If no node along the failure chain represents a keyword, dictSuffix(u) is null. During the BFS construction phase, computing dictionary suffix links requires just one conditional check: if child.fail has patterns, child.dictSuffix equals child.fail; otherwise, child.dictSuffix equals child.fail.dictSuffix. This memoization takes O(1) time per node!",
    "With dictionary suffix links in place, reporting all matching patterns becomes optimal and proportional to the actual number of occurrences. When the search pointer reaches node curr after reading text character text[i], it immediately outputs all patterns directly stored at curr. Then, it follows the dictionary suffix link chain, emitting completed patterns at each hop, until reaching null. Because every hop along the dictionary suffix link chain yields at least one valid matched pattern, the total time spent traversing output links across the entire text is strictly O(K), where K is the total number of matches found.",
    "Consequently, the total execution time of the Aho-Corasick search algorithm is strictly O(N + K), where N is the length of the text and K is the total count of reported match occurrences. This is provably optimal: any search algorithm must read the text of length N at least once, and any reporting algorithm must spend at least O(1) time emitting each of the K matches. Even when searching hundreds of thousands of keywords across multi-gigabyte log archives, Aho-Corasick guarantees deterministic linear throughput with zero worst-case degradation."
]

part3_code = """export interface MatchOccurrence {
  pattern: string;
  startIndex: number;
  endIndex: number;
}

export function searchAhoCorasick(root: any, text: string): MatchOccurrence[] {
  const matches: MatchOccurrence[] = [];
  let curr = root;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    while (curr !== root && !curr.children.has(ch)) {
      curr = curr.fail!;
    }

    curr = curr.children.get(ch) ?? root;

    for (const pat of curr.patterns) {
      matches.push({
        pattern: pat,
        startIndex: i - pat.length + 1,
        endIndex: i,
      });
    }

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

const acRoot = buildAhoCorasick(["he", "she", "his", "hers"]);
const corpus = "ushers";
const searchResults = searchAhoCorasick(acRoot, corpus);
console.log(`Corpus: "${corpus}"`);
for (const match of searchResults) {
  console.log(`  -> Match '${match.pattern}' at [${match.startIndex}..${match.endIndex}]`);
}"""

part3_output = """Corpus: "ushers"
  -> Match 'she' at [1..3]
  -> Match 'he' at [2..3]
  -> Match 'hers' at [2..5]"""

part3_example = "In an enterprise e-discovery platform analyzing millions of corporate emails during legal compliance investigations, attorneys specify sets of overlapping keywords such as 'fraud', 'wire fraud', and 'auditing'. The search engine uses dictionary suffix links to ensure that when an email mentions 'wire fraud', both the specific phrase 'wire fraud' and the broader term 'fraud' are simultaneously indexed in a single linear pass."

part3_tryIt = "Examine the searchAhoCorasick function below. Trace how the loop iterates through the corpus 'ushers'. Notice how at index 3 (character 'e' in 'she'), the direct pattern 'she' is emitted, and immediately following the dictionary suffix link emits 'he'. Run the script and observe all three overlapping matches printed with exact indices."

part3_check = {
    "question": "What is the primary architectural purpose of Dictionary Suffix Links (Output Links) in the Aho-Corasick algorithm?",
    "options": [
        "To jump directly to the nearest failure ancestor that represents a completed keyword, ensuring output traversal time is proportional to actual matches O(K)",
        "To sort dictionary keywords into lexicographical order for binary search lookups",
        "To compress the Trie memory footprint by converting node pointers into 16-bit relative integer offsets",
        "To enable backward text scanning similar to the Boyer-Moore bad character heuristic"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Dictionary suffix links bypass non-terminal failure ancestors and jump directly to nodes representing completed patterns. This bounds output reporting time to O(K) where K is the number of reported matches, preventing O(depth) worst-case overhead per character."
}

part4_say = [
    "In Part 4, we elevate our Aho-Corasick implementation from an interpreted pointer-chasing graph into a high-performance compiled Deterministic Finite Automaton (DFA). While the standard Aho-Corasick tree with failure links achieves amortized linear time O(N), individual character transitions can occasionally take multiple steps as the while loop chases fallback failure pointers. In latency-sensitive networking environments—such as 100-Gbps software-defined switches, DPDK packet parsers, or high-frequency trading gateways—amortized latency is unacceptable; systems require deterministic worst-case O(1) transition guarantees per byte.",
    "To achieve strict O(1) transition guarantees, we compile the Aho-Corasick automaton into a dense transition matrix. For an automaton with S states and an alphabet of size Sigma, the transition matrix delta is a 2D array of dimensions S times Sigma. For every state s and character c, delta[s][c] stores the exact state to which the automaton transitions upon reading character c. If state s possesses an explicit Trie child labeled c, delta[s][c] points directly to that child. Crucially, if state s lacks an explicit transition for c, delta[s][c] is precomputed to point directly to delta[fail(s)][c].",
    "Let us analyze the profound architectural impact of this precomputation. By pre-resolving all failure transitions into the transition table, the runtime search loop completely eliminates the while (curr !== root && !curr.children.has(ch)) fallback loop! At runtime, processing an incoming character ch becomes a single contiguous memory dereference: nextState equals delta[currentState][ch]. There are no dynamic hash map lookups, no pointer dereferences across fragmented heap nodes, and zero branch mispredictions. The CPU instruction pipeline executes a predictable load, index, and branch sequence that modern hardware can execute in a single clock cycle.",
    "Furthermore, we pre-aggregate all matching keyword outputs for each state. During compilation, each state s is associated with a flat array containing its direct patterns plus all patterns reachable via its dictionary suffix link chain. Consequently, when the runtime engine enters state s, it can immediately read the precomputed output list without following pointer chains. This design decouples the complex graph topology from the runtime execution loop, producing an ultra-fast execution kernel suitable for compilation to WebAssembly, C/C++ native modules, or FPGA hardware lookup tables.",
    "In terms of memory footprint optimization, enterprise DFA compilers employ alphabet reduction and sparse matrix compression techniques. When searching for ASCII text patterns, the alphabet size is 256. For large dictionaries with tens of thousands of states, a naive 2D array might consume significant RAM. By mapping the active alphabet to only the unique characters appearing in the dictionary, and utilizing row-displacement compression (similar to the classic Aho-Ullman table compression), the transition matrix can be compacted by up to 90 percent, fitting entirely within the L2 or L3 cache of modern server processors."
]

part4_code = """export class AhoCorasickDFA {
  public transitionMatrix: Map<string, number>[] = [];
  public matchOutputs: string[][] = [];

  constructor(keywords: string[]) {
    const root = buildAhoCorasick(keywords);
    const allNodes: any[] = [];
    const queue: any[] = [root];
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

    const idToIdx = new Map<number, number>();
    allNodes.forEach((node, idx) => idToIdx.set(node.id, idx));

    const alphabet = new Set<string>();
    for (const kw of keywords) {
      for (const ch of kw) alphabet.add(ch);
    }

    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      const row = new Map<string, number>();

      for (const ch of alphabet) {
        let dest: any = node;
        while (dest && !dest.children.has(ch) && dest !== root) {
          dest = dest.fail;
        }
        const nextNode = dest?.children.get(ch) ?? root;
        row.set(ch, idToIdx.get(nextNode.id)!);
      }
      this.transitionMatrix.push(row);

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

const dfa = new AhoCorasickDFA(["he", "she", "his", "hers"]);
console.log(`Compiled DFA states: ${dfa.transitionMatrix.length}`);
const dfaMatches = dfa.scan("ushers");
console.log(`DFA scanned "ushers" with ${dfaMatches.length} matches found.`);"""

part4_output = """Compiled DFA states: 10
DFA scanned "ushers" with 3 matches found."""

part4_example = "In an enterprise network packet broker operating on forty-gigabit fiber backbones, hardware FPGA chips and high-speed network interface cards (NICs) use compiled Aho-Corasick transition matrices. By eliminating pointer chasing and while loops, each network packet byte is processed in a single clock cycle, enabling deterministic line-rate deep packet inspection without packet buffering latency."

part4_tryIt = "Review the AhoCorasickDFA class below. Observe how the constructor precomputes state transitions for every character in the alphabet, pre-resolving fallback links into next-state coordinates. Notice how the runtime scan method executes a single state lookup per character. Run the code and verify that the compiled DFA scans the input with exact match results."

part4_check = {
    "question": "What is the primary advantage of compiling the Aho-Corasick automaton into a dense Deterministic Finite Automaton (DFA) transition matrix?",
    "options": [
        "It guarantees strictly worst-case O(1) transition time per text byte by precomputing failure fallbacks into direct matrix lookups with zero runtime while loops",
        "It eliminates the need to specify the alphabet size or character encoding during construction",
        "It automatically compresses the input text using Lempel-Ziv compression during the search pass",
        "It converts non-deterministic regular expressions into context-free grammars"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "A compiled DFA precomputes all failure transitions into a single lookup table. At runtime, each character transition is a single table lookup in strictly O(1) worst-case time, eliminating runtime fallback loops and branch mispredictions."
}

part5_say = [
    "In Part 5, we culminate Day 39 by engineering an enterprise-grade Data Loss Prevention (DLP) and Content Moderation engine: the AhoCorasickDLPFilter. In modern enterprise cloud architectures, corporate communications traverse multiple channels including Slack, Microsoft Teams, email gateways, customer support ticketing systems, and API endpoints. Organizations face severe legal, financial, and regulatory penalties under GDPR, HIPAA, and PCI-DSS if sensitive customer Personally Identifiable Information (PII), confidential API credentials, secret project codenames, or employee Social Security numbers leak into public channels.",
    "Our AhoCorasickDLPFilter encapsulates the complete Aho-Corasick automaton into an industrial inspection and sanitization pipeline. The filter accepts a comprehensive policy rulebook containing thousands of sensitive keywords classified into categories such as 'PII', 'SECRET', and 'COMPLIANCE'. When inspecting incoming text payloads, the filter executes a single linear-time sweep across the character stream, detects all policy violations regardless of keyword length or overlap, masks the sensitive character spans with configurable redaction characters (such as asterisks), and generates structured tamper-evident audit logs.",
    "Let us examine how the DLP filter resolves overlapping and adjacent sensitive tokens. Suppose an employee sends an incident message containing both an email address 'john.doe@enterprise.com' and a confidential initiative codename 'CONFIDENTIAL_PROJECT_TITAN'. Because both strings reside in the compiled automaton dictionary, the Aho-Corasick scanner identifies both starting offsets and ending boundaries in a single contiguous forward pass. To prevent corrupting overlapping masks, the redactor performs in-place character replacement on an underlying character array before emitting the sanitized payload.",
    "In production cloud deployments, the AhoCorasickDLPFilter is deployed as an API gateway filter or Envoy proxy WebAssembly (Wasm) plugin. In this architecture, all outbound HTTP request bodies and WebSocket message frames pass through the filter before leaving the corporate perimeter. Because the Aho-Corasick algorithm guarantees deterministic linear throughput with zero heap allocation per character during the scan pass, the filter introduces sub-millisecond latency overhead, allowing hundreds of thousands of concurrent chat messages to be inspected and redacted in real time.",
    "To support continuous threat intelligence updates without service disruption, enterprise implementations decouple policy compilation from runtime evaluation. Using read-copy-update (RCU) synchronization patterns, background worker threads can compile updated rule dictionaries into new Aho-Corasick DFAs and atomically swap the active root pointer in shared memory. This zero-downtime architecture ensures that newly discovered leaked credentials or updated compliance terms are enforced across global clusters within seconds of detection.",
    "Furthermore, the structured violation records generated by the filter feed directly into enterprise Security Information and Event Management (SIEM) platforms like Splunk and Google Cloud Chronicle. By reporting the exact term, policy category, and character offset alongside metadata like user ID and IP address, security operations center (SOC) teams can immediately triage data leakage incidents, revoke compromised credentials, and demonstrate rigorous compliance during regulatory audits."
]

part5_code = """export interface SensitiveRule {
  term: string;
  category: "PII" | "SECRET" | "COMPLIANCE";
}

export interface RedactionResult {
  redactedText: string;
  violationsFound: number;
  auditLog: { term: string; category: string; position: number }[];
}

export class AhoCorasickDLPFilter {
  private root: any;
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
}"""

part5_output = """Original: "Incident report for john.doe@enterprise.com regarding CONFIDENTIAL_PROJECT_TITAN leaked on slack."
Redacted: "Incident report for *********************** regarding ************************** leaked on slack."
Violations detected: 2
  -> Detected [PII] "john.doe@enterprise.com" at position 20
  -> Detected [SECRET] "CONFIDENTIAL_PROJECT_TITAN" at position 54"""

part5_example = "In an enterprise financial trading platform, communication compliance software monitors outbound chat rooms for unauthorized disclosure of non-public financial information and employee personal identifiers. The AhoCorasickDLPFilter intercepts message streams in real time, redacting sensitive trading desk terms and routing flagged payloads to compliance officers for immediate forensic review."

part5_tryIt = "Examine the AhoCorasickDLPFilter class below. Follow how the constructor compiles sensitive keyword rules into the automaton, and observe how inspectAndRedact performs multi-token character masking while preserving non-sensitive characters. Run the code and examine the original versus redacted output and the structured audit log."

part5_check = {
    "question": "How does the AhoCorasickDLPFilter maintain sub-millisecond line-rate inspection across high-concurrency corporate messaging streams?",
    "options": [
        "By executing a single linear-time forward pass O(N + K) over character streams without rescanning text or incurring heap allocations per character",
        "By hashing text payloads with MD5 and querying distributed caching clusters across the network",
        "By translating input text into regular expressions with backtracking capture groups",
        "By applying neural network transformer models with multi-head self-attention on every message"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The Aho-Corasick automaton guarantees strictly linear O(N + K) search time over the input text, completely independent of dictionary size. In-place character array replacement avoids runtime allocations, sustaining sub-millisecond latency."
}

# Root projectStep & summary
project_step = {
    "title": "Industrial Case Study: High-Throughput Enterprise Data Loss Prevention (DLP) & PII Redaction Gateway",
    "steps": [
        "Construct a keyword Trie merging shared prefixes across extensive enterprise sensitive dictionaries in O(M) time.",
        "Implement Breadth-First Search (BFS) failure links mapping deepest proper suffixes to eliminate text pointer backtracking.",
        "Engineer Dictionary Suffix Links (output links) to guarantee output traversal is strictly proportional to actual matches O(K).",
        "Compile the automaton into a dense Deterministic Finite Automaton (DFA) transition matrix for deterministic O(1) byte shifts.",
        "Deploy the production AhoCorasickDLPFilter pipeline to execute real-time PII redaction and audit reporting across live message streams."
    ]
}

summary = [
    "Single-pattern search algorithms degrade to O(K * N) when applied to multi-pattern dictionaries with K keywords.",
    "A Trie unifies dictionary keywords into a shared prefix tree in O(M) time, eliminating redundant character storage.",
    "The Aho-Corasick automaton augments a Trie with BFS failure links pointing to the longest proper suffix of each state.",
    "Dictionary Suffix Links compress output reporting paths, ensuring matching completes in optimal O(N + K) time.",
    "Compiling the automaton into a DFA transition table provides worst-case O(1) transition time per byte with zero branch mispredictions.",
    "The AhoCorasickDLPFilter delivers line-rate PII redaction and compliance auditing across high-throughput enterprise communication channels."
]

# Assemble day39 lesson dictionary
day39_lesson = {
    "day": 39,
    "coursePrefix": "dsa-optim",
    "title": "Multi-Pattern Search & Dictionary Matching: Aho-Corasick Automaton with Failure Links & Dictionary Suffix Links",
    "minutes": 38,
    "parts": [
        {
            "title": "Multi-Pattern Search Problem, Keyword Trees (Trie) & Limits of Linear Single-Pattern Scans",
            "say": part1_say,
            "example": part1_example,
            "tryIt": part1_tryIt,
            "code": part1_code,
            "output": part1_output,
            "codeNotes": [
                {"line": 2, "note": "Define TrieNode interface with child map, end-of-word boolean flag, and pattern."},
                {"line": 10, "note": "Initialize root node with unique ID 0 and empty character map."},
                {"line": 15, "note": "Insert characters creating child nodes only when the prefix branch does not exist."},
                {"line": 19, "note": "Mark terminal node of word as end-of-word and record pattern string."},
                {"line": 26, "note": "Build sample dictionary trie and inspect total node count and branch topology."}
            ],
            "check": part1_check
        },
        {
            "title": "The Aho-Corasick Automaton: Trie Construction, Breadth-First Failure Links",
            "say": part2_say,
            "example": part2_example,
            "tryIt": part2_tryIt,
            "code": part2_code,
            "output": part2_output,
            "codeNotes": [
                {"line": 2, "note": "Define ACNode interface extending trie node with failure link and dictionary suffix link."},
                {"line": 34, "note": "Initialize BFS queue with depth-one children, linking their failure pointers to root."},
                {"line": 42, "note": "For each child, chase parent's failure link fallback chain until matching character is found."},
                {"line": 46, "note": "Assign child's failure link to the longest valid proper suffix node in the tree."},
                {"line": 49, "note": "Memoize dictionary suffix link to the nearest failure ancestor containing a matched pattern."}
            ],
            "check": part2_check
        },
        {
            "title": "Output Compression via Dictionary Suffix Links & Amortized O(N + M + K) Traversal",
            "say": part3_say,
            "example": part3_example,
            "tryIt": part3_tryIt,
            "code": part3_code,
            "output": part3_output,
            "codeNotes": [
                {"line": 7, "note": "Define searchAhoCorasick accepting compiled automaton root and input text string."},
                {"line": 14, "note": "Follow failure links when current node lacks child for incoming text character."},
                {"line": 18, "note": "Transition to child node or fall back to root, advancing text position."},
                {"line": 20, "note": "Collect direct pattern occurrences matching at the current automaton node."},
                {"line": 29, "note": "Traverse dictionary suffix links to collect all overlapping suffix patterns in O(K) time."}
            ],
            "check": part3_check
        },
        {
            "title": "High-Throughput Automaton Compilation: Deterministic Finite Automaton (DFA) Transition Matrices",
            "say": part4_say,
            "example": part4_example,
            "tryIt": part4_tryIt,
            "code": part4_code,
            "output": part4_output,
            "codeNotes": [
                {"line": 2, "note": "AhoCorasickDFA compiles graph into dense transition matrix for O(1) byte shifts."},
                {"line": 11, "note": "Collect all nodes via BFS to assign contiguous zero-based state matrix row indices."},
                {"line": 36, "note": "Precompute next state for every alphabet character, resolving fallback failure links."},
                {"line": 43, "note": "Pre-aggregate combined pattern output lists for each state to eliminate pointer chasing."},
                {"line": 56, "note": "Execute runtime scan with single matrix dereference per character without while loops."}
            ],
            "check": part4_check
        },
        {
            "title": "Enterprise Application: Real-Time Content Moderation, PII Redaction & Data Loss Prevention (DLP) Engine",
            "say": part5_say,
            "example": part5_example,
            "tryIt": part5_tryIt,
            "code": part5_code,
            "output": part5_output,
            "codeNotes": [
                {"line": 11, "note": "Define AhoCorasickDLPFilter class compiling multi-category sensitive policy rules."},
                {"line": 22, "note": "Execute linear Aho-Corasick search identifying all PII and secret term boundaries."},
                {"line": 37, "note": "Perform in-place character masking over character array to prevent mask corruption."},
                {"line": 43, "note": "Emit sanitized payload alongside structured audit log detailing detected violations."},
                {"line": 57, "note": "Instantiate DLP filter with enterprise compliance rules and redact sensitive payload."}
            ],
            "check": part5_check
        }
    ],
    "projectStep": project_step,
    "summary": summary
}

with open("scripts/branch_c/day39_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day39_lesson, f, indent=2)
print("day39_lesson.json successfully generated.")
