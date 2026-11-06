import json
import hashlib
import os

with open("scripts/branch_c/day36_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Large scale genomic comparisons execute constant time substring checks.",
        "say2": "String polynomial hash maps character values into finite modulus.",
        "example": "Cloud platform indexing pipeline analyzes millions of code tokens.",
        "tryIt": "Hasher precomputes powers producing distinct substring fingerprints."
    },
    # Part 2
    {
        "say1": "Single hash comparisons risk silent data corruption on distinct strings.",
        "say2": "Birthday paradox triggers collisions across finite hash space.",
        "example": "Enterprise security gateway inspects packet payloads without false alarms.",
        "tryIt": "Double string hasher extracts dual hash tuples for distinct phrases."
    },
    # Part 3
    {
        "say1": "Rabin Karp locates pattern occurrences within text without quadratic cost.",
        "say2": "Sliding window updates rolling hash as trailing character enters.",
        "example": "Database firewall scans incoming network packets for injection strings.",
        "tryIt": "Searcher matches pattern hash finding all motif occurrences cleanly."
    },
    # Part 4
    {
        "say1": "Hashing accelerates longest common prefix and palindrome queries.",
        "say2": "Binary search evaluates suffix equality across prefix length intervals.",
        "example": "Genomic engine identifies palindromic hairpin repeats in chromosome.",
        "tryIt": "String oracle computes longest common prefix and checks radar symmetry."
    },
    # Part 5
    {
        "say1": "Genomic sequencing pipeline deduplicates nucleotide fragments.",
        "say2": "Oracle maps nucleotide alphabet to dense integers with dual prime bases.",
        "example": "Oncology pipeline detects repetitive promoter duplications across genome.",
        "tryIt": "Suite extracts duplicate genomic promoters and confirms exact match."
    }
]

