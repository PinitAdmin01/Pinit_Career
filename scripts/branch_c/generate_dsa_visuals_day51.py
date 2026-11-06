# scripts/branch_c/generate_dsa_visuals_day51.py
import json
import hashlib
import os

with open("scripts/branch_c/day51_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Advanced data structures mark algorithmic string matching foundations.",
        "say2": "Pathological naive string search exhibits backward rewinding behavior.",
        "example": "Cloud parser searches log files without backtracking latency spikes.",
        "tryIt": "Examine typescript code computing longest proper border prefix array."
    },
    # Part 2
    {
        "say1": "Knuth Morris Pratt pattern matching engine executes optimal linear scan.",
        "say2": "Prefix function shifts pattern forward without rewinding text pointer.",
        "example": "Intrusion detection monitor inspects streaming serial telemetry bytes.",
        "tryIt": "Examine typescript code tracing pattern matches and text pointer advances."
    },
    # Part 3
    {
        "say1": "Linear string processing framework computes longest prefix substrings.",
        "say2": "Active comparison window maintains prefix match inside boundary.",
        "example": "Bioinformatics analyzer identifies exact genomic motif occurrences.",
        "tryIt": "Examine typescript code computing active values with sentinel delimiter."
    },
    # Part 4
    {
        "say1": "Theoretical duality between prefix function and string periodicity.",
        "say2": "Shortest period extracted directly from final value of prefix table.",
        "example": "Digital modem receiver detects periodic synchronization frame headers.",
        "tryIt": "Examine typescript code extracting fundamental period and repeat unit."
    },
    # Part 5
    {
        "say1": "Industrial cybersecurity engine inspects packet payloads for signatures.",
        "say2": "Deep packet inspection engine evaluates multiple threat signatures.",
        "example": "Enterprise firewall precompiles signatures blocking malicious payloads.",
        "tryIt": "Explore security signatures inspecting request payload and matched threats."
    }
]

titles = [
    "Knuth Morris Pratt Prefix Function Table Construction.",
    "Linear Time Knuth Morris Pratt Pattern Scanning Model.",
    "Dan Gusfield Linear Z Box String Processing Formulation.",
    "String Periodicity Power and Dual Compression Matrix.",
    "Enterprise Deep Packet Inspection Cybersecurity Engine."
]

columns_list = [
    ["Prefix Character Index", "Longest Proper Border", "Fallback Failure Link"],
    ["Pattern Search State", "Text Pointer Advancement", "Linear Amortized Step"],
    ["Active Box Frontier", "Longest Prefix Match", "Sentinel Separation Rule"],
    ["Repeating Period Unit", "String Power Exponent", "Extracted Minimal Root"],
    ["Packet Inspection Rule", "Compiled Automaton State", "Cyber Defense Output"]
]

rows_list = [
    [
        ["Initial Prefix Character", "Zero Length Border", "Direct Root Fallback"],
        ["Repeating Suffix Factor", "Extended Border Length", "Preserved State Index"]
    ],
    [
        ["Unidirectional Forward Pass", "Strict Monotonic Advance", "Constant Time Step"],
        ["Character Mismatch Event", "Prefix Pointer Unwind", "Zero Text Backtrack"]
    ],
    [
        ["Current Box Left Bound", "Cached Prefix Substring", "Inner Window Match"],
        ["Current Box Right Bound", "Boundary Extension Scan", "Sentinel Reset Shift"]
    ],
    [
        ["Harmonic Period Block", "Integer Power Division", "Minimal Run Length"],
        ["Fractional Residual Tail", "Prefix Border Suffix", "Compressed Symbol Set"]
    ],
    [
        ["Binary Protocol Signature", "Precompiled State Array", "Line Rate Inspection"],
        ["Hostile Injection Pattern", "Linear Automaton Match", "Immediate Packet Drop"]
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
    "day": 51,
    "promptSha": "dsa-optim-day-51-kmp-z-algo-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-51.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
