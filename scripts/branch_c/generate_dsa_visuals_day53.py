# scripts/branch_c/generate_dsa_visuals_day53.py
import json
import hashlib
import os

with open("scripts/branch_c/day53_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Full text suffix indexing enables arbitrary substring queries.",
        "say2": "Suffix tree consumes multiple child pointers inducing memory exhaustion.",
        "example": "Sorted suffixes in suffix array allow binary search query substring.",
        "tryIt": "Examine typescript code sorting suffixes and building suffix array."
    },
    # Part 2
    {
        "say1": "Prefix doubling algorithmic paradigm constructs suffix array sorting.",
        "say2": "Comparing primary and secondary ranks determines suffix relative order.",
        "example": "Search engine indexing code repository uses prefix doubling rank classes.",
        "tryIt": "Examine typescript code inverting suffix array into rank array values."
    },
    # Part 3
    {
        "say1": "Longest common prefix array measures overlap between adjacent suffixes.",
        "say2": "Enhanced suffix array simulates full suffix tree in equivalent time.",
        "example": "Evaluating adjacent suffixes overlap yields longest common prefix array.",
        "tryIt": "Examine typescript code evaluating suffixes in text order with rank."
    },
    # Part 4
    {
        "say1": "Querying longest common prefix between arbitrary suffixes in array.",
        "say2": "Range minimum query evaluates common prefix over static array subarray.",
        "example": "Sparse table range query extracts shared prefix minimum value in array.",
        "tryIt": "Examine typescript code constructing sparse table for range queries."
    },
    # Part 5
    {
        "say1": "Distributed microservices emit cascading error telemetry in cloud scale.",
        "say2": "Suffix arrays perform deep substring deduplication on distributed logs.",
        "example": "Cloud cluster analyzes cascading error flood condensing incident alert.",
        "tryIt": "Explore error signatures isolating maximal repeated templates in streams."
    }
]

titles = [
    "Suffix Array Lexicographical Suffix Indexing Model.",
    "Prefix Doubling Rank Equivalence Class Formation.",
    "Kasai Linear Longest Common Prefix Construction Model.",
    "Sparse Table Range Minimum Query On Suffix Structures.",
    "Enterprise Distributed Log Deduplication Infrastructure."
]

columns_list = [
    ["Suffix Array Offset", "Lexicographical String Suffix", "Physical Memory Allocation"],
    ["Doubling Iteration Step", "Primary Secondary Rank Tuple", "Equivalence Class Resolution"],
    ["Adjacent Sorted Suffix", "Kasai Pointer Invariant", "Longest Common Overlap"],
    ["Sparse Table Power Block", "Interval Range Minimum", "Arbitrary Suffix Overlap"],
    ["Log Ingestion Stream", "Maximal Repeated Pattern", "Telemetry Compaction Ratio"]
]

rows_list = [
    [
        ["Sentinel Terminal Marker", "Sorted Lexicographical Suffix", "Flat Integer Memory Footprint"],
        ["Arbitrary Query Boundary", "Binary Search Range Window", "Sub Microsecond Substring Hit"]
    ],
    [
        ["Initial Single Character", "Base Character Integer Rank", "Initial Equivalent Bucket"],
        ["Doubled Prefix Window", "Combined Integer Pair Rank", "Sorted Suffix Resolution"]
    ],
    [
        ["Lexicographical Predecessor", "Non Resetting Pointer Bound", "Exact Common Character Count"],
        ["Consecutive Sorted Pair", "Amortized Linear Evaluation", "Verified Overlap Array Cell"]
    ],
    [
        ["Power Of Two Subarray", "Interval Minimum Extraction", "Constant Time Query Bound"],
        ["Overlapping Table Lookups", "Combined Interval Union", "Instant Suffix Overlap Value"]
    ],
    [
        ["Repeating Error Flood", "Maximal Suffix Template Peak", "High Ratio Stream Compaction"],
        ["Dynamic Incident Parameter", "Variable Suffix Extraction", "Actionable Root Cause Alert"]
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
    "day": 53,
    "promptSha": "dsa-optim-day-53-suffix-array-lcp-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-53.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
