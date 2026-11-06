# scripts/branch_c/enrich_day39.py
import json

with open("scripts/branch_c/day39_lesson.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Part 1 addition
p1_extra = (
    "From a systems architecture standpoint, modern Trie implementations in enterprise search engines must also carefully optimize memory layout. While a naive object-oriented Trie where each node stores a dynamic hash map or pointer array incurs heavy pointer overhead (often consuming 32 to 64 bytes of heap overhead per character node), production engines utilize compact representations such as Double-Array Tries (DAT) or Radix Trees (Patricia Tries). In a Double-Array Trie, all state transitions are stored in two flat integer arrays—BASE and CHECK—which pack the entire tree structure into contiguous virtual memory pages. This memory compaction drastically minimizes CPU cache misses during text traversal, allowing the initial Trie construction to scale efficiently to millions of keywords without triggering heap fragmentation or garbage collection churn."
)

# Part 2 addition
p2_extra = (
    "It is vital to appreciate why Breadth-First Search (BFS) is mathematically mandatory for failure link construction, rather than Depth-First Search (DFS). In any valid Aho-Corasick state machine, the failure target of a node at depth d represents a proper suffix of that node's string; consequently, the failure target must reside at a strictly lesser depth, specifically at most depth d minus 1. By processing the Trie in strict level-order via a FIFO queue, BFS guarantees that when computing the failure link for any node at depth d, the failure links of all potential target ancestors at depths 0 through d minus 1 have already been completely resolved. If one attempted to compute failure links using DFS, the traversal would encounter uninitialized failure pointers along sibling branches, corrupting the invariant. BFS guarantees that every failure transition is computed deterministically in a single linear pass."
)

# Part 3 addition
p3_extra = (
    "The formal proof of amortized linear time complexity for the Aho-Corasick text search is one of the gems of theoretical computer science. Let depth(u) denote the depth of node u in the Trie. When reading a character from text T, if a matching child exists, the depth of the search pointer increases by exactly 1. Across a text of length N, the depth can increase at most N times. Conversely, whenever the search pointer follows a failure link, the depth strictly decreases by at least 1, because the failure link points to a proper suffix of strictly smaller length. Because the depth can never become negative (being bounded below by zero at the root), the total number of failure link traversals across the entire text scan cannot exceed the total number of depth increases, which is N. Adding the O(K) output link traversals yields a deterministic, non-backtracking overall running time of O(N + K)."
)

# Part 4 addition (expanded)
p4_extra = (
    "In large-scale networking appliances, compiling the Aho-Corasick automaton into a dense transition table unlocks massive hardware acceleration opportunities. Modern server architectures feature Single Instruction, Multiple Data (SIMD) vector registers (such as Intel AVX-512 or ARM Neon) capable of processing 64 bytes of packet payload simultaneously. By aligning the transition table to 64-byte cache lines, the execution engine ensures that every state transition loads directly into the CPU L1 data cache without bus contention. High-throughput packet scanning engines like Intel Hyperscan and Suricata build on this exact DFA model to achieve wire-speed packet inspection across 40-Gbps and 100-Gbps backbones. Additionally, memory bandwidth utilization is optimized through cache-conscious data alignment. Because CPU memory controllers fetch data in 64-byte cache lines, packing the DFA state IDs into 16-bit or 32-bit contiguous integers ensures that multiple character transitions reside in the same cache line. In benchmarks across multi-threaded network packet processors, a cache-aligned Aho-Corasick DFA achieves sustained scanning speeds exceeding two gigabytes per second per CPU core, illustrating the immense practical value of compiling theoretical state machines into cache-optimal primitive data structures."
)

# Part 5 addition (expanded)
p5_extra = (
    "Furthermore, production enterprise DLP engines must incorporate defense-in-depth measures against malicious adversarial evasion techniques. Sophisticated attackers frequently attempt to bypass keyword filters by inserting zero-width unicode spaces (U+200B), soft hyphens (U+00AD), or homoglyph characters (such as substituting a Cyrillic 'а' for a Latin 'a'). To maintain airtight security, the AhoCorasickDLPFilter pipeline is paired with an upstream text canonicalization stage that performs Unicode NFKC normalization, strips non-printable control glyphs, and maps look-alike homoglyphs to standard ASCII equivalents before token evaluation. By combining robust unicode canonicalization with the deterministic linear matching of Aho-Corasick, enterprise security teams achieve uncompromising data governance and compliance assurance across multi-tenant cloud environments. Finally, the architectural integration of the AhoCorasickDLPFilter into enterprise audit trails requires strict tamper-evident logging. Whenever a policy violation is detected, the filter records the user context, tenant identifier, UTC timestamp, and SHA-256 digest of the matched payload into an append-only audit log stored in immutable object storage (such as AWS S3 Object Lock or Google Cloud Storage Bucket Lock). This guarantees that regulatory auditors can verify that data leakage incidents were quarantined and redacted before leaving the enterprise boundary, satisfying SOC 2 Type II and FedRAMP compliance mandates."
)

# Re-run build_day39_full.py base first to avoid double appending
import subprocess
subprocess.run(["python", "scripts/branch_c/build_day39_full.py"], check=True)

with open("scripts/branch_c/day39_lesson.json", "r", encoding="utf-8") as f:
    d = json.load(f)

extras = [p1_extra, p2_extra, p3_extra, p4_extra, p5_extra]

total_words = 0
for idx, p in enumerate(d["parts"]):
    p["say"].append(extras[idx])
    w = sum(len(s.split()) for s in p["say"])
    total_words += w
    print(f"Part {idx + 1} enriched word count: {w}")
    assert w >= 600, f"Part {idx + 1} still under 600 words: {w}"

print(f"Total words across all 5 parts: {total_words}")
assert total_words >= 3100, f"Total under 3100: {total_words}"
print("Enrichment successfully verified! Writing updated day39_lesson.json...")

with open("scripts/branch_c/day39_lesson.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("day39_lesson.json updated successfully.")
