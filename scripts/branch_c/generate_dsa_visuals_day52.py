# scripts/branch_c/generate_dsa_visuals_day52.py
import json
import hashlib
import os

with open("scripts/branch_c/day52_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Multi pattern string matching evaluates streaming target text.",
        "say2": "Prefix tree merges common prefixes collapsing redundant storage.",
        "example": "Search system traverses prefix tree pointers locating matching products.",
        "tryIt": "Examine typescript code checking prefix existence and trie lookup."
    },
    # Part 2
    {
        "say1": "Automaton constructs failure links across multiple dictionary patterns.",
        "say2": "Failure link connects node to longest proper suffix in dictionary trie.",
        "example": "Network intrusion detection monitors packet payloads for substrings.",
        "tryIt": "Examine typescript code establishing failure links across patterns."
    },
    # Part 3
    {
        "say1": "Pattern matching algorithm follows transitions and output collection.",
        "say2": "Output link optimization prevents traversal overhead of failure links.",
        "example": "Sentiment analysis classifier scans customer reviews extracting keywords.",
        "tryIt": "Examine typescript code collecting matches and following transitions."
    },
    # Part 4
    {
        "say1": "Dynamic cloud platforms update security signatures in active traffic.",
        "say2": "Dynamic architecture maintains double buffering avoiding lock contention.",
        "example": "Data loss prevention service updates compliance policy signatures.",
        "tryIt": "Examine typescript code compiling dynamic pattern failure links."
    },
    # Part 5
    {
        "say1": "Enterprise cybersecurity engine inspects cloud application gateways.",
        "say2": "Automaton eliminates sequential evaluation latency spikes and overhead.",
        "example": "Enterprise gateway intercepts injection payload logging security alert.",
        "tryIt": "Explore security threats evaluating attack payload and telemetry metrics."
    }
]

titles = [
    "Prefix Trie Common Ancestry and Keyword Retrieval Model.",
    "Aho Corasick Breadth First Failure Link Suffix Tree.",
    "Output Link Optimization and Multi Pattern Search Model.",
    "Dynamic Automaton Rebuffering and Double Array Matrix.",
    "Enterprise Cloud Web Application Firewall Defense Model."
]

columns_list = [
    ["Prefix Node Level", "Character Edge Branch", "Shared Subtree Factor"],
    ["Automaton Node State", "BFS Queue Discovery", "Longest Proper Suffix"],
    ["Streaming Character", "Active Match State", "Direct Output Discovery"],
    ["Dynamic Rule Buffer", "Compilation Phase", "Memory Array Layout"],
    ["Inspection Category", "Compiled Threat Pattern", "Automaton Enforcement"]
]

rows_list = [
    [
        ["Root Prefix Frontier", "Single Character Transition", "Common Stem Compression"],
        ["Terminal Word Leaf", "Flagged Acceptance State", "Deterministic Word Match"]
    ],
    [
        ["Root Direct Child", "Immediate Root Linkage", "Single Character Prefix"],
        ["Deeper Automaton Node", "BFS Suffix Evaluation", "Longest Valid Fallback"]
    ],
    [
        ["Inbound Payload Octet", "State Machine Transition", "Non Backtracking Advance"],
        ["Terminal Accepting State", "Compressed Output Link", "Instant Pattern Match"]
    ],
    [
        ["Active Inspection Engine", "Immutable Lock Free Graph", "High Throughput Scan"],
        ["Shadow Compiler Queue", "Asynchronous BFS Rebuild", "Atomic Pointer Swap"]
    ],
    [
        ["SQL Injection Vulnerability", "Union Select Signature", "Immediate TCP Disconnect"],
        ["Script Injection Vector", "Cross Site Tag Pattern", "Security Alert Emitted"]
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
    "day": 52,
    "promptSha": "dsa-optim-day-52-aho-corasick-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-52.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
