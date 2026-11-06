# scripts/branch_c/generate_dsa_visuals_day39.py
import json
import hashlib
import os

with open("scripts/branch_c/day39_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Keyword trie organizes dictionary vocabulary into prefix search trees.",
        "say2": "Linear dictionary scanning incurs heavy computational overhead.",
        "example": "Network firewall inspects packet streams for malicious attack patterns.",
        "tryIt": "Prefix trie structures dictionary keywords across connected tree nodes."
    },
    # Part 2
    {
        "say1": "Automaton constructs failure links using breadth first search traversal.",
        "say2": "Fallback links redirect failed transitions to longest proper suffixes.",
        "example": "Antivirus scanner correlates malware definitions across binary payloads.",
        "tryIt": "Breadth first queue configures automaton fallback pointers seamlessly."
    },
    # Part 3
    {
        "say1": "Dictionary suffix links compress output paths for overlapping matches.",
        "say2": "Amortized linear traversal bounds search time across text corpuses.",
        "example": "Distributed search engine matches multiword entity phrases in documents.",
        "tryIt": "Dictionary suffix chains discover all overlapping pattern occurrences."
    },
    # Part 4
    {
        "say1": "Compiled deterministic automaton eliminates latency during transitions.",
        "say2": "Dense transition matrix precomputes state shifts for character sets.",
        "example": "Network packet broker processes streaming traffic across hardware switches.",
        "tryIt": "Compiled transition matrix executes state shifts with zero branch delays."
    },
    # Part 5
    {
        "say1": "Content moderation engine redacts sensitive information from text data.",
        "say2": "Compliance filter generates structured audit records for security teams.",
        "example": "Financial trading platform monitors outbound chats for compliance.",
        "tryIt": "Inspection filter compiles sensitive keyword rules for masking."
    }
]

titles = [
    "Keyword Prefix Trie Hierarchy.",
    "Aho-Corasick Breadth First Failure Machine.",
    "Dictionary Suffix Link Output Matrix.",
    "Compiled Deterministic Finite Transition Table.",
    "Enterprise Data Loss Prevention Engine."
]

columns_list = [
    ["Trie Node Level", "Character Edge", "Prefix State"],
    ["Automaton State", "Failure Pointer", "Operational Effect"],
    ["Current State", "Output Link Target", "Traversal Bound"],
    ["Current DFA State", "Input Byte Value", "Transition Execution"],
    ["Policy Category", "Inspection Scope", "Compliance Action"]
]

rows_list = [
    [
        ["Root Vertex", "Initial Branches", "Empty String Baseline"],
        ["Interior Node", "Character Transition", "Shared Substring Prefix"]
    ],
    [
        ["Depth One Nodes", "Root Node Fallback", "Single Character Suffix"],
        ["Deeper States", "Longest Proper Suffix", "Zero Pointer Backtracking"]
    ],
    [
        ["Terminal Pattern Node", "Immediate Pattern Match", "Constant Time Emission"],
        ["Internal Branch State", "Nearest Terminal Ancestor", "Proportional Match Scan"]
    ],
    [
        ["Active State Index", "Direct Character Transition", "Single Cycle Matrix Shift"],
        ["Fallback Target State", "Precomputed Failure Matrix", "Zero Loop Latency Bound"]
    ],
    [
        ["Personally Identifiable Info", "Inbound Message Stream", "In Place Character Redaction"],
        ["Confidential Credentials", "Outbound Transit Payloads", "Tamper Evident Audit Log"]
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
    "day": 39,
    "promptSha": "dsa-optim-day-39-aho-corasick-dlp-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-39.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
