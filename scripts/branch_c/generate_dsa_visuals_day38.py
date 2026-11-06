# scripts/branch_c/generate_dsa_visuals_day38.py
import json
import hashlib
import os

with open("scripts/branch_c/day38_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Linear string processing computes prefix overlap arrays in linear time.",
        "say2": "Active reference interval eliminates quadratic nested string comparisons.",
        "example": "Database compiler indexes product inventory codes using prefix filters.",
        "tryIt": "Interval pointers maintain active window avoiding redundant comparisons."
    },
    # Part 2
    {
        "say1": "Pattern matching identifies exact substring occurrences in linear time.",
        "say2": "Unique sentinel character bounds search window preventing overflow.",
        "example": "Intrusion detection firewall scans packet buffers for attack signatures.",
        "tryIt": "Concatenated string separates search pattern using delimiter character."
    },
    # Part 3
    {
        "say1": "Algorithmic duality maps prefix functions into linear array metrics.",
        "say2": "Prefix border hierarchy captures structural string periodicity.",
        "example": "Distributed search engine converts string metrics for index optimization.",
        "tryIt": "Linear conversion sweep propagates border lengths across string indices."
    },
    # Part 4
    {
        "say1": "Approximate string matching tolerates substitution errors in text data.",
        "say2": "Dual forward backward scans evaluate candidate windows in linear time.",
        "example": "Contract transcription pipeline locates noisy clauses with error bounds.",
        "tryIt": "Forward and backward arrays identify single mismatch mutation offsets."
    },
    # Part 5
    {
        "say1": "Clinical variant scanner aligns sequencing reads against reference loci.",
        "say2": "Genomic scanner packages structured mutation records for diagnostics.",
        "example": "Cancer sequencing pipeline detects genetic alterations with confidence.",
        "tryIt": "Variant scanner emits structured mutation reports from sequencing reads."
    }
]

titles = [
    "Linear Z-Box Geometric State Machine.",
    "Concatenated Pattern Matching Pipeline.",
    "Equivalence and Duality Matrix.",
    "Dual Z-Array Approximate Matcher.",
    "Genomic Sequence Variant Scanner."
]

columns_list = [
    ["Index Position", "Relative Geometric State", "Amortized Action"],
    ["Sequence Segment", "Delimiter Role", "Match Detection"],
    ["Representation Type", "Structural Perspective", "Runtime Transformation"],
    ["Scanning Direction", "Evaluation Target", "Invariant Condition"],
    ["Sequence Element", "Clinical Interpretation", "Diagnostic Pipeline"]
]

rows_list = [
    [
        ["Index Outside Box", "No Prior Knowledge", "Explicit Compare Loop"],
        ["Index Inside Box", "Mirrored Value Cached", "Direct Constant Time Copy"]
    ],
    [
        ["Pattern Prefix", "Sentinel Prevents Overlap", "Pattern Length Bound"],
        ["Text Body", "Exact Occurrence Filter", "Instant Match Discovery"]
    ],
    [
        ["Prefix Function Pi", "Backward Border Suffix", "Linear Invariant Sweep"],
        ["Z-Array Metric", "Forward Substring Span", "Two Phase Conversion"]
    ],
    [
        ["Forward Z-Array", "Longest Common Prefix", "Mismatch Offset Detection"],
        ["Backward Z-Array", "Longest Common Suffix", "Hamming Distance Bound"]
    ],
    [
        ["Reference Assembly", "Chromosomal Locus Mapping", "Deterministic Alignment"],
        ["Sequencing Read", "Single Nucleotide Variant", "Confidence Score Calibration"]
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
    "day": 38,
    "promptSha": "dsa-optim-day-38-z-algorithm-lcp-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-38.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
