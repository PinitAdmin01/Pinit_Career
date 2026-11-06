# scripts/branch_c/generate_dsa_visuals_day55.py
import json
import hashlib
import os

with open("scripts/branch_c/day55_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Milestone capstone synthesizes enterprise genomic sequence alignment.",
        "say2": "Engine rapidly aligns sequencing reads against reference genomes.",
        "example": "Diagnostic bioinformatics platform aligns patient sequencing reads.",
        "tryIt": "Examine typescript code modeling chromosome sequences and reads."
    },
    # Part 2
    {
        "say1": "Multi chromosome suffix automaton indexes multiple discrete chromosomes.",
        "say2": "Terminal sentinel delimiters separate chromosome boundaries in automaton.",
        "example": "Suffix automaton traverses transitions translating local coordinate offset.",
        "tryIt": "Examine typescript code indexing chromosomes with coordinate offsets."
    },
    # Part 3
    {
        "say1": "Linear scanning engine performs localized pathogen mutation screening.",
        "say2": "Prefix table encodes longest proper prefix for optimal pattern scanning.",
        "example": "Exact scanner evaluates chromosome identifying locus without backtracking.",
        "tryIt": "Examine typescript code scanning pathogen signatures in linear time."
    },
    # Part 4
    {
        "say1": "Simultaneous multi gene target recognition performs diagnostic screening.",
        "say2": "Constructing trie failure links allows scanning sequence in linear time.",
        "example": "Pipeline screens genomic sequence discovering distinct target occurrences.",
        "tryIt": "Examine typescript code scanning chromosome to report gene targets."
    },
    # Part 5
    {
        "say1": "Enterprise genomic alignment engine coordinates biological processing.",
        "say2": "Engine executes alignment pipeline recording locus coordinates for reads.",
        "example": "Cluster processes patient sequencing reads detecting pathogen signatures.",
        "tryIt": "Explore complete alignment engine coordinating biological workflow trace."
    }
]

titles = [
    "Enterprise Genomic Alignment Architecture Overview.",
    "Multi Chromosome Suffix Automaton State Coordinates.",
    "Linear Scanning Knuth Morris Pratt Pathogen Matcher.",
    "Aho Corasick Multi Target Gene Annotation Engine.",
    "Enterprise Genomic Alignment Pipeline Master Console."
]

columns_list = [
    ["Subsystem Component", "Algorithmic Invariant", "Biological Throughput"],
    ["Chromosome Index Locus", "Global Transition Offset", "Sentinel Delimiter State"],
    ["Pathogen Signature Target", "Prefix Function Length", "Linear Match Position"],
    ["Multi Gene Target Motif", "Aho Corasick Node Depth", "Discovered Locus Coordinate"],
    ["Sequencing Read Token", "Mapped Chromosome Locus", "Annotation Target Status"]
]

rows_list = [
    [
        ["Multi Chromosome Automaton", "Exact Linear Suffix Mapping", "Sub Microsecond Read Match"],
        ["KMP Pathogen Scanner", "Zero Backtracking Scan", "Wire Speed Variant Screen"]
    ],
    [
        ["Reference Chromosome Alpha", "Boundary Sentinel Separator", "Zero Cross Suffix Leak"],
        ["Reference Chromosome Beta", "Local Coordinate Translation", "Exact Endpos Localization"]
    ],
    [
        ["Antibiotic Resistance Gene", "Precomputed Prefix Table", "Deterministic Linear Scan"],
        ["Viral Envelope Signature", "Fail Pointer Shift Step", "Instant Mutation Discovery"]
    ],
    [
        ["CRISPR Cleavage Motif", "Trie State Failure Link", "Simultaneous Multi Match"],
        ["Promoter Regulatory Site", "Trie Output Node Collector", "Parallel Target Screening"]
    ],
    [
        ["Mapped Diagnostic Read", "Chromosome One Coordinate", "High Confidence Alignment"],
        ["Unmapped Novel Sequence", "Zero Reference Transition", "Isolated De Novo Contig"]
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
    "day": 55,
    "promptSha": "dsa-optim-day-55-genomic-alignment-engine",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-55.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