table_steps_data = [
    # Part 1
    {
        "columns": ["Sub-String Range", "Polynomial Formula", "Evaluated Hash"],
        "rows_step1": [["Prefix Range s[0..2]", "Horner Polynomial mod m", "1024 Hash Token"], ["Prefix Range s[4..6]", "Horner Polynomial mod m", "1024 Hash Token"]],
        "rows_step2": [["Shifted Range s[1..3]", "Exponent Aligned Subtraction", "1956 Hash Token"], ["Full String s[0..6]", "Base 31 Modulo 10^9+7", "Composite Value"]],
        "rows_step3": [["Source Code Block A", "Linear Prefix Accumulator", "Deterministic ID"], ["Source Code Block B", "Independent Function Token", "Identical Fingerprint"]],
        "rows_step4": [["Precomputed Powers", "Modular Power Array", "Sub-nanosecond Fetch"], ["Arbitrary Substring", "O(1) Modular Arithmetic", "Immediate Verification"]]
    },
    # Part 2
    {
        "columns": ["Hash Configuration", "Prime Modulus", "Collision Immunity"],
        "rows_step1": [["Single Prime Hash", "10^9+7 Modulus", "50% Risk at 37k Keys"], ["Single Non-Prime", "2^64 Unsigned Overflow", "Vulnerable to Exploit"]],
        "rows_step2": [["Double Hash Mod 1", "1,000,000,007 Prime", "First Parallel Coordinate"], ["Double Hash Mod 2", "1,000,000,009 Prime", "Second Parallel Coordinate"]],
        "rows_step3": [["Dual Coordinate Pair", "Combined 10^18 Space", "Collision Safe >1B Keys"], ["Threat Inspection", "Dual-Key Exact Match", "Zero False Alarms"]],
        "rows_step4": [["Verification Engine", "Two 64-bit Comparisons", "Sub-microsecond Check"], ["Industrial SLA", "Carrier-grade Protection", "Deterministic Safety"]]
    },
    # Part 3
    {
        "columns": ["Window Metric", "Leading/Trailing Action", "Window Hash Value"],
        "rows_step1": [["Target Pattern P", "Length M Precomputation", "Constant Target Hash"], ["Initial Window 0", "First M Characters", "Initial Window State"]],
        "rows_step2": [["Window Step i -> i+1", "Subtract Leading Char", "Modulo Intermediate"], ["Window Step i -> i+1", "Add Incoming Char", "O(1) Rolling Update"]],
        "rows_step3": [["Network Stream Scan", "100 Gbps Packet Buffer", "Streaming Payload"], ["SQL Injection Rule", "Dual-Hash Pattern Match", "Firewall Intercept"]],
        "rows_step4": [["Verification Pass", "True Positive Confirmation", "Zero False Drops"], ["Search Throughput", "Linear O(N+M) Runtime", "Wire-speed Processing"]]
    },
    # Part 4
    {
        "columns": ["Query Primitive", "Evaluation Routine", "Asymptotic Bound"],
        "rows_step1": [["Forward Hash Range", "Prefix Array Lookup", "O(1) Substring Hash"], ["Reverse Hash Range", "Reversed Prefix Lookup", "O(1) Substring Hash"]],
        "rows_step2": [["Palindrome Check", "H_forward === H_reverse", "Strict O(1) Time"], ["LCP Search Probe", "Binary Search on Length", "O(log N) Time"]],
        "rows_step3": [["Hairpin Stem Loop", "Inverted Repeat Probe", "Palindromic Match"], ["Chromosome Interval", "100k Base Pair Scope", "Sub-millisecond SLA"]],
        "rows_step4": [["Suffix Array Speedup", "LCP-Assisted Mergesort", "O(N log^2 N) Bound"], ["Maximal Palindromes", "Radius Binary Search", "O(N log N) Complete"]]
    },
    # Part 5
    {
        "columns": ["Bio-Informatics Tier", "Algorithmic Primitive", "Operational SLA"],
        "rows_step1": [["DNA Base Encoding", "Dense 1-4 Integer Map", "Entropy Maximization"], ["Coprime Prime Bases", "Bases 5 and 7 Assigned", "Overflow Prevention"]],
        "rows_step2": [["K-Mer Extraction", "Length 10 Sliding Window", "O(1) Rolling Hash"], ["Duplicate Detection", "Hash Map Multi-set Entry", "High Repetition Flag"]],
        "rows_step3": [["Genomic Fragment A", "Offset 0 Promoters", "ATGCGATCGT Identified"], ["Genomic Fragment B", "Offset 32 Promoters", "Exact Match Confirmed"]],
        "rows_step4": [["Oncology Diagnostic", "Translocation Discovery", "Sub-microsecond SLA"], ["Whole-Genome Screen", "Multi-megabase Sequence", "Carrier-grade Pass"]]
    }
]

entries = []

for idx, (caps, tbl) in enumerate(zip(captions_data, table_steps_data)):
    part = lesson["parts"][idx]
    code_hash = hashlib.sha256(part["code"].encode("utf-8")).hexdigest()
    title_short = part["title"][:40]

    spec_obj = {
        "template": "table",
        "title": f"{title_short} Matrix",
        "columns": tbl["columns"],
        "steps": [
            {
                "at": "say1",
                "caption": caps["say1"],
                "rows": tbl["rows_step1"]
            },
            {
                "at": "say2",
                "caption": caps["say2"],
                "rows": tbl["rows_step2"]
            },
            {
                "at": "example",
                "caption": caps["example"],
                "rows": tbl["rows_step3"]
            },
            {
                "at": "tryIt",
                "caption": caps["tryIt"],
                "rows": tbl["rows_step4"]
            }
        ]
    }

    entry = {
        "partTitle": part["title"],
        "codeHash": code_hash,
        "filled": spec_obj,
        "spec": spec_obj
    }
    entries.append(entry)

prompt_str = f"Course dsa-optim Day 36: {lesson['title']}"
prompt_sha = hashlib.sha256(prompt_str.encode("utf-8")).hexdigest()

day_visual = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 36,
    "promptSha": prompt_sha,
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = "src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-36.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day_visual, f, indent=2)

print(f"Generated {out_path} successfully with {len(entries)} entries!")
