# scripts/branch_c/generate_dsa_visuals_day54.py
import json
import hashlib
import os

with open("scripts/branch_c/day54_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Suffix automaton represents smallest deterministic finite automaton.",
        "say2": "Suffix automaton collapses distinct substrings into linear states.",
        "example": "Shared endpos positions merge substrings in suffix automaton state.",
        "tryIt": "Examine typescript code initializing root state and suffix link."
    },
    # Part 2
    {
        "say1": "Incremental online construction algorithm builds suffix automaton.",
        "say2": "Extending automaton traces suffix link chain establishing transition.",
        "example": "State cloning splits transitions preserving deterministic invariant.",
        "tryIt": "Examine typescript code handling state cloning and adding transitions."
    },
    # Part 3
    {
        "say1": "Suffix link tree forms directed tree representing suffix tree duality.",
        "say2": "Suffix link tree is structurally isomorphic to reversed suffix tree.",
        "example": "Propagating occurrence counts along suffix links in topological pass.",
        "tryIt": "Examine typescript code aggregating occurrence counts in link tree."
    },
    # Part 4
    {
        "say1": "Suffix automaton executes pattern substring queries in optimal time.",
        "say2": "Pattern search follows character transitions extracting occurrence count.",
        "example": "Summing state length intervals counts distinct substrings in memory.",
        "tryIt": "Examine typescript code counting distinct substrings and pattern queries."
    },
    # Part 5
    {
        "say1": "Bioinformatics infrastructure indexes viral genomes for surveillance.",
        "say2": "Suffix automaton indexes genomic sequences for fast motif queries.",
        "example": "Genomic indexer locates viral mutation motifs and genomic locus.",
        "tryIt": "Explore gene indexer evaluating viral genome motifs and locus coordinates."
    }
]

titles = [
    "Suffix Automaton Right Context Equivalence Model.",
    "Incremental Linear Suffix Automaton State Extension.",
    "Suffix Link Tree Ukkonen Suffix Tree Duality Model.",
    "Distinct Substrings And Constant Time Query Matrix.",
    "Enterprise Planetary Genomic Sequence Indexing Fabric."
]

columns_list = [
    ["Subtree Equivalence Class", "Right Context Endpos Set", "State Memory Representation"],
    ["Extension Stage Token", "Transition Creation Phase", "Automaton Clone Boundary"],
    ["Link Tree Parent Node", "Topological Depth Level", "Subtree Occurrence Sum"],
    ["Query Substring Pattern", "State Machine Transition", "Occurrence Locus Discovery"],
    ["Genomic Target Motif", "Identified Locus Position", "Biological Surveillance Output"]
]

rows_list = [
    [
        ["Canonical Suffix Class", "Identical Ending Positions", "Compressed State Vertex"],
        ["Disjoint Right Context", "Hierarchical Partition", "Minimal Deterministic Bound"]
    ],
    [
        ["Online Character Extension", "Unwound Backward Link Chain", "Direct Transition Insertion"],
        ["State Splitting Fork", "Duplicated Forward Pointers", "Preserved Equivalence Class"]
    ],
    [
        ["Directed Suffix Parent", "Longest Proper Suffix Target", "Isomorphic Reversed Tree"],
        ["Topological Order Queue", "Bottom Up Count Accumulation", "Exact Endpos Cardinality"]
    ],
    [
        ["Search Pattern Traversal", "Deterministic Character Step", "Instant Substring Discovery"],
        ["Non Terminal Exit Point", "Immediate Rejection Notice", "Zero Backtracking Overhead"]
    ],
    [
        ["Pathogen Mutation Signature", "Exact Genomic Coordinates", "Line Rate Variant Alert"],
        ["Regulatory Promoter Motif", "Conserved Locus Frequency", "Diagnostic Primer Target"]
    ]
]

entries = []

for idx, part in enumerate(lesson["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_data[idx]
    title = titles[idx]
    cols = columns_list[idx]
    rows = rows_list[idx]

    steps = [
        {
            "at": "say1",
            "caption": caps["say1"],
            "rows": rows
        },
        {
            "at": "say2",
            "caption": caps["say2"],
            "rows": rows
        },
        {
            "at": "example",
            "caption": caps["example"],
            "rows": rows
        },
        {
            "at": "tryIt",
            "caption": caps["tryIt"],
            "rows": rows
        }
    ]

    filled_obj = {
        "template": "table",
        "title": title,
        "columns": cols,
        "steps": steps
    }

    entry = {
        "partTitle": part["title"],
        "codeHash": code_hash,
        "filled": filled_obj,
        "spec": filled_obj
    }
    entries.append(entry)

envelope = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 54,
    "promptSha": "dsa-optim-day-54-suffix-automaton-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-54.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
